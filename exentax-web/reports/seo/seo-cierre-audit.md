# SEO closure audit (Tarea #24)
Generated: 2026-04-30T11:20:14.043Z
Base URL:  http://localhost:5000
Result:    ✅ PASS  (errors=0)
## Sitemaps
| Endpoint | Status | URLs | Expected |
|---|---:|---:|---:|
| /sitemap.xml | 200 | — | — |
| /sitemap-pages.xml | 200 | 102 | 102 |
| /sitemap-blog.xml | 200 | 672 | 672 |
| /sitemap-faq.xml | 200 | 6 | 6 |
Total URLs: **780** (expected **780**), alternate-groups: **130**, reciprocity failures: **0**.
## Header probes
### Public (must be index, follow + rel=canonical)
| Path | Status | X-Robots-Tag | rel=canonical |
|---|---:|---|:---:|
| /es | 200 | `index, follow, max-snippet:-1, max-image-preview:large` | ✓ |
| /en | 200 | `index, follow, max-snippet:-1, max-image-preview:large` | ✓ |
| /fr | 200 | `index, follow, max-snippet:-1, max-image-preview:large` | ✓ |
| /de | 200 | `index, follow, max-snippet:-1, max-image-preview:large` | ✓ |
| /pt | 200 | `index, follow, max-snippet:-1, max-image-preview:large` | ✓ |
| /ca | 200 | `index, follow, max-snippet:-1, max-image-preview:large` | ✓ |
| /en/blog/quick-audit-of-your-llc-in-30-minutes-12-points-to-review | 200 | `index, follow, max-snippet:-1, max-image-preview:large` | ✓ |
| /en/faq | 200 | `index, follow, max-snippet:-1, max-image-preview:large` | ✓ |
### Private (must be noindex, nofollow)
| Path | Status | X-Robots-Tag |
|---|---:|---|
| /booking/cita | 200 | `noindex, nofollow` |
| /start | 200 | `noindex, nofollow` |
| /thank-you | 404 | `noindex, nofollow` |
| /links | 200 | `noindex, nofollow` |
| /preview/test | 404 | `noindex, nofollow` |
| /__mockup/foo | 404 | `noindex, nofollow` |
## robots.txt
- Sitemaps declared: 4 (required: 4)
- AI bots declared: 10/10
- AI bots with explicit `Allow: /`: 10/10
- Disallow rules covered: 8/8