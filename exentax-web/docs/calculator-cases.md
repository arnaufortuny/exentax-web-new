# Calculadora — Casos de prueba manuales

**Última revisión:** 2026-04 (overhaul) · Ejercicio fiscal de referencia: **2025**

## Cambios 2026-04 (Task #10 — overhaul)

- **Costes LLC actualizados:** setup 2.000 € (antes 799 €), mantenimiento
  1.500 €/año (antes 1.099 €). Constantes exportadas como
  `LLC_FORMATION_COST` y `LLC_ANNUAL_COST` en `lib/calculator.ts` para que
  cualquier sitio que las use viva en una única fuente de verdad.
- **Comparativa de 3 estructuras** (`calculateAllStructures`): autónomo vs.
  sociedad local vs. LLC USA, con tabla lado a lado, gráfico de barras y
  veredicto honesto cuando la LLC NO es la opción más barata.
- **Divisa de visualización separada del país** (`DISPLAY_CURRENCIES`,
  `convertFromEUR`): el usuario elige EUR/USD/GBP/MXN/CLP independientemente
  del país de cálculo. Cálculo siempre interno en EUR; conversión sólo para
  visualización con tasas estáticas (fallback) — la app declara que no son
  datos de mercado en vivo.
- **Presets de caso de uso** (`CALCULATOR_PRESETS`): freelancer digital,
  consultor, ecommerce, SaaS, agencia. Precargan ingresos típicos + actividad.
- **Mensajes clave + advertencias transparentes** (`LLC_KEY_MESSAGES` y
  `MultiStructureResult.warnings`): se renderizan en `CalculatorResults`.

Esta tabla documenta escenarios reales con su resultado esperado para validar
manualmente la calculadora (`client/src/lib/calculator.ts`) tras cualquier
cambio. Las fuentes de los tramos están enlazadas al final.

> Todos los importes son **anuales en EUR**, redondeados al euro.
> "Ahorro" = `sinLLC − conLLC` con suelo en 0 (la calculadora nunca devuelve
> ahorros negativos: si la LLC sale más cara, se muestra 0 y se invita a
> revisar el escenario).

## Convenciones de validación

- **Sin NaN, sin Infinity, sin valores vacíos.** Cualquier campo numérico que
  reciba `""`, `0`, negativo o no numérico se trata como 0 (ingresos/gastos).
- **País obligatorio.** Sin país no se calcula; el resultado se muestra con
  ceros y la UI bloquea el envío del lead.
- **Régimen "sin régimen".** Se trata internamente como `autonomo` para
  estimar el coste actual, pero el `localLabel` lo refleja.
- **Comunidad autónoma.** No se desglosa por CCAA — se usa la **escala
  estatal + autonómica agregada por defecto** (suma de los tramos estatales
  publicados por la AEAT). Se documenta como "tramos 2025" en el resultado.
- **Disclaimer.** Cada resultado muestra `t("calculator.disclaimer")` —
  estimación orientativa, no asesoramiento fiscal vinculante.

## Escenarios

| # | País | Régimen | Ingresos mes | Gastos mes | Esperado (sinLLC) | Notas |
|---|------|---------|--------------|------------|-------------------|-------|
| 1 | España | autónomo | 2.000 € | 0 € | ~6.500 €/año | Tramo bajo: IRPF + cuota SS mínima reducida |
| 2 | España | autónomo | 5.000 € | 500 € | ~17.000 €/año | Tramo medio: IRPF 30–37 % + SS por base |
| 3 | España | autónomo | 10.000 € | 1.000 € | ~38.000 €/año | Tramo alto: marginal 45 % + SS cuota máxima |
| 4 | España | SL (sociedad) | 8.000 € | 800 € | ~28.000 €/año | IS 23 % + SS administrador + IRPF nómina + dividendos |
| 5 | México | autónomo | 4.000 € | 200 € | ~10.000 €/año | ISR persona física (SAT 2025) + IMSS estimado |
| 6 | Reino Unido | sole trader | 5.000 € | 400 € | ~14.000 €/año | Income Tax + NI Class 4, conversión GBP/EUR fija (estimación) |
| 7 | Italia | lavoratore autonomo | 3.500 € | 250 € | ~13.500 €/año | IRPEF 23/35/43 + INPS Gestione Separata 25,72 % |
| 8 | Francia | auto-entrepreneur | 4.500 € | 300 € | ~16.000 €/año | IR progresivo + cotisations URSSAF ~22 % |
| 9 | Edge: ingresos 0 | España autónomo | 0 € | 0 € | 0 € | Sin NaN, sin negativos, ahorro = 0 |
| 10 | Edge: gastos > ingresos | España autónomo | 1.000 € | 5.000 € | base = 0 → cuota SS mínima | No produce IRPF negativo |
| 11 | Edge: país no seleccionado | — | 5.000 € | 0 € | 0 € en todos los campos | Botón de envío deshabilitado en UI |

> Los importes son rangos esperados (±5 %) porque las divisas no oficiales
> (MXN, CLP, GBP) usan tipos de cambio aproximados estables, no datos de
> mercado en tiempo real. La calculadora lo declara explícitamente con la
> nota "para estimación, no datos de mercado en vivo".

## Comparativa de tres estructuras (revisión 2026-04)

La calculadora ahora calcula y muestra **siempre las tres estructuras**
(autónomo local · sociedad local · LLC USA) lado a lado, con coste anual
total = setup amortizado + coste fijo + impuestos. La estructura ganadora
se marca con punto verde y se calcula en `computeAllStructures()`.

### Costes fijos asumidos

Setup se amortiza a 3 años en `totalAnnualCost` para una comparación
honesta (de lo contrario el año 1 pena en exceso a sociedad y LLC).

| Estructura | Setup (único) | Coste fijo/año | Impuestos modelados |
|------------|---------------|----------------|---------------------|
| Autónomo local | 0 € | 0 € | IRPF/equivalente + SS local |
| Sociedad local | 500–2.000 € (según país) | 1.200–2.500 €/año (gestoría + cuentas anuales) | IS + dividendos + admin |
| **LLC USA (Exentax)** | **~2.000 €** | **~1.500 €** (Registered Agent + Forms 5472 + 1120) | **0 % federal US + IRPF residencia sobre beneficios (sin SS local)** |

Costes de sociedad por país (`SOCIEDAD_COSTS` en `calculator.ts`):

| País | Setup | Fijo/año |
|------|-------|----------|
| España | 1.500 € | 1.800 € |
| México | 1.200 € | 1.500 € |
| Chile | 1.200 € | 1.400 € |
| Reino Unido | 500 € | 1.200 € |
| Francia | 1.500 € | 2.000 € |
| Bélgica | 1.800 € | 2.200 € |
| Italia | 2.000 € | 2.500 € |
| Austria | 1.800 € | 2.200 € |

### Modelo fiscal de la LLC USA (importante)

La LLC USA con socio único no residente y sin actividad efectivamente
conectada (ECI) en EE.UU. paga **0 % federal**. Sin embargo, los
beneficios se atribuyen al socio y tributan como **renta personal en
su país de residencia**. La calculadora aplica `calcResidenceLLCTax()`
con los tramos progresivos del país, **excluyendo** la cotización de
seguridad social (la principal palanca de ahorro). Esto evita el
sesgo de mostrar 0 € de impuestos para la LLC y produce la decisión
"mejor estructura" honesta.

Asunción explícita: el ahorro real frente a autónomo viene principalmente
de evitar la cuota de seguridad social/cotizaciones obligatorias, no del
tipo marginal.

`llcSavingsVsAutonomo` y `llcSavingsVsSociedad` pueden ser **negativos**
(LLC más cara) — se muestran tal cual al usuario, sin clamping a 0.

> Los costes de la LLC se han ajustado según la propuesta comercial real
> de Exentax (~2.000 € de constitución incluyendo EIN, Operating Agreement,
> apertura bancaria; ~1.500 €/año de mantenimiento incluyendo Registered
> Agent, dirección comercial, contabilidad y formularios obligatorios
> 5472 + 1120 pro-forma).

## Casos en los que la LLC **no** es la opción más barata

La calculadora **debe ser honesta** y mostrar el aviso "En tu escenario,
la LLC no es la opción más barata" cuando `bestId !== "llc"`. Casos típicos
documentados:

| # | Perfil | País | Ingresos/mes | Estructura ganadora | Por qué |
|---|--------|------|--------------|---------------------|---------|
| L1 | Freelance principiante | España | 1.500 € | Autónomo (tarifa plana 80 €) | Volumen bajo: el setup + mantenimiento de la LLC no se amortiza |
| L2 | Profesional con clientes 100 % locales | España | 3.000 € | Autónomo / SL | Sin componente internacional: el ahorro USA no aplica de forma robusta |
| L3 | Pequeña SL ya existente | España | 4.000 € | SL local | Si el negocio ya está consolidado en local, el cambio puede no compensar el coste setup el primer año |
| L4 | Régimen muy favorable (auto-entrepreneur micro Francia <70 k€) | Francia | 4.000 € | Auto-entrepreneur | El régimen simplificado francés cobra ~22 % URSSAF total, difícilmente batible para volúmenes bajos |

En todos estos casos la UI debe mostrar:
1. Las tres barras correctamente rankeadas.
2. El badge "honesto: en tu caso, otra estructura puede ganar" en lugar
   del titular de ahorro.
3. El bloque amarillo `llc-not-best-warning` con texto explicando que
   la LLC brilla con servicios digitales / clientes internacionales.

## Casos donde la LLC USA **sí** es la opción óptima (presets cargados)

| Preset | Ingresos/mes | Gastos/mes (deducibles) | Perfil | Ahorro esperado |
|--------|--------------|-------------------------|--------|-----------------|
| `freelancer-digital` | 5.000 € | ~600 € | SaaS, software, contenido digital con clientes US/UE | 30–55 % |
| `consultor` | 8.000 € | ~1.200 € | Consultoría B2B internacional | 35–60 % |
| `ecommerce` | 12.000 € | ~3.500 € | Dropshipping / e-commerce internacional sin almacén US | 25–45 % |
| `b2b` | 15.000 € | ~2.000 € | Servicios B2B a empresas USA/UE | 40–65 % |

Los presets están definidos en `USE_CASE_PRESETS` (`calculator.ts`) y
precargan ingresos, gastos por categoría y país por defecto.

## Divisa de visualización

Desde 2026-04, la divisa **se separa del país de legislación**. El usuario
elige país (que determina el régimen fiscal) y, de forma independiente,
la divisa en la que quiere ver los importes (EUR / USD / MXN / CLP / GBP).

- **Cálculo siempre en EUR** internamente para evitar errores acumulados.
- Conversión a divisa de visualización mediante `convertFromEUR()` con
  tipos aproximados estables (`DISPLAY_CURRENCIES` en `calculator.ts`).
- La UI muestra la nota: "Conversión orientativa, no FX en tiempo real".

## Catálogo de gastos deducibles (revisión 2026-04)

El input de gastos se ha agrupado por categorías para guiar al usuario y
recordar lo que **sí** es deducible vs lo que **no** lo es:

**Deducibles** (con porcentaje orientativo):
- Tecnología y software (SaaS, dominios, hosting, equipos): 100 %
- Servicios profesionales (gestoría, asesores, abogados): 100 %
- Marketing y publicidad: 100 %
- Oficina y coworking: 100 %
- Comunicaciones (móvil/internet de uso mixto): 50 %
- Comisiones bancarias y de pasarelas: 100 %
- Seguros profesionales (RC, ciber): 100 %
- Formación y libros profesionales: 100 %
- Subcontratación / colaboradores: 100 %
- Viajes y dietas profesionales: 80 %
- Suministros del hogar (parte proporcional al despacho): 30 %
- Otros gastos justificados: 100 %

**No deducibles** (mostrados como nota informativa, no se restan):
- Comidas personales sin cliente.
- Ropa que no sea uniforme/EPI.
- Multas, sanciones y recargos.
- Gastos personales del titular o familia.
- IVA soportado (se gestiona aparte vía 303/390 en España).

## Disclaimer y veracidad

- Ninguna afirmación de "ahorro garantizado" o "ahorra hasta X %" sin base.
- El resultado se presenta como **estimación orientativa**.
- Cada bloque de breakdown lleva la fuente o nota (ej.: "Tramos AEAT 2025",
  "Personal Allowance £12.570", "INPS Gestione Separata 25,72 %").

## Fuentes oficiales del ejercicio 2025

- España (IRPF + IVA): [Agencia Tributaria — Tramos IRPF](https://sede.agenciatributaria.gob.es/), [BOE 2024 — Ley de Presupuestos]
- España (Seg. Social autónomos): [Tabla de cuotas RETA 2025 — Seg. Social](https://www.seg-social.es/)
- Reino Unido: [HMRC Income Tax rates and allowances 2025/26](https://www.gov.uk/income-tax-rates)
- Francia: [DGFiP — Barème de l'impôt sur le revenu 2025](https://www.impots.gouv.fr/)
- Italia: [Agenzia delle Entrate — Aliquote IRPEF 2025](https://www.agenziaentrate.gov.it/)
- Bélgica: [SPF Finances — Barèmes 2025](https://finances.belgium.be/)
- Austria: [BMF — Einkommensteuertarif 2025](https://www.bmf.gv.at/)
- México: [SAT — Tarifas ISR 2025](https://www.sat.gob.mx/)
- Chile: [SII — Tablas Global Complementario 2025](https://www.sii.cl/)

## Cobertura automatizada

Desde Task #14, `computeAllStructures()` está protegido por una suite de
tests unitarios en `client/src/lib/calculator.test.ts`, ejecutable con
`npm run test:calculator`. La trazabilidad entre los casos manuales
documentados arriba y los tests automatizados es la siguiente:

| Caso documentado | Test automatizado | Notas |
|------------------|-------------------|-------|
| Presets `freelancer-digital`, `consultor`, `ecommerce`, `b2b` | `preset[<id>] bestId === "llc"` (+ invariantes de coste y deltas) | Calculados contra España + `digitalServices`. |
| L1 — Freelance principiante (ES, tarifa plana) | `L1 — freelance principiante (España, 1.500€/mes, tarifa plana)` | **Modelado** (Task #20): `CalcOptions.tarifaPlana = true` aplica la cuota reducida 80€/mes del primer año. |
| L2 — Clientes 100% locales (ES, 3.000€) | `L2 — clientes locales bajo volumen (México, 1.000€/mes)` | **Proxy**: el modelo no distingue "geografía de clientes"; se usa MX 1.000€/mes para forzar `bestId === "autonomo"`. |
| L3 — Pequeña SL ya existente (ES, 4.000€) | `L3 — PN consolidada bajo volumen (Chile, 1.500€/mes)` | **Proxy**: el modelo no distingue "SL ya existente"; se usa CL 1.500€/mes (tramo exento Global Complementario). |
| L4 — Auto-entrepreneur micro (FR, 4.000€) | `L4 — régimen favorable (Francia, 4.000€/mes, micro)` | **Modelado** (Task #20): `CalcOptions.franceMicro = true` aplica abattement BNC 50% + URSSAF ~22% sobre CA bruto, y `calcResidenceLLCTax` añade prélèvements sociaux ~17,2% para residentes franceses. |
| Edge 9 — ingresos 0 | `edge[zero-income] *` | Verifica que las tres estructuras devuelven `totalAnnualCost ≥ 0` finito y `bestId` definido. |
| Edge 10 — gastos > ingresos | `edge[gastos>ingresos] *` | Verifica que IRPF colapsa a 0 (no negativo) y la SS aplica el tramo mínimo (200 €/mes · 2.400 €/año). |
| Edge 11 — país no seleccionado | `edge[unknown-country] *` | Verifica que `calculateSavings` devuelve `sinLLC === 0` con breakdown vacío y que `computeAllStructures` no lanza y produce totales finitos. |

Todos los casos L1–L4 verifican adicionalmente que
`llcSavingsVsAutonomo < 0` (sin clamping a 0), que es la condición
disparadora del bloque `llc-not-best-warning` en la UI.

### Regímenes especiales (`CalcOptions`, Task #20)

`computeAllStructures()` y `calculateSavings()` aceptan un objeto
`CalcOptions` opcional (último parámetro) para activar regímenes
fiscales reducidos:

| Flag | País | Efecto |
|------|------|--------|
| `tarifaPlana: true` | España (`autonomo`) | Sustituye la cuota RETA por 80 €/mes (RD-Ley 2023-2025) durante el primer año de alta. |
| `franceMicro: true` | Francia (`autonomo`) | Régimen micro auto-entrepreneur BNC services: abattement forfaitaire 50% antes del IR progresivo + URSSAF ~22% sobre el chiffre d'affaires, sin deducción de gastos reales. Si el CA bruto supera el plafond `FR_MICRO_CEILING_BNC` (77.700 € en 2025), el flag se ignora silenciosamente y el cálculo cae al régimen estándar. |

Adicionalmente, `calcResidenceLLCTax` para Francia añade siempre los
prélèvements sociaux franceses (~17,2% CSG+CRDS+solidarité) sobre los
beneficios atribuidos a un residente francés desde una LLC US disregarded.
Esto evita el sesgo de mostrar la LLC artificialmente barata frente al
régimen micro local.

## Procedimiento de revisión anual

1. En enero/febrero de cada año, contrastar tramos contra fuentes oficiales.
2. Actualizar los arrays `IRPF_BRACKETS`, `SS_AUTONOMO_BRACKETS_*` y los
   brackets de cada `calc<Country>Tax` en `client/src/lib/calculator.ts`.
3. Actualizar la fecha de "Última revisión" arriba.
4. Re-validar los escenarios 1–11.
