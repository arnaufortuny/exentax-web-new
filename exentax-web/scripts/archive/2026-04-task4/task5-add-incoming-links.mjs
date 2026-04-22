import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Visible link text MUST avoid the year (avoid year-in-prose audit).
const TITLES = {
  "tramos-irpf-2026": "los tramos del IRPF actualizados",
  "cuota-autonomo-2026": "la cuota de autónomo por tramos de ingresos",
  "gastos-deducibles-autonomos-2026": "los gastos deducibles para autónomos",
  "iva-intracomunitario-servicios-europa": "el IVA intracomunitario en servicios a Europa",
  "retenciones-irpf-factura": "las retenciones de IRPF en factura",
  "sociedad-limitada-espana-costes-ventajas": "constituir una SL en España: costes y ventajas",
  "modulos-vs-estimacion-directa-2026": "módulos frente a estimación directa",
  "diferencia-llc-corporation-s-corp-c-corp": "diferencias entre LLC, Corporation, S-Corp y C-Corp",
  "facturar-sin-ser-autonomo-alternativas-2026": "alternativas legales para facturar sin ser autónomo",
};

const PLAN = {
  "errores-fiscales-freelancers-espanoles": [
    "tramos-irpf-2026",
    "gastos-deducibles-autonomos-2026",
    "retenciones-irpf-factura",
    "modulos-vs-estimacion-directa-2026",
    "iva-intracomunitario-servicios-europa",
    "cuota-autonomo-2026",
    "facturar-sin-ser-autonomo-alternativas-2026",
  ],
  "autonomos-espana-por-que-dejar-de-serlo": [
    "cuota-autonomo-2026",
    "gastos-deducibles-autonomos-2026",
    "modulos-vs-estimacion-directa-2026",
    "retenciones-irpf-factura",
    "sociedad-limitada-espana-costes-ventajas",
    "facturar-sin-ser-autonomo-alternativas-2026",
    "tramos-irpf-2026",
  ],
  "impuestos-clientes-internacionales-espana": [
    "iva-intracomunitario-servicios-europa",
    "retenciones-irpf-factura",
    "tramos-irpf-2026",
    "facturar-sin-ser-autonomo-alternativas-2026",
  ],
  "autonomo-espana-vs-llc-estados-unidos": [
    "sociedad-limitada-espana-costes-ventajas",
    "diferencia-llc-corporation-s-corp-c-corp",
    "cuota-autonomo-2026",
    "gastos-deducibles-autonomos-2026",
    "modulos-vs-estimacion-directa-2026",
  ],
  "estructura-fiscal-optima-freelancer-internacional": [
    "iva-intracomunitario-servicios-europa",
    "sociedad-limitada-espana-costes-ventajas",
    "facturar-sin-ser-autonomo-alternativas-2026",
  ],
  "fiscalidad-internacional-emprendedores-digitales": [
    "tramos-irpf-2026",
    "cuota-autonomo-2026",
    "gastos-deducibles-autonomos-2026",
    "retenciones-irpf-factura",
    "modulos-vs-estimacion-directa-2026",
  ],
  "constituir-llc-proceso-paso-a-paso": [
    "diferencia-llc-corporation-s-corp-c-corp",
  ],
  "cuanto-cuesta-constituir-llc": [
    "diferencia-llc-corporation-s-corp-c-corp",
  ],
  "modulos-vs-estimacion-directa-2026": [
    "cuota-autonomo-2026",
    "gastos-deducibles-autonomos-2026",
  ],
  "tramos-irpf-2026": [
    "retenciones-irpf-factura",
    "cuota-autonomo-2026",
  ],
  "gastos-deducibles-autonomos-2026": [
    "modulos-vs-estimacion-directa-2026",
    "iva-intracomunitario-servicios-europa",
  ],
  "cuota-autonomo-2026": [
    "facturar-sin-ser-autonomo-alternativas-2026",
    "sociedad-limitada-espana-costes-ventajas",
  ],
  "retenciones-irpf-factura": [
    "tramos-irpf-2026",
    "facturar-sin-ser-autonomo-alternativas-2026",
    "gastos-deducibles-autonomos-2026",
  ],
  "facturar-sin-ser-autonomo-alternativas-2026": [
    "cuota-autonomo-2026",
    "sociedad-limitada-espana-costes-ventajas",
  ],
  "sociedad-limitada-espana-costes-ventajas": [
    "diferencia-llc-corporation-s-corp-c-corp",
    "cuota-autonomo-2026",
    "tramos-irpf-2026",
  ],
  "iva-intracomunitario-servicios-europa": [
    "retenciones-irpf-factura",
    "gastos-deducibles-autonomos-2026",
    "facturar-sin-ser-autonomo-alternativas-2026",
  ],
  "diferencia-llc-corporation-s-corp-c-corp": [
    "sociedad-limitada-espana-costes-ventajas",
    "cuota-autonomo-2026",
    "tramos-irpf-2026",
  ],
};

let totalAdds = 0;
for (const [src, targets] of Object.entries(PLAN)) {
  const path = resolve(ROOT, `client/src/data/blog-content/es/${src}.ts`);
  let content = readFileSync(path, "utf8");

  // Remove any previously inserted "## Lecturas relacionadas" block (idempotent).
  content = content.replace(
    /\n\n## Lecturas relacionadas\n\nPara profundizar[\s\S]*?\.\n(?=`;\s*$)/,
    "",
  );

  const closeIdx = content.lastIndexOf("`;");
  if (closeIdx === -1) {
    console.error(`! ${src}: closing backtick not found, skipping`);
    continue;
  }
  const items = targets
    .map((t) => `<a href="/es/blog/${t}">${TITLES[t]}</a>`)
    .join(", ");
  const block = `\n\n## Lecturas relacionadas\n\nPara profundizar, te puede interesar leer sobre ${items}.\n`;
  content = content.slice(0, closeIdx) + block + content.slice(closeIdx);
  writeFileSync(path, content);
  totalAdds += targets.length;
  console.log(`+ ${src}: set ${targets.length} link(s)`);
}
console.log(`\nDone. Set ${totalAdds} incoming links.`);
