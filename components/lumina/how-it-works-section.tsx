"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Terminal, Lock, Radar, Coins } from "lucide-react"

const STEPS = [
    {
        icon: Terminal,
        title: "QUOTE",
        subtitle: "Agent calls the API",
        details: ["GET /api/v1/products → POST /api/v1/quote", "Receives: premium, trigger conditions, terms hash"],
        color: "lumina-cyan",
    },
    {
        icon: Lock,
        title: "SIGN & PAY",
        subtitle: "Agent signs terms on-chain",
        details: ["keccak256 hash of all parameters, immutable on Base L2", "Pays premium in USDC"],
        color: "lumina-purple",
    },
    {
        icon: Radar,
        title: "MONITOR 24/7",
        subtitle: "AutoResolver watches Chainlink",
        details: ["Reads price feeds continuously. No action needed.", "Contract: 0x8D919F...02754"],
        color: "lumina-cyan",
    },
    {
        icon: Coins,
        title: "RESOLVE",
        subtitle: "Automatic settlement",
        details: [
            "Trigger met? → 24h timelock → automatic USDC payout",
            "No trigger? → policy expires → LP gets collateral + premium",
        ],
        color: "lumina-green",
    },
]

export function HowItWorksSection() {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    return (
        <section
            ref={ref}
            id="how-it-works"
            className="py-24 relative scroll-mt-32"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#111118] to-[#0a0a0f]" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        From Quote to Payout.{" "}
                        <span className="text-lumina-green">Fully Automated.</span>
                    </h2>
                    <p className="text-lumina-muted max-w-2xl mx-auto">
                        No claims department. No paperwork. No waiting for a vote. Chainlink
                        verifies. AutoResolver executes. Your agent gets paid.
                    </p>
                </motion.div>

                {/* Desktop: horizontal timeline */}
                <div className="hidden lg:block">
                    <div className="relative">
                        {/* Connection line */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={isInView ? { scaleX: 1 } : {}}
                            transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
                            className="absolute top-12 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-lumina-cyan via-lumina-purple to-lumina-green origin-left"
                        />

                        <div className="grid grid-cols-4 gap-6">
                            {STEPS.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
                                    className="text-center"
                                >
                                    {/* Circle */}
                                    <div className="relative mx-auto mb-6">
                                        <div
                                            className={`w-24 h-24 rounded-full bg-[#0d0d14] border-2 flex items-center justify-center mx-auto ${step.color === "lumina-cyan"
                                                    ? "border-lumina-cyan/30"
                                                    : step.color === "lumina-purple"
                                                        ? "border-lumina-purple/30"
                                                        : "border-lumina-green/30"
                                                }`}
                                        >
                                            <step.icon
                                                className={`w-8 h-8 ${step.color === "lumina-cyan"
                                                        ? "text-lumina-cyan"
                                                        : step.color === "lumina-purple"
                                                            ? "text-lumina-purple"
                                                            : "text-lumina-green"
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    <h3 className="text-sm font-bold uppercase tracking-wider mb-1 text-lumina-text">
                                        {step.title}
                                    </h3>
                                    <p
                                        className={`text-sm font-medium mb-3 ${step.color === "lumina-cyan"
                                                ? "text-lumina-cyan"
                                                : step.color === "lumina-purple"
                                                    ? "text-lumina-purple"
                                                    : "text-lumina-green"
                                            }`}
                                    >
                                        {step.subtitle}
                                    </p>
                                    {step.details.map((d, j) => (
                                        <p key={j} className="text-xs text-lumina-muted leading-relaxed">
                                            {d}
                                        </p>
                                    ))}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile: vertical timeline */}
                <div className="lg:hidden">
                    <div className="relative pl-8">
                        {/* Vertical line */}
                        <motion.div
                            initial={{ scaleY: 0 }}
                            animate={isInView ? { scaleY: 1 } : {}}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="absolute left-3 top-0 bottom-0 w-[2px] bg-gradient-to-b from-lumina-cyan via-lumina-purple to-lumina-green origin-top"
                        />

                        <div className="space-y-10">
                            {STEPS.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                                    className="relative"
                                >
                                    {/* Dot */}
                                    <div
                                        className={`absolute -left-8 top-1 w-6 h-6 rounded-full bg-[#0d0d14] border-2 flex items-center justify-center ${step.color === "lumina-cyan"
                                                ? "border-lumina-cyan"
                                                : step.color === "lumina-purple"
                                                    ? "border-lumina-purple"
                                                    : "border-lumina-green"
                                            }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${step.color === "lumina-cyan"
                                                    ? "bg-lumina-cyan"
                                                    : step.color === "lumina-purple"
                                                        ? "bg-lumina-purple"
                                                        : "bg-lumina-green"
                                                }`}
                                        />
                                    </div>

                                    <h3 className="text-sm font-bold uppercase tracking-wider mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-lumina-muted mb-2">{step.subtitle}</p>
                                    {step.details.map((d, j) => (
                                        <p key={j} className="text-xs text-lumina-muted/70">{d}</p>
                                    ))}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
