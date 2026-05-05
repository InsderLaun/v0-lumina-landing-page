'use client'

import { useState, type ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'

export type CodeLanguage = 'bash' | 'typescript' | 'python' | 'solidity'

export interface CodeSample {
  label: string
  language: CodeLanguage
  code: string
}

export interface ContractRef {
  contract: string
  line: string
  url: string
}

export interface ApiRef {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  file: string
  url: string
}

export interface FrontendRef {
  label: string
  path: string
  url: string
}

export interface TutorialStepProps {
  number: number
  id: string
  title: string
  description: ReactNode
  audience: 'human' | 'agent'
  /** Single code block (legacy / simple case). */
  code?: string
  codeLanguage?: CodeLanguage
  /** Multiple labelled tabs (preferred for agent flow: bash / TS / Python). */
  samples?: CodeSample[]
  /** Shown only when audience === 'agent'. */
  humanRequired?: ReactNode
  contractRef?: ContractRef
  apiRef?: ApiRef
  frontendRef?: FrontendRef
}

export function TutorialStep(props: TutorialStepProps) {
  const {
    number,
    id,
    title,
    description,
    audience,
    code,
    codeLanguage,
    samples,
    humanRequired,
    contractRef,
    apiRef,
    frontendRef,
  } = props

  const tabs: CodeSample[] =
    samples && samples.length > 0
      ? samples
      : code
        ? [{ label: codeLanguage ?? 'bash', language: codeLanguage ?? 'bash', code }]
        : []

  const [tabIdx, setTabIdx] = useState(0)
  const active = tabs[tabIdx]

  return (
    <article id={id} className="rd-tut-step">
      <div className="rd-tut-step-head">
        <span className="rd-tut-step-num">
          {String(number).padStart(2, '0')}
        </span>
        <div>
          <div className="rd-tut-step-eyebrow">
            STEP {number} · {audience.toUpperCase()}
          </div>
          <h2 className="rd-tut-step-title">{title}</h2>
        </div>
      </div>

      <div className="rd-tut-step-body">{description}</div>

      {audience === 'agent' && humanRequired && (
        <div className="rd-tut-step-callout">
          <span className="rd-tut-step-callout-icon" aria-hidden>
            👤
          </span>
          <div>
            <div className="rd-tut-step-callout-title">Human action required</div>
            <div className="rd-tut-step-callout-body">{humanRequired}</div>
          </div>
        </div>
      )}

      {tabs.length > 0 && (
        <div className="rd-tut-step-code">
          {tabs.length > 1 && (
            <div className="rd-tut-step-code-tabs" role="tablist">
              {tabs.map((t, i) => (
                <button
                  key={t.label + i}
                  role="tab"
                  aria-selected={i === tabIdx}
                  className={
                    i === tabIdx ? 'rd-tut-step-code-tab is-active' : 'rd-tut-step-code-tab'
                  }
                  onClick={() => setTabIdx(i)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
          <pre className="rd-tut-step-code-pre" data-lang={active.language}>
            <code>{active.code.trim()}</code>
          </pre>
        </div>
      )}

      {(contractRef || apiRef || frontendRef) && (
        <div className="rd-tut-step-refs">
          {contractRef && (
            <a
              href={contractRef.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rd-tut-step-ref"
            >
              <span className="rd-tut-step-ref-label">CONTRACT</span>
              <span className="rd-tut-step-ref-target">
                {contractRef.contract}:{contractRef.line}
              </span>
              <ExternalLink size={11} />
            </a>
          )}
          {apiRef && (
            <a
              href={apiRef.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rd-tut-step-ref"
            >
              <span className="rd-tut-step-ref-label">API</span>
              <span className="rd-tut-step-ref-target">
                {apiRef.method} {apiRef.path}
              </span>
              <ExternalLink size={11} />
            </a>
          )}
          {frontendRef && (
            <a
              href={frontendRef.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rd-tut-step-ref"
            >
              <span className="rd-tut-step-ref-label">UI</span>
              <span className="rd-tut-step-ref-target">{frontendRef.label}</span>
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      )}
    </article>
  )
}
