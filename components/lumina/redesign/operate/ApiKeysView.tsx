'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { AlertTriangle, Copy, Key, Loader2, Trash2 } from 'lucide-react'
import { LUMINA_API_URL } from '@/lib/lumina-config'
import { useApiKey } from '@/hooks/use-api-key'

interface KeyRecord {
  id: number
  agent_id: number
  label: string | null
  created_at: number
  revoked_at: number | null
  hash_prefix: string
  tier: string
}

type GenerateState =
  | { kind: 'idle' }
  | { kind: 'signing' }
  | { kind: 'submitting' }
  | { kind: 'reveal'; apiKey: string; label: string; createdAt: number }
  | { kind: 'error'; message: string }

const ONBOARD_PATH = '/api/v1/agent/onboard'
const KEYS_PATH = '/api/v1/agent/keys'

/**
 * Self-service API key supervisor for the agent role.
 *
 * Flow
 *   1. User connects wallet (handled upstream by AppShell).
 *   2. Optional label.
 *   3. Click "Generate key" — frontend asks the wallet to sign
 *        "Lumina onboarding for {address} at {timestamp}"
 *   4. POST /api/v1/agent/onboard — backend recovers the signer and
 *      mints a fresh `lk_…` key. Key is shown ONCE in a reveal panel
 *      with a copy button and explicit "I saved it" confirmation.
 *   5. After confirm, a fresh GET /api/v1/agent/keys re-renders the
 *      list (the new key is visible only by hash prefix from now on).
 *
 * Constraints (mirrored from the API)
 *   - Max 3 active keys per wallet.
 *   - Timestamp must be within ±5 min of server time.
 *   - Per-IP rate limit: 10 onboard attempts/hour.
 */
export function ApiKeysView() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const [label, setLabel] = useState('')
  const [gen, setGen] = useState<GenerateState>({ kind: 'idle' })

  const [keys, setKeys] = useState<KeyRecord[]>([])
  const [keysLoading, setKeysLoading] = useState(false)
  const [keysErr, setKeysErr] = useState<string | null>(null)
  // The plaintext key is needed to authenticate GET/DELETE — chicken-and-egg
  // until the user generates one or pastes an existing one. Backed by the
  // shared localStorage store so the earnings/activity pages reuse it.
  const { apiKey: activeApiKey, setApiKey: setActiveApiKey } = useApiKey()

  const refreshKeys = useCallback(async (apiKey: string) => {
    setKeysLoading(true)
    setKeysErr(null)
    try {
      const res = await fetch(`${LUMINA_API_URL}${KEYS_PATH}`, {
        headers: { 'x-api-key': apiKey },
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? `GET keys failed (${res.status})`)
      }
      const data = (await res.json()) as { keys: KeyRecord[] }
      setKeys(data.keys ?? [])
    } catch (err) {
      setKeysErr(err instanceof Error ? err.message : 'Failed to load keys')
    } finally {
      setKeysLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeApiKey) refreshKeys(activeApiKey)
  }, [activeApiKey, refreshKeys])

  const handleGenerate = async () => {
    if (!address) return
    setGen({ kind: 'signing' })
    const timestamp = Math.floor(Date.now() / 1000)
    const message = `Lumina onboarding for ${address} at ${timestamp}`
    let signature: string
    try {
      signature = await signMessageAsync({ message })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Signature rejected'
      setGen({ kind: 'error', message: msg })
      return
    }

    setGen({ kind: 'submitting' })
    try {
      const res = await fetch(`${LUMINA_API_URL}${ONBOARD_PATH}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          label: label.trim() || undefined,
          signature,
          timestamp,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(body?.error ?? `Onboard failed (${res.status})`)
      }
      const apiKey = body.apiKey as string
      const lbl = body.label as string
      const createdAt = body.createdAt as number
      setGen({ kind: 'reveal', apiKey, label: lbl, createdAt })
      setActiveApiKey(apiKey)
      setLabel('')
    } catch (err) {
      setGen({ kind: 'error', message: err instanceof Error ? err.message : 'Onboard failed' })
    }
  }

  const handleRevoke = async (keyId: number) => {
    if (!activeApiKey) {
      setKeysErr('Provide an API key first to revoke. Paste it below.')
      return
    }
    if (!window.confirm(`Revoke key #${keyId}? This cannot be undone.`)) return
    try {
      const res = await fetch(`${LUMINA_API_URL}${KEYS_PATH}/${keyId}`, {
        method: 'DELETE',
        headers: { 'x-api-key': activeApiKey },
      })
      if (!res.ok && res.status !== 204) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? `Revoke failed (${res.status})`)
      }
      await refreshKeys(activeApiKey)
    } catch (err) {
      setKeysErr(err instanceof Error ? err.message : 'Revoke failed')
    }
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 920 }}>
      <header style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            color: 'var(--rd-text-3)',
            letterSpacing: '0.1em',
            marginBottom: 6,
          }}
        >
          /APP/AGENT/API-KEYS
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontSize: 32,
            fontWeight: 300,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          Keys your bot uses to call Lumina.
        </h1>
        <p style={{ color: 'var(--rd-text-3)', fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
          Self-service. Sign a one-line message with your wallet to mint a key. Up to 3 active per
          wallet. The plaintext is shown <strong>once</strong> — copy it before you close the modal.
        </p>
      </header>

      {!isConnected && (
        <Card>
          <div style={{ padding: 24, color: 'var(--rd-text-2)', fontSize: 13 }}>
            ⓘ Connect a wallet to mint or list API keys.
          </div>
        </Card>
      )}

      {isConnected && (
        <>
          <Card>
            <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Label (optional)">
                <input
                  type="text"
                  value={label}
                  maxLength={50}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. prod-bot · trading-agent · backup"
                  disabled={gen.kind === 'signing' || gen.kind === 'submitting'}
                  style={inputStyle}
                />
              </Field>
              <button
                onClick={handleGenerate}
                disabled={gen.kind === 'signing' || gen.kind === 'submitting'}
                style={{
                  alignSelf: 'flex-start',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  background: 'var(--rd-accent)',
                  color: '#00121a',
                  border: 0,
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor:
                    gen.kind === 'signing' || gen.kind === 'submitting' ? 'not-allowed' : 'pointer',
                  opacity: gen.kind === 'signing' || gen.kind === 'submitting' ? 0.7 : 1,
                  fontFamily: 'inherit',
                }}
              >
                {gen.kind === 'signing' ? (
                  <>
                    <Loader2 size={14} className="spin" /> Sign in your wallet…
                  </>
                ) : gen.kind === 'submitting' ? (
                  <>
                    <Loader2 size={14} className="spin" /> Submitting onboard…
                  </>
                ) : (
                  <>
                    <Key size={14} /> Generate key
                  </>
                )}
              </button>
              {gen.kind === 'error' && (
                <div
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 6,
                    color: 'var(--rd-neg)',
                    fontSize: 12,
                  }}
                >
                  ⚠ {gen.message}
                </div>
              )}
            </div>
          </Card>

          {gen.kind === 'reveal' && (
            <RevealModal
              apiKey={gen.apiKey}
              label={gen.label}
              createdAt={gen.createdAt}
              onClose={() => setGen({ kind: 'idle' })}
            />
          )}

          <section style={{ marginTop: 24 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  color: 'var(--rd-text-3)',
                  margin: 0,
                  textTransform: 'uppercase',
                }}
              >
                Your keys
              </h2>
              {!activeApiKey && (
                <span style={{ fontSize: 11, color: 'var(--rd-text-3)' }}>
                  Paste a key below to load + revoke
                </span>
              )}
            </div>

            {!activeApiKey && (
              <Card>
                <div style={{ padding: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="password"
                    placeholder="lk_…  (your existing API key, used to fetch your key list)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const v = (e.target as HTMLInputElement).value.trim()
                        if (v) setActiveApiKey(v)
                      }
                    }}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <span style={{ fontSize: 10, color: 'var(--rd-text-4)' }}>press enter</span>
                </div>
              </Card>
            )}

            {keysErr && (
              <div
                style={{
                  padding: '10px 12px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 6,
                  color: 'var(--rd-neg)',
                  fontSize: 12,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                ⚠ {keysErr}
              </div>
            )}

            {activeApiKey && (
              <Card>
                {keysLoading ? (
                  <div style={{ padding: 22, color: 'var(--rd-text-3)', fontSize: 12 }}>
                    Loading…
                  </div>
                ) : keys.length === 0 ? (
                  <div style={{ padding: 22, color: 'var(--rd-text-3)', fontSize: 12 }}>
                    No keys yet for this wallet.
                  </div>
                ) : (
                  <div>
                    <KeyHeader />
                    {keys.map((k, i) => (
                      <KeyRow key={k.id} k={k} last={i === keys.length - 1} onRevoke={handleRevoke} />
                    ))}
                  </div>
                )}
              </Card>
            )}
          </section>
        </>
      )}

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--rd-surface)',
        border: '1px solid var(--rd-line)',
        borderRadius: 10,
        marginTop: 12,
      }}
    >
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 10,
          letterSpacing: '0.08em',
          color: 'var(--rd-text-3)',
          textTransform: 'uppercase',
          marginBottom: 6,
          display: 'block',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function KeyHeader() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.6fr 1fr 0.6fr 0.5fr 0.5fr',
        gap: 12,
        padding: '10px 16px',
        borderBottom: '1px solid var(--rd-line)',
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: 10,
        letterSpacing: '0.08em',
        color: 'var(--rd-text-3)',
        textTransform: 'uppercase',
      }}
    >
      <div>LABEL</div>
      <div>HASH PREFIX</div>
      <div>CREATED</div>
      <div>TIER</div>
      <div>STATUS</div>
      <div></div>
    </div>
  )
}

function KeyRow({
  k,
  last,
  onRevoke,
}: {
  k: KeyRecord
  last: boolean
  onRevoke: (id: number) => void
}) {
  const created = new Date(k.created_at).toISOString().slice(0, 10)
  const revoked = !!k.revoked_at
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.6fr 1fr 0.6fr 0.5fr 0.5fr',
        gap: 12,
        padding: '12px 16px',
        borderBottom: last ? 'none' : '1px solid var(--rd-line)',
        fontSize: 12,
        alignItems: 'center',
      }}
    >
      <span style={{ color: 'var(--rd-text)' }}>
        {k.label ?? <em style={{ color: 'var(--rd-text-4)' }}>—</em>}
      </span>
      <code
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
          color: 'var(--rd-text-3)',
        }}
      >
        sha256:{k.hash_prefix}…
      </code>
      <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-3)' }}>
        {created}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 10,
          color: k.tier === 'paid' ? 'var(--rd-pos)' : 'var(--rd-text-3)',
          textTransform: 'uppercase',
        }}
      >
        {k.tier}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 10,
          color: revoked ? 'var(--rd-text-4)' : 'var(--rd-pos)',
          textTransform: 'uppercase',
        }}
      >
        {revoked ? 'revoked' : 'active'}
      </span>
      <button
        onClick={() => onRevoke(k.id)}
        disabled={revoked}
        title={revoked ? 'Already revoked' : 'Revoke this key'}
        aria-label="Revoke key"
        style={{
          background: 'transparent',
          border: 0,
          color: revoked ? 'var(--rd-text-4)' : 'var(--rd-neg)',
          cursor: revoked ? 'not-allowed' : 'pointer',
          justifySelf: 'end',
        }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

function RevealModal({
  apiKey,
  label,
  createdAt,
  onClose,
}: {
  apiKey: string
  label: string
  createdAt: number
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--rd-surface)',
          border: '1px solid var(--rd-accent-border)',
          borderRadius: 10,
          padding: '24px 28px',
          width: 'min(560px, 92vw)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(245,158,11,0.15)',
              color: 'var(--rd-warn)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={18} />
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: 22,
              fontWeight: 500,
              margin: 0,
            }}
          >
            Save your key now
          </h3>
        </div>
        <p style={{ color: 'var(--rd-text-2)', fontSize: 13, lineHeight: 1.55, marginBottom: 14 }}>
          The full plaintext is shown only this once. Lumina stores only the SHA-256 hash. If you
          close this window without copying it, you&apos;ll need to revoke + regenerate.
        </p>
        <div
          style={{
            background: 'var(--rd-bg-2)',
            border: '1px solid var(--rd-line)',
            borderRadius: 6,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 14,
          }}
        >
          <code
            style={{
              flex: 1,
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 12,
              color: 'var(--rd-text)',
              wordBreak: 'break-all',
            }}
          >
            {apiKey}
          </code>
          <button
            onClick={copy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              background: copied ? 'var(--rd-pos)' : 'var(--rd-accent)',
              color: '#00121a',
              border: 0,
              borderRadius: 4,
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            <Copy size={11} /> {copied ? 'copied' : 'copy'}
          </button>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            color: 'var(--rd-text-3)',
            marginBottom: 16,
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '4px 12px',
          }}
        >
          <span style={{ color: 'var(--rd-text-4)' }}>label</span>
          <span>{label}</span>
          <span style={{ color: 'var(--rd-text-4)' }}>created</span>
          <span>{new Date(createdAt).toISOString()}</span>
        </div>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: 'var(--rd-text-2)',
            marginBottom: 14,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          I&apos;ve saved this key in my password manager / .env file.
        </label>
        <button
          onClick={onClose}
          disabled={!confirmed}
          style={{
            width: '100%',
            padding: '10px 14px',
            background: confirmed ? 'var(--rd-accent)' : 'var(--rd-surface-2)',
            color: confirmed ? '#00121a' : 'var(--rd-text-3)',
            border: 0,
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 13,
            cursor: confirmed ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
          }}
        >
          Close — I have it
        </button>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  background: 'var(--rd-surface-2)',
  border: '1px solid var(--rd-line)',
  borderRadius: 5,
  color: 'var(--rd-text)',
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: 13,
}
