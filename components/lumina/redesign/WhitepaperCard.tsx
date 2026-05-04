import Link from 'next/link'

export interface WhitepaperCardProps {
  variant: 'full' | 'summary'
  flag: string
  ver: string
  pages: string
  title: string
  desc: string
  toc: string
  href: string
  external?: boolean
  cta: string
  source: 'hosted' | 'github'
}

export function WhitepaperCard({
  variant,
  flag,
  ver,
  pages,
  title,
  desc,
  toc,
  href,
  external,
  cta,
  source,
}: WhitepaperCardProps) {
  const className = `rd-wp-card rd-${variant}`
  const inner = (
    <>
      <div className="rd-wp-card-head">
        <div className="rd-wp-card-flag">{flag}</div>
        <div className="rd-wp-card-meta">
          <span className="rd-ver">{ver}</span>
          <span className="rd-pages">{pages}</span>
        </div>
      </div>
      <h3 className="rd-wp-card-title">{title}</h3>
      <p className="rd-wp-card-desc">{desc}</p>
      <div className="rd-wp-card-toc">{toc}</div>
      <div className="rd-wp-card-cta">
        <span className="rd-source">
          {source === 'hosted' ? (
            <>
              <span className="rd-dot" /> HOSTED · LIVE
            </>
          ) : (
            'GITHUB · PDF'
          )}
        </span>
        <span className="rd-arrow">{cta}</span>
      </div>
    </>
  )

  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }
  return (
    <Link className={className} href={href}>
      {inner}
    </Link>
  )
}
