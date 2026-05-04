import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="rd-foot">
      <div className="wrap">
        <div className="rd-foot-grid">
          <div className="rd-foot-brand">
            <Link className="rd-logo" href="/" style={{ fontSize: 16 }}>
              <span className="rd-logo-mark" />
              <span>LUMINA</span>
              <span style={{ color: 'var(--rd-text-3)', fontWeight: 400, fontSize: 12 }}>
                · PROTOCOL
              </span>
            </Link>
            <p>
              Parametric risk speculation for humans &amp; AI agents. Built on Base L2.
              Deflationary by design.
            </p>
            <div className="rd-foot-status">
              <span className="rd-badge">
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--rd-pos)',
                  }}
                />{' '}
                BURN ENGINE ACTIVE
              </span>
              <span className="rd-badge">ERC-1155</span>
              <span className="rd-badge">CHAINLINK</span>
              <span className="rd-badge">82M RESERVE</span>
            </div>
          </div>

          <div className="rd-foot-col">
            <h5>Products</h5>
            <span className="rd-foot-link">Flash BTC 1h / 4h / 24h / 48h</span>
            <span className="rd-foot-link">Flash ETH 1h / 24h / 48h</span>
            <span className="rd-foot-link">Micro Depeg USDT</span>
            <span className="rd-foot-link">Rate Shock</span>
          </div>

          <div className="rd-foot-col">
            <h5>Resources</h5>
            <Link href="/whitepaper">Whitepaper · EN / ES</Link>
            <Link href="/skills">SKILL file</Link>
            <Link href="/docs">Smart contracts</Link>
            <Link href="/tutorial">Tutorial</Link>
          </div>

          <div className="rd-foot-col">
            <h5>Contact</h5>
            <a href="mailto:labs@lumina-org.com">labs@lumina-org.com</a>
            <a href="mailto:support@lumina-org.com">support@lumina-org.com</a>
            <a href="https://github.com/org-lumina" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>

        <div className="rd-foot-bottom">
          <span>© 2026 LUMINA PROTOCOL · ALL RIGHTS RESERVED</span>
          <span>BURN RATIO 1.50 · 9 PRODUCTS · BASE L2</span>
        </div>
      </div>
    </footer>
  )
}
