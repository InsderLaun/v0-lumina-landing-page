"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle, CheckCircle2, ExternalLink, Loader2, TrendingUp } from "lucide-react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits, formatUnits } from "viem"
import { useUSDCBalance, useUSDCAllowance } from "@/hooks/use-web3"
import { calculateYield } from "@/lib/pricing"
import { CONTRACTS, API_BASE_URL } from "@/lib/constants"
import { ERC20_ABI, MUTUAL_LUMINA_ABI } from "@/lib/abis"
import { TransactionStatus, InsufficientFundsBanner, type TxStatus } from "./tx-status"

interface DepositLPModalProps {
    open: boolean
    onClose: () => void
}

// Simulated available pools (in production this comes from the API)
const AVAILABLE_POOLS = [
    { id: 1, product: "Liquidation Shield", coverage: 10000, premium: 460, duration: 30, risk: "Medium" },
    { id: 2, product: "Stablecoin Depeg", coverage: 5000, premium: 150, duration: 60, risk: "Low" },
    { id: 3, product: "Gas Spike Shield", coverage: 2000, premium: 100, duration: 14, risk: "Higher" },
]

export function DepositLPModal({ open, onClose }: DepositLPModalProps) {
    const { address } = useAccount()
    const { balance: usdcBalance, formatted: usdcFormatted, display: usdcDisplay } = useUSDCBalance()
    const { allowance, refetch: refetchAllowance } = useUSDCAllowance(CONTRACTS.MutualLumina as `0x${string}`)

    const [step, setStep] = useState(1)
    const [selectedPool, setSelectedPool] = useState<(typeof AVAILABLE_POOLS)[0] | null>(null)
    const [depositAmount, setDepositAmount] = useState(10000)
    const [error, setError] = useState("")
    const [approvalTxStatus, setApprovalTxStatus] = useState<TxStatus>("idle")
    const [depositTxStatus, setDepositTxStatus] = useState<TxStatus>("idle")
    const [result, setResult] = useState<any>(null)

    const { writeContract: approveUSDC, data: approveTxHash } = useWriteContract()
    const { writeContract: depositFunds, data: depositTxHash } = useWriteContract()

    const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveTxHash })
    const { isSuccess: depositConfirmed } = useWaitForTransactionReceipt({ hash: depositTxHash })

    const hasEnoughUSDC = usdcBalance ? Number(formatUnits(usdcBalance, 6)) >= depositAmount : false
    const hasEnoughAllowance = allowance ? Number(formatUnits(allowance, 6)) >= depositAmount : false

    const yieldResult = calculateYield({
        productId: "BCS-001",
        depositAmount,
        utilizationPct: 50,
    })

    useEffect(() => {
        if (approveConfirmed) {
            setApprovalTxStatus("confirmed")
            refetchAllowance()
            setTimeout(() => setStep(4), 800)
        }
    }, [approveConfirmed, refetchAllowance])

    useEffect(() => {
        if (depositConfirmed && depositTxHash) {
            setDepositTxStatus("confirmed")
            setResult({
                poolId: selectedPool?.id || 1,
                amount: depositAmount,
                yieldEstimate: yieldResult.apyEstimate,
                duration: selectedPool?.duration || 30,
                risk: selectedPool?.risk || "Medium",
                txHash: depositTxHash,
            })
            setStep(5)
        }
    }, [depositConfirmed, depositTxHash])

    const handleApprove = () => {
        setApprovalTxStatus("pending")
        try {
            approveUSDC({
                address: CONTRACTS.USDC as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [CONTRACTS.MutualLumina as `0x${string}`, parseUnits(String(depositAmount), 6)],
            })
            setApprovalTxStatus("confirming")
        } catch (err: any) {
            setApprovalTxStatus("error")
            setError(err.shortMessage || "Transaction cancelled. Try again.")
        }
    }

    const handleDeposit = () => {
        setDepositTxStatus("pending")
        try {
            // Use createPool to effectively fund/back a pool
            depositFunds({
                address: CONTRACTS.MutualLumina as `0x${string}`,
                abi: MUTUAL_LUMINA_ABI,
                functionName: "createPool",
                args: [
                    `LP Deposit - Pool #${selectedPool?.id || 1}`,
                    "Chainlink Price Feeds",
                    parseUnits(String(depositAmount), 6),
                    BigInt(500), // 5% premium rate
                    BigInt(Math.floor(Date.now() / 1000) + (selectedPool?.duration || 30) * 86400),
                ],
            })
            setDepositTxStatus("confirming")
        } catch (err: any) {
            setDepositTxStatus("error")
            setError(err.shortMessage || "Transaction cancelled. Try again.")
        }
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
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold">Provide Liquidity</h3>
                        <button onClick={onClose} className="text-lumina-muted hover:text-lumina-text">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 mb-6">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-lumina-purple" : "bg-white/10"}`} />
                        ))}
                    </div>

                    {/* Step 1: Wallet connected + balance */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                                <div className="text-xs text-lumina-muted uppercase tracking-wider mb-2">Your Wallet</div>
                                <p className="font-mono text-sm text-lumina-text break-all">{address}</p>
                                <p className="text-sm text-lumina-purple mt-1">{usdcDisplay}</p>
                            </div>
                            <button onClick={() => setStep(2)}
                                className="w-full py-3 rounded-lg bg-lumina-purple text-white font-semibold text-sm hover:shadow-glow-purple transition-all">
                                View Pools →
                            </button>
                        </div>
                    )}

                    {/* Step 2: Available pools */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-sm text-lumina-muted mb-2">Select a pool to back:</p>
                            {AVAILABLE_POOLS.map((pool) => (
                                <button
                                    key={pool.id}
                                    onClick={() => { setSelectedPool(pool); setStep(3) }}
                                    className={`w-full text-left rounded-xl bg-white/[0.02] border border-white/5 p-4 hover:border-lumina-purple/20 transition-all`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold">{pool.product}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${pool.risk === "Low" ? "bg-lumina-green/10 text-lumina-green" :
                                            pool.risk === "Medium" ? "bg-lumina-amber/10 text-lumina-amber" :
                                                "bg-red-500/10 text-red-400"
                                            }`}>{pool.risk}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs text-lumina-muted">
                                        <div>Coverage: ${pool.coverage.toLocaleString('en-US')}</div>
                                        <div>Premium: ${pool.premium}</div>
                                        <div>Duration: {pool.duration}d</div>
                                    </div>
                                </button>
                            ))}
                            <button onClick={() => setStep(1)} className="w-full py-2 text-sm text-lumina-muted">← Back</button>
                        </div>
                    )}

                    {/* Step 3: Configure deposit + approve */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                                <div className="text-xs text-lumina-muted uppercase mb-1">Selected Pool</div>
                                <p className="text-sm font-semibold">{selectedPool?.product}</p>
                            </div>

                            <div>
                                <label className="block text-xs text-lumina-muted uppercase tracking-wider mb-2">
                                    Deposit Amount: ${depositAmount.toLocaleString('en-US')} USDC
                                </label>
                                <input type="range" min={500} max={200000} step={500} value={depositAmount}
                                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                                    className="w-full accent-[#8b5cf6] h-1.5 bg-white/10 rounded-full" />
                            </div>

                            <div className="rounded-xl bg-lumina-purple/[0.03] border border-lumina-purple/10 p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Yield if no claims</span>
                                    <span className="text-lumina-purple font-semibold">~{yieldResult.apyEstimate}% APY</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Max loss if claim</span>
                                    <span className="text-red-400">-${yieldResult.maxLossIfClaim.toLocaleString('en-US')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Duration</span>
                                    <span>{selectedPool?.duration} days</span>
                                </div>
                            </div>

                            {!hasEnoughUSDC && address && (
                                <InsufficientFundsBanner required={depositAmount} balance={usdcFormatted} />
                            )}

                            {error && (
                                <div className="rounded-lg border border-red-500/20 bg-red-500/[0.03] p-3">
                                    <p className="text-xs text-red-400">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={hasEnoughAllowance ? () => setStep(4) : handleApprove}
                                disabled={!hasEnoughUSDC || approvalTxStatus === "confirming"}
                                className="w-full py-3 rounded-lg bg-lumina-purple text-white font-semibold text-sm hover:shadow-glow-purple disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {approvalTxStatus === "confirming" ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Approving...</>
                                ) : hasEnoughAllowance ? (
                                    "Deposit →"
                                ) : (
                                    "Approve USDC"
                                )}
                            </button>

                            <TransactionStatus status={approvalTxStatus} txHash={approveTxHash} errorMessage={error} />

                            <button onClick={() => setStep(2)} className="w-full py-2 text-sm text-lumina-muted">← Back</button>
                        </div>
                    )}

                    {/* Step 4: Deposit on-chain */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <h4 className="text-base font-semibold mb-2">Deposit USDC</h4>
                                <p className="text-sm text-lumina-muted">
                                    Deposit ${depositAmount.toLocaleString('en-US')} USDC into the {selectedPool?.product} pool.
                                </p>
                            </div>

                            <button
                                onClick={handleDeposit}
                                disabled={depositTxStatus === "confirming" || depositTxStatus === "pending"}
                                className="w-full py-3 rounded-lg bg-lumina-purple text-white font-semibold text-sm hover:shadow-glow-purple disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {depositTxStatus === "pending" || depositTxStatus === "confirming" ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                ) : (
                                    "Confirm Deposit"
                                )}
                            </button>

                            <TransactionStatus status={depositTxStatus} txHash={depositTxHash} errorMessage={error} />
                        </div>
                    )}

                    {/* Step 5: Success */}
                    {step === 5 && result && (
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <div className="w-14 h-14 rounded-full bg-lumina-purple/10 flex items-center justify-center mx-auto mb-3">
                                    <TrendingUp className="w-7 h-7 text-lumina-purple" />
                                </div>
                                <h4 className="text-lg font-bold text-lumina-purple">Deposit Confirmed!</h4>
                            </div>

                            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Pool</span>
                                    <span>#{result.poolId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Deposited</span>
                                    <span>${result.amount.toLocaleString('en-US')} USDC</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Est. Yield</span>
                                    <span className="text-lumina-purple">~{result.yieldEstimate}% APY</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Duration</span>
                                    <span>{result.duration} days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Risk</span>
                                    <span>{result.risk}</span>
                                </div>
                            </div>

                            {result.txHash && (
                                <a href={`https://basescan.org/tx/${result.txHash}`} target="_blank" rel="noopener noreferrer"
                                    className="w-full py-2.5 rounded-lg border border-lumina-purple/20 text-sm text-lumina-purple flex items-center justify-center gap-2 hover:bg-lumina-purple/5 transition">
                                    View on BaseScan <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}

                            <button onClick={onClose}
                                className="w-full py-2.5 rounded-lg border border-white/10 text-sm text-lumina-muted">Done</button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
