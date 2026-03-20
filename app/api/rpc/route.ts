import { NextRequest, NextResponse } from 'next/server'

const RPC_URLS = [
  'https://1rpc.io/base',
  'https://base.llamarpc.com',
  'https://mainnet.base.org',
]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

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
