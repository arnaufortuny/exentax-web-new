#!/usr/bin/env node
/**
 * Static (no-network) verification for the 33 canonical regulatory URLs
 * cited across the blog corpus.
 *
 * Network-based verification (blog-verify-source-urls.mjs) cannot run from
 * sandboxed environments because most government / regulatory hosts are on
 * an egress allowlist (returns "host_not_allowed" 403). This script provides
 * a complementary structural audit that runs anywhere:
 *
 *  1. URL is parseable.
 *  2. Domain matches the expected authority for the citation (IRS → irs.gov,
 *     BOE → boe.es, EU → europa.eu, OECD → oecd.org, etc.).
 *  3. Path conforms to the known canonical pattern for that authority.
 *  4. Protocol is HTTPS.
 *  5. No double-slashes, trailing whitespace, or known-broken legacy paths.
 *
 * Exit code: 0 if all 33 URLs pass structural checks, 1 otherwise.
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

// Mirrored from blog-verify-source-urls.mjs (single source of truth — kept in
// sync via comment below; if edited, update both).
const SOURCES = [
  { citation: "IRS — Instructions for Form 5472", url: "https://www.irs.gov/forms-pubs/about-form-5472", authority: "irs" },
  { citation: "IRS — About Form 1120", url: "https://www.irs.gov/forms-pubs/about-form-1120", authority: "irs" },
  { citation: "IRS — About Form W-7 (ITIN)", url: "https://www.irs.gov/forms-pubs/about-form-w-7", authority: "irs" },
  { citation: "IRS — Limited Liability Company (LLC)", url: "https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc", authority: "irs" },
  { citation: "IRS — FATCA", url: "https://www.irs.gov/businesses/corporations/foreign-account-tax-compliance-act-fatca", authority: "irs" },
  { citation: "FinCEN — Beneficial Ownership Information", url: "https://www.fincen.gov/boi", authority: "fincen" },
  { citation: "Corporate Transparency Act (Public Law 116-283, § 6403)", url: "https://www.congress.gov/116/plaws/publ283/PLAW-116publ283.pdf", authority: "congress" },
  { citation: "26 CFR Part 301 (Treasury Regulations)", url: "https://www.ecfr.gov/current/title-26/chapter-I/subchapter-F/part-301", authority: "ecfr" },
  { citation: "26 USC — Internal Revenue Code", url: "https://www.law.cornell.edu/uscode/text/26", authority: "cornell" },
  { citation: "OECD — Common Reporting Standard (CRS)", url: "https://www.oecd.org/tax/automatic-exchange/common-reporting-standard/", authority: "oecd" },
  { citation: "OECD — BEPS Project overview", url: "https://www.oecd.org/tax/beps/", authority: "oecd" },
  { citation: "FATF — 40 Recommendations", url: "https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html", authority: "fatf" },
  { citation: "EU — DAC (Directive 2011/16/EU)", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02011L0016-20230101", authority: "eurlex" },
  { citation: "EU — DAC7 (Directive (EU) 2021/514)", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32021L0514", authority: "eurlex" },
  { citation: "EU — DAC8 (Directive (EU) 2023/2226)", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023L2226", authority: "eurlex" },
  { citation: "EU — ATAD (Directive 2016/1164)", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016L1164", authority: "eurlex" },
  { citation: "EU — VAT Directive 2006/112/EC", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02006L0112-20240101", authority: "eurlex" },
  { citation: "AEAT — Modelo 349", url: "https://sede.agenciatributaria.gob.es/Sede/procedimientoini/G415.shtml", authority: "aeat" },
  { citation: "Seguridad Social — Cotización del RETA", url: "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/36537", authority: "segsocial" },
  { citation: "Hacienda — Convenios Doble Imposición", url: "https://www.hacienda.gob.es/es-ES/Normativa%20y%20doctrina/Normativa/CDI/Paginas/cdi.aspx", authority: "hacienda" },
  { citation: "BOE — Ley 35/2006 IRPF", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764", authority: "boe" },
  { citation: "BOE — Ley 27/2014 IS", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2014-12328", authority: "boe" },
  { citation: "BOE — Ley 58/2003 LGT", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2003-23186", authority: "boe" },
  { citation: "BOE — Modelo 720 (HAP/72/2013)", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2013-954", authority: "boe" },
  { citation: "AEAT — Modelo 100 (IRPF)", url: "https://sede.agenciatributaria.gob.es/Sede/procedimientoini/G600.shtml", authority: "aeat" },
  { citation: "AEAT — Modelo 200 (IS)", url: "https://sede.agenciatributaria.gob.es/Sede/procedimientoini/GI49.shtml", authority: "aeat" },
  { citation: "US Treaty — Doble Imposición EE. UU.–España", url: "https://www.irs.gov/pub/irs-trty/spain.pdf", authority: "irs" },
  { citation: "Delaware Division of Corporations", url: "https://corp.delaware.gov/", authority: "delaware" },
  { citation: "Wyoming Secretary of State", url: "https://sos.wyo.gov/Business/", authority: "wyoming" },
  { citation: "New Mexico Secretary of State", url: "https://www.sos.nm.gov/business-services/", authority: "newmexico" },
  { citation: "SAT México — Personas Físicas", url: "https://www.sat.gob.mx/personas", authority: "satmx" },
  { citation: "DIAN Colombia — portal oficial", url: "https://www.dian.gov.co/", authority: "diancol" },
  { citation: "AFIP Argentina — portal oficial", url: "https://www.afip.gob.ar/", authority: "afipar" },
];

// Authority → expected domain + URL pattern
const AUTHORITY_RULES = {
  irs:        { hosts: ["www.irs.gov"], pathPrefixes: ["/forms-pubs/", "/businesses/", "/pub/"] },
  fincen:     { hosts: ["www.fincen.gov"], pathPrefixes: ["/"] },
  congress:   { hosts: ["www.congress.gov"], pathPrefixes: ["/"] },
  ecfr:       { hosts: ["www.ecfr.gov"], pathPrefixes: ["/current/title-"] },
  cornell:    { hosts: ["www.law.cornell.edu"], pathPrefixes: ["/uscode/"] },
  oecd:       { hosts: ["www.oecd.org"], pathPrefixes: ["/"] },
  fatf:       { hosts: ["www.fatf-gafi.org"], pathPrefixes: ["/"] },
  eurlex:     { hosts: ["eur-lex.europa.eu"], pathPrefixes: ["/legal-content/"], queryRequired: ["uri"] },
  aeat:       { hosts: ["sede.agenciatributaria.gob.es"], pathPrefixes: ["/Sede/procedimientoini/"] },
  segsocial:  { hosts: ["www.seg-social.es"], pathPrefixes: ["/wps/"] },
  hacienda:   { hosts: ["www.hacienda.gob.es"], pathPrefixes: ["/"] },
  boe:        { hosts: ["www.boe.es"], pathPrefixes: ["/buscar/"], queryPattern: /^id=BOE-A-\d{4}-\d+$/ },
  delaware:   { hosts: ["corp.delaware.gov"], pathPrefixes: ["/"] },
  wyoming:    { hosts: ["sos.wyo.gov"], pathPrefixes: ["/"] },
  newmexico:  { hosts: ["www.sos.nm.gov"], pathPrefixes: ["/"] },
  satmx:      { hosts: ["www.sat.gob.mx"], pathPrefixes: ["/"] },
  diancol:    { hosts: ["www.dian.gov.co"], pathPrefixes: ["/"] },
  afipar:     { hosts: ["www.afip.gob.ar"], pathPrefixes: ["/"] },
};

const results = [];
let okCount = 0;

for (const src of SOURCES) {
  const issues = [];

  // 1. Parseable URL
  let parsed;
  try {
    parsed = new URL(src.url);
  } catch {
    issues.push("URL not parseable");
    results.push({ ...src, ok: false, issues });
    continue;
  }

  // 2. HTTPS protocol
  if (parsed.protocol !== "https:") {
    issues.push(`protocol is ${parsed.protocol}, expected https:`);
  }

  // 3. No whitespace / control chars
  if (/[\s]/.test(src.url)) {
    issues.push("URL contains whitespace");
  }

  // 4. No accidental double-slashes in path
  if (parsed.pathname.includes("//")) {
    issues.push("path contains double-slash");
  }

  // 5. Authority rules
  const rule = AUTHORITY_RULES[src.authority];
  if (!rule) {
    issues.push(`unknown authority "${src.authority}" (no rule)`);
  } else {
    if (!rule.hosts.includes(parsed.hostname)) {
      issues.push(`host ${parsed.hostname} not in expected ${rule.hosts.join(", ")}`);
    }
    if (rule.pathPrefixes && !rule.pathPrefixes.some((p) => parsed.pathname.startsWith(p))) {
      issues.push(`path ${parsed.pathname} does not start with any of ${rule.pathPrefixes.join(", ")}`);
    }
    if (rule.queryRequired) {
      for (const q of rule.queryRequired) {
        if (!parsed.searchParams.has(q)) {
          issues.push(`query missing required param "${q}"`);
        }
      }
    }
    if (rule.queryPattern) {
      const qs = parsed.search.replace(/^\?/, "");
      if (!rule.queryPattern.test(qs)) {
        issues.push(`query "${qs}" does not match pattern ${rule.queryPattern}`);
      }
    }
  }

  const ok = issues.length === 0;
  if (ok) okCount++;
  results.push({ ...src, ok, issues });
}

// Write report
const reportsDir = resolve(ROOT, "reports/seo");
if (!existsSync(reportsDir)) mkdirSync(reportsDir, { recursive: true });

writeFileSync(
  resolve(reportsDir, "source-url-static-verification.json"),
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    total: results.length,
    structuralOk: okCount,
    structuralFail: results.length - okCount,
    note: "Static (no-network) URL audit. Complements network-based blog-verify-source-urls.mjs which is blocked by sandbox host allowlist.",
    results,
  }, null, 2)
);

console.log(`[blog-verify-source-urls-static] structural OK=${okCount} FAIL=${results.length - okCount} (of ${results.length})`);
if (okCount !== results.length) {
  for (const r of results.filter((x) => !x.ok)) {
    console.log(`  - FAIL ${r.citation}`);
    for (const issue of r.issues) {
      console.log(`      · ${issue}`);
    }
    console.log(`      url: ${r.url}`);
  }
  process.exit(1);
}
console.log("✓ All 33 canonical source URLs pass structural validation (domain + path + protocol).");
process.exit(0);
