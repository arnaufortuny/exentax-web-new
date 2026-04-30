/*
 * tests/seo-cierre-audit.test.mjs
 * ----------------------------------------------------------------------------
 * Behavior tests for scripts/seo/lib/cierre-audit-lib.mjs — the pure logic
 * powering scripts/seo/seo-cierre-audit.mjs. Each block of tests covers
 * both the happy path AND the regressions we want the auditor to catch
 * before they reach production:
 *
 *   - parseUrls handles malformed XML gracefully
 *   - validateUrlEntry catches missing/duplicate/extra hreflang, missing
 *     x-default, missing self-hreflang
 *   - computeReciprocity catches asymmetric mappings, fragmented groups,
 *     wrong cardinality, members that don't appear in their own group's
 *     alternate set
 *   - validateRobotsTxt catches missing sitemap directives, missing AI
 *     allow-list entries, missing Disallow rules
 *   - validateHeaderRoute catches public routes without index/follow or
 *     without rel=canonical, and private routes without noindex/nofollow
 * ----------------------------------------------------------------------------
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  parseUrls,
  validateUrlEntry,
  computeReciprocity,
  validateRobotsTxt,
  validateHeaderRoute,
} from "../scripts/seo/lib/cierre-audit-lib.mjs";

const HREFLANGS = ["es-ES", "en-US", "fr-FR", "de-DE", "pt-PT", "ca-ES"];

function urlBlock(loc, alternates) {
  const altLines = alternates
    .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`)
    .join("\n");
  return `  <url>\n    <loc>${loc}</loc>\n${altLines}\n  </url>`;
}

function fullAlternates(basePath) {
  return [
    ["es-ES", `https://exentax.com/es${basePath}`],
    ["en-US", `https://exentax.com/en${basePath}`],
    ["fr-FR", `https://exentax.com/fr${basePath}`],
    ["de-DE", `https://exentax.com/de${basePath}`],
    ["pt-PT", `https://exentax.com/pt${basePath}`],
    ["ca-ES", `https://exentax.com/ca${basePath}`],
    ["x-default", `https://exentax.com/es${basePath}`],
  ];
}

function asObjectAlts(alts) {
  return alts.map(([lang, href]) => ({ lang, href }));
}

function fullGroup(basePath) {
  // Returns 6 entries that together form a complete reciprocal group.
  // The library expects alternates as {lang, href} objects (matching
  // parseUrls' output), so we normalise here.
  const alts = asObjectAlts(fullAlternates(basePath));
  return alts
    .filter((a) => a.lang !== "x-default")
    .map((a) => ({ loc: a.href, alternates: alts }));
}

// ─── parseUrls ────────────────────────────────────────────────────────────

test("parseUrls extracts <loc> and alternates from a well-formed url", () => {
  const xml = `<urlset>${urlBlock("https://exentax.com/es", fullAlternates(""))}</urlset>`;
  const [u] = parseUrls(xml);
  assert.equal(u.loc, "https://exentax.com/es");
  assert.equal(u.alternates.length, 7);
  assert.equal(u.alternates.find((a) => a.lang === "x-default").href, "https://exentax.com/es");
});

test("parseUrls returns null loc for malformed <url>", () => {
  const [u] = parseUrls(`<urlset><url><xhtml:link rel="alternate" hreflang="es-ES" href="x" /></url></urlset>`);
  assert.equal(u.loc, null);
});

// ─── validateUrlEntry ─────────────────────────────────────────────────────

test("validateUrlEntry: happy path returns no errors", () => {
  const [u] = parseUrls(`<urlset>${urlBlock("https://exentax.com/es", fullAlternates(""))}</urlset>`);
  assert.deepEqual(validateUrlEntry(u, HREFLANGS), []);
});

test("validateUrlEntry: missing language is flagged", () => {
  const broken = fullAlternates("").filter(([l]) => l !== "fr-FR");
  const [u] = parseUrls(`<urlset>${urlBlock("https://exentax.com/es", broken)}</urlset>`);
  const errs = validateUrlEntry(u, HREFLANGS);
  assert.ok(errs.some((e) => e.includes("missing hreflang fr-FR")), errs.join("\n"));
  assert.ok(errs.some((e) => e.includes("expected 6 hreflang, got 5")), errs.join("\n"));
});

test("validateUrlEntry: duplicate language is flagged", () => {
  const dup = [...fullAlternates(""), ["es-ES", "https://exentax.com/es"]];
  const [u] = parseUrls(`<urlset>${urlBlock("https://exentax.com/es", dup)}</urlset>`);
  const errs = validateUrlEntry(u, HREFLANGS);
  assert.ok(errs.some((e) => e.includes("duplicate hreflang es-ES")), errs.join("\n"));
});

test("validateUrlEntry: unexpected language (e.g. it-IT) is flagged", () => {
  const extra = [...fullAlternates(""), ["it-IT", "https://exentax.com/it"]];
  const [u] = parseUrls(`<urlset>${urlBlock("https://exentax.com/es", extra)}</urlset>`);
  const errs = validateUrlEntry(u, HREFLANGS);
  assert.ok(errs.some((e) => e.includes("unexpected hreflang it-IT")), errs.join("\n"));
});

test("validateUrlEntry: missing x-default is flagged", () => {
  const noXdef = fullAlternates("").filter(([l]) => l !== "x-default");
  const [u] = parseUrls(`<urlset>${urlBlock("https://exentax.com/es", noXdef)}</urlset>`);
  const errs = validateUrlEntry(u, HREFLANGS);
  assert.ok(errs.some((e) => e.includes("missing x-default")), errs.join("\n"));
});

test("validateUrlEntry: missing self-hreflang is flagged", () => {
  // <loc> = /es/blog/foo but the es-ES alternate points elsewhere
  const wrongSelf = fullAlternates("/blog/foo").map(([l, h]) =>
    l === "es-ES" ? [l, "https://exentax.com/es/blog/wrong"] : [l, h]
  );
  const [u] = parseUrls(`<urlset>${urlBlock("https://exentax.com/es/blog/foo", wrongSelf)}</urlset>`);
  const errs = validateUrlEntry(u, HREFLANGS);
  assert.ok(errs.some((e) => e.includes("missing self-hreflang")), errs.join("\n"));
});

test("validateUrlEntry: x-default that does not match es-ES canonical is flagged", () => {
  // x-default points to /en instead of the group's es-ES URL — a real
  // mistake that splits canonical signal between two URLs.
  const wrongXdef = fullAlternates("/blog/foo").map(([l, h]) =>
    l === "x-default" ? [l, "https://exentax.com/en/blog/foo"] : [l, h]
  );
  const [u] = parseUrls(`<urlset>${urlBlock("https://exentax.com/es/blog/foo", wrongXdef)}</urlset>`);
  const errs = validateUrlEntry(u, HREFLANGS);
  assert.ok(
    errs.some((e) => e.includes("x-default points to") && e.includes("expected es-ES")),
    errs.join("\n"),
  );
});

// ─── computeReciprocity ───────────────────────────────────────────────────

test("computeReciprocity: full 6-member group passes", () => {
  const { groups, errors } = computeReciprocity(fullGroup(""), HREFLANGS);
  assert.equal(groups.size, 1);
  assert.deepEqual(errors, []);
});

test("computeReciprocity: missing-member group is flagged (asymmetric)", () => {
  // Drop the "ca" member — five URLs all advertise 6 alternates including
  // a /ca/... URL that doesn't actually appear in any sitemap entry.
  const members = fullGroup("").filter((u) => !u.loc.includes("/ca"));
  const { errors } = computeReciprocity(members, HREFLANGS);
  assert.ok(
    errors.some((e) => e.includes("expected 6 members, got 5") || e.includes("expected member") && e.includes("/ca")),
    errors.join("\n")
  );
});

test("computeReciprocity: member that's not in its own group's alternates is flagged", () => {
  const alts = fullAlternates("");
  const members = fullGroup("");
  // Add a 7th member with a <loc> nobody references in alternates
  members.push({ loc: "https://exentax.com/it", alternates: alts });
  const { errors } = computeReciprocity(members, HREFLANGS);
  assert.ok(
    errors.some((e) => e.includes("expected 6 members, got 7") || e.includes("/it") && e.includes("not listed")),
    errors.join("\n")
  );
});

test("computeReciprocity: fragmented groups (one URL listed under two canonical sets) is flagged", () => {
  // Group A: full 6
  const a = fullGroup("");
  // Group B: share /en with a different fr/de mapping
  const altsB = [
    ["es-ES", "https://exentax.com/es/x"],
    ["en-US", "https://exentax.com/en"], // duplicate of group A's en
    ["fr-FR", "https://exentax.com/fr/x"],
    ["de-DE", "https://exentax.com/de/x"],
    ["pt-PT", "https://exentax.com/pt/x"],
    ["ca-ES", "https://exentax.com/ca/x"],
    ["x-default", "https://exentax.com/es/x"],
  ];
  const b = altsB
    .filter(([l]) => l !== "x-default")
    .map(([, href]) => ({ loc: href, alternates: altsB }));
  const { groups, errors } = computeReciprocity([...a, ...b], HREFLANGS);
  assert.equal(groups.size, 2);
  assert.ok(
    errors.some((e) => e.includes("appears in groups #") && e.includes("/en")),
    errors.join("\n")
  );
});

test("computeReciprocity: wrong cardinality (only 4 members) is flagged", () => {
  const partial = fullGroup("").slice(0, 4);
  const { errors } = computeReciprocity(partial, HREFLANGS);
  assert.ok(
    errors.some((e) => e.includes("expected 6 members, got 4")),
    errors.join("\n")
  );
});

// ─── validateRobotsTxt ────────────────────────────────────────────────────

const SITEMAPS_REQ = ["https://exentax.com/sitemap.xml", "https://exentax.com/sitemap-blog.xml"];
const BOTS_REQ = ["GPTBot", "anthropic-ai"];
const DISALLOWS_REQ = ["/api/", "/booking/"];

test("validateRobotsTxt: well-formed robots passes", () => {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /booking/",
    "User-agent: GPTBot",
    "Allow: /",
    "User-agent: anthropic-ai",
    "Allow: /",
    "Sitemap: https://exentax.com/sitemap.xml",
    "Sitemap: https://exentax.com/sitemap-blog.xml",
  ].join("\n");
  const r = validateRobotsTxt(body, { sitemaps: SITEMAPS_REQ, aiBots: BOTS_REQ, disallows: DISALLOWS_REQ });
  assert.deepEqual(r.errors, []);
  assert.equal(r.aiBotsFound.length, 2);
});

test("validateRobotsTxt: missing sitemap directive is flagged", () => {
  const body = [
    "User-agent: *", "Allow: /",
    "Disallow: /api/", "Disallow: /booking/",
    "User-agent: GPTBot", "Allow: /",
    "User-agent: anthropic-ai", "Allow: /",
    "Sitemap: https://exentax.com/sitemap.xml",
  ].join("\n");
  const r = validateRobotsTxt(body, { sitemaps: SITEMAPS_REQ, aiBots: BOTS_REQ, disallows: DISALLOWS_REQ });
  assert.ok(r.errors.some((e) => e.includes("sitemap-blog.xml")), r.errors.join("\n"));
});

test("validateRobotsTxt: missing AI bot allow block is flagged", () => {
  const body = [
    "User-agent: *", "Allow: /",
    "Disallow: /api/", "Disallow: /booking/",
    "User-agent: GPTBot", "Allow: /",
    "Sitemap: https://exentax.com/sitemap.xml",
    "Sitemap: https://exentax.com/sitemap-blog.xml",
  ].join("\n");
  const r = validateRobotsTxt(body, { sitemaps: SITEMAPS_REQ, aiBots: BOTS_REQ, disallows: DISALLOWS_REQ });
  assert.ok(r.errors.some((e) => e.includes("anthropic-ai")), r.errors.join("\n"));
});

test("validateRobotsTxt: AI bot block declared without 'Allow: /' is flagged", () => {
  // anthropic-ai is declared but its block lacks an Allow directive — a
  // real mistake that effectively fails-closed for the bot.
  const body = [
    "User-agent: *", "Allow: /",
    "Disallow: /api/", "Disallow: /booking/",
    "User-agent: GPTBot", "Allow: /",
    "User-agent: anthropic-ai",
    "Disallow:",
    "Sitemap: https://exentax.com/sitemap.xml",
    "Sitemap: https://exentax.com/sitemap-blog.xml",
  ].join("\n");
  const r = validateRobotsTxt(body, { sitemaps: SITEMAPS_REQ, aiBots: BOTS_REQ, disallows: DISALLOWS_REQ });
  assert.ok(
    r.errors.some((e) => e.includes("anthropic-ai") && e.includes("Allow: /")),
    r.errors.join("\n"),
  );
  assert.ok(r.aiBotsAllowed.includes("GPTBot"));
  assert.ok(!r.aiBotsAllowed.includes("anthropic-ai"));
});

test("validateRobotsTxt: missing Disallow rule is flagged", () => {
  const body = [
    "User-agent: *", "Allow: /",
    "Disallow: /api/",
    "User-agent: GPTBot", "Allow: /",
    "User-agent: anthropic-ai", "Allow: /",
    "Sitemap: https://exentax.com/sitemap.xml",
    "Sitemap: https://exentax.com/sitemap-blog.xml",
  ].join("\n");
  const r = validateRobotsTxt(body, { sitemaps: SITEMAPS_REQ, aiBots: BOTS_REQ, disallows: DISALLOWS_REQ });
  assert.ok(r.errors.some((e) => e.includes("Disallow /booking/")), r.errors.join("\n"));
});

// ─── validateHeaderRoute ──────────────────────────────────────────────────

test("validateHeaderRoute(public): index/follow + canonical + 200 passes", () => {
  const errs = validateHeaderRoute({
    path: "/es",
    status: 200,
    xRobotsTag: "index, follow, max-snippet:-1, max-image-preview:large",
    linkHeader: '<https://exentax.com/es>; rel="canonical"',
  }, { expect: "public" });
  assert.deepEqual(errs, []);
});

test("validateHeaderRoute(public): non-200 status on a public route is flagged", () => {
  // A 404 page that still ships index/canonical headers would be silently
  // indexable as broken — must fail loud.
  const errs = validateHeaderRoute({
    path: "/es",
    status: 404,
    xRobotsTag: "index, follow",
    linkHeader: '<https://exentax.com/es>; rel="canonical"',
  }, { expect: "public" });
  assert.ok(
    errs.some((e) => e.includes("expected HTTP 200") && e.includes("404")),
    errs.join("\n"),
  );
});

test("validateHeaderRoute(public): missing canonical is flagged", () => {
  const errs = validateHeaderRoute({
    path: "/es",
    xRobotsTag: "index, follow",
    linkHeader: "",
  }, { expect: "public" });
  assert.ok(errs.some((e) => e.includes("rel=canonical")), errs.join("\n"));
});

test("validateHeaderRoute(public): noindex on a public route is flagged", () => {
  const errs = validateHeaderRoute({
    path: "/es",
    xRobotsTag: "noindex, follow",
    linkHeader: '<https://exentax.com/es>; rel="canonical"',
  }, { expect: "public" });
  assert.ok(errs.some((e) => e.includes("expected 'index, follow'")), errs.join("\n"));
});

test("validateHeaderRoute(private): noindex/nofollow passes", () => {
  const errs = validateHeaderRoute({
    path: "/booking/cita",
    xRobotsTag: "noindex, nofollow",
    linkHeader: "",
  }, { expect: "private" });
  assert.deepEqual(errs, []);
});

test("validateHeaderRoute(private): index on a private route is flagged", () => {
  const errs = validateHeaderRoute({
    path: "/booking/cita",
    xRobotsTag: "index, follow",
    linkHeader: "",
  }, { expect: "private" });
  assert.ok(errs.some((e) => e.includes("expected 'noindex, nofollow'")), errs.join("\n"));
});
