export default `Quan una LLC funciona, la pregunta canvia. Ja no és "hauria d'obrir una LLC?", és "hauria de tenir-ne més d'una?". I quasi sempre: "hauria de passar a una estructura holding?". Aquest article respon amb dades reals: quan el salt es justifica, com es munta sense trencar res, i quant costa de veritat mantenir-lo.

No és per a algú que acaba de constituir la seva primera LLC. És per a qui porta 18-36 mesos operant, té tracció i comença a notar que l'estructura actual li queda petita.

## Quan justifica passar a holding

Quatre disparadors clars. Si en reconeixes dos o més, el salt probablement compensa.

### 1. Volum i barreja de línies de negoci

Si dins la mateixa LLC conviuen cobraments de consultoria, ingressos d'un SaaS, comissions d'afiliació i una botiga online, la comptabilitat es torna un embolic i el risc s'encomana: si una línia té un problema legal, totes les altres queden exposades.

### 2. Risc asimètric entre línies

No totes les activitats tenen el mateix perfil de reclamació. Una agència de màrqueting amb grans contractes assumeix més risc legal que una llibreria de plugins. Si la suma inclou almenys una línia amb risc notable, aïllar-la en una sub-LLC pròpia és una de les decisions més rendibles.

### 3. Planificació patrimonial i herència

Una holding facilita cedir participacions, incorporar familiars i estructurar protocols de successió. Fer-ho des d'una LLC única operativa és desordenat; des d'una holding neta és estàndard.

### 4. Actius intangibles amb valor (marca, IP, programari)

Si la LLC actual posseeix marca registrada, codi propietari o contractes d'IP amb valor propi, separar-los en una entitat pròpia protegeix aquests actius del risc operatiu i obre vies per llicenciar-los a les operatives a preus de mercat.
### Com s'estructura una holding ben muntada

Forma estàndard per a no residents:

\`\`\`
Tu (persona física, resident fiscal del teu país)
│
▼
Holding LLC (Wyoming o Delaware)
│
├── Operativa A LLC (consultoria)
├── Operativa B LLC (SaaS)
└── IP LLC (marca, codi)
\`\`\`

La **Holding LLC** no opera: no factura, no contracta, sense banca activa més enllà de la centralitzadora. Funció: posseir les operatives i consolidar distribucions.

Les **operatives** facturen, bancaritzen, contracten i distribueixen a la holding al tancament.

La **IP LLC** llicencia a les operatives. Només té sentit si la marca/IP té valor real i els imports de llicència són a preus de mercat.
### Estats típics per cada peça

- **Holding:** Wyoming estàndard (charging order protection, privacitat). Delaware si planeges atraure inversors institucionals.
- **Operatives:** New Mexico o Wyoming segons preferència cost/privacitat.
- **IP LLC:** Wyoming, mateixa lògica.

Les operatives no han d'estar al mateix estat que la holding. Distribuir-les sovint ajuda.
### Cost anual real de manteniment

Xifres reals per holding amb tres operatives, totes Wyoming/New Mexico, gestionades per proveïdor pro. USD/any:

| Concepte | Cost anual aproximat |
|---|---|
| Annual Reports estatals (4 entitats × 50-60 USD) | 200-240 |
| Registered Agent (4 × 100-150) | 400-600 |
| Comptabilitat i compliance <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> (5472+1120 × 4) | 1.800-3.200 |
| Actualitzacions BOI si n'hi ha | 0 (gratis) |
| Honoraris estructurals (proveïdor pro) | 1.500-3.500 |
| **Total estimat** | **4.000-7.500 USD/any** |

Més cost únic de constitució (300-700 USD per LLC) i, si escau, transferència d'actius.
### Quan NO compensa

Una holding ben muntada costa 4.000-7.500 USD/any. Perquè el salt compensi, han d'estar presents la majoria dels quatre disparadors. Amb una sola línia de negoci, sense risc asimètric, sense planificació patrimonial pendent i sense actius intangibles diferenciats, la LLC única segueix sent la millor opció durant anys.
### Com es fa la transició sense trencar l'operativa

Quatre fases ordenades:

1. **Constitució de les noves entitats**. 2-4 setmanes.
2. **Obertura bancària** per a holding i noves operatives. 4-8 setmanes en Mercury/Wise/Relay.
3. **Migració progressiva** de contractes i cobraments des de la LLC original, sense tallar facturació. 2-3 mesos.
4. **Tancament o reorganització** de la LLC original.

Total: 4-6 mesos sense que cap client ho noti.
### Alternatives a considerar

Abans del salt:

- **Series LLC**: estructura disponible en alguns estats (Delaware, Texas). Més barata però menys reconeguda internacionalment.
- **Una segona LLC en paral·lel**, sense holding per sobre, per aïllar una línia sense la complexitat estructural completa.
### Com ho abordem a Exentax

A Exentax dissenyem la transició peça a peça: validem primer si la holding compensa amb els teus números, dimensionem l'estructura mínima viable i executem sense trencar l'operativa. Reserva una sessió inicial gratuïta a la nostra pàgina d'agendament.
## Compliance fiscal al teu país: CFC, TFI i atribució de rendes

Una LLC americana és una eina legal i reconeguda internacionalment. Però el compliment no acaba en constituir-la: com a propietari resident fiscal en un altre país, l'administració tributària local manté el dret a gravar el que la LLC genera. L'important és saber **sota quin règim**.

### Per jurisdicció

- **Espanya (LIRPF/LIS).** Si la LLC és una *Single-Member Disregarded Entity* operativa (serveis reals, sense passivitat significativa), Hisenda la tracta normalment per **atribució de rendes (art. 87 LIRPF)**: els beneficis nets s'imputen al soci l'exercici en què es generen, integrant-se a la base general de l'IRPF. Si la LLC opta per tributar com a *corporation* (Form 8832) i queda controlada per resident espanyol amb rendes majoritàriament passives, pot activar-se la **transparència fiscal internacional (art. 91 LIRPF per a persones físiques, art. 100 LIS per a societats)**. La diferència no és opcional: depèn de la substància econòmica, no del nom.
- **Models informatius.** Comptes als EUA amb saldo mitjà o final >50.000 € a l'exercici: **Model 720** (Llei 5/2022 després de la STJUE C-788/19, 27/01/2022, sancions ara dins del règim general LGT). Operacions vinculades amb la LLC i dividends repatriats: **Model 232**. Criptoactius custodiats als EUA: **Model 721**.
- **CDI Espanya–EUA.** El conveni (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol en vigor 27/11/2019) ordena la doble imposició sobre dividends, interessos i royalties. Una LLC sense establiment permanent a Espanya no constitueix per si sola EP del soci, però la direcció efectiva sí pot crear-lo si tota la gestió es fa des de territori espanyol.
- **Mèxic, Colòmbia, Argentina i altres LATAM.** Cada jurisdicció té el seu propi règim CFC (Mèxic: Refipres; Argentina: rendes passives de l'exterior; Xile: art. 41 G LIR). El principi comú: el que la LLC reté com a benefici es considera percebut pel soci si l'entitat es considera transparent o controlada.

La regla pràctica: una LLC operativa, amb substància, declarada correctament en residència, és **planificació fiscal legítima**. Una LLC que s'utilitza per ocultar ingressos, simular no-residència o desplaçar rendes passives sense justificació econòmica entra al terreny de l'**art. 15 LGT (conflicte en aplicació de la norma)** o, en el pitjor cas, de l'**art. 16 LGT (simulació)**. La diferència la marquen els fets, no el paper.

<!-- exentax:lote31-native-v1:llc-unica-estructura-holding-cuando-como-cuesta-ca -->
## Com llegir la qüestió de la LLC holding com un mapatge estructural en lloc d'una elecció d'estatut

La qüestió de la LLC holding es llegeix de manera més útil com un mapatge estructural estable entre la LLC operacional, la LLC holding i el beneficiari, en lloc d'una elecció d'estatut. Aquest mapatge no canvia amb el resultat de l'any.
<!-- /exentax:lote31-native-v1:llc-unica-estructura-holding-cuando-como-cuesta-ca -->

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

A Exentax muntem l'estructura perquè encaixi al primer escenari i documentem cada pas perquè la teva declaració local sigui defensable davant d'una eventual revisió.

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

<!-- exentax:lote18-native-v1:llc-unica-estructura-holding-cuando-como-cuesta-ca -->
## Per què el pas a una estructura de holding es justifica per l'activitat i no per una projecció teòrica

El pas d'una LLC única a una estructura que inclogui una holding no es justifica per una projecció teòrica d'avantatges futurs; es justifica per una lectura honesta de l'activitat tal com ja es presenta. Els indicadors habituals d'un pas útil són la diversificació real de les línies d'activitat, la presència de socis associats només a certes línies, o un volum de distribucions que fa la separació explícitament útil per a la planificació.
<!-- /exentax:lote18-native-v1:llc-unica-estructura-holding-cuando-como-cuesta-ca -->

<!-- exentax:legal-facts-v1 -->
## Fets legals i de procediment

Les obligacions davant la <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a> i l'IRS s'han mogut en recent years; aquest és l'estat vigent:
### Punts clau

- **BOI / Corporate Transparency Act: la teva LLC NO està obligada (un avantatge competitiu).** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a les "foreign reporting companies"** (entitats constituïdes FORA dels EUA i registrades per operar en un estat). Una **LLC formada als EUA propietat d'un no resident NO presenta el BOI Report**: un tràmit menys al calendari, menys burocràcia i una estructura més neta que mai. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament. L'estat normatiu pot canviar: **monitoritzem FinCEN.gov en cada presentació** i, si l'obligació torna a aplicar, la gestionem sense cost addicional. Estat vigent verificable a [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Per a una **Single-Member LLC propietat d'un no resident**, les regulacions finals Treas. Reg. §1.6038A-1 (vigents des de 2017) tracten la LLC com a corporation a efectes del 5472. Procediment: **Form 1120 pro-forma** (només capçalera: nom, adreça, EIN, exercici) amb **Form 5472 annexat**. Enviament **per correu certificat o fax a l'IRS Service Center d'Ogden, Utah**, **no via MeF/e-file** estàndard. Venciment: **15 d'abril**; pròrroga via **Form 7004** fins al **15 d'octubre**. **Sanció: 25.000 USD per formulari i any, més 25.000 USD per cada 30 dies addicionals** de no presentació després de notificació de l'IRS.
- **Form 1120 substantiu.** Només aplica si la LLC ha fet check-the-box election a C-Corp (Form 8832): tributa al 21 % federal i presenta un 1120 amb xifres reals. La LLC disregarded estàndard **no presenta un 1120 substantiu i no paga corporate tax federal**.
- **EIN i notificacions.** Sense EIN no es pot presentar el 5472 ni el BOI. L'IRS no avisa abans de sancionar; es descobreix quan l'EIN queda bloquejat o una presentació posterior és rebutjada.
## Fets bancaris i fiscals que convé precisar

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.



## Tres preguntes que rebem just abans de fer el salt

**Cal tancar la LLC operativa per obrir la holding?** No. La LLC operativa continua; el que canvia és la titularitat: les participacions s'aporten a la holding via Operating Agreement, amb actualització BOI de l'entitat operativa.

**Hi haurà un tall bancari?** Molt breu. El Mercury actualitza el KYC en pocs dies si la documentació està preparada (organigrama, Operating Agreement, EIN de la holding). Coordinem perquè el Stripe i el Wise existents no perdin un dia de cobrament.

**Quant de temps cal planificar en total?** Tres mesos tranquils valen més que un mes a corre-cuita. Seqüenciem: decisió i modelització el primer mes, constitució i onboarding bancari el segon, primera conciliació consolidada el tercer.

<!-- exentax:execution-v2 -->
## LLC única o estructura holding? Quan, com i quant costa cada opció

La pregunta arriba quan el primer any de LLC ja va facturar decentment i comença a aparèixer el segon projecte, l'immoble que vols comprar o el SaaS que vols llançar. Ho fiques tot a la mateixa LLC o crees una holding amb subsidiàries? La resposta depèn de quatre variables mesurables.

- **Quan en té prou amb una LLC única.** Una sola activitat operativa, volum estable, sense actius d'alt valor diferenciats, sense pla de venda parcial. Cost anual: 1.500-2.500 USD. És l'opció òptima per al 80% dels casos els primers 1-3 anys.
- **Quan convé holding + subsidiàries.** Múltiples activitats amb risc desigual, immobles separats (cada propietat en la seva pròpia LLC), pla de venda parcial, equips diferents amb socis diferents per línia. Estructura: holding LLC mare (Wyoming) + subsidiàries operatives.
- **Cost real de la holding.** Holding + 2 subsidiàries: 4-6k USD anuals. Holding + 5 subsidiàries: 8-12k USD. Només compensa si l'estalvi fiscal/protecció/flexibilitat operativa supera aquest cost.
- **Com es construeix tècnicament.** La holding LLC posseeix 100% del membership interest de cada subsidiària. Les subsidiàries facturen als seus clients i, al tancament de l'any, distribueixen benefici a la holding.

### Què ens pregunten més

**Millor començar holding des del dia 1 o esperar?** Llevat que ja tinguis clars 2-3 projectes diferents amb risc desigual, millor començar amb LLC única i crear holding quan aparegui el segon projecte real.

**Wyoming holding + Delaware operativa o tot Wyoming?** Si planeges raise o convertir alguna subsidiària a C-Corp per a VC: Delaware operativa. Si tot bootstrapped: Wyoming en tot.

A Exentax modelem si una LLC única et basta o si ja convé holding, dissenyem l'estructura mínima viable i l'operem comptablement.
<!-- /exentax:execution-v2 -->

## Fets jurídics i de procediment

El que segueix és la visió operativa, no la dels manuals. Hem executat aquesta jugada prou vegades per saber quines variables cedeixen primer sota l'escrutini d'una autoritat fiscal o d'una compliance bancària, i és en aquest ordre que les abordem.

<!-- related-inline-stripped-2026-04 -->

### 1. Volum i barreja de línies de negoci

Nota de camp de qui ho fa córrer mes rere mes amb clients: la regla és simple, és en l'execució que peta. Planifica l'operatiu abans del jurídic.

### 2. Risc asimètric entre línies

### 3. Planificació patrimonial i herència

Apunt concret dels nostres expedients: així passa de debò, no com ho descriu una pàgina comercial. Els números i el calendari pesen - fallar en un fa desmuntar la resta.

### 4. Actius intangibles amb valor (marca, IP, programari)

Nota de camp de qui ho fa córrer mes rere mes amb clients: la regla és simple, és en l'execució que peta. Planifica l'operatiu abans del jurídic.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Quan%20una%20LLC%20funciona%2C%20la%20pregunta%20canvia%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si el teu pla és muntar la LLC a Wyoming, repassa la nostra pàgina de servei <a href="/ca/serveis/llc-wyoming">LLC a Wyoming</a> amb costos, terminis i propers passos concrets.

<!-- exentax:conv-fill-v1 -->
O truca'ns directament al <a href="tel:+34614916910">+34 614 916 910</a> si prefereixes parlar.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

  ### Holding LLC única per a residents a Espanya, Catalunya i Andorra

  Per a residents fiscals a Espanya/Catalunya, la **transparència fiscal internacional (TFI) de l'art. 100 LIRPF** s'activa si la LLC holding controla participacions en jurisdiccions de baixa tributació. La **doctrina del TEAC en la resolució 6555/2017 de 19/02/2020** classifica les LLCs amb dos o més socis com a partnerships transparents als efectes espanyols, cosa que activa la imputació directa als socis residents.

  Per a residents a **Andorra**, la **Llei 95/2010 de l'Impost sobre Societats** preveu un règim de **participation exemption** semblant al de Luxemburg per a holdings amb participacions ≥ 5 % o cost ≥ €250.000 i un any de tinença mínima. El **conveni Andorra-EUA en vigor des de l'1 de gener de 2024** elimina la doble imposició sobre dividends i interessos qualificats.

<!-- exentax:lote18-native-v1:llc-unica-estructura-holding-cuando-como-cuesta-ca-bis -->
## Com fixar la decisió de transició en un memorandum curt

La decisió de transició es fixa en un memorandum curt que enumera els indicadors que efectivament hi havia en el moment de la decisió. Aquest memorandum serveix més tard com a punt de referència.
<!-- /exentax:lote18-native-v1:llc-unica-estructura-holding-cuando-como-cuesta-ca-bis -->

<!-- exentax:cross-refs-v1 -->
## Per continuar la lectura

- [Holding empresarial: com funciona realment](/ca/blog/holding-empresarial-com-funciona)
- [De single-member a multi-member LLC: implicacions fiscals reals](/ca/blog/de-single-member-a-multi-member-llc-implicacions-fiscals)
- [LLC vs Corporation, S-corp vs C-corp: la guia pràctica](/ca/blog/diferencia-llc-vs-corporation-s-corp-c-corp-guia)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/serveis/llc-wyoming">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

`;
