#!/usr/bin/env node
/**
 * cta-inventory — Static inventory of every interactive CTA / button
 * / link / WhatsApp anchor that the site renders, used by Task #19.
 *
 * Walks every `.tsx` file under `client/src/{components,pages,data}`
 * and extracts (with a small regex-state machine — no AST):
 *
 *   - <Link href={lp("...")|lp("/blog")|lp(routeKey)} ...>      → internal CTA
 *   - <a   href={... wa.me ... encodeURIComponent(t("..."))}>   → WhatsApp CTA
 *   - <a   href="/..."> (hardcoded, language-agnostic)          → flagged
 *   - <a   href="/{lang}/..."> (hardcoded with prefix)          → flagged
 *
 * For each match we capture: file (relative), line, type
 * (link|whatsapp|external), copy (i18n key or literal), destination
 * (route key, /blog path, wa.me, mailto, or absolute URL),
 * data-testid (or "—") and the nearby trackCTA / trackWhatsAppClick
 * tag (or "—").
 *
 * Output — three files in `reports/`:
 *
 *   reports/cta-inventory.json   — full structured dump (audit DB)
 *   reports/cta-inventory.csv    — same data, importable into Sheets
 *   reports/cta-inventory.md     — human-readable summary by surface
 *
 * Idempotent. Safe to run on every commit. Designed to be the
 * *single source of truth* for the audit so the report and the
 * Playwright spec can read from it instead of re-deriving the list.
 *
 * Counts and totals are printed to stdout for CI eyeballing. Exits 0
 * even when issues are found — this script is a *report*, not a gate.
 * The companion `cta-link-crawler.mjs` is responsible for actually
 * gating broken destinations.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIRS = ["client/src/components", "client/src/pages", "client/src/data"];
const OUT_DIR = path.join(ROOT, "reports");

const FILE_EXT = /\.(tsx|ts)$/;

async function walk(dir, acc) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return acc; }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name === "blog-content") continue;
      await walk(full, acc);
    } else if (FILE_EXT.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

const PATTERNS = [
  // <Link href={lp("route_key")} ... data-testid="..." ...>
  {
    type: "link",
    re: /<Link\b[^>]*?\bhref=\{(?:lp\(\s*["'`]([^"'`]+)["'`]\s*\)|lp\([^)]+\)|`[^`]+`|"[^"]+"|'[^']+')\}[^>]*?>/g,
  },
  // <a href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("KEY"))}`} ...>
  {
    type: "whatsapp",
    re: /<a\b[^>]*?\bhref=\{`\$\{CONTACT\.WHATSAPP_URL\}\?text=\$\{encodeURIComponent\(\s*t\(\s*["'`]([^"'`]+)["'`][^)]*\)\s*\)\}`?\}[^>]*?>/g,
  },
  // <a href="https://wa.me/..."> (hardcoded WhatsApp anchor)
  {
    type: "whatsapp_hardcoded",
    re: /<a\b[^>]*?\bhref=["']https:\/\/wa\.me\/[^"']+["'][^>]*?>/g,
  },
  // <a href={`mailto:${CONTACT.EMAIL}`}> or <a href="mailto:...">
  {
    type: "mailto",
    re: /<a\b[^>]*?\bhref=(?:\{`mailto:[^`]+`\}|["']mailto:[^"']+["'])[^>]*?>/g,
  },
  // Hardcoded internal absolute path — flag.
  {
    type: "hardcoded_internal",
    re: /<(?:Link|a)\b[^>]*?\bhref=["']\/(?:es|en|fr|de|pt|ca)\/[^"']*["'][^>]*?>/g,
  },
];

function extractAttr(tag, name) {
  const reLit = new RegExp(`\\b${name}=["']([^"']+)["']`);
  const reExpr = new RegExp(`\\b${name}=\\{([^}]+)\\}`);
  return (tag.match(reLit)?.[1] || tag.match(reExpr)?.[1] || "").trim();
}

function locateLine(src, idx) {
  let line = 1;
  for (let i = 0; i < idx; i++) if (src.charCodeAt(i) === 10) line++;
  return line;
}

async function inventoryFile(absPath) {
  const rel = path.relative(ROOT, absPath);
  const src = await fs.readFile(absPath, "utf8");
  const out = [];
  for (const { type, re } of PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src)) !== null) {
      const tag = m[0];
      const line = locateLine(src, m.index);
      const testid = extractAttr(tag, "data-testid") || "—";
      const labelKeyMatch = tag.match(/\{t\(\s*["'`]([^"'`]+)["'`]/);
      const label = labelKeyMatch ? labelKeyMatch[1] : (extractAttr(tag, "aria-label") || "—");
      const trackingNearby = src.slice(m.index, m.index + tag.length + 600).match(/track(?:CTA|WhatsAppClick|Booking[A-Za-z]*)\(\s*["'`]([^"'`]+)["'`]/);
      const tracking = trackingNearby ? trackingNearby[1] : "—";
      let destination = "—";
      if (type === "link" && m[1]) destination = m[1];
      else if (type === "whatsapp" && m[1]) destination = `wa.me?text={t("${m[1]}")}`;
      else if (type === "whatsapp_hardcoded") destination = "wa.me (hardcoded)";
      else if (type === "mailto") destination = "mailto";
      else if (type === "hardcoded_internal") {
        const href = extractAttr(tag, "href");
        destination = href || "(hardcoded /lang/...)";
      }
      out.push({ file: rel, line, type, label, destination, testid, tracking });
    }
  }
  return out;
}

function toCsv(rows) {
  const cols = ["file", "line", "type", "label", "destination", "testid", "tracking"];
  const esc = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

function toMd(rows) {
  const bySurface = new Map();
  for (const r of rows) {
    const surface = r.file.includes("/components/layout/") ? "Layout"
                  : r.file.includes("/components/sections/") ? "Sections"
                  : r.file.includes("/components/blog/") ? "Blog"
                  : r.file.includes("/components/calculator/") ? "Calculator"
                  : r.file.includes("/pages/") ? "Pages"
                  : r.file.includes("/data/") ? "Data"
                  : "Other";
    if (!bySurface.has(surface)) bySurface.set(surface, []);
    bySurface.get(surface).push(r);
  }
  const lines = ["# CTA inventory", "", `_${rows.length} interactive elements detected across the codebase._`, ""];
  for (const [surface, items] of [...bySurface.entries()].sort()) {
    lines.push(`## ${surface} — ${items.length}`, "");
    lines.push("| File | Line | Type | Label | Destination | testid | Tracking |");
    lines.push("|---|---:|---|---|---|---|---|");
    for (const r of items) {
      lines.push(`| ${r.file} | ${r.line} | ${r.type} | \`${r.label}\` | \`${r.destination}\` | \`${r.testid}\` | ${r.tracking} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

// --- Per-locale expansion ---------------------------------------------------
//
// The `cta-inventory.{json,csv,md}` artifacts above are the
// "definition" of every CTA: one row per code-site. For full audit
// traceability the task also requires the *resolved* per-locale
// destination + copy. We expand each definition row to one row per
// supported locale, looking up the localized slug in `ROUTE_SLUGS`
// and the localized i18n string when the row references one.

const LOCALES = ["es", "en", "fr", "de", "pt", "ca"];

async function loadRouteSlugs() {
  const src = await fs.readFile(path.join(ROOT, "shared/routes.ts"), "utf8");
  const block = src.match(/export const ROUTE_SLUGS[\s\S]*?=\s*\{([\s\S]*?)\n\}\s*(?:as const)?\s*;/);
  if (!block) return {};
  const out = {};
  const entryRe = /^\s*([A-Za-z0-9_]+):\s*\{([^}]*)\}/gm;
  let m;
  while ((m = entryRe.exec(block[1])) !== null) {
    const langs = {};
    const re = /(es|en|fr|de|pt|ca):\s*"([^"]*)"/g;
    let lm;
    while ((lm = re.exec(m[2])) !== null) langs[lm[1]] = lm[2];
    out[m[1]] = langs;
  }
  return out;
}

async function loadLocaleStrings() {
  // Returns { lang: { key: value } } where `key` is a *flat* leaf
  // identifier (e.g. `whatsappDefault`, `whatsappNav`, …). Nested
  // i18n keys are not flattened — we only need the leaf for our
  // WhatsApp inventory expansion, and most callers in this codebase
  // pass the leaf key directly to `t(...)`.
  const out = {};
  const KEY = /\b([A-Za-z][A-Za-z0-9_]*)\s*:\s*"((?:[^"\\]|\\.)*)"/g;
  for (const lang of LOCALES) {
    const file = path.join(ROOT, `client/src/i18n/locales/${lang}.ts`);
    let src;
    try { src = await fs.readFile(file, "utf8"); } catch { out[lang] = {}; continue; }
    out[lang] = {};
    let m;
    KEY.lastIndex = 0;
    while ((m = KEY.exec(src)) !== null) {
      const key = m[1];
      const val = m[2].replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
      // Last write wins — fine for leaf-key lookups.
      out[lang][key] = val;
    }
  }
  return out;
}

const WHATSAPP_NUMBER = "34614916910";

function expandRows(defs, routeSlugs, locales) {
  const out = [];
  for (const r of defs) {
    for (const lang of LOCALES) {
      const row = {
        file: r.file,
        line: r.line,
        type: r.type,
        idioma: lang,
        testid: r.testid,
        tracking: r.tracking,
        labelKey: r.label,
        labelText: locales[lang][r.label] || r.label,
        destinationKey: r.destination,
        destinationUrl: "—",
      };
      if (r.type === "link") {
        const slugs = routeSlugs[r.destination];
        if (slugs && slugs[lang] !== undefined) {
          row.destinationUrl = slugs[lang] ? `/${lang}/${slugs[lang]}` : `/${lang}`;
        } else if (r.destination?.startsWith("/")) {
          // literal absolute path (e.g. "/blog") rendered as `/lang${path}`.
          row.destinationUrl = `/${lang}${r.destination}`;
        } else {
          row.destinationUrl = `(unresolved: ${r.destination})`;
        }
      } else if (r.type === "whatsapp") {
        const m = r.destination.match(/wa\.me\?text=\{t\("([^"]+)"\)\}/);
        const key = m?.[1];
        const text = key ? (locales[lang][key] || "") : "";
        row.destinationUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      } else if (r.type === "whatsapp_hardcoded") {
        row.destinationUrl = "https://wa.me/<hardcoded>";
      } else if (r.type === "mailto") {
        row.destinationUrl = "mailto:";
      } else if (r.type === "hardcoded_internal") {
        row.destinationUrl = r.destination;
      }
      out.push(row);
    }
  }
  return out;
}

function toLocaleCsv(rows) {
  const cols = ["file", "line", "type", "idioma", "testid", "tracking", "labelKey", "labelText", "destinationKey", "destinationUrl"];
  const esc = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

async function main() {
  const files = [];
  for (const dir of SRC_DIRS) await walk(path.join(ROOT, dir), files);
  const rows = [];
  for (const f of files) rows.push(...await inventoryFile(f));
  await fs.mkdir(OUT_DIR, { recursive: true });
  rows.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
  await fs.writeFile(path.join(OUT_DIR, "cta-inventory.json"), JSON.stringify(rows, null, 2));
  await fs.writeFile(path.join(OUT_DIR, "cta-inventory.csv"), toCsv(rows));
  await fs.writeFile(path.join(OUT_DIR, "cta-inventory.md"), toMd(rows));

  // Per-locale expansion (one row per [code-site × language]).
  const routeSlugs = await loadRouteSlugs();
  const locales = await loadLocaleStrings();
  const expanded = expandRows(rows, routeSlugs, locales);
  await fs.writeFile(path.join(OUT_DIR, "cta-inventory-by-locale.json"), JSON.stringify(expanded, null, 2));
  await fs.writeFile(path.join(OUT_DIR, "cta-inventory-by-locale.csv"), toLocaleCsv(expanded));

  const counts = rows.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {});
  console.log(`[cta-inventory] scanned ${files.length} files, captured ${rows.length} CTAs`);
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k}: ${v}`);
  if (counts.hardcoded_internal) console.log(`  ⚠ ${counts.hardcoded_internal} hardcoded /{lang}/... links — review`);
  console.log(`[cta-inventory] expanded to ${expanded.length} per-locale rows (${LOCALES.length} languages)`);
  console.log(`[cta-inventory] wrote reports/cta-inventory{,-by-locale}.{json,csv,md}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
