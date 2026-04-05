"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { CopyButton } from "./copy-button"
import { GITHUB_URL } from "@/lib/constants"

const TABS = [
    {
        title: "Discover Products",
        command:
            "curl https://lumina-protocol-production.up.railway.app/api/v1/products",
        response: `{
  "products": [
    {
      "id": "BLACKSWAN-002",
      "name": "Black Swan Shield",
      "triggerType": "PRICE_DROP_PCT",
      "thresholdOptions": [1000, 1500, 2000, 2500, 3000],
      "sustainedPeriod": 1800,
      "deductibleBps": 500,
      "durationRange": { "min": 7, "max": 90 }
    }
  ],
  "chainlinkFeeds": {
    "ETH": "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70",
    "BTC": "0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F",
    "USDC": "0x7e860098F58bBFC8648a4311b374B1D669a2bc6B"
  },
  "termsVersion": "1.2.0",
  "chain": "Base L2 (8453)"
}`,
    },
    {
        title: "Get a Quote",
        command: `curl -X POST .../api/v1/quote \\
  -H "Authorization: Bearer lum_YOUR_API_KEY" \\
  -d '{
    "productId": "BLACKSWAN-002",
    "coverageAmount": 10000,
    "durationDays": 30,
    "threshold": 2000,
    "asset": "ETH"
  }'`,
        response: `{
  "quoteId": "QT-a1b2c3",
  "premium": 460,
  "maxPayout": 9500,
  "deductible": "5%",
  "trigger": "ETH/USD drops >20% for 30+ min (Chainlink)",
  "termsHash": "0xabc123...",
  "expiresIn": "15 minutes"
}`,
    },
    {
        title: "Purchase Policy",
        command: `curl -X POST .../api/v1/purchase \\
  -H "Authorization: Bearer lum_YOUR_API_KEY" \\
  -d '{
    "quoteId": "QT-a1b2c3",
    "txHash": "0x..."
  }'`,
        response: `{
  "policyId": "POL-001",
  "status": "active",
  "autoResolve": true,
  "monitoring": "AutoResolver + Chainlink ETH/USD",
  "expiresAt": "2026-04-03T00:00:00Z"
}`,
    },
]

const BADGES = [
    "REST API",
    "JSON",
    "No SDK",
    "30 min integration",
]

const COMPATIBLE = [
    "Virtuals Protocol",
    "ElizaOS",
    "NEAR AI",
    "Any HTTP agent",
]

export function DeveloperZone() {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const [activeTab, setActiveTab] = useState(0)

    return (
        <section ref={ref} id="developers" className="py-24 relative scroll-mt-32">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Built for Machines.{" "}
                        <span className="text-lumina-cyan">Readable by Humans.</span>
                    </h2>
                    <p className="text-lg text-lumina-muted max-w-xl mx-auto">
                        REST API. JSON responses. No SDK required. Your agent can be insured
                        in 30 minutes.
                    </p>
                </motion.div>

                {/* Terminal window */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="rounded-xl border border-white/10 bg-[#1a1a2e] overflow-hidden shadow-2xl"
                >
                    {/* Title bar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#141425] border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-xs text-lumina-muted font-mono">
                            lumina-api
                        </span>
                        <div className="w-14" />
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-white/5">
                        {TABS.map((tab, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                className={`px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === i
                                    ? "text-lumina-cyan bg-[#1a1a2e] border-b-2 border-lumina-cyan"
                                    : "text-lumina-muted hover:text-lumina-text bg-[#141425]"
                                    }`}
                            >
                                {tab.title}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
                        {/* Command */}
                        <div className="relative">
                            <div className="absolute right-2 top-2">
                                <CopyButton text={TABS[activeTab].command} />
                            </div>
                            <pre className="text-xs font-mono leading-relaxed text-lumina-text/80 whitespace-pre-wrap">
                                <span className="text-lumina-green">$</span>{" "}
                                {highlightCommand(TABS[activeTab].command)}
                            </pre>
                        </div>

                        {/* Response */}
                        <div className="relative">
                            <div className="absolute right-2 top-2">
                                <CopyButton text={TABS[activeTab].response} />
                            </div>
                            <div className="rounded-lg bg-[#0d0d1a] p-4 border border-white/5">
                                <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap">
                                    {highlightJSON(TABS[activeTab].response)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-8 space-y-4 text-center"
                >
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {BADGES.map((badge) => (
                            <span
                                key={badge}
                                className="text-xs px-3 py-1.5 rounded-full bg-lumina-cyan/5 border border-lumina-cyan/20 text-lumina-cyan font-medium"
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-lumina-muted">
                        <span>Compatible with:</span>
                        {COMPATIBLE.map((c, i) => (
                            <span key={c}>
                                <span className="text-lumina-text/70">{c}</span>
                                {i < COMPATIBLE.length - 1 && <span className="mx-1">•</span>}
                            </span>
                        ))}
                    </div>

                    {/* GitHub doc links */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                        <a
                            href={`${GITHUB_URL}/tree/main/docs/API-REFERENCE.md`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-base text-lumina-cyan hover:underline"
                        >
                            📖 Full API Reference <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <a
                            href={`${GITHUB_URL}/tree/main/docs/INTEGRATION-GUIDES.md`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-base text-lumina-cyan hover:underline"
                        >
                            🔧 Integration Guides <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <a
                            href={`${GITHUB_URL}/tree/main/docs/SKILL-lumina-insurance.md`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-base text-lumina-cyan hover:underline"
                        >
                            🤖 Agent Skill Documentation <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

// Simple syntax highlighting helpers
function highlightCommand(cmd: string) {
    return cmd.split("\n").map((line, i) => {
        const highlighted = line
            .replace(/(curl|POST|GET|-X|-H|-d)/g, (m) => `\x1b[cyan]${m}\x1b[/]`)
        return (
            <span key={i}>
                {line
                    .replace(/(".*?")/g, "___STRING___$1___END___")
                    .split(/(___STRING___|___END___)/)
                    .map((part, j) => {
                        if (part === "___STRING___" || part === "___END___") return null
                        if (part.startsWith('"') && part.endsWith('"'))
                            return <span key={j} className="text-lumina-green">{part}</span>
                        if (part.match(/^(curl|-X|POST|GET|-H|-d)\b/))
                            return <span key={j} className="text-lumina-cyan">{part}</span>
                        return <span key={j}>{part}</span>
                    })}
                {i < cmd.split("\n").length - 1 && "\n"}
            </span>
        )
    })
}

function highlightJSON(json: string) {
    return json.split("\n").map((line, i) => {
        const parts = line.split(/("(?:[^"\\]|\\.)*")/g)
        return (
            <span key={i}>
                {parts.map((part, j) => {
                    if (part.startsWith('"') && part.endsWith('"')) {
                        // Check if next non-whitespace char is ':'
                        const rest = parts.slice(j + 1).join("")
                        const isKey = rest.trimStart().startsWith(":")
                        if (isKey) return <span key={j} className="text-lumina-purple">{part}</span>
                        return <span key={j} className="text-lumina-green">{part}</span>
                    }
                    // Numbers
                    const withNumbers = part.replace(
                        /\b(\d+\.?\d*)\b/g,
                        "___NUM___$1___END___"
                    )
                    return withNumbers.split(/(___NUM___|___END___)/).map((p, k) => {
                        if (p === "___NUM___" || p === "___END___") return null
                        if (/^\d+\.?\d*$/.test(p))
                            return <span key={`${j}-${k}`} className="text-lumina-amber">{p}</span>
                        if (p === "true" || p === "false")
                            return <span key={`${j}-${k}`} className="text-lumina-cyan">{p}</span>
                        return <span key={`${j}-${k}`} className="text-lumina-muted">{p}</span>
                    })
                })}
                {i < json.split("\n").length - 1 && "\n"}
            </span>
        )
    })
}
