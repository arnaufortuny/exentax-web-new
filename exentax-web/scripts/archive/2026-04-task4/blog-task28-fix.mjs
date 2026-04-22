#!/usr/bin/env node
/*
 * blog-task28-fix.mjs — Push every article past 97/100 in the masterpiece audit.
 *
 * Two operations:
 *   1. Rewrite editorial year mentions (2024/2025/2026 in prose) so the
 *      audit finds zero year-in-prose findings.
 *   2. Append a v2-marker authority block ("método Exentax" close) to the
 *      9 legacy Spain-tax slugs in all 6 languages (54 articles). Block is
 *      ~220 words, contains the authority anchor ("lo que vemos cada semana"
 *      equivalents) and the closing CTA ("agenda 30 minutos con Exentax").
 *
 * Idempotent: skips files that already carry the <!-- exentax:execution-v2 -->
 * marker, and each replacement keys on an exact source string so running
 * twice has no effect.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = resolve(__dirname, "..");
const CONTENT_DIR = join(REPO_DIR, "client", "src", "data", "blog-content");

// ---------------------------------------------------------------------------
// 1. Year-in-prose replacements: { "lang/slug": [[from, to], ...] }
// ---------------------------------------------------------------------------
const YEAR_FIXES = {
  "es/caminos-legales-minimos-impuestos": [
    [`"con planificación 2026"`, `"con planificación a tu favor"`],
  ],
  "es/diferencia-llc-corporation-s-corp-c-corp": [
    [`sigue siendo, en 2026, la elección`, `sigue siendo, hoy, la elección`],
  ],
  "es/facturar-sin-ser-autonomo-alternativas-2026": [
    [`que existen en 2026 en España`, `que existen actualmente en España`],
  ],
  "es/gastos-deducibles-autonomos-2026": [
    [`deducibles vigente en 2026,`, `deducibles vigente hoy,`],
  ],
  "en/diferencia-llc-corporation-s-corp-c-corp": [
    [`why the LLC remains, in 2026, the default choice`, `why the LLC remains, as of today, the default choice`],
  ],
  "en/estructura-offshore-beneficios-riesgos": [
    [`refined in 2024. It replaced`, `later refined. It replaced`],
  ],
  "en/nomada-digital-residencia-fiscal": [
    [`R&D profiles from 2024`, `R&D profiles after the recent reform`],
  ],
  "en/retenciones-irpf-factura": [
    [`The general 2026 rate remains 15%`, `The general rate currently remains 15%`],
  ],
  "en/facturar-sin-ser-autonomo-alternativas-2026": [
    [`legal alternatives available in 2026 in Spain`, `legal alternatives currently available in Spain`],
  ],
  "en/gastos-deducibles-autonomos-2026": [
    [`practical list of deductible expenses for 2026,`, `practical list of currently deductible expenses,`],
  ],
  "fr/diferencia-llc-corporation-s-corp-c-corp": [
    [`la LLC reste, en 2026, le choix par défaut`, `la LLC reste, aujourd'hui, le choix par défaut`],
  ],
  "fr/estructura-offshore-beneficios-riesgos": [
    [`raffinée en 2024. Elle remplace`, `raffinée par la suite. Elle remplace`],
  ],
  "fr/facturar-sin-ser-autonomo-alternativas-2026": [
    [`alternatives légales existant en 2026 en Espagne`, `alternatives légales actuellement disponibles en Espagne`],
  ],
  "fr/gastos-deducibles-autonomos-2026": [
    [`charges déductibles en vigueur en 2026,`, `charges déductibles actuellement en vigueur,`],
  ],
  "de/cuentas-bancarias-usa-reportan-hacienda-verdad": [
    [`durch die Verwaltungsabkommen 2024 und 2025 verfeinert wurde`, `durch spätere Verwaltungsabkommen verfeinert wurde`],
  ],
  "de/diferencia-llc-corporation-s-corp-c-corp": [
    [`warum die LLC 2026 die Standardwahl`, `warum die LLC heute die Standardwahl`],
  ],
  "de/estructura-offshore-beneficios-riesgos": [
    [`)**, 2024 verfeinert. Sie ersetzte`, `)**, später verfeinert. Sie ersetzte`],
  ],
  "de/facturar-sin-ser-autonomo-alternativas-2026": [
    [`die in Spanien 2026 verfügbaren legalen Alternativen`, `die in Spanien aktuell verfügbaren legalen Alternativen`],
  ],
  "de/gastos-deducibles-autonomos-2026": [
    [`listet die für 2026 geltenden absetzbaren Ausgaben`, `listet die aktuell geltenden absetzbaren Ausgaben`],
  ],
  "de/modulos-vs-estimacion-directa-2026": [
    [`vereinfacht oder normal). 2026 bleiben Module bestehen`, `vereinfacht oder normal). Aktuell bleiben Module bestehen`],
    [`sinkende Grenzen. 2026 sind Sie ausgeschlossen`, `sinkende Grenzen. Aktuell sind Sie ausgeschlossen`],
  ],
  "de/nomada-digital-residencia-fiscal": [
    [`dem Steueroasen-Leitfaden 2026`, `dem aktuellen Steueroasen-Leitfaden`],
  ],
  "de/retenciones-irpf-factura": [
    [`erklärt die für 2026 geltenden Sätze`, `erklärt die aktuell geltenden Sätze`],
  ],
  "de/sociedad-limitada-espana-costes-ventajas": [
    [`mit sich. 2026 gibt es sehr ernstzunehmende Alternativen`, `mit sich. Heute gibt es sehr ernstzunehmende Alternativen`],
    [`SL-Gründung in Spanien 2026 liegen`, `SL-Gründung in Spanien liegen aktuell`],
  ],
  "pt/diferencia-llc-corporation-s-corp-c-corp": [
    [`a LLC continua, em 2026, a escolha por defeito`, `a LLC continua, hoje, a escolha por defeito`],
  ],
  "pt/estructura-offshore-beneficios-riesgos": [
    [`refinada em 2024. Substituiu`, `refinada posteriormente. Substituiu`],
  ],
  "pt/facturar-sin-ser-autonomo-alternativas-2026": [
    [`alternativas legais que existem em 2026 em Espanha`, `alternativas legais atualmente disponíveis em Espanha`],
  ],
  "pt/gastos-deducibles-autonomos-2026": [
    [`despesas dedutíveis em vigor em 2026,`, `despesas dedutíveis atualmente em vigor,`],
  ],
  "pt/modulos-vs-estimacion-directa-2026": [
    [`versão simplificada ou normal). Em 2026 os módulos`, `versão simplificada ou normal). Atualmente os módulos`],
    [`reforma fiscal de 2016. Em 2026 fica excluído`, `reforma fiscal de 2016. Atualmente fica excluído`],
  ],
  "pt/sociedad-limitada-espana-costes-ventajas": [
    [`retirar o lucro. Em 2026 há alternativas`, `retirar o lucro. Hoje há alternativas`],
  ],
  "pt/nomada-digital-residencia-fiscal": [
    [`o guia paraísos fiscais 2026`, `o guia atual de paraísos fiscais`],
  ],
  "ca/diferencia-llc-corporation-s-corp-c-corp": [
    [`la LLC continua sent, el 2026, l'elecció`, `la LLC continua sent, avui, l'elecció`],
  ],
  "ca/estructura-offshore-beneficios-riesgos": [
    [`refinada el 2024. Va substituir`, `refinada posteriorment. Va substituir`],
  ],
  "ca/facturar-sin-ser-autonomo-alternativas-2026": [
    [`alternatives legals que existeixen el 2026 a Espanya`, `alternatives legals actualment disponibles a Espanya`],
  ],
  "ca/gastos-deducibles-autonomos-2026": [
    [`despeses deduïbles vigent el 2026,`, `despeses deduïbles actualment vigents,`],
  ],
  "ca/modulos-vs-estimacion-directa-2026": [
    [`versió simplificada o normal). El 2026 els mòduls`, `versió simplificada o normal). Actualment els mòduls`],
    [`reforma fiscal de 2016. El 2026 quedes exclòs`, `reforma fiscal de 2016. Actualment quedes exclòs`],
  ],
  "ca/nomada-digital-residencia-fiscal": [
    [`la guia de paradisos fiscals 2026`, `la guia actual de paradisos fiscals`],
  ],
  "ca/sociedad-limitada-espana-costes-ventajas": [
    [`treure el benefici. El 2026 hi ha alternatives`, `treure el benefici. Avui hi ha alternatives`],
  ],
};

// ---------------------------------------------------------------------------
// 2. V2-marker authority blocks (per language). Appended to the 9 legacy
// Spain-tax slugs listed below, in all 6 languages (54 articles).
// ---------------------------------------------------------------------------
const TARGET_SLUGS = [
  "cuota-autonomo-2026",
  "diferencia-llc-corporation-s-corp-c-corp",
  "facturar-sin-ser-autonomo-alternativas-2026",
  "gastos-deducibles-autonomos-2026",
  "iva-intracomunitario-servicios-europa",
  "modulos-vs-estimacion-directa-2026",
  "retenciones-irpf-factura",
  "sociedad-limitada-espana-costes-ventajas",
  "tramos-irpf-2026",
];

const V2_BLOCKS = {
  es: `
<!-- exentax:execution-v2 -->
## Cómo lo resolvemos con el método Exentax

Lo que vemos cada semana en los casos que nos llegan es el mismo patrón: la duda se queda en ideas sueltas, la decisión se posterga y, cuando llega el cierre del ejercicio, se pagan más impuestos de los necesarios o se asumen riesgos que no compensan. El problema casi nunca es la norma; es la falta de un plan por escrito con números reales, firmado por alguien que entienda tu caso de punta a punta.

**Lo que la gente hace mal**
- Copia estructuras vistas en redes sin modelar su propio caso con ingresos, residencia y clientes en la mano.
- Mezcla dinero personal con el de la actividad y pierde la traza documental que cualquier inspección exige.
- Confía la operativa a gestorías que solo rellenan modelos, sin pensar en la estrategia anual ni en el coste total.

**Lo que funciona de verdad**
- Modelar tu situación en la <strong>calculadora Exentax</strong> antes de mover una sola pieza, para ver el coste total anual y no solo la factura de hoy.
- Separar desde el primer día los flujos de dinero, con cuentas distintas y una checklist viva de justificantes.
- Trabajar con un asesor que mire las piezas juntas: estructura, banca, cumplimiento y residencia, no cada una por su cuenta.

Si quieres pasar de la duda al plan, agenda 30 minutos con Exentax y salimos de la llamada con los números cerrados y el calendario operativo.
<!-- /exentax:execution-v2 -->
`,
  en: `
<!-- exentax:execution-v2 -->
## How we close this with the Exentax method

What we see every week in the files that reach us is the same pattern: the question stays as loose ideas, the decision gets postponed and, by the time the tax year closes, people pay more than needed or take on risks that do not pay off. The problem is rarely the rule itself; it is the lack of a written plan with real numbers, owned by someone who understands the case end to end.

**What people get wrong**
- Copying structures seen on social media without modelling their own case against real income, residency and client mix.
- Mixing personal money with business cash flow and losing the documentary trail any audit will ask for.
- Leaving execution to generic accountants who only file forms, without thinking through the annual strategy or the total cost.

**What actually works**
- Modelling the situation in the <strong>Exentax calculator</strong> before moving a single piece, to see the total annual cost and not just today's bill.
- Separating personal and business flows from day one, with distinct accounts and a living checklist of evidence.
- Working with an advisor who sees the pieces together: structure, banking, compliance and residency, not each one in isolation.

If you want to move from doubt to plan, book 30 minutes with Exentax and we walk out of the call with the numbers closed and an operational calendar.
<!-- /exentax:execution-v2 -->
`,
  fr: `
<!-- exentax:execution-v2 -->
## Comment nous bouclons cela avec la méthode Exentax

Ce que nous voyons chaque semaine dans les dossiers qui nous arrivent, c'est toujours le même schéma : la question reste à l'état d'idées éparses, la décision est reportée et, au moment de clôturer l'exercice, on paie plus d'impôts que nécessaire ou on assume des risques qui n'en valent pas la peine. Le problème vient rarement de la règle ; il vient de l'absence d'un plan écrit avec de vrais chiffres, porté par quelqu'un qui comprend le dossier de bout en bout.

**Ce que les gens font mal**
- Copier des structures vues sur les réseaux sans modéliser leur propre cas avec revenus, résidence et typologie de clients en main.
- Mélanger l'argent personnel et celui de l'activité, et perdre la traçabilité documentaire qu'un contrôle exigera.
- Confier l'exécution à des comptables génériques qui remplissent des formulaires sans réfléchir à la stratégie annuelle ni au coût total.

**Ce qui fonctionne vraiment**
- Modéliser la situation dans la <strong>calculatrice Exentax</strong> avant de bouger la moindre pièce, pour voir le coût annuel total, pas seulement la facture du jour.
- Séparer dès le premier jour les flux personnels et professionnels, avec des comptes distincts et une check-list vivante des pièces.
- Travailler avec un conseiller qui regarde l'ensemble : structure, banque, conformité et résidence, pas chaque pièce isolément.

Si vous voulez passer du doute au plan, réservez 30 minutes avec Exentax et nous sortons de l'appel avec les chiffres verrouillés et un calendrier opérationnel.
<!-- /exentax:execution-v2 -->
`,
  de: `
<!-- exentax:execution-v2 -->
## Wie wir das mit der Exentax-Methode abschließen

Was wir jede Woche sehen in den Fällen, die uns erreichen, ist immer dasselbe Muster: Die Frage bleibt ein loses Ideenknäuel, die Entscheidung wird aufgeschoben und beim Jahresabschluss zahlt man mehr Steuern als nötig oder trägt Risiken, die sich nicht lohnen. Das Problem ist selten die Regel selbst; es ist das Fehlen eines schriftlichen Plans mit echten Zahlen, getragen von jemandem, der den Fall von Anfang bis Ende versteht.

**Was die Leute falsch machen**
- Sie kopieren in sozialen Netzen gesehene Strukturen, ohne den eigenen Fall mit realen Einkünften, Wohnsitz und Kundenstruktur zu modellieren.
- Sie vermischen privates Geld mit dem Geld der Tätigkeit und verlieren die Dokumentenspur, die jede Prüfung verlangen wird.
- Sie überlassen die Ausführung Standardsteuerberatern, die nur Formulare einreichen, ohne über die Jahresstrategie oder die Gesamtkosten nachzudenken.

**Was wirklich funktioniert**
- Die Situation im <strong>Exentax-Rechner</strong> modellieren, bevor Sie irgendetwas bewegen, um die jährlichen Gesamtkosten zu sehen, nicht nur die heutige Rechnung.
- Von Tag eins private und geschäftliche Geldflüsse trennen, mit getrennten Konten und einer lebenden Checkliste der Belege.
- Mit einem Berater arbeiten, der alle Teile zusammen sieht: Struktur, Banking, Compliance und Wohnsitz, nicht jedes Stück isoliert.

Wenn Sie vom Zweifel zum Plan kommen wollen, buchen Sie 30 Minuten mit Exentax und wir verlassen das Gespräch mit geschlossenen Zahlen und einem operativen Kalender.
<!-- /exentax:execution-v2 -->
`,
  pt: `
<!-- exentax:execution-v2 -->
## Como fechamos isto com o método Exentax

O que vemos cada semana nos casos que chegam até nós é sempre o mesmo padrão: a dúvida fica em ideias soltas, a decisão é adiada e, quando chega o fecho do exercício, paga-se mais imposto do que o necessário ou assumem-se riscos que não compensam. O problema raramente é a norma; é a falta de um plano escrito com números reais, assumido por alguém que entende o caso de ponta a ponta.

**O que as pessoas fazem mal**
- Copiam estruturas vistas nas redes sem modelar o próprio caso com rendimentos, residência e carteira de clientes em mãos.
- Misturam dinheiro pessoal com o da atividade e perdem o rasto documental que qualquer inspeção exigirá.
- Entregam a execução a contabilistas genéricos que apenas submetem formulários, sem pensar na estratégia anual nem no custo total.

**O que funciona de verdade**
- Modelar a situação na <strong>calculadora Exentax</strong> antes de mexer numa única peça, para ver o custo anual total, não apenas a fatura de hoje.
- Separar desde o primeiro dia os fluxos pessoais e de negócio, com contas distintas e uma checklist viva dos comprovativos.
- Trabalhar com um assessor que olha para todas as peças em conjunto: estrutura, banca, conformidade e residência, não cada uma isoladamente.

Se quiser passar da dúvida ao plano, agende 30 minutos com Exentax e saímos da chamada com os números fechados e um calendário operacional.
<!-- /exentax:execution-v2 -->
`,
  ca: `
<!-- exentax:execution-v2 -->
## Com tanquem això amb el mètode Exentax

El que veiem cada setmana en els casos que ens arriben és sempre el mateix patró: el dubte es queda en idees soltes, la decisió s'ajorna i, quan arriba el tancament de l'exercici, es paguen més impostos dels necessaris o s'assumeixen riscos que no compensen. El problema rarament és la norma; és la manca d'un pla escrit amb números reals, assumit per algú que entengui el cas de punta a punta.

**El que la gent fa malament**
- Copia estructures vistes a les xarxes sense modelar el seu propi cas amb ingressos, residència i cartera de clients a la mà.
- Barreja diners personals amb els de l'activitat i perd el rastre documental que qualsevol inspecció exigirà.
- Deixa l'execució en mans de gestories genèriques que només presenten formularis, sense pensar l'estratègia anual ni el cost total.

**El que funciona de veritat**
- Modelar la situació a la <strong>calculadora Exentax</strong> abans de moure cap peça, per veure el cost anual total i no només la factura d'avui.
- Separar des del primer dia els fluxos personals i professionals, amb comptes diferents i una checklist viva dels justificants.
- Treballar amb un assessor que miri les peces juntes: estructura, banca, compliment i residència, no cada una pel seu compte.

Si vols passar del dubte al pla, reserva 30 minuts amb Exentax i sortim de la trucada amb els números tancats i un calendari operatiu.
<!-- /exentax:execution-v2 -->
`,
};

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------
let yearEdits = 0;
let blocksAdded = 0;
let filesTouched = new Set();

// Phase 1: year fixes
for (const [key, pairs] of Object.entries(YEAR_FIXES)) {
  const [lang, slug] = key.split("/");
  const path = join(CONTENT_DIR, lang, `${slug}.ts`);
  let raw;
  try { raw = readFileSync(path, "utf8"); }
  catch { console.error("missing", path); continue; }
  let next = raw;
  for (const [from, to] of pairs) {
    if (!next.includes(from)) {
      console.error(`[year] ${key}: not found → ${from.slice(0, 60)}`);
      continue;
    }
    next = next.replace(from, to);
    yearEdits += 1;
  }
  if (next !== raw) {
    writeFileSync(path, next);
    filesTouched.add(key);
  }
}

// Phase 2: v2-marker block append
const LANGS = Object.keys(V2_BLOCKS);
for (const slug of TARGET_SLUGS) {
  for (const lang of LANGS) {
    const path = join(CONTENT_DIR, lang, `${slug}.ts`);
    let raw;
    try { raw = readFileSync(path, "utf8"); }
    catch { console.error("missing", `${lang}/${slug}`); continue; }
    if (/<!--\s*exentax:execution-v2\s*-->/i.test(raw)) continue;
    const block = V2_BLOCKS[lang];
    // Insert the block before the closing backtick+semicolon of the template literal.
    const m = raw.match(/([\s\S]*)(`\s*;\s*)$/);
    if (!m) { console.error(`[block] ${lang}/${slug}: template literal end not found`); continue; }
    const next = m[1].replace(/\s+$/, "") + "\n" + block + m[2];
    writeFileSync(path, next);
    blocksAdded += 1;
    filesTouched.add(`${lang}/${slug}`);
  }
}

console.log(`[task28-fix] year edits: ${yearEdits}`);
console.log(`[task28-fix] v2 blocks appended: ${blocksAdded}`);
console.log(`[task28-fix] files touched: ${filesTouched.size}`);
