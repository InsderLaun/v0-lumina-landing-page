// 22 SKILLS — full lifecycle coverage (discover → quote → buy → monitor →
// claim → marketplace → integration). Each `githubUrl` points to a real
// file:line in either /tmp/lp-s2 (LUMINA-PROTOCOL @ 6a3ce42) or /tmp/la-s2
// (lumina-api @ 575a4d0). `todoNote` is set when no per-skill doc exists
// yet — the URL falls back to the most relevant README + the note surfaces
// in UI as a "doc pending" badge.

export type Audience = 'human' | 'agent' | 'both'
export type Category =
  | 'discover'
  | 'quote'
  | 'buy'
  | 'monitor'
  | 'claim'
  | 'marketplace'
  | 'integration'

export interface Skill {
  id: string
  number: string
  title: string
  description: string
  audience: Audience
  difficulty: 1 | 2 | 3
  tags: string[]
  category: Category
  githubUrl: string
  contractFn?: string
  apiEndpoint?: string
  todoNote?: string
}

const PROTO = 'https://github.com/org-lumina/LUMINA-PROTOCOL/blob/main'
const API = 'https://github.com/org-lumina/lumina-api/blob/main'

export const SKILLS: Skill[] = [
  // ─── DISCOVER ──────────────────────────────────────────────────
  {
    id: 'browse-shields',
    number: '01',
    title: 'Browse the 9 Shields catalog',
    description:
      'List all active parametric products available on Base Sepolia: 4 Flash BTC (1h/4h/24h/48h), 3 Flash ETH (1h/24h/48h), Micro Depeg USDT, and Rate Shock. Each shield has its own contract address, trigger condition, and probability.',
    audience: 'both',
    difficulty: 1,
    tags: ['read', 'catalog', 'public'],
    category: 'discover',
    githubUrl: `${API}/src/routes/products.ts#L10`,
    apiEndpoint: 'GET /products',
  },
  {
    id: 'read-shield-specs',
    number: '02',
    title: 'Read shield specs',
    description:
      'Inspect a specific shield contract: trigger logic, oracle feed, premium formula, payout ratio, and cover bounds. All shield contracts inherit from BaseShield with a shared lifecycle.',
    audience: 'both',
    difficulty: 1,
    tags: ['read', 'onchain'],
    category: 'discover',
    githubUrl: `${PROTO}/src/products/FlashBTCShield24h.sol`,
    contractFn: 'BaseShield._minCoverage / _calculateMaxPayout',
  },
  {
    id: 'check-protocol-status',
    number: '03',
    title: 'Check protocol status',
    description:
      'Query global pause state and remaining bond capacity. The protocol auto-pauses when the LUMINA price falls below a floor; capacity caps how much new cover can be issued from the BondVault reserve.',
    audience: 'both',
    difficulty: 1,
    tags: ['read', 'health'],
    category: 'discover',
    githubUrl: `${PROTO}/src/core/CoverRouterV2.sol#L308`,
    contractFn: 'CoverRouterV2.isProtocolAutoPaused / BondVault.availableCapacityUSD',
  },

  // ─── QUOTE ─────────────────────────────────────────────────────
  {
    id: 'quote-policy',
    number: '04',
    title: 'Quote a parametric policy',
    description:
      'Get a real-time on-chain quote for any shield. Returns the (premium, payout) tuple — premium scales with cover × triggerProbBps × marginBps × payoutRatioBps.',
    audience: 'both',
    difficulty: 1,
    tags: ['read', 'onchain', 'pricing'],
    category: 'quote',
    githubUrl: `${PROTO}/src/core/CoverRouterV2.sol#L284`,
    contractFn: 'CoverRouterV2.quotePremium(productId, coverageAmount)',
  },
  {
    id: 'quote-via-api',
    number: '05',
    title: 'Quote via REST API',
    description:
      'Same quote as the on-chain call, served by the public lumina-api endpoint. Useful for off-chain calculators, agent strategies, and dashboards that should not pay gas to read a price.',
    audience: 'agent',
    difficulty: 1,
    tags: ['read', 'api', 'public'],
    category: 'quote',
    githubUrl: `${API}/src/routes/products.ts#L34`,
    apiEndpoint: 'GET /products/:productId/quote?cover=&duration=',
  },

  // ─── BUY ───────────────────────────────────────────────────────
  {
    id: 'buy-policy-human',
    number: '06',
    title: 'Buy policy as Human (direct contract)',
    description:
      'Pay premium with your wallet and receive a policy bound to msg.sender. Atomic: USDC routes to the TWAPBurner, premium burns LUMINA on Uniswap. If trigger fires, your wallet receives ClaimBonds.',
    audience: 'human',
    difficulty: 2,
    tags: ['write', 'wallet', 'onchain'],
    category: 'buy',
    githubUrl: `${PROTO}/src/core/CoverRouterV2.sol#L146`,
    contractFn: 'CoverRouterV2.purchasePolicy(productId, coverageAmount, asset)',
  },
  {
    id: 'buy-policy-agent',
    number: '07',
    title: 'Buy policy as Agent (via API)',
    description:
      'Relayer pattern: agent sends a signed quote to the API, the relayer pays gas and calls purchasePolicyFor on-chain. Agent only needs an API key + USDC balance — no wallet UI.',
    audience: 'agent',
    difficulty: 2,
    tags: ['write', 'api', 'relayer'],
    category: 'buy',
    githubUrl: `${API}/src/routes/policies.ts#L45`,
    apiEndpoint: 'POST /api/v1/policies (agent-key)',
  },
  {
    id: 'approve-usdc',
    number: '08',
    title: 'Approve USDC allowance',
    description:
      'Standard ERC-20 prerequisite before purchasePolicy: call USDC.approve(CoverRouterV2, premium) so the router can pull the premium atomically. Reuse the allowance across multiple purchases (set to MaxUint to skip future approves).',
    audience: 'human',
    difficulty: 1,
    tags: ['write', 'wallet', 'erc20'],
    category: 'buy',
    githubUrl: `${API}/docs/skills/approve-usdc.md`,
    contractFn: 'USDC.approve(spender, amount) — standard ERC-20',
  },

  // ─── MONITOR ───────────────────────────────────────────────────
  {
    id: 'track-policies',
    number: '09',
    title: 'Track active policies (by owner)',
    description:
      'PolicyCreated event indexes productId + policyId but NOT buyer — pull all events with viem getLogs and filter client-side by buyer == owner. Yields the full set of policies a wallet has ever bought.',
    audience: 'both',
    difficulty: 2,
    tags: ['read', 'events', 'indexing'],
    category: 'monitor',
    githubUrl: `${PROTO}/src/core/PolicyManagerV2.sol#L101`,
    contractFn: 'event PolicyCreated(productId, policyId, buyer, coverage, premium, payout)',
  },
  {
    id: 'watch-triggers',
    number: '10',
    title: 'Watch oracle triggers in real time',
    description:
      'PolicyTriggered fires when a Chainlink oracle confirms the trigger condition for a policy. Listen to filter your wallet, then optionally subscribe to BondIssued for the resulting ClaimBond.',
    audience: 'both',
    difficulty: 2,
    tags: ['read', 'events', 'realtime'],
    category: 'monitor',
    githubUrl: `${PROTO}/src/core/PolicyManagerV2.sol#L109`,
    contractFn: 'event PolicyTriggered(productId, policyId, buyer, bondAmount, reason)',
  },
  {
    id: 'get-bonds',
    number: '11',
    title: 'Get bonds owned (by holder)',
    description:
      'BondsMinted indexes both `epochId` and `to` — filter by `to: ownerAddress` for direct discovery. ClaimBond is ERC-1155 with 1 token = $1, so balanceOf returns the integer-dollar face value.',
    audience: 'both',
    difficulty: 2,
    tags: ['read', 'events', 'erc1155'],
    category: 'monitor',
    githubUrl: `${PROTO}/src/bonds/ClaimBond.sol#L34`,
    contractFn: 'event BondsMinted(epochId, to, usdAmount) + balanceOf(holder, epochId)',
  },
  {
    id: 'check-policy-detail',
    number: '12',
    title: 'Check policy detail by id',
    description:
      'Public REST endpoint that returns a single policy snapshot (cover, premium, payout, status, expiry). No auth — useful for agent scripts that only need a pull-and-confirm pattern.',
    audience: 'both',
    difficulty: 1,
    tags: ['read', 'api', 'public'],
    category: 'monitor',
    githubUrl: `${API}/src/routes/policies.ts#L23`,
    apiEndpoint: 'GET /policies/:productId/:policyId',
  },

  // ─── CLAIM / REDEEM ────────────────────────────────────────────
  {
    id: 'receive-claimbond',
    number: '13',
    title: 'Receive ClaimBond on trigger',
    description:
      'When a trigger fires, BondVault.issueBond mints ERC-1155 ClaimBond tokens to the buyer. 1 token = $1 face value, all bonds maturing in the same month share an epochId, fungible.',
    audience: 'both',
    difficulty: 1,
    tags: ['write', 'system', 'auto'],
    category: 'claim',
    githubUrl: `${PROTO}/src/bonds/BondVault.sol#L170`,
    contractFn: 'BondVault.issueBond(to, usdPayout) — called by PolicyManager',
  },
  {
    id: 'redeem-bond',
    number: '14',
    title: 'Redeem matured bond for LUMINA',
    description:
      'After the 24-month maturity, call BondVault.redeemBond(epochId, usdAmount) to burn N bond tokens and receive $N worth of LUMINA at the current oracle price. Partial redemptions allowed.',
    audience: 'both',
    difficulty: 2,
    tags: ['write', 'wallet', 'onchain'],
    category: 'claim',
    githubUrl: `${PROTO}/src/bonds/BondVault.sol#L198`,
    contractFn: 'BondVault.redeemBond(epochId, usdAmount)',
  },

  // ─── MARKETPLACE ───────────────────────────────────────────────
  {
    id: 'list-bond',
    number: '15',
    title: 'List bond for sale',
    description:
      'Pre-maturity, sell your ClaimBonds at a discount on the secondary marketplace. You set the price in USDC; buyers see the implied yield based on days-to-maturity.',
    audience: 'both',
    difficulty: 2,
    tags: ['write', 'wallet', 'onchain'],
    category: 'marketplace',
    githubUrl: `${PROTO}/src/marketplace/LuminaBondMarketplace.sol#L99`,
    contractFn: 'LuminaBondMarketplace.list(epochId, amount, priceUSDC)',
  },
  {
    id: 'buy-listing',
    number: '16',
    title: 'Buy bond from marketplace',
    description:
      'Buy a discounted ClaimBond. Pay USDC, receive the ERC-1155 transfer. Marketplace takes 3% (1.5% from each side); 100% of fees route to the TWAPBurner and burn LUMINA forever.',
    audience: 'both',
    difficulty: 2,
    tags: ['write', 'wallet', 'onchain'],
    category: 'marketplace',
    githubUrl: `${PROTO}/src/marketplace/LuminaBondMarketplace.sol#L135`,
    contractFn: 'LuminaBondMarketplace.executeBuy(listingId)',
  },
  {
    id: 'cancel-listing',
    number: '17',
    title: 'Cancel an open listing',
    description:
      'Pull your listing off the marketplace at any time before someone buys it. The bond returns to your wallet; no fees charged.',
    audience: 'both',
    difficulty: 1,
    tags: ['write', 'wallet'],
    category: 'marketplace',
    githubUrl: `${PROTO}/src/marketplace/LuminaBondMarketplace.sol#L125`,
    contractFn: 'LuminaBondMarketplace.cancel(listingId)',
  },

  // ─── INTEGRATION ───────────────────────────────────────────────
  {
    id: 'connect-wallet',
    number: '18',
    title: 'Connect wallet via RainbowKit',
    description:
      'The frontend bundles RainbowKit + wagmi for MetaMask, Coinbase, WalletConnect, and Rainbow. Auto-prompts to switch network if not on Base Sepolia (chain 84532).',
    audience: 'human',
    difficulty: 1,
    tags: ['ui', 'wallet'],
    category: 'integration',
    githubUrl: `${API}/docs/skills/connect-wallet.md`,
    contractFn: 'wagmi createConfig + RainbowKit connectorsForWallets',
  },
  {
    id: 'configure-api-client',
    number: '19',
    title: 'Configure API client (env vars + auth)',
    description:
      'Production base URL: https://lumina-api-production-ac85.up.railway.app. Authenticated endpoints require an X-API-Key header. Rate limits enforced per agent identity (not per IP).',
    audience: 'agent',
    difficulty: 1,
    tags: ['api', 'auth'],
    category: 'integration',
    githubUrl: `${API}/README.md`,
    apiEndpoint: 'Header: X-API-Key',
  },
  {
    id: 'generate-api-key',
    number: '20',
    title: 'Generate an agent API key',
    description:
      'Self-service key issuance is admin-only on V5.1 testnet — request via labs@lumina-org.com with your wallet address. Max 3 active keys per wallet, plaintext shown once.',
    audience: 'agent',
    difficulty: 2,
    tags: ['api', 'auth', 'admin'],
    category: 'integration',
    githubUrl: `${API}/docs/skills/generate-api-key.md`,
    apiEndpoint: 'POST /api/v1/keys/generate (admin-only)',
  },
  {
    id: 'redeem-via-api',
    number: '21',
    title: 'Redeem matured bonds via API (Agent)',
    description:
      'Agent-side equivalent of redeemBond: POST a redeem request signed with your API key and the relayer dispatches the on-chain call. Returns LUMINA to the agent wallet.',
    audience: 'agent',
    difficulty: 2,
    tags: ['write', 'api', 'relayer'],
    category: 'integration',
    githubUrl: `${API}/src/routes/redeem.ts#L31`,
    apiEndpoint: 'POST /api/v1/redeem (agent-key)',
  },
  {
    id: 'health-check',
    number: '22',
    title: 'Health check + status pings',
    description:
      'Public health endpoint for monitors and uptime probes. Returns service status and the RPC chain id the API is connected to. No auth required.',
    audience: 'both',
    difficulty: 1,
    tags: ['read', 'api', 'public', 'ops'],
    category: 'integration',
    githubUrl: `${API}/src/routes/health.ts#L8`,
    apiEndpoint: 'GET /health',
  },
]
