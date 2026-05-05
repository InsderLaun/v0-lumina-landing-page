import { MarketplaceView } from '@/components/lumina/redesign/operate/MarketplaceView'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Lumina · Agent Marketplace' }

/**
 * Same MarketplaceView component the human role uses — bond listings are
 * the same on-chain market regardless of who's looking. Layered under the
 * agent AppShell (selected via the `/app/agent/*` route segment) so the
 * supervisor sidebar stays consistent.
 */
export default function AgentMarketplacePage() {
  return <MarketplaceView />
}
