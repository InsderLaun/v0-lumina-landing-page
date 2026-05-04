import '@/components/lumina/redesign/redesign.css'

import { TopBar } from '@/components/lumina/redesign/TopBar'
import { Nav } from '@/components/lumina/redesign/Nav'
import { SiteFooter } from '@/components/lumina/redesign/SiteFooter'

export const dynamic = 'force-dynamic'

// Sprint 1.5 (separate prompt) replaces these placeholder sections with the
// full docs content + contract address citations + API reference.
export default function DocsPage() {
  return (
    <div className="rd-page">
      <TopBar />
      <Nav />

      <header className="rd-wp-hero">
        <div className="wrap">
          <span className="rd-eyebrow">Documentation · V5.1 · Base Sepolia</span>
          <h1>
            Build, integrate, <em>deploy</em>.
          </h1>
          <p className="rd-lede">
            Everything you need to interact with Lumina Protocol — contracts, APIs, SDK, and on-chain
            references. Full content lands in Sprint 1.5.
          </p>
        </div>
      </header>

      <main className="rd-wp-versions">
        <div className="wrap">
          <PlaceholderSection
            label="01 · Quickstart"
            title="Buy a policy in 10 lines of code"
            note="Code samples + REST quickstart land in Sprint 1.5"
          />
          <PlaceholderSection
            label="02 · Contracts"
            title="Smart-contract reference (V5.1)"
            note="Address tables + ABIs link to org-lumina/LUMINA-PROTOCOL"
          />
          <PlaceholderSection
            label="03 · API"
            title="REST API · /api/v2"
            note="Endpoint tables + auth flow + rate limits"
          />
          <PlaceholderSection
            label="04 · SKILL file"
            title="Drop-in agent integration"
            note="Download the LUMINA-SKILL.txt and authenticate via API key"
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function PlaceholderSection({ label, title, note }: { label: string; title: string; note: string }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <div className="rd-section-head">
        <h2>{label}</h2>
        <span className="rd-count">Sprint 1.5</span>
      </div>
      <div
        style={{
          background: 'var(--rd-surface)',
          border: '1px solid var(--rd-line)',
          borderRadius: 10,
          padding: 28,
          color: 'var(--rd-text-2)',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontWeight: 500,
            fontSize: 24,
            color: 'var(--rd-text)',
            marginBottom: 12,
            letterSpacing: '-0.015em',
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 0 }}>{note}</p>
      </div>
    </section>
  )
}
