"use client"

// Vault actions: deposit + withdrawal queue UI for each vault card.
//
// Wallet handling: this component now uses the unified
// `useLuminaWallet()` hook so it works for users who connected via
// EITHER the legacy localStorage flow OR wagmi/RainbowKit. The
// double "Connect via wallet for write actions" pill that the
// previous version showed has been removed — when the user clicks a
// write button (Request withdrawal / Complete withdrawal) we lazily
// call `bridgeWagmi()` if wagmi is not yet aware of the session.
// Because the user already authorised this dApp through the legacy
// flow, that bridge call resolves silently without a second popup.
// If the user has not connected at all yet, the button is disabled
// and points them at /connect.

import { useState, useEffect } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { simulateContract } from "wagmi/actions"
import { config as wagmiConfig } from "@/components/lumina/web3-provider"
import { Loader2 } from "lucide-react"
import { BASE_VAULT_ABI } from "@/lib/abis"
import { useLuminaWallet } from "@/hooks/use-lumina-wallet"
import { bridgeWagmi } from "@/lib/wallet-bridge"
import { DepositLPModal } from "./deposit-lp-modal"
import { CONTRACTS } from "@/lib/lumina-config"

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
    const { address, isConnected, isWagmiConnected } = useLuminaWallet()
    const [error, setError] = useState<string | null>(null)
    const [bridging, setBridging] = useState(false)

    const { writeContract: requestWithdrawal, data: requestTxHash, isPending: requestPending } = useWriteContract()
    const { writeContract: completeWithdrawal, data: completeTxHash, isPending: completePending } = useWriteContract()

    const { isSuccess: requestConfirmed } = useWaitForTransactionReceipt({ hash: requestTxHash })
    const { isSuccess: completeConfirmed } = useWaitForTransactionReceipt({ hash: completeTxHash })

    // Eagerly bridge the legacy session into wagmi as soon as this
    // component mounts with a legacy-only address. This means the
    // first click on a write button is just a normal MetaMask
    // confirmation, not a "connect again" + "now confirm" 2-step.
    useEffect(() => {
        if (isConnected && !isWagmiConnected && !bridging) {
            setBridging(true)
            bridgeWagmi()
                .catch(() => { /* user can retry from any write button */ })
                .finally(() => setBridging(false))
        }
    }, [isConnected, isWagmiConnected, bridging])

    useEffect(() => {
        if (requestConfirmed) {
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

    const ensureWagmiThen = async (fn: () => void) => {
        if (isWagmiConnected) {
            fn()
            return
        }
        // Lazy bridge: lift the legacy session into wagmi without a
        // popup, then run the action. If the bridge fails the user
        // sees a clear error and we leave them on the dashboard.
        setError(null)
        setBridging(true)
        try {
            const bridged = await bridgeWagmi()
            if (!bridged) {
                setError("Could not connect wallet for the transaction. Try clicking again, or reconnect from /connect.")
                return
            }
            // Give wagmi one tick to update useAccount before the
            // write hooks read it.
            setTimeout(fn, 50)
        } finally {
            setBridging(false)
        }
    }

    // [Audit #35 SIM-1] Pre-simulate the call before asking the wallet so the
    // user sees decoded reverts (cooldown not elapsed, insufficient shares,
    // etc.) BEFORE the popup. Args are dynamic here, so we simulate
    // imperatively rather than via the React hook.
    const handleRequest = (sharesToBurn: bigint) => {
        ensureWagmiThen(async () => {
            try {
                await simulateContract(wagmiConfig, {
                    address: vaultAddress,
                    abi: BASE_VAULT_ABI,
                    functionName: "requestWithdrawalV2",
                    args: [sharesToBurn],
                })
            } catch (err: any) {
                setError(err.shortMessage || err.message || "Request would revert.")
                return
            }
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
        })
    }

    const handleComplete = () => {
        if (!address) return
        ensureWagmiThen(async () => {
            try {
                await simulateContract(wagmiConfig, {
                    address: vaultAddress,
                    abi: BASE_VAULT_ABI,
                    functionName: "completeWithdrawalV2",
                    args: [address],
                })
            } catch (err: any) {
                setError(err.shortMessage || err.message || "Withdrawal would revert.")
                return
            }
            try {
                completeWithdrawal({
                    address: vaultAddress,
                    abi: BASE_VAULT_ABI,
                    functionName: "completeWithdrawalV2",
                    args: [address],
                })
            } catch (err: any) {
                setError(err.shortMessage || err.message || "Withdrawal cancelled.")
            }
        })
    }

    return (
        <>
            <div className="mt-3 flex flex-col gap-2">
                {/* Deposit button — always shown when the user is connected (either flow). */}
                {isConnected ? (
                    <button
                        onClick={() => setShowDeposit(true)}
                        className="w-full py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 transition-colors"
                    >
                        Deposit USDC into {vaultName}
                    </button>
                ) : (
                    <a
                        href="/connect"
                        className="w-full py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white/40 text-xs font-semibold text-center hover:bg-white/[0.06] transition-colors"
                    >
                        Connect wallet to deposit
                    </a>
                )}

                {/* Withdrawal request button — only if user has shares and nothing pending */}
                {isConnected && userShares > 0n && !hasPendingWithdrawal && (
                    <button
                        onClick={() => handleRequest(userShares)}
                        disabled={requestPending || bridging}
                        className="w-full py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {requestPending || bridging ? (
                            <><Loader2 className="w-3 h-3 animate-spin" /> {bridging ? "Connecting..." : "Requesting..."}</>
                        ) : (
                            "Request withdrawal (start cooldown)"
                        )}
                    </button>
                )}

                {/* Complete withdrawal button — only if any request is ready */}
                {isConnected && hasReadyWithdrawal && (
                    <button
                        onClick={handleComplete}
                        disabled={completePending || bridging}
                        className="w-full py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {completePending || bridging ? (
                            <><Loader2 className="w-3 h-3 animate-spin" /> {bridging ? "Connecting..." : "Withdrawing..."}</>
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

            <DepositLPModal
                open={showDeposit}
                onClose={() => setShowDeposit(false)}
                preselectedVault={
                    Object.entries(CONTRACTS.vaults).find(([, addr]) => addr.toLowerCase() === vaultAddress.toLowerCase())?.[0]
                }
            />
        </>
    )
}
