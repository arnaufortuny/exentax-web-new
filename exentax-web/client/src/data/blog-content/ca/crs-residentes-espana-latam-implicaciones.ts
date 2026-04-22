export default `Aquest article es va escriure pensant en Espanya i Llatinoamèrica, però toca una ferida que afecta directament a qualsevol resident a Catalunya: un cop tens una LLC amb compte en dòlars, apareixen obligacions accessòries (Model 720, Model 721, declaració D-6) que molta gent descobreix quan arriba el primer requeriment d'Hisenda.

## Què és el CRS

Aprovat pel Consell de l'<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> el juliol de 2014. Més de 100 jurisdiccions intercanvien anualment informació sobre comptes financers de no residents. A la UE incorporat per la **Directiva 2014/107/UE (DAC2)**. Espanya el va transposar via **Reial Decret 1021/2015** i Ordre HAP/1695/2016 (Modelo 289). A LATAM aplicat per Mèxic (des de 2017), Argentina, Colòmbia, Xile, Brasil, etc. Els **EUA no estan adherits al CRS**: usen FATCA, unilateral i només sortint. Vegeu <a href="/ca/blog/els-comptes-bancaris-americans-informen-a-la-teva-autoritat">EUA i reporting a Hisenda</a>.
### Què es reporta

Anualment cada institució financera reporta: identificació del titular (nom, adreça, residència fiscal, NIF/TIN), entitats (amb **beneficiaris efectius** si NFE passiva), número de compte, **saldo a 31 de desembre** i ingressos bruts.
## La teva LLC

1. **Els EUA no envien dades via CRS.** Mercury, Relay no comuniquen a l'AEAT.
2. **Comptes en fintechs europees** (Wise BE, Revolut LT, N26 DE, Wallester EE) a nom de la LLC **es reporten**. Vegeu <a href="/ca/blog/revolut-business-i-crs-que-es-reporta-a-hisenda">Revolut i CRS</a> i <a href="/ca/blog/wise-business-i-crs-que-es-reporta-a-hisenda">Wise i CRS</a>.
3. **La teva LLC és probablement classificada com NFE passiva** i la fintech reporta els **controlling persons** (tu).
### Determinació de residència fiscal

Auto-certificació + indicis objectius. Falsa auto-certificació = infracció.
### Implicacions a Espanya

Comptes estrangers > 50.000 € a final d'any: **Modelo 720**. Cripto > 50.000 €: **Modelo 721**. STJUE C-788/19 va anul·lar el règim sancionador desproporcionat però l'obligació es manté plena.
### Com planificar

Una LLC amb banca exclusivament Mercury/Relay té **petjada CRS mínima**. Estratègia professional: declarar correctament, dissenyar estructura eficient (vegeu <a href="/ca/blog/disseny-duna-estructura-fiscal-internacional-solida-marc-pas">marc de disseny</a>), mantenir documentació, conèixer riscos (<a href="/ca/blog/riscos-fiscals-duna-mala-estructuracio-internacional">riscos</a>).
### Errors típics

- "Mercury és als EUA", fals per a Wise/Revolut/N26 de la mateixa LLC.
- "Residència a Andorra" mentre vius a Espanya, la residència es determina per fets.
- "Si la LLC factura, estic tranquil", la **transparència fiscal internacional** (art. 100 LIS via 91 LIRPF) pot activar-se.
### En resum

CRS es planifica, no s'evita. Una LLC continua sent extremadament útil; el disseny del banking stack i la residència determinen la coherència informacional.

A Exentax encaixem aquestes obligacions des de la constitució. Reserva la teva assessoria gratuïta: identifiquem quines declaracions accessòries et toquen de debò i te les posem en ordre.

Si algun aspecte d'aquesta estructura t'ha deixat amb ganes de més detall, <a href="/ca/blog/per-que-els-freelancers-espanyols-estan-deixant-lautonom-per">Per què els freelancers espanyols estan deixant l'autònom per una LLC americana</a> aprofundeix en una peça veïna que normalment reservem per a un article a part.
### Propers passos

Si vols validar si aquesta estratègia encaixa amb la teva situació concreta, a Exentax revisem el teu cas de forma personalitzada i et proposem l'estructura legal i eficient que realment et convé. Reserva una sessió inicial sense compromís des de la nostra pàgina de contacte.

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
## Com planificar correctament

El que segueix és la visió operativa, no la dels manuals. Hem executat aquesta jugada prou vegades per saber quines variables cedeixen primer sota l'escrutini d'una autoritat fiscal o d'una compliance bancària, i és en aquest ordre que les abordem.

## En resum

La nostra posició aquí és deliberadament conservadora: optimitzem allò que sobreviu a una inspecció, no la xifra més agressiva. Els punts següents són els que estem disposats a defensar per escrit.

## Fets bancaris i fiscals que convé precisar

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.

<!-- exentax:calc-cta-v1 -->
> **Posa xifres al teu cas.** La <a href="/ca#calculadora">calculadora fiscal Exentax</a> compara la teva càrrega fiscal actual amb el que pagaries operant una LLC nord-americana correctament declarada al teu país de residència.
<!-- /exentax:calc-cta-v1 -->

## Referències: marc legal i normativa

Tractem aquest bloc com una de les decisions que sostenen l'estratègia LLC: errar aquí i la resta de l'estructura perd fiscalitat, accés bancari o compliance. Les notes que segueixen reflecteixen el que fem realment amb clients en aquest cas concret, prioritzant les variables que mouen el resultat.

## Parlem de la teva estructura

La nostra posició aquí és deliberadament conservadora: optimitzem allò que sobreviu a una inspecció, no la xifra més agressiva. Els punts següents són els que estem disposats a defensar per escrit.
La nostra posició aquí és deliberadament conservadora: optimitzem allò que sobreviu a una inspecció, no la xifra més agressiva. Els punts següents són els que estem disposats a defensar per escrit.

## Quina informació es reporta exactament

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.<!-- exentax:execution-v2 -->
## El que CRS significa avui per a residents a Espanya i Llatinoamèrica

CRS funciona en pilot automàtic: 110+ jurisdiccions intercanvien dades cada setembre sobre saldos a 31 de desembre de l'any anterior. Si ets resident fiscal a Espanya, Mèxic, Colòmbia, Xile, Perú, Argentina o Uruguai, els bancs on tens comptes a l'estranger ja estan reportant o ho faran aviat. Això és el que importa entendre, sense paranoia.

- **El que sí es reporta.** Saldos de compte a 31 de desembre, ingressos bruts de l'any (interessos, dividends), nom del titular, residència fiscal declarada al banc i, per a entitats transparents, dades de la controlling person. La informació arriba al país de residència i es creua amb la declaració fiscal.
- **El que no es reporta.** Moviments detallats del compte, contraparts específiques, informació transaccional. CRS és saldos + ingressos bruts + identificació; no és traçabilitat de cada operació. La percepció "ho saben tot" és exagerada literalment però encertada en conseqüència: amb saldos i rendes brutes es construeix la presumpció suficient per obrir requeriment.
- **Espanya, Modelo 720 i Modelo 721.** El resident fiscal espanyol té obligació pròpia de declarar comptes a l'estranger (>50.000 € combinat, Modelo 720) i criptoactius a l'estranger (>50.000 €, Modelo 721). No depèn del CRS, depèn de la teva obligació. El CRS només ajuda l'AEAT a creuar i detectar omissions.
- **Llatam - ritmes diferents.** Mèxic (SAT) intercanvia des de 2018 amb cobertura extensa; Colòmbia (DIAN) des de 2017 amb depuració progressiva; Xile (SII) des de 2018; Argentina (AFIP) des de 2018 però amb ús operatiu en construcció; Uruguai actiu però amb règim tax-haven que matisa el flux. La intensitat del seu ús varia, la disponibilitat de la dada ja és generalitzada.

### El que més ens pregunten

**Si tinc Mercury a la meva LLC, el meu país ho sap via CRS?** No directament: els EUA no participen al CRS. El que sí entra són els comptes Wise (via Bèlgica) i, si la LLC operés des d'un banc europeu o asiàtic, aquells sí. Mercury queda fora del flux automàtic, no fora de tota obligació declarativa.

**Com regularitzo si fa anys que no declaro?** Amb declaració complementària del 720/721 abans que arribi requeriment. La STJUE C-788/19 va limitar les multes espanyoles; es pot regularitzar amb cost molt menor que fa 5 anys. Ho avaluem cas a cas.

A Exentax mapegem quins comptes teus entren al CRS, quines obligacions declaratives dispara cada un i dissenyem l'alta neta o la regularització ordenada quan aplica.
<!-- /exentax:execution-v2 -->

## Què és el CRS i per què existeix

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Truca'ns al <a href="tel:+34614916910">+34 614 916 910</a> o escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Aquest%20article%20es%20va%20escriure%20pensant%20en%20Espanya%20i%20Llatinoam%C3%A8rica%2C%20per%C3%B2%20toca%20%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisió editorial pendent</strong> — Les referències següents requereixen verificació manual contra la font oficial vigent. Si detectes una desviació, escriu-nos i ho corregim en menys de 24 hores.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">50%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…E)**, salvo que demuestre actividad operativa real (más del 50% de sus ingresos son operat…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…uentas en el extranjero** con saldo individual o conjunto &gt; 50.000 € a 31 de diciembre o s…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">20.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…zo del año siguiente; sucesivas, solo si hay variación de + 20.000 € en cualquier rúbrica.…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…nvenio OCDE con sus Comentarios. - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación chec…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §77…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…U.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa F…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…cación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1021/2015</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…os CRS La entidad financiera aplica una **due diligence** (RD 1021/2015 y Anexo I del CRS)…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC2</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…6/UE de cooperación administrativa (DAC), modificada por la DAC2 (Directiva 2014/107/UE) q…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…13 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Conve…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…esde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Convenio OCD…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
