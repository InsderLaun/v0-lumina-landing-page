"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle2, XCircle, ExternalLink } from "lucide-react"
import { BASESCAN_URL } from "@/lib/constants"

export type TxStatus = "idle" | "pending" | "confirming" | "confirmed" | "error"

interface TxStatusProps {
    status: TxStatus
    txHash?: string
    errorMessage?: string
    label?: string
}

export function TransactionStatus({ status, txHash, errorMessage, label }: TxStatusProps) {
    if (status === "idle") return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl border p-4 mt-4"
                style={{
                    borderColor:
                        status === "confirmed"
                            ? "rgba(0,255,136,0.2)"
                            : status === "error"
                                ? "rgba(239,68,68,0.2)"
                                : "rgba(0,212,255,0.2)",
                    backgroundColor:
                        status === "confirmed"
                            ? "rgba(0,255,136,0.03)"
                            : status === "error"
                                ? "rgba(239,68,68,0.03)"
                                : "rgba(0,212,255,0.03)",
                }}
            >
                <div className="flex items-center gap-3">
                    {status === "pending" && (
                        <Loader2 className="w-5 h-5 text-lumina-cyan animate-spin" />
                    )}
                    {status === "confirming" && (
                        <div className="relative">
                            <Loader2 className="w-5 h-5 text-lumina-amber animate-spin" />
                        </div>
                    )}
                    {status === "confirmed" && (
                        <CheckCircle2 className="w-5 h-5 text-lumina-green" />
                    )}
                    {status === "error" && (
                        <XCircle className="w-5 h-5 text-red-400" />
                    )}

                    <div className="flex-1">
                        <p className="text-sm font-medium">
                            {status === "pending" && (label || "Waiting for confirmation...")}
                            {status === "confirming" && "Transaction submitted..."}
                            {status === "confirmed" && "Transaction confirmed!"}
                            {status === "error" && "Transaction failed"}
                        </p>
                        {status === "confirming" && (
                            <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: "5%" }}
                                    animate={{ width: "90%" }}
                                    transition={{ duration: 15, ease: "linear" }}
                                    className="h-full bg-lumina-amber rounded-full"
                                />
                            </div>
                        )}
                        {errorMessage && status === "error" && (
                            <p className="text-xs text-red-400/80 mt-1">{errorMessage}</p>
                        )}
                    </div>

                    {txHash && (status === "confirming" || status === "confirmed") && (
                        <a
                            href={`https://basescan.org/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-lumina-cyan hover:underline shrink-0"
                        >
                            BaseScan
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

// ─── Wrong Network Modal ────────────────────────────────────────
interface WrongNetworkProps {
    show: boolean
    onSwitch: () => void
}

export function WrongNetworkBanner({ show, onSwitch }: WrongNetworkProps) {
    if (!show) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-[72px] left-0 right-0 z-50 bg-lumina-amber/10 border-b border-lumina-amber/20 px-4 py-3"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <p className="text-sm text-lumina-amber">
                    ⚠️ Please switch to Base L2 to use Lumina Protocol
                </p>
                <button
                    onClick={onSwitch}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-lumina-amber text-[#0a0a0f] hover:opacity-90 transition"
                >
                    Switch to Base
                </button>
            </div>
        </motion.div>
    )
}

// ─── Insufficient USDC Message ──────────────────────────────────
interface InsufficientFundsProps {
    required: number
    balance: string
}

export function InsufficientFundsBanner({ required, balance }: InsufficientFundsProps) {
    const balanceNum = parseFloat(balance)
    const missing = required - balanceNum

    return (
        <div className="rounded-lg border border-red-500/20 bg-red-500/[0.03] p-3 mt-3">
            <p className="text-xs text-red-400">
                Insufficient USDC. You need <strong>${required.toLocaleString('en-US')}</strong> but have{" "}
                <strong>${balanceNum.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>.
                Missing: <strong>${missing.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>.
            </p>
        </div>
    )
}
