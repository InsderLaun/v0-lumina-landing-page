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
  { name: "BTC Catastrophe Shield", trigger: "BTC cae >50%", premium: "~0.3%", duration: "7-30 dias", color: "#00D4AA" },
  { name: "ETH Apocalypse Shield", trigger: "ETH cae >60%", premium: "~0.3%", duration: "7-30 dias", color: "#06b6d4" },
  { name: "Depeg Shield", trigger: "Stablecoin < $0.95", premium: "~0.2%", duration: "7-365 dias", color: "#22d3ee" },
  { name: "IL Index Cover", trigger: "IL supera deducible", premium: "~0.4%", duration: "30-90 dias", color: "#a78bfa" },
  { name: "Exploit Shield", trigger: "Exploit de protocolo + verificacion ECDSA worker Phala", premium: "~0.5%", duration: "30-365 dias", color: "#818cf8" },
]

const pools = [
  { name: "Volatile Short", duration: "37 dias", covers: "BCS + EAS + IL Index", apy: "4-17% APY", color: "#00D4AA" },
  { name: "Volatile Long", duration: "97 dias", covers: "IL largo + BCS/EAS overflow", apy: "4-21% APY", color: "#22d3ee" },
  { name: "Stable Short", duration: "97 dias", covers: "Depeg corto", apy: "3-9% APY", color: "#a78bfa" },
  { name: "Stable Long", duration: "372 dias", covers: "Depeg + Exploit", apy: "3-10% APY", color: "#818cf8" },
]

const metrics = [
  { label: "Contratos Verificados", value: 13 },
  { label: "Tests Pasando", value: 119 },
  { label: "Productos de Seguro", value: 4 },
  { label: "Vaults Aislados", value: 4 },
  { label: "Delay de Timelock", value: 48, suffix: "h" },
  { label: "Multisig", value: 1, suffix: "-of-1" },
]

const contracts = [
  { name: "CoverRouter", addr: "0xd5f8678A0F2149B6342F9014CCe6d743234Ca025" },
  { name: "PolicyManager", addr: "0xCCA07e06762222AA27DEd58482DeD3d9a7d0162a" },
  { name: "LuminaOracleV2", addr: "0x87B576f688bE0E1d7d23A299f55b475658215105" },
  { name: "PhalaVerifier", addr: "0x468b9D2E9043c80467B610bC290b698ae23adb9B" },
  { name: "VolatileShort Vault", addr: "0xbd44547581b92805aAECc40EB2809352b9b2880d" },
  { name: "VolatileLong Vault", addr: "0xFee5d6DAdA0A41407e9EA83d4F357DA6214Ff904" },
  { name: "StableShort Vault", addr: "0x429b6d7d6a6d8A62F616598349Ef3C251e2d54fC" },
  { name: "StableLong Vault", addr: "0x1778240E1d69BEBC8c0988BF1948336AA0Ea321c" },
  { name: "BTC Catastrophe Shield", addr: "0x6E0A46B268e4aD9648CdAbD9A4b2B20B79E5ab21" },
  { name: "ETH Apocalypse Shield", addr: "0x70f1c92EFcFe55e8d460aAa6d626779536b15128" },
  { name: "DepegShield", addr: "0x881f683291122c3A72bdD504F71ddCAf47d9AE0e" },
  { name: "ILIndexCover", addr: "0x01Df7f2953dce5be3afFb72CB9F059f3D3eE9e5a" },
  { name: "ExploitShield", addr: "0x63D340AE7229BB464bC801f225651341ebcD3693" },
  { name: "EmergencyPause", addr: "0xc7ac8c19c3f10f820d7e42f07e6e257bacc22876" },
  { name: "TimelockController", addr: "0xd0De5D53dCA2D96cdE7FAf540BA3f3a44fdB747a" },
]

const securityLayers = [
  { layer: "Smart Contracts", detail: "119 tests, patron CEI, SafeERC20, ReentrancyGuard, Solidity 0.8.20" },
  { layer: "Oracle", detail: "1-of-1 (planned 2-of-3), precio spot Chainlink verificado via EIP-712, chequeo uptime sequencer L2, 1h periodo de gracia" },
  { layer: "Gobernanza", detail: "TimelockController (48h delay), Gnosis Safe 1-of-1 (planned 2-of-3 multisig)" },
  { layer: "API", detail: "Rate limiting, restricciones CORS, Helmet headers, NonceManager, errores sanitizados" },
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

export default function WhitepaperES() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white font-sans">
      {/* Header */}
      <header className="border-b border-[#1F2937] py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="https://www.lumina-org.com" className="text-[#9CA3AF] hover:text-[#00D4AA] text-sm transition-colors">{"\u2190"} Volver a Lumina</Link>
            <Link href="/" className="text-lg font-bold"><span className="text-[#00D4AA]">LUMINA</span> <span className="text-[#6B7280]">PROTOCOL</span></Link>
          </div>
          <Link href="/whitepaper/en" className="text-[#9CA3AF] hover:text-[#00D4AA] text-sm transition-colors">EN</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Resumen Ejecutivo</h1>
        <div className="w-20 h-1 bg-[#00D4AA] mx-auto mb-8" />
        <p className="text-xl md:text-2xl text-[#9CA3AF] max-w-3xl mx-auto leading-relaxed tracking-wide font-light">
          Seguros parametricos construidos exclusivamente para agentes de IA en Base L2
        </p>
        <p className="text-[#6B7280] max-w-2xl mx-auto mt-4 text-base leading-relaxed" style={{ textAlign: "justify" }}>
          USDC real. Yield real de Aave V3. Sin proceso de reclamos. Cobertura instantanea, liquidacion automatica, proteccion verificable on-chain.
        </p>
      </section>

      {/* Section 1: Que es Lumina */}
      <FadeIn className="py-16 px-6">
        <div className="max-w-4xl mx-auto bg-[#111827] border border-[#1F2937] rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Que es Lumina?</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-[#9CA3AF] flex-1 leading-relaxed" style={{ textAlign: "justify" }}>Lumina Protocol es un seguro parametrico para agentes de IA. Los agentes compran cobertura via API, los oraculos verifican triggers usando datos de Chainlink, y los pagos son instantaneos. Sin jueces humanos, sin disputas, sin esperas. Liquidacion en USDC en Base L2.</p>
            <div className="flex items-center gap-3 text-sm flex-1 justify-center">
              {["Agente", "API", "Contrato", "Oraculo", "Pago"].map((node, i) => (
                <div key={node} className="flex items-center gap-2">
                  <div className="bg-[#1F2937] border border-[#00D4AA40] rounded-lg px-3 py-2 text-[#00D4AA] text-xs font-medium">{node}</div>
                  {i < 4 && <span className="text-[#00D4AA]">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Section 1b: Como Invertir en Vaults */}
      <FadeIn className="pb-16 px-6">
        <div className="max-w-4xl mx-auto bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-6 transition-all">
          <h2 className="text-2xl font-bold mb-6 text-center">Como Invertir en Vaults</h2>
          <ul className="text-[#9CA3AF] space-y-3 list-disc list-inside">
            <li>Depositar USDC en uno de los 4 vaults especializados</li>
            <li>Tu USDC se deposita automaticamente en Aave V3, generando 3-5% APY base</li>
            <li>Las primas de seguro de los compradores de polizas fluyen a tu vault, sumando rendimiento</li>
            <li>APY total estimado: 3-21% segun el vault</li>
            <li>Las shares son soulbound (no transferibles) para la estabilidad del vault</li>
            <li>Para retirar: solicitar retiro → esperar periodo de cooldown → completar retiro</li>
          </ul>
        </div>
      </FadeIn>

      {/* Section 2: Tipos de Cobertura */}
      <FadeIn className="py-16 px-6 bg-[#0D1220]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Tipos de Cobertura</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.name} className="bg-[#1F2937] border border-[#2D3748] hover:border-[#00D4AA40] rounded-xl p-6 transition-all group" style={{ borderLeftWidth: 4, borderLeftColor: p.color }}>
                <h3 className="font-semibold mb-2 text-lg" style={{ color: p.color }}>{p.name}</h3>
                <p className="text-[#9CA3AF] text-sm mb-3" style={{ textAlign: "justify" }}>Trigger: {p.trigger}</p>
                <div className="flex gap-4 text-xs text-[#6B7280]">
                  <span>Prima: {p.premium}</span>
                  <span>Duracion: {p.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Section 3: Pools de Liquidez */}
      <FadeIn className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Pools de Liquidez</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pools.map((p) => (
              <div key={p.name} className="bg-[#1F2937] border border-[#2D3748] rounded-xl p-6 transition-all hover:border-[#00D4AA40]" style={{ borderLeftWidth: 4, borderLeftColor: p.color }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg" style={{ color: p.color }}>{p.name}</h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: p.color + "20", color: p.color }}>{p.apy}</span>
                </div>
                <div className="flex gap-4 text-sm text-[#9CA3AF]">
                  <span>Duracion: {p.duration}</span>
                </div>
                <p className="text-[#6B7280] text-xs mt-2">Cobertura: {p.covers}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Section 4: Arquitectura de Vaults */}
      <FadeIn className="py-16 px-6 bg-[#0D1220]">
        <div className="max-w-4xl mx-auto bg-[#111827] border border-[#1F2937] rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Arquitectura de Vaults</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vaultData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" domain={[0, 365]} tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#9CA3AF", fontSize: 12 }} width={120} axisLine={false} />
              <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid #00D4AA40", borderRadius: 8, color: "#ffffff" }} labelStyle={{ color: "#ffffff" }} itemStyle={{ color: "#ffffff" }} formatter={(v: number) => `${v} dias de cooldown`} />
              <Bar dataKey="cooldown" radius={[0, 6, 6, 0]}>
                {vaultData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cooldown Explanation */}
        <div className="max-w-4xl mx-auto mt-6 bg-[#1F2937] border border-[#1F2937] hover:border-[#00D4AA40] rounded-xl p-6 transition-all">
          <h3 className="text-lg font-semibold text-[#22d3ee] mb-3">Que es el Cooldown?</h3>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4">
            El cooldown es un periodo de espera obligatorio entre solicitar un retiro y completarlo. Cuando solicitas un retiro, tus shares se bloquean durante el periodo de cooldown (37 a 372 dias segun el vault). Durante este tiempo, tu capital sigue generando rendimiento. Una vez que el cooldown expira, puedes completar el retiro y recibir tus USDC mas el rendimiento acumulado.
          </p>
          <h3 className="text-lg font-semibold text-[#22d3ee] mb-3">Como retirar:</h3>
          <ol className="text-[#9CA3AF] text-sm space-y-2 list-decimal list-inside">
            <li>Llamar <code className="text-[#00D4AA]">requestWithdrawal(shares)</code> — inicia el timer de cooldown</li>
            <li>Esperar a que expire el periodo de cooldown</li>
            <li>Llamar <code className="text-[#00D4AA]">completeWithdrawal()</code> — recibir USDC + rendimiento (menos 3% performance fee sobre ganancia)</li>
          </ol>
        </div>
      </FadeIn>

      {/* Section 5: Flujo de Fondos */}
      <FadeIn className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Flujo de Fondos</h2>

          {/* Flow A: Compra de Poliza */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-[#00D4AA] mb-4 text-center">Flujo de Compra de Poliza</h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["Agente IA", "Cotizacion", "CoverRouter", "Shield", "Vault (Bloqueo 1:1)", "Prima: 97% Vault / 3% Fee"].map((step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="bg-[#1F2937] border border-[#00D4AA40] rounded-lg px-3 py-2 text-[#00D4AA] text-xs font-medium whitespace-nowrap">{step}</div>
                  {i < arr.length - 1 && <span className="text-[#00D4AA] font-bold">{"\u2192"}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Flow B: Inversion en Vault */}
          <div>
            <h3 className="text-lg font-semibold text-[#22d3ee] mb-4 text-center">Flujo de Inversion en Vault (LP)</h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["Depositar USDC", "Vault", "Rendimiento Aave V3", "Primas Entrantes", "Solicitar Retiro", "Cooldown (37-372d)", "Retirar + Rendimiento"].map((step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="bg-[#1F2937] border border-[#22d3ee40] rounded-lg px-3 py-2 text-[#22d3ee] text-xs font-medium whitespace-nowrap">{step}</div>
                  {i < arr.length - 1 && <span className="text-[#00D4AA] font-bold">{"\u2192"}</span>}
                </div>
              ))}
            </div>
            <p className="text-[#9CA3AF] text-sm mt-4 text-center">Performance fee: 3% solo sobre rendimiento positivo (ganancia sobre el costo de deposito)</p>
          </div>
        </div>
      </FadeIn>

      {/* Section: Modelo de Precios Dinamico (Kink) */}
      <FadeIn className="py-16 px-6 bg-[#0D1220]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center" style={{ textAlign: 'center' }}>Modelo de Precios Dinamico (Kink)</h2>
          <p className="text-[#9CA3AF] text-sm text-center mb-10" style={{ textAlign: 'center' }}>El protocolo ajusta automaticamente el costo de las primas y el rendimiento de los LPs segun la disponibilidad de capital en los vaults.</p>

          {/* Single large chart with dual Y axes */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 mb-8">
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={kinkModelData} margin={{ top: 10, right: 40, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="premiumGradES" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F87171" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="yieldGradES" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00D4AA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="u" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={{ stroke: "#1F2937" }} label={{ value: "Utilizacion del Vault (%)", position: "insideBottom", offset: -10, fill: "#9CA3AF", fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#F87171" }} axisLine={false} label={{ value: "Tasa de Prima", angle: -90, position: "insideLeft", fill: "#F87171", fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#00D4AA" }} axisLine={false} label={{ value: "Rendimiento LP %", angle: 90, position: "insideRight", fill: "#00D4AA", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: 12, color: "#fff" }} labelFormatter={(l) => `Utilizacion: ${l}%`} />
                <ReferenceLine x={80} yAxisId="left" stroke="#F59E0B" strokeDasharray="6 4" strokeWidth={2} label={{ value: "Kink (80%)", position: "top", fill: "#F59E0B", fontSize: 12 }} />
                <ReferenceArea x1={95} x2={100} yAxisId="left" fill="#EF4444" fillOpacity={0.12} label={{ value: "Sin nuevas polizas", position: "insideTop", fill: "#EF4444", fontSize: 10 }} />
                <Area yAxisId="left" type="monotone" dataKey="premium" stroke="#F87171" strokeWidth={2.5} fill="url(#premiumGradES)" name="Tasa de Prima" connectNulls={false} />
                <Area yAxisId="right" type="monotone" dataKey="lpYield" stroke="#00D4AA" strokeWidth={2.5} fill="url(#yieldGradES)" name="Rendimiento LP %" connectNulls={false} />
                <Legend wrapperStyle={{ color: "#9CA3AF", fontSize: 12, paddingTop: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Three zone cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1F2937] border-l-4 border-[#10B981] rounded-xl p-5">
              <h4 className="text-[#10B981] font-semibold mb-2">Zona Baja (0-60%)</h4>
              <p className="text-[#9CA3AF] text-sm" style={{ textAlign: 'justify' }}>Capital abundante. Primas bajas hacen la cobertura accesible para agentes. Rendimiento LP moderado. Condiciones ideales para comprar seguro.</p>
            </div>
            <div className="bg-[#1F2937] border-l-4 border-[#F59E0B] rounded-xl p-5">
              <h4 className="text-[#F59E0B] font-semibold mb-2">Zona de Transicion (60-80%)</h4>
              <p className="text-[#9CA3AF] text-sm" style={{ textAlign: 'justify' }}>Demanda creciente. Las primas comienzan a subir gradualmente. Equilibrio entre cobertura accesible y rendimientos LP crecientes.</p>
            </div>
            <div className="bg-[#1F2937] border-l-4 border-[#EF4444] rounded-xl p-5">
              <h4 className="text-[#EF4444] font-semibold mb-2">Zona Alta (80-95%)</h4>
              <p className="text-[#9CA3AF] text-sm" style={{ textAlign: 'justify' }}>Capital escaso. Las primas se disparan exponencialmente. Alto rendimiento LP atrae nuevos depositantes. Desincentiva nuevas polizas hasta que vuelva la liquidez.</p>
            </div>
          </div>

          {/* Self-balancing mechanism explanation */}
          <div className="bg-[#1F2937] border-l-4 border-[#00D4AA] rounded-xl p-6">
            <h4 className="text-white font-semibold mb-3">Mecanismo de Autoequilibrio</h4>
            <div className="text-[#9CA3AF] text-sm leading-relaxed space-y-3" style={{ textAlign: 'justify' }}>
              <p>El Modelo Kink crea un mercado que se autoequilibra a traves de la escasez de capital:</p>
              <p><strong className="text-white">Cuando la demanda de seguros es alta</strong> y los vaults tienen poca liquidez disponible:<br/>
              Las primas suben, encareciendo la cobertura para los agentes. Los rendimientos LP aumentan, recompensandolos por el mayor riesgo. Nuevos LPs son atraidos por los altos retornos, inyectando mas capital. La utilizacion baja, las primas se normalizan — el ciclo se repite.</p>
              <p><strong className="text-white">Cuando hay liquidez abundante</strong> y baja demanda:<br/>
              Las primas son bajas, incentivando a los agentes a comprar cobertura. Los rendimientos LP son menores, lo que naturalmente limita el exceso de capital.</p>
              <p>El punto kink al 80% marca donde comienza la aceleracion. Por encima del 95%, el protocolo deja de aceptar nuevas polizas para proteger la solvencia del vault.</p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Section 7: Security Stack */}
      <FadeIn className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Capas de Seguridad</h2>
          <div className="space-y-3">
            {securityLayers.map((s, i) => (
              <div key={s.layer} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5 border-l-4 border-l-[#00D4AA] flex items-start gap-4">
                <div className="text-[#00D4AA] font-bold text-sm min-w-[100px]">Capa {i + 1}</div>
                <div>
                  <div className="font-semibold text-white text-sm">{s.layer}</div>
                  <div className="text-[#9CA3AF] text-xs mt-1" style={{ textAlign: "justify" }}>{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Section 8: Metricas */}
      <FadeIn className="py-16 px-6 bg-[#0D1220]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center">Metricas del Protocolo</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            {metrics.map((m) => (
              <div key={m.label} className="bg-[#111827] border border-[#2D3748] rounded-xl p-6">
                <AnimatedCounter target={m.value} suffix={m.suffix} />
                <div className="text-[#6B7280] text-sm mt-2">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Section 9: Contratos */}
      <FadeIn className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Direcciones de Contratos</h2>
          <div className="overflow-x-auto space-y-2">
            {contracts.map((c) => (
              <div key={c.addr} className="bg-[#111827] border border-[#2D3748] rounded-lg px-4 py-3 flex items-center justify-between gap-4 min-w-[480px]">
                <span className="text-sm text-[#9CA3AF] min-w-[140px]">{c.name}</span>
                <a href={`https://basescan.org/address/${c.addr}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00D4AA] hover:text-[#00FFD0] font-mono truncate transition-colors">
                  {c.addr.slice(0, 10)}...{c.addr.slice(-8)}
                </a>
                <span className="text-[10px] bg-[#00D4AA20] text-[#00D4AA] px-2 py-0.5 rounded-full">Verificado</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Footer */}
      <footer className="border-t border-[#1F2937] py-12 px-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <a href="/LUMINA-WHITEPAPER-ES.pdf" download className="text-[#00D4AA] hover:text-[#00FFD0] font-medium transition-colors">
            Leer el Whitepaper Tecnico completo (PDF) →
          </a>
          <div className="flex gap-6 text-sm text-[#6B7280]">
            <a href="https://github.com/org-lumina/LUMINA-PROTOCOL" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://lumina-protocol-production.up.railway.app/api/v2/health" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">API</a>
            <a href="/LUMINA-SKILL.txt" className="hover:text-white transition-colors">SKILL File</a>
            <Link href="/whitepaper/en" className="hover:text-white transition-colors">English</Link>
          </div>
          <p className="text-xs text-[#6B7280] mt-4">2026 Lumina Protocol. Base L2. USDC Real. Aave V3.</p>
        </div>
      </footer>
    </div>
  )
}
