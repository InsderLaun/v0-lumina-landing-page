// lib/lumina-config.ts
// ════════════════════════════════════════════════════════════
// LUMINA PROTOCOL — SINGLE SOURCE OF TRUTH
// ════════════════════════════════════════════════════════════
// ALL product parameters, addresses, and constants live HERE.
// Every other file in the project MUST import from this file.
// NEVER hardcode protocol data anywhere else.
//
// [Audit #35 CHAIN-1] Migrated from Base Mainnet (V1/V2) to
// Base Sepolia. Currently on V5.3 (Sprint T-30c deploy 2026-05-21):
// 6 active flash products (FlashBTC × 3 + FlashETH × 3) wired
// through FlashShieldAdapter UUPS proxies. V5.1 legacy products
// (FlashBTC4h, MicroDepeg USDT, RateShock) are retired or paused
// and their address fields here retain zero placeholders so
// existing UI imports keep compiling; the user-facing surfaces
// no longer reference them. A future PR can drop the legacy keys
// entirely once all downstream imports migrate to `useShields()`
// or `lib/operate/products.ts`.
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
export const DEPLOY_BLOCK_SEPOLIA = 41_680_000n // [perf] V5.4 contracts (ClaimBond 41680286 / BondVault 41680290 / Marketplace 41680314) all deployed ~41,680,28x; was 40,775,000 (V5.0) → ~905k empty blocks scanned per load

export const TOKENS = {
  USDC: {
    // V5.4 testnet — MockUSDC (mintable, permissionless faucet)
    address: "0xD944d8e5D8329994D83950872Ec210891d3Ab6AE" as `0x${string}`, // LIVE mUSDC (Base Sepolia)
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
  // V5.4 testnet — Chainlink feeds on Base Sepolia (wired in DeployShieldsAndAdapters).
  ETH_USD: "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1" as `0x${string}`, // Chainlink ETH/USD (Base Sepolia)
  BTC_USD: "0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298" as `0x${string}`, // Chainlink BTC/USD (Base Sepolia)
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
  // ─── Canonical LIVE V5.4 (Base Sepolia), derived on-chain — see
  //     audit-pack/manifests/V5.4-canonical-deployed.json. Runtime source of
  //     truth for the user-facing 6 remains /health.contracts via useContracts();
  //     these are the static fallback (no longer zeroed). ───
  CoverRouter: "0xcdB70B40e6a3DEac3189185d947A0e458518F566" as `0x${string}`,
  PolicyManager: "0x546C07e07DeBCdbf7a2A7Ef12C38c8c8fcAFcDd8" as `0x${string}`,
  LuminaToken: "0x62C0b58bB30CA857674ec593F1e23B3F15266680" as `0x${string}`,
  ClaimBond: "0xaa57Ab52Eb00f296Ad4CFA9E9c201f3737271FB4" as `0x${string}`,
  BondVault: "0x193acBc1EdC5E565a4aBE96941C7E7AeF637B6EC" as `0x${string}`,
  Marketplace: "0x0938205f4cBe5F572656533FC930FFce6F5F4345" as `0x${string}`,
  // ─── NOT in /health, static snapshot (canonical V5.4) ───
  Oracle: "0xd52aef11ff411E9e54F7a1bB680065F158cF6545" as `0x${string}`, // CapacityOracle proxy (LIVE)
  LuminaOracleV2: "0x9bfa2f7A5098C89b8740D1694d1f716A0Bd871dD" as `0x${string}`, // EIP-712 shield oracle (non-upgradeable)
  Phala: "0x0000000000000000000000000000000000000000" as `0x${string}`, // not deployed
  BuybackEngine: "0x56B5a1115B0d9781E7358521204d927d2F80d8B4" as `0x${string}`,
  ShieldKeeper: "0x0000000000000000000000000000000000000000" as `0x${string}`, // GAP: not wired (adapter.keeper()==0x0); settlement via relayer
  TWAPBurner: "0x242d76082856901b4ba1E7c50C022D46a6941bC0" as `0x${string}`,
  TreasuryVesting: "0x0000000000000000000000000000000000000000" as `0x${string}`, // address not in canonical manifest — confirm on-chain before use
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
    // V5.3 canonical 6 flash shields + legacy zero placeholders
    FlashBTC1h:  "0x7d1615C90d01712a3b86Df26312aC6D8EFa0d0b3" as `0x${string}`, // Sprint T-30c V5.3 (2026-05-21)
    FlashBTC4h:  "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2) — not in V5.3 T-30c bundle
    FlashBTC24h: "0x18e2D3b8Ff4D194CDB9862f8e6239E5e1145961d" as `0x${string}`, // Sprint T-30c V5.3 (2026-05-21)
    FlashBTC48h: "0xe206dd8fb02b1C2A0507566c3d03a27554E8CBeB" as `0x${string}`, // Sprint T-30c V5.3 (2026-05-21)
    FlashETH1h:  "0xfF1a1B20153019C22f97278204Ccfc1b1409a518" as `0x${string}`, // Sprint T-30c V5.3 (2026-05-21)
    FlashETH24h: "0x2832b5543f6F2a055312654739F0ae03F5b0b582" as `0x${string}`, // Sprint T-30c V5.3 (2026-05-21)
    FlashETH48h: "0x60dFC6610c64aC84e12afA943737Cf7733215B75" as `0x${string}`, // Sprint T-30c V5.3 (2026-05-21)
    MicroDepeg:  "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
    RateShock:   "0x0000000000000000000000000000000000000000" as `0x${string}`, // OBSOLETE - awaiting redeploy (Sprint Z.2)
  },
  // FlashShieldAdapter UUPS proxies — one per flash shield. Sprint T-30c
  // (V5.3, deployed 2026-05-21 on Base Sepolia, deployer
  // 0xe585e76A0b8CbbC2d10b1110a9ac3F4c11dBfDa8). The adapter normalizes
  // each shield's policy lifecycle behind a stable proxy interface so the
  // landing/operate UI can wire write paths without re-fetching ABIs on
  // every shield redeploy. Static snapshot — runtime resolution can be
  // added later via /api/v1/products if the adapters get registered there.
  adapters: {
    FlashBTC1h:  "0x5d50310B9166184e822cD5368F51C1409713054f" as `0x${string}`, // Sprint T-30c V5.3 (2026-05-21)
    FlashBTC24h: "0x475b3F712707F61824122a94fE78b106260F8882" as `0x${string}`, // Sprint T-30c V5.3 (2026-05-21)
    FlashBTC48h: "0xdc6387E86F7D852D1f99F4009cFd8AdC2d500298" as `0x${string}`, // Sprint T-30c V5.3 (2026-05-21)
    FlashETH1h:  "0x57869AD3E7C56B0c96F357179DD231b407C88338" as `0x${string}`, // Sprint T-30c V5.3 (2026-05-21)
    FlashETH24h: "0x4fD09cF98F6814Cc8b33C2E491429f59d0bCf089" as `0x${string}`, // Sprint T-30c V5.3 (2026-05-21)
    FlashETH48h: "0x9696CFFD7dE8B1e16F83Dcc798c5CE69a61C884C" as `0x${string}`, // Sprint T-30c V5.3 (2026-05-21)
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
