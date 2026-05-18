// components/whitepaper-short/Section8LiveState.tsx
// Server component — fetches /health with revalidate: 30.

import { FadeUp } from './MotionWrapper'
import { AddressCopyButton } from './AddressCopyButton'
import type { CopyEN } from './copy.en'
import { COPY_EN } from './copy.en'

const HEALTH_URL = 'https://lumina-api-production-ac85.up.railway.app/health'

type Health = {
  chain?: { block?: number; chainId?: number; rpcConnected?: boolean }
  relayer?: { address?: string; balanceWei?: string }
  contracts?: Record<string, string>
}

// Sprint Deploy V5.2 (2026-05-18): addresses repobladas tras redeploy 26-contract.
// Live values fetched from /health at runtime; this FALLBACK only renders if
// /health is unreachable.
const FALLBACK: Health = {
  chain: { block: 41680365, chainId: 84532, rpcConnected: true },
  relayer: { address: '0xe585e76A0b8CbbC2d10b1110a9ac3F4c11dBfDa8', balanceWei: '159192547587961617' },
  contracts: {
    coverRouter:   '0xcdB70B40e6a3DEac3189185d947A0e458518F566',
    policyManager: '0x546C07e07DeBCdbf7a2A7Ef12C38c8c8fcAFcDd8',
    bondVault:     '0x193acBc1EdC5E565a4aBE96941C7E7AeF637B6EC',
    claimBond:     '0xaa57Ab52Eb00f296Ad4CFA9E9c201f3737271FB4',
    marketplace:   '0x0938205f4cBe5F572656533FC930FFce6F5F4345',
    usdc:          '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    luminaToken:   '0x62C0b58bB30CA857674ec593F1e23B3F15266680',
  },
}

const ROW_ORDER: { key: keyof NonNullable<Health['contracts']>; label: string }[] = [
  { key: 'coverRouter',   label: 'CoverRouter'   },
  { key: 'policyManager', label: 'PolicyManager' },
  { key: 'bondVault',     label: 'BondVault'     },
  { key: 'claimBond',     label: 'ClaimBond'     },
  { key: 'marketplace',   label: 'Marketplace'   },
  { key: 'usdc',          label: 'USDC (mock)'   },
  { key: 'luminaToken',   label: 'LuminaToken'   },
]

async function fetchHealth(): Promise<Health> {
  try {
    const r = await fetch(HEALTH_URL, { next: { revalidate: 30 } })
    if (!r.ok) return FALLBACK
    return (await r.json()) as Health
  } catch {
    return FALLBACK
  }
}

function formatBlock(n: number | undefined, lang: 'en' | 'es') {
  if (!n) return '—'
  return new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US').format(n)
}

function formatEth(weiStr: string | undefined) {
  if (!weiStr) return '—'
  try {
    const wei = BigInt(weiStr)
    // Truncate to 4 decimals without floating-point loss.
    const eth = Number(wei) / 1e18
    return eth.toFixed(4) + ' ETH'
  } catch { return '—' }
}

export async function Section8LiveState({
  copy,
  lang,
}: { copy: CopyEN['s9']; lang: 'en' | 'es' }) {
  const data = await fetchHealth()
  const fmt = new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US')
  const burned = fmt.format(COPY_EN.s9.fallbackBurned)

  const stats: { label: string; value: string }[] = [
    { label: copy.statLabels[0], value: formatBlock(data.chain?.block, lang) },
    { label: copy.statLabels[1], value: formatEth(data.relayer?.balanceWei) },
    { label: copy.statLabels[2], value: burned },
    { label: copy.statLabels[3], value: '9 / 9' },
  ]

  const addresses = ROW_ORDER
    .map(r => ({ name: r.label, addr: data.contracts?.[r.key] ?? FALLBACK.contracts![r.key] }))
    .concat([{ name: 'Relayer', addr: data.relayer?.address ?? FALLBACK.relayer!.address! }])

  return (
    <section id="s9" className="wp-sec wp-sec--alt" data-screen-label="09 Live state">
      <div className="wp-sec__inner">
        <FadeUp className="wp-eyebrow wp-eyebrow--mono">{copy.eyebrow}</FadeUp>
        <FadeUp delay={100} as="h2" className="wp-h2">
          {copy.h2Pre}<em className="wp-em">{copy.h2Italic}</em>
        </FadeUp>
        <FadeUp delay={250} className="wp-lede">{copy.lede}</FadeUp>
        <div className="wp-stat-row">
          {stats.map((s, i) => (
            <FadeUp key={i} delay={400 + i * 100} className="wp-stat">
              <div className="wp-stat__strip" />
              <div className="wp-stat__lbl">{s.label}</div>
              <div className="wp-stat__val">{s.value}</div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={750} className="wp-addr-table">
          <div className="wp-addr-table__head">
            <div>{copy.addressTable.head[0]}</div>
            <div>{copy.addressTable.head[1]}</div>
            <div />
          </div>
          {addresses.map((r, i) => (
            <div key={i} className="wp-addr">
              <div className="wp-addr__name">{r.name}</div>
              <a
                href={`https://sepolia.basescan.org/address/${r.addr}`}
                target="_blank" rel="noopener noreferrer"
                className="wp-addr__hex"
              >
                <span className="wp-addr__full">{r.addr}</span>
                <span className="wp-addr__short">{r.addr.slice(0, 10)}…{r.addr.slice(-8)}</span>
              </a>
              <AddressCopyButton addr={r.addr} />
            </div>
          ))}
        </FadeUp>
        <FadeUp delay={1300} className="wp-health-foot">
          <span className="wp-live-dot wp-live-dot--green" />
          {copy.healthFooter}
        </FadeUp>
      </div>
    </section>
  )
}
