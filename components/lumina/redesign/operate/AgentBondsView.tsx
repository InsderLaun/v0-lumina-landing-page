'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { useAccount, usePublicClient, useReadContracts } from 'wagmi'
import { formatUnits, type Hex } from 'viem'
import { CONTRACTS, DEPLOY_BLOCK_SEPOLIA } from '@/lib/lumina-config'
import { claimBondAbi } from '@/lib/abis/operate'
import { getLogsChunked } from '@/lib/getLogsChunked'
import { LoadError } from './LoadError'

type RangeFilter = '24h' | '7d' | '30d' | 'all'
type StatusFilter = 'all' | 'holding' | 'matured' | 'redeemed'

interface BondMint {
  epochId: bigint
  usdAmount: bigint
  blockNumber: bigint
  txHash: Hex
}

interface BondRow {
  epochId: bigint
  totalMinted: bigint
  currentBalance: bigint
  matured: boolean
  maturityTs: bigint
  status: 'holding' | 'matured' | 'redeemed'
  blockNumber: bigint
  txHash: Hex
}

const RANGE_BLOCKS: Record<RangeFilter, bigint | null> = {
  '24h': 43_200n,
  '7d': 302_400n,
  '30d': 1_296_000n,
  all: null,
}

export function AgentBondsView() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()

  const [mints, setMints] = useState<BondMint[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [range, setRange] = useState<RangeFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [latestBlock, setLatestBlock] = useState<bigint>(0n)
  const [retryToken, setRetryToken] = useState(0)
  const retry = () => setRetryToken((t) => t + 1)

  useEffect(() => {
    if (!address || !publicClient) return
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
          fromBlock: DEPLOY_BLOCK_SEPOLIA,
          toBlock: block,
        })
        if (cancelled) return
        setMints(
          (logs as any[])
            .map((l) => ({
              epochId: l.args.epochId as bigint,
              usdAmount: l.args.usdAmount as bigint,
              blockNumber: l.blockNumber,
              txHash: l.transactionHash,
            }))
            .sort((a, b) => Number(b.blockNumber - a.blockNumber)),
        )
      } catch (err) {
        console.error('AgentBondsView getLogs error:', err)
        if (cancelled) return
        setErr(err instanceof Error ? err.message.slice(0, 200) : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [address, publicClient, retryToken])

  // Aggregate per-epoch mint totals (one row per epoch)
  const aggregatedEpochs = useMemo(() => {
    const map = new Map<string, BondMint>()
    for (const m of mints) {
      const key = m.epochId.toString()
      const existing = map.get(key)
      if (existing) {
        existing.usdAmount += m.usdAmount
        if (m.blockNumber < existing.blockNumber) {
          existing.blockNumber = m.blockNumber
          existing.txHash = m.txHash
        }
      } else {
        map.set(key, { ...m })
      }
    }
    return Array.from(map.values())
  }, [mints])

  // For each epoch, read current balance + matured + getEpochInfo
  const reads = useMemo(
    () =>
      address
        ? aggregatedEpochs.flatMap((e) => [
            // Use balanceOf (= ERC1155 count = integer dollars), NOT
            // getHolderFaceValue (which scales to 18-dec USD-wei). Keeps units
            // aligned with `totalMinted` from BondsMinted event (also integer $).
            { address: CONTRACTS.ClaimBond, abi: claimBondAbi, functionName: 'balanceOf' as const, args: [address, e.epochId] as const },
            { address: CONTRACTS.ClaimBond, abi: claimBondAbi, functionName: 'isMatured' as const, args: [e.epochId] as const },
            { address: CONTRACTS.ClaimBond, abi: claimBondAbi, functionName: 'getEpochInfo' as const, args: [e.epochId] as const },
          ])
        : [],
    [address, aggregatedEpochs],
  )
  const { data: readData } = useReadContracts({
    contracts: reads,
    query: { enabled: reads.length > 0 },
  })

  const rows: BondRow[] = useMemo(() => {
    if (!readData) return []
    return aggregatedEpochs.map((e, i) => {
      const balance = readData[i * 3]?.status === 'success' ? (readData[i * 3].result as bigint) : 0n
      const matured = readData[i * 3 + 1]?.status === 'success' ? (readData[i * 3 + 1].result as boolean) : false
      // getEpochInfo returns (exists, maturity, totalSupply_, matured)
      const epochInfo = readData[i * 3 + 2]?.status === 'success'
        ? (readData[i * 3 + 2].result as readonly [boolean, bigint, bigint, boolean])
        : null
      const maturityTs = epochInfo?.[1] ?? 0n
      const s: BondRow['status'] = balance === 0n ? 'redeemed' : matured ? 'matured' : 'holding'
      return {
        epochId: e.epochId,
        totalMinted: e.usdAmount,
        currentBalance: balance,
        matured,
        maturityTs,
        status: s,
        blockNumber: e.blockNumber,
        txHash: e.txHash,
      }
    })
  }, [readData, aggregatedEpochs])

  const filtered = useMemo(() => {
    let out = rows
    const span = RANGE_BLOCKS[range]
    if (span !== null && latestBlock > 0n) {
      const fromBlock = latestBlock - span
      out = out.filter((r) => r.blockNumber >= fromBlock)
    }
    if (status !== 'all') {
      out = out.filter((r) => r.status === status)
    }
    return out
  }, [rows, range, status, latestBlock])

  const exportCsv = () => {
    const lines = ['epoch_id,total_minted_usd,current_balance_usd,maturity_iso,status,block,tx']
    for (const r of filtered) {
      const date = r.maturityTs > 0n ? new Date(Number(r.maturityTs) * 1000).toISOString().slice(0, 10) : ''
      lines.push(
        [
          r.epochId.toString(),
          // ClaimBond units are integer dollars (1 token = $1), no decimals.
          r.totalMinted.toString(),
          r.currentBalance.toString(),
          date,
          r.status,
          r.blockNumber.toString(),
          r.txHash,
        ].join(','),
      )
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lumina-bonds-${address}-${range}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalFace = filtered.reduce((a, r) => a + r.currentBalance, 0n)
  const maturedFace = filtered.filter((r) => r.matured).reduce((a, r) => a + r.currentBalance, 0n)

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 6 }}>
            /APP/AGENT/BONDS · READ-ONLY · {filtered.length} of {rows.length}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--rd-text)', margin: 0 }}>
            Every bond your agent minted, redeemed, or holds.
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
        <Empty>ⓘ Connect the wallet your agent uses to view bonds.</Empty>
      ) : (
        <>
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
                }}
              >
                {r === 'all' ? 'All time' : r}
              </button>
            ))}
            <div style={{ width: 1, height: 18, background: 'var(--rd-line)', margin: '0 4px' }} />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
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
              <option value="all">All statuses</option>
              <option value="holding">Holding</option>
              <option value="matured">Matured</option>
              <option value="redeemed">Redeemed</option>
            </select>
          </div>

          {err && <LoadError message={err} onRetry={retry} />}
          {loading && !err && <Empty>⏳ Loading bonds from ClaimBond events…</Empty>}
          {!loading && !err && filtered.length === 0 && <Empty>No bonds match these filters.</Empty>}

          {!loading && !err && filtered.length > 0 && (
            <>
              <div style={{ marginBottom: 14, display: 'flex', gap: 24, fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-3)' }}>
                <span>Outstanding face: <span style={{ color: 'var(--rd-text)' }}>${fmtInt(totalFace)}</span></span>
                <span>Matured (redeemable): <span style={{ color: 'var(--rd-pos)' }}>${fmtInt(maturedFace)}</span></span>
              </div>
              <Table rows={filtered} />
            </>
          )}
        </>
      )}
    </div>
  )
}

function Table({ rows }: { rows: BondRow[] }) {
  return (
    <div style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '0.8fr 0.8fr 1fr 1fr 1.2fr 0.8fr 0.8fr',
          padding: '10px 16px',
          borderBottom: '1px solid var(--rd-line)',
          background: 'var(--rd-surface-2)',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 10,
          color: 'var(--rd-text-3)',
          letterSpacing: '0.1em',
        }}
      >
        <div>EPOCH</div>
        <div>STATUS</div>
        <div>TOTAL MINTED</div>
        <div>CURRENT BAL</div>
        <div>MATURITY</div>
        <div>FIRST BLOCK</div>
        <div>FIRST TX</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.epochId.toString()}
          style={{
            display: 'grid',
            gridTemplateColumns: '0.8fr 0.8fr 1fr 1fr 1.2fr 0.8fr 0.8fr',
            padding: '11px 16px',
            borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--rd-line)',
            fontSize: 12,
            alignItems: 'center',
          }}
        >
          <Mono color="var(--rd-accent)">#{r.epochId.toString()}</Mono>
          <StatusPill status={r.status} />
          <Mono>${fmtInt(r.totalMinted)}</Mono>
          <Mono color={r.currentBalance > 0n ? 'var(--rd-text)' : 'var(--rd-text-3)'}>
            ${fmtInt(r.currentBalance)}
          </Mono>
          <Mono color="var(--rd-text-3)">
            {r.maturityTs > 0n ? new Date(Number(r.maturityTs) * 1000).toISOString().slice(0, 10) : '—'}
          </Mono>
          <Mono color="var(--rd-text-3)">{r.blockNumber.toString()}</Mono>
          <a
            href={`https://sepolia.basescan.org/tx/${r.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--rd-text-3)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11 }}
          >
            ↗
          </a>
        </div>
      ))}
    </div>
  )
}

function StatusPill({ status }: { status: BondRow['status'] }) {
  const colors = {
    holding: 'var(--rd-text-3)',
    matured: 'var(--rd-pos)',
    redeemed: 'var(--rd-text-3)',
  } as const
  const c = colors[status]
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
      }}
    >
      {status}
    </span>
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

/** ClaimBond / BondVault values are integer dollars (1 token = $1, no decimals). */
function fmtInt(v: bigint): string {
  return Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })
}
