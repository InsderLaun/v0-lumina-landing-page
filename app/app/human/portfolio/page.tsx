import { PortfolioView } from '@/components/lumina/redesign/operate/PortfolioView'
import { LifecycleHint } from '@/components/lumina/redesign/operate/LifecycleHint'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Lumina · Portfolio' }

export default function HumanPortfolioPage() {
  return (
    <>
      <LifecycleHint variant="portfolio" />
      <PortfolioView />
    </>
  )
}
