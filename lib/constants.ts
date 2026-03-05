// ═══════════════════════════════════════════════════════════════
// LUMINA PROTOCOL — CONSTANTS
// All data is REAL and VERIFIABLE on-chain.
// ═══════════════════════════════════════════════════════════════

export const CONTRACTS = {
    MutualLumina: '0x1c5Ec90aC46e960aACbfCeAE9d6C2F79ce806b07',
    DisputeResolver: '0x2e4D0112A65C2e2DCE73e7F85bF5C2889c7709cA',
    AutoResolver: '0x8D919F0BEf46736906e190da598570255FF02754',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
} as const

export const CHAINLINK_FEEDS = {
    'ETH/USD': '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70',
    'BTC/USD': '0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F',
    'USDC/USD': '0x7e860098F58bBFC8648a4311b374B1D669a2bc6B',
    'USDT/USD': '0xf19d560eB8d2ADf07BD6D13ed03e1D11215721F9',
    'DAI/USD': '0x591e79239a7d679378eC8c847e5038150364C78F',
} as const

export const API_BASE_URL = 'https://moltagentinsurance-production-6e3d.up.railway.app'

export const API_ENDPOINTS = {
    products: '/api/v1/products',
    register: '/api/v1/register',
    quote: '/api/v1/quote',
    purchase: '/api/v1/purchase',
    policy: '/api/v1/policy',
    dashboard: '/api/v1/agent/dashboard',
    health: '/health',
} as const

export const BASESCAN_URL = 'https://basescan.org/address'
export const GITHUB_URL = 'https://github.com/agustintiberio10/LUMINA-PROTOCOL'
export const CHAIN_ID = 8453
export const CHAIN_NAME = 'Base L2'

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
    { label: 'Products', value: 8 },
    { label: 'Chainlink Feeds', value: 5 },
    { label: 'Verified Contracts', value: 3 },
    { label: 'Resolution', value: '< 24h', isString: true },
] as const

// Trust logos
export const TRUST_LOGOS = ['Base', 'Chainlink', 'Solidity', 'USDC'] as const
