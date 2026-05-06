'use client'

import { useEffect, useState } from 'react'

const HEALTH_URL = 'https://lumina-api-production-ac85.up.railway.app/health'
// Refresh cadence: 30s is plenty for a hero badge — the API itself caches the
// underlying RPC reads for shorter windows. Faster polling here would just
// waste bandwidth without changing what the user sees.
const POLL_MS = 30_000
const FETCH_TIMEOUT_MS = 5_000

type Status = 'loading' | 'ok' | 'down'

/**
 * Small live-status pill: green dot + "API live · chain 84532" when /health
 * returns 200, red dot + "API offline" otherwise. Used in the hero to give
 * builders an at-a-glance signal that the protocol is up before they
 * integrate.
 */
export function LiveStatusBadge() {
  const [status, setStatus] = useState<Status>('loading')
  const [chainId, setChainId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const tick = async () => {
      const ctrl = new AbortController()
      const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS)
      try {
        const r = await fetch(HEALTH_URL, { signal: ctrl.signal, cache: 'no-store' })
        clearTimeout(t)
        if (!r.ok) throw new Error(String(r.status))
        const body: { status?: string; chain?: { chainId?: number } } = await r.json()
        if (cancelled) return
        setStatus(body.status === 'ok' ? 'ok' : 'down')
        if (typeof body.chain?.chainId === 'number') setChainId(body.chain.chainId)
      } catch {
        clearTimeout(t)
        if (cancelled) return
        setStatus('down')
      }
    }
    void tick()
    const id = setInterval(tick, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  const color =
    status === 'ok' ? 'var(--rd-pos)' : status === 'down' ? 'var(--rd-neg)' : 'var(--rd-text-3)'
  const label =
    status === 'ok'
      ? `API live${chainId ? ` · chain ${chainId}` : ''}`
      : status === 'down'
        ? 'API offline'
        : 'Checking API…'

  return (
    <a
      href={HEALTH_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="Click for live /health response"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.03)',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--rd-text-2)',
        textDecoration: 'none',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: color,
          boxShadow: status === 'ok' ? `0 0 6px ${color}` : 'none',
        }}
      />
      {label}
    </a>
  )
}
