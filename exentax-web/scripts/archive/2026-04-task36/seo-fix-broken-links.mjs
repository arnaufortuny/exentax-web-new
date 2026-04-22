#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { computeGraph, articleFiles, parseArticleFile } from "./link-graph.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

function tokens(slug) {
  return new Set(slug.split("-").filter((t) => t.length >= 3));
}

function jaccard(a, b) {
  const A = tokens(a), B = tokens(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

function findClosest(brokenSlug, knownSlugs) {
  let best = null, bestScore = 0;
  for (const k of knownSlugs) {
    const s = jaccard(brokenSlug, k);
    if (s > bestScore) { best = k; bestScore = s; }
  }
  return { slug: best, score: bestScore };
}

function main() {
  const graph = computeGraph();
  const knownByLang = {};
  for (const lang of LANGS) knownByLang[lang] = Object.keys(graph.reverse[lang] || {});

  let totalFixes = 0;
  const ambiguous = [];

  for (const lang of LANGS) {
    const known = new Set(knownByLang[lang]);
    for (const { slug, file } of articleFiles(lang)) {
      let raw = fs.readFileSync(file, "utf8");
      let changed = false;
      // Find all /<linkLang>/blog/<slug> in content (both <a href> and md)
      const replacements = new Map();
      const rxAll = /\/([a-z]{2})\/blog\/([a-zA-Z0-9-]+)/g;
      let m;
      while ((m = rxAll.exec(raw))) {
        const linkLang = m[1];
        const linkSlug = m[2];
        const knownForLink = knownByLang[linkLang];
        if (!knownForLink) continue;
        if (knownForLink.includes(linkSlug)) continue;
        // Try to find a close match in the SAME link language
        const { slug: best, score } = findClosest(linkSlug, knownForLink);
        if (best && score >= 0.5) {
          replacements.set(`/${linkLang}/blog/${linkSlug}`, `/${linkLang}/blog/${best}`);
        } else {
          ambiguous.push({ file: path.relative(ROOT, file), href: `/${linkLang}/blog/${linkSlug}`, bestGuess: best, score });
        }
      }
      for (const [from, to] of replacements) {
        const newRaw = raw.split(from).join(to);
        if (newRaw !== raw) {
          raw = newRaw;
          changed = true;
          totalFixes++;
          console.log(`  ${path.relative(ROOT, file)}: ${from} -> ${to}`);
        }
      }
      if (changed) fs.writeFileSync(file, raw);
    }
  }

  if (ambiguous.length) {
    console.log(`\nAmbiguous (no fix applied):`);
    for (const a of ambiguous) {
      console.log(`  ${a.file}  ${a.href}  best=${a.bestGuess} (${a.score.toFixed(2)})`);
    }
  }
  console.log(`\nTotal replacements: ${totalFixes}`);
}

main();
