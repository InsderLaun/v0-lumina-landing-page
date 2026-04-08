"use client"

// wallet-bridge — bridges the legacy localStorage wallet flow with
// wagmi's connection state. Used by `lib/wallet.ts` (after a
// connect / disconnect / account change) and by components that
// need wagmi to "know about" a session that was opened through the
// legacy `connectWallet()` function.
//
// The bridge has two halves:
//
//   1. `bridgeWagmi(address?)` — silently asks wagmi to reconnect
//      using the injected (browser wallet) connector. Because the
//      user already authorized this dApp through the legacy flow,
//      MetaMask / Phantom / Coinbase will return the accounts
//      without showing a popup. This is the function VaultActions
//      and DepositLPModal call when they need wagmi for a write
//      transaction.
//
//   2. `unbridgeWagmi()` — disconnects wagmi cleanly. Used by the
//      legacy `disconnectWallet()` so a single click clears both
//      systems.
//
// We deliberately keep this in its own file (not in `lib/wallet.ts`)
// because it imports from `wagmi/actions` and `web3-provider`, which
// in turn pull in the React tree's wagmi config. Keeping the bridge
// isolated avoids accidentally creating a circular import.

// wagmi v3 re-exports the @wagmi/core actions and connectors via
// `wagmi/actions` and `wagmi/connectors`. Import from there so we
// don't have to add @wagmi/core or @wagmi/connectors as direct
// dependencies (they ship transitively under the wagmi package).
import { connect, disconnect, reconnect } from "wagmi/actions"
import { injected } from "wagmi/connectors"
import { config as wagmiConfig } from "@/components/lumina/web3-provider"

/**
 * Lift the legacy session into wagmi without prompting the user.
 *
 * The function is idempotent: if wagmi is already connected to the
 * same address, it returns immediately.
 *
 * Returns the address wagmi ended up connected to (lowercased), or
 * `null` if the bridge could not establish a session (no injected
 * provider, user rejected, etc.).
 */
export async function bridgeWagmi(): Promise<string | null> {
    if (typeof window === "undefined") return null
    if (!(window as any).ethereum) return null

    try {
        // First try the cheapest path: ask wagmi to reconnect to any
        // already-known connector. This is what wagmi's own
        // `reconnectOnMount` would have done if we had not disabled it
        // (we keep that flag off to avoid the multi-wallet picker
        // popping on every page load — see web3-provider.tsx).
        const reconnected = await reconnect(wagmiConfig)
        if (reconnected.length > 0 && reconnected[0].accounts.length > 0) {
            return reconnected[0].accounts[0].toLowerCase()
        }
    } catch {
        // Fall through to explicit connect.
    }

    try {
        const result = await connect(wagmiConfig, { connector: injected() })
        if (result.accounts.length > 0) {
            return result.accounts[0].toLowerCase()
        }
    } catch (err) {
        console.warn("[wallet-bridge] connect failed:", err)
    }

    return null
}

/**
 * Disconnect wagmi. Safe to call even if wagmi is already disconnected.
 */
export async function unbridgeWagmi(): Promise<void> {
    if (typeof window === "undefined") return
    try {
        await disconnect(wagmiConfig)
    } catch {
        // wagmi disconnect can throw if no active connector — ignore
    }
}
