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
            <h5>Products · V5.3</h5>
            <span className="rd-foot-link">Flash BTC 1h / 24h / 48h</span>
            <span className="rd-foot-link">Flash ETH 1h / 24h / 48h</span>
          </div>

          <div className="rd-foot-col">
            <h5>Resources</h5>
            <Link href="/whitepaper">Whitepaper · EN / ES</Link>
            <Link href="/skills">SKILL file</Link>
            <Link href="/docs">Smart contracts</Link>
            <Link href="/tutorial">Tutorial</Link>
            <Link href="/faucet">Testnet faucet</Link>
            <Link href="/legal">Legal · Terms &amp; Risk</Link>
          </div>

          <div className="rd-foot-col">
            <h5>For builders</h5>
            <a href="https://docs.lumina-org.com" target="_blank" rel="noopener noreferrer">
              Docs (Mintlify)
            </a>
            <a
              href="https://www.npmjs.com/package/@lumina-org/sdk"
              target="_blank"
              rel="noopener noreferrer"
            >
              @lumina-org/sdk on npm
            </a>
            <a
              href="https://lumina-api-production-ac85.up.railway.app/openapi.json"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenAPI spec
            </a>
            <a
              href="https://lumina-api-production-ac85.up.railway.app/api-docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Swagger UI
            </a>
          </div>

          <div className="rd-foot-col">
            <h5>Contact</h5>
            <a href="mailto:labs@lumina-org.com">labs@lumina-org.com</a>
            <a href="mailto:support@lumina-org.com">support@lumina-org.com</a>
            <a
              href="https://github.com/org-lumina/LUMINA-PROTOCOL"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: 12,
            color: 'var(--rd-text-3)',
          }}
        >
          API base URL ·{' '}
          <code
            style={{
              padding: '2px 6px',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.04)',
              color: 'var(--rd-text-2)',
            }}
          >
            https://lumina-api-production-ac85.up.railway.app
          </code>
        </div>

        <div className="rd-foot-bottom">
          <span>© 2026 LUMINA PROTOCOL · ALL RIGHTS RESERVED</span>
          <span>6 PRODUCTS · BASE SEPOLIA · TESTNET</span>
        </div>
      </div>
    </footer>
  )
}
