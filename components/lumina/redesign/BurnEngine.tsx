'use client'

import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import { parseAbiItem, formatUnits } from 'viem'
// [NOT-MIGRATABLE-TO-useContracts]
// CONTRACTS.TWAPBurner is NOT exposed by /health (only the 7 canonical
// keys are). Used only for the on-chain FALLBACK scan below; the primary
// source is the Ponder-backed /api/v1/stats/burns endpoint.
import { CONTRACTS, LUMINA_API_URL } from '@/lib/lumina-config'

const BURN_EXECUTED_EVENT = parseAbiItem(
  'event BurnExecuted(uint256 usdcSpent, uint256 luminaBurned, uint256 effectivePrice, uint256 timestamp)',
)

// Public Base Sepolia RPCs cap eth_getLogs windows; ~9000 blocks is safe.
const LOG_LOOKBACK_BLOCKS = 9_000n

function formatLumina(weiTotal: bigint): number {
  return Number(formatUnits(weiTotal, 18))
}

export function BurnEngine() {
  const publicClient = usePublicClient()
  // No fake baseline — start at 0 and only show real, indexed/on-chain data.
  const [burned, setBurned] = useState(0)
  const [usdcVolume, setUsdcVolume] = useState(0) // whole USDC
  const [last30, setLast30] = useState(0) // whole LUMINA
  const [source, setSource] = useState<'api' | 'chain' | null>(null)

  // Primary source: the Ponder-backed aggregate endpoint (fast, resilient).
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${LUMINA_API_URL}/api/v1/stats/burns`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`stats/burns ${res.status}`)
        const b = await res.json()
        if (cancelled) return
        setBurned(formatLumina(BigInt(b.total_lumina_burned ?? '0')))
        setUsdcVolume(Number(formatUnits(BigInt(b.total_usdc_volume ?? '0'), 6)))
        setLast30(formatLumina(BigInt(b.last_30_days_burned ?? '0')))
        setSource('api')
      } catch {
        // API unavailable → fall through to the on-chain scan effect below.
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Fallback: read TWAPBurner.BurnExecuted directly if the API didn't answer.
  useEffect(() => {
    if (source === 'api' || !publicClient) return
    let cancelled = false
    ;(async () => {
      try {
        const head = await publicClient.getBlockNumber()
        const fromBlock = head > LOG_LOOKBACK_BLOCKS ? head - LOG_LOOKBACK_BLOCKS : 0n
        const logs = await publicClient.getLogs({
          address: CONTRACTS.TWAPBurner,
          event: BURN_EXECUTED_EVENT,
          fromBlock,
          toBlock: head,
        })
        if (cancelled) return
        const total = logs.reduce<bigint>((sum, log) => {
          const v = log.args?.luminaBurned
          return v ? sum + v : sum
        }, 0n)
        setBurned(formatLumina(total))
        setSource('chain')
      } catch {
        // Both sources failed — leave the honest 0.
      }
    })()
    return () => {
      cancelled = true
    }
  }, [publicClient, source])

  return (
    <section className="rd-sec rd-sec-alt" id="burn">
      <div className="wrap">
        <div className="rd-sec-num">
          07 / 09 · <span>Deflationary Flow</span>
        </div>
        <div className="rd-flow">
          <div>
            <h2>
              Every premium and every secondary trade burns $LUMINA. <em>Forever.</em>
            </h2>
            <p className="rd-sec-lede" style={{ marginTop: 32 }}>
              The protocol has two burn paths. Premiums route through the AdaptiveFeeDistributor —
              85% burn (USDC buys $LUMINA on Uniswap V3, tokens are sent to 0xdead),
              8% buyback, 2% operations, 5% maintenance. Secondary marketplace trades pay a 3%
              fee (1.5% seller + 1.5% buyer) that takes the same 85/8/2/5 path.
            </p>
            <ul className="rd-flow-list">
              <li>– 85% of every premium destroyed forever; 15% funds buyback, ops, maintenance.</li>
              <li>– No buyback queue — burns are atomic with the originating transaction.</li>
              <li>– AdaptiveFeeDistributor split is on-chain and immutable per deploy.</li>
              <li>– Sequencer-down + Chainlink-stale guards block every purchase entrypoint.</li>
            </ul>
          </div>

          <div className="rd-flow-diagram">
            <div className="label" style={{ marginBottom: 18 }}>
              EXAMPLE · $1,000 COVERAGE · FLASH BTC 1H
            </div>
            <div className="rd-flow-step">
              <div className="rd-num">01</div>
              <div className="rd-desc">
                User pays premium <small>USDC, atomic</small>
              </div>
              <div className="rd-amt">$2.92</div>
            </div>
            <div className="rd-flow-step">
              <div className="rd-num">02</div>
              <div className="rd-desc">
                AdaptiveFeeDistributor splits <small>85/8/2/5 · TWAPBurner / Buyback / Ops / Maintenance</small>
              </div>
              <div className="rd-amt">$2.48 to burn</div>
            </div>
            <div className="rd-flow-step rd-fire">
              <div className="rd-num">03</div>
              <div className="rd-desc">
                Tokens sent to 0xdead <small>permanent · supply −</small>
              </div>
              <div className="rd-amt">≈ 68.13 LUMINA</div>
            </div>
            <div className="rd-flow-step">
              <div className="rd-num">04</div>
              <div className="rd-desc">
                If trigger fires <small>BTC -2.5% in 1h · oracle verified</small>
              </div>
              <div className="rd-amt mono">$800 bond</div>
            </div>

            <div className="rd-burn-counter">
              <div className="label">
                TOTAL LUMINA BURNED{' '}
                {source && <span style={{ color: 'var(--rd-accent)' }}>· LIVE</span>}
              </div>
              <div className="rd-v">{burned.toLocaleString('en-US')}</div>
              <div className="rd-sub">
                {burned > 0
                  ? `≈ $${usdcVolume.toLocaleString('en-US', { maximumFractionDigits: 2 })} premium volume · last 30d: ${last30.toLocaleString('en-US')} LUMINA`
                  : 'Live data — production volumes accrue post-mainnet launch (testnet: 0).'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
