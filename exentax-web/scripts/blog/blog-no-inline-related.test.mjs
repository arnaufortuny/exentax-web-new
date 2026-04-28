#!/usr/bin/env node
/*
 * blog-no-inline-related.test.mjs
 * ----------------------------------------------------------------------------
 * Unit tests for the inline "Related Reading" guard (Task #12).
 *
 * Verifies:
 *   (a) Heading variant `### Lecturas relacionadas` is detected in every
 *       supported locale (es / en / fr / de / pt / ca).
 *   (b) Bold-paragraph variant `**Lecturas relacionadas:** ...` is
 *       detected in every supported locale.
 *   (c) The legitimate cleaner-inserted italic sentence
 *       `_Para ampliar en la misma serie: ..._` is NOT detected.
 *   (d) Casual prose mentions of the phrase (mid-sentence, no heading,
 *       no bold-paragraph marker) are NOT detected.
 *
 * Exits 0 on success, 1 on any mismatch so `npm run check` can fail
 * fast if the regexes regress.
 * ----------------------------------------------------------------------------
 */

import {
  HEADING_RE,
  BOLD_PARA_RE,
  FORBIDDEN_HEADINGS,
} from "./blog-no-inline-related.mjs";

function detect(line) {
  if (HEADING_RE.test(line)) return "heading";
  if (BOLD_PARA_RE.test(line)) return "bold-paragraph";
  return null;
}

const FIXTURES = [
  // -- (a) Heading variant per locale -------------------------------------
  { name: "es heading h3",     text: "### Lecturas relacionadas",          expect: "heading" },
  { name: "es heading h2",     text: "## Lecturas relacionadas",            expect: "heading" },
  { name: "en heading h3",     text: "### Related Reading",                 expect: "heading" },
  { name: "en heading further",text: "### Further Reading",                 expect: "heading" },
  { name: "fr heading h3",     text: "### Lectures connexes",               expect: "heading" },
  { name: "de heading h3",     text: "### Weiterführende Lektüre",          expect: "heading" },
  { name: "de heading verwandte", text: "### Verwandte Artikel",            expect: "heading" },
  { name: "pt heading h3",     text: "### Leituras relacionadas",           expect: "heading" },
  { name: "pt heading artigos",text: "## Artigos relacionados",             expect: "heading" },
  { name: "ca heading h3",     text: "### Lectures relacionades",           expect: "heading" },
  { name: "ca heading articles", text: "### Articles relacionats",          expect: "heading" },

  // -- (b) Bold-paragraph variant per locale ------------------------------
  { name: "es bold para",      text: "**Lecturas relacionadas:** Para profundizar, lee <a href=\"/es/blog/x\">x</a>.", expect: "bold-paragraph" },
  { name: "es bold para no colon", text: "**Lecturas relacionadas** te puede interesar leer sobre x.",                expect: "bold-paragraph" },
  { name: "en bold para",      text: "**Related reading:** to dig deeper, see <a href=\"/en/blog/x\">x</a>.",         expect: "bold-paragraph" },
  { name: "en bold para articles", text: "**Related Articles:** see also <a href=\"/en/blog/x\">x</a>.",              expect: "bold-paragraph" },
  { name: "fr bold para",      text: "**Lectures connexes :** pour aller plus loin, voir <a href=\"/fr/blog/x\">x</a>.", expect: "bold-paragraph" },
  { name: "de bold para",      text: "**Verwandte Lektüre:** Zur Vertiefung sehen Sie <a href=\"/de/blog/x\">x</a>.", expect: "bold-paragraph" },
  { name: "pt bold para",      text: "**Leituras relacionadas:** veja também <a href=\"/pt/blog/x\">x</a>.",          expect: "bold-paragraph" },
  { name: "ca bold para",      text: "**Lectures relacionades:** per aprofundir, llegeixi <a href=\"/ca/blog/x\">x</a>.", expect: "bold-paragraph" },

  // -- (c) Cleaner-inserted italic sentence MUST NOT trigger ---------------
  { name: "es italic see-also (cleaner output)", text: "_Para ampliar en la misma serie: [a](/es/blog/a), [b](/es/blog/b)._", expect: null },
  { name: "en italic see-also (cleaner output)", text: "_More on this topic: [a](/en/blog/a), [b](/en/blog/b)._",             expect: null },
  { name: "fr italic see-also (cleaner output)", text: "_Dans la même série: [a](/fr/blog/a), [b](/fr/blog/b)._",             expect: null },
  { name: "de italic see-also (cleaner output)", text: "_Weiter dazu: [a](/de/blog/a), [b](/de/blog/b)._",                    expect: null },
  { name: "pt italic see-also (cleaner output)", text: "_Veja também: [a](/pt/blog/a), [b](/pt/blog/b)._",                    expect: null },
  { name: "ca italic see-also (cleaner output)", text: "_Per ampliar en la mateixa sèrie: [a](/ca/blog/a), [b](/ca/blog/b)._", expect: null },

  // -- (d) Casual prose mentions must NOT trigger -------------------------
  { name: "es casual mention",  text: "En las lecturas relacionadas con IRPF se cita el caso típico.",                          expect: null },
  { name: "en casual mention",  text: "Some related reading on the topic can be useful for context.",                            expect: null },
  { name: "es plain bold mid-sentence", text: "El concepto **Lecturas relacionadas** aparece como sección obsoleta en algunos artículos.", expect: null },
  { name: "es plain bullet (markdown link)", text: "- [errores críticos si ya tienes una LLC](/es/blog/errores-criticos-llc-ya-constituida)", expect: null },
  { name: "es prose with link",  text: "Para más contexto, ver <a href=\"/es/blog/x\">los tramos del IRPF</a> en detalle.",     expect: null },
  { name: "blank line",          text: "",                                                                                       expect: null },
  { name: "regular heading",     text: "## Cómo lo resolvemos",                                                                   expect: null },
];

// Generate one heading-variant + one bold-paragraph-variant fixture for
// EVERY entry in FORBIDDEN_HEADINGS so a future addition to that list
// can never silently lack regex coverage.
const GENERATED_FIXTURES = [];
for (const phrase of FORBIDDEN_HEADINGS) {
  GENERATED_FIXTURES.push({
    name: `auto-heading: ${phrase}`,
    text: `### ${phrase}`,
    expect: "heading",
  });
  GENERATED_FIXTURES.push({
    name: `auto-bold-para: ${phrase}`,
    text: `**${phrase}:** see also <a href="/es/blog/x">x</a>.`,
    expect: "bold-paragraph",
  });
}

function run() {
  const failures = [];
  let passed = 0;
  const allFixtures = [...FIXTURES, ...GENERATED_FIXTURES];
  for (const fx of allFixtures) {
    const got = detect(fx.text);
    if (got !== fx.expect) {
      failures.push(
        `  [MISMATCH] ${fx.name}\n         expected: ${JSON.stringify(fx.expect)}\n         got:      ${JSON.stringify(got)}\n         line: ${fx.text}`,
      );
      continue;
    }
    passed += 1;
  }
  const total = allFixtures.length;
  if (failures.length > 0) {
    console.error(
      `\n[blog-no-inline-related.test] FAIL — ${failures.length} of ${total} fixture${total === 1 ? "" : "s"} mismatched:\n`,
    );
    for (const f of failures) console.error(f);
    console.error(
      `\n[blog-no-inline-related.test] If you intentionally changed the regexes, update the fixtures here to match.`,
    );
    process.exit(1);
  }
  console.log(
    `[blog-no-inline-related.test] OK — ${passed}/${total} fixtures matched the guard's expected behaviour.`,
  );
}

run();
