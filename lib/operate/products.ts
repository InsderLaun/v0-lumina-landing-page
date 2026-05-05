// Frontend mapping: 9 V5.1 shields. The on-chain `productId` is
// keccak256 of the canonical deploy-time name. Verified against
// LUMINA-PROTOCOL/script/deploy/DeployLuminaV5Sepolia.s.sol — these
// strings are NOT the slugs, they are the literal bytes the deployer
// hashed at registration. Verified live on Base Sepolia: every id
// here resolves to active=true via CoverRouterV2.getProductConfig.
// Addresses come from CONTRACTS.shields in lib/lumina-config.ts.
//
// IShield does NOT expose a `name()` function — names live here, not
// on-chain. Premium / cover limits / paused state come from CoverRouterV2
// (verified against /tmp/lp-s2/src/core/CoverRouterV2.sol).

import { keccak256, toBytes, toHex, padHex, type Address, type Hex } from 'viem'
import { CONTRACTS } from '@/lib/lumina-config'

export type AssetSymbol = 'BTC' | 'ETH' | 'USDT' | 'USDC'

export interface ShieldDescriptor {
  /** Stable URL slug (e.g., 'flash-btc-1h'). */
  slug: string
  /** On-chain shield contract address. */
  address: Address
  /** Human-readable display name. */
  name: string
  /** Asset family for filters / iconography. */
  asset: AssetSymbol
  /** Duration label (e.g., '1h', '24h', '7d'). */
  duration: string
  /** Trigger description (English, plain-language). */
  trigger: string
  /** Estimated probability label. */
  probLabel: string
  /** Bond multiplier label (e.g., '333x'). */
  multLabel: string
  /** Tier 1 = high-frequency, 2 = lower-frequency. */
  tier: 1 | 2
  /**
   * On-chain productId = keccak256(canonicalName).
   * Canonical names are documented in LUMINA-PROTOCOL deployments script;
   * we derive them here. The configureProduct() call sets the same hash.
   */
  productId: Hex
}

function pid(canonical: string): Hex {
  return keccak256(toBytes(canonical))
}

/** Asset constant for `purchasePolicy(productId, cov, asset)` — V5.1 uses
 *  bytes32 padded asset symbol. USDC is the only payment asset accepted on
 *  Sepolia testnet. */
export const ASSET_USDC: Hex = padHex(toHex('USDC'), { size: 32, dir: 'right' })

export const SHIELDS: ShieldDescriptor[] = [
  {
    slug: 'flash-btc-1h',
    address: CONTRACTS.shields.FlashBTC1h,
    name: 'Flash BTC 1h',
    asset: 'BTC',
    duration: '1h',
    trigger: 'BTC price drops ≥5% in any rolling 1-hour window',
    probLabel: '0.20%',
    multLabel: '333x',
    tier: 1,
    productId: pid('FLASHBTC1H-001'),
  },
  {
    slug: 'flash-btc-4h',
    address: CONTRACTS.shields.FlashBTC4h,
    name: 'Flash BTC 4h',
    asset: 'BTC',
    duration: '4h',
    trigger: 'BTC price drops ≥8% in any rolling 4-hour window',
    probLabel: '0.35%',
    multLabel: '190x',
    tier: 1,
    productId: pid('FLASHBTC4H-001'),
  },
  {
    slug: 'flash-btc-24h',
    address: CONTRACTS.shields.FlashBTC24h,
    name: 'Flash BTC 24h',
    asset: 'BTC',
    duration: '24h',
    trigger: 'BTC price drops ≥10% in any rolling 24-hour window',
    probLabel: '1.50%',
    multLabel: '44x',
    tier: 1,
    productId: pid('FLASHBTC24-001'),
  },
  {
    slug: 'flash-btc-48h',
    address: CONTRACTS.shields.FlashBTC48h,
    name: 'Flash BTC 48h',
    asset: 'BTC',
    duration: '48h',
    trigger: 'BTC price drops ≥15% in any rolling 48-hour window',
    probLabel: '0.80%',
    multLabel: '83x',
    tier: 1,
    productId: pid('FLASHBTC48-001'),
  },
  {
    slug: 'flash-eth-1h',
    address: CONTRACTS.shields.FlashETH1h,
    name: 'Flash ETH 1h',
    asset: 'ETH',
    duration: '1h',
    trigger: 'ETH price drops ≥7% in any rolling 1-hour window',
    probLabel: '0.25%',
    multLabel: '266x',
    tier: 1,
    productId: pid('FLASHETH1H-001'),
  },
  {
    slug: 'flash-eth-24h',
    address: CONTRACTS.shields.FlashETH24h,
    name: 'Flash ETH 24h',
    asset: 'ETH',
    duration: '24h',
    trigger: 'ETH price drops ≥12% in any rolling 24-hour window',
    probLabel: '2.00%',
    multLabel: '33x',
    tier: 1,
    productId: pid('FLASHETH24-001'),
  },
  {
    slug: 'flash-eth-48h',
    address: CONTRACTS.shields.FlashETH48h,
    name: 'Flash ETH 48h',
    asset: 'ETH',
    duration: '48h',
    trigger: 'ETH price drops ≥18% in any rolling 48-hour window',
    probLabel: '0.90%',
    multLabel: '74x',
    tier: 1,
    productId: pid('FLASHETH48-001'),
  },
  {
    slug: 'micro-depeg-usdt',
    address: CONTRACTS.shields.MicroDepeg,
    name: 'Micro Depeg USDT',
    asset: 'USDT',
    duration: '7d',
    trigger: 'USDT trades below $0.995 for 7 consecutive days',
    probLabel: '3.50%',
    multLabel: '19x',
    tier: 2,
    productId: pid('MICRODEPEG-001'),
  },
  {
    slug: 'rate-shock',
    address: CONTRACTS.shields.RateShock,
    name: 'Rate Shock',
    asset: 'USDC',
    duration: '7d',
    trigger: 'Aave V3 USDC borrow APR exceeds 10% for 7 consecutive days',
    probLabel: '4.00%',
    multLabel: '17x',
    tier: 2,
    productId: pid('RATESHOCK-001'),
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
 *  Real per-shield min comes from BaseShield._minCoverage() = 100e6 (default).
 *  Real per-shield max is unbounded — capped only by BondVault.availableCapacityUSD(). */
export const COVER_MIN_USDC = 100
export const COVER_MAX_USDC = 100_000
