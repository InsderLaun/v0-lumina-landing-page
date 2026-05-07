// Tutorial step content. Every contract / API citation is verified
// against org-lumina/LUMINA-PROTOCOL@main and org-lumina/lumina-api@main.
// If a number on this page disagrees with those repos, the source wins.

import type { TutorialStepProps } from '@/components/lumina/redesign/TutorialStep'
import { CONTRACTS, TOKENS, CHAIN, LUMINA_API_URL } from '@/lib/lumina-config'

const PROTOCOL_REPO = 'https://github.com/org-lumina/LUMINA-PROTOCOL'
const API_REPO = 'https://github.com/org-lumina/lumina-api'
const FRONTEND_REPO = 'https://github.com/org-lumina/v0-lumina-landing-page'

function protocolRef(file: string, line: string) {
  return `${PROTOCOL_REPO}/blob/main/${file}#L${line.replace(/-/g, '-L')}`
}
function apiRef(file: string, line: string) {
  return `${API_REPO}/blob/main/${file}#L${line.replace(/-/g, '-L')}`
}
function uiRef(path: string) {
  return `${FRONTEND_REPO}/blob/main/${path}`
}

const COVER_ROUTER = CONTRACTS.CoverRouter
const POLICY_MANAGER = CONTRACTS.PolicyManager
const BOND_VAULT = CONTRACTS.BondVault
const CLAIM_BOND = CONTRACTS.ClaimBond
const MARKETPLACE = CONTRACTS.Marketplace
const USDC = TOKENS.USDC.address
const API = LUMINA_API_URL

export type Audience = 'human' | 'agent'
export type AnyStep = Omit<TutorialStepProps, 'audience'> & { audience: Audience }

// One-shot reminder rendered above the step list. The on-chain ABI uses one
// `asset` argument to identify the covered asset (BTC / ETH / USDT / AAVE_RATE
// — encoded as bytes32). Premium is always pulled in USDC, regardless of the
// covered asset. Keep this in sync with components/lumina/redesign/Products.tsx.
export const PURCHASE_ASSET_NOTICE = {
  title: 'Premium is always paid in USDC',
  body: 'The on-chain `asset` field identifies the COVERED asset (e.g. BTC for FlashBTC, USDT for MicroDepeg). It is not the payment currency. CoverRouterV2.purchasePolicy pulls the premium in USDC from your wallet (or the relayer wallet for agents) for every product in the V5.1 catalogue.',
} as const

// ════════════════════════════════════════════════════════════════
// HUMAN FLOW — wallet + on-chain calls via the Operate App
// ════════════════════════════════════════════════════════════════

export const HUMAN_STEPS: AnyStep[] = [
  {
    number: 1,
    id: 'h-connect-wallet',
    title: 'Connect your wallet',
    audience: 'human',
    description: (
      <>
        <p>
          Open <code>/connect</code> and pick a wallet. Lumina supports MetaMask,
          Coinbase Wallet, Rainbow, and any WalletConnect-compatible mobile or
          hardware wallet — connection is handled by RainbowKit.
        </p>
        <p>
          You only need to do this once per device. The connection is stored in
          local storage and re-used by every <code>/app/*</code> screen.
        </p>
      </>
    ),
    frontendRef: {
      label: 'app/connect/page.tsx',
      path: 'app/connect/page.tsx',
      url: uiRef('app/connect/page.tsx'),
    },
  },
  {
    number: 2,
    id: 'h-switch-chain',
    title: `Switch to Base Sepolia (chain ${CHAIN.id})`,
    audience: 'human',
    description: (
      <>
        <p>
          Lumina V5.1 is deployed on <strong>Base Sepolia testnet</strong> — chain
          id <code>{CHAIN.id}</code>, RPC <code>{CHAIN.rpc}</code>. If your wallet
          is on the wrong network, the Operate App shows a "Wrong network" banner
          with a one-click switch button (uses wagmi's <code>useSwitchChain</code>).
        </p>
        <p>
          Block explorer:{' '}
          <a
            href={CHAIN.explorer}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--rd-accent)' }}
          >
            {CHAIN.explorer}
          </a>
          . Mainnet (chain 8453) is planned but not active.
        </p>
      </>
    ),
    frontendRef: {
      label: 'AppShell wrong-chain banner',
      path: 'components/lumina/redesign/operate/AppShell.tsx',
      url: uiRef('components/lumina/redesign/operate/AppShell.tsx'),
    },
  },
  {
    number: 3,
    id: 'h-get-usdc',
    title: 'Get test USDC',
    audience: 'human',
    description: (
      <>
        <p>
          The protocol uses a MockUSDC deployment on Base Sepolia at{' '}
          <code>{USDC}</code>. The mock exposes a public <code>mint(address, uint256)</code>{' '}
          so anyone can self-fund. Call it from Basescan with your wallet address
          and the amount you need (USDC has 6 decimals — pass <code>1000000</code> for
          $1, <code>1000000000</code> for $1,000).
        </p>
        <p>
          Alternatively, request testnet USDC from the founder team if Basescan
          interaction is not available.
        </p>
      </>
    ),
    code: `# View MockUSDC on Basescan and call mint()
${CHAIN.explorer}/address/${USDC}#writeContract`,
    codeLanguage: 'bash',
  },
  {
    number: 4,
    id: 'h-browse-shields',
    title: 'Browse the 9 shields',
    audience: 'human',
    description: (
      <>
        <p>
          Open <code>/app/human/products</code>. The page reads from
          <code>lib/operate/products.ts</code> and renders all nine V5.1 shields:
          FlashBTC at 1h / 4h / 24h / 48h, FlashETH at 1h / 24h / 48h, MicroDepeg,
          and RateShock. Each card shows the asset, trigger condition, payout
          ratio, and a live capacity figure.
        </p>
      </>
    ),
    frontendRef: {
      label: 'HumanProductsView',
      path: 'components/lumina/redesign/operate/HumanProductsView.tsx',
      url: uiRef('components/lumina/redesign/operate/HumanProductsView.tsx'),
    },
  },
  {
    number: 5,
    id: 'h-read-spec',
    title: 'Read the shield spec',
    audience: 'human',
    description: (
      <>
        <p>
          Click any card to open <code>/app/human/products/[shieldId]</code>. The
          detail page shows: oracle source (Chainlink BTC/USD, ETH/USD, USDT/USD,
          or Aave V3 borrow rate), trigger threshold, observation window, premium
          formula inputs, and the deployed contract address with a Basescan link.
        </p>
      </>
    ),
    frontendRef: {
      label: 'ShieldDetailView',
      path: 'components/lumina/redesign/operate/ShieldDetailView.tsx',
      url: uiRef('components/lumina/redesign/operate/ShieldDetailView.tsx'),
    },
  },
  {
    number: 6,
    id: 'h-quote',
    title: 'Quote a premium',
    audience: 'human',
    description: (
      <>
        <p>
          Type a coverage amount in USDC. The UI calls{' '}
          <code>CoverRouterV2.quotePremium(productId, coverageAmount)</code> and
          renders the premium plus the implied bond payout. The on-chain formula is{' '}
          <code>cover × payoutRatioBps × triggerProbBps × marginBps / 10000³</code>,
          with a 1-unit USDC ($0.000001) floor.
        </p>
      </>
    ),
    contractRef: {
      contract: 'CoverRouterV2.sol',
      line: '284',
      url: protocolRef('src/core/CoverRouterV2.sol', '284'),
    },
  },
  {
    number: 7,
    id: 'h-approve',
    title: 'Approve USDC spending',
    audience: 'human',
    description: (
      <>
        <p>
          Before the first purchase, you must approve the CoverRouterV2 to spend
          USDC on your behalf. The Operate App detects the missing allowance and
          prompts a single ERC-20 <code>approve(spender, amount)</code> call to{' '}
          <code>{COVER_ROUTER}</code>. The next purchase reuses the allowance until
          it is spent down.
        </p>
      </>
    ),
    code: `// What the wallet signs (ethers v6 shape)
USDC.approve(
  "${COVER_ROUTER}",  // CoverRouterV2
  coverageAmount + premium    // enough for the first buy
)`,
    codeLanguage: 'typescript',
  },
  {
    number: 8,
    id: 'h-buy',
    title: 'Buy the policy',
    audience: 'human',
    description: (
      <>
        <p>
          Click "Buy". The wallet signs{' '}
          <code>CoverRouterV2.purchasePolicy(productId, coverageAmount, asset)</code>.
          The contract pulls premium USDC from your wallet, routes it to the
          TWAPBurner (100% burn path), registers the policy in PolicyManagerV2, and
          emits <code>PolicyCreated</code>.
        </p>
      </>
    ),
    contractRef: {
      contract: 'CoverRouterV2.sol',
      line: '146',
      url: protocolRef('src/core/CoverRouterV2.sol', '146'),
    },
  },
  {
    number: 9,
    id: 'h-portfolio',
    title: 'See your active policies',
    audience: 'human',
    description: (
      <>
        <p>
          Open <code>/app/human/portfolio</code>. The page indexes{' '}
          <code>PolicyCreated</code> events from PolicyManagerV2 filtered by your
          address and renders each policy with its product, coverage, premium
          paid, expiry timestamp, and current oracle reading.
        </p>
      </>
    ),
    contractRef: {
      contract: 'PolicyManagerV2.sol',
      line: '101',
      url: protocolRef('src/core/PolicyManagerV2.sol', '101'),
    },
    frontendRef: {
      label: 'PortfolioView',
      path: 'components/lumina/redesign/operate/PortfolioView.tsx',
      url: uiRef('components/lumina/redesign/operate/PortfolioView.tsx'),
    },
  },
  {
    number: 10,
    id: 'h-monitor',
    title: 'Wait for the parametric trigger',
    audience: 'human',
    description: (
      <>
        <p>
          Parametric coverage means there is no claims process. The shield watches
          the oracle continuously; if the trigger condition fires inside the
          observation window, the protocol auto-issues a bond. If it never fires,
          the policy expires and the premium has already been burned.
        </p>
        <p>
          The portfolio page subscribes to <code>PolicyTriggered</code> and{' '}
          <code>PolicyExpired</code> events so the row updates without a refresh.
        </p>
      </>
    ),
    contractRef: {
      contract: 'PolicyManagerV2.sol',
      line: '109-112',
      url: protocolRef('src/core/PolicyManagerV2.sol', '109-112'),
    },
  },
  {
    number: 11,
    id: 'h-receive-bond',
    title: 'Receive your ClaimBond',
    audience: 'human',
    description: (
      <>
        <p>
          When a policy triggers, BondVault mints an ERC-1155 <strong>ClaimBond</strong>
          {' '}to your wallet. One token equals <strong>$1 USD face value at maturity</strong>{' '}
          — values are integer dollars, not 6-decimal USDC. Bonds are grouped into
          monthly maturity epochs; every newly issued bond matures{' '}
          <strong>730 days (24 months)</strong> after issuance.
        </p>
      </>
    ),
    contractRef: {
      contract: 'ClaimBond.sol',
      line: '34',
      url: protocolRef('src/bonds/ClaimBond.sol', '34'),
    },
  },
  {
    number: 12,
    id: 'h-decide',
    title: 'Decide: hold to maturity or list early',
    audience: 'human',
    description: (
      <>
        <p>
          You have two paths once you hold a bond:
        </p>
        <ul>
          <li><strong>Hold to maturity</strong> — wait 730 days, then redeem for <strong>$LUMINA</strong> at maturity (BondVault mints to your wallet).</li>
          <li><strong>List on the marketplace</strong> — sell your bond now to a buyer who is willing to wait. You receive USDC immediately at whatever discount the market clears.</li>
        </ul>
      </>
    ),
  },
  {
    number: 13,
    id: 'h-redeem',
    title: 'Redeem at maturity',
    audience: 'human',
    description: (
      <>
        <p>
          After 730 days, the portfolio shows a "Redeem" button. The wallet signs{' '}
          <code>BondVault.redeemBond(epochId, usdAmount)</code>. The contract burns
          your ERC-1155 balance for that epoch and mints{' '}
          <code>usdAmount × $1 ÷ LUMINA_price</code> worth of <strong>$LUMINA</strong>{' '}
          to the holder. <code>nonReentrant</code>, post-maturity only.
        </p>
      </>
    ),
    contractRef: {
      contract: 'BondVault.sol',
      line: '198',
      url: protocolRef('src/bonds/BondVault.sol', '198'),
    },
  },
  {
    number: 14,
    id: 'h-list',
    title: 'List a bond on the marketplace',
    audience: 'human',
    description: (
      <>
        <p>
          From the portfolio click "List". Set the amount you want to sell and the
          total USDC price you want to receive. The wallet signs an ERC-1155{' '}
          <code>setApprovalForAll</code> for the marketplace (one-time), then{' '}
          <code>LuminaBondMarketplace.list(epochId, amount, priceUSDC)</code>.
        </p>
        <p>
          A 3% fee is taken on every fill and routed back through the TWAPBurner.
        </p>
      </>
    ),
    contractRef: {
      contract: 'LuminaBondMarketplace.sol',
      line: '99',
      url: protocolRef('src/marketplace/LuminaBondMarketplace.sol', '99'),
    },
  },
  {
    number: 15,
    id: 'h-cancel',
    title: 'Cancel an open listing',
    audience: 'human',
    description: (
      <>
        <p>
          From the marketplace tab, find your active listing and click "Cancel".
          The wallet signs <code>LuminaBondMarketplace.cancel(listingId)</code>{' '}
          and the bond returns to your balance. Cancelling is free aside from gas.
        </p>
      </>
    ),
    contractRef: {
      contract: 'LuminaBondMarketplace.sol',
      line: '125',
      url: protocolRef('src/marketplace/LuminaBondMarketplace.sol', '125'),
    },
  },
]

// ════════════════════════════════════════════════════════════════
// AGENT FLOW — REST API + relayer pattern
// ════════════════════════════════════════════════════════════════

export const AGENT_STEPS: AnyStep[] = [
  {
    number: 1,
    id: 'a-key',
    title: 'Request an API key',
    audience: 'agent',
    description: (
      <>
        <p>
          The lumina-api authenticates every write with an <code>x-api-key</code>{' '}
          header. Keys are stored as SHA-256 hashes; the plaintext is shown only
          once at issuance. Each wallet may hold up to 3 active keys.
        </p>
        <p>
          Tier rate limits at the time of writing: <code>free</code> = 10 req/min,{' '}
          <code>paid</code> = 100 req/min.
        </p>
      </>
    ),
    humanRequired: (
      <>
        Key issuance is <strong>self-service via{' '}
        <code>/app/agent/api-keys</code></strong> — connect wallet, sign EIP-712,
        copy your <code>lk_…</code> key.
      </>
    ),
    apiRef: {
      method: 'POST',
      path: '/api/v1/keys/generate',
      file: 'src/routes/keys.ts',
      url: apiRef('src/routes/keys.ts', '16'),
    },
  },
  {
    number: 2,
    id: 'a-env',
    title: 'Configure environment variables',
    audience: 'agent',
    description: (
      <>
        <p>
          Three env vars cover almost every call. The wallet address is the
          <code>buyer</code> field on policy purchases — the relayer pays gas on
          its behalf.
        </p>
      </>
    ),
    samples: [
      {
        label: 'bash',
        language: 'bash',
        code: `export LUMINA_API_KEY="lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export LUMINA_API_URL="${API}"
export WALLET_ADDRESS="0xYourWallet..."`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `import 'dotenv/config'

const API_KEY = process.env.LUMINA_API_KEY!
const API_URL = process.env.LUMINA_API_URL ?? '${API}'
const WALLET = process.env.WALLET_ADDRESS!`,
      },
      {
        label: 'python',
        language: 'python',
        code: `import os
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.environ["LUMINA_API_KEY"]
API_URL = os.environ.get("LUMINA_API_URL", "${API}")
WALLET = os.environ["WALLET_ADDRESS"]`,
      },
    ],
  },
  {
    number: 3,
    id: 'a-health',
    title: 'Health check',
    audience: 'agent',
    description: (
      <>
        <p>
          Always run this on startup before issuing real calls. It returns 200
          with a small JSON payload when the API is reachable, the database is
          healthy, and the relayer wallet has gas.
        </p>
      </>
    ),
    samples: [
      {
        label: 'bash',
        language: 'bash',
        code: `curl -s "$LUMINA_API_URL/health"
# → { "status": "ok", "uptime": <seconds>, "version": "..." }`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `const res = await fetch(\`\${API_URL}/health\`)
if (!res.ok) throw new Error('lumina-api unhealthy')
const body = await res.json()`,
      },
      {
        label: 'python',
        language: 'python',
        code: `import requests
r = requests.get(f"{API_URL}/health", timeout=5)
r.raise_for_status()
print(r.json())`,
      },
    ],
    apiRef: {
      method: 'GET',
      path: '/health',
      file: 'src/routes/health.ts',
      url: apiRef('src/routes/health.ts', '8'),
    },
  },
  {
    number: 4,
    id: 'a-list-products',
    title: 'List the 9 shields',
    audience: 'agent',
    description: (
      <>
        <p>
          Public, no key required. Returns metadata for every active shield —
          productId (bytes32), shield contract address, asset, payout ratio,
          trigger probability, margin, and the latest capacity reading.
        </p>
      </>
    ),
    samples: [
      {
        label: 'bash',
        language: 'bash',
        code: `curl -s "$LUMINA_API_URL/products"`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `type Product = {
  productId: \`0x\${string}\`
  shield: \`0x\${string}\`
  asset: 'BTC' | 'ETH' | 'USDT' | 'AAVE_RATE'
  payoutRatioBps: number
  triggerProbBps: number
  marginBps: number
  capacityUSDC: string
}

const products: Product[] = await fetch(
  \`\${API_URL}/products\`,
).then((r) => r.json())`,
      },
      {
        label: 'python',
        language: 'python',
        code: `r = requests.get(f"{API_URL}/products")
products = r.json()
for p in products:
    print(p["productId"], p["asset"], p["capacityUSDC"])`,
      },
    ],
    apiRef: {
      method: 'GET',
      path: '/products',
      file: 'src/routes/products.ts',
      url: apiRef('src/routes/products.ts', '10'),
    },
  },
  {
    number: 5,
    id: 'a-quote',
    title: 'Quote a premium',
    audience: 'agent',
    description: (
      <>
        <p>
          Public, no key. The API proxies the on-chain{' '}
          <code>CoverRouterV2.quotePremium</code> call so you can size a position
          without a wallet. Cover is in 6-decimal USDC base units.
        </p>
      </>
    ),
    samples: [
      {
        label: 'bash',
        language: 'bash',
        code: `# $1,000 cover = 1_000 * 1e6 = 1000000000 base units
curl -s "$LUMINA_API_URL/products/$PRODUCT_ID/quote?cover=1000000000"`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `const productId = '0x...'
const cover = 1000n * 10n ** 6n
const url = \`\${API_URL}/products/\${productId}/quote?cover=\${cover}\`
const { premium, payout } = await fetch(url).then((r) => r.json())`,
      },
      {
        label: 'python',
        language: 'python',
        code: `cover = 1_000 * 10**6   # $1,000 in base units
r = requests.get(f"{API_URL}/products/{product_id}/quote",
                 params={"cover": cover})
quote = r.json()
print("premium:", quote["premium"], "payout:", quote["payout"])`,
      },
    ],
    apiRef: {
      method: 'GET',
      path: '/products/:productId/quote',
      file: 'src/routes/products.ts',
      url: apiRef('src/routes/products.ts', '34'),
    },
  },
  {
    number: 6,
    id: 'a-buy',
    title: 'Buy a policy via the relayer',
    audience: 'agent',
    description: (
      <>
        <p>
          The protocol's headline agent feature: <strong>the agent never pays
          gas</strong>. The API relayer signs{' '}
          <code>CoverRouterV2.purchasePolicyFor(productId, coverageAmount, asset, buyer)</code>{' '}
          on-chain on the agent's behalf, then writes the receipt to its DB.
        </p>
        <p>
          Always send an <code>Idempotency-Key</code> header so retries on
          network errors do not double-spend.
        </p>
      </>
    ),
    samples: [
      {
        label: 'bash',
        language: 'bash',
        code: `curl -s -X POST "$LUMINA_API_URL/api/v1/policies" \\
  -H "x-api-key: $LUMINA_API_KEY" \\
  -H "content-type: application/json" \\
  -H "idempotency-key: $(uuidgen)" \\
  -d '{
    "productId": "0x...",
    "coverageAmount": "1000000000",
    "asset": "0x4254430000000000000000000000000000000000000000000000000000000000",
    "buyer": "'"$WALLET_ADDRESS"'"
  }'`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `import { randomUUID } from 'crypto'

const res = await fetch(\`\${API_URL}/api/v1/policies\`, {
  method: 'POST',
  headers: {
    'x-api-key': API_KEY,
    'content-type': 'application/json',
    'idempotency-key': randomUUID(),
  },
  body: JSON.stringify({
    productId: '0x...',           // bytes32
    coverageAmount: '1000000000', // string, USDC base units
    asset: '0x...',                // bytes32 ('BTC', 'ETH', ...)
    buyer: WALLET,                 // 0x address
  }),
})
const receipt = await res.json()`,
      },
      {
        label: 'python',
        language: 'python',
        code: `import uuid
res = requests.post(
  f"{API_URL}/api/v1/policies",
  headers={
    "x-api-key": API_KEY,
    "content-type": "application/json",
    "idempotency-key": str(uuid.uuid4()),
  },
  json={
    "productId": "0x...",
    "coverageAmount": "1000000000",
    "asset": "0x...",
    "buyer": WALLET,
  },
  timeout=30,
)
res.raise_for_status()
receipt = res.json()`,
      },
    ],
    apiRef: {
      method: 'POST',
      path: '/api/v1/policies',
      file: 'src/routes/policies.ts',
      url: apiRef('src/routes/policies.ts', '45'),
    },
  },
  {
    number: 7,
    id: 'a-list-policies',
    title: 'List your active policies',
    audience: 'agent',
    description: (
      <>
        <p>
          Returns every policy ever bought by the agent's API key. The handler
          enforces per-agent rate limits via <code>req.agent.id</code>, so the
          counter is tied to the key, not the IP.
        </p>
      </>
    ),
    samples: [
      {
        label: 'bash',
        language: 'bash',
        code: `curl -s "$LUMINA_API_URL/api/v1/policies" \\
  -H "x-api-key: $LUMINA_API_KEY"`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `const policies = await fetch(\`\${API_URL}/api/v1/policies\`, {
  headers: { 'x-api-key': API_KEY },
}).then((r) => r.json())`,
      },
      {
        label: 'python',
        language: 'python',
        code: `policies = requests.get(
  f"{API_URL}/api/v1/policies",
  headers={"x-api-key": API_KEY},
).json()`,
      },
    ],
    apiRef: {
      method: 'GET',
      path: '/api/v1/policies',
      file: 'src/routes/policies.ts',
      url: apiRef('src/routes/policies.ts', '94'),
    },
  },
  {
    number: 8,
    id: 'a-bonds',
    title: 'Query bonds for a wallet',
    audience: 'agent',
    description: (
      <>
        <p>
          Returns the agent's bond positions grouped by epoch, with maturity
          dates and current redeemable status. Filter by <code>status</code>{' '}
          (open / matured / redeemed); paginate via <code>limit</code> and{' '}
          <code>offset</code>.
        </p>
      </>
    ),
    samples: [
      {
        label: 'bash',
        language: 'bash',
        code: `curl -s "$LUMINA_API_URL/api/v1/bonds/$WALLET_ADDRESS?status=matured&limit=50" \\
  -H "x-api-key: $LUMINA_API_KEY"`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `const url = new URL(\`\${API_URL}/api/v1/bonds/\${WALLET}\`)
url.searchParams.set('status', 'matured')
url.searchParams.set('limit', '50')

const bonds = await fetch(url, {
  headers: { 'x-api-key': API_KEY },
}).then((r) => r.json())`,
      },
      {
        label: 'python',
        language: 'python',
        code: `bonds = requests.get(
  f"{API_URL}/api/v1/bonds/{WALLET}",
  headers={"x-api-key": API_KEY},
  params={"status": "matured", "limit": 50},
).json()`,
      },
    ],
    apiRef: {
      method: 'GET',
      path: '/api/v1/bonds/:wallet',
      file: 'src/routes/bonds.ts',
      url: apiRef('src/routes/bonds.ts', '24'),
    },
  },
  {
    number: 9,
    id: 'a-redeem',
    title: 'Redeem a matured bond',
    audience: 'agent',
    description: (
      <>
        <p>
          Unlike policy purchase, redemption is <strong>not</strong> relayer-paid
          — the agent (or its operator wallet) signs{' '}
          <code>BondVault.redeemBond(epochId, usdAmount)</code> on-chain.
          BondVault mints <strong>$LUMINA</strong> (not USDC) to the holder at
          the current oracle price:{' '}
          <code>luminaAmount = usdAmount / LUMINA_price</code>. After the tx
          confirms, post the txHash to the API so the redemption is indexed and
          surfaced in subsequent <code>/bonds</code> queries.
        </p>
      </>
    ),
    humanRequired: (
      <>
        Bonds redeem only after the 730-day maturity window. The agent's
        operator wallet must hold a small amount of ETH for the on-chain
        redeem call. The relayer does not cover this.
      </>
    ),
    samples: [
      {
        label: 'bash',
        language: 'bash',
        code: `curl -s -X POST "$LUMINA_API_URL/api/v1/redeem" \\
  -H "x-api-key: $LUMINA_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{
    "epochId": "1735603200",
    "usdAmount": "800",
    "txHash": "0x...",
    "ownerAddress": "'"$WALLET_ADDRESS"'"
  }'`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `// 1) sign on-chain (pseudo, using viem)
// const txHash = await walletClient.writeContract({
//   address: '${BOND_VAULT}',
//   abi: BondVaultAbi,
//   functionName: 'redeemBond',
//   args: [epochId, usdAmount],
// })

// 2) register with the API
await fetch(\`\${API_URL}/api/v1/redeem\`, {
  method: 'POST',
  headers: {
    'x-api-key': API_KEY,
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    epochId: epochId.toString(),
    usdAmount: usdAmount.toString(),
    txHash,
    ownerAddress: WALLET,
  }),
})`,
      },
      {
        label: 'python',
        language: 'python',
        code: `# 1) sign on-chain with web3.py first, get txHash

# 2) register the redemption
requests.post(
  f"{API_URL}/api/v1/redeem",
  headers={"x-api-key": API_KEY, "content-type": "application/json"},
  json={
    "epochId": str(epoch_id),
    "usdAmount": str(usd_amount),
    "txHash": tx_hash,
    "ownerAddress": WALLET,
  },
)`,
      },
    ],
    apiRef: {
      method: 'POST',
      path: '/api/v1/redeem',
      file: 'src/routes/redeem.ts',
      url: apiRef('src/routes/redeem.ts', '31'),
    },
    contractRef: {
      contract: 'BondVault.sol',
      line: '198',
      url: protocolRef('src/bonds/BondVault.sol', '198'),
    },
  },
  {
    number: 10,
    id: 'a-list-marketplace',
    title: 'List a bond on the marketplace',
    audience: 'agent',
    description: (
      <>
        <p>
          Same shape as redeem: sign{' '}
          <code>LuminaBondMarketplace.list(epochId, amount, totalPriceUsdc)</code>{' '}
          on-chain, then notify the API with the resulting txHash so the listing
          is indexed.
        </p>
      </>
    ),
    samples: [
      {
        label: 'bash',
        language: 'bash',
        code: `curl -s -X POST "$LUMINA_API_URL/api/v1/marketplace/list" \\
  -H "x-api-key: $LUMINA_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{
    "txHash": "0x...",
    "bondId": "1735603200",
    "amount": "500",
    "totalPriceUsdc": "475000000"
  }'`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `// after on-chain Marketplace.list(epochId, amount, totalPriceUsdc)
await fetch(\`\${API_URL}/api/v1/marketplace/list\`, {
  method: 'POST',
  headers: {
    'x-api-key': API_KEY,
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    txHash,
    bondId: epochId.toString(),
    amount: amount.toString(),
    totalPriceUsdc: totalPriceUsdc.toString(),
  }),
})`,
      },
      {
        label: 'python',
        language: 'python',
        code: `requests.post(
  f"{API_URL}/api/v1/marketplace/list",
  headers={"x-api-key": API_KEY, "content-type": "application/json"},
  json={
    "txHash": tx_hash,
    "bondId": str(epoch_id),
    "amount": str(amount),
    "totalPriceUsdc": str(total_price_usdc),
  },
)`,
      },
    ],
    apiRef: {
      method: 'POST',
      path: '/api/v1/marketplace/list',
      file: 'src/routes/marketplace.ts',
      url: apiRef('src/routes/marketplace.ts', '36'),
    },
    contractRef: {
      contract: 'LuminaBondMarketplace.sol',
      line: '99',
      url: protocolRef('src/marketplace/LuminaBondMarketplace.sol', '99'),
    },
  },
  {
    number: 11,
    id: 'a-buy-marketplace',
    title: 'Buy from the marketplace',
    audience: 'agent',
    description: (
      <>
        <p>
          Mirror of the list flow. Sign{' '}
          <code>LuminaBondMarketplace.executeBuy(listingId)</code>, then post the
          txHash so the API records the trade and updates listing state.
          Cancellation is on-chain only (<code>Marketplace.cancel(listingId)</code>);
          there is no API endpoint for it.
        </p>
      </>
    ),
    samples: [
      {
        label: 'bash',
        language: 'bash',
        code: `curl -s -X POST "$LUMINA_API_URL/api/v1/marketplace/buy" \\
  -H "x-api-key: $LUMINA_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{
    "txHash": "0x...",
    "listingId": "42",
    "buyerAddress": "'"$WALLET_ADDRESS"'",
    "amount": "500",
    "totalPaidUsdc": "475000000"
  }'`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `// after on-chain Marketplace.executeBuy(listingId)
await fetch(\`\${API_URL}/api/v1/marketplace/buy\`, {
  method: 'POST',
  headers: {
    'x-api-key': API_KEY,
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    txHash,
    listingId: listingId.toString(),
    buyerAddress: WALLET,
    amount: amount.toString(),
    totalPaidUsdc: totalPaidUsdc.toString(),
  }),
})`,
      },
      {
        label: 'python',
        language: 'python',
        code: `requests.post(
  f"{API_URL}/api/v1/marketplace/buy",
  headers={"x-api-key": API_KEY, "content-type": "application/json"},
  json={
    "txHash": tx_hash,
    "listingId": str(listing_id),
    "buyerAddress": WALLET,
    "amount": str(amount),
    "totalPaidUsdc": str(total_paid_usdc),
  },
)`,
      },
    ],
    apiRef: {
      method: 'POST',
      path: '/api/v1/marketplace/buy',
      file: 'src/routes/marketplace.ts',
      url: apiRef('src/routes/marketplace.ts', '98'),
    },
  },
  {
    number: 12,
    id: 'a-errors',
    title: 'Errors, retries, and idempotency',
    audience: 'agent',
    description: (
      <>
        <p>
          Every error response carries a structured shape:{' '}
          <code>{`{ error, code, statusCode }`}</code>. Common codes:
        </p>
        <ul>
          <li><code>missing_api_key</code> / <code>invalid_api_key</code> (401)</li>
          <li><code>rate_limited</code> (429) — back off, respect <code>Retry-After</code></li>
          <li><code>validation_error</code> / <code>invalid_address</code> (400)</li>
          <li><code>duplicate_listing</code> / <code>duplicate_redemption</code> (409)</li>
          <li><code>relayer_failed</code> (502) — safe to retry with same idempotency key</li>
        </ul>
        <p>
          Always send an <code>Idempotency-Key</code> on POSTs and reuse it on
          retry — the API will return the cached response instead of submitting a
          second on-chain tx.
        </p>
      </>
    ),
    samples: [
      {
        label: 'typescript',
        language: 'typescript',
        code: `async function postWithRetry<T>(url: string, body: unknown, idempotencyKey: string): Promise<T> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'content-type': 'application/json',
        'idempotency-key': idempotencyKey,
      },
      body: JSON.stringify(body),
    })
    if (res.ok) return res.json() as Promise<T>

    const retryable = res.status === 429 || res.status >= 500
    if (!retryable) throw new Error(\`fatal: \${res.status} \${await res.text()}\`)

    const wait = Math.min(2 ** attempt * 250, 4000)
    await new Promise((r) => setTimeout(r, wait))
  }
  throw new Error('exhausted retries')
}`,
      },
      {
        label: 'python',
        language: 'python',
        code: `import time, requests

def post_with_retry(url, body, idempotency_key, max_attempts=4):
    for attempt in range(max_attempts):
        r = requests.post(
            url,
            headers={
                "x-api-key": API_KEY,
                "content-type": "application/json",
                "idempotency-key": idempotency_key,
            },
            json=body,
            timeout=30,
        )
        if r.ok:
            return r.json()
        if r.status_code != 429 and r.status_code < 500:
            r.raise_for_status()
        time.sleep(min(2 ** attempt * 0.25, 4))
    raise RuntimeError("exhausted retries")`,
      },
    ],
  },
]
