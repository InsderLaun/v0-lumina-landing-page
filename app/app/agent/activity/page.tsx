import { InProgressStub } from '@/components/lumina/redesign/operate/InProgressStub'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Lumina · Agent Activity' }

export default function AgentActivityPage() {
  return (
    <InProgressStub
      slug="activity"
      title="Every operation your bot performs, in one feed."
      pitch="Unified, sortable activity log: policy purchases, oracle triggers, bonds minted/redeemed, marketplace listings/sales — each with a Basescan link. Currently each tab shows its own slice; this view will merge them once the API has an audit log endpoint."
      blockers={[
        'GET /api/v1/agent/activity — needs an audit_log table on the API (or a chain indexer) populated by every authenticated route',
        'Pagination via ?cursor=… so the agent can scroll back beyond the last 50',
        'Frontend: timeline component with type-filtered rows + relative timestamps',
      ]}
      alternatives={[
        { href: '/app/agent/dashboard', label: 'Dashboard — last-20 events feed (already on-chain-derived)' },
        { href: '/app/agent/policies', label: 'Policies — every PolicyCreated tx for this wallet' },
        { href: '/app/agent/bonds', label: 'Bonds — every BondsMinted tx for this wallet' },
      ]}
    />
  )
}
