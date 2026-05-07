// useShields — runtime resolution of the 9 V5.1 shield addresses + metadata.
//
// Reads `/api/v1/products` at app load and caches via react-query.
// Components that need a shield's on-chain address (for getLogs, basescan
// links, ERC-1155 reads, etc.) MUST consume through this hook so they
// stay in sync with the live registry across redeploys.

'use client'

import { useQuery } from '@tanstack/react-query'

const PRODUCTS_URL = 'https://lumina-api-production-ac85.up.railway.app/api/v1/products'

export interface ShieldInfo {
  productId: `0x${string}`
  name: string
  displayName: string
  shield: `0x${string}`
  coveredAsset: 'USDC' | 'USDT' | 'BTC' | 'ETH'
  paymentAsset: 'USDC'
  durationSeconds: number
  payoutRatioBps: number
  triggerProbBps: number
  marginBps: number
  active: boolean
  coverageDescription?: string
}

interface ProductsResponse {
  count: number
  products: ShieldInfo[]
}

async function fetchShields(): Promise<ShieldInfo[]> {
  const res = await fetch(PRODUCTS_URL, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(`useShields: /api/v1/products returned HTTP ${res.status}`)
  }
  const body = (await res.json()) as ProductsResponse
  return body.products ?? []
}

/**
 * React hook returning the 9 V5.1 shields with their LIVE addresses
 * and metadata.
 *
 * @example
 * const { data: shields } = useShields()
 * const flashBtc1h = shields?.find(s => s.name === 'FLASHBTC1H-001')
 * console.log(flashBtc1h?.shield)
 */
export function useShields() {
  return useQuery<ShieldInfo[], Error>({
    queryKey: ['lumina-shields'],
    queryFn: fetchShields,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  })
}

/**
 * Convenience selector: find a shield by its canonical name (e.g.
 * `'FLASHBTC1H-001'`). Returns `undefined` while loading or if the name
 * is unknown.
 */
export function useShieldByName(name: string) {
  const { data } = useShields()
  return data?.find((s) => s.name === name)
}
