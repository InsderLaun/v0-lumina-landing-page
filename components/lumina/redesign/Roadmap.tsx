const PHASES = [
  {
    id: 'P1',
    current: false,
    status: '2026-05-22 · Done',
    title: 'V5.3 Foundation (Sepolia)',
    body: '6 flash shields deployed on Base Sepolia (BTC/ETH × 1h/24h/48h). FlashShieldAdapter UUPS bridge between PolicyManagerV2 legacy IShieldV2 surface and slim BaseFlashShield. BondVault throttle 1.08%/week + FIFO queue. Strike snapshot from Chainlink spot at purchase. AdaptiveFeeDistributor 85/8/2/5 split routing premiums to burn / buyback / ops / maintenance.',
  },
  {
    id: 'P2',
    current: false,
    status: '2026-05-28 · Done',
    title: 'Mainnet Deploy',
    body: '19 core contracts + 6 flash-shield adapters live on Base mainnet (chain 8453). Real Chainlink BTC/USD + ETH/USD + L2 Sequencer feeds wired. Multisig (Gnosis Safe) holds all admin roles. Protocol BOOTSTRAPped paused until the LBP seeds the LUMINA/USDC Uniswap V3 pool.',
  },
  {
    id: 'P3',
    current: true,
    status: 'Live · 2026-05-30',
    title: 'LBP on Fjord Foundry',
    body: 'Liquidity Bootstrapping Pool on Fjord seeds the initial LUMINA/USDC market. Pool address set on CapacityOracle post-LBP. Pre-flight check (full) gates the unpause. Once unpaused, /purchase opens to the public and the 85% premium burn engine starts running on real USDC.',
  },
  {
    id: 'P4',
    current: false,
    status: 'Q3 2026',
    title: 'Public Launch',
    body: 'CoinGecko / CMC listing. Real-time burn dashboard. SDK + MCP server stable. Partner agent integrations. Marketplace secondary volume scales. Cross-chain (Arbitrum, Optimism) and institutional rails follow.',
  },
] as const

export function Roadmap() {
  return (
    <section className="rd-sec rd-sec-alt" id="roadmap">
      <div className="wrap">
        <div className="rd-sec-num">
          09 / 09 · <span>Roadmap</span>
        </div>
        <h2>From V5.3 foundation to public launch. Four phases, no detours.</h2>
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
