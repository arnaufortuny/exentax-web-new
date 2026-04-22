#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { computeGraph, articleFiles, parseArticleFile } from "./link-graph.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "client/src/data");
const ES_CONTENT = path.join(DATA, "blog-content/es");
const MIN_INCOMING = 3;
const MARKER = "<!-- exentax:cross-refs-v1 -->";

function parseBlogPostsMeta() {
  const src = fs.readFileSync(path.join(DATA, "blog-posts.ts"), "utf8");
  const items = [];
  const rx = /slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",[\s\S]*?category:\s*"([^"]+)",[\s\S]*?keywords:\s*\[([^\]]*)\]/g;
  let m;
  while ((m = rx.exec(src))) {
    const kws = [...m[4].matchAll(/"([^"]+)"/g)].map((k) => k[1].toLowerCase());
    items.push({ slug: m[1], title: m[2], category: m[3], keywords: kws });
  }
  return items;
}

function tokenize(s) {
  return new Set(
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/[^a-z0-9]+/)
      .filter((w) => w && w.length >= 4),
  );
}

function score(target, source) {
  if (target.slug === source.slug) return -1;
  let s = 0;
  if (target.category === source.category) s += 5;
  const tTok = tokenize([target.title, ...target.keywords].join(" "));
  const sTok = tokenize([source.title, ...source.keywords].join(" "));
  for (const w of tTok) if (sTok.has(w)) s += 1;
  return s;
}

function pickSources(target, posts, excludeSlugs) {
  return posts
    .filter((p) => p.slug !== target.slug && !excludeSlugs.has(p.slug))
    .map((p) => ({ p, s: score(target, p) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .map(({ p }) => p);
}

function injectIntoArticle(file, additions) {
  // additions: array of { slug, title }
  const raw = fs.readFileSync(file, "utf8");
  const tickStart = raw.indexOf("`");
  let i = tickStart + 1;
  while (i < raw.length) {
    if (raw[i] === "\\") { i += 2; continue; }
    if (raw[i] === "`") break;
    i++;
  }
  const body = raw.slice(tickStart + 1, i);
  const after = raw.slice(i);

  // Strip any prior block from this script (idempotent)
  const stripped = body.replace(
    new RegExp(`\\n*${MARKER}[\\s\\S]*?<!-- \\/exentax:cross-refs-v1 -->\\n*`, "g"),
    "\n",
  );

  const lines = additions.map((a) => `- [${a.title}](/es/blog/${a.slug})`).join("\n");
  const block = `\n\n${MARKER}\n### Más lecturas relacionadas\n\n${lines}\n<!-- /exentax:cross-refs-v1 -->\n`;

  const newBody = stripped.replace(/\n*$/, "") + block;
  const out = raw.slice(0, tickStart + 1) + newBody + after;
  fs.writeFileSync(file, out);
}

function main() {
  const posts = parseBlogPostsMeta();
  if (posts.length < 50) {
    console.error("Failed to parse blog-posts.ts (got", posts.length, "items)");
    process.exit(2);
  }
  const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));

  const graph = computeGraph();
  const targets = graph.allEsSlugs
    .filter((s) => (graph.incomingTotal[s] || 0) < MIN_INCOMING)
    .filter((s) => bySlug[s]);

  // For each source article, accumulate the underlinked targets we want it to mention.
  const additionsBySource = new Map();

  // Track planned incoming counts so we don't overshoot or under-shoot.
  const plannedIncoming = { ...graph.incomingTotal };

  for (const tgtSlug of targets) {
    const target = bySlug[tgtSlug];
    const need = MIN_INCOMING - (plannedIncoming[tgtSlug] || 0);
    if (need <= 0) continue;
    const candidates = pickSources(target, posts, new Set([tgtSlug]));
    let picked = 0;
    for (const cand of candidates) {
      if (picked >= need) break;
      // Skip if cand already has 6+ outgoing additions (avoid spam)
      const cur = additionsBySource.get(cand.slug) || [];
      if (cur.length >= 4) continue;
      // Skip if cand already links to tgt in original graph
      const out = graph.outgoingPerLang.es[cand.slug] || {};
      if (out[tgtSlug]) continue;
      // Skip if cand also already in our additions for tgt
      if (cur.some((a) => a.slug === tgtSlug)) continue;
      cur.push({ slug: tgtSlug, title: target.title });
      additionsBySource.set(cand.slug, cur);
      plannedIncoming[tgtSlug] = (plannedIncoming[tgtSlug] || 0) + 1;
      picked++;
    }
    if (picked < need) {
      console.warn(`Only ${picked}/${need} sources found for ${tgtSlug}`);
    }
  }

  // Write
  let written = 0;
  for (const [srcSlug, additions] of additionsBySource) {
    const file = path.join(ES_CONTENT, `${srcSlug}.ts`);
    if (!fs.existsSync(file)) {
      console.warn("Missing source file:", file);
      continue;
    }
    injectIntoArticle(file, additions);
    written++;
  }
  console.log(`Updated ${written} article(s) with cross-refs.`);
}

main();
