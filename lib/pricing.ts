// ═══════════════════════════════════════════════════════════════
// LUMINA PROTOCOL — PRICING ENGINE
// Mirror of PremiumMath.sol (on-chain source of truth)
// All constants and product data imported from lumina-config.ts
// ═══════════════════════════════════════════════════════════════

import {
  KINK_MODEL,
  PRODUCTS,
  PROTOCOL,
  calcKinkMultiplier,
} from './lumina-config'

// ─── Per-product config (pBase in bps) — from lumina-config.ts ─────────────
// Maps legacy product IDs to the canonical config
const PRODUCT_PBASE: Record<string, { pBaseBps: number; deductibleBps: number; triggerDesc: string }> = {
    'LIQSHIELD-001':   { pBaseBps: PRODUCTS.BSS.pBaseBps, deductibleBps: PRODUCTS.BSS.deductibleBps, triggerDesc: 'ETH/USD drops >30% for 30 min (Chainlink)' },
    'BLACKSWAN-001':   { pBaseBps: PRODUCTS.BSS.pBaseBps, deductibleBps: PRODUCTS.BSS.deductibleBps, triggerDesc: 'ETH/USD drops >30% for 30 min (Chainlink)' },
    'DEPEG-USDC-001':  { pBaseBps: PRODUCTS.DEPEG.pBaseBps, deductibleBps: 500,  triggerDesc: 'USDC/USD stays below $0.95 for 4h (Chainlink)' },
    'DEPEG-USDT-001':  { pBaseBps: PRODUCTS.DEPEG.pBaseBps, deductibleBps: 500,  triggerDesc: 'USDT/USD stays below $0.95 for 4h (Chainlink)' },
    'DEPEG-DAI-001':   { pBaseBps: PRODUCTS.DEPEG.pBaseBps, deductibleBps: 500,  triggerDesc: 'DAI/USD stays below $0.95 for 4h (Chainlink)' },
    'DEPEG-STABLE-001':{ pBaseBps: PRODUCTS.DEPEG.pBaseBps, deductibleBps: 500,  triggerDesc: 'Stablecoin/USD stays below $0.95 for 4h (Chainlink)' },
    'ILPROT-001':      { pBaseBps: PRODUCTS.IL.pBaseBps, deductibleBps: PRODUCTS.IL.deductibleBps,  triggerDesc: 'IL% > 2% at expiry (European-style, Chainlink)' },
    'EXPLOIT-001':     { pBaseBps: PRODUCTS.EXPLOIT.pBaseBps,  deductibleBps: PRODUCTS.EXPLOIT.deductibleBps,    triggerDesc: 'Protocol exploit verified by Phala TEE oracle' },
    'GASSPIKE-001':    { pBaseBps: PRODUCTS.BSS.pBaseBps, deductibleBps: 1000, triggerDesc: 'Base L2 gas >100 gwei for 15 min' },
    'SLIPPAGE-001':    { pBaseBps: PRODUCTS.BSS.pBaseBps, deductibleBps: 300,  triggerDesc: 'Price moves >5% during execution (immediate)' },
    'BRIDGE-001':      { pBaseBps: PRODUCTS.BSS.pBaseBps, deductibleBps: 500,  triggerDesc: 'Funds don\'t arrive at destination within 365 days' },
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════

export interface PremiumCalcInput {
    productId: string
    coverageAmount: number
    durationDays: number
    utilizationPct?: number      // 0-100, defaults to 20
    thresholdBps?: number        // legacy, ignored in new model
    thresholdPrice?: string      // legacy, ignored in new model
    stablecoin?: string
    pair?: string
    bridge?: string
}

export interface PremiumCalcResult {
    premiumRate: number          // effective annual rate in bps (pBase * M(U))
    premium: number              // in USDC
    maxPayout: number            // coverage - deductible
    deductiblePct: number
    costPerDay: number
    triggerDescription: string
}

/**
 * Calculate premium mirroring PremiumMath.sol exactly.
 * Premium = Coverage * (pBaseBps / 10000) * M(U) * (durationDays / 365)
 * riskMult and durationDiscount default to 1.0x for calculator purposes.
 */
export function calculatePremium(input: PremiumCalcInput): PremiumCalcResult {
    const { productId, coverageAmount, durationDays } = input
    const utilizationPct = input.utilizationPct ?? 20

    const config = PRODUCT_PBASE[productId] || { pBaseBps: 250, deductibleBps: 500, triggerDesc: 'Unknown product' }
    const multiplier = calcKinkMultiplier(utilizationPct)

    // Effective annual rate in bps = pBaseBps * M(U)
    const effectiveRateBps = config.pBaseBps * multiplier

    // Premium = Coverage * (pBaseBps / 10000) * M(U) * (durationDays / 365)
    const premium = coverageAmount * (config.pBaseBps / 10000) * multiplier * (durationDays / 365)
    const maxPayout = coverageAmount * (1 - config.deductibleBps / 10000)
    const costPerDay = durationDays > 0 ? premium / durationDays : premium

    return {
        premiumRate: Math.round(effectiveRateBps),
        premium: Math.round(premium * 100) / 100,
        maxPayout: Math.round(maxPayout * 100) / 100,
        deductiblePct: config.deductibleBps / 100,
        costPerDay: Math.round(costPerDay * 100) / 100,
        triggerDescription: config.triggerDesc,
    }
}

// LP yield calculator — uses the same kink model as PremiumMath.sol
export interface YieldCalcInput {
    productId: string
    depositAmount: number
    utilizationPct: number // 0-100, what % of pool is sold as policies
}

export interface YieldCalcResult {
    yieldIfNoClaims: number
    maxLossIfClaim: number
    protocolFee: number
    netYield: number
    apyEstimate: number
}

export function calculateYield(input: YieldCalcInput): YieldCalcResult {
    const { productId, depositAmount, utilizationPct } = input

    const utilization = utilizationPct / 100  // convert to 0-1

    // Get pBase for this product
    const config = PRODUCT_PBASE[productId] || { pBaseBps: 250, deductibleBps: 500, triggerDesc: '' }
    const pBaseRate = config.pBaseBps / 10000  // e.g., 250 bps -> 0.025

    // Kink Model M(U) from PremiumMath.sol
    const multiplier = calcKinkMultiplier(utilizationPct)

    // Annual premium rate per dollar of coverage = pBaseRate * M(U)
    // LP yield from premiums = deposit * utilization * pBaseRate * M(U)
    // (utilization portion of the deposit is "sold as coverage",
    //  and premiums are pBaseRate * M(U) per year per dollar of coverage)
    const aaveBaseYield = 0.04  // ~4% base Aave V3 USDC lending yield (variable)
    const premiumRateAnnual = pBaseRate * multiplier
    const apyEstimate = (aaveBaseYield + premiumRateAnnual * utilization) * 100

    // Break down into components
    const usdyYieldAnnual = depositAmount * aaveBaseYield
    const premiumYieldAnnual = depositAmount * premiumRateAnnual * utilization
    const protocolFeeRate = PROTOCOL.feeBps / 10000
    const protocolFee = premiumYieldAnnual * protocolFeeRate
    const netPremiumYield = premiumYieldAnnual - protocolFee
    const totalAnnualYield = usdyYieldAnnual + netPremiumYield

    // Max loss calculation
    const deductBps = config.deductibleBps
    const utilizedAmount = depositAmount * utilization
    const maxLossIfClaim = utilizedAmount * (1 - deductBps / 10000)

    return {
        yieldIfNoClaims: Math.round(totalAnnualYield * 100) / 100,
        maxLossIfClaim: Math.round(maxLossIfClaim * 100) / 100,
        protocolFee: Math.round(protocolFee * 100) / 100,
        netYield: Math.round(totalAnnualYield * 100) / 100,
        apyEstimate: Math.round(apyEstimate * 100) / 100,
    }
}
