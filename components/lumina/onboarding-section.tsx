"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Wallet, UserPlus, Plug, Coins, ArrowRight } from "lucide-react"
import { usePerspective } from "./perspective-context"

interface OnboardingSectionProps {
    onRegisterAgent: () => void
    onDepositLP: () => void
}

export function OnboardingSection({ onRegisterAgent, onDepositLP }: OnboardingSectionProps) {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const { perspective } = usePerspective()

    const agentSteps = [
        { icon: Wallet, title: "Connect Wallet", desc: "Connect your wallet to Base L2" },
        { icon: UserPlus, title: "Register Agent", desc: "Set limits, receive API key" },
        { icon: Plug, title: "Install Skill", desc: "Give API key + skill docs to your agent" },
    ]

    const lpSteps = [
        { icon: Wallet, title: "Connect Wallet", desc: "Connect your wallet to Base L2" },
        { icon: Coins, title: "Choose Pool", desc: "Select a risk pool to back" },
        { icon: ArrowRight, title: "Deposit USDC", desc: "Approve and deposit your USDC" },
    ]

    const steps = perspective === "agent" ? agentSteps : lpSteps

    return (
        <section ref={ref} id="get-started" className="py-24 scroll-mt-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Get{" "}
                        <span className={perspective === "agent" ? "text-lumina-cyan" : "text-lumina-purple"}>
                            Started
                        </span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="rounded-xl bg-[#111118] border border-white/5 p-6 text-center"
                        >
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${perspective === "agent" ? "bg-lumina-cyan/10" : "bg-lumina-purple/10"
                                }`}>
                                <step.icon className={`w-6 h-6 ${perspective === "agent" ? "text-lumina-cyan" : "text-lumina-purple"
                                    }`} />
                            </div>
                            <p className="text-sm font-mono text-lumina-muted/50 mb-2">Step {i + 1}</p>
                            <h4 className="text-lg font-semibold mb-1">{step.title}</h4>
                            <p className="text-base text-lumina-muted">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-center"
                >
                    <button
                        onClick={perspective === "agent" ? onRegisterAgent : onDepositLP}
                        className={`px-8 py-3.5 rounded-lg font-semibold text-base transition-all duration-300 hover:scale-[1.02] ${perspective === "agent"
                                ? "bg-lumina-cyan text-[#0a0a0f] hover:shadow-glow-cyan"
                                : "bg-lumina-purple text-white hover:shadow-glow-purple"
                            }`}
                    >
                        {perspective === "agent" ? "Register Your Agent →" : "Start Providing Liquidity →"}
                    </button>
                </motion.div>
            </div>
        </section>
    )
}
