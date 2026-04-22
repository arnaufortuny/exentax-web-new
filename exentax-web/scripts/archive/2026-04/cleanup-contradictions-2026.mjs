#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'client/src/data/blog-content');
const LOCALES = ['es', 'en', 'fr', 'de', 'pt', 'ca'];

const TASK34_SLUGS = new Set([
  'wise-business-crs-reporting-fiscal',
  'wise-iban-llc-que-reporta-hacienda',
]);

let stripped = 0, fixed = 0;

// Pass A: strip both blocks from Task #34 slugs across all locales
for (const loc of LOCALES) {
  for (const slug of TASK34_SLUGS) {
    const fp = path.join(ROOT, loc, slug + '.ts');
    if (!fs.existsSync(fp)) continue;
    let s = fs.readFileSync(fp, 'utf8');
    const o = s;
    s = s.replace(/\n+<!-- exentax:banking-facts-v1 -->[\s\S]*?(?=`;\s*$)/, '\n');
    s = s.replace(/\n+<!-- exentax:legal-facts-v1 -->[\s\S]*?(?=`;\s*$)/, '\n');
    if (s !== o) { fs.writeFileSync(fp, s); stripped++; }
  }
}

// Pass B: in-body BOI/5472 contradiction fixes (ES corpus)
const ES_FIXES = [
  {
    file: 'boi-report-fincen-guia-completa-2026.ts',
    edits: [
      [/Si tienes una LLC, necesitas presentarlo\. Aquí te explicamos todo\./,
       'Tras la **interim final rule de FinCEN de marzo de 2025**, la obligación quedó **restringida a las "foreign reporting companies"**: si tu LLC se constituyó en un estado de EE. UU., **a día de hoy estás fuera del requisito**, aunque seas no residente. Si tu entidad se constituyó fuera de EE. UU. y la registraste para operar en un estado, sí entras. Aquí te explicamos todo, con el estado normativo vigente.'],
      [/Si eres un freelancer o emprendedor con una Single-Member LLC, debes presentarlo\. Sin excepciones\./,
       'Si tu Single-Member LLC se constituyó **dentro de EE. UU.**, **hoy no estás obligado** a presentar el BOI Report (interim final rule de FinCEN, marzo 2025). Si la entidad se constituyó **fuera de EE. UU.** y la registraste para operar en un estado, sí. **Verifica el estado en FinCEN.gov antes de presentar**, porque la regla puede volver a cambiar.'],
      [/Necesitas presentar ambos\. Son complementarios, no excluyentes\./,
       'El Form 5472 sigue siendo obligatorio para tu Single-Member LLC con transacciones con partes relacionadas extranjeras. El BOI Report, en cambio, **a día de hoy solo aplica a foreign reporting companies** tras la regla de marzo 2025; verifica tu situación en FinCEN.gov.'],
      [/- Preparamos y presentamos el BOI Report dentro del plazo de 90 días/,
       '- Verificamos si tu LLC entra en el ámbito vigente del BOI Report (foreign reporting companies tras la regla de marzo 2025) y, si aplica, lo preparamos y presentamos dentro de plazo'],
      [/- Verificamos que el BOI Report esté actualizado/,
       '- Monitorizamos el estado normativo del BOI Report y, si tu LLC vuelve a estar en ámbito o cambian los datos, lo actualizamos'],
      [/El BOI Report es su herramienta para saber quién está detrás de cada empresa registrada en EE\.UU\./,
       'El BOI Report es su herramienta para identificar a los propietarios reales de las entidades dentro del ámbito vigente del Corporate Transparency Act.'],
    ],
  },
  {
    file: 'tengo-llc-checklist-gestion-correcta.ts',
    edits: [
      // This Form 5472 statement is actually correct (5472 still mandatory for non-resident SMLLC) — leave alone
    ],
  },
  {
    file: 'errores-criticos-llc-ya-constituida.ts',
    edits: [
      // Same — Form 5472 statement is correct
    ],
  },
];

for (const { file, edits } of ES_FIXES) {
  const fp = path.join(ROOT, 'es', file);
  if (!fs.existsSync(fp)) continue;
  let s = fs.readFileSync(fp, 'utf8');
  const o = s;
  for (const [pat, rep] of edits) s = s.replace(pat, rep);
  if (s !== o) { fs.writeFileSync(fp, s); fixed++; }
}

console.log(JSON.stringify({ stripped, fixed }, null, 2));

// Pass C: validation regex — must report 0 hits in main BOI article body
const offenders = [];
for (const loc of LOCALES) {
  const fp = path.join(ROOT, loc, 'boi-report-fincen-guia-completa-2026.ts');
  if (!fs.existsSync(fp)) continue;
  const body = fs.readFileSync(fp, 'utf8').split('<!-- exentax:legal-facts-v1 -->')[0];
  const checks = [
    /Si tienes una LLC, necesitas presentarlo/,
    /debes presentarlo\.\s*Sin excepciones/,
    /Necesitas presentar ambos/,
  ];
  for (const c of checks) if (c.test(body)) offenders.push(`${loc}/boi-report-fincen-guia-completa-2026.ts :: ${c}`);
}
if (offenders.length) {
  console.error('VALIDATION FAILED:', offenders);
  process.exit(1);
} else {
  console.log('VALIDATION PASSED: no contradictory BOI claims remain in body of canonical BOI article.');
}
