export default `

Tancar una LLC ben fet és tan important com obrir-la. La majoria d'informació que circula sobre LLCs parla de com constituir-la, com triar estat, com obrir compte a Mercury o Wise Business... però gairebé ningú explica com es **tanca** correctament. I, tanmateix, una LLC mal dissolta segueix generant obligacions, sancions, comissions i, en el pitjor dels casos, una ombra fiscal als EUA que pot perseguir-te durant anys.

Aquesta guia explica el procés real i complet per **dissoldre i tancar la teva LLC americana**: quan convé fer-ho, com s'ordena el tancament estat per estat, quines declaracions finals presenta l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, què passa amb el teu EIN, què es fa amb el teu BOI Report, com es cancel·len els teus comptes bancaris i per què hi ha un ordre estricte que no s'ha d'alterar. Si ja no operes amb la teva LLC i vols oblidar-te'n sense ensurts a tres anys vista, aquest és el camí.

## Per què tancar formalment una LLC en lloc de "deixar-la morir"

La fantasia clàssica del qui es cansa de la seva LLC és: *"si no la faig servir, la deixo i ja està, deixaran d'existir les obligacions soles"*. No funciona així. Una LLC, mentre estigui **activa o en estat "delinquent"** al seu registre estatal, segueix generant:

- **Annual report fees** estatals (de 50 a 800 USD segons estat).
- **Franchise tax** a Delaware (300 USD/any) i Califòrnia (800 USD/any), entre d'altres.
- **Registered Agent fees** anuals (50-150 USD/any).
- **Form 5472 + 1120 pro forma** davant l'IRS si la LLC té propietari estranger únic, amb la **sanció de 25.000 USD per formulari no presentat** (Internal Revenue Code §6038A(d)).
- **BOI Report (<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>)** si la teva LLC segueix obligada sota la normativa vigent.
- Possibles quotes de comptes bancaris a Mercury, Wise Business, Relay o Slash.

Si la LLC passa a estat *delinquent* o *administratively dissolved* per impagament d'annual report, això **no t'eximeix** de les obligacions IRS ni de les sancions meritades. L'única cosa que fa és complicar-te la vida quan finalment intentis tancar-la bé o, pitjor encara, quan vulguis muntar una altra LLC anys després i descobreixis que figures com a propietari d'una entitat amb sancions acumulades. La millor estratègia, amb diferència, és **fer un tancament formal i net** en l'ordre correcte.
### Abans de començar: el tancament només es fa quan es té clar

No totes les "ganes de tancar" són ganes reals de tancar. Abans d'iniciar el procés, convé comprovar que el tancament té sentit davant les alternatives:

- **Pausar operacions temporalment**, mantenint la LLC viva però amb zero activitat, presentant 5472 + 1120 amb zeros i BOI report si aplica. És l'opció raonable si creus que en menys de dos anys podries tornar a fer-la servir.
- **Canviar estructura** (de single-member a multi-member, o constituir una nova entitat i traspassar contractes) si el que canvia és el model de negoci, no la voluntat de seguir.
- **Migrar d'estat** mitjançant *domestication* o *conversion* si el que pesa són les taxes o el reporting del teu estat actual.

Si després de revisar aquestes opcions segueixes volent tancar, aquest és el procediment. Cada cas és individual, així que convé revisar el teu amb un assessor abans d'executar.
### Visió general: l'ordre del tancament importa

El tancament d'una LLC es compon de **set blocs** que s'han d'executar en aquest ordre. Saltar-se'n un o invertir l'ordre sol provocar costos innecessaris o finestres en què la LLC segueix generant obligacions sense que tu l'estiguis gestionant ja:

1. Decisió formal de dissoldre (interna).
2. Liquidació d'operacions (clients, contractes, deutes, actius).
3. Tancament de comptes bancaris i passarel·les de pagament.
4. Presentació de declaracions finals davant l'IRS (Form 1120 + 5472 marcats *Final return*).
5. Dissolució estatal (Articles of Dissolution o Certificate of Cancellation).
6. Tancament de l'EIN davant l'IRS i baixa del BOI Report davant FinCEN quan procedeixi.
7. Cancel·lació del Registered Agent i arxiu documental personal.

Vegem cada bloc amb el detall real que importa.
## Punts clau

### 1. Decisió interna i Operating Agreement

Encara que la teva LLC sigui *single-member* i tu siguis el propietari únic, la decisió formal de dissoldre ha de quedar documentada. És el que el teu operating agreement, si està ben redactat, demana explícitament:

- **Resolution to dissolve**: document intern on el membre únic decideix dissoldre la LLC, amb data efectiva.
- Si la LLC és *multi-member*, cal el vot segons el percentatge exigit per l'operating agreement (habitualment unanimitat o majoria qualificada).

Aquest document no es presenta davant l'IRS ni davant l'estat, però és la prova interna que la decisió existeix i que el tancament s'executa de bona fe. Si en el futur algú et pregunta quan vas deixar d'operar la LLC, aquesta data és la que val.
### 2. Liquidació operativa: clients, deutes i actius

Abans de tocar res amb l'IRS o amb l'estat, cal **deixar la LLC buida**:

- **Tancament de contractes amb clients i proveïdors.** Notificar el cessament d'activitat. Emetre les últimes factures. Cobrar el pendent.
- **Cancel·lació de subscripcions** (Stripe, PayPal, eines SaaS, dominis facturats a la LLC, hosting).
- **Pagament de deutes pendents** (impostos estatals, Registered Agent, factures, royalties, comissions).
- **Distribució d'actius restants al membre** (transferència del cash romanent des del compte de la LLC al teu compte personal). En una single-member LLC tributada com a disregarded entity, aquesta distribució no és un esdeveniment fiscal estatunidenc per a l'IRS, però **sí ha de documentar-se** com a retirada del membre.
- **Conservació de la comptabilitat** (factures emeses i rebudes, extractes bancaris, comprovants) durant almenys **set anys**. És el termini raonable per cobrir auditories, interessos i possibles requeriments.

Un cop la LLC està buida i sense contractes vius, podem passar al tancament bancari.
### 3. Tancament de comptes bancaris i passarel·les de pagament

El tancament del compte bancari és el punt on més errors es cometen. La regla pràctica:

- **Moure tot el cash a un compte personal del membre** abans de demanar el tancament.
- **Sol·licitar el tancament per escrit** des del dashboard del banc/fintech. Mercury, Wise Business, Relay i Slash tenen fluxos de tancament en línia. Wallester gestiona el tancament per la seva àrea de suport.
- **Esperar al tancament confirmat** abans de presentar la dissolució estatal. Si presentes la dissolució estatal i el banc descobreix que l'entitat ja no existeix legalment, sol bloquejar moviments pendents.
- **Descarregar tots els extractes** (almenys set anys cap enrere) abans de tancar el compte. Un cop tancada, recuperar-los pot ser impossible o costós.
- **Cancel·lar Stripe, PayPal i passarel·les** vinculades a la LLC i descarregar l'històric de moviments.

> Si la teva arquitectura actual és Wise Business + Relay + Slash amb Mercury de respatller, aquest és exactament l'ordre invers de tancament: primer les passarel·les, després les fintech secundàries, i al final el compte principal pel qual passa l'últim cash. Wallester, si el tens amb IBAN europeu, sol ser dels últims a tancar-se i ha de revisar-se a la llum de les teves obligacions CRS a Espanya.
### 4. Declaracions finals davant l'IRS

Aquí és on molts tancaments es trenquen. La LLC, abans de morir, ha de presentar la seva **última temporada IRS**, marcant els formularis com a **Final return**:

- **Form 1120 + Form 5472 (Final)** si la teva LLC és single-member amb propietari estranger. La casella *"Final return"* del Form 1120 ha d'estar marcada i la informació reportable del Form 5472 ha d'incloure la **distribució final** del cash al membre.
- **Form 1065 (Final)** si la teva LLC era multi-member tributant com a partnership.
- **Form 1120 o 1120-S (Final)** si vas triar tributar com a C-corp o S-corp.
- **Form 966 (Corporate Dissolution or Liquidation)** dins dels **30 dies** següents a l'adopció de la resolució de dissolució, si la LLC tributava com a corporació.
- **Form 941 / 940 final** si tenies empleats.
- Qualsevol formulari informatiu pendent (1099, W-2, 8804/8805 si aplica).

La data clau és: presentar les declaracions finals **abans de demanar el tancament de l'EIN**. Si demanes el tancament de l'EIN sense haver presentat els models finals, l'IRS no tanca l'EIN i, pitjor encara, et pot generar una notice de non-filer l'any següent.

Si fa anys de la LLC i has acumulat retards al 5472, **el correcte és regularitzar abans de tancar**, no tancar per tapar. Tens detall del risc concret a la <a href="/ca/blog/que-passa-si-no-presentes-el-form-5472-multes-irs-i-com">guia de sancions del Form 5472</a>. Tancar una LLC amb 5472 pendents no extingeix les sancions meritades; només les congela i se les queda l'IRS contra tu com a persona física associada a l'EIN.
### 5. Dissolució estatal: Articles of Dissolution o Certificate of Cancellation

Amb el cash distribuït, els comptes tancats i les declaracions finals presentades, passem al **tancament estatal**. El nom exacte del document depèn de l'estat:

- **Wyoming**: *Articles of Dissolution* davant el Wyoming Secretary of State. Abans de presentar-los cal estar al corrent de l'**annual report** i del **license tax**. Cost habitual: 60 USD.
- **Nou Mèxic**: *Articles of Dissolution* davant la New Mexico Secretary of State. La LLC ha d'estar al dia amb qualsevol impost estatal aplicable. Cost habitual: 25 USD.
- **Delaware**: *Certificate of Cancellation* davant la Delaware Division of Corporations. Cal pagar **el franchise tax pendent i el de l'any del tancament** abans de cancel·lar. Cost de cancel·lació: 200 USD; el franchise tax afegit (300 USD/any) se suma.
- **Florida**: *Articles of Dissolution* davant la Florida Division of Corporations.
- **Califòrnia**: si hi va haver nexus a Califòrnia, cal pagar el **800 USD de franchise tax mínim de l'any del tancament** a més de presentar Form 568 final.
- **Altres estats**: cadascun té el seu propi formulari i taxes; la lògica és la mateixa.

Un detall important: si la teva LLC està **registrada com a foreign LLC en altres estats** (perquè vas fer *foreign qualification* per vendre a Califòrnia, Texas, NY, etc.), abans de tancar a l'estat *home* has de **cancel·lar cada foreign registration**. Altrament, aquests estats et seguiran cobrant annual reports i franchise taxes durant anys.
### 6. Tancament de l'EIN i baixa del BOI Report

Un cop la LLC ja no existeix legalment (estat dissolt + declaracions finals presentades), l'últim pas amb l'IRS és **tancar l'EIN**. Tècnicament, l'IRS no "elimina" un EIN: el marca com a inactiu. Per fer-ho, s'envia una **carta signada al Internal Revenue Service** identificant l'entitat per nom legal, EIN, adreça i motiu del tancament, adjuntant còpia de la *Notice CP-575* original o, si no, les dades d'assignació de l'EIN.

En paral·lel, cal revisar el **BOI Report davant FinCEN**. La normativa BOI (Beneficial Ownership Information) vigent exigeix reports inicials i d'actualització; quan la LLC es dissol, convé actualitzar el report per reflectir el cessament, dins dels terminis establerts per FinCEN. El règim BOI ha tingut canvis i suspensions recents, així que convé comprovar la regla aplicable en el moment exacte del tancament.

Si tens ITIN propi o hi ha socis amb ITIN associats a la LLC, aquests ITINs no es "tanquen" amb la LLC: segueixen sent vàlids per a la teva activitat personal als EUA mentre els facis servir cada cert temps (vegeu <a href="/ca/blog/com-obtenir-itin-numero-fiscal-irs">guia de l'ITIN</a>).
### 7. Registered Agent, dominis i arxiu personal

Per tancar el cercle:

- **Cancel·lar el Registered Agent**: notifica-ho per escrit i demana la confirmació de cancel·lació. Si el teu Registered Agent renova per defecte cada any, això és el que evita una factura sorpresa l'any següent.
- **Cancel·lar dominis i serveis** facturats a nom de la LLC.
- **Arxivar la documentació final** en un lloc segur: operating agreement original, articles of organization, articles of dissolution segellats, EIN confirmation, còpia de les declaracions finals (1120, 5472, 1065, 966), extractes bancaris, contractes tancats. Mínim set anys.

Amb això, la LLC està clínicament tancada.
### Errors típics que veiem en tancar una LLC

A Exentax hem vist tancaments executats al revés desenes de vegades. Els sis errors més cars:

1. **Tancar el banc abans de presentar el 5472 final.** Després és difícil documentar l'última distribució.
2. **Demanar la dissolució estatal sense pagar el franchise tax pendent** (Delaware i Califòrnia són els més estrictes).
3. **Oblidar cancel·lar les foreign qualifications** en altres estats.
4. **No marcar Final return al 1120 / 1065.** L'IRS segueix esperant declaració l'any següent.
5. **No actualitzar el BOI Report** quan la normativa ho exigeix.
6. **No conservar els extractes bancaris** descarregats abans del tancament.

Cadascun d'aquests errors es tradueix en factures, sancions o requeriments mesos o anys després.
## Com ho fem a Exentax

El nostre procés de **tancament de LLC clau en mà** segueix exactament els set passos d'aquesta guia. Tu ens dones el context (estat, any de constitució, situació bancària, declaracions presentades, possibles retards), nosaltres dissenyem l'ordre de tancament, executem les declaracions finals, coordinem amb el teu Registered Agent i amb els teus bancs, presentem la dissolució estatal, tanquem l'EIN i, si procedeix, actualitzem el BOI Report. Si fa anys que portes 5472 endarrerits i necessites regularitzar abans de tancar, ho fem com a **fase prèvia** del tancament per no arrossegar exposició.

Si vols tancar la teva LLC amb seguretat, demana una consulta gratuïta: revisem la teva situació, et diem honestament si té més sentit tancar o pausar, i si seguim endavant t'entreguem un pla de tancament amb dates i pressupost tancat. I si el que estàs pensant és just el contrari, que la LLC segueix tenint sentit però vols rebaixar costos i obligacions, prova abans la nostra <strong>calculadora fiscal</strong> i compara la teva situació actual amb l'escenari de mantenir-la activa amb l'estructura adequada: <a href="/ca/blog/wise-bancs-i-llc-la-stack-bancaria-completa-que-ningu-no">Wise Business, Relay i Slash com a comptes operatius, Mercury com a respatller, i Wallester només quan apliqui IBAN europeu</a> amb la seva corresponent anàlisi CRS.

Tancar bé una LLC és un acte d'higiene fiscal: ordena el teu passat i allibera el teu futur. Val la pena fer-ho en l'ordre correcte i amb qui ho ha fet centenars de vegades.
## Compliance fiscal al teu país: CFC, TFI i atribució de rendes

Una LLC americana és una eina legal i reconeguda internacionalment. Però el compliment no acaba en constituir-la: com a propietari resident fiscal en un altre país, l'administració tributària local manté el dret a gravar el que la LLC genera. L'important és saber **sota quin règim**.

### Per jurisdicció

- **Espanya (LIRPF/LIS).** Si la LLC és una *Single-Member Disregarded Entity* operativa (serveis reals, sense passivitat significativa), Hisenda la tracta normalment per **atribució de rendes (art. 87 LIRPF)**: els beneficis nets s'imputen al soci l'exercici en què es generen, integrant-se a la base general de l'IRPF. Si la LLC opta per tributar com a *corporation* (Form 8832) i queda controlada per resident espanyol amb rendes majoritàriament passives, pot activar-se la **transparència fiscal internacional (art. 91 LIRPF per a persones físiques, art. 100 LIS per a societats)**. La diferència no és opcional: depèn de la substància econòmica, no del nom.
- **Models informatius.** Comptes als EUA amb saldo mitjà o final >50.000 € a l'exercici: **Model 720** (Llei 5/2022 després de la STJUE C-788/19, 27/01/2022, sancions ara dins del règim general LGT). Operacions vinculades amb la LLC i dividends repatriats: **Model 232**. Criptoactius custodiats als EUA: **Model 721**.
- **CDI Espanya–EUA.** El conveni (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol en vigor 27/11/2019) ordena la doble imposició sobre dividends, interessos i royalties. Una LLC sense establiment permanent a Espanya no constitueix per si sola EP del soci, però la direcció efectiva sí pot crear-lo si tota la gestió es fa des de territori espanyol.
- **Mèxic, Colòmbia, Argentina i altres LATAM.** Cada jurisdicció té el seu propi règim CFC (Mèxic: Refipres; Argentina: rendes passives de l'exterior; Xile: art. 41 G LIR). El principi comú: el que la LLC reté com a benefici es considera percebut pel soci si l'entitat es considera transparent o controlada.
La regla pràctica: una LLC operativa, amb substància, declarada correctament en residència, és **planificació fiscal legítima**. Una LLC que s'utilitza per ocultar ingressos, simular no-residència o desplaçar rendes passives sense justificació econòmica entra al terreny de l'**art. 15 LGT (conflicte en aplicació de la norma)** o, en el pitjor cas, de l'**art. 16 LGT (simulació)**. La diferència la marquen els fets, no el paper.

<!-- exentax:lote30-native-v1:como-disolver-cerrar-llc-paso-a-paso-ca -->
## Com llegir el tancament de la LLC com una seqüència documentada en lloc d'un final sobtat

El tancament de la LLC es llegeix de manera més útil com una seqüència documentada — declaracions finals, dissolució davant l'Estat, arxivament dels registres — en lloc d'un final sobtat. La seqüència no canvia amb la mida de la LLC, i una nota curta i datada al dossier de la LLC que registri cada pas amb la seva referència de confirmació fa el tancament defensable en pocs minuts en una conversa posterior amb un assessor o en una interacció amb una administració.
<!-- /exentax:lote30-native-v1:como-disolver-cerrar-llc-paso-a-paso-ca -->

<!-- exentax:lote30-native-v1-bis:como-disolver-cerrar-llc-paso-a-paso-ca -->
## Per què la nota s'organitza per pas de la seqüència i no per la data de tancament

La nota s'organitza per pas de la seqüència — declaracions finals, dissolució, arxivament — i no per la data de tancament, perquè la seqüència es manté igual independentment del calendari escollit, i aquesta visió fa cada pas verificable de manera independent.

Una nota curta i datada per pas al dossier de la LLC n'hi ha prou per reconstruir el procés de tancament en pocs minuts.
<!-- /exentax:lote30-native-v1-bis:como-disolver-cerrar-llc-paso-a-paso-ca -->

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

A Exentax muntem l'estructura perquè encaixi al primer escenari i documentem cada pas perquè la teva declaració local sigui defensable davant d'una eventual revisió.

<!-- exentax:legal-refs-v1 -->
## Referències legals i normatives

Aquest article es basa en normativa vigents actualment. Citem les fonts principals per a verificació:

- **EUA.** Treas. Reg. §301.7701-3 (classificació d'entitats / *check-the-box*); IRC §882 (impost sobre rendes d'estrangers connectades amb US trade or business); IRC §871 (FDAP i retencions a no residents); IRC §6038A i Treas. Reg. §1.6038A-2 (Form 5472 per a *25% foreign-owned* i *foreign-owned disregarded entities*); IRC §7701(b) (residència fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report a FinCEN).
- **Espanya.** Llei 35/2006 (LIRPF), arts. 8, 9 (residència), 87 (atribució de rendes), 91 (transparència fiscal internacional per a persones físiques); Llei 27/2014 (LIS), art. 100 (transparència fiscal internacional per a societats); Llei 58/2003 (LGT), arts. 15 i 16; Llei 5/2022 (règim sancionador del Model 720 després de la STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Models 232 i 720); Ordre HFP/887/2023 (Model 721 cripto).
- **Conveni Espanya–EUA.** BOE de 22/12/1990 (CDI original); Protocol en vigor des del 27/11/2019 (renda passiva, *limitation on benefits*).
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Directiva (UE) 2011/16, modificada per DAC6 (mecanismes transfronterers), DAC7 (Directiva (UE) 2021/514, plataformes digitals) i DAC8 (criptoactius); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetries híbrides); Estàndard Comú de Reporte (CRS) de l'OCDE.
- **Marc internacional.** Model de Conveni OCDE, art. 5 (establiment permanent) i comentaris; Acció 5 BEPS (substància econòmica); FATF Recommendation 24 (titularitat real).

L'aplicació concreta de qualsevol d'aquestes normes al teu cas depèn de la teva residència fiscal, l'activitat de la LLC i la documentació que mantinguis. Aquest contingut és informatiu i no substitueix l'assessorament professional personalitzat.

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

<!-- exentax:legal-facts-v1 --><!-- exentax:execution-v2 -->
## La seqüència exacta per tancar una LLC sense deixar caps solts

Dissoldre malament una LLC costa més que constituir-la. Hi ha tres plans a tancar simultàniament - estatal, federal i bancari - i un ordre que importa. Aquesta és la seqüència que apliquem a Exentax quan un client decideix tancar.

- **Pas 1 - Decisió documentada.** Acta de dissolució signada pels membres, amb data clara i motiu. Si la LLC té Operating Agreement, cal seguir el procediment; si no, s'aplica la llei de l'estat. Sense acta no es tanca res després.
- **Pas 2 - Articles of Dissolution a l'estat.** Wyoming: 50 USD; New Mexico: 25 USD; Delaware: 200 USD més franchise tax pendent. La dissolució té efecte a la data aprovada pel Secretary of State, no abans. A partir d'aquell moment la LLC entra en wind-up: pot liquidar però no operar nou negoci.
- **Pas 3 - Liquidació operativa.** Cobrar factures pendents, pagar proveïdors, retornar dipòsits, cancel·lar SaaS, tancar targetes, buidar Mercury/Wise dins del wind-up. Convé tancar comptes bancaris després del darrer pagament, no abans - sense compte no pots cobrar última factura.
- **Pas 4 - Final Form 5472 + 1120 pro-forma.** Marca la casella "Final Return" als dos. Sense això, l'IRS continua esperant 5472 cada any amb multa de 25.000 USD per omissió. L'error més car i més comú.
- **Pas 5 - BOI Final Report.** FinCEN exigeix informe final de BOI en cessar l'entitat, dins dels 30 dies posteriors a la dissolució estatal. Sense això, sancions civils possibles.
- **Pas 6 - Cancel·lació EIN (opcional).** Carta a l'IRS sol·licitant tancament del compte EIN. No és estrictament obligatori (l'EIN persisteix però queda inert), però recomanable per neteja administrativa.

### El que més ens pregunten

**Quant triga a tancar-se una LLC?** Entre 6 i 14 setmanes des de la decisió fins al darrer tràmit. La dissolució estatal es processa en 2-4 setmanes; el 5472 final es presenta amb la propera finestra fiscal (15 d'abril en any natural).

**I si fa anys que no presento el 5472 i vull tancar?** Cal regularitzar primer els anys endarrerits via voluntary disclosure. La dissolució sense regularització no extingeix les multes - queden a nom del responsible party. Ho gestionem amb un protocol conjunt de regularització + tancament.

A Exentax tanquem LLCs cada mes i lliurem el dossier complet (acta, articles, 5472 final, BOI final, tancament EIN) signat i arxivat perquè el client pugui demostrar la dissolució neta davant qualsevol requeriment futur.
<!-- /exentax:execution-v2 -->

## Fets legals i de procediment

Les obligacions davant la FinCEN i l'IRS han evolucionat els darrers anys; aquest és l'estat vigent:

### Punts clau

- **BOI / Corporate Transparency Act: la teva LLC NO està obligada (un avantatge competitiu).** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a les "foreign reporting companies"** (entitats constituïdes FORA dels EUA i registrades per operar en un estat). Una **LLC formada als EUA propietat d'un no resident NO presenta el BOI Report**: un tràmit menys al calendari, menys burocràcia i una estructura més neta que mai. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament. L'estat normatiu pot canviar: **monitoritzem FinCEN.gov en cada presentació** i, si l'obligació torna a aplicar, la gestionem sense cost addicional. Estat vigent verificable a [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Per a una **Single-Member LLC propietat d'un no resident**, les regulacions finals Treas. Reg. §1.6038A-1 (vigents des de 2017) tracten la LLC com a corporation a efectes del 5472. Procediment: **Form 1120 pro-forma** (només capçalera: nom, adreça, EIN, exercici) amb **Form 5472 annexat**. Enviament **per correu certificat o fax a l'IRS Service Center d'Ogden, Utah**, **no via MeF/e-file** estàndard. Venciment: **15 d'abril**; pròrroga via **Form 7004** fins al **15 d'octubre**. **Sanció: 25.000 USD per formulari i any, més 25.000 USD per cada 30 dies addicionals** de no presentació després de notificació de l'IRS.
- **Form 1120 substantiu.** Només aplica si la LLC ha fet check-the-box election a C-Corp (Form 8832): tributa al 21 % federal i presenta un 1120 amb xifres reals. La LLC disregarded estàndard **no presenta un 1120 substantiu i no paga corporate tax federal**.
- **EIN i notificacions.** Sense EIN no es pot presentar el 5472 ni el BOI. L'IRS no avisa abans de sancionar; es descobreix quan l'EIN queda bloquejat o una presentació posterior és rebutjada.

Vols aplicar aquest protocol al teu cas? <a href="/ca/agendar">Reserva una sessió amb l'equip d'Exentax</a> i revisem la teva LLC amb números reals en trenta minuts, sense compromís.


<!-- exentax:cross-refs-v1 -->
## Per continuar la lectura

- [Errors crítics si ja tens una LLC i ningú no t'ho ha explicat](/ca/blog/errors-critics-si-ja-tens-una-llc-i-ningu-tho-ha-explicat)
- [Manteniment anual de la LLC: obligacions que no pots ignorar](/ca/blog/manteniment-anual-de-la-llc-obligacions-que-no-pots-ignorar)
- [Canviar de proveïdor de manteniment de la LLC sense perdre històric](/ca/blog/canviar-de-proveidor-de-manteniment-de-la-llc-sense-perdre)
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

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22como%20disolver%20cerrar%20llc%20paso%20a%20paso%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.

<!-- exentax:conv-fill-v1 -->
O truca'ns directament al <a href="tel:+34614916910">+34 614 916 910</a> si prefereixes parlar.

Per a detalls per estat, consulta la nostra <a href="/ca/serveis/llc-wyoming">pàgina del servei LLC a Wyoming</a> amb costos i terminis tancats.

Si la teva prioritat és l'ITIN, consulta <a href="/ca/serveis/obte-el-teu-itin">Obté el teu ITIN amb Exentax</a> i ho gestionem en paral·lel.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

`;
