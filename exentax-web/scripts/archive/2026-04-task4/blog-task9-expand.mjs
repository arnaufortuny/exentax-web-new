#!/usr/bin/env node
/*
 * blog-task9-expand.mjs
 * Inserts a new H2 block (kw angle 2026) into 7 existing articles across 6
 * languages (es, en, fr, de, pt, ca) and bumps their `updatedAt` in
 * blog-posts.ts to 2026-04-21. Idempotent: detects a marker and skips.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT = resolve(ROOT, "client/src/data/blog-content");
const POSTS = resolve(ROOT, "client/src/data/blog-posts.ts");

const MARKER = "<!-- task9-2026-expansion -->";

const SLUGS_I18N = {
  "modelo-720-721-residentes-espana-cuentas-cripto-extranjero": {
    en: "modelo-720-and-modelo-721-guide-for-spanish-residents-with-foreign-accounts-and-crypto",
    fr: "modelo-720-et-modelo-721-guide-pour-les-residents-en-espagne-avec-comptes-et-crypto-a-letranger",
    de: "modelo-720-und-modelo-721-leitfaden-fur-in-spanien-ansassige-mit-auslandskonten-und-krypto",
    pt: "modelo-720-e-modelo-721-guia-para-residentes-em-espanha-com-contas-e-cripto-no-estrangeiro",
    ca: "model-720-i-model-721-guia-per-a-residents-a-espanya-amb-comptes-i-cripto-a-lestranger",
  },
  "cuentas-bancarias-usa-reportan-hacienda-verdad": {
    en: "do-us-bank-accounts-report-to-your-home-tax-authority-the-honest-answer",
    fr: "les-comptes-bancaires-americains-rapportent-ils-a-votre-administration-fiscale-l",
    de: "melden-us-bankkonten-an-ihre-heimische-steuerbehorde-die-ehrliche-antwort",
    pt: "as-contas-bancarias-americanas-reportam-a-sua-autoridade-fiscal-a-resposta-hones",
    ca: "els-comptes-bancaris-americans-informen-a-la-teva-autoritat-fiscal-la-resposta-h",
  },
  "cuenta-bancaria-mercury-llc-extranjero": {
    en: "how-to-open-a-mercury-account-for-your-llc-from-any-country",
    fr: "comment-ouvrir-un-compte-mercury-pour-votre-llc-depuis-nimporte-quel-pays",
    de: "mercury-konto-fur-ihre-llc-eroffnen-aus-jedem-land",
    pt: "como-abrir-uma-conta-mercury-para-sua-llc-de-qualquer-pais",
    ca: "com-obrir-un-compte-mercury-per-a-la-teva-llc-des-de-qualsevol-pais",
  },
  "llc-alternativa-autonomo-espana": {
    en: "us-llc-as-an-alternative-to-being-self-employed-in-spain",
    fr: "llc-comme-alternative-au-statut-dautonomo-en-espagne",
    de: "llc-als-alternative-zum-autonomo-status-in-spanien",
    pt: "llc-como-alternativa-a-ser-autonomo-em-espanha",
    ca: "llc-com-a-alternativa-a-ser-autonom-a-espanya",
  },
  "caminos-legales-minimos-impuestos": {
    en: "legal-paths-to-minimize-your-taxes",
    fr: "voies-legales-pour-minimiser-vos-impots",
    de: "legale-wege-um-ihre-steuern-zu-minimieren",
    pt: "caminhos-legais-para-minimizar-impostos",
    ca: "camins-legals-per-minimitzar-impostos",
  },
  "estructura-offshore-beneficios-riesgos": {
    en: "offshore-structures-benefits-and-real-risks",
    fr: "structures-offshore-benefices-et-risques-reels",
    de: "offshore-strukturen-vorteile-und-echte-risiken",
    pt: "estruturas-offshore-beneficios-e-riscos-reais",
    ca: "estructures-offshore-beneficis-i-riscos-reals",
  },
  "nomada-digital-residencia-fiscal": {
    en: "digital-nomad-where-to-pay-taxes-and-how-to-choose-your-tax-residency",
    fr: "nomade-numerique-ou-payer-ses-impots-et-comment-choisir-sa-residence-fiscale",
    de: "digitaler-nomade-wo-steuern-zahlen-und-steuerlichen-wohnsitz-wahlen",
    pt: "nomade-digital-onde-pagar-impostos-e-como-escolher-a-residencia-fiscal",
    ca: "nomada-digital-on-pagar-impostos-i-com-triar-la-residencia-fiscal",
  },
};

const LLC_SLUG = {
  es: "llc-estados-unidos-guia-completa-2026",
  en: "llc-in-the-united-states-complete-guide-for-non-residents-in-2026",
  fr: "llc-aux-etats-unis-guide-complet-pour-non-residents-en-2026",
  de: "llc-in-den-usa-vollstandiger-leitfaden-fur-nicht-residenten-2026",
  pt: "llc-nos-estados-unidos-guia-completo-para-nao-residentes-em-2026",
  ca: "llc-als-estats-units-guia-completa-per-a-no-residents-el-2026",
};

const BOOK = { es: "agendar", en: "book", fr: "reserver", de: "buchen", pt: "agendar", ca: "agendar" };

function blogLink(lang, esSlug, label) {
  const slug = lang === "es" ? esSlug : SLUGS_I18N[esSlug]?.[lang] || esSlug;
  return `<a href="/${lang}/blog/${slug}">${label}</a>`;
}
function calc(lang, label) { return `<a href="/${lang}#calculadora">${label}</a>`; }
function book(lang, label) { return `<a href="/${lang}/${BOOK[lang]}">${label}</a>`; }

// ---------------------------------------------------------------------------
// BLOCKS: per article, per language. Each block must add >=1500 chars,
// include at least one CTA (calculadora or booking) and one cross-link.
// No em-dashes (—) allowed. Markdown.
// ---------------------------------------------------------------------------

const BLOCKS = {};

// 1) modelo-720-721 → "Cómo declarar paso a paso (Modelo 720)"
BLOCKS["modelo-720-721-residentes-espana-cuentas-cripto-extranjero"] = {
  es: `
## Cómo declarar el Modelo 720 paso a paso en 2026: formulario, casillas y ejemplos prácticos

Más allá del marco legal, en la consulta diaria nos preguntan exactamente lo mismo: "tengo Wise, Mercury, un broker y algo de cripto, ¿cómo lo presento sin errores?". Este bloque traduce el reglamento en un tutorial procedimental aplicable a la campaña de **enero a 31 de marzo de 2026**.

### Acceso y obligación de declarar

El Modelo 720 se presenta de forma exclusivamente telemática en la Sede Electrónica de la AEAT con certificado digital, DNIe o Cl@ve PIN. La obligación nace cuando, a 31 de diciembre, la suma del **bloque de cuentas bancarias en el extranjero** supera los **50.000 euros**, con la misma regla aplicada de forma independiente al **bloque de valores, seguros y rentas** y al **bloque de inmuebles**. Si en años posteriores el saldo de un bloque ya declarado se incrementa en más de 20.000 euros, vuelve a haber obligación. La doctrina vigente proviene de la Ley 7/2012 y de la STJUE C-788/19 de 27 de enero de 2022, que tumbó el régimen sancionador desproporcionado pero mantiene la obligación informativa.

### Casillas que más errores generan

- **Tipo de declaración (1)**: marcar "informativa", "complementaria" o "sustitutiva". Mezclarlas obliga a anular y volver a presentar.
- **Clave de condición del declarante (2)**: titular, autorizado, beneficiario o representante. Para Wise Personal en EUR la clave habitual es titular; si la cuenta es Wise Business de tu LLC, la clave es la sociedad y tú firmas como representante.
- **Saldo a 31/12 (valor V)** y **saldo medio último trimestre (valor M)**: ambos en euros con tipo de cambio oficial del Banco Central Europeo del 31/12/2025.
- **Identificación de la entidad y país**: NIF de la entidad si lo tiene, código BIC y código ISO del país. Wise figura como Wise Payments Limited (UK) o Wise US Inc. según producto; Mercury opera con Choice Financial Group y Column N.A. en Estados Unidos.

### Ejemplo numérico bloque por bloque

Caso de un freelancer residente en Madrid con: Wise EUR balance 18.400 €, Mercury Personal Savings 22.300 USD, broker Interactive Brokers con cartera 41.000 €, Kraken con 6.200 € en BTC y ETH. Bloque cuentas: 18.400 + 22.300 USD convertidos al BCE = 39.000 € aprox., por debajo del umbral, **no obliga**. Bloque valores: 41.000 €, por debajo del umbral, **no obliga**. Bloque cripto (Modelo 721): 6.200 €, por debajo del umbral de 50.000 €, **no obliga**. Si al año siguiente añade 35.000 € a Mercury, el bloque cuentas pasa a 74.000 € y dispara la obligación del 720 ese ejercicio.

### Errores que más sanciones generan en 2026

1. Olvidar las cuentas Wise Business y Mercury de la LLC cuando el dueño es titular real.
2. No volver a declarar tras un incremento superior a 20.000 € respecto al último 720 presentado.
3. Confundir el saldo medio del último trimestre con el promedio anual.
4. Declarar tarde con presentación voluntaria sin requerimiento: las sanciones son leves pero existen recargos del artículo 27 LGT.

> **¿Tu stack roza los 50.000 € por bloque?** Pasa tus saldos por la ${calc("es", "calculadora fiscal Exentax")} y mira si el cambio a estructura LLC declarada y limpia compensa la complejidad operativa actual.

Para profundizar en el reporting bancario que precede al 720 conviene leer ${blogLink("es", "cuentas-bancarias-usa-reportan-hacienda-verdad", "qué reporta de verdad cada banco USA a Hacienda")}, y si tu objetivo es minimizar la carga global, el camino lo tienes en ${blogLink("es", "caminos-legales-minimos-impuestos", "los caminos legales para pagar el mínimo de impuestos")}. Si prefieres delegar la presentación, ${book("es", "agenda una sesión con el equipo Exentax")} y la dejamos hecha en una semana.
`,
  en: `
## Filing Modelo 720 step by step in 2026: form, boxes and worked examples

Beyond the legal framework, the question we hear every week in the office is the same one: "I have Wise, Mercury, a broker and some crypto, how do I file this without mistakes?". This block turns the regulation into a procedural tutorial for the **1 January to 31 March 2026** filing window.

### Access and reporting threshold

Modelo 720 is filed exclusively online at the AEAT Sede Electrónica using a digital certificate, DNIe or Cl@ve PIN. The duty to file is triggered when, on 31 December, the **block of foreign bank accounts** exceeds **EUR 50,000**, with the same independent rule applied to the **block of securities, insurance and annuities** and the **block of real estate**. In subsequent years, an increase above EUR 20,000 in any already declared block reopens the duty. The current doctrine derives from Ley 7/2012 and from CJEU judgment C-788/19 of 27 January 2022, which struck down the disproportionate penalty regime but kept the reporting obligation alive.

### Boxes that produce most filing errors

- **Type of return (1)**: select "informativa", "complementaria" or "sustitutiva". Mixing them up forces a full re-file.
- **Filer status code (2)**: holder, authorised user, beneficiary or representative. For a Wise Personal EUR account the code is holder; for a Wise Business or Mercury account belonging to your LLC, the holder is the company and you sign as representative.
- **Balance on 31 Dec (V) and last quarter average balance (M)**: both expressed in EUR using the official European Central Bank rate at 31 December 2025.
- **Institution and country ID**: tax ID of the institution if available, BIC code and ISO country code. Wise appears as Wise Payments Limited (UK) or Wise US Inc. depending on the product; Mercury runs through Choice Financial Group and Column N.A. in the United States.

### Worked example, block by block

Madrid based freelancer with: Wise EUR balance EUR 18,400, Mercury Personal Savings USD 22,300, Interactive Brokers portfolio EUR 41,000, Kraken with EUR 6,200 in BTC and ETH. Bank accounts block: 18,400 plus 22,300 USD at the ECB rate is roughly EUR 39,000, below the threshold, **no filing duty**. Securities block: EUR 41,000, below the threshold, **no filing duty**. Crypto block (Modelo 721): EUR 6,200, below EUR 50,000, **no filing duty**. If next year EUR 35,000 lands on Mercury, the bank block jumps to EUR 74,000 and triggers a Modelo 720 filing for that year.

### Mistakes that drive most sanctions in 2026

1. Skipping the Wise Business and Mercury accounts of the LLC when the owner is the beneficial owner.
2. Forgetting to refile after an increase above EUR 20,000 versus the previously filed 720.
3. Confusing the last quarter average balance with the full year average.
4. Filing late voluntarily without prior demand: penalties are mild but article 27 LGT surcharges still apply.

> **Is your stack flirting with the EUR 50,000 per block line?** Run your balances through the ${calc("en", "Exentax tax calculator")} and see whether moving to a properly declared LLC structure offsets the current operational complexity.

For the bank reporting layer that precedes Modelo 720, read ${blogLink("en", "cuentas-bancarias-usa-reportan-hacienda-verdad", "what US banks really report to your home tax authority")}, and if your goal is minimising total tax, the map is in ${blogLink("en", "caminos-legales-minimos-impuestos", "the legal paths to minimise your taxes")}. If you would rather delegate the actual filing, ${book("en", "book a call with the Exentax team")} and we close it in one week.
`,
  fr: `
## Déclarer le Modelo 720 pas à pas en 2026: formulaire, cases et exemples chiffrés

Au-delà du cadre légal, la question revient chaque semaine en consultation: "j'ai Wise, Mercury, un broker et de la crypto, comment je remplis ça sans erreurs?". Ce bloc traduit la norme en un tutoriel applicable à la campagne du **1er janvier au 31 mars 2026**.

### Accès et seuil d'obligation

Le Modelo 720 se dépose uniquement en ligne sur la Sede Electrónica de l'AEAT avec certificat numérique, DNIe ou Cl@ve PIN. L'obligation naît lorsque, au 31 décembre, le **bloc des comptes bancaires à l'étranger** dépasse **50 000 EUR**, avec la même règle appliquée de manière indépendante au **bloc des valeurs, assurances et rentes** et au **bloc des biens immobiliers**. Les années suivantes, une hausse de plus de 20 000 EUR dans un bloc déjà déclaré rouvre l'obligation. La doctrine en vigueur découle de la Ley 7/2012 et de l'arrêt CJUE C-788/19 du 27 janvier 2022, qui a abrogé le régime de sanctions disproportionné tout en maintenant l'obligation informative.

### Cases qui génèrent le plus d'erreurs

- **Type de déclaration (1)**: cocher "informativa", "complementaria" ou "sustitutiva". Les confondre oblige à tout reprendre.
- **Code de qualité du déclarant (2)**: titulaire, autorisé, bénéficiaire ou représentant. Pour Wise Personal en EUR le code est titulaire; pour un compte Wise Business ou Mercury de votre LLC, le titulaire est la société et vous signez comme représentant.
- **Solde au 31/12 (V) et solde moyen du dernier trimestre (M)**: les deux en EUR au cours officiel BCE du 31 décembre 2025.
- **Identification de l'établissement et du pays**: NIF de l'établissement s'il existe, code BIC et code ISO du pays. Wise apparaît comme Wise Payments Limited (UK) ou Wise US Inc. selon le produit; Mercury opère via Choice Financial Group et Column N.A. aux États-Unis.

### Exemple chiffré, bloc par bloc

Freelance résidant à Madrid avec: Wise EUR solde 18 400 EUR, Mercury Personal Savings 22 300 USD, portefeuille Interactive Brokers 41 000 EUR, Kraken avec 6 200 EUR en BTC et ETH. Bloc comptes: 18 400 plus 22 300 USD au cours BCE soit environ 39 000 EUR, sous le seuil, **pas d'obligation**. Bloc valeurs: 41 000 EUR, sous le seuil, **pas d'obligation**. Bloc crypto (Modelo 721): 6 200 EUR, sous 50 000 EUR, **pas d'obligation**. Si l'année suivante 35 000 EUR arrivent sur Mercury, le bloc comptes passe à 74 000 EUR et déclenche un Modelo 720.

### Erreurs qui produisent le plus de sanctions en 2026

1. Oublier les comptes Wise Business et Mercury de la LLC quand le bénéficiaire effectif est le dirigeant.
2. Ne pas redéclarer après une hausse supérieure à 20 000 EUR par rapport au dernier 720.
3. Confondre la moyenne du dernier trimestre avec la moyenne annuelle.
4. Déposer tard à titre volontaire: pénalités modestes, mais les majorations de l'article 27 LGT s'appliquent.

> **Votre stack frôle les 50 000 EUR par bloc?** Passez vos soldes dans le ${calc("fr", "calculateur fiscal Exentax")} et voyez si une LLC bien déclarée compense la complexité actuelle.

Pour la couche bancaire en amont du 720, lisez ${blogLink("fr", "cuentas-bancarias-usa-reportan-hacienda-verdad", "ce que les banques US déclarent vraiment à votre fisc")}, et pour la stratégie globale ${blogLink("fr", "caminos-legales-minimos-impuestos", "les voies légales pour minimiser vos impôts")}. Pour déléguer le dépôt, ${book("fr", "réservez un échange avec l'équipe Exentax")} et on le clôture en une semaine.
`,
  de: `
## Modelo 720 Schritt für Schritt einreichen in 2026: Formular, Felder und Rechenbeispiele

Jenseits des rechtlichen Rahmens hören wir wöchentlich dieselbe Frage in der Sprechstunde: "Ich habe Wise, Mercury, einen Broker und etwas Krypto, wie reiche ich das fehlerfrei ein?". Dieser Block übersetzt die Norm in eine prozedurale Anleitung für das Einreichungsfenster vom **1. Januar bis 31. März 2026**.

### Zugang und Meldeschwelle

Das Modelo 720 wird ausschließlich elektronisch über die Sede Electrónica der AEAT mit digitalem Zertifikat, DNIe oder Cl@ve PIN eingereicht. Die Pflicht entsteht, wenn am 31. Dezember der **Block ausländischer Bankkonten** **50.000 EUR** übersteigt, mit derselben, unabhängig anzuwendenden Regel für den **Block aus Wertpapieren, Versicherungen und Renten** und für den **Block aus Immobilien**. In Folgejahren reaktiviert eine Erhöhung von mehr als 20.000 EUR in einem bereits gemeldeten Block die Pflicht. Die geltende Doktrin folgt aus der Ley 7/2012 und dem EuGH-Urteil C-788/19 vom 27. Januar 2022, das die unverhältnismäßige Sanktionsregelung kippte, die Meldepflicht aber bestehen ließ.

### Felder, die die meisten Fehler erzeugen

- **Erklärungstyp (1)**: "informativa", "complementaria" oder "sustitutiva" markieren. Verwechslungen erzwingen eine komplette Neueinreichung.
- **Status des Erklärenden (2)**: Inhaber, Bevollmächtigter, Begünstigter oder Vertreter. Bei Wise Personal in EUR ist der Status Inhaber; bei Wise Business oder Mercury der LLC ist Inhaber die Gesellschaft und Sie zeichnen als Vertreter.
- **Saldo zum 31.12. (V) und Durchschnittssaldo des letzten Quartals (M)**: beide in EUR zum offiziellen Kurs der Europäischen Zentralbank vom 31. Dezember 2025.
- **Identifikation der Institution und des Landes**: Steuer-ID der Institution falls vorhanden, BIC-Code und ISO-Ländercode. Wise erscheint je nach Produkt als Wise Payments Limited (UK) oder Wise US Inc.; Mercury läuft in den USA über Choice Financial Group und Column N.A.

### Rechenbeispiel Block für Block

Madrid-ansässiger Freelancer mit: Wise EUR Saldo 18.400 EUR, Mercury Personal Savings 22.300 USD, Interactive Brokers Depot 41.000 EUR, Kraken mit 6.200 EUR in BTC und ETH. Block Konten: 18.400 plus 22.300 USD zum EZB-Kurs sind rund 39.000 EUR, unter der Schwelle, **keine Meldepflicht**. Block Wertpapiere: 41.000 EUR, unter der Schwelle, **keine Meldepflicht**. Block Krypto (Modelo 721): 6.200 EUR, unter 50.000 EUR, **keine Meldepflicht**. Wenn nächstes Jahr 35.000 EUR auf Mercury landen, springt der Kontoblock auf 74.000 EUR und löst eine Modelo-720-Meldung aus.

### Fehler, die 2026 die meisten Sanktionen verursachen

1. Wise-Business- und Mercury-Konten der LLC vergessen, wenn der Eigentümer wirtschaftlich Berechtigter ist.
2. Vergessen, nach einem Anstieg über 20.000 EUR gegenüber der letzten Einreichung erneut zu melden.
3. Den Quartalsdurchschnitt mit dem Jahresdurchschnitt verwechseln.
4. Freiwillig spät einreichen: die Sanktionen sind milde, aber die Zuschläge nach Artikel 27 LGT greifen.

> **Liegt Ihr Stack nahe an 50.000 EUR pro Block?** Lassen Sie Ihre Salden durch den ${calc("de", "Exentax-Steuerrechner")} laufen und prüfen Sie, ob eine sauber deklarierte LLC die heutige Komplexität ausgleicht.

Für die Bankberichts-Schicht vor dem Modelo 720 lesen Sie ${blogLink("de", "cuentas-bancarias-usa-reportan-hacienda-verdad", "was US-Banken wirklich an Ihre Heimat-Steuerbehörde melden")}, und für die Gesamtsteuerstrategie ${blogLink("de", "caminos-legales-minimos-impuestos", "die legalen Wege zur Steuerminimierung")}. Wenn Sie die Einreichung delegieren möchten, ${book("de", "vereinbaren Sie ein Gespräch mit dem Exentax-Team")} und wir schließen sie in einer Woche ab.
`,
  pt: `
## Como apresentar o Modelo 720 passo a passo em 2026: formulário, casas e exemplos práticos

Para além do enquadramento legal, a pergunta repete-se semanalmente em consulta: "tenho Wise, Mercury, uma corretora e cripto, como apresento isto sem erros?". Este bloco traduz a norma num tutorial aplicável à campanha de **1 de janeiro a 31 de março de 2026**.

### Acesso e limiar de obrigação

O Modelo 720 entrega-se exclusivamente online na Sede Electrónica da AEAT com certificado digital, DNIe ou Cl@ve PIN. A obrigação nasce quando, em 31 de dezembro, o **bloco de contas bancárias no estrangeiro** ultrapassa **50.000 EUR**, com a mesma regra aplicada de forma independente ao **bloco de valores, seguros e rendas** e ao **bloco de imóveis**. Nos anos seguintes, um aumento superior a 20.000 EUR num bloco já declarado reabre a obrigação. A doutrina vigente vem da Ley 7/2012 e do acórdão TJUE C-788/19 de 27 de janeiro de 2022, que derrubou o regime sancionatório desproporcionado mas manteve o dever informativo.

### Casas que mais erros geram

- **Tipo de declaração (1)**: marcar "informativa", "complementaria" ou "sustitutiva". Confundi-las obriga a refazer tudo.
- **Código do declarante (2)**: titular, autorizado, beneficiário ou representante. Para Wise Personal em EUR o código é titular; para Wise Business ou Mercury da LLC, o titular é a sociedade e você assina como representante.
- **Saldo a 31/12 (V) e saldo médio do último trimestre (M)**: ambos em EUR ao câmbio oficial do Banco Central Europeu de 31 de dezembro de 2025.
- **Identificação da instituição e do país**: NIF da instituição se existir, código BIC e código ISO do país. Wise aparece como Wise Payments Limited (UK) ou Wise US Inc. consoante o produto; Mercury opera via Choice Financial Group e Column N.A. nos EUA.

### Exemplo numérico, bloco a bloco

Freelancer residente em Madrid com: Wise EUR saldo 18.400 EUR, Mercury Personal Savings 22.300 USD, Interactive Brokers carteira 41.000 EUR, Kraken com 6.200 EUR em BTC e ETH. Bloco contas: 18.400 mais 22.300 USD ao câmbio BCE dão aproximadamente 39.000 EUR, abaixo do limiar, **sem obrigação**. Bloco valores: 41.000 EUR, abaixo do limiar, **sem obrigação**. Bloco cripto (Modelo 721): 6.200 EUR, abaixo de 50.000 EUR, **sem obrigação**. Se no ano seguinte aterrarem 35.000 EUR na Mercury, o bloco contas sobe a 74.000 EUR e dispara um Modelo 720.

### Erros que mais sanções produzem em 2026

1. Esquecer as contas Wise Business e Mercury da LLC quando o sócio é beneficiário efetivo.
2. Não voltar a declarar após um aumento superior a 20.000 EUR face ao último 720.
3. Confundir o saldo médio do último trimestre com a média anual.
4. Apresentar tarde voluntariamente: as sanções são leves, mas aplicam-se as majorações do artigo 27 LGT.

> **O seu stack roça os 50.000 EUR por bloco?** Passe os saldos pela ${calc("pt", "calculadora fiscal da Exentax")} e veja se mudar para uma LLC bem declarada compensa a complexidade atual.

Para a camada bancária a montante do 720 leia ${blogLink("pt", "cuentas-bancarias-usa-reportan-hacienda-verdad", "o que os bancos americanos reportam de facto ao seu fisco")}, e para a estratégia global ${blogLink("pt", "caminos-legales-minimos-impuestos", "os caminhos legais para pagar o mínimo de impostos")}. Para delegar a apresentação, ${book("pt", "agende uma sessão com a equipa Exentax")} e fechamos numa semana.
`,
  ca: `
## Com declarar el Model 720 pas a pas el 2026: formulari, caselles i exemples pràctics

Més enllà del marc legal, la pregunta es repeteix cada setmana en consulta: "tinc Wise, Mercury, un bróker i cripto, com ho presento sense errors?". Aquest bloc tradueix la norma en un tutorial aplicable a la campanya **de l'1 de gener al 31 de març de 2026**.

### Accés i llindar d'obligació

El Model 720 es presenta exclusivament en línia a la Seu Electrònica de l'AEAT amb certificat digital, DNIe o Cl@ve PIN. L'obligació neix quan, a 31 de desembre, el **bloc de comptes bancaris a l'estranger** supera els **50.000 EUR**, amb la mateixa regla aplicada de manera independent al **bloc de valors, assegurances i rendes** i al **bloc d'immobles**. Els anys posteriors, un increment superior a 20.000 EUR en un bloc ja declarat reobre l'obligació. La doctrina vigent prové de la Llei 7/2012 i de la sentència TJUE C-788/19 de 27 de gener de 2022, que va anul·lar el règim sancionador desproporcionat però va mantenir l'obligació informativa.

### Caselles que generen més errors

- **Tipus de declaració (1)**: marcar "informativa", "complementaria" o "sustitutiva". Confondre-les obliga a refer tot.
- **Codi de declarant (2)**: titular, autoritzat, beneficiari o representant. Per a Wise Personal en EUR el codi és titular; per a Wise Business o Mercury de la teva LLC, el titular és la societat i tu signes com a representant.
- **Saldo a 31/12 (V) i saldo mitjà últim trimestre (M)**: tots dos en EUR al canvi oficial del Banc Central Europeu de 31 de desembre de 2025.
- **Identificació de l'entitat i del país**: NIF de l'entitat si existeix, codi BIC i codi ISO del país. Wise apareix com a Wise Payments Limited (UK) o Wise US Inc. segons el producte; Mercury opera via Choice Financial Group i Column N.A. als EUA.

### Exemple numèric, bloc a bloc

Freelance resident a Madrid amb: Wise EUR saldo 18.400 EUR, Mercury Personal Savings 22.300 USD, cartera Interactive Brokers 41.000 EUR, Kraken amb 6.200 EUR en BTC i ETH. Bloc comptes: 18.400 més 22.300 USD al canvi BCE són aproximadament 39.000 EUR, per sota del llindar, **sense obligació**. Bloc valors: 41.000 EUR, per sota del llindar, **sense obligació**. Bloc cripto (Model 721): 6.200 EUR, per sota de 50.000 EUR, **sense obligació**. Si l'any següent aterren 35.000 EUR a Mercury, el bloc comptes puja a 74.000 EUR i dispara un Model 720.

### Errors que més sancions generen el 2026

1. Oblidar els comptes Wise Business i Mercury de la LLC quan el soci és beneficiari efectiu.
2. No tornar a declarar després d'un augment superior a 20.000 EUR respecte al darrer 720.
3. Confondre el saldo mitjà del darrer trimestre amb la mitjana anual.
4. Presentar tard voluntàriament: les sancions són lleus, però s'apliquen les majoracions de l'article 27 LGT.

> **El teu stack frega els 50.000 EUR per bloc?** Passa els saldos per la ${calc("ca", "calculadora fiscal d'Exentax")} i mira si passar a una LLC ben declarada compensa la complexitat actual.

Per a la capa bancària prèvia al 720 llegeix ${blogLink("ca", "cuentas-bancarias-usa-reportan-hacienda-verdad", "què reporten realment els bancs americans al teu fisc")}, i per a l'estratègia global ${blogLink("ca", "caminos-legales-minimos-impuestos", "els camins legals per minimitzar impostos")}. Per delegar la presentació, ${book("ca", "reserva una sessió amb l'equip Exentax")} i la tanquem en una setmana.
`,
};

// 2) cuentas-bancarias-usa-reportan-hacienda-verdad → Flujo regulatorio FATCA IGA
BLOCKS["cuentas-bancarias-usa-reportan-hacienda-verdad"] = {
  es: `
## Flujo regulatorio en 2026: del banco USA al IRS y de ahí a Hacienda Española vía FATCA IGA Modelo 1

Esta sección rompe el mito de "los bancos americanos no reportan nada" y describe el flujo real de datos entre EE. UU. y España bajo el Acuerdo Intergubernamental FATCA Modelo 1 firmado el 14 de mayo de 2013, en vigor desde el 9 de diciembre de 2013 y actualizado en convenios de cooperación administrativa de 2024 y 2025.

### Diagrama textual del flujo

1. **Banco o EMI estadounidense (Mercury, Choice, Column N.A., Wise US Inc., Relay Bank, Slash) → IRS**: cada institución financiera categorizada como FFI (Foreign Financial Institution recíproco) reporta anualmente al IRS los saldos y rentas de cuentas cuyo titular es persona o entidad española sujeta a FATCA. Si la cuenta pertenece a tu LLC, el reporte se hace bajo el GIIN de la entidad y el TIN del beneficiario efectivo declarado en el W-9 o W-8BEN/W-8BEN-E.
2. **IRS → AEAT**: el IRS empaqueta los datos del año natural y los transmite a la AEAT entre **septiembre y octubre del año siguiente**, en formato XML según el esquema FATCA XML 2.0 vigente desde julio de 2024.
3. **AEAT → cruce interno**: la AEAT cruza esos registros con tus declaraciones (Modelo 100 IRPF, Modelo 720 informativa de bienes en el extranjero, Modelo 721 de cripto). Las divergencias entran en el "Plan Anual de Control Tributario" del año en curso.

### Qué se transmite y qué NO se transmite

**Sí se transmite** (campos del esquema FATCA XML): nombre del titular o de la LLC, dirección, TIN español o NIF, número de cuenta, saldo a 31 de diciembre, intereses brutos pagados durante el ejercicio, dividendos y otras rentas brutas, productos brutos por venta de activos financieros, y código GIIN de la entidad.

**No se transmite automáticamente**: movimientos diarios, beneficiarios indirectos por debajo del 25 % de control, contraparte de cada operación, ni clasificación interna de la actividad económica subyacente. Tampoco se transmite información de cuentas con saldo inferior a **50.000 USD** mantenidas por personas físicas estadounidenses sin indicios de ser persona estadounidense según la due diligence FATCA, aunque para residentes en España la práctica de Mercury y Wise US Inc. desde 2024 es reportar todas las cuentas vinculadas a un TIN español por encima de cero.

### Plazos críticos a recordar en 2026

- 31 de marzo de 2026: las FFIs deben enviar al IRS el reporte FATCA del ejercicio 2025.
- 30 de septiembre de 2026: ventana habitual del intercambio IRS-AEAT del ejercicio 2025.
- Octubre-diciembre 2026: aparición de los datos en el "Renta Web" de la AEAT y posibles requerimientos.

### Cómo prepararte sin sorpresas

Mantén tu W-8BEN-E coherente con la estructura real, factura y cobra siempre desde la cuenta de la LLC, conserva los extractos mensuales en PDF y, si llega un requerimiento de información del 720, dispondrás de cinco días hábiles para responder. Pasa tu caso por la ${calc("es", "calculadora fiscal Exentax")} para ver el coste neto de declarar limpio frente a permanecer en una zona gris.

Si quieres ver cómo se cruzan estos datos con la presentación del 720 sigue con ${blogLink("es", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "la guía paso a paso del Modelo 720 y 721")}, y si quieres revisar tu setup completo ${book("es", "reserva una llamada con el equipo Exentax")} y lo auditamos contigo.
`,
  en: `
## 2026 regulatory flow: from a US bank to the IRS and on to Spain's AEAT via FATCA IGA Model 1

This section busts the "US banks report nothing" myth and lays out the real data flow between the United States and Spain under the FATCA Intergovernmental Agreement Model 1 signed on 14 May 2013, in force since 9 December 2013 and refined by the 2024 and 2025 administrative cooperation memoranda.

### Textual diagram of the flow

1. **US bank or EMI (Mercury, Choice, Column N.A., Wise US Inc., Relay Bank, Slash) → IRS**: every financial institution classified as a reciprocal Foreign Financial Institution reports annually to the IRS the year-end balances and income of accounts whose holder is a Spanish person or entity subject to FATCA. If the account belongs to your LLC, the report uses the entity's GIIN and the beneficial owner's TIN declared on the W-9 or W-8BEN/W-8BEN-E.
2. **IRS → AEAT**: the IRS packages the calendar year data and ships it to AEAT between **September and October of the following year** in the FATCA XML 2.0 schema in force since July 2024.
3. **AEAT → internal matching**: AEAT cross-checks those records against your filings (Modelo 100 income tax, Modelo 720 foreign assets, Modelo 721 crypto). Divergences enter that year's "Plan Anual de Control Tributario".

### What is and is not transmitted

**Transmitted** (FATCA XML fields): account holder or LLC name, address, Spanish TIN or NIF, account number, 31 December balance, gross interest paid during the year, dividends and other gross income, gross proceeds from financial asset sales, and the institution GIIN.

**Not transmitted automatically**: daily transactions, indirect beneficiaries below 25 % control, the counterparty of each operation, or the internal classification of the underlying economic activity. Also excluded are accounts below **USD 50,000** held by US natural persons without US indicia under FATCA due diligence, although since 2024 the standard practice at Mercury and Wise US Inc. is to report all accounts tied to a Spanish TIN above zero.

### Critical 2026 deadlines

- 31 March 2026: FFIs must transmit the 2025 FATCA report to the IRS.
- 30 September 2026: usual IRS-AEAT exchange window for 2025.
- October to December 2026: data shows up in AEAT's Renta Web and triggers any information requests.

### How to prepare without surprises

Keep your W-8BEN-E aligned with the real structure, invoice and collect always from the LLC account, store monthly PDF statements, and if a 720 information notice arrives you will have five business days to respond. Run your case through the ${calc("en", "Exentax tax calculator")} to see the net cost of filing clean versus staying in a grey zone.

To see how this data crosses with Modelo 720 filing, continue with ${blogLink("en", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "the step-by-step guide to Modelo 720 and 721")}, and if you want a full setup audit, ${book("en", "book a call with the Exentax team")} and we review it with you.
`,
  fr: `
## Flux réglementaire 2026: de la banque US à l'IRS puis à l'AEAT via FATCA IGA Modèle 1

Cette section démonte le mythe "les banques américaines ne déclarent rien" et expose le flux réel de données entre les États-Unis et l'Espagne dans le cadre de l'Accord intergouvernemental FATCA Modèle 1 signé le 14 mai 2013, en vigueur depuis le 9 décembre 2013 et précisé par les mémorandums de coopération administrative de 2024 et 2025.

### Schéma textuel du flux

1. **Banque ou EMI américain (Mercury, Choice, Column N.A., Wise US Inc., Relay Bank, Slash) → IRS**: chaque institution financière qualifiée de FFI réciproque déclare chaque année à l'IRS les soldes et revenus des comptes dont le titulaire est une personne ou entité espagnole soumise à FATCA. Si le compte appartient à votre LLC, la déclaration utilise le GIIN de l'entité et le TIN du bénéficiaire effectif indiqué sur le W-9 ou W-8BEN/W-8BEN-E.
2. **IRS → AEAT**: l'IRS empaquette les données de l'année civile et les transmet à l'AEAT entre **septembre et octobre de l'année suivante** au format FATCA XML 2.0 en vigueur depuis juillet 2024.
3. **AEAT → recoupement interne**: l'AEAT croise ces relevés avec vos déclarations (Modelo 100, Modelo 720, Modelo 721). Les écarts entrent dans le "Plan Anual de Control Tributario" de l'année.

### Ce qui est transmis et ce qui ne l'est pas

**Transmis** (champs FATCA XML): nom du titulaire ou de la LLC, adresse, TIN espagnol ou NIF, numéro de compte, solde au 31 décembre, intérêts bruts versés sur l'année, dividendes et autres revenus bruts, produits bruts de cession d'actifs financiers, et GIIN de l'institution.

**Non transmis automatiquement**: mouvements quotidiens, bénéficiaires indirects sous 25 % de contrôle, contrepartie de chaque opération, classification interne de l'activité économique sous-jacente. Sont aussi exclus les comptes inférieurs à **50 000 USD** détenus par des personnes physiques américaines sans indice US au titre de la due diligence FATCA, même si depuis 2024 Mercury et Wise US Inc. déclarent par défaut tout compte rattaché à un TIN espagnol supérieur à zéro.

### Échéances 2026 à retenir

- 31 mars 2026: les FFIs doivent transmettre à l'IRS la déclaration FATCA 2025.
- 30 septembre 2026: fenêtre habituelle de l'échange IRS-AEAT pour 2025.
- Octobre à décembre 2026: les données apparaissent dans Renta Web de l'AEAT et déclenchent d'éventuelles demandes.

### Comment se préparer sans surprise

Gardez votre W-8BEN-E aligné avec la structure réelle, facturez et encaissez toujours depuis le compte de la LLC, conservez les relevés mensuels PDF, et si un courrier 720 arrive vous disposerez de cinq jours ouvrés pour répondre. Passez votre cas dans le ${calc("fr", "calculateur fiscal Exentax")} pour mesurer le coût net d'une déclaration propre face à une zone grise.

Pour voir comment ces données se croisent avec le dépôt du 720 enchaînez avec ${blogLink("fr", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "le guide pas à pas du Modelo 720 et 721")}, et pour un audit complet de votre setup ${book("fr", "réservez un échange avec l'équipe Exentax")} et on l'examine avec vous.
`,
  de: `
## Regulatorischer Fluss 2026: von der US-Bank zum IRS und weiter zur AEAT über FATCA IGA Modell 1

Dieser Abschnitt zerlegt den Mythos "US-Banken melden nichts" und zeichnet den realen Datenfluss zwischen den Vereinigten Staaten und Spanien unter dem FATCA-Regierungsabkommen Modell 1 nach, das am 14. Mai 2013 unterzeichnet, am 9. Dezember 2013 in Kraft trat und durch die Verwaltungsabkommen 2024 und 2025 verfeinert wurde.

### Textuelles Flussdiagramm

1. **US-Bank oder EMI (Mercury, Choice, Column N.A., Wise US Inc., Relay Bank, Slash) → IRS**: jede als reziproke FFI klassifizierte Finanzinstitution meldet dem IRS jährlich Endsalden und Einkünfte aus Konten, deren Inhaber eine in Spanien ansässige Person oder Einheit gemäß FATCA ist. Gehört das Konto Ihrer LLC, läuft die Meldung über die GIIN der Gesellschaft und die TIN des wirtschaftlich Berechtigten laut W-9 oder W-8BEN/W-8BEN-E.
2. **IRS → AEAT**: der IRS bündelt die Kalenderjahresdaten und übermittelt sie zwischen **September und Oktober des Folgejahres** im seit Juli 2024 gültigen FATCA-XML-2.0-Schema an die AEAT.
3. **AEAT → interner Abgleich**: die AEAT gleicht diese Datensätze mit Ihren Erklärungen ab (Modelo 100, Modelo 720, Modelo 721). Abweichungen landen im "Plan Anual de Control Tributario" des Jahres.

### Was übertragen wird und was nicht

**Übertragen** (FATCA-XML-Felder): Name des Inhabers oder der LLC, Adresse, spanische TIN oder NIF, Kontonummer, Saldo zum 31. Dezember, im Jahr gezahlte Bruttozinsen, Dividenden und sonstige Bruttoeinkünfte, Bruttoerlöse aus Verkäufen von Finanzanlagen sowie die GIIN der Institution.

**Nicht automatisch übertragen**: Tagesumsätze, indirekte Begünstigte unter 25 % Kontrolle, die Gegenpartei jeder Operation und die interne Klassifikation der wirtschaftlichen Tätigkeit. Ausgenommen sind ferner Konten unter **50.000 USD** natürlicher US-Personen ohne US-Indizien gemäß FATCA-Due-Diligence, auch wenn Mercury und Wise US Inc. seit 2024 in der Praxis sämtliche Konten mit spanischer TIN über null melden.

### Kritische Termine 2026

- 31. März 2026: FFIs müssen die FATCA-Meldung 2025 an den IRS übermitteln.
- 30. September 2026: übliches Austauschfenster IRS-AEAT für 2025.
- Oktober bis Dezember 2026: die Daten erscheinen in Renta Web der AEAT und lösen mögliche Auskunftsersuchen aus.

### Wie Sie sich ohne Überraschungen vorbereiten

Halten Sie Ihre W-8BEN-E in Einklang mit der realen Struktur, fakturieren und kassieren Sie immer über das LLC-Konto, archivieren Sie Monatsauszüge als PDF, und falls ein 720-Auskunftsersuchen eintrifft, haben Sie fünf Werktage Antwortfrist. Lassen Sie Ihren Fall durch den ${calc("de", "Exentax-Steuerrechner")} laufen, um die Netto-Kosten einer sauberen Deklaration gegenüber einer Grauzone zu sehen.

Um zu sehen, wie diese Daten mit der 720-Einreichung verschnitten werden, lesen Sie weiter mit ${blogLink("de", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "der Schritt-für-Schritt-Anleitung zum Modelo 720 und 721")}, und für ein vollständiges Setup-Audit ${book("de", "vereinbaren Sie ein Gespräch mit dem Exentax-Team")}.
`,
  pt: `
## Fluxo regulatório em 2026: do banco americano ao IRS e daí à AEAT via FATCA IGA Modelo 1

Esta secção desmonta o mito "os bancos americanos não reportam nada" e descreve o fluxo real de dados entre os EUA e Espanha ao abrigo do Acordo Intergovernamental FATCA Modelo 1 assinado em 14 de maio de 2013, em vigor desde 9 de dezembro de 2013 e refinado pelos memorandos de cooperação administrativa de 2024 e 2025.

### Diagrama textual do fluxo

1. **Banco ou EMI dos EUA (Mercury, Choice, Column N.A., Wise US Inc., Relay Bank, Slash) → IRS**: cada instituição financeira classificada como FFI recíproca reporta anualmente ao IRS os saldos e rendimentos de fim de ano de contas cujo titular seja pessoa ou entidade espanhola sujeita a FATCA. Se a conta pertence à sua LLC, o reporte usa o GIIN da entidade e o TIN do beneficiário efetivo declarado no W-9 ou W-8BEN/W-8BEN-E.
2. **IRS → AEAT**: o IRS agrupa os dados do ano civil e envia-os à AEAT entre **setembro e outubro do ano seguinte** no formato FATCA XML 2.0 vigente desde julho de 2024.
3. **AEAT → cruzamento interno**: a AEAT confronta esses registos com as suas declarações (Modelo 100, Modelo 720, Modelo 721). As divergências entram no "Plan Anual de Control Tributario" do ano.

### O que se transmite e o que NÃO se transmite

**Transmite-se** (campos FATCA XML): nome do titular ou da LLC, morada, TIN espanhol ou NIF, número de conta, saldo a 31 de dezembro, juros brutos pagos no ano, dividendos e outros rendimentos brutos, produtos brutos de venda de ativos financeiros e GIIN da instituição.

**Não se transmite automaticamente**: movimentos diários, beneficiários indiretos abaixo de 25 % de controlo, contraparte de cada operação ou classificação interna da atividade económica subjacente. Estão também excluídas contas abaixo de **50.000 USD** detidas por pessoas singulares norte-americanas sem indícios US segundo a due diligence FATCA, embora desde 2024 a prática de Mercury e Wise US Inc. seja reportar todas as contas associadas a um TIN espanhol acima de zero.

### Datas críticas em 2026

- 31 de março de 2026: as FFIs têm de enviar ao IRS o reporte FATCA de 2025.
- 30 de setembro de 2026: janela habitual de troca IRS-AEAT para 2025.
- Outubro a dezembro de 2026: os dados aparecem no Renta Web da AEAT e disparam eventuais pedidos de informação.

### Como se preparar sem surpresas

Mantenha o seu W-8BEN-E alinhado com a estrutura real, fature e receba sempre pela conta da LLC, guarde extratos mensais em PDF e, se chegar um pedido de informação do 720, terá cinco dias úteis para responder. Passe o seu caso pela ${calc("pt", "calculadora fiscal da Exentax")} para ver o custo líquido de declarar limpo face a permanecer numa zona cinzenta.

Para ver como estes dados se cruzam com a apresentação do 720 continue com ${blogLink("pt", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "o guia passo a passo do Modelo 720 e 721")}, e para uma auditoria completa do setup ${book("pt", "agende uma chamada com a equipa Exentax")}.
`,
  ca: `
## Flux regulatori 2026: del banc americà a l'IRS i d'allí a l'AEAT via FATCA IGA Model 1

Aquesta secció desmunta el mite "els bancs americans no reporten res" i descriu el flux real de dades entre els EUA i Espanya sota l'Acord Intergovernamental FATCA Model 1 signat el 14 de maig de 2013, en vigor des del 9 de desembre de 2013 i afinat pels memoràndums de cooperació administrativa de 2024 i 2025.

### Diagrama textual del flux

1. **Banc o EMI dels EUA (Mercury, Choice, Column N.A., Wise US Inc., Relay Bank, Slash) → IRS**: cada institució financera classificada com a FFI recíproca reporta anualment a l'IRS els saldos i rendes de final d'any dels comptes el titular dels quals és persona o entitat espanyola subjecta a FATCA. Si el compte pertany a la teva LLC, el reporte fa servir el GIIN de l'entitat i el TIN del beneficiari efectiu declarat al W-9 o W-8BEN/W-8BEN-E.
2. **IRS → AEAT**: l'IRS empaqueta les dades de l'any natural i les transmet a l'AEAT entre **setembre i octubre de l'any següent** en el format FATCA XML 2.0 vigent des del juliol de 2024.
3. **AEAT → encreuament intern**: l'AEAT contrasta aquests registres amb les teves declaracions (Model 100, Model 720, Model 721). Les divergències entren al "Plan Anual de Control Tributario" de l'any.

### Què es transmet i què NO es transmet

**Es transmet** (camps FATCA XML): nom del titular o de la LLC, adreça, TIN espanyol o NIF, número de compte, saldo a 31 de desembre, interessos bruts pagats l'any, dividends i altres rendes brutes, productes bruts de venda d'actius financers i GIIN de la institució.

**No es transmet automàticament**: moviments diaris, beneficiaris indirectes per sota del 25 % de control, contrapart de cada operació o classificació interna de l'activitat econòmica subjacent. També queden fora els comptes inferiors a **50.000 USD** de persones físiques nord-americanes sense indicis US segons la due diligence FATCA, encara que des del 2024 Mercury i Wise US Inc. reporten per defecte qualsevol compte vinculat a un TIN espanyol amb saldo superior a zero.

### Dates crítiques el 2026

- 31 de març de 2026: les FFIs han d'enviar a l'IRS el reporte FATCA de 2025.
- 30 de setembre de 2026: finestra habitual d'intercanvi IRS-AEAT per al 2025.
- Octubre a desembre de 2026: les dades apareixen al Renta Web de l'AEAT i disparen eventuals requeriments.

### Com preparar-se sense sorpreses

Mantén el W-8BEN-E coherent amb l'estructura real, factura i cobra sempre des del compte de la LLC, conserva els extractes mensuals en PDF i, si arriba un requeriment del 720, tindràs cinc dies hàbils per respondre. Passa el teu cas per la ${calc("ca", "calculadora fiscal d'Exentax")} per veure el cost net de declarar net davant de quedar-te en una zona grisa.

Per veure com aquestes dades es creuen amb la presentació del 720 segueix amb ${blogLink("ca", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "la guia pas a pas del Model 720 i 721")}, i per a una auditoria completa del setup ${book("ca", "reserva una trucada amb l'equip Exentax")}.
`,
};

// 3) cuenta-bancaria-mercury → "Abrir cuenta bancaria USA sin ser residente: Mercury vs Relay vs Wise vs banca tradicional"
BLOCKS["cuenta-bancaria-mercury-llc-extranjero"] = {
  es: `
## Abrir cuenta bancaria en USA sin ser residente en 2026: comparativa Mercury vs Relay vs Wise vs banca tradicional

Mercury es la opción de cabecera, pero no es la única, y conviene saber dónde encaja cada alternativa antes de presentar tu solicitud. Este bloque sintetiza el estado real del mercado para LLC de no residentes a 2026 y resume el paso a paso de KYC en cada plataforma.

### Tabla comparativa rápida

| Criterio | Mercury | Relay Financial | Wise Business | Banca tradicional (Bank of America, Chase, Wells Fargo) |
|---|---|---|---|---|
| Tipo de entidad | Fintech sobre Choice y Column N.A. (FDIC pass-through) | Fintech sobre Thread Bank (FDIC pass-through) | EMI (Wise US Inc., FinCEN MSB) | Banco comercial (FDIC directo) |
| Apertura 100 % remota para no residentes | Sí | Sí | Sí | No, exige presencia física y SSN o ITIN del firmante |
| Tiempo medio aprobación 2026 | 2 a 7 días | 3 a 10 días | 1 a 3 días | 4 a 8 semanas si llegas a abrirla |
| Wires domésticos | Gratis | Gratis hasta 20 al mes | De pago | De pago |
| Wires internacionales SWIFT | Salida con coste, entrada gratis | Salida con coste competitivo | Coste muy bajo y conversión a media de mercado | Coste alto y peor tipo de cambio |
| Tarjeta debito virtual y física | Sí | Sí | Sí | Sí, pero envío internacional restringido |
| API y automatización | Buena, integrada con Mercury Raise | Limitada, foco en sub-cuentas | Excelente para conciliación contable | Pobre |

### Requisitos KYC mínimos en 2026

Las cuatro plataformas exigen, como base: Articles of Organization de la LLC, EIN Confirmation Letter (Form CP-575 o sustitutiva), pasaporte vigente del beneficiario efectivo, dirección personal verificable fuera de EE. UU., y Operating Agreement firmado. Mercury y Relay añaden una breve descripción operativa del negocio y el origen de los fondos. Wise pide además **prueba de actividad** (web, contratos o facturas recientes) si los volúmenes esperados superan ciertos umbrales internos. La banca tradicional añade entrevista presencial, verificación de domicilio en EE. UU. y, en muchos estados, ITIN o SSN.

### Paso a paso recomendado para una LLC de no residente

1. Constituir la LLC y obtener el EIN antes de tocar cualquier solicitud bancaria.
2. Abrir Mercury como cuenta principal de operación en USD.
3. Abrir Wise Business para multi-divisa (EUR, GBP, AUD) y para recibir pagos europeos por SEPA.
4. Considerar Relay solo si necesitas múltiples sub-cuentas para presupuestos o si Mercury aplica fricciones por país de residencia.
5. Reservar la banca tradicional únicamente si vas a operar dinero en efectivo en EE. UU. o necesitas un préstamo SBA.

### Errores que disparan el rechazo

- Domicilio personal con servicio de mail forwarding genérico, sin contrato verificable.
- Descripción de actividad demasiado vaga (por ejemplo "consulting" sin sector ni clientes).
- Origen de fondos no explicado cuando llegan transferencias > 25 000 USD desde una EMI europea.
- Operating Agreement genérico sin sección de gestión y voto.

> **¿Quieres ver cuánto te ahorras en comisiones y conversión combinando Mercury y Wise?** Carga tu volumen anual en la ${calc("es", "calculadora fiscal y operativa Exentax")} y compáralo con tu setup actual.

Para profundizar en estructura completa de banca lee ${blogLink("es", "cuentas-bancarias-usa-reportan-hacienda-verdad", "qué reportan realmente los bancos USA")}, y si quieres delegar la apertura ${book("es", "agenda una sesión con Exentax")} y la coordinamos paso a paso desde la constitución.
`,
  en: `
## Opening a US bank account as a non resident in 2026: Mercury vs Relay vs Wise vs traditional banks

Mercury is the default, but not the only option, and it pays to know where each alternative fits before you submit an application. This block summarises the real state of the market for non resident LLCs in 2026 and walks through KYC on every platform.

### Quick comparison table

| Criterion | Mercury | Relay Financial | Wise Business | Traditional bank (Bank of America, Chase, Wells Fargo) |
|---|---|---|---|---|
| Entity type | Fintech on Choice and Column N.A. (FDIC pass-through) | Fintech on Thread Bank (FDIC pass-through) | EMI (Wise US Inc., FinCEN MSB) | Commercial bank (FDIC direct) |
| 100 % remote opening for non residents | Yes | Yes | Yes | No, demands in person presence and signer SSN or ITIN |
| Average 2026 approval time | 2 to 7 days | 3 to 10 days | 1 to 3 days | 4 to 8 weeks if you reach an opening at all |
| Domestic wires | Free | Free up to 20 a month | Paid | Paid |
| International SWIFT wires | Outbound paid, inbound free | Outbound competitive | Very low cost, mid market FX | High cost and worse FX |
| Virtual and physical debit card | Yes | Yes | Yes | Yes, but international shipping restricted |
| API and automation | Strong, integrated with Mercury Raise | Limited, focused on sub-accounts | Excellent for bookkeeping | Poor |

### Minimum 2026 KYC requirements

All four platforms ask for: LLC Articles of Organization, EIN Confirmation Letter (Form CP-575 or replacement), valid passport of the beneficial owner, verifiable personal address outside the United States, and signed Operating Agreement. Mercury and Relay add a short operating description of the business and source of funds. Wise additionally requests **proof of activity** (website, contracts, recent invoices) if expected volume crosses internal thresholds. Traditional banks add an in person interview, US address verification and, in many states, an ITIN or SSN.

### Recommended step by step for a non resident LLC

1. Form the LLC and get the EIN before touching any banking application.
2. Open Mercury as the main USD operating account.
3. Open Wise Business for multi currency operations (EUR, GBP, AUD) and to receive European SEPA payments.
4. Consider Relay only if you need multiple sub-accounts for budgeting, or if Mercury introduces friction based on your country of residence.
5. Reserve traditional banks only if you will operate physical cash in the US or need an SBA loan.

### Mistakes that trigger rejection

- Personal address served by a generic mail forwarding provider with no verifiable contract.
- Activity description too vague (for example "consulting" with no sector or clients).
- Source of funds unexplained when wires above USD 25,000 arrive from a European EMI.
- Generic Operating Agreement with no management or voting section.

> **Want to see how much you save in fees and FX by combining Mercury and Wise?** Drop your annual volume into the ${calc("en", "Exentax tax and operating calculator")} and compare it with your current setup.

For a deeper view of full banking structure read ${blogLink("en", "cuentas-bancarias-usa-reportan-hacienda-verdad", "what US banks really report")}, and if you want to delegate the opening ${book("en", "book a session with Exentax")} and we coordinate it step by step from formation.
`,
  fr: `
## Ouvrir un compte bancaire aux USA sans être résident en 2026: comparatif Mercury vs Relay vs Wise vs banque traditionnelle

Mercury est le choix par défaut, mais pas le seul, et il vaut la peine de savoir où chaque alternative s'insère avant d'envoyer une demande. Ce bloc résume l'état réel du marché pour les LLC de non-résidents en 2026 et détaille le KYC sur chaque plateforme.

### Tableau comparatif

| Critère | Mercury | Relay Financial | Wise Business | Banque traditionnelle (Bank of America, Chase, Wells Fargo) |
|---|---|---|---|---|
| Type d'entité | Fintech sur Choice et Column N.A. (FDIC pass-through) | Fintech sur Thread Bank (FDIC pass-through) | EMI (Wise US Inc., FinCEN MSB) | Banque commerciale (FDIC direct) |
| Ouverture 100 % à distance pour non-résidents | Oui | Oui | Oui | Non, exige présence physique et SSN ou ITIN du signataire |
| Délai moyen d'approbation 2026 | 2 à 7 jours | 3 à 10 jours | 1 à 3 jours | 4 à 8 semaines si l'ouverture aboutit |
| Virements domestiques | Gratuits | Gratuits jusqu'à 20 par mois | Payants | Payants |
| Virements internationaux SWIFT | Sortants payants, entrants gratuits | Sortants compétitifs | Très peu cher et taux mid-market | Coût élevé et taux moins bon |
| Carte de débit virtuelle et physique | Oui | Oui | Oui | Oui, envoi international restreint |
| API et automatisation | Bonne, intégrée avec Mercury Raise | Limitée, sous-comptes | Excellente pour la comptabilité | Pauvre |

### Exigences KYC minimales en 2026

Les quatre plateformes demandent: Articles of Organization de la LLC, EIN Confirmation Letter (Form CP-575 ou substitut), passeport en cours du bénéficiaire effectif, adresse personnelle vérifiable hors USA, Operating Agreement signé. Mercury et Relay ajoutent une description opérationnelle de l'activité et l'origine des fonds. Wise demande de plus une **preuve d'activité** (site, contrats ou factures récentes) si le volume attendu dépasse les seuils internes. Les banques traditionnelles ajoutent entretien physique, vérification d'adresse aux USA et, dans nombre d'États, ITIN ou SSN.

### Étapes recommandées pour une LLC de non-résident

1. Constituer la LLC et obtenir l'EIN avant toute démarche bancaire.
2. Ouvrir Mercury comme compte opérationnel principal en USD.
3. Ouvrir Wise Business pour le multi-devise (EUR, GBP, AUD) et les paiements SEPA européens.
4. Envisager Relay uniquement si vous avez besoin de plusieurs sous-comptes ou si Mercury introduit des frictions liées à votre pays de résidence.
5. Réserver la banque traditionnelle aux opérations en cash physique ou aux prêts SBA.

### Erreurs qui provoquent le refus

- Adresse personnelle servie par un mail forwarding générique sans contrat vérifiable.
- Description d'activité trop vague (par exemple "consulting" sans secteur ni clients).
- Origine des fonds non expliquée quand des virements supérieurs à 25 000 USD arrivent d'une EMI européenne.
- Operating Agreement générique sans section gestion et vote.

> **Combien économisez-vous en frais et en change en combinant Mercury et Wise?** Mettez votre volume annuel dans le ${calc("fr", "calculateur fiscal et opérationnel Exentax")} et comparez avec votre setup actuel.

Pour aller plus loin sur la structure bancaire complète lisez ${blogLink("fr", "cuentas-bancarias-usa-reportan-hacienda-verdad", "ce que les banques US déclarent vraiment")}, et pour déléguer l'ouverture ${book("fr", "réservez un échange avec Exentax")}.
`,
  de: `
## US-Bankkonto als Nicht-Resident eröffnen 2026: Vergleich Mercury vs Relay vs Wise vs klassische Bank

Mercury ist die Standardwahl, aber nicht die einzige, und es lohnt sich zu wissen, wo jede Alternative passt, bevor Sie einen Antrag stellen. Dieser Block fasst den realen Marktstand für LLCs von Nicht-Residenten 2026 zusammen und beschreibt den KYC-Ablauf jeder Plattform.

### Vergleichstabelle

| Kriterium | Mercury | Relay Financial | Wise Business | Klassische Bank (Bank of America, Chase, Wells Fargo) |
|---|---|---|---|---|
| Entitätstyp | Fintech auf Choice und Column N.A. (FDIC Pass-through) | Fintech auf Thread Bank (FDIC Pass-through) | EMI (Wise US Inc., FinCEN MSB) | Geschäftsbank (FDIC direkt) |
| 100 % Remote-Eröffnung für Nicht-Residenten | Ja | Ja | Ja | Nein, persönliche Präsenz und SSN oder ITIN nötig |
| Durchschnittliche Genehmigungsdauer 2026 | 2 bis 7 Tage | 3 bis 10 Tage | 1 bis 3 Tage | 4 bis 8 Wochen, falls die Eröffnung überhaupt gelingt |
| Inlandsüberweisungen | Kostenlos | Kostenlos bis 20 im Monat | Kostenpflichtig | Kostenpflichtig |
| Internationale SWIFT-Überweisungen | Ausgehend kostenpflichtig, eingehend kostenlos | Ausgehend wettbewerbsfähig | Sehr günstig, Mid-Market-Kurs | Teuer und schlechterer Kurs |
| Virtuelle und physische Debitkarte | Ja | Ja | Ja | Ja, internationaler Versand eingeschränkt |
| API und Automatisierung | Stark, integriert mit Mercury Raise | Begrenzt, Sub-Konten | Ausgezeichnet für Buchhaltung | Schwach |

### Mindest-KYC-Anforderungen 2026

Alle vier Plattformen verlangen: Articles of Organization der LLC, EIN Confirmation Letter (Form CP-575 oder Ersatz), gültiger Reisepass des wirtschaftlich Berechtigten, verifizierbare persönliche Adresse außerhalb der USA, unterzeichnetes Operating Agreement. Mercury und Relay ergänzen eine operative Geschäftsbeschreibung und die Mittelherkunft. Wise verlangt zusätzlich **Aktivitätsnachweise** (Website, Verträge oder aktuelle Rechnungen), wenn das erwartete Volumen interne Schwellen überschreitet. Klassische Banken verlangen ein Vor-Ort-Interview, US-Adressnachweis und in vielen Bundesstaaten ITIN oder SSN.

### Empfohlene Schritt-für-Schritt-Folge für eine Nicht-Resident-LLC

1. LLC gründen und EIN beantragen, bevor Sie irgendeinen Bankantrag anfassen.
2. Mercury als Haupt-USD-Betriebskonto eröffnen.
3. Wise Business für Multi-Currency-Betrieb (EUR, GBP, AUD) und SEPA-Eingänge eröffnen.
4. Relay nur erwägen, wenn Sie mehrere Sub-Konten für Budgets benötigen oder Mercury Reibungen je nach Wohnsitzland einführt.
5. Klassische Banken nur reservieren, wenn Sie Bargeld in den USA bewegen oder einen SBA-Kredit benötigen.

### Fehler, die zur Ablehnung führen

- Privatadresse über einen generischen Mail-Forwarding-Anbieter ohne nachweisbaren Vertrag.
- Zu vage Aktivitätsbeschreibung (zum Beispiel "Consulting" ohne Sektor oder Kunden).
- Mittelherkunft unerklärt, wenn Überweisungen über 25.000 USD von einer europäischen EMI eintreffen.
- Generisches Operating Agreement ohne Abschnitt zu Geschäftsführung und Abstimmung.

> **Wie viel sparen Sie an Gebühren und FX, wenn Sie Mercury und Wise kombinieren?** Geben Sie Ihr Jahresvolumen in den ${calc("de", "Exentax-Steuer- und Betriebsrechner")} ein und vergleichen Sie mit Ihrem aktuellen Setup.

Für die vollständige Bankstruktur lesen Sie ${blogLink("de", "cuentas-bancarias-usa-reportan-hacienda-verdad", "was US-Banken wirklich melden")}, und um die Eröffnung zu delegieren ${book("de", "vereinbaren Sie ein Gespräch mit Exentax")}.
`,
  pt: `
## Abrir conta bancária nos EUA sem ser residente em 2026: comparativo Mercury vs Relay vs Wise vs banca tradicional

Mercury é a escolha por defeito, mas não a única, e vale a pena saber onde cada alternativa encaixa antes de submeter um pedido. Este bloco resume o estado real do mercado para LLC de não residentes em 2026 e descreve o KYC em cada plataforma.

### Tabela comparativa

| Critério | Mercury | Relay Financial | Wise Business | Banca tradicional (Bank of America, Chase, Wells Fargo) |
|---|---|---|---|---|
| Tipo de entidade | Fintech sobre Choice e Column N.A. (FDIC pass-through) | Fintech sobre Thread Bank (FDIC pass-through) | EMI (Wise US Inc., FinCEN MSB) | Banco comercial (FDIC direto) |
| Abertura 100 % remota para não residentes | Sim | Sim | Sim | Não, exige presença física e SSN ou ITIN do signatário |
| Tempo médio de aprovação 2026 | 2 a 7 dias | 3 a 10 dias | 1 a 3 dias | 4 a 8 semanas se chegar a abrir |
| Wires domésticos | Grátis | Grátis até 20 por mês | Pagos | Pagos |
| Wires internacionais SWIFT | Saída paga, entrada grátis | Saída competitiva | Muito barato, câmbio mid-market | Caro e câmbio pior |
| Cartão de débito virtual e físico | Sim | Sim | Sim | Sim, envio internacional restrito |
| API e automação | Boa, integrada com Mercury Raise | Limitada, sub-contas | Excelente para contabilidade | Fraca |

### Requisitos KYC mínimos em 2026

As quatro plataformas pedem: Articles of Organization da LLC, EIN Confirmation Letter (Form CP-575 ou substituto), passaporte válido do beneficiário efetivo, morada pessoal verificável fora dos EUA, Operating Agreement assinado. Mercury e Relay acrescentam descrição operacional do negócio e origem de fundos. A Wise pede ainda **prova de atividade** (site, contratos ou faturas recentes) se o volume esperado ultrapassar limiares internos. A banca tradicional acrescenta entrevista presencial, verificação de morada nos EUA e, em muitos estados, ITIN ou SSN.

### Passo a passo recomendado para LLC de não residente

1. Constituir a LLC e obter o EIN antes de tocar em qualquer pedido bancário.
2. Abrir Mercury como conta operacional principal em USD.
3. Abrir Wise Business para multi-divisa (EUR, GBP, AUD) e para SEPA europeu.
4. Considerar Relay só se precisar de várias sub-contas para orçamentos ou se Mercury introduzir fricção pelo seu país de residência.
5. Reservar banca tradicional só para dinheiro físico nos EUA ou créditos SBA.

### Erros que disparam a rejeição

- Morada pessoal servida por mail forwarding genérico sem contrato verificável.
- Descrição de atividade demasiado vaga (por exemplo "consulting" sem setor nem clientes).
- Origem de fundos não explicada quando chegam transferências acima de 25 000 USD de uma EMI europeia.
- Operating Agreement genérico sem secção de gestão e votação.

> **Quanto poupa em comissões e câmbio combinando Mercury e Wise?** Carregue o volume anual na ${calc("pt", "calculadora fiscal e operacional da Exentax")} e compare com o setup atual.

Para aprofundar a estrutura bancária completa leia ${blogLink("pt", "cuentas-bancarias-usa-reportan-hacienda-verdad", "o que os bancos americanos realmente reportam")}, e para delegar a abertura ${book("pt", "agende uma sessão com a Exentax")}.
`,
  ca: `
## Obrir compte bancari als EUA sense ser resident el 2026: comparativa Mercury vs Relay vs Wise vs banca tradicional

Mercury és l'opció per defecte, però no l'única, i convé saber on encaixa cada alternativa abans de presentar una sol·licitud. Aquest bloc resumeix l'estat real del mercat per a LLC de no residents el 2026 i descriu el KYC a cada plataforma.

### Taula comparativa

| Criteri | Mercury | Relay Financial | Wise Business | Banca tradicional (Bank of America, Chase, Wells Fargo) |
|---|---|---|---|---|
| Tipus d'entitat | Fintech sobre Choice i Column N.A. (FDIC pass-through) | Fintech sobre Thread Bank (FDIC pass-through) | EMI (Wise US Inc., FinCEN MSB) | Banc comercial (FDIC directe) |
| Obertura 100 % remota per a no residents | Sí | Sí | Sí | No, exigeix presència física i SSN o ITIN del signant |
| Temps mitjà d'aprovació 2026 | 2 a 7 dies | 3 a 10 dies | 1 a 3 dies | 4 a 8 setmanes si arribes a obrir |
| Wires domèstics | Gratis | Gratis fins a 20 al mes | De pagament | De pagament |
| Wires internacionals SWIFT | Sortida amb cost, entrada gratis | Sortida competitiva | Molt barat, canvi mid-market | Cost alt i canvi pitjor |
| Targeta de dèbit virtual i física | Sí | Sí | Sí | Sí, enviament internacional restringit |
| API i automatització | Bona, integrada amb Mercury Raise | Limitada, sub-comptes | Excel·lent per a comptabilitat | Pobra |

### Requisits KYC mínims el 2026

Les quatre plataformes demanen: Articles of Organization de la LLC, EIN Confirmation Letter (Form CP-575 o substitut), passaport vigent del beneficiari efectiu, adreça personal verificable fora dels EUA, Operating Agreement signat. Mercury i Relay afegeixen una descripció operativa del negoci i l'origen dels fons. Wise demana a més una **prova d'activitat** (web, contractes o factures recents) si el volum esperat supera llindars interns. La banca tradicional afegeix entrevista presencial, verificació d'adreça als EUA i, a molts estats, ITIN o SSN.

### Passos recomanats per a LLC de no resident

1. Constituir la LLC i obtenir l'EIN abans de tocar cap sol·licitud bancària.
2. Obrir Mercury com a compte operacional principal en USD.
3. Obrir Wise Business per a multi-divisa (EUR, GBP, AUD) i SEPA europeu.
4. Considerar Relay només si necessites diverses sub-comptes o si Mercury introdueix fricció pel teu país de residència.
5. Reservar la banca tradicional només per a efectiu físic als EUA o crèdits SBA.

### Errors que disparen el rebuig

- Adreça personal servida per un mail forwarding genèric sense contracte verificable.
- Descripció d'activitat massa vaga (per exemple "consulting" sense sector ni clients).
- Origen de fons no explicat quan arriben transferències superiors a 25 000 USD d'una EMI europea.
- Operating Agreement genèric sense secció de gestió i votació.

> **Quant estalvies en comissions i canvi combinant Mercury i Wise?** Carrega el volum anual a la ${calc("ca", "calculadora fiscal i operativa d'Exentax")} i compara'l amb el setup actual.

Per aprofundir en l'estructura bancària completa llegeix ${blogLink("ca", "cuentas-bancarias-usa-reportan-hacienda-verdad", "què reporten realment els bancs dels EUA")}, i per delegar l'obertura ${book("ca", "reserva una sessió amb Exentax")}.
`,
};

// 4) llc-alternativa-autonomo-espana → "Vivir en España con LLC americana: tributación efectiva, modelos a presentar, casos prácticos"
BLOCKS["llc-alternativa-autonomo-espana"] = {
  es: `
## Vivir en España con LLC americana en 2026: tributación efectiva, modelos a presentar y casos prácticos por nivel de facturación

Una LLC no te exime de tributar como residente en España: te da una herramienta para reordenar la fiscalidad y reducir cuotas, pero todo se ajusta en tu IRPF. Este bloque explica los modelos que sí o sí presentarás y muestra tres casos prácticos por tramo de facturación, con números reales aplicando los tramos IRPF estatal y autonómico vigentes en 2026.

### Modelos a presentar viviendo en España con LLC

- **Modelo 100 IRPF**: declaras el resultado de la actividad atribuido por la LLC como rendimiento de actividad económica si gestionas activamente, o como rendimiento del capital mobiliario si la doctrina de tu caso (consulta DGT V0290-20) lo asimila a una distribución. La calificación se acuerda con tu asesor en función del rol real.
- **Modelo 720**: si la suma de cuentas Mercury, Wise y Relay supera 50.000 EUR a 31 de diciembre, hay obligación informativa.
- **Modelo 721**: si tienes cripto en Kraken, Binance o exchanges no domiciliados en España y supera 50.000 EUR, hay obligación.
- **Modelo 232**: aplica solo si la LLC tiene operaciones vinculadas con otra entidad, no solo por ser dueño persona física.
- **Modelo 130 o 131**: si tributas como actividad económica directa, presentas pagos fraccionados trimestrales del 20 % del rendimiento neto.
- **Modelo 303 y 349**: el IVA y el VIES se rigen por las normas habituales si tu LLC tiene operaciones desde España; en la mayoría de los casos las facturas las emite la LLC y la imputación a IVA español es nula, pero conviene revisarlo.
- **Modelo D-6**: declaración informativa de inversión en valores extranjeros depositados en el extranjero. La participación 100 % en una LLC encaja aquí en muchos perfiles.

### Caso 1: 50.000 EUR de facturación neta atribuida

Tras gastos y tu retribución por gestión activa, el rendimiento neto atribuible es 38.000 EUR. Aplicando IRPF estatal y un tramo autonómico medio en 2026, la cuota efectiva ronda el **24-26 %** sobre la base. Sin Seguridad Social en la LLC (no eres autónomo), el ahorro frente a la cuota mínima de autónomo de tarifa plana ya es relevante. Coste neto anual: **9.500-10.000 EUR** de IRPF aproximadamente.

### Caso 2: 120.000 EUR de facturación neta atribuida

Con gastos profesionalizados y oficina, el rendimiento neto baja a 95.000 EUR. La factura IRPF se mueve en el entorno del **34-37 %** efectivo en muchas comunidades, equivalente a **32.000-35.000 EUR**. Comparado con un autónomo SL Beckham fuera de juego, sigue siendo competitivo y elimina la necesidad de cotizar al RETA con la nueva tabla por tramos.

### Caso 3: 250.000 EUR de facturación neta atribuida

Aquí el matiz importa: la LLC sigue siendo útil para operativa y banca, pero a 250.000 EUR la presión fiscal IRPF supera el **42 %** efectivo en la mayoría de comunidades. Conviene combinar la LLC con planificación adicional (planes de pensiones, gastos R&D, eventual cambio a SL si encaja) y, sobre todo, evaluar si te conviene moverte a una jurisdicción más favorable.

### Lo que NO arregla una LLC viviendo en España

No te exime del Modelo 720, no oculta nada a Hacienda gracias al intercambio FATCA, no te quita la obligación de cotizar si efectivamente realizas actividad económica como autónomo en España, y no convierte la cripto en exenta. Su valor está en operativa global, banca, pasarelas, separación patrimonial y simplificación administrativa.

> **¿Quieres ver el número exacto para tu facturación?** Pasa tus cifras por la ${calc("es", "calculadora fiscal Exentax")} y obtén el resultado IRPF anual con y sin LLC.

Si tu objetivo principal es minimizar carga fiscal, sigue con ${blogLink("es", "caminos-legales-minimos-impuestos", "los caminos legales para pagar el mínimo posible")}, y si tu activo principal está en cripto o brokers extranjeros completa con ${blogLink("es", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "la guía Modelo 720 y 721")}. Para revisar tu caso ${book("es", "agenda una sesión con Exentax")}.
`,
  en: `
## Living in Spain with a US LLC in 2026: effective taxation, filings and worked cases by revenue band

A US LLC does not exempt you from tax as a Spanish resident: it gives you a tool to reorder your tax bill and reduce mandatory contributions, but everything is settled inside your Modelo 100. This block explains the filings you will be doing one way or the other and shows three worked cases by revenue band using the 2026 state and regional IRPF brackets.

### Filings to expect when living in Spain with a US LLC

- **Modelo 100 IRPF**: you declare the LLC's attributed result as business income if you actively manage, or as capital income if your case fits the DGT V0290-20 doctrine. The classification is decided with your advisor based on your real role.
- **Modelo 720**: if the sum of Mercury, Wise and Relay accounts crosses EUR 50,000 on 31 December, the information return is mandatory.
- **Modelo 721**: if you hold crypto on Kraken, Binance or non Spanish exchanges and the total exceeds EUR 50,000, you must file.
- **Modelo 232**: only if the LLC has related party transactions with another entity, not for being held by a natural person alone.
- **Modelo 130 or 131**: if you tax as direct business activity, quarterly instalments at 20 % of net profit apply.
- **Modelo 303 and 349**: Spanish VAT and VIES follow the usual rules if your LLC has Spanish operations; in most cases invoicing happens at LLC level with zero Spanish VAT impact, but it deserves review.
- **Modelo D-6**: information return on foreign equity stakes held abroad. A 100 % stake in a US LLC fits here for many profiles.

### Case 1: EUR 50,000 of attributed net revenue

After expenses and your active management compensation, attributed net is EUR 38,000. Applying state and an average regional 2026 IRPF, the effective rate sits around **24-26 %** of base. Without Spanish social security on the LLC side (you are not autónomo), the saving versus the minimum quota on the new autónomo income table is already significant. Annual net cost: about **EUR 9,500-10,000** of IRPF.

### Case 2: EUR 120,000 of attributed net revenue

With professional expenses and an office, net drops to EUR 95,000. IRPF lands in the **34-37 %** effective range in most regions, that is **EUR 32,000-35,000**. Compared with autónomo without Beckham, it stays competitive and removes the need to contribute to RETA under the new income based table.

### Case 3: EUR 250,000 of attributed net revenue

Here the nuance matters: the LLC remains useful for operations and banking, but at EUR 250,000 the IRPF effective pressure goes above **42 %** in most regions. The right move is to combine the LLC with extra planning (pension plans, R&D expenses, possible move to SL if it fits) and, above all, evaluate whether moving to a more favourable jurisdiction makes sense.

### What a US LLC does not solve while living in Spain

It does not waive your Modelo 720, does not hide anything from Hacienda thanks to the FATCA exchange, does not remove the duty to contribute if you actually carry on autónomo activity in Spain, and does not turn crypto into a tax free asset. Its value lies in global operations, banking, payment gateways, asset separation and administrative simplification.

> **Want the exact number for your revenue?** Run your figures through the ${calc("en", "Exentax tax calculator")} and get the annual IRPF result with and without the LLC.

If your main goal is minimising tax, continue with ${blogLink("en", "caminos-legales-minimos-impuestos", "the legal paths to pay the minimum possible")}, and if your main asset sits in crypto or foreign brokers complete with ${blogLink("en", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "the Modelo 720 and 721 guide")}. To review your case, ${book("en", "book a session with Exentax")}.
`,
  fr: `
## Vivre en Espagne avec une LLC américaine en 2026: imposition effective, déclarations et cas chiffrés par tranche de chiffre d'affaires

Une LLC américaine ne vous exonère pas en tant que résident espagnol: elle réorganise votre fiscalité et réduit vos cotisations obligatoires, mais tout se règle dans votre Modelo 100. Ce bloc liste les déclarations incontournables et présente trois cas chiffrés par tranche de chiffre d'affaires en appliquant le barème IRPF 2026 (étatique et régional moyen).

### Déclarations à prévoir en vivant en Espagne avec une LLC US

- **Modelo 100 IRPF**: vous déclarez le résultat attribué de la LLC comme revenu d'activité si vous gérez activement, ou comme revenu de capitaux si la doctrine DGT V0290-20 s'applique à votre cas.
- **Modelo 720**: si la somme des comptes Mercury, Wise et Relay dépasse 50 000 EUR au 31 décembre, déclaration informative obligatoire.
- **Modelo 721**: si vos cryptos sur Kraken, Binance ou plateformes hors d'Espagne dépassent 50 000 EUR, déclaration obligatoire.
- **Modelo 232**: applicable seulement si la LLC a des opérations liées avec une autre entité.
- **Modelo 130 ou 131**: paiements fractionnés trimestriels de 20 % du résultat net si vous tributez comme activité économique directe.
- **Modelo 303 et 349**: TVA et VIES selon les règles habituelles; le plus souvent la LLC facture sans impact TVA espagnole.
- **Modelo D-6**: déclaration informative d'investissement en valeurs étrangères détenues à l'étranger. Une participation à 100 % dans une LLC y entre dans la plupart des cas.

### Cas 1: 50 000 EUR de chiffre net attribué

Après frais et rémunération de gestion active, le résultat net attribuable est 38 000 EUR. Avec IRPF étatique et régional moyen 2026, le taux effectif tourne autour de **24-26 %**. Sans cotisation autónomo, l'économie face à la quote minimale est déjà nette. Coût annuel: **9 500-10 000 EUR** d'IRPF.

### Cas 2: 120 000 EUR de chiffre net attribué

Avec des frais professionnels et un bureau, le net descend à 95 000 EUR. L'IRPF se situe entre **34 et 37 %** effectifs dans la plupart des régions, soit **32 000-35 000 EUR**. Reste compétitif face à un autónomo sans Beckham et supprime la cotisation RETA dans le nouveau barème par tranches.

### Cas 3: 250 000 EUR de chiffre net attribué

À ce niveau, la LLC reste utile pour l'opérationnel et la banque, mais la pression IRPF dépasse **42 %** dans la plupart des régions. Il faut compléter par planification (plans d'épargne, R&D, éventuel passage à une SL espagnole) et envisager un changement de résidence vers une juridiction plus favorable.

### Ce qu'une LLC ne résout PAS en vivant en Espagne

Elle n'annule pas le Modelo 720, ne cache rien grâce à FATCA, ne dispense pas de cotiser si vous exercez vraiment comme autónomo en Espagne, et ne rend pas la crypto exonérée. Sa valeur tient à l'opérationnel global, la banque, les passerelles, la séparation patrimoniale et la simplification administrative.

> **Vous voulez le chiffre exact pour votre CA?** Passez vos données dans le ${calc("fr", "calculateur fiscal Exentax")}.

Si votre objectif principal est de minimiser l'impôt, enchaînez avec ${blogLink("fr", "caminos-legales-minimos-impuestos", "les voies légales pour payer le minimum")}, et si votre actif principal est en crypto ou brokers étrangers complétez avec ${blogLink("fr", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "le guide Modelo 720 et 721")}. Pour revoir votre cas ${book("fr", "réservez un échange avec Exentax")}.
`,
  de: `
## In Spanien leben mit US-LLC 2026: effektive Besteuerung, Pflichten und Praxisfälle nach Umsatzklasse

Eine US-LLC entbindet Sie nicht als spanischer Steueransässiger: sie ordnet Ihre Steuerlast neu und senkt Pflichtbeiträge, aber alles wird im Modelo 100 abgerechnet. Dieser Block listet die unverzichtbaren Erklärungen und zeigt drei Praxisfälle nach Umsatzklasse mit den 2026 gültigen IRPF-Sätzen (staatlich plus regional im Durchschnitt).

### Erklärungen beim Leben in Spanien mit einer US-LLC

- **Modelo 100 IRPF**: Sie erklären das zugerechnete Ergebnis der LLC als Einkünfte aus wirtschaftlicher Tätigkeit bei aktiver Geschäftsführung oder als Kapitaleinkünfte, wenn die Doktrin DGT V0290-20 auf Ihren Fall passt.
- **Modelo 720**: wenn die Summe der Konten bei Mercury, Wise und Relay zum 31. Dezember 50.000 EUR übersteigt, ist die Erklärung Pflicht.
- **Modelo 721**: wenn Sie Krypto bei Kraken, Binance oder nicht spanischen Börsen halten und die Summe 50.000 EUR übersteigt, ist die Erklärung Pflicht.
- **Modelo 232**: nur, wenn die LLC verbundene Geschäftsbeziehungen mit einer anderen Einheit hat.
- **Modelo 130 oder 131**: vierteljährliche Vorauszahlungen von 20 % des Nettoergebnisses bei direkter wirtschaftlicher Tätigkeit.
- **Modelo 303 und 349**: spanische Mehrwertsteuer und VIES nach den üblichen Regeln; in der Regel rechnet die LLC ohne Wirkung auf die spanische Mehrwertsteuer ab.
- **Modelo D-6**: Auskunftserklärung über im Ausland gehaltene Beteiligungen. Eine 100 %-Beteiligung an einer LLC fällt für viele Profile darunter.

### Fall 1: 50.000 EUR zugerechneter Nettoumsatz

Nach Aufwand und aktiver Geschäftsführungsvergütung beträgt das zugerechnete Netto 38.000 EUR. Mit staatlichem und durchschnittlichem regionalem IRPF 2026 ergibt sich ein effektiver Satz von rund **24-26 %**. Ohne spanische Sozialversicherung auf LLC-Seite ist die Ersparnis gegenüber der Mindestquote des Autónomo bereits deutlich. Jahreskosten: rund **9.500-10.000 EUR** IRPF.

### Fall 2: 120.000 EUR zugerechneter Nettoumsatz

Mit professionellen Aufwendungen und einem Büro sinkt das Netto auf 95.000 EUR. Die IRPF-Quote liegt in den meisten Regionen effektiv zwischen **34 und 37 %**, also **32.000-35.000 EUR**. Bleibt wettbewerbsfähig gegenüber einem Autónomo ohne Beckham und macht die RETA-Beiträge nach der neuen einkommensbasierten Tabelle überflüssig.

### Fall 3: 250.000 EUR zugerechneter Nettoumsatz

Auf diesem Niveau bleibt die LLC für Betrieb und Bank nützlich, aber die effektive IRPF-Belastung steigt in den meisten Regionen über **42 %**. Sinnvoll ist die Kombination mit weiterer Planung (Pensionspläne, R&D, ggf. Wechsel zu spanischer SL) und eine Bewertung, ob ein Wechsel in eine günstigere Jurisdiktion lohnt.

### Was eine US-LLC beim Leben in Spanien NICHT löst

Sie befreit nicht vom Modelo 720, verbirgt dank FATCA nichts vor Hacienda, befreit nicht von Beiträgen, wenn Sie wirklich als Autónomo in Spanien tätig sind, und macht Krypto nicht steuerfrei. Ihr Wert liegt im globalen Betrieb, in Bank, Zahlungsplattformen, Vermögensseparierung und administrativer Vereinfachung.

> **Wollen Sie die genaue Zahl für Ihren Umsatz?** Geben Sie Ihre Werte in den ${calc("de", "Exentax-Steuerrechner")} ein.

Ist Ihr Hauptziel die Steuerminimierung, geht es weiter mit ${blogLink("de", "caminos-legales-minimos-impuestos", "den legalen Wegen zur Steuerminimierung")}, und liegt Ihr Hauptvermögen in Krypto oder ausländischen Brokern, ergänzen Sie mit ${blogLink("de", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "dem Modelo-720-und-721-Leitfaden")}. Für Ihren Fall ${book("de", "vereinbaren Sie ein Gespräch mit Exentax")}.
`,
  pt: `
## Viver em Espanha com LLC americana em 2026: tributação efetiva, modelos e casos práticos por nível de faturação

Uma LLC americana não o isenta como residente em Espanha: dá-lhe uma ferramenta para reordenar a fiscalidade e reduzir contribuições obrigatórias, mas tudo é liquidado no Modelo 100. Este bloco lista as declarações inevitáveis e mostra três casos práticos por nível de faturação aplicando os escalões IRPF 2026 (estatal mais autonómico médio).

### Declarações a prever vivendo em Espanha com LLC US

- **Modelo 100 IRPF**: declara o resultado atribuído da LLC como rendimento de atividade económica se gere ativamente, ou como rendimento de capitais se a doutrina DGT V0290-20 se aplicar ao seu caso.
- **Modelo 720**: se a soma de contas Mercury, Wise e Relay ultrapassar 50.000 EUR a 31 de dezembro, a declaração informativa é obrigatória.
- **Modelo 721**: se tiver cripto na Kraken, Binance ou exchanges fora de Espanha acima de 50.000 EUR, declaração obrigatória.
- **Modelo 232**: aplicável só se a LLC tiver operações vinculadas com outra entidade.
- **Modelo 130 ou 131**: pagamentos trimestrais de 20 % do resultado líquido se tributar como atividade económica direta.
- **Modelo 303 e 349**: IVA e VIES conforme regras habituais; na maioria dos casos a LLC fatura sem impacto no IVA espanhol.
- **Modelo D-6**: declaração informativa de investimento em valores estrangeiros depositados no estrangeiro. Uma participação de 100 % numa LLC encaixa aqui em muitos perfis.

### Caso 1: 50.000 EUR de faturação líquida atribuída

Após despesas e remuneração de gestão ativa, o líquido atribuível é 38.000 EUR. Com IRPF estatal e autonómico médio 2026 a taxa efetiva ronda os **24-26 %**. Sem contribuição autónomo, a poupança face à quota mínima da nova tabela já é relevante. Custo anual: **9.500-10.000 EUR** de IRPF.

### Caso 2: 120.000 EUR de faturação líquida atribuída

Com despesas profissionais e escritório, o líquido baixa para 95.000 EUR. A factura IRPF fica entre **34 e 37 %** efetivos na maioria das comunidades, ou seja **32.000-35.000 EUR**. Continua competitivo face a autónomo sem Beckham e elimina a contribuição RETA na nova tabela por escalões.

### Caso 3: 250.000 EUR de faturação líquida atribuída

A este nível a LLC continua útil para operacional e banca, mas a pressão IRPF passa de **42 %** efetivos na maioria das comunidades. Convém combinar com planeamento adicional (planos de poupança, I&D, eventual passagem a SL) e avaliar mudança para jurisdição mais favorável.

### O que uma LLC NÃO resolve a viver em Espanha

Não dispensa o Modelo 720, não esconde nada graças ao FATCA, não exonera a contribuição se efetivamente exercer como autónomo em Espanha e não torna a cripto isenta. O seu valor está no operacional global, banca, gateways, separação patrimonial e simplificação administrativa.

> **Quer o número exato para a sua faturação?** Passe os dados pela ${calc("pt", "calculadora fiscal da Exentax")}.

Se o objetivo principal é minimizar carga fiscal continue com ${blogLink("pt", "caminos-legales-minimos-impuestos", "os caminhos legais para pagar o mínimo possível")}, e se o ativo principal está em cripto ou corretoras estrangeiras complemente com ${blogLink("pt", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "o guia Modelo 720 e 721")}. Para rever o seu caso ${book("pt", "agende uma sessão com a Exentax")}.
`,
  ca: `
## Viure a Espanya amb LLC americana el 2026: tributació efectiva, models i casos pràctics per nivell de facturació

Una LLC americana no t'eximeix com a resident a Espanya: et dóna una eina per reordenar la fiscalitat i reduir contribucions obligatòries, però tot es liquida al Model 100. Aquest bloc llista les declaracions inevitables i mostra tres casos pràctics per nivell de facturació aplicant els trams IRPF 2026 (estatal i autonòmic mitjà).

### Declaracions a preveure vivint a Espanya amb LLC US

- **Model 100 IRPF**: declares el resultat atribuït de la LLC com a rendiment d'activitat econòmica si gestiones activament, o com a rendiment de capital si la doctrina DGT V0290-20 s'aplica al teu cas.
- **Model 720**: si la suma de comptes Mercury, Wise i Relay supera 50.000 EUR a 31 de desembre, la declaració informativa és obligatòria.
- **Model 721**: si tens cripto a Kraken, Binance o exchanges fora d'Espanya per sobre de 50.000 EUR, declaració obligatòria.
- **Model 232**: aplicable només si la LLC té operacions vinculades amb una altra entitat.
- **Model 130 o 131**: pagaments trimestrals del 20 % del rendiment net si tributes com a activitat econòmica directa.
- **Model 303 i 349**: IVA i VIES segons les regles habituals; en la majoria de casos la LLC factura sense impacte a l'IVA espanyol.
- **Model D-6**: declaració informativa d'inversió en valors estrangers dipositats a l'estranger. Una participació al 100 % en una LLC hi encaixa per a molts perfils.

### Cas 1: 50.000 EUR de facturació neta atribuïda

Després de despeses i retribució de gestió activa, el net atribuïble és 38.000 EUR. Amb IRPF estatal i autonòmic mitjà 2026 el tipus efectiu és d'aproximadament el **24-26 %**. Sense quota d'autònom, l'estalvi davant la quota mínima ja és rellevant. Cost anual: **9.500-10.000 EUR** d'IRPF.

### Cas 2: 120.000 EUR de facturació neta atribuïda

Amb despeses professionals i oficina, el net baixa a 95.000 EUR. L'IRPF se situa entre **34 i 37 %** efectius a la majoria de comunitats, és a dir **32.000-35.000 EUR**. Continua competitiu davant un autònom sense Beckham i elimina la quota RETA segons la nova taula per trams.

### Cas 3: 250.000 EUR de facturació neta atribuïda

A aquest nivell la LLC continua sent útil per a operativa i banca, però la pressió IRPF supera el **42 %** efectiu a la majoria de comunitats. Convé combinar-la amb planificació addicional (plans de pensions, R+D, eventual canvi a SL) i avaluar el trasllat a una jurisdicció més favorable.

### El que una LLC NO resol vivint a Espanya

No t'eximeix del Model 720, no amaga res gràcies a FATCA, no et lleva la cotització si realment exerceixes com a autònom a Espanya, i no fa la cripto exempta. El seu valor és l'operativa global, la banca, les passarel·les, la separació patrimonial i la simplificació administrativa.

> **Vols el número exacte per a la teva facturació?** Passa les xifres per la ${calc("ca", "calculadora fiscal d'Exentax")}.

Si l'objectiu principal és minimitzar la càrrega fiscal continua amb ${blogLink("ca", "caminos-legales-minimos-impuestos", "els camins legals per pagar el mínim possible")}, i si l'actiu principal és en cripto o brokers estrangers completa amb ${blogLink("ca", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "la guia Model 720 i 721")}. Per revisar el teu cas ${book("ca", "reserva una sessió amb Exentax")}.
`,
};

// 5) caminos-legales-minimos-impuestos → "Cómo pagar menos impuestos legalmente en España 2026"
BLOCKS["caminos-legales-minimos-impuestos"] = {
  es: `
## Cómo pagar menos impuestos legalmente en España 2026: deducciones IRPF, planes de pensiones, régimen Beckham y LLC americana como herramienta legítima

Antes de pensar en mudarse, conviene exprimir las palancas legales que ya existen en territorio español y que la mayoría de los contribuyentes ni siquiera aplica. Este bloque ordena las cuatro grandes vías reales para 2026, con un checklist por perfil al final.

### Palanca 1: deducciones IRPF que el residente medio se deja en la mesa

- **Aportaciones a planes de pensiones** del partícipe (límite reducido a 1.500 EUR anuales tras la reforma) y, sobre todo, **planes de pensiones de empleo** vehiculados por el empleador, que permiten aportaciones adicionales de hasta 8.500 EUR anuales sin penalizar al asalariado.
- **Maternidad**, **familia numerosa**, **descendientes y ascendientes a cargo** y **discapacidad**: deducciones estatales y autonómicas que muchos olvidan declarar.
- **Inversión en empresas de nueva creación**: 50 % de deducción estatal sobre 100.000 EUR anuales si cumples los requisitos del artículo 68.1 LIRPF.
- **Donativos** a entidades acogidas a la Ley 49/2002: 80 % los primeros 250 EUR y 40 % en lo restante, además de incentivos a la fidelización.
- **Vivienda habitual** en alquiler: deducciones autonómicas de Madrid, Cataluña, Comunidad Valenciana, Andalucía y otras, con tramos según edad e ingresos.

### Palanca 2: planes de pensiones de empleo y rentas vitalicias

La reforma desplazó el peso desde el plan individual al plan de empleo. Si gestionas tu propia LLC y residen en España, conviene canalizar parte de la retribución por gestión a un plan de empleo a través de tu propia estructura siempre que sea jurídicamente viable. Las **rentas vitalicias** del artículo 38 LIRPF permiten reinvertir ganancias patrimoniales sin tributación si tienes más de 65 años y se cumplen condiciones de plazo y forma.

### Palanca 3: régimen Beckham para impatriados

La Ley 28/2022 amplió el régimen Beckham a profesionales digitales con visa de teletrabajador y cubre seis ejercicios completos. Tributas al **24 %** hasta 600.000 EUR de rendimientos del trabajo y dejas fuera de la base general los rendimientos no obtenidos en España. Se solicita en el plazo de seis meses desde el alta en la Seguridad Social y exige no haber sido residente en los cinco años previos.

### Palanca 4: LLC americana como herramienta legítima de planificación

Una LLC bien declarada permite separar patrimonio, profesionalizar la gestión y, combinada con un convenio de doble imposición, reducir efectivamente la cuota IRPF cuando la actividad es internacional. La doctrina DGT V0290-20 admite la atribución como rendimiento de capital o de actividad según el rol del socio. La LLC nunca es una capa para "no declarar" desde España: con FATCA y los avances DAC8 todo aflora. Su valor es operacional, financiero y de optimización legal de la carga, no de ocultación.

### Checklist por perfil

- **Asalariado**: maximiza el plan de pensiones de empleo, revisa deducciones autonómicas, revisa retribución flexible (cheque guardería, formación, salud).
- **Autónomo**: ordena gastos deducibles, evalúa pasar a SL si superas 60.000-80.000 EUR de beneficio neto, considera LLC como capa internacional si tu cartera de clientes es global.
- **Dueño de SL**: cobra parte como salario y parte como dividendo aprovechando la base ahorro, vehicula vehículo y vivienda con prudencia y reglas DGT.
- **Dueño de LLC residente en España**: declara limpio en el Modelo 100 y, si aplica, Modelo 720, optimiza dentro del marco legal y evita estructuras opacas.

> **¿Cuánto puedes ahorrar combinando bien estas palancas?** Estima tu factura anual con la ${calc("es", "calculadora fiscal Exentax")} y compara escenarios "como hoy" vs "con planificación 2026".

Para ver cómo encaja la LLC con tu vida en España continua con ${blogLink("es", "llc-alternativa-autonomo-espana", "la guía LLC frente a autónomo en España")}, y si te tienta moverte fuera mira ${blogLink("es", "nomada-digital-residencia-fiscal", "la estrategia de nómada digital y residencia fiscal")}. Para diseñar tu mapa ${book("es", "agenda una sesión con Exentax")}.
`,
  en: `
## How to pay less tax legally in Spain in 2026: IRPF deductions, pension plans, Beckham regime and US LLC as a legitimate planning tool

Before thinking about moving abroad, it pays to squeeze the legal levers already available in Spain that most taxpayers do not even apply. This block lays out the four real avenues for 2026, with a checklist by profile at the end.

### Lever 1: IRPF deductions the average resident leaves on the table

- **Personal pension plan contributions** (capped at EUR 1,500 a year after the reform) and especially **employment pension plans** sponsored by the employer, allowing extra contributions up to EUR 8,500 a year without penalising the employee.
- **Maternity**, **large family**, **dependent descendants and ascendants** and **disability**: state and regional deductions that many forget to claim.
- **Investment in newly created companies**: 50 % state deduction on EUR 100,000 a year if you meet the article 68.1 LIRPF requirements.
- **Donations** to organisations under Ley 49/2002: 80 % on the first EUR 250 and 40 % on the rest, plus loyalty incentives.
- **Primary residence** rentals: regional deductions in Madrid, Catalonia, Valencia, Andalusia and others, with brackets by age and income.

### Lever 2: employment pension plans and life annuities

The reform shifted weight from individual to employment pension plans. If you run your own LLC and live in Spain, channel part of the management compensation into an employment pension plan through your own structure where legally viable. **Life annuities** under article 38 LIRPF allow reinvesting capital gains tax free if you are over 65 and meet term and form conditions.

### Lever 3: Beckham regime for inbound taxpayers

Ley 28/2022 expanded the Beckham regime to digital professionals with a remote work visa and covers six full tax years. You are taxed at **24 %** up to EUR 600,000 of employment income and non Spanish income is left out of the general base. Apply within six months of registering with social security; you must not have been a Spanish resident for the previous five years.

### Lever 4: US LLC as a legitimate planning tool

A properly declared LLC lets you separate assets, professionalise management and, combined with a tax treaty, materially lower your IRPF bill when activity is international. The DGT V0290-20 doctrine accepts attribution as capital or business income depending on the partner's role. The LLC is never a wrapper to "not file" in Spain: with FATCA and the DAC8 progression, everything surfaces. Its value lies in operations, financing and legal optimisation, not concealment.

### Checklist by profile

- **Employee**: maximise the employment pension plan, review regional deductions, review flexible compensation (childcare voucher, training, health).
- **Self-employed**: tidy up deductible expenses, assess switching to SL above EUR 60,000-80,000 net profit, consider the LLC as an international layer if your client base is global.
- **SL owner**: blend salary and dividends taking advantage of the savings base, structure car and housing with caution under DGT rules.
- **LLC owner resident in Spain**: file clean Modelo 100 and Modelo 720 where applicable, optimise within the legal frame and avoid opaque structures.

> **How much can you save by combining these levers properly?** Estimate your annual bill with the ${calc("en", "Exentax tax calculator")} and compare "as today" vs "with 2026 planning".

To see how the LLC fits your life in Spain continue with ${blogLink("en", "llc-alternativa-autonomo-espana", "the LLC versus autónomo in Spain guide")}, and if you are tempted to move look at ${blogLink("en", "nomada-digital-residencia-fiscal", "the digital nomad and tax residency strategy")}. To design your map, ${book("en", "book a session with Exentax")}.
`,
  fr: `
## Comment payer moins d'impôts légalement en Espagne en 2026: déductions IRPF, plans d'épargne retraite, régime Beckham et LLC américaine comme outil légitime

Avant d'envisager une expatriation, il faut presser les leviers légaux déjà disponibles en Espagne, que la plupart des contribuables n'utilisent même pas. Ce bloc présente les quatre voies réelles pour 2026 avec une checklist par profil.

### Levier 1: déductions IRPF que le résident moyen oublie

- **Plans d'épargne retraite personnels** (plafond ramené à 1 500 EUR par an) et surtout **plans d'épargne retraite d'entreprise** abondés par l'employeur, qui autorisent jusqu'à 8 500 EUR par an additionnels.
- **Maternité**, **famille nombreuse**, **personnes à charge** et **handicap**: déductions étatiques et régionales souvent oubliées.
- **Investissement dans des entreprises nouvelles**: 50 % de déduction étatique sur 100 000 EUR par an avec les conditions de l'article 68.1 LIRPF.
- **Dons** à des entités sous la Ley 49/2002: 80 % sur les 250 premiers EUR et 40 % au-delà.
- **Logement principal** en location: déductions régionales selon âge et revenus.

### Levier 2: plans d'épargne retraite d'entreprise et rentes viagères

La réforme a déplacé le poids du plan individuel vers le plan d'entreprise. Si vous gérez votre propre LLC et vivez en Espagne, canalisez une partie de la rémunération de gestion vers un plan d'entreprise via votre structure si juridiquement viable. Les **rentes viagères** de l'article 38 LIRPF permettent de réinvestir des plus-values en exonération sous conditions d'âge et de forme.

### Levier 3: régime Beckham pour impatriés

La Ley 28/2022 a élargi le régime Beckham aux professionnels numériques avec visa de télétravail et couvre six exercices complets. Vous êtes imposé à **24 %** jusqu'à 600 000 EUR de revenus du travail; les revenus non espagnols sortent de la base générale. À demander dans les six mois suivant l'inscription à la sécurité sociale et il faut ne pas avoir été résident pendant les cinq années précédentes.

### Levier 4: LLC américaine comme outil légitime de planification

Une LLC bien déclarée permet de séparer le patrimoine, de professionnaliser la gestion et, combinée à la convention fiscale, de réduire effectivement l'IRPF quand l'activité est internationale. La doctrine DGT V0290-20 accepte l'attribution en tant que revenu de capital ou d'activité selon le rôle du dirigeant. La LLC n'est jamais une enveloppe pour ne pas déclarer en Espagne: avec FATCA et la trajectoire DAC8 tout remonte. Sa valeur est opérationnelle, financière et d'optimisation légale, pas dissimulation.

### Checklist par profil

- **Salarié**: maximiser le plan d'entreprise, revoir les déductions régionales, revoir la rémunération flexible (chèque garde, formation, santé).
- **Indépendant**: ranger les frais déductibles, évaluer un passage à SL au-dessus de 60 000-80 000 EUR de bénéfice net, envisager la LLC comme couche internationale si la clientèle est globale.
- **Dirigeant de SL**: combiner salaire et dividende avec la base d'épargne, structurer véhicule et logement avec prudence sous règles DGT.
- **Dirigeant de LLC résident en Espagne**: déposer un Modelo 100 et un Modelo 720 propres, optimiser dans le cadre légal et éviter les structures opaques.

> **Combien pouvez-vous économiser en combinant bien ces leviers?** Estimez votre facture annuelle avec le ${calc("fr", "calculateur fiscal Exentax")}.

Pour voir comment la LLC s'intègre à votre vie en Espagne continuez avec ${blogLink("fr", "llc-alternativa-autonomo-espana", "le guide LLC face à autónomo")}, et si l'idée d'expatriation vous tente regardez ${blogLink("fr", "nomada-digital-residencia-fiscal", "la stratégie nomade numérique et résidence fiscale")}. Pour dessiner votre plan ${book("fr", "réservez un échange avec Exentax")}.
`,
  de: `
## Wie Sie 2026 in Spanien legal weniger Steuern zahlen: IRPF-Abzüge, Pensionspläne, Beckham-Regime und US-LLC als legitimes Werkzeug

Bevor Sie an einen Umzug denken, lohnt es, die in Spanien bereits verfügbaren legalen Hebel auszunutzen, die die meisten Steuerzahler nicht einmal anwenden. Dieser Block ordnet die vier realen Wege für 2026 mit einer Checkliste pro Profil.

### Hebel 1: IRPF-Abzüge, die der Durchschnittsresident liegen lässt

- **Persönliche Pensionsplanbeiträge** (auf 1.500 EUR pro Jahr begrenzt) und vor allem **arbeitgeberfinanzierte Betriebspensionspläne**, die zusätzlich bis zu 8.500 EUR pro Jahr erlauben.
- **Mutterschaft**, **kinderreiche Familie**, **abhängige Angehörige** und **Behinderung**: staatliche und regionale Abzüge, die viele vergessen.
- **Investition in neu gegründete Unternehmen**: 50 % staatlicher Abzug auf 100.000 EUR pro Jahr nach Artikel 68.1 LIRPF.
- **Spenden** an Einrichtungen nach Ley 49/2002: 80 % auf die ersten 250 EUR und 40 % darüber hinaus.
- **Mietwohnung** als Hauptwohnsitz: regionale Abzüge in Madrid, Katalonien, Valencia, Andalusien u. a. nach Alter und Einkommen.

### Hebel 2: Betriebspensionspläne und Leibrenten

Die Reform verschob das Gewicht vom Privat- zum Betriebsplan. Wer eine eigene LLC führt und in Spanien lebt, sollte Teile der Geschäftsführungsvergütung über die eigene Struktur in einen Betriebsplan kanalisieren, soweit rechtlich tragfähig. **Leibrenten** nach Artikel 38 LIRPF erlauben die steuerfreie Reinvestition von Veräußerungsgewinnen unter Alters- und Formbedingungen.

### Hebel 3: Beckham-Regime für Zuzügler

Die Ley 28/2022 weitete das Beckham-Regime auf digitale Fachkräfte mit Remote-Work-Visum aus und deckt sechs volle Steuerjahre ab. Sie zahlen **24 %** bis 600.000 EUR Arbeitseinkünfte; nicht spanische Einkünfte bleiben aus der allgemeinen Bemessungsgrundlage. Zu beantragen innerhalb von sechs Monaten nach der Anmeldung in der Sozialversicherung; in den fünf Jahren davor darf keine spanische Residenz bestanden haben.

### Hebel 4: US-LLC als legitimes Planungswerkzeug

Eine sauber deklarierte LLC erlaubt Vermögensseparierung, professionelle Geschäftsführung und, kombiniert mit einem Doppelbesteuerungsabkommen, die effektive Senkung der IRPF-Last bei internationaler Tätigkeit. Die Doktrin DGT V0290-20 akzeptiert die Zurechnung als Kapital- oder Tätigkeitseinkünfte je nach Rolle des Gesellschafters. Die LLC ist nie ein Mantel, um in Spanien nichts zu deklarieren: mit FATCA und der DAC8-Entwicklung kommt alles ans Licht. Ihr Wert liegt in Betrieb, Finanzierung und legaler Optimierung, nicht in Verschleierung.

### Checkliste nach Profil

- **Arbeitnehmer**: Betriebspensionsplan maximieren, regionale Abzüge prüfen, flexible Vergütung prüfen (Kita-Gutschein, Weiterbildung, Gesundheit).
- **Selbstständig**: abziehbare Aufwendungen ordnen, Wechsel zur SL ab 60.000-80.000 EUR Nettogewinn prüfen, LLC als internationale Schicht erwägen.
- **SL-Inhaber**: Gehalt und Dividende kombinieren mit Sparbasis, Fahrzeug und Wohnen vorsichtig nach DGT-Regeln strukturieren.
- **LLC-Inhaber mit Wohnsitz in Spanien**: Modelo 100 und Modelo 720 sauber einreichen, im legalen Rahmen optimieren, opake Strukturen meiden.

> **Wie viel können Sie sparen, wenn Sie diese Hebel sauber kombinieren?** Schätzen Sie Ihre Jahresrechnung mit dem ${calc("de", "Exentax-Steuerrechner")}.

Wie die LLC in Ihr Leben in Spanien passt, lesen Sie weiter in ${blogLink("de", "llc-alternativa-autonomo-espana", "dem Leitfaden LLC vs Autónomo")}, und für eine Auswanderungsoption schauen Sie auf ${blogLink("de", "nomada-digital-residencia-fiscal", "die Strategie für digitale Nomaden und Steueransässigkeit")}. Für Ihren Plan ${book("de", "vereinbaren Sie ein Gespräch mit Exentax")}.
`,
  pt: `
## Como pagar menos impostos legalmente em Espanha em 2026: deduções IRPF, planos de pensões, regime Beckham e LLC americana como ferramenta legítima

Antes de pensar em mudar de país, vale a pena espremer as alavancas legais que já existem em Espanha e que a maioria dos contribuintes nem aplica. Este bloco organiza as quatro vias reais para 2026 com um checklist por perfil.

### Alavanca 1: deduções IRPF que o residente médio deixa por cobrar

- **Contribuições para planos de pensões pessoais** (limite reduzido a 1.500 EUR por ano) e sobretudo **planos de pensões de empresa** apoiados pela entidade patronal, que permitem mais 8.500 EUR por ano.
- **Maternidade**, **família numerosa**, **dependentes** e **deficiência**: deduções estatais e autonómicas frequentemente esquecidas.
- **Investimento em empresas de nova criação**: 50 % de dedução estatal sobre 100.000 EUR por ano segundo o artigo 68.1 LIRPF.
- **Donativos** a entidades acolhidas pela Ley 49/2002: 80 % sobre os primeiros 250 EUR e 40 % no restante.
- **Habitação principal** em arrendamento: deduções autonómicas em Madrid, Catalunha, Valência, Andaluzia e outras, por idade e rendimentos.

### Alavanca 2: planos de pensões de empresa e rendas vitalícias

A reforma deslocou o peso do plano individual para o plano de empresa. Se gere a sua própria LLC e vive em Espanha, canalize parte da remuneração de gestão para um plano de empresa através da sua estrutura quando juridicamente viável. As **rendas vitalícias** do artigo 38 LIRPF permitem reinvestir mais-valias com isenção sob condições de idade e forma.

### Alavanca 3: regime Beckham para impatriados

A Ley 28/2022 alargou o regime Beckham a profissionais digitais com visto de teletrabalho e cobre seis exercícios completos. É tributado a **24 %** até 600.000 EUR de rendimentos de trabalho; rendimentos fora de Espanha ficam fora da base geral. Pede-se em seis meses desde a inscrição na Segurança Social e exige não ter sido residente nos cinco anos anteriores.

### Alavanca 4: LLC americana como ferramenta legítima de planeamento

Uma LLC bem declarada permite separar património, profissionalizar a gestão e, em combinação com convenção, reduzir efetivamente a fatura IRPF quando a atividade é internacional. A doutrina DGT V0290-20 admite a atribuição como rendimento de capital ou de atividade segundo o papel do sócio. A LLC nunca é uma capa para não declarar em Espanha: com FATCA e a trajetória DAC8 tudo aflora. O seu valor é operacional, financeiro e de otimização legal, não ocultação.

### Checklist por perfil

- **Trabalhador por conta de outrem**: maximizar plano de empresa, rever deduções autonómicas, rever remuneração flexível (cheque infância, formação, saúde).
- **Trabalhador independente**: arrumar despesas dedutíveis, avaliar passagem a SL acima de 60.000-80.000 EUR de lucro líquido, considerar LLC como camada internacional.
- **Sócio de SL**: combinar salário e dividendo aproveitando a base poupança, estruturar veículo e habitação com prudência sob regras DGT.
- **Sócio de LLC residente em Espanha**: apresentar Modelo 100 e Modelo 720 limpos, otimizar dentro do quadro legal, evitar estruturas opacas.

> **Quanto pode poupar combinando bem estas alavancas?** Estime a fatura anual com a ${calc("pt", "calculadora fiscal da Exentax")}.

Para ver como a LLC encaixa na sua vida em Espanha continue com ${blogLink("pt", "llc-alternativa-autonomo-espana", "o guia LLC vs autónomo")}, e se o pensamento é mudar de país veja ${blogLink("pt", "nomada-digital-residencia-fiscal", "a estratégia de nómada digital e residência fiscal")}. Para desenhar o plano ${book("pt", "agende uma sessão com a Exentax")}.
`,
  ca: `
## Com pagar menys impostos legalment a Espanya el 2026: deduccions IRPF, plans de pensions, règim Beckham i LLC americana com a eina legítima

Abans de pensar a canviar de país, val la pena exprimir les palanques legals que ja existeixen a Espanya i que la majoria de contribuents ni apliquen. Aquest bloc ordena les quatre vies reals per al 2026 amb una checklist per perfil.

### Palanca 1: deduccions IRPF que el resident mitjà deixa per cobrar

- **Aportacions a plans de pensions personals** (límit reduït a 1.500 EUR anuals) i sobretot **plans de pensions d'ocupació** finançats per l'empresa, que permeten 8.500 EUR anuals addicionals.
- **Maternitat**, **família nombrosa**, **persones a càrrec** i **discapacitat**: deduccions estatals i autonòmiques sovint oblidades.
- **Inversió en empreses de nova creació**: 50 % de deducció estatal sobre 100.000 EUR anuals segons l'article 68.1 LIRPF.
- **Donatius** a entitats acollides a la Llei 49/2002: 80 % sobre els primers 250 EUR i 40 % en la resta.
- **Habitatge habitual** en lloguer: deduccions autonòmiques a Madrid, Catalunya, València, Andalusia i altres, per edat i ingressos.

### Palanca 2: plans de pensions d'ocupació i rendes vitalícies

La reforma va desplaçar el pes del pla individual al pla d'ocupació. Si gestiones la teva pròpia LLC i vius a Espanya, canalitza part de la retribució de gestió a un pla d'ocupació via la teva estructura quan jurídicament sigui viable. Les **rendes vitalícies** de l'article 38 LIRPF permeten reinvertir guanys amb exempció sota condicions d'edat i forma.

### Palanca 3: règim Beckham per a impatriats

La Llei 28/2022 va ampliar el règim Beckham a professionals digitals amb visa de teletreball i cobreix sis exercicis complets. Tributes al **24 %** fins a 600.000 EUR de rendes del treball i les rendes no espanyoles queden fora de la base general. Es demana en sis mesos des de l'alta a la Seguretat Social i exigeix no haver estat resident els cinc anys previs.

### Palanca 4: LLC americana com a eina legítima de planificació

Una LLC ben declarada permet separar patrimoni, professionalitzar la gestió i, combinada amb el conveni, reduir efectivament la quota IRPF quan l'activitat és internacional. La doctrina DGT V0290-20 admet l'atribució com a rendiment de capital o d'activitat segons el rol del soci. La LLC mai no és una capa per no declarar a Espanya: amb FATCA i la trajectòria DAC8 tot aflora. El seu valor és operacional, financer i d'optimització legal, no ocultació.

### Checklist per perfil

- **Assalariat**: maximitza el pla d'ocupació, revisa deduccions autonòmiques, revisa retribució flexible (xec llar d'infants, formació, salut).
- **Autònom**: ordena despeses deduïbles, valora el canvi a SL per sobre de 60.000-80.000 EUR de benefici net, considera la LLC com a capa internacional.
- **Soci de SL**: combina salari i dividend aprofitant la base d'estalvi, estructura vehicle i habitatge amb prudència sota regles DGT.
- **Soci de LLC resident a Espanya**: presenta Model 100 i Model 720 nets, optimitza dins del marc legal i evita estructures opaques.

> **Quant pots estalviar combinant bé aquestes palanques?** Estima la teva factura anual amb la ${calc("ca", "calculadora fiscal d'Exentax")}.

Per veure com encaixa la LLC amb la teva vida a Espanya continua amb ${blogLink("ca", "llc-alternativa-autonomo-espana", "la guia LLC vs autònom")}, i si penses a marxar mira ${blogLink("ca", "nomada-digital-residencia-fiscal", "l'estratègia de nòmada digital i residència fiscal")}. Per dissenyar el teu pla ${book("ca", "reserva una sessió amb Exentax")}.
`,
};

// 6) estructura-offshore-beneficios-riesgos → "Paraísos fiscales 2026: lista AEAT, jurisdicciones no cooperativas UE/OCDE, intercambio CRS/FATCA"
BLOCKS["estructura-offshore-beneficios-riesgos"] = {
  es: `
## Paraísos fiscales 2026: lista oficial AEAT actualizada, jurisdicciones no cooperativas UE/OCDE e intercambio automático CRS/FATCA

La palabra "paraíso fiscal" arrastra mucha mitología. La realidad regulatoria 2026 es que existen tres listas oficiales que conviven y un sistema de intercambio automático de información que vacía gran parte del beneficio teórico de operar desde estas jurisdicciones sin estructura real. Este bloque ordena las listas, sintetiza qué información se intercambia y deja claro cómo Exentax ayuda a estructurar legalmente sin caer en estas categorías.

### Las tres listas que conviven

1. **Lista española de jurisdicciones no cooperativas (Orden HFP/115/2023, BOE 10 de febrero de 2023)**, modificada en 2024. Sustituyó al RD 1080/1991 e introdujo criterios cualitativos del artículo 16 Ley 11/2021. En 2026 incluye, entre otras, Anguila, Bahréin, Barbados, Bermudas, Dominica, Fiyi, Gibraltar (parcial), Guam, Islas Marianas, Islas Salomón, Islas Turcas y Caicos, Islas Vírgenes Británicas, Islas Vírgenes Estadounidenses, Jersey y Guernsey (parcial), Líbano, Macao, Mauricio, Palau, Samoa Americana, Samoa, Seychelles, Trinidad y Tobago, Vanuatu. Conviene siempre verificar el listado vigente en la sede de la AEAT.
2. **Lista de la Unión Europea de jurisdicciones no cooperativas (Anexo I)**, actualizada por el Consejo ECOFIN dos veces al año, con su lista gris (Anexo II) de países que se comprometen a reformar.
3. **Lista OCDE / Foro Global** sobre transparencia e intercambio de información, que valora a las jurisdicciones como "compliant", "largely compliant", "partially compliant" o "non-compliant".

### Qué pasa si operas desde una jurisdicción de la lista AEAT

- Inversión de la carga de la prueba en operaciones vinculadas.
- Tipos de retención superiores y deducciones limitadas.
- Aplicación de las reglas de transparencia fiscal internacional con menor umbral.
- Doble obligación reforzada en Modelos 720 y 232 cuando proceda.
- Riesgo reputacional añadido frente a bancos y pasarelas de pago.

### Intercambio automático de información: CRS y FATCA

El **CRS de la OCDE** (Common Reporting Standard) es activo en más de 110 jurisdicciones. España recibe cada año información de saldos, rentas y titularidad de cuentas en bancos firmantes. **FATCA** es el equivalente bilateral con EE. UU. Lo que esto significa en la práctica: una cuenta en Andorra, Suiza, Mónaco, Singapur, Emiratos o Bahamas se intercambia con la AEAT cada septiembre del año siguiente. Las jurisdicciones de la lista AEAT que no firman CRS (algunas islas pequeñas) no garantizan opacidad: lo único que cambia es que la opacidad es la única razón para estar allí, lo que facilita la sanción al detectarse.

### Cómo Exentax estructura legalmente sin entrar en estas categorías

Una **LLC en Estados Unidos** no figura en ninguna lista de jurisdicciones no cooperativas. Estados como Wyoming, Nuevo México, Delaware o Florida están plenamente integrados en FATCA bilateral, ofrecen protección de activos por estatuto, costes de mantenimiento razonables y un marco fiscal pass-through transparente. Combinada con una declaración limpia en tu país de residencia y una banca real (Mercury, Wise Business, Relay, Interactive Brokers), permite legalmente:

- Reducir cuotas y simplificar operativa internacional.
- Proteger activos vía Operating Agreement y series LLC en estados que lo permiten.
- Profesionalizar facturación y separar riesgos por línea de negocio.

> **¿Quieres saber si tu setup actual te expone a una de estas listas?** Pasa tu caso por la ${calc("es", "calculadora fiscal Exentax")} y vemos riesgo y alternativa legal.

Para entender el ecosistema completo y dónde encaja la LLC sigue con ${blogLink("es", "caminos-legales-minimos-impuestos", "los caminos legales para pagar el mínimo de impuestos")}, y si tu activo principal son cuentas o cripto fuera de España revisa ${blogLink("es", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "la guía Modelo 720 y 721")}. Para diseñar la estructura ${book("es", "agenda una sesión con Exentax")}.
`,
  en: `
## Tax havens in 2026: updated AEAT official list, EU and OECD non cooperative jurisdictions and automatic CRS / FATCA exchange

The phrase "tax haven" carries a lot of mythology. The 2026 regulatory reality is that three official lists coexist and an automatic information exchange system erodes most of the theoretical benefit of operating from these jurisdictions without real substance. This block tidies up the lists, summarises what data is exchanged and makes clear how Exentax helps structure legally without falling into those categories.

### The three coexisting lists

1. **Spanish list of non cooperative jurisdictions (Orden HFP/115/2023, BOE 10 February 2023)**, refined in 2024. It replaced RD 1080/1991 and introduced the qualitative criteria of article 16 of Ley 11/2021. In 2026 it covers, among others, Anguilla, Bahrain, Barbados, Bermuda, Dominica, Fiji, Gibraltar (partial), Guam, Mariana Islands, Solomon Islands, Turks and Caicos, BVI, US Virgin Islands, Jersey and Guernsey (partial), Lebanon, Macao, Mauritius, Palau, American Samoa, Samoa, Seychelles, Trinidad and Tobago, Vanuatu. Always verify the current list on the AEAT website.
2. **EU list of non cooperative jurisdictions (Annex I)**, updated by the ECOFIN Council twice a year, with its grey list (Annex II) of jurisdictions committed to reform.
3. **OECD / Global Forum list** on transparency and information exchange, which scores jurisdictions as "compliant", "largely compliant", "partially compliant" or "non-compliant".

### What happens when you operate from a jurisdiction in the AEAT list

- Reverse burden of proof in related party transactions.
- Higher withholding rates and capped deductions.
- International tax transparency rules apply with a lower threshold.
- Reinforced filings on Modelo 720 and Modelo 232 where applicable.
- Added reputational risk with banks and payment processors.

### Automatic information exchange: CRS and FATCA

The **OECD CRS** (Common Reporting Standard) is live in more than 110 jurisdictions. Spain receives data on balances, income and account ownership at signatory banks every year. **FATCA** is the bilateral equivalent with the United States. In practice, an account in Andorra, Switzerland, Monaco, Singapore, the UAE or the Bahamas is exchanged with AEAT every September of the following year. AEAT listed jurisdictions that do not sign CRS (some small islands) do not guarantee opacity: the only thing that changes is that opacity becomes the sole reason to be there, which makes any detection a sanction in waiting.

### How Exentax structures legally without entering these categories

A **US LLC** is not on any non cooperative jurisdiction list. States like Wyoming, New Mexico, Delaware or Florida are fully integrated into bilateral FATCA, offer statutory asset protection, reasonable maintenance costs and a transparent pass-through tax framework. Combined with a clean filing in your country of residence and real banking (Mercury, Wise Business, Relay, Interactive Brokers), it legally lets you:

- Lower contributions and simplify international operations.
- Protect assets via the Operating Agreement and series LLCs where state law allows it.
- Professionalise invoicing and separate risks by business line.

> **Want to check if your current setup exposes you to one of these lists?** Run your case through the ${calc("en", "Exentax tax calculator")} and we will assess risk and legal alternative.

To understand the broader ecosystem and where the LLC fits continue with ${blogLink("en", "caminos-legales-minimos-impuestos", "the legal paths to pay the minimum")}, and if your main asset is foreign accounts or crypto review ${blogLink("en", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "the Modelo 720 and 721 guide")}. To design the structure, ${book("en", "book a session with Exentax")}.
`,
  fr: `
## Paradis fiscaux en 2026: liste officielle AEAT, juridictions non coopératives UE/OCDE et échange automatique CRS/FATCA

L'expression "paradis fiscal" charrie beaucoup de mythologie. La réalité réglementaire 2026 est qu'il existe trois listes officielles qui coexistent et un système d'échange automatique d'information qui vide une grande partie du bénéfice théorique d'opérer depuis ces juridictions sans substance. Ce bloc remet de l'ordre dans les listes, résume ce qui s'échange et précise comment Exentax structure légalement sans tomber dans ces catégories.

### Les trois listes qui coexistent

1. **Liste espagnole des juridictions non coopératives (Orden HFP/115/2023, BOE du 10 février 2023)**, raffinée en 2024. Elle remplace le RD 1080/1991 et introduit les critères qualitatifs de l'article 16 de la Ley 11/2021. En 2026 elle inclut entre autres Anguilla, Bahreïn, Barbade, Bermudes, Dominique, Fidji, Gibraltar (partiel), Guam, Mariannes, Salomon, Turks et Caicos, BVI, Îles Vierges américaines, Jersey et Guernesey (partiel), Liban, Macao, Maurice, Palau, Samoa américaines, Samoa, Seychelles, Trinité-et-Tobago, Vanuatu. Toujours vérifier la liste en vigueur sur le site de l'AEAT.
2. **Liste de l'UE (Annexe I)**, mise à jour deux fois par an par le Conseil ECOFIN, avec sa liste grise (Annexe II).
3. **Liste OCDE / Forum mondial** sur la transparence et l'échange d'information, qui classe les juridictions en "compliant", "largely compliant", "partially compliant" ou "non-compliant".

### Conséquences d'opérer depuis une juridiction de la liste AEAT

- Inversion de la charge de la preuve dans les opérations entre parties liées.
- Retenues à la source plus élevées et déductions limitées.
- Application des règles de transparence fiscale internationale avec un seuil inférieur.
- Obligations renforcées dans les Modelos 720 et 232 quand applicable.
- Risque de réputation accru face aux banques et aux passerelles de paiement.

### Échange automatique d'information: CRS et FATCA

Le **CRS de l'OCDE** est actif dans plus de 110 juridictions. L'Espagne reçoit chaque année des informations sur les soldes, les revenus et la titularité des comptes dans les banques signataires. **FATCA** est l'équivalent bilatéral avec les États-Unis. Concrètement, un compte en Andorre, Suisse, Monaco, Singapour, EAU ou aux Bahamas est échangé avec l'AEAT chaque septembre. Les juridictions listées AEAT non signataires du CRS (certaines petites îles) ne garantissent pas l'opacité: la seule chose qui change est que l'opacité devient la seule raison d'y être, ce qui transforme toute détection en sanction.

### Comment Exentax structure légalement sans entrer dans ces catégories

Une **LLC américaine** ne figure dans aucune liste non coopérative. Les États du Wyoming, Nouveau-Mexique, Delaware ou Floride sont pleinement intégrés à FATCA bilatéral, offrent protection statutaire des actifs, coûts d'entretien raisonnables et un cadre fiscal pass-through transparent. Combinée à une déclaration propre dans le pays de résidence et à une banque réelle (Mercury, Wise Business, Relay, Interactive Brokers), elle permet légalement:

- Réduire les cotisations et simplifier l'opérationnel international.
- Protéger les actifs via Operating Agreement et series LLC dans les États qui l'autorisent.
- Professionnaliser la facturation et séparer les risques par ligne d'affaires.

> **Votre setup actuel vous expose-t-il à une de ces listes?** Passez votre cas dans le ${calc("fr", "calculateur fiscal Exentax")}.

Pour l'écosystème complet et la place de la LLC continuez avec ${blogLink("fr", "caminos-legales-minimos-impuestos", "les voies légales pour payer le minimum")}, et si votre actif principal est compte ou crypto à l'étranger consultez ${blogLink("fr", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "le guide Modelo 720 et 721")}. Pour dessiner la structure ${book("fr", "réservez un échange avec Exentax")}.
`,
  de: `
## Steueroasen 2026: aktualisierte offizielle AEAT-Liste, nicht kooperative EU- und OECD-Jurisdiktionen und automatischer CRS-/FATCA-Austausch

Der Begriff "Steueroase" trägt viel Mythologie mit sich. Die regulatorische Realität 2026 lautet: drei offizielle Listen koexistieren, und ein automatisches Informationsaustauschsystem entzieht einen Großteil des theoretischen Vorteils, ohne reale Substanz aus diesen Jurisdiktionen zu operieren. Dieser Block ordnet die Listen, fasst zusammen, was ausgetauscht wird, und zeigt, wie Exentax legal strukturiert, ohne in diese Kategorien zu fallen.

### Die drei koexistierenden Listen

1. **Spanische Liste nicht kooperativer Jurisdiktionen (Orden HFP/115/2023, BOE 10. Februar 2023)**, 2024 verfeinert. Sie ersetzte das RD 1080/1991 und führte die qualitativen Kriterien des Artikels 16 Ley 11/2021 ein. 2026 umfasst sie unter anderem Anguilla, Bahrain, Barbados, Bermudas, Dominica, Fidschi, Gibraltar (teilweise), Guam, Marianen, Salomonen, Turks und Caicos, BVI, US Virgin Islands, Jersey und Guernsey (teilweise), Libanon, Macau, Mauritius, Palau, Amerikanisch-Samoa, Samoa, Seychellen, Trinidad und Tobago, Vanuatu. Die geltende Liste stets auf der AEAT-Seite prüfen.
2. **EU-Liste (Annex I)**, vom ECOFIN-Rat zweimal jährlich aktualisiert, mit ihrer grauen Liste (Annex II).
3. **OECD-/Globales Forum**-Liste zu Transparenz und Informationsaustausch, die Jurisdiktionen als "compliant", "largely compliant", "partially compliant" oder "non-compliant" einstuft.

### Folgen, wenn Sie aus einer AEAT-gelisteten Jurisdiktion operieren

- Beweislastumkehr bei verbundenen Geschäften.
- Höhere Quellensteuersätze und begrenzte Abzüge.
- Internationale Steuertransparenzregeln greifen mit niedrigerer Schwelle.
- Verstärkte Pflichten in Modelo 720 und Modelo 232.
- Zusätzliches Reputationsrisiko gegenüber Banken und Zahlungsanbietern.

### Automatischer Informationsaustausch: CRS und FATCA

Der **OECD CRS** ist in über 110 Jurisdiktionen aktiv. Spanien erhält jedes Jahr Informationen zu Saldi, Erträgen und Eigentum von Konten bei unterzeichnenden Banken. **FATCA** ist das bilaterale Pendant mit den USA. In der Praxis wird ein Konto in Andorra, Schweiz, Monaco, Singapur, VAE oder Bahamas jeden September mit der AEAT ausgetauscht. AEAT-gelistete Jurisdiktionen ohne CRS (einige Kleinstaaten) garantieren keine Opazität: nur der Grund dort zu sein wird auf Verheimlichung reduziert, was jede Entdeckung zu einer Sanktion macht.

### Wie Exentax legal strukturiert, ohne in diese Kategorien zu fallen

Eine **US-LLC** steht auf keiner Liste nicht kooperativer Jurisdiktionen. Bundesstaaten wie Wyoming, New Mexico, Delaware oder Florida sind voll in FATCA bilateral integriert, bieten statutarischen Vermögensschutz, vertretbare Pflegekosten und einen transparenten Pass-through-Steuerrahmen. Kombiniert mit sauberer Deklaration im Wohnsitzland und realer Bankenstruktur (Mercury, Wise Business, Relay, Interactive Brokers) erlaubt sie legal:

- Beiträge senken und internationalen Betrieb vereinfachen.
- Vermögen über Operating Agreement und Series LLC in entsprechenden Staaten schützen.
- Fakturierung professionalisieren und Risiken nach Geschäftsfeld trennen.

> **Setzt Sie Ihr aktuelles Setup einer dieser Listen aus?** Lassen Sie Ihren Fall durch den ${calc("de", "Exentax-Steuerrechner")} laufen.

Für das ganze Ökosystem und die Rolle der LLC lesen Sie weiter in ${blogLink("de", "caminos-legales-minimos-impuestos", "den legalen Wegen zur Steuerminimierung")}, und wenn Ihr Hauptvermögen ausländische Konten oder Krypto sind, prüfen Sie ${blogLink("de", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "den Modelo-720-und-721-Leitfaden")}. Für das Strukturdesign ${book("de", "vereinbaren Sie ein Gespräch mit Exentax")}.
`,
  pt: `
## Paraísos fiscais em 2026: lista oficial AEAT atualizada, jurisdições não cooperativas UE/OCDE e troca automática CRS/FATCA

A expressão "paraíso fiscal" arrasta muita mitologia. A realidade regulatória 2026 é que existem três listas oficiais que coexistem e um sistema de troca automática de informação que esvazia grande parte do benefício teórico de operar a partir dessas jurisdições sem substância. Este bloco organiza as listas, resume o que se troca e clarifica como a Exentax estrutura legalmente sem cair nessas categorias.

### As três listas que coexistem

1. **Lista espanhola de jurisdições não cooperativas (Orden HFP/115/2023, BOE 10 de fevereiro de 2023)**, refinada em 2024. Substituiu o RD 1080/1991 e introduziu critérios qualitativos do artigo 16 da Ley 11/2021. Em 2026 inclui, entre outras, Anguila, Bahrein, Barbados, Bermudas, Domínica, Fiji, Gibraltar (parcial), Guam, Marianas, Salomão, Turcas e Caicos, BVI, Ilhas Virgens Americanas, Jersey e Guernsey (parcial), Líbano, Macau, Maurícia, Palau, Samoa Americana, Samoa, Seicheles, Trindade e Tobago, Vanuatu. Verificar sempre a lista vigente no site da AEAT.
2. **Lista da UE (Anexo I)**, atualizada pelo Conselho ECOFIN duas vezes por ano, com a sua lista cinzenta (Anexo II).
3. **Lista OCDE / Fórum Global** sobre transparência e troca de informação, que classifica as jurisdições em "compliant", "largely compliant", "partially compliant" ou "non-compliant".

### O que acontece se operar a partir de uma jurisdição da lista AEAT

- Inversão do ónus da prova nas operações vinculadas.
- Retenções mais altas e deduções limitadas.
- Regras de transparência fiscal internacional com limiar inferior.
- Obrigações reforçadas nos Modelos 720 e 232 quando aplicável.
- Risco reputacional acrescido perante bancos e gateways.

### Troca automática de informação: CRS e FATCA

O **CRS da OCDE** está ativo em mais de 110 jurisdições. Espanha recebe anualmente informação sobre saldos, rendimentos e titularidade de contas em bancos signatários. **FATCA** é o equivalente bilateral com os EUA. Na prática, uma conta em Andorra, Suíça, Mónaco, Singapura, EAU ou Bahamas é trocada com a AEAT em cada setembro do ano seguinte. As jurisdições da lista AEAT não signatárias do CRS (algumas pequenas ilhas) não garantem opacidade: o único motivo para lá estar é ocultar, o que transforma cada deteção em sanção.

### Como a Exentax estrutura legalmente sem entrar nessas categorias

Uma **LLC nos EUA** não consta de nenhuma lista não cooperativa. Estados como Wyoming, Novo México, Delaware ou Flórida estão totalmente integrados em FATCA bilateral, oferecem proteção patrimonial estatutária, custos de manutenção razoáveis e um quadro fiscal pass-through transparente. Em combinação com uma declaração limpa no país de residência e banca real (Mercury, Wise Business, Relay, Interactive Brokers), permite legalmente:

- Reduzir contribuições e simplificar a operação internacional.
- Proteger património via Operating Agreement e series LLC em estados que o admitem.
- Profissionalizar a faturação e separar riscos por linha de negócio.

> **Quer saber se o seu setup atual o expõe a alguma destas listas?** Passe o caso pela ${calc("pt", "calculadora fiscal da Exentax")}.

Para o ecossistema completo e o lugar da LLC continue com ${blogLink("pt", "caminos-legales-minimos-impuestos", "os caminhos legais para pagar o mínimo")}, e se o ativo principal são contas ou cripto fora do país consulte ${blogLink("pt", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "o guia Modelo 720 e 721")}. Para desenhar a estrutura ${book("pt", "agende uma sessão com a Exentax")}.
`,
  ca: `
## Paradisos fiscals el 2026: llista oficial AEAT actualitzada, jurisdiccions no cooperatives UE/OCDE i intercanvi automàtic CRS/FATCA

L'expressió "paradís fiscal" arrossega molta mitologia. La realitat regulatòria 2026 és que existeixen tres llistes oficials que coexisteixen i un sistema d'intercanvi automàtic d'informació que buida bona part del benefici teòric d'operar des d'aquestes jurisdiccions sense substància. Aquest bloc ordena les llistes, resumeix què s'intercanvia i clarifica com Exentax estructura legalment sense caure en aquestes categories.

### Les tres llistes que coexisteixen

1. **Llista espanyola de jurisdiccions no cooperatives (Orden HFP/115/2023, BOE 10 de febrer de 2023)**, refinada el 2024. Va substituir el RD 1080/1991 i va introduir els criteris qualitatius de l'article 16 de la Llei 11/2021. El 2026 inclou, entre d'altres, Anguilla, Bahrain, Barbados, Bermudes, Dominica, Fiji, Gibraltar (parcial), Guam, Marianes, Salomó, Turks i Caicos, BVI, Illes Verges Americanes, Jersey i Guernsey (parcial), Líban, Macau, Maurici, Palau, Samoa Americana, Samoa, Seychelles, Trinitat i Tobago, Vanuatu. Verificar sempre el llistat vigent al web de l'AEAT.
2. **Llista de la UE (Annex I)**, actualitzada pel Consell ECOFIN dues vegades l'any, amb la seva llista grisa (Annex II).
3. **Llista OCDE / Fòrum Global** sobre transparència i intercanvi d'informació, que classifica les jurisdiccions com a "compliant", "largely compliant", "partially compliant" o "non-compliant".

### Què passa si operes des d'una jurisdicció de la llista AEAT

- Inversió de la càrrega de la prova en operacions vinculades.
- Retencions més altes i deduccions limitades.
- Regles de transparència fiscal internacional amb llindar inferior.
- Obligacions reforçades als Models 720 i 232 quan correspongui.
- Risc reputacional davant de bancs i passarel·les de pagament.

### Intercanvi automàtic d'informació: CRS i FATCA

El **CRS de l'OCDE** és actiu en més de 110 jurisdiccions. Espanya rep cada any informació sobre saldos, rendes i titularitat de comptes en bancs signants. **FATCA** és l'equivalent bilateral amb els EUA. A la pràctica, un compte a Andorra, Suïssa, Mònaco, Singapur, EAU o Bahames s'intercanvia amb l'AEAT cada setembre. Les jurisdiccions llistades AEAT que no signen CRS (algunes illes petites) no garanteixen opacitat: l'única raó d'estar-hi és amagar, i això converteix qualsevol detecció en sanció.

### Com Exentax estructura legalment sense entrar en aquestes categories

Una **LLC als EUA** no figura a cap llista no cooperativa. Estats com Wyoming, Nou Mèxic, Delaware o Florida estan plenament integrats a FATCA bilateral, ofereixen protecció patrimonial estatutària, costos de manteniment raonables i un marc fiscal pass-through transparent. Combinada amb una declaració neta al país de residència i banca real (Mercury, Wise Business, Relay, Interactive Brokers), permet legalment:

- Reduir cotitzacions i simplificar l'operació internacional.
- Protegir patrimoni via Operating Agreement i series LLC en estats que ho admeten.
- Professionalitzar la facturació i separar riscos per línia de negoci.

> **El teu setup actual t'exposa a alguna d'aquestes llistes?** Passa el cas per la ${calc("ca", "calculadora fiscal d'Exentax")}.

Per a l'ecosistema complet i el lloc de la LLC continua amb ${blogLink("ca", "caminos-legales-minimos-impuestos", "els camins legals per pagar el mínim")}, i si l'actiu principal són comptes o cripto fora del país consulta ${blogLink("ca", "modelo-720-721-residentes-espana-cuentas-cripto-extranjero", "la guia Model 720 i 721")}. Per dissenyar l'estructura ${book("ca", "reserva una sessió amb Exentax")}.
`,
};

// 7) nomada-digital-residencia-fiscal → "Nómada digital: estrategia legal 2026, visados, regla 183 días, LLC, top países por perfil"
BLOCKS["nomada-digital-residencia-fiscal"] = {
  es: `
## Nómada digital 2026: estrategia legal para pagar menos impuestos viajando, visados de nómada digital, regla de los 183 días y LLC como vehículo

Más allá de la teoría general de residencia fiscal, este bloque traduce la decisión a una estrategia operativa para 2026: qué visados existen, cómo encaja la regla de los 183 días, dónde tiene sentido domiciliar la LLC y qué top países encajan según tu perfil real.

### Tabla de visados de nómada digital vigentes en 2026

| País | Visado | Duración | Requisito de ingresos mensuales | Tributación |
|---|---|---|---|---|
| España | Visa de Teletrabajo Internacional (Ley 28/2022) | 1 año, renovable hasta 5 | Aprox. 200 % SMI mensual (~2.762 EUR/mes 2025) | Acceso al régimen Beckham al 24 % hasta 600.000 EUR |
| Portugal | Digital Nomad Visa (D8) | 1 año, renovable hasta 5 | 4 veces el salario mínimo (~3.280 EUR/mes 2025) | NHR 2.0 limitado a perfiles científicos / I+D desde 2024 |
| Estonia | Digital Nomad Visa | 1 año | 4.500 EUR/mes brutos | Tributación territorial al residir; OÜ con Distributed Profit Tax al 22 % |
| Croacia | Digital Nomad Permit | 1 año | 2.870 EUR/mes | Exención de IRPF sobre ingresos extranjeros bajo el permiso |
| Italia | Visto per Nomadi Digitali | 1 año, renovable | 28.000 EUR anuales y seguro médico | Régimen impatriados al 50 % o 60 % según condiciones |
| Emiratos Árabes | Virtual Working Programme | 1 año, renovable | 3.500 USD/mes | 0 % IRPF, 9 % Corporate Tax sobre beneficios > 375.000 AED |
| Georgia | Remotely from Georgia | 1 año | 2.000 USD/mes | Régimen Small Business Status al 1 % hasta 500.000 GEL |
| México | Visa de Residente Temporal | 1 año, renovable hasta 4 | Ingresos demostrables mensuales | Residencia fiscal según artículo 9 CFF |
| Costa Rica | Rentista / Nómada | 2 años, renovable | 2.500-3.000 USD/mes | Sistema territorial: rentas extranjeras exentas |

### Regla de los 183 días, centro de intereses y de actividades económicas

La regla básica del artículo 9 LIRPF en España, replicada con matices en el resto de jurisdicciones, da residencia fiscal cuando: a) permaneces más de 183 días en el año natural en el país, b) tu base económica principal está allí, o c) tu cónyuge no separado y tus hijos menores residen allí. **Cumplir un solo criterio basta**. Para perder la residencia española hay que demostrar de forma proactiva la pérdida de los tres puntos, idealmente con certificado de residencia fiscal del país de destino.

### Donde domiciliar la LLC sigue siendo neutral

Constituir la LLC en Wyoming, Nuevo México, Delaware o Florida no afecta tu residencia fiscal. Lo que importa es **dónde resides** y desde dónde gestionas. La LLC pass-through atribuye el resultado al socio en su país de residencia. La elección del estado responde a costes anuales, privacidad pública del registro y protección de activos por estatuto.

### Top países por perfil

- **Freelance digital con clientes globales y deseo de quedarse en Europa**: Portugal con D8 más LLC, o España con visa de teletrabajador y Beckham.
- **Trader o inversor**: Emiratos con Free Zone alineada al perfil, o Georgia para activos pequeños y bajo coste de vida.
- **SaaS o e-commerce con equipo distribuido**: Estonia para sede operativa con OÜ y, en paralelo, LLC en EE. UU. para banca y pasarelas.
- **Familia con escolarización y servicios públicos**: Italia con régimen impatriados y LLC para clientes internacionales.
- **Mochilero serial sin base fija**: arriesgado, conviene fijar residencia en un país territorial (Paraguay, Costa Rica, Panamá) y declararlo formalmente para evitar dos hogares fiscales en disputa.

> **¿Cuál es tu mejor combinación país + LLC con tu facturación?** Calcula el ahorro neto en la ${calc("es", "calculadora fiscal Exentax")}.

Para no entrar en zonas grises sigue con ${blogLink("es", "estructura-offshore-beneficios-riesgos", "la guía de paraísos fiscales y jurisdicciones no cooperativas 2026")}, y si tu plan es quedarte en España aprovechando palancas legales revisa ${blogLink("es", "caminos-legales-minimos-impuestos", "los caminos legales para minimizar impuestos")}. Para diseñar tu setup ${book("es", "agenda una sesión con Exentax")}.
`,
  en: `
## Digital nomad 2026: legal strategy to pay less tax while travelling, digital nomad visas, 183 day rule and LLC as a vehicle

Beyond general residency theory, this block turns the decision into an operational strategy for 2026: which visas exist, how the 183 day rule works, where to domicile the LLC and which top countries fit which profile.

### Digital nomad visa table for 2026

| Country | Visa | Duration | Monthly income requirement | Taxation |
|---|---|---|---|---|
| Spain | International Teleworking Visa (Ley 28/2022) | 1 year, renewable up to 5 | About 200 % SMI (~EUR 2,762 / month 2025) | Beckham regime access at 24 % up to EUR 600,000 |
| Portugal | Digital Nomad Visa (D8) | 1 year, renewable up to 5 | 4x minimum wage (~EUR 3,280 / month 2025) | NHR 2.0 limited to research / R&D profiles from 2024 |
| Estonia | Digital Nomad Visa | 1 year | EUR 4,500 / month gross | Territorial taxation when resident; OÜ with Distributed Profit Tax 22 % |
| Croatia | Digital Nomad Permit | 1 year | EUR 2,870 / month | Income tax exemption on foreign income under the permit |
| Italy | Visto per Nomadi Digitali | 1 year, renewable | EUR 28,000 / year plus health insurance | Inbound regime at 50 % or 60 % depending on conditions |
| United Arab Emirates | Virtual Working Programme | 1 year, renewable | USD 3,500 / month | 0 % income tax, 9 % Corporate Tax on profits > AED 375,000 |
| Georgia | Remotely from Georgia | 1 year | USD 2,000 / month | Small Business Status at 1 % up to GEL 500,000 |
| Mexico | Temporary Resident Visa | 1 year, renewable up to 4 | Provable monthly income | Tax residency under article 9 CFF |
| Costa Rica | Rentista / Nomada | 2 years, renewable | USD 2,500-3,000 / month | Territorial: foreign income exempt |

### 183 day rule, centre of interests and economic activity

The basic rule in article 9 LIRPF in Spain, mirrored elsewhere with nuances, makes you tax resident when: a) you spend more than 183 days a calendar year in the country, b) your main economic base is there, or c) your spouse and minor children live there. **A single criterion is enough**. To lose Spanish residency you must prove all three are gone, ideally with a tax residency certificate from the destination country.

### Where to domicile the LLC remains neutral

Setting the LLC in Wyoming, New Mexico, Delaware or Florida does not change your tax residency. What matters is **where you live** and from where you manage. A pass-through LLC attributes the result to the partner in their country of residence. State choice answers annual costs, public registry privacy and statutory asset protection.

### Top countries by profile

- **Digital freelancer with global clients who wants to stay in Europe**: Portugal with D8 plus LLC, or Spain with the teleworking visa and Beckham.
- **Trader or investor**: UAE with a Free Zone aligned with the profile, or Georgia for small assets and low cost of living.
- **SaaS or e-commerce with distributed team**: Estonia for operating seat with OÜ and US LLC for banking and gateways.
- **Family with schooling and public services**: Italy with inbound regime and LLC for international clients.
- **Serial backpacker with no fixed base**: risky, set residency in a territorial country (Paraguay, Costa Rica, Panama) and formalise it to avoid two competing tax homes.

> **What is your best country plus LLC combination at your revenue?** Calculate net savings in the ${calc("en", "Exentax tax calculator")}.

To stay out of grey zones continue with ${blogLink("en", "estructura-offshore-beneficios-riesgos", "the 2026 tax havens and non cooperative jurisdictions guide")}, and if your plan is to stay in Spain using legal levers review ${blogLink("en", "caminos-legales-minimos-impuestos", "the legal paths to minimise taxes")}. To design your setup, ${book("en", "book a session with Exentax")}.
`,
  fr: `
## Nomade numérique 2026: stratégie légale pour payer moins d'impôts en voyageant, visas, règle des 183 jours et LLC comme véhicule

Au-delà de la théorie générale de résidence fiscale, ce bloc traduit la décision en stratégie opérationnelle 2026: quels visas existent, comment fonctionne la règle des 183 jours, où domicilier la LLC et quels pays correspondent à quel profil.

### Tableau des visas de nomade numérique en 2026

| Pays | Visa | Durée | Revenu mensuel exigé | Fiscalité |
|---|---|---|---|---|
| Espagne | Visa de télétravail international (Ley 28/2022) | 1 an, renouvelable jusqu'à 5 | Environ 200 % du SMI (~2 762 EUR/mois 2025) | Accès régime Beckham à 24 % jusqu'à 600 000 EUR |
| Portugal | Digital Nomad Visa (D8) | 1 an, renouvelable jusqu'à 5 | 4 fois le SMIC (~3 280 EUR/mois 2025) | NHR 2.0 limité aux profils R&D depuis 2024 |
| Estonie | Digital Nomad Visa | 1 an | 4 500 EUR/mois bruts | Imposition territoriale en résident; OÜ avec Distributed Profit Tax 22 % |
| Croatie | Digital Nomad Permit | 1 an | 2 870 EUR/mois | Exonération d'IR sur revenus étrangers sous le permis |
| Italie | Visto per Nomadi Digitali | 1 an, renouvelable | 28 000 EUR/an et assurance santé | Régime impatriés à 50 % ou 60 % selon conditions |
| Émirats Arabes Unis | Virtual Working Programme | 1 an, renouvelable | 3 500 USD/mois | 0 % IR, 9 % CT sur bénéfices > 375 000 AED |
| Géorgie | Remotely from Georgia | 1 an | 2 000 USD/mois | Small Business Status à 1 % jusqu'à 500 000 GEL |
| Mexique | Visa de Résident Temporaire | 1 an, renouvelable jusqu'à 4 | Revenus mensuels prouvés | Résidence fiscale selon article 9 CFF |
| Costa Rica | Rentista / Nomade | 2 ans, renouvelable | 2 500-3 000 USD/mois | Territorial: revenus étrangers exonérés |

### Règle des 183 jours, centre des intérêts et de l'activité économique

La règle de base de l'article 9 LIRPF en Espagne, répliquée ailleurs avec nuances, donne la résidence fiscale quand: a) vous passez plus de 183 jours par an dans le pays, b) votre base économique principale y est, c) votre conjoint et enfants mineurs y résident. **Un seul critère suffit**. Pour perdre la résidence espagnole il faut prouver activement la perte des trois, idéalement avec un certificat de résidence fiscale du pays de destination.

### Domicilier la LLC reste neutre

Constituer la LLC au Wyoming, Nouveau-Mexique, Delaware ou Floride n'affecte pas votre résidence fiscale. Ce qui compte est **où vous résidez** et d'où vous gérez. La LLC pass-through attribue le résultat à l'associé dans son pays de résidence. Le choix de l'État répond à coûts annuels, confidentialité du registre public et protection statutaire des actifs.

### Top pays par profil

- **Freelance numérique clients mondiaux et envie de rester en Europe**: Portugal avec D8 plus LLC, ou Espagne avec visa télétravailleur et Beckham.
- **Trader ou investisseur**: ÉAU avec Free Zone adaptée, ou Géorgie pour patrimoine modeste et coût de vie faible.
- **SaaS ou e-commerce avec équipe distribuée**: Estonie pour siège opérationnel avec OÜ et LLC US pour banque et passerelles.
- **Famille avec scolarisation et services publics**: Italie avec régime impatriés et LLC pour clients internationaux.
- **Backpacker permanent sans base**: risqué, mieux vaut fixer la résidence dans un pays territorial (Paraguay, Costa Rica, Panama) et la formaliser pour éviter deux foyers fiscaux concurrents.

> **Quelle est votre meilleure combinaison pays plus LLC à votre niveau de CA?** Calculez l'économie nette dans le ${calc("fr", "calculateur fiscal Exentax")}.

Pour rester hors des zones grises continuez avec ${blogLink("fr", "estructura-offshore-beneficios-riesgos", "le guide paradis fiscaux et juridictions non coopératives 2026")}, et si vous restez en Espagne en exploitant des leviers légaux relisez ${blogLink("fr", "caminos-legales-minimos-impuestos", "les voies légales pour minimiser les impôts")}. Pour dessiner le setup ${book("fr", "réservez un échange avec Exentax")}.
`,
  de: `
## Digitaler Nomade 2026: legale Strategie für weniger Steuern beim Reisen, Digital-Nomad-Visa, 183-Tage-Regel und LLC als Vehikel

Jenseits der allgemeinen Residenztheorie macht dieser Block aus der Entscheidung eine operative Strategie für 2026: welche Visa es gibt, wie die 183-Tage-Regel wirkt, wo die LLC zu domizilieren ist und welche Länder welchem Profil entsprechen.

### Tabelle der Digital-Nomad-Visa für 2026

| Land | Visum | Dauer | Mindesteinkommen monatlich | Besteuerung |
|---|---|---|---|---|
| Spanien | International Teleworking Visa (Ley 28/2022) | 1 Jahr, verlängerbar bis 5 | Rund 200 % SMI (~2.762 EUR/Monat 2025) | Beckham-Zugang 24 % bis 600.000 EUR |
| Portugal | Digital Nomad Visa (D8) | 1 Jahr, verlängerbar bis 5 | 4-facher Mindestlohn (~3.280 EUR/Monat 2025) | NHR 2.0 seit 2024 auf F&E-Profile begrenzt |
| Estland | Digital Nomad Visa | 1 Jahr | 4.500 EUR/Monat brutto | Territoriale Besteuerung als Resident; OÜ mit Distributed Profit Tax 22 % |
| Kroatien | Digital Nomad Permit | 1 Jahr | 2.870 EUR/Monat | Befreiung von der Einkommensteuer auf ausländische Einkünfte unter dem Permit |
| Italien | Visto per Nomadi Digitali | 1 Jahr, verlängerbar | 28.000 EUR/Jahr und Krankenversicherung | Inbound-Regime 50 % oder 60 % je nach Bedingungen |
| VAE | Virtual Working Programme | 1 Jahr, verlängerbar | 3.500 USD/Monat | 0 % Einkommensteuer, 9 % Corporate Tax über 375.000 AED |
| Georgien | Remotely from Georgia | 1 Jahr | 2.000 USD/Monat | Small Business Status 1 % bis 500.000 GEL |
| Mexiko | Temporary Resident Visa | 1 Jahr, verlängerbar bis 4 | Belegte Monatseinkünfte | Steueransässigkeit gem. Art. 9 CFF |
| Costa Rica | Rentista / Nómada | 2 Jahre, verlängerbar | 2.500-3.000 USD/Monat | Territorial: ausländische Einkünfte steuerfrei |

### 183-Tage-Regel, Zentrum der Interessen und der wirtschaftlichen Aktivität

Die Grundregel des Art. 9 LIRPF in Spanien, andernorts mit Nuancen gespiegelt, begründet die Steueransässigkeit, wenn: a) Sie mehr als 183 Tage pro Kalenderjahr im Land verbringen, b) dort die wesentliche wirtschaftliche Basis liegt, c) Ehegatte und minderjährige Kinder dort wohnen. **Ein einziges Kriterium genügt**. Für den Verlust der spanischen Residenz müssen aktiv alle drei widerlegt werden, idealerweise mit Ansässigkeitsbescheinigung des Zielstaats.

### Die Domizilierung der LLC bleibt neutral

Wyoming, New Mexico, Delaware oder Florida für die LLC zu wählen verändert Ihre Steueransässigkeit nicht. Entscheidend ist, **wo Sie wohnen** und von wo aus Sie führen. Die Pass-through-LLC weist das Ergebnis dem Gesellschafter in seinem Wohnsitzland zu. Die Staatswahl folgt Pflegekosten, Privatsphäre des öffentlichen Registers und gesetzlichem Vermögensschutz.

### Top-Länder nach Profil

- **Digital freelance mit globalen Kunden und Wunsch in Europa zu bleiben**: Portugal mit D8 plus LLC oder Spanien mit Teleworking-Visum und Beckham.
- **Trader oder Investor**: VAE mit passender Free Zone oder Georgien bei kleinem Vermögen und niedrigen Lebenshaltungskosten.
- **SaaS oder E-Commerce mit verteiltem Team**: Estland als operativer Sitz mit OÜ plus US-LLC für Banken und Gateways.
- **Familie mit Schulen und öffentlichen Diensten**: Italien mit Inbound-Regime und LLC für internationale Kunden.
- **Daueraussteiger ohne feste Basis**: riskant, Residenz in einem territorialen Land (Paraguay, Costa Rica, Panama) festsetzen und formalisieren, um zwei konkurrierende Steuerheime zu vermeiden.

> **Welche Kombination aus Land und LLC passt zu Ihrem Umsatz?** Rechnen Sie die Nettoeinsparung im ${calc("de", "Exentax-Steuerrechner")} aus.

Um Grauzonen zu meiden lesen Sie weiter in ${blogLink("de", "estructura-offshore-beneficios-riesgos", "dem Steueroasen-Leitfaden 2026")}, und wenn Sie in Spanien bleiben und legale Hebel nutzen wollen prüfen Sie ${blogLink("de", "caminos-legales-minimos-impuestos", "die legalen Wege zur Steuerminimierung")}. Für Ihr Setup ${book("de", "vereinbaren Sie ein Gespräch mit Exentax")}.
`,
  pt: `
## Nómada digital 2026: estratégia legal para pagar menos impostos a viajar, vistos de nómada digital, regra dos 183 dias e LLC como veículo

Para além da teoria geral de residência fiscal, este bloco traduz a decisão numa estratégia operacional para 2026: que vistos existem, como funciona a regra dos 183 dias, onde domiciliar a LLC e que países encaixam em cada perfil.

### Tabela de vistos de nómada digital em 2026

| País | Visto | Duração | Rendimento mensal exigido | Tributação |
|---|---|---|---|---|
| Espanha | Visto de Teletrabalho Internacional (Ley 28/2022) | 1 ano, renovável até 5 | Cerca de 200 % SMI (~2.762 EUR/mês 2025) | Acesso ao regime Beckham a 24 % até 600.000 EUR |
| Portugal | Visto de Nómada Digital (D8) | 1 ano, renovável até 5 | 4x salário mínimo (~3.280 EUR/mês 2025) | NHR 2.0 limitado a perfis I&D desde 2024 |
| Estónia | Digital Nomad Visa | 1 ano | 4.500 EUR/mês brutos | Tributação territorial como residente; OÜ com Distributed Profit Tax 22 % |
| Croácia | Digital Nomad Permit | 1 ano | 2.870 EUR/mês | Isenção de IR sobre rendimentos estrangeiros ao abrigo do permit |
| Itália | Visto per Nomadi Digitali | 1 ano, renovável | 28.000 EUR/ano e seguro de saúde | Regime impatriados a 50 % ou 60 % conforme condições |
| EAU | Virtual Working Programme | 1 ano, renovável | 3.500 USD/mês | 0 % IR, 9 % Corporate Tax sobre lucros > 375.000 AED |
| Geórgia | Remotely from Georgia | 1 ano | 2.000 USD/mês | Small Business Status a 1 % até 500.000 GEL |
| México | Visa de Residente Temporal | 1 ano, renovável até 4 | Rendimentos mensais comprovados | Residência fiscal segundo artigo 9 CFF |
| Costa Rica | Rentista / Nómada | 2 anos, renovável | 2.500-3.000 USD/mês | Territorial: rendimentos estrangeiros isentos |

### Regra dos 183 dias, centro de interesses e de atividade económica

A regra básica do artigo 9 LIRPF em Espanha, replicada noutros países com nuances, atribui residência fiscal quando: a) permanece mais de 183 dias por ano no país, b) a sua base económica principal está aí, c) cônjuge e filhos menores residem aí. **Um único critério basta**. Para perder a residência espanhola é preciso provar de forma proativa a perda dos três, idealmente com certificado de residência fiscal do país de destino.

### Onde domiciliar a LLC continua neutro

Constituir a LLC no Wyoming, Novo México, Delaware ou Flórida não afeta a sua residência fiscal. O que importa é **onde reside** e de onde gere. A LLC pass-through atribui o resultado ao sócio no seu país de residência. A escolha do estado responde a custos anuais, privacidade do registo público e proteção patrimonial estatutária.

### Top países por perfil

- **Freelance digital com clientes globais que quer ficar na Europa**: Portugal com D8 mais LLC, ou Espanha com visto de teletrabalho e Beckham.
- **Trader ou investidor**: EAU com Free Zone alinhada, ou Geórgia para património pequeno e custo de vida baixo.
- **SaaS ou e-commerce com equipa distribuída**: Estónia como sede operacional com OÜ e LLC dos EUA para banca e gateways.
- **Família com escolarização e serviços públicos**: Itália com regime impatriados e LLC para clientes internacionais.
- **Mochileiro permanente sem base**: arriscado, fixar residência num país territorial (Paraguai, Costa Rica, Panamá) e formalizá-la para evitar dois lares fiscais em disputa.

> **Qual a sua melhor combinação país mais LLC à sua faturação?** Calcule a poupança líquida na ${calc("pt", "calculadora fiscal da Exentax")}.

Para se manter fora de zonas cinzentas continue com ${blogLink("pt", "estructura-offshore-beneficios-riesgos", "o guia paraísos fiscais 2026")}, e se o plano é ficar em Espanha aproveitando alavancas legais reveja ${blogLink("pt", "caminos-legales-minimos-impuestos", "os caminhos legais para minimizar impostos")}. Para desenhar o setup ${book("pt", "agende uma sessão com a Exentax")}.
`,
  ca: `
## Nòmada digital 2026: estratègia legal per pagar menys impostos viatjant, visats, regla dels 183 dies i LLC com a vehicle

Més enllà de la teoria general de residència fiscal, aquest bloc tradueix la decisió en una estratègia operativa per al 2026: quins visats existeixen, com funciona la regla dels 183 dies, on domiciliar la LLC i quins països encaixen amb cada perfil.

### Taula de visats de nòmada digital el 2026

| País | Visat | Durada | Ingressos mensuals requerits | Tributació |
|---|---|---|---|---|
| Espanya | Visat de Teletreball Internacional (Llei 28/2022) | 1 any, renovable fins a 5 | Aproximadament 200 % SMI (~2.762 EUR/mes 2025) | Accés al règim Beckham al 24 % fins a 600.000 EUR |
| Portugal | Digital Nomad Visa (D8) | 1 any, renovable fins a 5 | 4x salari mínim (~3.280 EUR/mes 2025) | NHR 2.0 limitat a perfils R+D des del 2024 |
| Estònia | Digital Nomad Visa | 1 any | 4.500 EUR/mes bruts | Tributació territorial com a resident; OÜ amb Distributed Profit Tax 22 % |
| Croàcia | Digital Nomad Permit | 1 any | 2.870 EUR/mes | Exempció d'IR sobre ingressos estrangers sota el permís |
| Itàlia | Visto per Nomadi Digitali | 1 any, renovable | 28.000 EUR/any i assegurança de salut | Règim impatriats al 50 % o 60 % segons condicions |
| EAU | Virtual Working Programme | 1 any, renovable | 3.500 USD/mes | 0 % IR, 9 % Corporate Tax sobre beneficis > 375.000 AED |
| Geòrgia | Remotely from Georgia | 1 any | 2.000 USD/mes | Small Business Status a l'1 % fins a 500.000 GEL |
| Mèxic | Visa de Resident Temporal | 1 any, renovable fins a 4 | Ingressos mensuals demostrables | Residència fiscal segons article 9 CFF |
| Costa Rica | Rentista / Nòmada | 2 anys, renovable | 2.500-3.000 USD/mes | Territorial: rendes estrangeres exemptes |

### Regla dels 183 dies, centre d'interessos i d'activitat econòmica

La regla bàsica de l'article 9 LIRPF a Espanya, replicada amb matisos en altres jurisdiccions, atribueix residència fiscal quan: a) romans més de 183 dies l'any al país, b) la teva base econòmica principal és allí, c) cònjuge i fills menors hi resideixen. **Un sol criteri en té prou**. Per perdre la residència espanyola cal demostrar proactivament la pèrdua dels tres, idealment amb certificat de residència fiscal del país de destí.

### Domiciliar la LLC continua sent neutre

Constituir la LLC al Wyoming, Nou Mèxic, Delaware o Florida no afecta la teva residència fiscal. El que importa és **on resideixes** i des d'on gestiones. La LLC pass-through atribueix el resultat al soci al seu país de residència. La tria d'estat respon a costos anuals, privacitat del registre públic i protecció patrimonial estatutària.

### Top països per perfil

- **Freelance digital amb clients globals que vol quedar-se a Europa**: Portugal amb D8 més LLC, o Espanya amb visat de teletreball i Beckham.
- **Trader o inversor**: EAU amb Free Zone alineada, o Geòrgia per a patrimoni petit i cost de vida baix.
- **SaaS o e-commerce amb equip distribuït**: Estònia com a seu operativa amb OÜ i LLC dels EUA per a banca i passarel·les.
- **Família amb escolarització i serveis públics**: Itàlia amb règim impatriats i LLC per a clients internacionals.
- **Motxiller permanent sense base**: arriscat, fixar residència en un país territorial (Paraguai, Costa Rica, Panamà) i formalitzar-la per evitar dos llars fiscals en disputa.

> **Quina és la teva millor combinació país més LLC amb la teva facturació?** Calcula l'estalvi net a la ${calc("ca", "calculadora fiscal d'Exentax")}.

Per quedar-te fora de zones grises continua amb ${blogLink("ca", "estructura-offshore-beneficios-riesgos", "la guia de paradisos fiscals 2026")}, i si el pla és quedar-te a Espanya aprofitant palanques legals revisa ${blogLink("ca", "caminos-legales-minimos-impuestos", "els camins legals per minimitzar impostos")}. Per dissenyar el setup ${book("ca", "reserva una sessió amb Exentax")}.
`,
};

// ---------------------------------------------------------------------------
// Insert blocks into each article
// ---------------------------------------------------------------------------
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
let touched = 0, skipped = 0;

for (const slug of Object.keys(BLOCKS)) {
  for (const lang of LANGS) {
    const file = resolve(CONTENT, lang, `${slug}.ts`);
    const before = readFileSync(file, "utf8");
    if (before.includes(MARKER)) { skipped++; continue; }
    const block = BLOCKS[slug][lang];
    if (!block) throw new Error(`Missing block for ${slug}/${lang}`);
    // Insert before the closing backtick + ; pattern that ends the file.
    // Match the final `\n`; on its own line near EOF.
    const m = before.match(/\n`;\s*$/);
    if (!m) throw new Error(`Cannot find closing backtick in ${file}`);
    const insertion = `\n${MARKER}\n${block.trim()}\n`;
    const after = before.replace(/\n`;\s*$/, `${insertion}\n\`;\n`);
    writeFileSync(file, after);
    touched++;
  }
}

// ---------------------------------------------------------------------------
// Bump updatedAt to 2026-04-21 in blog-posts.ts for the 7 slugs
// ---------------------------------------------------------------------------
let posts = readFileSync(POSTS, "utf8");
const NEW_DATE = "2026-04-21";
for (const slug of Object.keys(BLOCKS)) {
  // Locate the entry block by `slug: "<slug>"`, then replace the next
  // `updatedAt: "..."` line within ~30 lines.
  const re = new RegExp(`(slug:\\s*"${slug}"[\\s\\S]{0,1500}?updatedAt:\\s*")(\\d{4}-\\d{2}-\\d{2})(")`, "m");
  if (!re.test(posts)) {
    console.warn(`[warn] no updatedAt match for ${slug}`);
    continue;
  }
  posts = posts.replace(re, `$1${NEW_DATE}$3`);
}
writeFileSync(POSTS, posts);

console.log(`Done. Files touched: ${touched}, skipped (already expanded): ${skipped}`);
