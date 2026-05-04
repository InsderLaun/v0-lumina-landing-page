import '@/components/lumina/redesign/redesign.css'
import { WhitepaperShell } from '@/components/lumina/redesign/WhitepaperShell'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Lumina Protocol — Whitepaper V3 · Español',
  description:
    'Whitepaper completo de Lumina Protocol V3 (Español). Arquitectura, modelo kink de pricing, mecánica ClaimBond, infraestructura oracle y hallazgos de auditoría.',
}

export default function WhitepaperES() {
  return <WhitepaperShell lang="es" iframeSrc="/LUMINA-WHITEPAPER-ES-V3.html" />
}
