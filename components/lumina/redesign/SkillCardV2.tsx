import { ExternalLink } from 'lucide-react'
import type { Skill } from '@/lib/skills'

const AUDIENCE_STYLES: Record<Skill['audience'], { color: string; label: string }> = {
  human: { color: 'var(--rd-warn)', label: 'HUMAN' },
  agent: { color: 'var(--rd-accent)', label: 'AGENT' },
  both: { color: 'var(--rd-accent-2)', label: 'BOTH' },
}

const CATEGORY_LABEL: Record<Skill['category'], string> = {
  discover: '🔍 DISCOVER',
  quote: '💰 QUOTE',
  buy: '🛒 BUY',
  monitor: '📊 MONITOR',
  claim: '🎁 CLAIM',
  marketplace: '🔄 MARKETPLACE',
  integration: '🔧 INTEGRATION',
}

function difficultyStars(d: 1 | 2 | 3): string {
  return '⭐'.repeat(d) + (d === 1 ? '   Easy' : d === 2 ? '   Medium' : '   Advanced')
}

export function SkillCardV2({ skill }: { skill: Skill }) {
  const aud = AUDIENCE_STYLES[skill.audience]
  return (
    <a
      href={skill.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--rd-surface)',
        border: '1px solid var(--rd-line)',
        borderRadius: 10,
        padding: 22,
        textDecoration: 'none',
        color: 'var(--rd-text)',
        transition: 'transform .15s, border-color .15s',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 240,
      }}
      className="rd-skill-card-v2"
    >
      {/* Header: skill # + audience pill */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
          letterSpacing: '0.06em',
        }}
      >
        <span style={{ color: 'var(--rd-text-3)' }}>SKILL · {skill.number}</span>
        <span
          style={{
            padding: '3px 8px',
            borderRadius: 4,
            fontSize: 10,
            color: aud.color,
            background: `color-mix(in oklab, ${aud.color} 10%, transparent)`,
            border: `1px solid color-mix(in oklab, ${aud.color} 33%, transparent)`,
            textTransform: 'uppercase',
          }}
        >
          {aud.label}
        </span>
      </div>

      {/* Category pill */}
      <div
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 10,
          color: 'var(--rd-text-3)',
          letterSpacing: '0.08em',
          marginBottom: 8,
        }}
      >
        {CATEGORY_LABEL[skill.category]}
      </div>

      {/* Title */}
      <h4
        style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontWeight: 500,
          fontSize: 18,
          color: 'var(--rd-text)',
          margin: '0 0 10px',
          letterSpacing: '-0.01em',
          lineHeight: 1.25,
        }}
      >
        {skill.title}
      </h4>

      {/* Description */}
      <p
        style={{
          color: 'var(--rd-text-2)',
          fontSize: 13,
          lineHeight: 1.55,
          marginBottom: 14,
          flex: 1,
        }}
      >
        {skill.description}
      </p>

      {/* Contract / API hint */}
      {(skill.contractFn || skill.apiEndpoint) && (
        <div
          style={{
            background: 'var(--rd-surface-2)',
            border: '1px solid var(--rd-line)',
            borderRadius: 4,
            padding: '6px 10px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            color: 'var(--rd-accent)',
            marginBottom: 12,
            wordBreak: 'break-word',
          }}
        >
          {skill.contractFn ?? skill.apiEndpoint}
        </div>
      )}

      {/* Tags + difficulty */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          marginBottom: 12,
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 10,
          color: 'var(--rd-text-3)',
        }}
      >
        {skill.tags.map((t) => (
          <span
            key={t}
            style={{
              padding: '2px 6px',
              border: '1px solid var(--rd-line)',
              borderRadius: 3,
              letterSpacing: '0.04em',
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 10,
          color: 'var(--rd-text-4)',
          marginBottom: 10,
          letterSpacing: '0.04em',
        }}
      >
        {difficultyStars(skill.difficulty)}
      </div>

      {/* Footer: GitHub link + TODO badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          borderTop: '1px solid var(--rd-line)',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
        }}
      >
        <span style={{ color: 'var(--rd-accent)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          📄 View on GitHub <ExternalLink size={11} />
        </span>
        {skill.todoNote && (
          <span
            style={{
              padding: '2px 6px',
              borderRadius: 3,
              fontSize: 9,
              color: 'var(--rd-warn)',
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.33)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
            title={skill.todoNote}
          >
            doc pending
          </span>
        )}
      </div>
    </a>
  )
}
