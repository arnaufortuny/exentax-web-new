#!/usr/bin/env node
/*
 * audit-system-seo-faqs.test.mjs
 * ----------------------------------------------------------------------------
 * Test de regresión para el detector de residuos castellanos por idioma
 * (Task #44, 2026-04-22).
 *
 * Después de la Task #38 sustituimos el regex global por un mapa
 * `SPANISH_TELLS_BY_LANG` por idioma. Como cada set se endurece manualmente,
 * existe el riesgo de que una FAQ traducida con descuido pase la auditoría
 * sin alarma. Este test inyecta cadenas conocidas en cada idioma y comprueba:
 *
 *   - "flag":  el regex de ese idioma SÍ marca el término (positivo).
 *   - "pass":  el regex de ese idioma NO marca el cognado nativo (negativo).
 *
 * Si alguien retira un término del mapa o introduce un cognado nuevo, este
 * test debe romperse para forzar una decisión consciente. Ver
 * `docs/auditoria-sistema-seo-faqs/DECISIONES.md` (entrada Task #44).
 *
 * Sale con código 0 si todo coincide y 1 al primer mismatch para que CI / el
 * comando `npm run check` falle rápido.
 * ----------------------------------------------------------------------------
 */

import {
  SPANISH_TELLS_BY_LANG,
  matchesSpanishTells,
  BLOG_FAQ_HEADINGS,
  extractBlogFaqQAs,
  findBlogFaqSpanishTells,
} from "./audit-system-seo-faqs.lib.mjs";

// Cada fixture: { name, lang, text, expect: "flag" | "pass" }.
//   - "flag": el regex DEBE detectar el término castellano.
//   - "pass": el regex NO DEBE marcar el cognado / palabra válida en ese idioma.
const FIXTURES = [
  // ─── PT (portugués) ─────────────────────────────────────────────────────
  // Positivos: deben marcarse en pt.
  { name: "pt: 'además' es castellano",            lang: "pt", text: "Além disso, además, é importante.", expect: "flag" },
  { name: "pt: 'gestión' es castellano",           lang: "pt", text: "A gestión fiscal é complexa.",       expect: "flag" },
  { name: "pt: 'obligación' es castellano",        lang: "pt", text: "Tem obligación de declarar.",       expect: "flag" },
  { name: "pt: 'según' es castellano",             lang: "pt", text: "Según a lei portuguesa.",           expect: "flag" },
  { name: "pt: 'cuota' es castellano",             lang: "pt", text: "A cuota mensal é alta.",            expect: "flag" },
  { name: "pt: 'impuestos' es castellano",         lang: "pt", text: "Pagar impuestos a tempo.",          expect: "flag" },
  { name: "pt: 'hacienda' es castellano",          lang: "pt", text: "A hacienda exige documentos.",      expect: "flag" },
  { name: "pt: 'trámites' es castellano",          lang: "pt", text: "Os trámites são longos.",           expect: "flag" },
  { name: "pt: 'asesoría' es castellano",          lang: "pt", text: "Procurar asesoría profissional.",   expect: "flag" },
  { name: "pt: 'hoy en día' es castellano",        lang: "pt", text: "Hoy en día é comum.",               expect: "flag" },
  // Negativos: cognados/grafías válidas en pt-PT que NO deben marcarse.
  { name: "pt: 'também' es PT estándar",           lang: "pt", text: "Também é importante declarar.",     expect: "pass" },
  { name: "pt: 'autónomo' es válido en pt-PT",     lang: "pt", text: "Trabalho como autónomo em Lisboa.", expect: "pass" },
  { name: "pt: 'autónomos' es válido en pt-PT",    lang: "pt", text: "Os autónomos pagam IVA.",           expect: "pass" },
  { name: "pt: 'empresa' es cognado pt",           lang: "pt", text: "A empresa portuguesa cresceu.",     expect: "pass" },
  { name: "pt: 'quota' es válido en pt",           lang: "pt", text: "A quota da Segurança Social.",      expect: "pass" },
  { name: "pt: 'imposto' (PT) no es 'impuesto'",   lang: "pt", text: "O imposto sobre rendimento.",       expect: "pass" },

  // ─── CA (catalán) ───────────────────────────────────────────────────────
  // Positivos.
  { name: "ca: 'además' es castellano",            lang: "ca", text: "A més, además, cal declarar.",      expect: "flag" },
  { name: "ca: 'gestión' es castellano",           lang: "ca", text: "La gestión fiscal és complexa.",    expect: "flag" },
  { name: "ca: 'autónomo' es castellano",          lang: "ca", text: "Sóc autónomo a Barcelona.",         expect: "flag" },
  { name: "ca: 'autónomos' es castellano",         lang: "ca", text: "Els autónomos paguen IVA.",         expect: "flag" },
  { name: "ca: 'según' es castellano",             lang: "ca", text: "Según la normativa catalana.",      expect: "flag" },
  { name: "ca: 'cuota' es castellano",             lang: "ca", text: "La cuota mensual és alta.",         expect: "flag" },
  { name: "ca: 'hacienda' es castellano",          lang: "ca", text: "La hacienda exigeix documents.",    expect: "flag" },
  { name: "ca: 'asesoría' es castellano",          lang: "ca", text: "Buscar asesoría professional.",     expect: "flag" },
  // Negativos.
  { name: "ca: 'també' es CA estándar",            lang: "ca", text: "També és important declarar.",      expect: "pass" },
  { name: "ca: 'autònom' (CA) no es 'autónomo'",   lang: "ca", text: "Treballo com autònom.",             expect: "pass" },
  { name: "ca: 'empresa' es cognado ca",           lang: "ca", text: "L'empresa catalana ha crescut.",    expect: "pass" },
  { name: "ca: 'quota' es válido en ca",           lang: "ca", text: "La quota de la Seguretat Social.",  expect: "pass" },

  // ─── FR (francés) ───────────────────────────────────────────────────────
  // Positivos.
  { name: "fr: 'además' es castellano",            lang: "fr", text: "De plus, además, il faut déclarer.", expect: "flag" },
  { name: "fr: 'gestión' es castellano",           lang: "fr", text: "La gestión fiscale est complexe.",   expect: "flag" },
  { name: "fr: 'autónomo' es castellano",          lang: "fr", text: "Je suis autónomo à Paris.",          expect: "flag" },
  { name: "fr: 'también' es castellano",           lang: "fr", text: "También il faut déclarer.",          expect: "flag" },
  { name: "fr: 'según' es castellano",             lang: "fr", text: "Según la loi française.",            expect: "flag" },
  { name: "fr: 'cuota' es castellano",             lang: "fr", text: "La cuota mensuelle est élevée.",     expect: "flag" },
  { name: "fr: 'hacienda' es castellano",          lang: "fr", text: "La hacienda exige des documents.",   expect: "flag" },
  // Negativos.
  { name: "fr: 'entreprise' es FR (no 'empresa')", lang: "fr", text: "L'entreprise française a grandi.",   expect: "pass" },
  { name: "fr: 'cotisation' es FR (no 'cuota')",   lang: "fr", text: "La cotisation sociale est due.",     expect: "pass" },
  { name: "fr: 'impôts' es FR (no 'impuestos')",   lang: "fr", text: "Payer les impôts à temps.",          expect: "pass" },

  // ─── DE (alemán) ────────────────────────────────────────────────────────
  // Positivos.
  { name: "de: 'además' es castellano",            lang: "de", text: "Außerdem, además, muss man melden.", expect: "flag" },
  { name: "de: 'gestión' es castellano",           lang: "de", text: "Die gestión ist komplex.",           expect: "flag" },
  { name: "de: 'autónomo' es castellano",          lang: "de", text: "Ich bin autónomo in Berlin.",        expect: "flag" },
  { name: "de: 'también' es castellano",           lang: "de", text: "También muss man melden.",           expect: "flag" },
  { name: "de: 'según' es castellano",             lang: "de", text: "Según deutschem Recht.",             expect: "flag" },
  { name: "de: 'cuota' es castellano",             lang: "de", text: "Die cuota ist hoch.",                expect: "flag" },
  // Negativos.
  { name: "de: 'Unternehmen' es DE (no 'empresa')", lang: "de", text: "Das Unternehmen ist gewachsen.",    expect: "pass" },
  { name: "de: 'Steuern' es DE (no 'impuestos')",   lang: "de", text: "Steuern rechtzeitig zahlen.",       expect: "pass" },

  // ─── EN (inglés) ────────────────────────────────────────────────────────
  // Positivos.
  { name: "en: 'además' es castellano",            lang: "en", text: "In addition, además, you must file.", expect: "flag" },
  { name: "en: 'gestión' es castellano",           lang: "en", text: "The gestión is complex.",             expect: "flag" },
  { name: "en: 'autónomo' es castellano",          lang: "en", text: "Working as autónomo in Madrid.",      expect: "flag" },
  { name: "en: 'también' es castellano",           lang: "en", text: "También you must file.",              expect: "flag" },
  { name: "en: 'según' es castellano",             lang: "en", text: "Según Spanish law.",                  expect: "flag" },
  { name: "en: 'hacienda' es castellano",          lang: "en", text: "Hacienda requires documents.",        expect: "flag" },
  { name: "en: 'asesoría' es castellano",          lang: "en", text: "Hire an asesoría firm.",              expect: "flag" },
  // Negativos: "quota" es palabra inglesa válida → NO debe marcarse.
  { name: "en: 'quota' es palabra inglesa",        lang: "en", text: "The annual quota is high.",           expect: "pass" },
  { name: "en: 'company' es EN (no 'empresa')",    lang: "en", text: "The company has grown.",              expect: "pass" },
  { name: "en: 'taxes' es EN (no 'impuestos')",    lang: "en", text: "Pay taxes on time.",                  expect: "pass" },

  // ─── ES (no debería marcarse nunca) ────────────────────────────────────
  { name: "es: idioma fuente, nunca se marca",     lang: "es", text: "La gestión y la cuota mensual.",      expect: "pass" },
];

const failures = [];
let passed = 0;

for (const f of FIXTURES) {
  const got = matchesSpanishTells(f.lang, f.text);
  const expectFlag = f.expect === "flag";
  if (got !== expectFlag) {
    failures.push({ ...f, got });
  } else {
    passed += 1;
  }
}

const total = FIXTURES.length;

// Sanity check: cada idioma destino debe tener su propio regex.
const REQUIRED_LANGS = ["pt", "ca", "fr", "de", "en"];
const missingLangs = REQUIRED_LANGS.filter((l) => !(SPANISH_TELLS_BY_LANG[l] instanceof RegExp));
if (missingLangs.length > 0) {
  console.error(
    `[audit-system-seo-faqs.test] FAIL — faltan regex para idiomas: ${missingLangs.join(", ")}`,
  );
  process.exit(1);
}

if (failures.length > 0) {
  console.error(
    `\n[audit-system-seo-faqs.test] FAIL — ${failures.length} de ${total} fixtures no coinciden:\n`,
  );
  for (const f of failures) {
    console.error(
      `  ✗ [${f.lang}] ${f.name}\n      esperado=${f.expect}, obtenido=${f.got ? "flag" : "pass"}\n      texto: ${JSON.stringify(f.text)}`,
    );
  }
  console.error(
    `\n[audit-system-seo-faqs.test] Si has cambiado SPANISH_TELLS_BY_LANG a propósito, actualiza también las fixtures de este test y la entrada Task #44 en docs/auditoria-sistema-seo-faqs/DECISIONES.md.`,
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Task #49 (2026-04-22): blog-embedded FAQs deben usar el MISMO mapa.
//
// Las FAQs de los posts del blog se validan en otras rutas (ver task) y allí
// no existía un equivalente del mapa por idioma. Ahora reutilizan
// `findBlogFaqSpanishTells` (que apoya en `SPANISH_TELLS_BY_LANG`). Este
// bloque construye un post sintético por idioma con una FAQ embebida, inyecta
// cadenas conocidas y comprueba:
//
//   - flag: la cadena castellanizada SÍ se reporta.
//   - pass: el cognado nativo NO se reporta.
//   - extracción: el extractor encuentra los pares Q/A esperados.
//
// Si alguien retira el chequeo del audit del blog o introduce un cognado
// nuevo, este test debe romperse.
// ---------------------------------------------------------------------------
function buildBlogPost(lang, qaPairs) {
  // Reproduce el shape mínimo de un post del blog: prólogo, encabezado FAQ
  // localizado, pares **Pregunta?** Respuesta, y una sección posterior.
  const heading = ({
    es: "### Preguntas frecuentes",
    en: "### Frequently asked questions",
    fr: "### Questions fréquentes",
    de: "### Häufige Fragen",
    pt: "### Perguntas frequentes",
    ca: "### Preguntes freqüents",
  })[lang];
  const body = qaPairs.map(([q, a]) => `**${q}** ${a}`).join("\n\n");
  return `## Intro\n\nIntro paragraph.\n\n${heading}\n\n${body}\n\n## Cierre\n\nCierre.\n`;
}

const BLOG_FIXTURES = [
  // pt: pregunta y respuesta limpias en pt-PT — no debe marcar.
  {
    name: "pt blog-faq: Q/A limpias en pt-PT no marcan",
    lang: "pt",
    qas: [["A LLC poupa contribuições?", "Não. Os autónomos pagam segundo a TGSS, e a quota mantém-se."]],
    expect: { tellsCount: 0, qaCount: 1 },
  },
  // pt: castellanismo en la pregunta.
  {
    name: "pt blog-faq: 'gestión' en pregunta SE marca",
    lang: "pt",
    qas: [["Como funciona a gestión fiscal?", "Depende do regime escolhido."]],
    expect: { tellsCount: 1, qaCount: 1, kinds: ["question"] },
  },
  // pt: castellanismo en la respuesta.
  {
    name: "pt blog-faq: 'hacienda' en respuesta SE marca",
    lang: "pt",
    qas: [["Que documentos preciso?", "Os pedidos pela hacienda incluem o IRS."]],
    expect: { tellsCount: 1, qaCount: 1, kinds: ["answer"] },
  },
  // ca: cognados válidos no marcan.
  {
    name: "ca blog-faq: 'també' y 'autònom' no marcan",
    lang: "ca",
    qas: [["Què fa un autònom?", "També declara l'IVA cada trimestre."]],
    expect: { tellsCount: 0, qaCount: 1 },
  },
  // ca: 'autónomo' (con tilde castellana) sí marca.
  {
    name: "ca blog-faq: 'autónomo' (ES) SE marca en CA",
    lang: "ca",
    qas: [["Sóc autónomo, què faig?", "Has de declarar l'IVA."]],
    expect: { tellsCount: 1, qaCount: 1, kinds: ["question"] },
  },
  // fr: 'también' en respuesta marca.
  {
    name: "fr blog-faq: 'también' en respuesta SE marca",
    lang: "fr",
    qas: [["Faut-il déclarer en France ?", "Oui, también il faut déclarer aux États-Unis."]],
    expect: { tellsCount: 1, qaCount: 1, kinds: ["answer"] },
  },
  // de: 'cuota' marca.
  {
    name: "de blog-faq: 'cuota' SE marca en DE",
    lang: "de",
    qas: [["Wie hoch ist der Beitrag?", "Die cuota ist hoch."]],
    expect: { tellsCount: 1, qaCount: 1, kinds: ["answer"] },
  },
  // en: 'quota' es palabra inglesa válida → no marca.
  {
    name: "en blog-faq: 'quota' (EN) no marca",
    lang: "en",
    qas: [["What is the quota?", "The annual quota is set yearly."]],
    expect: { tellsCount: 0, qaCount: 1 },
  },
  // en: 'autónomo' marca.
  {
    name: "en blog-faq: 'autónomo' SE marca en EN",
    lang: "en",
    qas: [["What is autónomo?", "It is the Spanish self-employed status."]],
    expect: { tellsCount: 1, qaCount: 1, kinds: ["question"] },
  },
  // es: nunca marca aunque contenga el mismo léxico.
  {
    name: "es blog-faq: idioma fuente, nunca marca",
    lang: "es",
    qas: [["¿Cómo funciona la gestión?", "Según Hacienda, la cuota se paga mensualmente."]],
    expect: { tellsCount: 0, qaCount: 1 },
  },
  // Múltiples Q/A: detecta sólo la castellanizada.
  {
    name: "pt blog-faq: 2 Q/A, sólo la 2ª se marca",
    lang: "pt",
    qas: [
      ["Quanto custa a LLC?", "Depende do estado escolhido."],
      ["Tenho obligación de declarar?", "Sim, todos os anos."],
    ],
    expect: { tellsCount: 1, qaCount: 2, kinds: ["question"] },
  },
];

const blogFailures = [];
let blogPassed = 0;

for (const f of BLOG_FIXTURES) {
  const src = buildBlogPost(f.lang, f.qas);
  const qas = extractBlogFaqQAs(src, f.lang);
  const tells = findBlogFaqSpanishTells(src, f.lang);
  const errs = [];
  if (qas.length !== f.expect.qaCount) {
    errs.push(`qaCount esperado=${f.expect.qaCount}, obtenido=${qas.length}`);
  }
  if (tells.length !== f.expect.tellsCount) {
    errs.push(`tellsCount esperado=${f.expect.tellsCount}, obtenido=${tells.length} (${JSON.stringify(tells)})`);
  }
  if (f.expect.kinds) {
    const got = tells.map(t => t.kind);
    const want = f.expect.kinds;
    if (got.length !== want.length || got.some((k, i) => k !== want[i])) {
      errs.push(`kinds esperado=${JSON.stringify(want)}, obtenido=${JSON.stringify(got)}`);
    }
  }
  if (errs.length > 0) {
    blogFailures.push({ ...f, errs });
  } else {
    blogPassed += 1;
  }
}

// Sanity check: BLOG_FAQ_HEADINGS debe cubrir los 6 idiomas.
const REQUIRED_BLOG_LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const missingBlogLangs = REQUIRED_BLOG_LANGS.filter((l) => !(BLOG_FAQ_HEADINGS[l] instanceof RegExp));
if (missingBlogLangs.length > 0) {
  console.error(
    `[audit-system-seo-faqs.test] FAIL — faltan regex BLOG_FAQ_HEADINGS para idiomas: ${missingBlogLangs.join(", ")}`,
  );
  process.exit(1);
}

if (blogFailures.length > 0) {
  console.error(
    `\n[audit-system-seo-faqs.test] FAIL (blog-FAQ) — ${blogFailures.length} de ${BLOG_FIXTURES.length} fixtures no coinciden:\n`,
  );
  for (const f of blogFailures) {
    console.error(`  ✗ [${f.lang}] ${f.name}`);
    for (const e of f.errs) console.error(`      ${e}`);
  }
  console.error(
    `\n[audit-system-seo-faqs.test] Si has cambiado el extractor o el mapa a propósito, actualiza también las fixtures de este test y la entrada Task #49 en docs/auditoria-sistema-seo-faqs/DECISIONES.md.`,
  );
  process.exit(1);
}

console.log(
  `[audit-system-seo-faqs.test] OK — ${passed}/${total} fixtures FAQs sistema + ${blogPassed}/${BLOG_FIXTURES.length} fixtures FAQs blog coinciden.`,
);
