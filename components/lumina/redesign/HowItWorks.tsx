const STEPS = [
  {
    id: '01',
    glyph: '◇',
    title: 'Choose your bet',
    meta: '6 products · BTC / ETH · 1h / 24h / 48h',
    body: 'Pick a flash product (Flash BTC 1h, Flash ETH 24h, …) and select coverage between $100 and the live BondVault capacity. Each product has a precise drop-from-purchase-price trigger and a fixed multiplier.',
  },
  {
    id: '02',
    glyph: '◆',
    title: 'Premium routes to burn',
    meta: '85% burned · 8% treasury · 2% ops · 5% founder',
    body: 'Your premium routes through the AdaptiveFeeDistributor. 85% reaches the TWAPBurner: USDC buys $LUMINA on Uniswap V3, tokens go to 0xdead. The remaining 15% funds treasury, ops, and the founder vesting reserve. Burns are atomic with the originating transaction.',
  },
  {
    id: '03',
    glyph: '◈',
    title: 'Oracle resolves',
    meta: 'Chainlink BTC/USD + ETH/USD · MIN-of-3 confirmations · trustless',
    body: "The shield reads spot 3 times in-transaction (MIN-of-3 = conservative reference). If the drop from your purchase price meets the trigger, the policy fires. No committees, no governance, no disputes — pure math.",
  },
  {
    id: '04',
    glyph: '◉',
    title: 'Bond or burn',
    meta: 'ERC-1155 · 730-day maturity · USD-fixed',
    body: 'Trigger fires → ClaimBond minted from the BondVault reserve, redeemable for the full USD face value in $LUMINA at maturity (~730 days). No trigger → premium stays burned. The bond is freely transferable on the secondary marketplace before maturity.',
  },
] as const

export function HowItWorks() {
  return (
    <section className="rd-sec" id="how">
      <div className="wrap">
        <div className="rd-sec-num">
          01 / 09 · <span>Mechanics</span>
        </div>
        <h2>Four steps from bet to burn. No middlemen, no disputes.</h2>
        <p className="rd-sec-lede">
          ClaimBond is a parametric risk protocol on Base L2. Premiums route 85% to burn through the
          AdaptiveFeeDistributor; payouts always come from a sealed on-chain reserve. The state
          machine has four states.
        </p>

        <div className="rd-steps">
          {STEPS.map((s) => (
            <div className="rd-step" key={s.id}>
              <div className="rd-step-num">
                <span>STEP {s.id}</span>
                <span className="rd-glyph">{s.glyph}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="rd-step-meta">{s.meta}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
