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
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,
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

// CONTRACTS — update these addresses post-deploy
export const CONTRACTS = {
  CoverRouter: "0x8407aF8a100812bFb5F9F188b44379E4268efF94" as `0x${string}`,
  PolicyManager: "0x615e9c32c70350192fCa98AC06Ba8eb49dC4fEF4" as `0x${string}`,
  Oracle: "0x2F9d3DA66FCB84F47851636d9e0921373ede2176" as `0x${string}`,
  Phala: "0xa2d461f4A7eC7089A7e414986d9d9b43514a82EC" as `0x${string}`,
  vaults: {
    VolatileShort: "0x2D7D735f71638730cbe9A143227A00Fa64E94E88" as `0x${string}`,
    VolatileLong: "0xDF30548d46e770154AdA82D3c263e81a608075c" as `0x${string}`,
    StableShort: "0x8F6e6a4Ee6aeD70757c16382eA7156AD4b33c078" as `0x${string}`,
    StableLong: "0x3e8dF8746c42Aa4B0CDb089174aBbBaf2C3aD46c" as `0x${string}`,
  },
  shields: {
    BSS: "0xC01ED8eF525068290545f08BBf9aAe5Fe59b15CF7" as `0x${string}`,
    Depeg: "0xCdA417909d43F252F63034346db91244188fE70F" as `0x${string}`,
    ILIndex: "0x73fB5CB9Aa08e8Af74a3a4b6Cfb09d3Fd66C9FB6" as `0x${string}`,
    Exploit: "0x05170F9Ca560260001064F5242c6F9F7f181c6baA" as `0x${string}`,
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
    pBaseBps: 2200,        // 22% annual — BLACKSWAN-SHIELD-ACTUARIAL-SPEC.md
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
    pBaseBps: 2400,        // 24% annual — DEPEG-SHIELD-ACTUARIAL-SPEC.md
    deductibleBps: 1000,   // 10%
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
    pBaseBps: 2000,        // 20% annual — ILPROT-ACTUARIAL-SPEC.md
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
    pBaseBps: 300,         // 3% annual — EXPLOIT-SHIELD-ACTUARIAL-SPEC.md
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
  github: "https://github.com/agustintiberio10/LUMINA-PROTOCOL",
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
