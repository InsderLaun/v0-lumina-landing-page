'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  useAccount,
  useChainId,
  usePublicClient,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { erc20Abi, formatUnits, type Hex } from 'viem'
import { CONTRACTS, TOKENS, DEPLOY_BLOCK_SEPOLIA } from '@/lib/lumina-config'
import { marketplaceAbi, claimBondAbi } from '@/lib/abis/operate'
import { getLogsChunked } from '@/lib/getLogsChunked'
import { LoadError } from './LoadError'

type Tab = 'browse' | 'mine'

interface ListingRow {
  listingId: bigint
  seller: Hex
  epochId: bigint
  amount: bigint     // ClaimBond amount (USD-denominated, ERC1155 unit)
  priceUSDC: bigint  // 6-decimal USDC
  faceValue?: bigint // computed = amount (face value of ClaimBond is 1:1 USD)
  maturityTs?: bigint
}

export function MarketplaceView() {
  const [tab, setTab] = useState<Tab>('browse')
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()

  const [activeIds, setActiveIds] = useState<bigint[]>([])
  const [logsErr, setLogsErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [retryToken, setRetryToken] = useState(0)
  const retry = () => setRetryToken((t) => t + 1)

  // ─── Index marketplace events: Listed - Cancelled - Bought = active ───
  useEffect(() => {
    if (!publicClient) return
    let cancelled = false
    setLoading(true)
    setLogsErr(null)

    ;(async () => {
      try {
        const head = await publicClient.getBlockNumber()
        const [listed, cancelledLogs, bought] = await Promise.all([
          getLogsChunked({
            client: publicClient,
            address: CONTRACTS.Marketplace,
            event: {
              type: 'event',
              name: 'Listed',
              inputs: [
                { name: 'listingId', type: 'uint256', indexed: true },
                { name: 'seller', type: 'address', indexed: true },
                { name: 'epochId', type: 'uint256', indexed: true },
                { name: 'amount', type: 'uint256', indexed: false },
                { name: 'priceUSDC', type: 'uint256', indexed: false },
              ],
            },
            fromBlock: DEPLOY_BLOCK_SEPOLIA,
            toBlock: head,
          }),
          getLogsChunked({
            client: publicClient,
            address: CONTRACTS.Marketplace,
            event: {
              type: 'event',
              name: 'Cancelled',
              inputs: [
                { name: 'listingId', type: 'uint256', indexed: true },
                { name: 'seller', type: 'address', indexed: true },
              ],
            },
            fromBlock: DEPLOY_BLOCK_SEPOLIA,
            toBlock: head,
          }),
          getLogsChunked({
            client: publicClient,
            address: CONTRACTS.Marketplace,
            event: {
              type: 'event',
              name: 'Bought',
              inputs: [
                { name: 'listingId', type: 'uint256', indexed: true },
                { name: 'buyer', type: 'address', indexed: true },
                { name: 'seller', type: 'address', indexed: true },
                { name: 'priceUSDC', type: 'uint256', indexed: false },
              ],
            },
            fromBlock: DEPLOY_BLOCK_SEPOLIA,
            toBlock: head,
          }),
        ])
        if (cancelled) return
        const removed = new Set([
          ...(cancelledLogs as any[]).map((l) => (l.args.listingId as bigint).toString()),
          ...(bought as any[]).map((l) => (l.args.listingId as bigint).toString()),
        ])
        const ids = (listed as any[])
          .map((l) => l.args.listingId as bigint)
          .filter((id) => !removed.has(id.toString()))
        setActiveIds(ids)
      } catch (err) {
        console.error('MarketplaceView getLogs error:', err)
        if (cancelled) return
        setLogsErr(err instanceof Error ? err.message.slice(0, 200) : 'Failed to load marketplace events')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [publicClient, retryToken])

  // Read fresh state for each active listing (active flag may have changed)
  const listingReads = useMemo(
    () =>
      activeIds.map((id) => ({
        address: CONTRACTS.Marketplace,
        abi: marketplaceAbi,
        functionName: 'getListing' as const,
        args: [id] as const,
      })),
    [activeIds],
  )
  const { data: listingData } = useReadContracts({
    contracts: listingReads,
    query: { enabled: listingReads.length > 0 },
  })

  const listings: ListingRow[] = useMemo(() => {
    if (!listingData) return []
    return activeIds
      .map((listingId, i) => {
        const r = listingData[i]
        if (r?.status !== 'success') return null
        const [seller, epochId, amount, priceUSDC, active] = r.result as readonly [
          Hex,
          bigint,
          bigint,
          bigint,
          boolean,
        ]
        if (!active) return null
        return { listingId, seller, epochId, amount, priceUSDC, faceValue: amount }
      })
      .filter(Boolean) as ListingRow[]
  }, [listingData, activeIds])

  // Read maturity per epoch (dedup)
  const uniqueEpochs = useMemo(() => Array.from(new Set(listings.map((l) => l.epochId.toString()))).map(BigInt), [listings])
  const epochReads = useMemo(
    () =>
      uniqueEpochs.map((e) => ({
        address: CONTRACTS.ClaimBond,
        abi: claimBondAbi,
        functionName: 'getEpochInfo' as const,
        args: [e] as const,
      })),
    [uniqueEpochs],
  )
  const { data: epochData } = useReadContracts({
    contracts: epochReads,
    query: { enabled: epochReads.length > 0 },
  })
  const maturityByEpoch = useMemo(() => {
    const map: Record<string, bigint> = {}
    if (!epochData) return map
    uniqueEpochs.forEach((e, i) => {
      const r = epochData[i]
      if (r?.status === 'success') {
        // getEpochInfo returns (exists, maturity, totalSupply_, matured)
        const [, maturityTs] = r.result as readonly [boolean, bigint, bigint, boolean]
        map[e.toString()] = maturityTs
      }
    })
    return map
  }, [epochData, uniqueEpochs])

  const listingsWithMaturity = useMemo(
    () => listings.map((l) => ({ ...l, maturityTs: maturityByEpoch[l.epochId.toString()] })),
    [listings, maturityByEpoch],
  )

  const browseList = listingsWithMaturity
  const myList = address
    ? listingsWithMaturity.filter((l) => l.seller.toLowerCase() === address.toLowerCase())
    : []

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-3)', letterSpacing: '0.1em', marginBottom: 6 }}>
          /APP/HUMAN/MARKETPLACE · {browseList.length} ACTIVE LISTINGS
        </div>
        <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--rd-text)', margin: 0 }}>
          Buy bonds at discount. Or sell yours.
        </h1>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--rd-line)', marginBottom: 18 }}>
        {(
          [
            { id: 'browse' as Tab, label: 'Browse', count: browseList.length },
            { id: 'mine' as Tab, label: 'My Listings', count: myList.length },
          ]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${tab === t.id ? 'var(--rd-accent)' : 'transparent'}`,
              color: tab === t.id ? 'var(--rd-accent)' : 'var(--rd-text-3)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {t.label}{' '}
            <span style={{ marginLeft: 6, fontFamily: 'var(--font-jetbrains), monospace', fontSize: 11, color: 'var(--rd-text-4)' }}>{t.count}</span>
          </button>
        ))}
      </div>

      {logsErr && <LoadError message={logsErr} onRetry={retry} />}
      {loading && !logsErr && <Empty>⏳ Indexing marketplace events…</Empty>}
      {!loading && !logsErr && (tab === 'browse' ? browseList : myList).length === 0 && (
        <Empty>
          {tab === 'browse'
            ? 'No active listings.'
            : isConnected
              ? 'You have no active listings.'
              : 'Connect a wallet to see your listings.'}
        </Empty>
      )}

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {(tab === 'browse' ? browseList : myList).map((l) => (
            <ListingCard key={l.listingId.toString()} listing={l} mine={tab === 'mine'} />
          ))}
        </div>
      )}
    </div>
  )
}

function ListingCard({ listing, mine }: { listing: ListingRow; mine: boolean }) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const wrongChain = isConnected && chainId !== baseSepolia.id
  const { writeContract, data: tx, isPending, error: writeErr, reset } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash: tx })

  // For Buy flow: check USDC allowance
  const { data: allowance } = useReadContract({
    address: TOKENS.USDC.address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.Marketplace] : undefined,
    query: { enabled: !!address },
  })

  const handleBuy = async () => {
    reset()
    if (!isConnected) return
    if (allowance === undefined || (allowance as bigint) < listing.priceUSDC) {
      writeContract({
        address: TOKENS.USDC.address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [CONTRACTS.Marketplace, listing.priceUSDC],
      })
      return
    }
    writeContract({
      address: CONTRACTS.Marketplace,
      abi: marketplaceAbi,
      functionName: 'executeBuy',
      args: [listing.listingId],
    })
  }

  const handleCancel = () => {
    reset()
    writeContract({
      address: CONTRACTS.Marketplace,
      abi: marketplaceAbi,
      functionName: 'cancel',
      args: [listing.listingId],
    })
  }

  // ClaimBond is ERC1155 with 1 token = $1; `amount` (alias `faceValue`) is the
  // raw token count = integer dollars. priceUSDC is 6-decimal USDC.
  const face = Number(listing.faceValue ?? 0n)
  const ask = Number(formatUnits(listing.priceUSDC, 6))
  const discount = face > 0 ? Math.round(((face - ask) / face) * 100) : 0
  const daysLeft =
    listing.maturityTs && listing.maturityTs > 0n
      ? Math.max(0, Math.floor((Number(listing.maturityTs) * 1000 - Date.now()) / 86_400_000))
      : null
  const yieldPct = daysLeft && daysLeft > 0 ? Math.round((discount * 365) / daysLeft) : null

  const busy = isPending || confirming
  const needsApproval = !mine && (allowance === undefined || (allowance as bigint) < listing.priceUSDC)

  return (
    <div style={{ background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-jetbrains), monospace', color: 'var(--rd-accent)', fontSize: 13, fontWeight: 600 }}>#{listing.listingId.toString()}</span>
        <span
          style={{
            padding: '3px 8px',
            borderRadius: 4,
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 10,
            color: 'var(--rd-warn)',
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.33)',
            letterSpacing: '0.04em',
          }}
        >
          −{discount}% DISCOUNT
        </span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--rd-text-2)' }}>Epoch #{listing.epochId.toString()}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11, marginBottom: 6 }}>
        <div>
          <div style={{ color: 'var(--rd-text-3)', marginBottom: 2 }}>Face value</div>
          <span style={{ fontFamily: 'var(--font-jetbrains), monospace', color: 'var(--rd-text)', fontSize: 14 }}>${face.toLocaleString('en-US')}</span>
        </div>
        <div>
          <div style={{ color: 'var(--rd-text-3)', marginBottom: 2 }}>Asking</div>
          <span style={{ fontFamily: 'var(--font-jetbrains), monospace', color: 'var(--rd-accent)', fontSize: 14 }}>${ask.toLocaleString('en-US')}</span>
        </div>
        <div>
          <div style={{ color: 'var(--rd-text-3)', marginBottom: 2 }}>Days to maturity</div>
          <span style={{ fontFamily: 'var(--font-jetbrains), monospace', color: 'var(--rd-text-2)' }}>{daysLeft !== null ? `${daysLeft}d` : '—'}</span>
        </div>
        <div>
          <div style={{ color: 'var(--rd-text-3)', marginBottom: 2 }}>Seller</div>
          <span style={{ fontFamily: 'var(--font-jetbrains), monospace', color: 'var(--rd-text-3)', fontSize: 11 }}>
            {listing.seller.slice(0, 6)}…{listing.seller.slice(-4)}
          </span>
        </div>
      </div>

      {yieldPct !== null && (
        <div>
          <div style={{ height: 4, background: 'var(--rd-surface-2)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
            <div style={{ height: '100%', width: `${Math.min(100, discount)}%`, background: 'var(--rd-accent)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace', color: 'var(--rd-text-3)' }}>
            <span>IMPLIED YIELD</span>
            <span style={{ color: 'var(--rd-pos)' }}>+{yieldPct}% / YR</span>
          </div>
        </div>
      )}

      {!mine && listing.maturityTs && listing.maturityTs > 0n && (
        <div
          style={{
            background: 'var(--rd-accent-dim)',
            border: '1px solid var(--rd-accent-border)',
            borderRadius: 5,
            padding: '8px 10px',
            fontSize: 11,
            color: 'var(--rd-text-2)',
            lineHeight: 1.45,
          }}
        >
          ⓘ Bond matures on{' '}
          <strong style={{ color: 'var(--rd-text)', fontFamily: 'var(--font-jetbrains), monospace' }}>
            {new Date(Number(listing.maturityTs) * 1000).toISOString().slice(0, 10)}
          </strong>
          {' '}— you redeem for <strong style={{ color: 'var(--rd-pos)' }}>${face.toLocaleString('en-US')}</strong> at that date. Maturity is fixed at issuance.
        </div>
      )}

      {mine ? (
        <button
          onClick={handleCancel}
          disabled={wrongChain || busy || isSuccess}
          style={{
            padding: '8px 12px',
            background: 'transparent',
            color: 'var(--rd-text-2)',
            border: '1px solid var(--rd-line-strong)',
            borderRadius: 4,
            fontWeight: 500,
            fontSize: 12,
            cursor: busy || isSuccess ? 'default' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          {isSuccess ? '✓ Cancelled' : busy ? 'Cancelling…' : 'Cancel listing'}
        </button>
      ) : (
        <button
          onClick={handleBuy}
          disabled={!isConnected || wrongChain || busy || isSuccess}
          style={{
            padding: '8px 12px',
            background: isSuccess ? 'transparent' : 'var(--rd-accent)',
            color: isSuccess ? 'var(--rd-pos)' : '#001018',
            border: `1px solid ${isSuccess ? 'color-mix(in oklab, var(--rd-pos) 40%, transparent)' : 'var(--rd-accent)'}`,
            borderRadius: 4,
            fontWeight: 600,
            fontSize: 12,
            cursor: !isConnected || busy || isSuccess ? 'default' : 'pointer',
            opacity: !isConnected ? 0.5 : busy ? 0.6 : 1,
          }}
        >
          {!isConnected
            ? 'Connect wallet'
            : isSuccess
              ? '✓ Bought'
              : busy
                ? 'Confirming…'
                : needsApproval
                  ? `① Approve $${ask}`
                  : `Buy for $${ask}`}
        </button>
      )}

      {writeErr && (
        <div style={{ color: 'var(--rd-neg)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10 }}>
          ⚠ {String((writeErr as Error).message ?? writeErr).slice(0, 80)}
        </div>
      )}
    </div>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: 32, background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: 8, textAlign: 'center', color: 'var(--rd-text-2)', fontSize: 13 }}>
      {children}
    </div>
  )
}
