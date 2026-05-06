'use client'

import { useState } from 'react'

const INSTALL_CMD = 'npm install @lumina-org/sdk'
const NPM_URL = 'https://www.npmjs.com/package/@lumina-org/sdk'
const DOCS_URL = 'https://docs.lumina-org.com/sdk/installation'

export function SdkCta() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Fallback for non-secure contexts: select-all in a hidden textarea.
      const ta = document.createElement('textarea')
      ta.value = INSTALL_CMD
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      } catch {
        // ignore
      } finally {
        document.body.removeChild(ta)
      }
    }
  }

  return (
    <section className="rd-sec" id="sdk">
      <div className="wrap">
        <div className="rd-sec-num">
          04 / 08 · <span>Connect your AI</span>
        </div>
        <h2>
          Connect your AI agent in <em>three lines</em>.
        </h2>
        <p className="rd-sec-lede">
          The official TypeScript SDK wraps the relayer endpoints, the on-chain ABI, and the
          retry/idempotency conventions. One install, one API key, and your agent can quote and buy
          parametric coverage without managing gas.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gap: 20,
            alignItems: 'center',
            border: '1px solid var(--rd-line-strong)',
            borderRadius: 'var(--rd-radius)',
            padding: '20px 24px',
            background: 'var(--rd-bg-2)',
          }}
        >
          <code
            className="mono"
            style={{
              display: 'block',
              fontSize: 16,
              color: 'var(--rd-text)',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: 'var(--rd-text-3)' }}>$ </span>
            {INSTALL_CMD}
          </code>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="rd-btn rd-btn-primary"
              onClick={handleCopy}
              aria-live="polite"
              aria-label={copied ? 'Copied install command to clipboard' : 'Copy install command'}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <a
              className="rd-btn rd-btn-ghost"
              href={NPM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on npm
            </a>
            <a
              className="rd-btn rd-btn-ghost"
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read docs
            </a>
          </div>
        </div>

        <p
          style={{
            marginTop: 16,
            fontSize: 12,
            color: 'var(--rd-text-3)',
            fontFamily: 'var(--font-jetbrains), monospace',
            letterSpacing: '0.04em',
          }}
        >
          Premium paid in USDC · Relayer covers gas · Compatible with Node 18+ and edge runtimes
        </p>
      </div>
    </section>
  )
}
