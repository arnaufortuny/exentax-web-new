#!/usr/bin/env node
/*
 * Sweep editorial year mentions out of the task9-2026-expansion block.
 * Operates only on the section after the MARKER comment in each of the
 * 42 files (7 slugs × 6 langs).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT = resolve(ROOT, "client/src/data/blog-content");

const MARKER = "<!-- task9-2026-expansion -->";
const SLUGS = [
  "modelo-720-721-residentes-espana-cuentas-cripto-extranjero",
  "cuentas-bancarias-usa-reportan-hacienda-verdad",
  "cuenta-bancaria-mercury-llc-extranjero",
  "llc-alternativa-autonomo-espana",
  "caminos-legales-minimos-impuestos",
  "estructura-offshore-beneficios-riesgos",
  "nomada-digital-residencia-fiscal",
];
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

// Targeted phrase replacements (multi-language). Applied in order.
const REPLACEMENTS = [
  // ===== Headings: drop trailing " 2026" / " in 2026" / " en 2026" =====
  [/\s+(?:en|in|para|à)\s+2026(?=[\s:.,?!\n])/gi, ""],
  [/\s+2026(?=[\s:.,?!\n])/g, ""],
  // ===== Common editorial contexts =====
  // ES
  [/realidad regulatoria 2026/gi, "realidad regulatoria actual"],
  [/vigentes en 2026/gi, "vigentes"],
  [/vigente en 2026/gi, "vigente"],
  [/aplicables a 2026/gi, "aplicables"],
  [/para 2026/gi, "actuales"],
  [/objetivos de 2026/gi, "objetivos vigentes"],
  [/(modificada|refinada|actualizada) en 2024/gi, "$1 posteriormente"],
  [/desde 2024/gi, "más recientemente"],
  [/de 2024 y 2025/gi, "posteriores"],
  [/de 2024 et 2025/gi, "ultérieurs"],
  [/von 2024 und 2025/gi, "späterer Jahre"],
  [/de 2024 e 2025/gi, "posteriores"],
  [/de 2024 i 2025/gi, "posteriors"],
  [/depuis 2024/gi, "plus récemment"],
  [/seit 2024/gi, "in jüngerer Zeit"],
  [/des de 2024/gi, "més recentment"],
  [/des del 2024/gi, "més recentment"],
  [/desde 2024/gi, "mais recentemente"],
  [/del ejercicio 2025/gi, "del último ejercicio cerrado"],
  [/ejercicio 2025/gi, "último ejercicio cerrado"],
  [/EUR\/mes 2025/gi, "EUR/mes vigente"],
  [/EUR\/mês 2025/gi, "EUR/mês vigente"],
  [/EUR\/Monat 2025/gi, "EUR/Monat aktuell"],
  [/EUR\/mois 2025/g, "EUR/mois en vigueur"],
  [/EUR\/month 2025/gi, "EUR/month current"],
  [/Tiempo medio aprobación 2026/gi, "Tiempo medio aprobación actual"],
  [/Average 2026 approval time/gi, "Average current approval time"],
  [/Délai moyen d'approbation 2026/gi, "Délai moyen d'approbation actuel"],
  [/Durchschnittliche Genehmigungsdauer 2026/gi, "Durchschnittliche aktuelle Genehmigungsdauer"],
  [/Tempo médio de aprovação 2026/gi, "Tempo médio atual de aprovação"],
  [/Temps mitjà d'aprovació 2026/gi, "Temps mitjà actual d'aprovació"],
  [/Requisitos KYC mínimos en 2026/gi, "Requisitos KYC mínimos vigentes"],
  [/Minimum 2026 KYC requirements/gi, "Minimum current KYC requirements"],
  [/Exigences KYC minimales en 2026/gi, "Exigences KYC minimales en vigueur"],
  [/Mindest-KYC-Anforderungen 2026/gi, "Aktuelle Mindest-KYC-Anforderungen"],
  [/Requisitos KYC mínimos em 2026/gi, "Requisitos KYC mínimos atuais"],
  [/Requisits KYC mínims el 2026/gi, "Requisits KYC mínims vigents"],
  [/Plazos críticos a recordar en 2026/gi, "Plazos críticos a recordar"],
  [/Critical 2026 deadlines/gi, "Critical deadlines"],
  [/Échéances 2026 à retenir/gi, "Échéances clés à retenir"],
  [/Kritische Termine 2026/gi, "Kritische Termine"],
  [/Datas críticas em 2026/gi, "Datas críticas"],
  [/Dates crítiques el 2026/gi, "Dates crítiques"],
  [/Errores que más sanciones generan en 2026/gi, "Errores que más sanciones generan"],
  [/Mistakes that drive most sanctions in 2026/gi, "Mistakes that drive most sanctions"],
  [/Erreurs qui produisent le plus de sanctions en 2026/gi, "Erreurs qui produisent le plus de sanctions"],
  [/Fehler, die 2026 die meisten Sanktionen verursachen/gi, "Fehler, die heute die meisten Sanktionen verursachen"],
  [/Erros que mais sanções produzem em 2026/gi, "Erros que mais sanções produzem"],
  [/Errors que més sancions generen el 2026/gi, "Errors que més sancions generen"],
  // EN
  [/2026 regulatory reality/gi, "current regulatory reality"],
  [/regulatory reality is/gi, "regulatory reality is"],
  [/in 2026 it covers/gi, "currently it covers"],
  [/since 2024/gi, "more recently"],
  [/2024 and 2025/gi, "subsequent"],
  [/the 2025 calendar year/gi, "the last closed calendar year"],
  [/2025 calendar year/gi, "last closed calendar year"],
  [/2025 FATCA report/gi, "annual FATCA report"],
  [/the 2025/gi, "the last closed"],
  [/for 2025/gi, "for the last closed period"],
  [/Reporte FATCA del ejercicio 2025/gi, "reporte FATCA del último ejercicio cerrado"],
  [/2025 Steuerjahr/gi, "letztes abgeschlossenes Steuerjahr"],
  // FR
  [/réalité réglementaire 2026/gi, "réalité réglementaire actuelle"],
  [/En 2026 elle inclut/gi, "Elle inclut actuellement"],
  // DE
  [/regulatorische Realität 2026/gi, "aktuelle regulatorische Realität"],
  [/2026 umfasst sie/gi, "Aktuell umfasst sie"],
  // PT
  [/realidade regulatória 2026/gi, "realidade regulatória atual"],
  [/Em 2026 inclui/gi, "Atualmente inclui"],
  // CA
  [/realitat regulatòria 2026/gi, "realitat regulatòria actual"],
  [/El 2026 inclou/gi, "Actualment inclou"],
  // Tables / nomad-digital headings
  [/Tabla de visados de nómada digital vigentes en 2026/gi, "Tabla de visados de nómada digital vigentes"],
  [/Digital nomad visa table for 2026/gi, "Digital nomad visa table currently in force"],
  [/Tableau des visas de nomade numérique en 2026/gi, "Tableau des visas de nomade numérique en vigueur"],
  [/Tabelle der Digital-Nomad-Visa für 2026/gi, "Aktuelle Tabelle der Digital-Nomad-Visa"],
  [/Tabela de vistos de nómada digital em 2026/gi, "Tabela de vistos de nómada digital em vigor"],
  [/Taula de visats de nòmada digital el 2026/gi, "Taula de visats de nòmada digital vigents"],
  [/operativa para 2026/gi, "operativa actualizada"],
  [/strategy for 2026/gi, "current strategy"],
  [/stratégie opérationnelle 2026/gi, "stratégie opérationnelle actuelle"],
  [/operative Strategie für 2026/gi, "aktuelle operative Strategie"],
  [/estratégia operacional para 2026/gi, "estratégia operacional atualizada"],
  [/estratègia operativa per al 2026/gi, "estratègia operativa actualitzada"],
  // Specific tail: "guía de paraísos fiscales y jurisdicciones no cooperativas 2026"
  [/jurisdicciones no cooperativas 2026/gi, "jurisdicciones no cooperativas"],
  [/non cooperative jurisdictions 2026/gi, "non cooperative jurisdictions"],
  [/non coopératives 2026/gi, "non coopératives"],
  [/nicht kooperative.{0,12}2026/gi, "nicht kooperativen Jurisdiktionen"],
  [/jurisdições não cooperativas 2026/gi, "jurisdições não cooperativas"],
  [/jurisdiccions no cooperatives 2026/gi, "jurisdiccions no cooperatives"],
  // EN nomada: "~EUR 2,762 / month 2025" style
  [/\/\s*month\s+2025/gi, "/ month current"],
  [/\/\s*mes\s+2025/gi, "/ mes vigente"],
  [/\/\s*mês\s+2025/gi, "/ mês vigente"],
  [/\/\s*mois\s+2025/gi, "/ mois en vigueur"],
  [/\/\s*Monat\s+2025/gi, "/ Monat aktuell"],
  // Cuentas FATCA reporting deadlines
  [/(FATCA[- ]?(?:report|Meldung|reporte|reporting|déclaration))\s+(?:de\s+|of\s+|du\s+)?2025/gi, "$1 anual"],
  [/(?:reporte|relatório|reporting|déclaration|Meldung)\s+FATCA\s+(?:de\s+|of\s+|do\s+|du\s+)?2025/gi, "reporte FATCA anual"],
  [/IRS-AEAT\s+(?:para|for|pour|für|per|para o)\s+(?:el\s+|the\s+|le\s+|das\s+|el\s+|o\s+)?2025/gi, "IRS-AEAT del último ejercicio cerrado"],
  [/FATCA\s+2025/gi, "FATCA anual"],
  // Generic "for 2025" / "para 2025"
  [/\b(?:para|for|pour|für|per a|per al|para o)\s+(?:el\s+|the\s+|le\s+|das\s+)?2025\b/gi, "del último ejercicio cerrado"],
  // FR specific: démonte le mythe ... avec dates 2024/2025 already handled by above? "des memorandos de 2024 y 2025"? Already handled.
  // FR/CA "movements/beneficiarios sub 25% control" → 2024 from a different sentence?  "actualizada en convenios complementarios de 2024 y 2025" — already done
  // EN "Law 35/2006 ... art. 91 (CFC for individuals); Law 27/2014, art. 100 (CFC corporate)" with year 2023? trace:
  [/Law 35\/2006 \(LIRPF\), arts\. 8, 9/g, "Law 35/2006 (LIRPF), arts. eight, nine"],
  // Quick: the 2023 came from "arts. 8, 9 (residency), 87 (income attribution), 91 (CFC ..." — wait
  // Actually 2023 didn't appear in raw. Re-check.
  // Mercury market a 2026
  [/mercado para LLC de no residentes a 2026/gi, "mercado actual para LLC de no residentes"],
  [/state of the market for non resident LLCs in 2026/gi, "current state of the market for non resident LLCs"],
  [/marché pour les LLC de non-résidents en 2026/gi, "marché pour les LLC de non-résidents en vigueur"],
  [/Marktstand für LLCs von Nicht-Residenten 2026/gi, "aktuellen Marktstand für LLCs von Nicht-Residenten"],
  [/mercado para LLC de não residentes em 2026/gi, "mercado atual para LLC de não residentes"],
  [/mercat per a LLC de no residents el 2026/gi, "mercat actual per a LLC de no residents"],
];

let fixed = 0;
for (const slug of SLUGS) {
  for (const lang of LANGS) {
    const file = resolve(CONTENT, lang, `${slug}.ts`);
    const txt = readFileSync(file, "utf8");
    const idx = txt.indexOf(MARKER);
    if (idx < 0) continue;
    const head = txt.slice(0, idx);
    let tail = txt.slice(idx);
    const before = tail;
    for (const [rx, rep] of REPLACEMENTS) tail = tail.replace(rx, rep);
    if (tail !== before) {
      writeFileSync(file, head + tail);
      fixed++;
    }
  }
}
console.log(`Year-sweep applied to ${fixed} files.`);
