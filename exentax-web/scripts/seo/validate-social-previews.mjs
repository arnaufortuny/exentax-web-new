#!/usr/bin/env node
/**
 * Validates the social previews audit output.
 * Fails (exit 1) when any of these hold:
 *   - LOCALE_MAP for og:locale is wrong (especially pt → pt_PT).
 *   - A static page or subpage is missing its explicit ogTitle / ogDescription.
 *   - A blog post is missing its explicit ogTitle / ogDescription.
 *   - Any effective ogTitle exceeds 60 chars or ogDescription falls outside [120,160].
 *   - The required-OG static namespace set is not fully covered in all 6 langs.
 *
 * Distinctness vs meta is enforced for required static namespaces, all
 * service subpages, and every blog post: ogTitle must differ from
 * metaTitle and ogDescription must differ from metaDescription.
 *
 * Run after `npx tsx scripts/seo/audit-social-previews.ts`.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..", "..");
const AUDIT = join(REPO, "docs/audits/previews-audit.json");

if (!existsSync(AUDIT)) {
  console.error("previews-audit.json not found. Run scripts/seo/audit-social-previews.ts first.");
  process.exit(2);
}

const audit = JSON.parse(readFileSync(AUDIT, "utf8"));

// Verify the og:image asset is actually present at the public path the SEO
// component points at. Failing this should fail CI: a missing image breaks
// every social preview regardless of how good the copy is.
const OG_IMAGE_PUBLIC_PATH = "/og-image.png";
const PUBLIC_DIR = join(REPO, "client", "public");
const OG_IMAGE_FILE = join(PUBLIC_DIR, OG_IMAGE_PUBLIC_PATH.replace(/^\//, ""));
const OG_IMAGE_OK = existsSync(OG_IMAGE_FILE);

// Required intrinsic geometry for every shipped og:image. LinkedIn / X crop
// anything off-ratio in unpredictable ways, so we lock the shape at the
// validator level. The 5 KB floor catches truncated downloads or 1x1
// placeholder PNGs that would otherwise sneak through the existence check.
const OG_IMAGE_REQUIRED_WIDTH = 1200;
const OG_IMAGE_REQUIRED_HEIGHT = 630;
const OG_IMAGE_MIN_BYTES = 5 * 1024;

// Tiny PNG / JPEG header parser. We deliberately avoid pulling in an image
// library: the validator runs in CI on every push, so it must stay a plain
// Node script with zero install cost.
function readImageInfo(file) {
  let buf;
  try {
    buf = readFileSync(file);
  } catch (err) {
    return { error: `cannot read file (${err.code || err.message})` };
  }
  const size = buf.length;
  // PNG: 8-byte signature, then IHDR chunk at offset 8 (4 bytes length, 4
  // bytes type "IHDR", 4 bytes width BE, 4 bytes height BE).
  if (
    size >= 24 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a &&
    buf.toString("ascii", 12, 16) === "IHDR"
  ) {
    return { format: "png", width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), size };
  }
  // JPEG: SOI (FF D8), then a stream of markers. Walk until we hit any SOF
  // marker (FFC0–FFC3, FFC5–FFC7, FFC9–FFCB, FFCD–FFCF) and read the frame
  // header (precision byte, height BE, width BE).
  if (size >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < size) {
      if (buf[i] !== 0xff) return { format: "jpg", error: "malformed JPEG (expected marker)", size };
      while (i < size && buf[i] === 0xff) i++;
      if (i >= size) break;
      const marker = buf[i++];
      // Standalone markers carry no payload.
      if (marker === 0xd8 || marker === 0xd9 || marker === 0x01) continue;
      if (marker >= 0xd0 && marker <= 0xd7) continue;
      if (i + 2 > size) break;
      const segLen = buf.readUInt16BE(i);
      const isSOF =
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf);
      if (isSOF) {
        if (i + 7 > size) return { format: "jpg", error: "truncated SOF segment", size };
        return { format: "jpg", height: buf.readUInt16BE(i + 3), width: buf.readUInt16BE(i + 5), size };
      }
      i += segLen;
    }
    return { format: "jpg", error: "no SOF marker found", size };
  }
  return { error: "unrecognised image format (expected PNG or JPEG header)", size };
}

function checkOgImageAsset(label, publicPath) {
  if (/^https?:\/\//i.test(publicPath)) return; // remote: not our asset
  const localFile = join(PUBLIC_DIR, publicPath.replace(/^\//, "").split("?")[0]);
  if (!existsSync(localFile)) return; // already reported by missing-og-image-asset
  const info = readImageInfo(localFile);
  if (info.error) {
    errors.push(`${label} og:image ${publicPath}: ${info.error}`);
    return;
  }
  if (info.size < OG_IMAGE_MIN_BYTES) {
    errors.push(
      `${label} og:image ${publicPath}: file size ${info.size} B < ${OG_IMAGE_MIN_BYTES} B (likely truncated or placeholder)`,
    );
  }
  if (info.width !== OG_IMAGE_REQUIRED_WIDTH || info.height !== OG_IMAGE_REQUIRED_HEIGHT) {
    errors.push(
      `${label} og:image ${publicPath}: ${info.width}x${info.height} != required ${OG_IMAGE_REQUIRED_WIDTH}x${OG_IMAGE_REQUIRED_HEIGHT} (LinkedIn / X will crop unpredictably)`,
    );
  }
}
const REQUIRED_LOCALES = { es: "es_ES", en: "en_US", fr: "fr_FR", de: "de_DE", pt: "pt_PT", ca: "ca_ES" };
const LANGS = Object.keys(REQUIRED_LOCALES);

const TITLE_MIN = audit.rules.ogTitleMin ?? 20;
const TITLE_MAX = audit.rules.ogTitleMax ?? 60;
const DESC_MIN = audit.rules.ogDescriptionMin ?? 120;
const DESC_MAX = audit.rules.ogDescriptionMax ?? 160;

// Per-language trailing stop-words (articles / prepositions / conjunctions)
// that must never be the last token of an ogTitle. Mirrors the generator.
const TRAIL_STOPWORDS = {
  es: new Set(["a","ante","bajo","con","de","del","desde","el","la","las","lo","los","en","entre","hacia","hasta","para","por","según","sin","sobre","tras","y","e","o","u","ni","que","una","un","unos","unas","mi","tu","su","al","como","si","es","ser"]),
  en: new Set(["a","an","the","of","for","to","in","on","at","by","with","from","and","or","but","as","is","be","into","onto","via","over","under","than","then"]),
  fr: new Set(["le","la","les","un","une","des","de","du","au","aux","à","en","dans","sur","sous","par","pour","avec","sans","et","ou","mais","que","qui","ce","cet","cette","ces","est"]),
  de: new Set(["der","die","das","ein","eine","einen","einem","einer","den","dem","des","von","zu","zum","zur","im","in","an","am","auf","aus","bei","mit","nach","über","unter","und","oder","aber","für","ist","sind"]),
  pt: new Set(["a","o","as","os","um","uma","uns","umas","de","do","da","dos","das","em","no","na","nos","nas","para","por","com","sem","e","ou","mas","que","se","é"]),
  ca: new Set(["el","la","els","les","un","una","uns","unes","de","del","dels","des","a","al","als","en","amb","sense","per","i","o","però","que","si","és","ser","ha","han","fins","cap","com","des","sota","sobre"]),
};
function endsWithStopword(text, lang) {
  const m = (text || "").trim().match(/([\p{L}\p{N}']+)\s*$/u);
  if (!m) return false;
  return (TRAIL_STOPWORDS[lang] || new Set()).has(m[1].toLowerCase());
}

const errors = [];
const warnings = [];

if (!OG_IMAGE_OK) {
  errors.push(`og:image asset missing at ${OG_IMAGE_FILE} (public path ${OG_IMAGE_PUBLIC_PATH})`);
}

// Per-entry og:image checks: when a static page, subpage or blog post opts
// into a per-article image override, the audit script flags any unshipped
// asset with `missing-og-image-asset(<path>)`. Mirror that signal into the
// validator so CI fails when an override points at a missing file.
const seenMissingOgImage = new Set();
for (const e of audit.entries) {
  for (const issue of e.issues || []) {
    if (issue.startsWith("missing-og-image")) {
      const key = `${e.scope}:${e.ns}:${e.page}:${e.lang}:${issue}`;
      if (seenMissingOgImage.has(key)) continue;
      seenMissingOgImage.add(key);
      errors.push(`${e.scope} ${e.ns}/${e.page}/${e.lang}: ${issue}`);
    }
  }
}

// Intrinsic dimension + size check for every shipped og:image asset. The
// default brand card is always validated; per-page overrides (entries with
// `ogImageOverride === true` in the audit) are deduped by public path so
// each unique file is only inspected once.
const ogImageAssetsChecked = new Set();
function trackOgImage(label, publicPath) {
  if (!publicPath) return;
  if (ogImageAssetsChecked.has(publicPath)) return;
  ogImageAssetsChecked.add(publicPath);
  checkOgImageAsset(label, publicPath);
}
trackOgImage("default", OG_IMAGE_PUBLIC_PATH);
for (const e of audit.entries) {
  if (!e.ogImageOverride) continue;
  trackOgImage(`${e.scope} ${e.ns}/${e.page}/${e.lang}`, e.ogImage);
}

// 1. og:locale mapping ---------------------------------------------------
for (const [lang, expected] of Object.entries(REQUIRED_LOCALES)) {
  if (audit.rules.localeMap[lang] !== expected) {
    errors.push(`Wrong og:locale mapping for ${lang}: expected ${expected}, got ${audit.rules.localeMap[lang]}`);
  }
}

// 2. Required static pages must have explicit OG copy in every language ---
const STATIC_REQUIRED_OG = new Set([
  "homePage", "serviciosPage", "comoFuncionaPage", "reservarPage", "llcUsPage", "faqPage",
  "terminos", "privacidad", "cookies", "reembolsos", "disclaimer",
  "links", "start", "blogPost",
]);

const seenStatic = new Map(); // ns -> Set<lang>
for (const e of audit.entries) {
  if (e.scope !== "static") continue;
  if (!STATIC_REQUIRED_OG.has(e.ns)) continue;
  if (!seenStatic.has(e.ns)) seenStatic.set(e.ns, new Set());
  if (e.ogTitle && e.ogDescription) seenStatic.get(e.ns).add(e.lang);
}
for (const ns of STATIC_REQUIRED_OG) {
  if (!seenStatic.has(ns)) {
    errors.push(`Required static namespace "${ns}" missing in audit (not detected for any language)`);
    continue;
  }
  for (const lang of LANGS) {
    if (!seenStatic.get(ns).has(lang)) {
      errors.push(`Required static namespace "${ns}" missing explicit ogTitle+ogDescription for lang=${lang}`);
    }
  }
}

// 3. Per-entry length + distinctness checks -------------------------------
function checkLengths(scopeLabel, e) {
  const t = e.effectiveOgTitle || "";
  const d = e.effectiveOgDescription || "";
  if (t.length === 0) errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang} has empty ogTitle`);
  if (d.length === 0) errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang} has empty ogDescription`);
  if (t.length > TITLE_MAX) errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang} ogTitle ${t.length} > ${TITLE_MAX}`);
  if (t.length > 0 && t.length < TITLE_MIN) errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang} ogTitle ${t.length} < ${TITLE_MIN}`);
  if (d.length > DESC_MAX) errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang} ogDescription ${d.length} > ${DESC_MAX}`);
  if (d.length > 0 && d.length < DESC_MIN) errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang} ogDescription ${d.length} < ${DESC_MIN}`);
  // Distinctness vs meta is required for every covered entry.
  if (e.ogTitle && e.metaTitle && e.ogTitle.trim() === e.metaTitle.trim()) {
    errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang}: ogTitle identical to metaTitle`);
  }
  if (e.ogDescription && e.metaDescription && e.ogDescription.trim() === e.metaDescription.trim()) {
    errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang}: ogDescription identical to metaDescription`);
  }
  if (t && endsWithStopword(t, e.lang)) {
    errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang}: ogTitle ends on a stop-word ("${t.slice(-20)}")`);
  }
  if (d && endsWithStopword(d, e.lang)) {
    errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang}: ogDescription ends on a stop-word ("${d.slice(-20)}")`);
  }
  // Quality: forbid trailing ellipsis and dangling open parentheses on
  // ogTitle / ogDescription. Social copy must read as finished sentences.
  if (t && /[\u2026]\s*$|\.{2,}\s*$/.test(t)) {
    errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang}: ogTitle ends with an ellipsis ("${t.slice(-20)}")`);
  }
  if (d && /[\u2026]\s*$|\.{2,}\s*$/.test(d)) {
    errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang}: ogDescription ends with an ellipsis ("${d.slice(-20)}")`);
  }
  if (t && /\(\s*$/.test(t)) {
    errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang}: ogTitle ends with an unclosed parenthesis ("${t.slice(-20)}")`);
  }
  if (d && /\(\s*$/.test(d)) {
    errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang}: ogDescription ends with an unclosed parenthesis ("${d.slice(-20)}")`);
  }
  // ogDescription must end on a sentence-ending punctuation mark.
  if (d && !/[.!?\)\u201D"]\s*$/.test(d)) {
    errors.push(`${scopeLabel} ${e.ns}/${e.page}/${e.lang}: ogDescription does not end with sentence punctuation ("${d.slice(-20)}")`);
  }
}

let blogTotal = 0;
let blogMissingOg = 0;
for (const e of audit.entries) {
  if (e.scope === "static") {
    if (!STATIC_REQUIRED_OG.has(e.ns)) continue; // skip non-required UI namespaces
    checkLengths("Static", e);
  } else if (e.scope === "subpage") {
    if (!e.ogTitle) errors.push(`Subpage ${e.page}/${e.lang} missing explicit ogTitle`);
    if (!e.ogDescription) errors.push(`Subpage ${e.page}/${e.lang} missing explicit ogDescription`);
    checkLengths("Subpage", e);
  } else if (e.scope === "blog") {
    blogTotal++;
    if (!e.ogTitle || !e.ogDescription) {
      blogMissingOg++;
      errors.push(`Blog ${e.page}/${e.lang} missing explicit ogTitle/ogDescription`);
    }
    checkLengths("Blog", e);
  }
}

// 4. Blog coverage: every language must have full coverage ----------------
const blogPerLang = {};
for (const e of audit.entries) {
  if (e.scope !== "blog") continue;
  blogPerLang[e.lang] = (blogPerLang[e.lang] || 0) + 1;
}
const expectedBlog = blogPerLang.es || 0;
for (const lang of LANGS) {
  if ((blogPerLang[lang] || 0) !== expectedBlog) {
    errors.push(`Blog inventory mismatch for ${lang}: ${blogPerLang[lang] || 0} vs es=${expectedBlog}`);
  }
}

// 5. Summary --------------------------------------------------------------
console.log(`Audit covers ${audit.entries.length} entries (${blogTotal} blog records, ${blogMissingOg} blog without explicit OG).`);
console.log(`Static + subpage + blog OG checks: ${errors.length === 0 ? "PASS" : "FAIL"}`);
console.log(`Errors: ${errors.length}, Warnings: ${warnings.length}`);
if (errors.length) {
  for (const e of errors.slice(0, 50)) console.error("ERR:", e);
  if (errors.length > 50) console.error(`...and ${errors.length - 50} more`);
  process.exit(1);
}
if (warnings.length) {
  for (const w of warnings.slice(0, 15)) console.warn("WARN:", w);
  if (warnings.length > 15) console.warn(`...and ${warnings.length - 15} more`);
}
process.exit(0);
