'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { useAccount, usePublicClient } from 'wagmi'
import { formatUnits, type Hex } from 'viem'
import { DEPLOY_BLOCK_SEPOLIA } from '@/lib/lumina-config'
import { SHIELDS, SHIELD_BY_PRODUCT_ID } from '@/lib/operate/products'
import { getLogsChunked } from '@/lib/getLogsChunked'
import { useContracts } from '@/hooks/use-contracts'
import { LoadError } from './LoadError'

type RangeFilter = '24h' | '7d' | '30d' | 'all'

interface PolicyRow {
  productId: Hex
  policyId: bigint
  cover: bigint
  premium: bigint
  payout: bigint
  blockNumber: bigint
  txHash: Hex
  shieldName: string
}

const RANGE_BLOCKS: Record<RangeFilter, bigint | null> = {
  // Base Sepolia ~2s/block. Approximations: 24h=43200, 7d=302400, 30d=1296000.
  '24h': 43_200n,
  '7d': 302_400n,
  '30d': 1_296_000n,
  all: null,
}

export function AgentPoliciesView() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: contracts } = useContracts()

  const [rows, setRows] = useState<PolicyRow[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const [range, setRange] = useState<RangeFilter>('all')
  const [shieldFilter, setShieldFilter] = useState<string>('all')
  const [latestBlock, setLatestBlock] = useState<bigint>(0n)
  const [retryToken, setRetryToken] = useState(0)
  const retry = () => setRetryToken((t) => t + 1)

  useEffect(() => {
    if (!address || !publicClient || !contracts) return
    let cancelled = false
    setLoading(true)
    setErr(null)

    ;(async () => {
      try {
        const block = await publicClient.getBlockNumber()
        if (cancelled) return
        setLatestBlock(block)

        const logs = await getLogsChunked({
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
          toBlock: block,
        })
        if (cancelled) return

        const ours: PolicyRow[] = (logs as any[])
          .filter((l) => (l.args.buyer as Hex)?.toLowerCase() === address.toLowerCase())
          .map((l) => {
            const pid = l.args.productId as Hex
            return {
              productId: pid,
              policyId: l.args.policyId as bigint,
              cover: l.args.coverage as bigint,
              premium: l.args.premium as bigint,
              payout: l.args.payout as bigint,
              blockNumber: l.blockNumber,
              txHash: l.transactionHash,
              shieldName: SHIELD_BY_PRODUCT_ID[pid]?.name ?? `Unknown (${pid.slice(0, 10)})`,
            }
          })
          .sort((a, b) => Number(b.blockNumber - a.blockNumber))
        setRows(ours)
      } catch (err) {
        console.error('AgentPoliciesView getLogs error:', err)
        if (cancelled) return
        setErr(err instanceof Error ? err.message.slice(0, 200) : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [address, publicClient, retryToken, contracts])

  const filtered = useMemo(() => {
    let out = rows
    const span = RANGE_BLOCKS[range]
    if (span !== null && latestBlock > 0n) {
      const fromBlock = latestBlock - span
      out = out.filter((r) => r.blockNumber >= fromBlock)
    }
    if (shieldFilter !== 'all') {
      out = out.filter((r) => SHIELD_BY_PRODUCT_ID[r.productId]?.slug === shieldFilter)
    }
    return out
  }, [rows, range, shieldFilter, latestBlock])

  const exportCsv = () => {
    const header = ['shield', 'policyId', 'cover_usd', 'premium_usd', 'payout_usd', 'block', 'tx']
    const lines = [header.join(',')]
    for (const r of filtered) {
      lines.push(
        [
          `"${r.shieldName}"`,
          r.policyId.toString(),
          formatUnits(r.cover, 6),
          formatUnits(r.premium, 6),
          formatUnits(r.payout, 6),
          r.blockNumber.toString(),
          r.txHash,
        ].join(','),
      )
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lumina-policies-${address}-${range}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalCover = filtered.reduce((a, r) => a + r.cover, 0n)
  const totalPremium = filtered.reduce((a, r) => a + r.premium, 0n)

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 6 }}>
            /APP/AGENT/POLICIES · READ-ONLY · {filtered.length} of {rows.length}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--rd-text)', margin: 0 }}>
            Every policy your agent ever bought.
          </h1>
        </div>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            background: 'transparent',
            color: 'var(--rd-text-2)',
            border: '1px solid var(--rd-line-strong)',
            borderRadius: 6,
            fontSize: 12,
            cursor: filtered.length === 0 ? 'not-allowed' : 'pointer',
            opacity: filtered.length === 0 ? 0.5 : 1,
          }}
        >
          <Download size={12} /> Export CSV
        </button>
      </div>

      {!isConnected ? (
        <Empty>ⓘ Connect the wallet your agent uses to view policies.</Empty>
      ) : (
        <>
          <Filters
            range={range}
            setRange={setRange}
            shieldFilter={shieldFilter}
            setShieldFilter={setShieldFilter}
            countShown={filtered.length}
            countTotal={rows.length}
          />

          {err && <LoadError message={err} onRetry={retry} />}
          {loading && !err && <Empty>⏳ Loading policies from PolicyManagerV2 events…</Empty>}

          {!loading && !err && filtered.length === 0 && <Empty>No policies match these filters.</Empty>}

          {!loading && !err && filtered.length > 0 && (
            <>
              <div style={{ marginBottom: 14, display: 'flex', gap: 24, fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-3)' }}>
                <span>Total cover: <span style={{ color: 'var(--rd-text)' }}>${fmt(totalCover, 6)}</span></span>
                <span>Total premium: <span style={{ color: 'var(--rd-warn)' }}>${fmt(totalPremium, 6)}</span></span>
              </div>
              <Table rows={filtered} />
            </>
          )}
        </>
      )}
    </div>
  )
}

function Filters({
  range,
  setRange,
  shieldFilter,
  setShieldFilter,
  countShown,
  countTotal,
}: {
  range: RangeFilter
  setRange: (r: RangeFilter) => void
  shieldFilter: string
  setShieldFilter: (s: string) => void
  countShown: number
  countTotal: number
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        padding: 12,
        background: 'var(--rd-surface)',
        border: '1px solid var(--rd-line)',
        borderRadius: 8,
        marginBottom: 14,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, color: 'var(--rd-text-3)', letterSpacing: '0.1em' }}>
        FILTER ·
      </span>
      {(['24h', '7d', '30d', 'all'] as const).map((r) => (
        <button
          key={r}
          onClick={() => setRange(r)}
          style={{
            padding: '5px 10px',
            borderRadius: 4,
            fontSize: 11,
            background: range === r ? 'var(--rd-accent-dim)' : 'transparent',
            color: range === r ? 'var(--rd-accent)' : 'var(--rd-text-3)',
            border: `1px solid ${range === r ? 'var(--rd-accent)' : 'var(--rd-line)'}`,
            fontFamily: 'var(--font-jetbrains), monospace',
            cursor: 'pointer',
            textTransform: r === 'all' ? 'capitalize' : 'none',
          }}
        >
          {r === 'all' ? 'All time' : r}
        </button>
      ))}
      <div style={{ width: 1, height: 18, background: 'var(--rd-line)', margin: '0 4px' }} />
      <select
        value={shieldFilter}
        onChange={(e) => setShieldFilter(e.target.value)}
        style={{
          padding: '5px 10px',
          background: 'var(--rd-surface-2)',
          border: '1px solid var(--rd-line)',
          color: 'var(--rd-text-2)',
          fontSize: 11,
          fontFamily: 'var(--font-jetbrains), monospace',
          borderRadius: 4,
        }}
      >
        <option value="all">All shields</option>
        {SHIELDS.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name}
          </option>
        ))}
      </select>
      <div style={{ flex: 1 }} />
      <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, color: 'var(--rd-text-3)' }}>
        SHOWING {countShown} of {countTotal}
      </span>
    </div>
  )
}

function Table({ rows }: { rows: PolicyRow[] }) {
  return (
    <div style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr',
          padding: '10px 16px',
          borderBottom: '1px solid var(--rd-line)',
          background: 'var(--rd-surface-2)',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 10,
          color: 'var(--rd-text-3)',
          letterSpacing: '0.1em',
        }}
      >
        <div>BLOCK</div>
        <div>SHIELD</div>
        <div>POLICY ID</div>
        <div>COVER</div>
        <div>PREMIUM</div>
        <div>PAYOUT</div>
        <div>TX</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={`${r.productId}-${r.policyId}`}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr',
            padding: '11px 16px',
            borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--rd-line)',
            fontSize: 12,
            alignItems: 'center',
          }}
        >
          <span style={{ fontFamily: 'var(--font-jetbrains), monospace', color: 'var(--rd-text-3)', fontSize: 11 }}>{r.blockNumber.toString()}</span>
          <span>{r.shieldName}</span>
          <Mono color="var(--rd-text-3)">#{r.policyId.toString()}</Mono>
          <Mono>${fmt(r.cover, 6)}</Mono>
          <Mono color="var(--rd-warn)">${fmt(r.premium, 6)}</Mono>
          <Mono color="var(--rd-pos)">${fmt(r.payout, 6)}</Mono>
          <a
            href={`https://sepolia.basescan.org/tx/${r.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--rd-text-3)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11 }}
          >
            {r.txHash.slice(0, 8)}… ↗
          </a>
        </div>
      ))}
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

function fmt(v: bigint, decimals: number, max: number = 2): string {
  return Number(formatUnits(v, decimals)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: max })
}
