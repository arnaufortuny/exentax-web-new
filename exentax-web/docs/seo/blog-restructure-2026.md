# Blog restructure 2026 — Task #15

## Context

- **Task #1** rewrote the 101-article ES master with a new H2/H3 structure (deeper sections, new headings).
- **Task #3** cloned the ES master skeleton into the 5 non-ES locales (EN, FR, DE, PT, CA) without an LLM, so the non-ES files keep their previously translated bodies but reflect the *old* ES structure.
- **Task #4** added `scripts/blog-final-qa.mjs`, which reports H2/H3 count parity per `(slug, lang)` against the ES master.
- **Task #15 (this one)** brings every non-ES article into structural parity with the ES master while keeping content native (idiomatic translation, not literal).

## Snapshot — before

Run: `npm run blog:final-qa`

```
Lang | present | <3000 | em-dash | CTAs!=2 | broken | metaTitle | metaDesc | dups
es   |     101 |     0 |       0 |       0 |      0 |         0 |        0 |    0
en   |     101 |     0 |       0 |       0 |      0 |         0 |        0 |    0
fr   |     101 |     0 |       0 |       0 |      0 |         0 |        0 |    0
de   |     101 |     0 |       0 |       0 |      0 |         0 |        0 |    0
pt   |     101 |     0 |       0 |       0 |      0 |         0 |        0 |    0
ca   |     101 |     0 |       0 |       0 |      0 |         0 |        0 |    0

Structural deltas vs ES: 484
```

Distribution of the 484 deltas:

| Lang | Files with delta |
|------|------------------|
| EN   | 95 / 101         |
| FR   | 98 / 101         |
| DE   | 98 / 101         |
| PT   | 97 / 101         |
| CA   | 96 / 101         |

Magnitude (`|Δh2| + |Δh3|`):

| Magnitude | Files |
|-----------|-------|
| 1         | 105   |
| 2         | 143   |
| ≥ 3       | 236   |

Average delta per file: **3.66 headings**. All 101 ES slugs have at least one non-ES sibling out of parity.

## Tooling

### `scripts/blog-restructure-non-es.mjs`

LLM-driven, idempotent restructurer. For each pending `(slug, lang)` it sends the LLM:

1. The ES master body (structural authority).
2. The current non-ES body (voice / glossary / CTA paths / Sources block to preserve).
3. A constrained prompt requiring: exact H2/H3 counts, native idiomatic translation, preserved `<!-- exentax:calc-cta-v1 -->` marker, exactly 2 localized CTAs, preserved Sources block, ≥ 3000 chars.

Each output is validated programmatically against 7 rules before being written:

1. H2 count == ES master.
2. H3 count == ES master.
3. Heading **sequence** (level-by-level) matches ES master 1:1 (catches re-orderings the count check would miss).
4. `exentax:calc-cta-v1` marker block present (open + close).
5. Exactly **1 booking CTA** (`/lang/{book|reserver|reserva|agendar|...}`) AND exactly **1 calculator CTA** (`/lang/{calculator|calculatrice|rechner|calculadora}`).
6. Sources / Fuentes / Quellen / Fontes / Fonts block preserved if it existed in the current version.
7. All `/lang/blog/<slug>` internal links from the current version preserved.

A single auto-retry with explicit error feedback is performed before declaring failure. Successful slugs are recorded in `.local/blog-restructure-checkpoint.json` and skipped on subsequent runs.

### Provider auto-detection

| Env var               | Provider  | Default model         |
|-----------------------|-----------|-----------------------|
| `ANTHROPIC_API_KEY`   | Anthropic | `claude-sonnet-4-5`   |
| `OPENAI_API_KEY`      | OpenAI    | `gpt-4o-mini`         |

Override with `--provider {anthropic|openai}` and `--model <name>`.

### Usage

```bash
# Pilot a small batch first to validate quality and cost.
ANTHROPIC_API_KEY=... npm run blog:restructure -- --limit 5

# Full run (resume-safe; reads .local/blog-restructure-checkpoint.json).
ANTHROPIC_API_KEY=... npm run blog:restructure

# Single language or single slug.
npm run blog:restructure -- --lang en
npm run blog:restructure -- --slug amazon-ecommerce-llc-vender-online

# Dry-run (no API calls, no writes — just print the queue).
npm run blog:restructure -- --dry-run
```

### npm scripts

Added in `package.json`:

```jsonc
"blog:final-qa":   "node scripts/blog-final-qa.mjs",
"blog:restructure": "node scripts/blog-restructure-non-es.mjs"
```

## Cost / scale

- ES master corpus: ~1.9 MB → ~8 M characters per non-ES locale, ~40 M total to retranslate.
- With Anthropic `claude-sonnet-4-5` at current pricing, expect **~$25-45 USD** for the full 484-pair run depending on average prompt size.
- With OpenAI `gpt-4o-mini`, expect **~$8-15 USD**.
- Always start with `--limit 5` to validate quality and per-pair cost before fanning out.

## Snapshot — after

> _To be populated once the script has been run end-to-end with a valid LLM API key._

Expected:

```
Structural deltas vs ES: 0
```

## Closure criterion

`npm run blog:final-qa` must report `Structural deltas vs ES: 0`.

## Status

The script, validator, npm scripts and checkpoint format are in place. **Full execution is gated on an LLM API budget** (Anthropic or OpenAI). The initial agent session for this task requested the API key from the user; it was not provided, so the 484 pending pairs remain to be processed in a follow-up session once budget is available. The script is fully resume-safe and validation-driven, so re-running it with the key will complete the task autonomously.
