import '@/components/lumina/redesign/redesign.css'

import { TopBar } from '@/components/lumina/redesign/TopBar'
import { Nav } from '@/components/lumina/redesign/Nav'
import { Hero } from '@/components/lumina/redesign/Hero'
import { HowItWorks } from '@/components/lumina/redesign/HowItWorks'
import { Bonds } from '@/components/lumina/redesign/Bonds'
import { Products } from '@/components/lumina/redesign/Products'
import { SdkCta } from '@/components/lumina/redesign/SdkCta'
import { MarketplaceSection } from '@/components/lumina/redesign/MarketplaceSection'
import { BurnEngine } from '@/components/lumina/redesign/BurnEngine'
import { Audience } from '@/components/lumina/redesign/Audience'
import { Roadmap } from '@/components/lumina/redesign/Roadmap'
import { CTAFooter } from '@/components/lumina/redesign/CTAFooter'
import { SiteFooter } from '@/components/lumina/redesign/SiteFooter'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="rd-page">
      <TopBar />
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Bonds />
        <Products />
        <SdkCta />
        <MarketplaceSection />
        <BurnEngine />
        <Audience />
        <Roadmap />
        <CTAFooter />
      </main>
      <SiteFooter />
    </div>
  )
}
