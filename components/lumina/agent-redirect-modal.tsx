"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, Bot } from "lucide-react"

interface AgentRedirectModalProps {
    open: boolean
    onClose: () => void
    onRegisterAgent: () => void
}

export function AgentRedirectModal({ open, onClose, onRegisterAgent }: AgentRedirectModalProps) {
    if (!open) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md rounded-2xl bg-[#0d0d14] border border-white/10 p-8 text-center"
                >
                    <div className="w-14 h-14 rounded-full bg-lumina-cyan/10 flex items-center justify-center mx-auto mb-5">
                        <Bot className="w-7 h-7 text-lumina-cyan" />
                    </div>

                    <h3 className="text-xl font-bold mb-3">Policies Are Agent-Only</h3>

                    <p className="text-base text-lumina-muted leading-relaxed mb-6">
                        Your agent purchases policies via the API.
                        Register your agent first to get an API key.
                    </p>

                    <button
                        onClick={() => { onClose(); onRegisterAgent() }}
                        className="w-full py-3 rounded-lg bg-lumina-cyan text-[#0a0a0f] font-semibold text-base hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2"
                    >
                        Register Agent <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full mt-3 py-2.5 rounded-lg border border-white/10 text-sm text-lumina-muted hover:border-white/20 transition"
                    >
                        Close
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
