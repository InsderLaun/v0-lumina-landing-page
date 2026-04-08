// ═══════════════════════════════════════════════════════════════
// LUMINA PROTOCOL — CONTRACT ABIs (from GitHub repo)
// ═══════════════════════════════════════════════════════════════

export const MUTUAL_LUMINA_ABI = [
    {
        type: 'function',
        name: 'createPool',
        inputs: [
            { name: '_description', type: 'string' },
            { name: '_evidenceSource', type: 'string' },
            { name: '_coverageAmount', type: 'uint256' },
            { name: '_premiumRate', type: 'uint256' },
            { name: '_deadline', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'resolvePool',
        inputs: [
            { name: '_poolId', type: 'uint256' },
            { name: '_claimApproved', type: 'bool' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'getPool',
        inputs: [{ name: '_poolId', type: 'uint256' }],
        outputs: [
            { name: 'description', type: 'string' },
            { name: 'evidenceSource', type: 'string' },
            { name: 'coverageAmount', type: 'uint256' },
            { name: 'premiumRate', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
            { name: 'depositDeadline', type: 'uint256' },
            { name: 'insured', type: 'address' },
            { name: 'premiumPaid', type: 'uint256' },
            { name: 'totalCollateral', type: 'uint256' },
            { name: 'status', type: 'uint8' },
            { name: 'claimApproved', type: 'bool' },
            { name: 'participantCount', type: 'uint256' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'oracle',
        inputs: [],
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'nextPoolId',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'event',
        name: 'PoolCreated',
        inputs: [
            { name: 'poolId', type: 'uint256', indexed: true },
            { name: 'insured', type: 'address', indexed: true },
            { name: 'description', type: 'string', indexed: false },
            { name: 'coverageAmount', type: 'uint256', indexed: false },
            { name: 'premiumRate', type: 'uint256', indexed: false },
            { name: 'deadline', type: 'uint256', indexed: false },
            { name: 'depositDeadline', type: 'uint256', indexed: false },
        ],
    },
] as const

// ═══════════════════════════════════════════════════════════════
// BaseVault ABI — minimal subset used by the LP UI (deposit /
// withdraw queue / read state). The on-chain contract is
// BaseVault.sol in LUMINA-PROTOCOL/src/vaults/. We only expose the
// functions the frontend actually needs.
// ═══════════════════════════════════════════════════════════════

export const BASE_VAULT_ABI = [
    // ── Deposit ────────────────────────────────────────────────
    // Standard ERC4626 deposit (override in BaseVault enforces
    // MIN_DEPOSIT = $100 and the per-user / total caps).
    {
        type: 'function',
        name: 'deposit',
        inputs: [
            { name: 'assets', type: 'uint256' },
            { name: 'receiver', type: 'address' },
        ],
        outputs: [{ name: 'shares', type: 'uint256' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'depositAssets',
        inputs: [
            { name: 'assets', type: 'uint256' },
            { name: 'receiver', type: 'address' },
        ],
        outputs: [{ name: 'shares', type: 'uint256' }],
        stateMutability: 'nonpayable',
    },

    // ── Withdrawal queue V2 (multiple parallel requests) ───────
    {
        type: 'function',
        name: 'requestWithdrawalV2',
        inputs: [{ name: 'shares', type: 'uint256' }],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'completeWithdrawalV2',
        inputs: [{ name: 'receiver', type: 'address' }],
        outputs: [{ name: 'assets', type: 'uint256' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'cancelWithdrawalV2',
        inputs: [{ name: 'index', type: 'uint256' }],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'getWithdrawalQueue',
        inputs: [{ name: 'lp', type: 'address' }],
        outputs: [
            {
                name: '',
                type: 'tuple[]',
                components: [
                    { name: 'shares', type: 'uint256' },
                    { name: 'cooldownEnd', type: 'uint256' },
                ],
            },
        ],
        stateMutability: 'view',
    },

    // ── Read state ─────────────────────────────────────────────
    {
        type: 'function',
        name: 'totalAssets',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'totalSupply',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'convertToAssets',
        inputs: [{ name: 'shares', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'convertToShares',
        inputs: [{ name: 'assets', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'cooldownDuration',
        inputs: [],
        outputs: [{ name: '', type: 'uint32' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'maxDepositPerUser',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'paused',
        inputs: [],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'view',
    },
] as const

export const ERC20_ABI = [
    {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'decimals',
        inputs: [],
        outputs: [{ name: '', type: 'uint8' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'transfer',
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'allowance',
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'approve',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'event',
        name: 'Transfer',
        inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
        ],
    },
] as const
