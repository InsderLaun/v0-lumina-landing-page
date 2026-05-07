const DOCS_URL = 'https://docs.lumina-org.com/concepts/lifecycle'

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: '01',
    title: 'Buy policy (USDC)',
    body: 'Pay a small premium in USDC. 100% routed to TWAPBurner → buy & burn $LUMINA on Uniswap V3.',
  },
  {
    n: '02',
    title: 'Trigger fires',
    body: 'Oracle observes the covered asset. If the trigger condition is met inside the policy window, the policy is triggered.',
  },
  {
    n: '03',
    title: 'ClaimBond minted',
    body: 'ERC-1155 minted to your wallet — $1 face value per unit, 730d maturity, indexed by epoch.',
  },
  {
    n: '04',
    title: 'Choose: wait OR sell',
    body: 'Hold the bond to maturity for $LUMINA, or list it on the secondary marketplace today for USDC.',
  },
  {
    n: '05',
    title: 'Wait 730d → $LUMINA',
    body: 'redeemBond() reads the oracle and mints luminaAmount = usdAmount / LUMINA_price. Capture the upside.',
  },
  {
    n: '06',
    title: 'OR sell now → USDC',
    body: 'Listed at a discount. Buyer pays USDC, 1.5% maker + 1.5% taker — full 3% sent to TWAPBurner and burned.',
  },
]

export function LifecycleSection() {
  return (
    <section className="rd-sec" id="lifecycle">
      <div className="wrap">
        <div className="rd-sec-num">
          06 / 09 · <span>Lifecycle</span>
        </div>
        <h2>
          From <em>premium</em> to <em>payout</em>.
        </h2>
        <p className="rd-sec-lede">
          $3 USDC in. Trigger fires. ClaimBond minted. Wait 730d for $LUMINA — or sell now for USDC.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            marginTop: 24,
            marginBottom: 24,
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.n}
              style={{
                flex: '1 1 260px',
                minWidth: 240,
                border: '1px solid var(--rd-line-strong)',
                borderRadius: 'var(--rd-radius)',
                padding: '16px 20px',
                background: 'var(--rd-bg-2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  color: 'var(--rd-text-3)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Step {s.n}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: 'var(--rd-text)',
                  fontWeight: 600,
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: 'var(--rd-text-2)',
                  lineHeight: 1.55,
                }}
              >
                {s.body}
              </div>
            </div>
          ))}
        </div>

        <details
          style={{
            border: '1px solid var(--rd-line-strong)',
            borderRadius: 'var(--rd-radius)',
            padding: '14px 20px',
            background: 'var(--rd-bg-2)',
            marginBottom: 24,
          }}
        >
          <summary
            className="mono"
            style={{
              cursor: 'pointer',
              color: 'var(--rd-text)',
              fontSize: 14,
              letterSpacing: '0.02em',
            }}
          >
            Worked example: $3 → $800 cover → trigger → 800 units → 1,600 LUMINA
          </summary>
          <div
            style={{
              marginTop: 12,
              fontSize: 14,
              color: 'var(--rd-text-2)',
              lineHeight: 1.6,
            }}
          >
            <p style={{ margin: '0 0 8px' }}>
              Pay <strong>$3 USDC</strong> for a Flash BTC 1h policy covering{' '}
              <strong>$800</strong>. The trigger fires inside the window — BTC drops 5% in one hour.
            </p>
            <p style={{ margin: '0 0 8px' }}>
              An <strong>800-unit ClaimBond</strong> is minted to your wallet (ERC-1155, $1 face,
              730d maturity).
            </p>
            <p style={{ margin: '0 0 8px' }}>
              <strong>Path A — wait 730d.</strong> At maturity, with $LUMINA at $0.50:
              <br />
              <code className="mono">800 / 0.50 = 1,600 LUMINA</code> minted to your wallet.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Path B — sell now.</strong> List on the secondary marketplace at, say, 70% of
              face → receive ~<strong>$560 USDC</strong> immediately. Maker fee 1.5% + taker fee 1.5%
              → 3% of trade value sent to TWAPBurner and burned.
            </p>
          </div>
        </details>

        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <a
            className="rd-btn rd-btn-primary"
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read full lifecycle docs →
          </a>
        </div>

        <p
          style={{
            marginTop: 16,
            fontSize: 12,
            color: 'var(--rd-text-3)',
            fontFamily: 'var(--font-jetbrains), monospace',
            letterSpacing: '0.04em',
          }}
        >
          Premium = USDC · Marketplace trade = USDC · Bond redeem at maturity = $LUMINA
        </p>
      </div>
    </section>
  )
}
