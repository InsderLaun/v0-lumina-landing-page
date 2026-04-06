"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { usePerspective } from "./perspective-context"
import { PRODUCTS } from "@/lib/products"
import { calculatePremium, calculateYield } from "@/lib/pricing"
import { AnimatedCounter } from "./animated-counter"

export function CalculatorSection() {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const { perspective } = usePerspective()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    return (
        <section ref={ref} className="py-24 relative" id="calculator">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        {perspective === "agent" ? (
                            <>Premium <span className="text-lumina-cyan">Calculator</span></>
                        ) : (
                            <>Yield <span className="text-lumina-purple">Calculator</span></>
                        )}
                    </h2>
                    <p className="text-lg text-lumina-muted max-w-2xl mx-auto">
                        {perspective === "agent"
                            ? "Estimate your insurance premium in real-time with our pricing engine."
                            : "Earn real yield by underwriting agent risk — similar to selling insurance premiums. You earn when nothing happens."}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {mounted ? (
                        perspective === "agent" ? <AgentCalculator /> : <LPCalculator />
                    ) : (
                        <div className="rounded-2xl bg-[#0d0d14] border border-white/5 p-12 text-center text-lumina-muted animate-pulse">
                            Loading calculator…
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    )
}

function AgentCalculator() {
    const [productId, setProductId] = useState("BCS-001")
    const [coverage, setCoverage] = useState(10000)
    const [duration, setDuration] = useState(30)
    const [thresholdBps, setThresholdBps] = useState(2000)

    const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0]

    const result = calculatePremium({
        productId,
        coverageAmount: coverage,
        durationDays: duration,
        thresholdBps,
    })

    return (
        <div className="rounded-2xl bg-[#0d0d14] border border-lumina-cyan/10 p-6 sm:p-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    {/* Product */}
                    <div>
                        <label className="block text-xs text-lumina-muted uppercase tracking-wider mb-2">
                            Product
                        </label>
                        <select
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-lumina-text focus:border-lumina-cyan/30 focus:outline-none transition-colors"
                        >
                            {PRODUCTS.map((p) => (
                                <option key={p.id} value={p.id} className="bg-[#111118]">
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Coverage amount */}
                    <div>
                        <label className="block text-xs text-lumina-muted uppercase tracking-wider mb-2">
                            Coverage Amount: ${coverage.toLocaleString('en-US')} USDC
                        </label>
                        <input
                            type="range"
                            min={100}
                            max={100000}
                            step={100}
                            value={coverage}
                            onChange={(e) => setCoverage(Number(e.target.value))}
                            className="w-full accent-[#00d4ff] h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-lumina-muted mt-1">
                            <span>$100</span>
                            <span>$100,000</span>
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-xs text-lumina-muted uppercase tracking-wider mb-2">
                            Duration: {duration} days
                        </label>
                        <input
                            type="range"
                            min={product.durationRange[0]}
                            max={product.durationRange[1]}
                            step={1}
                            value={Math.min(duration, product.durationRange[1])}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full accent-[#00d4ff] h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-lumina-muted mt-1">
                            <span>{product.durationRange[0]}d</span>
                            <span>{product.durationRange[1]}d</span>
                        </div>
                    </div>

                    {/* Threshold */}
                    <div>
                        <label className="block text-xs text-lumina-muted uppercase tracking-wider mb-2">
                            Threshold
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {product.thresholdOptions.map((opt) => {
                                const bps = parseThreshold(opt)
                                return (
                                    <button
                                        key={opt}
                                        onClick={() => setThresholdBps(bps)}
                                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${thresholdBps === bps
                                            ? "bg-lumina-cyan/20 text-lumina-cyan border border-lumina-cyan/30"
                                            : "bg-white/5 text-lumina-muted border border-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    <ResultCard
                        label="Estimated Premium"
                        value={`$${result.premium.toLocaleString('en-US')} USDC`}
                        sub={`${(result.premiumRate / 100).toFixed(1)}% of coverage`}
                        color="cyan"
                    />
                    <ResultCard
                        label="Max Payout if Triggered"
                        value={`$${result.maxPayout.toLocaleString('en-US')} USDC`}
                        sub={`Coverage minus ${result.deductiblePct}% deductible`}
                        color="green"
                    />
                    <ResultCard
                        label="Trigger Condition"
                        value={result.triggerDescription}
                        color="amber"
                    />
                    <ResultCard
                        label="Cost per Day"
                        value={`$${result.costPerDay.toFixed(2)} USDC/day`}
                        color="default"
                    />
                </div>
            </div>
        </div>
    )
}

/* ── Per-product historical risk data ── */
const RISK_DATA: Record<string, { level: string; color: "green" | "amber" | "red"; emoji: string; description: string }> = {
    "BCS-001": {
        level: "Medium",
        color: "amber",
        emoji: "🟡",
        description: "Liquidation cascades occur 3-6 times/year in pronounced bear markets",
    },
    "DEPEG-USDC-001": {
        level: "Very Low",
        color: "green",
        emoji: "🟢",
        description: "USDC lost its peg only once (SVB, Mar 2023)",
    },
    "DEPEG-USDT-001": {
        level: "Low",
        color: "green",
        emoji: "🟢",
        description: "USDT has had 2-3 mild depeg events since 2018, none exceeded 10% for more than 24 hours",
    },
    "DEPEG-DAI-001": {
        level: "Low",
        color: "green",
        emoji: "🟢",
        description: "DAI has maintained its peg consistently. Deviations >3% are rare and short-lived",
    },
    "ILPROT-001": {
        level: "High",
        color: "red",
        emoji: "🔴",
        description: "Severe impermanent loss occurs in pools with high price volatility",
    },
}

const DEFAULT_RISK = RISK_DATA["BCS-001"]

function LPCalculator() {
    const [productId, setProductId] = useState("BCS-001")
    const [deposit, setDeposit] = useState(10000)
    const [utilization, setUtilization] = useState(30)
    const [realUtilization, setRealUtilization] = useState<number | null>(null)

    useEffect(() => {
        fetch("https://lumina-protocol-production.up.railway.app/api/v2/dashboard")
            .then(res => res.json())
            .then(data => {
                if (data.vaults && data.vaults.length > 0) {
                    let totalAssets = 0
                    let totalAllocated = 0
                    for (const v of data.vaults) {
                        if (!v.error) {
                            totalAssets += Number(v.totalAssets)
                            totalAllocated += Number(v.allocatedAssets)
                        }
                    }
                    if (totalAssets > 0) {
                        const real = Math.round((totalAllocated / totalAssets) * 100)
                        setRealUtilization(real)
                        setUtilization(real)
                    }
                }
            })
            .catch(() => {})
    }, [])

    const result = calculateYield({
        productId,
        depositAmount: deposit,
        utilizationPct: utilization,
    })

    const riskInfo = RISK_DATA[productId] || DEFAULT_RISK

    return (
        <div className="rounded-2xl bg-[#0d0d14] border border-lumina-purple/10 p-6 sm:p-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs text-lumina-muted uppercase tracking-wider mb-2">
                            Product Pool
                        </label>
                        <select
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-lumina-text focus:border-lumina-purple/30 focus:outline-none transition-colors"
                        >
                            {PRODUCTS.map((p) => (
                                <option key={p.id} value={p.id} className="bg-[#111118]">
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-lumina-muted uppercase tracking-wider mb-2">
                            Deposit Amount: ${deposit.toLocaleString('en-US')} USDC
                        </label>
                        <input
                            type="range"
                            min={500}
                            max={200000}
                            step={500}
                            value={deposit}
                            onChange={(e) => setDeposit(Number(e.target.value))}
                            className="w-full accent-[#8b5cf6] h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-lumina-muted mt-1">
                            <span>$500</span>
                            <span>$200,000</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-lumina-muted uppercase tracking-wider mb-2">
                            Utilization: {utilization}%
                            {realUtilization !== null && (
                                <span className="text-cyan-400 text-[10px] ml-2">Current: {realUtilization}%</span>
                            )}
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            value={utilization}
                            onChange={(e) => setUtilization(Number(e.target.value))}
                            className="w-full accent-[#8b5cf6] h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-lumina-muted mt-1">
                            <span>0% (idle)</span>
                            <span>100% (fully utilized)</span>
                        </div>
                        <p className="text-xs text-lumina-muted/70 mt-2">
                            {realUtilization !== null
                                ? `Calculated at ${utilization}% vault utilization (live). At higher utilization, premiums increase via the Kink Model.`
                                : "Typical utilization for new protocols: 10-30%. Mature protocols: 40-70%."}
                        </p>
                    </div>

                    <p className="text-xs text-lumina-muted leading-relaxed">
                        * Real yield from real premiums — not token emissions. Estimates depend
                        on policy demand and utilization. Each pool is isolated: one bad
                        outcome doesn&apos;t affect your other positions.
                    </p>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    <ResultCard
                        label="Yield if No Claims"
                        value={`$${result.yieldIfNoClaims.toLocaleString('en-US')} USDC`}
                        sub={`~${result.apyEstimate}% APY equivalent`}
                        color="purple"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <ResultCard
                            label="Max Loss if Claim"
                            value={`-$${result.maxLossIfClaim.toLocaleString('en-US')} USDC`}
                            sub="If trigger activates on all policies"
                            color="red"
                        />
                        <ResultCard
                            label="Historical Trigger Probability"
                            value={`${riskInfo.emoji} ${riskInfo.level}`}
                            sub={riskInfo.description}
                            color={riskInfo.color}
                        />
                    </div>
                    <ResultCard
                        label="Protocol Fee"
                        value={`$${result.protocolFee.toLocaleString('en-US')} USDC`}
                        sub="3% of premiums"
                        color="default"
                    />
                    <ResultCard
                        label="Net Yield"
                        value={`$${result.netYield.toLocaleString('en-US')} USDC`}
                        sub="After protocol fee, before claims"
                        color="green"
                    />
                    <div className="rounded-xl border border-lumina-purple/10 bg-lumina-purple/[0.03] p-4">
                        <p className="text-sm text-lumina-muted">
                            <span className="text-lumina-text font-medium">Compare:</span>{" "}
                            Aave USDC lending ~3-5% APY{" "}
                            <span className="text-lumina-muted">|</span>{" "}
                            Lumina LP at 30% utilization <span className="text-lumina-purple font-semibold">~{result.apyEstimate}% APY</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ResultCard({
    label,
    value,
    sub,
    color = "default",
}: {
    label: string
    value: string
    sub?: string
    color?: string
}) {
    const colors: Record<string, string> = {
        cyan: "border-lumina-cyan/10 bg-lumina-cyan/[0.03]",
        purple: "border-lumina-purple/10 bg-lumina-purple/[0.03]",
        green: "border-lumina-green/10 bg-lumina-green/[0.03]",
        amber: "border-lumina-amber/10 bg-lumina-amber/[0.03]",
        red: "border-red-500/10 bg-red-500/[0.03]",
        default: "border-white/5 bg-white/[0.02]",
    }

    const textColors: Record<string, string> = {
        cyan: "text-lumina-cyan",
        purple: "text-lumina-purple",
        green: "text-lumina-green",
        amber: "text-lumina-amber",
        red: "text-red-400",
        default: "text-lumina-text",
    }

    return (
        <div className={`rounded-xl border p-4 ${colors[color]}`}>
            <div className="text-[10px] text-lumina-muted uppercase tracking-wider mb-1">
                {label}
            </div>
            <div className={`text-sm font-semibold ${textColors[color]}`}>{value}</div>
            {sub && <div className="text-[10px] text-lumina-muted mt-1">{sub}</div>}
        </div>
    )
}

function parseThreshold(opt: string): number {
    if (opt.includes("gwei")) return parseInt(opt)
    if (opt.startsWith("$")) return Math.round((1 - parseFloat(opt.replace("$", ""))) * 10000) || 300
    if (opt.includes("%")) return parseInt(opt) * 100
    return 2000
}
