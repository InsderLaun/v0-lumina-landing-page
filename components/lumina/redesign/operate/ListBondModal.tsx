'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { parseUnits, formatUnits, type Hex } from 'viem'
import { claimBondAbi, marketplaceAbi } from '@/lib/abis/operate'
import { useContracts } from '@/hooks/use-contracts'
import { X } from 'lucide-react'

interface Props {
  /** Bond epochId (the ERC-1155 token id). */
  epochId: bigint
  /** Holder's full balance for this epoch, in integer dollars. */
  faceValueBalance: bigint
  /** Maturity timestamp in unix seconds — used for implied-yield calc. */
  maturityTs: bigint
  onClose: () => void
  /** Called after the list tx confirms — parent refreshes its bond list. */
  onListed: () => void
}

type Step = 'idle' | 'approving' | 'approved' | 'listing' | 'success' | 'error'

/**
 * Lists a bond on `LuminaBondMarketplace`.
 *
 *   1. Reads `claimBond.isApprovedForAll(seller, marketplace)`.
 *   2. If false, prompts `setApprovalForAll(marketplace, true)` (one-time per epoch family).
 *   3. Calls `marketplace.list(epochId, amount, priceUSDC)`.
 *
 * `amount` is integer-dollars of face value. `priceUSDC` is in 6-dec USDC base units.
 */
export function ListBondModal({ epochId, faceValueBalance, maturityTs, onClose, onListed }: Props) {
  const { address } = useAccount()
  const { data: contracts } = useContracts()

  // Default: sell entire balance at 75% of face.
  const [amount, setAmount] = useState<bigint>(faceValueBalance)
  const defaultPriceUsdc = (faceValueBalance * 75n) / 100n // 75% of face, in integer dollars
  const [priceWholeUsd, setPriceWholeUsd] = useState<string>(defaultPriceUsdc.toString())

  const [step, setStep] = useState<Step>('idle')
  const [errMsg, setErrMsg] = useState<string | null>(null)

  // ─── Allowance read (setApprovalForAll on the ERC1155) ───
  const { data: isApproved, refetch: refetchApproval } = useReadContract({
    address: contracts?.claimBond,
    abi: claimBondAbi,
    functionName: 'isApprovedForAll',
    args: address && contracts ? [address, contracts.marketplace] : undefined,
    query: { enabled: !!address && !!contracts },
  })

  // ─── Approve (one-time) ───
  const {
    writeContract: approveWrite,
    data: approveTx,
    isPending: approvePending,
    error: approveErr,
  } = useWriteContract()
  const { isLoading: approveConfirming, isSuccess: approveConfirmed } =
    useWaitForTransactionReceipt({ hash: approveTx })

  useEffect(() => {
    if (approveConfirmed) {
      setStep('approved')
      refetchApproval()
    }
  }, [approveConfirmed, refetchApproval])

  // ─── List ───
  const {
    writeContract: listWrite,
    data: listTx,
    isPending: listPending,
    error: listErr,
  } = useWriteContract()
  const { isLoading: listConfirming, isSuccess: listConfirmed } = useWaitForTransactionReceipt({
    hash: listTx,
  })

  useEffect(() => {
    if (listConfirmed) {
      // [fix BUG-2] Show the success state briefly, refresh the portfolio, then
      // auto-close the modal. Previously it set 'success' + onListed() but never
      // called onClose(), so the modal stayed open until dismissed manually.
      setStep('success')
      onListed() // refresh portfolio (removes the now-listed bond, surfaces the listing)
      const t = setTimeout(() => onClose(), 1500)
      return () => clearTimeout(t)
    }
  }, [listConfirmed, onListed, onClose])

  useEffect(() => {
    if (approveErr) {
      setErrMsg(approveErr.message?.split('\n')[0] ?? 'Approval failed')
      setStep('error')
    }
    if (listErr) {
      setErrMsg(listErr.message?.split('\n')[0] ?? 'List failed')
      setStep('error')
    }
  }, [approveErr, listErr])

  // ─── Derived numbers ───
  const priceUsdcBaseUnits = useMemo(() => {
    if (!priceWholeUsd) return 0n
    try {
      return parseUnits(priceWholeUsd, 6)
    } catch {
      return 0n
    }
  }, [priceWholeUsd])

  const pricePerDollar = useMemo(() => {
    if (amount === 0n) return 0
    // priceWholeUsd / amount — both in whole-dollar units for amount, USDC for price
    const num = Number(priceWholeUsd || '0')
    return num / Number(amount)
  }, [priceWholeUsd, amount])

  const daysToMaturity = useMemo(() => {
    const now = Math.floor(Date.now() / 1000)
    const days = Math.max(1, Math.round((Number(maturityTs) - now) / 86400))
    return days
  }, [maturityTs])

  const impliedYieldPct = useMemo(() => {
    const price = Number(priceWholeUsd || '0')
    const face = Number(amount)
    if (price <= 0 || face <= price) return 0
    return ((face - price) / price) * (365 / daysToMaturity) * 100
  }, [priceWholeUsd, amount, daysToMaturity])

  const remaining = faceValueBalance - amount
  const canSubmit =
    !!address &&
    amount > 0n &&
    amount <= faceValueBalance &&
    priceUsdcBaseUnits > 0n &&
    step !== 'success' &&
    !approvePending &&
    !approveConfirming &&
    !listPending &&
    !listConfirming

  const handleSubmit = () => {
    setErrMsg(null)
    if (!contracts) {
      setErrMsg('Contracts not yet loaded')
      setStep('error')
      return
    }
    if (!isApproved) {
      setStep('approving')
      approveWrite({
        address: contracts.claimBond,
        abi: claimBondAbi,
        functionName: 'setApprovalForAll',
        args: [contracts.marketplace, true],
      })
      return
    }
    setStep('listing')
    listWrite({
      address: contracts.marketplace,
      abi: marketplaceAbi,
      functionName: 'list',
      args: [epochId, amount, priceUsdcBaseUnits],
    })
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
          width: 'min(520px, 92vw)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
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
              List bond #{epochId.toString()}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: 22, fontWeight: 500, margin: 0 }}>
              Sell on the marketplace
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'transparent', border: 0, color: 'var(--rd-text-3)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <Row label="Amount to sell" hint={`balance: $${faceValueBalance.toString()}`}>
          <input
            type="number"
            min={1}
            max={Number(faceValueBalance)}
            value={amount.toString()}
            onChange={(e) => {
              const v = BigInt(Math.max(0, Math.floor(Number(e.target.value) || 0)))
              setAmount(v > faceValueBalance ? faceValueBalance : v)
            }}
            style={inputStyle}
          />
        </Row>

        <Row label="Asking price (USDC)" hint={`default: 75% of $${defaultPriceUsdc.toString()}`}>
          <input
            type="number"
            min={0}
            step="0.01"
            value={priceWholeUsd}
            onChange={(e) => setPriceWholeUsd(e.target.value)}
            style={inputStyle}
          />
        </Row>

        <div
          style={{
            background: 'var(--rd-surface-2)',
            border: '1px solid var(--rd-line)',
            borderRadius: 6,
            padding: 12,
            marginTop: 6,
            marginBottom: 14,
            fontSize: 12,
            color: 'var(--rd-text-2)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px 14px',
          }}
        >
          <span style={{ color: 'var(--rd-text-3)' }}>Price per $1 face</span>
          <span style={{ textAlign: 'right' }}>${pricePerDollar.toFixed(4)}</span>
          <span style={{ color: 'var(--rd-text-3)' }}>Days to maturity</span>
          <span style={{ textAlign: 'right' }}>{daysToMaturity}d</span>
          <span style={{ color: 'var(--rd-text-3)' }}>Implied yield (annualised)</span>
          <span style={{ textAlign: 'right', color: impliedYieldPct > 0 ? 'var(--rd-pos)' : 'var(--rd-text-2)' }}>
            {impliedYieldPct.toFixed(2)}%
          </span>
          <span style={{ color: 'var(--rd-text-3)' }}>Remaining in your wallet</span>
          <span style={{ textAlign: 'right' }}>${remaining.toString()}</span>
        </div>

        <p style={{ fontSize: 12, color: 'var(--rd-text-3)', marginBottom: 14, lineHeight: 1.5 }}>
          Maturity is fixed at issuance. The buyer redeems at the same date — your sale price reflects the time-value
          discount they accept for waiting.
        </p>

        {errMsg && (
          <div
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 6,
              padding: '10px 12px',
              marginBottom: 12,
              fontSize: 12,
              color: 'var(--rd-neg)',
            }}
          >
            ⚠ {errMsg}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: '100%',
            padding: '11px 16px',
            background: canSubmit ? 'var(--rd-accent)' : 'var(--rd-surface-2)',
            color: canSubmit ? '#00121a' : 'var(--rd-text-3)',
            border: 0,
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 13,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
          }}
        >
          {step === 'success'
            ? '✓ Listed'
            : step === 'listing' || listPending || listConfirming
              ? 'Listing…'
              : step === 'approving' || approvePending || approveConfirming
                ? 'Approving marketplace…'
                : isApproved
                  ? `List $${amount.toString()} face for ${priceWholeUsd || '0'} USDC`
                  : 'Approve marketplace + list'}
        </button>

        {listTx && (
          <a
            href={`https://sepolia.basescan.org/tx/${listTx}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: 10,
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 11,
              color: 'var(--rd-accent)',
            }}
          >
            View tx on Basescan ↗
          </a>
        )}
      </div>
    </div>
  )
}

function Row({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 4,
        }}
      >
        <label
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 10,
            letterSpacing: '0.08em',
            color: 'var(--rd-text-3)',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </label>
        {hint && <span style={{ fontSize: 10, color: 'var(--rd-text-4)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  background: 'var(--rd-surface-2)',
  border: '1px solid var(--rd-line)',
  borderRadius: 5,
  color: 'var(--rd-text)',
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: 13,
}

export type { Props as ListBondModalProps }
