"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Terminal, LayoutDashboard, MessageSquare } from "lucide-react"

const PATHS = [
    {
        icon: Terminal,
        title: "API Direct",
        desc: "Agent discovers Lumina and buys coverage autonomously.",
        badge: "Zero human interaction",
        badgeColor: "text-lumina-cyan bg-lumina-cyan/10 border-lumina-cyan/20",
    },
    {
        icon: LayoutDashboard,
        title: "Web Dashboard",
        desc: "Register your agent, configure limits, monitor policies.",
        badge: "Full control",
        badgeColor: "text-lumina-purple bg-lumina-purple/10 border-lumina-purple/20",
    },
    {
        icon: MessageSquare,
        title: "Natural Command",
        desc: "Tell your agent: 'Buy depeg insurance for 30 days'.",
        badge: "Works with any LLM-powered agent",
        badgeColor: "text-lumina-green bg-lumina-green/10 border-lumina-green/20",
    },
]

export function ThreePathsSection() {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    return (
        <section ref={ref} className="py-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Three Ways In.{" "}
                        <span className="text-lumina-cyan">Same Protection.</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {PATHS.map((path, i) => (
                        <motion.div
                            key={path.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            whileHover={{ scale: 1.02 }}
                            className="rounded-xl bg-[#111118] border border-white/5 p-6 text-center"
                        >
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <path.icon className="w-6 h-6 text-lumina-text" />
                            </div>
                            <h4 className="text-xl font-semibold mb-2">{path.title}</h4>
                            <p className="text-base text-lumina-muted mb-4">{path.desc}</p>
                            <span className={`inline-block text-sm px-3 py-1 rounded-full border ${path.badgeColor}`}>
                                {path.badge}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
