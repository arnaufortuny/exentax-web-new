#!/usr/bin/env node
/*
 * seo-slash-hygiene.mjs
 * ----------------------------------------------------------------------------
 * CI gate for URL slash hygiene (see docs/seo/url-slash-policy.md).
 *
 * Detects three classes of slash bugs that silently break SEO:
 *
 *   1. Double slash (`//`) inside a path. Legal only as the `https://`
 *      scheme separator in an absolute URL.
 *   2. Trailing slash on any path other than `/` itself. Our canonical rule
 *      is "no trailing slash"; any leak duplicates content under two URLs.
 *   3. Duplicated / wrong language prefix, e.g. `/es//blog`, `/es/es/blog`,
 *      `/en/es/blog/<slug>`. Each path must carry exactly one
 *      `/<lang>/` segment at the start.
 *
 * Sources scanned:
 *
 *   • Source files under `client/src` — hard-coded `href="/..."` literals,
 *     wouter `<Link href="...">` props, programmatic `setLocation("...")` /
 *     `navigate("...")` calls, and localised-route helper calls
 *     `lp("...")` / `getLocalizedPath("...")`.
 *   • Static sitemaps under `public/sitemap*.xml` (if any).
 *   • The live sitemap-index when `BASE_URL` is set
 *     (`<loc>` + every `xhtml:link href="..."`).
 *
 * A markdown report is written to `reports/seo/slash-hygiene.md` (or argv[2])
 * listing every offender together with the file/line that produced it.
 *
 * Exits 0 when nothing is flagged, 1 otherwise. Wired as `npm run seo:slash`
 * and as part of `npm run check`.
 * ----------------------------------------------------------------------------
 */
import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  statSync,
  mkdirSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, relative } from "node:path";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const LANG_RE = LANGS.join("|");
let BASE_URL = (process.env.BASE_URL || "").replace(/\/$/, "");
const SKIP_LIVE = process.env.SEO_SLASH_SKIP_LIVE === "1";
// Ignore CLI flags (--check, --strict, etc.) so they aren't mistaken as the
// output path. argv[2] is only honored when it's a real path (no leading "-").
const OUT_ARG = process.argv.slice(2).find((a) => a && !a.startsWith("-"));
const OUT = OUT_ARG || resolve(ROOT, "reports/seo/slash-hygiene.md");
const HTTP_TIMEOUT_MS = 15000;
// Server boot can take > 60 s when the host is under load (CI sandbox, cold
// Replit dial-out, cold Hostinger VPS). The server always loads BLOG_POSTS +
// BLOG_CONTENT_ES + BLOG_I18N (333+ TS files) on startup, plus pg pool init,
// plus the email retry worker. 180 s keeps fast environments snappy (usually
// < 10 s) while tolerating the slow ones. Override with SEO_SLASH_TIMEOUT_MS.
const SERVER_READY_TIMEOUT_MS = Number(process.env.SEO_SLASH_TIMEOUT_MS || 180000);
const FIRST_PARTY_HOSTS = new Set(["exentax.com", "www.exentax.com"]);

const findings = []; // { kind, path, source, line }

function record(kind, urlPath, source, line) {
  findings.push({ kind, path: urlPath, source, line: line ?? "" });
}

// ---------- Path validators ------------------------------------------------

// Returns one of: null (clean) or a string kind describing the problem.
// `pathOnly` is the path component of a URL — never includes scheme/host.
function classify(pathOnly) {
  if (!pathOnly.startsWith("/")) return null; // not a path we own
  if (pathOnly === "/") return null;
  if (pathOnly.includes("//")) return "double-slash";
  if (pathOnly.length > 1 && pathOnly.endsWith("/")) return "trailing-slash";
  // Duplicated / mismatched language prefix.
  // Anything starting with /<lang>/<lang>/ where both langs are in our set.
  const dup = new RegExp(`^/(${LANG_RE})/(${LANG_RE})(/|$)`);
  if (dup.test(pathOnly)) return "duplicate-lang-prefix";
  return null;
}

// Strip an absolute URL down to its path; return null if not http(s) or not
// a first-party host. For relative URLs returns them as-is.
//
// First-party = exentax.com / www.exentax.com plus the host of BASE_URL when
// set (so a localhost dev server scan still works). Anything else (e.g.
// google.com tracking links, social profiles) is ignored to avoid false
// positives.
function pathFromHref(href) {
  if (!href) return null;
  if (href.startsWith("//")) return null; // protocol-relative — out of scope
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
    try {
      const u = new URL(href);
      if (u.protocol !== "http:" && u.protocol !== "https:") return null;
      const allowed = new Set(FIRST_PARTY_HOSTS);
      if (BASE_URL) {
        try { allowed.add(new URL(BASE_URL).host); } catch {}
      }
      if (!allowed.has(u.host)) return null;
      return u.pathname + (u.search || "");
    } catch {
      return null;
    }
  }
  if (!href.startsWith("/")) return null;
  // Strip query/fragment for hygiene purposes.
  const q = href.indexOf("?");
  const h = href.indexOf("#");
  let end = href.length;
  if (q >= 0) end = Math.min(end, q);
  if (h >= 0) end = Math.min(end, h);
  return href.slice(0, end);
}

// ---------- Source scan ----------------------------------------------------

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "dist" || entry.startsWith(".")) continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?|mjs|cjs|html|md|xml)$/.test(entry)) out.push(p);
  }
  return out;
}

function lineOf(src, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < src.length; i++) {
    if (src[i] === "\n") line++;
  }
  return line;
}

// Patterns that emit navigational link literals.
// Each pattern captures the URL string in group 1.
const SOURCE_PATTERNS = [
  /\bhref\s*=\s*["'`]([^"'`\s]+)["'`]/g,            // href="/x"
  /\bhref\s*=\s*\{\s*["'`]([^"'`\s]+)["'`]\s*\}/g,  // href={"/x"}
  /\bto\s*=\s*["'`]([^"'`\s]+)["'`]/g,              // to="/x"
  /\b(?:setLocation|navigate)\s*\(\s*["'`]([^"'`\s]+)["'`]/g,
  /\b(?:lp|getLocalizedPath)\s*\(\s*["'`]([^"'`\s]+)["'`]/g,
];

function scanSourceFile(file) {
  const src = readFileSync(file, "utf8");
  for (const rx of SOURCE_PATTERNS) {
    rx.lastIndex = 0;
    let m;
    while ((m = rx.exec(src))) {
      const raw = m[1];
      const p = pathFromHref(raw);
      if (!p) continue;
      const kind = classify(p);
      if (kind) {
        record(kind, raw, relative(ROOT, file), lineOf(src, m.index));
      }
    }
  }
}

function scanSources() {
  const files = walk(resolve(ROOT, "client/src"));
  for (const f of files) scanSourceFile(f);
}

// ---------- Sitemap scan ---------------------------------------------------

function extractSitemapHrefs(xml) {
  const hrefs = [];
  const locRe = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = locRe.exec(xml))) hrefs.push(m[1]);
  const altRe = /<xhtml:link\b[^>]*\bhref="([^"]+)"/g;
  while ((m = altRe.exec(xml))) hrefs.push(m[1]);
  return hrefs;
}

function scanXmlFile(file) {
  const xml = readFileSync(file, "utf8");
  for (const h of extractSitemapHrefs(xml)) {
    const p = pathFromHref(h);
    if (!p) continue;
    const kind = classify(p);
    if (kind) record(kind, h, relative(ROOT, file), "");
  }
}

function scanStaticSitemaps() {
  const candidates = [
    resolve(ROOT, "public"),
    resolve(ROOT, "client/public"),
    resolve(ROOT, "dist/public"),
  ];
  for (const dir of candidates) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (/^sitemap.*\.xml$/.test(f)) scanXmlFile(join(dir, f));
    }
  }
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), HTTP_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    return { status: res.status, body: await res.text() };
  } finally {
    clearTimeout(t);
  }
}

async function pickFreePort() {
  return await new Promise((res, rej) => {
    const srv = createServer();
    srv.unref();
    srv.on("error", rej);
    srv.listen(0, "127.0.0.1", () => {
      const port = srv.address().port;
      srv.close(() => res(port));
    });
  });
}

async function waitFor200(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetchText(url);
      if (r.status === 200) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

let spawnedServer = null;
/**
 * Ensure a running server we can hit for the live scan. Returns:
 *   - `true`  → live scan can proceed (BASE_URL is set and reachable).
 *   - `false` → no server available (sandbox, no DATABASE_URL, boot failed
 *              within SERVER_READY_TIMEOUT_MS). Caller MUST degrade to
 *              source-only scan with a clear warning; this is NOT an error.
 */
async function ensureLiveServer() {
  if (BASE_URL) {
    const ok = await waitFor200(`${BASE_URL}/sitemap.xml`, 5000);
    if (!ok) {
      console.warn(`⚠ BASE_URL=${BASE_URL} provided but /sitemap.xml is not reachable — skipping live scan.`);
      return false;
    }
    return true;
  }
  // Try the conventional dev port first so we reuse an already-running server.
  const probe = "http://localhost:5000";
  if (await waitFor200(`${probe}/sitemap.xml`, 1500)) {
    BASE_URL = probe;
    console.log(`Using already-running dev server at ${BASE_URL}.`);
    return true;
  }
  // Otherwise spawn `tsx server/index.ts` on a free port. The server needs
  // a reachable DATABASE_URL to boot (see server/index.ts:runColumnMigrations).
  // If none is configured we skip the live scan instead of hanging.
  if (!process.env.DATABASE_URL) {
    console.warn("⚠ DATABASE_URL not set — skipping live scan (source-only).");
    console.warn("  To run the live scan locally: `DATABASE_URL=… npm run seo:slash`,");
    console.warn("  or start `npm run dev` in another terminal first.");
    return false;
  }
  const port = await pickFreePort();
  console.log(`Starting temporary server on port ${port} for sitemap scan ...`);
  spawnedServer = spawn(
    process.execPath,
    [resolve(ROOT, "node_modules/tsx/dist/cli.mjs"), resolve(ROOT, "server/index.ts")],
    {
      cwd: ROOT,
      env: { ...process.env, PORT: String(port), NODE_ENV: "development" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  spawnedServer.stdout?.on("data", () => {});
  spawnedServer.stderr?.on("data", () => {});
  BASE_URL = `http://localhost:${port}`;
  const ok = await waitFor200(`${BASE_URL}/sitemap.xml`, SERVER_READY_TIMEOUT_MS);
  if (!ok) {
    try { spawnedServer.kill("SIGTERM"); } catch {}
    spawnedServer = null;
    console.warn(`⚠ Temporary server on ${BASE_URL} did not serve /sitemap.xml within ${SERVER_READY_TIMEOUT_MS}ms — skipping live scan.`);
    console.warn("  Override with SEO_SLASH_TIMEOUT_MS=<ms> if the boot is slow but eventually succeeds.");
    return false;
  }
  return true;
}

function stopLiveServer() {
  if (!spawnedServer) return;
  try { spawnedServer.kill("SIGTERM"); } catch {}
  spawnedServer = null;
}

// Probe a few representative dirty URLs against the live server and confirm
// each one 301-redirects to the canonical form. This guards against a future
// regression where the source/sitemap scans pass but the runtime middleware
// has been removed or weakened. Mirrors `canonicalizeStraySlashPath` in
// `server/index.ts`.
async function probeDirtyRedirects() {
  // Pick a clean target that exists on the live server (root of the default
  // language). The probes append slashes / dup prefixes around it so the
  // canonical form is the original path. Using `/es` keeps the probe robust
  // across deployments (the home is always served).
  const cases = [
    // [dirty path, expected canonical path, family label]
    ["/es/",         "/es",        "trailing-slash"],
    ["/es//",        "/es",        "double-slash"],
    ["/es/es",       "/es",        "duplicate-lang-prefix"],
  ];
  for (const [dirty, expected, family] of cases) {
    const url = `${BASE_URL}${dirty}`;
    let res;
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), HTTP_TIMEOUT_MS);
      res = await fetch(url, { redirect: "manual", signal: ctrl.signal });
      clearTimeout(t);
    } catch (e) {
      record("redirect-probe-error", dirty, `${family}: ${String(e?.message || e)}`, "");
      continue;
    }
    if (res.status !== 301) {
      record("redirect-probe-failed", dirty, `${family}: expected 301, got ${res.status}`, "");
      continue;
    }
    const loc = res.headers.get("location") || "";
    // The Location header may be absolute or relative; normalise to a path.
    let locPath = loc;
    try { locPath = new URL(loc, BASE_URL).pathname; } catch {}
    if (locPath !== expected) {
      record("redirect-probe-wrong-target", dirty, `${family}: expected ${expected}, got ${locPath}`, "");
    }
  }
}

async function scanLiveSitemap() {
  const seen = new Set();
  const queue = [`${BASE_URL}/sitemap.xml`];
  while (queue.length) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    let body;
    try {
      const r = await fetchText(url);
      if (r.status !== 200) {
        record("fetch-error", url, `HTTP ${r.status}`, "");
        continue;
      }
      body = r.body;
    } catch (e) {
      record("fetch-error", url, String(e?.message || e), "");
      continue;
    }
    if (/<sitemapindex/.test(body)) {
      const re = /<sitemap>\s*<loc>([^<]+)<\/loc>/g;
      let m;
      while ((m = re.exec(body))) {
        let pathOnly = m[1];
        try { pathOnly = new URL(m[1]).pathname; } catch {}
        queue.push(`${BASE_URL}${pathOnly}`);
      }
      continue;
    }
    for (const h of extractSitemapHrefs(body)) {
      const p = pathFromHref(h);
      if (!p) continue;
      const kind = classify(p);
      if (kind) record(kind, h, url, "");
    }
  }
}

// ---------- Report ---------------------------------------------------------

function writeReport() {
  const dir = dirname(OUT);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const grouped = new Map();
  for (const f of findings) {
    if (!grouped.has(f.kind)) grouped.set(f.kind, []);
    grouped.get(f.kind).push(f);
  }
  const lines = [];
  lines.push("# URL slash hygiene report");
  lines.push("");
  lines.push(`Generated by \`scripts/seo-slash-hygiene.mjs\` on ${new Date().toISOString()}.`);
  lines.push("");
  lines.push("Canonical rule: see `docs/seo/url-slash-policy.md`.");
  lines.push("");
  if (!findings.length) {
    lines.push("**Result: ✅ clean — no slash hygiene issues found.**");
    lines.push("");
    lines.push(`Sources scanned: \`client/src\`, static sitemaps under \`public/\` / \`client/public/\` / \`dist/public/\`${BASE_URL ? `, live sitemap at ${BASE_URL}/sitemap.xml` : ""}.`);
  } else {
    lines.push(`**Result: ✗ ${findings.length} issue(s) across ${grouped.size} category/categories.**`);
    lines.push("");
    for (const [kind, items] of grouped) {
      lines.push(`## ${kind} (${items.length})`);
      lines.push("");
      lines.push("| url | source | line |");
      lines.push("| --- | --- | --- |");
      for (const it of items) {
        lines.push(`| \`${it.path}\` | ${it.source} | ${it.line} |`);
      }
      lines.push("");
    }
  }
  writeFileSync(OUT, lines.join("\n") + "\n", "utf8");
}

async function main() {
  scanSources();
  scanStaticSitemaps();
  if (!SKIP_LIVE) {
    try {
      const liveOK = await ensureLiveServer();
      if (liveOK) {
        await scanLiveSitemap();
        await probeDirtyRedirects();
      }
    } finally {
      stopLiveServer();
    }
  } else {
    console.log("SEO_SLASH_SKIP_LIVE=1 — skipping live sitemap scan (sources only).");
  }
  writeReport();

  if (!findings.length) {
    console.log(`✓ slash-hygiene: clean (report → ${relative(ROOT, OUT)})`);
    process.exit(0);
  }
  console.error(`\n✖ slash-hygiene: ${findings.length} issue(s):`);
  for (const f of findings.slice(0, 50)) {
    console.error(`  [${f.kind}] ${f.path}  (${f.source}${f.line ? `:${f.line}` : ""})`);
  }
  if (findings.length > 50) console.error(`  ... and ${findings.length - 50} more`);
  console.error(`\nFull report: ${relative(ROOT, OUT)}`);
  process.exit(1);
}

main().catch((e) => {
  console.error("Unhandled error:", e);
  process.exit(1);
});
