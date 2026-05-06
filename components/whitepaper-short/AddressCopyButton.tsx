// components/whitepaper-short/AddressCopyButton.tsx
'use client'
import { useState } from 'react'

export function AddressCopyButton({ addr }: { addr: string }) {
  const [copied, setCopied] = useState(false)
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(addr)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch { /* noop */ }
  }
  return (
    <button type="button" className="wp-addr__copy" onClick={onClick} aria-label="Copy address">
      {copied ? '✓' : '⧉'}
    </button>
  )
}
