'use client'

import { useState, useEffect } from 'react'

const LIVE_STATS_URL = 'https://lumina-api-production-ac85.up.railway.app/api/v1/live-stats'

/**
 * Top status bar. Shows the REAL LUMINA price from /api/v1/live-stats (verifiable
 * on-chain). Previous mock values (a random-walk price + fake cumulative burned /
 * active-bets counters) were removed: the price is now live, and cumulative figures
 * require the parked indexer so they are not shown rather than faked.
 */
export function TopBar() {
  const [price, setPrice] = useState<number | null>(null)
  useEffect(() => {
    const ctrl = new AbortController()
    fetch(LIVE_STATS_URL, { signal: ctrl.signal, cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.luminaPrice?.usd != null) setPrice(d.luminaPrice.usd)
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  return (
    <div className="rd-topbar">
      <div className="rd-topbar-inner">
        <div className="rd-topbar-item">
          <span className="rd-live-dot" /> <span>BURN ENGINE</span> <b>ACTIVE</b>
        </div>
        <span className="rd-topbar-divider">·</span>
        <div className="rd-topbar-item">
          <span>LUMINA / USDC</span>
          <b className="mono">{price != null ? `$${price.toFixed(4)}` : '—'}</b>
        </div>
        <span className="rd-topbar-divider">·</span>
        <div className="rd-topbar-item">
          <span>BASE SEPOLIA</span> <b>TESTNET</b>
        </div>
        <span className="rd-topbar-divider">·</span>
        <div className="rd-topbar-item">
          <span>CHAINLINK</span> <b>OK</b>
        </div>
      </div>
    </div>
  )
}
