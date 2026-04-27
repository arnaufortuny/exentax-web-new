export default `Si tu o la teva LLC cobreu diners des dels Estats Units (Stripe, PayPal, plataformes d'afiliació, AdSense, dividends, royalties, brokers...), poden demanar-vos un **W-8BEN** o un **W-8BEN-E**. No totes les plataformes ho exigeixen: la banca empresarial com Mercury, Relay o Wise només el demana si una verificació específica de compliance ho exigeix, mentre que brokers com Interactive Brokers el demanen de manera obligatòria des de l'alta. Allà on és exigit i no l'omples (o l'omples malament), el resultat és sempre el mateix: el pagador nord-americà aplica una **retenció del 30%** sobre el que et deu, "per si de cas". Un 30% que després és molt difícil de recuperar.

Aquesta guia és la versió completa, en català, sense tecnicismes innecessaris però rigorosa. Entendràs què són aquests formularis, en què es diferencien, qui ha de presentar cadascun, on, com s'omplen pas a pas i quins errors et poden sortir cars.

## Què són els W-8 i per què existeixen

Els formularis de la sèrie **W-8** són documents de l'**<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>** (l'agència tributària dels EUA) mitjançant els quals una persona o entitat **no nord-americana** declara al pagador que **no és contribuent fiscal als EUA** i, si escau, que **s'acull a un conveni de doble imposició** per reduir o eliminar la retenció per defecte.

La regla general als EUA és que qualsevol pagament d'origen nord-americà a una persona o entitat estrangera està subjecte a una retenció del **30%** llevat que el receptor demostri el contrari. Aquesta demostració es fa, precisament, amb un W-8.

Els més utilitzats són dos:

- **W-8BEN:** per a **persones físiques no nord-americanes** (un català, un mexicà, un alemany… que cobra d'origen USA).
- **W-8BEN-E:** per a **entitats no nord-americanes** (la teva LLC, la teva SL, la teva GmbH…).

Existeixen altres (W-8ECI, W-8IMY, W-8EXP) per a casos més específics que deixem fora d'aquesta guia.
## Diferència clau entre W-8BEN i W-8BEN-E

| | W-8BEN | W-8BEN-E |
|--|--------|----------|
| Qui el signa | Persona física no resident fiscal als EUA | Entitat no nord-americana (la teva LLC, SL, etc.) |
| Dades clau | Nom, país, adreça, data de naixement, ID fiscal | Raó social, país de constitució, EIN/GIIN, tipus d'entitat, status FATCA |
| Pàgines | 1 | 8 (només n'omples 2-3) |
| Conveni | Sí, a la Part II | Sí, a la Part III |
| Validesa | 3 anys | 3 anys |

Una **Single-Member LLC de no resident** és un cas interessant: tot i que l'IRS la tracti com a Disregarded Entity, **el formulari que es presenta normalment és el W-8BEN-E** a nom de la LLC, no el W-8BEN del titular. Algunes plataformes (sobretot Stripe) gestionen la lògica internament i et demanen dades d'un o de l'altre segons com estigui registrada el compte.
### Per què serveixen a la pràctica

Per **evitar la retenció del 30%** sobre pagaments d'origen USA. El conveni entre **els EUA i Espanya** (i equivalents amb molts altres països) redueix aquesta retenció a:

- **0%** sobre la majoria de **rendes empresarials** (serveis prestats des de fora dels EUA sense establiment permanent).
- **15%** sobre **dividends** d'empreses nord-americanes (10% en participacions qualificades).
- **0%** sobre **interessos** en general.
- **0-10%** sobre **royalties** segons el tipus.

Sense un W-8 signat, el pagador reté el 30% i envia els diners a l'IRS. Amb un W-8 ben fet, pots rebre els pagaments íntegres (cas més comú per a serveis) o amb la retenció reduïda del conveni.
### Qui els ha de presentar

El formulari el presenta **qui rep els diners**, no qui els paga. És a dir:

- Tu com a **persona física** si cobres directament d'USA (ex. consultor independent i un client americà et paga via Wise, o un broker t'ingressa dividends al teu nom): **W-8BEN**.
- La teva **LLC** (o la teva societat espanyola, alemanya, mexicana...) si els pagaments van al compte de l'entitat: **W-8BEN-E**.
### Quan presentar-los

- En **obrir qualsevol compte** en un banc, fintech o broker nord-americà.
- En **donar d'alta el teu negoci** en una passarel·la de pagament (Stripe, PayPal Business, Square...).
- Quan un **client USA** te'l demani abans de pagar-te per primera vegada.
- En la **renovació** cada 3 anys (o abans si canvien dades: adreça, país de residència, etc.).
## On es lliuren

A diferència d'altres formularis IRS, **el W-8 no s'envia a l'IRS**. Es lliura al **pagador** (banc, broker, plataforma, client) que el conserva als seus arxius. Si l'autoritat fiscal li demana comptes, el pagador justifica amb el teu W-8 per què no va aplicar la retenció del 30% o per què va aplicar la del conveni.

Les plataformes més habituals tenen formularis W-8 integrats al seu flux d'alta:

- **Stripe** (US i Stripe Atlas): W-8BEN-E embegut en crear el compte.
- **PayPal Business**: el demana en verificar el compte d'empresa.
- **Mercury, Relay, Slash, Wise Business**: per defecte **no** exigeixen W-8 per operar. Només el demanen si una verificació puntual de compliance ho requereix; si la plataforma no te'l reclama, no necessites signar-ne cap.
- **Interactive Brokers, Tradovate, Charles Schwab**: el demanen a l'alta com a client no resident.
- **AdSense, YouTube, Twitch, Amazon KDP, App Store Connect**: tenen el seu propi assistent W-8.
## Com omplir un W-8BEN pas a pas (persona física)

Estructura: una sola pàgina dividida en 3 parts.

**Part I, Identificació del beneficiari:**

1. **Name of individual:** el teu nom complet com apareix al passaport o DNI.
2. **Country of citizenship:** la teva nacionalitat.
3. **Permanent residence address:** adreça de la teva residència fiscal real, no un PO Box ni adreça als USA.
4. **Mailing address:** només si és diferent de l'anterior.
5. **US TIN (SSN/ITIN):** només si en tens. La majoria de no residents ho deixen en blanc.
6. **Foreign tax identifying number:** el teu NIF/NIE.
7. **Reference number:** rares vegades; deixa en blanc llevat que el pagador ho demani.
8. **Date of birth:** format MM-DD-YYYY.

**Part II, Conveni fiscal:**

9. Indica el país amb el qual tens conveni: "Spain" si ets resident fiscal a Espanya.
10. Detall especial: només s'omple si reclames un tipus reduït específic (royalties, beques, etc.). Per a serveis professionals prestats des de fora d'USA, normalment no s'omple.

**Part III, Certificació:**

Signa, data i nom. Estàs declarant sota perjuri que les dades són certes. Mentir aquí et fica en problemes amb dues administracions alhora.
## Com omplir un W-8BEN-E pas a pas (la teva LLC)

És més llarg (8 pàgines) però només omples les parts que apliquen. Per a una **Single-Member LLC de no resident**, el típic és:

**Part I, Identificació de l'entitat:**

1. **Name of organization:** raó social exacta de la teva LLC.
2. **Country of incorporation:** "United States".
3. **Disregarded entity name:** deixa en blanc.
4. **Chapter 3 status:** marca **"Corporation"** si la LLC ha fet election; en la majoria de casos de no residents amb Single-Member, l'opció pràctica és identificar l'entitat i emplenar la **Part III** del conveni. A la pràctica, moltes plataformes indiquen quina casella marcar; si tens dubtes, marca **"Corporation"** perquè és l'opció que el pagador entén millor quan la LLC té EIN propi.
5. **Chapter 4 status (FATCA):** marca **"Active NFFE"** si la teva LLC factura per serveis o ven productes. Si és vehicle d'inversió passiva, "Passive NFFE".
6. **Permanent residence address:** adreça registrada de la LLC als EUA.
7. **Mailing address:** opcional.
8. **US TIN (EIN):** l'EIN de la teva LLC.
9. **GIIN:** deixa en blanc llevat que la LLC sigui entitat financera registrada al FATCA.
10. **Foreign TIN:** ID fiscal del país de residència del beneficiari final.

**Part III, Conveni fiscal:**

- Marca que el beneficiari resideix fiscalment a **Spain**.
- Indica que compleixes la **limitació de beneficis** (Art. 17 del conveni USA-Espanya).
- Indica l'article del conveni i el tipus reduït aplicable.

**Part XXV, Active NFFE:** una casella declarant que més del 50% dels ingressos són actius.

**Part XXX, Certificació:** signa, nom, càrrec i data.
### Errors comuns que et costaran diners

1. **Posar adreça USA com a residència permanent.** El sistema ho interpreta com US person.
2. **Usar W-8BEN quan caldria W-8BEN-E** (o al revés).
3. **No signar.** Sense signatura vàlida, el formulari no compta.
4. **Oblidar el Foreign TIN** quan el pagador l'exigeix.
5. **No marcar Chapter 4 status.** Sense ell, retencions FATCA del 30%.
6. **Reclamar un tipus de conveni que no et correspon.**
7. **No renovar als 3 anys.**
### Validesa i renovació

El W-8 signat val **3 anys naturals complets** des de la data de signatura. Si en aquest termini canvien dades substancials, has de presentar-ne un de nou. Convé marcar al calendari la renovació: la majoria de plataformes avisen, però no totes.
### Relació amb el conveni USA-Espanya

El **Conveni entre el Regne d'Espanya i els Estats Units d'Amèrica per evitar la doble imposició i prevenir l'evasió fiscal**, signat el 1990 i modernitzat pel Protocol de 2013 en vigor des de 2019, és la base legal sobre la qual es recolzen la majoria de tipus reduïts del W-8 quan ets resident espanyol. En particular:

- **Beneficis empresarials (Art. 7):** sense establiment permanent als EUA, els beneficis es graven només a Espanya. Resultat per a serveis prestats des de fora d'USA: **0% de retenció**.
- **Dividends (Art. 10):** retenció reduïda al 15% (10% en participacions qualificades).
- **Interessos (Art. 11):** generalment 0%.
- **Royalties (Art. 12):** entre 0% i 10% segons el tipus.

Si vols entendre com encaixa amb la teva LLC, llegeix també la <a href="/ca/blog/conveni-de-doble-imposicio-usa-espanya-per-a-llcs">guia sobre el conveni de doble imposició USA-Espanya aplicat a LLCs</a>.
### Casos pràctics per plataforma

- **Stripe (US o Atlas):** W-8BEN-E embegut. Omple amb EIN, adreça USA registrada, Chapter 4 = Active NFFE, conveni Espanya = sí. Resultat: 0% retenció sobre serveis.
- **PayPal Business:** demanat en verificar el compte business. Puja el PDF signat.
- **Mercury / Relay / Slash:** **no** el demanen a l'onboarding estàndard de la teva LLC. Només si una revisió puntual de compliance ho exigeix; si la plataforma no te'l reclama, no cal signar-ne cap per operar.
- **Wise Business:** mateix criteri que Mercury / Relay: només si te'l demanen expressament. No és un tràmit per defecte en donar d'alta la LLC.
- **Interactive Brokers:** sol·licitat a l'alta. Indica Espanya com a país i marca "Corporation" per a la LLC. Aplicarà el 15% en dividends americans en lloc del 30%.
- **AdSense / YouTube / Amazon KDP / App Store / Twitch:** cadascun té el seu assistent.
## Com t'ajuda Exentax

A Exentax preparem els W-8BEN-E de la teva LLC allà on realment són exigits: Stripe, IBKR i altres brokers, plataformes d'afiliació, AdSense / YouTube / Amazon KDP i qualsevol pagador USA que en demani un. A Mercury, Relay, Slash o Wise només els signem si la plataforma ho demana expressament. Si ja t'han aplicat el 30% per un W-8 mal fet, també revisem si és viable demanar la devolució via 1042-S i formularis associats, encara que sempre és molt més barat fer-ho bé des de l'inici.

> Cada cas és individual i la legislació fiscal pot canviar; aquests formularis i criteris FATCA s'actualitzen periòdicament. Per això convé revisar el teu paperam amb cada canvi important al teu negoci o cada vegada que l'IRS publiqui una versió nova.

Si vols que revisem la teva situació, reserva la teva consultoria gratuïta amb Exentax i deixarem els W-8 de la teva LLC i la teva paperassa internacional en ordre.

Per aprofundir, llegeix també <a href="/ca/blog/els-comptes-bancaris-americans-informen-a-la-teva-autoritat">Els comptes bancaris als EUA reporten a Hisenda?</a> i <a href="/ca/blog/llc-com-a-alternativa-a-ser-autonom-a-espanya">LLC com a alternativa a ser autònom a Espanya</a>.
## Compliance fiscal al teu país: CFC, TFI i atribució de rendes

Una LLC americana és una eina legal i reconeguda internacionalment. Però el compliment no acaba en constituir-la: com a propietari resident fiscal en un altre país, l'administració tributària local manté el dret a gravar el que la LLC genera. L'important és saber **sota quin règim**.

### Per jurisdicció

- **Espanya (LIRPF/LIS).** Si la LLC és una *Single-Member Disregarded Entity* operativa (serveis reals, sense passivitat significativa), Hisenda la tracta normalment per **atribució de rendes (art. 87 LIRPF)**: els beneficis nets s'imputen al soci l'exercici en què es generen, integrant-se a la base general de l'IRPF. Si la LLC opta per tributar com a *corporation* (Form 8832) i queda controlada per resident espanyol amb rendes majoritàriament passives, pot activar-se la **transparència fiscal internacional (art. 91 LIRPF per a persones físiques, art. 100 LIS per a societats)**. La diferència no és opcional: depèn de la substància econòmica, no del nom.
- **Models informatius.** Comptes als EUA amb saldo mitjà o final >50.000 € a l'exercici: **Model 720** (Llei 5/2022 després de la STJUE C-788/19, 27/01/2022, sancions ara dins del règim general LGT). Operacions vinculades amb la LLC i dividends repatriats: **Model 232**. Criptoactius custodiats als EUA: **Model 721**.
- **CDI Espanya–EUA.** El conveni (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol en vigor 27/11/2019) ordena la doble imposició sobre dividends, interessos i royalties. Una LLC sense establiment permanent a Espanya no constitueix per si sola EP del soci, però la direcció efectiva sí pot crear-lo si tota la gestió es fa des de territori espanyol.
- **Mèxic, Colòmbia, Argentina i altres LATAM.** Cada jurisdicció té el seu propi règim CFC (Mèxic: Refipres; Argentina: rendes passives de l'exterior; Xile: art. 41 G LIR). El principi comú: el que la LLC reté com a benefici es considera percebut pel soci si l'entitat es considera transparent o controlada.
La regla pràctica: una LLC operativa, amb substància, declarada correctament en residència, és **planificació fiscal legítima**. Una LLC que s'utilitza per ocultar ingressos, simular no-residència o desplaçar rendes passives sense justificació econòmica entra al terreny de l'**art. 15 LGT (conflicte en aplicació de la norma)** o, en el pitjor cas, de l'**art. 16 LGT (simulació)**. La diferència la marquen els fets, no el paper.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

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

<!-- exentax:legal-facts-v1 -->
## Fets legals i de procediment

Les obligacions davant la FinCEN i l'IRS s'han mogut en recent years; aquest és l'estat vigent:

### Punts clau

- **BOI / Corporate Transparency Act: la teva LLC NO està obligada (un avantatge competitiu).** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a les "foreign reporting companies"** (entitats constituïdes FORA dels EUA i registrades per operar en un estat). Una **LLC formada als EUA propietat d'un no resident NO presenta el BOI Report**: un tràmit menys al calendari, menys burocràcia i una estructura més neta que mai. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament. L'estat normatiu pot canviar: **monitoritzem FinCEN.gov en cada presentació** i, si l'obligació torna a aplicar, la gestionem sense cost addicional. Estat vigent verificable a [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Per a una **Single-Member LLC propietat d'un no resident**, les regulacions finals Treas. Reg. §1.6038A-1 (vigents des de 2017) tracten la LLC com a corporation a efectes del 5472. Procediment: **Form 1120 pro-forma** (només capçalera: nom, adreça, EIN, exercici) amb **Form 5472 annexat**. Enviament **per correu certificat o fax a l'IRS Service Center d'Ogden, Utah**, **no via MeF/e-file** estàndard. Venciment: **15 d'abril**; pròrroga via **Form 7004** fins al **15 d'octubre**. **Sanció: 25.000 USD per formulari i any, més 25.000 USD per cada 30 dies addicionals** de no presentació després de notificació de l'IRS.
- **Form 1120 substantiu.** Només aplica si la LLC ha fet check-the-box election a C-Corp (Form 8832): tributa al 21 % federal i presenta un 1120 amb xifres reals. La LLC disregarded estàndard **no presenta un 1120 substantiu i no paga corporate tax federal**.
- **EIN i notificacions.** Sense EIN no es pot presentar el 5472 ni el BOI. L'IRS no avisa abans de sancionar; es descobreix quan l'EIN queda bloquejat o una presentació posterior és rebutjada.<!-- exentax:execution-v2 -->
## W-8BEN i W-8BEN-E: la guia completa per no confondre'ls i no pagar 30% per error

El W-8 és el document més important per a un no resident amb qualsevol payer US. Sense ell, retenen 30% per defecte.

- **W-8BEN: per a persones físiques.** El signes TU com a persona. Útil per a royalties, interessos, dividends US-source. 3 anys de validesa.
- **W-8BEN-E: per a entitats, la teva LLC.** Signat pel signatari autoritzat. Identifica LLC, classificació FATCA (single-member disregarded = punt crític), beneficial owner, treaty claim. 3 anys.
- **L'error més comú: marcar Corporation quan és disregarded.** Single-member LLC sense elecció C/S-Corp és "disregarded entity". Si marques Corporation per error: 30% retingut en lloc del 15% (Espanya-US dividends) o 0%.
- **Treaty benefits.** Part III: país de residència amb certificat, citar article del tractat.

### El que més ens pregunten

**He d'enviar W-8BEN-E directament a l'IRS?** No. Al payer, no a l'IRS.

**LLC disregarded: qui reclama el tractat?** El beneficial owner segons el seu país.

A Exentax preparem W-8BEN-E correctes.
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
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Si%20tu%20o%20la%20teva%20LLC%20cobreu%20diners%20des%20dels%20Estats%20Units%20(Stripe%2C%20PayPal%2C%20plat%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->
`;
