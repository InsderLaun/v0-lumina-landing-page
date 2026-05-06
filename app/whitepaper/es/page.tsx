import '@/components/lumina/redesign/redesign.css'
import { WhitepaperShell } from '@/components/lumina/redesign/WhitepaperShell'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Lumina Protocol — Whitepaper · Español',
  description:
    'Whitepaper completo de Lumina Protocol (Español). 9 shields paramétricos, BondVault único, mecánica ClaimBond, oráculo EIP-712, distribución adaptativa de quema, token deflacionario y API agent-first.',
}

export default function WhitepaperES() {
  return <WhitepaperShell lang="es" iframeSrc="/LUMINA-WHITEPAPER-ES-V5.1.html" />
}
