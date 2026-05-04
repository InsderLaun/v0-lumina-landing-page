'use client'

import { useState, useMemo } from 'react'

// 9 products matching the V5.1 deployed shields:
// FlashBTC × 4 (1h/4h/24h/48h) + FlashETH × 3 (1h/24h/48h)
// + Micro Depeg USDT + Rate Shock (Aave USDC).
// Source: org-lumina/LUMINA-PROTOCOL deployments/sepolia/V5.1-2026-04-27.json
// (cf. lib/lumina-config.ts comment "9 shield products").
//
// TODO(sprint-future): expose this list from a shared lib (lib/products.ts is
// still on the V2 6-product schema). Don't import from there yet.
const PRODUCTS = [
  { key: 'btc-1h',  label: 'Flash BTC 1h',     asset: 'BTC',  duration: '1h',  trigger: 'BTC −5% / 1h',          prob: '0.20', mult: '333x', tier: 1 },
  { key: 'btc-4h',  label: 'Flash BTC 4h',     asset: 'BTC',  duration: '4h',  trigger: 'BTC −8% / 4h',          prob: '0.35', mult: '190x', tier: 1 },
  { key: 'btc-24h', label: 'Flash BTC 24h',    asset: 'BTC',  duration: '24h', trigger: 'BTC −10% / 24h',        prob: '1.50', mult: '44x',  tier: 1 },
  { key: 'btc-48h', label: 'Flash BTC 48h',    asset: 'BTC',  duration: '48h', trigger: 'BTC −15% / 48h',        prob: '0.80', mult: '83x',  tier: 1 },
  { key: 'eth-1h',  label: 'Flash ETH 1h',     asset: 'ETH',  duration: '1h',  trigger: 'ETH −7% / 1h',          prob: '0.25', mult: '266x', tier: 1 },
  { key: 'eth-24h', label: 'Flash ETH 24h',    asset: 'ETH',  duration: '24h', trigger: 'ETH −12% / 24h',        prob: '2.00', mult: '33x',  tier: 1 },
  { key: 'eth-48h', label: 'Flash ETH 48h',    asset: 'ETH',  duration: '48h', trigger: 'ETH −18% / 48h',        prob: '0.90', mult: '74x',  tier: 1 },
  { key: 'depeg',   label: 'Micro Depeg USDT', asset: 'USDT', duration: '7d',  trigger: 'USDT < $0.995 / 7d',    prob: '3.50', mult: '19x',  tier: 2 },
  { key: 'rate',    label: 'Rate Shock',       asset: 'USDC', duration: '7d',  trigger: 'Aave USDC > 10% / 7d',  prob: '4.00', mult: '17x',  tier: 2 },
] as const

const FILTERS = ['ALL', 'BTC', 'ETH', 'STABLES'] as const
type Filter = (typeof FILTERS)[number]

export function Products() {
  const [filter, setFilter] = useState<Filter>('ALL')
  const [active, setActive] = useState<string>('btc-1h')

  const filtered = useMemo(() => {
    if (filter === 'BTC') return PRODUCTS.filter((p) => p.asset === 'BTC')
    if (filter === 'ETH') return PRODUCTS.filter((p) => p.asset === 'ETH')
    if (filter === 'STABLES') return PRODUCTS.filter((p) => p.asset === 'USDT' || p.asset === 'USDC')
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
          03 / 06 · <span>Live Markets</span>
        </div>
        <h2>Nine products. Each with a precise trigger, probability, and multiplier.</h2>
        <p className="rd-sec-lede">
          Click a row to open the bet sheet. Probabilities are derived from rolling 90-day
          historical volatility; multipliers are derived from the bond reserve curve.
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
                  <th>Asset</th>
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
                      <td className="rd-muted">{p.asset}</td>
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
