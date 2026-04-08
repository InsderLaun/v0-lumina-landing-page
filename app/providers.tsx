"use client"

import { type ReactNode } from "react"
import { Web3Provider } from "@/components/lumina/web3-provider"

// Wraps the entire app in Web3Provider so wagmi + RainbowKit hooks
// (useAccount, useWriteContract, useReadContract, etc.) have a valid
// context everywhere. The custom localStorage-based wallet flow used
// by /dashboard for read-only display lives in parallel — it does
// not depend on wagmi and is unaffected. Components that need to
// SEND transactions (deposit modal, withdrawal action buttons in the
// dashboard vault cards) prompt the user to connect via RainbowKit
// the first time they click a write action.
export function Providers({ children }: { children: ReactNode }) {
  return <Web3Provider>{children}</Web3Provider>
}
