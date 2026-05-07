// components/whitepaper-short/Section4Lifecycle.tsx
// Lifecycle section: from premium to payout, with worked example.
// Server component (no state, no hooks beyond FadeUp's framer-motion wrapper).
import { FadeUp } from './MotionWrapper'
import type { CopyEN } from './copy.en'

export function Section4Lifecycle({ copy }: { copy: CopyEN['s4'] }) {
  return (
    <section id="s4" className="wp-sec wp-sec--alt" data-screen-label="04 Lifecycle">
      <div className="wp-sec__inner">
        <FadeUp className="wp-eyebrow wp-eyebrow--mono">{copy.eyebrow}</FadeUp>
        <FadeUp delay={100} as="h2" className="wp-h2">
          {copy.h2Pre}<em className="wp-em">{copy.h2Italic}</em>
        </FadeUp>
        <FadeUp delay={250} className="wp-lede">{copy.lede}</FadeUp>

        <div className="wp-life-grid">
          {copy.steps.map((step, i) => (
            <FadeUp key={i} delay={350 + i * 100} className="wp-life-card">
              <div className="wp-life-card__num">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="wp-life-card__title">{step.title}</h3>
              <p className="wp-life-card__body">{step.body}</p>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={1100} className="wp-life-example">
          <div className="wp-life-example__label">{copy.example.label}</div>
          <div className="wp-life-example__body">{copy.example.body}</div>
          <div className="wp-life-example__outcome">
            <span>{copy.example.waitLabel}</span>
            <strong>{copy.example.waitOutcome}</strong>
          </div>
          <div className="wp-life-example__outcome">
            <span>{copy.example.sellLabel}</span>
            <strong>{copy.example.sellOutcome}</strong>
          </div>
        </FadeUp>

        <FadeUp delay={1300} className="wp-life-truth">
          {copy.truth}
        </FadeUp>
      </div>
    </section>
  )
}
