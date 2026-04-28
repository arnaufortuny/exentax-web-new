export default `Si la teva banca de la LLC és "Mercury per a tot perquè és el que em van dir", estàs deixant diners i fiabilitat sobre la taula. Mercury és excel·lent per a molts casos, però l'arquitectura bancària òptima d'una LLC activa rarament és un sol compte en una sola plataforma.

## Quan reorganitzar

Tres senyals:

1. **Diverses divises** (USD, EUR, GBP) i costos de conversió no trivials.
2. **Diversos processadors** (Stripe, PayPal, Wise, Amazon, Shopify) i conciliació dolorosa.
3. **Bloqueig temporal** al compte principal sense backup operatiu.
### Tres actors de referència

### Mercury
Punts forts: millor UX US-domestic, comptabilitat integrada, targetes virtuals, free tier generós. Límits: només USD, FX menys competitiu, KYC poden ser estrictes.

### Wise Business
Punts forts: multi-divisa nativa, FX interbancari, IBAN EUR, compte USD amb wire details. Límits: no és banc US (EMI), targetes més limitades.

### Relay
Punts forts: banc US sòlid, fins a 20 sub-comptes, permisos d'equip. Límits: UX menys polida.
### Arquitectures de referència per cas

### Cas 1: LLC de serveis, principalment USD, baix volum
**Mercury sol** arriba.

### Cas 2: SaaS o e-commerce multi-divisa
**Mercury (USD primari) + Wise (multi-divisa)**. Cobreix 80-90 % dels casos.

### Cas 3: agència o operació amb diverses línies
**Relay (sub-comptes per línia) + Wise (multi-divisa)**. Sub-comptes "operating", "impostos", "owner draw", "coixí".

### Cas 4: alt volum amb rotació constant
**Mercury + Wise + backup** (Relay o una altra fintech).
### Principis

1. **Comptes especialitzats**, no improvisats.
2. **Fluxos KYC-friendly**: el que circula ha de coincidir amb el que es va declarar en l'obertura.
3. **Redundància operativa**: almenys dos comptes operatius en dos proveïdors diferents.
4. **Integració comptable**: assegura't que la stack integri amb QuickBooks, Xero o Wave.
### Procediment de migració sense trencar l'operativa

1. **Obrir els nous comptes** mantenint l'existent actiu. 4-8 setmanes de KYC.
2. **Migrar fluxos progressivament**: un client, un processador alhora.
3. **Actualitzar dades bancàries per escrit** amb cada contrapart, data efectiva.
4. **Mantenir el compte antic en backup** com a mínim 90 dies.
5. **Tancar el compte antic de forma neta** amb carta formal, extractes descarregats.

Migració neta: 3-6 mesos.
### Errors comuns

- **Tancar el compte antic abans que el nou estigui plenament operatiu**.
- **Dividir fluxos sense escriure la regla**.
- **Massa comptes**: més de quatre rarament es justifica.
- **Oblidar actualitzar subscripcions recurrents** a la targeta antiga.
### Com ho abordem a Exentax

A Exentax dissenyem stacks bancàries en funció dels fluxos reals, no de la moda. Reserva una sessió inicial gratuïta a la nostra pàgina d'agendament.
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
- **Revolut Business**: quan s'associa a una **LLC nord-americana**, opera sota **Revolut Technologies Inc.** amb **Lead Bank** com a banc partner als EUA. El compte lliurat és un compte dels EUA (routing + account number); **no s'emet IBAN europeu** a una LLC. Els IBAN europeus (lituans, BE) són de **Revolut Bank UAB** i s'emeten a clients europeus del grup. Si li ofereixen un IBAN europeu associat a la seva LLC, confirma a quina entitat jurídica està associat i sota quin règim reporta.
- **Tributació zero**: cap estructura LLC aconsegueix "zero impostos" si vius en un país amb regles CFC/transparència fiscal o atribució de rendes. El que s'aconsegueix és **no duplicar tributació** i **declarar correctament a residència**, no eliminar-la.
## Fets bancaris i fiscals que convé precisar

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.

## Fets jurídics i de procediment

El que segueix és la visió operativa, no la dels manuals. Hem executat aquesta jugada prou vegades per saber quines variables cedeixen primer sota l'escrutini d'una autoritat fiscal o d'una compliance bancària, i és en aquest ordre que les abordem.

<!-- exentax:lote18-native-v1:reorganizar-banca-llc-mercury-relay-wise-ca -->
## Per què reorganitzar la banca d'una LLC es prepara com a transferència i no com a tancament

Reorganitzar l'estructura bancària d'una LLC incorporant Mercury, Relay i Wise es prepara com una transferència d'operacions i no com un tancament seguit de reobertura. La diferència és concreta: una transferència manté els fluxos operatius durant la transició, mentre que un tancament els interromp i obliga a reconstruir la cadena de pagaments i recepcions de zero.
<!-- /exentax:lote18-native-v1:reorganizar-banca-llc-mercury-relay-wise-ca -->

<!-- exentax:lote27-native-v1:reorganizar-banca-llc-mercury-relay-wise-ca -->
## Com llegir la reorganització bancària de la LLC com una actualització de mapatge en lloc d'un canvi de proveïdor

La reorganització bancària de la LLC es llegeix de manera més útil com una actualització del mapatge rol-per-proveïdor entre Mercury, Relay i Wise, que com un canvi de proveïdor aïllat. Una nota curta i datada al dossier de la LLC que registri quin proveïdor fa quin paper al nou stack i quins ho feien a l'anterior fa la reorganització consultable en pocs minuts.
<!-- /exentax:lote27-native-v1:reorganizar-banca-llc-mercury-relay-wise-ca -->

<!-- exentax:lote27-native-v1:reorganizar-banca-llc-mercury-relay-wise-ca-bis -->
## Com llegir la transició entre stack antic i nou com una nota datada en lloc d'un canvi implícit

La transició entre l'stack antic i el nou es pren de manera més serena com una nota curta i datada que registra la data del canvi i el paper de cada proveïdor abans i després — fent que qualsevol qüestió posterior es pugui respondre en pocs minuts sense reconstruir el context de memòria.
<!-- /exentax:lote27-native-v1:reorganizar-banca-llc-mercury-relay-wise-ca-bis -->

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

## Referències: fonts i normativa bancària

Tractem aquest bloc com una de les decisions que sostenen l'estratègia LLC: errar aquí i la resta de l'estructura perd fiscalitat, accés bancari o compliance. Les notes que segueixen reflecteixen el que fem realment amb clients en aquest cas concret, prioritzant les variables que mouen el resultat.
## T'ho muntem sense que perdis un cap de setmana

La nostra posició aquí és deliberadament conservadora: optimitzem allò que sobreviu a una inspecció, no la xifra més agressiva. Els punts següents són els que estem disposats a defensar per escrit.

<!-- related-inline-stripped-2026-04 -->

### Principi rector: mai tallar abans de tenir el substitut operatiu

Detall pràctic per fixar abans d'actuar. La major part del dany evitable que veiem en aquest punt ve de saltar-se la documentació, no de la lògica fiscal subjacent.

### Pas 1. Obrir el nou compte sense tocar l'actual

Aquest és un dels punts que auditem primer quan assumim un expedient. Si no està net aquí, qualsevol hipòtesi posterior esdevé negociable davant de l'autoritat.

### Pas 2. Fer un test funcional amb un moviment petit

Detall pràctic per fixar abans d'actuar. La major part del dany evitable que veiem en aquest punt ve de saltar-se la documentació, no de la lògica fiscal subjacent.

## Actualització Exentax avui: stack bancari al dia

L'stack bancari recomanat per a una LLC actualment ha consolidat tres peces amb funcions complementàries:

- **Mercury (operativa principal).** Compte a través de **Column NA**, **cobertura FDIC fins a 5 M USD** via sweep, **wires domèstics a 0 USD**, internacionals 0 entrants / 5 sortints (depèn del corredor), 20+ sub-comptes gratuïts. Ideal com a compte operatiu USD i base de la comptabilitat.
- **Relay (multicompte i regles).** Fins a 20 comptes operatius + regles d'auto-repartiment (impostos, opex, estalvi). Útil quan la LLC comença a separar *buckets* de caixa sense passar a ERP. Compatible amb Plaid per a integració amb Wave/Quickbooks.
- **Wise Business (multidivisa).** EMI amb 50+ divises a tipus mig interbancari, FX típic **0,4-1,5 %**, dades locals en 10+ països. Indispensable si reps en EUR/GBP o pagues a freelancers LATAM/UE.

### Model d'stack avui segons volum

| Volum anual | Configuració recomanada |
|---|---|
| &lt; 50 k USD | Mercury sol |
| 50-300 k USD | Mercury + Wise (multidivisa) |
| 300 k-1 M USD | Mercury + Relay (buckets) + Wise (FX) |
| > 1 M USD | Mercury + Relay + Wise + compte tradicional EUA (Bank of America/Chase) per a wires d'escala |

### Reorganització en 4 passos

1. **Inventari.** Llista tots els comptes actius i el seu ús real.
2. **Decisió.** Aplica el model segons volum i tanca els comptes redundants.
3. **Migració.** Reapunta clients (noves wire instructions signades), actualitza factures pendents, redirigeix Stripe payouts.
4. **KYC preventiu.** Abans del primer moviment gran al nou compte, puja proactivament: Articles, EIN Letter (emès per l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>), OA signat i prova de domicili.

### Preguntes freqüents avui

**Mercury continua sent l'opció per defecte actualment?** Sí. La cobertura FDIC via sweep i els 0 USD en wires domèstics continuen sense tenir competència clara per a LLC no residents.

**Quan convé un compte tradicional?** A partir de ~1 M USD anuals o quan treballes amb clients corporate USA que paguen exclusivament via ACH des de bancs tradicionals.

**Wise reporta via CRS?** Wise Europe SA (Bèlgica) sí està subjecta a CRS per a residents europeus. Documenta correctament la teva residència fiscal.

<!-- exentax:execution-v2 -->
## Com reorganitzem la banca d'una LLC a Exentax quan ja no escala

Quan una LLC comença a rebre pagaments seriosos, el stack inicial (de vegades només Mercury) es queda curt: límits, retencions, una sola passarel·la i zero reserva. El mètode Exentax el reorganitza sense downtime ni tancaments.

- **Compte principal i compte mirall** en paral·lel: Mercury o Relay com a operatiu, Wise com a reserva multi-divisa, Stripe + Paddle/DoDo com a passarel·les.
- **Migració progressiva** de domiciliacions i subscripcions perquè cap client vegi un cobrament fallit durant la transició.
- **KYC ampliat preparat** amb descripció d'activitat, MCC i documentació coherent entre tots els comptes per passar revisions de segona línia.

Si el teu stack actual ja no aguanta, obre la <strong>calculadora Exentax</strong> o reserva trenta minuts: lliurem el pla de migració per escrit abans de tocar res.
<!-- /exentax:execution-v2 -->

## El cas específic del resident fiscal a Catalunya o l'Estat espanyol i a Andorra

  **A l'Estat espanyol**, la reorganització bancària suposa actualització del **Model 720** si el saldo agregat de les noves entitats supera 50 000 € al tancament o saldo mitjà del quart trimestre, en aplicació de la **Disposició Addicional 18a de la LGT** (modificada per la Llei 5/2022). El nou règim sancionador (articles 198 i 199 LGT) substitueix l'anterior declarat contrari al dret UE pel TJUE en el cas C-788/19.

<!-- exentax:lote7-native-v1:reorganizar-banca-llc-mercury-relay-wise -->
## Quan el stack és el coll d'ampolla, no el banc

La majoria de trucades que rebem per "vull reorganitzar la banca de
la meva LLC" no són, de fet, sobre un mal banc. Són sobre un stack
que ha crescut per casualitat: un compte Mercury obert el primer
any, un canal de payout Stripe afegit quan van arribar els pagaments
web, una targeta Wise introduïda per a despeses publicitàries i, en
algun moment, Relay o una altra fintech provada per a integracions
comptables. Al cap de dos o tres anys el resultat és una topologia
que ningú ha dissenyat a propòsit, i petites friccions s'acumulen:
la conciliació es fa més lenta, els costos de canvi es tornen
invisibles, i les preguntes de KYC cauen sobre qui ha estat el
darrer a ser onboardat.

La reorganització rarament significa tancar comptes. Significa,
sovint, redirigir-los perquè cadascun tingui una sola feina clara i
els altres mantinguin papers de reserva endreçats.

## Una assignació neta de papers per compte

| Compte      | Paper principal                              | Paper secundari               |
|-------------|----------------------------------------------|-------------------------------|
| Mercury     | Banc US domiciliari, operacions ACH/wire     | Targeta si volum baix         |
| Relay       | Integracions comptables + sub-comptes        | ACH de reserva                |
| Wise        | Recepció multi-moneda (EUR/GBP) + canvi      | Targeta per a despesa publicitària |
| Stripe      | Entrada web/marketplace + payouts            | Reserva retinguda per Stripe  |

Quan cada compte té un únic paper principal, les regles comptables
s'escriuen soles: Mercury reconcilia amb la caixa operacional, Wise
amb els saldos FX per moneda, Stripe amb els ingressos i la reserva,
Relay amb els sub-comptes de despesa. La pregunta "on és aquest
moviment?" deixa d'aparèixer.

## Tres patrons reals que apliquem

- Sortida de la "fragilitat de banc únic". Client només tenia
  Mercury i una revisió de rutina va bloquejar temporalment les
  transferències de sortida. Vam afegir Relay com a ACH de reserva i
  una petita capa multi-moneda Wise per a factures en EUR. Cost
  marginal. Benefici: ja no hi ha punt únic de fallada sobre salari
  o pagaments a proveïdors.
- Sortida del "Stripe s'està convertint en el banc". Client deixava
  grans reserves a Stripe i treia fons personals directament des de
  Stripe. Vam redirigir els payouts Stripe a Mercury diàriament, vam
  mantenir Wise per a factures a clients de la UE i Stripe va passar
  a ser purament rail d'entrada.
- Sortida de "la targeta Wise és la targeta de l'empresa". Client
  utilitzava la targeta Wise com a targeta principal. Vam moure SaaS
  recurrents i despeses pròximes al salari a Mercury (on la pista
  d'auditoria és de qualitat bancària) i vam mantenir la targeta
  Wise estrictament per a anuncis pagats.

## Errors que veiem en una reorganització

- Tancar el compte antic primer. Obrir i iniciar sempre el nou paper
  abans de tancar res; l'historial de compte forma part del registre
  bancari de la LLC.
- Moure grans saldos en una sola transferència. Dividir en trams
  operacionals normals; els moviments tipus tresoreria sovint
  desencadenen una actualització de KYC.
- Deixar que targetes "personals" es barregin. La llista de
  targetes de la LLC ha de ser curta, nominada i reconciliada
  mensualment.
- Oblidar actualitzar les dades de beneficiari efectiu després del
  canvi. Si la declaració BOI té l'adreça de la LLC, tots els
  perfils bancaris hi han de coincidir.

## Checklist de reorganització

- Mapar els comptes actuals a la taula de papers de dalt.
- Identificar el o els papers que hi falten.
- Obrir els nous comptes de paper; prefinançar amb imports petits.
- Migrar fluxos recurrents d'entrada/sortida en un període de 30
  dies en ombra.
- Tancar només el que sigui realment redundant i només després d'un
  tancament mensual net.

Tractem el stack bancari com el sistema circulatori de la LLC: cada
vas té una feina, i reorganitzar significa corregir el plànol, no
arrencar els vasos.

<!-- /exentax:lote7-native-v1:reorganizar-banca-llc-mercury-relay-wise -->

<!-- exentax:cross-refs-v1 -->
## Per continuar la lectura

- [Com obrir un compte Mercury per a la teva LLC des de qualsevol país](/ca/blog/com-obrir-un-compte-mercury-per-a-la-teva-llc-des-de)
- [Bancs tradicionals vs fintech per a la teva LLC: on obrir el compte](/ca/blog/bancs-tradicionals-vs-fintech-per-a-la-teva-llc-on-obrir-el)
- [Com evitar bloquejos de compte a Mercury, Wise i Revolut](/ca/blog/com-evitar-els-bloquejos-de-compte-a-mercury-wise-i-revolut)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Si%20la%20teva%20banca%20de%20la%20LLC%20%C3%A9s%20Mercury%20per%20a%20tot%20perqu%C3%A8%20%C3%A9s%20el%20que%20em%20van%20dir%2C%20%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.

<!-- exentax:conv-fill-v1 -->
O truca'ns directament al <a href="tel:+34614916910">+34 614 916 910</a> si prefereixes parlar.

Per a detalls per estat, consulta la nostra <a href="/ca/serveis/llc-wyoming">pàgina del servei LLC a Wyoming</a> amb costos i terminis tancats.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->
`;