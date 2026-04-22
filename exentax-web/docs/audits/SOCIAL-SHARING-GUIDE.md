# Social Sharing Guide — Open Graph & Twitter Cards

This guide describes how Exentax composes social previews (Facebook / LinkedIn / WhatsApp via Open Graph and X / Twitter via Twitter Cards) for every page on every supported language: **es, en, fr, de, pt, ca**.

It is the reference companion to the audit deliverables in this folder:
- `previews-audit.json` — full inventory of every static page, service subpage and blog post (130 entries × 6 languages = 780 records) with their effective OG/Twitter copy and any issues detected.
- `previews-optimizadas.json` — snapshot of the optimized OG copy now persisted in the i18n bundles.

## Tech stack

The single `<SEO>` component (`exentax-web/client/src/components/SEO.tsx`) renders every social tag at runtime:

| Tag | Source |
| --- | --- |
| `og:title` | `ogTitle` prop, falls back to `title` (= meta title) |
| `og:description` | `ogDescription` prop, falls back to `description` (= meta description) |
| `og:image` | Always `${SITE_URL}/og-image.png` |
| `og:image:width` / `height` | `1200 × 630` |
| `og:image:type` | `image/png` |
| `og:type` | Explicit `ogType` prop (defaults to `website`; blog posts pass `article`) |
| `og:url` | Localized canonical URL |
| `og:site_name` | "Exentax" |
| `og:locale` | `LOCALE_MAP[lang]` (see below) |
| `twitter:card` | `summary_large_image` |
| `twitter:title` | `og:title` |
| `twitter:description` | `og:description` |
| `twitter:image` | `og:image` |
| `twitter:image:alt` | i18n key `seo.twitterAlt` (per language) |
| `twitter:site` | `BRAND.TWITTER_HANDLE` |

### Locale mapping

The hreflang/lang code is mapped to a region-specific Open Graph locale:

```ts
const LOCALE_MAP = {
  es: "es_ES",
  en: "en_US",
  fr: "fr_FR",
  de: "de_DE",
  pt: "pt_PT", // ← fixed in this task (was previously pt_BR)
  ca: "ca_ES",
};
```

`pt` resolves to **Portuguese (Portugal)** because the Exentax PT bundle is written in European Portuguese (the bundle uses forms such as "a sua", "consultor" and PT-PT spellings). Brazilian Portuguese is not a supported language at this time.

## Copy rules

| Field | Min | Soft cap | Hard max | Notes |
| --- | --- | --- | --- | --- |
| `og:title` | 20 | 55 | **60** | Lead with the value proposition. **Must differ** from `metaTitle`. |
| `og:description` | 120 | 150 | **160** | Persuasive social sentence. **Must differ** from `metaDescription`. |
| `og:image` | — | — | — | **Always** `/og-image.png` (1200×630). Do **not** add per-page images. |

Language-specific guidelines:

- **ES / CA** — usar tuteo, tono directo, hook + diferencial.
- **EN** — concise, founder-grade tone, avoid filler ("the best…", "amazing…").
- **FR** — vouvoiement neutro, evita anglicismos en el título.
- **DE** — frase clara, sustantivos en mayúscula, sin signos extranjeros raros.
- **PT** — português europeu (a sua / consultor / fiscalidade / consulta).

## Where the copy lives

### Static pages (14 namespaces × 6 languages)

`exentax-web/client/src/i18n/locales/<lang>.ts`. Each page block carries:

| Namespace | Page route | i18n keys |
| --- | --- | --- |
| `homePage` | `/` | `homePage.{seoTitle, seoDesc, ogTitle, ogDesc, seoKeywords}` |
| `serviciosPage` | `/our-services` | `serviciosPage.{seoTitle, seoDesc, ogTitle, ogDesc}` |
| `comoFuncionaPage` | `/how-we-work` | `comoFuncionaPage.{seoTitle, seoDesc, ogTitle, ogDesc}` |
| `reservarPage` | `/book` | `reservarPage.{seoTitle, seoDesc, ogTitle, ogDesc}` |
| `llcUsPage` | `/about-llc` | `llcUsPage.{seoTitle, seoDesc, ogTitle, ogDesc}` |
| `faqPage` | `/faq` | `faqPage.{seoTitle, seoDesc, ogTitle, ogDesc}` |
| `legal.terminos` | `/legal/terms` | `legal.terminos.{seoTitle, seoDescription, ogTitle, ogDescription}` |
| `legal.privacidad` | `/legal/privacy` | same shape |
| `legal.cookies` | `/legal/cookies` | same shape |
| `legal.reembolsos` | `/legal/refunds` | same shape |
| `legal.disclaimer` | `/legal/disclaimer` | same shape |
| `links` | `/{lang}/links` | `links.{seoTitle, seoDescription, ogTitle, ogDescription}` (page is `noindex` but still shareable) |
| `start` | `/{lang}/start` | `start.{seoTitle, seoDescription, ogTitle, ogDescription}` (`noindex`) |
| `blogPost` (index) | `/{lang}/blog` | `blogPost.{seoTitle, seoDescription, ogTitle, ogDescription}` |

### Service subpages (5 × 6 = 30 records)

`exentax-web/client/src/i18n/data/subpages.ts`. Each `<lang>.{llcNm,llcWy,llcDe,llcFl,itin}.seo` carries `title / description / keywords / ogTitle / ogDescription`. Wired in `pages/services/ServiceSubpage.tsx`.

### Blog posts (111 × 6 = 666 records)

| File | Contents |
| --- | --- |
| `exentax-web/client/src/data/blog-posts.ts` | ES master list with `slug, metaTitle, metaDescription, socialDescription?` |
| `exentax-web/client/src/data/blog-i18n/<lang>.ts` | Localized `metaTitle`, `metaDescription`, optional `socialDescription` |

`pages/blog/post.tsx` renders:

- `og:title` ⇐ explicit `ogTitle` per post — derived from `post.title` (the editorial title, deliberately distinct from the SEO `metaTitle`). Truncated to ≤60 chars at a clean clause boundary if needed.
- `og:description` ⇐ explicit `ogDescription` per post — derived from `post.excerpt` (the editorial excerpt, deliberately distinct from the SEO `metaDescription`) and padded with a *complete* per-language Exentax brand-voice tail to land in 120–160 chars.
- `og:image` ⇐ `/og-image.png` (uniform brand card).

All 111 posts × 6 langs (666 records) carry an explicit `ogTitle` and `ogDescription` that **must differ from `metaTitle`/`metaDescription`**. To regenerate from source, run:

```bash
node exentax-web/scripts/seo/inject-blog-og.mjs
```

The injector is destructive (overwrites existing values) and guarantees:

1. Source of truth is `title`/`excerpt`, not the meta fields, so social copy never duplicates SEO copy.
2. Tail clauses are appended **only when whole**; never truncated mid-word. The picker keeps a pool of short and long sentences per language and chooses the longest pair that fits the 120–160 window.
3. If `title` happens to equal `metaTitle`, a `| Exentax` brand suffix is appended (and the title is re-truncated if needed) to force distinctness.

## Workflow for adding a new page

1. Add `seoTitle`, `seoDescription`, `ogTitle`, `ogDescription` keys to **all six** locale bundles.
2. Pass them in the page component:
   ```tsx
   <SEO
     title={t("yourPage.seoTitle")}
     description={t("yourPage.seoDescription")}
     ogTitle={t("yourPage.ogTitle", { defaultValue: "" }) as string || undefined}
     ogDescription={t("yourPage.ogDescription", { defaultValue: "" }) as string || undefined}
     path={lp("yourPage")}
   />
   ```
3. Re-run the audit & validation:
   ```bash
   npx tsx exentax-web/scripts/seo/audit-social-previews.ts
   node exentax-web/scripts/seo/validate-social-previews.mjs
   ```
4. Optional: validate live previews with the official debuggers
   - https://developers.facebook.com/tools/debug/
   - https://www.linkedin.com/post-inspector/
   - https://cards-dev.twitter.com/validator (X)

## CI integration

A combined wrapper is provided so CI pipelines can run the audit + the
validator in a single call:

```bash
bash exentax-web/scripts/seo/check-social-previews.sh
```

The script regenerates `docs/audits/previews-audit.json` and then runs
`scripts/seo/validate-social-previews.mjs`. It exits non-zero on any
error and is the recommended hook for pre-merge / pre-deploy checks.
Note: `package.json` is intentionally not edited (project rule for this
audit), so wire the wrapper into CI from the workflow definition.

## Validation gates

`scripts/seo/validate-social-previews.mjs` (run after the audit, also wrapped
by `scripts/seo/check-social-previews.sh`) is **mandatory** and fails if:

- The `LOCALE_MAP` does not match `{es:es_ES, en:en_US, fr:fr_FR, de:de_DE, pt:pt_PT, ca:ca_ES}`.
- A required static namespace, service subpage or blog post is missing `ogTitle` or `ogDescription` (every covered entry must be explicit, no fallback allowed).
- Any effective `ogTitle` is outside `[20, 60]` chars or `ogDescription` is outside `[120, 160]` chars (applied uniformly to static pages, subpages and blog posts).
- The blog inventory diverges across languages (each of the 6 langs must report the same number of records).
- **`ogTitle` equals `metaTitle`** or **`ogDescription` equals `metaDescription`** for any covered entry — duplication of SEO copy is forbidden.
- Any `ogTitle` or `ogDescription` ends on a per-language trailing **stop word** (article / preposition / conjunction) — guards against awkward truncations like "…guide for" or "…per a no residents el".
- The `og:image` asset referenced by `SEO.tsx` (`/og-image.png`) is missing from `client/public/`.

## Image policy

- **Do not** modify or replace `client/public/og-image.png`.
- **Do not** add per-page OG images. The single brand card is part of the brand system audit (Task #5) and must remain stable across the site, which also keeps cache hit-rate high in third-party crawlers.
- The validator now asserts the file exists at `client/public/og-image.png`; the SEO component serves it from the absolute path `/og-image.png` so every locale and route resolves to the same canonical image.

## Mandatory external-preview QA (per language)

After every change to social copy or the OG/Twitter pipeline, capture the
rendered preview for **at least one static page and one blog article per
language** across Facebook (Sharing Debugger), Twitter (Card Validator),
LinkedIn (Post Inspector) and WhatsApp (paste link in a chat) and tick the
checklist below. The reference samples used for this audit pass:

| Lang | Static sample (`terminos`) — ogTitle (len) | Blog sample (`llc-estados-unidos-guia-completa-2026`) — ogTitle (len) |
| --- | --- | --- |
| es | "Términos y condiciones de Exentax" (33) | "LLC en Estados Unidos: guía completa para no residentes" (55) |
| en | "Exentax Terms and Conditions" (28) | "LLC in the United States: complete guide for non-residents" (58) |
| fr | "Conditions générales d'Exentax" (30) | "LLC aux États-Unis : guide complet pour non-résidents" (53) |
| de | "AGB von Exentax · Exentax" (25) | "LLC in den USA: vollständiger Leitfaden" (39) |
| pt | "Termos e condições da Exentax" (29) | "LLC nos Estados Unidos: guia completo para não residentes" (57) |
| ca | "Termes i condicions d'Exentax" (29) | "LLC als Estats Units: guia completa per a no residents" (54) |

For each sample, verify on every platform:

- [ ] **Facebook** — Sharing Debugger: title, description, image and `og:locale` render correctly; no warnings about missing tags.
- [ ] **Twitter / X** — Card Validator: card type is `summary_large_image`; title, description and image preview are correct.
- [ ] **LinkedIn** — Post Inspector: title and description match the `og:` source; image displays at the expected aspect ratio.
- [ ] **WhatsApp** — pasting the URL in a chat shows the brand card with the correct localized title and description (no truncation mid-word, no dangling articles or prepositions).

Record the date of the QA pass and the URLs sampled in the PR description so
reviewers have a traceable evidence trail. Per repo policy and Task #9 image
policy, do not capture screenshots into the repo (they bloat the bundle and
diverge from the live previews) — link them from the PR/Linear ticket
instead.
