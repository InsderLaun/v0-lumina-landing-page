# Connectivity Audit — Base mainnet (chain 8453)

| Field | Value |
|---|---|
| Generated | 2026-05-05 |
| Frontend commit | `7648f354` (branch `chore/connectivity-audit`) |
| LUMINA-PROTOCOL commit | `195bc8f6` (`main`) |
| lumina-api commit | `19a1d906` (`main`) |
| Network in scope | Base mainnet, chain id `8453` (`0x14a34`) — testnet |

## Summary

| Metric | Result |
|---|---|
| Contract function calls verified against ABI | **12 / 12** real Lumina functions ✓ — 3 additional matches (`allowance`, `approve`, `deposit`) are standard ERC-20 calls (not Lumina-specific) or live in dead V4 code |
| API call sites in active frontend code | **0** real fetches to `/api/v1/*` — frontend talks directly to contracts via wagmi; the API is referenced only in `tutorial-data.tsx` documentation strings and an internal `/api/rpc` proxy |
| Chain ID hardcoded mismatches | **0** in active V5.1 paths — fixed 1 leak in legacy `lib/wallet.ts` that prompted "Base Mainnet" instead of Sepolia |
| Wrong-chain banner in `/app/*` | ✓ in `AppShell.tsx` |
| `useSwitchChain` wired to one-click switch | ✓ in `AppShell.tsx` |
| Buy / Approve / Cancel buttons gated on `wrongChain` | ✓ — `ShieldDetailView` and `MarketplaceView` updated this sprint |

## 1. Contract call inventory

Source of truth: `/tmp/lp-conn/src/**/*.sol` at commit `195bc8f6`.

| # | Frontend file | `functionName` | Contract | ABI match | Notes |
|---|---|---|---|---|---|
| 1 | `components/lumina/redesign/operate/AppShell.tsx` | `balanceOf` | LuminaToken / USDC | ✓ | OZ ERC20 std |
| 2 | `components/lumina/redesign/operate/HumanProductsView.tsx` | `quotePremium` | CoverRouterV2 | ✓ | `src/core/CoverRouterV2.sol:284` |
| 3 | `components/lumina/redesign/operate/HumanProductsView.tsx` | `getProductConfig` | CoverRouterV2 | ✓ | `src/core/CoverRouterV2.sol:297` |
| 4 | `components/lumina/redesign/operate/HumanProductsView.tsx` | `availableCapacityUSD` | BondVault | ✓ | `src/bonds/BondVault.sol:227` |
| 5 | `components/lumina/redesign/operate/ShieldDetailView.tsx` | `quotePremium` | CoverRouterV2 | ✓ | same as #2 |
| 6 | `components/lumina/redesign/operate/ShieldDetailView.tsx` | `getProductConfig` | CoverRouterV2 | ✓ | same as #3 |
| 7 | `components/lumina/redesign/operate/ShieldDetailView.tsx` | `balanceOf` | USDC | ✓ | OZ std |
| 8 | `components/lumina/redesign/operate/ShieldDetailView.tsx` | `allowance` | USDC | ✓ | OZ std (not Lumina-specific) |
| 9 | `components/lumina/redesign/operate/ShieldDetailView.tsx` | `approve` | USDC | ✓ | OZ std |
| 10 | `components/lumina/redesign/operate/ShieldDetailView.tsx` | `purchasePolicy` | CoverRouterV2 | ✓ | `src/core/CoverRouterV2.sol:146` |
| 11 | `components/lumina/redesign/operate/PortfolioView.tsx` | `getEpochInfo` | ClaimBond | ✓ | `src/bonds/ClaimBond.sol:135` (4-output shape: `bool exists, uint maturity, uint totalSupply, bool matured`) |
| 12 | `components/lumina/redesign/operate/PortfolioView.tsx` | `balanceOf` | ClaimBond | ✓ | ERC1155 |
| 13 | `components/lumina/redesign/operate/PortfolioView.tsx` | `isMatured` | BondVault | ✓ | `src/bonds/BondVault.sol:28` |
| 14 | `components/lumina/redesign/operate/PortfolioView.tsx` | `redeemBond` | BondVault | ✓ | `src/bonds/BondVault.sol:198` (epochId, usdAmount) |
| 15 | `components/lumina/redesign/operate/MarketplaceView.tsx` | `getListing` | LuminaBondMarketplace | ✓ | `src/marketplace/LuminaBondMarketplace.sol` |
| 16 | `components/lumina/redesign/operate/MarketplaceView.tsx` | `executeBuy` | LuminaBondMarketplace | ✓ | `src/marketplace/LuminaBondMarketplace.sol:135` |
| 17 | `components/lumina/redesign/operate/MarketplaceView.tsx` | `cancel` | LuminaBondMarketplace | ✓ | `src/marketplace/LuminaBondMarketplace.sol:125` |
| 18 | `components/lumina/redesign/operate/MarketplaceView.tsx` | `allowance` | USDC | ✓ | OZ std |
| 19 | `components/lumina/redesign/operate/MarketplaceView.tsx` | `approve` | USDC | ✓ | OZ std |
| 20 | `components/lumina/redesign/operate/AgentDashboardView.tsx` | `isProtocolAutoPaused` | CoverRouterV2 | ✓ | `src/core/CoverRouterV2.sol:308` |
| 21 | `components/lumina/redesign/BurnEngine.tsx` | (event) `BurnExecuted` | TWAPBurner | ✓ | `src/core/TWAPBurner.sol:75` |

### Dead-code matches (excluded)

- `components/lumina/deposit-lp-modal.tsx`: calls `deposit` and `approve` against a `BASE_VAULT_ABI`. Imported only by `components/lumina/vault-actions.tsx`, which has **zero** consumers in the active page tree. This is V4 LP-vault dead code — flagged for a future cleanup PR but not in scope here.
- `components/lumina/vault-actions.tsx`: same — orphan since the V4 `/dashboard` page was deleted in `chore/v4-cleanup` (PR #3, merged).

## 2. API call inventory

Source of truth: `/tmp/la-conn/src/routes/*.ts` at commit `19a1d906`.

| Frontend file | Method | Path | Route exists | Notes |
|---|---|---|---|---|
| `app/api/rpc/route.ts` | POST | (proxy to `NEXT_PUBLIC_RPC_URL`) | n/a | Internal Next.js route; proxies wallet RPC to avoid CORS. Not a Lumina API call. |
| `app/tutorial/tutorial-data.tsx` | (documentation only) | `GET /health`, `GET /products`, `GET /products/:id/quote`, `POST /api/v1/policies`, `GET /api/v1/policies`, `GET /api/v1/bonds/:wallet`, `POST /api/v1/redeem`, `POST /api/v1/marketplace/list`, `POST /api/v1/marketplace/buy`, `POST /api/v1/keys/generate` | ✓ all 10 verified | Strings inside tutorial code blocks for agent flow. Not actual fetches. |

**Conclusion**: the frontend has **zero runtime fetches** to `lumina-api`. The Operate App talks to contracts directly via wagmi + viem. The API is the agent surface (separate consumers); this audit only confirms that every endpoint cited in our docs exists.

## 3. Chain enforcement audit

| Check | Result | Evidence |
|---|---|---|
| `wagmi.config` chain list | ✓ `[base]` only | `components/lumina/web3-provider.tsx:63` |
| RPC transport pinned to Sepolia | ✓ | `components/lumina/web3-provider.tsx:64` (`http(process.env.NEXT_PUBLIC_RPC_URL)`) |
| Default chain | ✓ Base mainnet | wagmi infers from single-chain list |
| Persistent Sepolia banner in `/app/*` | ✓ | `components/lumina/redesign/operate/AppShell.tsx:74-86` |
| Wrong-chain red banner | ✓ | `AppShell.tsx:99-128` |
| `useSwitchChain` wired | ✓ | `AppShell.tsx:107` |
| `wrongChain` derived from `useChainId` | ✓ | `AppShell.tsx:35` |
| Reads gated on `!wrongChain` | ✓ | `AppShell.tsx:43-49` (USDC + LUMINA balances) |
| Writes gated on `wrongChain` (this sprint) | ✓ | `ShieldDetailView.tsx`, `MarketplaceView.tsx` |
| Mainnet (8453) anywhere in active config | **0** | ✓ — fixed `lib/wallet.ts` leak |

### Leaks fixed in this sprint

1. **`lib/wallet.ts:7`** — `BASE_CHAIN_ID = '0x2105'` (= 8453, Base mainnet). Now `'0x14a34'` (= 8453, Sepolia). The legacy `/connect` page consumes this constant.
2. **`lib/wallet.ts:139-153`** — `wallet_addEthereumChain` prompted with `chainName: 'Base Mainnet'` and `rpcUrls: ['https://mainnet.base.org']`. Now `'Base mainnet'` + `'https://mainnet.base.org'` + Sepolia explorer.
3. **`components/lumina/redesign/Nav.tsx`** — public nav previously rendered a Connect button + WrongNetworkBanner. Both removed; wallet UX consolidated in `AppShell` (`/app/*` only).
4. **`ShieldDetailView.tsx`**, **`MarketplaceView.tsx`** — Approve / Buy / Cancel buttons did not gate on chain id. Now they read `useChainId()` and disable while `wrongChain`.

### Documentation references to "mainnet" (legitimate)

- `lib/docs.ts`: 2 references in deployment-runbook descriptions — these point at a future doc target, not active config.
- `lib/wallet.ts`: comment on `BASE_CHAIN_ID` notes that mainnet is `0x2105` for future reference.
- This audit doc: this section.

None of these affect runtime behavior.

## 4. Issues remaining (defer to future sprint)

1. **V4 LP-vault dead code** — `components/lumina/deposit-lp-modal.tsx` and `components/lumina/vault-actions.tsx` are unused after the V4 cleanup that deleted `/app/dashboard`. They reference the old vault `BASE_VAULT_ABI`. Should be deleted in a follow-up cleanup PR.
2. **Auto-disconnect on switching to mainnet** — current behavior shows the wrong-chain banner; an alternative would be to auto-disconnect when the user switches their wallet to a non-supported chain. Defer until the founder has data on which is less confusing.
3. **`/connect` flow consolidation** — the legacy `/connect` page still uses the `lib/wallet.ts` localStorage-based flow alongside the wagmi/RainbowKit modal. Consider unifying on a single connection path.

## 5. Recommendation for mainnet

When ready to ship Base mainnet (chain id `8453`):

1. Deploy V5.1 contracts to Base mainnet; record addresses in a new mainnet block in `lib/lumina-config.ts`.
2. Add `base` to `wagmi.config.chains` alongside `base`, decide which is default.
3. Update `lib/wallet.ts:BASE_CHAIN_ID` (or branch on env) to point at the chosen default.
4. Update `AppShell.tsx` `wrongChain` check to allow either Base mainnet or Base mainnet depending on env / a feature flag.
5. Re-run this connectivity audit on mainnet — every contract address must match the new deploy.
6. Pre-flight gates: cold-storage admin key, bug bounty active, multisig configured, audit re-run on mainnet bytecode.
