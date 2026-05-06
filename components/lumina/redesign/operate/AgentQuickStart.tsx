'use client'

import { useState } from 'react'

const COVER_USDC_DEFAULT = '100000000' // $100 — on-chain minimum

const SNIPPETS = {
  ts: `// npm i @lumina-org/sdk ethers
import { LuminaClient } from '@lumina-org/sdk'
import { Wallet, JsonRpcProvider } from 'ethers'

const lumina = new LuminaClient({ apiKey: process.env.LUMINA_API_KEY! })
const provider = new JsonRpcProvider('https://base-sepolia-rpc.publicnode.com')
const buyer = new Wallet(process.env.BUYER_PRIVATE_KEY!, provider)

// One-time: approve CoverRouter to spend USDC
await lumina.policies.ensureAllowance(buyer)

// Buy a $100 FLASHBTC1H policy
const receipt = await lumina.policies.purchase({
  productId: '0xe87625ef7415a58c92f2639b16d176521429aac002386dddf1e47e419dfeaddd',
  buyer: await buyer.getAddress(),
  coverageAmount: '${COVER_USDC_DEFAULT}', // $100, the on-chain minimum
  asset: 'USDC',
})
console.log('policyId =', receipt.policyId)`,

  python: `# pip install requests web3
import os, requests
from web3 import Web3

API   = "https://lumina-api-production-ac85.up.railway.app"
KEY   = os.environ["LUMINA_API_KEY"]
BUYER = os.environ["BUYER_ADDRESS"]

# Buy a $100 FLASHBTC1H policy (buyer must have already approved CoverRouter)
resp = requests.post(
    f"{API}/api/v1/policies",
    headers={"x-api-key": KEY, "content-type": "application/json"},
    json={
        "productId": "0xe87625ef7415a58c92f2639b16d176521429aac002386dddf1e47e419dfeaddd",
        "buyer": BUYER,
        "coverageAmount": "${COVER_USDC_DEFAULT}",  # $100
        "asset": Web3.to_bytes(text="USDC").rjust(32, b"\\0").hex(),
    },
    timeout=20,
)
print(resp.json())`,

  curl: `# Replace LUMINA_API_KEY and BUYER_ADDRESS with your values
ASSET_USDC=0x5553444300000000000000000000000000000000000000000000000000000000

curl -X POST https://lumina-api-production-ac85.up.railway.app/api/v1/policies \\
  -H "x-api-key: $LUMINA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d "{
    \\"productId\\": \\"0xe87625ef7415a58c92f2639b16d176521429aac002386dddf1e47e419dfeaddd\\",
    \\"buyer\\": \\"$BUYER_ADDRESS\\",
    \\"coverageAmount\\": \\"${COVER_USDC_DEFAULT}\\",
    \\"asset\\": \\"$ASSET_USDC\\"
  }"`,
} as const

type Lang = keyof typeof SNIPPETS

export function AgentQuickStart() {
  const [lang, setLang] = useState<Lang>('ts')
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SNIPPETS[lang])
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignored — clipboard.writeText only fails on insecure contexts
    }
  }

  const tabBtn = (l: Lang, label: string) => (
    <button
      key={l}
      onClick={() => setLang(l)}
      style={{
        padding: '4px 12px',
        fontSize: 12,
        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        background: lang === l ? 'rgba(14,230,243,0.18)' : 'transparent',
        color: lang === l ? '#0ee6f3' : 'rgba(255,255,255,0.6)',
        border: '1px solid rgba(14,230,243,0.25)',
        borderBottom: lang === l ? '1px solid transparent' : '1px solid rgba(14,230,243,0.25)',
        cursor: 'pointer',
        borderRadius: '6px 6px 0 0',
      }}
    >
      {label}
    </button>
  )

  return (
    <section
      style={{
        border: '1px solid rgba(14,230,243,0.18)',
        borderRadius: 10,
        padding: 18,
        background: 'rgba(2,8,23,0.55)',
        marginBottom: 18,
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span
          aria-hidden
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: 'rgba(14,230,243,0.15)',
            color: '#0ee6f3',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          ▸
        </span>
        <h3 style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,0.95)' }}>
          First time here? Buy your first policy in 3 steps.
        </h3>
      </header>

      <ol
        style={{
          margin: 0,
          paddingLeft: 24,
          fontSize: 13,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.78)',
        }}
      >
        <li>
          <strong style={{ color: '#0ee6f3' }}>Generate an API key</strong> — go to{' '}
          <a href="/app/agent/api-keys" style={{ color: '#0ee6f3' }}>
            /app/agent/api-keys
          </a>{' '}
          and sign with your wallet. You'll receive an <code>lk_…</code> key once.
        </li>
        <li>
          <strong style={{ color: '#0ee6f3' }}>Approve USDC for CoverRouter</strong> — the buyer
          wallet must allow CoverRouter to pull premium. The SDK helper{' '}
          <code>lumina.policies.ensureAllowance(buyer)</code> does this in one call (idempotent).
        </li>
        <li>
          <strong style={{ color: '#0ee6f3' }}>POST a policy</strong> — minimum cover is{' '}
          <code>{COVER_USDC_DEFAULT}</code> base units ($100). Premium is computed on-chain;
          relayer pays gas.
        </li>
      </ol>

      <div style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', gap: 0, marginBottom: -1 }}>
          {tabBtn('ts', 'TypeScript')}
          {tabBtn('python', 'Python')}
          {tabBtn('curl', 'curl')}
          <button
            onClick={() => void copy()}
            style={{
              marginLeft: 'auto',
              padding: '4px 12px',
              fontSize: 12,
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              background: copied ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.05)',
              color: copied ? '#10b981' : 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer',
              borderRadius: 6,
            }}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
        <pre
          style={{
            margin: 0,
            padding: 14,
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(14,230,243,0.25)',
            borderRadius: '0 6px 6px 6px',
            overflow: 'auto',
            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
            fontSize: 12,
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.55,
          }}
        >
          <code>{SNIPPETS[lang]}</code>
        </pre>
      </div>

      <footer
        style={{
          marginTop: 12,
          fontSize: 11,
          color: 'rgba(255,255,255,0.5)',
          display: 'flex',
          gap: 14,
          flexWrap: 'wrap',
        }}
      >
        <a href="https://docs.lumina-org.com/quickstart" target="_blank" rel="noreferrer" style={{ color: '#0ee6f3' }}>
          Quickstart →
        </a>
        <a href="https://docs.lumina-org.com/api-reference/sandbox" target="_blank" rel="noreferrer" style={{ color: '#0ee6f3' }}>
          Try without an account (sandbox) →
        </a>
        <a href="https://www.npmjs.com/package/@lumina-org/sdk" target="_blank" rel="noreferrer" style={{ color: '#0ee6f3' }}>
          npm @lumina-org/sdk →
        </a>
      </footer>
    </section>
  )
}
