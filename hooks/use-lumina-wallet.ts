"use client"

// useLuminaWallet — single source of truth for the connected wallet.
//
// Why this exists:
//   The Lumina frontend has historically managed the connected wallet
//   in two parallel ways:
//
//     A. Legacy `lib/wallet.ts` flow that talks directly to
//        `window.ethereum` and persists the address in
//        `localStorage["lumina_wallet"]`. Used by `app/page.tsx`,
//        `app/dashboard/page.tsx` and `app/connect/page.tsx`.
//
//     B. wagmi v2 + RainbowKit, mounted in `app/providers.tsx`. Used
//        by `components/lumina/deposit-lp-modal.tsx` and
//        `components/lumina/vault-actions.tsx` for write actions
//        (`useWriteContract`, `useWaitForTransactionReceipt`, etc.).
//
//   These two systems used to be unaware of each other, which produced
//   a confusing UX: a user who connected via /connect would see their
//   address in the dashboard but VaultActions would still report
//   `useAccount().isConnected = false`, forcing them to "connect again"
//   via the RainbowKit pill before any deposit/withdraw button became
//   active. After every page reload they had to repeat the dance.
//
// What this hook returns:
//   { address, isConnected, isWagmiConnected, source }
//
//   - `address` is the user's wallet address as a 0x string. It comes
//     from wagmi if wagmi has it, otherwise it falls back to whatever
//     was persisted in `localStorage` by the legacy flow. This means
//     UI components that only need to *display* the address or *read*
//     on-chain state never get a `null` flash on first paint, even
//     during the brief window where wagmi is initializing.
//
//   - `isConnected` is true if either system has an address. This is
//     the value to use for "is the user logged in?" UI decisions
//     (showing the dashboard, hiding the Connect button, etc.).
//
//   - `isWagmiConnected` is true ONLY if wagmi specifically has the
//     session. Components that need to *send* a transaction (write
//     contract calls) should check this and, if false, call
//     `bridgeWagmi(address)` from `lib/wallet-bridge.ts` to lift the
//     legacy session into wagmi. Once that returns, the next call
//     to `useLuminaWallet()` will have `isWagmiConnected === true`.
//
//   - `source` is `"wagmi" | "legacy" | null` for debugging.

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { getStoredWallet } from "@/lib/wallet"

export interface LuminaWallet {
    address: `0x${string}` | null
    isConnected: boolean
    isWagmiConnected: boolean
    source: "wagmi" | "legacy" | null
}

export function useLuminaWallet(): LuminaWallet {
    const { address: wagmiAddr, isConnected: wagmiConnected } = useAccount()
    const [legacyAddr, setLegacyAddr] = useState<string | null>(null)

    // Read the legacy localStorage value once on mount and again whenever
    // the underlying storage event fires. We listen to the standard DOM
    // `storage` event AND a custom `lumina:wallet-changed` event that
    // `lib/wallet.ts` will dispatch on every set/clear (so changes from
    // the same tab also trigger a rerender — `storage` only fires across
    // tabs).
    useEffect(() => {
        setLegacyAddr(getStoredWallet())

        const refresh = () => setLegacyAddr(getStoredWallet())
        window.addEventListener("storage", refresh)
        window.addEventListener("lumina:wallet-changed", refresh)
        return () => {
            window.removeEventListener("storage", refresh)
            window.removeEventListener("lumina:wallet-changed", refresh)
        }
    }, [])

    // Prefer wagmi when it has a session — wagmi knows about chain
    // switches and account changes via the connector, while the legacy
    // flow has to be polled. Fall back to legacy for the first paint
    // window before wagmi initializes.
    let address: `0x${string}` | null = null
    let source: LuminaWallet["source"] = null
    if (wagmiAddr) {
        address = wagmiAddr
        source = "wagmi"
    } else if (legacyAddr) {
        address = legacyAddr.toLowerCase() as `0x${string}`
        source = "legacy"
    }

    return {
        address,
        isConnected: !!address,
        isWagmiConnected: !!wagmiConnected,
        source,
    }
}
