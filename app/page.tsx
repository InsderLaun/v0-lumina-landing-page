"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { disconnectWallet, truncateAddress, isDisclaimerAccepted } from '@/lib/wallet'
import { useLuminaWallet } from '@/hooks/use-lumina-wallet'
import { CHAIN } from '@/lib/lumina-config'

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showWhitepaper, setShowWhitepaper] = useState(false)
  const [wpStep, setWpStep] = useState<"lang" | "version">("lang")
  const [wpLang, setWpLang] = useState<"en" | "es">("en")
  const { address: luminaAddress } = useLuminaWallet()
  const [disclaimerOk, setDisclaimerOk] = useState(false)
  useEffect(() => { setDisclaimerOk(isDisclaimerAccepted()) }, [])
  const walletAddress = disclaimerOk ? luminaAddress : null
  const setWalletAddress = (_: string | null) => { /* no-op */ }

  useEffect(() => {
    const handler = () => { setWpStep("lang"); setShowWhitepaper(true); }
    window.addEventListener("open-whitepaper-modal", handler)
    return () => window.removeEventListener("open-whitepaper-modal", handler)
  }, [])

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
      {/* NAVBAR */}
      <Navbar onConnectAgent={() => setShowOnboarding(true)} walletAddress={walletAddress} setWalletAddress={setWalletAddress} />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F] via-[#0D1117] to-[#0A0A0F]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 text-sm mb-8"
          >
            <span className="relative flex h-2.5 w-2.5 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-cyan-400">Built on Base L2</span>
            <span className="text-white/30 mx-1"> · </span>
            <span className="text-purple-400">ClaimBond Model</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">Algorithmic Risk Speculation</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              for Humans &amp; AI Agents
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-center mt-8 mb-12"
          >
            <p className="text-lg sm:text-xl text-white/60 leading-relaxed">
              Bet against market chaos. Every losing bet burns $LUMINA forever.
              <br />
              <span className="text-white/40 text-base">Anyone can play — humans via web app, AI agents via REST API.</span>
            </p>
            <p className="text-sm sm:text-base text-white/70 mt-3 tracking-wide font-medium">
              <span style={{color: '#00D4AA'}}>Parametric triggers</span><span style={{color: '#6B7280'}}> · </span><span style={{color: '#3B82F6'}}>Oracle verified</span><span style={{color: '#6B7280'}}> · </span><span style={{color: '#8B5CF6'}}>Deflationary by design</span><span style={{color: '#6B7280'}}> · </span><span style={{color: '#F59E0B'}}>Just math.</span>
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <a href="#products" className="px-8 py-3 rounded-full font-semibold transition-all bg-cyan-500 hover:bg-cyan-400 text-black">
              I want to speculate
            </a>
            <a href="#claimbonds" className="px-8 py-3 rounded-full border border-purple-500/40 text-purple-400 hover:text-purple-300 hover:border-purple-500/60 transition-all">
              I want discounted bonds
            </a>
            <a href="#tokenomics" className="px-8 py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all">
              View Tokenomics
            </a>
          </motion.div>

          {/* 3 Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base font-medium mt-[60px]"
          >
            <div className="flex flex-col items-center px-6 py-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-xs text-white/40 uppercase tracking-wider mb-1">Total Burned</span>
              <span className="text-xl font-bold text-cyan-400">0 LUMINA</span>
            </div>
            <div className="flex flex-col items-center px-6 py-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-xs text-white/40 uppercase tracking-wider mb-1">Active Bets</span>
              <span className="text-xl font-bold text-purple-400">0</span>
            </div>
            <div className="flex flex-col items-center px-6 py-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-xs text-white/40 uppercase tracking-wider mb-1">LUMINA Price</span>
              <span className="text-xl font-bold text-cyan-400">$0.036</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How ClaimBond Works
          </h2>
          <p className="text-white/50 text-center mb-16 max-w-xl mx-auto">
            Four steps from bet to burn. No middlemen. No disputes.
          </p>

          {/* Timeline connector - horizontal on desktop */}
          <div className="hidden md:flex items-center justify-center mb-8 max-w-4xl mx-auto px-16">
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400/30"></span>
              <div className="w-4 h-4 rounded-full relative bg-cyan-500" />
            </div>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-500/30" />
            <div className="w-4 h-4 rounded-full bg-cyan-500" />
            <div className="flex-1 h-0.5 bg-gradient-to-r from-cyan-500/30 to-cyan-500" />
            <div className="w-4 h-4 rounded-full bg-cyan-500" />
            <div className="flex-1 h-0.5 bg-gradient-to-r from-cyan-500/30 to-purple-500" />
            <div className="w-4 h-4 rounded-full bg-purple-500" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <HowCard step="01" icon="🎯" title="Choose Your Bet" description="Pick a product (Flash BTC 1h, Micro Depeg, Rate Shock, etc.) and select your coverage amount. Each product has a specific trigger condition and multiplier." note="9 products covering BTC, ETH, USDT, USDC rates." accent="cyan" />
            <HowCard step="02" icon="🔥" title="Premium Burns $LUMINA" description="100% of your premium is used to buy $LUMINA on the open market and burn it forever. Nothing goes to the team. Every cent destroys tokens permanently." note="Deflationary pressure on every transaction." accent="cyan" />
            <HowCard step="03" icon="🔮" title="Oracle Checks" description="Chainlink oracles monitor the parametric condition in real-time. No human judgment, no committees, no disputes. The trigger either happens or it doesn't. Pure math." note="Trustless verification, same-block resolution." accent="cyan" />
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">✅</span>
                  <span className="text-sm font-mono text-green-500">04a</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Trigger</h3>
                <p className="text-white/50 text-sm leading-relaxed">Bet lost. The $LUMINA burn is permanent. Supply shrinks forever.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🎉</span>
                  <span className="text-sm font-mono text-purple-500">04b</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Trigger!</h3>
                <p className="text-white/50 text-sm leading-relaxed">ClaimBond token (ERC-1155) issued. 24-month maturity. Partially sellable on secondary market.</p>
              </div>
            </div>
          </div>

          {/* Closing phrase */}
          <div className="mt-12 max-w-3xl mx-auto bg-white/[0.02] border border-white/10 rounded-xl p-6">
            <p className="text-lg text-white/70 italic text-center">
              Every bet that loses makes $LUMINA scarcer. Every bet that wins creates a ClaimBond. The protocol is deflationary by default.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <ProductsSection />

      {/* PRICING TABLE */}
      <PricingSection />

      {/* $LUMINA TOKEN SECTION */}
      <TokenomicsSection />

      {/* AGENT SKILLS (shared) */}
      <AgentSkillsSection onStartSetup={() => setShowOnboarding(true)} />

      {/* COMPARISON TABLE */}
      <ComparisonSection />

      {/* SECURITY & AUDITS */}
      <SecuritySection />

      {/* ROADMAP */}
      <section className="py-20 px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-16">Roadmap</h2>

        <div className="hidden md:block relative w-full max-w-5xl mx-auto mb-12">
          <div className="absolute top-1/2 left-[12.5%] right-[12.5%] h-[2px] -translate-y-1/2" style={{background: 'linear-gradient(to right, #10B981, #00D4AA, #3B82F6, #8B5CF6)'}} />
          <div className="relative flex justify-around">
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-[#10B981] border-4 border-[#0A0A0F] shadow-[0_0_12px_rgba(16,185,129,0.5)] z-10" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-[#00D4AA] border-4 border-[#0A0A0F] shadow-[0_0_12px_rgba(0,212,170,0.5)] z-10" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-[#3B82F6] border-4 border-[#0A0A0F] shadow-[0_0_12px_rgba(59,130,246,0.5)] z-10" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-[#8B5CF6] border-4 border-[#0A0A0F] shadow-[0_0_12px_rgba(139,92,246,0.5)] z-10" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
          <div className="bg-[#1F2937] border border-[#1F2937] border-t-[3px] border-t-[#10B981] rounded-xl p-5 hover:border-[#10B98140] transition-all">
            <p className="text-white font-bold text-lg">Phase 1</p>
            <p className="text-[#10B981] text-xs font-semibold uppercase tracking-widest mb-3">Foundation (Current)</p>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">Smart contracts deployed on Base L2. 9 ClaimBond products live. Landing page redesign. Oracle integration with Chainlink. Burn engine architecture.</p>
          </div>
          <div className="bg-[#1F2937] border border-[#1F2937] border-t-[3px] border-t-[#00D4AA] rounded-xl p-5 hover:border-[#00D4AA40] transition-all">
            <p className="text-white font-bold text-lg">Phase 2</p>
            <p className="text-[#00D4AA] text-xs font-semibold uppercase tracking-widest mb-3">Token Launch</p>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">LBP on Fjord Foundry. Uniswap V3 LUMINA/USDC pool. Burn engine activated. Real-time burn dashboard. CoinGecko listing.</p>
          </div>
          <div className="bg-[#1F2937] border border-[#1F2937] border-t-[3px] border-t-[#3B82F6] rounded-xl p-5 hover:border-[#3B82F640] transition-all">
            <p className="text-white font-bold text-lg">Phase 3</p>
            <p className="text-[#3B82F6] text-xs font-semibold uppercase tracking-widest mb-3">Growth</p>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">500+ policies per day target. Secondary bond marketplace for ClaimBond tokens (ERC-1155). Agent framework integrations. Automated AI agent strategies.</p>
          </div>
          <div className="bg-[#1F2937] border border-[#1F2937] border-t-[3px] border-t-[#8B5CF6] rounded-xl p-5 hover:border-[#8B5CF640] transition-all">
            <p className="text-white font-bold text-lg">Phase 4</p>
            <p className="text-[#8B5CF6] text-xs font-semibold uppercase tracking-widest mb-3">Maturity</p>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">ERC-1155 epoch system for ClaimBonds. Cross-chain deployment (Arbitrum, Optimism). DAO governance. Institutional integrations.</p>
          </div>
        </div>
      </section>

      {/* FAQ + CONTACT */}
      <FAQSection />

      {/* FOOTER */}
      <footer className="bg-[#0A0A0F] border-t border-white/5 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 items-start mb-12">
            <div className="max-w-xs">
              <h4 className="text-lg font-bold">
                <span className="text-cyan-400">LUMINA</span>
                <span className="text-white/20"> · </span>
                <span className="text-purple-400">ClaimBond</span>
              </h4>
              <p className="text-sm text-white/50 mt-2">Parametric Risk Speculation for Humans &amp; AI Agents</p>
              <p className="text-xs text-white/30 mt-1">Built on Base L2 · Deflationary by design</p>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-white/60 uppercase mb-3">Products</h5>
              <div className="space-y-2">
                <a href="#products" className="block text-sm text-white/40 hover:text-white transition-colors">Flash BTC (1h/4h/24h/48h)</a>
                <a href="#products" className="block text-sm text-white/40 hover:text-white transition-colors">Flash ETH (1h/24h/48h)</a>
                <a href="#products" className="block text-sm text-white/40 hover:text-white transition-colors">Micro Depeg USDT</a>
                <a href="#products" className="block text-sm text-white/40 hover:text-white transition-colors">Rate Shock</a>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-white/60 uppercase mb-3">Resources</h5>
              <div className="space-y-2">
                <a href="/LUMINA-SKILL.txt" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/40 hover:text-white transition-colors">Skill File</a>
                <a href="https://github.com/org-lumina/LUMINA-PROTOCOL" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/40 hover:text-white transition-colors">Smart Contracts</a>
                <a href="https://github.com/org-lumina/LUMINA-PROTOCOL" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/40 hover:text-white transition-colors">Documentation</a>
                <a href="https://base.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/40 hover:text-white transition-colors">Base L2</a>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-white/60 uppercase mb-3">Contact</h5>
              <div className="space-y-2">
                <a href="mailto:labs@lumina-org.com" className="block text-sm text-white/40 hover:text-white transition-colors">Sales: labs@lumina-org.com</a>
                <a href="mailto:support@lumina-org.com" className="block text-sm text-white/40 hover:text-white transition-colors">Support: support@lumina-org.com</a>
                <a href="#" className="block text-sm text-white/40 hover:text-white transition-colors">Twitter/X</a>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 flex-wrap mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Burn Engine Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-medium">
              ERC-1155 ClaimBonds
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-medium">
              82% Bond Reserve Locked
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-medium">
              Chainlink Oracles
            </span>
          </div>
          <div className="border-t border-white/5 pt-8">
            <p className="text-xs text-white/20 text-center">
              &copy; 2026 Lumina Protocol. All rights reserved. &middot; Burn Ratio: 1.50 &middot; 9 Products &middot; Built on Base L2
            </p>
          </div>
        </div>
      </footer>

      {/* Whitepaper Modal */}
      <AnimatePresence>
        {showWhitepaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowWhitepaper(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111827] rounded-2xl max-w-lg w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowWhitepaper(false)} className="absolute top-4 right-4 text-[#6B7280] hover:text-white text-xl">&times;</button>

              {wpStep === "lang" ? (
                <>
                  <h3 className="text-xl font-bold text-white text-center mb-2">Whitepaper</h3>
                  <p className="text-[#9CA3AF] text-sm text-center mb-8">Choose your language / Elegi tu idioma</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => { setWpLang("en"); setWpStep("version"); }} className="bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-6 text-center transition-all">
                      <div className="text-2xl mb-2">EN</div>
                      <div className="text-white font-medium">English</div>
                    </button>
                    <button onClick={() => { setWpLang("es"); setWpStep("version"); }} className="bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-6 text-center transition-all">
                      <div className="text-2xl mb-2">ES</div>
                      <div className="text-white font-medium">Espanol</div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => setWpStep("lang")} className="text-[#9CA3AF] hover:text-white text-sm mb-4 flex items-center gap-1">
                    &larr; Back
                  </button>
                  <h3 className="text-xl font-bold text-white text-center mb-6">
                    Whitepaper &mdash; {wpLang === "en" ? "English" : "Espanol"}
                  </h3>
                  <div className="space-y-4">
                    <a href={`/LUMINA-WHITEPAPER-${wpLang.toUpperCase()}-V3.html`} className="block bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-6 transition-all">
                      <div className="font-semibold text-white mb-1">{wpLang === "en" ? "Full Whitepaper" : "Whitepaper Completo"}</div>
                      <div className="text-[#9CA3AF] text-sm mb-3">{wpLang === "en" ? "Complete technical document" : "Documento tecnico completo"}</div>
                      <span className="text-[#00D4AA] text-sm font-medium">{wpLang === "en" ? "Read Full Whitepaper \u2192" : "Leer Whitepaper Completo \u2192"}</span>
                    </a>
                    <a href={`/whitepaper/${wpLang}`} className="block bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-6 transition-all">
                      <div className="font-semibold text-white mb-1">{wpLang === "en" ? "Executive Summary" : "Resumen Ejecutivo"}</div>
                      <div className="text-[#9CA3AF] text-sm mb-3">{wpLang === "en" ? "Quick visual overview" : "Resumen visual rapido"}</div>
                      <span className="text-[#00D4AA] text-sm font-medium">{wpLang === "en" ? "View Interactive Summary \u2192" : "Ver Resumen Interactivo \u2192"}</span>
                    </a>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowOnboarding(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowOnboarding(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white/80 text-xl transition-colors"
              >
                &times;
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Connect Your AI Agent to Lumina</h2>
                <p className="text-white/50 text-sm">Choose your path &mdash; from zero to betting in 10 minutes</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/[0.03] border border-cyan-500/20 rounded-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-3xl mb-3">📖</div>
                    <h3 className="text-lg font-bold text-cyan-300 mb-2">For Humans</h3>
                    <p className="text-sm text-white/70">Step-by-step guide to set up your wallet, get your API Key, and start placing bets.</p>
                  </div>
                  <div className="space-y-2 pt-6">
                    <a href="/tutorial.html" className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all">Read the Guide &rarr;</a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/[0.03] border border-purple-500/20 rounded-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-3xl mb-3">🤖</div>
                    <h3 className="text-lg font-bold text-purple-300 mb-2">For Your AI Agent</h3>
                    <p className="text-sm text-white/70">Give this file to your ChatGPT, Claude, or custom agent. It contains all endpoints, products, and instructions to operate Lumina autonomously.</p>
                  </div>
                  <div className="space-y-2 pt-6">
                    <a href="/LUMINA-SKILL.txt" download className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all">Download SKILL File &darr;</a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/[0.03] border border-green-500/20 rounded-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-3xl mb-3">&#9889;</div>
                    <h3 className="text-lg font-bold text-green-300 mb-2">Auto-Setup (Claude Code)</h3>
                    <p className="text-sm text-white/70">Copy-paste a prompt into Claude Code to auto-setup your API Key and place a test bet.</p>
                  </div>
                  <div className="space-y-2 pt-6">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("Setup prompt for Lumina ClaimBond - see tutorial");
                        alert("Prompt copied!");
                      }}
                      className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all cursor-pointer"
                    >
                      Copy Setup Prompt 📋
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/30">
                  <span>Chain: {CHAIN.name} ({CHAIN.id})</span>
                  <a href="mailto:support@lumina-org.com" className="text-cyan-400/50 hover:text-cyan-400">support@lumina-org.com</a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  PRODUCTS SECTION                                         */
/* ═══════════════════════════════════════════════════════════ */

const PRODUCTS = [
  { key: "flash-btc-1h", emoji: "\u26A1", label: "Flash BTC 1h", trigger: "BTC drops 5% in 1 hour", probability: "0.20%", multiplier: "333x", tier: 1, asset: "BTC", duration: "1 hour" },
  { key: "flash-btc-4h", emoji: "\u26A1", label: "Flash BTC 4h", trigger: "BTC drops 8% in 4 hours", probability: "0.35%", multiplier: "190x", tier: 1, asset: "BTC", duration: "4 hours" },
  { key: "flash-btc-24h", emoji: "\u26A1", label: "Flash BTC 24h", trigger: "BTC drops 10% in 24 hours", probability: "1.50%", multiplier: "44x", tier: 1, asset: "BTC", duration: "24 hours" },
  { key: "flash-btc-48h", emoji: "\u26A1", label: "Flash BTC 48h", trigger: "BTC drops 15% in 48 hours", probability: "0.80%", multiplier: "83x", tier: 1, asset: "BTC", duration: "48 hours" },
  { key: "flash-eth-1h", emoji: "\u26A1", label: "Flash ETH 1h", trigger: "ETH drops 7% in 1 hour", probability: "0.25%", multiplier: "266x", tier: 1, asset: "ETH", duration: "1 hour" },
  { key: "flash-eth-24h", emoji: "\u26A1", label: "Flash ETH 24h", trigger: "ETH drops 12% in 24 hours", probability: "2.00%", multiplier: "33x", tier: 1, asset: "ETH", duration: "24 hours" },
  { key: "flash-eth-48h", emoji: "\u26A1", label: "Flash ETH 48h", trigger: "ETH drops 18% in 48 hours", probability: "0.90%", multiplier: "74x", tier: 1, asset: "ETH", duration: "48 hours" },
  { key: "micro-depeg", emoji: "\uD83D\uDD17", label: "Micro Depeg USDT", trigger: "USDT drops below $0.995 for 7 days", probability: "3.50%", multiplier: "19x", tier: 2, asset: "USDT", duration: "7 days" },
  { key: "rate-shock", emoji: "\uD83D\uDCC8", label: "Rate Shock", trigger: "Aave USDC borrow rate exceeds 10% for 7 days", probability: "4.00%", multiplier: "17x", tier: 2, asset: "USDC", duration: "7 days" },
]

function ProductsSection() {
  const [active, setActive] = useState(0)
  const product = PRODUCTS[active]

  // Calculate example pricing based on $1K coverage
  const probNum = parseFloat(product.probability) / 100
  const exampleCoverage = 1000
  const examplePremium = exampleCoverage * 0.80 * probNum * 1.5
  const examplePayout = exampleCoverage * 0.80

  return (
    <section className="py-24 px-4">
      <div id="products" className="scroll-mt-20" />
      <div className="max-w-5xl mx-auto rounded-2xl bg-white/[0.02] border border-cyan-500/20 shadow-[0_-2px_20px_rgba(0,212,255,0.05)] overflow-hidden">
        <div className="h-[3px] w-full bg-gradient-to-r from-cyan-500 to-transparent" />
        <div className="p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-cyan-400">
          ClaimBond Products
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          Nine parametric products. Each with a specific trigger, probability, and multiplier. Bet against chaos.
        </p>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {PRODUCTS.map((p, i) => (
            <button
              key={p.key}
              onClick={() => setActive(i)}
              className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl text-sm font-medium transition-all border ${
                active === i
                  ? "text-cyan-400 border-cyan-500/40 bg-cyan-500/10"
                  : "text-white/40 border-white/5 hover:text-white/60 hover:border-white/20"
              }`}
            >
              <span className="text-lg">{p.emoji}</span>
              <span className="text-xs text-center leading-tight">{p.label}</span>
              <span className={`text-xs font-bold ${active === i ? "text-cyan-400" : "text-white/30"}`}>{p.multiplier}</span>
            </button>
          ))}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={product.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl bg-white/[0.02] border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 p-6 md:p-8"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">
                  <span className="mr-2">{product.emoji}</span>
                  {product.label}
                </h3>
                <p className="text-white/40 text-sm">{product.asset} &middot; {product.duration}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {product.multiplier}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.tier === 1 ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
                  Tier {product.tier}
                </span>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-3 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-white/5">
                <span className="text-xs uppercase tracking-wider text-white/30 sm:w-40 shrink-0 font-medium">Trigger Event</span>
                <span className="text-[15px] text-white/70 leading-relaxed">{product.trigger}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-white/5">
                <span className="text-xs uppercase tracking-wider text-white/30 sm:w-40 shrink-0 font-medium">Probability</span>
                <span className="text-[15px] text-white/70 leading-relaxed">{product.probability}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-white/5">
                <span className="text-xs uppercase tracking-wider text-white/30 sm:w-40 shrink-0 font-medium">Multiplier</span>
                <span className="text-[15px] text-cyan-400 font-bold">{product.multiplier}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2">
                <span className="text-xs uppercase tracking-wider text-white/30 sm:w-40 shrink-0 font-medium">Duration</span>
                <span className="text-[15px] text-white/70 leading-relaxed">{product.duration}</span>
              </div>
            </div>

            {/* Example */}
            <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/10 p-4 mb-6">
              <span className="text-xs uppercase tracking-wider text-cyan-400/60 font-medium block mb-2">Example ($1K Coverage)</span>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-white/30 mb-1">Premium</div>
                  <div className="text-lg font-bold text-white">${examplePremium.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-white/30 mb-1">If Triggered</div>
                  <div className="text-lg font-bold text-cyan-400">${examplePayout.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-white/30 mb-1">Return</div>
                  <div className="text-lg font-bold text-purple-400">{product.multiplier}</div>
                </div>
              </div>
            </div>

            {/* Formula */}
            <div className="text-center">
              <p className="text-xs text-white/30">
                Formula: Premium = Coverage &times; 80% &times; P(trigger) &times; 1.5x
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  PRICING SECTION                                          */
/* ═══════════════════════════════════════════════════════════ */

function PricingSection() {
  const [selectedProduct, setSelectedProduct] = useState(0)
  const product = PRODUCTS[selectedProduct]
  const probNum = parseFloat(product.probability) / 100

  const coverages = [100, 500, 1000, 5000, 10000]

  return (
    <section className="py-24 px-4">
      <div id="pricing" className="scroll-mt-20" />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Fixed Pricing
        </h2>
        <p className="text-white/50 text-center mb-4 max-w-xl mx-auto">
          Transparent, deterministic pricing. No hidden fees, no dynamic adjustments.
        </p>
        <p className="text-center mb-12">
          <code className="text-sm text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20">
            Premium = Coverage &times; 80% &times; P(trigger) &times; 1.5x
          </code>
        </p>

        <div className="rounded-2xl bg-white/[0.02] border border-cyan-500/20 p-6 md:p-8">
          {/* Product selector */}
          <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
            {PRODUCTS.map((p, i) => (
              <button
                key={p.key}
                onClick={() => setSelectedProduct(i)}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  selectedProduct === i
                    ? "text-cyan-400 border-cyan-500/40 bg-cyan-500/10"
                    : "text-white/40 border-white/5 hover:text-white/60"
                }`}
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>

          {/* Product info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold">{product.emoji} {product.label}</h3>
              <p className="text-sm text-white/40">{product.trigger}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/50">P(trigger): <span className="text-cyan-400 font-bold">{product.probability}</span></span>
              <span className="text-sm text-white/50">Multiplier: <span className="text-purple-400 font-bold">{product.multiplier}</span></span>
            </div>
          </div>

          {/* Pricing table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 uppercase tracking-wider font-medium py-3 px-4">Coverage</th>
                  <th className="text-left text-xs text-white/40 uppercase tracking-wider font-medium py-3 px-4">Premium</th>
                  <th className="text-left text-xs text-white/40 uppercase tracking-wider font-medium py-3 px-4">Bond Payout (if triggered)</th>
                  <th className="text-left text-xs text-white/40 uppercase tracking-wider font-medium py-3 px-4">Return</th>
                </tr>
              </thead>
              <tbody>
                {coverages.map((cov) => {
                  const premium = cov * 0.80 * probNum * 1.5
                  const payout = cov * 0.80
                  const ret = premium > 0 ? (payout / premium).toFixed(0) : "0"
                  return (
                    <tr key={cov} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-4 text-white/70 font-medium">${cov.toLocaleString()}</td>
                      <td className="py-3 px-4 text-white/80">${premium.toFixed(2)}</td>
                      <td className="py-3 px-4 text-cyan-400 font-semibold">${payout.toLocaleString()}</td>
                      <td className="py-3 px-4 text-purple-400 font-bold">{ret}x</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-white/30 mt-4 text-center">
            100% of every premium buys and burns $LUMINA. Bond payouts are ClaimBond tokens (ERC-1155) with 24-month maturity.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  $LUMINA TOKEN SECTION                                    */
/* ═══════════════════════════════════════════════════════════ */

function TokenomicsSection() {
  const allocations = [
    { label: "Bond Reserve", pct: 82, color: "bg-cyan-500", desc: "Locked, immutable. Backs all ClaimBond payouts." },
    { label: "Founder", pct: 10, color: "bg-purple-500", desc: "4-year vesting, 1-year cliff." },
    { label: "LBP (Fjord)", pct: 5, color: "bg-green-500", desc: "Liquidity Bootstrapping Pool for fair price discovery." },
    { label: "Treasury", pct: 3, color: "bg-amber-500", desc: "Protocol development, audits, operations." },
  ]

  return (
    <section className="py-24 px-4">
      <div id="tokenomics" className="scroll-mt-20" />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">$LUMINA</span> Token
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          Deflationary by design. Every premium buys and burns $LUMINA forever.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Tokenomics Allocation */}
          <div className="rounded-2xl bg-white/[0.02] border border-cyan-500/20 p-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-6">Token Allocation</h3>
            <div className="space-y-4">
              {allocations.map((a) => (
                <div key={a.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/70 font-medium">{a.label}</span>
                    <span className="text-sm text-white/50 font-bold">{a.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${a.color} rounded-full`} style={{ width: `${a.pct}%` }} />
                  </div>
                  <p className="text-xs text-white/30 mt-1">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Burn Mechanics */}
          <div className="rounded-2xl bg-white/[0.02] border border-purple-500/20 p-6">
            <h3 className="text-lg font-bold text-purple-400 mb-6">Burn Mechanics</h3>
            <div className="space-y-6">
              <div className="rounded-xl bg-purple-500/5 border border-purple-500/10 p-4">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-2">How it works</div>
                <p className="text-sm text-white/60 leading-relaxed">
                  Every premium paid by a bettor is used to buy $LUMINA on Uniswap V3 and send it to the burn address (0x000...dead). 100% of the premium burns. Nothing goes to treasury. The most aggressive deflationary mechanism in DeFi.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 text-center">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Burn / Emission Ratio</div>
                  <div className="text-3xl font-bold text-cyan-400">1.50</div>
                  <p className="text-xs text-white/30 mt-1">Burns exceed emissions</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 text-center">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Premium Burn Rate</div>
                  <div className="text-3xl font-bold text-purple-400">100%</div>
                  <p className="text-xs text-white/30 mt-1">Of every premium burned</p>
                </div>
              </div>

              <div className="text-xs text-white/30 leading-relaxed">
                The more bets placed, the more $LUMINA is burned. Losing bets = permanent burns. The protocol becomes more deflationary as usage grows.
              </div>
            </div>
          </div>
        </div>

        {/* ClaimBond Explainer */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 md:p-8">
          <h3 className="text-lg font-bold text-white mb-6">What is a ClaimBond?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-sm mt-1">&#9679;</span>
                <div>
                  <p className="text-sm text-white/70 font-medium">ERC-1155 Tokens</p>
                  <p className="text-xs text-white/40">Each ClaimBond is an ERC-1155 token grouped by maturity month — fractional, sellable, holdable.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-sm mt-1">&#9679;</span>
                <div>
                  <p className="text-sm text-white/70 font-medium">24-Month Maturity</p>
                  <p className="text-xs text-white/40">Bonds mature over 24 months, releasing principal linearly. This protects the reserve from bank runs.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-sm mt-1">&#9679;</span>
                <div>
                  <p className="text-sm text-white/70 font-medium">Fungible by Month</p>
                  <p className="text-xs text-white/40">All bonds issued in the same month share the same token ID. This enables liquid secondary markets.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-sm mt-1">&#9679;</span>
                <div>
                  <p className="text-sm text-white/70 font-medium">Partially Sellable</p>
                  <p className="text-xs text-white/40">Don&apos;t want to wait 24 months? Sell your ClaimBond on the secondary marketplace at a discount.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5">
              <h4 className="text-sm font-bold text-white mb-4">Bond Lifecycle</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">1</div>
                  <p className="text-sm text-white/60">Trigger event occurs &rarr; Oracle verifies</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">2</div>
                  <p className="text-sm text-white/60">ClaimBond tokens minted to winner&apos;s wallet</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">3</div>
                  <p className="text-sm text-white/60">Linear vesting: ~4.17% released per month</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">4</div>
                  <p className="text-sm text-white/60">Claim matured USDC or sell bond on market</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  AGENT SKILLS SECTION                                     */
/* ═══════════════════════════════════════════════════════════ */

function AgentSkillsSection({ onStartSetup }: { onStartSetup: () => void }) {
  return (
    <section className="py-24 px-4">
      <div id="agent-skills" className="scroll-mt-20" />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Connect Your Agent
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          Lumina publishes a machine-readable Skill file. Give it to your agent and it knows what to do.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-cyan-500/5 border-cyan-500/20 border rounded-xl p-6 text-center">
            <div className="w-9 h-9 rounded-full bg-cyan-500 text-[#0a0a1a] flex items-center justify-center font-bold mx-auto mb-3">1</div>
            <h4 className="text-cyan-400 font-semibold mb-2">Get your API Key</h4>
            <p className="text-white/50 text-sm">Connect your wallet and generate an API key. This is your agent&apos;s authorization to place bets.</p>
          </div>
          <div className="bg-cyan-500/5 border-cyan-500/20 border rounded-xl p-6 text-center">
            <div className="w-9 h-9 rounded-full bg-cyan-500 text-[#0a0a1a] flex items-center justify-center font-bold mx-auto mb-3">2</div>
            <h4 className="text-cyan-400 font-semibold mb-2">Give the SKILL file</h4>
            <p className="text-white/50 text-sm">Download the SKILL file and paste it into your AI agent (ChatGPT, Claude, or custom).</p>
          </div>
          <div className="bg-cyan-500/5 border-cyan-500/20 border rounded-xl p-6 text-center">
            <div className="w-9 h-9 rounded-full bg-cyan-500 text-[#0a0a1a] flex items-center justify-center font-bold mx-auto mb-3">3</div>
            <h4 className="text-cyan-400 font-semibold mb-2">Your agent places bets</h4>
            <p className="text-white/50 text-sm">Tell your agent: &quot;Buy Flash BTC 1h for $1K coverage.&quot; It handles everything autonomously.</p>
          </div>
        </div>

        <div className="text-center mb-12">
          <button onClick={onStartSetup} className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90 transition-opacity">
            Start Setup &rarr;
          </button>
        </div>

        {/* What the Skill Contains */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 sm:p-8 mb-6">
          <p className="text-sm text-white/60 mb-4">The Skill file contains everything your agent needs:</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              "All 9 ClaimBond products with pricing formulas",
              "API endpoints and payloads for every operation",
              "Smart contract ABIs and addresses",
              "Decision framework for bet placement",
              "Error handling and retry strategies",
              "ClaimBond maturity and redemption logic",
              "Burn mechanics and token integration",
              "Risk scenarios and probability data",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 py-1">
                <span className="text-cyan-400 text-sm mt-0.5">&#10003;</span>
                <span className="text-sm text-white/60">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <p className="text-white/50 text-sm mb-6">
            Your agent reads the Skill once and can autonomously manage bets and ClaimBonds for your entire portfolio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartSetup}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all bg-cyan-500 text-black hover:bg-cyan-400"
            >
              Getting Started &rarr;
            </button>
            <a
              href="/LUMINA-SKILL.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
            >
              Read the Full Skill &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  COMPARISON TABLE                                         */
/* ═══════════════════════════════════════════════════════════ */

const COMPARISON_ROWS: { feature: string; lumina: string; traditional: string }[] = [
  { feature: "Operator", lumina: "AI Agent (M2M)", traditional: "Human" },
  { feature: "Resolution", lumina: "Automatic (1 transaction)", traditional: "Jury vote or committee (up to 35 days)" },
  { feature: "Trigger", lumina: "Parametric (trustless math)", traditional: "Subjective (human judgment)" },
  { feature: "Settlement", lumina: "ClaimBond tokens (24mo maturity, fractional)", traditional: "Days/weeks" },
  { feature: "Burn Mechanism", lumina: "100% of premium burned", traditional: "None" },
  { feature: "Chain", lumina: "Base L2 (low fees)", traditional: "Ethereum L1 / Multi-chain" },
  { feature: "Agent-native", lumina: "\u2705 Built for M2M", traditional: "\u274C Human UI only" },
  { feature: "Token Deflationary", lumina: "\u2705 Burn ratio 1.50", traditional: "\u274C Inflationary governance tokens" },
  { feature: "Oracle", lumina: "Chainlink + EIP-712", traditional: "Proprietary or Chainlink" },
]

function ComparisonSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          How Lumina Compares
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          The first risk speculation protocol built for humans and AI agents. Anyone can speculate — via web app or REST API.
        </p>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto border border-cyan-500/30 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs text-white/40 uppercase tracking-wider font-medium py-3 px-4 w-[180px]">Feature</th>
                <th className="text-left text-xs uppercase tracking-wider font-medium py-3 px-4 bg-cyan-500/[0.03] border-t-cyan-500 border-t-2 border-l border-r border-cyan-500/20 text-cyan-400">Lumina ClaimBond</th>
                <th className="text-left text-xs text-white/40 uppercase tracking-wider font-medium py-3 px-4 bg-white/[0.01]">Traditional Web3 Insurance</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-white/5">
                  <td className="py-3 px-4 text-white/50 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 bg-cyan-500/[0.03] border-l border-r border-cyan-500/20 text-white/80 font-medium">
                    {row.lumina.startsWith("\u2705") ? <><span className="text-cyan-400">{"\u2705"}</span>{row.lumina.slice(1)}</> : row.lumina}
                  </td>
                  <td className="py-3 px-4 text-white/40 bg-white/[0.01]">
                    {row.traditional.startsWith("\u274C") ? <><span className="text-white/30">{"\u274C"}</span>{row.traditional.slice(1)}</> : row.traditional}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {[
            { name: "Lumina ClaimBond", isHighlight: true, getData: (r: typeof COMPARISON_ROWS[0]) => r.lumina },
            { name: "Traditional Web3 Insurance", isHighlight: false, getData: (r: typeof COMPARISON_ROWS[0]) => r.traditional },
          ].map((proto) => (
            <div key={proto.name} className={`rounded-xl border p-5 ${proto.isHighlight ? "border-t-cyan-500 border-t-2 bg-cyan-500/[0.03] border-l border-r border-cyan-500/20" : "border-white/5 bg-white/[0.01]"}`}>
              <h4 className={`text-sm font-bold mb-3 ${proto.isHighlight ? "text-cyan-400" : "text-white/50"}`}>{proto.name}</h4>
              <div className="space-y-2">
                {COMPARISON_ROWS.map((row) => {
                  const val = proto.getData(row)
                  return (
                    <div key={row.feature} className="flex justify-between text-xs">
                      <span className="text-white/40">{row.feature}</span>
                      <span className={`text-right ${proto.isHighlight ? "text-white/80 font-medium" : "text-white/40"}`}>{val}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  SECURITY & AUDITS                                        */
/* ═══════════════════════════════════════════════════════════ */

function SecuritySection() {
  const phases = [
    { title: "Phase 1: Core", desc: "BondRouter + ClaimBondManager", rounds: "12+ audit rounds", badge: "0C / 0H / 0M" },
    { title: "Phase 2: Products", desc: "9 ClaimBond products + BurnEngine", rounds: "3 dual audit rounds", badge: "0C / 0H / 0M / 0L" },
    { title: "Phase 3: Oracles", desc: "LuminaOracle + ChainlinkVerifier", rounds: "2 dual audit rounds", badge: "0C / 0H / 0M / 0L" },
  ]

  const protections = [
    "EIP-712 signed price proofs (anti flash-crash)",
    "L2 Sequencer uptime check with 1h grace period",
    "Circuit breakers on extreme volatility",
    "Parametric triggers verified by Chainlink oracles",
    "24-month ClaimBond maturity (anti bank-run)",
    "82% Bond Reserve locked and immutable",
    "100% premium burn via Uniswap V3 buyback",
    "ERC-1155 fungible bonds by epoch month",
  ]

  return (
    <section className="py-24 px-4">
      <div id="security" className="scroll-mt-20" />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Security
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          Battle-tested contracts. Multiple audit rounds. Defense in depth.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {phases.map((p) => (
            <div key={p.title} className="bg-white/[0.03] border border-cyan-500/20 rounded-xl p-6">
              <h4 className="text-sm font-bold text-white mb-2">{p.title}</h4>
              <p className="text-xs text-white/50 mb-2">{p.desc}</p>
              <p className="text-xs text-white/40 mb-3">{p.rounds}</p>
              <span className="text-sm font-bold text-green-400">{p.badge}</span>
            </div>
          ))}
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 mb-8">
          <div className="grid sm:grid-cols-2 gap-2">
            {protections.map((item) => (
              <div key={item} className="flex items-start gap-2 py-1">
                <span className="text-cyan-400 text-sm mt-0.5">&#10003;</span>
                <span className="text-sm text-white/60">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://github.com/org-lumina/LUMINA-PROTOCOL"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
          >
            View Contracts on GitHub &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  FAQ + CONTACT                                            */
/* ═══════════════════════════════════════════════════════════ */

const FAQ_ITEMS = [
  { q: "What is a ClaimBond?", a: "A ClaimBond is an ERC-1155 token issued when your bet's trigger condition is met. It represents your right to a payout, but with a 24-month linear maturity schedule. Each month, ~4.17% of the bond value becomes claimable. This maturity period protects the protocol's bond reserve from bank runs and ensures long-term solvency." },
  { q: "Why 24 months maturity?", a: "The 24-month maturity protects the bond reserve (82% of all $LUMINA) from sudden drainage. If all payouts were instant, a cascade of triggers could bankrupt the reserve. Linear vesting ensures the protocol can always honor its obligations. If you need liquidity sooner, you can sell your ClaimBond on the secondary marketplace at a discount." },
  { q: "What happens to my premium?", a: "100% of your premium is used to buy $LUMINA on Uniswap V3 and burn it permanently (sent to 0x000...dead). Nothing goes to the team. Nothing goes to operations. Every cent destroys tokens permanently, whether you win or lose." },
  { q: "Can I sell my ClaimBond?", a: "Yes. ClaimBonds are ERC-1155 tokens, fully transferable and tradeable. Since all bonds issued in the same month share the same token ID, they are fungible within their epoch. This enables liquid secondary markets where you can sell your bond at a discount rather than waiting for full maturity." },
  { q: "What is the burn/emission ratio?", a: "The burn/emission ratio is 1.50, meaning 50% more $LUMINA is burned than emitted. For every 1 token released from a maturing bond, 1.50 tokens were burned from premiums. As protocol usage grows, this ratio increases further. 100% of every premium burns — the most aggressive deflationary mechanism in DeFi." },
  { q: "How are triggers verified?", a: "All triggers are parametric and verified by Chainlink oracles on-chain. There are no human judges, no committees, no disputes. The oracle checks the specific condition (e.g., 'BTC dropped 5% in 1 hour') and either it happened or it didn't. EIP-712 signed proofs ensure data integrity." },
  { q: "What is the Bond Reserve?", a: "82% of all $LUMINA tokens are locked in the Bond Reserve. This reserve is immutable and backs all ClaimBond payouts. It cannot be accessed by the team, governance, or any other mechanism. The reserve ensures the protocol can always pay its obligations." },
  { q: "How does the pricing formula work?", a: "Premium = Coverage x 80% x P(trigger) x 1.5x. The 80% factor is the payout ratio. P(trigger) is the actuarial probability of the event occurring. The 1.5x safety margin ensures the protocol remains solvent. This is a fixed formula with no dynamic adjustments based on demand." },
  { q: "What wallet do I need?", a: "Any Web3 wallet supporting Base L2. MetaMask is most common. You need: (1) Base network added (Chain ID 8453), (2) some ETH on Base for gas (less than $0.01 per tx), (3) USDC on Base for placing bets." },
  { q: "What is the SKILL file?", a: "A comprehensive documentation file that AI agents load to interact with Lumina autonomously. It contains all API endpoints, product details, pricing info, and contract addresses. Any AI framework (Claude, ChatGPT, ElizaOS, LangChain) can load it and immediately begin operating. Download at lumina-org.com/LUMINA-SKILL.txt" },
]

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section className="py-24 px-4">
      <div id="faq" className="scroll-mt-20" />
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2 mb-16">
          {FAQ_ITEMS.map((faq, i) => {
            const isOpen = openIdx === i
            return (
              <div key={i} className={`border ${isOpen ? "border-cyan-500/20" : "border-white/5"} rounded-xl overflow-hidden transition-colors`}>
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-medium text-white/80 pr-4">{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-white/40 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-4 text-sm text-white/50 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* CONTACT */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Need Help?</h3>
          <p className="text-sm text-white/50 mb-8">A human will respond. We&apos;ll explain the products, give you the Skill file, and help you get started.</p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-sm font-semibold text-white/70 mb-2">Sales &amp; Onboarding</h4>
              <a href="mailto:labs@lumina-org.com" className="text-lg font-bold text-cyan-400 hover:underline block mb-2">
                labs@lumina-org.com
              </a>
              <p className="text-xs text-white/40">Want to integrate Lumina? Need the Skill file? Talk to our team.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white/70 mb-2">Support &amp; Questions</h4>
              <a href="mailto:support@lumina-org.com" className="text-lg font-bold text-cyan-400 hover:underline block mb-2">
                support@lumina-org.com
              </a>
              <p className="text-xs text-white/40">General questions, technical help, or just curious.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:labs@lumina-org.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
            >
              Contact Sales &rarr;
            </a>
            <a
              href="mailto:support@lumina-org.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white/70 border border-white/20 hover:bg-white/5 transition-all"
            >
              Get Support &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  NAVBAR                                                   */
/* ═══════════════════════════════════════════════════════════ */

function Navbar({ onConnectAgent, walletAddress, setWalletAddress }: { onConnectAgent: () => void; walletAddress: string | null; setWalletAddress: (addr: string | null) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: "Products", href: "#products" },
    { label: "Pricing", href: "#pricing" },
    { label: "Tokenomics", href: "#tokenomics" },
    { label: "Skill", href: "/LUMINA-SKILL.txt", external: true },
    { label: "Security", href: "#security" },
    { label: "FAQ", href: "#faq" },
    { label: "Docs", href: "https://github.com/org-lumina/LUMINA-PROTOCOL", external: true },
  ]

  const handleClick = (href: string, external?: boolean) => {
    setMenuOpen(false)
    if (!external && href.startsWith("#")) {
      setTimeout(() => {
        const el = document.querySelector(href)
        el?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-xl font-bold">
          <span className="text-cyan-400">LUMINA</span>
          <span className="text-white/20"> &middot; </span>
          <span className="text-purple-400">ClaimBond</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            link.external ? (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-cyan-400 transition-colors whitespace-nowrap">
                {link.label}
              </a>
            ) : (
              <button key={link.label} onClick={() => handleClick(link.href)} className="text-sm text-white/70 hover:text-cyan-400 transition-colors whitespace-nowrap">
                {link.label}
              </button>
            )
          ))}
          <button
            onClick={() => {
              const event = new CustomEvent('open-whitepaper-modal');
              window.dispatchEvent(event);
            }}
            className="text-sm text-[#00D4AA] hover:text-[#00FFD0] transition-colors whitespace-nowrap"
          >
            Whitepaper
          </button>
        </div>

        {/* Connect Agent + Connect Wallet */}
        <div className="hidden md:flex items-center gap-3">
          {walletAddress ? (
            <>
              <button
                onClick={onConnectAgent}
                className="text-xs text-white/40 hover:text-amber-400 transition-colors px-2 py-1"
              >
                Setup Guide
              </button>
              <a href="/dashboard" className="px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400 transition-all">
                Dashboard
              </a>
              <span className="text-xs font-mono text-white/40">{truncateAddress(walletAddress)}</span>
              <button
                onClick={() => { disconnectWallet(); setWalletAddress(null) }}
                className="text-xs text-white/30 hover:text-red-400 transition-colors"
              >
                Disconnect
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onConnectAgent}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all"
              >
                Getting Started
              </button>
              <a
                href="/connect"
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10"
              >
                Connect Wallet
              </a>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white/70 hover:text-white p-2">
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A0F] border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                link.external ? (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="block py-3 text-base text-white hover:text-cyan-400 transition-colors">
                    {link.label}
                  </a>
                ) : (
                  <button key={link.label} onClick={() => handleClick(link.href)} className="block w-full text-left py-3 text-base text-white hover:text-cyan-400 transition-colors">
                    {link.label}
                  </button>
                )
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  const event = new CustomEvent('open-whitepaper-modal');
                  window.dispatchEvent(event);
                }}
                className="block w-full text-left py-3 text-base text-[#00D4AA] hover:text-[#00FFD0] transition-colors"
              >
                Whitepaper
              </button>
              <div className="pt-2 space-y-2">
                {walletAddress ? (
                  <>
                    <button
                      onClick={() => { setMenuOpen(false); onConnectAgent(); }}
                      className="block w-full text-center text-xs text-white/40 hover:text-amber-400 transition-colors py-2"
                    >
                      Setup Guide
                    </button>
                    <a
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-center px-6 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400 transition-all"
                    >
                      Dashboard
                    </a>
                    <div className="flex items-center justify-center gap-3 py-1">
                      <span className="text-xs font-mono text-white/40">{truncateAddress(walletAddress)}</span>
                      <button
                        onClick={() => { disconnectWallet(); setWalletAddress(null); setMenuOpen(false) }}
                        className="text-xs text-white/30 hover:text-red-400 transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setMenuOpen(false); onConnectAgent(); }}
                      className="block w-full text-center px-6 py-2.5 rounded-xl text-sm font-medium border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all"
                    >
                      Getting Started
                    </button>
                    <a
                      href="/connect"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-center px-6 py-2.5 rounded-full text-base font-medium transition-all text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10"
                    >
                      Connect Wallet
                    </a>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function HowCard({ step, icon, title, description, note, accent }: { step: string; icon: string; title: string; description: string; note: string; accent: "cyan" | "purple" }) {
  const borderColor = accent === "cyan" ? "border-cyan-500/20 hover:border-cyan-500/40" : "border-purple-500/20 hover:border-purple-500/40"
  const stepColor = accent === "cyan" ? "text-cyan-500" : "text-purple-500"

  return (
    <div className={`p-6 rounded-2xl bg-white/[0.02] border ${borderColor} transition-all duration-300`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{icon}</span>
        <span className={`text-sm font-mono ${stepColor}`}>{step}</span>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-white/50 text-[15px] leading-relaxed">{description}</p>
      <p className="text-xs text-white/30 italic mt-3">{note}</p>
    </div>
  )
}
