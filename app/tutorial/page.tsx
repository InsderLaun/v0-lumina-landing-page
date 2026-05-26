'use client'

// [tutorial loading-bug fix] Every other route in this app declares
// `force-dynamic`; /tutorial was the only one that did not. Without it, Next
// (output: "standalone") tried to STATICALLY prerender this 'use client' page,
// and because <TutorialBody> reads useSearchParams() the prerender bailed to
// the <Suspense> fallback ("Tutorial · loading…"). That fallback HTML was then
// served (and, with no-store headers + per-deploy build IDs, never re-hydrated
// to the real body). Forcing dynamic rendering makes the body render per
// request, matching the behavior of /faucet, /whitepaper, /app/*, etc.
export const dynamic = 'force-dynamic'

import '@/components/lumina/redesign/redesign.css'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { TopBar } from '@/components/lumina/redesign/TopBar'
import { Nav } from '@/components/lumina/redesign/Nav'
import { SiteFooter } from '@/components/lumina/redesign/SiteFooter'
import { TutorialStep } from '@/components/lumina/redesign/TutorialStep'
import {
  TutorialSidebar,
  type TutorialSidebarItem,
} from '@/components/lumina/redesign/TutorialSidebar'
import { CompareSection } from '@/components/lumina/redesign/CompareSection'
import {
  HUMAN_STEPS,
  AGENT_STEPS,
  PURCHASE_ASSET_NOTICE,
  type Audience,
} from './tutorial-data'

export default function TutorialPage() {
  return (
    <div className="rd-page">
      <TopBar />
      <Nav />
      <Suspense fallback={<TutorialFallback />}>
        <TutorialBody />
      </Suspense>
      <CompareSection />
      <BackToHome />
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
  const [mode, setMode] = useState<Audience>('human')

  useEffect(() => {
    const m = searchParams.get('mode')
    if (m === 'agent' || m === 'human') setMode(m)
  }, [searchParams])

  const switchMode = (m: Audience) => {
    setMode(m)
    const params = new URLSearchParams(searchParams.toString())
    params.set('mode', m)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const steps = mode === 'human' ? HUMAN_STEPS : AGENT_STEPS
  const sidebarItems: TutorialSidebarItem[] = steps.map((s) => ({
    id: s.id,
    number: s.number,
    title: s.title,
  }))

  return (
    <>
      <BackToHome top />
      <header className="rd-wp-hero">
        <div className="wrap">
          <span className="rd-eyebrow">
            Tutorial · {steps.length} steps · {mode.toUpperCase()} mode
          </span>
          <h1>
            From wallet to <em>bond</em>, end-to-end.
          </h1>
          <p className="rd-lede">
            A step-by-step walkthrough of buying a parametric policy on Lumina.
            Toggle the mode to see the same flow as a human (wallet UI) or as an
            AI agent (REST API). Every step links to the actual contract or API
            handler that runs it.
          </p>

          <a
            href="https://docs.lumina-org.com/mcp/quickstart"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              margin: '16px 0 4px',
              padding: '12px 16px',
              border: '1px solid var(--rd-accent)',
              borderRadius: 'var(--rd-radius)',
              background: 'var(--rd-accent-dim)',
              color: 'var(--rd-text)',
              textDecoration: 'none',
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            💡 Prefer your AI assistant? Add Lumina via <strong>MCP</strong> in 3 lines
            (Claude Desktop, Cursor, Windsurf, Continue, Claude Code) and buy a policy
            by just asking → <span style={{ color: 'var(--rd-accent)' }}>MCP quickstart ↗</span>
          </a>

          <div className="rd-tut-mode" role="tablist">
            {(['human', 'agent'] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => switchMode(m)}
                className={mode === m ? 'is-active' : ''}
              >
                {m === 'human' ? '👤 Human' : '🤖 Agent'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="rd-tut-layout">
        <TutorialSidebar items={sidebarItems} mode={mode} />
        <div className="rd-tut-content">
          <aside
            role="note"
            style={{
              marginBottom: 32,
              padding: '16px 20px',
              border: '1px solid var(--rd-line-strong)',
              borderRadius: 'var(--rd-radius)',
              background: 'var(--rd-bg-2)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--rd-accent)',
                marginBottom: 6,
              }}
            >
              {PURCHASE_ASSET_NOTICE.title}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.6,
                color: 'var(--rd-text-2)',
              }}
            >
              {PURCHASE_ASSET_NOTICE.body}
            </p>
          </aside>
          {steps.map((s) => (
            <TutorialStep key={s.id} {...s} />
          ))}
        </div>
      </main>
    </>
  )
}

function BackToHome({ top = false }: { top?: boolean }) {
  return (
    <div
      className="wrap"
      style={{ paddingTop: top ? 24 : 32, paddingBottom: top ? 0 : 24 }}
    >
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
  )
}
