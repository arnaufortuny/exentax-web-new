#!/usr/bin/env node
/**
 * blog-risk-bridge-inject.mjs (Task #34 / LOTE 6b)
 * ----------------------------------------------------------------------------
 * Editorial rule: every blog paragraph that mentions a fine, sanction,
 * account block, audit or inspection MUST be followed (same or next
 * paragraph) by an Exentax-led solution sentence — otherwise the reader
 * leaves afraid instead of wanting the asesoría.
 *
 * This script sweeps the 672-article corpus (112 slugs × 6 idiomas) and
 * appends a localised "En Exentax prevenimos esto haciendo X" bridge
 * sentence to every paragraph block where:
 *   - any line in the block contains a localised risk term, AND
 *   - neither this paragraph block NOR the next contains the literal
 *     word "Exentax", AND
 *   - the paragraph is NOT inside a paired `<!-- exentax:NAME -->` …
 *     `<!-- /exentax:NAME -->` managed block (those are owned by other
 *     scripts and have their own copy contracts).
 *
 * Iteration runs in REVERSE so that when a list-intro paragraph (ends
 * with ":") is followed by a bullet list that itself contains a risk
 * term, the bridge lands inside the bullet block — that satisfies the
 * "same or next paragraph" rule for the intro too without injecting an
 * awkward sentence between intro and list.
 *
 * The bridge is injected at the end of the LAST non-heading line that
 * contains a risk term in that paragraph block. Three rotating variants
 * per locale prevent boilerplate monotony.
 *
 * Modes:
 *   - default            — apply edits + scrub stale bridges, write report
 *   - --dry-run          — only count, don't write files
 *   - --no-scrub         — skip the cleanup pass (advanced)
 *   - --check            — CI gate (Task #35). Implies --dry-run: never
 *                          mutates disk, never writes the report. Scans
 *                          the on-disk corpus, prints any unprotected
 *                          risk paragraph that lacks an adjacent Exentax
 *                          bridge, and exits 1 when ≥1 orphan exists so
 *                          `npm run blog:validate-all` (and therefore
 *                          `npm run check`) breaks before a regressing
 *                          article can ship. Exits 0 when the corpus is
 *                          clean. Catálogo no-narrativo (cross-refs-v1,
 *                          legal-refs-v1) is exempt — same exception the
 *                          coverage table documents in §1/§2 of the
 *                          report.
 *
 * Output:
 *   reports/seo/lote6b-risk-bridge.md — every paragraph touched plus
 *   the bridge sentence added.
 *
 * Idempotent: re-running is a no-op because injected bridges contain
 * the literal word "Exentax".
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
// Test hooks (Task #45): the unit-test suite spins up an isolated
// fixture corpus in a temp dir to exercise --check end-to-end without
// touching the real 672-article tree or its report. These env-var
// overrides default to the production paths so normal runs are
// unchanged.
const CONTENT = process.env.BLOG_RISK_BRIDGE_CONTENT_DIR
  ? path.resolve(process.env.BLOG_RISK_BRIDGE_CONTENT_DIR)
  : path.join(ROOT, "client/src/data/blog-content");
const REPORT_PATH = process.env.BLOG_RISK_BRIDGE_REPORT_PATH
  ? path.resolve(process.env.BLOG_RISK_BRIDGE_REPORT_PATH)
  : path.join(ROOT, "reports/seo/lote6b-risk-bridge.md");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

// Custom Unicode-aware boundaries: JS's `\b` doesn't treat accented
// letters as word characters, so `\bsanció\b` fails to match "sanció ".
// We use lookarounds against any Unicode letter class instead.
const LB = "(?<![\\p{L}\\p{N}_])"; // left boundary
const RB = "(?![\\p{L}\\p{N}_])";  // right boundary
const RISK = {
  es: new RegExp(`${LB}(multa|multas|sanci[oó]n|sanciones|bloqueo|inspecci[oó]n|auditor[ií]a|auditor[ií]as|recargo|recargos)${RB}`, "iu"),
  en: new RegExp(`${LB}(fine|fines|penalty|penalties|account\\s+block|audit|audited|inspection|inspections)${RB}`, "iu"),
  fr: new RegExp(`${LB}(amende|amendes|sanction|sanctions|blocage|inspection|inspections|audit|audits|p[eé]nalit[eé]|p[eé]nalit[eé]s)${RB}`, "iu"),
  de: new RegExp(`${LB}(Strafe|Strafen|Bußgeld|Bußgelder|Sperrung|Sperrungen|Pr[üu]fung|Pr[üu]fungen|Inspektion|Sanktion|Sanktionen)${RB}`, "u"),
  pt: new RegExp(`${LB}(multa|multas|san[cç][aã]o|sanc[oõ]es|bloqueio|inspe[cç][aã]o|auditoria|auditorias)${RB}`, "iu"),
  ca: new RegExp(`${LB}(multa|multes|sanci[oó]|sancions|bloqueig|inspecci[oó]|auditoria|auditories)${RB}`, "iu"),
};

// Active bridge catalog — voz cercana, conversacional, breve (12-22
// palabras). Cada idioma tiene 8 variantes que rotan de forma
// determinista por (archivo, índice de bloque) para que ningún
// artículo lea como un sello copiado. El tono evita jerga corporativa
// ("dossier defensivo", "trazabilidad documental"), prefiere segunda
// persona y no enumera siempre las tres autoridades.
const BRIDGES = {
  es: [
    "Por eso, en Exentax te llevamos el calendario al día: tú dejas de pensar en plazos y nosotros los cerramos antes de que aprieten.",
    "Tranquilo: en Exentax esto es trabajo de cada semana, lo gestionamos antes de que la carta llegue a tu buzón.",
    "Aquí entra Exentax: te presentamos el formulario, archivamos el acuse y, si la administración pregunta, ya tienes la respuesta lista.",
    "En Exentax hemos cerrado a sanción cero clientes que llegaron justo así. Hablar pronto vale oro y te ahorra cinco cifras.",
    "Lo cerramos contigo desde Exentax: una llamada, presentación y archivo, y el riesgo se queda en el papel.",
    "Es el momento de pedir ayuda. En Exentax abrimos el caso, presentamos lo pendiente y respondemos por ti al organismo correspondiente.",
    "Respira: en Exentax esto es rutina, te ponemos al día y la próxima revisión se cierra en una sola vuelta.",
    "Y si te llega un requerimiento, en Exentax mantenemos el dossier preparado para que respondas en horas, no en semanas.",
  ],
  en: [
    "That is exactly why at Exentax we keep your calendar tight — you stop thinking about deadlines and we close them before they ever bite.",
    "Relax: at Exentax this is what we do every week, we close it before the letter ever lands in your inbox.",
    "This is where Exentax steps in: we file the form, archive the receipt and, if the authority asks, your answer is already on the desk.",
    "At Exentax we have closed clients in exactly this spot at zero penalty. Speaking up early pays off — and saves you five figures.",
    "We close it with you from Exentax: one call, the filing goes out, the archive is set, and the risk stays on paper.",
    "Now is the moment to ask for help. At Exentax we open the case, file what is missing and reply to the relevant authority for you.",
    "Breathe: at Exentax this is routine, we bring you up to date and the next review closes in one round, no drama.",
    "And if a notice does land, at Exentax we keep the dossier ready so you reply in hours, not weeks.",
  ],
  fr: [
    "C'est exactement pour cela que chez Exentax on garde votre calendrier carré — vous ne pensez plus aux échéances, on les clôt avant qu'elles ne mordent.",
    "On reste calme : chez Exentax, c'est notre routine de la semaine, on boucle ça avant que la lettre n'arrive dans votre boîte.",
    "C'est là qu'Exentax intervient : on dépose le formulaire, on archive l'accusé et, si l'administration demande, votre réponse est déjà sur le bureau.",
    "Chez Exentax on a clôturé sans pénalité des clients arrivés exactement dans cette situation. Parler tôt, ça paie — et ça vous épargne cinq chiffres.",
    "On le clôt avec vous depuis Exentax : un appel, le dépôt part, l'archive est faite, et le risque reste sur le papier.",
    "C'est le moment de demander de l'aide. Chez Exentax on ouvre le dossier, on dépose ce qui manque et on répond à l'administration pour vous.",
    "Respirez : chez Exentax c'est de la routine, on vous remet à jour et le prochain contrôle se clôt en un tour, sans drame.",
    "Et si un avis tombe, chez Exentax on garde le dossier prêt pour que vous répondiez en heures, pas en semaines.",
  ],
  de: [
    "Genau deshalb halten wir bei Exentax Ihren Kalender bündig — Sie müssen nicht mehr an Fristen denken, wir schließen sie ab, bevor sie zubeißen.",
    "Bleiben Sie ruhig: bei Exentax ist das unser Wochengeschäft, wir schließen es ab, bevor der Brief in Ihrem Postfach landet.",
    "Hier kommt Exentax ins Spiel: wir reichen das Formular ein, archivieren den Beleg und, wenn die Behörde fragt, liegt Ihre Antwort bereits fertig.",
    "Bei Exentax haben wir Mandanten in genau dieser Lage ohne Strafe geschlossen. Früh sprechen lohnt sich — und spart Ihnen fünf Stellen.",
    "Wir schließen es mit Ihnen von Exentax aus: ein Anruf, Einreichung raus, Archiv gesetzt, und das Risiko bleibt auf dem Papier.",
    "Jetzt ist der Moment, Hilfe zu holen. Bei Exentax eröffnen wir den Fall, reichen das Fehlende ein und antworten der Behörde für Sie.",
    "Atmen Sie durch: bei Exentax ist das Routine, wir bringen Sie auf den Stand und die nächste Prüfung schließt in einer Runde, ohne Drama.",
    "Und falls doch eine Aufforderung kommt: bei Exentax liegt das Dossier bereit, Sie antworten in Stunden, nicht in Wochen.",
  ],
  pt: [
    "É por isso que na Exentax mantemos o teu calendário em ordem — tu deixas de pensar em prazos e nós fechamo-los antes que mordam.",
    "Tranquilo: na Exentax isto é a nossa rotina semanal, fechamos antes de a carta chegar à tua caixa de correio.",
    "É aqui que entra a Exentax: apresentamos o formulário, arquivamos o comprovativo e, se a administração perguntar, a resposta já está pronta.",
    "Na Exentax fechámos sem sanção clientes exatamente nesta situação. Falar cedo compensa — e poupa-te cinco dígitos.",
    "Fechamos isto contigo a partir da Exentax: uma chamada, submissão feita, arquivo pronto, o risco fica no papel.",
    "É o momento de pedir ajuda. Na Exentax abrimos o caso, submetemos o que falta e respondemos à administração por ti.",
    "Respira: na Exentax isto é rotina, pomos-te em dia e a próxima revisão fecha-se numa volta, sem sobressaltos.",
    "E se chegar uma notificação, na Exentax mantemos o dossiê pronto para responderes em horas, não em semanas.",
  ],
  ca: [
    "Per això, a Exentax et portem el calendari al dia — tu deixes de pensar en terminis i nosaltres els tanquem abans que mosseguin.",
    "Tranquil: a Exentax això és la nostra rutina setmanal, ho tanquem abans que la carta arribi a la teva bústia.",
    "Aquí entra Exentax: presentem el formulari, arxivem l'acús i, si l'administració pregunta, la resposta ja està llesta.",
    "A Exentax hem tancat sense sanció clients exactament en aquesta situació. Parlar aviat val or — i t'estalvia cinc xifres.",
    "Ho tanquem amb tu des d'Exentax: una trucada, presentació feta, arxiu llest, i el risc es queda al paper.",
    "És el moment de demanar ajuda. A Exentax obrim el cas, presentem el que falta i responem a l'administració per tu.",
    "Respira: a Exentax això és rutina, et posem al dia i la propera revisió es tanca en una volta, sense sotracs.",
    "I si arriba un requeriment, a Exentax mantenim el dossier preparat perquè responguis en hores, no en setmanes.",
  ],
};

// Legacy bridge catalog — the v1 sentences (3 per language) that the
// previous sweep installed. The migration pass detects these in the
// corpus and replaces each with a fresh variant from the active
// catalog above (deterministic by file+blockIndex). Kept here so the
// migration is reproducible and the sweep stays idempotent: a second
// run finds zero LEGACY hits and does nothing.
const LEGACY_BRIDGES = {
  es: [
    "En Exentax prevenimos esto presentando cada formulario en plazo y guardando el acuse del IRS, FinCEN y la AEAT para que el riesgo no llegue a materializarse.",
    "En Exentax evitamos esta sanción manteniendo el calendario fiscal al día y resolviendo cualquier incidencia con el IRS, FinCEN o tu administración antes de que escale.",
    "En Exentax cubrimos este punto con un dossier defensivo: trazabilidad documental completa y respuestas listas si llega un requerimiento o una inspección.",
    // v2.0 hotfix: removed "sustos" (caught by content-lint
    // fear-of-Hacienda emotional list) and replaced the odd
    // "vuele el avión" metaphor with "antes de que aprieten"
    // (parallel to the EN/FR/DE/PT/CA "before they bite" idiom).
    "Por eso, en Exentax te llevamos el calendario al día: tú dejas de pensar en plazos y nosotros lo cerramos antes de que vuele el avión.",
    "Respira: en Exentax esto es rutina, te ponemos al día y la próxima revisión se cierra en una vuelta sin sustos.",
  ],
  en: [
    "At Exentax we prevent this by filing every form on time and keeping IRS, FinCEN and local-tax-authority receipts on record so the risk never materialises.",
    "At Exentax we head off this penalty by keeping your tax calendar current and resolving any IRS, FinCEN or local-authority issue before it escalates.",
    "At Exentax we cover this with a defensive dossier: full document trail and ready-to-send answers if a notice or audit lands.",
  ],
  fr: [
    "Chez Exentax, nous prévenons cela en déposant chaque formulaire dans les délais et en conservant les accusés de l'IRS, du FinCEN et de votre administration pour que le risque ne se concrétise pas.",
    "Chez Exentax, nous évitons cette sanction en tenant votre calendrier fiscal à jour et en réglant tout incident avec l'IRS, le FinCEN ou votre administration avant qu'il ne s'aggrave.",
    "Chez Exentax, nous couvrons ce point avec un dossier défensif : traçabilité documentaire complète et réponses prêtes si une notification ou un contrôle arrive.",
    // v2.0 hotfix: replaced "Pas de panique" — the word "panique"
    // is on the fear-of-Hacienda emotional forbidden list — with
    // "On reste calme", same warm reassurance, lint-clean.
    "Pas de panique : chez Exentax, c'est notre routine de la semaine, on boucle ça avant que la lettre n'arrive dans ta boîte.",
    // v2.1 register migration: the v2 catalog used informal tu/ta/ton/te;
    // strict translation-quality lint requires formal vous/votre. The
    // original 8 v2 variants are kept here so the migration sweep
    // detects them in the corpus and replaces each with the formal
    // counterpart from the active catalog (same hash slot).
    "C'est exactement pour cela que chez Exentax on garde ton calendrier carré — tu ne penses plus aux échéances, on les clôt avant qu'elles ne mordent.",
    "On reste calme : chez Exentax, c'est notre routine de la semaine, on boucle ça avant que la lettre n'arrive dans ta boîte.",
    "C'est là qu'Exentax intervient : on dépose le formulaire, on archive l'accusé et, si l'administration demande, ta réponse est déjà sur le bureau.",
    "Chez Exentax on a clôturé sans pénalité des clients arrivés exactement dans cette situation. Parler tôt, ça paie — et ça t'épargne cinq chiffres.",
    "On le clôt avec toi depuis Exentax : un appel, le dépôt part, l'archive est faite, et le risque reste sur le papier.",
    "C'est le moment de demander de l'aide. Chez Exentax on ouvre le dossier, on dépose ce qui manque et on répond à l'administration pour toi.",
    "Respire : chez Exentax c'est de la routine, on te remet à jour et le prochain contrôle se clôt en un tour, sans drame.",
    "Et si un avis tombe, chez Exentax on garde le dossier prêt pour que tu répondes en heures, pas en semaines.",
  ],
  de: [
    "Bei Exentax verhindern wir das, indem wir jedes Formular fristgerecht einreichen und Belege von IRS, FinCEN und deiner lokalen Steuerbehörde aufbewahren, damit das Risiko gar nicht erst eintritt.",
    "Bei Exentax vermeiden wir diese Strafe, indem wir deinen Steuerkalender aktuell halten und jeden Vorfall mit IRS, FinCEN oder deiner Behörde regeln, bevor er eskaliert.",
    "Bei Exentax decken wir diesen Punkt mit einem Verteidigungsdossier ab: vollständige Dokumentation und vorbereitete Antworten, falls eine Aufforderung oder Prüfung eingeht.",
    // v2.1 register migration: the v2 catalog used informal du/dein/dir/dich;
    // strict translation-quality lint requires formal Sie/Ihr. The
    // original 8 v2 variants are kept here so the migration sweep
    // detects them in the corpus and replaces each with the formal
    // counterpart from the active catalog (same hash slot).
    "Genau deshalb halten wir bei Exentax deinen Kalender bündig — du musst nicht mehr an Fristen denken, wir schließen sie ab, bevor sie zubeißen.",
    "Bleib ruhig: bei Exentax ist das unser Wochengeschäft, wir schließen es ab, bevor der Brief in deinem Postfach landet.",
    "Hier kommt Exentax ins Spiel: wir reichen das Formular ein, archivieren den Beleg und, wenn die Behörde fragt, liegt deine Antwort bereits fertig.",
    "Bei Exentax haben wir Mandanten in genau dieser Lage ohne Strafe geschlossen. Früh sprechen lohnt sich — und spart dir fünf Stellen.",
    "Wir schließen es mit dir von Exentax aus: ein Anruf, Einreichung raus, Archiv gesetzt, und das Risiko bleibt auf dem Papier.",
    "Jetzt ist der Moment, Hilfe zu holen. Bei Exentax eröffnen wir den Fall, reichen das Fehlende ein und antworten der Behörde für dich.",
    "Atme durch: bei Exentax ist das Routine, wir bringen dich auf den Stand und die nächste Prüfung schließt in einer Runde, ohne Drama.",
    "Und falls doch eine Aufforderung kommt: bei Exentax liegt das Dossier bereit, du antwortest in Stunden, nicht in Wochen.",
  ],
  pt: [
    "Na Exentax prevenimos isto apresentando cada formulário no prazo e guardando o comprovativo do IRS, do FinCEN e da tua administração para que o risco não se materialize.",
    "Na Exentax evitamos esta sanção mantendo o calendário fiscal em dia e resolvendo qualquer incidente com o IRS, o FinCEN ou a tua administração antes que escale.",
    "Na Exentax cobrimos este ponto com um dossiê defensivo: rastreabilidade documental completa e respostas prontas se chegar uma notificação ou inspeção.",
  ],
  ca: [
    "A Exentax prevenim això presentant cada formulari dins de termini i conservant l'acús de l'IRS, FinCEN i la teva administració perquè el risc no arribi a materialitzar-se.",
    "A Exentax evitem aquesta sanció mantenint el calendari fiscal al dia i resolent qualsevol incidència amb l'IRS, FinCEN o la teva administració abans que escali.",
    "A Exentax cobrim aquest punt amb un dossier defensiu: traçabilitat documental completa i respostes preparades si arriba un requeriment o una inspecció.",
  ],
};

const HEADING_RE = /^\s*#{1,6}\s/;
const HTML_COMMENT_ONLY_RE = /^\s*<!--[\s\S]*-->\s*$/;
const TERMINAL_PUNCT_RE = /[.!?…)\]\*_>"'»:;]$/;

const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");
// --check is a CI gate (Task #35): it must never mutate disk and must
// never write the report. We force DRY to true whenever --check is set
// so every existing dry-run guard (`if (!DRY) fs.writeFileSync(...)`)
// keeps the corpus untouched in CI.
const DRY = args.has("--dry-run") || CHECK;
const NO_SCRUB = args.has("--no-scrub");

// Deterministic 32-bit string hash (FNV-1a inspired) so that the
// bridge variant chosen for a given paragraph is stable across reruns
// without depending on iteration order. Re-running the sweep yields
// the exact same selection per (file, blockIndex).
function hashSeed(key) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function pickBridgeForKey(lang, key) {
  const arr = BRIDGES[lang];
  return arr[hashSeed(key) % arr.length];
}

// Back-compat helper: integer-seed picker (still used by callers that
// pass a small integer counter; a key-based picker is preferred).
function pickBridge(lang, seed) {
  const arr = BRIDGES[lang];
  return arr[seed % arr.length];
}

function isHeadingLine(line) {
  return HEADING_RE.test(line);
}

/**
 * Compute which paragraph blocks are inside a paired
 * `<!-- exentax:NAME -->` … `<!-- /exentax:NAME -->` managed range.
 * Open markers without a matching close are treated as inline single-line
 * annotations (they only protect their own block, not downstream content)
 * — matches the convention documented in
 * `scripts/blog/blog-cta-position-audit.mjs` for legal-refs-v1 et al.
 */
// Block names that are pure link/data catalogs (not narrative prose).
// We do NOT inject narrative bridge sentences inside them — adding prose
// to a list of `- [link](...)` items breaks the list semantics. The
// risk words inside those blocks are page titles in cross-reference
// links or statutory citations in a legal-refs list, not editorial
// statements that need a "how Exentax helps" follow-up.
const NON_NARRATIVE_BLOCK_NAMES = new Set(["cross-refs-v1", "legal-refs-v1"]);

function computeProtectedSet(blocks) {
  const openIndices = []; // stack of { name, blockIdx }
  const pairedRanges = []; // [openIdx, closeIdx, name]
  const annotationBlocks = new Map(); // blockIdx → marker name

  // Marker names can include colons, e.g. `lote19-native-v1:slug-en`.
  const openRe = /<!--\s*exentax:([\w:-]+)\s*-->/g;
  const closeRe = /<!--\s*\/exentax:([\w:-]+)\s*-->/g;

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const events = [];
    let m;
    openRe.lastIndex = 0;
    while ((m = openRe.exec(b)) !== null) {
      events.push({ kind: "open", name: m[1], pos: m.index });
    }
    closeRe.lastIndex = 0;
    while ((m = closeRe.exec(b)) !== null) {
      events.push({ kind: "close", name: m[1], pos: m.index });
    }
    events.sort((a, z) => a.pos - z.pos);
    for (const ev of events) {
      if (ev.kind === "open") {
        openIndices.push({ name: ev.name, blockIdx: i });
      } else {
        // pop nearest matching open
        let found = -1;
        for (let k = openIndices.length - 1; k >= 0; k--) {
          if (openIndices[k].name === ev.name) { found = k; break; }
        }
        if (found >= 0) {
          const open = openIndices[found];
          openIndices.splice(found, 1);
          pairedRanges.push([open.blockIdx, i, open.name]);
        } else {
          annotationBlocks.set(i, ev.name);
        }
      }
    }
  }
  // Anything still open is an annotation-only marker
  for (const o of openIndices) annotationBlocks.set(o.blockIdx, o.name);

  const protectedSet = new Set();
  const blockToName = new Map(); // blockIdx → innermost marker name
  for (const [a, b, name] of pairedRanges) {
    for (let k = a; k <= b; k++) {
      protectedSet.add(k);
      blockToName.set(k, name);
    }
  }
  for (const [k, name] of annotationBlocks) {
    protectedSet.add(k);
    if (!blockToName.has(k)) blockToName.set(k, name);
  }
  // Backwards-compat: callers that destructure with `.has` keep working
  // because we attach the name map as a property on the Set.
  protectedSet.blockToName = blockToName;
  return protectedSet;
}

// True if a block sits inside a managed range whose marker name is in
// the non-narrative skip list (cross-refs-v1, legal-refs-v1).
function isNonNarrativeManaged(protectedSet, idx) {
  const name = protectedSet.blockToName?.get(idx);
  return name ? NON_NARRATIVE_BLOCK_NAMES.has(name) : false;
}

function appendBridgeToLine(line, bridge) {
  const trimmed = line.replace(/\s+$/, "");
  if (/Exentax/.test(trimmed)) return line;
  // Lines that end with ':' are list-intros. Reverse iteration usually
  // bridges the following bullet list first (so the rule holds via
  // "next paragraph contains Exentax" and we never reach this case).
  // When we DO reach it (no eligible next paragraph), convert the
  // colon to a period so "intro. <bridge>" reads naturally instead of
  // "intro: <bridge>" which dangles a list expectation.
  if (/:$/.test(trimmed)) {
    return `${trimmed.slice(0, -1)}. ${bridge}`;
  }
  let ending = "";
  if (!TERMINAL_PUNCT_RE.test(trimmed)) ending = ".";
  return `${trimmed}${ending} ${bridge}`;
}

function processFile(filePath, lang) {
  const raw = fs.readFileSync(filePath, "utf8");
  const m = raw.match(/^(export default `\n?)([\s\S]*)(`\s*;?\s*)$/);
  if (!m) return { changes: [], scrubbed: 0, modifiedRaw: raw, changed: false };

  const prefix = m[1];
  let body = m[2];
  const suffix = m[3];

  let blocks = body.split(/\n{2,}/);
  let scrubbed = 0;
  let migrated = 0;
  const fileKey = path.basename(filePath, ".ts");

  // ── Migration pass: rewrite v1 (LEGACY) bridge sentences as fresh
  // variants from the active BRIDGES catalog. The replacement is
  // deterministic by (filename, blockIndex, lineIndex) so re-runs are
  // stable and the sweep stays idempotent (a second run finds zero
  // LEGACY hits and does nothing). The non-narrative scrub below
  // recognizes the legacy catalog too, so legacy bridges that ended up
  // inside cross-refs/legal-refs blocks get stripped instead of
  // rewritten.
  if (!NO_SCRUB) {
    const protectedSetMig = computeProtectedSet(blocks);
    const legacy = LEGACY_BRIDGES[lang];
    if (legacy && legacy.length) {
      for (let k = 0; k < blocks.length; k++) {
        if (isNonNarrativeManaged(protectedSetMig, k)) continue;
        const lines = blocks[k].split("\n");
        let changed = false;
        for (let li = 0; li < lines.length; li++) {
          for (const oldBr of legacy) {
            if (lines[li].includes(oldBr)) {
              const newBr = pickBridgeForKey(lang, `${fileKey}:${k}:${li}`);
              lines[li] = lines[li].split(oldBr).join(newBr);
              migrated++;
              changed = true;
              // Continue scanning this line in case another legacy
              // string appears (rare, but safe).
            }
          }
        }
        if (changed) blocks[k] = lines.join("\n");
      }
    }
  }

  // ── Scrub pass: remove any previously-injected bridge from blocks
  // that are inside non-narrative managed ranges (cross-refs-v1,
  // legal-refs-v1). Other managed blocks (cta-v1, execution-v2,
  // defensa-fiscal-v1, calendario-2026-v1, lote*-native-v1, etc.) are
  // narrative prose and ARE eligible for the risk-bridge sentence — we
  // keep their bridges intact so the editorial rule holds inside them
  // too.
  if (!NO_SCRUB) {
    const protectedSet = computeProtectedSet(blocks);
    // Scrub recognizes BOTH the active and legacy catalogs so any
    // pre-migration bridges sitting inside non-narrative blocks are
    // stripped cleanly (defense in depth: migration skips those
    // blocks intentionally).
    const allBridges = [...BRIDGES[lang], ...LEGACY_BRIDGES[lang]];
    for (const k of protectedSet) {
      if (!isNonNarrativeManaged(protectedSet, k)) continue;
      const lines = blocks[k].split("\n");
      let changed = false;
      for (let li = 0; li < lines.length; li++) {
        for (const br of allBridges) {
          const sfx = " " + br;
          if (lines[li].endsWith(sfx)) {
            let stripped = lines[li].slice(0, lines[li].length - sfx.length);
            const tail = stripped.slice(-2);
            if (tail === ":." || tail === ";.") {
              stripped = stripped.slice(0, -1);
            }
            lines[li] = stripped;
            scrubbed++;
            changed = true;
            break;
          }
        }
      }
      if (changed) blocks[k] = lines.join("\n");
    }
    // Also fix the standalone "X:." bug in narrative blocks left
    // behind by the v1 of this script (defensive idempotence).
    for (let k = 0; k < blocks.length; k++) {
      if (isNonNarrativeManaged(protectedSet, k)) continue;
      const lines = blocks[k].split("\n");
      let changed = false;
      for (let li = 0; li < lines.length; li++) {
        const allBridgesAny = BRIDGES[lang];
        for (const br of allBridgesAny) {
          const bad = ":. " + br;
          if (lines[li].includes(bad)) {
            lines[li] = lines[li].replace(bad, ": " + br);
            scrubbed++;
            changed = true;
            break;
          }
        }
      }
      if (changed) blocks[k] = lines.join("\n");
    }
    // Remove redundant intro-line bridges: when v1 added a bridge
    // straight after a list-intro `:` AND the bullet list that follows
    // already carries its own Exentax bridge, the intro line's bridge
    // is unnecessary noise — strip it. The rule "next paragraph has
    // Exentax" still holds via the bullet list.
    for (let k = 0; k < blocks.length - 1; k++) {
      if (isNonNarrativeManaged(protectedSet, k)) continue;
      const next = blocks[k + 1];
      if (!/Exentax/.test(next)) continue;
      const lines = blocks[k].split("\n");
      let changed = false;
      for (let li = 0; li < lines.length; li++) {
        for (const br of BRIDGES[lang]) {
          const sfx = ": " + br;
          if (lines[li].endsWith(sfx)) {
            // Strip " " + bridge, keep the colon.
            lines[li] = lines[li].slice(0, lines[li].length - (" " + br).length);
            scrubbed++;
            changed = true;
            break;
          }
        }
      }
      if (changed) blocks[k] = lines.join("\n");
    }
    // Convert cosmetically-awkward "intro: <bridge>" cases (when the
    // next paragraph does NOT carry Exentax, so the bridge is genuinely
    // needed) into "intro. <bridge>". The colon was originally an
    // expectation-of-list signal; with the bridge sentence in place,
    // a period reads cleaner.
    for (let k = 0; k < blocks.length; k++) {
      if (isNonNarrativeManaged(protectedSet, k)) continue;
      const next = blocks[k + 1] || "";
      if (/Exentax/.test(next)) continue; // handled by previous scrub
      const lines = blocks[k].split("\n");
      let changed = false;
      for (let li = 0; li < lines.length; li++) {
        for (const br of BRIDGES[lang]) {
          const sfx = ": " + br;
          if (lines[li].endsWith(sfx)) {
            // Replace ": <bridge>" with ". <bridge>".
            lines[li] = lines[li].slice(0, lines[li].length - sfx.length) + ". " + br;
            scrubbed++;
            changed = true;
            break;
          }
        }
      }
      if (changed) blocks[k] = lines.join("\n");
    }
  }

  // ── Inject pass: walk blocks in REVERSE order so that bridging the
  // bullet-list paragraph (which usually carries the risk term too)
  // also satisfies the rule for the intro paragraph that ends with ":".
  const protectedSet = computeProtectedSet(blocks);
  const re = RISK[lang];
  const changes = [];

  for (let i = blocks.length - 1; i >= 0; i--) {
    // Skip ONLY non-narrative managed blocks (cross-refs-v1,
    // legal-refs-v1) — link/data catalogs where injecting prose breaks
    // list semantics. All other managed blocks (cta-v1, execution-v2,
    // defensa-fiscal-v1, calendario-2026-v1, lote*-native-v1, etc.) are
    // narrative prose and ARE eligible for bridge injection: the
    // editorial rule "every risk paragraph followed by an Exentax-led
    // solution" applies inside them too.
    if (isNonNarrativeManaged(protectedSet, i)) continue;
    const block = blocks[i];
    if (HTML_COMMENT_ONLY_RE.test(block)) continue;
    if (!re.test(block)) continue;
    if (/Exentax/.test(block)) continue;
    const next = blocks[i + 1] || "";
    if (/Exentax/.test(next)) continue;
    // Don't insert a bridge as a new paragraph inside a managed range
    // if doing so would land AFTER the closing marker — instead insert
    // BEFORE the closing marker. We detect this case by checking
    // whether the next block is a closing marker for the same range.
    // (Handled below via splice; we just need to make sure we never
    // accidentally land outside a paired range.)

    const lines = block.split("\n");

    // Heuristic: a "heading line" with multiple sentences or a long body
    // is actually heading+content concatenated on a single line — treat
    // it as a content line eligible for bridge injection.
    const isPureHeading = (line) => {
      if (!isHeadingLine(line)) return false;
      const body = line.replace(/^\s*#{1,6}\s+/, "");
      const sentenceMarks = (body.match(/[.!?]/g) || []).length;
      return sentenceMarks <= 1 && body.length <= 120;
    };

    let targetIdx = -1;
    for (let j = lines.length - 1; j >= 0; j--) {
      if (isPureHeading(lines[j])) continue;
      if (re.test(lines[j])) { targetIdx = j; break; }
    }
    const bridge = pickBridgeForKey(lang, `${fileKey}:${i}:inject`);

    if (targetIdx < 0) {
      // Risk word lives only in a pure heading line. Inject the bridge
      // as a brand-new paragraph block right after this one so the
      // "next paragraph contains Exentax" rule is satisfied without
      // mangling the heading.
      blocks.splice(i + 1, 0, bridge);
      changes.push({
        blockIndex: i,
        bridge,
        riskExcerpt: "(heading-only risk; bridge inserted as new paragraph)",
      });
      continue;
    }

    const newLine = appendBridgeToLine(lines[targetIdx], bridge);
    if (newLine === lines[targetIdx]) continue;
    const oldExcerpt = lines[targetIdx].slice(0, 200);
    lines[targetIdx] = newLine;
    blocks[i] = lines.join("\n");
    changes.push({ blockIndex: i, bridge, riskExcerpt: oldExcerpt });
  }

  changes.reverse(); // restore source order for reporting

  const newBody = blocks.join("\n\n");
  const modifiedRaw = `${prefix}${newBody}${suffix}`;
  return { changes, scrubbed, migrated, modifiedRaw, changed: modifiedRaw !== raw };
}

function main() {
  const fileResults = [];
  let totalChanges = 0;
  let totalScrubbed = 0;
  let totalMigrated = 0;
  // Risk-paragraph counter is computed exclusively from the
  // post-write disk truth using the SAME filter the coverage table
  // applies (RISK regex matches AND not a pure heading AND not an
  // HTML-comment-only block). Keeping a single source of truth avoids
  // confusing reviewers with two diverging denominators.
  let totalRiskParas = 0;

  // Per-language coverage stats computed AFTER any in-pass changes.
  const coverage = {};
  for (const lang of LANGS) coverage[lang] = { risk: 0, bridged: 0, orphan: 0, orphanInNonNarrative: 0 };

  // Cumulative per-file bridge inventory (from disk truth post-write):
  // every paragraph in the corpus that currently carries one of the
  // canonical Exentax bridge sentences from BRIDGES[lang]. This survives
  // idempotent runs and gives reviewers a truthful per-file picture of
  // editorial coverage even when a re-run injects 0 new bridges.
  const bridgeInventory = []; // { lang, file, blockIndex, bridge, riskExcerpt }
  // List of orphan paragraphs (rule violations) with file location.
  const orphans = []; // { lang, file, blockIndex, kind, excerpt }

  for (const lang of LANGS) {
    const dir = path.join(CONTENT, lang);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts")).sort();
    for (const f of files) {
      const fp = path.join(dir, f);
      const raw = fs.readFileSync(fp, "utf8");
      const { changes, scrubbed, migrated, modifiedRaw, changed } = processFile(fp, lang);
      if (changed && !DRY) fs.writeFileSync(fp, modifiedRaw);
      totalChanges += changes.length;
      totalScrubbed += scrubbed;
      totalMigrated += migrated;
      if (changes.length > 0 || scrubbed > 0 || migrated > 0) {
        fileResults.push({ lang, file: f, changes, scrubbed, migrated });
      }

      // Re-scan post-write to compute coverage from the on-disk truth.
      const finalRaw = changed && !DRY ? modifiedRaw : raw;
      const finalBodyMatch = finalRaw.match(/^export default `\n?([\s\S]*)`\s*;?\s*$/);
      const finalBody = finalBodyMatch ? finalBodyMatch[1] : finalRaw;
      const finalBlocks = finalBody.split(/\n{2,}/);
      const finalProt = computeProtectedSet(finalBlocks);
      // Coverage check (per editorial rule). This SAME filter feeds
      // the executive `totalRiskParas` counter so the report shows a
      // single, consistent denominator everywhere.
      for (let i = 0; i < finalBlocks.length; i++) {
        const blk = finalBlocks[i];
        if (!RISK[lang].test(blk)) continue;
        if (HEADING_RE.test(blk)) continue;
        if (HTML_COMMENT_ONLY_RE.test(blk)) continue;
        coverage[lang].risk++;
        totalRiskParas++;
        const next = finalBlocks[i + 1] || "";
        if (/Exentax/.test(blk) || /Exentax/.test(next)) {
          coverage[lang].bridged++;
        } else if (isNonNarrativeManaged(finalProt, i)) {
          // cross-refs-v1 / legal-refs-v1: link/data catalogs where
          // injecting prose would break list semantics. Counted as a
          // documented exception, not as a sweep failure.
          coverage[lang].orphanInNonNarrative++;
        } else {
          coverage[lang].orphan++;
          orphans.push({
            lang,
            file: f,
            blockIndex: i,
            kind: finalProt.has(i) ? `managed:${finalProt.blockToName.get(i)}` : "free",
            excerpt: blk.replace(/\s+/g, " ").slice(0, 180),
          });
        }
      }
      // Bridge inventory: scan every paragraph for any bridge sentence.
      const allBridges = BRIDGES[lang];
      for (let i = 0; i < finalBlocks.length; i++) {
        const blk = finalBlocks[i];
        for (const br of allBridges) {
          if (blk.includes(br)) {
            // Find the line carrying the bridge for context.
            const lines = blk.split("\n");
            let riskLine = "";
            for (let j = lines.length - 1; j >= 0; j--) {
              if (lines[j].includes(br)) {
                riskLine = lines[j].slice(0, lines[j].indexOf(br)).trim();
                break;
              }
            }
            bridgeInventory.push({
              lang,
              file: f,
              blockIndex: i,
              bridge: br,
              riskExcerpt: riskLine.slice(-180),
            });
            break; // count one bridge per block max
          }
        }
      }
    }
  }

  const lines = [];
  lines.push("# LOTE 6b — Risk-bridge sweep (Task #34)\n");
  lines.push(`Generated: ${new Date().toISOString()}\n`);
  lines.push(
    "Editorial rule: every paragraph that mentions a fine, sanction, account block, audit " +
      "or inspection must be followed within the same or next paragraph by an Exentax-led " +
      "solution sentence so the reader leaves wanting the asesoría, not afraid.\n"
  );
  lines.push("## 1. Resumen ejecutivo\n");
  lines.push(`- Idiomas escaneados: ${LANGS.length} (${LANGS.join(", ")}).`);
  lines.push(`- Artículos escaneados: 672 (112 slugs × 6 idiomas).`);
  lines.push(`- Términos de riesgo (es): multa, sanción, bloqueo, inspección, auditoría, recargo.`);
  lines.push(`- Términos de riesgo equivalentes en en/fr/de/pt/ca cubiertos por el script.`);
  lines.push(`- Párrafos de riesgo detectados (estado actual, mismo filtro que la tabla de cobertura: RISK regex ∧ no-heading ∧ no-comment-only): **${totalRiskParas}**.`);
  lines.push(`- Bridges Exentax inyectados en esta pasada: **${totalChanges}**.`);
  lines.push(`- Bridges v1 reescritos a tono cercano (migración v2): **${totalMigrated}**.`);
  lines.push(`- Bridges previos eliminados de zonas protegidas (scrub): **${totalScrubbed}**.`);
  lines.push(`- Archivos tocados: **${fileResults.length}**.`);
  lines.push(`- Modo: ${DRY ? "dry-run (no se escriben archivos)" : "apply"}.\n`);
  lines.push("### Cobertura por idioma (estado final en disco)\n");
  lines.push("| Idioma | Párrafos de riesgo | Bridged adyacente | Catálogo no-narrativo | Huérfanos |");
  lines.push("|---|---:|---:|---:|---:|");
  let covRisk = 0, covBridged = 0, covOrphan = 0, covNonNarr = 0;
  for (const lang of LANGS) {
    const c = coverage[lang];
    covRisk += c.risk; covBridged += c.bridged; covOrphan += c.orphan; covNonNarr += c.orphanInNonNarrative;
    const pct = c.risk === 0 ? "100%" : `${((c.bridged / c.risk) * 100).toFixed(1)}%`;
    lines.push(`| ${lang} | ${c.risk} | ${c.bridged} (${pct}) | ${c.orphanInNonNarrative} | ${c.orphan} |`);
  }
  const totalPct = covRisk === 0 ? "100%" : `${((covBridged / covRisk) * 100).toFixed(1)}%`;
  lines.push(`| **Total** | **${covRisk}** | **${covBridged} (${totalPct})** | **${covNonNarr}** | **${covOrphan}** |\n`);
  lines.push(
    "- **Bridged adyacente** = el párrafo de riesgo o su inmediato siguiente contiene `Exentax` " +
    "(regla editorial cumplida).\n" +
    "- **Catálogo no-narrativo** = el párrafo está dentro de `cross-refs-v1` o `legal-refs-v1` " +
    "(listas de enlaces internos / referencias legales). Inyectar prosa narrativa rompería la " +
    "semántica de lista, por lo que el sweep deja estos catálogos intactos. Excepción " +
    "documentada: las menciones de riesgo aquí son títulos de páginas enlazadas o citas " +
    "estatutarias, no afirmaciones editoriales que requieran el follow-up Exentax.\n" +
    "- **Huérfanos** = párrafos de riesgo sin Exentax en el mismo o siguiente bloque, en " +
    "cualquier otro contexto (prosa libre, cta-v1, execution-v2, defensa-fiscal-v1, " +
    "calendario-2026-v1, lote*-native-v1, etc.). Objetivo: **0**.\n"
  );
  lines.push("## 2. Política de bridge\n");
  lines.push(
    "El bridge se inyecta como nueva oración dentro del mismo párrafo que menciona el riesgo, " +
      "appendido a la última línea no-heading con término de riesgo. Si el párrafo de riesgo es " +
      "una heading-only, se inserta un párrafo nuevo justo después con el bridge. La sweep " +
      "recorre los bloques en orden inverso: cuando una intro termina en `:` y la lista " +
      "siguiente contiene riesgo, el bridge cae en la lista y la intro queda cubierta vía la " +
      "regla ‘mismo o siguiente párrafo’. **Voz humana cercana**: el catálogo activo (v2) " +
      "tiene **8 variantes por idioma** con tono conversacional, breve (12-22 palabras) y en " +
      "segunda persona — frases como ‘Tranquilo: en Exentax esto es trabajo de cada semana’, " +
      "‘Respira: a Exentax això és rutina’, ‘Now is the moment to ask for help’ — sustituyen " +
      "al boilerplate v1 (3 variantes largas con jerga). La elección de variante por párrafo " +
      "es determinista por hash `(archivo, índice de bloque)`, así un mismo artículo presenta " +
      "varias formulaciones distintas pero estables entre re-ejecuciones. La sweep es " +
      "idempotente: una segunda ejecución detecta que la promesa Exentax ya está adyacente y " +
      "no añade nada; las variantes v1 (LEGACY) se reescriben en una pasada de migración y " +
      "tras esa pasada el corpus solo contiene v2.\n\n" +
      "**Aplicación universal**: el sweep inyecta también dentro de bloques gestionados " +
      "narrativos (cta-v1, calc-cta-v1, execution-v2, defensa-fiscal-v1, cta-conv-v1, " +
      "conv-fill-v1, calendario-2026-v1, recursos-2026-v1, lote*-native-v1) — cualquier párrafo " +
      "con vocabulario de riesgo recibe su bridge Exentax independientemente de en qué bloque " +
      "viva. Las DOS únicas excepciones son `cross-refs-v1` y `legal-refs-v1`, listas de " +
      "enlaces / citas legales donde la prosa narrativa no encaja sintácticamente. " +
      "**Trade-off conocido**: si los scripts que regeneran las plantillas de los bloques " +
      "gestionados se vuelven a ejecutar, podrían sobrescribir bridges. La mitigación es " +
      "re-ejecutar este sweep tras cualquier cambio de plantilla — la idempotencia garantiza " +
      "que no duplica nada y restaura la cobertura.\n"
  );
  lines.push("## 3. Cambios aplicados en esta pasada\n");
  if (fileResults.length === 0) {
    lines.push("_(idempotente: el corpus ya cumple la regla; no fue necesario inyectar ni " +
      "scrubbear nada en esta pasada. Ver §4 para el inventario cumulativo de bridges " +
      "que ya viven en el corpus.)_\n");
  }
  // Cap the per-file migration listing to keep the report scannable
  // (the inventory in §4 is the canonical source of truth post-migration).
  const MIGRATION_DETAIL_LIMIT = 25;
  let filesShown = 0;
  for (const fr of fileResults) {
    const tag = [];
    if (fr.changes.length > 0) tag.push(`${fr.changes.length} bridge(s) añadido(s)`);
    if (fr.migrated > 0) tag.push(`${fr.migrated} bridge(s) reescrito(s) v1→v2`);
    if (fr.scrubbed > 0) tag.push(`${fr.scrubbed} scrubbed`);
    // For migration-only entries (the bulk case after the v2 rewrite),
    // collapse into a one-liner so the report stays readable. Bridges
    // newly added (changes.length > 0) still print full per-block detail.
    if (fr.changes.length === 0 && fr.scrubbed === 0 && fr.migrated > 0) {
      if (filesShown < MIGRATION_DETAIL_LIMIT) {
        lines.push(`- ${fr.lang}/${fr.file}: ${fr.migrated} bridge(s) reescrito(s) v1→v2`);
        filesShown++;
      } else if (filesShown === MIGRATION_DETAIL_LIMIT) {
        lines.push(`- _… resto de la migración v1→v2 omitido para legibilidad; ver §4 para el inventario completo del catálogo v2 …_`);
        filesShown++;
      }
      continue;
    }
    lines.push(`### ${fr.lang}/${fr.file} — ${tag.join(", ")}`);
    for (const c of fr.changes) {
      lines.push(`- **Block #${c.blockIndex}** — risk line: \`${c.riskExcerpt.replace(/`/g, "'")}\``);
      lines.push(`  - bridge added: _${c.bridge}_`);
    }
    if (fr.scrubbed > 0 && fr.changes.length === 0) {
      lines.push(`- (scrub-only: ${fr.scrubbed} bridge(s) removed from non-narrative catalog blocks)`);
    }
    lines.push("");
  }

  // ── Section 4: Cumulative bridge inventory from disk truth.
  lines.push("## 4. Inventario cumulativo de bridges (estado actual en disco)\n");
  lines.push(
    `Total de párrafos en el corpus que actualmente cargan una oración bridge Exentax ` +
    `del catálogo canónico: **${bridgeInventory.length}**. Esta cifra es el estado real ` +
    `tras la sweep, no un delta de pasada — sobrevive a re-ejecuciones idempotentes.\n`
  );
  // Per-file roll-up.
  const perFile = new Map(); // "lang/file" → count
  for (const b of bridgeInventory) {
    const key = `${b.lang}/${b.file}`;
    perFile.set(key, (perFile.get(key) || 0) + 1);
  }
  lines.push("### 4.1 Roll-up por archivo (top archivos por densidad de bridges)\n");
  lines.push("| Archivo | Bridges Exentax |");
  lines.push("|---|---:|");
  const sorted = [...perFile.entries()].sort((a, z) => z[1] - a[1]);
  for (const [k, n] of sorted.slice(0, 25)) {
    lines.push(`| ${k} | ${n} |`);
  }
  lines.push(`| _… ${Math.max(0, sorted.length - 25)} más …_ | |`);
  lines.push(`| **Total archivos con ≥1 bridge** | **${sorted.length}** |\n`);
  lines.push(
    `Cobertura: ${sorted.length} de ${LANGS.length * 112} archivos (` +
    `${((sorted.length / (LANGS.length * 112)) * 100).toFixed(1)}%) llevan al menos un ` +
    `bridge editorial Exentax-led tras una mención de riesgo.\n`
  );
  // Per-language inventory enumeration (compact, grouped by file).
  lines.push("### 4.2 Listado completo de bridges por archivo\n");
  for (const lang of LANGS) {
    const langItems = bridgeInventory.filter((b) => b.lang === lang);
    if (langItems.length === 0) continue;
    lines.push(`#### ${lang} — ${langItems.length} bridge(s)`);
    const byFile = new Map();
    for (const b of langItems) {
      if (!byFile.has(b.file)) byFile.set(b.file, []);
      byFile.get(b.file).push(b);
    }
    for (const [file, items] of [...byFile.entries()].sort((a, z) => a[0].localeCompare(z[0]))) {
      lines.push(`- **${file}** (${items.length}):`);
      for (const it of items) {
        const ctx = it.riskExcerpt ? it.riskExcerpt.replace(/`/g, "'") : "(heading-only / standalone bridge paragraph)";
        lines.push(`  - block #${it.blockIndex}: …${ctx}`);
      }
    }
    lines.push("");
  }

  // ── Section 5: Orphans (rule violations) — must be empty.
  lines.push("## 5. Huérfanos detectados (objetivo: 0)\n");
  if (orphans.length === 0) {
    lines.push("_Sin huérfanos. La regla ‘riesgo → Exentax adyacente’ se cumple en el 100% " +
      "del corpus narrativo (los catálogos no-narrativos se contabilizan en su propia " +
      "columna y están justificados en §1 y §2)._\n");
  } else {
    lines.push(`**${orphans.length} huérfanos** (ver detalle abajo). Se requiere intervención editorial manual o extensión del catálogo de bridges.\n`);
    lines.push("| # | Idioma | Archivo | Block | Contexto | Extracto |");
    lines.push("|---:|---|---|---:|---|---|");
    for (let i = 0; i < orphans.length; i++) {
      const o = orphans[i];
      lines.push(`| ${i + 1} | ${o.lang} | ${o.file} | ${o.blockIndex} | ${o.kind} | ${o.excerpt.replace(/\|/g, "\\|")} |`);
    }
    lines.push("");
  }

  if (!DRY) {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, lines.join("\n"));
  }

  // ── CI gate (Task #35): in --check mode, never mutate disk, never
  // write the report, and exit non-zero with a printed list of every
  // unprotected risk paragraph that lacks an adjacent Exentax bridge.
  // The orphan list already excludes catálogo no-narrativo (cross-refs-v1,
  // legal-refs-v1) — those are counted in the documented-exception column,
  // not as rule violations, so the gate never trips on them.
  if (CHECK) {
    console.log(`Risk paragraphs scanned: ${totalRiskParas}`);
    console.log(`Catálogo no-narrativo (exempt): ${covNonNarr}`);
    console.log(`Unprotected orphan paragraphs: ${orphans.length}`);
    if (orphans.length > 0) {
      console.error(
        `\nblog-risk-bridge-inject --check: ${orphans.length} unprotected ` +
          `risk paragraph(s) found. Every paragraph mentioning a fine, ` +
          `sanction, account block, audit or inspection must be followed ` +
          `(same or next paragraph) by an Exentax-led solution sentence.\n`
      );
      console.error("Offending paragraphs:");
      for (let i = 0; i < orphans.length; i++) {
        const o = orphans[i];
        console.error(
          `  ${i + 1}. [${o.lang}/${o.file}] block #${o.blockIndex} (${o.kind})`
        );
        console.error(`     ${o.excerpt}`);
      }
      console.error(
        `\nFix: re-run \`node scripts/blog/blog-risk-bridge-inject.mjs\` ` +
          `(no flags) to auto-inject the bridge sentence, or edit the ` +
          `article so the next paragraph carries the literal word "Exentax".\n`
      );
      process.exit(1);
    }
    console.log(`\nblog-risk-bridge-inject --check: OK (0 orphans)\n`);
    return;
  }

  console.log(`Risk paragraphs found: ${totalRiskParas}`);
  console.log(`Bridges injected this pass: ${totalChanges}`);
  console.log(`Bridges rewritten v1→v2 (migration): ${totalMigrated}`);
  console.log(`Bridges scrubbed from managed blocks: ${totalScrubbed}`);
  console.log(`Files touched: ${fileResults.length}`);
  console.log(`Mode: ${DRY ? "dry-run" : "apply"}`);
  if (!DRY) console.log(`Report written: ${path.relative(ROOT, REPORT_PATH)}`);
}

const invokedAsScript =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__dirname, "blog-risk-bridge-inject.mjs");
if (invokedAsScript) main();

// Test hooks (Task #45): expose the pure helpers and catalogs so the
// unit-test suite (`blog-risk-bridge-inject.test.mjs`) can exercise the
// regex catalog, protected-set computation, bridge picker, line
// splicer, and per-file processor without spawning a subprocess.
export {
  RISK,
  BRIDGES,
  LEGACY_BRIDGES,
  NON_NARRATIVE_BLOCK_NAMES,
  HEADING_RE,
  HTML_COMMENT_ONLY_RE,
  TERMINAL_PUNCT_RE,
  hashSeed,
  pickBridgeForKey,
  pickBridge,
  computeProtectedSet,
  isNonNarrativeManaged,
  appendBridgeToLine,
  processFile,
};
