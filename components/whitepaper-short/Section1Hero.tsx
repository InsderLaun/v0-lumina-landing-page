// components/whitepaper-short/Section1Hero.tsx
import { FadeUp } from './MotionWrapper'
import { HeroBurnFeed } from './HeroBurnFeed'
import type { CopyEN } from './copy.en'

export function Section1Hero({ copy }: { copy: CopyEN['s1'] }) {
  return (
    <section id="s1" className="wp-sec wp-sec--hero" data-screen-label="01 Hero">
      <div className="wp-grid-bg" aria-hidden />
      <div className="wp-sec__inner wp-hero">
        <FadeUp className="wp-eyebrow wp-eyebrow--mono">{copy.eyebrow}</FadeUp>
        <FadeUp delay={150} as="h1" className="wp-h1">
          {copy.h1Pre}<em className="wp-em">{copy.h1Italic}</em>
        </FadeUp>
        <FadeUp delay={400} className="wp-sub">{copy.sub}</FadeUp>
        <FadeUp delay={600} className="wp-cta-row">
          <a className="wp-btn wp-btn--primary glow-cyan" href="/app">{copy.btnPrimary}</a>
          <a className="wp-btn wp-btn--ghost" href="/whitepaper">{copy.btnGhost}</a>
        </FadeUp>
      </div>
      <div className="wp-hero__feed">
        <HeroBurnFeed label={copy.feedLabel} />
      </div>
    </section>
  )
}
