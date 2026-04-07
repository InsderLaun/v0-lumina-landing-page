// ═══════════════════════════════════════════════════════════════
// LUMINA PROTOCOL — PRODUCT DATA
// 5 Parametric Insurance Products with real specifications (BCS, EAS, DEPEG, IL, EXPLOIT)
// ═══════════════════════════════════════════════════════════════

export type RiskLevel = 'Low' | 'Medium' | 'Higher'

export interface Product {
    id: string
    name: string
    shortName: string
    icon: string // lucide icon name
    description: string
    agentView: {
        tagline: string
        details: string
    }
    lpView: {
        tagline: string
        riskDescription: string
        riskLevel: RiskLevel
        historicalProbability: string
    }
    triggerType: string
    triggerDescription: string
    oracleFeeds: string[]
    premiumRange: [number, number] // percentage [min, max]
    deductiblePct: number
    durationRange: [number, number] // days [min, max]
    sustainedPeriod: string
    thresholdOptions: string[]
    expandedDetail: string
    badges?: string[]
}

export const PRODUCTS: Product[] = [
    {
        id: 'BCS-001',
        name: 'BTC Catastrophe Shield',
        shortName: 'BCS',
        icon: 'ShieldAlert',
        description: 'Protects BTC positions against catastrophic price crashes (>50% drop)',
        agentView: {
            tagline: 'Protect BTC positions from catastrophic crashes',
            details: 'Your agent pays a premium and receives automatic USDC payout if BTC crashes beyond 50%.',
        },
        lpView: {
            tagline: "You're betting BTC won't crash >50%",
            riskDescription: 'You lose collateral if a major BTC price crash exceeds the threshold for 30+ minutes',
            riskLevel: 'Medium',
            historicalProbability: 'Medium',
        },
        triggerType: 'PRICE_DROP_PCT',
        triggerDescription: 'BTC price drops >50% for 30 continuous minutes (Chainlink)',
        oracleFeeds: ['BTC/USD'],
        premiumRange: [2.5, 7],
        deductiblePct: 5,
        durationRange: [7, 90],
        sustainedPeriod: '30 min',
        thresholdOptions: ['30%', '40%', '50%'],
        expandedDetail: 'Trigger: BTC price drops >50% for 30 continuous minutes. Works for positions on any network — measures market price, not your specific position.',
    },
    {
        id: 'EAS-001',
        name: 'ETH Apocalypse Shield',
        shortName: 'EAS',
        icon: 'ShieldAlert',
        description: 'Protects ETH positions against apocalyptic price crashes (>60% drop)',
        agentView: {
            tagline: 'Protect ETH positions from apocalyptic crashes',
            details: 'Your agent pays a premium and receives automatic USDC payout if ETH crashes beyond 60%.',
        },
        lpView: {
            tagline: "You're betting ETH won't crash >60%",
            riskDescription: 'You lose collateral if a major ETH price crash exceeds the threshold for 30+ minutes',
            riskLevel: 'Medium',
            historicalProbability: 'Medium',
        },
        triggerType: 'PRICE_DROP_PCT',
        triggerDescription: 'ETH price drops >60% for 30 continuous minutes (Chainlink)',
        oracleFeeds: ['ETH/USD'],
        premiumRange: [2.5, 7],
        deductiblePct: 5,
        durationRange: [7, 90],
        sustainedPeriod: '30 min',
        thresholdOptions: ['40%', '50%', '60%'],
        expandedDetail: 'Trigger: ETH price drops >60% for 30 continuous minutes. Works for positions on any network — measures market price, not your specific position.',
    },
    {
        id: 'DEPEG-USDC-001',
        name: 'USDC Depeg Cover',
        shortName: 'USDC Depeg',
        icon: 'CircleDollarSign',
        description: 'Covers USDC, USDT and DAI if they lose their dollar peg',
        agentView: {
            tagline: 'Shield against stablecoin de-peg events',
            details: 'Automatic payout if USDC trades below your chosen threshold for 4+ hours according to Chainlink.',
        },
        lpView: {
            tagline: "You're betting USDC won't lose its peg",
            riskDescription: 'You lose collateral if USDC trades below threshold for 4+ continuous hours',
            riskLevel: 'Low',
            historicalProbability: 'Low',
        },
        triggerType: 'PRICE_BELOW',
        triggerDescription: 'USDC price stays below threshold for 4 continuous hours (Chainlink)',
        oracleFeeds: ['USDC/USD'],
        premiumRange: [1.3, 6],
        deductiblePct: 3,
        durationRange: [14, 365],
        sustainedPeriod: '4 hours',
        thresholdOptions: ['$0.99', '$0.97', '$0.95', '$0.90'],
        expandedDetail: 'Trigger: stablecoin price stays below threshold ($0.99/$0.97/$0.95/$0.90) for 4 continuous hours per Chainlink. Extended duration up to 365 days with 35% discount.',
        badges: ['USDC dropped to $0.87 in March 2023'],
    },
    {
        id: 'DEPEG-USDT-001',
        name: 'USDT Depeg Cover',
        shortName: 'USDT Depeg',
        icon: 'CircleDollarSign',
        description: 'Covers USDT if it loses its dollar peg (1.3x risk multiplier)',
        agentView: {
            tagline: 'Protection against Tether losing its peg',
            details: 'Same as USDC cover but with 1.3x risk multiplier reflecting historical uncertainty about Tether reserves.',
        },
        lpView: {
            tagline: "You're betting USDT won't lose its peg",
            riskDescription: 'Higher risk premium reflects uncertainty around Tether reserves',
            riskLevel: 'Medium',
            historicalProbability: 'Medium',
        },
        triggerType: 'PRICE_BELOW',
        triggerDescription: 'USDT price stays below threshold for 4 continuous hours (Chainlink)',
        oracleFeeds: ['USDT/USD'],
        premiumRange: [1.7, 7.8],
        deductiblePct: 3,
        durationRange: [14, 365],
        sustainedPeriod: '4 hours',
        thresholdOptions: ['$0.99', '$0.97', '$0.95', '$0.90'],
        expandedDetail: 'Same mechanism as USDC Depeg but with 1.3x risk multiplier. Reflects historical uncertainty about Tether reserves. Higher premium compensates LPs for the additional risk.',
    },
    {
        id: 'DEPEG-DAI-001',
        name: 'DAI Depeg Cover',
        shortName: 'DAI Depeg',
        icon: 'CircleDollarSign',
        description: 'Covers DAI if it loses its dollar peg (1.2x risk multiplier)',
        agentView: {
            tagline: 'Protection against DAI losing its peg',
            details: '1.2x risk multiplier. DAI lost parity briefly in March 2020 (Black Thursday).',
        },
        lpView: {
            tagline: "You're betting DAI won't lose its peg",
            riskDescription: 'Risk tied to MakerDAO collateral health. DAI depegged briefly in March 2020.',
            riskLevel: 'Medium',
            historicalProbability: 'Medium',
        },
        triggerType: 'PRICE_BELOW',
        triggerDescription: 'DAI price stays below threshold for 4 continuous hours (Chainlink)',
        oracleFeeds: ['DAI/USD'],
        premiumRange: [1.6, 7.2],
        deductiblePct: 3,
        durationRange: [14, 365],
        sustainedPeriod: '4 hours',
        thresholdOptions: ['$0.99', '$0.97', '$0.95', '$0.90'],
        expandedDetail: 'Same mechanism as USDC Depeg but with 1.2x risk multiplier. DAI lost parity briefly in March 2020 (Black Thursday). Risk is tied to MakerDAO collateral health.',
    },
    {
        id: 'ILPROT-001',
        name: 'IL Protection',
        shortName: 'IL Protect',
        icon: 'Scale',
        description: 'Covers excessive impermanent loss in AMM liquidity pools',
        agentView: {
            tagline: 'Protect your AMM positions from catastrophic IL',
            details: 'Covers the tail risk of extreme price divergence. 8% deductible because some IL is normal — this covers the catastrophic part.',
        },
        lpView: {
            tagline: "You're betting token prices won't diverge >X%",
            riskDescription: 'Higher risk product — price divergence in volatile pairs can be significant',
            riskLevel: 'Higher',
            historicalProbability: 'Medium-High',
        },
        triggerType: 'PRICE_DIVERGENCE',
        triggerDescription: 'Price divergence between pool assets exceeds threshold for 2 hours (Chainlink)',
        oracleFeeds: ['ETH/USD', 'BTC/USD', 'USDC/USD'],
        premiumRange: [3.5, 10],
        deductiblePct: 8,
        durationRange: [14, 60],
        sustainedPeriod: '2 hours',
        thresholdOptions: ['15%', '20%', '30%', '50%'],
        expandedDetail: 'Trigger: price divergence between pool assets exceeds threshold (15-50%) for 2 continuous hours. 8% deductible because some IL is normal — this covers the catastrophic tail.',
    },
]

// Grouped products for the product grid display (3 depeg covers grouped)
export const PRODUCT_GRID_DISPLAY = [
    PRODUCTS[0], // BTC Catastrophe Shield
    PRODUCTS[1], // ETH Apocalypse Shield
    { ...PRODUCTS[2], name: 'Stablecoin Depeg Cover', description: 'Covers USDC, USDT and DAI if they lose their dollar peg', isGroup: true },
    PRODUCTS[5], // IL Protection
] as const
