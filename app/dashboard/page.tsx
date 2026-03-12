"use client"

import { useState } from "react"
import Link from "next/link"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const [advancedOpen, setAdvancedOpen] = useState(false)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-white mb-4">
            <span className="text-cyan-400">LUMINA</span>
            <span className="text-white/20"> · </span>
            <span className="text-purple-400">M2M</span>
          </h1>
          <p className="text-white/70 text-lg mb-2">Connect your wallet to view your positions</p>
          <p className="text-white/40 text-sm mb-8">Read-only dashboard — no transactions except emergency withdrawal</p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Testnet Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-sm text-center py-2">
        ⚠️ Testnet Mode — Contract addresses pending deployment. Data shown is placeholder.
      </div>

      {/* Dashboard Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold">
            <span className="text-cyan-400">LUMINA</span>
            <span className="text-white/20"> · </span>
            <span className="text-purple-400">M2M</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50">Dashboard</span>
            <ConnectButton accountStatus="address" chainStatus="icon" showBalance={false} />
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* SECTION 1 — Wallet Overview */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Your Wallet</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-white/40 mb-1">Address</p>
              <p className="text-white/70 font-mono text-sm">{truncatedAddress}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">USDY Balance</p>
              <p className="text-white/70 text-lg font-semibold">$0.00</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">USDY in Vaults</p>
              <p className="text-white/70 text-lg font-semibold">$0.00</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Active Policies</p>
              <p className="text-white/70 text-lg font-semibold">0</p>
            </div>
          </div>
        </div>

        {/* SECTION 2 — Vault Positions */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Your Vault Positions</h2>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-white/40 font-medium pb-3">Vault</th>
                  <th className="text-left text-xs text-white/40 font-medium pb-3">Deposited</th>
                  <th className="text-left text-xs text-white/40 font-medium pb-3">Current Value</th>
                  <th className="text-left text-xs text-white/40 font-medium pb-3">Yield</th>
                  <th className="text-left text-xs text-white/40 font-medium pb-3">APY</th>
                  <th className="text-left text-xs text-white/40 font-medium pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/30 text-sm">
                    No vault positions found. Give your agent the Skill to start earning.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile placeholder */}
          <div className="md:hidden py-8 text-center text-white/30 text-sm">
            No vault positions found. Give your agent the Skill to start earning.
          </div>

          <div className="mt-4">
            <a
              href="https://github.com/agustintiberio10/LUMINA-PROTOCOL/blob/main/docs/SKILL-lumina-v2.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Give Your Agent the Skill →
            </a>
          </div>
        </div>

        {/* SECTION 3 — Active Policies */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Your Active Policies</h2>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-white/40 font-medium pb-3">Product</th>
                  <th className="text-left text-xs text-white/40 font-medium pb-3">Coverage</th>
                  <th className="text-left text-xs text-white/40 font-medium pb-3">Premium Paid</th>
                  <th className="text-left text-xs text-white/40 font-medium pb-3">Expires</th>
                  <th className="text-left text-xs text-white/40 font-medium pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="py-12 text-center text-white/30 text-sm">
                    No active policies. Give your agent the Skill to get coverage.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile placeholder */}
          <div className="md:hidden py-8 text-center text-white/30 text-sm">
            No active policies. Give your agent the Skill to get coverage.
          </div>

          <div className="mt-4">
            <a
              href="https://github.com/agustintiberio10/LUMINA-PROTOCOL/blob/main/docs/SKILL-lumina-v2.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Give Your Agent the Skill →
            </a>
          </div>
        </div>

        {/* SECTION 4 — Emergency Human Override */}
        <div>
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="text-white/30 text-sm hover:text-white/50 transition-colors"
          >
            ⚙️ Advanced
          </button>

          <AnimatePresence>
            {advancedOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">🚨 EMERGENCY HUMAN OVERRIDE</h3>
                  <p className="text-white/50 text-sm mb-6">
                    Use these ONLY if your agent fails, runs out of gas, or you need to act immediately.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <button
                      disabled
                      title="Available after contract deployment"
                      className="px-6 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400/50 font-medium text-sm cursor-not-allowed"
                    >
                      Request Withdrawal
                    </button>
                    <button
                      disabled
                      title="Available after contract deployment"
                      className="px-6 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400/50 font-medium text-sm cursor-not-allowed"
                    >
                      Complete Withdrawal
                    </button>
                  </div>

                  <p className="text-xs text-white/30 italic">
                    These are the ONLY transactions available from the web. All other operations require your AI agent.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
