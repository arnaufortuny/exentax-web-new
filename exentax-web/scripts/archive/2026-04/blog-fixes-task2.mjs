#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ES_DIR = resolve(__dirname, "../client/src/data/blog-content/es");

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const DRY = process.argv.includes("--dry");

const readSlugs = (path) =>
  readFileSync(path, "utf8")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const cfcSlugs = new Set(readSlugs(arg("cfc", "/tmp/cfc_slugs.txt")));
const yearSlugs = new Set(readSlugs(arg("years", "/tmp/year_slugs.txt")));
const legalSlugs = new Set(readSlugs(arg("legal", "/tmp/legal_slugs.txt")));

const MARK_CFC = "<!-- exentax:cfc-block-v1 -->";
const MARK_LEGAL = "<!-- exentax:legal-refs-v1 -->";
const MARK_BANK = "<!-- exentax:bank-balance-v1 -->";
const MARK_YEAR = "<!-- exentax:year-2026-v1 -->";

const CFC_BLOCK = `

${MARK_CFC}
## Compliance fiscal en tu país: CFC, TFI y atribución de rentas

Una LLC americana es una herramienta legal y reconocida internacionalmente. Pero el cumplimiento no termina al constituirla: como propietario residente fiscal en otro país, tu administración tributaria sigue teniendo derecho a gravar lo que la LLC genera. Lo importante es saber **bajo qué régimen** aplica esa tributación.

- **España (LIRPF/LIS).** Si la LLC es una *Single-Member Disregarded Entity* operativa (servicios reales, sin pasividad significativa), Hacienda suele tratarla por **atribución de rentas (art. 87 LIRPF)**: los beneficios netos se imputan al socio en el ejercicio en que se generan, integrándose en la base general del IRPF. Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada por residente español con rentas mayoritariamente pasivas, puede activarse el régimen de **transparencia fiscal internacional (art. 91 LIRPF para personas físicas, art. 100 LIS para sociedades)**. La diferencia entre uno u otro régimen no es opcional: depende de la sustancia económica, no del nombre.
- **Modelos informativos.** Cuentas bancarias en EE. UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT). Operaciones vinculadas con la LLC y dividendos repatriados: **Modelo 232**. Criptoactivos custodiados en EE. UU.: **Modelo 721**.
- **CDI España–EE. UU.** El convenio (BOE 22/12/1990, Protocolo en vigor 27/11/2019) ordena la doble imposición sobre dividendos, intereses y royalties. Una LLC sin establecimiento permanente en España no constituye, por sí sola, EP del socio, pero la dirección efectiva sí puede crearlo si toda la gestión se hace desde territorio español.
- **México, Colombia, Argentina y otros LATAM.** Cada jurisdicción tiene su propio régimen CFC (México: Refipres; Argentina: rentas pasivas del exterior; Chile: art. 41 G LIR). El principio común: lo que la LLC retiene como beneficio se considera percibido por el socio si la entidad se considera transparente o controlada.

La regla práctica: una LLC operativa, con sustancia, declarada correctamente en residencia, es **planificación fiscal legítima**. Una LLC que se usa para ocultar ingresos, simular no residencia o desplazar rentas pasivas sin justificación económica entra en el terreno del **art. 15 LGT (conflicto en aplicación de la norma)** o, en el peor caso, del **art. 16 LGT (simulación)**. La diferencia la marcan los hechos, no el papel.

En Exentax montamos la estructura para que encaje en el primer escenario y documentamos cada paso para que tu declaración local sea defendible ante una eventual revisión.`;

const LEGAL_BLOCK = `

${MARK_LEGAL}
## Referencias legales y normativas

Este artículo se apoya en normativa vigente a fecha 2026. Citamos las fuentes principales para que puedas verificarlo:

- **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fiscal — *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report ante FinCEN).
- **España.** Ley 35/2006 (LIRPF), arts. 8, 9 (residencia), 87 (atribución de rentas), 91 (transparencia fiscal internacional para personas físicas); Ley 27/2014 (LIS), art. 100 (transparencia fiscal internacional para sociedades); Ley 58/2003 (LGT), arts. 15 (conflicto en aplicación de la norma) y 16 (simulación); Ley 5/2022 (régimen sancionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 720); Orden HFP/887/2023 (Modelo 721 cripto).
- **Convenio España–EE. UU.** BOE de 22/12/1990 (CDI original); Protocolo en vigor desde 27/11/2019 (renta pasiva, *limitation on benefits*).
- **UE / OCDE.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (plataformas digitales — vigor 2023+) y DAC8 (criptoactivos — aplicación 2026); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetrías híbridas); Estándar Común de Reporte (CRS) de la OCDE.
- **Marco internacional.** Modelo de Convenio OCDE, art. 5 (establecimiento permanente) y comentarios; Acción 5 BEPS (sustancia económica); FATF Recommendation 24 (titularidad real).

La aplicación concreta de cualquiera de estas normas a tu caso depende de tu residencia fiscal, la actividad de la LLC y la documentación que mantengas. Este contenido es informativo y no sustituye al asesoramiento profesional personalizado.`;

const BANK_BLOCK = `

${MARK_BANK}
## Stack bancario equilibrado: Mercury, Relay, Slash y Wise

No existe la cuenta perfecta para una LLC. Existe el **stack** correcto, donde cada herramienta cubre un rol:

- **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente). Cuenta principal operativa para no residentes con buena UX, ACH y wires. Sigue siendo una de las opciones más probadas para abrir desde fuera de EE. UU.
- **Relay** (respaldada por Thread Bank, FDIC). Excelente como **cuenta de respaldo** y para gestión "envelope budgeting": permite crear hasta 20 sub-cuentas y 50 tarjetas de débito, integración profunda con QuickBooks y Xero. Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare.
- **Slash** (respaldada por Stearns Bank N.A., FDIC). Banca diseñada para operadores online: emisión instantánea de tarjetas virtuales por proveedor, controles de gasto granulares, *cashback* en publicidad digital. Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS.
- **Wise Business** (EMI multi-divisa, no es banco). Para cobrar y pagar en EUR, GBP, USD y otras divisas con datos bancarios locales y conversión a *mid-market rate*. No sustituye una cuenta US real, pero es imbatible para tesorería internacional.
- **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen. Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC.

La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**. Es la configuración que minimiza riesgo de bloqueo y reduce coste real. En Exentax abrimos y configuramos este stack como parte de la constitución.`;

const slugify = (f) => f.replace(/\.ts$/, "");
const files = readdirSync(ES_DIR).filter((f) => f.endsWith(".ts"));

let stats = { cfc: 0, legal: 0, bank: 0, year: 0, skipped: 0, files: 0 };

const isBankingArticle = (slug, body) => {
  const banks = (body.match(/Mercury/gi) || []).length;
  const slash = (body.match(/Slash/gi) || []).length;
  const relay = (body.match(/Relay/gi) || []).length;
  // Banking-comparison article: 3+ Mercury mentions and underweight Slash/Relay
  return banks >= 3 && slash + relay < banks * 0.5 && !slug.includes("crs") && !slug.includes("dac") && !slug.includes("itin");
};

for (const f of files) {
  const slug = slugify(f);
  const path = resolve(ES_DIR, f);
  let src = readFileSync(path, "utf8");
  let body = src;
  let touched = false;

  // Find the closing backtick + ; that ends `export default \`...\`;`
  const endMatch = body.match(/`;\s*$/);
  if (!endMatch) {
    stats.skipped++;
    continue;
  }
  const insertAt = endMatch.index;

  const append = (block) => {
    body = body.slice(0, insertAt) + block + body.slice(insertAt);
  };

  // 1) CFC block
  if (cfcSlugs.has(slug) && !body.includes(MARK_CFC)) {
    append(CFC_BLOCK);
    stats.cfc++;
    touched = true;
  }

  // 2) Legal references footer (re-find insertAt because body changed)
  if (legalSlugs.has(slug) && !body.includes(MARK_LEGAL)) {
    const endMatch2 = body.match(/`;\s*$/);
    body = body.slice(0, endMatch2.index) + LEGAL_BLOCK + body.slice(endMatch2.index);
    stats.legal++;
    touched = true;
  }

  // 3) Bank rebalance — only for non-CRS/DAC banking articles where Mercury is overweighted
  if (isBankingArticle(slug, body) && !body.includes(MARK_BANK)) {
    const endMatch3 = body.match(/`;\s*$/);
    body = body.slice(0, endMatch3.index) + BANK_BLOCK + body.slice(endMatch3.index);
    stats.bank++;
    touched = true;
  }

  // 4) Year refresh — only for the 9 articles flagged. Replace standalone "en 2024" / "en 2025"
  // and "para 2025" → "en 2026". Be conservative: only inside common temporal phrases.
  if (yearSlugs.has(slug) && !body.includes(MARK_YEAR)) {
    let changed = false;
    const before = body;
    body = body.replace(/\b(en|para|durante|hasta)\s+202[1-5]\b/g, (m, p1) => {
      changed = true;
      return `${p1} 2026`;
    });
    // Replace "actualizado a 202X" / "vigente en 202X" patterns
    body = body.replace(/\b(actualizad[oa]s?\s+(?:a|en)|vigente(?:s)?\s+(?:en|para)|datos\s+de)\s+202[1-5]\b/g, (m, p1) => {
      changed = true;
      return `${p1} 2026`;
    });
    if (changed) {
      // Add invisible marker before closing backtick
      const endMatch4 = body.match(/`;\s*$/);
      body = body.slice(0, endMatch4.index) + `\n\n${MARK_YEAR}\n` + body.slice(endMatch4.index);
      stats.year++;
      touched = true;
    } else if (before !== body) {
      // unreachable
    }
  }

  if (touched) {
    stats.files++;
    if (!DRY) writeFileSync(path, body);
  }
}

console.log(JSON.stringify(stats, null, 2));
