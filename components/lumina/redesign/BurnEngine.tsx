'use client'

import { useState, useEffect } from 'react'

// TODO(sprint-future): connect to TWAPBurner contract events for real-time
// burned counter (currently mock auto-incrementing). The contract address
// lives in lib/lumina-config.ts → CONTRACTS.TWAPBurner.
const INITIAL_BURNED = 1_284_402

export function BurnEngine() {
  const [counter, setCounter] = useState(INITIAL_BURNED)

  useEffect(() => {
    const id = setInterval(
      () => setCounter((c) => c + Math.floor(Math.random() * 60 + 5)),
      1800,
    )
    return () => clearInterval(id)
  }, [])

  return (
    <section className="rd-sec rd-sec-alt" id="burn">
      <div className="wrap">
        <div className="rd-sec-num">
          04 / 06 · <span>Deflationary Flow</span>
        </div>
        <div className="rd-flow">
          <div>
            <h2>
              Every premium and every secondary trade burns $LUMINA. <em>Forever.</em>
            </h2>
            <p className="rd-sec-lede" style={{ marginTop: 32 }}>
              The protocol has two burn paths. Premiums route 100% through the TWAPBurner — USDC
              buys $LUMINA on Uniswap V3, tokens are sent to 0xdead. Secondary marketplace trades
              pay a 3% fee that takes the same path.
            </p>
            <ul className="rd-flow-list">
              <li>– Nothing routes to the team multisig.</li>
              <li>– Nothing accrues to a treasury.</li>
              <li>– Nothing waits in a buyback queue.</li>
              <li>– Burns are atomic with the originating transaction.</li>
            </ul>
          </div>

          <div className="rd-flow-diagram">
            <div className="label" style={{ marginBottom: 18 }}>
              EXAMPLE · $1,000 COVERAGE · BTC FLASH 1H
            </div>
            <div className="rd-flow-step">
              <div className="rd-num">01</div>
              <div className="rd-desc">
                User pays premium <small>USDC, atomic</small>
              </div>
              <div className="rd-amt">$2.40</div>
            </div>
            <div className="rd-flow-step">
              <div className="rd-num">02</div>
              <div className="rd-desc">
                TWAPBurner buys LUMINA <small>Uniswap V3 · 0.3% pool</small>
              </div>
              <div className="rd-amt">$2.40 in</div>
            </div>
            <div className="rd-flow-step rd-fire">
              <div className="rd-num">03</div>
              <div className="rd-desc">
                Tokens sent to 0xdead <small>permanent · supply −</small>
              </div>
              <div className="rd-amt">≈ 65.93 LUMINA</div>
            </div>
            <div className="rd-flow-step">
              <div className="rd-num">04</div>
              <div className="rd-desc">
                If trigger fires <small>oracle verified, same block</small>
              </div>
              <div className="rd-amt mono">$800 bond</div>
            </div>

            <div className="rd-burn-counter">
              <div className="label">TOTAL LUMINA BURNED</div>
              <div className="rd-v">{counter.toLocaleString('en-US')}</div>
              <div className="rd-sub">~ $46,752 destroyed forever · last 30d: 184k</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
