export default `Si fa temps que tens la teva LLC i Mercury, Wise o la teva passarel·la et demanen de sobte documentació addicional sobre l'origen dels fons, no estàs sol. És una de les peticions que més ansietat genera i quasi sempre una de les més fàcils de resoldre bé si s'aborda amb ordre.

Clau: no és sospita. És procés regulat de revisió periòdica. El que decideix el desenllaç no és el que tens, és **com ho presentes**.

## Què és una segona ronda KYC

Revisió periòdica re-verifica: beneficiari efectiu, naturalesa del negoci, origen dels fons, coherència amb el que es va declarar en obrir.

Disparadors: volum acumulat, canvi de patró, renovació periòdica (12-36 mesos), info puntual.
### Què et demanaran típicament

- **Identificació actualitzada**.
- **Articles of Organization** actuals.
- **EIN Confirmation Letter** o 147C.
- **BOI Report confirmation**.
- **OA signat**.
- **Descripció del negoci**.
- **Justificants d'ingressos**: factures, contractes, extractes de passarel·les.
- **Origen dels fons inicials** si la pregunta apunta a l'aportació de capital.
- **Declaracions fiscals** en alguns casos.
### Principi rector: narrativa coherent

Les institucions busquen **coherència** entre el que vas dir en obrir, el BOI, els extractes i el que dius ara.
## Procediment

### Pas 1. Llegir el correu amb calma
La majoria de peticions són específiques (4-7 documents, termini 7-14 dies).

### Pas 2. Recollir paquet actual
Articles, EIN Letter, OA, BOI confirmation, passaport i prova de domicili vigents, 5-10 factures representatives.

### Pas 3. Preparar descripció del negoci en una pàgina
Què fa la LLC, a qui ven, com cobra, quant factura, origen dels fons inicials.

### Pas 4. Justificar origen dels fons
- Serveis professionals: factures + contractes + extractes.
- SaaS: dashboard Stripe/Paddle + payouts conciliats.
- E-commerce: Shopify/Amazon + payouts + factures de proveïdors.
- Aportacions inicials: extracte del compte d'origen.
- Cripto: històric de l'exchange + on-chain.

### Pas 5. Enviar paquet complet en un sol enviament
Amb correu d'introducció enumerant els annexos per ordre.

### Pas 6. Mantenir disponibilitat
Respondre en 24-48h a les clarificacions.
### El que NO has de fer

- Respondre amb pressa sense coherència.
- Moure diners "per alleujament".
- Mentir o exagerar.
- Canviar adreça o dades del perfil durant la revisió.
- Ignorar el correu.
### Quan el suport professional compensa

- Volums alts.
- Operativa multi-país/multi-divisa complexa.
- Historial amb incidents previs.
### Com ho abordem a Exentax

A Exentax acompanyem rondes KYC amb regularitat. Reserva una sessió inicial gratuïta a la nostra pàgina d'agendament.
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

Les obligacions davant la <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a> i l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> s'han mogut en recent years; aquest és l'estat vigent:
### Punts clau

- **BOI / Corporate Transparency Act: la teva LLC NO està obligada (un avantatge competitiu).** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a les "foreign reporting companies"** (entitats constituïdes FORA dels EUA i registrades per operar en un estat). Una **LLC formada als EUA propietat d'un no resident NO presenta el BOI Report**: un tràmit menys al calendari, menys burocràcia i una estructura més neta que mai. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament. L'estat normatiu pot canviar: **monitoritzem FinCEN.gov en cada presentació** i, si l'obligació torna a aplicar, la gestionem sense cost addicional. Estat vigent verificable a [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Per a una **Single-Member LLC propietat d'un no resident**, les regulacions finals Treas. Reg. §1.6038A-1 (vigents des de 2017) tracten la LLC com a corporation a efectes del 5472. Procediment: **Form 1120 pro-forma** (només capçalera: nom, adreça, EIN, exercici) amb **Form 5472 annexat**. Enviament **per correu certificat o fax a l'IRS Service Center d'Ogden, Utah**, **no via MeF/e-file** estàndard. Venciment: **15 d'abril**; pròrroga via **Form 7004** fins al **15 d'octubre**. **Sanció: 25.000 USD per formulari i any, més 25.000 USD per cada 30 dies addicionals** de no presentació després de notificació de l'IRS.
- **Form 1120 substantiu.** Només aplica si la LLC ha fet check-the-box election a C-Corp (Form 8832): tributa al 21 % federal i presenta un 1120 amb xifres reals. La LLC disregarded estàndard **no presenta un 1120 substantiu i no paga corporate tax federal**.
- **EIN i notificacions.** Sense EIN no es pot presentar el 5472 ni el BOI. L'IRS no avisa abans de sancionar; es descobreix quan l'EIN queda bloquejat o una presentació posterior és rebutjada.
## Fets bancaris i fiscals que convé precisar

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.

<!-- exentax:execution-v2 -->
## Justificar origen de fons en KYC bancari: la "segona ronda" que gairebé ningú prepara

La primera ronda de KYC es passa amb passaport i adreça. La segona ronda - que arriba als 3-9 mesos amb la primera entrada significativa - és on cau el 30% dels comptes. És la fase del "volem entendre d'on ve aquest diner".

- **Què et demanaran.** Source of Wealth (com vas construir el teu patrimoni en general) i Source of Funds (origen específic del diner que entra avui). Documents típics: declaracions de renda dels últims 2-3 anys, contractes de venda d'actius previs, extractes bancaris amb acumulació, contractes dels clients que generen els ingressos actuals.
- **El que passa el filtre sense discussió.** Traçabilitat lineal: declaració any X mostra ingrés, banc origen mostra acumulació, transferència entrant de client identificat amb contracte de serveis i factura emesa per la teva LLC. Cada euro té paper darrere.
- **El que dispara una alerta.** Ingressos en efectiu recents, transferències de comptes tercers sense justificar relació, cripto convertit sense traçabilitat on-chain documentada, "préstecs familiars" sense contracte notarial.
- **Quan preparar-ho.** Abans de la primera entrada >25.000 EUR/USD, no després de la sol·licitud del banc. Carpeta digital preparada = resposta en 24 hores; sense ella, 3-6 setmanes i possible tancament.

### Què ens pregunten més

**Cripto convertit a fiat és problemàtic?** Sí, llevat de traçabilitat on-chain completa: wallets pròpies, transaccions identificables, declaració de l'any en què es va generar la plusvàlua i de la conversió.

**I si els fons vénen d'una venda d'empresa fa anys?** Passa el filtre sempre que tinguis: contracte de venda, escriptura de cancel·lació de participació, extractes del banc original, declaració de l'any (amb plusvàlua) i traçabilitat fins al compte actual.

A Exentax preparem el dossier de Source of Wealth/Funds abans de la primera operació significativa: documents, narrativa coherent i traducció jurada quan aplica - perquè la segona ronda no congeli la teva operativa.
<!-- /exentax:execution-v2 -->

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

## Fets jurídics i de procediment

El que segueix és la visió operativa, no la dels manuals. Hem executat aquesta jugada prou vegades per saber quines variables cedeixen primer sota l'escrutini d'una autoritat fiscal o d'una compliance bancària, i és en aquest ordre que les abordem.

<!-- related-inline-stripped-2026-04 -->

### Pas 1. Llegir el correu amb calma i al detall

Nota de camp de qui ho fa córrer mes rere mes amb clients: la regla és simple, és en l'execució que peta. Planifica l'operatiu abans del jurídic.

### Pas 2. Recopilar el teu paquet actual

Aquest és un dels punts que auditem primer quan assumim un expedient. Si no està net aquí, qualsevol hipòtesi posterior esdevé negociable davant de l'autoritat.

### Pas 3. Preparar la descripció del negoci en una pàgina

Apunt concret dels nostres expedients: així passa de debò, no com ho descriu una pàgina comercial. Els números i el calendari pesen - fallar en un fa desmuntar la resta.

### Pas 4. Justificar l'origen de fons amb casos típics

Detall pràctic per fixar abans d'actuar. La major part del dany evitable que veiem en aquest punt ve de saltar-se la documentació, no de la lògica fiscal subjacent.

### Pas 5. Enviar el paquet complet en un sol enviament

Aquest és un dels punts que auditem primer quan assumim un expedient. Si no està net aquí, qualsevol hipòtesi posterior esdevé negociable davant de l'autoritat.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Si%20fa%20temps%20que%20tens%20la%20teva%20LLC%20i%20Mercury%2C%20Wise%20o%20la%20teva%20passarel%C2%B7la%20et%20dem%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->
`;
