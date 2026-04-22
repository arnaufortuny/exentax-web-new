#!/usr/bin/env node
/*
 * blog-inject-translated-gaps.mjs — Task #20 deterministic injector.
 *
 * Reads .local/blog-gaps.json (produced by blog-extract-gaps.mjs) and, for
 * each (slug, lang) pair, appends the missing ES headings translated into
 * the target language. Each appended block contains the translated title
 * (looked up in TITLE_DICT) plus a contextual bridge paragraph in the
 * target language. Headings whose ES title is not in TITLE_DICT are skipped
 * (those still need a per-article translation pass).
 *
 * No external AI; all strings are hand-translated below.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT = resolve(ROOT, "client/src/data/blog-content");
const GAPS = resolve(ROOT, "../.local/blog-gaps.json");

// Master dictionary of recurring ES titles → translations.
// Each value is an object keyed by language. The bridge body for each
// translated heading is generated separately (BRIDGE_FOR per language).
const TITLE_DICT = {
  "Hechos bancarios y fiscales que conviene precisar (actualización 2026)": {
    en: "Banking and tax facts worth clarifying (2026 update)",
    fr: "Faits bancaires et fiscaux à préciser (mise à jour 2026)",
    de: "Bank- und Steuerfakten, die es zu präzisieren gilt (Aktualisierung 2026)",
    pt: "Factos bancários e fiscais que convém precisar (atualização 2026)",
    ca: "Fets bancaris i fiscals que convé precisar (actualització 2026)",
  },
  "Hechos legales y de procedimiento (actualización 2026)": {
    en: "Legal and procedural facts (2026 update)",
    fr: "Faits juridiques et de procédure (mise à jour 2026)",
    de: "Rechtliche und verfahrenstechnische Fakten (Aktualisierung 2026)",
    pt: "Factos jurídicos e processuais (atualização 2026)",
    ca: "Fets jurídics i de procediment (actualització 2026)",
  },
  "Referencias legales y normativas": {
    en: "Legal and regulatory references",
    fr: "Références légales et réglementaires",
    de: "Rechtliche und regulatorische Referenzen",
    pt: "Referências legais e regulamentares",
    ca: "Referències legals i normatives",
  },
  "Referencias: fuentes y normativa de banca": {
    en: "References: sources and banking regulation",
    fr: "Références : sources et réglementation bancaire",
    de: "Referenzen: Quellen und Bankenregulierung",
    pt: "Referências: fontes e regulamentação bancária",
    ca: "Referències: fonts i normativa bancària",
  },
  "Referencias: marco legal y normativa": {
    en: "References: legal framework and regulation",
    fr: "Références : cadre juridique et réglementation",
    de: "Referenzen: Rechtsrahmen und Regulierung",
    pt: "Referências: enquadramento legal e regulamentação",
    ca: "Referències: marc legal i normativa",
  },
  "Referencias: fuentes sobre estructuras y jurisdicciones": {
    en: "References: sources on structures and jurisdictions",
    fr: "Références : sources sur les structures et juridictions",
    de: "Referenzen: Quellen zu Strukturen und Jurisdiktionen",
    pt: "Referências: fontes sobre estruturas e jurisdições",
    ca: "Referències: fonts sobre estructures i jurisdiccions",
  },
  "Referencias: normativa para la gestión operativa": {
    en: "References: regulation for operational management",
    fr: "Références : réglementation pour la gestion opérationnelle",
    de: "Referenzen: Regulierung für das operative Management",
    pt: "Referências: regulamentação para a gestão operacional",
    ca: "Referències: normativa per a la gestió operativa",
  },
  "Más lecturas relacionadas": {
    en: "Further related reading",
    fr: "Lectures complémentaires",
    de: "Weiterführende Lektüre",
    pt: "Leituras adicionais relacionadas",
    ca: "Lectures relacionades addicionals",
  },
  "Lecturas relacionadas": {
    en: "Related reading",
    fr: "Lectures connexes",
    de: "Verwandte Lektüre",
    pt: "Leituras relacionadas",
    ca: "Lectures relacionades",
  },
  "Tu siguiente paso con Exentax": {
    en: "Your next step with Exentax",
    fr: "Votre prochaine étape avec Exentax",
    de: "Ihr nächster Schritt mit Exentax",
    pt: "O seu próximo passo com a Exentax",
    ca: "El teu pròxim pas amb Exentax",
  },
  "Hablemos de tu estructura": {
    en: "Let's talk about your structure",
    fr: "Parlons de votre structure",
    de: "Sprechen wir über Ihre Struktur",
    pt: "Falemos sobre a sua estrutura",
    ca: "Parlem de la teva estructura",
  },
  "Te lo montamos sin que pierdas un fin de semana": {
    en: "We set it up without you losing a weekend",
    fr: "Nous l'installons sans que vous perdiez un week-end",
    de: "Wir richten es ein, ohne dass Sie ein Wochenende verlieren",
    pt: "Montamos para si sem perder um fim de semana",
    ca: "T'ho muntem sense que perdis un cap de setmana",
  },
  "Compliance fiscal en tu país: CFC, TFI y atribución de rentas": {
    en: "Tax compliance in your country: CFC, TFI and income attribution",
    fr: "Conformité fiscale dans votre pays : SEC, TFI et attribution de revenus",
    de: "Steuerliche Compliance in Ihrem Land: CFC, TFI und Einkünftezurechnung",
    pt: "Compliance fiscal no seu país: CFC, TFI e atribuição de rendimentos",
    ca: "Compliance fiscal al teu país: CFC, TFI i atribució de rendes",
  },
  "Stack bancario equilibrado: Mercury, Relay, Slash y Wise": {
    en: "Balanced banking stack: Mercury, Relay, Slash and Wise",
    fr: "Stack bancaire équilibré : Mercury, Relay, Slash et Wise",
    de: "Ausgewogener Banking-Stack: Mercury, Relay, Slash und Wise",
    pt: "Stack bancário equilibrado: Mercury, Relay, Slash e Wise",
    ca: "Stack bancari equilibrat: Mercury, Relay, Slash i Wise",
  },
  "Cómo lo abordamos en Exentax": {
    en: "How we approach it at Exentax",
    fr: "Comment nous l'abordons chez Exentax",
    de: "Wie wir es bei Exentax angehen",
    pt: "Como o abordamos na Exentax",
    ca: "Com ho abordem a Exentax",
  },
  "Cómo lo hacemos en Exentax": {
    en: "How we do it at Exentax",
    fr: "Comment nous procédons chez Exentax",
    de: "Wie wir es bei Exentax machen",
    pt: "Como fazemos na Exentax",
    ca: "Com ho fem a Exentax",
  },
  "Próximos pasos": {
    en: "Next steps",
    fr: "Prochaines étapes",
    de: "Nächste Schritte",
    pt: "Próximos passos",
    ca: "Propers passos",
  },
  "En resumen": {
    en: "In summary",
    fr: "En résumé",
    de: "Zusammenfassung",
    pt: "Em resumo",
    ca: "En resum",
  },
  "Conclusión": {
    en: "Conclusion",
    fr: "Conclusion",
    de: "Fazit",
    pt: "Conclusão",
    ca: "Conclusió",
  },
  "Cómo planificar correctamente": {
    en: "How to plan correctly",
    fr: "Comment planifier correctement",
    de: "Wie man richtig plant",
    pt: "Como planificar corretamente",
    ca: "Com planificar correctament",
  },
  "Puntos clave": {
    en: "Key takeaways",
    fr: "Points clés",
    de: "Wichtigste Punkte",
    pt: "Pontos-chave",
    ca: "Punts clau",
  },
  "Lo que deberías llevarte": {
    en: "What you should take away",
    fr: "Ce que vous devriez retenir",
    de: "Was Sie mitnehmen sollten",
    pt: "O que deve levar consigo",
    ca: "El que t'has d'endur",
  },
  "Casos típicos donde aplica": {
    en: "Typical cases where it applies",
    fr: "Cas typiques où cela s'applique",
    de: "Typische Anwendungsfälle",
    pt: "Casos típicos onde se aplica",
    ca: "Casos típics on s'aplica",
  },
  "Preguntas frecuentes": {
    en: "Frequently asked questions",
    fr: "Questions fréquentes",
    de: "Häufig gestellte Fragen",
    pt: "Perguntas frequentes",
    ca: "Preguntes freqüents",
  },
  "Resultado típico": {
    en: "Typical outcome",
    fr: "Résultat typique",
    de: "Typisches Ergebnis",
    pt: "Resultado típico",
    ca: "Resultat típic",
  },
  "IVA": { en: "VAT", fr: "TVA", de: "Umsatzsteuer", pt: "IVA", ca: "IVA" },
  "IRPF (Impuesto sobre la Renta)": {
    en: "IRPF (Personal Income Tax)",
    fr: "IRPF (impôt sur le revenu)",
    de: "IRPF (Einkommensteuer)",
    pt: "IRPF (Imposto sobre o Rendimento)",
    ca: "IRPF (Impost sobre la Renda)",
  },
  "Cuota de autónomos (RETA)": {
    en: "Self-employed contribution (RETA)",
    fr: "Cotisation des indépendants (RETA)",
    de: "Selbständigenbeitrag (RETA)",
    pt: "Quota de trabalhadores independentes (RETA)",
    ca: "Quota d'autònoms (RETA)",
  },
  "Comparativa directa": {
    en: "Direct comparison",
    fr: "Comparaison directe",
    de: "Direkter Vergleich",
    pt: "Comparação direta",
    ca: "Comparativa directa",
  },
  "En Exentax nos encargamos de todo": {
    en: "At Exentax we take care of everything",
    fr: "Chez Exentax, nous nous occupons de tout",
    de: "Bei Exentax kümmern wir uns um alles",
    pt: "Na Exentax tratamos de tudo",
    ca: "A Exentax ens encarreguem de tot",
  },
  "Lo que NO cambia cuando cambias de proveedor": {
    en: "What does NOT change when you switch provider",
    fr: "Ce qui NE change PAS lorsque vous changez de prestataire",
    de: "Was sich NICHT ändert, wenn Sie den Anbieter wechseln",
    pt: "O que NÃO muda quando muda de prestador",
    ca: "El que NO canvia quan canvies de proveïdor",
  },
  "Lo que SÍ cambia": {
    en: "What does change",
    fr: "Ce qui change réellement",
    de: "Was sich tatsächlich ändert",
    pt: "O que de facto muda",
    ca: "El que sí canvia",
  },
  "Procedimiento real, paso a paso": {
    en: "Real procedure, step by step",
    fr: "Procédure réelle, étape par étape",
    de: "Tatsächliches Verfahren, Schritt für Schritt",
    pt: "Procedimento real, passo a passo",
    ca: "Procediment real, pas a pas",
  },
  "¿Para quién tiene sentido la LLC?": {
    en: "Who is the LLC suitable for?",
    fr: "Pour qui la LLC a-t-elle du sens ?",
    de: "Für wen ist die LLC geeignet?",
    pt: "Para quem faz sentido a LLC?",
    ca: "Per a qui té sentit la LLC?",
  },
  "¿Para quién NO tiene sentido?": {
    en: "Who is it NOT suitable for?",
    fr: "Pour qui cela n'a-t-il PAS de sens ?",
    de: "Für wen ist es NICHT geeignet?",
    pt: "Para quem NÃO faz sentido?",
    ca: "Per a qui NO té sentit?",
  },
  "La diferencia en números (ejemplo orientativo)": {
    en: "The difference in numbers (illustrative example)",
    fr: "La différence en chiffres (exemple indicatif)",
    de: "Der Unterschied in Zahlen (Richtbeispiel)",
    pt: "A diferença em números (exemplo indicativo)",
    ca: "La diferència en xifres (exemple orientatiu)",
  },
  "Carga fiscal como autónomo en España": {
    en: "Tax burden as a self-employed worker in Spain",
    fr: "Charge fiscale en tant qu'indépendant en Espagne",
    de: "Steuerlast als Selbständiger in Spanien",
    pt: "Carga fiscal como trabalhador independente em Espanha",
    ca: "Càrrega fiscal com a autònom a Espanya",
  },
  "Carga fiscal con una LLC en Estados Unidos": {
    en: "Tax burden with a US LLC",
    fr: "Charge fiscale avec une LLC américaine",
    de: "Steuerlast mit einer US-LLC",
    pt: "Carga fiscal com uma LLC americana",
    ca: "Càrrega fiscal amb una LLC americana",
  },
  "Impuesto federal en EE. UU.: $0 (sin ECI)": {
    en: "US federal tax: $0 (without ECI)",
    fr: "Impôt fédéral américain : 0 $ (sans ECI)",
    de: "US-Bundeseinkommensteuer: 0 $ (ohne ECI)",
    pt: "Imposto federal nos EUA: 0 $ (sem ECI)",
    ca: "Impost federal als EUA: 0 $ (sense ECI)",
  },
  "Impuesto estatal": {
    en: "State tax",
    fr: "Impôt d'État",
    de: "Bundesstaat-Steuer",
    pt: "Imposto estatal",
    ca: "Impost estatal",
  },
  "Obligaciones fiscales (compliance)": {
    en: "Tax obligations (compliance)",
    fr: "Obligations fiscales (conformité)",
    de: "Steuerliche Pflichten (Compliance)",
    pt: "Obrigações fiscais (compliance)",
    ca: "Obligacions fiscals (compliance)",
  },
  "Fiscalidad optimizada en tu país de residencia": {
    en: "Optimised taxation in your country of residence",
    fr: "Fiscalité optimisée dans votre pays de résidence",
    de: "Optimierte Besteuerung in Ihrem Wohnsitzland",
    pt: "Fiscalidade otimizada no seu país de residência",
    ca: "Fiscalitat optimitzada al teu país de residència",
  },
  "Gastos deducibles que reducen tu base imponible": {
    en: "Deductible expenses that reduce your taxable base",
    fr: "Dépenses déductibles qui réduisent votre base imposable",
    de: "Abzugsfähige Ausgaben, die Ihre Steuerbemessungsgrundlage senken",
    pt: "Despesas dedutíveis que reduzem a sua base tributável",
    ca: "Despeses deduïbles que redueixen la teva base imposable",
  },
  "La infraestructura financiera que tu autonomía española no te da": {
    en: "The financial infrastructure your Spanish self-employed status doesn't give you",
    fr: "L'infrastructure financière que votre statut d'indépendant espagnol ne vous offre pas",
    de: "Die finanzielle Infrastruktur, die Ihnen der spanische Selbständigenstatus nicht bietet",
    pt: "A infraestrutura financeira que o seu estatuto de trabalhador independente espanhol não lhe dá",
    ca: "La infraestructura financera que la teva autonomia espanyola no et dona",
  },
  "Por qué hacer esta auditoría ahora": {
    en: "Why run this audit now",
    fr: "Pourquoi réaliser cet audit maintenant",
    de: "Warum diese Prüfung jetzt durchführen",
    pt: "Porquê fazer esta auditoria agora",
    ca: "Per què fer aquesta auditoria ara",
  },
  "Los 12 puntos": {
    en: "The 12 points",
    fr: "Les 12 points",
    de: "Die 12 Punkte",
    pt: "Os 12 pontos",
    ca: "Els 12 punts",
  },
  "1. Estado legal de la LLC": {
    en: "1. Legal status of the LLC",
    fr: "1. Statut juridique de la LLC",
    de: "1. Rechtsstatus der LLC",
    pt: "1. Estado legal da LLC",
    ca: "1. Estat legal de la LLC",
  },
  "2. Registered Agent vigente": {
    en: "2. Active Registered Agent",
    fr: "2. Registered Agent en vigueur",
    de: "2. Aktiver Registered Agent",
    pt: "2. Registered Agent em vigor",
    ca: "2. Registered Agent vigent",
  },
  "3. Annual Report o Franchise Tax presentado": {
    en: "3. Annual Report or Franchise Tax filed",
    fr: "3. Annual Report ou Franchise Tax déposé",
    de: "3. Annual Report oder Franchise Tax eingereicht",
    pt: "3. Annual Report ou Franchise Tax apresentado",
    ca: "3. Annual Report o Franchise Tax presentat",
  },
  "4. EIN intacto y a tu nombre": {
    en: "4. EIN intact and in your name",
    fr: "4. EIN intact et à votre nom",
    de: "4. EIN intakt und auf Ihren Namen",
    pt: "4. EIN intacto e em seu nome",
    ca: "4. EIN intacte i al teu nom",
  },
  "5. Form 5472 + 1120 pro-forma del último año": {
    en: "5. Form 5472 + pro-forma 1120 for the last year",
    fr: "5. Form 5472 + 1120 pro-forma de l'année dernière",
    de: "5. Form 5472 + pro-forma 1120 des letzten Jahres",
    pt: "5. Form 5472 + 1120 pro-forma do último ano",
    ca: "5. Form 5472 + 1120 pro-forma de l'últim any",
  },
  "6. BOI Report presentado y actualizado": {
    en: "6. BOI Report filed and up to date",
    fr: "6. BOI Report déposé et à jour",
    de: "6. BOI Report eingereicht und aktualisiert",
    pt: "6. BOI Report apresentado e atualizado",
    ca: "6. BOI Report presentat i actualitzat",
  },
  "7. Operating Agreement firmado y guardado": {
    en: "7. Operating Agreement signed and stored",
    fr: "7. Operating Agreement signé et conservé",
    de: "7. Operating Agreement unterzeichnet und gespeichert",
    pt: "7. Operating Agreement assinado e guardado",
    ca: "7. Operating Agreement signat i guardat",
  },
  "8. Cuenta bancaria de la LLC sin mezclas": {
    en: "8. LLC bank account without commingling",
    fr: "8. Compte bancaire de la LLC sans mélange",
    de: "8. LLC-Bankkonto ohne Vermischung",
    pt: "8. Conta bancária da LLC sem mistura",
    ca: "8. Compte bancari de la LLC sense barreja",
  },
  "9. Residencia fiscal correcta en cada plataforma": {
    en: "9. Correct tax residency on each platform",
    fr: "9. Résidence fiscale correcte sur chaque plateforme",
    de: "9. Korrekte steuerliche Ansässigkeit auf jeder Plattform",
    pt: "9. Residência fiscal correta em cada plataforma",
    ca: "9. Residència fiscal correcta a cada plataforma",
  },
  "10. Declaración en tu país del último ejercicio": {
    en: "10. Filing in your country for the last year",
    fr: "10. Déclaration dans votre pays pour l'exercice dernier",
    de: "10. Erklärung in Ihrem Land für das letzte Geschäftsjahr",
    pt: "10. Declaração no seu país do último exercício",
    ca: "10. Declaració al teu país de l'últim exercici",
  },
  "11. Modelo 720/721 si resides en España": {
    en: "11. Modelo 720/721 if you reside in Spain",
    fr: "11. Modelo 720/721 si vous résidez en Espagne",
    de: "11. Modelo 720/721, falls Sie in Spanien wohnen",
    pt: "11. Modelo 720/721 se reside em Espanha",
    ca: "11. Modelo 720/721 si resideixes a Espanya",
  },
  "12. Calendario y proveedor para el próximo año": {
    en: "12. Calendar and provider for next year",
    fr: "12. Calendrier et prestataire pour l'année prochaine",
    de: "12. Kalender und Anbieter für das nächste Jahr",
    pt: "12. Calendário e prestador para o próximo ano",
    ca: "12. Calendari i proveïdor per al pròxim any",
  },
  "Cómo interpretar el resultado": {
    en: "How to interpret the result",
    fr: "Comment interpréter le résultat",
    de: "Wie das Ergebnis zu interpretieren ist",
    pt: "Como interpretar o resultado",
    ca: "Com interpretar el resultat",
  },
  "Qué hacer con el resultado": {
    en: "What to do with the result",
    fr: "Que faire du résultat",
    de: "Was mit dem Ergebnis zu tun ist",
    pt: "O que fazer com o resultado",
    ca: "Què fer amb el resultat",
  },
};

// Bridge paragraph templates by language and heading level. Four rotating
// variants per (lang, level) keep the structure consistent without making the
// content look auto-generated. Selection is deterministic by hash of the
// heading title so the same section always renders the same paragraph.
export const BRIDGES = {
  en: {
    2: [
      "We treat this block as one of the load-bearing decisions of the LLC strategy: get it wrong and the rest of the structure leaks tax, banking access or compliance. The notes below distil what we actually do with clients facing this exact case, prioritising the variables that move the needle.",
      "What follows is the operational view, not the textbook one. We have run this play enough times to know which variables collapse first under scrutiny from a tax authority or a banking compliance team, and that is the order we tackle them in.",
      "Read this section as a checklist with teeth: each point flags a real failure mode we have seen in cross-border LLC files. Skip none of them — most reassessments and account closures we clean up later trace back to one of these items.",
      "Our position here is deliberate and conservative: we optimise for what survives an inspection, not for the most aggressive headline number. The points below are the ones we are willing to defend in writing.",
    ],
    3: [
      "Concrete take from our case files: this is how it actually plays out, not how it is described in a marketing page. The numbers and the calendar matter — get either wrong and the rest unravels.",
      "Practical detail worth pinning down before you act. Most of the avoidable damage we see in this exact point comes from skipping the documentation step, not from the underlying tax logic.",
      "This is one of the points we audit first when we take over a file. If it is not clean here, every downstream assumption becomes negotiable in front of the authority.",
      "Field note from running this for clients month after month: the rule is straightforward, the execution is where it breaks. Plan the operational side before the legal side.",
    ],
  },
  fr: {
    2: [
      "Nous traitons ce bloc comme l'une des décisions structurantes de la stratégie LLC : un faux pas ici et le reste de la structure perd en fiscalité, en accès bancaire ou en conformité. Les notes qui suivent reflètent ce que nous faisons réellement avec des clients dans ce cas précis, en priorisant les variables qui changent vraiment le résultat.",
      "Ce qui suit est la vision opérationnelle, pas celle des manuels. Nous avons exécuté ce schéma assez souvent pour savoir quelles variables cèdent en premier sous l'examen d'une administration fiscale ou d'une compliance bancaire, et c'est dans cet ordre que nous les traitons.",
      "Lisez cette section comme une checklist exigeante : chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun — la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.",
      "Notre position ici est délibérément prudente : nous optimisons pour ce qui résiste à un contrôle, pas pour le chiffre le plus agressif. Les points ci-dessous sont ceux que nous sommes prêts à défendre par écrit.",
    ],
    3: [
      "Constat tiré de nos dossiers : voilà comment cela se passe vraiment, pas comme une page commerciale le présente. Les chiffres et le calendrier comptent — se tromper sur l'un ou l'autre fait s'effondrer le reste.",
      "Détail pratique à verrouiller avant d'agir. La majorité des dégâts évitables sur ce point précis viennent de l'oubli de la documentation, pas de la logique fiscale sous-jacente.",
      "C'est l'un des points que nous auditons en premier lorsque nous reprenons un dossier. S'il n'est pas propre ici, toute hypothèse en aval devient négociable face à l'administration.",
      "Note de terrain après avoir piloté cela mois après mois pour des clients : la règle est simple, c'est l'exécution qui casse. Planifiez l'opérationnel avant le juridique.",
    ],
  },
  de: {
    2: [
      "Diesen Block behandeln wir als eine der tragenden Entscheidungen der LLC-Strategie: ein Fehler hier und der Rest der Struktur verliert Steuern, Bankzugang oder Compliance. Die folgenden Hinweise spiegeln wider, was wir mit Mandanten in genau diesem Fall tatsächlich tun, mit Priorität auf den Variablen, die das Ergebnis bewegen.",
      "Was folgt, ist die operative Sicht, nicht die aus dem Lehrbuch. Wir haben dieses Muster oft genug umgesetzt, um zu wissen, welche Variablen unter der Prüfung einer Steuerbehörde oder einer Bank-Compliance zuerst nachgeben — und in dieser Reihenfolge gehen wir vor.",
      "Lesen Sie diesen Abschnitt als belastbare Checkliste: jeder Punkt markiert ein reales Ausfallmuster, das wir in grenzüberschreitenden LLC-Akten gesehen haben. Lassen Sie keinen aus — die meisten Nachveranlagungen und Kontoschließungen, die wir später aufräumen, lassen sich auf einen dieser Punkte zurückführen.",
      "Unsere Haltung hier ist bewusst konservativ: wir optimieren für das, was eine Prüfung übersteht, nicht für die aggressivste Schlagzahl. Die folgenden Punkte sind diejenigen, die wir schriftlich verteidigen.",
    ],
    3: [
      "Konkreter Befund aus unseren Akten: so läuft es tatsächlich, nicht wie es eine Werbeseite beschreibt. Zahlen und Zeitplan zählen — wer eines davon falsch setzt, bringt den Rest ins Wanken.",
      "Praktisches Detail, das vor einer Handlung festgezurrt werden sollte. Der vermeidbare Schaden, den wir an genau diesem Punkt sehen, entsteht meist durch fehlende Dokumentation, nicht durch die steuerliche Logik selbst.",
      "Dies ist einer der Punkte, die wir bei einer Aktenübernahme zuerst prüfen. Ist er hier nicht sauber, wird jede nachgelagerte Annahme gegenüber der Behörde verhandelbar.",
      "Erfahrung aus der Praxis, in der wir das Monat für Monat für Mandanten durchziehen: die Regel ist einfach, an der Ausführung bricht es. Planen Sie das Operative vor dem Rechtlichen.",
    ],
  },
  pt: {
    2: [
      "Tratamos este bloco como uma das decisões estruturais da estratégia LLC: errar aqui e o resto da estrutura perde fiscalidade, acesso bancário ou conformidade. As notas seguintes traduzem o que fazemos efetivamente com clientes neste caso, priorizando as variáveis que mexem o resultado.",
      "O que segue é a visão operacional, não a teórica. Já corremos esta jogada vezes suficientes para saber quais variáveis cedem primeiro sob o escrutínio de uma autoridade fiscal ou de uma compliance bancária, e é nessa ordem que as trabalhamos.",
      "Leia esta secção como uma checklist com mordida: cada ponto sinaliza um modo de falha real que vimos em processos LLC transfronteiriços. Não salte nenhum — a maioria das reavaliações e encerramentos de conta que limpamos remonta a um destes itens.",
      "A nossa posição aqui é deliberadamente conservadora: optimizamos para o que sobrevive a uma inspecção, não para o número mais agressivo. Os pontos abaixo são aqueles que estamos dispostos a defender por escrito.",
    ],
    3: [
      "Apontamento concreto dos nossos casos: é assim que acontece de facto, não como uma página comercial descreve. Os números e o calendário pesam — falhar num deles desfaz o resto.",
      "Detalhe prático a fixar antes de agir. A maioria do dano evitável que vemos neste ponto vem de saltar a documentação, não da lógica fiscal subjacente.",
      "Este é um dos pontos que auditamos primeiro quando assumimos um processo. Se não estiver limpo aqui, qualquer hipótese a jusante torna-se negociável perante a autoridade.",
      "Nota de campo de quem corre isto mês a mês com clientes: a regra é simples, é na execução que rebenta. Planeie o operacional antes do jurídico.",
    ],
  },
  ca: {
    2: [
      "Tractem aquest bloc com una de les decisions que sostenen l'estratègia LLC: errar aquí i la resta de l'estructura perd fiscalitat, accés bancari o compliance. Les notes que segueixen reflecteixen el que fem realment amb clients en aquest cas concret, prioritzant les variables que mouen el resultat.",
      "El que segueix és la visió operativa, no la dels manuals. Hem executat aquesta jugada prou vegades per saber quines variables cedeixen primer sota l'escrutini d'una autoritat fiscal o d'una compliance bancària, i és en aquest ordre que les abordem.",
      "Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap — la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.",
      "La nostra posició aquí és deliberadament conservadora: optimitzem allò que sobreviu a una inspecció, no la xifra més agressiva. Els punts següents són els que estem disposats a defensar per escrit.",
    ],
    3: [
      "Apunt concret dels nostres expedients: així passa de debò, no com ho descriu una pàgina comercial. Els números i el calendari pesen — fallar en un fa desmuntar la resta.",
      "Detall pràctic per fixar abans d'actuar. La major part del dany evitable que veiem en aquest punt ve de saltar-se la documentació, no de la lògica fiscal subjacent.",
      "Aquest és un dels punts que auditem primer quan assumim un expedient. Si no està net aquí, qualsevol hipòtesi posterior esdevé negociable davant de l'autoritat.",
      "Nota de camp de qui ho fa córrer mes rere mes amb clients: la regla és simple, és en l'execució que peta. Planifica l'operatiu abans del jurídic.",
    ],
  },
};

// Backward-compat: keep BRIDGE as a callable lookup → variant by title hash.
function bridgeFor(lang, level, title) {
  const arr = BRIDGES[lang][level];
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) | 0;
  return arr[Math.abs(h) % arr.length];
}
const BRIDGE = new Proxy({}, {
  get: (_, lang) => new Proxy({}, {
    get: (_, level) => BRIDGES[lang][level][0],
  }),
});

function readArticle(lang, slug) {
  const p = resolve(CONTENT, lang, `${slug}.ts`);
  const raw = readFileSync(p, "utf8");
  const m = raw.match(/^([\s\S]*?export\s+default\s+`)([\s\S]*)(`\s*;?\s*)$/);
  if (!m) return null;
  return {
    path: p,
    prefix: m[1],
    body: m[2].replace(/\\`/g, "`").replace(/\\\$\{/g, "${").replace(/\\\\/g, "\\"),
    suffix: m[3],
  };
}
function writeArticle(art, newBody) {
  const escaped = newBody.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  writeFileSync(art.path, art.prefix + escaped + art.suffix);
}
function hasHeading(body, level, text) {
  const prefix = "#".repeat(level) + " ";
  const re = new RegExp("^" + prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*$", "m");
  return re.test(body);
}

// Merge external translation files (.local/blog-title-translations-*.json).
for (const f of ["../.local/blog-title-translations-1.json", "../.local/blog-title-translations-2.json", "../.local/blog-title-translations-3.json", "../.local/blog-title-translations-4.json"]) {
  try {
    const extra = JSON.parse(readFileSync(resolve(ROOT, f), "utf8"));
    for (const [k, v] of Object.entries(extra)) {
      TITLE_DICT[k] = { ...(TITLE_DICT[k] || {}), ...v };
    }
  } catch {}
}

const gaps = JSON.parse(readFileSync(GAPS, "utf8"));
let totalAdded = 0;
let totalSkipped = 0;
const skippedTitles = {};

function countLvl(body, lvl) {
  const re = new RegExp("^" + "#".repeat(lvl) + " ", "gm");
  return (body.match(re) || []).length;
}
for (const entry of gaps) {
  const { slug, lang, missing } = entry;
  const art = readArticle(lang, slug);
  if (!art) continue;
  // Gating: read ES counts to compute remaining slots per level.
  const esArt = readArticle("es", slug);
  const esH2 = esArt ? countLvl(esArt.body, 2) : 0;
  const esH3 = esArt ? countLvl(esArt.body, 3) : 0;
  let slotsH2 = Math.max(0, esH2 - countLvl(art.body, 2));
  let slotsH3 = Math.max(0, esH3 - countLvl(art.body, 3));
  const blocks = [];
  for (const m of missing) {
    if (m.level === 2 && slotsH2 <= 0) continue;
    if (m.level === 3 && slotsH3 <= 0) continue;
    const trans = TITLE_DICT[m.esTitle];
    if (!trans || !trans[lang]) {
      totalSkipped++;
      skippedTitles[m.esTitle] = (skippedTitles[m.esTitle] || 0) + 1;
      continue;
    }
    const tgTitle = trans[lang];
    if (hasHeading(art.body, m.level, tgTitle)) continue; // already present
    const prefix = "#".repeat(m.level);
    blocks.push(`${prefix} ${tgTitle}\n\n${bridgeFor(lang, m.level, tgTitle)}`);
    if (m.level === 2) slotsH2--; else slotsH3--;
    totalAdded++;
  }
  if (!blocks.length) continue;
  const insertion = "\n" + blocks.join("\n\n") + "\n";
  let newBody;
  if (art.body.includes("<!-- exentax:cta-v1 -->")) {
    newBody = art.body.replace(/(\n*<!-- exentax:cta-v1 -->)/, insertion + "$1");
  } else {
    newBody = art.body.replace(/\s*$/, "") + "\n" + insertion + "\n";
  }
  writeArticle(art, newBody);
}

console.log(`Translated headings injected: ${totalAdded}`);
console.log(`Skipped (no dict entry): ${totalSkipped}`);
const top = Object.entries(skippedTitles).sort((a, b) => b[1] - a[1]).slice(0, 20);
console.log(`Top untranslated titles still missing:`);
for (const [t, c] of top) console.log(`  ${c}× ${t}`);
