# Publishing checklist — Exentax

Use this checklist before merging ANY content change that affects SEO (new page, new blog post, rewrite, slug rename, meta edit).

## 1. Pre-flight

- [ ] Primary KW identified and recorded in `keyword-map.md`.
- [ ] No existing post targets the same primary KW (cannibalization check: grep `metaTitle`, `metaDescription`, `slug` and the first H1).
- [ ] Slug follows `slug-conventions.md`.
- [ ] Target URL does not clash with a main-page route (`routes.ts`).

## 2. Content

- [ ] H1 is unique across the site and ≤ 60 chars.
- [ ] First 100 words include the primary KW naturally.
- [ ] `metaTitle` ≤ 60 chars, ends with `| Exentax`, includes primary KW.
- [ ] `metaDescription` 140–155 chars, active voice, includes a benefit number where possible ("-37%", "en 2 días", "0%").
- [ ] At least 3 internal links (see `internal-linking.md`).
- [ ] At least 1 outbound link to an authoritative source (IRS.gov, AEAT, FinCEN, Stripe docs, Mercury docs).
- [ ] A FAQ section with 4–6 Q&A at the bottom.
- [ ] Word count: blog post 1 500–2 500, hub page 2 000+.
- [ ] Images have descriptive `alt` text with the primary KW variant (once).
- [ ] No placeholder text ("lorem ipsum", `TODO`, `<!-- -->`) anywhere.

## 3. Translations

- [ ] Translations for **all 6 languages** (es, en, fr, de, pt, ca) in `blog-posts-i18n.ts`:
  - `title`, `excerpt`, `metaTitle`, `metaDescription`, `content`.
- [ ] Each locale's slug added to `blog-posts-slugs.ts` (ca can reuse es).
- [ ] Each translation respects the 60/155 char budgets for title/description.
- [ ] Translated anchor text and internal-link targets point to the correct localized URL.

## 4. Structured data

- [ ] For new main pages: `PAGE_SCHEMAS[key]` includes BreadcrumbList + appropriate type (Article / HowTo / Service / Product).
- [ ] BreadcrumbList URLs use the `/es/...` localized path (not the unprefixed legacy path).
- [ ] Run the URL through [Rich Results Test](https://search.google.com/test/rich-results) — 0 errors, 0 warnings.
- [ ] If the page declares a FAQPage schema, every Q&A visible on the page matches the schema exactly.

## 5. Technical

- [ ] Build succeeds: `npm run build`.
- [ ] Type-check passes: `npm run check`.
- [ ] `/sitemap.xml` includes the new URL (for blog posts this is automatic; for main pages verify the sitemap handler).
- [ ] `robots.txt` does not block the URL.
- [ ] Canonical tag points to the localized URL (`/es/...`).
- [ ] Hreflang block contains all 6 languages + `x-default`.
- [ ] `og:title`, `og:description`, `og:url` reflect the new meta.

## 6. Performance

- [ ] Lighthouse (mobile, Moto G4 emulation) on the new URL: Performance ≥ 85, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95.
- [ ] LCP ≤ 2.5 s, CLS < 0.1, INP < 200 ms.
- [ ] No new render-blocking resources.

## 7. Post-merge

- [ ] Add an entry to `docs/seo/changelog.md` with date, URL(s), and a one-line description.
- [ ] If this is a main-page rewrite, manually "Request indexing" in Google Search Console for the Spanish URL.
- [ ] Wait 7 days, then check Search Console → Performance for the new URL's impressions. If 0, investigate (indexation, canonical, duplicate, etc.).

## 8. One-time / quarterly: Search Console & Bing Webmaster Tools

These steps cannot be automated from the codebase (they require domain-owner credentials at the search-engine side) and live outside `npm run check`. Run them once on first publish and re-verify quarterly.

- [ ] **Google Search Console — property verification.** Confirm the `https://exentax.com` property is verified (DNS TXT record OR HTML `<meta name="google-site-verification">` in `client/index.html`). If using a service-account-based Indexing API path, ensure the service-account email (`GOOGLE_SERVICE_ACCOUNT_EMAIL`) is added as **Owner** on the property — not just User — otherwise `server/google-indexing.ts` calls return 403.
- [ ] **Google Search Console — manual sitemap submission.** Sitemaps → "Add a new sitemap" → submit `sitemap.xml` (the index file). Verify all 3 child sitemaps (`sitemap-pages.xml`, `sitemap-blog.xml`, `sitemap-faq.xml`) are picked up automatically. Re-check status (Success / Couldn't fetch / Has errors) for each. The Sitemaps API call from `server/sitemap-ping.ts` will keep them fresh after the manual first-time submit.
- [ ] **Google Search Console — Coverage / Page Indexing report.** After 7 days, confirm the 606 blog URLs progress from "Discovered – not indexed" to "Indexed". For any "Crawled – not indexed", paste the URL into URL Inspection and click "Request indexing" (limit ~10/day).
- [ ] **Bing Webmaster Tools — property verification.** Verify `https://exentax.com` (DNS or `BingSiteAuth.xml` in `client/public/`). Bing receives URL pings via IndexNow (`server/indexnow.ts`) but the property must be verified to see them in Search performance.
- [ ] **Bing Webmaster Tools — sitemap submission.** Sitemaps → submit `https://exentax.com/sitemap.xml`. Bing's public ping endpoint was deprecated in 2022 (returns 410 — see `docs/seo/sitemap-ping-log.md`); manual submission inside the Webmaster portal is the supported path.
- [ ] **IndexNow key file deployment check.** After deploy, confirm `https://exentax.com/<INDEXNOW_KEY>.txt` returns HTTP 200 with `Content-Type: text/plain` and the key as the file body (no SPA fallback HTML). Without this, `api.indexnow.org` rejects submissions with 403 even though the runtime ping appears to fire — see the partial-run note in `docs/seo/sitemap-ping-log.md`.

---

*Shortlink for contributors: `docs/seo/publishing-checklist.md`.*
