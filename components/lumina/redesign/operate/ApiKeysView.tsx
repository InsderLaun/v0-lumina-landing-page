'use client'

import { Key, AlertTriangle, Mail, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useAccount } from 'wagmi'

// API key listing endpoint does NOT exist in lumina-api @ 575a4d0:
//   - POST /api/v1/keys/generate (admin-only — issues key)
//   - DELETE /api/v1/keys/:id    (admin-only — revokes by id)
//
// There is no GET /api/v1/keys for end users to list their own keys, no
// webhook endpoint, and the admin-only routes can't be exposed to end-user
// wallets without leaking admin auth.
//
// Per founder decision (CHECKPOINT 0): show a placeholder with the path
// to provision keys today (contact support / read docs) and disabled
// preview of the future webhook surface.

export function ApiKeysView() {
  const { address, isConnected } = useAccount()
  const truncAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''

  return (
    <div style={{ padding: '28px 32px', maxWidth: 880 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 6 }}>
          /APP/AGENT/API-KEYS
        </div>
        <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--rd-text)', margin: 0 }}>
          Keys your bot uses to call Lumina.
        </h1>
      </div>

      {/* Coming-soon placeholder card */}
      <div
        style={{
          background: 'var(--rd-surface)',
          border: '1px solid var(--rd-line)',
          borderRadius: 10,
          padding: 28,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 10px',
            borderRadius: 4,
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 10,
            letterSpacing: '0.08em',
            color: 'var(--rd-warn)',
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.33)',
            marginBottom: 16,
            textTransform: 'uppercase',
          }}
        >
          <AlertTriangle size={12} /> Self-service · coming soon
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontWeight: 500,
            fontSize: 22,
            color: 'var(--rd-text)',
            margin: '0 0 12px',
            letterSpacing: '-0.01em',
          }}
        >
          Self-service key issuance is not live yet on V5.1 testnet.
        </h2>
        <p style={{ color: 'var(--rd-text-2)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
          The lumina-api currently exposes <code style={{ background: 'var(--rd-accent-dim)', color: 'var(--rd-accent)', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-jetbrains), monospace', fontSize: 12 }}>POST /api/v1/keys/generate</code>
          {' '}and <code style={{ background: 'var(--rd-accent-dim)', color: 'var(--rd-accent)', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-jetbrains), monospace', fontSize: 12 }}>DELETE /api/v1/keys/:id</code> only behind admin auth, so there
          is no safe path from this UI to issue keys to your wallet directly.
        </p>
        <p style={{ color: 'var(--rd-text-2)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          To get a key for your bot today, email{' '}
          <a href="mailto:labs@lumina-org.com" style={{ color: 'var(--rd-accent)' }}>
            labs@lumina-org.com
          </a>{' '}
          with your wallet address {isConnected && (<span style={{ fontFamily: 'var(--font-jetbrains), monospace', color: 'var(--rd-accent)' }}>({truncAddr})</span>)}.
          Keys are bound to one wallet, max 3 per address.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a
            href="mailto:labs@lumina-org.com?subject=Lumina%20agent%20API%20key%20request"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 18px',
              background: 'var(--rd-accent)',
              color: '#001018',
              border: '1px solid var(--rd-accent)',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 13,
              textDecoration: 'none',
            }}
          >
            <Mail size={14} /> Request key
          </a>
          <Link
            href="/docs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 18px',
              background: 'transparent',
              color: 'var(--rd-text-2)',
              border: '1px solid var(--rd-line-strong)',
              borderRadius: 6,
              fontWeight: 500,
              fontSize: 13,
              textDecoration: 'none',
            }}
          >
            <Key size={14} /> Read agent docs
          </Link>
        </div>
      </div>

      {/* Future shape preview — disabled */}
      <div
        style={{
          background: 'var(--rd-surface-2)',
          border: '1px dashed var(--rd-line-strong)',
          borderRadius: 8,
          padding: 20,
          opacity: 0.6,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 10,
            color: 'var(--rd-text-3)',
            letterSpacing: '0.1em',
            marginBottom: 12,
          }}
        >
          PREVIEW · WHEN SELF-SERVICE LANDS
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 14,
            padding: 14,
            background: 'var(--rd-surface)',
            border: '1px solid var(--rd-line)',
            borderRadius: 6,
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <div>
            <div style={{ fontWeight: 500, color: 'var(--rd-text)' }}>production-bot-001</div>
            <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-3)' }}>lum_pk_••••••••</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--rd-text-3)', letterSpacing: '0.06em' }}>CREATED</div>
            <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 12 }}>—</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--rd-text-3)', letterSpacing: '0.06em' }}>LAST USED</div>
            <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 12 }}>—</div>
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            <button disabled className="rd-btn rd-btn-ghost" style={{ height: 28, padding: '0 10px', fontSize: 11, opacity: 0.5, cursor: 'not-allowed' }}>
              View usage
            </button>
            <button disabled className="rd-btn rd-btn-ghost" style={{ height: 28, padding: '0 10px', fontSize: 11, opacity: 0.5, cursor: 'not-allowed' }}>
              Revoke
            </button>
          </div>
        </div>

        {/* Webhook section — preview only */}
        <div
          style={{
            marginTop: 18,
            paddingTop: 18,
            borderTop: '1px solid var(--rd-line)',
          }}
        >
          <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 8 }}>
            WEBHOOK · NOT YET IMPLEMENTED
          </div>
          <p style={{ fontSize: 12, color: 'var(--rd-text-3)', marginBottom: 10 }}>
            Receive notifications when triggers fire, bonds mature, or listings sell.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder="https://your-bot.com/webhook"
              disabled
              style={{
                flex: 1,
                padding: '10px 12px',
                background: 'var(--rd-surface)',
                border: '1px solid var(--rd-line)',
                borderRadius: 6,
                color: 'var(--rd-text-3)',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 12,
                opacity: 0.5,
                cursor: 'not-allowed',
              }}
            />
            <button disabled className="rd-btn rd-btn-ghost" style={{ height: 38, opacity: 0.5, cursor: 'not-allowed' }}>
              Save
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, fontSize: 11, color: 'var(--rd-text-3)', fontFamily: 'var(--font-jetbrains), monospace', display: 'flex', alignItems: 'center', gap: 6 }}>
        <ExternalLink size={11} /> Track this:{' '}
        <a
          href="https://github.com/org-lumina/lumina-api/issues"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--rd-accent)' }}
        >
          org-lumina/lumina-api/issues
        </a>
      </div>
    </div>
  )
}
