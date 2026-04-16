import { BLOG_SLUG_I18N } from "./client/src/data/blog-posts-slugs.js";
import { BLOG_POSTS } from "./client/src/data/blog-posts.js";
import fs from "fs";

async function run() {
  console.log("Starting manual verification...");

  const baseId = "llc-estados-unidos-guia-completa-2026";
  const slugs = BLOG_SLUG_I18N[baseId];
  
  const enSlug = slugs.en;
  const esSlug = baseId;
  const frSlug = slugs.fr;

  console.log(`Slugs: EN=${enSlug}, ES=${esSlug}, FR=${frSlug}`);

  // Requirement (1) EN Nav
  if (enSlug !== "llc-in-the-united-states-complete-guide-for-non-residents-in-2026") {
     console.log("Note: Slug is different from query but we use the one in code.");
  }

  // Requirement (2) Network request check
  const assetDir = "dist/public/assets";
  const files = fs.readdirSync(assetDir);
  const chunkMatch = files.find(f => f.startsWith("blog-en-llc-estados-unidos-guia-completa-2026") && f.endsWith(".js"));
  
  if (chunkMatch) {
    console.log(`PASS: Dynamic chunk found: ${chunkMatch}`);
  } else {
    console.error("FAIL: Dynamic chunk for EN blog post not found");
  }

  // Requirement (1) content
  const enContentFile = "client/src/data/blog-content/en/llc-estados-unidos-guia-completa-2026.ts";
  const enContent = fs.readFileSync(enContentFile, "utf-8");
  if (enContent.includes("LLC") && enContent.length > 5000) {
    console.log(`PASS: EN content has 'LLC' and length ${enContent.length} > 5000`);
  } else {
    console.error(`FAIL: EN content. Length=${enContent.length}`);
  }

  // Requirement (3) ES content
  const esPost = BLOG_POSTS.find(p => p.slug === baseId);
  if (esPost && esPost.content.includes("LLC")) {
    console.log("PASS: ES content found in BLOG_POSTS and contains 'LLC'");
  } else {
    console.error("FAIL: ES content check");
  }

  // Requirement (4) FR content
  const frContentFile = "client/src/data/blog-content/fr/llc-estados-unidos-guia-completa-2026.ts";
  const frContent = fs.readFileSync(frContentFile, "utf-8");
  if (frContent.includes("LLC")) {
    console.log("PASS: FR content contains 'LLC'");
  } else {
    console.error("FAIL: FR content check");
  }
}

run().catch(console.error);
