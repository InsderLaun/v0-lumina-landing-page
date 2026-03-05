"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
    ShieldAlert,
    CircleDollarSign,
    Scale,
    Flame,
    TrendingDown,
    Unlink,
    ChevronDown,
} from "lucide-react"
import { usePerspective } from "./perspective-context"
import { PRODUCTS } from "@/lib/products"
import type { Product } from "@/lib/products"

const ICONS: Record<string, React.ElementType> = {
    ShieldAlert,
    CircleDollarSign,
    Scale,
    Flame,
    TrendingDown,
    Unlink,
}

const DISPLAY_PRODUCTS = [
    PRODUCTS[0],
    {
        ...PRODUCTS[1],
        name: "Stablecoin Depeg Cover",
        description: "Covers USDC, USDT and DAI if they lose their dollar peg",
        premiumRange: [1.3, 7.8] as [number, number],
        badges: ["USDC dropped to $0.87 in March 2023"],
        expandedDetail:
            "Trigger: stablecoin price stays below threshold ($0.99/$0.97/$0.95/$0.90) for 4 continuous hours per Chainlink. Extended duration up to 365 days with 35% discount. Risk multipliers: USDC 1.0x, USDT 1.3x, DAI 1.2x.",
    } as Product,
    PRODUCTS[4],
    PRODUCTS[5],
    PRODUCTS[6],
    PRODUCTS[7],
]

interface ProductGridProps {
    onScrollToCalculator: () => void
}

export function ProductGrid({ onScrollToCalculator }: ProductGridProps) {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const { perspective } = usePerspective()

    return (
        <section ref={ref} id="products" className="py-24 relative scroll-mt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        8 Parametric Products.{" "}
                        <span className="text-lumina-cyan">One API.</span>
                    </h2>
                    <p className="text-lg text-lumina-muted max-w-2xl mx-auto">
                        Each product has a specific trigger verified by Chainlink.
                        If the condition is met, the payout is automatic.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                    {DISPLAY_PRODUCTS.map((product, i) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            index={i}
                            isInView={isInView}
                            perspective={perspective}
                            onScrollToCalculator={onScrollToCalculator}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

function ProductCard({
    product,
    index,
    isInView,
    perspective,
    onScrollToCalculator,
}: {
    product: Product
    index: number
    isInView: boolean
    perspective: "agent" | "lp"
    onScrollToCalculator: () => void
}) {
    const [expanded, setExpanded] = useState(false)
    const Icon = ICONS[product.icon] || ShieldAlert
    const borderColor = perspective === "agent" ? "lumina-cyan" : "lumina-purple"
    const accentColor = perspective === "agent" ? "text-lumina-cyan" : "text-lumina-purple"

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative rounded-xl bg-[#0d0d14] border border-white/5 p-6 cursor-pointer hover:border-${borderColor}/30 transition-all duration-300 flex flex-col`}
            onClick={() => setExpanded(!expanded)}
            style={{
                boxShadow: expanded
                    ? perspective === "agent"
                        ? "0 0 30px rgba(0,212,255,0.08)"
                        : "0 0 30px rgba(139,92,246,0.08)"
                    : "none",
            }}
        >
            {/* Content area — flex-1 so CTA stays at bottom */}
            <div className="flex-1 transition-all duration-300">
                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${perspective === "agent" ? "bg-lumina-cyan/10" : "bg-lumina-purple/10"
                        }`}>
                        <Icon className={`w-5 h-5 ${perspective === "agent" ? "text-lumina-cyan" : "text-lumina-purple"
                            }`} />
                    </div>
                    {product.badges && product.badges.length > 0 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-lumina-amber/10 text-lumina-amber border border-lumina-amber/20">
                            {product.badges[0]}
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>

                <AnimatePresence mode="wait">
                    {perspective === "agent" ? (
                        <motion.div
                            key="agent"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.25 }}
                        >
                            <p className="text-base text-lumina-muted mb-4">{product.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <Tag label={`Premium ${product.premiumRange[0]}-${product.premiumRange[1]}%`} />
                                <Tag label={`Deductible ${product.deductiblePct}%`} />
                                <Tag label={`${product.durationRange[0]}-${product.durationRange[1]}d`} />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="lp"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.25 }}
                        >
                            <p className="text-base text-lumina-muted mb-2">{product.lpView.tagline}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <Tag label={`Yield ${product.premiumRange[0]}-${product.premiumRange[1]}%`} />
                                <Tag label={`Max loss ${100 - product.deductiblePct}%`} />
                                <RiskTag level={product.lpView.riskLevel} />
                                <Tag label={`${product.durationRange[0]}-${product.durationRange[1]}d`} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* CTA — scrolls to calculator */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                <button
                    onClick={(e) => { e.stopPropagation(); onScrollToCalculator() }}
                    className={`text-sm font-medium ${accentColor} hover:underline`}
                >
                    {perspective === "agent" ? "Calculate Premium →" : "Calculate Yield →"}
                </button>
                <ChevronDown
                    className={`w-4 h-4 text-lumina-muted transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                />
            </div>

            {/* Expanded detail */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 mt-1 border-t border-white/5">
                            <p className="text-base text-lumina-muted leading-relaxed">
                                {product.expandedDetail}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-1">
                                {product.oracleFeeds.map((feed) => (
                                    <span
                                        key={feed}
                                        className="text-xs font-mono px-2 py-0.5 bg-white/5 rounded text-lumina-muted"
                                    >
                                        {feed}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function Tag({ label }: { label: string }) {
    return (
        <span className="text-sm px-2.5 py-1 rounded bg-white/5 text-lumina-muted">
            {label}
        </span>
    )
}

function RiskTag({ level }: { level: string }) {
    const colors: Record<string, string> = {
        Low: "text-lumina-green bg-lumina-green/10",
        Medium: "text-lumina-amber bg-lumina-amber/10",
        Higher: "text-red-400 bg-red-400/10",
    }
    const icons: Record<string, string> = {
        Low: "🟢",
        Medium: "⚠️",
        Higher: "🔴",
    }
    return (
        <span className={`text-sm px-2.5 py-1 rounded ${colors[level] || ""}`}>
            {icons[level] || ""} {level}
        </span>
    )
}
