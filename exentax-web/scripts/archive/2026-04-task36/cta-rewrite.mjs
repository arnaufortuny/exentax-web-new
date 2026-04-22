#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_ROOT = path.join(ROOT, "client/src/data/blog-content");
const I18N_ROOT = path.join(ROOT, "client/src/data/blog-i18n");
const POSTS_FILE = path.join(ROOT, "client/src/data/blog-posts.ts");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const ROUTE_SLUGS = {
  how_we_work:  { es: "como-trabajamos",    en: "how-we-work",      fr: "comment-nous-travaillons", de: "wie-wir-arbeiten",  pt: "como-trabalhamos",  ca: "com-treballem" },
  our_services: { es: "nuestros-servicios", en: "our-services",     fr: "nos-services",             de: "unsere-leistungen", pt: "nossos-servicos",   ca: "els-nostres-serveis" },
  book:         { es: "agendar",            en: "book",             fr: "reserver",                 de: "buchen",            pt: "agendar",           ca: "agendar" },
};
const WHATSAPP_URL = "https://wa.me/34614916910";
const localized = (key, lang) => `/${lang}/${ROUTE_SLUGS[key][lang]}`;

// ---- Bucket classification ----
const CONSTITUTION = [
  "como-obtener-itin-numero-fiscal-irs",
  "constituir-llc-proceso-paso-a-paso",
  "cuanto-cuesta-constituir-llc",
  "documentos-llc-cuales-necesitas",
  "ein-numero-fiscal-llc-como-obtenerlo",
  "itin-ssn-que-son-como-obtenerlos",
  "nuevo-mexico-vs-wyoming-vs-delaware",
  "operating-agreement-llc-que-es",
  "registered-agent-que-es-por-que-necesitas",
  "w8-ben-y-w8-ben-e-guia-completa",
];
const COMPLIANCE = [
  "boe-febrero-2020-llc-doctrina-administrativa",
  "boi-report-fincen-guia-completa-2026",
  "convenio-doble-imposicion-usa-espana-llc",
  "crs-cuentas-bancarias-llc-intercambio-informacion",
  "crs-residentes-espana-latam-implicaciones",
  "cuentas-bancarias-usa-reportan-hacienda-verdad",
  "dac7-plataformas-digitales-reporting-2026",
  "dac8-criptomonedas-reporting-fiscal-2026",
  "extension-irs-form-1120-como-solicitarla",
  "fiscalidad-socios-llc-cambio-residencia-mid-year",
  "form-5472-que-es-como-presentarlo",
  "irs-1120-5472-que-son-cuando-aplican",
  "iva-servicios-digitales-internacional",
  "mantenimiento-anual-llc-obligaciones",
  "modelo-720-721-residentes-espana-cuentas-cripto-extranjero",
  "prevencion-blanqueo-capitales-llc",
  "que-pasa-si-no-presentas-5472-multas-irs",
  "revolut-business-crs-reporting-fiscal",
  "testaferros-prestanombres-llc-ilegal-riesgos",
  "visa-mastercard-reporting-tarjetas-hacienda",
  "wise-iban-llc-que-reporta-hacienda",
  "wise-business-crs-reporting-fiscal",
];
const BANKING = [
  "bancos-vs-fintech-llc-donde-abrir-cuenta",
  "cambiar-divisas-llc-mejores-opciones",
  "cuenta-bancaria-mercury-llc-extranjero",
  "due-diligence-bancario-llc-americana",
  "evitar-bloqueos-mercury-wise-revolut",
  "iban-swift-routing-number-que-son",
  "justificar-origen-fondos-kyc-bancario-segunda-ronda",
  "pasarelas-pago-llc-stripe-paypal-dodo",
  "reorganizar-banca-llc-mercury-relay-wise",
  "tiempos-pagos-ach-wire-transfer",
  "wise-bancos-llc-stack-bancaria-completa",
  "wise-business-llc-guia",
];
const OPTIMIZATION = [
  "autonomo-espana-vs-llc-estados-unidos",
  "autonomos-espana-por-que-dejar-de-serlo",
  "caminos-legales-minimos-impuestos",
  "crear-empresa-andorra-ventajas",
  "criptomonedas-trading-llc-impuestos",
  "diseno-estructura-fiscal-internacional-solida",
  "dubai-uae-mito-no-impuestos",
  "empresa-bulgaria-10-tributacion",
  "empresa-panama-fiscalidad-residencia",
  "empresa-reino-unido-uk-ltd",
  "estructura-fiscal-optima-freelancer-internacional",
  "estructura-offshore-beneficios-riesgos",
  "fiscalidad-estonia-como-funciona",
  "holding-empresarial-como-funciona",
  "hong-kong-offshore-realidad",
  "llc-agencias-marketing-digital",
  "llc-alternativa-autonomo-espana",
  "llc-creadores-contenido-youtube-twitch",
  "llc-desarrolladores-software-saas",
  "llc-interactive-brokers-invertir-bolsa-usa",
  "llc-unica-estructura-holding-cuando-como-cuesta",
  "nomada-digital-residencia-fiscal",
  "pagar-cero-impuestos-legalmente-llc",
  "por-que-no-abrir-empresa-estonia",
  "riesgos-fiscales-mala-estructuracion-internacional",
];
const GENERAL = [
  "errores-fiscales-freelancers-espanoles",
  "fiscalidad-internacional-emprendedores-digitales",
  "fiscalidad-llc-por-pais-residencia",
  "impuestos-clientes-internacionales-espana",
  "llc-estados-unidos-guia-completa-2026",
  "llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais",
  "llc-seguridad-juridica-proteccion-patrimonial",
  "por-que-abrir-llc-estados-unidos-ventajas",
  "privacidad-llc-americana-secreto-ventaja",
  "que-es-irs-guia-duenos-llc",
  "residentes-no-residentes-llc-diferencias",
  "single-member-multi-member-llc-implicaciones-fiscales",
  "tributacion-llc-segun-actividad-economica",
  "tributacion-pass-through-llc-como-funciona",
  "ventajas-desventajas-llc-no-residentes",
];
const EXISTING = [
  "amazon-ecommerce-llc-vender-online",
  "auditoria-rapida-llc-12-puntos-30-minutos",
  "bookkeeping-llc-paso-a-paso",
  "cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad",
  "como-disolver-cerrar-llc-paso-a-paso",
  "como-operar-llc-dia-a-dia",
  "documentar-separacion-fondos-llc-historial",
  "errores-criticos-llc-ya-constituida",
  "escalar-negocio-digital-llc-americana",
  "gastos-deducibles-llc-que-puedes-deducir",
  "primer-mes-llc-que-esperar",
  "problemas-comunes-llc-como-evitarlos",
  "recuperar-llc-boi-5472-atrasados-procedimiento",
  "separar-dinero-personal-llc-por-que-importa",
  "tengo-llc-checklist-gestion-correcta",
  "vender-o-cerrar-llc-comparativa-practica",
];

const BUCKETS = {
  constitution: { slugs: CONSTITUTION, mid: "our_services", final: "book" },
  compliance:   { slugs: COMPLIANCE,   mid: "our_services", final: "book" },
  banking:      { slugs: BANKING,      mid: "our_services", final: "whatsapp" },
  optimization: { slugs: OPTIMIZATION, mid: "how_we_work",  final: "book" },
  general:      { slugs: GENERAL,      mid: "how_we_work",  final: "book" },
  existing:     { slugs: EXISTING,     mid: "our_services", final: "whatsapp" },
};

const slugBucket = {};
for (const [name, b] of Object.entries(BUCKETS)) {
  for (const s of b.slugs) slugBucket[s] = name;
}

// ---- Title extraction ----
function extractTitlesEs() {
  const src = fs.readFileSync(POSTS_FILE, "utf8");
  const map = {};
  // Match objects like { slug: "...", title: "...", ... }
  const re = /slug:\s*"([^"]+)",\s*\n\s*title:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    map[m[1]] = m[2].replace(/\\"/g, '"');
  }
  return map;
}

function extractTitlesLang(lang) {
  const file = path.join(I18N_ROOT, `${lang}.ts`);
  const src = fs.readFileSync(file, "utf8");
  const map = {};
  // Format: "slug": { title: "...", ...
  const re = /"([^"]+)":\s*\{\s*title:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    map[m[1]] = m[2].replace(/\\"/g, '"');
  }
  return map;
}

const TITLES = { es: extractTitlesEs() };
for (const lang of ["en", "fr", "de", "pt", "ca"]) TITLES[lang] = extractTitlesLang(lang);

// ---- CTA templates per lang × bucket × position ----
// Placeholders: {url} and {title}
// All CTAs use a recognizable HTML <a> wrapped in **bold** so the existing
// markdown parser renders a strong link inside a paragraph.
const T = {
  es: {
    constitution: {
      mid:   `**¿Quieres que nos ocupemos de "{title}" por ti?** Mira lo que cubrimos en <a href="{url}">nuestros servicios</a> y empezamos cuando tú digas.`,
      final: `**Pasamos de la teoría a tu LLC.** <a href="{url}">Reserva una llamada de 30 minutos</a> y planificamos juntos lo de "{title}".`,
    },
    compliance: {
      mid:   `**¿Te suena complicado?** En <a href="{url}">nuestros servicios</a> ya incluimos todo lo de "{title}", presentado en plazo y sin que tengas que tocar nada.`,
      final: `**Cuéntanos tu situación y te decimos por dónde empezar.** <a href="{url}">Reserva una llamada de 30 minutos</a> sobre "{title}" y la revisamos a fondo.`,
    },
    banking: {
      mid:   `**Si tu banca está bloqueada o atascada, lo desatascamos.** Echa un vistazo a <a href="{url}">nuestros servicios</a> para resolver "{title}" sin perder semanas.`,
      final: `**Escríbenos por WhatsApp y nos cuentas.** <a href="{url}">Mándanos un mensaje</a> con tu caso de "{title}" y te respondemos con pasos concretos.`,
    },
    optimization: {
      mid:   `**Antes de tocar nada de "{title}", mira cómo trabajamos.** En <a href="{url}">nuestra metodología</a> verás qué revisamos y en qué orden.`,
      final: `**Pongamos números a tu caso.** <a href="{url}">Reserva 30 minutos</a> y vemos si "{title}" encaja en tu situación real.`,
    },
    general: {
      mid:   `**¿Quieres ver esto aplicado a ti?** Así es <a href="{url}">cómo trabajamos</a> el tema de "{title}" con cada cliente.`,
      final: `**Hablemos de tu caso, no del genérico.** <a href="{url}">Reserva una llamada de 30 minutos</a> y aterrizamos "{title}" a tu negocio.`,
    },
    existing: {
      mid:   `**¿Tu LLC ya está montada y necesitas mano firme?** Mira <a href="{url}">nuestros servicios</a> para resolver "{title}" sin parar tu operativa.`,
      final: `**Pásanos los datos por WhatsApp y miramos tu LLC.** <a href="{url}">Escríbenos</a> con tu caso de "{title}" y te decimos en qué punto estás.`,
    },
  },
  en: {
    constitution: {
      mid:   `**Want us to handle "{title}" for you?** See what's included in <a href="{url}">our services</a> and we start whenever you're ready.`,
      final: `**Let's turn this into your actual LLC.** <a href="{url}">Book a 30-minute call</a> and we'll plan "{title}" together.`,
    },
    compliance: {
      mid:   `**Sounds heavy?** <a href="{url}">Our services</a> already cover "{title}" — filed on time, with nothing for you to touch.`,
      final: `**Tell us your situation and we'll tell you where to start.** <a href="{url}">Book a 30-minute call</a> about "{title}" and we'll go through it.`,
    },
    banking: {
      mid:   `**If your banking is blocked or stuck, we unblock it.** Check <a href="{url}">our services</a> to clear "{title}" without losing weeks.`,
      final: `**Drop us a WhatsApp and tell us what happened.** <a href="{url}">Message us</a> with your "{title}" situation and we'll come back with concrete steps.`,
    },
    optimization: {
      mid:   `**Before changing anything around "{title}", see how we work.** <a href="{url}">Our method</a> shows what we review and in what order.`,
      final: `**Let's put real numbers on your case.** <a href="{url}">Book 30 minutes</a> and we'll check whether "{title}" fits your actual situation.`,
    },
    general: {
      mid:   `**Want to see this applied to you?** Here's <a href="{url}">how we work</a> on "{title}" with each client.`,
      final: `**Let's talk about your case, not the textbook.** <a href="{url}">Book a 30-minute call</a> and we'll fit "{title}" to your business.`,
    },
    existing: {
      mid:   `**Your LLC is up and you need a steady hand?** See <a href="{url}">our services</a> to resolve "{title}" without disrupting operations.`,
      final: `**Send us your details on WhatsApp and we'll review your LLC.** <a href="{url}">Message us</a> with your "{title}" case and we'll tell you where you stand.`,
    },
  },
  fr: {
    constitution: {
      mid:   `**Vous voulez que l'on s'occupe de « {title} » pour vous ?** Découvrez <a href="{url}">nos services</a> et nous démarrons quand vous voulez.`,
      final: `**Passons de la théorie à votre LLC.** <a href="{url}">Réservez un appel de 30 minutes</a> et planifions ensemble « {title} ».`,
    },
    compliance: {
      mid:   `**Cela vous semble compliqué ?** <a href="{url}">Nos services</a> couvrent déjà « {title} », déposé à temps, sans rien à faire de votre côté.`,
      final: `**Expliquez-nous votre cas et nous vous dirons par où commencer.** <a href="{url}">Réservez un appel de 30 minutes</a> sur « {title} » et passons-le en revue.`,
    },
    banking: {
      mid:   `**Si votre banque est bloquée, on la débloque.** Regardez <a href="{url}">nos services</a> pour résoudre « {title} » sans perdre des semaines.`,
      final: `**Écrivez-nous sur WhatsApp avec votre situation.** <a href="{url}">Envoyez-nous un message</a> sur votre cas « {title} » et nous reviendrons avec des étapes concrètes.`,
    },
    optimization: {
      mid:   `**Avant de toucher à « {title} », voyez comment nous travaillons.** <a href="{url}">Notre méthode</a> montre ce que nous examinons et dans quel ordre.`,
      final: `**Mettons des chiffres réels sur votre cas.** <a href="{url}">Réservez 30 minutes</a> et nous verrons si « {title} » correspond à votre situation.`,
    },
    general: {
      mid:   `**Vous voulez voir cela appliqué à votre cas ?** Voici <a href="{url}">comment nous travaillons</a> sur « {title} » avec chaque client.`,
      final: `**Parlons de votre cas, pas du manuel.** <a href="{url}">Réservez un appel de 30 minutes</a> et adaptons « {title} » à votre activité.`,
    },
    existing: {
      mid:   `**Votre LLC est en place et vous voulez une main ferme ?** Voyez <a href="{url}">nos services</a> pour traiter « {title} » sans perturber votre activité.`,
      final: `**Envoyez-nous les détails par WhatsApp et nous regarderons votre LLC.** <a href="{url}">Contactez-nous</a> avec votre cas « {title} » et nous vous dirons où vous en êtes.`,
    },
  },
  de: {
    constitution: {
      mid:   `**Sollen wir „{title}" für Sie übernehmen?** Sehen Sie sich <a href="{url}">unsere Leistungen</a> an — wir starten, sobald Sie bereit sind.`,
      final: `**Machen wir aus der Theorie Ihre LLC.** <a href="{url}">Buchen Sie ein 30-minütiges Gespräch</a>, in dem wir „{title}" gemeinsam planen.`,
    },
    compliance: {
      mid:   `**Klingt aufwendig?** <a href="{url}">Unsere Leistungen</a> decken „{title}" bereits ab — fristgerecht eingereicht, ohne dass Sie etwas tun müssen.`,
      final: `**Schildern Sie uns Ihren Fall, wir sagen Ihnen, wo Sie anfangen.** <a href="{url}">Buchen Sie ein 30-minütiges Gespräch</a> zu „{title}" und wir gehen es durch.`,
    },
    banking: {
      mid:   `**Wenn Ihr Banking blockiert ist, lösen wir das.** Schauen Sie in <a href="{url}">unsere Leistungen</a>, um „{title}" ohne Wochenverlust zu klären.`,
      final: `**Schreiben Sie uns per WhatsApp.** <a href="{url}">Senden Sie uns eine Nachricht</a> zu Ihrem Fall rund um „{title}" und wir antworten mit konkreten Schritten.`,
    },
    optimization: {
      mid:   `**Bevor Sie etwas an „{title}" ändern, schauen Sie, wie wir arbeiten.** <a href="{url}">Unsere Methode</a> zeigt, was wir prüfen und in welcher Reihenfolge.`,
      final: `**Setzen wir echte Zahlen an Ihren Fall.** <a href="{url}">Buchen Sie 30 Minuten</a> und wir prüfen, ob „{title}" zu Ihrer Situation passt.`,
    },
    general: {
      mid:   `**Möchten Sie sehen, wie das auf Sie angewendet wird?** So <a href="{url}">arbeiten wir</a> bei „{title}" mit jedem Mandanten.`,
      final: `**Reden wir über Ihren Fall, nicht über das Lehrbuch.** <a href="{url}">Buchen Sie ein 30-minütiges Gespräch</a> und wir passen „{title}" an Ihr Geschäft an.`,
    },
    existing: {
      mid:   `**Ihre LLC läuft und Sie brauchen eine ruhige Hand?** Sehen Sie <a href="{url}">unsere Leistungen</a>, um „{title}" ohne Unterbrechung zu lösen.`,
      final: `**Senden Sie uns die Daten per WhatsApp.** <a href="{url}">Schreiben Sie uns</a> mit Ihrem Fall zu „{title}", und wir sagen Ihnen, wo Sie stehen.`,
    },
  },
  pt: {
    constitution: {
      mid:   `**Quer que cuidemos de "{title}" por você?** Veja <a href="{url}">nossos serviços</a> e começamos quando você quiser.`,
      final: `**Vamos da teoria à sua LLC.** <a href="{url}">Reserve uma chamada de 30 minutos</a> e planejamos juntos "{title}".`,
    },
    compliance: {
      mid:   `**Parece complicado?** <a href="{url}">Nossos serviços</a> já cobrem "{title}" — apresentado dentro do prazo, sem nada para você fazer.`,
      final: `**Conte-nos sua situação e dizemos por onde começar.** <a href="{url}">Reserve uma chamada de 30 minutos</a> sobre "{title}" e a revisamos a fundo.`,
    },
    banking: {
      mid:   `**Se seu banco está bloqueado, desbloqueamos.** Veja <a href="{url}">nossos serviços</a> para resolver "{title}" sem perder semanas.`,
      final: `**Escreva pelo WhatsApp e nos conte.** <a href="{url}">Envie uma mensagem</a> com seu caso de "{title}" e respondemos com passos concretos.`,
    },
    optimization: {
      mid:   `**Antes de mexer em "{title}", veja como trabalhamos.** Em <a href="{url}">nossa metodologia</a> você verá o que revisamos e em que ordem.`,
      final: `**Vamos colocar números no seu caso.** <a href="{url}">Reserve 30 minutos</a> e vemos se "{title}" cabe na sua situação real.`,
    },
    general: {
      mid:   `**Quer ver isso aplicado a você?** É assim que <a href="{url}">trabalhamos</a> "{title}" com cada cliente.`,
      final: `**Falemos do seu caso, não do genérico.** <a href="{url}">Reserve uma chamada de 30 minutos</a> e aterrissamos "{title}" no seu negócio.`,
    },
    existing: {
      mid:   `**Sua LLC já está montada e precisa de mão firme?** Veja <a href="{url}">nossos serviços</a> para resolver "{title}" sem parar a operação.`,
      final: `**Mande os dados pelo WhatsApp e olhamos sua LLC.** <a href="{url}">Escreva pra gente</a> com seu caso de "{title}" e dizemos em que ponto está.`,
    },
  },
  ca: {
    constitution: {
      mid:   `**Vols que ens encarreguem de «{title}» per tu?** Mira què inclouen <a href="{url}">els nostres serveis</a> i comencem quan diguis.`,
      final: `**Passem de la teoria a la teva LLC.** <a href="{url}">Reserva una trucada de 30 minuts</a> i planifiquem junts «{title}».`,
    },
    compliance: {
      mid:   `**Et sona complicat?** <a href="{url}">Els nostres serveis</a> ja inclouen «{title}» — presentat dins de termini, sense que hagis de tocar res.`,
      final: `**Explica'ns la teva situació i et diem per on començar.** <a href="{url}">Reserva una trucada de 30 minuts</a> sobre «{title}» i la revisem a fons.`,
    },
    banking: {
      mid:   `**Si la teva banca està bloquejada, la desbloquegem.** Fes una ullada a <a href="{url}">els nostres serveis</a> per resoldre «{title}» sense perdre setmanes.`,
      final: `**Escriu-nos per WhatsApp i ens ho expliques.** <a href="{url}">Envia'ns un missatge</a> amb el teu cas de «{title}» i et responem amb passos concrets.`,
    },
    optimization: {
      mid:   `**Abans de tocar res de «{title}», mira com treballem.** A <a href="{url}">la nostra metodologia</a> veuràs què revisem i en quin ordre.`,
      final: `**Posem números al teu cas.** <a href="{url}">Reserva 30 minuts</a> i veiem si «{title}» encaixa amb la teva situació real.`,
    },
    general: {
      mid:   `**Vols veure-ho aplicat a tu?** Així és <a href="{url}">com treballem</a> el tema de «{title}» amb cada client.`,
      final: `**Parlem del teu cas, no del genèric.** <a href="{url}">Reserva una trucada de 30 minuts</a> i aterrem «{title}» al teu negoci.`,
    },
    existing: {
      mid:   `**La teva LLC ja està en marxa i necessites mà ferma?** Mira <a href="{url}">els nostres serveis</a> per resoldre «{title}» sense aturar l'operativa.`,
      final: `**Passa'ns les dades per WhatsApp i mirem la teva LLC.** <a href="{url}">Escriu-nos</a> amb el teu cas de «{title}» i et diem en quin punt estàs.`,
    },
  },
};

// Patterns matching the legacy auto-CTA prose to strip from articles.
const LEGACY_CTA_LINE_RE = /(Agenda tu asesoría|Book your (?:free )?(?:30-minute )?(?:strategic )?(?:tax )?consultation|Réservez votre consultation|Buchen Sie Ihre(?:\s\S+){0,3}\sBeratung|Prenota la tua consulenza|Reserve sua consult|Reserva la teva consult)/i;

// Marker comments so we can detect & replace previously inserted CTAs idempotently.
const CTA_MARK_MID = "<!-- exentax:cta-mid -->";
const CTA_MARK_FINAL = "<!-- exentax:cta-final -->";

function ctaUrl(target, lang) {
  if (target === "whatsapp") return WHATSAPP_URL;
  return localized(target, lang);
}

function buildCta(slug, lang, position) {
  const bucket = slugBucket[slug];
  if (!bucket) throw new Error(`No bucket for slug: ${slug}`);
  const target = position === "mid" ? BUCKETS[bucket].mid : BUCKETS[bucket].final;
  const url = ctaUrl(target, lang);
  const tpl = T[lang][bucket][position];
  const title = (TITLES[lang][slug] || TITLES.es[slug] || slug).trim();
  const block = tpl.replace(/\{url\}/g, url).replace(/\{title\}/g, title);
  const mark = position === "mid" ? CTA_MARK_MID : CTA_MARK_FINAL;
  return `${mark}\n${block}`;
}

// Read template-literal content from a blog content TS file.
function readContent(file) {
  const raw = fs.readFileSync(file, "utf8");
  const start = raw.indexOf("`");
  const end = raw.lastIndexOf("`");
  if (start < 0 || end <= start) throw new Error(`Bad file: ${file}`);
  return { prefix: raw.slice(0, start + 1), body: raw.slice(start + 1, end), suffix: raw.slice(end) };
}

function writeContent(file, parts, newBody) {
  fs.writeFileSync(file, parts.prefix + newBody + parts.suffix);
}

// Remove any previously inserted CTA blocks (marker + the next non-empty line).
function stripPreviousCtas(body) {
  const lines = body.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.trim() === CTA_MARK_MID || l.trim() === CTA_MARK_FINAL) {
      // Skip this marker and consume the following CTA paragraph block (until blank line).
      i++;
      while (i < lines.length && lines[i].trim() !== "") i++;
      // Skip the trailing blank line too if any.
      // (we won't push it; the surrounding paragraph spacing will be re-added on insert)
      continue;
    }
    out.push(l);
  }
  return out.join("\n");
}

// Strip prose lines that the legacy ctaPattern would have auto-linkified.
function stripLegacyCtaProse(body) {
  return body.split("\n").filter(l => !LEGACY_CTA_LINE_RE.test(l)).join("\n");
}

// Identify content section headings (## ...) and return their line indices,
// stopping before any appendix marker or appendix heading.
function findContentHeadings(lines) {
  const APPENDIX_HEADING_RE = /^##\s+(Compliance fiscal|Compliance fiscale|Steuerliche Compliance|Compliance fiscal|Compliance|Conformité fiscale|Steuer-Compliance|Conformitat fiscal|Cumprimento fiscal|Referencias legales|Legal references|Références (légales|juridiques)|Rechtliche Quellen|Referències legals|Referências legais|Hechos legales|Legal (and procedural )?facts|Faits (légaux|juridiques)|Rechtliche (und verfahrenstechnische )?Fakten|Fets legals|Factos legais)/i;
  const APPENDIX_MARKER_RE = /<!--\s*exentax:legal-(refs|facts)/i;
  const heads = [];
  let firstAppendixLine = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (APPENDIX_MARKER_RE.test(lines[i]) || APPENDIX_HEADING_RE.test(lines[i])) {
      firstAppendixLine = i;
      break;
    }
  }
  for (let i = 0; i < firstAppendixLine; i++) {
    if (/^##\s+[^#]/.test(lines[i])) heads.push(i);
  }
  return { heads, firstAppendixLine };
}

// "Conclusion" headings we recognise across languages (case-insensitive, prefix match).
const CONCLUSION_RE = /^##\s+(Lo que deberías llevarte|What you should take|Ce qu'il faut retenir|Was Sie mitnehmen|O que você deve levar|El que t'has d'endur|Para llevar|Conclusión|Conclusion|Fazit|Conclusão|Conclusió)/i;

function insertCtas(body, slug, lang) {
  const lines = body.split("\n");
  const { heads, firstAppendixLine } = findContentHeadings(lines);

  // Decide mid insertion line: BEFORE heads[mid] where mid = floor(N/2), N >= 3.
  // If N < 3, fallback: after first content heading's section.
  let midInsertAt;
  if (heads.length >= 3) {
    midInsertAt = heads[Math.floor(heads.length / 2)];
  } else if (heads.length >= 2) {
    midInsertAt = heads[1];
  } else if (heads.length === 1) {
    // insert right before appendix or end of content
    midInsertAt = firstAppendixLine;
  } else {
    midInsertAt = lines.length;
  }

  // Decide final insertion line: at firstAppendixLine (so CTA sits at end of content).
  // If a Conclusion heading exists in content, insert AFTER its section content,
  // which is effectively the same as firstAppendixLine when it's the last content section.
  // We use firstAppendixLine to stay before the appendix.
  let finalInsertAt = firstAppendixLine;

  // Ensure final goes after mid (sanity)
  if (finalInsertAt <= midInsertAt) finalInsertAt = midInsertAt + 1;

  const midBlock = buildCta(slug, lang, "mid");
  const finalBlock = buildCta(slug, lang, "final");

  // Insert in reverse order to keep indices stable.
  const out = lines.slice();
  out.splice(finalInsertAt, 0, "", finalBlock, "");
  out.splice(midInsertAt, 0, "", midBlock, "");
  return out.join("\n");
}

function processFile(slug, lang) {
  const file = path.join(CONTENT_ROOT, lang, `${slug}.ts`);
  if (!fs.existsSync(file)) return { slug, lang, status: "missing" };
  const parts = readContent(file);
  let body = parts.body;
  body = stripPreviousCtas(body);
  body = stripLegacyCtaProse(body);
  body = insertCtas(body, slug, lang);
  writeContent(file, parts, body);
  return { slug, lang, status: "ok" };
}

// ---- Verification ----
function verify() {
  const errors = [];
  for (const lang of LANGS) {
    for (const slug of Object.keys(slugBucket)) {
      const file = path.join(CONTENT_ROOT, lang, `${slug}.ts`);
      if (!fs.existsSync(file)) { errors.push(`MISSING ${lang}/${slug}`); continue; }
      const src = fs.readFileSync(file, "utf8");
      const midCount = (src.match(/<!--\s*exentax:cta-mid\s*-->/g) || []).length;
      const finalCount = (src.match(/<!--\s*exentax:cta-final\s*-->/g) || []).length;
      if (midCount !== 1) errors.push(`MID=${midCount} ${lang}/${slug}`);
      if (finalCount !== 1) errors.push(`FINAL=${finalCount} ${lang}/${slug}`);
      // URL validation: every <a href> CTA URL must be one of the allowed.
      const bucket = BUCKETS[slugBucket[slug]];
      const allowedMid = ctaUrl(bucket.mid, lang);
      const allowedFinal = ctaUrl(bucket.final, lang);
      // Find href in CTA blocks
      const ctaBlockRe = /<!--\s*exentax:cta-(mid|final)\s*-->\s*\n([^\n]+)/g;
      let m;
      while ((m = ctaBlockRe.exec(src)) !== null) {
        const pos = m[1];
        const block = m[2];
        const hrefM = block.match(/<a href="([^"]+)"/);
        if (!hrefM) { errors.push(`NO_HREF ${lang}/${slug} ${pos}`); continue; }
        const href = hrefM[1];
        const expected = pos === "mid" ? allowedMid : allowedFinal;
        if (href !== expected) errors.push(`BAD_HREF ${lang}/${slug} ${pos}: ${href} (expected ${expected})`);
      }
    }
  }
  return errors;
}

// ---- Main ----
const args = process.argv.slice(2);
if (args[0] === "verify") {
  const errs = verify();
  if (errs.length === 0) {
    const slugCount = Object.keys(slugBucket).length;
    console.log(`OK: all ${slugCount} slugs × ${LANGS.length} langs have exactly 2 CTAs with valid URLs.`);
  } else {
    console.error(`FAIL: ${errs.length} issues`);
    for (const e of errs.slice(0, 50)) console.error(" ", e);
    process.exit(1);
  }
} else {
  // Coverage check
  const dirSlugs = fs.readdirSync(path.join(CONTENT_ROOT, "es")).map(f => f.replace(/\.ts$/, "")).filter(s => s && !s.endsWith("-all"));
  const known = new Set(Object.keys(slugBucket));
  const missing = dirSlugs.filter(s => !known.has(s));
  const extra = [...known].filter(s => !dirSlugs.includes(s));
  if (missing.length) console.warn("Slugs in dir not classified:", missing);
  if (extra.length) console.warn("Classified slugs not in dir:", extra);

  let ok = 0, miss = 0;
  for (const slug of Object.keys(slugBucket)) {
    for (const lang of LANGS) {
      const r = processFile(slug, lang);
      if (r.status === "ok") ok++; else miss++;
    }
  }
  console.log(`Processed: ${ok} ok, ${miss} missing.`);
  const errs = verify();
  if (errs.length === 0) console.log("Verification PASSED.");
  else { console.error(`Verification FAILED (${errs.length}):`); errs.slice(0, 20).forEach(e => console.error(" ", e)); process.exit(1); }
}
