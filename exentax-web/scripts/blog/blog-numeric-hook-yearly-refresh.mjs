#!/usr/bin/env node
/**
 * Task #39 — Yearly refresh of the topical numbers cited in each article lead.
 *
 * The 672 stat-lead sentences injected by LOTE 6 are anchored to figures from
 * the LOTE 5 verified-figures corpus (IRPF brackets, RETA quotas, IRS Form
 * 5472 penalty, Wyoming filing fee, Amazon GMV, BOI civil penalty inflation
 * adjustment, etc.). Several of those figures change every January (Spanish
 * tax tables get the new RDL, IRS announces inflation-adjusted §6038A
 * penalties, state Secretary-of-State fees update). Without a yearly process
 * the leads start drifting from current law within 12 months and the
 * credibility of the numeric hook erodes.
 *
 * What this script does
 * ---------------------
 * 1. Walks every (slug × lang) entry in `scripts/blog/data/article-numeric-
 *    hooks.json` and extracts its anchor signals: 4-digit years (2020-2030),
 *    USD/EUR/AED/GBP amounts, percentages and BOI-style day counts.
 * 2. Cross-references each hook against the 18 canonical facts in
 *    `reports/seo/lote5-veracidad.json` using slug-based ownership and
 *    keyword pattern matching, so each hook has a list of facts it cites
 *    and the official source URL(s) the editor must re-check against.
 * 3. Confirms that the JSON hook string is currently embedded as the first
 *    paragraph of each article (i.e., that nothing has drifted in
 *    `client/src/data/blog-content/<lang>/<slug>.ts`).
 * 4. Emits a yearly checklist: per-slug rows showing the hook (ES), the
 *    detected anchor numbers, the canonical facts cited and the official
 *    sources where the editor must re-verify the figure for the new tax
 *    year. Stale year markers (≤ current year - 1) are flagged.
 * 5. Optional `--write-report` updates `reports/seo/lote6-numeric-hook.md`
 *    with the audit timestamp and the latest figures so future audits have
 *    a running ledger.
 *
 * Usage
 * -----
 *   node scripts/blog/blog-numeric-hook-yearly-refresh.mjs                 # checklist to stdout
 *   node scripts/blog/blog-numeric-hook-yearly-refresh.mjs --year 2027     # treat 2026 anchors as stale
 *   node scripts/blog/blog-numeric-hook-yearly-refresh.mjs --write-report  # update lote6-numeric-hook.md
 *   node scripts/blog/blog-numeric-hook-yearly-refresh.mjs --json          # machine-readable output
 *
 * Exit code: 0 on a clean run; 1 if any hook is missing from its article
 * (i.e., drift between JSON and the on-disk lead) so this can be wired into
 * CI as a future regression gate.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSnapshot, getSnapshotEntry } from "./lib/article-hook-snapshot.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const CONTENT_ROOT = path.join(PROJECT_ROOT, "client", "src", "data", "blog-content");
const HOOKS_PATH = path.join(__dirname, "data", "article-numeric-hooks.json");
const VERACITY_JSON = path.join(PROJECT_ROOT, "reports", "seo", "lote5-veracidad.json");
const REPORT_MD = path.join(PROJECT_ROOT, "reports", "seo", "lote6-numeric-hook.md");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

// Task #42: load the per-injection footprint. When present, the snapshot is
// authoritative — a snapshot match means we wrote that paragraph, a snapshot
// mismatch means we wrote it and someone changed it (= drift_real). When the
// snapshot has no entry for a (slug, lang) we fall back to the legacy
// "looks like a hook" heuristic, but downgrade those findings to
// `heuristic_candidate` (informational only, never fails the build).
const HOOK_SNAPSHOT = loadSnapshot();

const args = new Set(process.argv.slice(2));
const wantWrite = args.has("--write-report");
const wantJson = args.has("--json");
const referenceYear = (() => {
  const idx = process.argv.indexOf("--year");
  if (idx > 0 && process.argv[idx + 1]) return parseInt(process.argv[idx + 1], 10);
  return new Date().getFullYear();
})();

const HOOKS = JSON.parse(fs.readFileSync(HOOKS_PATH, "utf8"));
const VERACITY = fs.existsSync(VERACITY_JSON)
  ? JSON.parse(fs.readFileSync(VERACITY_JSON, "utf8"))
  : { factResults: [] };

// Build slug → facts owned (from veracity report) and a topical keyword map.
const SLUG_TO_FACTS = new Map();
const FACTS = VERACITY.factResults.map((r) => ({
  id: r.fact.id,
  label: r.fact.label,
  canonical: r.fact.canonical,
  source: r.fact.source,
  owners: r.fact.owners || [],
}));
for (const f of FACTS) {
  for (const slug of f.owners) {
    if (!SLUG_TO_FACTS.has(slug)) SLUG_TO_FACTS.set(slug, []);
    SLUG_TO_FACTS.get(slug).push(f.id);
  }
}

// Topical keyword patterns — matches a fact ID when the (Spanish) hook text
// mentions the topic. Lets us tag non-pillar slugs that cite a canonical
// figure passingly.
const KEYWORD_PATTERNS = [
  { factId: "form-5472-penalty", re: /(form\s*5472|5472).{0,80}(25\.000|25,000)/i },
  { factId: "form-5472-deadline", re: /(form\s*5472|7004).{0,80}(15 de abril|abril|octubre|7004)/i },
  { factId: "modelo-720-threshold", re: /modelo\s*720.{0,80}50\.000/i },
  { factId: "modelo-720-tjue", re: /(STJUE|C-788|sentencia.{0,30}TJUE)/i },
  { factId: "modelo-721", re: /modelo\s*721/i },
  { factId: "boi-fincen-scope-2025", re: /(BOI|FinCEN).{0,120}(foreign reporting|interim final|marzo de 2025)/i },
  { factId: "boi-deadline", re: /(BOI|FinCEN).{0,120}(30 d[ií]as|591|14\.778)/i },
  { factId: "reta-tarifa-plana-80", re: /(tarifa plana|80 ?€).{0,40}(autón|RETA)/i },
  { factId: "reta-tabla-2026", re: /(RETA|cuota|autón).{0,80}(200 ?€|604|590|1\.600)/i },
  { factId: "irpf-tramo-top-2026", re: /(IRPF|marginal).{0,80}(45|47|24,5|300\.000)/i },
  { factId: "dac7-minimis", re: /DAC7.{0,80}(30 (operaciones|transacciones)|2\.000)/i },
  { factId: "dac8-entry-2026", re: /DAC8/i },
  { factId: "crs-us-status", re: /(CRS|FATCA).{0,80}(USA|Estados Unidos|EE\.?UU\.?)/i },
  { factId: "wyoming-annual-60", re: /Wyoming.{0,80}(60 ?\$|60 ?USD|annual report)/i },
  { factId: "delaware-franchise-300", re: /Delaware.{0,80}(300 ?\$|300 ?USD|franchise)/i },
  { factId: "florida-annual-may1", re: /(Florida|Sunbiz).{0,80}(1 de mayo|may 1|annual report)/i },
  { factId: "newmexico-no-annual", re: /(New Mexico|NM).{0,80}(50 ?\$|50 ?USD|sin annual|no annual)/i },
];

const FACT_BY_ID = new Map(FACTS.map((f) => [f.id, f]));

function detectFacts(slug, hookText) {
  const ids = new Set(SLUG_TO_FACTS.get(slug) || []);
  for (const p of KEYWORD_PATTERNS) {
    if (p.re.test(hookText)) ids.add(p.factId);
  }
  return [...ids];
}

function extractAnchors(text) {
  const years = [...text.matchAll(/\b(20\d{2})\b/g)].map((m) => parseInt(m[1], 10));
  const usd = [
    ...text.matchAll(/(\d[\d.,]*)\s*(?:USD|\$)/g),
    ...text.matchAll(/\$\s*(\d[\d.,]*)/g),
  ].map((m) => m[1]);
  const eur = [...text.matchAll(/(\d[\d.,]*)\s*(?:€|EUR|euros?)/gi)].map((m) => m[1]);
  const aed = [...text.matchAll(/(\d[\d.,]*)\s*AED/g)].map((m) => m[1]);
  const pct = [...text.matchAll(/(\d[\d.,]*)\s*%/g)].map((m) => m[1]);
  const days = [...text.matchAll(/(\d+)\s*d[ií]as?/g)].map((m) => parseInt(m[1], 10));
  return {
    years: [...new Set(years)].sort((a, b) => a - b),
    usd: [...new Set(usd)],
    eur: [...new Set(eur)],
    aed: [...new Set(aed)],
    pct: [...new Set(pct)],
    days: [...new Set(days)].sort((a, b) => a - b),
  };
}

function readArticleFirstParagraphAndLead(slug, lang) {
  const fp = path.join(CONTENT_ROOT, lang, `${slug}.ts`);
  if (!fs.existsSync(fp)) return null;
  const raw = fs.readFileSync(fp, "utf8");
  const m = raw.match(/^.*export default `([\s\S]*?)`;?\s*$/);
  if (!m) return null;
  const body = m[1].replace(/^\s+/, "");
  const splitIdx = body.indexOf("\n\n");
  const firstPara = (splitIdx >= 0 ? body.slice(0, splitIdx) : body).trim();
  // Match the same lead-extraction rule used by blog-add-numeric-hook.mjs
  const beforeHeading = body.split(/^##\s/m)[0];
  const stripped = beforeHeading
    .replace(/<a [^>]*>/g, "")
    .replace(/<\/a>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const first100 = stripped.split(/\s+/).slice(0, 100).join(" ");
  return { firstPara, leadHasDigit: /\d/.test(first100) };
}

const auditRows = [];
// drift_real: snapshot has a footprint for (slug, lang) but the on-disk first
// paragraph no longer matches the recorded text — i.e., we injected something
// and then the article changed. Resolve with `--replace-existing --slug`.
const driftReal = [];
// heuristic_candidate: no snapshot footprint, but the first paragraph is
// short, single-line, contains a digit and ≠ JSON. Could be a pre-snapshot
// hook the editor changed, OR a legitimate native numeric lead. Informational
// only — does NOT fail the build.
const heuristicCandidate = [];
const needsInjection = []; // lead has no digit and JSON hook is missing → run default mode
const summary = {
  slugs: 0,
  hooks: 0,
  injectedAndCurrent: 0,
  dormantNativeLead: 0,
  needsInjection: 0,
  driftReal: 0,
  heuristicCandidate: 0,
  staleYearAnchors: 0,
  // Snapshot health:
  snapshotEntries: 0,
  snapshotConfirmed: 0, // snapshot text === on-disk first paragraph
};

const slugs = Object.keys(HOOKS).sort();
for (const slug of slugs) {
  summary.slugs += 1;
  const langHooks = HOOKS[slug];
  const esHook = langHooks.es || "";
  const anchors = extractAnchors(esHook);
  const factIds = detectFacts(slug, esHook);
  const sources = factIds
    .map((id) => FACT_BY_ID.get(id))
    .filter(Boolean)
    .map((f) => ({ id: f.id, label: f.label, source: f.source }));

  // Per-language classification (Task #42 priority order):
  //   1. snapshot match  → injected (we wrote this paragraph, JSON unchanged)
  //   2. snapshot diff   → drift_real (we wrote it, JSON or paragraph moved)
  //   3. no snapshot, paragraph == JSON → injected (legacy, pre-snapshot)
  //   4. no snapshot, looks like a hook but != JSON → heuristic_candidate
  //   5. no snapshot, lead has digit                → dormant_native
  //   6. no snapshot, lead has no digit             → needs-injection
  //
  // Only buckets 2 and 6 fail the build (drift_real + needs-injection).
  // Bucket 4 is informational and never fails — it includes legitimate
  // human-written numeric leads that the old heuristic mis-flagged as drift.
  const langStatus = {};
  let injectedHere = 0;
  for (const lang of LANGS) {
    const expected = (langHooks[lang] || "").trim();
    if (!expected) continue;
    summary.hooks += 1;
    const info = readArticleFirstParagraphAndLead(slug, lang);
    if (!info) continue;

    // Step 1 — snapshot lookup (Task #42, authoritative). If a footprint
    // exists for (slug, lang), the answer is binary:
    //   - on-disk first paragraph === footprint text → injected (no drift)
    //   - on-disk first paragraph !== footprint text → drift_real (the
    //     editor changed a paragraph we wrote, or the JSON was bumped without
    //     re-running --replace-existing)
    const snap = getSnapshotEntry(HOOK_SNAPSHOT, slug, lang);
    if (snap) {
      summary.snapshotEntries += 1;
      if (info.firstPara === snap.text) {
        summary.snapshotConfirmed += 1;
        if (info.firstPara === expected) {
          injectedHere += 1;
          summary.injectedAndCurrent += 1;
          langStatus[lang] = "injected";
        } else {
          // Footprint matches on-disk but JSON has moved past it (e.g. yearly
          // RDL bump). The footprint is the proof we own this paragraph;
          // re-run `--replace-existing --slug` to bring it to the new value.
          summary.driftReal += 1;
          langStatus[lang] = "drift_real";
          driftReal.push({
            slug,
            lang,
            reason: "json_moved",
            expected: expected.slice(0, 100),
            onDisk: info.firstPara.slice(0, 100),
            injectedAt: snap.injectedAt,
          });
        }
      } else {
        summary.driftReal += 1;
        langStatus[lang] = "drift_real";
        driftReal.push({
          slug,
          lang,
          reason: "edited_after_injection",
          expected: expected.slice(0, 100),
          onDisk: info.firstPara.slice(0, 100),
          injectedAt: snap.injectedAt,
        });
      }
      continue;
    }

    // Step 2 — fallback heuristic (no footprint on file). Three buckets:
    //   - injected: first paragraph already matches the JSON verbatim (a
    //     hook the injector wrote before snapshot tracking existed; a future
    //     `--seed-snapshot` pass will stamp it).
    //   - heuristic_candidate: short, single-line, digit-bearing first
    //     paragraph that ≠ JSON. Could be a pre-snapshot hook OR a native
    //     numeric lead. Informational only.
    //   - dormant: article has its own numeric lead, JSON hook never used.
    //   - needs-injection: no digit at all in the lead.
    const HOOK_MAX_LEN = 320;
    const looksLikeInjectedHook =
      info.firstPara.length <= HOOK_MAX_LEN &&
      !info.firstPara.includes("\n") &&
      /\d/.test(info.firstPara);

    if (info.firstPara === expected) {
      injectedHere += 1;
      summary.injectedAndCurrent += 1;
      langStatus[lang] = "injected";
    } else if (looksLikeInjectedHook) {
      summary.heuristicCandidate += 1;
      langStatus[lang] = "heuristic_candidate";
      heuristicCandidate.push({
        slug,
        lang,
        expected: expected.slice(0, 100),
        onDisk: info.firstPara.slice(0, 100),
      });
    } else if (info.leadHasDigit) {
      summary.dormantNativeLead += 1;
      langStatus[lang] = "dormant";
    } else {
      summary.needsInjection += 1;
      langStatus[lang] = "needs-injection";
      needsInjection.push({ slug, lang, expected: expected.slice(0, 100) });
    }
  }

  // Stale year heuristic: any year anchor older than referenceYear - 1.
  // E.g., for referenceYear = 2026, anchors at 2024 or earlier flag for review;
  // a 2026 anchor remains fresh until January, when referenceYear becomes 2027
  // and a 2025 anchor becomes stale.
  const staleYears = anchors.years.filter((y) => y <= referenceYear - 2);
  if (staleYears.length > 0) summary.staleYearAnchors += staleYears.length;

  auditRows.push({
    slug,
    esHook,
    anchors,
    facts: sources,
    langStatus,
    injectedHere,
    staleYears,
  });
}

// ---- Output ---------------------------------------------------------------

if (wantJson) {
  console.log(
    JSON.stringify(
      {
        runDate: new Date().toISOString(),
        referenceYear,
        summary,
        auditRows,
        driftReal,
        heuristicCandidate,
        needsInjection,
      },
      null,
      2,
    ),
  );
} else {
  console.log("=== Task #39 — Yearly refresh of numeric-hook figures ===");
  console.log(`Reference year (anchors ≤ ${referenceYear - 2} flagged stale): ${referenceYear}`);
  console.log(`Slugs in JSON: ${summary.slugs}`);
  console.log(`Hooks (slug × lang): ${summary.hooks}`);
  console.log(
    `Snapshot footprints loaded: ${summary.snapshotEntries} (${summary.snapshotConfirmed} match on-disk paragraph)`,
  );
  console.log(`  ✓ Injected and current (verbatim at top of article): ${summary.injectedAndCurrent}`);
  console.log(`  · Dormant — article has its own native numeric lead: ${summary.dormantNativeLead}`);
  console.log(`  ✏ Needs injection (lead has no digit, hook missing): ${summary.needsInjection}`);
  console.log(`  ✗ Drift real (snapshot proves we wrote it, paragraph or JSON moved): ${summary.driftReal}`);
  console.log(`  ? Heuristic candidate (no snapshot, looks like a hook but ≠ JSON — informational): ${summary.heuristicCandidate}`);
  console.log(`  ⚠ Stale year anchors (≤ ${referenceYear - 2}): ${summary.staleYearAnchors}`);

  if (needsInjection.length > 0) {
    console.log(`\nNeeds injection (run: node scripts/blog/blog-add-numeric-hook.mjs):`);
    for (const d of needsInjection.slice(0, 20)) {
      console.log(`  - ${d.lang}/${d.slug}.ts`);
    }
    if (needsInjection.length > 20) console.log(`  … (+${needsInjection.length - 20} more)`);
  }
  if (driftReal.length > 0) {
    console.log(
      `\nDrift real — snapshot footprint exists, action required (run: node scripts/blog/blog-add-numeric-hook.mjs --replace-existing --slug <slug>):`,
    );
    for (const d of driftReal.slice(0, 20)) {
      console.log(`  - ${d.lang}/${d.slug}.ts  [${d.reason}, injectedAt=${d.injectedAt}]`);
      console.log(`      JSON   : "${d.expected}…"`);
      console.log(`      on-disk: "${d.onDisk}…"`);
    }
    if (driftReal.length > 20) console.log(`  … (+${driftReal.length - 20} more)`);
  }
  if (heuristicCandidate.length > 0) {
    console.log(
      `\nHeuristic candidates — no snapshot footprint, paragraph looks like a hook but differs from JSON. Informational only (likely native numeric leads). Resolve by either accepting the editor's lead or running --seed-snapshot once you confirm we own them:`,
    );
    for (const d of heuristicCandidate.slice(0, 10)) {
      console.log(`  - ${d.lang}/${d.slug}.ts`);
      console.log(`      JSON   : "${d.expected}…"`);
      console.log(`      on-disk: "${d.onDisk}…"`);
    }
    if (heuristicCandidate.length > 10) console.log(`  … (+${heuristicCandidate.length - 10} more)`);
  }
  if (summary.staleYearAnchors > 0) {
    console.log("\nStale-year anchors (slug → years, sources):");
    for (const r of auditRows.filter((x) => x.staleYears.length > 0)) {
      const facts = r.facts.length > 0 ? r.facts.map((f) => f.id).join(", ") : "(no canonical fact mapped)";
      console.log(`  - ${r.slug}: years ${r.staleYears.join(",")} | ${facts}`);
    }
  }
}

// ---- Optional report writer ----------------------------------------------

if (wantWrite) {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [];
  lines.push("# LOTE 6 — Numeric-hook audit log");
  lines.push("");
  lines.push(
    `Última auditoría: **${today}** · Reference year: **${referenceYear}** · Script: \`scripts/blog/blog-numeric-hook-yearly-refresh.mjs\``,
  );
  lines.push("");
  lines.push(
    "Este informe es el ledger anual de las cifras topicales que abren los 672 leads (112 slugs × 6 idiomas) inyectados por LOTE 6. Cada enero, tras la publicación del RDL de cuotas RETA, la actualización de tipos del IRPF estatal en la Ley de PGE y el ajuste por inflación de las multas IRC §6038A (Form 5472), debe re-validarse cada figura contra su fuente oficial primaria.",
  );
  lines.push("");
  lines.push("## 1. Resumen ejecutivo");
  lines.push("");
  lines.push(`- Slugs con hook definido: **${summary.slugs}**`);
  lines.push(`- Total de hooks (slug × lang): **${summary.hooks}**`);
  lines.push(`- ✓ Inyectados y vigentes (verbatim como primer párrafo): **${summary.injectedAndCurrent}**`);
  lines.push(`- · Latentes — el artículo ya tenía un lead numérico nativo, el hook JSON es fallback no usado: **${summary.dormantNativeLead}**`);
  lines.push(`- ✏ Falta inyectar (lead sin dígito y hook ausente): **${summary.needsInjection}**`);
  lines.push(`- ✗ Drift real — la huella del inyector existe pero el primer párrafo on-disk ya no coincide: **${summary.driftReal}**`);
  lines.push(`- ? Heurística — sin huella, primer párrafo parece un hook pero difiere del JSON (informativo): **${summary.heuristicCandidate}**`);
  lines.push(
    `- 🔒 Snapshot footprints en \`scripts/blog/data/article-hook-snapshot.json\`: **${summary.snapshotEntries}** (${summary.snapshotConfirmed} confirmados contra disco)`,
  );
  lines.push(
    `- ⚠ Anclas con año ≤ ${referenceYear - 2} (a re-verificar contra fuente oficial): **${summary.staleYearAnchors}**`,
  );
  lines.push("");
  lines.push("## 2. Proceso anual de refresco");
  lines.push("");
  lines.push("Cada **15 de enero**, el responsable editorial ejecuta:");
  lines.push("");
  lines.push("```");
  lines.push("node scripts/blog/blog-numeric-hook-yearly-refresh.mjs --year YYYY");
  lines.push("```");
  lines.push("");
  lines.push(
    "El listado resultante muestra, por cada slug, los facts canónicos que cita y la URL oficial de la que proceden. Para cada figura cuya fuente publica un nuevo valor (IRPF, RETA, multa Form 5472, BOI civil penalty inflation adjustment, tasa estatal Wyoming/Delaware/NM/FL), se procede así:",
  );
  lines.push("");
  lines.push("1. Editar el valor en `scripts/blog/data/article-numeric-hooks.json` para los 6 idiomas del slug afectado.");
  lines.push("2. Re-inyectar la nueva versión sustituyendo la anterior:");
  lines.push("");
  lines.push("```");
  lines.push("node scripts/blog/blog-add-numeric-hook.mjs --replace-existing --slug <slug>");
  lines.push("```");
  lines.push("");
  lines.push(
    "3. Para refrescos masivos (p. ej. cuando IRPF o RETA cambian y arrastran ≥ 10 slugs a la vez), usar la variante bulk:",
  );
  lines.push("");
  lines.push("```");
  lines.push("node scripts/blog/blog-add-numeric-hook.mjs --replace-existing --all --dry-run   # preview");
  lines.push("node scripts/blog/blog-add-numeric-hook.mjs --replace-existing --all             # apply");
  lines.push("```");
  lines.push("");
  lines.push(
    "4. Volver a correr `blog-numeric-hook-check.mjs` para confirmar que los 672 artículos siguen pasando la regla del dígito en los primeros 100 tokens.",
  );
  lines.push("5. Re-ejecutar este script con `--write-report` para sellar la nueva fecha de auditoría en este documento.");
  lines.push("");
  lines.push("## 3. Anclas a revisar cada enero (mapeo slug → fact canónico)");
  lines.push("");
  lines.push(
    "Tabla de los slugs cuyas cifras se mueven con la legislación. Las URLs son las fuentes oficiales primarias de la tabla `lote5-veracidad.md §2`.",
  );
  lines.push("");
  const livingFactIds = new Set([
    "form-5472-penalty",
    "boi-deadline",
    "reta-tarifa-plana-80",
    "reta-tabla-2026",
    "irpf-tramo-top-2026",
    "wyoming-annual-60",
    "delaware-franchise-300",
    "florida-annual-may1",
    "newmexico-no-annual",
  ]);
  const grouped = new Map();
  for (const r of auditRows) {
    for (const f of r.facts) {
      if (!livingFactIds.has(f.id)) continue;
      if (!grouped.has(f.id)) grouped.set(f.id, { fact: f, slugs: [] });
      grouped.get(f.id).slugs.push(r.slug);
    }
  }
  lines.push("| Fact canónico | Slugs afectados | Fuente oficial a revisar |");
  lines.push("|---|---:|---|");
  for (const id of livingFactIds) {
    if (!grouped.has(id)) continue;
    const g = grouped.get(id);
    const url = (g.fact.source || "").split(" — ")[0];
    lines.push(`| \`${id}\` — ${g.fact.label} | ${g.slugs.length} | ${url} |`);
  }
  lines.push("");
  lines.push("## 4. Drift detectado en esta auditoría");
  lines.push("");
  lines.push(
    "Se distinguen **dos categorías** desde Task #42 (snapshot por inyección):",
  );
  lines.push("");
  lines.push(
    "- **`drift_real`** — el snapshot `article-hook-snapshot.json` confirma que el inyector escribió ese párrafo en algún momento, y ya no coincide con el on-disk o con el JSON actual. **Acción requerida**: re-inyectar (`--replace-existing --slug`) o aceptar la edición ejecutando `--seed-snapshot` después de validarla.",
  );
  lines.push(
    "- **`heuristic_candidate`** — sin huella en el snapshot. El primer párrafo se parece a un hook (corto, una sola línea, contiene un dígito) pero difiere del JSON. Es **informativo**: la mayoría son leads nativos legítimos del equipo editorial, no falsos drifts. El exit code **no** se ve afectado.",
  );
  lines.push("");
  if (driftReal.length === 0 && needsInjection.length === 0 && heuristicCandidate.length === 0) {
    lines.push("**Ninguno.** Todo hook definido en JSON está inyectado y vigente, o latente porque el artículo ya tiene su propio lead numérico nativo.");
  } else {
    if (needsInjection.length > 0) {
      lines.push(`**${needsInjection.length} entradas requieren inyección** (artículos sin dígito en el lead). Ejecutar:`);
      lines.push("");
      lines.push("```");
      lines.push("node scripts/blog/blog-add-numeric-hook.mjs");
      lines.push("```");
      lines.push("");
    }
    if (driftReal.length > 0) {
      lines.push(`### 4.1 Drift real (acción requerida) — ${driftReal.length} entradas`);
      lines.push("");
      lines.push("Resolver con:");
      lines.push("");
      lines.push("```");
      lines.push("node scripts/blog/blog-add-numeric-hook.mjs --replace-existing --slug <slug>");
      lines.push("```");
      lines.push("");
      lines.push("| Lang | Slug | Motivo | injectedAt | JSON (esperado) | On-disk (actual) |");
      lines.push("|---|---|---|---|---|---|");
      for (const d of driftReal.slice(0, 50)) {
        lines.push(
          `| ${d.lang} | \`${d.slug}\` | ${d.reason} | ${d.injectedAt} | ${d.expected}… | ${d.onDisk}… |`,
        );
      }
      if (driftReal.length > 50) lines.push(`| … | … | … | … | … | (+${driftReal.length - 50} entradas adicionales) |`);
      lines.push("");
    }
    if (heuristicCandidate.length > 0) {
      lines.push(`### 4.2 Candidatos heurísticos (informativos) — ${heuristicCandidate.length} entradas`);
      lines.push("");
      lines.push(
        "Sin huella de inyección. El equipo editorial probablemente escribió un lead numérico legítimo. Revisar uno a uno: si el lead on-disk es preferible, dejarlo como está (no requiere acción); si en realidad fue un hook nuestro pre-snapshot que se editó, ejecutar `--replace-existing --slug` para reponer el JSON.",
      );
      lines.push("");
      lines.push("| Lang | Slug | JSON | On-disk |");
      lines.push("|---|---|---|---|");
      for (const d of heuristicCandidate.slice(0, 50)) {
        lines.push(`| ${d.lang} | \`${d.slug}\` | ${d.expected}… | ${d.onDisk}… |`);
      }
      if (heuristicCandidate.length > 50) lines.push(`| … | … | … | (+${heuristicCandidate.length - 50} entradas adicionales) |`);
    }
  }
  lines.push("");
  lines.push("## 5. Stale-year anchors");
  lines.push("");
  const staleRows = auditRows.filter((x) => x.staleYears.length > 0);
  if (staleRows.length === 0) {
    lines.push(`**Ninguno.** Ningún hook ancla a un año ≤ ${referenceYear - 2} (referencia: ${referenceYear}).`);
  } else {
    lines.push(`**${staleRows.length} slugs** con anclaje a año ≤ ${referenceYear - 2}. Re-validar cada uno contra su fuente oficial — si la cifra publicada para el año en curso ha cambiado, editar el JSON y re-inyectar con \`--replace-existing\`.`);
    lines.push("");
    lines.push("| Slug | Años anclados | Fact(s) canónicos |");
    lines.push("|---|---|---|");
    for (const r of staleRows) {
      const facts = r.facts.length > 0 ? r.facts.map((f) => `\`${f.id}\``).join(", ") : "—";
      lines.push(`| \`${r.slug}\` | ${r.staleYears.join(", ")} | ${facts} |`);
    }
  }
  lines.push("");
  lines.push("## 6. Histórico de auditorías");
  lines.push("");
  // Append-only: preserve previous "audit entries" if present
  let previousAudits = "";
  if (fs.existsSync(REPORT_MD)) {
    const prev = fs.readFileSync(REPORT_MD, "utf8");
    const match = prev.match(/## 6\. Histórico de auditorías\s*\n([\s\S]*?)(\n## |$)/);
    if (match) previousAudits = match[1].trim();
  }
  const newEntry = `- **${today}** — referenceYear=${referenceYear}, hooks=${summary.hooks}, injected=${summary.injectedAndCurrent}, dormant=${summary.dormantNativeLead}, needsInjection=${summary.needsInjection}, driftReal=${summary.driftReal}, heuristicCandidate=${summary.heuristicCandidate}, snapshotEntries=${summary.snapshotEntries}, staleYearAnchors=${summary.staleYearAnchors}.`;
  lines.push(newEntry);
  if (previousAudits) {
    for (const line of previousAudits.split("\n")) {
      if (line.trim() && line !== newEntry) lines.push(line);
    }
  }
  lines.push("");

  fs.writeFileSync(REPORT_MD, lines.join("\n"), "utf8");
  console.log(`\nWrote report: reports/seo/lote6-numeric-hook.md`);
}

// Exit code: only `drift_real` (snapshot-confirmed editor edits or yearly-bump
// no-ops) and `needsInjection` block CI. `heuristic_candidate` is informational
// only — it captures legitimate native numeric leads that the old heuristic
// mis-flagged, so it must NOT fail the build.
process.exit(summary.needsInjection > 0 || summary.driftReal > 0 ? 1 : 0);
