#!/usr/bin/env node
/*
 * blog-masterpiece-audit-rules.test.mjs
 * ----------------------------------------------------------------------------
 * Regression test that locks in the OTHER FIVE rules of the strict blog audit
 * (Task #58 follow-up to Task #56). The sibling test file
 * `blog-masterpiece-audit.test.mjs` already pins down `findYearsInProse`; this
 * file pins down the rest of the helpers powering `seo:masterpiece-strict`:
 *
 *   1. hasV2Marker      — presence of the closed `<!-- exentax:execution-v2 -->`
 *                         block.
 *   2. hasCalcCta       — calculator pointer (HTML marker OR inline link
 *                         `/<lang>#calculadora|calculator|calc` OR an
 *                         href anchor to #calculadora / #calculator).
 *   3. countWords       — body word count used for the min-length rule.
 *   4. hasSourcesBlock  — inline `<!-- exentax:sources-v1 -->` with >= 3
 *                         primary URLs OR runtime injection via the
 *                         SOURCES_BY_SLUG table in `blog-sources.ts`.
 *   5. hasAuthorityBlock — "Lo que vemos / What we see / método Exentax /
 *                         closing CTA" patterns across all 6 locales.
 *
 * If any of these helpers regress, the strict gate (`seo:masterpiece-strict`)
 * silently stops protecting the corpus the same way the year-in-prose rule
 * would have without Task #56's regression test. Each rule has at least one
 * positive AND one negative fixture; `hasAuthorityBlock` covers all 6 locales
 * to guarantee the closing pattern still matches in every translation.
 *
 * Exits 0 on success, 1 on the first mismatch so CI can fail fast.
 * ----------------------------------------------------------------------------
 */

import {
  countWords,
  hasV2Marker,
  hasCalcCta,
  hasSourcesBlock,
  hasAuthorityBlock,
} from "./blog-masterpiece-audit.mjs";

// Each fixture is { rule, name, run, expect }.
//   run    → () => any   (returns the value to compare against `expect`)
//   expect → primitive   (deep-compared via JSON.stringify so {ok,count,source}
//                          objects from hasSourcesBlock match cleanly)
const FIXTURES = [
  // ===========================================================================
  // 1. hasV2Marker
  // ===========================================================================
  {
    rule: "hasV2Marker",
    name: "positive: opening + closing markers present",
    run: () =>
      hasV2Marker(
        "<!-- exentax:execution-v2 -->\nMétodo Exentax aplicado.\n<!-- /exentax:execution-v2 -->",
      ),
    expect: true,
  },
  {
    rule: "hasV2Marker",
    name: "positive: tolerates whitespace inside the marker",
    run: () =>
      hasV2Marker(
        "<!--   exentax:execution-v2   -->body<!--  /  exentax:execution-v2  -->",
      ),
    expect: true,
  },
  {
    rule: "hasV2Marker",
    name: "negative: only opening marker, no closing",
    run: () => hasV2Marker("<!-- exentax:execution-v2 -->\nbody never closes."),
    expect: false,
  },
  {
    rule: "hasV2Marker",
    name: "negative: only closing marker, no opening",
    run: () => hasV2Marker("body without opener.\n<!-- /exentax:execution-v2 -->"),
    expect: false,
  },
  {
    rule: "hasV2Marker",
    name: "negative: no markers at all",
    run: () => hasV2Marker("Plain article body, no execution-v2 block."),
    expect: false,
  },

  // ===========================================================================
  // 2. hasCalcCta
  // ===========================================================================
  {
    rule: "hasCalcCta",
    name: "positive: HTML calc-cta marker",
    run: () => hasCalcCta("Body…\n<!-- exentax:calc-cta-v1 -->\nmore body.", "es"),
    expect: true,
  },
  {
    rule: "hasCalcCta",
    name: "positive: inline /es#calculadora link",
    run: () =>
      hasCalcCta(
        "Prueba la [calculadora](/es#calculadora) y compara escenarios.",
        "es",
      ),
    expect: true,
  },
  {
    rule: "hasCalcCta",
    name: "positive: inline /en#calculator link",
    run: () =>
      hasCalcCta(
        "Run the numbers in our [calculator](/en#calculator).",
        "en",
      ),
    expect: true,
  },
  {
    rule: "hasCalcCta",
    name: "positive: href anchor to #calculadora",
    run: () =>
      hasCalcCta(
        'Mira <a href="/es#calculadora">la calculadora</a> antes de decidir.',
        "es",
      ),
    expect: true,
  },
  {
    rule: "hasCalcCta",
    name: "positive: href anchor to #calculator (different locale path)",
    run: () =>
      hasCalcCta(
        'See the <a href="/fr#calculator">calculator</a> for the breakdown.',
        "fr",
      ),
    expect: true,
  },
  {
    rule: "hasCalcCta",
    name: "negative: body never points at the calculator",
    run: () =>
      hasCalcCta(
        "Article body that talks about taxes but never mentions the calculator.",
        "es",
      ),
    expect: false,
  },
  {
    rule: "hasCalcCta",
    name: "negative: link to wrong locale anchor only counts via href fallback (none here)",
    run: () =>
      hasCalcCta(
        "Visit our [home](/de) page for more info.",
        "es",
      ),
    expect: false,
  },

  // ===========================================================================
  // 3. countWords
  // ===========================================================================
  {
    rule: "countWords",
    name: "positive: 5 plain words",
    run: () => countWords("one two three four five"),
    expect: 5,
  },
  {
    rule: "countWords",
    name: "positive: HTML tags stripped, only visible text counted",
    run: () => countWords("<p>Hello <strong>brave</strong> new world</p>"),
    expect: 4,
  },
  {
    rule: "countWords",
    name: "positive: markdown link keeps visible text, drops URL",
    run: () =>
      countWords("Read the [official IRS guidance](https://www.irs.gov/foo) now"),
    // "Read the official IRS guidance now" → 6 words
    expect: 6,
  },
  {
    rule: "countWords",
    name: "positive: markdown decorations (#, *, `, _, >) stripped",
    run: () => countWords("# Heading\n> quoted *bold* `code` _italic_ text"),
    // "Heading quoted bold code italic text" → 6 words
    expect: 6,
  },
  {
    rule: "countWords",
    name: "positive: unicode words counted (accents, ñ)",
    run: () => countWords("formación constitución llave-en-mano España"),
    // last token is hyphenated and counts as one word
    expect: 4,
  },
  {
    rule: "countWords",
    name: "negative: empty string yields zero",
    run: () => countWords(""),
    expect: 0,
  },
  {
    rule: "countWords",
    name: "negative: punctuation-only yields zero",
    run: () => countWords("--- *** ___ >>>"),
    expect: 0,
  },

  // ===========================================================================
  // 4. hasSourcesBlock
  // ===========================================================================
  {
    rule: "hasSourcesBlock",
    name: "positive: inline block with 3 primary URLs (irs/fincen/treasury)",
    run: () =>
      hasSourcesBlock(
        [
          "Body…",
          "<!-- exentax:sources-v1 -->",
          "- https://www.irs.gov/forms-pubs/form-5472",
          "- https://www.fincen.gov/boi",
          "- https://home.treasury.gov/news/press-releases/jy1234",
          "<!-- /exentax:sources-v1 -->",
        ].join("\n"),
        "__synthetic-fixture-slug__",
      ),
    expect: { ok: true, count: 3, source: "inline" },
  },
  {
    rule: "hasSourcesBlock",
    name: "positive: runtime injection via SOURCES_BY_SLUG (cambiar-divisas-llc-mejores-opciones has 3 refs)",
    // No inline block, so the helper must fall through to the runtime path
    // and find this slug in client/src/data/blog-sources.ts. If the inventory
    // ever drops below 3 refs for this slug the fixture flips and we'll know.
    run: () => {
      const r = hasSourcesBlock(
        "Body without an inline sources marker.",
        "cambiar-divisas-llc-mejores-opciones",
      );
      return { ok: r.ok, source: r.source, atLeast3: r.count >= 3 };
    },
    expect: { ok: true, source: "runtime", atLeast3: true },
  },
  {
    rule: "hasSourcesBlock",
    name: "negative: inline block with only 2 primary URLs and unknown slug → ok:false",
    run: () =>
      hasSourcesBlock(
        [
          "<!-- exentax:sources-v1 -->",
          "- https://www.irs.gov/foo",
          "- https://www.fincen.gov/bar",
          "<!-- /exentax:sources-v1 -->",
        ].join("\n"),
        "__synthetic-fixture-slug__",
      ),
    expect: { ok: false, count: 0, source: "none" },
  },
  {
    rule: "hasSourcesBlock",
    name: "negative: inline block with 3 NON-primary URLs and unknown slug → ok:false",
    run: () =>
      hasSourcesBlock(
        [
          "<!-- exentax:sources-v1 -->",
          "- https://example.com/a",
          "- https://medium.com/b",
          "- https://wikipedia.org/c",
          "<!-- /exentax:sources-v1 -->",
        ].join("\n"),
        "__synthetic-fixture-slug__",
      ),
    expect: { ok: false, count: 0, source: "none" },
  },
  {
    rule: "hasSourcesBlock",
    name: "negative: empty body and unknown slug → ok:false / source:none",
    run: () => hasSourcesBlock("", "__synthetic-fixture-slug__"),
    expect: { ok: false, count: 0, source: "none" },
  },

  // ===========================================================================
  // 5. hasAuthorityBlock — must match in EVERY one of the 6 locales.
  // ===========================================================================
  // -- Positives (one canonical phrasing per locale) --
  {
    rule: "hasAuthorityBlock",
    name: "es: 'lo que vemos cada semana' authority pattern",
    run: () =>
      hasAuthorityBlock(
        "Lo que vemos cada semana en Exentax al revisar LLCs nuevas.",
      ),
    expect: true,
  },
  {
    rule: "hasAuthorityBlock",
    name: "en: 'what we see every week' authority pattern",
    run: () =>
      hasAuthorityBlock(
        "What we see every week at Exentax when onboarding new LLC owners.",
      ),
    expect: true,
  },
  {
    rule: "hasAuthorityBlock",
    name: "fr: 'ce que nous voyons chaque semaine' authority pattern",
    run: () =>
      hasAuthorityBlock(
        "Ce que nous voyons chaque semaine chez Exentax avec les nouvelles LLC.",
      ),
    expect: true,
  },
  {
    rule: "hasAuthorityBlock",
    name: "de: 'was wir jede Woche sehen' authority pattern",
    run: () =>
      hasAuthorityBlock(
        "Was wir jede Woche sehen bei Exentax mit neuen LLC-Mandanten.",
      ),
    expect: true,
  },
  {
    rule: "hasAuthorityBlock",
    name: "pt: 'o que vemos cada semana' authority pattern",
    run: () =>
      hasAuthorityBlock(
        "O que vemos cada semana na Exentax ao acompanhar LLCs novas.",
      ),
    expect: true,
  },
  {
    rule: "hasAuthorityBlock",
    name: "ca: 'el que veiem cada setmana' authority pattern",
    run: () =>
      hasAuthorityBlock(
        "El que veiem cada setmana a Exentax revisant LLCs noves.",
      ),
    expect: true,
  },
  // -- Positives via the brand-anchor variants ("método/method/Methode Exentax") --
  {
    rule: "hasAuthorityBlock",
    name: "es: 'método Exentax' brand anchor",
    run: () => hasAuthorityBlock("Aplicamos el método Exentax desde el día 1."),
    expect: true,
  },
  {
    rule: "hasAuthorityBlock",
    name: "en: 'Exentax method' brand anchor",
    run: () => hasAuthorityBlock("We apply the Exentax method from day 1."),
    expect: true,
  },
  {
    rule: "hasAuthorityBlock",
    name: "fr: 'méthode Exentax' brand anchor",
    run: () => hasAuthorityBlock("Nous appliquons la méthode Exentax dès le jour 1."),
    expect: true,
  },
  {
    rule: "hasAuthorityBlock",
    name: "de: 'Exentax-Methode' brand anchor",
    run: () => hasAuthorityBlock("Wir wenden die Exentax-Methode ab Tag 1 an."),
    expect: true,
  },
  // -- Positives via closing-CTA patterns --
  {
    rule: "hasAuthorityBlock",
    name: "es: 'agenda 30 minutos con Exentax' closing CTA",
    run: () => hasAuthorityBlock("¿Quieres que lo revisemos? Agenda 30 minutos con Exentax."),
    expect: true,
  },
  {
    rule: "hasAuthorityBlock",
    name: "en: \"book 20 minutes with Exentax\" closing CTA",
    run: () => hasAuthorityBlock("Want a second pair of eyes? Book 20 minutes with Exentax."),
    expect: true,
  },
  {
    rule: "hasAuthorityBlock",
    name: "v2 marker + Exentax mention inside the block counts as authority",
    run: () =>
      hasAuthorityBlock(
        [
          "<!-- exentax:execution-v2 -->",
          "Aquí Exentax ejecuta la revisión completa.",
          "<!-- /exentax:execution-v2 -->",
        ].join("\n"),
      ),
    expect: true,
  },
  // -- Negatives (one per locale): editorial body that mentions taxes
  // but never lands on any closing pattern, brand anchor, or v2 block. --
  {
    rule: "hasAuthorityBlock",
    name: "es-negative: generic body without authority patterns",
    run: () =>
      hasAuthorityBlock(
        "Este artículo explica los plazos del modelo 720 en España con detalle.",
      ),
    expect: false,
  },
  {
    rule: "hasAuthorityBlock",
    name: "en-negative: generic body without authority patterns",
    run: () =>
      hasAuthorityBlock(
        "This article explains the BOI Report deadlines in plain English.",
      ),
    expect: false,
  },
  {
    rule: "hasAuthorityBlock",
    name: "fr-negative: generic body without authority patterns",
    run: () =>
      hasAuthorityBlock(
        "Cet article explique les obligations déclaratives d'une LLC américaine.",
      ),
    expect: false,
  },
  {
    rule: "hasAuthorityBlock",
    name: "de-negative: generic body without authority patterns",
    run: () =>
      hasAuthorityBlock(
        "Dieser Artikel erklärt die Meldepflichten einer US-LLC für Auslandsgründer.",
      ),
    expect: false,
  },
  {
    rule: "hasAuthorityBlock",
    name: "pt-negative: generic body without authority patterns",
    run: () =>
      hasAuthorityBlock(
        "Este artigo explica os prazos do BOI Report para LLCs estrangeiras.",
      ),
    expect: false,
  },
  {
    rule: "hasAuthorityBlock",
    name: "ca-negative: generic body without authority patterns",
    run: () =>
      hasAuthorityBlock(
        "Aquest article explica els terminis del BOI Report per a LLCs estrangeres.",
      ),
    expect: false,
  },
];

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function format(value) {
  return JSON.stringify(value);
}

function run() {
  let passed = 0;
  const failures = [];

  for (const fx of FIXTURES) {
    let got;
    try {
      got = fx.run();
    } catch (err) {
      failures.push(
        `  [THROW] ${fx.rule} :: ${fx.name}\n          ${err && err.stack ? err.stack : err}`,
      );
      continue;
    }
    if (!deepEqual(got, fx.expect)) {
      failures.push(
        `  [MISS] ${fx.rule} :: ${fx.name}\n         expected ${format(fx.expect)}, got ${format(got)}`,
      );
      continue;
    }
    passed += 1;
  }

  const total = FIXTURES.length;
  if (failures.length > 0) {
    console.error(
      `\n[blog-masterpiece-audit-rules.test] FAIL — ${failures.length} of ${total} fixture${total === 1 ? "" : "s"} mismatched:\n`,
    );
    for (const f of failures) console.error(f);
    console.error(
      `\n[blog-masterpiece-audit-rules.test] If you intentionally changed one of the helpers in blog-masterpiece-audit.mjs (hasV2Marker / hasCalcCta / countWords / hasSourcesBlock / hasAuthorityBlock), update the matching fixtures in this file. Removing a branch will silently let the strict gate (seo:masterpiece-strict) pass on articles that previously failed.`,
    );
    process.exit(1);
  }

  console.log(
    `[blog-masterpiece-audit-rules.test] OK — ${passed}/${total} fixtures pass across hasV2Marker / hasCalcCta / countWords / hasSourcesBlock / hasAuthorityBlock.`,
  );
}

run();
