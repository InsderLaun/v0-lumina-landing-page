import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { type ReactNode } from 'react'

export interface DocCardProps {
  title: string
  description: string
  href: string
  /** Default `true` for GitHub/Basescan; `false` for in-app routes like /whitepaper/*. */
  external?: boolean
  icon?: ReactNode
  badge?: string
  cta?: string
}

export function DocCard({
  title,
  description,
  href,
  external = true,
  icon,
  badge,
  cta,
}: DocCardProps) {
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
        {badge && (
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 4,
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 10,
              letterSpacing: '0.06em',
              color: 'var(--rd-warn)',
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.33)',
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
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 12,
          color: 'var(--rd-accent)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          paddingTop: 10,
          borderTop: '1px solid var(--rd-line)',
        }}
      >
        {cta ?? (external ? 'View on GitHub' : 'Open')}
        {external ? <ExternalLink size={12} /> : <span>→</span>}
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
