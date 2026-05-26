// components/whitepaper-short/copy.en.ts
// Source-of-truth English copy for the whitepaper-short page.
// All numbers traced to whitepaper §X / contract files / live /health.

export type CodeToken =
  | { type: 'kw' | 'str' | 'id' | 'txt' | 'comment'; text: string }
  | { type: 'br' }

export type ReceiptRow = { k: string; v: string; highlight?: boolean; note?: string }

export type Shield = {
  glyph: string; asset: 'BTC' | 'ETH' | 'USDT' | 'USDC';
  title: string; trigger: string; pill: string;
  canonical: string; literal: string;
}

export const COPY_EN = {
  s1: {
    eyebrow: '· v5.3 · Base Sepolia · ClaimBond Model',
    h1Pre: 'Insurance for the agents who never sleep — ',
    h1Italic: 'settled by oracles, burned by code.',
    sub: "Lumina is a parametric on-chain insurance protocol on Base L2. Every USDC premium routes through the AdaptiveFeeDistributor: 85% buys and burns $LUMINA on Uniswap V3. Every triggered policy mints a fixed-USD bond, redeemable in 24 months. Built for autonomous AI agents that need a sub-minute payout.",
    btnPrimary: 'Launch app →',
    btnGhost: 'Read full whitepaper',
    feedLabel: 'Burn feed · live',
  },
  s2: {
    eyebrow: '02 / 10 · The gap',
    h2Pre: 'Existing crypto insurance was never built ',
    h2Italic: 'for autonomous agents.',
    p1: "Nexus Mutual, InsurAce, Sherlock — every general-purpose crypto insurance protocol uses discretionary claims. An event happens, a committee meets, a payout is issued days or weeks later. That cadence is incompatible with bots that liquidate, rebalance, and hedge inside a single block.",
    p2: 'An autonomous agent can\'t fill out a claim form. It can\'t argue with a committee. It can\'t survive a 7-day vote on whether the depeg "really" happened. It needs an objective trigger, signed by an oracle, and a payout that fires inside the same transaction that confirms the loss.',
    cards: [
      { ts: '2024-08-05', asset: 'BTC',   line: 'Flash crashed −7% in 12 min — every leveraged bot got margin-called' },
      { ts: '2023-03-11', asset: 'USDC',  line: "Lost peg to $0.87 — yield bots couldn't unwind in time" },
      { ts: '2022-06-13', asset: 'stETH', line: 'Liquidity drained — Aave borrowers liquidated en masse' },
    ],
  },
  s3: {
    eyebrow: '03 / 10 · Three steps from premium to payoff',
    h2: 'From premium to payoff in three on-chain steps.',
    steps: [
      { glyph: '◇', title: 'Buy',     call: 'purchasePolicy(productId, coverage)',          body: 'An agent picks one of the 6 V5.3 flash shields and pays a USDC premium. The relayer wallet pays gas; the agent only pays the premium.' },
      { glyph: '◆', title: 'Trigger', call: 'submitTrigger(policyId, oracleProof)',         body: 'Anyone — agent, keeper, MEV bot — can submit a signed EIP-712 PriceProof. If the parametric condition is met, the payout fires in the same transaction.' },
      { glyph: '◈', title: 'Redeem',  call: 'BondVault.redeemBond(epochId, usdAmount)',     body: 'The triggered policy mints ERC-1155 ClaimBonds at $1 face value each. Hold to maturity (730 days), or sell early on the secondary marketplace at a discount.' },
    ],
    payoff: '→ ClaimBond · $1 face · 730d maturity',
  },
  s4: {
    eyebrow: '04 / 10 · Lifecycle',
    h2Pre: 'From premium to payout: ',
    h2Italic: 'six steps, two endings.',
    lede: 'Every Lumina position walks the same six-step path. The premium is paid in USDC and burns $LUMINA on the way in. If the trigger fires, a ClaimBond is minted. From there the holder picks one of two endings — wait 730 days for $LUMINA at maturity, or sell now on the secondary marketplace for USDC.',
    steps: [
      { title: 'Buy policy (USDC)',          body: 'Pay a small premium in USDC. Routed through the AdaptiveFeeDistributor: 85% reaches the TWAPBurner — buy & burn $LUMINA on Uniswap V3 — and 8/2/5% fund buyback/ops/maintenance. Supply shrinks immediately.' },
      { title: 'Trigger fires',              body: 'Oracle observes the covered asset. If the trigger condition is met inside the policy window, the policy is triggered and a ClaimBond becomes mintable.' },
      { title: 'ClaimBond minted (ERC-1155)', body: 'Minted to the holder, indexed by epoch. $1 face value per unit. Maturity: 730 days.' },
      { title: 'Choose: wait OR sell',       body: 'Hold the bond to maturity for $LUMINA, or list it on the secondary marketplace today for USDC.' },
      { title: 'Wait 730d → $LUMINA',        body: 'redeemBond() reads the oracle and mints luminaAmount = usdAmount / LUMINA_price to the holder. Captures the upside if $LUMINA appreciates.' },
      { title: 'OR sell now → USDC',         body: 'List on the secondary marketplace at a discount. Buyer pays USDC. 3% marketplace fee (1.5% seller + 1.5% buyer) — routed through the AdaptiveFeeDistributor on the same 85/8/2/5 split.' },
    ],
    example: {
      label: 'Worked example',
      body: '$3 USDC premium covers $800 — Flash BTC 1h. Trigger fires. An 800-unit ClaimBond is minted to the wallet (ERC-1155, $1 face, 730d maturity).',
      waitLabel: 'Path A · wait 730d (LUMINA = $0.50)',
      waitOutcome: '1,600 LUMINA',
      sellLabel: 'Path B · sell now (~70% of face)',
      sellOutcome: '~$560 USDC',
    },
    truth: 'Premium = USDC · Marketplace trade = USDC · Bond redeem at maturity = $LUMINA',
  },
  s5: {
    eyebrow: '05 / 10 · Six parametric flash shields',
    h2Pre: 'Specific triggers. Specific assets. ',
    h2Italic: 'Specific time windows.',
    lede: 'Each V5.3 flash shield is BaseFlashShield + a FlashShieldAdapter UUPS-upgradeable proxy that validates a drop from the purchase price within a fixed window. The on-chain product registry uses canonical names of the form FLASHBTC1H-001 — the productId a caller passes is the keccak256 of that string.',
    shields: [
      { glyph: '₿', asset: 'BTC',  title: 'Flash BTC 1h',  trigger: 'BTC −2.5% / 1h',  pill: '1h',  canonical: 'FLASHBTC1H-001', literal: 'BTC' },
      { glyph: '₿', asset: 'BTC',  title: 'Flash BTC 24h', trigger: 'BTC −6% / 24h',   pill: '24h', canonical: 'FLASHBTC24-001', literal: 'BTC' },
      { glyph: '₿', asset: 'BTC',  title: 'Flash BTC 48h', trigger: 'BTC −10% / 48h',  pill: '48h', canonical: 'FLASHBTC48-001', literal: 'BTC' },
      { glyph: 'Ξ', asset: 'ETH',  title: 'Flash ETH 1h',  trigger: 'ETH −4% / 1h',    pill: '1h',  canonical: 'FLASHETH1H-001', literal: 'ETH' },
      { glyph: 'Ξ', asset: 'ETH',  title: 'Flash ETH 24h', trigger: 'ETH −8.5% / 24h', pill: '24h', canonical: 'FLASHETH24-001', literal: 'ETH' },
      { glyph: 'Ξ', asset: 'ETH',  title: 'Flash ETH 48h', trigger: 'ETH −14% / 48h',  pill: '48h', canonical: 'FLASHETH48-001', literal: 'ETH' },
    ] satisfies Shield[],
  },
  s6: {
    eyebrow: '06 / 10 · Tokenomics',
    h2Pre: '100 million $LUMINA. Fixed forever. ',
    h2Italic: 'Always shrinking.',
    lede: 'LuminaTokenV2 is an ERC-20 + ERC-20Burnable token. There is no mint function. The constructor enforces totalSupply() == MAX_SUPPLY immediately after the genesis distribution. From that moment on, supply only decreases.',
    donut: { center: '100,000,000', centerSub: 'LUMINA · Fixed' },
    legend: [
      { label: 'Bond Reserve', val: '70 M', pct: 70, color: 'var(--rd-accent)' },
      { label: 'Liquidity',    val: '14 M', pct: 14, color: 'var(--rd-accent-2)' },
      { label: 'Founder',      val: '8 M',  pct: 8,  color: '#f59e0b' },
      { label: 'LBP',          val: '5 M',  pct: 5,  color: '#ec4899' },
      { label: 'Treasury',     val: '3 M',  pct: 3,  color: '#22d3ee' },
    ],
    flowTitle: 'Deflationary flow',
    flow: [
      { num: '01', title: 'Premium paid',                meta: 'USDC' },
      { num: '02', title: 'AdaptiveFeeDistributor',      meta: '85/8/2/5 split' },
      { num: '03', title: 'TWAPBurner → Uniswap V3',     meta: 'USDC → LUMINA' },
      { num: '04', title: '0xdead',                      meta: 'permanent burn' },
    ],
  },
  s7: {
    eyebrow: '07 / 10 · Adaptive burn',
    h2Pre: 'Sixteen burn regimes. ',
    h2Italic: 'The matrix decides where every premium goes.',
    lede: "The AdaptiveFeeDistributor sits in front of the burner. Before any LUMINA is bought, the router consults a 4×4 matrix indexed on solvency × momentum, with 16 pre-tuned cells. HEALTHY × STABLE is the V5.3 default and applies an 85/8/2/5 split (Burn / Buyback / Operations / Maintenance); CRISIS × CRASH halts burn entirely and stages 96 % of incoming USDC for a defensive buyback.",
    rowLabels: ['ULTRA', 'HEALTHY', 'STRESSED', 'CRISIS'],
    colLabels: ['RALLY', 'STABLE', 'DECLINE', 'CRASH'],
    matrix: [
      [[9500,0,0,500],     [9000,500,0,500],   [8500,1000,0,500],  [7500,2000,0,500]],
      [[9000,500,0,500],   [8500,800,200,500], [7000,2100,200,700],[5500,3500,200,800]],
      [[7500,1800,200,500],[5500,3500,200,800],[3800,5500,200,500],[1800,7500,200,500]],
      [[4800,4500,200,500],[2800,6500,200,500],[800,8500,200,500], [0,9600,200,200]],
    ] as const,
    barLabels: ['burn', 'buyback', 'ops', 'maint'],
    defaultLabel: 'DEFAULT',
    selectionHint: 'Click any cell to inspect the 4-channel split.',
    callout: {
      title: 'Sepolia status (V5.3)',
      body: 'Momentum is held neutral (10000 bps) on Sepolia until a deep LUMINA/USDC pool deploys. The 16-cell matrix runs on its solvency axis only — at runtime it collapses to the STABLE column with the 85/8/2/5 default split. Full 16-quadrant behavior activates once the pool, the momentum oracle, and the BuybackSpender ship together pre-mainnet.',
    },
  },
  s8: {
    eyebrow: '08 / 10 · Built for autonomous integration',
    h2Pre: 'One HTTP call. The relayer pays the gas. ',
    h2Italic: 'The agent only holds USDC.',
    lede: "The same contracts that power the human-facing app expose a thin REST API. POST /api/v1/policies signs purchasePolicyFor on-chain on the agent's behalf. No gas wallet, no popup, no KYC. Same bond mechanics. Same oracle resolution.",
    codeFile: 'agent.ts',
    codeLines: [
      { type: 'kw', text: 'import' }, { type: 'txt', text: ' { ' }, { type: 'id', text: 'LuminaClient' }, { type: 'txt', text: ' } ' }, { type: 'kw', text: 'from' }, { type: 'txt', text: ' ' }, { type: 'str', text: "'@lumina-org/sdk'" }, { type: 'br' },
      { type: 'br' },
      { type: 'kw', text: 'const' }, { type: 'txt', text: ' ' }, { type: 'id', text: 'lumina' }, { type: 'txt', text: ' = ' }, { type: 'kw', text: 'new' }, { type: 'txt', text: ' ' }, { type: 'id', text: 'LuminaClient' }, { type: 'txt', text: '({ apiKey: process.env.' }, { type: 'id', text: 'LUMINA_API_KEY' }, { type: 'txt', text: ' })' }, { type: 'br' },
      { type: 'br' },
      { type: 'kw', text: 'const' }, { type: 'txt', text: ' ' }, { type: 'id', text: 'policy' }, { type: 'txt', text: ' = ' }, { type: 'kw', text: 'await' }, { type: 'txt', text: ' lumina.policies.' }, { type: 'id', text: 'purchase' }, { type: 'txt', text: '({' }, { type: 'br' },
      { type: 'txt', text: '  productName:    ' }, { type: 'str', text: "'FLASHBTC1H-001'" }, { type: 'txt', text: ',' }, { type: 'br' },
      { type: 'txt', text: '  buyer:          ' }, { type: 'str', text: "'0xYourAgentWallet'" }, { type: 'txt', text: ',' }, { type: 'br' },
      { type: 'txt', text: '  coverageAmount: ' }, { type: 'str', text: "'100000000'" }, { type: 'txt', text: ',' }, { type: 'comment', text: '  // $100, 6-dec USDC (on-chain min)' }, { type: 'br' },
      { type: 'txt', text: '})' }, { type: 'br' },
      { type: 'br' },
      { type: 'id', text: 'console' }, { type: 'txt', text: '.' }, { type: 'id', text: 'log' }, { type: 'txt', text: '(policy.policyId, policy.txHash)' }, { type: 'br' },
      { type: 'comment', text: "// → '0x9f2e…', '0xab4d…'" },
    ] satisfies CodeToken[],
    receiptTitle: 'lumina-cli · receipt',
    receipt: [
      { k: 'policyId',     v: '0x9f2e6c...' },
      { k: 'txHash',       v: '0xab4d1d...' },
      { k: 'productName',  v: 'FLASHBTC1H-001' },
      { k: 'asset',        v: 'BTC (auto-resolved)' },
      { k: 'premium',      v: '$0.24 USDC' },
      { k: 'relayerPaid',  v: 'true', highlight: true, note: 'agent paid 0 gas' },
      { k: 'gasHeld',      v: 'false' },
      { k: 'bondEpochId',  v: '202805 (May 2028)' },
    ] satisfies ReceiptRow[],
    pills: ['gas wallet', 'MetaMask popup', 'KYC form'],
  },
  s9: {
    eyebrow: '09 / 10 · Live state',
    h2Pre: 'Everything in this whitepaper is on-chain ',
    h2Italic: 'right now.',
    lede: "These are the contracts the live API and the live frontend talk to today. Always verify against /health before integrating — a redeploy will quietly invalidate yesterday's .env.",
    statLabels: ['BLOCK HEIGHT', 'RELAYER BALANCE', 'TOTAL LUMINA BURNED', 'CONTRACTS VERIFIED'],
    fallbackBurned: 1284503,
    addressTable: {
      head: ['Contract', 'Address'],
    },
    healthFooter: 'Source · /health · Base Sepolia · chainId 84532',
  },
  s10: {
    eyebrow: '10 / 10 · Start now',
    h2Pre: 'Ready to insure ',
    h2Italic: 'the bots that never sleep?',
    btn1: 'Launch the app →',
    btn2: 'Read the long whitepaper →',
    btn3: 'Read the SDK docs',
    tagline: 'Built on Base L2 · Deflationary by design',
  },
} as const

export type CopyEN = typeof COPY_EN
