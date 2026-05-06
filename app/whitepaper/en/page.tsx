import '@/components/lumina/redesign/redesign.css'
import { WhitepaperShell } from '@/components/lumina/redesign/WhitepaperShell'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Lumina Protocol — Whitepaper V5.1 · English',
  description:
    'Full Lumina Protocol whitepaper V5.1 (English). 9 parametric shields, single BondVault, ClaimBond mechanics, EIP-712 oracle, deflationary token, and agent-first API.',
}

export default function WhitepaperEN() {
  return <WhitepaperShell lang="en" iframeSrc="/LUMINA-WHITEPAPER-EN-V5.1.html" />
}
