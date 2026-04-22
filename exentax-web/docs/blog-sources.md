# Blog Sources convention (Task #12)

Every blog article must end with a visually-distinct **Sources / Fuentes**
block listing the internal Exentax editorial documents that actually back
the article. The block is rendered automatically; **do not write a
`Sources:` line by hand in the Markdown body**.

Until April 2026 every article shipped with the same hardcoded literal
line just before the CTA:

```
Sources: `docs/banking-facts-2026.md` §BOI/CTA and §Form 5472.
```

That line was wrong on most articles (the topic had nothing to do with
BOI/CTA or Form 5472) and exposed the raw `docs/...md` path to readers.
Task #12 deleted those lines from every article in every locale and
replaced them with the data-driven block described below.

## Where the block comes from

- Catalog of citable documents: `client/src/data/blog-sources.ts`
  → `DOC_REGISTRY`. Each document declares an id, the file path inside
  the repo (used by the lint script only — never shown to the reader),
  a reader-facing label translated into the 6 supported languages, and
  a list of named sections.
- Per-article assignment: same file → `SOURCES_BY_SLUG`, keyed by
  Spanish base slug (the slug under `client/src/data/blog-content/es/`).
  Each entry is an array of `{ doc, section }` refs.
- Renderer: `client/src/pages/blog/post.tsx` calls
  `renderSourcesBlockHtml(slug, lang)` and inserts the resulting
  `<aside class="article-sources">` block right before the final CTA
  marker (`<!-- exentax:cta-v1 -->`).

## What the reader sees

```
SOURCES
Exentax Banking Facts 2026  ·  Form 5472 + pro-forma 1120
Exentax Banking Facts 2026  ·  BOI / Corporate Transparency Act
Exentax Fact-Check 2026      ·  Editorial audit report 2026
```

- Heading label is translated:
  `Fuentes` (es), `Sources` (en), `Sources` (fr), `Quellen` (de),
  `Fontes` (pt), `Fonts` (ca).
- Document labels are reader-friendly ("Exentax Banking Facts 2026")
  and never show the raw file path.
- Section labels describe the section in the language of the post
  (e.g. "Form 5472 + pro-forma 1120" / "Form 5472 + 1120 pro-forma").
- The block is wrapped in a hairline-bordered `<aside>` styled by
  `.article-sources` rules in `client/src/index.css`, clearly
  separated from the body and from the final CTA.

## Citable documents

| Doc id | Path | When to cite |
|---|---|---|
| `banking-facts-2026` | `exentax-web/docs/banking-facts-2026.md` | Anything about Mercury, Slash, Relay, Wallester, Wise Business, Revolut Business, Stripe, Payoneer, IBKR, Kraken, recommended stacks, BOI/CTA, Form 5472 + pro-forma 1120, Form 1120 (substantive), CRS, FATCA, primary IRS / FinCEN / OECD / EUR-Lex / BOE sources. |
| `fact-check-2026` | `exentax-web/docs/fact-check-2026.md` | When the article relies on the editorial fact-check audit (e.g. correctness of LLC fundamentals, banking-stack claims, comparison content). |
| `tax-content-annual-review` | `exentax-web/docs/tax-content-annual-review.md` | When the article cites the annually-verified IRS figures (Pub. 515 / 901, W-8BEN-E, Form 1042-S, treaty rates). |
| `veracity-audit` | `exentax-web/docs/veracity-audit.md` | When the article relies on the editorial veracity criteria (no-promise framing, conditional language, residencia-fiscal disclaimers). |

Adding a new document means adding it to `DOC_REGISTRY` (with all six
language labels and the heading-match strings for each section), then
listing the relevant section ids in the `SOURCES_BY_SLUG` entry of every
article that should cite it.

## How to assign sources to a new article

1. Add the new Markdown body under
   `client/src/data/blog-content/<lang>/<slug>.ts` for every supported
   language. **Do not** include a `Sources:` line in the body.
2. Add an entry in `SOURCES_BY_SLUG` (`client/src/data/blog-sources.ts`)
   keyed by the Spanish slug. Pick one of the existing topic bundles
   (`BANKING_STACK`, `BOI_5472`, `CRS_FATCA`, `LLC_FUNDAMENTALS`,
   `SPAIN_TAX`, `INTL_JURISDICTIONS`, `NICHE_BUSINESS`, `W8_BROKER`)
   or compose a fresh array of refs. Two to four refs is the typical
   shape; one ref is fine when the topic is narrow.
3. Run the lint script (see below). It must exit `0`.

## Lint script

```bash
npx tsx exentax-web/scripts/check-blog-sources.ts
```

The script enforces:

- Every base slug in `client/src/data/blog-content/es/` is present in
  `SOURCES_BY_SLUG` with at least one ref.
- No duplicate refs for a single slug.
- Every ref points to a real `(doc, section)` pair in `DOC_REGISTRY`.
- Every section's `headingMatch` string is still present in the
  underlying `.md` file (so we don't silently cite a section that has
  been renamed or deleted).
- No article in any locale contains a leftover legacy `Sources:`,
  `Fuentes:`, `Quellen:`, `Fontes:` or `Fonts:` line.
- No article in any locale leaks a raw `docs/<slug>.md` path to the
  reader.

If you need to mass-strip legacy `Sources:` lines after a content
import, run the one-shot cleanup once and then re-run the linter:

```bash
node exentax-web/scripts/cleanup-blog-sources.mjs
npx tsx exentax-web/scripts/check-blog-sources.ts
```
