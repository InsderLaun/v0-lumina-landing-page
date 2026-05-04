'use client'

import Link from 'next/link'
import { useAccount, useDisconnect } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useChainCheck } from '@/hooks/use-web3'
import { WrongNetworkBanner } from '@/components/lumina/tx-status'

const ANCHOR_LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#bonds', label: 'Bonds' },
  { href: '#products', label: 'Products' },
  { href: '#burn', label: 'Burn' },
  { href: '#roadmap', label: 'Roadmap' },
] as const

const PAGE_LINKS = [
  { href: '/docs', label: 'Docs' },
  { href: '/skills', label: 'Skills' },
  { href: '/tutorial', label: 'Tutorial' },
] as const

export function Nav() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()
  const { needsSwitch, handleSwitch } = useChainCheck()

  const truncAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''

  return (
    <>
      <nav className="rd-nav">
        <div className="rd-nav-inner">
          <Link className="rd-logo" href="/">
            <span className="rd-logo-mark" />
            <span>LUMINA</span>
            <span style={{ color: 'var(--rd-text-3)', fontWeight: 400, fontSize: 12, marginLeft: 6 }}>
              · PROTOCOL
            </span>
          </Link>

          <div className="rd-nav-links">
            {ANCHOR_LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
            {PAGE_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="rd-nav-cta">
            <Link className="rd-btn rd-btn-ghost" href="/whitepaper">
              Whitepaper
            </Link>
            {isConnected ? (
              <button
                onClick={() => disconnect()}
                className="rd-btn rd-btn-ghost"
                title="Click to disconnect"
              >
                {truncAddr}
              </button>
            ) : (
              <button onClick={() => openConnectModal?.()} className="rd-btn rd-btn-ghost">
                Connect
              </button>
            )}
            <Link className="rd-btn rd-btn-primary" href="/app">
              Launch app →
            </Link>
          </div>
        </div>
      </nav>
      <WrongNetworkBanner show={needsSwitch} onSwitch={handleSwitch} />
    </>
  )
}
