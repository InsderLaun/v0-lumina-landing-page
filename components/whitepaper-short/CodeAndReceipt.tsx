// components/whitepaper-short/CodeAndReceipt.tsx
'use client'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useMemo, useRef } from 'react'
import type { CodeToken, ReceiptRow } from './copy.en'

export function CodeBlock({ lines, file }: { lines: CodeToken[]; file: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = useReducedMotion()
  const groups = useMemo(() => {
    const out: CodeToken[][] = []
    let cur: CodeToken[] = []
    lines.forEach(t => {
      if (t.type === 'br') { out.push(cur); cur = [] } else cur.push(t)
    })
    out.push(cur)
    return out
  }, [lines])
  return (
    <div ref={ref} className="wp-code">
      <div className="wp-code__head">
        <div className="wp-code__dots"><span /><span /><span /></div>
        <div className="wp-code__file">{file}</div>
      </div>
      <pre className="wp-code__body">
        {groups.map((tokens, li) => (
          <motion.div
            key={li}
            className="wp-code__line"
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={reduce ? undefined : (inView ? { opacity: 1, x: 0 } : undefined)}
            transition={{ duration: 0.3, delay: li * 0.08 }}
          >
            <span className="wp-code__num">{String(li + 1).padStart(2, '0')}</span>
            <span className="wp-code__tokens">
              {tokens.length === 0 ? '\u00A0' : tokens.map((t, ti) => (
                <span key={ti} className={`wp-tk wp-tk--${t.type}`}>
                  {'text' in t ? t.text : ''}
                </span>
              ))}
            </span>
          </motion.div>
        ))}
      </pre>
    </div>
  )
}

export function Receipt({ rows, title }: { rows: ReceiptRow[]; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = useReducedMotion()
  return (
    <div ref={ref} className="wp-receipt">
      <div className="wp-receipt__head">
        <span className="wp-live-dot wp-live-dot--green" />
        <span className="wp-receipt__title">{title}</span>
      </div>
      <div className="wp-receipt__body">
        {rows.map((r, i) => (
          <motion.div
            key={i}
            className={`wp-receipt__row ${r.highlight ? 'is-hl' : ''}`}
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : (inView ? { opacity: 1 } : undefined)}
            transition={{ duration: 0.25, delay: 0.8 + i * 0.18 }}
          >
            <span className="wp-receipt__k">{r.k}:</span>
            <span className="wp-receipt__v">{r.v}</span>
            {r.note && <span className="wp-receipt__note">← {r.note}</span>}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
