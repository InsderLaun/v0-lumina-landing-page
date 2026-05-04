# Lumina Design Reference

Source-of-truth files for the redesign. **Do not invent — copy these.**

## Structure

- `Lumina Home Redesign.html` + `lumina-home.jsx` — full home page redesign (terminal-financial aesthetic)
- `whitepapers.html` — whitepaper selector hub (4 cards: Full EN/ES + Summary EN/ES)
- `whitepaper.html` / `whitepaper-es.html` — full whitepaper pages with redesigned shell
- `docs.html` / `skills.html` / `tutorial.html` — supporting pages
- `Operate App.html` — design canvas with all 8 operate-app screens
- `operate-app/operate-screens.jsx` — the 8 screens as React components:
  1. `RoleSelect` → /app
  2. `HumanProducts` → /app/human/products
  3. `ShieldDetail` → /app/human/products/[shieldId]
  4. `Portfolio` → /app/human/portfolio
  5. `Marketplace` → /app/human/marketplace
  6. `AgentDashboard` → /app/agent/dashboard
  7. `AgentPolicies` → /app/agent/policies (also adapt for /agent/bonds)
  8. `AgentApiKeys` → /app/agent/api-keys

## Design tokens (canonical)

Backgrounds: `#0a0a0c` (root) / `#0e0e12` (alt) / `#111116` (cards) / `#15151c` (cards-2)
Borders: `#1d1d24` / `#2a2a34`
Text: `#e8e8ec` / `#a8a8b3` / `#6b6b78` / `#44444f`
Accent (cyan): `#00d4ff`
Positive: `#00d48a` · Warn: `#f59e0b` · Negative: `#ef4444`
Fonts: Inter (sans), JetBrains Mono (mono), Fraunces (display serif, italic for emphasis)

## Behavior the JSX shows

- Sepolia banner persistent across all /app/* routes
- Sidebar context-switches between Human and Agent links
- Top bar: Lumina logo + role pill + Base Sepolia status + USDC/LUMINA balances + wallet pill
- All numeric/code text uses JetBrains Mono with letter-spacing 0.06em
- Hero headlines use Fraunces 300 with italic emphasis on key words
