import type { ReactNode } from 'react'

export interface CompareRow {
  action: string
  human: ReactNode
  agent: ReactNode
}

const ROWS: CompareRow[] = [
  {
    action: 'Onboarding',
    human: 'Connect a wallet, switch to Base mainnet, get USDC. ~5 minutes.',
    agent: 'Request an API key, set 3 env vars, run a health check. ~15 minutes.',
  },
  {
    action: 'Quote a premium',
    human: 'Open a shield card; the UI calls quotePremium and renders the number.',
    agent: 'GET /products/:id/quote?cover=N — public, no key required.',
  },
  {
    action: 'Buy a policy',
    human: 'Approve USDC, sign purchasePolicy. Two wallet prompts, your gas.',
    agent: 'POST /api/v1/policies — single HTTP call. Relayer pays gas.',
  },
  {
    action: 'Track positions',
    human: 'Open /app/human/portfolio — reads PolicyCreated + BondsMinted events.',
    agent: 'GET /api/v1/policies + /api/v1/bonds/:wallet, or poll on a cadence.',
  },
  {
    action: 'Redeem at maturity',
    human: 'Click "Redeem" in portfolio; sign redeemBond. One wallet prompt.',
    agent: 'On-chain call, then POST /api/v1/redeem with the txHash for indexing.',
  },
  {
    action: 'List on marketplace',
    human: 'Click "List" on a bond; pick price + amount; sign two transactions.',
    agent: 'On-chain Marketplace.list call, then POST /api/v1/marketplace/list.',
  },
]

export function CompareSection() {
  return (
    <section className="rd-tut-compare">
      <div className="wrap">
        <div className="rd-tut-compare-head">
          <span className="rd-eyebrow">Side by side</span>
          <h2 className="rd-tut-compare-title">
            Same protocol, two surfaces.
          </h2>
          <p className="rd-tut-compare-lede">
            The contracts are identical for both audiences. The only difference is
            whether you sign with a wallet or send an HTTP request.
          </p>
        </div>

        <div className="rd-tut-compare-grid">
          <div className="rd-tut-compare-row rd-tut-compare-row--head">
            <div className="rd-tut-compare-cell rd-tut-compare-cell--label">ACTION</div>
            <div className="rd-tut-compare-cell rd-tut-compare-cell--head">👤 HUMAN</div>
            <div className="rd-tut-compare-cell rd-tut-compare-cell--head">🤖 AGENT</div>
          </div>
          {ROWS.map((row) => (
            <div className="rd-tut-compare-row" key={row.action}>
              <div className="rd-tut-compare-cell rd-tut-compare-cell--label">
                {row.action}
              </div>
              <div className="rd-tut-compare-cell">{row.human}</div>
              <div className="rd-tut-compare-cell">{row.agent}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
