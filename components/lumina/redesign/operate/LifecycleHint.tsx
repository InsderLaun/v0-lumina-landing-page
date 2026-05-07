import type { ReactNode } from 'react'

const DOCS_URL = 'https://docs.lumina-org.com/concepts/lifecycle'

type Variant = 'agent' | 'marketplace' | 'portfolio'

const COPY: Record<
  Variant,
  { headline: string; lede: string; bullets: string[] }
> = {
  agent: {
    headline: 'What happens next?',
    lede: 'A quick map of the full Lumina lifecycle — from premium to payout.',
    bullets: [
      'Buy policy in USDC — 100% of premium burns $LUMINA.',
      'Trigger fires inside the policy window (oracle-observed).',
      'ClaimBond minted to the wallet (ERC-1155, $1 face, 730d).',
      'Choose: hold to maturity for $LUMINA, or sell now for USDC.',
      'Wait 730d → redeemBond() mints $LUMINA at oracle price.',
      'Or list on the secondary marketplace today (1.5% maker + 1.5% taker, 100% burned).',
    ],
  },
  marketplace: {
    headline: 'Why list a bond here?',
    lede:
      'Sellers exit early in USDC. Buyers acquire bonds at a discount and ride the $LUMINA upside to maturity.',
    bullets: [
      'SELL → immediate USDC liquidity at a discount to face value.',
      'WAIT → hold to 730d maturity for $LUMINA, capture the price upside.',
      'Trade fees: 1.5% maker + 1.5% taker — the full 3% is sent to TWAPBurner and burned.',
    ],
  },
  portfolio: {
    headline: 'What can I do with my bond?',
    lede: 'Two paths, one decision. Pick the trade-off you want.',
    bullets: [
      'WAIT → at 730d, redeem for $LUMINA at the oracle price (luminaAmount = usdAmount / LUMINA_price). Captures upside if $LUMINA appreciates.',
      'SELL → list on the secondary marketplace today, receive USDC at whatever discount the market clears. Immediate liquidity, no maturity wait.',
    ],
  },
}

export function LifecycleHint({ variant }: { variant: Variant }): ReactNode {
  const c = COPY[variant]
  return (
    <section
      style={{
        border: '1px solid var(--rd-line-strong)',
        borderRadius: 'var(--rd-radius)',
        background: 'var(--rd-bg-2)',
        padding: '20px 24px',
        margin: '0 0 24px',
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 12,
          color: 'var(--rd-text-3)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        Lifecycle
      </div>
      <h3
        style={{
          margin: '0 0 8px',
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--rd-text)',
        }}
      >
        {c.headline}
      </h3>
      <p
        style={{
          margin: '0 0 12px',
          fontSize: 14,
          color: 'var(--rd-text-2)',
          lineHeight: 1.6,
        }}
      >
        {c.lede}
      </p>
      <ul
        style={{
          margin: '0 0 12px',
          paddingLeft: 20,
          color: 'var(--rd-text-2)',
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        {c.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      <a
        href={DOCS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mono"
        style={{
          fontSize: 13,
          color: 'var(--rd-text)',
          textDecoration: 'underline',
          letterSpacing: '0.02em',
        }}
      >
        Read full lifecycle docs →
      </a>
    </section>
  )
}
