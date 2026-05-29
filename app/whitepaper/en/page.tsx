import '@/components/lumina/redesign/redesign.css'
import { WhitepaperShell } from '@/components/lumina/redesign/WhitepaperShell'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Lumina Protocol — Whitepaper · English',
  description:
    'Full Lumina Protocol whitepaper (English). 6 Flash BTC/ETH parametric shields, single BondVault, ClaimBond mechanics, Chainlink oracle on Base mainnet, adaptive burn distribution, deflationary token, and agent-first API.',
}

export default function WhitepaperEN() {
  return <WhitepaperShell lang="en" iframeSrc="/LUMINA-WHITEPAPER-EN-V5.3.html" />
}
