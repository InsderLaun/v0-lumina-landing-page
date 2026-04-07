// ═══════════════════════════════════════════════════════════════
// LUMINA PROTOCOL — CONSTANTS
// Protocol data imported from lumina-config.ts (single source of truth)
// UI-specific constants defined here
// ═══════════════════════════════════════════════════════════════

import { CONTRACTS as CONFIG_CONTRACTS, TOKENS, PROTOCOL, CHAIN, ORACLES } from './lumina-config'

// Re-export contracts with backwards-compatible shape
export const CONTRACTS = {
    ...CONFIG_CONTRACTS,
    USDC: TOKENS.USDC.address,
} as const

export const CHAINLINK_FEEDS = {
    'ETH/USD': ORACLES.ETH_USD,
    'BTC/USD': ORACLES.BTC_USD,
    'USDC/USD': '0x7e860098F58bBFC8648a4311b374B1D669a2bc6B',
    'USDT/USD': '0xf19d560eB8d2ADf07BD6D13ed03e1D11215721F9',
    'DAI/USD': '0x591e79239a7d679378eC8c847e5038150364C78F',
} as const

export const API_BASE_URL = PROTOCOL.apiBaseUrl

export const API_ENDPOINTS = {
    products: '/api/v2/products',
    register: '/api/v2/keys/create',
    quote: '/api/v2/quote',
    purchase: '/api/v2/purchase',
    policy: '/api/v2/policies',
    dashboard: '/api/v2/vaults',
    health: '/api/v2/health',
} as const

export const BASESCAN_URL = `${CHAIN.explorer}/address`
export const GITHUB_URL = PROTOCOL.github
export const CHAIN_ID = CHAIN.id
export const CHAIN_NAME = CHAIN.name

// Tooltip definitions for technical terms
export const GLOSSARY: Record<string, string> = {
    'parametric': 'Insurance that pays based on measurable conditions, not damage assessment',
    'sustained period': 'How long the condition must last before triggering a payout',
    'deductible': 'The % of coverage the buyer absorbs — like a copay in health insurance',
    'Chainlink oracle': 'Trusted data feed that brings real-world prices to the blockchain',
    'Base L2': "Coinbase's Layer 2 blockchain — fast and cheap transactions",
    'AutoResolver': 'Smart contract that automatically checks Chainlink feeds and executes payouts',
    'timelock': '24-hour security delay before payout execution — protects against bugs',
    'USDC': 'USD Coin — a stablecoin pegged 1:1 to the US dollar',
    'impermanent loss': 'Loss from providing liquidity when token prices diverge in an AMM pool',
    'AMM': 'Automated Market Maker — a protocol that enables decentralized token trading',
    'TVL': 'Total Value Locked — the total funds deposited in a protocol',
    'circuit breaker': 'Automatic safety mechanism that activates if claims exceed 50% of TVL in 24h',
    'keccak256': 'Cryptographic hash function used by Ethereum to create immutable digital fingerprints',
    'slippage': 'Price difference between when you decide to trade and when the trade executes',
}

// Navigation items
export const NAV_ITEMS = [
    { label: 'Products', href: '#products' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Developers', href: '#developers' },
    { label: 'Security', href: '#security' },
] as const

// Stats for hero section
export const HERO_STATS = [
    { label: 'Products', value: 5 },
    { label: 'Chainlink Feeds', value: 5 },
    { label: 'Verified Contracts', value: 3 },
    { label: 'Resolution', value: '< 24h', isString: true },
] as const

// Trust logos
export const TRUST_LOGOS = ['Base', 'Chainlink', 'Solidity', 'USDC'] as const
