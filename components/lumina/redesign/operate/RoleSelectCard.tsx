'use client'

import Link from 'next/link'
import { User, Bot, ArrowRight } from 'lucide-react'

interface RoleSelectCardProps {
  href: string
  variant: 'human' | 'agent'
  title: string
  description: string
  bullets: readonly string[]
  cta: string
}

export function RoleSelectCard({
  href,
  variant,
  title,
  description,
  bullets,
  cta,
}: RoleSelectCardProps) {
  const isAgent = variant === 'agent'
  const accent = isAgent ? 'var(--rd-warn)' : 'var(--rd-accent)'
  const Icon = isAgent ? Bot : User

  return (
    <Link
      href={href}
      style={{
        background: 'var(--rd-surface)',
        border: `1px solid ${isAgent ? 'var(--rd-line)' : 'var(--rd-line-strong)'}`,
        borderRadius: 10,
        padding: 32,
        position: 'relative',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'var(--rd-text)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'border-color .15s, transform .15s',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: accent,
        }}
      />
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 4,
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 10,
          letterSpacing: '0.06em',
          color: accent,
          background: isAgent ? 'rgba(245, 158, 11, 0.1)' : 'var(--rd-accent-dim)',
          border: `1px solid ${
            isAgent ? 'rgba(245, 158, 11, 0.33)' : 'var(--rd-accent-border)'
          }`,
          textTransform: 'uppercase',
          alignSelf: 'flex-start',
        }}
      >
        <Icon size={12} /> {isAgent ? 'AGENT SUPERVISOR' : 'HUMAN'}
      </span>

      <h3
        style={{
          fontSize: 26,
          fontWeight: 500,
          margin: 0,
          letterSpacing: '-0.01em',
          color: 'var(--rd-text)',
        }}
      >
        {title}
      </h3>

      <p style={{ color: 'var(--rd-text-2)', fontSize: 13, lineHeight: 1.55, margin: 0 }}>
        {description}
      </p>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          fontSize: 12,
          fontFamily: 'var(--font-jetbrains), monospace',
          color: 'var(--rd-text-3)',
        }}
      >
        {bullets.map((b) => (
          <li key={b}>· {b}</li>
        ))}
      </ul>

      <div style={{ flex: 1 }} />

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '10px 16px',
          background: isAgent ? 'transparent' : 'var(--rd-accent)',
          color: isAgent ? 'var(--rd-text)' : '#00121a',
          border: `1px solid ${isAgent ? 'var(--rd-line-strong)' : 'var(--rd-accent)'}`,
          borderRadius: 6,
          fontWeight: 600,
          fontSize: 13,
          fontFamily: 'var(--font-inter), sans-serif',
        }}
      >
        {cta} <ArrowRight size={14} />
      </div>
    </Link>
  )
}
