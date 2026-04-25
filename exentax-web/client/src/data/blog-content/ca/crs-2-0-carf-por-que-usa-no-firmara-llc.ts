export default `

Cada cert temps apareix una versió "definitiva" de l'intercanvi automàtic d'informació fiscal i, amb ella, la pregunta que més rebem a Exentax: si l'OCDE estreny el cèrcol amb el CRS 2.0 i el CARF, què li passa exactament a una <a href="/ca/blog/llc-als-estats-units-guia-completa-per-a-no-residents-el">LLC americana</a> propietat d'un europeu o d'un llatinoamericà no resident? La resposta curta és que el cèrcol s'estreny fora dels Estats Units, no dins. La resposta llarga, que és la que importa, exigeix entendre per què Washington no va signar el CRS original, per què tampoc signarà la versió 2.0, i com això afecta la teva estructura d'avui i la planificació dels propers anys.

> **Posa números al teu cas.** La <a href="/ca#calculadora">calculadora Exentax</a> compara la teva càrrega actual amb la que tindries operant una LLC ben estructurada i correctament declarada al teu país de residència.

## Resum executiu

CRS 2.0 (la versió revisada del Common Reporting Standard de l'OCDE) i CARF (Crypto-Asset Reporting Framework) amplien allò que els bancs i els exchanges declaren a les administracions tributàries dels països adherits. Més dades, més entitats obligades i, sobretot, molta més cripto dins el perímetre. Els Estats Units no són en aquesta fotografia i res en la seva política fiscal de l'última dècada indica que hi seran: tenen el seu propi règim, FATCA, que és bilateral i de sortida, i capten bilions de dòlars de capital estranger precisament perquè ofereixen l'única jurisdicció gran fora del CRS. Per a la persona no resident propietària d'una LLC, això no és cap drecera per "amagar" res; és un fet tècnic que dibuixa la tria d'estat, l'arquitectura bancària i la coherència amb la teva declaració al país de residència.

## CRS original: què es va voler corregir i on es va quedar curt

El **Common Reporting Standard** el va aprovar el Consell de l'OCDE com a resposta política al mandat del G20 després de la crisi financera i dels escàndols d'evasió fiscal de la dècada passada (LuxLeaks, SwissLeaks, Panama Papers). Es va importar la mecànica del FATCA, que ja funcionava unilateralment per als EUA, i es va generalitzar a més de 110 jurisdiccions sota un Multilateral Competent Authority Agreement (MCAA) que activa els fluxos bilateralment entre cada parell de països adherits.

L'estàndard exigeix que cada **Reporting Financial Institution** (banc, broker, fintech amb llicència bancària, fons d'inversió, asseguradora amb productes d'inversió) identifiqui el titular la residència fiscal del qual sigui diferent de la del compte i reporti:

- Dades del titular: nom, adreça, país de residència fiscal, NIF/TIN, data i lloc de naixement.
- Dades de l'entitat: nom, NIF, país. En comptes titularitat de **NFE passives**, també les **persones controladores** beneficiàries efectives.
- Dades del compte: número, nom i identificador de la institució financera.
- Saldos i rendiments: saldo a 31 de desembre, interessos bruts, dividends bruts i, en comptes de custòdia, productes bruts de venda o reemborsament d'actius financers.

Aquest flux s'envia anualment, en general el setembre de l'any següent a l'exercici reportat, i s'encreua amb la teva declaració al país de residència. A Espanya, el Reial decret 1021/2015 i l'Ordre HAP/1695/2016 ja regulen el **Model 289**, peça que articula el CRS dins l'AEAT. Tractem la lectura des del costat dels residents al nostre article complementari sobre <a href="/ca/blog/crs-per-a-residents-a-espanya-i-llatinoamerica-implicacions">CRS per a residents a Espanya i LATAM</a>.

L'OCDE va reconèixer que el CRS 1.0 deixava forats importants: les **EMI** quedaven en zona grisa segons la jurisdicció; les **carteres cripto** i els **exchanges** estaven completament fora; alguns **vehicles d'inversió** sense custòdia tradicional escapaven de la classificació; i la diligència deguda sobre els **controlling persons** de les NFE passives era heterogènia. La pressió política per tancar aquests forats venia sobretot de la Comissió Europea i d'Alemanya.

## CRS 2.0 i CARF: el nou paquet de l'OCDE

L'OCDE ha aprovat en bloc dues peces que cal llegir juntes. La primera és la revisió integral del Common Reporting Standard, coneguda informalment com a **CRS 2.0**. La segona és el **Crypto-Asset Reporting Framework (CARF)**, que estén la lògica de l'intercanvi automàtic a l'univers cripto. Totes dues s'han publicat com un paquet únic i s'estan transposant a la UE mitjançant la **Directiva DAC8** (la DAC8 modifica la 2011/16/UE per donar entrada al CARF i a les novetats del CRS revisat). Aprofundim la peça europea a <a href="/ca/blog/dac8-i-criptomonedes-el-nou-reporting-fiscal-automatic-el">DAC8 i criptomonedes</a>.

Les novetats operatives més rellevants:

1. **Ampliació del perímetre a EMIs i a productes de diner electrònic**, neobancs sense llicència bancària plena i moneders digitals que ofereixen serveis anàlegs a dipòsits.
2. **Incorporació de criptomonedes i stablecoins** a l'àmbit reportable quan el prestador de serveis cripto té presència en una jurisdicció adherida (CARF). Això inclou exchanges, custodis, plataformes de derivats cripto i prestadors de DeFi amb component centralitzat.
3. **Reforç de la due diligence sobre controlling persons** de NFE passives: més documentació, menys marge interpretatiu, autodeclaracions amb més granularitat.
4. **Tractament més estricte de comptes indistints**, fideïcomisos i vehicles opacs: si hi ha dubte raonable sobre la residència de la persona controladora, el reporte es duplica per defecte a diverses jurisdiccions.
5. **Adopció per onades i revisió periòdica**: el CARF entra en vigor per onades segons el calendari de transposició de cada jurisdicció, amb la majoria de països UE començant primer i la resta del G20 a continuació.

Per a un resident fiscal a Catalunya, a Espanya o en qualsevol país LATAM adherit, la conseqüència pràctica és clara: la major part dels diners que mous a través de fintechs europees o d'exchanges amb seu en jurisdiccions adherides passa a estar dins del perímetre d'informació automàtica cap a la teva administració. El que abans era "no reportat per defecte" passa a ser excepcional.

## Per què els EUA no signaran el CRS (la versió sense màrqueting)

Aquesta és la part que més confusió genera i que a Exentax repetim cada setmana. Els EUA no van signar el CRS 1.0 i no signaran el CRS 2.0 per raons estructurals, no per descuit administratiu. Hi ha tres factors combinats que ho expliquen:

- **Ja tenen FATCA i no necessiten el CRS.** El **Foreign Account Tax Compliance Act**, aprovat dins el HIRE Act, obliga les institucions financeres estrangeres a identificar i reportar a l'IRS comptes de **US persons** (ciutadans, residents fiscals i entitats dels EUA). És un règim **bilateral** articulat mitjançant **Intergovernmental Agreements (IGAs)** Model 1 (intercanvi recíproc a través del fisc local) i Model 2 (l'entitat reporta directament a l'IRS). La reciprocitat real és, però, molt limitada: a la pràctica, l'IRS rep moltíssima més informació de l'estranger que no pas la que retorna a les autoritats estrangeres sobre comptes de no residents als EUA. Adoptar el CRS suposaria acceptar reciprocitat multilateral plena, exactament el que el Congrés ha bloquejat al llarg de tota la darrera dècada, sense distinció de majoria política.
- **Els interessa ser la jurisdicció "no-CRS" del món.** Per convergència d'incentius, els EUA s'han convertit en la destinació preferent de capital estranger que cerca **el mercat financer més gran del planeta** combinat amb un perímetre d'intercanvi automàtic molt més estret que l'europeu. Estimacions com les de Tax Justice Network situen en diversos bilions de dòlars el saldo de capital estranger allotjat al sistema financer dels EUA que no es reporta automàticament per CRS. Bona part flueix a través de **trusts**, **LLCs** transparents i comptes de banca privada a Delaware, Nevada, Wyoming, Dakota del Sud o Florida. Cedir aquesta posició a canvi d'un guany recaptatori marginal és, per a Washington, un mal negoci.
- **El cost polític intern és prohibitiu.** Adoptar el CRS exigiria legislació federal nova, modificacions de l'Internal Revenue Code, ampliació del **Form 1099** i del règim d'identificació de comptes, i un canvi doctrinal en el tractament de Single-Member LLCs (Disregarded Entities amb beneficiaris efectius estrangers). Hi ha grups d'interès molt potents (banca, registres estatals, lobby de serveis fiduciaris) que bloquegen aquesta agenda des de fa anys.

La conclusió tècnica, sense maximalismes: **l'asimetria FATCA vs CRS és el mecanisme central, no un accident històric**. Qualsevol planificació professional que parteixi de "els EUA acabaran entrant al CRS aviat" parteix d'una premissa que Washington ha rebutjat de manera consistent.

## Com guanyen els EUA tenint LLCs de no residents

A primera vista, el model sembla contraintuïtiu. Si l'IRS no cobra impost federal sobre els beneficis d'una **LLC pass-through** propietat de no resident sense ECI dins el territori dels EUA, què en treuen els EUA de tenir centenars de milers de LLCs estrangeres als seus registres? La resposta té tres capes:

- **Taxes estatals de constitució i manteniment**, recurrents i altament eficients. Delaware, per exemple, percep cada any una **Annual Franchise Tax** de les LLCs constituïdes en la seva jurisdicció; multiplicat per centenars de milers d'entitats actives, és una de les primeres fonts d'ingressos no tributaris de l'estat. Wyoming, Nou Mèxic, Florida i Nevada competeixen en diferents formats de fees recurrents (annual report, registered agent, business license) que financen bona part dels seus pressupostos. Ho desenvolupem a <a href="/ca/blog/nou-mexic-vs-wyoming-vs-delaware-quin-estat-per-a-la-teva">Nou Mèxic vs Wyoming vs Delaware</a>.
- **Captació de capital estranger cap al sistema financer**. Els neobancs nord-americans (Mercury, Relay), els grans bancs comercials i els brokers retail viuen en part dels dipòsits i operativa de no residents que constitueixen LLCs per a vehicular negocis digitals i carteres d'inversió. Aquest capital es queda dins el sistema americà, genera marge per a les entitats i multiplica liquiditat per al conjunt de l'economia.
- **Imposició indirecta via IRS Forms 5472 + 1120 — sense recaptació però amb dades**. Encara que la LLC pass-through d'un no resident no pagui federal, **continua obligada** a presentar el Form 5472 amb un Form 1120 pro-forma cada any (Treas. Reg. §1.6038A-2). L'IRS rep així un mapa molt complet de **reportable transactions** entre la LLC i el seu únic membre estranger, dades que utilitza amb finalitats d'intel·ligència tributària i de coordinació amb autoritats estrangeres quan hi ha un acord bilateral concret. Expliquem la mecànica a <a href="/ca/blog/form-5472-que-es-qui-lha-de-presentar-i-com-complir">Form 5472, què és i com presentar-lo</a>.

Sumades les tres capes, la matemàtica per a Washington és molt positiva: poc cost recaptatori directe, ingressos estatals constants, capital estranger al sistema i un perímetre d'intel·ligència que l'IRS controla en tot moment. No hi ha cap incentiu per trencar aquest equilibri adherint-se al CRS.

## Què significa tot això per a la teva LLC i la teva estructura

Aterrant l'anterior en decisions concretes que prenem cada setmana amb clients d'Exentax, la fotografia operativa per ordre d'importància:

- **La teva LLC continua sent una eina vàlida i declarable.** Que els EUA siguin fora del CRS no la converteix en una "estructura opaca" des del punt de vista de la teva administració de residència. Tens obligacions declaratives pròpies (a Espanya: IRPF + Model 720 + Model 721 si escau) que no depenen del CRS. El que canvia és el flux automàtic, no la teva obligació.
- **L'arquitectura bancària és el factor decisiu.** Si treballes exclusivament amb comptes als EUA (Mercury, Relay, banca regional) a nom de la LLC, l'empremta CRS cap a la teva administració és pràcticament nul·la. Tan bon punt incorpores una capa europea (Wise Business, Revolut Business europeu, N26, Wallester, Payoneer Europe), acceptes que aquesta informació arribi a la teva administració. Ni bo ni dolent: és informació que la teva planificació ha d'absorbir perquè el declarat i el reportat coincideixin.
- **La cripto canvia de regla amb el CARF.** Si gestiones saldos rellevants en exchanges amb seu europea o en jurisdiccions adherides, dona per fet que la teva autoritat fiscal rebrà aquesta informació de manera automàtica a curt termini.
- **L'estat de constitució importa per motius operatius, no fiscals**. Wyoming i Nou Mèxic continuen guanyant per a perfils freelance i serveis; Delaware continua guanyant per a SaaS amb vocació d'aixecar capital o per a holdings; Florida té encaix per a residents amb nexus físic als EUA. Cap decisió depèn del CRS.
- **Residència fiscal del titular com a variable mestra**. La residència no s'escull, es determina per fets (dies de presència, centre d'interessos econòmics, nucli familiar). Pretendre amagar la residència real a l'empara de l'asimetria FATCA-CRS és, a més d'un error tècnic, una infracció tipificada a la majoria de jurisdiccions europees i llatinoamericanes amb sancions severes.

<!-- exentax:calc-cta-v1 -->
> **Posa números al teu cas.** Si vols veure com encaixa la teva situació amb aquesta lògica, obre la <a href="/ca#calculadora">calculadora Exentax</a> i compara-la amb la teva càrrega fiscal actual abans d'avançar.
<!-- /exentax:calc-cta-v1 -->

## Errors típics que veiem cada setmana

- "Com que la meva LLC només té compte a Mercury, la meva administració no se n'assabenta de res." Cert pel que fa al canal automàtic CRS, fals pel que fa a l'obligació. El teu Model 720 (si escau) s'ha de declarar igualment.
- "Faré servir Revolut Business perquè és més còmode i, com que és europeu, queda fora del CRS." Barreja d'errors. El Revolut europeu sí que és al CRS i l'obertura per a LLC americana no sempre genera IBAN europeu.
- "El CARF no m'afecta perquè faig servir un exchange offshore." Si aquell exchange té clients europeus i opera sota llicència europea o té presència comercial en una jurisdicció adherida, sí que t'afecta.
- "Posaré la LLC a nom d'un tercer perquè no m'identifiquin." És testaferro encobert. Té conseqüències penals i fiscals molt serioses.
- "Els EUA signaran el CRS aviat, així que millor tancar la LLC abans." Premissa falsa segons la trajectòria política observada.

<!-- exentax:execution-v2 -->
## El mètode Exentax: com abordem aquesta planificació

CRS 2.0 i CARF no són cap crisi per a una LLC ben estructurada; són un canvi de perímetre que s'incorpora al diagnòstic inicial i al manteniment anual. El mètode Exentax aplica tres blocs en ordre i deixa registre de cada pas perquè la decisió sigui defensable davant qualsevol inspecció.

- **Diagnòstic CRS i CARF de la teva situació actual.** Mapem cada compte al teu nom i al nom de la LLC, identifiquem quines entitats reporten a quina jurisdicció i encreuem aquesta fotografia amb les teves declaracions dels últims exercicis.
- **Disseny de l'arquitectura bancària alineada amb la teva residència.** Banc principal (Mercury o Relay), passarel·les, comptes multidivisa i, si escau, exchange cripto coherent amb el teu volum i país. Cada peça ha de tenir sentit fiscal i operatiu.
- **Calendari únic d'obligacions.** Annual Report estatal, Form 5472 + 1120, BOI Report, declaració al país de residència, Model 720 i 721 quan escaiguin, tot en una sola fulla amb avisos previs.

Per aplicar aquest mètode al teu cas, obre la <a href="/ca#calculadora">calculadora Exentax</a> o reserva trenta minuts amb l'equip: surts de la trucada amb un diagnòstic clar i, si cal, un calendari de regularització ordenada sense compromís.
<!-- /exentax:execution-v2 -->

## Preguntes freqüents

**El CRS 2.0 obliga els EUA a alguna cosa?** No. El CRS 2.0 és un estàndard de l'OCDE adoptat per les jurisdiccions adherides. Els EUA no són jurisdicció CRS i mantenen el FATCA com a règim propi.

**Si obro una LLC ara, d'aquí uns quants anys continuarà fora del CRS?** La trajectòria política i econòmica indica que sí, per les raons estructurals exposades. No és un compromís jurídic de Washington, però és la lectura més sòlida de la seva política fiscal sostinguda al llarg de tota la darrera dècada.

**La meva LLC ha de reportar res al meu país per CRS?** La teva LLC, com a entitat dels EUA, no és Reporting Financial Institution per CRS. Qui reporta són els bancs i fintechs on tingui comptes, segons la jurisdicció de cada compte.

**L'IRS comparteix informació amb la meva administració sobre la meva LLC?** Només si existeix un acord bilateral concret i la sol·licitud compleix els requisits formals (intercanvi sota CDI, IGAs FATCA amb reciprocitat real, cooperació administrativa específica). No hi ha flux automàtic equivalent al CRS.

**Puc fer servir la meva LLC per invertir a Europa sense que la meva administració se n'assabenti?** No. Si el compte d'inversió és en una entitat europea, aquesta entitat reporta per CRS al país de residència del beneficiari efectiu.

**Quan es notarà el CARF a la pràctica?** Les primeres onades de reporte CARF ja estan arribant segons la transposició de cada país. La regla general és assumir que qualsevol exchange amb seu o llicència en jurisdicció CARF reportarà els teus saldos al país de residència que consti a la teva autodeclaració.

## Parlem del teu cas

Cada estructura té matisos: el país de residència, el tipus d'activitat, la presència o no de cripto, el volum, l'antiguitat de la LLC, les obligacions acumulades. A Exentax revisem la teva situació, dimensionem l'exposició real al CRS 2.0 i al CARF, i dissenyem l'estructura LLC i l'arquitectura bancària que t'encaixen. T'acompanyem cada any en el manteniment perquè el calendari i les declaracions continuïn coherents amb la realitat del teu negoci.

<!-- exentax:cta-v1 -->
Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->
`;
