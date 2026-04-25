export default `Quan saltes de l'IBAN espanyol a l'ecosistema bancari nord-americà, et falta la meitat del vocabulari: la teva LLC no et dóna un IBAN, et dóna un routing number i un account number, i el SWIFT només apareix en l'internacional. Fins que no encaixis aquesta diferència, les transferències no surten o arriben amb comissions amagades.

Anem a explicar cadascun de forma clara perquè mai més et quedis pensant "quin li dono a aquest client?"

## Routing Number (ABA Number)

És el codi que identifica un banc dins dels Estats Units. Té **9 dígits** i s'utilitza exclusivament per a transferències domèstiques dins dels EUA.

**Exemple:** 084106768

### Quan el necessites?

- Per rebre pagaments **ACH** de clients americans
- Per rebre **wires domèstics** dins dels EUA
- Per configurar pagaments automàtics (nòmines, subscripcions)
- Per connectar el teu compte amb Stripe, PayPal, Amazon

### On el trobes?

A Mercury: Dashboard → Account Details → "Routing Number"

**Nota important:** Mercury té **dos routing numbers**: un per a ACH i un altre per a Wire. Assegura't de donar el correcte segons el tipus de transferència.
### SWIFT / BIC Code

El **SWIFT** (Society for Worldwide Interbank Financial Telecommunication) o **BIC** (Bank Identifier Code) és el codi que identifica un banc a nivell internacional. Té entre **8 i 11 caràcters** (lletres i números).

**Exemple:** CHASUS33 (JPMorgan Chase)

### Quan el necessites?

- Per rebre **wire transfers internacionals** des de fora dels EUA
- Perquè un client a Europa, Llatinoamèrica o Àsia t'enviï diners

### Per què és diferent del Routing Number?

El Routing Number és per al sistema domèstic americà (ACH/Fedwire). El SWIFT és per al sistema internacional. Són dues xarxes de pagaments diferents.
## IBAN (International Bank Account Number)

L'**IBAN** és un format estandarditzat de número de compte que s'utilitza a Europa, Orient Mitjà i parts de Llatinoamèrica. Té entre **15 i 34 caràcters** (varia per país) i conté el codi del país, el banc i el compte.

**Exemple:** ES91 2100 0418 4502 0005 1332 (Espanya)

### Els comptes americans tenen IBAN?

**No.** Els Estats Units no utilitzen el sistema IBAN. Els comptes americans utilitzen Routing Number + Account Number.

Si un client europeu et demana el teu IBAN per pagar-te, la resposta és: "No tinc IBAN. aquí tens el meu Routing Number, Account Number i SWIFT Code per a wire internacional."

### I si necessites rebre pagaments d'Europa?

Aquí és on **Wise Business** brilla. Wise et dona un IBAN europeu (amb prefix BE o DE) vinculat al teu compte. Els clients europeus poden pagar-te per SEPA com si fos una transferència local, sense comissions de wire internacional.
### Resum ràpid

| Codi | Què és | Dígits | S'utilitza a | Per a què |
|---|---|---|---|---|
| Routing Number | ID del banc als EUA | 9 | EUA | ACH i Wires domèstics |
| SWIFT/BIC | ID del banc internacional | 8-11 | Mundial | Wires internacionals |
| IBAN | Nº de compte internacional | 15-34 | Europa, MENA, LatAm | Transferències SEPA |
| Account Number | Nº del teu compte | 10-17 | EUA | Identificar el teu compte |
### Quines dades donar a cada tipus de client?

### Client americà
- **Routing Number** (ACH o Wire segons el tipus de pagament)
- **Account Number**
- **Nom de la LLC** (com a beneficiari)

### Client europeu
- **SWIFT Code** + **Account Number** + **Routing Number** per a wire internacional
- O millor: **IBAN europeu de Wise** perquè pagui per SEPA (més barat i ràpid)

### Client llatinoamericà
- **SWIFT Code** + **Account Number** + **Routing Number** per a wire internacional
- O: **dades locals de Wise** si el país té compte local disponible
## El truc per cobrar més barat: comptes locals

Aquí va un consell que val or: si tens clients a Europa que et paguen regularment, **NO els donis les teves dades de wire internacional**. Dóna'ls el teu **IBAN europeu de Wise Business**.

Per què? Un wire internacional EUA→Europa pot costar al pagador 20-50€ i trigar 2-5 dies. Un SEPA des del compte Wise de la teva LLC costa 0-1€ i arriba en 1 dia.

Wise (que és una EMI, no un banc) et genera comptes locals en múltiples països:
- **IBAN europeu** (prefix BE o DE) per a cobraments SEPA
- **Dades USD** per a clients americans (routing + account number)
- **Sort code** britànic per a clients UK
- **BSB** australià per a clients a Austràlia

Els teus clients paguen com si fos una transferència local. tu reps al teu balanç multi-divisa de Wise i després transfereixes a Mercury quan et convingui.

Si alguns aspectes d'aquesta estructura t'han deixat amb ganes de més detall, <a href="/ca/blog/ach-vs-transferencia-bancaria-terminis-de-pagament-i-impacte">ACH vs transferència bancària: terminis de pagament i impacte en el flux de caixa de la LLC</a> i <a href="/ca/blog/com-escalar-el-teu-negoci-digital-amb-una-llc-americana">Com escalar el teu negoci digital amb una LLC americana</a> aprofundeixen en peces veïnes que normalment reservem per a articles a part.
### Mercury: dades bancàries que necessites

Per a Mercury, les dades que donaràs als clients són:

- **Routing Number ACH:** Per a cobraments ACH domèstics (pagaments de clients US, dipòsits de Stripe/PayPal)
- **Routing Number Wire:** Per a wires domèstics (atenció: és diferent del d'ACH)
- **Account Number:** El teu número de compte
- **SWIFT Code:** Per a wires internacionals entrants
- **Adreça del banc:** Column NA, San Francisco, CA

Mercury té $0 en comissions de wire, tant nacionals com internacionals. Els teus fons estan custodiats a Column NA amb assegurança FDIC.

A Exentax configurem Mercury, Wise i Revolut Business perquè les transferències entre els teus clients i la teva LLC passin netes. Reserva la teva assessoria gratuïta: et donem el manual correcte per al teu negoci.
## Stack bancari equilibrat: Mercury, Relay, Slash i Wise

No existeix el compte perfecte per a una LLC. Existeix el **stack** correcte, on cada eina cobreix un rol:

- **Mercury** (operada com a fintech amb bancs associats (Choice Financial Group i Evolve Bank & Trust principalment; Column N.A. en comptes heretats), FDIC via sweep network fins al límit vigent). Compte principal operatiu per a no residents amb bona UX, ACH i wires. Continua sent una de les opcions més provades per obrir des de fora dels EUA.
- **Relay** (recolzada per Thread Bank, FDIC). Excel·lent com a **compte de respatller** i per a "envelope budgeting": permet crear fins a 20 subcomptes i 50 targetes de dèbit, integració profunda amb QuickBooks i Xero. Si Mercury bloqueja o demana revisió KYC, Relay evita que la teva operativa s'aturi.
- **Slash** (recolzada per Column N.A. (banc amb llicència federal, FDIC)). Banca dissenyada per a operadors online: emissió instantània de targetes virtuals per proveïdor, controls de despesa granulars, *cashback* en publicitat digital. Complement natural quan gestiones Meta Ads, Google Ads o subscripcions SaaS.
- **Wise Business** (EMI multidivisa, no és banc). Per cobrar i pagar en EUR, GBP, USD i altres divises amb dades bancàries locals i conversió a *mid-market rate*. No substitueix un compte US real, però és imbatible per a tresoreria internacional.
- **Wallester / Revolut Business.** Wallester aporta targetes corporatives amb BIN propi per a alt volum. Revolut Business funciona com a complement europeu, no com a compte principal de la LLC.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

La recomanació realista: **Mercury + Relay com a respatller + Slash per a operativa publicitària + Wise per a tresoreria FX**. És la configuració que minimitza el risc de bloqueig i redueix el cost real. A Exentax obrim i configurem aquest stack com a part de la constitució.
### Següents passos

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
## T'ho muntem sense que perdis un cap de setmana

Milers de freelancers i emprenedors ja operen amb la seva LLC americana de manera 100% legal i documentada. A Exentax ens encarreguem de tot el procés: constitució, banca, passarel·les de pagament, comptabilitat, declaracions <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> i compliance al teu país de residència. Reserva una assessoria gratuïta i et direm amb sinceritat si la LLC té sentit per al teu cas, sense promeses absolutes.<!-- exentax:execution-v2 -->
## IBAN, SWIFT i Routing Number: per a què serveix cadascun i per què la teva LLC els necessita ben configurats

Confondre IBAN, SWIFT/BIC i ABA Routing Number costa pagaments rebutjats, transferències retornades i tres dies de suport amb el banc. Cada format respon a un sistema diferent, i la teva LLC americana fa servir els tres segons el tipus de cobrament.

- **Routing Number (ABA, 9 dígits).** Identificador del banc en el sistema domèstic dels EUA. L'usen ACH (transferències internes US, ràpides i barates) i wires domèstics. Mercury, Bluevine i qualsevol compte US-only et donen Routing Number. Si el client paga des dels EUA, sempre Routing + número de compte.
- **SWIFT/BIC (8-11 caràcters).** Identificador internacional del banc per a transferències transfrontereres. El necessitaràs quan un client europeu, llatinoamericà o asiàtic t'enviï diners des del seu banc local. Mercury, Wise Business donen SWIFT - però el wire internacional costa 15-30 USD i triga 1-3 dies.
- **IBAN (fins a 34 caràcters).** Estàndard europeu + 80 jurisdiccions. Els comptes US tradicionals no tenen IBAN - només SWIFT. Wise Business sí que emet IBANs europeus (Bèlgica, Regne Unit, Hongria) per a la teva LLC, cosa que redueix friccions quan factures a UE: el teu client francès paga l'IBAN de Wise com si fos SEPA local, sense cost de wire.
- **Bones pràctiques operatives.** Per a client US: comparteix Routing + número de compte (ACH). Per a client UE B2B: comparteix IBAN Wise Business. Per a client fora UE/US: comparteix SWIFT + número de compte. Barrejar formats confon l'ordenant i fa rebotar la transferència.

### Què ens pregunten més

**La meva LLC pot tenir IBAN espanyol?** No directament: la LLC és entitat US, sense establiment permanent a UE. Però Wise Business li dona un IBAN europeu assignat (Bèlgica), i això és funcionalment suficient per a SEPA i conversions EUR.

**Per què el meu client europeu no aconsegueix pagar-me amb targeta quan li dono SWIFT?** Perquè SWIFT és transferència bancària, no pagament amb targeta. Per a targeta utilitza Stripe o equivalent. Per a wire, el client necessita SWIFT + número de compte + adreça del beneficiari i del banc.

A Exentax configurem el stack bancari complet de la teva LLC (Mercury principal, Wise Business secundària amb IBAN europeu, i passarel·la de pagament si aplica) perquè cobris net en cada moneda i país.
<!-- /exentax:execution-v2 -->

## Com treballem a Exentax

El nostre equip està especialitzat en estructures fiscals internacionals per a residents de països de parla hispana que operen negocis en línia. Combinem coneixement local d'Espanya, Andorra i l'Amèrica Llatina amb experiència operativa en la constitució d'entitats a Delaware, Wyoming, Estònia i altres jurisdiccions. Cada cas comença amb una consulta gratuïta en la qual avaluem la residència, l'activitat i els objectius, i et diem amb sinceritat si l'estructura proposada té sentit o si una alternativa més senzilla és suficient.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Truca'ns al <a href="tel:+34614916910">+34 614 916 910</a> o escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Quan%20saltes%20de%20l'IBAN%20espanyol%20a%20l'ecosistema%20bancari%20nord-americ%C3%A0%2C%20et%20falta%20%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

`;
