"use client"

import { useState } from "react"
import Link from "next/link"
import { connectWallet } from "@/lib/wallet"

export default function ConnectPage() {
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setConnecting(true)
    setError(null)
    try {
      const addr = await connectWallet()
      if (addr) {
        window.location.href = "/dashboard"
      }
    } catch (e: any) {
      setError(e.message || "Connection failed")
    } finally {
      setConnecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 px-6 h-16 flex items-center">
        <Link href="/" className="text-white/40 hover:text-white transition-colors text-lg px-2 py-1 rounded hover:bg-white/5">
          ← Back
        </Link>
        <span className="ml-4 text-sm font-bold">
          <span className="text-cyan-400">LUMINA</span>
          <span className="text-white/20"> · </span>
          <span className="text-purple-400">M2M</span>
        </span>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">

          {/* Disclaimer */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
            <p className="text-white/50 text-sm">Lumina Protocol runs on Base L2</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-white/80 mb-3">Before you connect:</h3>
            <ul className="space-y-3 text-sm text-white/50">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Your private key <strong className="text-white/70">never leaves your wallet</strong>. Lumina only reads your public address.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>You will be asked to <strong className="text-white/70">switch to Base network</strong> if you&apos;re on a different chain.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>No transaction will be signed. <strong className="text-white/70">Connecting is free</strong> — no gas needed.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-0.5">ℹ</span>
                <span>Works with <strong className="text-white/70">MetaMask, Phantom, Coinbase Wallet</strong>, and any Web3 wallet.</span>
              </li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={connecting}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>

          <p className="text-center text-white/30 text-xs mt-4">
            By connecting, you agree to Lumina&apos;s <Link href="/terminos" className="text-cyan-400/50 hover:text-cyan-400">Terms of Service</Link>
          </p>

        </div>
      </main>
    </div>
  )
}
