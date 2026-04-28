// Sitemap E2E test (Bloque 2)
// Connects to a running server and validates:
//   - /sitemap.xml index points to 3 sub-sitemaps
//   - /sitemap-pages.xml: 96 page URLs (16 routes × 6 langs) + BCP-47 hreflang
//   - /sitemap-blog.xml: 666 blog URLs (111 articles × 6 langs)
//   - /sitemap-faq.xml: 6 FAQ URLs (1 × 6 langs)
//   - /robots.txt: Allow rules + sitemap reference
//
// Run after starting the server (any port, default 5050):
//   PORT=5050 npx tsx scripts/e2e/test-sitemap-e2e.ts

const BASE = process.env.SITEMAP_BASE_URL || `http://localhost:${process.env.PORT || 5050}`;

let asserts = 0;
let passed = 0;
const fails: string[] = [];

function assert(cond: boolean, msg: string) {
  asserts++;
  if (cond) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    fails.push(msg);
    console.log(`  ✗ FAIL: ${msg}`);
  }
}

async function fetchOk(url: string): Promise<{ ok: boolean; status: number; body: string }> {
  const res = await fetch(url);
  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}

console.log(`\n=== Sitemap E2E Test (base: ${BASE}) ===\n`);

// 1. /sitemap.xml index
console.log("[1] /sitemap.xml index");
const idx = await fetchOk(`${BASE}/sitemap.xml`);
assert(idx.status === 200, `index returns 200 (got ${idx.status})`);
assert(idx.body.startsWith('<?xml version="1.0"'), "index is XML");
assert(idx.body.includes("<sitemapindex"), "index has <sitemapindex> root");
assert(idx.body.includes("/sitemap-pages.xml"), "index references /sitemap-pages.xml");
assert(idx.body.includes("/sitemap-blog.xml"), "index references /sitemap-blog.xml");
assert(idx.body.includes("/sitemap-faq.xml"), "index references /sitemap-faq.xml");

// 2. /sitemap-pages.xml
console.log("\n[2] /sitemap-pages.xml");
const pages = await fetchOk(`${BASE}/sitemap-pages.xml`);
assert(pages.status === 200, `pages returns 200 (got ${pages.status})`);
const pageLocs = (pages.body.match(/<loc>/g) ?? []).length;
assert(pageLocs === 96, `pages has 96 <loc> entries (16 routes × 6 langs) — got ${pageLocs}`);
const pageHreflangs = pages.body.match(/hreflang="[^"]+"/g) ?? [];
const pageLangs = new Set(pageHreflangs.map((m) => m.replace(/hreflang="|"/g, "")));
const expectedLangs = ["es-ES", "en-US", "fr-FR", "de-DE", "pt-PT", "ca-ES", "x-default"];
for (const lang of expectedLangs) {
  assert(pageLangs.has(lang), `pages contains hreflang="${lang}" (BCP-47)`);
}

// 3. /sitemap-blog.xml
console.log("\n[3] /sitemap-blog.xml");
const blog = await fetchOk(`${BASE}/sitemap-blog.xml`);
assert(blog.status === 200, `blog returns 200 (got ${blog.status})`);
const blogLocs = (blog.body.match(/<loc>/g) ?? []).length;
assert(blogLocs === 666, `blog has 666 <loc> entries (111 articles × 6 langs) — got ${blogLocs}`);
const blogHreflangs = blog.body.match(/hreflang="[^"]+"/g) ?? [];
const blogLangs = new Set(blogHreflangs.map((m) => m.replace(/hreflang="|"/g, "")));
for (const lang of expectedLangs) {
  assert(blogLangs.has(lang), `blog contains hreflang="${lang}" (BCP-47)`);
}
const langCounts: Record<string, number> = {};
for (const m of blogHreflangs) {
  const lang = m.replace(/hreflang="|"/g, "");
  langCounts[lang] = (langCounts[lang] ?? 0) + 1;
}
for (const lang of ["es-ES", "en-US", "fr-FR", "de-DE", "pt-PT", "ca-ES"]) {
  assert(langCounts[lang] === 666, `blog hreflang="${lang}" appears 666 times — got ${langCounts[lang]}`);
}

// 4. /sitemap-faq.xml
console.log("\n[4] /sitemap-faq.xml");
const faq = await fetchOk(`${BASE}/sitemap-faq.xml`);
assert(faq.status === 200, `faq returns 200 (got ${faq.status})`);
const faqLocs = (faq.body.match(/<loc>/g) ?? []).length;
assert(faqLocs === 6, `faq has 6 <loc> entries (1 × 6 langs) — got ${faqLocs}`);

// 5. /robots.txt
console.log("\n[5] /robots.txt");
const robots = await fetchOk(`${BASE}/robots.txt`);
assert(robots.status === 200, `robots returns 200 (got ${robots.status})`);
assert(robots.body.includes("User-agent: *"), "robots has User-agent: *");
assert(robots.body.includes("Allow: /"), "robots has Allow: /");
assert(robots.body.includes("Sitemap:"), "robots references Sitemap:");
assert(robots.body.includes("/sitemap.xml"), "robots Sitemap line includes /sitemap.xml");
assert(!robots.body.toLowerCase().includes("disallow: /\n"), "robots does NOT block all crawlers");

// 6. URL structure validation
console.log("\n[6] URL structure validation");
const sampleBlogUrls = (blog.body.match(/<loc>[^<]+<\/loc>/g) ?? []).slice(0, 12);
for (const u of sampleBlogUrls) {
  const url = u.replace(/<loc>|<\/loc>/g, "");
  assert(url.startsWith("https://exentax.com/"), `blog URL is HTTPS exentax.com (${url.slice(-50)})`);
  assert(/\/(es|en|fr|de|pt|ca)\/blog\/[a-z0-9-]+$/.test(url), `blog URL matches /(lang)/blog/(slug) pattern`);
}

// === Summary ===
console.log("\n=== Summary ===");
console.log(`${passed}/${asserts} assertions passed.`);
if (fails.length > 0) {
  console.log("\nFailures:");
  for (const f of fails) console.log("  -", f);
  process.exit(1);
}
console.log("\n✓ Sitemap E2E: PASS");
process.exit(0);
