#!/usr/bin/env node
/**
 * cta-whatsapp-audit — Inventory + sanity check of every WhatsApp
 * pre-filled message in the 6 supported languages (Task #19, step 2).
 *
 * Two complementary surfaces are scanned:
 *
 *   1. i18n locale files (`client/src/i18n/locales/{lang}.ts`).
 *      Captures every shallow key whose name *or* string value
 *      indicates a WhatsApp pre-fill (`whatsappDefault`,
 *      `whatsappNav`, `whatsappFooter`, `whatsappMsg`, `waText`,
 *      `waDefaultMsg`, `whatsappConfirmMsg`, `whatsappMessage`,
 *      `ctaWhatsappMsg`). The script tolerates trailing comments
 *      and uses a string-literal scanner (no `eval`).
 *
 *   2. Blog CTA library (`client/src/data/blog-cta-library.ts`).
 *      Captures `whatsappMsg` for each pattern × language so the
 *      audit covers contextual messages (ITIN, Florida, …).
 *
 * For each captured message we run these cheap checks:
 *
 *   • presence            — the same key must exist in every locale
 *   • encoding            — `encodeURIComponent` must round-trip
 *                            (no broken emojis, no stray %-sequences)
 *   • greeting punctuation — Spanish "Hola Acabo…" / "Hola Facturo…"
 *                            without comma is a recurring typo
 *   • length              — surfaces messages over 280 chars (WhatsApp
 *                            preview truncates around there)
 *   • greeting language   — Spanish "Hola" inside a `fr`/`de`/`en`
 *                            value is almost always a copy-paste leak
 *
 * Outputs:
 *
 *   reports/whatsapp-inventory.json   — `{ key: { lang: { value, len } } }`
 *   reports/whatsapp-inventory.csv    — flat per-key × per-lang table
 *   reports/whatsapp-audit.md         — issues grouped by severity
 *
 * Exit code: 0 if all wa.me numbers match the canonical
 * `CONTACT.WHATSAPP_NUMBER`; 1 if any divergent number is
 * found (a divergent number silently routes users to the wrong
 * phone, so this must fail the audit). Locale microcopy issues
 * (typos, length, etc.) are reported but do *not* fail the run.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOCALES = ["es", "en", "fr", "de", "pt", "ca"];
const KEY_PATTERN = /\b(whatsappDefault|whatsappNav|whatsappFooter|whatsappMsg|whatsappMsg1|whatsappMsg2|waText|waTextRenewal|waDefaultMsg|whatsappConfirmMsg|whatsappMessage|ctaWhatsappMsg)\s*:\s*(?:"([^"\\]*(?:\\.[^"\\]*)*)"|`([^`\\]*(?:\\.[^`\\]*)*)`)/g;
const OUT_DIR = path.join(ROOT, "reports");

async function loadCanonicalWhatsappNumber() {
  // Source-of-truth read: the canonical wa.me number lives in
  // `client/src/lib/constants.ts` (`CONTACT.WHATSAPP_NUMBER`). Every
  // wa.me URL anywhere in the codebase must match it; otherwise some
  // surfaces will silently route users to a different phone.
  const file = path.join(ROOT, "client/src/lib/constants.ts");
  const src = await fs.readFile(file, "utf8");
  const m = src.match(/WHATSAPP_NUMBER:\s*"(\d+)"/);
  if (!m) throw new Error("Could not find CONTACT.WHATSAPP_NUMBER in constants.ts");
  return m[1];
}

async function walkAllSources() {
  const exts = new Set([".ts", ".tsx", ".md"]);
  const skipDir = new Set(["node_modules", ".git", "dist", "build", ".cache", "reports"]);
  const out = [];
  async function rec(dir) {
    let entries;
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (skipDir.has(e.name)) continue;
        await rec(full);
      } else if (exts.has(path.extname(e.name))) {
        out.push(full);
      }
    }
  }
  await rec(path.join(ROOT, "client/src"));
  await rec(path.join(ROOT, "shared"));
  return out;
}

async function scanWhatsappNumbers() {
  // Scans the codebase for literal `wa.me/<digits>` references. Every
  // hit must use the same number as `CONTACT.WHATSAPP_NUMBER`.
  const files = await walkAllSources();
  const re = /wa\.me\/(\d{6,})/g;
  const hits = [];
  for (const file of files) {
    let src;
    try { src = await fs.readFile(file, "utf8"); } catch { continue; }
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(src)) !== null) {
      const before = src.slice(0, m.index);
      const line = before.split("\n").length;
      hits.push({ file: path.relative(ROOT, file), line, number: m[1] });
    }
  }
  return hits;
}

async function loadLocale(lang) {
  const file = path.join(ROOT, `client/src/i18n/locales/${lang}.ts`);
  const src = await fs.readFile(file, "utf8");
  const items = [];
  let m;
  KEY_PATTERN.lastIndex = 0;
  while ((m = KEY_PATTERN.exec(src)) !== null) {
    const key = m[1];
    const raw = m[2] ?? m[3] ?? "";
    const value = raw.replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
    let line = 1;
    for (let i = 0; i < m.index; i++) if (src.charCodeAt(i) === 10) line++;
    items.push({ key, value, line });
  }
  return items;
}

async function loadBlogLibrary() {
  const file = path.join(ROOT, "client/src/data/blog-cta-library.ts");
  const src = await fs.readFile(file, "utf8");
  // Find blocks like:
  //   <patternId>: { es: { ... whatsappMsg: "...", }, en: { ... } ... }
  const out = {};
  const patternRe = /^\s {2}(\w+):\s*\{$/gm;
  const langRe = /^\s {4}(es|en|fr|de|pt|ca):\s*\{$/gm;
  // Simplest approach: split on top-level pattern keys, capture nested whatsappMsg per language.
  const lines = src.split("\n");
  let currentPattern = null;
  let currentLang = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const pm = line.match(/^ {2}(\w+):\s*\{$/);
    if (pm) { currentPattern = pm[1]; currentLang = null; continue; }
    const lm = line.match(/^ {4}(es|en|fr|de|pt|ca):\s*\{$/);
    if (lm) { currentLang = lm[1]; continue; }
    if (currentPattern && currentLang) {
      const wm = line.match(/^\s{6}whatsappMsg:\s*"((?:[^"\\]|\\.)*)"/);
      if (wm) {
        out[currentPattern] ??= {};
        out[currentPattern][currentLang] = { value: wm[1].replace(/\\"/g, '"'), line: i + 1 };
      }
    }
    if (/^ {4}\}/.test(line)) currentLang = null;
    if (/^ {2}\}/.test(line)) currentPattern = null;
  }
  return out;
}

function classifyNumberConsistency({ canonical, hits }) {
  const issues = [];
  const off = hits.filter((h) => h.number !== canonical);
  for (const h of off) {
    issues.push({
      severity: "high",
      scope: `wa.me-number:${h.file}:${h.line}`,
      msg: `wa.me/${h.number} differs from canonical CONTACT.WHATSAPP_NUMBER (${canonical})`,
    });
  }
  return { issues, totalHits: hits.length, mismatchHits: off.length };
}

function classifyIssues({ localeData, blogData }) {
  const issues = [];

  // 1. presence — every i18n WhatsApp key found in any locale must
  //    exist in all six.
  const keysByLang = new Map();
  for (const lang of LOCALES) keysByLang.set(lang, new Set(localeData[lang].map((it) => it.key)));
  const allKeys = new Set([...keysByLang.values()].flatMap((s) => [...s]));
  for (const key of allKeys) {
    const missing = LOCALES.filter((l) => !keysByLang.get(l).has(key));
    if (missing.length) issues.push({ severity: "warn", scope: `i18n:${key}`, msg: `missing in: ${missing.join(", ")}` });
  }

  // 2. encoding — encodeURIComponent must round-trip.
  for (const lang of LOCALES) {
    for (const it of localeData[lang]) {
      try {
        const enc = encodeURIComponent(it.value);
        const dec = decodeURIComponent(enc);
        if (dec !== it.value) issues.push({ severity: "high", scope: `i18n:${lang}:${it.key}`, msg: `URL round-trip mismatch` });
      } catch (e) {
        issues.push({ severity: "high", scope: `i18n:${lang}:${it.key}`, msg: `encodeURIComponent failed: ${e.message}` });
      }
    }
  }

  // 3. greeting punctuation (Spanish-only — observed pattern). The
  //    bug is "Hola <Verb>" (Acabo, Facturo, He, Quiero, Necesito, …)
  //    where the missing comma makes the verb look like a proper
  //    noun. Greetings followed by a real noun ("Hola Exentax,"
  //    "Hola equipo,") are correct and must not be flagged.
  const SPANISH_VERB_AFTER_HOLA = /^Hola (Acabo|Facturo|He|Quiero|Necesito|Estoy|Soy|Vengo|Tengo|Busco|Llevo|Vivo|Trabajo|Pago|Cobro|Gano|Vendo|Quería|Quisiera|Me interesa|Me gustaría|Deseo)\b/;
  for (const it of localeData.es) {
    if (SPANISH_VERB_AFTER_HOLA.test(it.value)) {
      issues.push({ severity: "high", scope: `i18n:es:${it.key}`, msg: `missing comma after "Hola" — verb reads as proper noun` });
    }
  }

  // 4. length sanity (>280 chars surfaces an editorial review note).
  for (const lang of LOCALES) {
    for (const it of localeData[lang]) {
      if (it.value.length > 280) issues.push({ severity: "info", scope: `i18n:${lang}:${it.key}`, msg: `long message (${it.value.length} chars) — preview clipped` });
    }
  }

  // 5. greeting language leak — Spanish "Hola" inside non-es value.
  const greetings = { es: /^Hola[\s,!]/, en: /^Hi[\s,!]/, fr: /^(Bonjour|Salut)[\s,!]/, de: /^Hallo[\s,!]/, pt: /^(Olá|Ola)[\s,!]/, ca: /^Hola[\s,!]/ };
  for (const lang of LOCALES) {
    if (lang === "es" || lang === "ca") continue;
    for (const it of localeData[lang]) {
      if (/^Hola[\s,!]/.test(it.value) && !greetings[lang].test(it.value)) {
        issues.push({ severity: "high", scope: `i18n:${lang}:${it.key}`, msg: `Spanish "Hola" greeting in ${lang} value` });
      }
    }
  }

  // 6. blog CTA library coverage.
  for (const [pattern, byLang] of Object.entries(blogData)) {
    const missing = LOCALES.filter((l) => !byLang[l]);
    if (missing.length) issues.push({ severity: "warn", scope: `blog:${pattern}`, msg: `missing in: ${missing.join(", ")}` });
  }

  return issues;
}

function toCsv(localeData, blogData) {
  const rows = [["source", "key/pattern", ...LOCALES, "lengths"]];
  const allKeys = new Set();
  for (const lang of LOCALES) for (const it of localeData[lang]) allKeys.add(it.key);
  for (const key of [...allKeys].sort()) {
    const cells = [];
    const lens = [];
    for (const lang of LOCALES) {
      const found = localeData[lang].find((it) => it.key === key);
      cells.push(found ? found.value : "");
      lens.push(found ? String(found.value.length) : "0");
    }
    rows.push(["i18n", key, ...cells, lens.join("/")]);
  }
  for (const [pattern, byLang] of Object.entries(blogData)) {
    const cells = []; const lens = [];
    for (const lang of LOCALES) {
      cells.push(byLang[lang]?.value || "");
      lens.push(String(byLang[lang]?.value?.length || 0));
    }
    rows.push(["blog_cta", pattern, ...cells, lens.join("/")]);
  }
  const esc = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return rows.map((r) => r.map(esc).join(",")).join("\n");
}

function toMd(issues, localeData, blogData) {
  const counts = issues.reduce((acc, i) => { acc[i.severity] = (acc[i.severity] || 0) + 1; return acc; }, {});
  const totalI18n = LOCALES.reduce((s, l) => s + localeData[l].length, 0);
  const totalBlog = Object.keys(blogData).length * LOCALES.length;
  const lines = [
    "# WhatsApp pre-filled message audit",
    "",
    `_Scanned ${totalI18n} i18n entries and ${totalBlog} blog-CTA entries (${Object.keys(blogData).length} patterns × ${LOCALES.length} languages)._`,
    "",
    `**Issues:** high=${counts.high || 0} · warn=${counts.warn || 0} · info=${counts.info || 0}`,
    "",
  ];
  for (const sev of ["high", "warn", "info"]) {
    const list = issues.filter((i) => i.severity === sev);
    if (!list.length) continue;
    lines.push(`## ${sev.toUpperCase()} — ${list.length}`, "");
    for (const i of list) lines.push(`- \`${i.scope}\` — ${i.msg}`);
    lines.push("");
  }
  return lines.join("\n");
}

async function main() {
  const localeData = {};
  for (const lang of LOCALES) localeData[lang] = await loadLocale(lang);
  const blogData = await loadBlogLibrary();
  const canonicalNumber = await loadCanonicalWhatsappNumber();
  const numberHits = await scanWhatsappNumbers();
  const numberCheck = classifyNumberConsistency({ canonical: canonicalNumber, hits: numberHits });

  const inventory = {
    i18n: localeData,
    blog: blogData,
    whatsappNumber: {
      canonical: canonicalNumber,
      totalHits: numberCheck.totalHits,
      mismatchHits: numberCheck.mismatchHits,
      hits: numberHits,
    },
  };
  const issues = [...classifyIssues({ localeData, blogData }), ...numberCheck.issues];

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(path.join(OUT_DIR, "whatsapp-inventory.json"), JSON.stringify(inventory, null, 2));
  await fs.writeFile(path.join(OUT_DIR, "whatsapp-inventory.csv"), toCsv(localeData, blogData));
  await fs.writeFile(
    path.join(OUT_DIR, "whatsapp-audit.md"),
    toMd(issues, localeData, blogData) +
      `\n## wa.me number consistency\n\n` +
      `Canonical: \`${canonicalNumber}\` (CONTACT.WHATSAPP_NUMBER)\n\n` +
      `Hits: ${numberCheck.totalHits} · mismatching: ${numberCheck.mismatchHits}\n`,
  );

  const high = issues.filter((i) => i.severity === "high").length;
  const warn = issues.filter((i) => i.severity === "warn").length;
  console.log(`[whatsapp-audit] high=${high} warn=${warn} info=${issues.length - high - warn}`);
  console.log(`[whatsapp-audit] wa.me number consistency: ${numberCheck.totalHits - numberCheck.mismatchHits}/${numberCheck.totalHits} match canonical ${canonicalNumber}`);
  console.log(`[whatsapp-audit] wrote reports/whatsapp-{inventory.json,inventory.csv,audit.md}`);

  // Number mismatch is a hard correctness bug — any non-canonical wa.me
  // URL silently routes some users to the wrong phone. Fail the run.
  if (numberCheck.mismatchHits > 0) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
