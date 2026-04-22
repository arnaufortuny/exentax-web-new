#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'client/src/data/blog-content';

const NEW = {
  es: `- **Wise** distribuye dos productos distintos: **Wise Personal** (cuenta personal) y **Wise Business** (cuenta para empresas, incluida tu LLC). Para una LLC se debe abrir **Wise Business**, no la personal. Matiz importante de CRS: una **Wise Business titularidad de una LLC estadounidense queda fuera del CRS** porque la titular es una entidad de EE. UU. y EE. UU. no es jurisdicción CRS; el lado USD opera vía Wise US Inc. (perímetro FATCA, no CRS). En cambio, una **Wise Personal abierta por un individuo residente fiscal en España** u otra jurisdicción CRS **sí genera reporte CRS** vía Wise Europe SA (Bélgica) sobre ese individuo. Si abres Wise para tu LLC, esa cuenta no te incluye en CRS por la LLC; si además mantienes una Wise Personal a tu nombre como residente en CRS, esa segunda sí reporta.`,
  en: `- **Wise** ships two clearly different products: **Wise Personal** and **Wise Business**. For an LLC you must open **Wise Business**, not the personal account. Important CRS nuance: a **Wise Business held by a US LLC sits outside CRS** because the account holder is a US entity and the US is not a CRS participant; the USD side operates via Wise US Inc. (FATCA perimeter, not CRS). In contrast, a **Wise Personal opened by an individual tax-resident in Spain** or another CRS jurisdiction **does trigger CRS reporting** via Wise Europe SA (Belgium) on that individual. Opening Wise for your LLC does not bring you into CRS through the LLC; a separate Wise Personal in your own name as a CRS-resident individual does report.`,
  fr: `- **Wise** propose deux produits distincts : **Wise Personal** et **Wise Business**. Pour une LLC, on doit ouvrir **Wise Business**, pas le compte personnel. Nuance CRS importante : un **Wise Business détenu par une LLC américaine reste hors CRS** car le titulaire est une entité US et les États-Unis ne sont pas dans le CRS ; le volet USD passe par Wise US Inc. (périmètre FATCA, pas CRS). En revanche, un **Wise Personal ouvert par une personne physique résidente fiscale en Espagne** ou autre juridiction CRS **déclenche bien une déclaration CRS** via Wise Europe SA (Belgique) sur cette personne. Ouvrir Wise pour votre LLC ne vous fait pas entrer dans le CRS via la LLC ; un Wise Personal séparé à votre nom de résident CRS, oui.`,
  de: `- **Wise** bietet zwei klar getrennte Produkte: **Wise Personal** und **Wise Business**. Für eine LLC ist **Wise Business** zu eröffnen, nicht das persönliche Konto. Wichtige CRS-Nuance: Ein **Wise Business im Namen einer US-LLC liegt außerhalb des CRS**, weil Kontoinhaberin eine US-Entität ist und die USA kein CRS-Teilnehmer sind; die USD-Seite läuft über Wise US Inc. (FATCA-Perimeter, nicht CRS). Dagegen löst ein **Wise Personal, eröffnet von einer in Spanien** oder einem anderen CRS-Land steuerlich ansässigen Person, sehr wohl eine **CRS-Meldung über Wise Europe SA (Belgien)** zu dieser Person aus. Wise für die LLC zu öffnen bringt Sie nicht über die LLC ins CRS; ein separates Wise Personal auf Ihren Namen als in einem CRS-Land Ansässiger schon.`,
  pt: `- **Wise** distribui dois produtos distintos: **Wise Personal** e **Wise Business**. Para uma LLC abre-se **Wise Business**, não o pessoal. Nuance importante de CRS: uma **Wise Business titularidade de uma LLC norte-americana fica fora do CRS** porque a titular é entidade dos EUA e os EUA não são jurisdição CRS; o lado USD passa por Wise US Inc. (perímetro FATCA, não CRS). Em contrapartida, uma **Wise Personal aberta por um indivíduo residente fiscal em Espanha** ou noutra jurisdição CRS **gera reporte CRS** via Wise Europe SA (Bélgica) sobre esse indivíduo. Abrir Wise para a LLC não inclui no CRS pela LLC; uma Wise Personal separada em seu nome como residente CRS, sim.`,
  ca: `- **Wise** distribueix dos productes diferents: **Wise Personal** i **Wise Business**. Per a una LLC s'ha d'obrir **Wise Business**, no la personal. Matís important de CRS: una **Wise Business titularitat d'una LLC dels EUA queda fora del CRS** perquè la titular és una entitat dels EUA i els EUA no són jurisdicció CRS; el costat USD opera via Wise US Inc. (perímetre FATCA, no CRS). En canvi, una **Wise Personal oberta per un individu resident fiscal a Espanya** o una altra jurisdicció CRS **sí genera reporte CRS** via Wise Europe SA (Bèlgica) sobre aquest individu. Obrir Wise per a la teva LLC no t'inclou al CRS per la LLC; una Wise Personal separada al teu nom com a resident en CRS, sí.`,
};

// Old patterns (the ones inserted by apply-banking-facts-2026.mjs) per locale
const OLD_PATTERNS = {
  es: /- \*\*Wise\*\* distribuye dos productos[^\n]*?Wise Business sí está dentro de CRS[^\n]*?\./,
  en: /- \*\*Wise\*\* ships two clearly different products[^\n]*?Wise Business is in scope for CRS[^\n]*?\./,
  fr: /- \*\*Wise\*\* propose deux produits distincts[^\n]*?Wise Business est dans le périmètre CRS[^\n]*?\./,
  de: /- \*\*Wise\*\* bietet zwei klar getrennte Produkte[^\n]*?Wise Business fällt unter CRS[^\n]*?\./,
  pt: /- \*\*Wise\*\* distribui dois produtos[^\n]*?Wise Business está dentro do CRS[^\n]*?\./,
  ca: /- \*\*Wise\*\* distribueix dos productes[^\n]*?Wise Business sí està dins del CRS[^\n]*?\./,
};

let edited = 0;
for (const loc of Object.keys(NEW)) {
  const dir = path.join(ROOT, loc);
  if (!fs.existsSync(dir)) continue;
  for (const fn of fs.readdirSync(dir)) {
    if (!fn.endsWith('.ts')) continue;
    const fp = path.join(dir, fn);
    let s = fs.readFileSync(fp, 'utf8');
    const o = s;
    s = s.replace(OLD_PATTERNS[loc], NEW[loc]);
    if (s !== o) { fs.writeFileSync(fp, s); edited++; }
  }
}

console.log(JSON.stringify({ files_with_wise_paragraph_rewritten: edited }, null, 2));

// Validation
const violations = [];
const offending = {
  es: /Wise Business sí está dentro de CRS/,
  en: /Wise Business is in scope for CRS/,
  fr: /Wise Business est dans le périmètre CRS/,
  de: /Wise Business fällt unter CRS/,
  pt: /Wise Business está dentro do CRS/,
  ca: /Wise Business sí està dins del CRS/,
};
for (const loc of Object.keys(offending)) {
  const dir = path.join(ROOT, loc);
  for (const fn of fs.readdirSync(dir)) {
    const s = fs.readFileSync(path.join(dir, fn), 'utf8');
    if (offending[loc].test(s)) violations.push(`${loc}/${fn}`);
  }
}
if (violations.length) { console.error('LEFTOVER pre-correction Wise CRS phrasings:', violations.slice(0, 10)); process.exit(1); }
console.log('VALIDATION PASSED.');
