import { Github, ExternalLink } from 'lucide-react'

interface RepoMegaCardProps {
  title: string
  subtitle: string
  href: string
}

export function RepoMegaCard({ title, subtitle, href }: RepoMegaCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '24px 28px',
        background: 'var(--rd-surface)',
        border: '1px solid var(--rd-accent)',
        borderRadius: 12,
        boxShadow: '0 0 24px color-mix(in oklab, var(--rd-accent) 14%, transparent)',
        textDecoration: 'none',
        color: 'var(--rd-text)',
        transition: 'all .15s',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 52,
          height: 52,
          borderRadius: 10,
          background: 'var(--rd-accent-dim)',
          color: 'var(--rd-accent)',
          border: '1px solid var(--rd-accent-border)',
          flexShrink: 0,
        }}
      >
        <Github size={24} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            color: 'var(--rd-text-3)',
            letterSpacing: '0.08em',
            marginBottom: 4,
            textTransform: 'uppercase',
          }}
        >
          Open source · public on GitHub
        </div>
        <div
          style={{
            fontSize: 19,
            fontWeight: 500,
            color: 'var(--rd-text)',
            letterSpacing: '-0.01em',
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 13, color: 'var(--rd-text-2)' }}>{subtitle}</div>
      </div>
      <span
        style={{
          color: 'var(--rd-accent)',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 12,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          flexShrink: 0,
        }}
      >
        org-lumina <ExternalLink size={12} />
      </span>
    </a>
  )
}
