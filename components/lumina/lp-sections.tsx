"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
    ShieldAlert,
    CircleDollarSign,
    Scale,
    Flame,
    TrendingDown,
    Unlink,
    Coins,
    ArrowRight,
} from "lucide-react"
import { PRODUCTS } from "@/lib/products"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

const ICONS: Record<string, React.ElementType> = {
    ShieldAlert,
    CircleDollarSign,
    Scale,
    Flame,
    TrendingDown,
    Unlink,
}

const RISK_COLORS: Record<string, string> = {
    Low: "text-lumina-green bg-lumina-green/10 border-lumina-green/20",
    Medium: "text-lumina-amber bg-lumina-amber/10 border-lumina-amber/20",
    Higher: "text-red-400 bg-red-400/10 border-red-400/20",
    High: "text-red-400 bg-red-400/10 border-red-400/20",
}

const RISK_EMOJI: Record<string, string> = {
    Low: "🟢",
    Medium: "🟡",
    Higher: "🔴",
    High: "🔴",
}

/* ─── LP Hero ─── */
export function LPHeroSection() {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    return (
        <section ref={ref} className="py-20 scroll-mt-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Earn Real Yield.{" "}
                        <span className="text-lumina-purple">Not Token Emissions.</span>
                    </h2>
                    <p className="text-lg text-lumina-muted max-w-3xl mx-auto leading-relaxed">
                        Deposit USDC into isolated insurance pools. Earn premiums from AI agents
                        that buy parametric coverage. Each pool is independent — one bad outcome
                        doesn&apos;t affect your other positions.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}

/* ─── LP Pool Cards ─── */
interface LPPoolGridProps {
    onScrollToCalculator: () => void
}

export function LPPoolGrid({ onScrollToCalculator }: LPPoolGridProps) {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    return (
        <section ref={ref} className="py-24 relative scroll-mt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        8 Insurance Pools.{" "}
                        <span className="text-lumina-purple">Real Premiums.</span>
                    </h2>
                    <p className="text-lg text-lumina-muted max-w-2xl mx-auto">
                        Each pool is isolated. Choose the risk you understand,
                        deposit USDC, and earn when nothing happens.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PRODUCTS.map((product, i) => {
                        const Icon = ICONS[product.icon] || ShieldAlert
                        const risk = product.lpView.riskLevel
                        const midPremium = ((product.premiumRange[0] + product.premiumRange[1]) / 2).toFixed(1)

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.4, delay: i * 0.07 }}
                                className="rounded-xl bg-[#0d0d14] border border-white/5 p-5 flex flex-col hover:border-lumina-purple/30 transition-colors duration-300"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-lg bg-lumina-purple/10 flex items-center justify-center">
                                        <Icon className="w-4.5 h-4.5 text-lumina-purple" />
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${RISK_COLORS[risk] || ""}`}>
                                        {RISK_EMOJI[risk]} {risk}
                                    </span>
                                </div>

                                <h3 className="text-base font-semibold mb-1">{product.name} Pool</h3>
                                <p className="text-sm text-lumina-muted mb-3 flex-1">
                                    {product.lpView.tagline}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-lumina-muted">Premiums</span>
                                        <span className="text-lumina-text font-medium">
                                            {product.premiumRange[0]}-{product.premiumRange[1]}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-lumina-muted">Est. APY</span>
                                        <span className="text-lumina-purple font-medium">
                                            ~{midPremium}% at 30% util.
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-lumina-muted">Max loss</span>
                                        <span className="text-lumina-text font-medium">
                                            {100 - product.deductiblePct}% of deposit
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={onScrollToCalculator}
                                    className="w-full py-2 rounded-lg bg-lumina-purple/10 text-lumina-purple text-sm font-medium border border-lumina-purple/20 hover:bg-lumina-purple/15 transition-all mt-auto"
                                >
                                    Deposit USDC <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                                </button>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

/* ─── Why Lumina Pools ─── */
export function LPComparisonSection() {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    const rows = [
        { label: "Source of yield", lumina: "Real premiums from agents", others: "Token emissions + lending interest" },
        { label: "USDC Lending APY", lumina: "~8-16% (at 30% utilization)", others: "~3-5% APY" },
        { label: "Risk isolation", lumina: "Each pool is independent", others: "Shared risk across protocol" },
        { label: "Contagion risk", lumina: "None — pools are ring-fenced", others: "Bad debt can spread" },
        { label: "Protocol fee", lumina: "3% of premiums", others: "Variable" },
    ]

    return (
        <div ref={ref} className="py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Why Lumina{" "}
                        <span className="text-lumina-purple">Pools?</span>
                    </h2>
                    <p className="text-lg text-lumina-muted">
                        Real yield from real premiums — not inflationary tokens.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="rounded-2xl bg-[#0d0d14] border border-white/5 overflow-hidden"
                >
                    <div className="grid grid-cols-3 border-b border-white/10 text-sm font-medium">
                        <div className="px-5 py-3 text-lumina-muted" />
                        <div className="px-5 py-3 text-lumina-purple border-l border-white/5">Lumina</div>
                        <div className="px-5 py-3 text-lumina-muted border-l border-white/5">Aave / Compound</div>
                    </div>
                    {rows.map((row) => (
                        <div key={row.label} className="grid grid-cols-3 border-b border-white/5 text-sm">
                            <div className="px-5 py-3.5 text-lumina-text font-medium">{row.label}</div>
                            <div className="px-5 py-3.5 text-lumina-text/80 border-l border-white/5">{row.lumina}</div>
                            <div className="px-5 py-3.5 text-lumina-muted border-l border-white/5">{row.others}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

/* ─── LP CTA ─── */
export function LPCtaSection({ onDepositLP }: { onDepositLP: () => void }) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const { isConnected } = useAccount()
    const { openConnectModal } = useConnectModal()

    return (
        <div ref={ref} className="py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="rounded-2xl bg-gradient-to-br from-lumina-purple/[0.06] to-lumina-cyan/[0.03] border border-lumina-purple/15 p-10 text-center"
                >
                    <Coins className="w-10 h-10 text-lumina-purple mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Start Earning Yield</h3>
                    <p className="text-base text-lumina-muted mb-6 max-w-lg mx-auto">
                        Connect your wallet, choose a pool, and deposit USDC.
                        You start earning premiums immediately when agents buy coverage.
                    </p>
                    <button
                        onClick={() => isConnected ? onDepositLP() : openConnectModal?.()}
                        className="px-8 py-3.5 rounded-lg bg-lumina-purple text-white font-semibold text-base hover:shadow-glow-purple hover:scale-[1.02] transition-all duration-300"
                    >
                        {isConnected ? "Deposit USDC" : "Connect Wallet"} <ArrowRight className="w-4 h-4 inline ml-1" />
                    </button>
                </motion.div>
            </div>
        </div>
    )
}
