'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

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

const WHITEPAPER_ITEMS = [
  { href: '/whitepaper', label: 'Full version' },
  { href: '/whitepaper-short/en', label: 'Short version — English' },
  { href: '/whitepaper-short/es', label: 'Short version — Español' },
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
          <WhitepaperDropdown />
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
            href="https://github.com/org-lumina/LUMINA-PROTOCOL"
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

function WhitepaperDropdown() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          background: 'transparent',
          border: 0,
          padding: 0,
          margin: 0,
          color: 'inherit',
          font: 'inherit',
          cursor: 'pointer',
          letterSpacing: 'inherit',
        }}
      >
        Whitepaper
        <ChevronDown
          size={13}
          style={{
            transition: 'transform 150ms ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            left: 0,
            minWidth: 240,
            padding: 6,
            background: 'var(--rd-bg-elev, #0e0e12)',
            border: '1px solid var(--rd-line, rgba(255,255,255,0.08))',
            borderRadius: 8,
            boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {WHITEPAPER_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '8px 12px',
                borderRadius: 6,
                color: 'var(--rd-text, #e8e8ec)',
                textDecoration: 'none',
                fontSize: 13,
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
                transition: 'background 120ms ease, color 120ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--rd-accent-dim, rgba(0,212,255,0.1))'
                e.currentTarget.style.color = 'var(--rd-accent, #00d4ff)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--rd-text, #e8e8ec)'
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
