import type { ReactNode } from 'react'
import './insiderlaun.css'

const telegramUrl = 'https://t.me/InsiderLaun'
const discordUrl = 'https://discord.gg/a4eJuYAbJ'
const fomoUrl = 'https://fomo.family/r/Insider3v'

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function TelegramIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m21 3-4 18-6-5-4 4 1-7L21 3ZM8 13l-6-3 19-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function DiscordIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M19.7 5.05a18.3 18.3 0 0 0-4.52-1.4l-.57 1.16a16.9 16.9 0 0 0-5.2 0l-.58-1.16a18.1 18.1 0 0 0-4.53 1.4C1.44 9.28.67 13.4 1.05 17.46a18.2 18.2 0 0 0 5.56 2.8l1.2-1.95c-.66-.24-1.29-.54-1.89-.9l.46-.35c3.65 1.7 7.61 1.7 11.22 0l.47.35c-.6.36-1.24.66-1.9.9l1.2 1.95a18.1 18.1 0 0 0 5.56-2.8c.45-4.7-.77-8.78-3.23-12.41ZM8.62 14.9c-1.1 0-2-.98-2-2.18s.88-2.18 2-2.18 2.02.98 2 2.18c0 1.2-.88 2.18-2 2.18Zm6.76 0c-1.1 0-2-.98-2-2.18s.88-2.18 2-2.18 2.02.98 2 2.18-.88 2.18-2 2.18Z" fill="currentColor" /></svg>
}

function StarIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m12 1 2.6 6.7 6.9-1.6-3.8 6 5.3 4.7-7.1.1L12 23l-3.9-6.1-7.1-.1 5.3-4.7-3.8-6 6.9 1.6L12 1Z" fill="currentColor" /></svg>
}

/** Original vector sticker characters; decorative, with no third-party assets. */
function MemeCrew() {
  return (
    <svg className="il-crew" viewBox="0 0 600 480" fill="none" aria-hidden="true">
      <defs>
        <pattern id="il-dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#191c19" opacity=".16" />
        </pattern>
      </defs>
      <path d="m288 23 28 39 44-23 12 48 49-9-3 49 48 7-19 45 43 24-34 35 31 38-46 20 14 48-50 2-3 50-46-17-20 45-37-33-35 36-24-43-46 20-7-49-49 3 10-48-48-13 25-43-39-30 36-34-27-41 47-16-6-49 49 7 15-47 41 28Z" fill="#d7ed91" />
      <circle cx="290" cy="240" r="180" fill="url(#il-dots)" />
      <ellipse cx="305" cy="434" rx="198" ry="18" fill="#080a09" opacity=".7" />

      <g className="il-sticker-dog" transform="rotate(10 429 206)" stroke="#172119" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="m332 218-17-127q-2-29 22-11l61 39 65-18 37-51q16-22 25 3l24 113q20 41 4 88-18 56-84 67l-72-10q-54-24-65-93Z" fill="#f5f1dc" stroke="#f5f1dc" strokeWidth="18" />
        <path d="m332 218-17-127q-2-29 22-11l61 39 65-18 37-51q16-22 25 3l24 113q20 41 4 88-18 56-84 67l-72-10q-54-24-65-93Z" fill="#e7a366" />
        <path d="m337 110 11 59 39-33-50-26Zm164-32-25 47 44 14-19-61Z" fill="#ae6447" strokeWidth="4" />
        <path d="M341 217q37-26 67 1 15-13 29-7 48-35 89-6 14 63-42 88-104 29-143-76Z" fill="#ffe2af" stroke="none" />
        <path d="m358 171 67-9-2 38q-45 29-62-8l-3-21Zm79-10 64-11 7 24q-11 45-59 28l-12-41Z" fill="#222821" />
        <path d="m421 177 21-3m-60 5 15-3m70-9 14-3" stroke="#f9f5e8" strokeWidth="4" />
        <path d="m411 228 29-4q2 19-11 20-15 0-18-16Z" fill="#172119" strokeWidth="3" />
        <path d="M427 246q-9 22-31 8m32-11q20 18 35-4" />
        <path d="m409 273 12 21q20 2 23-24" fill="#f293b8" strokeWidth="4" />
        <path d="m379 306 25-20 48 7 33-13 4 27-49 25Z" fill="#bcadff" />
      </g>

      <g className="il-sticker-frog" transform="rotate(-9 219 291)" stroke="#172119" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M104 350q-28-34-9-85-10-60 26-84 35-26 70 11 30-47 79-27 44 13 43 69 36 22 30 66-8 62-76 80l-109 6Z" fill="#f5f1dc" stroke="#f5f1dc" strokeWidth="19" />
        <path d="M114 353q-19 31-14 72l207-1q-1-51-33-72Z" fill="#a799ed" />
        <path d="m150 375 30 46m79-47-20 47M163 405l83 1" />
        <path d="M104 350q-28-34-9-85-10-60 26-84 35-26 70 11 30-47 79-27 44 13 43 69 36 22 30 66-8 62-76 80l-109 6Z" fill="#83c77c" />
        <ellipse cx="217" cy="321" rx="103" ry="46" fill="#b6e498" stroke="none" />
        <g className="il-frog-eyes"><ellipse cx="144" cy="225" rx="31" ry="38" fill="#fff9e8" />
        <ellipse cx="246" cy="213" rx="33" ry="40" fill="#fff9e8" />
        <ellipse cx="156" cy="233" rx="10" ry="16" fill="#172119" stroke="none" />
        <ellipse cx="258" cy="223" rx="10" ry="16" fill="#172119" stroke="none" />
        </g><path d="M129 300q82 46 163-12M144 325q66 27 127-8" strokeWidth="5" />
        <path d="m122 288-5 18m178-30 6 18" strokeWidth="4" />
        <circle cx="180" cy="272" r="3" fill="#172119" stroke="none" /><circle cx="219" cy="268" r="3" fill="#172119" stroke="none" />
        <path d="M130 174q20-83 100-69 49 8 60 58-79-20-160 11Z" fill="#a799ed" />
        <path d="M115 175q87-42 198-7 21 8 9 20-5 5-24 0-105-22-183-2-22 6-22-1 0-5 22-10Z" fill="#c5b6ff" />
        <path d="m204 120-3 20m13-20-2 21 13 1" stroke="#172119" strokeWidth="6" />
        <path d="M81 361q-21-18-30-5-5 8 5 18-20-7-23 6-1 12 21 16-11 7-3 16 12 14 47-4" fill="#83c77c" />
      </g>

      <g className="il-sticker-coin" transform="rotate(12 416 372)" stroke="#172119" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="429" cy="374" rx="65" ry="72" fill="#f5f1dc" stroke="#f5f1dc" strokeWidth="16" />
        <ellipse cx="429" cy="374" rx="65" ry="72" fill="#ce8837" />
        <ellipse cx="416" cy="371" rx="61" ry="72" fill="#ffce63" />
        <ellipse cx="416" cy="371" rx="49" ry="58" stroke="#dfa844" strokeWidth="3" />
        <path d="m388 351 10 9-10 9m41-19 10 9-10 9" strokeWidth="6" />
        <path d="M391 389q25 28 48-3Z" fill="#fff5da" strokeWidth="4" />
        <path d="m478 348 9 3m-3 23 10 1m-13 22 8 3" strokeWidth="3" />
      </g>

      <g transform="rotate(-8 103 85)">
        <path d="M40 50h107q17 0 17 17v34q0 17-17 17h-28l-20 22 2-22H40q-17 0-17-17V67q0-17 17-17Z" fill="#f5f1dc" stroke="#172119" strokeWidth="5" />
        <text x="94" y="98" textAnchor="middle" fill="#172119" className="il-svg-gm">gm.</text>
      </g>
      <g transform="rotate(-7 339 432)">
        <rect x="253" y="411" width="167" height="44" rx="4" fill="#f69cbd" stroke="#172119" strokeWidth="4" />
        <text x="336" y="440" textAnchor="middle" fill="#172119" className="il-svg-sticker">STAY WEIRD.</text>
      </g>
      <path d="m534 340 9-21 9 21 23 8-23 9-9 23-9-23-24-9Z" fill="#bcadff" stroke="#172119" strokeWidth="4" />
      <path d="m82 139 5-14 6 14 15 5-15 6-6 15-5-15-15-6Z" fill="#f6a6c1" />
      <path d="m542 67 15-9m-12 26 21 2M51 263l-21-7m22 26-17 6" stroke="#f5f1dc" strokeWidth="4" strokeLinecap="round" />
      <path d="m563 235-8-8q-14-17-21-3-5-13-17-5-12 9 9 26l12 9Z" fill="#f6a6c1" transform="rotate(13 538 235)" />
    </svg>
  )
}

function CommunityCard({ kind, number, eyebrow, title, description, tags, action, href, icon }: {
  kind: string; number: string; eyebrow: string; title: ReactNode; description: string
  tags: string[]; action: string; href: string; icon: ReactNode
}) {
  return (
    <a className={'il-community-card il-card-' + kind} href={href} target="_blank" rel="noopener noreferrer">
      <div className="il-card-top"><span className="il-card-label">{number} / {eyebrow}</span><span className="il-platform-icon">{icon}</span></div>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul className="il-card-tags" aria-label="What you will find">{tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
      <span className="il-card-action">{action}<span><ArrowIcon /></span></span>
    </a>
  )
}

export default function HomePage() {
  return (
    <main className="il-page">
      <a className="il-skip" href="#community">Skip to community links</a>
      <div className="il-shell">
        <header className="il-header">
          <a className="il-brand" href="/" aria-label="InsiderLaun home">
            <span className="il-brand-icon"><StarIcon /></span>
            <span>Insider<span className="il-brand-accent">Laun</span><span className="il-brand-period">.</span></span>
          </a>
          <span className="il-header-note"><span /> MEMECOIN CULTURE CLUB</span>
        </header>

        <section className="il-hero" aria-labelledby="il-title">
          <div className="il-hero-copy">
            <p className="il-eyebrow"><span /> LESS SCROLLING. MORE DISCOVERING.</p>
            <h1 id="il-title"><span>MEMECOINS.</span><span>MEET YOUR</span><span className="il-title-accent">PEOPLE<svg viewBox="0 0 80 80" aria-hidden="true"><path d="m40 2 7 24L69 9 56 33l24 7-24 7 13 24-22-17-7 24-7-24L9 71l15-24L0 40l24-7L9 9l24 17Z" fill="currentColor" /></svg></span></h1>
            <p className="il-hero-description">Your home for memecoin discoveries, internet culture and the people behind it all. Follow the radar. Find your community. Join the conversation.</p>
            <a className="il-explore" href="#community">Find your corner of the internet <span aria-hidden="true">↓</span></a>
          </div>
          <div className="il-hero-art">
            <MemeCrew />
            <span className="il-art-caption">A LITTLE CHAOS. A LOT OF COMMUNITY.</span>
            <label className="il-motion-control"><input className="il-motion-input" type="checkbox" /><span>Pause motion</span></label>
          </div>
        </section>

        <section className="il-community" id="community" aria-labelledby="il-community-title">
          <div className="il-section-heading">
            <h2 id="il-community-title">Pick your way in<span>.</span></h2>
            <p>One community. Two places to connect.</p>
          </div>
          <div className="il-community-grid">
            <CommunityCard
              kind="telegram" number="01" eyebrow="FOLLOW THE FEED"
              title={<>Telegram <span>Live Radar</span></>}
              description="Follow our memecoin radar for discoveries, updates and community highlights. See what InsiderLaun is watching and catch the latest posts in one easy-to-follow channel."
              tags={['Memecoin radar', 'Latest updates', 'Community finds']}
              action="Open Telegram Radar" href={telegramUrl} icon={<TelegramIcon />}
            />
            <CommunityCard
              kind="discord" number="02" eyebrow="FIND YOUR PEOPLE"
              title={<>Discord <span>Community</span></>}
              description="Make yourself at home with other memecoin enthusiasts. Share memes, ask questions, discuss new discoveries and keep the conversation going with the InsiderLaun community."
              tags={['Community chat', 'Memes & ideas', 'Shared discoveries']}
              action="Join the Discord" href={discordUrl} icon={<DiscordIcon />}
            />
          </div>
          <a className="il-fomo" href={fomoUrl} target="_blank" rel="sponsored noopener noreferrer">
            <span className="il-fomo-sticker" aria-hidden="true"><StarIcon /><span>F!</span></span>
            <span className="il-fomo-copy">
              <span className="il-fomo-label">YOUR INVITATION / FOMO FAMILY</span>
              <span className="il-fomo-title">There’s a place for you on FOMO, too.</span>
              <span className="il-fomo-description">Head to FOMO through the InsiderLaun referral link and create your account with our invitation.</span>
            </span>
            <span className="il-fomo-action">Explore FOMO <ArrowIcon /></span>
          </a>
        </section>
        <footer className="il-footer">
          <span>InsiderLaun<span className="il-footer-dot">.</span> <span className="il-footer-tag">Made for the meme generation.</span></span>
          <span className="il-footer-note">GOOD MEMES. GOOD COMPANY. <StarIcon /></span>
        </footer>
      </div>
    </main>
  )
}
