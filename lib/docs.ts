// Curated documentation catalog for /docs page.
// All paths verified against post-merge state of:
//   - org-lumina/LUMINA-PROTOCOL  (V5.3 on Base Sepolia: 6 Flash shields
//                                   behind FlashShieldAdapter (UUPS) over
//                                   BaseFlashShield slim, PolicyManagerV2
//                                   routes through adapters)
//   - org-lumina/lumina-api        (V5.3: runtime address resolution
//                                   via /health; @lumina-org/sdk@0.6.0)
// Whitepaper docs are intentionally excluded — they live on /whitepaper.

export type DocCategory =
  | 'getting-started'
  | 'agents'
  | 'source'
  | 'contracts'
  | 'security'
  | 'deployment'
  | 'governance'
  | 'economics'
  | 'roadmap'
  | 'historical'

export type DocRepo = 'lumina-api' | 'LUMINA-PROTOCOL' | 'v0-lumina-landing-page'

export type DocBadge = 'new' | 'deprecated' | 'historical'

export interface DocEntry {
  title: string
  description: string
  repo: DocRepo
  path: string
  category: DocCategory
  badge?: DocBadge
}

export const REPO_URLS: Record<DocRepo, string> = {
  'lumina-api': 'https://github.com/org-lumina/lumina-api',
  'LUMINA-PROTOCOL': 'https://github.com/org-lumina/LUMINA-PROTOCOL',
  'v0-lumina-landing-page': 'https://github.com/org-lumina/v0-lumina-landing-page',
}

export const ORG_GITHUB_URL = 'https://github.com/org-lumina'

export const REPO_CARDS = [
  {
    name: 'LUMINA-PROTOCOL',
    description: 'Smart contracts (Foundry / Solidity)',
    url: REPO_URLS['LUMINA-PROTOCOL'],
  },
  {
    name: 'lumina-api',
    description: 'Backend API (Node.js / Express)',
    url: REPO_URLS['lumina-api'],
  },
  {
    name: 'v0-lumina-landing-page',
    description: 'Frontend (Next.js)',
    url: REPO_URLS['v0-lumina-landing-page'],
  },
] as const

export const CATEGORIES: {
  id: DocCategory
  label: string
  emoji: string
  description: string
}[] = [
  { id: 'getting-started', label: 'Getting Started', emoji: '🚀', description: 'First steps and quick guides for users, developers, and AI agents' },
  { id: 'agents', label: 'For AI Agents', emoji: '🤖', description: 'Integration guides and skill files for autonomous agents' },
  { id: 'source', label: 'Smart Contracts (source)', emoji: '📜', description: 'Every deployed Solidity file on GitHub — token, bonds, shields, oracles, marketplace' },
  { id: 'contracts', label: 'Architecture & Integrations', emoji: '🔐', description: 'How the contracts connect — integration maps, Aave dependency, audit deep-dives' },
  { id: 'security', label: 'Security & Audits', emoji: '🛡️', description: 'Security model, audit reports, threat analysis' },
  { id: 'deployment', label: 'Deployment', emoji: '🚢', description: 'Deploy checklists, env config, mainnet runbooks' },
  { id: 'governance', label: 'Governance & Operations', emoji: '⚖️', description: 'Roles, access control, multisig policies, incident response' },
  { id: 'economics', label: 'Tokenomics & Economics', emoji: '📊', description: 'Token distribution, burn mechanics, premium math, vesting' },
  { id: 'roadmap', label: 'Roadmap', emoji: '🗺️', description: 'Future plans and milestones' },
  { id: 'historical', label: 'Historical', emoji: '📜', description: 'Changelog and deprecated references — clearly marked' },
]

export function buildDocUrl(entry: DocEntry): string {
  return `${REPO_URLS[entry.repo]}/blob/main/${entry.path}`
}

export function docsByCategory(category: DocCategory): DocEntry[] {
  return DOCS.filter((d) => d.category === category)
}

// ────────────────────────────────────────────────────────────────
// V5.3 deployment on Base Sepolia (chain 84532).
// Shield adapters were redeployed in V5.3 (PolicyManagerV2 →
// FlashShieldAdapter (UUPS) → BaseFlashShield slim). Core V5.2
// contracts continue to back the system — no redeploy.
// Authoritative source of truth for consumers that render the docs
// page; UI components SHOULD NOT hardcode addresses elsewhere.
// ────────────────────────────────────────────────────────────────

export interface V53Address {
  label: string
  address: `0x${string}`
  note?: string
}

export const V53_NETWORK = {
  name: 'Base Sepolia',
  chainId: 84532,
  explorer: 'https://sepolia.basescan.org',
} as const

// One FlashShieldAdapter (UUPS) per shield — 6 total on V5.3.
export const V53_FLASH_ADAPTERS: V53Address[] = [
  { label: 'FlashBTC1h_Adapter',  address: '0x5d50310B9166184e822cD5368F51C1409713054f', note: 'Trigger BTC -2.5% / 1h' },
  { label: 'FlashBTC24h_Adapter', address: '0x475b3F712707F61824122a94fE78b106260F8882', note: 'Trigger BTC -6% / 24h' },
  { label: 'FlashBTC48h_Adapter', address: '0xdc6387E86F7D852D1f99F4009cFd8AdC2d500298', note: 'Trigger BTC -10% / 48h' },
  { label: 'FlashETH1h_Adapter',  address: '0x57869AD3E7C56B0c96F357179DD231b407C88338', note: 'Trigger ETH -4% / 1h' },
  { label: 'FlashETH24h_Adapter', address: '0x4fD09cF98F6814Cc8b33C2E491429f59d0bCf089', note: 'Trigger ETH -8.5% / 24h' },
  { label: 'FlashETH48h_Adapter', address: '0x9696CFFD7dE8B1e16F83Dcc798c5CE69a61C884C', note: 'Trigger ETH -14% / 48h' },
]

// Core V5.2 contracts — reused unchanged by V5.3.
export const V53_CORE: V53Address[] = [
  { label: 'LuminaTokenV2',          address: '0x62C0b58bB30CA857674ec593F1e23B3F15266680' },
  { label: 'BondVault',              address: '0x193acBc1EdC5E565a4aBE96941C7E7AeF637B6EC', note: 'Throttle 1.08%/week, FIFO per epoch' },
  { label: 'ClaimBond',              address: '0xaa57Ab52Eb00f296Ad4CFA9E9c201f3737271FB4' },
  { label: 'CoverRouter',            address: '0xcdB70B40e6a3DEac3189185d947A0e458518F566' },
  { label: 'PolicyManager (proxy)',  address: '0x546C07e07DeBCdbf7a2A7Ef12C38c8c8fcAFcDd8', note: 'Sprint Cleanup impl 0xdE41D414eD191A1090546078DF8e120c196Be22F' },
  { label: 'FounderVesting',         address: '0xfF4Db529bBCd4E3CC091E07b7845241EB4762832', note: 'V2 — 3 unlock paths' },
  { label: 'LuminaOracleV2',         address: '0x9bfa2f7A5098C89b8740D1694d1f716A0Bd871dD' },
  { label: 'TWAPBurner',             address: '0x242d76082856901b4ba1E7c50C022D46a6941bC0' },
  { label: 'AdaptiveFeeDistributor', address: '0xeC7841A4a9ecfb8cA58391E233A645B021c59D54', note: 'Split 85/8/2/5 (Burn/Buyback/Operations/Maintenance)' },
  { label: 'BuybackEngine',          address: '0x56B5a1115B0d9781E7358521204d927d2F80d8B4' },
  { label: 'Marketplace',            address: '0x0938205f4cBe5F572656533FC930FFce6F5F4345' },
]

// Off-chain surface — the SDK resolves addresses at runtime via /health,
// so consumers should not pin contract addresses in their own code.
export const V53_API = {
  baseUrl: 'https://lumina-api-production-ac85.up.railway.app',
  sdkPackage: '@lumina-org/sdk',
  sdkVersion: '0.6.0',
  sdkRegistry: 'https://www.npmjs.com/package/@lumina-org/sdk',
} as const

// Shield product semantics — single source of truth for the 6 active products.
export const V53_PRODUCTS = [
  { id: 'flash-btc-1h',  asset: 'BTC', window: '1h',  trigger: '-2.5%' },
  { id: 'flash-btc-24h', asset: 'BTC', window: '24h', trigger: '-6%' },
  { id: 'flash-btc-48h', asset: 'BTC', window: '48h', trigger: '-10%' },
  { id: 'flash-eth-1h',  asset: 'ETH', window: '1h',  trigger: '-4%' },
  { id: 'flash-eth-24h', asset: 'ETH', window: '24h', trigger: '-8.5%' },
  { id: 'flash-eth-48h', asset: 'ETH', window: '48h', trigger: '-14%' },
] as const

// Common policy economics for every Flash shield on V5.3.
export const V53_POLICY_TERMS = {
  bondMaturityDays: 730,
  deductibleBps: 2000,        // 20%
  payoutBps: 8000,            // 80%
  marginBps: 20000,           // 2.00x
  paymentAsset: 'USDC',
  strikeSnapshot: 'spot at createPolicy',
  sequencerL2Check: 'active (no-op on Base Sepolia)',
} as const

export const DOCS: DocEntry[] = [
  // ─── 🚀 GETTING STARTED ──────────────────────────────────────
  {
    title: 'Protocol README',
    description: 'High-level overview of the Lumina parametric insurance protocol and how the V5.3 contracts fit together.',
    repo: 'LUMINA-PROTOCOL',
    path: 'README.md',
    category: 'getting-started',
  },
  {
    title: 'API server README',
    description: 'How to run the lumina-api locally, environment variables, and the public + agent endpoint surface.',
    repo: 'lumina-api',
    path: 'README.md',
    category: 'getting-started',
  },
  {
    title: 'AI Agent Quick Start',
    description: 'Five-minute path from zero to first policy purchase via the API. Read this before anything else if you operate a bot.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/AI-AGENT-QUICK-START.md',
    category: 'getting-started',
  },
  {
    title: 'V5.3 deployment addresses (Base Sepolia)',
    description: 'Authoritative deployed addresses for the V5.3 release on Base Sepolia (chain 84532). Includes the 6 FlashShieldAdapter instances and the V5.2 core that V5.3 reuses.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/DEPLOYMENTS-V5.3.md',
    category: 'getting-started',
    badge: 'new',
  },
  {
    title: 'API base URL + SDK pointer',
    description: 'Public API at https://lumina-api-production-ac85.up.railway.app and @lumina-org/sdk @ v0.6.0 on npm. The SDK resolves contract addresses at runtime via /health, so consumers do not pin addresses.',
    repo: 'lumina-api',
    path: 'README.md#api-base-url',
    category: 'getting-started',
    badge: 'new',
  },

  // ─── 🤖 FOR AI AGENTS ────────────────────────────────────────
  {
    title: 'SKILL spec (canonical)',
    description: 'The full canonical skill specification consumed by AI agents. Lists every operation an agent can perform.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/SKILL.md',
    category: 'agents',
  },
  {
    title: 'Configure API client',
    description: 'Env vars, base URL, x-api-key header, retry strategy. The setup any agent needs before calling other endpoints.',
    repo: 'lumina-api',
    path: 'docs/skills/configure-api-client.md',
    category: 'agents',
  },
  {
    title: 'Generate API key',
    description: 'How to obtain an agent API key (admin-only today, self-service on roadmap). Format, storage, rate limits.',
    repo: 'lumina-api',
    path: 'docs/skills/generate-api-key.md',
    category: 'agents',
  },
  {
    title: 'Buy policy as Agent',
    description: 'Relayer pattern: agent posts an authenticated request; the API pays gas and calls purchasePolicyFor on-chain.',
    repo: 'lumina-api',
    path: 'docs/skills/buy-policy-agent.md',
    category: 'agents',
  },
  {
    title: 'Redeem matured bond via API',
    description: 'Agent-side BondVault.redeemBond — POST /api/v1/redeem with epochId + usdAmount. Returns LUMINA to the holder.',
    repo: 'lumina-api',
    path: 'docs/skills/redeem-via-api.md',
    category: 'agents',
  },
  {
    title: 'Health check',
    description: 'Public unauthenticated endpoint for monitors and uptime probes. Use it on startup before issuing real calls.',
    repo: 'lumina-api',
    path: 'docs/skills/health-check.md',
    category: 'agents',
  },

  // ─── 📜 SMART CONTRACTS (SOURCE) ─────────────────────────────
  // One entry per deployed .sol file on main. Interfaces are intentionally
  // omitted — they live under src/interfaces/ for compile-time only.

  // Token (3)
  {
    title: 'LuminaTokenV2.sol',
    description: 'ERC-20 + ERC-20Burnable + UUPS proxy. 100M fixed supply, no mint, BURNER_ROLE for TWAPBurner.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/token/LuminaTokenV2.sol',
    category: 'source',
  },
  {
    title: 'FounderVesting.sol',
    description: '8M LUMINA locked behind 3 unlock paths: PATH1 (2-of-3 AltSeason oracle conditions sustained 1 day), PATH2 (ETH > $5,000 sustained 1 day), PATH3 (3-year fallback). UUPS upgradeable.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/token/FounderVesting.sol',
    category: 'source',
  },
  {
    title: 'TreasuryVesting.sol',
    description: '3M LUMINA, 180-day lock then max 250k/month drip release. UUPS upgradeable.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/token/TreasuryVesting.sol',
    category: 'source',
  },

  // Bonds (2)
  {
    title: 'BondVault.sol',
    description: 'Single ERC-1155 vault holding the 70M LUMINA reserve. Backs every claim payout in the protocol.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/bonds/BondVault.sol',
    category: 'source',
  },
  {
    title: 'ClaimBond.sol',
    description: 'ERC-1155 bond representation. 1 token = $1 face value (integer dollars, not 6-dec USDC).',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/bonds/ClaimBond.sol',
    category: 'source',
  },

  // Core protocol (4)
  {
    title: 'PolicyManagerV2.sol',
    description: 'Buy / redeem / cancel policies. Routes purchases through a FlashShieldAdapter per shield (UUPS); strike spot snapshotted at createPolicy. Premium = cover × payoutRatio × marginBps / 10000.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/core/PolicyManagerV2.sol',
    category: 'source',
  },
  {
    title: 'CoverRouterV2.sol',
    description: 'Routes premium USDC into the TWAPBurner and updates capacity counters atomically.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/core/CoverRouterV2.sol',
    category: 'source',
  },
  {
    title: 'TWAPBurner.sol',
    description: 'Receives USDC from premiums + marketplace fees, executes multi-DEX buy & burn of LUMINA. Adaptive distribution.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/core/TWAPBurner.sol',
    category: 'source',
  },
  {
    title: 'AdaptiveFeeDistributor.sol',
    description: 'Dynamic 4-bucket distribution (burn / buyback / ops / maintenance) consumed by TWAPBurner when adaptive mode is on.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/core/AdaptiveFeeDistributor.sol',
    category: 'source',
  },

  // Marketplace (2)
  {
    title: 'LuminaBondMarketplace.sol',
    description: 'Secondary marketplace for bonds. 3% fee on every trade routes back through TWAPBurner.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/marketplace/LuminaBondMarketplace.sol',
    category: 'source',
  },
  {
    title: 'BuybackEngine.sol',
    description: 'Commit-reveal MEV-protected buyback executor. Pulls from buybackReserve when conditions trigger.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/marketplace/BuybackEngine.sol',
    category: 'source',
  },

  // Oracles (3)
  {
    title: 'LuminaOracleV2.sol',
    description: 'EIP-712 signed price proofs from the off-chain signer. Verifies signatures against the trusted oracleKey. The 6 V5.3 shields (3 Flash BTC + 3 Flash ETH) call verifyPriceProofEIP712 here in their _doVerifyAndCalculate path. Replaces the pre-launch MockShieldOracle.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/oracles/LuminaOracleV2.sol',
    category: 'source',
    badge: 'new',
  },
  {
    title: 'CapacityOracle.sol',
    description: 'Reads available BondVault capacity in USD using a 1h TWAP of LUMINA price (not spot — anti-MEV).',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/oracles/CapacityOracle.sol',
    category: 'source',
  },
  {
    title: 'SolvencyOracle.sol',
    description: 'Monitors the BondVault solvency floor (125%). Used by burnFromReserves to block insolvent burns.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/oracles/SolvencyOracle.sol',
    category: 'source',
  },

  // Automation (1)
  {
    title: 'ShieldKeeper.sol',
    description: 'Chainlink Automation keeper that expires policies and triggers payouts when oracle conditions are met.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/automation/ShieldKeeper.sol',
    category: 'source',
  },

  // DEX adapters (2)
  {
    title: 'UniswapV3Adapter.sol',
    description: 'IDexRouter implementation for Uniswap V3. Used by TWAPBurner for the primary buy & burn route.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/dex/UniswapV3Adapter.sol',
    category: 'source',
  },
  {
    title: 'AerodromeAdapter.sol',
    description: 'IDexRouter implementation for Aerodrome (Base-native DEX). Sequential fallback if Uniswap leg fails.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/dex/AerodromeAdapter.sol',
    category: 'source',
  },

  // Products / Shields (8: 1 slim base + 1 adapter + 6 shields)
  {
    title: 'BaseFlashShield.sol',
    description: 'Slim abstract base for every Flash shield. Holds shared payout, pause, replay-protection, sequencer L2 uptime check, and strike-spot snapshot logic.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/BaseFlashShield.sol',
    category: 'source',
  },
  {
    title: 'FlashShieldAdapter.sol',
    description: 'UUPS adapter sitting between PolicyManagerV2 and each BaseFlashShield. One adapter is deployed per shield (6 total on V5.3) — upgrade path stays per-product.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/FlashShieldAdapter.sol',
    category: 'source',
    badge: 'new',
  },
  {
    title: 'FlashBTCShield1h.sol',
    description: 'Flash crash protection for BTC over a 1-hour window. Triggers at -2.5% vs strike spot snapshot.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/FlashBTCShield1h.sol',
    category: 'source',
  },
  {
    title: 'FlashBTCShield24h.sol',
    description: 'Flash crash protection for BTC over a 24-hour window. Triggers at -6% vs strike spot snapshot.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/FlashBTCShield24h.sol',
    category: 'source',
  },
  {
    title: 'FlashBTCShield48h.sol',
    description: 'Flash crash protection for BTC over a 48-hour window. Triggers at -10% vs strike spot snapshot.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/FlashBTCShield48h.sol',
    category: 'source',
  },
  {
    title: 'FlashETHShield1h.sol',
    description: 'Flash crash protection for ETH over a 1-hour window. Triggers at -4% vs strike spot snapshot.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/FlashETHShield1h.sol',
    category: 'source',
  },
  {
    title: 'FlashETHShield24h.sol',
    description: 'Flash crash protection for ETH over a 24-hour window. Triggers at -8.5% vs strike spot snapshot.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/FlashETHShield24h.sol',
    category: 'source',
  },
  {
    title: 'FlashETHShield48h.sol',
    description: 'Flash crash protection for ETH over a 48-hour window. Triggers at -14% vs strike spot snapshot.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/FlashETHShield48h.sol',
    category: 'source',
  },

  // Treasury reserves (2)
  {
    title: 'CEXLiquidityReserve.sol',
    description: 'Holds the 14M LUMINA earmarked for CEX/DEX liquidity provisioning at launch.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/treasury/CEXLiquidityReserve.sol',
    category: 'source',
  },
  {
    title: 'MaintenanceReserve.sol',
    description: 'Receives the maintenance bucket from TWAPBurner adaptive distribution. Funds operational upkeep.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/treasury/MaintenanceReserve.sol',
    category: 'source',
  },

  // ─── 🔐 ARCHITECTURE & INTEGRATIONS ──────────────────────────
  {
    title: 'Aave V3 integration',
    description: 'How Lumina uses Aave V3 read-only as a price oracle input for FounderVesting unlock paths. NOT for yield.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/architecture/AAVE-INTEGRATION.md',
    category: 'contracts',
  },
  {
    title: 'Cross-contract integration map',
    description: 'How the 6 V5.3 shields (via FlashShieldAdapter), BondVault, ClaimBond, and CoverRouter connect. Auditor reference.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/audit/v5.3/30-cross-contract/01-INTEGRATION-MAP.md',
    category: 'contracts',
    badge: 'new',
  },
  {
    title: 'Adapter pattern (V5.3)',
    description: 'PolicyManagerV2 → FlashShieldAdapter (UUPS) → BaseFlashShield slim. One adapter per shield keeps the upgrade surface bounded and per-product.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/architecture/ADAPTER-PATTERN.md',
    category: 'contracts',
    badge: 'new',
  },
  {
    title: 'Aave audit chapter',
    description: 'Audit deep-dive on the Aave V3 integration. Covers manipulation surfaces and the FounderVesting unlock-path mitigations.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/audit/v5.3/12-aave-integration/REPORT.md',
    category: 'contracts',
  },

  // ─── 🛡️ SECURITY & AUDITS ────────────────────────────────────
  {
    title: 'Security policy',
    description: 'Reporting process, scope, bug bounty, V5.3 contracts in scope (single BondVault + 6 Flash shields behind FlashShieldAdapter), Aave dependency.',
    repo: 'LUMINA-PROTOCOL',
    path: 'SECURITY.md',
    category: 'security',
    badge: 'new',
  },
  {
    title: 'Security audit V5',
    description: 'Latest internal audit report covering the V5.x architecture, rolled forward through the V5.3 adapter-pattern redeploy.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/SECURITY-AUDIT-V5.md',
    category: 'security',
  },
  {
    title: 'Phase 4 audit report',
    description: 'Phase 4 internal audit covering the bond + marketplace flow.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/audit/PHASE4-AUDIT-REPORT.md',
    category: 'security',
  },
  {
    title: 'Threat model',
    description: 'Adversarial framing — who can attack what, oracle manipulation surfaces, governance assumptions.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/audit/THREAT-MODEL.md',
    category: 'security',
  },
  {
    title: 'Anti-fraud playbook',
    description: 'Operational guide for detecting and responding to abuse patterns (spam policies, oracle manipulation attempts).',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/ANTI-FRAUD-PLAYBOOK.md',
    category: 'security',
  },

  // ─── 🚢 DEPLOYMENT ───────────────────────────────────────────
  {
    title: 'Deploy V5 checklist',
    description: 'Pre-deploy invariants and post-deploy verification for the V5.x family of contracts.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/deployment/DEPLOY-V5-CHECKLIST.md',
    category: 'deployment',
  },
  {
    title: 'Deploy V5 order',
    description: 'Exact deployment sequence (token → vault → router → shields) with rationale for ordering.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/deployment/DEPLOY-V5-ORDER.md',
    category: 'deployment',
  },
  {
    title: 'Environment variables',
    description: 'All env vars needed for deploy + post-deploy. Includes the Aave V3 oracle address (read-only).',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/deployment/ENV-VARIABLES.md',
    category: 'deployment',
  },
  {
    title: 'Mainnet deploy runbook',
    description: 'Step-by-step runbook for the production mainnet deployment, including go/no-go gates.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/runbooks/DEPLOY-MAINNET-RUNBOOK.md',
    category: 'deployment',
  },

  // ─── ⚖️ GOVERNANCE & OPERATIONS ──────────────────────────────
  {
    title: 'Access control matrix',
    description: 'Every privileged role across the protocol — who can call what, who holds the keys, with rotation policies.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/ACCESS-CONTROL-MATRIX.md',
    category: 'governance',
  },
  {
    title: 'Roles and responsibilities',
    description: 'Governance + operational roles defined: who signs what, decision frameworks, escalation paths.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/governance/ROLES-AND-RESPONSIBILITIES.md',
    category: 'governance',
  },
  {
    title: 'Multisig policies',
    description: 'Signing thresholds, quorum, timelocks, and key rotation for the governance multisig.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/governance/MULTISIG-POLICIES.md',
    category: 'governance',
  },
  {
    title: 'Daily operations runbook',
    description: 'Day-to-day operator tasks: monitoring, periodic verifications, alerts triage.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/runbooks/DAILY-OPERATIONS-RUNBOOK.md',
    category: 'governance',
  },
  {
    title: 'Incident response runbook',
    description: 'Step-by-step guide for triaging and recovering from production incidents (RPC down, oracle stale, contract pause).',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/runbooks/INCIDENT-RESPONSE-RUNBOOK.md',
    category: 'governance',
  },

  // ─── 📊 TOKENOMICS & ECONOMICS ───────────────────────────────
  // Every entry here links to the canonical V5.3 source: contract code
  // for things that are code, audit chapters for things that are
  // analysis. No README anchors, no ROADMAP detours. If a number on the
  // /docs page disagrees with these source files, the source wins.
  {
    title: 'Token distribution (100M LUMINA)',
    description: 'The five _mint() calls in LuminaTokenV2.initialize() that hardcode the 70 / 14 / 8 / 5 / 3 split (BondVault / CEX / Founder / LBP / Treasury).',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/token/LuminaTokenV2.sol#L71-L75',
    category: 'economics',
  },
  {
    title: 'Max supply + burn role',
    description: 'MAX_SUPPLY constant (100M × 1e18, fixed, no mint function) and the BURNER_ROLE granted only to the TWAPBurner contract.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/token/LuminaTokenV2.sol#L31-L32',
    category: 'economics',
  },
  {
    title: 'Burn engine — fallback distribution',
    description: 'TWAPBurner default 4-bucket split when adaptive mode is off: 85% burn, 8% buyback, 5% maintenance, 2% ops (in BPS, sums to 10000).',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/core/TWAPBurner.sol#L61-L64',
    category: 'economics',
  },
  {
    title: 'Premium formula',
    description: 'CoverRouter.purchasePolicy: premium = coverage × payoutRatioBps × marginBps / 10000² (marginBps = 20000 → 2.00x), with a 1-unit USDC ($0.000001) floor. Deductible 20%, payout 80% of coverage.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/core/CoverRouterV2.sol#L200-L203',
    category: 'economics',
  },
  {
    title: 'Founder vesting V2 (8M LUMINA)',
    description: 'FounderVesting V2 unlocks via 3 paths: PATH1 (2-of-3 AltSeason oracle conditions sustained 1 day), PATH2 (ETH > $5,000 sustained 1 day), PATH3 (3-year fallback).',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/token/FounderVesting.sol#L43-L51',
    category: 'economics',
  },
  {
    title: 'Treasury vesting (3M LUMINA)',
    description: 'TreasuryVesting constants: 3M total, 180-day initial lock, then max 250k/month drip release. Math floor is 18 months until fully drawn.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/token/TreasuryVesting.sol#L17-L20',
    category: 'economics',
  },
  {
    title: 'Bond face value + maturity',
    description: 'ClaimBond NatSpec: 1 ERC-1155 token = $1 USD at maturity (integer dollars, not 6-dec USDC). Bonds vest 100% at maturity — no partial unlock.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/bonds/ClaimBond.sol#L14-L19',
    category: 'economics',
  },
  {
    title: 'Bond maturity period (730 days)',
    description: 'BondVault.BOND_MATURITY_SECONDS — every newly issued bond matures exactly 730 days (24 months) after issuance.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/bonds/BondVault.sol#L54',
    category: 'economics',
  },
  {
    title: 'BondVault redemption throttle',
    description: 'FIFO queue per epoch with a 1.08% per-week cap on principal exit. Smooths catastrophic-scenario outflows without freezing redemptions.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/bonds/BondVault.sol',
    category: 'economics',
  },
  {
    title: 'Premium math — edge cases (audit)',
    description: 'Audit deep-dive on the premium formula: rounding behavior, integer overflow surfaces, BPS-square precision loss. Companion analysis to the on-chain formula above.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/audit/v5.3/05-math-edge-cases/REPORT.md',
    category: 'economics',
  },

  // ─── 🗺️ ROADMAP ──────────────────────────────────────────────
  {
    title: 'Roadmap V5',
    description: 'Forward-looking roadmap for the V5 family: token launch, marketplace, automation, cross-chain.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/ROADMAP-V5.md',
    category: 'roadmap',
  },

  // ─── 📜 HISTORICAL ───────────────────────────────────────────
  {
    title: 'Changelog',
    description: 'Version-by-version change log. Older entries reference V1/V2/V4/V5.1 by design — current architecture is V5.3 (adapter pattern, 6 Flash shields).',
    repo: 'LUMINA-PROTOCOL',
    path: 'CHANGELOG.md',
    category: 'historical',
    badge: 'historical',
  },
  {
    title: 'V1 deprecated contracts',
    description: 'Inventory of legacy V1/V2/V4 contracts no longer in scope. Kept to prevent re-deployment of stale addresses.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/V1-DEPRECATED-CONTRACTS.md',
    category: 'historical',
    badge: 'deprecated',
  },
  {
    title: 'Security audit V3 (final)',
    description: 'Historical V3 audit for reference. Most findings rolled forward into V4 and V5; check SECURITY-AUDIT-V5 for current.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/SECURITY-AUDIT-V3-FINAL.md',
    category: 'historical',
    badge: 'historical',
  },
]
