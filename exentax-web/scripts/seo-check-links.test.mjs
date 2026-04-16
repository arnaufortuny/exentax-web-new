#!/usr/bin/env node
/*
 * seo-check-links.test.mjs
 * ----------------------------------------------------------------------------
 * Smoke tests for the SEO link checker. Verifies the link-extraction regex
 * picks up both Markdown and HTML hrefs, and that the file-walking guard runs
 * cleanly against the repo's current content (the repo must always be green).
 *
 * Exits 0 on success, 1 on any failure.
 * ----------------------------------------------------------------------------
 */
import { extractLinksWithLine } from "./seo-check-links.mjs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error("  ✖", msg);
    failed++;
  } else {
    console.log("  ✓", msg);
  }
}

console.log("extractLinksWithLine — picks up both syntaxes");
{
  const body =
    'Lead [Form 5472](/es/blog/form-5472-que-es-como-presentarlo) line.\n' +
    '<p>See <a href="/en/blog/boi-report-2026-complete-guide-to-fincen-beneficial-ownership-filing">BOI</a>.</p>\n';
  const links = extractLinksWithLine(body);
  assert(links.length === 2, "found 2 links");
  assert(
    links.some(
      (l) =>
        l.linkLang === "es" && l.slug === "form-5472-que-es-como-presentarlo",
    ),
    "matched markdown ES link",
  );
  assert(
    links.some(
      (l) =>
        l.linkLang === "en" &&
        l.slug ===
          "boi-report-2026-complete-guide-to-fincen-beneficial-ownership-filing",
    ),
    "matched HTML EN link",
  );
}

console.log("extractLinksWithLine — strips trailing slash");
{
  const body = "[A](/es/blog/foo/) plus <a href=\"/en/blog/bar/\">x</a>";
  const links = extractLinksWithLine(body);
  assert(links.length === 2, "found 2 links");
  assert(
    links.every((l) => !l.slug.endsWith("/")),
    "no slug retains a trailing slash",
  );
  assert(
    links.some((l) => l.slug === "foo") && links.some((l) => l.slug === "bar"),
    "both slugs present after trimming",
  );
}

console.log("extractLinksWithLine — does NOT match non-blog paths");
{
  const body =
    "[Hub](/es/sobre-las-llc) and [CTA](/es/agendar) and [other](/es/blog-tag/x)";
  const links = extractLinksWithLine(body);
  assert(links.length === 0, "ignored non-/blog/ links");
}

console.log("end-to-end — guard exits 0 against the current repo");
{
  const r = spawnSync(
    process.execPath,
    [path.join(__dirname, "seo-check-links.mjs")],
    { encoding: "utf8" },
  );
  assert(r.status === 0, `exit code 0 (got ${r.status})`);
  assert(
    /No broken internal blog links/.test(r.stdout),
    "reports clean broken-link state",
  );
  assert(
    /have ≥ 3 incoming links/.test(r.stdout),
    "reports clean under-linked state",
  );
}

if (failed) {
  console.error(`\nseo-check-links.test: FAIL (${failed} assertion(s))\n`);
  process.exit(1);
}
console.log("\nseo-check-links.test: OK\n");
