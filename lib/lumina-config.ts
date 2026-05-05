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
    address: "0x63D340AE7229BB464bC801f225651341ebcD3693" as `0x${string}`,
    symbol: "USDC",
    name: "USD Coin (mock)",
    decimals: 6,
    issuer: "Lumina (mock for V5.1 testnet)",
  },
  aBasUSDC: {
    // V5.1 testnet has no Aave integration; placeholder pointing at MockUSDC
    // so any UI reading TOKENS.aBasUSDC still type-checks.
    address: "0x63D340AE7229BB464bC801f225651341ebcD3693" as `0x${string}`,
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
  ETH_USD: "0x2a370A7dAE38aF7EECA20C9438Bd5154889cdc5e" as `0x${string}`,
  BTC_USD: "0x2aDC8718F0b7Efb18a07aBc7595F1364730bb99E" as `0x${string}`,
} as const

// CONTRACTS — V5.1 on Base Sepolia (chainId 84532), deploy 2026-04-27.
// Documented in org-lumina/LUMINA-PROTOCOL deployments/sepolia/V5.1-2026-04-27.json.
export const CONTRACTS = {
  CoverRouter: "0x60447F880Fad94fe1E17DBe9A0Cb39923bC9f316" as `0x${string}`,
  PolicyManager: "0x04f94Bc24aAA87aDFA643EE1e55a35C683f30804" as `0x${string}`,
  Oracle: "0xe935806729Df8C95f3E8ab4e8D92FA29ad9B2867" as `0x${string}`, // CapacityOracle proxy
  // LuminaOracleV2 — real EIP-712 shield oracle, deployed 2026-05-04.
  // Replaces the deprecated MockShieldOracle (0xaB7F63d1F10168880F36Ec8b7D2d74f30ccC800c)
  // which lacked verifyPriceProofEIP712. The 9 V5.1 shields were rebound to
  // this address via UUPS upgrade in PR org-lumina/LUMINA-PROTOCOL#101.
  // See docs/architecture/ORACLE-V2.md in the protocol repo.
  LuminaOracleV2: "0x8cAbC4645a3981FF59d39328f9F65FdFD19Bd194" as `0x${string}`,
  Phala: "0x0000000000000000000000000000000000000000" as `0x${string}`, // not deployed in V5.1 testnet
  // V5.1-only top-level contracts (new shape).
  LuminaToken: "0x17db45491561F7538e4E14449DCC34799758465D" as `0x${string}`,
  ClaimBond: "0x5304f6732a51995651f1B666525CFeC5Af74A541" as `0x${string}`,
  BondVault: "0x1747CDA7F84BEc4f2002ff0dcdb3c51c1C02cf6A" as `0x${string}`,
  BuybackEngine: "0x5a74f8A6A11679b12aDAE479C686880CCf8720b3" as `0x${string}`,
  Marketplace: "0x863A7fB4A676106db4b03449b01AC5615c6C9D51" as `0x${string}`,
  ShieldKeeper: "0xB5dE54F34deC8309bD8C1B8c1eF854C88D386Bca" as `0x${string}`,
  TWAPBurner: "0x357BAF511383be70d1F3A5de7D3b07561Eec7d99" as `0x${string}`,
  TreasuryVesting: "0xC647E8D8daFeC1Ac1B8e039Cf78F27A023393354" as `0x${string}`,
  // [Audit #35 CHAIN-1] V5.1 has a SINGLE BondVault, not 5 named vaults.
  // The legacy keys below all point at BondVault so existing UI components
  // compile; they will display identical data. The "My Vaults" tab needs a
  // redesign to expose what V5.1 actually exposes (single vault, ClaimBond
  // NFT issuance on policy trigger, redemption at maturity).
  vaults: {
    VolatileShort: "0x1747CDA7F84BEc4f2002ff0dcdb3c51c1C02cf6A" as `0x${string}`,
    VolatileLong: "0x1747CDA7F84BEc4f2002ff0dcdb3c51c1C02cf6A" as `0x${string}`,
    StableShort: "0x1747CDA7F84BEc4f2002ff0dcdb3c51c1C02cf6A" as `0x${string}`,
    StableLong: "0x1747CDA7F84BEc4f2002ff0dcdb3c51c1C02cf6A" as `0x${string}`,
    FlashVault: "0x1747CDA7F84BEc4f2002ff0dcdb3c51c1C02cf6A" as `0x${string}`,
  },
  // [Audit #35 CHAIN-1] V5.1 shields. Legacy keys (BCS/EAS/Depeg/ILIndex/Exploit)
  // are aliased to the closest V5.1 product so existing UI components still
  // resolve. New V5.1-only keys (FlashBTC1H, FlashBTC4H, FlashETH1H) are added.
  shields: {
    // Legacy aliases → V5.1 closest match
    BCS: "0xf2D3Fe86Ad8BB96600bB5fdF21159bb6255e95f2" as `0x${string}`, // → FlashBTC48H
    EAS: "0xcCbE9CCCD887D67f4bfD833c2431DD2B4e1f864D" as `0x${string}`, // → FlashETH48H
    Depeg: "0x06DF0608c7256c8Df0723538574Babad1a7fd53d" as `0x${string}`, // → MicroDepeg
    ILIndex: "0x7287E55380ee877279ef2e390e2528F772e7Da2f" as `0x${string}`, // → RateShock (closest semantic)
    Exploit: "0x7287E55380ee877279ef2e390e2528F772e7Da2f" as `0x${string}`, // → RateShock
    FlashBTC24h: "0xAc53Bf7Bb85Fcfb6d3c831F3AD9f6f79ebeeF99f" as `0x${string}`,
    FlashBTC48h: "0xf2D3Fe86Ad8BB96600bB5fdF21159bb6255e95f2" as `0x${string}`,
    FlashETH24h: "0x6D6E250bc936D92F64d70262d14D6b020107Ee26" as `0x${string}`,
    FlashETH48h: "0xcCbE9CCCD887D67f4bfD833c2431DD2B4e1f864D" as `0x${string}`,
    // V5.1-only additions — UI may surface these as new product cards.
    FlashBTC1h: "0x77c2A7cA53ED5cbDe66cE220647d2c213133f2a9" as `0x${string}`,
    FlashBTC4h: "0xb5b21f7c02C15B5D73e63538BC917825Ebcb8122" as `0x${string}`,
    FlashETH1h: "0xa63237a0fd57443D73F9ED36CBE15E2792D4a170" as `0x${string}`,
    MicroDepeg: "0x06DF0608c7256c8Df0723538574Babad1a7fd53d" as `0x${string}`,
    RateShock: "0x7287E55380ee877279ef2e390e2528F772e7Da2f" as `0x${string}`,
  },
  // EmergencyPause / TimelockController / GnosisSafe are not deployed in V5.1
  // testnet per protocol policy ("NO TimelockController in any deploy" — see
  // org-lumina/LUMINA-PROTOCOL fix/v5.1-relayer-payment-flow PR description).
  // Set to zero address sentinels so UI references resolve without throwing.
  EmergencyPause: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  TimelockController: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  GnosisSafe: "0xe585e76A0b8CbbC2d10b1110a9ac3F4c11dBfDa8" as `0x${string}`, // V5.1 testnet "multisig" is the deployer EOA
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
