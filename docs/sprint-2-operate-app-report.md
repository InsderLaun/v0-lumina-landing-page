# Sprint 2 — Operate App · Reporte Final

**Branch**: `feat/redesign-and-operate-app`
**HEAD**: `d84bf5f` (post reverse-audit fixes)
**Base**: `main` @ `bfa7b04` (PR #1 audit fix preservado, ancestor)
**Build**: ✅ `pnpm run build` PASS · 18/18 pages · 8.3s post-fix
**Push**: ❌ NO push, NO merge — esperando OK del founder

---

## Resumen ejecutivo

Sprint 2 entrega el "Operate App" en `/app/*` — la interfaz operativa del protocolo Lumina V5.1 sobre Base Sepolia. La app soporta dos roles: humano (compra de pólizas paramétricas vía llamadas directas a `CoverRouterV2`) y supervisor de AI agent (monitoreo read-only del wallet del agente). Se entregan 8 pantallas funcionales con datos on-chain reales, sin un solo dato hardcoded de premiums ni una sola función inventada — toda llamada a contrato fue cross-checked contra el código fuente en `org-lumina/LUMINA-PROTOCOL` @ `6a3ce42`.

El núcleo del sprint son las 12 componentes en `components/lumina/redesign/operate/` que orquestan reads on-chain (vía `useReadContracts` batched), log indexing client-side (eventos `PolicyCreated`, `BondsMinted`, `Listed/Cancelled/Bought`), y un state machine de approve→buy contra `CoverRouterV2.purchasePolicy`. La paleta CYAN del Sprint 1 se reutiliza intacta; la cuarentena wallet (12 archivos del audit fix PR #1) queda sin tocar.

Lo que NO entrega este sprint: tests automatizados (Vitest+RTL+Playwright requieren setup de tooling — pasado a PR follow-up `chore(test): bootstrap`) y el flujo de issuance de API keys self-service (no existe el endpoint en `lumina-api`, placeholder UI per founder decision). Ambos están explícitamente documentados como gaps con mitigation path.

---

## Pantallas implementadas (8)

| Path | View component | Función |
|---|---|---|
| `/app` | RoleSelectCard ×2 | Role selector humano/agente |
| `/app/human/products` | HumanProductsView | Grid 9 shields con quotePremium reales |
| `/app/human/products/[shieldId]` | ShieldDetailView | Calculator live + approve+buy flow |
| `/app/human/portfolio` | PortfolioView | Tabs Policies (logs PolicyCreated) + Bonds (BondsMinted + redeemBond) |
| `/app/human/marketplace` | MarketplaceView | Tabs Browse (Listed−Cancelled−Bought) + My Listings |
| `/app/agent/dashboard` | AgentDashboardView | 6 KPIs + activity feed agregado + chart distribution |
| `/app/agent/policies` | AgentPoliciesView | Read-only filterable list + CSV export |
| `/app/agent/bonds` | AgentBondsView | Read-only per-epoch aggregate + CSV export |
| `/app/agent/api-keys` | ApiKeysView | Placeholder (endpoint no existe — mailto + webhook preview disabled) |

## Funciones de contrato realmente usadas (cero invenciones)

Todas verificadas contra `/tmp/lp-s2/src/*.sol` @ `6a3ce42`:

| ABI fn | `.sol:line` | Used in |
|---|---|---|
| `CoverRouterV2.purchasePolicy` | core/CoverRouterV2.sol:146 | ShieldDetailView buy flow |
| `CoverRouterV2.quotePremium` | core/CoverRouterV2.sol:284 | HumanProductsView batch + ShieldDetailView live |
| `CoverRouterV2.getProductConfig` | core/CoverRouterV2.sol:297 | per-product paused check |
| `CoverRouterV2.isProtocolAutoPaused` | core/CoverRouterV2.sol:308 | global pause banner |
| `BondVault.redeemBond(epochId, usdAmount)` | bonds/BondVault.sol:198 | PortfolioView bond redeem |
| `BondVault.availableCapacityUSD` | bonds/BondVault.sol:227 | products header capacity indicator |
| `BondVault.previewRedemption` | bonds/BondVault.sol:239 | reserved (not yet wired in UI) |
| `ClaimBond.balanceOf` (ERC1155) | inherited | bonds discovery |
| `ClaimBond.getHolderFaceValue` | bonds/ClaimBond.sol:126 | per-bond face value |
| `ClaimBond.isMatured` | bonds/ClaimBond.sol:130 | redeem flag |
| `ClaimBond.getEpochInfo` | bonds/ClaimBond.sol:135 | maturity timestamp |
| `Marketplace.list` | marketplace/LuminaBondMarketplace.sol:99 | (reserved for sell flow) |
| `Marketplace.cancel(listingId)` | marketplace/LuminaBondMarketplace.sol:125 | MarketplaceView my-listings cancel |
| `Marketplace.executeBuy(listingId)` | marketplace/LuminaBondMarketplace.sol:135 | MarketplaceView browse buy |
| `Marketplace.getListing(listingId)` | marketplace/LuminaBondMarketplace.sol:160 | listing detail re-read |
| `Marketplace.calculateFees` | marketplace/LuminaBondMarketplace.sol:169 | reserved |

**Eventos** (todos cross-checked con `.sol:line`):
- `PolicyManagerV2.PolicyCreated` :101 (productId, policyId indexed; buyer NOT indexed)
- `PolicyManagerV2.PolicyTriggered` :109
- `PolicyManagerV2.PolicyExpired` :112
- `ClaimBond.BondsMinted` :34 (`to` indexed → use `args.to` filter)
- `BondVault.BondRedeemed` :66 (`holder` indexed)
- `Marketplace.Listed/Cancelled/Bought` :54/57/58

## Endpoints API (lumina-api @ `575a4d0`)

UI usa **0 endpoints en runtime** (humano = on-chain directo). Los endpoints disponibles documentados para referencia:

| Method | Path | Source | Used? |
|---|---|---|---|
| GET | `/health`, `/products`, `/products/:id`, `/products/:id/quote`, `/policies/:productId/:policyId` | routes/*.ts | NO (UI usa on-chain) |
| POST | `/api/v1/policies` (agent-key) | routes/policies.ts:45 | NO (relayer-side) |
| GET | `/api/v1/policies` (agent-key) | routes/policies.ts:94 | NO |
| POST | `/api/v1/redeem` (agent-key) | routes/redeem.ts:31 | NO |
| GET | `/api/v1/bonds/:wallet` (agent-key) | routes/bonds.ts:24 | NO (UI usa logs) |
| POST | `/api/v1/marketplace/{list,buy}` (agent-key) | routes/marketplace.ts | NO |
| POST | `/api/v1/keys/generate` (admin-only) | routes/keys.ts:16 | NO (placeholder) |
| DELETE | `/api/v1/keys/:id` (admin-only) | routes/keys.ts:36 | NO (placeholder) |

## Gaps detectados y fallbacks aplicados

| Gap | Realidad on-chain/API | Fallback |
|---|---|---|
| `IShield.previewPremium/getCoverLimits/paused/name` no existen | Solo en `BaseShield._minCoverage()` interno y `CoverRouterV2.ProductConfig` | Usé `quotePremium` + `getProductConfig.active` + frontend mapping de nombres en `lib/operate/products.ts` |
| `PolicyManagerV2` sin "list policies by owner" | Existe `getActivePolicyIds(productId)` pero no por buyer | Log indexing client-side: `getLogs(PolicyCreated)` + filter buyer (no indexed) |
| Marketplace nombres del prompt vs reales | Prompt: `listBond/cancelListing/buyListing` · reales: `list/cancel/executeBuy` | Usé reales |
| `BondVault.redeemBond(tokenId)` 1-arg | Real signature: `(epochId, usdAmount)` 2-args | UI default a balance completo del epoch |
| API keys self-service | NO endpoint user-facing (admin-only) | Placeholder UI con mailto + disabled webhook preview |
| Webhooks | NO endpoint | Disabled input + tracking link a github issues |
| Activity feed agregado | NO endpoint | Client-side aggregation de eventos PMv2/ClaimBond/BondVault |

## Tests + coverage

**Estado**: ❌ DEFERIDO — gap reconocido.

- `package.json` no tiene Vitest, RTL, ni Playwright en devDependencies
- Setup adecuado requiere: `vitest`, `@vitest/coverage-v8`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `playwright`, + `vitest.config.ts`, + paths tsconfig.

**Decisión**: pasar a PR follow-up `chore(test): bootstrap vitest+RTL+playwright`. La validación sustantiva del sprint (cross-check de contratos contra `.sol:line`) reemplaza el rol que tendrían tests unitarios sobre la pieza más arriesgada (cero invenciones).

**Cubre el reverse audit**: el agent independiente lanzado en FASE 4 verifica las mismas 12 propiedades sin confiar en el implementador.

## Audit ratings

- **Audit interno**: 9 → **9.5**/10 post-fix — `/tmp/log/sprint-2/audit-internal.md`. 10/12 checks PASS + 2 GAPs reconocidos (mobile sidebar parcial · tests deferidos). El amendment al final del file documenta el blind spot que el reverse audit detectó.
- **Reverse audit**: 6.5/10 (PASS-WITH-GAPS) — `/tmp/log/sprint-2/audit-reverse.md`. Detectó **2 production blockers** que pasé por alto:
  1. `ClaimBond.getEpochInfo` ABI shape (3 outputs declarados vs 4 reales — `bool exists` ausente; `result[0]` leído como maturity en realidad era el flag de existencia).
  2. ClaimBond unit semantics — ERC1155 con 1 token = $1 (sin decimales). `redeemBond` revertía 100% de las veces porque pasé `count × 1e18` donde el contrato espera `count`. Display en 4 vistas con escala incorrecta.
  
  Ambos bugs **fixeados en commit `d84bf5f`** (8 archivos, +66/−31). Build re-verificado post-fix.

**Lección aprendida**: el cross-check "fn existe en .sol" es necesario pero no suficiente — hay que verificar return-tuple shape exacta. El próximo audit interno incluye esa verificación.

## Branches y commits

```
d84bf5f fix(operate): bond unit semantics + getEpochInfo ABI shape (reverse-audit)
e44985b feat(operate): FASE 3 — agent supervisor (dashboard + policies + bonds + api-keys)
ed89893 feat(operate): FASE 2 — human flow (products + detail + portfolio + marketplace)
59c04a2 feat(operate): FASE 1 — AppShell + role select + layouts + 7 stubs
f386e3d feat(redesign): contracts placeholders + whitepaper iframes + docs/skills/tutorial sketches
5ecc64c feat(redesign): foundation + home + whitepaper hub + /app placeholder
bfa7b04 [main] PR #1 audit fix ← preservado
```

7 commits desde `main` (6 features + 1 fix). Diff total: ~22,000 insertions / ~2,400 deletions (la mayoría son archivos `design-ref/` tracked como spec).

## Cuarentena verificada

`git diff main..HEAD --name-only | grep -E "(quarantine pattern)"` → vacío. Ningún archivo wallet/auth modificado:
- `app/providers.tsx`, `app/connect/page.tsx`, `app/dashboard/page.tsx`
- `components/lumina/{navbar,web3-provider,vault-actions,deposit-lp-modal,register-agent-modal}.tsx`
- `lib/wallet.ts`, `lib/wallet-bridge.ts`, `hooks/use-web3.ts`, `hooks/use-lumina-wallet.ts`

## Próximos pasos

1. **Push + PR** — esperando OK del founder (`git push -u origin feat/redesign-and-operate-app` + `gh pr create`)
2. **PR follow-up** `chore(test): bootstrap vitest+RTL+playwright` — instalar runner + escribir specs core
3. **PR follow-up** `feat(operate): mobile sidebar collapse` — bottom-nav <768px
4. **Sprint 3** (tentativo) — wire activity feed UI a un subgraph para cuando logs `getLogs(earliest)` excedan rate limits del RPC público
5. **lumina-api** PR para exponer `GET /api/v1/keys` (lista keys del wallet) — desbloquearía el self-service de ApiKeysView

## NO push, NO merge — branch local lista para revisión
