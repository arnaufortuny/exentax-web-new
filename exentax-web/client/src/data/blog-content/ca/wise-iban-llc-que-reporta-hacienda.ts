export default `Quan es parla de Wise, IBAN estrangers i LLC als EUA, circulen dos extrems igualment equivocats: d'una banda, el discurs de "Wise no reporta res i Hisenda no se n'assabenta", i de l'altra, la por que cada moviment estigui essent enviat en directe a l'Agència Tributària. La realitat està força més matisada i val la pena entendre-la abans de muntar la teva estructura, sobretot si combines una <a href="/ca/blog/llc-als-estats-units-guia-completa-per-a-no-residents-el">LLC americana</a> amb un compte Wise i les targetes associades.

Aquest article se centra en el que passa realment: quin tipus d'informació surt de Wise cap a la teva hisenda, què no surt, i on és la frontera entre ús legítim i problema fiscal. Si vols l'anàlisi tècnica exhaustiva del flux CRS de Wise Business des de Bèlgica, la desenvolupem a <a href="/ca/blog/wise-business-i-crs-que-es-reporta-a-hisenda">Wise Business i CRS: el que es reporta a la teva hisenda</a>.

## Com funciona Wise per dins

Wise no és un banc tradicional, ni una passarel·la opaca, ni un compte offshore. És un grup d'entitats regulades que opera en jurisdiccions diferents:

- **Wise Europe SA**, amb seu a Bèlgica, autoritzada com a Electronic Money Institution pel National Bank of Belgium. És l'entitat que dona servei a la majoria de clients europeus i a moltes LLC amb representació europea.
- **Wise Payments Limited**, al Regne Unit, regulada per la FCA. Continua operant per a clients UK i alguns legacy.
- **Wise US Inc.**, regulada als EUA com a Money Services Business. És l'entitat per a clients amb residència i entitat americana.
- Filials a Singapur, Austràlia, l'Índia i altres jurisdiccions amb els seus propis reguladors locals.

Quan obres un compte Wise (personal o Business) reps "dades bancàries locals" en diverses divises: un **IBAN belga (BE) emès per Wise Europe SA** per a l'EUR (en clients europeus antics poden quedar IBAN lituans heretats; per a una **LLC nord-americana oberta avui mitjançant Wise Business**, l'IBAN EUR prové sempre de l'entitat belga, mai de Lituània), un **sort code i account number en GBP**, un **routing number i account number en USD**, i adreces equivalents en AUD, NZD, SGD, etc. Aquests IBAN no converteixen Wise en un banc belga o lituà qualsevol: són comptes de client segregats dins de l'esquema EMI europeu.

El que importa per a fiscalitat: encara que vegis un IBAN belga o lituà, **l'entitat que custodia els teus diners i reporta sobre el teu compte és Wise Europe SA (Bèlgica)** en la immensa majoria de casos europeus. Aquesta és l'entitat que activa els fluxos CRS.
## Què és el CRS i quan s'aplica

El **Common Reporting Standard (CRS)** és l'estàndard de l'<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> que obliga les entitats financeres de més de 100 jurisdiccions a identificar els seus clients no residents i a reportar anualment els seus saldos i rendiments a les autoritats fiscals locals, que al seu torn els intercanvien amb la hisenda del país de residència del titular. A la UE es va transposar a través de la **Directiva 2011/16/UE (DAC2)** i, a Bèlgica, mitjançant la llei de 16 de desembre de 2015 sobre intercanvi automàtic d'informació financera.

Pel que fa a Wise:

- **Wise Europe SA (Bèlgica)** està plenament subjecta a CRS. Reporta al Service Public Fédéral Finances belga, que reenvia a la hisenda del país de residència del titular.
- **Wise Payments Limited (UK)** també està subjecta a CRS, amb el canal formal a través de HMRC.
- **Wise US Inc.** no està subjecta a CRS, perquè els EUA no s'han adherit a l'estàndard (utilitzen el seu propi marc asimètric, FATCA, que afecta sobretot els US persons).

És a dir: si el teu compte Wise és sota Wise Europe SA, assumeix que el saldo a 31 de desembre i la informació del titular arriben a la teva hisenda nacional. Si estàs sota Wise US Inc., no es reporta via CRS, però aquell compte només és accessible per a residents i entitats realment americanes, no per a una LLC operada des d'Europa.
## Què reporta realment Wise

El bloc d'informació que viatja per CRS és molt concret i no inclou, contràriament al que es tem, "tots els teus moviments en directe":

| Bloc | Què inclou |
| --- | --- |
| Titular persona física | Nom, adreça, residència fiscal declarada, número d'identificació fiscal (TIN), data i lloc de naixement |
| Titular entitat | Raó social, adreça, EIN/NIF de la LLC, classificació CRS (Active NFE, Passive NFE, Investment Entity) |
| Beneficiaris efectius | Si l'entitat es classifica com a Passive NFE: dades dels controlling persons (llindar del 25% directe o indirecte, o control efectiu) |
| Compte | IBAN per divisa, número intern del compte Wise |
| Saldo | Saldo agregat a 31 de desembre, normalment en EUR convertit al tancament |
| Rendiments | Interessos si n'hi ha (Wise Interest), dividends bruts i ingressos bruts per reemborsament en productes com Wise Assets |

El que **no** es reporta per CRS:

- El detall de cada moviment operatiu de l'any.
- El nom i les dades dels teus clients.
- Les teves factures, contractes o marges.
- Les compres concretes fetes amb la targeta Wise.

Això no significa que aquesta informació sigui invisible: si la teva hisenda inicia un procediment, te la pot demanar directament a tu i, en investigacions avançades, sol·licitar informació puntual a Wise pels canals de cooperació fiscal. El que sí significa és que el flux automàtic anual no és un bolcat total: és saldo + rendiments + identitat.
## Targetes Visa i Mastercard: la matisació important

Hi ha una idea molt estesa que diu que "com que les targetes són Visa o Mastercard, les xarxes ja envien tot a Hisenda". Convé matisar-ho:

- Visa i Mastercard són **xarxes de processament de pagaments**, no entitats financeres que mantenen el teu compte. La seva funció és liquidar transaccions entre el banc emissor i el banc adquirent del comerç.
- **Visa i Mastercard no reporten els teus consums directament a l'Agència Tributària** ni a cap altra hisenda nacional com a flux automàtic periòdic. No és el seu paper.
- Qui sí que té obligacions d'informació és **l'emissor de la targeta** (Wise Europe SA, en aquest cas) i el **comerç adquirent** dins de la seva pròpia comptabilitat.
- A Espanya, les **entitats financeres espanyoles** sí reporten a l'AEAT determinats consums i saldos de targetes vinculades a residents (declaracions informatives tipus 196, 171, etc.), però aquell marc no s'aplica amb la mateixa intensitat a un emissor estranger.

Si vols el mapa complet de qui reporta què del teu consum amb targeta país per país (Modelo 196, 171, DAS2, Modelo 38), ho desenvolupem a <a href="/ca/blog/visa-mastercard-reporting-que-veu-hisenda-dels-pagaments-amb">Visa i Mastercard: què veuen realment les hisendes del teu consum amb targeta</a>.

La conclusió raonable: usar la targeta Wise per a despeses personals com a resident fiscal a Catalunya o a Espanya no genera un reporte automàtic en temps real de cada transacció a Hisenda. El que sí genera, juntament amb la resta del compte, és el reporte CRS anual del saldo i els rendiments. I, sobretot, deixa un rastre perfectament reconstruïble si en algun moment Hisenda demana explicacions sobre l'origen dels fons.
## El cas típic: LLC no resident amb Wise Business

És aquí on circulen més mites. Un emprenedor amb residència fiscal a Catalunya (o en LATAM) constitueix una <a href="/ca/blog/llc-als-estats-units-guia-completa-per-a-no-residents-el">LLC als Estats Units</a>, obre Mercury com a compte principal i Wise Business com a compte secundari multidivisa. Quan completa l'autodeclaració CRS de Wise per a la LLC ha d'indicar:

- Residència fiscal de la LLC: EUA.
- Classificació CRS: la majoria de Single-Member LLC de serveis compleixen els requisits d'**Active NFE** (més del 50% dels ingressos són operatius), però Wise tendeix a aplicar criteris conservadors i, davant documentació feble, classifica com a **Passive NFE**.
- Controlling persons: les dades del beneficiari efectiu, incloent-hi la seva residència fiscal (la teva, a Catalunya, a Espanya o on sigui).

La conseqüència pràctica: encara que la LLC sigui estatunidenca i els EUA no estiguin al CRS, el **dada de la teva titularitat com a controlling person, amb la teva residència fiscal real, arriba a la teva hisenda des de Bèlgica**. És la peça que molts passen per alt.

Això no converteix la LLC en una cosa "il·legal": una LLC ben estructurada i ben declarada és una eina perfectament legítima. El que invalida és la idea que posant Wise Business a nom de la LLC s'evita el flux d'informació cap al teu país de residència.
## Què pot veure Hisenda (i què no)

Traslladat a la pràctica d'un resident fiscal a Catalunya amb LLC + Wise:

El que l'AEAT pot veure de manera automàtica i recurrent:

- Que existeix un compte Wise associat a la LLC i a tu com a controlling person.
- El saldo a 31 de desembre de cada any.
- Els rendiments bruts generats (Wise Interest, Wise Assets, etc.).
- El teu nom, NIF i adreça com a beneficiari efectiu.

El que l'AEAT no rep automàticament:

- Cadascun dels moviments de l'any.
- El detall dels teus clients i factures.
- Les transaccions concretes amb la targeta.
- El P&L intern de la LLC.

El que passa en creuar aquesta informació amb el teu IRPF i amb les teves declaracions informatives:

- Si el teu Model 720 (declaració de béns a l'estranger, llindar agregat de 50.000 €) i, si escau, Model 721 (criptos), no recullen el compte Wise quan haurien de fer-ho, hi ha un desfasament evident.
- Si el teu IRPF no inclou els rendiments atribuïbles a la LLC (en l'escenari en què Espanya la tracta com a entitat transparent, segons la doctrina administrativa que analitzem a <a href="/ca/blog/crs-per-a-residents-a-espanya-i-llatinoamerica-implicacions">CRS per a residents a Espanya i LATAM</a>), salta una altra incoherència.
- Si els saldos no encaixen amb els ingressos declarats, Hisenda té una palanca natural per obrir comprovacions.

El problema no acostuma a ser el reporting en si, sinó la **incoherència documental** entre el que es declara a Espanya, el que surt per CRS des de Bèlgica i el que apareix en l'operativa real.
## Errors comuns que veiem cada setmana

1. **"Wise no reporta res."** Fals. Wise Europe SA reporta per CRS des de Bèlgica.
2. **"Si el compte està a nom de la LLC, no em reporten a mi."** Fals per a Passive NFE: es reporten els controlling persons. I la majoria de Single-Member LLC es classifiquen així.
3. **"Com que el meu saldo mitjà és baix, no entro al CRS."** El saldo reportat és el de tancament, sense importar la fluctuació durant l'any, i no hi ha llindar mínim en comptes nous.
4. **"Tinc Wise USD sota Wise US Inc., no es reporta."** Cert pel que fa a CRS, però aquesta configuració només és coherent per a residents i entitats realment americanes; usar-la des d'Europa per a una LLC operada per un resident català és jugar-se-la en un altre front (residència, gestió efectiva, due diligence intern de Wise).
5. **"Pago tot amb la targeta Wise, així no queda rastre."** Queda rastre: a Wise, al comerç i al saldo de tancament que sí es reporta. I deixa una empremta perfectament reconstruïble si t'obren un procediment.
6. **"La LLC em protegeix automàticament del 720."** No: si ets resident fiscal a Espanya i ets beneficiari efectiu de comptes a l'estranger, t'aplica l'obligació quan se superen els llindars agregats.
## Per què això importa per a la teva estructura

La conclusió raonable no és "Wise és dolent" ni "la LLC és perillosa". La conclusió és que **la teva estructura només funciona si les peces són coherents entre elles**: la teva residència fiscal, l'entitat que opera el teu compte, la classificació CRS de la teva LLC, les teves declaracions informatives, el teu IRPF i els teus contractes amb clients. Quan alguna d'aquestes peces no encaixa, els problemes no apareixen el dia que mous els diners, apareixen tres o quatre anys després en forma de requeriment.

A Exentax treballem exactament en aquesta frontera: estructurar la <a href="/ca/blog/llc-als-estats-units-guia-completa-per-a-no-residents-el">LLC americana</a>, triar <a href="/ca/blog/bancs-tradicionals-vs-fintech-per-a-la-teva-llc-on-obrir-el">quin compte bancari o fintech</a> té sentit com a principal i quin com a secundari, anticipar què es reporta via <a href="/ca/blog/crs-per-a-residents-a-espanya-i-llatinoamerica-implicacions">CRS</a> cap a la teva hisenda, i dissenyar el conjunt perquè la peça Wise (o <a href="/ca/blog/revolut-business-i-crs-que-es-reporta-a-hisenda">Revolut Business</a>, o qualsevol altra) encaixi sense sorpreses. Ho desenvolupem en detall a <a href="/ca/blog/disseny-duna-estructura-fiscal-internacional-solida-marc-pas">Disseny d'una estructura fiscal internacional sòlida</a>.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

A Exentax treballem exactament en aquesta frontera: estructurar la <a href="/ca/blog/llc-als-estats-units-guia-completa-per-a-no-residents-el">LLC americana</a>, triar <a href="/ca/blog/bancs-tradicionals-vs-fintech-per-a-la-teva-llc-on-obrir-el">quin compte bancari o fintech</a> té sentit com a principal i quin com a secundari, anticipar què es reporta via <a href="/ca/blog/crs-per-a-residents-a-espanya-i-llatinoamerica-implicacions">CRS</a> cap a la teva hisenda, i dissenyar el conjunt perquè la peça Wise (o <a href="/ca/blog/revolut-business-i-crs-que-es-reporta-a-hisenda">Revolut Business</a>, o qualsevol altra) encaixi sense sorpreses. Ho desenvolupem en detall a <a href="/ca/blog/disseny-duna-estructura-fiscal-internacional-solida-marc-pas">Disseny d'una estructura fiscal internacional sòlida</a>.
Si no tens clar com encaixa Wise en la teva estructura o si estàs exposat a un creuament que no controles, ho revisem amb tu i et diem què cal ajustar abans que sigui Hisenda qui marqui el ritme.
### En resum

Wise és una excel·lent fintech multidivisa, plenament regulada i plenament connectada a l'intercanvi automàtic d'informació quan opera sota Wise Europe SA. No és una drecera per amagar diners, però tampoc una càmera que grava cada moviment i el reenvia en directe a Hisenda. El que viatja per CRS és saldo, rendiments i identitat del titular i del beneficiari efectiu. El que no viatja per defecte és el detall operatiu, encara que queda perfectament disponible si Hisenda ho demana.

La diferència entre tenir problemes o no tenir-ne no està a usar Wise, sinó en com encaixa Wise dins d'una estructura coherent amb la teva LLC, la teva residència i les teves declaracions. Aquesta és la conversa que val la pena tenir abans, no després.
## Compliance fiscal al teu país: CFC, TFI i atribució de rendes

Una LLC americana és una eina legal i reconeguda internacionalment. Però el compliment no acaba en constituir-la: com a propietari resident fiscal en un altre país, l'administració tributària local manté el dret a gravar el que la LLC genera. L'important és saber **sota quin règim**.

### Per jurisdicció

- **Espanya (LIRPF/LIS).** Si la LLC és una *Single-Member Disregarded Entity* operativa (serveis reals, sense passivitat significativa), Hisenda la tracta normalment per **atribució de rendes (art. 87 LIRPF)**: els beneficis nets s'imputen al soci l'exercici en què es generen, integrant-se a la base general de l'IRPF. Si la LLC opta per tributar com a *corporation* (Form 8832) i queda controlada per resident espanyol amb rendes majoritàriament passives, pot activar-se la **transparència fiscal internacional (art. 91 LIRPF per a persones físiques, art. 100 LIS per a societats)**. La diferència no és opcional: depèn de la substància econòmica, no del nom.
- **Models informatius.** Comptes als EUA amb saldo mitjà o final >50.000 € a l'exercici: **Model 720** (Llei 5/2022 després de la STJUE C-788/19, 27/01/2022, sancions ara dins del règim general LGT). Operacions vinculades amb la LLC i dividends repatriats: **Model 232**. Criptoactius custodiats als EUA: **Model 721**.
- **CDI Espanya–EUA.** El conveni (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol en vigor 27/11/2019) ordena la doble imposició sobre dividends, interessos i royalties. Una LLC sense establiment permanent a Espanya no constitueix per si sola EP del soci, però la direcció efectiva sí pot crear-lo si tota la gestió es fa des de territori espanyol.
- **Mèxic, Colòmbia, Argentina i altres LATAM.** Cada jurisdicció té el seu propi règim CFC (Mèxic: Refipres; Argentina: rendes passives de l'exterior; Xile: art. 41 G LIR). El principi comú: el que la LLC reté com a benefici es considera percebut pel soci si l'entitat es considera transparent o controlada.

La regla pràctica: una LLC operativa, amb substància, declarada correctament en residència, és **planificació fiscal legítima**. Una LLC que s'utilitza per ocultar ingressos, simular no-residència o desplaçar rendes passives sense justificació econòmica entra al terreny de l'**art. 15 LGT (conflicte en aplicació de la norma)** o, en el pitjor cas, de l'**art. 16 LGT (simulació)**. La diferència la marquen els fets, no el paper.

A Exentax muntem l'estructura perquè encaixi al primer escenari i documentem cada pas perquè la teva declaració local sigui defensable davant d'una eventual revisió.

<!-- exentax:legal-refs-v1 -->
## Referències legals i normatives

Aquest article es basa en normativa vigents actualment. Citem les fonts principals per a verificació:

- **EUA.** Treas. Reg. §301.7701-3 (classificació d'entitats / *check-the-box*); IRC §882 (impost sobre rendes d'estrangers connectades amb US trade or business); IRC §871 (FDAP i retencions a no residents); IRC §6038A i Treas. Reg. §1.6038A-2 (Form 5472 per a *25% foreign-owned* i *foreign-owned disregarded entities*); IRC §7701(b) (residència fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report a <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espanya.** Llei 35/2006 (LIRPF), arts. 8, 9 (residència), 87 (atribució de rendes), 91 (transparència fiscal internacional per a persones físiques); Llei 27/2014 (LIS), art. 100 (transparència fiscal internacional per a societats); Llei 58/2003 (LGT), arts. 15 i 16; Llei 5/2022 (règim sancionador del Model 720 després de la STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Models 232 i 720); Ordre HFP/887/2023 (Model 721 cripto).
- **Conveni Espanya–EUA.** BOE de 22/12/1990 (CDI original); Protocol en vigor des del 27/11/2019 (renda passiva, *limitation on benefits*).
- **UE / OCDE.** Directiva (UE) 2011/16, modificada per DAC6 (mecanismes transfronterers), DAC7 (Directiva (UE) 2021/514, plataformes digitals) i DAC8 (criptoactius); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetries híbrides); Estàndard Comú de Reporte (CRS) de l'OCDE.
- **Marc internacional.** Model de Conveni OCDE, art. 5 (establiment permanent) i comentaris; Acció 5 BEPS (substància econòmica); FATF Recommendation 24 (titularitat real).

L'aplicació concreta de qualsevol d'aquestes normes al teu cas depèn de la teva residència fiscal, l'activitat de la LLC i la documentació que mantinguis. Aquest contingut és informatiu i no substitueix l'assessorament professional personalitzat.<!-- exentax:execution-v2 -->
## L'IBAN belga de Wise per a la teva LLC: què és, què reporta i per què Hisenda el veu

Quan actives la sub-compte EUR de Wise Business, reps un IBAN belga BE. Operativament excel·lent; fiscalment sota règim CRS belga.

- **Naturalesa de l'IBAN BE.** Wise Europe SA és entitat de crèdit autoritzada pel Banc Nacional de Bèlgica. L'IBAN BE és jurídicament compte belga, encara que el titular sigui la teva LLC US.
- **Dades transmeses anualment.** Identificació LLC titular, UBO, saldo a 31 desembre, total moviments bruts anuals, identificador de compte. NO transaccions individuals.
- **Encreuament amb declaració a la residència.** Espanya: Modela 720 per a comptes estrangers si suma >50k€. Si Hisenda rep via CRS el saldo i no presentes 720, procediment d'imputació. Sanció típica: 50% del saldo no declarat.
- **Diferència vs sub-compte USD.** USD operat per Wise USD Inc., reporta via FATCA-IGA. Canal diferent, resultat fiscal equivalent.

### Com declarar-lo correctament a Espanya

Modela 720 anual: IBAN BE, banc emissor (Wise Europe SA Brussel·les), saldo. IRPF: si LLC disregarded, atribució.

### El que més ens pregunten

**Si UBO declarat al KYC és un altre, arriba a la Hisenda del declarat?** Sí, CRS reporta a la residència del UBO real.

**Puc tenir Wise sense activar EUR?** Sí, però perds l'avantatge principal.

A Exentax estructurem Wise segons necessitat i declarem correctament.
<!-- /exentax:execution-v2 -->

## T'ho muntem sense que perdis un cap de setmana

Milers de freelancers i emprenedors ja operen amb la seva LLC americana de manera 100% legal i documentada. A Exentax ens encarreguem de tot el procés: constitució, banca, passarel·les de pagament, comptabilitat, declaracions <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> i compliance al teu país de residència. Reserva una assessoria gratuïta i et direm amb sinceritat si la LLC té sentit per al teu cas, sense promeses absolutes.

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
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Quan%20es%20parla%20de%20Wise%2C%20IBAN%20estrangers%20i%20LLC%20als%20EUA%2C%20circulen%20dos%20extrems%20ig%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.

<!-- exentax:conv-fill-v1 -->
O truca'ns directament al <a href="tel:+34614916910">+34 614 916 910</a> si prefereixes parlar.

Per a detalls per estat, consulta la nostra <a href="/ca/serveis/llc-wyoming">pàgina del servei LLC a Wyoming</a> amb costos i terminis tancats.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->`;
