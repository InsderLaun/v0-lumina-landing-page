'use client'

import { useEffect, useState } from 'react'

const STATS_URL =
  'https://lumina-api-production-ac85.up.railway.app/api/v1/marketplace/stats'
const OPERATE_URL = '/app/human/marketplace'
const DOCS_URL = 'https://docs.lumina-org.com/concepts/marketplace'

const SNIPPET = `import { LuminaClient } from '@lumina-org/sdk';
const lumina = new LuminaClient({ apiKey });
const listings = await lumina.marketplace.listings();`

export function toNum(v: string | number | null | undefined): number {
  if (v === null || v === undefined) return 0
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  const parsed = Number(v)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatUsdc(rawString: string | number | null | undefined): string {
  const raw = toNum(rawString)
  const human = raw / 1_000_000 // USDC has 6 decimals
  return `$${human.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatCount(n: string | number | null | undefined): string {
  return toNum(n).toLocaleString('en-US')
}

type StatsRaw = {
  floor: string | number | null
  volume24h: string | number | null
  totalListings: string | number | null
  totalVolume?: string | number | null
}

export function MarketplaceSection() {
  const [stats, setStats] = useState<StatsRaw | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(STATS_URL, { method: 'GET' })
        if (!res.ok) throw new Error('non-2xx')
        const data = (await res.json()) as Record<string, unknown>
        if (cancelled) return
        setStats({
          floor: (data.floor as string | number) ?? null,
          volume24h: (data.volume24h as string | number) ?? null,
          totalListings: (data.totalListings as string | number) ?? null,
          totalVolume: (data.totalVolume as string | number) ?? null,
        })
      } catch {
        if (!cancelled) setError(true)
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
            { label: 'Floor', value: error ? '—' : stats ? formatUsdc(stats.floor) : '…' },
            { label: '24h volume', value: error ? '—' : stats ? formatUsdc(stats.volume24h) : '…' },
            {
              label: 'Active listings',
              value: error ? '—' : stats ? formatCount(stats.totalListings) : '…',
            },
            {
              label: 'Total volume',
              value: error ? '—' : stats ? formatUsdc(stats.totalVolume) : '…',
            },
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
