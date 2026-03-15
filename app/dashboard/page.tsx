"use client"

import { useState } from "react"
import Link from "next/link"

const TABS = ["Overview", "Vault Positions", "Active Policies", "Agent Activity", "Emergency"] as const
type Tab = (typeof TABS)[number]

export default function DashboardPage() {
  const [connected, setConnected] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("Overview")

  const mockAddress = "0x2b4D...0337"

  // ════════════════════════════════════════════
  // HEADER
  // ════════════════════════════════════════════
  const header = (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/90 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center justify-between px-6 h-16">
        {/* Left: back + logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-white/40 hover:text-white transition-colors text-lg">←</Link>
          <span className="text-sm font-bold">
            <span className="text-cyan-400">LUMINA</span>
            <span className="text-white/20"> · </span>
            <span className="text-purple-400">M2M</span>
          </span>
        </div>

        {/* Center */}
        <span className="text-white font-semibold text-sm hidden md:block">Dashboard</span>

        {/* Right: wallet */}
        {connected ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono text-white/70">{mockAddress}</span>
            </div>
            <button
              onClick={() => setConnected(false)}
              className="text-xs text-white/40 hover:text-red-400 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConnected(true)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all text-white"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  )

  // ════════════════════════════════════════════
  // NOT CONNECTED STATE
  // ════════════════════════════════════════════
  if (!connected) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white">
        {header}
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16">
          <h1 className="text-2xl font-bold mb-2">
            <span className="text-cyan-400">LUMINA</span>
            <span className="text-white/20"> · </span>
            <span className="text-purple-400">M2M</span>
          </h1>
          <p className="text-white/50 text-sm mb-8 text-center max-w-md">
            Connect your wallet to monitor your agent&apos;s activity
          </p>
          <button
            onClick={() => setConnected(true)}
            className="px-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all text-base mb-4"
          >
            Connect Wallet
          </button>
          <p className="text-white/30 text-xs">Read-only dashboard. Your agent operates, you supervise.</p>
        </div>
      </div>
    )
  }

  // ════════════════════════════════════════════
  // SIDEBAR
  // ════════════════════════════════════════════
  const sidebar = (
    <aside className="w-full md:w-[280px] md:min-h-[calc(100vh-64px)] bg-white/[0.02] border-r border-white/10 p-5 flex-shrink-0">
      {/* Wallet info */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-mono text-white/60">{mockAddress}</span>
        </div>
        <span className="text-[10px] text-green-400/70 uppercase tracking-wider">Connected</span>
      </div>

      {/* Net Worth */}
      <div className="mb-6">
        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Net Worth</p>
        <p className="text-2xl font-bold text-white">$0.00</p>
        <div className="mt-2 space-y-1">
          <p className="text-xs text-cyan-400">Protection: $0.00</p>
          <p className="text-xs text-purple-400">Yield: $0.00</p>
        </div>
      </div>

      <div className="border-t border-white/10 mb-4" />

      {/* Nav links */}
      <nav className="space-y-1 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab
                ? "bg-white/[0.08] text-white font-medium"
                : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="border-t border-white/10 mb-4" />

      {/* System Status */}
      <div>
        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">System Status</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-white/50">Contracts: Online</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-white/50">Oracle: Live prices</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-white/50">API: Connected</span>
          </div>
        </div>
      </div>
    </aside>
  )

  // ════════════════════════════════════════════
  // MAIN PANEL CONTENT
  // ════════════════════════════════════════════
  const overviewContent = (
    <div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Deposited</p>
          <p className="text-2xl font-bold text-purple-400">$0.00</p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Active Coverage</p>
          <p className="text-2xl font-bold text-cyan-400">$0.00</p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Yield Earned</p>
          <p className="text-2xl font-bold text-green-400">$0.00</p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Policies Active</p>
          <p className="text-2xl font-bold text-white">0</p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center">
        <p className="text-white/50 text-sm mb-4">
          Connect your agent with the Skill file to start seeing activity here.
        </p>
        <Link
          href="/docs/skill"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all text-white"
        >
          Give Your Agent the Skill
          <span>→</span>
        </Link>
      </div>
    </div>
  )

  const placeholderContent = (tab: Tab) => (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
      <p className="text-white/30 text-sm">{tab} — coming in Step 2+</p>
    </div>
  )

  const mainContent = () => {
    switch (activeTab) {
      case "Overview":
        return overviewContent
      case "Vault Positions":
        return placeholderContent("Vault Positions")
      case "Active Policies":
        return placeholderContent("Active Policies")
      case "Agent Activity":
        return placeholderContent("Agent Activity")
      case "Emergency":
        return placeholderContent("Emergency")
    }
  }

  // ════════════════════════════════════════════
  // CONNECTED LAYOUT
  // ════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {header}
      <div className="flex flex-col md:flex-row pt-16">
        {sidebar}
        <main className="flex-1 p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6">{activeTab}</h2>
          {mainContent()}
        </main>
      </div>
    </div>
  )
}
