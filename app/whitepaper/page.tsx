import '@/components/lumina/redesign/redesign.css'

import { TopBar } from '@/components/lumina/redesign/TopBar'
import { Nav } from '@/components/lumina/redesign/Nav'
import { SiteFooter } from '@/components/lumina/redesign/SiteFooter'
import { WhitepaperCard } from '@/components/lumina/redesign/WhitepaperCard'

export const dynamic = 'force-dynamic'

const SUMMARY_EN_URL =
  'https://github.com/org-lumina/v0-lumina-landing-page/blob/main/public/LUMINA-SUMMARY-EN.pdf'
const SUMMARY_ES_URL =
  'https://github.com/org-lumina/v0-lumina-landing-page/blob/main/public/LUMINA-SUMMARY-ES.pdf'

export default function WhitepaperHubPage() {
  return (
    <div className="rd-page">
      <TopBar />
      <Nav />

      <header className="rd-wp-hero">
        <div className="wrap">
          <span className="rd-eyebrow">Whitepapers · V3.0 · 2026</span>
          <h1>
            Choose your <em>reading</em>.
          </h1>
          <p className="rd-lede">
            Four versions. Two languages, two depths. The full whitepaper covers every contract
            address, formula, and actuarial table. The summary is a 2-page brief for quick context.
          </p>
        </div>
      </header>

      <main className="rd-wp-versions">
        <div className="wrap">
          <div className="rd-section-head">
            <h2>Full Whitepaper · V3.0</h2>
            <span className="rd-count">17 sections · ~50 pages</span>
          </div>
          <div className="rd-wp-grid">
            <WhitepaperCard
              variant="full"
              flag="EN"
              ver="FULL · V3.0"
              pages="English"
              title="Whitepaper · English"
              desc="Complete protocol specification: architecture, kink pricing model, 9 ClaimBond products, oracle infrastructure, security audit findings, and full economic model."
              toc="§1 Abstract · §2 Architecture · §3 Pricing · §4 Products · §5 ClaimBonds · §6 Oracle · §7 Security · §17 Roadmap"
              href="/whitepaper/en"
              cta="Read full →"
              source="hosted"
            />
            <WhitepaperCard
              variant="full"
              flag="ES"
              ver="COMPLETO · V3.0"
              pages="Español"
              title="Whitepaper · Español"
              desc="Especificación completa del protocolo: arquitectura, modelo kink de pricing, 9 productos ClaimBond, infraestructura oracle, hallazgos de auditoría y modelo económico íntegro."
              toc="§1 Resumen · §2 Arquitectura · §3 Pricing · §4 Productos · §5 ClaimBonds · §6 Oracle · §7 Seguridad · §17 Roadmap"
              href="/whitepaper/es"
              cta="Leer completo →"
              source="hosted"
            />
          </div>

          <div className="rd-section-head" style={{ marginTop: 64 }}>
            <h2>Executive Summary · 2-page brief</h2>
            <span className="rd-count">Quick context · PDF</span>
          </div>
          <div className="rd-wp-grid">
            <WhitepaperCard
              variant="summary"
              flag="EN"
              ver="SUMMARY · PDF"
              pages="2 pages"
              title="Summary · English"
              desc="Two-page brief covering what Lumina is, why parametric speculation for AI agents matters, and how to integrate. Ideal for investors, partners, or quick technical orientation."
              toc="Problem · Solution · Architecture · 9 products at a glance · Tokenomics · Roadmap · Contact"
              href={SUMMARY_EN_URL}
              external
              cta="Open PDF ↗"
              source="github"
            />
            <WhitepaperCard
              variant="summary"
              flag="ES"
              ver="RESUMEN · PDF"
              pages="2 páginas"
              title="Resumen · Español"
              desc="Brief de dos páginas: qué es Lumina, por qué la especulación paramétrica para agentes IA importa y cómo integrarlo. Ideal para inversores, partners u orientación técnica rápida."
              toc="Problema · Solución · Arquitectura · 9 productos · Tokenomics · Roadmap · Contacto"
              href={SUMMARY_ES_URL}
              external
              cta="Abrir PDF ↗"
              source="github"
            />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
