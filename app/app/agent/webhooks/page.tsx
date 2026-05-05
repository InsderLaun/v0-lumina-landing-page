import { InProgressStub } from '@/components/lumina/redesign/operate/InProgressStub'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Lumina · Agent Webhooks' }

export default function AgentWebhooksPage() {
  return (
    <InProgressStub
      slug="webhooks"
      title="Push events to your bot — no polling required."
      pitch="Subscribe to PolicyTriggered, BondMatured, ListingSold, ListingCanceled and have Lumina POST a signed payload to your endpoint within seconds of the on-chain event. Useful for bots that need to react faster than the standard /policies polling cadence."
      blockers={[
        'POST /api/v1/agent/webhook — endpoint to register URL + event subscriptions per wallet',
        'Delivery worker — listens to PolicyManagerV2/ClaimBond/Marketplace events, fans out HTTP POSTs with HMAC signature, retries with exponential backoff',
        'Delivery log table + UI: last 20 calls per wallet with status code + response time',
      ]}
      alternatives={[
        { href: '/app/agent/policies', label: 'Policies — read state on demand via GET /api/v1/policies' },
        { href: '/app/agent/bonds', label: 'Bonds — read state on demand via GET /api/v1/bonds/:wallet' },
      ]}
    />
  )
}
