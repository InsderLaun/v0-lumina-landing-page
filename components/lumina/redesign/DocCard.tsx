import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { type ReactNode } from 'react'

const BADGE_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  new: {
    color: 'var(--rd-accent)',
    bg: 'var(--rd-accent-dim)',
    border: 'var(--rd-accent-border)',
  },
  deprecated: {
    color: 'var(--rd-warn)',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.33)',
  },
  historical: {
    color: 'var(--rd-text-3)',
    bg: 'transparent',
    border: 'var(--rd-line-strong)',
  },
}

export interface DocCardProps {
  title: string
  description: string
  href: string
  /** Default `true` for GitHub/Basescan; `false` for in-app routes like /whitepaper/*. */
  external?: boolean
  icon?: ReactNode
  badge?: string
  cta?: string
  /** Optional repo chip text shown in the footer (e.g., 'lumina-api'). */
  repo?: string
}

export function DocCard({
  title,
  description,
  href,
  external = true,
  icon,
  badge,
  cta,
  repo,
}: DocCardProps) {
  const badgeStyle = badge ? BADGE_STYLE[badge] ?? BADGE_STYLE.deprecated : null

  const content = (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        {icon && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--rd-accent-dim)',
              color: 'var(--rd-accent)',
              border: '1px solid var(--rd-accent-border)',
            }}
          >
            {icon}
          </span>
        )}
        {badgeStyle && (
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 4,
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 10,
              letterSpacing: '0.06em',
              color: badgeStyle.color,
              background: badgeStyle.bg,
              border: `1px solid ${badgeStyle.border}`,
              textTransform: 'uppercase',
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <h4
        style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontWeight: 500,
          fontSize: 19,
          color: 'var(--rd-text)',
          margin: '0 0 8px',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h4>
      <p
        style={{
          color: 'var(--rd-text-2)',
          fontSize: 13,
          lineHeight: 1.55,
          marginBottom: 14,
          flex: 1,
        }}
      >
        {description}
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 10,
          borderTop: '1px solid var(--rd-line)',
          gap: 10,
        }}
      >
        {repo && (
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 10,
              color: 'var(--rd-text-3)',
              padding: '2px 6px',
              border: '1px solid var(--rd-line)',
              borderRadius: 3,
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 180,
            }}
          >
            {repo}
          </span>
        )}
        <span
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 12,
            color: 'var(--rd-accent)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginLeft: 'auto',
          }}
        >
          {cta ?? (external ? 'View on GitHub' : 'Open')}
          {external ? <ExternalLink size={12} /> : <span>→</span>}
        </span>
      </div>
    </>
  )

  const sharedStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--rd-surface)',
    border: '1px solid var(--rd-line)',
    borderRadius: 10,
    padding: 22,
    textDecoration: 'none',
    color: 'var(--rd-text)',
    transition: 'transform .15s, border-color .15s',
    minHeight: 160,
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="rd-doc-card"
        style={sharedStyle}
      >
        {content}
      </a>
    )
  }
  return (
    <Link href={href} className="rd-doc-card" style={sharedStyle}>
      {content}
    </Link>
  )
}
