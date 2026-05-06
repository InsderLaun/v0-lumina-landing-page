// components/whitepaper-short/Section2Problem.tsx
import { FadeUp } from './MotionWrapper'
import type { CopyEN } from './copy.en'

export function Section2Problem({ copy }: { copy: CopyEN['s2'] }) {
  return (
    <section id="s2" className="wp-sec wp-sec--alt" data-screen-label="02 Problem">
      <div className="wp-sec__inner">
        <FadeUp className="wp-eyebrow wp-eyebrow--mono">{copy.eyebrow}</FadeUp>
        <div className="wp-2col">
          <div className="wp-2col__left">
            <FadeUp delay={100} as="h2" className="wp-h2">
              {copy.h2Pre}<em className="wp-em">{copy.h2Italic}</em>
            </FadeUp>
            <FadeUp delay={250} className="wp-body">{copy.p1}</FadeUp>
            <FadeUp delay={400} className="wp-body">{copy.p2}</FadeUp>
          </div>
          <div className="wp-2col__right">
            {copy.cards.map((card, i) => (
              <FadeUp key={i} delay={300 + i * 120} y={0} className="wp-incident">
                <div className="wp-incident__strip" />
                <div className="wp-incident__row">
                  <span className="wp-incident__ts">{card.ts}</span>
                  <span className="wp-incident__asset">{card.asset}</span>
                </div>
                <div className="wp-incident__line">{card.line}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
