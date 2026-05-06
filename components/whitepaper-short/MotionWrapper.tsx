// components/whitepaper-short/MotionWrapper.tsx
'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

export function FadeUp({
  children,
  delay = 0,
  y = 24,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'section' | 'h1' | 'h2' | 'h3' | 'p' | 'li'
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as] as typeof motion.div
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easeOutExpo, delay: delay / 1000 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </Tag>
  )
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOutExpo } },
}
