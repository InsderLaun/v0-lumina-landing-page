import Link from 'next/link'

const AUDIENCES = [
  {
    role: 'For humans',
    title: 'Speculators',
    body: 'Connect a wallet. Browse 9 products. Pay a premium in USDC. If the trigger fires, you receive a ClaimBond — sell early or hold to maturity.',
    cta: 'Read the guide',
    href: '/tutorial?mode=human',
  },
  {
    role: 'For agents',
    title: 'AI developers',
    body: 'Install @lumina-org/sdk. Sign one message to mint an API key. POST /api/v1/policies. The relayer pays gas — your agent only pays the USDC premium. Same bond mechanics, same oracle resolution as humans.',
    cta: 'Read SDK docs',
    href: 'https://docs.lumina-org.com/sdk/installation',
  },
  {
    role: 'For yield',
    title: 'Bond buyers',
    body: 'Buy ClaimBonds at a discount on the secondary marketplace. ERC-1155, fractional, fungible by maturity month. IRR 43–150% depending on discount.',
    cta: 'Open marketplace',
    href: '/app',
  },
] as const

export function Audience() {
  return (
    <section className="rd-sec" id="audiences" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <div className="rd-sec-num">
          07 / 08 · <span>Three Doors</span>
        </div>
        <h2>Built for humans, AI agents, and yield seekers — all using the same contracts.</h2>
        <p className="rd-sec-lede">
          No fast lane, no special access. The same primitives, exposed through three surfaces.
        </p>
      </div>
      <div className="rd-audiences">
        {AUDIENCES.map((x) => (
          <Link className="rd-audience" key={x.role} href={x.href}>
            <div className="rd-role">{x.role}</div>
            <h4>{x.title}</h4>
            <p>{x.body}</p>
            <div className="rd-audience-cta">
              <span>{x.cta}</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
