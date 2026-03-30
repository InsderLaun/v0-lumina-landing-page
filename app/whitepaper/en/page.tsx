"use client"

import { useRef, useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import Link from "next/link"

const vaultData = [
  { name: "Volatile Short", cooldown: 30, color: "#00D4AA" },
  { name: "Volatile Long", cooldown: 90, color: "#22d3ee" },
  { name: "Stable Short", cooldown: 90, color: "#a78bfa" },
  { name: "Stable Long", cooldown: 365, color: "#818cf8" },
]

const products = [
  { name: "Black Swan Shield", trigger: "ETH/BTC drops >30%", premium: "~0.3%", duration: "7-90 days", color: "#00D4AA" },
  { name: "Depeg Shield", trigger: "Stablecoin < $0.95", premium: "~0.2%", duration: "7-365 days", color: "#22d3ee" },
  { name: "IL Index Cover", trigger: "IL exceeds deductible", premium: "~0.4%", duration: "30-90 days", color: "#a78bfa" },
  { name: "Exploit Shield", trigger: "Protocol exploit + TEE proof", premium: "~0.5%", duration: "30-365 days", color: "#818cf8" },
]

const metrics = [
  { label: "Verified Contracts", value: 13 },
  { label: "Tests Passing", value: 79 },
  { label: "Insurance Products", value: 4 },
  { label: "Isolated Vaults", value: 4 },
  { label: "Timelock Delay", value: 48, suffix: "h" },
  { label: "Multisig", value: 2, suffix: "-of-3" },
]

const contracts = [
  { name: "CoverRouter", addr: "0xd5f8678A0F2149B6342F9014CCe6d743234Ca025" },
  { name: "PolicyManager", addr: "0xCCA07e06762222AA27DEd58482DeD3d9a7d0162a" },
  { name: "LuminaOracle", addr: "0xB52BB8B09Df13dB2D244746688C14A720ceE4C09" },
  { name: "PhalaVerifier", addr: "0x468b9D2E9043c80467B610bC290b698ae23adb9B" },
  { name: "VolatileShort Vault", addr: "0xbd44547581b92805aAECc40EB2809352b9b2880d" },
  { name: "VolatileLong Vault", addr: "0xFee5d6DAdA0A41407e9EA83d4F357DA6214Ff904" },
  { name: "StableShort Vault", addr: "0x429b6d7d6a6d8A62F616598349Ef3C251e2d54fC" },
  { name: "StableLong Vault", addr: "0x1778240E1d69BEBC8c0988BF1948336AA0Ea321c" },
  { name: "BlackSwanShield", addr: "0x54CDc21DEDA49841513a6a4A903dc0A0a9e7844e" },
  { name: "DepegShield", addr: "0x71DBcE71AA36370f7357F6D8E0c8ba96343C8306" },
  { name: "ILIndexCover", addr: "0x4196f2Cc92C5c4141a34f9a28f23236446E3C4E0" },
  { name: "ExploitShield", addr: "0xaE29Fc3e5f0DedC968cE2dA2A2F3ccB98397b38C" },
  { name: "TimelockController", addr: "0xd0De5D53dCA2D96cdE7FAf540BA3f3a44fdB747a" },
]

const securityLayers = [
  { layer: "Smart Contracts", detail: "79 tests, CEI pattern, SafeERC20, ReentrancyGuard, Solidity 0.8.20" },
  { layer: "Oracle", detail: "Multisig 2-of-3, Chainlink TWAP, L2 sequencer uptime check, 1h grace period" },
  { layer: "Governance", detail: "TimelockController (48h delay), Gnosis Safe (2-of-3 multisig)" },
  { layer: "API", detail: "Rate limiting, CORS restrictions, Helmet headers, NonceManager, sanitized errors" },
]

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
    <div className="min-h-screen bg-[#0A0F1C] text-white font-sans">
      {/* Header */}
      <header className="border-b border-[#1F2937] py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold"><span className="text-[#00D4AA]">LUMINA</span> <span className="text-[#6B7280]">PROTOCOL</span></Link>
          <Link href="/whitepaper/es" className="text-[#9CA3AF] hover:text-[#00D4AA] text-sm transition-colors">ES</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Executive Summary</h1>
        <div className="w-20 h-1 bg-[#00D4AA] mx-auto mb-6" />
        <p className="text-[#9CA3AF] max-w-xl mx-auto">Parametric insurance built exclusively for AI agents on Base L2. Real USDC. Real Aave V3 yield. No claims process.</p>
      </section>

      {/* Section 1: What is Lumina */}
      <FadeIn className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">What is Lumina?</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-[#9CA3AF] flex-1">Lumina Protocol is parametric insurance for AI agents. Agents buy coverage via API, oracles verify triggers using Chainlink data, and payouts are instant. No human judges, no disputes, no waiting. Settlement in USDC on Base L2.</p>
            <div className="flex items-center gap-3 text-sm flex-1 justify-center">
              {["Agent", "API", "Contract", "Oracle", "Payout"].map((node, i) => (
                <div key={node} className="flex items-center gap-2">
                  <div className="bg-[#1F2937] border border-[#00D4AA40] rounded-lg px-3 py-2 text-[#00D4AA] text-xs font-medium">{node}</div>
                  {i < 4 && <span className="text-[#00D4AA]">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Section 2: Products */}
      <FadeIn className="py-16 px-6 bg-[#0D1220]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Four Products</h2>
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

      {/* Section 3: Vault Architecture */}
      <FadeIn className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Vault Architecture</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vaultData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#9CA3AF", fontSize: 12 }} width={120} axisLine={false} />
              <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid #00D4AA40", borderRadius: 8, color: "#fff" }} formatter={(v: number) => `${v} days cooldown`} />
              <Bar dataKey="cooldown" radius={[0, 6, 6, 0]}>
                {vaultData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </FadeIn>

      {/* Section 4: How Money Flows */}
      <FadeIn className="py-16 px-6 bg-[#0D1220]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">How Money Flows</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-[#1F2937] rounded-xl p-6 border-l-4 border-[#00D4AA]">
              <div className="text-[#00D4AA] font-bold text-lg mb-2">Premium In</div>
              <div className="text-[#9CA3AF] text-sm">97% → Vault<br />3% → Protocol Fee</div>
            </div>
            <div className="bg-[#1F2937] rounded-xl p-6 border-l-4 border-[#22d3ee]">
              <div className="text-[#22d3ee] font-bold text-lg mb-2">Vault Capital</div>
              <div className="text-[#9CA3AF] text-sm">Idle → Aave V3 yield<br />Locked → Active policies</div>
            </div>
            <div className="bg-[#1F2937] rounded-xl p-6 border-l-4 border-[#a78bfa]">
              <div className="text-[#a78bfa] font-bold text-lg mb-2">Claim Out</div>
              <div className="text-[#9CA3AF] text-sm">Oracle verifies trigger<br />Payout → Agent wallet</div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Section 5: Security Stack */}
      <FadeIn className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Security Stack</h2>
          <div className="space-y-3">
            {securityLayers.map((s, i) => (
              <div key={s.layer} className="bg-[#1F2937] rounded-xl p-5 border-l-4 border-[#00D4AA] flex items-start gap-4">
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

      {/* Section 6: Metrics */}
      <FadeIn className="py-16 px-6 bg-[#0D1220]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center">Protocol Metrics</h2>
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

      {/* Section 7: Contracts */}
      <FadeIn className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Contract Addresses</h2>
          <div className="space-y-2">
            {contracts.map((c) => (
              <div key={c.addr} className="bg-[#1F2937] rounded-lg px-4 py-3 flex items-center justify-between gap-4">
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
            Read the full Technical Whitepaper (PDF) →
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
