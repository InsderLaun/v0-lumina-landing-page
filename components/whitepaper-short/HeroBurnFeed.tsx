// components/whitepaper-short/HeroBurnFeed.tsx
'use client'
import { useEffect, useMemo, useState } from 'react'

const BASE = [
  { time: '14:32:08', usdc: '$0.24', lum: '0.184', tx: '0xab4d…' },
  { time: '14:31:47', usdc: '$1.12', lum: '0.861', tx: '0x9f2e…' },
  { time: '14:31:22', usdc: '$0.48', lum: '0.369', tx: '0x71c3…' },
  { time: '14:30:59', usdc: '$2.04', lum: '1.568', tx: '0x4d18…' },
  { time: '14:30:31', usdc: '$0.84', lum: '0.646', tx: '0x822a…' },
  { time: '14:30:02', usdc: '$0.36', lum: '0.276', tx: '0xe4f1…' },
]

export function HeroBurnFeed({ label }: { label: string }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000)
    return () => clearInterval(id)
  }, [])
  const rows = useMemo(() => BASE.map((_, i) => BASE[(i + tick) % BASE.length]), [tick])
  return (
    <div className="wp-burn-feed">
      <div className="wp-burn-feed__head">
        <span className="wp-live-dot" /> {label}
      </div>
      <div className="wp-burn-feed__grid">
        {rows.slice(0, 4).map((r, i) => (
          <div key={i} className={`wp-burn-tile ${i === 0 ? 'is-live' : ''}`}>
            <div className="wp-burn-tile__time">{r.time}</div>
            <div className="wp-burn-tile__usdc">{r.usdc}</div>
            <div className="wp-burn-tile__lum">→ {r.lum} LUMINA</div>
            <div className="wp-burn-tile__tx">{r.tx}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
