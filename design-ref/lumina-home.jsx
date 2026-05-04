const { useState, useEffect, useMemo, useRef } = React;

// ────────────────────────────────────────────────────────────
// DATA
// ────────────────────────────────────────────────────────────
const PRODUCTS = [
  { key: "btc-1h",  label: "Flash BTC 1h",  asset: "BTC",  duration: "1h",  trigger: "BTC −5% / 1h",   prob: "0.20",  mult: "333x", tier: 1 },
  { key: "btc-4h",  label: "Flash BTC 4h",  asset: "BTC",  duration: "4h",  trigger: "BTC −8% / 4h",   prob: "0.35",  mult: "190x", tier: 1 },
  { key: "btc-24h", label: "Flash BTC 24h", asset: "BTC",  duration: "24h", trigger: "BTC −10% / 24h", prob: "1.50",  mult: "44x",  tier: 1 },
  { key: "btc-48h", label: "Flash BTC 48h", asset: "BTC",  duration: "48h", trigger: "BTC −15% / 48h", prob: "0.80",  mult: "83x",  tier: 1 },
  { key: "eth-1h",  label: "Flash ETH 1h",  asset: "ETH",  duration: "1h",  trigger: "ETH −7% / 1h",   prob: "0.25",  mult: "266x", tier: 1 },
  { key: "eth-24h", label: "Flash ETH 24h", asset: "ETH",  duration: "24h", trigger: "ETH −12% / 24h", prob: "2.00",  mult: "33x",  tier: 1 },
  { key: "eth-48h", label: "Flash ETH 48h", asset: "ETH",  duration: "48h", trigger: "ETH −18% / 48h", prob: "0.90",  mult: "74x",  tier: 1 },
  { key: "depeg",   label: "Micro Depeg USDT", asset: "USDT", duration: "7d", trigger: "USDT < $0.995 / 7d", prob: "3.50", mult: "19x",  tier: 2 },
  { key: "rate",    label: "Rate Shock",    asset: "USDC", duration: "7d", trigger: "Aave USDC > 10% / 7d", prob: "4.00", mult: "17x", tier: 2 },
];

// fake live burn feed entries for the hero ticker
const BURN_EVENTS = [
  { t: "00:42 UTC", action: "Flash BTC 1h",  amount: "+ 12.40 USDC", lumina: "344.4 LUMINA" },
  { t: "00:38 UTC", action: "Micro Depeg",    amount: "+ 42.00 USDC", lumina: "1,166.6 LUMINA" },
  { t: "00:31 UTC", action: "Flash ETH 24h",  amount: "+ 8.00 USDC",  lumina: "222.2 LUMINA" },
  { t: "00:27 UTC", action: "Bond resale 3%", amount: "+ 12.00 USDC", lumina: "333.3 LUMINA" },
];

// ────────────────────────────────────────────────────────────
// TOPBAR — sticky live status row
// ────────────────────────────────────────────────────────────
function TopBar() {
  const [price, setPrice] = useState(0.0364);
  useEffect(() => {
    const id = setInterval(() => {
      setPrice(p => +(p + (Math.random()-0.5)*0.0006).toFixed(4));
    }, 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-item"><span className="live-dot"/> <span>BURN ENGINE</span> <b>ACTIVE</b></div>
        <span className="topbar-divider">·</span>
        <div className="topbar-item"><span>LUMINA / USDC</span> <b className="mono">${price.toFixed(4)}</b> <span className="ticker">+2.31%</span></div>
        <span className="topbar-divider">·</span>
        <div className="topbar-item"><span>BURNED</span> <b className="mono">1,284,402 LUMINA</b></div>
        <span className="topbar-divider">·</span>
        <div className="topbar-item"><span>ACTIVE BETS</span> <b className="mono">312</b></div>
        <span className="topbar-divider">·</span>
        <div className="topbar-item"><span>BASE L2</span> <b>OK</b></div>
        <span className="topbar-divider">·</span>
        <div className="topbar-item"><span>CHAINLINK</span> <b>OK</b></div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// NAV
// ────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="logo" href="#">
          <span className="logo-mark"/>
          <span>LUMINA</span>
          <span style={{color:'var(--text-3)', fontWeight:400, fontSize:12, marginLeft:6}}>· PROTOCOL</span>
        </a>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#bonds">Bonds</a>
          <a href="#products">Products</a>
          <a href="#burn">Burn</a>
          <a href="#roadmap">Roadmap</a>
          <a href="docs.html">Docs</a>
          <a href="skills.html">Skills</a>
          <a href="tutorial.html">Tutorial</a>
        </div>
        <div className="nav-cta">
          <a className="btn btn-ghost" href="whitepapers.html">Whitepaper</a>
          <a className="btn btn-primary" href="#app">Launch app →</a>
        </div>
      </div>
    </nav>
  );
}

// ────────────────────────────────────────────────────────────
// HERO
// ────────────────────────────────────────────────────────────
function Hero() {
  const [feed, setFeed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFeed(f => (f+1) % BURN_EVENTS.length), 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-eyebrow">
          <span className="dot"/>
          <span>v5.1 · Base L2 · ClaimBond Model · Live</span>
        </div>
        <div className="hero-grid">
          <div>
            <h1>
              Algorithmic risk<br/>
              speculation, <em>settled</em><br/>
              by oracles, <em>burned</em><br/>
              by code.
            </h1>
            <p className="hero-sub">
              Bet against market chaos on Base L2. Every losing premium buys $LUMINA
              on the open market and burns it forever. Every winning bet mints a
              ClaimBond — fixed-USD, 24-month, redeemable in $LUMINA.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#products">Speculate now →</a>
              <a className="btn btn-ghost" href="#bonds">How bonds work</a>
              <a className="btn btn-ghost" href="whitepapers.html">Read whitepaper</a>
            </div>
          </div>
          <aside className="hero-side">
            <div className="hero-side-title">Protocol Snapshot · Live</div>
            <div className="stat-row">
              <span className="stat-label">$LUMINA Price</span>
              <span className="stat-right">
                <span className="stat-val accent">$0.0364</span>
                <span className="stat-delta">+2.31%</span>
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Total Burned</span>
              <span className="stat-right"><span className="stat-val">1,284,402</span></span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Bond Reserve</span>
              <span className="stat-right"><span className="stat-val">82,000,000</span></span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Active ClaimBonds</span>
              <span className="stat-right"><span className="stat-val">2,184</span></span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Burn Ratio (30d)</span>
              <span className="stat-right">
                <span className="stat-val">1.50</span>
                <span className="stat-delta">stable</span>
              </span>
            </div>
          </aside>
        </div>

        <div className="burn-feed">
          {BURN_EVENTS.map((e, i) => (
            <div key={i} className={`burn-feed-item ${i === feed ? 'lit' : ''}`}>
              <span className="meta">{e.t} · {e.action}</span>
              <span className="v">{e.amount} → {e.lumina} burned</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// HOW IT WORKS
// ────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { id: '01', glyph: '◇', title: 'Choose your bet',   meta: '9 products · BTC / ETH / USDT / USDC',
      body: 'Pick a parametric product (Flash BTC 1h, Micro Depeg, Rate Shock, …) and select coverage. Each product has a precise trigger condition, probability, and multiplier.' },
    { id: '02', glyph: '◆', title: 'Premium burns LUMINA', meta: '100% to TWAPBurner · zero to team',
      body: 'Your premium routes through the TWAPBurner: USDC buys $LUMINA on Uniswap, tokens are sent to 0xdead. Permanent supply reduction, every transaction.' },
    { id: '03', glyph: '◈', title: 'Oracle resolves',     meta: 'Chainlink · same-block · trustless',
      body: 'Chainlink oracles monitor the trigger condition in real time. No committees, no governance, no disputes. The trigger fires or it doesn\'t. Pure math.' },
    { id: '04', glyph: '◉', title: 'Bond or burn',        meta: 'ERC-1155 · 24-month · USD-fixed',
      body: 'Trigger fires → ClaimBond minted from the 82M reserve, redeemable for the full USD face value in $LUMINA at maturity. No trigger → premium stays burned.' },
  ];
  return (
    <section className="sec" id="how">
      <div className="wrap">
        <div className="sec-num">01 / 06 · <span>Mechanics</span></div>
        <h2>Four steps from bet to burn. No middlemen, no disputes.</h2>
        <p className="sec-lede">
          ClaimBond is a parametric risk protocol on Base L2. Premiums always burn $LUMINA;
          payouts always come from a sealed on-chain reserve. The state machine has four states.
        </p>

        <div className="steps">
          {steps.map(s => (
            <div className="step" key={s.id}>
              <div className="step-num">
                <span>STEP {s.id}</span>
                <span className="glyph">{s.glyph}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="step-meta">{s.meta}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// BONDS — three options with split bar
// ────────────────────────────────────────────────────────────
function Bonds() {
  const [splitNow, setSplitNow] = useState(60); // % sold now
  return (
    <section className="sec sec-alt" id="bonds">
      <div className="wrap">
        <div className="sec-num">02 / 06 · <span>ClaimBond Tokens</span></div>
        <h2>When your bet wins, you don't get cash. You get something better.</h2>
        <p className="sec-lede">
          ClaimBonds are ERC-1155 tokens. All bonds maturing the same month are interchangeable.
          1 bond = $1 USD claimable at maturity, settled in $LUMINA at market price. You have three options.
        </p>

        <div className="bonds-grid">
          {/* Option A */}
          <div className="bond-card">
            <div className="bond-tag">OPTION A · HOLD</div>
            <h4>Wait 24 months. Redeem full face value.</h4>
            <p>Fixed in USD. An $800 bond always redeems for $800 worth of $LUMINA at the market price on the day of redemption — regardless of where the token trades.</p>
            <div className="bond-row"><span>Bond face</span><span className="v mono">$800.00</span></div>
            <div className="bond-row"><span>If LUMINA = $0.50</span><span className="v mono">1,600.00 LUMINA</span></div>
            <div className="bond-row"><span>If LUMINA = $2.00</span><span className="v mono">400.00 LUMINA</span></div>
            <div className="bond-row"><span>You receive</span><span className="v accent mono">$800.00 · always</span></div>
          </div>

          {/* Option B */}
          <div className="bond-card">
            <div className="bond-tag">OPTION B · SELL NOW</div>
            <h4>Don't want to wait? Sell on the secondary market for USDC.</h4>
            <p>Buyers pay a discounted price (typically 40–60% of face) because they have to wait. You get less than $800 — but you get it now, in stablecoin.</p>
            <div className="bond-row"><span>Bond face</span><span className="v mono">$800.00</span></div>
            <div className="bond-row"><span>Discount</span><span className="v mono">50%</span></div>
            <div className="bond-row"><span>You receive</span><span className="v accent mono">$394.00 USDC</span></div>
            <div className="bond-row"><span>Buyer's IRR</span><span className="v pos mono">+50.0% / yr</span></div>
          </div>

          {/* Option C */}
          <div className="bond-card">
            <div className="bond-tag">OPTION C · SPLIT</div>
            <h4>Sell some, keep some. ERC-1155 is fractional.</h4>
            <p>Slide to choose how much to sell now vs hold to maturity. Drag the split — both legs settle independently.</p>
            <div className="split-bar">
              <div className="seg now"  style={{width:`${splitNow}%`}}>SELL NOW {splitNow}%</div>
              <div className="seg later" style={{width:`${100-splitNow}%`}}>HOLD {100-splitNow}%</div>
            </div>
            <input type="range" min="10" max="90" value={splitNow} onChange={e => setSplitNow(+e.target.value)}
                   style={{width:'100%', accentColor:'var(--accent)'}}/>
            <div className="bond-row"><span>USDC today</span><span className="v mono">${(800*splitNow/100*0.50).toFixed(2)}</span></div>
            <div className="bond-row"><span>LUMINA at maturity</span><span className="v mono">${(800*(100-splitNow)/100).toFixed(2)}</span></div>
            <div className="bond-row"><span>Total face value</span><span className="v accent mono">$800.00</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// PRODUCTS — bloomberg table
// ────────────────────────────────────────────────────────────
function Products() {
  const [filter, setFilter] = useState("ALL");
  const [active, setActive] = useState("btc-1h");
  const filtered = useMemo(() => {
    if (filter === "ALL") return PRODUCTS;
    if (filter === "BTC") return PRODUCTS.filter(p => p.asset === "BTC");
    if (filter === "ETH") return PRODUCTS.filter(p => p.asset === "ETH");
    if (filter === "STABLES") return PRODUCTS.filter(p => p.asset === "USDT" || p.asset === "USDC");
    return PRODUCTS;
  }, [filter]);

  const a = PRODUCTS.find(p => p.key === active) || PRODUCTS[0];
  const cov = 1000;
  const probNum = parseFloat(a.prob) / 100;
  const premium = (cov * 0.80 * probNum * 1.5).toFixed(2);
  const payout = (cov * 0.80).toFixed(2);

  return (
    <section className="sec" id="products">
      <div className="wrap">
        <div className="sec-num">03 / 06 · <span>Live Markets</span></div>
        <h2>Nine products. Each with a precise trigger, probability, and multiplier.</h2>
        <p className="sec-lede">
          Click a row to open the bet sheet. Probabilities are derived from rolling 90-day historical
          volatility; multipliers are derived from the bond reserve curve.
        </p>

        <div className="prod-shell">
          <div className="prod-head">
            <div className="label">PRODUCTS · 9 ACTIVE</div>
            <div className="prod-tabs">
              {["ALL","BTC","ETH","STABLES"].map(t => (
                <button key={t} className={filter===t ? 'on' : ''} onClick={() => setFilter(t)}>{t}</button>
              ))}
            </div>
          </div>
          <table className="prod">
            <thead>
              <tr>
                <th>Product</th>
                <th>Asset</th>
                <th>Trigger</th>
                <th className="r">Prob.</th>
                <th className="r">Multiplier</th>
                <th className="r">Premium /$1K</th>
                <th className="r">Tier</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const prem = (1000 * 0.80 * (parseFloat(p.prob)/100) * 1.5).toFixed(2);
                return (
                  <tr key={p.key} className={active===p.key ? 'on' : ''} onClick={() => setActive(p.key)}>
                    <td className="first">{p.label}</td>
                    <td className="muted">{p.asset}</td>
                    <td>{p.trigger}</td>
                    <td className="r">{p.prob}%</td>
                    <td className="r"><span className="mult">{p.mult}</span></td>
                    <td className="r mono">${prem}</td>
                    <td className="r"><span className="pill">T{p.tier}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{padding:'20px 24px', borderTop:'1px solid var(--line)', background:'var(--bg)',
                       display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1fr', gap:24, alignItems:'start'}}>
            <div>
              <div className="label" style={{marginBottom:8}}>SELECTED</div>
              <div style={{fontSize:18, fontWeight:600, letterSpacing:'-0.02em', lineHeight:1.2}}>{a.label}</div>
              <div style={{fontSize:13, color:'var(--text-3)', fontFamily:'var(--font-mono)', marginTop:6, lineHeight:1.4}}>{a.trigger}</div>
            </div>
            <div>
              <div className="label" style={{marginBottom:8}}>COVERAGE</div>
              <div className="mono" style={{fontSize:20, lineHeight:1.2, fontVariantNumeric:'tabular-nums'}}>$1,000.00</div>
            </div>
            <div>
              <div className="label" style={{marginBottom:8}}>PREMIUM</div>
              <div className="mono" style={{fontSize:20, color:'var(--text)', lineHeight:1.2, fontVariantNumeric:'tabular-nums'}}>${premium}</div>
            </div>
            <div>
              <div className="label" style={{marginBottom:8}}>BOND PAYOUT</div>
              <div className="mono" style={{fontSize:20, color:'var(--accent)', lineHeight:1.2, fontVariantNumeric:'tabular-nums'}}>${payout}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// BURN FLOW
// ────────────────────────────────────────────────────────────
function BurnFlow() {
  const [counter, setCounter] = useState(1284402);
  useEffect(() => {
    const id = setInterval(() => setCounter(c => c + Math.floor(Math.random()*60+5)), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="sec sec-alt" id="burn">
      <div className="wrap">
        <div className="sec-num">04 / 06 · <span>Deflationary Flow</span></div>
        <div className="flow">
          <div>
            <h2>Every premium and every secondary trade burns $LUMINA. <em style={{color:'var(--accent)', fontStyle:'normal'}}>Forever.</em></h2>
            <p className="sec-lede" style={{marginTop:32}}>
              The protocol has two burn paths. Premiums route 100% through the TWAPBurner —
              USDC buys $LUMINA on Uniswap V3, tokens are sent to 0xdead. Secondary marketplace
              trades pay a 3% fee that takes the same path.
            </p>
            <ul style={{listStyle:'none', display:'flex', flexDirection:'column', gap:14, fontSize:14, color:'var(--text-2)'}}>
              <li>– Nothing routes to the team multisig.</li>
              <li>– Nothing accrues to a treasury.</li>
              <li>– Nothing waits in a buyback queue.</li>
              <li>– Burns are atomic with the originating transaction.</li>
            </ul>
          </div>
          <div className="flow-diagram">
            <div className="label" style={{marginBottom:18}}>EXAMPLE · $1,000 COVERAGE · BTC FLASH 1H</div>
            <div className="flow-step">
              <div className="num">01</div>
              <div className="desc">User pays premium <small>USDC, atomic</small></div>
              <div className="amt">$2.40</div>
            </div>
            <div className="flow-step">
              <div className="num">02</div>
              <div className="desc">TWAPBurner buys LUMINA <small>Uniswap V3 · 0.3% pool</small></div>
              <div className="amt">$2.40 in</div>
            </div>
            <div className="flow-step fire">
              <div className="num">03</div>
              <div className="desc">Tokens sent to 0xdead <small>permanent · supply −</small></div>
              <div className="amt">≈ 65.93 LUMINA</div>
            </div>
            <div className="flow-step">
              <div className="num">04</div>
              <div className="desc">If trigger fires <small>oracle verified, same block</small></div>
              <div className="amt mono">$800 bond</div>
            </div>
            <div className="burn-counter">
              <div className="label">TOTAL LUMINA BURNED</div>
              <div className="v">{counter.toLocaleString()}</div>
              <div className="sub">~ $46,752 destroyed forever · last 30d: 184k</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// AUDIENCES
// ────────────────────────────────────────────────────────────
function Audiences() {
  const a = [
    { role: 'For humans', title: 'Speculators',     body: 'Connect a wallet. Browse 9 products. Pay a premium in USDC. If the trigger fires, you receive a ClaimBond — sell early or hold to maturity.', cta: 'Read the guide' },
    { role: 'For agents', title: 'AI developers',   body: 'Drop the SKILL file into your agent. Authenticate. POST /api/v2/purchase. Same bond mechanics, same oracle resolution. No human-only paths.', cta: 'Download SKILL' },
    { role: 'For yield',  title: 'Bond buyers',     body: 'Buy ClaimBonds at a discount on the secondary marketplace. ERC-1155, fractional, fungible by maturity month. IRR 43–150% depending on discount.', cta: 'Open marketplace' },
  ];
  return (
    <section className="sec" id="audiences" style={{paddingBottom: 0}}>
      <div className="wrap">
        <div className="sec-num">05 / 06 · <span>Three Doors</span></div>
        <h2>Built for humans, AI agents, and yield seekers — all using the same contracts.</h2>
        <p className="sec-lede">No fast lane, no special access. The same primitives, exposed through three surfaces.</p>
      </div>
      <div className="audiences">
        {a.map(x => (
          <div className="audience" key={x.role}>
            <div className="role">{x.role}</div>
            <h4>{x.title}</h4>
            <p>{x.body}</p>
            <div className="audience-cta">
              <span>{x.cta}</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// ROADMAP
// ────────────────────────────────────────────────────────────
function Roadmap() {
  const phases = [
    { id: 'P1', current: true, status: 'Current', title: 'Foundation',
      body: 'Smart contracts deployed on Base L2. 9 ClaimBond products live. Chainlink oracle integration. Burn engine architecture. Landing page redesign.' },
    { id: 'P2', current: false, status: 'Q3 2026', title: 'Token Launch',
      body: 'LBP on Fjord Foundry. Uniswap V3 LUMINA/USDC pool. Burn engine activated end-to-end. Real-time burn dashboard. CoinGecko / CMC listing.' },
    { id: 'P3', current: false, status: 'Q4 2026', title: 'Marketplace & Growth',
      body: 'LuminaBondMarketplace.sol live — 3% fee, 100% burned. Agent framework integrations. Automated AI strategies. Target: 500+ policies/day.' },
    { id: 'P4', current: false, status: '2027',    title: 'Maturity',
      body: 'ERC-1155 epoch system for ClaimBonds. Cross-chain deployment (Arbitrum, Optimism). DAO governance. Institutional integrations.' },
  ];
  return (
    <section className="sec sec-alt" id="roadmap">
      <div className="wrap">
        <div className="sec-num">06 / 06 · <span>Roadmap</span></div>
        <h2>From foundation to institutional. Four phases, no detours.</h2>
        <p className="sec-lede">Phases ship sequentially. Each unlocks new contract surfaces — no governance dependencies, no token-gated milestones.</p>

        <div className="roadmap">
          {phases.map(p => (
            <div className={`phase ${p.current ? 'current' : ''}`} key={p.id}>
              <div className="phase-head">
                <div className="id">{p.id}</div>
                <div className="status">{p.status}</div>
              </div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// CTA
// ────────────────────────────────────────────────────────────
function CtaBanner() {
  return (
    <section className="sec cta-banner">
      <div className="wrap">
        <div className="grid">
          <h2>Ready to bet against<br/><em>market chaos?</em></h2>
          <div className="cta-side">
            <a className="btn btn-primary" href="#app">Launch the app →</a>
            <a className="btn btn-ghost" href="whitepapers.html">Whitepaper · EN / ES</a>
            <div className="label" style={{marginTop:8}}>Built on Base L2 · Deflationary by design · Audited by Spearbit</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// FOOTER
// ────────────────────────────────────────────────────────────
function Foot() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="logo" style={{fontSize:16}}>
              <span className="logo-mark"/> <span>LUMINA</span>
              <span style={{color:'var(--text-3)', fontWeight:400, fontSize:12}}>· PROTOCOL</span>
            </div>
            <p>Parametric risk speculation for humans &amp; AI agents. Built on Base L2. Deflationary by design.</p>
            <div className="foot-status">
              <span className="badge"><span style={{width:6,height:6,borderRadius:'50%',background:'var(--pos)'}}></span> BURN ENGINE ACTIVE</span>
              <span className="badge">ERC-1155</span>
              <span className="badge">CHAINLINK</span>
              <span className="badge">82M RESERVE</span>
            </div>
          </div>
          <div className="foot-col">
            <h5>Products</h5>
            <a>Flash BTC 1h / 4h / 24h / 48h</a>
            <a>Flash ETH 1h / 24h / 48h</a>
            <a>Micro Depeg USDT</a>
            <a>Rate Shock</a>
          </div>
          <div className="foot-col">
            <h5>Resources</h5>
            <a href="whitepapers.html">Whitepaper EN</a>
            <a href="whitepaper-es.html">Whitepaper ES</a>
            <a href="skills.html">SKILL file</a>
            <a href="docs.html#contracts">Smart contracts</a>
          </div>
          <div className="foot-col">
            <h5>Contact</h5>
            <a>labs@lumina-org.com</a>
            <a>support@lumina-org.com</a>
            <a>Twitter / X</a>
            <a>GitHub</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 LUMINA PROTOCOL · ALL RIGHTS RESERVED</span>
          <span>BURN RATIO 1.50 · 9 PRODUCTS · BASE L2</span>
        </div>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────
// TWEAKS
// ────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "aesthetic": "terminal",
  "mode": "dark",
  "density": "default",
  "monoOnly": false,
  "accent": "#00d4ff"
}/*EDITMODE-END*/;

function Tweaks() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.body.dataset.aesthetic = tweaks.aesthetic;
    document.body.dataset.mode = tweaks.mode;
    document.body.dataset.density = tweaks.density;
    document.body.dataset.monoOnly = String(tweaks.monoOnly);
    if (tweaks.aesthetic !== 'institutional' && !tweaks.monoOnly) {
      document.documentElement.style.setProperty('--accent', tweaks.accent);
    } else {
      document.documentElement.style.removeProperty('--accent');
    }
  }, [tweaks]);

  return (
    <window.TweaksPanel title="Tweaks">
      <window.TweakSection title="Direction">
        <window.TweakRadio
          label="Aesthetic"
          value={tweaks.aesthetic}
          onChange={v => setTweak('aesthetic', v)}
          options={[
            { value: 'terminal',      label: 'Terminal' },
            { value: 'editorial',     label: 'Editorial' },
            { value: 'institutional', label: 'Institut.' },
          ]}
        />
        <window.TweakRadio
          label="Mode"
          value={tweaks.mode}
          onChange={v => setTweak('mode', v)}
          options={[
            { value: 'dark',  label: 'Dark' },
            { value: 'light', label: 'Light' },
          ]}
        />
        <window.TweakRadio
          label="Density"
          value={tweaks.density}
          onChange={v => setTweak('density', v)}
          options={[
            { value: 'compact',  label: 'Compact' },
            { value: 'default',  label: 'Default' },
            { value: 'spacious', label: 'Spacious' },
          ]}
        />
      </window.TweakSection>
      <window.TweakSection title="Color">
        <window.TweakToggle
          label="Mono-only (no accent)"
          value={tweaks.monoOnly}
          onChange={v => setTweak('monoOnly', v)}
        />
        <window.TweakColor
          label="Accent"
          value={tweaks.accent}
          onChange={v => setTweak('accent', v)}
        />
      </window.TweakSection>
    </window.TweaksPanel>
  );
}

// ────────────────────────────────────────────────────────────
// APP
// ────────────────────────────────────────────────────────────
function App() {
  return (
    <>
      <TopBar />
      <Nav />
      <Hero />
      <HowItWorks />
      <Bonds />
      <Products />
      <BurnFlow />
      <Audiences />
      <Roadmap />
      <CtaBanner />
      <Foot />
      <Tweaks />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
