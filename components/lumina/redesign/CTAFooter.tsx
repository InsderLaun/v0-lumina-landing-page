import Link from 'next/link'

export function CTAFooter() {
  return (
    <section className="rd-sec rd-cta-banner">
      <div className="wrap">
        <div className="rd-grid">
          <h2>
            Ready to bet against
            <br />
            <em>market chaos?</em>
          </h2>
          <div className="rd-cta-side">
            <Link className="rd-btn rd-btn-primary" href="/app">
              Launch the app →
            </Link>
            <Link className="rd-btn rd-btn-ghost" href="/whitepaper">
              Whitepaper · EN / ES
            </Link>
            <div className="label" style={{ marginTop: 8 }}>
              Built on Base L2 · Deflationary by design
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
