#!/usr/bin/env node
/*
 * blog-masterpiece-audit.test.mjs
 * ----------------------------------------------------------------------------
 * Regression test that locks in the legal-citation contexts handled by
 * `findYearsInProse` in `blog-masterpiece-audit.mjs` (Task #56).
 *
 * The strict SEO audit (`seo:masterpiece-strict`) treats certain
 * "month + de/del + YYYY" / "Month YYYY" / "Ley X/YYYY" patterns as
 * legal-regulatory citations and strips them BEFORE counting years in
 * editorial prose. That is what kept Task #19 green without rewriting
 * dozens of "interim final rule of FinCEN de marzo de 2025" mentions.
 *
 * This test feeds known legal-citation strings into `findYearsInProse`
 * and asserts the returned count is 0. If anyone ever loosens or removes
 * a `LEGAL_CONTEXTS` branch, this test fires before the audit silently
 * starts flagging real-world citations again (e.g. four "març del 2025"
 * mentions in `cuanto-cuesta-constituir-llc.ts`).
 *
 * It also includes negative fixtures — bare editorial year mentions like
 * "en 2026" or "actualizado para 2027" — to ensure the audit STILL counts
 * those as prose, so the legal-citation strip doesn't get widened so far
 * that the rule loses all teeth.
 *
 * Exits 0 on success, 1 on the first mismatch so CI can fail fast.
 * ----------------------------------------------------------------------------
 */

import { findYearsInProse } from "./blog-masterpiece-audit.mjs";

// Each fixture is { name, text, expect }.
//   expect = 0       → the line is a legal-citation context and MUST be stripped.
//   expect = N > 0   → the line is editorial prose and MUST count N years.
const FIXTURES = [
  // ---------------------------------------------------------------------------
  // Real-world legal citations mirrored from the article corpus. These are the
  // exact phrasings that Task #19 relied on the LEGAL_CONTEXTS branch for.
  // ---------------------------------------------------------------------------
  {
    name: "ca: 'març del 2025' (cuanto-cuesta-constituir-llc.ts)",
    text: "Després de la interim final rule de la FinCEN de març del 2025, l'obligació del BOI Report quedà restringida a les foreign reporting companies.",
    expect: 0,
  },
  {
    name: "ca: 'març de 2025' (errores-criticos-llc-ya-constituida.ts)",
    text: "Després de la interim final rule de la FinCEN de març de 2025, l'obligació del BOI Report quedà restringida.",
    expect: 0,
  },
  {
    name: "es: 'marzo de 2025' (bookkeeping-llc-paso-a-paso.ts)",
    text: "Tras la interim final rule de FinCEN de marzo de 2025, el BOI Report no aplica a las LLC.",
    expect: 0,
  },
  {
    name: "es: 'sentencia de marzo de 2025' (wise-business-llc-guia.ts)",
    text: "Tras la sentencia de marzo de 2025 que limitó la obligación a entidades extranjeras, conviene revisar la versión vigente.",
    expect: 0,
  },
  {
    name: "en: 'March 2025 interim final rule' (boi-report-fincen-guia-completa-2026.ts)",
    text: "Updated for the March 2025 FinCEN interim final rule that re-scoped the obligation.",
    expect: 0,
  },
  {
    name: "en: \"FinCEN's March 2025 interim final rule\" (constituir-llc-proceso-paso-a-paso.ts)",
    text: "After FinCEN's March 2025 interim final rule, the BOI Report obligation was narrowed to foreign reporting companies.",
    expect: 0,
  },
  {
    name: "de: 'FinCEN Interim Final Rule vom März 2025' (vender-o-cerrar-llc-comparativa-practica.ts)",
    text: "Nach der FinCEN Interim Final Rule vom März 2025 wurde die BOI-Meldepflicht auf foreign reporting companies beschränkt.",
    expect: 0,
  },
  {
    name: "de: 'vor März 2025' (empresa-reino-unido-uk-ltd.ts)",
    text: "Wenn Ihre LLC vor März 2025 gegründet wurde und das BOI bereits eingereicht ist, Bestätigung aufbewahren.",
    expect: 0,
  },

  // ---------------------------------------------------------------------------
  // Each LEGAL_CONTEXTS branch covered by at least one representative example.
  // Order roughly mirrors the array in blog-masterpiece-audit.mjs so a future
  // editor can see the 1:1 mapping between branch and fixture.
  // ---------------------------------------------------------------------------
  // ES/PT/CA: month + de/del/do/da + YEAR
  { name: "es: 'enero de 2026' law date", text: "Con efectos desde enero de 2026 la regla cambió.", expect: 0 },
  { name: "pt: 'janeiro de 2026' law date", text: "A partir de janeiro de 2026 entra em vigor.", expect: 0 },
  { name: "ca: 'gener de 2026' law date", text: "Amb efectes des de gener de 2026 la regla canvia.", expect: 0 },
  // EN: Month YEAR / of YEAR
  { name: "en: 'January 2026' law date", text: "Effective January 2026 the rule changes.", expect: 0 },
  { name: "en: 'rule of March 2025'", text: "The interim final rule of March 2025 narrowed the scope.", expect: 0 },
  // FR: mois YEAR
  { name: "fr: 'janvier 2026' law date", text: "À compter de janvier 2026, la règle change.", expect: 0 },
  // DE: Monat YEAR
  { name: "de: 'Januar 2026' law date", text: "Ab Januar 2026 ändert sich die Regel.", expect: 0 },
  // ES/PT/EN: Ley/Lei/Law NNN/YYYY
  { name: "es: 'Ley 7/2024' law ref", text: "La Ley 7/2024 introdujo nuevos tramos.", expect: 0 },
  { name: "pt: 'Lei nº 14.754/2024' law ref", text: "A Lei nº 14.754/2024 alterou o regime de tributação.", expect: 0 },
  // BOE / EU Regulation / Directive year-first
  { name: "es: 'Directiva (UE) 2023/2226'", text: "La Directiva (UE) 2023/2226 sobre intercambio de información.", expect: 0 },
  { name: "es: 'Reglamento UE 2023/1114' (MiCA)", text: "El Reglamento UE 2023/1114 (MiCA) regula los criptoactivos.", expect: 0 },
  // HFP / HAP admin law refs
  { name: "es: 'HFP/887/2023' admin order", text: "La Orden HFP/887/2023 desarrolla el modelo.", expect: 0 },
  // Slash dates dd/mm/YYYY
  { name: "any: '01/01/2026' slash date", text: "La medida entra en vigor el 01/01/2026 según el calendario.", expect: 0 },
  // English day-month-year
  { name: "en: '30 January 2024'", text: "The order took effect on 30 January 2024.", expect: 0 },
  // German "1. Januar 2026"
  { name: "de: '1. Januar 2026'", text: "Ab dem 1. Januar 2026 gilt die neue Regelung.", expect: 0 },
  // FY-YYYY
  { name: "en: 'FY 2025'", text: "The change applies starting FY 2025.", expect: 0 },
  // IRC / IRS / CFR / U.S.C with year
  { name: "en: 'IRC §6038A of 2024'", text: "Reporting under IRC §6038A of 2024 is required.", expect: 0 },
  // 'rule/ruling of YEAR'
  { name: "en: 'final rule of 2025'", text: "FinCEN's final rule of 2025 narrowed the scope.", expect: 0 },
  // ejercicio fiscal YYYY / tax year YYYY
  { name: "es: 'ejercicio fiscal 2025'", text: "Para el ejercicio fiscal 2025 se aplican los nuevos tipos.", expect: 0 },
  { name: "en: 'tax year 2025'", text: "For tax year 2025 the IRS published updated thresholds.", expect: 0 },
  // §NNN of YYYY
  { name: "en: '§5336 of 2024'", text: "Penalties under §5336 of 2024 apply to willful violations.", expect: 0 },
  // "1 de enero de YYYY", "January 1, YYYY"
  { name: "es: '1 de enero de 2026'", text: "Con efectos desde el 1 de enero de 2026, los tramos se ajustan.", expect: 0 },
  { name: "en: 'January 1, 2026'", text: "Effective January 1, 2026, the rates change.", expect: 0 },
  // Tax-form numbers (form 2031, 2042, modelo 720/721, etc.)
  { name: "fr: 'formulaire 2031'", text: "Le formulaire 2031 est utilisé pour la déclaration BIC.", expect: 0 },
  { name: "fr: 'annexes 2042-C-PRO'", text: "Joindre les annexes 2042-C-PRO à la déclaration.", expect: 0 },
  // Bare BIC/BNC code with form number
  { name: "fr: 'BIC 2031'", text: "Régime BIC 2031 applicable aux locations meublées.", expect: 0 },
  // "Loi de finances pour YYYY"
  { name: "fr: 'Loi de finances pour 2026'", text: "La Loi de finances pour 2026 introduit de nouvelles tranches.", expect: 0 },
  // Bracketed reviewer annotation
  { name: "ed: '[verificar fecha: 2026-04-21]'", text: "Las cifras citadas [verificar fecha: 2026-04-21] provienen de la AEAT.", expect: 0 },
  // 'année YYYY' / 'any YYYY' / 'ano YYYY' / 'Jahr YYYY'
  { name: "fr: 'année fiscale 2025'", text: "Pour l'année fiscale 2025 les seuils ont été relevés.", expect: 0 },
  // Composite YYYY/YY (UK/IE tax year)
  { name: "uk: '2025/26' tax year", text: "For the UK 2025/26 tax year the personal allowance is unchanged.", expect: 0 },
  // Range YYYY-YYYY
  { name: "fr: 'Plafonds 2024-2025'", text: "Les Plafonds 2024-2025 figurent dans la circulaire.", expect: 0 },
  // ISO date YYYY-MM-DD
  { name: "any: '2026-04-21' ISO date", text: "Última actualización 2026-04-21 según fuente oficial.", expect: 0 },
  // PT/BR Lei/Decreto NNN/YYYY
  { name: "pt: 'Decreto-Lei nº 53/2024'", text: "O Decreto-Lei nº 53/2024 transpõe a diretiva europeia.", expect: 0 },
  // German Geschäftsjahr YYYY
  { name: "de: 'Geschäftsjahr 2024'", text: "Für das Geschäftsjahr 2024 gilt der neue Satz.", expect: 0 },
  // German "ab YYYY" / "seit YYYY"
  { name: "de: 'ab 2025'", text: "Ab 2025 gilt die neue Reichensteuer für Spitzenverdiener.", expect: 0 },
  // Tax brackets anchored to a year
  { name: "es: '45 % en 2026'", text: "El tipo marginal sube al 45 % en 2026 para rentas altas.", expect: 0 },
  // tramos YYYY
  { name: "es: 'tramos de 2026'", text: "Los tramos de 2026 publicados por la AEAT cambian poco.", expect: 0 },
  // German "für YYYY"
  { name: "de: 'für 2025'", text: "Die Tabelle für 2025 wurde im Bundesgesetzblatt veröffentlicht.", expect: 0 },
  // MiCA / DAC / OECD with year
  { name: "eu: 'MiCA 2024'", text: "El estándar MiCA 2024 unifica el régimen europeo.", expect: 0 },
  { name: "oecd: 'CARF 2026'", text: "El estándar CARF 2026 entra en vigor según OCDE.", expect: 0 },
  // (UE) YYYY/####
  { name: "es: '(UE) 2024/123'", text: "El reglamento (UE) 2024/123 deroga el anterior.", expect: 0 },
  // BStBl / BGBl German legal references
  { name: "de: 'BStBl. I 2023'", text: "Veröffentlicht in BStBl. I 2023 mit Wirkung ab Januar.", expect: 0 },
  // (YYYY) parenthetical year tag
  { name: "any: '(2024)' parenthetical", text: "Reichensteuer 45 % ab 277.826 € (2024) gemäß Bundesfinanzministerium.", expect: 0 },
  // Page references S. 2031
  { name: "de: 'S. 2031' page ref", text: "Vgl. BGBl. I 2021 S. 2031 zur Begründung.", expect: 0 },
  // "informació rebuda el YYYY"
  { name: "ca: 'informació rebuda el 2025'", text: "La informació rebuda el 2025 confirma els nous tipus.", expect: 0 },
  // PT "a partir de YYYY"
  { name: "pt: 'a partir de 2026'", text: "A partir de 2026 a regra muda conforme a nova lei.", expect: 0 },
  // CA "des del YYYY"
  { name: "ca: 'des del 2025'", text: "Vigent des del 2025 segons la normativa autonòmica.", expect: 0 },
  // EU-Verordnungsentwurf YYYY/NNN
  { name: "de: 'EU-Verordnungsentwurf 2024/123'", text: "Der EU-Verordnungsentwurf 2024/123 erweitert den Anwendungsbereich.", expect: 0 },

  // ---------------------------------------------------------------------------
  // Related-article markdown links (Task #67).
  // The audit must strip `[label](/<lang>/blog/...)` blocks BEFORE counting
  // years in prose, because the visible label is the title of *another*
  // article (often containing a year, e.g. "[LLC complete guide for
  // non-residents in 2026](/en/blog/...)") and is a fact about the linked
  // post — not an editorial year mention by the current article. Without
  // this, every related-articles section produced 18 critical false
  // positives across en/fr/de/pt/ca. These fixtures pin that behavior so a
  // future cleanup of the regex in `findYearsInProse` cannot silently
  // re-introduce the false positives.
  // ---------------------------------------------------------------------------
  {
    name: "related-article: link with year in label is stripped (en)",
    text: "Read more in [LLC complete guide for non-residents in 2026](/en/blog/llc-non-residents-guide) for details.",
    expect: 0,
  },
  {
    name: "related-article: editorial year mention outside any link still counts",
    text: "Las reglas cambiaron en 2027 según la nueva normativa publicada por la AEAT.",
    expect: 1,
  },

  // ---------------------------------------------------------------------------
  // Negative fixtures — bare editorial year mentions that MUST still count.
  // If any of these silently start being stripped, the rule has lost teeth.
  // ---------------------------------------------------------------------------
  {
    name: "negative: bare 'en 2026' editorial mention",
    text: "Esto cambió en 2026 sin más contexto fiscal o normativo aledaño.",
    expect: 1,
  },
  {
    name: "negative: 'guía 2027' editorial title-style mention",
    text: "Publicamos esta guía 2027 para reflejar los cambios recientes.",
    expect: 1,
  },
  {
    name: "negative: 'actualizado 2026' editorial freshness tag",
    text: "Artículo actualizado 2026 para incluir las novedades regulatorias.",
    expect: 1,
  },
];

function run() {
  let passed = 0;
  const failures = [];

  for (const fx of FIXTURES) {
    const got = findYearsInProse(fx.text);
    if (got !== fx.expect) {
      failures.push(
        `  [MISS] ${fx.name}\n         expected findYearsInProse = ${fx.expect}, got ${got}\n         line: ${fx.text}`,
      );
      continue;
    }
    passed += 1;
  }

  const total = FIXTURES.length;
  if (failures.length > 0) {
    console.error(
      `\n[blog-masterpiece-audit.test] FAIL — ${failures.length} of ${total} fixture${total === 1 ? "" : "s"} mismatched:\n`,
    );
    for (const f of failures) console.error(f);
    console.error(
      `\n[blog-masterpiece-audit.test] If you intentionally changed the LEGAL_CONTEXTS list in blog-masterpiece-audit.mjs, update the fixtures in this file to match. Removing a branch will silently re-flag the real-world articles listed in Task #56.`,
    );
    process.exit(1);
  }

  console.log(
    `[blog-masterpiece-audit.test] OK — ${passed}/${total} legal-citation fixtures pass; LEGAL_CONTEXTS still strips them from prose.`,
  );
}

run();
