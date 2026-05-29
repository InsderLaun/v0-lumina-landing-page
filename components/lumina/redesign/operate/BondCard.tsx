'use client'

import { useEffect, useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Wallet, Tag, Coins } from 'lucide-react'
import { bondVaultAbi } from '@/lib/abis/operate'
import { useContracts } from '@/hooks/use-contracts'
import { ListBondModal } from './ListBondModal'
import { AddToWalletFallback } from './AddToWalletFallback'

interface Props {
  epochId: bigint
  /** Integer-dollar face value of the holder's position in this epoch. */
  faceValue: bigint
  /** Maturity timestamp (unix seconds). 0n if unknown. */
  maturityTs: bigint
  /** Result of `claimBond.isMatured(epochId)`. */
  matured: boolean
  /** Called when redeem confirms — parent refreshes its bond list. */
  onRedeemed: () => void
}

type Status = 'redeemable' | 'outstanding'

/**
 * One bond position (one ERC-1155 epoch the holder has tokens in).
 * Bond #epochId · $face value · status badge · 3 actions:
 *   - Add to MetaMask  (wallet_watchAsset, fallback modal on rejection)
 *   - List on marketplace
 *   - Redeem  (only enabled once `matured`)
 */
export function BondCard({ epochId, faceValue, maturityTs, matured, onRedeemed }: Props) {
  const { data: contracts } = useContracts()
  const [showList, setShowList] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  const [redeemErr, setRedeemErr] = useState<string | null>(null)

  const { writeContract, data: redeemTx, isPending, error: writeErr } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash: redeemTx })

  useEffect(() => {
    if (isSuccess) onRedeemed()
  }, [isSuccess, onRedeemed])

  useEffect(() => {
    if (writeErr) setRedeemErr(writeErr.message?.split('\n')[0] ?? 'Redeem failed')
  }, [writeErr])

  const status: Status = matured ? 'redeemable' : 'outstanding'

  const maturityDate =
    maturityTs > 0n ? new Date(Number(maturityTs) * 1000) : null
  const maturityLabel = maturityDate
    ? maturityDate.toISOString().slice(0, 10)
    : '—'

  const daysToMaturity = maturityDate
    ? Math.max(0, Math.round((maturityDate.getTime() - Date.now()) / 86_400_000))
    : 0

  const handleAddToWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      setShowFallback(true)
      return
    }
    try {
      const result = await (window as any).ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC1155',
          options: {
            address: contracts?.claimBond,
            tokenId: epochId.toString(),
          },
        },
      })
      // Some wallets (older MetaMask, partial 1155 support) silently
      // return false instead of opening a prompt or throwing — treat
      // it the same as "feature unavailable" and offer the manual
      // fallback. `true` means the asset was added.
      if (result !== true) setShowFallback(true)
    } catch (err: unknown) {
      // EIP-1193 4001 = user explicitly rejected. No fallback in that
      // case — they made a clear choice. Any other error (unsupported
      // method, type rejection, internal wallet error) means we fall
      // back to the copy-paste modal so the user can still import.
      const code = (err as { code?: number })?.code
      if (code === 4001) return
      setShowFallback(true)
    }
  }

  const handleRedeem = () => {
    setRedeemErr(null)
    if (!contracts) {
      setRedeemErr('Contracts not yet loaded')
      return
    }
    writeContract({
      address: contracts.bondVault,
      abi: bondVaultAbi,
      functionName: 'redeemBond',
      args: [epochId, faceValue],
    })
  }

  const busy = isPending || confirming

  return (
    <article
      style={{
        background: 'var(--rd-surface)',
        border: '1px solid var(--rd-line)',
        borderRadius: 10,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 10,
              letterSpacing: '0.1em',
              color: 'var(--rd-text-3)',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            Bond #{epochId.toString()}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontWeight: 500,
              fontSize: 28,
              letterSpacing: '-0.015em',
              color: 'var(--rd-text)',
            }}
          >
            ${faceValue.toString()}
            <span style={{ fontSize: 12, color: 'var(--rd-text-3)', marginLeft: 8, fontFamily: 'var(--font-jetbrains), monospace' }}>
              face value
            </span>
          </div>
        </div>
        <StatusBadge status={status} />
      </header>

      <div
        style={{
          background: 'var(--rd-surface-2)',
          border: '1px solid var(--rd-line)',
          borderRadius: 6,
          padding: '10px 12px',
          fontSize: 12,
          color: 'var(--rd-text-2)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '4px 14px',
        }}
      >
        <span style={{ color: 'var(--rd-text-3)' }}>Maturity</span>
        <span style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>{maturityLabel}</span>
        <span style={{ color: 'var(--rd-text-3)' }}>Time remaining</span>
        <span style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
          {matured ? 'matured ✓' : `${daysToMaturity}d`}
        </span>
      </div>

      <p style={{ fontSize: 11, color: 'var(--rd-text-3)', margin: 0, lineHeight: 1.5 }}>
        Maturity is fixed at issuance. Selling on the marketplace transfers your right to redeem at this same date —
        the buyer accepts a discount in exchange for waiting.
      </p>

      {redeemErr && (
        <div
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 5,
            padding: '8px 10px',
            fontSize: 11,
            color: 'var(--rd-neg)',
          }}
        >
          ⚠ {redeemErr}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <ActionButton onClick={handleAddToWallet} icon={<Wallet size={14} />} label="Add to wallet" />
        <ActionButton
          onClick={() => setShowList(true)}
          icon={<Tag size={14} />}
          label="List"
          disabled={faceValue === 0n || matured}
          tooltip={matured ? 'Bond matured — listing window closed' : undefined}
        />
        <ActionButton
          onClick={handleRedeem}
          icon={<Coins size={14} />}
          label={busy ? 'Redeeming…' : isSuccess ? 'Redeemed' : 'Redeem'}
          variant={matured ? 'primary' : 'disabled'}
          disabled={!matured || busy || isSuccess}
          tooltip={
            !matured
              ? maturityDate
                ? `Available ${maturityLabel} (in ${daysToMaturity}d)`
                : 'Available at maturity'
              : undefined
          }
        />
      </div>

      {redeemTx && (
        <a
          href={`https://basescan.org/tx/${redeemTx}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            color: 'var(--rd-accent)',
            textAlign: 'center',
          }}
        >
          View tx ↗
        </a>
      )}

      {showList && (
        <ListBondModal
          epochId={epochId}
          faceValueBalance={faceValue}
          maturityTs={maturityTs}
          onClose={() => setShowList(false)}
          onListed={() => {
            setShowList(false)
            onRedeemed()
          }}
        />
      )}
      {showFallback && contracts && (
        <AddToWalletFallback
          bondAddress={contracts.claimBond}
          bondId={epochId}
          onClose={() => setShowFallback(false)}
        />
      )}
    </article>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const cfg =
    status === 'redeemable'
      ? { color: 'var(--rd-pos)', label: 'Redeemable', bg: 'rgba(0,212,138,0.12)', border: 'rgba(0,212,138,0.4)' }
      : { color: 'var(--rd-accent)', label: 'Outstanding', bg: 'var(--rd-accent-dim)', border: 'var(--rd-accent-border)' }
  return (
    <span
      style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: 10,
        letterSpacing: '0.08em',
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        padding: '3px 8px',
        borderRadius: 4,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {cfg.label}
    </span>
  )
}

function ActionButton({
  onClick,
  icon,
  label,
  disabled,
  tooltip,
  variant = 'ghost',
}: {
  onClick: () => void
  icon: React.ReactNode
  label: string
  disabled?: boolean
  tooltip?: string
  variant?: 'primary' | 'ghost' | 'disabled'
}) {
  const isPrimary = variant === 'primary' && !disabled
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '8px 10px',
        background: isPrimary ? 'var(--rd-accent)' : 'transparent',
        color: disabled ? 'var(--rd-text-4)' : isPrimary ? '#00121a' : 'var(--rd-text-2)',
        border: isPrimary ? '1px solid var(--rd-accent)' : '1px solid var(--rd-line-strong)',
        borderRadius: 5,
        fontFamily: 'inherit',
        fontSize: 11.5,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      {label}
    </button>
  )
}
