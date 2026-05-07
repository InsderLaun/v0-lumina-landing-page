import { MarketplaceView } from '@/components/lumina/redesign/operate/MarketplaceView'
import { LifecycleHint } from '@/components/lumina/redesign/operate/LifecycleHint'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Lumina · Marketplace' }

export default function HumanMarketplacePage() {
  return (
    <>
      <LifecycleHint variant="marketplace" />
      <MarketplaceView />
    </>
  )
}
