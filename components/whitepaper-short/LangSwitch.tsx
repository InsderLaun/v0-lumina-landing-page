// components/whitepaper-short/LangSwitch.tsx
'use client'

import Link from 'next/link'

export function LangSwitch({ current }: { current: 'en' | 'es' }) {
  return (
    <div className="wp-lang-switch" aria-label="Language">
      <Link
        href="/whitepaper-short/en"
        className={current === 'en' ? 'is-active' : ''}
        prefetch={false}
      >
        EN
      </Link>
      <Link
        href="/whitepaper-short/es"
        className={current === 'es' ? 'is-active' : ''}
        prefetch={false}
      >
        ES
      </Link>
    </div>
  )
}
