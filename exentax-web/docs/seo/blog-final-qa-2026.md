# Blog final QA — Task #4 (2026-04-21)

Auto-generado por `scripts/blog-final-qa.mjs`. JSON de respaldo en `reports/seo/blog-final-qa.json`.

Universo: **110 artículos × 6 idiomas = 660 ficheros**.

Umbrales: longitud ≥ 3000 caracteres · em-dashes = 0 · CTAs = 2 (link a `/{lang}/agendar` o `/{lang}/calculadora`) · meta title 30-65 chars · meta description 80-160 chars · duplicados si Jaccard sobre 5-gramas > 0.7.

## 1. Resumen por idioma

| Lang | Presentes | Faltan | <3000c | em-dash | CTAs ≠2 | Links rotos | meta title KO | meta desc KO | Largo medio | Min | Max | Duplicados |
|------|----------:|-------:|-------:|--------:|--------:|------------:|--------------:|-------------:|------------:|----:|----:|-----------:|
| es | 110 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 19026 | 5330 | 30523 | 0 |
| en | 110 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 18093 | 4668 | 30292 | 0 |
| fr | 110 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 17934 | 5153 | 31360 | 0 |
| de | 110 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 17864 | 5024 | 31620 | 0 |
| pt | 110 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 16745 | 4712 | 29208 | 0 |
| ca | 110 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 16829 | 4828 | 29223 | 0 |

## 2. Em-dashes residuales

Cero apariciones en los 6 idiomas. ✔

## 3. Longitud < 3000 caracteres

Todos los artículos cumplen ≥ 3000 caracteres. ✔

## 4. CTAs por artículo (esperado: 2 = agendar + calculadora)

- **es** — ✔ todos los artículos tienen 2 CTAs
- **en** — ✔ todos los artículos tienen 2 CTAs
- **fr** — ✔ todos los artículos tienen 2 CTAs
- **de** — ✔ todos los artículos tienen 2 CTAs
- **pt** — ✔ todos los artículos tienen 2 CTAs
- **ca** — ✔ todos los artículos tienen 2 CTAs

## 5. Internal links rotos (slug fuera del mapa)

Cero links rotos en los 6 idiomas. ✔

## 6. Coherencia estructural vs ES (deltas H2/H3)

80 (slug × lang) con diferencias estructurales frente a ES.
- **en** — 29 ficheros
  - `bancos-vs-fintech-llc-donde-abrir-cuenta` H2 7 vs ES 7 · H3 13 vs ES 10
  - `boi-report-fincen-guia-completa-2026` H2 7 vs ES 7 · H3 16 vs ES 8
  - `como-operar-llc-dia-a-dia` H2 9 vs ES 9 · H3 18 vs ES 14
  - `constituir-llc-proceso-paso-a-paso` H2 11 vs ES 11 · H3 14 vs ES 12
  - `criptomonedas-trading-llc-impuestos` H2 9 vs ES 9 · H3 15 vs ES 8
  - … +24 más
- **de** — 17 ficheros
  - `bookkeeping-llc-paso-a-paso` H2 9 vs ES 8 · H3 12 vs ES 12
  - `como-disolver-cerrar-llc-paso-a-paso` H2 9 vs ES 8 · H3 11 vs ES 11
  - `convenio-doble-imposicion-usa-espana-llc` H2 13 vs ES 13 · H3 13 vs ES 8
  - `crs-residentes-espana-latam-implicaciones` H2 11 vs ES 11 · H3 9 vs ES 7
  - `dac7-plataformas-digitales-reporting-2026` H2 8 vs ES 8 · H3 10 vs ES 8
  - … +12 más
- **pt** — 14 ficheros
  - `como-disolver-cerrar-llc-paso-a-paso` H2 9 vs ES 8 · H3 11 vs ES 11
  - `convenio-doble-imposicion-usa-espana-llc` H2 13 vs ES 13 · H3 13 vs ES 8
  - `crs-residentes-espana-latam-implicaciones` H2 11 vs ES 11 · H3 9 vs ES 7
  - `dac7-plataformas-digitales-reporting-2026` H2 8 vs ES 8 · H3 10 vs ES 8
  - `form-5472-que-es-como-presentarlo` H2 8 vs ES 8 · H3 13 vs ES 12
  - … +9 más
- **fr** — 10 ficheros
  - `como-operar-llc-dia-a-dia` H2 10 vs ES 9 · H3 14 vs ES 14
  - `convenio-doble-imposicion-usa-espana-llc` H2 13 vs ES 13 · H3 13 vs ES 8
  - `crs-residentes-espana-latam-implicaciones` H2 11 vs ES 11 · H3 10 vs ES 7
  - `dac7-plataformas-digitales-reporting-2026` H2 8 vs ES 8 · H3 10 vs ES 8
  - `irs-1120-5472-que-son-cuando-aplican` H2 10 vs ES 10 · H3 9 vs ES 7
  - … +5 más
- **ca** — 10 ficheros
  - `convenio-doble-imposicion-usa-espana-llc` H2 13 vs ES 13 · H3 12 vs ES 8
  - `crs-residentes-espana-latam-implicaciones` H2 11 vs ES 11 · H3 8 vs ES 7
  - `dac7-plataformas-digitales-reporting-2026` H2 8 vs ES 8 · H3 10 vs ES 8
  - `irs-1120-5472-que-son-cuando-aplican` H2 10 vs ES 10 · H3 10 vs ES 7
  - `llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais` H2 10 vs ES 10 · H3 11 vs ES 9
  - … +5 más

## 7. Longitudes meta (title 30-65, description 80-160)

- **es** — ✔ todas las metas en rango
- **en** — ✔ todas las metas en rango
- **fr** — ✔ todas las metas en rango
- **de** — ✔ todas las metas en rango
- **pt** — ✔ todas las metas en rango
- **ca** — ✔ todas las metas en rango

## 8. Duplicados (Jaccard 5-gram > 0.70)

Cero pares con solapamiento > 70 % en los 6 idiomas. ✔

## 9. Fuentes externas citadas

20 URLs únicas referenciadas a través del blog.

| Dominio | Citas |
|---------|------:|
| boe.es | 7 |
| eur-lex.europa.eu | 6 |
| ec.europa.eu | 1 |
| petete.tributos.hacienda.gob.es | 1 |
| sede.agenciatributaria.gob.es | 1 |
| irs.gov | 1 |
| law.cornell.edu | 1 |
| poderjudicial.es | 1 |
| seg-social.es | 1 |

Verificación de URLs vivas: ver `reports/seo/source-url-check.json` (script aparte si se necesita resucitar verificación HTTP en CI; en este entorno no se ejecutan llamadas externas para evitar falsos positivos por rate-limit).

## 10. Sitemap, robots e indexación

Endpoints servidos por `server/routes/public.ts` (verificados en runtime):
- `/sitemap.xml` (sitemap-index)
- `/sitemap-pages.xml` (páginas estáticas × 6 idiomas con xhtml:link + x-default)
- `/sitemap-blog.xml` (606 URLs con hreflang recíproco + x-default + news:news)
- `/sitemap-faq.xml`
- `/robots.txt` (Disallow /api/, /admin/, /booking/, parámetros UTM/ref/gclid; advertises 4 sitemaps)

Comprobaciones automatizadas (gates ya cableados en `npm run check`):
- `scripts/seo-task4-check.mjs` — invariantes de aiSummary, JSON-LD Article, hreflang en SEO.tsx, sitemap routes.
- `scripts/seo-blog-audit.mjs` — heuristics de calidad por artículo.
- `scripts/seo-sitemap-check.mjs` — pega `/sitemap*.xml` en runtime contra el catálogo de URLs.
- `scripts/seo-check-links.mjs` — internal-link graph (≥3 inbound contextual links/post).
- `scripts/blog-link-locale-lint.mjs` — locale leakage en `<a href=>` dentro de blog-content.

## 11. Pasos de indexación (ejecutar en producción)

**IndexNow (Bing + Yandex):**
1. Generar/recuperar la clave en `https://exentax.com/<key>.txt` (ya configurado en deploy).
2. Ejecutar `node scripts/seo-indexing-publish.mjs` desde el entorno de producción para enviar el batch contra `https://api.indexnow.org/indexnow` (606 URLs blog + páginas principales).
3. Confirmar HTTP 200/202 por endpoint.

**Google Search Console:**
1. Login en `https://search.google.com/search-console` con la propiedad `https://exentax.com`.
2. *Sitemaps* → enviar `sitemap.xml`, `sitemap-pages.xml`, `sitemap-blog.xml`, `sitemap-faq.xml`.
3. Para artículos prioritarios: *Inspección de URL* → *Solicitar indexación* (rate-limit ~10/día).
4. Revisar *Cobertura* a las 24-72 h: confirmar 0 errores y crecimiento del índice válido.

**Bing Webmaster Tools:**
1. Login en `https://www.bing.com/webmasters/` con la misma propiedad.
2. *Sitemaps* → submit los 4 sitemaps.
3. *URL Submission* → tope 10 000/día gracias a IndexNow ya conectado.

## 12. Build y workflow

Resultados de `npm run build` y health-check del workflow `Start application` se anotan en `docs/seo/blog-final-qa-2026.md` después de la ejecución (sección actualizada manualmente al cierre de la fase).

---

_Este reporte es informativo. Las regresiones se bloquean en `npm run check` (tsc + seo:check) y en los E2E guards documentados en `replit.md`._
