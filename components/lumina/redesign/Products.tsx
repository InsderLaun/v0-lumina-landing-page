'use client'

import { useState, useMemo } from 'react'

// 9 products matching the V5.1 deployed shields:
// FlashBTC × 4 (1h/4h/24h/48h) + FlashETH × 3 (1h/24h/48h)
// + Micro Depeg USDT + Rate Shock (Aave USDC).
// Source: org-lumina/LUMINA-PROTOCOL deployments/sepolia/V5.1-2026-04-27.json
// (cf. lib/lumina-config.ts comment "9 shield products").
//
// `coveredAsset` is the asset whose price/rate is observed by the trigger.
// `paymentAsset` is the asset paid as premium and as the marketplace settlement
// currency — always USDC across the V5.1 product line.
//
// TODO(sprint-future): expose this list from a shared lib (lib/products.ts is
// still on the V2 6-product schema). Don't import from there yet.
const PRODUCTS = [
  { key: 'btc-1h',  symbol: 'FLASHBTC1H-001', label: 'Flash BTC 1h',     coveredAsset: 'BTC',  paymentAsset: 'USDC', duration: '1h',  trigger: 'BTC −5% / 1h',          prob: '0.20', mult: '333x', tier: 1 },
  { key: 'btc-4h',  symbol: 'FLASHBTC4H-001', label: 'Flash BTC 4h',     coveredAsset: 'BTC',  paymentAsset: 'USDC', duration: '4h',  trigger: 'BTC −8% / 4h',          prob: '0.35', mult: '190x', tier: 1 },
  { key: 'btc-24h', symbol: 'FLASHBTC24-001', label: 'Flash BTC 24h',    coveredAsset: 'BTC',  paymentAsset: 'USDC', duration: '24h', trigger: 'BTC −10% / 24h',        prob: '1.50', mult: '44x',  tier: 1 },
  { key: 'btc-48h', symbol: 'FLASHBTC48-001', label: 'Flash BTC 48h',    coveredAsset: 'BTC',  paymentAsset: 'USDC', duration: '48h', trigger: 'BTC −15% / 48h',        prob: '0.80', mult: '83x',  tier: 1 },
  { key: 'eth-1h',  symbol: 'FLASHETH1H-001', label: 'Flash ETH 1h',     coveredAsset: 'ETH',  paymentAsset: 'USDC', duration: '1h',  trigger: 'ETH −7% / 1h',          prob: '0.25', mult: '266x', tier: 1 },
  { key: 'eth-24h', symbol: 'FLASHETH24-001', label: 'Flash ETH 24h',    coveredAsset: 'ETH',  paymentAsset: 'USDC', duration: '24h', trigger: 'ETH −12% / 24h',        prob: '2.00', mult: '33x',  tier: 1 },
  { key: 'eth-48h', symbol: 'FLASHETH48-001', label: 'Flash ETH 48h',    coveredAsset: 'ETH',  paymentAsset: 'USDC', duration: '48h', trigger: 'ETH −18% / 48h',        prob: '0.90', mult: '74x',  tier: 1 },
  { key: 'depeg',   symbol: 'MICRODEPEG-001', label: 'Micro Depeg USDT', coveredAsset: 'USDT', paymentAsset: 'USDC', duration: '7d',  trigger: 'USDT < $0.995 / 7d',    prob: '3.50', mult: '19x',  tier: 2 },
  { key: 'rate',    symbol: 'RATESHOCK-001',  label: 'Rate Shock',       coveredAsset: 'USDC', paymentAsset: 'USDC', duration: '7d',  trigger: 'Aave USDC > 10% / 7d',  prob: '4.00', mult: '17x',  tier: 2 },
] as const

const FILTERS = ['ALL', 'BTC', 'ETH', 'STABLES'] as const
type Filter = (typeof FILTERS)[number]

export function Products() {
  const [filter, setFilter] = useState<Filter>('ALL')
  const [active, setActive] = useState<string>('btc-1h')

  const filtered = useMemo(() => {
    if (filter === 'BTC') return PRODUCTS.filter((p) => p.coveredAsset === 'BTC')
    if (filter === 'ETH') return PRODUCTS.filter((p) => p.coveredAsset === 'ETH')
    if (filter === 'STABLES')
      return PRODUCTS.filter((p) => p.coveredAsset === 'USDT' || p.coveredAsset === 'USDC')
    return PRODUCTS
  }, [filter])

  const a = PRODUCTS.find((p) => p.key === active) ?? PRODUCTS[0]
  const cov = 1000
  const probNum = parseFloat(a.prob) / 100
  const premium = (cov * 0.8 * probNum * 1.5).toFixed(2)
  const payout = (cov * 0.8).toFixed(2)

  return (
    <section className="rd-sec" id="products">
      <div className="wrap">
        <div className="rd-sec-num">
          03 / 07 · <span>Live Markets</span>
        </div>
        <h2>Nine products. Each with a precise trigger, probability, and multiplier.</h2>
        <p className="rd-sec-lede">
          Click a row to open the bet sheet. Probabilities are derived from rolling 90-day
          historical volatility; multipliers are derived from the bond reserve curve.
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
          The <em>Covers</em> column is the asset whose price (or rate) the oracle observes for the
          trigger.
        </p>

        <div className="rd-prod-shell">
          <div className="rd-prod-head">
            <div className="label">PRODUCTS · 9 ACTIVE</div>
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
                  <th className="rd-r">Prob.</th>
                  <th className="rd-r">Multiplier</th>
                  <th className="rd-r">Premium /$1K</th>
                  <th className="rd-r">Tier</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const prem = (1000 * 0.8 * (parseFloat(p.prob) / 100) * 1.5).toFixed(2)
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
                      <td className="rd-r">{p.prob}%</td>
                      <td className="rd-r">
                        <span className="rd-mult">{p.mult}</span>
                      </td>
                      <td className="rd-r mono">${prem}</td>
                      <td className="rd-r">
                        <span className="rd-pill">T{p.tier}</span>
                      </td>
                    </tr>
                  )
                })}
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
