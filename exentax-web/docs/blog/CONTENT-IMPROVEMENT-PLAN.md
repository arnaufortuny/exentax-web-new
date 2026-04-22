# Plan de mejora y traducción — 111 artículos × 6 idiomas

**Objetivo:** llevar los 666 artículos del blog a calidad máxima y paridad
estructural con el ES, con SEO limpio por artículo. Ejecutable en Replit,
un artículo completo cada vez.

**Fecha baseline:** 2026-04-22 (Sesión 5).

## 1. Estado real medido hoy

Ratio palabras `(body target lang) / (body ES)` por cuartiles, sobre 111
artículos × 5 idiomas no-ES = **555 celdas**:

| Idioma | `<50 %` | `50-70 %` | `70-85 %` | `85-95 %` | `≥ 95 %` |
|---|---|---|---|---|---|
| EN | 0 | 0 | 5 | 53 | 53 |
| FR | 0 | 6 | 14 | 27 | 64 |
| DE | 1 | 15 | 27 | 67 | 1 |
| PT | 0 | 12 | 15 | 47 | 37 |
| CA | 0 | 10 | 12 | 38 | 51 |
| **Total** | **1** | **43** | **73** | **232** | **206** |

Lectura:
- **44 celdas críticas** (< 70 %, traducción severamente cortada): DE 16,
  PT 12, CA 10, FR 6. **Prioridad P0**.
- **73 celdas flojas** (70-85 %, cortadas o simplificadas): prioridad P1.
- **232 celdas correctas** (85-95 %, revisión ligera): prioridad P2.
- **206 celdas excelentes** (≥ 95 %): prioridad P3 (solo SEO polish).
- **EN** sin cortes pero 5 celdas 70-85 %: sobre todo revisión editorial.
- **DE** concentra la mayor parte del trabajo (110 celdas ≤ 95 %).

## 2. Orden de ejecución recomendado

Trabaja por **artículo** (no por idioma). Abre un artículo ES + sus 5
traducciones a la vez; arréglalas todas antes de pasar al siguiente.
Esto reutiliza el contexto del tema al máximo — una decisión sobre "cómo
traducir ITIN" se aplica una vez y ya queda en los 5.

Por orden de impacto SEO + gravedad:

### P0 (44 celdas críticas, ~22 h)

Lista completa en `docs/auditoria-multiidioma/blog-translation-quality.md`
(regenerar con `node scripts/blog-translation-quality-audit.mjs`). Los 15
peores:

| Slug | Idioma | Ratio |
|---|---|---|
| `wise-business-crs-reporting-fiscal` | de | 0.48 |
| `wise-business-crs-reporting-fiscal` | pt | 0.53 |
| `riesgos-fiscales-mala-estructuracion-internacional` | ca | 0.53 |
| `wise-business-crs-reporting-fiscal` | ca | 0.53 |
| `tributacion-llc-segun-actividad-economica` | de | 0.54 |
| `riesgos-fiscales-mala-estructuracion-internacional` | pt | 0.54 |
| `dac7-plataformas-digitales-reporting-2026` | de | 0.55 |
| `riesgos-fiscales-mala-estructuracion-internacional` | de | 0.55 |
| `boe-febrero-2020-llc-doctrina-administrativa` | de | 0.57 |
| `revolut-business-crs-reporting-fiscal` | de | 0.57 |
| `crs-residentes-espana-latam-implicaciones` | de | 0.58 |
| `dac7-plataformas-digitales-reporting-2026` | ca | 0.58 |
| `tributacion-llc-segun-actividad-economica` | pt | 0.58 |
| `dac7-plataformas-digitales-reporting-2026` | pt | 0.58 |
| `documentar-separacion-fondos-llc-historial` | de | 0.58 |

### P1 (73 celdas flojas, ~18 h)

Artículos con 70-85 %: traducción existente pero clara pérdida de densidad
(secciones podadas, listas acortadas). Requiere completar secciones, no
reescribir.

### P2 (232 celdas correctas, ~19 h)

85-95 %: revisión editorial (calcos, registro, CTAs naturales, brand
casing). No tocar estructura — solo afinar.

### P3 (206 celdas excelentes + 111 ES, ~11 h)

Solo SEO polish: metadata, keyword positioning, internal links, sources
count parity.

**Total estimado para los 666 artículos: ~70 h de trabajo humano
concentrado**, repartible en ~3 meses a razón de 1 h/día.

## 3. Workflow por artículo (repetible en Replit)

Plantilla de prompt tight que pegas en Claude Code o en tu IDE, reemplazando
`<SLUG>` por el slug del artículo:

```
Artículo: <SLUG>
Referencia ES: client/src/data/blog-content/es/<SLUG>.ts
Targets a revisar: client/src/data/blog-content/{en,fr,de,pt,ca}/<SLUG>.ts

Ejecuta para cada idioma:

1. Leer ES y contar palabras, H2, H3, FAQ, enlaces internos, enlaces
   externos (fuentes).
2. Leer target y contar lo mismo. Calcular ratio y diff estructural.
3. Si ratio < 0.85 o falta alguna H2 del ES: completar con traducción
   nativa (no calco del ES). Preservar marcadores <!-- exentax:* --> y
   bloque review-anchor-v1 byte-idéntico.
4. Aplicar reglas invariables (TRANSLATION-GUIDE.md):
   - LLC, Exentax, Form 5472, ITIN, EIN, BOI nunca se traducen.
   - Precios: "desde 2.000 €" / "desde 1.400 €/año" (nunca otro número en
     texto comercial).
   - Orden banca canónico: Relay → Slash → Wise → Mercury → Wallester →
     Revolut Business → Airwallex.
   - PT es PT-PT (connosco, a minha, ficheiro). NUNCA PT-BR (você,
     arquivo, registrar).
5. Completar metadata SEO si falta: title 40-60 chars, description
   140-165 chars, keyword principal en primeras 6 palabras.
6. Verificar internal links: al menos 3 por artículo (si ES los tiene).
7. Correr los linters locales:
   npm run i18n:check
   node scripts/blog-content-lint.mjs
   node scripts/audit-pt-pt.mjs  (solo si tocaste pt)
   node scripts/blog-cta-position-check.mjs
   node scripts/blog-translation-quality-audit.mjs --check
8. Hacer 1 commit por artículo (los 5 idiomas juntos):
   git commit -m "Blog <SLUG>: paridad estructural + SEO polish EN/FR/DE/PT/CA"
9. Push y pasar al siguiente.

Reglas de parada:
- Si algún linter falla tras tus cambios, revertir ese idioma concreto y
  dejar nota en PENDING.md (no commitear rojo).
- Si un dato factual (precios, fechas, citas legales) no está en el ES,
  no lo inventes — copia literal del ES o omite.
```

## 4. Scripts de apoyo (ya existentes, no hay que crear nada)

| Script | Uso |
|---|---|
| `npm run i18n:check` | Integridad claves i18n 6 × idioma |
| `node scripts/blog-content-lint.mjs` | 670 ficheros: precios/direcciones prohibidas |
| `node scripts/audit-pt-pt.mjs` | PT-BR leakage (113 ficheros PT) |
| `node scripts/blog-cta-position-check.mjs` | CTAs en posiciones válidas |
| `node scripts/blog-translation-quality-audit.mjs` | Regenera ratios y dup-paragraphs; report en `docs/auditoria-multiidioma/` |
| `node scripts/blog-translation-quality-audit.mjs --check` | Idem en modo fail-if-regression |
| `npm run seo:meta` | Title/description length por página × idioma |
| `npm run seo:check` | Enlaces internos (111 artículos, ≥3 inbound c/u) |
| `node scripts/audit-system-seo-faqs.mjs` | Audit FAQ schema y blog FAQ sections |
| `npx tsc --noEmit` | Tipos OK |

## 5. Checklist por artículo (marcar antes de commit)

- [ ] Ratio target/ES ≥ 0.85 en los 5 idiomas (objetivo ≥ 0.95 para
      artículos técnicos; 0.85-0.95 aceptable cuando la lengua es más
      densa que ES — DE/CA tienden a eso).
- [ ] Misma cantidad de H2 que ES (± 1 tolerable).
- [ ] Misma cantidad de H3 que ES (± 3 tolerable).
- [ ] Sección `### Preguntas frecuentes` presente si ES la tiene.
- [ ] ≥ 3 enlaces internos a otros artículos/servicios.
- [ ] Mismo número de fuentes externas (IRS, FinCEN, BOE…) citadas que ES.
- [ ] Metadata SEO completa en `seo-content.ts` (title 40-60, desc 140-165).
- [ ] `npm run i18n:check` → PASS.
- [ ] `blog-content-lint.mjs` → OK, 0 menciones prohibidas.
- [ ] `audit-pt-pt.mjs` → 0 brasileñismos (si tocaste pt).
- [ ] `blog-translation-quality-audit.mjs --check` → 0 PT-BR, 0 dups nuevos.
- [ ] `npx tsc --noEmit` → exit 0.

## 6. Seguimiento del progreso

Registra cada artículo completado en `docs/blog/content-improvement-log.md`
(append-only, una línea por artículo):

```
2026-04-23 · wise-business-crs-reporting-fiscal · EN/FR/DE/PT/CA · ratios 0.91/0.89/0.94/0.88/0.90 · commit abc123
2026-04-24 · riesgos-fiscales-mala-estructuracion · EN/FR/DE/PT/CA · ratios 0.93/0.91/0.95/0.92/0.89 · commit def456
...
```

Al mes se puede graficar progreso con:

```bash
node scripts/blog-translation-quality-audit.mjs
# abre docs/auditoria-multiidioma/blog-translation-quality.md
```

## 7. Qué NO está en scope de este plan

- **Re-auditar ES**: los 111 artículos ES ya pasan todos los linters
  (sources verificadas, precios correctos, CTAs, SEO meta). Solo P3 polish.
- **Crear artículos nuevos**: ampliación de catálogo es otro trabajo.
- **Cambiar estructura del blog**: categorías, slugs, navegación están
  congelados tras Task #8 (`PRODUCTION-READY-REPORT.md`).
- **Traducir FAQ de la página `/faq`**: ya 100 % cubierta (79 Q/A × 6
  idiomas, verificado Sesión 5).

## 8. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Un artículo queda "medio traducido" a mitad de sesión | Rule de parada del paso 3: si algún linter falla, revertir ESE idioma y dejar nota en PENDING. Nunca commit rojo. |
| Inventar datos que no están en ES (p. ej. estadísticas) | Paso 3, regla explícita: copia literal del ES o omite. El linter `blog-translation-quality` detecta dup-paragraphs pero no fact-checking; eso es responsabilidad del editor. |
| Subagent en paralelo timeout | Ya descartado en Sesión 4 (2 tandas, 10 invocaciones, 0 persistencias). Este plan es **humano en Replit con IDE**, no subagent-based. |
| Regresión en 1 de los 666 al tocar otro | Cada commit pasa los 9 linters; `blog-translation-quality-audit.mjs --check` detecta regresión de dup-paragraphs desde la última baseline. |
