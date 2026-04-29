# Auditoría sistema, SEO, sitemap y FAQs — Resumen ejecutivo

Generado: 2026-04-29T18:10:30.803Z
Servidor analizado: http://localhost:5000 (origin sitemap: https://exentax.com)

## Conteos por área
| Área | Total | P0 | P1 | P2 |
|---|---:|---:|---:|---:|
| Sistema (consistencia) | 1 | 0 | 0 | 1 |
| Documentos legales | 17 | 0 | 0 | 17 |
| SEO técnico | 9 | 0 | 4 | 5 |
| Sitemap | 0 | 0 | 0 | 0 |
| FAQs (contenido) | 2 | 0 | 0 | 2 |
| FAQs indexación | 6 | 6 | 0 | 0 |
| **Total** | **35** | **6** | **4** | **25** |

## Inventario de URLs (sitemap real)
- sitemap-pages.xml: 102 URLs
- sitemap-faq.xml:   6 URLs
- sitemap-blog.xml:  672 URLs
- Total catalogado en `sitemap-completo.json`: 774 (incluye blog posts y blog index)

## Estado de indexación de FAQs por idioma
| Idioma | FAQs | OK | Necesita atención |
|---|---:|---:|---:|
| ES | 83 | 79 | 4 |
| EN | 83 | 79 | 4 |
| FR | 83 | 79 | 4 |
| DE | 83 | 79 | 4 |
| PT | 83 | 79 | 4 |
| CA | 83 | 79 | 4 |

> Nota arquitectónica: el JSON-LD FAQPage se construye **client-side** en `client/src/pages/faq-page.tsx` y agrupa todas las `useFaqSections()` en `mainEntity`. Una única URL por idioma (`/xx/faq`) cubre las 83 Q/A; los anchors `#id` son fragments SPA. El estado por celda se valida cruzando la traducción i18n, la presencia en `mainEntity` del JSON-LD renderizado, la presencia en `sitemap-faq.xml`, las reglas de `robots.txt`, el `canonical` real y los enlaces internos entrantes.

## Top 10 hallazgos
1. **[P0] faq-indexation-ssr-coverage** — FAQ/es: 4 de 83 preguntas traducidas no aparecen en el mainEntity SSR _(`https://exentax.com/es/preguntas-frecuentes (FAQ_SCHEMA_ENTRIES en server/seo-content.ts)`)_
2. **[P0] faq-indexation-ssr-coverage** — FAQ/en: 4 de 83 preguntas traducidas no aparecen en el mainEntity SSR _(`https://exentax.com/en/faq (FAQ_SCHEMA_ENTRIES en server/seo-content.ts)`)_
3. **[P0] faq-indexation-ssr-coverage** — FAQ/fr: 4 de 83 preguntas traducidas no aparecen en el mainEntity SSR _(`https://exentax.com/fr/questions-frequentes (FAQ_SCHEMA_ENTRIES en server/seo-content.ts)`)_
4. **[P0] faq-indexation-ssr-coverage** — FAQ/de: 4 de 83 preguntas traducidas no aparecen en el mainEntity SSR _(`https://exentax.com/de/haufige-fragen (FAQ_SCHEMA_ENTRIES en server/seo-content.ts)`)_
5. **[P0] faq-indexation-ssr-coverage** — FAQ/pt: 4 de 83 preguntas traducidas no aparecen en el mainEntity SSR _(`https://exentax.com/pt/perguntas-frequentes (FAQ_SCHEMA_ENTRIES en server/seo-content.ts)`)_
6. **[P0] faq-indexation-ssr-coverage** — FAQ/ca: 4 de 83 preguntas traducidas no aparecen en el mainEntity SSR _(`https://exentax.com/ca/preguntes-frequents (FAQ_SCHEMA_ENTRIES en server/seo-content.ts)`)_
7. **[P1] meta-description-too-long** — Meta description de 176 (>160) _(`/es`)_
8. **[P1] meta-description-too-long** — Meta description de 170 (>160) _(`/en`)_
9. **[P1] meta-description-too-long** — Meta description de 171 (>160) _(`/fr`)_
10. **[P1] meta-description-too-long** — Meta description de 166 (>160) _(`/pt`)_

## Plan de corrección priorizado

### P0 — Bloqueantes (0–7 días)
- Reparar todas las celdas `faqs-indexacion.json` con status `ATTENTION` (especialmente JSON-LD ausente, FAQ no presente en `mainEntity` o canonical incorrecto).
- Resolver placeholders/faltantes en `faqs-audit.json` y `documentos-audit.json`.
- Garantizar que cada página de servicio/legal tiene `<title>`, meta description, canonical absoluto y JSON-LD aplicable (ver `seo-audit.json` áreas `title-missing`, `meta-description-missing`, `canonical-*`).
- Eliminar cualquier shard de sitemap inaccesible (`sitemap-completo.json` › `shard-unreachable`).

### P1 — Alto impacto (1–4 semanas)
- Igualar la estructura (<h2>) de los documentos legales en los 6 idiomas con la base ES.
- Normalizar prioridades del sitemap a la jerarquía sugerida (home > servicios > FAQ > legales).
- Eliminar duplicados i18n top-level y rellenar secciones huérfanas (`sistema-audit.json`).
- Verificar al menos un enlace interno entrante por FAQ-page por idioma.
- Localizar terminología fiscal en FAQs marcadas con `language-leak`.
- Garantizar OG/Twitter completos (`seo-audit.json` › `open-graph`, `twitter-card`).

### P2 — Optimización (4–8 semanas)
- Acortar títulos SEO que excedan 60 caracteres y enriquecer descripciones <70.
- Añadir fechas de "Última actualización" a documentos legales que no las declaran.
- Limpieza de componentes/utilidades sin importadores.
- Documentar duplicaciones intencionales entre `server/seo-content.ts` y `client/src/data`.

## Reportes generados
- `sistema-audit.json`
- `documentos-audit.json`
- `seo-audit.json` (con `pages[]` por ruta×idioma: title/desc/H1/canonical/hreflang/OG/Twitter/JSON-LD types)
- `sitemap-completo.json` (incluye URLs de blog posts del sitemap real)
- `faqs-audit.json`
- `faqs-indexacion.json` (matriz FAQ×idioma con evidencia: JSON-LD mainEntity, sitemap, robots, canonical, inbound links)

## Alcance y método
Auditoría puramente diagnóstica. El script `exentax-web/scripts/audit-system-seo-faqs.mjs` no modifica código del sitio. Recolecta evidencia desde el servidor en ejecución (sitemaps, robots, HTML renderizado) y desde el código fuente (locales, faq-data, routes). Las heurísticas (longitud, fugas idiomáticas, comparación con ES) son orientativas; cada issue debe verificarse manualmente antes de corregir. Re-ejecutable con `node exentax-web/scripts/audit-system-seo-faqs.mjs` (BASE_URL configurable).
