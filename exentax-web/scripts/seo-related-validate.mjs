#!/usr/bin/env node
/**
 * Validates blog "related articles" integrity.
 *
 * Build-fails when:
 *  - Any post in BLOG_POSTS declares < 3 relatedSlugs.
 *  - Any relatedSlug references a slug that is not in BLOG_POSTS / not on disk.
 *  - The blog post renderer (post.tsx) duplicates the related-reads block.
 *
 * Usage: node exentax-web/scripts/seo-related-validate.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "..", "client", "src");
const DATA = path.join(SRC, "data");
const read = p => fs.readFileSync(p, "utf8");

function parsePosts() {
  const src = read(path.join(DATA, "blog-posts.ts"));
  const start = src.indexOf("export const BLOG_POSTS");
  const eq = src.indexOf("=", start);
  const body = src.slice(eq + 1);
  const arrStart = body.indexOf("[");
  let depth = 0, end = -1;
  for (let i = arrStart; i < body.length; i++) {
    if (body[i] === "[") depth++;
    else if (body[i] === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  const arrText = body.slice(arrStart + 1, end);
  const out = [];
  let buf = "", inStr = false, sc = "", d = 0;
  for (let j = 0; j < arrText.length; j++) {
    const c = arrText[j], prev = arrText[j - 1];
    if (inStr) { buf += c; if (c === sc && prev !== "\\") inStr = false; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = true; sc = c; buf += c; continue; }
    if (c === "{") { d++; buf += c; continue; }
    if (c === "}") { d--; buf += c; if (d === 0) { out.push(buf); buf = ""; } continue; }
    if (d > 0) buf += c;
  }
  return out.map(t => {
    const slug = (t.match(/slug:\s*"([^"]+)"/) || [])[1];
    if (!slug) return null;
    const rel = [...((t.match(/relatedSlugs:\s*\[([^\]]*)\]/) || ["", ""])[1]).matchAll(/"([^"]+)"/g)].map(m => m[1]);
    return { slug, rel };
  }).filter(Boolean);
}

const posts = parsePosts();
const known = new Set(posts.map(p => p.slug));
for (const f of fs.readdirSync(path.join(DATA, "blog-content", "es"))) {
  if (f.endsWith(".ts")) known.add(f.replace(/\.ts$/, ""));
}

const errors = [];
for (const p of posts) {
  if (p.rel.length < 3) errors.push(`${p.slug} — only ${p.rel.length} relatedSlugs (min 3 required)`);
  for (const r of p.rel) if (!known.has(r)) errors.push(`${p.slug} — relatedSlug "${r}" not found`);
}

const post = read(path.join(SRC, "pages", "blog", "post.tsx"));
const cnt = (post.match(/<RelatedReadsBlock\b/g) || []).length;
if (cnt > 1) errors.push(`post.tsx renders <RelatedReadsBlock> ${cnt} times (must be exactly 1)`);
if (cnt === 0) errors.push("post.tsx does not render <RelatedReadsBlock>");

if (errors.length) {
  console.error(`SEO RELATED VALIDATE — ${errors.length} violation(s):`);
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log(`SEO RELATED VALIDATE — OK (${posts.length} posts).`);
