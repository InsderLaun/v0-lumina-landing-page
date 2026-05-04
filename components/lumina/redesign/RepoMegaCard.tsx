import { Github, ExternalLink } from 'lucide-react'

interface RepoChip {
  name: string
  description: string
  url: string
}

interface RepoMegaCardProps {
  title: string
  subtitle: string
  href: string
  /** Optional 3 repo chips shown to the right (or below on mobile). */
  repos?: readonly RepoChip[]
}

export function RepoMegaCard({ title, subtitle, href, repos }: RepoMegaCardProps) {
  return (
    <div
      style={{
        background: 'var(--rd-surface)',
        border: '1px solid var(--rd-accent)',
        borderRadius: 12,
        boxShadow: '0 0 24px color-mix(in oklab, var(--rd-accent) 14%, transparent)',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          textDecoration: 'none',
          color: 'var(--rd-text)',
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

      {repos && repos.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${repos.length}, 1fr)`,
            gap: 10,
            paddingTop: 16,
            borderTop: '1px solid var(--rd-line)',
          }}
          className="rd-repo-chips"
        >
          {repos.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                padding: '12px 14px',
                background: 'var(--rd-surface-2)',
                border: '1px solid var(--rd-line)',
                borderRadius: 8,
                textDecoration: 'none',
                color: 'var(--rd-text)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: 11,
                  color: 'var(--rd-accent)',
                  letterSpacing: '0.04em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Github size={11} /> {r.name}
              </span>
              <span style={{ fontSize: 11, color: 'var(--rd-text-3)' }}>{r.description}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
