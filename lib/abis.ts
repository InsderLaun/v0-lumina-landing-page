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
