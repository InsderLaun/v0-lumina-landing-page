'use client'

import '@/components/lumina/redesign/redesign.css'

import Link from 'next/link'
import { useAccount, useDisconnect } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { RoleSelectCard } from '@/components/lumina/redesign/operate/RoleSelectCard'

export const dynamic = 'force-dynamic'

export default function RoleSelectPage() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()
  const truncAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''

  return (
    <div
      className="rd-page"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <div
        style={{
          background: '#0a2a14',
          borderBottom: '1px solid color-mix(in oklab, var(--rd-accent) 33%, transparent)',
          padding: '6px 20px',
          fontSize: 11,
          fontFamily: 'var(--font-jetbrains), monospace',
          color: 'var(--rd-accent)',
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}
      >
        🟢 LIVE ON BASE MAINNET · CHAIN 8453
      </div>

      <header
        style={{
          padding: '20px 32px',
          borderBottom: '1px solid var(--rd-line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 700,
            color: 'var(--rd-text)',
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              background: 'var(--rd-accent)',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 50%, 0 100%)',
            }}
          />
          LUMINA{' '}
          <span style={{ color: 'var(--rd-text-3)', fontWeight: 400, fontSize: 12 }}>
            · PROTOCOL
          </span>
        </Link>
        {isConnected ? (
          <button
            onClick={() => disconnect()}
            title="Click to disconnect"
            className="rd-btn rd-btn-ghost"
            style={{ height: 32, padding: '0 12px', fontSize: 12 }}
          >
            {truncAddr}
          </button>
        ) : (
          <button
            onClick={() => openConnectModal?.()}
            className="rd-btn rd-btn-ghost"
            style={{ height: 32, padding: '0 12px', fontSize: 12 }}
          >
            Connect Wallet
          </button>
        )}
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}
      >
        <div
          className="label"
          style={{
            fontSize: 11,
            color: 'var(--rd-text-3)',
            letterSpacing: '0.1em',
            marginBottom: 16,
          }}
        >
          /APP · ROLE SELECTION
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontWeight: 300,
            fontSize: 56,
            lineHeight: 1.18,
            textAlign: 'center',
            maxWidth: 720,
            marginBottom: 32,
            letterSpacing: '-0.02em',
            color: 'var(--rd-text)',
          }}
        >
          How do you want to{' '}
          <em style={{ color: 'var(--rd-accent)', fontStyle: 'italic' }}>operate</em>?
        </h1>
        <p
          style={{
            color: 'var(--rd-text-2)',
            fontSize: 15,
            maxWidth: 520,
            textAlign: 'center',
            marginBottom: 48,
            lineHeight: 1.55,
          }}
        >
          Lumina serves two kinds of operators. Pick the one that matches you. You can switch later
          from the sidebar.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 20,
            maxWidth: 880,
            width: '100%',
          }}
        >
          <RoleSelectCard
            href="/app/human/products"
            variant="human"
            title="Buy parametric insurance"
            description="Protect your DeFi positions against flash crashes, depegs, and rate shocks. Pay premium → if trigger fires → receive a ClaimBond redeemable in $LUMINA."
            bullets={[
              'DIRECT CONTRACT CALLS · NO API',
              '9 SHIELDS · BTC / ETH / STABLES',
              'BUY · LIST · TRADE BONDS',
            ]}
            cta="Enter as Human"
          />
          <RoleSelectCard
            href="/app/agent/dashboard"
            variant="agent"
            title="Monitor your AI agent"
            description="Watch your bot buy policies and redeem bonds in real time. Read-only dashboard — agents operate autonomously via API key on the server side."
            bullets={[
              'LIVE KPIs · ACTIVITY FEED',
              'FILTER · EXPORT CSV',
              'API KEYS MANAGEMENT',
            ]}
            cta="Enter as Supervisor"
          />
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 11,
            color: 'var(--rd-text-3)',
            fontFamily: 'var(--font-jetbrains), monospace',
            letterSpacing: '0.05em',
          }}
        >
          NEED API ACCESS FOR YOUR BOT?{' '}
          <Link href="/docs" style={{ color: 'var(--rd-accent)' }}>
            READ AGENT DOCS →
          </Link>
        </div>
      </main>
    </div>
  )
}
