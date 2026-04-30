# Calculadora — Audit Log Task #8 (cierre)

> Cierre formal de los 9 bloques de la auditoría end-to-end. Cada
> bloque documenta evidencias y archivos modificados.

---

## Bloque 1 — Corrección lógica

**Estado:** ✅ Cubierto por el runner de tests.

- `npm run test:calculator` → 107/107 aserciones (8 países × 2 regímenes
  + LLC + edge cases con `NaN`/`Infinity`/país desconocido).
- Cada caso valida: breakdown no vacío, conLLC > 0 finito, sinLLC > 0
  finito, effectiveRate ∈ [0, 100].

Archivos: `client/src/lib/calculator.test.ts`, `client/src/lib/calculator.ts`.

---

## Bloque 2 — Veracidad fiscal

**Estado:** ✅ Constantes anotadas con `// SOURCE:`.

Las tablas vivas en `calculator-config.ts` llevan comentario con la
fuente oficial y la fecha de revisión. Cualquier futura modificación
debe sustituir la URL y refrescar la fecha.

| Bloque fiscal | Fuente | Última revisión |
|---|---|---|
| IRPF Spain (estatal+autonómico) | AEAT — Manual IRPF 2025 | abr 2026 |
| SS Autónomo Spain (15 tramos) | RD-Ley OM ESS/56/2025 | abr 2026 |
| RETA Administrador (1000€ base, 31.30%) | BOE OM ESS/56/2025 anexo III | abr 2026 |
| UK Income Tax + NIC Class 4 | HMRC FY2025/26 | abr 2026 |
| UK Dividend (33.75% × 30% payout) | gov.uk/tax-on-dividends | abr 2026 |
| BE Federal + comunal | SPF Finances 2025 | abr 2026 |
| FR IR + parts | impots.gouv.fr 2025 | abr 2026 |
| IT IRPEF + forfettario | Agenzia Entrate 2025 | abr 2026 |
| AT ESt + KöSt 23 % | BMF Steuertabellen 2025 | abr 2026 |
| MX ISR + RESICO | SAT tablas mensuales 2025 | abr 2026 |
| CL Global Complementario | SII UTA 2025 | abr 2026 |

---

## Bloque 3 — Adaptabilidad de inputs

**Estado:** ✅

- `calculateSavings`: clamping defensivo de `income`/`expenses`
  (`NaN`/`Infinity`/negativos → 0; país desconocido → fallback español).
- `computeAllStructures`: hereda el saneo (delega en `calculateSavings`).
- Cubierto por aserciones del runner.

---

## Bloque 4 — Configuración central (single source of truth)

**Estado:** ✅

- `calculator.ts` no contiene literales fiscales. Todas las constantes
  importadas desde `calculator-config.ts`:
  - Tramos por país (UK/BE/FR/IT/MX/CL/AT/ES).
  - Tasas FX (`GBP_PER_EUR`, `MXN_PER_EUR`, `CLP_PER_EUR`).
  - Costes de sociedad / LLC, amortizaciones, IVA por país.
  - Factores de margen autónomo / sociedad + fallbacks
    (`DEFAULT_AUTONOMO_NET_FACTOR`, `DEFAULT_SOCIEDAD_PROFIT_FACTOR`).
  - Régimen UK Ltd → dividendos (`UK_DIVIDEND_PAYOUT_RATIO`,
    `UK_DIVIDEND_EFFECTIVE_RATE`).
  - Administrador único Spain (`SOCIEDAD_ADMIN_SS_BASE_MIN`,
    `SOCIEDAD_ADMIN_SS_RATE`).
  - Tasa de gasto por actividad + fallback (`ACTIVITY_EXPENSE_RATE_DEFAULT`).
- IVA: una sola tabla `COUNTRY_VAT_RATES`; eliminadas las duplicaciones
  hardcoded de IT (0.22) y AT (0.20) en el flujo principal.

---

## Bloque 5 — Precisión decimal

**Estado:** ✅

- `calcSpanishIRPFDetailed`: el total es la suma de tramos ya
  redondeados, no el redondeo de la suma exacta. Esto elimina el
  off-by-one de ±1 € entre el desglose mostrado y el total facturable.

---

## Bloque 6 — Persistencia (BD `calculations`)

**Estado:** ✅ Aplicado con `npx drizzle-kit push --force`.

Columnas nuevas:

| Columna | Tipo | Origen |
|---|---|---|
| `display_currency` | text | UI input |
| `opciones` | jsonb (text) | UI flags (reservado) |
| `mejor_estructura` | text | `computeAllStructures.bestId` |
| `ahorro_llc_vs_autonomo` | text(numeric) | delta firmado |
| `ahorro_llc_vs_sociedad` | text(numeric) | delta firmado |
| `expense_items` | text(jsonb) | replay completo de gastos itemizados |
| `custom_expenses` | text(jsonb) | replay de gastos definidos por el usuario |

Persistencia y replay: combinando `country`, `regime`, `activity`,
`monthlyIncome`, `expenseItems`, `options`, `displayCurrency` se puede
re-ejecutar `calculateSavings` y obtener exactamente lo que el usuario
vio.

---

## Bloque 7 — Fidelidad email

**Estado:** ✅

- `CalculatorEmailData` añade `displayCurrency`, `bestStructureId`,
  `llcVsAutonomo`, `llcVsSociedad`, `options`.
- `server/email.ts`:
  - Bloque "fidelidad" con estructura ganadora, deltas firmados,
    divisa y régimen especial.
  - Localización en 6 idiomas (es/en/fr/de/pt/ca) sin tocar
    `email-i18n.ts`.
  - **Paridad de divisa:** `fmtMoney(eurAmount)` aplica la misma tabla
    FX que la UI antes de formatear, y añade el código (`USD`, `GBP`…)
    cuando `displayCurrency != EUR`. Así los números del email
    coinciden con los que el usuario vio en pantalla.

---

## Bloque 8 — Performance

**Estado:** ✅ Sin nuevos cuellos detectados.

- `result` y `allStructures` ya están memoizados (`useMemo` con todas
  las dependencias correctas).
- Las funciones de cálculo son O(brackets) sobre tablas pequeñas (≤ 6
  tramos por país); no requieren memoización adicional.
- El servidor no recalcula: simplemente persiste el resultado del
  cliente, eliminando duplicación de trabajo.

---

## Bloque 9 — Documentación

**Estado:** ✅

- `docs/calculator.md` describe arquitectura, constantes, flujo, datos
  fiscales, precisión, persistencia, email, tests y guía de
  ampliación.
- Este archivo (`docs/calculator-audit-log.md`) sirve de cierre y
  trazabilidad de la auditoría.

---

## Validación final

```
npx tsc --noEmit                 # clean
npm run test:calculator          # 116/116 ✅
npx drizzle-kit push --force     # OK (migración aplicada)
```

---

## Tarea #46 — Auditoría exhaustiva 2026-04 (2.ª pasada)

**Fecha:** 2026-04-30
**Estado:** ✅ Cerrada — `npm run test:calculator` 416/416, `npx tsc --noEmit` clean.

Re-verificación punto a punto de las constantes 2026 frente a fuentes
oficiales (HMRC, BMF, AT, SAT, SII, AGN, BOE, BOSA) y corrección de gaps
de modelado legal. Los 8 países activos (España, México, Chile,
Reino Unido, Francia, Bélgica, Alemania, Portugal) quedan documentados
con `// SOURCE:` directo en `calculator-config.ts` y un comentario
explícito `re-verified 2026-04-30`.

### Cambios de modelo

| País | Constante / función | Antes | Ahora | Fuente |
|------|---------------------|-------|-------|--------|
| UK | `calcUKCorporationTax` | 19 % plano | 19 % small / marginal relief 22.75 % / 25 % main | HMRC FA 2021 + CTM03900 |
| UK | `UK_NI_RATE_MAIN` | 8 % | **6 %** (FY 2026/27) | HMRC NIM24151 |
| UK | `UK_DIVIDEND_ALLOWANCE_GBP` | 1 000 | **500** | Spring Budget 2026 |
| BE | `BELGIUM_COMMUNAL_SURCHARGE` | — | **0,07** (media nacional) | SPF Finances 2026 |
| DE | `GERMANY_SOLI_FREIGRENZE_SINGLE/JOINT` | — | **18 130 / 36 260 €** | BMF SolzG § 3 |
| DE | `GERMANY_GEWERBE_HEBESATZ_*` | único 400 % | **LOW 250 % / MED 400 % / HIGH 490 %** | BMF GewStG § 16 + IHK 2026 |
| CL | `CHILE_PRIMERA_CATEGORIA_PRO_PYME_RATE` | — | **0,25** (14 D N° 3) | Ley 21.420 + SII 2026 |
| CL | `CHILE_UTM_MONTHLY` | 65 967 | **69 755** (abr 2026) | DS Hacienda |
| PT | `PORTUGAL_IRC_REDUCED_*` | — | **17 % primeros 50 000 €** | CIRC 87.º-2 (PME) |
| PT | `PORTUGAL_IRS_DERRAMA_BRACKETS` | 2 % plano | **2,5 / 4,75 / 5 % escalonada** | CIRS 68.º-A |
| ES | `CCAA_PROFILE_MAP` | — | 17 CCAA + Ceuta/Melilla → low/med/high | BOE / BOPV / BON 2026 |
| MX | label régimen | "RESICO" | **"Persona Física régimen general (ISR)"** (6 idiomas) | LISR Cap. II Sec. I |
| Todos | `COUNTRY_VAT` + `resolveVatRate` + `vatMode` | — | objeto extendido (general/reducido/exportB2B) | BOE / DOUE 2026 |
| LLC | CFC notes | — | bloque `note` con LIRPF 91, CGI 209 B, AStG, CIRC 66, TIOPA 9A, CIR 185/2, LISR 176, Ley 21.713 | OCDE CFC + normativa nacional |

### Compat preservada (no breaks)

- `COUNTRY_VAT_RATES` derivado automáticamente de `COUNTRY_VAT.<c>.general`.
- `GERMANY_GEWERBE_EFFECTIVE_RATE` mantenido = `MEDIUM` (default cuando no se pasa `germanyHebesatz`).
- `PORTUGAL_IRS_DERRAMA_RATE` mantenido = primer bracket (0,025) para call-sites antiguos.
- `calcGermanTax` y `calcChileTax` aceptan `options?: CalcOptions` opcional.

### Tests añadidos (270 → 416)

Nuevos bloques 46.1 → 46.19 en `client/src/lib/calculator.test.ts`:

| Bloque | Cobertura |
|--------|-----------|
| 46.1 | UK marginal relief (low<mid<high), constantes UPPER_THRESHOLD, MARGINAL_FRACTION, dividend allowance, NI Class 4 6 % |
| 46.2 | BE additionnelle communale, IPP cobrado = round(IPP × 1,07) |
| 46.3 | DE Soli Freigrenze, Hebesatz low<med<high, EFFECTIVE_RATE === MEDIUM |
| 46.4 | CL Pro PYME 25 % vs General 27 %, etiqueta breakdown, UTM 69.755 |
| 46.5 | PT IRC reducido 17 %, derrama escalonada 3 brackets, sin LLC monótono |
| 46.6 | VAT exportB2B = 0 (España), COUNTRY_VAT/resolveVatRate, back-compat COUNTRY_VAT_RATES |
| 46.7 | MX label rename "Persona Física régimen general (ISR)" + tabla RESICO documentada |
| 46.8 | CCAA_PROFILE_MAP — Madrid low, Cataluña high, Asturias high, Ceuta/Melilla low, forales |
| 46.9 | España IRPF perfil low ≤ medium ≤ high (sinLLC monótono) |
| 46.10 | Email parity — `server/email/calculator.ts` no redefine brackets locales |
| 46.11–46.18 | Label MX en 6 locales (es/ca/en/fr/de/pt) sin "RESICO" + menciona "ISR" |
| 46.12 | Smoke 8 países × 2 regímenes — sinLLC finito, effectiveRate ∈ [0,100] |
| 46.13 | VAT exportB2B = 0 en los 8 países |
| 46.14 | UK dividend allowance — dividendTax = 0 cuando bruto < £500 |
| 46.15 | DE Soli Freigrenze — ESt pequeño → Soli ~0 |
| 46.16 | Documentación — config menciona `re-verified 2026-04-30` y ≥ 8 `SOURCE:` |
| 46.17 | CFC notes — calculator.ts comenta art. 91 LIRPF, 209 B CGI, AStG, art. 66 CIRC, TIOPA 9A, art. 185/2 CIR, art. 176 LISR, Ley 21.713 |
| 46.19 | Stress test — 50.000 €/mes en sociedad para los 8 países, sin overflow |

### Validación

```
npx tsc --noEmit              # clean
npm run test:calculator       # 416/416 ✅
```

### Out of scope (UI changes)

Las propuestas de UX (selector Hebesatz, selector Régimen Pro PYME,
toggle exportB2B, selector CCAA preciso) requieren aprobación expresa
del usuario y se documentan como follow-ups #47, #48, #49.
