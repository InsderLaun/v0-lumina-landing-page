"use client"

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react"

type Perspective = "agent" | "lp"

interface PerspectiveContextType {
    perspective: Perspective
    setPerspective: (p: Perspective) => void
}

const PerspectiveContext = createContext<PerspectiveContextType>({
    perspective: "agent",
    setPerspective: () => { },
})

export function usePerspective() {
    return useContext(PerspectiveContext)
}

export function PerspectiveProvider({ children }: { children: ReactNode }) {
    const [perspective, setPerspectiveRaw] = useState<Perspective>("agent")
    const pendingSectionRef = useRef<string | null>(null)

    const setPerspective = useCallback((p: Perspective) => {
        // Detect which data-section the user is currently viewing
        const sections = document.querySelectorAll<HTMLElement>("[data-section]")
        let currentSection: string | null = null

        for (const section of sections) {
            const rect = section.getBoundingClientRect()
            if (rect.top <= 150 && rect.bottom > 150) {
                currentSection = section.getAttribute("data-section")
                break
            }
        }

        // Fallback: closest section to viewport top
        if (!currentSection) {
            let closestDist = Infinity
            for (const section of sections) {
                const rect = section.getBoundingClientRect()
                const dist = Math.abs(rect.top - 100)
                if (dist < closestDist) {
                    closestDist = dist
                    currentSection = section.getAttribute("data-section")
                }
            }
        }

        pendingSectionRef.current = currentSection
        setPerspectiveRaw(p)

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const targetSection = pendingSectionRef.current
                pendingSectionRef.current = null
                if (!targetSection) return

                const targets = document.querySelectorAll<HTMLElement>(
                    `[data-section="${targetSection}"]`
                )
                for (const target of targets) {
                    if (target.offsetHeight > 0) {
                        // scrollIntoView + fixed scrollBy — no drift
                        target.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" })
                        const navbarHeight = document.querySelector("nav")?.offsetHeight ?? 72
                        const tabsHeight = document.getElementById("perspective-tabs")?.offsetHeight ?? 52
                        window.scrollBy({ top: -(navbarHeight + tabsHeight + 16), behavior: "instant" as ScrollBehavior })
                        return
                    }
                }
                // No equivalent section found — don't move scroll
            })
        })
    }, [])

    return (
        <PerspectiveContext.Provider value={{ perspective, setPerspective }}>
            {children}
        </PerspectiveContext.Provider>
    )
}
