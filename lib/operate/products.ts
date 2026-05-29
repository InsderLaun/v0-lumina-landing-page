// Sprint Landing Integral V5.3 — 6 flash shields on Base mainnet.
// FlashBTC × 3 (1h/24h/48h) + FlashETH × 3 (1h/24h/48h). MicroDepeg y
// FlashBTC 4h fueron retirados en Sprint T-30c. RateShock está pausado
// (CR.products.active = false + PM.productActive = false desde Sprint
// Cleanup 2026-05-22) y no se muestra al usuario.
//
// V5.3 introdujo `FlashShieldAdapter` (UUPS proxy) por cada slim shield:
// PolicyManagerV2 mapea `productId → adapter`, y el adapter delega a la
// `BaseFlashShield` underlying. Las direcciones canónicas que el usuario
// usa son las del adapter (es a quien `purchasePolicy` resuelve via
// PolicyManagerV2.productShield(productId)). El campo `shieldAddress`
// queda como referencia documental al slim shield underlying.
//
// La columna/etiqueta "probLabel" fue removida del descriptor por Sprint
// Landing Integral — el premium ya viene como cifra final ($/$1k).

import { keccak256, toBytes, toHex, padHex, type Address, type Hex } from 'viem'
import { CONTRACTS } from '@/lib/lumina-config'

export type AssetSymbol = 'BTC' | 'ETH' | 'USDT' | 'USDC'

export interface ShieldDescriptor {
  /** Stable URL slug (e.g., 'flash-btc-1h'). */
  slug: string
  /**
   * On-chain address surfaced to writers (`purchasePolicy` resolves via
   * PolicyManagerV2.productShield → adapter). For decode/inspection of the
   * underlying drop math, see `shieldAddress`.
   */
  address: Address
  /** Underlying BaseFlashShield (read-only / decode helper, not the writer entry). */
  shieldAddress: Address
  /** Human-readable display name. */
  name: string
  /** Asset family for filters / iconography. */
  asset: AssetSymbol
  /** Duration label (e.g., '1h', '24h'). */
  duration: string
  /**
   * On-chain coverage duration in seconds. Mirrors `durationSeconds`
   * configured in CoverRouterV2.configureProduct.
   */
  durationSeconds: number
  /** Trigger description (English, plain-language). */
  trigger: string
  /** Bond multiplier label (e.g., '342x' = coverage/premium). */
  multLabel: string
  /** Sprint T-30c premium per $1,000 coverage (USDC, 6-dec under the hood). */
  premiumPerThousandUSDC: number
  /** Tier 1 = high-frequency flash. */
  tier: 1
  /**
   * On-chain productId = keccak256(canonicalName).
   */
  productId: Hex
  /** Bytes32 right-padded literal expected by the shield's policy check. */
  assetBytes: Hex
}

function pid(canonical: string): Hex {
  return keccak256(toBytes(canonical))
}

function assetBytesFor(symbol: AssetSymbol): Hex {
  return padHex(toHex(symbol), { size: 32, dir: 'right' })
}

export const SHIELDS: ShieldDescriptor[] = [
  {
    slug: 'flash-btc-1h',
    address: CONTRACTS.adapters.FlashBTC1h,
    shieldAddress: CONTRACTS.shields.FlashBTC1h,
    name: 'Flash BTC 1h',
    asset: 'BTC',
    duration: '1h',
    durationSeconds: 3600,
    trigger: 'BTC drops 2.5% from purchase price within 1 hour',
    multLabel: '342x',
    premiumPerThousandUSDC: 2.92,
    tier: 1,
    productId: pid('FLASHBTC1H-001'),
    assetBytes: assetBytesFor('BTC'),
  },
  {
    slug: 'flash-btc-24h',
    address: CONTRACTS.adapters.FlashBTC24h,
    shieldAddress: CONTRACTS.shields.FlashBTC24h,
    name: 'Flash BTC 24h',
    asset: 'BTC',
    duration: '24h',
    durationSeconds: 86400,
    trigger: 'BTC drops 6% from purchase price within 24 hours',
    multLabel: '19x',
    premiumPerThousandUSDC: 52.60,
    tier: 1,
    productId: pid('FLASHBTC24-001'),
    assetBytes: assetBytesFor('BTC'),
  },
  {
    slug: 'flash-btc-48h',
    address: CONTRACTS.adapters.FlashBTC48h,
    shieldAddress: CONTRACTS.shields.FlashBTC48h,
    name: 'Flash BTC 48h',
    asset: 'BTC',
    duration: '48h',
    durationSeconds: 172800,
    trigger: 'BTC drops 10% from purchase price within 48 hours',
    multLabel: '7x',
    premiumPerThousandUSDC: 148.67,
    tier: 1,
    productId: pid('FLASHBTC48-001'),
    assetBytes: assetBytesFor('BTC'),
  },
  {
    slug: 'flash-eth-1h',
    address: CONTRACTS.adapters.FlashETH1h,
    shieldAddress: CONTRACTS.shields.FlashETH1h,
    name: 'Flash ETH 1h',
    asset: 'ETH',
    duration: '1h',
    durationSeconds: 3600,
    trigger: 'ETH drops 4% from purchase price within 1 hour',
    multLabel: '595x',
    premiumPerThousandUSDC: 1.68,
    tier: 1,
    productId: pid('FLASHETH1H-001'),
    assetBytes: assetBytesFor('ETH'),
  },
  {
    slug: 'flash-eth-24h',
    address: CONTRACTS.adapters.FlashETH24h,
    shieldAddress: CONTRACTS.shields.FlashETH24h,
    name: 'Flash ETH 24h',
    asset: 'ETH',
    duration: '24h',
    durationSeconds: 86400,
    trigger: 'ETH drops 8.5% from purchase price within 24 hours',
    multLabel: '22x',
    premiumPerThousandUSDC: 45.80,
    tier: 1,
    productId: pid('FLASHETH24-001'),
    assetBytes: assetBytesFor('ETH'),
  },
  {
    slug: 'flash-eth-48h',
    address: CONTRACTS.adapters.FlashETH48h,
    shieldAddress: CONTRACTS.shields.FlashETH48h,
    name: 'Flash ETH 48h',
    asset: 'ETH',
    duration: '48h',
    durationSeconds: 172800,
    trigger: 'ETH drops 14% from purchase price within 48 hours',
    multLabel: '8x',
    premiumPerThousandUSDC: 123.01,
    tier: 1,
    productId: pid('FLASHETH48-001'),
    assetBytes: assetBytesFor('ETH'),
  },
]

export const SHIELD_BY_SLUG: Record<string, ShieldDescriptor> = Object.fromEntries(
  SHIELDS.map((s) => [s.slug, s]),
)
export const SHIELD_BY_PRODUCT_ID: Record<string, ShieldDescriptor> = Object.fromEntries(
  SHIELDS.map((s) => [s.productId, s]),
)

export const ASSET_COLORS: Record<AssetSymbol, string> = {
  BTC: '#f7931a',
  ETH: '#627eea',
  USDT: '#26a17b',
  USDC: '#2775ca',
}

/** Cover bounds — see lumina-config.ts PROTOCOL.{minCoverageUSD,maxCoverageUSD}.
 *  Real per-shield min comes from CoverRouterV2._purchase (`coverageAmount < 100e6` reverts).
 *  Real per-shield max is unbounded — capped only by BondVault.availableCapacityUSD(). */
export const COVER_MIN_USDC = 100
export const COVER_MAX_USDC = 100_000
