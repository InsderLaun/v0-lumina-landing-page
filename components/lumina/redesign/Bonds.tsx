'use client'

import { useState } from 'react'

export function Bonds() {
  const [splitNow, setSplitNow] = useState(60)

  const usdcToday = ((800 * splitNow) / 100) * 0.5
  const luminaAtMaturity = (800 * (100 - splitNow)) / 100

  return (
    <section className="rd-sec rd-sec-alt" id="bonds">
      <div className="wrap">
        <div className="rd-sec-num">
          02 / 09 · <span>ClaimBond Tokens</span>
        </div>
        <h2>When your bet wins, you don&apos;t get cash. You get something better.</h2>
        <p className="rd-sec-lede">
          ClaimBonds are ERC-1155 tokens. All bonds maturing the same month are interchangeable. 1
          bond = $1 USD claimable at maturity, settled in $LUMINA at market price. You have three
          options.
        </p>

        <div className="rd-bonds-grid">
          {/* OPTION A · HOLD */}
          <div className="rd-bond-card">
            <div className="rd-bond-tag">OPTION A · HOLD</div>
            <h4>Wait 24 months. Redeem full face value.</h4>
            <p>
              Fixed in USD. An $800 bond always redeems for $800 worth of $LUMINA at the market
              price on the day of redemption — regardless of where the token trades.
            </p>
            <div className="rd-bond-row">
              <span>Bond face</span>
              <span className="rd-v mono">$800.00</span>
            </div>
            <div className="rd-bond-row">
              <span>If LUMINA = $0.50</span>
              <span className="rd-v mono">1,600.00 LUMINA</span>
            </div>
            <div className="rd-bond-row">
              <span>If LUMINA = $2.00</span>
              <span className="rd-v mono">400.00 LUMINA</span>
            </div>
            <div className="rd-bond-row">
              <span>You receive</span>
              <span className="rd-v rd-accent mono">$800.00 · always</span>
            </div>
          </div>

          {/* OPTION B · SELL NOW */}
          <div className="rd-bond-card">
            <div className="rd-bond-tag">OPTION B · SELL NOW</div>
            <h4>Don&apos;t want to wait? Sell on the secondary market for USDC.</h4>
            <p>
              Buyers pay a discounted price (typically 40–60% of face) because they have to wait.
              You get less than $800 — but you get it now, in stablecoin.
            </p>
            <div className="rd-bond-row">
              <span>Bond face</span>
              <span className="rd-v mono">$800.00</span>
            </div>
            <div className="rd-bond-row">
              <span>Discount</span>
              <span className="rd-v mono">50%</span>
            </div>
            <div className="rd-bond-row">
              <span>You receive</span>
              <span className="rd-v rd-accent mono">$394.00 USDC</span>
            </div>
            <div className="rd-bond-row">
              <span>Buyer&apos;s IRR</span>
              <span className="rd-v rd-pos mono">+50.0% / yr</span>
            </div>
          </div>

          {/* OPTION C · SPLIT */}
          <div className="rd-bond-card">
            <div className="rd-bond-tag">OPTION C · SPLIT</div>
            <h4>Sell some, keep some. ERC-1155 is fractional.</h4>
            <p>
              Slide to choose how much to sell now vs hold to maturity. Drag the split — both legs
              settle independently.
            </p>
            <div className="rd-split-bar">
              <div className="rd-seg rd-now" style={{ width: `${splitNow}%` }}>
                SELL NOW {splitNow}%
              </div>
              <div className="rd-seg rd-later" style={{ width: `${100 - splitNow}%` }}>
                HOLD {100 - splitNow}%
              </div>
            </div>
            <input
              type="range"
              min={10}
              max={90}
              value={splitNow}
              onChange={(e) => setSplitNow(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--rd-accent)' }}
              aria-label="Sell-now percentage"
            />
            <div className="rd-bond-row">
              <span>USDC today</span>
              <span className="rd-v mono">${usdcToday.toFixed(2)}</span>
            </div>
            <div className="rd-bond-row">
              <span>LUMINA at maturity</span>
              <span className="rd-v mono">${luminaAtMaturity.toFixed(2)}</span>
            </div>
            <div className="rd-bond-row">
              <span>Total face value</span>
              <span className="rd-v rd-accent mono">$800.00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
