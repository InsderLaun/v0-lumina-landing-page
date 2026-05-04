'use client'

import '@/components/lumina/redesign/redesign.css'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Github, ExternalLink, FileText } from 'lucide-react'
import { TopBar } from '@/components/lumina/redesign/TopBar'
import { Nav } from '@/components/lumina/redesign/Nav'
import { SiteFooter } from '@/components/lumina/redesign/SiteFooter'
import { SkillCardV2 } from '@/components/lumina/redesign/SkillCardV2'
import { SKILLS, type Audience, type Category } from '@/lib/skills'

const AUDIENCES: ('all' | Audience)[] = ['all', 'human', 'agent']
const CATEGORIES: ('all' | Category)[] = [
  'all',
  'discover',
  'quote',
  'buy',
  'monitor',
  'claim',
  'marketplace',
  'integration',
]

const CATEGORY_LABEL: Record<Category | 'all', string> = {
  all: 'All',
  discover: '🔍 Discover',
  quote: '💰 Quote',
  buy: '🛒 Buy',
  monitor: '📊 Monitor',
  claim: '🎁 Claim',
  marketplace: '🔄 Marketplace',
  integration: '🔧 Integration',
}

export default function SkillsPage() {
  const [audience, setAudience] = useState<'all' | Audience>('all')
  const [category, setCategory] = useState<'all' | Category>('all')

  const filtered = useMemo(() => {
    return SKILLS.filter((s) => {
      const okAud =
        audience === 'all' || s.audience === audience || s.audience === 'both'
      const okCat = category === 'all' || s.category === category
      return okAud && okCat
    })
  }, [audience, category])

  // Distribution stats for header
  const total = SKILLS.length
  const todoCount = SKILLS.filter((s) => s.todoNote).length

  return (
    <div className="rd-page">
      <TopBar />
      <Nav />

      <main style={{ paddingBottom: 64 }}>
        <div className="wrap" style={{ paddingTop: 24, paddingBottom: 8 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 11,
              color: 'var(--rd-text-3)',
              letterSpacing: '0.06em',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={11} /> Back to home
          </Link>
        </div>

        <header className="rd-wp-hero">
          <div className="wrap">
            <span className="rd-eyebrow">
              Skills · {total} actionable · {SKILLS.filter((s) => s.audience === 'agent').length} agent · {SKILLS.filter((s) => s.audience === 'human').length} human · {SKILLS.filter((s) => s.audience === 'both').length} both
            </span>
            <h1>
              What you (or your <em>agent</em>) can do.
            </h1>
            <p className="rd-lede">
              Every skill maps to a real contract function or REST endpoint. Click any card to jump
              to the source on GitHub. {todoCount > 0 && `${todoCount} skills marked "doc pending" — fallback to repo README.`}
            </p>
          </div>
        </header>

        {/* View full repo CTA */}
        <section className="wrap" style={{ padding: '32px 32px 0' }}>
          <a
            href="https://github.com/org-lumina/lumina-api"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '20px 24px',
              background: 'var(--rd-surface)',
              border: '1px solid var(--rd-accent)',
              borderRadius: 10,
              boxShadow: '0 0 20px color-mix(in oklab, var(--rd-accent) 12%, transparent)',
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
                width: 44,
                height: 44,
                borderRadius: 8,
                background: 'var(--rd-accent-dim)',
                color: 'var(--rd-accent)',
                border: '1px solid var(--rd-accent-border)',
                flexShrink: 0,
              }}
            >
              <Github size={22} />
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
                Looking for everything?
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 500,
                  color: 'var(--rd-text)',
                  letterSpacing: '-0.01em',
                }}
              >
                View complete API repo on GitHub
              </div>
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
              org-lumina/lumina-api <ExternalLink size={12} />
            </span>
          </a>
        </section>

        {/* Filters */}
        <section className="wrap" style={{ padding: '32px 32px 16px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              padding: 16,
              background: 'var(--rd-surface)',
              border: '1px solid var(--rd-line)',
              borderRadius: 10,
            }}
          >
            <FilterGroup
              label="AUDIENCE"
              options={AUDIENCES}
              value={audience}
              onChange={setAudience}
            />
            <div style={{ width: 1, background: 'var(--rd-line)', alignSelf: 'stretch' }} />
            <FilterGroup
              label="CATEGORY"
              options={CATEGORIES}
              value={category}
              onChange={(v) => setCategory(v as 'all' | Category)}
              labelMap={CATEGORY_LABEL}
            />
            <div style={{ flex: 1 }} />
            <span
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 11,
                color: 'var(--rd-text-3)',
                letterSpacing: '0.06em',
                alignSelf: 'center',
              }}
            >
              SHOWING {filtered.length} of {total}
            </span>
          </div>
        </section>

        {/* Grid */}
        <section className="wrap" style={{ padding: '0 32px 32px' }}>
          {filtered.length === 0 ? (
            <div
              style={{
                padding: 32,
                background: 'var(--rd-surface)',
                border: '1px solid var(--rd-line)',
                borderRadius: 8,
                textAlign: 'center',
                color: 'var(--rd-text-2)',
              }}
            >
              No skills match these filters.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 14,
              }}
            >
              {filtered.map((s) => (
                <SkillCardV2 key={s.id} skill={s} />
              ))}
            </div>
          )}
        </section>

        {/* Footer CTAs */}
        <section className="wrap" style={{ padding: '32px 32px 0' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 12,
            }}
          >
            <FooterCta
              icon={<FileText size={16} />}
              title="Read API documentation"
              href="https://github.com/org-lumina/lumina-api/blob/main/README.md"
            />
            <FooterCta
              icon={<Github size={16} />}
              title="Browse contract source code"
              href="https://github.com/org-lumina/LUMINA-PROTOCOL/tree/main/src"
            />
            <FooterCta
              icon={<FileText size={16} />}
              title="SKILL-V4.1.md (canonical spec)"
              href="https://github.com/org-lumina/LUMINA-PROTOCOL/blob/main/docs/SKILL-V4.1.md"
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  labelMap,
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (v: T) => void
  labelMap?: Record<string, string>
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      <span
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 10,
          color: 'var(--rd-text-3)',
          letterSpacing: '0.1em',
          marginRight: 6,
        }}
      >
        {label} ·
      </span>
      {options.map((opt) => {
        const isOn = value === opt
        const label = labelMap?.[opt] ?? (opt === 'all' ? 'All' : opt.toUpperCase())
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: '5px 10px',
              borderRadius: 4,
              fontSize: 11,
              background: isOn ? 'var(--rd-accent-dim)' : 'transparent',
              color: isOn ? 'var(--rd-accent)' : 'var(--rd-text-3)',
              border: `1px solid ${isOn ? 'var(--rd-accent)' : 'var(--rd-line)'}`,
              fontFamily: 'var(--font-jetbrains), monospace',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

function FooterCta({ icon, title, href }: { icon: React.ReactNode; title: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        background: 'var(--rd-surface)',
        border: '1px solid var(--rd-line)',
        borderRadius: 8,
        textDecoration: 'none',
        color: 'var(--rd-text-2)',
        fontSize: 13,
      }}
    >
      <span style={{ color: 'var(--rd-accent)' }}>{icon}</span>
      <span style={{ flex: 1 }}>{title}</span>
      <ExternalLink size={12} style={{ color: 'var(--rd-text-3)' }} />
    </a>
  )
}
