# Editorial guide — Exentax

How we write for exentax.com. Keep the voice consistent, the claims defensible, and the reader's next step obvious.

## 1. Voice

- **Direct.** Short sentences. Active voice. No filler.
- **Pragmatic.** We help people pay fewer taxes legally. We name the IRS form, the state, the cost.
- **Respectful.** Never mock a competitor. Never pressure the reader.
- **Bilingual-friendly.** Avoid idioms that translate poorly ("a huevo", "échale ganas") — they degrade the en/fr/de/pt output.

## 2. Tone matrix by page type

| Page | Tone | Opening beat |
|------|------|--------------|
| Home | Benefit-first | "Estás pagando más impuestos de los necesarios." |
| Hub (`sobre-las-llc`) | Explanatory | Define the concept in one sentence, then list. |
| Blog — how-to | Step-by-step | Promise the result in the first line ("En 15 minutos sabrás si tu LLC necesita...") |
| Blog — comparison | Neutral, tabular | Open with the decision criterion ("Elegir estado depende de 3 factores: ..."). |
| FAQ | Terse | One-paragraph answer (40–60 words), then optional detail. |
| Service page | Persuasive, factual | Lead with the deliverable and the timeline. |

## 3. Structural rules

- Every long page (> 1 000 words) has a **table of contents** with anchor links (`#ventajas`, `#estados`, ...).
- Every H2 is an answer to a question the reader has at that point. If you can't rephrase it as a question, the H2 is probably wrong.
- Use **bulleted lists** for parallel items (documents, states, steps). Use **numbered lists** for sequences.
- **Bold** the first occurrence of each key term. Don't bold full sentences.
- Quote IRS forms by number ("Form 5472"), Spanish law by article ("artículo 9 LIRPF"), EU directives by name ("DAC-7"). Always link to the official source once.

## 4. Numbers and claims

- Every percentage, timeline, or fee quoted in the content must be defensible. If a number is our internal average, phrase it as such ("clientes de Exentax reducen su carga fiscal una media del 37%"). Never round up.
- Currency: use `€` for amounts denominated in euros, `$` for USD. Disambiguate when both appear: `99 €`, `$ 299 USD`.
- Dates: use `DD/MM/YYYY` in Spanish/Portuguese/French; `YYYY-MM-DD` in English/German when referring to deadlines.

## 5. Inclusive & compliant language

- Default to gender-neutral phrasing in Spanish ("profesionales", "personas autónomas") except when addressing "autónomos" as a legal category.
- Never promise tax **evasion**; always say **optimization** / **planning**.
- Include a boilerplate disclaimer at the end of fiscally prescriptive posts: "*Este artículo es informativo y no constituye asesoramiento fiscal personalizado. Consulta con un profesional antes de tomar decisiones.*" Localized per language.

## 6. Formatting cheatsheet (markdown in `BLOG_POSTS.content`)

- Headings: `## H2`, `### H3`. Do not use H1 inside content — the page renders its own.
- Lists: `- item` or `1. item`. Blank line before the list.
- Emphasis: `**bold**`, `*italic*`.
- Links: `[anchor](/es/blog/target-slug)` — always relative, always localized.
- Quotes: `> blockquote` (rare — only for legal-text citations).
- Tables: markdown tables are **not** rendered by the current server-side `markdownToHtml`. Use them sparingly and preview in-browser; server-rendered SEO prerender will skip them.

## 7. Translation hand-off

When you commit a Spanish post, also commit the translations in the same PR. Rules:

- Translate the **meaning**, not the words.
- Always translate the title → the `metaTitle` → the `slug` in that order. Make sure the title and metaTitle are consistent.
- Keep internal links pointed to the same target, but change the URL to the matching language prefix (`/en/blog/...`).
- Do not translate proper nouns that are brand names (Mercury, Stripe, Wise, Relay, Wyoming) — but translate common nouns ("cuenta bancaria" → "bank account").

## 8. E-E-A-T reinforcement

- Cite **sources** (IRS, AEAT, EU) with a clickable link once per claim.
- Mention **years of operation** where relevant ("desde 2024").
- Publish **case studies** (with consent) quarterly.
- Long-term: introduce **author pages** with `Person` schema and LinkedIn `sameAs`.

---

*End of guide.*
