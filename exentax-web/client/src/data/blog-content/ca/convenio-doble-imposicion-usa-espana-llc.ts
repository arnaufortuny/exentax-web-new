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

- **BOI / Corporate Transparency Act: la teva LLC NO està obligada (un avantatge competitiu).** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a les "foreign reporting companies"** (entitats constituïdes FORA dels EUA i registrades per operar en un estat). Una **LLC formada als EUA propietat d'un no resident NO presenta el BOI Report**: un tràmit menys al calendari, menys burocràcia i una estructura més neta que mai. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament. L'estat normatiu pot canviar: **monitoritzem FinCEN.gov en cada presentació** i, si l'obligació torna a aplicar, la gestionem sense cost addicional. Estat vigent verificable a [fincen.gov/boi](https://www.fincen.gov/boi).
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
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Quan%20alg%C3%BA%20veu%20per%20primera%20vegada%20la%20combinaci%C3%B3%20LLC%20als%20Estats%20Units%20i%20residen%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->
`;
