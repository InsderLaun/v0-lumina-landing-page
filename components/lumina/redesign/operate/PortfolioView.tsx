'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAccount, usePublicClient, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { erc20Abi, formatUnits, parseUnits, type Hex } from 'viem'
import { DEPLOY_BLOCK_SEPOLIA, LUMINA_API_URL } from '@/lib/lumina-config'
import { claimBondAbi, bondVaultAbi, policyManagerV2Abi } from '@/lib/abis/operate'
import { SHIELD_BY_PRODUCT_ID, SHIELDS } from '@/lib/operate/products'
import { getLogsChunked } from '@/lib/getLogsChunked'
import { useContracts } from '@/hooks/use-contracts'
import { LoadError } from './LoadError'
import { BondCard } from './BondCard'

type Tab = 'policies' | 'bonds'

interface PolicyRow {
  productId: Hex
  policyId: bigint
  shieldName: string
  cover: bigint
  premium: bigint
  payout: bigint
  txHash: Hex
  /** Block timestamp the PolicyCreated event was mined at (= shield's startTimestamp). */
  createdAt: bigint
  /** createdAt + shield.durationSeconds — pre-computed at fetch time. */
  expiresAt: bigint
}

interface BondRow {
  epochId: bigint
  faceValue: bigint
  matured: boolean
  maturityTs: bigint
}

export function PortfolioView() {
  const [tab, setTab] = useState<Tab>('policies')
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: contracts } = useContracts()

  const [policies, setPolicies] = useState<PolicyRow[]>([])
  const [policiesLoading, setPoliciesLoading] = useState(false)
  const [policiesErr, setPoliciesErr] = useState<string | null>(null)

  const [userEpochs, setUserEpochs] = useState<bigint[]>([])
  const [bondsErr, setBondsErr] = useState<string | null>(null)

  const [retryToken, setRetryToken] = useState(0)
  const retry = () => setRetryToken((t) => t + 1)

  // ─── Load policies (PolicyCreated events; buyer NOT indexed → filter client-side) ───
  useEffect(() => {
    if (!address || !publicClient || !contracts) {
      setPolicies([])
      return
    }
    let cancelled = false
    setPoliciesLoading(true)
    setPoliciesErr(null)

    ;(async () => {
      try {
        // [API-first] Cached server endpoint reconstructs the wallet's policies
        // server-side — avoids a wide client-side eth_getLogs scan (the cause of
        // "FAILED TO LOAD"). Falls back to the on-chain scan if the API is down.
        try {
          const res = await fetch(`${LUMINA_API_URL}/api/v1/public/policies/${address}`, { cache: 'no-store' })
          if (res.ok) {
            const body = (await res.json()) as {
              policies?: Array<{
                productId: string; policyId: string; coverage: string
                premium: string; payout: string; txHash: string; createdAt: string
              }>
            }
            if (cancelled) return
            const rows: PolicyRow[] = (body.policies ?? []).map((p) => {
              const pid = p.productId as Hex
              const shield = SHIELD_BY_PRODUCT_ID[pid]
              const createdAt = BigInt(Math.floor(new Date(p.createdAt).getTime() / 1000) || 0)
              return {
                productId: pid,
                policyId: BigInt(p.policyId),
                shieldName: shield?.name ?? `Unknown (${pid.slice(0, 10)})`,
                cover: BigInt(p.coverage),
                premium: BigInt(p.premium),
                payout: BigInt(p.payout),
                txHash: p.txHash as Hex,
                createdAt,
                expiresAt: createdAt + BigInt(shield?.durationSeconds ?? 0),
              }
            })
            setPolicies(rows)
            return // success — skip the on-chain scan
          }
        } catch (apiErr) {
          console.warn('[portfolio] policies API failed, falling back to on-chain scan:', apiErr)
        }

        // Fallback: scan PolicyCreated on-chain (legacy path).
        const head = await publicClient.getBlockNumber()
        const logs = await getLogsChunked({
          client: publicClient,
          address: contracts!.policyManager,
          event: {
            type: 'event',
            name: 'PolicyCreated',
            inputs: [
              { name: 'productId', type: 'bytes32', indexed: true },
              { name: 'policyId', type: 'uint256', indexed: true },
              { name: 'buyer', type: 'address', indexed: false },
              { name: 'coverage', type: 'uint256', indexed: false },
              { name: 'premium', type: 'uint256', indexed: false },
              { name: 'payout', type: 'uint256', indexed: false },
            ],
          },
          fromBlock: DEPLOY_BLOCK_SEPOLIA,
          toBlock: head,
        })
        if (cancelled) return
        const ours = (logs as any[]).filter(
          (l) => (l.args.buyer as Hex)?.toLowerCase() === address.toLowerCase(),
        )

        // Batch-fetch block timestamps. PolicyCreated does not include a
        // timestamp field, so we ask each unique block once and reuse.
        const uniqueBlocks = Array.from(new Set(ours.map((l) => l.blockNumber as bigint)))
        const blockEntries = await Promise.all(
          uniqueBlocks.map(async (bn) => {
            const b = await publicClient.getBlock({ blockNumber: bn })
            return [bn.toString(), b.timestamp] as const
          }),
        )
        if (cancelled) return
        const tsByBlock = new Map<string, bigint>(blockEntries)

        const rows: PolicyRow[] = ours.map((l) => {
          const pid = l.args.productId as Hex
          const shield = SHIELD_BY_PRODUCT_ID[pid]
          const createdAt = tsByBlock.get((l.blockNumber as bigint).toString()) ?? 0n
          const expiresAt = createdAt + BigInt(shield?.durationSeconds ?? 0)
          return {
            productId: pid,
            policyId: l.args.policyId as bigint,
            shieldName: shield?.name ?? `Unknown (${pid.slice(0, 10)})`,
            cover: l.args.coverage as bigint,
            premium: l.args.premium as bigint,
            payout: l.args.payout as bigint,
            txHash: l.transactionHash,
            createdAt,
            expiresAt,
          }
        })
        setPolicies(rows)
      } catch (err) {
        console.error('PortfolioView policies getLogs error:', err)
        if (cancelled) return
        setPoliciesErr(err instanceof Error ? err.message.slice(0, 200) : 'Failed to load policies')
      } finally {
        if (!cancelled) setPoliciesLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [address, publicClient, retryToken, contracts])

  // ─── Load user's bond epochs (BondsMinted with `to` indexed) ───
  useEffect(() => {
    if (!address || !publicClient || !contracts) {
      setUserEpochs([])
      return
    }
    let cancelled = false
    setBondsErr(null)

    ;(async () => {
      try {
        // [API-first] Cached server endpoint lists the wallet's bond epochs —
        // avoids a wide client-side eth_getLogs scan. The per-epoch on-chain reads
        // below (balanceOf/isMatured/getEpochInfo) still validate live state.
        try {
          const res = await fetch(`${LUMINA_API_URL}/api/v1/public/bonds/${address}?status=all`, { cache: 'no-store' })
          if (res.ok) {
            const body = (await res.json()) as { bonds?: Array<{ epochId: string }> }
            if (cancelled) return
            const epochs = Array.from(new Set((body.bonds ?? []).map((b) => b.epochId))).map(BigInt)
            setUserEpochs(epochs)
            return // success — skip the on-chain scan
          }
        } catch (apiErr) {
          console.warn('[portfolio] bonds API failed, falling back to on-chain scan:', apiErr)
        }

        // Fallback: scan BondsMinted(to=wallet) on-chain (legacy path).
        const head = await publicClient.getBlockNumber()
        const logs = await getLogsChunked({
          client: publicClient,
          address: contracts!.claimBond,
          event: {
            type: 'event',
            name: 'BondsMinted',
            inputs: [
              { name: 'epochId', type: 'uint256', indexed: true },
              { name: 'to', type: 'address', indexed: true },
              { name: 'usdAmount', type: 'uint256', indexed: false },
            ],
          },
          args: { to: address },
          fromBlock: DEPLOY_BLOCK_SEPOLIA,
          toBlock: head,
        })
        if (cancelled) return
        const epochs = Array.from(
          new Set((logs as any[]).map((l) => (l.args.epochId as bigint).toString())),
        ).map(BigInt)
        setUserEpochs(epochs)
      } catch (err) {
        console.error('PortfolioView bonds getLogs error:', err)
        if (cancelled) return
        setBondsErr(err instanceof Error ? err.message.slice(0, 200) : 'Failed to load bonds')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [address, publicClient, retryToken, contracts])

  // For each user epoch read: balanceOf (= ERC1155 token count = integer dollars,
  // because 1 bond token = $1), isMatured, getEpochInfo (4 outputs: exists,
  // maturity, totalSupply_, matured).
  const bondReadContracts = useMemo(
    () =>
      address
        ? userEpochs.flatMap((epochId) => [
            {
              address: contracts!.claimBond,
              abi: claimBondAbi,
              functionName: 'balanceOf' as const,
              args: [address, epochId] as const,
            },
            {
              address: contracts!.claimBond,
              abi: claimBondAbi,
              functionName: 'isMatured' as const,
              args: [epochId] as const,
            },
            {
              address: contracts!.claimBond,
              abi: claimBondAbi,
              functionName: 'getEpochInfo' as const,
              args: [epochId] as const,
            },
          ])
        : [],
    [address, userEpochs],
  )
  const { data: bondData, refetch: refetchBonds } = useReadContracts({
    contracts: bondReadContracts,
    query: { enabled: bondReadContracts.length > 0 },
  })

  const bonds: BondRow[] = useMemo(() => {
    if (!bondData) return []
    return userEpochs
      .map((epochId, i) => {
        const balance = bondData[i * 3]?.status === 'success' ? (bondData[i * 3].result as bigint) : 0n
        const matured = bondData[i * 3 + 1]?.status === 'success' ? (bondData[i * 3 + 1].result as boolean) : false
        // getEpochInfo returns (exists, maturity, totalSupply_, matured)
        const epochInfo = bondData[i * 3 + 2]?.status === 'success'
          ? (bondData[i * 3 + 2].result as readonly [boolean, bigint, bigint, boolean])
          : null
        return {
          epochId,
          // faceValue is INTEGER DOLLARS (= ERC1155 balance, since 1 token = $1)
          faceValue: balance,
          matured,
          maturityTs: epochInfo?.[1] ?? 0n,
        }
      })
      .filter((b) => b.faceValue > 0n)
      .sort((a, b) => Number(a.maturityTs - b.maturityTs))
  }, [bondData, userEpochs])

  // ─── Per-policy on-chain `triggered` flag ───
  // PolicyManagerV2.policies[productId][policyId].triggered flips true
  // when submitTrigger fires. We must hide those from "Active Policies"
  // (the bond mint replaces the policy as the user's position).
  const policyReadContracts = useMemo(
    () =>
      policies.map((p) => ({
        address: contracts!.policyManager,
        abi: policyManagerV2Abi,
        functionName: 'getPolicy' as const,
        args: [p.productId, p.policyId] as const,
      })),
    [policies],
  )
  const { data: policyOnChain } = useReadContracts({
    contracts: policyReadContracts,
    query: { enabled: policyReadContracts.length > 0 },
  })

  const triggeredKeys = useMemo(() => {
    const set = new Set<string>()
    if (!policyOnChain) return set
    policies.forEach((p, i) => {
      const r = policyOnChain[i]
      if (r?.status !== 'success') return
      const rec = r.result as { triggered: boolean }
      if (rec.triggered) set.add(`${p.productId.toLowerCase()}-${p.policyId.toString()}`)
    })
    return set
  }, [policyOnChain, policies])

  // Active = not yet expired AND not triggered. Re-derived on each render.
  const activePolicies = useMemo(() => {
    const now = BigInt(Math.floor(Date.now() / 1000))
    return policies.filter((p) => {
      if (p.expiresAt === 0n || now >= p.expiresAt) return false
      return !triggeredKeys.has(`${p.productId.toLowerCase()}-${p.policyId.toString()}`)
    })
  }, [policies, triggeredKeys])

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 6 }}>
          /APP/HUMAN/PORTFOLIO
        </div>
        <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--rd-text)', margin: 0 }}>
          Your positions, on-chain.
        </h1>
      </div>

      {!isConnected && (
        <div style={{ padding: 32, background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, textAlign: 'center', color: 'var(--rd-text-2)' }}>
          ⓘ Connect a wallet to see your active policies and bonds.
        </div>
      )}

      {isConnected && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
            <Kpi label="Active policies" value={String(activePolicies.length)} sub={`$${formatBaseUnits(activePolicies.reduce((a, p) => a + p.cover, 0n), 6)} covered`} />
            <Kpi label="Bonds outstanding" value={String(bonds.length)} sub={`$${fmtIntDollars(bonds.reduce((a, b) => a + b.faceValue, 0n))} face`} />
            <Kpi
              label="Redeemable now"
              value={String(bonds.filter((b) => b.matured).length)}
              sub={`$${fmtIntDollars(bonds.filter((b) => b.matured).reduce((a, b) => a + b.faceValue, 0n))}`}
              accent="var(--rd-pos)"
            />
            <Kpi label="Premiums paid" value={`$${formatBaseUnits(policies.reduce((a, p) => a + p.premium, 0n), 6)}`} sub="lifetime" accent="var(--rd-warn)" />
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid var(--rd-line)', marginBottom: 16 }}>
            {(
              [
                { id: 'policies' as Tab, label: 'Active Policies', count: activePolicies.length },
                { id: 'bonds' as Tab, label: 'My Bonds', count: bonds.length },
              ]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '12px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${tab === t.id ? 'var(--rd-accent)' : 'transparent'}`,
                  color: tab === t.id ? 'var(--rd-accent)' : 'var(--rd-text-3)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {t.label}{' '}
                <span style={{ marginLeft: 6, fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-4)' }}>{t.count}</span>
              </button>
            ))}
          </div>

          {tab === 'policies' && (
            <PoliciesTable rows={activePolicies} loading={policiesLoading} err={policiesErr} onRetry={retry} />
          )}
          {tab === 'bonds' && <BondsTable rows={bonds} err={bondsErr} onRetry={retry} onRedeemed={() => refetchBonds()} />}
        </>
      )}
    </div>
  )
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: string }) {
  return (
    <div style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, padding: 14 }}>
      <div style={{ fontSize: 11, color: 'var(--rd-text-3)', fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 500, color: accent ?? 'var(--rd-text)', fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '-0.01em' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--rd-text-3)', marginTop: 4 }}>{sub}</div>
    </div>
  )
}

function PoliciesTable({ rows, loading, err, onRetry }: { rows: PolicyRow[]; loading: boolean; err: string | null; onRetry: () => void }) {
  if (err) return <LoadError message={err} onRetry={onRetry} />
  if (loading) return <Empty>⏳ Loading on-chain policies…</Empty>
  if (rows.length === 0) return <Empty>No active policies. <a href="/app/human/products" style={{ color: 'var(--rd-accent)' }}>Browse shields →</a></Empty>
  return (
    <div style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, overflow: 'hidden' }}>
      <Header cols={['Shield', 'Cover', 'Premium', 'Payout', 'Tx']} weights="1.6fr 1fr 1fr 1fr 1.4fr" />
      {rows.map((r, i) => (
        <Row key={`${r.productId}-${r.policyId}`} last={i === rows.length - 1} weights="1.6fr 1fr 1fr 1fr 1.4fr">
          <span>{r.shieldName}</span>
          <Mono>${formatBaseUnits(r.cover, 6)}</Mono>
          <Mono color="var(--rd-warn)">${formatBaseUnits(r.premium, 6)}</Mono>
          <Mono color="var(--rd-pos)">${formatBaseUnits(r.payout, 6)}</Mono>
          <a href={`https://sepolia.basescan.org/tx/${r.txHash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rd-text-3)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11 }}>
            {r.txHash.slice(0, 10)}… ↗
          </a>
        </Row>
      ))}
    </div>
  )
}

function BondsTable({ rows, err, onRetry, onRedeemed }: { rows: BondRow[]; err: string | null; onRetry: () => void; onRedeemed: () => void }) {
  if (err) return <LoadError message={err} onRetry={onRetry} />
  if (rows.length === 0) return <Empty>No bonds yet. Bonds are minted when a policy trigger fires.</Empty>
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 14,
      }}
    >
      {rows.map((b) => (
        <BondCard
          key={b.epochId.toString()}
          epochId={b.epochId}
          faceValue={b.faceValue}
          maturityTs={b.maturityTs}
          matured={b.matured}
          onRedeemed={onRedeemed}
        />
      ))}
    </div>
  )
}

function BondActionRow({ bond, last, onRedeemed }: { bond: BondRow; last: boolean; onRedeemed: () => void }) {
  const { data: contracts } = useContracts()
  const { writeContract, data: tx, isPending, error: writeErr } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash: tx })

  useEffect(() => {
    if (isSuccess) onRedeemed()
  }, [isSuccess, onRedeemed])

  const handleRedeem = () => {
    if (!contracts) return
    writeContract({
      address: contracts.bondVault,
      abi: bondVaultAbi,
      functionName: 'redeemBond',
      args: [bond.epochId, bond.faceValue],
    })
  }

  const date = bond.maturityTs > 0n ? new Date(Number(bond.maturityTs) * 1000).toISOString().slice(0, 10) : '—'
  const busy = isPending || confirming

  return (
    <Row last={last} weights="1fr 1fr 1.2fr 1fr 1.4fr">
      <Mono color="var(--rd-accent)">#{bond.epochId.toString()}</Mono>
      <Mono>${fmtIntDollars(bond.faceValue)}</Mono>
      <Mono color="var(--rd-text-3)">{date}</Mono>
      <span style={{ color: bond.matured ? 'var(--rd-pos)' : 'var(--rd-text-3)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11 }}>
        {bond.matured ? 'MATURED' : 'HOLDING'}
      </span>
      {bond.matured ? (
        <button
          onClick={handleRedeem}
          disabled={busy || isSuccess}
          style={{
            padding: '6px 12px',
            background: isSuccess ? 'transparent' : 'var(--rd-accent)',
            color: isSuccess ? 'var(--rd-pos)' : '#001018',
            border: `1px solid ${isSuccess ? 'color-mix(in oklab, var(--rd-pos) 40%, transparent)' : 'var(--rd-accent)'}`,
            borderRadius: 4,
            fontWeight: 600,
            fontSize: 11,
            cursor: busy || isSuccess ? 'default' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          {isSuccess ? '✓ Redeemed' : busy ? 'Redeeming…' : 'Redeem for LUMINA →'}
        </button>
      ) : (
        <span style={{ color: 'var(--rd-text-3)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11 }}>
          {writeErr ? '⚠ Error' : '—'}
        </span>
      )}
    </Row>
  )
}

function Header({ cols, weights }: { cols: string[]; weights: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: weights,
        padding: '10px 16px',
        borderBottom: '1px solid var(--rd-line)',
        background: 'var(--rd-surface-2)',
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: 10,
        color: 'var(--rd-text-3)',
        letterSpacing: '0.1em',
      }}
    >
      {cols.map((c) => (
        <div key={c}>{c}</div>
      ))}
    </div>
  )
}

function Row({ children, last, weights }: { children: React.ReactNode; last: boolean; weights: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: weights,
        padding: '12px 16px',
        borderBottom: last ? 'none' : '1px solid var(--rd-line)',
        fontSize: 12,
        alignItems: 'center',
        color: 'var(--rd-text)',
      }}
    >
      {children}
    </div>
  )
}

function Mono({ children, color }: { children: React.ReactNode; color?: string }) {
  return <span style={{ fontFamily: 'var(--font-jetbrains), monospace', color: color ?? 'var(--rd-text)' }}>{children}</span>
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: 32, background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, textAlign: 'center', color: 'var(--rd-text-2)', fontSize: 13 }}>
      {children}
    </div>
  )
}

function formatBaseUnits(v: bigint, decimals: number): string {
  return Number(formatUnits(v, decimals)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

/** Format an INTEGER-DOLLAR bigint (no decimals — used for ClaimBond face/balance
 *  and BondVault.availableCapacityUSD return values). */
function fmtIntDollars(v: bigint): string {
  return Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })
}
