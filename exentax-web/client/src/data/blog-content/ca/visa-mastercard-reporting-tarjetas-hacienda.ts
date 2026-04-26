export default `Quan algú pregunta "Hisenda veu el que pago amb la targeta?", la resposta curta és: depèn de qui emet la targeta, on està domiciliat el comerç i en quin país ets resident fiscal. La resposta llarga obliga a entendre com funciona per sota l'ecosistema de targetes i quines declaracions informatives existeixen realment. Hi ha molt mite al voltant de Visa i Mastercard, i convé separar-lo del que sí que passa amb la teva <a href="/ca/blog/wise-iban-i-llc-que-es-reporta-realment-a-hisenda">targeta Wise associada a una LLC</a>, amb la teva targeta d'un banc espanyol o amb la <a href="/ca/blog/revolut-business-i-crs-que-es-reporta-a-hisenda">targeta Revolut</a>.

Aquest article recorre qui és qui en una transacció amb targeta, què reporta cada actor a les autoritats fiscals i quines declaracions informatives existeixen país per país que afecten el consum i el saldo de targetes (Modelo 196 i 171 a Espanya, DAS2 a França, Modelo 38 a Portugal, entre d'altres).

## El model de quatre parts: emissor, xarxa, adquirent, comerç

Cada vegada que passes una targeta, hi intervenen quatre actors molt diferents:

- **Emissor (issuer)**: l'entitat que t'ha emès la targeta i manté el compte d'on surt els diners. Pot ser un banc tradicional (CaixaBank, Banc Sabadell), una EMI (Wise Europe SA, Revolut Bank UAB) o un emissor de prepagament.
- **Xarxa de processament (network o scheme)**: Visa, Mastercard, American Express, JCB, UnionPay. No mantenen ni el teu compte ni el del comerç: encaminen el missatge d'autorització entre l'emissor i l'adquirent i orquestren la liquidació.
- **Adquirent (acquirer)**: l'entitat financera que ha contractat el comerç i li abona el cobrament. A Europa són noms com Adyen, Stripe, Worldline, Redsys (a través dels bancs membres), CaixaBank Payments & Consumer, Banc Sabadell.
- **Comerç (merchant)**: el negoci que cobra. Identificat per un Merchant Category Code (MCC) i un identificador únic dins la xarxa.

Entendre aquesta cadena és clau: cap actor "veu" tota la pel·lícula. Cadascun només veu el seu tram.
### Què veu i què no veu cada actor

| Actor | El que coneix amb detall |
| --- | --- |
| Emissor | La teva identitat, el teu compte, cada càrrec amb import, divisa, data, MCC i nom del comerç |
| Xarxa (Visa/Mastercard) | Missatges d'autorització entre emissor i adquirent, dades agregades per a liquidació, frau i disputa |
| Adquirent | Identitat del comerç, cada cobrament rebut, import, divisa, marca de targeta i BIN de l'emissor |
| Comerç | El seu cobrament, els últims 4 dígits, marca, país emissor i, si demanes factura, les teves dades |

El que **cap** d'ells fa per sistema és enviar en directe cada transacció a Hisenda de cada país de cada client. Això simplement no és el seu rol.
## La idea més estesa (i errònia) sobre Visa i Mastercard

Circula la creença que "com Visa i Mastercard són americanes i tot hi passa, ja estan reportant-ho tot a totes les hisendes". No és així:

- **Visa Inc.** i **Mastercard Inc.** són **xarxes de processament de pagaments**, no entitats dipositàries. No mantenen comptes de clients finals i, per tant, no són "institucions financeres declarants" en el sentit del CRS o de FATCA.
- **No reporten** els consums individuals de cada portador a l'AEAT, a la DGFiP francesa, al Service Public Fédéral Finances belga ni a cap altra hisenda nacional com a flux automàtic.
- Sí que cooperen amb autoritats fiscals i judicials en investigacions puntuals, via requeriments formals, com qualsevol altra empresa que custodia dades.

Qui sí que està subjecte a obligacions d'informació és l'**emissor de la targeta** (en les seves declaracions nacionals) i, al costat del comerç, l'**adquirent** dins la seva pròpia comptabilitat i de les declaracions que li apliquin al seu país.
## Què reporta realment l'emissor a Espanya

A Espanya, les entitats emissores nacionals presenten a l'AEAT diverses declaracions informatives rellevants per a targetes i comptes:

- **Modelo 196**: declaració informativa anual de comptes en entitats de crèdit. Identifica titulars i autoritzats, els saldos a 31 de desembre i, en molts casos, els saldos mitjans del quart trimestre. Cobreix el compte darrere de la targeta, no cada moviment.
- **Modelo 171**: declaració anual de imposicions, disposicions de fons i cobraments amb targeta per damunt de determinats llindars (clàssicament, operacions superiors a 3.000 € en efectiu i, per a comerciants, cobraments amb targeta agregats).
- **Modelo 170**: declaració d'operacions realitzades per empresaris o professionals adherits al sistema de gestió de cobraments per targeta. Aquí els **adquirents** declaren els cobraments abonats als comerços, no els pagaments que fas tu com a consumidor.
- **Modelo 199**: identificació de comptes amb transcendència tributària.

Qui fa servir targeta com a consumidor a Espanya i té el compte en un banc espanyol està, a la pràctica, dins el perímetre d'informació que l'AEAT pot consultar de manera periòdica.
## L'equivalent en altres països europeus

L'esquema canvia a cada jurisdicció. Alguns exemples representatius:

- **França – DAS2**: declaració anual que recull honoraris, comissions i altres rendes pagades a tercers. Per a targetes, el paper principal el juga la **DGFiP** combinant aquesta declaració amb la informació que aporta cada banc. França obliga, a més, a declarar els **comptes a l'estranger** (formulari 3916), cosa que típicament inclou els IBAN de Wise o Revolut.
- **Portugal – Modelo 38**: declaració anual de transferències i enviaments de fons a l'exterior. El **Modelo 40** complementa amb operacions amb valors mobiliaris. Juntament amb l'obligació de declarar comptes estrangers a l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, dibuixa un perímetre de control similar a l'espanyol.
- **Alemanya**: no existeix un Modelo 196 anàleg, però els bancs alemanys mantenen el sistema Kontenabrufverfahren, que permet al Bundeszentralamt für Steuern consultar la titularitat de comptes i dipòsits de qualsevol resident quan ho demana una autoritat competent.
- **Itàlia**: l'Anagrafe dei Rapporti Finanziari recull anualment saldos, moviments agregats i dades de comptes i targetes que els intermediaris financers italians envien a l'Agenzia delle Entrate.
- **Regne Unit**: HMRC rep informació agregada dels bancs via esquemes com el Bulk Data Gathering, a més dels reports CRS per a no residents.

La regla general és que **el compte i la titularitat estan ben cobertes**, mentre que el **detall transacció a transacció** no s'envia d'ofici: es reconstrueix només en una inspecció concreta.
## El cas de l'emissor estranger: Wise, Revolut i similars

Quan la teva targeta l'emet una EMI europea diferent d'un banc espanyol (típicament Wise Europe SA a Bèlgica o Revolut Bank UAB a Lituània), la situació canvia:

- Aquests emissors **no presenten els models informatius espanyols** (196, 171, 170, 199). Aquestes declaracions són obligacions de les entitats financeres espanyoles o amb sucursal a Espanya.
- Sí que estan obligats al **CRS** des de la seva jurisdicció d'origen. Wise Europe SA reporta a la hisenda belga i Revolut Bank UAB a la lituana, que reenvien a la hisenda del país de residència del titular el saldo a 31 de desembre i els rendiments, com descrivim a <a href="/ca/blog/crs-i-els-teus-comptes-bancaris-llc-el-que-es-comparteix-amb">CRS per a comptes bancaris de LLC</a>.
- El **detall de cada compra amb la targeta no viatja per CRS**. El que viatja és el saldo de tancament, la identitat del titular i, si el compte pertany a una entitat classificada com a Passive NFE, els controlling persons.

Això explica una observació freqüent: una compra amb targeta d'un banc espanyol apareix, agregada amb la resta, en les dades que l'AEAT pot consultar; la mateixa compra amb targeta Wise o Revolut no es declara directament a l'AEAT, però el saldo del compte sí que es reportarà per CRS des de Bèlgica o Lituània.

La conclusió raonable no és "la targeta estrangera em fa invisible", sinó que **el rastre existeix en una altra capa**: el compte queda identificat, els saldos es reporten i, si hi ha procediment, els moviments es poden demanar.
### I l'adquirent del comerç: l'altre extrem del cable

Sovint oblidem l'adquirent. Quan un comerç espanyol cobra amb targeta, el seu adquirent a Espanya presenta el **Modelo 170** amb l'agregat anual de cobraments amb targeta d'aquest comerç. Si aquest comerç és una persona física que infradeclara els seus ingressos, l'AEAT creua aquest Modelo 170 amb la seva declaració i la incoherència apareix. Això no afecta el consumidor, però explica per què Hisenda detecta tan ràpid els comerços que infradeclaren ingressos cobrats amb targeta.

Per a un emprenedor amb LLC que cobra de clients finals via Stripe US o un Merchant of Record com DoDo Payments, el flux és diferent: l'adquirent està fora d'Espanya, no presenta Modelo 170, i els ingressos arriben a Mercury o Wise. La traçabilitat per a Hisenda passa llavors pel saldo i els rendiments via CRS, no per l'adquirent.
## Què pot veure realment Hisenda del teu consum amb targeta

Per a un resident fiscal espanyol que combina banca local amb fintech estrangera i, eventualment, una <a href="/ca/blog/llc-als-estats-units-guia-completa-per-a-no-residents-el">LLC americana</a>:

El que l'AEAT pot consultar de manera recurrent:

- Comptes bancaris a Espanya amb la teva titularitat o autorització (Modelo 196, 199).
- Cobraments amb targeta agregats d'un comerç espanyol (Modelo 170, si ets autònom o empresa).
- Saldos a 31 de desembre i rendiments de comptes a l'estranger rebuts per CRS des del país de l'emissor.
- Comptes a l'estranger declarats per tu al Modelo 720 quan superis el llindar agregat.

El que l'AEAT no rep automàticament:

- El detall de cada compra que facis amb qualsevol targeta, ni a Espanya ni fora.
- La llista de comerços on compres com a consumidor.
- Imports individuals per sota dels llindars del 171 o equivalents.

El que sí pot demanar si t'obre un procediment:

- L'extracte complet del compte a l'entitat emissora, a Espanya directament i, fora, per intercanvi puntual.
- Informació concreta a la xarxa de targetes o al comerç en investigacions avançades.
## Errors comuns que veiem cada setmana

1. **"Visa i Mastercard reporten tot en directe a Hisenda."** Fals. Són xarxes de processament; no són entitats declarants ni emissores finals.
2. **"Si pago amb targeta estrangera, les meves compres són invisibles."** El detall no es declara automàticament, però el compte sí que és visible via CRS i el rastre és perfectament reconstruïble.
3. **"El Modelo 171 fa que Hisenda vegi cada compra meva amb targeta."** No: el 171 cobreix operacions per damunt de llindars i agregats de cobraments, no cada consum personal per sota d'aquests llindars.
4. **"Si la meva LLC cobra per Stripe, això ja es declara a Espanya."** No directament: Stripe US no presenta Modelo 170, i la informació sobre la teva LLC arriba a Hisenda per altres vies (Mercury via FATCA és asimètrica, Wise via CRS, el teu propi Modelo 720 si aplica).
5. **"Millor pagar sempre amb la targeta del banc estranger per no deixar rastre."** El rastre existeix i, a més, una operativa dissenyada per no deixar rastre és exactament el patró que més ràpid dispara alarmes en una inspecció.
6. **"L'adquirent del comerç europeu on compro reporta el meu consum a l'AEAT."** No: l'adquirent reporta els cobraments del seu propi client comerç, no les dades del consumidor.
### Per què això importa per a la teva estructura

Si combines una LLC americana, un compte Mercury, un Wise Business amb targeta, una Revolut Business i una targeta del teu banc espanyol per al dia a dia, no tens un problema d'"ocultació": tens un mapa de rastres diferents, cadascun amb la seva pròpia visibilitat fiscal. La pregunta correcta no és "quina targeta utilitzar perquè no s'enteri Hisenda?", sinó "com encaixen aquestes peces amb la meva residència fiscal, les meves declaracions (IRPF, 720, 721) i la doctrina administrativa que aplica a la meva LLC?". Ho desenvolupem a <a href="/ca/blog/disseny-duna-estructura-fiscal-internacional-solida-marc-pas">Disseny d'una estructura fiscal internacional sòlida</a> i, per al creuament concret amb la <a href="/ca/blog/wise-iban-i-llc-que-es-reporta-realment-a-hisenda">targeta Wise sobre LLC</a>, al seu article dedicat.

Si ja operes amb targetes en diverses jurisdiccions i no tens clar què es reporta on, ho revisem amb tu i et diem què arreglar abans que sigui Hisenda qui marqui el ritme.
### En resum

Les xarxes Visa i Mastercard no són les que avisen Hisenda dels teus consums: el seu rol és processar pagaments. El que sí que arriba a les autoritats fiscals és informació de l'**emissor** (via declaracions nacionals tipus Modelo 196 o 171, DAS2, Modelo 38) i de l'**adquirent** (cobraments agregats del comerç). Quan l'emissor està fora del teu país, les declaracions nacionals no apliquen, però el saldo i la titularitat sí que viatgen per CRS des de la jurisdicció de l'emissor.

El consum amb targeta no s'està retransmetent en directe a la teva hisenda, però deixa un rastre perfectament visible quan algú decideix mirar. La diferència entre tenir problemes o no tenir-los no està en quina targeta fer servir, sinó que la teva estructura sigui coherent amb la teva residència fiscal i amb les teves declaracions.
## Compliance fiscal al teu país: CFC, TFI i atribució de rendes

Una LLC americana és una eina legal i reconeguda internacionalment. Però el compliment no acaba en constituir-la: com a propietari resident fiscal en un altre país, l'administració tributària local manté el dret a gravar el que la LLC genera. L'important és saber **sota quin règim**.

### Per jurisdicció

- **Espanya (LIRPF/LIS).** Si la LLC és una *Single-Member Disregarded Entity* operativa (serveis reals, sense passivitat significativa), Hisenda la tracta normalment per **atribució de rendes (art. 87 LIRPF)**: els beneficis nets s'imputen al soci l'exercici en què es generen, integrant-se a la base general de l'IRPF. Si la LLC opta per tributar com a *corporation* (Form 8832) i queda controlada per resident espanyol amb rendes majoritàriament passives, pot activar-se la **transparència fiscal internacional (art. 91 LIRPF per a persones físiques, art. 100 LIS per a societats)**. La diferència no és opcional: depèn de la substància econòmica, no del nom.
- **Models informatius.** Comptes als EUA amb saldo mitjà o final >50.000 € a l'exercici: **Model 720** (Llei 5/2022 després de la STJUE C-788/19, 27/01/2022, sancions ara dins del règim general LGT). Operacions vinculades amb la LLC i dividends repatriats: **Model 232**. Criptoactius custodiats als EUA: **Model 721**.
- **CDI Espanya–EUA.** El conveni (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol en vigor 27/11/2019) ordena la doble imposició sobre dividends, interessos i royalties. Una LLC sense establiment permanent a Espanya no constitueix per si sola EP del soci, però la direcció efectiva sí pot crear-lo si tota la gestió es fa des de territori espanyol.
- **Mèxic, Colòmbia, Argentina i altres LATAM.** Cada jurisdicció té el seu propi règim CFC (Mèxic: Refipres; Argentina: rendes passives de l'exterior; Xile: art. 41 G LIR). El principi comú: el que la LLC reté com a benefici es considera percebut pel soci si l'entitat es considera transparent o controlada.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

La regla pràctica: una LLC operativa, amb substància, declarada correctament en residència, és **planificació fiscal legítima**. Una LLC que s'utilitza per ocultar ingressos, simular no-residència o desplaçar rendes passives sense justificació econòmica entra al terreny de l'**art. 15 LGT (conflicte en aplicació de la norma)** o, en el pitjor cas, de l'**art. 16 LGT (simulació)**. La diferència la marquen els fets, no el paper.
A Exentax muntem l'estructura perquè encaixi al primer escenari i documentem cada pas perquè la teva declaració local sigui defensable davant d'una eventual revisió.

<!-- exentax:legal-refs-v1 -->
## Referències legals i normatives

Aquest article es basa en normativa vigents actualment. Citem les fonts principals per a verificació:

- **EUA.** Treas. Reg. §301.7701-3 (classificació d'entitats / *check-the-box*); IRC §882 (impost sobre rendes d'estrangers connectades amb US trade or business); IRC §871 (FDAP i retencions a no residents); IRC §6038A i Treas. Reg. §1.6038A-2 (Form 5472 per a *25% foreign-owned* i *foreign-owned disregarded entities*); IRC §7701(b) (residència fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report a <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espanya.** Llei 35/2006 (LIRPF), arts. 8, 9 (residència), 87 (atribució de rendes), 91 (transparència fiscal internacional per a persones físiques); Llei 27/2014 (LIS), art. 100 (transparència fiscal internacional per a societats); Llei 58/2003 (LGT), arts. 15 i 16; Llei 5/2022 (règim sancionador del Model 720 després de la STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Models 232 i 720); Ordre HFP/887/2023 (Model 721 cripto).
- **Conveni Espanya–EUA.** BOE de 22/12/1990 (CDI original); Protocol en vigor des del 27/11/2019 (renda passiva, *limitation on benefits*).
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Directiva (UE) 2011/16, modificada per DAC6 (mecanismes transfronterers), DAC7 (Directiva (UE) 2021/514, plataformes digitals) i DAC8 (criptoactius); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetries híbrides); Estàndard Comú de Reporte (CRS) de l'OCDE.
- **Marc internacional.** Model de Conveni OCDE, art. 5 (establiment permanent) i comentaris; Acció 5 BEPS (substància econòmica); FATF Recommendation 24 (titularitat real).

L'aplicació concreta de qualsevol d'aquestes normes al teu cas depèn de la teva residència fiscal, l'activitat de la LLC i la documentació que mantinguis. Aquest contingut és informatiu i no substitueix l'assessorament professional personalitzat.

<!-- exentax:bank-balance-v1 -->
## Stack bancari equilibrat: Mercury, Relay, Slash i Wise

No existeix el compte perfecte per a una LLC. Existeix el **stack** correcte, on cada eina cobreix un rol:

- **Mercury** (operada com a fintech amb bancs associats (Choice Financial Group i Evolve Bank & Trust principalment; Column N.A. en comptes heretats), FDIC via sweep network fins al límit vigent). Compte principal operatiu per a no residents amb bona UX, ACH i wires. Continua sent una de les opcions més provades per obrir des de fora dels EUA.
- **Relay** (recolzada per Thread Bank, FDIC). Excel·lent com a **compte de respatller** i per a "envelope budgeting": permet crear fins a 20 subcomptes i 50 targetes de dèbit, integració profunda amb QuickBooks i Xero. Si Mercury bloqueja o demana revisió KYC, Relay evita que la teva operativa s'aturi.
- **Slash** (recolzada per Column N.A. (banc amb llicència federal, FDIC)). Banca dissenyada per a operadors online: emissió instantània de targetes virtuals per proveïdor, controls de despesa granulars, *cashback* en publicitat digital. Complement natural quan gestiones Meta Ads, Google Ads o subscripcions SaaS.
- **Wise Business** (EMI multidivisa, no és banc). Per cobrar i pagar en EUR, GBP, USD i altres divises amb dades bancàries locals i conversió a *mid-market rate*. No substitueix un compte US real, però és imbatible per a tresoreria internacional.
- **Wallester / Revolut Business.** Wallester aporta targetes corporatives amb BIN propi per a alt volum. Revolut Business funciona com a complement europeu, no com a compte principal de la LLC.

La recomanació realista: **Mercury + Relay com a respatller + Slash per a operativa publicitària + Wise per a tresoreria FX**. És la configuració que minimitza el risc de bloqueig i redueix el cost real. A Exentax obrim i configurem aquest stack com a part de la constitució.

<!-- exentax:banking-facts-v1 -->
## Fets bancaris i fiscals a precisar

La informació sobre fintech i CRS evoluciona; aquest és l'estat actual:

### Notes per proveïdor

- **Mercury** opera amb diversos bancs associats amb llicència federal i cobertura **FDIC** via sweep network: principalment **Choice Financial Group** i **Evolve Bank & Trust**, i encara **Column N.A.** en alguns comptes heretats. Mercury no és un banc; és una plataforma fintech recolzada per aquests partner banks. Si Mercury tanca un compte, el saldo es retorna normalment **mitjançant xec en paper a l'adreça registrada del titular**, fet que pot ser un problema operatiu seriós per a no residents; convé mantenir un compte secundari (Relay, Wise Business, etc.) com a contingència.
- **Wise** té dos productes clarament diferents: **Wise Personal** i **Wise Business**. Per a una LLC s'ha d'obrir **Wise Business**, no el personal. Matís important de CRS: una **Wise Business titularitat d'una LLC dels EUA queda fora del CRS** perquè la titular és una entitat dels EUA i els EUA no són jurisdicció CRS; el costat USD opera via Wise US Inc. (perímetre FATCA, no CRS). En canvi, una **Wise Personal oberta per un individu resident fiscal a Espanya** o una altra jurisdicció CRS **sí genera reporte CRS** via Wise Europe SA (Bèlgica) sobre aquest individu. Obrir Wise per a la teva LLC no t'inclou al CRS per la LLC; una Wise Personal separada al teu nom com a resident en CRS, sí.
- **Wallester** (Estònia) és una entitat financera europea amb llicència EMI/banc emissor de targetes. Els seus comptes IBAN europeus **estan dins de l'Estàndard Comú de Comunicació (CRS)** i, per tant, generen intercanvi automàtic d'informació cap a l'administració fiscal del país de residència.
- **Payoneer** opera mitjançant entitats europees (Payoneer Europe Ltd, Irlanda) també **dins de l'àmbit CRS** per a clients residents en jurisdiccions participants.
- **Revolut Business**: quan s'associa a una **LLC nord-americana**, l'esquema habitual passa per Revolut Payments USA; els IBAN europeus (lituans, BE) **no s'emeten per defecte** a una LLC, s'emeten a clients europeus del banc europeu del grup. Si t'ofereixen un IBAN europeu, confirma a quina entitat jurídica està associat i sota quin règim reporta.
- **Tributació zero**: cap estructura LLC aconsegueix "zero impostos" si vius en un país amb regles CFC/transparència fiscal o atribució de rendes. El que s'aconsegueix és **no duplicar tributació** i **declarar correctament a residència**, no eliminar-la.

<!-- exentax:legal-facts-v1 -->
## Fets legals i de procediment

Les obligacions davant la FinCEN i l'IRS s'han mogut en recent years; aquest és l'estat vigent:

### Punts clau

- **BOI / Corporate Transparency Act: la teva LLC NO està obligada (un avantatge competitiu).** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a les "foreign reporting companies"** (entitats constituïdes FORA dels EUA i registrades per operar en un estat). Una **LLC formada als EUA propietat d'un no resident NO presenta el BOI Report**: un tràmit menys al calendari, menys burocràcia i una estructura més neta que mai. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament. L'estat normatiu pot canviar: **monitoritzem FinCEN.gov en cada presentació** i, si l'obligació torna a aplicar, la gestionem sense cost addicional. Estat vigent verificable a [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Per a una **Single-Member LLC propietat d'un no resident**, les regulacions finals Treas. Reg. §1.6038A-1 (vigents des de 2017) tracten la LLC com a corporation a efectes del 5472. Procediment: **Form 1120 pro-forma** (només capçalera: nom, adreça, EIN, exercici) amb **Form 5472 annexat**. Enviament **per correu certificat o fax a l'IRS Service Center d'Ogden, Utah**, **no via MeF/e-file** estàndard. Venciment: **15 d'abril**; pròrroga via **Form 7004** fins al **15 d'octubre**. **Sanció: 25.000 USD per formulari i any, més 25.000 USD per cada 30 dies addicionals** de no presentació després de notificació de l'IRS.
- **Form 1120 substantiu.** Només aplica si la LLC ha fet check-the-box election a C-Corp (Form 8832): tributa al 21 % federal i presenta un 1120 amb xifres reals. La LLC disregarded estàndard **no presenta un 1120 substantiu i no paga corporate tax federal**.
- **EIN i notificacions.** Sense EIN no es pot presentar el 5472 ni el BOI. L'IRS no avisa abans de sancionar; es descobreix quan l'EIN queda bloquejat o una presentació posterior és rebutjada.<!-- exentax:execution-v2 -->
## Visa, Mastercard i reporting a Hisenda: què se sap de l'ús de la teva targeta d'empresa

Hisenda no rep llistat detallat de transaccions de la teva targeta empresarial US - però rep agregats que es creuen amb declaracions.

- **El que NO rep Hisenda directament.** Llistat de transaccions individuals, categories Visa/Mastercard, ubicacions POS. Les xarxes de targetes no són interfície de reporting fiscal.
- **El que SÍ rep via CRS i FATCA.** Saldo a 31 desembre + total moviments bruts + UBO. Si saldo mitjà o flux total alt sense coherència amb declaració, encreuament.
- **El que deixa rastre a través de comerços.** Pagar a Espanya amb targeta Mercury US: el comerç declara la seva venda normalment.
- **El que veu el teu banc resident.** Recarregar la targeta des del compte espanyol és visible.

### L'encreuament típic

Via CRS: Mercury té saldo mitjà 80k€ i moviments bruts anuals 300k€. A l'IRPF declares 25k€. Incoherència evident.

### El que més ens pregunten

**Si pago tot personal amb la targeta de la LLC, evito que es vegi?** No. Barrejar trenca separació.

**Hi ha targeta US "no reportable"?** No.

A Exentax estructurem l'ús amb bookkeeping i declaració correcta a la residència.
<!-- /exentax:execution-v2 -->

## T'ho muntem sense que perdis un cap de setmana

Milers de freelancers i emprenedors ja operen amb la seva LLC americana de manera 100% legal i documentada. A Exentax ens encarreguem de tot el procés: constitució, banca, passarel·les de pagament, comptabilitat, declaracions IRS i compliance al teu país de residència. Reserva una assessoria gratuïta i et direm amb sinceritat si la LLC té sentit per al teu cas, sense promeses absolutes.

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
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Quan%20alg%C3%BA%20pregunta%20Hisenda%20veu%20el%20que%20pago%20amb%20la%20targeta%3F%2C%20la%20resposta%20curta%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

`;
