'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { Copy, Trash2, ChevronDown } from 'lucide-react'
import { LUMINA_API_URL } from '@/lib/lumina-config'
import { useApiKey } from '@/hooks/use-api-key'
import { LoadError } from './LoadError'
import { Empty, Mono, ApiKeyGate } from './dashboardShared'

const EVENTS = [
  'policy_purchased',
  'policy_triggered',
  'bond_minted',
  'bond_redeemed',
  'listing_created',
  'listing_purchased',
] as const

interface Hook {
  id: number
  url: string
  events: string[]
  createdAt: string
}
interface Delivery {
  id: number
  event: string
  status: string
  attempts: number
  responseCode: number | null
  deliveredAt: string | null
  createdAt: string
}

export function WebhooksView() {
  const { isConnected } = useAccount()
  const { apiKey, ready, setApiKey } = useApiKey()
  const [hooks, setHooks] = useState<Hook[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)

  // create form
  const [url, setUrl] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [creating, setCreating] = useState(false)
  const [revealSecret, setRevealSecret] = useState<string | null>(null)

  const headers = apiKey ? { 'x-api-key': apiKey, 'Content-Type': 'application/json' } : undefined

  const refresh = useCallback(async () => {
    if (!apiKey) return
    setLoading(true)
    setErr(null)
    try {
      const res = await fetch(`${LUMINA_API_URL}/api/v1/webhooks`, { headers: { 'x-api-key': apiKey }, cache: 'no-store' })
      if (res.status === 401) throw new Error('Invalid or expired API key.')
      if (!res.ok) throw new Error(`API ${res.status}`)
      const body = (await res.json()) as { webhooks: Hook[] }
      setHooks(body.webhooks ?? [])
    } catch (e) {
      setErr(e instanceof Error ? e.message.slice(0, 200) : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  useEffect(() => {
    if (apiKey) void refresh()
  }, [apiKey, retry, refresh])

  const create = useCallback(async () => {
    if (!headers || !url.startsWith('https://')) return
    setCreating(true)
    setErr(null)
    try {
      const events = selected.size === 0 ? '*' : Array.from(selected)
      const res = await fetch(`${LUMINA_API_URL}/api/v1/webhooks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ url, events }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.message ?? body.error ?? `API ${res.status}`)
      setRevealSecret(body.secret)
      setUrl('')
      setSelected(new Set())
      await refresh()
    } catch (e) {
      setErr(e instanceof Error ? e.message.slice(0, 200) : 'Failed to create')
    } finally {
      setCreating(false)
    }
  }, [headers, url, selected, refresh])

  const remove = useCallback(
    async (id: number) => {
      if (!apiKey) return
      await fetch(`${LUMINA_API_URL}/api/v1/webhooks/${id}`, { method: 'DELETE', headers: { 'x-api-key': apiKey } })
      await refresh()
    },
    [apiKey, refresh],
  )

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 6 }}>
          /APP/AGENT/WEBHOOKS
        </div>
        <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--rd-text)', margin: 0 }}>
          Push events to your bot — no polling.
        </h1>
        <p style={{ color: 'var(--rd-text-2)', fontSize: 13, maxWidth: 640, marginTop: 8 }}>
          Lumina POSTs a signed payload (<Mono color="var(--rd-text-2)">X-Lumina-Signature</Mono> = HMAC-SHA256) within
          seconds of the on-chain event. Verify it with the secret shown once at creation.
        </p>
      </div>

      {!isConnected && <Empty>ⓘ Connect the wallet your agent uses.</Empty>}
      {isConnected && ready && !apiKey && <ApiKeyGate onKey={setApiKey} />}
      {isConnected && apiKey && (
        <>
          {/* create */}
          <div style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, padding: 16, marginBottom: 18 }}>
            <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 10 }}>
              REGISTER A WEBHOOK
            </div>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value.trim())}
              placeholder="https://your-bot.example.com/lumina-hook"
              style={{ width: '100%', padding: '9px 11px', background: 'var(--rd-surface-2)', border: '1px solid var(--rd-line)', borderRadius: 6, color: 'var(--rd-text)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: 12, marginBottom: 10 }}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {EVENTS.map((ev) => {
                const on = selected.has(ev)
                return (
                  <button
                    key={ev}
                    onClick={() =>
                      setSelected((s) => {
                        const n = new Set(s)
                        if (n.has(ev)) n.delete(ev)
                        else n.add(ev)
                        return n
                      })
                    }
                    style={{ padding: '4px 10px', borderRadius: 4, fontSize: 11, background: on ? 'var(--rd-accent-dim)' : 'transparent', color: on ? 'var(--rd-accent)' : 'var(--rd-text-3)', border: `1px solid ${on ? 'var(--rd-accent)' : 'var(--rd-line)'}`, fontFamily: 'var(--font-jetbrains), monospace', cursor: 'pointer' }}
                  >
                    {ev}
                  </button>
                )
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={create} disabled={creating || !url.startsWith('https://')} style={{ padding: '8px 16px', background: url.startsWith('https://') ? 'var(--rd-accent)' : 'transparent', color: url.startsWith('https://') ? '#000' : 'var(--rd-text-3)', border: '1px solid var(--rd-accent)', borderRadius: 6, fontSize: 12, cursor: creating || !url.startsWith('https://') ? 'not-allowed' : 'pointer', opacity: creating ? 0.6 : 1 }}>
                {creating ? 'Creating…' : 'Register'}
              </button>
              <span style={{ fontSize: 11, color: 'var(--rd-text-3)' }}>{selected.size === 0 ? 'All events (default)' : `${selected.size} event(s)`}</span>
            </div>
          </div>

          {revealSecret && (
            <div style={{ background: 'var(--rd-surface-2)', border: '1px solid var(--rd-warn)', borderRadius: 8, padding: 16, marginBottom: 18 }}>
              <div style={{ fontSize: 12, color: 'var(--rd-warn)', marginBottom: 8 }}>⚠ Signing secret — shown once. Store it now.</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <code style={{ flex: 1, fontFamily: 'var(--font-jetbrains), monospace', fontSize: 12, color: 'var(--rd-text)', wordBreak: 'break-all' }}>{revealSecret}</code>
                <button onClick={() => navigator.clipboard.writeText(revealSecret)} style={{ padding: '6px 10px', background: 'transparent', border: '1px solid var(--rd-line-strong)', borderRadius: 6, color: 'var(--rd-text-2)', cursor: 'pointer' }}>
                  <Copy size={12} />
                </button>
                <button onClick={() => setRevealSecret(null)} style={{ padding: '6px 10px', background: 'transparent', border: '1px solid var(--rd-line)', borderRadius: 6, color: 'var(--rd-text-3)', fontSize: 12, cursor: 'pointer' }}>
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {err && <LoadError message={err} onRetry={() => setRetry((t) => t + 1)} />}
          {loading && hooks.length === 0 && !err && <Empty>⏳ Loading webhooks…</Empty>}
          {!loading && !err && hooks.length === 0 && <Empty>No webhooks yet. Register one above.</Empty>}

          {hooks.map((h) => (
            <WebhookRow key={h.id} hook={h} apiKey={apiKey} onDelete={() => remove(h.id)} />
          ))}
        </>
      )}
    </div>
  )
}

function WebhookRow({ hook, apiKey, onDelete }: { hook: Hook; apiKey: string; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const [deliveries, setDeliveries] = useState<Delivery[] | null>(null)

  const toggle = useCallback(async () => {
    const next = !open
    setOpen(next)
    if (next && deliveries === null) {
      try {
        const res = await fetch(`${LUMINA_API_URL}/api/v1/webhooks/${hook.id}/deliveries`, { headers: { 'x-api-key': apiKey }, cache: 'no-store' })
        const body = await res.json()
        setDeliveries(body.deliveries ?? [])
      } catch {
        setDeliveries([])
      }
    }
  }, [open, deliveries, hook.id, apiKey])

  return (
    <div style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, marginBottom: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
        <Mono>{hook.url}</Mono>
        <span style={{ fontSize: 10, color: 'var(--rd-text-3)', fontFamily: 'var(--font-jetbrains), monospace' }}>{hook.events.join(', ')}</span>
        <div style={{ flex: 1 }} />
        <button onClick={toggle} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid var(--rd-line)', borderRadius: 6, color: 'var(--rd-text-3)', fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <ChevronDown size={12} style={{ transform: open ? 'rotate(180deg)' : 'none' }} /> Deliveries
        </button>
        <button onClick={onDelete} style={{ padding: '5px 8px', background: 'transparent', border: '1px solid var(--rd-line)', borderRadius: 6, color: 'var(--rd-warn)', cursor: 'pointer' }}>
          <Trash2 size={12} />
        </button>
      </div>
      {open && (
        <div style={{ borderTop: '1px solid var(--rd-line)', padding: '10px 16px', background: 'var(--rd-surface-2)' }}>
          {deliveries === null ? (
            <span style={{ fontSize: 12, color: 'var(--rd-text-3)' }}>Loading…</span>
          ) : deliveries.length === 0 ? (
            <span style={{ fontSize: 12, color: 'var(--rd-text-3)' }}>No deliveries yet.</span>
          ) : (
            deliveries.map((d) => (
              <div key={d.id} style={{ display: 'flex', gap: 12, fontSize: 11, fontFamily: 'var(--font-jetbrains), monospace', padding: '4px 0', color: 'var(--rd-text-3)' }}>
                <span style={{ color: d.status === 'delivered' ? 'var(--rd-pos)' : d.status === 'failed' ? 'var(--rd-warn)' : 'var(--rd-text-2)', width: 80 }}>{d.status}</span>
                <span style={{ width: 130 }}>{d.event}</span>
                <span>code {d.responseCode ?? '—'}</span>
                <span>· {d.attempts} attempt(s)</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
