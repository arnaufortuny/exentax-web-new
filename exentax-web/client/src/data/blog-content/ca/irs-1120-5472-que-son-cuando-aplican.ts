export default `Hi ha dos formularis de l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> que generen més confusió que cap altre entre propietaris de LLC: el **Form 1120** i el **Form 5472**. La majoria de persones amb LLC els sent anomenar junts, no entén del tot què és cadascun i, sobretot, **no sap quan apliquen exactament al seu cas**.

Aquest article no és l'enèsima guia pas a pas. Si vols el procediment de presentació, ja tens la <a href="/ca/blog/form-5472-que-es-qui-lha-de-presentar-i-com-complir">guia operativa del Form 5472</a>. Aquí expliquem què són **realment** els dos formularis, com es relacionen, quan apliquen segons el perfil i quins errors costen diners.

## Què és realment el Form 1120

El **Form 1120, U.S. Corporation Income Tax Return** és la declaració federal d'impost sobre societats per a corporacions americanes. En el seu ús "normal", el presenta una **C-Corporation** per liquidar el seu impost sobre beneficis (21 % federal actualment, més impostos estatals).

Aquí ve el primer matís que gairebé ningú no t'explica: el Form 1120 també es fa servir **buit, com a sobre**, perquè certes LLC compleixin obligacions d'informació. És el **1120 pro-forma**, que veurem més avall.

Mapa ràpid:
- **C-Corporation operativa** → Form 1120 amb xifres reals.
- **Single-Member LLC de no resident** → **Form 1120 pro-forma** (la majoria de camps en blanc) amb Form 5472 annexat.
- **Single-Member LLC de resident americà** → en general, no presenta 1120; ingressos al Schedule C del 1040 personal.
- **Multi-Member LLC** → tampoc fa servir el 1120 per defecte; presenta Form 1065 (partnership), llevat d'opció per tributació com a corporation.
## Què és realment el Form 5472

El **Form 5472, Information Return of a 25% Foreign-Owned U.S. Corporation or a Foreign Corporation Engaged in a U.S. Trade or Business** és una **declaració informativa, no recaptatòria**. No paga cap impost. La seva missió és informar l'IRS de les **transaccions entre l'entitat americana i parts relacionades estrangeres**.

Per a la majoria dels nostres clients a Exentax, aquesta "entitat americana" és una **Single-Member LLC** propietat d'un no resident, i la "part relacionada estrangera" és **el mateix propietari**. Les "transaccions" són qualsevol moviment de diners entre tu i la LLC: aportacions inicials, transferències de la LLC al teu compte personal, pagaments puntuals, préstecs.

Per què importa? Perquè des del 2017 les **disregarded entities propietat d'estrangers** es tracten com corporations a efectes del 5472. Això vol dir que tot i que la teva LLC no pagui impost federal, **sí està obligada a reportar qui la posseeix i com s'ha mogut diners amb tu**. Si no el presentes, la sanció base és de **25 000 USD per formulari i any**.
### La trampa del "1120 pro-forma"

Aquí és on la gent es perd. La teva Single-Member LLC de no resident:

1. **No paga impost federal sobre societats** sobre rendes sense connexió efectiva amb els EUA.
2. Però **sí ha de presentar un Form 1120 a l'any, en blanc**, perquè faci de sobre del Form 5472.

Es diu **Form 1120 pro-forma**. Només es complimenten els camps identificatius de dalt ("Foreign-owned U.S. DE"), s'escriu a mà "Form 1120, Foreign-owned U.S. DE" a la part superior i s'annexa el Form 5472. La resta del 1120 va buit (sense Schedule M, sense balanç, sense càlcul d'impost).

Si el teu proveïdor et va dir "no has de presentar res perquè no pagues impostos", **està confonent "no pagar" amb "no informar"**. Són coses diferents.
### Quan apliquen exactament? Taula per perfil

| Perfil | Form 1120? | Form 5472? | Comentari |
|---|---|---|---|
| Single-Member LLC, propietari no resident, sense moviments | Sí, pro-forma | No | Molt rar: només obrir el banc ja genera moviment |
| Single-Member LLC, propietari no resident, amb moviments | **Sí, pro-forma** | **Sí** | Cas típic Exentax |
| Single-Member LLC, propietari resident als EUA | No | No | Schedule C del 1040 |
| Multi-Member LLC, tots no residents | No (Form 1065) | Sí, annexat al 1065 | Partnership per defecte |
| LLC amb opció C-Corp (Form 8832) | **Sí, real** | Sí si hi ha foreign related party | 21 % federal |
| C-Corp americana de no resident | Sí, real | Sí si hi ha foreign related party | Estructura diferent |

Gairebé tots els clients d'Exentax amb LLC cauen a la fila 2: **1120 pro-forma + 5472 anuals**.
### "Reportable transactions": què compta i què no

El Form 5472 demana reportar les **reportable transactions** entre la LLC i la part relacionada estrangera:

- Aportacions de capital inicials o posteriors → es reporten.
- Distribucions o "draws" des de la LLC al teu compte personal → es reporten.
- Pagaments de la LLC a empreses/persones relacionades a l'estranger → es reporten.
- Préstecs entre tu i la LLC → es reporten.
- Pagaments per serveis prestats per tu (si factures com a persona física des d'un altre país a la LLC) → es reporten.

No es reporten pagaments a proveïdors **no relacionats** (un freelance extern, un SaaS, un banc). El criteri és **relació**, no nacionalitat.

A la majoria d'inicis, una sola aportació inicial (la transferència de fundació de la LLC) ja activa l'obligació. A partir d'aquí, ja ets dins del règim.
### Terminis, pròrrogues i on enviar

- **Termini estàndard:** 15 d'abril de cada any, per a l'exercici anterior tancat a 31 de desembre.
- **Pròrroga:** sis mesos amb Form 7004, nou termini 15 d'octubre.
- **Forma de presentació:** una LLC de no resident sense obligació d'e-file s'envia habitualment per **correu certificat al IRS Service Center d'Ogden, Utah** o per **fax** al número específic publicat per l'IRS per a foreign-owned DEs. Confirmar sempre adreça/fax vigents de l'any.
- **EIN obligatori:** sense EIN no es pot presentar. A obtenir prèviament (Form SS-4).

Els retards no són barats. La sanció de 25 000 USD per 5472 no presentat **s'aplica també per informació incompleta o inexacta**, no només per absència total.
### Errors típics en preparar 1120 + 5472

1. **Omplir el 1120 pro-forma com si fos un 1120 real.** L'IRS el processa com a C-Corp i s'arma un embolic.
2. **Oblidar que el 5472 va annexat al 1120**, no s'envia sol. Si l'envies sol, no compta com a presentat.
3. **Sense Operating Agreement clar** i reportar transaccions sense documentació. Quan l'IRS demana, no hi ha res per ensenyar.
4. **Barrejar compte personal i LLC** i intentar reconstruir "reportable transactions" a final d'any. Car i malament.
5. **Confiar en "no m'ha arribat res de l'IRS, tot bé".** L'IRS no avisa abans de sancionar.
6. **Presentar el 5472 sense TIN/EIN del propietari estranger.** Tot i ser no resident, el formulari demana identificació.
### Qui NO està obligat (els pocs casos)

- LLC amb diversos membres, classificada com a **partnership**, sense foreign related parties amb reportable transactions (rar si ets estranger).
- Ets resident fiscal als EUA i la teva Single-Member LLC reporta directament al Schedule C del 1040. Aquí no hi ha "foreign-owned DE".
- La teva LLC ha optat per **C-Corp** i ja presenta 1120 real, sense transaccions amb parts relacionades estrangeres (rar).

Fora d'aquests casos, presumir l'exempció és una aposta que no compensa: el cost de bona preparació és **molt inferior** a la sanció mínima.
### Com encaixa això en el teu dia a dia

Si portes correctament l'operativa de la LLC durant l'any (compte separat, registre d'aportacions i retirades, Operating Agreement signat, comptabilitat mínima), preparar el 1120 pro-forma + 5472 al tancament d'any és tranquil. Si arribes al 31 de desembre amb el compte de la LLC barrejat amb el personal, sense documentació i sense saber quins moviments són reportables, el cost i el risc es disparen.

Per això a Exentax tractem aquests formularis com a **subproducte natural** d'una bona gestió anual, no com a drama de març. La diferència és seguir el <a href="/ca/blog/manteniment-anual-de-la-llc-obligacions-que-no-pots-ignorar">calendari anual d'obligacions</a> i mantenir separació efectiva entre el teu patrimoni i el de la LLC.
### Què hauries d'endur-te

- **Form 1120** = declaració d'impost sobre societats. A la teva LLC de no resident es fa servir **buit, com a sobre** del Form 5472.
- **Form 5472** = declaració informativa de transaccions entre la LLC i tu (o qualsevol part relacionada estrangera).
- **Apliquen gairebé sempre** si ets no resident amb Single-Member LLC i has mogut diners entre tu i la LLC.
- **No es paga impost** amb aquests formularis, però **no presentar-los costa 25 000 USD per any**.
- L'error més car és omplir-los malament o arribar al tancament sense la documentació que avala el reportat.

Si tens dubtes sobre si el teu cas està ben plantejat, sobre exercicis passats o sobre com regularitzar formularis endarrerits, **ho revisem amb tu** en una assessoria gratuïta de 30 minuts. Millor entendre-ho bé una vegada que pagar sancions evitables cada any.
## Referències legals i normatives

Aquest article es basa en normativa vigents actualment. Citem les fonts principals per a verificació:

- **EUA.** Treas. Reg. §301.7701-3 (classificació d'entitats / *check-the-box*); IRC §882 (impost sobre rendes d'estrangers connectades amb US trade or business); IRC §871 (FDAP i retencions a no residents); IRC §6038A i Treas. Reg. §1.6038A-2 (Form 5472 per a *25% foreign-owned* i *foreign-owned disregarded entities*); IRC §7701(b) (residència fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report a <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espanya.** Llei 35/2006 (LIRPF), arts. 8, 9 (residència), 87 (atribució de rendes), 91 (transparència fiscal internacional per a persones físiques); Llei 27/2014 (LIS), art. 100 (transparència fiscal internacional per a societats); Llei 58/2003 (LGT), arts. 15 i 16; Llei 5/2022 (règim sancionador del Model 720 després de la STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Models 232 i 720); Ordre HFP/887/2023 (Model 721 cripto).
- **Conveni Espanya–EUA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de 22/12/1990 (CDI original); Protocol en vigor des del 27/11/2019 (renda passiva, *limitation on benefits*).
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Directiva (UE) 2011/16, modificada per DAC6 (mecanismes transfronterers), DAC7 (Directiva (UE) 2021/514, plataformes digitals) i DAC8 (criptoactius); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetries híbrides); Estàndard Comú de Reporte (CRS) de l'OCDE.
- **Marc internacional.** Model de Conveni OCDE, art. 5 (establiment permanent) i comentaris; Acció 5 BEPS (substància econòmica); FATF Recommendation 24 (titularitat real).
L'aplicació concreta de qualsevol d'aquestes normes al teu cas depèn de la teva residència fiscal, l'activitat de la LLC i la documentació que mantinguis. Aquest contingut és informatiu i no substitueix l'assessorament professional personalitzat.
### Següents passos

Ara que tens el context complet, el pas següent natural és contrastar-lo amb la teva pròpia situació: què encaixa, què no, i on són els matisos que depenen de la teva residència, la teva activitat i el teu volum. Una revisió ràpida del teu cas sol estalviar molt soroll abans de qualsevol decisió estructural.

<!-- exentax:legal-facts-v1 -->
## Fets legals i de procediment

Les obligacions davant la FinCEN i l'IRS s'han mogut en recent years; aquest és l'estat vigent:

Abans de continuar, posa números al teu cas: la <a href="/ca#calculadora">calculadora Exentax</a> compara, en menys de 2 minuts, la teva càrrega fiscal actual amb la que tindries operant una LLC nord-americana ben declarada al teu país de residència.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Parla amb el nostre equip</a>
<!-- /exentax:calc-cta-v1 -->

### Punts clau

- **BOI / Corporate Transparency Act: la teva LLC NO està obligada (un avantatge competitiu).** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a les "foreign reporting companies"** (entitats constituïdes FORA dels EUA i registrades per operar en un estat). Una **LLC formada als EUA propietat d'un no resident NO presenta el BOI Report**: un tràmit menys al calendari, menys burocràcia i una estructura més neta que mai. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament. L'estat normatiu pot canviar: **monitoritzem FinCEN.gov en cada presentació** i, si l'obligació torna a aplicar, la gestionem sense cost addicional. Estat vigent verificable a [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Per a una **Single-Member LLC propietat d'un no resident**, les regulacions finals Treas. Reg. §1.6038A-1 (vigents des de 2017) tracten la LLC com a corporation a efectes del 5472. Procediment: **Form 1120 pro-forma** (només capçalera: nom, adreça, EIN, exercici) amb **Form 5472 annexat**. Enviament **per correu certificat o fax a l'IRS Service Center d'Ogden, Utah**, **no via MeF/e-file** estàndard. Venciment: **15 d'abril**; pròrroga via **Form 7004** fins al **15 d'octubre**. **Sanció: 25.000 USD per formulari i any, més 25.000 USD per cada 30 dies addicionals** de no presentació després de notificació de l'IRS.
- **Form 1120 substantiu.** Només aplica si la LLC ha fet check-the-box election a C-Corp (Form 8832): tributa al 21 % federal i presenta un 1120 amb xifres reals. La LLC disregarded estàndard **no presenta un 1120 substantiu i no paga corporate tax federal**.
- **EIN i notificacions.** Sense EIN no es pot presentar el 5472 ni el BOI. L'IRS no avisa abans de sancionar; es descobreix quan l'EIN queda bloquejat o una presentació posterior és rebutjada.
## Fets bancaris i fiscals que convé precisar

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.

## Fets jurídics i de procediment

El que segueix és la visió operativa, no la dels manuals. Hem executat aquesta jugada prou vegades per saber quines variables cedeixen primer sota l'escrutini d'una autoritat fiscal o d'una compliance bancària, i és en aquest ordre que les abordem.

## El teu pròxim pas amb Exentax

Tractem aquest bloc com una de les decisions que sostenen l'estratègia LLC: errar aquí i la resta de l'estructura perd fiscalitat, accés bancari o compliance. Les notes que segueixen reflecteixen el que fem realment amb clients en aquest cas concret, prioritzant les variables que mouen el resultat.
## Quan s'apliquen exactament? Taula per perfil

El que segueix és la visió operativa, no la dels manuals. Hem executat aquesta jugada prou vegades per saber quines variables cedeixen primer sota l'escrutini d'una autoritat fiscal o d'una compliance bancària, i és en aquest ordre que les abordem.

<!-- exentax:execution-v2 -->
## Form 1120 i Form 5472: què són i quan els presenta una LLC de no resident

La combinació 1120 + 5472 és l'obligació informativa central de qualsevol single-member LLC propietat de no resident amb "reportable transactions" amb el seu soci estranger. No genera impost, però la seva omissió activa una multa de 25.000 USD per any i entitat.

- **Form 1120 (pro-forma).** No és la 1120 corporativa típica: una versió simplificada usada per la LLC disregarded com a "vehicle" per acompanyar el 5472. Només es completen dades identificatives (EIN, adreça, any fiscal). Sense càlcul d'impost. Termini: 15 d'abril (o 15 d'octubre amb extensió 7004).
- **Form 5472.** El formulari informatiu real. Reporta qualsevol "reportable transaction" entre la LLC i el soci estranger (25%+ ownership): aportacions de capital, distribucions, préstecs intercompanyies, pagaments per serveis prestats o rebuts, vendes de béns. La xifra reportada no genera impost però permet a l'IRS rastrejar fluxos transfronterers.
- **Quan aplica.** Single-member LLC propietat de no resident (persona física o entitat estrangera) amb almenys una transacció reportable durant l'any fiscal. Si l'any no va moure ni un dòlar, tècnicament no hi ha 5472 - però convé presentar-lo igual amb "0" per mantenir històric net.
- **Multa per omissió.** 25.000 USD per any fiscal i entitat omesa. Multa addicional de 25.000 USD si després de l'avís de l'IRS no es corregeix en 90 dies. La multa informativa més cara per a LLCs de no resident i la més fàcil de prevenir presentant a temps.

### Què ens pregunten més

**He de pagar impost federal amb això?** No, llevat que la LLC tingui ingressos efectivament connectats amb trade or business als EUA (ETBUS). Sense ETBUS i sense US-source income, el resultat federal és 0 i el 1120/5472 és només informatiu.

**Puc presentar-los jo mateix?** Tècnicament sí, però un error en la categorització de transaccions reportables o un dia de retard activa la multa. La majoria de clients prefereix delegar.

A Exentax preparem i presentem el 1120 + 5472 de la teva LLC dins del termini, et guardem el justificant i mantenim l'històric net per a futures inspeccions o due diligence.
<!-- /exentax:execution-v2 -->

## "Reportable transactions": què compta i què no

La nostra posició aquí és deliberadament conservadora: optimitzem allò que sobreviu a una inspecció, no la xifra més agressiva. Els punts següents són els que estem disposats a defensar per escrit.


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
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Hi%20ha%20dos%20formularis%20de%20l'a%20href%3Dhttps%3A%2F%2Fwww%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si vols veure tot el procés amb detall, repassa la nostra <a href="/ca/serveis">pàgina de serveis</a> amb tot el que incloem.

<!-- exentax:conv-fill-v1 -->
O truca'ns directament al <a href="tel:+34614916910">+34 614 916 910</a> si prefereixes parlar.

Per a detalls per estat, consulta la nostra <a href="/ca/serveis/llc-wyoming">pàgina del servei LLC a Wyoming</a> amb costos i terminis tancats.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

  ### Formularis 1120 + 5472 : implicacions per a residents a Espanya, Catalunya i Andorra

  Per a residents fiscals a Espanya/Catalunya, l'**art. 100 LIRPF (Transparència Fiscal Internacional)** obliga a declarar el control efectiu en LLCs americanes situades en jurisdiccions de baixa tributació. El **Modelo 232** (operacions vinculades + paraïsos fiscals) regulat per l'**OM HFP/816/2017** complementa el reporting americà. Per a residents a **Andorra**, el **conveni Andorra-EUA en vigor des de l'1 de gener de 2024** elimina la doble imposició sobre dividends i interessos qualificats provinents d'estructures LLC.

<!-- exentax:lote7-native-v1:irs-1120-5472-que-son-cuando-aplican -->
## Què reporten realment 1120 + Form 5472 (i què no)

Per a una single-member LLC propietat d'una persona no-US i
tractada com a disregarded a efectes fiscals als US, l'IRS demana
una envelope pro-forma 1120 utilitzada només com a suport del Form
5472. Aquest parell no determina impost US sobre una LLC
disregarded de propietat estrangera; documenta que certes
transaccions reportables entre la LLC i el seu propietari
estranger (o parts relacionades) van tenir lloc. L'IRS vol
visibilitat sobre aquests fluxos, no necessàriament ingressos.

| Element          | Què reporta                                             |
|------------------|---------------------------------------------------------|
| Pro-forma 1120   | Envelope d'identificació: nom de la LLC, EIN, adreça,   |
|                  | any                                                     |
| Form 5472        | Cada transacció reportable amb la part relacionada      |
|                  | estrangera (aportacions de capital, distribucions,      |
|                  | préstecs, serveis, etc.)                                |

Si l'any no va tenir transaccions reportables, el parell es presenta
generalment amb valors a zero perquè l'IRS vegi l'estat d'activitat
explícitament. Saltar la presentació és el que activa la coneguda
exposició a sancions prevista en la regulació.

## Tres patrons reals de presentació que apliquem

Una single-member LLC amb una aportació de capital a la
constitució, una petita retirada mensual al propietari estranger i
cap altre flux relacionat. El 5472 reporta l'aportació i les
retirades; el pro-forma 1120 fa d'envelope. La temporada de
presentació porta unes hores de feina estructurada, incloent-hi la
reconciliació comptable.

Una single-member LLC que va prestar diners a una societat
relacionada estrangera, més tard reemborsats, amb tipus d'interès
normal. El 5472 reporta la concessió del préstec i el reemborsament;
l'acumulació d'interessos forma part dels llibres de la LLC i es
reflecteix a la declaració del propietari al seu país. La
documentació és aliada aquí: el contracte de préstec i el quadre
d'amortització són a la carpeta de compliance de la LLC.

Una LLC plurianual sense activitat l'any en curs. Presentem
igualment el pro-forma 1120 + 5472 a zeros, hi adjuntem un breu
memoràndum intern que explica l'any dorment, i mantenim
l'expedient a punt per al moment en què la LLC es reactivi.

## Errors que porten a cartes de sanció

- Tractar el parell com una declaració fiscal que "no deu res" i
  saltar-la. És una presentació declarativa; l'absència d'impost no
  retira l'obligació.
- Barrejar despeses personals del propietari als llibres de la LLC
  i després intentar reconciliar a l'hora de presentar. Mantenir la
  frontera neta mensualment.
- Oblidar que una retirada al propietari estranger és una
  transacció reportable. Sovint ho és, segons la seva natura
  (retorn de capital, distribució, etc.).
- Presentar tard. La sanció per un Form 5472 fallit és substancial
  i s'aplica fins i tot sense impost US degut.

## Checklist de pre-presentació

- L'EIN de la LLC coincideix amb la carta IRS (CP575).
- Any d'exercici confirmat (any natural per defecte per a una
  single-member disregarded LLC).
- Comptabilitat tancada i reconciliada amb els bancs.
- Fluxos entre parts relacionades mapats a les categories de línies
  del 5472.
- Document d'identitat del propietari a l'arxiu coherent amb la
  declaració BOI.
- Canal de presentació a punt (paper o e-file via proveïdor
  autoritzat).

Tractem 1120 + 5472 com l'encaixada anual de la LLC amb l'IRS:
tranquil·la, previsible, estructurada. Una presentació endreçada
aquest any fa l'any següent encara més tranquil.

<!-- /exentax:lote7-native-v1:irs-1120-5472-que-son-cuando-aplican -->

<!-- exentax:cross-refs-v1 -->
## Sobre el mateix tema

- [Què passa si no presentes el Form 5472: multes de l'IRS i com corregir-ho](/ca/blog/que-passa-si-no-presentes-el-form-5472-multes-irs-i-com)
- [W-8BEN i W-8BEN-E: una guia completa i tranquil·la](/ca/blog/w8-ben-i-w8-ben-e-la-guia-completa)
- [Què és l'IRS i com afecta realment la teva LLC americana](/ca/blog/que-es-lirs-i-com-afecta-la-teva-llc-americana)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:cta-v1 -->
Revisem BOI, EIN, agent registrat i obligacions federals perquè cap multa et pugui sorprendre. <a href="/ca/serveis">Demanar revisió de compliance</a>.
<!-- /exentax:cta-v1 -->

`;
