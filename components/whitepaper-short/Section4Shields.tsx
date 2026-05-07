// components/whitepaper-short/Section4Shields.tsx
'use client'
import { useState } from 'react'
import { FadeUp } from './MotionWrapper'
import type { CopyEN } from './copy.en'

export function Section4Shields({ copy }: { copy: CopyEN['s5'] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  return (
    <section id="s5" className="wp-sec wp-sec--alt" data-screen-label="05 Shields">
      <div className="wp-sec__inner">
        <FadeUp className="wp-eyebrow wp-eyebrow--mono">{copy.eyebrow}</FadeUp>
        <FadeUp delay={100} as="h2" className="wp-h2">
          {copy.h2Pre}<em className="wp-em">{copy.h2Italic}</em>
        </FadeUp>
        <FadeUp delay={250} className="wp-lede">{copy.lede}</FadeUp>
        <div className="wp-shield-grid">
          {copy.shields.map((s, i) => (
            <FadeUp key={i} delay={350 + i * 50} className="wp-shield">
              <div
                className="wp-shield__inner"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
              >
                <div className="wp-shield__top">
                  <span className={`wp-shield__glyph wp-shield__glyph--${s.asset.toLowerCase()}`}>{s.glyph}</span>
                  <span className="wp-shield__pill">{s.pill}</span>
                </div>
                <h3 className="wp-shield__title">{s.title}</h3>
                <code className="wp-shield__trigger">{s.trigger}</code>
                <div className={`wp-shield__overlay ${hovered === i ? 'is-show' : ''}`}>
                  <div className="wp-shield__canon">{s.canonical}</div>
                  <div className="wp-shield__lit">bytes32 <span>&quot;{s.literal}&quot;</span></div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
