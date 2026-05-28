'use client'

import { useCallback, useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { useAccount } from 'wagmi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { LUMINA_API_URL } from '@/lib/lumina-config'
import { useApiKey } from '@/hooks/use-api-key'
import { LoadError } from './LoadError'
import { Empty, Mono, fmtUsd, IndexerBadge, ApiKeyGate } from './dashboardShared'

interface Earnings {
  summary: {
    premiumsPaidUsd: number
    payoutsReceivedUsd: number
    marketplaceNetUsd: number
    outstandingFaceUsd: number
    realizedPnlUsd: number
  }
  daily: Array<{ date: string; premiumsUsd: number }>
  indexer?: { status?: string; lagBlocks?: number }
}

export function EarningsView() {
  const { isConnected } = useAccount()
  const { apiKey, ready, setApiKey } = useApiKey()
  const [data, setData] = useState<Earnings | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    if (!apiKey) return
    let cancelled = false
    setLoading(true)
    setErr(null)
    ;(async () => {
      try {
        const res = await fetch(`${LUMINA_API_URL}/api/v1/agent/earnings`, {
          headers: { 'x-api-key': apiKey },
          cache: 'no-store',
        })
        if (res.status === 401) throw new Error('Invalid or expired API key.')
        if (!res.ok) throw new Error(`API ${res.status}`)
        const body = (await res.json()) as Earnings
        if (!cancelled) setData(body)
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message.slice(0, 200) : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [apiKey, retry])

  const exportCsv = useCallback(() => {
    if (!data) return
    const s = data.summary
    const lines = [
      'metric,usd',
      `premiums_paid,${s.premiumsPaidUsd}`,
      `payouts_received,${s.payoutsReceivedUsd}`,
      `marketplace_net,${s.marketplaceNetUsd}`,
      `outstanding_face,${s.outstandingFaceUsd}`,
      `realized_pnl,${s.realizedPnlUsd}`,
      '',
      'date,premiums_usd',
      ...data.daily.map((d) => `${d.date},${d.premiumsUsd}`),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lumina-earnings.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [data])

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 6, display: 'flex', gap: 10, alignItems: 'center' }}>
            /APP/AGENT/EARNINGS <IndexerBadge indexer={data?.indexer} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--rd-text)', margin: 0 }}>
            Premiums spent · payouts received · net P&amp;L.
          </h1>
        </div>
        <button onClick={exportCsv} disabled={!data} style={btn(!data)}>
          <Download size={12} /> Export CSV
        </button>
      </div>

      {!isConnected && <Empty>ⓘ Connect the wallet your agent uses.</Empty>}
      {isConnected && ready && !apiKey && <ApiKeyGate onKey={setApiKey} />}
      {isConnected && apiKey && (
        <>
          {err && <LoadError message={err} onRetry={() => setRetry((t) => t + 1)} />}
          {loading && !err && <Empty>⏳ Loading earnings…</Empty>}
          {!loading && !err && data && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
                <Kpi label="Premiums paid" value={`$${fmtUsd(data.summary.premiumsPaidUsd)}`} color="var(--rd-warn)" />
                <Kpi label="Payouts received" value={`$${fmtUsd(data.summary.payoutsReceivedUsd)}`} color="var(--rd-pos)" />
                <Kpi label="Marketplace net" value={`$${fmtUsd(data.summary.marketplaceNetUsd)}`} />
                <Kpi label="Outstanding face" value={`$${fmtUsd(data.summary.outstandingFaceUsd)}`} />
                <Kpi
                  label="Realized P&L"
                  value={`${data.summary.realizedPnlUsd < 0 ? '−' : ''}$${fmtUsd(Math.abs(data.summary.realizedPnlUsd))}`}
                  color={data.summary.realizedPnlUsd >= 0 ? 'var(--rd-pos)' : 'var(--rd-warn)'}
                />
              </div>

              {data.daily.length > 0 ? (
                <div style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 12 }}>
                    PREMIUMS PER DAY (USD)
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data.daily}>
                      <XAxis dataKey="date" tick={{ fill: 'var(--rd-text-3)', fontSize: 10 }} />
                      <YAxis tick={{ fill: 'var(--rd-text-3)', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ background: 'var(--rd-surface-2)', border: '1px solid var(--rd-line)', borderRadius: 6, fontSize: 12 }}
                        formatter={(v: number) => [`$${fmtUsd(v)}`, 'premiums']}
                      />
                      <Bar dataKey="premiumsUsd" fill="var(--rd-accent)" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <Empty>No premium activity yet for this wallet.</Empty>
              )}

              <div style={{ marginTop: 14, fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-3)' }}>
                Realized P&L = payouts + marketplace net − premiums.{' '}
                <Mono color="var(--rd-text-2)">Outstanding face</Mono> is bond value still held (unrealized).
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

function Kpi({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, padding: '14px 16px' }}>
      <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, color: 'var(--rd-text-3)', letterSpacing: '0.08em', marginBottom: 6 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 20, color: color ?? 'var(--rd-text)' }}>{value}</div>
    </div>
  )
}

function btn(disabled: boolean): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    background: 'transparent',
    color: 'var(--rd-text-2)',
    border: '1px solid var(--rd-line-strong)',
    borderRadius: 6,
    fontSize: 12,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  }
}
