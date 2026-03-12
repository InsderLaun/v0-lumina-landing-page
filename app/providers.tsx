"use client"

import { type ReactNode } from "react"
import { Web3Provider } from "@/components/lumina/web3-provider"

export function Providers({ children }: { children: ReactNode }) {
  return <Web3Provider>{children}</Web3Provider>
}
