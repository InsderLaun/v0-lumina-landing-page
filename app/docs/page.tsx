import '@/components/lumina/redesign/redesign.css'

import Link from 'next/link'
import { ArrowLeft, BookOpen, FileText, Github, Server, Shield, ExternalLink } from 'lucide-react'
import { TopBar } from '@/components/lumina/redesign/TopBar'
import { Nav } from '@/components/lumina/redesign/Nav'
import { SiteFooter } from '@/components/lumina/redesign/SiteFooter'
import { DocCard } from '@/components/lumina/redesign/DocCard'
import { CONTRACTS, TOKENS, LUMINA_API_URL } from '@/lib/lumina-config'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Lumina · Documentation' }

const REPOS = [
  {
    title: 'Smart Contracts',
    description:
      'Solidity 0.8.x. CoverRouterV2, PolicyManagerV2, ClaimBond, BondVault, Marketplace, BuybackEngine, ShieldKeeper, TWAPBurner, plus 9 shield products. Foundry tests + audit fixes through PR #1.',
    href: 'https://github.com/org-lumina/LUMINA-PROTOCOL',
  },
  {
    title: 'API (Backend)',
    description:
      'TypeScript / Express. Public read endpoints + agent-key write endpoints (relayer pattern). Source for products, policies, redeem, marketplace, bonds, keys.',
    href: 'https://github.com/org-lumina/lumina-api',
  },
  {
    title: 'Frontend (this site)',
    description:
      'Next.js 16 App Router + wagmi + RainbowKit. The home, whitepaper hub, and operate-app at /app live in this repo.',
    href: 'https://github.com/org-lumina/v0-lumina-landing-page',
  },
] as const

const WHITEPAPER_CARDS = [
  {
    title: 'Whitepaper · Full English',
    description:
      'Complete protocol specification. Architecture, kink pricing, ClaimBond mechanics, oracle infrastructure.',
    href: '/whitepaper/en',
    external: false,
  },
  {
    title: 'Whitepaper · Full Spanish',
    description:
      'Especificación completa del protocolo. Arquitectura, modelo kink, mecánica ClaimBond, infraestructura oracle.',
    href: '/whitepaper/es',
    external: false,
  },
  {
    title: 'Summary · English',
    description: 'Executive 2-page brief. (Summary version coming in V5.1 update — for now this opens the full English whitepaper.)',
    href: '/whitepaper/en',
    external: false,
    badge: 'Soon',
  },
  {
    title: 'Summary · Spanish',
    description: 'Brief ejecutivo de 2 páginas. (Summary version coming in V5.1 update — por ahora abre el whitepaper completo.)',
    href: '/whitepaper/es',
    external: false,
    badge: 'Soon',
  },
] as const

const AUDIT_COMMIT = 'bfa7b04ada5df36cd85d270daa567e261037d438'

// Read all 19 deployed addresses from lib/contracts.ts (re-export of lumina-config)
// — never hardcoded. Order: 9 core/protocol + 1 token + 9 shields.
const DEPLOYED = [
  { kind: 'core', name: 'LuminaTokenV2', address: CONTRACTS.LuminaToken },
  { kind: 'core', name: 'ClaimBond', address: CONTRACTS.ClaimBond },
  { kind: 'core', name: 'BondVault', address: CONTRACTS.BondVault },
  { kind: 'core', name: 'PolicyManagerV2', address: CONTRACTS.PolicyManager },
  { kind: 'core', name: 'CoverRouterV2', address: CONTRACTS.CoverRouter },
  { kind: 'core', name: 'Marketplace', address: CONTRACTS.Marketplace },
  { kind: 'core', name: 'BuybackEngine', address: CONTRACTS.BuybackEngine },
  { kind: 'core', name: 'ShieldKeeper', address: CONTRACTS.ShieldKeeper },
  { kind: 'core', name: 'TWAPBurner', address: CONTRACTS.TWAPBurner },
  { kind: 'token', name: 'USDC (MockUSDC)', address: TOKENS.USDC.address },
  { kind: 'shield', name: 'Flash BTC 1h', address: CONTRACTS.shields.FlashBTC1h },
  { kind: 'shield', name: 'Flash BTC 4h', address: CONTRACTS.shields.FlashBTC4h },
  { kind: 'shield', name: 'Flash BTC 24h', address: CONTRACTS.shields.FlashBTC24h },
  { kind: 'shield', name: 'Flash BTC 48h', address: CONTRACTS.shields.FlashBTC48h },
  { kind: 'shield', name: 'Flash ETH 1h', address: CONTRACTS.shields.FlashETH1h },
  { kind: 'shield', name: 'Flash ETH 24h', address: CONTRACTS.shields.FlashETH24h },
  { kind: 'shield', name: 'Flash ETH 48h', address: CONTRACTS.shields.FlashETH48h },
  { kind: 'shield', name: 'Micro Depeg USDT', address: CONTRACTS.shields.MicroDepeg },
  { kind: 'shield', name: 'Rate Shock', address: CONTRACTS.shields.RateShock },
] as const

export default function DocsPage() {
  return (
    <div className="rd-page">
      <TopBar />
      <Nav />

      <main style={{ paddingBottom: 64 }}>
        {/* Back to home */}
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
            <span className="rd-eyebrow">Documentation · Open source</span>
            <h1>Documentation</h1>
            <p className="rd-lede">
              Open source. All code, contracts, and audits are public on GitHub.
            </p>
          </div>
        </header>

        {/* SECTION 1 — Repositories */}
        <section className="wrap" style={{ padding: '48px 32px 32px' }}>
          <SectionHeader label="01 · Repositories" count="3 repos" />
          <Grid>
            {REPOS.map((r) => (
              <DocCard
                key={r.href}
                title={r.title}
                description={r.description}
                href={r.href}
                icon={<Github size={18} />}
                cta="View on GitHub"
              />
            ))}
          </Grid>
        </section>

        {/* SECTION 2 — Whitepaper */}
        <section className="wrap" style={{ padding: '32px 32px' }}>
          <SectionHeader label="02 · Whitepaper" count="2 languages · 2 depths" />
          <Grid>
            {WHITEPAPER_CARDS.map((w) => (
              <DocCard
                key={w.title}
                title={w.title}
                description={w.description}
                href={w.href}
                external={w.external}
                icon={<BookOpen size={18} />}
                badge={'badge' in w ? (w as { badge: string }).badge : undefined}
                cta={w.external ? 'Open' : 'Read'}
              />
            ))}
          </Grid>
        </section>

        {/* SECTION 3 — Audit Reports */}
        <section className="wrap" style={{ padding: '32px 32px' }}>
          <SectionHeader label="03 · Audit Reports" count="1 commit linked" />
          <Grid>
            <DocCard
              title="PR #1 — Audit fix (CHAIN-1, XSS-1, WC-1, SIM-1, DEAD-1)"
              description={`Audit fix #35 mergeado a main. CHAIN-1 (Sepolia migration to V5.1, single BondVault), XSS-1 (sanitization), WC-1 (WalletConnect projectId runtime check), SIM-1 (smoke tests), DEAD-1 (chat-widget removed). Commit ${AUDIT_COMMIT.slice(0, 12)}…`}
              href={`https://github.com/org-lumina/v0-lumina-landing-page/commit/${AUDIT_COMMIT}`}
              icon={<Shield size={18} />}
              cta="View commit on GitHub"
            />
          </Grid>
        </section>

        {/* SECTION 4 — Deployed Contracts */}
        <section className="wrap" style={{ padding: '32px 32px' }}>
          <SectionHeader
            label="04 · Deployed Contracts"
            count={`Base Sepolia · ${DEPLOYED.length} addresses`}
          />
          <div
            style={{
              background: 'var(--rd-surface)',
              border: '1px solid var(--rd-line)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 1fr 120px',
                padding: '10px 16px',
                borderBottom: '1px solid var(--rd-line)',
                background: 'var(--rd-surface-2)',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 10,
                color: 'var(--rd-text-3)',
                letterSpacing: '0.1em',
              }}
            >
              <div>KIND</div>
              <div>NAME</div>
              <div>ADDRESS</div>
              <div></div>
            </div>
            {DEPLOYED.map((d, i) => (
              <div
                key={d.address + d.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 1fr 120px',
                  padding: '11px 16px',
                  borderBottom: i === DEPLOYED.length - 1 ? 'none' : '1px solid var(--rd-line)',
                  fontSize: 12,
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    color:
                      d.kind === 'shield'
                        ? 'var(--rd-accent)'
                        : d.kind === 'token'
                          ? 'var(--rd-warn)'
                          : 'var(--rd-text-3)',
                    textTransform: 'uppercase',
                  }}
                >
                  {d.kind}
                </span>
                <span style={{ color: 'var(--rd-text)' }}>{d.name}</span>
                <span
                  style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: 11,
                    color: 'var(--rd-text-3)',
                  }}
                >
                  {d.address.slice(0, 6)}…{d.address.slice(-4)}
                </span>
                <a
                  href={`https://sepolia.basescan.org/address/${d.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: 11,
                    color: 'var(--rd-accent)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    justifySelf: 'end',
                  }}
                >
                  Basescan <ExternalLink size={11} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5 — API Reference */}
        <section className="wrap" style={{ padding: '32px 32px 64px' }}>
          <SectionHeader label="05 · API Reference" count="REST · Sepolia" />
          <DocCard
            title="REST API · /api/v1"
            description={`Public read + agent-key write endpoints. Base URL: ${LUMINA_API_URL}`}
            href="https://github.com/org-lumina/lumina-api/tree/main/src/routes"
            icon={<Server size={18} />}
            cta="View routes on GitHub"
          />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function SectionHeader({ label, count }: { label: string; count: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingBottom: 14,
        borderBottom: '1px solid var(--rd-line)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--rd-text-3)',
          fontWeight: 500,
          margin: 0,
        }}
      >
        {label}
      </h2>
      <span
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
          color: 'var(--rd-text-3)',
          letterSpacing: '0.04em',
        }}
      >
        {count}
      </span>
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {children}
    </div>
  )
}
