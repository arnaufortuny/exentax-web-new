#!/usr/bin/env node
/**
 * audit-pt-pt.mjs
 *
 * Falla si el contenido en portugués (pt) del sitio vuelve a contener
 * brasileñismos (formas propias del portugués brasileño).
 *
 * Se ejecuta sobre los archivos en los que vive el contenido pt:
 *  - client/src/data/blog-i18n/pt.ts
 *  - client/src/i18n/locales/pt.ts
 *  - client/src/data/blog-content/pt/**
 *  - bloques `pt: { … }` y `const pt = { … }` de
 *    client/src/i18n/data/subpages.ts
 *
 * Las listas de palabras prohibidas y de prefijos verbales para el gerundio
 * están centralizadas abajo. Para ampliar la guardia, añade entradas a
 * FORBIDDEN_WORDS o a GERUND_AUX_PREFIXES.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const WEB_ROOT = resolve(__dirname, "..", "..");
const REPO_ROOT = resolve(WEB_ROOT, "..");

// ---------------------------------------------------------------------------
// Listas centralizadas
// ---------------------------------------------------------------------------

/**
 * Palabras / formas que sólo se usan en portugués brasileño.
 * Cada entrada se compara como palabra completa, sin distinguir mayúsculas.
 * La forma PT-PT preferida se documenta junto a cada entrada.
 */
const FORBIDDEN_WORDS = [
  // Pronombres / tratamiento
  { br: "você", pt: "tu / o senhor / a senhora" },
  { br: "vocês", pt: "vós / os senhores" },

  // Léxico común
  { br: "registro", pt: "registo" },
  { br: "registros", pt: "registos" },
  { br: "registrar", pt: "registar" },
  { br: "registrado", pt: "registado" },
  { br: "registrada", pt: "registada" },
  { br: "registrados", pt: "registados" },
  { br: "registradas", pt: "registadas" },
  { br: "cadastro", pt: "registo / inscrição" },
  { br: "cadastrar", pt: "registar / inscrever" },
  { br: "contato", pt: "contacto" },
  { br: "contatos", pt: "contactos" },
  { br: "contatar", pt: "contactar" },
  { br: "equipe", pt: "equipa" },
  { br: "equipes", pt: "equipas" },
  { br: "gerenciar", pt: "gerir" },
  { br: "gerenciamento", pt: "gestão" },
  { br: "gerenciado", pt: "gerido" },
  { br: "tela", pt: "ecrã" },
  { br: "telas", pt: "ecrãs" },
  { br: "arquivo", pt: "ficheiro" },
  { br: "arquivos", pt: "ficheiros" },
  { br: "celular", pt: "telemóvel" },
  { br: "celulares", pt: "telemóveis" },
  { br: "ônibus", pt: "autocarro" },
  { br: "trem", pt: "comboio" },
  { br: "geladeira", pt: "frigorífico" },
  { br: "aluguel", pt: "aluguer" },
  { br: "aluguéis", pt: "alugueres" },
  { br: "bilhão", pt: "mil milhões" },
  { br: "bilhões", pt: "mil milhões" },
  { br: "trilhão", pt: "bilião" },
  { br: "trilhões", pt: "biliões" },
  { br: "café da manhã", pt: "pequeno-almoço" },
  { br: "esporte", pt: "desporto" },
  { br: "esportes", pt: "desportos" },
  { br: "esportivo", pt: "desportivo" },
  { br: "esportiva", pt: "desportiva" },
];

// Nota: las grafías sin "c/p" mudas (atual, ação, projeto, direto,
// objetivo, recepção, etc.) se aceptan en PT-PT después del Acordo
// Ortográfico de 1990 y por tanto NO se incluyen como brasileñismos.
// Para forzar la grafía pre-AO90 habría que añadirlas aquí asumiendo el
// coste de falsos positivos en redacción moderna.

/**
 * Verbos auxiliares ("estar") que, seguidos de gerundio (-ndo), forman la
 * construcción brasileña "está pagando". El portugués europeo usa
 * "estar + a + infinitivo" ("está a pagar").
 *
 * Para ampliar, añade más formas conjugadas aquí.
 */
const GERUND_AUX_PREFIXES = [
  "estou",
  "estás",
  "está",
  "estamos",
  "estão",
  "estava",
  "estavas",
  "estávamos",
  "estavam",
  "estive",
  "esteve",
  "estivemos",
  "estiveram",
  "estarei",
  "estarás",
  "estará",
  "estaremos",
  "estarão",
  "estaria",
  "estarias",
  "estaríamos",
  "estariam",
  "estiver",
  "estivermos",
  "estiverem",
  "ficou",
  "fica",
  "ficam",
  "ficaram",
  "continua",
  "continuam",
  "continuou",
  "continuaram",
  "vai",
  "vou",
  "vão",
  "vamos",
  "anda",
  "andam",
];

// Excepciones a la regla del gerundio: terminaciones -ndo que NO son
// gerundios sino sustantivos / adjetivos legítimos en PT-PT y que podrían
// aparecer tras alguno de los auxiliares de la lista.
const GERUND_NOUN_ALLOWLIST = new Set([
  "mundo",
  "fundo",
  "fundos",
  "segundo",
  "segundos",
  "redondo",
  "redondos",
  "profundo",
  "profundos",
  "comando",
  "comandos",
]);

// ---------------------------------------------------------------------------
// Selección de archivos
// ---------------------------------------------------------------------------

const FULL_SCAN_FILES = [
  "exentax-web/client/src/data/blog-i18n/pt.ts",
  "exentax-web/client/src/i18n/locales/pt.ts",
];

const FULL_SCAN_DIRS = [
  "exentax-web/client/src/data/blog-content/pt",
];

const PT_BLOCK_FILES = [
  "exentax-web/client/src/i18n/data/subpages.ts",
];

function walkDir(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) walkDir(full, out);
    else if (st.isFile() && /\.(ts|tsx|md|mdx|json)$/i.test(name)) out.push(full);
  }
  return out;
}

/**
 * Extrae el contenido de los bloques `pt: { … }` y `const pt = { … }` /
 * `const pt: … = { … }` de un fichero TypeScript, usando un contador de
 * llaves equilibrado.
 */
function extractPtBlocks(source) {
  const blocks = [];
  // Coincidencia para "pt:" como propiedad o "const pt[:= ]"
  const regex = /(^|[\s,{])(?:const\s+pt\b[^={]*=\s*|pt\s*:\s*)\{/gm;
  let m;
  while ((m = regex.exec(source)) !== null) {
    const openIdx = source.indexOf("{", m.index + m[0].length - 1);
    if (openIdx === -1) continue;
    let depth = 0;
    let i = openIdx;
    let inStr = null; // '"' | "'" | "`"
    let escape = false;
    for (; i < source.length; i++) {
      const ch = source[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (inStr) {
        if (ch === "\\") {
          escape = true;
          continue;
        }
        if (ch === inStr) inStr = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inStr = ch;
        continue;
      }
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          blocks.push({ start: openIdx, end: i + 1, text: source.slice(openIdx, i + 1) });
          break;
        }
      }
    }
  }
  return blocks;
}

// ---------------------------------------------------------------------------
// Detección
// ---------------------------------------------------------------------------

const wordPatterns = FORBIDDEN_WORDS.map((entry) => {
  // Soporta entradas multi-palabra (p. ej. "café da manhã").
  const escaped = entry.br
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s+/g, "\\s+");
  return {
    entry,
    re: new RegExp(`(?<![\\p{L}\\p{M}])${escaped}(?![\\p{L}\\p{M}])`, "giu"),
  };
});

const gerundRe = new RegExp(
  `\\b(${GERUND_AUX_PREFIXES.join("|")})\\s+([\\p{L}\\p{M}]+ndo)\\b`,
  "giu",
);

function lineColFor(text, index) {
  let line = 1;
  let lastNl = -1;
  for (let i = 0; i < index; i++) {
    if (text.charCodeAt(i) === 10) {
      line++;
      lastNl = i;
    }
  }
  return { line, col: index - lastNl };
}

function snippetAt(text, index, max = 80) {
  const start = Math.max(0, index - 20);
  const end = Math.min(text.length, index + max);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

const offenders = [];

function scanText(relPath, text, baseOffset = 0) {
  for (const { entry, re } of wordPatterns) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      const idx = baseOffset + m.index;
      offenders.push({
        file: relPath,
        ...lineColFor(text, m.index),
        kind: "word",
        match: m[0],
        suggestion: entry.pt,
        snippet: snippetAt(text, m.index),
      });
    }
  }
  gerundRe.lastIndex = 0;
  let g;
  while ((g = gerundRe.exec(text)) !== null) {
    const verb = g[2].toLowerCase();
    if (GERUND_NOUN_ALLOWLIST.has(verb)) continue;
    offenders.push({
      file: relPath,
      ...lineColFor(text, g.index),
      kind: "gerund",
      match: g[0],
      suggestion: `usar "${g[1]} a ${verb.replace(/ndo$/, "r")}" (PT-PT)`,
      snippet: snippetAt(text, g.index),
    });
  }
}

// Full-scan files / dirs
const filesToFullScan = [];
for (const f of FULL_SCAN_FILES) filesToFullScan.push(resolve(REPO_ROOT, f));
for (const d of FULL_SCAN_DIRS) filesToFullScan.push(...walkDir(resolve(REPO_ROOT, d)));

for (const abs of filesToFullScan) {
  let text;
  try {
    text = readFileSync(abs, "utf8");
  } catch {
    continue;
  }
  scanText(relative(REPO_ROOT, abs), text);
}

// pt-only blocks inside multi-locale files
for (const f of PT_BLOCK_FILES) {
  const abs = resolve(REPO_ROOT, f);
  let text;
  try {
    text = readFileSync(abs, "utf8");
  } catch {
    continue;
  }
  const rel = relative(REPO_ROOT, abs);
  const blocks = extractPtBlocks(text);
  for (const b of blocks) {
    // Reportamos posiciones relativas al fichero completo: scan sobre el
    // bloque pero corrigiendo line/col con base en el offset de inicio.
    const before = text.slice(0, b.start);
    const baseLine = (before.match(/\n/g) || []).length;
    const blockText = b.text;
    const localOffenders = [];
    for (const { entry, re } of wordPatterns) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(blockText)) !== null) {
        const lc = lineColFor(blockText, m.index);
        localOffenders.push({
          file: rel,
          line: baseLine + lc.line,
          col: lc.col,
          kind: "word",
          match: m[0],
          suggestion: entry.pt,
          snippet: snippetAt(blockText, m.index),
        });
      }
    }
    gerundRe.lastIndex = 0;
    let g;
    while ((g = gerundRe.exec(blockText)) !== null) {
      const verb = g[2].toLowerCase();
      if (GERUND_NOUN_ALLOWLIST.has(verb)) continue;
      const lc = lineColFor(blockText, g.index);
      localOffenders.push({
        file: rel,
        line: baseLine + lc.line,
        col: lc.col,
        kind: "gerund",
        match: g[0],
        suggestion: `usar "${g[1]} a ${verb.replace(/ndo$/, "r")}" (PT-PT)`,
        snippet: snippetAt(blockText, g.index),
      });
    }
    offenders.push(...localOffenders);
  }
}

// ---------------------------------------------------------------------------
// Reporte
// ---------------------------------------------------------------------------

if (offenders.length > 0) {
  console.error(
    `✗ Se han detectado ${offenders.length} formas de portugués brasileño en contenido pt:\n`,
  );
  // Agrupar por archivo para legibilidad
  const byFile = new Map();
  for (const o of offenders) {
    if (!byFile.has(o.file)) byFile.set(o.file, []);
    byFile.get(o.file).push(o);
  }
  for (const [file, list] of byFile) {
    console.error(`  ${file}`);
    for (const o of list) {
      const tag = o.kind === "gerund" ? "gerundio BR" : "léxico BR";
      console.error(
        `    L${o.line}:${o.col}  [${tag}]  "${o.match}"  →  ${o.suggestion}`,
      );
      console.error(`        … ${o.snippet} …`);
    }
  }
  console.error(
    `\nEl idioma del sitio es portugués europeo (pt-PT). Si una forma legítima ` +
      `(p. ej. una cita literal) tuviera que mantenerse, edita audit-pt-pt.mjs ` +
      `para añadirla al allowlist correspondiente y documenta el motivo.`,
  );
  process.exit(1);
}

console.log(
  `✓ Sin brasileñismos en pt: ${filesToFullScan.length} ficheros + bloques pt de ${PT_BLOCK_FILES.length} fichero(s) multi-locale.`,
);
