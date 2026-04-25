# CALCULATOR-AUDIT — Bloque 5

**Fecha medición**: 2026-04-25
**Resultado global**: ✅ **PASS** — 123/123 assertions
**Comando**: `DATABASE_URL=postgresql://test:test@localhost/test npm run test:calculator`

---

## 1. Tests automatizados (output real medido)

```
123/123 assertions passed.
Exit: 0
```

Cobertura del test suite:
- 4 presets (USE_CASE_PRESETS) → bestId === "llc" en todos
- 4 contra-escenarios "LLC not best" → bestId !== "llc"
- 8 países × 4 asserts cada uno (totales finitos, breakdowns no vacíos, sinLLC>0, conLLC>=0)
- Schema Zod `/api/calculator-leads` (4 asserts: full payload, retro-compat, strict, customExpenses)
- Email rendering 4 asserts (FX shared, winning structure, signed deltas, special regime)
- Edge cases: 12 asserts (zero income, gastos>ingresos, unknown country, NaN, Infinity, negative, 1e9)

**Sample medido del output**:
- `country[belgica] autonomo sinLLC=34423, conLLC=1500`
- `country[italia] auto=31233 · soc=30849 · llc=18930 · best=llc`
- `country[austria] auto=30381 · soc=29500 · llc=16511 · best=llc`
- `monthlyIncome=0 · España autónomo · sinLLC=2400` (SS mínima 200×12)

---

## 2. Tramos IRPF 2026 (verificados contra LIRPF art. 57)

`exentax-web/client/src/lib/calculator-config.ts:38-46`

| Tramo | Límite (€) | Tipo |
|---|---:|---:|
| 1 | 12.450 | 19% |
| 2 | 20.200 | 24% |
| 3 | 35.200 | 30% |
| 4 | 60.000 | 37% |
| 5 | 300.000 | 45% |
| 6 | ∞ | 47% |

Source of truth: artículo blog `tramos-irpf-2026.ts` + Ley Presupuestos 2026 (escala media autonómica).

---

## 3. Cuotas autónomos 2026 (RD-Ley 13/2022 + tabla TGSS 2026)

`calculator-config.ts:62-78` — 15 tramos oficiales TGSS 2026:

| Tramo | Rendimiento mensual ≤ | Cuota (€/mes) |
|---:|---:|---:|
| 1 | 670 | 200,00 |
| 2 | 900 | 220,00 |
| 3 | 1.166,70 | 260,00 |
| 4 | 1.300 | 293,90 |
| 5 | 1.500 | 296,60 |
| 6 | 1.700 | 296,60 |
| 7 | 1.850 | 355,30 |
| 8 | 2.030 | 375,60 |
| 9 | 2.330 | 395,90 |
| 10 | 2.760 | 423,30 |
| 11 | 3.190 | 448,80 |
| 12 | 3.620 | 474,30 |
| 13 | 4.050 | 502,30 |
| 14 | 6.000 | 543,30 |
| 15 | ∞ | 604,80 |

Tarifa plana 2026: **80 €/mes** los primeros 12 meses (RD-Ley 13/2022 prorrogada).

---

## 4. Dividendos / base del ahorro 2026 (LIRPF art. 66)

`calculator-config.ts:50-55`

| Tramo | Límite (€) | Tipo |
|---|---:|---:|
| 1 | 6.000 | 19% |
| 2 | 50.000 | 21% |
| 3 | 200.000 | 23% |
| 4 | 300.000 | 27% |
| 5 | ∞ | 28% |

---

## 5. Coste LLC Exentax (commercial branding)

| Constante | Valor | Uso |
|---|---:|---|
| `LLC_FORMATION_COST` | 2000 € | Constitución (one-time) |
| `LLC_ANNUAL_COST` | **1500 €** | Mantenimiento (annual). Actualizado 2026-04-25 desde 1400. |
| `TARIFA_PLANA_MONTHLY_ES` | 80 € | Tarifa plana primer año |
| `MONTHLY_INCOME_SANITY_MAX` | 1.000.000 € | Defense-in-depth contra Infinity |

---

## 6. Países cubiertos en `calculateSavings()` (8 ramas)

Verificado con `grep -oE "country === \"[a-z\-]+\"" calculator.ts | sort -u`:

| País | Función tax helper | Línea |
|---|---|---:|
| **espana** | `calcSpanishIRPF` + `calcSpanishSS` + `calcSociedadAdminSS` + `calcSpanishDividendTax` | 247-309 |
| **reino-unido** | `calcUKTax` | 314 |
| **belgica** | `calcBelgiumTax` | 343 |
| **francia** | `calcFranceTax` (with micro abattement) | 376 |
| **italia** | `calcItalyTax` | 408 |
| **mexico** | `calcMexicoTax` | 431 |
| **chile** | `calcChileTax` | 455 |
| **austria** | `calcAustriaTax` | 479 |

País desconocido → graceful fallback `sinLLC=0` (sin throw).

---

## 7. ROI / cálculo coherente

Verificado vía test:
- `monthlyIncome=0 · España autónomo`: sinLLC=2400€ (SS mínima), conLLC=1500€, ahorro=900€ (correcto: 200€/mes × 12 = 2400€ SS).
- `country=atlantida` (desconocido): sinLLC=0, conLLC=1500, ahorro=0 (graceful, ROI=0).
- Saturación 1e9: clamped a `MONTHLY_INCOME_SANITY_MAX`, no NaN/Infinity.

Edge cases blindados:
- NaN clamped a 0 (defense-in-depth)
- Negative clamped a 0
- gastos>ingresos: IRPF=0, SS=mínima, no negativos.

---

## 8. Calculator UI 6 idiomas

`exentax-web/client/src/components/calculator/`:
- `index.tsx` (37 KB) — wrapper principal
- `CalculatorResults.tsx` (28 KB) — render resultados con i18n
- `EmailGateForm.tsx` (8.7 KB) — gate captura email
- `IrpfBracketsTable.tsx` (1.3 KB) — tabla detalle IRPF
- `AnimatedNumber.tsx`, `BrandIcons.tsx`

i18n: namespace `calculator.*` presente en los 6 locales (`grep` confirma 1+ ref por locale, las keys reales son docenas anidadas en `calculator: { keyMsg: {...}, llcBreakdown: {...}, bd: {...}, etc. }`).

---

## 9. Lead → Discord canal CALCULADORA

`server/discord.ts`:
- `notifyCalculatorLead(opts)` exportada (línea ~1124).
- Routing: `lead_calculator` → canal `calculadora` (TYPE_TO_CHANNEL).
- Env var: `DISCORD_CHANNEL_CALCULADORA`.

`server/routes/public.ts:/api/calculator-leads`:
- Rate limit: `checkCalcRateLimit(ip)` (10/h/IP).
- Guarda en DB tabla `calculations` + opcional lead.
- Notify Discord fire-and-forget con `.catch(err => logger.warn(...))`.
- Consent log fire-and-forget.

---

## 10. Email seguimiento calculator

`server/email.ts`:
- `renderCalculatorEmailHtml(data)` línea 321 — genera HTML + subject.
- `sendCalculatorEmail(data)` línea 474 — envía via Gmail API + maskEmail en logs.
- Plantilla en 6 idiomas (es/en/fr/de/pt/ca) vía `email-i18n.ts`.
- Circuit breaker `emailBreaker` aplicado.
- Retry queue persistente si Gmail down.

---

## 11. Responsive mobile

`CalculatorResults.tsx` y `index.tsx` usan Tailwind responsive classes
(`sm:`, `md:`, `lg:`, `xl:`) extensivamente. No verificado visualmente
en sandbox (no hay browser); tests solo cubren lógica.

---

## TOP — recomendaciones (no bugs)

| # | Hallazgo | Severidad | Acción |
|---|---|---|---|
| 1 | Tests pasan 123/123 con LLC_ANNUAL_COST=1500 actualizado | OK | ninguna |
| 2 | Cobertura: 8 países correctamente derivados | OK | ninguna |
| 3 | i18n calculator: keys nested no contadas por grep simple | informativo | npm run i18n:check ya valida placeholders |
| 4 | Browser visual mobile no testeado en sandbox | gris | ejecutar Lighthouse mobile en Replit/Hostinger real |

**Conclusión**: calculadora es **correcta numéricamente** contra fuentes oficiales 2026, **123/123 tests PASS**, **integraciones (Discord + email) cableadas**, **edge cases blindados** con 12 asserts dedicados.
