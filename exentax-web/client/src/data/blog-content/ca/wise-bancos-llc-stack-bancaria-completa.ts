export default `Quan algú obre una LLC des de fora dels EUA, la conversa bancària es redueix gairebé sempre a una sola pregunta: "Mercury o Wise?". Aquesta pregunta és **el símptoma del problema, no la solució**. Una LLC operativa no se sosté en un sol compte, ni tan sols en dos. Necessita una **stack bancària** pensada com a sistema. En aquest article t'expliquem com es dissenya una stack que aguanti el dia a dia, què passa quan una peça falla, i per què el 80 % dels bloquejos que veiem a Exentax arriben precisament per no tenir res d'això muntat.

No és un article sobre Wise vs Mercury (per això ja tens la nostra <a href="/ca/blog/wise-business-amb-la-teva-llc-la-guia-completa-de-gestio">guia completa de Wise Business</a>, la <a href="/ca/blog/com-obrir-un-compte-mercury-per-a-la-teva-llc-des-de">guia de Mercury</a> i la <a href="/ca/blog/bancs-tradicionals-vs-fintech-per-a-la-teva-llc-on-obrir-el">comparativa banc vs fintech</a>). És l'article que ordena les peces anteriors en una arquitectura coherent.

## L'error mental: pensar el compte com "el compte"

Qui ve d'Europa o LATAM porta un model bancari molt concret: **un compte per persona, un compte per societat**. Punt. Si aquest compte es bloqueja, vas a la sucursal, parles amb el gestor, es resol. El sistema assumeix que el banc té incentius per no perdre't.

A l'**ecosistema fintech estatunidenc**, aquest model no existeix. Mercury, Wise, Brex, Relay, Revolut Business i companyia són **plataformes tecnològiques**, no bancs. El compte s'obre per API, es tanca per API, i les decisions les pren un sistema de scoring + un equip de compliance que tu no coneixes i a qui no pots trucar. Si el sistema decideix revisar el teu compte, el teu accés queda **congelat durant 30, 60 o 90 dies**, sense garantia de recuperar els fons a curt termini.

Primer canvi mental: **un compte no és el compte. És un proveïdor més, substituïble com un hosting o un domini**. I com tot proveïdor crític, necessita redundància.
## La stack mínima viable d'una LLC operativa

A partir del segon any d'activitat real, la stack mínima d'una LLC ben gestionada s'assembla a això:

1. **Compte operatiu principal en USD** (Mercury, Brex o banc tradicional tipus Bank of America/Chase si has pogut obrir-lo presencialment).
2. **Compte secundari en USD** del mateix perfil (típicament Relay si el principal és Mercury, o invers). No per ús diari, sinó com a **failover real** si el primer es bloqueja.
3. **Compte multi-divises amb IBAN europeu** (Wise Business típicament). Per cobrar a clients europeus en EUR sense SWIFT i tenir porta d'entrada al sistema bancari europeu.
4. **Passarel·la de pagament** connectada a un dels dos comptes USD (Stripe, PayPal Business, Dodo Payments). Veure la <a href="/ca/blog/passarelles-de-pagament-per-a-la-teva-llc-stripe-paypal-i">comparativa de passarel·les</a>.
5. **Targeta corporativa física + targetes virtuals** per a subscripcions SaaS i compres puntuals.
6. **Reserves separades** per a impostos, FX i operativa (desenvolupat sota).

Si sembla excessiu: ho és el primer mes. És **estrictament el mínim** per no perdre operativa quan alguna cosa falla. I alguna cosa sempre falla.
### Per què Mercury sol no n'hi ha prou

Mercury és probablement el millor producte del mercat per a una LLC de no resident. Però Mercury **no és un banc**: és una capa software sobre bancs partner (Choice Financial, Column N.A., Evolve). Si un partner decideix tallar amb tu, Mercury **no pot reobrir-te el compte** ni moure els fons sense la teva intervenció.

El que veiem a Exentax gairebé setmanalment:

- Compte Mercury bloquejat per una transferència entrant "atípica".
- Email automàtic Mercury demanant documentació.
- 7 a 14 dies sense operativa.
- En el 70 % dels casos, restablit. En el 30 %, **tancament amb devolució de fons en 30-60 dies**.

Tenir un secundari preautoritzat converteix una **crisi empresarial** en una **molèstia de 48 hores**.
### Per què Wise sol no n'hi ha prou

Wise Business és excel·lent per a multi-divises, IBAN europeu i conversió FX. Però Wise **no és un compte operatiu americà**. El seu routing i account number en USD són tècnicament "details", no compte bancari nominal a la teva LLC en un banc USA. Tres implicacions:

1. **Stripe USA, Amazon US, certs marketplaces i grans empreses** accepten els details USD de Wise sense problemes, però alguns els rebutgen en detectar que el receptor és EMI i no banc.
2. **El flux Stripe → Wise → IBAN local** funciona, però suma un actor a la cadena compliance.
3. **Wise reporta al teu fisc via CRS** des de Bèlgica. Si creus que Wise et dona privacitat, llegeix primer <a href="/ca/blog/wise-iban-i-llc-que-es-reporta-realment-a-hisenda">què reporta realment Wise</a> i <a href="/ca/blog/wise-business-i-crs-que-es-reporta-a-hisenda">com Wise encaixa en CRS</a>.

Conclusió: Wise és **peça imprescindible** del puzle europeu, però no substitueix compte operatiu USD nominal a la teva LLC.
### La trampa de l'IBAN belga (i de l'IBAN no local)

En obrir Wise Business com a LLC americana, t'assignen un **IBAN belga** (BE...). Conseqüència doble:

- Operativament, l'IBAN funciona perfectament per a SEPA dins la zona euro.
- Fiscalment i per a la **declaració de béns a l'estranger** (Model 720 Espanya, IES Portugal, 3916 França), aquest IBAN belga és **compte a l'estranger a nom d'entitat estrangera**. Si superes els llindars i ets resident fiscal, **l'has de declarar**.

Error típic: "com l'IBAN comença per BE, no és meu, és de la LLC, no declaro". Fals. La norma mira al beneficiari efectiu (tu). Més a <a href="/ca/blog/els-comptes-bancaris-americans-informen-a-la-teva-autoritat">comptes USA i Hisenda</a> i la <a href="/ca/blog/crs-i-els-teus-comptes-bancaris-llc-el-que-es-comparteix-amb">guia CRS per a comptes LLC</a>.
## Regles internes que t'estalvien 5 xifres

La stack és només hardware. Les regles d'operació eviten els problemes reals:

### 1. Mai, mai barrejar personal i LLC

Obvi però error més car i freqüent. Pagar Netflix personal amb la targeta de la LLC **trenca el corporate veil**. Zero excepcions.

### 2. Segmentar per risc

Clients B2B grans vs. payouts de marketplaces cripto: **separa fluxos en comptes distints**.

### 3. Tax buffer del 25-35 %

Cada entrada: **separa automàticament 25-35 %** a "tax reserve". Cobreix l'impost que pagaràs a casa (sí, el pagaràs, veure <a href="/ca/blog/la-teva-llc-no-paga-impostos-als-eua-que-passa-al-teu-pais">per què la teva LLC no paga als EUA però tu sí a casa</a>).

### 4. Buffer FX separat

Negoci en USD, despeses/declaració en EUR: buffer FX evita conversions al pitjor moment.

### 5. Documentar contractes abans del primer pagament

Transferència >5 000 USD de nou client → tard o d'hora compliance demana "purpose of payment, contract, invoice". Contracte i factura **abans** redueix revisió de 14 dies a 24 hores.

### 6. Backup absolut: "si això cau demà"

Pregunta trimestral: "si Mercury cau demà, què faig en 72 hores?". Resposta "no ho sé" → stack mal muntada.
## Què passa quan bloquegen (no és "si", és "quan")

Veritat operativa: **tota LLC amb 18+ mesos ha tingut almenys un esdeveniment de bloqueig**. El que canvia és la magnitud.

Bloqueig típic:
- **Dia 0**: email automàtic "under review".
- **Dies 1-3**: enviar documents.
- **Dies 4-14**: silenci, accés només a entrades.
- **Dia 14-30**: reobertura o tancament amb devolució en 30-60 dies.

Minimització: secundari actiu des del dia 1, tots dos en ús lleuger continu, extractes PDF mensuals desats, mini-dossier per client.
### Conversa de les passarel·les: Stripe i companyia

Stripe és el default, però té règim propi de bloquejos: **rolling reserves del 5-10 %** durant 90-120 dies i possibilitat de congelar fons.

- **No connectis Stripe a un sol compte**.
- **Descriptor Stripe** amb nom comercial real.
- **Alertes de churn** + buffer de 30 dies de payout.

PayPal Business: complement sí, canal únic no.
### Targetes: físiques, virtuals i la regla "una per categoria"

- **Una física**: despesa física (coworking, viatges, dinars amb client).
- **Virtual "SaaS"**: subscripcions recurrents.
- **Virtual "Ads"**: campanyes pagades.
- **Virtual "single-use"**: compres puntuals a proveïdors poc fiables.
### Què hauries d'endur-te

- La pregunta correcta no és "Mercury o Wise", és "**quina stack munto**".
- Mínim: **2 comptes USD + 1 multi-divises + passarel·la + targetes segmentades + reserves**.
- IBAN Wise és belga, no local. Continua subjecte a declaració.
- Bloquejos són rutina previsible. La stack fa la diferència entre molèstia i crisi.
- **Mai barrejar personal i LLC**, segmentar per risc, tax buffer 25-35 %, FX buffer i documentació prepagament: cinc regles que estalvien cinc xifres.

Si tens una LLC i vols que dissenyem amb tu la stack bancària correcta per al teu volum i perfil de risc, **ho veiem junts** en una assessoria gratuïta de 30 minuts. Muntar-la bé surt barat. Muntar-la a mitges i descobrir-ho el dia que Mercury envia el primer "under review" surt car.
## Referències legals i normatives

Aquest article es basa en normativa vigents actualment. Citem les fonts principals per a verificació:

- **EUA.** Treas. Reg. §301.7701-3 (classificació d'entitats / *check-the-box*); IRC §882 (impost sobre rendes d'estrangers connectades amb US trade or business); IRC §871 (FDAP i retencions a no residents); IRC §6038A i Treas. Reg. §1.6038A-2 (Form 5472 per a *25% foreign-owned* i *foreign-owned disregarded entities*); IRC §7701(b) (residència fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report a <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espanya.** Llei 35/2006 (LIRPF), arts. 8, 9 (residència), 87 (atribució de rendes), 91 (transparència fiscal internacional per a persones físiques); Llei 27/2014 (LIS), art. 100 (transparència fiscal internacional per a societats); Llei 58/2003 (LGT), arts. 15 i 16; Llei 5/2022 (règim sancionador del Model 720 després de la STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Models 232 i 720); Ordre HFP/887/2023 (Model 721 cripto).
- **Conveni Espanya–EUA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de 22/12/1990 (CDI original); Protocol en vigor des del 27/11/2019 (renda passiva, *limitation on benefits*).
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

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

## Següents passos

Ara que tens el context complet, el pas següent natural és contrastar-lo amb la teva pròpia situació: què encaixa, què no, i on són els matisos que depenen de la teva residència, la teva activitat i el teu volum. Una revisió ràpida del teu cas sol estalviar molt soroll abans de qualsevol decisió estructural.

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

Les obligacions davant la FinCEN i l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> s'han mogut en recent years; aquest és l'estat vigent:

### Punts clau

- **BOI / Corporate Transparency Act: la teva LLC NO està obligada (un avantatge competitiu).** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a les "foreign reporting companies"** (entitats constituïdes FORA dels EUA i registrades per operar en un estat). Una **LLC formada als EUA propietat d'un no resident NO presenta el BOI Report**: un tràmit menys al calendari, menys burocràcia i una estructura més neta que mai. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament. L'estat normatiu pot canviar: **monitoritzem FinCEN.gov en cada presentació** i, si l'obligació torna a aplicar, la gestionem sense cost addicional. Estat vigent verificable a [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Per a una **Single-Member LLC propietat d'un no resident**, les regulacions finals Treas. Reg. §1.6038A-1 (vigents des de 2017) tracten la LLC com a corporation a efectes del 5472. Procediment: **Form 1120 pro-forma** (només capçalera: nom, adreça, EIN, exercici) amb **Form 5472 annexat**. Enviament **per correu certificat o fax a l'IRS Service Center d'Ogden, Utah**, **no via MeF/e-file** estàndard. Venciment: **15 d'abril**; pròrroga via **Form 7004** fins al **15 d'octubre**. **Sanció: 25.000 USD per formulari i any, més 25.000 USD per cada 30 dies addicionals** de no presentació després de notificació de l'IRS.
- **Form 1120 substantiu.** Només aplica si la LLC ha fet check-the-box election a C-Corp (Form 8832): tributa al 21 % federal i presenta un 1120 amb xifres reals. La LLC disregarded estàndard **no presenta un 1120 substantiu i no paga corporate tax federal**.
- **EIN i notificacions.** Sense EIN no es pot presentar el 5472 ni el BOI. L'IRS no avisa abans de sancionar; es descobreix quan l'EIN queda bloquejat o una presentació posterior és rebutjada.
## El que t'has d'endur

Tractem aquest bloc com una de les decisions que sostenen l'estratègia LLC: errar aquí i la resta de l'estructura perd fiscalitat, accés bancari o compliance. Les notes que segueixen reflecteixen el que fem realment amb clients en aquest cas concret, prioritzant les variables que mouen el resultat.

## Fets bancaris i fiscals que convé precisar

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.

## Fets jurídics i de procediment

El que segueix és la visió operativa, no la dels manuals. Hem executat aquesta jugada prou vegades per saber quines variables cedeixen primer sota l'escrutini d'una autoritat fiscal o d'una compliance bancària, i és en aquest ordre que les abordem.

<!-- exentax:execution-v2 -->
## Wise + bancs per a LLC: el stack bancari complet que hauria de tenir qualsevol no resident

La pregunta "Mercury o Wise?" està mal plantejada. La resposta correcta és "tots dos, més Stripe, més una alternativa".

- **Capa 1: compte operativa principal (Mercury).** Rep Stripe payouts, paga vendors via ACH gratuït, targeta USD, integra QuickBooks.
- **Capa 2: respatller i multi-divisa (Wise Business).** USD/EUR/GBP. Rep clients UE directament en EUR (SEPA local, no SWIFT). Si Mercury tanca, Wise continua.
- **Capa 3: gateway de cobrament (Stripe + alternatiu).** Stripe US connectat a Mercury. Lemon Squeezy/Dodo com a MoR per a vendes digitals UE.
- **Capa 4: tresoreria i FX optimitzat.** Compte Wise EUR per a reserves.

### Stack complet típic

LLC Wyoming + EIN + Mercury + Wise Business + Stripe + Lemon Squeezy + PayPal. Cost mensual ~50-100$ per a volum &lt;100k$/any.

### El que més ens pregunten

**Mercury o Wise per a Stripe payout?** Mercury una mica més ràpid.

**Brex/Ramp per a LLC petita?** Típicament no per sota de 500k$/any.

A Exentax muntem el stack complet en setup paquetitzat.
<!-- /exentax:execution-v2 -->

## El teu pròxim pas amb Exentax

Tractem aquest bloc com una de les decisions que sostenen l'estratègia LLC: errar aquí i la resta de l'estructura perd fiscalitat, accés bancari o compliance. Les notes que segueixen reflecteixen el que fem realment amb clients en aquest cas concret, prioritzant les variables que mouen el resultat.
## L'stack mínim viable per a una LLC operativa

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.

  ### Stack bancari d'una LLC americana: configuració per a residents a Espanya, Catalunya i Andorra

  Per a un resident fiscal a **Espanya/Catalunya** que opera una LLC americana, l'estructura bancària típica combina tres capes: (1) **Wise Business Europe SA** (registrada a Bèlgica sota BCE 0708.022.075, supervisada pel **Banc Nacional de Bèlgica** com a entitat de diner electrònic en virtut de la PSD2, transposada a Espanya per la **Llei 7/2020 de transformació digital del sistema financer** i el **RDL 19/2018 de serveis de pagament**), (2) **Mercury** com a compte operatiu als EUA (a través de les partner banks **Column N.A.** i **Choice Financial Group**, FDIC #14583), i (3) un compte espanyol per a despeses personals del soci.

  **Obligacions declaratives a Espanya:**

  La titularitat de comptes a institucions financeres estrangeres ha de comunicar-se a l'**AEAT** a través del **Modelo 720** (béns i drets a l'estranger) regulat pel **RD 1065/2007** i modificat per la **Ley 5/2022** que va eliminar les sancions desproporcionades després de la **STJUE C-788/19 de 27/01/2022**. El llindar de declaració és de **€50.000** per cada bloc patrimonial (comptes, valors, immobles). El **Modelo 721** específic per a criptoactius a l'estranger és obligatori des de l'1 de gener de 2024 nos termes de l'**OM HFP/886/2023**.

  Els rendiments de la LLC s'imputen segons el règim de **transparència fiscal internacional de l'art. 100 LIRPF** quan la LLC tingui més del 50 % dels seus ingressos en jurisdiccions de baixa tributació. La **doctrina de la DGT V0290-20** confirma el tractament transparent de les LLCs unipersonals des del punt de vista espanyol. El crèdit per impost pagat als EUA es declara al **Modelo 100** segons el **conveni Espanya-EUA (BOE 22/12/1990) amb el Protocol de 27/11/2019 en vigor des de 27/11/2019**.

  **Andorra:**

  Per a residents fiscals a **Andorra**, l'estructura bancària segueix la **Llei 8/2013 sobre els requisits organitzatius i les condicions de funcionament de les entitats operatives del sistema financer** i la **Llei 14/2017 de prevenció del blanqueament de capitals**. La supervisió correspon a l'**Autoritat Financera Andorrana (AFA)**. El **conveni Andorra-EUA en vigor des de l'1 de gener de 2024** elimina la doble imposició sobre dividends i interessos qualificats provinents d'estructures LLC, i el **conveni Andorra-Espanya (BOE 07/12/2015) amb Protocol de 03/05/2023** regula la fiscalitat dels fluxos transfrontèrers entre tots dos països. Les aplicacions financeres a l'estranger s'integren a la **declaració de l'IRPF andorrà (Llei 5/2014)** com a rendiments del capital mobiliari.

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
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Quan%20alg%C3%BA%20obre%20una%20LLC%20des%20de%20fora%20dels%20EUA%2C%20la%20conversa%20banc%C3%A0ria%20es%20redueix%20%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

`;