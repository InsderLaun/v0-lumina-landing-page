"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

const TABS = ["Overview", "Vault Positions", "Active Policies", "Agent Activity", "Emergency"] as const
type Tab = (typeof TABS)[number]

// ════════════════════════════════════════════
// VAULT CONFIG
// ════════════════════════════════════════════
const VAULT_CONFIG = [
  {
    name: "Volatile Short",
    address: "0x2D7D735f71638730cbe9A143227A00Fa64E94E88",
    cooldown: "30 days",
    riskType: "VOLATILE" as const,
    products: "BSS + IL Index",
    color: "purple",
    riskBadge: "Higher Risk",
    riskBadgeColor: "amber",
  },
  {
    name: "Volatile Long",
    address: "0xDf30548d46e77015A4dDA82D3c263e81a60B075c",
    cooldown: "90 days",
    riskType: "VOLATILE" as const,
    products: "BSS + IL Index",
    color: "purple",
    riskBadge: "Higher Risk",
    riskBadgeColor: "amber",
  },
  {
    name: "Stable Short",
    address: "0x8F6e6a4Ee6aeD70757c16382eA7156AD4b33c078",
    cooldown: "90 days",
    riskType: "STABLE" as const,
    products: "Depeg + Exploit",
    color: "cyan",
    riskBadge: "Low Risk",
    riskBadgeColor: "green",
  },
  {
    name: "Stable Long",
    address: "0x3e8dF8746c42Aa4B0CDb089174aBbBaf2C3aD46c",
    cooldown: "365 days",
    riskType: "STABLE" as const,
    products: "Depeg + Exploit",
    color: "cyan",
    riskBadge: "Very Low Risk",
    riskBadgeColor: "green",
  },
]

// ════════════════════════════════════════════
// SHIELD CONFIG
// ════════════════════════════════════════════
const SHIELD_CONFIG = [
  {
    name: "Black Swan Shield",
    address: "0xC01ED8eF52506B29545f08BBf9aAe5Fe59b15CF7",
    icon: "\u{1F6E1}\uFE0F",
    productId: "BLACKSWAN-001",
    vaultName: "Volatile Short",
  },
  {
    name: "Depeg Shield",
    address: "0xCdA417909d43F252f63034346db9121441BfE70F",
    icon: "\u{1F512}",
    productId: "DEPEG-STABLE-001",
    vaultName: "Stable Short",
  },
  {
    name: "IL Index Cover",
    address: "0x73fB5CB9Aa0BeBAf74a3a4b6Cfb09d3Fd66C9FB6",
    icon: "\u{1F4CA}",
    productId: "ILPROT-001",
    vaultName: "Volatile Short",
  },
  {
    name: "Exploit Shield",
    address: "0x05170F9Ca56026001064F5242c6F9F7f181c6baA",
    icon: "\u{1F510}",
    productId: "EXPLOIT-001",
    vaultName: "Stable Short",
  },
]

const RPC_URL = "https://mainnet.base.org"
const MOCK_WALLET = "0x2b4D825417f568231e809E31B9332ED146760337"

// ════════════════════════════════════════════
// RPC HELPERS
// ════════════════════════════════════════════
async function ethCall(to: string, data: string): Promise<string> {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{ to, data }, "latest"],
    }),
  })
  const json = await res.json()
  return json.result || "0x0"
}

function encodeFnCall(selector: string, ...args: string[]): string {
  return selector + args.map((a) => a.replace("0x", "").padStart(64, "0")).join("")
}

function decodeUint256(hex: string): bigint {
  if (!hex || hex === "0x" || hex === "0x0") return 0n
  return BigInt(hex)
}

// Function selectors (verified with cast sig)
const SEL_TOTAL_ASSETS = "0x01e1d114" // totalAssets()
const SEL_TOTAL_SUPPLY = "0x18160ddd" // totalSupply()
const SEL_BALANCE_OF = "0x70a08231"   // balanceOf(address)
const SEL_ALLOCATED = "0x36cd2b11"   // allocatedAssets()
const SEL_UTILIZATION = "0x975e900e"  // utilizationBps()
const SEL_TOTAL_POLICIES = "0xf059d78e" // totalPolicies()
const SEL_GET_POLICY_INFO = "0x9588d85b" // getPolicyInfo(uint256)

// ════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════
interface VaultData {
  address: string
  totalAssets: number
  totalSupply: bigint
  userShares: bigint
  userValue: number
  allocated: number
  utilizationBps: number
  estimatedAPY: number
  loading: boolean
}

interface PolicyData {
  policyId: number
  shieldName: string
  shieldIcon: string
  vaultName: string
  insuredAgent: string
  coverageAmount: number
  premiumPaid: number
  maxPayout: number
  startTimestamp: number
  expiresAt: number
  status: number // 0=NONEXISTENT,1=WAITING,2=ACTIVE,3=EXPIRED,4=SETTLEMENT,5=PAID_OUT,6=CANCELLED
}

const STATUS_LABELS: Record<number, { label: string; color: string; pulse?: boolean }> = {
  0: { label: "Unknown", color: "bg-gray-500/15 text-gray-400 border-gray-500/20" },
  1: { label: "Waiting Period", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  2: { label: "Active", color: "bg-green-500/15 text-green-400 border-green-500/20", pulse: true },
  3: { label: "Expired", color: "bg-white/10 text-white/40 border-white/10" },
  4: { label: "Settlement", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  5: { label: "Claimed", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20" },
  6: { label: "Cancelled", color: "bg-red-500/15 text-red-400 border-red-500/20" },
}

// ════════════════════════════════════════════
// KINK MODEL
// ════════════════════════════════════════════
function calculateAPY(utilization: number, riskType: "VOLATILE" | "STABLE"): number {
  const usdyBase = 0.0355
  const params = riskType === "VOLATILE"
    ? { kink: 0.70, slopeBelow: 0.02, slopeAbove: 0.15, base: 0.01 }
    : { kink: 0.80, slopeBelow: 0.005, slopeAbove: 0.10, base: 0.003 }

  let premiumRate: number
  if (utilization <= params.kink) {
    premiumRate = params.base + params.slopeBelow * utilization
  } else {
    const rateAtKink = params.base + params.slopeBelow * params.kink
    premiumRate = rateAtKink + params.slopeAbove * (utilization - params.kink)
  }

  return (usdyBase + premiumRate * utilization) * 100
}

// ════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════
export default function DashboardPage() {
  const [connected, setConnected] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("Overview")
  const [vaultData, setVaultData] = useState<VaultData[]>([])
  const [vaultsLoading, setVaultsLoading] = useState(true)
  const [policies, setPolicies] = useState<PolicyData[]>([])
  const [policiesLoading, setPoliciesLoading] = useState(true)

  const mockAddress = "0x2b4D...0337"

  // ════════════════════════════════════════════
  // FETCH VAULT DATA
  // ════════════════════════════════════════════
  const fetchVaultData = useCallback(async () => {
    setVaultsLoading(true)
    try {
      const results = await Promise.all(
        VAULT_CONFIG.map(async (vault) => {
          const [totalAssetsHex, totalSupplyHex, balanceHex, allocatedHex, utilBpsHex] =
            await Promise.all([
              ethCall(vault.address, SEL_TOTAL_ASSETS),
              ethCall(vault.address, SEL_TOTAL_SUPPLY),
              ethCall(vault.address, encodeFnCall(SEL_BALANCE_OF, MOCK_WALLET)),
              ethCall(vault.address, SEL_ALLOCATED),
              ethCall(vault.address, SEL_UTILIZATION),
            ])

          const totalAssets = Number(decodeUint256(totalAssetsHex))
          const totalSupply = decodeUint256(totalSupplyHex)
          const userShares = decodeUint256(balanceHex)
          const allocated = Number(decodeUint256(allocatedHex))
          const utilizationBps = Number(decodeUint256(utilBpsHex))

          const userValue =
            totalSupply > 0n
              ? Number((userShares * BigInt(totalAssets)) / totalSupply)
              : 0

          const utilization = totalAssets > 0 ? allocated / totalAssets : 0
          const estimatedAPY = calculateAPY(utilization, vault.riskType)

          return {
            address: vault.address,
            totalAssets,
            totalSupply,
            userShares,
            userValue,
            allocated,
            utilizationBps,
            estimatedAPY,
            loading: false,
          }
        })
      )
      setVaultData(results)
    } catch (e) {
      console.error("Failed to fetch vault data:", e)
    }
    setVaultsLoading(false)
  }, [])

  useEffect(() => {
    fetchVaultData()
  }, [fetchVaultData])

  // ════════════════════════════════════════════
  // FETCH POLICIES
  // ════════════════════════════════════════════
  const fetchPolicies = useCallback(async () => {
    setPoliciesLoading(true)
    try {
      const allPolicies: PolicyData[] = []

      for (const shield of SHIELD_CONFIG) {
        // Get total policies count
        const totalHex = await ethCall(shield.address, SEL_TOTAL_POLICIES)
        const total = Number(decodeUint256(totalHex))

        // Iterate through all policies (1-indexed)
        for (let id = 1; id <= total; id++) {
          try {
            const idHex = "0x" + id.toString(16).padStart(64, "0")
            const result = await ethCall(shield.address, SEL_GET_POLICY_INFO + idHex.slice(2))

            if (!result || result === "0x" || result.length < 66) continue

            // Decode the PolicyInfo tuple:
            // (uint256 policyId, address insuredAgent, uint256 coverageAmount, uint256 premiumPaid,
            //  uint256 maxPayout, uint256 startTimestamp, uint256 waitingEndsAt, uint256 expiresAt,
            //  uint256 cleanupAt, uint8 status)
            const data = result.slice(2) // remove 0x
            const chunks = []
            for (let j = 0; j < data.length; j += 64) {
              chunks.push(data.slice(j, j + 64))
            }

            if (chunks.length < 10) continue

            const insuredAgent = "0x" + chunks[1].slice(24)
            if (insuredAgent.toLowerCase() !== MOCK_WALLET.toLowerCase()) continue

            allPolicies.push({
              policyId: Number(BigInt("0x" + chunks[0])),
              shieldName: shield.name,
              shieldIcon: shield.icon,
              vaultName: shield.vaultName,
              insuredAgent,
              coverageAmount: Number(BigInt("0x" + chunks[2])),
              premiumPaid: Number(BigInt("0x" + chunks[3])),
              maxPayout: Number(BigInt("0x" + chunks[4])),
              startTimestamp: Number(BigInt("0x" + chunks[5])),
              expiresAt: Number(BigInt("0x" + chunks[7])),
              status: Number(BigInt("0x" + chunks[9])),
            })
          } catch {
            continue
          }
        }
      }

      setPolicies(allPolicies)
    } catch (e) {
      console.error("Failed to fetch policies:", e)
    }
    setPoliciesLoading(false)
  }, [])

  useEffect(() => {
    fetchPolicies()
  }, [fetchPolicies])

  // ════════════════════════════════════════════
  // FORMAT HELPERS
  // ════════════════════════════════════════════
  function formatUSDY(amount: number): string {
    const usd = amount / 1e6
    return usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  function formatDate(ts: number): string {
    return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  function daysUntil(ts: number): number {
    const now = Date.now() / 1000
    return Math.max(0, Math.round((ts - now) / 86400))
  }

  function timeProgress(start: number, end: number): number {
    const now = Date.now() / 1000
    if (now >= end) return 100
    if (now <= start) return 0
    return Math.round(((now - start) / (end - start)) * 100)
  }

  function utilColor(bps: number): string {
    if (bps < 6000) return "bg-green-500"
    if (bps < 8000) return "bg-amber-500"
    return "bg-red-500"
  }

  function utilTextColor(bps: number): string {
    if (bps < 6000) return "text-green-400"
    if (bps < 8000) return "text-amber-400"
    return "text-red-400"
  }

  // ════════════════════════════════════════════
  // HEADER
  // ════════════════════════════════════════════
  const header = (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/90 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-white/40 hover:text-white transition-colors text-lg">←</Link>
          <span className="text-sm font-bold">
            <span className="text-cyan-400">LUMINA</span>
            <span className="text-white/20"> · </span>
            <span className="text-purple-400">M2M</span>
          </span>
        </div>
        <span className="text-white font-semibold text-sm hidden md:block">Dashboard</span>
        {connected ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono text-white/70">{mockAddress}</span>
            </div>
            <button onClick={() => setConnected(false)} className="text-xs text-white/40 hover:text-red-400 transition-colors">
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
  // NOT CONNECTED
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
  const totalUserValue = vaultData.reduce((sum, v) => sum + v.userValue, 0)

  const sidebar = (
    <aside className="w-full md:w-[280px] md:min-h-[calc(100vh-64px)] bg-white/[0.02] border-r border-white/10 p-5 flex-shrink-0">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-mono text-white/60">{mockAddress}</span>
        </div>
        <span className="text-[10px] text-green-400/70 uppercase tracking-wider">Connected</span>
      </div>

      <div className="mb-6">
        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Net Worth</p>
        <p className="text-2xl font-bold text-white">${formatUSDY(totalUserValue)}</p>
        <div className="mt-2 space-y-1">
          <p className="text-xs text-cyan-400">
            Protection: ${formatUSDY(policies.filter(p => p.status === 2).reduce((s, p) => s + p.coverageAmount, 0))}
          </p>
          <p className="text-xs text-purple-400">Yield: ${formatUSDY(totalUserValue)}</p>
        </div>
      </div>

      <div className="border-t border-white/10 mb-4" />

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
  // OVERVIEW TAB
  // ════════════════════════════════════════════
  const overviewContent = (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Deposited</p>
          <p className="text-2xl font-bold text-purple-400">${formatUSDY(totalUserValue)}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Active Coverage</p>
          <p className="text-2xl font-bold text-cyan-400">
            ${formatUSDY(policies.filter(p => p.status === 2).reduce((s, p) => s + p.coverageAmount, 0))}
          </p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Yield Earned</p>
          <p className="text-2xl font-bold text-green-400">$0.00</p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Policies Active</p>
          <p className="text-2xl font-bold text-white">{policies.filter(p => p.status === 2).length}</p>
        </div>
      </div>

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

  // ════════════════════════════════════════════
  // VAULT POSITIONS TAB
  // ════════════════════════════════════════════
  const skeletonCard = (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
      <div className="h-6 bg-white/10 rounded w-1/2 mb-3" />
      <div className="h-3 bg-white/10 rounded w-2/3 mb-2" />
      <div className="h-3 bg-white/10 rounded w-1/2 mb-4" />
      <div className="h-2 bg-white/10 rounded w-full" />
    </div>
  )

  const vaultPositionsContent = (
    <div>
      {vaultsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => <div key={i}>{skeletonCard}</div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VAULT_CONFIG.map((vault, i) => {
            const data = vaultData[i]
            if (!data) return null

            const hasPosition = data.userShares > 0n
            const utilPct = data.utilizationBps / 100
            const depositedValue = hasPosition
              ? Number((data.userShares * BigInt(Math.round(data.totalAssets * 1e6 / Number(data.totalSupply > 0n ? data.totalSupply : 1n)))) / 1000000n)
              : 0
            const yieldEarned = hasPosition ? data.userValue - depositedValue : 0

            return (
              <div
                key={vault.address}
                className={`bg-white/[0.03] border border-white/10 rounded-xl p-5 transition-all ${
                  !hasPosition ? "opacity-50" : ""
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        vault.color === "purple" ? "bg-purple-500" : "bg-cyan-500"
                      }`}
                    />
                    <span className="text-sm font-semibold text-white">{vault.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        vault.riskBadgeColor === "amber"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                          : "bg-green-500/15 text-green-400 border border-green-500/20"
                      }`}
                    >
                      {vault.riskBadge}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/30">Cooldown: {vault.cooldown}</span>
                </div>

                {/* User position */}
                {hasPosition ? (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Your Deposit</span>
                      <span className="text-white font-mono">${formatUSDY(depositedValue)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Current Value</span>
                      <span className="text-white font-mono">${formatUSDY(data.userValue)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Yield Earned</span>
                      <span className="text-green-400 font-mono">
                        +${formatUSDY(Math.max(0, yieldEarned))}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-xs text-white/30 italic">No position</p>
                  </div>
                )}

                {/* Public vault data */}
                <div className="border-t border-white/10 pt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Vault TVL</span>
                    <span className="text-white/70 font-mono">${formatUSDY(data.totalAssets)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Utilization</span>
                    <span className={`font-mono ${utilTextColor(data.utilizationBps)}`}>
                      {utilPct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Estimated APY</span>
                    <span className="text-green-400 font-mono">{data.estimatedAPY.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-3 text-[10px] text-white/30">
                  Products Backed: {vault.products}
                </div>

                {/* Utilization bar */}
                <div className="mt-3">
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${utilColor(data.utilizationBps)}`}
                      style={{ width: `${Math.min(utilPct, 100)}%` }}
                    />
                  </div>
                  <p className={`text-[10px] mt-1 text-right font-mono ${utilTextColor(data.utilizationBps)}`}>
                    {utilPct.toFixed(1)}%
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  // ════════════════════════════════════════════
  // ACTIVE POLICIES TAB
  // ════════════════════════════════════════════
  const policiesContent = (
    <div>
      {policiesLoading ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-white/10 rounded w-1/3 mb-4" />
              <div className="h-4 bg-white/10 rounded w-1/2 mb-3" />
              <div className="h-3 bg-white/10 rounded w-2/3 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/2 mb-4" />
              <div className="h-2 bg-white/10 rounded w-full" />
            </div>
          ))}
        </div>
      ) : policies.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
          <p className="text-white/50 text-sm mb-1">No active policies found.</p>
          <p className="text-white/30 text-xs mb-6">Your agent hasn&apos;t bought any insurance yet.</p>
          <Link
            href="/docs/skill"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all text-white"
          >
            Give Your Agent the Skill
            <span>→</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {policies.map((policy) => {
            const statusInfo = STATUS_LABELS[policy.status] || STATUS_LABELS[0]
            const progress = timeProgress(policy.startTimestamp, policy.expiresAt)
            const remaining = daysUntil(policy.expiresAt)
            const netPayout = Math.round(policy.maxPayout * 0.97) // 3% fee
            const payoutPct = policy.coverageAmount > 0
              ? Math.round((policy.maxPayout / policy.coverageAmount) * 100)
              : 0

            return (
              <div
                key={`${policy.shieldName}-${policy.policyId}`}
                className="bg-white/[0.03] border border-cyan-500/20 rounded-xl p-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{policy.shieldIcon}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{policy.shieldName}</h3>
                      <span className="text-[10px] text-white/30">Policy #{policy.policyId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusInfo.pulse && (
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    )}
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Data grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Coverage</p>
                    <p className="text-sm font-semibold text-white">${formatUSDY(policy.coverageAmount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Premium Paid</p>
                    <p className="text-sm font-semibold text-white">${formatUSDY(policy.premiumPaid)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Max Payout ({payoutPct}%)</p>
                    <p className="text-sm font-semibold text-cyan-400">${formatUSDY(policy.maxPayout)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Net Payout (after 3% fee)</p>
                    <p className="text-sm font-semibold text-cyan-400">${formatUSDY(netPayout)}</p>
                  </div>
                </div>

                {/* Details row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5 text-xs">
                  <div>
                    <span className="text-white/40">Started:</span>{" "}
                    <span className="text-white/70">{formatDate(policy.startTimestamp)}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Expires:</span>{" "}
                    <span className="text-white/70">{formatDate(policy.expiresAt)}</span>
                    {remaining > 0 && (
                      <span className="text-cyan-400 ml-1">({remaining}d left)</span>
                    )}
                  </div>
                  <div>
                    <span className="text-white/40">Vault:</span>{" "}
                    <span className="text-white/70">{policy.vaultName}</span>
                  </div>
                </div>

                {/* Time progress bar */}
                <div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-white/30">{formatDate(policy.startTimestamp)}</span>
                    <span className="text-[10px] text-white/30">{formatDate(policy.expiresAt)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  // ════════════════════════════════════════════
  // PLACEHOLDER FOR OTHER TABS
  // ════════════════════════════════════════════
  const placeholderContent = (tab: Tab) => (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
      <p className="text-white/30 text-sm">{tab} — coming soon</p>
    </div>
  )

  const mainContent = () => {
    switch (activeTab) {
      case "Overview":
        return overviewContent
      case "Vault Positions":
        return vaultPositionsContent
      case "Active Policies":
        return policiesContent
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
