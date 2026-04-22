#!/usr/bin/env node
/*
 * blog-task16-add-florida-i18n.mjs (Task #16)
 * ---------------------------------------------------------------------------
 * Inserts the Florida (`fl`) entry — for each of the three pricing
 * sub-trees `precios.services.plans`, `precios.comparativa.states` and
 * `precios.maintenance.plans` — into every i18n locale file (es, en, fr,
 * de, pt, ca) so that the LLC pricing/comparison/maintenance UIs can
 * render Florida as the 4th supported state. Idempotent: re-running the
 * script after a clean pass produces zero modifications.
 * ---------------------------------------------------------------------------
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const LOCALES = join(REPO, "client", "src", "i18n", "locales");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const SERVICES_FL = {
  es: { badge: "Mercado USA", includes: ["Todo lo incluido en el plan de Wyoming","Constitución en Florida, hub natural para el mercado latinoamericano y europeo en USA","Acceso a infraestructura bancaria local consolidada en Miami","Estructura ideal para e-commerce, consultoría internacional y servicios profesionales","Reputación reconocida ante proveedores de pago y plataformas SaaS","Annual Report obligatorio gestionado dentro del mantenimiento anual"] },
  en: { badge: "US market",  includes: ["Everything included in the Wyoming plan","Florida incorporation, a natural hub for the Latin American and European market in the US","Access to consolidated local banking infrastructure in Miami","Ideal structure for e-commerce, international consulting and professional services","Recognised reputation with payment providers and SaaS platforms","Mandatory Annual Report handled within the yearly maintenance"] },
  fr: { badge: "Marché US",  includes: ["Tout ce qui est inclus dans le plan Wyoming","Constitution en Floride, hub naturel pour le marché latino-américain et européen aux US","Accès à une infrastructure bancaire locale consolidée à Miami","Structure idéale pour e-commerce, conseil international et services professionnels","Réputation reconnue auprès des prestataires de paiement et plateformes SaaS","Annual Report obligatoire géré dans la maintenance annuelle"] },
  de: { badge: "US-Markt",   includes: ["Alles aus dem Wyoming-Paket","Gründung in Florida, natürlicher Hub für den lateinamerikanischen und europäischen Markt in den USA","Zugang zu etablierter lokaler Banking-Infrastruktur in Miami","Ideale Struktur für E-Commerce, internationale Beratung und professionelle Dienstleistungen","Anerkannte Reputation bei Zahlungsanbietern und SaaS-Plattformen","Pflichtmäßiger Annual Report im jährlichen Compliance-Service enthalten"] },
  pt: { badge: "Mercado EUA",includes: ["Tudo o que está incluído no plano de Wyoming","Constituição na Flórida, hub natural para o mercado latino-americano e europeu nos EUA","Acesso a infraestrutura bancária local consolidada em Miami","Estrutura ideal para e-commerce, consultoria internacional e serviços profissionais","Reputação reconhecida junto a provedores de pagamento e plataformas SaaS","Annual Report obrigatório gerido na manutenção anual"] },
  ca: { badge: "Mercat USA", includes: ["Tot el que inclou el pla de Wyoming","Constitució a Florida, hub natural per al mercat llatinoamericà i europeu als EUA","Accés a infraestructura bancària local consolidada a Miami","Estructura ideal per a e-commerce, consultoria internacional i serveis professionals","Reputació reconeguda davant de proveïdors de pagament i plataformes SaaS","Annual Report obligatori gestionat dins del manteniment anual"] },
};

const COMPARATIVA_FL = {
  es: { privacy: "Estándar . Los gestores de la LLC aparecen en registros públicos del estado de Florida.", banking: "Excelente. Hub bancario consolidado en Miami con experiencia atendiendo a no residentes.", annualCost: "Moderado-alto. Sin impuesto estatal sobre la renta, pero Annual Report obligatorio cada año.", timeline: "3-4 días hábiles para tener la LLC operativa.", idealProfile: "E-commerce orientado a USA y LATAM, consultoría internacional, servicios profesionales y emprendedores con clientes o proveedores americanos.", highlights: ["Sin impuesto estatal sobre la renta","Hub natural para el mercado latinoamericano","Banca local sólida y reconocida","Reputación robusta ante plataformas y bancos"] },
  en: { privacy: "Standard. LLC managers are listed in Florida state public records.", banking: "Excellent. Consolidated banking hub in Miami with extensive experience serving non-residents.", annualCost: "Moderate-high. No state income tax, but a mandatory Annual Report every year.", timeline: "3-4 business days to have the LLC operational.", idealProfile: "E-commerce targeting the US and LATAM, international consulting, professional services and entrepreneurs with American clients or suppliers.", highlights: ["No state income tax","Natural hub for the Latin American market","Solid, recognised local banking","Strong reputation with platforms and banks"] },
  fr: { privacy: "Standard. Les gérants de la LLC apparaissent dans les registres publics de l'État de Floride.", banking: "Excellente. Hub bancaire consolidé à Miami avec une grande expérience auprès des non-résidents.", annualCost: "Modéré à élevé. Pas d'impôt d'État sur le revenu mais Annual Report obligatoire chaque année.", timeline: "3-4 jours ouvrés pour avoir la LLC opérationnelle.", idealProfile: "E-commerce orienté US et LATAM, conseil international, services professionnels et entrepreneurs avec clients ou fournisseurs américains.", highlights: ["Pas d'impôt d'État sur le revenu","Hub naturel pour le marché latino-américain","Banque locale solide et reconnue","Réputation robuste auprès des plateformes et banques"] },
  de: { privacy: "Standard. Die Geschäftsführer der LLC erscheinen in den öffentlichen Registern des Bundesstaates Florida.", banking: "Hervorragend. Konsolidierter Banking-Hub in Miami mit großer Erfahrung im Service für Nicht-Ansässige.", annualCost: "Moderat-hoch. Keine staatliche Einkommensteuer, aber pflichtmäßiger Annual Report jedes Jahr.", timeline: "3-4 Werktage bis die LLC einsatzbereit ist.", idealProfile: "E-Commerce mit Fokus auf USA und LATAM, internationale Beratung, professionelle Dienstleistungen und Unternehmer mit amerikanischen Kunden oder Lieferanten.", highlights: ["Keine staatliche Einkommensteuer","Natürlicher Hub für den lateinamerikanischen Markt","Solide, anerkannte lokale Banken","Starke Reputation bei Plattformen und Banken"] },
  pt: { privacy: "Padrão. Os gestores da LLC aparecem em registros públicos do estado da Flórida.", banking: "Excelente. Hub bancário consolidado em Miami com vasta experiência atendendo a não residentes.", annualCost: "Moderado-alto. Sem imposto estadual sobre o rendimento, mas Annual Report obrigatório todos os anos.", timeline: "3-4 dias úteis para ter a LLC operacional.", idealProfile: "E-commerce com foco nos EUA e LATAM, consultoria internacional, serviços profissionais e empreendedores com clientes ou fornecedores americanos.", highlights: ["Sem imposto estadual sobre o rendimento","Hub natural para o mercado latino-americano","Banca local sólida e reconhecida","Reputação robusta junto a plataformas e bancos"] },
  ca: { privacy: "Estàndard. Els gestors de la LLC apareixen en registres públics de l'estat de Florida.", banking: "Excel·lent. Hub bancari consolidat a Miami amb àmplia experiència atenent no residents.", annualCost: "Moderat-alt. Sense impost estatal sobre la renda, però Annual Report obligatori cada any.", timeline: "3-4 dies hàbils per tenir la LLC operativa.", idealProfile: "E-commerce orientat a EUA i LATAM, consultoria internacional, serveis professionals i emprenedors amb clients o proveïdors americans.", highlights: ["Sense impost estatal sobre la renda","Hub natural per al mercat llatinoamericà","Banca local sòlida i reconeguda","Reputació robusta davant plataformes i bancs"] },
};

const MAINTENANCE_FL = {
  es: { tagline: "Compliance anual completo para tu LLC en Florida.", items: ["Incluye todo lo de Wyoming","Florida Annual Report (obligatorio cada 1 de mayo)","Mantenimiento del Registered Agent en Florida","Gestión de Sunbiz Filings","Soporte para apertura/mantenimiento de cuentas en Miami"] },
  en: { tagline: "Complete annual compliance for your Florida LLC.", items: ["Includes everything from Wyoming","Florida Annual Report (mandatory by 1 May each year)","Florida Registered Agent maintenance","Sunbiz Filings management","Support for opening/maintaining accounts in Miami"] },
  fr: { tagline: "Compliance annuel complet pour votre LLC en Floride.", items: ["Inclut tout ce qui se trouve dans Wyoming","Annual Report de Floride (obligatoire avant le 1er mai)","Maintenance du Registered Agent en Floride","Gestion des Sunbiz Filings","Accompagnement pour l'ouverture/maintenance de comptes à Miami"] },
  de: { tagline: "Vollständige jährliche Compliance für Ihre LLC in Florida.", items: ["Enthält alles aus Wyoming","Florida Annual Report (bis spätestens 1. Mai jedes Jahres verpflichtend)","Pflege des Registered Agent in Florida","Verwaltung der Sunbiz Filings","Unterstützung bei Eröffnung/Pflege von Konten in Miami"] },
  pt: { tagline: "Compliance anual completo para a sua LLC na Flórida.", items: ["Inclui tudo o que está no Wyoming","Florida Annual Report (obrigatório até 1 de maio de cada ano)","Manutenção do Registered Agent na Flórida","Gestão dos Sunbiz Filings","Apoio para abertura/manutenção de contas em Miami"] },
  ca: { tagline: "Compliance anual complet per a la teva LLC a Florida.", items: ["Inclou tot el de Wyoming","Florida Annual Report (obligatori cada 1 de maig)","Manteniment del Registered Agent a Florida","Gestió dels Sunbiz Filings","Suport per a obertura/manteniment de comptes a Miami"] },
};

function jsArrayLiteral(items, indent) {
  return "[" + items.map((s) => JSON.stringify(s)).join(",") + "]";
}

// Build the textual `fl: { ... }` block for a given subtree using the
// indentation prefix detected from the source file. We try two indentation
// flavours: tight (1 space, used in es.ts) and wide (8 spaces, used in
// the other 5 locales). The injection point is the closing `}` of the
// preceding `de: { ... }` object inside the same parent (services.plans
// or maintenance.plans or comparativa.states).
function buildFlBlock(kind, lang, ind) {
  if (kind === "services") {
    const v = SERVICES_FL[lang];
    return (
      `${ind}fl: {\n` +
      `${ind} badge: ${JSON.stringify(v.badge)},\n` +
      `${ind} includes: ${jsArrayLiteral(v.includes)},\n` +
      `${ind}},`
    );
  }
  if (kind === "comparativa") {
    const v = COMPARATIVA_FL[lang];
    return (
      `${ind}fl: {\n` +
      `${ind} privacy: ${JSON.stringify(v.privacy)},\n` +
      `${ind} banking: ${JSON.stringify(v.banking)},\n` +
      `${ind} annualCost: ${JSON.stringify(v.annualCost)},\n` +
      `${ind} timeline: ${JSON.stringify(v.timeline)},\n` +
      `${ind} idealProfile: ${JSON.stringify(v.idealProfile)},\n` +
      `${ind} highlights: ${jsArrayLiteral(v.highlights)},\n` +
      `${ind}},`
    );
  }
  if (kind === "maintenance") {
    const v = MAINTENANCE_FL[lang];
    return (
      `${ind}fl: {\n` +
      `${ind} tagline: ${JSON.stringify(v.tagline)},\n` +
      `${ind} items: ${jsArrayLiteral(v.items)},\n` +
      `${ind}},`
    );
  }
  throw new Error("unknown kind: " + kind);
}

// Find the matching closing brace for an opening brace at index `open`
function findClosingBrace(src, open) {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

let totalChanges = 0;
const summary = [];

for (const lang of LANGS) {
  const file = join(LOCALES, `${lang}.ts`);
  let src = readFileSync(file, "utf8");
  let langChanges = 0;

  // Already has fl entries everywhere?
  const existingFl = (src.match(/fl: \{/g) || []).length;
  // We need fl in 3 places: services.plans, comparativa.states, maintenance.plans

  for (const kind of ["services", "comparativa", "maintenance"]) {
    // Locate the parent block: services -> plans, comparativa -> states,
    // maintenance -> plans. We anchor by the unique parent label.
    const parentRe =
      kind === "services" ? /\bservices:\s*\{/ : kind === "comparativa" ? /\bcomparativa:\s*\{/ : /\bmaintenance:\s*\{/;
    const parentMatchTop = parentRe.exec(src);
    if (!parentMatchTop) continue;
    const parentIdx = parentMatchTop.index;

    const childKey = kind === "comparativa" ? "states" : "plans";
    // Find first `<childKey>:` after parent
    const childRe = new RegExp(`\\b${childKey}:\\s*\\{`, "g");
    childRe.lastIndex = parentIdx;
    const childMatch = childRe.exec(src);
    if (!childMatch) continue;
    const childOpen = childMatch.index + childMatch[0].length - 1;
    const childClose = findClosingBrace(src, childOpen);
    if (childClose === -1) continue;
    const childBlock = src.slice(childOpen, childClose + 1);
    if (/\bfl:\s*\{/.test(childBlock)) continue; // already has fl

    // Find `de: {` inside this block
    const deRe = /\bde:\s*\{/g;
    deRe.lastIndex = 0;
    let deMatch;
    let deOpen = -1;
    while ((deMatch = deRe.exec(childBlock)) !== null) {
      deOpen = childOpen + deMatch.index + deMatch[0].length - 1;
    }
    if (deOpen === -1) continue;
    const deClose = findClosingBrace(src, deOpen);
    if (deClose === -1) continue;

    // Detect indentation of the `de:` line
    let lineStart = src.lastIndexOf("\n", deOpen) + 1;
    const lineHead = src.slice(lineStart, deOpen);
    const indMatch = lineHead.match(/^[\s]*/);
    const ind = indMatch ? indMatch[0] : "";

    // Determine what comes right after the closing brace of `de`. Some
    // files have a trailing comma, some don't. We always insert
    // `,\n${ind}fl: { ... }` so we end up with `de: {...},\n  fl: {...},`.
    let insertAt = deClose + 1;
    let needsLeadingComma = src[insertAt] !== ",";
    if (!needsLeadingComma) insertAt += 1; // skip past comma
    const flBlock = buildFlBlock(kind, lang, ind);
    const insertion = (needsLeadingComma ? "," : "") + "\n" + flBlock;
    src = src.slice(0, insertAt) + insertion + src.slice(insertAt);
    langChanges++;
  }

  if (langChanges > 0) {
    writeFileSync(file, src, "utf8");
  }
  summary.push(`  [${lang}] inserted=${langChanges}`);
  totalChanges += langChanges;
}

console.log("blog-task16-add-florida-i18n:");
for (const s of summary) console.log(s);
console.log(`Total insertions: ${totalChanges}`);
