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
            <a href="mailto:hello@lumina-org.com" className="px-8 py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all">
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
