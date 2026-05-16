// lib/lumina-config.ts
// ════════════════════════════════════════════════════════════
// LUMINA PROTOCOL — SINGLE SOURCE OF TRUTH
// ════════════════════════════════════════════════════════════
// ALL product parameters, addresses, and constants live HERE.
// Every other file in the project MUST import from this file.
// NEVER hardcode protocol data anywhere else.
//
// [Audit #35 CHAIN-1] Migrated from Base Mainnet (V1/V2) to
// Base Sepolia (V5.1, deploy 2026-04-27). The protocol shape
// also changed: V5.1 has a SINGLE BondVault (not 5 named vaults)
// and 9 shield products (FlashBTC×4 + FlashETH×3 + MicroDepeg
// + RateShock). The legacy 5-vault and 5-shield UI keys are
// kept as aliases so existing components continue to compile;
// they all point at the closest V5.1 equivalent (or BondVault
// for vault-shaped UI). A future PR should redesign the
// "My Vaults" UX around the V5.1 primitives.
// ════════════════════════════════════════════════════════════

export const CHAIN = {
  id: 84532,
  name: "Base Sepolia",
  hexId: "0x14a34",
  rpc: "https://sepolia.base.org",
  explorer: "https://sepolia.basescan.org",
  explorerApi: "https://api-sepolia.basescan.org/api",
} as const

// Earliest block we need to scan for V5.1 events. Tightened to the actual
// deploy on 2026-04-27 — ClaimBond was the first of the five core contracts,
// minted at block 40_775_247 (creation tx
// 0x6b4eac4d3d083432699c511897b21c2e49a6d3b8c6dc16f934db6add375c0616).
// Floored to 40_775_000 to leave a small margin for any contract redeployed
// in the same window. Bound by getLogsChunked so size is not a concern.
export const DEPLOY_BLOCK_SEPOLIA = 40_775_000n

export const TOKENS = {
  USDC: {
    // V5.1 testnet — MockUSDC deployed alongside the protocol
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    symbol: "USDC",
    name: "USD Coin (mock)",
    decimals: 6,
    issuer: "Lumina (mock for V5.1 testnet)",
  },
  aBasUSDC: {
    // V5.1 testnet has no Aave integration; placeholder pointing at MockUSDC
    // so any UI reading TOKENS.aBasUSDC still type-checks.
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    symbol: "aBasUSDC",
    name: "Aave Base USDC (mock)",
    decimals: 6,
  },
} as const

export const AAVE = {
  // V5.1 has no Aave integration. The pool field is set to the zero address
  // sentinel; any UI relying on AAVE.pool should fall back to "not available".
  pool: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  aToken: TOKENS.aBasUSDC.address,
} as const

export const ORACLES = {
  // V5.1 testnet uses MockChainlinkOracle for ETH and BTC feeds.
  ETH_USD: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
  BTC_USD: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
} as const

// CONTRACTS — V5.1 on Base Sepolia (chainId 84532).
//
// ⚠️ DEPRECATED for client components. Prefer `useContracts()` from
// `hooks/use-contracts.ts` (and `useShields()` from `hooks/use-shields.ts`)
// which fetch `/health` and `/api/v1/products` at runtime so a
// redeploy never desyncs the UI from canonical state.
//
// This object is now a LIVE snapshot at 2026-05-07. The 6 keys mirrored
// from `/health.contracts` (CoverRouter, PolicyManager, BondVault,
// ClaimBond, Marketplace, LuminaToken; plus USDC via TOKENS.USDC.address)
// match the live registry. The remaining keys (Oracle, LuminaOracleV2,
// Phala, BuybackEngine, ShieldKeeper, TWAPBurner, TreasuryVesting) are
// not exposed via `/health` and are static references verified against
// `org-lumina/LUMINA-PROTOCOL` deployment scripts.
//
// All shield addresses (the `shields` and `vaults` aliases) are now
// LIVE V5.1 from `/api/v1/products`; for runtime resolution use
// `useShields()` instead.
export const CONTRACTS = {
  // ─── Mirrored from /health.contracts (use useContracts() in client) ───
  CoverRouter: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
  PolicyManager: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
  LuminaToken: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
  ClaimBond: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
  BondVault: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
  Marketplace: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
  // ─── NOT in /health, static snapshot ───
  Oracle: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2) — CapacityOracle proxy
  // LuminaOracleV2 — real EIP-712 shield oracle, deployed 2026-05-04.
  // The 9 V5.1 shields were rebound to this address via UUPS upgrade
  // in PR org-lumina/LUMINA-PROTOCOL#101. See docs/architecture/ORACLE-V2.md.
  LuminaOracleV2: "0x0000000000000000000000000000000000000000" as `0x${string}`, // SPRINT_Z2: cleared pre-redeploy
  Phala: "0x0000000000000000000000000000000000000000" as `0x${string}`, // not deployed in V5.1 testnet
  BuybackEngine: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
  ShieldKeeper: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
  TWAPBurner: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
  TreasuryVesting: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
  // V5.1 has a SINGLE BondVault. The legacy 5-vault keys below all alias
  // BondVault so existing UI components compile; the "My Vaults" tab
  // needs a redesign to expose V5.1's actual primitives.
  vaults: {
    VolatileShort: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    VolatileLong:  "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    StableShort:   "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    StableLong:    "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    FlashVault:    "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
  },
  // V5.1 shield addresses (LIVE from /api/v1/products at 2026-05-07).
  // For runtime resolution use `useShields()` from `hooks/use-shields.ts`.
  // Legacy semantic aliases (BCS/EAS/Depeg/ILIndex/Exploit) point at the
  // closest V5.1 product so existing UI keeps resolving.
  shields: {
    // Legacy aliases → closest V5.1 match
    BCS:     "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2) — → FLASHBTC48-001
    EAS:     "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2) — → FLASHETH48-001
    Depeg:   "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2) — → MICRODEPEG-001
    ILIndex: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2) — → RATESHOCK-001 (closest)
    Exploit: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2) — → RATESHOCK-001
    // V5.1 canonical 9 shields
    FlashBTC1h:  "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    FlashBTC4h:  "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    FlashBTC24h: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    FlashBTC48h: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    FlashETH1h:  "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    FlashETH24h: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    FlashETH48h: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    MicroDepeg:  "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    RateShock:   "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
  },
  // EmergencyPause / TimelockController / GnosisSafe are not deployed in V5.1
  // testnet per protocol policy ("NO TimelockController in any deploy" — see
  // org-lumina/LUMINA-PROTOCOL fix/v5.1-relayer-payment-flow PR description).
  // Set to zero address sentinels so UI references resolve without throwing.
  EmergencyPause: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  TimelockController: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  GnosisSafe: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2) — V5.1 testnet "multisig" was the deployer EOA
} as const

// V5.1 lumina-api endpoint (public read + agent-key write surface).
export const LUMINA_API_URL = "https://lumina-api-production-ac85.up.railway.app" as const

// KINK MODEL — mirror of PremiumMath.sol
export const KINK_MODEL = {
  U_KINK: 0.80,       // 80% utilization
  SLOPE_BELOW: 0.5,   // 0.5x below kink
  SLOPE_ABOVE: 3.0,   // 3.0x above kink
  U_MAX: 0.95,        // 95% max utilization — rejects above this
} as const

// PRODUCTS — per actuarial specs (docs/actuarial/)
export const PRODUCTS = {
  BCS: {
    id: "BCS",
    name: "BTC Catastrophe Shield",
    pBaseBps: 1500,        // 15% annual — tail risk (BTC -50%), recalibrated 2026-04-06 post BSS split
    deductibleBps: 2000,   // 20%
    riskType: "VOLATILE" as const,
    minDurationDays: 7,
    maxDurationDays: 30,
    trigger: "BTC price drops ≥50%",
    vaults: ["VolatileShort", "VolatileLong"] as const,
    excludedAssets: [] as string[],
    waitingPeriodDays: 0, // Effective: 1 hour (3600s) anti-front-running — enforced on-chain, not in days
  },
  EAS: {
    id: "EAS",
    name: "ETH Apocalypse Shield",
    pBaseBps: 2000,        // 20% annual — tail risk (ETH -60%), recalibrated 2026-04-06 post BSS split
    deductibleBps: 2000,   // 20%
    riskType: "VOLATILE" as const,
    minDurationDays: 7,
    maxDurationDays: 30,
    trigger: "ETH price drops ≥60%",
    vaults: ["VolatileShort", "VolatileLong"] as const,
    excludedAssets: [] as string[],
    waitingPeriodDays: 0, // Effective: 1 hour (3600s) anti-front-running — enforced on-chain, not in days
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
  FLASH_BTC: {
    id: "FLASH-BTC",
    name: "Flash BTC",
    pBaseBps: 11300,       // default to 24h rate
    deductibleBps: 2000,   // 20%
    riskType: "VOLATILE" as const,
    minDurationDays: 1,
    maxDurationDays: 2,
    trigger: "BTC flash crash >18% (24h) or >22% (48h)",
    vaults: ["FlashVault"] as const,
    excludedAssets: [] as string[],
    waitingPeriodDays: 0,
    durations: [
      { seconds: 86400, label: "24h", trigger: "-18%", pBaseBps: 11300 },
      { seconds: 172800, label: "48h", trigger: "-22%", pBaseBps: 8250 },
    ],
  },
  FLASH_ETH: {
    id: "FLASH-ETH",
    name: "Flash ETH",
    pBaseBps: 11300,       // default to 24h rate
    deductibleBps: 2000,   // 20%
    riskType: "VOLATILE" as const,
    minDurationDays: 1,
    maxDurationDays: 2,
    trigger: "ETH flash crash >20% (24h) or >28% (48h)",
    vaults: ["FlashVault"] as const,
    excludedAssets: [] as string[],
    waitingPeriodDays: 0,
    durations: [
      { seconds: 86400, label: "24h", trigger: "-20%", pBaseBps: 11300 },
      { seconds: 172800, label: "48h", trigger: "-28%", pBaseBps: 8250 },
    ],
  },
} as const

export const VAULTS = {
  VolatileShort: {
    name: "Volatile Short",
    cooldownDays: 37,
    riskType: "VOLATILE" as const,
    riskLevel: "Higher",
    products: ["BCS", "EAS", "IL"],
    worstCaseLoss: "~30%",
    normalYearProb: "85%",
  },
  VolatileLong: {
    name: "Volatile Long",
    cooldownDays: 97,
    riskType: "VOLATILE" as const,
    riskLevel: "Higher",
    products: ["BCS", "EAS", "IL"],
    worstCaseLoss: "~28%",
    normalYearProb: "85%",
  },
  StableShort: {
    name: "Stable Short",
    cooldownDays: 97,
    riskType: "STABLE" as const,
    riskLevel: "Low",
    products: ["DEPEG", "EXPLOIT"],
    worstCaseLoss: "~20%",
    normalYearProb: "97%",
  },
  StableLong: {
    name: "Stable Long",
    cooldownDays: 372,
    riskType: "STABLE" as const,
    riskLevel: "Very Low",
    products: ["DEPEG", "EXPLOIT"],
    worstCaseLoss: "~25%",
    normalYearProb: "98%",
  },
  FlashVault: {
    name: "Flash Vault",
    cooldownDays: 7,
    riskType: "VOLATILE" as const,
    riskLevel: "Higher",
    products: ["FLASH_BTC", "FLASH_ETH"],
    worstCaseLoss: "~35%",
    normalYearProb: "80%",
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
