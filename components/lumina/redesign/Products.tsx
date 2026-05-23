'use client'

import { useState, useMemo } from 'react'

// Sprint Landing Integral V5.3 — 6 productos live on Base Sepolia.
// FlashBTC × 3 (1h/24h/48h) + FlashETH × 3 (1h/24h/48h). RateShock está
// pausado (CR.products.active = false + PM.productActive = false desde
// 2026-05-22); MicroDepeg y FlashBTC 4h fueron retirados en T-30c. La
// columna "Prob." se eliminó intencionalmente — el premium ya viene
// pre-calculado por la formula on-chain (payoutRatio · triggerProb ·
// margin / 10⁹) y muestra el costo per $1k de cobertura directamente.
const PRODUCTS = [
  {
    key: 'btc-1h',
    symbol: 'FLASHBTC1H-001',
    label: 'Flash BTC 1h',
    coveredAsset: 'BTC',
    paymentAsset: 'USDC',
    duration: '1h',
    trigger: 'BTC -2.5% / 1h',
    premium: 2.92,
    mult: '342x',
    tier: 1,
  },
  {
    key: 'btc-24h',
    symbol: 'FLASHBTC24-001',
    label: 'Flash BTC 24h',
    coveredAsset: 'BTC',
    paymentAsset: 'USDC',
    duration: '24h',
    trigger: 'BTC -6% / 24h',
    premium: 52.60,
    mult: '19x',
    tier: 1,
  },
  {
    key: 'btc-48h',
    symbol: 'FLASHBTC48-001',
    label: 'Flash BTC 48h',
    coveredAsset: 'BTC',
    paymentAsset: 'USDC',
    duration: '48h',
    trigger: 'BTC -10% / 48h',
    premium: 148.67,
    mult: '7x',
    tier: 1,
  },
  {
    key: 'eth-1h',
    symbol: 'FLASHETH1H-001',
    label: 'Flash ETH 1h',
    coveredAsset: 'ETH',
    paymentAsset: 'USDC',
    duration: '1h',
    trigger: 'ETH -4% / 1h',
    premium: 1.68,
    mult: '595x',
    tier: 1,
  },
  {
    key: 'eth-24h',
    symbol: 'FLASHETH24-001',
    label: 'Flash ETH 24h',
    coveredAsset: 'ETH',
    paymentAsset: 'USDC',
    duration: '24h',
    trigger: 'ETH -8.5% / 24h',
    premium: 45.80,
    mult: '22x',
    tier: 1,
  },
  {
    key: 'eth-48h',
    symbol: 'FLASHETH48-001',
    label: 'Flash ETH 48h',
    coveredAsset: 'ETH',
    paymentAsset: 'USDC',
    duration: '48h',
    trigger: 'ETH -14% / 48h',
    premium: 123.01,
    mult: '8x',
    tier: 1,
  },
] as const

const FILTERS = ['ALL', 'BTC', 'ETH', 'STABLES'] as const
type Filter = (typeof FILTERS)[number]

interface ProductsProps {
  /**
   * Live premiums per $1k cover, keyed by canonical productName (e.g.
   * `FLASHBTC1H-001`). Built at request time by `app/page.tsx` via
   * `/products/{id}/quote?coverageAmount=1000000000`. When the API is
   * reachable this overrides the hardcoded `premium` in `PRODUCTS` so the
   * table never drifts from the live on-chain formula. When `undefined` /
   * the API failed, the hardcoded source-of-truth is used.
   */
  livePremiums?: Record<string, number>
}

export function Products({ livePremiums }: ProductsProps = {}) {
  const [filter, setFilter] = useState<Filter>('ALL')
  const [active, setActive] = useState<string>('btc-1h')

  // Apply live premium overlay onto the static PRODUCTS source-of-truth.
  // Fall back to the hardcoded value when the API didn't return a quote
  // for a given productName (this keeps the table coherent even if a
  // product is partially missing from the live response).
  const PRODUCTS_WITH_LIVE = useMemo(
    () =>
      PRODUCTS.map((p) => {
        const live = livePremiums?.[p.symbol]
        return live !== undefined ? { ...p, premium: live } : p
      }),
    [livePremiums],
  )

  const filtered = useMemo(() => {
    if (filter === 'BTC') return PRODUCTS_WITH_LIVE.filter((p) => p.coveredAsset === 'BTC')
    if (filter === 'ETH') return PRODUCTS_WITH_LIVE.filter((p) => p.coveredAsset === 'ETH')
    if (filter === 'STABLES') return []
    return PRODUCTS_WITH_LIVE
  }, [filter, PRODUCTS_WITH_LIVE])

  const a = PRODUCTS_WITH_LIVE.find((p) => p.key === active) ?? PRODUCTS_WITH_LIVE[0]
  const cov = 1000
  const premium = a.premium.toFixed(2)
  const payout = (cov * 0.8).toFixed(2)

  return (
    <section className="rd-sec" id="products">
      <div className="wrap">
        <div className="rd-sec-num">
          03 / 09 · <span>Live Markets</span>
        </div>
        <h2>Six flash products. Each with a precise drop trigger and a fixed multiplier.</h2>
        <p className="rd-sec-lede">
          Click a row to open the bet sheet. Triggers measure the drop from the spot price
          at purchase time over a fixed window; multipliers come from the bond reserve curve.
        </p>
        <p
          className="rd-sec-lede"
          style={{
            marginTop: -32,
            marginBottom: 32,
            fontSize: 13,
            color: 'var(--rd-text-3)',
            fontFamily: 'var(--font-jetbrains), monospace',
          }}
        >
          Premium and bond settlement always denominated in <strong style={{ color: 'var(--rd-text-2)' }}>USDC</strong>.
          The <em>Covers</em> column is the asset whose price the Chainlink oracle observes for the
          trigger.
        </p>

        <div className="rd-prod-shell">
          <div className="rd-prod-head">
            <div className="label">PRODUCTS · 6 ACTIVE</div>
            <div className="rd-prod-tabs">
              {FILTERS.map((t) => (
                <button
                  key={t}
                  className={filter === t ? 'rd-on' : ''}
                  onClick={() => setFilter(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="rd-prod">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Covers</th>
                  <th>Trigger</th>
                  <th className="rd-r">Multiplier</th>
                  <th className="rd-r">Premium /$1K</th>
                  <th className="rd-r">Tier</th>
                </tr>
              </thead>
              <tbody>
                {filter === 'STABLES' ? (
                  <tr>
                    <td colSpan={6} className="rd-muted" style={{ textAlign: 'center', padding: '32px 0' }}>
                      <em>Stables coverage — coming soon.</em>
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const isLive = livePremiums?.[p.symbol] !== undefined
                    return (
                      <tr
                        key={p.key}
                        className={active === p.key ? 'rd-on' : ''}
                        onClick={() => setActive(p.key)}
                      >
                        <td className="rd-first">{p.label}</td>
                        <td className="rd-muted">
                          <span className="rd-pill" title={`Covered asset · premium paid in ${p.paymentAsset}`}>
                            {p.coveredAsset}
                          </span>
                        </td>
                        <td>{p.trigger}</td>
                        <td className="rd-r">
                          <span className="rd-mult">{p.mult}</span>
                        </td>
                        <td
                          className="rd-r mono"
                          title={
                            isLive
                              ? 'Live premium from /products/{id}/quote · refreshed every hour'
                              : 'Cached premium (live API was unreachable at build time)'
                          }
                        >
                          ${p.premium.toFixed(2)}
                        </td>
                        <td className="rd-r">
                          <span className="rd-pill">T{p.tier}</span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="rd-prod-detail">
            <div>
              <div className="label" style={{ marginBottom: 8 }}>SELECTED</div>
              <div className="rd-sel-name">{a.label}</div>
              <div className="rd-sel-trig">{a.trigger}</div>
            </div>
            <div>
              <div className="label" style={{ marginBottom: 8 }}>COVERAGE</div>
              <div className="rd-sel-num mono">$1,000.00</div>
            </div>
            <div>
              <div className="label" style={{ marginBottom: 8 }}>PREMIUM</div>
              <div className="rd-sel-num mono">${premium}</div>
            </div>
            <div>
              <div className="label" style={{ marginBottom: 8 }}>BOND PAYOUT</div>
              <div className="rd-sel-num rd-accent mono">${payout}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
