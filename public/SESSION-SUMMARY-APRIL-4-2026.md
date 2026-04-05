# LUMINA PROTOCOL — RESUMEN DE SESIÓN PARA CONTINUAR

## Fecha: 1-4 de abril 2026
## Transcript completo: /mnt/transcripts/2026-04-01-21-19-42-lumina-protocol-production-session.txt

---

## PROYECTO
Lumina Protocol: seguros paramétricos para agentes de IA en Base L2 (Chain 8453). Settlement en USDC real. Yield via Aave V3.
**Fundador:** Agustín Tiberio (Argentina)
**Repos:** `org-lumina/LUMINA-PROTOCOL` (contratos) + `org-lumina/v0-lumina-landing-page` (frontend)
**Web:** https://www.lumina-org.com (Google Cloud Run)
**API:** Railway (lumina-protocol-production.up.railway.app)

---

## QUÉ SE HIZO EN ESTA SESIÓN

### Cambios en contratos (on-chain, ejecutados via Gnosis Safe):

1. ✅ **5 UUPS Upgrades ejecutados** — CoverRouter, VolatileShort, VolatileLong, StableShort, StableLong. Nuevas implementaciones deployadas y proxies actualizados.

2. ✅ **TimelockController delay → 0** — Para permitir cambios instantáneos. PENDIENTE RESTAURAR A 48h.

3. ✅ **Cap combinado BSS+IL 70%** — BSS + IL no pueden superar el 70% del vault combinados. Protege contra pérdidas correlacionadas.

4. ✅ **Cooldowns +7 días** — Actualizados on-chain:
   - VolatileShort: 30 → 37 días (3196800s)
   - VolatileLong: 90 → 97 días (8380800s)
   - StableShort: 90 → 97 días (8380800s)
   - StableLong: 365 → 372 días (32140800s)

5. ✅ **Deposit caps configurados** on-chain via Safe:
   - VolatileShort/Long: $500K total, $100K por usuario
   - StableShort/Long: $1M total, $200K por usuario

6. ✅ **Performance fee queue** — Si Aave falla al cobrar el fee, se guarda en cola para cobrar después.

7. ✅ **userDeposits decrement** — Fix: al retirar, se decrementa el contador de depósitos del usuario para que el deposit cap funcione correctamente.

### Cambios en API (Railway):

8. ✅ **Input validation mejorada:**
   - Negative coverage → 400 (antes 500)
   - Zero duration → 400 (antes "missing fields")
   - Duration > 1 año → 400
   - Min/max duration por producto (BSS 7-30d, DEPEG 14-365d, IL 14-90d, EXPLOIT 90-365d)
   - Min coverage $100

### Cambios en documentación/web:

9. ✅ **SKILL V3.1** — Addresses de producción corregidas, pBase corregidos (650/250/850/400 bps), sección dinámica del Kink model, ejemplos Python/JS/ethers
10. ✅ **FAQ reescrito** — 5 correcciones + 9 preguntas nuevas, honesto sobre riesgos
11. ✅ **Tutorial auditado** — 3 bugs fixeados, warning de paso manual en Claude Code setup
12. ✅ **APY ranges corregidos** — De 12-16%/15-19%/11-15%/18-27% a 2-29%/2-29%/2-16%/2-16%
13. ✅ **SKILL links V2→V3** — 8 links actualizados
14. ✅ **79→89 tests** — Tests nuevos para cooldowns, caps, correlation groups
15. ✅ **PRODUCTION-ADDRESSES.md** actualizado con cooldowns nuevos

---

## QUÉ FALTA HACER (PENDIENTE)

### URGENTE (hacer ahora):

**A. Restaurar delay a 48h en TimelockController**
- Actualmente delay = 0 → RIESGO CRÍTICO
- Necesita: schedule + execute de updateDelay(172800) via Gnosis Safe
- Con delay=0 se puede hacer inmediato

**B. Oracle pasar de 1-of-1 a 2-of-3**
- Actualmente: requiredSignatures = 1, totalSigners = 1 (solo 0x933b...)
- Necesita: agregar 2 signers + setRequiredSignatures(2)
- Agustín debe decidir qué 2 wallets usar (sugeridas: las mismas de la Gnosis Safe 0xe585... y 0xEdA7...)

### NO URGENTE (dejado para después):

**C. maxPayoutsPerDay** — Limitar daño si oracle se compromete. Agustín decidió NO implementarlo ahora porque con delays de +48h en pagos y si escala volumen, el límite diario podría ser un problema operativo.

**D. Min coverage $500 on-chain** — Actualmente solo validado en API ($100). El contrato on-chain no tiene mínimo — un atacante podría bypassear la API y comprar pólizas de $1 directamente en el contrato.

---

## ADDRESSES DE PRODUCCIÓN (Base mainnet 8453)

```
CoverRouter:        0xd5f8678A0F2149B6342F9014CCe6d743234Ca025
PolicyManager:      0xCCA07e06762222AA27DEd58482DeD3d9a7d0162a
Oracle:             0x4d1140ac8f8cb9d4fb4f16cae9c9cba13c44bc87
TimelockController: 0xd0De5D53dCA2D96cdE7FAf540BA3f3a44fdB747a
Gnosis Safe:        0xa17e8b7f985022BC3c607e9c4858A1C264b33cFD
PhalaVerifier:      0x468b9D2E9043c80467B610bC290b698ae23adb9B
VolatileShort:      0xbd44547581b92805aAECc40EB2809352b9b2880d
VolatileLong:       0xFee5d6DAdA0A41407e9EA83D4F357DA6214Ff904
StableShort:        0x429b6d7d6a6d8A62F616598349Ef3C251e2d54fC
StableLong:         0x1778240E1d69BEBC8c0988BF1948336AA0Ea321c
BSS Shield:         0x2926202bbe3f25f71ef17b25a20ebe8be028af5f
Depeg Shield:       0x7578816a803d293bbb4dbea0efbed872842679d0
IL Shield:          0x2ac0d2a9889a8a4143727a0240de3fed4650dd93
Exploit Shield:     0x9870830c615d1b9c53dfee4136c4792de395b7a1
USDC:               0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

### Safe signers (2-of-3):
```
Signer 1: 0xe585...fDa8
Signer 2: 0x933b...977E
Signer 3: 0xEdA7...C7Eb
```

### Oracle (1-of-1 — PENDIENTE subir a 2-of-3):
```
Oracle signer: 0x933b...977E (requiredSignatures = 1)
```

---

## AUDITORÍA DE SEGURIDAD POST-CAMBIOS

### Score: 6.5/10
```
Contratos Solidity:     8/10
Governance/Timelock:    3/10 (delay=0 es CRÍTICO)
Oracle:                 4/10 (1-of-1)
API:                    7/10
Documentación:          4/10 → mejorada a ~8/10 con los fixes
On-chain state:         6/10 → mejorada a ~8/10 con cooldowns actualizados
```

### Vulnerabilidades abiertas:
1. **CRITICAL** — Delay=0 permite cambios instantáneos → RESTAURAR A 48h
2. **HIGH** — Oracle 1-of-1 puede fabricar claims → SUBIR A 2-of-3
3. **MEDIUM** — Min coverage solo en API, no on-chain

---

## ANÁLISIS ECONÓMICOS REALIZADOS

### Pricing (8.5/10):
- BSS EV positivo para compradores (+$457 por $50K/14d)
- IL no recomendado (prima come 42% del yield)
- Kink model es contracíclico: bear market = Lumina brilla

### Yields por vault (fórmula real PremiumMath.sol):
```
VolatileShort: 2-29% APY (4.64% a U=20%, 22.64% a U=90%)
VolatileLong:  2-29% APY (4.75% a U=20%, 23.95% a U=90%)
StableShort:   2-16% APY (3.65% a U=20%, 10.86% a U=90%)
StableLong:    2-16% APY (3.76% a U=20%, 12.17% a U=90%)
```

### Reaseguro institucional diseñado:
- Producto: "Lumina Institutional Shield" para LPs +$100K
- Cobertura: 80% de pérdida catastrófica
- Costo: Volatile 2.00%/año, Stable 0.85-1.10%/año
- Lumina cobra 0% comisión (pass-through al reasegurador)
- Combined ratio reasegurador: 63.8%
- LP worst case con shield: -3.4% a -5.2% (vs -17% a -26% sin)

### Análisis comercial (7/10):
- Producto 8/10, Pricing 7/10 (subió a 8.5 con argumentos del Kink dinámico)
- Seguridad 6/10, UX 9/10, Negocio 5/10
- Break-even a ~$600K TVL
- Negocio real a $50M+ TVL
- Competencia directa: CERO (blue ocean)

---

## PROMPTS GENERADOS Y DISPONIBLES

```
/mnt/user-data/outputs/PROMPT-CAP-COMBINADO-BSS-IL.md
/mnt/user-data/outputs/PROMPT-COOLDOWN-BUFFER-7D.md
/mnt/user-data/outputs/PROMPT-3-CONTRACT-FIXES-POST-TIMELOCK.md
/mnt/user-data/outputs/PROMPT-FIX-APY-RANGES.md
/mnt/user-data/outputs/PROMPT-FIX-FAQ.md
/mnt/user-data/outputs/PROMPT-FAQ-AUDIT.md
/mnt/user-data/outputs/PROMPT-TUTORIAL-AUDIT-V2.md
/mnt/user-data/outputs/PROMPT-NAVBAR-FIX-V2.md
/mnt/user-data/outputs/PROMPT-FIX-DASHBOARD-DATA.md
/mnt/user-data/outputs/MEGA-PROMPT-PRICING-ANALYSIS.md
/mnt/user-data/outputs/MEGA-PROMPT-COMMERCIAL-ANALYSIS.md
/mnt/user-data/outputs/MEGA-PROMPT-SECURITY-MULTI-AGENT.md
/mnt/user-data/outputs/MEGA-PROMPT-QA-EXHAUSTIVE.md
/mnt/user-data/outputs/MEGA-PROMPT-SKILL-DYNAMIC-KINK.md
/mnt/user-data/outputs/MEGA-PROMPT-REINSURANCE-ANALYSIS.md
/mnt/user-data/outputs/MEGA-PROMPT-REINSURANCE-DEFINITIVE.md
/mnt/user-data/outputs/MEGA-PROMPT-GEMINI-DEFI-COMPARISON.md
/mnt/user-data/outputs/MEGA-PROMPT-SECURITY-AUDIT-POST-CHANGES.md
/mnt/user-data/outputs/LUMINA-REINSURANCE-COMMERCIAL-PROPOSAL.md
/mnt/user-data/outputs/LUMINA-REINSURANCE-COMMERCIAL-PROPOSAL.pdf
```

---

## MODELO KINK (PremiumMath.sol)
```
M(U) = 1 + (U/80% × 0.5)          si U ≤ 80%
M(U) = 1.5 + ((U-80%)/20% × 3.0)  si U > 80%
U > 95% = rechazado

Premium_yield_LP = U × pBase × M(U) × 0.97
Total_yield = Premium_yield + Aave_yield

U_KINK=80%, R_SLOPE1=0.5, R_SLOPE2=3.0, U_MAX=95%
```

## FEES
```
3% sobre primas (al comprar póliza)
3% sobre payouts (al pagar claim)
3% performance fee (sobre ganancia LP al retirar)
```

## PRODUCTOS
```
BSS:     650 bps (6.5%), duración 7-30d, deducible 20%, maxPayout 80%, maxAlloc 20%
DEPEG:   250 bps (2.5%), duración 14-365d, deducible 15% USDT/12% DAI, maxPayout 85/88%
IL:      850 bps (8.5%), duración 14-90d, cap 11.7%, maxAlloc 20%
EXPLOIT: 400 bps (4.0%), duración 90-365d, deducible 10%, maxPayout 90%, maxAlloc 10%, cap $50K
```

## TESTS: 89/89 passing

---

## PRÓXIMOS PASOS INMEDIATOS AL RETOMAR

1. **Oracle 2-of-3** — Agustín debe elegir 2 wallets adicionales como oracle signers
2. **Restaurar delay a 48h** — Último paso después del oracle
3. **Verificar todo on-chain** post-cambios con la auditoría de seguridad

## DEPLOY COMMANDS
```bash
# Frontend
gcloud run deploy lumina-app --source . --region=us-central1 --port=8080 --allow-unauthenticated --min-instances=0 --max-instances=2

# Contratos
forge build && forge test && git push origin main
```
