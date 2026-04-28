# Blog structure (Task #7 reference)

This document describes the data layout, runtime composition and editorial
contracts for the Exentax blog. It is the source of truth that the automated
guard `scripts/check-blog-links.ts` enforces.

## 1. Languages

Six languages are supported. Spanish is the canonical source.

| Code | Language   | Booking slug | Calculator entry           |
|------|------------|--------------|----------------------------|
| es   | Español    | `agendar`    | `/es#calculadora` (anchor) |
| en   | English    | `book`       | `/en#calculadora`          |
| fr   | Français   | `reserver`   | `/fr#calculadora`          |
| de   | Deutsch    | `buchen`     | `/de#calculadora`          |
| pt   | Português  | `agendar`    | `/pt#calculadora`          |
| ca   | Català     | `agendar`    | `/ca#calculadora`          |

The booking slugs live in `shared/routes.ts` (`ROUTE_SLUGS.book`). The
calculator is a section on the localized home page; there is no dedicated
`/<lang>/calculadora` route.

## 2. File layout

```
client/src/data/
├── blog-posts.ts                # BLOG_POSTS metadata array (~101 entries)
├── blog-posts-slugs.ts          # BLOG_SLUG_I18N: ES → translated slug map
├── blog-i18n/<lang>.ts          # localized title/excerpt/headings per lang
└── blog-content/
    ├── es/<slug>.ts             # canonical Spanish article body
    ├── en/<slug>.ts             # English translation (uses ES slug as filename)
    ├── fr/<slug>.ts
    ├── de/<slug>.ts
    ├── pt/<slug>.ts
    └── ca/<slug>.ts
```

Every `<slug>.ts` file exports a single template-literal string of Markdown
augmented with HTML anchors and the two CTA marker blocks described below.

## 3. CTA contract

Every article carries **exactly two** CTA blocks, each wrapped in HTML
comments so they can be located, regenerated and audited safely:

```html
<!-- exentax:calc-cta-v1 -->
> Calcula tu escenario real…
<!-- /exentax:calc-cta-v1 -->

…body…

<!-- exentax:cta-v1 -->
Cada caso tiene matices… <a href="/es/agendar">Reserva una consulta…</a>
<!-- /exentax:cta-v1 -->
```

* `calc-cta-v1` — mid-article hook into the localized calculator
  (`/<lang>#calculadora`).
* `cta-v1` — final booking CTA into the localized booking page
  (`/<lang>/<book-slug>`).

Booking links and WhatsApp links **must** live inside one of these blocks.
Any other inline link to the booking page is treated as a duplicate CTA and
will be flagged by the validator.

## 4. Internal-link rules

* Article-to-article links must use the **same language** as the file:
  `/en/blog/<en-slug>` only inside `client/src/data/blog-content/en/…`.
* The slug must exist in `BLOG_SLUG_I18N` for that language. Missing slugs
  fall back to the Spanish form, which is also accepted.
* Non-blog routes must be registered in `shared/routes.ts`. The validator
  rejects links to `/<lang>/contact*`, `/<lang>/calculator*`, etc.
* The calculator is reached via the localized home anchor
  `/<lang>#calculadora` (no dedicated route).

## 5. Related-articles block

`client/src/pages/blog/post.tsx` renders **one** related-articles section
per article (`RelatedReadsBlock`, the bottom grid of three cards titled
with `t("blogPost.relatedTitle")`). The previously duplicated sidebar
variant was removed in Task #7.

## 6. Renderable safety

The validator scans every article body for the literal English token
`undefined`, which has no editorial use in any of the six languages and
therefore reliably indicates a leaked unbound variable. `null` and `NaN`
are intentionally not flagged because they appear in legitimate German,
French and Catalan prose (`Null-Steuer`, `null Steuern`).

## 7. Validation

```bash
# from exentax-web/
npx tsx scripts/check-blog-links.ts        # editorial integrity (Task #7)
node scripts/blog/blog-content-lint.mjs         # forbidden price/fee mentions (Task #8)
node scripts/blog/blog-link-locale-lint.mjs     # cross-language link guard
```

All three exit non-zero on findings and are safe to wire into CI.

## 7b. Per-article Sources block (Task #12)

The styled "Sources / Fuentes / Quellen / Fontes / Fonts" block at the
bottom of every article is rendered automatically and is **not** written
by hand in the Markdown body. The data lives in
`client/src/data/blog-sources.ts` (`DOC_REGISTRY` + `SOURCES_BY_SLUG`)
and the renderer is `client/src/pages/blog/post.tsx`. The full
convention, the list of citable internal documents and the lint rules
are documented in `docs/blog-sources.md`. The lint script is:

```bash
npx tsx exentax-web/scripts/check-blog-sources.ts
```

It must exit `0` on a clean tree.

## 8. One-shot fixer

`scripts/blog-fix-broken-links.mjs` is the idempotent batch fixer that was
used to clean up the pre-Task #7 backlog. It rewrites calculator links to
the localized home anchor, delinks contact references, repairs wrong-slug
booking links and delinks any booking CTA living outside the marker blocks.
