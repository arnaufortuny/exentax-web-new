#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'client/src/data/blog-content');
const LOCALES = ['es', 'en', 'fr', 'de', 'pt', 'ca'];

// Slugs handled by Task #34 — must NOT carry the banking-facts-v1 block
const TASK34_SLUGS = new Set([
  'wise-business-crs-reporting-fiscal',
  'wise-iban-llc-que-reporta-hacienda',
]);

const BANKING_MARKER = '<!-- exentax:banking-facts-v1 -->';
const LEGAL_MARKER = '<!-- exentax:legal-facts-v1 -->';

const LEGAL_TRIGGERS = /\b(BOI|FinCEN|Form\s*5472|Form\s*1120|Corporate\s+Transparency\s+Act|CTA|pro-forma)\b/i;

const LEGAL_BLOCKS = {
  es: `\n\n${LEGAL_MARKER}\n## Hechos legales y de procedimiento (actualización 2026)\n\nLa normativa de información a FinCEN y al IRS se ha movido en 2025-2026; la versión vigente es esta:\n\n- **BOI / Corporate Transparency Act.** Tras la **interim final rule de FinCEN de marzo de 2025**, la obligación de presentar el BOI Report quedó **restringida a "foreign reporting companies"** (entidades constituidas fuera de EE. UU. y registradas para hacer negocios en un estado). Una **LLC formada en EE. UU. por un no residente queda, a día de hoy, fuera de esa obligación**. El estado normativo puede volver a cambiar: hay que **re-verificar en FinCEN.gov en el momento de la presentación**. Si tu LLC se constituyó antes de marzo de 2025 y ya presentaste BOI, se recomienda conservar el acuse y monitorizar futuras actualizaciones.\n- **Form 5472 + 1120 pro-forma.** Para una **Single-Member LLC propiedad de un no residente**, las regulaciones finales de Treas. Reg. §1.6038A-1 (vigentes desde 2017) tratan a la LLC como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo cabecera: nombre, dirección, EIN, ejercicio fiscal) con el **Form 5472 anexado**. Se envía **por correo certificado o fax al IRS Service Center de Ogden, Utah** — **no se presenta vía MeF/e-file** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y año, más 25.000 USD por cada 30 días adicionales** sin presentación tras notificación del IRS.\n- **Form 1120 sustantivo.** Solo aplica si la LLC ha realizado *check-the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 1120 con cifras reales. La LLC disregarded estándar **no presenta un 1120 sustantivo y no paga corporate tax federal**.\n- **EIN y notificaciones.** Sin EIN no se puede presentar 5472 ni BOI. El IRS no avisa antes de sancionar; las multas se descubren al actuar contra el EIN o al rechazar una próxima presentación.\n\nDonde este artículo afirme algo más absoluto sobre BOI, Form 5472 o Form 1120 que lo recogido aquí, esta nota prevalece. Fuentes: \\\`docs/banking-facts-2026.md\\\` §BOI/CTA y §Form 5472.`,
  en: `\n\n${LEGAL_MARKER}\n## Legal & procedural facts (2026 update)\n\nFinCEN and IRS reporting requirements moved in 2025-2026; the current state is:\n\n- **BOI / Corporate Transparency Act.** After **FinCEN's March 2025 interim final rule**, the BOI Report requirement was **narrowed to "foreign reporting companies"** (entities formed outside the US and registered to do business in a state). A **US-formed LLC owned by a non-resident is, as of today, outside that obligation**. The regulatory status can change again: **re-verify at FinCEN.gov at filing time**. If your LLC was formed before March 2025 and you already filed BOI, keep the acknowledgement and monitor future updates.\n- **Form 5472 + pro-forma 1120.** For a **Single-Member LLC owned by a non-resident**, the final regulations of Treas. Reg. §1.6038A-1 (in force since 2017) treat the LLC as a corporation for 5472 purposes. Procedure: **pro-forma Form 1120** (header only: name, address, EIN, tax year) with **Form 5472 attached**. It is filed **by certified mail or fax to the IRS Service Center in Ogden, Utah** — **not e-filed via standard MeF**. Due date: **April 15**; extension via **Form 7004** to **October 15**. **Penalty: $25,000 per form per year, plus $25,000 per additional 30 days** of non-filing after IRS notice.\n- **Substantive Form 1120.** Only applies if the LLC has filed a check-the-box election to C-Corp (Form 8832): it then pays 21 % federal corporate tax and files a substantive 1120. A standard disregarded LLC **does not file a substantive 1120 and does not pay federal corporate tax**.\n- **EIN and notice.** Without an EIN you cannot file 5472 or BOI. The IRS does not warn before imposing penalties; you find out when an EIN is flagged or a later filing is rejected.\n\nWhere this article phrases anything more absolutely on BOI, Form 5472 or Form 1120 than the above, this note prevails. Sources: \\\`docs/banking-facts-2026.md\\\` §BOI/CTA and §Form 5472.`,
  fr: `\n\n${LEGAL_MARKER}\n## Faits légaux & de procédure (mise à jour 2026)\n\nLes obligations FinCEN et IRS ont bougé en 2025-2026 ; voici la version en vigueur :\n\n- **BOI / Corporate Transparency Act.** Après la **interim final rule de FinCEN de mars 2025**, l'obligation de déposer le BOI Report a été **restreinte aux « foreign reporting companies »** (entités constituées hors des États-Unis et enregistrées pour exercer dans un État). Une **LLC formée aux US par un non-résident est, à ce jour, hors de cette obligation**. Le statut peut encore évoluer : **re-vérifier sur FinCEN.gov au moment du dépôt**. Si votre LLC a été constituée avant mars 2025 et que vous avez déjà déposé le BOI, conservez l'accusé et surveillez les mises à jour.\n- **Form 5472 + 1120 pro-forma.** Pour une **Single-Member LLC détenue par un non-résident**, les règlements finals de Treas. Reg. §1.6038A-1 (en vigueur depuis 2017) traitent la LLC comme une corporation pour le 5472. Procédure : **Form 1120 pro-forma** (en-tête uniquement : nom, adresse, EIN, exercice) avec **Form 5472 annexé**. Dépôt **par courrier certifié ou fax à l'IRS Service Center d'Ogden, Utah** — **pas d'e-file via MeF standard**. Échéance : **15 avril** ; prorogation via **Form 7004** jusqu'au **15 octobre**. **Sanction : 25 000 USD par formulaire et par an, plus 25 000 USD par tranche supplémentaire de 30 jours** de non-dépôt après notification IRS.\n- **Form 1120 substantif.** Ne s'applique que si la LLC a effectué une *check-the-box election* vers C-Corp (Form 8832) : elle est alors taxée à 21 % au niveau fédéral et dépose un 1120 chiffré. Une LLC disregarded standard **ne dépose pas de 1120 substantif et ne paye pas l'impôt fédéral sur les sociétés**.\n- **EIN et notification.** Sans EIN, ni 5472 ni BOI ne peut être déposé. L'IRS ne prévient pas avant de sanctionner ; on s'en aperçoit quand l'EIN est bloqué ou qu'un dépôt ultérieur est rejeté.\n\nLà où cet article formule quelque chose de plus absolu sur BOI, Form 5472 ou Form 1120, cette note prévaut. Sources : \\\`docs/banking-facts-2026.md\\\` §BOI/CTA et §Form 5472.`,
  de: `\n\n${LEGAL_MARKER}\n## Rechts- und Verfahrensfakten (Update 2026)\n\nDie Meldepflichten gegenüber FinCEN und IRS haben sich 2025-2026 bewegt; aktueller Stand:\n\n- **BOI / Corporate Transparency Act.** Nach der **FinCEN Interim Final Rule vom März 2025** wurde die BOI-Meldepflicht **auf „foreign reporting companies" beschränkt** (außerhalb der USA gegründete Einheiten, die in einem Bundesstaat zur Geschäftstätigkeit registriert sind). Eine **in den USA von einem Nicht-Residenten gegründete LLC fällt heute außerhalb dieser Pflicht**. Der Regelstatus kann erneut wechseln: **Bei Einreichung auf FinCEN.gov prüfen**. Wenn Ihre LLC vor März 2025 gegründet wurde und das BOI bereits eingereicht ist, Bestätigung aufbewahren und Updates beobachten.\n- **Form 5472 + Pro-forma-1120.** Für eine **Single-Member LLC im Eigentum eines Nicht-Residenten** behandeln die Schlussregelungen Treas. Reg. §1.6038A-1 (seit 2017 in Kraft) die LLC für 5472-Zwecke als Corporation. Verfahren: **Pro-forma Form 1120** (nur Kopf: Name, Adresse, EIN, Steuerjahr) mit **Form 5472 als Anlage**. Einreichung **per Einschreiben oder Fax an das IRS Service Center Ogden, Utah** — **keine E-Einreichung über das Standard-MeF**. Frist: **15. April**; Verlängerung über **Form 7004** bis **15. Oktober**. **Sanktion: 25.000 USD pro Formular und Jahr, plus 25.000 USD je weitere 30 Tage** Nichteinreichung nach IRS-Mitteilung.\n- **Substantielles Form 1120.** Nur wenn die LLC per Check-the-Box-Wahl zur C-Corp optiert hat (Form 8832): dann 21 % Bundessteuer und ein substantielles 1120. Eine Standard-disregarded LLC **reicht kein substantielles 1120 ein und zahlt keine bundesstaatliche Körperschaftsteuer**.\n- **EIN und Benachrichtigung.** Ohne EIN ist weder 5472 noch BOI einreichbar. Der IRS warnt nicht vor Sanktionen; man bemerkt es, wenn die EIN gesperrt oder eine spätere Einreichung abgelehnt wird.\n\nWo dieser Artikel zu BOI, Form 5472 oder Form 1120 absoluter formuliert, gilt diese Notiz vorrangig. Quellen: \\\`docs/banking-facts-2026.md\\\` §BOI/CTA und §Form 5472.`,
  pt: `\n\n${LEGAL_MARKER}\n## Factos legais e de procedimento (atualização 2026)\n\nAs obrigações junto da FinCEN e do IRS mudaram em 2025-2026; eis o estado atual:\n\n- **BOI / Corporate Transparency Act.** Após a **interim final rule da FinCEN de março de 2025**, a obrigação do BOI Report foi **restringida a "foreign reporting companies"** (entidades constituídas fora dos EUA e registadas para operar num estado). Uma **LLC formada nos EUA por um não residente está, hoje, fora dessa obrigação**. O estado regulatório pode mudar de novo: **reverificar em FinCEN.gov no momento da submissão**. Se a tua LLC foi constituída antes de março de 2025 e já submeteste o BOI, guarda o comprovativo e monitoriza atualizações.\n- **Form 5472 + 1120 pro-forma.** Para uma **Single-Member LLC detida por um não residente**, as regulamentações finais Treas. Reg. §1.6038A-1 (em vigor desde 2017) tratam a LLC como corporation para efeitos do 5472. Procedimento: **Form 1120 pro-forma** (apenas cabeçalho: nome, morada, EIN, exercício) com **Form 5472 anexado**. Envio **por correio certificado ou fax para o IRS Service Center em Ogden, Utah** — **não via MeF/e-file** padrão. Prazo: **15 de abril**; prorrogação via **Form 7004** até **15 de outubro**. **Sanção: 25.000 USD por formulário e ano, mais 25.000 USD por cada 30 dias adicionais** de não submissão após notificação do IRS.\n- **Form 1120 substantivo.** Só se aplica se a LLC tiver feito check-the-box election para C-Corp (Form 8832): tributa a 21 % federal e apresenta 1120 com valores reais. A LLC disregarded padrão **não apresenta 1120 substantivo e não paga corporate tax federal**.\n- **EIN e notificações.** Sem EIN não se submete 5472 nem BOI. O IRS não avisa antes de sancionar; descobre-se quando o EIN é bloqueado ou uma submissão posterior é rejeitada.\n\nQuando este artigo formula algo mais absoluto sobre BOI, Form 5472 ou Form 1120, esta nota prevalece. Fontes: \\\`docs/banking-facts-2026.md\\\` §BOI/CTA e §Form 5472.`,
  ca: `\n\n${LEGAL_MARKER}\n## Fets legals i de procediment (actualització 2026)\n\nLes obligacions davant la FinCEN i l'IRS s'han mogut en 2025-2026; aquest és l'estat vigent:\n\n- **BOI / Corporate Transparency Act.** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a "foreign reporting companies"** (entitats constituïdes fora dels EUA i registrades per operar en un estat). Una **LLC formada als EUA per un no resident està, avui, fora d'aquesta obligació**. L'estat normatiu pot tornar a canviar: **cal re-verificar a FinCEN.gov en el moment de la presentació**. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament i monitoritza actualitzacions.\n- **Form 5472 + 1120 pro-forma.** Per a una **Single-Member LLC propietat d'un no resident**, les regulacions finals Treas. Reg. §1.6038A-1 (vigents des de 2017) tracten la LLC com a corporation a efectes del 5472. Procediment: **Form 1120 pro-forma** (només capçalera: nom, adreça, EIN, exercici) amb **Form 5472 annexat**. Enviament **per correu certificat o fax a l'IRS Service Center d'Ogden, Utah** — **no via MeF/e-file** estàndard. Venciment: **15 d'abril**; pròrroga via **Form 7004** fins al **15 d'octubre**. **Sanció: 25.000 USD per formulari i any, més 25.000 USD per cada 30 dies addicionals** de no presentació després de notificació de l'IRS.\n- **Form 1120 substantiu.** Només aplica si la LLC ha fet check-the-box election a C-Corp (Form 8832): tributa al 21 % federal i presenta un 1120 amb xifres reals. La LLC disregarded estàndard **no presenta un 1120 substantiu i no paga corporate tax federal**.\n- **EIN i notificacions.** Sense EIN no es pot presentar el 5472 ni el BOI. L'IRS no avisa abans de sancionar; es descobreix quan l'EIN queda bloquejat o una presentació posterior és rebutjada.\n\nQuan aquest article afirmi alguna cosa més absoluta sobre BOI, Form 5472 o Form 1120, aquesta nota preval. Fonts: \\\`docs/banking-facts-2026.md\\\` §BOI/CTA i §Form 5472.`,
};

// In-body inline corrections — narrow BOI mandatory claims to current state
const BOI_INLINE = {
  es: [
    [/\*\*Todas las LLCs y Corporations registradas en cualquier estado de EE\.\s*UU\.\*\* están obligadas a presentar el BOI Report[^.]*\./g,
     'La obligación de BOI Report **fue restringida por la interim final rule de FinCEN de marzo de 2025 a las "foreign reporting companies"** (entidades constituidas fuera de EE. UU. y registradas en un estado). Las **LLC formadas en EE. UU., aunque sean propiedad de no residentes, quedan hoy fuera de esa obligación**. Antes de marzo de 2025 sí era obligatorio para todas; ahora **debes verificar el estado vigente en FinCEN.gov antes de presentar**, porque la regla puede volver a cambiar.'],
  ],
  en: [
    [/\*\*All LLCs and Corporations registered in any US state\*\* are required to file the BOI Report[^.]*\./g,
     'The BOI Report obligation was **narrowed by FinCEN\'s interim final rule of March 2025 to "foreign reporting companies"** (entities formed outside the US and registered in a state). **US-formed LLCs, even when owned by non-residents, are currently outside that obligation**. Before March 2025 it was mandatory for all; you should now **verify the current status on FinCEN.gov before filing**, because the rule can change again.'],
  ],
  fr: [], de: [], pt: [], ca: [],
};

const stats = { stripped: 0, legal_appended: 0, boi_inline: 0, modified: 0, total: 0 };

function processFile(loc, file) {
  const full = path.join(ROOT, loc, file);
  let src = fs.readFileSync(full, 'utf8');
  const original = src;
  stats.total++;

  const slug = file.replace(/\.ts$/, '');

  // 1. Strip banking-facts block from Task #34 slugs
  if (TASK34_SLUGS.has(slug) && src.includes(BANKING_MARKER)) {
    src = src.replace(/\n+<!-- exentax:banking-facts-v1 -->[\s\S]*?(?=`;\s*$)/, '\n');
    stats.stripped++;
  }

  // 2. Append legal-facts-v1 if triggers present and marker absent
  if (LEGAL_TRIGGERS.test(src) && !src.includes(LEGAL_MARKER)) {
    src = src.replace(/`;\s*$/, LEGAL_BLOCKS[loc] + '`;\n');
    stats.legal_appended++;
  }

  // 3. In-body BOI corrections
  for (const [pat, rep] of (BOI_INLINE[loc] || [])) {
    const before = src;
    src = src.replace(pat, rep);
    if (src !== before) stats.boi_inline++;
  }

  if (src !== original) {
    fs.writeFileSync(full, src);
    stats.modified++;
  }
}

for (const loc of LOCALES) {
  const dir = path.join(ROOT, loc);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
  for (const f of files) processFile(loc, f);
}

console.log(JSON.stringify(stats, null, 2));
