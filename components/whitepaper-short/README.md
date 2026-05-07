# Whitepaper Short

Self-contained 10-section page at `/whitepaper-short/[lang]` — EN and ES.
Drops in alongside the existing redesign components without modifying any.

## Section order (10 sections)

1. Hero               (Section1Hero)
2. Problem            (Section2Problem)
3. How it works       (Section3HowItWorks)
4. Lifecycle          (Section4Lifecycle) — NEW
5. Shields            (Section4Shields)
6. Tokenomics         (Section5Tokenomics)
7. Adaptive burn      (Section6Matrix)
8. For agents         (Section7ForAgents)
9. Live state         (Section8LiveState)
10. CTA               (Section9CTA)

The component file names retain their original `SectionN…` numbering for stable
imports. Only the `id="sN"`, `data-screen-label`, eyebrow, and `CopyEN['sN']`
prop slot were rebound to the new positions in the running order.

## File map

```
app/whitepaper-short/[lang]/page.tsx       ← server component, route entry
components/whitepaper-short/
├── copy.en.ts                             ← all EN strings + types (s1..s10)
├── copy.es.ts                             ← ES mirror (same shape)
├── wp-short.css                           ← page-scoped styles (wp-* classes)
├── MotionWrapper.tsx                      ← FadeUp + stagger variants
├── LangSwitch.tsx                         ← EN/ES pill, top-right
├── Section1Hero.tsx                       ← (server) + HeroBurnFeed (client)
├── HeroBurnFeed.tsx                       ← (client) burn-feed cycler
├── Section2Problem.tsx                    ← (server)
├── Section3HowItWorks.tsx                 ← (client) framer pathLength arrows
├── Section4Lifecycle.tsx                  ← (server) NEW · 6-step lifecycle + worked example
├── Section4Shields.tsx                    ← (client) hover state — slot 5
├── Section5Tokenomics.tsx                 ← (server) — slot 6
├── DonutChart.tsx                         ← (client) animated donut
├── Section6Matrix.tsx                     ← (client) selection state — slot 7
├── Section7ForAgents.tsx                  ← (server) — slot 8
├── CodeAndReceipt.tsx                     ← (client) typewriter + receipt
├── Section8LiveState.tsx                  ← (server) fetch /health, revalidate 30 — slot 9
├── AddressCopyButton.tsx                  ← (client) clipboard
├── Section9CTA.tsx                        ← (server) — slot 10
└── README.md                              ← this file
```

## Server vs client

Server: page.tsx, Section1Hero, Section2Problem, Section4Lifecycle, Section5Tokenomics,
Section7ForAgents, Section8LiveState, Section9CTA.

Client (`'use client'`): MotionWrapper (uses framer-motion hooks), HeroBurnFeed,
Section3HowItWorks (path-draw), Section4Shields (hover), DonutChart, Section6Matrix,
CodeAndReceipt, AddressCopyButton, LangSwitch.

## /health fetch

Section8LiveState fetches `https://lumina-api-production-ac85.up.railway.app/health`
with `next: { revalidate: 30 }` — caches for 30 s. Falls back to a hardcoded snapshot
(captured 2026-05-06) if the call fails so the page never breaks. The total-burned
counter is hardcoded for now — wire it up to `TWAPBurner.BurnExecuted` later, mirroring
the existing `BurnEngine.tsx` pattern.

## i18n

Route-based, no message bundles. Two static params (`en`, `es`) emitted at build time
via `generateStaticParams()`. `LangSwitch` is a client component with two `<Link>`s.

To add a third language:
1. Create `copy.fr.ts` with the same exported shape as `copy.en.ts`.
2. Extend `generateStaticParams()` in `page.tsx` to include `{ lang: 'fr' }`.
3. Add a third `<Link>` in `LangSwitch.tsx`.

Number formatting uses `Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US')` in
Section8 — `100,000,000` → `100.000.000`. Add the new locale there.

## Dependencies

Uses only what's already in `package.json`:
- `next` (App Router, Server Components)
- `react` 19
- `framer-motion` 11

No new dependencies. No new fonts. No top-level config changes.

## Optional: add a Nav link

The brief asks for an optional dropdown or new entry in
`components/lumina/redesign/Nav.tsx` `PAGE_LINKS`. Not done here — pick one:

```ts
// Simple variant:
{ href: '/whitepaper-short/en', label: 'Whitepaper Short' }

// Dropdown variant: make Whitepaper expand to two children
//   Long version  → /whitepaper
//   Short version → /whitepaper-short/en
```

## Tokens

Uses only the `--rd-*` CSS variables defined in `redesign.css` plus three brand-aligned
accent colors borrowed for the donut/matrix channels (`#f59e0b`, `#ec4899`, `#22d3ee`).
No new fonts. No light mode. All animation respects `prefers-reduced-motion`.

## Gotchas

- The `/health` endpoint is on Railway — slow cold-start is possible. The
  `revalidate: 30` cache + hardcoded fallback keeps the page snappy.
- `formatEth` uses `Number(wei)/1e18` for display only — fine at 4 decimals; do NOT
  use this for any monetary calculation.
- The 4×4 matrix is keyboard-clickable (each cell is a `<button>`). To add arrow-key
  navigation, wrap the grid in a focus manager — left as a follow-up.
- Section 8's "TOTAL LUMINA BURNED" is currently a static fallback. To wire up live
  data, follow the pattern in `components/lumina/redesign/BurnEngine.tsx` (poll
  `TWAPBurner.BurnExecuted` events on the last 9000 blocks).
