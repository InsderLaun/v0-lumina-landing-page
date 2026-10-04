import './insiderlaun.css'

const telegramUrl = 'https://t.me/InsiderLaun'
const discordUrl = 'https://discord.gg/a4eJuYAbJ'
const fomoUrl = 'https://fomo.family/r/Insider3v'

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M4.5 10h10.75M10 4.75 15.25 10 10 15.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="m20.47 4.17-3.1 15.02c-.23 1.06-.85 1.32-1.72.82l-4.76-3.51-2.3 2.22c-.25.25-.46.46-.94.46l.34-4.84 8.82-7.97c.38-.34-.08-.53-.59-.19L5.31 12.2.63 10.74c-1.02-.32-1.04-1.02.21-1.49L19.15 2.2c.84-.31 1.57.2 1.32 1.97Z" fill="currentColor" />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M19.7 5.05a18.3 18.3 0 0 0-4.52-1.4l-.57 1.16a16.9 16.9 0 0 0-5.2 0l-.58-1.16a18.1 18.1 0 0 0-4.53 1.4C1.44 9.28.67 13.4 1.05 17.46a18.2 18.2 0 0 0 5.56 2.8l1.2-1.95c-.66-.24-1.29-.54-1.89-.9l.46-.35c3.65 1.7 7.61 1.7 11.22 0l.47.35c-.6.36-1.24.66-1.9.9l1.2 1.95a18.1 18.1 0 0 0 5.56-2.8c.45-4.7-.77-8.78-3.23-12.41ZM8.62 14.9c-1.1 0-2-.98-2-2.18s.88-2.18 2-2.18 2.02.98 2 2.18c0 1.2-.88 2.18-2 2.18Zm6.76 0c-1.1 0-2-.98-2-2.18s.88-2.18 2-2.18 2.02.98 2 2.18-.88 2.18-2 2.18Z" fill="currentColor" />
    </svg>
  )
}

function FomoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="m12 2 2.2 6.6L21 6l-3.4 6 6.4 2.5-7 .8.5 7.1-4.5-5.5L8.5 22l1.2-7-7 .2 6.1-3.6L4 6l6.7 2.4L12 2Z" fill="currentColor" />
    </svg>
  )
}

function CommunityLink({
  href,
  name,
  detail,
  icon,
  sponsored = false,
}: {
  href: string
  name: string
  detail: string
  icon: React.ReactNode
  sponsored?: boolean
}) {
  return (
    <a
      className="il-link-card"
      href={href}
      target="_blank"
      rel={sponsored ? 'sponsored noreferrer' : 'noreferrer'}
    >
      <span className="il-link-icon">{icon}</span>
      <span className="il-link-copy">
        <strong>{name}</strong>
        <span>{detail}</span>
      </span>
      <span className="il-link-arrow"><ArrowIcon /></span>
    </a>
  )
}

export default function HomePage() {
  return (
    <main className="il-page">
      <div className="il-grain" aria-hidden="true" />
      <header className="il-header">
        <a className="il-brand" href="/" aria-label="InsiderLaun, inicio">
          <span className="il-mark" aria-hidden="true"><i /><i /><i /><i /></span>
          <span className="il-brand-name">Insider<span>Laun</span></span>
        </a>
        <span className="il-header-note"><span className="il-status-dot" /> MEMECOIN RADAR</span>
      </header>

      <section className="il-hero" aria-labelledby="il-title">
        <div className="il-copy">
          <p className="il-eyebrow"><span>01</span> CULTURA ONCHAIN · EN COMUNIDAD</p>
          <h1 id="il-title">El pulso de las <em>memecoins.</em></h1>
          <p className="il-description">
            InsiderLaun es un radar y punto de encuentro para seguir las conversaciones,
            descubrir comunidades y estar cerca de la cultura que nace onchain.
          </p>

          <div className="il-links" aria-label="Canales y comunidad">
            <CommunityLink
              href={telegramUrl}
              name="Telegram Live Radar"
              detail="Señales y conversación en tiempo real"
              icon={<TelegramIcon />}
            />
            <CommunityLink
              href={discordUrl}
              name="Discord Community"
              detail="Un espacio para compartir la cultura"
              icon={<DiscordIcon />}
            />
            <CommunityLink
              href={fomoUrl}
              name="FOMO Family"
              detail="Entrá a FOMO con mi invitación"
              icon={<FomoIcon />}
              sponsored
            />
          </div>
          <p className="il-footnote">Dos espacios para la comunidad. Un acceso extra a FOMO Family.</p>
        </div>

        <div className="il-art" aria-hidden="true">
          <div className="il-orbit il-orbit-outer" />
          <div className="il-orbit il-orbit-inner" />
          <div className="il-orbit il-orbit-core" />
          <div className="il-art-center">
            <span className="il-art-monogram">IL</span>
            <span className="il-art-caption">ONCHAIN CULTURE</span>
          </div>
          <span className="il-node il-node-one">MEME</span>
          <span className="il-node il-node-two">COMMUNITY</span>
          <span className="il-node il-node-three">RADAR</span>
          <span className="il-spark il-spark-one" />
          <span className="il-spark il-spark-two" />
        </div>
      </section>

      <footer className="il-footer">
        <span>InsiderLaun <span className="il-footer-dot">·</span> Radar de cultura memecoin</span>
        <span className="il-footer-right">BUILT AROUND COMMUNITY <span className="il-footer-star">✳</span></span>
      </footer>
    </main>
  )
}
