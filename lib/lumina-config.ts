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
    // PRODUCTION - Real USDC on Base L2
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    issuer: "Circle",
  },
  aBasUSDC: {
    address: "0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB" as `0x${string}`,
    symbol: "aBasUSDC",
    name: "Aave Base USDC",
    decimals: 6,
  },
} as const

export const AAVE = {
  pool: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5" as `0x${string}`,
  aToken: TOKENS.aBasUSDC.address,
} as const

export const ORACLES = {
  ETH_USD: "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70" as `0x${string}`,
  BTC_USD: "0xCCADC697c55bbB68dc5bCdf8d3CBe83CdD4E071E" as `0x${string}`,
} as const

// CONTRACTS — PRODUCTION on Base Mainnet (March 2026)
export const CONTRACTS = {
  CoverRouter: "0xd5f8678A0F2149B6342F9014CCe6d743234Ca025" as `0x${string}`,
  PolicyManager: "0xCCA07e06762222AA27DEd58482DeD3d9a7d0162a" as `0x${string}`,
  Oracle: "0xB52BB8B09Df13dB2D244746688C14A720ceE4C09" as `0x${string}`,
  Phala: "0x468b9D2E9043c80467B610bC290b698ae23adb9B" as `0x${string}`,
  vaults: {
    VolatileShort: "0xbd44547581b92805aAECc40EB2809352b9b2880d" as `0x${string}`,
    VolatileLong: "0xFee5d6DAdA0A41407e9EA83d4F357DA6214Ff904" as `0x${string}`,
    StableShort: "0x429b6d7d6a6d8A62F616598349Ef3C251e2d54fC" as `0x${string}`,
    StableLong: "0x1778240E1d69BEBC8c0988BF1948336AA0Ea321c" as `0x${string}`,
  },
  shields: {
    BSS: "0x54CDc21DEDA49841513a6a4A903dc0A0a9e7844e" as `0x${string}`,
    Depeg: "0x71DBcE71AA36370f7357F6D8E0c8ba96343C8306" as `0x${string}`,
    ILIndex: "0x4196f2Cc92C5c4141a34f9a28f23236446E3C4E0" as `0x${string}`,
    Exploit: "0xaE29Fc3e5f0DedC968cE2dA2A2F3ccB98397b38C" as `0x${string}`,
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
  feeBps: 300,             // 3% protocol fee on premiums, payouts, and vault performance
  performanceFeeBps: 300,  // 3% on positive yield at vault withdrawal
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
