"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { usePerspective } from "./perspective-context"
import { CheckCircle, BarChart3, ArrowRight } from "lucide-react"

export function ExampleScenario() {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const { perspective } = usePerspective()

    return (
        <section ref={ref} className="py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#111118] to-[#0a0a0f]" />
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        See It{" "}
                        <span className="text-lumina-cyan">In Action</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="rounded-2xl bg-[#0d0d14] border border-white/5 p-6 sm:p-8 lg:p-10"
                >
                    {perspective === "agent" ? <AgentScenario /> : <LPScenario />}
                </motion.div>
            </div>
        </section>
    )
}

function AgentScenario() {
    return (
        <div>
            <p className="text-sm text-lumina-muted mb-6 leading-relaxed">
                Your agent has a <span className="text-lumina-text font-medium">$50,000</span> leveraged position in Aave.
                You want protection against ETH crashing &gt;20% in the next 30 days.
            </p>

            {/* Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                {[
                    { label: "Coverage", value: "$10,000 USDC" },
                    { label: "Product", value: "Liquidation Shield" },
                    { label: "Threshold", value: "20% drop / 30 min" },
                    { label: "Premium", value: "$460 USDC (4.6%)" },
                    { label: "Deductible", value: "5%" },
                ].map((p) => (
                    <div key={p.label} className="bg-white/[0.02] rounded-lg p-3">
                        <div className="text-[10px] text-lumina-muted uppercase tracking-wider mb-1">{p.label}</div>
                        <div className="text-xs font-medium text-lumina-text">{p.value}</div>
                    </div>
                ))}
            </div>

            {/* Two outcomes */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Trigger activates */}
                <div className="rounded-xl border border-lumina-green/20 bg-lumina-green/[0.02] p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-lumina-green" />
                        <h4 className="text-sm font-semibold text-lumina-green">Trigger Activates</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-lumina-muted">
                        <li className="flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 text-lumina-green mt-0.5 shrink-0" />
                            <span>ETH drops 25% for 45 minutes</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 text-lumina-green mt-0.5 shrink-0" />
                            <span>Chainlink ETH/USD confirms</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 text-lumina-green mt-0.5 shrink-0" />
                            <span>AutoResolver proposes payout → 24h timelock</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 text-lumina-green mt-0.5 shrink-0" />
                            <span className="text-lumina-green font-medium">Agent receives $9,500 USDC automatically</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 text-lumina-muted mt-0.5 shrink-0" />
                            <span>Lumina earns $13.80 (3% of premium)</span>
                        </li>
                    </ul>
                </div>

                {/* No trigger */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-lumina-muted" />
                        <h4 className="text-sm font-semibold text-lumina-muted">No Trigger</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-lumina-muted">
                        <li className="flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 text-lumina-muted mt-0.5 shrink-0" />
                            <span>ETH drops 15% but recovers — threshold not met</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 text-lumina-muted mt-0.5 shrink-0" />
                            <span>Policy expires after 30 days</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 text-lumina-muted mt-0.5 shrink-0" />
                            <span>Agent loses $460 premium (cost of insurance)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 text-lumina-muted mt-0.5 shrink-0" />
                            <span>LP recovers full collateral + $460 premium</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 text-lumina-muted mt-0.5 shrink-0" />
                            <span>Lumina earns $13.80 (3% of premium)</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

function LPScenario() {
    return (
        <div>
            <p className="text-sm text-lumina-muted mb-6 leading-relaxed">
                You deposit <span className="text-lumina-text font-medium">$10,000 USDC</span> in the Liquidation Shield pool.
                An agent buys a <span className="text-lumina-text font-medium">$5,000</span> policy for 30 days and pays <span className="text-lumina-text font-medium">$230</span> premium.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                    { label: "Your deposit", value: "$10,000 USDC" },
                    { label: "Policy sold", value: "$5,000 coverage" },
                    { label: "Premium earned", value: "$230 USDC" },
                    { label: "Protocol fee", value: "$6.90 (3%)" },
                ].map((p) => (
                    <div key={p.label} className="bg-white/[0.02] rounded-lg p-3">
                        <div className="text-[10px] text-lumina-muted uppercase tracking-wider mb-1">{p.label}</div>
                        <div className="text-xs font-medium text-lumina-text">{p.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {/* No claim */}
                <div className="rounded-xl border border-lumina-purple/20 bg-lumina-purple/[0.02] p-5">
                    <h4 className="text-sm font-semibold text-lumina-purple mb-3">No Claim ✅</h4>
                    <ul className="space-y-2 text-xs text-lumina-muted">
                        <li>ETH doesn&apos;t crash &gt;20%</li>
                        <li>You recover: $10,000 + $230 - $6.90</li>
                        <li className="text-lumina-purple font-medium">= $10,223.10</li>
                        <li className="text-lumina-purple">~27% APY equivalent</li>
                    </ul>
                </div>

                {/* Claim */}
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.02] p-5">
                    <h4 className="text-sm font-semibold text-red-400 mb-3">Claim Triggered ⚠️</h4>
                    <ul className="space-y-2 text-xs text-lumina-muted">
                        <li>ETH crashes &gt;20% for 30+ min</li>
                        <li>You pay: $4,750 to agent</li>
                        <li>Remaining: $10,000 - $4,750 + $230</li>
                        <li className="text-red-400 font-medium">= $5,480 (loss: -$4,520)</li>
                    </ul>
                </div>

                {/* No demand */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                    <h4 className="text-sm font-semibold text-lumina-muted mb-3">No Demand 📊</h4>
                    <ul className="space-y-2 text-xs text-lumina-muted">
                        <li>No agent buys a policy</li>
                        <li>Your capital sits idle</li>
                        <li>$0 gain, $0 loss</li>
                        <li className="text-lumina-muted">You can withdraw anytime</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
