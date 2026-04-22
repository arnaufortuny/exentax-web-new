#!/usr/bin/env node
/*
 * blog-link-locale-lint.mjs
 * ----------------------------------------------------------------------------
 * Guard that audits internal blog links inside non-Spanish article files and
 * blocks any link that would send a reader to a different language mid-article.
 *
 * What it checks
 * --------------
 * For every article file under:
 *   client/src/data/blog-content/{fr,de,pt,ca,en}/*.ts
 *
 * the script flags any `href="..."` (or single-quoted) whose path targets the
 * blog in the *wrong* language. Specifically, inside an fr article only
 * `/fr/blog/...` links are allowed; inside a de article only `/de/blog/...`,
 * and so on. Bare `/blog/...` links (no language prefix) are also flagged
 * because the Spanish site uses that path and they would leak readers into
 * Spanish copy mid-article.
 *
 * External URLs (https://…) and non-blog internal links (e.g. `/fr/contacto`,
 * `/herramientas/...`) are intentionally left alone — this guard only cares
 * about blog-to-blog internal links.
 *
 * Exit code
 * ---------
 *  0  no findings
 *  1  one or more cross-language blog links detected
 *
 * Usage
 * -----
 *  node scripts/blog-link-locale-lint.mjs          # from exentax-web/
 * ----------------------------------------------------------------------------
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = resolve(__dirname, "..");
const BLOG_CONTENT_DIR = join(REPO_DIR, "client", "src", "data", "blog-content");

const LOCALES = ["fr", "de", "pt", "ca", "en"];

// Matches href="/xx/blog/..." or href='/blog/...' (any path beginning with / and
// pointing somewhere blog-related). We then decide per-match whether the
// language prefix matches the folder the file lives in.
const HREF_RE = /href\s*=\s*(["'])(\/[^"'\s]*)\1/g;

// Paths considered "blog internal" — we audit these against the folder locale.
// Anything else (e.g. /fr/contacto, /herramientas/...) is ignored.
function classifyPath(path) {
  // bare /blog/... — Spanish site path, will leak a non-Spanish reader into es
  if (/^\/blog\//.test(path)) return { kind: "bare-blog" };
  // /xx/blog/... — check the prefix against the file's folder locale
  const m = path.match(/^\/([a-z]{2})\/blog\//);
  if (m) return { kind: "locale-blog", locale: m[1] };
  return { kind: "other" };
}

function listArticleFiles(localeDir) {
  if (!statSync(localeDir, { throwIfNoEntry: false })?.isDirectory()) return [];
  return readdirSync(localeDir)
    .filter((name) => name.endsWith(".ts"))
    .map((name) => join(localeDir, name))
    .filter((path) => statSync(path).isFile());
}

export function analyzeText(text, expectedLocale) {
  const findings = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    HREF_RE.lastIndex = 0;
    let match;
    while ((match = HREF_RE.exec(line)) !== null) {
      const path = match[2];
      const info = classifyPath(path);
      if (info.kind === "bare-blog") {
        findings.push({
          line: i + 1,
          text: line.trim(),
          path,
          reason: `bare /blog/ link (leaks into Spanish site) — expected /${expectedLocale}/blog/`,
        });
      } else if (info.kind === "locale-blog" && info.locale !== expectedLocale) {
        findings.push({
          line: i + 1,
          text: line.trim(),
          path,
          reason: `cross-language link to /${info.locale}/blog/ — expected /${expectedLocale}/blog/`,
        });
      }
    }
  }
  return findings;
}

function scanFile(filePath, expectedLocale) {
  return analyzeText(readFileSync(filePath, "utf8"), expectedLocale);
}

function format(filePath, finding) {
  const rel = relative(REPO_DIR, filePath);
  return `${rel}:${finding.line}  ${finding.reason}\n    -> ${finding.path}\n    ${finding.text}`;
}

export { LOCALES, classifyPath };

function main() {
  let total = 0;
  let filesScanned = 0;

  for (const locale of LOCALES) {
    const dir = join(BLOG_CONTENT_DIR, locale);
    const files = listArticleFiles(dir);
    for (const file of files) {
      filesScanned += 1;
      const findings = scanFile(file, locale);
      for (const f of findings) {
        total += 1;
        console.log(format(file, f));
      }
    }
  }

  if (filesScanned === 0) {
    console.error(`[blog-link-locale-lint] No article files found under ${BLOG_CONTENT_DIR}`);
    process.exit(2);
  }

  if (total > 0) {
    console.error(
      `\n[blog-link-locale-lint] FAIL — ${total} cross-language blog link${total === 1 ? "" : "s"} found across ${filesScanned} file${filesScanned === 1 ? "" : "s"}.`,
    );
    process.exit(1);
  }

  console.log(
    `[blog-link-locale-lint] OK — scanned ${filesScanned} article file${filesScanned === 1 ? "" : "s"}, every internal blog link matches its folder locale.`,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main();
}
