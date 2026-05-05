import '@/components/lumina/redesign/redesign.css'

import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
import { TopBar } from '@/components/lumina/redesign/TopBar'
import { Nav } from '@/components/lumina/redesign/Nav'
import { SiteFooter } from '@/components/lumina/redesign/SiteFooter'
import { DocCard } from '@/components/lumina/redesign/DocCard'
import { RepoMegaCard } from '@/components/lumina/redesign/RepoMegaCard'
import { CONTRACTS, TOKENS } from '@/lib/lumina-config'
import {
  CATEGORIES,
  DOCS,
  ORG_GITHUB_URL,
  REPO_CARDS,
  buildDocUrl,
  docsByCategory,
} from '@/lib/docs'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Lumina · Documentation' }

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
  { kind: 'oracle', name: 'LuminaOracleV2', address: CONTRACTS.LuminaOracleV2 },
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
        <BackToHome />

        <header className="rd-wp-hero">
          <div className="wrap">
            <span className="rd-eyebrow">Open source · public on GitHub · V5.1</span>
            <h1>📚 Documentation</h1>
            <p className="rd-lede">
              Every contract, every endpoint, every audit — public on GitHub. Browse by category
              below or jump straight to the org.
            </p>
          </div>
        </header>

        <section className="wrap" style={{ padding: '32px 32px 0' }}>
          <RepoMegaCard
            title="View all repos on GitHub"
            subtitle="3 repositories: smart contracts, REST API, and this frontend — all open source."
            href={ORG_GITHUB_URL}
            repos={REPO_CARDS}
          />
        </section>

        {CATEGORIES.map((cat) => {
          const docs = docsByCategory(cat.id)
          if (docs.length === 0) return null
          return (
            <section key={cat.id} className="wrap" style={{ padding: '40px 32px 0' }}>
              <CategoryHeader emoji={cat.emoji} label={cat.label} description={cat.description} count={docs.length} />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 14,
                }}
              >
                {docs.map((d) => (
                  <DocCard
                    key={`${d.repo}-${d.path}`}
                    title={d.title}
                    description={d.description}
                    href={buildDocUrl(d)}
                    icon={<Github size={18} />}
                    cta="Open on GitHub"
                    badge={d.badge}
                    repo={d.repo}
                  />
                ))}
              </div>
            </section>
          )
        })}

        <section className="wrap" style={{ padding: '48px 32px 0' }}>
          <CategoryHeader
            emoji="📜"
            label="Deployed Contracts"
            description="V5.1 on Base Sepolia (chainId 84532). Every address is read from `lib/contracts.ts` — never hardcoded here."
            count={DEPLOYED.length}
          />
          <DeployedContractsTable />
        </section>

        <section className="wrap" style={{ padding: '48px 32px 0' }}>
          <BackToHome />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function BackToHome() {
  return (
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
  )
}

function CategoryHeader({
  emoji,
  label,
  description,
  count,
}: {
  emoji: string
  label: string
  description: string
  count: number
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: '1px solid var(--rd-line)',
        gap: 16,
      }}
    >
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: '-0.015em',
            color: 'var(--rd-text)',
            margin: '0 0 4px',
          }}
        >
          {emoji} {label}
        </h2>
        <div style={{ fontSize: 13, color: 'var(--rd-text-3)' }}>{description}</div>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
          color: 'var(--rd-text-3)',
          letterSpacing: '0.04em',
          flexShrink: 0,
        }}
      >
        {count} doc{count === 1 ? '' : 's'}
      </span>
    </div>
  )
}

function DeployedContractsTable() {
  return (
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
  )
}
