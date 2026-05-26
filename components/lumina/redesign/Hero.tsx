'use client'

import Link from 'next/link'
import { Bot, User } from 'lucide-react'
import { LiveStatusBadge } from './LiveStatusBadge'

/**
 * Live on-chain stats from `GET /api/v1/live-stats` (fetched server-side in
 * app/page.tsx with ISR). Every field is verifiable on-chain. When `stats` is
 * null (API/RPC unreachable) the snapshot renders "—" rather than a fake number.
 *
 * Cumulative/historical figures (total burned, active ClaimBonds, burn ratio)
 * were intentionally REMOVED — they require the Ponder indexer (parked) and we
 * do not display invented aggregates.
 */
export interface HeroStats {
  luminaPrice: { usd: number }
  bondReserve: { lumina: string }
  capacity: { usedPercent: string }
  totalSupply: { lumina: string }
  lastUpdated?: string
  stale?: boolean
}

function reserveM(luminaStr: string): string {
  const n = Number(luminaStr)
  if (!isFinite(n)) return '—'
  return `${(n / 1_000_000).toFixed(2)}M`
}

export function Hero({ stats }: { stats?: HeroStats | null }) {
  const live = !!stats && !stats.stale
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
                npm install @lumina-org/sdk@^0.7.0
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
            <div
              className="rd-hero-side-title"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
            >
              <span>Protocol Snapshot</span>
              <span
                title={live ? `Live on-chain · updated ${stats?.lastUpdated ?? ''}` : 'Last known (API unreachable)'}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, letterSpacing: '0.06em', color: live ? 'var(--rd-accent)' : 'var(--rd-text-3)' }}
              >
                <span
                  style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: live ? 'var(--rd-accent)' : 'var(--rd-text-3)',
                    boxShadow: live ? '0 0 6px var(--rd-accent)' : 'none',
                    animation: live ? 'rd-pulse 2s infinite' : 'none',
                  }}
                />
                {live ? 'LIVE' : 'LAST KNOWN'}
              </span>
            </div>
            <div className="rd-stat-row">
              <span className="rd-stat-label">$LUMINA Price</span>
              <span className="rd-stat-right">
                <span className="rd-stat-val rd-accent">{stats ? `$${stats.luminaPrice.usd.toFixed(4)}` : '—'}</span>
              </span>
            </div>
            <div className="rd-stat-row">
              <span className="rd-stat-label">Bond Reserve</span>
              <span className="rd-stat-right">
                <span className="rd-stat-val">{stats ? `${reserveM(stats.bondReserve.lumina)} LUMINA` : '—'}</span>
              </span>
            </div>
            <div className="rd-stat-row">
              <span className="rd-stat-label">Capacity Used</span>
              <span className="rd-stat-right">
                <span className="rd-stat-val">{stats ? stats.capacity.usedPercent : '—'}</span>
              </span>
            </div>
            <div className="rd-stat-row">
              <span className="rd-stat-label">Total Supply</span>
              <span className="rd-stat-right">
                <span className="rd-stat-val">{stats ? stats.totalSupply.lumina : '100,000,000'}</span>
                <span className="rd-stat-delta">fixed</span>
              </span>
            </div>
            <div style={{ marginTop: 10, fontSize: 10, color: 'var(--rd-text-3)', letterSpacing: '0.04em' }}>
              {live ? 'Live data from Base Sepolia · refreshed ~60s' : 'Showing last known values · verify on-chain'}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
