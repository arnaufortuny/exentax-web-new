#!/usr/bin/env node
/**
 * Rebalance internal links across the blog cluster.
 *
 * Goals (from Task #24):
 *   1. Every article has at least 3 distinct incoming contextual links.
 *   2. No article has more than ~10 distinct incoming contextual links.
 *   3. Links live inside article prose, never as a generic "related" block.
 *
 * Strategy:
 *   - STRIP: remove any connector paragraph this script has previously added
 *     (idempotent re-run).
 *   - TRIM: for every hub article with incoming > 10, unwrap the hyperlink
 *     on the least-thematic source articles (turn `<a>X</a>` → `X`). The
 *     prose stays intact; only the hyperlink is removed. Repeated until the
 *     hub is at or below 10 incoming links.
 *     Task #32 follow-up: `scripts/redirect-hub-trims.mjs` then re-links
 *     those unwrapped spots to a thematically-adjacent sibling (same anchor
 *     text, different `href`), so the SEO weight lands on an under-linked
 *     neighbour instead of being thrown away. Run it after this script if
 *     any new trims happen on a future run.
 *   - BOOST: for every article still under 3 incoming, pick under-linked
 *     sibling sources (same category first) and insert a single short
 *     connector phrase. Four distinct templates per language are rotated
 *     by hash(sourceSlug) so the prose doesn't feel boilerplate.
 *
 * Content lives in per-article files at `client/src/data/blog-content/<lang>/<slug>.ts`,
 * each of the form `export default \`...\`;` (since Task #20).
 *
 * Usage (from `exentax-web/`):
 *   node scripts/rebalance-links.mjs
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { computeGraph, articleFiles, parseArticleFile } from "./link-graph.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "client/src/data");
const DOCS = path.join(ROOT, "docs/seo");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const MIN_INCOMING = 3;
const MAX_INCOMING = 10;
const MAX_NEW_OUT = 2;

const TEMPLATES = {
  es: [
    { one: "Para seguir profundizando, {links} complementa lo que hemos visto aquí con detalles que merecían su propio artículo.", many: "Para seguir profundizando, {links} complementan lo que hemos visto aquí con detalles que merecían su propio artículo." },
    { one: "Un matiz que quedó corto y que conviene leer aparte: {links}, porque afina exactamente los bordes de lo explicado en esta guía.", many: "Algunos matices quedaron cortos y conviene leerlos aparte: {links}, porque afinan exactamente los bordes de lo explicado en esta guía." },
    { one: "Si te ha quedado alguna duda sobre los matices de esta estructura, {links} explica en detalle un aspecto colindante que solemos dejar apuntado para otro día.", many: "Si te han quedado dudas sobre los matices de esta estructura, {links} explican en detalle varios aspectos colindantes que solemos dejar apuntados para otro día." },
    { one: "Cierro con una lectura relacionada que encaja con el hilo de este artículo: {links} es una pieza útil para terminar de contextualizar el escenario.", many: "Cierro con lecturas relacionadas que encajan con el hilo de este artículo: {links} son piezas útiles para terminar de contextualizar el escenario." },
  ],
  en: [
    { one: "To keep going on this thread, {links} fills in a nuance this guide only touched on.", many: "To keep going on this thread, {links} fill in nuances this guide only touched on." },
    { one: "One adjacent read worth having open alongside this one: {links}, which sharpens exactly the edges we skimmed above.", many: "A couple of adjacent reads worth having open alongside this one: {links}, which sharpen exactly the edges we skimmed above." },
    { one: "If something in this structure left you wanting more detail, {links} dives into a neighbouring piece of the puzzle we usually keep for a separate write-up.", many: "If something in this structure left you wanting more detail, {links} dive into neighbouring pieces of the puzzle we usually keep for separate write-ups." },
    { one: "Closing out, here's a related piece that sits naturally next to this article: {links} helps round off the context.", many: "Closing out, here are related pieces that sit naturally next to this article: {links} help round off the context." },
  ],
  fr: [
    { one: "Pour poursuivre sur ce fil, {links} complète les nuances que nous n'avons qu'effleurées ici.", many: "Pour poursuivre sur ce fil, {links} complètent les nuances que nous n'avons qu'effleurées ici." },
    { one: "Une lecture voisine à garder sous la main : {links}, qui affine précisément les bords de ce qu'explique ce guide.", many: "Quelques lectures voisines à garder sous la main : {links}, qui affinent précisément les bords de ce qu'explique ce guide." },
    { one: "Si un aspect de cette structure mérite d'être creusé, {links} détaille un point adjacent que nous réservons d'habitude à un article dédié.", many: "Si certains aspects de cette structure méritent d'être creusés, {links} détaillent des points adjacents que nous réservons d'habitude à des articles dédiés." },
    { one: "Pour refermer, une lecture connexe qui s'inscrit dans le prolongement de ce papier : {links} aide à parachever le contexte.", many: "Pour refermer, quelques lectures connexes qui s'inscrivent dans le prolongement de ce papier : {links} aident à parachever le contexte." },
  ],
  de: [
    { one: "Um diesen Faden weiterzuziehen, vertieft {links} eine Nuance, die wir hier nur gestreift haben.", many: "Um diesen Faden weiterzuziehen, vertiefen {links} Nuancen, die wir hier nur gestreift haben." },
    { one: "Ein angrenzender Beitrag, den man neben diesem geöffnet lassen sollte: {links} schärft genau die Kanten, die wir oben nur angerissen haben.", many: "Ein paar angrenzende Beiträge, die man neben diesem geöffnet lassen sollte: {links} schärfen genau die Kanten, die wir oben nur angerissen haben." },
    { one: "Wer hier mehr Tiefe vermisst, findet in {links} genau den Nachbaraspekt, den wir normalerweise in einen eigenen Text auslagern.", many: "Wer hier mehr Tiefe vermisst, findet in {links} genau die Nachbaraspekte, die wir normalerweise in eigene Texte auslagern." },
    { one: "Zum Abschluss ein verwandter Beitrag, der unmittelbar an diesen Text anschließt: {links} rundet den Kontext ab.", many: "Zum Abschluss einige verwandte Beiträge, die unmittelbar an diesen Text anschließen: {links} runden den Kontext ab." },
  ],
  pt: [
    { one: "Para continuar neste fio, {links} completa uma nuance que aqui apenas tocámos.", many: "Para continuar neste fio, {links} completam nuances que aqui apenas tocámos." },
    { one: "Uma leitura adjacente a manter à mão: {links}, que afina precisamente os contornos do que este guia explica.", many: "Algumas leituras adjacentes a manter à mão: {links}, que afinam precisamente os contornos do que este guia explica." },
    { one: "Se ficou algum ponto desta estrutura por aprofundar, {links} detalha uma peça vizinha que costumamos reservar para um artigo dedicado.", many: "Se ficaram pontos desta estrutura por aprofundar, {links} detalham peças vizinhas que costumamos reservar para artigos dedicados." },
    { one: "Para fechar, uma leitura relacionada que encaixa naturalmente ao lado deste artigo: {links} ajuda a arredondar o contexto.", many: "Para fechar, leituras relacionadas que encaixam naturalmente ao lado deste artigo: {links} ajudam a arredondar o contexto." },
  ],
  ca: [
    { one: "Per continuar aquest fil, {links} completa un matís que aquí només hem tocat de passada.", many: "Per continuar aquest fil, {links} completen matisos que aquí només hem tocat de passada." },
    { one: "Una lectura veïna per tenir oberta al costat d'aquesta: {links}, que afina precisament els marges del que explica aquesta guia.", many: "Unes lectures veïnes per tenir obertes al costat d'aquesta: {links}, que afinen precisament els marges del que explica aquesta guia." },
    { one: "Si algun aspecte d'aquesta estructura t'ha deixat amb ganes de més detall, {links} aprofundeix en una peça veïna que normalment reservem per a un article a part.", many: "Si alguns aspectes d'aquesta estructura t'han deixat amb ganes de més detall, {links} aprofundeixen en peces veïnes que normalment reservem per a articles a part." },
    { one: "Per tancar, una lectura relacionada que encaixa al costat d'aquest article: {links} ajuda a arrodonir el context.", many: "Per tancar, lectures relacionades que encaixen al costat d'aquest article: {links} ajuden a arrodonir el context." },
  ],
};

const STRIP_PREFIXES = [
  "Antes de cerrar, conviene dejar a mano",
  "Antes de cerrar, conviene tener a mano",
  "Before we wrap up, it's worth keeping",
  "Avant de conclure, gardez sous la main",
  "Bevor wir abschließen, lohnt es sich",
  "Antes de encerrar, vale a pena ter à mão",
  "Abans de tancar, convé",
  "Para seguir profundizando,",
  "Un matiz que quedó corto",
  "Algunos matices quedaron cortos",
  "Si te ha quedado alguna duda",
  "Si te han quedado dudas",
  "Cierro con una lectura relacionada",
  "Cierro con lecturas relacionadas",
  "To keep going on this thread",
  "One adjacent read worth having",
  "A couple of adjacent reads worth",
  "If something in this structure left",
  "Closing out, here's a related piece",
  "Closing out, here are related pieces",
  "Pour poursuivre sur ce fil",
  "Une lecture voisine à garder",
  "Quelques lectures voisines à garder",
  "Si un aspect de cette structure",
  "Si certains aspects de cette structure",
  "Pour refermer,",
  "Um diesen Faden weiterzuziehen",
  "Ein angrenzender Beitrag",
  "Ein paar angrenzende Beiträge",
  "Wer hier mehr Tiefe vermisst",
  "Zum Abschluss ein verwandter",
  "Zum Abschluss einige verwandte",
  "Para continuar neste fio",
  "Uma leitura adjacente a manter",
  "Algumas leituras adjacentes",
  "Se ficou algum ponto desta estrutura",
  "Se ficaram pontos desta estrutura",
  "Per continuar aquest fil",
  "Una lectura veïna per tenir",
  "Unes lectures veïnes per tenir",
  "Si algun aspecte d'aquesta estructura",
  "Si alguns aspectes d'aquesta estructura",
  "Per tancar, una lectura relacionada",
  "Per tancar, lectures relacionades",
];

function readFile(p) { return fs.readFileSync(p, "utf8"); }
function writeFile(p, s) { fs.writeFileSync(p, s); }

function parseI18n() {
  const src = readFile(path.join(DATA, "blog-posts-i18n.ts"));
  const map = {};
  const rx = /"([a-z0-9-]+)":\s*\{\s*([\s\S]*?)\n\s*\},\n/g;
  let m;
  while ((m = rx.exec(src))) {
    const slug = m[1], block = m[2], entry = {};
    const inner = /([a-z]{2}):\s*\{\s*title:\s*"((?:[^"\\]|\\.)*)"/g;
    let im;
    while ((im = inner.exec(block))) {
      entry[im[1]] = im[2].replace(/\\"/g, '"').replace(/\\'/g, "'");
    }
    map[slug] = entry;
  }
  return map;
}

function parseEsTitles() {
  const src = readFile(path.join(DATA, "blog-posts.ts"));
  const map = {};
  const rx = /slug:\s*"([^"]+)"[\s\S]*?title:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = rx.exec(src))) if (!map[m[1]]) map[m[1]] = m[2].replace(/\\"/g, '"');
  return map;
}

function parseEsCategories() {
  const src = readFile(path.join(DATA, "blog-posts.ts"));
  const map = {};
  const rx = /slug:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"/g;
  let m;
  while ((m = rx.exec(src))) if (!map[m[1]]) map[m[1]] = m[2];
  return map;
}

function hashPick(key, modulo) {
  const h = crypto.createHash("sha1").update(key).digest();
  return h[0] % modulo;
}

function escapeAttr(s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;"); }

function joinLinks(htmls, lang) {
  if (htmls.length <= 1) return htmls.join("");
  const and = { es: " y ", en: " and ", fr: " et ", de: " und ", pt: " e ", ca: " i " }[lang];
  if (htmls.length === 2) return htmls.join(and);
  return htmls.slice(0, -1).join(", ") + "," + and + htmls[htmls.length - 1];
}

function buildConnector(lang, srcSlug, targetsInfo) {
  const safe = (s) => String(s).replace(/`/g, "'").replace(/\$\{/g, "$ {");
  const tags = targetsInfo.map((t) => `<a href="${escapeAttr(t.href)}">${safe(t.anchor)}</a>`);
  const tpl = TEMPLATES[lang][hashPick(srcSlug, TEMPLATES[lang].length)];
  const form = targetsInfo.length === 1 ? tpl.one : tpl.many;
  return form.replace("{links}", joinLinks(tags, lang));
}

function stripConnectorParagraphs(body) {
  const lines = body.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (STRIP_PREFIXES.some((p) => ln.startsWith(p))) {
      if (out.length && out[out.length - 1] === "") out.pop();
      if (i + 1 < lines.length && lines[i + 1] === "") i++;
      continue;
    }
    out.push(ln);
  }
  return out.join("\n");
}

function insertInBody(body, paragraph) {
  const lastIdx = body.lastIndexOf("\n## ");
  const insertion = `\n${paragraph}\n`;
  if (lastIdx >= 0) return body.slice(0, lastIdx) + insertion + body.slice(lastIdx);
  return body.replace(/\s*$/, "") + "\n\n" + paragraph + "\n";
}

function unwrapAnchors(body, targetEsSlug, lang, slugMap) {
  const localSlug = lang === "es" ? targetEsSlug : (slugMap[targetEsSlug]?.[lang] || targetEsSlug);
  const esc = localSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rxA = new RegExp(
    `<a\\b[^>]*href=["']/${lang}/blog/${esc}(?:/)?(?:[#?][^"']*)?["'][^>]*>([\\s\\S]*?)<\\/a>`,
    "g",
  );
  const rxMd = new RegExp(
    `\\[([^\\]]+)\\]\\(/${lang}/blog/${esc}(?:/)?(?:[#?][^)]*)?\\)`,
    "g",
  );
  let count = 0;
  body = body.replace(rxA, (_, text) => { count++; return text; });
  body = body.replace(rxMd, (_, text) => { count++; return text; });
  return { body, count };
}

function allocateBoost(graph, categories, trimmedIncoming) {
  const { allEsSlugs, outgoingPerLang } = graph;
  const esOutgoing = outgoingPerLang.es;
  const alreadyLinks = (src, tgt) => !!(esOutgoing[src] && esOutgoing[src][tgt]);

  const current = { ...trimmedIncoming };
  const newOut = {};
  const assignments = {};

  const targets = [...allEsSlugs].sort((a, b) => current[a] - current[b]);

  for (const tgt of targets) {
    const need = Math.max(MIN_INCOMING - current[tgt], 0);
    if (need === 0) continue;
    const cat = categories[tgt];
    const score = (s) =>
      (newOut[s] || 0) * 100 +
      Object.keys(esOutgoing[s] || {}).length;
    const candidates = (sameCat) =>
      allEsSlugs.filter(
        (s) =>
          s !== tgt &&
          (sameCat ? categories[s] === cat : categories[s] !== cat) &&
          !alreadyLinks(s, tgt) &&
          current[s] <= MAX_INCOMING &&
          (newOut[s] || 0) < MAX_NEW_OUT,
      );
    const pool = [
      ...candidates(true).sort((a, b) => score(a) - score(b)),
      ...candidates(false).sort((a, b) => score(a) - score(b)),
    ];
    let added = 0;
    for (const src of pool) {
      if (added >= need) break;
      (assignments[src] ||= []).push(tgt);
      newOut[src] = (newOut[src] || 0) + 1;
      current[tgt]++;
      added++;
    }
  }
  return { assignments, projectedIncoming: current };
}

function planTrim(graph, categories) {
  const { allEsSlugs, incomingTotal, outgoingPerLang } = graph;
  const esOut = outgoingPerLang.es;
  const trims = [];

  for (const hub of allEsSlugs) {
    const excess = (incomingTotal[hub] || 0) - MAX_INCOMING;
    if (excess <= 0) continue;
    const hubCat = categories[hub];
    const sources = allEsSlugs.filter((s) => s !== hub && esOut[s] && esOut[s][hub]);
    const scored = sources.map((s) => {
      const outCount = Object.keys(esOut[s]).length;
      const sameCat = categories[s] === hubCat ? 1 : 0;
      return { s, score: sameCat * 1000 - outCount, slug: s };
    }).sort((a, b) => a.score - b.score || a.slug.localeCompare(b.slug));
    for (let i = 0; i < excess && i < scored.length; i++) {
      trims.push({ source: scored[i].s, target: hub });
    }
  }
  return trims;
}

// Read all article files for a language as { slug -> { file, src, bodyStart, bodyEnd, body } }.
function loadArticles(lang) {
  const result = {};
  for (const { slug, file } of articleFiles(lang)) {
    result[slug] = { file, ...parseArticleFile(file) };
  }
  return result;
}

// Write back a single article's body. Keeps header/footer (everything outside the backticks).
function writeArticleBody(art, newBody) {
  const out = art.src.slice(0, art.bodyStart) + newBody + art.src.slice(art.bodyEnd);
  writeFile(art.file, out);
}

function esSlugForLangSlug(lang, langSlug, slugMap) {
  if (lang === "es") return langSlug;
  for (const [es, m] of Object.entries(slugMap)) {
    if (m[lang] === langSlug) return es;
  }
  return langSlug;
}

function main() {
  const slugMapEarly = (() => {
    const src = readFile(path.join(DATA, "blog-posts-slugs.ts"));
    const map = {};
    const objStart = src.indexOf("{", src.indexOf("BLOG_SLUG_I18N"));
    const objEnd = src.indexOf("};", objStart);
    const body = src.slice(objStart, objEnd);
    const rx = /"([^"]+)":\s*\{([^}]+)\}/g;
    let m;
    while ((m = rx.exec(body))) {
      const es = m[1];
      const entries = {};
      const inner = /([a-z]{2}):\s*"([^"]+)"/g;
      let im;
      while ((im = inner.exec(m[2]))) entries[im[1]] = im[2];
      map[es] = entries;
    }
    return map;
  })();

  // 1) STRIP prior connector paragraphs from every article file.
  for (const lang of LANGS) {
    const arts = loadArticles(lang);
    for (const [, art] of Object.entries(arts)) {
      const stripped = stripConnectorParagraphs(art.body);
      if (stripped !== art.body) writeArticleBody(art, stripped);
    }
  }

  // 2) Recompute the graph against the cleaned content.
  const before = computeGraph();
  const categories = parseEsCategories();
  const esTitles = parseEsTitles();
  const i18nTitles = parseI18n();
  const { slugMap } = before;

  // 3) TRIM — plan hub unwraps.
  const trims = planTrim(before, categories);

  const trimStats = {};
  for (const t of trims) {
    trimStats[t.target] ||= { before: before.incomingTotal[t.target], trimmed: 0 };
    trimStats[t.target].trimmed++;
  }

  for (const lang of LANGS) {
    const arts = loadArticles(lang);
    for (const [slugInLang, art] of Object.entries(arts)) {
      const esSlug = esSlugForLangSlug(lang, slugInLang, slugMap);
      const targetsToUnwrap = trims.filter((t) => t.source === esSlug).map((t) => t.target);
      if (!targetsToUnwrap.length) continue;
      let body = art.body;
      for (const tgt of targetsToUnwrap) {
        const r = unwrapAnchors(body, tgt, lang, slugMap);
        body = r.body;
      }
      if (body !== art.body) writeArticleBody(art, body);
    }
  }

  // 4) Re-compute graph post-trim.
  const postTrim = computeGraph();

  // 5) BOOST — allocate new links to under-linked targets.
  const { assignments } = allocateBoost(postTrim, categories, postTrim.incomingTotal);

  const targetHref = (tgtEs, lang) => lang === "es" ? `/es/blog/${tgtEs}` : `/${lang}/blog/${slugMap[tgtEs]?.[lang] || tgtEs}`;
  const targetTitle = (tgtEs, lang) => lang === "es" ? (esTitles[tgtEs] || tgtEs) : (i18nTitles[tgtEs]?.[lang] || esTitles[tgtEs] || tgtEs);

  for (const lang of LANGS) {
    const arts = loadArticles(lang);
    let patched = 0;
    for (const [slugInLang, art] of Object.entries(arts)) {
      const esSlug = esSlugForLangSlug(lang, slugInLang, slugMap);
      const targets = assignments[esSlug];
      if (!targets || !targets.length) continue;
      const linksInfo = targets.map((tEs) => ({ href: targetHref(tEs, lang), anchor: targetTitle(tEs, lang) }));
      const paragraph = buildConnector(lang, esSlug, linksInfo);
      const newBody = insertInBody(art.body, paragraph);
      writeArticleBody(art, newBody);
      patched++;
    }
    console.log(`[${lang}] boost: patched ${patched} articles`);
  }

  // 6) Final report.
  const after = computeGraph();
  const lines = [];
  lines.push("# Internal link graph — before/after rebalance\n");
  lines.push(`_Generated by \`scripts/rebalance-links.mjs\`. Counts are distinct source articles linking to the row, measured on the Spanish content (all languages inherit the same structure)._\n`);
  lines.push("");
  lines.push("| Article | Category | Before | After |");
  lines.push("|---|---|---:|---:|");
  const sorted = [...before.allEsSlugs].sort((a, b) => after.incomingTotal[b] - after.incomingTotal[a]);
  for (const s of sorted) {
    lines.push(`| \`${s}\` | ${categories[s] || "-"} | ${before.incomingTotal[s]} | ${after.incomingTotal[s]} |`);
  }
  const under = (g) => g.allEsSlugs.filter((s) => g.incomingTotal[s] < MIN_INCOMING).length;
  const over = (g) => g.allEsSlugs.filter((s) => g.incomingTotal[s] > MAX_INCOMING).length;
  const totalAdded = Object.values(assignments).reduce((a, b) => a + b.length, 0);
  lines.push("");
  lines.push("## Summary\n");
  lines.push(`- Articles with <${MIN_INCOMING} incoming links — **before**: ${under(before)}, **after**: ${under(after)}.`);
  lines.push(`- Articles with >${MAX_INCOMING} incoming links — **before**: ${over(before)}, **after**: ${over(after)}.`);
  lines.push(`- Hyperlinks unwrapped on over-concentrated hubs (source → hub): ${trims.length}.`);
  lines.push(`- New contextual links inserted: ${totalAdded} (across ${Object.keys(assignments).length} source articles).`);
  lines.push("");
  lines.push("## Trim detail (hubs capped at ≤ " + MAX_INCOMING + " incoming)\n");
  lines.push("| Hub | Before | Trimmed | After |");
  lines.push("|---|---:|---:|---:|");
  for (const hub of Object.keys(trimStats).sort()) {
    lines.push(`| \`${hub}\` | ${trimStats[hub].before} | ${trimStats[hub].trimmed} | ${after.incomingTotal[hub]} |`);
  }
  fs.mkdirSync(DOCS, { recursive: true });
  writeFile(path.join(DOCS, "_link-graph.md"), lines.join("\n"));

  console.log(`\nDone. Orphans: ${under(before)} → ${under(after)}. Hubs>${MAX_INCOMING}: ${over(before)} → ${over(after)}. Report: docs/seo/_link-graph.md`);

  if (under(after) !== 0 || over(after) !== 0) {
    console.error("WARNING: constraints not satisfied.");
    process.exit(2);
  }
}

main();
