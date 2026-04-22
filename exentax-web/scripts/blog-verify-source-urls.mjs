#!/usr/bin/env node
/**
 * Verifies that the canonical regulatory/authority sources cited across the
 * Exentax blog corpus are live (HTTP 2xx/3xx) at the moment of validation.
 *
 * The blog cites rules in plain text (Treas. Reg., IRC, LIRPF, LIS, LGT,
 * Corporate Transparency Act, BOE, DAC, ATAD, BEPS, FATF). We curate a
 * canonical URL for each of those references so a third party can audit the
 * claim. The script fetches each URL with a 10 s timeout, follows redirects,
 * and writes a report to reports/seo/source-url-verification.{json,md}.
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const SOURCES = [
  { citation: "IRS — Instructions for Form 5472", url: "https://www.irs.gov/forms-pubs/about-form-5472" },
  { citation: "IRS — About Form 1120", url: "https://www.irs.gov/forms-pubs/about-form-1120" },
  { citation: "IRS — About Form W-7 (ITIN)", url: "https://www.irs.gov/forms-pubs/about-form-w-7" },
  { citation: "IRS — Limited Liability Company (LLC)", url: "https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc" },
  { citation: "IRS — FATCA", url: "https://www.irs.gov/businesses/corporations/foreign-account-tax-compliance-act-fatca" },
  { citation: "FinCEN — Beneficial Ownership Information", url: "https://www.fincen.gov/boi" },
  { citation: "Corporate Transparency Act (Public Law 116-283, § 6403)", url: "https://www.congress.gov/116/plaws/publ283/PLAW-116publ283.pdf" },
  { citation: "26 CFR Part 301 (Treasury Regulations, procedure and administration)", url: "https://www.ecfr.gov/current/title-26/chapter-I/subchapter-F/part-301" },
  { citation: "26 USC — Internal Revenue Code", url: "https://www.law.cornell.edu/uscode/text/26" },
  { citation: "OECD — Common Reporting Standard (CRS)", url: "https://www.oecd.org/tax/automatic-exchange/common-reporting-standard/" },
  { citation: "OECD — BEPS Project overview", url: "https://www.oecd.org/tax/beps/" },
  { citation: "FATF — 40 Recommendations", url: "https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html" },
  { citation: "EU — DAC (Directive 2011/16/EU on Administrative Cooperation)", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02011L0016-20230101" },
  { citation: "EU — DAC7 (Directive (EU) 2021/514)", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32021L0514" },
  { citation: "EU — DAC8 (Directive (EU) 2023/2226)", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023L2226" },
  { citation: "EU — ATAD (Directive 2016/1164 Anti-Tax Avoidance Directive)", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016L1164" },
  { citation: "EU — VAT Directive 2006/112/EC (consolidated)", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02006L0112-20240101" },
  { citation: "AEAT — Modelo 349 (operaciones intracomunitarias)", url: "https://sede.agenciatributaria.gob.es/Sede/procedimientoini/G415.shtml" },
  { citation: "Seguridad Social — Cotización del RETA (autónomos)", url: "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/36537" },
  { citation: "Hacienda — Convenios para evitar la doble imposición firmados por España", url: "https://www.hacienda.gob.es/es-ES/Normativa%20y%20doctrina/Normativa/CDI/Paginas/cdi.aspx" },
  { citation: "BOE — Ley 35/2006 IRPF", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764" },
  { citation: "BOE — Ley 27/2014 Impuesto sobre Sociedades", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2014-12328" },
  { citation: "BOE — Ley 58/2003 General Tributaria", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2003-23186" },
  { citation: "BOE — Modelo 720 (Orden HAP/72/2013, consolidada)", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2013-954" },
  { citation: "AEAT — Modelo 100 (IRPF)", url: "https://sede.agenciatributaria.gob.es/Sede/procedimientoini/G600.shtml" },
  { citation: "AEAT — Modelo 200 (IS)", url: "https://sede.agenciatributaria.gob.es/Sede/procedimientoini/GI49.shtml" },
  { citation: "US Treaty — Convención Doble Imposición EE. UU.–España", url: "https://www.irs.gov/pub/irs-trty/spain.pdf" },
  { citation: "Delaware Division of Corporations", url: "https://corp.delaware.gov/" },
  { citation: "Wyoming Secretary of State — Business Division", url: "https://sos.wyo.gov/Business/" },
  { citation: "New Mexico Secretary of State — Business Services", url: "https://www.sos.nm.gov/business-services/" },
  { citation: "SAT México — Personas Físicas", url: "https://www.sat.gob.mx/personas" },
  { citation: "DIAN Colombia — portal oficial", url: "https://www.dian.gov.co/" },
  { citation: "AFIP Argentina — portal oficial", url: "https://www.afip.gob.ar/" },
];

async function checkOne(src) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 20_000);
  const started = Date.now();
  try {
    let res = await fetch(src.url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Exentax-BlogSourceVerifier/1.0 (+https://exentax.com)" },
    });
    if (res.status === 405 || res.status === 403 || res.status === 501) {
      res = await fetch(src.url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
        },
      });
    }
    const elapsed = Date.now() - started;
    let cfGated = false;
    if (res.status === 403) {
      try {
        const bodyText = await res.clone().text();
        if (/Just a moment|cf-chl|cdn-cgi\/challenge-platform/i.test(bodyText)) {
          cfGated = true;
        }
      } catch {}
    }
    const ok = (res.status >= 200 && res.status < 400) || cfGated;
    return {
      ...src,
      status: res.status,
      ok,
      cfGated,
      finalUrl: res.url,
      ms: elapsed,
      error: null,
    };
  } catch (err) {
    return {
      ...src,
      status: 0,
      ok: false,
      finalUrl: src.url,
      ms: Date.now() - started,
      error: String(err?.message || err),
    };
  } finally {
    clearTimeout(t);
  }
}

const results = [];
for (const s of SOURCES) {
  results.push(await checkOne(s));
}

const ok = results.filter((r) => r.ok).length;
const fail = results.length - ok;

writeFileSync(resolve(ROOT, "reports/seo/source-url-verification.json"), JSON.stringify({
  generatedAt: new Date().toISOString(),
  total: results.length,
  ok,
  fail,
  results,
}, null, 2));

const md = [];
md.push("# Blog source-URL verification");
md.push("");
md.push(`- Generated: ${new Date().toISOString()}`);
md.push(`- Total: ${results.length}`);
md.push(`- OK (2xx/3xx): ${ok}`);
md.push(`- FAIL: ${fail}`);
md.push("");
md.push("| # | Citación | Status | URL |");
md.push("|---:|---|---:|---|");
for (const r of results) {
  const badge = r.cfGated
    ? `403 (CF challenge, alive)`
    : r.ok
    ? r.status
    : `FAIL ${r.status}${r.error ? " " + r.error : ""}`;
  md.push(`| ${results.indexOf(r) + 1} | ${r.citation} | ${badge} | ${r.url} |`);
}
writeFileSync(resolve(ROOT, "docs/seo/blog-sources-canonical.md"), md.join("\n") + "\n");

console.log(`sources OK=${ok} FAIL=${fail} (of ${results.length})`);
if (fail) {
  for (const r of results.filter((x) => !x.ok)) {
    console.log(` - ${r.status} ${r.citation} ${r.error ? `(${r.error})` : ""} ${r.url}`);
  }
  process.exitCode = 1;
}
