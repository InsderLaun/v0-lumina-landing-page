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
    </main>
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
