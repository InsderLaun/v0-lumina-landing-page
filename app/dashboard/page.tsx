"use client"

import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center px-4 relative">
      {/* Back arrow */}
      <a href="/" className="absolute top-6 left-6 flex items-center gap-2 text-white/50 hover:text-white transition-colors">
        <span className="text-xl">←</span>
        <span className="text-sm">Back to Home</span>
      </a>

      <div className="max-w-2xl w-full text-center">

        {/* Logo */}
        <h1 className="text-lg font-bold mb-8">
          <span className="text-cyan-400">LUMINA</span>
          <span className="text-white/20"> · </span>
          <span className="text-purple-400">M2M</span>
        </h1>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-3">Dashboard</h2>
        <p className="text-white/50 mb-12">Monitor what your AI agent is doing with your capital.</p>

        {/* Timeline */}
        <div className="flex items-start justify-center gap-0 mb-12 max-w-xl mx-auto">
          {/* Step 1 */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center mb-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400/30"></span>
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 relative" />
            </div>
            <p className="text-xs font-mono text-cyan-400 mb-1">01</p>
            <p className="text-sm font-semibold text-white mb-1">Connect Wallet</p>
            <p className="text-xs text-white/40 leading-relaxed px-2">Connect your Base L2 wallet to link your address</p>
          </div>

          {/* Line 1→2 */}
          <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-500/50 to-purple-500/30 mt-[10px] flex-shrink-0" />

          {/* Step 2 */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 mb-3" />
            <p className="text-xs font-mono text-white/50 mb-1">02</p>
            <p className="text-sm font-semibold text-white mb-1">Your Agent Operates</p>
            <p className="text-xs text-white/40 leading-relaxed px-2">Your agent buys insurance and deposits in vaults using this wallet</p>
          </div>

          {/* Line 2→3 */}
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500/30 to-purple-500/50 mt-[10px] flex-shrink-0" />

          {/* Step 3 */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 mb-3" />
            <p className="text-xs font-mono text-white/50 mb-1">03</p>
            <p className="text-sm font-semibold text-white mb-1">Monitor Here</p>
            <p className="text-xs text-white/40 leading-relaxed px-2">See your vault positions, active policies, yields, and claim history — all read-only</p>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 max-w-lg mx-auto mb-6 text-left">
          <p className="text-sm text-white/60 mb-4">After connecting, you&#39;ll see:</p>
          <div className="space-y-2">
            <p className="text-sm text-white/70"><span className="text-cyan-400 mr-2">✓</span>Your USDY balance</p>
            <p className="text-sm text-white/70"><span className="text-cyan-400 mr-2">✓</span>Vault positions with current yield</p>
            <p className="text-sm text-white/70"><span className="text-cyan-400 mr-2">✓</span>Active insurance policies and their status</p>
            <p className="text-sm text-white/70"><span className="text-cyan-400 mr-2">✓</span>Claim history</p>
            <p className="text-sm text-white/70"><span className="text-purple-400 mr-2">✓</span>Emergency withdrawal (if your agent fails)</p>
          </div>
        </div>

        {/* Testnet banner */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 max-w-lg mx-auto mb-8">
          <p className="text-amber-400 text-sm">⚠️ Contracts not yet deployed. Dashboard will be fully functional after mainnet launch.</p>
        </div>

        {/* Connect Wallet button */}
        <button className="px-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all text-base mb-4 cursor-not-allowed opacity-70">
          Connect Wallet
        </button>

        {/* Back to Home */}
        <div>
          <Link href="/" className="text-sm text-white/40 hover:text-white/60 transition-colors">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  )
}
