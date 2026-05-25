// Tutorial step content. Every contract / API citation is verified
// against org-lumina/LUMINA-PROTOCOL@main and org-lumina/lumina-api@main.
// If a number on this page disagrees with those repos, the source wins.
//
// V5.3 (Sprint T-30c, deployed 2026-05-21 on Base Sepolia).
// Five tutorials, in this order:
//   HUMAN flow (wallet)
//     1. Buy your first policy
//     2. Redeem a bond
//     3. Marketplace P2P
//   AGENT flow (off-chain)
//     4. API integration
//     5. SDK v0.6.0

import type { TutorialStepProps } from '@/components/lumina/redesign/TutorialStep'
import { FaucetButton } from '@/components/lumina/redesign/Faucet'
import { CHAIN, LUMINA_API_URL } from '@/lib/lumina-config'

const PROTOCOL_REPO = 'https://github.com/org-lumina/LUMINA-PROTOCOL'
const API_REPO = 'https://github.com/org-lumina/lumina-api'
const SDK_REPO = 'https://github.com/org-lumina/lumina-sdk'
const FRONTEND_REPO = 'https://github.com/org-lumina/v0-lumina-landing-page'

function protocolRef(file: string, line: string) {
  return `${PROTOCOL_REPO}/blob/main/${file}#L${line.replace(/-/g, '-L')}`
}
function apiRef(file: string, line: string) {
  return `${API_REPO}/blob/main/${file}#L${line.replace(/-/g, '-L')}`
}
function sdkRef(file: string) {
  return `${SDK_REPO}/blob/main/${file}`
}
function uiRef(path: string) {
  return `${FRONTEND_REPO}/blob/main/${path}`
}

// V5.3 (Sprint T-30c, deployed 2026-05-21). Inlined here intentionally —
// `lib/lumina-config.ts` still holds zero-address sentinels from Sprint Z.2
// pre-redeploy cleanup. Replace with `useContracts()` once the snapshot is
// refreshed; until then these are the source of truth for the tutorial.
const COVER_ROUTER = '0xcdB70B40e6a3DEac3189185d947A0e458518F566'
const POLICY_MANAGER = '0x546C07e07DeBCdbf7a2A7Ef12C38c8c8fcAFcDd8'
const BOND_VAULT = '0x193acBc1EdC5E565a4aBE96941C7E7AeF637B6EC'
const CLAIM_BOND = '0xaa57Ab52Eb00f296Ad4CFA9E9c201f3737271FB4'
const MARKETPLACE = '0x0938205f4cBe5F572656533FC930FFce6F5F4345'
const API = LUMINA_API_URL

// FlashShieldAdapter UUPS proxies — one per active flash shield (V5.3).
const ADAPTER_FLASH_BTC_1H = '0x5d50310B9166184e822cD5368F51C1409713054f'
const ADAPTER_FLASH_BTC_24H = '0x475b3F712707F61824122a94fE78b106260F8882'
const ADAPTER_FLASH_BTC_48H = '0xdc6387E86F7D852D1f99F4009cFd8AdC2d500298'
const ADAPTER_FLASH_ETH_1H = '0x57869AD3E7C56B0c96F357179DD231b407C88338'
const ADAPTER_FLASH_ETH_24H = '0x4fD09cF98F6814Cc8b33C2E491429f59d0bCf089'
const ADAPTER_FLASH_ETH_48H = '0x9696CFFD7dE8B1e16F83Dcc798c5CE69a61C884C'

export type Audience = 'human' | 'agent'
export type AnyStep = Omit<TutorialStepProps, 'audience'> & { audience: Audience }

// One-shot reminder rendered above the step list. The on-chain ABI uses one
// `asset` argument to identify the covered asset (BTC / ETH encoded as
// bytes32). Premium is always pulled in USDC, regardless of the covered
// asset. Keep this in sync with components/lumina/redesign/Products.tsx.
export const PURCHASE_ASSET_NOTICE = {
  title: 'Premium is always paid in USDC',
  body: 'The on-chain `asset` field identifies the COVERED asset (BTC or ETH for the six V5.3 flash shields). It is not the payment currency. CoverRouter.purchasePolicy pulls premium in USDC from your wallet (or the relayer wallet for agents). Minimum coverage is $100 — `coverageAmount < 100e6` reverts on-chain.',
} as const

// ════════════════════════════════════════════════════════════════
// HUMAN FLOW — wallet + on-chain calls via the Operate App
// Tutorial 1: Buy your first policy   (steps 01-07)
// Tutorial 2: Redeem a bond           (steps 08-11)
// Tutorial 3: Marketplace P2P         (steps 12-15)
// ════════════════════════════════════════════════════════════════

export const HUMAN_STEPS: AnyStep[] = [
  // ─── Tutorial 1: Buy your first policy ──────────────────────────
  {
    number: 1,
    id: 'h-connect-wallet',
    title: 'Tutorial 1 · Connect your wallet',
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
        <p>
          Make sure your wallet is on <strong>Base Sepolia</strong> (chain id{' '}
          <code>{CHAIN.id}</code>, RPC <code>{CHAIN.rpc}</code>). If you are on
          the wrong network, the Operate App shows a one-click switch button
          (wagmi's <code>useSwitchChain</code>). Block explorer:{' '}
          <a
            href={CHAIN.explorer}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--rd-accent)' }}
          >
            {CHAIN.explorer}
          </a>
          .
        </p>
        <p>
          <strong>Need test funds?</strong> Once connected, click below to
          claim <strong>10,000 mock USDC</strong> + <strong>0.05 ETH</strong>{' '}
          on Base Sepolia. One claim per wallet per 24h. The dedicated{' '}
          <a href="/faucet" style={{ color: 'var(--rd-accent)' }}>
            /faucet
          </a>{' '}
          page also exposes the global cap and the MockUSDC contract address
          if you need to add it to your wallet manually.
        </p>
        <FaucetButton />
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
    id: 'h-browse-products',
    title: 'Tutorial 1 · Pick a product (6 flash shields)',
    audience: 'human',
    description: (
      <>
        <p>
          Open <code>/app/human/products</code>. V5.3 ships <strong>6 active
          flash shields</strong> — three BTC durations (1h / 24h / 48h) and
          three ETH durations (1h / 24h / 48h). Pick the one whose trigger and
          window matches the move you want to be covered against. For this
          walkthrough we use <strong>Flash BTC 24h</strong>: triggers when
          BTC drops ≥6% inside a 24-hour observation window.
        </p>
        <table style={{ width: '100%', fontSize: 13, marginTop: 8 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Product</th>
              <th style={{ textAlign: 'left' }}>Trigger</th>
              <th style={{ textAlign: 'left' }}>Window</th>
              <th style={{ textAlign: 'left' }}>Premium /$1k</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Flash BTC 1h</td><td>BTC −2.5%</td><td>1h</td><td>$2.92</td></tr>
            <tr><td>Flash BTC 24h</td><td>BTC −6%</td><td>24h</td><td>$52.60</td></tr>
            <tr><td>Flash BTC 48h</td><td>BTC −10%</td><td>48h</td><td>$148.67</td></tr>
            <tr><td>Flash ETH 1h</td><td>ETH −4%</td><td>1h</td><td>$1.68</td></tr>
            <tr><td>Flash ETH 24h</td><td>ETH −8.5%</td><td>24h</td><td>$45.80</td></tr>
            <tr><td>Flash ETH 48h</td><td>ETH −14%</td><td>48h</td><td>$123.01</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: 8 }}>
          Payout = <strong>80% of coverage</strong>, 20% deductible, margin
          factor 2.00× baked into the premium. Click any card to see the
          oracle source (Chainlink BTC/USD or ETH/USD), the deployed adapter
          address and a Basescan link.
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
    number: 3,
    id: 'h-quote',
    title: 'Tutorial 1 · Quote your premium',
    audience: 'human',
    description: (
      <>
        <p>
          Type the coverage amount in USDC. The UI calls{' '}
          <code>CoverRouter.quotePremium(productId, coverageAmount)</code> and
          renders the premium plus the implied payout (80% of coverage).
        </p>
        <p>
          For <strong>$1,000 of Flash BTC 24h</strong> the premium is{' '}
          <strong>$52.60</strong> (passed as <code>52_600_000</code> in 6-decimal
          USDC base units). Coverage must be ≥ <strong>$100</strong> — calls
          with <code>coverageAmount &lt; 100e6</code> revert with{' '}
          <code>CoverageBelowMin</code>. The upper bound is the protocol-wide{' '}
          <code>BondVault.availableCapacityUSD()</code> reading shown live on
          the product card.
        </p>
      </>
    ),
    contractRef: {
      contract: 'CoverRouter.sol',
      line: '284',
      url: protocolRef('src/core/CoverRouter.sol', '284'),
    },
  },
  {
    number: 4,
    id: 'h-approve',
    title: 'Tutorial 1 · Approve USDC',
    audience: 'human',
    description: (
      <>
        <p>
          Before the first purchase, you must approve the CoverRouter to spend
          USDC on your behalf. The Operate App detects the missing allowance and
          prompts a single ERC-20 <code>approve(spender, amount)</code> call to{' '}
          <code>{COVER_ROUTER}</code>. The next purchase reuses the allowance
          until it is spent down.
        </p>
      </>
    ),
    code: `// What the wallet signs (ethers v6 shape)
USDC.approve(
  "${COVER_ROUTER}",  // CoverRouter (V5.3)
  premium             // $52.60 = 52_600_000 base units for $1k Flash BTC 24h
)`,
    codeLanguage: 'typescript',
  },
  {
    number: 5,
    id: 'h-buy',
    title: 'Tutorial 1 · Buy the policy',
    audience: 'human',
    description: (
      <>
        <p>
          Click "Buy". The wallet signs{' '}
          <code>CoverRouter.purchasePolicy(productId, coverageAmount, asset)</code>.
          The contract pulls premium USDC from your wallet, routes it to the
          TWAPBurner (100% burn path), registers the policy in PolicyManager,
          and emits <code>PolicyCreated</code>.
        </p>
        <p>
          Below is the raw call for the running example ($1,000 of Flash BTC
          24h). In practice the Operate App fills in the bytes32 productId for
          you from <code>/api/v1/products</code>.
        </p>
      </>
    ),
    code: `// CoverRouter.purchasePolicy at ${COVER_ROUTER}
purchasePolicy(
  productId,            // bytes32 — "FLASHBTC24-001" from /api/v1/products
  1_000_000_000,        // 1000 USDC = $1,000 coverage (6 decimals)
  0x4254430000000000000000000000000000000000000000000000000000000000  // "BTC"
)
// → pulls $52.60 USDC premium, emits PolicyCreated
// → adapter ${ADAPTER_FLASH_BTC_24H} arms the policy`,
    codeLanguage: 'typescript',
    contractRef: {
      contract: 'CoverRouter.sol',
      line: '146',
      url: protocolRef('src/core/CoverRouter.sol', '146'),
    },
  },
  {
    number: 6,
    id: 'h-portfolio',
    title: 'Tutorial 1 · See your active policy',
    audience: 'human',
    description: (
      <>
        <p>
          Open <code>/app/human/portfolio</code>. The page indexes{' '}
          <code>PolicyCreated</code> events from PolicyManager (
          <code>{POLICY_MANAGER}</code>) filtered by your address and renders
          each policy with its product, coverage, premium paid, expiry, and
          current oracle reading. The row also subscribes to{' '}
          <code>PolicyTriggered</code> and <code>PolicyExpired</code> so it
          updates without a refresh.
        </p>
      </>
    ),
    contractRef: {
      contract: 'PolicyManager.sol',
      line: '101',
      url: protocolRef('src/core/PolicyManager.sol', '101'),
    },
    frontendRef: {
      label: 'PortfolioView',
      path: 'components/lumina/redesign/operate/PortfolioView.tsx',
      url: uiRef('components/lumina/redesign/operate/PortfolioView.tsx'),
    },
  },
  {
    number: 7,
    id: 'h-trigger',
    title: 'Tutorial 1 · Parametric trigger → ClaimBond',
    audience: 'human',
    description: (
      <>
        <p>
          Parametric coverage means <strong>no claims process</strong>. The
          shield adapter watches the Chainlink oracle continuously; if the
          trigger condition fires inside the observation window, the protocol
          auto-issues a bond. If it never fires, the policy expires and the
          premium has already been burned.
        </p>
        <p>
          When a policy triggers, BondVault mints an ERC-1155 <strong>ClaimBond</strong>{' '}
          (token contract <code>{CLAIM_BOND}</code>) to your wallet. One token =
          <strong> $1 USD face value at maturity</strong>; bonds are grouped
          into monthly maturity epochs and mature <strong>730 days (24
          months)</strong> after issuance.
        </p>
      </>
    ),
    contractRef: {
      contract: 'ClaimBond.sol',
      line: '34',
      url: protocolRef('src/bonds/ClaimBond.sol', '34'),
    },
  },

  // ─── Tutorial 2: Redeem a bond ─────────────────────────────────
  {
    number: 8,
    id: 'h-redeem-wait',
    title: 'Tutorial 2 · Wait for maturity (730 days)',
    audience: 'human',
    description: (
      <>
        <p>
          Every bond is issued with a <strong>730-day maturity</strong>. The
          portfolio shows the maturity timestamp on each row; the "Redeem"
          button stays disabled until the bond's monthly epoch is past maturity
          (e.g. an epoch with id <code>202805</code> matures at the start of
          May 2028).
        </p>
        <p>
          Bonds in the same epoch are fungible ERC-1155 tokens — you can hold
          part, redeem part, and list part on the marketplace independently.
        </p>
      </>
    ),
  },
  {
    number: 9,
    id: 'h-redeem-call',
    title: 'Tutorial 2 · Call redeemBond(epochId, usdAmount)',
    audience: 'human',
    description: (
      <>
        <p>
          After maturity, the portfolio's "Redeem" button signs{' '}
          <code>BondVault.redeemBond(epochId, usdAmount)</code> on BondVault{' '}
          (<code>{BOND_VAULT}</code>). The contract burns your ERC-1155 balance
          for that epoch and mints{' '}
          <code>usdAmount × $1 ÷ LUMINA_price</code> worth of{' '}
          <strong>$LUMINA</strong> to the holder. The call is{' '}
          <code>nonReentrant</code> and post-maturity only.
        </p>
      </>
    ),
    code: `// BondVault at ${BOND_VAULT}
redeemBond(
  202805,        // epochId — May 2028 maturity bucket
  800            // usdAmount — $800 face value (integer dollars, not 6 decimals)
)
// → burns 800 ERC-1155 units of epoch 202805 from msg.sender
// → mints 800 / LUMINA_price worth of $LUMINA to msg.sender`,
    codeLanguage: 'typescript',
    contractRef: {
      contract: 'BondVault.sol',
      line: '198',
      url: protocolRef('src/bonds/BondVault.sol', '198'),
    },
  },
  {
    number: 10,
    id: 'h-redeem-throttle',
    title: 'Tutorial 2 · Epoch throttle (1.08% / week)',
    audience: 'human',
    description: (
      <>
        <p>
          Each maturity epoch has a redeem throttle: <strong>1.08% of the
          epoch supply can be redeemed per week</strong>. If your call would
          push the epoch above its weekly cap, the request is split:
        </p>
        <ul>
          <li>
            The portion <em>within</em> the cap mints $LUMINA immediately.
          </li>
          <li>
            The portion <em>over</em> the cap goes into a <strong>FIFO
            queue</strong> for the next epoch slot. Your ERC-1155 balance is
            <strong> burned at queue time</strong> (so you cannot double-spend
            it), and $LUMINA is delivered when the queue is processed.
          </li>
        </ul>
        <p>
          The portfolio shows queued amounts and the projected delivery slot
          for every pending redemption.
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
    number: 11,
    id: 'h-redeem-receive',
    title: 'Tutorial 2 · Receive $LUMINA',
    audience: 'human',
    description: (
      <>
        <p>
          BondVault mints $LUMINA at the oracle price recorded at <em>delivery
          time</em>, not at redemption call time — this protects the protocol
          from MEV during throttled epochs. Once minted, the tokens land in
          your wallet; you can transfer, stake, or hold as any ERC-20.
        </p>
      </>
    ),
  },

  // ─── Tutorial 3: Marketplace P2P ───────────────────────────────
  {
    number: 12,
    id: 'h-mkt-overview',
    title: 'Tutorial 3 · Why the marketplace exists',
    audience: 'human',
    description: (
      <>
        <p>
          Bonds mature in 730 days. If you want USDC sooner, the{' '}
          <strong>LuminaBondMarketplace</strong> (<code>{MARKETPLACE}</code>)
          lets you sell your ERC-1155 bond position to any buyer who is willing
          to wait. The marketplace is on-chain, permissionless and settles in
          USDC.
        </p>
        <p>
          A flat <strong>2% fee</strong> is taken on every fill. The fee is
          <strong> burned by the protocol</strong> (routed through the
          TWAPBurner), not paid to a treasury.
        </p>
      </>
    ),
  },
  {
    number: 13,
    id: 'h-mkt-list',
    title: 'Tutorial 3 · List your bond',
    audience: 'human',
    description: (
      <>
        <p>
          From the portfolio click "List". Set the amount you want to sell and
          the total USDC price you want to receive. The wallet signs two
          transactions:
        </p>
        <ol>
          <li>
            <code>ClaimBond.setApprovalForAll({MARKETPLACE}, true)</code> — one
            time per wallet.
          </li>
          <li>
            <code>LuminaBondMarketplace.list(epochId, amount, totalPriceUsdc)</code>
            {' '}— creates the listing.
          </li>
        </ol>
        <p>
          The bond is held in escrow by the marketplace contract until the
          listing is filled or cancelled. Cancelling is free aside from gas:{' '}
          <code>LuminaBondMarketplace.cancel(listingId)</code>.
        </p>
      </>
    ),
    code: `// LuminaBondMarketplace at ${MARKETPLACE}
list(
  202805,         // epochId
  500,            // amount — 500 ERC-1155 units = $500 face value
  475_000_000     // totalPriceUsdc — $475 (6 decimals) → 5% discount to face
)
// → moves 500 bonds into escrow, emits Listed(listingId, ...)`,
    codeLanguage: 'typescript',
    contractRef: {
      contract: 'LuminaBondMarketplace.sol',
      line: '99',
      url: protocolRef('src/marketplace/LuminaBondMarketplace.sol', '99'),
    },
  },
  {
    number: 14,
    id: 'h-mkt-buy',
    title: 'Tutorial 3 · Buy a listing',
    audience: 'human',
    description: (
      <>
        <p>
          Browse open listings at <code>/app/human/marketplace</code>. Click
          "Buy" on any row; the wallet first <code>approves</code> USDC for the
          marketplace (one-time) and then signs{' '}
          <code>LuminaBondMarketplace.executeBuy(listingId)</code>. In a single
          atomic transaction the contract:
        </p>
        <ol>
          <li>Pulls the total USDC price from the buyer.</li>
          <li>Pays 98% of it to the seller.</li>
          <li>Routes the remaining 2% to the TWAPBurner (fee burn).</li>
          <li>Transfers the ERC-1155 bonds from escrow to the buyer.</li>
        </ol>
        <p>
          The buyer now holds the bond and can redeem it at maturity, or
          re-list it.
        </p>
      </>
    ),
    contractRef: {
      contract: 'LuminaBondMarketplace.sol',
      line: '146',
      url: protocolRef('src/marketplace/LuminaBondMarketplace.sol', '146'),
    },
  },
  {
    number: 15,
    id: 'h-mkt-cancel',
    title: 'Tutorial 3 · Cancel a listing',
    audience: 'human',
    description: (
      <>
        <p>
          From the marketplace tab, find your active listing and click "Cancel".
          The wallet signs <code>LuminaBondMarketplace.cancel(listingId)</code>{' '}
          and the bond returns to your balance. Cancelling is free aside from
          gas. Partial fills are supported on the seller side — if half of a
          listing is filled and you cancel, the remaining half returns to your
          wallet.
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
// Tutorial 4: API integration   (steps 01-07)
// Tutorial 5: SDK v0.6.0        (steps 08-13)
// ════════════════════════════════════════════════════════════════

export const AGENT_STEPS: AnyStep[] = [
  // ─── Tutorial 4: API integration ───────────────────────────────
  {
    number: 1,
    id: 'a-key',
    title: 'Tutorial 4 · Request an API key',
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
    title: 'Tutorial 4 · Configure environment',
    audience: 'agent',
    description: (
      <>
        <p>
          Three env vars cover almost every call. The wallet address is the{' '}
          <code>buyer</code> field on policy purchases — the relayer pays gas
          on its behalf.
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
    title: 'Tutorial 4 · GET /health (resolve contracts at runtime)',
    audience: 'agent',
    description: (
      <>
        <p>
          Always run this on startup before issuing real calls. <code>/health</code>{' '}
          returns 200 with a JSON payload that includes the <strong>live
          contract addresses</strong> (CoverRouter, PolicyManager, BondVault,
          ClaimBond, Marketplace, LuminaToken). Always read addresses from{' '}
          <code>/health</code> at runtime so a redeploy never desyncs your bot.
        </p>
      </>
    ),
    samples: [
      {
        label: 'bash',
        language: 'bash',
        code: `curl -s "$LUMINA_API_URL/health" | jq
# →
# {
#   "status": "ok",
#   "version": "...",
#   "contracts": {
#     "CoverRouter":   "${COVER_ROUTER}",
#     "PolicyManager": "${POLICY_MANAGER}",
#     "BondVault":     "${BOND_VAULT}",
#     "ClaimBond":     "${CLAIM_BOND}",
#     "Marketplace":   "${MARKETPLACE}"
#   }
# }`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `const res = await fetch(\`\${API_URL}/health\`)
if (!res.ok) throw new Error('lumina-api unhealthy')
const { contracts } = await res.json()
const COVER_ROUTER = contracts.CoverRouter as \`0x\${string}\``,
      },
      {
        label: 'python',
        language: 'python',
        code: `import requests
r = requests.get(f"{API_URL}/health", timeout=5)
r.raise_for_status()
body = r.json()
COVER_ROUTER = body["contracts"]["CoverRouter"]`,
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
    title: 'Tutorial 4 · GET /products',
    audience: 'agent',
    description: (
      <>
        <p>
          Public, no key required. Returns metadata for every shield in the
          catalogue. <strong>V5.3 returns 7 rows</strong>: the 6 active flash
          shields (FlashBTC 1h / 24h / 48h and FlashETH 1h / 24h / 48h) plus{' '}
          <strong>1 RateShock entry that is currently paused</strong> — check{' '}
          <code>status === "active"</code> before quoting.
        </p>
      </>
    ),
    samples: [
      {
        label: 'bash',
        language: 'bash',
        code: `curl -s "$LUMINA_API_URL/products" | jq '.[] | {name, status, premiumPer1k}'`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `type Product = {
  productId: \`0x\${string}\`
  name: string                          // e.g. "FLASHBTC24-001"
  status: 'active' | 'paused'
  asset: 'BTC' | 'ETH'
  adapter: \`0x\${string}\`
  premiumPer1k: number                  // USDC, e.g. 52.60
  triggerBps: number                    // e.g. 600 = -6%
  windowSeconds: number                 // e.g. 86_400 for 24h
}

const products: Product[] = await fetch(
  \`\${API_URL}/products\`,
).then((r) => r.json())

const flashBtc24h = products.find(
  (p) => p.name === 'FLASHBTC24-001' && p.status === 'active',
)`,
      },
      {
        label: 'python',
        language: 'python',
        code: `r = requests.get(f"{API_URL}/products")
products = r.json()
flash_btc_24h = next(
  p for p in products
  if p["name"] == "FLASHBTC24-001" and p["status"] == "active"
)`,
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
    title: 'Tutorial 4 · Quote a premium',
    audience: 'agent',
    description: (
      <>
        <p>
          Public, no key. The API proxies the on-chain{' '}
          <code>CoverRouter.quotePremium</code> call so you can size a position
          without a wallet. Cover is in 6-decimal USDC base units.{' '}
          <code>cover &lt; 100e6</code> returns 400 (
          <code>coverage_below_min</code>); the upper bound is{' '}
          <code>BondVault.availableCapacityUSD()</code>.
        </p>
      </>
    ),
    samples: [
      {
        label: 'bash',
        language: 'bash',
        code: `# $1,000 cover = 1_000 * 1e6 = 1000000000 base units
curl -s "$LUMINA_API_URL/products/$PRODUCT_ID/quote?cover=1000000000"
# → { "premium": "52600000", "payout": "800000000" }   # $52.60 / $800`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `const cover = 1000n * 10n ** 6n
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
    title: 'Tutorial 4 · POST /policies (relayer flow)',
    audience: 'agent',
    description: (
      <>
        <p>
          The protocol's headline agent feature: <strong>the agent never pays
          gas</strong>. The API relayer signs{' '}
          <code>CoverRouter.purchasePolicyFor(productId, coverageAmount, asset, buyer)</code>{' '}
          on-chain on the agent's behalf, then writes the receipt to its DB.
          The agent's only responsibility is to fund the buyer wallet with
          enough USDC to cover the premium (the relayer cannot top up USDC).
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
        code: `curl -s -X POST "$LUMINA_API_URL/policies" \\
  -H "x-api-key: $LUMINA_API_KEY" \\
  -H "content-type: application/json" \\
  -H "idempotency-key: $(uuidgen)" \\
  -d '{
    "productName": "FLASHBTC24-001",
    "coverageAmount": "1000000000",
    "buyer": "'"$WALLET_ADDRESS"'"
  }'
# → { "txHash": "0x...", "policyId": "...", "premium": "52600000" }`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `import { randomUUID } from 'crypto'

const res = await fetch(\`\${API_URL}/policies\`, {
  method: 'POST',
  headers: {
    'x-api-key': API_KEY,
    'content-type': 'application/json',
    'idempotency-key': randomUUID(),
  },
  body: JSON.stringify({
    productName: 'FLASHBTC24-001',
    coverageAmount: '1000000000',     // 6-decimal USDC base units
    buyer: WALLET,
  }),
})
const receipt = await res.json()`,
      },
      {
        label: 'python',
        language: 'python',
        code: `import uuid
res = requests.post(
  f"{API_URL}/policies",
  headers={
    "x-api-key": API_KEY,
    "content-type": "application/json",
    "idempotency-key": str(uuid.uuid4()),
  },
  json={
    "productName": "FLASHBTC24-001",
    "coverageAmount": "1000000000",
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
      path: '/policies',
      file: 'src/routes/policies.ts',
      url: apiRef('src/routes/policies.ts', '45'),
    },
  },
  {
    number: 7,
    id: 'a-bonds',
    title: 'Tutorial 4 · GET /bonds/{wallet}',
    audience: 'agent',
    description: (
      <>
        <p>
          Returns the wallet's bond positions grouped by epoch, with maturity
          dates and current redeemable status. Filter by <code>status</code>{' '}
          (<code>open</code>, <code>matured</code>, <code>redeemed</code>,{' '}
          <code>queued</code>); paginate via <code>limit</code> and{' '}
          <code>offset</code>.
        </p>
      </>
    ),
    samples: [
      {
        label: 'bash',
        language: 'bash',
        code: `curl -s "$LUMINA_API_URL/bonds/$WALLET_ADDRESS?status=matured&limit=50" \\
  -H "x-api-key: $LUMINA_API_KEY"`,
      },
      {
        label: 'typescript',
        language: 'typescript',
        code: `const url = new URL(\`\${API_URL}/bonds/\${WALLET}\`)
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
  f"{API_URL}/bonds/{WALLET}",
  headers={"x-api-key": API_KEY},
  params={"status": "matured", "limit": 50},
).json()`,
      },
    ],
    apiRef: {
      method: 'GET',
      path: '/bonds/:wallet',
      file: 'src/routes/bonds.ts',
      url: apiRef('src/routes/bonds.ts', '24'),
    },
  },

  // ─── Tutorial 5: SDK v0.6.0 ─────────────────────────────────────
  {
    number: 8,
    id: 'a-sdk-install',
    title: 'Tutorial 5 · Install @lumina-org/sdk@^0.6.0',
    audience: 'agent',
    description: (
      <>
        <p>
          The official SDK wraps the REST surface in a typed client and adds
          runtime contract resolution, payload normalisation (snake_case ↔
          camelCase) and idempotency-key auto-injection. Works in Node ≥ 18
          and any modern bundler.
        </p>
      </>
    ),
    samples: [
      {
        label: 'npm',
        language: 'bash',
        code: `npm install @lumina-org/sdk@^0.6.0`,
      },
      {
        label: 'pnpm',
        language: 'bash',
        code: `pnpm add @lumina-org/sdk@^0.6.0`,
      },
      {
        label: 'yarn',
        language: 'bash',
        code: `yarn add @lumina-org/sdk@^0.6.0`,
      },
    ],
  },
  {
    number: 9,
    id: 'a-sdk-client',
    title: 'Tutorial 5 · new LuminaClient({ apiKey })',
    audience: 'agent',
    description: (
      <>
        <p>
          Construct one client per process. The SDK reads{' '}
          <code>LUMINA_API_URL</code> from the environment if you do not pass
          <code> baseUrl</code> explicitly. Auth is via the same{' '}
          <code>x-api-key</code> header you used for raw REST calls.
        </p>
      </>
    ),
    samples: [
      {
        label: 'typescript',
        language: 'typescript',
        code: `import { LuminaClient } from '@lumina-org/sdk'

const lumina = new LuminaClient({
  apiKey: process.env.LUMINA_API_KEY!,
  // baseUrl: defaults to ${API}
})`,
      },
    ],
  },
  {
    number: 10,
    id: 'a-sdk-contracts',
    title: 'Tutorial 5 · await lumina.getContracts()',
    audience: 'agent',
    description: (
      <>
        <p>
          Runtime contract resolution. The helper fetches <code>/health</code>{' '}
          on first call, caches the result in memory for the process lifetime,
          and returns the same addresses that the live API is serving. Use
          this instead of hard-coding addresses anywhere in your code — a
          redeploy then never desyncs your bot.
        </p>
      </>
    ),
    samples: [
      {
        label: 'typescript',
        language: 'typescript',
        code: `const c = await lumina.getContracts()
console.log(c.CoverRouter)    // "${COVER_ROUTER}"
console.log(c.BondVault)      // "${BOND_VAULT}"
console.log(c.Marketplace)    // "${MARKETPLACE}"`,
      },
    ],
    apiRef: {
      method: 'GET',
      path: '/health',
      file: 'src/health.ts',
      url: sdkRef('src/health.ts'),
    },
  },
  {
    number: 11,
    id: 'a-sdk-purchase',
    title: 'Tutorial 5 · lumina.policies.purchase({ productName, coverageUSD })',
    audience: 'agent',
    description: (
      <>
        <p>
          Idiomatic policy purchase. <code>productName</code> takes the
          human-readable id from <code>/products</code> (e.g.{' '}
          <code>FLASHBTC24-001</code>) — the SDK resolves the bytes32{' '}
          <code>productId</code> automatically. <code>coverageUSD</code> is a
          plain number in dollars; the SDK handles the 6-decimal conversion
          and the idempotency key.
        </p>
      </>
    ),
    samples: [
      {
        label: 'typescript',
        language: 'typescript',
        code: `const receipt = await lumina.policies.purchase({
  productName: 'FLASHBTC24-001',
  coverageUSD: 1000,
  buyer: process.env.WALLET_ADDRESS as \`0x\${string}\`,
})
console.log(receipt.txHash, receipt.policyId, receipt.premium)
// → "$52.60 paid by relayer, policy active"`,
      },
    ],
  },
  {
    number: 12,
    id: 'a-sdk-bonds',
    title: 'Tutorial 5 · lumina.bonds.list()',
    audience: 'agent',
    description: (
      <>
        <p>
          List the wallet's bonds. The SDK pulls the connected wallet from the
          API key tied to the client; pass <code>wallet</code> explicitly if
          you need to query a different address. Returns a normalised array
          (camelCase) with maturity, epoch id, and queue state pre-decoded.
        </p>
      </>
    ),
    samples: [
      {
        label: 'typescript',
        language: 'typescript',
        code: `const bonds = await lumina.bonds.list({ status: 'matured' })
for (const b of bonds) {
  console.log(b.epochId, b.usdFaceValue, b.maturesAt, b.isRedeemable)
}`,
      },
    ],
  },
  {
    number: 13,
    id: 'a-sdk-marketplace',
    title: 'Tutorial 5 · lumina.marketplace.list({ ... })',
    audience: 'agent',
    description: (
      <>
        <p>
          List a bond on the on-chain marketplace. The SDK signs both the
          <code> setApprovalForAll</code> (when needed) and the{' '}
          <code>list(epochId, amount, totalPriceUsdc)</code> call via the
          configured signer, then notifies the API so the listing is indexed.
          A <code>browse()</code> companion paginates open listings.
        </p>
      </>
    ),
    samples: [
      {
        label: 'typescript',
        language: 'typescript',
        code: `const listing = await lumina.marketplace.list({
  epochId: 202805,
  amount: 500,                 // ERC-1155 units = $500 face value
  totalPriceUsdc: 475,         // $475 in plain USD — SDK handles 6 decimals
})
console.log(listing.listingId, listing.txHash)

// Browse open listings on the other side
const open = await lumina.marketplace.browse({ limit: 25 })`,
      },
    ],
  },
]
