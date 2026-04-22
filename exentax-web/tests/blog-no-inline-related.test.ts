/**
 * Regression test (Task #30): blog post bodies must NEVER contain an inline
 * "Related Reading" / "Lecturas relacionadas" / "Weiterführende Lektüre"
 * heading. The canonical Related Articles grid is the `RelatedReadsBlock`
 * React component rendered at the bottom of every article by
 * `client/src/pages/blog/post.tsx`. If a heading like those shows up
 * inside the markdown body, readers see TWO stacked related-articles
 * sections.
 *
 * Prior expansion rounds (Task #9 in particular) re-introduced the inline
 * duplicate across ~100 files across six locales. This test locks the fix in.
 *
 * Run: `tsx exentax-web/tests/blog-no-inline-related.test.ts`
 * Also executed inline as the `no-inline-related` step of
 * `scripts/blog-validate-all.mjs` (→ `npm run check`).
 */
// @ts-ignore - ESM script, no type declarations
import { findOffenders } from "../scripts/blog-no-inline-related.mjs";

type Offender = { file: string; line: number; heading: string };

const offenders: Offender[] = findOffenders();

if (offenders.length > 0) {
  console.error(
    `FAIL: ${offenders.length} inline related-reading heading(s) found in blog body content.`,
  );
  console.error(
    "  Canonical location is RelatedReadsBlock in client/src/pages/blog/post.tsx.",
  );
  for (const o of offenders.slice(0, 30)) {
    console.error(`    ${o.file}:${o.line}  ${o.heading}`);
  }
  if (offenders.length > 30) {
    console.error(`    … and ${offenders.length - 30} more`);
  }
  process.exit(1);
}

console.log("ok  blog body has 0 inline related-reading headings");
process.exit(0);
