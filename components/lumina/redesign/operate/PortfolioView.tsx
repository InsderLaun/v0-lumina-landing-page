'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAccount, usePublicClient, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { erc20Abi, formatUnits, parseUnits, type Hex } from 'viem'
import { CONTRACTS } from '@/lib/lumina-config'
import { claimBondAbi, bondVaultAbi, policyManagerV2Abi } from '@/lib/abis/operate'
import { SHIELD_BY_PRODUCT_ID, SHIELDS } from '@/lib/operate/products'

type Tab = 'policies' | 'bonds'

interface PolicyRow {
  productId: Hex
  policyId: bigint
  shieldName: string
  cover: bigint
  premium: bigint
  payout: bigint
  txHash: Hex
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

  const [policies, setPolicies] = useState<PolicyRow[]>([])
  const [policiesLoading, setPoliciesLoading] = useState(false)
  const [policiesErr, setPoliciesErr] = useState<string | null>(null)

  const [userEpochs, setUserEpochs] = useState<bigint[]>([])
  const [bondsErr, setBondsErr] = useState<string | null>(null)

  // ─── Load policies (PolicyCreated events; buyer NOT indexed → filter client-side) ───
  useEffect(() => {
    if (!address || !publicClient) {
      setPolicies([])
      return
    }
    let cancelled = false
    setPoliciesLoading(true)
    setPoliciesErr(null)

    publicClient
      .getLogs({
        address: CONTRACTS.PolicyManager,
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
        fromBlock: 'earliest',
        toBlock: 'latest',
      })
      .then((logs) => {
        if (cancelled) return
        const rows: PolicyRow[] = logs
          .filter((l) => (l.args.buyer as Hex)?.toLowerCase() === address.toLowerCase())
          .map((l) => {
            const pid = l.args.productId as Hex
            return {
              productId: pid,
              policyId: l.args.policyId as bigint,
              shieldName: SHIELD_BY_PRODUCT_ID[pid]?.name ?? `Unknown (${pid.slice(0, 10)})`,
              cover: l.args.coverage as bigint,
              premium: l.args.premium as bigint,
              payout: l.args.payout as bigint,
              txHash: l.transactionHash,
            }
          })
        setPolicies(rows)
        setPoliciesLoading(false)
      })
      .catch((e) => {
        if (cancelled) return
        setPoliciesErr(e?.message?.slice(0, 200) ?? 'Failed to load policies')
        setPoliciesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [address, publicClient])

  // ─── Load user's bond epochs (BondsMinted with `to` indexed) ───
  useEffect(() => {
    if (!address || !publicClient) {
      setUserEpochs([])
      return
    }
    let cancelled = false
    setBondsErr(null)

    publicClient
      .getLogs({
        address: CONTRACTS.ClaimBond,
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
        fromBlock: 'earliest',
        toBlock: 'latest',
      })
      .then((logs) => {
        if (cancelled) return
        const epochs = Array.from(new Set(logs.map((l) => (l.args.epochId as bigint).toString()))).map(BigInt)
        setUserEpochs(epochs)
      })
      .catch((e) => {
        if (cancelled) return
        setBondsErr(e?.message?.slice(0, 200) ?? 'Failed to load bonds')
      })

    return () => {
      cancelled = true
    }
  }, [address, publicClient])

  // For each user epoch: balanceOf + isMatured + getEpochInfo
  const bondReadContracts = useMemo(
    () =>
      address
        ? userEpochs.flatMap((epochId) => [
            {
              address: CONTRACTS.ClaimBond,
              abi: claimBondAbi,
              functionName: 'getHolderFaceValue' as const,
              args: [address, epochId] as const,
            },
            {
              address: CONTRACTS.ClaimBond,
              abi: claimBondAbi,
              functionName: 'isMatured' as const,
              args: [epochId] as const,
            },
            {
              address: CONTRACTS.ClaimBond,
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
        const face = bondData[i * 3]?.status === 'success' ? (bondData[i * 3].result as bigint) : 0n
        const matured = bondData[i * 3 + 1]?.status === 'success' ? (bondData[i * 3 + 1].result as boolean) : false
        const epochInfo = bondData[i * 3 + 2]?.status === 'success' ? (bondData[i * 3 + 2].result as readonly [bigint, bigint, boolean]) : null
        return {
          epochId,
          faceValue: face,
          matured,
          maturityTs: epochInfo?.[0] ?? 0n,
        }
      })
      .filter((b) => b.faceValue > 0n)
      .sort((a, b) => Number(a.maturityTs - b.maturityTs))
  }, [bondData, userEpochs])

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
            <Kpi label="Active policies" value={String(policies.length)} sub={`$${formatBaseUnits(policies.reduce((a, p) => a + p.cover, 0n), 6)} covered`} />
            <Kpi label="Bonds outstanding" value={String(bonds.length)} sub={`$${formatBaseUnits(bonds.reduce((a, b) => a + b.faceValue, 0n), 6)} face`} />
            <Kpi
              label="Redeemable now"
              value={String(bonds.filter((b) => b.matured).length)}
              sub={`$${formatBaseUnits(bonds.filter((b) => b.matured).reduce((a, b) => a + b.faceValue, 0n), 6)}`}
              accent="var(--rd-pos)"
            />
            <Kpi label="Premiums paid" value={`$${formatBaseUnits(policies.reduce((a, p) => a + p.premium, 0n), 6)}`} sub="lifetime" accent="var(--rd-warn)" />
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid var(--rd-line)', marginBottom: 16 }}>
            {(
              [
                { id: 'policies' as Tab, label: 'Active Policies', count: policies.length },
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
            <PoliciesTable rows={policies} loading={policiesLoading} err={policiesErr} />
          )}
          {tab === 'bonds' && <BondsTable rows={bonds} err={bondsErr} onRedeemed={() => refetchBonds()} />}
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

function PoliciesTable({ rows, loading, err }: { rows: PolicyRow[]; loading: boolean; err: string | null }) {
  if (loading) return <Empty>⏳ Loading on-chain policies…</Empty>
  if (err) return <Empty>⚠ {err}</Empty>
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

function BondsTable({ rows, err, onRedeemed }: { rows: BondRow[]; err: string | null; onRedeemed: () => void }) {
  if (err) return <Empty>⚠ {err}</Empty>
  if (rows.length === 0) return <Empty>No bonds yet. Bonds are minted when a policy trigger fires.</Empty>
  return (
    <div style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, overflow: 'hidden' }}>
      <Header cols={['Epoch', 'Face value', 'Maturity', 'Status', 'Action']} weights="1fr 1fr 1.2fr 1fr 1.4fr" />
      {rows.map((b, i) => (
        <BondActionRow key={b.epochId.toString()} bond={b} last={i === rows.length - 1} onRedeemed={onRedeemed} />
      ))}
    </div>
  )
}

function BondActionRow({ bond, last, onRedeemed }: { bond: BondRow; last: boolean; onRedeemed: () => void }) {
  const { writeContract, data: tx, isPending, error: writeErr } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash: tx })

  useEffect(() => {
    if (isSuccess) onRedeemed()
  }, [isSuccess, onRedeemed])

  const handleRedeem = () => {
    writeContract({
      address: CONTRACTS.BondVault,
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
      <Mono>${formatBaseUnits(bond.faceValue, 6)}</Mono>
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
