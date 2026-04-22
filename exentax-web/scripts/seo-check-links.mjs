#!/usr/bin/env node
/*
 * seo-check-links.mjs
 * ----------------------------------------------------------------------------
 * CI guard for the blog internal-link graph (see docs/seo/internal-linking.md
 * §3.2 and §3.3).
 *
 * Two checks, both fatal in CI:
 *
 *   1. Broken internal blog links — every `/<lang>/blog/<slug>` href found in
 *      any per-article content file must resolve to a known slug for that
 *      language (per BLOG_SLUG_I18N in client/src/data/blog-posts-slugs.ts).
 *
 *   2. Under-linked articles — every Spanish article must receive at least
 *      three incoming contextual links from other Spanish articles. (We use
 *      the Spanish content as the canonical graph because the other locales
 *      mirror it; see docs/seo/internal-linking.md §1.4.)
 *
 * Exits 0 if both checks pass, 1 otherwise. Wired as `npm run seo:check`.
 * ----------------------------------------------------------------------------
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import {
  computeGraph,
  articleFiles,
  parseArticleFile,
} from "./link-graph.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const MIN_INCOMING = 3;

function extractLinksWithLine(body) {
  const links = [];
  const rxHref = /<a[^>]*href="\/([a-z]{2})\/blog\/([^"#?]+)"[^>]*>/g;
  let m;
  while ((m = rxHref.exec(body))) {
    links.push({
      linkLang: m[1],
      slug: m[2].replace(/\/$/, ""),
      offset: m.index,
    });
  }
  const rxMd = /\[[^\]]+\]\(\/([a-z]{2})\/blog\/([^)#?]+)\)/g;
  while ((m = rxMd.exec(body))) {
    links.push({
      linkLang: m[1],
      slug: m[2].replace(/\/$/, ""),
      offset: m.index,
    });
  }
  return links;
}

function lineForOffset(src, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < src.length; i++) {
    if (src[i] === "\n") line++;
  }
  return line;
}

function relPath(p) {
  return path.relative(ROOT, p);
}

function checkBrokenLinks(graph) {
  const { reverse } = graph;
  const broken = [];
  for (const lang of LANGS) {
    const known = new Set(Object.keys(reverse[lang] || {}));
    for (const { slug, file } of articleFiles(lang)) {
      const { src, body, bodyStart } = parseArticleFile(file);
      const links = extractLinksWithLine(body);
      for (const lk of links) {
        const targetKnown =
          (reverse[lk.linkLang] && reverse[lk.linkLang][lk.slug]) ||
          (lk.linkLang === lang && known.has(lk.slug));
        if (!targetKnown) {
          const line = lineForOffset(src, bodyStart + lk.offset);
          broken.push({
            file: relPath(file),
            line,
            lang,
            sourceSlug: slug,
            href: `/${lk.linkLang}/blog/${lk.slug}`,
          });
        }
      }
    }
  }
  return broken;
}

function checkUnderLinked(graph) {
  const under = [];
  for (const es of graph.allEsSlugs) {
    const incoming = graph.incomingTotal[es] || 0;
    if (incoming < MIN_INCOMING) {
      under.push({ slug: es, incoming });
    }
  }
  return under.sort((a, b) => a.incoming - b.incoming);
}

function main() {
  const graph = computeGraph();
  const broken = checkBrokenLinks(graph);
  const under = checkUnderLinked(graph);

  let failed = false;

  if (broken.length) {
    failed = true;
    console.error(`\n✖ ${broken.length} broken internal blog link(s):\n`);
    for (const b of broken) {
      console.error(
        `  ${b.file}:${b.line}  ${b.href}  (in ${b.lang}/${b.sourceSlug})`,
      );
    }
  } else {
    console.log("✓ No broken internal blog links.");
  }

  if (under.length) {
    failed = true;
    console.error(
      `\n✖ ${under.length} under-linked article(s) (need ≥ ${MIN_INCOMING} incoming):\n`,
    );
    for (const u of under) {
      console.error(`  ${u.incoming.toString().padStart(2)}  ${u.slug}`);
    }
  } else {
    console.log(
      `✓ All ${graph.allEsSlugs.length} articles have ≥ ${MIN_INCOMING} incoming links.`,
    );
  }

  if (failed) {
    console.error("\nseo-check-links: FAIL\n");
    process.exit(1);
  }
  console.log("\nseo-check-links: OK\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { checkBrokenLinks, checkUnderLinked, extractLinksWithLine };
