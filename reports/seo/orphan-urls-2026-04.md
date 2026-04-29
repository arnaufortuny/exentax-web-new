# SEO orphan-URL audit — 2026-04-29

Base URL probed: `http://localhost:5000` (live SPA on port 5000).
Sitemap source: `/sitemap.xml` index → `/sitemap-pages.xml`, `/sitemap-blog.xml`, `/sitemap-faq.xml`.

Locales audited (BCP-47):

- `es` (es-ES)
- `en` (en-US)
- `fr` (fr-FR)
- `de` (de-DE)
- `pt` (pt-PT)
- `ca` (ca-ES)

## Methodology

Three URL surfaces are computed per locale:

1. **App canonical** — every URL the app actually serves: `ALL_ROUTE_KEYS × LANGS`
   from `shared/routes.ts`, `/{lang}/blog` index, and every blog post whose
   content file exists in `client/src/data/blog-content/<lang>/<slug>.ts` AND whose
   meta is complete (`title + excerpt + metaTitle + metaDescription` for non-ES).
2. **Sitemap** — URLs advertised by the live `/sitemap.xml` tree.
3. **Reachable** — BFS from `/{lang}` ≤ 3 clicks following `lp(...)` calls in
   global (Navbar/Footer/FloatingMobileCTA), `lp(...)` calls and
   `href="/lang/..."` patterns inside each page component, plus inline
   `<a href="/lang/blog/<slug>">` links inside blog content files.

Live HTTP probe checks every sitemap URL with `redirect:manual` and parses
`<meta name="robots">` + `X-Robots-Tag` for `noindex`.

## Global counts

- Sitemap URLs total: **780**
- App canonical URLs total: **780**
- Reachable URLs total: **780**
- Sitemap entries returning 4xx: **0**
- Sitemap entries returning 3xx: **0**
- Sitemap entries flagged `noindex`: **0**
- Sitemap entries unreachable (network error): **12**

## Locale `es` (es-ES)

- App canonical: 130
- Sitemap entries: 130
- Reachable from `/es` (≤3 clicks): 130

### (a) Reachable in-app but NOT in sitemap — 0
_None._

### (b) Sitemap entries NOT reachable ≤3 clicks from `/es` — 0
_None._

### (c) Sitemap entries returning 404 / redirect / noindex — 2
- `/es/blog/auditoria-rapida-llc-12-puntos-30-minutos` — HTTP -1 (fetch failed)
- `/es/blog/como-disolver-cerrar-llc-paso-a-paso` — HTTP -1 (fetch failed)

## Locale `en` (en-US)

- App canonical: 130
- Sitemap entries: 130
- Reachable from `/en` (≤3 clicks): 130

### (a) Reachable in-app but NOT in sitemap — 0
_None._

### (b) Sitemap entries NOT reachable ≤3 clicks from `/en` — 0
_None._

### (c) Sitemap entries returning 404 / redirect / noindex — 2
- `/en/blog/how-to-dissolve-and-close-a-us-llc-step-by-step` — HTTP -1 (fetch failed)
- `/en/blog/uk-limited-company-when-it-makes-sense` — HTTP -1 (fetch failed)

## Locale `fr` (fr-FR)

- App canonical: 130
- Sitemap entries: 130
- Reachable from `/fr` (≤3 clicks): 130

### (a) Reachable in-app but NOT in sitemap — 0
_None._

### (b) Sitemap entries NOT reachable ≤3 clicks from `/fr` — 0
_None._

### (c) Sitemap entries returning 404 / redirect / noindex — 2
- `/fr/blog/comment-dissoudre-et-fermer-une-llc-americaine-etape-par` — HTTP -1 (fetch failed)
- `/fr/blog/societe-uk-ltd-quand-cest-pertinent` — HTTP -1 (fetch failed)

## Locale `de` (de-DE)

- App canonical: 130
- Sitemap entries: 130
- Reachable from `/de` (≤3 clicks): 130

### (a) Reachable in-app but NOT in sitemap — 0
_None._

### (b) Sitemap entries NOT reachable ≤3 clicks from `/de` — 0
_None._

### (c) Sitemap entries returning 404 / redirect / noindex — 2
- `/de/blog/uk-limited-wann-sie-sinnvoll-ist` — HTTP -1 (fetch failed)
- `/de/blog/us-llc-auflosen-und-schliessen-schritt-fur-schritt` — HTTP -1 (fetch failed)

## Locale `pt` (pt-PT)

- App canonical: 130
- Sitemap entries: 130
- Reachable from `/pt` (≤3 clicks): 130

### (a) Reachable in-app but NOT in sitemap — 0
_None._

### (b) Sitemap entries NOT reachable ≤3 clicks from `/pt` — 0
_None._

### (c) Sitemap entries returning 404 / redirect / noindex — 2
- `/pt/blog/como-dissolver-e-encerrar-uma-llc-americana-passo-a-passo` — HTTP -1 (fetch failed)
- `/pt/blog/empresa-no-reino-unido-uk-ltd-quando-faz-sentido` — HTTP -1 (fetch failed)

## Locale `ca` (ca-ES)

- App canonical: 130
- Sitemap entries: 130
- Reachable from `/ca` (≤3 clicks): 130

### (a) Reachable in-app but NOT in sitemap — 0
_None._

### (b) Sitemap entries NOT reachable ≤3 clicks from `/ca` — 0
_None._

### (c) Sitemap entries returning 404 / redirect / noindex — 2
- `/ca/blog/com-dissoldre-i-tancar-una-llc-americana-pas-a-pas` — HTTP -1 (fetch failed)
- `/ca/blog/empresa-al-regne-unit-uk-ltd-quan-te-sentit` — HTTP -1 (fetch failed)

## Hreflang reciprocity

Audited 780 `<url>` blocks across the sitemap tree. For each block we require that all six BCP-47 codes (`es-ES`, `en-US`, `fr-FR`, `de-DE`, `pt-PT`, `ca-ES`) plus an `x-default` alternate are present, and that every `xhtml:link rel="alternate"` `href` resolves to another URL inside the same sitemap tree.

- Hreflang inconsistencies detected: **0**
- All sitemap entries advertise the full 6-locale BCP-47 set + `x-default` and every alternate `href` is itself a sitemap entry. Confirms reciprocal hreflang clusters of 7 (6 locales + x-default) per canonical URL.

## Summary

- Orphans (reachable but not in sitemap): **0**
- Orphans (in sitemap but unreachable ≤3 clicks): **0**
- Ghost URLs (sitemap entries 404/redirect/noindex): **12**
- Hreflang inconsistencies: **0**
