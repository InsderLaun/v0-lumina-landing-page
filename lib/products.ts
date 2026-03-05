// ═══════════════════════════════════════════════════════════════
// LUMINA PROTOCOL — PRODUCT DATA
// 8 Parametric Insurance Products with real specifications
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
        id: 'LIQSHIELD-001',
        name: 'Liquidation Shield',
        shortName: 'Liq Shield',
        icon: 'ShieldAlert',
        description: 'Protects leveraged positions against sudden price crashes',
        agentView: {
            tagline: 'Protect leveraged positions from flash crashes',
            details: 'Your agent pays a premium and receives automatic USDC payout if ETH or BTC crashes beyond your threshold.',
        },
        lpView: {
            tagline: "You're betting ETH/BTC won't crash >X%",
            riskDescription: 'You lose collateral if a major price crash exceeds the threshold for 30+ minutes',
            riskLevel: 'Medium',
            historicalProbability: 'Medium',
        },
        triggerType: 'PRICE_DROP_PCT',
        triggerDescription: 'Price drops >X% for 30 continuous minutes (Chainlink)',
        oracleFeeds: ['ETH/USD', 'BTC/USD'],
        premiumRange: [2.5, 7],
        deductiblePct: 5,
        durationRange: [7, 90],
        sustainedPeriod: '30 min',
        thresholdOptions: ['10%', '15%', '20%', '25%', '30%'],
        expandedDetail: 'Trigger: price drops >X% for 30 continuous minutes. Works for positions on any network — measures market price, not your specific position.',
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
    {
        id: 'GASSPIKE-001',
        name: 'Gas Spike Shield',
        shortName: 'Gas Shield',
        icon: 'Flame',
        description: 'Compensates when Base L2 gas costs spike unexpectedly',
        agentView: {
            tagline: 'Protection against unexpected gas cost spikes on Base',
            details: 'Reads gas price directly from Base L2 blockchain. Triggers when gas stays above threshold for 15+ continuous minutes.',
        },
        lpView: {
            tagline: "You're betting Base L2 gas won't spike above X gwei",
            riskDescription: 'Low risk — Base L2 gas spikes are relatively rare',
            riskLevel: 'Low',
            historicalProbability: 'Low',
        },
        triggerType: 'GAS_ABOVE',
        triggerDescription: 'Gas stays above threshold for 15 continuous minutes (tx.gasprice)',
        oracleFeeds: ['Base L2 tx.gasprice'],
        premiumRange: [1.7, 5.5],
        deductiblePct: 10,
        durationRange: [7, 30],
        sustainedPeriod: '15 min',
        thresholdOptions: ['50 gwei', '100 gwei', '200 gwei', '500 gwei'],
        expandedDetail: 'Reads gas price directly from Base L2 blockchain. Trigger: gas stays above threshold (50/100/200/500 gwei) for 15 continuous minutes. Only covers Base L2, not Ethereum L1.',
    },
    {
        id: 'SLIPPAGE-001',
        name: 'Slippage Protection',
        shortName: 'Slippage',
        icon: 'TrendingDown',
        description: 'Covers excessive price movement during trade execution',
        agentView: {
            tagline: 'Protect against price movement during trade execution',
            details: 'Zero sustained period — if the price moves beyond threshold during execution, it triggers immediately.',
        },
        lpView: {
            tagline: "You're betting trades won't slip beyond X%",
            riskDescription: 'Medium risk — large trades in illiquid markets can experience significant slippage',
            riskLevel: 'Medium',
            historicalProbability: 'Medium',
        },
        triggerType: 'PRICE_DROP_PCT / PRICE_RISE_PCT',
        triggerDescription: 'Price moves >X% immediately during execution (Chainlink)',
        oracleFeeds: ['ETH/USD', 'BTC/USD'],
        premiumRange: [1.3, 7],
        deductiblePct: 3,
        durationRange: [1, 7],
        sustainedPeriod: 'Immediate',
        thresholdOptions: ['2%', '3%', '5%', '10%'],
        expandedDetail: 'Trigger: price moves >X% between when the agent decides and when the trade executes. Zero sustained period — if it happens, it triggers immediately. 30-minute cooling-off period (vs 2h for other products).',
    },
    {
        id: 'BRIDGE-001',
        name: 'Bridge Failure Cover',
        shortName: 'Bridge Cover',
        icon: 'Unlink',
        description: 'Protects against funds lost or stuck in cross-chain bridges',
        agentView: {
            tagline: 'Protection for cross-chain bridge transfers',
            details: 'AutoResolver checks Transfer events on-chain. If USDC never arrives at destination wallet within 365 days, payout is automatic.',
        },
        lpView: {
            tagline: "You're betting bridge transfers will complete successfully",
            riskDescription: 'Low risk — major bridge failures are rare but catastrophic when they happen',
            riskLevel: 'Low',
            historicalProbability: 'Low',
        },
        triggerType: 'NO_TRANSFER',
        triggerDescription: 'No Transfer event of USDC to destination wallet within 365 days',
        oracleFeeds: ['On-chain Transfer events'],
        premiumRange: [3, 3],
        deductiblePct: 5,
        durationRange: [365, 365],
        sustainedPeriod: 'N/A',
        thresholdOptions: ['N/A'],
        expandedDetail: 'AutoResolver checks Transfer events on-chain to verify if USDC arrived at destination wallet. No manual confirmation. If funds don\'t arrive in 365 days, payout is automatic.',
        badges: ['Base Bridge', 'Across', 'Stargate', 'Hop'],
    },
]

// Grouped products for the product grid display (3 depeg covers grouped)
export const PRODUCT_GRID_DISPLAY = [
    PRODUCTS[0], // Liquidation Shield
    { ...PRODUCTS[1], name: 'Stablecoin Depeg Cover', description: 'Covers USDC, USDT and DAI if they lose their dollar peg', isGroup: true },
    PRODUCTS[4], // IL Protection
    PRODUCTS[5], // Gas Spike Shield
    PRODUCTS[6], // Slippage Protection
    PRODUCTS[7], // Bridge Failure Cover
] as const
