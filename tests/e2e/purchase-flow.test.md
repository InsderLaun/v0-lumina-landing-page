# E2E Test — Human policy purchase flow (Base mainnet)

> **Manual test checklist.** Founder runs this on a real wallet against the
> live Base mainnet deploy and reports back which steps pass / fail. If any
> step fails, file an issue and stop — do not continue downstream.

**Network**: Base mainnet, chain id `8453`
**Frontend**: production deploy, or local `pnpm dev`
**Wallet**: any RainbowKit-supported wallet (MetaMask, Coinbase, Rainbow, WalletConnect)

## Pre-conditions

- [ ] Wallet connected with **≥ 0.001 test ETH** for gas (faucet: https://www.alchemy.com/faucets/base-mainnet)
- [ ] Wallet has **≥ 10 test USDC** (mint via MockUSDC at `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` → `mint(yourAddress, 10000000)` for $10)
- [ ] Wallet currently on Base mainnet (`8453`)
- [ ] Browser console open to catch any JS errors

## Public navbar sanity (Phase 1 verification)

- [ ] Open `/`, `/docs`, `/skills`, `/tutorial`, `/whitepaper`
- [ ] Verify **"Whitepaper"** + **"Launch app →"** are the only buttons in the nav CTA group
- [ ] Verify **no** "Connect" button anywhere in the public nav
- [ ] Verify **no** truncated wallet address anywhere in the public nav (even if your wallet is connected)
- [ ] Verify **no** wrong-chain banner on the public pages
- [ ] Click "Launch app →" — should go to `/app`

## Wrong-chain UX (Phase 2 verification)

- [ ] Switch your wallet to **any non-Base-mainnet chain** (Ethereum mainnet, Polygon, etc.)
- [ ] Open `/app/human/products`
- [ ] Verify the **red wrong-chain banner** is visible at the top
- [ ] Verify the banner shows "Please switch to Base mainnet (chain 8453)" and a "Switch" button
- [ ] Click "Switch" — wallet should prompt to switch to Base mainnet; confirm
- [ ] Banner disappears once on chain `8453`
- [ ] Open a shield detail page; while still on the wrong chain, the **Approve** and **Buy** buttons must be **disabled** (gray, not clickable)

## Step 1 — Browse products

- [ ] Navigate to `/app/human/products`
- [ ] Verify **9 shield cards** render (FlashBTC ×4 + FlashETH ×3 + MicroDepeg + RateShock)
- [ ] Each card shows a real premium figure (not "—" or `0.00`)
- [ ] Active / Paused badges respect `getProductConfig().active` from the contract
- [ ] No hard-coded values — disconnect briefly and reconnect; figures update

## Step 2 — Quote premium

- [ ] Click any active shield (e.g., **Flash ETH 24h**)
- [ ] Move the cover slider to **$100 USDC** (`100000000` base units)
- [ ] The "You pay (premium)" line updates live (fired by `quotePremium`)
- [ ] Premium > 0, payout > 0
- [ ] Disable network in DevTools → quote stops updating, no crash

## Step 3 — Approve USDC

- [ ] Click **① Approve USDC**
- [ ] Wallet popup → confirm `USDC.approve(CoverRouterV2, premium)`
- [ ] Tx confirms; the approve button changes to **✓ ALLOWANCE OK**
- [ ] Buy button becomes enabled

## Step 4 — Buy policy

- [ ] Click **② Buy policy →**
- [ ] Wallet popup → confirm `CoverRouterV2.purchasePolicy(productId, coverageAmount, asset)`
- [ ] Tx confirms; banner shows **✓ Confirmed** with Basescan link
- [ ] Click the Basescan link; verify a `PolicyCreated` event was emitted

## Step 5 — Verify policy in portfolio

- [ ] Navigate to `/app/human/portfolio`
- [ ] The newly purchased policy appears in the list within ~10 seconds
- [ ] Cover, premium, expiration timestamp match what you signed
- [ ] Status is **Active**

## Edge cases

- [ ] Try to buy without first approving → button disabled / error "approve USDC first"
- [ ] Set cover to an amount larger than your USDC balance → red "USDC insufficient" banner appears
- [ ] Reject the tx in your wallet → toast says "user rejected", no double-spend
- [ ] If any shield is paused (`getProductConfig().active === false`), its buy button is disabled

## Reporting

After running the checklist, paste your results in the PR description with one of:

- ✅ **All steps passed** — ready to merge
- ⚠ **Some steps failed** — list the failing step numbers + observations; assign back to dev for fix

Do NOT merge if any pre-condition or chain-enforcement step fails.
