"use client"

import { getDefaultConfig, RainbowKitProvider, darkTheme, connectorsForWallets } from "@rainbow-me/rainbowkit"
import { metaMaskWallet, coinbaseWallet, rainbowWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets"
import { WagmiProvider, createConfig, fallback, http } from "wagmi"
import { base } from "wagmi/chains"
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

// [Mainnet migration 2026-05-29] Pinned to Base mainnet (chainId 8453) —
// V5.4 LIVE since 2026-05-28. The Sepolia sandbox at /sandbox/* is
// fronted by lumina-api separately and does not need a wagmi config here.
//
// [Sprint F — multi-RPC redundancy] Wrap the transports in `fallback` so
// browser reads survive a single provider outage. Wagmi tries Alchemy first
// (paid, fastest); if it fails or rate-limits, falls back to QuickNode, then
// to the public Base mainnet RPC. Each provider unset → that slot collapses
// to the public endpoint, so the user always gets at least one working RPC.
const PUBLIC_BASE_MAINNET = "https://mainnet.base.org"
const ALCHEMY_RPC = process.env.NEXT_PUBLIC_RPC_URL_ALCHEMY ?? process.env.NEXT_PUBLIC_RPC_URL ?? PUBLIC_BASE_MAINNET
const QUICKNODE_RPC = process.env.NEXT_PUBLIC_RPC_URL_QUICKNODE ?? PUBLIC_BASE_MAINNET

const config = createConfig({
    connectors,
    chains: [base],
    transports: {
        [base.id]: fallback([
            http(ALCHEMY_RPC),
            http(QUICKNODE_RPC),
            http(PUBLIC_BASE_MAINNET),
        ]),
    },
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
