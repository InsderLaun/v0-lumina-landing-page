const STEPS = [
  {
    id: '01',
    glyph: '◇',
    title: 'Choose your bet',
    meta: '9 products · BTC / ETH / USDT / USDC',
    body: 'Pick a parametric product (Flash BTC 1h, Micro Depeg, Rate Shock, …) and select coverage. Each product has a precise trigger condition, probability, and multiplier.',
  },
  {
    id: '02',
    glyph: '◆',
    title: 'Premium burns LUMINA',
    meta: '100% to TWAPBurner · zero to team',
    body: 'Your premium routes through the TWAPBurner: USDC buys $LUMINA on Uniswap, tokens are sent to 0xdead. Permanent supply reduction, every transaction.',
  },
  {
    id: '03',
    glyph: '◈',
    title: 'Oracle resolves',
    meta: 'Chainlink · same-block · trustless',
    body: "Chainlink oracles monitor the trigger condition in real time. No committees, no governance, no disputes. The trigger fires or it doesn't. Pure math.",
  },
  {
    id: '04',
    glyph: '◉',
    title: 'Bond or burn',
    meta: 'ERC-1155 · 24-month · USD-fixed',
    body: 'Trigger fires → ClaimBond minted from the 82M reserve, redeemable for the full USD face value in $LUMINA at maturity. No trigger → premium stays burned.',
  },
] as const

export function HowItWorks() {
  return (
    <section className="rd-sec" id="how">
      <div className="wrap">
        <div className="rd-sec-num">
          01 / 07 · <span>Mechanics</span>
        </div>
        <h2>Four steps from bet to burn. No middlemen, no disputes.</h2>
        <p className="rd-sec-lede">
          ClaimBond is a parametric risk protocol on Base L2. Premiums always burn $LUMINA; payouts
          always come from a sealed on-chain reserve. The state machine has four states.
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
