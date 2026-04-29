#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "exentax-web/client/src/data/blog-content");

const SLUGS = [
  "crs-cuentas-bancarias-llc-intercambio-informacion",
  "crs-residentes-espana-latam-implicaciones",
  "cuentas-bancarias-usa-reportan-hacienda-verdad",
  "revolut-business-crs-reporting-fiscal",
  "wise-business-crs-reporting-fiscal",
  "wise-iban-llc-que-reporta-hacienda",
  "dac8-criptomonedas-reporting-fiscal-2026",
  "dac7-plataformas-digitales-reporting-2026",
  "modelo-720-721-residentes-espana-cuentas-cripto-extranjero",
  "visa-mastercard-reporting-tarjetas-hacienda",
];

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const MOTHER = {
  es: { slug: "crs-2-0-carf-por-que-usa-no-firmara-llc", title: "CRS 2.0 y CARF: por qué EE. UU. no firmará y qué cambia para tu LLC" },
  en: { slug: "crs-2-0-carf-why-the-us-will-never-sign-llc-impact", title: "CRS 2.0 and CARF: why the US will never sign and what it means for your LLC" },
  fr: { slug: "crs-2-0-carf-pourquoi-les-usa-ne-signeront-jamais-llc", title: "CRS 2.0 et CARF : pourquoi les USA ne signeront jamais et ce que cela change pour votre LLC" },
  de: { slug: "crs-2-0-carf-warum-die-usa-niemals-unterzeichnen-llc", title: "CRS 2.0 und CARF: warum die USA niemals unterzeichnen werden und was das für Ihre LLC bedeutet" },
  pt: { slug: "crs-2-0-carf-por-que-os-eua-nunca-vao-assinar-llc", title: "CRS 2.0 e CARF: porque os EUA nunca irão assinar e o que muda para a sua LLC" },
  ca: { slug: "crs-2-0-carf-per-que-els-eua-no-signaran-mai-llc", title: "CRS 2.0 i CARF: per què els EUA no signaran mai i què canvia per a la seva LLC" },
};

// Headers without bare editorial year (the temporal anchor is the directive date inside the body).
const HEADER = {
  es: "## Actualización CRS 2.0, CARF y DAC8 (paquete OCDE)",
  en: "## CRS 2.0, CARF and DAC8 update (OECD package)",
  fr: "## Mise à jour CRS 2.0, CARF et DAC8 (paquet OCDE)",
  de: "## CRS 2.0, CARF und DAC8: Aktualisierung (OECD-Paket)",
  pt: "## Atualização CRS 2.0, CARF e DAC8 (pacote OCDE)",
  ca: "## Actualització CRS 2.0, CARF i DAC8 (paquet OCDE)",
};

// CORE blocks: only legally-anchored year forms are used (Directive 2023/2226,
// "17 de octubre de 2023", "1 de enero de 2026", "enero de 2027", "ejercicio 2026").
// Editorial bare years like "en 2023" / "in 2023" are removed.
const CORE = {
  es: `La OCDE aprobó el paquete integrado **CRS 2.0** (revisión del Common Reporting Standard, con EMIs y dinero electrónico dentro del perímetro y due diligence reforzada sobre controlling persons) y **CARF** (Crypto-Asset Reporting Framework, que extiende el intercambio automático a exchanges, custodios y plataformas de derivados cripto). La Unión Europea lo transpuso mediante la **Directiva (UE) 2023/2226 (DAC8)**, aprobada el 17 de octubre de 2023, que modifica la 2011/16/UE para incorporar ambas piezas. La fecha de aplicación material es el **1 de enero de 2026** y el **primer intercambio efectivo** llega en **enero de 2027 sobre datos del ejercicio 2026**.

La narrativa que conviene fijar es la misma de siempre: **EE. UU. queda fuera del perímetro CRS por arquitectura, no por opacidad**. Washington tiene su propio régimen (FATCA), no firmó el CRS 1.0 y no firmará el 2.0, y por eso tu LLC americana sigue siendo declarable en residencia con normalidad. Lo desplegamos a fondo en <a href="__MOTHER__">__TITLE__</a>.`,
  en: `The OECD adopted an integrated package combining **CRS 2.0** (the revised Common Reporting Standard, which brings EMIs and specified electronic-money products into the perimeter and tightens due diligence on controlling persons) and **CARF** (the Crypto-Asset Reporting Framework, which extends automatic exchange to crypto exchanges, custodians and crypto-derivative platforms). The European Union transposed it through **Directive (EU) 2023/2226 (DAC8)**, adopted on 17 October 2023, which amends Directive 2011/16/EU to incorporate both components. The substantive application date is **1 January 2026** and the **first effective exchange** lands in **January 2027, on 2026 reporting-year data**.

The takeaway to remember is the same as always: **the United States stays outside the CRS perimeter by architecture, not by opacity**. Washington runs its own regime (FATCA), did not sign CRS 1.0 and will not sign CRS 2.0 — which is exactly why your US LLC remains a fully declarable structure in your country of residence. We unpack the full picture in <a href="__MOTHER__">__TITLE__</a>.`,
  fr: `L'OCDE a adopté le paquet intégré formé par **CRS 2.0** (la révision du Common Reporting Standard, qui fait entrer les EMI et les produits de monnaie électronique spécifiés dans le périmètre et renforce la due diligence sur les controlling persons) et **CARF** (Crypto-Asset Reporting Framework, qui étend l'échange automatique aux exchanges, dépositaires et plateformes de dérivés crypto). L'Union européenne l'a transposé par la **Directive (UE) 2023/2226 (DAC8)**, adoptée le 17 octobre 2023, qui modifie la directive 2011/16/UE pour intégrer les deux pièces. La date d'application matérielle est le **1er janvier 2026** et le **premier échange effectif** arrive en **janvier 2027 sur les données de l'exercice 2026**.

Le message à retenir reste inchangé : **les États-Unis restent hors du périmètre CRS par architecture, pas par opacité**. Washington dispose de son propre régime (FATCA), n'a pas signé le CRS 1.0 et ne signera pas non plus le CRS 2.0, et c'est précisément pour cela que votre LLC américaine demeure une structure parfaitement déclarable dans votre pays de résidence. Nous le détaillons dans <a href="__MOTHER__">__TITLE__</a>.`,
  de: `Die OECD hat das integrierte Paket aus **CRS 2.0** (die Revision des Common Reporting Standard, die EMIs und spezifizierte E-Geld-Produkte in den Meldeumfang aufnimmt und die Sorgfaltspflichten gegenüber controlling persons verschärft) und **CARF** (Crypto-Asset Reporting Framework, das den automatischen Informationsaustausch auf Krypto-Börsen, Verwahrer und Plattformen für Krypto-Derivate ausdehnt) verabschiedet. Die Europäische Union hat das Paket mit der **Richtlinie (EU) 2023/2226 (DAC8)** vom 17. Oktober 2023 in das Unionsrecht überführt; sie ändert die Richtlinie 2011/16/EU und führt beide Bausteine ein. Maßgebliches Anwendungsdatum ist der **1. Januar 2026**, der **erste tatsächliche Datenaustausch** erfolgt im **Januar 2027 über die Daten des Geschäftsjahres 2026**.

Die Botschaft bleibt unverändert: **Die USA stehen aus architektonischen Gründen außerhalb des CRS-Perimeters, nicht aus Intransparenz**. Washington betreibt sein eigenes Regime (FATCA), hat den CRS 1.0 nicht unterzeichnet und wird auch den CRS 2.0 nicht unterzeichnen — weshalb Ihre US-LLC eine in Ihrem Wohnsitzstaat sauber erklärbare Struktur bleibt. Den vollständigen Hintergrund finden Sie in <a href="__MOTHER__">__TITLE__</a>.`,
  pt: `A OCDE aprovou o pacote integrado de **CRS 2.0** (a revisão do Common Reporting Standard, que traz as EMI e os produtos especificados de moeda eletrónica para dentro do perímetro e reforça a due diligence sobre as controlling persons) e **CARF** (Crypto-Asset Reporting Framework, que estende a troca automática a exchanges, custodiantes e plataformas de derivados cripto). A União Europeia transpô-lo através da **Diretiva (UE) 2023/2226 (DAC8)**, aprovada a 17 de outubro de 2023, que altera a 2011/16/UE para incorporar ambas as peças. A data de aplicação material é **1 de janeiro de 2026** e a **primeira troca efetiva** ocorre em **janeiro de 2027, sobre dados do exercício de 2026**.

A narrativa a reter é a de sempre: **os EUA ficam fora do perímetro CRS por arquitetura, não por opacidade**. Washington tem o seu próprio regime (FATCA), não assinou o CRS 1.0 nem irá assinar o 2.0, e é precisamente por isso que a sua LLC norte-americana continua a ser uma estrutura plenamente declarável no seu país de residência. Desenvolvemos o tema em <a href="__MOTHER__">__TITLE__</a>.`,
  ca: `L'OCDE va aprovar el paquet integrat format per **CRS 2.0** (la revisió del Common Reporting Standard, que incorpora les EMI i els productes especificats de diner electrònic dins del perímetre i reforça la due diligence sobre les controlling persons) i **CARF** (Crypto-Asset Reporting Framework, que estén l'intercanvi automàtic a exchanges, custodis i plataformes de derivats cripto). La Unió Europea ho ha transposat mitjançant la **Directiva (UE) 2023/2226 (DAC8)**, aprovada el 17 d'octubre de 2023, que modifica la 2011/16/UE per incorporar les dues peces. La data d'aplicació material és l'**1 de gener de 2026** i el **primer intercanvi efectiu** arriba el **gener de 2027 sobre dades de l'exercici 2026**.

El missatge a retenir és el de sempre: **els EUA queden fora del perímetre CRS per arquitectura, no per opacitat**. Washington té el seu propi règim (FATCA), no va signar el CRS 1.0 i no signarà el 2.0, i és precisament per això que la seva LLC nord-americana continua sent una estructura plenament declarable al seu país de residència. Ho desenvolupem a fons a <a href="__MOTHER__">__TITLE__</a>.`,
};

// Per-slug per-language angle (1-2 sentences) tying the OECD package to the article topic.
// All bare year tokens (2023..) are removed — only legally-anchored forms remain in CORE.
const ANGLE = {
  "crs-cuentas-bancarias-llc-intercambio-informacion": {
    es: `El cuadro de CRS aplicado a tus cuentas bancarias de LLC se actualiza con el paquete OCDE: las EMIs y el dinero electrónico entran de pleno y la due diligence sobre controlling persons se endurece. Lo que ya reportaba Wise Europe SA o Revolut Bank UAB sigue ahí, pero con criterios más estrictos y mayor granularidad en cada autodeclaración.`,
    en: `The CRS picture for your LLC's bank accounts is updated by the OECD package: EMIs and electronic-money products are squarely inside the perimeter and due diligence on controlling persons becomes tighter. What Wise Europe SA or Revolut Bank UAB already reported keeps flowing, only with stricter criteria and more granular self-certifications at onboarding.`,
    fr: `Le tableau du CRS appliqué aux comptes bancaires de votre LLC est mis à jour par le paquet OCDE : les EMI et les produits de monnaie électronique entrent pleinement dans le périmètre et la due diligence sur les controlling persons se durcit. Ce que Wise Europe SA ou Revolut Bank UAB déclaraient déjà reste là, avec des critères plus stricts et une granularité accrue dans chaque autocertification.`,
    de: `Das CRS-Bild für die Bankkonten Ihrer LLC wird vom OECD-Paket aktualisiert: EMIs und E-Geld-Produkte gehören klar in den Meldeumfang und die Sorgfaltspflichten gegenüber controlling persons werden strenger. Was Wise Europe SA oder Revolut Bank UAB ohnehin schon meldeten, bleibt — nur mit strengeren Kriterien und feinerer Granularität bei jeder Selbstauskunft.`,
    pt: `O quadro do CRS aplicado às contas bancárias da sua LLC é atualizado pelo pacote OCDE: as EMI e os produtos de moeda eletrónica entram em pleno no perímetro e a due diligence sobre controlling persons aperta. O que a Wise Europe SA ou o Revolut Bank UAB já reportavam continua a fluir, com critérios mais estritos e maior granularidade em cada autodeclaração.`,
    ca: `El quadre del CRS aplicat als comptes bancaris de la seva LLC s'actualitza amb el paquet OCDE: les EMI i els productes de diner electrònic entren de ple en el perímetre i la due diligence sobre controlling persons es reforça. El que Wise Europe SA o Revolut Bank UAB ja reportaven es manté, amb criteris més estrictes i més granularitat en cada autodeclaració.`,
  },
  "crs-residentes-espana-latam-implicaciones": {
    es: `Para residentes en España y LATAM, el primer impacto práctico llega vía DAC8: la Directiva (UE) 2023/2226 transpone CRS 2.0 + CARF al ordenamiento europeo y aterriza, en cascada, en el Modelo 289 de la AEAT y en los regímenes equivalentes latinoamericanos que apliquen el MCAA actualizado.`,
    en: `For residents of Spain and Latin America, the first concrete impact lands through DAC8: Directive (EU) 2023/2226 transposes CRS 2.0 + CARF into EU law and cascades down into the AEAT's Modelo 289 and the equivalent Latin American regimes that subscribe the updated MCAA.`,
    fr: `Pour les résidents en Espagne et en Amérique latine, le premier impact concret arrive via DAC8 : la directive (UE) 2023/2226 transpose le CRS 2.0 et le CARF dans le droit européen, puis se déverse en cascade dans le Modelo 289 de l'AEAT et dans les régimes latino-américains équivalents qui souscrivent le MCAA mis à jour.`,
    de: `Für Steueransässige in Spanien und Lateinamerika wirkt der erste praktische Effekt über DAC8: Die Richtlinie (EU) 2023/2226 setzt CRS 2.0 und CARF in EU-Recht um und schlägt sich anschließend im Modelo 289 der AEAT und in den lateinamerikanischen Pendants nieder, die das aktualisierte MCAA mitzeichnen.`,
    pt: `Para residentes em Espanha e na América Latina, o primeiro impacto prático chega por via da DAC8: a Diretiva (UE) 2023/2226 transpõe o CRS 2.0 e o CARF para o direito europeu e cai em cascata no Modelo 289 da AEAT e nos regimes latino-americanos equivalentes que subscrevem o MCAA atualizado.`,
    ca: `Per a residents a Espanya i Llatinoamèrica, el primer impacte pràctic arriba via DAC8: la Directiva (UE) 2023/2226 transposa el CRS 2.0 i el CARF a l'ordenament europeu i cau en cascada al Modelo 289 de l'AEAT i als règims llatinoamericans equivalents que subscriuen el MCAA actualitzat.`,
  },
  "cuentas-bancarias-usa-reportan-hacienda-verdad": {
    es: `La verdad sobre lo que reportan los bancos americanos no se mueve con el paquete OCDE: el CRS 2.0 amplía el perímetro fuera de Estados Unidos, pero el sistema bancario doméstico americano sigue sin reportar a tu hacienda de residencia por la simple razón de que Estados Unidos no es jurisdicción CRS y no lo va a ser.`,
    en: `The honest answer about what US banks report does not change with the OECD package: CRS 2.0 widens the perimeter outside the United States, but the domestic US banking system still does not report to your home tax authority for the simple reason that the United States is not — and will not be — a CRS jurisdiction.`,
    fr: `La vérité sur ce que déclarent les banques américaines ne bouge pas avec le paquet OCDE : le CRS 2.0 élargit le périmètre hors des États-Unis, mais le système bancaire domestique américain continue à ne pas déclarer à votre fisc de résidence, pour la simple raison que les États-Unis ne sont pas — et ne seront pas — une juridiction CRS.`,
    de: `Die ehrliche Antwort auf die Frage, was US-Banken melden, verändert sich durch das OECD-Paket nicht: CRS 2.0 weitet den Perimeter außerhalb der USA aus, aber das inneramerikanische Bankensystem meldet weiterhin nicht an Ihr Wohnsitz-Finanzamt — schlicht weil die USA keine CRS-Jurisdiktion sind und es auch nicht werden.`,
    pt: `A verdade sobre o que os bancos americanos reportam não muda com o pacote OCDE: o CRS 2.0 alarga o perímetro fora dos Estados Unidos, mas o sistema bancário doméstico americano continua a não reportar à sua autoridade fiscal de residência, pela simples razão de que os EUA não são — e não vão ser — jurisdição CRS.`,
    ca: `La veritat sobre el que reporten els bancs americans no es mou amb el paquet OCDE: el CRS 2.0 amplia el perímetre fora dels Estats Units, però el sistema bancari domèstic americà segueix sense reportar a la seva hisenda de residència per la simple raó que els EUA no són —ni seran— jurisdicció CRS.`,
  },
  "revolut-business-crs-reporting-fiscal": {
    es: `Revolut Bank UAB es entidad de crédito lituana plenamente sujeta a CRS desde el día uno; con el paquete OCDE lo que cambia para la cuenta de Revolut Business de tu LLC es el endurecimiento de la due diligence sobre controlling persons y la integración explícita de los productos de dinero electrónico bajo el nuevo perímetro CRS 2.0.`,
    en: `Revolut Bank UAB is a Lithuanian credit institution fully inside CRS since day one; what shifts for your LLC's Revolut Business account with the OECD package is tighter due diligence on controlling persons and the explicit inclusion of electronic-money products under the new CRS 2.0 perimeter.`,
    fr: `Revolut Bank UAB est un établissement de crédit lituanien pleinement soumis au CRS depuis le premier jour ; ce qui change pour le compte Revolut Business de votre LLC avec le paquet OCDE, c'est le durcissement de la due diligence sur les controlling persons et l'inclusion explicite des produits de monnaie électronique dans le nouveau périmètre CRS 2.0.`,
    de: `Revolut Bank UAB ist ein litauisches Kreditinstitut, das von Anfang an vollständig unter CRS fällt; was sich für das Revolut-Business-Konto Ihrer LLC mit dem OECD-Paket ändert, ist die strengere Sorgfaltspflicht gegenüber controlling persons und die ausdrückliche Einbeziehung der E-Geld-Produkte in den neuen CRS-2.0-Perimeter.`,
    pt: `O Revolut Bank UAB é uma instituição de crédito lituana plenamente sujeita ao CRS desde o primeiro dia; o que muda para a conta Revolut Business da sua LLC com o pacote OCDE é o aperto na due diligence sobre as controlling persons e a integração explícita dos produtos de moeda eletrónica no novo perímetro CRS 2.0.`,
    ca: `Revolut Bank UAB és una entitat de crèdit lituana plenament subjecta al CRS des del primer dia; el que canvia per al compte de Revolut Business de la seva LLC amb el paquet OCDE és el reforç de la due diligence sobre controlling persons i la integració explícita dels productes de diner electrònic en el nou perímetre CRS 2.0.`,
  },
  "wise-business-crs-reporting-fiscal": {
    es: `Wise Europe SA es una EMI belga, y con CRS 2.0 las EMIs y los productos específicos de dinero electrónico quedan plenamente identificados como instituciones reportables; la due diligence sobre controlling persons de Passive NFEs se endurece y la apertura de Wise Business para tu LLC pasa a documentarse con criterios más exigentes.`,
    en: `Wise Europe SA is a Belgian EMI, and under CRS 2.0 EMIs and specified electronic-money products are squarely classified as Reporting Financial Institutions; due diligence on the controlling persons of Passive NFEs becomes tighter and the Wise Business onboarding of your LLC will be documented under more demanding criteria.`,
    fr: `Wise Europe SA est une EMI belge, et avec le CRS 2.0 les EMI et les produits spécifiés de monnaie électronique sont pleinement classés comme Reporting Financial Institutions ; la due diligence sur les controlling persons des Passive NFEs se durcit et l'ouverture de Wise Business pour votre LLC sera documentée selon des critères plus exigeants.`,
    de: `Wise Europe SA ist ein belgisches E-Geld-Institut, und unter CRS 2.0 werden EMIs und spezifizierte E-Geld-Produkte klar als Reporting Financial Institutions eingestuft; die Sorgfaltspflichten gegenüber den controlling persons von Passive NFEs werden strenger und die Eröffnung des Wise-Business-Kontos für Ihre LLC wird nach anspruchsvolleren Kriterien dokumentiert.`,
    pt: `A Wise Europe SA é uma EMI belga e, com o CRS 2.0, as EMI e os produtos especificados de moeda eletrónica ficam claramente classificados como Reporting Financial Institutions; a due diligence sobre as controlling persons de Passive NFEs aperta e a abertura da Wise Business para a sua LLC passa a documentar-se com critérios mais exigentes.`,
    ca: `Wise Europe SA és una EMI belga, i amb el CRS 2.0 les EMI i els productes específics de diner electrònic queden plenament classificats com a Reporting Financial Institutions; la due diligence sobre les controlling persons de Passive NFEs es reforça i l'obertura de Wise Business per a la seva LLC passa a documentar-se amb criteris més exigents.`,
  },
  "wise-iban-llc-que-reporta-hacienda": {
    es: `El IBAN belga de tu cuenta Wise para la LLC ya estaba dentro del perímetro CRS de origen, pero el paquete OCDE refuerza el detalle y la due diligence: con CRS 2.0 vigente, lo que sale de Bélgica hacia tu hacienda llega más completo y con menor margen para una clasificación laxa de la entidad.`,
    en: `Your LLC's Belgian Wise IBAN was already inside the original CRS perimeter, but the OECD package tightens both the data set and the due diligence: with CRS 2.0 in force, what flows out of Belgium toward your home tax authority arrives more complete and leaves much less room for a lax entity classification.`,
    fr: `L'IBAN belge de votre compte Wise pour la LLC entrait déjà dans le périmètre CRS d'origine, mais le paquet OCDE renforce à la fois le contenu et la due diligence : avec le CRS 2.0 en vigueur, ce qui part de Belgique vers votre fisc arrive plus complet et laisse beaucoup moins de marge pour une classification laxiste de l'entité.`,
    de: `Die belgische Wise-IBAN Ihrer LLC lag bereits unter dem ursprünglichen CRS-Perimeter, aber das OECD-Paket verschärft sowohl den Datenumfang als auch die Sorgfaltspflichten: Mit geltendem CRS 2.0 verlässt mehr Information Belgien Richtung Ihres Wohnsitz-Finanzamts und es bleibt deutlich weniger Spielraum für eine laxe Entitäts-Klassifikation.`,
    pt: `O IBAN belga da sua conta Wise para a LLC já estava dentro do perímetro CRS de origem, mas o pacote OCDE reforça quer o detalhe quer a due diligence: com o CRS 2.0 em vigor, o que sai da Bélgica em direção à sua autoridade fiscal chega mais completo e com muito menos margem para uma classificação laxista da entidade.`,
    ca: `L'IBAN belga del seu compte Wise per a la LLC ja estava dins del perímetre CRS d'origen, però el paquet OCDE reforça tant el detall com la due diligence: amb el CRS 2.0 en vigor, el que surt de Bèlgica cap a la seva hisenda arriba més complet i amb molt menys marge per a una classificació laxa de l'entitat.`,
  },
  "dac8-criptomonedas-reporting-fiscal-2026": {
    es: `DAC8 no es un texto aislado: es la transposición europea del CARF aprobado por la OCDE dentro del paquete integrado con CRS 2.0. Por eso el calendario y el alcance de la pieza cripto son los del paquete completo y no los de una directiva suelta.`,
    en: `DAC8 is not a standalone text: it is the European transposition of the CARF that the OECD adopted inside the integrated package with CRS 2.0. That is why the timetable and the scope of the crypto piece match the full package and not those of a stand-alone directive.`,
    fr: `DAC8 n'est pas un texte isolé : c'est la transposition européenne du CARF adopté par l'OCDE à l'intérieur du paquet intégré avec le CRS 2.0. C'est pourquoi le calendrier et la portée de la pièce crypto sont ceux du paquet complet et non ceux d'une directive isolée.`,
    de: `DAC8 ist kein eigenständiger Text: Es ist die europäische Umsetzung des CARF, das die OECD innerhalb des mit CRS 2.0 integrierten Pakets verabschiedet hat. Deshalb entsprechen Zeitplan und Reichweite des Krypto-Bausteins dem Gesamtpaket und nicht denen einer isolierten Richtlinie.`,
    pt: `A DAC8 não é um texto isolado: é a transposição europeia do CARF aprovado pela OCDE dentro do pacote integrado com o CRS 2.0. Por isso, o calendário e o alcance da peça cripto são os do pacote completo e não os de uma diretiva avulsa.`,
    ca: `DAC8 no és un text aïllat: és la transposició europea del CARF aprovat per l'OCDE dins del paquet integrat amb el CRS 2.0. Per això el calendari i l'abast de la peça cripto són els del paquet complet i no els d'una directiva solta.`,
  },
  "dac7-plataformas-digitales-reporting-2026": {
    es: `DAC7 cubre desde su entrada en vigor el reporting de plataformas digitales (Airbnb, Vinted, Etsy, Amazon, Wallapop) hacia las haciendas europeas; con DAC8 entrando en vigor el 1 de enero de 2026 sobre criptoactivos y el CRS 2.0 actualizado, el paquete OCDE cierra el círculo digital y fija la fotografía completa de lo que tu hacienda recibe automáticamente cada año.`,
    en: `DAC7 has covered the reporting of digital platforms (Airbnb, Vinted, Etsy, Amazon, Wallapop) toward European tax authorities since it took effect; with DAC8 entering into force on 1 January 2026 over crypto-assets and the revised CRS 2.0, the OECD package closes the digital loop and locks the full picture of what your tax authority receives automatically each year.`,
    fr: `Depuis son entrée en vigueur, DAC7 couvre la déclaration des plateformes numériques (Airbnb, Vinted, Etsy, Amazon, Wallapop) vers les administrations fiscales européennes ; avec DAC8 qui entre en vigueur le 1er janvier 2026 sur les crypto-actifs et le CRS 2.0 révisé, le paquet OCDE ferme la boucle numérique et fige l'image complète de ce que votre fisc reçoit automatiquement chaque année.`,
    de: `Seit ihrem Inkrafttreten deckt DAC7 die Meldung digitaler Plattformen (Airbnb, Vinted, Etsy, Amazon, Wallapop) gegenüber den europäischen Steuerbehörden ab; mit DAC8, das am 1. Januar 2026 für Kryptowerte in Kraft tritt, und dem überarbeiteten CRS 2.0 schließt das OECD-Paket den digitalen Kreis und fixiert das vollständige Bild dessen, was Ihr Finanzamt jedes Jahr automatisch erhält.`,
    pt: `Desde a sua entrada em vigor, a DAC7 cobre o reporting das plataformas digitais (Airbnb, Vinted, Etsy, Amazon, Wallapop) para as autoridades fiscais europeias; com a DAC8 a entrar em vigor a 1 de janeiro de 2026 sobre criptoativos e o CRS 2.0 revisto, o pacote OCDE fecha o círculo digital e fixa a fotografia completa do que a sua autoridade fiscal recebe automaticamente todos os anos.`,
    ca: `Des de la seva entrada en vigor, la DAC7 cobreix el reporting de les plataformes digitals (Airbnb, Vinted, Etsy, Amazon, Wallapop) cap a les hisendes europees; amb la DAC8 entrant en vigor l'1 de gener de 2026 sobre criptoactius i el CRS 2.0 revisat, el paquet OCDE tanca el cercle digital i fixa la fotografia completa del que la seva hisenda rep automàticament cada any.`,
  },
  "modelo-720-721-residentes-espana-cuentas-cripto-extranjero": {
    es: `Para el residente en España, el paquete OCDE (CRS 2.0 + CARF transpuesto vía DAC8) reforzará los cruces que la AEAT ya hace contra el Modelo 720 (cuentas y valores en el extranjero) y el Modelo 721 (criptoactivos custodiados fuera): más entidades reportadoras, más datos por cuenta y más automatismo en cada cuadre.`,
    en: `For Spanish residents, the OECD package (CRS 2.0 + CARF transposed via DAC8) will reinforce the cross-checks that the AEAT already runs against Modelo 720 (foreign accounts and securities) and Modelo 721 (crypto-assets custodied abroad): more reporting institutions, more data per account and more automation on every reconciliation.`,
    fr: `Pour le résident en Espagne, le paquet OCDE (CRS 2.0 + CARF transposé via DAC8) renforcera les croisements que l'AEAT effectue déjà contre le Modelo 720 (comptes et valeurs à l'étranger) et le Modelo 721 (crypto-actifs en garde à l'étranger) : davantage d'institutions déclarantes, davantage de données par compte et davantage d'automatisme dans chaque rapprochement.`,
    de: `Für in Spanien Ansässige verstärkt das OECD-Paket (CRS 2.0 + CARF, via DAC8 umgesetzt) die Abgleiche, die die AEAT bereits gegen das Modelo 720 (im Ausland gehaltene Konten und Wertpapiere) und das Modelo 721 (im Ausland verwahrte Krypto-Werte) fährt: mehr meldepflichtige Institutionen, mehr Daten je Konto und mehr Automatik bei jedem Abgleich.`,
    pt: `Para o residente em Espanha, o pacote OCDE (CRS 2.0 + CARF transposto via DAC8) reforçará os cruzamentos que a AEAT já faz contra o Modelo 720 (contas e valores no estrangeiro) e o Modelo 721 (criptoativos custodiados fora): mais instituições reportantes, mais dados por conta e mais automatismo em cada conciliação.`,
    ca: `Per al resident a Espanya, el paquet OCDE (CRS 2.0 + CARF transposat via DAC8) reforçarà els encreuaments que l'AEAT ja fa contra el Model 720 (comptes i valors a l'estranger) i el Model 721 (criptoactius custodiats fora): més entitats reportants, més dades per compte i més automatisme en cada quadre.`,
  },
  "visa-mastercard-reporting-tarjetas-hacienda": {
    es: `Lo que NO cubre el paquete OCDE es el gasto puro con tarjeta: CRS 2.0 amplía el perímetro a EMIs y dinero electrónico, CARF añade los criptoactivos, pero el flujo Visa/Mastercard de pago sigue fuera del intercambio automático fiscal y se gobierna por reglas distintas (KYC del emisor + procedimientos de cooperación administrativa caso a caso).`,
    en: `What the OECD package does NOT cover is pure card spending: CRS 2.0 widens the perimeter to EMIs and electronic-money products, CARF adds crypto-assets, but Visa/Mastercard payment flows stay outside the automatic tax exchange and are governed by different rules (issuer KYC plus case-by-case administrative cooperation).`,
    fr: `Ce que le paquet OCDE ne couvre PAS, c'est la dépense pure par carte : le CRS 2.0 élargit le périmètre aux EMI et aux produits de monnaie électronique, le CARF ajoute les crypto-actifs, mais le flux de paiement Visa/Mastercard reste hors de l'échange automatique fiscal et obéit à des règles différentes (KYC de l'émetteur et coopération administrative au cas par cas).`,
    de: `Was das OECD-Paket NICHT abdeckt, sind die reinen Kartenausgaben: CRS 2.0 weitet den Perimeter auf EMIs und E-Geld-Produkte aus, CARF ergänzt die Krypto-Werte, aber der Visa-/Mastercard-Zahlungsfluss bleibt außerhalb des automatischen steuerlichen Datenaustauschs und wird nach anderen Regeln geführt (KYC des Ausstellers plus Amtshilfe im Einzelfall).`,
    pt: `O que o pacote OCDE NÃO cobre é o consumo puro com cartão: o CRS 2.0 alarga o perímetro às EMI e aos produtos de moeda eletrónica, o CARF acrescenta os criptoativos, mas o fluxo Visa/Mastercard de pagamento fica fora da troca automática fiscal e é governado por regras distintas (KYC do emissor mais cooperação administrativa caso a caso).`,
    ca: `El que NO cobreix el paquet OCDE és la despesa pura amb targeta: el CRS 2.0 amplia el perímetre a EMI i diner electrònic, el CARF hi afegeix els criptoactius, però el flux Visa/Mastercard de pagament queda fora de l'intercanvi automàtic fiscal i es governa per regles diferents (KYC de l'emissor més cooperació administrativa cas a cas).`,
  },
};

const TAG_OPEN = "<!-- exentax:crs2-update-v1 -->";
const TAG_CLOSE = "<!-- /exentax:crs2-update-v1 -->";

function buildBlock(slug, lang) {
  const m = MOTHER[lang];
  const motherUrl = `/${lang}/blog/${m.slug}`;
  const core = CORE[lang].replaceAll("__MOTHER__", motherUrl).replaceAll("__TITLE__", m.title);
  const angle = ANGLE[slug][lang];
  return `${TAG_OPEN}
${HEADER[lang]}

${angle}

${core}
${TAG_CLOSE}`;
}

function injectIntoFile(filePath, slug, lang) {
  const original = fs.readFileSync(filePath, "utf8");
  const block = buildBlock(slug, lang);

  // If a previous block exists, replace it in place (idempotent re-injection).
  const blockRx = /<!--\s*exentax:crs2-update-v1\s*-->[\s\S]*?<!--\s*\/\s*exentax:crs2-update-v1\s*-->/;
  if (blockRx.test(original)) {
    const next = original.replace(blockRx, block);
    if (next !== original) {
      fs.writeFileSync(filePath, next, "utf8");
      return { written: true, replaced: true };
    }
    return { skipped: true, reason: "no-change" };
  }

  // Otherwise insert before the first H2.
  const lines = original.split("\n");
  let firstH2 = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^## /.test(lines[i])) {
      firstH2 = i;
      break;
    }
  }
  if (firstH2 === -1) {
    return { skipped: true, reason: "no-h2-found" };
  }
  const before = lines.slice(0, firstH2).join("\n").replace(/\s+$/, "");
  const after = lines.slice(firstH2).join("\n");
  const next = `${before}\n\n${block}\n\n${after}`;
  fs.writeFileSync(filePath, next, "utf8");
  return { written: true };
}

let written = 0;
let skipped = 0;
for (const slug of SLUGS) {
  for (const lang of LANGS) {
    const file = path.join(ROOT, lang, `${slug}.ts`);
    if (!fs.existsSync(file)) {
      console.log(`MISSING: ${lang}/${slug}.ts`);
      continue;
    }
    const r = injectIntoFile(file, slug, lang);
    if (r.written) {
      written += 1;
      console.log(`OK     ${lang}/${slug}.ts${r.replaced ? " (replaced)" : ""}`);
    } else {
      skipped += 1;
      console.log(`SKIP   ${lang}/${slug}.ts (${r.reason})`);
    }
  }
}
console.log(`\nDone. written=${written} skipped=${skipped}`);
