"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Perspective = "protect" | "earn"

export default function Home() {
  const [perspective, setPerspective] = useState<Perspective>("protect")

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-white/60 mb-8"
          >
            Built on Base L2 · Powered by USDY
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Parametric Insurance{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Built for AI Agents
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12"
          >
            Your agent buys coverage, oracles verify triggers, payouts arrive in seconds.
            No claims process. No human judges. No disputes. Just math.
          </motion.p>

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
              <span className="hidden sm:inline text-xs font-normal opacity-70">Buy Insurance</span>
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
              <span className="hidden sm:inline text-xs font-normal opacity-70">Yield on USDY</span>
            </button>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <a href="#how-it-works" className={`px-8 py-3 rounded-full font-semibold transition-all ${
              perspective === "protect"
                ? "bg-cyan-500 hover:bg-cyan-400 text-black"
                : "bg-purple-500 hover:bg-purple-400 text-black"
            }`}>
              Learn How It Works
            </a>
            <a href="mailto:labs@lumina-org.com" className="px-8 py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all">
              Contact Us
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40"
          >
            <span>4 Products</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>4 Vaults</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>24 Audited Contracts</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>3% Protocol Fee</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>USDY Base Yield 3.55%</span>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-white/50 text-center mb-16 max-w-xl mx-auto">
            {perspective === "protect"
              ? "Three steps. Your agent handles all of them."
              : "Deposit once. Earn indefinitely. Withdraw when you want."}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={perspective}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {perspective === "protect" ? (
                <>
                  <HowCard
                    step="01"
                    title="Agent Requests a Quote"
                    description="Via REST API or Virtuals Protocol, your agent requests coverage. The Kink Model calculates the premium based on real-time vault utilization."
                    accent="cyan"
                  />
                  <HowCard
                    step="02"
                    title="Oracle Verifies the Event"
                    description="Chainlink price feeds + Phala TEE verify the trigger. No human judges. No voting. Pure math."
                    accent="cyan"
                  />
                  <HowCard
                    step="03"
                    title="Instant Payout"
                    description="97% of the calculated payout arrives in your agent's wallet in the same transaction. Automatic. Deterministic."
                    accent="cyan"
                  />
                </>
              ) : (
                <>
                  <HowCard
                    step="01"
                    title="Agent Deposits USDY"
                    description="Your agent deposits USDY into one of four vaults. Each has different risk and cooldown. Your USDY earns 3.55% base yield automatically from Ondo Finance."
                    accent="purple"
                  />
                  <HowCard
                    step="02"
                    title="Premiums Flow In"
                    description="Every time an agent buys insurance, 97% of the premium goes to your vault. More policies = more yield. APY adjusts in real-time with the Kink Model."
                    accent="purple"
                  />
                  <HowCard
                    step="03"
                    title="Withdraw When You Want"
                    description="Your deposit is indefinite. When you want to leave, give a cooldown notice (30-365 days). After cooldown, withdraw principal + all accumulated yield."
                    accent="purple"
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* CTA */}
          <div className="text-center mt-12">
            <a
              href="https://github.com/agustintiberio10/LUMINA-PROTOCOL/blob/main/docs/SKILL-lumina-v2.md"
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
      <AgentSkillsSection perspective={perspective} />

      {/* COMPARISON TABLE (shared) */}
      <ComparisonSection perspective={perspective} />

      {/* SECURITY & AUDITS (shared) */}
      <SecuritySection perspective={perspective} />

      {/* FAQ + CONTACT (shared) */}
      <FAQSection perspective={perspective} />

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <span>© 2025 Lumina Protocol</span>
          <div className="flex items-center gap-6">
            <span>Sales: <a href="mailto:labs@lumina-org.com" className="text-white/50 hover:text-white transition-colors">labs@lumina-org.com</a></span>
            <span>Support: <a href="mailto:support@lumina-org.com" className="text-white/50 hover:text-white transition-colors">support@lumina-org.com</a></span>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  PRODUCTS SECTION                                         */
/* ═══════════════════════════════════════════════════════════ */

const PRODUCTS = [
  {
    key: "bss",
    emoji: "🌊",
    label: "Black Swan Shield",
    tagline: "Insurance against catastrophic crashes",
    analogy: "Like hurricane insurance — covers the worst-case scenario",
    rows: [
      ["Trigger", "ETH or BTC drops >30% from your purchase price"],
      ["Payout", "80% of coverage (net 77.6% after 3% fee)"],
      ["Duration", "7–30 days"],
      ["Waiting Period", "None — instant coverage"],
      ["Price", "From 0.53% for 7 days"],
    ],
    example: "$50K coverage, 14 days → Premium $527 → If triggered: receive $38,800 → Return: 73x",
    technicalDetails: [
      ["Product ID", "BLACKSWAN-001"],
      ["Risk Type", "VOLATILE"],
      ["Oracle", "Chainlink TWAP 15 min or 3 consecutive roundIds"],
      ["Strike Price", "Captured at moment of purchase"],
      ["Trigger Price", "strikePrice × 0.70"],
      ["Deductible", "20%"],
      ["Max Allocation", "20% of vault"],
      ["Grace Period", "24h post-expiry to submit claim"],
      ["Vault", "VolatileShort (30d) → overflow to VolatileLong (90d)"],
      ["Kink Model", "P_base 22% annualized × M(U) × duration"],
      ["Protocol Fee", "3% on premium + 3% on payout"],
    ],
  },
  {
    key: "depeg",
    emoji: "🔥",
    label: "Depeg Shield",
    tagline: "Protection when stablecoins lose their peg",
    analogy: "Like fire insurance — 24h waiting because you can smell the smoke before it burns",
    rows: [
      ["Trigger", "Stablecoin TWAP 30 min < $0.95"],
      ["Covers", "USDC (net 87.3%), DAI (net 85.4%), USDT (net 82.5%)"],
      ["Duration", "14–365 days"],
      ["Waiting Period", "24 hours"],
      ["Price", "Discounts for longer durations: 10% off at 91d, 20% off at 181d"],
    ],
    example: "$100K USDC, 90 days → Premium $3,699 → If triggered: receive $87,300",
    technicalDetails: [
      ["Product ID", "DEPEG-STABLE-001"],
      ["Risk Type", "STABLE"],
      ["Oracle", "Chainlink TWAP 30 min or 5 consecutive roundIds"],
      ["Threshold", "Absolute $0.95 (not relative)"],
      ["Risk Multipliers", "USDC 1.0x, DAI 1.2x, USDT 1.4x"],
      ["Deductibles", "USDC 10%, DAI 12%, USDT 15%"],
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
      ["Waiting Period", "None"],
      ["Key Difference", "ONLY product with proportional payout. Can ONLY claim during 48h window after expiry."],
    ],
    example: "ETH moves ±50% → IL 5.7% → Net payout $1,665 on $50K coverage",
    technicalDetails: [
      ["Product ID", "ILPROT-001"],
      ["Risk Type", "VOLATILE"],
      ["Oracle", "Chainlink TWAP 15 min at expiry"],
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
    tagline: "Coverage against protocol hacks",
    analogy: "Like bank robbery insurance — dual trigger prevents false alarms",
    rows: [
      ["Trigger", "DUAL: Governance token −25% in 24h AND receipt token −30% for 4h (or contract paused)"],
      ["Payout", "90% of coverage (net 87.3% after fee)"],
      ["Duration", "90–365 days"],
      ["Waiting Period", "14 days (anti-insider)"],
      ["Cap", "$50,000 per wallet"],
      ["Protocols", "Aave, Compound, Uniswap, MakerDAO, Curve, Morpho"],
      ["Why Dual Trigger", "Bear market drops gov tokens but aUSDC stays at $1 = NOT an exploit. Only real hacks trigger BOTH."],
    ],
    example: "",
    technicalDetails: [
      ["Product ID", "EXPLOIT-001"],
      ["Risk Type", "STABLE"],
      ["Oracle", "Chainlink TWAP 15 min (governance) + Phala TEE attestation (receipt token)"],
      ["Condition 1", "Governance token drops >25% in 24h"],
      ["Condition 2", "Receipt token drops >30% sustained 4h OR contract paused"],
      ["Both Required", "Both conditions must be met simultaneously"],
      ["Protocol Tiers", "Tier 1 (Aave, Compound, Uniswap) 1.0x, MakerDAO 1.1x, Curve 1.5x, Morpho 1.8x"],
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
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
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
              <span>{p.label}</span>
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
            className="rounded-2xl bg-white/[0.02] border border-cyan-500/20 p-6 md:p-8"
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
                href="https://github.com/agustintiberio10/LUMINA-PROTOCOL/blob/main/docs/SKILL-lumina-v2.md"
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

type CalcProduct = "bss" | "depeg" | "il" | "exploit"

const CALC_DURATION_RANGES: Record<CalcProduct, [number, number, number]> = {
  bss: [7, 30, 14],
  depeg: [14, 365, 90],
  il: [14, 90, 30],
  exploit: [90, 365, 180],
}

function getCalcParams(product: CalcProduct, stablecoin: string, protocol: string) {
  switch (product) {
    case "bss":
      return { pBase: 0.22, riskMult: 1.0, deductible: 0.20 }
    case "depeg":
      if (stablecoin === "DAI") return { pBase: 0.24, riskMult: 1.2, deductible: 0.12 }
      if (stablecoin === "USDT") return { pBase: 0.24, riskMult: 1.4, deductible: 0.15 }
      return { pBase: 0.24, riskMult: 1.0, deductible: 0.10 }
    case "il":
      return { pBase: 0.20, riskMult: 1.0, deductible: 0.02 }
    case "exploit": {
      const mults: Record<string, number> = { Aave: 1.0, Compound: 1.0, Uniswap: 1.0, MakerDAO: 1.1, Curve: 1.5, Morpho: 1.8 }
      return { pBase: 0.03, riskMult: mults[protocol] || 1.0, deductible: 0.10 }
    }
  }
}

function getDurationDiscount(product: CalcProduct, days: number) {
  if (product !== "depeg") return 1.0
  if (days >= 181) return 0.80
  if (days >= 91) return 0.90
  return 1.0
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
  const [product, setProduct] = useState<CalcProduct>("bss")
  const [coverage, setCoverage] = useState(10000)
  const [duration, setDuration] = useState(14)
  const [asset, setAsset] = useState("ETH")
  const [stablecoin, setStablecoin] = useState("USDC")
  const [protocol, setProtocol] = useState("Aave")

  const [min, max, def] = CALC_DURATION_RANGES[product]

  const handleProductChange = (p: CalcProduct) => {
    setProduct(p)
    const [, , d] = CALC_DURATION_RANGES[p]
    setDuration(d)
  }

  // Clamp duration
  const clampedDuration = Math.min(Math.max(duration, min), max)

  const calculations = useMemo(() => {
    const MU = 1.25
    const params = getCalcParams(product, stablecoin, protocol)
    const dd = getDurationDiscount(product, clampedDuration)
    const premium = coverage * params.pBase * params.riskMult * dd * MU * (clampedDuration / 365)
    const premiumFee = premium * 0.03
    const maxPayout = coverage * (1 - params.deductible)
    const payoutFee = maxPayout * 0.03
    const netPayout = maxPayout - payoutFee
    const returnOnPremium = premium > 0 ? netPayout / premium : 0
    return { premium, premiumFee, maxPayout, payoutFee, netPayout, returnOnPremium }
  }, [product, coverage, clampedDuration, stablecoin, protocol])

  const { premium, premiumFee, maxPayout, payoutFee, netPayout, returnOnPremium } = calculations

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 })
  const fmt2 = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <section className="py-24 px-4">
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
                  { value: "bss", label: "Black Swan Shield" },
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

              {/* Asset (BSS, IL) */}
              {(product === "bss" || product === "il") && (
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
                    { value: "USDC", label: "USDC" },
                    { value: "DAI", label: "DAI" },
                    { value: "USDT", label: "USDT" },
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
                    { value: "Aave", label: "Aave v3 (Tier 1)" },
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
              <div className="grid grid-cols-2 gap-3">
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
                <div className="grid grid-cols-2 gap-4 mb-3">
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
              <p className="text-xs text-white/30 leading-relaxed">
                Calculated at 40% vault utilization (M(U) = 1.25x). At higher utilization, premiums increase via the Kink Model.
              </p>

              {/* CTA */}
              <div className="text-center pt-2">
                <a
                  href="https://github.com/agustintiberio10/LUMINA-PROTOCOL/blob/main/docs/SKILL-lumina-v2.md"
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
    symbol: "lvsUSDY",
    cooldown: "30 days",
    apy: "12-25%",
    base: "3.55%",
    premiums: "9-21%",
    backs: ["BSS 7-30d", "IL Index 14-30d"],
    risk: "Higher",
    riskColor: "text-red-400",
    bestFor: "Quick access traders who want short commitment",
    technicalDetails: [
      ["Contract", "VolatileShortVault.sol"],
      ["Standard", "ERC-4626 with soulbound shares (non-transferable)"],
      ["Cooldown", "30 days exit notice (NOT a lock)"],
      ["Max Allocation", "20% of vault TVL per product"],
      ["Waterfall", "First choice for BSS 7-30d and IL 14-30d"],
      ["During Cooldown", "Capital still earns from existing policies, no new policies assigned"],
      ["Withdrawal", "requestWithdrawal() → wait 30d → completeWithdrawal()"],
      ["Cancel", "cancelWithdrawal() returns to full availability"],
      ["USDY Yield", "3.55% from Ondo Finance (US Treasuries), independent of Lumina"],
      ["Premium Yield", "Dynamic, depends on # of policies and Kink multiplier"],
      ["Worst Case", "BSS crash + IL spike = ~30% TVL loss in a month (5-10yr event)"],
    ],
  },
  {
    name: "Volatile Long",
    symbol: "lvlUSDY",
    cooldown: "90 days",
    apy: "15-30%",
    base: "3.55%",
    premiums: "12-26%",
    backs: ["IL Index 60-90d", "BSS overflow"],
    risk: "Higher",
    riskColor: "text-red-400",
    bestFor: "Balanced investors who want higher yield",
    technicalDetails: [
      ["Contract", "VolatileLongVault.sol"],
      ["Standard", "ERC-4626 with soulbound shares (non-transferable)"],
      ["Cooldown", "90 days exit notice"],
      ["Waterfall", "Receives overflow when VolatileShort is full (>95% utilized)"],
      ["Backs", "IL 60-90d policies and BSS when Short vault is >95% utilized"],
      ["Higher Yield", "Longer commitment = longer policies = more premium per dollar"],
      ["Withdrawal", "requestWithdrawal() → wait 90d → completeWithdrawal()"],
      ["Worst Case", "Same risk type as VolatileShort but longer lock = higher yield compensation"],
    ],
  },
  {
    name: "Stable Short",
    symbol: "lssUSDY",
    cooldown: "90 days",
    apy: "11-22%",
    base: "3.55%",
    premiums: "8-18%",
    backs: ["Depeg Shield 14-90d"],
    risk: "Low",
    riskColor: "text-green-400",
    bestFor: "Conservative investors",
    technicalDetails: [
      ["Contract", "StableShortVault.sol"],
      ["Standard", "ERC-4626 with soulbound shares (non-transferable)"],
      ["Cooldown", "90 days exit notice"],
      ["Restriction", "Cannot back Exploit Shield (90d policy + 14d waiting = 104d > 90d cooldown)"],
      ["Only Backs", "Depeg Shield 14-90d"],
      ["Claim Risk", "Lower — stablecoin depegs are rare (2-3 per decade)"],
      ["Withdrawal", "requestWithdrawal() → wait 90d → completeWithdrawal()"],
      ["Worst Case", "Major depeg like USDC March 2023 (went to $0.87) = ~20% TVL loss"],
    ],
  },
  {
    name: "Stable Long",
    symbol: "lslUSDY",
    cooldown: "365 days",
    apy: "18-40%",
    base: "3.55%",
    premiums: "15-36%",
    backs: ["Depeg 365d", "Exploit Shield 90-365d"],
    risk: "Very low",
    riskColor: "text-green-400",
    bestFor: "Institutions, DAOs, family offices — set and forget",
    technicalDetails: [
      ["Contract", "StableLongVault.sol"],
      ["Standard", "ERC-4626 with soulbound shares (non-transferable)"],
      ["Cooldown", "365 days exit notice — longest commitment, highest yield"],
      ["Monopoly", "ONLY vault that can back annual Depeg policies and Exploit Shield"],
      ["Advantage", "Monopoly on long-term premiums → highest APY"],
      ["Target", "Institutional LPs, DAO treasuries, family offices"],
      ["Exploit Risk", "Extremely rare: dual trigger + 14d waiting + $50K cap"],
      ["Withdrawal", "requestWithdrawal() → wait 365d → completeWithdrawal()"],
      ["Worst Case", "Simultaneous depeg + exploit = ~25% TVL loss (once per decade)"],
    ],
  },
]

function VaultsSection() {
  const [modalVault, setModalVault] = useState<string | null>(null)
  const modalData = VAULTS.find((v) => v.symbol === modalVault)

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
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
              <div className="rounded-2xl bg-white/[0.02] border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 p-6 flex flex-col h-full">
                {/* APY */}
                <div className="min-h-[120px]">
                  <div>
                    <span className="text-3xl font-bold text-purple-400">{v.apy}</span>
                    <span className="text-sm text-white/40 ml-2">APY</span>
                  </div>
                  <p className="text-sm text-white/50">
                    USDY {v.base} + Premiums {v.premiums}
                  </p>
                  <p className="text-xs text-white/30">Range reflects 20-90% utilization via Kink Model</p>
                </div>

                {/* Name + Symbol */}
                <div className="min-h-[70px]">
                  <h3 className="text-lg font-semibold mb-1">{v.name}</h3>
                  <span className="text-xs font-mono text-purple-400/60">{v.symbol}</span>
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
              Think of it like renting an apartment: you move in (deposit) and live there as long as you want (earn yield). One day you decide to move out (request withdrawal). You give 30 days notice (cooldown). After 30 days, you leave with your deposit + everything you earned.
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
            href="https://github.com/agustintiberio10/LUMINA-PROTOCOL/blob/main/docs/SKILL-lumina-v2.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-all"
          >
            Give Your Agent the Skill →
          </a>
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
  premiumAPYmin: number
  premiumAPYmax: number
  usdyBase: number
  products: string
  risk: string
  worstCase: number
}> = {
  "volatile-short": { label: "Volatile Short", cooldown: 30, premiumAPYmin: 0.09, premiumAPYmax: 0.21, usdyBase: 0.0355, products: "BSS + IL Index", risk: "Higher", worstCase: 0.30 },
  "volatile-long": { label: "Volatile Long", cooldown: 90, premiumAPYmin: 0.12, premiumAPYmax: 0.26, usdyBase: 0.0355, products: "IL Index + BSS overflow", risk: "Higher", worstCase: 0.28 },
  "stable-short": { label: "Stable Short", cooldown: 90, premiumAPYmin: 0.08, premiumAPYmax: 0.18, usdyBase: 0.0355, products: "Depeg Shield", risk: "Low", worstCase: 0.20 },
  "stable-long": { label: "Stable Long", cooldown: 365, premiumAPYmin: 0.15, premiumAPYmax: 0.36, usdyBase: 0.0355, products: "Depeg + Exploit Shield", risk: "Very Low", worstCase: 0.25 },
}

function YieldCalculatorSection() {
  const [vault, setVault] = useState<YieldVaultKey>("volatile-short")
  const [deposit, setDeposit] = useState(10000)

  const v = YIELD_VAULTS[vault]

  const calculations = useMemo(() => {
    const vaultData = YIELD_VAULTS[vault]
    const avgPremiumAPY = (vaultData.premiumAPYmin + vaultData.premiumAPYmax) / 2
    const totalAPY = vaultData.usdyBase + avgPremiumAPY
    const monthlyUSDY = deposit * vaultData.usdyBase / 12
    const monthlyPremium = deposit * avgPremiumAPY / 12
    const monthlyTotal = monthlyUSDY + monthlyPremium
    const annualUSDY = deposit * vaultData.usdyBase
    const annualPremium = deposit * avgPremiumAPY
    const annualTotal = annualUSDY + annualPremium
    return { totalAPY, avgPremiumAPY, monthlyUSDY, monthlyPremium, monthlyTotal, annualUSDY, annualPremium, annualTotal }
  }, [vault, deposit])

  const { totalAPY, avgPremiumAPY, monthlyUSDY, monthlyPremium, monthlyTotal, annualUSDY, annualPremium, annualTotal } = calculations

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 })
  const fmt2 = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <section className="py-24 px-4">
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
                  <div className="text-xs text-white/30 mt-1">USDY ${fmt2(monthlyUSDY)} + Premiums ${fmt2(monthlyPremium)}</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Annual Yield</div>
                  <div className="text-2xl font-bold text-purple-400">${fmt(annualTotal)}</div>
                  <div className="text-xs text-white/30 mt-1">USDY ${fmt(annualUSDY)} + Premiums ${fmt(annualPremium)}</div>
                </div>
              </div>

              {/* Row 2: APY & Exit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.03] p-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Effective APY</div>
                  <div className="text-2xl font-bold text-purple-400">{(totalAPY * 100).toFixed(1)}%</div>
                  <div className="text-xs text-white/30 mt-1">USDY 3.55% + Premiums ~{(avgPremiumAPY * 100).toFixed(0)}%</div>
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
                &#9888;&#65039; APYs are real-time estimates based on current utilization. They fluctuate with market demand. The USDY base yield (3.55%) is independent of Lumina — it comes from Ondo Finance US Treasuries. Premium yield depends on insurance policy volume.
              </p>

              {/* CTA */}
              <div className="text-center pt-2">
                <a
                  href="https://github.com/agustintiberio10/LUMINA-PROTOCOL/blob/main/docs/SKILL-lumina-v2.md"
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
    { name: "Market Crash", probability: "12%", description: "ETH drops 35%. BSS claims trigger. Vault loses ~15% of TVL in one month.", lossPct: 0.15, color: "amber" },
    { name: "Black Swan", probability: "3%", description: "ETH drops 50%+ AND IL spikes simultaneously. Multiple claims trigger.", lossPct: 0.30, color: "red" },
  ],
  "volatile-long": [
    { name: "Normal Year", probability: "85%", description: "No major crashes. Premiums exceed claims. You earn the full estimated yield.", lossPct: 0, color: "green" },
    { name: "Market Crash", probability: "12%", description: "ETH drops 35%. IL + BSS overflow claims trigger against the vault.", lossPct: 0.15, color: "amber" },
    { name: "Black Swan", probability: "3%", description: "Severe market downturn with cascading IL and BSS claims.", lossPct: 0.28, color: "red" },
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
        These scenarios are estimates based on historical DeFi events and actuarial modeling. Past events do not guarantee future outcomes. The Kink Model and protocol safeguards (TWAP, circuit breakers, dual triggers) significantly reduce claim probability.
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
  { range: "90–95%", mult: "2.25–2.63x", meaning: "Near capacity. Very expensive premiums." },
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
            <div className="flex items-center gap-4">
              <input
                type="range" min={0} max={95} step={1} value={utilization}
                onChange={(e) => setUtilization(Number(e.target.value))}
                className={`flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer ${accent === "cyan" ? "accent-cyan-400" : "accent-purple-400"}`}
              />
              <div className="text-sm text-white/70 whitespace-nowrap min-w-[180px] text-right">
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

function AgentSkillsSection({ perspective }: { perspective: Perspective }) {
  const accent = perspective === "protect" ? "cyan" : "purple"
  const borderAccent = accent === "cyan" ? "border-cyan-500/20" : "border-purple-500/20"
  const textAccent = accent === "cyan" ? "text-cyan-400" : "text-purple-400"
  const checkColor = accent === "cyan" ? "text-cyan-400" : "text-purple-400"

  const skillUrl = "lumina-org.com/skill-v2.md"
  const githubUrl = "github.com/agustintiberio10/LUMINA-PROTOCOL/docs/SKILL-lumina-v2.md"

  const hl = (text: string) => {
    const cls = accent === "cyan"
      ? "text-cyan-300 bg-cyan-500/10 px-1 rounded"
      : "text-purple-300 bg-purple-500/10 px-1 rounded"
    return <span className={cls}>{text}</span>
  }

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Connect Your Agent
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          Lumina publishes a machine-readable Skill file. Give it to your agent and it knows what to do.
        </p>

        {/* BLOQUE 1 — Skill Link */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 mb-6">
          <p className="text-sm text-white/60 mb-4">Ask your agent to read:</p>
          <div className="flex items-center gap-2 min-w-0 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 mb-3">
            <span className="text-sm text-white/70 font-mono truncate">{skillUrl}</span>
            <CopyButton text={skillUrl} accent={accent} />
          </div>
          <p className="text-sm text-white/60 mb-3">Or from GitHub:</p>
          <div className="flex items-center gap-2 min-w-0 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3">
            <span className="text-sm text-white/70 font-mono truncate">{githubUrl}</span>
            <CopyButton text={`https://${githubUrl}`} accent={accent} />
          </div>
        </div>

        {/* BLOQUE 2 — Ready-made Prompts */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 mb-6">
          <p className="text-sm text-white/60 mb-4">Or copy a ready-made prompt for your agent:</p>

          {perspective === "protect" ? (
            <div className="space-y-3">
              <div className={`flex items-start gap-3 border ${borderAccent} rounded-lg p-4`}>
                <p className="text-sm text-white/70 leading-relaxed flex-1">
                  Read {skillUrl} and buy {hl("$50K")} of Black Swan coverage for my {hl("ETH")} position for {hl("14 days")}.
                </p>
                <CopyButton text={`Read ${skillUrl} and buy $50K of Black Swan coverage for my ETH position for 14 days.`} accent={accent} />
              </div>
              <div className={`flex items-start gap-3 border ${borderAccent} rounded-lg p-4`}>
                <p className="text-sm text-white/70 leading-relaxed flex-1">
                  Read {skillUrl} and buy {hl("$100K")} of Depeg coverage for my {hl("USDC")} position for {hl("90 days")}.
                </p>
                <CopyButton text={`Read ${skillUrl} and buy $100K of Depeg coverage for my USDC position for 90 days.`} accent={accent} />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`flex items-start gap-3 border ${borderAccent} rounded-lg p-4`}>
                <p className="text-sm text-white/70 leading-relaxed flex-1">
                  Read {skillUrl} and deposit {hl("$10K")} USDY into the {hl("Stable Long")} vault for maximum yield.
                </p>
                <CopyButton text={`Read ${skillUrl} and deposit $10K USDY into the Stable Long vault for maximum yield.`} accent={accent} />
              </div>
              <div className={`flex items-start gap-3 border ${borderAccent} rounded-lg p-4`}>
                <p className="text-sm text-white/70 leading-relaxed flex-1">
                  Read {skillUrl} and deposit {hl("$5K")} USDY into the {hl("Volatile Short")} vault for quick access yield.
                </p>
                <CopyButton text={`Read ${skillUrl} and deposit $5K USDY into the Volatile Short vault for quick access yield.`} accent={accent} />
              </div>
            </div>
          )}
        </div>

        {/* BLOQUE 3 — Compatibility */}
        <CompatibilityCards accent={accent} borderAccent={borderAccent} skillUrl={skillUrl} perspective={perspective} />

        {/* BLOQUE 4 — What the Skill Contains */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 mb-6">
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
            <a
              href="https://github.com/agustintiberio10/LUMINA-PROTOCOL/blob/main/docs/SKILL-lumina-v2.md"
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
          ? "A REST API is like a phone number for software. Your AI agent 'calls' Lumina's server, checks vault yields, and deposits USDY — all in code, no browser needed."
          : "A REST API is like a phone number for software. Your AI agent 'calls' Lumina's server, asks for a quote, and buys insurance — all in code, no browser needed. If your agent can send a message to the internet, it can use Lumina.",
      },
      howLabel: "How it works:",
      steps: isEarn
        ? [
            "Your agent reads the Skill file (a document that teaches it everything about Lumina)",
            "Your agent calls our API: GET /api/v2/vaults → sees all 4 vaults with APY and utilization",
            "Your agent approves USDY and calls the vault contract to deposit",
            "Done. Your USDY earns yield indefinitely. Your agent monitors and manages withdrawals.",
          ]
        : [
            "Your agent reads the Skill file (a document that teaches it everything about Lumina)",
            "Your agent calls our API: GET /api/v2/quote → receives premium price",
            "Your agent approves USDY and calls the smart contract to purchase",
            "Done. Policy is active. Your agent monitors and claims automatically.",
          ],
      needs: [
        "An AI agent (Claude, GPT, any LLM with tool use)",
        "A wallet with USDY on Base L2",
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
  { feature: "Settlement Token", lumina: "USDY (earns 3.55% while idle)", traditional: "ETH/DAI/Various" },
  { feature: "Agent-native", lumina: "✅ Built for M2M", traditional: "❌ Human UI only" },
  { feature: "Skill file", lumina: "✅ 736 lines", traditional: "❌" },
  { feature: "Oracle", lumina: "Chainlink + Phala TEE", traditional: "Proprietary or Chainlink" },
  { feature: "LP Yield", lumina: "11-40% + USDY base", traditional: "~4-8%" },
]

function ComparisonSection({ perspective }: { perspective: Perspective }) {
  const accent = perspective === "protect" ? "cyan" : "purple"
  const borderTop = accent === "cyan" ? "border-t-cyan-500" : "border-t-purple-500"
  const checkAccent = accent === "cyan" ? "text-cyan-400" : "text-purple-400"
  const colBg = accent === "cyan" ? "bg-cyan-500/[0.03]" : "bg-purple-500/[0.03]"
  const colBorder = accent === "cyan" ? "border-l border-r border-cyan-500/20" : "border-l border-r border-purple-500/20"

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
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs text-white/40 uppercase tracking-wider font-medium py-3 px-4 w-[180px]">Feature</th>
                <th className={`text-left text-xs uppercase tracking-wider font-medium py-3 px-4 ${colBg} ${borderTop} border-t-2 ${colBorder} ${checkAccent}`}>M2M Insurance — Lumina</th>
                <th className="text-left text-xs text-white/40 uppercase tracking-wider font-medium py-3 px-4">Traditional Web3 Insurance</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-white/5">
                  <td className="py-3 px-4 text-white/50 font-medium">{row.feature}</td>
                  <td className={`py-3 px-4 ${colBg} ${colBorder} text-white/80 font-medium`}>
                    {row.lumina.startsWith("✅") ? <><span className={checkAccent}>✅</span>{row.lumina.slice(1)}</> : row.lumina}
                  </td>
                  <td className="py-3 px-4 text-white/40">
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
    "TWAP price verification (anti flash-crash)",
    "L2 Sequencer uptime check with 1h grace period",
    "Circuit breakers on extreme volatility",
    "Waiting periods (24h Depeg, 14d Exploit)",
    "European-style IL resolution (48h window)",
    "$50K per-wallet cap on Exploit Shield",
    "Dual trigger (Chainlink + Phala TEE) for exploits",
    "Soulbound vault shares (anti-cooldown bypass)",
  ]

  return (
    <section className="py-24 px-4">
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
            href="https://github.com/agustintiberio10/LUMINA-PROTOCOL"
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
  { q: "What is Lumina Protocol?", a: "Lumina is parametric insurance built exclusively for AI agents on Base L2. Agents buy coverage, oracles verify triggers, and payouts are instant. No claims process, no human judges, no disputes. Settlement is in USDY, a yield-bearing stablecoin by Ondo Finance." },
  { q: "Can a human buy a policy or deposit from this website?", a: "No. This website is informational only. All operations — buying insurance, depositing in vaults, claiming payouts, withdrawing — are performed by your AI agent. The website explains, convinces, and provides the Skill file. Your agent does the rest." },
  { q: "What is USDY?", a: "USDY is Ondo Finance's yield-bearing stablecoin, backed by US Treasuries. It currently earns ~3.55% APY automatically. When you deposit USDY in a Lumina vault, you earn the USDY base yield PLUS insurance premiums on top." },
  { q: "What is the protocol fee?", a: "Lumina charges 3% on premiums (when your agent buys insurance) and 3% on payouts (when your agent collects a claim). This is the protocol's revenue model. For LPs, the fee reduces yield by ~0.3% — barely noticeable." },
  { q: "Is my money safe?", a: "Your funds are held in audited smart contracts on Base L2 — not in anyone's wallet. 24 contracts were audited across 3 phases by Claude Code Security + Gemini Pro with 0 Critical, 0 High, 0 Medium findings. The protocol uses TWAP verification, circuit breakers, L2 sequencer checks, and waiting periods to prevent manipulation." },
]

const FAQ_PROTECT = [
  { q: "What happens if the L2 sequencer goes down during a crash?", a: "The oracle blocks stale prices until 1 hour after sequencer recovery. You have a 24-hour grace period after policy expiry to submit your claim. Even with sequencer downtime, you're protected." },
  { q: "Can I cancel a policy?", a: "No. Policies are non-cancellable. The premium is paid upfront and non-refundable. This is by design — it ensures the vault always has premium income to offset potential claims." },
  { q: "How does auto-repurchase work?", a: "Your agent monitors policy expiry and buys a new policy before the current one expires. For Depeg (24h waiting), your agent repurchases at least 24h before expiry. For Exploit (14d waiting), at least 14 days before. The Skill file has the complete logic." },
  { q: "What if the trigger is met but my agent doesn't claim?", a: "You have 24 hours after policy expiry (the grace period) to submit the claim. If your agent misses it, the policy expires and funds return to the vault. Set up monitoring alerts in your agent to avoid this." },
]

const FAQ_EARN = [
  { q: "Is the APY guaranteed?", a: "No. The USDY base yield (~3.55%) comes from Ondo Finance and depends on US Treasury rates. The premium yield depends on insurance policy volume and vault utilization. Both fluctuate. The numbers shown are estimates based on current conditions." },
  { q: "What's the worst that can happen as an LP?", a: "In a severe event (market crash + stablecoin depeg simultaneously), a vault could lose 20-30% of TVL. This is extremely rare. In normal years, premiums far exceed claims. The Risk Scenarios section in the Yield Calculator shows detailed probabilities." },
  { q: "What is a cooldown? Is my money locked?", a: "No lock. Cooldown is an EXIT NOTICE. You deposit indefinitely and earn yield. When you want to leave, you give notice (30-365 days depending on vault). During cooldown, you KEEP earning. After cooldown, you withdraw everything." },
  { q: "Can I switch between vaults?", a: "Not directly. You request withdrawal from one vault, wait for cooldown, then deposit into another. Your agent handles all of this automatically." },
  { q: "Why are shares soulbound?", a: "To prevent cooldown bypass. If you could sell shares on a DEX, someone could buy 'mature' shares about to finish cooldown, defeating the purpose of locking capital to back policies." },
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

function HowCard({ step, title, description, accent }: { step: string; title: string; description: string; accent: "cyan" | "purple" }) {
  const borderColor = accent === "cyan" ? "border-cyan-500/20 hover:border-cyan-500/40" : "border-purple-500/20 hover:border-purple-500/40"
  const stepColor = accent === "cyan" ? "text-cyan-500" : "text-purple-500"

  return (
    <div className={`p-6 rounded-2xl bg-white/[0.02] border ${borderColor} transition-all duration-300`}>
      <span className={`text-sm font-mono ${stepColor} mb-3 block`}>{step}</span>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-white/50 text-[15px] leading-relaxed">{description}</p>
    </div>
  )
}
