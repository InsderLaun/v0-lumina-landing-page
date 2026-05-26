'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bot, User } from 'lucide-react'
import { LiveStatusBadge } from './LiveStatusBadge'

const BURN_EVENTS = [
  { t: '00:42 UTC', action: 'Flash BTC 1h', amount: '+ 2.92 USDC', lumina: '80.2 LUMINA' },
  { t: '00:38 UTC', action: 'Flash ETH 24h', amount: '+ 45.80 USDC', lumina: '1,258.2 LUMINA' },
  { t: '00:31 UTC', action: 'Flash BTC 48h', amount: '+ 148.67 USDC', lumina: '4,083.5 LUMINA' },
  { t: '00:27 UTC', action: 'Bond resale 3%', amount: '+ 12.00 USDC', lumina: '329.7 LUMINA' },
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
        <div className="rd-hero-eyebrow" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span className="rd-dot" />
            <span>v5.3 · Base Sepolia · Flash Shield Adapters · ClaimBond Model</span>
          </span>
          <LiveStatusBadge />
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
              Bet against market chaos on Base L2. Every losing premium routes through the
              AdaptiveFeeDistributor and burns $LUMINA on the open market — 85% of every premium
              dollar destroyed forever. Every winning bet mints a ClaimBond — fixed-USD, 730-day,
              redeemable in $LUMINA at market price.
            </p>
            <p
              className="rd-hero-sub"
              style={{ marginTop: 8, fontSize: 14, color: 'var(--rd-text-3)' }}
            >
              Six flash products live on Base Sepolia · BTC + ETH · 1h / 24h / 48h windows. Parametric
              DeFi insurance — built for AI agents. Install:{' '}
              <code
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 13,
                  color: 'var(--rd-text-1)',
                }}
              >
                npm install @lumina-org/sdk@^0.6.0
              </code>
            </p>
            <div className="rd-hero-cta">
              <a
                className="rd-btn rd-btn-primary"
                href="#sdk"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Bot size={16} aria-hidden="true" />
                Connect AI agent
              </a>
              <Link
                className="rd-btn rd-btn-ghost"
                href="/app/human/products"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <User size={16} aria-hidden="true" />
                I&apos;m a human
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
