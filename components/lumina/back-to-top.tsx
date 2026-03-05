"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"

export function BackToTop() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 800)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-lumina-cyan/10 border border-lumina-cyan/30 text-lumina-cyan flex items-center justify-center hover:bg-lumina-cyan/20 hover:shadow-glow-cyan transition-all duration-300"
                    aria-label="Back to top"
                >
                    <ArrowUp className="w-4 h-4" />
                </motion.button>
            )}
        </AnimatePresence>
    )
}
