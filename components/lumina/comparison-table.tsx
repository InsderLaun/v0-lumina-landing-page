"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ArrowUpDown } from "lucide-react"
import { usePerspective } from "./perspective-context"
import { PRODUCTS } from "@/lib/products"

type SortKey = "name" | "premium" | "deductible" | "duration" | "yield" | "risk"

export function ComparisonTable() {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const { perspective } = usePerspective()
    const [sortKey, setSortKey] = useState<SortKey>("name")
    const [sortAsc, setSortAsc] = useState(true)

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortAsc(!sortAsc)
        } else {
            setSortKey(key)
            setSortAsc(true)
        }
    }

    const sorted = [...PRODUCTS].sort((a, b) => {
        const dir = sortAsc ? 1 : -1
        switch (sortKey) {
            case "name":
                return a.name.localeCompare(b.name) * dir
            case "premium":
            case "yield":
                return (a.premiumRange[0] - b.premiumRange[0]) * dir
            case "deductible":
                return (a.deductiblePct - b.deductiblePct) * dir
            case "duration":
                return (a.durationRange[0] - b.durationRange[0]) * dir
            case "risk": {
                const riskOrder = { Low: 1, Medium: 2, Higher: 3 }
                return (
                    ((riskOrder[a.lpView.riskLevel] || 2) -
                        (riskOrder[b.lpView.riskLevel] || 2)) *
                    dir
                )
            }
            default:
                return 0
        }
    })

    const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
        <th
            onClick={() => handleSort(k)}
            className="text-left text-xs font-medium text-lumina-muted uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-lumina-text transition-colors select-none"
        >
            <span className="inline-flex items-center gap-1">
                {label}
                <ArrowUpDown className="w-3 h-3" />
            </span>
        </th>
    )

    return (
        <section ref={ref} className="py-12 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Desktop table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="hidden md:block overflow-x-auto rounded-xl border border-white/5 bg-[#0d0d14]"
                >
                    <AnimatePresence mode="wait">
                        {perspective === "agent" ? (
                            <motion.table
                                key="agent-table"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="w-full"
                            >
                                <thead className="border-b border-white/5">
                                    <tr>
                                        <SortHeader label="Product" k="name" />
                                        <SortHeader label="Premium" k="premium" />
                                        <SortHeader label="Deductible" k="deductible" />
                                        <th className="text-left text-xs font-medium text-lumina-muted uppercase tracking-wider px-4 py-3">Trigger</th>
                                        <SortHeader label="Duration" k="duration" />
                                        <th className="text-left text-xs font-medium text-lumina-muted uppercase tracking-wider px-4 py-3">Sustained</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sorted.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="border-b border-white/[0.03] hover:bg-lumina-cyan/[0.03] transition-colors"
                                        >
                                            <td className="px-4 py-3.5 text-sm font-medium">{p.name}</td>
                                            <td className="px-4 py-3.5 text-sm text-lumina-cyan">
                                                {p.premiumRange[0] === p.premiumRange[1]
                                                    ? `${p.premiumRange[0]}%`
                                                    : `${p.premiumRange[0]}-${p.premiumRange[1]}%`}
                                            </td>
                                            <td className="px-4 py-3.5 text-sm text-lumina-muted">{p.deductiblePct}%</td>
                                            <td className="px-4 py-3.5 text-sm text-lumina-muted">{p.triggerType.split("_").join(" ").toLowerCase()}</td>
                                            <td className="px-4 py-3.5 text-sm text-lumina-muted">
                                                {p.durationRange[0] === p.durationRange[1]
                                                    ? `${p.durationRange[0]}d`
                                                    : `${p.durationRange[0]}-${p.durationRange[1]}d`}
                                            </td>
                                            <td className="px-4 py-3.5 text-sm text-lumina-muted">{p.sustainedPeriod}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </motion.table>
                        ) : (
                            <motion.table
                                key="lp-table"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="w-full"
                            >
                                <thead className="border-b border-white/5">
                                    <tr>
                                        <SortHeader label="Product" k="name" />
                                        <SortHeader label="Yield (no claim)" k="yield" />
                                        <th className="text-left text-xs font-medium text-lumina-muted uppercase tracking-wider px-4 py-3">Max Loss (claim)</th>
                                        <SortHeader label="Risk Level" k="risk" />
                                        <SortHeader label="Commitment" k="duration" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {sorted.map((p) => {
                                        const riskColors: Record<string, string> = {
                                            Low: "text-lumina-green",
                                            Medium: "text-lumina-amber",
                                            Higher: "text-red-400",
                                        }
                                        const riskIcons: Record<string, string> = {
                                            Low: "🟢",
                                            Medium: "⚠️",
                                            Higher: "🔴",
                                        }
                                        return (
                                            <tr
                                                key={p.id}
                                                className="border-b border-white/[0.03] hover:bg-lumina-purple/[0.03] transition-colors"
                                            >
                                                <td className="px-4 py-3.5 text-sm font-medium">{p.name}</td>
                                                <td className="px-4 py-3.5 text-sm text-lumina-purple">
                                                    {p.premiumRange[0] === p.premiumRange[1]
                                                        ? `${p.premiumRange[0]}%`
                                                        : `${p.premiumRange[0]}-${p.premiumRange[1]}%`}
                                                </td>
                                                <td className="px-4 py-3.5 text-sm text-lumina-muted">Up to {100 - p.deductiblePct}%</td>
                                                <td className={`px-4 py-3.5 text-sm ${riskColors[p.lpView.riskLevel] || ""}`}>
                                                    {riskIcons[p.lpView.riskLevel]} {p.lpView.riskLevel}
                                                </td>
                                                <td className="px-4 py-3.5 text-sm text-lumina-muted">
                                                    {p.durationRange[0] === p.durationRange[1]
                                                        ? `${p.durationRange[0]}d`
                                                        : `${p.durationRange[0]}-${p.durationRange[1]}d`}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </motion.table>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Mobile horizontal scroll cards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:hidden flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory"
                >
                    {sorted.map((p) => (
                        <div
                            key={p.id}
                            className="snap-start shrink-0 w-[280px] rounded-xl bg-[#0d0d14] border border-white/5 p-5"
                        >
                            <h4 className="text-sm font-semibold mb-3">{p.name}</h4>
                            {perspective === "agent" ? (
                                <div className="space-y-2 text-xs text-lumina-muted">
                                    <div className="flex justify-between">
                                        <span>Premium</span>
                                        <span className="text-lumina-cyan">{p.premiumRange[0]}-{p.premiumRange[1]}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Deductible</span>
                                        <span>{p.deductiblePct}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Duration</span>
                                        <span>{p.durationRange[0]}-{p.durationRange[1]}d</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sustained</span>
                                        <span>{p.sustainedPeriod}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 text-xs text-lumina-muted">
                                    <div className="flex justify-between">
                                        <span>Yield</span>
                                        <span className="text-lumina-purple">{p.premiumRange[0]}-{p.premiumRange[1]}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Max Loss</span>
                                        <span>Up to {100 - p.deductiblePct}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Risk</span>
                                        <span>{p.lpView.riskLevel}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Commitment</span>
                                        <span>{p.durationRange[0]}-{p.durationRange[1]}d</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
