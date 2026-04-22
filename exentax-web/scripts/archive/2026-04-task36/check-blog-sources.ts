#!/usr/bin/env -S npx tsx
/**
 * Lint pass for the per-article Sources block.
 *
 *  1. Every base slug under client/src/data/blog-content/es/ MUST be present
 *     in SOURCES_BY_SLUG with at least one source ref.
 *  2. Every source ref MUST point to a known doc/section in DOC_REGISTRY.
 *  3. Every section's headingMatch MUST exist in the referenced .md file
 *     (so we don't silently cite a deleted section).
 *  4. No article markdown body may contain a raw `docs/<slug>.md` literal
 *     visible to the reader.
 *  5. No article markdown body may contain a leftover legacy "Sources:" /
 *     "Fuentes:" / ... line.
 *  6. SOURCES_BY_SLUG must not contain duplicate refs for a single slug.
 *
 * Exits with status 1 if any check fails.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  DOC_REGISTRY,
  SOURCES_BY_SLUG,
  LEGACY_SOURCES_LINE_REGEX,
  RAW_DOCS_PATH_REGEX,
} from "../client/src/data/blog-sources";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "../..");
const APP_ROOT = path.resolve(HERE, "..");
const ES_DIR = path.join(APP_ROOT, "client/src/data/blog-content/es");
const CONTENT_DIR = path.join(APP_ROOT, "client/src/data/blog-content");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

type Issue = { file: string; problem: string };

async function listSlugs(): Promise<string[]> {
  const entries = await fs.readdir(ES_DIR);
  return entries.filter(f => f.endsWith(".ts")).map(f => f.replace(/\.ts$/, "")).sort();
}

async function readDoc(absPath: string): Promise<string | null> {
  try { return await fs.readFile(absPath, "utf8"); }
  catch { return null; }
}

function resolveDocPath(p: string): string {
  // DOC_REGISTRY paths are stored relative to the repo root
  // (e.g. "exentax-web/docs/banking-facts-2026.md"). Resolve from REPO_ROOT.
  if (path.isAbsolute(p)) return p;
  return path.resolve(REPO_ROOT, p);
}

async function main() {
  const issues: Issue[] = [];

  // 1. Every base slug must have an entry.
  const slugs = await listSlugs();
  for (const slug of slugs) {
    const refs = SOURCES_BY_SLUG[slug];
    if (!refs || refs.length === 0) {
      issues.push({ file: `es/${slug}.ts`, problem: "no sources declared in SOURCES_BY_SLUG" });
    } else {
      const seen = new Set<string>();
      for (const r of refs) {
        const key = `${r.doc}#${r.section}`;
        if (seen.has(key)) {
          issues.push({ file: `es/${slug}.ts`, problem: `duplicate source ref ${key}` });
        }
        seen.add(key);
      }
    }
  }

  // Detect orphans (slug in map but no .ts file).
  for (const slug of Object.keys(SOURCES_BY_SLUG)) {
    if (!slugs.includes(slug)) {
      issues.push({ file: `SOURCES_BY_SLUG[${slug}]`, problem: "no matching es/<slug>.ts file" });
    }
  }

  // 2 + 3. Validate every ref + section headingMatch.
  const docCache = new Map<string, string>();
  for (const [slug, refs] of Object.entries(SOURCES_BY_SLUG)) {
    for (const r of refs) {
      const doc = DOC_REGISTRY[r.doc];
      if (!doc) {
        issues.push({ file: `es/${slug}.ts`, problem: `unknown doc id "${r.doc}"` });
        continue;
      }
      const sec = doc.sections[r.section];
      if (!sec) {
        issues.push({ file: `es/${slug}.ts`, problem: `unknown section "${r.section}" in doc "${r.doc}"` });
        continue;
      }
      const docPath = resolveDocPath(doc.path);
      let body = docCache.get(docPath);
      if (body === undefined) {
        const loaded = await readDoc(docPath);
        if (loaded === null) {
          issues.push({ file: doc.path, problem: "doc not found on disk" });
          docCache.set(docPath, "");
          continue;
        }
        body = loaded;
        docCache.set(docPath, body);
      }
      if (!body.includes(sec.headingMatch)) {
        issues.push({
          file: doc.path,
          problem: `section "${r.section}" headingMatch ${JSON.stringify(sec.headingMatch)} not found in document`,
        });
      }
    }
  }

  // 4 + 5. Scan every article body for forbidden patterns.
  for (const lang of LANGS) {
    const dir = path.join(CONTENT_DIR, lang);
    let entries: string[] = [];
    try { entries = await fs.readdir(dir); } catch { continue; }
    for (const name of entries) {
      if (!name.endsWith(".ts")) continue;
      const fp = path.join(dir, name);
      const body = await fs.readFile(fp, "utf8");
      // Reset stateful regexes between invocations.
      LEGACY_SOURCES_LINE_REGEX.lastIndex = 0;
      RAW_DOCS_PATH_REGEX.lastIndex = 0;
      if (LEGACY_SOURCES_LINE_REGEX.test(body)) {
        issues.push({ file: `${lang}/${name}`, problem: "leftover legacy Sources/Fuentes line" });
      }
      RAW_DOCS_PATH_REGEX.lastIndex = 0;
      if (RAW_DOCS_PATH_REGEX.test(body)) {
        issues.push({ file: `${lang}/${name}`, problem: "raw docs/...md path visible to reader" });
      }
    }
  }

  if (issues.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`check-blog-sources: ${issues.length} issue(s) found`);
    for (const i of issues) {
      // eslint-disable-next-line no-console
      console.error(`  - ${i.file}: ${i.problem}`);
    }
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.log(`check-blog-sources: OK (${Object.keys(SOURCES_BY_SLUG).length} slugs, ${Object.keys(DOC_REGISTRY).length} docs)`);
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
