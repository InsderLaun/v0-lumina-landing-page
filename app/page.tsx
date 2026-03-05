"use client"

import { useState, useCallback, type ReactNode } from "react"
import { Web3Provider } from "@/components/lumina/web3-provider"
import { PerspectiveProvider, usePerspective } from "@/components/lumina/perspective-context"
import { Navbar } from "@/components/lumina/navbar"
import { ScrollProgressBar } from "@/components/lumina/scroll-progress"
import { HeroSection } from "@/components/lumina/hero-section"
import { PerspectiveTabs } from "@/components/lumina/perspective-tabs"
import { DualEngineSection } from "@/components/lumina/dual-engine-section"
import { AgentSkillsSection } from "@/components/lumina/agent-skills-section"
import { ProductGrid } from "@/components/lumina/product-grid"
import { ComparisonTable } from "@/components/lumina/comparison-table"
import { CalculatorSection } from "@/components/lumina/calculator-section"
import { HowItWorksSection } from "@/components/lumina/how-it-works-section"
import { DeveloperZone } from "@/components/lumina/developer-zone"
import { ExampleScenario } from "@/components/lumina/example-scenario"
import { ProtocolStatus } from "@/components/lumina/protocol-status"
import { SecuritySection } from "@/components/lumina/security-section"
import { ThreePathsSection } from "@/components/lumina/three-paths-section"
import { FAQSection } from "@/components/lumina/faq-section"
import { OnboardingSection } from "@/components/lumina/onboarding-section"
import { Footer } from "@/components/lumina/footer"
import { BackToTop } from "@/components/lumina/back-to-top"
import { RegisterAgentModal } from "@/components/lumina/register-agent-modal"
import { DepositLPModal } from "@/components/lumina/deposit-lp-modal"
import { AgentRedirectModal } from "@/components/lumina/agent-redirect-modal"
import { LPHeroSection, LPPoolGrid, LPComparisonSection, LPCtaSection } from "@/components/lumina/lp-sections"

/** CSS-only show/hide wrapper — no unmount, no layout shift */
function AgentOnly({ children, section }: { children: ReactNode; section?: string }) {
  const { perspective } = usePerspective()
  const hidden = perspective !== "agent"
  return (
    <div
      className={hidden ? "h-0 overflow-hidden opacity-0 pointer-events-none" : ""}
      aria-hidden={hidden}
      {...(section ? { "data-section": section } : {})}
    >
      {children}
    </div>
  )
}

function LPOnly({ children, section }: { children: ReactNode; section?: string }) {
  const { perspective } = usePerspective()
  const hidden = perspective !== "lp"
  return (
    <div
      className={hidden ? "h-0 overflow-hidden opacity-0 pointer-events-none" : ""}
      aria-hidden={hidden}
      {...(section ? { "data-section": section } : {})}
    >
      {children}
    </div>
  )
}

export default function Page() {
  const [registerOpen, setRegisterOpen] = useState(false)
  const [depositOpen, setDepositOpen] = useState(false)
  const [agentRedirectOpen, setAgentRedirectOpen] = useState(false)

  const handleRegisterAgent = useCallback(() => setRegisterOpen(true), [])
  const handleDepositLP = useCallback(() => setDepositOpen(true), [])

  const handleScrollToCalculator = useCallback(() => {
    const el = document.querySelector("#calculator")
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [])

  return (
    <Web3Provider>
      <PerspectiveProvider>
        <main className="min-h-screen bg-lumina-bg">
          <Navbar
            onRegisterAgent={handleRegisterAgent}
            onDepositLP={handleDepositLP}
          />
          <ScrollProgressBar />
          <div data-section="hero">
            <HeroSection />
          </div>
          <PerspectiveTabs />

          {/* ── Agent-only sections ── */}
          <AgentOnly section="how-it-works">
            <DualEngineSection onRegisterAgent={handleRegisterAgent} />
          </AgentOnly>
          <div data-section="skills">
            <AgentSkillsSection onRegisterAgent={handleRegisterAgent} />
          </div>
          <AgentOnly section="products">
            <ProductGrid onScrollToCalculator={handleScrollToCalculator} />
          </AgentOnly>
          <AgentOnly section="comparison">
            <ComparisonTable />
          </AgentOnly>

          {/* ── LP-only sections ── */}
          <LPOnly>
            <LPHeroSection />
          </LPOnly>
          <LPOnly section="products">
            <LPPoolGrid onScrollToCalculator={handleScrollToCalculator} />
          </LPOnly>

          {/* ── Shared: Calculator (switches content internally) ── */}
          <div id="calculator" data-section="calculator">
            <CalculatorSection />
          </div>

          {/* ── LP-only: Comparison + CTA ── */}
          <LPOnly section="comparison">
            <LPComparisonSection />
          </LPOnly>
          <LPOnly section="cta">
            <LPCtaSection onDepositLP={handleDepositLP} />
          </LPOnly>

          {/* ── Agent-only sections ── */}
          <AgentOnly section="how-it-works">
            <HowItWorksSection />
          </AgentOnly>
          <AgentOnly>
            <DeveloperZone />
          </AgentOnly>
          <AgentOnly>
            <ExampleScenario />
          </AgentOnly>

          {/* ── Shared sections ── */}
          <div id="status">
            <ProtocolStatus />
          </div>
          <SecuritySection />
          <AgentOnly>
            <ThreePathsSection />
          </AgentOnly>
          <FAQSection />
          <OnboardingSection
            onRegisterAgent={handleRegisterAgent}
            onDepositLP={handleDepositLP}
          />
          <Footer />
          <BackToTop />

          {/* ── Modals ── */}
          <RegisterAgentModal
            open={registerOpen}
            onClose={() => setRegisterOpen(false)}
          />
          <DepositLPModal
            open={depositOpen}
            onClose={() => setDepositOpen(false)}
          />
          <AgentRedirectModal
            open={agentRedirectOpen}
            onClose={() => setAgentRedirectOpen(false)}
            onRegisterAgent={handleRegisterAgent}
          />
        </main>
      </PerspectiveProvider>
    </Web3Provider>
  )
}
