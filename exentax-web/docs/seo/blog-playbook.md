# Blog Playbook (Exentax)

End-to-end reference for everyone touching `/blog`: editorial team, dev,
SEO, and any agent assisting from this Repl. Last reviewed: 2026-04.

> **Single rule that overrides everything else.** Never edit `BLOG_POSTS`,
> `BLOG_SLUG_I18N`, `SOURCES_BY_SLUG` or `client/src/data/blog-content/`
> by hand without running `node exentax-web/scripts/blog-consistency-check.mjs`
> immediately afterwards. The five registries must always agree.

---

## 1. Architecture in 60 seconds

```
┌─────────────────────────────────────────────────────────────────────────┐
│  client/src/data/                                                       │
│  ├─ blog-posts.ts            ── BLOG_POSTS: master metadata array       │
│  ├─ blog-posts-slugs.ts      ── BLOG_SLUG_I18N: slug-per-language map   │
│  ├─ blog-posts-i18n.ts       ── per-language title/excerpt/meta         │
│  ├─ blog-sources.ts          ── SOURCES_BY_SLUG: per-article sources    │
│  └─ blog-content/<lang>/<slug>.ts  ── Markdown body, 6 languages        │
│                                                                         │
│  client/src/lib/                                                        │
│  ├─ blog-categories.ts       ── BLOG_CATEGORIES (closed taxonomy)       │
│  └─ blog-faq-extract.ts      ── parses ## Preguntas frecuentes blocks   │
│                                                                         │
│  client/src/pages/blog/                                                 │
│  ├─ index.tsx                ── /<lang>/blog with ?category= filter     │
│  └─ post.tsx                 ── /<lang>/blog/<slug> + JSON-LD bundle    │
│                                                                         │
│  client/src/components/SEO.tsx ── meta tags, hreflang, JSON-LD writer   │
│                                                                         │
│  server/routes/public.ts     ── sitemap-blog.xml (news:news ≤ 48 h),    │
│                                  robots.txt, canonical 301s             │
└─────────────────────────────────────────────────────────────────────────┘
```

Every URL `/<lang>/blog/<translated-slug>` resolves to the canonical Spanish
slug via `BLOG_SLUG_I18N`, then loads the Markdown for `<lang>` from
`blog-content/<lang>/<slug>.ts`. Hreflang and `<link rel="canonical">` are
emitted client-side by `SEO.tsx` based on `BLOG_SLUG_I18N`.

## 2. Adding a new article (the only supported flow)

```
node exentax-web/scripts/blog-new-article.mjs <slug> "<Spanish title>" \
    [--cluster=LLC_FUNDAMENTALS|BANKING_STACK|BOI_5472|CRS_FATCA|SPAIN_TAX|INTL_JURISDICTIONS|NICHE_BUSINESS|W8_BROKER] \
    [--category=Fiscalidad|Compliance|Guías|Operativa|Comparativas|Herramientas|Legal]
```

What the scaffolder guarantees on first run:

1. Slug is kebab-case ASCII, ≤ 80 characters and **does not collide**
   with any existing base slug or with any translated slug in
   `BLOG_SLUG_I18N` for any of the six languages.
2. Category belongs to `BLOG_CATEGORIES`.
3. A premium template is dropped into all six `blog-content/<lang>/<slug>.ts`
   files (lead, executive summary, deep section, checklist, FAQ, the
   `exentax:execution-v2` block, closing CTA).
4. A new entry is appended to `BLOG_POSTS`, `BLOG_SLUG_I18N`,
   `BLOG_META_BY_LANG` and `SOURCES_BY_SLUG`.
5. `blog-consistency-check.mjs` and `blog-masterpiece-audit.mjs` run
   restricted to the new slug and **exit non-zero** on any critical issue.

After the scaffolder is green:

- Replace the placeholder body with the real research-grade content.
  Keep the FAQ heading exactly as the scaffolder writes it (per language)
  so `blog-faq-extract.ts` can find it. Each FAQ question must be wrapped
  in `**…?**` and end with a question mark.
- Re-run `node scripts/blog/blog-masterpiece-audit.mjs` until you see
  `mean score: 100/100, critical=0, warning=0` for every language.
- Open a draft commit and let the pre-push hook fire `npm run check`.

## 3. Translating an existing article

The Spanish file is the authoritative source. To translate:

1. Edit the file under `blog-content/<lang>/<slug>.ts` only — never edit
   the rendered HTML on the page.
2. Mirror the heading tree of the ES file (use `node scripts/blog-extract-gaps.mjs`
   to detect missing headings).
3. Mirror the FAQ block: same questions, same order. The FAQPage JSON-LD
   is generated from this body, so missing translations silently lose the
   rich result in that language.
4. Run `node scripts/blog/blog-masterpiece-audit.mjs` and verify the language
   you touched is at score 100 with no warnings.
5. If the article slug is different in your language, update
   `BLOG_SLUG_I18N` accordingly. Do **not** add a translated slug that
   collides with an existing translated slug for any other article in any
   language.

## 4. SEO surface — what we emit per article

`pages/blog/post.tsx` ships **three** JSON-LD blocks per article URL:

- `BlogPosting` — headline, author/publisher (Exentax Organization),
  datePublished, dateModified, articleSection, keywords, mainEntityOfPage.
- `BreadcrumbList` — Home → Blog → Category → Article (the Category step
  is a real link to `/<lang>/blog?category=<slug>` so the BreadcrumbList
  is valid Schema.org).
- `FAQPage` — generated automatically from the article body by
  `blog-faq-extract.ts`. Articles without a FAQ section simply skip this
  block (Google rejects empty FAQPage entities).

In addition, `<head>` carries:

- One `<link rel="canonical">` based on the current `<lang>` and the
  translated slug.
- `<link rel="alternate" hreflang="…">` for every language that has a
  translation, plus `x-default` pointing to the Spanish version.
- Open Graph + Twitter Card meta with `article:published_time`,
  `article:modified_time`, `article:section`, and `article:tag`.

Sitemap: `sitemap-blog.xml` is regenerated server-side from `BLOG_POSTS`
and `BLOG_SLUG_I18N`, with full hreflang matrices and `news:news` entries
**only for articles published within the last 48 hours** (Google News
spec). Older articles still appear with `lastmod` taken from `updatedAt`.

## 5. Indexing pipeline

- **IndexNow (Bing/Yandex)**: `node scripts/blog-indexnow-606.mjs` pings
  every URL. Run after any meaningful content change. State is persisted
  in `data/indexnow-pinged.json`; the script is idempotent.
- **Sitemaps**: every deploy invalidates the in-memory cache; Search
  Console picks up changes within hours.
- **Canonical 301s**: hitting a translated slug under the wrong language
  produces a server 301 to the correct localized URL. Implemented in
  `server/routes/public.ts`.

## 6. Quality gates

| When               | Command                                              | Notes                              |
|--------------------|------------------------------------------------------|------------------------------------|
| pre-commit         | `npm run i18n:check` (auto when locales change)      | Installed by `install-git-hooks.sh`|
| pre-push           | `npm run check` (full pipeline)                      | Installed by `install-git-hooks.sh`|
| Per-corpus health  | `node scripts/blog/blog-masterpiece-audit.mjs`            | Must show 100/100 across 6 langs.  |
| Per-corpus parity  | `node scripts/blog/blog-consistency-check.mjs`            | Must show ✅ across 5 registries.   |
| Per-article smoke  | Scaffolder runs both above, scoped to the new slug.  | Built into `blog-new-article.mjs`. |
| Sitemap matrix     | `node scripts/seo/seo-sitemap-check.mjs`                 | Hreflang reciprocity + counts.     |
| Internal links     | `node scripts/seo/seo-check-links.mjs`                   | No broken anchors / orphan posts.  |
| Slash hygiene      | `node scripts/seo/seo-slash-hygiene.mjs`                 | No double slashes / wrong prefixes.|
| Source URL liveness| `node scripts/blog/blog-verify-source-urls.mjs`           | External regulatory links 2xx.     |

## 7. Conventions you must not break

- Spanish is the source of truth for slugs, headings and FAQs. Translate
  *from* it, never edit translations independently.
- Categories are closed: pick from `BLOG_CATEGORIES`. Adding a new one
  requires a code change in `client/src/lib/blog-categories.ts` and the
  i18n key set under `blogPost.categories.<key>`.
- Every base slug must have an entry in `SOURCES_BY_SLUG`. Articles
  without ≥ 3 sources fail the masterpiece audit at "critical".
- Markdown FAQ format: `## Preguntas frecuentes` (or its localized
  variants — see `blog-faq-extract.ts`) followed by `**¿Question?**`
  paragraphs. Multi-line answers are concatenated to a single line in
  JSON-LD.
- The `<!-- exentax:execution-v2 -->` and `<!-- exentax:cta-v1 -->`
  markers are load-bearing. Never remove them; they anchor the
  per-article method block and the final CTA injection.
- Never edit `BLOG_POSTS` or `BLOG_SLUG_I18N` to introduce a slug change
  on a URL that is already public. Use a 301 redirect in
  `server/routes/public.ts` instead. Search Console rebuild time after a
  rename costs weeks of position.

## 8. Local execution cheatsheet

```sh
# 1. Scaffold a new article
node exentax-web/scripts/blog-new-article.mjs my-new-slug "Mi título en español" \
    --cluster=BANKING_STACK --category=Operativa

# 2. Edit the six files, then verify
cd exentax-web
node scripts/blog/blog-consistency-check.mjs
node scripts/blog/blog-masterpiece-audit.mjs

# 3. Push (pre-push runs the full quality pipeline)
git push

# 4. After deploy, ping search engines
node scripts/blog-indexnow-606.mjs
```

## 9. Where to look when something breaks

| Symptom                                              | Start at                                        |
|------------------------------------------------------|-------------------------------------------------|
| 404 on `/<lang>/blog/<slug>`                          | `BLOG_SLUG_I18N` and `blog-content/<lang>/`     |
| Hreflang mismatch / Search Console alternate errors  | `SEO.tsx` + `server/routes/public.ts` sitemap   |
| Empty FAQ rich result on a known-FAQ article         | `blog-faq-extract.ts` regex for the language    |
| "Critical" in the masterpiece audit                  | Output of `blog-masterpiece-audit.mjs` (`reports/seo/baseline-606.md`) |
| Parity failure in the consistency check              | The five registries listed in §1                |
| Sitemap doesn't update                               | `blogSitemapCache` TTL in `server/routes/public.ts` |

---

## 10. Validation suite (10 gates)

Single command to run every blog quality gate:

```bash
npm run blog:validate-all              # 10 offline gates
npm run blog:validate-all -- --with-external   # adds source-URL ping
```

The orchestrator is also wired into `npm run check` (between
`seo:masterpiece-strict` and `i18n:check`) and into the `pre-push` hook
installed by `scripts/install-git-hooks.sh`.

| #  | Step id            | Script                              | Severity contract                                                                 |
|---:|--------------------|-------------------------------------|-----------------------------------------------------------------------------------|
|  1 | `consistency`      | `blog-consistency-check.mjs`        | 5-registry parity (BLOG_POSTS ↔ es files ↔ BLOG_SLUG_I18N ↔ SOURCES_BY_SLUG ↔ per-locale content). |
|  2 | `content-lint`     | `blog-content-lint.mjs`             | Forbidden price/address mentions; no fear-of-Hacienda phrasing; allow-list.        |
|  3 | `internal-links`   | `seo-check-links.mjs`               | Zero broken `/<lang>/blog/<slug>` links; ≥ 3 incoming contextual links per ES post.|
|  4 | `locale-link-leak` | `blog-link-locale-lint.mjs`         | No cross-language link leak inside an article body.                                |
|  5 | `cta`              | `blog-cta-validate.mjs`             | `/<lang>#calculadora` present in every article; no leaks; React surface intact.    |
|  6 | `data`             | `blog-data-validate.mjs`            | Dates, meta-length budget, per-locale + cross-locale uniqueness, orphan years, category↔keywords coherence. |
|  7 | `sources`          | `blog-sources-validate.mjs`         | Every ES slug declared, ≥ 3 refs each, every `{doc, section}` resolves.            |
|  8 | `faq-jsonld`       | `seo-faq-jsonld-check.mjs`          | FAQPage JSON-LD wires to the rendered tree; every Q/A is translated.               |
|  9 | `sitemap`          | `seo-sitemap-check.mjs`             | Sitemap shape, hreflang round-trip, every URL responds 2xx/3xx.                    |
| 10 | `masterpiece-audit`| `blog-masterpiece-audit.mjs`        | v2 editorial rules (calc-cta marker, sources block, year-in-prose, length).        |

Optional (network) — `--with-external`:

| Step id            | Script                                | Notes                                                                                     |
|--------------------|---------------------------------------|-------------------------------------------------------------------------------------------|
| `external-sources` | `blog-verify-source-urls.mjs`         | HEAD/GET ping of the 27 canonical authority URLs (IRS, FinCEN, OECD, EUR-Lex, BOE, AEAT). |

Severity model (data gate): `metaTitle > 60` → critical (SERP truncation),
`metaDescription` outside 70..155 → critical, `title > 110` → critical,
`title > 75` → warning (translation-aware allowance for DE/PT/CA).

Adding a step:

1. Create the script under `exentax-web/scripts/` with the standard
   `import.meta.url === file://${process.argv[1]}` guard.
2. Append the entry to the `STEPS` array in `blog-validate-all.mjs`.
3. Document its contract in this section AND in `blog-validation.md`.

## 11. Sources validator (offline)

`blog-sources-validate.mjs` is the **structural + liveness** gate for
`client/src/data/blog-sources.ts`. It does NOT itself touch the network.
The network probe is `blog-verify-source-urls.mjs`, which writes the
ping cache at `reports/seo/source-url-verification.json`. The structural
gate **requires** that cache: it must exist, be < 14 days old, and
report zero dead authority URLs (Cloudflare-gated 403s are treated as
alive, matching the verifier's convention). A missing, stale, or
dead-URL-bearing cache is **CRITICAL** and fails CI — refresh by running
`node scripts/blog/blog-verify-source-urls.mjs`. This is what enforces
external-source liveness on every `npm run check` without paying the
network round-trip on each invocation.

What it asserts:

- Every ES slug under `blog-content/es/` is a key in `SOURCES_BY_SLUG`.
- No orphan keys in `SOURCES_BY_SLUG` (slug must exist in ES content).
- Each entry has ≥ 3 references.
- Each `{doc, section}` resolves to a real `DOC_REGISTRY` entry whose
  `sections` Record contains the matching section id.
- No duplicate `{doc, section}` pair within a single slug bundle.
