#!/usr/bin/env node
/* eslint-disable */
// Task #5 — Inline review markers in article bodies.
//
// Reads `docs/audits/2026-04/manual-review-markers.json` and, for every
// article that still has unverified numeric/legal claims, injects an
// idempotent in-content review block right before the booking CTA so
// readers (and the reviewer) see literal `[REVISIÓN MANUAL — fuente
// sugerida: ...]` and `[NO VERIFICADO]` markers in the published body.
//
// The block is wrapped in `<!-- exentax:review-anchor-v1 -->` …
// `<!-- /exentax:review-anchor-v1 -->`. Re-runs replace the block in
// place rather than duplicating it. Removing the block reverts the pass.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WORKSPACE = path.resolve(ROOT, "..");
const CONTENT = path.join(ROOT, "client/src/data/blog-content");
const DOCS = path.resolve(WORKSPACE, "docs/audits/2026-04");
const SIDECAR = path.join(DOCS, "manual-review-markers.json");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const ANCHOR_OPEN  = "<!-- exentax:review-anchor-v1 -->";
const ANCHOR_CLOSE = "<!-- /exentax:review-anchor-v1 -->";
const BOOKING_MARKER = "<!-- exentax:booking-cta-v1 -->";

const I18N = {
  es: { title: "Revisión editorial pendiente", intro: "Las siguientes referencias requieren verificación manual contra la fuente oficial vigente. Si encuentras una desviación, escríbenos y la corregimos en menos de 24 horas.", numericLabel: "cifra", legalLabel: "referencia legal", suggested: "fuente sugerida", noVerified: "NO VERIFICADO" },
  en: { title: "Editorial review pending", intro: "The following references require manual verification against the official current source. If you spot a discrepancy, write to us and we will correct it within 24 hours.", numericLabel: "figure", legalLabel: "legal reference", suggested: "suggested source", noVerified: "NOT VERIFIED" },
  fr: { title: "Révision éditoriale en attente", intro: "Les références suivantes nécessitent une vérification manuelle auprès de la source officielle en vigueur. Si vous identifiez un écart, écrivez à l'équipe et nous corrigeons sous 24 heures.", numericLabel: "chiffre", legalLabel: "référence légale", suggested: "source suggérée", noVerified: "NON VÉRIFIÉ" },
  de: { title: "Redaktionelle Überprüfung ausstehend", intro: "Die folgenden Verweise erfordern eine manuelle Prüfung anhand der offiziellen aktuellen Quelle. Wenn Sie eine Abweichung feststellen, schreiben Sie der Redaktion — wir korrigieren innerhalb von 24 Stunden.", numericLabel: "Kennzahl", legalLabel: "Rechtsverweis", suggested: "vorgeschlagene Quelle", noVerified: "NICHT VERIFIZIERT" },
  pt: { title: "Revisão editorial pendente", intro: "As referências seguintes requerem verificação manual contra a fonte oficial vigente. Se identificares uma divergência, escreve à equipa e corrigimos em menos de 24 horas.", numericLabel: "valor", legalLabel: "referência legal", suggested: "fonte sugerida", noVerified: "NÃO VERIFICADO" },
  ca: { title: "Revisió editorial pendent", intro: "Les referències següents requereixen verificació manual contra la font oficial vigent. Si detectes una desviació, escriu-nos i ho corregim en menys de 24 hores.", numericLabel: "xifra", legalLabel: "referència legal", suggested: "font suggerida", noVerified: "NO VERIFICAT" },
};

function escapeHtml(s) {
  // Also escapes characters that would break the surrounding JS template
  // literal (`export default \`…\``): backticks and `${` interpolation.
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/`/g, "&#96;")
    .replace(/\$\{/g, "&#36;{");
}
function isUrl(s) { return typeof s === "string" && /^https?:\/\//i.test(s); }

function buildBlock(lang, slug, claims) {
  const t = I18N[lang];
  const items = [];
  for (const c of claims) {
    const tag = c.kind === "numeric" ? t.numericLabel : t.legalLabel;
    const value = escapeHtml(c.value);
    const ctx = c.context ? `<span class="text-xs italic">— «…${escapeHtml(c.context.trim().slice(0, 90))}…»</span>` : "";
    let sourceFragment;
    if (!c.source || /revisi[oó]n editorial/i.test(c.source)) {
      sourceFragment = `<strong>[${t.noVerified}]</strong>`;
    } else if (isUrl(c.source)) {
      const host = c.source.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      sourceFragment = `<strong>[REVISIÓN MANUAL — ${t.suggested}: <a href="${escapeHtml(c.source)}" rel="nofollow noopener" target="_blank">${escapeHtml(host)}</a>]</strong>`;
    } else {
      sourceFragment = `<strong>[REVISIÓN MANUAL — ${t.suggested}: ${escapeHtml(c.source)}]</strong>`;
    }
    items.push(`<li><span class="font-mono">${value}</span> <span class="opacity-70">(${tag})</span> ${ctx} ${sourceFragment}</li>`);
  }
  return `${ANCHOR_OPEN}
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>${t.title}</strong> — ${t.intro}</p>
<ul class="list-disc pl-5 space-y-1">
${items.join("\n")}
</ul>
</aside>
${ANCHOR_CLOSE}`;
}

function injectBlock(txt, block) {
  if (txt.includes(ANCHOR_OPEN)) {
    return txt.replace(new RegExp(ANCHOR_OPEN + "[\\s\\S]*?" + ANCHOR_CLOSE.replace(/[/]/g, "\\/")), block);
  }
  if (txt.includes(BOOKING_MARKER)) {
    return txt.replace(BOOKING_MARKER, block + "\n\n" + BOOKING_MARKER);
  }
  // Append at end before closing template-literal backtick.
  return txt.replace(/`;\s*$/, "\n" + block + "\n`;\n");
}

function loadSidecar() {
  if (!fs.existsSync(SIDECAR)) throw new Error("manual-review-markers.json not found at " + SIDECAR);
  return JSON.parse(fs.readFileSync(SIDECAR, "utf8"));
}

const sidecar = loadSidecar();
const articles = sidecar.articles || {};
const slugs = Object.keys(articles).sort();

let totalArticlesTouched = 0;
let totalLangsTouched = 0;
let totalClaimsAnchored = 0;
const perArticleSummary = {};

for (const slug of slugs) {
  const entry = articles[slug] || {};
  const numeric = (entry.numericClaims || []).map(c => ({ kind: "numeric", value: c.claim, source: c.source, context: c.context }));
  const legal   = (entry.legalClaims   || []).map(c => ({ kind: "legal",   value: c.ref,   source: c.source, context: c.context }));
  const claims = [...numeric, ...legal];
  if (!claims.length) { perArticleSummary[slug] = { langsTouched: 0, claims: 0 }; continue; }
  let langsForArticle = 0;
  for (const lang of LANGS) {
    const fp = path.join(CONTENT, lang, slug + ".ts");
    if (!fs.existsSync(fp)) continue;
    const before = fs.readFileSync(fp, "utf8");
    const block = buildBlock(lang, slug, claims);
    const after = injectBlock(before, block);
    if (after !== before) {
      fs.writeFileSync(fp, after);
      langsForArticle++;
      totalLangsTouched++;
    }
  }
  if (langsForArticle) totalArticlesTouched++;
  totalClaimsAnchored += claims.length;
  perArticleSummary[slug] = { langsTouched: langsForArticle, claims: claims.length };
  // Update sidecar status so downstream tools know inline anchors exist.
  for (const c of (entry.numericClaims || [])) c.status = "vigente (anclada inline + sidecar; revisión humana solicitada)";
  for (const c of (entry.legalClaims   || [])) c.status = "vigente (anclada inline + sidecar; revisión humana solicitada)";
}

sidecar.inlineAnchors = {
  stamp: new Date().toISOString().slice(0, 10),
  articlesTouched: totalArticlesTouched,
  langInsertions: totalLangsTouched,
  claimsAnchoredPerArticle: perArticleSummary,
};
fs.writeFileSync(SIDECAR, JSON.stringify(sidecar, null, 2));

console.log(`Inline-markers pass complete:`);
console.log(`  Articles with claims processed: ${slugs.length}`);
console.log(`  Articles where at least one lang got an inline block: ${totalArticlesTouched}`);
console.log(`  Total per-language inline blocks injected (this run): ${totalLangsTouched}`);
console.log(`  Total claims anchored across all langs: ${totalClaimsAnchored * LANGS.length} (≈${totalClaimsAnchored} unique × 6 langs)`);
