#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'client/src/data/blog-content';
const LOCALES = ['es','en','fr','de','pt','ca'];

const REPLACEMENTS = [
  // Slash partner bank: per SOT (banking-facts-2026.md §Slash) the
  // federally chartered partner is Column N.A., not Stearns Bank.
  [/respaldada por Stearns Bank N\.A\., FDIC/g, 'respaldada por Column N.A. (banco federalmente registrado, con cobertura FDIC)'],
  [/backed by Stearns Bank N\.A\., FDIC/g,      'backed by Column N.A. (federally chartered, FDIC)'],
  [/adossé à Stearns Bank N\.A\., FDIC/g,        'adossé à Column N.A. (établissement à charte fédérale, FDIC)'],
  [/gehalten bei Stearns Bank N\.A\., FDIC/g,    'gehalten bei Column N.A. (bundesweit konzessionierte Bank, FDIC)'],
  [/suportada pela Stearns Bank N\.A\., FDIC/g,  'suportada pela Column N.A. (banco com licença federal, FDIC)'],
  [/recolzada per Stearns Bank N\.A\., FDIC/g,   'recolzada per Column N.A. (banc amb llicència federal, FDIC)'],
  // Mixed mention "Column N.A. and/or Stearns Bank" → drop Stearns
  [/Column N\.A\. and\/or Stearns Bank, FDIC/g,  'Column N.A. (federally chartered, FDIC)'],
  [/Column N\.A\. y\/o Stearns Bank, FDIC/g,     'Column N.A. (banco federal, FDIC)'],
  [/Column N\.A\. ou Stearns Bank, FDIC/g,       'Column N.A. (à charte fédérale, FDIC)'],
];

let edited = 0, replacements = 0;
for (const loc of LOCALES) {
  const dir = path.join(ROOT, loc);
  if (!fs.existsSync(dir)) continue;
  for (const fn of fs.readdirSync(dir)) {
    if (!fn.endsWith('.ts')) continue;
    const fp = path.join(dir, fn);
    let s = fs.readFileSync(fp, 'utf8');
    const o = s;
    for (const [pat, rep] of REPLACEMENTS) {
      const before = s;
      s = s.replace(pat, rep);
      if (s !== before) replacements += (before.match(pat) || []).length;
    }
    if (s !== o) { fs.writeFileSync(fp, s); edited++; }
  }
}

// es/cuanto-cuesta-constituir-llc.ts: BOI table rows
const cuestaFp = path.join(ROOT, 'es', 'cuanto-cuesta-constituir-llc.ts');
if (fs.existsSync(cuestaFp)) {
  let s = fs.readFileSync(cuestaFp, 'utf8');
  const o = s;
  s = s.replace(/\| BOI Report \| Presentación obligatoria, incluida \|/g,
    '| BOI Report | Solo si la LLC entra en el ámbito vigente (foreign reporting companies tras la IFR de FinCEN de marzo de 2025); si aplica, incluida |');
  if (s !== o) { fs.writeFileSync(cuestaFp, s); edited++; }
}

console.log(JSON.stringify({ files_edited: edited, slash_partner_replacements: replacements }, null, 2));

// Validation
const violations = [];
for (const loc of LOCALES) {
  const dir = path.join(ROOT, loc);
  for (const fn of fs.readdirSync(dir)) {
    const s = fs.readFileSync(path.join(dir, fn), 'utf8');
    if (/Slash[^.]{0,80}Stearns/.test(s)) violations.push(`${loc}/${fn} :: Slash↔Stearns`);
    if (/Stearns[^.]{0,80}Slash/.test(s)) violations.push(`${loc}/${fn} :: Stearns↔Slash`);
    if (loc === 'es' && fn === 'cuanto-cuesta-constituir-llc.ts'
        && /BOI Report \| Presentación obligatoria, incluida/.test(s)) {
      violations.push(`${loc}/${fn} :: BOI obligatoria row`);
    }
  }
}
if (violations.length) { console.error('VALIDATION FAILED:', violations); process.exit(1); }
console.log('VALIDATION PASSED.');
