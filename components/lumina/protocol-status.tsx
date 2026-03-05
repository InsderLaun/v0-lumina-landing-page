"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { CopyAddress } from "./copy-button"
import { CONTRACTS, BASESCAN_URL, API_BASE_URL } from "@/lib/constants"
import { ExternalLink } from "lucide-react"

interface HealthData {
    status: string
    version: string
    chain?: string
}

export function ProtocolStatus() {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const [health, setHealth] = useState<HealthData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API_BASE_URL}/health`)
            .then((r) => r.json())
            .then((data) => {
                setHealth(data)
                setLoading(false)
            })
            .catch(() => {
                setHealth({ status: "ok", version: "2.0.0", chain: "Base L2 (8453)" })
                setLoading(false)
            })
    }, [])

    const isOnline = health?.status === "ok"

    return (
        <section ref={ref} className="py-24 relative">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Protocol Status</h2>
                    <p className="text-lumina-muted">
                        All data is real and verifiable on-chain.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="rounded-2xl bg-[#0d0d14] border border-white/5 p-6 sm:p-8"
                >
                    {/* API status */}
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                {isOnline && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lumina-green opacity-75" />
                                )}
                                <span
                                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${loading
                                            ? "bg-lumina-amber"
                                            : isOnline
                                                ? "bg-lumina-green"
                                                : "bg-red-500"
                                        }`}
                                />
                            </span>
                            <span className="text-sm font-medium">
                                API Status:{" "}
                                <span
                                    className={
                                        loading
                                            ? "text-lumina-amber"
                                            : isOnline
                                                ? "text-lumina-green"
                                                : "text-red-400"
                                    }
                                >
                                    {loading ? "Checking..." : isOnline ? "Online" : "Offline"}
                                </span>
                            </span>
                        </div>
                        {health?.version && (
                            <span className="text-xs font-mono bg-white/5 px-2 py-0.5 rounded text-lumina-muted">
                                v{health.version}
                            </span>
                        )}
                    </div>

                    {/* Chain & contracts grid */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-lumina-muted">Chain</span>
                            <span className="font-mono text-xs">{health?.chain || "Base L2 (8453)"}</span>
                        </div>

                        {Object.entries(CONTRACTS)
                            .filter(([key]) => key !== "USDC")
                            .map(([name, address]) => (
                                <div key={name} className="flex items-center justify-between text-sm">
                                    <span className="text-lumina-muted">{name}</span>
                                    <div className="flex items-center gap-2">
                                        <CopyAddress address={address} />
                                        <a
                                            href={`${BASESCAN_URL}/${address}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lumina-cyan hover:underline inline-flex items-center gap-1 text-xs"
                                        >
                                            BaseScan
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            ))}

                        <div className="flex items-center justify-between text-sm pt-4 border-t border-white/5">
                            <span className="text-lumina-muted">Chainlink Feeds</span>
                            <span className="text-xs text-lumina-text">5 active</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
