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
| `COUNTRY_VAT_RATES` | IVA estándar por residencia |
| `LLC_*` | Coste setup, IRPF/SS aplicables al residente español |
| `IRPF_BRACKETS_ES` | Tramos estatales + autonómicos 2025 |
| `UK_INCOME_TAX_BRACKETS` / `UK_NIC_*` | HMRC bands + Class 4 NIC 2025/26 |
| `BE_PERSONAL_INCOME_BRACKETS` | Federales BE + comunal aproximado |
| `FR_PARTS_BRACKETS` | Quotient familial 2025 |
| `IT_IRPEF_BRACKETS` / `IT_FORFETTARIO_*` | IRPEF + forfettario 5/15 % |
| `MX_ISR_*` / `MX_RESICO_*` | Tablas mensuales SAT 2025 |
| `CL_GLOBAL_COMPLEMENTARIO` | Tramos UTA proyectados 2025 |
| `AT_INCOME_TAX_BRACKETS` | ESt 2025 + KöSt 23 % |

Cada bloque está acompañado por un `// SOURCE:` con URL oficial y fecha
de última verificación.

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
npm run test:calculator   # 107/107 aserciones
npm run check             # tsc + lint + i18n + SEO + tests E2E
```

Cobertura del runner de calculator:
- Para cada país × régimen: breakdown no vacío, conLLC > 0, sinLLC > 0,
  effectiveRate ∈ [0, 1].
- `computeAllStructures`: best ∈ {autonomo, sociedad, llc} y deltas
  finitos.
- Inputs degenerados (`NaN`, `Infinity`, negativos, país inexistente):
  todos los outputs finitos.

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
