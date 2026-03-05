"use client"

import { useEffect, useState } from "react"
import { motion, useScroll } from "framer-motion"

export function ScrollProgressBar() {
    const { scrollYProgress } = useScroll()

    return (
        <motion.div
            className="fixed top-[64px] lg:top-[72px] left-0 right-0 z-40 h-[2px] origin-left bg-lumina-cyan"
            style={{ scaleX: scrollYProgress }}
        />
    )
}
