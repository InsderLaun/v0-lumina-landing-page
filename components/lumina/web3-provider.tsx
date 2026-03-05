"use client"

import { getDefaultConfig, RainbowKitProvider, darkTheme, connectorsForWallets } from "@rainbow-me/rainbowkit"
import { metaMaskWallet, coinbaseWallet, rainbowWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets"
import { WagmiProvider, createConfig, http } from "wagmi"
import { base } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "@rainbow-me/rainbowkit/styles.css"
import { type ReactNode } from "react"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id"

const connectors = connectorsForWallets(
    [
        {
            groupName: "Recommended",
            wallets: [metaMaskWallet, coinbaseWallet, rainbowWallet, walletConnectWallet],
        },
    ],
    { appName: "Lumina Protocol", projectId }
)

const config = createConfig({
    connectors,
    chains: [base],
    transports: { [base.id]: http() },
    ssr: true,
})

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
