'use client'

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
import { HUMAN_STEPS, AGENT_STEPS, type Audience } from './tutorial-data'

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
