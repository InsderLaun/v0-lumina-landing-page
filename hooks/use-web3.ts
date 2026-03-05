"use client"

import { useAccount, useReadContract, useSwitchChain } from "wagmi"
import { base } from "wagmi/chains"
import { formatUnits } from "viem"
import { ERC20_ABI } from "@/lib/abis"
import { CONTRACTS } from "@/lib/constants"

// ─── USDC Balance Hook ──────────────────────────────────────
export function useUSDCBalance() {
    const { address, chainId } = useAccount()

    const { data: balance, refetch } = useReadContract({
        address: CONTRACTS.USDC as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!address && chainId === base.id },
    })

    const formatted = balance ? formatUnits(balance, 6) : "0"

    return {
        balance,
        formatted,
        display: balance ? `${Number(formatted).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC` : "0.00 USDC",
        refetch,
    }
}

// ─── USDC Allowance Hook ────────────────────────────────────
export function useUSDCAllowance(spender: `0x${string}`) {
    const { address, chainId } = useAccount()

    const { data: allowance, refetch } = useReadContract({
        address: CONTRACTS.USDC as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: address ? [address, spender] : undefined,
        query: { enabled: !!address && chainId === base.id },
    })

    return { allowance, refetch }
}

// ─── Chain Check Hook ───────────────────────────────────────
export function useChainCheck() {
    const { chainId, isConnected } = useAccount()
    const { switchChain } = useSwitchChain()

    const isCorrectChain = chainId === base.id
    const needsSwitch = isConnected && !isCorrectChain

    const handleSwitch = () => {
        switchChain?.({ chainId: base.id })
    }

    return { isCorrectChain, needsSwitch, handleSwitch }
}
