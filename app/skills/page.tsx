'use client'

import '@/components/lumina/redesign/redesign.css'

import { useState } from 'react'
import { TopBar } from '@/components/lumina/redesign/TopBar'
import { Nav } from '@/components/lumina/redesign/Nav'
import { SiteFooter } from '@/components/lumina/redesign/SiteFooter'

type Mode = 'human' | 'agent'

// Sprint 1.5 (separate prompt) replaces the placeholder skill cards with the
// full LUMINA-SKILL.txt v4.1 catalog + filterable search + difficulty tags.
const PLACEHOLDER_SKILLS = [
  { id: '01', audience: 'agent' as Mode, title: 'Quote a parametric policy', desc: 'POST /api/v2/quote with shieldId + cover. Returns premium + maturity.' },
  { id: '02', audience: 'agent' as Mode, title: 'Buy a policy via API', desc: 'Sign + POST /api/v2/purchase. Premium routes to TWAPBurner atomically.' },
  { id: '03', audience: 'agent' as Mode, title: 'Watch oracle triggers', desc: 'Subscribe to ShieldKeeper events; webhook fires on trigger.' },
  { id: '04', audience: 'human' as Mode, title: 'Connect wallet via RainbowKit', desc: 'MetaMask, Coinbase, WalletConnect. Auto-switches to Base Sepolia.' },
  { id: '05', audience: 'human' as Mode, title: 'Redeem a matured ClaimBond', desc: 'After 24-month maturity, redeem face-value worth of $LUMINA.' },
  { id: '06', audience: 'human' as Mode, title: 'List a bond on the marketplace', desc: 'Set ask price; marketplace takes 3% fee, 100% burned.' },
] as const

export default function SkillsPage() {
  const [mode, setMode] = useState<Mode | 'all'>('all')

  const filtered =
    mode === 'all' ? PLACEHOLDER_SKILLS : PLACEHOLDER_SKILLS.filter((s) => s.audience === mode)

  return (
    <div className="rd-page">
      <TopBar />
      <Nav />

      <header className="rd-wp-hero">
        <div className="wrap">
          <span className="rd-eyebrow">AI Agent Skills · Catalog</span>
          <h1>
            What your <em>agent</em> can do.
          </h1>
          <p className="rd-lede">
            Drop-in skills for AI agents (autonomous bots) and humans (manual operators). Full
            catalog with descriptions, code samples, and difficulty lands in Sprint 1.5.
          </p>
        </div>
      </header>

      <main className="rd-wp-versions">
        <div className="wrap">
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--rd-surface)',
              border: '1px solid var(--rd-line)',
              borderRadius: 999,
              padding: 4,
              gap: 4,
              marginBottom: 32,
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 12,
              letterSpacing: '0.04em',
            }}
          >
            {(['all', 'human', 'agent'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 999,
                  background: mode === m ? 'var(--rd-accent)' : 'transparent',
                  color: mode === m ? '#00121a' : 'var(--rd-text-2)',
                  fontWeight: mode === m ? 600 : 500,
                  textTransform: 'uppercase',
                  border: 0,
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >
                {m}
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 16,
            }}
          >
            {filtered.map((s) => (
              <div
                key={s.id}
                style={{
                  background: 'var(--rd-surface)',
                  border: '1px solid var(--rd-line)',
                  borderRadius: 14,
                  padding: 28,
                  transition: 'border-color .2s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains), monospace',
                      fontSize: 11,
                      color: 'var(--rd-text-3)',
                      letterSpacing: '0.12em',
                    }}
                  >
                    SKILL · {s.id}
                  </span>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontFamily: 'var(--font-jetbrains), monospace',
                      fontSize: 10,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      background: s.audience === 'agent' ? 'var(--rd-accent-dim)' : 'rgba(245,158,11,0.1)',
                      color: s.audience === 'agent' ? 'var(--rd-accent)' : 'var(--rd-warn)',
                      border: `1px solid ${s.audience === 'agent' ? 'var(--rd-accent-border)' : 'rgba(245,158,11,0.25)'}`,
                    }}
                  >
                    {s.audience}
                  </span>
                </div>
                <h4
                  style={{
                    fontSize: 18,
                    color: 'var(--rd-text)',
                    marginBottom: 10,
                    letterSpacing: '-0.01em',
                    fontWeight: 600,
                  }}
                >
                  {s.title}
                </h4>
                <p
                  style={{
                    color: 'var(--rd-text-2)',
                    fontSize: 14,
                    lineHeight: 1.55,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
