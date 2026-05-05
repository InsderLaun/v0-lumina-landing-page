// Curated documentation catalog for /docs page.
// All paths verified against post-merge state of:
//   - org-lumina/LUMINA-PROTOCOL  (PR #96 merged: SECURITY rewritten,
//                                   AAVE-INTEGRATION added, file renames)
//   - org-lumina/lumina-api        (PRs #7 + #8 merged: 22 skills under
//                                   docs/skills/)
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

export type DocRepo = 'lumina-api' | 'LUMINA-PROTOCOL' | 'v0-lumina-landing-page'

export type DocBadge = 'new' | 'deprecated'

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
]

export function buildDocUrl(entry: DocEntry): string {
  return `${REPO_URLS[entry.repo]}/blob/main/${entry.path}`
}

export function docsByCategory(category: DocCategory): DocEntry[] {
  return DOCS.filter((d) => d.category === category)
}

export const DOCS: DocEntry[] = [
  // ─── 🚀 GETTING STARTED ──────────────────────────────────────
  {
    title: 'Protocol README',
    description: 'High-level overview of the Lumina parametric insurance protocol and how the V5.1 contracts fit together.',
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
    description: '8M LUMINA locked behind 2-of-3 AltSeason conditions sustained 7 days, then 3 tranches every 31 days. 4-year fallback.',
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
    description: 'Buy / redeem / cancel policies. Computes premium = cover × payoutRatio × triggerProb × margin.',
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

  // Oracles (2)
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

  // Products / Shields (10)
  {
    title: 'BaseShield.sol',
    description: 'Abstract base for every shield product. Holds shared payout, pause, and replay-protection logic.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/BaseShield.sol',
    category: 'source',
  },
  {
    title: 'FlashBTCShield1h.sol',
    description: 'Flash crash protection for BTC over a 1-hour window. Triggers on % drop vs reference price.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/FlashBTCShield1h.sol',
    category: 'source',
  },
  {
    title: 'FlashBTCShield4h.sol',
    description: 'Flash crash protection for BTC over a 4-hour window.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/FlashBTCShield4h.sol',
    category: 'source',
  },
  {
    title: 'FlashBTCShield24h.sol',
    description: 'Flash crash protection for BTC over a 24-hour window.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/FlashBTCShield24h.sol',
    category: 'source',
  },
  {
    title: 'FlashBTCShield48h.sol',
    description: 'Flash crash protection for BTC over a 48-hour window.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/FlashBTCShield48h.sol',
    category: 'source',
  },
  {
    title: 'FlashETHShield1h.sol',
    description: 'Flash crash protection for ETH over a 1-hour window.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/FlashETHShield1h.sol',
    category: 'source',
  },
  {
    title: 'FlashETHShield24h.sol',
    description: 'Flash crash protection for ETH over a 24-hour window.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/FlashETHShield24h.sol',
    category: 'source',
  },
  {
    title: 'FlashETHShield48h.sol',
    description: 'Flash crash protection for ETH over a 48-hour window.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/FlashETHShield48h.sol',
    category: 'source',
  },
  {
    title: 'MicroDepegShield.sol',
    description: 'Micro-depeg protection for USDT (and similar). Triggers on small but sustained price deviation.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/MicroDepegShield.sol',
    category: 'source',
  },
  {
    title: 'RateShockShield.sol',
    description: 'Rate-shock protection — triggers when Aave V3 USDC borrow rate exceeds 10% APY.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/products/RateShockShield.sol',
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
    description: 'How V5.1 uses Aave V3 read-only as price oracle (RateShockShield + FounderVesting Condition C). NOT for yield.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/architecture/AAVE-INTEGRATION.md',
    category: 'contracts',
    badge: 'new',
  },
  {
    title: 'Cross-contract integration map',
    description: 'How the 9 shields, BondVault, ClaimBond, and CoverRouterV2 connect. Auditor reference.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/audit/v5.1-uups/30-cross-contract/01-INTEGRATION-MAP.md',
    category: 'contracts',
  },
  {
    title: 'Aave audit chapter',
    description: 'Audit deep-dive on the Aave V3 integration. Covers manipulation surfaces and 2-of-3 mitigation in FounderVesting.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/audit/v5.1-uups/12-aave-integration/REPORT.md',
    category: 'contracts',
  },

  // ─── 🛡️ SECURITY & AUDITS ────────────────────────────────────
  {
    title: 'Security policy',
    description: 'Reporting process, scope, bug bounty, V5.1 contracts in scope (single BondVault + 9 shields), Aave dependency.',
    repo: 'LUMINA-PROTOCOL',
    path: 'SECURITY.md',
    category: 'security',
    badge: 'new',
  },
  {
    title: 'Security audit V5',
    description: 'Latest internal audit report covering V5.1 architecture (renamed from SECURITY-AUDIT-V4 — content was already V5.1).',
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
  // Every entry here links to the canonical V5.1 source: contract code
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
    description: 'CoverRouterV2.purchasePolicy: premium = coverage × payoutRatioBps × triggerProbBps × marginBps / 10000³, with a 1-unit USDC ($0.000001) floor.',
    repo: 'LUMINA-PROTOCOL',
    path: 'src/core/CoverRouterV2.sol#L200-L203',
    category: 'economics',
  },
  {
    title: 'Founder vesting (8M LUMINA)',
    description: 'All FounderVesting constants: 8M total, 3 tranches every 31 days, 2-of-3 oracle conditions sustained 7 days (ETH/BTC > 0.050, ETH > $4k, Aave borrow > 7%), 1460-day fallback.',
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
    title: 'Premium math — edge cases (audit)',
    description: 'Audit deep-dive on the premium formula: rounding behavior, integer overflow surfaces, BPS-cube precision loss. Companion analysis to the on-chain formula above.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/audit/v5.1-uups/05-math-edge-cases/REPORT.md',
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
]
