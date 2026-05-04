const PHASES = [
  {
    id: 'P1',
    current: true,
    status: 'Current',
    title: 'Foundation',
    body: 'Smart contracts deployed on Base Sepolia. 9 ClaimBond products live. Chainlink oracle integration. Burn engine architecture. Landing page redesign.',
  },
  {
    id: 'P2',
    current: false,
    status: 'Q3 2026',
    title: 'Token Launch',
    body: 'LBP on Fjord Foundry. Uniswap V3 LUMINA/USDC pool. Burn engine activated end-to-end. Real-time burn dashboard. CoinGecko / CMC listing.',
  },
  {
    id: 'P3',
    current: false,
    status: 'Q4 2026',
    title: 'Marketplace & Growth',
    body: 'LuminaBondMarketplace.sol live — 3% fee, 100% burned. Agent framework integrations. Automated AI strategies. Target: 500+ policies/day.',
  },
  {
    id: 'P4',
    current: false,
    status: '2027',
    title: 'Maturity',
    body: 'ERC-1155 epoch system for ClaimBonds. Cross-chain deployment (Arbitrum, Optimism). DAO governance. Institutional integrations.',
  },
] as const

export function Roadmap() {
  return (
    <section className="rd-sec rd-sec-alt" id="roadmap">
      <div className="wrap">
        <div className="rd-sec-num">
          06 / 06 · <span>Roadmap</span>
        </div>
        <h2>From foundation to institutional. Four phases, no detours.</h2>
        <p className="rd-sec-lede">
          Phases ship sequentially. Each unlocks new contract surfaces — no governance dependencies,
          no token-gated milestones.
        </p>

        <div className="rd-roadmap">
          {PHASES.map((p) => (
            <div className={`rd-phase ${p.current ? 'rd-current' : ''}`} key={p.id}>
              <div className="rd-phase-head">
                <div className="rd-pid">{p.id}</div>
                <div className="rd-status">{p.status}</div>
              </div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
