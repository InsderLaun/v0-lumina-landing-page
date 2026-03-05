"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

interface AnimatedCounterProps {
    value: number | string
    suffix?: string
    prefix?: string
    duration?: number
    className?: string
    isString?: boolean
}

export function AnimatedCounter({
    value,
    suffix = "",
    prefix = "",
    duration = 2,
    className = "",
    isString = false,
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const [displayValue, setDisplayValue] = useState(isString ? "" : "0")

    useEffect(() => {
        if (!isInView) return

        if (isString || typeof value === "string") {
            setDisplayValue(String(value))
            return
        }

        const numValue = Number(value)
        const startTime = performance.now()
        const durationMs = duration * 1000

        function animate(currentTime: number) {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / durationMs, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
            const current = Math.round(eased * numValue)
            setDisplayValue(String(current))
            if (progress < 1) requestAnimationFrame(animate)
        }

        requestAnimationFrame(animate)
    }, [isInView, value, duration, isString])

    return (
        <span ref={ref} className={className}>
            {prefix}{displayValue}{suffix}
        </span>
    )
}
