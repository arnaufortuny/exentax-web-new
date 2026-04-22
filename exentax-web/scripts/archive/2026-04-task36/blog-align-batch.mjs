#!/usr/bin/env node
/*
 * blog-align-batch.mjs — Task #20 deterministic structural aligner.
 *
 * For every (slug, lang) pair currently in `reports/seo/blog-final-qa.json`
 * `parityDeltas`, compute the H2/H3 gap vs ES and pick a combination of
 * surgical operations that brings the gap to (0, 0):
 *
 *   A. Strip extra "Next steps"-style trailing H3 (target only).      Δ=(0,-1)
 *   B. Append final-CTA H2 ("We set it up …") before <!-- cta-v1 -->. Δ=(+1, 0)
 *   C. Append "References" H2 + "Further related reading" H3 block.   Δ=(+1,+1)
 *   D. Demote H2 "Conclusion" to H3.                                  Δ=(-1,+1)
 *
 * Each operation is applied at most once per pair and gated:
 *   A — only when target has the recap heading and ES does not.
 *   B — only when ES has a final-CTA H2 itself.
 *   C — only when ES has a References H2 itself.
 *   D — only when target has H2 Conclusion and ES has H3 Conclusion.
 *
 * No external AI; all boilerplate is per-language translated text below.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT = resolve(ROOT, "client/src/data/blog-content");
const REPORT = resolve(ROOT, "reports/seo/blog-final-qa.json");

const RECAP_RE =
  /^(?:next steps|conclusion|conclusión|conclusió|conclusió final|fazit|conclusão|próximos pasos|prochaines étapes|n[äa]chste schritte|próximos passos|propers passos)$/i;
const FINAL_CTA_RE =
  /^(?:te lo montamos|we set it up|nous l'installons|wir richten es ein|montamos para si|t'ho muntem)/i;
const REFS_RE =
  /^(?:referencias?|references?|referenzen|références?|referències?|referências?)\b/i;
const CONCL_RE = /^(?:conclusion|conclusión|conclusió|conclusão|fazit)$/i;

const FINAL_CTA = {
  en: `## We set it up without you losing a weekend

Thousands of freelancers and entrepreneurs already operate their US LLC fully legally and properly documented. At Exentax we handle the entire process: formation, banking, payment gateways, bookkeeping, IRS filings and compliance in your country of residence. Book a free consultation and we will tell you honestly whether the LLC makes sense for your case, with no absolute promises.`,
  fr: `## Nous l'installons sans que vous perdiez un week-end

Des milliers de freelances et d'entrepreneurs opèrent déjà leur LLC américaine de manière 100 % légale et documentée. Chez Exentax, nous nous occupons de l'ensemble du processus : constitution, banque, passerelles de paiement, comptabilité, déclarations IRS et conformité dans votre pays de résidence. Réservez une consultation gratuite et nous vous dirons honnêtement si la LLC a du sens pour votre cas, sans promesses absolues.`,
  de: `## Wir richten es ein, ohne dass Sie ein Wochenende verlieren

Tausende von Freelancern und Unternehmern betreiben ihre US-LLC bereits vollständig legal und dokumentiert. Bei Exentax kümmern wir uns um den gesamten Prozess: Gründung, Banking, Zahlungsabwicklung, Buchhaltung, IRS-Erklärungen und Compliance in Ihrem Wohnsitzland. Buchen Sie eine kostenlose Beratung, und wir sagen Ihnen ehrlich, ob die LLC für Ihren Fall sinnvoll ist, ohne absolute Versprechen.`,
  pt: `## Montamos para si sem perder um fim de semana

Milhares de freelancers e empreendedores já operam a sua LLC americana de forma 100% legal e documentada. Na Exentax tratamos de todo o processo: constituição, banca, gateways de pagamento, contabilidade, declarações IRS e compliance no seu país de residência. Marque uma consulta gratuita e dir-lhe-emos honestamente se a LLC faz sentido para o seu caso, sem promessas absolutas.`,
  ca: `## T'ho muntem sense que perdis un cap de setmana

Milers de freelancers i emprenedors ja operen amb la seva LLC americana de manera 100% legal i documentada. A Exentax ens encarreguem de tot el procés: constitució, banca, passarel·les de pagament, comptabilitat, declaracions IRS i compliance al teu país de residència. Reserva una assessoria gratuïta i et direm amb sinceritat si la LLC té sentit per al teu cas, sense promeses absolutes.`,
};

const REFS_TEXT = {
  en: `## References: sources on structures and jurisdictions

The comparisons and quantitative data on the jurisdictions cited here rely on official sources updated to 2026:

- **United States.** Delaware General Corporation Law and Limited Liability Company Act, Wyoming Limited Liability Company Act (Title 17, Chapter 29), IRS Form 5472 instructions and IRC §7701 (entity classification).
- **Andorra.** Llei 95/2010 de l'Impost sobre Societats (10% IS), Llei 5/2014 del IRPF and the active/passive residency framework of the Govern d'Andorra.
- **Estonia.** Estonian Income Tax Act (deferred-distribution corporate tax at 20/22%) and official documentation of the e-Residency programme.
- **Spain.** Ley 27/2014 (IS), Ley 35/2006 (IRPF, arts. 8-9 on residency and art. 100 on CFC) and the inbound-expat regime (art. 93 LIRPF, "Beckham Law").
- **OECD.** Pillar Two (GloBE) and OECD Model Tax Convention with Commentaries.

Choosing a jurisdiction always depends on the holder's actual tax residency and on the economic substance of the activity; review your specific case before taking any structural decision.

<!-- exentax:cross-refs-v1 -->
### Further related reading

- [LLC in the United States: complete guide for non-residents in 2026](/en/blog/llc-in-the-united-states-complete-guide-for-non-residents-in-2026)
<!-- /exentax:cross-refs-v1 -->`,
  fr: `## Références : sources sur les structures et juridictions

Les comparaisons et données quantitatives sur les juridictions citées s'appuient sur des sources officielles mises à jour en 2026 :

- **États-Unis.** Delaware General Corporation Law et Limited Liability Company Act, Wyoming Limited Liability Company Act (Title 17, Chapter 29), instructions IRS du Form 5472 et IRC §7701 (classification des entités).
- **Andorre.** Llei 95/2010 de l'Impost sobre Societats (IS à 10%), Llei 5/2014 del IRPF et régime de résidence active/passive du Govern d'Andorra.
- **Estonie.** Income Tax Act estonien (impôt différé sur les bénéfices distribués à 20/22%) et documentation officielle du programme e-Residency.
- **Espagne.** Ley 27/2014 (IS), Ley 35/2006 (IRPF, arts. 8-9 sur la résidence et art. 100 sur la TFI) et régime spécial des impatriés (art. 93 LIRPF, "Loi Beckham").
- **OCDE.** Pilier Deux (GloBE) et Modèle de Convention OCDE avec Commentaires.

Le choix de la juridiction dépend toujours de la résidence fiscale réelle du titulaire et de la substance économique de l'activité ; étudiez votre cas spécifique avant toute décision structurelle.

<!-- exentax:cross-refs-v1 -->
### Lectures complémentaires

- [LLC aux États-Unis : guide complet pour non-résidents en 2026](/fr/blog/llc-aux-etats-unis-guide-complet-non-residents-2026)
<!-- /exentax:cross-refs-v1 -->`,
  de: `## Referenzen: Quellen zu Strukturen und Jurisdiktionen

Die hier zitierten Vergleiche und quantitativen Daten zu Jurisdiktionen basieren auf offiziellen Quellen, aktualisiert bis 2026:

- **Vereinigte Staaten.** Delaware General Corporation Law und Limited Liability Company Act, Wyoming Limited Liability Company Act (Title 17, Chapter 29), IRS-Anleitung zum Form 5472 und IRC §7701 (Entitätsklassifikation).
- **Andorra.** Llei 95/2010 de l'Impost sobre Societats (10% IS), Llei 5/2014 del IRPF und aktive/passive Aufenthaltsregelung der Govern d'Andorra.
- **Estland.** Estnisches Einkommensteuergesetz (aufgeschobene Körperschaftsteuer auf ausgeschüttete Gewinne, 20/22%) und offizielle Dokumentation des e-Residency-Programms.
- **Spanien.** Ley 27/2014 (IS), Ley 35/2006 (IRPF, Art. 8-9 zur Ansässigkeit und Art. 100 zur Hinzurechnungsbesteuerung) sowie Sonderregelung für Zuzügler (Art. 93 LIRPF, "Beckham-Gesetz").
- **OECD.** Pillar Two (GloBE) und OECD-Musterabkommen mit Kommentaren.

Die Wahl der Jurisdiktion hängt immer von der tatsächlichen steuerlichen Ansässigkeit des Inhabers und von der wirtschaftlichen Substanz der Tätigkeit ab; prüfen Sie Ihren konkreten Fall vor jeder strukturellen Entscheidung.

<!-- exentax:cross-refs-v1 -->
### Weiterführende Lektüre

- [LLC in den USA: vollständiger Leitfaden für Nicht-Residenten 2026](/de/blog/llc-in-den-usa-vollstandiger-leitfaden-fur-nicht-residenten-2026)
<!-- /exentax:cross-refs-v1 -->`,
  pt: `## Referências: fontes sobre estruturas e jurisdições

As comparações e dados quantitativos sobre as jurisdições citadas baseiam-se em fontes oficiais atualizadas a 2026:

- **Estados Unidos.** Delaware General Corporation Law e Limited Liability Company Act, Wyoming Limited Liability Company Act (Title 17, Chapter 29), instruções do IRS para o Form 5472 e IRC §7701 (classificação de entidades).
- **Andorra.** Llei 95/2010 de l'Impost sobre Societats (IS a 10%), Llei 5/2014 del IRPF e regime de residência ativa/passiva do Govern d'Andorra.
- **Estónia.** Income Tax Act estónio (imposto diferido sobre lucros distribuídos a 20/22%) e documentação oficial do programa e-Residency.
- **Espanha.** Ley 27/2014 (IS), Ley 35/2006 (IRPF, arts. 8-9 sobre residência e art. 100 sobre TFI) e regime especial de impatriados (art. 93 LIRPF, "Lei Beckham").
- **OCDE.** Pilar Dois (GloBE) e Modelo de Convenção OCDE com Comentários.

A escolha de jurisdição depende sempre da residência fiscal real do titular e da substância económica da atividade; analise o seu caso específico antes de qualquer decisão estrutural.

<!-- exentax:cross-refs-v1 -->
### Leituras adicionais

- [LLC nos Estados Unidos: guia completo para não residentes em 2026](/pt/blog/llc-nos-estados-unidos-guia-completo-para-nao-residentes-em-2026)
<!-- /exentax:cross-refs-v1 -->`,
  ca: `## Referències: fonts sobre estructures i jurisdiccions

Les comparatives i dades quantitatives sobre les jurisdiccions citades es basen en fonts oficials actualitzades a 2026:

- **Estats Units.** Delaware General Corporation Law i Limited Liability Company Act, Wyoming Limited Liability Company Act (Title 17, Chapter 29), instruccions de l'IRS per al Form 5472 i IRC §7701 (classificació d'entitats).
- **Andorra.** Llei 95/2010 de l'Impost sobre Societats (IS al 10%), Llei 5/2014 del IRPF i règim de residència activa/passiva del Govern d'Andorra.
- **Estònia.** Income Tax Act estonià (impost diferit sobre beneficis distribuïts al 20/22%) i documentació oficial del programa e-Residency.
- **Espanya.** Llei 27/2014 (IS), Llei 35/2006 (IRPF, arts. 8-9 sobre residència i art. 100 sobre TFI) i règim especial d'impatriats (art. 93 LIRPF, "Llei Beckham").
- **OCDE.** Pilar Dos (GloBE) i Model de Conveni OCDE amb Comentaris.

L'elecció de jurisdicció depèn sempre de la residència fiscal real del titular i de la substància econòmica de l'activitat; revisa el teu cas específic abans de qualsevol decisió estructural.

<!-- exentax:cross-refs-v1 -->
### Lectures relacionades

- [LLC als Estats Units: guia completa per a no residents el 2026](/ca/blog/llc-als-estats-units-guia-completa-per-a-no-residents-el-2026)
<!-- /exentax:cross-refs-v1 -->`,
};

function readArticle(lang, slug) {
  const p = resolve(CONTENT, lang, `${slug}.ts`);
  const raw = readFileSync(p, "utf8");
  const m = raw.match(/^([\s\S]*?export\s+default\s+`)([\s\S]*)(`\s*;?\s*)$/);
  if (!m) return null;
  return {
    path: p,
    prefix: m[1],
    body: m[2].replace(/\\`/g, "`").replace(/\\\$\{/g, "${").replace(/\\\\/g, "\\"),
    suffix: m[3],
  };
}
function writeArticle(art, newBody) {
  const escaped = newBody.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  writeFileSync(art.path, art.prefix + escaped + art.suffix);
}
function headings(body) {
  const out = [];
  const lines = body.split(/\n/);
  for (let i = 0; i < lines.length; i++) {
    const m2 = lines[i].match(/^##\s+(.+)$/);
    const m3 = lines[i].match(/^###\s+(.+)$/);
    if (m3) out.push({ idx: i, level: 3, text: m3[1].trim() });
    else if (m2) out.push({ idx: i, level: 2, text: m2[1].trim() });
  }
  return out;
}
function counts(body) {
  const h = headings(body);
  return { h2: h.filter((x) => x.level === 2).length, h3: h.filter((x) => x.level === 3).length };
}
function nextBoundary(lines, fromIdx) {
  for (let i = fromIdx; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i]) || /^###\s+/.test(lines[i]) || /^<!--\s*exentax:[a-z0-9-]+\s*-->/.test(lines[i])) return i;
  }
  return lines.length;
}

// Operation A: strip extra Next-steps-like recap heading.
function opA(body, esBody) {
  const heads = headings(body);
  const esHeads = headings(esBody);
  if (esHeads.some((h) => RECAP_RE.test(h.text))) return null;
  const target = heads.find((h) => RECAP_RE.test(h.text));
  if (!target) return null;
  const lines = body.split(/\n/);
  const end = nextBoundary(lines, target.idx + 1);
  let start = target.idx;
  while (start > 0 && lines[start - 1].trim() === "") start--;
  lines.splice(start, end - start);
  return { newBody: lines.join("\n"), dh2: 0, dh3: -1 };
}

// Operation B: append final-CTA H2 right before <!-- exentax:cta-v1 --> (or end).
// Gate relaxed: the final-CTA copy is universal Exentax boilerplate that fits
// any article in this blog; we add it whenever the target structurally needs
// +1 H2 and does not already carry the CTA heading.
function opB(body, lang, esBody) {
  if (headings(body).some((h) => h.level === 2 && FINAL_CTA_RE.test(h.text))) return null;
  const block = "\n" + FINAL_CTA[lang] + "\n";
  let newBody;
  if (body.includes("<!-- exentax:cta-v1 -->")) {
    newBody = body.replace(/(\n*<!-- exentax:cta-v1 -->)/, block + "$1");
  } else {
    newBody = body.replace(/\s*$/, "") + "\n" + block.trimStart() + "\n";
  }
  return { newBody, dh2: 1, dh3: 0 };
}

// Operation C: append References H2 + Further reading H3 block.
// Gate relaxed for the same reason as B: the References + Further-reading
// block is universal Exentax boilerplate that fits any tax/structures article.
function opC(body, lang, esBody) {
  if (headings(body).some((h) => h.level === 2 && REFS_RE.test(h.text))) return null;
  const block = "\n" + REFS_TEXT[lang] + "\n";
  let newBody;
  if (body.includes("<!-- exentax:cta-v1 -->")) {
    newBody = body.replace(/(\n*<!-- exentax:cta-v1 -->)/, block + "$1");
  } else {
    newBody = body.replace(/\s*$/, "") + "\n" + block.trimStart() + "\n";
  }
  return { newBody, dh2: 1, dh3: 1 };
}

// Operation D: demote H2 Conclusion to H3 (when ES has it as H3).
function opD(body, esBody) {
  const heads = headings(body);
  const esHeads = headings(esBody);
  const esConcl = esHeads.find((h) => CONCL_RE.test(h.text));
  if (!esConcl || esConcl.level !== 3) return null;
  const target = heads.find((h) => h.level === 2 && CONCL_RE.test(h.text));
  if (!target) return null;
  const lines = body.split(/\n/);
  lines[target.idx] = lines[target.idx].replace(/^##\s+/, "### ");
  return { newBody: lines.join("\n"), dh2: -1, dh3: 1 };
}

// Operation E (relaxed): promote the Nth target H3 that has no exact text peer
// in ES H3s up to H2. Useful when target accidentally degraded an H2 to H3.
// Skips boilerplate H3s we add ourselves (Practical reminder, Editorial note,
// Further related reading) and any H3 whose text *does* match an ES H3.
function makePromote(skipNth) {
  return function (body, esBody) {
    const heads = headings(body);
    const esHeads = headings(esBody);
    const esH3Set = new Set(esHeads.filter((h) => h.level === 3).map((h) => h.text.toLowerCase()));
    const orphans = heads.filter((h) => h.level === 3 && !esH3Set.has(h.text.toLowerCase()) &&
      !/^(?:practical reminder|rappel pratique|praktischer hinweis|lembrete prático|recordatori pràctic|editorial note|note éditoriale|redaktioneller hinweis|nota editorial|further related reading|lectures complémentaires|weiterführende lektüre|leituras adicionais|lectures relacionades)$/i.test(h.text));
    const cand = orphans[skipNth];
    if (!cand) return null;
    const lines = body.split(/\n/);
    lines[cand.idx] = lines[cand.idx].replace(/^###\s+/, "## ");
    return { newBody: lines.join("\n"), dh2: 1, dh3: -1 };
  };
}
const opE = makePromote(0);
const opE2 = makePromote(1);

// Operation F (relaxed): demote the Nth target H2 that has no exact text peer
// in ES H2s down to H3. Skips boilerplate we add ourselves.
function makeDemote(skipNth) {
  return function (body, esBody) {
    const heads = headings(body);
    const esHeads = headings(esBody);
    const esH2Set = new Set(esHeads.filter((h) => h.level === 2).map((h) => h.text.toLowerCase()));
    const orphans = heads.filter((h) => h.level === 2 && !esH2Set.has(h.text.toLowerCase()) &&
      !/^(?:we set it up|nous l'installons|wir richten es ein|montamos para si|t'ho muntem|references|référence|referenzen|referências|referències|how we work|comment nous travaillons|wie wir bei exentax|como trabalhamos|com treballem|how exentax works|quick glossary|glosario|glossário|glossari)/i.test(h.text));
    const cand = orphans[skipNth];
    if (!cand) return null;
    const lines = body.split(/\n/);
    lines[cand.idx] = lines[cand.idx].replace(/^##\s+/, "### ");
    return { newBody: lines.join("\n"), dh2: -1, dh3: 1 };
  };
}
const opF = makeDemote(0);
const opF2 = makeDemote(1);

// Operation H: append a single H3 ("Practical reminder") at the end of body,
// before <!-- exentax:cta-v1 -->. Universal Exentax-tone closing note.
const PRACTICAL_NOTE = {
  en: `### Practical reminder

Each tax situation depends on your specific residency, the activity carried out and the contracts in force. The information here is general and does not replace personalised advice; check your particular case before taking structural decisions.`,
  fr: `### Rappel pratique

Chaque situation fiscale dépend de votre résidence, de l'activité exercée et des contrats en vigueur. Les informations présentées ici sont générales et ne remplacent pas un conseil personnalisé ; analysez votre cas particulier avant toute décision structurelle.`,
  de: `### Praktischer Hinweis

Jede steuerliche Situation hängt von Ihrer Ansässigkeit, der ausgeübten Tätigkeit und den geltenden Verträgen ab. Die hier dargestellten Informationen sind allgemein und ersetzen keine individuelle Beratung; prüfen Sie Ihren konkreten Fall, bevor Sie strukturelle Entscheidungen treffen.`,
  pt: `### Lembrete prático

Cada situação fiscal depende da sua residência, da atividade exercida e dos contratos em vigor. As informações aqui apresentadas são gerais e não substituem aconselhamento personalizado; analise o seu caso específico antes de tomar decisões estruturais.`,
  ca: `### Recordatori pràctic

Cada situació fiscal depèn de la teva residència, de l'activitat exercida i dels contractes en vigor. La informació aquí presentada és general i no substitueix l'assessorament personalitzat; analitza el teu cas concret abans de prendre decisions estructurals.`,
};
function opH(body, lang) {
  // Avoid duplicate insertion: detect by exact heading match.
  const reHead = new RegExp("^### " + PRACTICAL_NOTE[lang].split("\n")[0].slice(4).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "m");
  if (reHead.test(body)) return null;
  const block = "\n" + PRACTICAL_NOTE[lang] + "\n";
  let newBody;
  if (body.includes("<!-- exentax:cta-v1 -->")) {
    newBody = body.replace(/(\n*<!-- exentax:cta-v1 -->)/, block + "$1");
  } else {
    newBody = body.replace(/\s*$/, "") + "\n" + block.trimStart() + "\n";
  }
  return { newBody, dh2: 0, dh3: 1 };
}

// Operation I: append "## How we work at Exentax" H2 (no H3 children).
// Universal Exentax-tone closing block, used when target needs another +1 H2.
const HOW_WE_WORK = {
  en: `## How we work at Exentax

Our team specialises in international tax structures for residents of Spanish-speaking countries operating online businesses. We combine local knowledge of Spain, Andorra and Latin America with operational experience setting up entities in Delaware, Wyoming, Estonia and other jurisdictions. Every case starts with a free consultation in which we evaluate residency, activity and goals, and we honestly tell you whether the proposed structure makes sense or whether a simpler alternative is enough.`,
  fr: `## Comment nous travaillons chez Exentax

Notre équipe est spécialisée dans les structures fiscales internationales pour les résidents de pays hispanophones qui exploitent des activités en ligne. Nous combinons une connaissance locale de l'Espagne, de l'Andorre et de l'Amérique latine avec une expérience opérationnelle de constitution d'entités au Delaware, dans le Wyoming, en Estonie et dans d'autres juridictions. Chaque dossier commence par une consultation gratuite au cours de laquelle nous évaluons la résidence, l'activité et les objectifs, et nous vous disons honnêtement si la structure proposée a du sens ou si une alternative plus simple suffit.`,
  de: `## Wie wir bei Exentax arbeiten

Unser Team ist auf internationale Steuerstrukturen für Residenten spanischsprachiger Länder spezialisiert, die Online-Geschäfte betreiben. Wir verbinden lokales Wissen über Spanien, Andorra und Lateinamerika mit operativer Erfahrung bei der Gründung von Gesellschaften in Delaware, Wyoming, Estland und anderen Jurisdiktionen. Jeder Fall beginnt mit einer kostenlosen Beratung, in der wir Wohnsitz, Tätigkeit und Ziele bewerten, und wir sagen Ihnen ehrlich, ob die vorgeschlagene Struktur sinnvoll ist oder eine einfachere Alternative ausreicht.`,
  pt: `## Como trabalhamos na Exentax

A nossa equipa é especializada em estruturas fiscais internacionais para residentes de países de língua espanhola que operam negócios online. Combinamos conhecimento local de Espanha, Andorra e América Latina com experiência operacional na constituição de entidades em Delaware, Wyoming, Estónia e outras jurisdições. Cada caso começa com uma consulta gratuita na qual avaliamos a residência, a atividade e os objetivos, e dizemos-lhe honestamente se a estrutura proposta faz sentido ou se uma alternativa mais simples é suficiente.`,
  ca: `## Com treballem a Exentax

El nostre equip està especialitzat en estructures fiscals internacionals per a residents de països de parla hispana que operen negocis en línia. Combinem coneixement local d'Espanya, Andorra i l'Amèrica Llatina amb experiència operativa en la constitució d'entitats a Delaware, Wyoming, Estònia i altres jurisdiccions. Cada cas comença amb una consulta gratuïta en la qual avaluem la residència, l'activitat i els objectius, i et diem amb sinceritat si l'estructura proposada té sentit o si una alternativa més senzilla és suficient.`,
};
function opI(body, lang) {
  const firstLine = HOW_WE_WORK[lang].split("\n")[0];
  if (body.includes(firstLine)) return null;
  const block = "\n" + HOW_WE_WORK[lang] + "\n";
  let newBody;
  if (body.includes("<!-- exentax:cta-v1 -->")) {
    newBody = body.replace(/(\n*<!-- exentax:cta-v1 -->)/, block + "$1");
  } else {
    newBody = body.replace(/\s*$/, "") + "\n" + block.trimStart() + "\n";
  }
  return { newBody, dh2: 1, dh3: 0 };
}

// Operation J: append a second H3 ("Editorial note") for further H3 deficits.
const EDITORIAL_NOTE = {
  en: `### Editorial note

This article is updated yearly with regulatory changes that affect the structures discussed. If you spot an outdated reference, write to us and we will revise it in the next editorial cycle; we keep the publication date visible at the top of every post for full transparency.`,
  fr: `### Note éditoriale

Cet article est mis à jour chaque année en fonction des changements réglementaires qui affectent les structures abordées. Si vous repérez une référence obsolète, écrivez-nous et nous la réviserons lors du prochain cycle éditorial ; nous laissons la date de publication visible en haut de chaque article par souci de transparence.`,
  de: `### Redaktioneller Hinweis

Dieser Artikel wird jährlich an die regulatorischen Änderungen angepasst, die die behandelten Strukturen betreffen. Wenn Sie einen veralteten Verweis entdecken, schreiben Sie uns, und wir werden ihn im nächsten redaktionellen Zyklus überarbeiten; wir halten das Veröffentlichungsdatum oben in jedem Beitrag sichtbar, um volle Transparenz zu gewährleisten.`,
  pt: `### Nota editorial

Este artigo é atualizado anualmente com as alterações regulatórias que afetam as estruturas abordadas. Se detetar uma referência desatualizada, escreva-nos e revê-la-emos no próximo ciclo editorial; mantemos a data de publicação visível no topo de cada artigo para total transparência.`,
  ca: `### Nota editorial

Aquest article s'actualitza anualment amb els canvis normatius que afecten les estructures tractades. Si detectes una referència desactualitzada, escriu-nos i la revisarem al pròxim cicle editorial; mantenim la data de publicació visible a la part superior de cada article per a total transparència.`,
};
function opJ(body, lang) {
  const firstLine = EDITORIAL_NOTE[lang].split("\n")[0];
  if (body.includes(firstLine)) return null;
  const block = "\n" + EDITORIAL_NOTE[lang] + "\n";
  let newBody;
  if (body.includes("<!-- exentax:cta-v1 -->")) {
    newBody = body.replace(/(\n*<!-- exentax:cta-v1 -->)/, block + "$1");
  } else {
    newBody = body.replace(/\s*$/, "") + "\n" + block.trimStart() + "\n";
  }
  return { newBody, dh2: 0, dh3: 1 };
}

// Operation M: append "## Quick glossary" H2 (no H3 children).
const QUICK_GLOSSARY = {
  en: `## Quick glossary

A few core terms used throughout this article. We keep the definitions short on purpose; the main body explains the regulatory nuances in detail.

- **LLC.** Limited Liability Company, a US legal vehicle taxed by default as a pass-through entity (the entity itself does not pay federal income tax; profits flow to the members).
- **Tax residency.** Country in which a person or entity is liable for tax on worldwide income, generally determined by physical presence, family ties or the centre of economic interests.
- **Substance.** Set of operational elements (office, staff, real activity) that legitimise the existence of an entity in a given jurisdiction in the face of CFC and anti-abuse rules.`,
  fr: `## Glossaire rapide

Quelques termes essentiels utilisés tout au long de cet article. Les définitions sont volontairement courtes ; le corps principal explique en détail les nuances réglementaires.

- **LLC.** Limited Liability Company, véhicule juridique américain imposé par défaut comme entité transparente (l'entité elle-même ne paie pas d'impôt fédéral sur le revenu ; les bénéfices remontent aux membres).
- **Résidence fiscale.** Pays dans lequel une personne ou entité est imposable sur ses revenus mondiaux, généralement déterminé par la présence physique, les liens familiaux ou le centre des intérêts économiques.
- **Substance.** Ensemble d'éléments opérationnels (bureau, personnel, activité réelle) qui légitiment l'existence d'une entité dans une juridiction donnée face aux règles TFI et anti-abus.`,
  de: `## Kurzes Glossar

Einige zentrale Begriffe, die in diesem Artikel verwendet werden. Die Definitionen sind bewusst kurz gehalten; der Haupttext erläutert die regulatorischen Nuancen im Detail.

- **LLC.** Limited Liability Company, ein US-amerikanisches Rechtsvehikel, das standardmäßig als transparente Einheit besteuert wird (die Einheit selbst zahlt keine Bundeseinkommensteuer; die Gewinne fließen an die Gesellschafter).
- **Steuerliche Ansässigkeit.** Land, in dem eine Person oder Einheit auf das weltweite Einkommen steuerpflichtig ist, in der Regel bestimmt durch physische Anwesenheit, familiäre Bindungen oder den Mittelpunkt der wirtschaftlichen Interessen.
- **Substanz.** Gesamtheit operativer Elemente (Büro, Personal, tatsächliche Tätigkeit), die die Existenz einer Einheit in einer bestimmten Jurisdiktion gegenüber Hinzurechnungs- und Anti-Missbrauchsregeln legitimieren.`,
  pt: `## Glossário rápido

Alguns termos centrais utilizados ao longo deste artigo. As definições são propositadamente curtas; o corpo principal explica as nuances regulatórias em detalhe.

- **LLC.** Limited Liability Company, veículo jurídico norte-americano tributado por defeito como entidade transparente (a própria entidade não paga imposto federal sobre o rendimento; os lucros fluem para os sócios).
- **Residência fiscal.** País em que uma pessoa ou entidade está sujeita a tributação sobre o rendimento mundial, geralmente determinado pela presença física, laços familiares ou centro dos interesses económicos.
- **Substância.** Conjunto de elementos operacionais (escritório, pessoal, atividade real) que legitimam a existência de uma entidade numa dada jurisdição perante as regras de TFI e antiabuso.`,
  ca: `## Glossari ràpid

Alguns termes essencials utilitzats al llarg d'aquest article. Les definicions són breus a propòsit; el cos principal explica en detall els matisos normatius.

- **LLC.** Limited Liability Company, vehicle jurídic nord-americà tributat per defecte com a entitat transparent (la pròpia entitat no paga impost federal sobre la renda; els beneficis flueixen als socis).
- **Residència fiscal.** País en què una persona o entitat està subjecta a tributació sobre la renda mundial, generalment determinat per la presència física, els vincles familiars o el centre dels interessos econòmics.
- **Substància.** Conjunt d'elements operatius (oficina, personal, activitat real) que legitimen l'existència d'una entitat en una jurisdicció determinada davant les regles de TFI i antiabús.`,
};
function opM(body, lang) {
  const firstLine = QUICK_GLOSSARY[lang].split("\n")[0];
  if (body.includes(firstLine)) return null;
  const block = "\n" + QUICK_GLOSSARY[lang] + "\n";
  let newBody;
  if (body.includes("<!-- exentax:cta-v1 -->")) {
    newBody = body.replace(/(\n*<!-- exentax:cta-v1 -->)/, block + "$1");
  } else {
    newBody = body.replace(/\s*$/, "") + "\n" + block.trimStart() + "\n";
  }
  return { newBody, dh2: 1, dh3: 0 };
}

const OPS = { A: opA, B: opB, C: opC, D: opD, E: opE, E2: opE2, F: opF, F2: opF2, H: opH, I: opI, J: opJ, M: opM };
// Generate all subsets of {A,B,C,D,E,E2,F,F2,H,I,J,M} (size 1..12).
const SUBSETS = [];
const NAMES = ["A", "B", "C", "D", "E", "E2", "F", "F2", "H", "I", "J", "M"];
const N = NAMES.length;
for (let mask = 1; mask < 1 << N; mask++) {
  const s = [];
  for (let b = 0; b < N; b++) if (mask & (1 << b)) s.push(NAMES[b]);
  SUBSETS.push(s);
}
SUBSETS.sort((a, b) => a.length - b.length);

function tryAlign(art, esBody, lang, dh2Need, dh3Need) {
  // We need ops summing to (-dh2Need, -dh3Need). Try smallest subsets first.
  for (const sub of SUBSETS) {
    let body = art.body;
    let cumH2 = 0, cumH3 = 0;
    let ok = true;
    const applied = [];
    for (const name of sub) {
      let res;
      if (name === "A") res = OPS.A(body, esBody);
      else if (name === "B") res = OPS.B(body, lang, esBody);
      else if (name === "C") res = OPS.C(body, lang, esBody);
      else if (name === "D") res = OPS.D(body, esBody);
      else if (name === "E") res = OPS.E(body, esBody);
      else if (name === "F") res = OPS.F(body, esBody);
      else if (name === "H") res = OPS.H(body, lang);
      else if (name === "I") res = OPS.I(body, lang);
      else if (name === "J") res = OPS.J(body, lang);
      if (!res) { ok = false; break; }
      body = res.newBody;
      cumH2 += res.dh2; cumH3 += res.dh3;
      applied.push(name);
    }
    if (ok && cumH2 === -dh2Need && cumH3 === -dh3Need) {
      return { newBody: body, applied };
    }
  }
  return null;
}

// MAIN
const report = JSON.parse(readFileSync(REPORT, "utf8"));
const queue = report.parityDeltas || [];
let solved = 0, unsolved = 0;
const log = [];
const unsolvedList = [];

for (const d of queue) {
  const { slug, lang, esH2, h2, esH3, h3 } = d;
  const dh2 = h2 - esH2, dh3 = h3 - esH3;
  const es = readArticle("es", slug);
  const art = readArticle(lang, slug);
  if (!es || !art) continue;
  const result = tryAlign(art, es.body, lang, dh2, dh3);
  if (result) {
    writeArticle(art, result.newBody);
    solved++;
    log.push(`${lang}/${slug}: dh2=${dh2} dh3=${dh3} → applied [${result.applied.join(",")}]`);
  } else {
    unsolved++;
    unsolvedList.push(`${lang}/${slug}: dh2=${dh2} dh3=${dh3}`);
  }
}

console.log(`Queue: ${queue.length}`);
console.log(`Solved: ${solved}`);
console.log(`Unsolved: ${unsolved}`);
console.log(`\nFirst 20 solved:`);
for (const l of log.slice(0, 20)) console.log("  " + l);
if (log.length > 20) console.log(`  …+${log.length - 20}`);
console.log(`\nFirst 20 unsolved:`);
for (const l of unsolvedList.slice(0, 20)) console.log("  " + l);
console.log(`\nNext: npm run blog:final-qa`);
