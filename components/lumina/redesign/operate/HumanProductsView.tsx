'use client'

import { useState, useMemo } from 'react'
import { useReadContract, useReadContracts } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { coverRouterV2Abi, bondVaultAbi } from '@/lib/abis/operate'
import { SHIELDS, type AssetSymbol } from '@/lib/operate/products'
import { useContracts } from '@/hooks/use-contracts'
import { ShieldCard } from './ShieldCard'

const FILTERS = ['ALL', 'BTC', 'ETH', 'STABLES'] as const
type Filter = (typeof FILTERS)[number]

const QUOTE_COVER = parseUnits('1000', 6) // $1,000 cover for the card preview

export function HumanProductsView() {
  const [filter, setFilter] = useState<Filter>('ALL')
  const { data: liveContracts } = useContracts()
  const coverRouterForLink = liveContracts?.coverRouter

  // Batch reads: per-shield quotePremium($1000) + getProductConfig (paused state).
  // Address resolved at runtime from /health via useContracts().
  const readContractsConfig = useMemo(
    () =>
      liveContracts
        ? SHIELDS.flatMap((s) => [
            {
              address: liveContracts.coverRouter,
              abi: coverRouterV2Abi,
              functionName: 'quotePremium' as const,
              args: [s.productId, QUOTE_COVER] as const,
            },
            {
              address: liveContracts.coverRouter,
              abi: coverRouterV2Abi,
              functionName: 'getProductConfig' as const,
              args: [s.productId] as const,
            },
          ])
        : [],
    [liveContracts],
  )

  const { data: shieldData, isLoading: shieldLoading } = useReadContracts({
    contracts: readContractsConfig,
    query: { enabled: !!liveContracts },
  })

  const { data: globalPaused } = useReadContract({
    address: liveContracts?.coverRouter,
    abi: coverRouterV2Abi,
    functionName: 'isProtocolAutoPaused',
    query: { enabled: !!liveContracts },
  })

  const { data: capacityRaw } = useReadContract({
    address: liveContracts?.bondVault,
    abi: bondVaultAbi,
    functionName: 'availableCapacityUSD',
    query: { enabled: !!liveContracts },
  })

  // BondVault.availableCapacityUSD returns INTEGER DOLLARS (no decimals).
  // See /tmp/lp-s2/src/bonds/BondVault.sol:227 — `return (...) / 1e18`.
  const capacityUsd = capacityRaw
    ? Number(capacityRaw as bigint).toLocaleString('en-US', { maximumFractionDigits: 0 })
    : '—'

  const filtered = useMemo(() => {
    if (filter === 'ALL') return SHIELDS
    if (filter === 'STABLES')
      return SHIELDS.filter((s) => s.asset === 'USDT' || s.asset === 'USDC')
    return SHIELDS.filter((s) => s.asset === (filter as AssetSymbol))
  }, [filter])

  return (
    <div style={{ padding: '28px 32px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 11,
              color: 'var(--rd-text-3)',
              letterSpacing: '0.1em',
              marginBottom: 8,
            }}
          >
            SHIELDS · 6 ACTIVE PRODUCTS · BASE SEPOLIA · CAPACITY ${capacityUsd}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: 36,
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'var(--rd-text)',
              margin: 0,
            }}
          >
            Pick a shield. Pay premium. Get protected.
          </h1>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 6,
            fontSize: 11,
            fontFamily: 'var(--font-jetbrains), monospace',
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 12px',
                borderRadius: 4,
                background: filter === f ? 'var(--rd-accent-dim)' : 'transparent',
                color: filter === f ? 'var(--rd-accent)' : 'var(--rd-text-3)',
                border: `1px solid ${filter === f ? 'var(--rd-accent)' : 'var(--rd-line)'}`,
                cursor: 'pointer',
                letterSpacing: '0.06em',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 14,
        }}
      >
        {filtered.map((shield) => {
          // shieldData is array of 2 entries per shield in source order — find by SHIELDS index.
          const idx = SHIELDS.findIndex((s) => s.slug === shield.slug)
          const quoteResult = shieldData?.[idx * 2]
          const configResult = shieldData?.[idx * 2 + 1]
          const premium1k =
            quoteResult?.status === 'success'
              ? (quoteResult.result as readonly [bigint, bigint])[0]
              : undefined
          const config =
            configResult?.status === 'success'
              ? (configResult.result as { active: boolean })
              : undefined
          return (
            <ShieldCard
              key={shield.slug}
              shield={shield}
              premium1k={premium1k}
              paused={config ? !config.active : undefined}
              globalPaused={globalPaused === true}
            />
          )
        })}
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          background: 'var(--rd-surface)',
          border: '1px solid var(--rd-line)',
          borderRadius: 6,
          fontSize: 12,
          color: 'var(--rd-text-3)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <span style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
          {shieldLoading
            ? 'ⓘ Loading on-chain quotes from CoverRouterV2…'
            : 'ⓘ Premiums shown for $1,000 cover. Real premiums update on-chain on the detail page.'}
        </span>
        <a
          href={coverRouterForLink ? `https://sepolia.basescan.org/address/${coverRouterForLink}` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!coverRouterForLink}
          style={{ color: 'var(--rd-accent)', fontFamily: 'var(--font-jetbrains), monospace' }}
        >
          COVERROUTERV2 ON BASESCAN ↗
        </a>
      </div>
    </div>
  )
}
