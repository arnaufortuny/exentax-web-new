#!/usr/bin/env node
/**
 * Blog translation-quality audit (Task #52 follow-up tooling).
 *
 * Two checks across the 666 blog articles:
 *
 *   1. PT-BR leakage in `pt/` — flags Brazilian Portuguese tokens / patterns
 *      that should be rewritten in PT-PT register (formal "você" -> formal
 *      "o leitor" / 3rd-person, drop gerundivo-progressivo, etc.).
 *   2. Duplicate consecutive paragraphs in any language — same paragraph
 *      repeated back-to-back (a common LLM-translation artefact).
 *
 * Output: docs/auditoria-multiidioma/blog-translation-quality.{json,md}
 *
 * CLI:
 *   node scripts/blog-translation-quality-audit.mjs           # write report
 *   node scripts/blog-translation-quality-audit.mjs --check   # CI mode
 *
 * NOTE: This is REPORT-ONLY tooling. CI does NOT block on these findings
 * because they pre-exist Task #52 (introduced upstream in Task #35) and
 * fixing them is editorial work tracked as a follow-up. The script exits 0
 * even in --check mode; its purpose is to produce a stable evidence file
 * that a future editorial pass can drive against.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BLOG_ROOT = join(ROOT, "client/src/data/blog-content");
const OUT_DIR = join(ROOT, "docs/auditoria-multiidioma");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const CHECK_MODE = process.argv.includes("--check");

// PT-BR specific markers. Word-boundary regexes; case-insensitive.
// NOT exhaustive — this is a starter set for the editorial pass.
const PT_BR_PATTERNS = [
  { id: "pode-se-registrar",      re: /\bpode se registrar\b/i,     hint: "PT-PT prefere 'pode registar-se' (mesóclise/ênclise)" },
  { id: "mais-grande",            re: /\bmais grande\b/i,           hint: "PT-PT usa 'maior'" },
  { id: "nao-precisa-fazer",      re: /\bn[aã]o precisa fazer\b/i,  hint: "PT-BR; PT-PT 'não precisa de fazer'" },
  { id: "voce-informal",          re: /\bvoc[êe]\b/i,               hint: "PT-PT formal evita 'você'; usar 3.ª pessoa ou 'o leitor'" },
  { id: "estou-fazendo",          re: /\bestou fazendo\b/i,         hint: "Gerúndio brasileiro; PT-PT 'estou a fazer'" },
  { id: "estamos-fazendo",        re: /\bestamos fazendo\b/i,       hint: "Gerúndio brasileiro; PT-PT 'estamos a fazer'" },
  { id: "esta-fazendo",           re: /\best[áa] fazendo\b/i,       hint: "Gerúndio brasileiro; PT-PT 'está a fazer'" },
  { id: "registro-substantivo",   re: /\bo registro\b/i,            hint: "PT-BR 'registro'; PT-PT 'registo'" },
  { id: "registrar-verbo",        re: /\bregistrar(-se|\b)/i,       hint: "PT-BR; PT-PT 'registar(-se)'" },
  { id: "fato-substantivo",       re: /\bo fato (?:de|que|dos|das)\b/i, hint: "PT-BR 'fato'; PT-PT 'facto'" },
  { id: "ate-agora-bridge",       re: /\bcaso contr[áa]rio,?\s+at[ée]\b/i, hint: "calque pt-br (revisar)" },
  { id: "time-equipe",            re: /\bequipe\b/i,                hint: "PT-PT 'equipa', não 'equipe'" },
  { id: "celular",                re: /\bcelular\b/i,               hint: "PT-PT 'telemóvel', não 'celular'" },
  { id: "tela",                   re: /\b(?:na |a |uma )tela\b/i,   hint: "PT-PT 'ecrã', não 'tela' (excepto pintura)" },
  { id: "arquivo-it",             re: /\barquivo (?:do|no|de) (?:computador|sistema)\b/i, hint: "PT-PT 'ficheiro', não 'arquivo'" },
  { id: "trem",                   re: /\b(?:no |o )trem\b/i,        hint: "PT-PT 'comboio'" },
  { id: "onibus",                 re: /\bônibus\b/i,                hint: "PT-PT 'autocarro'" },
  { id: "endereco-direito",       re: /\bendere[çc]o de email\b/i,  hint: "PT-PT 'endereço de email' OK; só verificar registo" },
];

function stripMarkers(content) {
  // Blog content files are `export default \`...markdown...\`;`
  const m = content.match(/export\s+default\s+`([\s\S]*)`\s*;?\s*$/);
  return m ? m[1] : "";
}

function paragraphsOf(body) {
  // Split on >=1 blank line, ignore standalone marker lines.
  const blocks = body.split(/\n\s*\n/);
  const out = [];
  for (const raw of blocks) {
    const text = raw.trim();
    if (!text) continue;
    if (/^<!--\s*\/?exentax:[a-z0-9-]+\s*-->$/i.test(text)) continue;
    if (text.startsWith("#")) continue;          // headings
    if (/^[-*]\s/.test(text)) continue;          // list items (let's only check paragraphs)
    if (text.length < 40) continue;              // skip very short noise
    out.push(text);
  }
  return out;
}

function findPtBrIssues(text) {
  const issues = [];
  for (const p of PT_BR_PATTERNS) {
    const m = text.match(p.re);
    if (m) issues.push({ id: p.id, sample: m[0], hint: p.hint });
  }
  return issues;
}

function findDuplicateParagraphs(paras) {
  const dups = [];
  for (let i = 1; i < paras.length; i++) {
    if (paras[i] === paras[i - 1] && paras[i].length >= 60) {
      dups.push({ index: i, sample: paras[i].slice(0, 120) });
    }
  }
  return dups;
}

function audit() {
  const reports = { ptBr: [], duplicates: [] };
  for (const lang of LANGS) {
    const dir = join(BLOG_ROOT, lang);
    const files = readdirSync(dir).filter(f => f.endsWith(".ts"));
    for (const f of files) {
      const slug = f.replace(/\.ts$/, "");
      const content = readFileSync(join(dir, f), "utf8");
      const body = stripMarkers(content);
      if (!body) continue;
      const paras = paragraphsOf(body);

      const dups = findDuplicateParagraphs(paras);
      if (dups.length) reports.duplicates.push({ lang, slug, count: dups.length, dups });

      if (lang === "pt") {
        const issues = findPtBrIssues(body);
        if (issues.length) reports.ptBr.push({ lang, slug, count: issues.length, issues });
      }
    }
  }
  return reports;
}

function main() {
  const r = audit();

  if (CHECK_MODE) {
    // Report-only: never block CI (pre-existing editorial debt).
    const ptBrTotal = r.ptBr.reduce((n, x) => n + x.count, 0);
    const dupTotal = r.duplicates.reduce((n, x) => n + x.count, 0);
    console.log(`blog-translation-quality-audit --check: REPORT-ONLY (PT-BR hits: ${ptBrTotal} in ${r.ptBr.length} files; duplicate paragraphs: ${dupTotal} in ${r.duplicates.length} files)`);
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    join(OUT_DIR, "blog-translation-quality.json"),
    JSON.stringify(r, null, 2),
    "utf8"
  );

  const lines = [];
  lines.push("# Blog translation-quality audit (Task #52 follow-up)");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("> REPORT-ONLY. Findings here are pre-existing editorial debt");
  lines.push("> (introduced upstream by Task #35 inline-CTA refresh) and are");
  lines.push("> NOT blockers for Task #52, which is bounded to CTA marker");
  lines.push("> repositioning + structural CI guard. Use this report as the");
  lines.push("> input for a future native-PT editorial pass.");
  lines.push("");

  lines.push(`## PT-BR leakage in pt/* (${r.ptBr.length} files, ${r.ptBr.reduce((n,x)=>n+x.count,0)} hits)`);
  lines.push("");
  if (r.ptBr.length === 0) {
    lines.push("_None._");
  } else {
    lines.push("| File | Hits | Patterns |");
    lines.push("|------|-----:|----------|");
    for (const e of r.ptBr.sort((a,b) => b.count - a.count)) {
      const pats = [...new Set(e.issues.map(i => i.id))].join(", ");
      lines.push(`| pt/${e.slug} | ${e.count} | ${pats} |`);
    }
  }
  lines.push("");

  lines.push(`## Duplicate consecutive paragraphs (${r.duplicates.length} files, ${r.duplicates.reduce((n,x)=>n+x.count,0)} occurrences)`);
  lines.push("");
  if (r.duplicates.length === 0) {
    lines.push("_None._");
  } else {
    lines.push("| File | Dups | First sample |");
    lines.push("|------|-----:|--------------|");
    for (const e of r.duplicates.sort((a,b) => b.count - a.count)) {
      const sample = e.dups[0].sample.replace(/\|/g, "\\|");
      lines.push(`| ${e.lang}/${e.slug} | ${e.count} | ${sample}… |`);
    }
  }
  lines.push("");

  writeFileSync(join(OUT_DIR, "blog-translation-quality.md"), lines.join("\n"), "utf8");
  console.log(`Wrote blog-translation-quality.{json,md} — PT-BR hits in ${r.ptBr.length} files; dup-paras in ${r.duplicates.length} files.`);
}

main();
