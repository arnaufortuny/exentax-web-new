export default `Des de Catalunya, estem acostumats al SEPA en 1 dia hàbil o al Bizum en segons. Als EUA, el sistema va a un altre ritme: ACH triga 1-3 dies, Wire surt el mateix dia però costa 15-35 $, i RTP/FedNow amb prou feines arriben a les fintechs. Entendre aquests temps evita endarrerir pagaments a proveïdors per pur desconeixement.

Posem tots els temps sobre la taula perquè no hi hagi sorpreses.

## ACH (Automated Clearing House)

ACH és el sistema de transferències domèstiques dels EUA. És el mètode més comú i el més barat (generalment gratis).

### Temps d'ACH

| Tipus | Temps |
|---|---|
| ACH Standard | **1-3 dies hàbils** |
| ACH Same-Day | **Mateix dia** (si s'inicia abans de les 2:45pm ET) |
| ACH Next-Day | **Següent dia hàbil** |

**Important:** Els dies hàbils són de dilluns a divendres (sense festius federals dels EUA). Si envies un ACH el divendres a la tarda, no arribarà fins al dilluns o dimarts.

### Factors que afecten el temps

- **Hora d'enviament**: si l'envies després de l'horari de tall (cut-off time), es processa al següent dia hàbil
- **Banc receptor**: alguns bancs retenen els fons ACH 1-2 dies addicionals per verificació
- **Primera transferència**: la primera vegada que envies diners a un nou compte pot trigar més per verificació de seguretat
### Wire Transfer domèstic

Els wires domèstics (dins dels EUA) són més ràpids que ACH, però tenen cost.

### Temps de Wire domèstic

| Tipus | Temps |
|---|---|
| Wire domèstic standard | **Mateix dia** (2-6 hores) |
| Wire domèstic urgent | **1-2 hores** |

Els wires domèstics solen arribar en **hores**, no en dies. Per això es fan servir per a pagaments urgents o imports grans.
## Wire Transfer internacional (SWIFT)

Els wires internacionals utilitzen la xarxa SWIFT i passen per bancs intermediaris, la qual cosa els fa més lents.

### Temps de Wire internacional

| Ruta | Temps |
|---|---|
| EUA → Europa | **1-3 dies hàbils** |
| EUA → Llatinoamèrica | **2-5 dies hàbils** |
| EUA → Àsia | **2-4 dies hàbils** |

### Per què triguen més?

- **Bancs intermediaris**: els diners poden passar per 1-3 bancs intermediaris abans d'arribar a la destinació
- **Zones horàries**: si el banc receptor ja ha tancat, la transferència es processa al següent dia hàbil
- **Compliance checks**: les transferències internacionals passen per controls antifrau i antiblanqueig
### Wise Business

Wise no utilitza la xarxa SWIFT per a la majoria de transferències. Utilitza comptes locals a cada país, la qual cosa redueix temps i costos.

### Temps a Wise

| Ruta | Temps |
|---|---|
| USD → EUR (SEPA) | **1-2 dies hàbils** |
| USD → GBP | **1 dia hàbil** |
| USD → MXN | **1-2 dies hàbils** |
| USD → COP | **1-3 dies hàbils** |
### Comparativa general

| Mètode | Temps | Cost (Mercury) | Millor per a |
|---|---|---|---|
| ACH | 1-3 dies | Gratis | Pagaments domèstics no urgents |
| Wire domèstic | Mateix dia | **$0 a Mercury** | Pagaments urgents dins dels EUA |
| Wire internacional | 1-5 dies | **$0 a Mercury** | Pagaments internacionals grans |
| Wise | 1-2 dies | 0.4-1.5% | Pagaments internacionals freqüents |
| Stripe/PayPal payout | 2-3 dies | Inclòs | Cobraments a clients |
## Consells per accelerar els teus pagaments

- **Inicia les transferències aviat**: abans de les 2pm hora de l'est dels EUA. Després del cut-off, es processa al següent dia hàbil
- **Evita divendres i festius**: les transferències no es processen en caps de setmana. Un ACH iniciat el divendres arriba el dimarts com a molt aviat
- **Fes servir ACH Same-Day** quan necessitis velocitat sense cost de wire. està disponible a Mercury sense cost addicional
- **Consolida enviaments internacionals**: un wire gran surt més barat que diversos petits. I amb Mercury, els wires són $0 de totes maneres
- **Fes servir Wise per a pagaments recurrents**: més ràpid i barat que wires tradicionals per a imports mitjans, gràcies a la seva xarxa de comptes locals

Per tancar, lectures relacionades que encaixen al costat d'aquest article: <a href="/ca/blog/el-teu-primer-mes-amb-una-llc-americana-el-que-esperar">El teu primer mes amb una LLC americana: el que esperar setmana a setmana</a> i <a href="/ca/blog/canviar-divises-per-a-la-teva-llc-millors-opcions-i-com">Canviar divises per a la teva LLC: millors opcions i com evitar les comissions ocultes</a> ajuden a arrodonir el context.
### La dada que ho canvia tot: Mercury $0 wire fees

La majoria de bancs cobren entre $15-50 per wire transfer. Mercury no cobra res. Zero. Ni nacionals ni internacionals. Això canvia completament com planifiques els teus pagaments:

- Necessites pagar un proveïdor a Europa? Wire internacional des de Mercury: $0
- Un client americà vol pagar-te per wire? El reps gratis
- Wise et demana enviar fons per wire per a verificació? $0

Mercury fa servir partner banks (Choice Financial Group i Evolve Bank & Trust principalment; Column N.A. en comptes heretats) com a custodis, amb assegurança FDIC. No és una fintech experimental. és infraestructura financera seriosa per a la teva LLC.

A Exentax optimitzem cada setmana el routing bancari per a clients catalans. Reserva la teva assessoria gratuïta: mirem els teus fluxos recurrents i et diem què passar per ACH i què empènyer per Wire.
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

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

### Notes per proveïdor

- **Mercury** opera amb diversos bancs associats amb llicència federal i cobertura **FDIC** via sweep network: principalment **Choice Financial Group** i **Evolve Bank & Trust**, i encara **Column N.A.** en alguns comptes heretats. Mercury no és un banc; és una plataforma fintech recolzada per aquests partner banks. Si Mercury tanca un compte, el saldo es retorna normalment **mitjançant xec en paper a l'adreça registrada del titular**, fet que pot ser un problema operatiu seriós per a no residents; convé mantenir un compte secundari (Relay, Wise Business, etc.) com a contingència.
- **Wise** té dos productes clarament diferents: **Wise Personal** i **Wise Business**. Per a una LLC s'ha d'obrir **Wise Business**, no el personal. Matís important de CRS: una **Wise Business titularitat d'una LLC dels EUA queda fora del CRS** perquè la titular és una entitat dels EUA i els EUA no són jurisdicció CRS; el costat USD opera via Wise US Inc. (perímetre FATCA, no CRS). En canvi, una **Wise Personal oberta per un individu resident fiscal a Espanya** o una altra jurisdicció CRS **sí genera reporte CRS** via Wise Europe SA (Bèlgica) sobre aquest individu. Obrir Wise per a la teva LLC no t'inclou al CRS per la LLC; una Wise Personal separada al teu nom com a resident en CRS, sí.
- **Wallester** (Estònia) és una entitat financera europea amb llicència EMI/banc emissor de targetes. Els seus comptes IBAN europeus **estan dins de l'Estàndard Comú de Comunicació (CRS)** i, per tant, generen intercanvi automàtic d'informació cap a l'administració fiscal del país de residència.
- **Payoneer** opera mitjançant entitats europees (Payoneer Europe Ltd, Irlanda) també **dins de l'àmbit CRS** per a clients residents en jurisdiccions participants.
- **Revolut Business**: quan s'associa a una **LLC nord-americana**, l'esquema habitual passa per Revolut Payments USA; els IBAN europeus (lituans, BE) **no s'emeten per defecte** a una LLC, s'emeten a clients europeus del banc europeu del grup. Si t'ofereixen un IBAN europeu, confirma a quina entitat jurídica està associat i sota quin règim reporta.
- **Tributació zero**: cap estructura LLC aconsegueix "zero impostos" si vius en un país amb regles CFC/transparència fiscal o atribució de rendes. El que s'aconsegueix és **no duplicar tributació** i **declarar correctament a residència**, no eliminar-la.
## T'ho muntem sense que perdis un cap de setmana

Milers de freelancers i emprenedors ja operen amb la seva LLC americana de manera 100% legal i documentada. A Exentax ens encarreguem de tot el procés: constitució, banca, passarel·les de pagament, comptabilitat, declaracions <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> i compliance al teu país de residència. Reserva una assessoria gratuïta i et direm amb sinceritat si la LLC té sentit per al teu cas, sense promeses absolutes.<!-- exentax:execution-v2 -->
## Temps de pagament ACH i wire transfer als US: quant triga cada mètode i quan fer servir quin

Venint de SEPA i Bizum, el sistema de pagaments US sembla d'un altre segle. Convé entendre'l perquè afecta quan cobres i quant en comissions.

- **ACH (Automated Clearing House).** El SEPA americà. Cost gairebé zero (0$-1$), liquidació en 1-3 dies hàbils. Estàndard per B2B domèstic recurrent.
- **Wire transfer domèstic.** Com una transferència urgent: 5$-30$, arriba en hores (mateix dia si abans de cutoff ~14:00 ET).
- **Wire transfer internacional (SWIFT).** 15$-50$ + comissions bancs intermediaris + spread FX (~1%-3%). Arriba en 1-5 dies hàbils.
- **Stripe payouts.** ACH 2 dies hàbils (estàndard) o instantani amb 1% extra.

### Estratègia operativa típica

Revenue: clients US via ACH/Stripe → Mercury/Wise USD. Clients internacionals via Wise. Outflow: proveïdors US via ACH gratuït, internacionals via Wise, draw personal via Wise USD → IBAN EUR.

### El que més ens pregunten

**Per què Stripe triga 7 dies?** Rolling reserve: hold preventiu contra chargebacks. Comptes noves 7-14 dies, després 2.

**Wise USD és realment "compte US"?** Compte Wise Inc. amb routing ACH propi. Opera com a compte US per a ACH i wires domèstics.

A Exentax muntem el stack bancari per casos d'ús.
<!-- /exentax:execution-v2 -->

## Com treballem a Exentax

El nostre equip està especialitzat en estructures fiscals internacionals per a residents de països de parla hispana que operen negocis en línia. Combinem coneixement local d'Espanya, Andorra i l'Amèrica Llatina amb experiència operativa en la constitució d'entitats a Delaware, Wyoming, Estònia i altres jurisdiccions. Cada cas comença amb una consulta gratuïta en la qual avaluem la residència, l'activitat i els objectius, i et diem amb sinceritat si l'estructura proposada té sentit o si una alternativa més senzilla és suficient.

  ### SEPA i particularitats per a titulars de LLC residents a Espanya/Catalunya/Andorra

  Qui opera una LLC nord-americana des d'Espanya combina ACH/Wire en USD amb transferències **SEPA en EUR** al seu IBAN espanyol. La normativa europea **Reglament UE 2024/886 (Instant Payments)** obliga totes les entitats de la zona euro a acceptar SEPA Instant fins al 9 d'octubre de 2025 i a oferir-lo fins al 9 d'abril de 2026, sense recàrrec. A Andorra, l'**AFA** regula les transferències i les entitats andorranes (MoraBanc, Crèdit Andorrà, Andbank) ofereixen IBAN AD i accés a SEPA des de 2018, amb tarifes habitualment lleugerament superiors a les espanyoles per a transferències internacionals.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Des%20de%20Catalunya%2C%20estem%20acostumats%20al%20SEPA%20en%201%20dia%20h%C3%A0bil%20o%20al%20Bizum%20en%20segons%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisió editorial pendent</strong> — Les referències següents requereixen verificació manual contra la font oficial vigent. Si detectes una desviació, escriu-nos i ho corregim en menys de 24 hores.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">5%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…| Pagos internacionales grandes | | Wise | 1-2 días | 0.4-1.5% | Pagos internacionales fre…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">1%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…envío + comisión bancos intermediarios + spread de cambio (~1%-3%). Llega en 1-5 días hábi…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">3%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…ío + comisión bancos intermediarios + spread de cambio (~1%-3%). Llega en 1-5 días hábiles…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">4%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…FX), draw a personal vía Wise USD → IBAN EUR (3-5 días, ~0.4% spread). Esto minimiza coste…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">IRC §1471</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…eneficial Ownership Information Report). - **FATCA y CRS.** IRC §1471-1474 (FATCA y formul…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
