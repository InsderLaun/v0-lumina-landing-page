// Minimal ABIs for the operate app — hand-rolled, cross-checked against
// /tmp/lp-s2 (LUMINA-PROTOCOL @ 6a3ce42). Each entry corresponds to a
// fn/event verified to exist in the .sol source. Documented at
// /tmp/log/sprint-2/contract-functions.md.

export const coverRouterV2Abi = [
  // src/core/CoverRouterV2.sol:146
  {
    type: 'function',
    name: 'purchasePolicy',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'productId', type: 'bytes32' },
      { name: 'coverageAmount', type: 'uint256' },
      { name: 'asset', type: 'bytes32' },
    ],
    outputs: [{ name: 'policyId', type: 'uint256' }],
  },
  // CoverRouterV2.sol:284
  {
    type: 'function',
    name: 'quotePremium',
    stateMutability: 'view',
    inputs: [
      { name: 'productId', type: 'bytes32' },
      { name: 'coverageAmount', type: 'uint256' },
    ],
    outputs: [
      { name: 'premium', type: 'uint256' },
      { name: 'payout', type: 'uint256' },
    ],
  },
  // CoverRouterV2.sol:297
  {
    type: 'function',
    name: 'getProductConfig',
    stateMutability: 'view',
    inputs: [{ name: 'productId', type: 'bytes32' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'productId', type: 'bytes32' },
          { name: 'payoutRatioBps', type: 'uint256' },
          { name: 'triggerProbBps', type: 'uint256' },
          { name: 'marginBps', type: 'uint256' },
          { name: 'durationSeconds', type: 'uint32' },
          { name: 'active', type: 'bool' },
        ],
      },
    ],
  },
  // CoverRouterV2.sol:308
  {
    type: 'function',
    name: 'isProtocolAutoPaused',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'bool' }],
  },
] as const

export const policyManagerV2Abi = [
  // src/core/PolicyManagerV2.sol:101 — PolicyCreated(productId, policyId, buyer, coverage, premium, payout)
  // NOTE: `buyer` is NOT indexed → can't filter via topic. Pull all + filter client-side.
  {
    type: 'event',
    name: 'PolicyCreated',
    inputs: [
      { name: 'productId', type: 'bytes32', indexed: true },
      { name: 'policyId', type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: false },
      { name: 'coverage', type: 'uint256', indexed: false },
      { name: 'premium', type: 'uint256', indexed: false },
      { name: 'payout', type: 'uint256', indexed: false },
    ],
  },
  // PolicyManagerV2.sol:109
  {
    type: 'event',
    name: 'PolicyTriggered',
    inputs: [
      { name: 'productId', type: 'bytes32', indexed: true },
      { name: 'policyId', type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: false },
      { name: 'bondAmount', type: 'uint256', indexed: false },
      { name: 'reason', type: 'bytes32', indexed: false },
    ],
  },
  // PolicyManagerV2.sol:112
  {
    type: 'event',
    name: 'PolicyExpired',
    inputs: [
      { name: 'productId', type: 'bytes32', indexed: true },
      { name: 'policyId', type: 'uint256', indexed: true },
    ],
  },
  // PolicyManagerV2.sol:338 — returns the full PolicyRecord struct
  // (productId, shield, buyer, coverageAmount, payoutAmount, premiumPaid,
  //  createdAt, expiresAt, triggered, expired). Used to learn whether a
  //  policy fired its trigger (so we hide it from the Active list) and
  //  to read createdAt/expiresAt directly without a getBlock(blockNumber)
  //  round-trip per row.
  {
    type: 'function',
    name: 'getPolicy',
    stateMutability: 'view',
    inputs: [
      { name: 'productId', type: 'bytes32' },
      { name: 'policyId', type: 'uint256' },
    ],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'productId', type: 'bytes32' },
          { name: 'shield', type: 'address' },
          { name: 'buyer', type: 'address' },
          { name: 'coverageAmount', type: 'uint256' },
          { name: 'payoutAmount', type: 'uint256' },
          { name: 'premiumPaid', type: 'uint256' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'expiresAt', type: 'uint256' },
          { name: 'triggered', type: 'bool' },
          { name: 'expired', type: 'bool' },
        ],
      },
    ],
  },
] as const

export const claimBondAbi = [
  // src/bonds/ClaimBond.sol — ERC1155 balanceOf(account, id)
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'id', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  // ClaimBond.sol:120
  {
    type: 'function',
    name: 'getFaceValue',
    stateMutability: 'view',
    inputs: [{ name: 'epochId', type: 'uint256' }],
    outputs: [{ type: 'uint256' }],
  },
  // ClaimBond.sol:126
  {
    type: 'function',
    name: 'getHolderFaceValue',
    stateMutability: 'view',
    inputs: [
      { name: 'holder', type: 'address' },
      { name: 'epochId', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  // ClaimBond.sol:130
  {
    type: 'function',
    name: 'isMatured',
    stateMutability: 'view',
    inputs: [{ name: 'epochId', type: 'uint256' }],
    outputs: [{ type: 'bool' }],
  },
  // ClaimBond.sol:135 — returns 4 fields (exists, maturity, totalSupply_, matured)
  // [Fix #reverse-audit] Was missing leading `bool exists`; result[0] used to
  // be read as maturity-timestamp but actually returned an existence flag.
  {
    type: 'function',
    name: 'getEpochInfo',
    stateMutability: 'view',
    inputs: [{ name: 'epochId', type: 'uint256' }],
    outputs: [
      { name: 'exists', type: 'bool' },
      { name: 'maturity', type: 'uint256' },
      { name: 'totalSupply_', type: 'uint256' },
      { name: 'matured', type: 'bool' },
    ],
  },
  // ClaimBond.sol:34 — emitted from BondVault.issueBond → ClaimBond.mint path
  {
    type: 'event',
    name: 'BondsMinted',
    inputs: [
      { name: 'epochId', type: 'uint256', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'usdAmount', type: 'uint256', indexed: false },
    ],
  },
  // ERC-1155 standard — used to authorise the marketplace to move a
  // holder's bonds when listing. Marketplace is the only authorised
  // operator (bonds are non-transferable peer-to-peer per FIX-#18).
  {
    type: 'function',
    name: 'isApprovedForAll',
    stateMutability: 'view',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'operator', type: 'address' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'setApprovalForAll',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' },
    ],
    outputs: [],
  },
  // ERC-1155 metadata URI — best-effort for wallet-side rendering.
  {
    type: 'function',
    name: 'uri',
    stateMutability: 'view',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [{ type: 'string' }],
  },
] as const

export const bondVaultAbi = [
  // src/bonds/BondVault.sol:198
  {
    type: 'function',
    name: 'redeemBond',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'epochId', type: 'uint256' },
      { name: 'usdAmount', type: 'uint256' },
    ],
    outputs: [],
  },
  // BondVault.sol:227
  {
    type: 'function',
    name: 'availableCapacityUSD',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  // BondVault.sol:239
  {
    type: 'function',
    name: 'previewRedemption',
    stateMutability: 'view',
    inputs: [{ name: 'usdAmount', type: 'uint256' }],
    outputs: [{ name: 'luminaAmount', type: 'uint256' }],
  },
  // BondVault.sol:66
  {
    type: 'event',
    name: 'BondRedeemed',
    inputs: [
      { name: 'holder', type: 'address', indexed: true },
      { name: 'epochId', type: 'uint256', indexed: true },
      { name: 'usdAmount', type: 'uint256', indexed: false },
      { name: 'luminaAmount', type: 'uint256', indexed: false },
      { name: 'price', type: 'uint256', indexed: false },
    ],
  },
] as const

export const marketplaceAbi = [
  // src/marketplace/LuminaBondMarketplace.sol:99
  {
    type: 'function',
    name: 'list',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'epochId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'priceUSDC', type: 'uint256' },
    ],
    outputs: [{ name: 'listingId', type: 'uint256' }],
  },
  // LuminaBondMarketplace.sol:125
  {
    type: 'function',
    name: 'cancel',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'listingId', type: 'uint256' }],
    outputs: [],
  },
  // LuminaBondMarketplace.sol:135
  {
    type: 'function',
    name: 'executeBuy',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'listingId', type: 'uint256' }],
    outputs: [],
  },
  // LuminaBondMarketplace.sol:160
  {
    type: 'function',
    name: 'getListing',
    stateMutability: 'view',
    inputs: [{ name: 'listingId', type: 'uint256' }],
    outputs: [
      { name: 'seller', type: 'address' },
      { name: 'epochId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'priceUSDC', type: 'uint256' },
      { name: 'active', type: 'bool' },
    ],
  },
  // LuminaBondMarketplace.sol:169
  {
    type: 'function',
    name: 'calculateFees',
    stateMutability: 'pure',
    inputs: [{ name: 'priceUSDC', type: 'uint256' }],
    outputs: [
      { name: 'sellerFee', type: 'uint256' },
      { name: 'buyerFee', type: 'uint256' },
      { name: 'total', type: 'uint256' },
    ],
  },
  // LuminaBondMarketplace.sol:54-58
  {
    type: 'event',
    name: 'Listed',
    inputs: [
      { name: 'listingId', type: 'uint256', indexed: true },
      { name: 'seller', type: 'address', indexed: true },
      { name: 'epochId', type: 'uint256', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'priceUSDC', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'Cancelled',
    inputs: [
      { name: 'listingId', type: 'uint256', indexed: true },
      { name: 'seller', type: 'address', indexed: true },
    ],
  },
  {
    type: 'event',
    name: 'Bought',
    inputs: [
      { name: 'listingId', type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'seller', type: 'address', indexed: true },
      { name: 'priceUSDC', type: 'uint256', indexed: false },
    ],
  },
] as const
