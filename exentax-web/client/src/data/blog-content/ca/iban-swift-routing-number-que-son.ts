export default `Quan comences a moure diners amb la teva LLC, et trobaràs amb tres sigles que apareixen una vegada i una altra: **IBAN**, **SWIFT** (o BIC) i **Routing Number**. Són com l'adreça postal del teu compte bancari, però per als diners.

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

## SWIFT / BIC Code

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

## Resum ràpid

| Codi | Què és | Dígits | S'utilitza a | Per a què |
|---|---|---|---|---|
| Routing Number | ID del banc als EUA | 9 | EUA | ACH i Wires domèstics |
| SWIFT/BIC | ID del banc internacional | 8-11 | Mundial | Wires internacionals |
| IBAN | Nº de compte internacional | 15-34 | Europa, MENA, LatAm | Transferències SEPA |
| Account Number | Nº del teu compte | 10-17 | EUA | Identificar el teu compte |

## Quines dades donar a cada tipus de client?

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

Si alguns aspectes d'aquesta estructura t'han deixat amb ganes de més detall, <a href="/ca/blog/ach-vs-transferencia-bancaria-terminis-de-pagament-i-impacte-en-el-flux-de-caixa">ACH vs transferència bancària: terminis de pagament i impacte en el flux de caixa de la LLC</a> i <a href="/ca/blog/com-escalar-el-teu-negoci-digital-amb-una-llc-americana">Com escalar el teu negoci digital amb una LLC americana</a> aprofundeixen en peces veïnes que normalment reservem per a articles a part.

## Mercury: dades bancàries que necessites

Per a Mercury, les dades que donaràs als clients són:

- **Routing Number ACH:** Per a cobraments ACH domèstics (pagaments de clients US, dipòsits de Stripe/PayPal)
- **Routing Number Wire:** Per a wires domèstics (atenció: és diferent del d'ACH)
- **Account Number:** El teu número de compte
- **SWIFT Code:** Per a wires internacionals entrants
- **Adreça del banc:** Column NA, San Francisco, CA

Mercury té $0 en comissions de wire, tant nacionals com internacionals. Els teus fons estan custodiats a Column NA amb assegurança FDIC.

A Exentax et configurem tots els canals de cobrament des del primer dia. Et diem exactament quines dades donar a cada tipus de client perquè els diners arribin ràpid i sense sorpreses. Agenda la teva assessoria gratuïta.`;
