// components/whitepaper-short/Section5Tokenomics.tsx
import { FadeUp } from './MotionWrapper'
import { DonutChart } from './DonutChart'
import type { CopyEN } from './copy.en'

export function Section5Tokenomics({ copy, lang }: { copy: CopyEN['s6']; lang: 'en' | 'es' }) {
  return (
    <section id="s6" className="wp-sec" data-screen-label="06 Tokenomics">
      <div className="wp-sec__inner">
        <FadeUp className="wp-eyebrow wp-eyebrow--mono">{copy.eyebrow}</FadeUp>
        <FadeUp delay={100} as="h2" className="wp-h2">
          {copy.h2Pre}<em className="wp-em">{copy.h2Italic}</em>
        </FadeUp>
        <FadeUp delay={250} className="wp-lede">{copy.lede}</FadeUp>
        <div className="wp-tokenomics">
          <FadeUp delay={400} className="wp-tokenomics__left">
            <DonutChart legend={copy.legend.slice()} donut={copy.donut} />
            <ul className="wp-legend">
              {copy.legend.map((l, i) => (
                <li key={i} className="wp-legend__row">
                  <span className="wp-legend__sw" style={{ background: l.color }} />
                  <span className="wp-legend__lbl">{l.label}</span>
                  <span className="wp-legend__val">{l.val}</span>
                  <span className="wp-legend__pct">{l.pct}%</span>
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delay={500} className="wp-tokenomics__right">
            <div className="wp-flow-title">{copy.flowTitle}</div>
            <div className="wp-flow">
              {copy.flow.map((step, i) => (
                <div key={i} className={`wp-flow__step ${i === copy.flow.length - 1 ? 'is-final' : ''}`}>
                  <div className="wp-flow__num">{step.num}</div>
                  <div className="wp-flow__body">
                    <div className="wp-flow__title">{step.title}</div>
                    <div className="wp-flow__meta">{step.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
