import Link from 'next/link'

interface WhitepaperShellProps {
  lang: 'en' | 'es'
  iframeSrc: string
}

// Sticky thin nav bar + iframe filling the rest of the viewport.
// The iframe content (LUMINA-WHITEPAPER-{EN,ES}-V3.html) is fully
// self-contained (inline CSS, TEAL palette per founder decision —
// long-form whitepapers keep their original brand styling, only the
// outer shell takes the redesign CYAN).
export function WhitepaperShell({ lang, iframeSrc }: WhitepaperShellProps) {
  const otherLang = lang === 'en' ? 'es' : 'en'
  const labels = lang === 'en'
    ? { home: '← Home', other: 'ES', docs: 'Docs', skills: 'Skills', tutorial: 'Tutorial' }
    : { home: '← Inicio', other: 'EN', docs: 'Docs', skills: 'Skills', tutorial: 'Tutorial' }

  return (
    <div
      style={{
        background: 'var(--rd-bg)',
        color: 'var(--rd-text)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'color-mix(in oklab, var(--rd-bg) 92%, transparent)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--rd-line)',
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          fontSize: 13,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              color: 'var(--rd-text)',
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: '-0.01em',
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                background: 'var(--rd-accent)',
                borderRadius: 2,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 50%, 0 100%)',
              }}
            />
            LUMINA
            <span style={{ color: 'var(--rd-text-3)', fontWeight: 400, fontSize: 12 }}>
              · WHITEPAPER {lang.toUpperCase()}
            </span>
          </Link>
          <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--rd-text-2)' }}>
            <Link href="/docs">{labels.docs}</Link>
            <Link href="/skills">{labels.skills}</Link>
            <Link href="/tutorial">{labels.tutorial}</Link>
            <Link href="/whitepaper" style={{ color: 'var(--rd-accent)' }}>
              Whitepaper
            </Link>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            color: 'var(--rd-text-3)',
            letterSpacing: '0.04em',
          }}
        >
          <Link
            href={`/whitepaper/${otherLang}`}
            style={{
              padding: '4px 10px',
              border: '1px solid var(--rd-line-strong)',
              borderRadius: 4,
              color: 'var(--rd-text-2)',
            }}
          >
            {labels.other}
          </Link>
          <Link
            href="/"
            style={{
              padding: '4px 10px',
              border: '1px solid var(--rd-line-strong)',
              borderRadius: 4,
              color: 'var(--rd-text-2)',
            }}
          >
            {labels.home}
          </Link>
        </div>
      </nav>

      <iframe
        src={iframeSrc}
        title={`Lumina Whitepaper V3 ${lang.toUpperCase()}`}
        style={{
          flex: 1,
          width: '100%',
          minHeight: 'calc(100vh - 48px)',
          border: 0,
          background: '#0A0F1C',
          display: 'block',
        }}
      />
    </div>
  )
}
