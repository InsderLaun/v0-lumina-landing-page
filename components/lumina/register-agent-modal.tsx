"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Check, AlertTriangle, Key, Terminal } from "lucide-react"
import { useAccount } from "wagmi"
import { useUSDCBalance } from "@/hooks/use-web3"
import { PRODUCTS } from "@/lib/products"
import { API_BASE_URL } from "@/lib/constants"

interface RegisterAgentModalProps {
    open: boolean
    onClose: () => void
}

export function RegisterAgentModal({ open, onClose }: RegisterAgentModalProps) {
    const { address } = useAccount()
    const { display: usdcBalance } = useUSDCBalance()

    const [step, setStep] = useState(1)
    const [agentWallet, setAgentWallet] = useState("")
    const [allowedProducts, setAllowedProducts] = useState<string[]>(PRODUCTS.map((p) => p.id))
    const [maxCoverage, setMaxCoverage] = useState(10000)
    const [maxMonthlySpend, setMaxMonthlySpend] = useState(500)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [result, setResult] = useState<{ agentId: string; apiKey: string } | null>(null)
    const [keyCopied, setKeyCopied] = useState(false)

    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(agentWallet)

    const handleRegister = async () => {
        if (!address || !isValidAddress) return
        setLoading(true)
        setError("")

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    agentWallet,
                    ownerWallet: address,
                    allowedProducts,
                    maxCoveragePerPolicy: maxCoverage,
                    maxMonthlySpend,
                }),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.message || `API error: ${res.status}`)
            }

            const data = await res.json()
            setResult({ agentId: data.agentId, apiKey: data.apiKey })
            setStep(4)
        } catch (err: any) {
            setError(err.message || "Service temporarily unavailable. Try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleCopyKey = async () => {
        if (!result?.apiKey) return
        await navigator.clipboard.writeText(result.apiKey)
        setKeyCopied(true)
        setTimeout(() => setKeyCopied(false), 3000)
    }

    const toggleProduct = (id: string) => {
        setAllowedProducts((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        )
    }

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
                    className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-[#0d0d14] border border-white/10 p-6"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold">Register Agent</h3>
                        <button onClick={onClose} className="text-lumina-muted hover:text-lumina-text">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mb-6">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-lumina-cyan" : "bg-white/10"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Step 1: Connected wallet info */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                                <div className="text-xs text-lumina-muted uppercase tracking-wider mb-2">Your Wallet</div>
                                <p className="font-mono text-sm text-lumina-text break-all">{address}</p>
                                <p className="text-sm text-lumina-cyan mt-1">{usdcBalance}</p>
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                className="w-full py-3 rounded-lg bg-lumina-cyan text-[#0a0a0f] font-semibold text-sm hover:shadow-glow-cyan transition-all"
                            >
                                Continue →
                            </button>
                        </div>
                    )}

                    {/* Step 2: Agent config */}
                    {step === 2 && (
                        <div className="space-y-5">
                            {/* Agent address */}
                            <div>
                                <label className="block text-xs text-lumina-muted uppercase tracking-wider mb-2">
                                    Agent Wallet Address
                                </label>
                                <input
                                    value={agentWallet}
                                    onChange={(e) => setAgentWallet(e.target.value)}
                                    placeholder="0x..."
                                    className={`w-full bg-white/5 border rounded-lg px-3 py-2.5 text-sm font-mono text-lumina-text focus:outline-none transition-colors ${agentWallet && !isValidAddress
                                        ? "border-red-500/40 focus:border-red-500/60"
                                        : "border-white/10 focus:border-lumina-cyan/30"
                                        }`}
                                />
                                {agentWallet && !isValidAddress && (
                                    <p className="text-xs text-red-400 mt-1">Invalid address (must be 0x + 40 hex chars)</p>
                                )}
                            </div>

                            {/* Allowed products */}
                            <div>
                                <label className="block text-xs text-lumina-muted uppercase tracking-wider mb-2">
                                    Allowed Products
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {PRODUCTS.map((p) => (
                                        <label key={p.id} className="flex items-center gap-2 text-xs cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={allowedProducts.includes(p.id)}
                                                onChange={() => toggleProduct(p.id)}
                                                className="accent-[#00d4ff] rounded"
                                            />
                                            <span className="text-lumina-text/80">{p.shortName}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Max coverage */}
                            <div>
                                <label className="block text-xs text-lumina-muted uppercase tracking-wider mb-2">
                                    Max Coverage Per Policy: ${maxCoverage.toLocaleString('en-US')}
                                </label>
                                <input
                                    type="range"
                                    min={100}
                                    max={100000}
                                    step={100}
                                    value={maxCoverage}
                                    onChange={(e) => setMaxCoverage(Number(e.target.value))}
                                    className="w-full accent-[#00d4ff] h-1.5 bg-white/10 rounded-full"
                                />
                            </div>

                            {/* Max monthly spend */}
                            <div>
                                <label className="block text-xs text-lumina-muted uppercase tracking-wider mb-2">
                                    Max Monthly Spend: ${maxMonthlySpend.toLocaleString('en-US')}
                                </label>
                                <input
                                    type="range"
                                    min={10}
                                    max={10000}
                                    step={10}
                                    value={maxMonthlySpend}
                                    onChange={(e) => setMaxMonthlySpend(Number(e.target.value))}
                                    className="w-full accent-[#00d4ff] h-1.5 bg-white/10 rounded-full"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm text-lumina-muted hover:border-white/20 transition"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!isValidAddress}
                                    className="flex-1 py-2.5 rounded-lg bg-lumina-cyan text-[#0a0a0f] font-semibold text-sm hover:shadow-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Review →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review & submit */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Owner</span>
                                    <span className="font-mono text-xs">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Agent</span>
                                    <span className="font-mono text-xs">{agentWallet.slice(0, 6)}...{agentWallet.slice(-4)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Products</span>
                                    <span>{allowedProducts.length} of {PRODUCTS.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Max Coverage</span>
                                    <span>${maxCoverage.toLocaleString('en-US')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Max Monthly Spend</span>
                                    <span>${maxMonthlySpend.toLocaleString('en-US')}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-lg border border-red-500/20 bg-red-500/[0.03] p-3">
                                    <p className="text-xs text-red-400 flex items-center gap-2">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm text-lumina-muted hover:border-white/20 transition"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={handleRegister}
                                    disabled={loading}
                                    className="flex-1 py-2.5 rounded-lg bg-lumina-cyan text-[#0a0a0f] font-semibold text-sm hover:shadow-glow-cyan disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        "Register Agent"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && result && (
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <div className="w-14 h-14 rounded-full bg-lumina-green/10 flex items-center justify-center mx-auto mb-3">
                                    <Key className="w-7 h-7 text-lumina-green" />
                                </div>
                                <h4 className="text-lg font-bold text-lumina-green">Agent Registered!</h4>
                            </div>

                            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-lumina-muted">Agent ID</span>
                                    <span className="font-mono text-xs">{result.agentId}</span>
                                </div>
                            </div>

                            {/* API Key */}
                            <div className="rounded-xl border border-lumina-amber/20 bg-lumina-amber/[0.03] p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-4 h-4 text-lumina-amber" />
                                    <span className="text-xs font-semibold text-lumina-amber">
                                        Save this key. It won&apos;t be shown again.
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <code className="flex-1 text-xs font-mono bg-white/5 rounded-lg p-2.5 text-lumina-text break-all">
                                        {result.apiKey}
                                    </code>
                                    <button
                                        onClick={handleCopyKey}
                                        className="shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                                    >
                                        {keyCopied ? (
                                            <Check className="w-4 h-4 text-lumina-green" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-lumina-muted" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Example usage */}
                            <div className="rounded-xl bg-[#1a1a2e] border border-white/5 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Terminal className="w-3.5 h-3.5 text-lumina-cyan" />
                                    <span className="text-xs text-lumina-muted">Example usage</span>
                                </div>
                                <pre className="text-[11px] font-mono text-lumina-text/70 whitespace-pre-wrap">
                                    {`curl -X POST ${API_BASE_URL}/api/v1/quote \\
  -H "Authorization: Bearer ${result.apiKey}" \\
  -d '{"productId":"BLACKSWAN-002","coverageAmount":10000}'`}
                                </pre>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-2.5 rounded-lg border border-white/10 text-sm text-lumina-muted hover:border-lumina-cyan/20 transition"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
