#!/usr/bin/env node
/**
 * Reverts the (incorrect) "BOIR is mandatory" bullet inserted by
 * blog-fix-boi-mandatory.mjs and replaces it with the editorially
 * correct bullet: BOI Report is NOT required for foreign-owned US LLCs
 * after FinCEN's March 2025 interim final rule. The new bullet frames
 * the absence of obligation as a competitive advantage (less paperwork,
 * cleaner structure) — Exentax sales angle.
 *
 * Detection: locates the bullet starting with `- **BOI / BOIR
 * (Beneficial Ownership Information Report).**` (any language) and
 * replaces the whole bullet with the localized version below.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../client/src/data/blog-content/", import.meta.url).pathname;
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const NEW_BULLET = {
  es: `- **BOI / Corporate Transparency Act: tu LLC NO está obligada (ventaja competitiva).** Tras la **interim final rule de FinCEN de marzo de 2025**, la obligación del BOI Report quedó **restringida a las "foreign reporting companies"** (entidades constituidas FUERA de EE. UU. y registradas para hacer negocios en un estado). Una **LLC formada en EE. UU. propiedad de un no residente NO presenta BOI Report**: un trámite menos en tu calendario, menos burocracia y una estructura más limpia que nunca. Si tu LLC se constituyó antes de marzo de 2025 y ya presentaste BOI, conserva el acuse. El estado normativo puede cambiar: **monitorizamos FinCEN.gov en cada presentación** y, si la obligación vuelve a aplicar, la gestionamos sin coste adicional. Estado vigente verificable en [fincen.gov/boi](https://www.fincen.gov/boi).`,
  en: `- **BOI / Corporate Transparency Act: your LLC is NOT required to file (a competitive advantage).** After **FinCEN's March 2025 interim final rule**, the BOI Report obligation was **narrowed to "foreign reporting companies"** (entities formed OUTSIDE the US and registered to do business in a state). A **US-formed LLC owned by a non-resident does NOT file the BOI Report**: one fewer filing on your calendar, less paperwork, and a cleaner structure than ever. If your LLC was formed before March 2025 and you already filed BOI, keep the acknowledgement. The regulatory status can change again: **we monitor FinCEN.gov on every filing** and, if the obligation comes back, we handle it at no extra cost. Current status verifiable at [fincen.gov/boi](https://www.fincen.gov/boi).`,
  fr: `- **BOI / Corporate Transparency Act : votre LLC n'est PAS soumise (un avantage concurrentiel).** Après l'**interim final rule de FinCEN de mars 2025**, l'obligation du BOI Report a été **restreinte aux « foreign reporting companies »** (entités constituées HORS des États-Unis et enregistrées pour exercer dans un État). Une **LLC formée aux US détenue par un non-résident NE dépose PAS le BOI Report** : une formalité en moins au calendrier, moins de paperasse et une structure plus propre que jamais. Si votre LLC a été constituée avant mars 2025 et que vous avez déjà déposé le BOI, conservez l'accusé. Le statut peut évoluer : **nous surveillons FinCEN.gov à chaque dépôt** et, si l'obligation revient, nous la gérons sans frais supplémentaires. Statut actuel vérifiable sur [fincen.gov/boi](https://www.fincen.gov/boi).`,
  de: `- **BOI / Corporate Transparency Act: Ihre LLC ist NICHT verpflichtet (ein Wettbewerbsvorteil).** Nach der **FinCEN Interim Final Rule vom März 2025** wurde die BOI-Meldepflicht **auf „foreign reporting companies" beschränkt** (außerhalb der USA gegründete Einheiten, die in einem Bundesstaat zur Geschäftstätigkeit registriert sind). Eine **in den USA von einem Nicht-Residenten gegründete LLC reicht KEINEN BOI Report ein**: eine Meldung weniger im Kalender, weniger Bürokratie und eine sauberere Struktur als je zuvor. Wenn Ihre LLC vor März 2025 gegründet wurde und das BOI bereits eingereicht ist, Bestätigung aufbewahren. Der Regelstatus kann erneut wechseln: **wir überwachen FinCEN.gov bei jeder Einreichung** und, falls die Pflicht zurückkehrt, übernehmen wir sie ohne Aufpreis. Aktueller Stand auf [fincen.gov/boi](https://www.fincen.gov/boi) prüfbar.`,
  pt: `- **BOI / Corporate Transparency Act: a tua LLC NÃO está obrigada (uma vantagem competitiva).** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida às "foreign reporting companies"** (entidades constituídas FORA dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA detida por um não residente NÃO submete o BOI Report**: uma formalidade a menos no calendário, menos burocracia e uma estrutura mais limpa do que nunca. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo. O estado regulatório pode mudar: **monitorizamos a FinCEN.gov em cada submissão** e, se a obrigação voltar, gerimos sem custo adicional. Estado atual verificável em [fincen.gov/boi](https://www.fincen.gov/boi).`,
  ca: `- **BOI / Corporate Transparency Act: la teva LLC NO està obligada (un avantatge competitiu).** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a les "foreign reporting companies"** (entitats constituïdes FORA dels EUA i registrades per operar en un estat). Una **LLC formada als EUA propietat d'un no resident NO presenta el BOI Report**: un tràmit menys al calendari, menys burocràcia i una estructura més neta que mai. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament. L'estat normatiu pot canviar: **monitoritzem FinCEN.gov en cada presentació** i, si l'obligació torna a aplicar, la gestionem sense cost addicional. Estat vigent verificable a [fincen.gov/boi](https://www.fincen.gov/boi).`,
};

// Match the (incorrect) bullet inserted previously across 6 languages.
// Anchor on the unique stem `- **BOI / BOIR (Beneficial Ownership ...)`.
const WRONG_BULLET = /-\s+\*\*BOI\s*\/\s*BOIR \(Beneficial Ownership Information Report\)\.\*\*[^\n]*(?:\n(?!\s*-\s|\s*##|\s*\n|\s*<!--|\s*\*\*[A-Z])[^\n]*)*/g;

let touched = 0, anomalies = 0;
const perLang = Object.fromEntries(LANGS.map((l) => [l, 0]));

for (const lang of LANGS) {
  const dir = join(ROOT, lang);
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
  for (const f of files) {
    const path = join(dir, f);
    const before = readFileSync(path, "utf8");
    if (!WRONG_BULLET.test(before)) {
      WRONG_BULLET.lastIndex = 0;
      if (/BOI \/ BOIR \(Beneficial Ownership/.test(before)) {
        anomalies++;
        console.warn(`[anomaly] ${lang}/${f}: stem present but regex did not match`);
      }
      continue;
    }
    WRONG_BULLET.lastIndex = 0;
    const after = before.replace(WRONG_BULLET, NEW_BULLET[lang]);
    if (after === before) continue;
    writeFileSync(path, after, "utf8");
    touched++;
    perLang[lang]++;
  }
}

console.log(`[boi-revert] touched=${touched} anomalies=${anomalies}`);
console.log(`[boi-revert] per-lang: ${JSON.stringify(perLang)}`);
