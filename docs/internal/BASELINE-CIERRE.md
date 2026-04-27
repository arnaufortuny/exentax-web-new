Mon Apr 27 11:05:24 UTC 2026
=== TS STRICT ===
EXIT 0
=== I18N CHECK ===
═══════════════════════════════════════════════
 Hardcoded Attribute Audit (CI-blocking)
═══════════════════════════════════════════════
✓ No hardcoded i18n-attribute violations

═══════════════════════════════════════════════
 Summary
═══════════════════════════════════════════════
Total missing keys:        0
Total extra keys:          0
Total empty values:        0
Placeholder mismatches:    0
Structure mismatches:      0
Possibly untranslated:     1

Result: PASS ✓
═══════════════════════════════════════════════
 Hardcoded user-visible strings
═══════════════════════════════════════════════
Files scanned: 779
Findings:      0
  JSX text:    0
  Attributes:  0

✓ No hardcoded user-visible strings detected.
EXIT 0
=== BLOG VALIDATE-ALL ===
[2mThis is a report, not a gate. Reach >80% PASS to consider the pillar topologically mature.[0m

══ summary ════════════════════════════════════════════════════

  ✓ OK    consistency (0.1s)
  ✓ OK    content-lint (1.0s)
  ✓ OK    internal-links (0.6s)
  ✓ OK    locale-link-leak (0.2s)
  ✓ OK    cta (0.3s)
  ✓ OK    data (0.1s)
  ✓ OK    sources (0.1s)
  ✓ OK    faq-jsonld (0.1s)
  ✓ OK    sitemap (0.2s)
  ✓ OK    sitemap-bcp47 (0.2s)
  ✓ OK    masterpiece-audit (3.9s)
  ✓ OK    seo-llm-readiness (0.1s)
  ✓ OK    blog-cluster-audit (0.1s)

blog-validate-all: OK (13 steps)

EXIT 0
=== SEO CHECK ===

> exentax-web@1.0.0 seo:check
> node scripts/seo-check-links.mjs

✓ No broken internal blog links.
✓ All 112 articles have ≥ 3 incoming links.

seo-check-links: OK

EXIT 0
=== SEO META ===

> exentax-web@1.0.0 seo:meta
> tsx scripts/seo/verify-meta.ts

[verify-meta] PASS: 0 error(s), 0 warning(s) across 6 languages
  es: pages=14 subpages=5 blog=112 errors=0 warnings=0 dupT=0 dupD=0
  en: pages=14 subpages=5 blog=112 errors=0 warnings=0 dupT=0 dupD=0
  ca: pages=14 subpages=5 blog=112 errors=0 warnings=0 dupT=0 dupD=0
  fr: pages=14 subpages=5 blog=112 errors=0 warnings=0 dupT=0 dupD=0
  de: pages=14 subpages=5 blog=112 errors=0 warnings=0 dupT=0 dupD=0
  pt: pages=14 subpages=5 blog=112 errors=0 warnings=0 dupT=0 dupD=0
[verify-meta] Report written to /home/user/exentax-web-new/exentax-web/reports/seo/seo-meta-report.json
EXIT 0
=== SEO SLASH (skip live) ===
> exentax-web@1.0.0 seo:slash
> node scripts/seo-slash-hygiene.mjs

SEO_SLASH_SKIP_LIVE=1 — skipping live sitemap scan (sources only).
✓ slash-hygiene: clean (report → reports/seo/slash-hygiene.md)
EXIT 0
=== AUDIT:CONVERSION ===
> node scripts/audit-conversion-112x6.mjs

audit-conversion-112x6: 0/672 fully conversion-grade · 175 agenda gaps · 669 tel-WA gaps · 654 LLC-subpage gaps · 37 ITIN-subpage gaps · 4 weak-copy hits
EXIT 0
=== TYPOGRAPHY/BRAND/PT-PT ===
Regla 0 OK · 0 violaciones decorativas (TS/TSX + CSS)
✓ No "ExenTax" occurrences in exentax-web/{client,server,shared,scripts,docs} or root docs/.
✓ Sin brasileñismos en pt: 114 ficheros + bloques pt de 1 fichero(s) multi-locale.
=== TEST:REDIRECTS / TEST:GEO ===
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 39.023318
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 9588.838073
=== NPM AUDIT ===
      drizzle-kit  0.17.5-6b7793f - 0.17.5-e5944eb || 0.18.1-065de38 - 0.18.1-f3800bf || 0.19.0-07024c4 - 1.0.0-beta.1-fd8bfcc
      Depends on vulnerable versions of @esbuild-kit/esm-loader
      node_modules/drizzle-kit

4 moderate severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force
=== CURL HEALTH (sandbox) ===
000 (server NOT running in sandbox; expected. Verify in Replit/Hostinger)

---

Generated: 2026-04-27T11:12:20Z
Sandbox: no DATABASE_URL, no live server (localhost:5000 unreachable)
