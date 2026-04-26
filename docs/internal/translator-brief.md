# Translator brief — Native review (EN / FR / DE / PT / CA)

> Audience: native-speaker reviewer hired per language (5 reviewers
> total, one per locale). This brief is the single source of truth
> for what to revise, in what register, and how to deliver feedback.
> Reading time: 10 min. Hand this file to the reviewer on day 1.

Date: 2026-04-26 · Maintainer: Exentax web team · Repo branch:
`claude/exentax-web-dev-2V0zr`. Updates land via PR; comment in the
issue tracker, not in the file directly.

---

## 1. Scope

You are doing **native review of UI strings + 112 blog articles per
language** (≈ 1.300 paragraphs of long-form copy plus the SEO blurbs
that wrap them). The repository is multi-locale by construction
(`es / en / fr / de / pt / ca`); you only touch your assigned locale.

Three concrete file trees are in scope:

- **i18n strings** live in `exentax-web/client/src/i18n/locales/{lang}.ts`
  (~1552 keys per file, kept identical in shape across all six locales).
  Each key is a leaf string used by a React component. Do **not** rename
  keys — only edit the right-hand side string value.
- **Blog content** per language under
  `exentax-web/client/src/data/blog-content/{lang}/*.ts`. One file per
  article (e.g. `crs-residentes-espana-latam-implicaciones.ts`). The
  body is a tagged-template Markdown string after `export default \``.
- **SEO blurbs** (title + metaDescription + Twitter alt + JSON-LD
  facets) under `exentax-web/client/src/data/blog-i18n/{lang}.ts`.

Out of scope: code, slugs, hreflang, CTA URLs, JSON-LD field names.

## 2. Per-language style guide

One block per language. Apply consistently across UI + blog + SEO.

### EN-US — American business register

Audience: US-based freelancers and entrepreneurs forming an LLC.
Tone is direct and confident, never marketing-fluffy. Calls to action
must be **idiomatic**: write **"Get your LLC started today"**, not
"Book now" (literal calque). Avoid Spanish-syntax tells: "do the
necessary management" → "handle the paperwork"; "in case of doubt"
→ "if you have questions". Use the Oxford comma. Numbers: `$1,500`
not `$1.500`. Dates: `April 26, 2026`. Contractions are fine in
body copy and CTAs ("you'll", "won't"); spell out in legal callouts.
Keep sentences ≤ 25 words on average; break compound subordinates
into two sentences. Headings in **sentence case**, not Title Case.

### FR-FR — Registre parisien professionnel

Public cible : indépendants, auto-entrepreneurs, dirigeants de TPE.
Registre soutenu mais accessible (vouvoiement obligatoire). Substituer
systématiquement "**indépendant / auto-entrepreneur**" à "autónomo"
(jamais laisser le calque espagnol) ; "société" et non "compañía".
Espace insécable avant `: ; ! ?` et autour de `« »`. Dates : `26 avril
2026`. Nombres : `1 500 €` (espace fine, jamais virgule décimale dans
les milliers). Éviter les anglicismes inutiles (`call to action` →
"appel à l'action" ; `template` → "modèle"). Phrases courtes (max 22
mots). Pas de point final dans les titres ni dans les CTA.

### DE-DE — Direkt, technisch, präzise

Zielgruppe: Selbstständige im DACH-Raum. Aktiv schreiben — Passiv-
konstruktionen aktiv vermeiden ("Es wird empfohlen, dass…" →
"Wir empfehlen…"). **Höchstens 25 Wörter pro Satz**; lange Sätze
spalten. Komposita zulassen, aber nicht erfinden ("Steuerberatung",
"GmbH-Gründung" — ja; "LLCGründungsverfahren" — nein, getrennt
schreiben). Du-Form vermeiden, Sie-Form verwenden. Zahlen:
`1.500 €` (Tausenderpunkt, Komma-Dezimal). Datum: `26. April 2026`.
Anglizismen nur wo etabliert (`Stripe`, `LLC`, `Reporting`). Keine
englischen Marketing-Floskeln ("powerful", "seamless").

### PT-PT — Português europeu, sem brasileirismos

Variante PT-PT estrita. **Não usar PT-BR** (veja a lista completa em
`scripts/audit-pt-pt.mjs`, que serve de gate automatizado para o
texto). Substituições obrigatórias: "registo" (não "registro");
"facto" (não "fato"); "ficheiro" (não "arquivo"); "equipa"
(não "equipe"); "telemóvel" (não "celular"); "ecrã" (não "tela");
"está a fazer" (não "está fazendo"). Evitar "você" — preferir 3.ª
pessoa formal ou "o leitor". Mesóclise/ênclise em uso normal
("pode registar-se" e não "pode se registar"). Detalhe no documento
`docs/auditoria-multiidioma/cierre-pendientes-2026-04.md §3.2`.

### CA — Català formal

Públic objectiu: autònoms, empresaris i professionals de Catalunya,
Illes Balears i País Valencià. Registre formal estàndard. Tractament:
sempre **"vostè"** (no "tu") en CTAs, formularis i correus
transaccionals. Utilitzar el català central, no dialectal. Numerals:
`1.500 €`. Dates: `26 d'abril de 2026`. Lèxic preferent: "empresa"
(no "companyia"), "registre" (no "registro"), "termini" (no "plaç"),
"factura" (no "rebut" si parlem de facturació). Apostrofar
correctament `l'empresa`, `d'autònom`. Evitar castellanismes:
"però" (no "pero"), "doncs" (no "pues"), "perquè" (no "porque").

## 3. Scoring rubric

For each string you touch, fill a per-string score 0-3:

| Score | Meaning | Action |
|---|---|---|
| **0** | **Wrong meaning.** Translation says something different from ES, or is grammatically wrong. | **Fix required.** |
| **1** | **Awkward but right.** Native reader notices it sounds off / is too literal. | **Fix required.** |
| 2 | Passable. A native would not flag it, but it's not how they would write it. | No fix needed. |
| 3 | Native-quality. Reads as if originally written in the target language. | No fix needed. |

Only **0 and 1** require a fix. Do **not** churn passable copy (`2`)
on stylistic preference — we ship what works. Track scores in your
issue checklist (see §4).

## 4. Workflow

The reviewer uses **GitHub Issues** with the
`i18n-review-{lang}` label (e.g. `i18n-review-pt`, `i18n-review-fr`).
**One issue per file** — that is, one issue per blog article and one
issue per `locales/{lang}.ts`. Issue title format:
`[i18n-review-{lang}] {file path}`. Body has a checklist of the strings
that score ≤ 1, with: line number, original ES, current target,
proposed fix, score, one-line rationale. PRs cite the issue
(`Fixes #NNN`). Do **not** open issues for `2/3` strings. Cap at
~30 fixable findings per issue; split larger files into ranges.

## 5. Tools that already help

Run all commands from `exentax-web/`:

- **`npm run i18n:check`** (alias of `tsx scripts/validate-i18n.ts`) —
  flags entries identical to ES (likely untranslated). Useful before
  starting a file: shows where the LLM gave up.
- **`node scripts/blog-translation-quality-audit.mjs`** — writes
  `docs/auditoria-multiidioma/blog-translation-quality.{json,md}`
  with PT-BR leakage hits and consecutive-paragraph duplicates. Good
  for a first PT-PT triage pass.
- **`node scripts/audit-pt-pt.mjs`** — the strict PT-PT lint that
  enforces the substitution table in §2 (PT-PT block). PT reviewer
  should run this on every PR before pushing.

## 6. Estimated effort

**20-40 hours per language**, depending on baseline quality and how
many strings score ≤ 1. Average is closer to the lower bound (≈ 5 days
FTE per language) on this codebase because the i18n keys are short and
the blog is already structurally aligned across locales (1.552 keys
× 6 locales, no missing slots; only the prose needs polishing).

Aggregate: **5 reviewers × 5 days = 25 days FTE total**. Useful as
cost benchmark for the buyer. Pay per-hour or fixed per-language; we
recommend a fixed price quote against this brief and the rubric in §3.

---

End of brief. Questions about the repo: open an issue with label
`i18n-review-meta` and tag the maintainer.
