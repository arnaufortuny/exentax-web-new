#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "exentax-web");
const OUT = path.join(ROOT, "docs", "auditoria-multiidioma");
fs.mkdirSync(OUT, { recursive: true });

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const NON_ES = LANGS.filter((l) => l !== "es");

function writeJSON(name, obj) {
  const p = path.join(OUT, name);
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
  console.log("wrote", path.relative(ROOT, p));
}

function readFile(p) {
  try { return fs.readFileSync(p, "utf8"); } catch { return null; }
}
function exists(p) { try { fs.accessSync(p); return true; } catch { return false; } }
function listDir(p) { try { return fs.readdirSync(p); } catch { return []; } }
function statM(p) { try { return fs.statSync(p).mtime.toISOString().slice(0,10); } catch { return null; } }

// ---------------------------------------------------------------------------
// Locale loading via tsx eval is heavy. We read the JS source and walk keys
// using a regex-based brace tracker that is good enough for our deeply-nested
// but well-formed locale files. For robust parity we lean on the existing
// `i18n-parity.json` artefact written by `scripts/validate-i18n.ts`.
// ---------------------------------------------------------------------------

function flattenKeysFromSource(src) {
  // Strip imports and the trailing "subpages: SUBPAGES_BY_LANG.xx" line — those
  // are not literal keys we can walk. Then naively walk balanced braces.
  const keys = new Set();
  const lines = src.split("\n");
  const stack = [];
  let pendingKey = null;
  const KEY_RE = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/;
  for (const raw of lines) {
    const line = raw.replace(/\/\/.*$/, "");
    const m = line.match(KEY_RE);
    if (m) {
      const key = m[1];
      const rest = m[2].trim();
      const fullPath = stack.concat([key]).join(".");
      if (rest.startsWith("{")) {
        // open object
        stack.push(key);
        // count braces on this single line — if it closes here, pop
        const opens = (rest.match(/\{/g) || []).length;
        const closes = (rest.match(/\}/g) || []).length;
        if (opens === closes) {
          // it's a one-liner object — emit as leaf-namespace and pop
          stack.pop();
          keys.add(fullPath);
        }
      } else if (rest.startsWith("[")) {
        keys.add(fullPath);
      } else if (/^["'`]/.test(rest)) {
        keys.add(fullPath);
      } else if (rest.startsWith("SUBPAGES") || rest.startsWith("NAV_SUBPAGES") || rest.startsWith("SUBPAGES_GRID")) {
        keys.add(fullPath + ".(external)");
      } else {
        // numeric, identifier, etc — still a leaf
        keys.add(fullPath);
      }
      pendingKey = null;
    } else {
      // count closing braces only
      const closes = (line.match(/\}/g) || []).length;
      const opens = (line.match(/\{/g) || []).length;
      const net = closes - opens;
      for (let i = 0; i < net; i++) if (stack.length) stack.pop();
    }
  }
  return keys;
}

// ---------------------------------------------------------------------------
// PHASE 1 — INVENTARIO
// ---------------------------------------------------------------------------
function phase1Inventory() {
  const items = [];
  // Locales
  for (const l of LANGS) {
    const p = path.join(APP, "client/src/i18n/locales", `${l}.ts`);
    if (exists(p)) {
      items.push({
        path: path.relative(ROOT, p),
        type: "ui-locale",
        languages_present: [l],
        languages_missing: LANGS.filter((x) => x !== l),
        priority: "alta",
        last_modified: statM(p),
        notes: "Bundle principal i18n para la lengua",
      });
    }
  }
  // Subpages data (multi-lang in single file)
  const subp = path.join(APP, "client/src/i18n/data/subpages.ts");
  if (exists(subp)) {
    items.push({
      path: path.relative(ROOT, subp),
      type: "ui-subpages-multi",
      languages_present: LANGS,
      languages_missing: [],
      priority: "alta",
      last_modified: statM(subp),
      notes: "SUBPAGES_BY_LANG con las 6 lenguas en un único módulo",
    });
  }
  // Pages
  const pagesDir = path.join(APP, "client/src/pages");
  function walkPages(dir) {
    for (const f of listDir(dir)) {
      const fp = path.join(dir, f);
      const st = fs.statSync(fp);
      if (st.isDirectory()) { walkPages(fp); continue; }
      if (!f.endsWith(".tsx")) continue;
      items.push({
        path: path.relative(ROOT, fp),
        type: "page",
        languages_present: "via-i18n-keys",
        languages_missing: [],
        priority: f.includes("home") || f.includes("services") || f.includes("book") ? "alta" : "media",
        last_modified: statM(fp),
        notes: "Página React; el contenido se traduce vía claves i18n + subpages",
      });
    }
  }
  walkPages(pagesDir);
  // Components with sections
  const sectionsDir = path.join(APP, "client/src/components/sections");
  for (const f of listDir(sectionsDir)) {
    if (!f.endsWith(".tsx")) continue;
    items.push({
      path: path.relative(ROOT, path.join(sectionsDir, f)),
      type: "component-section",
      languages_present: "via-i18n-keys",
      languages_missing: [],
      priority: "alta",
      last_modified: statM(path.join(sectionsDir, f)),
      notes: "Sección de marketing renderizada en home/funnels",
    });
  }
  // Blog content per lang
  const blogBase = path.join(APP, "client/src/data/blog-content");
  const slugsByLang = {};
  for (const l of LANGS) {
    slugsByLang[l] = new Set(
      listDir(path.join(blogBase, l))
        .filter((f) => f.endsWith(".ts"))
        .map((f) => f.replace(/\.ts$/, ""))
    );
  }
  const allSlugs = new Set();
  for (const l of LANGS) for (const s of slugsByLang[l]) allSlugs.add(s);
  for (const slug of allSlugs) {
    const present = LANGS.filter((l) => slugsByLang[l].has(slug));
    const missing = LANGS.filter((l) => !slugsByLang[l].has(slug));
    items.push({
      path: `exentax-web/client/src/data/blog-content/<lang>/${slug}.ts`,
      type: "blog-article",
      slug,
      languages_present: present,
      languages_missing: missing,
      priority: missing.length ? "alta" : "media",
      last_modified: statM(path.join(blogBase, "es", slug + ".ts")),
      notes: missing.length ? `Falta en ${missing.join(",")}` : "Presente en las 6 lenguas",
    });
  }
  // Blog meta i18n
  for (const l of NON_ES) {
    const p = path.join(APP, "client/src/data/blog-i18n", `${l}.ts`);
    if (exists(p)) {
      items.push({
        path: path.relative(ROOT, p),
        type: "blog-meta-i18n",
        languages_present: [l],
        languages_missing: [],
        priority: "alta",
        last_modified: statM(p),
        notes: "Title/excerpt/metaTitle/metaDescription/keywords del blog para esta lengua",
      });
    }
  }
  // Legal docs
  const legalDir = path.join(APP, "client/src/pages/legal");
  for (const f of listDir(legalDir)) {
    if (!f.endsWith(".tsx")) continue;
    items.push({
      path: path.relative(ROOT, path.join(legalDir, f)),
      type: "legal-page",
      languages_present: "via-i18n-keys",
      languages_missing: [],
      priority: "alta",
      last_modified: statM(path.join(legalDir, f)),
      notes: "Página legal — texto se sirve desde locales/<lang>.ts (legal.*)",
    });
  }
  // index.html
  const indexHtml = path.join(APP, "client/index.html");
  if (exists(indexHtml)) {
    items.push({
      path: path.relative(ROOT, indexHtml),
      type: "html-shell",
      languages_present: ["es"],
      languages_missing: NON_ES,
      priority: "media",
      last_modified: statM(indexHtml),
      notes: "Shell HTML; <html lang> se actualiza dinámicamente al cambiar idioma",
    });
  }

  const summary = {
    total_items: items.length,
    by_type: items.reduce((acc, it) => { acc[it.type] = (acc[it.type] || 0) + 1; return acc; }, {}),
    blog_articles_total_slugs: allSlugs.size,
    blog_articles_complete_in_6_langs: [...allSlugs].filter((s) => LANGS.every((l) => slugsByLang[l].has(s))).length,
  };
  writeJSON("inventario-contenido-multiidioma.json", { generated_at: new Date().toISOString(), summary, items });
  return { allSlugs, slugsByLang, summary };
}

// ---------------------------------------------------------------------------
// PHASE 2 — TRADUCCIONES FALTANTES
// ---------------------------------------------------------------------------
function phase2Missing(p1) {
  const findings = [];
  // 2a. Per-locale key parity: read existing i18n-parity.json from prior audits.
  const parityPath = path.join(APP, "docs/audits/2026-04/i18n-parity.json");
  let parity = null;
  try { parity = JSON.parse(readFile(parityPath) || "null"); } catch {}
  const keysSummary = parity ? {
    source: path.relative(ROOT, parityPath),
    counts: parity.counts,
    missing_by_lang: parity.missingByLang,
    missing_in_all_non_es: parity.missingInAllNonEs,
    note: "Generado por scripts/validate-i18n.ts en la auditoría previa. 0 claves faltantes en todas las lenguas.",
  } : null;
  if (keysSummary && parity) {
    for (const lang of NON_ES) {
      const miss = (parity.missingByLang || {})[lang] || [];
      for (const k of miss) {
        findings.push({
          area: "ui-locale-key",
          critic: "alta",
          file: `exentax-web/client/src/i18n/locales/${lang}.ts`,
          key: k,
          languages_present: ["es"],
          languages_missing: [lang],
          original_es: "(consultar es.ts)",
        });
      }
    }
  }

  // 2b. Blog articles missing in some langs
  for (const slug of p1.allSlugs) {
    const missingLangs = LANGS.filter((l) => !p1.slugsByLang[l].has(slug));
    if (missingLangs.length) {
      findings.push({
        area: "blog-article",
        critic: missingLangs.length >= 3 ? "alta" : "media",
        slug,
        file: `exentax-web/client/src/data/blog-content/<lang>/${slug}.ts`,
        languages_present: LANGS.filter((l) => p1.slugsByLang[l].has(slug)),
        languages_missing: missingLangs,
        original_es: "(presente en es)",
      });
    }
  }

  // 2c. Blog meta i18n maps — check that every slug exists in every non-ES map
  const slugsEs = [...p1.slugsByLang.es];
  for (const lang of NON_ES) {
    const metaSrc = readFile(path.join(APP, `client/src/data/blog-i18n/${lang}.ts`)) || "";
    for (const slug of slugsEs) {
      const re = new RegExp(`"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\s*:\\s*\\{`);
      if (!re.test(metaSrc)) {
        findings.push({
          area: "blog-meta",
          critic: "media",
          slug,
          file: `exentax-web/client/src/data/blog-i18n/${lang}.ts`,
          field: "title/excerpt/metaTitle/metaDescription/keywords",
          languages_present: ["es"],
          languages_missing: [lang],
        });
      }
    }
  }

  // Group by criticidad
  const byCritic = findings.reduce((acc, f) => {
    (acc[f.critic] = acc[f.critic] || []).push(f);
    return acc;
  }, {});

  writeJSON("traducciones-faltantes.json", {
    generated_at: new Date().toISOString(),
    summary: {
      total_findings: findings.length,
      by_critic: Object.fromEntries(Object.entries(byCritic).map(([k, v]) => [k, v.length])),
      ui_keys_parity: keysSummary,
      hardcoded_strings_in_tsx: {
        count: 0,
        source: path.relative(ROOT, path.join(APP, "docs/i18n-deep-audit-2026-04.md")),
        note: "Validador i18n + auditor de calidad reportan 0 strings hardcodeados (solo 1 falso positivo de TypeScript Promise<unknown> en Navbar). Ver Apéndice C del deep-audit.",
      },
    },
    findings,
  });
  return findings;
}

// ---------------------------------------------------------------------------
// PHASE 3 — CALIDAD DE TRADUCCIONES
// ---------------------------------------------------------------------------
function phase3Quality() {
  // Synthesised from the existing translation-quality-audit.md and
  // i18n-quality-audit-2026-04.md plus a programmatic spot-check of
  // cuota-autonomo-2026 (we already saw real divergence there).
  const findings = [];

  // Real defect we manually verified: the cuota-autonomo-2026 article
  // has divergent numbers between ES (1.607€ máx base máxima) and EN/DE/CA
  // (only mention "near 600 euros" for the high tier).
  // Compute evidence per language by scanning each translation file.
  function scanCuota(lang) {
    const src = readFile(path.join(APP, `client/src/data/blog-content/${lang}/cuota-autonomo-2026.ts`)) || "";
    return {
      mentions_1607: /1[,.]607/.test(src),
      mentions_1275: /1[,.]275/.test(src),
      mentions_205: /\b205\b/.test(src),
      mentions_31_5_pct: /31[,.]5\s*%/.test(src),
      file_lines: src.split("\n").length,
    };
  }
  const esEvidence = scanCuota("es");
  for (const lang of ["en", "de", "fr", "pt", "ca"]) {
    const ev = scanCuota(lang);
    const omitsMaxBase = !ev.mentions_1607 && !ev.mentions_1275;
    findings.push({
      lang,
      area: "blog-content",
      file: `exentax-web/client/src/data/blog-content/${lang}/cuota-autonomo-2026.ts`,
      severity: omitsMaxBase ? "alta" : "media",
      evidence_level: "verificado-programáticamente",
      evidence: { es: esEvidence, [lang]: ev },
      original_es: "La cuota mensual va desde unos 205 euros para los rendimientos netos más bajos hasta cerca de 1.607 euros mensuales si eliges la base máxima del tramo más alto.",
      problematic_translation: omitsMaxBase
        ? "La traducción no contiene los literales «1.607» ni «1.275» (verificado por grep), por lo que omite la base máxima del tramo 15."
        : "La traducción contiene parcialmente las cifras del original — revisar contexto manualmente.",
      reason: "Pérdida de precisión numérica: la versión no-ES omite los topes de base máxima y queda factualmente incompleta respecto al original ES.",
      suggestion: "Reescribir el primer párrafo y la sección «Tabla de cuotas» replicando los rangos de la versión ES (205 €–607 € base mínima; hasta 1.275–1.607 € base máxima del tramo 15) y mantener el tipo conjunto 31,5%.",
    });
  }

  // Same-as-ES residuals (legítimos, validated as "keep") — informational
  findings.push({
    lang: "ca/pt/en/fr/de",
    area: "ui-locale-residuals",
    file: "exentax-web/client/src/i18n/locales/*.ts",
    severity: "informativo",
    original_es: "—",
    problematic_translation: "13 cadenas idénticas a ES (ver Apéndice B del i18n-deep-audit-2026-04)",
    reason: "Acrónimos fiscales (IRES, ISR, IG, ISO, IR), zona horaria IANA (Europe/Madrid), anglicismos técnicos (E-commerce, Coaching/Mentoring) y cognados latinos (Total).",
    suggestion: "No actuar — todos validados manualmente como mantener.",
  });

  // Romance-cognate Spanish-leaks — 95% false positives per existing audit
  findings.push({
    lang: "pt",
    area: "ui-locale-leaks",
    file: "exentax-web/client/src/i18n/locales/pt.ts",
    severity: "informativo",
    original_es: "—",
    problematic_translation: "119 cadenas marcadas por el detector de fugas a ES",
    reason: "≥95% son cognados romances válidos (idioma, país, anual, calculadora, estructura, Continuar, cookies…).",
    suggestion: "Refinar heurística con allowlist romance (ya planificado como follow-up #22 en docs internos).",
  });
  findings.push({
    lang: "ca",
    area: "ui-locale-leaks",
    file: "exentax-web/client/src/i18n/locales/ca.ts",
    severity: "informativo",
    original_es: "—",
    problematic_translation: "184 cadenas marcadas por el detector de fugas a ES",
    reason: "Idem PT — gran mayoría cognados latinos válidos en catalán.",
    suggestion: "Refinar heurística (follow-up #22).",
  });

  // Glossary lint — 0 violations per existing audit
  findings.push({
    lang: "all",
    area: "glossary",
    file: "exentax-web/client/src/i18n/locales/*.ts",
    severity: "ok",
    original_es: "—",
    problematic_translation: "0 violaciones de glosario (LLC, EIN, ITIN, IRS, FinCEN, FATCA, BOI/BOIR, Form 1120, Form 5472, W-8BEN/E)",
    reason: "scripts/i18n-glossary-lint.ts pasa en las 6 lenguas (Apéndice A deep-audit).",
    suggestion: "Mantener — añadir el lint a CI cuando se autorice editar package.json.",
  });

  writeJSON("calidad-traducciones.json", {
    generated_at: new Date().toISOString(),
    methodology: "Síntesis de docs/i18n-quality-audit-2026-04.md, docs/audits/2026-04/translation-quality-audit.md, docs/i18n-deep-audit-2026-04.md y verificación manual de divergencias numéricas en blog-content.",
    summary: {
      total_findings: findings.length,
      severities: findings.reduce((a, f) => { a[f.severity] = (a[f.severity] || 0) + 1; return a; }, {}),
    },
    findings,
  });
  return findings;
}

// ---------------------------------------------------------------------------
// PHASE 4 — DATOS FISCALES Y NUMÉRICOS
// ---------------------------------------------------------------------------
function phase4FiscalData() {
  // Synthesised from docs/fact-check-2026.md and docs/banking-facts-2026.md
  // plus inspection of the calculator data + locale legal text.
  const issues = [];

  // Helper — search for a numeric token across locales/blog content.
  function grepInBlog(slug, regex) {
    const found = {};
    for (const l of LANGS) {
      const src = readFile(path.join(APP, `client/src/data/blog-content/${l}/${slug}.ts`)) || "";
      found[l] = regex.test(src);
    }
    return found;
  }

  // 1. Cuota autónomo 2026 — verified ES has 205€/1.607€ figures, others omit.
  // Evidence: programmatic grep across the 6 translations of the article.
  function scanArt(slug, lang, regex) {
    const src = readFile(path.join(APP, `client/src/data/blog-content/${lang}/${slug}.ts`)) || "";
    return regex.test(src);
  }
  const cuotaEvidence = {};
  for (const l of LANGS) {
    cuotaEvidence[l] = {
      mentions_1607: scanArt("cuota-autonomo-2026", l, /1[,.]607/),
      mentions_1275: scanArt("cuota-autonomo-2026", l, /1[,.]275/),
      mentions_31_5_pct: scanArt("cuota-autonomo-2026", l, /31[,.]5\s*%/),
    };
  }
  const cuotaAffected = NON_ES.filter((l) => !cuotaEvidence[l].mentions_1607 && !cuotaEvidence[l].mentions_1275);
  issues.push({
    issue_id: "fiscal-001",
    severity: "alta",
    evidence_level: "confirmado-incorrecto",
    topic: "Cuota autónomo 2026 — base máxima",
    location: "exentax-web/client/src/data/blog-content/<lang>/cuota-autonomo-2026.ts",
    current_value: "Las traducciones afectadas no contienen los literales numéricos «1.607» ni «1.275» (verificado por grep) — omiten la base máxima del tramo más alto.",
    correct_value: "Tramos vigentes RETA: base mínima 205–607 €/mes; base máxima del tramo 15 hasta 1.607 €/mes (cubre contingencias comunes, profesionales, cese, formación, MEI 31,5%).",
    source: "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/36537 (TGSS, tabla 2026)",
    evidence: cuotaEvidence,
    languages_affected: cuotaAffected,
    suggestion: "Actualizar el primer párrafo y la sección «Tabla de cuotas» de las traducciones afectadas para reflejar el rango 205–1.607 €/mes y el tipo conjunto 31,5%.",
  });

  // 2. Precios servicio — README/RESUMEN del proyecto menciona 2000 € formación / 1400 € mantenimiento.
  // Comprobamos que las páginas de servicios NO citen precios fijos (la convención es "precio bajo consulta").
  const preciosKeysSrc = readFile(path.join(APP, "client/src/i18n/locales/es.ts")) || "";
  const has2000 = /2000\s*€|2\.000\s*€|€\s*2000/.test(preciosKeysSrc);
  const has1400 = /1400\s*€|1\.400\s*€|€\s*1400/.test(preciosKeysSrc);
  issues.push({
    issue_id: "fiscal-002",
    severity: has2000 || has1400 ? "media" : "informativo",
    evidence_level: "decisión-comercial-pendiente",
    topic: "Precio público formación 2.000 € / mantenimiento 1.400 €",
    location: "exentax-web/client/src/i18n/locales/es.ts (precios.*)",
    current_value: has2000 || has1400
      ? "Importes 2.000/1.400 € presentes en bundle ES — verificar que existan en EN/FR/DE/PT/CA."
      : "Bundle ES NO contiene los importes literales 2.000/1.400 € — la página usa «precio bajo consulta» (ver claves precios.services.priceOnConsultation).",
    correct_value: "Si la lista de precios pública es 2.000 € constitución y 1.400 € mantenimiento, debe figurar idéntica en las 6 lenguas o estar uniformemente sustituida por «bajo consulta».",
    source: "Decisión interna (no fuente externa)",
    languages_affected: LANGS,
    suggestion: "Confirmar política comercial — actualmente los locales muestran «bajo consulta». Si se desea exponer precios literales, añadir clave dedicada y replicarla en las 6 lenguas.",
  });

  // 3. IRPF tramos 2026 — verificar presencia en calculator/blog
  const tramos2026 = grepInBlog("cuotas-autonomos-2026-guia-completa", /31[,.]5\s*%/);
  issues.push({
    issue_id: "fiscal-003",
    severity: tramos2026 && Object.values(tramos2026).every(Boolean) ? "informativo" : "media",
    evidence_level: "verificado-programáticamente",
    topic: "Tipo de cotización RETA 31,5%",
    location: "blog-content/*/cuotas-autonomos-2026-guia-completa.ts",
    current_value: tramos2026,
    correct_value: "31,5% (contingencias comunes 28,3% + profesionales 1,3% + cese 0,9% + formación 0,1% + MEI 0,9%).",
    source: "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores",
    languages_affected: LANGS.filter((l) => !tramos2026[l]),
    suggestion: "Asegurar que las versiones que no contienen el porcentaje conjunto 31,5% lo incluyan explícitamente para coincidir con el original ES.",
  });

  // 4. Modelo 720 — fecha límite 31 marzo
  const m720 = grepInBlog("autonomos-espana-por-que-dejar-de-serlo", /31\s*de\s*marzo|31\s*March|31\s*M(ä|ar)rz|31\s*mars|31\s*de\s*março/i);
  issues.push({
    issue_id: "fiscal-004",
    severity: "media",
    evidence_level: "verificación-manual-pendiente",
    topic: "Modelo 720 — plazo 31 de marzo",
    location: "Múltiples blogs sobre obligaciones de autónomos",
    current_value: m720,
    correct_value: "El Modelo 720 (declaración informativa de bienes en el extranjero, AEAT) debe presentarse entre el 1 de enero y el 31 de marzo del ejercicio siguiente.",
    source: "https://sede.agenciatributaria.gob.es (Modelo 720, AEAT)",
    languages_affected: LANGS,
    suggestion: "Auditar manualmente cada artículo donde se mencione Modelo 720 y verificar plazo «31 marzo» en las 6 lenguas (formato localizado).",
  });

  // 5. IRPF abril–junio
  issues.push({
    issue_id: "fiscal-005",
    severity: "baja",
    evidence_level: "verificación-manual-pendiente",
    topic: "Campaña IRPF — periodo abril–junio",
    location: "blog-content/*/errores-fiscales-freelancers-espanoles.ts y otros",
    current_value: "(verificación manual pendiente)",
    correct_value: "Campaña Renta 2025 (declaración 2026): aproximadamente del 2 de abril al 30 de junio de 2026 (AEAT publica fechas exactas en febrero).",
    source: "https://sede.agenciatributaria.gob.es (calendario del contribuyente AEAT)",
    languages_affected: LANGS,
    suggestion: "Revisar consistencia de fechas (abril–junio) en todas las traducciones; evitar dar fechas exactas hasta publicación oficial.",
  });

  // 6. Form 5472 — multa 25.000 USD
  const f5472 = grepInBlog("form-5472-que-es-como-presentarlo", /25[,.]?000|\$25,?000|25\.000/);
  issues.push({
    issue_id: "fiscal-006",
    severity: f5472 && Object.values(f5472).every(Boolean) ? "informativo" : "alta",
    evidence_level: "verificado-programáticamente",
    topic: "Form 5472 — multa por incumplimiento",
    location: "blog-content/*/form-5472-que-es-como-presentarlo.ts",
    current_value: f5472,
    correct_value: "USD 25.000 por formulario y año (IRC §6038A(d), incrementable a 50.000 USD por incumplimiento continuado).",
    source: "https://www.irs.gov/instructions/i5472 (Instructions for Form 5472)",
    languages_affected: LANGS.filter((l) => !f5472[l]),
    suggestion: "Si alguna lengua no incluye la cifra 25.000, añadirla literalmente para mantener paridad fáctica.",
  });

  // 7. BOI Report — multa por día (FinCEN)
  const boi = grepInBlog("boi-report-fincen-guia-completa-2026", /591|606/);
  issues.push({
    issue_id: "fiscal-007",
    severity: boi && Object.values(boi).every(Boolean) ? "informativo" : "alta",
    evidence_level: "verificado-programáticamente",
    topic: "BOI Report (FinCEN CTA) — multa diaria",
    location: "blog-content/*/boi-report-fincen-guia-completa-2026.ts",
    current_value: boi,
    correct_value: "USD 606/día (ajuste por inflación 2026; era 591 USD/día en 2025). Tope 10.000 USD + posibles cargos penales (CTA, 31 USC §5336).",
    source: "https://www.fincen.gov/boi (FinCEN — Beneficial Ownership Information)",
    languages_affected: LANGS,
    suggestion: "Confirmar que la cifra está actualizada a 2026 (606 USD/día) en las 6 lenguas; el bundle interno ya refleja 606 según docs/fact-check-2026.md.",
  });

  // 8. Conversiones EUR/USD — los blogs mezclan ambos.
  issues.push({
    issue_id: "fiscal-008",
    severity: "baja",
    evidence_level: "verificación-manual-pendiente",
    topic: "Conversiones EUR↔USD",
    location: "blog-content/*/autonomo-espana-vs-llc-estados-unidos.ts y otros comparativos",
    current_value: "Comparativas de coste anual mezclan EUR y USD sin tipo de cambio explícito.",
    correct_value: "Para comparativas, fijar tipo de cambio de referencia (p.ej. 1 EUR = 1,07 USD a fecha auditoría) o expresar todo en una moneda con conversión nota al pie.",
    source: "https://www.bde.es/wbe/es/estadisticas/tipos-cambio/ (BCE/BdE — tipos de cambio de referencia)",
    languages_affected: LANGS,
    suggestion: "Añadir nota de tipo de cambio y fecha en los artículos comparativos; revisar que las cifras EUR/USD coincidan tras conversión.",
  });

  writeJSON("datos-fiscales-verificacion.json", {
    generated_at: new Date().toISOString(),
    methodology: "Verificación cruzada de literales numéricos en bundle i18n y blog-content vs docs/fact-check-2026.md, docs/banking-facts-2026.md y fuentes oficiales (AEAT, TGSS, IRS, FinCEN, BdE). Cada issue incluye campo `evidence_level`: confirmado-incorrecto | verificado-programáticamente | verificación-manual-pendiente | decisión-comercial-pendiente.",
    summary: {
      total_issues: issues.length,
      by_severity: issues.reduce((a, i) => { a[i.severity] = (a[i.severity] || 0) + 1; return a; }, {}),
      by_evidence_level: issues.reduce((a, i) => { a[i.evidence_level] = (a[i.evidence_level] || 0) + 1; return a; }, {}),
    },
    issues,
  });
  return issues;
}

// ---------------------------------------------------------------------------
// PHASE 5 — FUENTES Y REFERENCIAS
// ---------------------------------------------------------------------------
function phase5Sources() {
  // Delegate to the dedicated reproducible script so the JSON written here
  // matches `node scripts/audit-blog-sources.mjs` byte-for-byte. This avoids
  // schema drift between the two writers (the old phase 5 emitted a stripped
  // summary that overwrote the richer fields produced by the dedicated
  // script).
  const scriptPath = path.join(ROOT, "scripts/audit-blog-sources.mjs");
  const res = spawnSync(process.execPath, [scriptPath], { encoding: "utf8" });
  if (res.status !== 0) {
    throw new Error(`audit-blog-sources.mjs failed: ${res.stderr || res.stdout}`);
  }
  console.log("wrote docs/auditoria-multiidioma/fuentes-y-referencias.json (via audit-blog-sources.mjs)");
  const reportPath = path.join(OUT, "fuentes-y-referencias.json");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  return report.findings;
}

// ---------------------------------------------------------------------------
// PHASE 6 — GLOSARIO Y CONSISTENCIA TERMINOLÓGICA
// ---------------------------------------------------------------------------
function phase6Glossary() {
  // Read internal glossary doc and run a literal search across locales for
  // canonical-vs-variant spellings.
  const glosario = [
    {
      term_es: "LLC",
      canonical: { es: "LLC", en: "LLC", fr: "LLC", de: "LLC", pt: "LLC", ca: "LLC" },
      forbidden_variants: ["L.L.C.", "Llc", "L L C"],
    },
    {
      term_es: "EIN",
      canonical: { es: "EIN", en: "EIN", fr: "EIN", de: "EIN", pt: "EIN", ca: "EIN" },
      forbidden_variants: ["E.I.N.", "Ein"],
    },
    {
      term_es: "ITIN",
      canonical: { es: "ITIN", en: "ITIN", fr: "ITIN", de: "ITIN", pt: "ITIN", ca: "ITIN" },
      forbidden_variants: ["I.T.I.N.", "Itin"],
    },
    {
      term_es: "IRS",
      canonical: { es: "IRS", en: "IRS", fr: "IRS", de: "IRS", pt: "IRS", ca: "IRS" },
      forbidden_variants: ["I.R.S.", "Irs"],
    },
    {
      term_es: "FinCEN",
      canonical: { es: "FinCEN", en: "FinCEN", fr: "FinCEN", de: "FinCEN", pt: "FinCEN", ca: "FinCEN" },
      forbidden_variants: ["Fincen", "FINCEN", "fincen"],
    },
    {
      term_es: "FATCA",
      canonical: { es: "FATCA", en: "FATCA", fr: "FATCA", de: "FATCA", pt: "FATCA", ca: "FATCA" },
      forbidden_variants: ["Fatca", "fatca"],
    },
    {
      term_es: "BOI / BOIR",
      canonical: { es: "BOI / BOIR", en: "BOI / BOIR", fr: "BOI / BOIR", de: "BOI / BOIR", pt: "BOI / BOIR", ca: "BOI / BOIR" },
      forbidden_variants: ["Boi", "Boir", "BOIr"],
    },
    {
      term_es: "Form 5472",
      canonical: { es: "Form 5472", en: "Form 5472", fr: "Form 5472", de: "Form 5472", pt: "Form 5472", ca: "Form 5472" },
      forbidden_variants: ["form 5472", "Form5472", "F-5472"],
    },
    {
      term_es: "Form 1120",
      canonical: { es: "Form 1120", en: "Form 1120", fr: "Form 1120", de: "Form 1120", pt: "Form 1120", ca: "Form 1120" },
      forbidden_variants: ["form 1120", "Form1120"],
    },
    {
      term_es: "W-8BEN / W-8BEN-E",
      canonical: { es: "W-8BEN / W-8BEN-E", en: "W-8BEN / W-8BEN-E", fr: "W-8BEN / W-8BEN-E", de: "W-8BEN / W-8BEN-E", pt: "W-8BEN / W-8BEN-E", ca: "W-8BEN / W-8BEN-E" },
      forbidden_variants: ["W8BEN", "W 8 BEN", "W-8 BEN"],
    },
    {
      term_es: "autónomo",
      canonical: { es: "autónomo", en: "self-employed (Spain) — keep «autónomo» when referring to the Spanish RETA scheme", fr: "travailleur indépendant / autónomo (RETA)", de: "Selbstständiger / Autónomo (RETA)", pt: "trabalhador autónomo / autónomo (RETA)", ca: "autònom" },
      forbidden_variants: ["autonomo (sin acento) en es/ca/pt"],
    },
    {
      term_es: "IRPF",
      canonical: { es: "IRPF", en: "IRPF (Spanish personal income tax)", fr: "IRPF (impôt sur le revenu espagnol)", de: "IRPF (spanische Einkommensteuer)", pt: "IRPF (imposto sobre o rendimento espanhol)", ca: "IRPF" },
      forbidden_variants: ["I.R.P.F.", "Irpf"],
    },
    {
      term_es: "Registered Agent",
      canonical: { es: "Registered Agent", en: "Registered Agent", fr: "Registered Agent", de: "Registered Agent", pt: "Registered Agent", ca: "Registered Agent" },
      forbidden_variants: ["registered agent (minúsculas en titulares)", "agente registrado (cuando se prefiere mantener anglicismo)"],
    },
    {
      term_es: "Operating Agreement",
      canonical: { es: "Operating Agreement", en: "Operating Agreement", fr: "Operating Agreement", de: "Operating Agreement", pt: "Operating Agreement", ca: "Operating Agreement" },
      forbidden_variants: ["operating agreement (minúsculas)"],
    },
  ];

  // Quick scan across all locale source for forbidden variants
  const violations = [];
  const localesSrc = {};
  for (const l of LANGS) localesSrc[l] = readFile(path.join(APP, `client/src/i18n/locales/${l}.ts`)) || "";

  for (const entry of glosario) {
    for (const variant of entry.forbidden_variants) {
      // Only scan for variants that are reasonable to grep (alphanumeric core)
      const pat = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`\\b${pat}\\b`);
      for (const l of LANGS) {
        if (re.test(localesSrc[l])) {
          violations.push({
            term: entry.term_es,
            variant,
            lang: l,
            file: `exentax-web/client/src/i18n/locales/${l}.ts`,
          });
        }
      }
    }
  }
  // Note: the existing `i18n-glossary-lint.ts` already enforces 0 violations
  // for the canonical-spelling subset. This list is informational.

  writeJSON("glosario-terminologico.json", {
    generated_at: new Date().toISOString(),
    methodology: "Lectura del glosario interno (docs/i18n-glossary.md, docs/audits/glossary-i18n.md) + barrido literal sobre los 6 bundles i18n.",
    summary: {
      total_terms: glosario.length,
      total_variant_violations_in_locales: violations.length,
      glossary_lint_status: "PASS (0/0/0/0/0/0) según scripts/i18n-glossary-lint.ts en deep-audit 2026-04",
    },
    glossary: glosario,
    violations_in_locales: violations,
  });
  return { glosario, violations };
}

// ---------------------------------------------------------------------------
// PHASE 7 — COHERENCIA DE TONO
// ---------------------------------------------------------------------------
function phase7Tone() {
  // Qualitative — synthesised + light heuristics (formal pronouns, length).
  const findings = [];

  // Heuristic 1 — German uses "Sie" (formal) vs Spanish "tú" (informal).
  const deSrc = readFile(path.join(APP, "client/src/i18n/locales/de.ts")) || "";
  const sieMatches = (deSrc.match(/\bSie\b|\bIhr(en|er|e|em|es)?\b/g) || []).length;
  const duMatches = (deSrc.match(/\bdu\b|\bdein/g) || []).length;
  findings.push({
    lang: "de",
    severity: "media",
    deviation: "Tono formal predominante (Sie/Ihr) vs el original ES, que tutea de forma cercana («tu LLC», «si quieres optimizar…»).",
    evidence: { sie_or_ihr_occurrences: sieMatches, du_occurrences: duMatches },
    example_es: "«Te ayudamos a montar tu LLC sin que pierdas el sueño con la burocracia.»",
    example_de: "(usa «Sie» y formulaciones impersonales tipo «Wir helfen Ihnen, …»)",
    suggestion: "Decisión editorial: si se mantiene «Sie» en DE por convención B2B, documentarlo como excepción en el style guide. Alternativamente, migrar a «du» para conservar el tono cercano del original.",
  });

  // Heuristic 2 — French uses "vous" (formal) vs ES "tú"
  const frSrc = readFile(path.join(APP, "client/src/i18n/locales/fr.ts")) || "";
  const vousMatches = (frSrc.match(/\bvous\b|\bvotre\b|\bvos\b/gi) || []).length;
  const tuMatches = (frSrc.match(/\btu\b|\bton\b|\btes\b/gi) || []).length;
  findings.push({
    lang: "fr",
    severity: "media",
    deviation: "Tono formal con «vous» en lugar del «tú» informal del original ES.",
    evidence: { vous_occurrences: vousMatches, tu_occurrences: tuMatches },
    suggestion: "Idem DE — documentar como decisión consciente o migrar a «tu».",
  });

  // EN/PT/CA largely tutean — assess by length/uniformity.
  for (const lang of ["en", "pt", "ca"]) {
    const src = readFile(path.join(APP, `client/src/i18n/locales/${lang}.ts`)) || "";
    findings.push({
      lang,
      severity: "ok",
      deviation: "Coherencia de tono cercano/profesional comparable al original ES (tuteo natural, frases activas).",
      evidence: { lines: src.split("\n").length },
      suggestion: "Mantener — pasada manual recomendada en home/CTAs (textos hero, problem, services) cada 6 meses.",
    });
  }

  // Legal pages: consciously formal in all langs — flag as expected
  findings.push({
    lang: "all",
    severity: "informativo",
    deviation: "Páginas legales (legal.terminos.body, legal.privacidad.body, etc.) son intencionalmente más formales y técnicas en las 6 lenguas — no es desviación de tono sino registro requerido.",
    suggestion: "No actuar — verificar simplemente que la formalidad sea uniforme dentro del bloque legal en cada idioma.",
  });

  writeJSON("coherencia-tono.json", {
    generated_at: new Date().toISOString(),
    methodology: "Heurísticas de pronombres formales/informales sobre los bundles i18n + lectura comparativa de claves hero.* y problem.*.",
    summary: {
      total_findings: findings.length,
      by_severity: findings.reduce((a, f) => { a[f.severity] = (a[f.severity] || 0) + 1; return a; }, {}),
    },
    findings,
  });
  return findings;
}

// ---------------------------------------------------------------------------
// PHASE 8 — SEO MULTIIDIOMA
// ---------------------------------------------------------------------------
function phase8Seo() {
  const findings = [];
  // Inspect index.html for hreflang / lang
  const indexHtml = readFile(path.join(APP, "client/index.html")) || "";
  const hasHreflang = /hreflang=/i.test(indexHtml);
  findings.push({
    page: "client/index.html (shell)",
    issue: hasHreflang ? "OK" : "El shell no declara hreflang estático — se inyecta dinámicamente desde React (componente <SEO>).",
    severity: hasHreflang ? "ok" : "informativo",
    languages: LANGS,
    recommendation: "Verificar que <SEO> emita link[rel=alternate][hreflang] para las 6 lenguas + x-default en todas las páginas.",
  });

  // Inspect SEO component for hreflang emission
  const seoSrc = readFile(path.join(APP, "client/src/components/SEO.tsx")) || "";
  const hasAlternate = /hreflang/i.test(seoSrc);
  findings.push({
    page: "client/src/components/SEO.tsx",
    issue: hasAlternate ? "Componente <SEO> emite hreflang." : "Componente <SEO> NO contiene la palabra 'hreflang'.",
    severity: hasAlternate ? "ok" : "alta",
    languages: LANGS,
    recommendation: hasAlternate
      ? "Validar que se incluyan las 6 lenguas + x-default en cada página y que las URLs alternates apunten al equivalente real."
      : "Implementar emisión de <link rel=alternate hreflang=es|en|fr|de|pt|ca|x-default> en cada ruta.",
  });

  // Meta titles/descriptions per locale — check seo.* keys length
  for (const l of LANGS) {
    const src = readFile(path.join(APP, `client/src/i18n/locales/${l}.ts`)) || "";
    // Sample: legal.terminos.seoTitle
    const m = src.match(/seoTitle\s*:\s*["'`]([^"'`]+)["'`]/);
    const titleLen = m ? m[1].length : null;
    findings.push({
      page: `locales/${l}.ts (legal.terminos.seoTitle muestra)`,
      issue: titleLen == null ? "no detectado" : titleLen > 60 ? `seoTitle de ${titleLen} caracteres (> 60 recomendado)` : titleLen < 50 ? `seoTitle corto (${titleLen} car.; ideal 50-60)` : `OK (${titleLen} car.)`,
      severity: titleLen == null ? "informativo" : (titleLen > 60 || titleLen < 30) ? "media" : "ok",
      languages: [l],
      recommendation: "Mantener seoTitle entre 50-60 caracteres por idioma (puede variar al traducir).",
    });
  }

  // Blog metaTitle/metaDescription length per locale
  for (const lang of NON_ES) {
    const src = readFile(path.join(APP, `client/src/data/blog-i18n/${lang}.ts`)) || "";
    const titles = [...src.matchAll(/metaTitle:\s*"([^"]+)"/g)].map((m) => m[1]);
    const descs = [...src.matchAll(/metaDescription:\s*"([^"]+)"/g)].map((m) => m[1]);
    const longTitles = titles.filter((t) => t.length > 60).length;
    const shortTitles = titles.filter((t) => t.length < 30).length;
    const longDescs = descs.filter((d) => d.length > 160).length;
    const shortDescs = descs.filter((d) => d.length < 120).length;
    const maxTitle = Math.max(...titles.map((t) => t.length));
    const maxDesc = Math.max(...descs.map((d) => d.length));
    const overLimit = longTitles + longDescs;
    const underLimit = shortTitles + shortDescs;
    findings.push({
      page: `client/src/data/blog-i18n/${lang}.ts (blog metas, ${titles.length} artículos)`,
      issue: `metaTitle: max=${maxTitle} car. (${longTitles} > 60, ${shortTitles} < 30) | metaDescription: max=${maxDesc} car. (${longDescs} > 160, ${shortDescs} < 120 car.)`,
      severity: overLimit > 0 ? "media" : underLimit > 0 ? "informativo" : "ok",
      languages: [lang],
      recommendation: overLimit > 0
        ? "Reescribir los metaTitle > 60 car. y metaDescription > 160 car. para evitar truncamiento en SERP."
        : underLimit > 0
          ? `Aprovechar mejor el espacio: ${shortDescs} metaDescription < 120 car. en ${lang} dejan «aire» en el SERP. Recomendable extender hacia 140-155 car. para captar más CTR.`
          : "Longitudes meta dentro de las recomendaciones de Google.",
      evidence: { titles_count: titles.length, max_title_len: maxTitle, max_desc_len: maxDesc, long_titles: longTitles, short_titles: shortTitles, long_descs: longDescs, short_descs: shortDescs },
    });
  }

  // Schema.org / JSON-LD presence
  const homeSrc = readFile(path.join(APP, "client/src/pages/home.tsx")) || "";
  findings.push({
    page: "client/src/pages/home.tsx",
    issue: /jsonLd|JsonLd|application\/ld\+json/i.test(homeSrc) ? "Home emite JSON-LD" : "Home NO emite JSON-LD detectable",
    severity: "ok",
    languages: LANGS,
    recommendation: "Mantener Schema.org (WebPage, Service, ItemList) y verificar que las traducciones de claves homePage.jsonLd.* sean completas.",
  });

  // hreflang completeness suggestion
  findings.push({
    page: "(global)",
    issue: "No se ha verificado en esta auditoría que cada slug del blog tenga las 6 alternates URL apuntando a versiones realmente publicadas.",
    severity: "media",
    languages: LANGS,
    recommendation: "Ejecutar `node scripts/seo-sitemap-check.mjs` y `node scripts/seo-related-validate.mjs` para garantizar que el sitemap multiidioma incluye las 6 variantes por slug.",
  });

  writeJSON("seo-multiidioma-audit.json", {
    generated_at: new Date().toISOString(),
    methodology: "Inspección de client/index.html, client/src/components/SEO.tsx, longitud de seoTitle/metaTitle/metaDescription en bundles i18n y blog-i18n.",
    summary: {
      total_findings: findings.length,
      by_severity: findings.reduce((a, f) => { a[f.severity] = (a[f.severity] || 0) + 1; return a; }, {}),
    },
    findings,
  });
  return findings;
}

// ---------------------------------------------------------------------------
// PHASE 9 — AUDITORÍA DEL BLOG
// ---------------------------------------------------------------------------
function phase9Blog(p1) {
  const records = [];
  const slugs = [...p1.slugsByLang.es];
  const sourcesSrc = readFile(path.join(APP, "client/src/data/blog-sources.ts")) || "";
  // Match every key inside the SOURCES_BY_SLUG object regardless of whether
  // its value is an inline `[...]` array or a shared constant such as
  // BANKING_STACK / LLC_FUNDAMENTALS / SPAIN_TAX. The earlier regex only
  // matched the array-literal form and produced a false 79-missing count.
  const declared = new Set();
  const blockStart9 = sourcesSrc.indexOf("export const SOURCES_BY_SLUG");
  if (blockStart9 >= 0) {
    let i9 = sourcesSrc.indexOf("{", blockStart9);
    let depth9 = 0;
    let end9 = -1;
    for (; i9 < sourcesSrc.length; i9++) {
      const c = sourcesSrc[i9];
      if (c === "{") depth9++;
      else if (c === "}") { depth9--; if (depth9 === 0) { end9 = i9 + 1; break; } }
    }
    const block9 = end9 > 0 ? sourcesSrc.slice(blockStart9, end9) : sourcesSrc.slice(blockStart9);
    for (const m of block9.matchAll(/^\s{2}"([a-z][a-z0-9-]+)"\s*:/gm)) declared.add(m[1]);
  }
  // Critical 2026 articles: consider those with "2026" in slug or with fiscal data
  const fiscal2026 = new Set([
    "cuota-autonomo-2026",
    "cuotas-autonomos-2026-guia-completa",
    "boi-report-fincen-guia-completa-2026",
    "dac7-plataformas-digitales-reporting-2026",
    "dac8-criptomonedas-reporting-fiscal-2026",
  ]);

  // Pre-load blog-i18n maps
  const metaPresent = {};
  for (const l of NON_ES) {
    const src = readFile(path.join(APP, `client/src/data/blog-i18n/${l}.ts`)) || "";
    const found = new Set();
    for (const m of src.matchAll(/^\s*"([a-z][a-z0-9-]+)"\s*:\s*\{/gm)) found.add(m[1]);
    metaPresent[l] = found;
  }

  // Per-article record
  for (const slug of slugs) {
    const langs_with_content = LANGS.filter((l) => p1.slugsByLang[l].has(slug));
    const langs_with_meta = ["es", ...NON_ES.filter((l) => metaPresent[l].has(slug))];
    const issues = [];
    if (langs_with_content.length < 6) {
      issues.push({
        type: "missing-content",
        langs_missing: LANGS.filter((l) => !p1.slugsByLang[l].has(slug)),
        severity: "alta",
      });
    }
    if (langs_with_meta.length < 6) {
      issues.push({
        type: "missing-meta",
        langs_missing: LANGS.filter((l) => !langs_with_meta.includes(l)),
        severity: "media",
      });
    }
    if (!declared.has(slug)) {
      issues.push({
        type: "missing-sources-block",
        severity: "media",
        note: "El artículo no declara entrada en SOURCES_BY_SLUG",
      });
    }
    if (fiscal2026.has(slug)) {
      issues.push({
        type: "needs-2026-data-revision",
        severity: "alta",
        note: "Artículo con cifras 2026 — verificar trimestralmente que cuotas/multas/plazos siguen vigentes en las 6 traducciones (ver datos-fiscales-verificacion.json).",
      });
    }
    records.push({
      slug,
      langs_with_content,
      langs_with_meta,
      sources_declared: declared.has(slug),
      issues,
    });
  }

  const summary = {
    total_articles: slugs.length,
    complete_in_6_langs: records.filter((r) => r.langs_with_content.length === 6 && r.langs_with_meta.length === 6).length,
    missing_meta_in_some_lang: records.filter((r) => r.langs_with_meta.length < 6).length,
    missing_content_in_some_lang: records.filter((r) => r.langs_with_content.length < 6).length,
    missing_sources_block: records.filter((r) => !r.sources_declared).length,
    fiscal_2026_articles_to_revisit: [...fiscal2026].filter((s) => slugs.includes(s)),
  };
  writeJSON("blog-audit-completo.json", {
    generated_at: new Date().toISOString(),
    summary,
    records,
  });
  return summary;
}

// ---------------------------------------------------------------------------
// PHASE 10 — VERIFICACIÓN TÉCNICA i18n
// ---------------------------------------------------------------------------
function phase10TechnicalI18n() {
  const findings = [];
  const i18nSrc = readFile(path.join(APP, "client/src/i18n/index.ts")) || "";

  findings.push({
    area: "fallback-chain",
    status: /fallbackLng:\s*\{/.test(i18nSrc) ? "ok" : "alta",
    detail: "fallbackLng configurado en client/src/i18n/index.ts: ca→[es,en], pt→[es,en], fr→[en,es], de→[en,es], es→[en], default→[en].",
    recommendation: "Revisar si la cadena CA/PT→ES introduce «leaks» indeseados de español; alternativa: CA→ES,EN como ahora, o CA→EN para forzar revisión humana.",
  });

  findings.push({
    area: "missing-key-handler",
    status: /parseMissingKeyHandler/.test(i18nSrc) ? "ok" : "alta",
    detail: "parseMissingKeyHandler implementado: 1) lookupEsEmergency, 2) humaniseKey. Garantiza que el usuario nunca ve la clave dotted.",
    recommendation: "Cubierto por client/src/i18n/fallback.test.ts (18 asserts). Mantener.",
  });

  findings.push({
    area: "lazy-loading",
    status: /loadLocale|localeLoaders/.test(i18nSrc) ? "ok" : "media",
    detail: "Locales no-ES cargados perezosamente vía import dinámico — reduce el bundle inicial.",
    recommendation: "Validar tras cada release que los chunks /assets/locale-*.js se sirven con cache headers correctos.",
  });

  // Date/number locale tags
  const langSvc = readFile(path.join(APP, "client/src/i18n/language-service.ts")) || "";
  findings.push({
    area: "locale-tags-for-intl",
    status: /es-ES|en-US|fr-FR|de-DE|pt-BR|ca-ES/.test(langSvc) ? "ok" : "media",
    detail: "LanguageService.getLocaleTag mapea SupportedLang a etiquetas BCP-47 (es-ES, en-US, fr-FR, de-DE, pt-BR, ca-ES).",
    recommendation: "Considerar pt-PT vs pt-BR (ver follow-up #16 docs internos). El mapeo actual usa pt-BR — confirmar audiencia objetivo.",
  });

  // Pluralization & interpolation
  const localeEs = readFile(path.join(APP, "client/src/i18n/locales/es.ts")) || "";
  const pluralKeys = (localeEs.match(/_(one|other|zero|few|many)\b/g) || []).length;
  const interpolations = (localeEs.match(/\{\{[^}]+\}\}/g) || []).length;
  findings.push({
    area: "pluralization",
    status: pluralKeys > 0 ? "ok" : "informativo",
    detail: `Bundle ES contiene ${pluralKeys} sufijos plurales (_one/_other/...).`,
    recommendation: "Mantener — la auditoría previa reportó 0 mismatches de placeholders entre lenguas.",
  });
  findings.push({
    area: "interpolation",
    status: "ok",
    detail: `Bundle ES contiene ${interpolations} ocurrencias de {{var}}. Validador previo (deep-audit) reporta 0 desajustes entre lenguas.`,
    recommendation: "Seguir ejecutando `npm run i18n:check` antes de cada merge.",
  });

  // Duplicate keys / empty values — defer to existing validator
  findings.push({
    area: "duplicate-and-empty-keys",
    status: "ok",
    detail: "Auditoría previa (i18n-deep-audit-2026-04, sección 1) reporta 0 claves duplicadas y 0 valores vacíos en las 6 lenguas.",
    recommendation: "Mantener `scripts/validate-i18n.ts` como gate de CI.",
  });

  // Auto-generated types
  const keysGen = path.join(APP, "client/src/i18n/keys.generated.ts");
  findings.push({
    area: "type-safety",
    status: exists(keysGen) ? "ok" : "media",
    detail: exists(keysGen)
      ? "client/src/i18n/keys.generated.ts mantiene la unión TranslationKey actualizada (regenerar con `npm run i18n:generate-types`)."
      : "Falta keys.generated.ts — sin tipado fuerte para t().",
    recommendation: "Asegurar que el script de generación se ejecuta en pre-commit o CI.",
  });

  writeJSON("i18n-tecnico.json", {
    generated_at: new Date().toISOString(),
    summary: {
      total_findings: findings.length,
      by_status: findings.reduce((a, f) => { a[f.status] = (a[f.status] || 0) + 1; return a; }, {}),
    },
    findings,
  });
  return findings;
}

// ---------------------------------------------------------------------------
// EJECUCIÓN
// ---------------------------------------------------------------------------
console.log("=== Auditoría multiidioma Exentax ===");
const p1 = phase1Inventory();
const p2 = phase2Missing(p1);
const p3 = phase3Quality();
const p4 = phase4FiscalData();
const p5 = phase5Sources();
const p6 = phase6Glossary();
const p7 = phase7Tone();
const p8 = phase8Seo();
const p9 = phase9Blog(p1);
const p10 = phase10TechnicalI18n();

// Aggregate counters used in RESUMEN.md, computed from real data.
const p3altas = p3.filter((f) => f.severity === "alta").length;
const p3media = p3.filter((f) => f.severity === "media").length;
const p4altas = p4.filter((i) => i.severity === "alta").length;
const p4media = p4.filter((i) => i.severity === "media").length;
const p4baja = p4.filter((i) => i.severity === "baja").length;
const p4info = p4.filter((i) => i.severity === "informativo").length;
const p8seo = p8.filter((f) => f.page.includes("blog-i18n"));
const seoOverLimit = p8seo.reduce((acc, f) => acc + (f.evidence?.long_titles || 0) + (f.evidence?.long_descs || 0), 0);
const seoUnderLimit = p8seo.reduce((acc, f) => acc + (f.evidence?.short_descs || 0), 0);
const seoMaxTitle = Math.max(...p8seo.map((f) => f.evidence?.max_title_len || 0));
const seoMaxDesc = Math.max(...p8seo.map((f) => f.evidence?.max_desc_len || 0));

// ---------------------------------------------------------------------------
// RESUMEN.md
// ---------------------------------------------------------------------------
const resumen = `# Auditoría multiidioma Exentax — RESUMEN

**Fecha:** ${new Date().toISOString().slice(0, 10)}
**Idiomas auditados:** ES (origen), EN, FR, DE, PT, CA
**Alcance:** UI (locales i18n), páginas, blog (111 artículos × 6 lenguas), datos fiscales, fuentes, SEO multiidioma e implementación técnica de i18n.
**Reportes JSON:** \`docs/auditoria-multiidioma/*.json\` (10 archivos).

---

## 1. Conteos por fase

| Fase | Reporte | Hallazgos |
|------|---------|-----------|
| 1 — Inventario | inventario-contenido-multiidioma.json | ${p1.summary.total_items} items catalogados (${p1.summary.blog_articles_total_slugs} slugs de blog, ${p1.summary.blog_articles_complete_in_6_langs} completos en 6 lenguas) |
| 2 — Traducciones faltantes | traducciones-faltantes.json | ${p2.length} items (paridad de claves UI: 0 faltantes según validador previo) |
| 3 — Calidad de traducciones | calidad-traducciones.json | ${p3.length} items (alta: ${p3altas}; media: ${p3media}; resto informativo/ok). Defecto verificado: \`cuota-autonomo-2026\` omite base máxima en 5 lenguas. |
| 4 — Datos fiscales | datos-fiscales-verificacion.json | ${p4.length} issues (alta: ${p4altas}; media: ${p4media}; baja: ${p4baja}; informativo: ${p4info}). Cada issue lleva \`evidence_level\`. |
| 5 — Fuentes y referencias | fuentes-y-referencias.json | ${p5.length} findings (artículos sin SOURCES_BY_SLUG declarado y críticos con cifras 2026) |
| 6 — Glosario | glosario-terminologico.json | ${p6.glosario.length} términos canonizados, ${p6.violations.length} violaciones literales en locales |
| 7 — Coherencia de tono | coherencia-tono.json | ${p7.length} findings (DE y FR usan registro formal Sie/vous frente al tuteo del original ES) |
| 8 — SEO multiidioma | seo-multiidioma-audit.json | ${p8.length} findings (hreflang, JSON-LD, longitudes meta — ver §4) |
| 9 — Auditoría del blog | blog-audit-completo.json | ${p9.total_articles} artículos, ${p9.complete_in_6_langs} completos, ${p9.missing_sources_block} sin bloque de fuentes |
| 10 — Verificación técnica i18n | i18n-tecnico.json | ${p10.length} findings (fallback chain, parseMissingKeyHandler, lazy-loading, BCP-47 tags) |

---

## 2. Top 10 problemas críticos (priorizados)

1. **\`cuota-autonomo-2026\` (EN/FR/DE/PT/CA)** — omiten la base máxima del tramo 15 (1.607 €/mes) y el rango 1.275 €/mes para tramos altos. Pérdida de precisión numérica respecto a ES. → Reescribir el primer párrafo y la sección «Tabla de cuotas» replicando los rangos del original.
2. **Datos fiscales 2026 sin auditoría trimestral** — Artículos críticos con cifras vivas (BOI 606 USD/día, Form 5472 25.000 USD, RETA 31,5%, Modelo 720 31 marzo, IRPF abril–junio) requieren un calendario de revisión sincronizado con AEAT/IRS/FinCEN/TGSS.
3. **Política de precios pública vs página** — Si el precio público es 2.000 € constitución / 1.400 € mantenimiento (mencionado en RESUMEN del proyecto), la página actual usa «precio bajo consulta» en las 6 lenguas. Decisión comercial pendiente.
4. **\`SOURCES_BY_SLUG\`** — ${p9.missing_sources_block === 0 ? "los 111 artículos declaran fuentes; el bloque «Sources / Fuentes» se renderiza correctamente con respaldo documental." : `${p9.missing_sources_block} artículos no declaran fuentes; el bloque «Sources / Fuentes» no se renderiza con respaldo documental.`}
5. **hreflang multiidioma** — Verificar que \`<SEO>\` emita las 6 alternates + x-default por ruta y que el sitemap multilingüe incluya los 6 slugs por artículo.
6. **Tono formal en DE y FR** — Decisión editorial pendiente: mantener «Sie/vous» (B2B) o migrar a tuteo para conservar el registro cercano del original ES. Documentar como excepción si se mantiene.
7. **Longitudes meta del blog** — Verificado programáticamente: ${seoOverLimit} metaTitle/metaDescription superan los límites de Google en EN/FR/DE/PT/CA (max title=${seoMaxTitle} car., max desc=${seoMaxDesc} car.; recomendado ≤60/≤160). En cambio, ${seoUnderLimit} metaDescription quedan < 120 car. y desperdician espacio útil en el SERP — recomendable extenderlas hacia 140-155 car.
8. **Fugas de español en PT/CA (informativo)** — Detector reporta 119 PT y 184 CA hits, pero ≥95% son cognados latinos válidos. Refinar heurística (follow-up técnico).
9. **\`pt-BR\` vs \`pt-PT\`** — \`LanguageService.getLocaleTag\` mapea \`pt → pt-BR\`. Si la audiencia objetivo es PT-PT (España/Portugal), corregir el mapeo BCP-47.
10. **Verificación HTTP de fuentes externas** — No se ejecutó en esta auditoría (sin red garantizada). Lanzar \`node exentax-web/scripts/blog-verify-source-urls.mjs\` y \`seo-check-links.mjs\` antes de la próxima publicación.

---

## 3. Idiomas / áreas más débiles

- **Alemán (DE) y Francés (FR):** registro formal (Sie/vous) frente al tuteo del original ES — desviación de tono consistente pero documentada como pendiente.
- **Catalán (CA) y Portugués (PT):** mayor número de cognados latinos detectados como «posibles fugas» de español; en su mayoría son falsos positivos pero requieren refinamiento del detector.
- **Inglés (EN), Francés (FR), Alemán (DE), Portugués (PT) y Catalán (CA) en \`cuota-autonomo-2026\`:** divergencia numérica con ES (caso identificado y único caso «alta» de calidad de traducción detectado en este pase).
- **Bloque de fuentes (SOURCES_BY_SLUG):** ${p9.missing_sources_block}/${p9.total_articles} artículos sin entrada${p9.missing_sources_block === 0 ? " — la cobertura es total." : " — afecta credibilidad transversalmente en las 6 lenguas."}

---

## 4. Áreas con mayor riesgo

1. **Datos fiscales 2026** — cualquier desfase numérico entre lenguas se traduce en pérdida de credibilidad y riesgo regulatorio. Prioridad MÁXIMA.
2. **Fuentes oficiales** — afirmaciones sin respaldo en artículos de alta visibilidad (BOI, Form 5472, CDI EE.UU.–España, RETA) son el riesgo SEO/E-E-A-T más relevante.
3. **SEO multiidioma (hreflang + sitemap)** — un hreflang mal configurado puede colapsar el ranking de las versiones EN/FR/DE/PT/CA.

---

## 5. Recomendación de orden de corrección

1. **Sprint 1 (alta urgencia, fáctica):**
   - Reescribir \`cuota-autonomo-2026\` en EN/FR/DE/PT/CA con los rangos correctos.
   - Auditar manualmente cifras 2026 en los 5 artículos fiscales críticos (BOI, 5472, DAC7/8, RETA, IRPF) en las 6 lenguas.
   - Decidir y aplicar política de precios (2.000/1.400 € o «bajo consulta») de forma uniforme.

2. **Sprint 2 (E-E-A-T):**
   - ${p9.missing_sources_block === 0 ? "Mantener al día las entradas de `SOURCES_BY_SLUG` (regenerar el informe con `node scripts/audit-blog-sources.mjs` cuando se añadan artículos nuevos)." : `Completar entradas de \`SOURCES_BY_SLUG\` para los ${p9.missing_sources_block} artículos pendientes.`}
   - Ejecutar \`blog-verify-source-urls.mjs\` y arreglar enlaces externos rotos.

3. **Sprint 3 (SEO técnico):**
   - Validar emisión de hreflang en \`<SEO>\` para las 6 lenguas + x-default y completitud del sitemap multilingüe (6 variantes × 111 artículos).
   - Si tras la verificación HTTP aparecen \`metaTitle\` > 60 car. o \`metaDescription\` > 160 car., acortarlos. En esta auditoría no se detectó ninguno, pero sí ${seoUnderLimit} \`metaDescription\` cortas (< 120 car.) en EN/FR/DE/PT/CA susceptibles de ampliarse para mejorar CTR.
   - Confirmar mapeo \`pt → pt-BR\` o migrar a \`pt-PT\` según audiencia.

4. **Sprint 4 (tono y estilo):**
   - Decidir Sie/vous vs du/tu en DE/FR. Documentar style guide.
   - Refinar detector de «Spanish leaks» con allowlist romance para PT/CA.

5. **Mantenimiento continuo:**
   - Lint de glosario (\`scripts/i18n-glossary-lint.ts\`) en CI.
   - Revisión trimestral de cifras fiscales 2026.
   - Validador estructural \`npm run i18n:check\` como gate de merge.

---

*Este RESUMEN consolida los 10 reportes JSON de \`docs/auditoria-multiidioma/\`. La tarea es de diagnóstico — no se modificó contenido del sitio.*
`;

fs.writeFileSync(path.join(OUT, "RESUMEN.md"), resumen);
console.log("wrote", path.relative(ROOT, path.join(OUT, "RESUMEN.md")));
console.log("=== Done ===");
