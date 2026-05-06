// components/whitepaper-short/Section9CTA.tsx
import { FadeUp } from './MotionWrapper'
import type { CopyEN } from './copy.en'

export function Section9CTA({ copy }: { copy: CopyEN['s9'] }) {
  return (
    <section id="s9" className="wp-sec wp-sec--cta" data-screen-label="09 CTA">
      <div className="wp-sec__inner">
        <FadeUp className="wp-eyebrow wp-eyebrow--mono">{copy.eyebrow}</FadeUp>
        <div className="wp-cta">
          <FadeUp delay={100} as="h2" className="wp-cta__h2">
            {copy.h2Pre}<em className="wp-em">{copy.h2Italic}</em>
          </FadeUp>
          <div className="wp-cta__btns">
            <FadeUp delay={400}>
              <a className="wp-btn wp-btn--primary glow-cyan" href="/app">{copy.btn1}</a>
            </FadeUp>
            <FadeUp delay={300}>
              <a className="wp-btn wp-btn--primary" href="/whitepaper">{copy.btn2}</a>
            </FadeUp>
            <FadeUp delay={200}>
              <a className="wp-btn wp-btn--ghost" href="https://docs.lumina-org.com" target="_blank" rel="noopener noreferrer">{copy.btn3}</a>
            </FadeUp>
          </div>
        </div>
        <FadeUp delay={600} className="wp-tagline">{copy.tagline}</FadeUp>
      </div>
    </section>
  )
}
