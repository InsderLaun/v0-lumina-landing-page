'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAccount, useChainId, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { erc20Abi, formatUnits, parseUnits } from 'viem'
import { TOKENS } from '@/lib/lumina-config'
import { coverRouterV2Abi } from '@/lib/abis/operate'
import { useContracts } from '@/hooks/use-contracts'
import {
  ASSET_COLORS,
  COVER_MIN_USDC,
  COVER_MAX_USDC,
  type ShieldDescriptor,
} from '@/lib/operate/products'

type Step = 'idle' | 'approving' | 'approved' | 'buying' | 'success' | 'error'

export function ShieldDetailView({ shield }: { shield: ShieldDescriptor }) {
  const [coverUsdc, setCoverUsdc] = useState(5000)
  const [step, setStep] = useState<Step>('idle')
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const wrongChain = isConnected && chainId !== baseSepolia.id
  const { data: contracts } = useContracts()

  const coverWei = parseUnits(coverUsdc.toString(), 6)

  // Live premium quote — refetches when coverUsdc changes
  const { data: quoteResult, isLoading: quoteLoading } = useReadContract({
    address: contracts?.coverRouter,
    abi: coverRouterV2Abi,
    functionName: 'quotePremium',
    args: [shield.productId, coverWei],
    query: { enabled: !!contracts && coverUsdc >= COVER_MIN_USDC && coverUsdc <= COVER_MAX_USDC },
  })

  const premiumWei = quoteResult ? (quoteResult as readonly [bigint, bigint])[0] : 0n
  const payoutWei = quoteResult ? (quoteResult as readonly [bigint, bigint])[1] : 0n
  const premiumLabel = `$${Number(formatUnits(premiumWei, 6)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const payoutLabel = `$${Number(formatUnits(payoutWei, 6)).toLocaleString('en-US', { maximumFractionDigits: 2 })}`

  // Per-product paused check
  const { data: config } = useReadContract({
    address: contracts?.coverRouter,
    abi: coverRouterV2Abi,
    functionName: 'getProductConfig',
    args: [shield.productId],
    query: { enabled: !!contracts },
  })
  const paused = config ? !(config as { active: boolean }).active : false

  // USDC balance + allowance
  const { data: usdcBal } = useReadContract({
    address: TOKENS.USDC.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: TOKENS.USDC.address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address && contracts ? [address, contracts.coverRouter] : undefined,
    query: { enabled: !!address && !!contracts },
  })
  const balanceOk = usdcBal !== undefined && (usdcBal as bigint) >= premiumWei
  const allowanceOk = allowance !== undefined && (allowance as bigint) >= premiumWei

  // Write hooks
  const { writeContract: approveWrite, data: approveTx, isPending: approvePending, error: approveErr, reset: resetApprove } = useWriteContract()
  const { isLoading: approveConfirming, isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveTx })

  const { writeContract: buyWrite, data: buyTx, isPending: buyPending, error: buyErr, reset: resetBuy } = useWriteContract()
  const { isLoading: buyConfirming, isSuccess: buyConfirmed } = useWaitForTransactionReceipt({ hash: buyTx })

  useEffect(() => {
    if (approveConfirmed) {
      setStep('approved')
      refetchAllowance()
    }
  }, [approveConfirmed, refetchAllowance])

  useEffect(() => {
    if (buyConfirmed) setStep('success')
  }, [buyConfirmed])

  useEffect(() => {
    if (approveErr) {
      setErrMsg(parseUserError(approveErr))
      setStep('error')
    }
    if (buyErr) {
      setErrMsg(parseUserError(buyErr))
      setStep('error')
    }
  }, [approveErr, buyErr])

  const handleApprove = () => {
    setErrMsg(null)
    if (!contracts) {
      setErrMsg('Contracts not yet loaded')
      setStep('error')
      return
    }
    setStep('approving')
    approveWrite({
      address: TOKENS.USDC.address,
      abi: erc20Abi,
      functionName: 'approve',
      args: [contracts.coverRouter, premiumWei],
    })
  }

  const handleBuy = () => {
    setErrMsg(null)
    if (!contracts) {
      setErrMsg('Contracts not yet loaded')
      setStep('error')
      return
    }
    setStep('buying')
    buyWrite({
      address: contracts.coverRouter,
      abi: coverRouterV2Abi,
      functionName: 'purchasePolicy',
      args: [shield.productId, coverWei, shield.assetBytes],
    })
  }

  const handleReset = () => {
    setStep('idle')
    setErrMsg(null)
    resetApprove()
    resetBuy()
  }

  const buyDisabled =
    !isConnected ||
    wrongChain ||
    paused ||
    !balanceOk ||
    !allowanceOk ||
    quoteLoading ||
    buyPending ||
    buyConfirming ||
    step === 'success'

  return (
    <div style={{ padding: '24px 32px' }}>
      <Link
        href="/app/human/products"
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
          color: 'var(--rd-text-3)',
          letterSpacing: '0.06em',
          marginBottom: 16,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          textDecoration: 'none',
        }}
      >
        <ArrowLeft size={11} /> /APP/HUMAN/PRODUCTS
      </Link>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: 24,
          marginTop: 12,
        }}
        className="rd-shield-detail-grid"
      >
        {/* LEFT */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: ASSET_COLORS[shield.asset],
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontWeight: 700,
              }}
            >
              {shield.asset.slice(0, 1)}
            </div>
            <Pill color={paused ? 'var(--rd-text-3)' : 'var(--rd-pos)'}>
              {paused ? 'PAUSED' : '● ACTIVE'}
            </Pill>
            <Pill color="var(--rd-text-3)">{shield.address.slice(0, 6)}…{shield.address.slice(-4)}</Pill>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: 42,
              fontWeight: 300,
              letterSpacing: '-0.02em',
              marginBottom: 6,
              color: 'var(--rd-text)',
            }}
          >
            {shield.name}
          </h1>
          <p style={{ color: 'var(--rd-text-2)', fontSize: 15, lineHeight: 1.55, marginBottom: 20 }}>
            {shield.trigger}. If the trigger fires during your policy term, you receive a ClaimBond
            for the full payout amount, redeemable in $LUMINA at maturity.
          </p>

          <Section label="TRIGGER LOGIC · CHAINLINK ORACLE">
            <code
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 12,
                color: 'var(--rd-text)',
                lineHeight: 1.7,
                display: 'block',
                whiteSpace: 'pre-wrap',
              }}
            >
              <span style={{ color: 'var(--rd-text-3)' }}>IF</span> chainlink_{shield.asset.toLowerCase()}_usd · {shield.trigger}{'\n'}
              <span style={{ color: 'var(--rd-text-3)' }}>THEN</span> mint_claimbond(buyer, payout=cover×80%, maturity≈730d){'\n'}
              <span style={{ color: 'var(--rd-text-3)' }}>ELSE</span> burn(premium → LUMINA via TWAPBurner)
            </code>
          </Section>

          <Section label="WHAT HAPPENS NEXT">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { n: '01', t: 'Approve USDC', s: 'Allow CoverRouterV2 to pull premium' },
                { n: '02', t: 'Buy policy', s: 'Premium routes to TWAPBurner' },
                { n: '03', t: 'Oracle watches', s: 'Trigger window starts' },
                { n: '04', t: 'Bond or burn', s: 'Trigger → ClaimBond / no → LUMINA burned' },
              ].map((s) => (
                <div
                  key={s.n}
                  style={{
                    flex: '1 1 140px',
                    padding: 10,
                    background: 'var(--rd-surface-2)',
                    border: '1px solid var(--rd-line)',
                    borderRadius: 6,
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 9, color: 'var(--rd-accent)', letterSpacing: '0.1em', marginBottom: 4 }}>
                    STEP {s.n}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4, color: 'var(--rd-text)' }}>{s.t}</div>
                  <div style={{ fontSize: 10, color: 'var(--rd-text-3)', lineHeight: 1.4 }}>{s.s}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* RIGHT — calculator */}
        <aside>
          <div
            style={{
              background: 'var(--rd-surface)',
              border: '1px solid var(--rd-line-strong)',
              borderRadius: 10,
              padding: 22,
              position: 'sticky',
              top: 16,
            }}
          >
            <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 14 }}>
              COVER CALCULATOR · LIVE
            </div>

            <label style={{ fontSize: 11, color: 'var(--rd-text-3)', fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '0.06em' }}>
              COVER AMOUNT (USDC)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, marginBottom: 4 }}>
              <input
                type="number"
                value={coverUsdc}
                onChange={(e) => {
                  const v = Math.max(COVER_MIN_USDC, Math.min(COVER_MAX_USDC, +e.target.value || 0))
                  setCoverUsdc(v)
                }}
                min={COVER_MIN_USDC}
                max={COVER_MAX_USDC}
                style={{
                  flex: 1,
                  background: 'var(--rd-surface-2)',
                  border: '1px solid var(--rd-line-strong)',
                  borderRadius: 6,
                  padding: '10px 12px',
                  color: 'var(--rd-text)',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: 18,
                  outline: 'none',
                }}
              />
              <span style={{ color: 'var(--rd-text-3)', fontSize: 12, fontFamily: 'var(--font-jetbrains), monospace' }}>USDC</span>
            </div>
            <input
              type="range"
              min={COVER_MIN_USDC}
              max={COVER_MAX_USDC}
              step={100}
              value={coverUsdc}
              onChange={(e) => setCoverUsdc(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--rd-accent)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace', color: 'var(--rd-text-4)', marginBottom: 14 }}>
              <span>${COVER_MIN_USDC}</span>
              <span>${COVER_MAX_USDC.toLocaleString('en-US')}</span>
            </div>

            <div style={{ background: 'var(--rd-surface-2)', border: '1px solid var(--rd-line)', borderRadius: 6, padding: 14, marginBottom: 14 }}>
              <Row label="You pay (premium)" value={premiumLabel} accent="var(--rd-warn)" />
              <Row label="If trigger fires" value={payoutLabel} accent="var(--rd-pos)" />
              <Row label="Bond face value" value={`$${coverUsdc.toLocaleString('en-US')}.00 USD`} />
              <Row label="At maturity (~730d)" value="settled in LUMINA at market price" accent="var(--rd-accent)" />
              <Row label="If no trigger" value="Premium burned ◉" muted last />
            </div>

            {paused && (
              <Banner color="var(--rd-warn)">⚠ Shield is paused. New policies disabled.</Banner>
            )}
            {!isConnected && (
              <Banner color="var(--rd-text-3)">ⓘ Connect wallet to buy</Banner>
            )}
            {isConnected && !balanceOk && (
              <Banner color="var(--rd-neg)">⚠ USDC insufficient — need {premiumLabel}, have ${usdcBal !== undefined ? Number(formatUnits(usdcBal as bigint, 6)).toFixed(2) : '?'}</Banner>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <button
                onClick={handleApprove}
                disabled={!isConnected || wrongChain || allowanceOk || approvePending || approveConfirming || step === 'success'}
                style={btnStyle(allowanceOk ? 'done' : 'ghost')}
              >
                {allowanceOk ? '✓ ALLOWANCE OK' : approvePending || approveConfirming ? 'Approving…' : `① Approve USDC · ${premiumLabel}`}
              </button>
              <button onClick={handleBuy} disabled={buyDisabled} style={btnStyle(buyDisabled ? 'disabled' : 'primary')}>
                {buyPending || buyConfirming ? 'Buying…' : step === 'success' ? '✓ Policy purchased' : `② Buy policy →`}
              </button>
            </div>

            {step === 'error' && (
              <Banner color="var(--rd-neg)" style={{ marginTop: 10 }}>
                ⚠ {errMsg || 'Transaction failed'}
                <button onClick={handleReset} style={{ marginLeft: 8, color: 'var(--rd-accent)', background: 'transparent', border: 0, cursor: 'pointer', fontSize: 11 }}>Reset</button>
              </Banner>
            )}
            {step === 'success' && buyTx && (
              <Banner color="var(--rd-pos)" style={{ marginTop: 10 }}>
                ✓ Confirmed.{' '}
                <a href={`https://sepolia.basescan.org/tx/${buyTx}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rd-accent)' }}>
                  View on Basescan ↗
                </a>
                <Link href="/app/human/portfolio" style={{ marginLeft: 8, color: 'var(--rd-accent)' }}>
                  View portfolio →
                </Link>
              </Banner>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 8px',
        borderRadius: 4,
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: 10,
        letterSpacing: '0.06em',
        color,
        background: `color-mix(in oklab, ${color} 10%, transparent)`,
        border: `1px solid color-mix(in oklab, ${color} 33%, transparent)`,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--rd-surface)',
        border: '1px solid var(--rd-line)',
        borderRadius: 8,
        padding: 18,
        marginBottom: 16,
      }}
    >
      <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 12 }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function Row({ label, value, accent, muted, last }: { label: string; value: string; accent?: string; muted?: boolean; last?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '7px 0',
        borderBottom: last ? 'none' : '1px solid var(--rd-line)',
        fontSize: 12,
      }}
    >
      <span style={{ color: 'var(--rd-text-3)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-jetbrains), monospace', color: muted ? 'var(--rd-text-3)' : accent || 'var(--rd-text)', fontWeight: 500 }}>
        {value}
      </span>
    </div>
  )
}

function Banner({ color, children, style }: { color: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        padding: 10,
        background: `color-mix(in oklab, ${color} 8%, transparent)`,
        border: `1px solid color-mix(in oklab, ${color} 33%, transparent)`,
        borderRadius: 4,
        fontSize: 11,
        color,
        fontFamily: 'var(--font-jetbrains), monospace',
        textAlign: 'left',
        letterSpacing: '0.04em',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function btnStyle(variant: 'primary' | 'ghost' | 'done' | 'disabled'): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 18px',
    fontFamily: 'var(--font-inter), sans-serif',
    fontWeight: 500,
    fontSize: 13,
    borderRadius: 6,
    border: '1px solid',
    cursor: variant === 'disabled' ? 'not-allowed' : 'pointer',
    width: '100%',
    transition: 'all .12s',
    opacity: variant === 'disabled' ? 0.4 : 1,
  }
  if (variant === 'primary') return { ...base, background: 'var(--rd-accent)', color: '#001018', borderColor: 'var(--rd-accent)' }
  if (variant === 'ghost') return { ...base, background: 'transparent', color: 'var(--rd-text-2)', borderColor: 'var(--rd-line-strong)' }
  if (variant === 'done') return { ...base, background: 'transparent', color: 'var(--rd-pos)', borderColor: 'color-mix(in oklab, var(--rd-pos) 40%, transparent)' }
  return { ...base, background: 'var(--rd-surface-2)', color: 'var(--rd-text-3)', borderColor: 'var(--rd-line)' }
}

function parseUserError(e: unknown): string {
  if (!e) return 'Unknown error'
  const msg = e instanceof Error ? e.message : String(e)
  if (/user rejected|user denied/i.test(msg)) return 'Transaction rejected by user'
  if (/insufficient funds|exceeds balance/i.test(msg)) return 'Insufficient funds'
  // Try to surface revert reason
  const m = msg.match(/reverted with reason string ['"]([^'"]+)['"]/)
  if (m) return `Reverted: ${m[1]}`
  const m2 = msg.match(/reverted: ([^\n]+)/i)
  if (m2) return `Reverted: ${m2[1]}`
  return msg.slice(0, 200)
}
