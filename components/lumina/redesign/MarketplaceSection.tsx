'use client'

import { useEffect, useState } from 'react'

const STATS_URL =
  'https://lumina-api-production-ac85.up.railway.app/api/v1/marketplace/stats'
const OPERATE_URL = '/app/human/marketplace'
const DOCS_URL = 'https://docs.lumina-org.com/concepts/marketplace'

const SNIPPET = `import { LuminaClient } from '@lumina-org/sdk';
const lumina = new LuminaClient({ apiKey });
const listings = await lumina.marketplace.listings();`

type Stats = {
  floor: string
  volume24h: string
  activeListings: string
}

const INITIAL_STATS: Stats = {
  floor: '—',
  volume24h: '—',
  activeListings: '—',
}

function formatUsd(n: unknown): string {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toFixed(2)
}

function formatInt(n: unknown): string {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '—'
  return Math.round(n).toLocaleString('en-US')
}

export function MarketplaceSection() {
  const [stats, setStats] = useState<Stats>(INITIAL_STATS)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(STATS_URL, { method: 'GET' })
        if (!res.ok) return
        const data = (await res.json()) as Record<string, unknown>
        if (cancelled) return
        const floor =
          typeof data.floor === 'number'
            ? data.floor
            : typeof data.floorPrice === 'number'
              ? data.floorPrice
              : undefined
        const vol =
          typeof data.volume24h === 'number'
            ? data.volume24h
            : typeof data.volume_24h === 'number'
              ? data.volume_24h
              : undefined
        const active =
          typeof data.activeListings === 'number'
            ? data.activeListings
            : typeof data.active_listings === 'number'
              ? data.active_listings
              : typeof data.listings === 'number'
                ? data.listings
                : undefined
        setStats({
          floor: floor !== undefined ? `$${formatUsd(floor)}` : '—',
          volume24h: vol !== undefined ? `$${formatUsd(vol)}` : '—',
          activeListings: active !== undefined ? formatInt(active) : '—',
        })
      } catch {
        // Network/CORS errors fall back to placeholders silently.
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="rd-sec" id="marketplace">
      <div className="wrap">
        <div className="rd-sec-num">
          05 / 08 · <span>Marketplace</span>
        </div>
        <h2>
          Trade <em>bonds</em> before maturity.
        </h2>
        <p className="rd-sec-lede">
          Sellers exit early with USDC. Buyers acquire bonds at discount, redeemed in $LUMINA at
          730d.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            marginTop: 24,
            marginBottom: 24,
          }}
        >
          {[
            { label: 'Floor', value: stats.floor },
            { label: '24h volume', value: stats.volume24h },
            { label: 'Active listings', value: stats.activeListings },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                flex: '1 1 200px',
                minWidth: 180,
                border: '1px solid var(--rd-line-strong)',
                borderRadius: 'var(--rd-radius)',
                padding: '16px 20px',
                background: 'var(--rd-bg-2)',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--rd-text-3)',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                {s.label}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 24,
                  color: 'var(--rd-text)',
                  fontWeight: 500,
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 24,
          }}
        >
          <a className="rd-btn rd-btn-primary" href={OPERATE_URL}>
            Browse listings
          </a>
          <a
            className="rd-btn rd-btn-ghost"
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Build with API
          </a>
        </div>

        <pre
          className="mono"
          style={{
            border: '1px solid var(--rd-line-strong)',
            borderRadius: 'var(--rd-radius)',
            padding: '16px 20px',
            background: 'var(--rd-bg-2)',
            color: 'var(--rd-text)',
            fontSize: 14,
            overflowX: 'auto',
            margin: 0,
            whiteSpace: 'pre',
          }}
        >
          <code>{SNIPPET}</code>
        </pre>

        <p
          style={{
            marginTop: 16,
            fontSize: 12,
            color: 'var(--rd-text-3)',
            fontFamily: 'var(--font-jetbrains), monospace',
            letterSpacing: '0.04em',
          }}
        >
          Marketplace 0xfaC5…Be6E (Base Sepolia) · 1.5% maker + 1.5% taker · min $1/unit
        </p>
      </div>
    </section>
  )
}
