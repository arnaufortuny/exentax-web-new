#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'client/src/data/blog-content');
const LOCALES = ['es', 'en', 'fr', 'de', 'pt', 'ca'];

const IFR_ES = '(tras la interim final rule de FinCEN de marzo de 2025, el BOI sólo aplica a "foreign reporting companies": entidades constituidas fuera de EE. UU. y registradas en un estado; verifica en FinCEN.gov)';
const IFR_PT = '(após a interim final rule do FinCEN de março de 2025, o BOI só se aplica a "foreign reporting companies": entidades constituídas fora dos EUA e registadas num estado; verifica em FinCEN.gov)';
const IFR_CA = '(després de la interim final rule de FinCEN de març de 2025, el BOI només s\'aplica a "foreign reporting companies": entitats constituïdes fora dels EUA i registrades en un estat; verifica a FinCEN.gov)';

const FIXES = {
  es: {
    'auditoria-rapida-llc-12-puntos-30-minutos.ts': [
      [/¿Presentaste el BOI Report ante FinCEN cuando se constituyó la LLC o en 2026\? ¿Has actualizado dirección, documento de identidad o beneficiarios si han cambiado\? El BOI no es un trámite único: cualquier cambio relevante exige actualización en 30 días\./,
       `Tras la **interim final rule de FinCEN de marzo de 2025**, el BOI Report sólo aplica a **foreign reporting companies** (entidades constituidas fuera de EE. UU. y registradas en un estado). Si tu LLC se constituyó en EE. UU., a día de hoy queda fuera; aun así, **verifica el estado vigente en FinCEN.gov** antes de presentar, porque la regla puede volver a cambiar. Si tu entidad sí entra en ámbito y han cambiado dirección, documento o beneficiarios, hay 30 días para actualizar.`],
    ],
    'mantenimiento-anual-llc-obligaciones.ts': [
      [/Si cambia algún dato de los propietarios reales de la LLC \(nombre, dirección, pasaporte, porcentaje de participación\), debes actualizar el BOI Report ante FinCEN en un plazo de 30 días\. Nota: FinCEN ha suspendido temporalmente la enforcement de sanciones, pero en Exentax seguimos presentando todo en plazo\./,
       `Si tu LLC entra en el ámbito vigente del BOI Report ${IFR_ES} y cambia algún dato de los propietarios reales (nombre, dirección, pasaporte, porcentaje de participación), debes actualizar el reporte ante FinCEN en un plazo de 30 días. Si tu LLC se constituyó en EE. UU. queda hoy fuera de la obligación; en Exentax monitorizamos cambios normativos y, si vuelve a aplicar, presentamos en plazo.`],
    ],
    'single-member-multi-member-llc-implicaciones-fiscales.ts': [
      [/Cualquier nuevo beneficiario debe incorporarse al BOI dentro de 30 días\./,
       `Si la LLC entra en el ámbito vigente del BOI Report ${IFR_ES}, cualquier nuevo beneficiario debe incorporarse al BOI dentro de 30 días.`],
    ],
    'tengo-llc-checklist-gestion-correcta.ts': [
      [/- ¿Presentaste el BOI inicial al constituir la LLC\?\n- ¿Has actualizado el BOI ante cualquier cambio \(dirección, documento de identidad, beneficiario\)\?/,
       `- ¿Tu LLC entra en el ámbito vigente del BOI Report ${IFR_ES}? Si tu LLC se constituyó en EE. UU., a día de hoy queda fuera; si es una entidad extranjera registrada para operar en un estado, sí entra.\n- Si entra en ámbito: ¿presentaste el BOI inicial y has actualizado ante cualquier cambio (dirección, documento de identidad, beneficiario)?`],
    ],
    'cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad.ts': [
      [/Si el cambio de proveedor implica cambio de dirección de notificaciones de la LLC o de algún beneficiario reportado, hay 30 días para actualizar el BOI Report ante FinCEN\. El trámite es online y gratuito\./,
       `Si tu LLC sigue en el ámbito vigente del BOI Report ${IFR_ES} y el cambio de proveedor implica cambio de dirección de notificaciones o de algún beneficiario reportado, hay 30 días para actualizar el reporte ante FinCEN. El trámite es online y gratuito. Si tu LLC se constituyó en EE. UU. queda hoy fuera de la obligación.`],
    ],
    'como-disolver-cerrar-llc-paso-a-paso.ts': [
      [/En paralelo, hay que revisar el \*\*BOI Report ante FinCEN\*\*\. La normativa BOI \(Beneficial Ownership Information\) vigente exige reportes iniciales y de actualización; cuando la LLC se disuelve, conviene actualizar el reporte para reflejar el cese, dentro de los plazos establecidos por FinCEN\. El régimen BOI ha tenido cambios y suspensiones recientes, así que conviene comprobar la regla aplicable en el momento exacto del cierre\./,
       `En paralelo, hay que revisar el **BOI Report ante FinCEN**. La normativa BOI vigente, **tras la interim final rule de FinCEN de marzo de 2025**, exige reportes únicamente a **foreign reporting companies** (entidades constituidas fuera de EE. UU. y registradas en un estado). Si tu LLC se constituyó en EE. UU. queda hoy fuera de esa obligación. Si tu LLC sí entra en ámbito y se disuelve, conviene actualizar el reporte para reflejar el cese dentro de los plazos de FinCEN. El régimen BOI ha tenido cambios y suspensiones recientes; **comprueba la regla en FinCEN.gov en el momento exacto del cierre**.`],
    ],
  },
  ca: {
    'tengo-llc-checklist-gestion-correcta.ts': [
      [/Vas presentar el BOI inicial en constituir la LLC\?/,
       `La teva LLC entra en l'àmbit vigent del BOI Report ${IFR_CA}? Si sí, vas presentar el BOI inicial en constituir la LLC?`],
    ],
  },
  pt: {
    'tengo-llc-checklist-gestion-correcta.ts': [
      [/Apresentou o BOI inicial ao constituir a LLC\?/,
       `A sua LLC entra no âmbito vigente do BOI Report ${IFR_PT}? Se sim, apresentou o BOI inicial ao constituir a LLC?`],
    ],
    'cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad.ts': [
      [/Se a mudança implica nova mailing address ou alteração de info do beneficiário, 30 dias para actualizar BOI no FinCEN\. Online, gratuito\./,
       `Se a LLC está no âmbito vigente do BOI ${IFR_PT} e a mudança implica nova mailing address ou alteração de info do beneficiário, 30 dias para actualizar o BOI no FinCEN. Online, gratuito. Se a LLC se constituiu nos EUA está hoje fora da obrigação.`],
    ],
    'como-disolver-cerrar-llc-paso-a-paso.ts': [
      [/Em paralelo, rever o \*\*BOI Report perante FinCEN\*\*\. A normativa BOI vigente exige reports iniciais e de actualização; à dissolução, actualizar o report dentro dos prazos FinCEN\. O regime BOI sofreu alterações e suspensões recentes, pelo que se deve verificar a regra à data exacta do encerramento\./,
       `Em paralelo, rever o **BOI Report perante FinCEN**. A normativa BOI vigente, **após a interim final rule do FinCEN de março de 2025**, exige reports apenas a **foreign reporting companies** (entidades constituídas fora dos EUA e registadas num estado). Se a LLC se constituiu nos EUA está hoje fora dessa obrigação. Se entra no âmbito e se dissolve, actualizar o report dentro dos prazos FinCEN. **Verifica a regra em FinCEN.gov à data exacta do encerramento.**`],
    ],
    'recuperar-llc-boi-5472-atrasados-procedimiento.ts': [
      [/Porquê esta ordem: para apresentar bem o 5472, a LLC tem de existir legalmente; para actualizar BOI são precisos dados claros; e qualquer regularização local precisa de números sólidos\./,
       `Porquê esta ordem: para apresentar bem o 5472, a LLC tem de existir legalmente; para actualizar BOI (se a LLC entra no âmbito vigente — foreign reporting companies após a IFR do FinCEN de março de 2025) são precisos dados claros; e qualquer regularização local precisa de números sólidos.`],
      [/- \*\*Apresentado mas com dados desactualizados\*\*: apresenta BOI actualizado\./,
       `- **Apresentado mas com dados desactualizados** (se a LLC continua no âmbito vigente do BOI ${IFR_PT}): apresenta BOI actualizado.`],
    ],
  },
};

let edits = 0;
for (const [loc, files] of Object.entries(FIXES)) {
  for (const [file, patches] of Object.entries(files)) {
    const fp = path.join(ROOT, loc, file);
    if (!fs.existsSync(fp)) { console.warn('MISS', loc, file); continue; }
    let s = fs.readFileSync(fp, 'utf8');
    const o = s;
    for (const [pat, rep] of patches) {
      const ns = s.replace(pat, rep);
      if (ns === s) console.warn('NO-MATCH', loc, file, pat.toString().slice(0, 80));
      s = ns;
    }
    if (s !== o) { fs.writeFileSync(fp, s); edits++; }
  }
}

// Remove "esta nota prevalece" / equivalents from all appended blocks
const stripPhrases = [
  /Donde este artículo[^.]*?esta nota prevalece\.\s*/g,
  /Si este artículo[^.]*?esta nota prevalece\.\s*/g,
  /Si alguna afirmación[^.]*?esta nota prevalece\.\s*/g,
  /Where this article[^.]*?this note prevails\.\s*/g,
  /If this article[^.]*?this note prevails\.\s*/g,
  /Là où cet article[^.]*?cette note prévaut\.\s*/g,
  /Si cet article[^.]*?cette note prévaut\.\s*/g,
  /Sofern dieser Artikel[^.]*?gilt diese Notiz[^.]*?\.\s*/g,
  /Wo dieser Artikel[^.]*?gilt diese Notiz[^.]*?\.\s*/g,
  /Falls dieser Artikel[^.]*?gilt diese Notiz[^.]*?\.\s*/g,
  /Onde este artigo[^.]*?esta nota prevalece\.\s*/g,
  /Quando este artigo[^.]*?esta nota prevalece\.\s*/g,
  /Se algum[^.]*?esta nota prevalece\.\s*/g,
  /Allà on aquest article[^.]*?aquesta nota preval\.\s*/g,
  /Quan aquest article[^.]*?aquesta nota preval\.\s*/g,
  /Si alguna afirmació[^.]*?aquesta nota preval\.\s*/g,
];

let stripped = 0;
for (const loc of LOCALES) {
  const dir = path.join(ROOT, loc);
  if (!fs.existsSync(dir)) continue;
  for (const fn of fs.readdirSync(dir)) {
    if (!fn.endsWith('.ts')) continue;
    const fp = path.join(dir, fn);
    let s = fs.readFileSync(fp, 'utf8');
    const o = s;
    for (const re of stripPhrases) s = s.replace(re, '');
    if (s !== o) { fs.writeFileSync(fp, s); stripped++; }
  }
}

console.log(JSON.stringify({ in_body_edits: edits, override_lines_stripped: stripped }, null, 2));

// Validation: assert no remaining unconditional BOI-mandatory phrases
const violations = [];
const checks = [
  { re: /es\b/, pat: /Si tienes una LLC, necesitas presentarlo/ },
  { re: /es\b/, pat: /debes presentarlo\.\s*Sin excepciones/ },
  { re: /es\b/, pat: /Necesitas presentar ambos/ },
  { re: /.*/, pat: /esta nota prevalece/ },
  { re: /.*/, pat: /this note prevails/ },
];
for (const loc of LOCALES) {
  const dir = path.join(ROOT, loc);
  for (const fn of fs.readdirSync(dir)) {
    const fp = path.join(dir, fn);
    const s = fs.readFileSync(fp, 'utf8');
    for (const c of checks) if (c.pat.test(s)) violations.push(`${loc}/${fn} :: ${c.pat}`);
  }
}
if (violations.length) {
  console.error('VALIDATION FAILED:', violations.slice(0, 20));
  process.exit(1);
}
console.log('VALIDATION PASSED.');
