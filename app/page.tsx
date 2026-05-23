import '@/components/lumina/redesign/redesign.css'

import { TopBar } from '@/components/lumina/redesign/TopBar'
import { Nav } from '@/components/lumina/redesign/Nav'
import { Hero } from '@/components/lumina/redesign/Hero'
import { HowItWorks } from '@/components/lumina/redesign/HowItWorks'
import { Bonds } from '@/components/lumina/redesign/Bonds'
import { Products } from '@/components/lumina/redesign/Products'
import { SdkCta } from '@/components/lumina/redesign/SdkCta'
import { MarketplaceSection } from '@/components/lumina/redesign/MarketplaceSection'
import { LifecycleSection } from '@/components/lumina/redesign/LifecycleSection'
import { BurnEngine } from '@/components/lumina/redesign/BurnEngine'
import { Audience } from '@/components/lumina/redesign/Audience'
import { Roadmap } from '@/components/lumina/redesign/Roadmap'
import { CTAFooter } from '@/components/lumina/redesign/CTAFooter'
import { SiteFooter } from '@/components/lumina/redesign/SiteFooter'

export const dynamic = 'force-dynamic'

const API_BASE = 'https://lumina-api-production-ac85.up.railway.app'
const QUOTE_COVERAGE_BASE_UNITS = '1000000000' // $1,000 in 6-dec USDC

interface ApiProduct {
  productId: string
  name: string
  active: boolean
}

interface QuoteResponse {
  productId: string
  coverageAmount: string
  premium: string
  payout: string
}

/**
 * Fetch live premiums for the 6 active flash shields. Runs at request time
 * (`force-dynamic`) and caches the result for 1h via Next's fetch cache.
 * On any failure the function returns `null` and the `<Products />` component
 * falls back to its hardcoded source-of-truth, so the page never breaks if
 * the API is down or build runs offline.
 */
async function fetchLivePremiums(): Promise<Record<string, number> | null> {
  try {
    const productsRes = await fetch(`${API_BASE}/products`, {
      next: { revalidate: 3600 },
    })
    if (!productsRes.ok) throw new Error(`/products ${productsRes.status}`)
    const productsBody = (await productsRes.json()) as { products: ApiProduct[] }
    const active = productsBody.products.filter((p) => p.active)

    const quotes = await Promise.all(
      active.map(async (p) => {
        const r = await fetch(
          `${API_BASE}/products/${p.productId}/quote?coverageAmount=${QUOTE_COVERAGE_BASE_UNITS}`,
          { next: { revalidate: 3600 } },
        )
        if (!r.ok) throw new Error(`quote ${p.name} ${r.status}`)
        const q = (await r.json()) as QuoteResponse
        // premium is in 6-dec USDC base units; convert to dollars for $1k cover
        return [p.name, Number(q.premium) / 1_000_000] as const
      }),
    )

    return Object.fromEntries(quotes)
  } catch (err) {
    // Fail-silent: log on the server, return null so the client falls back to
    // the hardcoded source-of-truth in `<Products />`.
    console.error('[page.tsx] live premium fetch failed, falling back to static:', err)
    return null
  }
}

export default async function HomePage() {
  const livePremiums = await fetchLivePremiums()

  return (
    <div className="rd-page">
      <TopBar />
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Bonds />
        <Products livePremiums={livePremiums ?? undefined} />
        <SdkCta />
        <MarketplaceSection />
        <LifecycleSection />
        <BurnEngine />
        <Audience />
        <Roadmap />
        <CTAFooter />
      </main>
      <SiteFooter />
    </div>
  )
}
