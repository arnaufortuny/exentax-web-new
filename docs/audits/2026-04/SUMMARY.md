# SUMMARY — Auditoría editorial 360º Exentax (2026-04)

Generado por `exentax-web/scripts/audit-2026-04.mjs` el 2026-04-21. Cada cifra abajo viene de un análisis estático del repositorio actual; cada hallazgo individual se detalla en los reportes 00..10 y en `articles/<slug>.md`.

## Cobertura

- **Artículos únicos:** 111
- **Ficheros de contenido por idioma (ES/EN/FR/DE/PT/CA):** 666 (objetivo: 666 = 111 × 6)
- **Páginas públicas .tsx:** 24
- **Idiomas auditados:** es, en, fr, de, pt, ca

## Métricas de calidad — antes / objetivo

| Dimensión | Estado actual | Objetivo |
| --- | --- | --- |
| CTAs genéricos detectados (artículo·idioma) | 0 | 0 |
| Artículos sin CTA de calculadora en algún idioma | 0 | 0 |
| Artículos sin CTA de agenda en algún idioma | 0 | 0 |
| Artículos sin entrada en SOURCES_BY_SLUG | 0 | 0 |
| Artículos ES sin enlace externo autoritario | 0 | 0 |
| Artículos con metaDescription > 150 chars | 0 | 0 |
| Artículos sin relatedSlugs curados | 0 | 0 |
| Artículos con cero menciones a Exentax en algún idioma | 0 | 0 |

## Reportes por dimensión

- [00 — Inventario de páginas públicas](./public-pages-inventory.md)
- [01 — Inventario de contenido](./content-inventory.md)
- [02 — CTAs](./cta-audit.md)
- [03 — Datos y cuotas](./factual-review.md)
- [04 — Referencias legales](./legal-references.md)
- [05 — Fuentes externas](./sources-added.md)
- [06 — Duplicados / canibalización](./duplicates.md)
- [07 — SEO e indexación](./seo-checks.md)
- [08 — Slugs](./slugs-audit.md)
- [09 — Related articles](./related-articles.md)
- [10a — Conversion audit](./conversion-audit.md)
- [10b — Exentax positioning](./exentax-positioning.md)
- [CTAs — registro de reescrituras y estado canónico](./ctas-rewrite.md)
- `articles/<slug>.md` — fiches editoriales (10-dim checklist ✅/⚠️/❌, una por artículo)

## Remediación aplicada (no sólo detección)

Esta auditoría es de **completación**, no únicamente de detección. El pipeline `exentax-web/scripts/audit-2026-04-fix.mjs` ha cerrado las siguientes dimensiones de forma idempotente:

- **CTAs genéricos:** 69 sentencias reescritas a CTA canónico `/{lang}/agendar` (cobertura final 100 %, ver `ctas-rewrite.md` §3).
- **CTAs de agenda ausentes:** 110 artículos·idioma con CTA canónico añadido al cierre.
- **SOURCES_BY_SLUG:** 79 entradas creadas para artículos sin registro de fuentes; cobertura final 111/111.
- **Enlaces autoritativos en cuerpo ES:** 594 auto-enlaces a dominios `.gov`/`.es` añadidos en 101 artículos previamente sin enlace externo.
- **Meta overshoots (title >60 / desc >160):** 16 trimmings aplicados; cobertura final 100 % conforme.
- **`relatedSlugs` <3:** 2 artículos rellenados al mínimo de 3 referencias; integridad validada en CI.
- **Consolidación 301:** infraestructura `BLOG_CONSOLIDATION_REDIRECTS` desplegada en `server/routes/public.ts`; el único par Jaccard ≥0.5 se clasificó editorialmente como `differentiate` (ver `duplicates.md`).

Las dimensiones de **verificación factual** (cifras numéricas, citas legales) son detección + clasificación de fuente canónica + acción prescrita; el cierre del eje numérico requiere validación humana contra la fuente oficial. El estado se trackea con un esquema dual `source ✅/⏳ — verify ⏳` por fila en `factual-review.md` y `legal-references.md`.

## Validación automatizada en CI (build-failing)

- `exentax-web/scripts/seo-meta-audit.mjs` — rompe el build si algún post carece de `metaTitle`/`metaDescription`, supera 60/160 chars, no tiene meta traducida en EN/FR/DE/PT/CA, una página pública .tsx carece de `<SEO>` o no tiene exactamente un `<h1>` (directo o vía `Hero`/`FAQ`/`LegalLayout`; pages `noindex` toleran h1>1).
- `exentax-web/scripts/seo-related-validate.mjs` — rompe el build si algún `relatedSlugs` apunta a un slug inexistente o si un artículo tiene <3 related.
- `exentax-web/server/routes/public.test.ts` — integración real (no stub) contra `registerPublicRoutes`: verifica que los 301 de consolidación se emitan correctamente en los 6 idiomas, que un slug desconocido no dispare 301, y que todos los `relatedSlugs` resuelvan a posts reales.

Engánchalo a `npm run check` o `prebuild` para bloquear merges.