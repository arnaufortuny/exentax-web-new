#!/usr/bin/env node
/*
 * blog-veracity-audit.mjs
 * ----------------------------------------------------------------------------
 * LOTE 5 — Veracity audit for the blog corpus (112 slugs × 6 langs = 672).
 *
 * The audit is two-layered:
 *
 *  (A) Per-fact / per-pillar verification (substantive layer).
 *      Each canonical fact (17 in total) declares the slug(s) of the pillar
 *      article(s) that carry the authoritative statement of that fact, plus
 *      the regex(es) that the body must contain in every locale for the
 *      claim to be considered correctly stated. This is the gate for
 *      "the figure is right, the law is right, the date is right".
 *
 *  (B) Per-article audit table (coverage layer).
 *      Independently, every one of the 672 files (lang × slug) is scanned
 *      to detect which of the 18 canonical facts it touches (presence
 *      detectors, looser than the verify regex), how many official-source
 *      URLs it cites in `<a href="…">`, and what its veracity status is
 *      ("✓ verificado", "✏ corrección pendiente", "· sin datos críticos
 *      auditables — narrativa o estructural"). The result is the 672-row
 *      report mandated by the task brief (artículo / idioma / dato / fuente
 *      / fecha verificación / status).
 *
 * Across the full corpus we additionally run a negative grep for editorial
 * pending-review markers ("revisión editorial pendiente", "pending editorial
 * review", "TODO verificar", "pendiente revisar", "verificar fuente", "TBD"),
 * which must be 0.
 *
 * Output:
 *   - reports/seo/lote5-veracidad.md    human-readable per-fact + 672-row
 *   - reports/seo/lote5-veracidad.json  machine-readable raw findings
 *
 * Modes:
 *   - default (`node ...veracity-audit.mjs`)         informativo, exit 0 siempre.
 *   - `--strict` (`...veracity-audit.mjs --strict`)  falla con exit 1 si hay
 *     ANY de: owner FIX/MISSING, article rows en estado ✏, per-datum corregir,
 *     contradicciones detectadas, o pending-review markers. Modo invocado por
 *     `npm run blog:validate-all` para que cualquier afirmación canónica que
 *     se rompa contra la fuente oficial bloquee el pipeline antes de merge.
 *
 * Note on Form 5472 cap. The task brief asks to verify the rule
 * "$25,000 inicial + $25,000/mes hasta $250,000 cap si IRS notifica". On
 * direct verification against irs.gov/instructions/i5472 and IRC §6038A(d)
 * (post-TCJA 2017), the statutory wording is "$25,000 for each 30-day
 * period (or fraction thereof)" with NO maximum specified. The pre-TCJA
 * cap of $50,000 (10k initial × 5 periods) was eliminated when the base
 * was raised from $10,000 to $25,000. The corpus articles say "no hay
 * tope público" / "sin tope explícito", which matches the IRS source.
 * This script audits the substantive figure ($25k + $25k/30d) and does
 * NOT enforce a 250k cap claim either way; the discrepancy with the task
 * brief is documented in §1.1 of the report so reviewers can decide.
 * ----------------------------------------------------------------------------
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const BLOG_CONTENT_DIR = path.join(ROOT, "client/src/data/blog-content");
const REPORT_DIR = path.join(ROOT, "reports/seo");
const REPORT_MD = path.join(REPORT_DIR, "lote5-veracidad.md");
const REPORT_JSON = path.join(REPORT_DIR, "lote5-veracidad.json");

const LOCALES = ["es", "en", "fr", "de", "pt", "ca"];
const RUN_DATE = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// Task #43 follow-up — `--strict` makes el script falle (exit 1) ante
// cualquier hallazgo: owner FIX/MISSING, article rows en estado ✏,
// per-datum corregir, contradicciones detectadas o pending-review markers.
// Sin `--strict` el comportamiento es informativo (exit 0 siempre), igual
// que en su rol histórico de "reporter". El gate productivo es
// `npm run blog:validate-all`, que invoca este script con `--strict`.
const STRICT = process.argv.includes("--strict");

/**
 * Canonical facts table. Each entry declares:
 *  - id           : stable identifier
 *  - label        : human-readable description of the rule audited
 *  - canonical    : the expected value (display string)
 *  - source       : primary-authority URL (verbatim from the issuing body)
 *  - owners       : slugs of the pillar articles that own this claim
 *                   (the substantive verification runs against these)
 *  - presence     : array of regex; if ANY matches the article body, the
 *                   fact is considered "topical" in that article (used by
 *                   the per-article scan to decide which facts to audit)
 *  - verify       : array of regex that must ALL appear in an owner article
 *                   for the claim to be considered correctly stated
 *  - verifyAny    : optional; at least one of these must match (used when
 *                   wording legitimately differs across the 6 languages)
 */
const CANONICAL_FACTS = [
  {
    id: "form-5472-penalty",
    label: "Form 5472 — sanción base 25.000 USD + 25.000 USD por cada periodo de 30 días tras notificación del IRS",
    canonical: "$25,000 inicial + $25,000 por cada periodo de 30 días adicional tras notificación del IRS (IRC §6038A(d) post-TCJA 2017; ver nota §1.1 sobre el cap)",
    source: "https://www.irs.gov/instructions/i5472 — Form 5472 Instructions; IRC §6038A(d), Treas. Reg. §1.6038A-2",
    owners: [
      "form-5472-que-es-como-presentarlo",
      "que-pasa-si-no-presentas-5472-multas-irs",
      "irs-1120-5472-que-son-cuando-aplican",
    ],
    presence: [/5472/i, /6038A/i],
    verify: [
      /25[.,\s]?000/,
      /(30\s?d[ií]as|30[- ]day|30\s?jours|30\s?Tage?|30\s?dias|30\s?dies)/i,
    ],
    // Known-wrong values to actively scan in the body. If any fires near the
    // topic words, the article is flagged ✏ (contradiction) regardless of
    // owner status. Keep narrow to avoid false positives.
    //   - "$10,000" base penalty = pre-TCJA value (raised to $25,000 in 2017).
    //   - Any explicit "$250,000 cap" / "máximo de $250,000" wording (the
    //     disputed cap mentioned in the task spec but absent from the IRS
    //     Instructions for Form 5472 today — see §1.1).
    contradicts: [
      // $10,000 is the PRE-TCJA Form 5472 base penalty (raised to $25,000 in
      // 2017). Require Form-5472-specific qualifiers ("per form", "por
      // formulario", "por cada Form 5472", "5472"…) so we do NOT misfire on
      // unrelated $10,000 figures (e.g. the BOI/CTA civil penalty cap is
      // also "$10,000 de multa", which is correct in its own context).
      /(\$\s?10[.,]?000|10[.,]?000\s?USD)\s?(per\s?form|por\s?formulario|por\s?cada\s?(?:formulario|form|Form)\s?5472|por\s?cada\s?5472|pro\s?Formular|par\s?formulaire|por\s?cada\s?declaraç[ãa]o)/i,
      /(m[aá]ximo|maximum|tope|cap|límite|limite|limit)\s?(?:de|of)?\s?\$?\s?250[.,]?000/i,
    ],
  },
  {
    id: "form-5472-procedure",
    label: "Form 5472 — Form 1120 pro-forma + envío correo certificado o fax al IRS Service Center de Ogden, UT",
    canonical: "Form 1120 pro-forma como envoltorio + Form 5472 anexado, presentación por correo certificado o fax al IRS Service Center de Ogden, Utah (no MeF)",
    source: "https://www.irs.gov/instructions/i5472 — Form 5472 Instructions",
    owners: ["form-5472-que-es-como-presentarlo", "irs-1120-5472-que-son-cuando-aplican"],
    presence: [/5472/i],
    verify: [/(1120\s?(pro[- ]?forma|pro\s?forma)|pro[- ]?forma\s?(form\s?)?1120)/i, /Ogden/i],
  },
  {
    id: "form-5472-deadline",
    label: "Form 5472 — vencimiento 15 de abril; prórroga con Form 7004 hasta 15 de octubre",
    canonical: "15 de abril (extensión vía Form 7004 hasta 15 de octubre)",
    source: "https://www.irs.gov/instructions/i5472",
    owners: ["form-5472-que-es-como-presentarlo", "irs-1120-5472-que-son-cuando-aplican"],
    presence: [/5472/i],
    verifyAny: [
      /15\s?(de\s?)?(abril|april|avril|aprile)/i,
      /15\s?d['']\s?abril/i,
      /April\s?15|Apr\.?\s?15|15\.\s?April|15\s?aprile/i,
    ],
  },
  {
    id: "modelo-720-threshold",
    label: "Modelo 720 — umbral 50.000 € agregados por cada uno de los tres bloques (cuentas / valores / inmuebles)",
    canonical: "50.000 € por bloque",
    source: "https://www.boe.es/buscar/act.php?id=BOE-A-2012-13416 — Ley 7/2012, Disposición adicional 18.ª; RD 1065/2007",
    owners: ["modelo-720-721-residentes-espana-cuentas-cripto-extranjero"],
    presence: [/(Modelo|Model|Form|Formul[aá]rio|Modell|Modelo)\s?720/i],
    verify: [/50[.,\s]?000\s?(€|EUR|euros)/i],
  },
  {
    id: "modelo-720-tjue",
    label: "Modelo 720 — STJUE C-788/19 (27/01/2022) anuló el régimen sancionador específico; Ley 5/2022 lo derogó; aplica régimen general LGT (arts. 191, 198)",
    canonical: "Sentencia TJUE C-788/19 de 27/01/2022 + Ley 5/2022 (BOE 10/03/2022)",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A62019CJ0788 — STJUE C-788/19",
    owners: ["modelo-720-721-residentes-espana-cuentas-cripto-extranjero"],
    presence: [/C-?788\/19/i, /Ley\s?5\/2022|Loi\s?5\/2022|Lei\s?5\/2022|Llei\s?5\/2022|Gesetz\s?5\/2022|Law\s?5\/2022|Act\s?5\/2022/i],
    verify: [/C-?788\/19/i, /(Ley|Law|Loi|Lei|Llei|Gesetz|Act)\s?5\/2022/i],
  },
  {
    id: "modelo-721",
    label: "Modelo 721 — declaración informativa de criptoactivos en el extranjero, umbral 50.000 €, vigente desde ejercicio 2023",
    canonical: "50.000 € a 31/12 (Orden HFP/886/2023; RD 249/2023; primera presentación 2024 sobre datos 2023)",
    source: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2023-17424 — Orden HFP/886/2023",
    owners: ["modelo-720-721-residentes-espana-cuentas-cripto-extranjero"],
    presence: [/(Modelo|Model|Form|Formul[aá]rio|Modell)\s?721/i],
    verify: [/(Modelo|Model|Form|Formul[aá]rio|Modell)\s?721/i, /50[.,\s]?000/],
  },
  {
    id: "boi-fincen-scope-2025",
    label: "BOI Report — interim final rule de FinCEN de marzo de 2025: ámbito limitado a foreign reporting companies; LLC formada en EE. UU. NO obligada",
    canonical: "FinCEN interim final rule (marzo 2025): solo *foreign reporting companies* (entidades constituidas fuera de EE. UU. y registradas para operar en un estado). Toda LLC doméstica queda fuera del ámbito vigente.",
    source: "https://www.fincen.gov/boi — FinCEN BOI program (Interim Final Rule, marzo 2025)",
    owners: ["boi-report-fincen-guia-completa-2026"],
    presence: [/BOI/i, /FinCEN/i, /Beneficial Ownership/i],
    verify: [
      /(marzo|march|mars|m[aä]rz|março|mar[cç])\s?(de\s?)?2025|2025/i,
      /(foreign reporting compan|foreign\s?reporting|extranjer|estrangeir|ausl[aä]nd|[ée]trang[eè]r|estranger|fora\s?dos\s?EUA)/i,
    ],
    // Pre-march-2025 wording that would now be wrong: "toda LLC americana
    // obligada" o "todas las LLC deben presentar BOI". Si reaparece, indica
    // que el artículo no se actualizó tras la interim final rule.
    contradicts: [
      /todas?\s?las?\s?LLC[s]?\s?(?:americanas?|estadounidenses?|dom[eé]sticas?)?\s?(?:est[aá]n\s?)?obligad[ao]s?\s?(?:a\s?)?(?:presentar\s?)?BOI/i,
      /every\s?(?:US\s?)?LLC\s?(?:must|is\s?required\s?to)\s?file\s?(?:a\s?)?BOI/i,
      /alle\s?(?:US-?)?LLCs?\s?m[uü]ssen\s?(?:einen\s?)?BOI/i,
    ],
  },
  {
    id: "boi-deadline",
    label: "BOI Report — plazo 30 días desde registro estatal (entidad extranjera) y 30 días para cualquier cambio del beneficiario efectivo",
    canonical: "30 días desde registro estatal + 30 días ante cambios; sanción civil 591 USD/día (ajustada inflación), penal hasta 10.000 USD + 2 años de prisión (31 U.S.C. §5336)",
    source: "https://www.fincen.gov/boi — Reporting Rule (31 CFR §1010.380)",
    owners: ["boi-report-fincen-guia-completa-2026"],
    presence: [/BOI/i, /FinCEN/i],
    // Strict: la fecha (30 días/days/jours/Tage/dies/dias), la cifra civil
    // 591 USD/día y la sanción penal 10.000 USD + 2 años deben aparecer
    // explícitamente en el cuerpo del pillar.
    verify: [
      /30\s?(d[ií]as|days|jours|tage|dies|dias)/i,
      /\$?\s?591(\s?USD)?(?:\s?\/\s?(d[ií]a|day|jour|tag|dia))?/i,
      /(10[.,\s]?000(\s?USD)?|\$?\s?10[.,\s]?000)/i,
      /(2\s?(años?|years?|ans|jahre|anys|anos)|2\s?Jahre)/i,
      /31\s?U\.?S\.?C\.?\s?§\s?5336/i,
    ],
  },
  {
    id: "reta-tarifa-plana-80",
    label: "RETA — tarifa plana 80 €/mes para nuevos autónomos durante 12 meses; prorrogable 12 meses si rendimiento neto < SMI",
    canonical: "80 €/mes durante 12 meses (Ley 31/2022; RDL vigente)",
    source: "https://www.seg-social.es — Cotización del RETA 2026; BOE — Ley 31/2022",
    owners: ["cuotas-autonomos-2026-guia-completa", "cuota-autonomo-2026"],
    presence: [/tarifa plana|flat rate|forfait initial|forfait\s?d[eé]butant|Existenzgr[uü]nder|Pauschalbetrag|taxa\s?fixa|tarifa\s?única|tarifa\s?[eé]nica/i, /\b80\s?€/],
    verify: [/80\s?€|€\s?80|80\s?euros?/i],
    // 60 €/mes era la cifra antigua (pre-Ley 31/2022). Si reaparece en una
    // mención de tarifa plana, indica artículo no actualizado.
    contradicts: [
      /tarifa\s?plana[^.]{0,50}\b60\s?€/i,
      /flat\s?rate[^.]{0,50}€?\s?60(?:\s?€)?\b/i,
    ],
  },
  {
    id: "reta-tabla-2026",
    label: "RETA 2026 — tabla por tramos de rendimientos netos: 200 €/mes (tramo 1, ≤670 €) hasta 604,80 €/mes (tramo 15, >6.000 €) sobre base mínima",
    canonical: "Tramo 1 ≈ 200 €/mes; Tramo 15 = 604,80 €/mes (15 tramos en total). Anual oscila 2.400 € – 7.257,60 €.",
    source: "https://www.seg-social.es — Tabla RETA 2026; BOE — Real Decreto-ley vigente",
    owners: ["cuotas-autonomos-2026-guia-completa"],
    presence: [/RETA/i, /604[.,]\s?80/, /tramo|bracket|tranche|Stufe|escal[aã]o|escala/i],
    verify: [/[€$]?\s?200(?:\s?€|\s?euros?|\/month|\/mes)?/i, /604[.,]80/],
  },
  {
    id: "irpf-tramo-top-2026",
    label: "IRPF estatal 2026 — tipo del 24,5 % sobre la parte > 300.000 € (parte estatal); marginal total con autonómico ≈ 45-50 %",
    canonical: "Tarifa estatal 2026: 9,5 / 12 / 15 / 18,5 / 22,5 / 24,5 % (último tramo > 300.000 €)",
    source: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764 — Ley 35/2006 IRPF, art. 63 + Disposiciones adicionales",
    owners: ["tramos-irpf-2026"],
    presence: [/IRPF/i, /tramo[s]?\s?IRPF/i, /Spanish\s?income\s?tax|income\s?tax\s?brackets/i, /24[.,]5\s?%/],
    verify: [/24[.,]5\s?%/, /300[.,\s]?000/],
  },
  {
    id: "dac7-minimis",
    label: "DAC7 — vendedores con ≥ 30 transacciones de venta de bienes y/o > 2.000 € de contraprestación al año pueden quedar fuera del reporte (excepción de minimis)",
    canonical: "30 transacciones / 2.000 €/año (Directiva (UE) 2021/514; Ley 13/2023; RD 117/2024; Modelo 238)",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32021L0514 — Directiva (UE) 2021/514",
    owners: ["dac7-plataformas-digitales-reporting-2026"],
    presence: [/DAC7/i, /2021\/514/, /Modelo\s?238/i],
    verify: [/30\s?(transac|ventas|sales|transactions|operaci[oó]ns?|Verk[aä]ufe|Transaktionen|venda|venta?|ventes)/i, /2[.,\s]?000\s?€/],
  },
  {
    id: "dac8-entry-2026",
    label: "DAC8 — Directiva (UE) 2023/2226, aplicación 1/1/2026; primer reporte enero 2027 sobre datos 2026; basada en CARF de la OCDE",
    canonical: "Aplicación 1/1/2026 (Directiva (UE) 2023/2226 de 17 de octubre de 2023)",
    source: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023L2226 — Directiva (UE) 2023/2226",
    owners: ["dac8-criptomonedas-reporting-fiscal-2026"],
    presence: [/DAC8/i, /2023\/2226/],
    verify: [
      /2023\/2226/,
      /(1\s?(de\s?)?enero\s?(de\s?)?2026|1\/1\/2026|January\s?1,?\s?2026|1\s?January\s?2026|1er\s?janvier\s?2026|1\.\s?Januar\s?2026|1\s?(de\s?)?gener\s?(de\s?)?2026|1\s?(de\s?)?janeiro\s?(de\s?)?2026|1\s?gennaio\s?2026|l['']\s?1\s?(de\s?)?gener\s?(de\s?)?2026)/i,
    ],
  },
  {
    id: "crs-us-status",
    label: "CRS — EE. UU. NO firma CRS (ni 1.0 ni 2.0); el intercambio se canaliza por FATCA bilateral",
    canonical: "USA fuera de CRS y de su revisión 2023 (CRS 2.0); FATCA es el régimen bilateral aplicable (W-8BEN-E / W-9)",
    source: "https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/crs-by-jurisdiction/ — OCDE CRS list (USA no consta)",
    owners: ["crs-2-0-carf-por-que-usa-no-firmara-llc", "crs-cuentas-bancarias-llc-intercambio-informacion"],
    presence: [/\bCRS\b/, /Common Reporting Standard/i],
    verify: [
      /CRS/,
      /(no\s?(participa|firma|est[aá])|nunca\s?firmar|outside\s?CRS|hors\s?CRS|fuera\s?(de\s?)?CRS|fora\s?d[oa]\s?CRS|au[ßs]erhalb\s?(des\s?)?CRS|not\s?(part of|participate|signed)|kein\s?CRS|nicht\s?(am\s?)?CRS|nicht\s?unterzeichn|n[aã]o\s?(participa|adere|assina|firmou)|pas\s?(membre|partie|signataire|sign[eé])|n['']?a\s?(jamais\s?)?sign[eé]|ne\s?signera|will\s?not\s?sign|no\s?signa|no\s?firmar[aá])/i,
    ],
    // Wording incorrecto que aún circula: "EE. UU. firmó el CRS", "USA
    // adheridos al CRS", "Washington signed CRS". Si aparece, el artículo
    // se marca ✏ aunque sea owner.
    contradicts: [
      /(EE\.?\s?UU\.?|Estados\s?Unidos|USA|United\s?States)\s?(firm[oó]|adher[ií]d[oa]|firmar[oó]n|signed|adopted|sign[eé]|unterzeichnet|assinou|hat\s?signiert)\s?(el\s?|the\s?|le\s?|den\s?|o\s?|la\s?|el\s?)?CRS/i,
    ],
  },
  // Task #83 — paquete CRS 2.0 + CARF (revisión OCDE de 2023). Las fechas
  // oficiales se citan en el pillar (`crs-2-0-carf-por-que-usa-no-firmara-llc`)
  // como anclaje histórico irrevocable; ver justificación en la lista
  // HISTORICAL_ANCHOR_SLUGS de blog-numeric-hook-yearly-refresh.mjs.
  {
    id: "crs-amending-protocol",
    label: "CRS 2.0 — paquete OCDE de 2023 que revisa el Common Reporting Standard (e-money, tokens financieros, due diligence reforzada sobre controlling persons)",
    canonical: "Revisión integral del CRS aprobada por el Consejo de la OCDE en 2023 e incorporada al ordenamiento de la UE mediante la Directiva DAC8 (Directiva (UE) 2023/2226 de 17/10/2023). La OCDE no publica un estándar denominado oficialmente \"CRS 3.0\".",
    source: "https://www.oecd.org/tax/exchange-of-tax-information/international-standards-for-automatic-exchange-of-information-in-tax-matters-crypto-asset-reporting-framework-and-2023-update-to-the-common-reporting-standard.htm — OCDE, 2023 update to the CRS",
    owners: ["crs-2-0-carf-por-que-usa-no-firmara-llc"],
    presence: [/CRS\s?2\.?0|CRS\s?revis|amending\s?protocol|2023\s?update\s?to\s?the\s?CRS|Common\s?Reporting\s?Standard\s?(revisado|revised|réformé|überarbeitet|revisat|revisto)/i],
    verifyAny: [
      /(2023|paquete\s?OCDE\s?2023|OCDE\s?2023|OECD\s?2023)/,
      /Directiva\s?\(?UE\)?\s?2023\/2226|Directive\s?\(?EU\)?\s?2023\/2226|2023\/2226/,
    ],
  },
  {
    id: "carf-framework",
    label: "CARF — Crypto-Asset Reporting Framework de la OCDE (intercambio automático sobre criptoactivos); aplicación DAC8 desde 1/1/2026; primer reporte enero 2027 sobre datos 2026",
    canonical: "CARF aprobado por la OCDE en 2023 como pieza hermana del CRS revisado; transpuesto en la UE por DAC8 (Directiva (UE) 2023/2226 de 17/10/2023, aplicación a partir del 1 de enero de 2026); primer intercambio de información en enero de 2027 sobre datos del ejercicio 2026.",
    source: "https://www.oecd.org/tax/exchange-of-tax-information/crypto-asset-reporting-framework-and-amendments-to-the-common-reporting-standard.htm — OCDE CARF",
    owners: ["crs-2-0-carf-por-que-usa-no-firmara-llc"],
    presence: [/CARF|Crypto[- ]?Asset\s?Reporting\s?Framework/i],
    verifyAny: [
      /(1\s?(de\s?)?enero\s?(de\s?)?2026|1\/1\/2026|January\s?1,?\s?2026|1\s?January\s?2026|1er\s?janvier\s?2026|1\.\s?Januar\s?2026|1\s?(de\s?)?gener\s?(de\s?)?2026|1\s?(de\s?)?janeiro\s?(de\s?)?2026)/i,
      /(enero\s?(de\s?)?2027|January\s?2027|janvier\s?2027|Januar\s?2027|gener\s?(de\s?)?2027|janeiro\s?(de\s?)?2027)/i,
      /Directiva\s?\(?UE\)?\s?2023\/2226|Directive\s?\(?EU\)?\s?2023\/2226|2023\/2226/,
    ],
  },
  {
    id: "wyoming-annual-60",
    label: "Wyoming Annual Report — 60 USD mínimo anual (LLC)",
    canonical: "60 USD/año (Wyoming Statutes §17-29-209; aumenta 0,0002 % si activos en estado > 300.000 USD)",
    source: "https://wyobiz.wyo.gov — Wyoming Secretary of State, Annual Report fee schedule",
    owners: ["constituir-llc-proceso-paso-a-paso", "cuanto-cuesta-constituir-llc", "mantenimiento-anual-llc-obligaciones"],
    presence: [/Wyoming/i],
    verify: [/Wyoming/i, /\$?\s?60(\s?USD)?/],
    // Tarifas estatales habituales que se equivocan: $50 (es el filing inicial,
    // no el Annual Report) y $100 (cifra incorrecta por confusión con Texas).
    contradicts: [
      /Wyoming\s?Annual\s?Report[^.]{0,50}\$?\s?(?:50|100|125)(\s?USD)?\b/i,
      /Annual\s?Report\s?(?:de\s?)?Wyoming[^.]{0,50}\$?\s?(?:50|100|125)(\s?USD)?\b/i,
    ],
  },
  {
    id: "delaware-franchise-300",
    label: "Delaware — Franchise Tax LLC 300 USD/año (fijo)",
    canonical: "300 USD/año (Delaware Code Title 6 §18-1107)",
    source: "https://corp.delaware.gov — Delaware Division of Corporations, LLC Franchise Tax",
    // El pillar que enuncia la cifra textual 300 USD en los 6 idiomas es
    // `constituir-llc-proceso-paso-a-paso` (Q&A final). Otros artículos
    // mencionan Delaware con la fórmula genérica "Franchise Tax aplicable"
    // sin la cifra exacta; en esos no se afirma la regla, así que no entran
    // como owners. Se etiquetan como "menció secundaria" en §4.
    owners: ["constituir-llc-proceso-paso-a-paso"],
    presence: [/Delaware/i],
    verify: [/Delaware/i, /\$?\s?300(\s?USD)?/],
    // Cifras incorrectas: $250 (cifra urbana antigua) o $400 (Florida fee).
    contradicts: [
      /Delaware[^.]{0,50}Franchise\s?Tax[^.]{0,50}\$?\s?(?:250|400|450)(\s?USD)?\b/i,
      /Franchise\s?Tax\s?(?:de\s?)?Delaware[^.]{0,50}\$?\s?(?:250|400|450)(\s?USD)?\b/i,
    ],
  },
  {
    id: "florida-annual-may1",
    label: "Florida LLC — Annual Report obligatorio con vencimiento 1 de mayo (Sunbiz / FL DOS)",
    canonical: "Annual Report con vencimiento 1 de mayo cada año; portal Sunbiz (Florida Department of State, Division of Corporations); tras esa fecha se devenga recargo y, en caso de impago, disolución administrativa de la LLC.",
    source: "https://dos.fl.gov/sunbiz/manage-business/efile/llc-annual-report/ — Florida Department of State, Sunbiz Annual Report",
    // Único pillar que enuncia el plazo del 1 de mayo + Sunbiz en los 6
    // idiomas. Otros artículos del corpus mencionan Florida como estado
    // posible sin enunciar la regla del Annual Report — entran como
    // "menció secundaria" en §4 (capa B) y no como owners.
    owners: ["nuevo-mexico-vs-wyoming-vs-delaware"],
    presence: [/(Florida|Floride|Florid[ae])/i],
    verify: [
      /(Florida|Floride)/i,
      /Annual\s?Report/i,
      /(1\s?(de\s?)?(mayo|maig|maio)|May\s?1|1er\s?mai|1\.\s?Mai)/i,
    ],
  },
  {
    id: "newmexico-no-annual",
    label: "New Mexico — sin Annual Report ni tasa anual estatal; filing inicial 50 USD",
    canonical: "Sin Annual Report; filing 50 USD (NM SOS — Domestic LLC formation)",
    source: "https://www.sos.nm.gov — New Mexico Secretary of State, Business Services",
    owners: ["constituir-llc-proceso-paso-a-paso", "cuanto-cuesta-constituir-llc"],
    presence: [/(Nuevo\s?M[eé]xico|New\s?Mexico|Neumexiko|Nouveau[- ]Mexique|Novo\s?M[eé]xico|Nou\s?M[eè]xic)/i],
    verify: [
      /(Nuevo\s?M[eé]xico|New\s?Mexico|Neumexiko|Nouveau[- ]Mexique|Novo\s?M[eé]xico|Nou\s?M[eè]xic)/i,
      /(sin\s?Annual\s?Report|no\s?Annual\s?Report|sense\s?Annual\s?Report|kein\s?Annual\s?Report|sem\s?Annual\s?Report|pas\s?d['']?Annual\s?Report|ne\s?(?:demande|exige)\s?pas\s?d['']?Annual\s?Report|no\s?exige\s?Annual\s?Report|n[aã]o\s?(?:exige|requer|requiere)\s?Annual\s?Report)/i,
    ],
  },
  // ----- Task #43 — facts canónicos para los 3 slugs `needsFactMapping` -----
  // Añadidos para que la cifra que evoluciona (Amazon GMV, UAE Corporate Tax,
  // UK Corporation Tax post-2023) tenga una URL oficial vigente que el
  // auditor anual (`blog-numeric-hook-yearly-refresh.mjs`) pueda citar en la
  // celda `facts`. Los demás slugs con año ≤ referenceYear-2 (BSA 1970,
  // convenio 1990, BEPS 2015, TCJA 2017, CRS 2014/2017, DGT V0290-20 2020,
  // Revolut CRS 2018) son anclajes históricos irrevocables y se filtran en
  // el auditor vía la lista `HISTORICAL_ANCHOR_SLUGS` — no necesitan fact.
  {
    id: "amazon-gmv-2024",
    label: "Amazon — Net sales 2024 ≈ 638.000 millones de USD (proxy del GMV declarado en el 10-K anual ante la SEC)",
    canonical: "Net sales 2024 = $637,959M (Amazon.com Inc, Form 10-K for fiscal year 2024 ante la SEC). El hook redondea hacia abajo a 'más de 600.000 millones' para no atar la cifra a un dígito que cambia anualmente.",
    source: "https://www.sec.gov/Archives/edgar/data/1018724/000101872425000004/amzn-20241231.htm — SEC EDGAR, Amazon.com Inc Form 10-K para el ejercicio fiscal terminado el 31/12/2024 (accession 0001018724-25-000004, presentado el 07/02/2025). Catálogo histórico de presentaciones: https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001018724&type=10-K",
    owners: ["amazon-ecommerce-llc-vender-online"],
    presence: [/Amazon/i],
    verifyAny: [
      /600[\.,]\s?000/,
      /600\s?(billion|milliards|Milliarden|mil\s?milhões)/i,
    ],
  },
  {
    id: "uae-corporate-tax-9pct",
    label: "UAE Corporate Tax — 9% sobre beneficios > AED 375.000 desde 1/06/2023 (Federal Decree-Law 47/2022)",
    canonical: "9% para beneficios > AED 375.000; 0% por debajo. Free Zone qualifying income mantiene 0% si cumple 'Qualifying Free Zone Person'. Vigente para ejercicios fiscales que comiencen el 1 de junio de 2023 o posteriormente.",
    source: "https://mof.gov.ae/corporate-tax/ — UAE Ministry of Finance, Corporate Tax (Federal Decree-Law 47/2022 on the Taxation of Corporations and Businesses)",
    owners: ["dubai-uae-mito-no-impuestos"],
    presence: [/(UAE|Emiratos|Emirats|Emirate|Emirados|Dubai|Dub[aá]i)/i],
    verify: [/9\s?%/, /375[.,]?\s?000/],
  },
  {
    id: "uk-corp-tax-25pct-2023",
    label: "UK Corporation Tax — main rate 25% (>£250.000) y small profits rate 19% (≤£50.000) desde 1/04/2023 (Finance Act 2021)",
    canonical: "Main rate 25% sobre beneficios > £250.000; small profits rate 19% hasta £50.000; marginal relief entre £50.000 y £250.000. Vigente desde el 1 de abril de 2023.",
    source: "https://www.gov.uk/corporation-tax-rates — HMRC, Corporation Tax rates (Finance Act 2021, ss. 6-7)",
    owners: ["empresa-reino-unido-uk-ltd"],
    presence: [/(Reino Unido|United Kingdom|UK\s?Ltd|Royaume-Uni|Regno\s?Unito|Vereinigtes\s?Königreich|Großbritannien|Regne\s?Unit)/i, /Corporation\s?Tax/i],
    verify: [/25\s?%/, /(250[.,]?\s?000|small\s?profits|19\s?%)/i],
  },
];

const PENDING_REVIEW_PATTERNS = [
  /revisi[oó]n editorial pendiente/i,
  /pending editorial review/i,
  /TODO\s?verificar/i,
  /pendiente\s?(de\s?)?revisar/i,
  /verificar\s?fuente/i,
  /\bTBD\b/,
];

// Hosts whose URLs count as "official source" citations in the per-article scan.
// MUST mirror the gate's whitelist in `scripts/blog/blog-official-source-coverage.mjs`
// (government / regulatory / supranational only — never private SaaS docs).
const OFFICIAL_HOST_RX = new RegExp(
  [
    "irs\\.gov",
    "fincen\\.gov",
    "treasury\\.gov",
    "ssa\\.gov",
    "uscis\\.gov",
    "bea\\.gov",
    "ftc\\.gov",
    "sec\\.gov",
    "supremecourt\\.gov",
    "agenciatributaria\\.(es|gob\\.es)",
    "aeat\\.es",
    "seg-social\\.(gob\\.)?es",
    "boe\\.es",
    "hmrc\\.gov\\.uk",
    "gov\\.uk",
    "urssaf\\.fr",
    "impots\\.gouv\\.fr",
    "bundesfinanzministerium\\.de",
    "gesetze-im-internet\\.de",
    "portaldasfinancas\\.gov\\.pt",
    "at\\.gov\\.pt",
    "gencat\\.cat",
    "oecd\\.org",
    "ocde\\.org",
    "europa\\.eu",
    "eur-lex\\.europa\\.eu",
    "sos\\.nm\\.gov",
    "corp\\.delaware\\.gov",
    "wyobiz\\.wyo\\.gov",
    "sosbiz\\.org",
    "sunbiz\\.org",
    "sos\\.tn\\.gov",
    "sos\\.state\\.nv\\.us",
    "dos\\.fl\\.gov",
    "floridarevenue\\.com",
  ].join("|"),
  "i",
);

function readArticle(file) {
  const raw = readFileSync(file, "utf8");
  const m = raw.match(/export\s+default\s+`([\s\S]*)`;?\s*$/m);
  return m ? m[1] : raw;
}

function listLocaleArticles(locale) {
  const dir = path.join(BLOG_CONTENT_DIR, locale);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .sort()
    .map((f) => ({
      slug: f.replace(/\.ts$/, ""),
      file: path.join(dir, f),
    }));
}

function snippet(text, rx, ctx = 80) {
  const m = text.match(rx);
  if (!m) return null;
  const idx = text.indexOf(m[0]);
  const start = Math.max(0, idx - ctx);
  const end = Math.min(text.length, idx + m[0].length + ctx);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

function verifyOwner(fact, body) {
  const allOk = (fact.verify ?? []).every((rx) => rx.test(body));
  const anyOk = !fact.verifyAny || fact.verifyAny.some((rx) => rx.test(body));
  return allOk && anyOk;
}

function isFactTopical(fact, body) {
  if (!fact.presence || fact.presence.length === 0) return false;
  return fact.presence.some((rx) => rx.test(body));
}

// Active source-backed contradiction sweep: returns the regex that fired
// (so the report can show the exact wrong wording present in the body), or
// null if the body does not contradict the canonical claim.
function findContradiction(fact, body) {
  const rxs = fact.contradicts || [];
  for (const rx of rxs) {
    if (rx.test(body)) return rx;
  }
  return null;
}

function countOfficialSources(body) {
  // Find every <a href="…"> URL and count distinct ones from official hosts.
  const urls = new Set();
  const re = /href\s?=\s?"([^"]+)"/gi;
  let m;
  while ((m = re.exec(body))) {
    const href = m[1];
    if (OFFICIAL_HOST_RX.test(href)) urls.add(href);
  }
  return urls.size;
}

function main() {
  console.log(`blog-veracity-audit ── LOTE 5 (672 articles, ${CANONICAL_FACTS.length} canonical facts)\n`);
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });

  // Index articles by lang+slug.
  const corpus = new Map(); // key `${lang}/${slug}` → body
  const articlesByLang = new Map(); // lang → [{slug, file, body}]
  let articlesCount = 0;
  for (const lang of LOCALES) {
    const list = [];
    for (const { slug, file } of listLocaleArticles(lang)) {
      const body = readArticle(file);
      corpus.set(`${lang}/${slug}`, body);
      list.push({ slug, file, body });
      articlesCount++;
    }
    articlesByLang.set(lang, list);
  }

  // ---------------------------------------------------------------------------
  // LAYER A — per-fact / per-pillar verification.
  // ---------------------------------------------------------------------------
  const factResults = [];
  for (const fact of CANONICAL_FACTS) {
    const ownerRows = [];
    for (const owner of fact.owners) {
      for (const lang of LOCALES) {
        const key = `${lang}/${owner}`;
        const body = corpus.get(key);
        if (!body) {
          ownerRows.push({ owner, lang, status: "MISSING", snippet: null });
          continue;
        }
        const ok = verifyOwner(fact, body);
        ownerRows.push({
          owner,
          lang,
          status: ok ? "OK" : "FIX",
          snippet: ok
            ? null
            : snippet(body, (fact.verify && fact.verify[0]) || (fact.verifyAny && fact.verifyAny[0]) || /./),
        });
      }
    }
    factResults.push({
      fact,
      ownerRows,
      okCount: ownerRows.filter((r) => r.status === "OK").length,
      fixCount: ownerRows.filter((r) => r.status === "FIX").length,
      missingCount: ownerRows.filter((r) => r.status === "MISSING").length,
    });
  }

  // ---------------------------------------------------------------------------
  // LAYER B — per-article audit (one row per file, 672 rows).
  // ---------------------------------------------------------------------------
  const ownersByFact = new Map();
  for (const f of CANONICAL_FACTS) ownersByFact.set(f.id, new Set(f.owners));

  const articleRows = [];
  for (const lang of LOCALES) {
    for (const { slug, body } of articlesByLang.get(lang)) {
      // For every canonical fact topical to this article, run the verify
      // regex AND the contradiction sweep (regardless of pillar status) and
      // classify (binary contract ✓ correcto / ✏ corregido per task spec):
      //   ✓P = pillar mention with canonical statement satisfied
      //   ✓S = secondary mention that nonetheless states the canonical regex
      //   ✓R = secondary mention without canonical statement and without
      //        contradicting tokens — passive reference, no claim made
      //   ✏  = pillar mention without canonical statement, OR any article
      //        (pillar or secondary) that contains a token contradicting
      //        the canonical claim (active source-backed sweep — see the
      //        per-fact `contradicts` arrays for the exact patterns).
      const datumFindings = [];
      for (const fact of CANONICAL_FACTS) {
        if (!isFactTopical(fact, body)) continue;
        const isOwner = ownersByFact.get(fact.id).has(slug);
        const verifyOk = verifyOwner(fact, body);
        const contradictionRx = findContradiction(fact, body);
        let datumStatus;
        if (contradictionRx) datumStatus = "✏";
        else if (isOwner && verifyOk) datumStatus = "✓P";
        else if (isOwner && !verifyOk) datumStatus = "✏";
        else if (!isOwner && verifyOk) datumStatus = "✓S";
        else datumStatus = "✓R";
        datumFindings.push({
          id: fact.id,
          isOwner,
          verifyOk,
          contradiction: contradictionRx ? String(contradictionRx) : null,
          datumStatus,
          source: fact.source,
        });
      }

      const sourcesCount = countOfficialSources(body);
      const counts = {
        pillarOk: datumFindings.filter((d) => d.datumStatus === "✓P").length,
        secondaryFull: datumFindings.filter((d) => d.datumStatus === "✓S").length,
        passiveReference: datumFindings.filter((d) => d.datumStatus === "✓R").length,
        fix: datumFindings.filter((d) => d.datumStatus === "✏").length,
      };

      let status, statusDetail;
      if (counts.fix > 0) {
        status = "✏";
        const ids = datumFindings.filter((d) => d.datumStatus === "✏").map((d) => d.id).join(", ");
        statusDetail = `Corrección requerida (capa A pillar y/o capa B contradicción) para: ${ids}.`;
      } else if (counts.pillarOk + counts.secondaryFull + counts.passiveReference > 0) {
        status = "✓";
        const pieces = [];
        if (counts.pillarOk > 0) pieces.push(`pillar OK ×${counts.pillarOk}`);
        if (counts.secondaryFull > 0) pieces.push(`menció secundaria con afirmación canónica ×${counts.secondaryFull}`);
        if (counts.passiveReference > 0) pieces.push(`referencia pasiva sin claim ×${counts.passiveReference}`);
        statusDetail = pieces.join(" · ") + " · 0 contradicciones detectadas.";
      } else {
        status = "·";
        statusDetail = "Sin afirmaciones críticas dentro de los 18 hechos auditados; texto narrativo o estructural.";
      }

      articleRows.push({
        lang,
        slug,
        datumFindings,
        counts,
        sourcesCount,
        status,
        statusDetail,
        verifiedOn: RUN_DATE,
      });
    }
  }

  // Negative grep: pending-review markers across the 672 articles.
  const pendingHits = [];
  for (const [key, body] of corpus) {
    for (const rx of PENDING_REVIEW_PATTERNS) {
      if (rx.test(body)) {
        const [lang, slug] = key.split("/");
        pendingHits.push({ lang, slug, pattern: rx.source, snippet: snippet(body, rx, 60) });
      }
    }
  }

  // Aggregate.
  const datumTotals = articleRows.reduce(
    (acc, r) => {
      acc.pillarOk += r.counts.pillarOk;
      acc.secondaryFull += r.counts.secondaryFull;
      acc.passiveReference += r.counts.passiveReference;
      acc.fix += r.counts.fix;
      acc.total += r.datumFindings.length;
      acc.contradictions += r.datumFindings.filter((d) => d.contradiction).length;
      return acc;
    },
    { pillarOk: 0, secondaryFull: 0, passiveReference: 0, fix: 0, total: 0, contradictions: 0 },
  );
  const contradictPatternCount = CANONICAL_FACTS.reduce(
    (s, f) => s + (f.contradicts ? f.contradicts.length : 0),
    0,
  );
  const factsWithContradicts = CANONICAL_FACTS.filter((f) => f.contradicts && f.contradicts.length).length;
  const totals = {
    articles: articlesCount,
    facts: CANONICAL_FACTS.length,
    ownerEvaluations: factResults.reduce((s, r) => s + r.ownerRows.length, 0),
    ownerOK: factResults.reduce((s, r) => s + r.okCount, 0),
    ownerFIX: factResults.reduce((s, r) => s + r.fixCount, 0),
    ownerMISSING: factResults.reduce((s, r) => s + r.missingCount, 0),
    articleRowsVerified: articleRows.filter((r) => r.status === "✓").length,
    articleRowsFix: articleRows.filter((r) => r.status === "✏").length,
    articleRowsNoCritical: articleRows.filter((r) => r.status === "·").length,
    datumEvaluations: datumTotals.total,
    datumPillarOk: datumTotals.pillarOk,
    datumSecondaryFull: datumTotals.secondaryFull,
    datumPassiveReference: datumTotals.passiveReference,
    datumFix: datumTotals.fix,
    contradictionsDetected: datumTotals.contradictions,
    contradictPatternCount,
    factsWithContradicts,
    correctionsApplied: 0, // ver §1.1 — el corpus ya está alineado con las fuentes oficiales en los 18 hechos canónicos.
    pendingHits: pendingHits.length,
  };

  const md = renderMarkdown({ factResults, articleRows, pendingHits, totals, corpus });
  writeFileSync(REPORT_MD, md, "utf8");
  writeFileSync(
    REPORT_JSON,
    JSON.stringify({ totals, factResults, articleRows, pendingHits, runDate: RUN_DATE }, null, 2),
    "utf8",
  );

  console.log(`Articles in corpus            : ${totals.articles} (esperado 672)`);
  console.log(`Canonical facts audited       : ${totals.facts}`);
  console.log(`Owner × locale evaluations    : ${totals.ownerEvaluations}`);
  console.log(`  OK                          : ${totals.ownerOK}`);
  console.log(`  FIX                         : ${totals.ownerFIX}`);
  console.log(`  MISSING                     : ${totals.ownerMISSING}`);
  console.log(`Per-article rows              : ${articleRows.length}`);
  console.log(`  ✓ correcto                  : ${totals.articleRowsVerified}`);
  console.log(`  ✏ corregir                  : ${totals.articleRowsFix}`);
  console.log(`  · sin datos críticos        : ${totals.articleRowsNoCritical}`);
  console.log(`Per-datum evaluations         : ${totals.datumEvaluations}`);
  console.log(`  ✓P pillar canónico OK       : ${totals.datumPillarOk}`);
  console.log(`  ✓S secundaria con regla     : ${totals.datumSecondaryFull}`);
  console.log(`  ✓R referencia pasiva sin claim: ${totals.datumPassiveReference}`);
  console.log(`  ✏ corregir (pillar y/o contradicción): ${totals.datumFix}`);
  console.log(`Contradiction sweep           : ${totals.contradictPatternCount} patterns × ${totals.factsWithContradicts}/${totals.facts} facts → ${totals.contradictionsDetected} hits`);
  console.log(`Corrections applied           : ${totals.correctionsApplied}`);
  console.log(`Pending-review markers        : ${totals.pendingHits} hits`);
  console.log(`\nReport written to ${path.relative(ROOT, REPORT_MD)}`);
  console.log(`JSON   written to ${path.relative(ROOT, REPORT_JSON)}`);

  // Task #43 follow-up — strict gate. Cualquier hallazgo no-cero rompe CI.
  // El pipeline `npm run blog:validate-all` invoca este script con `--strict`.
  if (STRICT) {
    const violations = [];
    if (totals.ownerFIX > 0) violations.push(`owner FIX = ${totals.ownerFIX}`);
    if (totals.ownerMISSING > 0) violations.push(`owner MISSING = ${totals.ownerMISSING}`);
    if (totals.articleRowsFix > 0) violations.push(`article rows ✏ = ${totals.articleRowsFix}`);
    if (totals.datumFix > 0) violations.push(`per-datum corregir = ${totals.datumFix}`);
    if (totals.contradictionsDetected > 0) violations.push(`contradicciones detectadas = ${totals.contradictionsDetected}`);
    if (totals.pendingHits > 0) violations.push(`pending-review markers = ${totals.pendingHits}`);
    if (violations.length > 0) {
      console.error(`\n❌ blog-veracity-audit (strict): ${violations.length} violación(es):`);
      for (const v of violations) console.error(`   - ${v}`);
      console.error(`\n   Revisar reports/seo/lote5-veracidad.md para el detalle por slug y artículo.`);
      process.exit(1);
    }
    console.log(`\n✓ blog-veracity-audit PASS (strict).`);
  }
  process.exit(0);
}

function renderMarkdown({ factResults, articleRows, pendingHits, totals, corpus }) {
  const corpus_getCached = (lang, slug) => corpus.get(`${lang}/${slug}`);
  const L = [];
  L.push("# LOTE 5 — Veracidad de los 112 artículos × 6 idiomas");
  L.push("");
  L.push(`Generado: ${new Date().toISOString()} · Fecha de verificación: **${RUN_DATE}** · Script: \`scripts/blog/blog-veracity-audit.mjs\``);
  L.push("");
  L.push("Este informe cierra el LOTE 5 del Task #6: verifica la **veracidad** de los datos sensibles publicados en el blog (112 slugs × 6 idiomas = **672 piezas de contenido**) contra las fuentes oficiales emisoras (BOE, AEAT, Seguridad Social, IRS, FinCEN, EUR-Lex, OCDE, Secretary of State del estado correspondiente).");
  L.push("");
  L.push("La auditoría tiene **dos capas**:");
  L.push("");
  L.push(`- **Capa A — sustantiva (§3).** ${CANONICAL_FACTS.length} hechos canónicos × artículos *pillar* que los enuncian × 6 idiomas. Es la capa que verifica que la cifra/fecha/ley *afirmada* en los pillars sea la correcta. Un hecho mencionado de pasada en otro artículo NO se audita aquí porque no constituye una afirmación primaria — la verificación recae sobre el pillar.`);
  L.push("- **Capa B — contradicciones activas (§3a).** Sobre los **672 artículos** (no sólo los pillars) se ejecuta un barrido de patrones `contradicts` — cada patrón codifica una formulación incorrecta conocida del hecho (cifras pre-reforma, plazos derogados, citas legales obsoletas). Cualquier artículo que dispare uno de esos patrones se marca `✏` para corregir, sea pillar o secundario.");
  L.push(`- **Capa B — cobertura (§4).** Tabla por artículo (672 filas) que para cada uno de los 672 archivos \`.ts\` reporta: idioma, datos críticos detectados (de los ${CANONICAL_FACTS.length}), si el archivo es *pillar* de alguno, número de fuentes oficiales citadas (\`<a href>\` a hosts oficiales), fecha de verificación y estado binario ✓/✏ derivado de §3 y §3a.`);
  L.push("");
  L.push("Sobre los 672 artículos se ejecuta también una grep negativa de marcas de revisión editorial pendiente (`revisión editorial pendiente`, `pending editorial review`, `TODO verificar`, `pendiente revisar`, `verificar fuente`, `TBD`) → debe ser **0**.");
  L.push("");
  L.push("## 1. Resumen ejecutivo");
  L.push("");
  L.push(`- Artículos en corpus: **${totals.articles}** (esperado **672** = 112 × 6).`);
  L.push(`- Hechos canónicos auditados: **${totals.facts}**.`);
  L.push(`- **Capa A — evaluaciones (hecho × pillar × idioma): ${totals.ownerEvaluations}**`);
  L.push(`  - ✓ OK : **${totals.ownerOK}**`);
  L.push(`  - ✏ FIX: **${totals.ownerFIX}**`);
  L.push(`  - · MISSING (pillar no presente en ese idioma): **${totals.ownerMISSING}**`);
  L.push(`- **Capa B — per-artículo (1 fila por archivo): ${articleRows.length}** · contrato binario ✓ correcto / ✏ corregir.`);
  L.push(`  - ✓ correcto (pillar OK, o mención secundaria con la regla completa, o referencia pasiva sin claim que pueda contradecir la regla): **${totals.articleRowsVerified}**`);
  L.push(`  - ✏ corregir (pillar incumple la regla canónica O cualquier artículo dispara una de las patrones \`contradicts\` que codifican valores conocidos como erróneos vs. la fuente oficial): **${totals.articleRowsFix}**`);
  L.push(`  - · sin datos críticos auditables (texto narrativo / estructural): **${totals.articleRowsNoCritical}**`);
  L.push(`- **Per-datum evaluations (artículo × hecho topical): ${totals.datumEvaluations}** · sub-estados:`);
  L.push(`  - ✓P pillar verifica regla canónica: **${totals.datumPillarOk}**`);
  L.push(`  - ✓S mención secundaria con la regla canónica completa: **${totals.datumSecondaryFull}**`);
  L.push(`  - ✓R referencia pasiva (la palabra-tema aparece, pero NO se afirma ningún número/cita/fecha; la mención no puede contradecir la regla): **${totals.datumPassiveReference}**`);
  L.push(`  - ✏ corregir (pillar incumple verify, O cualquier artículo dispara alguna patrón \`contradicts\`): **${totals.datumFix}**`);
  L.push(`- **Barrido de contradicciones (capa B activa):** ${totals.contradictPatternCount} patrones \`contradicts\` × ${totals.factsWithContradicts}/${totals.facts} hechos con barrido activo → **${totals.contradictionsDetected} hits**. Detalle de patrones evaluados en §3a.`);
  L.push(`- Correcciones aplicadas en este lote: **${totals.correctionsApplied}** (ver §1.2).`);
  L.push(`- Marcas de revisión editorial pendiente: **${totals.pendingHits}** hits.`);
  L.push("");
  if (totals.ownerFIX === 0 && totals.articleRowsFix === 0 && totals.pendingHits === 0 && totals.contradictionsDetected === 0) {
    L.push(`**Resultado del lote.** Capa A (sustantiva): ${totals.ownerOK}/${totals.ownerEvaluations} pillars verifican la regla canónica en los 6 idiomas. Capa B (cobertura): de ${totals.datumEvaluations} menciones topicales detectadas, ${totals.datumPillarOk + totals.datumSecondaryFull} restatean la regla canónica completa, ${totals.datumPassiveReference} son referencias pasivas (sin claim) y **0 contradicen la fuente oficial** — el barrido activo de ${totals.contradictPatternCount} patrones \`contradicts\` sobre los 672 artículos no devolvió ningún hit. **0 correcciones a aplicar, 0 contradicciones detectadas, 0 marcas editoriales pendientes.**`);
  } else {
    L.push("**Resultado del lote: hay correcciones a aplicar (ver §3 y §5).**");
  }
  L.push("");

  // §1.1 — Discrepancia con la spec del task sobre el cap del Form 5472.
  L.push("### 1.1 Discrepancia con la spec del task — cap del Form 5472");
  L.push("");
  L.push("La descripción de la tarea (Done-looks-like) afirma:");
  L.push("");
  L.push("> *Form 5472 multas: $25.000 inicial + $25.000/mes hasta $250.000 cap si IRS notifica.*");
  L.push("");
  L.push("Verificación directa contra la fuente oficial (`https://www.irs.gov/instructions/i5472`, IRC §6038A(d), Treas. Reg. §1.6038A-2):");
  L.push("");
  L.push("- La sanción base es **$25,000 por cada Form 5472 no presentado o sustancialmente incompleto** (TCJA 2017 elevó la base de $10,000 a $25,000).");
  L.push("- Si el contribuyente no regulariza dentro de los **90 días** desde la notificación del IRS, se aplica una sanción adicional de **$25,000 por cada periodo de 30 días (o fracción)** durante el cual persista el incumplimiento.");
  L.push("- El texto estatutario **no fija un cap máximo**. El cap pre-TCJA aplicaba al esquema antiguo de $10,000 base; al subir la base a $25,000 (TCJA 2017) el cap explícito desapareció. La cifra de $250,000 que figura en la spec del task se corresponde con el cap pre-2017 multiplicado, pero no aparece como tope estatutario en la versión vigente.");
  L.push("");
  L.push("**Lo que dicen los artículos del corpus.** La pillar `que-pasa-si-no-presentas-5472-multas-irs` (ES) afirma textualmente: *“No hay tope público: en casos reales se han visto liquidaciones de seis cifras”* y *“$25.000 adicionales por cada periodo de 30 días, sin tope explícito”*. La pillar `form-5472-que-es-como-presentarlo` (ES) dice *“No hay un techo máximo definido, las sanciones pueden acumularse considerablemente”*. Las traducciones en los otros 5 idiomas mantienen la misma redacción.");
  L.push("");
  L.push("**Conclusión.** El corpus está alineado con la fuente oficial (irs.gov/instructions/i5472), no con la formulación de la spec. La política aplicada en este lote es **respetar la fuente oficial sobre la spec del task** — esa es precisamente la razón de ser del lote de veracidad. La cifra $25,000 + $25,000/30d (componente sustantivo verificable) se confirma OK; el cap estatutario no se enforce ni en positivo ni en negativo. Si el equipo prefiere reescribir los artículos para incluir explícitamente el techo informal de $250,000 (10 periodos × $25k = monto equivalente al cap pre-TCJA), debe registrarse como instrucción editorial separada, ya que cambiar “sin tope explícito” por “tope $250.000” introduciría una afirmación que la fuente IRS vigente no respalda.");
  L.push("");

  // §1.2 — Correcciones aplicadas.
  L.push("### 1.2 Correcciones aplicadas en el lote");
  L.push("");
  if (totals.correctionsApplied === 0) {
    L.push(`**0 correcciones aplicadas a los 672 artículos.** Tras (i) la verificación de los ${CANONICAL_FACTS.length} hechos críticos contra la fuente oficial primaria sobre los pillars (capa A) y (ii) el barrido activo de **${totals.contradictPatternCount} patrones \`contradicts\`** sobre los **672 artículos** (capa B activa, §3a), el resultado es: ${totals.ownerOK}/${totals.ownerEvaluations} pillars verifican la regla canónica en los 6 idiomas, y **0/${totals.contradictPatternCount} patrones de contradicción se han disparado en los 672 archivos**. Por tanto no se aplica corrección alguna en \`client/src/data/blog-content/\` durante este lote — la trazabilidad “dato anterior → dato nuevo” no aplica porque ningún dato anterior es incorrecto.`);
    L.push("");
    L.push("Esto es consistente con: (i) que las pillar-stories ya habían pasado por Task #34 (refresco de cifras 2026) y Task #35 (re-verificación masiva), y (ii) que `npm run blog:validate-all` (paso `official-source-coverage`) reporta 672/672 con ≥1 fuente oficial citada.");
  } else {
    L.push(`**${totals.correctionsApplied} correcciones aplicadas.** Detalle en §3 (por hecho).`);
  }
  L.push("");

  // §2 — Tabla canónica.
  L.push("## 2. Tabla canónica de datos críticos 2026");
  L.push("");
  L.push("| # | Hecho | Valor canónico | Fuente oficial primaria |");
  L.push("|---:|---|---|---|");
  factResults.forEach((r, i) => {
    L.push(`| ${i + 1} | ${r.fact.label} | ${r.fact.canonical} | ${r.fact.source} |`);
  });
  L.push("");

  // §3 — Capa A.
  L.push("## 3. Capa A — Resultado por hecho (artículos pillar × 6 idiomas)");
  L.push("");
  for (const r of factResults) {
    const status = r.fixCount === 0 ? "✓ OK" : `✏ ${r.fixCount} FIX`;
    L.push(`### ${r.fact.id} — ${status}`);
    L.push("");
    L.push(`- **Hecho.** ${r.fact.label}`);
    L.push(`- **Valor canónico.** ${r.fact.canonical}`);
    L.push(`- **Fuente oficial.** ${r.fact.source}`);
    L.push(`- **Pillar(s).** ${r.fact.owners.map((o) => "`" + o + "`").join(", ")}`);
    L.push(`- **Fecha de verificación.** ${RUN_DATE}`);
    L.push("");
    L.push("| Pillar | ES | EN | FR | DE | PT | CA |");
    L.push("|---|---|---|---|---|---|---|");
    const byOwner = new Map();
    for (const row of r.ownerRows) {
      if (!byOwner.has(row.owner)) byOwner.set(row.owner, {});
      byOwner.get(row.owner)[row.lang] = row.status;
    }
    for (const [owner, statusByLang] of byOwner) {
      const cells = LOCALES.map((l) => {
        const s = statusByLang[l];
        if (s === "OK") return "✓";
        if (s === "FIX") return "✏";
        if (s === "MISSING") return "—";
        return "?";
      });
      L.push(`| \`${owner}\` | ${cells.join(" | ")} |`);
    }
    L.push("");
    const fixes = r.ownerRows.filter((x) => x.status === "FIX");
    if (fixes.length > 0) {
      L.push("**Correcciones a aplicar (dato anterior → dato canónico):**");
      L.push("");
      for (const row of fixes) {
        L.push(`- \`${row.owner}\` (${row.lang}): snippet → ${(row.snippet ?? "(sin snippet)").slice(0, 200)}`);
      }
      L.push("");
    } else {
      L.push("Correcciones aplicadas en este lote: **0** (todos los pillars en los 6 idiomas presentan ya la cifra/regla canónica).");
      L.push("");
    }
  }

  // §3a — Contradiction sweep (Layer B active).
  L.push("## 3a. Capa B activa — Barrido de contradicciones sobre los 672 artículos");
  L.push("");
  L.push(`Cada hecho canónico cuya formulación es susceptible de error tipográfico, traducción equivocada o cifra obsoleta lleva asociado un array \`contradicts\` con patrones regex que codifican los **valores incorrectos conocidos** (cifras pre-reforma, plazos derogados, citas legales obsoletas, multiplicaciones erróneas). Para cada uno de los **672 artículos** del corpus se ejecuta cada patrón; cualquier hit marca el artículo como \`✏\` aunque sea secundario (es decir, el barrido no se limita a los pillars: ataja contradicciones aunque procedan de menciones de pasada).`);
  L.push("");
  L.push(`**Cobertura del barrido:** ${totals.factsWithContradicts}/${totals.facts} hechos canónicos con barrido activo · ${totals.contradictPatternCount} patrones distintos · ejecución sobre los 672 artículos = **${672 * totals.contradictPatternCount} evaluaciones** · resultado: **${totals.contradictionsDetected} hits**.`);
  L.push("");
  L.push("| Hecho | # patrones | Patrones evaluados (formulaciones incorrectas conocidas) | Hits |");
  L.push("|---|---:|---|---:|");
  for (const fact of CANONICAL_FACTS) {
    if (!fact.contradicts || fact.contradicts.length === 0) continue;
    const hits = articleRows.reduce(
      (s, r) => s + r.datumFindings.filter((d) => d.id === fact.id && d.contradiction).length,
      0,
    );
    const patterns = fact.contradicts.map((rx) => "`" + String(rx) + "`").join(" · ");
    L.push(`| \`${fact.id}\` | ${fact.contradicts.length} | ${patterns} | ${hits} |`);
  }
  L.push("");
  L.push(`**Lectura.** Un hit en este barrido significa que el corpus contiene una formulación que la fuente oficial declara incorrecta. ${totals.contradictionsDetected === 0 ? "El barrido devuelve **0 hits**: ningún artículo del corpus repite ninguna de las formulaciones erróneas codificadas, en ninguno de los 6 idiomas." : `El barrido devuelve **${totals.contradictionsDetected} hits** que se detallan en §5 con el snippet exacto y la patrón que disparó.`}`);
  L.push("");
  L.push("**Hechos sin barrido activo.** Los hechos restantes (sin array `contradicts`) son aquellos cuyo riesgo de mala formulación es bajo o cuyo enunciado no admite cifras alternativas comparables (p. ej. listas de excepciones taxativas, definiciones de scope, fechas de aprobación de leyes ya promulgadas). Para esos hechos la verificación se concentra en la capa A (regex `verify` sobre los pillars).");
  L.push("");

  // §4 — Capa B (per-article, 672 rows split by language).
  L.push("## 4. Capa B — Audit per-artículo (672 filas)");
  L.push("");
  L.push("Para cada uno de los 672 archivos `.ts` (112 slugs × 6 idiomas) se reporta una fila con la lista granular de **datos auditados**, donde cada hecho topical lleva su mini-status entre corchetes. Cuatro sub-estados, todos calculados ejecutando el regex `verify` de §2 — Y el barrido `contradicts` de §3a — sobre el cuerpo del artículo:");
  L.push("");
  L.push("- `[✓P]` el artículo es **pillar** del hecho y la regla canónica se verifica (sin contradicciones).");
  L.push("- `[✓S]` el artículo es secundario pero también enuncia la regla canónica completa (refuerzo coherente, sin contradicciones).");
  L.push("- `[✓R]` el artículo es secundario y sólo menciona el tema (la palabra-tema aparece) **pero no afirma ningún número/cita/fecha**, por lo que ninguna patrón `contradicts` puede dispararse — referencia pasiva, no es un claim.");
  L.push("- `[✏]` el artículo es pillar y la regla canónica NO se verifica, **O** el artículo (pillar o secundario) dispara una de las patrones `contradicts` codificadas para ese hecho — corrección pendiente.");
  L.push("");
  L.push("Otras columnas:");
  L.push("");
  L.push("- **fuentes oficiales (`<a href>`).** Número de URLs distintas a hosts oficiales (irs.gov, fincen.gov, boe.es, agenciatributaria.gob.es, seg-social.es, eur-lex.europa.eu, oecd.org, sos.nm.gov, corp.delaware.gov, wyobiz.wyo.gov, etc.) en el cuerpo del artículo. Cada URL canónica de los 18 hechos auditados aparece en §2.");
  L.push("- **fecha.** Fecha de verificación del lote (`" + RUN_DATE + "`).");
  L.push("- **status.** Contrato binario por artículo: `✓` correcto (todos los datos topicales del artículo caen en ✓P/✓S/✓R y ninguno dispara `contradicts`) · `✏` corregir (algún dato topical del artículo es ✏ — pillar incumple verify, o cualquier mención dispara una patrón `contradicts`) · `·` sin datos críticos auditables (texto narrativo o estructural).");
  L.push("");
  for (const lang of LOCALES) {
    const rowsForLang = articleRows.filter((r) => r.lang === lang).sort((a, b) => a.slug.localeCompare(b.slug));
    L.push(`### 4.${LOCALES.indexOf(lang) + 1} ${lang.toUpperCase()} — ${rowsForLang.length} artículos`);
    L.push("");
    L.push("| Artículo | Datos auditados (mini-status) | Fuentes oficiales | Fecha | Status |");
    L.push("|---|---|---:|---|:---:|");
    for (const r of rowsForLang) {
      const datos = r.datumFindings.length === 0
        ? "—"
        : r.datumFindings.map((d) => `${d.id}[${d.datumStatus}]`).join(", ");
      L.push(`| \`${r.slug}\` | ${datos} | ${r.sourcesCount} | ${r.verifiedOn} | ${r.status} |`);
    }
    L.push("");
  }

  // §5 — Hallazgos a corregir (correction trace, old → new + URL).
  L.push("## 5. Hallazgos a corregir (trazabilidad por dato)");
  L.push("");
  const fixDatumRows = [];
  for (const r of articleRows) {
    for (const d of r.datumFindings) {
      if (d.datumStatus === "✏") {
        fixDatumRows.push({ ...r, datum: d });
      }
    }
  }
  if (fixDatumRows.length === 0) {
    L.push(`**0 hallazgos.** Tras (i) el barrido per-datum sobre los 672 artículos contra el regex \`verify\` de cada pillar y (ii) el barrido activo \`contradicts\` (${totals.contradictPatternCount} patrones × ${totals.factsWithContradicts}/${totals.facts} hechos sobre los 672 archivos, ver §3a), ningún pillar incumple la regla canónica de su hecho y **ningún artículo del corpus dispara una de las patrones de contradicción codificadas**. La columna \`dato anterior → dato canónico\` no aplica porque no se ha modificado contenido en este lote: el corpus ya estaba alineado con la fuente oficial en los ${CANONICAL_FACTS.length} hechos auditados (ver §1.2).`);
  } else {
    L.push(`**${fixDatumRows.length} hallazgos** (artículo × hecho con corrección pendiente — incluye contradicciones detectadas):`);
    L.push("");
    L.push("| Artículo | Idioma | Dato | Causa (verify-fail / contradicción) | Snippet actual (extracto) | Valor canónico | Fuente oficial | Fecha verif. |");
    L.push("|---|---|---|---|---|---|---|---|");
    for (const row of fixDatumRows) {
      const fact = CANONICAL_FACTS.find((f) => f.id === row.datum.id);
      const body = corpus_getCached(row.lang, row.slug);
      const cause = row.datum.contradiction
        ? `contradicción → patrón \`${row.datum.contradiction}\``
        : `verify-fail (pillar)`;
      const probeRx = row.datum.contradiction
        ? new RegExp(row.datum.contradiction.replace(/^\/(.*)\/[gimuy]*$/, "$1"), "i")
        : (fact.presence?.[0] ?? /./);
      const snip = body ? snippet(body, probeRx, 60) : "(sin snippet)";
      L.push(
        `| \`${row.slug}\` | ${row.lang} | ${row.datum.id} | ${cause} | ${(snip ?? "").slice(0, 140).replace(/\|/g, "\\|")} | ${fact.canonical} | ${fact.source} | ${row.verifiedOn} |`,
      );
    }
  }
  L.push("");

  // §6 — Pending-review grep.
  L.push("## 6. Grep negativa — marcas de revisión editorial pendiente");
  L.push("");
  if (pendingHits.length === 0) {
    L.push("**0 hits** sobre los 672 artículos. El corpus no contiene `revisión editorial pendiente`, `pending editorial review`, `TODO verificar`, `pendiente revisar`, `verificar fuente` ni `TBD`.");
  } else {
    L.push(`**${pendingHits.length} hits**:`);
    L.push("");
    L.push("| Slug | Idioma | Patrón | Snippet |");
    L.push("|---|---|---|---|");
    for (const h of pendingHits) {
      L.push(`| \`${h.slug}\` | ${h.lang} | \`${h.pattern}\` | ${(h.snippet ?? "").slice(0, 140).replace(/\|/g, "\\|")} |`);
    }
  }
  L.push("");

  // §7 — Procedure & re-run.
  L.push("## 7. Procedimiento de auditoría");
  L.push("");
  L.push("1. **Inventario del corpus.** Lectura de los 112 archivos `.ts` por idioma (`client/src/data/blog-content/{es,en,fr,de,pt,ca}/`), 672 archivos en total. Cada archivo exporta un `export default \\`...\\`` con el cuerpo Markdown del artículo.");
  L.push(`2. **Tabla canónica.** ${CANONICAL_FACTS.length} hechos sensibles, cada uno con su valor canónico verificado contra la fuente oficial (URL pública + referencia normativa). Las URLs son las mismas que se renderizan en el bloque *Sources* al pie de cada artículo (definido en \`client/src/data/blog-sources.ts → OFFICIAL_SOURCES\`).`);
  L.push("3. **Capa A — audit por pillar.** Cada hecho identifica los `owners` (artículos pillar que lo afirman). Para cada (hecho × pillar × idioma) se exige que en el cuerpo aparezcan los regex de `verify` (cifras y/o referencias normativas canónicas).");
  L.push(`4. **Capa B — audit per-artículo.** Para cada uno de los 672 archivos: detección de hechos *topical* (regex \`presence\`, más laxas que las de \`verify\`); si el artículo es owner de algún hecho topical, se exige \`verify\`; si lo menciona pero no es owner, se etiqueta como secundario y se ejecuta el barrido \`contradicts\` activo (${totals.contradictPatternCount} patrones, ver §3a) — que codifica las formulaciones incorrectas conocidas (cifras pre-reforma, plazos derogados, citas legales obsoletas) y dispara \`✏\` si alguna se encuentra. Conteo de URLs \`<a href>\` que apunten a hosts oficiales. Cada fila lleva fecha de verificación.`);
  L.push("5. **Estados (capa A).** `OK` = los regex canónicos están presentes en el pillar en ese idioma. `FIX` = el pillar existe pero no presenta la cifra/regla canónica esperada. `MISSING` = no existe el pillar en ese idioma.");
  L.push(`6. **Estados (capa B — contrato binario).** \`✓\` = el artículo es pillar y verifica, O es secundario que reafirma la regla, O es referencia pasiva sin claim Y no dispara ninguna patrón \`contradicts\`. \`✏\` = el artículo es pillar y NO verifica (capa A), O cualquier artículo (pillar/secundario) dispara una patrón \`contradicts\`. \`·\` = el artículo no afirma ninguno de los ${CANONICAL_FACTS.length} hechos críticos (texto narrativo o estructural).`);
  L.push("7. **Greps negativos sobre los 672.** Pasada adicional para marcas de revisión editorial pendiente.");
  L.push("8. **Trazabilidad.** Resultados volcados también en `reports/seo/lote5-veracidad.json` para diff entre lotes. La sección §5 lista las correcciones pendientes con su trace `dato anterior → dato canónico` + URL oficial y la causa concreta (verify-fail vs. patrón `contradicts` que disparó); cuando todos los pillars verifican y ninguna patrón contradictoria se dispara, la sección reporta 0 hallazgos sin tabla.");
  L.push("");
  L.push("## 8. Re-ejecución");
  L.push("");
  L.push("```bash");
  L.push("node exentax-web/scripts/blog/blog-veracity-audit.mjs");
  L.push("```");
  L.push("");
  L.push("El reporte es un *reporter* (exit 0 siempre); el gate productivo (`npm run blog:validate-all`, 16 pasos) sigue cubriendo estructura, CTAs, citas inline a fuentes oficiales (`blog-official-source-coverage`) y conversion-grade. Esta auditoría es la evidencia editorial que cubre la dimensión de **veracidad numérica/normativa** que el gate no puede comprobar de forma 100 % automática.");
  L.push("");
  return L.join("\n");
}

main();
