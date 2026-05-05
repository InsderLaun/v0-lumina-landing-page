'use client'

import { useState } from 'react'
import { Copy, X } from 'lucide-react'

interface Props {
  bondAddress: `0x${string}`
  bondId: bigint
  onClose: () => void
}

/**
 * Shown when `window.ethereum.request({ method: 'wallet_watchAsset', ...
 * type: 'ERC1155' })` is unavailable or rejected. Most wallets accept
 * ERC-20 / ERC-721 in `wallet_watchAsset` but ERC-1155 is patchy
 * (MetaMask gating it behind a feature flag at the time of writing).
 *
 * Lets the user copy the contract + tokenId so they can add the bond
 * manually under "Import token" / NFT settings in their wallet.
 */
export function AddToWalletFallback({ bondAddress, bondId, onClose }: Props) {
  const [copied, setCopied] = useState<'addr' | 'id' | null>(null)
  const idStr = bondId.toString()

  const copy = async (value: string, key: 'addr' | 'id') => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--rd-surface)',
          border: '1px solid var(--rd-line-strong)',
          borderRadius: 10,
          padding: '24px 28px',
          width: 'min(480px, 92vw)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: 20, fontWeight: 500, margin: 0 }}>
            Import bond manually
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'transparent', border: 0, color: 'var(--rd-text-3)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>
        <p style={{ color: 'var(--rd-text-2)', fontSize: 13, lineHeight: 1.55, marginBottom: 18 }}>
          Your wallet didn&apos;t accept the automatic ERC-1155 import. Add the bond manually under
          your wallet&apos;s &ldquo;Import token&rdquo; / NFT settings using these values:
        </p>

        <Field
          label="Contract address"
          value={bondAddress}
          copied={copied === 'addr'}
          onCopy={() => copy(bondAddress, 'addr')}
        />
        <Field label="Token ID" value={idStr} copied={copied === 'id'} onCopy={() => copy(idStr, 'id')} />
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string
  value: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 10,
          letterSpacing: '0.08em',
          color: 'var(--rd-text-3)',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--rd-surface-2)',
          border: '1px solid var(--rd-line)',
          borderRadius: 6,
          padding: '8px 10px',
          gap: 8,
        }}
      >
        <code
          style={{
            flex: 1,
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 12,
            color: 'var(--rd-text)',
            wordBreak: 'break-all',
          }}
        >
          {value}
        </code>
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Copy ${label.toLowerCase()}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            background: copied ? 'var(--rd-pos)' : 'var(--rd-accent)',
            color: '#00121a',
            border: 0,
            borderRadius: 4,
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 10,
            fontWeight: 600,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            flexShrink: 0,
          }}
        >
          <Copy size={10} /> {copied ? 'copied' : 'copy'}
        </button>
      </div>
    </div>
  )
}
