// components/whitepaper-short/Section6Matrix.tsx
'use client'
import { useState } from 'react'
import { FadeUp } from './MotionWrapper'
import type { CopyEN } from './copy.en'

const COLORS = ['var(--rd-accent)', 'var(--rd-accent-2)', '#f59e0b', '#22d3ee']

function MiniBars({ values }: { values: readonly number[] }) {
  return (
    <div className="wp-mini-bars">
      {values.map((v, i) => (
        <div
          key={i}
          className="wp-mini-bar"
          style={{
            height: `${Math.max(2, (v / 10000) * 100)}%`,
            background: v === 0 ? 'var(--rd-line)' : COLORS[i],
          }}
        />
      ))}
    </div>
  )
}

export function Section6Matrix({ copy }: { copy: CopyEN['s6'] }) {
  const [sel, setSel] = useState({ r: 1, c: 1 })
  const cell = copy.matrix[sel.r][sel.c]
  return (
    <section id="s6" className="wp-sec wp-sec--alt" data-screen-label="06 Adaptive burn">
      <div className="wp-sec__inner">
        <FadeUp className="wp-eyebrow wp-eyebrow--mono">{copy.eyebrow}</FadeUp>
        <FadeUp delay={100} as="h2" className="wp-h2">
          {copy.h2Pre}<em className="wp-em">{copy.h2Italic}</em>
        </FadeUp>
        <FadeUp delay={250} className="wp-lede">{copy.lede}</FadeUp>

        <FadeUp delay={400} className="wp-matrix-wrap">
          <div className="wp-matrix">
            <div className="wp-matrix__corner">
              <span className="wp-matrix__corner-x">SOLVENCY</span>
              <span className="wp-matrix__corner-y">MOMENTUM →</span>
            </div>
            {copy.colLabels.map((cl, i) => (
              <div key={i} className="wp-matrix__col-label">{cl}</div>
            ))}
            {copy.matrix.map((row, ri) => (
              <RowFragment key={ri}
                ri={ri}
                rowLabel={copy.rowLabels[ri]}
                row={row}
                sel={sel}
                onSel={setSel}
                defaultLabel={copy.defaultLabel}
              />
            ))}
          </div>
          <div className="wp-matrix-hint">{copy.selectionHint}</div>
        </FadeUp>

        <FadeUp delay={500} className="wp-matrix-detail">
          <div className="wp-matrix-detail__head">
            <span className="wp-matrix-detail__crumb">{copy.rowLabels[sel.r]}</span>
            <span className="wp-matrix-detail__sep">×</span>
            <span className="wp-matrix-detail__crumb">{copy.colLabels[sel.c]}</span>
          </div>
          <div className="wp-matrix-detail__bars">
            {cell.map((v, i) => (
              <div key={i} className="wp-matrix-detail__channel">
                <div className="wp-matrix-detail__lbl">{copy.barLabels[i]}</div>
                <div className="wp-matrix-detail__bar">
                  <div
                    className="wp-matrix-detail__fill"
                    style={{ width: `${(v / 10000) * 100}%`, background: COLORS[i] }}
                  />
                </div>
                <div className="wp-matrix-detail__val">{v}</div>
                <div className="wp-matrix-detail__pct">{((v / 10000) * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={650} className="wp-callout">
          <div className="wp-callout__title">{copy.callout.title}</div>
          <div className="wp-callout__body">{copy.callout.body}</div>
        </FadeUp>
      </div>
    </section>
  )
}

function RowFragment({
  ri, rowLabel, row, sel, onSel, defaultLabel,
}: {
  ri: number; rowLabel: string;
  row: readonly (readonly number[])[];
  sel: { r: number; c: number };
  onSel: (s: { r: number; c: number }) => void;
  defaultLabel: string;
}) {
  return (
    <>
      <div className="wp-matrix__row-label">{rowLabel}</div>
      {row.map((cellV, ci) => {
        const isDefault = ri === 1 && ci === 1
        const isSel = sel.r === ri && sel.c === ci
        return (
          <button
            key={ci}
            type="button"
            className={`wp-matrix__cell ${isDefault ? 'is-default' : ''} ${isSel ? 'is-sel' : ''}`}
            onClick={() => onSel({ r: ri, c: ci })}
            style={{ animationDelay: `${(ri * 4 + ci) * 35}ms` }}
          >
            {isDefault && <span className="wp-matrix__default-pill">{defaultLabel}</span>}
            <MiniBars values={cellV} />
            <div className="wp-matrix__nums">
              {cellV.map((v, i) => (
                <span key={i} className={i === 0 ? 'is-burn' : ''}>{v}</span>
              ))}
            </div>
          </button>
        )
      })}
    </>
  )
}
