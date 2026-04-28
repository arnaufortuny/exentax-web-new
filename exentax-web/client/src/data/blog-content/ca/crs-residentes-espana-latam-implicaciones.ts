export default `
El Common Reporting Standard (CRS) és la peça més important de la fiscalitat internacional de l'última dècada, i molt poca gent entén què significa per a algú que té una <a href="/ca/blog/llc-estats-units-guia-completa-no-residents-2026">LLC americana</a> o comptes fora del seu país de residència. Desmuntem el tema amb precisió tècnica i sense alarmisme.

Aquest article es va pensar des d'Espanya i Llatinoamèrica, però toca una ferida que afecta directament qualsevol resident a **Catalunya** o a la resta de l'**Estat espanyol**: en el moment en què vostè té una LLC amb compte en dòlars o un compte obert fora del seu país de residència, apareixen obligacions accessòries que molta gent només descobreix quan arriba el primer requeriment d'Hisenda. Per a un autònom resident a Catalunya són, com a mínim, el **Model 720** (declaració informativa de béns i drets a l'estranger amb saldo combinat superior a 50.000 €), el **Model 721** (declaració de criptoactius a l'estranger superior a 50.000 €) i la **declaració D-6** del Registre d'Inversions del Ministeri d'Economia (inversions espanyoles a l'exterior cotitzades en mercats organitzats), a més de l'IRPF amb totes les rendes mundials i, si escau, l'Impost sobre el Patrimoni de la Generalitat amb la titularitat de la LLC. La lògica CRS que descrivim aquí és la mateixa: el que canvia és el formulari local que vostè haurà d'omplir per estar en regla.

## Què és el CRS i per què existeix

El **Common Reporting Standard** el va aprovar el Consell de l'OCDE el juliol de 2014 com a resposta al G20 després de la crisi financera i dels grans escàndols d'evasió fiscal (LuxLeaks, Panama Papers). L'objectiu és clar: les administracions tributàries dels països adherits intercanvien automàticament informació sobre comptes financers de no residents.

A nivell tècnic, el CRS és la generalització a més de cent jurisdiccions del model anterior (FATCA), però amb abast multilateral en lloc de bilateral. L'Estat espanyol el va transposar mitjançant el Reial Decret 1021/2015 i l'Ordre HAP/1695/2016, que regulen el **Modelo 289** (declaració informativa anual de comptes financers de no residents que les entitats financeres espanyoles remeten a l'AEAT i que rep en sentit invers des dels altres països adherits).

A Llatinoamèrica l'han implementat, entre altres: Mèxic (des de 2017), Argentina, Colòmbia, Xile, Brasil, Uruguai, Panamà, Perú, Costa Rica, Equador i República Dominicana. Els Estats Units, important: **no estan adherits al CRS**. Tenen el seu propi sistema (FATCA), bilateral i només de sortida, no d'entrada. Aprofundim en això en el nostre article sobre <a href="/ca/blog/els-comptes-bancaris-americans-informen-a-la-teva-autoritat">si els comptes bancaris als EUA reporten a la seva hisenda</a> i, per entendre per què tampoc signaran la nova versió, a <a href="/ca/blog/crs-2-0-carf-per-que-els-eua-no-signaran-mai-llc">CRS 2.0 i CARF: per què els EUA no signaran mai</a>.

### Marc normatiu

- **OCDE**: Common Reporting Standard, juliol 2014. Text consolidat i comentaris oficials.
- **UE**: Directiva 2011/16/UE de cooperació administrativa (DAC), modificada per la DAC2 (Directiva 2014/107/UE) que incorpora el CRS al dret de la Unió.
- **Estat espanyol**: Reial Decret 1021/2015, Ordre HAP/1695/2016, Ordre HAC/3625/2003 (Model 720), Ordre HFP/886/2023 (Model 721 sobre criptoactius a l'estranger).
- **Multilateral Competent Authority Agreement (MCAA)**: l'instrument de l'OCDE pel qual cada país activa l'intercanvi bilateral amb cadascun dels altres. L'Estat espanyol té activat l'intercanvi amb pràcticament tota la UE i amb la major part de jurisdiccions adherides.

## Quina informació es reporta exactament

Cada **Reporting Financial Institution** (banc, broker, fintech amb llicència bancària, fons d'inversió, companyia d'assegurances amb productes d'inversió) que detecti un titular la residència fiscal del qual sigui diferent del país on es troba el compte ha de reportar:

| Categoria | Detall |
| --- | --- |
| Dades del titular | Nom, adreça, país de residència fiscal, NIF/TIN, data i lloc de naixement (persones físiques) |
| Dades de l'entitat | Nom, NIF, país. En comptes titularitat de **NFE passives**, també les dades dels **beneficiaris efectius** controladors |
| Dades del compte | Número de compte, nom i identificador de la institució financera |
| Saldos | Saldo o valor a tancament de l'any natural (o al tancament del compte si es va cancel·lar durant l'any) |
| Rendiments | Interessos bruts, dividends bruts, altres ingressos generats, ingressos bruts per venda o reemborsament d'actius financers (comptes de custòdia) |

Aquest flux s'envia cada any, normalment entre maig i setembre de l'any següent a l'exercici reportat, i es creua amb les declaracions del contribuent (a l'Estat espanyol: IRPF, Model 720 i, després de l'última reforma, Model 721 per a criptoactius).

## Què passa amb la seva LLC americana: el matís que gairebé ningú explica

Aquí és on apareixen els malentesos. Fixem conceptes:

1. **Els EUA no envien dades per CRS.** Ni Mercury, ni Relay, ni cap banc regional americà enviaran dades directament a l'AEAT, al SAT, a la DIAN o a l'AFIP per CRS. El que fan els EUA és FATCA, que és **unilateral de sortida**: demana dades a entitats estrangeres sobre comptes de US persons, però no envia automàticament dades equivalents en sentit invers (sí que ho fa en alguns casos via IGAs Model 1, però amb un abast molt inferior al del CRS).
2. **Els seus comptes en fintechs europees a nom de la LLC SÍ que es reporten.** Wise (Bèlgica), Revolut (Lituània, i Regne Unit amb règim propi després del Brexit), N26 (Alemanya) i Wallester (Estònia) són entitats financeres subjectes a CRS a les seves jurisdiccions. Si la titular és la seva LLC i vostè és el **beneficiari efectiu** resident fiscal a Catalunya, a la resta de l'Estat espanyol o a Llatinoamèrica, aquestes dades arriben a la seva administració tributària. Ho desenvolupem a fons en els articles dedicats a <a href="/ca/blog/revolut-business-i-crs-que-es-reporta-a-hisenda">Revolut i CRS</a> i <a href="/ca/blog/wise-business-i-crs-que-es-reporta-a-hisenda">Wise i CRS</a>.
3. **La seva LLC és probablement una NFE passiva (Passive NFE)**, llevat que demostri activitat operativa real (més del 50% dels seus ingressos són operatius i no rendes passives com dividends, interessos, lloguers o royalties no associats a una explotació). En el cas típic d'un autònom amb una Single-Member LLC que factura serveis, hi ha debat doctrinal: una lectura literal del CRS la tractaria com Active NFE (negoci operatiu), però la fintech europea típica la classifica com Passive NFE per prudència, cosa que **obliga a reportar els controlling persons**. Aquest matís se li escapa a gairebé tothom.

### Com es determina la residència fiscal a efectes CRS

L'entitat financera aplica una **due diligence** (RD 1021/2015 i Annex I del CRS) basada en l'autodeclaració del titular més indicis objectius: adreça postal, número de telèfon, IP recurrent, NIF declarat, instrucció de transferència repetida a comptes en un altre país, poders atorgats a residents en un altre país.

Si la seva autodeclaració diu "residència fiscal a Andorra" però la seva IP, l'adreça d'enviament de la targeta i els girs recurrents apunten a Barcelona o Madrid, l'entitat pot demanar **documentació addicional** (certificat de residència fiscal emès per l'autoritat tributària competent, contracte de lloguer, etc.) o, en cas de dubte, reportar a totes dues jurisdiccions. Mentir en l'autodeclaració CRS és una infracció tributària a la majoria de jurisdiccions i pot tenir conseqüències penals si concorre amb quotes defraudades rellevants (a l'Estat espanyol, art. 305 LGT i, segons import, art. 305 CP).

## Implicacions reals a l'Estat espanyol (Models 720 i 721)

Si vostè és resident fiscal a l'Estat espanyol i té:

- **Comptes a l'estranger** amb saldo individual o conjunt superior a 50.000 € a 31 de desembre o saldo mitjà de l'últim trimestre: **Model 720** informatiu (vegi la nostra <a href="/ca/blog/model-720-i-model-721-guia-per-a-residents-a-espanya-amb">guia completa del Model 720 i 721</a>), primera presentació al març de l'any següent; les successives, només si hi ha variació superior a 20.000 € en qualsevol rúbrica.
- **Criptoactius a l'estranger** superiors a 50.000 € a 31 de desembre: **Model 721**.
- **Valors, drets, assegurances, rendes a l'estranger** superiors a 50.000 €: Model 720, seccions corresponents.

El creuament CRS permet a l'AEAT detectar omissions gairebé en temps real respecte a l'exercici reportat. La sentència del Tribunal de Justícia de la UE C-788/19 (27 de gener de 2022) va anul·lar el règim sancionador desproporcionat original del 720 per ser contrari al Dret de la Unió, però l'obligació d'informar **continua plenament vigent** amb sancions ordinàries (LGT art. 198) i amb el matís que les rendes no declarades es poden regularitzar com a guany patrimonial no justificat (LIRPF art. 39, en el que no està afectat per la STJUE).

### Implicacions específiques per a residents a Catalunya

- **Impost sobre el Patrimoni de Catalunya**: la Generalitat aplica el seu propi tram autonòmic (Llei 19/2010 i actualitzacions, amb mínim exempt de 500 000 € i tipus marginal màxim del 2,75%). La titularitat d'una LLC americana, com a participació en entitat estrangera, s'inclou a la base imposable a valor de mercat. Pot trobar-se sotmès tant a l'Impost sobre el Patrimoni com a l'**Impost sobre les Grans Fortunes (Llei 38/2022)** estatal si supera els 3 M€, amb deducció creuada per evitar doble imposició patrimonial.
- **Declaració D-6 al Registre d'Inversions del Ministeri d'Economia**: si la seva LLC adquireix valors negociats en mercats organitzats per import superior a 1,5 M€ a 31 de desembre, té obligació de presentar la **D-6** anualment (Reial Decret 664/1999 i Ordre del Ministeri d'Economia que la desenvolupa). Catalunya té domicili registrat a Barcelona per a aquestes declaracions.
- **Impost sobre Successions i Donacions de Catalunya**: si transmet la LLC en herència o donació a residents catalans, s'aplica la normativa autonòmica catalana (Llei 19/2010), amb bonificacions per a parents directes que poden reduir significativament la quota.

### Implicacions a Andorra, França i la resta de la UE per a la diàspora catalana

- **Andorra**: si vostè es muda a Andorra (decisió molt comuna entre catalans amb LLC), la **DTA Espanya–Andorra** vigent regula la transició. Andorra no aplica CRS amb tots els països però sí amb la UE i Espanya; la Comissió Tècnica Tributària andorrana rep els fluxos. Els rendiments de la LLC tributarien per l'**IRPF andorrà** al 10% (un cop residencial fiscal traslladada amb pleno drecho).
- **França**: si trasllada residència a França (Pirineus, Catalunya Nord), tributarà la LLC pel sistema francès — Formulaire 3916, declaració 2042 IFU, eventualment 209 B CGI. Veieu el nostre <a href="/ca/blog/nomada-digital-on-pagar-impostos-i-com-triar-la-residencia">article sobre residència fiscal del nòmada digital</a>.
- **Resta UE (Portugal, Itàlia, Països Baixos)**: cada país té el seu equivalent del Model 720 (Anexo J portuguès, RW italià, "buitenlands vermogen" neerlandès). Tots reben el flux CRS i totes les autoritats el creuen amb les seves declaracions. La lògica és la mateixa: declarar correctament és sempre la opció òptima.

## Com planificar correctament

La conclusió tècnica és l'oposada a la que diu molt influencer: **una LLC americana ben estructurada amb banca exclusivament a Mercury o Relay (EUA) té una empremta CRS mínima**, perquè els EUA no exporten dades per CRS. Però en el moment en què hi afegeix una capa europea (Wise, Revolut, Wallester, N26), accepta que aquesta informació arribi a la seva hisenda. No és bo ni dolent: simplement és així, i planificar exigeix conèixer-ho.

L'estratègia professional passa per:

1. **Declarar correctament.** El creuament ja existeix; intentar amagar és perdre temps i exposar-se a sancions.
2. **Dissenyar l'estructura perquè el declarat sigui fiscalment eficient.** Implica decidir país de residència, instruments d'inversió, calendari de remeses, deduccions aplicables i Conveni de Doble Imposició aplicable. Vegi el nostre <a href="/ca/blog/disseny-duna-estructura-fiscal-internacional-solida-marc-pas">marc de disseny d'estructura internacional</a>.
3. **Mantenir documentació**: contractes, factures, justificants de despeses, llibres comptables de la LLC, autodeclaracions CRS coherents. Sense documentació, una inspecció reverteix de fet la càrrega de la prova al contribuent.
4. **Conèixer els riscos de no fer-ho bé.** Ho cobrim a <a href="/ca/blog/riscos-fiscals-duna-mala-estructuracio-internacional">riscos fiscals d'una mala estructuració internacional</a>.
5. **Entendre la seva activitat econòmica.** No tributa igual una LLC de serveis que una d'e-commerce o royalties. Ho desenvolupem a <a href="/ca/blog/tributacio-de-la-llc-segons-lactivitat-economica-serveis">tributació de la LLC segons la seva activitat econòmica</a>.

## Errors típics que veiem cada setmana a Catalunya i a la resta de l'Estat espanyol

- "Com que Mercury és als EUA, no se n'assabenta ningú." Cert per a Mercury davant del CRS — els EUA no exporten dades per CRS — però fals per als seus comptes Wise (Bèlgica), Revolut (Lituània), Wallester (Estònia) o N26 (Alemanya) a nom de la mateixa LLC, que arriben a l'AEAT via flux CRS automàtic i es creuen amb el Model 720 i el Model 721.
- "He posat la residència fiscal a Andorra, al Paraguai o a Dubai però continuo vivint a Barcelona, Tarragona o Girona." La residència fiscal no es tria; es determina per fets objectius (**art. 9 LIRPF**: més de 183 dies a l'Estat espanyol, o nucli principal o base d'activitats o interessos econòmics directament o indirectament a l'Estat, o residència del cònjuge no separat i fills menors). L'**AEAT amb seu a Catalunya** té delegacions especials a Barcelona i un programa específic d'inspecció a residents que declaren residència no habitual. Ho desenvolupem en el nostre article sobre la <a href="/ca/blog/nomada-digital-on-pagar-impostos-i-com-triar-la-residencia">residència fiscal del nòmada digital</a>.
- "Si la meva LLC factura, no em passa res." L'AEAT pot aplicar la **transparència fiscal internacional** (art. 100 LIS, aplicable a persones físiques via art. 91 LIRPF) si la seva LLC genera rendes passives i la societat està sota el seu control en una jurisdicció de baixa tributació; tot i que els EUA no són paradís fiscal a aquests efectes, una LLC pass-through pot activar la clàusula per la mateixa mecànica de Disregarded Entity. La planificació ha d'evitar aquest supòsit, no ignorar-lo.
- "Posaré el compte a nom d'un familiar." És el clàssic testaferro encobert, qualificat com a **simulació (art. 16 LGT)** i, si supera els 120 000 € de quota defraudada, com a **delicte contra la Hisenda Pública (art. 305 CP)** amb pena de presó d'1 a 5 anys, agreujat fins a 6 anys si supera els 600 000 €. Les implicacions penals i fiscals les analitzem a <a href="/ca/blog/propietaris-ficticis-per-a-llcs-per-que-es-illegal-i-els">testaferros i prestanoms en LLCs</a>.

## En resum

El CRS no s'"evita" des d'una jurisdicció europea. Es planifica amb coneixement. Una LLC americana continua sent una eina extraordinàriament útil, però el disseny de la seva arquitectura bancària i de la seva residència fiscal són determinants perquè l'empremta informativa que genera sigui coherent amb el que declara.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

Vol que revisem com l'afecta el CRS en el seu cas concret i dissenyem l'arquitectura adequada? Reservi la seva assessoria gratuïta i ho analitzem amb vostè.
Si li ha quedat algun dubte sobre els matisos d'aquesta estructura, <a href="/ca/blog/per-que-els-freelancers-espanyols-estan-deixant-lautonom-per">per què deixar de ser autònom a l'Estat espanyol (i quines alternatives té)</a> explica amb detall un aspecte adjacent que sovint deixem apuntat per a un altre dia.

_Per ampliar en la mateixa sèrie: [empresa a Panamà: fiscalitat i residència](/ca/blog/empresa-a-panama-fiscalitat-i-residencia-2026)._

<!-- related-inline-stripped-2026-04 -->

### Pròxims passos

Si vol validar si aquesta estratègia encaixa amb la seva situació concreta, a Exentax revisem el seu cas de forma personalitzada i li proposem l'estructura legal i eficient que realment li convé. Reservi una sessió inicial sense compromís des de la nostra pàgina de contacte.

<!-- exentax:banking-facts-v1 -->
## Fets bancaris i fiscals que convé precisar

La informació sobre fintech i CRS evoluciona; aquí l'estat actual, tal com és avui:

### Notes per proveïdor

- **Mercury** opera amb diversos bancs associats amb llicència federal i cobertura **FDIC** via sweep network: principalment **Choice Financial Group** i **Evolve Bank & Trust**, a més de **Column N.A.** en alguns casos heretats. Mercury no és un banc; és una plataforma fintech recolzada en aquests partner banks. Si Mercury tanca un compte, el saldo es retorna normalment **mitjançant xec en paper enviat a l'adreça registrada del titular**, i això pot ser un problema operatiu seriós per a no residents; convé tenir un compte secundari actiu (Relay, Wise Business, etc.) com a contingència.
- **Wise** distribueix dos productes clarament diferents: **Wise Personal** (compte personal) i **Wise Business** (compte per a empreses, inclosa la seva LLC). Per a una LLC s'ha d'obrir **Wise Business**, no la personal. Matís CRS important: una **Wise Business titularitat d'una LLC nord-americana queda fora del CRS** perquè la titular és una entitat dels EUA i els EUA no són jurisdicció CRS; el costat USD opera via Wise US Inc. (perímetre FATCA, no CRS). En canvi, una **Wise Personal oberta per una persona física resident fiscal a Catalunya**, a la resta de l'Estat espanyol o en una altra jurisdicció CRS **sí que genera reporte CRS** via Wise Europe SA (Bèlgica) sobre aquesta persona. Si obre Wise per a la seva LLC, aquell compte no l'inclou en CRS per la LLC; si a més manté una Wise Personal a nom seu com a resident en CRS, aquesta segona sí que reporta.
- **Wallester** (Estònia) és una entitat financera europea amb llicència EMI/banc emissor de targetes. Els seus comptes IBAN europeus **estan dins l'Estàndard Comú de Comunicació d'Informació (CRS)** i, per tant, generen reporte automàtic a l'administració tributària del país de residència del titular.
- **Payoneer** opera amb entitats europees (Payoneer Europe Ltd, Irlanda) que també **estan dins de CRS** per a clients residents en jurisdiccions que apliquen l'estàndard.
- **Revolut Business**: quan s'associa a una **LLC nord-americana**, opera sota **Revolut Technologies Inc.** amb **Lead Bank** com a banc partner als EUA. El compte lliurat és un compte dels EUA (routing + account number); **no s'emet IBAN europeu** a una LLC. Els IBAN europeus (lituans, BE) són de **Revolut Bank UAB** i s'emeten a clients europeus del grup. Si li ofereixen un IBAN europeu associat a la seva LLC, confirma a quina entitat jurídica està associat i sota quin règim reporta.
- **Tributació zero**: cap estructura LLC aconsegueix "zero impostos" si vostè viu en un país amb CFC, transparència fiscal o atribució de rendes. El que s'aconsegueix és **no duplicar tributació** i **declarar correctament en residència**, no eliminar-la.

<!-- exentax:legal-refs-v1 -->
## Referències: marc legal i normativa

L'argumentació d'aquest article descansa en la normativa i doctrina següents, vigents actualment:

- **Estat espanyol.** Llei 35/2006 de l'IRPF (arts. 8, 9 i 91 sobre residència fiscal i transparència fiscal internacional), Llei 27/2014 de l'Impost sobre Societats (art. 100 sobre TFI), Llei 58/2003 General Tributària, Llei 5/2022 que va reformar el Model 720 després de la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Models 232 i 720) i Ordre HFP/887/2023 (Model 721 sobre criptoactius a l'estranger).
- **Doctrina administrativa.** Resolucions del TEAC i consultes vinculants de la DGT relatives a LLC unipersonals (entre altres V0443-08, V1631-17, V1147-22), interpretades a la llum del BOE de febrer de 2020 sobre classificació d'entitats estrangeres transparents.
- **Convenis i normativa internacional.** Conveni de Doble Imposició entre l'Estat espanyol i els EUA signat el 1990 amb Protocol de 2013 en vigor des de 2019, Directiva 2011/16/UE modificada per DAC6, DAC7 i DAC8, i Model de Conveni OCDE amb els seus Comentaris.
- **EUA.** Treas. Reg. §301.7701-3 (classificació check-the-box), IRC §6038A i Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) i normativa FBAR (31 CFR 1010.350).

Aquest contingut és divulgatiu i no substitueix l'assessorament personalitzat per a la seva situació fiscal concreta.

<!-- exentax:execution-v2 -->
## Què significa el CRS avui per a residents a Catalunya, a l'Estat espanyol i a la resta de la UE

El CRS funciona en pilot automàtic: més de 110 jurisdiccions intercanvien dades cada setembre sobre saldos a 31 de desembre de l'any anterior. Si vostè és resident fiscal a Catalunya, a la resta de l'Estat espanyol, a Andorra (amb les particularitats de la DTA Espanya–Andorra), o en una altra jurisdicció de la UE, els bancs on té comptes a l'estranger ja estan reportant a l'AEAT o a l'autoritat tributària corresponent. Això és el que importa entendre, sense paranoia.

- **El que sí es reporta.** Saldos de compte a 31 de desembre, ingressos bruts de l'any (interessos, dividends), nom del titular, residència fiscal declarada al banc i, per a entitats transparents, dades del controlling person. La informació arriba al país de residència i es creua amb la declaració fiscal del contribuent.
- **El que no es reporta.** Moviments detallats del compte, contraparts específiques, informació transaccional. CRS és saldos + ingressos bruts + identificació; no és traçabilitat de cada operació. Aquesta percepció de "ho saben tot" és exagerada en literalitat però encertada en conseqüència: amb saldos i rendes brutes es construeix la presumpció suficient per obrir requeriment.
- **Estat espanyol, Model 720 i Model 721.** El resident fiscal espanyol té obligació pròpia de declarar comptes a l'estranger (>50.000 € combinat, Model 720) i criptoactius a l'estranger (>50.000 €, Model 721). No depèn del CRS, depèn de la seva obligació. El CRS només ajuda l'AEAT a creuar i detectar omissions.
- **Llatinoamèrica — ritmes diferents.** Mèxic (SAT) intercanvia des de 2018 amb cobertura extensa; Colòmbia (DIAN) des de 2017 amb depuració progressiva; Xile (SII) des de 2018; Argentina (AFIP) des de 2018, amb ús operatiu encara en construcció; Uruguai actiu però amb règim tax-haven que matisa el flux en doble sentit. La intensitat de l'ús de la dada varia, però la disponibilitat ja és generalitzada.

### El que més ens pregunten

**Si tinc Mercury a la meva LLC, el meu país ho sap via CRS?** No directament: els EUA no participen al CRS. El que sí entra al flux són els comptes Wise (via Bèlgica) i, si la LLC operés des d'un banc europeu o asiàtic, aquells també. Mercury queda fora del flux automàtic, no fora de tota obligació declarativa.

**Com regularitzo si fa anys que no declaro?** Amb declaració complementària del 720 o 721 abans que arribi requeriment. La STJUE C-788/19 va limitar les multes espanyoles; es pot regularitzar amb un cost molt menor que fa cinc anys. Ho avaluem cas a cas.

A Exentax mapegem quins dels seus comptes entren en CRS, quines obligacions declaratives activa cadascun i dissenyem l'alta neta o la regularització ordenada quan s'aplica.
<!-- /exentax:execution-v2 -->

## Parlem de la seva estructura

Cada cas té matisos: el seu país de residència, el tipus d'activitat, on són els seus clients, si fa inversió o trading, si ven a particulars o a empreses. A Exentax revisem la seva situació, dissenyem l'estructura LLC que encaixa amb vostè i l'acompanyem cada any en el manteniment. Reservi una consulta amb el nostre equip i comencem per entendre els seus números reals.

<!-- exentax:cross-refs-v1 -->
### Més lectures relacionades

- [Estructures offshore: beneficis reals i riscos honestos](/ca/blog/estructures-offshore-beneficis-i-riscos-reals)
- [De single-member a multi-member LLC: implicacions fiscals reals abans de fer el pas](/ca/blog/de-single-member-a-multi-member-llc-implicacions-fiscals)
- [Exit Tax a l'Estat espanyol: impost de sortida per a inversors en cripto, LLC i Interactive Brokers](/ca/blog/exit-tax-espanya-llc-cripto-interactive-brokers)
<!-- /exentax:cross-refs-v1 -->

Vol aplicar aquest protocol al seu cas? <a href="/ca/agendar">Reservi una sessió amb l'equip d'Exentax</a> i revisem la seva LLC amb números reals en trenta minuts, sense compromís.


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
<p data-testid="cta-action-row">Necessita parlar-ne ara mateix? Escrigui'ns per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vinc%20de%20l'article%20%22crs%20per%20a%20residents%20a%20espanya%20i%20llatinoamerica%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i li responem avui mateix.</p>

Si prefereix parlar-ne en directe, <a href="/ca/agendar">reservi una sessió gratuïta</a> i revisem el seu cas real en trenta minuts.

<!-- exentax:conv-fill-v1 -->
O truca'ns directament al <a href="tel:+34614916910">+34 614 916 910</a> si prefereixes parlar.

Per a detalls per estat, consulta la nostra <a href="/ca/serveis/llc-wyoming">pàgina del servei LLC a Wyoming</a> amb costos i terminis tancats.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

`;
