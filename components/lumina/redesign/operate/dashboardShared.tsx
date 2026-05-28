'use client'

import { useState } from 'react'
import Link from 'next/link'

// Shared bits for the authenticated dashboard views (earnings / activity).

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 32,
        background: 'var(--rd-surface)',
        border: '1px solid var(--rd-line)',
        borderRadius: 8,
        textAlign: 'center',
        color: 'var(--rd-text-2)',
        fontSize: 13,
      }}
    >
      {children}
    </div>
  )
}

export function Mono({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ fontFamily: 'var(--font-jetbrains), monospace', color: color ?? 'var(--rd-text)' }}>
      {children}
    </span>
  )
}

export function fmtUsd(n: number, max = 2): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: max })
}

/** Freshness badge for any endpoint that returns an `indexer` block. */
export function IndexerBadge({ indexer }: { indexer?: { status?: string; lagBlocks?: number } }) {
  if (!indexer?.status) return null
  const lagging = indexer.status !== 'synced'
  return (
    <span
      title={`indexer ${indexer.status}${indexer.lagBlocks != null ? ` · lag ${indexer.lagBlocks} blocks` : ''}`}
      style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: 10,
        padding: '3px 8px',
        borderRadius: 4,
        border: `1px solid ${lagging ? 'var(--rd-warn)' : 'var(--rd-line)'}`,
        color: lagging ? 'var(--rd-warn)' : 'var(--rd-text-3)',
      }}
    >
      {lagging ? `⚠ data may be delayed (lag ${indexer.lagBlocks})` : '● live'}
    </span>
  )
}

/**
 * Gate shown when the page has no API key yet. Lets the user paste an existing
 * key (persisted via useApiKey) or jump to the API Keys page to mint one.
 */
export function ApiKeyGate({ onKey }: { onKey: (k: string) => void }) {
  const [val, setVal] = useState('')
  return (
    <div
      style={{
        padding: 28,
        background: 'var(--rd-surface)',
        border: '1px solid var(--rd-line)',
        borderRadius: 8,
        color: 'var(--rd-text-2)',
        fontSize: 13,
        maxWidth: 560,
      }}
    >
      <div style={{ marginBottom: 12 }}>
        ⓘ This view reads your agent&apos;s private data, so it needs an API key.
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value.trim())}
          placeholder="lk_…"
          style={{
            flex: 1,
            minWidth: 220,
            padding: '8px 10px',
            background: 'var(--rd-surface-2)',
            border: '1px solid var(--rd-line)',
            borderRadius: 6,
            color: 'var(--rd-text)',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 12,
          }}
        />
        <button
          onClick={() => val.startsWith('lk_') && onKey(val)}
          disabled={!val.startsWith('lk_')}
          style={{
            padding: '8px 14px',
            background: val.startsWith('lk_') ? 'var(--rd-accent-dim)' : 'transparent',
            color: val.startsWith('lk_') ? 'var(--rd-accent)' : 'var(--rd-text-3)',
            border: `1px solid ${val.startsWith('lk_') ? 'var(--rd-accent)' : 'var(--rd-line)'}`,
            borderRadius: 6,
            fontSize: 12,
            cursor: val.startsWith('lk_') ? 'pointer' : 'not-allowed',
          }}
        >
          Use key
        </button>
      </div>
      <div style={{ fontSize: 12, color: 'var(--rd-text-3)' }}>
        No key yet?{' '}
        <Link href="/app/agent/api-keys" style={{ color: 'var(--rd-accent)' }}>
          Generate one →
        </Link>
      </div>
    </div>
  )
}
