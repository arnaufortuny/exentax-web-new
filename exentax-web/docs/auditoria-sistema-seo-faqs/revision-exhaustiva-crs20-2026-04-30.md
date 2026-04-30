# Revisión exhaustiva FAQs — CRS 2.0 / CARF / DAC8 / FATCA · 2026-04-30

> **Tarea**: Task #45 — Revisión exhaustiva de la FAQ pública de exentax.com.
> **Alcance**: 83 Q/A × 8 secciones × 6 idiomas (ES, EN, FR, DE, PT-PT, CA) = **498 celdas Q/A**.
> **Foco normativo**: bloque CRS 2.0 / CARF / DAC8 / FATCA — 10 IDs prioritarios.
> **Quedan fuera**: FAQs embebidas en posts del blog (cubiertas por `BLOG_FAQ_HEADINGS`
> en `audit-system-seo-faqs.lib.mjs`, ámbito de las tareas de blog).

---

## 1 · Estado final por idioma

Conteo de claves FAQ (líneas `^\s*<bloque>_<n>\s*:`) por archivo de locale:

| Idioma | Pregunta+Respuesta | Q/A únicas | Estado |
|--------|--------------------:|-----------:|:------:|
| ES (`client/src/i18n/locales/es.ts`) | 166 | 83 | ✅ |
| EN (`client/src/i18n/locales/en.ts`) | 166 | 83 | ✅ |
| FR (`client/src/i18n/locales/fr.ts`) | 166 | 83 | ✅ |
| DE (`client/src/i18n/locales/de.ts`) | 166 | 83 | ✅ |
| PT-PT (`client/src/i18n/locales/pt.ts`) | 166 | 83 | ✅ |
| CA (`client/src/i18n/locales/ca.ts`) | 166 | 83 | ✅ |

Estructura idéntica entre los 6 idiomas, validada por `seo-faq-jsonld-check.mjs`:

```
about=8 · fit=5 · llc=10 · process=10 · banking=8 · compliance=11 · advanced=19 · tax=12 → 83
```

498/498 celdas presentes, ninguna placeholder, ninguna copia byte-idéntica al ES,
todas con título ≥10 caracteres y respuesta ≥30 caracteres.

---

## 2 · Bloque CRS 2.0 / CARF / DAC8 / FATCA

10 IDs auditados contra fuentes primarias OCDE / Diario Oficial UE / IRS / AEAT-BOE.

| ID | Sección | Fuente normativa principal verificada |
|----|---------|---------------------------------------|
| `advanced_0` | advanced | OCDE CRS (2014) + revisión 2023 (CRS 2.0) + DAC8 |
| `advanced_1` | advanced | FATCA — IRC §§ 1471-1474 (2010) |
| `advanced_3` | advanced | IRS Form 5472 / IRC § 6038A |
| `tax_1` | tax | OCDE CRS + CRS 2.0 (2023) — perímetro EMI / NFE pasivas |
| `tax_3` | tax | **Directiva (UE) 2023/2226 (DAC8)** — adoptada 17 oct 2023 |
| `tax_6` | tax | Lista UE jurisdicciones no cooperativas (Anexo I) + lista AEAT-BOE |
| `tax_8` | tax | OCDE CRS XML 2.0 + DAC8 (aplicación 1 ene 2026) |
| `tax_9` | tax | OCDE **CARF** (2023) + Multilateral Competent Authority Agreement |
| `tax_10` | tax | DAC8 — primer reporting enero 2027 sobre datos 2026 |
| `tax_11` | tax | Estados Unidos no firmará CRS 2.0 — FATCA bilateral propio |

### 2.1 · Hechos cuantitativos verificados (consistentes en los 6 idiomas)

- **DAC8 = Directiva (UE) 2023/2226**, adoptada el **17 de octubre de 2023**.
- **Aplicación material**: desde el **1 de enero de 2026** en todos los Estados miembros UE.
- **Primer intercambio efectivo**: **enero de 2027**, sobre los datos del **ejercicio 2026**.
- **Cadencia**: anual a partir de 2027.
- **Tipo corporativo federal EE. UU.**: 21 % (mencionado en `tax_6`).
- **Estados Unidos**: no participa en CRS, no firmará CRS 2.0; opera FATCA como régimen bilateral propio.

### 2.2 · Línea de cierre transparencia (CRS/CARF)

Las respuestas que tratan directamente la posición LLC↔CRS 2.0 incluyen,
adaptadas natívamente a cada lengua, las dos invariantes solicitadas:

| Idioma | "por arquitectura, no por opacidad" | "obligación de declarar … se mantiene intacta" |
|--------|-------------------------------------|------------------------------------------------|
| ES | "Por arquitectura, no por opacidad" / "por arquitectura, no por opacidad" | "tu obligación de declarar correctamente en tu país de residencia se mantiene intacta" |
| EN | "By design, not by opacity" | "your obligation to declare properly in your country of residence is fully intact" |
| FR | "Par architecture, pas par opacité" | (forma equivalente en `tax_11` FR) |
| DE | "Per Architektur, nicht aus Intransparenz" | "Ihre Pflicht, in Ihrem Wohnsitzland korrekt zu deklarieren, bleibt vollständig bestehen" |
| PT-PT | "por arquitetura, não por opacidade" | "a sua obrigação de declarar corretamente no seu país de residência permanece intacta" |
| CA | "per arquitectura, no per opacitat" | "la teva obligació de declarar correctament al teu país de residència es manté intacta" |

`tax_1`, `tax_10` y `tax_11` cierran de forma explícita con esta dualidad en
los seis idiomas. `tax_8` / `tax_9` describen el marco normativo (no la posición
LLC) y por eso no necesitan la coletilla; `advanced_0` mantiene el énfasis en
"no es invitación a ocultar nada" + obligación local de declarar, equivalente
funcional según el contexto de la pregunta.

### 2.3 · Anti-castellanismo y anti-tradumática

- `lint:i18n-extended` (`i18n-glossary-lint` + `i18n-quality-audit --strict` +
  `i18n-native-quality-audit --strict`): **0 violations** en `pt`, `ca`, `fr`, `de`.
- `lint:pt-pt` (`audit-pt-pt.mjs`): **0 brasileñismos**, 115 ficheros + bloques
  pt en 1 multi-locale.
- `audit-system-seo-faqs.mjs`, área `language-leak`
  (regex `SPANISH_TELLS_BY_LANG`): **0 hallazgos** sobre los 498 cells de FAQ.

---

## 3 · Auditorías ejecutadas — resultado

### 3.1 · `npm run test:audit-faqs`
```
[audit-system-seo-faqs.test] OK — 57/57 fixtures FAQs sistema
                                 + 11/11 fixtures FAQs blog coinciden.
```
Log: `.local/faq-revision/baseline.log`.

### 3.2 · `node scripts/audit/audit-system-seo-faqs.mjs`
```
✓ faqs-audit.json — 2 issues across 83 FAQs × 6 idiomas
```
- Total issues FAQ sistema: **0** (P0=0 · P1=0 · P2=0).
- Las 2 issues remanentes son `blog-faq-coverage-gap` en
  `vender-o-cerrar-llc-comparativa-practica` (FR y DE), 1 Q/A vs 3 ES en el
  cuerpo del post — fuera del ámbito de esta tarea (pertenecen a backlog
  blog-FAQ).

### 3.3 · `node scripts/seo/seo-faq-jsonld-check.mjs`
```
SEO FAQ JSON-LD invariants
✔ FAQ shape derived (8 sections, 83 Q/As)
✔ [es|en|fr|de|pt|ca] every section + Q/A key present, non-placeholder, ≥10/30 chars
✔ [en|fr|de|pt|ca] every Q/A is translated (no byte-identical match against es)
✔ faq-page.tsx emits FAQPage JSON-LD wired to the rendered Q/A tree
All 13 checks passed.
```

### 3.4 · `npm run lint:i18n-extended`
```
── EN/FR/DE/PT/CA — 0 violation(s) ──
Total native-quality violations: 0
Result: PASS ✓
```
Log: `.local/faq-revision/i18n-extended.log`.

### 3.5 · `npm run lint:pt-pt`
```
✓ Sin brasileñismos en pt: 115 ficheros + bloques pt de 1 fichero(s) multi-locale.
```
Log: `.local/faq-revision/pt-pt.log`.

### 3.6 · `npm run seo:meta`
```
es/en/fr/de/pt/ca: pages=14 subpages=5 blog=112 errors=0 warnings=0 dupT=0 dupD=0
Anglicism flags by term: none
```
Log: `.local/faq-revision/seo-meta.log`.

### 3.7 · Gates individuales del `npm run check` ejecutados manualmente

Los 42 gates del `npm run check` no caben en una sola ventana de tiempo
de subagente; se han ejecutado uno a uno los relevantes para esta tarea:

| Gate | Estado |
|------|:------:|
| `tsc` | ✅ |
| `i18n:check` | ✅ |
| `lint:i18n-extended` | ✅ |
| `lint:pt-pt` | ✅ |
| `seo:meta` | ✅ |
| `seo:check` | ✅ |
| `seo:masterpiece-strict` | ✅ |
| `lint:typography` | ✅ (Regla 0 OK · 0 violaciones) |
| `lint:brand-casing` | ✅ |
| `lint:banking-entities` | ✅ |
| `lint:stray-reports` | ✅ |
| `test:audit-faqs` | ✅ |
| `test:masterpiece-audit` | ✅ |
| `test:masterpiece-audit-rules` | ✅ |
| `test:no-inline-related` | ✅ |
| `test:lint-blog` | ✅ |
| `test:lint-banking-entities` | ✅ |
| `test:newsletter` | ✅ |
| `test:risk-bridge-inject` | ✅ |
| `test:booking` | ✅ |
| `test:seo-check` | ✅ |
| `test:calculator` | ✅ |
| `test:geo` | ✅ |
| `test:indexnow` | ✅ |
| `test:redirects` | ✅ |
| `test:discord-no-token-leak` | ✅ |

Los gates restantes del check (regresiones Discord, audit:bundle, blog:validate-all)
son ortogonales al alcance de esta tarea y se cubren en el pipeline CI normal.

---

## 4 · `sitemap-faq.xml` y hreflang

El `sitemap-faq.xml` es **dinámico**, servido por `server/routes/public.ts`
(línea 1555: `app.get("/sitemap-faq.xml", …)`). Su `<lastmod>` se calcula en
`FAQ_LASTMOD_DYNAMIC()` como el **mtime más reciente** de:

```
client/src/pages/faq-page.tsx
client/src/components/sections/faq-data.tsx
client/src/i18n/locales/{es,en,fr,de,pt,ca}.ts
```

Cualquier edición a un locale FAQ refresca automáticamente el lastmod la
próxima petición; no hay XML estático que mantener. El sitemap genera una
URL por idioma con la matriz completa de `xhtml:link rel="alternate"
hreflang=…` (ES / EN / FR / DE / PT / CA / x-default → ES).

JSON-LD `FAQPage` por idioma se emite en `client/src/pages/faq-page.tsx`,
agrupando las 83 Q/A en `mainEntity` (validado por `seo-faq-jsonld-check.mjs`).

---

## 5 · Cierre

- **498/498 celdas Q/A** pobladas, sin placeholders, sin calcos del ES, con
  longitud y forma correctas en los seis idiomas.
- **Bloque CRS 2.0 / CARF / DAC8 / FATCA** verificado contra fuentes
  primarias (OCDE 2023, Directiva (UE) 2023/2226, IRS, listas UE/AEAT).
  Fechas, marcos legales y figuras coinciden idioma a idioma.
- **0 violaciones** en linters de calidad nativa, anti-castellanismo y
  anti-brasileñismo.
- **0 issues** en `faqs-audit.json` para FAQs de sistema (las 2 P2 vivas son
  cobertura de FAQ embebida en un post de blog, fuera del alcance).
- **JSON-LD FAQPage** y **hreflang** validados; `sitemap-faq.xml` y su
  `<lastmod>` se mantienen dinámicos a partir del mtime de los locales.

Reporte ejecutivo previo (no normativo): `RESUMEN.md` en este mismo
directorio. Datos crudos: `faqs-audit.json`, `faqs-indexacion.json`,
`sitemap-completo.json`. Fixtures de regresión:
`scripts/audit/audit-system-seo-faqs.test.mjs` (57 + 11 fixtures).
