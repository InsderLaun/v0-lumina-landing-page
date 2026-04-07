"use client"

import { useRef, useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, ReferenceLine, CartesianGrid, Legend, ReferenceArea } from "recharts"
import Link from "next/link"

const vaultData = [
  { name: "Volatile Short", cooldown: 37, color: "#00D4AA" },
  { name: "Volatile Long", cooldown: 97, color: "#22d3ee" },
  { name: "Stable Short", cooldown: 97, color: "#a78bfa" },
  { name: "Stable Long", cooldown: 372, color: "#818cf8" },
]

const products = [
  { name: "BTC Catastrophe Shield", trigger: "BTC drops >50%", premium: "~0.3%", duration: "7-30 days", color: "#00D4AA" },
  { name: "ETH Apocalypse Shield", trigger: "ETH drops >60%", premium: "~0.3%", duration: "7-30 days", color: "#06b6d4" },
  { name: "Depeg Shield", trigger: "Stablecoin < $0.95", premium: "~0.2%", duration: "7-365 days", color: "#22d3ee" },
  { name: "IL Index Cover", trigger: "IL exceeds deductible", premium: "~0.4%", duration: "30-90 days", color: "#a78bfa" },
  { name: "Exploit Shield", trigger: "Protocol exploit + TEE proof", premium: "~0.5%", duration: "30-365 days", color: "#818cf8" },
]

const pools = [
  { name: "Volatile Short", cooldown: "37 days", products: "BCS + EAS + IL Index", apy: "4-17%", color: "#00D4AA" },
  { name: "Volatile Long", cooldown: "97 days", products: "IL Long + BCS/EAS overflow", apy: "4-21%", color: "#22d3ee" },
  { name: "Stable Short", cooldown: "97 days", products: "Depeg Short", apy: "3-9%", color: "#a78bfa" },
  { name: "Stable Long", cooldown: "372 days", products: "Depeg + Exploit", apy: "3-10%", color: "#818cf8" },
]

const metrics = [
  { label: "Verified Contracts", value: 13 },
  { label: "Tests Passing", value: 119 },
  { label: "Insurance Products", value: 4 },
  { label: "Isolated Vaults", value: 4 },
  { label: "Timelock Delay", value: 48, suffix: "h" },
  { label: "Multisig", value: 1, suffix: "-of-1" },
]

const contracts = [
  { name: "CoverRouter", addr: "0xd5f8678A0F2149B6342F9014CCe6d743234Ca025" },
  { name: "PolicyManager", addr: "0xCCA07e06762222AA27DEd58482DeD3d9a7d0162a" },
  { name: "LuminaOracle", addr: "0x4d1140ac8f8cb9d4fb4f16cae9c9cba13c44bc87" },
  { name: "PhalaVerifier", addr: "0x468b9D2E9043c80467B610bC290b698ae23adb9B" },
  { name: "VolatileShort Vault", addr: "0xbd44547581b92805aAECc40EB2809352b9b2880d" },
  { name: "VolatileLong Vault", addr: "0xFee5d6DAdA0A41407e9EA83d4F357DA6214Ff904" },
  { name: "StableShort Vault", addr: "0x429b6d7d6a6d8A62F616598349Ef3C251e2d54fC" },
  { name: "StableLong Vault", addr: "0x1778240E1d69BEBC8c0988BF1948336AA0Ea321c" },
  { name: "BTC Catastrophe Shield", addr: "0x36e37899D9D89bf367FA66da6e3CebC726Df4ce8" },
  { name: "ETH Apocalypse Shield", addr: "0xA755D134a0b2758E9b397E11E7132a243f672A3D" },
  { name: "DepegShield", addr: "0x7578816a803d293bbb4dbea0efbed872842679d0" },
  { name: "ILIndexCover", addr: "0x2ac0d2a9889a8a4143727a0240de3fed4650dd93" },
  { name: "ExploitShield", addr: "0x9870830c615d1b9c53dfee4136c4792de395b7a1" },
  { name: "EmergencyPause", addr: "0xc7ac8c19c3f10f820d7e42f07e6e257bacc22876" },
  { name: "TimelockController", addr: "0xd0De5D53dCA2D96cdE7FAf540BA3f3a44fdB747a" },
]

const securityLayers = [
  { layer: "Smart Contracts", detail: "119 tests, CEI pattern, SafeERC20, ReentrancyGuard, Solidity 0.8.20" },
  { layer: "Oracle", detail: "1-of-1 (planned 2-of-3), Chainlink TWAP, L2 sequencer uptime check, 1h grace period" },
  { layer: "Governance", detail: "TimelockController (48h delay), Gnosis Safe 1-of-1 (planned 2-of-3 multisig)" },
  { layer: "API", detail: "Rate limiting, CORS restrictions, Helmet headers, NonceManager, sanitized errors" },
]

// Kink Model data - dynamic pricing based on vault utilization
const kinkModelData = (() => {
  const kinkPoint = 80;
  const maxUtil = 95;
  const baseRate = 1.0;
  const kinkRate = 1.5;
  const jumpMultiplier = 15;
  const data = [];
  for (let u = 0; u <= 100; u += 2) {
    let premium = null, lpYield = null;
    if (u <= kinkPoint) {
      premium = baseRate + (u / kinkPoint) * kinkRate;
      lpYield = premium * (u / 100) * 0.97;
    } else if (u <= maxUtil) {
      premium = baseRate + kinkRate + ((u - kinkPoint) / (100 - kinkPoint)) * jumpMultiplier;
      lpYield = premium * (u / 100) * 0.97;
    }
    data.push({ u, premium: premium ? Math.round(premium * 100) / 100 : null, lpYield: lpYield ? Math.round(lpYield * 100) / 100 : null });
  }
  return data;
})();

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0
        const step = Math.max(1, Math.floor(target / 40))
        const timer = setInterval(() => {
          start += step
          if (start >= target) { setCount(target); clearInterval(timer) }
          else setCount(start)
        }, 30)
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <div ref={ref} className="text-4xl md:text-5xl font-bold text-[#00D4AA]">{count}{suffix}</div>
}

function FadeIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  )
}

export default function WhitepaperEN() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white font-sans" style={{ textAlign: 'justify' }}>
      {/* Header */}
      <header className="border-b border-[#1F2937] py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="https://www.lumina-org.com" className="text-[#9CA3AF] hover:text-[#00D4AA] text-sm transition-colors">{"\u2190"} Back to Lumina</Link>
            <Link href="/" className="text-lg font-bold"><span className="text-[#00D4AA]">LUMINA</span> <span className="text-[#6B7280]">PROTOCOL</span></Link>
          </div>
          <Link href="/whitepaper/es" className="text-[#9CA3AF] hover:text-[#00D4AA] text-sm transition-colors">ES</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ textAlign: 'center' }}>Executive Summary</h1>
        <div className="w-20 h-1 bg-[#00D4AA] mx-auto mb-8" />
        <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto leading-relaxed font-medium" style={{ textAlign: 'center' }}>
          Parametric insurance built exclusively for AI agents on Base L2. Real USDC. Real Aave V3 yield. No claims process.
        </p>
      </section>

      {/* Section 1: What is Lumina */}
      <FadeIn className="py-16 px-6">
        <div className="max-w-4xl mx-auto bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-8 transition-all">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ textAlign: 'center' }}>What is Lumina?</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-[#9CA3AF] flex-1">Lumina Protocol is parametric insurance for AI agents. Agents buy coverage via API, oracles verify triggers using Chainlink data, and payouts are instant. No human judges, no disputes, no waiting. Settlement in USDC on Base L2.</p>
            <div className="flex items-center gap-3 text-sm flex-1 justify-center">
              {["Agent", "API", "Contract", "Oracle", "Payout"].map((node, i) => (
                <div key={node} className="flex items-center gap-2">
                  <div className="bg-[#0A0F1C] border border-[#00D4AA40] rounded-lg px-3 py-2 text-[#00D4AA] text-xs font-medium">{node}</div>
                  {i < 4 && <span className="text-[#00D4AA]">{"\u2192"}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Section 1b: How to Invest in Vaults */}
      <FadeIn className="pb-16 px-6">
        <div className="max-w-4xl mx-auto bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-6 transition-all">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ textAlign: 'center' }}>How to Invest in Vaults</h2>
          <ul className="text-[#9CA3AF] space-y-3 list-disc list-inside">
            <li>Deposit USDC into one of 4 specialized vaults</li>
            <li>Your USDC is automatically deposited into Aave V3, earning 3-5% base APY</li>
            <li>Insurance premiums from policy buyers flow into your vault, adding yield on top</li>
            <li>Total estimated APY: 3-21% depending on vault</li>
            <li>Shares are soulbound (non-transferable) for vault stability</li>
            <li>To withdraw: request withdrawal → wait cooldown period → complete withdrawal</li>
          </ul>
        </div>
      </FadeIn>

      {/* Section 2: Coverage Types */}
      <FadeIn className="py-16 px-6 bg-[#0D1220]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ textAlign: 'center' }}>Coverage Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.name} className="bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-6 transition-all group">
                <h3 className="font-semibold mb-2" style={{ color: p.color }}>{p.name}</h3>
                <p className="text-[#9CA3AF] text-sm mb-3">Trigger: {p.trigger}</p>
                <div className="flex gap-4 text-xs text-[#6B7280]">
                  <span>Premium: {p.premium}</span>
                  <span>Duration: {p.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Section 3: Liquidity Pools */}
      <FadeIn className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ textAlign: 'center' }}>Liquidity Pools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pools.map((pool) => (
              <div
                key={pool.name}
                className="bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-6 transition-all"
                style={{ borderLeftWidth: 4, borderLeftColor: pool.color }}
              >
                <h3 className="font-semibold text-lg mb-3" style={{ color: pool.color }}>{pool.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Cooldown</span>
                    <span className="text-[#9CA3AF] font-medium">{pool.cooldown}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Products</span>
                    <span className="text-[#9CA3AF] font-medium">{pool.products}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Est. APY</span>
                    <span className="font-bold" style={{ color: pool.color }}>{pool.apy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Section 4: Vault Architecture */}
      <FadeIn className="py-16 px-6 bg-[#0D1220]">
        <div className="max-w-4xl mx-auto bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-8 transition-all">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ textAlign: 'center' }}>Vault Architecture</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vaultData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" domain={[0, 365]} tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#9CA3AF", fontSize: 12 }} width={120} axisLine={false} />
              <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid #00D4AA40", borderRadius: 8, color: "#ffffff" }} labelStyle={{ color: "#ffffff" }} itemStyle={{ color: "#ffffff" }} formatter={(v: number) => `${v} days cooldown`} />
              <Bar dataKey="cooldown" radius={[0, 6, 6, 0]}>
                {vaultData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cooldown Explanation */}
        <div className="max-w-4xl mx-auto mt-6 bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-6 transition-all">
          <h3 className="text-lg font-semibold text-[#22d3ee] mb-3">What is the Cooldown?</h3>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4">
            The cooldown is a mandatory waiting period between requesting a withdrawal and completing it. When you request a withdrawal, your shares are locked for the cooldown duration (37 to 372 days depending on the vault). During this time, your capital continues earning yield. Once the cooldown expires, you can complete the withdrawal and receive your USDC plus accumulated yield.
          </p>
          <h3 className="text-lg font-semibold text-[#22d3ee] mb-3">How to withdraw:</h3>
          <ol className="text-[#9CA3AF] text-sm space-y-2 list-decimal list-inside">
            <li>Call <code className="text-[#00D4AA]">requestWithdrawal(shares)</code> — starts the cooldown timer</li>
            <li>Wait for the cooldown period to expire</li>
            <li>Call <code className="text-[#00D4AA]">completeWithdrawal()</code> — receive USDC + yield (minus 3% performance fee on profit)</li>
          </ol>
        </div>
      </FadeIn>

      {/* Section 5: How Money Flows */}
      <FadeIn className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ textAlign: 'center' }}>How Money Flows</h2>

          {/* Flow A: Policy Purchase */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-[#00D4AA] mb-4 text-center">Policy Purchase Flow</h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["AI Agent", "Get Quote", "CoverRouter", "Shield", "Vault (Lock 1:1)", "Premium Split: 97% Vault / 3% Fee"].map((step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="bg-[#1F2937] border border-[#00D4AA40] rounded-lg px-3 py-2 text-[#00D4AA] text-xs font-medium whitespace-nowrap">{step}</div>
                  {i < arr.length - 1 && <span className="text-[#00D4AA] font-bold">{"\u2192"}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Flow B: Vault Investment */}
          <div>
            <h3 className="text-lg font-semibold text-[#22d3ee] mb-4 text-center">Vault Investment Flow (LP)</h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["Deposit USDC", "Vault", "Aave V3 Yield", "Premiums In", "Request Withdrawal", "Cooldown (37-372d)", "Withdraw + Yield"].map((step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="bg-[#1F2937] border border-[#22d3ee40] rounded-lg px-3 py-2 text-[#22d3ee] text-xs font-medium whitespace-nowrap">{step}</div>
                  {i < arr.length - 1 && <span className="text-[#00D4AA] font-bold">{"\u2192"}</span>}
                </div>
              ))}
            </div>
            <p className="text-[#9CA3AF] text-sm mt-4 text-center">Performance fee: 3% charged only on positive yield (profit above deposit cost)</p>
          </div>
        </div>
      </FadeIn>

      {/* Section: Dynamic Pricing Model (Kink) */}
      <FadeIn className="py-16 px-6 bg-[#0D1220]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center" style={{ textAlign: 'center' }}>Dynamic Pricing Model (Kink)</h2>
          <p className="text-[#9CA3AF] text-sm text-center mb-10" style={{ textAlign: 'center' }}>The protocol automatically adjusts premium costs and LP yields based on available capital in the vaults.</p>

          {/* Single large chart with dual Y axes */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 mb-8">
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={kinkModelData} margin={{ top: 10, right: 40, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="premiumGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F87171" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00D4AA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="u" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={{ stroke: "#1F2937" }} label={{ value: "Vault Utilization (%)", position: "insideBottom", offset: -10, fill: "#9CA3AF", fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#F87171" }} axisLine={false} label={{ value: "Premium Rate", angle: -90, position: "insideLeft", fill: "#F87171", fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#00D4AA" }} axisLine={false} label={{ value: "LP Yield %", angle: 90, position: "insideRight", fill: "#00D4AA", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: 12, color: "#fff" }} labelFormatter={(l) => `Utilization: ${l}%`} />
                <ReferenceLine x={80} yAxisId="left" stroke="#F59E0B" strokeDasharray="6 4" strokeWidth={2} label={{ value: "Kink (80%)", position: "top", fill: "#F59E0B", fontSize: 12 }} />
                <ReferenceArea x1={95} x2={100} yAxisId="left" fill="#EF4444" fillOpacity={0.12} label={{ value: "No new policies", position: "insideTop", fill: "#EF4444", fontSize: 10 }} />
                <Area yAxisId="left" type="monotone" dataKey="premium" stroke="#F87171" strokeWidth={2.5} fill="url(#premiumGrad)" name="Premium Rate" connectNulls={false} />
                <Area yAxisId="right" type="monotone" dataKey="lpYield" stroke="#00D4AA" strokeWidth={2.5} fill="url(#yieldGrad)" name="LP Yield %" connectNulls={false} />
                <Legend wrapperStyle={{ color: "#9CA3AF", fontSize: 12, paddingTop: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Three zone cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1F2937] border-l-4 border-[#10B981] rounded-xl p-5">
              <h4 className="text-[#10B981] font-semibold mb-2">Low Zone (0-60%)</h4>
              <p className="text-[#9CA3AF] text-sm" style={{ textAlign: 'justify' }}>Abundant capital. Low premiums make coverage affordable for agents. LP yield is moderate. Ideal conditions for buying insurance.</p>
            </div>
            <div className="bg-[#1F2937] border-l-4 border-[#F59E0B] rounded-xl p-5">
              <h4 className="text-[#F59E0B] font-semibold mb-2">Transition Zone (60-80%)</h4>
              <p className="text-[#9CA3AF] text-sm" style={{ textAlign: 'justify' }}>Growing demand. Premiums begin rising gradually. Balance between affordable coverage and growing LP returns.</p>
            </div>
            <div className="bg-[#1F2937] border-l-4 border-[#EF4444] rounded-xl p-5">
              <h4 className="text-[#EF4444] font-semibold mb-2">High Zone (80-95%)</h4>
              <p className="text-[#9CA3AF] text-sm" style={{ textAlign: 'justify' }}>Scarce capital. Premiums surge exponentially. High LP yield attracts new depositors. Discourages new policies until liquidity returns.</p>
            </div>
          </div>

          {/* Self-balancing mechanism explanation */}
          <div className="bg-[#1F2937] border-l-4 border-[#00D4AA] rounded-xl p-6">
            <h4 className="text-white font-semibold mb-3">Self-Balancing Mechanism</h4>
            <div className="text-[#9CA3AF] text-sm leading-relaxed space-y-3" style={{ textAlign: 'justify' }}>
              <p>The Kink Model creates a market that self-balances through capital scarcity:</p>
              <p><strong className="text-white">When insurance demand is high</strong> and vaults have little available liquidity:<br/>
              Premiums rise, making coverage expensive for agents. LP yields increase, rewarding them for higher risk. New LPs are attracted by high returns, injecting more capital. Utilization drops, premiums normalize — the cycle repeats.</p>
              <p><strong className="text-white">When there is abundant liquidity</strong> and low demand:<br/>
              Premiums are low, incentivizing agents to buy coverage. LP yields are lower, which naturally limits excess capital.</p>
              <p>The kink point at 80% marks where acceleration begins. Above 95%, the protocol stops accepting new policies to protect vault solvency.</p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Section 7: Security Stack */}
      <FadeIn className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ textAlign: 'center' }}>Security Stack</h2>
          <div className="space-y-3">
            {securityLayers.map((s, i) => (
              <div key={s.layer} className="bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-6 border-l-4 flex items-start gap-4 transition-all" style={{ borderLeftColor: "#00D4AA" }}>
                <div className="text-[#00D4AA] font-bold text-sm min-w-[100px]">Layer {i + 1}</div>
                <div>
                  <div className="font-semibold text-white text-sm">{s.layer}</div>
                  <div className="text-[#9CA3AF] text-xs mt-1">{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Section 8: Metrics */}
      <FadeIn className="py-16 px-6 bg-[#0D1220]">
        <div className="max-w-5xl mx-auto bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-8 transition-all">
          <h2 className="text-2xl font-bold mb-10 text-center" style={{ textAlign: 'center' }}>Protocol Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            {metrics.map((m) => (
              <div key={m.label}>
                <AnimatedCounter target={m.value} suffix={m.suffix} />
                <div className="text-[#6B7280] text-sm mt-2">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Section 9: Contracts */}
      <FadeIn className="py-16 px-6">
        <div className="max-w-4xl mx-auto bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-8 transition-all">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ textAlign: 'center' }}>Contract Addresses</h2>
          <div className="overflow-x-auto space-y-2">
            {contracts.map((c) => (
              <div key={c.addr} className="bg-[#0A0F1C] rounded-lg px-4 py-3 flex items-center justify-between gap-4 min-w-[480px]">
                <span className="text-sm text-[#9CA3AF] min-w-[140px]">{c.name}</span>
                <a href={`https://basescan.org/address/${c.addr}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00D4AA] hover:text-[#00FFD0] font-mono truncate transition-colors">
                  {c.addr.slice(0, 10)}...{c.addr.slice(-8)}
                </a>
                <span className="text-[10px] bg-[#00D4AA20] text-[#00D4AA] px-2 py-0.5 rounded-full">Verified</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Footer */}
      <footer className="border-t border-[#1F2937] py-12 px-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <a href="/LUMINA-WHITEPAPER-EN.pdf" download className="text-[#00D4AA] hover:text-[#00FFD0] font-medium transition-colors">
            Read the full Technical Whitepaper (PDF) {"\u2192"}
          </a>
          <div className="flex gap-6 text-sm text-[#6B7280]">
            <a href="https://github.com/org-lumina/LUMINA-PROTOCOL" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://lumina-protocol-production.up.railway.app/api/v2/health" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">API</a>
            <a href="/LUMINA-SKILL.txt" className="hover:text-white transition-colors">SKILL File</a>
            <Link href="/whitepaper/es" className="hover:text-white transition-colors">Espanol</Link>
          </div>
          <p className="text-xs text-[#6B7280] mt-4">2026 Lumina Protocol. Base L2. Real USDC. Aave V3.</p>
        </div>
      </footer>
    </div>
  )
}
