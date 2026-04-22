#!/usr/bin/env node
/**
 * Task #32 — Redirect the hub trims performed by Task #24 to sibling articles.
 *
 * Context:
 *   Task #24 (scripts/rebalance-links.mjs) capped the 6 over-concentrated hubs
 *   (form-5472, mercury, BOI, pass-through, deducibles, constituir) at 10
 *   incoming links by *unwrapping* the least-thematic hub links on source
 *   articles — `<a href=hub>X</a>` → plain `X`. That kept the prose readable
 *   but threw away 30 opportunities to pass contextual weight to a relevant
 *   sibling.
 *
 *   This one-off script reads the pre-Task-#24 version of each content file
 *   out of git, detects the exact spots the unwrap touched, and re-wraps that
 *   same anchor text with a link to a thematically-adjacent sibling article
 *   (same category where possible, otherwise a topical neighbour). The anchor
 *   text is preserved verbatim so the surrounding sentence still reads
 *   naturally — this is a prose-level edit, not a "see also" block.
 *
 *   After running, `node scripts/link-graph.mjs` should still show every hub
 *   ≤ 10 incoming, and the previously-orphaned text mentions now ship a
 *   contextual link to a sibling instead.
 *
 * Usage (from `exentax-web/`):
 *   node scripts/redirect-hub-trims.mjs
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { computeGraph } from "./link-graph.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(ROOT, "..");
const DATA = path.join(ROOT, "client/src/data");
const CONTENT = path.join(DATA, "blog-content");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const MAX_INCOMING = 10;

// The Task #24 commit. Its parent is the pre-trim reference we diff against.
const TRIM_COMMIT = "32f8803";

const HUBS = [
  "form-5472-que-es-como-presentarlo",
  "cuenta-bancaria-mercury-llc-extranjero",
  "gastos-deducibles-llc-que-puedes-deducir",
  "constituir-llc-proceso-paso-a-paso",
  "tributacion-pass-through-llc-como-funciona",
  "boi-report-fincen-guia-completa-2026",
];

// Hand-picked sibling pool per hub. Each sibling discusses the hub topic as
// part of a broader frame, so the anchor text from the trimmed hub link still
// reads naturally as a link to the sibling.
// Ordered by thematic closeness — the first sibling whose constraints hold
// (under cap, not already linked, different from hub) wins per source.
const SIBLINGS = {
  "form-5472-que-es-como-presentarlo": [
    "mantenimiento-anual-llc-obligaciones",
    "extension-irs-form-1120-como-solicitarla",
    "que-es-irs-guia-duenos-llc",
    "documentos-llc-cuales-necesitas",
    "como-operar-llc-dia-a-dia",
  ],
  "cuenta-bancaria-mercury-llc-extranjero": [
    "bancos-vs-fintech-llc-donde-abrir-cuenta",
    "due-diligence-bancario-llc-americana",
    "evitar-bloqueos-mercury-wise-revolut",
    "iban-swift-routing-number-que-son",
    "tiempos-pagos-ach-wire-transfer",
  ],
  "gastos-deducibles-llc-que-puedes-deducir": [
    "como-operar-llc-dia-a-dia",
    "tributacion-llc-segun-actividad-economica",
    "estructura-fiscal-optima-freelancer-internacional",
    "diseno-estructura-fiscal-internacional-solida",
  ],
  "constituir-llc-proceso-paso-a-paso": [
    "documentos-llc-cuales-necesitas",
    "cuanto-cuesta-constituir-llc",
    "nuevo-mexico-vs-wyoming-vs-delaware",
    "primer-mes-llc-que-esperar",
  ],
  "tributacion-pass-through-llc-como-funciona": [
    "fiscalidad-llc-por-pais-residencia",
    "residentes-no-residentes-llc-diferencias",
    "tributacion-llc-segun-actividad-economica",
    "pagar-cero-impuestos-legalmente-llc",
  ],
  "boi-report-fincen-guia-completa-2026": [
    "mantenimiento-anual-llc-obligaciones",
    "prevencion-blanqueo-capitales-llc",
    "documentos-llc-cuales-necesitas",
    "crs-cuentas-bancarias-llc-intercambio-informacion",
  ],
};

function readFile(p) { return fs.readFileSync(p, "utf8"); }
function writeFile(p, s) { fs.writeFileSync(p, s); }

function parseSlugMap() {
  const src = readFile(path.join(DATA, "blog-posts-slugs.ts"));
  const map = {};
  const objStart = src.indexOf("{", src.indexOf("BLOG_SLUG_I18N"));
  const objEnd = src.indexOf("};", objStart);
  const body = src.slice(objStart, objEnd);
  const rx = /"([^"]+)":\s*\{([^}]+)\}/g;
  let m;
  while ((m = rx.exec(body))) {
    const es = m[1];
    const entries = { es };
    const inner = /([a-z]{2}):\s*"([^"]+)"/g;
    let im;
    while ((im = inner.exec(m[2]))) entries[im[1]] = im[2];
    map[es] = entries;
  }
  return map;
}

function localSlug(esSlug, lang, slugMap) {
  if (lang === "es") return esSlug;
  return slugMap[esSlug]?.[lang] || esSlug;
}

// Read the pre-Task-#24 version of an article file out of git.
// Returns null if the file did not exist pre-trim (new article).
function gitShowOldFile(langDir, slugInLang) {
  const rel = path.relative(
    REPO_ROOT,
    path.join(CONTENT, langDir, `${slugInLang}.ts`),
  );
  try {
    return execSync(`git show ${TRIM_COMMIT}~1:${rel}`, {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

function escapeRx(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// Extract anchor text + full line pairs for every `<a href="/lang/blog/hub">X</a>`
// found in the old file's body. Returns [{ anchorText, oldLine, unwrappedLine }].
function findHubAnchorsInOldFile(oldSrc, lang, hubLocalSlug) {
  if (!oldSrc) return [];
  const lines = oldSrc.split("\n");
  const esc = escapeRx(hubLocalSlug);
  const rx = new RegExp(
    `<a\\b[^>]*href=["']/${lang}/blog/${esc}(?:/)?(?:[#?][^"']*)?["'][^>]*>([\\s\\S]*?)</a>`,
    "g",
  );
  const hits = [];
  for (const oldLine of lines) {
    const matches = [...oldLine.matchAll(rx)];
    if (!matches.length) continue;
    // Simulate the Task #24 unwrap: strip the hub anchor only, keep the rest.
    const unwrappedLine = oldLine.replace(rx, (_, text) => text);
    for (const m of matches) {
      hits.push({ anchorText: m[1], oldLine, unwrappedLine });
    }
  }
  return hits;
}

// A source/hub pair was "trimmed" if the old file had hub anchors but the
// current file has none pointing at that hub (in the same language).
function currentHasHubLink(currSrc, lang, hubLocalSlug) {
  const esc = escapeRx(hubLocalSlug);
  const rx = new RegExp(
    `<a\\b[^>]*href=["']/${lang}/blog/${esc}(?:/)?(?:[#?][^"']*)?["'][^>]*>`,
  );
  return rx.test(currSrc);
}

function hashPick(key, modulo) {
  const h = crypto.createHash("sha1").update(key).digest();
  return h[0] % modulo;
}

// Projected ES-incoming count per sibling slug, seeded from the *current*
// graph (post-unwrap, pre-redirect). We use this to keep any sibling from
// being pushed above the 10-incoming cap by this script.
const siblingProjected = {};
function chooseSibling(hubSlug, sourceEsSlug, excludeEsSlugs) {
  const pool = SIBLINGS[hubSlug] || [];
  const eligible = pool.filter(
    (s) =>
      s !== sourceEsSlug &&
      !excludeEsSlugs.has(s) &&
      (siblingProjected[s] ?? 0) < MAX_INCOMING,
  );
  if (!eligible.length) return null;
  // Prefer siblings with the lowest projected incoming — keeps the cap and
  // naturally lifts under-linked articles.
  eligible.sort((a, b) => {
    const la = siblingProjected[a] ?? 0;
    const lb = siblingProjected[b] ?? 0;
    if (la !== lb) return la - lb;
    // Tiebreak deterministically by source-slug hash so re-runs are stable.
    const ha = hashPick(`${sourceEsSlug}:${a}`, 997);
    const hb = hashPick(`${sourceEsSlug}:${b}`, 997);
    return ha - hb;
  });
  const pick = eligible[0];
  return pick;
}

function rewrapInBody(body, anchorText, hubLocalSlug, lang, siblingLocalSlug, unwrappedLine) {
  // Locate the specific line we need to edit. Prefer an exact match of the
  // unwrapped-line content; fall back to any line that still contains the
  // anchor text if the line drifted (e.g., neighbouring BOOST insertion).
  const lines = body.split("\n");
  let idx = lines.indexOf(unwrappedLine);
  if (idx < 0) {
    // Trimmed line should still contain the raw anchor text verbatim.
    idx = lines.findIndex(
      (ln) =>
        ln.includes(anchorText) &&
        !ln.includes(`/${lang}/blog/${hubLocalSlug}`) &&
        !ln.includes(`/${lang}/blog/${siblingLocalSlug}`),
    );
  }
  if (idx < 0) return { body, ok: false };

  const line = lines[idx];
  // Don't double-wrap: if this anchor text is already inside a link on this
  // line, skip. (Protects against repeated runs.)
  const wrappedRx = new RegExp(
    `<a\\b[^>]*>[^<]*${escapeRx(anchorText)}[^<]*</a>`,
  );
  if (wrappedRx.test(line)) {
    // Could already have been redirected to a different sibling; treat as ok.
    return { body, ok: true, skipped: true };
  }

  const replacement = `<a href="/${lang}/blog/${siblingLocalSlug}">${anchorText}</a>`;
  const at = line.indexOf(anchorText);
  if (at < 0) return { body, ok: false };
  const newLine = line.slice(0, at) + replacement + line.slice(at + anchorText.length);
  lines[idx] = newLine;
  return { body: lines.join("\n"), ok: true };
}

// Parse an article file in the form `export default \`...\`;`
function parseArticleFile(p) {
  const src = readFile(p);
  const tickStart = src.indexOf("`");
  if (tickStart < 0) throw new Error("No backtick in " + p);
  let i = tickStart + 1;
  while (i < src.length) {
    if (src[i] === "\\") { i += 2; continue; }
    if (src[i] === "`") break;
    i++;
  }
  return { src, bodyStart: tickStart + 1, bodyEnd: i, body: src.slice(tickStart + 1, i) };
}
function parseOldArticleBody(oldSrc) {
  const tickStart = oldSrc.indexOf("`");
  if (tickStart < 0) return null;
  let i = tickStart + 1;
  while (i < oldSrc.length) {
    if (oldSrc[i] === "\\") { i += 2; continue; }
    if (oldSrc[i] === "`") break;
    i++;
  }
  return oldSrc.slice(tickStart + 1, i);
}

function articleFiles(lang) {
  const dir = path.join(CONTENT, lang);
  return fs.readdirSync(dir).filter((f) => f.endsWith(".ts")).sort()
    .map((f) => ({ slugInLang: f.replace(/\.ts$/, ""), file: path.join(dir, f) }));
}

function esSlugForLangSlug(lang, slugInLang, slugMap) {
  if (lang === "es") return slugInLang;
  for (const [es, m] of Object.entries(slugMap)) {
    if (m[lang] === slugInLang) return es;
  }
  return slugInLang;
}

// Idempotent reset: if a previous run of this script wrapped an anchor with
// a sibling link, unwrap it so we can redo the sibling choice under the
// current constraints. We only touch anchors whose text matches an old
// hub-anchor on this same source, and whose href lands in the known sibling
// pool — so unrelated editorial links are never disturbed.
function undoPreviousRedirects(body, lang, oldHits, hubEs, slugMap) {
  const pool = SIBLINGS[hubEs] || [];
  for (const sib of pool) {
    const sibLocal = localSlug(sib, lang, slugMap);
    const escSib = escapeRx(sibLocal);
    for (const hit of oldHits) {
      const escTxt = escapeRx(hit.anchorText);
      const rx = new RegExp(
        `<a\\b[^>]*href=["']/${lang}/blog/${escSib}(?:/)?(?:[#?][^"']*)?["'][^>]*>(${escTxt})</a>`,
        "g",
      );
      body = body.replace(rx, (_, txt) => txt);
    }
  }
  return body;
}

function main() {
  const slugMap = parseSlugMap();

  const report = {
    perLang: {},
    perHub: Object.fromEntries(HUBS.map((h) => [h, 0])),
    redirects: [],
  };

  // PASS 0 — Undo any previous sibling redirects so this script is
  // idempotent and we can (re-)plan with cap-aware logic on every run.
  for (const lang of LANGS) {
    for (const { slugInLang, file } of articleFiles(lang)) {
      const curr = parseArticleFile(file);
      const oldSrc = gitShowOldFile(lang, slugInLang);
      if (!oldSrc) continue;
      const oldBody = parseOldArticleBody(oldSrc);
      if (!oldBody) continue;

      let newBody = curr.body;
      for (const hubEs of HUBS) {
        const hubLocal = localSlug(hubEs, lang, slugMap);
        const oldHits = findHubAnchorsInOldFile(oldBody, lang, hubLocal);
        if (!oldHits.length) continue;
        // Only undo for source/hub pairs that were actually trimmed — i.e.
        // the source article no longer links back to the hub directly.
        if (currentHasHubLink(newBody, lang, hubLocal)) continue;
        newBody = undoPreviousRedirects(newBody, lang, oldHits, hubEs, slugMap);
      }
      if (newBody !== curr.body) {
        const out = curr.src.slice(0, curr.bodyStart) + newBody + curr.src.slice(curr.bodyEnd);
        writeFile(file, out);
      }
    }
  }

  // PASS 1 — Seed projected incoming counts from the CURRENT graph (post-undo
  // and post-Task-#24-trim), then plan redirects while respecting the cap.
  const graph = computeGraph();
  for (const es of graph.allEsSlugs) {
    siblingProjected[es] = graph.incomingTotal[es] || 0;
  }

  // PASS 2 — Plan the redirect decisions once on the ES content. The choice
  // of sibling for each (source, hub) pair must be identical across all six
  // languages, otherwise the link topology drifts per language.
  //   plan[sourceEs][hubEs] = siblingEs
  const plan = {};
  {
    const esFiles = articleFiles("es");
    for (const { slugInLang: esSlug, file } of esFiles) {
      const curr = parseArticleFile(file);
      const oldSrc = gitShowOldFile("es", esSlug);
      if (!oldSrc) continue;
      const oldBody = parseOldArticleBody(oldSrc);
      if (!oldBody) continue;

      const alreadyLinksEs = new Set();
      for (const otherEs of Object.keys(slugMap)) {
        const esc = escapeRx(otherEs);
        const rx = new RegExp(`href=["']/es/blog/${esc}(?:/)?(?:[#?][^"']*)?["']`);
        if (rx.test(curr.body)) alreadyLinksEs.add(otherEs);
      }

      for (const hubEs of HUBS) {
        if (hubEs === esSlug) continue;
        const oldHits = findHubAnchorsInOldFile(oldBody, "es", hubEs);
        if (!oldHits.length) continue;
        if (currentHasHubLink(curr.body, "es", hubEs)) continue;

        const excludeEsSlugs = new Set([...alreadyLinksEs, ...HUBS]);
        const sibling = chooseSibling(hubEs, esSlug, excludeEsSlugs);
        if (!sibling) continue;

        (plan[esSlug] ||= {})[hubEs] = sibling;
        alreadyLinksEs.add(sibling);
        siblingProjected[sibling] = (siblingProjected[sibling] ?? 0) + 1;
      }
    }
  }

  // PASS 3 — Apply the planned redirects to every language.
  for (const lang of LANGS) {
    let patched = 0;
    let skipped = 0;
    const files = articleFiles(lang);

    for (const { slugInLang, file } of files) {
      const esSlug = esSlugForLangSlug(lang, slugInLang, slugMap);
      const curr = parseArticleFile(file);

      // Fetch pre-trim old file content.
      const oldSrc = gitShowOldFile(lang, slugInLang);
      if (!oldSrc) continue;
      const oldBody = parseOldArticleBody(oldSrc);
      if (!oldBody) continue;

      // Precompute which hubs this article already links to in the current
      // state — we must not redirect to a sibling the source already links to.
      const alreadyLinks = new Set();
      for (const otherEs of Object.keys(slugMap)) {
        const loc = localSlug(otherEs, lang, slugMap);
        const esc = escapeRx(loc);
        const rx = new RegExp(`href=["']/${lang}/blog/${esc}(?:/)?(?:[#?][^"']*)?["']`);
        if (rx.test(curr.body)) alreadyLinks.add(otherEs);
      }

      let newBody = curr.body;

      const sourcePlan = plan[esSlug] || {};
      for (const hubEs of HUBS) {
        if (hubEs === esSlug) continue;
        const hubLocal = localSlug(hubEs, lang, slugMap);
        const oldHits = findHubAnchorsInOldFile(oldBody, lang, hubLocal);
        if (!oldHits.length) continue;
        if (currentHasHubLink(newBody, lang, hubLocal)) continue;

        const sibling = sourcePlan[hubEs];
        if (!sibling) continue;
        // A non-ES language may already link to the planned sibling (different
        // editorial history); if so, pick a fallback within the same pool so
        // we still land SEO weight somewhere sensible. Otherwise, skip and
        // leave the unwrapped prose as Task #24 left it.
        let effectiveSibling = sibling;
        if (alreadyLinks.has(sibling)) {
          const alt = (SIBLINGS[hubEs] || []).find(
            (s) => s !== esSlug && !HUBS.includes(s) && !alreadyLinks.has(s),
          );
          if (!alt) continue;
          effectiveSibling = alt;
        }
        const siblingLocal = localSlug(effectiveSibling, lang, slugMap);

        // Rewrap every unwrapped anchor occurrence for this hub on this
        // source (there may be several; all get the same sibling target, so
        // the redirect feels like a single editorial decision).
        let rewroteSomething = false;
        for (const hit of oldHits) {
          const result = rewrapInBody(
            newBody,
            hit.anchorText,
            hubLocal,
            lang,
            siblingLocal,
            hit.unwrappedLine,
          );
          if (result.ok && !result.skipped) {
            newBody = result.body;
            rewroteSomething = true;
          } else if (result.ok && result.skipped) {
            // Already wrapped — nothing to do.
          } else {
            skipped++;
          }
        }

        if (rewroteSomething) {
          alreadyLinks.add(effectiveSibling);
          report.perHub[hubEs]++;
          report.redirects.push({
            lang,
            source: esSlug,
            hub: hubEs,
            sibling: effectiveSibling,
          });
        }
      }

      if (newBody !== curr.body) {
        const out = curr.src.slice(0, curr.bodyStart) + newBody + curr.src.slice(curr.bodyEnd);
        writeFile(file, out);
        patched++;
      }
    }

    report.perLang[lang] = { patched, skipped };
    console.log(`[${lang}] redirect: patched ${patched} files, skipped ${skipped} sites`);
  }

  // Group redirects by (hub, sibling) for a concise summary.
  const bySibling = {};
  for (const r of report.redirects) {
    const k = `${r.hub}::${r.sibling}`;
    bySibling[k] = (bySibling[k] || 0) + 1;
  }
  console.log("\nRedirects per hub:");
  for (const [h, n] of Object.entries(report.perHub)) {
    console.log(`  ${h}: ${n}`);
  }
  console.log("\nRedirects per (hub → sibling), across all languages:");
  for (const [k, n] of Object.entries(bySibling).sort()) {
    console.log(`  ${k}: ${n}`);
  }
}

main();
