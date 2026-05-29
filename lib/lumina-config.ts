// lib/lumina-config.ts
// ════════════════════════════════════════════════════════════
// LUMINA PROTOCOL — SINGLE SOURCE OF TRUTH
// ════════════════════════════════════════════════════════════
// ALL product parameters, addresses, and constants live HERE.
// Every other file in the project MUST import from this file.
// NEVER hardcode protocol data anywhere else.
//
// [Mainnet migration 2026-05-29] V5.4 went LIVE on Base mainnet
// (chainId 8453) on 2026-05-28. 19 core contracts + 6 Phase C
// adapter proxies are deployed. 6 active flash products
// (FlashBTC × 3 + FlashETH × 3) wired through FlashShieldAdapter
// UUPS proxies and registered on PolicyManagerV2. V5.1 legacy
// products (FlashBTC4h, MicroDepeg USDT, RateShock) were retired
// and are NOT registered on mainnet. The Sepolia deploy lives on
// at /sandbox/* for wallet-less integration testing only.
// ════════════════════════════════════════════════════════════

export const CHAIN = {
  id: 8453,
  name: "Base",
  hexId: "0x2105",
  rpc: "https://mainnet.base.org",
  explorer: "https://basescan.org",
  explorerApi: "https://api.basescan.org/api",
} as const

// Earliest block we need to scan for V5.4 mainnet events. The Complete
// deploy wrapper landed at block 46_608_317 on 2026-05-28; floor to
// 46_608_000 for a small margin. Bound by getLogsChunked so size is not a
// concern. Renamed from DEPLOY_BLOCK_MAINNET — old name kept as alias for
// backward compat during the cutover, remove after this PR is in main.
export const DEPLOY_BLOCK_MAINNET = 46_608_000n

export const TOKENS = {
  USDC: {
    // V5.4 mainnet — Circle USDC, canonical Base mainnet address.
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    issuer: "Circle",
  },
  aBasUSDC: {
    // Aave V3 base aUSDC. CapacityOracle reads this via FounderVesting Path 1
    // condition C (Aave V3 USDC borrow rate). Address pinned to live Base
    // mainnet aBasUSDC.
    address: "0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB" as `0x${string}`,
    symbol: "aBasUSDC",
    name: "Aave Base USDC",
    decimals: 6,
  },
} as const

export const AAVE = {
  // Aave V3 Pool on Base mainnet. Consumed by FounderVesting (PATH 1 C).
  pool: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5" as `0x${string}`,
  aToken: TOKENS.aBasUSDC.address,
} as const

export const ORACLES = {
  // V5.4 mainnet — Chainlink BTC/USD + ETH/USD on Base mainnet, wired into
  // each shield at deploy (DeployPhaseC).
  ETH_USD: "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70" as `0x${string}`, // Chainlink ETH/USD (Base mainnet)
  BTC_USD: "0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F" as `0x${string}`, // Chainlink BTC/USD (Base mainnet)
} as const

// CONTRACTS — V5.4 on Base mainnet (chainId 8453).
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
  // ─── Canonical LIVE V5.4 mainnet (Base 8453), derived from the
  //     DeployLuminaV5Mainnet broadcast manifest at 2026-05-28. Runtime
  //     source of truth for the 6 user-facing remains /health.contracts via
  //     useContracts(); these are the static fallback. ───
  CoverRouter:   "0x7A49B31DC3540E037cdCEb95765eD46f6a515aa2" as `0x${string}`,
  PolicyManager: "0x8c20dfE07a5679b8DE8376361Bc9f63eD081C268" as `0x${string}`,
  LuminaToken:   "0xa35766202444d1d3D6d09Cf687B29D3C2632223C" as `0x${string}`,
  ClaimBond:     "0x8203435Bc108FaBE1beB1fe40F66a7C8B42529F1" as `0x${string}`,
  BondVault:     "0x1C50d05eEF138aAa9df22a001db4a75343a604E4" as `0x${string}`,
  Marketplace:   "0xfB3ec1B507DE8a7dB50691a26f872360F0EF71AB" as `0x${string}`,
  // ─── NOT in /health, static snapshot (V5.4 mainnet) ───
  Oracle:         "0x4dFbb04b60d41A6B5693c7181d0a7Cc43d82e8E3" as `0x${string}`, // CapacityOracle proxy (LIVE mainnet)
  LuminaOracleV2: "0x191Be3f976CC7471aE2cc4001e92611BA0De1bef" as `0x${string}`, // EIP-712 shield oracle
  Phala:          "0x0000000000000000000000000000000000000000" as `0x${string}`, // not deployed
  BuybackEngine:  "0x558F1675c10650A027e68BE33F8C5F290d8Ea307" as `0x${string}`,
  ShieldKeeper:   "0x8F43fB0C7F7F3A26D9631c1f430b08CF9C6879c3" as `0x${string}`, // mainnet has it wired
  TWAPBurner:     "0x99AA64806b680AbEB073Eb2171bda138a5D52b58" as `0x${string}`,
  TreasuryVesting: "0x745f4a9b77b5cCaF4B418ee1e5e1865Bfe088B75" as `0x${string}`,
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
    // V5.4 mainnet — productShield() returns the ADAPTER proxy, which is
    // what the SDK and PolicyManager target. The underlying drop-math
    // shield contracts are reachable via adapter.shield() but the UI does
    // not need them directly. Keys mirror the adapter addresses below.
    FlashBTC1h:  "0xA6A82271c1f19CfB53BbD12D4396f25051f8f563" as `0x${string}`, // mainnet 2026-05-28
    FlashBTC4h:  "0x0000000000000000000000000000000000000000" as `0x${string}`, // RETIRED — not registered on mainnet
    FlashBTC24h: "0xE62881cB4563b0508c698fA8a1efCc439c4c382D" as `0x${string}`, // mainnet 2026-05-28
    FlashBTC48h: "0x8Ee1662604440F70fc52c87354Fc5D145940EB52" as `0x${string}`, // mainnet 2026-05-28
    FlashETH1h:  "0xd51ae78C64C8fC93D80D58aA054c0B3AEfff3030" as `0x${string}`, // mainnet 2026-05-28
    FlashETH24h: "0x4932996761e78899d70Aa672859E23090ccDBbB0" as `0x${string}`, // mainnet 2026-05-28
    FlashETH48h: "0x9b4DFA1E1a5E79cF357470521c480710db229491" as `0x${string}`, // mainnet 2026-05-28
    MicroDepeg:  "0x0000000000000000000000000000000000000000" as `0x${string}`, // RETIRED (no reliable USDT Chainlink feed on Sepolia at T-30c)
    RateShock:   "0x0000000000000000000000000000000000000000" as `0x${string}`, // RETIRED — not registered on mainnet
  },
  // FlashShieldAdapter UUPS proxies — one per flash shield. Mainnet (V5.4)
  // deployed 2026-05-28 by 0x130377f9dE9f0134Fa82e24273C0225fB23B9040 via
  // DeployLuminaV5Mainnet wrapper (PR #187 / ADR-027). The adapter
  // normalizes each shield's policy lifecycle behind a stable proxy
  // interface so the landing/operate UI can wire write paths without
  // re-fetching ABIs on every shield redeploy. These addresses ARE what
  // PolicyManagerV2.productShield(productId) returns.
  adapters: {
    FlashBTC1h:  "0xA6A82271c1f19CfB53BbD12D4396f25051f8f563" as `0x${string}`, // mainnet 2026-05-28
    FlashBTC24h: "0xE62881cB4563b0508c698fA8a1efCc439c4c382D" as `0x${string}`, // mainnet 2026-05-28
    FlashBTC48h: "0x8Ee1662604440F70fc52c87354Fc5D145940EB52" as `0x${string}`, // mainnet 2026-05-28
    FlashETH1h:  "0xd51ae78C64C8fC93D80D58aA054c0B3AEfff3030" as `0x${string}`, // mainnet 2026-05-28
    FlashETH24h: "0x4932996761e78899d70Aa672859E23090ccDBbB0" as `0x${string}`, // mainnet 2026-05-28
    FlashETH48h: "0x9b4DFA1E1a5E79cF357470521c480710db229491" as `0x${string}`, // mainnet 2026-05-28
  },
  // V5.4 mainnet: admin roles + Ownable owners are held by a Gnosis Safe.
  // EmergencyPause / TimelockController not deployed (per protocol policy).
  EmergencyPause: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  TimelockController: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  GnosisSafe: "0xa9aE612fD97f5e33B5829d16B6408ebD8422C783" as `0x${string}`, // Safe 1.4.1 on Base mainnet — admin of all UUPS proxies + AccessControl roles
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

// ⚠️ DEPRECATED / LEGACY (pre-V5.3) — NOT user-facing. These entries (BCS / EAS /
// DEPEG / IL / EXPLOIT and any non-canonical FLASH thresholds) describe the old
// vault-era product set and do NOT match the live V5.4 catalog (6 flash shields:
// FLASHBTC/ETH × 1h/24h/48h — BTC 2.5/6/10%, ETH 4/8.5/14%). The rendered product
// list comes from `components/lumina/redesign/Products.tsx` + `operate/products.ts`,
// not this object. Kept ONLY because `lib/pricing.ts` still references PRODUCTS.BCS/
// .EAS keys; fully removing it requires refactoring lib/pricing.ts (tracked separately).
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
  feeReceiver: "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - Sprint Z.2 cleanup, awaiting redeploy (was 0x2b4D825417f568231e809E31B9332ED146760337)
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
