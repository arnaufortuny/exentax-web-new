#!/usr/bin/env node
/**
 * CI gate for the diagnostic audit.
 *
 * Reads the JSON reports produced by
 * `auditoria-rutas-componentes-discord-emails.mjs` and exits with a
 * non-zero status when a critical regression is detected:
 *
 *   - any route returns 404 or a server error
 *   - sitemap.xml exposes URLs that do not resolve to a known page
 *     (extras), or is itself unreachable
 *   - email templates regain spam-trigger words
 *   - email templates contain localhost / unresolved-template links
 *   - Discord EVENT_TYPES gain orphan entries (no notify* wrapper)
 *   - internal nav links (Navbar / Footer) come back broken
 *   - any new route appears in the app but not in `sitemap.xml` and
 *     is not part of `SITEMAP_EXCLUDE_ALLOWLIST` below
 *
 * Soft warnings (non-failing) are printed for missing hreflang
 * alternates, so the CI surfaces drift without blocking unrelated PRs.
 *
 * --- Sitemap exclusion allowlist -----------------------------------------
 * These app routes are intentionally absent from sitemap.xml. They are
 * utility / non-canonical pages that should not be exposed to search
 * engines. Any other route that appears in the app but not in the
 * sitemap will fail this gate and must either be added to the sitemap
 * (in `server/routes/public.ts`) or appended here with a justification.
 *
 *   /links → external link-tree landing (no SEO value, marketing only)
 *   /start → onboarding wizard, gated and language-agnostic
 *   /blog  → non-localized fallback for /:lang/blog; the 6 localized
 *            variants /es/blog … /ca/blog are already in the sitemap
 *            and carry the canonical signal.
 *
 * Usage:
 *   node scripts/audit/auditoria-ci-gate.mjs
 *   AUDIT_DIR=docs/auditoria-2026-04 node scripts/audit/auditoria-ci-gate.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const AUDIT_DIR = path.resolve(ROOT, process.env.AUDIT_DIR || "docs/auditoria-2026-04");

async function readJson(name) {
  const file = path.join(AUDIT_DIR, name);
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (e) {
    throw new Error(`Cannot read ${path.relative(ROOT, file)}: ${e.message}`);
  }
}

function header(title) {
  console.log(`\n── ${title} ──`);
}

const SITEMAP_EXCLUDE_ALLOWLIST = new Set([
  "/links",
  "/start",
  "/blog",
]);

const failures = [];
const warnings = [];

const routes = await readJson("slugs-rutas-audit.json");
const emails = await readJson("emails-audit.json");
const discord = await readJson("discord-bot-audit.json");

header("Routes");
console.log(
  `expected=${routes.totals.expected} ok=${routes.totals.ok} ` +
    `redirects=${routes.totals.redirects} 404=${routes.totals.notFound} ` +
    `errors=${routes.totals.errors}`,
);
if (routes.totals.notFound > 0) {
  const offenders = []
    .concat(...Object.values(routes.byLang).map((b) => b.routes))
    .concat(routes.auxRoutes?.routes || [])
    .filter((r) => r.status === 404)
    .map((r) => r.path);
  failures.push(
    `Routes returning 404: ${routes.totals.notFound} (${offenders.slice(0, 10).join(", ")}${
      offenders.length > 10 ? "…" : ""
    })`,
  );
}
if (routes.totals.errors > 0) {
  failures.push(`Routes returning 5xx / network errors: ${routes.totals.errors}`);
}
if ((routes.internalNavSample?.brokenLinks || []).length > 0) {
  const broken = routes.internalNavSample.brokenLinks
    .map((b) => `${b.href} (${b.status})`)
    .join(", ");
  failures.push(`Broken internal nav links: ${broken}`);
}

header("Sitemap");
console.log(
  `status=${routes.sitemap.status} totalUrls=${routes.sitemap.totalUrls} ` +
    `inAppNotInSitemap=${routes.sitemap.inAppNotInSitemap.length} ` +
    `inSitemapNotInApp=${routes.sitemap.inSitemapNotInApp.length}`,
);
if (routes.sitemap.status !== 200) {
  failures.push(`sitemap.xml unreachable (status=${routes.sitemap.status})`);
}
if (routes.sitemap.inSitemapNotInApp.length > 0) {
  failures.push(
    `Sitemap exposes ${routes.sitemap.inSitemapNotInApp.length} URL(s) that do not resolve to a known page: ` +
      routes.sitemap.inSitemapNotInApp.slice(0, 10).join(", "),
  );
}
{
  const missing = routes.sitemap.inAppNotInSitemap || [];
  const unexpected = missing.filter((p) => !SITEMAP_EXCLUDE_ALLOWLIST.has(p));
  const allowed = missing.filter((p) => SITEMAP_EXCLUDE_ALLOWLIST.has(p));
  if (unexpected.length > 0) {
    failures.push(
      `Routes missing from sitemap and not in allowlist: ${unexpected.length} ` +
        `(${unexpected.slice(0, 10).join(", ")}${unexpected.length > 10 ? "…" : ""}). ` +
        `Add them to the sitemap generator (server/routes/public.ts) or to ` +
        `SITEMAP_EXCLUDE_ALLOWLIST in scripts/audit/auditoria-ci-gate.mjs with a justification.`,
    );
  }
  if (allowed.length > 0) {
    console.log(
      `i INFO  ${allowed.length} route(s) intentionally excluded from sitemap: ${allowed.join(", ")}`,
    );
  }
}
if ((routes.missingHreflang || []).length > 0) {
  warnings.push(`Routes with incomplete hreflang alternates: ${routes.missingHreflang.length}`);
}

header("Emails");
console.log(
  `templates=${emails.templates.length} spamTriggers=${emails.spamTriggers.length} ` +
    `brokenLinks=${emails.brokenLinks.length}`,
);
if (emails.spamTriggers.length > 0) {
  failures.push(
    `Email spam triggers detected: ${emails.spamTriggers
      .map((s) => `${s.word} (${s.hits})`)
      .join(", ")}`,
  );
}
const blockingLinkKinds = new Set(["localhost", "unresolved_template"]);
const blockingLinks = (emails.brokenLinks || []).filter((b) => blockingLinkKinds.has(b.kind));
if (blockingLinks.length > 0) {
  failures.push(
    `Email broken links (${blockingLinks.length}): ` +
      blockingLinks.map((b) => `[${b.kind}] ${b.url}`).slice(0, 10).join(", "),
  );
}
const httpInsecure = (emails.brokenLinks || []).filter((b) => b.kind === "http_insecure");
if (httpInsecure.length > 0) {
  warnings.push(`Email http:// (insecure) links: ${httpInsecure.length}`);
}

header("Discord");
console.log(
  `events=${discord.eventCatalog.length} notifyFns=${discord.notifyFunctions.length} ` +
    `orphanEvents=${(discord.orphanEvents || []).length} ` +
    `untestedEvents=${(discord.untestedEvents || []).length}`,
);
if ((discord.orphanEvents || []).length > 0) {
  failures.push(
    `Discord orphan events (no notify* wrapper): ${discord.orphanEvents.join(", ")}`,
  );
}
if ((discord.untestedEvents || []).length > 0) {
  warnings.push(
    `Discord events without test coverage: ${discord.untestedEvents.length} ` +
      `(${discord.untestedEvents.slice(0, 5).join(", ")}${
        discord.untestedEvents.length > 5 ? "…" : ""
      })`,
  );
}

header("Result");
for (const w of warnings) console.log(`! WARN  ${w}`);
for (const f of failures) console.log(`✗ FAIL  ${f}`);

if (failures.length > 0) {
  console.error(`\n${failures.length} blocking regression(s) detected. See reports in ${path.relative(ROOT, AUDIT_DIR)}/`);
  process.exit(1);
}

console.log(`\n✓ Diagnostic audit gate passed (${warnings.length} warning(s)).`);
