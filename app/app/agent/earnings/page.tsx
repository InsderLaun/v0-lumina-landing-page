import { InProgressStub } from '@/components/lumina/redesign/operate/InProgressStub'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Lumina · Agent Earnings' }

export default function AgentEarningsPage() {
  return (
    <InProgressStub
      slug="earnings"
      title="Premiums spent · payouts received · net P&L."
      pitch="A live financial summary of every position your bot has ever opened on Lumina, with a daily breakdown chart and CSV export. We can't ship this honestly until the backend aggregates the four event sources cleanly — we won't fake it with mocked numbers."
      blockers={[
        'GET /api/v1/agent/earnings — needs to sum PolicyPurchased, BondRedeemed, Listed, and Bought events per wallet',
        'On-chain event indexer (or a periodic SQL aggregation job) so the API doesn\'t make ~50 RPC chunked calls per request',
        'Daily-bucketed series for the chart — mirrors the same queries grouped by day',
      ]}
      alternatives={[
        { href: '/app/agent/dashboard', label: 'Dashboard — current-state KPIs (active policies, outstanding bonds)' },
        { href: '/app/agent/policies', label: 'Policies — full list with premium per row' },
        { href: '/app/agent/bonds', label: 'Bonds — face values + maturity per holding' },
      ]}
    />
  )
}
