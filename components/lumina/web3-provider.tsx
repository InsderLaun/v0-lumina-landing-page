"use client"

import { getDefaultConfig, RainbowKitProvider, darkTheme, connectorsForWallets } from "@rainbow-me/rainbowkit"
import { metaMaskWallet, coinbaseWallet, rainbowWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets"
import { WagmiProvider, createConfig, http } from "wagmi"
import { baseSepolia } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "@rainbow-me/rainbowkit/styles.css"
import { type ReactNode } from "react"

// [Audit #35 WC-1] WalletConnect projectId must be configured in production.
// Demo project IDs are heavily rate-limited by WalletConnect Cloud and break
// the WalletConnect connector path under any real load. We surface the
// problem at RUNTIME on the client (so the user sees a console error in the
// browser) rather than at module evaluation time — Next.js evaluates this
// file during the prerender step with NODE_ENV=production but no env vars,
// so a build-time throw would block deployment instead of catching a config
// mistake.
const rawProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
const isPlaceholder = !rawProjectId || rawProjectId === "demo-project-id"

if (typeof window !== "undefined") {
    const isProdRuntime = process.env.NODE_ENV === "production"
    if (isPlaceholder && isProdRuntime) {
        // Loud, visible error in the browser console so the operator sees it
        // immediately on the deployed site. We do NOT throw here because
        // doing so would break the entire app for visitors; WalletConnect
        // connections will fail (rate-limited demo id), but the rest of the
        // app — including injected MetaMask — keeps working.
        console.error(
            "[web3] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is missing or is the " +
                "placeholder 'demo-project-id'. WalletConnect connections WILL be " +
                "heavily rate-limited. Set the env var in Vercel; get one at " +
                "https://cloud.walletconnect.com."
        )
    } else if (isPlaceholder) {
        console.warn(
            "[web3] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is missing in dev. " +
                "WalletConnect path is rate-limited. Get one at " +
                "https://cloud.walletconnect.com."
        )
    }
}

const projectId = rawProjectId || "dev-only-placeholder-do-not-ship"

const connectors = connectorsForWallets(
    [
        {
            groupName: "Recommended",
            wallets: [metaMaskWallet, coinbaseWallet, rainbowWallet, walletConnectWallet],
        },
    ],
    { appName: "Lumina Protocol", projectId }
)

// [Audit #35 CHAIN-1] Pinned to Base Sepolia (chainId 84532) — the V5.1
// deploy. The transport URL comes from NEXT_PUBLIC_RPC_URL when set so the
// frontend can use a paid Alchemy/Infura endpoint in production; falls back
// to the public Base Sepolia RPC in dev.
const config = createConfig({
    connectors,
    chains: [baseSepolia],
    transports: { [baseSepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL) },
    ssr: true,
    multiInjectedProviderDiscovery: false,
})

// Disable wagmi auto-reconnect to prevent wallet popup on page load
config._internal.reconnectOnMount = false

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: "#00d4ff",
                        accentColorForeground: "#0a0a0f",
                        borderRadius: "medium",
                        overlayBlur: "small",
                    })}
                    modalSize="compact"
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export { config }
