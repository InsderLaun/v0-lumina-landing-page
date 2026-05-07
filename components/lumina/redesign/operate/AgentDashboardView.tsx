'use client'

import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useAccount, usePublicClient, useReadContract } from 'wagmi'
import { erc20Abi, formatUnits, type Hex } from 'viem'
import { TOKENS, DEPLOY_BLOCK_SEPOLIA } from '@/lib/lumina-config'
import { ASSET_COLORS, SHIELD_BY_PRODUCT_ID, SHIELDS } from '@/lib/operate/products'
import { getLogsChunked } from '@/lib/getLogsChunked'
import { useContracts } from '@/hooks/use-contracts'
import { LoadError } from './LoadError'

type FeedKind = 'POLICY' | 'TRIGGER' | 'BOND' | 'REDEEM' | 'LIST' | 'BOUGHT' | 'CANCEL'

interface FeedItem {
  ts: bigint
  kind: FeedKind
  msg: string
  txHash: Hex
}

interface PolicyEvent {
  productId: Hex
  policyId: bigint
  cover: bigint
  premium: bigint
  payout: bigint
  txHash: Hex
  blockNumber: bigint
}

const POLL_MS = 15_000

export function AgentDashboardView() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: contracts } = useContracts()

  const [policies, setPolicies] = useState<PolicyEvent[]>([])
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [bondsRedeemed, setBondsRedeemed] = useState<{ usd: bigint; lumina: bigint; count: number }>({
    usd: 0n,
    lumina: 0n,
    count: 0,
  })
  const [bondsOutstanding, setBondsOutstanding] = useState<{ count: number; face: bigint }>({
    count: 0,
    face: 0n,
  })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  // Auto-refresh every POLL_MS
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), POLL_MS)
    return () => clearInterval(id)
  }, [])

  // Read on-chain wallet balances
  const { data: usdcBal } = useReadContract({
    address: TOKENS.USDC.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })
  const { data: luminaBal } = useReadContract({
    address: contracts?.luminaToken,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  // Aggregate events on every tick + address change
  useEffect(() => {
    if (!address || !publicClient || !contracts) {
      setPolicies([])
      setFeed([])
      return
    }
    let cancelled = false
    setLoading(true)
    setErr(null)

    ;(async () => {
      try {
        const head = await publicClient.getBlockNumber()
        const [pCreated, pTriggered, bMinted, bRedeemed] = await Promise.all([
          // PolicyCreated — buyer NOT indexed → pull all + filter
          getLogsChunked({
            client: publicClient,
            address: contracts.policyManager,
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
          }),
          getLogsChunked({
            client: publicClient,
            address: contracts.policyManager,
            event: {
              type: 'event',
              name: 'PolicyTriggered',
              inputs: [
                { name: 'productId', type: 'bytes32', indexed: true },
                { name: 'policyId', type: 'uint256', indexed: true },
                { name: 'buyer', type: 'address', indexed: false },
                { name: 'bondAmount', type: 'uint256', indexed: false },
                { name: 'reason', type: 'bytes32', indexed: false },
              ],
            },
            fromBlock: DEPLOY_BLOCK_SEPOLIA,
            toBlock: head,
          }),
          // BondsMinted — to IS indexed → use args filter
          getLogsChunked({
            client: publicClient,
            address: contracts.claimBond,
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
          }),
          // BondRedeemed — holder IS indexed
          getLogsChunked({
            client: publicClient,
            address: contracts.bondVault,
            event: {
              type: 'event',
              name: 'BondRedeemed',
              inputs: [
                { name: 'holder', type: 'address', indexed: true },
                { name: 'epochId', type: 'uint256', indexed: true },
                { name: 'usdAmount', type: 'uint256', indexed: false },
                { name: 'luminaAmount', type: 'uint256', indexed: false },
                { name: 'price', type: 'uint256', indexed: false },
              ],
            },
            args: { holder: address },
            fromBlock: DEPLOY_BLOCK_SEPOLIA,
            toBlock: head,
          }),
        ])
        if (cancelled) return

        // Active policies (we treat PolicyCreated as "issued"; status filtering would
        // need PolicyTriggered/Expired matching — out of scope for KPI count)
        const myPolicies = (pCreated as any[])
          .filter((l) => (l.args.buyer as Hex)?.toLowerCase() === address.toLowerCase())
          .map((l) => ({
            productId: l.args.productId as Hex,
            policyId: l.args.policyId as bigint,
            cover: l.args.coverage as bigint,
            premium: l.args.premium as bigint,
            payout: l.args.payout as bigint,
            txHash: l.transactionHash,
            blockNumber: l.blockNumber,
          }))
        setPolicies(myPolicies)

        // Bonds outstanding: BondsMinted - BondRedeemed (USD)
        const bMintedArr = bMinted as any[]
        const bRedeemedArr = bRedeemed as any[]
        const mintedUsd = bMintedArr.reduce((a, l) => a + (l.args.usdAmount as bigint), 0n)
        const redeemedUsd = bRedeemedArr.reduce((a, l) => a + (l.args.usdAmount as bigint), 0n)
        const redeemedLumina = bRedeemedArr.reduce((a, l) => a + (l.args.luminaAmount as bigint), 0n)
        const outstandingFace = mintedUsd > redeemedUsd ? mintedUsd - redeemedUsd : 0n
        const outstandingCount = bMintedArr.length - bRedeemedArr.length
        setBondsOutstanding({ count: Math.max(0, outstandingCount), face: outstandingFace })
        setBondsRedeemed({ usd: redeemedUsd, lumina: redeemedLumina, count: bRedeemedArr.length })

        // Activity feed: last 20 events across all sources, sorted by blockNumber desc
        const items: (FeedItem & { block: bigint })[] = []
        for (const l of myPolicies) {
          const sName = SHIELD_BY_PRODUCT_ID[l.productId]?.name ?? l.productId.slice(0, 10)
          items.push({
            ts: 0n,
            block: l.blockNumber,
            kind: 'POLICY',
            msg: `Bought ${sName} · $${fmt(l.cover, 6)} cover · premium $${fmt(l.premium, 6)}`,
            txHash: l.txHash,
          })
        }
        for (const l of (pTriggered as any[]).filter((l) => (l.args.buyer as Hex)?.toLowerCase() === address.toLowerCase())) {
          const sName = SHIELD_BY_PRODUCT_ID[l.args.productId as Hex]?.name ?? 'Unknown'
          items.push({
            ts: 0n,
            block: l.blockNumber,
            kind: 'TRIGGER',
            msg: `Trigger fired on ${sName} · bond $${fmtInt(l.args.bondAmount as bigint)}`,
            txHash: l.transactionHash,
          })
        }
        for (const l of bMintedArr) {
          items.push({
            ts: 0n,
            block: l.blockNumber,
            kind: 'BOND',
            msg: `Bond minted · epoch #${(l.args.epochId as bigint).toString()} · $${fmtInt(l.args.usdAmount as bigint)}`,
            txHash: l.transactionHash,
          })
        }
        for (const l of bRedeemedArr) {
          items.push({
            ts: 0n,
            block: l.blockNumber,
            kind: 'REDEEM',
            msg: `Redeemed bond · epoch #${(l.args.epochId as bigint).toString()} → ${fmt(l.args.luminaAmount as bigint, 18, 0)} LUMINA`,
            txHash: l.transactionHash,
          })
        }
        items.sort((a, b) => Number(b.block - a.block))
        setFeed(items.slice(0, 20).map((i) => ({ ts: i.block, kind: i.kind, msg: i.msg, txHash: i.txHash })))
      } catch (err) {
        console.error('AgentDashboardView getLogs error:', err)
        if (cancelled) return
        setErr(err instanceof Error ? err.message.slice(0, 200) : 'Failed to load activity')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [address, publicClient, tick, contracts])

  // Distribution: count policies per shield
  const distribution = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of policies) {
      const slug = SHIELD_BY_PRODUCT_ID[p.productId]?.slug ?? 'unknown'
      counts[slug] = (counts[slug] ?? 0) + 1
    }
    return SHIELDS.map((s) => ({
      name: s.name,
      slug: s.slug,
      count: counts[s.slug] ?? 0,
      color: ASSET_COLORS[s.asset],
    })).filter((d) => d.count > 0)
  }, [policies])

  const totalCover = policies.reduce((a, p) => a + p.cover, 0n)
  const totalPremium = policies.reduce((a, p) => a + p.premium, 0n)
  const usdcLabel = usdcBal ? fmt(usdcBal as bigint, 6) : '0.00'
  const luminaLabel = luminaBal ? fmt(luminaBal as bigint, 18, 0) : '0'

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 6 }}>
            /APP/AGENT/DASHBOARD · {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'NO WALLET'} · LIVE
          </div>
          <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--rd-text)', margin: 0 }}>
            Your agent&apos;s pulse, in real time.
          </h1>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 14px',
            background: 'var(--rd-surface)',
            border: '1px solid color-mix(in oklab, var(--rd-pos) 33%, transparent)',
            borderRadius: 6,
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            color: isConnected ? 'var(--rd-pos)' : 'var(--rd-text-3)',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isConnected ? 'var(--rd-pos)' : 'var(--rd-text-3)' }} />
          {isConnected ? `LIVE · POLLING ${POLL_MS / 1000}s` : 'NO WALLET CONNECTED'}
        </div>
      </div>

      {!isConnected && (
        <div style={{ padding: 32, background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, textAlign: 'center', color: 'var(--rd-text-2)' }}>
          ⓘ Connect the wallet your agent uses to start monitoring.
        </div>
      )}

      {isConnected && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 20 }}>
            <Kpi label="Active policies" value={String(policies.length)} sub={`$${fmt(totalCover, 6, 0)} covered`} />
            <Kpi label="Premiums paid" value={`$${fmt(totalPremium, 6)}`} sub="lifetime" accent="var(--rd-warn)" />
            <Kpi label="Bonds outstanding" value={String(bondsOutstanding.count)} sub={`$${fmtInt(bondsOutstanding.face)} face`} />
            <Kpi label="Bonds redeemed" value={String(bondsRedeemed.count)} sub={`${fmt(bondsRedeemed.lumina, 18, 0)} LUMINA recv`} accent="var(--rd-pos)" />
            <Kpi label="USDC balance" value={`$${usdcLabel}`} sub="wallet" />
            <Kpi label="LUMINA balance" value={luminaLabel} sub="wallet" accent="var(--rd-accent)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 14 }} className="rd-agent-dash-grid">
            {/* Activity feed */}
            <div style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--rd-line)', background: 'var(--rd-surface-2)' }}>
                <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-2)', letterSpacing: '0.1em' }}>
                  ACTIVITY FEED · LAST {Math.min(20, feed.length)} EVENTS
                </span>
                <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, color: 'var(--rd-text-3)' }}>
                  {loading ? '⏳ refreshing…' : err ? `⚠ ${err.slice(0, 40)}` : `block ↓ from ${feed[0]?.ts.toString().slice(-6) ?? '—'}`}
                </span>
              </div>
              {err && feed.length === 0 && (
                <div style={{ padding: 16 }}>
                  <LoadError message={err} onRetry={() => setTick((t) => t + 1)} />
                </div>
              )}
              {feed.length === 0 && !loading && !err && (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--rd-text-3)' }}>
                  No on-chain activity yet for this wallet.
                </div>
              )}
              {feed.map((f, i) => (
                <div
                  key={`${f.txHash}-${i}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 1fr 100px',
                    gap: 12,
                    padding: '11px 16px',
                    borderBottom: i === feed.length - 1 ? 'none' : '1px solid var(--rd-line)',
                    fontSize: 12,
                    alignItems: 'center',
                  }}
                >
                  <KindPill kind={f.kind} />
                  <span style={{ color: 'var(--rd-text)' }}>{f.msg}</span>
                  <a href={`https://sepolia.basescan.org/tx/${f.txHash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rd-text-3)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, textAlign: 'right' }}>
                    {f.txHash.slice(0, 10)}… ↗
                  </a>
                </div>
              ))}
            </div>

            {/* Distribution */}
            <div style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-2)', letterSpacing: '0.1em', marginBottom: 14 }}>
                POLICIES BY SHIELD
              </div>
              {distribution.length === 0 ? (
                <div style={{ color: 'var(--rd-text-3)', fontSize: 12, padding: '16px 0' }}>No policies to chart yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={Math.max(200, distribution.length * 32)}>
                  <BarChart data={distribution} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                    <XAxis type="number" tick={{ fill: '#6b6b78', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#a8a8b3', fontSize: 11 }} width={120} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#111116', border: '1px solid #1d1d24', borderRadius: 6, color: '#e8e8ec', fontSize: 12 }}
                      labelStyle={{ color: '#e8e8ec' }}
                      itemStyle={{ color: '#e8e8ec' }}
                      cursor={{ fill: 'rgba(0, 212, 255, 0.04)' }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {distribution.map((d) => (
                        <Cell key={d.slug} fill={d.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--rd-line)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, color: 'var(--rd-text-3)' }}>
                TOTAL · {policies.length} POLICIES · ${fmt(totalCover, 6, 0)} COVERED
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: string }) {
  return (
    <div style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, padding: 14 }}>
      <div style={{ fontSize: 10, color: 'var(--rd-text-3)', fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: accent ?? 'var(--rd-text)', fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '-0.01em' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--rd-text-4)', marginTop: 4, fontFamily: 'var(--font-jetbrains), monospace' }}>{sub}</div>
    </div>
  )
}

function KindPill({ kind }: { kind: FeedKind }) {
  const colors: Record<FeedKind, string> = {
    POLICY: 'var(--rd-text-2)',
    TRIGGER: 'var(--rd-warn)',
    BOND: 'var(--rd-accent)',
    REDEEM: 'var(--rd-pos)',
    LIST: 'var(--rd-warn)',
    BOUGHT: 'var(--rd-pos)',
    CANCEL: 'var(--rd-text-3)',
  }
  const c = colors[kind]
  return (
    <span
      style={{
        display: 'inline-flex',
        padding: '3px 8px',
        borderRadius: 4,
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: 10,
        letterSpacing: '0.06em',
        color: c,
        background: `color-mix(in oklab, ${c} 10%, transparent)`,
        border: `1px solid color-mix(in oklab, ${c} 33%, transparent)`,
        textTransform: 'uppercase',
        justifyContent: 'center',
      }}
    >
      {kind}
    </span>
  )
}

function fmt(v: bigint, decimals: number, max: number = 2): string {
  return Number(formatUnits(v, decimals)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: max })
}

/** ClaimBond / BondVault values are integer dollars (1 token = $1, no decimals). */
function fmtInt(v: bigint): string {
  return Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })
}
