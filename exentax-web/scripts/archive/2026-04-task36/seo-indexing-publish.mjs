#!/usr/bin/env node
/*
 * seo-indexing-publish.mjs
 * ----------------------------------------------------------------------------
 * Runs the per-URL indexing audit (scripts/seo-indexing-audit.mjs) and
 * publishes the result as a self-contained HTML report into a stable
 * directory (default: <workspace>/uploads/reports/indexing/).
 *
 * Inputs (env):
 *   BASE_URL                  Live server to probe (default http://127.0.0.1:$PORT or :5000).
 *   INDEXING_REPORTS_DIR      Where to write reports (default <cwd>/uploads/reports/indexing).
 *   INDEXING_REPORTS_KEEP     How many timestamped reports to retain (default 10).
 *   INDEXING_AUDIT_SCRIPT     Override path to the audit .mjs (auto-resolved otherwise).
 *
 * Outputs:
 *   <REPORTS_DIR>/<ISO-timestamp>__<commit>.html   Timestamped report.
 *   <REPORTS_DIR>/latest.html                       Always points to the most recent run.
 *   <REPORTS_DIR>/latest.json                       Machine-readable summary of latest run.
 *   <REPORTS_DIR>/latest.md                         Raw markdown source of the latest run.
 *   <REPORTS_DIR>/index.html                        History view.
 *
 * Exit code: 0 on success (even if the audit reports red rows). Non-zero only
 * if the audit script failed to produce any output, so that an automated
 * caller (server startup, CI step) can distinguish "ran and found issues"
 * from "could not run". Critical findings are surfaced to the caller via a
 * console.warn line prefixed with `[indexing-publish] WARN`.
 * ----------------------------------------------------------------------------
 */
import { spawnSync } from "node:child_process";
import {
  existsSync, mkdirSync, readdirSync, readFileSync,
  unlinkSync, writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRIPT_DIR = __dirname;
const CWD = process.cwd();

const REPORTS_DIR = process.env.INDEXING_REPORTS_DIR
  || resolve(CWD, "uploads/reports/indexing");
const KEEP = Math.max(1, parseInt(process.env.INDEXING_REPORTS_KEEP || "10", 10));
const PORT = process.env.PORT || "5000";
const BASE_URL = (process.env.BASE_URL || `http://127.0.0.1:${PORT}`).replace(/\/$/, "");

function resolveAuditScript() {
  if (process.env.INDEXING_AUDIT_SCRIPT) return process.env.INDEXING_AUDIT_SCRIPT;
  const candidates = [
    resolve(SCRIPT_DIR, "seo-indexing-audit.mjs"),
    resolve(CWD, "exentax-web/scripts/seo-indexing-audit.mjs"),
    resolve(CWD, "scripts/seo-indexing-audit.mjs"),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  throw new Error(`Cannot locate seo-indexing-audit.mjs (tried: ${candidates.join(", ")})`);
}

function getCommit() {
  const r = spawnSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8", cwd: CWD });
  if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  return (
    process.env.REPL_DEPLOYMENT_ID
    || process.env.REPLIT_DEPLOYMENT_ID
    || process.env.GIT_COMMIT
    || "unknown"
  );
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// Lightweight markdown → HTML for the audit report (headings, paragraphs,
// bullets, inline code, **bold**, and pipe tables — the only constructs the
// audit emits).
function mdToHtml(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let i = 0;
  const inline = (s) => {
    let t = escapeHtml(s);
    t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return t;
  };
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) { i++; continue; }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++; continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      out.push("<ul>");
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        out.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>`);
        i++;
      }
      out.push("</ul>");
      continue;
    }
    if (/^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|\s*[-:| ]+\|\s*$/.test(lines[i + 1])) {
      const header = line.split("|").slice(1, -1).map((c) => c.trim());
      i += 2;
      out.push("<table><thead><tr>");
      for (const h of header) out.push(`<th>${inline(h)}</th>`);
      out.push("</tr></thead><tbody>");
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        const cells = lines[i].split("|").slice(1, -1).map((c) => c.trim());
        out.push("<tr>");
        for (const c of cells) {
          let cls = "";
          if (c.startsWith("❌")) cls = ' class="bad"';
          else if (c.startsWith("⚠")) cls = ' class="warn"';
          else if (c.startsWith("✅")) cls = ' class="ok"';
          out.push(`<td${cls}>${inline(c)}</td>`);
        }
        out.push("</tr>");
        i++;
      }
      out.push("</tbody></table>");
      continue;
    }
    // paragraph (collapse consecutive non-blank, non-special lines)
    const buf = [line];
    i++;
    while (
      i < lines.length
      && lines[i].trim() !== ""
      && !/^#{1,6}\s/.test(lines[i])
      && !/^\s*[-*]\s+/.test(lines[i])
      && !/^\|.*\|\s*$/.test(lines[i])
    ) {
      buf.push(lines[i]); i++;
    }
    out.push(`<p>${inline(buf.join(" "))}</p>`);
  }
  return out.join("\n");
}

function summarize(md) {
  const redMatch = md.match(/Red rows:\s*(\d+)\s*\/\s*(\d+)/);
  const redRows = redMatch ? parseInt(redMatch[1], 10) : 0;
  const totalRows = redMatch ? parseInt(redMatch[2], 10) : 0;
  const sitemapMissing = (md.match(/❌ missing from \/sitemap-/g) || []).length;
  const canonicalDrift = (md.match(/❌ SEO\.tsx canonical formula drift/g) || []).length;
  const jsonLdMissing = (md.match(/❌ missing [A-Z][A-Za-z, ]+/g) || []).length;
  const httpDown = (md.match(/❌ ERR:|❌ \d{3}/g) || []).length;
  const critical = sitemapMissing + canonicalDrift + jsonLdMissing;
  return {
    redRows, totalRows, sitemapMissing, canonicalDrift,
    jsonLdMissing, httpDown, critical,
  };
}

function renderHtml({ md, summary, generatedAt, commit, baseUrl }) {
  const css = `
:root{color-scheme:light dark;font-family:Inter,system-ui,sans-serif;line-height:1.5}
body{margin:0;background:#f8f7f4;color:#0a0f0c}
header{background:#0b0d0c;color:#fff;padding:24px 32px;border-bottom:4px solid #00e510}
header h1{margin:0 0 8px;font-size:22px}
header .meta{font-size:13px;color:#bcd}
main{padding:24px 32px;max-width:100%;overflow-x:auto}
.exec{background:#fff;border:1px solid #d8d6cf;border-radius:8px;padding:16px 20px;margin-bottom:24px}
.exec h2{margin:0 0 12px;font-size:16px}
.exec ul{margin:0;padding-left:20px}
.exec .crit{color:#b00020;font-weight:600}
.exec .ok{color:#0a7a2c;font-weight:600}
table{border-collapse:collapse;font-size:12px;width:auto}
th,td{border:1px solid #d8d6cf;padding:4px 8px;text-align:left;vertical-align:top;white-space:nowrap}
th{background:#eee;position:sticky;top:0}
td.bad{background:#ffe6e6;color:#b00020}
td.warn{background:#fff3cd;color:#7a5b00}
td.ok{color:#0a7a2c}
code{background:#eee;padding:1px 4px;border-radius:3px;font-size:11px}
@media (prefers-color-scheme:dark){
  body{background:#0a0f0c;color:#e8eae5}
  .exec{background:#11171a;border-color:#2a2f33}
  th{background:#11171a}
  td.bad{background:#3a0000;color:#ff8a8a}
  td.warn{background:#3a2900;color:#ffd97a}
  code{background:#1d2226}
  th,td{border-color:#2a2f33}
}
`;
  const hasCritical = summary.critical > 0;
  const exec = `
<section class="exec">
  <h2>Resumen ejecutivo</h2>
  <ul>
    <li><strong>Filas en rojo:</strong> ${summary.redRows} / ${summary.totalRows}</li>
    <li><strong>Sitemap roto (URLs ausentes):</strong> <span class="${summary.sitemapMissing ? "crit" : "ok"}">${summary.sitemapMissing}</span></li>
    <li><strong>Canonical drift (SEO.tsx):</strong> <span class="${summary.canonicalDrift ? "crit" : "ok"}">${summary.canonicalDrift}</span></li>
    <li><strong>JSON-LD types ausentes:</strong> <span class="${summary.jsonLdMissing ? "crit" : "ok"}">${summary.jsonLdMissing}</span></li>
    <li><strong>HTTP no-200 (página o alternates):</strong> ${summary.httpDown}</li>
    <li><strong>Estado crítico:</strong> <span class="${hasCritical ? "crit" : "ok"}">${hasCritical ? "ATENCIÓN — " + summary.critical + " problema(s) crítico(s)" : "sin problemas críticos"}</span></li>
  </ul>
</section>`;
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex,nofollow,noarchive,nosnippet">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Indexing audit — ${escapeHtml(generatedAt)} (${escapeHtml(commit)})</title>
<style>${css}</style>
</head>
<body>
<header>
  <h1>Auditoría de indexación — ${escapeHtml(generatedAt)}</h1>
  <div class="meta">
    commit <code>${escapeHtml(commit)}</code>
    · base <code>${escapeHtml(baseUrl)}</code>
    · <a href="latest.md" style="color:#00e510">ver markdown</a>
    · <a href="index.html" style="color:#00e510">historial</a>
  </div>
</header>
<main>
${exec}
${mdToHtml(md)}
</main>
</body>
</html>`;
}

function renderIndex({ history, latest }) {
  const rows = history.map((h) => `
    <tr>
      <td><a href="${escapeHtml(h.file)}">${escapeHtml(h.file)}</a></td>
      <td><code>${escapeHtml(h.commit)}</code></td>
      <td>${escapeHtml(h.generatedAt)}</td>
    </tr>`).join("");
  const css = `body{font-family:Inter,system-ui,sans-serif;background:#f8f7f4;color:#0a0f0c;padding:24px 32px;margin:0}
table{border-collapse:collapse}th,td{border:1px solid #d8d6cf;padding:6px 12px;text-align:left}
th{background:#eee}a{color:#0a7a2c}
@media(prefers-color-scheme:dark){body{background:#0a0f0c;color:#e8eae5}th{background:#11171a}th,td{border-color:#2a2f33}a{color:#00e510}}
`;
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8">
<meta name="robots" content="noindex,nofollow,noarchive,nosnippet">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Historial de auditorías de indexación</title>
<style>${css}</style></head>
<body>
<h1>Historial de auditorías de indexación</h1>
<p>Último informe publicado: <a href="latest.html">latest.html</a> (${escapeHtml(latest?.generatedAt || "—")}, commit <code>${escapeHtml(latest?.commit || "—")}</code>).</p>
<p>Resumen máquina: <a href="latest.json">latest.json</a> · Markdown: <a href="latest.md">latest.md</a>.</p>
<table>
<thead><tr><th>Archivo</th><th>Commit</th><th>Generado</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</body></html>`;
}

async function main() {
  mkdirSync(REPORTS_DIR, { recursive: true });
  const auditScript = resolveAuditScript();
  const auditCwd = resolve(auditScript, "..", "..");
  const generatedAt = new Date().toISOString();
  const safeStamp = generatedAt.replace(/[:.]/g, "-");
  const commit = getCommit();
  const tmpMd = resolve(REPORTS_DIR, `.tmp-${safeStamp}.md`);

  console.log(`[indexing-publish] auditing ${BASE_URL} → ${REPORTS_DIR}`);
  const audit = spawnSync(process.execPath, [auditScript, tmpMd], {
    stdio: "inherit",
    env: { ...process.env, BASE_URL },
    cwd: auditCwd,
  });

  if (!existsSync(tmpMd)) {
    console.error(`[indexing-publish] ERROR: audit script produced no output (exit=${audit.status})`);
    process.exit(audit.status || 1);
  }
  const md = readFileSync(tmpMd, "utf8");
  try { unlinkSync(tmpMd); } catch { /* keep going */ }

  const summary = { generatedAt, commit, baseUrl: BASE_URL, ...summarize(md) };
  const html = renderHtml({ md, summary, generatedAt, commit, baseUrl: BASE_URL });

  const fname = `${safeStamp}__${commit}.html`;
  writeFileSync(resolve(REPORTS_DIR, fname), html, "utf8");
  writeFileSync(resolve(REPORTS_DIR, "latest.html"), html, "utf8");
  writeFileSync(resolve(REPORTS_DIR, "latest.md"), md, "utf8");
  writeFileSync(resolve(REPORTS_DIR, "latest.json"), JSON.stringify(summary, null, 2), "utf8");

  // Rotate timestamped reports.
  const stamped = readdirSync(REPORTS_DIR)
    .filter((n) => /^\d{4}-\d{2}-\d{2}T.*__.*\.html$/.test(n))
    .sort();
  while (stamped.length > KEEP) {
    const old = stamped.shift();
    try { unlinkSync(resolve(REPORTS_DIR, old)); } catch { /* ignore */ }
  }

  // Build history index.
  const history = readdirSync(REPORTS_DIR)
    .filter((n) => /^\d{4}-\d{2}-\d{2}T.*__.*\.html$/.test(n))
    .sort()
    .reverse()
    .map((file) => {
      const m = file.match(/^(\d{4}-\d{2}-\d{2}T[\dZ-]+)__(.+)\.html$/);
      return {
        file,
        generatedAt: m ? m[1].replace(/-(\d{2})-(\d{2})-(\d{3})Z$/, ":$1:$2.$3Z") : file,
        commit: m ? m[2] : "—",
      };
    });
  writeFileSync(resolve(REPORTS_DIR, "index.html"), renderIndex({ history, latest: history[0] }), "utf8");

  console.log(`[indexing-publish] published ${fname} (${history.length} report(s) in history, red=${summary.redRows}/${summary.totalRows})`);
  if (summary.critical > 0) {
    console.warn(
      `[indexing-publish] WARN: ${summary.critical} critical issue(s) detected `
      + `(sitemap_missing=${summary.sitemapMissing}, canonical_drift=${summary.canonicalDrift}, `
      + `jsonld_missing=${summary.jsonLdMissing}). See ${resolve(REPORTS_DIR, "latest.html")}.`,
    );
  }
}

main().catch((e) => {
  console.error("[indexing-publish] ERROR:", e?.stack || e?.message || e);
  process.exit(1);
});
