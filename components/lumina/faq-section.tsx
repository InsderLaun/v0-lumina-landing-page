"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { GITHUB_URL } from "@/lib/constants"

const FAQS = [
    {
        q: "Who can buy insurance through Lumina?",
        a: "Only AI agents. Humans don't buy policies directly — they register their agent, give it an API key, and set spending limits. The agent purchases coverage autonomously via the REST API.",
    },
    {
        q: "What happens when the trigger activates?",
        a: "AutoResolver detects it via Chainlink, calls proposeResolution(), a 24-hour security timelock passes, then USDC is sent directly to the agent's wallet. No human intervention needed.",
    },
    {
        q: "What if the trigger never activates?",
        a: "The policy expires. The LP recovers their full collateral plus the premium. Lumina keeps 3% of the premium as protocol fee.",
    },
    {
        q: "How are premiums calculated?",
        a: "Based on coverage amount, duration, threshold risk level, and asset volatility. Use our Premium Calculator above or call POST /quote.",
    },
    {
        q: "What's the risk for LPs?",
        a: "If the trigger activates, the LP loses collateral up to coverage amount. Each pool is isolated. Circuit breaker protects against cascading.",
    },
    {
        q: "Is this audited?",
        a: "Contracts are deployed and verified on Base L2. AutoResolver has 123 passing tests. A formal Tier 1 audit is on our roadmap.",
    },
    {
        q: "Can I use this with my existing agent?",
        a: "Yes. Any agent that makes HTTP requests works: Virtuals Protocol, ElizaOS, LangChain, NEAR AI, or any custom bot. Integration takes ~30 min.",
    },
    {
        q: "How do I install the Lumina skill on my agent?",
        a: `We have integration guides for Virtuals (ACP Handler), ElizaOS (plugin), LangChain (tools), and generic HTTP. Check our GitHub docs for step-by-step instructions.`,
        link: `${GITHUB_URL}/tree/main/docs`,
    },
    {
        q: "Why parametric instead of traditional insurance?",
        a: "Because on-chain everything is measurable. ETH price is on Chainlink. Gas is in tx.gasprice. There's nothing to investigate or dispute. If the condition is met, the payout is automatic.",
    },
]

export function FAQSection() {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section ref={ref} id="faq" className="py-24 scroll-mt-32">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Frequently Asked{" "}
                        <span className="text-lumina-cyan">Questions</span>
                    </h2>
                </motion.div>

                <div className="space-y-3">
                    {FAQS.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.4, delay: i * 0.06 }}
                            className="rounded-xl border border-white/5 bg-[#111118] overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <span className="text-base font-medium text-lumina-text pr-4">
                                    {faq.q}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 text-lumina-muted shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-5 border-t border-white/5 pt-4">
                                            <p className="text-base text-lumina-muted leading-relaxed">
                                                {faq.a}
                                            </p>
                                            {faq.link && (
                                                <a
                                                    href={faq.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block mt-2 text-base text-lumina-cyan hover:underline"
                                                >
                                                    View on GitHub →
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
