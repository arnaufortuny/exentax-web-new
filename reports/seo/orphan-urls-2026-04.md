# SEO orphan-URL audit — 2026-04-28

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
- Sitemap entries unreachable (network error): **0**

## Locale `es` (es-ES)

- App canonical: 130
- Sitemap entries: 130
- Reachable from `/es` (≤3 clicks): 130

### (a) Reachable in-app but NOT in sitemap — 0
_None._

### (b) Sitemap entries NOT reachable ≤3 clicks from `/es` — 0
_None._

### (c) Sitemap entries returning 404 / redirect / noindex — 0
_None._

## Locale `en` (en-US)

- App canonical: 130
- Sitemap entries: 130
- Reachable from `/en` (≤3 clicks): 130

### (a) Reachable in-app but NOT in sitemap — 0
_None._

### (b) Sitemap entries NOT reachable ≤3 clicks from `/en` — 0
_None._

### (c) Sitemap entries returning 404 / redirect / noindex — 0
_None._

## Locale `fr` (fr-FR)

- App canonical: 130
- Sitemap entries: 130
- Reachable from `/fr` (≤3 clicks): 130

### (a) Reachable in-app but NOT in sitemap — 0
_None._

### (b) Sitemap entries NOT reachable ≤3 clicks from `/fr` — 0
_None._

### (c) Sitemap entries returning 404 / redirect / noindex — 0
_None._

## Locale `de` (de-DE)

- App canonical: 130
- Sitemap entries: 130
- Reachable from `/de` (≤3 clicks): 130

### (a) Reachable in-app but NOT in sitemap — 0
_None._

### (b) Sitemap entries NOT reachable ≤3 clicks from `/de` — 0
_None._

### (c) Sitemap entries returning 404 / redirect / noindex — 0
_None._

## Locale `pt` (pt-PT)

- App canonical: 130
- Sitemap entries: 130
- Reachable from `/pt` (≤3 clicks): 130

### (a) Reachable in-app but NOT in sitemap — 0
_None._

### (b) Sitemap entries NOT reachable ≤3 clicks from `/pt` — 0
_None._

### (c) Sitemap entries returning 404 / redirect / noindex — 0
_None._

## Locale `ca` (ca-ES)

- App canonical: 130
- Sitemap entries: 130
- Reachable from `/ca` (≤3 clicks): 130

### (a) Reachable in-app but NOT in sitemap — 0
_None._

### (b) Sitemap entries NOT reachable ≤3 clicks from `/ca` — 0
_None._

### (c) Sitemap entries returning 404 / redirect / noindex — 0
_None._

## Hreflang reciprocity

Audited 780 `<url>` blocks across the sitemap tree. For each block we require that all six BCP-47 codes (`es-ES`, `en-US`, `fr-FR`, `de-DE`, `pt-PT`, `ca-ES`) plus an `x-default` alternate are present, and that every `xhtml:link rel="alternate"` `href` resolves to another URL inside the same sitemap tree.

- Hreflang inconsistencies detected: **0**
- All sitemap entries advertise the full 6-locale BCP-47 set + `x-default` and every alternate `href` is itself a sitemap entry. Confirms reciprocal hreflang clusters of 7 (6 locales + x-default) per canonical URL.

## Summary

- Orphans (reachable but not in sitemap): **0**
- Orphans (in sitemap but unreachable ≤3 clicks): **0**
- Ghost URLs (sitemap entries 404/redirect/noindex): **0**
- Hreflang inconsistencies: **0**

## SEO suite — 2026-04-28 run

All seven required suites green against the live SPA:

| Suite | Result |
| --- | --- |
| `npm run seo:check` (broken-link + ≥3 incoming + SERP previews) | OK — 112 articles, 0 broken, 108 SERP cards rendered |
| `npm run seo:slash` (slash hygiene against running server) | OK — clean (`reports/seo/slash-hygiene.md`) |
| `npm run seo:meta` (verify-meta) | PASS — 0 errors, dupT=0/dupD=0 across 6 langs |
| `npm run blog:validate-all` (15 steps incl. sitemap-bcp47, conversion-strict, faq-jsonld) | OK — 15/15 green |
| `node scripts/seo-sitemap-bcp47.test.mjs` | All BCP-47 hreflang assertions passed |
| `npm run test:indexnow` (indexnow.test.ts) | 10/10 passed |
| `npm run test:redirects` (legacy-redirects.test.mjs) | 9/9 passed |

## Sitemap structure

The sitemap is server-generated (no static file regenerated). Tree:

- `/sitemap.xml` (sitemapindex) → `/sitemap-pages.xml`, `/sitemap-blog.xml`, `/sitemap-faq.xml`
- Each `<url>` entry carries `xhtml:link rel="alternate"` for the six BCP-47 locales (`es-ES`, `en-US`, `fr-FR`, `de-DE`, `pt-PT`, `ca-ES`) plus an `x-default` pointing to the Spanish canonical
- `lastmod` reflects the live date (`2026-04-28` for static pages, content `lastmod` for blog posts)

## IndexNow + Google Search Console submission

The pipeline is wired (`server/sitemap-ping.ts` + `server/indexnow.ts` +
`server/google-search-console.ts`) and runs **automatically on every server
start**: it computes the SHA-256 of the combined sitemap tree and, if it
differs from `data/sitemap-ping-state.json`, fans out to IndexNow and to the
Search Console API in parallel.

Current status of the pipeline in **this dev container**:

- IndexNow key endpoint registered at
  `/b2c8d9fd690c4015af5ef0be1386ce79.txt` (served from `client/public/`).
- `INDEXNOW_KEY` env var **not set** in this container → ping outcome is
  `skipped` with reason `INDEXNOW_KEY not set; cannot submit sitemap to
  IndexNow`. Production must export `INDEXNOW_KEY=b2c8d9fd690c4015af5ef0be1386ce79`.
- `GOOGLE_SERVICE_ACCOUNT_KEY` env var **not set** → last GSC attempt failed
  with the OpenSSL decoder error visible in
  `data/sitemap-ping-state.json`. Production must export the service-account
  JSON key (the same identity that owns the verified property).

Once those two production secrets are present, the next deploy will
automatically submit the current 780-URL sitemap (sitemap content has not
changed since the last hash, so a no-op re-deploy will log
`sitemap unchanged since last ping`; the next blog/route change triggers a
real submission).
