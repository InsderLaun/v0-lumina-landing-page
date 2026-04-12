"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Link2, Shield, Zap, FileCheck, ExternalLink } from "lucide-react"
import { BASESCAN_URL, CONTRACTS } from "@/lib/constants"

const TRUST_CARDS = [
    {
        icon: Link2,
        title: "Chainlink Oracles",
        description: "5 verified price feeds. Industry-standard. 1h staleness check.",
        link: `${BASESCAN_URL}/${CONTRACTS.AutoResolver}`,
    },
    {
        icon: Shield,
        title: "Isolated Pools",
        description: "Each policy is its own pool. One fails, others are safe.",
        link: `${BASESCAN_URL}/${CONTRACTS.CoverRouter}`,
    },
    {
        icon: Zap,
        title: "Circuit Breaker",
        description: "Claims exceed 50% TVL? Pro-rata kicks in automatically.",
        link: `${BASESCAN_URL}/${CONTRACTS.EmergencyPause}`,
    },
    {
        icon: FileCheck,
        title: "On-Chain Terms",
        description: "Agent signs keccak256 hash. Immutable. Verifiable forever.",
        link: `${BASESCAN_URL}/${CONTRACTS.CoverRouter}`,
    },
    {
        icon: Shield,
        title: "Correlation Groups",
        description: "BCS+EAS+IL capped at 70% per vault. Limits correlated loss exposure.",
        link: `${BASESCAN_URL}/${CONTRACTS.CoverRouter}`,
    },
]

export function SecuritySection() {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    return (
        <section ref={ref} id="security" className="py-24 scroll-mt-32">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Verified. Transparent.{" "}
                        <span className="text-lumina-cyan">Immutable.</span>
                    </h2>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {TRUST_CARDS.map((card, i) => (
                        <motion.a
                            key={card.title}
                            href={card.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="group rounded-xl bg-[#111118] border border-white/5 p-6 hover:border-lumina-cyan/20 transition-all cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-lg bg-lumina-cyan/10 flex items-center justify-center mb-4">
                                <card.icon className="w-5 h-5 text-lumina-cyan" />
                            </div>
                            <h4 className="text-base font-semibold mb-2">{card.title}</h4>
                            <p className="text-base text-lumina-muted leading-relaxed">
                                {card.description}
                            </p>
                            <div className="mt-3 flex items-center gap-1 text-sm text-lumina-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                                View on BaseScan <ExternalLink className="w-3 h-3" />
                            </div>
                        </motion.a>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-center"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lumina-green/5 border border-lumina-green/20 text-sm text-lumina-green">
                        ✓ 123 passing tests on AutoResolver
                    </span>
                </motion.div>
            </div>
        </section>
    )
}
