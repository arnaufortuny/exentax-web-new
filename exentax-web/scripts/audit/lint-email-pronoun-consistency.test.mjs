#!/usr/bin/env node
/*
 * lint-email-pronoun-consistency.test.mjs
 * ----------------------------------------------------------------------------
 * Unit tests for the calcDrip vs. drip pronoun-consistency guard. Verifies:
 *   - All five scanned languages (fr, de, es, pt, ca) have a pronoun
 *     configuration with both an `informal` and a `formal` set.
 *   - The current per-language email bundles under
 *     `server/email-i18n/<lang>.ts` analyse cleanly (no issues) — so
 *     the lint is green against today's code.
 *   - A fixture reproducing the original Task #40 French drift
 *     (calcDrip in formal "vous", drip in casual "tu") is flagged
 *     with a `register-mismatch` issue.
 *   - A fixture mixing both registers within a single block is
 *     flagged with a `mixed-within-block` issue.
 *   - A clean fixture (both blocks in the same register) passes.
 *   - The `extractBlock` helper correctly brace-balances object
 *     bodies that contain nested arrays and string-quoted braces.
 *
 * Exits 0 on success, 1 on any mismatch so CI fails fast if the
 * guard's analyzer regresses.
 * ----------------------------------------------------------------------------
 */

import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  EMAIL_I18N_DIR,
  LANGUAGES,
  PRONOUN_SETS,
  analyzeBundle,
  extractBlock,
} from "./lint-email-pronoun-consistency.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

let failures = 0;
function pass(msg) {
  console.log(`PASS  ${msg}`);
}
function fail(msg) {
  failures += 1;
  console.error(`FAIL  ${msg}`);
}

// --- 1. Configuration shape ---------------------------------------------
function testConfigShape() {
  for (const lang of LANGUAGES) {
    const sets = PRONOUN_SETS[lang];
    if (!sets || !sets.informal || !sets.formal) {
      fail(`config: language "${lang}" missing informal/formal sets`);
      continue;
    }
    if (!(sets.informal.regex instanceof RegExp) || !(sets.formal.regex instanceof RegExp)) {
      fail(`config: language "${lang}" has non-RegExp pattern`);
      continue;
    }
    if (!sets.informal.label || !sets.formal.label) {
      fail(`config: language "${lang}" missing pronoun labels`);
      continue;
    }
    pass(`config: ${lang} has informal (${sets.informal.label}) and formal (${sets.formal.label}) sets`);
  }
}

// --- 2. Real bundles must pass clean today -----------------------------
function testCurrentBundlesClean() {
  for (const lang of LANGUAGES) {
    const file = join(EMAIL_I18N_DIR, `${lang}.ts`);
    const source = readFileSync(file, "utf8");
    const verdict = analyzeBundle({ lang, source });
    if (verdict.issues.length === 0) {
      pass(
        `live bundle ${lang}.ts: calcDrip=${verdict.blocks.calcDrip.register}, ` +
          `drip=${verdict.blocks.drip.register} (no drift)`,
      );
    } else {
      fail(
        `live bundle ${lang}.ts: expected no issues, got ${verdict.issues.length}\n` +
          verdict.issues.map((i) => `        - [${i.kind}] ${i.message}`).join("\n"),
      );
    }
  }
}

// --- 3. Fixture: original FR drift (vous in calcDrip, tu in drip) -------
const FR_DRIFT_FIXTURE = `
export const frTranslations = {
  calcDrip: {
    ctaBook: "Réservez votre consultation gratuite",
    greeting: (name) => name ? \`Bonjour \${name},\` : "Bonjour,",
    sigClosing: "À bientôt,",
    unsubNote: "Vous recevez ces e-mails parce que vous avez utilisé le calculateur.",
    steps: [
      {
        subject: "Votre estimation",
        paragraphs: [
          "Vous avez vu votre propre simulation il y a deux jours.",
          "Si vous voulez, nous pouvons en parler 30 minutes ensemble.",
          "Votre situation mérite une réponse claire.",
        ],
      },
    ],
  },
  drip: {
    ctaOpenGuide: "Ouvrir mon guide",
    ctaCalculate: "Calculer mes économies",
    ctaBook: "Réserver ma consultation gratuite",
    greeting: (name) => name ? \`Bonjour \${name},\` : "Bonjour,",
    sigClosing: "À bientôt,",
    unsubNote: "Tu as reçu ces emails parce que tu as demandé le guide.",
    steps: [
      {
        subject: "Ton guide est là.",
        paragraphs: [
          "Avant d'ouvrir le guide, je veux être direct avec toi.",
          "Si tu paies des cotisations chaque mois, tu paies trop.",
          "C'est exactement ce que tu vas trouver ici.",
        ],
      },
    ],
  },
};
`;

function testFrenchDriftFixture() {
  const verdict = analyzeBundle({ lang: "fr", source: FR_DRIFT_FIXTURE });
  const mismatch = verdict.issues.find((i) => i.kind === "register-mismatch");
  if (!mismatch) {
    fail(
      `fixture FR drift: expected register-mismatch issue, got ${verdict.issues.length}\n` +
        `        calcDrip=${verdict.blocks.calcDrip.register}, drip=${verdict.blocks.drip.register}`,
    );
    return;
  }
  if (verdict.blocks.calcDrip.register !== "formal") {
    fail(`fixture FR drift: expected calcDrip=formal, got ${verdict.blocks.calcDrip.register}`);
    return;
  }
  if (verdict.blocks.drip.register !== "informal") {
    fail(`fixture FR drift: expected drip=informal, got ${verdict.blocks.drip.register}`);
    return;
  }
  pass("fixture FR drift: caught register-mismatch (calcDrip=formal vs drip=informal)");
}

// --- 4. Fixture: mixed within a single block ---------------------------
const ES_MIXED_FIXTURE = `
export const esTranslations = {
  calcDrip: {
    ctaBook: "Reservar mi asesoría",
    greeting: (name) => "Hola,",
    sigClosing: "Un abrazo,",
    unsubNote: "Recibes estos correos porque hiciste el cálculo.",
    steps: [
      {
        subject: "Tu cálculo",
        paragraphs: [
          "Hace dos días viste tu simulación.",
          "Si usted prefiere, podemos hablar 30 minutos.",
          "La asesoría es de 30 minutos.",
        ],
      },
    ],
  },
  drip: {
    ctaOpenGuide: "Abrir mi guía",
    ctaCalculate: "Calcular mi ahorro",
    ctaBook: "Reservar mi asesoría",
    greeting: (name) => "Hola,",
    sigClosing: "Un abrazo,",
    unsubNote: "Has recibido estos emails porque solicitaste la guía.",
    steps: [
      {
        subject: "Aquí tienes tu guía",
        paragraphs: [
          "Antes de que abras la guía quiero ser directo contigo.",
          "Si tú pagas cuota cada mes, estás pagando de más.",
        ],
      },
    ],
  },
};
`;

function testMixedWithinBlockFixture() {
  const verdict = analyzeBundle({ lang: "es", source: ES_MIXED_FIXTURE });
  const mixed = verdict.issues.find(
    (i) => i.kind === "mixed-within-block" && i.block === "calcDrip",
  );
  if (!mixed) {
    fail(
      `fixture ES mixed: expected mixed-within-block on calcDrip, got\n` +
        `        ${verdict.issues.map((i) => `[${i.kind}] ${i.block ?? ""}`).join(", ") || "(no issues)"}`,
    );
    return;
  }
  pass("fixture ES mixed: caught mixed-within-block on calcDrip (tú + usted together)");
}

// --- 5. Fixture: clean (both blocks informal) → no issues ---------------
const PT_CLEAN_FIXTURE = `
export const ptTranslations = {
  calcDrip: {
    ctaBook: "Marcar a minha assessoria",
    greeting: (name) => "Olá,",
    sigClosing: "Um abraço,",
    unsubNote: "Recebes estes emails porque fizeste o cálculo.",
    steps: [
      {
        subject: "O teu caso",
        paragraphs: [
          "Há dois dias viste a tua simulação.",
          "Se quiseres, podemos parar 30 minutos para vermos isto juntos.",
        ],
      },
    ],
  },
  drip: {
    ctaOpenGuide: "Abrir o meu guia",
    ctaCalculate: "Calcular as minhas poupanças",
    ctaBook: "Marcar a minha assessoria",
    greeting: (name) => "Olá,",
    sigClosing: "Um abraço,",
    unsubNote: "Recebeste estes emails porque pediste o guia.",
    steps: [
      {
        subject: "O teu guia",
        paragraphs: [
          "Antes de abrires o guia quero ser direto contigo.",
          "Se estás a pagar contribuições, estás a pagar a mais.",
        ],
      },
    ],
  },
};
`;

function testCleanFixture() {
  const verdict = analyzeBundle({ lang: "pt", source: PT_CLEAN_FIXTURE });
  if (verdict.issues.length !== 0) {
    fail(
      `fixture PT clean: expected no issues, got ${verdict.issues.length}\n` +
        verdict.issues.map((i) => `        - [${i.kind}] ${i.message}`).join("\n"),
    );
    return;
  }
  if (verdict.blocks.calcDrip.register !== "informal" || verdict.blocks.drip.register !== "informal") {
    fail(
      `fixture PT clean: expected both blocks informal, got ` +
        `calcDrip=${verdict.blocks.calcDrip.register}, drip=${verdict.blocks.drip.register}`,
    );
    return;
  }
  pass("fixture PT clean: both blocks classified as informal, no drift reported");
}

// --- 6. extractBlock helper -------------------------------------------
function testExtractBlock() {
  const sample = `
    other: "ignored",
    calcDrip: {
      a: "value with } inside string",
      b: [
        { c: "more } and { braces" },
      ],
    },
    drip: {
      x: 1,
    },
  `;
  const cd = extractBlock(sample, "calcDrip");
  if (!cd || !cd.startsWith("{") || !cd.endsWith("}")) {
    fail(`extractBlock: failed to balance calcDrip block, got ${cd ? cd.slice(0, 60) : "(null)"}`);
    return;
  }
  if (!cd.includes('"value with } inside string"')) {
    fail(`extractBlock: lost the string with closing brace inside`);
    return;
  }
  if (cd.includes('drip: {')) {
    fail(`extractBlock: bled past calcDrip into the next block`);
    return;
  }
  const dr = extractBlock(sample, "drip");
  if (!dr || !dr.includes("x: 1")) {
    fail(`extractBlock: failed to extract sibling drip block`);
    return;
  }
  pass("extractBlock: balances braces correctly across strings, arrays, and siblings");
}

// --- run ---------------------------------------------------------------
function main() {
  testConfigShape();
  testExtractBlock();
  testCurrentBundlesClean();
  testFrenchDriftFixture();
  testMixedWithinBlockFixture();
  testCleanFixture();

  if (failures > 0) {
    console.error(
      `\n[lint-email-pronoun-consistency.test] FAIL — ${failures} test${failures === 1 ? "" : "s"} failed.`,
    );
    process.exit(1);
  }
  console.log(`\n[lint-email-pronoun-consistency.test] OK — all tests passed.`);
}

main();
