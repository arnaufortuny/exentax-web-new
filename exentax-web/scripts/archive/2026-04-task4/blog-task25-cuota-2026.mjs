#!/usr/bin/env node
/*
 * Task #25 — Refresh stale 2024-vintage autónomo (RETA) figures across the
 * blog corpus to the consolidated 2026 reality:
 *   - tramo bajo (rendimientos < 670 €/mes): cuota ~205-226 €/mes
 *   - tramo medio (1.700-2.030 €/mes): cuota ~360-640 €/mes
 *   - tramo alto (>4.050 €/mes): cuota base mínima ~545-607 €/mes,
 *     pero hasta **~1.607 €/mes** si se elige la base máxima del tramo
 *   - rango total que un autónomo puede pagar: ~205 € — ~1.607 €/mes
 *   - tarifa plana: ~87 €/mes los primeros 12 meses (prorrogable 12 más)
 *
 * The legacy mentions ("230€-500€/mes", "230-590 €/mes", "~225/~590") were
 * conservative pre-reform numbers that no longer reflect what a freelancer
 * actually pays in 2026 — top brackets can reach ~1.607 €/mes on base máxima.
 * This script rewrites those mentions in-place across es/ca/de/fr/pt/en.
 *
 * It also bumps `updatedAt` for any post whose body changed.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT = resolve(ROOT, "client/src/data/blog-content");
const POSTS = resolve(ROOT, "client/src/data/blog-posts.ts");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const TODAY = "2026-04-21";

// ---------------------------------------------------------------------------
// 1. Generic regex replacements applied across every blog file. Each entry
//    is run against the entire file body. Order matters where overlap.
// ---------------------------------------------------------------------------
const GENERIC = [
  // ---- "230€ y 500€/mes" — prosa larga (es/ca/pt/de/fr) -----------------
  [/230€ y 500€\/mes/g, "200 € y 1.600 €/mes"],
  [/230€ i 500€\/mes/g, "200 € i 1.600 €/mes"],
  [/230€ e 500€\/mes/g, "200 € e 1.600 €/mes"],
  [/230€ und 500€\/Monat/g, "200 € und 1.600 €/Monat"],
  [/230€ et 500€\/mois/g, "200 € et 1.600 €/mois"],
  // ---- "(2.760€-6.000€/año)" parens annual ranges -----------------------
  [/\(2\.760€-6\.000€\/año\)/g, "(unos 2.500-19.000 €/año, según tramo y base elegida)"],
  [/\(2\.760€-6\.000€\/any\)/g, "(uns 2.500-19.000 €/any, segons tram i base escollida)"],
  [/\(2\.760€-6\.000€\/ano\)/g, "(cerca de 2.500-19.000 €/ano, segundo escalão e base escolhida)"],
  [/\(2\.760€-6\.000€\/Jahr\)/g, "(rund 2.500-19.000 €/Jahr, je nach Stufe und gewählter Bemessungsgrundlage)"],
  [/\(2 760€-6 000€\/an\)/g, "(environ 2 500-19 000 €/an, selon la tranche et la base choisie)"],
  // ---- Inline parenthetical "(230-500€/mes)" / "(230-500€/mois)" --------
  [/\(230-500€\/mes\)/g, "(200-1.600 €/mes según tramo y base)"],
  [/\(230-500€\/Monat\)/g, "(200-1.600 €/Monat je nach Stufe und Basis)"],
  [/\(230-500€\/mois\)/g, "(200-1 600 €/mois selon la tranche et la base)"],
  [/\(230-500€\/mês\)/g, "(200-1.600 €/mês conforme escalão e base)"],
  [/\(230-500€\/mês\)/gi, "(200-1.600 €/mês conforme escalão e base)"],
  // ---- "entre 230€ y 500€/mes" bulleted item ----------------------------
  [/entre 230€ y 500€\/mes según ingresos/g, "entre 200 € y 1.600 €/mes según tramo de ingresos y base elegida"],
  [/entre 230€ i 500€\/mes segons ingressos/g, "entre 200 € i 1.600 €/mes segons tram d'ingressos i base escollida"],
  // ---- llc-alternativa-autonomo-espana: "230 € y 590 €" / "230-590 €" --
  [/entre 230 € y 590 €\/mes/g, "entre 200 € y 1.600 €/mes"],
  [/entre 230 € i 590 €\/mes/g, "entre 200 € i 1.600 €/mes"],
  [/entre 230 € e 590 €\/mês/g, "entre 200 € e 1.600 €/mês"],
  [/zwischen 230 € und 590 €\/Monat/g, "zwischen 200 € und 1.600 €/Monat"],
  [/entre 230 € et 590 €\/mois/g, "entre 200 € et 1 600 €/mois"],
  [/between 230 € and 590 €\/month/g, "between 200 € and 1,600 €/month"],
  // tabla "230-590 €/mes (RETA)"
  [/230-590 €\/mes \(RETA\)/g, "200-1.600 €/mes (RETA, según tramo y base)"],
  [/230-590 €\/mês \(RETA\)/g, "200-1.600 €/mês (RETA, conforme escalão e base)"],
  [/230-590 €\/Monat \(RETA\)/g, "200-1.600 €/Monat (RETA, je nach Stufe und Basis)"],
  [/230-590 €\/mois \(RETA\)/g, "200-1 600 €/mois (RETA, selon la tranche et la base)"],
  [/230-590 €\/month \(RETA\)/g, "200-1,600 €/month (RETA, by bracket and base)"],
  // ---- v2-expansion summary "~225 €/mes ... ~590 €/mes" ----------------
  [/cuota mínima \*\*~225 €\/mes\*\* y máxima \*\*~590 €\/mes\*\*/g,
   "cuota mínima **~205 €/mes** y máxima **~1.607 €/mes** (según tramo y base de cotización elegida)"],
  [/quota mínima \*\*~225 €\/mes\*\* i màxima \*\*~590 €\/mes\*\*/g,
   "quota mínima **~205 €/mes** i màxima **~1.607 €/mes** (segons tram i base de cotització escollida)"],
  [/cota mínima \*\*~225 €\/mês\*\* e máxima \*\*~590 €\/mês\*\*/g,
   "cota mínima **~205 €/mês** e máxima **~1.607 €/mês** (conforme escalão e base escolhida)"],
  [/Minimum \*\*~225 €\/Monat\*\*, Maximum \*\*~590 €\/Monat\*\*/g,
   "Minimum **~205 €/Monat**, Maximum **~1.607 €/Monat** (je nach Stufe und gewählter Bemessungsgrundlage)"],
  [/cotisation minimale \*\*~225 €\/mois\*\* et maximale \*\*~590 €\/mois\*\*/g,
   "cotisation minimale **~205 €/mois** et maximale **~1 607 €/mois** (selon la tranche et la base choisie)"],
  [/minimum contribution \*\*~225 €\/month\*\* and maximum \*\*~590 €\/month\*\*/g,
   "minimum contribution **~205 €/month** and maximum **~1,607 €/month** (depending on bracket and elected contribution base)"],
  // ---- "300-400 €/mes" typical range mentioned next to ranges -----------
  // (kept; this is what people *actually* pay on base mínima of mid bracket)
];

// ---------------------------------------------------------------------------
// 2. Per-file targeted rewrites for cuota-autonomo-2026 (the dedicated
//    reference article) — 6 langs. We replace the lead paragraph and the
//    "Tabla de cuotas por tramo" paragraph so the headline ranges reflect
//    base mínima *and* base máxima within each bracket.
// ---------------------------------------------------------------------------
const CUOTA_REPLACEMENTS = {
  es: [
    [/La cuota mensual va desde poco más de 200 euros para los rendimientos netos más bajos hasta cerca de 600 euros para los superiores a los 6\.000 euros mensuales\./,
     "La cuota mensual va desde unos 205 euros para los rendimientos netos más bajos hasta cerca de 1.607 euros mensuales si eliges la base máxima del tramo más alto. Sobre la base mínima de cada tramo, los importes son notablemente menores: hasta unos 607 euros mensuales para rendimientos por encima de los 6.000 euros."],
    [/Actualmente, los tramos más bajos \(hasta 670 euros netos\) cotizan unos 200-225 euros al mes; el tramo medio \(1\.700-1\.850 euros netos, donde se concentran muchos freelancers\) ronda los 295-310 euros; y los tramos altos \(más de 6\.000 euros mensuales\) llegan hasta los 590-610 euros\./,
     "Sobre la base mínima de cada tramo, los más bajos (hasta 670 euros netos) cotizan unos 205-225 euros al mes; el tramo medio (1.700-2.030 euros netos, donde se concentran muchos freelancers) ronda los 360-380 euros; y los tramos altos (más de 6.000 euros mensuales) llegan hasta los 607 euros. Si en lugar de la base mínima eliges la base máxima de tu tramo, la cuota puede dispararse hasta unos 1.275 euros mensuales en los tramos medios-altos y hasta **1.607 euros mensuales** en el tramo más elevado."],
    [/Sobre esa base se aplica el 31,4% \(autónomos personales\) o el 32,4% \(societarios\) para obtener la cuota a pagar\./,
     "Sobre esa base se aplica un tipo conjunto del **31,5%** (cubre contingencias comunes, profesionales, cese de actividad, formación y la aportación al MEI) para obtener la cuota a pagar."],
    [/Un freelancer que factura 4\.000 euros netos al mes con cuota de 380 euros, paga unos 4\.560 euros anuales solo de RETA/,
     "Un freelancer que factura 4.000 euros netos al mes y elige la base mínima paga del orden de 504 euros mensuales (unos 6.050 euros anuales solo de RETA); si subiera a la base máxima de su tramo la cuota anual rondaría los 15.300 euros"],
    [/cuota se acerca a los 600 euros/, "cuota mínima se acerca a los 607 euros (y la máxima del tramo a los 1.607 euros)"],
  ],
  ca: [
    [/La quota mensual va des de poc més de 200 euros per als rendiments nets més baixos fins a prop de 600 euros per als superiors als 6\.000 euros mensuals\./,
     "La quota mensual va des d'uns 205 euros per als rendiments nets més baixos fins a prop de 1.607 euros mensuals si tries la base màxima del tram més alt. Sobre la base mínima de cada tram els imports són notablement menors: fins a uns 607 euros mensuals per a rendiments superiors a 6.000 euros."],
    [/Actualment, els trams més baixos \(fins a 670 euros nets\) cotitzen uns 200-225 euros al mes; el tram mitjà \(1\.700-1\.850 euros nets, on es concentren molts freelancers\) ronda els 295-310 euros; i els trams alts \(més de 6\.000 euros mensuals\) arriben fins als 590-610 euros\./,
     "Sobre la base mínima de cada tram, els més baixos (fins a 670 euros nets) cotitzen uns 205-225 euros al mes; el tram mitjà (1.700-2.030 euros nets, on es concentren molts freelancers) ronda els 360-380 euros; i els trams alts (més de 6.000 euros mensuals) arriben fins als 607 euros. Si en lloc de la base mínima tries la base màxima del teu tram, la quota pot disparar-se fins a uns 1.275 euros mensuals en els trams mitjans-alts i fins a **1.607 euros mensuals** al tram més elevat."],
    [/Sobre aquesta base s'aplica el 31,4% \(autònoms personals\) o el 32,4% \(societaris\) per obtenir la quota a pagar\./,
     "Sobre aquesta base s'aplica un tipus conjunt del **31,5%** (cobreix contingències comunes, professionals, cessament d'activitat, formació i l'aportació al MEI) per obtenir la quota a pagar."],
  ],
  pt: [
    [/A cota mensal varia de pouco mais de 200 euros para os rendimentos líquidos mais baixos até cerca de 600 euros para os superiores a 6\.000 euros mensais\./,
     "A cota mensal varia desde cerca de 205 euros para os rendimentos líquidos mais baixos até perto de 1.607 euros mensais se for escolhida a base máxima do escalão mais alto. Sobre a base mínima de cada escalão os valores são bastante menores: até cerca de 607 euros mensais para rendimentos acima dos 6.000 euros."],
    [/Atualmente, os escalões mais baixos \(até 670 euros líquidos\) cotizam cerca de 200-225 euros por mês; o escalão médio \(1\.700-1\.850 euros líquidos, onde se concentram muitos freelancers\) ronda os 295-310 euros; e os escalões altos \(mais de 6\.000 euros mensais\) chegam aos 590-610 euros\./,
     "Sobre a base mínima de cada escalão, os mais baixos (até 670 euros líquidos) cotizam cerca de 205-225 euros por mês; o escalão médio (1.700-2.030 euros líquidos, onde se concentram muitos freelancers) ronda os 360-380 euros; e os escalões altos (mais de 6.000 euros mensais) chegam aos 607 euros. Se em vez da base mínima escolher a base máxima do seu escalão, a cota pode subir até cerca de 1.275 euros mensais nos escalões médios-altos e até **1.607 euros mensais** no escalão mais elevado."],
  ],
  de: [
    [/Der monatliche Beitrag reicht von knapp über 200 Euro für die niedrigsten Nettoerträge bis zu rund 600 Euro für Erträge über 6\.000 Euro monatlich\./,
     "Der monatliche Beitrag reicht von rund 205 Euro für die niedrigsten Nettoerträge bis zu rund 1.607 Euro im Monat, wenn die Höchstbemessungsgrundlage der obersten Stufe gewählt wird. Auf der Mindestbemessungsgrundlage jeder Stufe liegen die Beträge deutlich niedriger: bis zu etwa 607 Euro monatlich für Erträge oberhalb von 6.000 Euro."],
    [/Aktuell zahlen die niedrigsten Stufen \(bis 670 Euro netto\) etwa 200-225 Euro monatlich; die mittlere Stufe \(1\.700-1\.850 Euro netto, in der sich viele Freelancer befinden\) liegt bei 295-310 Euro; die oberen Stufen \(mehr als 6\.000 Euro monatlich\) erreichen 590-610 Euro\./,
     "Auf der Mindestbemessungsgrundlage jeder Stufe zahlen die niedrigsten Stufen (bis 670 Euro netto) etwa 205-225 Euro monatlich; die mittlere Stufe (1.700-2.030 Euro netto, in der sich viele Freelancer befinden) liegt bei 360-380 Euro; die oberen Stufen (mehr als 6.000 Euro monatlich) erreichen 607 Euro. Wer statt der Mindest- die Höchstbemessungsgrundlage seiner Stufe wählt, kann auf bis zu rund 1.275 Euro im mittleren-oberen Bereich und bis zu **1.607 Euro monatlich** in der höchsten Stufe kommen."],
  ],
  en: [
    [/The monthly fee ranges from just over 200 euros for the lowest net returns to around 600 euros for those above 6,000 euros per month\./,
     "The monthly fee ranges from about 205 euros for the lowest net returns up to around 1,607 euros per month if you elect the maximum contribution base of the top bracket. On the minimum base of each bracket the amounts are notably lower: up to about 607 euros per month for returns above 6,000 euros."],
    [/Currently, the lowest brackets \(up to 670 net euros\) contribute around 200-225 euros per month; the middle bracket \(1,700-1,850 net euros, where many freelancers concentrate\) is around 295-310 euros; and high brackets \(more than 6,000 euros monthly\) reach 590-610 euros\./,
     "On the minimum base of each bracket, the lowest brackets (up to 670 net euros) contribute around 205-225 euros per month; the middle bracket (1,700-2,030 net euros, where many freelancers concentrate) is around 360-380 euros; and high brackets (more than 6,000 euros monthly) reach 607 euros. If instead of the minimum base you elect the maximum base of your bracket, the fee can climb to about 1,275 euros per month in the upper-middle brackets and to **1,607 euros per month** in the top bracket."],
  ],
  fr: [
    [/La cotisation mensuelle va d'un peu plus de 200 euros pour les revenus nets les plus bas jusqu'à près de 600 euros pour ceux supérieurs à 6 000 euros par mois\./,
     "La cotisation mensuelle va d'environ 205 euros pour les revenus nets les plus bas jusqu'à environ 1 607 euros par mois si vous choisissez la base maximale de la tranche supérieure. Sur la base minimale de chaque tranche, les montants sont nettement inférieurs : jusqu'à environ 607 euros par mois pour des revenus supérieurs à 6 000 euros."],
    [/Actuellement, les tranches les plus basses \(jusqu'à 670 euros nets\) cotisent environ 200-225 euros par mois ; la tranche moyenne \(1 700-1 850 euros nets, où se concentrent de nombreux freelances\) tourne autour de 295-310 euros ; et les tranches hautes \(plus de 6 000 euros par mois\) atteignent 590-610 euros\./,
     "Sur la base minimale de chaque tranche, les tranches les plus basses (jusqu'à 670 euros nets) cotisent environ 205-225 euros par mois ; la tranche moyenne (1 700-2 030 euros nets, où se concentrent de nombreux freelances) tourne autour de 360-380 euros ; et les tranches hautes (plus de 6 000 euros par mois) atteignent 607 euros. Si vous choisissez la base maximale de votre tranche au lieu de la base minimale, la cotisation peut grimper à environ 1 275 euros par mois dans les tranches moyennes-hautes et atteindre **1 607 euros par mois** dans la tranche la plus élevée."],
  ],
};

// ---------------------------------------------------------------------------
// 3. Apply.
// ---------------------------------------------------------------------------
const changedFiles = new Set();
const changedSlugs = new Set();

function rewrite(filePath, transforms) {
  const before = readFileSync(filePath, "utf8");
  let after = before;
  for (const [rx, rep] of transforms) after = after.replace(rx, rep);
  if (after !== before) {
    writeFileSync(filePath, after);
    changedFiles.add(filePath);
    return true;
  }
  return false;
}

import { readdirSync } from "node:fs";

for (const lang of LANGS) {
  for (const fname of readdirSync(resolve(CONTENT, lang))) {
    if (!fname.endsWith(".ts")) continue;
    const slug = fname.replace(/\.ts$/, "");
    const fp = resolve(CONTENT, lang, fname);
    const transforms = [...GENERIC];
    if (slug === "cuota-autonomo-2026" && CUOTA_REPLACEMENTS[lang]) {
      transforms.push(...CUOTA_REPLACEMENTS[lang]);
    }
    if (rewrite(fp, transforms)) changedSlugs.add(slug);
  }
}

// ---------------------------------------------------------------------------
// 4. Bump updatedAt for affected post entries in blog-posts.ts.
// ---------------------------------------------------------------------------
let postsTxt = readFileSync(POSTS, "utf8");
const before = postsTxt;
for (const slug of changedSlugs) {
  const slugRx = new RegExp(
    `(slug:\\s*"${slug.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}"[^}]*?updatedAt:\\s*")[^"]+(")`,
    "s",
  );
  postsTxt = postsTxt.replace(slugRx, `$1${TODAY}$2`);
}
if (postsTxt !== before) writeFileSync(POSTS, postsTxt);

console.log(`Updated ${changedFiles.size} content files across ${changedSlugs.size} slugs.`);
console.log("Slugs touched:", [...changedSlugs].sort().join(", "));
