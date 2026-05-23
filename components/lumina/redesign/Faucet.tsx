'use client'

// Faucet UI — wagmi-aware "claim test mUSDC + ETH" widget.
//
// Lives at:
//   - /faucet (its own page) via <FaucetSection />
//   - HUMAN tutorial step 1 (inline) via <FaucetButton />
//   - (anywhere else) drop <FaucetButton /> inside an `rd-faucet` container
//
// Talks to the lumina-api faucet endpoint:
//   POST {API_URL}/api/v1/faucet/claim   body: { wallet }
//   200 → { success, ethTxHash, usdcTxHash, ethAmount, usdcAmount,
//           mockUsdcAddress, nextEligibleAt }
//   429 / 503 → { error, code, nextEligibleAt? } + Retry-After header
//
// The component is the wagmi counterpart to the manual-wallet faucet form
// that used to live in app/faucet/page.tsx (the page now mounts this
// component instead; the manual form is removed in favour of a single
// connected-wallet path consistent with the rest of the Operate App).

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { LUMINA_API_URL } from '@/lib/lumina-config'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  LUMINA_API_URL ??
  'https://lumina-api-production-ac85.up.railway.app'

// MockUSDC contract on Base Sepolia. Surfaced in the success block as a
// fallback when the API response omits `mockUsdcAddress` (older API
// builds). The API copy is preferred when present.
const MOCK_USDC_FALLBACK = '0xD944d8e5D8329994D83950872Ec210891d3Ab6AE'

const EXPLORER = 'https://sepolia.basescan.org'

type FaucetSuccess = {
  success: true
  ethTxHash: string
  usdcTxHash: string
  ethAmount: string
  usdcAmount: string
  // New fields (Sprint USDC Mock — Phase 5). Made optional defensively so a
  // pre-update API build doesn't crash the UI.
  mockUsdcAddress?: string
  nextEligibleAt?: string
}

type FaucetError = {
  error?: string
  message?: string
  code?: string
  nextEligibleAt?: string
}

function describeError(code: string | undefined, fallback: string): string {
  switch (code) {
    case 'wallet_rate_limited':
      return 'This wallet already claimed in the last 24 hours.'
    case 'ip_rate_limited':
      return 'This network already claimed in the last 24 hours.'
    case 'out_of_eth':
      return 'Faucet relayer is temporarily out of ETH. Try again later.'
    case 'daily_cap_reached':
      return 'The global 50/day cap has been reached. Try again tomorrow.'
    case 'invalid_request':
      return 'Invalid wallet address.'
    default:
      return fallback
  }
}

export function FaucetButton() {
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FaucetSuccess | null>(null)
  const [errMsg, setErrMsg] = useState<string | null>(null)

  async function handleClaim() {
    if (!address || !isConnected) {
      setErrMsg('Connect your wallet first.')
      return
    }
    setLoading(true)
    setErrMsg(null)
    setResult(null)
    try {
      const res = await fetch(`${API_URL}/api/v1/faucet/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: address }),
      })
      // Try-parse: some 5xx responses may not be JSON. We tolerate that.
      let body: FaucetSuccess | FaucetError = {} as FaucetError
      try {
        body = (await res.json()) as FaucetSuccess | FaucetError
      } catch {
        body = { error: `HTTP ${res.status}` }
      }
      if (!res.ok || !('success' in body)) {
        const err = body as FaucetError
        const fallback = err.error ?? err.message ?? `HTTP ${res.status}`
        let msg = describeError(err.code, fallback)
        if (err.nextEligibleAt) {
          const when = new Date(err.nextEligibleAt).toLocaleString()
          msg = `${msg} Next try ${when}.`
        }
        setErrMsg(msg)
        return
      }
      setResult(body)
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const mockUsdcAddr = result?.mockUsdcAddress ?? MOCK_USDC_FALLBACK

  return (
    <div className="rd-faucet">
      {!isConnected && (
        <p className="rd-faucet-hint">
          Connect your wallet (top right) to claim test USDC.
        </p>
      )}

      <button
        type="button"
        className="rd-btn rd-btn-primary"
        onClick={handleClaim}
        disabled={!isConnected || loading}
      >
        {loading ? 'Minting…' : 'Get 10,000 test mUSDC + 0.05 ETH'}
      </button>

      {errMsg && (
        <p className="rd-faucet-err mono" role="alert">
          {errMsg}
        </p>
      )}

      {result && (
        <div className="rd-faucet-ok">
          <p className="rd-faucet-ok-lead">
            Sent {result.usdcAmount} mUSDC + {result.ethAmount} ETH to{' '}
            <code className="mono">{address}</code>.
          </p>
          <ul className="mono rd-faucet-receipts">
            <li>
              mUSDC tx:{' '}
              <a
                href={`${EXPLORER}/tx/${result.usdcTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.usdcTxHash.slice(0, 10)}…
              </a>
            </li>
            <li>
              ETH tx:{' '}
              <a
                href={`${EXPLORER}/tx/${result.ethTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.ethTxHash.slice(0, 10)}…
              </a>
            </li>
            <li>
              mUSDC contract:{' '}
              <a
                href={`${EXPLORER}/address/${mockUsdcAddr}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {mockUsdcAddr}
              </a>
            </li>
          </ul>
          {result.nextEligibleAt && (
            <p className="rd-faucet-next">
              Next claim available{' '}
              {new Date(result.nextEligibleAt).toLocaleString()}.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Full /faucet page section. Uses the same `rd-sec` chrome as the rest of
 * the redesign landing so the page sits inside TopBar + Nav + SiteFooter
 * naturally.
 */
export function FaucetSection() {
  return (
    <section className="rd-sec" id="faucet">
      <div className="wrap">
        <div className="rd-sec-num">
          UTIL · <span>Testnet faucet</span>
        </div>
        <h2>
          Get test <em>mUSDC</em> in one click.
        </h2>
        <p className="rd-sec-lede">
          Connect your wallet, click the button, get 10,000 mock USDC and 0.05
          Base Sepolia ETH. Enough to buy a Flash BTC 24h policy and pay gas.
          Mock USDC is purpose-built for Lumina testnet — it has no value.
        </p>

        <div style={{ marginTop: 24, marginBottom: 32 }}>
          <FaucetButton />
        </div>

        <div className="rd-faucet-rules">
          <div className="rd-faucet-rule">
            <div className="rd-faucet-rule-label">PER CLAIM</div>
            <div className="rd-faucet-rule-value">10,000 mUSDC + 0.05 ETH</div>
          </div>
          <div className="rd-faucet-rule">
            <div className="rd-faucet-rule-label">COOLDOWN</div>
            <div className="rd-faucet-rule-value">24h per wallet + IP</div>
          </div>
          <div className="rd-faucet-rule">
            <div className="rd-faucet-rule-label">GLOBAL CAP</div>
            <div className="rd-faucet-rule-value">50 claims / day</div>
          </div>
          <div className="rd-faucet-rule">
            <div className="rd-faucet-rule-label">MOCK USDC</div>
            <div className="rd-faucet-rule-value mono">
              <a
                href={`${EXPLORER}/address/${MOCK_USDC_FALLBACK}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {MOCK_USDC_FALLBACK.slice(0, 10)}…{MOCK_USDC_FALLBACK.slice(-6)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
