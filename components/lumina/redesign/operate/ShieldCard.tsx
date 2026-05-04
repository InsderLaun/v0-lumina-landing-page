'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatUnits } from 'viem'
import { ASSET_COLORS, COVER_MIN_USDC, COVER_MAX_USDC, type ShieldDescriptor } from '@/lib/operate/products'

interface ShieldCardProps {
  shield: ShieldDescriptor
  /** Premium for $1000 cover, in USDC base units (6 decimals). */
  premium1k?: bigint
  /** Per-product paused flag (CoverRouterV2.getProductConfig().active === false). */
  paused?: boolean
  /** Globally paused (auto-pause from low LUMINA price). */
  globalPaused?: boolean
}

export function ShieldCard({ shield, premium1k, paused, globalPaused }: ShieldCardProps) {
  const isPaused = paused || globalPaused
  const premiumLabel =
    premium1k !== undefined
      ? `$${Number(formatUnits(premium1k, 6)).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
      : '—'

  return (
    <Link
      href={isPaused ? '#' : `/app/human/products/${shield.slug}`}
      onClick={isPaused ? (e) => e.preventDefault() : undefined}
      style={{
        background: 'var(--rd-surface)',
        border: '1px solid var(--rd-line)',
        borderRadius: 8,
        padding: 18,
        cursor: isPaused ? 'not-allowed' : 'pointer',
        opacity: isPaused ? 0.5 : 1,
        transition: 'all .15s',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 240,
        textDecoration: 'none',
        color: 'var(--rd-text)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: ASSET_COLORS[shield.asset],
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {shield.asset.slice(0, 1)}
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 8px',
            borderRadius: 4,
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 10,
            letterSpacing: '0.06em',
            color: isPaused ? 'var(--rd-text-3)' : 'var(--rd-pos)',
            background: isPaused ? 'transparent' : 'rgba(0, 212, 138, 0.1)',
            border: `1px solid ${isPaused ? 'var(--rd-line-strong)' : 'rgba(0, 212, 138, 0.33)'}`,
            textTransform: 'uppercase',
          }}
        >
          {isPaused ? 'PAUSED' : '● ACTIVE'}
        </span>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 10,
          color: 'var(--rd-text-3)',
          letterSpacing: '0.06em',
          marginBottom: 4,
        }}
      >
        {shield.duration.toUpperCase()} · TIER {shield.tier}
      </div>
      <h4
        style={{
          fontSize: 16,
          fontWeight: 500,
          marginBottom: 10,
          letterSpacing: '-0.01em',
          color: 'var(--rd-text)',
        }}
      >
        {shield.name}
      </h4>

      <div
        style={{
          background: 'var(--rd-surface-2)',
          border: '1px solid var(--rd-line)',
          borderRadius: 6,
          padding: '8px 10px',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
          color: 'var(--rd-text-2)',
          marginBottom: 14,
          minHeight: 32,
        }}
      >
        TRIG · {shield.trigger}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          fontSize: 11,
          marginBottom: 14,
          color: 'var(--rd-text-3)',
        }}
      >
        <div>
          Cover
          <br />
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              color: 'var(--rd-text)',
              fontSize: 12,
            }}
          >
            ${COVER_MIN_USDC}–${(COVER_MAX_USDC / 1000).toFixed(0)}k
          </span>
        </div>
        <div>
          Multiplier
          <br />
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              color: 'var(--rd-accent)',
              fontSize: 12,
            }}
          >
            {shield.multLabel}
          </span>
        </div>
        <div>
          Hist. prob
          <br />
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              color: 'var(--rd-text)',
              fontSize: 12,
            }}
          >
            {shield.probLabel}
          </span>
        </div>
        <div>
          Premium $1k
          <br />
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              color: 'var(--rd-text)',
              fontSize: 12,
            }}
          >
            {premiumLabel}
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '8px 12px',
          background: isPaused ? 'transparent' : 'var(--rd-accent)',
          color: isPaused ? 'var(--rd-text-3)' : '#00121a',
          border: `1px solid ${isPaused ? 'var(--rd-line-strong)' : 'var(--rd-accent)'}`,
          borderRadius: 4,
          fontFamily: 'var(--font-inter), sans-serif',
          fontWeight: 600,
          fontSize: 12,
        }}
      >
        {isPaused ? 'Paused' : 'Get protected'} {!isPaused && <ArrowRight size={12} />}
      </div>
    </Link>
  )
}
