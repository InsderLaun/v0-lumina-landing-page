"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { AnimatedCounter } from "./animated-counter"
import { usePerspective } from "./perspective-context"
import { HERO_STATS } from "@/lib/constants"

export function HeroSection() {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true })
    const { setPerspective } = usePerspective()

    const scrollAndSetTab = (tab: "agent" | "lp") => {
        setPerspective(tab)
        const el = document.querySelector("#split-path")
        if (el) el.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        >
            {/* Animated grid background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]" />

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-lumina-cyan/30"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                        }}
                        animate={{
                            y: [-20, 20, -20],
                            opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{
                            duration: 4 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.8,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6">
                {/* Live badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lumina-green/5 border border-lumina-green/20 mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lumina-green opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-lumina-green" />
                    </span>
                    <span className="text-sm font-medium text-lumina-green">
                        Live on Base L2
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
                >
                    The Safety Net for{" "}
                    <span className="bg-gradient-to-r from-lumina-cyan to-lumina-purple bg-clip-text text-transparent">
                        Autonomous AI Agents
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-3xl mx-auto text-lg sm:text-xl text-lumina-muted leading-relaxed mb-4"
                >
                    Parametric insurance on Base L2. Protect your agent against
                    liquidations, depeg events, and bridge failures — or provide liquidity
                    and earn real yield from premiums.
                </motion.p>

                {/* Agent-only label */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-sm text-lumina-muted/60 mb-10"
                >
                    Lumina is agent-only. Humans configure and monitor. Agents buy and claim.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    <button
                        onClick={() => scrollAndSetTab("agent")}
                        className="px-8 py-3.5 rounded-lg bg-lumina-cyan text-[#0a0a0f] font-semibold text-base hover:shadow-glow-cyan hover:scale-[1.02] transition-all duration-300"
                    >
                        I Have an AI Agent →
                    </button>
                    <button
                        onClick={() => scrollAndSetTab("lp")}
                        className="px-8 py-3.5 rounded-lg border border-lumina-purple/40 text-lumina-purple font-semibold text-base hover:bg-lumina-purple/10 hover:shadow-glow-purple hover:scale-[1.02] transition-all duration-300"
                    >
                        I Want to Earn Yield →
                    </button>
                </motion.div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12"
                >
                    {HERO_STATS.map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-lumina-text mb-1">
                                {typeof stat.value === "string" ? (
                                    <span>{stat.value}</span>
                                ) : (
                                    <AnimatedCounter value={stat.value} />
                                )}
                            </div>
                            <div className="text-sm text-lumina-muted uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Trust logos */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.75 }}
                    className="flex items-center justify-center gap-2 text-sm text-lumina-muted"
                >
                    <span>Built with</span>
                    <div className="flex items-center gap-4 ml-2">
                        {["Base", "Chainlink", "Solidity", "USDC"].map((name) => (
                            <span
                                key={name}
                                className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-sm font-medium text-lumina-text/70"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
