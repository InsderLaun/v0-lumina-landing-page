// Re-export from single source of truth
export { CONTRACTS, TOKENS } from './lumina-config'

// ============================================================
// OPERATE-APP PLACEHOLDERS — Sprint 2 (feature/operate-app)
// ============================================================
// The operate-app screens at /app/* render with MOCK data in this
// sprint. Sprint 2 will wire these against the V5.1 contracts using
// wagmi useReadContract / useWriteContract hooks.
//
// All addresses already live in lumina-config.ts → CONTRACTS. The
// commented constants below are the call sites the operate screens
// will need so a reviewer can grep for them.
//
// DO NOT uncomment in this sprint — would require ABIs + RPC calls,
// out of scope for the redesign-and-operate-app PR.
// ============================================================
//
// export const COVER_ROUTER_FNS = {
//   getQuote: 'getQuote(uint256 shieldId, uint256 cover, uint256 duration) view returns (uint256 premium)',
//   buyPolicy: 'buyPolicy(uint256 shieldId, uint256 cover, uint256 duration)',
// } as const
//
// export const BOND_VAULT_FNS = {
//   redeemBond: 'redeem(uint256 bondId)',
//   listForSale: 'list(uint256 bondId, uint256 askUsdc)',
//   cancelListing: 'cancelListing(uint256 bondId)',
// } as const
//
// export const MARKETPLACE_FNS = {
//   buyListing: 'buy(uint256 bondId)',
//   getActiveListings: 'getActiveListings(uint256 offset, uint256 limit) view returns (Listing[])',
// } as const
//
// export const SHIELD_KEEPER_FNS = {
//   getShield: 'shields(uint256 id) view returns (Shield)',
//   getActivePolicies: 'getActivePoliciesByOwner(address owner) view returns (uint256[])',
// } as const
