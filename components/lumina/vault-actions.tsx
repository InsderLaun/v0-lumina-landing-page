"use client"

// Vault actions: small bridge between the read-only dashboard cards
// (which use the legacy custom-wallet localStorage flow) and the
// write-side wagmi+RainbowKit flow used by every transaction.
//
// Renders two button groups:
//   1. "Deposit USDC" → opens DepositLPModal preselected with the vault
//   2. Withdrawal queue actions:
//        - "Request withdrawal" if the user has shares but no pending request
//        - "Complete withdrawal" if any V1/V2 request has matured
//        - The countdown / pending UI is already drawn by the dashboard;
//          this component only adds the buttons.
//
// All write actions use wagmi + RainbowKit. If the user is not yet
// connected via wagmi (they may have logged in only via the legacy
// dashboard flow), the buttons show "Connect wallet to deposit" and
// open the RainbowKit connect modal on click.

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Loader2 } from "lucide-react"
import { BASE_VAULT_ABI } from "@/lib/abis"
import { DepositLPModal } from "./deposit-lp-modal"

interface VaultActionsProps {
    vaultAddress: `0x${string}`
    vaultName: string
    userShares: bigint               // current ERC-20 share balance the user holds in this vault
    pendingV1Shares: bigint          // V1 withdrawal request shares (0 if none)
    pendingV1ReadyAt: number         // unix seconds; 0 if no V1 pending
    pendingV2Queue: { shares: bigint; cooldownEnd: number }[]
}

export function VaultActions({
    vaultAddress,
    vaultName,
    userShares,
    pendingV1Shares,
    pendingV1ReadyAt,
    pendingV2Queue,
}: VaultActionsProps) {
    const [showDeposit, setShowDeposit] = useState(false)
    const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount()
    const [error, setError] = useState<string | null>(null)

    const { writeContract: requestWithdrawal, data: requestTxHash, isPending: requestPending } = useWriteContract()
    const { writeContract: completeWithdrawal, data: completeTxHash, isPending: completePending } = useWriteContract()

    const { isSuccess: requestConfirmed } = useWaitForTransactionReceipt({ hash: requestTxHash })
    const { isSuccess: completeConfirmed } = useWaitForTransactionReceipt({ hash: completeTxHash })

    useEffect(() => {
        if (requestConfirmed) {
            // Soft refresh — the dashboard will pick up the new state on its
            // next polling cycle, but we also force a quick window reload
            // for instant feedback.
            setTimeout(() => window.location.reload(), 1500)
        }
    }, [requestConfirmed])

    useEffect(() => {
        if (completeConfirmed) {
            setTimeout(() => window.location.reload(), 1500)
        }
    }, [completeConfirmed])

    const now = Date.now() / 1000
    const v1Ready = pendingV1Shares > 0n && pendingV1ReadyAt > 0 && pendingV1ReadyAt < now
    const v2ReadyEntry = pendingV2Queue.find((q) => q.cooldownEnd > 0 && q.cooldownEnd < now)
    const hasReadyWithdrawal = v1Ready || !!v2ReadyEntry
    const hasPendingWithdrawal =
        (pendingV1Shares > 0n) ||
        pendingV2Queue.some((q) => q.cooldownEnd > now)

    const handleRequest = (sharesToBurn: bigint) => {
        setError(null)
        try {
            requestWithdrawal({
                address: vaultAddress,
                abi: BASE_VAULT_ABI,
                functionName: "requestWithdrawalV2",
                args: [sharesToBurn],
            })
        } catch (err: any) {
            setError(err.shortMessage || err.message || "Request cancelled.")
        }
    }

    const handleComplete = () => {
        if (!wagmiAddress) return
        setError(null)
        try {
            completeWithdrawal({
                address: vaultAddress,
                abi: BASE_VAULT_ABI,
                functionName: "completeWithdrawalV2",
                args: [wagmiAddress],
            })
        } catch (err: any) {
            setError(err.shortMessage || err.message || "Withdrawal cancelled.")
        }
    }

    return (
        <>
            <div className="mt-3 flex flex-col gap-2">
                {/* Deposit button — always shown */}
                <button
                    onClick={() => setShowDeposit(true)}
                    className="w-full py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 transition-colors"
                >
                    Deposit USDC into {vaultName}
                </button>

                {/* Wagmi connect prompt — shown if user opens dashboard via legacy flow only */}
                {!wagmiConnected && (
                    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2 text-[10px] text-white/50 flex items-center justify-between gap-2">
                        <span>Connect via wallet for write actions:</span>
                        <ConnectButton.Custom>
                            {({ openConnectModal }) => (
                                <button
                                    onClick={openConnectModal}
                                    className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                                >
                                    Connect
                                </button>
                            )}
                        </ConnectButton.Custom>
                    </div>
                )}

                {/* Withdrawal request button — only if connected via wagmi AND has shares AND nothing pending */}
                {wagmiConnected && userShares > 0n && !hasPendingWithdrawal && (
                    <button
                        onClick={() => handleRequest(userShares)}
                        disabled={requestPending}
                        className="w-full py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {requestPending ? (
                            <><Loader2 className="w-3 h-3 animate-spin" /> Requesting...</>
                        ) : (
                            "Request withdrawal (start cooldown)"
                        )}
                    </button>
                )}

                {/* Complete withdrawal button — only if any request is ready */}
                {wagmiConnected && hasReadyWithdrawal && (
                    <button
                        onClick={handleComplete}
                        disabled={completePending}
                        className="w-full py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {completePending ? (
                            <><Loader2 className="w-3 h-3 animate-spin" /> Withdrawing...</>
                        ) : (
                            "Complete withdrawal → claim USDC"
                        )}
                    </button>
                )}

                {error && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/[0.03] p-2">
                        <p className="text-[10px] text-red-400">{error}</p>
                    </div>
                )}
            </div>

            <DepositLPModal open={showDeposit} onClose={() => setShowDeposit(false)} />
        </>
    )
}
