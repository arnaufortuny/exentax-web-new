# Auditoría sistema, SEO, sitemap y FAQs — Resumen ejecutivo

Generado: 2026-04-22T09:33:06.434Z
Servidor analizado: http://localhost:5000 (origin sitemap: https://exentax.com)

## Conteos por área
| Área | Total | P0 | P1 | P2 |
|---|---:|---:|---:|---:|
| Sistema (consistencia) | 0 | 0 | 0 | 0 |
| Documentos legales | 0 | 0 | 0 | 0 |
| SEO técnico | 48 | 0 | 0 | 48 |
| Sitemap | 0 | 0 | 0 | 0 |
| FAQs (contenido) | 20 | 0 | 20 | 0 |
| FAQs indexación | 0 | 0 | 0 | 0 |
| **Total** | **68** | **0** | **20** | **48** |

## Inventario de URLs (sitemap real)
- sitemap-pages.xml: 96 URLs
- sitemap-faq.xml:   6 URLs
- sitemap-blog.xml:  666 URLs
- Total catalogado en `sitemap-completo.json`: 768 (incluye blog posts y blog index)

## Estado de indexación de FAQs por idioma
| Idioma | FAQs | OK | Necesita atención |
|---|---:|---:|---:|
| ES | 79 | 79 | 0 |
| EN | 79 | 79 | 0 |
| FR | 79 | 79 | 0 |
| DE | 79 | 79 | 0 |
| PT | 79 | 79 | 0 |
| CA | 79 | 79 | 0 |

> Nota arquitectónica: el JSON-LD FAQPage se construye **client-side** en `client/src/pages/faq-page.tsx` y agrupa todas las `useFaqSections()` en `mainEntity`. Una única URL por idioma (`/xx/faq`) cubre las 79 Q/A; los anchors `#id` son fragments SPA. El estado por celda se valida cruzando la traducción i18n, la presencia en `mainEntity` del JSON-LD renderizado, la presencia en `sitemap-faq.xml`, las reglas de `robots.txt`, el `canonical` real y los enlaces internos entrantes.

## Top 10 hallazgos
1. **[P1] blog-faq-section-missing** — Blog "auditoria-rapida-llc-12-puntos-30-minutos" (en): post existe pero no tiene sección FAQ traducida (ES tiene 3 Q/A) _(`client/src/data/blog-content/en/auditoria-rapida-llc-12-puntos-30-minutos.ts`)_
2. **[P1] blog-faq-section-missing** — Blog "autonomo-espana-vs-llc-estados-unidos" (en): post existe pero no tiene sección FAQ traducida (ES tiene 3 Q/A) _(`client/src/data/blog-content/en/autonomo-espana-vs-llc-estados-unidos.ts`)_
3. **[P1] blog-faq-section-missing** — Blog "boi-report-fincen-guia-completa-2026" (en): post existe pero no tiene sección FAQ traducida (ES tiene 3 Q/A) _(`client/src/data/blog-content/en/boi-report-fincen-guia-completa-2026.ts`)_
4. **[P1] blog-faq-section-missing** — Blog "constituir-llc-proceso-paso-a-paso" (en): post existe pero no tiene sección FAQ traducida (ES tiene 3 Q/A) _(`client/src/data/blog-content/en/constituir-llc-proceso-paso-a-paso.ts`)_
5. **[P1] blog-faq-section-missing** — Blog "cuanto-cuesta-constituir-llc" (en): post existe pero no tiene sección FAQ traducida (ES tiene 3 Q/A) _(`client/src/data/blog-content/en/cuanto-cuesta-constituir-llc.ts`)_
6. **[P1] blog-faq-section-missing** — Blog "cuenta-bancaria-mercury-llc-extranjero" (en): post existe pero no tiene sección FAQ traducida (ES tiene 3 Q/A) _(`client/src/data/blog-content/en/cuenta-bancaria-mercury-llc-extranjero.ts`)_
7. **[P1] blog-faq-section-missing** — Blog "ein-numero-fiscal-llc-como-obtenerlo" (en): post existe pero no tiene sección FAQ traducida (ES tiene 3 Q/A) _(`client/src/data/blog-content/en/ein-numero-fiscal-llc-como-obtenerlo.ts`)_
8. **[P1] blog-faq-section-missing** — Blog "errores-criticos-llc-ya-constituida" (en): post existe pero no tiene sección FAQ traducida (ES tiene 3 Q/A) _(`client/src/data/blog-content/en/errores-criticos-llc-ya-constituida.ts`)_
9. **[P1] blog-faq-section-missing** — Blog "form-5472-que-es-como-presentarlo" (en): post existe pero no tiene sección FAQ traducida (ES tiene 2 Q/A) _(`client/src/data/blog-content/en/form-5472-que-es-como-presentarlo.ts`)_
10. **[P1] blog-faq-section-missing** — Blog "llc-estados-unidos-guia-completa-2026" (en): post existe pero no tiene sección FAQ traducida (ES tiene 3 Q/A) _(`client/src/data/blog-content/en/llc-estados-unidos-guia-completa-2026.ts`)_

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
