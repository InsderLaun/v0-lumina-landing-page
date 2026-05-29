'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { LUMINA_API_URL } from '@/lib/lumina-config'
import { useApiKey } from '@/hooks/use-api-key'
import { LoadError } from './LoadError'
import { Empty, Mono, fmtUsd, IndexerBadge, ApiKeyGate } from './dashboardShared'

interface Item {
  type: string
  amount: string | null
  ref: string | null
  txHash: string | null
  blockNumber: number | null
  blockTimestamp: number | null
}

type Group = 'all' | 'policies' | 'bonds' | 'marketplace'
const GROUPS: Record<Exclude<Group, 'all'>, string[]> = {
  policies: ['policy_purchased', 'policy_triggered'],
  bonds: ['bond_minted', 'bond_redeemed'],
  marketplace: ['listing_created', 'listing_sold', 'marketplace_buy'],
}

const LABEL: Record<string, { text: string; color: string }> = {
  policy_purchased: { text: 'Policy purchased', color: 'var(--rd-accent)' },
  policy_triggered: { text: 'Policy triggered', color: 'var(--rd-warn)' },
  bond_minted: { text: 'Bond minted', color: 'var(--rd-pos)' },
  bond_redeemed: { text: 'Bond redeemed', color: 'var(--rd-pos)' },
  listing_created: { text: 'Listing created', color: 'var(--rd-text-2)' },
  listing_sold: { text: 'Listing sold', color: 'var(--rd-pos)' },
  marketplace_buy: { text: 'Marketplace buy', color: 'var(--rd-text-2)' },
}

const SIX_DEC = new Set(['policy_purchased', 'listing_created', 'listing_sold', 'marketplace_buy'])

function amountUsd(it: Item): string | null {
  if (it.amount == null) return null
  const n = Number(it.amount)
  if (!Number.isFinite(n)) return null
  return SIX_DEC.has(it.type) ? fmtUsd(n / 1e6) : fmtUsd(n) // bonds = integer $1/unit
}

function timeAgo(tsSec: number | null): string {
  if (!tsSec) return ''
  const s = Math.max(0, Math.floor(Date.now() / 1000) - tsSec)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export function ActivityView() {
  const { isConnected } = useAccount()
  const { apiKey, ready, setApiKey } = useApiKey()
  const [items, setItems] = useState<Item[]>([])
  const [cursor, setCursor] = useState<number | null>(null)
  const [group, setGroup] = useState<Group>('all')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [indexer, setIndexer] = useState<{ status?: string; lagBlocks?: number } | undefined>()
  const [retry, setRetry] = useState(0)

  const load = useCallback(
    async (before?: number) => {
      if (!apiKey) return
      setLoading(true)
      setErr(null)
      try {
        const url = new URL(`${LUMINA_API_URL}/api/v1/agent/activity`)
        url.searchParams.set('limit', '50')
        if (before) url.searchParams.set('before', String(before))
        const res = await fetch(url.toString(), { headers: { 'x-api-key': apiKey }, cache: 'no-store' })
        if (res.status === 401) throw new Error('Invalid or expired API key.')
        if (!res.ok) throw new Error(`API ${res.status}`)
        const body = (await res.json()) as { items: Item[]; nextCursor: number | null; indexer?: typeof indexer }
        setIndexer(body.indexer)
        setItems((prev) => (before ? [...prev, ...body.items] : body.items))
        setCursor(body.nextCursor)
      } catch (e) {
        setErr(e instanceof Error ? e.message.slice(0, 200) : 'Failed to load')
      } finally {
        setLoading(false)
      }
    },
    [apiKey],
  )

  useEffect(() => {
    if (apiKey) void load()
  }, [apiKey, retry, load])

  const shown = group === 'all' ? items : items.filter((i) => GROUPS[group].includes(i.type))

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 6, display: 'flex', gap: 10, alignItems: 'center' }}>
          /APP/AGENT/ACTIVITY <IndexerBadge indexer={indexer} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--rd-text)', margin: 0 }}>
          Every operation your agent performs, in one feed.
        </h1>
      </div>

      {!isConnected && <Empty>ⓘ Connect the wallet your agent uses.</Empty>}
      {isConnected && ready && !apiKey && <ApiKeyGate onKey={setApiKey} />}
      {isConnected && apiKey && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            {(['all', 'policies', 'bonds', 'marketplace'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGroup(g)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 4,
                  fontSize: 11,
                  textTransform: 'capitalize',
                  background: group === g ? 'var(--rd-accent-dim)' : 'transparent',
                  color: group === g ? 'var(--rd-accent)' : 'var(--rd-text-3)',
                  border: `1px solid ${group === g ? 'var(--rd-accent)' : 'var(--rd-line)'}`,
                  fontFamily: 'var(--font-jetbrains), monospace',
                  cursor: 'pointer',
                }}
              >
                {g}
              </button>
            ))}
          </div>

          {err && <LoadError message={err} onRetry={() => setRetry((t) => t + 1)} />}
          {loading && items.length === 0 && !err && <Empty>⏳ Loading activity…</Empty>}
          {!loading && !err && shown.length === 0 && <Empty>No activity for this filter yet.</Empty>}

          {shown.length > 0 && (
            <div style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, overflow: 'hidden' }}>
              {shown.map((it, i) => {
                const meta = LABEL[it.type] ?? { text: it.type, color: 'var(--rd-text-2)' }
                const amt = amountUsd(it)
                return (
                  <div
                    key={`${it.txHash}-${it.type}-${i}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 0.8fr 0.7fr 0.8fr 0.6fr',
                      gap: 8,
                      padding: '11px 16px',
                      borderBottom: i === shown.length - 1 ? 'none' : '1px solid var(--rd-line)',
                      fontSize: 12,
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ color: meta.color }}>{meta.text}</span>
                    <Mono color="var(--rd-text-3)">{it.ref ? `#${it.ref}` : '—'}</Mono>
                    <Mono color={amt ? 'var(--rd-text)' : 'var(--rd-text-3)'}>{amt ? `$${amt}` : '—'}</Mono>
                    <Mono color="var(--rd-text-3)">{timeAgo(it.blockTimestamp)}</Mono>
                    {it.txHash ? (
                      <a href={`https://basescan.org/tx/${it.txHash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rd-text-3)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11 }}>
                        {it.txHash.slice(0, 8)}… ↗
                      </a>
                    ) : (
                      <span style={{ color: 'var(--rd-text-3)' }}>—</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {cursor && (
            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <button onClick={() => load(cursor)} disabled={loading} style={{ padding: '8px 18px', background: 'transparent', color: 'var(--rd-text-2)', border: '1px solid var(--rd-line-strong)', borderRadius: 6, fontSize: 12, cursor: loading ? 'wait' : 'pointer' }}>
                {loading ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
