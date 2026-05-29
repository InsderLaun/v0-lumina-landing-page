// ────────────────────────────────────────────────────────────────
// LUMINA OPERATE APP — 8 SCREEN MOCKUPS
// Design reference for Claude Code implementation in Next.js repo.
// Tokens align with the home redesign (cyan accent, terminal aesthetic).
// ────────────────────────────────────────────────────────────────

const { useState, useMemo } = React;

// ─── DESIGN TOKENS (inline) ──────────────────────────────────────
const T = {
  bg: '#0a0a0c',
  bgAlt: '#0e0e12',
  bgCard: '#111116',
  bgCard2: '#15151c',
  border: '#1d1d24',
  borderHi: '#2a2a34',
  text: '#e8e8ec',
  text2: '#a8a8b3',
  text3: '#6b6b78',
  text4: '#44444f',
  cyan: '#00d4ff',
  cyanDim: 'rgba(0,212,255,0.12)',
  pos: '#00d48a',
  warn: '#f59e0b',
  neg: '#ef4444',
  fontSans: '"Inter", system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',
  fontDisplay: '"Fraunces", Georgia, serif',
};

// ─── SHARED PRIMITIVES ───────────────────────────────────────────
const Mono = ({ children, style }) => (
  <span style={{ fontFamily: T.fontMono, ...style }}>{children}</span>
);

const Pill = ({ children, color = T.cyan, bg }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '3px 8px', borderRadius: 4,
    fontFamily: T.fontMono, fontSize: 10, letterSpacing: '0.06em',
    color, background: bg || `${color}1a`, border: `1px solid ${color}33`,
    textTransform: 'uppercase',
  }}>{children}</span>
);

const Dot = ({ color = T.cyan, size = 6, pulse }) => (
  <span style={{
    display: 'inline-block', width: size, height: size, borderRadius: '50%',
    background: color, boxShadow: pulse ? `0 0 0 0 ${color}80` : 'none',
    animation: pulse ? 'pulse 1.8s infinite' : 'none',
  }} />
);

const Btn = ({ children, primary, ghost, small, full, disabled, icon, onClick }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, fontFamily: T.fontSans, fontWeight: 500,
    fontSize: small ? 12 : 13,
    padding: small ? '6px 12px' : '10px 18px',
    borderRadius: 6, border: '1px solid', cursor: disabled ? 'not-allowed' : 'pointer',
    width: full ? '100%' : 'auto', textDecoration: 'none',
    transition: 'all .12s', opacity: disabled ? 0.4 : 1,
    letterSpacing: '0.01em',
  };
  const variant = primary ? {
    background: T.cyan, color: '#001018', borderColor: T.cyan,
  } : ghost ? {
    background: 'transparent', color: T.text2, borderColor: T.border,
  } : {
    background: T.bgCard2, color: T.text, borderColor: T.borderHi,
  };
  return <button style={{ ...base, ...variant }} onClick={onClick} disabled={disabled}>
    {icon}{children}
  </button>;
};

// ─── APP SHELL (sidebar + topbar) ────────────────────────────────
function AppShell({ role, active, children, walletShort = '0x7a4F…3bC8', usdc = '12,480.32', lumina = '48,201' }) {
  const humanLinks = [
    { id: 'products', label: 'Products', icon: '◇' },
    { id: 'portfolio', label: 'Portfolio', icon: '◈' },
    { id: 'marketplace', label: 'Marketplace', icon: '◉' },
  ];
  const agentLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: '◇' },
    { id: 'policies', label: 'Policies', icon: '◆' },
    { id: 'bonds', label: 'Bonds', icon: '◈' },
    { id: 'api-keys', label: 'API Keys', icon: '◉' },
  ];
  const links = role === 'agent' ? agentLinks : humanLinks;
  return (
    <div style={{
      width: '100%', height: '100%', background: T.bg, color: T.text,
      fontFamily: T.fontSans, display: 'flex', flexDirection: 'column',
    }}>
      {/* Sepolia banner */}
      <div style={{
        background: '#3a2a0a', borderBottom: `1px solid ${T.warn}33`,
        padding: '6px 20px', fontSize: 11, fontFamily: T.fontMono,
        color: T.warn, letterSpacing: '0.06em', textAlign: 'center',
      }}>
        ⚠ SEPOLIA TESTNET · CHAIN 8453 · NO REAL FUNDS · USE TEST USDC ONLY
      </div>

      {/* Top bar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px', borderBottom: `1px solid ${T.border}`, background: T.bgAlt,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, letterSpacing: '-0.01em' }}>
            <span style={{ width: 16, height: 16, background: T.cyan, display: 'inline-block', clipPath: 'polygon(0 0,100% 0,100% 100%,50% 50%,0 100%)' }} />
            LUMINA <span style={{ color: T.text3, fontWeight: 400, fontSize: 12 }}>· OPERATE</span>
          </div>
          <Pill color={role === 'agent' ? T.warn : T.cyan}>
            {role === 'agent' ? '◉ AGENT SUPERVISOR' : '◇ HUMAN'}
          </Pill>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 6 }}>
            <Dot color={T.pos} pulse /> <Mono style={{ color: T.text2 }}>BASE SEPOLIA</Mono>
          </div>
          <div style={{ fontFamily: T.fontMono, color: T.text3, fontSize: 11 }}>
            <Mono style={{ color: T.text2 }}>{usdc}</Mono> USDC · <Mono style={{ color: T.cyan }}>{lumina}</Mono> LUMINA
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: T.bgCard, border: `1px solid ${T.borderHi}`, borderRadius: 6 }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg, #00d4ff, #f472b6)' }} />
            <Mono style={{ fontSize: 11, color: T.text }}>{walletShort}</Mono>
          </div>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <nav style={{
          width: 200, background: T.bgAlt, borderRight: `1px solid ${T.border}`,
          padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div style={{ fontFamily: T.fontMono, fontSize: 10, letterSpacing: '0.1em', color: T.text4, padding: '8px 10px' }}>
            {role === 'agent' ? 'AGENT VIEW' : 'OPERATE'}
          </div>
          {links.map(l => (
            <a key={l.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 6, fontSize: 13,
              color: active === l.id ? T.cyan : T.text2,
              background: active === l.id ? T.cyanDim : 'transparent',
              borderLeft: `2px solid ${active === l.id ? T.cyan : 'transparent'}`,
              fontWeight: active === l.id ? 500 : 400, cursor: 'pointer',
            }}>
              <span style={{ fontSize: 11, opacity: 0.6 }}>{l.icon}</span> {l.label}
            </a>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ fontFamily: T.fontMono, fontSize: 9, color: T.text4, padding: '8px 10px', borderTop: `1px solid ${T.border}` }}>
            v5.1 · BLOCK 8,294,012<br />
            <a style={{ color: T.text3 }}>← Back to lumina-org.com</a>
          </div>
        </nav>

        {/* Main */}
        <main style={{ flex: 1, overflow: 'auto', background: T.bg }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── 1. ROLE SELECT ──────────────────────────────────────────────
function RoleSelect() {
  return (
    <div style={{ width: '100%', height: '100%', background: T.bg, color: T.text, fontFamily: T.fontSans, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#3a2a0a', borderBottom: `1px solid ${T.warn}33`, padding: '6px 20px', fontSize: 11, fontFamily: T.fontMono, color: T.warn, textAlign: 'center', letterSpacing: '0.06em' }}>
        ⚠ SEPOLIA TESTNET · NO REAL FUNDS
      </div>
      <header style={{ padding: '20px 32px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
          <span style={{ width: 18, height: 18, background: T.cyan, clipPath: 'polygon(0 0,100% 0,100% 100%,50% 50%,0 100%)' }} />
          LUMINA <span style={{ color: T.text3, fontWeight: 400, fontSize: 12 }}>· PROTOCOL</span>
        </div>
        <Btn ghost small icon="⏎">Connect Wallet</Btn>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.text3, letterSpacing: '0.1em', marginBottom: 16 }}>
          /APP · ROLE SELECTION
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 300, fontSize: 56, lineHeight: 1.18,
          textAlign: 'center', maxWidth: 720, marginBottom: 32, letterSpacing: '-0.02em',
        }}>
          How do you want to <em style={{ color: T.cyan, fontStyle: 'italic' }}>operate</em>?
        </h1>
        <p style={{ color: T.text2, fontSize: 15, maxWidth: 520, textAlign: 'center', marginBottom: 48, lineHeight: 1.55 }}>
          Lumina serves two kinds of operators. Pick the one that matches you. You can switch later from the sidebar.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 880, width: '100%' }}>
          {/* Human card */}
          <div style={{
            background: T.bgCard, border: `1px solid ${T.borderHi}`, borderRadius: 10,
            padding: 32, position: 'relative', cursor: 'pointer',
            transition: 'all .15s', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: T.cyan }} />
            <Pill color={T.cyan}>◇ HUMAN</Pill>
            <h3 style={{ fontSize: 26, fontWeight: 500, margin: '16px 0 8px', letterSpacing: '-0.01em' }}>
              Buy parametric insurance
            </h3>
            <p style={{ color: T.text2, fontSize: 13, lineHeight: 1.55, marginBottom: 24 }}>
              Protect your DeFi positions against flash crashes, depegs, and rate shocks. Pay premium → if trigger fires → get a ClaimBond.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24, fontSize: 12, fontFamily: T.fontMono, color: T.text3 }}>
              <div>· DIRECT CONTRACT CALLS · NO API</div>
              <div>· 9 SHIELDS · BTC / ETH / STABLES</div>
              <div>· BUY · LIST · TRADE BONDS</div>
            </div>
            <Btn primary full>Enter as Human →</Btn>
          </div>

          {/* Agent supervisor */}
          <div style={{
            background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10,
            padding: 32, position: 'relative', cursor: 'pointer', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: T.warn }} />
            <Pill color={T.warn}>◉ AGENT SUPERVISOR</Pill>
            <h3 style={{ fontSize: 26, fontWeight: 500, margin: '16px 0 8px', letterSpacing: '-0.01em' }}>
              Monitor your AI agent
            </h3>
            <p style={{ color: T.text2, fontSize: 13, lineHeight: 1.55, marginBottom: 24 }}>
              Watch your bot buy policies and redeem bonds in real time. Read-only dashboard — agents operate autonomously via API key.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24, fontSize: 12, fontMono: T.fontMono, color: T.text3, fontFamily: T.fontMono }}>
              <div>· LIVE KPIs · ACTIVITY FEED</div>
              <div>· FILTER · EXPORT CSV</div>
              <div>· MANAGE API KEYS</div>
            </div>
            <Btn full>Enter as Supervisor →</Btn>
          </div>
        </div>

        <div style={{ marginTop: 40, fontSize: 11, color: T.text3, fontFamily: T.fontMono, letterSpacing: '0.05em' }}>
          NEED API ACCESS FOR YOUR BOT? <a style={{ color: T.cyan }}>READ AGENT DOCS →</a>
        </div>
      </div>
    </div>
  );
}

// ─── 2. PRODUCTS GRID (9 SHIELDS) ────────────────────────────────
const SHIELDS = [
  { id: 'btc-1h', name: 'Flash BTC 1h',  asset: 'BTC',  trigger: 'BTC −5% / 1h',   prob: '0.20%', mult: '333x', min: 100, max: 50000, premium: 30,  status: 'active' },
  { id: 'btc-4h', name: 'Flash BTC 4h',  asset: 'BTC',  trigger: 'BTC −8% / 4h',   prob: '0.35%', mult: '190x', min: 100, max: 50000, premium: 53,  status: 'active' },
  { id: 'btc-24h',name: 'Flash BTC 24h', asset: 'BTC',  trigger: 'BTC −10% / 24h', prob: '1.50%', mult: '44x',  min: 100, max: 50000, premium: 226, status: 'active' },
  { id: 'btc-48h',name: 'Flash BTC 48h', asset: 'BTC',  trigger: 'BTC −15% / 48h', prob: '0.80%', mult: '83x',  min: 100, max: 50000, premium: 120, status: 'active' },
  { id: 'eth-1h', name: 'Flash ETH 1h',  asset: 'ETH',  trigger: 'ETH −7% / 1h',   prob: '0.25%', mult: '266x', min: 100, max: 30000, premium: 38,  status: 'active' },
  { id: 'eth-24h',name: 'Flash ETH 24h', asset: 'ETH',  trigger: 'ETH −12% / 24h', prob: '2.00%', mult: '33x',  min: 100, max: 30000, premium: 303, status: 'active' },
  { id: 'eth-48h',name: 'Flash ETH 48h', asset: 'ETH',  trigger: 'ETH −18% / 48h', prob: '0.90%', mult: '74x',  min: 100, max: 30000, premium: 135, status: 'paused' },
  { id: 'depeg',  name: 'Micro Depeg USDT', asset: 'USDT', trigger: 'USDT < $0.995 / 7d', prob: '3.50%', mult: '19x', min: 100, max: 100000, premium: 530, status: 'active' },
  { id: 'rate',   name: 'Rate Shock',    asset: 'USDC', trigger: 'Aave USDC > 10% / 7d', prob: '4.00%', mult: '17x', min: 100, max: 100000, premium: 605, status: 'active' },
];

const ASSET_COLORS = { BTC: '#f7931a', ETH: '#627eea', USDT: '#26a17b', USDC: '#2775ca' };

function ShieldCard({ s, onClick }) {
  const isPaused = s.status === 'paused';
  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8,
      padding: 18, cursor: isPaused ? 'not-allowed' : 'pointer',
      opacity: isPaused ? 0.5 : 1, transition: 'all .15s', position: 'relative',
      display: 'flex', flexDirection: 'column', minHeight: 240,
    }}>
      {/* asset chip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: ASSET_COLORS[s.asset], color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.fontMono, fontSize: 11, fontWeight: 700,
        }}>{s.asset.slice(0,1)}</div>
        <Pill color={isPaused ? T.text3 : T.pos}>{isPaused ? 'PAUSED' : '● ACTIVE'}</Pill>
      </div>

      <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.text3, letterSpacing: '0.06em', marginBottom: 4 }}>
        {s.id.toUpperCase()}
      </div>
      <h4 style={{ fontSize: 16, fontWeight: 500, marginBottom: 10, letterSpacing: '-0.01em' }}>
        {s.name}
      </h4>

      <div style={{
        background: T.bgCard2, border: `1px solid ${T.border}`, borderRadius: 6,
        padding: '8px 10px', fontFamily: T.fontMono, fontSize: 11, color: T.text2, marginBottom: 14,
      }}>
        TRIG · {s.trigger}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11, marginBottom: 14, color: T.text3 }}>
        <div>Cover<br/><Mono style={{ color: T.text, fontSize: 12 }}>${s.min.toLocaleString()}–${(s.max/1000)}k</Mono></div>
        <div>Multiplier<br/><Mono style={{ color: T.cyan, fontSize: 12 }}>{s.mult}</Mono></div>
        <div>Hist. prob<br/><Mono style={{ color: T.text, fontSize: 12 }}>{s.prob}</Mono></div>
        <div>Premium $1k<br/><Mono style={{ color: T.text, fontSize: 12 }}>${s.premium}</Mono></div>
      </div>

      <div style={{ flex: 1 }} />
      <Btn primary={!isPaused} ghost={isPaused} small full disabled={isPaused}>
        {isPaused ? 'Paused' : 'Get protected →'}
      </Btn>
    </div>
  );
}

function HumanProducts() {
  const [filter, setFilter] = useState('ALL');
  const filtered = SHIELDS.filter(s =>
    filter === 'ALL' ? true :
    filter === 'STABLES' ? (s.asset === 'USDT' || s.asset === 'USDC') :
    s.asset === filter
  );
  return (
    <AppShell role="human" active="products">
      <div style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.text3, letterSpacing: '0.1em', marginBottom: 8 }}>
              SHIELDS · 9 ACTIVE PRODUCTS · BASE SEPOLIA
            </div>
            <h1 style={{ fontFamily: T.fontDisplay, fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em' }}>
              Pick a shield. Pay premium. Get protected.
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 6, fontSize: 11, fontFamily: T.fontMono }}>
            {['ALL','BTC','ETH','STABLES'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 12px', borderRadius: 4,
                background: filter === f ? T.cyanDim : 'transparent',
                color: filter === f ? T.cyan : T.text3,
                border: `1px solid ${filter === f ? T.cyan : T.border}`,
                cursor: 'pointer', letterSpacing: '0.06em',
              }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {filtered.map(s => <ShieldCard key={s.id} s={s} />)}
        </div>

        <div style={{ marginTop: 24, padding: 16, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12, color: T.text3, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: T.fontMono }}>
            ⓘ Premiums shown for $1,000 cover at default duration. Real premiums update on-chain on the detail page.
          </span>
          <a style={{ color: T.cyan, fontFamily: T.fontMono }}>HOW TRIGGERS WORK →</a>
        </div>
      </div>
    </AppShell>
  );
}

// ─── 3. SHIELD DETAIL (BUY FLOW) ─────────────────────────────────
function ShieldDetail() {
  const [cover, setCover] = useState(5000);
  const [duration, setDuration] = useState('24h');
  const s = SHIELDS[2]; // btc-24h
  const premiumPct = 1.5;
  const premium = (cover * premiumPct / 100).toFixed(2);
  const bonds = cover;
  const lumina = (cover / 0.0364).toFixed(0);

  return (
    <AppShell role="human" active="products">
      <div style={{ padding: '24px 32px' }}>
        <a style={{ fontFamily: T.fontMono, fontSize: 11, color: T.text3, letterSpacing: '0.06em', marginBottom: 16, display: 'inline-block' }}>
          ← /APP/HUMAN/PRODUCTS
        </a>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
          {/* LEFT — explainer */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: ASSET_COLORS.BTC, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.fontMono, fontWeight: 700 }}>B</div>
              <Pill color={T.pos}>● ACTIVE</Pill>
              <Pill color={T.text3}>0xCBDA…2468</Pill>
            </div>
            <h1 style={{ fontFamily: T.fontDisplay, fontSize: 42, fontWeight: 300, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Flash BTC 24h
            </h1>
            <p style={{ color: T.text2, fontSize: 15, lineHeight: 1.55, marginBottom: 20 }}>
              If BTC closes <Mono style={{ color: T.cyan }}>−10%</Mono> or worse versus its open price within any rolling
              24-hour window during your policy term, the trigger fires and you receive a ClaimBond for the full cover amount.
            </p>

            {/* trigger explainer */}
            <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, padding: 18, marginBottom: 16 }}>
              <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.text3, letterSpacing: '0.1em', marginBottom: 12 }}>TRIGGER LOGIC · CHAINLINK ORACLE</div>
              <div style={{ fontFamily: T.fontMono, fontSize: 12, color: T.text, lineHeight: 1.7 }}>
                <span style={{ color: T.text3 }}>IF</span> chainlink_btc_usd <span style={{ color: T.cyan }}>−</span> open(t-24h) <span style={{ color: T.cyan }}>≤</span> <span style={{ color: T.warn }}>−10.00%</span><br/>
                <span style={{ color: T.text3 }}>THEN</span> mint_claimbond(buyer, cover_amount, maturity=now+730d)<br/>
                <span style={{ color: T.text3 }}>ELSE</span> burn(premium → LUMINA)
              </div>
            </div>

            {/* timeline */}
            <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, padding: 18 }}>
              <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.text3, letterSpacing: '0.1em', marginBottom: 14 }}>WHAT HAPPENS NEXT</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { n: '01', t: 'Approve USDC', s: 'Allow CoverRouter to pull premium' },
                  { n: '02', t: 'Buy policy', s: 'Premium routes to TWAPBurner' },
                  { n: '03', t: 'Oracle watches', s: '24h window starts' },
                  { n: '04', t: 'Bond or burn', s: 'Trigger → ClaimBond / no → LUMINA burned' },
                ].map((step, i) => (
                  <div key={i} style={{ flex: 1, padding: 10, background: T.bgCard2, border: `1px solid ${T.border}`, borderRadius: 6 }}>
                    <div style={{ fontFamily: T.fontMono, fontSize: 9, color: T.cyan, letterSpacing: '0.1em', marginBottom: 4 }}>STEP {step.n}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{step.t}</div>
                    <div style={{ fontSize: 10, color: T.text3, lineHeight: 1.4 }}>{step.s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — calculator + buy */}
          <aside>
            <div style={{ background: T.bgCard, border: `1px solid ${T.borderHi}`, borderRadius: 10, padding: 22, position: 'sticky', top: 0 }}>
              <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.text3, letterSpacing: '0.1em', marginBottom: 14 }}>
                COVER CALCULATOR · LIVE
              </div>

              <label style={{ fontSize: 11, color: T.text3, fontFamily: T.fontMono, letterSpacing: '0.06em' }}>COVER AMOUNT (USDC)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, marginBottom: 4 }}>
                <input type="number" value={cover} readOnly style={{
                  flex: 1, background: T.bgCard2, border: `1px solid ${T.borderHi}`, borderRadius: 6,
                  padding: '10px 12px', color: T.text, fontFamily: T.fontMono, fontSize: 18, outline: 'none',
                }} />
                <Mono style={{ color: T.text3, fontSize: 12 }}>USDC</Mono>
              </div>
              <input type="range" min={100} max={50000} value={cover} readOnly
                style={{ width: '100%', accentColor: T.cyan }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: T.fontMono, color: T.text4, marginBottom: 14 }}>
                <span>$100</span><span>$50,000</span>
              </div>

              <label style={{ fontSize: 11, color: T.text3, fontFamily: T.fontMono, letterSpacing: '0.06em' }}>POLICY TERM</label>
              <div style={{ display: 'flex', gap: 4, marginTop: 6, marginBottom: 18 }}>
                {['1d','7d','30d'].map(d => (
                  <button key={d} style={{
                    flex: 1, padding: '8px', borderRadius: 4,
                    background: d === '7d' ? T.cyanDim : 'transparent',
                    color: d === '7d' ? T.cyan : T.text2,
                    border: `1px solid ${d === '7d' ? T.cyan : T.border}`,
                    fontFamily: T.fontMono, fontSize: 12, cursor: 'pointer',
                  }}>{d}</button>
                ))}
              </div>

              {/* outputs */}
              <div style={{ background: T.bgCard2, border: `1px solid ${T.border}`, borderRadius: 6, padding: 14, marginBottom: 14 }}>
                <Row label="You pay (premium)" value={`$${premium} USDC`} accent={T.warn} />
                <Row label="If trigger fires" value={`${bonds.toLocaleString()} ClaimBonds`} accent={T.pos} />
                <Row label="Bond face value" value={`$${cover.toLocaleString()}.00 USD`} />
                <Row label="At maturity (730d)" value={`≈ ${Number(lumina).toLocaleString()} LUMINA`} accent={T.cyan} />
                <Row label="If no trigger" value="Premium burned ◉" muted last />
              </div>

              {/* buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Btn ghost full small icon="①">Approve USDC · ${premium}</Btn>
                <Btn primary full icon="②">Buy policy →</Btn>
              </div>

              <div style={{ marginTop: 12, padding: 8, background: '#0e1f12', border: `1px solid ${T.pos}33`, borderRadius: 4, fontSize: 10, color: T.pos, fontFamily: T.fontMono, textAlign: 'center', letterSpacing: '0.04em' }}>
                ✓ ALLOWANCE OK · CHAIN OK · BALANCE OK
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value, accent, muted, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '7px 0', borderBottom: last ? 'none' : `1px solid ${T.border}`, fontSize: 12,
    }}>
      <span style={{ color: T.text3 }}>{label}</span>
      <Mono style={{ color: muted ? T.text3 : (accent || T.text), fontWeight: 500 }}>{value}</Mono>
    </div>
  );
}

// ─── 4. PORTFOLIO ────────────────────────────────────────────────
function Portfolio() {
  const [tab, setTab] = useState('policies');
  const policies = [
    { shield: 'Flash BTC 24h', cover: '5,000', premium: '75.00', purchased: 'Apr 28', expires: 'May 5', status: 'active' },
    { shield: 'Flash ETH 1h',  cover: '2,000', premium: '5.00',  purchased: 'Apr 30', expires: 'Apr 30', status: 'expired' },
    { shield: 'Micro Depeg',   cover: '10,000',premium: '53.00', purchased: 'May 1',  expires: 'May 8', status: 'triggered' },
  ];
  const bonds = [
    { id: '#841',  shield: 'Micro Depeg',  face: '10,000', maturity: '2027-05-01', days: 730, redeemable: false, status: 'holding' },
    { id: '#723',  shield: 'Flash BTC 24h',face: '4,500',  maturity: '2026-10-12', days: 161, redeemable: false, status: 'holding' },
    { id: '#502',  shield: 'Rate Shock',   face: '2,000',  maturity: '2026-04-29', days: 0,   redeemable: true,  status: 'matured' },
    { id: '#418',  shield: 'Flash ETH 24h',face: '8,000',  maturity: '2027-02-18', days: 290, redeemable: false, status: 'listed' },
  ];

  return (
    <AppShell role="human" active="portfolio">
      <div style={{ padding: '28px 32px' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.text3, letterSpacing: '0.1em', marginBottom: 6 }}>
            /APP/HUMAN/PORTFOLIO
          </div>
          <h1 style={{ fontFamily: T.fontDisplay, fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em' }}>
            Your positions, on-chain.
          </h1>
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { l: 'Active policies', v: '2', s: '$15,000 covered' },
            { l: 'Bonds outstanding', v: '4', s: '$24,500 face' },
            { l: 'Redeemable now', v: '1', s: '$2,000', a: T.pos },
            { l: 'Total premiums paid', v: '$133', s: 'lifetime', a: T.warn },
          ].map((k, i) => (
            <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: T.text3, fontFamily: T.fontMono, letterSpacing: '0.06em', marginBottom: 6 }}>{k.l}</div>
              <div style={{ fontSize: 24, fontWeight: 500, color: k.a || T.text, fontFamily: T.fontMono, letterSpacing: '-0.01em' }}>{k.v}</div>
              <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>{k.s}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 16 }}>
          {[
            { id: 'policies', label: 'Active Policies', count: 2 },
            { id: 'bonds', label: 'My Bonds', count: 4 },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '12px 16px', background: 'transparent',
              border: 'none', borderBottom: `2px solid ${tab === t.id ? T.cyan : 'transparent'}`,
              color: tab === t.id ? T.cyan : T.text3, cursor: 'pointer',
              fontFamily: T.fontSans, fontSize: 13, fontWeight: 500,
            }}>
              {t.label} <span style={{ marginLeft: 6, fontFamily: T.fontMono, fontSize: 11, color: T.text4 }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Tables */}
        {tab === 'policies' && (
          <Table
            cols={['Shield', 'Cover', 'Premium', 'Purchased', 'Expires', 'Status', '']}
            rows={policies.map(p => [
              p.shield,
              <Mono>${p.cover}</Mono>,
              <Mono>${p.premium}</Mono>,
              <Mono style={{ color: T.text3 }}>{p.purchased}</Mono>,
              <Mono style={{ color: T.text3 }}>{p.expires}</Mono>,
              <Pill color={p.status === 'active' ? T.pos : p.status === 'triggered' ? T.cyan : T.text3}>
                {p.status.toUpperCase()}
              </Pill>,
              <a style={{ color: T.text3, fontFamily: T.fontMono, fontSize: 11 }}>Basescan ↗</a>,
            ])}
          />
        )}
        {tab === 'bonds' && (
          <Table
            cols={['Token', 'From shield', 'Face value', 'Maturity', 'Days', 'Status', 'Action']}
            rows={bonds.map(b => [
              <Mono style={{ color: T.cyan }}>{b.id}</Mono>,
              b.shield,
              <Mono>${b.face}</Mono>,
              <Mono style={{ color: T.text3 }}>{b.maturity}</Mono>,
              <Mono style={{ color: b.days === 0 ? T.pos : T.text2 }}>{b.days}d</Mono>,
              <Pill color={b.status === 'matured' ? T.pos : b.status === 'listed' ? T.warn : T.text3}>
                {b.status.toUpperCase()}
              </Pill>,
              b.redeemable
                ? <Btn primary small>Redeem for LUMINA →</Btn>
                : b.status === 'listed'
                  ? <Btn ghost small>Cancel listing</Btn>
                  : <Btn small>List on marketplace</Btn>,
            ])}
          />
        )}
      </div>
    </AppShell>
  );
}

function Table({ cols, rows }) {
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `1.4fr 1fr 1fr 1fr 0.7fr 1fr 1.4fr`, padding: '10px 16px', borderBottom: `1px solid ${T.border}`, background: T.bgCard2, fontFamily: T.fontMono, fontSize: 10, color: T.text3, letterSpacing: '0.1em' }}>
        {cols.map((c, i) => <div key={i}>{c}</div>)}
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: `1.4fr 1fr 1fr 1fr 0.7fr 1fr 1.4fr`,
          padding: '12px 16px', borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${T.border}`,
          fontSize: 12, alignItems: 'center', color: T.text,
        }}>
          {row.map((c, j) => <div key={j}>{c}</div>)}
        </div>
      ))}
    </div>
  );
}

// ─── 5. MARKETPLACE ──────────────────────────────────────────────
function Marketplace() {
  const listings = [
    { id: '#0421', face: '5,000',  ask: '2,400', disc: 52, days: 590, seller: '0x7a4F…3bC8', shield: 'Flash BTC 24h' },
    { id: '#0418', face: '8,000',  ask: '3,920', disc: 51, days: 290, seller: '0x12aB…dEfG', shield: 'Flash ETH 24h' },
    { id: '#0399', face: '2,000',  ask: '1,180', disc: 41, days: 150, seller: '0xA7b3…9c4F', shield: 'Rate Shock' },
    { id: '#0388', face: '10,000', ask: '4,200', disc: 58, days: 720, seller: '0x33Cf…0eA1', shield: 'Micro Depeg' },
    { id: '#0367', face: '3,500',  ask: '2,100', disc: 40, days: 410, seller: '0xB2d4…7AeC', shield: 'Flash BTC 4h' },
    { id: '#0342', face: '6,000',  ask: '3,300', disc: 45, days: 480, seller: '0x91Aa…cD3b', shield: 'Flash ETH 48h' },
  ];
  return (
    <AppShell role="human" active="marketplace">
      <div style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.text3, letterSpacing: '0.1em', marginBottom: 6 }}>
              /APP/HUMAN/MARKETPLACE · 0xfaC5…1Be6
            </div>
            <h1 style={{ fontFamily: T.fontDisplay, fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em' }}>
              Buy bonds at discount. Or sell yours.
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: 11, fontFamily: T.fontMono }}>
            <select style={{ padding: '6px 10px', background: T.bgCard, border: `1px solid ${T.border}`, color: T.text2, borderRadius: 4 }}>
              <option>Sort by discount ↓</option>
              <option>Sort by maturity ↑</option>
              <option>Sort by face value ↓</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 18 }}>
          {[
            { id: 'browse', label: 'Browse', count: 24, active: true },
            { id: 'mine',   label: 'My Listings', count: 1 },
          ].map(t => (
            <button key={t.id} style={{
              padding: '12px 16px', background: 'transparent', border: 'none',
              borderBottom: `2px solid ${t.active ? T.cyan : 'transparent'}`,
              color: t.active ? T.cyan : T.text3, cursor: 'pointer',
              fontFamily: T.fontSans, fontSize: 13, fontWeight: 500,
            }}>
              {t.label} <span style={{ marginLeft: 6, fontFamily: T.fontMono, fontSize: 11, color: T.text4 }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Grid of listings */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {listings.map(l => (
            <div key={l.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Mono style={{ color: T.cyan, fontSize: 13, fontWeight: 600 }}>{l.id}</Mono>
                <Pill color={T.warn}>−{l.disc}% DISCOUNT</Pill>
              </div>
              <div style={{ fontSize: 12, color: T.text2, marginBottom: 10 }}>{l.shield}</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11, marginBottom: 12 }}>
                <div>
                  <div style={{ color: T.text3, marginBottom: 2 }}>Face value</div>
                  <Mono style={{ color: T.text, fontSize: 14 }}>${l.face}</Mono>
                </div>
                <div>
                  <div style={{ color: T.text3, marginBottom: 2 }}>Asking</div>
                  <Mono style={{ color: T.cyan, fontSize: 14 }}>${l.ask}</Mono>
                </div>
                <div>
                  <div style={{ color: T.text3, marginBottom: 2 }}>Days to maturity</div>
                  <Mono style={{ color: T.text2 }}>{l.days}d</Mono>
                </div>
                <div>
                  <div style={{ color: T.text3, marginBottom: 2 }}>Seller</div>
                  <Mono style={{ color: T.text3, fontSize: 11 }}>{l.seller}</Mono>
                </div>
              </div>

              {/* IRR bar */}
              <div style={{ height: 4, background: T.bgCard2, borderRadius: 2, marginBottom: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${l.disc}%`, background: T.cyan }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: T.fontMono, color: T.text3, marginBottom: 12 }}>
                <span>IMPLIED YIELD</span><span style={{ color: T.pos }}>+{(l.disc * 365 / l.days).toFixed(0)}% / YR</span>
              </div>

              <Btn primary small full>Buy for ${l.ask}</Btn>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

// ─── 6. AGENT DASHBOARD ──────────────────────────────────────────
function AgentDashboard() {
  const kpis = [
    { l: 'Active policies', v: '47', d: '+12 / 7d', c: T.cyan, sub: '$214,000 covered' },
    { l: 'Premiums paid', v: '$3,418', d: 'lifetime', c: T.warn, sub: '94,989 LUMINA burned' },
    { l: 'Bonds outstanding', v: '142', d: '+38 / 7d', c: T.text, sub: '$418,000 face' },
    { l: 'Bonds redeemed', v: '12', d: '+3 / 7d', c: T.pos, sub: '329,670 LUMINA recv' },
    { l: 'USDC balance', v: '$24,801', d: 'wallet', c: T.text, sub: '0x7a4F…3bC8' },
    { l: 'LUMINA balance', v: '329,670', d: 'wallet', c: T.cyan, sub: '$12,000 @ $0.0364' },
  ];
  const feed = [
    { t: '00:42', type: 'POLICY', msg: 'Bought Flash BTC 24h · $5,000 cover · premium $75',     hash: '0xa3f4…91c2' },
    { t: '00:38', type: 'BURN',   msg: '75 USDC → 2,061 LUMINA burned via TWAPBurner',          hash: '0xa3f4…91c2' },
    { t: '00:31', type: 'BOND',   msg: 'Listed bond #0418 · $8,000 face · asking $3,920',       hash: '0xb12e…44a8' },
    { t: '00:27', type: 'POLICY', msg: 'Bought Flash ETH 1h · $2,000 cover · premium $5',       hash: '0xc84d…2fe1' },
    { t: '00:18', type: 'REDEEM', msg: 'Redeemed bond #0381 · $2,000 → 54,945 LUMINA',          hash: '0xd91a…7c3b', accent: T.pos },
    { t: '00:11', type: 'POLICY', msg: 'Bought Micro Depeg USDT · $10,000 cover · premium $530',hash: '0xe22b…0aa9' },
  ];
  const distribution = [
    { name: 'Flash BTC 24h', n: 18, pct: 38, color: ASSET_COLORS.BTC },
    { name: 'Flash ETH 24h', n: 11, pct: 23, color: ASSET_COLORS.ETH },
    { name: 'Micro Depeg',   n: 8,  pct: 17, color: ASSET_COLORS.USDT },
    { name: 'Rate Shock',    n: 6,  pct: 13, color: ASSET_COLORS.USDC },
    { name: 'Flash BTC 4h',  n: 4,  pct: 9,  color: '#f7931a99' },
  ];

  return (
    <AppShell role="agent" active="dashboard">
      <div style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.text3, letterSpacing: '0.1em', marginBottom: 6 }}>
              /APP/AGENT/DASHBOARD · BOT_001 · LIVE
            </div>
            <h1 style={{ fontFamily: T.fontDisplay, fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em' }}>
              Your agent's pulse, in real time.
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: T.bgCard, border: `1px solid ${T.pos}33`, borderRadius: 6, fontFamily: T.fontMono, fontSize: 11, color: T.pos }}>
            <Dot color={T.pos} pulse /> AGENT ACTIVE · LAST CALL 12s AGO
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 20 }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 10, color: T.text3, fontFamily: T.fontMono, letterSpacing: '0.08em', marginBottom: 8 }}>{k.l.toUpperCase()}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: k.c, fontFamily: T.fontMono, letterSpacing: '-0.01em' }}>{k.v}</div>
              <div style={{ fontSize: 10, color: T.text3, marginTop: 4, fontFamily: T.fontMono }}>{k.d}</div>
              <div style={{ fontSize: 10, color: T.text4, marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Bottom: feed + chart */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
          {/* Activity feed */}
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${T.border}`, background: T.bgCard2 }}>
              <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.text2, letterSpacing: '0.1em' }}>
                ACTIVITY FEED · LAST 6 ACTIONS
              </div>
              <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.text3 }}>
                <Dot color={T.pos} pulse /> POLLING 15s
              </div>
            </div>
            {feed.map((f, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 80px 1fr 100px', gap: 12, padding: '11px 16px', borderBottom: i === feed.length-1 ? 'none' : `1px solid ${T.border}`, fontSize: 12, alignItems: 'center' }}>
                <Mono style={{ color: T.text3, fontSize: 11 }}>{f.t}</Mono>
                <Pill color={f.type === 'BURN' ? T.warn : f.type === 'REDEEM' ? T.pos : f.type === 'BOND' ? T.cyan : T.text2}>{f.type}</Pill>
                <span style={{ color: f.accent || T.text }}>{f.msg}</span>
                <Mono style={{ color: T.text3, fontSize: 10, textAlign: 'right' }}>{f.hash} ↗</Mono>
              </div>
            ))}
          </div>

          {/* Distribution chart */}
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.text2, letterSpacing: '0.1em', marginBottom: 14 }}>
              POLICIES BY SHIELD · ACTIVE
            </div>
            {distribution.map((d, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: T.text2 }}>{d.name}</span>
                  <Mono style={{ color: T.text3 }}>{d.n} · {d.pct}%</Mono>
                </div>
                <div style={{ height: 6, background: T.bgCard2, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.pct * 2.5}%`, background: d.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${T.border}`, fontFamily: T.fontMono, fontSize: 10, color: T.text3 }}>
              TOTAL · 47 ACTIVE · $214,000 COVERED
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ─── 7. AGENT POLICIES (filtered table) ──────────────────────────
function AgentPolicies() {
  const policies = [
    { ts: 'May 4 00:42', shield: 'Flash BTC 24h', cover: '5,000',  premium: '75',  status: 'active',    expires: '7d' },
    { ts: 'May 4 00:27', shield: 'Flash ETH 1h',  cover: '2,000',  premium: '5',   status: 'active',    expires: '8h' },
    { ts: 'May 4 00:11', shield: 'Micro Depeg',   cover: '10,000', premium: '530', status: 'active',    expires: '7d' },
    { ts: 'May 3 23:48', shield: 'Flash BTC 4h',  cover: '3,000',  premium: '160', status: 'expired',   expires: '—' },
    { ts: 'May 3 22:11', shield: 'Rate Shock',    cover: '8,000',  premium: '485', status: 'triggered', expires: '—' },
    { ts: 'May 3 19:02', shield: 'Flash ETH 24h', cover: '4,000',  premium: '120', status: 'active',    expires: '5d' },
    { ts: 'May 3 16:47', shield: 'Flash BTC 1h',  cover: '1,500',  premium: '4.5', status: 'expired',   expires: '—' },
    { ts: 'May 3 14:19', shield: 'Flash BTC 24h', cover: '6,000',  premium: '90',  status: 'active',    expires: '6d' },
  ];
  return (
    <AppShell role="agent" active="policies">
      <div style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.text3, letterSpacing: '0.1em', marginBottom: 6 }}>
              /APP/AGENT/POLICIES · 47 ACTIVE · 12 EXPIRED · 3 TRIGGERED
            </div>
            <h1 style={{ fontFamily: T.fontDisplay, fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em' }}>
              Every policy your agent ever bought.
            </h1>
          </div>
          <Btn ghost small icon="↓">Export CSV</Btn>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, padding: 12, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.text3, letterSpacing: '0.1em' }}>FILTER ·</span>
          {['24h','7d','30d','All time'].map((r, i) => (
            <button key={r} style={{
              padding: '5px 10px', borderRadius: 4, fontSize: 11,
              background: i === 1 ? T.cyanDim : 'transparent',
              color: i === 1 ? T.cyan : T.text3,
              border: `1px solid ${i === 1 ? T.cyan : T.border}`,
              fontFamily: T.fontMono, cursor: 'pointer',
            }}>{r}</button>
          ))}
          <div style={{ width: 1, height: 18, background: T.border, margin: '0 4px' }} />
          <select style={{ padding: '5px 10px', background: T.bgCard2, border: `1px solid ${T.border}`, color: T.text2, fontSize: 11, fontFamily: T.fontMono, borderRadius: 4 }}>
            <option>All shields</option>
          </select>
          <select style={{ padding: '5px 10px', background: T.bgCard2, border: `1px solid ${T.border}`, color: T.text2, fontSize: 11, fontFamily: T.fontMono, borderRadius: 4 }}>
            <option>All statuses</option>
          </select>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.text3 }}>SHOWING 8 of 62</span>
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr', padding: '10px 16px', borderBottom: `1px solid ${T.border}`, background: T.bgCard2, fontFamily: T.fontMono, fontSize: 10, color: T.text3, letterSpacing: '0.1em' }}>
            <div>TIMESTAMP</div><div>SHIELD</div><div>COVER</div><div>PREMIUM</div><div>STATUS</div><div>EXPIRES</div><div></div>
          </div>
          {policies.map((p, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr',
              padding: '11px 16px', borderBottom: i === policies.length - 1 ? 'none' : `1px solid ${T.border}`,
              fontSize: 12, alignItems: 'center',
            }}>
              <Mono style={{ color: T.text3, fontSize: 11 }}>{p.ts}</Mono>
              <span>{p.shield}</span>
              <Mono>${p.cover}</Mono>
              <Mono style={{ color: T.warn }}>${p.premium}</Mono>
              <Pill color={p.status === 'active' ? T.pos : p.status === 'triggered' ? T.cyan : T.text3}>{p.status.toUpperCase()}</Pill>
              <Mono style={{ color: T.text3 }}>{p.expires}</Mono>
              <a style={{ color: T.text3, fontSize: 11, fontFamily: T.fontMono }}>↗</a>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

// ─── 8. AGENT API KEYS ───────────────────────────────────────────
function AgentApiKeys() {
  const keys = [
    { id: 'lum_pk_a3f9…', name: 'production-bot-001', created: 'Apr 12 2026', lastUsed: '12s ago', reqs: '8,420', status: 'active' },
    { id: 'lum_pk_b27d…', name: 'staging-test',       created: 'Apr 28 2026', lastUsed: '2h ago',  reqs: '143',   status: 'active' },
    { id: 'lum_pk_c19f…', name: 'old-bot',            created: 'Mar 02 2026', lastUsed: '3d ago',  reqs: '24,901',status: 'revoked' },
  ];

  return (
    <AppShell role="agent" active="api-keys">
      <div style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.text3, letterSpacing: '0.1em', marginBottom: 6 }}>
              /APP/AGENT/API-KEYS · 2 ACTIVE · MAX 3 PER WALLET
            </div>
            <h1 style={{ fontFamily: T.fontDisplay, fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em' }}>
              Keys your bot uses to call Lumina.
            </h1>
          </div>
          <Btn primary icon="+">Create new key</Btn>
        </div>

        {/* Warning bar */}
        <div style={{ background: '#2a1a0a', border: `1px solid ${T.warn}33`, borderRadius: 6, padding: 14, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18, color: T.warn }}>⚠</span>
          <div style={{ fontSize: 12, color: T.text2, lineHeight: 1.5 }}>
            <strong style={{ color: T.warn }}>API keys are shown once.</strong> Save the secret immediately when created.
            Lost keys can only be revoked, not recovered. Keys are bound to wallet <Mono style={{ color: T.cyan }}>0x7a4F…3bC8</Mono>.
          </div>
        </div>

        {/* Key cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {keys.map((k, i) => (
            <div key={i} style={{
              background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8,
              padding: 18, opacity: k.status === 'revoked' ? 0.5 : 1,
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 16, alignItems: 'center',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{k.name}</span>
                  <Pill color={k.status === 'active' ? T.pos : T.text3}>{k.status.toUpperCase()}</Pill>
                </div>
                <Mono style={{ color: T.text3, fontSize: 11 }}>{k.id}</Mono>
              </div>
              <div>
                <div style={{ fontSize: 10, color: T.text3, fontFamily: T.fontMono, letterSpacing: '0.06em' }}>CREATED</div>
                <Mono style={{ fontSize: 12 }}>{k.created}</Mono>
              </div>
              <div>
                <div style={{ fontSize: 10, color: T.text3, fontFamily: T.fontMono, letterSpacing: '0.06em' }}>LAST USED</div>
                <Mono style={{ fontSize: 12, color: k.lastUsed.includes('s ago') ? T.pos : T.text }}>{k.lastUsed}</Mono>
              </div>
              <div>
                <div style={{ fontSize: 10, color: T.text3, fontFamily: T.fontMono, letterSpacing: '0.06em' }}>REQUESTS · 24h</div>
                <Mono style={{ fontSize: 12 }}>{k.reqs}</Mono>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {k.status === 'active' && (
                  <>
                    <Btn ghost small>View usage</Btn>
                    <Btn ghost small>Revoke</Btn>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Webhook section */}
        <div style={{ marginTop: 24, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, padding: 18 }}>
          <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.text3, letterSpacing: '0.1em', marginBottom: 10 }}>
            WEBHOOK · OPTIONAL
          </div>
          <p style={{ fontSize: 12, color: T.text2, marginBottom: 12 }}>
            Receive real-time notifications when triggers fire, bonds mature, or listings sell.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input placeholder="https://your-bot.com/webhook" readOnly style={{
              flex: 1, padding: '10px 12px', background: T.bgCard2, border: `1px solid ${T.border}`,
              borderRadius: 6, color: T.text, fontFamily: T.fontMono, fontSize: 12, outline: 'none',
            }} />
            <Btn>Save</Btn>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ─── EXPORT TO WINDOW ────────────────────────────────────────────
Object.assign(window, {
  RoleSelect, HumanProducts, ShieldDetail, Portfolio,
  Marketplace, AgentDashboard, AgentPolicies, AgentApiKeys,
});
