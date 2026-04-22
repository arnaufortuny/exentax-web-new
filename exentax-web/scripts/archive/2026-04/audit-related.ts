import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BLOG_POSTS, getRelatedPosts } from "../client/src/data/blog-posts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../client/src/data/blog-content");
const hasBlogTranslation = (slug: string, lang: string) =>
  existsSync(resolve(ROOT, lang, slug + ".ts")) ||
  existsSync(resolve(ROOT, lang, slug + ".tsx"));

const slugs = new Set(BLOG_POSTS.map(p => p.slug));
console.log("Total posts:", BLOG_POSTS.length);

const dangling: Array<{ post: string; bad: string }> = [];
for (const p of BLOG_POSTS) {
  for (const s of p.relatedSlugs || []) {
    if (!slugs.has(s)) dangling.push({ post: p.slug, bad: s });
    if (s === p.slug) dangling.push({ post: p.slug, bad: "SELF: " + s });
  }
}
console.log("\n--- Dangling/self relatedSlugs ---");
if (dangling.length === 0) console.log("  none ✓");
else dangling.forEach(d => console.log("  " + d.post + " -> " + d.bad));

const noKw = BLOG_POSTS.filter(p => !p.keywords || p.keywords.length === 0);
console.log("\n--- Posts without keywords ---");
if (noKw.length === 0) console.log("  none ✓");
else noKw.forEach(p => console.log("  " + p.slug));

console.log("\n--- Coverage (es / en) ---");
for (const lang of ["es", "en"] as const) {
  const fails: string[] = [];
  let total = 0;
  for (const p of BLOG_POSTS) {
    if (!hasBlogTranslation(p.slug, lang)) continue;
    total++;
    const bottom = getRelatedPosts(p, s => hasBlogTranslation(s, lang), 3);
    const sidebar = getRelatedPosts(p, s => hasBlogTranslation(s, lang), 4, {
      excludeSlugs: bottom.map(x => x.slug),
    });
    const totalUnique = bottom.length + sidebar.length;
    if (bottom.length < 3 || totalUnique < 7) {
      fails.push(p.slug + ` (bottom=${bottom.length}, sidebar=${sidebar.length})`);
    }
  }
  console.log(`  ${lang}: ${total} translated posts, ${fails.length} with <3 related`);
  fails.slice(0, 12).forEach(f => console.log("    " + f));
}
