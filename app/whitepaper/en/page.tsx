import '@/components/lumina/redesign/redesign.css'
import { WhitepaperShell } from '@/components/lumina/redesign/WhitepaperShell'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Lumina Protocol — Whitepaper V3 · English',
  description:
    'Full Lumina Protocol whitepaper V3 (English). Architecture, kink pricing, ClaimBond mechanics, oracle infrastructure, and security audit findings.',
}

export default function WhitepaperEN() {
  return <WhitepaperShell lang="en" iframeSrc="/LUMINA-WHITEPAPER-EN-V3.html" />
}
