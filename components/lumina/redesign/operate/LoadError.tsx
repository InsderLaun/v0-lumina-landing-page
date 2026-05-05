'use client'

import { AlertTriangle } from 'lucide-react'

export function LoadError({
  message,
  onRetry,
  hint = 'Check your network and try again.',
}: {
  message: string
  onRetry: () => void
  hint?: string
}) {
  return (
    <div
      role="alert"
      style={{
        background: 'var(--rd-surface)',
        border: '1px solid color-mix(in oklab, var(--rd-neg) 33%, transparent)',
        borderRadius: 8,
        padding: '20px 22px',
        margin: '12px 0',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.12)',
          color: 'var(--rd-neg)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <AlertTriangle size={18} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            letterSpacing: '0.08em',
            color: 'var(--rd-neg)',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Failed to load
        </div>
        <div
          style={{
            color: 'var(--rd-text-2)',
            fontSize: 13,
            lineHeight: 1.55,
            marginBottom: 10,
            wordBreak: 'break-word',
          }}
        >
          {hint} {message && <span style={{ color: 'var(--rd-text-3)' }}>({message})</span>}
        </div>
        <button
          type="button"
          onClick={onRetry}
          style={{
            padding: '6px 14px',
            background: 'var(--rd-accent)',
            color: '#00121a',
            border: 0,
            borderRadius: 4,
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    </div>
  )
}
