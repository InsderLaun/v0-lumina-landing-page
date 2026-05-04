import '@/components/lumina/redesign/redesign.css'

import Link from 'next/link'
import { TopBar } from '@/components/lumina/redesign/TopBar'
import { Nav } from '@/components/lumina/redesign/Nav'
import { SiteFooter } from '@/components/lumina/redesign/SiteFooter'

// Sprint 2 (feature/operate-app) replaces this with the role selector +
// human flow + agent supervisor. Keep the route alive so the "Launch app"
// CTAs in Hero/Nav/CTAFooter don't 404.
export const dynamic = 'force-dynamic'

export default function AppPlaceholder() {
  return (
    <div className="rd-page">
      <TopBar />
      <Nav />
      <main
        style={{
          minHeight: 'calc(100vh - 320px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 32px',
        }}
      >
        <div style={{ maxWidth: 560, textAlign: 'left' }}>
          <div
            className="label"
            style={{ color: 'var(--rd-warn)', marginBottom: 16 }}
          >
            ⚠ Base Sepolia · v5.1 testnet
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontWeight: 600,
              fontSize: 'clamp(36px, 5vw, 56px)',
              letterSpacing: '-0.025em',
              lineHeight: 1.0,
              color: 'var(--rd-text)',
              marginBottom: 16,
            }}
          >
            Operate <em style={{ color: 'var(--rd-accent)', fontStyle: 'italic' }}>app</em>
          </h1>
          <p
            style={{
              color: 'var(--rd-text-2)',
              fontSize: 17,
              lineHeight: 1.6,
              marginBottom: 32,
              maxWidth: 480,
            }}
          >
            The full operate experience (role selector, parametric quote, ClaimBond redemption) is
            shipping next sprint. AI agents can already integrate via the REST API today.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="rd-btn rd-btn-primary" href="/docs">
              Read API docs →
            </Link>
            <Link className="rd-btn rd-btn-ghost" href="/skills">
              Download SKILL file
            </Link>
            <Link className="rd-btn rd-btn-ghost" href="/whitepaper">
              Whitepaper
            </Link>
          </div>
          <div
            className="label"
            style={{ color: 'var(--rd-text-3)', marginTop: 32, fontSize: 11 }}
          >
            Sprint 2: feature/operate-app
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
