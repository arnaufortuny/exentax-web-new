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
