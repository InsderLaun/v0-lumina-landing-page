'use client'

import { useEffect, useState } from 'react'

const HEALTH_URL =
  'https://lumina-api-production-ac85.up.railway.app/health'

const POLL_MS = 30_000

interface HealthState {
  ok: boolean
  chainId?: number
  block?: number
  rpcConnected?: boolean
  relayerEth?: number
  relayerAddress?: string
  uptimeSeconds?: number
  fetchedAt: number
  error?: string
}

function formatEth(wei: string): number {
  // Convert wei (string) to ether float, low-precision is fine for the badge.
  try {
    return Number(BigInt(wei)) / 1e18
  } catch {
    return 0
  }
}

export function ApiHealthWidget() {
  const [state, setState] = useState<HealthState>({ ok: false, fetchedAt: 0 })

  useEffect(() => {
    let cancelled = false
    const poll = async () => {
      try {
        const r = await fetch(HEALTH_URL, { cache: 'no-store' })
        const body = (await r.json()) as {
          status: string
          chain: { chainId: number; block: number; rpcConnected: boolean }
          relayer: { address: string; balanceWei: string }
          uptimeSeconds: number
        }
        if (cancelled) return
        setState({
          ok: body.status === 'ok',
          chainId: body.chain.chainId,
          block: body.chain.block,
          rpcConnected: body.chain.rpcConnected,
          relayerEth: formatEth(body.relayer.balanceWei),
          relayerAddress: body.relayer.address,
          uptimeSeconds: body.uptimeSeconds,
          fetchedAt: Date.now(),
        })
      } catch (e) {
        if (cancelled) return
        setState({
          ok: false,
          error: (e as Error).message,
          fetchedAt: Date.now(),
        })
      }
    }
    void poll()
    const id = setInterval(() => void poll(), POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  // Determine pill colour: green when ok + relayer healthy, yellow when relayer
  // is running low, red when down or relayer is critically low.
  const relayerLow = state.relayerEth !== undefined && state.relayerEth < 0.01
  const relayerWarn = state.relayerEth !== undefined && state.relayerEth < 0.05
  const tone: 'ok' | 'warn' | 'err' = !state.ok || relayerLow ? 'err' : relayerWarn ? 'warn' : 'ok'
  const dotColour = tone === 'ok' ? '#10b981' : tone === 'warn' ? '#f59e0b' : '#ef4444'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 14px',
        border: '1px solid rgba(14,230,243,0.15)',
        borderRadius: 8,
        background: 'rgba(2,8,23,0.6)',
        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        fontSize: 12,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 16,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: 99,
          background: dotColour,
          boxShadow: `0 0 8px ${dotColour}`,
        }}
      />
      {state.fetchedAt === 0 ? (
        <span>Checking API…</span>
      ) : state.ok ? (
        <>
          <span>API OK</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>chain {state.chainId}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>block {state.block}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>
            relayer {state.relayerEth?.toFixed(4)} ETH
            {relayerWarn && (
              <span style={{ color: dotColour, marginLeft: 4 }}>
                ({relayerLow ? 'critical' : 'low'})
              </span>
            )}
          </span>
          <a
            href={HEALTH_URL}
            target="_blank"
            rel="noreferrer"
            style={{ marginLeft: 'auto', color: '#0ee6f3', textDecoration: 'none' }}
          >
            /health ↗
          </a>
        </>
      ) : (
        <>
          <span style={{ color: dotColour }}>API unreachable</span>
          <span style={{ opacity: 0.6, marginLeft: 8 }}>{state.error ?? ''}</span>
        </>
      )}
    </div>
  )
}
