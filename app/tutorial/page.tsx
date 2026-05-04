'use client'

import '@/components/lumina/redesign/redesign.css'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { TopBar } from '@/components/lumina/redesign/TopBar'
import { Nav } from '@/components/lumina/redesign/Nav'
import { SiteFooter } from '@/components/lumina/redesign/SiteFooter'

type Mode = 'human' | 'agent'

// Sprint 1.5 (separate prompt) replaces these placeholder steps with the
// full step-by-step tutorial (per-mode flows, screenshots, transaction
// receipts).
const STEPS = [
  { id: '01', title: 'Connect a wallet (or get an API key)' },
  { id: '02', title: 'Pick a shield and read its trigger condition' },
  { id: '03', title: 'Calculate cover, premium, and bond payout' },
  { id: '04', title: 'Approve USDC + buy the policy' },
  { id: '05', title: 'Watch the oracle in real time' },
  { id: '06', title: 'Trigger fires → mint ClaimBond OR no trigger → premium burned' },
  { id: '07', title: 'Sell, hold, or split your bond' },
] as const

export default function TutorialPage() {
  return (
    <div className="rd-page">
      <TopBar />
      <Nav />
      <Suspense fallback={<TutorialFallback />}>
        <TutorialBody />
      </Suspense>
      <SiteFooter />
    </div>
  )
}

function TutorialFallback() {
  return (
    <header className="rd-wp-hero">
      <div className="wrap">
        <span className="rd-eyebrow">Tutorial · loading…</span>
      </div>
    </header>
  )
}

function TutorialBody() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [mode, setMode] = useState<Mode>('human')

  useEffect(() => {
    const m = searchParams.get('mode')
    if (m === 'agent' || m === 'human') setMode(m)
  }, [searchParams])

  const switchMode = (m: Mode) => {
    setMode(m)
    const params = new URLSearchParams(searchParams.toString())
    params.set('mode', m)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <>
      <header className="rd-wp-hero">
        <div className="wrap">
          <span className="rd-eyebrow">Tutorial · 7 steps · {mode.toUpperCase()} mode</span>
          <h1>
            From wallet to <em>bond</em>, end-to-end.
          </h1>
          <p className="rd-lede">
            Step-by-step walkthrough of buying a parametric policy. Toggle modes to switch between
            human (wallet UI) and agent (REST API) flows. Full content lands in Sprint 1.5.
          </p>

          <div
            style={{
              display: 'inline-flex',
              background: 'var(--rd-surface)',
              border: '1px solid var(--rd-line)',
              borderRadius: 999,
              padding: 4,
              gap: 4,
              marginTop: 24,
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 12,
              letterSpacing: '0.04em',
            }}
          >
            {(['human', 'agent'] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
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
        </div>
      </header>

      <main className="rd-wp-versions">
        <div className="wrap" style={{ maxWidth: 820 }}>
          {STEPS.map((s, i) => (
            <article
              key={s.id}
              style={{
                padding: '32px 0 36px',
                borderBottom: i === STEPS.length - 1 ? 0 : '1px solid var(--rd-line)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: 12,
                  letterSpacing: '0.16em',
                  color: 'var(--rd-accent)',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{ width: 24, height: 1, background: 'var(--rd-accent)', display: 'inline-block' }}
                />
                STEP {s.id}
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display), Georgia, serif',
                  fontWeight: 500,
                  fontSize: 28,
                  letterSpacing: '-0.02em',
                  color: 'var(--rd-text)',
                  marginBottom: 12,
                  lineHeight: 1.15,
                }}
              >
                {s.title}
              </h2>
              <p style={{ color: 'var(--rd-text-2)', fontSize: 15, lineHeight: 1.7 }}>
                Sprint 1.5 will populate this step with the {mode === 'agent' ? 'API request' : 'wallet UI'} flow,
                code/screenshot, and on-chain receipt.
              </p>
            </article>
          ))}
        </div>
      </main>
    </>
  )
}
