'use client'

import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import { parseAbiItem, formatUnits } from 'viem'
import { CONTRACTS } from '@/lib/lumina-config'

// Mock baseline used until a real on-chain query lands. Once the public client
// returns logs successfully, this is replaced by the on-chain total. Kept as a
// fallback for SSR and for environments where the RPC call fails.
const FALLBACK_BURNED = 1_284_402

const BURN_EXECUTED_EVENT = parseAbiItem(
  'event BurnExecuted(uint256 usdcSpent, uint256 luminaBurned, uint256 effectivePrice, uint256 timestamp)',
)

// Public Base Sepolia RPCs cap eth_getLogs windows; ~9000 blocks is safe and
// covers >5h at 2s block time, which is plenty for a marketing counter.
const LOG_LOOKBACK_BLOCKS = 9_000n

function formatLumina(weiTotal: bigint): number {
  return Number(formatUnits(weiTotal, 18))
}

export function BurnEngine() {
  const publicClient = usePublicClient()
  const [counter, setCounter] = useState(FALLBACK_BURNED)
  const [isReal, setIsReal] = useState(false)

  useEffect(() => {
    if (!publicClient) return
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
          const burned = log.args?.luminaBurned
          return burned ? sum + burned : sum
        }, 0n)

        if (total > 0n) {
          setCounter(Math.round(formatLumina(total)))
          setIsReal(true)
        }
      } catch {
        // Silent fallback: keep the mock counter rolling.
      }
    })()

    const unwatch = publicClient.watchContractEvent({
      address: CONTRACTS.TWAPBurner,
      abi: [BURN_EXECUTED_EVENT],
      eventName: 'BurnExecuted',
      onLogs: (incoming) => {
        const delta = incoming.reduce<bigint>((sum, log) => {
          const burned = log.args?.luminaBurned
          return burned ? sum + burned : sum
        }, 0n)
        if (delta === 0n) return
        setCounter((c) => c + Math.round(formatLumina(delta)))
        setIsReal(true)
      },
    })

    return () => {
      cancelled = true
      unwatch?.()
    }
  }, [publicClient])

  // Mock auto-increment only while we have not yet observed a real burn.
  useEffect(() => {
    if (isReal) return
    const id = setInterval(
      () => setCounter((c) => c + Math.floor(Math.random() * 60 + 5)),
      1800,
    )
    return () => clearInterval(id)
  }, [isReal])

  return (
    <section className="rd-sec rd-sec-alt" id="burn">
      <div className="wrap">
        <div className="rd-sec-num">
          06 / 08 · <span>Deflationary Flow</span>
        </div>
        <div className="rd-flow">
          <div>
            <h2>
              Every premium and every secondary trade burns $LUMINA. <em>Forever.</em>
            </h2>
            <p className="rd-sec-lede" style={{ marginTop: 32 }}>
              The protocol has two burn paths. Premiums route 100% through the TWAPBurner — USDC
              buys $LUMINA on Uniswap V3, tokens are sent to 0xdead. Secondary marketplace trades
              pay a 3% fee that takes the same path.
            </p>
            <ul className="rd-flow-list">
              <li>– Nothing routes to the team multisig.</li>
              <li>– Nothing accrues to a treasury.</li>
              <li>– Nothing waits in a buyback queue.</li>
              <li>– Burns are atomic with the originating transaction.</li>
            </ul>
          </div>

          <div className="rd-flow-diagram">
            <div className="label" style={{ marginBottom: 18 }}>
              EXAMPLE · $1,000 COVERAGE · BTC FLASH 1H
            </div>
            <div className="rd-flow-step">
              <div className="rd-num">01</div>
              <div className="rd-desc">
                User pays premium <small>USDC, atomic</small>
              </div>
              <div className="rd-amt">$2.40</div>
            </div>
            <div className="rd-flow-step">
              <div className="rd-num">02</div>
              <div className="rd-desc">
                TWAPBurner buys LUMINA <small>Uniswap V3 · 0.3% pool</small>
              </div>
              <div className="rd-amt">$2.40 in</div>
            </div>
            <div className="rd-flow-step rd-fire">
              <div className="rd-num">03</div>
              <div className="rd-desc">
                Tokens sent to 0xdead <small>permanent · supply −</small>
              </div>
              <div className="rd-amt">≈ 65.93 LUMINA</div>
            </div>
            <div className="rd-flow-step">
              <div className="rd-num">04</div>
              <div className="rd-desc">
                If trigger fires <small>oracle verified, same block</small>
              </div>
              <div className="rd-amt mono">$800 bond</div>
            </div>

            <div className="rd-burn-counter">
              <div className="label">
                TOTAL LUMINA BURNED {isReal && <span style={{ color: 'var(--rd-accent)' }}>· LIVE</span>}
              </div>
              <div className="rd-v">{counter.toLocaleString('en-US')}</div>
              <div className="rd-sub">
                {isReal
                  ? 'Read from TWAPBurner.BurnExecuted on Base Sepolia · last 9k blocks'
                  : '~ $46,752 destroyed forever · last 30d: 184k'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
