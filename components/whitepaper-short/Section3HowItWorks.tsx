// components/whitepaper-short/Section3HowItWorks.tsx
'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { FadeUp } from './MotionWrapper'
import type { CopyEN } from './copy.en'
import { Fragment, useRef } from 'react'

export function Section3HowItWorks({ copy }: { copy: CopyEN['s3'] }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  return (
    <section ref={ref} id="s3" className="wp-sec" data-screen-label="03 How it works">
      <div className="wp-sec__inner">
        <FadeUp className="wp-eyebrow wp-eyebrow--mono">{copy.eyebrow}</FadeUp>
        <FadeUp delay={100} as="h2" className="wp-h2 wp-h2--center">{copy.h2}</FadeUp>
        <div className="wp-steps">
          {copy.steps.map((s, i) => (
            <Fragment key={i}>
              <FadeUp delay={250 + i * 150} className="wp-step">
                <div className="wp-step__head">
                  <span className="wp-step__glyph">{s.glyph}</span>
                  <span className="wp-step__num">0{i + 1}</span>
                </div>
                <h3 className="wp-step__title">{s.title}</h3>
                <code className="wp-step__call">{s.call}</code>
                <p className="wp-step__body">{s.body}</p>
              </FadeUp>
              {i < copy.steps.length - 1 && (
                <div className="wp-step__arrow" aria-hidden>
                  <motion.svg viewBox="0 0 64 12" preserveAspectRatio="none"
                    initial={reduce ? false : 'hidden'}
                    whileInView={reduce ? undefined : 'shown'}
                    viewport={{ once: true }}
                    variants={{ hidden: {}, shown: {} }}
                  >
                    <motion.line x1="0" y1="6" x2="56" y2="6" stroke="var(--rd-accent)" strokeWidth="1"
                      initial={reduce ? false : { pathLength: 0 }}
                      whileInView={reduce ? undefined : { pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                    />
                    <motion.path d="M56 2 L62 6 L56 10" fill="none" stroke="var(--rd-accent)" strokeWidth="1"
                      initial={reduce ? false : { opacity: 0 }}
                      whileInView={reduce ? undefined : { opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.9 + i * 0.15 }}
                    />
                  </motion.svg>
                </div>
              )}
            </Fragment>
          ))}
        </div>
        <FadeUp delay={1100} className="wp-payoff">
          <div className="wp-claimbond">
            <div className="wp-claimbond__face">$1</div>
            <div className="wp-claimbond__meta">
              <div className="wp-claimbond__name">CLAIMBOND</div>
              <div className="wp-claimbond__sub">ERC-1155 · 730d maturity</div>
            </div>
            <div className="wp-claimbond__corner">{copy.payoff}</div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
