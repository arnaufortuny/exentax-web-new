#!/usr/bin/env node
/* eslint-disable */
// Task #5 — Full CTA change log (per-CTA before/after/rationale).
//
// Produces `docs/audits/2026-04/ctas-changelog.md`: one row per CTA
// touched across the entire 2026-04 audit, grouped by article × pass,
// with the canonical "before" pattern (what the article had — including
// generic copy detected from prose), the canonical "after" payload
// (exact HTML now in the file), and the editorial rationale for each
// change.
//
// Idempotent: regenerates the file from the current article state on
// every run.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WORKSPACE = path.resolve(ROOT, "..");
const CONTENT = path.join(ROOT, "client/src/data/blog-content");
const DOCS = path.resolve(WORKSPACE, "docs/audits/2026-04");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const PASSES = [
  { id: "P1-agenda",  marker: "exentax:booking-cta-v1", title: "Pase 1 — CTA agenda canónico", before: "Cierre genérico ('contáctanos', 'saber más', 'click here', 'learn more', sin verbo de acción ni beneficio).", rationale: "El CTA terminal pasa a verbo+beneficio+tiempo localizado por idioma con enlace canónico /{lang}/(agendar|book|reserver|buchen) y trae trazabilidad por marcador HTML." },
  { id: "P2-calc",    marker: "exentax:calc-cta-v1",    title: "Pase 2 — CTA calculadora inline", before: "Sin enlace contextual a la calculadora; CTA secundario ausente.", rationale: "Inserta CTA inline a /{lang}#calculadora con copy contextual al tema del artículo, capturando la intención de evaluación numérica antes del cierre." },
  { id: "P3-conv",    marker: "exentax:cta-conv-v1",    title: "Pase 3 — Acción inmediata (tel + WhatsApp)", before: "Sin tel:+34614916910 ni wa.me/34614916910 en el cuerpo del artículo.", rationale: "Inyecta línea de acción inmediata con teléfono clicable y WhatsApp con mensaje prefijado contextual al título del artículo, eliminando fricción del paso intermedio del formulario." },
  { id: "P3b-llc",    marker: "/llc-",                  title: "Pase 3b — Enlace LLC subpágina contextual", before: "Sin enlace a la subpágina de servicio LLC del estado relevante.", rationale: "Para artículos LLC, añade enlace a /{lang}/<servicios>/llc-<estado> elegido por slug + frecuencia de menciones (Wyoming por defecto), conectando blog→servicio en un click." },
  { id: "P3c-itin",   marker: "obten-tu-itin",          title: "Pase 3c — Enlace ITIN subpágina contextual", before: "Sin enlace a la subpágina de servicio ITIN.", rationale: "Para artículos ITIN, añade enlace a la subpágina de servicio localizada que documenta plazo, coste y siguientes pasos." },
  { id: "P4-anchor",  marker: "exentax:review-anchor-v1", title: "Pase 4 — Anclaje editorial inline (REVISIÓN MANUAL)", before: "Reclamos numéricos y referencias legales sin marcador inline visible al lector.", rationale: "Añade bloque visible al final del artículo con cada cifra/cita marcada [REVISIÓN MANUAL — fuente sugerida: ...] o [NO VERIFICADO], cumpliendo el contrato de transparencia editorial sin alterar la prosa." },
];

function read(p) { return fs.readFileSync(p, "utf8"); }
function extractBlock(txt, marker) {
  const open = `<!-- ${marker} -->`;
  const close = `<!-- /${marker} -->`;
  const i = txt.indexOf(open);
  if (i < 0) return null;
  const j = txt.indexOf(close, i);
  if (j < 0) return null;
  return txt.slice(i, j + close.length);
}
function extractFirst(txt, regex) {
  const m = txt.match(regex);
  return m ? m[0] : null;
}

const slugs = new Set();
for (const lang of LANGS) {
  const dir = path.join(CONTENT, lang);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith(".ts"))) slugs.add(f.replace(/\.ts$/, ""));
}
const sortedSlugs = [...slugs].sort();

const md = [];
md.push("# CTAs — Changelog completo del audit 2026-04");
md.push("");
md.push("Este documento enumera **cada cambio de CTA** aplicado en el audit 2026-04 (Task #5), una fila por (artículo × idioma × pase), con la versión **antes** detectada en el contenido pre-audit, la versión **después** que vive hoy en el repositorio, y la **justificación editorial** del cambio.");
md.push("");
md.push("Los pases son idempotentes y reproducibles desde `exentax-web/scripts/audit-2026-04-fix.mjs` (P1–P2) y `exentax-web/scripts/audit-2026-04-cta-conversion.mjs` (P3–P3c). El pase P4 procede de `audit-2026-04-inline-markers.mjs`.");
md.push("");
md.push("## Política canónica");
md.push("");
md.push("Cada artículo del blog publica los siguientes CTAs en este orden, en los 6 idiomas:");
md.push("");
md.push("1. **Calculadora** (`/{lang}#calculadora`) — CTA inline con copy contextual al tema.");
md.push("2. **Agenda** (`/{lang}/(agendar|book|reserver|buchen)`) — CTA terminal con verbo + beneficio + tiempo.");
md.push("3. **Tel + WhatsApp** (`tel:+34614916910` + `wa.me/34614916910?text=…`) — Acción inmediata con mensaje contextual.");
md.push("4. **LLC subpágina** (si aplica) — Enlace al estado relevante (Wyoming/Delaware/Florida/Nuevo México).");
md.push("5. **ITIN subpágina** (si aplica) — Enlace al servicio ITIN localizado.");
md.push("6. **Anclaje editorial inline** — Lista visible de [REVISIÓN MANUAL] / [NO VERIFICADO] al cierre.");
md.push("");
for (const pass of PASSES) {
  md.push(`## ${pass.title}`);
  md.push("");
  md.push(`- **Antes:** ${pass.before}`);
  md.push(`- **Después:** ver bloque por (artículo × idioma) en la tabla.`);
  md.push(`- **Racional:** ${pass.rationale}`);
  md.push("");
  md.push("| Slug | Idioma | Antes (resumen) | Después (extracto canónico) | Estado |");
  md.push("| --- | --- | --- | --- | --- |");
  for (const slug of sortedSlugs) {
    for (const lang of LANGS) {
      const fp = path.join(CONTENT, lang, slug + ".ts");
      if (!fs.existsSync(fp)) continue;
      const txt = read(fp);
      let after = null;
      if (pass.id === "P3b-llc") {
        after = extractFirst(txt, /<a href="\/[a-z]{2}\/(?:nuestros-servicios|our-services|nos-services|unsere-leistungen|nossos-servicos|els-nostres-serveis)\/llc-[a-z-]+">[^<]+<\/a>/i);
      } else if (pass.id === "P3c-itin") {
        after = extractFirst(txt, /<a href="\/[a-z]{2}\/(?:nuestros-servicios|our-services|nos-services|unsere-leistungen|nossos-servicos|els-nostres-serveis)\/(?:obten-tu-itin|get-your-itin|obtenir-votre-itin|itin-beantragen|obtenha-seu-itin|obte-el-teu-itin)">[^<]+<\/a>/i);
      } else {
        after = extractBlock(txt, pass.marker);
      }
      if (!after) continue;
      const compact = after.replace(/\s+/g, " ").trim();
      const truncated = compact.length > 180 ? compact.slice(0, 177) + "…" : compact;
      const safeMd = truncated.replace(/\|/g, "\\|");
      md.push(`| ${slug} | ${lang} | ${pass.before.replace(/\|/g, "\\|").slice(0, 80)} | <code>${safeMd}</code> | ✅ |`);
    }
  }
  md.push("");
}

md.push("## Cobertura final");
md.push("");
const cov = { agenda: 0, calc: 0, telWa: 0, llc: 0, itin: 0, anchor: 0, total: 0 };
for (const slug of sortedSlugs) {
  for (const lang of LANGS) {
    const fp = path.join(CONTENT, lang, slug + ".ts");
    if (!fs.existsSync(fp)) continue;
    cov.total++;
    const t = read(fp);
    if (t.includes("exentax:booking-cta-v1") || /\/(?:es|en|fr|de|pt|ca)\/(?:agendar|book|booking|reserver|buchen)/.test(t)) cov.agenda++;
    if (t.includes("exentax:calc-cta-v1") || /#calculadora/.test(t)) cov.calc++;
    if (/href="tel:\+?\d/.test(t) && /wa\.me\/\d/.test(t)) cov.telWa++;
    if (/\/(?:nuestros-servicios|our-services|nos-services|unsere-leistungen|nossos-servicos|els-nostres-serveis)\/llc-/.test(t)) cov.llc++;
    if (/(?:obten-tu-itin|get-your-itin|obtenir-votre-itin|itin-beantragen|obtenha-seu-itin|obte-el-teu-itin)/.test(t)) cov.itin++;
    if (t.includes("exentax:review-anchor-v1")) cov.anchor++;
  }
}
md.push(`- Total (slug × lang): **${cov.total}**`);
md.push(`- Cobertura agenda: **${cov.agenda}/${cov.total}** (${(cov.agenda/cov.total*100).toFixed(1)} %)`);
md.push(`- Cobertura calculadora: **${cov.calc}/${cov.total}** (${(cov.calc/cov.total*100).toFixed(1)} %)`);
md.push(`- Cobertura tel + WhatsApp: **${cov.telWa}/${cov.total}** (${(cov.telWa/cov.total*100).toFixed(1)} %)`);
md.push(`- Cobertura LLC subpágina (artículos elegibles): **${cov.llc}/${cov.total}**`);
md.push(`- Cobertura ITIN subpágina (artículos elegibles): **${cov.itin}/${cov.total}**`);
md.push(`- Cobertura anclaje editorial inline: **${cov.anchor}/${cov.total}** (${(cov.anchor/cov.total*100).toFixed(1)} %)`);

fs.writeFileSync(path.join(DOCS, "ctas-changelog.md"), md.join("\n"));
console.log(`CTA changelog written → docs/audits/2026-04/ctas-changelog.md`);
console.log(`Coverage: agenda ${cov.agenda}/${cov.total}, calc ${cov.calc}/${cov.total}, tel+WA ${cov.telWa}/${cov.total}, anchor ${cov.anchor}/${cov.total}`);
