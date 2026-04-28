#!/usr/bin/env node
/**
 * cta-canonical — Build the single, fully-resolved per-locale CTA
 * inventory by joining the runtime DOM crawl
 * (`reports/cta-rendered-inventory.json`) with the static
 * source-code map (`reports/cta-inventory.json`) on `data-testid`.
 *
 * Why a join is needed
 * --------------------
 * The rendered crawler answers "what does the visitor on /es/agendar
 * actually see?" — its rows have page, locale, surface, href, visible
 * text and `data-testid`. The static scan answers "where in the source
 * tree is this CTA defined?" — its rows have file:line, the literal
 * label expression, and the closest detected `trackCTA(...)` /
 * `trackWhatsAppClick(...)` call.
 *
 * Joining on `data-testid` (which is unique per CTA in this codebase
 * by convention) yields one canonical row that has both halves:
 *
 *     page, lang, surface, category, href, text,
 *     testid, file, line, source_label, tracking
 *
 * That is the "component + page + lang + copy + destination + tracking"
 * artifact reviewers asked for, with **zero unresolved fields** for
 * any CTA whose `data-testid` is statically inspectable.
 *
 * Outputs
 * -------
 *   reports/cta-canonical.csv
 *   reports/cta-canonical.json
 *
 * Coverage stats are emitted to stdout (and copied into the JSON's
 * `_meta` block) so the audit report can cite an exact join rate.
 *
 * Exit code: 0 if both input artifacts exist; 1 otherwise. This script
 * is purely a derivation step — it does not re-test anything.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "reports");

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function readJson(p) {
  try {
    return JSON.parse(await fs.readFile(p, "utf8"));
  } catch (e) {
    return null;
  }
}

const LOCALES = ["es", "en", "fr", "de", "pt", "ca"];

// Read `ROUTE_SLUGS` from `shared/routes.ts` so we can resolve
// every `lp("KEY")` destination found in the static inventory
// into the same URL shape the rendered crawler captures.
async function loadRouteSlugs() {
  const src = await fs.readFile(path.join(ROOT, "shared/routes.ts"), "utf8");
  const start = src.indexOf("ROUTE_SLUGS:");
  if (start < 0) return {};
  const block = src.slice(start, src.indexOf("};", start) + 2);
  const slugs = {};
  const rowRe = /(\w+):\s*\{([^}]*)\}/g;
  let m;
  while ((m = rowRe.exec(block)) !== null) {
    const key = m[1];
    if (key === "ROUTE_SLUGS") continue;
    const langRe = /(es|en|fr|de|pt|ca)\s*:\s*"([^"]*)"/g;
    const row = {};
    let lm;
    while ((lm = langRe.exec(m[2])) !== null) row[lm[1]] = lm[2];
    if (Object.keys(row).length === LOCALES.length) slugs[key] = row;
  }
  return slugs;
}

async function main() {
  const rendered = await readJson(path.join(OUT_DIR, "cta-rendered-inventory.json"));
  const staticInv = await readJson(path.join(OUT_DIR, "cta-inventory.json"));
  if (!rendered || !staticInv) {
    console.error(
      "[cta-canonical] missing input artifacts. Run\n" +
        "  node scripts/cta-rendered-crawler.mjs\n" +
        "  node scripts/cta-inventory.mjs\n" +
        "first.",
    );
    process.exit(1);
  }

  const routeSlugs = await loadRouteSlugs();

  // ---- Pass 1: index static rows by testid ------------------------
  // A testid can legitimately appear in multiple files (e.g. desktop +
  // mobile navbar both use `button-book-navbar`); we keep all matches
  // so the canonical row can list every source site.
  const byTestid = new Map();
  for (const row of staticInv) {
    const tid = (row.testid || "").trim();
    if (!tid || tid === "—") continue;
    if (!byTestid.has(tid)) byTestid.set(tid, []);
    byTestid.get(tid).push(row);
  }

  // ---- Pass 2: index static rows by per-lang resolved URL ---------
  // For every static row whose destination is a known route key
  // (e.g. `book`, `pillar_open_llc`), pre-compute the resolved
  // localized URL via ROUTE_SLUGS — `book` becomes `/es/agendar`
  // for Spanish, `/en/book` for English, etc. — and index the
  // static row under each. This lets us join rendered rows whose
  // testid is template-literal-only (so misses pass 1) but whose
  // *destination* matches the static lp("…") declaration.
  // Hard-coded leading-slash destinations (e.g. `/blog`) are also
  // indexed verbatim, ignoring locale.
  const byUrl = new Map();
  for (const row of staticInv) {
    const dest = (row.destination || "").trim();
    if (!dest || dest === "—") continue;
    if (dest.startsWith("/")) {
      const k = `*|${dest}`;
      if (!byUrl.has(k)) byUrl.set(k, []);
      byUrl.get(k).push(row);
      continue;
    }
    const slugRow = routeSlugs[dest];
    if (!slugRow) continue;
    for (const lang of LOCALES) {
      const slug = slugRow[lang];
      const url = slug ? `/${lang}/${slug}` : `/${lang}`;
      const k = `${lang}|${url}`;
      if (!byUrl.has(k)) byUrl.set(k, []);
      byUrl.get(k).push(row);
    }
  }

  const canonical = [];
  let withTestid = 0;
  let joinedByTestid = 0;
  let joinedByUrl = 0;
  for (const r of rendered) {
    const tid = (r.testid || "").trim();
    let matches = tid ? byTestid.get(tid) || [] : [];
    let matchedBy = matches.length ? "testid" : "";
    if (tid) withTestid += 1;
    if (matches.length === 0 && r.href) {
      // Try the resolved-URL index. Two lookups: lang-scoped, then
      // wildcard for absolute hrefs that don't carry a locale.
      const u1 = byUrl.get(`${r.lang}|${r.href}`) || [];
      const u2 = byUrl.get(`*|${r.href}`) || [];
      if (u1.length || u2.length) {
        matches = [...u1, ...u2];
        matchedBy = "url";
      }
    }
    if (matchedBy === "testid") joinedByTestid += 1;
    else if (matchedBy === "url") joinedByUrl += 1;
    canonical.push({
      page: r.page,
      lang: r.lang,
      surface: r.surface,
      category: r.category,
      href: r.href,
      text: r.text,
      testid: tid,
      matched_by: matchedBy,
      file_lines: matches.map((m) => `${m.file}:${m.line}`).join(" | "),
      source_labels: matches.map((m) => m.label).filter((x) => x && x !== "—").join(" | "),
      // Only propagate `tracking` for **testid-anchored** joins.
      // A URL-fallback match only proves "some component routes
      // here"; it does NOT prove the rendered anchor fires that
      // component's `trackCTA(...)` call. Propagating tracking on
      // URL-only matches would falsely attribute analytics events
      // to unrelated links sharing the same destination (e.g.
      // every footer link pointing at /es/contacto would inherit
      // the contact page's hero CTA tracking event).
      tracking:
        matchedBy === "testid"
          ? matches.map((m) => m.tracking).filter((x) => x && x !== "—").join(" | ")
          : "",
    });
  }

  const joined = joinedByTestid + joinedByUrl;
  const meta = {
    generated_at: new Date().toISOString(),
    rendered_rows: rendered.length,
    rows_with_testid: withTestid,
    rows_joined_to_source: joined,
    rows_joined_by_testid: joinedByTestid,
    rows_joined_by_resolved_url: joinedByUrl,
    join_rate_pct: rendered.length === 0 ? 0 : +(joined * 100 / rendered.length).toFixed(1),
    join_rate_among_testid_pct:
      withTestid === 0 ? 0 : +(joinedByTestid * 100 / withTestid).toFixed(1),
    column_completeness: {
      page: "complete",
      lang: "complete",
      surface: "complete",
      category: "complete",
      href: "complete",
      text: "complete",
      testid: "complete-when-non-empty",
      file_lines: "best-effort (regex-based static scan)",
      source_labels: "best-effort (regex-based static scan)",
      tracking:
        "populated only on testid-anchored joins; blank on URL-fallback rows to avoid false attribution",
    },
  };

  await fs.writeFile(
    path.join(OUT_DIR, "cta-canonical.json"),
    JSON.stringify({ _meta: meta, rows: canonical }, null, 2),
  );
  const cols = [
    "page",
    "lang",
    "surface",
    "category",
    "href",
    "text",
    "testid",
    "matched_by",
    "file_lines",
    "source_labels",
    "tracking",
  ];
  await fs.writeFile(
    path.join(OUT_DIR, "cta-canonical.csv"),
    [cols.join(","), ...canonical.map((r) => cols.map((c) => csvEscape(r[c])).join(","))].join("\n") + "\n",
  );

  console.log(
    `[cta-canonical] rows=${rendered.length} with_testid=${withTestid} joined=${joined} ` +
      `join_rate=${meta.join_rate_pct}% (of testid rows: ${meta.join_rate_among_testid_pct}%)`,
  );
  console.log("[cta-canonical] wrote reports/cta-canonical.{csv,json}");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
