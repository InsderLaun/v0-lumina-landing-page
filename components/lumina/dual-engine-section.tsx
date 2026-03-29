"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ShieldCheck, Coins, Check, AlertTriangle, Copy, CheckCheck, BookOpen, FileCode, ExternalLink } from "lucide-react"
import { usePerspective } from "./perspective-context"
import { GITHUB_URL } from "@/lib/constants"

const PROMPT_TEXT =
    "You are an AI agent with access to HTTP requests. Connect to Lumina Protocol's REST API at https://lumina-protocol-production.up.railway.app/api/v1/products to discover parametric insurance products. Full documentation: https://github.com/org-lumina/LUMINA-PROTOCOL/tree/main/docs"

interface DualEngineSectionProps {
    onRegisterAgent: () => void
}

export function DualEngineSection({ onRegisterAgent }: DualEngineSectionProps) {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const { perspective } = usePerspective()

    return (
        <section ref={ref} id="split-path" className="py-20 scroll-mt-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 transition-all duration-300">
                <AnimatePresence mode="wait">
                    {perspective === "agent" ? (
                        <motion.div
                            key="agent-intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Agent-only banner */}
                            <div className="rounded-xl bg-lumina-cyan/[0.04] border border-lumina-cyan/15 p-5 mb-8">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-lumina-cyan shrink-0 mt-0.5" />
                                    <p className="text-base text-lumina-text/80 leading-relaxed">
                                        Humans don&apos;t buy policies directly. You register your agent,
                                        set limits, and your agent purchases coverage autonomously via API.
                                    </p>
                                </div>
                            </div>

                            {/* ── Onboard Your Agent Card ── */}
                            <OnboardAgentCard onRegisterAgent={onRegisterAgent} />

                            {/* Agent intro card */}
                            <div className="rounded-2xl bg-[#111118] border border-white/5 p-8 mt-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-lumina-cyan/10 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-lumina-cyan" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Protect Your Agent&apos;s Blind Spots</h3>
                                </div>
                                <p className="text-base text-lumina-muted leading-relaxed mb-6">
                                    Your AI agent operates 24/7 in volatile markets. Lumina&apos;s parametric
                                    policies trigger automatically — no claims, no humans in the loop.
                                </p>
                                <ul className="space-y-3 mb-6">
                                    {[
                                        "8 risk products covering common DeFi threats",
                                        "Premiums from 1.3% to 10%",
                                        "Automatic payout via AutoResolver + Chainlink",
                                        "Works with Virtuals, ElizaOS, LangChain, or any framework",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-lumina-cyan shrink-0 mt-1" />
                                            <span className="text-base text-lumina-text/80">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => {
                                        const el = document.querySelector("#products")
                                        if (el) el.scrollIntoView({ behavior: "smooth" })
                                    }}
                                    className="px-6 py-3 rounded-lg bg-lumina-cyan/10 text-lumina-cyan font-semibold text-base border border-lumina-cyan/20 hover:bg-lumina-cyan/15 transition-all"
                                >
                                    See Products ↓
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="lp-intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* LP intro card */}
                            <div className="rounded-2xl bg-[#111118] border border-white/5 p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-lumina-purple/10 flex items-center justify-center">
                                        <Coins className="w-5 h-5 text-lumina-purple" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Back the Machine Economy. Earn Real Yield.</h3>
                                </div>
                                <p className="text-base text-lumina-muted leading-relaxed mb-6">
                                    Deposit USDC into isolated pools. When agents buy policies,
                                    you earn the premium. Real yield — not token emissions.
                                </p>
                                <ul className="space-y-3 mb-6">
                                    {[
                                        "Each pool is ring-fenced — no cross-contamination",
                                        "Circuit breaker protects against systemic events",
                                        "Lumina takes only 3% of premiums as protocol fee",
                                        "Transparent risk: you know exactly what triggers a payout",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-lumina-purple shrink-0 mt-1" />
                                            <span className="text-base text-lumina-text/80">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => {
                                        const el = document.querySelector("#calculator")
                                        if (el) el.scrollIntoView({ behavior: "smooth" })
                                    }}
                                    className="px-6 py-3 rounded-lg bg-lumina-purple/10 text-lumina-purple font-semibold text-base border border-lumina-purple/20 hover:bg-lumina-purple/15 transition-all"
                                >
                                    See Yield Options ↓
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}

/* ─── Onboard Your Agent Card ─── */

function OnboardAgentCard({ onRegisterAgent }: { onRegisterAgent: () => void }) {
    const [mode, setMode] = useState<"prompt" | "manual">("prompt")
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(PROMPT_TEXT)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
    }

    return (
        <div className="rounded-2xl bg-gradient-to-br from-lumina-cyan/[0.04] to-lumina-purple/[0.02] border border-lumina-cyan/15 overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-0">
                <h3 className="text-xl font-bold mb-1">🤖 Onboard Your Agent</h3>
                <p className="text-sm text-lumina-muted">Choose how to connect your agent to Lumina</p>
            </div>

            {/* Mode tabs */}
            <div className="flex mx-6 mt-4 bg-white/[0.03] rounded-lg p-1 border border-white/5">
                {(["prompt", "manual"] as const).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === m
                            ? "bg-lumina-cyan/15 text-lumina-cyan border border-lumina-cyan/20"
                            : "text-lumina-muted hover:text-lumina-text border border-transparent"
                            }`}
                    >
                        {m === "prompt" ? "⚡ Prompt" : "🔧 Manual"}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    {mode === "prompt" ? (
                        <motion.div
                            key="prompt"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-5"
                        >
                            {/* Step 1 */}
                            <div className="flex items-start gap-3">
                                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-lumina-cyan/10 text-lumina-cyan text-sm font-bold shrink-0">1</span>
                                <div className="flex-1">
                                    <p className="text-base text-lumina-text mb-2">Copy this prompt and send it to your agent:</p>
                                    <div className="relative rounded-lg bg-[#1a1a2e] border border-white/10 p-4 pr-12">
                                        <p className="text-sm font-mono text-lumina-text/80 leading-relaxed break-all">
                                            {PROMPT_TEXT}
                                        </p>
                                        <button
                                            onClick={handleCopy}
                                            className="absolute top-3 right-3 p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition"
                                            title="Copy to clipboard"
                                        >
                                            {copied ? (
                                                <CheckCheck className="w-4 h-4 text-lumina-green" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-lumina-muted" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-start gap-3">
                                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-lumina-cyan/10 text-lumina-cyan text-sm font-bold shrink-0">2</span>
                                <p className="text-base text-lumina-text/80">The agent registers itself and sends you the API key</p>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-start gap-3">
                                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-lumina-cyan/10 text-lumina-cyan text-sm font-bold shrink-0">3</span>
                                <p className="text-base text-lumina-text/80">Verify in the dashboard</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="manual"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-5"
                        >
                            {/* Step 0 — framework-agnostic */}
                            <div className="rounded-lg bg-lumina-cyan/[0.04] border border-lumina-cyan/10 p-3">
                                <p className="text-sm text-lumina-text/80">
                                    <span className="font-semibold text-lumina-cyan">Works with any framework:</span>{" "}
                                    REST API (HTTP), Virtuals (ACP), ElizaOS (Plugin), LangChain (Tools), or any custom agent
                                </p>
                            </div>

                            {/* Step 1 */}
                            <div className="flex items-start gap-3">
                                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-lumina-cyan/10 text-lumina-cyan text-sm font-bold shrink-0">1</span>
                                <div>
                                    <p className="text-base text-lumina-text/80">
                                        Read the documentation{" "}
                                        <a
                                            href={`${GITHUB_URL}/tree/main/docs/SKILL-lumina-insurance.md`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lumina-cyan hover:underline font-medium"
                                        >
                                            skill.md →
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-start gap-3">
                                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-lumina-cyan/10 text-lumina-cyan text-sm font-bold shrink-0">2</span>
                                <div>
                                    <p className="text-base text-lumina-text/80 mb-2">Register your agent via the web</p>
                                    <button
                                        onClick={onRegisterAgent}
                                        className="px-4 py-2 rounded-lg bg-lumina-cyan/10 text-lumina-cyan font-medium text-sm border border-lumina-cyan/20 hover:bg-lumina-cyan/15 transition-all"
                                    >
                                        Register Agent →
                                    </button>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-start gap-3">
                                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-lumina-cyan/10 text-lumina-cyan text-sm font-bold shrink-0">3</span>
                                <p className="text-base text-lumina-text/80">Configure limits and allowed products</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom links */}
                <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-white/5">
                    <a
                        href={`${GITHUB_URL}/tree/main/docs/SKILL-lumina-insurance.md`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-lumina-text hover:border-lumina-cyan/20 hover:text-lumina-cyan transition-all"
                    >
                        <BookOpen className="w-4 h-4" />
                        skill.md
                        <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                    <a
                        href={`${GITHUB_URL}/tree/main/docs/API-REFERENCE.md`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-lumina-text hover:border-lumina-cyan/20 hover:text-lumina-cyan transition-all"
                    >
                        <FileCode className="w-4 h-4" />
                        API Reference
                        <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                </div>

                {/* Footer text */}
                <p className="text-sm text-lumina-muted/60 mt-4">
                    Lumina works with any agent that makes HTTP requests — Virtuals, ElizaOS, LangChain, NEAR AI, or your own custom bot.
                </p>
            </div>
        </div>
    )
}
