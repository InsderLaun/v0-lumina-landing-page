// ═══════════════════════════════════════════════════════════════
// LUMINA PROTOCOL — PRICING ENGINE
// Real formulas matching the API pricing engine
// ═══════════════════════════════════════════════════════════════

type ThresholdMap = Record<number, number>

// ─── Liquidation Shield ─────────────────────────────────────
const LIQSHIELD_THRESHOLD_RISK: ThresholdMap = {
    3000: 50,
    2500: 100,
    2000: 150,
    1500: 300,
    1000: 500,
}

function liqshieldDurationAdj(days: number): number {
    if (days <= 14) return 1.0
    if (days <= 30) return 1.3
    if (days <= 60) return 1.6
    return 2.0
}

function amountAdj(amount: number): number {
    if (amount < 1000) return 1.0
    if (amount <= 10000) return 1.1
    if (amount <= 50000) return 1.2
    return 1.4
}

// ─── Depeg ──────────────────────────────────────────────────
const DEPEG_THRESHOLD_RISK: Record<string, number> = {
    '0.90': 30,
    '0.95': 80,
    '0.97': 200,
    '0.99': 500,
}

const STABLECOIN_RISK: Record<string, number> = {
    USDC: 1.0,
    USDT: 1.3,
    DAI: 1.2,
}

function depegDurationAdj(days: number): number {
    if (days <= 30) return 1.0
    if (days <= 60) return 1.3
    if (days <= 90) return 1.6
    if (days <= 180) return 1.62
    if (days <= 270) return 1.6
    return 1.43 // 271-365 discount for long term
}

// ─── IL Protection ──────────────────────────────────────────
const IL_THRESHOLD_RISK: ThresholdMap = {
    5000: 50,
    3000: 200,
    2000: 400,
    1500: 700,
}

const PAIR_RISK: Record<string, number> = {
    'ETH/USDC': 1.0,
    'BTC/USDC': 1.0,
    'ETH/BTC': 0.8,
}

function ilDurationAdj(days: number): number {
    if (days <= 14) return 1.0
    if (days <= 30) return 1.3
    if (days <= 60) return 1.6
    return 1.6
}

// ─── Gas Spike ──────────────────────────────────────────────
const GAS_THRESHOLD_RISK: ThresholdMap = {
    500: 20,
    200: 80,
    100: 200,
    50: 400,
}

function gasDurationAdj(days: number): number {
    if (days <= 14) return 1.0
    if (days <= 30) return 1.3
    return 1.3
}

// ─── Slippage ───────────────────────────────────────────────
const SLIPPAGE_THRESHOLD_RISK: ThresholdMap = {
    1000: 30,
    500: 150,
    300: 350,
    200: 600,
}

// ─── Bridge ─────────────────────────────────────────────────
const BRIDGE_RISK: Record<string, number> = {
    'Base Bridge': 0.8,
    'Across': 1.0,
    'Stargate': 1.0,
    'Hop': 1.0,
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════

export interface PremiumCalcInput {
    productId: string
    coverageAmount: number
    durationDays: number
    thresholdBps?: number        // for LIQSHIELD, IL, GAS, SLIPPAGE
    thresholdPrice?: string      // for DEPEG ($0.99, $0.97, etc.)
    stablecoin?: string          // USDC, USDT, DAI
    pair?: string                // for IL (ETH/USDC, etc.)
    bridge?: string              // for BRIDGE
}

export interface PremiumCalcResult {
    premiumRate: number          // in bps
    premium: number              // in USDC
    maxPayout: number            // coverage - deductible
    deductiblePct: number
    costPerDay: number
    triggerDescription: string
}

export function calculatePremium(input: PremiumCalcInput): PremiumCalcResult {
    const { productId, coverageAmount, durationDays } = input
    let premiumRate = 0
    let deductibleBps = 500 // 5% default
    let triggerDescription = ''

    switch (productId) {
        case 'LIQSHIELD-001': {
            const tBps = input.thresholdBps || 2000
            const tRisk = LIQSHIELD_THRESHOLD_RISK[tBps] || 150
            premiumRate = 200 + (tRisk * liqshieldDurationAdj(durationDays) * amountAdj(coverageAmount))
            deductibleBps = 500
            triggerDescription = `ETH/USD drops >${tBps / 100}% for 30 min (Chainlink)`
            break
        }
        case 'DEPEG-USDC-001':
        case 'DEPEG-USDT-001':
        case 'DEPEG-DAI-001': {
            const threshold = input.thresholdPrice || '0.97'
            const coin = input.stablecoin || (productId.includes('USDT') ? 'USDT' : productId.includes('DAI') ? 'DAI' : 'USDC')
            const tRisk = DEPEG_THRESHOLD_RISK[threshold] || 200
            const sRisk = STABLECOIN_RISK[coin] || 1.0
            premiumRate = 100 + (tRisk * depegDurationAdj(durationDays) * sRisk)
            deductibleBps = 300
            triggerDescription = `${coin}/USD stays below $${threshold} for 4h (Chainlink)`
            break
        }
        case 'ILPROT-001': {
            const tBps = input.thresholdBps || 2000
            const tRisk = IL_THRESHOLD_RISK[tBps] || 400
            const pRisk = PAIR_RISK[input.pair || 'ETH/USDC'] || 1.0
            premiumRate = 300 + (tRisk * ilDurationAdj(durationDays) * pRisk)
            deductibleBps = 800
            triggerDescription = `Price divergence >${tBps / 100}% for 2h (Chainlink)`
            break
        }
        case 'GASSPIKE-001': {
            const gwei = input.thresholdBps || 100 // reuse thresholdBps for gwei value
            const tRisk = GAS_THRESHOLD_RISK[gwei] || 200
            premiumRate = 150 + (tRisk * gasDurationAdj(durationDays))
            deductibleBps = 1000
            triggerDescription = `Base L2 gas >${gwei} gwei for 15 min`
            break
        }
        case 'SLIPPAGE-001': {
            const tBps = input.thresholdBps || 500
            const tRisk = SLIPPAGE_THRESHOLD_RISK[tBps] || 150
            premiumRate = 100 + tRisk
            deductibleBps = 300
            triggerDescription = `Price moves >${tBps / 100}% during execution (immediate)`
            break
        }
        case 'BRIDGE-001': {
            const bRisk = BRIDGE_RISK[input.bridge || 'Across'] || 1.0
            premiumRate = 300 * bRisk
            deductibleBps = 500
            triggerDescription = `Funds don't arrive at destination within 365 days`
            break
        }
        default:
            premiumRate = 300
    }

    // Clamp premiumRate to reasonable range
    premiumRate = Math.max(100, Math.min(premiumRate, 1500))

    const premium = (coverageAmount * premiumRate) / 10000
    const maxPayout = coverageAmount * (1 - deductibleBps / 10000)
    const costPerDay = durationDays > 0 ? premium / durationDays : premium

    return {
        premiumRate,
        premium: Math.round(premium * 100) / 100,
        maxPayout: Math.round(maxPayout * 100) / 100,
        deductiblePct: deductibleBps / 100,
        costPerDay: Math.round(costPerDay * 100) / 100,
        triggerDescription,
    }
}

// LP yield calculator
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

    // Determine risk type from product
    const volatileProducts = ['LIQSHIELD-001', 'ILPROT-001']
    const isVolatile = volatileProducts.includes(productId)

    // Kink Model (same as on-chain contracts)
    const usdyBase = 0.04  // ~4% base Aave V3 USDC lending yield (variable)
    const params = isVolatile
        ? { kink: 0.70, slopeBelow: 0.02, slopeAbove: 0.15, base: 0.01 }
        : { kink: 0.80, slopeBelow: 0.005, slopeAbove: 0.10, base: 0.003 }

    let premiumRate: number
    if (utilization <= params.kink) {
        premiumRate = params.base + params.slopeBelow * utilization
    } else {
        const rateAtKink = params.base + params.slopeBelow * params.kink
        premiumRate = rateAtKink + params.slopeAbove * (utilization - params.kink)
    }

    const apyEstimate = (usdyBase + premiumRate * utilization) * 100

    // Break down into components
    const usdyYieldAnnual = depositAmount * usdyBase
    const premiumYieldAnnual = depositAmount * premiumRate * utilization
    const protocolFee = premiumYieldAnnual * 0.03
    const netPremiumYield = premiumYieldAnnual - protocolFee
    const totalAnnualYield = usdyYieldAnnual + netPremiumYield

    // Deductibles for max loss calculation
    const deductibles: Record<string, number> = {
        'LIQSHIELD-001': 500,
        'DEPEG-USDC-001': 300,
        'DEPEG-USDT-001': 300,
        'DEPEG-DAI-001': 300,
        'ILPROT-001': 800,
        'GASSPIKE-001': 1000,
        'SLIPPAGE-001': 300,
        'BRIDGE-001': 500,
    }
    const deductBps = deductibles[productId] || 500
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
