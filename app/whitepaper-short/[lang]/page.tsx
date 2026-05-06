// app/whitepaper-short/[lang]/page.tsx
// Server component. Renders both EN and ES via [lang] route param.
// Imports redesign.css once (already-imported pattern from app/page.tsx).

import { notFound } from 'next/navigation'
import { TopBar } from '@/components/lumina/redesign/TopBar'
import { Nav } from '@/components/lumina/redesign/Nav'
import { SiteFooter } from '@/components/lumina/redesign/SiteFooter'

import { COPY_EN } from '@/components/whitepaper-short/copy.en'
import { COPY_ES } from '@/components/whitepaper-short/copy.es'

import { Section1Hero } from '@/components/whitepaper-short/Section1Hero'
import { Section2Problem } from '@/components/whitepaper-short/Section2Problem'
import { Section3HowItWorks } from '@/components/whitepaper-short/Section3HowItWorks'
import { Section4Shields } from '@/components/whitepaper-short/Section4Shields'
import { Section5Tokenomics } from '@/components/whitepaper-short/Section5Tokenomics'
import { Section6Matrix } from '@/components/whitepaper-short/Section6Matrix'
import { Section7ForAgents } from '@/components/whitepaper-short/Section7ForAgents'
import { Section8LiveState } from '@/components/whitepaper-short/Section8LiveState'
import { Section9CTA } from '@/components/whitepaper-short/Section9CTA'
import { LangSwitch } from '@/components/whitepaper-short/LangSwitch'

import '@/components/lumina/redesign/redesign.css'
import '@/components/whitepaper-short/wp-short.css'

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }]
}

type Lang = 'en' | 'es'

export default async function WhitepaperShortPage({
  params,
}: {
  params: Promise<{ lang: Lang }>
}) {
  const { lang } = await params
  if (lang !== 'en' && lang !== 'es') notFound()
  const copy = lang === 'es' ? COPY_ES : COPY_EN

  return (
    <div className="rd-page">
      <TopBar />
      <Nav />
      <LangSwitch current={lang} />
      <main>
        <Section1Hero copy={copy.s1} />
        <Section2Problem copy={copy.s2} />
        <Section3HowItWorks copy={copy.s3} />
        <Section4Shields copy={copy.s4} />
        <Section5Tokenomics copy={copy.s5} lang={lang} />
        <Section6Matrix copy={copy.s6} />
        <Section7ForAgents copy={copy.s7} />
        {/* Section 8 fetches /health on the server with revalidate: 30 */}
        <Section8LiveState copy={copy.s8} lang={lang} />
        <Section9CTA copy={copy.s9} />
      </main>
      <SiteFooter />
    </div>
  )
}
