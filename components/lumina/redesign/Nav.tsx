'use client'

import Link from 'next/link'

const ANCHOR_LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#bonds', label: 'Bonds' },
  { href: '#products', label: 'Products' },
  { href: '#burn', label: 'Burn' },
  { href: '#roadmap', label: 'Roadmap' },
] as const

const PAGE_LINKS = [
  { href: '/whitepaper', label: 'Whitepaper' },
  { href: '/docs', label: 'Docs' },
  { href: '/skills', label: 'Skills' },
  { href: '/tutorial', label: 'Tutorial' },
] as const

// Public navbar — wallet UI lives only inside /app/* (handled by AppShell).
// No connect button, no truncated address, no chain banner here.
export function Nav() {
  return (
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
          <a
            className="rd-btn rd-btn-ghost"
            href="https://github.com/org-lumina"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            className="rd-btn rd-btn-primary"
            href="https://docs.lumina-org.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Build →
          </a>
          <Link className="rd-btn rd-btn-primary" href="/app">
            Launch app →
          </Link>
        </div>
      </div>
    </nav>
  )
}
