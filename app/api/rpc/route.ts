import { NextRequest, NextResponse } from 'next/server'

// [Audit #35 CHAIN-1] V5.1 lives on Base Sepolia. A dedicated paid RPC takes
// precedence (so prod isn't rate-limited); public Sepolia endpoints follow as
// fallbacks. NOTE: read NEXT_PUBLIC_RPC_URL_ALCHEMY first to match
// web3-provider.tsx (the wagmi transport). They previously read different var
// names, so setting only _ALCHEMY left this proxy on the public endpoint.
const PRIMARY_RPC = process.env.NEXT_PUBLIC_RPC_URL_ALCHEMY ?? process.env.NEXT_PUBLIC_RPC_URL
const RPC_URLS = [
  ...(PRIMARY_RPC ? [PRIMARY_RPC] : []),
  'https://sepolia.base.org',
  'https://base-sepolia-rpc.publicnode.com',
]

// Only allow read-only RPC methods
const ALLOWED_METHODS = [
  'eth_call',
  'eth_getBalance',
  'eth_blockNumber',
  'eth_chainId',
  'eth_getTransactionReceipt',
  'eth_getTransactionByHash',
  'eth_getLogs',
  'eth_getBlockByNumber',
  'eth_getCode',
]

// Rate limiting: 100 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 100
const WINDOW_MS = 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

function validateMethods(body: unknown): boolean {
  if (Array.isArray(body)) {
    return body.every(item => item && typeof item.method === 'string' && ALLOWED_METHODS.includes(item.method))
  }
  if (body && typeof body === 'object' && 'method' in body) {
    return ALLOWED_METHODS.includes((body as { method: string }).method)
  }
  return false
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()

    // Method validation
    if (!validateMethods(body)) {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 403 })
    }

    for (const rpcUrl of RPC_URLS) {
      try {
        const res = await fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        if (res.status === 429) continue

        const json = await res.json()
        if (json.error && !Array.isArray(json)) continue

        return NextResponse.json(json)
      } catch {
        continue
      }
    }

    return NextResponse.json({ error: 'All RPCs failed' }, { status: 502 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
