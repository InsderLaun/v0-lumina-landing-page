'use client'

import Link from 'next/link'
import { Construction, ArrowRight } from 'lucide-react'

interface Props {
  /** Sidebar slug, e.g. "earnings" — shown in the eyebrow. */
  slug: string
  /** Big H1 line. */
  title: string
  /** One sentence "what this will be" pitch. */
  pitch: string
  /** Bulleted list of what the founder needs to ship the real version. */
  blockers: string[]
  /** Optional CTAs to existing routes that already cover part of the use case. */
  alternatives?: Array<{ href: string; label: string }>
}

/**
 * Common stub for the agent supervisor tabs that need backend infrastructure
 * we haven't built yet (earnings P&L aggregation, activity audit log, webhook
 * delivery worker). Renders a tidy "in progress" page so the sidebar slot
 * doesn't 404, with a clear list of what still needs to ship.
 */
export function InProgressStub({ slug, title, pitch, blockers, alternatives = [] }: Props) {
  return (
    <div style={{ padding: '28px 32px', maxWidth: 720 }}>
      <div
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
          color: 'var(--rd-text-3)',
          letterSpacing: '0.1em',
          marginBottom: 6,
        }}
      >
        /APP/AGENT/{slug.toUpperCase()}
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontSize: 32,
          fontWeight: 300,
          letterSpacing: '-0.02em',
          margin: '0 0 12px',
        }}
      >
        {title}
      </h1>
      <p style={{ color: 'var(--rd-text-2)', fontSize: 14, lineHeight: 1.6, marginBottom: 22 }}>
        {pitch}
      </p>

      <div
        style={{
          background: 'var(--rd-surface)',
          border: '1px solid color-mix(in oklab, var(--rd-warn) 33%, transparent)',
          borderRadius: 10,
          padding: 22,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(245,158,11,0.15)',
              color: 'var(--rd-warn)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Construction size={16} />
          </span>
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 11,
              letterSpacing: '0.08em',
              color: 'var(--rd-warn)',
              textTransform: 'uppercase',
            }}
          >
            In progress — backend work pending
          </span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--rd-text-2)', lineHeight: 1.6 }}>
          What still needs to ship for this tab to be live:
          <ul style={{ marginTop: 8, paddingLeft: 22 }}>
            {blockers.map((b, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {alternatives.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <div
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 10,
              letterSpacing: '0.1em',
              color: 'var(--rd-text-3)',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            What you can do today
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {alternatives.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--rd-accent)',
                  textDecoration: 'none',
                  fontSize: 13,
                }}
              >
                {a.label} <ArrowRight size={13} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
