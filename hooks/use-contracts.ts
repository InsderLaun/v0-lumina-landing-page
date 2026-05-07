// useContracts — single source of truth for V5.1 contract addresses.
//
// Reads the Lumina API `/health` endpoint at app load and caches the
// result for the session via react-query. Components MUST consume
// addresses through this hook (or its non-hook equivalent
// `getContractsSnapshot`) instead of importing `CONTRACTS` from
// `lib/lumina-config.ts` — that legacy export is now a frozen
// snapshot kept only so non-component callers (server utilities,
// tests, tutorial data) keep type-checking. After a redeploy, only
// `/health` is canonical.

'use client'

import { useQuery } from '@tanstack/react-query'

const HEALTH_URL = 'https://lumina-api-production-ac85.up.railway.app/health'

export interface ContractAddresses {
  coverRouter: `0x${string}`
  policyManager: `0x${string}`
  bondVault: `0x${string}`
  claimBond: `0x${string}`
  marketplace: `0x${string}`
  usdc: `0x${string}`
  luminaToken: `0x${string}`
}

interface HealthResponse {
  contracts: Partial<Record<keyof ContractAddresses, string>>
}

const REQUIRED_KEYS: ReadonlyArray<keyof ContractAddresses> = [
  'coverRouter',
  'policyManager',
  'bondVault',
  'claimBond',
  'marketplace',
  'usdc',
  'luminaToken',
]

async function fetchContracts(): Promise<ContractAddresses> {
  const res = await fetch(HEALTH_URL, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(`useContracts: /health returned HTTP ${res.status}`)
  }
  const body = (await res.json()) as HealthResponse
  const c = body.contracts ?? {}
  const missing = REQUIRED_KEYS.filter((k) => typeof c[k] !== 'string' || !c[k])
  if (missing.length > 0) {
    throw new Error(`useContracts: /health.contracts missing keys: ${missing.join(', ')}`)
  }
  return {
    coverRouter: c.coverRouter as `0x${string}`,
    policyManager: c.policyManager as `0x${string}`,
    bondVault: c.bondVault as `0x${string}`,
    claimBond: c.claimBond as `0x${string}`,
    marketplace: c.marketplace as `0x${string}`,
    usdc: c.usdc as `0x${string}`,
    luminaToken: c.luminaToken as `0x${string}`,
  }
}

/**
 * React hook returning the LIVE V5.1 contract addresses. Use in any
 * client component that needs `coverRouter`, `policyManager`, `claimBond`,
 * `bondVault`, `marketplace`, `usdc`, or `luminaToken`.
 *
 * @example
 * const { data: contracts, isLoading, error } = useContracts()
 * if (!contracts) return <Spinner />
 * const tx = await publicClient.readContract({ address: contracts.policyManager, ... })
 */
export function useContracts() {
  return useQuery<ContractAddresses, Error>({
    queryKey: ['lumina-contracts'],
    queryFn: fetchContracts,
    // The contracts only change on a redeploy. Cache aggressively.
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  })
}
