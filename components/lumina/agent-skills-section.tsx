"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Key, Plug, Rocket, Copy, Check, ArrowRight, ExternalLink } from "lucide-react"
import { usePerspective } from "./perspective-context"
import { GITHUB_URL } from "@/lib/constants"

const FRAMEWORKS = [
    {
        key: "virtuals",
        label: "Virtuals Protocol",
        description: "Lumina is available as an ACP service. Your agent discovers it via the Agent Commerce Protocol marketplace.",
        code: `// Register Lumina as an ACP service
const luminaService = {
  name: "lumina-insurance",
  description: "Parametric DeFi insurance for AI agents",
  endpoint: "https://lumina-protocol-production.up.railway.app",
  capabilities: ["quote", "purchase", "monitor"],
};

await acp.registerService(luminaService);`,
        link: `${GITHUB_URL}/tree/main/docs/INTEGRATION-GUIDES.md`,
        linkLabel: "Full ACP Guide →",
    },
    {
        key: "elizaos",
        label: "ElizaOS",
        description: "Install the Lumina plugin for ElizaOS.",
        code: `// ElizaOS plugin registration
import { luminaPlugin } from "@lumina/eliza-plugin";

export default {
  name: "my-agent",
  plugins: [luminaPlugin],
  settings: {
    LUMINA_API_KEY: process.env.LUMINA_API_KEY,
    LUMINA_WALLET_KEY: process.env.WALLET_PRIVATE_KEY,
  },
};`,
        link: `${GITHUB_URL}/tree/main/docs/INTEGRATION-GUIDES.md`,
        linkLabel: "Full ElizaOS Guide →",
    },
    {
        key: "langchain",
        label: "LangChain",
        description: "Add Lumina tools to your LangChain agent.",
        code: `from langchain.tools import tool

@tool
def lumina_get_quote(product_id: str, coverage: int, duration: int):
    """Get an insurance quote from Lumina Protocol"""
    response = requests.post(
        f"{LUMINA_API}/api/v1/quote",
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={"productId": product_id, "coverageAmount": coverage,
              "durationDays": duration}
    )
    return response.json()`,
        link: `${GITHUB_URL}/tree/main/docs/INTEGRATION-GUIDES.md`,
        linkLabel: "Full LangChain Guide →",
    },
    {
        key: "http",
        label: "HTTP Direct",
        description: "Any agent that makes HTTP requests can use Lumina.",
        code: `# 1. Get available products
curl GET /api/v1/products

# 2. Get a quote
curl -X POST /api/v1/quote \\
  -H "Authorization: Bearer lum_YOUR_KEY" \\
  -d '{"productId":"BCS-001","coverageAmount":10000}'

# 3. Approve USDC on-chain (ERC-20 approve)
# 4. Create pool on-chain (MutualLumina.createPool)

# 5. Confirm purchase
curl -X POST /api/v1/purchase \\
  -d '{"quoteId":"QT-abc123","txHash":"0x..."}'`,
        link: `${GITHUB_URL}/tree/main/docs/API-REFERENCE.md`,
        linkLabel: "Full API Reference →",
    },
]

const SKILLS_TABLE = [
    { capability: "HTTP requests (GET, POST)", why: "Interact with Lumina API" },
    { capability: "EVM wallet with private key", why: "Sign transactions on Base L2" },
    { capability: "ERC-20 approve()", why: "Approve USDC for premium payment" },
    { capability: "JSON parsing", why: "Read quotes, products, policy data" },
    { capability: "Decision-making", why: "Evaluate if premium is worth the coverage" },
]

interface AgentSkillsProps {
    onRegisterAgent: () => void
}

export function AgentSkillsSection({ onRegisterAgent }: AgentSkillsProps) {
    const ref = useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const { perspective } = usePerspective()
    const [activeFramework, setActiveFramework] = useState("virtuals")
    const [copiedCode, setCopiedCode] = useState(false)

    const hidden = perspective !== "agent"

    const framework = FRAMEWORKS.find((f) => f.key === activeFramework)!

    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(framework.code)
        setCopiedCode(true)
        setTimeout(() => setCopiedCode(false), 2000)
    }

    return (
        <section
            ref={ref}
            id="agent-skills"
            className={`scroll-mt-32 ${hidden ? "h-0 overflow-hidden opacity-0 pointer-events-none" : "py-24"}`}
            aria-hidden={hidden}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Connect Your Agent to{" "}
                        <span className="text-lumina-cyan">Lumina</span>
                    </h2>
                    <p className="text-lg text-lumina-muted max-w-2xl mx-auto">
                        Three steps. Thirty minutes. Any framework.
                    </p>
                </motion.div>

                {/* 3-Step Flow */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {[
                        {
                            icon: Key,
                            step: "1",
                            title: "Register",
                            desc: "You register your agent once from this website. Set spending limits, allowed products, and max coverage.",
                            highlight: "You receive an API key to give to your agent.",
                            cta: "Register Agent →",
                            onClick: onRegisterAgent,
                        },
                        {
                            icon: Plug,
                            step: "2",
                            title: "Install Skill",
                            desc: "Give your agent the Lumina skill so it knows how to operate. See the framework guides below.",
                            highlight: null,
                            cta: null,
                            onClick: null,
                        },
                        {
                            icon: Rocket,
                            step: "3",
                            title: "Operate",
                            desc: "Your agent quotes, purchases, and monitors policies autonomously.",
                            highlight: "You monitor everything from the dashboard.",
                            cta: null,
                            onClick: null,
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="rounded-xl bg-[#111118] border border-white/5 p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-lumina-cyan/10 flex items-center justify-center">
                                    <item.icon className="w-5 h-5 text-lumina-cyan" />
                                </div>
                                <span className="text-sm font-mono text-lumina-cyan/50">Step {item.step}</span>
                            </div>
                            <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                            <p className="text-base text-lumina-muted leading-relaxed">{item.desc}</p>
                            {item.highlight && (
                                <p className="text-base text-lumina-text/70 mt-2">{item.highlight}</p>
                            )}
                            {item.cta && (
                                <button
                                    onClick={item.onClick ?? undefined}
                                    className="mt-4 inline-flex items-center gap-1 text-base font-medium text-lumina-cyan hover:underline"
                                >
                                    {item.cta} <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Framework tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="rounded-2xl border border-white/5 bg-[#111118] overflow-hidden"
                >
                    {/* Tab buttons */}
                    <div className="flex overflow-x-auto border-b border-white/5">
                        {FRAMEWORKS.map((fw) => (
                            <button
                                key={fw.key}
                                onClick={() => setActiveFramework(fw.key)}
                                className={`px-5 py-3 text-base font-medium whitespace-nowrap transition-colors ${activeFramework === fw.key
                                        ? "text-lumina-cyan border-b-2 border-lumina-cyan bg-lumina-cyan/[0.03]"
                                        : "text-lumina-muted hover:text-lumina-text"
                                    }`}
                            >
                                {fw.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeFramework}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <p className="text-base text-lumina-muted mb-4">{framework.description}</p>

                                {/* Code block */}
                                <div className="relative rounded-xl bg-[#1a1a2e] border border-white/5 overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                        </div>
                                        <button
                                            onClick={handleCopyCode}
                                            className="flex items-center gap-1 text-sm text-lumina-muted hover:text-lumina-text transition"
                                        >
                                            {copiedCode ? (
                                                <><Check className="w-3.5 h-3.5 text-lumina-green" /> Copied!</>
                                            ) : (
                                                <><Copy className="w-3.5 h-3.5" /> Copy</>
                                            )}
                                        </button>
                                    </div>
                                    <pre className="p-4 text-sm font-mono text-lumina-text/80 overflow-x-auto whitespace-pre">
                                        {framework.code}
                                    </pre>
                                </div>

                                {/* Link */}
                                <a
                                    href={framework.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-4 text-base text-lumina-cyan hover:underline"
                                >
                                    {framework.linkLabel} <ExternalLink className="w-4 h-4" />
                                </a>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Skills Reference Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-10 rounded-2xl bg-gradient-to-br from-lumina-cyan/[0.03] to-lumina-purple/[0.03] border border-white/5 p-8"
                >
                    <h4 className="text-xl font-semibold mb-4">Your agent needs these capabilities:</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left text-sm text-lumina-muted uppercase tracking-wider py-2 pr-4">Capability</th>
                                    <th className="text-left text-sm text-lumina-muted uppercase tracking-wider py-2">Why</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SKILLS_TABLE.map((row) => (
                                    <tr key={row.capability} className="border-b border-white/5">
                                        <td className="py-3 pr-4 text-base font-mono text-lumina-text">{row.capability}</td>
                                        <td className="py-3 text-base text-lumina-muted">{row.why}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <a
                        href={`${GITHUB_URL}/tree/main/docs`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-6 text-base font-medium text-lumina-cyan hover:underline"
                    >
                        📖 Complete Skill Documentation on GitHub <ExternalLink className="w-4 h-4" />
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
