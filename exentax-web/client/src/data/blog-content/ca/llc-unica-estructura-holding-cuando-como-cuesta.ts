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

<!-- exentax:calc-cta-v1 -->
> **Posa xifres al teu cas.** La <a href="/ca#calculadora">calculadora fiscal Exentax</a> compara la teva càrrega fiscal actual amb el que pagaries operant una LLC nord-americana correctament declarada al teu país de residència.
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
- **Revolut Business**: quan s'associa a una **LLC nord-americana**, l'esquema habitual passa per Revolut Payments USA; els IBAN europeus (lituans, BE) **no s'emeten per defecte** a una LLC, s'emeten a clients europeus del banc europeu del grup. Si t'ofereixen un IBAN europeu, confirma a quina entitat jurídica està associat i sota quin règim reporta.
- **Tributació zero**: cap estructura LLC aconsegueix "zero impostos" si vius en un país amb regles CFC/transparència fiscal o atribució de rendes. El que s'aconsegueix és **no duplicar tributació** i **declarar correctament a residència**, no eliminar-la.

<!-- exentax:legal-facts-v1 -->
## Fets legals i de procediment

Les obligacions davant la <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a> i l'IRS s'han mogut en recent years; aquest és l'estat vigent:
### Punts clau

- **BOI / Corporate Transparency Act.** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a "foreign reporting companies"** (entitats constituïdes fora dels EUA i registrades per operar en un estat). Una **LLC formada als EUA per un no resident està, avui, fora d'aquesta obligació**. L'estat normatiu pot tornar a canviar: **cal re-verificar a FinCEN.gov en el moment de la presentació**. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament i monitoritza actualitzacions.
- **Form 5472 + 1120 pro-forma.** Per a una **Single-Member LLC propietat d'un no resident**, les regulacions finals Treas. Reg. §1.6038A-1 (vigents des de 2017) tracten la LLC com a corporation a efectes del 5472. Procediment: **Form 1120 pro-forma** (només capçalera: nom, adreça, EIN, exercici) amb **Form 5472 annexat**. Enviament **per correu certificat o fax a l'IRS Service Center d'Ogden, Utah**, **no via MeF/e-file** estàndard. Venciment: **15 d'abril**; pròrroga via **Form 7004** fins al **15 d'octubre**. **Sanció: 25.000 USD per formulari i any, més 25.000 USD per cada 30 dies addicionals** de no presentació després de notificació de l'IRS.
- **Form 1120 substantiu.** Només aplica si la LLC ha fet check-the-box election a C-Corp (Form 8832): tributa al 21 % federal i presenta un 1120 amb xifres reals. La LLC disregarded estàndard **no presenta un 1120 substantiu i no paga corporate tax federal**.
- **EIN i notificacions.** Sense EIN no es pot presentar el 5472 ni el BOI. L'IRS no avisa abans de sancionar; es descobreix quan l'EIN queda bloquejat o una presentació posterior és rebutjada.
## Fets bancaris i fiscals que convé precisar

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.

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

### Lectures relacionades addicionals

Apunt concret dels nostres expedients: així passa de debò, no com ho descriu una pàgina comercial. Els números i el calendari pesen - fallar en un fa desmuntar la resta.
### 1. Volum i barreja de línies de negoci

Nota de camp de qui ho fa córrer mes rere mes amb clients: la regla és simple, és en l'execució que peta. Planifica l'operatiu abans del jurídic.

### 2. Risc asimètric entre línies

### 3. Planificació patrimonial i herència

Apunt concret dels nostres expedients: així passa de debò, no com ho descriu una pàgina comercial. Els números i el calendari pesen - fallar en un fa desmuntar la resta.

### 4. Actius intangibles amb valor (marca, IP, programari)

Nota de camp de qui ho fa córrer mes rere mes amb clients: la regla és simple, és en l'execució que peta. Planifica l'operatiu abans del jurídic.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Truca'ns al <a href="tel:+34614916910">+34 614 916 910</a> o escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Quan%20una%20LLC%20funciona%2C%20la%20pregunta%20canvia%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si el teu pla és muntar la LLC a Wyoming, repassa la nostra pàgina de servei <a href="/ca/serveis/llc-wyoming">LLC a Wyoming</a> amb costos, terminis i propers passos concrets.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Constitució des de 2.000 € i manteniment des de 1.500 €/any. La consulta inicial és gratuïta. <a href="/ca/serveis/llc-wyoming">Demanar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisió editorial pendent</strong> — Les referències següents requereixen verificació manual contra la font oficial vigent. Si detectes una desviació, escriu-nos i ho corregim en menys de 24 hores.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">1.800</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…v&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;IRS&lt;/a&gt; (5472+1120 × 4) | 1.800-3.200 | | BOI updates si…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">3.200</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…get=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;IRS&lt;/a&gt; (5472+1120 × 4) | 1.800-3.200 | | BOI updates si hay c…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.500</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…tis) | | Honorarios estructurales (proveedor profesional) | 1.500-3.500 | | **Total estima…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.fincen.gov/boi" rel="nofollow noopener" target="_blank">www.fincen.gov</a>]</strong></li>
<li><span class="font-mono">3.500</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…| Honorarios estructurales (proveedor profesional) | 1.500-3.500 | | **Total estimado** | …»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.fincen.gov/boi" rel="nofollow noopener" target="_blank">www.fincen.gov</a>]</strong></li>
<li><span class="font-mono">4.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…eedor profesional) | 1.500-3.500 | | **Total estimado** | **4.000-7.500 USD/año** | A esto…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">7.500</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…profesional) | 1.500-3.500 | | **Total estimado** | **4.000-7.500 USD/año** | A esto hay q…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…os.** Cuentas bancarias en EE. UU. con saldo medio o final &gt;50.000 € en el ejercicio: **Mo…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…un no residente**, las regulaciones finales de Treas. Reg. §1.6038A-1 (vigentes desde 2017…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…ga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y añ…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">10 %</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…*Andorra.** Llei 95/2010 de l'Impost sobre Societats (IS al 10 %), Llei 5/2014 del IRPF y …»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">22 %</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…ma de impuesto diferido sobre beneficios distribuidos al 20/22 %) y documentación oficial …»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">2.500</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…, sin plan de venta parcial del negocio. Coste anual: 1.500-2.500 USD (registered agent + …»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">80%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…contabilidad básica + 1120/5472). Es la opción óptima para 80% de casos en los primeros 1-…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">100%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…- **Cómo se construye técnicamente.** La holding LLC posee 100% del membership interest de…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…t (Title 17, Chapter 29), instrucciones IRS del Form 5472 e IRC §7701 (clasificación de en…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…nservar el acuse y monitorizar futuras actualizaciones. - **Form 5472 + 1120 pro-forma.** …»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…C como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo ca…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->

`;
