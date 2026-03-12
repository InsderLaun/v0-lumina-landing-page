"use client"

import { useState } from "react"
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

      {/* VAULTS */}
      {perspective === "earn" && (
        <VaultsSection />
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
  const product = PRODUCTS[active]

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

            {/* Technical Details */}
            <TechnicalDetails details={product.technicalDetails} />

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
    apy: "12-15%",
    base: "3.55%",
    premiums: "9-11%",
    backs: ["BSS 7-30d", "IL Index 14-30d"],
    risk: "Higher",
    riskColor: "text-red-400",
    bestFor: "Quick access traders who want short commitment",
  },
  {
    name: "Volatile Long",
    symbol: "lvlUSDY",
    cooldown: "90 days",
    apy: "15-18%",
    base: "3.55%",
    premiums: "12-14%",
    backs: ["IL Index 60-90d", "BSS overflow"],
    risk: "Higher",
    riskColor: "text-red-400",
    bestFor: "Balanced investors who want higher yield",
  },
  {
    name: "Stable Short",
    symbol: "lssUSDY",
    cooldown: "90 days",
    apy: "11-14%",
    base: "3.55%",
    premiums: "8-10%",
    backs: ["Depeg Shield 14-90d"],
    risk: "Low",
    riskColor: "text-green-400",
    bestFor: "Conservative investors",
  },
  {
    name: "Stable Long",
    symbol: "lslUSDY",
    cooldown: "365 days",
    apy: "18-26%",
    base: "3.55%",
    premiums: "15-22%",
    backs: ["Depeg 365d", "Exploit Shield 90-365d"],
    risk: "Very low",
    riskColor: "text-green-400",
    bestFor: "Institutions, DAOs, family offices — set and forget",
  },
]

function VaultsSection() {
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
              className="rounded-2xl bg-white/[0.02] border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 p-6 flex flex-col"
            >
              {/* APY */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-purple-400">{v.apy}</span>
                <span className="text-sm text-white/40 ml-2">APY</span>
              </div>
              <p className="text-sm text-white/50 mb-4">
                USDY {v.base} + Premiums {v.premiums}
              </p>

              {/* Name + Symbol */}
              <h3 className="text-lg font-semibold mb-1">{v.name}</h3>
              <span className="text-xs font-mono text-purple-400/60 mb-4">{v.symbol}</span>

              {/* Cooldown */}
              <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Cooldown: {v.cooldown}
              </div>

              {/* Backs */}
              <div className="mb-3">
                <span className="text-xs uppercase tracking-wider text-white/30 font-medium block mb-1">Backs</span>
                <div className="flex flex-wrap gap-1">
                  {v.backs.map((b) => (
                    <span key={b} className="text-xs bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full">{b}</span>
                  ))}
                </div>
              </div>

              {/* Risk */}
              <div className="mb-3">
                <span className="text-xs uppercase tracking-wider text-white/30 font-medium block mb-1">Risk</span>
                <span className={`text-sm font-medium ${v.riskColor}`}>{v.risk}</span>
              </div>

              {/* Best for */}
              <p className="text-sm text-white/40 italic mt-auto">{v.bestFor}</p>
            </motion.div>
          ))}
        </div>

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

function TechnicalDetails({ details }: { details: string[][] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-white/50 hover:text-white/70 transition-colors"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
        Technical Details
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 bg-white/[0.03] border-t border-white/10 rounded-lg p-4 space-y-2">
              {details.map(([label, value]) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                  <span className="text-xs uppercase tracking-wider text-white/40 sm:w-44 shrink-0 font-medium">{label}</span>
                  <span className="text-sm text-white/70">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
