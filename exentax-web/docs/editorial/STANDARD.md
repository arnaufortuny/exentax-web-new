# STANDARD — Rúbrica editorial 2026

> Fuente única de verdad para la reescritura de los 111 artículos del blog Exentax.  
> Modelo de referencia: `client/src/data/blog-content/es/cuanto-cuesta-constituir-llc.ts` (Task #1, cerrado).

## 1. Test de conversión (no negociable)

Un artículo **PASA** sólo si la conclusión natural del lector al terminar es contactar a Exentax. Cualquier "tal vez" cuenta como FALLA. Los 7 criterios son:

| # | Criterio | Umbral medible |
|---|---|---|
| 1 | Gancho concreto en los primeros 100 palabras | Una cifra, un año, una pregunta o una objeción real (NO definición ni "En este artículo…") |
| 2 | Cuerpo desarrollado por bloques lógicos | ≥ 6 secciones H2/H3, al menos 2 H2/H3 reformulados como pregunta-objeción |
| 3 | Objeciones resueltas antes del CTA | ≥ 3 secciones tipo "¿Y si...?" / "Lo que NO te cuentan" / "El coste de no..." |
| 4 | Densidad Exentax calibrada | 4-12 menciones distribuidas; nunca clustering al final, nunca < 2 ni > 22 |
| 5 | Cada afirmación legal con su fuente oficial | ≥ 3 dominios autoritativos distintos cuando hay claims legales (irs.gov, fincen.gov, boe.es, agenciatributaria.es, oecd.org…) en formato `<a href="…" target="_blank" rel="noopener">` |
| 6 | CTA como consecuencia, no como petición | Verbatim de un patrón canónico (`blog-cta-library.ts`); nunca "contáctanos", nunca "no dudes en escribirnos" |
| 7 | Longitud útil ≥ 2.500 palabras netas | Medido sobre el template literal sin HTML / sin code / sin markdown |

## 2. Política de fuentes

- Cada plazo, cuota, sanción o cita normativa lleva enlace a fuente oficial inmediatamente al lado del dato.
- Formato HTML: `<a href="https://www.irs.gov/forms-pubs/about-form-5472" target="_blank" rel="noopener">Form 5472</a>`. Nunca markdown plano para fuentes legales.
- Catálogo completo de URLs en `docs/editorial/SOURCES-BY-JURISDICTION.md`.
- Verificación: si la URL muere, se sustituye por la actualización oficial — no se borra el dato.

## 3. Política de CTA

- Cierre del artículo: 1 patrón canónico de `client/src/lib/blog-cta-library.ts` (book_consultation, llc_florida_specific, llc_state_compare, itin_help, services_overview, compliance_checkup).
- Mid-article: bloque `<!-- exentax:calc-cta-v1 -->` con una de las 4 variantes aprobadas en `blog-mid-cta-copy.ts` (free_consult, start_today, talk_to_team, discover_llc).
- Bloque `<!-- exentax:cta-conv-v1 -->` con WhatsApp opcional para slugs de alta intención.
- Prohibido: redactar copy nuevo en el cuerpo del artículo.

## 4. Política de menciones a Exentax

- Mínimo: 4 menciones por artículo (ES). Por debajo: `exentax-invisible`, lector no recuerda quién firma.
- Máximo: 12 menciones por artículo. Por encima: `exentax-forzado`, suena spam.
- Reparto: 1 en intro/resumen, 2-4 en cuerpo (como observación de práctica real, no autopromo), 1-2 en cierre.
- Nunca "en Exentax somos los mejores" / "en Exentax llevamos años" sin un dato detrás.

## 5. Política de meta SEO (por idioma)

| Campo | Límite |
|---|---|
| `metaTitle` (H1) | ≤ 60 caracteres, incluye keyword principal y modificador (año / no residente / guía…) |
| `metaDescription` | 120-155 caracteres, persuasiva, incluye 1 cifra o promesa concreta |
| `ogTitle` | ≤ 60 caracteres, hook social (puede divergir del metaTitle) |
| `ogDescription` | 120-160 caracteres |
| `socialDescription` | ≤ 110 caracteres (LinkedIn/X/WhatsApp) |

## 6. Política de internal links

- Cada artículo enlaza a 2-4 artículos hermanos del mismo cluster temático.
- `relatedSlugs` en `blog-posts.ts` mantiene el orden editorial; nunca se duplica con bloques inline.
- Lecturas relacionadas se gestionan **sólo** desde el bloque `<!-- related-inline-stripped-2026-04 -->` y la guard de Task #12 (no insertar manualmente).

## 7. Registro por idioma

| Idioma | Tratamiento | Variedad |
|---|---|---|
| ES | tú, coloquial profesional | España neutra (no LATAM-first) |
| EN | you, conversational professional | US English por defecto, UK matiz cuando el slug toca HMRC |
| FR | vous, formal pero cálido | France métropolitaine; mención BE/LU/CH/QC cuando aplique |
| DE | **Sie / Ihr** estricto, jamás du | DACH (DE/AT/CH); evitar coloquialismos de Berlín |
| PT | tu coloquial profesional, **PT-PT estricto** | Sin brasileñismos (validador `lint:pt-pt`) |
| CA | **vostè** estricto, formal pero cercano | Català oriental (Barcelona/Girona) |

## 8. Estructura editorial recomendada (12 secciones)

Inspirada en el modelo Task #1, adaptada al tema:

1. **Gancho** — opener con cifra/objeción/pregunta (sin definición).
2. **Costes / Datos / Cifras** — tabla cuantitativa o comparativa concreta.
3. **Comparativa por perfil** — tabla "para quién encaja qué".
4. **Visión a 24 meses** — escenarios A/B/C con números.
5. **El coste de NO hacerlo** — quantificar la inacción.
6. **Lo que NO cambia** — desambiguación / mitos.
7. **"¿Y si... ?"** — 3-5 objeciones tipificadas.
8. **Hechos legales y de procedimiento** — bloque con citas oficiales.
9. **FAQ** — 6-8 preguntas reales del cliente.
10. **Qué incluye Exentax** — lo que cubre el servicio sin letra pequeña.
11. **Referencias normativas** — bloque con BOE / IRS / FinCEN / OCDE.
12. **CTA** — bloque cerrado canónico, sin copy nuevo.

## 9. Ejemplos verbatim del modelo Task #1

### 9.a Gancho concreto (cita verbatim)

```
Vamos a empezar aclarando algo que nos hace sangrar los oídos a los que trabajamos en esto: una LLC no se "crea". Se constituye. Crear es lo que haces con un perfil de Instagram o una cuenta de Netflix. Constituir es lo que haces cuando formas una entidad legal reconocida por un estado soberano de Estados Unidos, con obligaciones fiscales, un número de identificación federal y responsabilidades ante el IRS.
```

→ Por qué pasa: arranca con conflicto de definición, cita el IRS y crea la promesa "ahora vamos a lo que importa".

### 9.b Comparativa por perfil (cita verbatim, columna "Perfil → Recomendación → Por qué")

```
| Freelancer / consultor B2B facturando a clientes europeos o norteamericanos, sin empleados | Nuevo México | Sin Annual Report, sin tasa anual estatal y privacidad razonable. La estructura más barata de mantener a 2-3 años vista. |
| Agencia digital o estudio creativo con 1-3 socios, sin previsión de inversores externos | Wyoming | Charging order law sólida (mejor protección frente a acreedores personales)… |
```

→ Por qué pasa: cada fila resuelve una objeción de "¿pero esto encaja conmigo?".

### 9.c Bloque "El coste de NO hacerlo" (cita verbatim)

```
Si facturas 60.000€/año como autónomo en España con clientes internacionales y estás pagando un 40% efectivo, eso son 24.000€ en impuestos. Con una LLC bien estructurada, pagas 0% de impuesto federal en EE.UU. sobre esos ingresos. La diferencia: 16.800-19.200€ al año. El coste de la LLC se amortiza en el primer mes.
```

→ Por qué pasa: convierte la inacción en un número.

### 9.d FAQ canónica (cita verbatim de una entrada)

```
**¿Qué pasa si pierdo el plazo del 15 de abril del 5472?** Si presentas el Form 7004 antes del 15 de abril, ganas extensión automática hasta el 15 de octubre y no hay sanción. Si dejas pasar el 15 de abril sin extensión, la sanción se devenga: **25.000 USD por formulario por año**, más 25.000 USD por cada 30 días adicionales si el IRS te notifica y sigues sin presentar.
```

→ Por qué pasa: pregunta literal del cliente + respuesta con cifra + plazo + sanción + nombre del formulario.

## 10. Validadores que gatean cada slug

Antes de cerrar un slug, deben pasar:

- `npm run blog:validate-all` — 13 sub-validadores (TS, lint blog, hreflang, JSON-LD, CTA, internal links, etc.).
- `npm run lint:blog` — coherencia editorial.
- `npm run i18n:check` — glosario por idioma.
- `npm run lint:pt-pt` — sin brasileñismos.
- `npm run seo:meta` — límites de mt/md/og.
- `node scripts/audit-conversion-es-2026-04.mjs` filtrado al slug → PASA.

## 11. Cómo se priorizan las pasadas

| Tipo | Cuándo aplica | Tiempo estimado por slug |
|---|---|---|
| **rewrite-completo** | Verdict FALLA. Reescribir ES íntegro + propagación nativa | 2-3h |
| **polish-verificacion** | Verdict PASA. Verificar fuentes, refrescar fechas/cifras, revisar registro nativo, no tocar prosa estructural | 30-45 min |

La cola completa, con score y tipo, vive en `docs/editorial/PRIORITY-QUEUE.md`.  
La asignación a sprints (4 slugs cada uno) vive en `docs/editorial/sprints/SPRINT-PLAN.md`.
