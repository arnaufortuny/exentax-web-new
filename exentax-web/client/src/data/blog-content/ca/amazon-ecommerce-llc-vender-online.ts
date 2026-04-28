export default `Vendre a Amazon, Shopify o Etsy des de Catalunya sol ser un circuit d'obstacles: comptes de venedor limitats, retencions en dòlars, IVA intracomunitari i IRPF amb el tram autonòmic per sobre. Amb una LLC americana canvies de categoria: compte en USD, Stripe sense fricció i una marca amb cara dels EUA.

## Per què una LLC per a ecommerce?

### Accés sense restriccions a Amazon US
Amazon Seller Central US és el marketplace més gran del món. Amb una LLC americana, pots registrar-te com a venedor professional sense les limitacions que tenen els comptes de venedors internacionals.

### Compte bancari en dòlars
Les plataformes d'ecommerce dipositen els teus guanys al teu compte bancari. Amb una LLC, reps els fons directament a Mercury en dòlars, sense intermediaris, sense retencions i sense conversions forçades.

### Credibilitat davant el client
Vendre des d'una empresa americana genera confiança. Els clients als EUA veuen una empresa local, no un venedor internacional.
### Amazon FBA amb la teva LLC

**Fulfillment by Amazon (FBA)** et permet enviar el teu inventari als magatzems d'Amazon. Ells s'encarreguen de l'emmagatzematge, l'enviament i les devolucions.

Per registrar-te a Amazon FBA necessites:

- **LLC constituïda** amb Articles of Organization
- **EIN** de la LLC
- **Compte bancari US** (Mercury)
- **Targeta de crèdit/dèbit** per a les fees d'Amazon
- **Passaport** del propietari
- **Adreça** (Registered Agent o adreça comercial)
### Shopify amb la teva LLC

Shopify és la plataforma d'ecommerce més popular per a botigues pròpies. Amb la teva LLC pots:

- Crear la teva botiga online sense restriccions
- Connectar **Shopify Payments** (powered by Stripe) per a cobraments directes
- Rebre els fons al teu compte Mercury
- Vendre en múltiples monedes
### Obligacions fiscals de l'ecommerce amb LLC

Si vens productes físics als EUA, hi ha un tema fiscal addicional: el **Sales Tax** (impost sobre vendes). Aquest impost:

- És estatal (cada estat té les seves pròpies taxes)
- S'aplica si tens "nexus" (presència econòmica significativa) en un estat
- Amazon el recapta automàticament a la majoria d'estats per a venedors FBA

Per a productes digitals venuts a clients fora dels EUA, la LLC generalment no cobra sales tax.
### Model de negoci típic

1. **Constitueixes la teva LLC** en un estat favorable (Nou Mèxic, Wyoming)
2. **Obres compte Mercury** i configures Stripe/Shopify Payments
3. **Registres la teva marca** a Amazon Brand Registry (opcional però recomanat)
4. **Envies inventari** a Amazon FBA o gestiones enviaments des del teu proveïdor
5. **Cobres en USD** directament a Mercury
6. **Transfereixes beneficis** al teu compte personal via Wise
### Sales Tax Nexus: el que necessites saber

El **nexus** és el concepte que determina si has de cobrar Sales Tax en un estat. Des de la sentència *South Dakota v. Wayfair (2018)*, el nexus pot ser:

- **Physical nexus:** Tens inventari, oficina o presència física en un estat. Si uses Amazon FBA, el teu inventari és als magatzems d'Amazon en múltiples estats → tens nexus en aquests estats.
- **Economic nexus:** Superes un llindar de vendes en un estat (generalment $100K en vendes o 200 transaccions/any).

**La bona notícia per a venedors FBA:** Amazon recapta i remet el Sales Tax automàticament a la majoria dels estats com a "marketplace facilitator". Tu no has de fer res. Amazon se n'encarrega.

**Per a la teva pròpia botiga Shopify:** Aquí sí que has de configurar la recaptació de Sales Tax als estats on tinguis nexus. Shopify té integracions amb eines com TaxJar o Avalara que ho automatitzen.
### Inventari i logística: consideracions pràctiques

### Si fas Private Label (marca pròpia)
1. Fabriques a la Xina, l'Índia o on sigui més competitiu
2. El teu proveïdor envia directament als magatzems FBA d'Amazon
3. Amazon emmagatzema, empaqueta i envia
4. Tu et centres en màrqueting i optimització de listings

### Si fas Dropshipping
- No necessites inventari
- El proveïdor envia directament al client final
- La LLC dóna credibilitat davant proveïdors internacionals
- Menor risc d'inventari, menor marge

### Si fas Print-on-Demand
- Printful, Printify o Teespring s'integren amb Shopify
- Sense inventari, sense risc
- Ideal per a creadors de contingut que volen merch

Per continuar aquest fil, <a href="/ca/blog/iban-swift-i-routing-number-entendre-els-codis-bancaris">IBAN, SWIFT i routing number: entendre els codis bancaris internacionals</a> i <a href="/ca/blog/com-escalar-el-teu-negoci-digital-amb-una-llc-americana">Com escalar el teu negoci digital amb una LLC americana</a> completen matisos que aquí només hem tocat de passada.
### Comptes i eines essencials per a ecommerce

| Eina | Per a què | Cost |
|---|---|---|
| Mercury | Compte bancari principal | Gratuït ($0 wire fees) |
| Stripe/Shopify Payments | Processament de pagaments | 2.9% + $0.30 |
| Amazon Seller Central | Marketplace | $39.99/mes + referral fees |
| Jungle Scout / Helium 10 | Investigació de producte | $29-99/mes |
| Wise Business | Conversió de divises | Tipus de canvi real (EMI) |

A Exentax hem constituït LLCs per a venedors d'Amazon FBA, botigues Shopify i operacions de dropshipping que operen des de Catalunya. Sabem què funciona en cada model. Reserva la teva assessoria gratuïta i et direm exactament quina estructura encaixa amb el teu ecommerce.
## Arquitectura bancària equilibrada: Mercury, Relay, Slash i Wise

No existeix el compte perfecte per a una LLC. Existeix l'**arquitectura** correcta, on cada eina cobreix un rol:

- **Mercury** (operada com a fintech amb bancs associats (Choice Financial Group i Evolve Bank & Trust principalment; Column N.A. en comptes heretats), FDIC via sweep network fins al límit vigent). Compte principal operatiu per a no residents amb bona UX, ACH i wires. Continua sent una de les opcions més provades per obrir des de fora dels EUA.
- **Relay** (recolzada per Thread Bank, FDIC). Excel·lent com a **compte de respatller** i per a "envelope budgeting": permet crear fins a 20 subcomptes i 50 targetes de dèbit, integració profunda amb QuickBooks i Xero. Si Mercury bloqueja o demana revisió KYC, Relay evita que la teva operativa s'aturi.
- **Slash** (recolzada per Column N.A. (banc amb llicència federal, FDIC)). Banca dissenyada per a operadors online: emissió instantània de targetes virtuals per proveïdor, controls de despesa granulars, *cashback* en publicitat digital. Complement natural quan gestiones Meta Ads, Google Ads o subscripcions SaaS.
- **Wise Business** (EMI multidivisa, no és banc). Per cobrar i pagar en EUR, GBP, USD i altres divises amb dades bancàries locals i conversió a *mid-market rate*. No substitueix un compte US real, però és imbatible per a tresoreria internacional.
- **Wallester / Revolut Business.** Wallester aporta targetes corporatives amb BIN propi per a alt volum. Revolut Business funciona com a complement europeu, no com a compte principal de la LLC.

<!-- exentax:lote31-native-v1:amazon-ecommerce-llc-vender-online-ca -->
## Com llegir la LLC per a ecommerce com un mapa operatiu estable en lloc d'una drecera comercial

La LLC per a ecommerce es llegeix de manera més útil com un mapa operatiu estable entre el marketplace, el beneficiari i el país de residència del beneficiari, en lloc d'una drecera comercial. Aquest mapa no canvia amb la temporada de l'any, i una nota curta i datada al dossier de la LLC amb els tres eixos fa la posició consultable en pocs minuts en una conversa amb un assessor fiscal.
<!-- /exentax:lote31-native-v1:amazon-ecommerce-llc-vender-online-ca -->

Abans de continuar, posa números al teu cas: la <a href="/ca#calculadora">calculadora Exentax</a> compara, en menys de 2 minuts, la teva càrrega fiscal actual amb la que tindries operant una LLC nord-americana ben declarada al teu país de residència.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

La recomanació realista: **Mercury + Relay com a respatller + Slash per a operativa publicitària + Wise per a tresoreria FX**. És la configuració que minimitza el risc de bloqueig i redueix el cost real. A Exentax obrim i configurem aquesta arquitectura com a part de la constitució.
### Següents passos

Ara que tens el context complet, el pas següent natural és contrastar-lo amb la teva pròpia situació: què encaixa, què no, i on són els matisos que depenen de la teva residència, la teva activitat i el teu volum. Una revisió ràpida del teu cas sol estalviar molt soroll abans de qualsevol decisió estructural.

<!-- exentax:banking-facts-v1 -->
## Fets bancaris i fiscals a precisar

La informació sobre fintech i CRS evoluciona; aquest és l'estat actual:
### Notes per proveïdor

- **Mercury** opera amb diversos bancs associats amb llicència federal i cobertura **FDIC** via sweep network: principalment **Choice Financial Group** i **Evolve Bank & Trust**, i encara **Column N.A.** en alguns comptes heretats. Mercury no és un banc; és una plataforma fintech recolzada per aquests partner banks. Si Mercury tanca un compte, el saldo es retorna normalment **mitjançant xec en paper a l'adreça registrada del titular**, fet que pot ser un problema operatiu seriós per a no residents; convé mantenir un compte secundari (Relay, Wise Business, etc.) com a contingència.
- **Wise** té dos productes clarament diferents: **Wise Personal** i **Wise Business**. Per a una LLC s'ha d'obrir **Wise Business**, no el personal. Matís important de CRS: una **Wise Business titularitat d'una LLC dels EUA queda fora del CRS** perquè la titular és una entitat dels EUA i els EUA no són jurisdicció CRS; el costat USD opera via Wise US Inc. (perímetre FATCA, no CRS). En canvi, una **Wise Personal oberta per un individu resident fiscal a Espanya** o una altra jurisdicció CRS **sí genera reporte CRS** via Wise Europe SA (Bèlgica) sobre aquest individu. Obrir Wise per a la teva LLC no t'inclou al CRS per la LLC; una Wise Personal separada al teu nom com a resident en CRS, sí.
- **Wallester** (Estònia) és una entitat financera europea amb llicència EMI/banc emissor de targetes. Els seus comptes IBAN europeus **estan dins de l'Estàndard Comú de Comunicació (CRS)** i, per tant, generen intercanvi automàtic d'informació cap a l'administració fiscal del país de residència.
- **Payoneer** opera mitjançant entitats europees (Payoneer Europe Ltd, Irlanda) també **dins de l'àmbit CRS** per a clients residents en jurisdiccions participants.
- **Revolut Business**: quan s'associa a una **LLC nord-americana**, opera sota **Revolut Technologies Inc.** amb **Lead Bank** com a banc partner als EUA. El compte lliurat és un compte dels EUA (routing + account number); **no s'emet IBAN europeu** a una LLC. Els IBAN europeus (lituans, BE) són de **Revolut Bank UAB** i s'emeten a clients europeus del grup. Si li ofereixen un IBAN europeu associat a la seva LLC, confirma a quina entitat jurídica està associat i sota quin règim reporta.
- **Tributació zero**: cap estructura LLC aconsegueix "zero impostos" si vius en un país amb regles CFC/transparència fiscal o atribució de rendes. El que s'aconsegueix és **no duplicar tributació** i **declarar correctament a residència**, no eliminar-la.
## T'ho muntem sense que perdis un cap de setmana

Milers de freelancers i emprenedors ja operen amb la seva LLC americana de manera 100% legal i documentada. A Exentax ens encarreguem de tot el procés: constitució, banca, passarel·les de pagament, comptabilitat, declaracions <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> i compliance al teu país de residència. Reserva una assessoria gratuïta i et direm amb sinceritat si la LLC té sentit per al teu cas, sense promeses absolutes.<!-- exentax:execution-v2 -->
## Què sosté de veritat un ecommerce seriós darrere de la LLC

La LLC és l'eina jurídica; un ecommerce real s'aguanta sobre quatre potes que convé tenir mapejades abans de llistar el primer producte. Ho veiem cada setmana quan arriba un seller que ja factura i descobreix que la seva estructura no escala.

- **Marketplace i Merchant of Record.** Vendre a Amazon US amb la teva LLC no t'eximeix de l'IVA a la UE: FBA en magatzems europeus o superar els llindars OSS/IOSS pot fer-te - o a la plataforma - subjecte passiu d'IVA segons l'art. 14 bis de la Directiva 2006/112. Tanca el paper abans de començar, no després de la primera carta.
- **Passarel·les en cascada.** Stripe US és l'entrada natural, però convé tenir Paddle (Merchant of Record) o DoDo Payments com a alternativa si Stripe restringeix el compte (reserves, chargebacks, categoria). Una sola passarel·la activa és un punt únic de fallada.
- **Fulfillment i nexus.** El FBA als EUA crea **sales tax nexus** a cada estat on Amazon emmagatzema el teu inventari. Vint-i-quatre estats tenen marketplace facilitator law que cobra per tu, però alguns encara exigeixen registre propi.
- **Traçabilitat comptable des del dia u.** Conciliar settlements d'Amazon, fees de Stripe i devolucions necessita un sistema (A2X, Synder o similar) connectat a la teva comptabilitat. Sense això, el tancament d'exercici esdevé arqueologia.

### El que més ens pregunten

**Necessito ITIN si només venc a Amazon US amb la meva LLC?** No per operar el compte de seller, però sí per recuperar retencions d'Amazon KDP o royalties, o si la teva jurisdicció ho exigeix per acreditar la imputació d'ingressos. Ho gestionem en paral·lel a la constitució quan cal.

**Com evito que Stripe em tanqui el compte?** Coherència entre estat de constitució, adreça de la LLC, descripció d'activitat i categoria MCC; documentació preparada per al primer KYC ampliat; separació estricta entre compte personal i compte de la LLC. La majoria de tancaments no són per risc, són per incoherència documental.

A Exentax muntem aquesta estructura d'extrem a extrem i lliurem al seller el manual operatiu, els comptes oberts i el calendari fiscal tancat abans del primer enviament.
<!-- /exentax:execution-v2 -->

## Com treballem a Exentax

El nostre equip està especialitzat en estructures fiscals internacionals per a residents de països de parla hispana que operen negocis en línia. Combinem coneixement local d'Espanya, Andorra i l'Amèrica Llatina amb experiència operativa en la constitució d'entitats a Delaware, Wyoming, Estònia i altres jurisdiccions. Cada cas comença amb una consulta gratuïta en la qual avaluem la residència, l'activitat i els objectius, i et diem amb sinceritat si l'estructura proposada té sentit o si una alternativa més senzilla és suficient.

<!-- exentax:cross-refs-v1 -->
## Per continuar la lectura

- [LLC als Estats Units: guia completa per a no residents el 2026](/ca/blog/llc-estats-units-guia-completa-no-residents-2026)
- [DAC7: el nou reporting de plataformes digitals el 2026](/ca/blog/dac7-el-nou-reporting-de-plataformes-digitals-el-2026)
- [Fiscalitat LLC per país de residència: el que es paga on es viu](/ca/blog/fiscalitat-llc-per-pais-de-residencia-el-que-es-paga-on-es)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:defensa-fiscal-v1 -->
## I si l'AEAT li pregunta per la seva LLC?

  És la pregunta més freqüent en la primera consulta i té una resposta curta: la seva LLC no és opaca i, correctament declarada, una inspecció es tanca amb formularis estàndard. L'<a href="https://www.agenciatributaria.gob.es" target="_blank" rel="noopener">AEAT</a> i l'Agència Tributària de Catalunya poden demanar el Certificate of Formation de l'estat (Wyoming, Delaware o Nou Mèxic), l'EIN emès per l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, l'Operating Agreement signat, els extractes de Mercury o Wise de l'exercici, el Form 5472 amb 1120 pro-forma presentat i la comptabilitat que reconcilia ingressos, despeses i moviments. Si tot això existeix i s'entrega ordenat, la inspecció no escala.

  El que l'AEAT sí persegueix, amb raó, són els testaferros, la residència fiscal de paper i la no declaració dels Models 720 / 721. Una LLC ben muntada és exactament el contrari: vostè apareix com a **beneficial owner** al BOI Report quan aplica (verificable a <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), vostè signa els comptes bancaris i declara la renda on realment viu. L'estructura està registrada al Secretary of State de l'estat, als arxius de l'IRS i, sempre que un banc europeu hi intervé, dins del perímetre CRS de l'estàndard de l'<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.

  L'error que sí enfonsa una inspecció no és tenir una LLC; és no haver atribuït la renda correctament a l'IRPF, no haver presentat el Model 720 sobre els comptes als EUA quan el saldo a 31/12 supera els 50.000 € o no haver documentat les operacions vinculades soci-LLC al Model 232. Aquests tres fronts es tanquen abans del requeriment, no després.

  ## El que una LLC NO fa

  - **No l'eximeix de tributar a Catalunya / Espanya.** Si hi viu, tributa per la renda mundial. La LLC ordena la seva fiscalitat estatunidenca (zero impost federal a la SMLLC pass-through sense ECI), no l'espanyola. La quota d'IRPF es calcula sobre el benefici atribuït, no sobre els dividends efectivament cobrats.
  - **No és cap muntatge offshore ni un esquema BEPS.** És una entitat estatunidenca reconeguda per l'IRS, registrada en un estat concret amb adreça física, agent registrat i obligacions informatives anuals. Les jurisdiccions offshore clàssiques (BVI, Belize, Seychelles) no deixen rastre públic; una LLC en deixa en cinc llocs.
  - **No el protegeix si hi ha confusió patrimonial.** El *pierce the corporate veil* s'activa així que un jutge veu la LLC i el soci funcionar com la mateixa cartera: comptes barrejats, despeses personals pagades per la LLC, sense Operating Agreement, sense comptabilitat. Tres moviments sospitosos basten.
  - **No li estalvia cotitzacions a la Seguretat Social.** Si és autònom al RETA, la quota mensual continua sent la mateixa. La LLC opera la seva activitat davant clients internacionals; la cotització personal és independent i depèn de la base triada al <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de Seguretat Social.
  - **No el lliura de declarar els comptes estrangers.** Si la suma de comptes als EUA (Mercury, Relay, Wise USD) supera els 50.000 € a 31/12, **Model 720** abans del 31 de març. Si té criptoactius custodiats en exchanges fora d'Espanya per més de 50.000 €, **Model 721** en el mateix termini. Aquestes obligacions són del resident fiscal, no de la LLC.

  A Exentax revisem aquests cinc fronts cada any en paral·lel al calendari federal estatunidenc (Form 5472, 1120 pro-forma, FBAR, Annual Report estatal i BOI Report quan apliqui). L'objectiu és que cap inspecció trobi un cap solt i que l'estructura aguanti revisions a 5-7 anys vista.
<!-- /exentax:defensa-fiscal-v1 -->

<!-- exentax:cta-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Vendre%20a%20Amazon%2C%20Shopify%20o%20Etsy%20des%20de%20Catalunya%20sol%20ser%20un%20circuit%20d'obstacl%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.

<!-- exentax:conv-fill-v1 -->
O truca'ns directament al <a href="tel:+34614916910">+34 614 916 910</a> si prefereixes parlar.

Per a detalls per estat, consulta la nostra <a href="/ca/serveis/llc-wyoming">pàgina del servei LLC a Wyoming</a> amb costos i terminis tancats.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->
`;
