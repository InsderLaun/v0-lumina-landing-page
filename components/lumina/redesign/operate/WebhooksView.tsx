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

      <SetupGuide />

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

// ─────────────────────── Setup guide ───────────────────────
//
// Two-path how-to that lives above the register form. Kept visible without a
// connected wallet/key so anyone can read it before deciding what URL to use.

const RECEIVER_CODE = `// Node / Express receiver (~20 lines)
import crypto from 'crypto'
import express from 'express'

const SECRET = process.env.LUMINA_WEBHOOK_SECRET // the one shown once at registration

const app = express()
app.post('/lumina-hook',
  express.raw({ type: 'application/json' }), // raw body needed for HMAC verify
  (req, res) => {
    const sig = req.header('X-Lumina-Signature')
    const expected = crypto
      .createHmac('sha256', SECRET)
      .update(req.body)
      .digest('hex')
    if (sig !== expected) return res.sendStatus(401) // forged → ignore

    const event = req.header('X-Lumina-Event')
    const payload = JSON.parse(req.body.toString())
    // ...react to the event (e.g. on policy_triggered → redeem the bond)...

    res.sendStatus(200) // reply within 10s or we retry 3× with backoff
  },
)
app.listen(3000)`

function SetupGuide() {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(() => {
    navigator.clipboard.writeText(RECEIVER_CODE).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [])

  return (
    <div
      style={{
        background: 'var(--rd-surface)',
        border: '1px solid var(--rd-line)',
        borderRadius: 8,
        padding: 18,
        marginBottom: 18,
      }}
    >
      <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 14 }}>
        SETUP · TWO WAYS
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        {/* ── Path A ────────────────────────── */}
        <div style={pathCardStyle}>
          <PathHeader letter="A" title="Quick test — no code" sub="5 min · just to see events arriving" />
          <ol style={olStyle}>
            <li>
              Open{' '}
              <a href="https://webhook.site" target="_blank" rel="noopener noreferrer" style={linkStyle}>
                webhook.site
              </a>{' '}
              in a new tab — it gives you a unique public URL.
            </li>
            <li>
              Copy that URL (looks like <Mono color="var(--rd-text-2)">https://webhook.site/&lt;uuid&gt;</Mono>) and paste it in the
              form below → pick events (or leave empty = all) → <strong>Register</strong>.
            </li>
            <li>
              Copy the <strong>secret</strong> the modal shows — it&apos;s shown <strong>once</strong>.
            </li>
            <li>
              Trigger an event with your agent (buy a policy, redeem a bond…) → within seconds you&apos;ll see the POST
              arrive in webhook.site with headers + body.
            </li>
          </ol>
          <div style={footerNoteStyle}>
            ⚠ Public bin — anyone with the URL sees the events. Use only to learn the format.
          </div>
        </div>

        {/* ── Path B ────────────────────────── */}
        <div style={pathCardStyle}>
          <PathHeader letter="B" title="Connect your bot" sub="Real integration · verifies signature" />
          <ol style={olStyle}>
            <li>
              Add a POST endpoint on a server you control. Read the body <strong>raw</strong> (not parsed) and verify the
              HMAC.
            </li>
            <li style={{ listStyle: 'none', marginLeft: -22 }}>
              <div style={{ position: 'relative', marginTop: 8, marginBottom: 8 }}>
                <pre style={codeStyle}>{RECEIVER_CODE}</pre>
                <button onClick={copy} title="Copy code" style={copyBtnStyle}>
                  <Copy size={12} /> {copied ? 'copied' : 'copy'}
                </button>
              </div>
            </li>
            <li>
              For local dev: <Mono color="var(--rd-text-2)">ngrok http 3000</Mono> → use the https URL it prints.
            </li>
            <li>Serverless works too: Vercel Edge Function · Cloudflare Worker · AWS Lambda.</li>
            <li>
              Paste your URL in the form below → <strong>Register</strong> → store the secret in
              <Mono color="var(--rd-text-2)"> LUMINA_WEBHOOK_SECRET</Mono> on your server.
            </li>
          </ol>
          <div style={footerNoteStyle}>
            ↩ Reply <strong>2xx within 10s</strong>. 5xx / timeout → we retry 3× (30s · 60s · 120s). 4xx → no retry.
          </div>
        </div>
      </div>

      {/* Headers reference */}
      <div
        style={{
          marginTop: 16,
          padding: '12px 14px',
          background: 'var(--rd-surface-2)',
          border: '1px solid var(--rd-line)',
          borderRadius: 6,
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
          color: 'var(--rd-text-3)',
          lineHeight: 1.7,
        }}
      >
        <div style={{ color: 'var(--rd-text-2)', marginBottom: 6 }}>Your endpoint receives these headers:</div>
        <div>
          <span style={{ color: 'var(--rd-accent)' }}>X-Lumina-Event</span> &nbsp;&nbsp; policy_purchased · policy_triggered · bond_minted · bond_redeemed · listing_created · listing_purchased
        </div>
        <div>
          <span style={{ color: 'var(--rd-accent)' }}>X-Lumina-Signature</span> &nbsp; HMAC-SHA256(body, your-secret) → hex
        </div>
        <div>
          <span style={{ color: 'var(--rd-accent)' }}>X-Lumina-Delivery</span> &nbsp;&nbsp;&nbsp; unique id — use it to dedupe retries (idempotency)
        </div>
      </div>
    </div>
  )
}

function PathHeader({ letter, title, sub }: { letter: string; title: string; sub: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24,
          borderRadius: 4,
          background: 'var(--rd-accent-dim)',
          color: 'var(--rd-accent)',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 12,
          fontWeight: 600,
          border: '1px solid var(--rd-accent)',
        }}
      >
        {letter}
      </span>
      <div>
        <div style={{ fontSize: 13, color: 'var(--rd-text)', fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--rd-text-3)', fontFamily: 'var(--font-jetbrains), monospace', marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  )
}

const pathCardStyle: React.CSSProperties = {
  background: 'var(--rd-surface-2)',
  border: '1px solid var(--rd-line)',
  borderRadius: 6,
  padding: 14,
  display: 'flex',
  flexDirection: 'column',
}
const olStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 22,
  fontSize: 12.5,
  color: 'var(--rd-text-2)',
  lineHeight: 1.65,
}
const linkStyle: React.CSSProperties = { color: 'var(--rd-accent)', textDecoration: 'underline' }
const footerNoteStyle: React.CSSProperties = {
  marginTop: 12,
  paddingTop: 10,
  borderTop: '1px dashed var(--rd-line)',
  fontSize: 11,
  color: 'var(--rd-text-3)',
  fontFamily: 'var(--font-jetbrains), monospace',
}
const codeStyle: React.CSSProperties = {
  background: 'var(--rd-bg)',
  border: '1px solid var(--rd-line)',
  borderRadius: 4,
  padding: '10px 12px',
  fontSize: 11,
  fontFamily: 'var(--font-jetbrains), monospace',
  color: 'var(--rd-text-2)',
  overflowX: 'auto',
  margin: 0,
  whiteSpace: 'pre',
  lineHeight: 1.55,
}
const copyBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: 6,
  right: 6,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '3px 7px',
  background: 'var(--rd-surface)',
  border: '1px solid var(--rd-line)',
  borderRadius: 4,
  color: 'var(--rd-text-3)',
  fontSize: 10,
  fontFamily: 'var(--font-jetbrains), monospace',
  cursor: 'pointer',
}
