export default `Si la teva LLC opera des de fa un temps i la separació entre els teus diners personals i els de la LLC no està perfectament documentada, tens un problema a l'espera. No es manifesta avui; es manifesta el dia que un banc fa una revisió profunda, l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> demana justificants o el teu fisc demana traç de fluxos.

## Per què importa la separació de fons

### 1. Corporate veil
Barrejar diners personals i de la LLC és l'exemple de manual que permet trencar el vel.

### 2. Form 5472
Per a SMLLC no resident, el 5472 ha de reportar qualsevol transacció entre tu i la LLC.

### 3. KYC i banca
En revisió profunda, Mercury, Wise o Relay miren primer si els fluxos coincideixen amb l'activitat declarada.
### Què significa separar de veritat

- **Cobraments de clients només a comptes de la LLC**.
- **Despeses business pagades només amb targetes/comptes de la LLC**.
- **Moviments entre tu i la LLC** documentats formalment (Capital Contribution, Owner Distribution, Loan), amb concepte clar a l'extracte.
## Reconstruir documentació

### Pas 1. Cartografiar 12-24 mesos
Descarregar extractes en CSV. Identificar cada moviment tu ↔ LLC amb data i import.

### Pas 2. Classificar cada moviment
Quatre categories: Capital Contribution, Owner Distribution, Loan to/from member, Reimbursement.

### Pas 3. Generar documentació retroactiva
- **Capital Contribution**: nota escrita a la data amb import i finalitat, registrada al Member's Capital Account.
- **Distribution**: nota escrita amb import, benefici d'origen i beneficiari.
- **Loan**: Promissory Note simple amb data, import, calendari, interès (mínim AFR).
- **Reimbursement**: factura original + apunt comptable.

No és mentir retroactivament; és documentar la substància del que es va fer.

### Pas 4. Ajustar la comptabilitat
Cada moviment documentat amb la categoria corresponent.

### Pas 5. Regles forward-looking
- **Cap despesa business a la targeta personal**; si passa, documentar el reemborsament la mateixa setmana.
- **Cap despesa personal a la targeta de la LLC**.
- **Tots els moviments tu ↔ LLC** amb concepte clar.
### I el passat sense justificants?

- **Documentar amb el raonable** segons el context.
- **No inventar factures**.
- **Classificació més conservadora en cas de dubte** (moviment d'origen poc clar es tracta com Distribution, no com Reimbursement).
### Com ho abordem a Exentax

A Exentax fem aquest exercici cada mes amb clients que arriben amb deute tècnic acumulat. Reserva una sessió inicial gratuïta a la nostra pàgina de contacte.

_Per ampliar en la mateixa sèrie: [trencar el vel corporatiu: com evitar-lo](/ca/blog/separar-diners-personals-i-de-la-llc-per-que-es-important), [comptabilitat per a la teva LLC: millors pràctiques](/ca/blog/bookkeeping-per-a-la-teva-llc-americana-pas-a-pas), [Form 5472: quan presentar-lo i quina sanció](/ca/blog/que-passa-si-no-presentes-el-form-5472-multes-irs-i-com)._

<!-- related-inline-stripped-2026-04 -->

### Pròxims passos

Si vols validar, a Exentax revisem el teu cas de forma personalitzada. Reserva una sessió inicial sense compromís a la nostra pàgina de contacte.

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

Les obligacions davant la <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a> i l'IRS s'han mogut en recent years; aquest és l'estat vigent:

### Punts clau

- **BOI / Corporate Transparency Act: la teva LLC NO està obligada (un avantatge competitiu).** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a les "foreign reporting companies"** (entitats constituïdes FORA dels EUA i registrades per operar en un estat). Una **LLC formada als EUA propietat d'un no resident NO presenta el BOI Report**: un tràmit menys al calendari, menys burocràcia i una estructura més neta que mai. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament. L'estat normatiu pot canviar: **monitoritzem FinCEN.gov en cada presentació** i, si l'obligació torna a aplicar, la gestionem sense cost addicional. Estat vigent verificable a [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Per a una **Single-Member LLC propietat d'un no resident**, les regulacions finals Treas. Reg. §1.6038A-1 (vigents des de 2017) tracten la LLC com a corporation a efectes del 5472. Procediment: **Form 1120 pro-forma** (només capçalera: nom, adreça, EIN, exercici) amb **Form 5472 annexat**. Enviament **per correu certificat o fax a l'IRS Service Center d'Ogden, Utah**, **no via MeF/e-file** estàndard. Venciment: **15 d'abril**; pròrroga via **Form 7004** fins al **15 d'octubre**. **Sanció: 25.000 USD per formulari i any, més 25.000 USD per cada 30 dies addicionals** de no presentació després de notificació de l'IRS.
- **Form 1120 substantiu.** Només aplica si la LLC ha fet check-the-box election a C-Corp (Form 8832): tributa al 21 % federal i presenta un 1120 amb xifres reals. La LLC disregarded estàndard **no presenta un 1120 substantiu i no paga corporate tax federal**.
- **EIN i notificacions.** Sense EIN no es pot presentar el 5472 ni el BOI. L'IRS no avisa abans de sancionar; es descobreix quan l'EIN queda bloquejat o una presentació posterior és rebutjada.
## Com ho abordem a Exentax

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.
### Propers passos

Aquest és un dels punts que auditem primer quan assumim un expedient. Si no està net aquí, qualsevol hipòtesi posterior esdevé negociable davant de l'autoritat.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

## Fets bancaris i fiscals que convé precisar

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.

## Fets jurídics i de procediment

El que segueix és la visió operativa, no la dels manuals. Hem executat aquesta jugada prou vegades per saber quines variables cedeixen primer sota l'escrutini d'una autoritat fiscal o d'una compliance bancària, i és en aquest ordre que les abordem.

<!-- exentax:execution-v2 -->
## Com construir un historial de separació que aguanti una revisió

La separació de fons no és un luxe comptable: és la línia que separa "LLC operativa" d'una LLC reinterpretada com el teu compte personal per un inspector o pel banc. Sense historial documentat, la doctrina del piercing the corporate veil es torna viable i la protecció cau.

- **Origen únic de les entrades.** Cada entrada a Mercury, Relay o Wise Business ha de tenir factura, contracte o memo associat. Les transferències internes LLC-a-LLC s'etiqueten amb concepte explícit ("loan repayment", "intercompany services"). Una transferència sense traçabilitat equival a distribució no documentada i obre el camí a la requalificació.
- **Sortides amb raó fiscal.** Pagaments a proveïdors amb factura adjunta a l'ERP; salaris o member draws amb assentament comptable i, si escau, retenció prevista; reemborsament de despeses del membre amb expense report previ. Sense aquesta traça, l'AEAT o l'IRS poden recategoritzar el flux com a repartiment encobert.
- **Targetes dedicades.** Una targeta personal passada pel compte LLC contamina l'exercici sencer. Mercury emet virtuals per categoria: una per a SaaS, una altra per a publicitat, una altra per a viatges. Si el membre necessita despesa personal, ho fa des del seu compte privat i es reemborsa via expense report - mai a la inversa.
- **Documentació viva, no arxiu mort.** Carpeta compartida amb Operating Agreement signat, actes anuals, expense reports, contractes de serveis intra-grup. És el primer que demana un banc en KYC reforçat i el primer que sol·licita una inspecció.

### Què ens pregunten més

**És vàlid pagar-me a mi mateix des de la LLC?** Sí, via member draw documentat en acta i reflectit en la comptabilitat. El que no és vàlid és retirar sense acta ni periodicitat, o pagar despeses personals directament des del compte LLC.

**I si ja porto dos anys barrejant-ho tot?** Es pot reconstruir cap enrere: extractes, recategorització, actes correctives i expense reports retroactius. No és elegant, però defensable. Millor començar ara que continuar agreujant-ho.

A Exentax deixem aquesta estructura documental muntada des del dia u i revisem cada tancament perquè l'historial continuï essent defensable.
<!-- /exentax:execution-v2 -->

## Referències: normativa per a la gestió operativa

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.

### Abans de començar: el principi fundacional

Nota de camp de qui ho fa córrer mes rere mes amb clients: la regla és simple, és en l'execució que peta. Planifica l'operatiu abans del jurídic.

### Pas 1. Acotar el període de barreja

Apunt concret dels nostres expedients: així passa de debò, no com ho descriu una pàgina comercial. Els números i el calendari pesen - fallar en un fa desmuntar la resta.

### Pas 2. Recopilar extractes complets

Nota de camp de qui ho fa córrer mes rere mes amb clients: la regla és simple, és en l'execució que peta. Planifica l'operatiu abans del jurídic.

  ### Documentació de la separació de fons: estàndard espanyol i andorrà per LLC

  La documentació de la separació entre els fons personals del soci i els fons de la LLC americana s'avalua en dues fronts: la **doctrina americana del piercing the corporate veil** (cas *Kinney Shoe Corp. v. Polan*, 939 F.2d 209, 4th Cir. 1991) i el règim espanyol de **transparència fiscal internacional** previst a l'**art. 100 LIRPF**.

  **Obligacions a Espanya/Catalunya:** el soci resident que rebi rendiments de la LLC ha de declarar-los al **Modelo 100** dins de la base general (rendiments del treball/activitats econòmiques) o de la base de l'estalvi (dividends), segons la qualificació jurídica de la LLC. La **DGT V0290-20** confirma el tractament transparent de les LLCs unipersonals des del punt de vista espanyol. Els justificants han de conservar-se durant **4 anys** segons l'**art. 66 LGT (Llei 58/2003)**, i els llibres comptables durant **6 anys** segons l'**art. 30 del Codi de Comerç**.

  **Sancions per confusió patrimonial:** la falta de documentació permet a l'AEAT aplicar el **conflicte en l'aplicació de la norma (art. 15 LGT)** o la **simulació (art. 16 LGT)**, amb sancions del 50-150 % de la quota defraudada nos termes dels **arts. 191-194 LGT**. En casos greus, s'aplica el **delicte fiscal de l'art. 305 CP** amb pena de presó d'1 a 5 anys per quotes superiors a €120.000.

  **Andorra:** per a residents fiscals andorrans, la **Llei 95/2010 de l'Impost sobre Societats** preveu obligacions de documentació anàlogues. Els llibres comptables han de conservar-se durant **6 anys** segons l'**art. 32 del Codi de Comerç andorrà**. La **Llei 14/2017 de prevenció del blanqueament** imposa CDD reforçada per a transferències superiors a **€15.000**, amb obligació de documentar la font de fons (Source-of-Funds) per a operacions amb estructures internacionals.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Si%20la%20teva%20LLC%20opera%20des%20de%20fa%20un%20temps%20i%20la%20separaci%C3%B3%20entre%20els%20teus%20diners%20%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

`;
