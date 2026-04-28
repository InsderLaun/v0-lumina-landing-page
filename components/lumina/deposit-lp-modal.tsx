"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Loader2, TrendingUp } from "lucide-react"
import { useWriteContract, useWaitForTransactionReceipt, useSimulateContract } from "wagmi"
import { parseUnits, formatUnits } from "viem"
import { useUSDCBalance, useUSDCAllowance } from "@/hooks/use-web3"
import { useLuminaWallet } from "@/hooks/use-lumina-wallet"
import { bridgeWagmi } from "@/lib/wallet-bridge"
import { CONTRACTS, CHAIN } from "@/lib/lumina-config"
import { CONTRACTS as LEGACY_CONTRACTS } from "@/lib/constants"
import { ERC20_ABI, BASE_VAULT_ABI } from "@/lib/abis"
import { TransactionStatus, InsufficientFundsBanner, type TxStatus } from "./tx-status"

interface DepositLPModalProps {
    open: boolean
    onClose: () => void
    preselectedVault?: string // vault key e.g. "VolatileShort", "FlashVault"
}

// The four production vaults a LP can deposit into. Mirrors the
// `VAULTS` map in lib/lumina-config.ts so the modal stays in sync
// with the canonical addresses + cooldown days.
const VAULT_OPTIONS = [
    {
        key: "VolatileShort" as const,
        address: CONTRACTS.vaults.VolatileShort,
        name: "Volatile Short",
        description: "Backs BCS + EAS + IL Index. 37-day cooldown.",
        cooldownDays: 37,
        risk: "Higher",
        products: "BCS, EAS, IL",
    },
    {
        key: "VolatileLong" as const,
        address: CONTRACTS.vaults.VolatileLong,
        name: "Volatile Long",
        description: "Overflow vault for BCS/EAS/IL when Short is full. 97-day cooldown.",
        cooldownDays: 97,
        risk: "Higher",
        products: "BCS, EAS, IL",
    },
    {
        key: "StableShort" as const,
        address: CONTRACTS.vaults.StableShort,
        name: "Stable Short",
        description: "Backs Depeg + Exploit. 97-day cooldown.",
        cooldownDays: 97,
        risk: "Low",
        products: "DEPEG, EXPLOIT",
    },
    {
        key: "StableLong" as const,
        address: CONTRACTS.vaults.StableLong,
        name: "Stable Long",
        description: "Overflow vault for Depeg/Exploit. 372-day cooldown.",
        cooldownDays: 372,
        risk: "Very Low",
        products: "DEPEG, EXPLOIT",
    },
    {
        key: "FlashVault" as const,
        address: CONTRACTS.vaults.FlashVault,
        name: "Flash Vault",
        description: "Backs Flash BTC + Flash ETH. 7-day cooldown.",
        cooldownDays: 7,
        risk: "Higher",
        products: "Flash BTC, Flash ETH",
    },
]

const MIN_DEPOSIT_USDC = 100 // BaseVault.MIN_DEPOSIT = 100e6

export function DepositLPModal({ open, onClose, preselectedVault }: DepositLPModalProps) {
    // Unified wallet source. Uses wagmi if available, otherwise the
    // legacy localStorage. The first time the user clicks "Approve"
    // we lazily call bridgeWagmi() so wagmi can sign the tx without
    // a second authorisation popup.
    const { address, isWagmiConnected } = useLuminaWallet()
    const [bridging, setBridging] = useState(false)
    useEffect(() => {
        if (open && address && !isWagmiConnected && !bridging) {
            setBridging(true)
            bridgeWagmi()
                .catch(() => { /* user can retry on click */ })
                .finally(() => setBridging(false))
        }
    }, [open, address, isWagmiConnected, bridging])

    // If vault is preselected (from "Deposit into X" button), skip vault selection
    const preVault = preselectedVault ? VAULT_OPTIONS.find(v => v.key === preselectedVault) : null
    const [selectedVault, setSelectedVault] = useState<typeof VAULT_OPTIONS[number] | null>(preVault || null)
    const [step, setStep] = useState(1)

    // Reset when modal opens with different vault
    useEffect(() => {
        if (open) {
            const v = preselectedVault ? VAULT_OPTIONS.find(vv => vv.key === preselectedVault) : null
            setSelectedVault(v || null)
            setStep(1)
        }
    }, [open, preselectedVault])
    const [depositAmount, setDepositAmount] = useState(1000)
    const [error, setError] = useState("")
    const [approvalTxStatus, setApprovalTxStatus] = useState<TxStatus>("idle")
    const [depositTxStatus, setDepositTxStatus] = useState<TxStatus>("idle")
    const [result, setResult] = useState<{ vaultName: string; amount: number; txHash?: `0x${string}`; cooldownDays: number } | null>(null)

    const { balance: usdcBalance, formatted: usdcFormatted, display: usdcDisplay } = useUSDCBalance()
    const spender = (selectedVault?.address ?? CONTRACTS.vaults.VolatileShort) as `0x${string}`
    const { allowance, refetch: refetchAllowance } = useUSDCAllowance(spender)

    const { writeContract: approveUSDC, data: approveTxHash } = useWriteContract()
    const { writeContract: depositToVault, data: depositTxHash } = useWriteContract()

    const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveTxHash })
    const { isSuccess: depositConfirmed } = useWaitForTransactionReceipt({ hash: depositTxHash })

    // [Audit #35 SIM-1] Pre-simulate the approve and deposit calls so revert
    // reasons surface in the UI BEFORE the user is asked to sign. The hook is
    // only "armed" once the user reaches the relevant step + has a wallet
    // connected; otherwise we leave the args undefined and let wagmi skip.
    const parsedAmount = depositAmount > 0 ? parseUnits(String(depositAmount), 6) : 0n
    const { error: approveSimError } = useSimulateContract({
        address: LEGACY_CONTRACTS.USDC as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: selectedVault
            ? [selectedVault.address as `0x${string}`, parsedAmount]
            : undefined,
        query: { enabled: Boolean(selectedVault && address && parsedAmount > 0n) },
    })
    const { error: depositSimError } = useSimulateContract({
        address: (selectedVault?.address ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
        abi: BASE_VAULT_ABI,
        functionName: "deposit",
        args: address && parsedAmount > 0n ? [parsedAmount, address] : undefined,
        // We do NOT gate on `hasEnoughAllowance` here — the whole point of the
        // simulation is to surface the InsufficientAllowance revert in the UI
        // before the user signs.
        query: { enabled: Boolean(selectedVault && address && parsedAmount > 0n) },
    })

    const hasEnoughUSDC = usdcBalance ? Number(formatUnits(usdcBalance, 6)) >= depositAmount : false
    const hasEnoughAllowance = allowance ? Number(formatUnits(allowance, 6)) >= depositAmount : false
    const meetsMinimum = depositAmount >= MIN_DEPOSIT_USDC

    useEffect(() => {
        if (approveConfirmed) {
            setApprovalTxStatus("confirmed")
            refetchAllowance()
            setTimeout(() => setStep(4), 600)
        }
    }, [approveConfirmed, refetchAllowance])

    useEffect(() => {
        if (depositConfirmed && depositTxHash && selectedVault) {
            setDepositTxStatus("confirmed")
            setResult({
                vaultName: selectedVault.name,
                amount: depositAmount,
                txHash: depositTxHash,
                cooldownDays: selectedVault.cooldownDays,
            })
            setStep(5)
        }
    }, [depositConfirmed, depositTxHash, selectedVault, depositAmount])

    const handleApprove = () => {
        if (!selectedVault) return
        // [Audit #35 SIM-1] Surface simulation errors before asking the wallet.
        if (approveSimError) {
            setApprovalTxStatus("error")
            setError(
                (approveSimError as { shortMessage?: string; message: string }).shortMessage ||
                    approveSimError.message ||
                    "Transaction would revert"
            )
            return
        }
        setError("")
        setApprovalTxStatus("pending")
        try {
            approveUSDC({
                address: LEGACY_CONTRACTS.USDC as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [selectedVault.address as `0x${string}`, parseUnits(String(depositAmount), 6)],
            })
            setApprovalTxStatus("confirming")
        } catch (err: any) {
            setApprovalTxStatus("error")
            setError(err.shortMessage || err.message || "Approval cancelled. Try again.")
        }
    }

    const handleDeposit = () => {
        if (!selectedVault || !address) return
        // [Audit #35 SIM-1] Surface simulation errors before asking the wallet.
        if (depositSimError) {
            setDepositTxStatus("error")
            setError(
                (depositSimError as { shortMessage?: string; message: string }).shortMessage ||
                    depositSimError.message ||
                    "Transaction would revert"
            )
            return
        }
        setError("")
        setDepositTxStatus("pending")
        try {
            depositToVault({
                address: selectedVault.address as `0x${string}`,
                abi: BASE_VAULT_ABI,
                functionName: "deposit",
                args: [parseUnits(String(depositAmount), 6), address],
            })
            setDepositTxStatus("confirming")
        } catch (err: any) {
            setDepositTxStatus("error")
            setError(err.shortMessage || err.message || "Deposit cancelled. Try again.")
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

                    {/* Step 1: Wallet + balance */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                                <div className="text-xs text-lumina-muted uppercase tracking-wider mb-2">Your Wallet</div>
                                <p className="font-mono text-sm text-lumina-text break-all">{address ?? "Not connected"}</p>
                                <p className="text-sm text-lumina-purple mt-1">{usdcDisplay}</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (preVault) {
                                        setSelectedVault(preVault)
                                        setStep(3)
                                    } else {
                                        setStep(2)
                                    }
                                }}
                                disabled={!address}
                                className="w-full py-3 rounded-lg bg-lumina-purple text-white font-semibold text-sm hover:shadow-glow-purple transition-all disabled:opacity-50"
                            >
                                {preVault ? `Deposit into ${preVault.name} →` : "Choose Vault →"}
                            </button>
                        </div>
                    )}

                    {/* Step 2: Pick a vault */}
                    {step === 2 && (
                        <div className="space-y-3">
                            <p className="text-sm text-lumina-muted mb-2">Select a vault to deposit USDC into:</p>
                            {VAULT_OPTIONS.map((vault) => (
                                <button
                                    key={vault.key}
                                    onClick={() => { setSelectedVault(vault); setStep(3) }}
                                    className="w-full text-left rounded-xl bg-white/[0.02] border border-white/5 p-4 hover:border-lumina-purple/40 transition-all"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold">{vault.name}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${vault.risk === "Low" || vault.risk === "Very Low"
                                            ? "bg-lumina-green/10 text-lumina-green"
                                            : "bg-lumina-amber/10 text-lumina-amber"
                                            }`}>{vault.risk}</span>
                                    </div>
                                    <p className="text-xs text-lumina-muted mb-2">{vault.description}</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-lumina-muted">
                                        <div>Cooldown: {vault.cooldownDays}d</div>
                                        <div>Backs: {vault.products}</div>
                                    </div>
                                    <p className="font-mono text-[10px] text-lumina-muted mt-2 break-all">{vault.address}</p>
                                </button>
                            ))}
                            <button onClick={() => setStep(1)} className="w-full py-2 text-sm text-lumina-muted">← Back</button>
                        </div>
                    )}

                    {/* Step 3: Configure deposit + approve */}
                    {step === 3 && selectedVault && (
                        <div className="space-y-5">
                            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                                <div className="text-xs text-lumina-muted uppercase mb-1">Selected Vault</div>
                                <p className="text-sm font-semibold">{selectedVault.name}</p>
                                <p className="text-xs text-lumina-muted mt-1">Cooldown: {selectedVault.cooldownDays} days</p>
                            </div>

                            <div>
                                <label className="block text-xs text-lumina-muted uppercase tracking-wider mb-2">
                                    Deposit Amount: ${depositAmount.toLocaleString('en-US')} USDC
                                </label>
                                <input
                                    type="range"
                                    min={MIN_DEPOSIT_USDC}
                                    max={100000}
                                    step={100}
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                                    className="w-full accent-[#8b5cf6] h-1.5 bg-white/10 rounded-full"
                                />
                                <p className="text-[10px] text-lumina-muted mt-1">Minimum: ${MIN_DEPOSIT_USDC} USDC. Maximum per user is set on-chain by the vault.</p>
                            </div>

                            <div className="rounded-xl bg-lumina-purple/[0.03] border border-lumina-purple/10 p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">USDC will be supplied to Aave V3</span>
                                    <span className="text-lumina-purple font-semibold">auto</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Cooldown to withdraw</span>
                                    <span>{selectedVault.cooldownDays} days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Performance fee (on profit only)</span>
                                    <span>3%</span>
                                </div>
                            </div>

                            {!meetsMinimum && (
                                <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.03] p-3">
                                    <p className="text-xs text-amber-400">Minimum deposit is ${MIN_DEPOSIT_USDC} USDC.</p>
                                </div>
                            )}

                            {!hasEnoughUSDC && address && meetsMinimum && (
                                <InsufficientFundsBanner required={depositAmount} balance={usdcFormatted} />
                            )}

                            {error && (
                                <div className="rounded-lg border border-red-500/20 bg-red-500/[0.03] p-3">
                                    <p className="text-xs text-red-400">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={hasEnoughAllowance ? () => setStep(4) : handleApprove}
                                disabled={!hasEnoughUSDC || !meetsMinimum || approvalTxStatus === "confirming"}
                                className="w-full py-3 rounded-lg bg-lumina-purple text-white font-semibold text-sm hover:shadow-glow-purple disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {approvalTxStatus === "confirming" ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Approving...</>
                                ) : hasEnoughAllowance ? (
                                    "Continue to Deposit →"
                                ) : (
                                    "Approve USDC"
                                )}
                            </button>

                            <TransactionStatus status={approvalTxStatus} txHash={approveTxHash} errorMessage={error} />

                            <button onClick={() => setStep(preVault ? 1 : 2)} className="w-full py-2 text-sm text-lumina-muted">← Back</button>
                        </div>
                    )}

                    {/* Step 4: Deposit on-chain */}
                    {step === 4 && selectedVault && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <h4 className="text-base font-semibold mb-2">Deposit USDC</h4>
                                <p className="text-sm text-lumina-muted">
                                    Deposit ${depositAmount.toLocaleString('en-US')} USDC into <strong>{selectedVault.name}</strong>.
                                    Your shares will be minted to your wallet and locked until you request a withdrawal.
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
                                    <span className="text-lumina-muted">Vault</span>
                                    <span>{result.vaultName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Deposited</span>
                                    <span>${result.amount.toLocaleString('en-US')} USDC</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lumina-muted">Cooldown to withdraw</span>
                                    <span>{result.cooldownDays} days</span>
                                </div>
                            </div>

                            {result.txHash && (
                                <a
                                    href={`${CHAIN.explorer}/tx/${result.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2.5 rounded-lg border border-lumina-purple/20 text-sm text-lumina-purple flex items-center justify-center gap-2 hover:bg-lumina-purple/5 transition"
                                >
                                    View on BaseScan <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}

                            <button onClick={onClose} className="w-full py-2.5 rounded-lg border border-white/10 text-sm text-lumina-muted">Done</button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
