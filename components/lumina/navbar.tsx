"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Shield, ChevronDown, LogOut, UserPlus, TrendingUp, LayoutDashboard } from "lucide-react"
import { NAV_ITEMS } from "@/lib/constants"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useAccount, useDisconnect } from "wagmi"
import { useUSDCBalance, useChainCheck } from "@/hooks/use-web3"
import { usePerspective } from "./perspective-context"
import { WrongNetworkBanner } from "./tx-status"

interface NavbarProps {
    onRegisterAgent: () => void
    onDepositLP: () => void
}

export function Navbar({ onRegisterAgent, onDepositLP }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const { openConnectModal } = useConnectModal()
    const { display: usdcBalance } = useUSDCBalance()
    const { needsSwitch, handleSwitch } = useChainCheck()
    const { perspective } = usePerspective()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const handleClick = (href: string) => {
        setMobileOpen(false)
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: "smooth" })
    }

    const truncAddr = address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : ""

    return (
        <>
            <motion.nav
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16 lg:h-[72px]">
                    {/* Logo */}
                    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-lumina-cyan group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.6)] transition-all" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-lumina-text">
                            Lumina
                            <span className="text-lumina-cyan"> Protocol</span>
                        </span>
                    </button>

                    {/* Whitepaper button - next to logo */}
                    <button
                        onClick={() => {
                            const event = new CustomEvent('open-whitepaper-modal');
                            window.dispatchEvent(event);
                        }}
                        className="hidden md:inline-flex items-center px-3 py-1 rounded-md text-[13px] font-medium border border-[#00D4AA] text-[#00D4AA] bg-transparent hover:bg-[#00D4AA15] hover:border-[#00FFD0] transition-all duration-150"
                    >
                        Whitepaper
                    </button>

                    {/* Desktop links */}
                    <ul className="hidden md:flex items-center gap-8">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.href}>
                                <button
                                    onClick={() => handleClick(item.href)}
                                    className="text-sm text-lumina-muted hover:text-lumina-cyan transition-colors duration-200"
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Right: Connect Wallet */}
                    <div className="hidden md:flex items-center gap-3">
                        {isConnected ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-lumina-cyan/20 transition-all text-sm"
                                >
                                    <span className="font-mono text-xs text-lumina-text">{truncAddr}</span>
                                    <span className="text-[10px] text-lumina-cyan">{usdcBalance}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-lumina-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                                </button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0d0d14] border border-white/10 shadow-xl overflow-hidden"
                                        >
                                            {perspective === "agent" ? (
                                                <button
                                                    onClick={() => { setDropdownOpen(false); onRegisterAgent() }}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-lumina-text hover:bg-white/5 transition-colors"
                                                >
                                                    <UserPlus className="w-4 h-4 text-lumina-cyan" />
                                                    Register Agent
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => { setDropdownOpen(false); onDepositLP() }}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-lumina-text hover:bg-white/5 transition-colors"
                                                >
                                                    <TrendingUp className="w-4 h-4 text-lumina-purple" />
                                                    Provide Liquidity
                                                </button>
                                            )}
                                            <button
                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-lumina-muted hover:bg-white/5 transition-colors border-t border-white/5 opacity-60 cursor-not-allowed"
                                                disabled
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                                <span className="text-[10px] ml-auto text-lumina-amber">Soon</span>
                                            </button>
                                            <button
                                                onClick={() => { setDropdownOpen(false); disconnect() }}
                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors border-t border-white/5"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Disconnect
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={() => openConnectModal?.()}
                                className="px-5 py-2 text-sm font-semibold rounded-lg bg-lumina-cyan/10 text-lumina-cyan border border-lumina-cyan/20 hover:bg-lumina-cyan/20 hover:shadow-glow-cyan transition-all duration-300"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-lumina-text p-2"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </motion.nav>

            <WrongNetworkBanner show={needsSwitch} onSwitch={handleSwitch} />

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-xl pt-20 md:hidden"
                    >
                        <nav className="flex flex-col items-center gap-6 p-8">
                            {isConnected && (
                                <div className="text-center mb-2">
                                    <p className="font-mono text-xs text-lumina-text">{truncAddr}</p>
                                    <p className="text-sm text-lumina-cyan">{usdcBalance}</p>
                                </div>
                            )}
                            {NAV_ITEMS.map((item, i) => (
                                <motion.button
                                    key={item.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => handleClick(item.href)}
                                    className="text-lg font-medium text-lumina-text hover:text-lumina-cyan transition-colors"
                                >
                                    {item.label}
                                </motion.button>
                            ))}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: NAV_ITEMS.length * 0.1 }}
                                onClick={() => {
                                    setMobileOpen(false);
                                    const event = new CustomEvent('open-whitepaper-modal');
                                    window.dispatchEvent(event);
                                }}
                                className="text-lg font-medium text-[#00D4AA] hover:text-[#00FFD0] transition-colors border border-[#00D4AA] rounded-lg px-6 py-2"
                            >
                                Whitepaper
                            </motion.button>
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                onClick={() => {
                                    setMobileOpen(false)
                                    if (!isConnected) openConnectModal?.()
                                    else perspective === "agent" ? onRegisterAgent() : onDepositLP()
                                }}
                                className="mt-4 px-8 py-3 text-sm font-semibold rounded-lg bg-lumina-cyan/10 text-lumina-cyan border border-lumina-cyan/20"
                            >
                                {isConnected ? (perspective === "agent" ? "Register Agent" : "Provide Liquidity") : "Connect Wallet"}
                            </motion.button>
                            {isConnected && (
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    onClick={() => { setMobileOpen(false); disconnect() }}
                                    className="text-sm text-red-400"
                                >
                                    Disconnect
                                </motion.button>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
