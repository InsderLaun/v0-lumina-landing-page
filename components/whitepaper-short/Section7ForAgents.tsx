// components/whitepaper-short/Section7ForAgents.tsx
import { FadeUp } from './MotionWrapper'
import { CodeBlock, Receipt } from './CodeAndReceipt'
import type { CopyEN } from './copy.en'

export function Section7ForAgents({ copy }: { copy: CopyEN['s8'] }) {
  return (
    <section id="s8" className="wp-sec" data-screen-label="08 For agents">
      <div className="wp-sec__inner">
        <FadeUp className="wp-eyebrow wp-eyebrow--mono">{copy.eyebrow}</FadeUp>
        <FadeUp delay={100} as="h2" className="wp-h2">
          {copy.h2Pre}<em className="wp-em">{copy.h2Italic}</em>
        </FadeUp>
        <FadeUp delay={250} className="wp-lede">{copy.lede}</FadeUp>
        <div className="wp-ide">
          <FadeUp delay={400} className="wp-ide__left">
            <CodeBlock lines={copy.codeLines.slice()} file={copy.codeFile} />
          </FadeUp>
          <FadeUp delay={500} className="wp-ide__right">
            <Receipt rows={copy.receipt.slice()} title={copy.receiptTitle} />
          </FadeUp>
        </div>
        <FadeUp delay={700} className="wp-pills">
          {copy.pills.map((p, i) => (
            <div key={i} className="wp-pill-bad">
              <span className="wp-pill-bad__x">✕</span>
              <span className="wp-pill-bad__txt">{p}</span>
            </div>
          ))}
        </FadeUp>
      </div>
    </section>
  )
}
