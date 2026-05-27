import '@/components/lumina/redesign/redesign.css'

import { TopBar } from '@/components/lumina/redesign/TopBar'
import { Nav } from '@/components/lumina/redesign/Nav'
import { SiteFooter } from '@/components/lumina/redesign/SiteFooter'
import { WhitepaperCard } from '@/components/lumina/redesign/WhitepaperCard'

export const dynamic = 'force-dynamic'

// Short ("summary") whitepaper is the on-site, fully-designed interactive page
// at /whitepaper-short/[lang] — NOT a GitHub PDF. Mirrors the full whitepaper,
// which is also hosted in-site (/whitepaper/[lang]).
const SUMMARY_EN_URL = '/whitepaper-short/en'
const SUMMARY_ES_URL = '/whitepaper-short/es'

export default function WhitepaperHubPage() {
  return (
    <div className="rd-page">
      <TopBar />
      <Nav />

      <header className="rd-wp-hero">
        <div className="wrap">
          <span className="rd-eyebrow">Whitepapers · V5.4 · 2026</span>
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
            <h2>Full Whitepaper · V5.4</h2>
            <span className="rd-count">16 sections · ~30 pages</span>
          </div>
          <div className="rd-wp-grid">
            <WhitepaperCard
              variant="full"
              flag="EN"
              ver="FULL · V5.4"
              pages="English"
              title="Whitepaper · English"
              desc="Complete protocol specification: architecture, flash-crash pricing model, 6 Flash Shield products, oracle infrastructure, security audit findings, and full economic model."
              toc="§1 Abstract · §2 Architecture · §3 Pricing · §4 Products · §5 ClaimBonds · §6 Oracle · §7 Security · §16 Roadmap"
              href="/whitepaper/en"
              cta="Read full →"
              source="hosted"
            />
            <WhitepaperCard
              variant="full"
              flag="ES"
              ver="COMPLETO · V5.4"
              pages="Español"
              title="Whitepaper · Español"
              desc="Especificación completa del protocolo: arquitectura, modelo de pricing flash-crash, 6 productos Flash Shield, infraestructura oracle, hallazgos de auditoría y modelo económico íntegro."
              toc="§1 Resumen · §2 Arquitectura · §3 Pricing · §4 Productos · §5 ClaimBonds · §6 Oracle · §7 Seguridad · §16 Roadmap"
              href="/whitepaper/es"
              cta="Leer completo →"
              source="hosted"
            />
          </div>

          <div className="rd-section-head" style={{ marginTop: 64 }}>
            <h2>Executive Summary · short version</h2>
            <span className="rd-count">Quick context · hosted</span>
          </div>
          <div className="rd-wp-grid">
            <WhitepaperCard
              variant="summary"
              flag="EN"
              ver="SUMMARY · LIVE"
              pages="Interactive"
              title="Summary · English"
              desc="A short, interactive brief covering what Lumina is, why parametric speculation for AI agents matters, and how to integrate. Ideal for investors, partners, or quick technical orientation."
              toc="Problem · Solution · Architecture · 6 products at a glance · Tokenomics · Roadmap · Contact"
              href={SUMMARY_EN_URL}
              cta="Read summary →"
              source="hosted"
            />
            <WhitepaperCard
              variant="summary"
              flag="ES"
              ver="RESUMEN · LIVE"
              pages="Interactivo"
              title="Resumen · Español"
              desc="Brief corto e interactivo: qué es Lumina, por qué la especulación paramétrica para agentes IA importa y cómo integrarlo. Ideal para inversores, partners u orientación técnica rápida."
              toc="Problema · Solución · Arquitectura · 6 productos · Tokenomics · Roadmap · Contacto"
              href={SUMMARY_ES_URL}
              cta="Leer resumen →"
              source="hosted"
            />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
