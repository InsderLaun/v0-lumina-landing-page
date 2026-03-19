LUMINA PROTOCOL — SKILL FILE FOR AI AGENTS
Version: 2.1 | Chain: Base Mainnet (8453) | March 2026
Last updated: 2026-03-18

════════════════════════════════════════════════════════════
1. WHAT IS LUMINA?
════════════════════════════════════════════════════════════

Lumina Protocol is parametric insurance built exclusively for AI agents on Base L2.
You buy insurance policies to protect portfolios against market crashes, stablecoin depegs, impermanent loss, and smart contract exploits.
You can also deposit USDC into vaults to earn yield from insurance premiums.
All operations happen via HTTP API calls. No blockchain knowledge needed.

Settlement asset: USDC (Circle stablecoin, 6 decimals)
Chain: Base Mainnet (Chain ID: 8453)

════════════════════════════════════════════════════════════
2. AUTHENTICATION
════════════════════════════════════════════════════════════

All write operations require an API Key in the header:
X-API-Key: YOUR_API_KEY_HERE

To create an API Key:
POST /api/v2/keys/create
Body: {"wallet":"0xYOUR_WALLET","label":"my-agent"}
Response: {"apiKey":"lum_xxxxx","agentId":"..."}

IMPORTANT: The API Key is shown ONLY ONCE. Save it immediately.
Your human owner should have given you this key. If you don't have one, ask them to create it from https://www.lumina-org.com/tutorial.html

════════════════════════════════════════════════════════════
3. API BASE URL
════════════════════════════════════════════════════════════

https://lumina-protocol-production.up.railway.app

Always check health first:
GET /api/v2/health
Expected: {"status":"ok","chain":"base","chainId":8453}

════════════════════════════════════════════════════════════
4. INSURANCE PRODUCTS
════════════════════════════════════════════════════════════

┌──────────┬──────────────────────┬────────────┬────────────┬──────────────┐
│ Product  │ What it covers       │ Duration   │ Deductible │ Trigger      │
├──────────┼──────────────────────┼────────────┼────────────┼──────────────┤
│ BSS      │ ETH crash ≥30%       │ 7-30 days  │ 20%        │ ETH price    │
│ DEPEG    │ USDT/DAI loses peg (USDC excluded) │ 14-365 days│ 10%        │ Peg deviation│
│ IL       │ Impermanent loss     │ 14-90 days │ 2%         │ IL index     │
│ EXPLOIT  │ Smart contract hack (Aave V3 excluded) │ 90-365 days│ 10%        │ Oracle report│
└──────────┴──────────────────────┴────────────┴────────────┴──────────────┘

GET /api/v2/products — returns full product details with current pricing

════════════════════════════════════════════════════════════
5. HOW TO BUY A POLICY (step by step)
════════════════════════════════════════════════════════════

STEP 1 — Check your USDC balance is sufficient:
Your owner must have USDC on Base in their wallet and must have approved the CoverRouter to spend it.

STEP 2 — Get a quote (optional but recommended):
GET /api/v2/quote?productId=BSS&coverageAmount=1000000000&durationSeconds=604800
Response: {"premium":25000000,"premiumUSD":25.00,"product":"BSS","coverage":1000000000}

This tells you the cost BEFORE buying. Always quote first to avoid surprises.

STEP 3 — Purchase:
POST /api/v2/purchase
Headers: Content-Type: application/json, X-API-Key: YOUR_KEY
Body:
{
  "productId": "BSS",
  "coverageAmount": 1000000000,
  "durationSeconds": 604800
}

coverageAmount uses 6 decimals:
  $100 = 100000000
  $500 = 500000000
  $1,000 = 1000000000
  $5,000 = 5000000000
  $10,000 = 10000000000
  $100,000 = 100000000000

durationSeconds reference:
  7 days = 604800
  14 days = 1209600
  30 days = 2592000
  90 days = 7776000
  365 days = 31536000

Min coverage: $100 | Max coverage: $100,000

Response on success:
{"success":true,"policyId":"...","premium":25000000,"txHash":"0x..."}

STEP 4 — Verify your policy:
GET /api/v2/policies?buyer=0xYOUR_WALLET
Returns array of active policies with status, expiry, coverage details.

════════════════════════════════════════════════════════════
6. HOW TO MONITOR & CLAIM
════════════════════════════════════════════════════════════

MONITORING:
Check your policies regularly:
GET /api/v2/policies?buyer=0xYOUR_WALLET

Each policy has:
- status: "active", "expired", "claimed", "claimable"
- expiresAt: Unix timestamp — set alerts before this
- triggerMet: true/false — if true and status is "claimable", you should claim

CLAIMING A PAYOUT:
When a trigger is met (e.g., ETH drops 30%+ for BSS):
POST /api/v2/claim
Headers: Content-Type: application/json, X-API-Key: YOUR_KEY
Body: {"policyId":"YOUR_POLICY_ID"}

Response: {"success":true,"payout":800000000,"txHash":"0x..."}

Payout = coverageAmount × (1 - deductibleBps/10000)
Example: $1000 BSS with 20% deductible → payout = $800

IMPORTANT TIMING:
- You have a 24-HOUR GRACE PERIOD after policy expiry to claim
- If you miss the grace period, the payout is lost
- Set up monitoring to check every hour for claimable policies
- For DEPEG: there is a 24-hour waiting period after purchase before coverage starts
- For EXPLOIT: there is a 14-day waiting period after purchase before coverage starts

AUTO-REPURCHASE STRATEGY:
To maintain continuous coverage:
- For BSS (no waiting period): repurchase on the day of expiry
- For DEPEG (24h waiting): repurchase at least 24 hours before expiry
- For EXPLOIT (14d waiting): repurchase at least 14 days before expiry
- For IL (no waiting period): repurchase on the day of expiry

════════════════════════════════════════════════════════════
7. YIELD VAULTS (for earning, not insurance)
════════════════════════════════════════════════════════════

Lumina has 4 vaults where you can deposit USDC to earn yield from insurance premiums:

┌─────────────────┬──────────┬─────────────────────────────────────────────────┐
│ Vault           │ Lockup   │ Contract Address                                │
├─────────────────┼──────────┼─────────────────────────────────────────────────┤
│ Volatile Short  │ 30 days  │ 0x2D7D735f71638730cbe9A143227A00Fa64E94E88     │
│ Volatile Long   │ 90 days  │ 0xDF30548d46e770154AdA82D3c263e81a608075c      │
│ Stable Short    │ 90 days  │ 0x8F6e6a4Ee6aeD70757c16382eA7156AD4b33c078    │
│ Stable Long     │ 365 days │ 0x3e8dF8746c42Aa4B0CDb089174aBbBaf2C3aD46c    │
└─────────────────┴──────────┴─────────────────────────────────────────────────┘

CHECK VAULT STATUS:
GET /api/v2/vaults
Returns: TVL, utilization, estimated APY for each vault

YIELD SOURCES:
- Base yield: Aave V3 lending APY (~3-5%, variable)
- Premium yield: from insurance policies purchased by agents
- Total yield = Aave yield + premium yield

DEPOSITING:
Your owner must approve each vault contract to spend their USDC (done in tutorial Step 2).
Deposits and withdrawals are on-chain transactions — your owner's wallet interacts directly with the vault contracts.
Your USDC is supplied to Aave V3. The vault holds aUSDC (Aave's receipt token) which grows in value as interest accrues.

COOLDOWN PERIODS:
After requesting a withdrawal, there is a cooldown:
- Volatile Short: 30 days
- Volatile Long: 90 days
- Stable Short: 90 days
- Stable Long: 365 days

Plan withdrawals in advance. You cannot withdraw instantly.

════════════════════════════════════════════════════════════
8. DECISION GUIDELINES
════════════════════════════════════════════════════════════

WHEN TO BUY EACH PRODUCT:

BSS (Black Swan Shield):
- Buy when: ETH volatility is high, your portfolio has significant ETH exposure, market sentiment is fearful, VIX-crypto equivalent is elevated
- Don't buy when: Market is calm, ETH is in a steady uptrend, your exposure is minimal
- Recommended coverage: 50-80% of ETH exposure value

DEPEG (Depeg Shield):
- Buy when: You hold large stablecoin positions, there are concerns about stablecoin issuers, regulatory uncertainty is high
- Don't buy when: You hold small stablecoin amounts, the stablecoin has strong reserves
- Recommended coverage: 70-100% of stablecoin holdings
- Remember: 24-hour waiting period — buy BEFORE you think you'll need it
- Note: USDC cannot be insured. Lumina settles in USDC, so insuring it would be circular. Use this for USDT or DAI holdings.

IL (IL Index Cover):
- Buy when: You provide liquidity in volatile pairs, the pair's price ratio is diverging, you want to hedge IL risk
- Don't buy when: You're in stable/stable pairs, IL risk is minimal
- Recommended coverage: match your LP position value

EXPLOIT (Exploit Shield):
- Buy when: You have funds in DeFi protocols, the protocol is unaudited or newly launched, there have been recent hacks in similar protocols
- Don't buy when: Protocol is battle-tested, your exposure is small
- Remember: 14-day waiting period — buy well in advance
- Recommended coverage: 80-100% of funds in the protocol
- Note: Aave V3 cannot be insured. Lumina vaults deposit into Aave, so insuring it would be circular. Use this for other DeFi protocols.

YIELD VAULTS — when to deposit:
- Deposit when: You have idle USDC, you want passive income, you're comfortable with the lockup period
- Choose Volatile vaults: higher yield but higher risk (covers BSS and IL claims)
- Choose Stable vaults: lower yield but lower risk (covers DEPEG and EXPLOIT claims)
- Choose Short lockups: if you may need liquidity soon
- Choose Long lockups: for higher yield if you can lock funds longer

════════════════════════════════════════════════════════════
9. PRICING MODEL
════════════════════════════════════════════════════════════

Premiums are dynamic based on vault utilization (Kink Model):
- Low utilization (<60%) → cheap premiums
- Medium utilization (60-80%) → moderate premiums
- High utilization (>80%) → expensive premiums (kink kicks in)

Premium formula: premium = coverageAmount × premiumRate / 10000
Always GET /api/v2/quote before purchasing to see current pricing.

Protocol fee: 3% on premiums + 3% on payouts.

════════════════════════════════════════════════════════════
10. SMART CONTRACT ADDRESSES (Base Mainnet)
════════════════════════════════════════════════════════════

USDC (settlement token):     0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
CoverRouter (buy policies):  0x8407aF8a100812bFb5F9F188b44379E4268efF94
PolicyManager:               0x615e9c32c70350192fCa98AC06Ba8eb49dC4fEF4
Oracle:                      0x2F9d3DA66FCB84F47851636d9e0921373ede2176
Phala Verifier:              0xa2d461f4A7eC7089A7e414986d9d9b43514a82EC

Shields:
BSS Shield:     0xC01ED8eF525068290545f08BBf9aAe5Fe59b15CF7
Depeg Shield:   0xCdA417909d43F252F63034346db91244188fE70F
IL Index Shield: 0x73fB5CB9Aa08e8Af74a3a4b6Cfb09d3Fd66C9FB6
Exploit Shield:  0x05170F9Ca560260001064F5242c6F9F7f181c6baA

════════════════════════════════════════════════════════════
11. ERROR HANDLING
════════════════════════════════════════════════════════════

Common errors and how to handle them:

"Insufficient USDC balance"
→ Your owner needs more USDC. Alert them.

"CoverRouter not approved" / "Insufficient allowance"
→ Your owner needs to approve CoverRouter to spend USDC. Direct them to the tutorial.

"Policy expired"
→ You missed the claim window. Cannot recover. Set up better monitoring.

"Rate limit exceeded"
→ Max 5 requests/minute. Wait 60 seconds and retry.

"Invalid API Key"
→ The key is wrong or was never created. Ask your owner for the correct key.

"Product frozen"
→ This product is temporarily disabled. Try a different product or wait.

"Coverage amount too low/high"
→ Min $100, Max $100,000. Adjust your amount.

"Duration out of range"
→ Check the min/max duration for each product in the products table.

"Cannot insure settlement token"
→ You tried to buy Depeg Shield for USDC. USDC is excluded. Choose USDT or DAI.

"Cannot insure vault infrastructure"
→ You tried to buy Exploit Shield for Aave V3. Aave is excluded. Choose another protocol.

RETRY STRATEGY:
- On rate limit: wait 60s, retry once
- On network error: wait 10s, retry up to 3 times
- On insufficient balance: alert owner, do not retry
- On invalid key: alert owner, do not retry

════════════════════════════════════════════════════════════
12. QUICK REFERENCE
════════════════════════════════════════════════════════════

ENDPOINTS SUMMARY:
GET  /api/v2/health                        → API status
GET  /api/v2/products                      → Product list
GET  /api/v2/vaults                        → Vault status + APY
GET  /api/v2/quote?productId=X&coverageAmount=Y&durationSeconds=Z → Price quote
POST /api/v2/purchase                      → Buy policy (requires API Key)
POST /api/v2/claim                         → Claim payout (requires API Key)
GET  /api/v2/policies?buyer=0x...          → Your policies
POST /api/v2/keys/create                   → Create API Key

TYPICAL AGENT LOOP:
1. Check /health → confirm API is up
2. Check /policies → review active policies, check for claimable ones
3. If any claimable → POST /claim immediately
4. If any expiring soon → GET /quote for renewal → POST /purchase
5. Assess market conditions → decide if new coverage needed
6. GET /quote → check pricing → POST /purchase if favorable
7. Sleep 1 hour → repeat from step 1

SUPPORT:
Email: support@lumina-org.com
Website: https://www.lumina-org.com
GitHub: https://github.com/agustintiberio10/LUMINA-PROTOCOL
