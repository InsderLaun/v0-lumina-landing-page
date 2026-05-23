import '@/components/lumina/redesign/redesign.css'

import { TopBar } from '@/components/lumina/redesign/TopBar'
import { Nav } from '@/components/lumina/redesign/Nav'
import { SiteFooter } from '@/components/lumina/redesign/SiteFooter'
import { FaucetSection } from '@/components/lumina/redesign/Faucet'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Faucet · LUMINA Protocol',
  description:
    'Get 10,000 mock USDC + 0.05 Base Sepolia ETH to test Lumina parametric shields. One claim per wallet per 24h.',
}

// Sprint USDC Mock — Phase 5.
//
// /faucet is a first-class landing route mounting <FaucetSection />. The
// section is wagmi-aware (reads address from `useAccount()`), so the user
// only sees the claim button after connecting via the navbar's Connect
// button (RainbowKit), matching the wallet flow on every other Operate
// surface.
//
// Replaces the standalone manual-wallet form that lived here under
// Sprint L. The wagmi flow is the canonical path going forward; the
// manual form was kept as a fallback while the rest of the site still
// had a mixed-auth UX, but that's no longer the case.
export default function FaucetPage() {
  return (
    <div className="rd-page">
      <TopBar />
      <Nav />
      <main>
        <FaucetSection />
      </main>
      <SiteFooter />
    </div>
  )
}
