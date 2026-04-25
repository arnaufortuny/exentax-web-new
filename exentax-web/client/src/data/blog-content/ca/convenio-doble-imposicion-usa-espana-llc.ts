export default `Quan algú veu per primera vegada la combinació "LLC als Estats Units" i "resident fiscal a Espanya", la pregunta immediata és sempre la mateixa: **"i llavors on pago impostos?"**. La resposta és clara: **a Espanya**, sobre el benefici net, gràcies al **conveni de doble imposició entre els EUA i Espanya**. La LLC no s'utilitza per "no pagar", s'utilitza per **no pagar dues vegades** i per optimitzar dins el que és legal.

Aquesta guia explica el conveni pas a pas, en llenguatge clar, aplicat al cas concret d'una LLC de no resident amb propietari resident a Espanya. Amb articles, tipus, exemples numèrics, formularis i referències a l'AEAT.

## Què és i per què existeix

Un **conveni de doble imposició** (CDI) és un acord bilateral entre dos països per repartir-se el dret a gravar les rendes que creuen fronteres i evitar que la mateixa renda es gravi dues vegades, en origen i destinació. Sense conveni, el natural seria pagar impostos als EUA (perquè la LLC hi és) **i** un altre cop a Espanya (perquè hi resideixes). Això ofegaria qualsevol negoci internacional.

Per evitar-ho, els EUA i Espanya van signar el **1990** un Conveni per evitar la doble imposició i prevenir l'evasió fiscal en matèria d'impostos sobre la renda, modernitzat per un **Protocol signat el 2013** que va entrar en vigor el **27 de novembre de 2019** (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de 23 d'octubre de 2019). Aquest protocol va actualitzar tipus de retenció, intercanvi d'informació i clàusules antiabús.

Articles clau per entendre una LLC amb propietari espanyol:

- **Art. 4, Residència fiscal:** defineix on es considera resident cada persona o entitat.
- **Art. 5, Establiment permanent:** clau per saber si els EUA et poden gravar com a negoci operant al seu territori.
- **Art. 7, Beneficis empresarials:** la regla bàsica per a serveis.
- **Art. 10, Dividends:** retencions reduïdes.
- **Art. 11, Interessos:** generalment exempts.
- **Art. 12, Cànons (royalties):** tipus reduïts.
- **Art. 17, Limitació de beneficis:** evita que qualsevol vehicle es beneficiï del conveni sense substància.
- **Art. 24, Mètodes per eliminar la doble imposició.**
## Com funciona per a LLCs disregarded entity

Una **Single-Member LLC** propietat d'un no resident es tracta per defecte com a **Disregarded Entity**: per a l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> no existeix com a contribuent independent. Els seus ingressos i despeses s'imputen directament al seu únic membre. Això és el **pass-through taxation**.

A efectes del conveni:

- La LLC **no és resident fiscal als EUA** perquè no hi tributa com a entitat.
- Qui s'analitza és **el membre**: si resideix fiscalment a Espanya, el conveni s'aplica al membre resident espanyol.
- Per tant, els beneficis nets de la LLC tributen a **Espanya** segons l'IRPF del membre.
- Als EUA la LLC només compleix obligacions informatives (Form 5472 + 1120 pro forma, BOI Report) si no té **ECI**.

La **<a href="https://petete.tributos.hacienda.gob.es" target="_blank" rel="noopener">DGT</a>** ha confirmat aquest plantejament en consultes vinculants com la **V0290-20** i posteriors, qualificant la LLC nord-americana com a entitat transparent o en règim d'atribució de rendes a efectes espanyols.
### On es paguen realment els impostos

La resposta curta i honesta per al cas típic d'una LLC de serveis sense establiment permanent als EUA i propietari resident a Espanya:

- **Als EUA: 0% federal, 0% estatal** (a NM/WY/DE per a LLCs sense activitat local). Només costos de manteniment.
- **A Espanya: IRPF sobre el benefici net** de la LLC, integrat a la teva declaració de la renda com a rendiments d'activitat econòmica en règim d'atribució, segons el teu marginal personal (19% al 47%).

És a dir, **pagues a Espanya, però pagues millor**: sobre el benefici net després de deduccions àmplies, sense quota mensual d'autònoms, sense pagaments a compte trimestrals propis de l'autònom i amb un stack professional molt més eficient.
### Tipus d'ingressos coberts pel conveni

| Tipus d'ingrés | Sense conveni (USA) | Amb conveni USA-Espanya |
|----------------|---------------------|--------------------------|
| Serveis prestats des de fora d'USA | 30% retenció | 0% (Art. 7, sense EP) |
| Royalties (programari estàndard, copyright cultural) | 30% | 0-10% segons tipus (Art. 12) |
| Dividends d'empreses USA | 30% | 15% general / 10% en participacions qualificades (Art. 10) |
| Interessos bancaris o de bons | 30% | 0% en general (Art. 11) |
| Guanys de capital sobre accions USA | 30% / variable | Tributació principal a Espanya (Art. 13) |
| Pensions | 30% | Regles específiques (Art. 20) |

Per a una LLC operativa de serveis digitals: **0% retenció USA sobre serveis** i **tributació a Espanya com a rendiment d'activitat econòmica**.
### Certificat de residència fiscal espanyola

Per activar el conveni davant del pagador nord-americà, has de demostrar que ets **resident fiscal a Espanya**. L'AEAT emet un **certificat de residència fiscal a efectes del conveni** que es demana per seu electrònica. Té validesa d'**un any** i convé tenir-lo sempre actualitzat, sobretot si treballes amb brokers o pagadors que apliquen retencions complexes.

En la majoria de cobraments via Stripe, PayPal, AdSense o similars no te'l demanaran activament perquè el W-8BEN-E ja fa la feina. Però davant d'una inspecció o un broker com Interactive Brokers, el certificat és la prova dura de la teva residència.
### Formularis necessaris

- **W-8BEN-E:** el presenta la teva LLC davant cada pagador USA. Vegeu la nostra <a href="/ca/blog/w8-ben-i-w8-ben-e-la-guia-completa">guia completa de W-8BEN i W-8BEN-E</a>.
- **W-8BEN:** per a persones físiques no residents que cobren al seu nom.
- **Form 1042-S:** l'emet el pagador USA si t'ha aplicat alguna retenció. Necessari per reclamar la devolució o per acreditar-ho a Espanya com a impost satisfet a l'estranger.
- **Form 5472 + Form 1120 pro forma:** declaració informativa anual de la LLC davant l'IRS.
- **BOI Report:** davant <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>.
- **Modelo 100 (IRPF):** la teva declaració anual a Espanya.
- **Modelo 720/721:** si superes 50.000 € en comptes, valors o criptos a l'estranger.
- **Certificat de residència fiscal.**
## Casos pràctics amb xifres

### Cas A, Consultor de programari amb clients USA i UE

- LLC factura **120.000 USD/any** per serveis prestats des d'Espanya.
- Despeses LLC: 30.000 USD.
- Benefici net: 90.000 USD ≈ 82.000 €.
- USA: **0%** retenció. Cost manteniment ≈ 2.000 €.
- Espanya: IRPF efectiu aprox. 35-40% sobre 82.000 €. Quota IRPF ≈ 25.000-28.000 €.
- **Total tributari:** 27.000-30.000 €. Davant 38.000-45.000 € que pagaria un autònom equivalent amb quota inclosa.

### Cas B, Trader o inversor amb dividends USA via LLC

- LLC titular d'un compte a Interactive Brokers.
- Dividends americans: 10.000 USD/any.
- Sense conveni: retenció del 30% → 3.000 USD a l'IRS.
- Amb W-8BEN-E + conveni: retenció del 15% → 1.500 USD a l'IRS.
- A Espanya: inclous els dividends a la base de l'estalvi i apliques la **deducció per doble imposició internacional** de l'Art. 80 LIRPF pels 1.500 USD pagats a USA, dins del límit espanyol.

### Cas C, Royalty per programari venut als EUA

- LLC ven llicències de programari a empreses USA: 50.000 USD/any.
- Si es qualifica com a royalty (Art. 12), retenció pot ser **5%**.
- Si es qualifica com a serveis o venda de còpia, Art. 7 → **0%**.
- La qualificació correcta depèn del contracte.
### Retencions en origen i com recuperar-les

Si pateixes retencions als EUA, dues vies:

1. **Reclamació directa al pagador:** si va ser un error i estàs dins l'any fiscal.
2. **Sol·licitud de devolució a l'IRS:** via **Form 1040-NR** o procediments associats al **1042-S**. És lent (12-18 mesos) i requereix ITIN o EIN.

A Espanya, les retencions efectivament pagades als EUA dins del límit del conveni es compensen mitjançant la **deducció per doble imposició internacional (DDII)** a l'IRPF.
### Declaració a Espanya: Modelo 100

A la teva **declaració de la renda anual (Modelo 100)** integres els beneficis nets de la LLC com a **rendiments d'activitat econòmica** en règim d'atribució de rendes. Passos típics:

1. Convertir USD a EUR amb tipus de canvi mitjà anual o del moment del cobrament, criteri consistent.
2. Calcular ingressos totals i despeses deduïbles.
3. Imputar el benefici net a la casella corresponent.
4. Aplicar la **deducció per doble imposició internacional**.
5. Presentar **modelo 720/721** si supera els llindars.
6. Conservar tota la documentació.
### Per què necessites un assessor fiscal espanyol

Una LLC ben constituïda als EUA és només la meitat de la feina. L'altra meitat és **integrar-la correctament al teu IRPF espanyol**:

- Qualificar correctament la renda.
- Aplicar el conveni i la deducció per doble imposició.
- Decidir el mètode d'imputació.
- Complir amb modelos 720/721 si escau.
- Documentar despeses deduïbles.

Un assessor fiscal espanyol que entengui estructures internacionals amb LLCs és **part del setup complet**. A Exentax cobrim la part USA i coordinem amb el teu assessor fiscal espanyol, o te'n recomanem un.

> Cada cas és individual. Les posicions de la DGT poden evolucionar i els protocols del conveni s'actualitzen periòdicament. Aquesta guia és informativa, no substitueix l'anàlisi personalitzada per un professional.
### En resum

- Els EUA i Espanya tenen un conveni signat el 1990 i modernitzat el 2019.
- Per a una LLC disregarded entity amb propietari resident espanyol, els beneficis empresarials tributen **a Espanya**, sense retenció a USA si no hi ha establiment permanent.
- Dividends, interessos i royalties tenen tipus reduïts.
- El **W-8BEN-E** és l'eina operativa.
- Les retencions a USA es compensen via deducció per doble imposició.
- Cal tenir el **certificat de residència fiscal** disponible i declarar correctament al **Modelo 100**.
- Setup complet: **Exentax + assessor fiscal espanyol**.

Si vols revisar el teu cas amb xifres concretes, **reserva una consultoria gratuïta de 30 minuts** amb Exentax.

Per aprofundir, llegeix també <a href="/ca/blog/llc-com-a-alternativa-a-ser-autonom-a-espanya">LLC com a alternativa a ser autònom a Espanya</a> i <a href="/ca/blog/w8-ben-i-w8-ben-e-la-guia-completa">Guia completa dels formularis W8-BEN i W8-BEN-E</a>.
## Compliance fiscal al teu país: CFC, TFI i atribució de rendes

Una LLC americana és una eina legal i reconeguda internacionalment. Però el compliment no acaba en constituir-la: com a propietari resident fiscal en un altre país, l'administració tributària local manté el dret a gravar el que la LLC genera. L'important és saber **sota quin règim**.

### Per jurisdicció

- **Espanya (LIRPF/LIS).** Si la LLC és una *Single-Member Disregarded Entity* operativa (serveis reals, sense passivitat significativa), Hisenda la tracta normalment per **atribució de rendes (art. 87 LIRPF)**: els beneficis nets s'imputen al soci l'exercici en què es generen, integrant-se a la base general de l'IRPF. Si la LLC opta per tributar com a *corporation* (Form 8832) i queda controlada per resident espanyol amb rendes majoritàriament passives, pot activar-se la **transparència fiscal internacional (art. 91 LIRPF per a persones físiques, art. 100 LIS per a societats)**. La diferència no és opcional: depèn de la substància econòmica, no del nom.
- **Models informatius.** Comptes als EUA amb saldo mitjà o final >50.000 € a l'exercici: **Model 720** (Llei 5/2022 després de la STJUE C-788/19, 27/01/2022, sancions ara dins del règim general LGT). Operacions vinculades amb la LLC i dividends repatriats: **Model 232**. Criptoactius custodiats als EUA: **Model 721**.
- **CDI Espanya–EUA.** El conveni (BOE 22/12/1990, Protocol en vigor 27/11/2019) ordena la doble imposició sobre dividends, interessos i royalties. Una LLC sense establiment permanent a Espanya no constitueix per si sola EP del soci, però la direcció efectiva sí pot crear-lo si tota la gestió es fa des de territori espanyol.
- **Mèxic, Colòmbia, Argentina i altres LATAM.** Cada jurisdicció té el seu propi règim CFC (Mèxic: Refipres; Argentina: rendes passives de l'exterior; Xile: art. 41 G LIR). El principi comú: el que la LLC reté com a benefici es considera percebut pel soci si l'entitat es considera transparent o controlada.
La regla pràctica: una LLC operativa, amb substància, declarada correctament en residència, és **planificació fiscal legítima**. Una LLC que s'utilitza per ocultar ingressos, simular no-residència o desplaçar rendes passives sense justificació econòmica entra al terreny de l'**art. 15 LGT (conflicte en aplicació de la norma)** o, en el pitjor cas, de l'**art. 16 LGT (simulació)**. La diferència la marquen els fets, no el paper.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

A Exentax muntem l'estructura perquè encaixi al primer escenari i documentem cada pas perquè la teva declaració local sigui defensable davant d'una eventual revisió.

<!-- exentax:legal-facts-v1 -->
## Fets legals i de procediment

Les obligacions davant la FinCEN i l'IRS s'han mogut en recent years; aquest és l'estat vigent:

### Punts clau

- **BOI / Corporate Transparency Act.** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a "foreign reporting companies"** (entitats constituïdes fora dels EUA i registrades per operar en un estat). Una **LLC formada als EUA per un no resident està, avui, fora d'aquesta obligació**. L'estat normatiu pot tornar a canviar: **cal re-verificar a FinCEN.gov en el moment de la presentació**. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament i monitoritza actualitzacions.
- **Form 5472 + 1120 pro-forma.** Per a una **Single-Member LLC propietat d'un no resident**, les regulacions finals Treas. Reg. §1.6038A-1 (vigents des de 2017) tracten la LLC com a corporation a efectes del 5472. Procediment: **Form 1120 pro-forma** (només capçalera: nom, adreça, EIN, exercici) amb **Form 5472 annexat**. Enviament **per correu certificat o fax a l'IRS Service Center d'Ogden, Utah**, **no via MeF/e-file** estàndard. Venciment: **15 d'abril**; pròrroga via **Form 7004** fins al **15 d'octubre**. **Sanció: 25.000 USD per formulari i any, més 25.000 USD per cada 30 dies addicionals** de no presentació després de notificació de l'IRS.
- **Form 1120 substantiu.** Només aplica si la LLC ha fet check-the-box election a C-Corp (Form 8832): tributa al 21 % federal i presenta un 1120 amb xifres reals. La LLC disregarded estàndard **no presenta un 1120 substantiu i no paga corporate tax federal**.
- **EIN i notificacions.** Sense EIN no es pot presentar el 5472 ni el BOI. L'IRS no avisa abans de sancionar; es descobreix quan l'EIN queda bloquejat o una presentació posterior és rebutjada.
## En resum

La nostra posició aquí és deliberadament conservadora: optimitzem allò que sobreviu a una inspecció, no la xifra més agressiva. Els punts següents són els que estem disposats a defensar per escrit.

## Fets bancaris i fiscals que convé precisar

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.

## Fets jurídics i de procediment

El que segueix és la visió operativa, no la dels manuals. Hem executat aquesta jugada prou vegades per saber quines variables cedeixen primer sota l'escrutini d'una autoritat fiscal o d'una compliance bancària, i és en aquest ordre que les abordem.

## Referències: marc legal i normativa

Tractem aquest bloc com una de les decisions que sostenen l'estratègia LLC: errar aquí i la resta de l'estructura perd fiscalitat, accés bancari o compliance. Les notes que segueixen reflecteixen el que fem realment amb clients en aquest cas concret, prioritzant les variables que mouen el resultat.

## Parlem de la teva estructura

La nostra posició aquí és deliberadament conservadora: optimitzem allò que sobreviu a una inspecció, no la xifra més agressiva. Els punts següents són els que estem disposats a defensar per escrit.
## Formularis necessaris

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.

<!-- exentax:execution-v2 -->
## Com s'aplica el conveni EUA-Espanya a la teva LLC, clàusula a clàusula

El conveni entre Espanya i Estats Units signat el 1990 i modificat pel Protocol en vigor des de 2019 (BOE 23 d'octubre de 2019) reparteix la potestat tributària entre els dos països. Per a una SMLLC en atribució de rendes, el que importa són quatre articles concrets. Te'ls expliquem per ordre d'impacte.

- **Article 7 - Beneficis empresarials.** Si la LLC és transparent i no constitueix establiment permanent als EUA, els beneficis tributen exclusivament a Espanya, al teu IRPF com a rendiment d'activitat econòmica. Aquesta és la lògica que fa que una SMLLC pagui típicament zero impost federal i tot el pes recaigui a la residència.
- **Article 14 (Protocol 2019) - Serveis personals independents.** Reforçat després del Protocol: per a professionals independents residents a Espanya sense base fixa als EUA, els honoraris es graven exclusivament a Espanya. Combinat amb l'art. 7 blinda l'operativa habitual de consultor o desenvolupador.
- **Article 23 - Eliminació de la doble imposició.** Permet acreditar a Espanya l'impost pagat als EUA (federal i estatal), amb el límit de la quota espanyola sobre la mateixa renda. Per a una SMLLC amb zero impost federal, el crèdit és nul però també ho és la doble imposició real.
- **Article 25 (Protocol 2019) - Procediment amistós (MAP).** Si AEAT i IRS qualifiquen de manera divergent la mateixa renda, el MAP permet resoldre via acord entre administracions en aproximadament 24 mesos. Útil davant un requeriment divergent; la majoria de casos no hi arriben perquè la doctrina DGT és clara.

### El que més ens pregunten

**Necessito Form W-8BEN-E per a la meva LLC?** Sí, quan un client americà et demana certificació de no residència. La SMLLC amb soci no resident certifica com a pass-through i el soci adjunta W-8BEN personal. Sense aquesta documentació, els pagadors americans retenen 30 % per defecte.

**El conveni cobreix dividends i plusvàlues?** Sí, però amb tipus màxims diferents (15 % dividends, 0-21 % interessos segons supòsit, plusvàlues generalment només en residència). Per a una SMLLC que distribueix al soci, el "dividend" s'ignora per transparència i tot s'imputa com a benefici empresarial art. 7.

A Exentax mapegem cada flux de la teva LLC contra l'article aplicable del conveni, deixem la documentació W-8 preparada i dissenyem la imputació a IRPF perquè la declaració espanyola sigui coherent amb el tractament federal.
<!-- /exentax:execution-v2 -->

## Declaració a Espanya: Model 100

La nostra posició aquí és deliberadament conservadora: optimitzem allò que sobreviu a una inspecció, no la xifra més agressiva. Els punts següents són els que estem disposats a defensar per escrit.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Truca'ns al <a href="tel:+34614916910">+34 614 916 910</a> o escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Quan%20alg%C3%BA%20veu%20per%20primera%20vegada%20la%20combinaci%C3%B3%20LLC%20als%20Estats%20Units%20i%20residen%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisió editorial pendent</strong> — Les referències següents requereixen verificació manual contra la font oficial vigent. Si detectes una desviació, escriu-nos i ho corregim en menys de 24 hores.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">0%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…ente en EE.UU. y dueño residente en España: - **En EE.UU.: 0% federal, 0% estatal** (en NM…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">19%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…ómica en régimen de atribución, según tu marginal personal (19% al 47%). Es decir, **pagas…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">47%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…n régimen de atribución, según tu marginal personal (19% al 47%). Es decir, **pagas en Esp…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">30%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…---------------| | Servicios prestados desde fuera de USA | 30% retención | 0% (Art. 7, si…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">10%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…Royalties (software estándar, copyright cultural) | 30% | 0-10% según tipo (Art. 12) | | D…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">15%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…según tipo (Art. 12) | | Dividendos de empresas USA | 30% | 15% general / 10% en participa…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…egado de cuentas, valores o criptos en el extranjero supera 50.000 €. - **Certificado de r…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">120.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…onsultor de software con clientes USA y EU - LLC factura **120.000 USD/año** por servicios…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">30.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…D/año** por servicios prestados desde España. - Gastos LLC: 30.000 USD (software, hardware…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">90.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…are, viajes, registered agent, asesoría). - Beneficio neto: 90.000 USD ≈ 82.000 €. - USA: …»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">82.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…registered agent, asesoría). - Beneficio neto: 90.000 USD ≈ 82.000 €. - USA: **0%** retenc…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">2.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…tención (W-8BEN-E activo, sin EP). Coste de mantenimiento ≈ 2.000 €. - España: IRPF margin…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">40%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…mantenimiento ≈ 2.000 €. - España: IRPF marginal aprox. 35-40% efectivo sobre 82.000 €. Cu…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…arginal aprox. 35-40% efectivo sobre 82.000 €. Cuota IRPF ≈ 25.000-28.000 €. - **Total tri…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">28.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…aprox. 35-40% efectivo sobre 82.000 €. Cuota IRPF ≈ 25.000-28.000 €. - **Total tributario:…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">27.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…00 €. Cuota IRPF ≈ 25.000-28.000 €. - **Total tributario:** 27.000-30.000 €. Frente a 38.0…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">38.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…28.000 €. - **Total tributario:** 27.000-30.000 €. Frente a 38.000-45.000 € que pagaría co…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">45.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…€. - **Total tributario:** 27.000-30.000 €. Frente a 38.000-45.000 € que pagaría como autó…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">10.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…a en Interactive Brokers. - Dividendos americanos cobrados: 10.000 USD/año. - Sin convenio…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">3.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…brados: 10.000 USD/año. - Sin convenio: retención del 30% → 3.000 USD al IRS. - Con W-8BEN…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.500</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…S. - Con W-8BEN-E + convenio: retención del 15% (Art. 10) → 1.500 USD al IRS. - En España:…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">5%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…e califica como royalty (Art. 12), la retención puede ser **5%** según subtipo y subbloque…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…un no residente**, las regulaciones finales de Treas. Reg. §1.6038A-1 (vigentes desde 2017…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…r&quot;&gt;OCDE&lt;/a&gt; con sus Comentarios. - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación chec…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">30 %</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…. Sin esta documentación, los pagadores americanos retienen 30 % por defecto. **¿El conven…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">15 %</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…ndos y plusvalías?** Sí, pero con tipos máximos diferentes (15 % dividendos, 0-21 % intere…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…U.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa F…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…. - En EE.UU. la LLC solo cumple obligaciones informativas (Form 5472 + 1120 pro forma, BO…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1042</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…sidentes que cobren a su nombre, no a nombre de la LLC. - **Form 1042-S:** lo emite el pag…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…como impuesto satisfecho en el extranjero. - **Form 5472 + Form 1120 pro forma:** declarac…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1040</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…encia. 2. **Solicitud de devolución al IRS:** mediante el **Form 1040-NR** (persona física…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…13 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Conve…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…esde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Convenio &lt;a …»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
