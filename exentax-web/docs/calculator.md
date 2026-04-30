# Calculadora fiscal — Documentación técnica

> Auditoría 9 dimensiones (Task #8 · abril 2026). Esta es la **fuente única
> de verdad** sobre cómo funciona la calculadora de Exentax. Si tocas la
> lógica, los datos fiscales o el flujo de leads, **actualiza este
> documento al mismo tiempo**.

---

## 1. Arquitectura

```
client/src/components/calculator/index.tsx   ← UI + envío del lead
        │
        ├── client/src/lib/calculator.ts          ← lógica de cálculo (puro)
        ├── client/src/lib/calculator-config.ts   ← constantes fiscales
        └── client/src/lib/calculator.test.ts     ← 107 aserciones
        │
        ▼  POST /api/calculator-leads
server/routes/public.ts                       ← validación Zod + insert
        │
        ├── shared/schema.ts          ← tabla `calculations` (Drizzle)
        ├── shared/email.ts           ← contrato CalculatorEmailData
        └── server/email.ts           ← render HTML del email
```

Reglas inviolables:

1. La lógica de cálculo **solo** vive en `client/src/lib/calculator.ts`.
   El servidor nunca recalcula; recibe el resultado del cliente y lo
   persiste tal cual. Esto preserva la coherencia entre lo que el
   usuario ve, lo que se guarda en BD y lo que recibe por email.
2. Cualquier número fiscal (tramo, tipo, cuota, costes) se importa de
   `calculator-config.ts`. Está prohibido literal mágico en `calculator.ts`.
3. Cada modificación de tramos requiere una entrada en
   `docs/audits/calculator-fidelity-log.md` con la fuente oficial.

---

## 2. Constantes centralizadas (`calculator-config.ts`)

| Constante | Cobertura |
|---|---|
| `SOCIEDAD_COSTS` | Coste anual de gestión por país (sociedad local) |
| `MONTHLY_INCOME` | Min/max/step del slider de ingresos |
| `AMORTIZATION` | Vida útil contable de cada tipo de gasto |
| `DISPLAY_CURRENCIES` | Catálogo de divisas + tasa orientativa vs EUR |
| `COUNTRY_VAT` / `COUNTRY_VAT_RATES` / `resolveVatRate` | IVA `general / reducido / exportB2B` por residencia |
| `LLC_*` | Coste setup, IRPF/SS aplicables al residente español |
| `IRPF_BRACKETS_ES` + `CCAA_PROFILE_MAP` | Tramos estatales + autonómicos 2026 + perfil low/medium/high por CCAA |
| `UK_*` (`CT_UPPER_THRESHOLD`, `CT_MARGINAL_FRACTION`, `DIVIDEND_ALLOWANCE_GBP`, `NI_RATE_MAIN 6 %`) | HMRC bands + Class 4 NIC FY 2026/27 + marginal relief 19/22.75/25 % |
| `BELGIUM_IPP_BRACKETS` + `BELGIUM_COMMUNAL_SURCHARGE 0.07` | IPP federal + additionnelle communale media |
| `FR_PARTS_BRACKETS` + flag `franceMicro` | Quotient familial 2026 + abattement micro 50 % BNC |
| `GERMANY_*` (`SOLI_FREIGRENZE_SINGLE/JOINT`, `GEWERBE_HEBESATZ_LOW/MED/HIGH`) | Soli Freigrenze + Gewerbesteuer rangos seleccionables |
| `MEXICO_ISR_*` / `MEXICO_RESICO_BRACKETS` | Tablas SAT 2025 (PF general aplicado; RESICO documentado) |
| `CHILE_GLOBAL_COMPLEMENTARIO_*` + `CHILE_UTM_MONTHLY 69 755` + `CHILE_PRIMERA_CATEGORIA_*` | Tramos UTA proyectados 2026 + Régimen General 27 % / Pro PYME 14 D 25 % |
| `PORTUGAL_*` (`IRC_RATE 0.20`, `IRC_REDUCED_RATE 0.17`, `IRS_DERRAMA_BRACKETS`) | IRC PME 17 % primeros 50 000 € + derrama estadual escalonada |

Cada bloque está acompañado por un `// SOURCE:` con URL oficial y fecha
de última verificación. La revisión 2026-04-30 (Tarea #46) actualiza
los 8 países activos contra HMRC, BMF, AT, SAT, SII, AGN, BOE y BOSA y
añade el comentario marcador `re-verified 2026-04-30` para trazar la
2.ª pasada de auditoría.

---

## 3. Flujo de cálculo

1. UI captura `country`, `regime`, `activity`, `income (EUR/mes)`,
   `expenses` o `expenseItems`.
2. `calculateSavings(...)` devuelve `{ sinLLC, conLLC, ahorro,
   effectiveRate, breakdown, localLabel, gastosDeducibles }`.
3. `computeAllStructures(...)` añade el comparador a tres bandas
   (autónomo / sociedad local / LLC US) y expone:
   - `bestId` — estructura ganadora.
   - `llcSavingsVsAutonomo` (signed, EUR/año).
   - `llcSavingsVsSociedad` (signed, EUR/año).
4. `displayCurrency` se aplica solo a la **presentación**; los cálculos
   internos siempre operan en EUR para evitar drift de FX.

### Robustez de inputs (Bloque 3 ✅)

`calculateSavings` aplica clamping defensivo a `income` y `expenses`:
- `NaN`/`Infinity` → 0
- Negativos → 0
- País desconocido → fallback español (`autonomo`)
`computeAllStructures` hereda el saneo porque delega en
`calculateSavings`.

### Precisión decimal (Bloque 5 ✅)

El subtotal IRPF se calcula como **suma de tramos redondeados**, no
redondeando al final. Esto evita off-by-one cuando la cuota total se
desglosa en el email/UI:

```ts
// Antes:  total = round(sumExacto)
// Ahora:  total = sum(brackets.map(b => round(b.amount)))
```

---

## 4. Persistencia (tabla `calculations`)

La tabla añade 5 columnas nuevas (Bloque 6 ✅):

| Columna | Tipo | Significado |
|---|---|---|
| `display_currency` | text | Divisa elegida en la UI (EUR por defecto) |
| `opciones` | jsonb | `{ tarifaPlana?, franceMicro? }` — reservado: la UI todavía no expone los toggles, pero la columna y el render del email ya están listos para cuando se añadan |
| `mejor_estructura` | text | `autonomo` \| `sociedad` \| `llc` |
| `ahorro_llc_vs_autonomo` | numeric | Delta firmado vs autónomo |
| `ahorro_llc_vs_sociedad` | numeric | Delta firmado vs sociedad local |

Migración aplicada con `npx drizzle-kit push --force`.

---

## 5. Fidelidad del email (Bloque 7 ✅)

`CalculatorEmailData` (en `shared/email.ts`) replica los nuevos campos.
`server/email.ts` añade un bloque "fidelidad" tras el panel de diferencia
que muestra:

- Estructura ganadora (autónomo / sociedad local / LLC US).
- Delta firmado LLC vs autónomo y vs sociedad local.
- Divisa de visualización si distinta de EUR.
- Régimen especial (tarifa plana, micro-entrepreneur) cuando aplique.

Los textos están localizados en 6 idiomas (es/en/fr/de/pt/ca) mediante
un mapa inline en `email.ts`, sin alterar `email-i18n.ts`.

---

## 6. Tests

```bash
npm run test:calculator   # 245/245 aserciones (Task #17, abr 2026 deep audit)
npm run check             # tsc + lint + i18n + SEO + tests E2E
```

Cobertura del runner de calculator:
- 4 presets internacionales (digital, consultor, ecommerce, B2B) × invariante
  `bestId === "llc"` en España.
- 4 escenarios "LLC no gana" (L1–L4 en `docs/calculator-cases.md`).
- 16 escenarios realistas (Task #17): 8 países, ambos regímenes, tarifa
  plana, France micro, perfiles CCAA low/medium/high, mix itemizado
  (asesoría · vehículo · home office · contratistas). Todas las
  actividades usan claves reales de `CALC_ACTIVITY_KEYS` (auditado
  abr-2026: el escenario 04 usa `consultingAdvisory`, el 05
  `marketingAdvertising`, etc; las claves cortas tipo `consulting`
  caían silenciosamente al `ACTIVITY_EXPENSE_RATE_DEFAULT`).
- Por cada escenario: totales finitos ≥ 0, breakdown no vacío,
  `effectiveRate ∈ [0, 100]`, `bestId === argmin(totalAnnualCost)` y
  signos de `llcSavingsVs*` consistentes con `local − llc`.
- Para cada país × régimen: breakdown no vacío, conLLC > 0, sinLLC > 0.
- `computeAllStructures`: best ∈ {autonomo, sociedad, llc} y deltas
  finitos.
- Inputs degenerados (`NaN`, `Infinity`, negativos, país inexistente):
  todos los outputs finitos.
- Veracidad numérica blindada (5 invariantes):
  - Cuota tarifa plana = 960 €/año exacto.
  - SS admin único España = 1.000 € × 31,30 % × 12 = 3.756 €/año.
  - **IRPF total = Σ(brackets[].taxInBracket)** (precisión Bloque 5,
    fix Q2-2026 — antes había drift de ±1 € entre el headline y la
    tabla por tramo del UI).
  - **Modelo de deducibles aditivo** (España): `gastosDeducibles =
    annual × ACTIVITY_EXPENSE_RATE[a] + Σ(items)`.
  - **`SPAIN_SOCIEDAD_ADMIN_PROFIT_SHARE` (0,25)** se aplica: a 12.000
    €/mes el SS admin > 3.756 € (mínima), confirmando que la share
    del 25 % del beneficio se asigna como salario admin.

---

## 8. Gastos deducibles por país

`calculator.ts` modela la deducibilidad en dos planos:

1. **Tasa de actividad (`ACTIVITY_EXPENSE_RATE`)** — `% de ingreso bruto`
   tratado como gasto operativo de baseline cuando la persona usuaria
   no proporciona items concretos. Calibrada a márgenes típicos de cada
   actividad digital (ver `calculator-config.ts`).
2. **Items deducibles (`expenseItems`)** — gastos itemizados con
   `deductPct` (0–100) y `category` (software, hosting, asesoría,
   marketing, vehículo, home office, etc). El total deducible se calcula
   con `calcDeductibleTotal` aplicando el `deductPct` del item y, en
   España, los overrides de `COUNTRY_EXPENSE_OVERRIDES` (vehículo 50 %
   por defecto, teléfono 50 %, restaurantes 100 % con tope, etc).

| País | Override notable | Justificación |
|---|---|---|
| España | Vehículo 50 % · Teléfono 50 % · Restaurantes 100 % con tope | Doctrina AEAT — uso mixto |
| México | Vehículo 100 % · Restaurantes 8,5 % | LISR art. 28 |
| Chile | Vehículo 100 % cuando es activo | DL 824 |
| Reino Unido | Home office £6/sem flat o proporcional · Vehículo 45p/milla | HMRC simplified expenses |
| Francia | Frais réels o forfait BNC 34 % | art. 102 ter CGI |
| Bélgica | Frais professionnels o forfait 30 % | Code IR art. 51 |
| Italia | Forfettario 78 % deducible automático · ordinario 100 % | Agenzia Entrate |
| Austria | Betriebsausgaben 100 % con justificantes | EStG §4 |

### Gastos NO deducibles (transversales)

`NON_DEDUCTIBLE_INFO` en `calculator.ts` documenta categorías nunca
deducibles en los 8 países cubiertos:

- Gastos personales del titular (ropa no profesional, ocio).
- Multas y sanciones administrativas.
- Entretenimiento sin nexo profesional documentado.
- Distribuciones de dividendos / repartos a socios.

> **Importante (asimetría documentada).** La tasa de actividad
> (`ACTIVITY_EXPENSE_RATE`) se aplica **además** de los items, no en
> lugar de ellos: `totalGastosDeducibles = annual × rate + items`.
> El comportamiento está blindado por tests de presets y escenarios
> realistas (`veracidad[deducibles]`).
>
> El modelo TIENE una asimetría intencional entre España y el resto:
>
> - **España**: el cálculo del autónomo usa `totalGastosDeducibles`
>   (rate + items) para reducir la base IRPF/SS.
> - **Resto de países (UK · BE · FR · IT · AT · MX · CL)**: el cálculo
>   interno del autónomo descuenta SOLO los items y luego aplica
>   `AUTONOMO_NET_FACTORS` (0,78–0,80) como proxy implícita de gastos
>   no itemizados. Aplicar también la baseline `rate × annual` aquí
>   produciría doble conteo con el factor.
>
> El campo público `gastosDeducibles` (usado por la rama LLC en los 8
> países y por el desglose del UI) sigue el modelo aditivo en TODOS los
> países por consistencia con `computeAllStructures`. Esto significa
> que para los 7 países no-España la rama LLC descuenta más gastos que
> la rama autónomo, lo que sesga ligeramente la comparación a favor de
> la LLC. Es un trade-off conocido: corregirlo exige recalibrar los
> `AUTONOMO_NET_FACTORS` país a país, trabajo dejado como follow-up
> #34. La asimetría está blindada por el test
> `veracidad[deducibles] Italia gastosDeducibles aplica modelo aditivo
> (= España)` para que cualquier refactor que rompa la simetría del
> campo público falle ruidosamente.

---

## 7. Cómo añadir un país

1. Añadir constantes fiscales a `calculator-config.ts` con `// SOURCE:`.
2. Crear función `calc<País>...` en `calculator.ts` usando esas
   constantes.
3. Conectarla dentro del `switch (country)` de `calculateSavings` y
   `computeAllStructures`.
4. Añadir caso al test (`calculator.test.ts`) y al diccionario de
   labels en `localLabel`.
5. Registrar el país en `docs/calculator-cases.md`.
6. Ejecutar `npm run test:calculator && npx tsc --noEmit`.
