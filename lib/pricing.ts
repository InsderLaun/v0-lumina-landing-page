// ═══════════════════════════════════════════════════════════════
// LUMINA PROTOCOL — PRICING ENGINE
// Mirror of PremiumMath.sol (on-chain source of truth)
// ═══════════════════════════════════════════════════════════════

// ─── Kink Model constants from PremiumMath.sol ───────────────
// U_KINK       = 8000 bps (80%)
// R_SLOPE1_WAD = 0.5
// R_SLOPE2_WAD = 3.0
// U_MAX        = 9500 bps (95%)
const U_KINK = 0.80
const SLOPE1 = 0.5
const SLOPE2 = 3.0
const U_MAX = 0.95

/**
 * Calculate M(U) — the utilization multiplier from PremiumMath.sol
 * M(0%)  = 1.000
 * M(20%) = 1.125
 * M(40%) = 1.250
 * M(60%) = 1.375
 * M(80%) = 1.500  (kink point)
 * M(85%) = 2.250
 * M(90%) = 3.000
 * M(95%) = 3.750  (max before reject)
 */
function calcKinkMultiplier(utilizationPct: number): number {
    const util = Math.min(Math.max(utilizationPct / 100, 0), U_MAX)
    if (util <= 0) return 1.0
    if (util <= U_KINK) {
        return 1.0 + (util / U_KINK) * SLOPE1
    }
    return 1.0 + SLOPE1 + ((util - U_KINK) / (1.0 - U_KINK)) * SLOPE2
}

// ─── Per-product config (pBase in bps) — from actuarial specs ─────────────
// BSS (Black Swan Shield):  2200 bps = 22%
// DEPEG (Depeg Shield):     2400 bps = 24%
// IL (IL Index Cover):      2000 bps = 20%
// EXPLOIT (Exploit Shield):  300 bps = 3%
const PRODUCT_PBASE: Record<string, { pBaseBps: number; deductibleBps: number; triggerDesc: string }> = {
    'LIQSHIELD-001':   { pBaseBps: 2200, deductibleBps: 3000, triggerDesc: 'ETH/USD drops >30% for 30 min (Chainlink)' },
    'BLACKSWAN-001':   { pBaseBps: 2200, deductibleBps: 3000, triggerDesc: 'ETH/USD drops >30% for 30 min (Chainlink)' },
    'DEPEG-USDC-001':  { pBaseBps: 2400, deductibleBps: 500,  triggerDesc: 'USDC/USD stays below $0.95 for 4h (Chainlink)' },
    'DEPEG-USDT-001':  { pBaseBps: 2400, deductibleBps: 500,  triggerDesc: 'USDT/USD stays below $0.95 for 4h (Chainlink)' },
    'DEPEG-DAI-001':   { pBaseBps: 2400, deductibleBps: 500,  triggerDesc: 'DAI/USD stays below $0.95 for 4h (Chainlink)' },
    'DEPEG-STABLE-001':{ pBaseBps: 2400, deductibleBps: 500,  triggerDesc: 'Stablecoin/USD stays below $0.95 for 4h (Chainlink)' },
    'ILPROT-001':      { pBaseBps: 2000, deductibleBps: 200,  triggerDesc: 'IL% > 2% at expiry (European-style, Chainlink)' },
    'EXPLOIT-001':     { pBaseBps: 300,  deductibleBps: 0,    triggerDesc: 'Protocol exploit verified by Phala TEE oracle' },
    'GASSPIKE-001':    { pBaseBps: 2200, deductibleBps: 1000, triggerDesc: 'Base L2 gas >100 gwei for 15 min' },
    'SLIPPAGE-001':    { pBaseBps: 2200, deductibleBps: 300,  triggerDesc: 'Price moves >5% during execution (immediate)' },
    'BRIDGE-001':      { pBaseBps: 2200, deductibleBps: 500,  triggerDesc: 'Funds don\'t arrive at destination within 365 days' },
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
    const protocolFee = premiumYieldAnnual * 0.03
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
