const PHASES = [
  {
    id: 'P1',
    current: false,
    status: '2026-05-22 · Done',
    title: 'V5.3 Foundation',
    body: '6 flash shields deployed on Base Sepolia (BTC/ETH × 1h/24h/48h). FlashShieldAdapter UUPS bridge between PolicyManagerV2 legacy IShieldV2 surface and slim BaseFlashShield. BondVault throttle 1.08%/week + FIFO queue. Strike snapshot from Chainlink spot at purchase. AdaptiveFeeDistributor 85/8/2/5 split routing premiums to burn / treasury / ops / founder.',
  },
  {
    id: 'P2',
    current: true,
    status: 'Current · Q3 2026',
    title: 'Real Testnet Usage',
    body: 'USDC mock mintable for founder + agents. Founder and partner agents buy real policies, exercise the full purchase → trigger → bond → redeem lifecycle on Base Sepolia. 1–2 months of iteration before pre-mainnet review.',
  },
  {
    id: 'P3',
    current: false,
    status: 'Q4 2026',
    title: 'Pre-Mainnet',
    body: 'External audit on V5.3 frozen surface. Slither + Echidna + Halmos green for 9.6M+ runs. Mainnet runbook hardened with deterministic nonce-tracking for admin ops. LBP on Fjord, Uniswap V3 LUMINA/USDC pool, ClaimBondMarketplace public.',
  },
  {
    id: 'P4',
    current: false,
    status: '2027',
    title: 'Mainnet Launch',
    body: 'Base mainnet deploy. Real Chainlink BTC/USD + ETH/USD feeds. Sequencer uptime feed wired. CoinGecko / CMC listing. Real-time burn dashboard. Cross-chain (Arbitrum, Optimism) and institutional rails follow.',
  },
] as const

export function Roadmap() {
  return (
    <section className="rd-sec rd-sec-alt" id="roadmap">
      <div className="wrap">
        <div className="rd-sec-num">
          09 / 09 · <span>Roadmap</span>
        </div>
        <h2>From V5.3 foundation to mainnet. Four phases, no detours.</h2>
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
