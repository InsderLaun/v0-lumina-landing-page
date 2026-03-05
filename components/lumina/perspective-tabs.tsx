"use client"

import { motion } from "framer-motion"
import { Bot, Coins } from "lucide-react"
import { usePerspective } from "./perspective-context"

const TABS = [
    { key: "agent" as const, label: "I Have an AI Agent", icon: Bot },
    { key: "lp" as const, label: "I Want to Earn Yield", icon: Coins },
] as const

export function PerspectiveTabs() {
    const { perspective, setPerspective } = usePerspective()

    return (
        <div id="perspective-tabs" data-perspective-anchor className="sticky top-16 lg:top-[72px] z-30 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-center py-3">
                    <div className="relative inline-flex bg-white/[0.03] rounded-xl p-1 border border-white/5">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setPerspective(tab.key)}
                                className={`relative flex items-center gap-2 px-6 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${perspective === tab.key
                                        ? "text-white"
                                        : "text-lumina-muted hover:text-lumina-text"
                                    }`}
                            >
                                {perspective === tab.key && (
                                    <motion.div
                                        layoutId="perspective-bg"
                                        className={`absolute inset-0 rounded-lg ${tab.key === "agent"
                                                ? "bg-lumina-cyan/15 border border-lumina-cyan/20"
                                                : "bg-lumina-purple/15 border border-lumina-purple/20"
                                            }`}
                                        transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                                    />
                                )}
                                <tab.icon className={`w-4 h-4 relative z-10 ${perspective === tab.key
                                        ? tab.key === "agent" ? "text-lumina-cyan" : "text-lumina-purple"
                                        : ""
                                    }`} />
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
