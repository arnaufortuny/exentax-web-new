#!/usr/bin/env node
/*
 * blog-inject-localized-cta.mjs
 * ----------------------------------------------------------------------------
 * Ensures every translated blog article (en/fr/de/pt/ca) ends with a localized
 * booking CTA paragraph that links to /<lang>/agendar — matching the ES master
 * convention added in Task #1.
 *
 * Behaviour
 * ---------
 *  - Skips files that already contain at least one href to /<lang>/agendar.
 *    These articles already have a contextual CTA and don't need a second one.
 *  - Otherwise appends a marker-wrapped closing paragraph just before the
 *    terminating backtick of the `export default \`…\`;` template literal.
 *  - Idempotent: re-running rewrites the block in place without duplicating it.
 *
 * Markers: <!-- exentax:cta-v1 --> … <!-- /exentax:cta-v1 -->
 *
 * Usage:
 *   node scripts/blog-inject-localized-cta.mjs
 *   node scripts/blog-inject-localized-cta.mjs --check   # report only
 * ----------------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../client/src/data/blog-content");
const CHECK = process.argv.includes("--check");

const CTA_BY_LANG = {
  en: 'Every case has nuances: your country of residence, the type of activity, where your clients are, whether you invest or trade, whether you sell to consumers or businesses. At Exentax we review your situation, design the LLC structure that fits you, and stand by you every year for the maintenance. <a href="/en/agendar">Book a consultation with our team</a> and we will start from your real numbers.',
  fr: 'Chaque cas a ses nuances : votre pays de résidence, le type d\'activité, où se trouvent vos clients, si vous investissez ou tradez, si vous vendez à des particuliers ou à des entreprises. Chez Exentax nous étudions votre situation, concevons la structure LLC qui vous correspond et vous accompagnons chaque année dans la maintenance. <a href="/fr/agendar">Réservez un rendez-vous avec notre équipe</a> et nous partirons de vos chiffres réels.',
  de: 'Jeder Fall hat seine Nuancen: Ihr Wohnsitzland, die Art der Tätigkeit, wo Ihre Kunden sitzen, ob Sie investieren oder traden, ob Sie an Verbraucher oder Unternehmen verkaufen. Bei Exentax prüfen wir Ihre Situation, entwerfen die passende LLC-Struktur und begleiten Sie jedes Jahr bei der Pflege. <a href="/de/agendar">Vereinbaren Sie ein Gespräch mit unserem Team</a> und wir starten mit Ihren echten Zahlen.',
  pt: 'Cada caso tem nuances: o seu país de residência, o tipo de atividade, onde estão os seus clientes, se faz investimento ou trading, se vende a particulares ou a empresas. Na Exentax analisamos a sua situação, desenhamos a estrutura LLC que lhe encaixa e acompanhamos todos os anos a manutenção. <a href="/pt/agendar">Agende uma consulta com a nossa equipa</a> e começamos pelos seus números reais.',
  ca: 'Cada cas té matisos: el teu país de residència, el tipus d\'activitat, on són els teus clients, si fas inversió o trading, si vens a particulars o a empreses. A Exentax revisem la teva situació, dissenyem l\'estructura LLC que t\'encaixa i t\'acompanyem cada any en el manteniment. <a href="/ca/agendar">Reserva una consulta amb el nostre equip</a> i comencem pels teus números reals.',
};

const MARKER_OPEN = "<!-- exentax:cta-v1 -->";
const MARKER_CLOSE = "<!-- /exentax:cta-v1 -->";
const MARKER_BLOCK_RE = /\n*<!-- exentax:cta-v1 -->[\s\S]*?<!-- \/exentax:cta-v1 -->\n*/;

function injectCta(src, lang) {
  const linkRe = new RegExp(`href=["']/${lang}/agendar["']`);
  const cleaned = src.replace(MARKER_BLOCK_RE, "\n");
  if (linkRe.test(cleaned.replace(MARKER_BLOCK_RE, ""))) {
    return cleaned === src ? null : cleaned;
  }
  const cta = CTA_BY_LANG[lang];
  if (!cta) return null;
  const block = `\n\n${MARKER_OPEN}\n${cta}\n${MARKER_CLOSE}\n`;
  const tail = /\n?`;\s*$/;
  if (!tail.test(cleaned)) {
    console.warn(`[skip] no closing template literal in ${lang} file`);
    return null;
  }
  const next = cleaned.replace(tail, `${block}\`;\n`);
  return next === src ? null : next;
}

let totalChanged = 0;
for (const lang of Object.keys(CTA_BY_LANG)) {
  const dir = resolve(ROOT, lang);
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
  let changed = 0;
  for (const f of files) {
    const path = resolve(dir, f);
    const src = readFileSync(path, "utf8");
    const next = injectCta(src, lang);
    if (next === null) continue;
    if (!CHECK) writeFileSync(path, next, "utf8");
    changed++;
  }
  totalChanged += changed;
  console.log(`[${lang}] ${changed}/${files.length} files ${CHECK ? "would change" : "updated"}`);
}

console.log(`\nTotal: ${totalChanged} file(s) ${CHECK ? "would change" : "updated"}.`);
if (CHECK && totalChanged > 0) process.exit(1);
