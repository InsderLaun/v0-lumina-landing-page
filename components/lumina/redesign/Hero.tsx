'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const BURN_EVENTS = [
  { t: '00:42 UTC', action: 'Flash BTC 1h', amount: '+ 12.40 USDC', lumina: '344.4 LUMINA' },
  { t: '00:38 UTC', action: 'Micro Depeg', amount: '+ 42.00 USDC', lumina: '1,166.6 LUMINA' },
  { t: '00:31 UTC', action: 'Flash ETH 24h', amount: '+ 8.00 USDC', lumina: '222.2 LUMINA' },
  { t: '00:27 UTC', action: 'Bond resale 3%', amount: '+ 12.00 USDC', lumina: '333.3 LUMINA' },
] as const

export function Hero() {
  const [feed, setFeed] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setFeed((f) => (f + 1) % BURN_EVENTS.length), 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="rd-hero">
      <div className="wrap">
        <div className="rd-hero-eyebrow">
          <span className="rd-dot" />
          <span>v5.1 · Base Sepolia · ClaimBond Model · Live</span>
        </div>
        <div className="rd-hero-grid">
          <div>
            <h1>
              Algorithmic risk
              <br />
              speculation, <em>settled</em>
              <br />
              by oracles, <em>burned</em>
              <br />
              by code.
            </h1>
            <p className="rd-hero-sub">
              Bet against market chaos on Base L2. Every losing premium buys $LUMINA on the open
              market and burns it forever. Every winning bet mints a ClaimBond — fixed-USD, 24-month,
              redeemable in $LUMINA.
            </p>
            <div className="rd-hero-cta">
              <a className="rd-btn rd-btn-primary" href="#products">
                Speculate now →
              </a>
              <a className="rd-btn rd-btn-ghost" href="#bonds">
                How bonds work
              </a>
              <Link className="rd-btn rd-btn-ghost" href="/whitepaper">
                Read whitepaper
              </Link>
            </div>
          </div>

          <aside className="rd-hero-side">
            <div className="rd-hero-side-title">Protocol Snapshot · Live</div>
            <div className="rd-stat-row">
              <span className="rd-stat-label">$LUMINA Price</span>
              <span className="rd-stat-right">
                <span className="rd-stat-val rd-accent">$0.0364</span>
                <span className="rd-stat-delta">+2.31%</span>
              </span>
            </div>
            <div className="rd-stat-row">
              <span className="rd-stat-label">Total Burned</span>
              <span className="rd-stat-right">
                <span className="rd-stat-val">1,284,402</span>
              </span>
            </div>
            <div className="rd-stat-row">
              <span className="rd-stat-label">Bond Reserve</span>
              <span className="rd-stat-right">
                <span className="rd-stat-val">82,000,000</span>
              </span>
            </div>
            <div className="rd-stat-row">
              <span className="rd-stat-label">Active ClaimBonds</span>
              <span className="rd-stat-right">
                <span className="rd-stat-val">2,184</span>
              </span>
            </div>
            <div className="rd-stat-row">
              <span className="rd-stat-label">Burn Ratio (30d)</span>
              <span className="rd-stat-right">
                <span className="rd-stat-val">1.50</span>
                <span className="rd-stat-delta">stable</span>
              </span>
            </div>
          </aside>
        </div>

        <div className="rd-burn-feed">
          {BURN_EVENTS.map((e, i) => (
            <div key={i} className={`rd-burn-feed-item ${i === feed ? 'rd-lit' : ''}`}>
              <span className="rd-meta">
                {e.t} · {e.action}
              </span>
              <span className="rd-v">
                {e.amount} → {e.lumina} burned
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
