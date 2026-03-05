"use client"

import { Shield } from "lucide-react"
import { GITHUB_URL } from "@/lib/constants"

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
    {
        title: "Protocol",
        links: [
            { label: "Products", href: "#products" },
            { label: "How it Works", href: "#how-it-works" },
            { label: "Security", href: "#security" },
            { label: "Status", href: "#status" },
        ],
    },
    {
        title: "Developers",
        links: [
            { label: "API Docs", href: `${GITHUB_URL}/tree/main/docs/API-REFERENCE.md`, external: true },
            { label: "GitHub", href: GITHUB_URL, external: true },
            { label: "Integration Guides", href: `${GITHUB_URL}/tree/main/docs/INTEGRATION-GUIDES.md`, external: true },
            { label: "Skill Docs", href: `${GITHUB_URL}/tree/main/docs`, external: true },
        ],
    },
    {
        title: "Community",
        links: [
            { label: "Twitter / X", href: "https://twitter.com/LuminaProtocol", external: true },
            { label: "MoltX", href: "#", external: true },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Terms v1.2.0", href: "#" },
            { label: "Privacy", href: "#" },
        ],
    },
]

export function Footer() {
    const scrollTo = (href: string) => {
        if (href.startsWith("#")) {
            const el = document.querySelector(href)
            if (el) el.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <footer className="py-16 border-t border-white/5 bg-[#0a0a0f]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                    {/* Logo col */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-5 h-5 text-lumina-cyan" />
                            <span className="text-sm font-bold text-lumina-text">
                                Lumina <span className="text-lumina-cyan">Protocol</span>
                            </span>
                        </div>
                        <p className="text-xs text-lumina-muted leading-relaxed">
                            The first parametric insurance protocol for autonomous AI agents
                            on Base L2.
                        </p>
                    </div>

                    {/* Link columns */}
                    {COLUMNS.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-lumina-text mb-4">
                                {col.title}
                            </h4>
                            <ul className="space-y-2">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        {link.external ? (
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-lumina-muted hover:text-lumina-cyan transition-colors"
                                            >
                                                {link.label}
                                            </a>
                                        ) : (
                                            <button
                                                onClick={() => scrollTo(link.href)}
                                                className="text-xs text-lumina-muted hover:text-lumina-cyan transition-colors"
                                            >
                                                {link.label}
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-lumina-muted">
                        <span className="px-2 py-1 rounded bg-white/5">Built on Base L2</span>
                        <span>•</span>
                        <span className="px-2 py-1 rounded bg-white/5">Powered by Chainlink</span>
                        <span>•</span>
                        <span className="px-2 py-1 rounded bg-white/5">USDC settlements</span>
                    </div>
                    <p className="text-[10px] text-lumina-muted">
                        © 2026 Lumina Protocol. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
