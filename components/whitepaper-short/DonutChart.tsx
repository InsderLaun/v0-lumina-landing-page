// components/whitepaper-short/DonutChart.tsx
'use client'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'

type LegendItem = { label: string; val: string; pct: number; color: string }

export function DonutChart({
  legend,
  donut,
}: {
  legend: LegendItem[]
  donut: { center: string; centerSub: string }
}) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = useReducedMotion()
  const [hover, setHover] = useState<number | null>(null)
  const segments = useMemo(() => {
    let acc = 0
    return legend.map((l) => {
      const start = acc
      acc += l.pct
      return { ...l, start, length: l.pct }
    })
  }, [legend])
  const r = 70
  const C = 2 * Math.PI * r

  return (
    <div className="wp-donut">
      <svg ref={ref} viewBox="0 0 200 200" className="wp-donut__svg">
        <circle cx="100" cy="100" r={r} fill="none" stroke="var(--rd-line)" strokeWidth="22" />
        {segments.map((seg, i) => {
          const dash = (seg.length / 100) * C
          const offset = -((seg.start / 100) * C)
          const isDim = hover != null && hover !== i
          return (
            <motion.circle
              key={i}
              cx="100" cy="100" r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="22"
              strokeDasharray={`${reduce || inView ? dash : 0} ${C}`}
              strokeDashoffset={offset}
              transform="rotate(-90 100 100)"
              animate={{ opacity: isDim ? 0.25 : 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.22 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            />
          )
        })}
      </svg>
      <div className="wp-donut__center">
        <div className="wp-donut__center-num">
          {hover != null ? legend[hover].val : donut.center}
        </div>
        <div className="wp-donut__center-sub">
          {hover != null ? legend[hover].label : donut.centerSub}
        </div>
      </div>
    </div>
  )
}
