import es from "../client/src/i18n/locales/es";
import en from "../client/src/i18n/locales/en";
import fr from "../client/src/i18n/locales/fr";
import de from "../client/src/i18n/locales/de";
import pt from "../client/src/i18n/locales/pt";
import ca from "../client/src/i18n/locales/ca";
import { writeFileSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

type Bundle = Record<string, unknown>;
type Flat = Record<string, string>;

function flatten(obj: Bundle, prefix = "", out: Flat = {}): Flat {
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    const v = obj[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      flatten(v as Bundle, full, out);
    } else if (typeof v === "string") {
      out[full] = v;
    }
  }
  return out;
}

const locales: Record<string, Flat> = {
  es: flatten(es as Bundle),
  en: flatten(en as Bundle),
  fr: flatten(fr as Bundle),
  de: flatten(de as Bundle),
  pt: flatten(pt as Bundle),
  ca: flatten(ca as Bundle),
};

// ── Helpers ─────────────────────────────────────────────────────────
const stripHtml = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const tokens = (s: string) =>
  stripHtml(s).toLowerCase().match(/[a-záéíóúñçàâäèêëîïôöùûüœæßẞ'’-]+/giu) ?? [];

// Tag balance per HTML body
function tagBalance(html: string): { tag: string; diff: number }[] {
  const counts = new Map<string, number>();
  for (const m of html.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g)) {
    const tag = m[1].toLowerCase();
    if (["br", "img", "hr", "input", "meta", "link"].includes(tag)) continue;
    const isClose = m[0].startsWith("</");
    const isSelfClose = m[0].endsWith("/>");
    if (isSelfClose) continue;
    counts.set(tag, (counts.get(tag) ?? 0) + (isClose ? -1 : 1));
  }
  return [...counts.entries()]
    .filter(([, d]) => d !== 0)
    .map(([tag, diff]) => ({ tag, diff }));
}

// ── 1. HTML balance check (legales) ─────────────────────────────────
const htmlIssues: Record<string, { tag: string; diff: number }[]> = {};
for (const [lang, bundle] of Object.entries(locales)) {
  for (const [k, v] of Object.entries(bundle)) {
    if (!v.includes("<")) continue;
    const issues = tagBalance(v);
    if (issues.length) htmlIssues[`${lang}:${k}`] = issues;
  }
}

// ── 2. Untranslated strings (real Spanish words leaking into other locales) ──
// Lists are intentionally short and unambiguous: words that exist in ES
// but NOT (with the same form/meaning) in the target language.
const esLeakWords: Record<string, RegExp> = {
  en: /\b(Buscar|Cambiar|Descargar|Reintentar|Cargando|Cerrar|Aceptar|Cancelar|Guardar|Enviar|Continuar|Volver|Siguiente|Anterior|Inicio|Servicios|Precios|Reservar|Calculadora|Ahorro|Estructura|Asesoría|Autónomos|Empresarios|Sociedad|Empresa|España|Estados Unidos|Reino Unido|País|Idioma|Mensual|Anual|Gratuito|Gratis|Comprar|Solicitar|Llamar|Hablar)\b/i,
  fr: /\b(Buscar|Cambiar|Descargar|Reintentar|Cargando|Cerrar|Aceptar|Cancelar|Guardar|Enviar|Continuar|Volver|Siguiente|Anterior|Inicio|Servicios|Precios|Calculadora|Estructura|Asesoría|Autónomos|Empresarios|Sociedad|Empresa|España|Reino Unido|País|Idioma|Mensual|Anual|Gratuito|Gratis|Comprar|Solicitar|Llamar|Hablar)\b/i,
  de: /\b(Buscar|Cambiar|Descargar|Reintentar|Cargando|Cerrar|Aceptar|Cancelar|Guardar|Enviar|Continuar|Volver|Siguiente|Anterior|Inicio|Servicios|Precios|Calculadora|Estructura|Asesoría|Autónomos|Empresarios|Sociedad|Empresa|España|Reino Unido|País|Idioma|Mensual|Anual|Gratuito|Gratis|Comprar|Solicitar|Llamar|Hablar)\b/i,
  // PT and CA share most latinate cognates with ES (`para`, `anual`,
  // `idioma`, `estructura`, `empresa`, `país`, `cancelar`, `continuar`,
  // `enviar`, `guardar`, `solicitar`, `Reino Unido`...). Only flag words
  // that exist in ES but are clearly NOT spelt the same way in PT/CA.
  pt: /\b(Asesoría|Sociedad|Empresarios|España|Llamar|Hablar|Cerrar|Aceptar|Cargando|Cambiar|Descargar|Reintentar|Siguiente|Volver)\b/i,
  ca: /\b(Asesoría|Sociedad|Empresarios|España|Llamar|Hablar|Cerrar|Aceptar|Cargando|Cambiar|Descargar|Reintentar|Siguiente|Volver|Autónomos)\b/i,
};

const leaks: Record<string, { key: string; value: string; matched: string }[]> = {};
for (const lang of ["en", "fr", "de", "pt", "ca"] as const) {
  const re = esLeakWords[lang];
  leaks[lang] = [];
  for (const [k, v] of Object.entries(locales[lang])) {
    const m = v.match(re);
    if (m) leaks[lang].push({ key: k, value: v, matched: m[0] });
  }
}

// ── 3. Treatment / register coherence ────────────────────────────────
// Quick heuristic: count formal vs informal markers in long prose values
// Unicode-aware boundaries: ASCII `\b` matches inside accented words
// (e.g. `tes` inside French `êtes`/`concrètes`/`requêtes`, polluting the
// conflict report). Wrap each token list in lookarounds that exclude
// preceding/following letters of any script. Requires the `u` flag.
const UB = "(?<![\\p{L}\\p{N}])"; // unicode left boundary
const UE = "(?![\\p{L}\\p{N}])"; // unicode right boundary
const probe = (alts: string) => new RegExp(`${UB}(?:${alts})${UE}`, "giu");
const registerProbes: Record<string, { informal: RegExp; formal: RegExp }> = {
  es: { informal: probe("tu|tú|tus|tuyo|tuyas?|contigo|sabes|puedes|tienes|quieres|piensa|elige|imagina"),
        formal:   probe("usted|ustedes|su empresa|le|les|sabe usted|puede usted") },
  fr: { informal: probe("tu|toi|ton|ta|tes|tien|sais-tu|peux-tu|veux-tu"),
        formal:   probe("vous|votre|vos|savez|pouvez|voulez") },
  de: { informal: probe("du|dein|deine|deinen|dir|dich|kannst|willst|hast|weißt"),
        formal:   probe("Sie|Ihr|Ihre|Ihren|Ihnen|können|wollen|haben|wissen") },
  pt: { informal: probe("tu|teu|tua|teus|tuas|contigo|sabes|podes|tens|queres"),
        formal:   probe("você|seu|sua|seus|suas|sabe|pode|tem|quer") },
  // CA: `seu/seva/sap/pot/té/vol` are third-person impersonal verbs and
  // possessives in catalan and are NOT reliable formal markers (`vostè`
  // is). Restrict to unambiguous formal address tokens so the conflict
  // list does not get polluted with FAQ prose written in informal `tu`.
  ca: { informal: probe("tu|teu|teva|teus|teves|saps|pots|tens|vols"),
        formal:   probe("vostè|vostès") },
};
const registerStats: Record<string, { informal: number; formal: number; conflicts: string[] }> = {};
for (const lang of ["es", "fr", "de", "pt", "ca"] as const) {
  const probes = registerProbes[lang];
  let inf = 0, frm = 0;
  const conflicts: string[] = [];
  for (const [k, v] of Object.entries(locales[lang])) {
    if (v.length < 30) continue;
    const i = (v.match(probes.informal) ?? []).length;
    const f = (v.match(probes.formal)   ?? []).length;
    inf += i; frm += f;
    if (i > 0 && f > 0) conflicts.push(`${k} (inf=${i}, frm=${f})`);
  }
  registerStats[lang] = { informal: inf, formal: frm, conflicts: conflicts.slice(0, 30) };
}

// ── 4. Terminology coherence ────────────────────────────────────────
const terms: Record<string, RegExp[]> = {
  llc:        [/\bLLC\b/g, /\bLimited Liability Company\b/g, /\bSociedad de Responsabilidad Limitada\b/gi],
  ein:        [/\bEIN\b/g, /\bEmployer Identification Number\b/g],
  itin:       [/\bITIN\b/g, /\bIndividual Taxpayer Identification Number\b/g],
  freelancer: [/\bautónomos?\b/gi, /\bfreelancers?\b/gi, /\bself-employed\b/gi, /\bindépendants?\b/gi, /\bSelbstständige\w*\b/g, /\bautônomos?\b/gi, /\bautònoms?\b/gi],
  bracket:    [/\btramos?\b/gi, /\bbrackets?\b/gi, /\btranches?\b/gi, /\bSteuerklassen\w*\b/g, /\bescalões?\b/gi, /\btrams?\b/gi],
};
const termStats: Record<string, Record<string, number>> = {};
for (const [lang, bundle] of Object.entries(locales)) {
  termStats[lang] = {};
  const all = Object.values(bundle).join(" \n ");
  for (const [name, regexes] of Object.entries(terms)) {
    let total = 0;
    for (const re of regexes) total += (all.match(re) ?? []).length;
    termStats[lang][name] = total;
  }
}

// ── 5. Same-as-ES detection (refined) ────────────────────────────────
// Three layers of suppression to drop ~95% of false positives:
//   a) brand / acronym / form-number registry (single-line match);
//   b) tokenwise allowlist of universal cognates valid in the target
//      language (e.g. PT/CA share most ES nouns of latinate origin);
//   c) per-locale country & official-regime label registry.
const refinedSameAsEs: Record<string, string[]> = {};
const refinedSuppressedAsEs: Record<string, string[]> = {};

const brandsRe = /^(Exentax|LLC|EIN|ITIN|FinCEN|IRS|BOI|Wyoming|Delaware|New Mexico|Albuquerque|Florida|Form \d+|Form \d+ \+ Form \d+|Annual Report|Operating Agreement|Articles of Organization|Mercury|Relay|Adyen|Stripe|Google Meet|WhatsApp|Instagram|TikTok|YouTube|LinkedIn|Twitter|X|Facebook|Email|Email \*|email|info@exentax\.com|legal@exentax\.com|exentax\.com|Cookies|Analytics|Marketing|BLOG|Blog|Compliance|COMPLIANCE|Legal|Disclaimer|Setup|Total|Anual|Mensual|Hora|Continuar|Configurar|Excelente|Anterior|Igual|Opcional\.?|Calculando\.{0,3}|Configura cookies|Configurar cookies)$/i;

// Cognates valid in the target language. Each entry is a phrase or
// short label that exists with the same form/spelling in BOTH ES and
// the target locale and therefore should not be flagged.
// Per-key intentional-identical allowlist (shared with validate-i18n).
// When a key appears in this list for a given locale, refined-same-as-ES
// will not flag it. This is the auditable, surgical complement to the
// value-shaped cognateAllowlist below — prefer this for unique strings
// tied to a specific key.
type IntentionalIdenticalShape = Record<string, string[]>;
const intentionalIdenticalPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "i18n-intentional-identical.json"
);
const intentionalIdentical: IntentionalIdenticalShape = JSON.parse(
  readFileSync(intentionalIdenticalPath, "utf8")
);
const intentionalIdenticalSets: Record<string, Set<string>> = Object.fromEntries(
  Object.entries(intentionalIdentical).map(([lang, keys]) => [lang, new Set(keys)])
);

const cognateAllowlist: Record<string, RegExp> = {
  // Brand-like, code-like and label-like patterns universally allowed.
  en: /^(SaaS|Software \/ SaaS|E-commerce|Dropshipping|Copywriting|Coaching \/ mentoring|Print on demand|Media buying \/ paid ads|Email marketing|Outsourcing|No-code \/ low-code|E-commerce \/ dropshipping|Sole Trader|Limited Company \(Ltd\)|Auto-entrepreneur|GmbH|National Insurance \(Class 4\)|Corporation Tax \(19-25%\)|Dividend Tax \(higher rate est\.\)|~22% micro-entrepreneur \/ TNS|INPS Gestione Separata|Global Complementario|Freelancers|Colombia|Argentina|Portugal|México|Chile|Austria|Bélgica|Reino Unido|30 min|Fase \d+|ESTADOS|Europe\/Madrid \(CET\/CEST\)|Personal Allowance £12\.570|IRAP \(3,9%\)|IMSS \/ IESS estimado|Einkommensteuer \(ESt\)|Sozialversicherung \(SVS\)|Körperschaftsteuer \(KöSt 23%\)|Kapitalertragsteuer dividendos \(KESt 27,5%\)|Persona Física \(RESICO\)|Persona Moral \(SA \/ SAPI\)|Persona Natural|Société \(SAS \/ SARL\)|Société \(SRL \/ BV\)|Indépendant \(Zelfstandige\)|Impôt des personnes physiques \(IPP\)|Cotisations sociales indépendant|Impôt des sociétés \(20\/25%\)|Précompte mobilier dividendes \(30%\)|Comptabilité et administration|Impôt sur le revenu \(IR\)|Barème progressif 2025 DGFiP|Cotisations sociales \(URSSAF\)|Impôt sur les sociétés \(IS 15\/25%\)|Flat tax dividendes \(PFU 30%\)|Einzelunternehmer|Steuerberater und Verwaltung)$/u,
  fr: /^(SaaS|Software \/ SaaS|E-commerce|Dropshipping|Copywriting|Print on demand|Email marketing|No-code \/ low-code|E-commerce \/ dropshipping|Sole Trader|Limited Company \(Ltd\)|Auto-entrepreneur|GmbH|National Insurance \(Class 4\)|Corporation Tax \(19-25%\)|~22% micro-entrepreneur \/ TNS|INPS Gestione Separata|IRAP \(3,9%\)|Global Complementario|Einkommensteuer \(ESt\)|Sozialversicherung \(SVS\)|Körperschaftsteuer \(KöSt 23%\)|Société \(SAS \/ SARL\)|Société \(SRL \/ BV\)|Indépendant \(Zelfstandige\)|Impôt des personnes physiques \(IPP\)|Cotisations sociales indépendant|Impôt des sociétés \(20\/25%\)|Précompte mobilier dividendes \(30%\)|Comptabilité et administration|Impôt sur le revenu \(IR\)|Barème progressif 2025 DGFiP|Cotisations sociales \(URSSAF\)|Impôt sur les sociétés \(IS 15\/25%\)|Flat tax dividendes \(PFU 30%\)|LLC USA \(Exentax\)|Portugal|30 min|Setup|Total|Marketing|Email \*|Europe\/Madrid \(CET\/CEST\))$/u,
  de: /^(SaaS|Software \/ SaaS|Dropshipping|Copywriting|Outsourcing|Sole Trader|Limited Company \(Ltd\)|Auto-entrepreneur|GmbH|Einzelunternehmer|National Insurance \(Class 4\)|Corporation Tax \(19-25%\)|Personal Allowance £12\.570|~22% micro-entrepreneur \/ TNS|INPS Gestione Separata|IRAP \(3,9%\)|Global Complementario|Einkommensteuer \(ESt\)|Sozialversicherung \(SVS\)|Körperschaftsteuer \(KöSt 23%\)|Steuerberater und Verwaltung|LLC USA|Portugal|Chile|30 min|Setup|Marketing|Europe\/Madrid \(CET\/CEST\))$/u,
  pt: /^(SaaS|Software \/ SaaS|E-commerce|Dropshipping|Copywriting|Print on demand|Email marketing|No-code \/ low-code|E-commerce \/ dropshipping|Coaching \/ mentoring|Sole Trader|Limited Company \(Ltd\)|Auto-entrepreneur|GmbH|National Insurance \(Class 4\)|Corporation Tax \(19-25%\)|Personal Allowance £12\.570|~22% micro-entrepreneur \/ TNS|INPS Gestione Separata|IRAP \(3,9%\)|IMSS \/ IESS estimado|Europe\/Madrid \(CET\/CEST\)|Global Complementario|Global Complementario \(dividendos\)|Einkommensteuer \(ESt\)|Sozialversicherung \(SVS\)|Körperschaftsteuer \(KöSt 23%\)|Kapitalertragsteuer dividendos \(KESt 27,5%\)|Persona Física \(RESICO\)|Persona Moral \(SA \/ SAPI\)|Persona Natural|Persona Física|Society \(SAS \/ SARL\)|Autónomo|LLC Estados Unidos|Freelancers|Portugal|México|Argentina|Chile|Austria|Bélgica|Reino Unido|Setup|Total|Total anual|Anual|Anterior|Continuar|Configurar|Hora|Igual|Opcional\.?|Calculando\.{0,3}|Excelente|Reembolsos|Cancelada|Confirmada|Reservada|Reagendada|Concluída|fiscal\.|Marketing|Por Exentax|Todos|Todas|para|Mes anterior|Reserva confirmada|IRPF a pagar|ROI realista do setup|Coworking \/ oficina|Home office \(proporcional\)|Oficina \/ coworking|Freelancer digital|Consultor \/ coach|Seguros|Uso proporcional|Política de cookies|Política de cookies · Exentax|Esta página|Política cookies Exentax, cookies LLC, Exentax cookies|política cookies Exentax, cookies LLC, Exentax cookies|política cookies Exentax, cookies LLC, Exentax cookies|EL PROBLEMA|Configurar cookies|Configurar|Perfil ideal|Opera digitalmente|resultados encontrados|\{\{count\}\} resultado encontrado|\{\{count\}\} resultados encontrados|\{\{dayName\}\} \{\{day\}\} de \{\{month\}\}|\{\{dayName\}\} \{\{day\}\} de \{\{month\}\} de \{\{year\}\}|Email \*|Mensual|fiscal\.|COMPLIANCE ANUAL|Fase \d+|ESTADOS|Form 1120 \+ Form 5472|30 min|Compliance|BLOG|Blog|Legal|Cookies|Configurar cookies|Configurar|Cancelar)$/u,
  ca: /^(SaaS|Software \/ SaaS|E-commerce|Dropshipping|Copywriting|Email marketing|Outsourcing|Sole Trader|Limited Company \(Ltd\)|Auto-entrepreneur|GmbH|National Insurance \(Class 4\)|Corporation Tax \(19-25%\)|Personal Allowance £12\.570|~22% micro-entrepreneur \/ TNS|INPS Gestione Separata|IRAP \(3,9%\)|Global Complementario|Einkommensteuer \(ESt\)|Sozialversicherung \(SVS\)|Körperschaftsteuer \(KöSt 23%\)|Persona Física \(RESICO\)|Persona Moral \(SA \/ SAPI\)|Persona Natural|Freelancers|Portugal|México|Argentina|Chile|Austria|Bélgica|Reino Unido|Estructura|Estructura fiscal|Estructura fiscal internacional|Setup|Total|Total anual|Anual|Mensual|Anterior|Continuar|Configurar|Hora|Igual|Opcional\.?|Calculando\.{0,3}|Excelente|Reembolsos|Cancelada|Confirmada|Reservada|Reagendada|Concluída|Mes anterior|Reserva confirmada|IRPF a pagar|ROI realista del setup|Coworking \/ oficina|Home office \(proporcional\)|Oficina \/ coworking|Freelancer digital|Consultor \/ coach|Seguros|Uso proporcional|Marketing|No importa el canal\.|Política de cookies|EL PROBLEMA|Configurar cookies|Configurar|Perfil ideal|Opera digitalmente|fiscal\.|Form 1120 \+ Form 5472|COMPLIANCE|COMPLIANCE ANUAL|Fase \d+|30 min|Cookies|Disclaimer|Analytics|Email \*|\{\{dayName\}\} \{\{day\}\} de \{\{month\}\}|\{\{dayName\}\} \{\{day\}\} de \{\{month\}\} de \{\{year\}\}|Compliance|BLOG|Blog|Legal|Operativa|E-commerce \/ dropshipping|Base liquidable ~\{\{base\}\}k€ · Mín\. personal \{\{personal\}\}|ISR \(Pers\. Física Act\. Empresarial\)|ISR \(Persona Moral 30%\)|~26,8% sobre base neta|min de lectura|Reprogramada|Completada)$/u,
};

for (const lang of ["en", "fr", "de", "pt", "ca"] as const) {
  refinedSameAsEs[lang] = [];
  refinedSuppressedAsEs[lang] = [];
  const allow = cognateAllowlist[lang];
  for (const [k, v] of Object.entries(locales[lang])) {
    const esVal = locales.es[k];
    if (typeof esVal !== "string" || esVal !== v) continue;
    const stripped = v.trim();
    if (stripped.length < 4) continue;
    if (/^[\d\s\-\.,$€%:/]+$/.test(stripped)) continue;
    if (brandsRe.test(stripped)) continue;
    // Skip pure URL / email / mailto
    if (/^(https?:|mailto:|tel:|\/|#)/i.test(stripped)) continue;
    if (allow && allow.test(stripped)) {
      refinedSuppressedAsEs[lang].push(k);
      continue;
    }
    // Per-key intentional-identical allowlist (auditable, key-scoped).
    if (intentionalIdenticalSets[lang]?.has(k)) {
      refinedSuppressedAsEs[lang].push(k);
      continue;
    }
    refinedSameAsEs[lang].push(k);
  }
}

// ── Output ───────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../.local-audit");
import { mkdirSync } from "fs";
mkdirSync(outDir, { recursive: true });

writeFileSync(resolve(outDir, "flat-locales.json"), JSON.stringify(locales, null, 2));
writeFileSync(resolve(outDir, "html-issues.json"), JSON.stringify(htmlIssues, null, 2));
writeFileSync(resolve(outDir, "leaks.json"), JSON.stringify(leaks, null, 2));
writeFileSync(resolve(outDir, "register-stats.json"), JSON.stringify(registerStats, null, 2));
writeFileSync(resolve(outDir, "term-stats.json"), JSON.stringify(termStats, null, 2));
writeFileSync(resolve(outDir, "refined-same-as-es.json"), JSON.stringify(refinedSameAsEs, null, 2));

// ── Console summary ──────────────────────────────────────────────────
console.log("═══ i18n Quality Audit ═══");
console.log(`Locales: ${Object.keys(locales).map(l => `${l}=${Object.keys(locales[l]).length}`).join(", ")}`);
console.log();
console.log(`HTML balance issues: ${Object.keys(htmlIssues).length}`);
for (const [k, v] of Object.entries(htmlIssues).slice(0, 10)) console.log(`  ${k}: ${JSON.stringify(v)}`);
console.log();
console.log("Spanish leaks (real ES words in other locales):");
for (const [lang, items] of Object.entries(leaks)) {
  console.log(`  ${lang.toUpperCase()}: ${items.length}`);
  for (const it of items.slice(0, 8)) console.log(`    - ${it.key}: "${it.matched}" → ${it.value.slice(0, 80)}`);
}
console.log();
console.log("Register coherence (informal vs formal markers in long values):");
for (const [lang, s] of Object.entries(registerStats)) {
  console.log(`  ${lang.toUpperCase()}: informal=${s.informal}, formal=${s.formal}, conflict-keys=${s.conflicts.length}`);
  for (const c of s.conflicts.slice(0, 5)) console.log(`    ! ${c}`);
}
console.log();
console.log("Refined same-as-ES (excluding numerics/brands/urls):");
for (const [lang, keys] of Object.entries(refinedSameAsEs)) {
  console.log(`  ${lang.toUpperCase()}: ${keys.length}`);
}
console.log();
console.log(`Artifacts written to ${outDir}`);

// ── Strict gate (CI) ─────────────────────────────────────────────────
// In --strict mode, exit non-zero if there is ANY violation across the
// gate-able findings: HTML tag balance, Spanish leakage into other
// locales, register conflicts in a single key, or refined same-as-ES
// strings (text that was never translated).
const strict = process.argv.includes("--strict");
if (strict) {
  const htmlIssueCount = Object.keys(htmlIssues).length;
  const leakCount = Object.values(leaks).reduce((acc, items) => acc + items.length, 0);
  const conflictCount = Object.values(registerStats).reduce(
    (acc, s) => acc + s.conflicts.length,
    0
  );
  const sameAsEsCount = Object.values(refinedSameAsEs).reduce(
    (acc, keys) => acc + keys.length,
    0
  );
  const total = htmlIssueCount + leakCount + conflictCount + sameAsEsCount;
  console.log();
  console.log("═══ Strict gate ═══");
  console.log(`  HTML issues:        ${htmlIssueCount}`);
  console.log(`  Spanish leaks:      ${leakCount}`);
  console.log(`  Register conflicts: ${conflictCount}`);
  console.log(`  Same-as-ES strings: ${sameAsEsCount}`);
  console.log(`  Total violations:   ${total}`);
  if (total > 0) {
    console.error("✗ i18n quality audit FAILED in --strict mode.");
    process.exit(1);
  }
  console.log("✓ i18n quality audit PASS (strict).");
}
