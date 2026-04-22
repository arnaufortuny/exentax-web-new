#!/usr/bin/env node
/**
 * blog-add-next-steps.mjs
 *
 * Adds a "Next steps" closing section to articles that lack a clear closing
 * cue. Inserted right before the first 2026 appendix marker (banking-facts,
 * cfc-tfi, legal-facts) or right before the end of the body if no appendix
 * exists. The copy is intentionally generic and CTA-free — actual CTA wiring
 * is handled by the dedicated "CTA audit and rewrite" task.
 *
 * Idempotent: skips files that already match a known closing cue (the same
 * detector used by blog-structure-audit.mjs).
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../client/src/data/blog-content");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const NEXT_STEP_CUES = [
  "próximo paso", "próximos pasos", "siguiente paso", "siguientes pasos",
  "qué hacer ahora", "qué hacer a continuación", "qué hacer con",
  "qué hacemos por ti", "agenda", "agendar", "habla con nosotros", "te ayudamos",
  "en resumen", "checklist final", "cómo seguir", "lecturas relacionadas",
  "en exentax nos encargamos", "en exentax montamos", "en exentax te ayudamos",
  "cómo te ayudamos", "cómo seguimos", "cómo proceder",
  "next step", "next steps", "what to do next", "what to do now", "what to do with",
  "in summary", "talk to us", "book a call", "we handle this for you",
  "how to proceed", "how we help you", "related reading", "further reading",
  "at exentax we handle", "at exentax we set", "at exentax we help",
  "prochaine étape", "prochaines étapes", "que faire maintenant", "que faire ensuite",
  "en résumé", "parlez-nous", "nous nous en occupons", "nous vous aidons",
  "chez exentax", "lectures associées", "comment procéder",
  "nächster schritt", "nächste schritte", "was als nächstes", "was tun mit",
  "zusammenfassung", "sprechen sie mit uns", "wir kümmern uns", "wir helfen ihnen",
  "bei exentax", "weiterführende lektüre", "wie es weitergeht",
  "próximo passo", "próximos passos", "o que fazer a seguir", "o que fazer agora",
  "em resumo", "fale connosco", "fale conosco", "ajudamos",
  "na exentax tratamos", "na exentax montamos", "na exentax ajudamos",
  "leituras relacionadas", "como proceder",
  "següent pas", "següents passos", "pròxim pas", "pròxims passos",
  "què fer ara", "què fer a continuació", "en resum", "parla amb nosaltres",
  "t'ajudem", "et ajudem", "a exentax ens encarreguem", "a exentax muntem",
  "a exentax tajudem", "lectures relacionades", "com procedir",
];

// Locale-aware closing block (CTA-free, told as a structural closing).
const CLOSING = {
  es: `## Próximos pasos

Ahora que tienes el contexto completo, el siguiente paso natural es contrastarlo con tu propia situación: qué encaja, qué no, y dónde están los matices que dependen de tu residencia, tu actividad y tu volumen. Una revisión rápida de tu caso suele ahorrar mucho ruido antes de tomar cualquier decisión estructural.`,
  en: `## Next steps

Now that you have the full context, the natural next step is to map it against your own situation: what fits, what doesn't, and where the nuances depend on your residency, your activity and your volume. A quick review of your specific case usually saves a lot of noise before taking any structural decision.`,
  fr: `## Prochaines étapes

Maintenant que vous avez le contexte complet, l'étape suivante naturelle est de le confronter à votre propre situation : ce qui convient, ce qui ne convient pas, et où se situent les nuances qui dépendent de votre résidence, de votre activité et de votre volume. Un examen rapide de votre cas évite généralement beaucoup de bruit avant toute décision structurelle.`,
  de: `## Nächste Schritte

Jetzt, da Sie den vollständigen Kontext haben, ist der natürliche nächste Schritt, ihn mit Ihrer eigenen Situation abzugleichen: was passt, was nicht, und wo die Nuancen von Ihrem Wohnsitz, Ihrer Tätigkeit und Ihrem Volumen abhängen. Eine kurze Prüfung Ihres konkreten Falls erspart in der Regel viel Lärm vor jeder strukturellen Entscheidung.`,
  pt: `## Próximos passos

Agora que tem o contexto completo, o passo seguinte natural é confrontá-lo com a sua própria situação: o que encaixa, o que não encaixa e onde estão as nuances que dependem da sua residência, da sua actividade e do seu volume. Uma revisão rápida do seu caso costuma poupar muito ruído antes de qualquer decisão estrutural.`,
  ca: `## Següents passos

Ara que tens el context complet, el pas següent natural és contrastar-lo amb la teva pròpia situació: què encaixa, què no, i on són els matisos que depenen de la teva residència, la teva activitat i el teu volum. Una revisió ràpida del teu cas sol estalviar molt soroll abans de qualsevol decisió estructural.`,
};

// Appendix markers we should insert BEFORE.
const APPENDIX_PATTERNS = [
  /<!--\s*exentax:year-2026-v1\s*-->/,
  /<!--\s*exentax:banking-facts-v1\s*-->/,
  /<!--\s*exentax:cfc-tfi-v1\s*-->/,
  /<!--\s*exentax:legal-facts-v1\s*-->/,
  // Fallback: H2 headings of the appendix sections.
  /\n\s*##\s+Hechos bancarios y fiscales/,
  /\n\s*##\s+Banking and tax facts/,
  /\n\s*##\s+Faits bancaires/,
  /\n\s*##\s+Bank- und Steuerfakten/,
  /\n\s*##\s+Factos bancários/,
  /\n\s*##\s+Fets bancaris/,
  /\n\s*##\s+Compliance fiscal/,
  /\n\s*##\s+Tax compliance in your country/,
  /\n\s*##\s+Conformité fiscale/,
  /\n\s*##\s+Steuer-Compliance/,
  /\n\s*##\s+Hechos legales/,
  /\n\s*##\s+Legal and procedural facts/,
  /\n\s*##\s+Faits légaux/,
  /\n\s*##\s+Rechts- und Verfahrensfakten/,
  /\n\s*##\s+Factos legais/,
  /\n\s*##\s+Fets legals/,
];

let totalAdded = 0;

for (const lang of LANGS) {
  const dir = join(ROOT, lang);
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
  let added = 0;
  for (const f of files) {
    const path = join(dir, f);
    let src = readFileSync(path, "utf8");
    const m = src.match(/export default `([\s\S]*?)`\s*;?\s*$/);
    if (!m) continue;
    const body = m[1];
    const lower = body.toLowerCase();
    if (NEXT_STEP_CUES.some((c) => lower.includes(c))) continue;

    // Find earliest appendix marker position (in absolute file).
    const bodyStart = src.indexOf("`") + 1;
    let earliest = -1;
    for (const re of APPENDIX_PATTERNS) {
      const r = new RegExp(re.source, re.flags);
      r.lastIndex = bodyStart;
      const mm = r.exec(src);
      if (mm && (earliest === -1 || mm.index < earliest)) earliest = mm.index;
    }
    // Insert position: at earliest appendix or just before closing backtick.
    const closeBacktick = src.lastIndexOf("`;");
    const insertAt = earliest !== -1 ? earliest : closeBacktick;
    if (insertAt <= 0) continue;
    const block = "\n\n  " + CLOSING[lang].replace(/\n/g, "\n  ") + "\n\n";
    src = src.slice(0, insertAt) + block + src.slice(insertAt);
    writeFileSync(path, src);
    added++;
    totalAdded++;
  }
  console.log(`[${lang}] next-steps closings added: ${added}`);
}
console.log(`\nTOTAL: ${totalAdded}`);
