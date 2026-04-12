"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { calculateYield } from "@/lib/pricing"
import { PRODUCTS as PRODUCTS_CONFIG, KINK_MODEL, CONTRACTS, TOKENS, PROTOCOL, CHAIN, calcKinkMultiplier as calcKinkMultiplierFromConfig, calculatePremium } from '@/lib/lumina-config'
import { disconnectWallet, getStoredWallet, truncateAddress, isDisclaimerAccepted } from '@/lib/wallet'
import { useLuminaWallet } from '@/hooks/use-lumina-wallet'

type Perspective = "protect" | "earn"

function useAaveYield() {
  const [apy, setApy] = useState<number | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem('aave_usdc_apy');
    const cachedTime = localStorage.getItem('aave_usdc_apy_time');
    const FOUR_HOURS = 4 * 60 * 60 * 1000;

    if (cached && cachedTime && (Date.now() - parseInt(cachedTime)) < FOUR_HOURS) {
      setApy(parseFloat(cached));
      return;
    }

    fetch('https://yields.llama.fi/pools')
      .then(res => res.json())
      .then(data => {
        const pool = data.data.find((p: any) =>
          p.project === 'aave-v3' &&
          p.chain === 'Base' &&
          p.symbol === 'USDC'
        );
        const rate = pool ? parseFloat(pool.apy.toFixed(2)) : 3.5;
        setApy(rate);
        localStorage.setItem('aave_usdc_apy', rate.toString());
        localStorage.setItem('aave_usdc_apy_time', Date.now().toString());
      })
      .catch(() => setApy(3.5));
  }, []);

  return apy;
}

export default function Home() {
  const [perspective, setPerspective] = useState<Perspective>("protect")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showWhitepaper, setShowWhitepaper] = useState(false)
  const [wpStep, setWpStep] = useState<"lang" | "version">("lang")
  const [wpLang, setWpLang] = useState<"en" | "es">("en")
  // Unified wallet source: prefers wagmi, falls back to legacy
  // localStorage. The legacy disclaimer guard is preserved — we
  // only "show" the wallet if the user accepted the disclaimer.
  const { address: luminaAddress } = useLuminaWallet()
  const [disclaimerOk, setDisclaimerOk] = useState(false)
  useEffect(() => { setDisclaimerOk(isDisclaimerAccepted()) }, [])
  const walletAddress = disclaimerOk ? luminaAddress : null
  // Backward-compat shim: the inline Navbar still expects a
  // setWalletAddress function on the Disconnect button. Disconnect
  // already happens through `disconnectWallet()` (which clears
  // localStorage AND wagmi via the bridge); the local setter is
  // a no-op now because the address comes from useLuminaWallet().
  const setWalletAddress = (_: string | null) => { /* no-op — managed by useLuminaWallet */ }
  const aaveYield = useAaveYield()

  // Listen for whitepaper modal open from navbar
  useEffect(() => {
    const handler = () => { setWpStep("lang"); setShowWhitepaper(true); }
    window.addEventListener("open-whitepaper-modal", handler)
    return () => window.removeEventListener("open-whitepaper-modal", handler)
  }, [])

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
      {/* NAVBAR */}
      <Navbar perspective={perspective} onConnectAgent={() => setShowOnboarding(true)} walletAddress={walletAddress} setWalletAddress={setWalletAddress} />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 text-center">
        {/* Gradient background */}
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
            <span className="text-purple-400">M2M</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">Parametric Insurance</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Built for AI Agents
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
              Your agent buys coverage, oracles verify triggers, payouts arrive in seconds.
            </p>
            <p className="text-sm sm:text-base text-white/70 mt-3 tracking-wide font-medium">
              <span style={{color: '#00D4AA'}}>No claims process</span><span style={{color: '#6B7280'}}> · </span><span style={{color: '#3B82F6'}}>No human judges</span><span style={{color: '#6B7280'}}> · </span><span style={{color: '#8B5CF6'}}>No disputes</span><span style={{color: '#6B7280'}}> · </span><span style={{color: '#F59E0B'}}>Just math.</span>
            </p>
          </motion.div>

          {/* SWITCH PROTECT / EARN */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-2 p-1.5 bg-white/5 rounded-full border border-white/10 mb-12 max-w-md mx-auto"
          >
            <button
              onClick={() => setPerspective("protect")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                perspective === "protect"
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              🛡️ PROTECT
              <span className="hidden sm:inline text-xs font-normal opacity-70">AI Agent Insurance</span>
            </button>
            <button
              onClick={() => setPerspective("earn")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                perspective === "earn"
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              💰 EARN
              <span className="hidden sm:inline text-xs font-normal opacity-70">Yield on USDC</span>
            </button>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <a href="#agent-skills" className={`px-8 py-3 rounded-full font-semibold transition-all ${
              perspective === "protect"
                ? "bg-cyan-500 hover:bg-cyan-400 text-black"
                : "bg-purple-500 hover:bg-purple-400 text-black"
            }`}>
              Connect Your Agent
            </a>
            <a href="#how-it-works" className="px-8 py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all">
              Learn How It Works
            </a>
          </motion.div>

          {/* Agent vs Wallet explainer */}
          <div style={{ maxWidth: 700, margin: '40px auto 0', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ flex: 1, minWidth: 250, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🤖</div>
                <h4 style={{ color: '#00e5ff', margin: '0 0 8px', fontSize: 15 }}>Set Up Your Agent</h4>
                <p style={{ color: '#888', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                  Create an API key, approve a spending limit, and give your agent the SKILL file. Your agent then buys insurance and manages yield <strong style={{ color: '#aaa' }}>autonomously via API</strong> — no wallet needed.
                </p>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' }}></div>
              <div style={{ flex: 1, minWidth: 250, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>👁️</div>
                <h4 style={{ color: '#7c4dff', margin: '0 0 8px', fontSize: 15 }}>Monitor via Dashboard</h4>
                <p style={{ color: '#888', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                  Connect your wallet to view your agent&apos;s activity — active policies, vault deposits, yields, and claims. <strong style={{ color: '#aaa' }}>This is read-only monitoring</strong>, your agent operates independently.
                </p>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base font-medium mt-[60px]"
          >
            <span className="text-cyan-400"><span className="font-bold">4</span> Products</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/30" />
            <span className="text-purple-400"><span className="font-bold">4</span> Vaults</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/30" />
            <span className="text-cyan-400"><span className="font-bold">24</span> Audited Contracts</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/30" />
            <span className="text-purple-400"><span className="font-bold">3%</span> Protocol Fee</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/30" />
            <span className="text-cyan-400">Aave V3 Base Yield <span className="font-bold">{aaveYield !== null ? `${aaveYield}%` : '...'}</span></span>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {perspective === "protect" ? "Deploy Protection in 3 Simple Steps" : "Put Your Capital to Work in 3 Simple Steps"}
          </h2>
          <p className="text-white/50 text-center mb-16 max-w-xl mx-auto">
            {perspective === "protect"
              ? "Give your agent the instructions. It handles everything else."
              : "Your agent manages yield 24/7. You just watch your balance grow."}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={perspective}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Timeline connector - horizontal on desktop */}
              <div className="hidden md:flex items-center justify-center mb-8 max-w-4xl mx-auto px-16">
                {/* Dot 1 - active with ping */}
                <div className="relative flex items-center justify-center">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${perspective === "protect" ? "bg-cyan-400/30" : "bg-purple-400/30"}`}></span>
                  <div className={`w-4 h-4 rounded-full relative ${perspective === "protect" ? "bg-cyan-500" : "bg-purple-500"}`} />
                </div>
                {/* Line 1→2 */}
                <div className={`flex-1 h-0.5 ${perspective === "protect" ? "bg-gradient-to-r from-cyan-500 to-cyan-500/30" : "bg-gradient-to-r from-purple-500 to-purple-500/30"}`} />
                {/* Dot 2 */}
                <div className={`w-4 h-4 rounded-full ${perspective === "protect" ? "bg-cyan-500" : "bg-purple-500"}`} />
                {/* Line 2→3 */}
                <div className={`flex-1 h-0.5 ${perspective === "protect" ? "bg-gradient-to-r from-cyan-500/30 to-cyan-500" : "bg-gradient-to-r from-purple-500/30 to-purple-500"}`} />
                {/* Dot 3 */}
                <div className={`w-4 h-4 rounded-full ${perspective === "protect" ? "bg-cyan-500" : "bg-purple-500"}`} />
              </div>

              {/* Timeline connector - vertical on mobile */}
              <div className="md:hidden flex mb-8">
                <div className="flex flex-col items-center mr-6 ml-2">
                  {/* Dot 1 - active with ping */}
                  <div className="relative flex items-center justify-center">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${perspective === "protect" ? "bg-cyan-400/30" : "bg-purple-400/30"}`}></span>
                    <div className={`w-3 h-3 rounded-full relative ${perspective === "protect" ? "bg-cyan-500" : "bg-purple-500"}`} />
                  </div>
                  <div className={`w-0.5 flex-1 ${perspective === "protect" ? "bg-gradient-to-b from-cyan-500 to-cyan-500/30" : "bg-gradient-to-b from-purple-500 to-purple-500/30"}`} />
                  {/* Dot 2 */}
                  <div className={`w-3 h-3 rounded-full ${perspective === "protect" ? "bg-cyan-500" : "bg-purple-500"}`} />
                  <div className={`w-0.5 flex-1 ${perspective === "protect" ? "bg-gradient-to-b from-cyan-500/30 to-cyan-500" : "bg-gradient-to-b from-purple-500/30 to-purple-500"}`} />
                  {/* Dot 3 */}
                  <div className={`w-3 h-3 rounded-full ${perspective === "protect" ? "bg-cyan-500" : "bg-purple-500"}`} />
                </div>
                <div className="flex-1 text-white/30 text-sm flex flex-col justify-between py-1">
                  <span>01</span>
                  <span>02</span>
                  <span>03</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
              {perspective === "protect" ? (
                <>
                  <HowCard step="01" icon="📋" title="Connect & Instruct" description="Copy our Skill link and paste it into your agent platform. It's like giving a manual to your new financial employee — your agent instantly knows how to protect your portfolio." note="It's a manual, not code." accent="cyan" />
                  <HowCard step="02" icon="🛡️" title="Autonomous Protection" description="Your agent scans markets 24/7. It activates insurance shields only when risk warrants it — crashes, depegs, exploits. Everything happens autonomously on-chain. You don't lift a finger." note="24/7 vigilance without moving a finger." accent="cyan" />
                  <HowCard step="03" icon="⚡" title="Instant Claims" description="If a trigger is met, your agent collects the payout instantly — same block, same transaction. If markets are calm, your capital stays protected and ready. You just monitor from the dashboard." note="Your balance is always protected." accent="cyan" />
                </>
              ) : (
                <>
                  <HowCard step="01" icon="📋" title="Connect & Instruct" description="Copy our Skill link and paste it into your agent platform. It's like giving a manual to your new financial employee — your agent instantly knows where to find the best yields." note="It's a manual, not code." accent="purple" />
                  <HowCard step="02" icon="📈" title="Autonomous Yield" description="Your agent deposits USDC into the optimal vault and monitors yields 24/7. It earns from Aave V3 lending rates PLUS insurance premiums. Everything happens autonomously on-chain." note="24/7 yield management without moving a finger." accent="purple" />
                  <HowCard step="03" icon="💰" title="Watch It Grow" description="Premiums flow into your vault every time an agent buys insurance. Your balance grows daily. When you want to exit, your agent handles the cooldown and withdrawal. You just watch." note="Your capital grows and you're always in control." accent="purple" />
                </>
              )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Closing phrase */}
          <div className="mt-12 max-w-3xl mx-auto bg-white/[0.02] border border-white/10 rounded-xl p-6">
            <p className="text-lg text-white/70 italic text-center">
              {perspective === "protect"
                ? "Lumina turns your AI agent into a professional risk manager. You provide the capital, your agent provides the execution."
                : "Lumina turns your AI agent into a professional yield manager. You provide the capital, your agent provides the execution."}
            </p>
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <a
              href="/LUMINA-SKILL.txt"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                perspective === "protect"
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
                  : "bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20"
              }`}
            >
              Give Your Agent the Skill →
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      {perspective === "protect" && (
        <ProductsSection />
      )}

      {/* PREMIUM CALCULATOR */}
      {perspective === "protect" && (
        <PremiumCalculatorSection />
      )}

      {/* VAULTS */}
      {perspective === "earn" && (
        <VaultsSection />
      )}

      {/* YIELD CALCULATOR */}
      {perspective === "earn" && (
        <YieldCalculatorSection />
      )}

      {/* KINK MODEL EXPLAINER (shared) */}
      <KinkModelSection perspective={perspective} />

      {/* AGENT SKILLS (shared) */}
      <AgentSkillsSection perspective={perspective} onStartSetup={() => setShowOnboarding(true)} />

      {/* COMPARISON TABLE (shared) */}
      <ComparisonSection perspective={perspective} />

      {/* SECURITY & AUDITS (shared) */}
      <SecuritySection perspective={perspective} />

      {/* ROADMAP */}
      <section className="py-20 px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-16">Roadmap</h2>

        {/* Timeline line - desktop only */}
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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
          <div className="bg-[#1F2937] border border-[#1F2937] border-t-[3px] border-t-[#10B981] rounded-xl p-5 hover:border-[#10B98140] transition-all">
            <p className="text-white font-bold text-lg">Q2 2026</p>
            <p className="text-[#10B981] text-xs font-semibold uppercase tracking-widest mb-3">Launch</p>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">Protocol live on Base L2. Real USDC settlement. Four insurance products. Aave V3 yield. Multisig oracle. API-first for AI agents.</p>
          </div>
          <div className="bg-[#1F2937] border border-[#1F2937] border-t-[3px] border-t-[#00D4AA] rounded-xl p-5 hover:border-[#00D4AA40] transition-all">
            <p className="text-white font-bold text-lg">Q3 2026</p>
            <p className="text-[#00D4AA] text-xs font-semibold uppercase tracking-widest mb-3">Growth</p>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">Agent framework integrations. New coverage products. Automated claim resolution. Tier 1 security audit. Expanded distribution channels.</p>
          </div>
          <div className="bg-[#1F2937] border border-[#1F2937] border-t-[3px] border-t-[#3B82F6] rounded-xl p-5 hover:border-[#3B82F640] transition-all">
            <p className="text-white font-bold text-lg">Q4 2026</p>
            <p className="text-[#3B82F6] text-xs font-semibold uppercase tracking-widest mb-3">Scale</p>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">Institutional-grade infrastructure. Multi-chain deployment. Strategic DeFi partnerships. 24/7 monitoring and operations.</p>
          </div>
          <div className="bg-[#1F2937] border border-[#1F2937] border-t-[3px] border-t-[#8B5CF6] rounded-xl p-5 hover:border-[#8B5CF640] transition-all">
            <p className="text-white font-bold text-lg">Q1 2027</p>
            <p className="text-[#8B5CF6] text-xs font-semibold uppercase tracking-widest mb-3">New Economy</p>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">Policy and vault position NFT marketplace. Native token with real protocol yield. Transition to community-driven DAO governance.</p>
          </div>
        </div>
      </section>

      {/* FAQ + CONTACT (shared) */}
      <FAQSection perspective={perspective} />

      {/* FOOTER */}
      <footer className="bg-[#0A0A0F] border-t border-white/5 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 items-start mb-12">
            {/* Brand */}
            <div className="max-w-xs">
              <h4 className="text-lg font-bold">
                <span className="text-cyan-400">LUMINA</span>
                <span className="text-white/20"> · </span>
                <span className="text-purple-400">M2M</span>
              </h4>
              <p className="text-sm text-white/50 mt-2">Parametric Insurance for AI Agents</p>
              <p className="text-xs text-white/30 mt-1">Built on Base L2 · Settlement in USDC · Yield by Aave V3</p>
            </div>

            {/* Products */}
            <div>
              <h5 className="text-sm font-semibold text-white/60 uppercase mb-3">Products</h5>
              <div className="space-y-2">
                <a href="#products" className="block text-sm text-white/40 hover:text-white transition-colors">BTC Catastrophe Shield</a>
                <a href="#products" className="block text-sm text-white/40 hover:text-white transition-colors">ETH Apocalypse Shield</a>
                <a href="#products" className="block text-sm text-white/40 hover:text-white transition-colors">Depeg Shield</a>
                <a href="#products" className="block text-sm text-white/40 hover:text-white transition-colors">IL Index Cover</a>
                <a href="#products" className="block text-sm text-white/40 hover:text-white transition-colors">Exploit Shield</a>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h5 className="text-sm font-semibold text-white/60 uppercase mb-3">Resources</h5>
              <div className="space-y-2">
                <a href="/LUMINA-SKILL.txt" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/40 hover:text-white transition-colors">Skill File</a>
                <a href="https://github.com/org-lumina/LUMINA-PROTOCOL" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/40 hover:text-white transition-colors">Smart Contracts</a>
                <a href="https://github.com/org-lumina/LUMINA-PROTOCOL" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/40 hover:text-white transition-colors">Documentation</a>
                <a href="https://base.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/40 hover:text-white transition-colors">Base L2</a>
              </div>
            </div>

            {/* Contact */}
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
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Read-Only RPC Proxy
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-medium">
              No Private Keys Stored
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-medium">
              MetaMask Approval Required
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(124,77,255,0.1)] border border-[rgba(124,77,255,0.2)] text-[#7c4dff] text-[11px] font-medium">
              OWS Compatible
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-medium">
              🔐 Multisig Oracle
            </span>
          </div>
          <div className="border-t border-white/5 pt-8">
            <p className="text-xs text-white/20 text-center">
              © 2026 Lumina Protocol. All rights reserved. · Protocol Fee: 3% · 119 Tests Passing · 0C/0H/0M · Yield by Aave V3
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
              <button onClick={() => setShowWhitepaper(false)} className="absolute top-4 right-4 text-[#6B7280] hover:text-white text-xl">✕</button>

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
                    ← Back
                  </button>
                  <h3 className="text-xl font-bold text-white text-center mb-6">
                    Whitepaper — {wpLang === "en" ? "English" : "Espanol"}
                  </h3>
                  <div className="space-y-4">
                    <a href={`/LUMINA-WHITEPAPER-${wpLang.toUpperCase()}-V3.html`} className="block bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-6 transition-all">
                      <div className="font-semibold text-white mb-1">{wpLang === "en" ? "Full Whitepaper" : "Whitepaper Completo"}</div>
                      <div className="text-[#9CA3AF] text-sm mb-3">{wpLang === "en" ? "Complete technical document — 16 sections, architecture, security, oracle flows, contract addresses" : "Documento tecnico completo — 16 secciones, arquitectura, seguridad, flujos de oracle, direcciones de contratos"}</div>
                      <span className="text-[#00D4AA] text-sm font-medium">{wpLang === "en" ? "Read Full Whitepaper →" : "Leer Whitepaper Completo →"}</span>
                    </a>
                    <a href={`/whitepaper/${wpLang}`} className="block bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-6 transition-all">
                      <div className="font-semibold text-white mb-1">{wpLang === "en" ? "Executive Summary" : "Resumen Ejecutivo"}</div>
                      <div className="text-[#9CA3AF] text-sm mb-3">{wpLang === "en" ? "Quick visual overview — interactive charts, key metrics, 5 minute read" : "Resumen visual rapido — graficos interactivos, metricas clave, 5 minutos de lectura"}</div>
                      <span className="text-[#00D4AA] text-sm font-medium">{wpLang === "en" ? "View Interactive Summary →" : "Ver Resumen Interactivo →"}</span>
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
                ✕
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Connect Your AI Agent to Lumina</h2>
                <p className="text-white/50 text-sm">Choose your path — from zero to insured in 10 minutes</p>
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
                    <p className="text-sm text-white/70">Step-by-step guide to set up your wallet, approve spending, get your API Key, and configure your agent. No blockchain knowledge needed.</p>
                  </div>
                  <div className="space-y-2 pt-6">
                    <a href="/tutorial.html" className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all">Read the Guide →</a>
                    <p className="text-[10px] text-white/30 text-center">Visual walkthrough with examples</p>
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
                    <a href="/LUMINA-SKILL.txt" download className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all">Download SKILL File ↓</a>
                    <p className="text-[10px] text-white/30 text-center">Plain text — paste into any LLM</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/[0.03] border border-green-500/20 rounded-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-3xl mb-3">⚡</div>
                    <h3 className="text-lg font-bold text-green-300 mb-2">Auto-Setup (Claude Code)</h3>
                    <p className="text-sm text-white/70">Copy-paste this prompt into Claude Code PowerShell. It creates your API Key, guides you through the secure wallet approval, buys a test policy, and downloads the SKILL file — all without ever asking for your private key.</p>
                  </div>
                  <div className="space-y-2 pt-6">
                    <button
                      onClick={() => {
                        const userWallet = walletAddress || '[PASTE YOUR WALLET ADDRESS HERE]'
                        const prompt = `BEFORE WE START — ONE MANUAL STEP REQUIRED

This setup is 95% automatic, but there is ONE step you will need to do manually in your browser: approving USDC spending in MetaMask.

When I tell you, you will need to:
1. Open lumina-org.com/tutorial.html in your browser
2. Connect your wallet (MetaMask, on Base network)
3. Approve USDC spending for the Lumina CoverRouter contract

This is a security feature — your private key NEVER leaves MetaMask. I cannot and should not access your private key. The approval is like setting a spending limit on a debit card.

I will tell you exactly when to do this. Everything else I handle automatically.

---

I need to connect my AI agent to Lumina Protocol for DeFi insurance on Base L2.

BEFORE STARTING — I need to provide my information:
- Wallet address: ${userWallet}
- Agent label (optional, default "my-agent"): [CHOOSE A NAME OR LEAVE DEFAULT]

SECURITY NOTE: This setup does NOT require your private key. Never paste your private key in any chat, terminal, or website. The blockchain approval step is done through MetaMask in your browser where your key stays safe.

Use my wallet address everywhere it's needed below. Do NOT ask me for it again.

Please do the following steps in order. After each step, show me the result and wait for my confirmation before continuing.

STEP 1 — Check that the Lumina API is online:
curl ${PROTOCOL.apiBaseUrl}/api/v2/health
Expected: {"status":"ok"}. If it fails, wait 30 seconds and retry.

STEP 2 — Create my API Key:
curl -X POST ${PROTOCOL.apiBaseUrl}/api/v2/keys/create -H "Content-Type: application/json" -d '{"wallet":"${userWallet}","label":"<my agent label>"}'
IMPORTANT: The API key in the response is shown ONLY ONCE. Display it clearly and tell me to save it somewhere safe before continuing.

STEP 3 — Approve USDC spending (I need to do this myself in my browser):
STOP HERE and give me these instructions:

"I cannot do this step for you, and here is why: approving USDC spending requires your wallet signature. Your private key lives inside MetaMask and must NEVER be shared with anyone — not even me. This is what protects your money.

Please follow these steps in your browser:
1. Open https://www.lumina-org.com/tutorial.html
2. Click Connect Wallet and approve the connection in MetaMask
3. In Step 2 of the tutorial, you will see two tabs: Buy Insurance and Earn Yield
   - For insurance: enter the maximum amount your agent can spend on policies (e.g. $1,000)
   - For yield: select the vault and enter the deposit amount
4. Click Approve with MetaMask
5. MetaMask will open showing exactly how much you are authorizing — verify the amount and click Confirm
6. Done! Come back here and tell me 'approved' so I can continue with the next step.

This is a one-time setup. Once approved, your agent can operate automatically without needing your wallet again."

Wait for the user to confirm they completed the approval before continuing.

STEP 4 — Buy a test policy (BTC Catastrophe Shield, $100 coverage, 7 days):
curl -X POST ${PROTOCOL.apiBaseUrl}/api/v2/purchase -H "Content-Type: application/json" -H "X-API-Key: <API key from Step 2>" -d '{"productId":"BCS","coverageAmount":100000000,"durationSeconds":604800}'
If successful, show the policy ID and tell me: "Your first policy is active! Your agent is now connected to Lumina."
If it fails with "Insufficient allowance", tell me I need to go back to Step 3 and complete the approve.

STEP 5 — Verify my active policies:
curl ${PROTOCOL.apiBaseUrl}/api/v2/policies?buyer=${userWallet}
Show the list of policies with their status, coverage, and expiration.

STEP 6 — Download the SKILL file:
curl -O https://www.lumina-org.com/LUMINA-SKILL.txt
After downloading, tell me:

"Setup complete! Here is what was configured:
- Wallet: ${userWallet}
- Agent: <my agent label>
- API Key: created and active
- USDC Approval: authorized via MetaMask (your key never left your wallet)
- Test Policy: [show policy details]
- SKILL File: downloaded — give this to your AI agent (paste it into ChatGPT, Claude, or your custom agent)

Your agent can now buy and manage insurance policies autonomously using the API key. Monitor everything at https://www.lumina-org.com/dashboard

To give your agent full knowledge of Lumina, paste the contents of LUMINA-SKILL.txt into your agent chat."

Show me results after each step.`;
                        navigator.clipboard.writeText(prompt);
                        alert("Prompt copied! Paste it into Claude Code PowerShell.");
                      }}
                      className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all cursor-pointer"
                    >
                      Copy Setup Prompt 📋
                    </button>
                    <p className="text-[10px] text-white/30 text-center">Paste into Claude Code terminal</p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/30">
                  <span>API: {PROTOCOL.apiBaseUrl.replace('https://', '')}</span>
                  <span>Chain: {CHAIN.name} ({CHAIN.id})</span>
                  <a href={`mailto:${PROTOCOL.supportEmail}`} className="text-cyan-400/50 hover:text-cyan-400">{PROTOCOL.supportEmail}</a>
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
  {
    key: "bcs",
    emoji: "🌊",
    label: "BTC Catastrophe Shield",
    tagline: "Insurance against catastrophic BTC crashes",
    analogy: "Like hurricane insurance — covers the worst-case BTC scenario",
    rows: [
      ["Trigger", "BTC drops >50% from your purchase price"],
      ["Payout", "80% of coverage (net 77.6% after 3% fee)"],
      ["Duration", "7–30 days"],
      ["Waiting Period", "1 hour — anti-front-running"],
      ["Price", "From 0.53% for 7 days"],
    ],
    example: "$50K coverage, 14 days → Premium $527 → If triggered: receive $38,800 → Return: 73x",
    technicalDetails: [
      ["Product ID", "BTCCAT-001"],
      ["Risk Type", "VOLATILE"],
      ["Oracle", "Chainlink spot price, EIP-712 signed by LuminaOracleV2"],
      ["Strike Price", "Captured at moment of purchase"],
      ["Trigger Price", "strikePrice × 0.50"],
      ["Deductible", "20%"],
      ["Max Allocation", "30% of vault"],
      ["Grace Period", "24h post-expiry to submit claim"],
      ["Vault", "VolatileShort (37d) → overflow to VolatileLong (97d)"],
      ["Kink Model", "P_base 15% annualized × M(U) × duration"],
      ["Protocol Fee", "3% on premium + 3% on payout + 3% on vault yield"],
    ],
  },
  {
    key: "eas",
    emoji: "⚡",
    label: "ETH Apocalypse Shield",
    tagline: "Insurance against apocalyptic ETH crashes",
    analogy: "Like earthquake insurance — covers the most extreme ETH scenario",
    rows: [
      ["Trigger", "ETH drops >60% from your purchase price"],
      ["Payout", "80% of coverage (net 77.6% after 3% fee)"],
      ["Duration", "7–30 days"],
      ["Waiting Period", "1 hour — anti-front-running"],
      ["Price", "From 0.53% for 7 days"],
    ],
    example: "$50K coverage, 14 days → Premium $527 → If triggered: receive $38,800 → Return: 73x",
    technicalDetails: [
      ["Product ID", "ETHAPOC-001"],
      ["Risk Type", "VOLATILE"],
      ["Oracle", "Chainlink spot price, EIP-712 signed by LuminaOracleV2"],
      ["Strike Price", "Captured at moment of purchase"],
      ["Trigger Price", "strikePrice × 0.40"],
      ["Deductible", "20%"],
      ["Max Allocation", "25% of vault"],
      ["Grace Period", "24h post-expiry to submit claim"],
      ["Vault", "VolatileShort (37d) → overflow to VolatileLong (97d)"],
      ["Kink Model", "P_base 20% annualized × M(U) × duration"],
      ["Protocol Fee", "3% on premium + 3% on payout + 3% on vault yield"],
    ],
  },
  {
    key: "depeg",
    emoji: "🔥",
    label: "Depeg Shield",
    tagline: "Protection when USDT or DAI loses peg",
    analogy: "Like fire insurance — 24h waiting because you can smell the smoke before it burns. Covers USDT and DAI depegs. USDC excluded (settlement token).",
    description: "Protects your agent's stablecoin holdings against depeg events. Covers USDT and DAI. USDC is excluded because it's Lumina's settlement token — insuring it would create circular risk.",
    rows: [
      ["Trigger", "Stablecoin spot price < $0.95, EIP-712 signed"],
      ["Covers", "USDT (net 82.5%), DAI (net 85.4%). USDC excluded — it's Lumina's settlement token."],
      ["Duration", "14–365 days"],
      ["Waiting Period", "24 hours"],
      ["Price", "Discounts for longer durations: 10% off at 91d, 20% off at 181d"],
    ],
    example: "$100K USDT, 90 days → Premium $3,699 → If triggered: receive $82,500",
    technicalDetails: [
      ["Product ID", "DEPEG-STABLE-001"],
      ["Risk Type", "STABLE"],
      ["Oracle", "Chainlink spot price, EIP-712 signed by LuminaOracleV2"],
      ["Threshold", "Absolute $0.95 (not relative)"],
      ["Risk Multipliers", "DAI 1.2x, USDT 1.4x (USDC excluded — settlement token)"],
      ["Deductibles", "DAI 12%, USDT 15%"],
      ["Duration Discount", "0.90x (91-180d), 0.80x (181-365d)"],
      ["Max Allocation", "20% of vault"],
      ["Vault", "StableShort (90d) → overflow to StableLong (365d)"],
      ["Kink Model", "P_base 24% annualized × riskMult × durationDiscount × M(U) × duration"],
      ["Anti-Adverse Selection", "24h waiting prevents buying after seeing smoke"],
    ],
  },
  {
    key: "il",
    emoji: "🚗",
    label: "IL Index Cover",
    tagline: "Proportional coverage for impermanent loss",
    analogy: "Like car dent insurance — small dent = small payout, big crash = bigger payout",
    rows: [
      ["Trigger", "IL > 2% at policy expiry (European-style, 48h claim window)"],
      ["Payout", "Proportional: Coverage × (IL% − 2%) × 90% × 97%. Cap at 11.7%"],
      ["Duration", "14–90 days"],
      ["Waiting Period", "None — instant coverage"],
      ["Key Difference", "ONLY product with proportional payout. Can ONLY claim during 48h window after expiry."],
    ],
    example: "ETH moves ±50% → IL 5.7% → Net payout $1,665 on $50K coverage",
    technicalDetails: [
      ["Product ID", "ILPROT-001"],
      ["Risk Type", "VOLATILE"],
      ["Oracle", "Chainlink spot price at expiry, EIP-712 signed"],
      ["Formula", "IL% = 1 - 2√r / (1+r), where r = currentPrice / strikePrice"],
      ["Deductible", "2% restable (subtracted, not multiplicative)"],
      ["Payout Cap", "11.7% of coverage"],
      ["Resolution", "European-style — 48h settlement window after expiresAt"],
      ["Max Allocation", "20% of vault"],
      ["Vault", "VolatileShort (30d) → overflow to VolatileLong (90d)"],
      ["Kink Model", "P_base 20% annualized × M(U) × duration"],
    ],
  },
  {
    key: "exploit",
    emoji: "🏦",
    label: "Exploit Shield",
    tagline: "Coverage against smart contract hacks (external protocols)",
    analogy: "Like bank robbery insurance — dual trigger prevents false alarms. Covers DeFi protocols except Aave V3 (Lumina's yield infrastructure).",
    description: "Protects your agent's funds in DeFi protocols against exploits and hacks. Covers any protocol except Aave V3, which is Lumina's yield infrastructure — insuring it would create circular risk.",
    rows: [
      ["Trigger", "DUAL: Governance token −25% in 24h AND receipt token −30% for 4h (or contract paused)"],
      ["Payout", "90% of coverage (net 87.3% after fee)"],
      ["Duration", "90–365 days"],
      ["Waiting Period", "14 days (anti-insider)"],
      ["Cap", "$50,000 per wallet"],
      ["Protocols", "Compound, Uniswap, MakerDAO, Curve, Morpho. Aave V3 excluded — it's Lumina's yield infrastructure."],
      ["Why Dual Trigger", "Bear market drops gov tokens but aUSDC stays at $1 = NOT an exploit. Only real hacks trigger BOTH."],
    ],
    example: "",
    technicalDetails: [
      ["Product ID", "EXPLOIT-001"],
      ["Risk Type", "STABLE"],
      ["Oracle", "Chainlink spot (governance) EIP-712 signed + Phala TEE attestation (receipt token)"],
      ["Condition 1", "Governance token drops >25% in 24h"],
      ["Condition 2", "Receipt token drops >30% sustained 4h OR contract paused"],
      ["Both Required", "Both conditions must be met simultaneously"],
      ["Protocol Tiers", "Tier 1 (Compound, Uniswap) 1.0x, MakerDAO 1.1x, Curve 1.5x, Morpho 1.8x. Aave V3 excluded — Lumina's yield infrastructure."],
      ["Max Coverage", "$50,000 per wallet"],
      ["Max Allocation", "10% of vault (combined for all Exploit policies)"],
      ["Vault", "StableLong (365d) only"],
      ["Kink Model", "P_base 3% (Tier 1) × riskMult × durationDiscount × M(U) × duration"],
      ["Anti-Insider", "14-day waiting makes timing attacks impractical"],
    ],
  },
]

function ProductsSection() {
  const [active, setActive] = useState(0)
  const [modalProduct, setModalProduct] = useState<string | null>(null)
  const product = PRODUCTS[active]
  const modalData = PRODUCTS.find((p) => p.key === modalProduct)

  return (
    <section className="py-24 px-4">
      <div id="products" className="scroll-mt-20" />
      <div className="max-w-5xl mx-auto rounded-2xl bg-white/[0.02] border border-cyan-500/20 shadow-[0_-2px_20px_rgba(0,212,255,0.05)] overflow-hidden">
        <div className="h-[3px] w-full bg-gradient-to-r from-cyan-500 to-transparent" />
        <div className="p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-cyan-400">
          Insurance Products
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          Four parametric products. Each with its own trigger, payout, and oracle verification.
        </p>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 mb-8 border-b border-white/5 pb-px scrollbar-hide">
          {PRODUCTS.map((p, i) => (
            <button
              key={p.key}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-all ${
                active === i
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              <span>{p.emoji}</span>
              <span className="hidden sm:inline">{p.label}</span>
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
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">
                <span className="mr-2">{product.emoji}</span>
                {product.label}
              </h3>
              <p className="text-cyan-400 text-[15px] mb-1">{product.tagline}</p>
              <p className="text-white/40 text-sm italic">{product.analogy}</p>
            </div>

            {/* Info rows */}
            <div className="space-y-3 mb-6">
              {product.rows.map(([label, value]) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs uppercase tracking-wider text-white/30 sm:w-40 shrink-0 font-medium">{label}</span>
                  <span className="text-[15px] text-white/70 leading-relaxed">{value}</span>
                </div>
              ))}
            </div>

            {/* Technical Details button */}
            <button
              onClick={() => setModalProduct(product.key)}
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white/70 transition-colors mb-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              Technical Details
            </button>

            {/* Example */}
            {product.example && (
              <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/10 p-4 mb-6">
                <span className="text-xs uppercase tracking-wider text-cyan-400/60 font-medium block mb-1">Example</span>
                <p className="text-[15px] text-white/70">{product.example}</p>
              </div>
            )}

            {/* CTA */}
            <div className="text-center pt-2">
              <a
                href="/LUMINA-SKILL.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
              >
                Give This Skill To Your Agent →
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      </div>

      {/* Technical Details Modal */}
      <AnimatePresence>
        {modalData && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalProduct(null)}
          >
            <motion.div
              className="bg-[#12121A] border border-cyan-500/40 rounded-2xl p-8 max-w-lg mx-4 max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">
                  <span className="mr-2">{modalData.emoji}</span>
                  {modalData.label}
                </h3>
                <button onClick={() => setModalProduct(null)} className="text-white/40 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className="space-y-3">
                {modalData.technicalDetails.map(([label, value]) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                    <span className="text-xs uppercase tracking-wider text-white/40 sm:w-44 shrink-0 font-medium">{label}</span>
                    <span className="text-sm text-white/70">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  PREMIUM CALCULATOR                                       */
/* ═══════════════════════════════════════════════════════════ */

type CalcProduct = "bcs" | "eas" | "depeg" | "il" | "exploit"

const CALC_DURATION_RANGES: Record<CalcProduct, [number, number, number]> = {
  bcs: [7, 30, 14],
  eas: [7, 30, 14],
  depeg: [30, 365, 90],
  il: [30, 90, 30],
  exploit: [30, 365, 180],
}

// ═══════════════════════════════════════════════════════════
// KINK MODEL & PRODUCT CONFIG — imported from lumina-config.ts
// ═══════════════════════════════════════════════════════════
// calcKinkMultiplier and PRODUCTS_CONFIG are imported from @/lib/lumina-config

// Map lowercase CalcProduct keys to config keys
const CALC_PRODUCT_CONFIG: Record<CalcProduct, { pBaseBps: number; riskType: "VOLATILE" | "STABLE" }> = {
  bcs:     { pBaseBps: PRODUCTS_CONFIG.BCS.pBaseBps, riskType: PRODUCTS_CONFIG.BCS.riskType },
  eas:     { pBaseBps: PRODUCTS_CONFIG.EAS.pBaseBps, riskType: PRODUCTS_CONFIG.EAS.riskType },
  depeg:   { pBaseBps: PRODUCTS_CONFIG.DEPEG.pBaseBps, riskType: PRODUCTS_CONFIG.DEPEG.riskType },
  il:      { pBaseBps: PRODUCTS_CONFIG.IL.pBaseBps, riskType: PRODUCTS_CONFIG.IL.riskType },
  exploit: { pBaseBps: PRODUCTS_CONFIG.EXPLOIT.pBaseBps, riskType: PRODUCTS_CONFIG.EXPLOIT.riskType },
}

// Use imported calcKinkMultiplier from lumina-config
const calcKinkMultiplier = calcKinkMultiplierFromConfig

// Deductibles per product (unchanged)
function getCalcDeductible(product: CalcProduct, stablecoin: string, protocol: string) {
  switch (product) {
    case "bcs": return 0.20
    case "eas": return 0.20
    case "depeg":
      if (stablecoin === "DAI") return 0.12
      if (stablecoin === "USDT") return 0.15
      return 0.10
    case "il": return 0.02
    case "exploit": return 0.10
  }
}

/* ─── Custom Dropdown (dark mode) ─── */
function CustomDropdown({ value, onChange, options, label }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const selectedLabel = options.find(o => o.value === value)?.label ?? value

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-xs text-white/70 uppercase tracking-wider font-medium mb-2">{label}</label>}
      <div
        onClick={() => setOpen(!open)}
        className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg px-4 py-3 text-sm text-white cursor-pointer flex justify-between items-center hover:border-white/20 transition-colors"
      >
        <span>{selectedLabel}</span>
        <svg
          className={`w-4 h-4 text-white/50 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-[#1A1A2E] border border-white/10 rounded-lg z-50 shadow-xl overflow-hidden">
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                opt.value === value
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "text-white hover:bg-cyan-500/10"
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PremiumCalculatorSection() {
  const [product, setProduct] = useState<CalcProduct>("bcs")
  const [coverage, setCoverage] = useState(10000)
  const [duration, setDuration] = useState(14)
  const [asset, setAsset] = useState("ETH")
  const [stablecoin, setStablecoin] = useState("USDT")
  const [protocol, setProtocol] = useState("Compound")
  const [vaultUtilizations, setVaultUtilizations] = useState<Record<string, number>>({
    bcs: 20, eas: 20, il: 20, depeg: 20, exploit: 20,
  })
  const [refreshing, setRefreshing] = useState(false)

  const refreshUtilization = () => {
    setRefreshing(true)
    fetch(`${PROTOCOL.apiBaseUrl}/api/v2/dashboard`)
      .then(res => res.json())
      .then(data => {
        if (data.vaults) {
          const addrMap: Record<string, string[]> = {
            [CONTRACTS.vaults.VolatileShort.toLowerCase()]: ["bcs", "eas", "il"],
            [CONTRACTS.vaults.StableShort.toLowerCase()]: ["depeg", "exploit"],
          }
          const utils: Record<string, number> = { bcs: 20, eas: 20, il: 20, depeg: 20, exploit: 20 }
          for (const v of data.vaults) {
            const products = addrMap[v.address?.toLowerCase()]
            if (products && !v.error) {
              const total = Number(v.totalAssets)
              const alloc = Number(v.allocatedAssets)
              const util = total > 0 ? Math.round((alloc / total) * 100) : 0
              for (const p of products) utils[p] = util
            }
          }
          setVaultUtilizations(utils)
        }
      })
      .catch(() => {})
      .finally(() => setRefreshing(false))
  }

  useEffect(() => { refreshUtilization() }, [])

  const [min, max, def] = CALC_DURATION_RANGES[product]

  const handleProductChange = (p: CalcProduct) => {
    setProduct(p)
    const [, , d] = CALC_DURATION_RANGES[p]
    setDuration(d)
  }

  // Clamp duration
  const clampedDuration = Math.min(Math.max(duration, min), max)

  const calculations = useMemo(() => {
    const utilizationPct = vaultUtilizations[product] || 20
    const { pBaseBps } = CALC_PRODUCT_CONFIG[product]
    const multiplier = calcKinkMultiplier(utilizationPct)
    // Mirror PremiumMath.sol: coverage * (pBaseBps/10000) * M(U) * (duration/365)
    const premium = coverage * (pBaseBps / 10000) * multiplier * (clampedDuration / 365)
    const feeRate = PROTOCOL.feeBps / 10000
    const premiumFee = premium * feeRate
    const deductible = getCalcDeductible(product, stablecoin, protocol)
    const maxPayout = coverage * (1 - deductible)
    const payoutFee = maxPayout * feeRate
    const netPayout = maxPayout - payoutFee
    const returnOnPremium = premium > 0 ? netPayout / premium : 0
    return { premium, premiumFee, maxPayout, payoutFee, netPayout, returnOnPremium }
  }, [product, coverage, clampedDuration, stablecoin, protocol, vaultUtilizations])

  const { premium, premiumFee, maxPayout, payoutFee, netPayout, returnOnPremium } = calculations

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 })
  const fmt2 = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <section className="py-24 px-4">
      <div id="calculator" className="scroll-mt-20" />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Premium Calculator
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          See exactly what your agent will pay and what you&apos;ll receive.
        </p>

        <div className="rounded-2xl bg-white/[0.02] border border-cyan-500/20 p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              {/* Product */}
              <CustomDropdown
                label="Product"
                value={product}
                onChange={(v) => handleProductChange(v as CalcProduct)}
                options={[
                  { value: "bcs", label: "BTC Catastrophe Shield" },
                  { value: "eas", label: "ETH Apocalypse Shield" },
                  { value: "depeg", label: "Depeg Shield" },
                  { value: "il", label: "IL Index Cover" },
                  { value: "exploit", label: "Exploit Shield" },
                ]}
              />

              {/* Coverage */}
              <div>
                <label className="block text-xs text-white/70 uppercase tracking-wider font-medium mb-2">
                  Coverage: ${fmt(coverage)}
                </label>
                <input
                  type="range" min={100} max={100000} step={100} value={coverage}
                  onChange={(e) => setCoverage(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/30 mt-1">
                  <span>$100</span><span>$100,000</span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs text-white/70 uppercase tracking-wider font-medium mb-2">
                  Duration: {clampedDuration} days
                </label>
                <input
                  type="range" min={min} max={max} step={1} value={clampedDuration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/30 mt-1">
                  <span>{min}d</span><span>{max}d</span>
                </div>
              </div>

              {/* Asset (BCS, EAS, IL) */}
              {(product === "bcs" || product === "eas" || product === "il") && (
                <CustomDropdown
                  label="Asset"
                  value={asset}
                  onChange={setAsset}
                  options={[
                    { value: "ETH", label: "ETH" },
                    { value: "BTC", label: "BTC" },
                  ]}
                />
              )}

              {/* Stablecoin (Depeg) */}
              {product === "depeg" && (
                <CustomDropdown
                  label="Stablecoin"
                  value={stablecoin}
                  onChange={setStablecoin}
                  options={[
                    { value: "USDT", label: "USDT" },
                    { value: "DAI", label: "DAI" },
                  ]}
                />
              )}

              {/* Protocol (Exploit) */}
              {product === "exploit" && (
                <CustomDropdown
                  label="Protocol"
                  value={protocol}
                  onChange={setProtocol}
                  options={[
                    { value: "Compound", label: "Compound III (Tier 1)" },
                    { value: "Uniswap", label: "Uniswap v3 (Tier 1)" },
                    { value: "MakerDAO", label: "MakerDAO (1.1x)" },
                    { value: "Curve", label: "Curve (1.5x)" },
                    { value: "Morpho", label: "Morpho (1.8x)" },
                  ]}
                />
              )}
            </div>

            {/* Results */}
            <div key={product} className="space-y-4">
              {/* Row 1: Premium */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Premium</div>
                  <div className="text-lg font-bold text-white">${fmt2(premium)}</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Protocol Fee (3%)</div>
                  <div className="text-lg font-bold text-white/60">${fmt2(premiumFee)}</div>
                </div>
              </div>

              {/* Row 2: Payout */}
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.03] p-4">
                <div className="text-xs text-white/40 uppercase tracking-wider font-medium mb-3">If Triggered</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-white/30 mb-1">Gross Payout</div>
                    <div className="text-sm font-semibold text-white/70">${fmt(maxPayout)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/30 mb-1">Fee (3%)</div>
                    <div className="text-sm font-semibold text-white/70">-${fmt2(payoutFee)}</div>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-3 flex items-end justify-between">
                  <div>
                    <div className="text-xs text-white/30 mb-1">Net Payout (you receive)</div>
                    <div className="text-2xl font-bold text-cyan-400">${fmt(netPayout)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/30 mb-1">Return on Premium</div>
                    <div className="text-xl font-bold text-cyan-400">{fmt(returnOnPremium)}x</div>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-white/30 leading-relaxed">
                  Calculated at {vaultUtilizations[product] || 20}% vault utilization (live). Premiums adjust via the Kink Model.
                </p>
                <button
                  onClick={refreshUtilization}
                  disabled={refreshing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all disabled:opacity-50 flex-shrink-0 ml-3"
                >
                  <span className={refreshing ? "animate-spin" : ""}>{"\u21BB"}</span>
                  <span>{refreshing ? "Updating..." : "Refresh rates"}</span>
                </button>
              </div>

              {/* CTA */}
              <div className="text-center pt-2">
                <a
                  href="/LUMINA-SKILL.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
                >
                  Give This Skill To Your Agent →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  VAULTS SECTION                                           */
/* ═══════════════════════════════════════════════════════════ */

const VAULTS = [
  {
    name: "Volatile Short",
    symbol: "lvsUSDC",
    cooldown: "37 days",
    apy: "4-17%",
    base: "Aave V3",
    premiums: "4-17%",
    backs: ["BCS 7-30d", "EAS 7-30d", "IL Index 14-30d"],
    risk: "Higher",
    riskColor: "text-red-400",
    bestFor: "Quick access traders who want short commitment",
    technicalDetails: [
      ["Contract", "VolatileShortVault.sol"],
      ["Standard", "ERC-4626 with soulbound shares (non-transferable)"],
      ["Cooldown", "37 days exit notice (NOT a lock)"],
      ["Max Allocation", "20% of vault TVL per product"],
      ["Waterfall", "First choice for BCS 7-30d, EAS 7-30d and IL 14-30d"],
      ["During Cooldown", "Capital still earns from existing policies, no new policies assigned"],
      ["Withdrawal", "requestWithdrawal() → wait 37d → completeWithdrawal()"],
      ["Cancel", "cancelWithdrawal() returns to full availability"],
      ["USDC Yield", "Dynamic rate from Aave V3 lending on Base, independent of Lumina"],
      ["Premium Yield", "Dynamic, depends on # of policies and Kink multiplier"],
      ["Worst Case", "BCS/EAS crash + IL spike = ~30% TVL loss in a month (5-10yr event)"],
    ],
  },
  {
    name: "Volatile Long",
    symbol: "lvlUSDC",
    cooldown: "97 days",
    apy: "4-21%",
    base: "Aave V3",
    premiums: "4-21%",
    backs: ["IL Index 60-90d", "BCS overflow", "EAS overflow"],
    risk: "Higher",
    riskColor: "text-red-400",
    bestFor: "Balanced investors who want higher yield",
    technicalDetails: [
      ["Contract", "VolatileLongVault.sol"],
      ["Standard", "ERC-4626 with soulbound shares (non-transferable)"],
      ["Cooldown", "97 days exit notice"],
      ["Waterfall", "Receives overflow when VolatileShort is full (>95% utilized)"],
      ["Backs", "IL 60-90d policies and BCS/EAS when Short vault is >95% utilized"],
      ["Higher Yield", "Longer commitment = longer policies = more premium per dollar"],
      ["Withdrawal", "requestWithdrawal() → wait 97d → completeWithdrawal()"],
      ["Worst Case", "Same risk type as VolatileShort but longer lock = higher yield compensation"],
    ],
  },
  {
    name: "Stable Short",
    symbol: "lssUSDC",
    cooldown: "97 days",
    apy: "3-9%",
    base: "Aave V3",
    premiums: "3-9%",
    backs: ["Depeg Shield 14-90d"],
    risk: "Low",
    riskColor: "text-green-400",
    bestFor: "Conservative investors",
    technicalDetails: [
      ["Contract", "StableShortVault.sol"],
      ["Standard", "ERC-4626 with soulbound shares (non-transferable)"],
      ["Cooldown", "97 days exit notice"],
      ["Restriction", "Cannot back Exploit Shield (90d policy + 14d waiting = 104d > 97d cooldown)"],
      ["Only Backs", "Depeg Shield 14-90d"],
      ["Claim Risk", "Lower — stablecoin depegs are rare (2-3 per decade)"],
      ["Withdrawal", "requestWithdrawal() → wait 97d → completeWithdrawal()"],
      ["Worst Case", "Major depeg like USDC March 2023 (went to $0.87) = ~20% TVL loss"],
    ],
  },
  {
    name: "Stable Long",
    symbol: "lslUSDC",
    cooldown: "372 days",
    apy: "3-10%",
    base: "Aave V3",
    premiums: "3-10%",
    backs: ["Depeg 365d", "Exploit Shield 90-365d"],
    risk: "Very low",
    riskColor: "text-green-400",
    bestFor: "Institutions, DAOs, family offices — set and forget",
    technicalDetails: [
      ["Contract", "StableLongVault.sol"],
      ["Standard", "ERC-4626 with soulbound shares (non-transferable)"],
      ["Cooldown", "372 days exit notice — longest commitment, highest yield"],
      ["Monopoly", "ONLY vault that can back annual Depeg policies and Exploit Shield"],
      ["Advantage", "Monopoly on long-term premiums → highest APY"],
      ["Target", "Institutional LPs, DAO treasuries, family offices"],
      ["Exploit Risk", "Extremely rare: dual trigger + 14d waiting + $50K cap"],
      ["Withdrawal", "requestWithdrawal() → wait 372d → completeWithdrawal()"],
      ["Worst Case", "Simultaneous depeg + exploit = ~25% TVL loss (once per decade)"],
    ],
  },
]

function VaultsSection() {
  const [modalVault, setModalVault] = useState<string | null>(null)
  const modalData = VAULTS.find((v) => v.symbol === modalVault)

  return (
    <section className="py-24 px-4">
      <div id="vaults" className="scroll-mt-20" />
      <div className="max-w-6xl mx-auto rounded-2xl bg-white/[0.02] border border-purple-500/20 shadow-[0_-2px_20px_rgba(139,92,246,0.05)] overflow-hidden">
        <div className="h-[3px] w-full bg-gradient-to-r from-purple-500 to-transparent" />
        <div className="p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-purple-400">
          Yield Vaults
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          Four vaults. Each backs different products with different risk and cooldown.
        </p>

        {/* Vault cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {VAULTS.map((v) => (
            <motion.div
              key={v.symbol}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <div className="rounded-2xl bg-white/[0.02] border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 p-6 flex flex-col h-full">
                {/* APY */}
                <div className="min-h-[120px]">
                  <div>
                    <span className="text-3xl font-bold text-purple-400">{v.apy}</span>
                    <span className="text-sm text-white/40 ml-2">APY</span>
                  </div>
                  <p className="text-sm text-white/50">
                    {v.base} + Premiums {v.premiums}
                  </p>
                  <p className="text-xs text-white/30">Range reflects 20-90% utilization via Kink Model</p>
                </div>

                {/* Name + Symbol */}
                <div className="min-h-[70px]">
                  <h3 className="text-lg font-semibold mb-1">{v.name}</h3>
                  <span className="text-xs font-mono text-purple-400/60">{v.symbol}</span>
                  <span className="ml-2 bg-[rgba(182,80,158,0.1)] border border-[rgba(182,80,158,0.3)] text-[#B6509E] text-[11px] px-2 py-0.5 rounded">Aave V3</span>
                </div>

                {/* Cooldown */}
                <div className="flex items-center gap-2 text-sm text-white/60 min-h-[40px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Cooldown: {v.cooldown}
                </div>

                {/* Backs */}
                <div className="min-h-[80px]">
                  <span className="text-xs uppercase tracking-wider text-white/30 font-medium block mb-1">Backs</span>
                  <div className="flex flex-wrap gap-1">
                    {v.backs.map((b) => (
                      <span key={b} className="text-xs bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full">{b}</span>
                    ))}
                  </div>
                </div>

                {/* Risk */}
                <div className="min-h-[30px]">
                  <span className="text-xs uppercase tracking-wider text-white/30 font-medium block mb-1">Risk</span>
                  <span className={`text-sm font-medium ${v.riskColor}`}>{v.risk}</span>
                </div>

                {/* Best for */}
                <p className="text-sm text-white/40 italic min-h-[50px] mt-3">{v.bestFor}</p>

                {/* Technical Details button */}
                <div className="mt-auto pt-4">
                  <button
                    onClick={() => setModalVault(v.symbol)}
                    className="flex items-center gap-2 text-xs text-white/40 hover:text-white/60 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    Technical Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Details Modal */}
        <AnimatePresence>
          {modalData && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalVault(null)}
            >
              <motion.div
                className="bg-[#12121A] border border-purple-500/40 rounded-2xl p-8 max-w-lg mx-4 max-h-[80vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">{modalData.name} <span className="text-sm font-mono text-purple-400/60 ml-2">{modalData.symbol}</span></h3>
                  <button onClick={() => setModalVault(null)} className="text-white/40 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
                <div className="space-y-3">
                  {modalData.technicalDetails.map(([label, value]) => (
                    <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                      <span className="text-xs uppercase tracking-wider text-white/40 sm:w-44 shrink-0 font-medium">{label}</span>
                      <span className="text-sm text-white/70">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cooldown explainer */}
        <div className="bg-white/[0.03] border border-purple-500/10 rounded-xl p-6 mb-10">
          <h3 className="text-xl font-semibold mb-4">What is a Cooldown?</h3>
          <div className="space-y-3 text-[15px] text-white/60 leading-relaxed">
            <p>
              Cooldown is <span className="text-white font-medium">NOT a lock period</span>. It&apos;s an <span className="text-white font-medium">EXIT NOTICE</span>.
            </p>
            <p>
              Think of it like renting an apartment: you move in (deposit) and live there as long as you want (earn yield). One day you decide to move out (request withdrawal). You give 37 days notice (cooldown). After 37 days, you leave with your deposit + everything you earned.
            </p>
            <p>
              Why? Because your money backs insurance policies. If everyone could withdraw instantly during a crash, the policies would have no collateral.
            </p>
            <p>
              Your money keeps earning during the cooldown. The only change is that no NEW policies are assigned to your capital.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="/LUMINA-SKILL.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-all"
          >
            Give Your Agent the Skill →
          </a>
        </div>
      </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  YIELD CALCULATOR SECTION                                 */
/* ═══════════════════════════════════════════════════════════ */

type YieldVaultKey = "volatile-short" | "volatile-long" | "stable-short" | "stable-long"

const YIELD_VAULTS: Record<YieldVaultKey, {
  label: string
  cooldown: number
  productId: string
  products: string
  risk: string
  worstCase: number
}> = {
  "volatile-short": { label: "Volatile Short", cooldown: 37, productId: "BCS-001", products: "BCS + EAS + IL Index", risk: "Higher", worstCase: 0.30 },
  "volatile-long": { label: "Volatile Long", cooldown: 97, productId: "ILPROT-001", products: "IL Index + BCS/EAS overflow", risk: "Higher", worstCase: 0.28 },
  "stable-short": { label: "Stable Short", cooldown: 97, productId: "DEPEG-USDC-001", products: "Depeg + Exploit Shield", risk: "Low", worstCase: 0.20 },
  "stable-long": { label: "Stable Long", cooldown: 372, productId: "DEPEG-USDT-001", products: "Depeg + Exploit Shield", risk: "Very Low", worstCase: 0.25 },
}

function YieldCalculatorSection() {
  const aaveYield = useAaveYield()
  const [vault, setVault] = useState<YieldVaultKey>("volatile-short")
  const [deposit, setDeposit] = useState(10000)
  const [realUtilizations, setRealUtilizations] = useState<Record<string, number>>({
    "volatile-short": 20, "volatile-long": 20, "stable-short": 20, "stable-long": 20,
  })
  const [refreshingYield, setRefreshingYield] = useState(false)

  const refreshYieldUtilization = () => {
    setRefreshingYield(true)
    fetch(`${PROTOCOL.apiBaseUrl}/api/v2/dashboard`)
      .then(res => res.json())
      .then(data => {
        if (data.vaults) {
          const map: Record<string, string> = {
            [CONTRACTS.vaults.VolatileShort.toLowerCase()]: "volatile-short",
            [CONTRACTS.vaults.VolatileLong.toLowerCase()]: "volatile-long",
            [CONTRACTS.vaults.StableShort.toLowerCase()]: "stable-short",
            [CONTRACTS.vaults.StableLong.toLowerCase()]: "stable-long",
          }
          const utils: Record<string, number> = { "volatile-short": 20, "volatile-long": 20, "stable-short": 20, "stable-long": 20 }
          for (const v of data.vaults) {
            const key = map[v.address?.toLowerCase()]
            if (key && !v.error) {
              const total = Number(v.totalAssets)
              const alloc = Number(v.allocatedAssets)
              utils[key] = total > 0 ? Math.round((alloc / total) * 100) : 0
            }
          }
          setRealUtilizations(utils)
        }
      })
      .catch(() => {})
      .finally(() => setRefreshingYield(false))
  }

  useEffect(() => { refreshYieldUtilization() }, [])

  const v = YIELD_VAULTS[vault]
  const utilization = realUtilizations[vault]

  const calculations = useMemo(() => {
    const vaultData = YIELD_VAULTS[vault]
    const util = realUtilizations[vault]
    const result = calculateYield({ productId: vaultData.productId, depositAmount: deposit, utilizationPct: util })
    const aaveBaseYield = (aaveYield || 3.5) / 100
    const monthlyBase = deposit * aaveBaseYield / 12
    const monthlyPremium = (result.netYield - deposit * aaveBaseYield) / 12
    const monthlyTotal = result.netYield / 12
    const annualBase = deposit * aaveBaseYield
    const annualPremium = result.netYield - annualBase
    const annualTotal = result.netYield
    const totalAPY = result.apyEstimate / 100
    const avgPremiumAPY = totalAPY - aaveBaseYield
    return { totalAPY, avgPremiumAPY, monthlyBase, monthlyPremium, monthlyTotal, annualBase, annualPremium, annualTotal }
  }, [vault, deposit, realUtilizations, aaveYield])

  const { totalAPY, avgPremiumAPY, monthlyBase, monthlyPremium, monthlyTotal, annualBase, annualPremium, annualTotal } = calculations

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 })
  const fmt2 = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <section className="py-24 px-4">
      <div id="yield-calculator" className="scroll-mt-20" />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Yield Calculator
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          See what your agent can earn by providing liquidity.
        </p>

        <div className="rounded-2xl bg-white/[0.02] border border-purple-500/20 p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              {/* Vault */}
              <CustomDropdown
                label="Vault"
                value={vault}
                onChange={(val) => setVault(val as YieldVaultKey)}
                options={[
                  { value: "volatile-short", label: "Volatile Short" },
                  { value: "volatile-long", label: "Volatile Long" },
                  { value: "stable-short", label: "Stable Short" },
                  { value: "stable-long", label: "Stable Long" },
                ]}
              />

              {/* Deposit */}
              <div>
                <label className="block text-xs text-white/70 uppercase tracking-wider font-medium mb-2">
                  Deposit: ${fmt(deposit)}
                </label>
                <input
                  type="range" min={100} max={100000} step={100} value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full accent-purple-400 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/30 mt-1">
                  <span>$100</span><span>$100,000</span>
                </div>
              </div>

              {/* Utilization (live) */}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-white/30 leading-relaxed">
                  Current Pool Utilization: <span className="text-cyan-400 font-mono font-semibold">{utilization}%</span> (live)
                </p>
                <button
                  onClick={refreshYieldUtilization}
                  disabled={refreshingYield}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50 transition-all disabled:opacity-50 flex-shrink-0 ml-3"
                >
                  <span className={refreshingYield ? "animate-spin" : ""}>{"\u21BB"}</span>
                  <span>{refreshingYield ? "Updating..." : "Refresh rates"}</span>
                </button>
              </div>

              {/* Indefinite deposit explanation */}
              <div className="rounded-xl bg-white/[0.02] border border-purple-500/10 p-5">
                <p className="text-sm text-white/60 leading-relaxed mb-5">
                  Your deposit earns yield <span className="text-white font-medium">INDEFINITELY</span>. There is no fixed term.<br />
                  When you decide to leave:
                </p>

                {/* Mini-timeline */}
                <div className="relative flex items-start justify-between px-2">
                  {/* Connecting line */}
                  <div className="absolute top-[7px] left-[18px] right-[18px] h-[2px] bg-purple-500/30" />

                  {/* Point 1 */}
                  <div className="relative flex flex-col items-center text-center w-1/3">
                    <div className="w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-purple-400 z-10" />
                    <span className="text-xs font-semibold text-purple-400 mt-2">Deposit</span>
                    <span className="text-[10px] text-white/30 mt-0.5">Today</span>
                    <span className="text-[10px] text-white/40 mt-0.5">Start earning</span>
                  </div>

                  {/* Point 2 */}
                  <div className="relative flex flex-col items-center text-center w-1/3">
                    <div className="w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-purple-400 z-10" />
                    <span className="text-xs font-semibold text-purple-400 mt-2">Request Exit</span>
                    <span className="text-[10px] text-white/30 mt-0.5">When you decide</span>
                    <span className="text-[10px] text-white/40 mt-0.5">Cooldown starts</span>
                    <span className="text-[10px] text-white/30 mt-0.5">(still earning)</span>
                  </div>

                  {/* Point 3 */}
                  <div className="relative flex flex-col items-center text-center w-1/3">
                    <div className="w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-purple-400 z-10" />
                    <span className="text-xs font-semibold text-purple-400 mt-2">Withdraw</span>
                    <span className="text-[10px] text-white/30 mt-0.5">+ {v.cooldown} days later</span>
                    <span className="text-[10px] text-white/40 mt-0.5">Get principal + yield</span>
                  </div>
                </div>

                <div className="mt-5 space-y-1">
                  <p className="text-xs text-white/40">Cooldown for {v.label}: <span className="text-white/60 font-medium">{v.cooldown} days</span></p>
                  <p className="text-xs text-white/40">During cooldown you <span className="text-white/60 font-medium">KEEP earning</span> from existing policies.</p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div key={vault} className="space-y-4">
              {/* Row 1: Monthly & Annual */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Monthly Yield</div>
                  <div className="text-xl font-bold text-purple-400">${fmt2(monthlyTotal)}</div>
                  <div className="text-xs text-white/30 mt-1">Aave ${fmt2(monthlyBase)} + Premiums ${fmt2(monthlyPremium)}</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Annual Yield</div>
                  <div className="text-2xl font-bold text-purple-400">${fmt(annualTotal)}</div>
                  <div className="text-xs text-white/30 mt-1">Aave ${fmt(annualBase)} + Premiums ${fmt(annualPremium)}</div>
                </div>
              </div>

              {/* Row 2: APY & Exit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.03] p-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Effective APY</div>
                  <div className="text-2xl font-bold text-purple-400">{(totalAPY * 100).toFixed(1)}%</div>
                  <div className="text-xs text-white/30 mt-1">Aave V3 + Premiums ~{(avgPremiumAPY * 100).toFixed(0)}%</div>
                </div>
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.03] p-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Exit Timeline</div>
                  <div className="text-2xl font-bold text-purple-400">{v.cooldown}d notice</div>
                  <div className="text-xs text-white/30 mt-1">Deposit is indefinite. This is the exit notice required.</div>
                </div>
              </div>

              {/* Row 3: Vault info */}
              <div className="rounded-xl bg-white/[0.02] border border-white/10 p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/40">Vault</span><span className="text-white/70">{v.label}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Cooldown</span><span className="text-white/70">{v.cooldown} days</span></div>
                <div className="flex justify-between"><span className="text-white/40">Products Backed</span><span className="text-white/70">{v.products}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Claim Risk</span><span className="text-white/70">{v.risk}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Worst Case Loss (once per 5-10yr)</span><span className="text-white/70">~{(v.worstCase * 100).toFixed(0)}% of deposit</span></div>
              </div>

              {/* Risk Scenarios */}
              <RiskScenariosSection vaultKey={vault} deposit={deposit} monthlyTotal={monthlyTotal} annualTotal={annualTotal} />

              {/* Warning */}
              <p className="text-xs text-white/30 leading-relaxed">
                Calculated using Lumina&apos;s Dynamic Kink Model at {utilization}% utilization. Actual APY depends on real-time pool utilization. The base yield comes from Aave V3 USDC lending on Base. Premium yield depends on insurance policy volume.
              </p>

              {/* CTA */}
              <div className="text-center pt-2">
                <a
                  href="/LUMINA-SKILL.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-all"
                >
                  Give Your Agent the Skill →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Risk Scenarios ─── */

const RISK_SCENARIOS: Record<YieldVaultKey, {
  name: string
  probability: string
  description: string
  lossPct: number
  color: "green" | "amber" | "red"
}[]> = {
  "volatile-short": [
    { name: "Normal Year", probability: "85%", description: "No major crashes. Premiums exceed claims. You earn the full estimated yield.", lossPct: 0, color: "green" },
    { name: "Market Crash", probability: "12%", description: "ETH/BTC drops 35%. BCS/EAS claims trigger. Vault loses ~15% of TVL in one month.", lossPct: 0.15, color: "amber" },
    { name: "Catastrophic Event", probability: "3%", description: "ETH drops 60%+ or BTC drops 50%+ AND IL spikes simultaneously. Multiple claims trigger.", lossPct: 0.30, color: "red" },
  ],
  "volatile-long": [
    { name: "Normal Year", probability: "85%", description: "No major crashes. Premiums exceed claims. You earn the full estimated yield.", lossPct: 0, color: "green" },
    { name: "Market Crash", probability: "12%", description: "ETH/BTC drops 35%. IL + BCS/EAS overflow claims trigger against the vault.", lossPct: 0.15, color: "amber" },
    { name: "Catastrophic Event", probability: "3%", description: "Severe market downturn with cascading IL and BCS/EAS claims.", lossPct: 0.28, color: "red" },
  ],
  "stable-short": [
    { name: "Normal Year", probability: "97%", description: "No depeg events. Premiums exceed claims. You earn the full estimated yield.", lossPct: 0, color: "green" },
    { name: "Stablecoin Wobble", probability: "2.5%", description: "A stablecoin briefly depegs 2-5%. Some claims trigger but recover quickly.", lossPct: 0.10, color: "amber" },
    { name: "Full Depeg (SVB/USDC Mar 2023)", probability: "0.5%", description: "A major depeg event like USDC during SVB collapse. Significant claims trigger.", lossPct: 0.20, color: "red" },
  ],
  "stable-long": [
    { name: "Normal Year", probability: "98%", description: "No depeg or exploit events. Premiums exceed claims. Full estimated yield.", lossPct: 0, color: "green" },
    { name: "Depeg Event", probability: "1.5%", description: "A stablecoin depegs. Claims trigger but high premium income offsets losses.", lossPct: 0.12, color: "amber" },
    { name: "Depeg + Exploit Simultaneous", probability: "0.5%", description: "A depeg event coincides with a protocol exploit. Multiple claim types trigger.", lossPct: 0.25, color: "red" },
  ],
}

function RiskScenariosSection({ vaultKey, deposit, monthlyTotal, annualTotal }: { vaultKey: YieldVaultKey; deposit: number; monthlyTotal: number; annualTotal: number }) {
  const scenarios = RISK_SCENARIOS[vaultKey]
  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 })

  const colorMap = {
    green: { border: "border-green-500/30", text: "text-green-400", bg: "bg-green-500/5" },
    amber: { border: "border-amber-500/30", text: "text-amber-400", bg: "bg-amber-500/5" },
    red: { border: "border-red-500/30", text: "text-red-400", bg: "bg-red-500/5" },
  }

  return (
    <div className="rounded-xl bg-white/[0.02] border border-amber-500/20 p-6">
      <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4">&#9888;&#65039; Risk Scenarios — What Could Go Wrong</h4>
      <div className="space-y-3">
        {scenarios.map((s) => {
          const loss = deposit * s.lossPct
          const recoveryMonths = monthlyTotal > 0 && loss > 0 ? Math.ceil(loss / monthlyTotal) : 0
          const c = colorMap[s.color]
          return (
            <div key={s.name} className={`rounded-lg border ${c.border} ${c.bg} p-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${c.text}`}>{s.name}</span>
                  <span className="text-xs text-white/30">({s.probability} probability)</span>
                </div>
                <div className="text-right">
                  {s.lossPct === 0 ? (
                    <span className="text-sm font-bold text-green-400">Gain: +${fmt(annualTotal)}</span>
                  ) : (
                    <span className={`text-sm font-semibold ${c.text}`}>Potential Loss: -${fmt(loss)}</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">{s.description}</p>
              {s.lossPct === 0 && (
                <p className="text-xs text-green-400/70 mt-1">Your deposit grows to ${fmt(deposit + annualTotal)} after 12 months.</p>
              )}
              {recoveryMonths > 0 && (
                <p className="text-xs text-white/40 mt-1">Recovery Time: ~{recoveryMonths} month{recoveryMonths !== 1 ? "s" : ""} of yield</p>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-xs text-white/25 leading-relaxed mt-4">
        These scenarios are estimates based on historical DeFi events and actuarial modeling. Past events do not guarantee future outcomes. The Kink Model and protocol safeguards (EIP-712 proofs, circuit breakers, dual triggers) significantly reduce claim probability.
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  KINK MODEL EXPLAINER                                     */
/* ═══════════════════════════════════════════════════════════ */

function getMultiplier(u: number): number {
  // Base rate = 0.05, slope1 = 0.0063 (0-80%), slope2 = 0.075 (80-95%)
  if (u <= 80) return 1.0 + (u / 80) * 0.5
  if (u <= 95) return 1.5 + ((u - 80) / 15) * 1.125
  return 2.625
}

const KINK_TABLE = [
  { range: "0–20%", mult: "1.0–1.13x", meaning: "Cheapest premiums. Few policies sold." },
  { range: "20–40%", mult: "1.13–1.25x", meaning: "Normal operation." },
  { range: "40–60%", mult: "1.25–1.38x", meaning: "Healthy demand. Good LP yields." },
  { range: "60–80%", mult: "1.38–1.50x", meaning: "High demand. LPs earning well." },
  { range: "80–90%", mult: "1.50–2.25x", meaning: "Stress zone. Premiums spike. Attracts new LPs." },
  { range: "90–95%", mult: "2.25–3.75x", meaning: "Near capacity. Very expensive premiums." },
  { range: ">95%", mult: "REJECTED", meaning: "No new policies. Safety mechanism to protect LP capital." },
]

function KinkModelSection({ perspective }: { perspective: Perspective }) {
  const [utilization, setUtilization] = useState(40)
  const accent = perspective === "protect" ? "cyan" : "purple"
  const accentColor = accent === "cyan" ? "#22d3ee" : "#a855f7"
  const borderClass = accent === "cyan" ? "border-cyan-500/20" : "border-purple-500/20"
  const textAccent = accent === "cyan" ? "text-cyan-400" : "text-purple-400"

  const multiplier = getMultiplier(utilization)

  // SVG dimensions
  const W = 600, H = 280, PAD_L = 55, PAD_R = 20, PAD_T = 20, PAD_B = 40
  const gW = W - PAD_L - PAD_R, gH = H - PAD_T - PAD_B

  const toX = (u: number) => PAD_L + (u / 100) * gW
  const toY = (m: number) => PAD_T + gH - ((m - 1.0) / 2.0) * gH

  // Build curve path
  const points: string[] = []
  for (let u = 0; u <= 95; u++) {
    const m = getMultiplier(u)
    points.push(`${u === 0 ? "M" : "L"}${toX(u).toFixed(1)},${toY(m).toFixed(1)}`)
  }
  const curvePath = points.join(" ")

  // Dot position
  const dotX = toX(utilization)
  const dotY = toY(multiplier)

  // Grid lines (Y axis: 1.0, 1.5, 2.0, 2.5, 3.0)
  const yTicks = [1.0, 1.5, 2.0, 2.5, 3.0]
  // X axis ticks
  const xTicks = [0, 20, 40, 60, 80, 95]

  return (
    <section className="py-24 px-4">
      <div id="kink-model" className="scroll-mt-20" />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          How Pricing Works
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          Dynamic premiums — when demand rises, prices rise automatically. When it drops, they drop too.
        </p>

        <div className={`rounded-2xl bg-white/[0.02] border ${borderClass} p-6 md:p-8`}>
          {/* SVG Chart */}
          <div className="w-full overflow-x-auto mb-6">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px] mx-auto" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              {yTicks.map(t => (
                <g key={t}>
                  <line x1={PAD_L} y1={toY(t)} x2={W - PAD_R} y2={toY(t)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <text x={PAD_L - 8} y={toY(t) + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="11">{t.toFixed(1)}x</text>
                </g>
              ))}
              {xTicks.map(t => (
                <g key={t}>
                  <line x1={toX(t)} y1={PAD_T} x2={toX(t)} y2={H - PAD_B} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <text x={toX(t)} y={H - PAD_B + 16} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11">{t}%</text>
                </g>
              ))}

              {/* Rejected zone (>95%) */}
              <rect x={toX(95)} y={PAD_T} width={W - PAD_R - toX(95)} height={gH} fill="rgba(239,68,68,0.08)" />
              <text x={toX(97.5)} y={PAD_T + gH / 2} textAnchor="middle" fill="rgba(239,68,68,0.5)" fontSize="10" fontWeight="bold" transform={`rotate(-90, ${toX(97.5)}, ${PAD_T + gH / 2})`}>REJECTED</text>

              {/* Kink point marker at 80% */}
              <line x1={toX(80)} y1={PAD_T} x2={toX(80)} y2={H - PAD_B} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />

              {/* Curve */}
              <path d={curvePath} fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />

              {/* Kink point dot + label */}
              <circle cx={toX(80)} cy={toY(1.5)} r="4" fill={accentColor} />
              <text x={toX(80) + 8} y={toY(1.5) - 8} fill="rgba(255,255,255,0.5)" fontSize="10">Kink Point</text>

              {/* Interactive dot */}
              <circle cx={dotX} cy={dotY} r="6" fill={accentColor} stroke="white" strokeWidth="2" />

              {/* Axis labels */}
              <text x={W / 2} y={H - 2} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11">Vault Utilization</text>
              <text x={12} y={H / 2} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" transform={`rotate(-90, 12, ${H / 2})`}>Premium Multiplier</text>
            </svg>
          </div>

          {/* Slider */}
          <div className="max-w-md mx-auto mb-8">
            <label className="block text-xs text-white/70 uppercase tracking-wider font-medium mb-2">Simulate Utilization</label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <input
                type="range" min={0} max={95} step={1} value={utilization}
                onChange={(e) => setUtilization(Number(e.target.value))}
                className={`flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer ${accent === "cyan" ? "accent-cyan-400" : "accent-purple-400"}`}
              />
              <div className="text-sm text-white/70 whitespace-nowrap text-center sm:text-right">
                Utilization: <span className={`${textAccent} font-semibold`}>{utilization}%</span> → Multiplier: <span className={`${textAccent} font-semibold`}>{multiplier.toFixed(2)}x</span>
              </div>
            </div>
          </div>

          {/* Reference Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 uppercase tracking-wider font-medium py-2 px-3">Utilization</th>
                  <th className="text-left text-xs text-white/40 uppercase tracking-wider font-medium py-2 px-3">Multiplier</th>
                  <th className="text-left text-xs text-white/40 uppercase tracking-wider font-medium py-2 px-3">What it means</th>
                </tr>
              </thead>
              <tbody>
                {KINK_TABLE.map((row) => (
                  <tr key={row.range} className="border-b border-white/5">
                    <td className="py-2.5 px-3 text-white/70 font-medium">{row.range}</td>
                    <td className={`py-2.5 px-3 font-semibold ${row.mult === "REJECTED" ? "text-red-400" : textAccent}`}>{row.mult}</td>
                    <td className="py-2.5 px-3 text-white/50">{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Perspective-specific explainer */}
          <div className="space-y-3">
            {perspective === "protect" ? (
              <p className="text-sm text-white/50 leading-relaxed">
                When vault utilization is low, your agent gets cheap premiums. When it&apos;s high, premiums increase — but so does the probability that your coverage is backed by real capital. The Kink Model ensures the protocol is always solvent.
              </p>
            ) : (
              <p className="text-sm text-white/50 leading-relaxed">
                When utilization rises, premiums rise — which means YOUR yield rises. If a vault hits 85%+ utilization, the APY can spike to 30-40%. This naturally attracts new LPs who deposit and bring utilization back down. The market self-balances.
              </p>
            )}
            <p className="text-xs text-white/30 leading-relaxed">
              &#9888;&#65039; The 95% cap is NOT a system failure — it&apos;s a SAFETY MECHANISM. It ensures there is ALWAYS enough capital in the vault to pay existing claims. As policies expire and capacity frees up, new policies are accepted again.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  AGENT SKILLS SECTION                                     */
/* ═══════════════════════════════════════════════════════════ */

function CopyButton({ text, accent }: { text: string; accent: "cyan" | "purple" }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const bg = accent === "cyan" ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400" : "bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
  return (
    <button onClick={handleCopy} className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${bg}`}>
      {copied ? "Copied!" : "📋 COPY"}
    </button>
  )
}

function AgentSkillsSection({ perspective, onStartSetup }: { perspective: Perspective; onStartSetup: () => void }) {
  const accent = perspective === "protect" ? "cyan" : "purple"
  const borderAccent = accent === "cyan" ? "border-cyan-500/20" : "border-purple-500/20"
  const textAccent = accent === "cyan" ? "text-cyan-400" : "text-purple-400"
  const checkColor = accent === "cyan" ? "text-cyan-400" : "text-purple-400"

  const skillUrl = "lumina-org.com/SKILL-V3.0.md"
  const githubUrl = "lumina-org.com/LUMINA-SKILL.txt"

  const hl = (text: string) => {
    const cls = accent === "cyan"
      ? "text-cyan-300 bg-cyan-500/10 px-1 rounded"
      : "text-purple-300 bg-purple-500/10 px-1 rounded"
    return <span className={cls}>{text}</span>
  }

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

        {/* 3-Step Visual */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-white mb-2">Set up insurance in 3 steps</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${accent === "cyan" ? "bg-cyan-500/5 border-cyan-500/20" : "bg-purple-500/5 border-purple-500/20"} border rounded-xl p-6 text-center`}>
            <div className={`w-9 h-9 rounded-full ${accent === "cyan" ? "bg-cyan-500" : "bg-purple-500"} text-[#0a0a1a] flex items-center justify-center font-bold mx-auto mb-3`}>1</div>
            <h4 className={`${accent === "cyan" ? "text-cyan-400" : "text-purple-400"} font-semibold mb-2`}>Get your API Key</h4>
            <p className="text-white/50 text-sm">Connect your wallet and generate an API key in the tutorial. This is your agent&apos;s authorization.</p>
          </div>
          <div className={`${accent === "cyan" ? "bg-cyan-500/5 border-cyan-500/20" : "bg-purple-500/5 border-purple-500/20"} border rounded-xl p-6 text-center`}>
            <div className={`w-9 h-9 rounded-full ${accent === "cyan" ? "bg-cyan-500" : "bg-purple-500"} text-[#0a0a1a] flex items-center justify-center font-bold mx-auto mb-3`}>2</div>
            <h4 className={`${accent === "cyan" ? "text-cyan-400" : "text-purple-400"} font-semibold mb-2`}>Give the SKILL file</h4>
            <p className="text-white/50 text-sm">Download the SKILL file and paste it into your AI agent (ChatGPT, Claude, or custom).</p>
          </div>
          <div className={`${accent === "cyan" ? "bg-cyan-500/5 border-cyan-500/20" : "bg-purple-500/5 border-purple-500/20"} border rounded-xl p-6 text-center`}>
            <div className={`w-9 h-9 rounded-full ${accent === "cyan" ? "bg-cyan-500" : "bg-purple-500"} text-[#0a0a1a] flex items-center justify-center font-bold mx-auto mb-3`}>3</div>
            <h4 className={`${accent === "cyan" ? "text-cyan-400" : "text-purple-400"} font-semibold mb-2`}>{perspective === "protect" ? "Your agent buys coverage" : "Your agent deposits USDC"}</h4>
            <p className="text-white/50 text-sm">{perspective === "protect" ? 'Tell your agent: "Buy BTC Catastrophe Shield for $10K, 14 days." Your portfolio is protected.' : 'Tell your agent: "Deposit $10K USDC into the Stable Long vault." Your capital earns yield.'}</p>
          </div>
        </div>
        <div className="text-center mb-12">
          <button onClick={onStartSetup} className={`px-8 py-3 rounded-full font-semibold bg-gradient-to-r ${accent === "cyan" ? "from-cyan-500 to-purple-500" : "from-purple-500 to-cyan-500"} text-white hover:opacity-90 transition-opacity`}>
            Start Setup &rarr;
          </button>
        </div>

        {/* BLOQUE 3 — Compatibility */}
        <CompatibilityCards accent={accent} borderAccent={borderAccent} skillUrl={skillUrl} perspective={perspective} />

        {/* BLOQUE 4 — What the Skill Contains */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 sm:p-8 mb-6">
          <p className="text-sm text-white/60 mb-4">The Skill file contains everything your agent needs:</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              "All 4 insurance products with pricing formulas",
              "All 4 yield vaults with APY calculations",
              "API endpoints and payloads for every operation",
              "Smart contract ABIs and addresses",
              "Decision framework — when to buy, when to deposit",
              "Error handling and retry strategies",
              "Auto-repurchase logic for continuous coverage",
              "Risk scenarios and claim probability data",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 py-1">
                <span className={`${checkColor} text-sm mt-0.5`}>✓</span>
                <span className="text-sm text-white/60">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BLOQUE 5 — Final CTA */}
        <div className="text-center">
          <p className="text-white/50 text-sm mb-6">
            Your agent reads the Skill once and can autonomously manage insurance and yield for your entire portfolio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartSetup}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                accent === "cyan"
                  ? "bg-cyan-500 text-black hover:bg-cyan-400"
                  : "bg-purple-500 text-black hover:bg-purple-400"
              }`}
            >
              Getting Started →
            </button>
            <a
              href="/LUMINA-SKILL.txt"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                accent === "cyan"
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
                  : "bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20"
              }`}
            >
              Read the Full Skill →
            </a>
            <a
              href="mailto:labs@lumina-org.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white/70 border border-white/20 hover:bg-white/5 transition-all"
            >
              Contact Us →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Compatibility Cards + Modals ─── */

type IntegrationKey = "http" | "elizaos" | "langchain" | "virtuals"

const INTEGRATIONS: { key: IntegrationKey; icon: string; name: string; desc: string; status: string; statusColor: string }[] = [
  { key: "http", icon: "⚡", name: "HTTP / REST API", desc: "Any agent that can make HTTP calls can use Lumina.", status: "Available", statusColor: "text-green-400" },
  { key: "elizaos", icon: "🤖", name: "ElizaOS", desc: "Install the Lumina plugin for ElizaOS agents.", status: "Coming Soon", statusColor: "text-amber-400" },
  { key: "langchain", icon: "🔗", name: "LangChain", desc: "Use Lumina tools in your LangChain agent.", status: "Coming Soon", statusColor: "text-amber-400" },
  { key: "virtuals", icon: "🌐", name: "Virtuals Protocol", desc: "Discover Lumina on the Virtuals ACP marketplace.", status: "Coming Soon", statusColor: "text-amber-400" },
]

type IntegrationModal = {
  title: string
  subtitle: string
  whatIs: { q: string; a: string }
  howLabel: string
  steps: string[]
  fallback?: string
  needs?: string[]
  available?: string
  ctaLabel: string
}

function getIntegrationModals(perspective: Perspective): Record<IntegrationKey, IntegrationModal> {
  const isEarn = perspective === "earn"
  return {
    http: {
      title: "Connect via REST API",
      subtitle: "The simplest way. Any AI agent that can make HTTP calls works with Lumina.",
      whatIs: {
        q: "What is this?",
        a: isEarn
          ? "A REST API is like a phone number for software. Your AI agent 'calls' Lumina's server, checks vault yields, and deposits USDC — all in code, no browser needed."
          : "A REST API is like a phone number for software. Your AI agent 'calls' Lumina's server, asks for a quote, and buys insurance — all in code, no browser needed. If your agent can send a message to the internet, it can use Lumina.",
      },
      howLabel: "How it works:",
      steps: isEarn
        ? [
            "Your agent reads the Skill file (a document that teaches it everything about Lumina)",
            "Your agent calls our API: GET /api/v2/vaults → sees all 4 vaults with APY and utilization",
            "Your agent approves USDC and calls the vault contract to deposit",
            "Done. Your USDC earns yield indefinitely. Your agent monitors and manages withdrawals.",
          ]
        : [
            "Your agent reads the Skill file (a document that teaches it everything about Lumina)",
            "Your agent calls our API: GET /api/v2/quote → receives premium price",
            "Your agent approves USDC and calls the smart contract to purchase",
            "Done. Policy is active. Your agent monitors and claims automatically.",
          ],
      needs: [
        "An AI agent (Claude, GPT, any LLM with tool use)",
        "A wallet with USDC on Base L2",
        "The Skill file (link below)",
      ],
      available: "This is available TODAY. No SDK needed, no plugin, just HTTP calls.",
      ctaLabel: "Contact Us for Help",
    },
    elizaos: {
      title: "Connect via ElizaOS",
      subtitle: "Coming Soon — Native plugin for the ElizaOS agent framework.",
      whatIs: { q: "What is ElizaOS?", a: "ElizaOS is a popular open-source framework for building AI agents that can interact with the real world. Think of it as an operating system for your AI — it handles memory, conversations, and actions." },
      howLabel: "How it will work:",
      steps: [
        "Install the Lumina plugin: npm install @lumina/elizaos-plugin",
        "Add it to your agent's configuration",
        isEarn
          ? "Your agent automatically gets yield management capabilities — deposit, monitor APY, request withdrawal"
          : "Your agent automatically gets insurance and yield capabilities",
      ],
      fallback: "In the meantime, you can use the REST API — it works with any ElizaOS agent today via the HTTP action.",
      ctaLabel: "Contact Us for Updates",
    },
    langchain: {
      title: "Connect via LangChain",
      subtitle: "Coming Soon — Lumina tools for LangChain agents.",
      whatIs: { q: "What is LangChain?", a: "LangChain is the most popular framework for building AI applications. It lets you chain together LLMs, tools, and data sources. Think of it as LEGO blocks for AI." },
      howLabel: "How it will work:",
      steps: [
        "Import the Lumina toolkit: from lumina import LuminaToolkit",
        "Add tools to your agent: agent.add_tools(LuminaToolkit())",
        isEarn
          ? "Your agent can now check vaults, deposit, monitor yield, and manage withdrawals automatically"
          : "Your agent can now quote, buy, deposit, and claim automatically",
      ],
      fallback: "In the meantime, you can use the REST API — LangChain agents can make HTTP calls natively with the RequestsTool.",
      ctaLabel: "Contact Us for Updates",
    },
    virtuals: {
      title: "Connect via Virtuals Protocol",
      subtitle: "Coming Soon — Lumina on the Virtuals ACP marketplace.",
      whatIs: { q: "What is Virtuals Protocol?", a: "Virtuals is a decentralized marketplace where AI agents offer services to each other. Think of it as an app store, but for AI agents instead of humans. Your agent browses, finds Lumina, and starts using it." },
      howLabel: "How it will work:",
      steps: [
        "Find Lumina on the Virtuals ACP marketplace",
        "Your agent registers via the ACP Handler",
        isEarn
          ? "Yield management operations are available as ACP actions — deposit, withdraw, monitor"
          : "Insurance and yield operations are available as ACP actions",
      ],
      fallback: "In the meantime, you can use the REST API — any Virtuals agent can make HTTP calls.",
      ctaLabel: "Contact Us for Updates",
    },
  }
}

function CompatibilityCards({ accent, borderAccent, skillUrl, perspective }: { accent: "cyan" | "purple"; borderAccent: string; skillUrl: string; perspective: Perspective }) {
  const [modalKey, setModalKey] = useState<IntegrationKey | null>(null)
  const modals = getIntegrationModals(perspective)
  const modalData = modalKey ? modals[modalKey] : null
  const borderModal = accent === "cyan" ? "border-cyan-500/40" : "border-purple-500/40"
  const textAccent = accent === "cyan" ? "text-cyan-400" : "text-purple-400"
  const checkColor = accent === "cyan" ? "text-cyan-400" : "text-purple-400"
  const btnClass = accent === "cyan"
    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
    : "bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20"

  return (
    <div className="mb-6">
      <p className="text-sm text-white/60 mb-4 text-center">Compatible with:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {INTEGRATIONS.map((c) => (
          <div
            key={c.key}
            onClick={() => setModalKey(c.key)}
            className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:scale-[1.02] hover:border-white/20 transition-all duration-200 cursor-pointer"
          >
            <div className="text-2xl mb-3">{c.icon}</div>
            <h4 className="text-sm font-semibold text-white mb-1">{c.name}</h4>
            <p className="text-xs text-white/50 mb-3 leading-relaxed">{c.desc}</p>
            <span className={`text-xs font-medium ${c.statusColor}`}>{c.status}</span>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalData && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalKey(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`bg-[#12121A] border ${borderModal} rounded-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className={`text-xl font-bold ${textAccent} mb-1`}>{modalData.title}</h3>
                  <p className="text-sm text-white/50">{modalData.subtitle}</p>
                </div>
                <button onClick={() => setModalKey(null)} className="text-white/40 hover:text-white transition-colors p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

              {/* What is this? */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white mb-2">{modalData.whatIs.q}</h4>
                <p className="text-sm text-white/50 leading-relaxed">{modalData.whatIs.a}</p>
              </div>

              {/* Steps */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white mb-3">{modalData.howLabel}</h4>
                <div className="space-y-3">
                  {modalData.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full border ${borderAccent} flex items-center justify-center shrink-0 mt-0.5`}>
                        <span className={`text-xs font-bold ${textAccent}`}>{i + 1}</span>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Needs (HTTP only) */}
              {modalData.needs && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-2">What you need:</h4>
                  <div className="space-y-1.5">
                    {modalData.needs.map((n) => (
                      <div key={n} className="flex items-start gap-2">
                        <span className={`${checkColor} text-sm mt-0.5`}>✓</span>
                        <span className="text-sm text-white/60">{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available note */}
              {modalData.available && (
                <p className="text-sm text-green-400 font-medium mb-6">{modalData.available}</p>
              )}

              {/* Fallback */}
              {modalData.fallback && (
                <p className="text-sm text-white/40 mb-6 leading-relaxed">{modalData.fallback}</p>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <CopyButton text={skillUrl} accent={accent} />
                <a href="mailto:support@lumina-org.com" className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${btnClass}`}>
                  {modalData.ctaLabel}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  COMPARISON TABLE                                         */
/* ═══════════════════════════════════════════════════════════ */

const COMPARISON_ROWS: { feature: string; lumina: string; traditional: string }[] = [
  { feature: "Operator", lumina: "AI Agent (M2M)", traditional: "Human" },
  { feature: "Resolution", lumina: "Automatic (1 transaction)", traditional: "Jury vote or committee (up to 35 days)" },
  { feature: "Trigger", lumina: "Parametric (trustless math)", traditional: "Subjective (human judgment)" },
  { feature: "Settlement", lumina: "Same-block", traditional: "Days/weeks" },
  { feature: "Chain", lumina: "Base L2 (low fees)", traditional: "Ethereum L1 / Multi-chain" },
  { feature: "Settlement Token", lumina: "USDC (earns Aave V3 yield while idle)", traditional: "ETH/DAI/Various" },
  { feature: "Agent-native", lumina: "✅ Built for M2M", traditional: "❌ Human UI only" },
  { feature: "Skill file", lumina: "✅ 736 lines", traditional: "❌" },
  { feature: "Oracle", lumina: "Chainlink + Phala TEE", traditional: "Proprietary or Chainlink" },
  { feature: "LP Yield", lumina: "11-40% + Aave V3 base", traditional: "~4-8%" },
]

function ComparisonSection({ perspective }: { perspective: Perspective }) {
  const accent = perspective === "protect" ? "cyan" : "purple"
  const borderTop = accent === "cyan" ? "border-t-cyan-500" : "border-t-purple-500"
  const checkAccent = accent === "cyan" ? "text-cyan-400" : "text-purple-400"
  const colBg = accent === "cyan" ? "bg-cyan-500/[0.03]" : "bg-purple-500/[0.03]"
  const colBorder = accent === "cyan" ? "border-l border-r border-cyan-500/20" : "border-l border-r border-purple-500/20"
  const tableBorder = accent === "cyan" ? "border border-cyan-500/30 rounded-xl" : "border border-purple-500/30 rounded-xl"

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          How Lumina Compares
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          The first insurance protocol built exclusively for AI agents.
        </p>

        {/* Desktop table */}
        <div className={`hidden md:block overflow-x-auto ${tableBorder} overflow-hidden`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs text-white/40 uppercase tracking-wider font-medium py-3 px-4 w-[180px]">Feature</th>
                <th className={`text-left text-xs uppercase tracking-wider font-medium py-3 px-4 ${colBg} ${borderTop} border-t-2 ${colBorder} ${checkAccent}`}>M2M Insurance — Lumina</th>
                <th className="text-left text-xs text-white/40 uppercase tracking-wider font-medium py-3 px-4 bg-white/[0.01]">Traditional Web3 Insurance</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-white/5">
                  <td className="py-3 px-4 text-white/50 font-medium">{row.feature}</td>
                  <td className={`py-3 px-4 ${colBg} ${colBorder} text-white/80 font-medium`}>
                    {row.lumina.startsWith("✅") ? <><span className={checkAccent}>✅</span>{row.lumina.slice(1)}</> : row.lumina}
                  </td>
                  <td className="py-3 px-4 text-white/40 bg-white/[0.01]">
                    {row.traditional.startsWith("❌") ? <><span className="text-white/30">❌</span>{row.traditional.slice(1)}</> : row.traditional}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {[
            { name: "M2M Insurance — Lumina", isHighlight: true, getData: (r: typeof COMPARISON_ROWS[0]) => r.lumina },
            { name: "Traditional Web3 Insurance", isHighlight: false, getData: (r: typeof COMPARISON_ROWS[0]) => r.traditional },
          ].map((proto) => (
            <div key={proto.name} className={`rounded-xl border p-5 ${proto.isHighlight ? `${borderTop} border-t-2 ${colBg} ${colBorder}` : "border-white/5 bg-white/[0.01]"}`}>
              <h4 className={`text-sm font-bold mb-3 ${proto.isHighlight ? (accent === "cyan" ? "text-cyan-400" : "text-purple-400") : "text-white/50"}`}>{proto.name}</h4>
              <div className="space-y-2">
                {COMPARISON_ROWS.map((row) => {
                  const val = proto.getData(row)
                  return (
                    <div key={row.feature} className="flex justify-between text-xs">
                      <span className="text-white/40">{row.feature}</span>
                      <span className={`text-right ${proto.isHighlight ? "text-white/80 font-medium" : "text-white/40"}`}>
                        {val.startsWith("✅") ? <><span className={checkAccent}>✅</span>{val.slice(1)}</> : val.startsWith("❌") ? <><span className="text-white/30">❌</span>{val.slice(1)}</> : val}
                      </span>
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

function SecuritySection({ perspective }: { perspective: Perspective }) {
  const accent = perspective === "protect" ? "cyan" : "purple"
  const checkColor = accent === "cyan" ? "text-cyan-400" : "text-purple-400"
  const borderAccent = accent === "cyan" ? "border-cyan-500/20" : "border-purple-500/20"

  const phases = [
    { title: "Phase 1: Core", desc: "CoverRouter + PolicyManager + Vaults", rounds: "12+ audit rounds", badge: "0C / 0H / 0M" },
    { title: "Phase 2: Shields", desc: "4 insurance products + BaseShield", rounds: "3 dual audit rounds", badge: "0C / 0H / 0M / 0L" },
    { title: "Phase 3: Oracles", desc: "LuminaOracle + PhalaVerifier", rounds: "2 dual audit rounds", badge: "0C / 0H / 0M / 0L" },
  ]

  const protections = [
    "EIP-712 signed price proofs (anti flash-crash)",
    "L2 Sequencer uptime check with 1h grace period",
    "Circuit breakers on extreme volatility",
    "Waiting periods (24h Depeg, 14d Exploit)",
    "European-style IL resolution (48h window)",
    "$50K per-wallet cap on Exploit Shield",
    "Dual trigger (Chainlink + Phala TEE) for exploits",
    "Soulbound vault shares (anti-cooldown bypass)",
    "Multisig oracle verification (3-of-5 signatures)",
  ]

  return (
    <section className="py-24 px-4">
      <div id="security" className="scroll-mt-20" />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Security
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          24 contracts. 4,825 lines. 3 phases audited.
        </p>

        {/* Phase cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {phases.map((p) => (
            <div key={p.title} className={`bg-white/[0.03] border ${borderAccent} rounded-xl p-6`}>
              <h4 className="text-sm font-bold text-white mb-2">{p.title}</h4>
              <p className="text-xs text-white/50 mb-2">{p.desc}</p>
              <p className="text-xs text-white/40 mb-3">{p.rounds}</p>
              <span className="text-sm font-bold text-green-400">{p.badge}</span>
            </div>
          ))}
        </div>

        {/* OWS Integration */}
        <div className="bg-[rgba(124,77,255,0.05)] border border-[rgba(124,77,255,0.3)] rounded-xl p-6 mb-8">
          <h4 className="text-base font-bold text-[#7c4dff] mb-1">🔒 Open Wallet Standard (OWS)</h4>
          <p className="text-xs text-white/40 mb-4">Defense-in-depth for every AI agent</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-white/80 mb-1">🔐 Encrypted Keys</p>
              <p className="text-xs text-white/50">Private keys encrypted with AES-256-GCM. Never in plaintext. Decrypted only inside the signing path.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/80 mb-1">🛡️ Policy Engine</p>
              <p className="text-xs text-white/50">Every transaction validated before signing. Chain restrictions, contract allowlists, spending limits.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/80 mb-1">⚡ Instant Revocation</p>
              <p className="text-xs text-white/50">Revoke agent access with one command. No on-chain transaction needed. Funds always safe.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="https://openwallet.sh" target="_blank" rel="noopener noreferrer" className="text-xs text-[#7c4dff] hover:text-[#9c7cff] transition-colors">openwallet.sh →</a>
            <a href="https://github.com/org-lumina/LUMINA-PROTOCOL/blob/main/docs/OWS-INTEGRATION.md" target="_blank" rel="noopener noreferrer" className="text-xs text-[#7c4dff] hover:text-[#9c7cff] transition-colors">Integration Guide →</a>
          </div>
        </div>

        {/* Multisig Oracle */}
        <div className="bg-[rgba(0,188,212,0.05)] border border-[rgba(0,188,212,0.3)] rounded-xl p-6 mb-8">
          <h4 className="text-base font-bold text-cyan-400 mb-1">🔐 Multisig Oracle (N-of-M)</h4>
          <p className="text-xs text-white/40 mb-4">No single point of failure for claim resolution</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-white/80 mb-1">🛡️ N-of-M Verification</p>
              <p className="text-xs text-white/50">Oracle reports require 3-of-5 independent cryptographic signatures before any claim is resolved on-chain.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/80 mb-1">🔄 Signer Rotation</p>
              <p className="text-xs text-white/50">Add or remove signers without redeploying contracts. Quorum adjustable from 1-of-1 to any N-of-M configuration.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/80 mb-1">✅ Backwards Compatible</p>
              <p className="text-xs text-white/50">Existing integrations keep working. Single-signer mode supported. Upgrade to multisig with zero downtime.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/org-lumina/LUMINA-PROTOCOL/blob/main/src/oracles/LuminaOracle.sol" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">LuminaOracle.sol →</a>
            <a href="https://github.com/org-lumina/LUMINA-PROTOCOL/blob/main/test/MultisigOracle.t.sol" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">119 Tests Passing →</a>
          </div>
        </div>

        <p className="text-xs text-white/40 text-center mb-8 leading-relaxed">
          Dual audit methodology: Claude Code Security + Gemini Pro — independent findings cross-verified across both AI auditors.
        </p>

        {/* Protections */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 mb-8">
          <div className="grid sm:grid-cols-2 gap-2">
            {protections.map((item) => (
              <div key={item} className="flex items-start gap-2 py-1">
                <span className={`${checkColor} text-sm mt-0.5`}>✓</span>
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
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              accent === "cyan"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
                : "bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20"
            }`}
          >
            View Contracts on GitHub →
          </a>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  FAQ + CONTACT                                            */
/* ═══════════════════════════════════════════════════════════ */

const FAQ_GENERAL = [
  { q: "What is Lumina Protocol?", a: "Lumina Protocol is the first parametric insurance platform built exclusively for AI agents operating in DeFi. Unlike traditional insurance, Lumina uses objective on-chain data from Chainlink oracles to automatically verify conditions and execute payouts. Your AI agent buys coverage via API, and if a trigger condition is met, the payout is calculated and sent to the agent's wallet automatically. Standard payouts process within minutes; large payouts may have an additional security delay." },
  { q: "What insurance products does Lumina offer?", a: "Five parametric products: (1) BTC Catastrophe Shield (BCS) — covers BTC crashes exceeding 50%, pays 80% of coverage, 7-30 day policies. (2) ETH Apocalypse Shield (EAS) — covers ETH crashes exceeding 60%, pays 80%, 7-30 days. (3) Depeg Shield — covers USDT or DAI losing peg below $0.95, pays 85-88%, 14-365 days. (4) IL Index Cover — covers impermanent loss exceeding 2% at policy expiry, proportional payout capped at 11.7%, 14-90 days. (5) Exploit Shield — covers DeFi protocol hacks via dual-trigger mechanism, pays 90%, 90-365 days, max $50K per wallet." },
  { q: "Can a human buy a policy or deposit from this website?", a: "No. This website is informational only. All operations — buying insurance, depositing in vaults, claiming payouts, withdrawing — are performed by your AI agent. The website explains, convinces, and provides the Skill file. Your agent does the rest." },
  { q: "What is USDC?", a: "USDC is Circle's native stablecoin on Base, backed 1:1 by US dollars and short-term treasuries. When you deposit USDC in a Lumina vault, your funds are lent on Aave V3 to earn a base yield PLUS insurance premiums on top." },
  { q: "How much does a policy cost?", a: "Pricing is dynamic based on vault utilization. When utilization is low, premiums are cheaper. Above 80% utilization, premiums accelerate sharply (Kink model). Above 95%, no new policies accepted. Example: $10,000 BCS coverage for 14 days costs approximately $28 at low utilization, $75 at high utilization. A 3% protocol fee is applied to every premium." },
  { q: "What happens when my policy triggers?", a: "The oracle detects the trigger condition, generates a signed proof, and submits it to the smart contract. The contract verifies signatures, calculates payout (coverage minus deductible), deducts 3% protocol fee, and transfers USDC to your wallet. Example: $10,000 BCS with 20% deductible = $8,000 payout, minus 3% fee = $7,760 net. The process is automatic — no forms, no waiting." },
  { q: "What is the protocol fee?", a: "Lumina charges 3% on premiums (when your agent buys insurance), 3% on payouts (when your agent collects a claim), and a 3% performance fee on positive vault yield at withdrawal. The performance fee only applies when LPs withdraw with a profit — if a vault lost value, no fee is charged." },
  { q: "Is my money safe?", a: "Lumina implements multiple security layers: a 48-hour TimelockController on all admin changes, a Gnosis Safe 1-of-1 (planned upgrade to 2-of-3 multisig), separated keys for different roles, 119 automated tests, and all contracts verified on BaseScan. The protocol has undergone internal security review using dual-auditor methodology. However, a formal external audit by a Tier 1 firm is planned but not yet completed. As with any DeFi protocol, risks exist: smart contract bugs, oracle failures, or extreme market events could result in loss of funds. Only deposit what you can afford to lose." },
]

const FAQ_PROTECT = [
  { q: "What happens if the L2 sequencer goes down during a crash?", a: "The oracle blocks stale prices until 1 hour after sequencer recovery. You have a 24-hour grace period after policy expiry to submit your claim. Even with sequencer downtime, you're protected." },
  { q: "Can I cancel a policy?", a: "No. Policies are non-cancellable. The premium is paid upfront and non-refundable. This is by design — it ensures the vault always has premium income to offset potential claims." },
  { q: "How does auto-repurchase work?", a: "Your agent monitors policy expiry and buys a new policy before the current one expires. For Depeg (24h waiting), your agent repurchases at least 24h before expiry. For Exploit (14d waiting), at least 14 days before. The Skill file has the complete logic." },
  { q: "What if trigger conditions are met but my agent doesn't claim?", a: "For most products (BCS, EAS, Depeg, Exploit), claims are resolved automatically by the oracle. However, IL Index Cover uses European-style settlement: claims can only be verified within a strict 48-hour window after policy expiration. If not processed within this window, the policy expires without payout. Make sure your agent monitors IL policy expiration dates." },
  { q: "Why can't I insure USDC with the Depeg Shield?", a: "USDC is Lumina's settlement token — all premiums and payouts are in USDC. If USDC lost its peg, the payout would also be devalued, making the insurance ineffective. Use the Depeg Shield for USDT or DAI instead." },
  { q: "Why can't I insure against an Aave exploit?", a: "Lumina's vaults deposit USDC into Aave V3 to generate yield. If Aave were exploited, the vault funds would also be affected, making it impossible to pay claims. Exploit Shield covers a curated list of supported protocols including Compound III, Uniswap V3, MakerDAO, Curve, and Morpho." },
]

const FAQ_EARN = [
  { q: "How do I deposit in a vault?", a: "Vault deposits are on-chain transactions (not through the API). You need USDC on Base L2, then approve and call the deposit function on the vault contract. Minimum deposit is $100. You'll receive non-transferable (soulbound) shares. Four vaults available: VolatileShort (37-day cooldown, highest risk/reward), VolatileLong (97-day), StableShort (97-day), and StableLong (372-day, most conservative)." },
  { q: "How much can I earn as an LP?", a: "Returns come from insurance premiums plus Aave V3 lending yield. In normal conditions (40% utilization, no claims): expect 5-10% APY. In high demand (70%+): 10-25% APY. However, if many policies trigger simultaneously, returns go negative. In extreme scenarios, LPs can lose 30-50% of their deposit. A 3% performance fee is charged only on positive returns when you withdraw." },
  { q: "What's the worst that can happen as an LP?", a: "In extreme events (market crash triggering multiple policies simultaneously), a vault could lose 30-50% of TVL from insurance payouts. If Aave V3 were exploited, additional losses are possible since vault idle capital is deposited there. The protocol guarantees it can always pay claims, but LP capital absorbs the losses. VolatileShort has the highest risk. Only deposit what you can afford to lose." },
  { q: "Is the APY guaranteed?", a: "No. The base yield comes from Aave V3 lending on Base and fluctuates with market demand. The premium yield depends on insurance policy volume and vault utilization. Both fluctuate. The numbers shown are estimates based on current conditions." },
  { q: "What is a cooldown? Is my money locked?", a: "No lock. Cooldown is an EXIT NOTICE. You deposit indefinitely and earn yield. When you want to leave, you give notice (37-372 days depending on vault). During cooldown, you KEEP earning. After cooldown, you withdraw everything." },
  { q: "Why are shares soulbound?", a: "To prevent cooldown bypass. If you could sell shares on a DEX, someone could buy 'mature' shares about to finish cooldown, defeating the purpose of locking capital to back policies." },
  { q: "Who controls the protocol?", a: "No single person. The protocol is governed by a Gnosis Safe multisig requiring 2 of 3 signatures, plus a TimelockController with a 48-hour mandatory delay on all changes. Deployer, oracle signer, and relayer use separate keys. In the future, governance will transition to a community-driven DAO." },
  { q: "What happens if the Lumina team disappears?", a: "The smart contracts continue operating on Base L2 regardless. Active policies still trigger and pay out automatically. LPs can always withdraw after cooldown. All code is open-source and verified on BaseScan. The protocol is designed to be self-sustaining." },
  { q: "What wallet do I need?", a: "Any Web3 wallet supporting Base L2. MetaMask is most common. You need: (1) Base network added (Chain ID 8453), (2) some ETH on Base for gas (less than $0.01 per tx), (3) USDC on Base for policies or vault deposits." },
  { q: "What is the SKILL file?", a: "A comprehensive documentation file that AI agents load to interact with Lumina autonomously. It contains all API endpoints, product details, pricing info, and contract addresses. Any AI framework (Claude, ChatGPT, ElizaOS, LangChain) can load it and immediately begin operating. Download at lumina-org.com/LUMINA-SKILL.txt" },
]

function FAQSection({ perspective }: { perspective: Perspective }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const accent = perspective === "protect" ? "cyan" : "purple"
  const textAccent = accent === "cyan" ? "text-cyan-400" : "text-purple-400"
  const borderAccent = accent === "cyan" ? "border-cyan-500/20" : "border-purple-500/20"

  const perspectiveFAQs = perspective === "protect" ? FAQ_PROTECT : FAQ_EARN
  const allFAQs = [...FAQ_GENERAL, ...perspectiveFAQs]

  return (
    <section className="py-24 px-4">
      <div id="faq" className="scroll-mt-20" />
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2 mb-16">
          {allFAQs.map((faq, i) => {
            const isOpen = openIdx === i
            return (
              <div key={i} className={`border ${isOpen ? borderAccent : "border-white/5"} rounded-xl overflow-hidden transition-colors`}>
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
              <a href="mailto:labs@lumina-org.com" className={`text-lg font-bold ${textAccent} hover:underline block mb-2`}>
                labs@lumina-org.com
              </a>
              <p className="text-xs text-white/40">Want to integrate Lumina? Need the Skill file? Talk to our team.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white/70 mb-2">Support &amp; Questions</h4>
              <a href="mailto:support@lumina-org.com" className={`text-lg font-bold ${textAccent} hover:underline block mb-2`}>
                support@lumina-org.com
              </a>
              <p className="text-xs text-white/40">General questions, technical help, or just curious.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:labs@lumina-org.com"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                accent === "cyan"
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
                  : "bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20"
              }`}
            >
              Contact Sales →
            </a>
            <a
              href="mailto:support@lumina-org.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white/70 border border-white/20 hover:bg-white/5 transition-all"
            >
              Get Support →
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

function Navbar({ perspective, onConnectAgent, walletAddress, setWalletAddress }: { perspective: Perspective; onConnectAgent: () => void; walletAddress: string | null; setWalletAddress: (addr: string | null) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const accent = perspective === "protect" ? "cyan" : "purple"
  const hoverColor = accent === "cyan" ? "hover:text-cyan-400" : "hover:text-purple-400"

  const navLinks = [
    ...(perspective === "protect" ? [{ label: "Products", href: "#products" }] : []),
    ...(perspective === "earn" ? [{ label: "Vaults", href: "#vaults" }] : []),
    { label: "Pricing", href: "#kink-model" },
    { label: "Calculator", href: perspective === "earn" ? "#yield-calculator" : "#calculator" },
    { label: "Skill", href: "/LUMINA-SKILL.txt", external: true },
    { label: "Security", href: "#security" },
    { label: "FAQ", href: "#faq" },
    { label: "Docs", href: "https://github.com/org-lumina/LUMINA-PROTOCOL", external: true },
  ]

  const handleClick = (href: string, external?: boolean) => {
    setMenuOpen(false)
    if (!external && href.startsWith("#")) {
      // Small delay to let mobile drawer close before scrolling
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
          <span className="text-white/20"> · </span>
          <span className="text-purple-400">M2M</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            link.external ? (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={`text-sm text-white/70 ${hoverColor} transition-colors whitespace-nowrap`}>
                {link.label}
              </a>
            ) : (
              <button key={link.label} onClick={() => handleClick(link.href)} className={`text-sm text-white/70 ${hoverColor} transition-colors whitespace-nowrap`}>
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
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  accent === "cyan"
                    ? "text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10"
                    : "text-purple-400 border border-purple-500/50 hover:bg-purple-500/10"
                }`}
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
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className={`block py-3 text-base text-white ${hoverColor} transition-colors`}>
                    {link.label}
                  </a>
                ) : (
                  <button key={link.label} onClick={() => handleClick(link.href)} className={`block w-full text-left py-3 text-base text-white ${hoverColor} transition-colors`}>
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
                      className={`block w-full text-center px-6 py-2.5 rounded-full text-base font-medium transition-all ${
                        accent === "cyan"
                          ? "text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10"
                          : "text-purple-400 border border-purple-500/50 hover:bg-purple-500/10"
                      }`}
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
