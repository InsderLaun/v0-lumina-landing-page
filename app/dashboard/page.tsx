"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

const TABS = ["Overview", "My Vaults", "My Policies", "Agent Activity", "Emergency"] as const
type Tab = (typeof TABS)[number]

const SIDEBAR_SECTIONS: { label: string; items: Tab[] }[] = [
  { label: "", items: ["Overview"] },
  { label: "EARN", items: ["My Vaults"] },
  { label: "PROTECT", items: ["My Policies"] },
  { label: "MONITOR", items: ["Agent Activity", "Emergency"] },
]

// ════════════════════════════════════════════
// CONTRACT ADDRESSES
// ════════════════════════════════════════════
const POLICY_MANAGER = "0x615e9c32c70350192fCa9BAC06Ba8ebA9dC4fEF4"
const COVER_ROUTER = "0x8407afBa100812bFb5f9f188b44379E4268eff94"

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
// SHIELD CONFIG (for display mapping)
// ════════════════════════════════════════════
// Shield addresses (verified with eth_getCode) + display info
const SHIELD_LIST = [
  {
    address: "0xC01ED8eF52506B29545f08BBf9aAe5Fe59b15CF7",
    name: "Black Swan Shield",
    icon: "🛡️",
    vaultName: "Volatile Short",
  },
  {
    address: "0xCdA417909d43F252f63034346db9121441BfE70F",
    name: "Depeg Shield",
    icon: "🔒",
    vaultName: "Stable Short",
  },
  {
    address: "0x73fB5CB9Aa0BeBAf74a3a4b6Cfb09d3Fd66C9FB6",
    name: "IL Index Cover",
    icon: "📊",
    vaultName: "Volatile Short",
  },
  {
    address: "0x05170F9Ca56026001064F5242c6F9F7f181c6baA",
    name: "Exploit Shield",
    icon: "🔐",
    vaultName: "Stable Short",
  },
]

// Lookup map for display (lowercase keys)
const SHIELD_CONFIG: Record<string, { name: string; icon: string; vaultName: string }> = {}
for (const s of SHIELD_LIST) {
  SHIELD_CONFIG[s.address.toLowerCase()] = { name: s.name, icon: s.icon, vaultName: s.vaultName }
}

// ════════════════════════════════════════════
// ADDRESS ALIASES & SHIELD DESCRIPTIONS
// ════════════════════════════════════════════
const ADDRESS_ALIASES: Record<string, string> = {
  [COVER_ROUTER.toLowerCase()]: "LUMINA ROUTER",
  [POLICY_MANAGER.toLowerCase()]: "LUMINA CORE",
  ...Object.fromEntries(VAULT_CONFIG.map(v => [v.address.toLowerCase(), v.name.toUpperCase() + " VAULT"])),
  ...Object.fromEntries(SHIELD_LIST.map(s => [s.address.toLowerCase(), s.name.toUpperCase()])),
}

const SHIELD_DESCRIPTIONS: Record<string, string> = {
  "Black Swan Shield": "Covers extreme market crashes on volatile assets",
  "Depeg Shield": "Covers stablecoin depegging events",
  "IL Index Cover": "Covers impermanent loss on liquidity positions",
  "Exploit Shield": "Covers smart contract exploits and hacks",
}

const RPC_URLS = [
  "https://mainnet.base.org",
  "https://base.llamarpc.com",
]
const MOCK_WALLET = "0x2b4D825417f568231e809E31B9332ED146760337"
const API_URL = "https://lumina-protocol-production.up.railway.app"

// ════════════════════════════════════════════
// RPC HELPERS (global batch, minimal HTTP requests)
// ════════════════════════════════════════════
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function rpcBatch(calls: { to: string; data: string }[]): Promise<string[]> {
  const body = calls.map((c, i) => ({
    jsonrpc: "2.0",
    id: i + 1,
    method: "eth_call",
    params: [{ to: c.to, data: c.data }, "latest"],
  }))

  for (let rpcIdx = 0; rpcIdx < RPC_URLS.length; rpcIdx++) {
    const rpcUrl = RPC_URLS[rpcIdx]
    try {
      const res = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.status === 429) {
        await sleep(5000)
        continue
      }
      const json = await res.json()
      if (!Array.isArray(json) && json.error) {
        await sleep(2000)
        continue
      }
      if (Array.isArray(json)) {
        const sorted = [...json].sort((a, b) => a.id - b.id)
        // Per-result error handling: use "0x0" for individual failures
        return sorted.map((r) => (r.result && !r.error) ? r.result : "0x0")
      }
      return [json.result || "0x0"]
    } catch {
      await sleep(5000)
    }
  }
  return calls.map(() => "0x0")
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
const SEL_WITHDRAWAL_REQUEST = "0x8c661b5d" // getWithdrawalRequest(address)
const SEL_WITHDRAWAL_QUEUE = "0xe8daaf28"  // getWithdrawalQueue(address)

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
  withdrawalShares: bigint
  cooldownEnd: number
  withdrawalQueueV2: { shares: bigint; cooldownEnd: number }[]
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
  waitingEndsAt: number
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
  const aaveBaseYield = 0.04 // ~4% Aave V3 USDC lending yield (variable)
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

  return (aaveBaseYield + premiumRate * utilization) * 100
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
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now())
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now())

  const mockAddress = "0x2b4D...0337"

  // ════════════════════════════════════════════
  // ethCall with retry (single RPC call)
  // ════════════════════════════════════════════
  async function ethCall(to: string, data: string): Promise<string> {
    const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to, data }, "latest"] })
    for (let attempt = 0; attempt < 2; attempt++) {
      for (const rpcUrl of RPC_URLS) {
        try {
          const res = await fetch(rpcUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body })
          if (res.status === 429) { await sleep(3000); continue }
          const json = await res.json()
          if (json.result && !json.error) return json.result
        } catch { /* retry */ }
      }
      if (attempt === 0) await sleep(3000) // wait before retry
    }
    return "0x0"
  }

  // ════════════════════════════════════════════
  // FETCH VAULT DATA — 28-call batch (1 HTTP request)
  // ════════════════════════════════════════════
  const fetchVaultData = useCallback(async (): Promise<number[]> => {
    setVaultsLoading(true)

    const allCalls: { to: string; data: string }[] = []

    // Vault calls (28): 7 per vault × 4 vaults
    for (const vault of VAULT_CONFIG) {
      allCalls.push(
        { to: vault.address, data: SEL_TOTAL_ASSETS },
        { to: vault.address, data: SEL_TOTAL_SUPPLY },
        { to: vault.address, data: encodeFnCall(SEL_BALANCE_OF, MOCK_WALLET) },
        { to: vault.address, data: SEL_ALLOCATED },
        { to: vault.address, data: SEL_UTILIZATION },
        { to: vault.address, data: encodeFnCall(SEL_WITHDRAWAL_REQUEST, MOCK_WALLET) },
        { to: vault.address, data: encodeFnCall(SEL_WITHDRAWAL_QUEUE, MOCK_WALLET) },
      )
    }

    // totalPolicies calls (4): 1 per shield
    for (const shield of SHIELD_LIST) {
      allCalls.push({ to: shield.address, data: SEL_TOTAL_POLICIES })
    }

    console.log(`[Lumina] Vault batch: ${allCalls.length} calls in 1 HTTP request`)
    const raw = await rpcBatch(allCalls)

    // ── Parse vault data (calls 0-23) ──
    const vaultResults: VaultData[] = []
    for (let v = 0; v < VAULT_CONFIG.length; v++) {
      const vault = VAULT_CONFIG[v]
      const off = v * 7
      try {
        const totalAssets = Number(decodeUint256(raw[off]))
        const totalSupply = decodeUint256(raw[off + 1])
        const userShares = decodeUint256(raw[off + 2])
        const allocated = Number(decodeUint256(raw[off + 3]))
        const utilizationBps = Number(decodeUint256(raw[off + 4]))

        let withdrawalShares = 0n
        let cooldownEnd = 0
        const withdrawalHex = raw[off + 5]
        if (withdrawalHex && withdrawalHex.length >= 130) {
          withdrawalShares = BigInt("0x" + withdrawalHex.slice(2, 66))
          cooldownEnd = Number(BigInt("0x" + withdrawalHex.slice(66, 130)))
        }

        // Parse V2 withdrawal queue
        const withdrawalQueueV2: { shares: bigint; cooldownEnd: number }[] = []
        const queueHex = raw[off + 6]
        if (queueHex && queueHex.length > 130) {
          const qRaw = queueHex.slice(2) // remove 0x
          // ABI: offset(32) + length(32) + elements(shares:32 + cooldownEnd:32 each)
          const arrLen = Number(BigInt("0x" + qRaw.slice(64, 128)))
          for (let q = 0; q < arrLen; q++) {
            const elemOff = 128 + q * 128 // 2 words per element
            if (elemOff + 128 > qRaw.length) break
            const shares = BigInt("0x" + qRaw.slice(elemOff, elemOff + 64))
            const cd = Number(BigInt("0x" + qRaw.slice(elemOff + 64, elemOff + 128)))
            if (shares > 0n) withdrawalQueueV2.push({ shares, cooldownEnd: cd })
          }
        }

        const userValue = totalSupply > 0n
          ? Number((userShares * BigInt(totalAssets)) / totalSupply)
          : 0
        const utilization = totalAssets > 0 ? allocated / totalAssets : 0
        const estimatedAPY = calculateAPY(utilization, vault.riskType)

        vaultResults.push({
          address: vault.address, totalAssets, totalSupply, userShares, userValue,
          allocated, utilizationBps, estimatedAPY, withdrawalShares, cooldownEnd, withdrawalQueueV2, loading: false,
        })
      } catch (e) {
        console.error(`Failed to parse ${vault.name}:`, e)
        vaultResults.push({
          address: vault.address, totalAssets: 0, totalSupply: 0n, userShares: 0n, userValue: 0,
          allocated: 0, utilizationBps: 0, estimatedAPY: 0, withdrawalShares: 0n, cooldownEnd: 0, withdrawalQueueV2: [], loading: false,
        })
      }
    }

    // ── Parse totalPolicies (calls 28-31) ──
    const tpOff = VAULT_CONFIG.length * 7 // 28
    const shieldCounts = SHIELD_LIST.map((_, i) => Number(decodeUint256(raw[tpOff + i])))
    console.log("[Lumina] Shield policy counts:", SHIELD_LIST.map((s, i) => `${s.name}=${shieldCounts[i]}`).join(", "))

    setVaultData(vaultResults)
    setVaultsLoading(false)
    setLastRefresh(Date.now())

    return shieldCounts
  }, [])

  // ════════════════════════════════════════════
  // FETCH POLICIES — individual sequential calls with 2s delay
  // ════════════════════════════════════════════
  async function fetchPolicies(counts: number[]) {
    setPoliciesLoading(true)
    const allPolicies: PolicyData[] = []

    for (let si = 0; si < SHIELD_LIST.length; si++) {
      const shield = SHIELD_LIST[si]
      const count = counts[si]
      if (count === 0) continue

      for (let id = 1; id <= count; id++) {
        try {
          await new Promise(r => setTimeout(r, 2000))
          const calldata = SEL_GET_POLICY_INFO + id.toString(16).padStart(64, "0")
          const hex = await ethCall(shield.address, calldata)

          if (!hex || hex === "0x" || hex === "0x0" || hex.length < 640) continue

          const raw = hex.slice(2)
          const chunks: string[] = []
          for (let j = 0; j < raw.length; j += 64) chunks.push(raw.slice(j, j + 64))

          const insuredAgent = "0x" + chunks[1].slice(24)
          console.log(`[Lumina] Policy: shield=${shield.name} id=${id} agent=${insuredAgent}`)
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
            waitingEndsAt: Number(BigInt("0x" + chunks[6])),
            expiresAt: Number(BigInt("0x" + chunks[7])),
            status: (() => {
              const raw = Number(BigInt("0x" + chunks[9]))
              const nowTs = Math.floor(Date.now() / 1000)
              const start = Number(BigInt("0x" + chunks[5]))
              const expires = Number(BigInt("0x" + chunks[7]))
              if (raw === 1 && start > 0 && nowTs >= start) return 2
              if (raw === 2 && expires > 0 && nowTs >= expires) return 3
              return raw
            })(),
          })
        } catch {
          continue
        }
      }
    }

    console.log(`[Lumina] Total policies found: ${allPolicies.length}`)
    setPolicies([...allPolicies])
    setPoliciesLoading(false)
  }

  // ════════════════════════════════════════════
  // FETCH FROM API — protocol data + policies from backend cache
  // ════════════════════════════════════════════
  async function fetchFromAPI(): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/v2/dashboard?wallet=${MOCK_WALLET}`)
      if (!res.ok) return false
      const data = await res.json()

      // Parse vaults from API (protocol-level data only)
      const vaults: VaultData[] = VAULT_CONFIG.map((vault) => {
        const apiVault = data.vaults?.find((v: { address: string }) => v.address.toLowerCase() === vault.address.toLowerCase())
        if (!apiVault || apiVault.error) {
          return { address: vault.address, totalAssets: 0, totalSupply: 0n, userShares: 0n, userValue: 0, allocated: 0, utilizationBps: 0, estimatedAPY: 0, withdrawalShares: 0n, cooldownEnd: 0, withdrawalQueueV2: [], loading: false }
        }
        const totalAssets = Number(apiVault.totalAssets)
        const totalSupply = BigInt(apiVault.totalSupply)
        const allocated = Number(apiVault.allocatedAssets)
        const utilization = totalAssets > 0 ? allocated / totalAssets : 0
        return {
          address: vault.address, totalAssets, totalSupply, userShares: 0n, userValue: 0,
          allocated, utilizationBps: apiVault.utilizationBps,
          estimatedAPY: calculateAPY(utilization, vault.riskType),
          withdrawalShares: 0n, cooldownEnd: 0, withdrawalQueueV2: [], loading: false,
        }
      })
      setVaultData(vaults)

      // Parse policies from API
      const apiPolicies: PolicyData[] = (data.policies || []).map((p: { policyId: number; insuredAgent: string; coverageAmount: string; premiumPaid: string; maxPayout: string; startTimestamp: number; expiresAt: number; status: number; shieldAddress?: string; shieldName?: string }) => {
        const shield = SHIELD_LIST.find(s => s.address.toLowerCase() === (p.shieldAddress || "").toLowerCase())
        let effectiveStatus = p.status
        const nowTs = Math.floor(Date.now() / 1000)
        if (effectiveStatus === 1 && p.startTimestamp > 0 && nowTs >= p.startTimestamp) effectiveStatus = 2
        if (effectiveStatus === 2 && p.expiresAt > 0 && nowTs >= p.expiresAt) effectiveStatus = 3
        return {
          policyId: p.policyId, shieldName: shield?.name || p.shieldName || "Unknown",
          shieldIcon: shield?.icon || "🔷", vaultName: shield?.vaultName || "Unknown",
          insuredAgent: p.insuredAgent, coverageAmount: Number(p.coverageAmount),
          premiumPaid: Number(p.premiumPaid), maxPayout: Number(p.maxPayout),
          startTimestamp: p.startTimestamp, waitingEndsAt: 0, expiresAt: p.expiresAt,
          status: effectiveStatus,
        }
      })
      setPolicies(apiPolicies)
      setPoliciesLoading(false)
      setLastRefresh(Date.now())
      return true
    } catch {
      return false
    }
  }

  // ════════════════════════════════════════════
  // FETCH USER DATA — 12-call RPC batch for per-user data
  // ════════════════════════════════════════════
  async function fetchUserData() {
    const calls: { to: string; data: string }[] = []
    // 3 calls per vault × 4 vaults = 12
    for (const vault of VAULT_CONFIG) {
      calls.push(
        { to: vault.address, data: encodeFnCall(SEL_BALANCE_OF, MOCK_WALLET) },
        { to: vault.address, data: encodeFnCall(SEL_WITHDRAWAL_REQUEST, MOCK_WALLET) },
        { to: vault.address, data: encodeFnCall(SEL_WITHDRAWAL_QUEUE, MOCK_WALLET) },
      )
    }
    const raw = await rpcBatch(calls)

    setVaultData(prev => prev.map((v, vi) => {
      const off = vi * 3
      const userShares = decodeUint256(raw[off])

      let withdrawalShares = 0n
      let cooldownEnd = 0
      const wHex = raw[off + 1]
      if (wHex && wHex.length >= 130) {
        withdrawalShares = BigInt("0x" + wHex.slice(2, 66))
        cooldownEnd = Number(BigInt("0x" + wHex.slice(66, 130)))
      }

      const withdrawalQueueV2: { shares: bigint; cooldownEnd: number }[] = []
      const qHex = raw[off + 2]
      if (qHex && qHex.length > 130) {
        const qRaw = qHex.slice(2)
        const arrLen = Number(BigInt("0x" + qRaw.slice(64, 128)))
        for (let q = 0; q < arrLen; q++) {
          const elemOff = 128 + q * 128
          if (elemOff + 128 > qRaw.length) break
          const shares = BigInt("0x" + qRaw.slice(elemOff, elemOff + 64))
          const cd = Number(BigInt("0x" + qRaw.slice(elemOff + 64, elemOff + 128)))
          if (shares > 0n) withdrawalQueueV2.push({ shares, cooldownEnd: cd })
        }
      }

      const userValue = v.totalSupply > 0n ? Number((userShares * BigInt(v.totalAssets)) / v.totalSupply) : 0
      return { ...v, userShares, userValue, withdrawalShares, cooldownEnd, withdrawalQueueV2 }
    }))
    setVaultsLoading(false)
  }

  // ════════════════════════════════════════════
  // INITIAL FETCH — hybrid: API for protocol data, RPC for user data
  // ════════════════════════════════════════════
  useEffect(() => {
    async function loadAll() {
      setVaultsLoading(true)
      setPoliciesLoading(true)
      const apiOk = await fetchFromAPI()
      if (apiOk) {
        await fetchUserData()
      } else {
        // Fallback to direct RPC
        const counts = await fetchVaultData()
        setTimeout(() => fetchPolicies(counts), 3000)
      }
    }
    loadAll()
  }, [fetchVaultData])

  // Auto-refresh every 4 hours
  useEffect(() => {
    const interval = setInterval(async () => {
      setVaultsLoading(true)
      setPoliciesLoading(true)
      const apiOk = await fetchFromAPI()
      if (apiOk) {
        await fetchUserData()
      } else {
        const counts = await fetchVaultData()
        setTimeout(() => fetchPolicies(counts), 3000)
      }
    }, 14400000)
    return () => clearInterval(interval)
  }, [fetchVaultData])

  // Tick every second for "Updated Xs ago"
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(tick)
  }, [])

  // ════════════════════════════════════════════
  // FORMAT HELPERS (centralized)
  // ════════════════════════════════════════════
  function formatUSDY(amount: number): string {
    const usd = amount / 1e6
    return usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  function formatCountdown(targetTs: number): string {
    const diff = targetTs - Date.now() / 1000
    if (diff <= 0) return "EXPIRED"
    const pad = (n: number) => n.toString().padStart(2, "0")
    const d = Math.floor(diff / 86400)
    const h = Math.floor((diff % 86400) / 3600)
    const m = Math.floor((diff % 3600) / 60)
    const s = Math.floor(diff % 60)
    if (d > 0) return `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`
    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`
    return `${pad(m)}:${pad(s)}`
  }

  function formatDateFull(ts: number): string {
    const d = new Date(ts * 1000)
    const month = d.toLocaleString("en-US", { month: "short" })
    const day = d.getDate()
    const year = d.getFullYear()
    const pad = (n: number) => n.toString().padStart(2, "0")
    const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    return `${month} ${day}, ${year} — ${time}`
  }

  function getTimeUrgency(targetTs: number): "normal" | "warning" | "critical" | "expired" {
    const diff = targetTs - Date.now() / 1000
    if (diff <= 0) return "expired"
    if (diff < 3600) return "critical"
    if (diff < 86400) return "warning"
    return "normal"
  }

  function urgencyColor(urgency: string): string {
    switch (urgency) {
      case "normal": return "text-cyan-400"
      case "warning": return "text-amber-400"
      case "critical": return "text-red-400 animate-pulse"
      case "expired": return "text-red-500"
      default: return "text-white/50"
    }
  }

  function CountdownTimer({ targetTs, label, expiredLabel }: { targetTs: number; label?: string; expiredLabel?: string }) {
    const [, setTick] = useState(0)
    useEffect(() => {
      const id = setInterval(() => setTick(t => t + 1), 1000)
      return () => clearInterval(id)
    }, [])
    const urgency = getTimeUrgency(targetTs)
    if (urgency === "expired") {
      return <span className={`${urgencyColor("expired")} font-mono text-xs tabular-nums`}>{expiredLabel || "EXPIRED"}</span>
    }
    return (
      <span className={`${urgencyColor(urgency)} font-mono text-xs tabular-nums`}>
        {label && <span className="text-white/40 mr-1">{label}</span>}
        {formatCountdown(targetTs)}
      </span>
    )
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

  function shortenAddress(addr: string): string {
    return addr.slice(0, 6) + "..." + addr.slice(-4)
  }

  function timeAgo(ts: number): string {
    const now = Date.now() / 1000
    const diff = now - ts
    if (diff < 60) return "just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
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
      {(vaultsLoading || policiesLoading) && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-cyan-500 to-purple-500 animate-[slide_1.5s_ease-in-out_infinite]" />
        </div>
      )}
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
  // COMPUTED VALUES
  // ════════════════════════════════════════════
  const totalUserValue = vaultData.reduce((sum, v) => sum + v.userValue, 0)
  const protocolTVL = vaultData.reduce((sum, v) => sum + v.totalAssets, 0)
  const totalAllocated = vaultData.reduce((sum, v) => sum + v.allocated, 0)
  const activePolicies = policies.filter(p => p.status === 1 || p.status === 2)
  const activeCoverage = activePolicies.reduce((s, p) => s + p.coverageAmount, 0)
  const totalPremiums = policies.reduce((s, p) => s + p.premiumPaid, 0)

  const totalPendingWithdrawals = vaultData.reduce((sum, v) => {
    let pending = 0
    // V1
    if (v.withdrawalShares > 0n && v.totalSupply > 0n) {
      pending += Number((v.withdrawalShares * BigInt(v.totalAssets)) / v.totalSupply)
    }
    // V2
    for (const req of v.withdrawalQueueV2) {
      if (req.shares > 0n && v.totalSupply > 0n) {
        pending += Number((req.shares * BigInt(v.totalAssets)) / v.totalSupply)
      }
    }
    return sum + pending
  }, 0)

  const vaultsWithTVL = vaultData.filter(v => v.totalAssets > 0)
  const avgUtilBps = vaultsWithTVL.length > 0
    ? Math.round(vaultsWithTVL.reduce((s, v) => s + v.utilizationBps, 0) / vaultsWithTVL.length)
    : 0

  // ════════════════════════════════════════════
  // TOOLTIP COMPONENT
  // ════════════════════════════════════════════
  function Tip({ text }: { text: string }) {
    const [show, setShow] = useState(false)
    return (
      <span className="relative inline-flex ml-1">
        <span
          className="w-3.5 h-3.5 rounded-full border border-white/20 text-white/30 text-[9px] flex items-center justify-center cursor-help hover:border-white/40 hover:text-white/50 transition-colors"
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          i
        </span>
        {show && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1a1a2e] border border-white/20 rounded-lg p-3 text-xs text-white/70 max-w-[250px] shadow-xl z-50 whitespace-normal">
            {text}
          </div>
        )}
      </span>
    )
  }

  // ════════════════════════════════════════════
  // SIDEBAR
  // ════════════════════════════════════════════
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
        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Protocol TVL</p>
        <p className="text-2xl font-bold text-white font-mono tabular-nums">${formatUSDY(protocolTVL)}</p>
        <div className="mt-2 space-y-1">
          <p className="text-xs text-cyan-400 font-mono tabular-nums">
            Coverage: ${formatUSDY(activeCoverage)}
          </p>
          <p className="text-xs text-purple-400 font-mono tabular-nums">
            Your Deposits: ${formatUSDY(totalUserValue)}
          </p>
          {totalPendingWithdrawals > 0 && (
            <p className="text-xs text-amber-400 font-mono tabular-nums">
              Pending withdrawals: ${formatUSDY(totalPendingWithdrawals)}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 mb-4" />

      <nav className="space-y-1 mb-6">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.label || "top"}>
            {section.label && (
              <p className="text-[10px] text-white/30 uppercase tracking-wider mt-4 mb-2 px-3">{section.label}</p>
            )}
            {section.items.map((tab) => (
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
          </div>
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
  // OVERVIEW TAB — FIX: show protocol TVL + real policy data
  // ════════════════════════════════════════════
  const overviewContent = (
    <div>
      {/* Circuit breaker alerts */}
      {avgUtilBps > 8000 && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <span className="text-red-400 text-lg flex-shrink-0">&#9888;&#65039;</span>
          <div>
            <p className="text-red-400 text-sm font-semibold">High Demand Alert</p>
            <p className="text-red-400/70 text-xs">Insurance demand is elevated. Secondary market may be paused to protect LP capital.</p>
          </div>
        </div>
      )}
      {avgUtilBps > 6000 && avgUtilBps <= 8000 && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
          <span className="text-amber-400 text-lg flex-shrink-0">&#128202;</span>
          <div>
            <p className="text-amber-400 text-sm font-semibold">Moderate Utilization</p>
            <p className="text-amber-400/70 text-xs">Pool utilization is rising. Premium rates may increase soon.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Protocol TVL<Tip text="Total Value Locked — the sum of all capital deposited across the four insurance vaults" /></p>
          <p className="text-2xl font-bold text-purple-400 font-mono tabular-nums">${formatUSDY(protocolTVL)}</p>
          <p className="text-[10px] text-white/30 mt-1 font-mono tabular-nums">
            Your deposits: ${formatUSDY(totalUserValue)}
          </p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Active Coverage<Tip text="Total insured amount across all active policies purchased by AI agents" /></p>
          <p className="text-2xl font-bold text-cyan-400 font-mono tabular-nums">
            ${formatUSDY(activeCoverage)}
          </p>
          <p className="text-[10px] text-white/30 mt-1">
            {activePolicies.length} active {activePolicies.length === 1 ? "policy" : "policies"}
          </p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Premiums Collected</p>
          <p className="text-2xl font-bold text-green-400 font-mono tabular-nums">${formatUSDY(totalPremiums)}</p>
          <p className="text-[10px] text-white/30 mt-1">
            Protocol fee: <span className="font-mono tabular-nums">${formatUSDY(Math.round(totalPremiums * 0.03))}</span>
          </p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Capital Allocated<Tip text="Capital reserved to back active insurance policies. Higher allocation = higher premiums for new policies" /></p>
          <p className="text-2xl font-bold text-white font-mono tabular-nums">${formatUSDY(totalAllocated)}</p>
          <p className="text-[10px] text-white/30 mt-1 font-mono tabular-nums">
            {protocolTVL > 0 ? ((totalAllocated / protocolTVL) * 100).toFixed(1) : "0.0"}% utilization
          </p>
        </div>
      </div>

      {/* Quick vault breakdown */}
      {!vaultsLoading && vaultData.length > 0 && (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-6">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-4">Vault Breakdown</p>
          <div className="space-y-3">
            {VAULT_CONFIG.map((vault, i) => {
              const data = vaultData[i]
              if (!data) return null
              const pctOfTVL = protocolTVL > 0 ? (data.totalAssets / protocolTVL) * 100 : 0
              return (
                <div key={vault.address} className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${vault.color === "purple" ? "bg-purple-500" : "bg-cyan-500"}`} />
                  <span className="text-xs text-white/70 flex-1">{vault.name}</span>
                  <span className="text-xs font-mono tabular-nums text-white/50">${formatUSDY(data.totalAssets)}</span>
                  <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${vault.color === "purple" ? "bg-purple-500" : "bg-cyan-500"}`}
                      style={{ width: `${Math.min(pctOfTVL, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Insurance Metrics */}
      <div className="bg-white/[0.03] border border-cyan-500/20 rounded-xl p-5 mb-4">
        <p className="text-xs text-cyan-400 uppercase tracking-wider mb-4">Insurance Metrics</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Volume Protected</p>
            <p className="text-lg font-bold text-cyan-400 font-mono tabular-nums">${formatUSDY(policies.reduce((s, p) => s + p.coverageAmount, 0))}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Policies Issued</p>
            <p className="text-lg font-bold text-white font-mono tabular-nums">{policies.length}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Claims Paid</p>
            <p className="text-lg font-bold text-white font-mono tabular-nums">${formatUSDY(policies.filter(p => p.status === 5).reduce((s, p) => s + p.maxPayout, 0))}</p>
            <p className="text-[10px] text-white/20">{policies.filter(p => p.status === 5).length} claims</p>
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Unique Agents</p>
            <p className="text-lg font-bold text-white font-mono tabular-nums">{new Set(policies.map(p => p.insuredAgent.toLowerCase())).size}</p>
          </div>
        </div>
      </div>

      {/* LP Yield */}
      <div className="bg-white/[0.03] border border-purple-500/20 rounded-xl p-5 mb-6">
        <p className="text-xs text-purple-400 uppercase tracking-wider mb-4">LP Yield</p>
        <div className="space-y-2">
          {VAULT_CONFIG.map((vault, i) => {
            const data = vaultData[i]
            if (!data || data.userShares === 0n) return null
            const depositedValue = data.totalSupply > 0n
              ? Number((data.userShares * BigInt(Math.round(data.totalAssets * 1e6 / Number(data.totalSupply > 0n ? data.totalSupply : 1n)))) / 1000000n)
              : 0
            const yieldEarned = data.userValue - depositedValue
            const isPositive = yieldEarned >= 0
            return (
              <div key={vault.address} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${vault.color === "purple" ? "bg-purple-500" : "bg-cyan-500"}`} />
                  <span className="text-xs text-white/60">{vault.name}</span>
                  <span className="text-[10px] text-white/20 font-mono">TVL ${formatUSDY(data.totalAssets)}</span>
                </div>
                <span className={`text-xs font-mono tabular-nums font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                  {isPositive ? "+" : "-"}${formatUSDY(Math.abs(yieldEarned))}
                </span>
              </div>
            )
          })}
        </div>
        {(() => {
          const totalYield = vaultData.reduce((sum, v) => {
            if (v.userShares === 0n) return sum
            const dep = v.totalSupply > 0n
              ? Number((v.userShares * BigInt(Math.round(v.totalAssets * 1e6 / Number(v.totalSupply > 0n ? v.totalSupply : 1n)))) / 1000000n)
              : 0
            return sum + (v.userValue - dep)
          }, 0)
          const isPositive = totalYield >= 0
          return (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <span className="text-xs text-purple-400 font-semibold">Total Yield Earned</span>
              <span className={`text-sm font-bold font-mono tabular-nums ${isPositive ? "text-green-400" : "text-red-400"}`}>
                {isPositive ? "+" : "-"}${formatUSDY(Math.abs(totalYield))}
              </span>
            </div>
          )
        })()}
      </div>

      {/* Coming Soon Placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/[0.03] border border-dashed border-white/10 rounded-xl p-5 text-center">
          <p className="text-white/20 text-xs mb-1">Live Market Prices</p>
          <p className="text-white/10 text-[10px]">Chainlink oracle feeds — coming soon</p>
        </div>
        <div className="bg-white/[0.03] border border-dashed border-white/10 rounded-xl p-5 text-center">
          <p className="text-white/20 text-xs mb-1">Yield History</p>
          <p className="text-white/10 text-[10px]">7-day yield performance chart — coming soon</p>
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
                  <span className="text-[10px] text-white/30 font-mono tabular-nums">Cooldown: {vault.cooldown}</span>
                  <Tip text="After requesting a withdrawal, your funds are locked for this period. This protects the protocol from bank-run scenarios." />
                </div>

                {/* User position */}
                {hasPosition ? (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Your Deposit</span>
                      <span className="text-white font-mono tabular-nums">${formatUSDY(depositedValue)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Current Value</span>
                      <span className="text-white font-mono tabular-nums">${formatUSDY(data.userValue)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Yield Earned</span>
                      <span className="text-green-400 font-mono tabular-nums">
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
                    <span className="text-white/70 font-mono tabular-nums">${formatUSDY(data.totalAssets)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Utilization<Tip text="Percentage of vault capital backing active policies. Higher utilization means higher yields but also higher risk" /></span>
                    <span className={`font-mono tabular-nums ${utilTextColor(data.utilizationBps)}`}>
                      {utilPct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Estimated APY<Tip text="This yield comes from premiums that AI agents pay for insurance coverage, plus the Aave V3 base lending yield (~3-5%)" /></span>
                    <span className="text-green-400 font-mono tabular-nums">{data.estimatedAPY.toFixed(1)}%</span>
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
                  <p className={`text-[10px] mt-1 text-right font-mono tabular-nums ${utilTextColor(data.utilizationBps)}`}>
                    {utilPct.toFixed(1)}%
                  </p>
                </div>

                {/* Cooldown info for users with position */}
                {hasPosition && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/30">
                    <span>⏱</span>
                    <span className="font-mono">Cooldown: {vault.cooldown} after withdrawal request</span>
                  </div>
                )}

                {/* Withdrawal request pending */}
                {/* V1 Withdrawal */}
                {data.withdrawalShares > 0n && (() => {
                  const withdrawalValue = data.totalSupply > 0n
                    ? Number((data.withdrawalShares * BigInt(data.totalAssets)) / data.totalSupply)
                    : 0
                  const isReady = data.cooldownEnd > 0 && data.cooldownEnd < Date.now() / 1000
                  return isReady ? (
                    <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-green-400 uppercase tracking-wider font-semibold">Ready to Withdraw</span>
                        <span className="text-green-400 font-mono tabular-nums text-xs">${formatUSDY(withdrawalValue)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">Withdrawal Pending</span>
                        <span className="text-[10px] text-amber-400/70 font-mono tabular-nums">${formatUSDY(withdrawalValue)} requested</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/40">Available to withdraw:</span>
                        <CountdownTimer targetTs={data.cooldownEnd} expiredLabel="READY TO WITHDRAW" />
                      </div>
                    </div>
                  )
                })()}
                {/* V2 Withdrawal Queue */}
                {data.withdrawalQueueV2.map((req, qi) => {
                  const reqValue = data.totalSupply > 0n
                    ? Number((req.shares * BigInt(data.totalAssets)) / data.totalSupply)
                    : 0
                  const isReady = req.cooldownEnd > 0 && req.cooldownEnd < Date.now() / 1000
                  return isReady ? (
                    <div key={`v2-${qi}`} className="mt-3 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-green-400 uppercase tracking-wider font-semibold">Ready to Withdraw</span>
                        <span className="text-green-400 font-mono tabular-nums text-xs">${formatUSDY(reqValue)}</span>
                      </div>
                    </div>
                  ) : (
                    <div key={`v2-${qi}`} className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">Withdrawal Pending</span>
                        <span className="text-[10px] text-amber-400/70 font-mono tabular-nums">${formatUSDY(reqValue)} requested</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/40">Available to withdraw:</span>
                        <CountdownTimer targetTs={req.cooldownEnd} expiredLabel="READY TO WITHDRAW" />
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  // ════════════════════════════════════════════
  // ACTIVE POLICIES TAB — FIX: queries PolicyManager now
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
            const netPayout = Math.round(policy.maxPayout * 0.97) // 3% fee
            const payoutPct = policy.coverageAmount > 0
              ? Math.round((policy.maxPayout / policy.coverageAmount) * 100)
              : 0
            const expiryUrgency = getTimeUrgency(policy.expiresAt)
            const cardBorder = expiryUrgency === "expired"
              ? "border-white/10 opacity-60"
              : expiryUrgency === "critical"
              ? "border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
              : expiryUrgency === "warning"
              ? "border-amber-500/30"
              : "border-cyan-500/20"

            return (
              <div
                key={`${policy.shieldName}-${policy.policyId}`}
                className={`bg-white/[0.03] border rounded-xl p-6 ${cardBorder}`}
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
                    {expiryUrgency === "expired" && policy.status !== 3 && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium border border-red-500/30 bg-red-500/10 text-red-400">
                        EXPIRED
                      </span>
                    )}
                    {policy.status === 1 && (
                      <Tip text="Anti-front-running delay: Coverage activates at the shown timestamp to ensure protocol solvency." />
                    )}
                  </div>
                </div>

                {/* Data grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Coverage</p>
                    <p className="text-sm font-semibold font-mono tabular-nums text-white">${formatUSDY(policy.coverageAmount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Premium Paid</p>
                    <p className="text-sm font-semibold font-mono tabular-nums text-white">${formatUSDY(policy.premiumPaid)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Max Payout (<span className="font-mono tabular-nums">{payoutPct}%</span>)</p>
                    <p className="text-sm font-semibold font-mono tabular-nums text-cyan-400">${formatUSDY(policy.maxPayout)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Net Payout (after 3% fee)</p>
                    <p className="text-sm font-semibold font-mono tabular-nums text-cyan-400">${formatUSDY(netPayout)}</p>
                  </div>
                </div>

                {/* Details row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 text-xs">
                  <div>
                    <span className="text-white/40">Agent:</span>{" "}
                    <span className="text-white/70 font-mono">{shortenAddress(policy.insuredAgent)}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Started:</span>{" "}
                    <span className="text-white/70 font-mono tabular-nums">{formatDateFull(policy.startTimestamp)}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Expires:</span>{" "}
                    <span className="text-white/70 font-mono tabular-nums">{formatDateFull(policy.expiresAt)}</span>
                  </div>
                </div>

                {/* Countdown */}
                <div className="mb-5">
                  {policy.status === 1 ? (
                    <CountdownTimer targetTs={policy.startTimestamp} label="Coverage starts in:" expiredLabel="COVERAGE ACTIVE" />
                  ) : policy.status === 2 ? (
                    <CountdownTimer targetTs={policy.expiresAt} label="Expires in:" expiredLabel="COVERAGE ENDED" />
                  ) : null}
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
                    <span className="text-[10px] text-white/30 font-mono tabular-nums">{formatDateFull(policy.startTimestamp)}</span>
                    <span className="text-[10px] text-white/30 font-mono tabular-nums">{formatDateFull(policy.expiresAt)}</span>
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
  // AGENT ACTIVITY TAB — NEW: real activity feed
  // ════════════════════════════════════════════
  const agentActivityContent = (() => {
    const avgRate = activeCoverage > 0 ? (totalPremiums / activeCoverage * 100) : 0

    // Build alerts
    const alerts: { icon: string; color: string; borderColor: string; text: string }[] = []
    const nowTs = Math.floor(Date.now() / 1000)
    for (const p of policies) {
      if ((p.status === 1 || p.status === 2) && p.expiresAt > 0 && p.expiresAt - nowTs < 7 * 86400 && p.expiresAt > nowTs) {
        const daysLeft = Math.ceil((p.expiresAt - nowTs) / 86400)
        alerts.push({ icon: "\u23F0", color: "text-amber-400", borderColor: "border-amber-500/40", text: `${p.shieldName} expires in ${daysLeft}d \u2014 consider renewal` })
      }
      if (p.status === 3) {
        alerts.push({ icon: "\u274C", color: "text-red-400", borderColor: "border-red-500/40", text: `${p.shieldName} coverage ended on ${formatDateFull(p.expiresAt)}` })
      }
    }
    for (let vi = 0; vi < vaultData.length; vi++) {
      const v = vaultData[vi]
      if (v.utilizationBps > 7000) {
        alerts.push({ icon: "\uD83D\uDCCA", color: "text-amber-400", borderColor: "border-amber-500/40", text: `${VAULT_CONFIG[vi].name} vault at ${(v.utilizationBps / 100).toFixed(0)}% utilization \u2014 premiums rising` })
      }
      if (v.withdrawalShares > 0n && v.cooldownEnd > 0 && v.cooldownEnd < nowTs) {
        const val = v.totalSupply > 0n ? Number((v.withdrawalShares * BigInt(v.totalAssets)) / v.totalSupply) : 0
        alerts.push({ icon: "\u2705", color: "text-green-400", borderColor: "border-green-500/40", text: `$${formatUSDY(val)} ready to withdraw from ${VAULT_CONFIG[vi].name}` })
      }
      for (const req of v.withdrawalQueueV2) {
        if (req.cooldownEnd > 0 && req.cooldownEnd < nowTs) {
          const val = v.totalSupply > 0n ? Number((req.shares * BigInt(v.totalAssets)) / v.totalSupply) : 0
          alerts.push({ icon: "\u2705", color: "text-green-400", borderColor: "border-green-500/40", text: `$${formatUSDY(val)} ready to withdraw from ${VAULT_CONFIG[vi].name}` })
        }
      }
    }

    return (
      <div>
        {/* Agent Summary */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-6">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Agent Summary</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Active Policies</p>
            <p className="text-lg font-bold text-green-400 font-mono tabular-nums">{activePolicies.length}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Total Coverage</p>
            <p className="text-lg font-bold text-cyan-400 font-mono tabular-nums">${formatUSDY(activeCoverage)}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Premiums Paid</p>
            <p className="text-lg font-bold text-purple-400 font-mono tabular-nums">${formatUSDY(totalPremiums)}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Avg Premium Rate</p>
            <p className="text-lg font-bold text-white/70 font-mono tabular-nums">{avgRate.toFixed(2)}%</p>
          </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="mb-6 space-y-2">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Alerts</p>
          {alerts.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-xs text-white/30">No alerts — everything looks good</div>
          ) : alerts.map((a, i) => (
            <div key={i} className={`bg-white/[0.02] border-l-2 ${a.borderColor} border border-white/5 rounded-lg px-4 py-3 flex items-center gap-3`}>
              <span className="text-sm">{a.icon}</span>
              <span className={`text-xs ${a.color}`}>{a.text}</span>
            </div>
          ))}
        </div>

        {/* Activity Timeline */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-wider">Activity Timeline</p>
          </div>

          {policiesLoading ? (
            <div className="p-6 space-y-4">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-8 h-8 bg-white/10 rounded-full" />
                  <div className="flex-1">
                    <div className="h-3 bg-white/10 rounded w-2/3 mb-2" />
                    <div className="h-2 bg-white/10 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : policies.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-white/30 text-sm">No agent activity yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {[...policies]
                .sort((a, b) => b.startTimestamp - a.startTimestamp)
                .map((policy) => {
                  const statusInfo = STATUS_LABELS[policy.status] || STATUS_LABELS[0]
                  const durationDays = policy.expiresAt > 0 && policy.startTimestamp > 0
                    ? Math.round((policy.expiresAt - policy.startTimestamp) / 86400)
                    : 0
                  return (
                    <div key={`activity-${policy.shieldName}-${policy.policyId}`} className="px-5 py-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                      <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 text-sm">
                        {policy.shieldIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-white">Bought {policy.shieldName}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium border ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 font-mono">
                          ${formatUSDY(policy.coverageAmount)} coverage · {durationDays}d · ${formatUSDY(policy.premiumPaid)} premium
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] text-white/40">{timeAgo(policy.startTimestamp)}</p>
                        {(policy.status === 1 || policy.status === 2) && (
                          <p className="text-[10px] font-mono tabular-nums mt-0.5">
                            <span className={urgencyColor(getTimeUrgency(policy.expiresAt))}>{formatCountdown(policy.expiresAt)} left</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>
    )
  })()

  // ════════════════════════════════════════════
  // EMERGENCY TAB
  // ════════════════════════════════════════════
  const emergencyContent = (() => {
    const activeVaults = vaultData.filter(v => v.totalAssets > 0).length
    const protocolStatus = activeVaults === 4
      ? { label: "OPERATIONAL", color: "text-green-400", dot: "bg-green-400", bg: "bg-green-500/10 border-green-500/20" }
      : activeVaults > 0
        ? { label: "DEGRADED", color: "text-amber-400", dot: "bg-amber-400", bg: "bg-amber-500/10 border-amber-500/20" }
        : { label: "OFFLINE", color: "text-red-400", dot: "bg-red-400", bg: "bg-red-500/10 border-red-500/20" }

    const contracts: { category: string; items: { alias: string; addr: string }[] }[] = [
      { category: "CORE", items: [
        { alias: "Lumina Router", addr: COVER_ROUTER },
        { alias: "Policy Manager", addr: POLICY_MANAGER },
      ]},
      { category: "VAULTS", items: VAULT_CONFIG.map(v => ({ alias: v.name, addr: v.address })) },
      { category: "SHIELDS", items: SHIELD_LIST.map(s => ({ alias: s.name, addr: s.address })) },
      { category: "ORACLE", items: [
        { alias: "Oracle", addr: "0x2F9d3DA66FCB84F47851636d9e0921373ede2176" },
        { alias: "Phala Verifier", addr: "0xa2d461f4A7eC7089A7e414986d9d9b43514a82EC" },
      ]},
    ]

    return (
      <div>
        {/* Protocol Status */}
        <div className={`${protocolStatus.bg} border rounded-xl p-5 mb-6`}>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Protocol Status</p>
          <div className="flex items-center gap-3 mb-2">
            <span className={`w-3 h-3 rounded-full ${protocolStatus.dot} animate-pulse`} />
            <span className={`text-2xl font-bold ${protocolStatus.color}`}>{protocolStatus.label}</span>
          </div>
          <p className="text-xs text-white/40 mb-1">All 4 vaults active &middot; Oracle feeding prices &middot; API connected</p>
          <p className="text-[10px] text-white/30">Last verified: {new Date(lastRefresh).toLocaleTimeString()}</p>
        </div>

        {/* Utilization Monitor */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-6">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Utilization Monitor</p>
          <div className="space-y-3">
            {VAULT_CONFIG.map((vc, i) => {
              const util = vaultData[i].utilizationBps / 100
              const badge = util > 80
                ? { label: "HIGH DEMAND", color: "text-red-400 bg-red-500/10 border-red-500/30" }
                : util > 60
                  ? { label: "ELEVATED", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" }
                  : { label: "NORMAL", color: "text-green-400 bg-green-500/10 border-green-500/30" }
              return (
                <div key={vc.address} className="flex items-center gap-3">
                  <span className="text-xs text-white/50 w-32 flex-shrink-0">{vc.name}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${util > 80 ? "bg-red-500" : util > 60 ? "bg-amber-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(util, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/40 w-10 text-right">{util.toFixed(0)}%</span>
                  <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${badge.color}`}>{badge.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Circuit Breaker Rules */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-6">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Circuit Breaker Rules</p>
          <div className="space-y-2 text-xs text-white/40">
            <p>&bull; If vault utilization exceeds 90%, new policy purchases may be paused automatically</p>
            <p>&bull; Cooldown periods protect LP capital from bank-run scenarios</p>
            <p>&bull; The protocol admin can pause all operations in case of emergency</p>
            <p>&bull; Oracle prices are verified on-chain via Chainlink + Phala TEE dual oracle</p>
          </div>
        </div>

        {/* Protocol Contracts */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-6">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Protocol Contracts</p>
          <div className="space-y-4">
            {contracts.map(group => (
              <div key={group.category}>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">{group.category}</p>
                <div className="space-y-2">
                  {group.items.map(({ alias, addr }) => (
                    <div key={addr} className="group flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-white/50 w-36">{alias}</span>
                        <span className="text-[8px] font-medium text-green-400 bg-green-500/10 border border-green-500/30 rounded px-1.5 py-0.5">VERIFIED</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <a
                          href={`https://basescan.org/address/${addr}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono text-cyan-400/60 hover:text-cyan-400 transition-colors truncate flex items-center gap-1"
                          title={addr}
                        >
                          {addr} <span className="text-[8px]">&nearr;</span>
                        </a>
                        <button
                          onClick={() => { navigator.clipboard.writeText(addr); setCopiedAddr(addr); setTimeout(() => setCopiedAddr(null), 1500) }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-white/40 hover:text-white/70 border border-white/10 rounded px-1.5 py-0.5 flex-shrink-0"
                        >
                          {copiedAddr === addr ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-6">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Emergency Contacts</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Protocol Admin</span>
              <a href="https://basescan.org/address/0x2b4D825417f568231e809E31B9332ED146760337" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 font-mono hover:text-cyan-300">0x2b4D825417f568231e809E31B9332ED146760337 &nearr;</a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Technical Support</span>
              <a href="mailto:support@lumina-org.com" className="text-xs text-cyan-400 hover:text-cyan-300">support@lumina-org.com</a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Sales &amp; Partnerships</span>
              <a href="mailto:labs@lumina-org.com" className="text-xs text-cyan-400 hover:text-cyan-300">labs@lumina-org.com</a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Chain</span>
              <span className="text-xs text-white/70 font-mono">Base Mainnet (Chain ID: 8453)</span>
            </div>
          </div>
        </div>
      </div>
    )
  })()

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
      case "My Vaults":
        return vaultPositionsContent
      case "My Policies":
        return policiesContent
      case "Agent Activity":
        return agentActivityContent
      case "Emergency":
        return emergencyContent
    }
  }

  // ════════════════════════════════════════════
  // CONNECTED LAYOUT
  // ════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <style>{`@keyframes slide { 0% { transform: translateX(-100%) } 100% { transform: translateX(400%) } }`}</style>
      {header}
      <div className="flex flex-col md:flex-row pt-16">
        {sidebar}
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{activeTab}</h2>
              <span className="text-[9px] text-white/20 font-mono tabular-nums">
                Updated {Math.round((now - lastRefresh) / 1000)}s ago
              </span>
            </div>
            <button
              onClick={async () => { setVaultsLoading(true); setPoliciesLoading(true); const ok = await fetchFromAPI(); if (ok) { await fetchUserData() } else { const counts = await fetchVaultData(); setTimeout(() => fetchPolicies(counts), 3000) } }}
              disabled={vaultsLoading || policiesLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] border border-white/10 transition-all ${
                vaultsLoading || policiesLoading
                  ? "text-white/20 bg-white/[0.02] cursor-wait"
                  : "text-white/40 hover:text-white/70 bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
              title="Refresh data"
            >
              <span className={`text-sm ${vaultsLoading || policiesLoading ? "animate-spin" : ""}`}>↻</span>
              <span>{vaultsLoading || policiesLoading ? "Loading..." : "Refresh"}</span>
            </button>
          </div>
          {mainContent()}
        </main>
      </div>
    </div>
  )
}
