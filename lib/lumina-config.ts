// lib/lumina-config.ts
// ════════════════════════════════════════════════════════════
// LUMINA PROTOCOL — SINGLE SOURCE OF TRUTH
// ════════════════════════════════════════════════════════════
// ALL product parameters, addresses, and constants live HERE.
// Every other file in the project MUST import from this file.
// NEVER hardcode protocol data anywhere else.
// ════════════════════════════════════════════════════════════

export const CHAIN = {
  id: 8453,
  name: "Base Mainnet",
  hexId: "0x2105",
  rpc: "https://mainnet.base.org",
  explorer: "https://basescan.org",
  explorerApi: "https://api.basescan.org/api",
} as const

export const TOKENS = {
  USDC: {
    // TEST DEPLOYMENT - MockUSDC. Production will use real USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
    address: "0x8a342233cFC95F4AeB11c2855BFF1f441241E8d1" as `0x${string}`,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    issuer: "Circle",
  },
  aBasUSDC: {
    address: "0x4e65fE4DbA92790696d040bc24Aa58D91F263a70" as `0x${string}`,
    symbol: "aBasUSDC",
    name: "Aave Base USDC",
    decimals: 6,
  },
} as const

export const AAVE = {
  pool: "0xA238Dd80C259a72e81d7e4674A5471b2f0730305" as `0x${string}`,
  aToken: TOKENS.aBasUSDC.address,
} as const

export const ORACLES = {
  ETH_USD: "0x71041ddDad3595F8cEd3DcbcBE31195759958911" as `0x${string}`,
  BTC_USD: "0x45c32AEd995834F0A484FD092953258814774393" as `0x${string}`,
} as const

// CONTRACTS — TEST DEPLOYMENT on Base Mainnet (March 2026)
export const CONTRACTS = {
  CoverRouter: "0x5755af9cd293b9A0a798B7e2e816eAbE659750C0" as `0x${string}`,
  PolicyManager: "0x5B337325b854a68Cd262aa2b6fE48EBe18073902" as `0x${string}`,
  Oracle: "0x4916aC095c3B64443E87f3bc70A39146eC0B065d" as `0x${string}`,
  Phala: "0xE44a263ccBc70DC761D955A590FDdA4F7a14Ccaf" as `0x${string}`,
  vaults: {
    VolatileShort: "0xe74d19551cbB809AaDcAb568c0E150B6BF0e3354" as `0x${string}`,
    VolatileLong: "0xc0016248E171b2A20Fb0C212AB917AB7fa07502a" as `0x${string}`,
    StableShort: "0xa682DC763e6A99607797989C5F44C8aA05a8511e" as `0x${string}`,
    StableLong: "0xE5e3F6898eeecEa4245558429CBFaE9CE255C05e" as `0x${string}`,
  },
  shields: {
    BSS: "0x149e1d0474a7c212a5eAA78432863B01b98479d8" as `0x${string}`,
    Depeg: "0xaD1EB669b4a9DC6C9432B904F65B360962E1d381" as `0x${string}`,
    ILIndex: "0xc2262311eD02E9c937cBC33F34426D5D9134F6CF" as `0x${string}`,
    Exploit: "0x931427cED326eB49a3E5268b9b3e713Eb2EC5440" as `0x${string}`,
  },
} as const

// KINK MODEL — mirror of PremiumMath.sol
export const KINK_MODEL = {
  U_KINK: 0.80,       // 80% utilization
  SLOPE_BELOW: 0.5,   // 0.5x below kink
  SLOPE_ABOVE: 3.0,   // 3.0x above kink
  U_MAX: 0.95,        // 95% max utilization — rejects above this
} as const

// PRODUCTS — per actuarial specs (docs/actuarial/)
export const PRODUCTS = {
  BSS: {
    id: "BSS",
    name: "Black Swan Shield",
    pBaseBps: 650,         // 6.5% annual — tail risk (ETH -30%), ~0.5 events/year, competitive with Deribit puts
    deductibleBps: 2000,   // 20%
    riskType: "VOLATILE" as const,
    minDurationDays: 7,
    maxDurationDays: 30,
    trigger: "ETH price drops ≥30%",
    vaults: ["VolatileShort", "VolatileLong"] as const,
    excludedAssets: [] as string[],
    waitingPeriodDays: 0,
  },
  DEPEG: {
    id: "DEPEG",
    name: "Depeg Shield",
    pBaseBps: 250,         // 2.5% annual — systemic but rare (<$0.95 depeg), aligned with InsurAce market
    deductibleBps: { USDT: 1500, DAI: 1200 } as Record<string, number>,  // varies by stablecoin — per actuarial spec
    riskType: "STABLE" as const,
    minDurationDays: 14,
    maxDurationDays: 365,
    trigger: "Stablecoin loses peg below $0.95",
    vaults: ["StableShort", "StableLong"] as const,
    excludedAssets: ["USDC"],  // USDC excluded — settlement token circular risk
    allowedAssets: ["USDT", "DAI"],
    waitingPeriodDays: 1,
  },
  IL: {
    id: "IL",
    name: "IL Index Cover",
    pBaseBps: 850,         // 8.5% annual — most frequent risk, LPs lose 5-7% annually to IL
    deductibleBps: 200,    // 2%
    riskType: "VOLATILE" as const,
    minDurationDays: 14,
    maxDurationDays: 90,
    trigger: "Impermanent loss exceeds threshold",
    vaults: ["VolatileShort", "VolatileLong"] as const,
    excludedAssets: [] as string[],
    waitingPeriodDays: 0,
  },
  EXPLOIT: {
    id: "EXPLOIT",
    name: "Exploit Shield",
    pBaseBps: 400,         // 4.0% annual — binary risk, 2-5% of protocols fail, aligned with Nexus Mutual
    deductibleBps: 1000,   // 10%
    riskType: "STABLE" as const,
    minDurationDays: 90,
    maxDurationDays: 365,
    trigger: "Smart contract exploit verified by oracle",
    vaults: ["StableShort", "StableLong"] as const,
    excludedProtocols: ["Aave V3"],  // Aave excluded — vault infrastructure circular risk
    waitingPeriodDays: 14,
  },
} as const

export const VAULTS = {
  VolatileShort: {
    name: "Volatile Short",
    cooldownDays: 30,
    riskType: "VOLATILE" as const,
    riskLevel: "Higher",
    products: ["BSS", "IL"],
    worstCaseLoss: "~30%",
    normalYearProb: "85%",
  },
  VolatileLong: {
    name: "Volatile Long",
    cooldownDays: 90,
    riskType: "VOLATILE" as const,
    riskLevel: "Higher",
    products: ["BSS", "IL"],
    worstCaseLoss: "~28%",
    normalYearProb: "85%",
  },
  StableShort: {
    name: "Stable Short",
    cooldownDays: 90,
    riskType: "STABLE" as const,
    riskLevel: "Low",
    products: ["DEPEG", "EXPLOIT"],
    worstCaseLoss: "~20%",
    normalYearProb: "97%",
  },
  StableLong: {
    name: "Stable Long",
    cooldownDays: 365,
    riskType: "STABLE" as const,
    riskLevel: "Very Low",
    products: ["DEPEG", "EXPLOIT"],
    worstCaseLoss: "~25%",
    normalYearProb: "98%",
  },
} as const

export const PROTOCOL = {
  feeBps: 300,             // 3% protocol fee on premiums and payouts
  feeReceiver: "0x2b4D825417f568231e809E31B9332ED146760337" as `0x${string}`,
  claimGracePeriodHours: 24,
  maxCoverageUSD: 100_000,
  minCoverageUSD: 100,
  apiBaseUrl: "https://lumina-protocol-production.up.railway.app",
  supportEmail: "support@lumina-org.com",
  salesEmail: "labs@lumina-org.com",
  website: "https://www.lumina-org.com",
  github: "https://github.com/org-lumina/LUMINA-PROTOCOL",
} as const

// ════════════════════════════════════════════════════════════
// PREMIUM CALCULATION — mirror of PremiumMath.sol
// ════════════════════════════════════════════════════════════

export function calcKinkMultiplier(utilizationPercent: number): number {
  const { U_KINK, SLOPE_BELOW, SLOPE_ABOVE } = KINK_MODEL
  const util = utilizationPercent / 100

  if (util <= U_KINK) {
    return 1 + (util / U_KINK) * SLOPE_BELOW
  } else {
    return 1 + SLOPE_BELOW + ((util - U_KINK) / (1 - U_KINK)) * SLOPE_ABOVE
  }
}

export function calculatePremium(
  productId: keyof typeof PRODUCTS,
  coverageUSD: number,
  durationDays: number,
  utilizationPercent: number
): number {
  const product = PRODUCTS[productId]
  const multiplier = calcKinkMultiplier(utilizationPercent)
  const annualRate = product.pBaseBps / 10000
  return coverageUSD * annualRate * multiplier * (durationDays / 365)
}
