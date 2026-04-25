export default `Revolut Business s'opera des de Lituània per a la UE i aplica el CRS per defecte: els teus saldos i moviments arriben a l'AEAT cada any. Molts clients catalans obren Revolut Business per a la LLC sense adonar-se que això anul·la part del que creien haver guanyat del cantó dels EUA.

## Quines entitats Revolut i on reporten

**Revolut Bank UAB** (Lituània, banc llicenciat per Lietuvos Bankas, entitat principal EEE des de 2021, reporta CRS al **VMI** lituà), que reenvía a l'AEAT/SAT/DIAN/AFIP. **Revolut Ltd** (UK, EMI FCA), **Revolut Payments UAB**.
### Marc normatiu

<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> CRS; UE Directiva 2011/16/UE amb DAC2; Lituània llei nacional CRS; Espanya RD 1021/2015. Vegeu <a href="/ca/blog/crs-per-a-residents-a-espanya-i-llatinoamerica-implicacions">CRS per a residents</a>.
### Informació enviada

Identificació titular/entitat amb classificació CRS, **controlling persons** si NFE passiva, IBAN, **saldo 31/12**, interessos/dividends/productes bruts.
### LLC amb Revolut Business

Revolut aplica due diligence a la LLC i sense documentació robusta la classifica **Passive NFE**. Reporta els controlling persons (tu) al país de residència. Encara que la LLC sigui americana, les teves dades arriben a Hisenda via Lituània.
### Auto-certificació CRS

A l'obertura cal omplir-la: residència, classificació, controlling persons. LLC unipersonal de serveis pot ser Active NFE; Revolut tendeix a Passive NFE.
### Mala declaració de residència

Si IP, adreça de targeta, telèfon i transferències apunten a Espanya tot i declarar Andorra: petició de certificat o doble reporting.
### Com planificar

1. No usar Revolut com a **principal** de la LLC si vols minimitzar petjada CRS, Mercury continua òptim.
2. Si l'uses, declara correctament. Vegeu <a href="/ca/blog/disseny-duna-estructura-fiscal-internacional-solida-marc-pas">disseny d'estructura</a>.
3. Coherència documental.
4. Riscos: <a href="/ca/blog/riscos-fiscals-duna-mala-estructuracio-internacional">riscos</a>.
### Comparativa

| Plataforma | Jurisdicció | CRS | Reporta a |
| --- | --- | --- | --- |
| Mercury | EUA | No | Ningú via CRS |
| Revolut Business | Lituània | Sí | AEAT via VMI |
| Wise Business | Bèlgica | Sí | AEAT via SPF |
| Wallester | Estònia | Sí | AEAT via autoritat EE |
### DAC7 i DAC8

Vendes a plataformes: <a href="/ca/blog/dac7-el-nou-reporting-de-plataformes-digitals-el-2026">DAC7</a>; cripto a exchanges UE: <a href="/ca/blog/dac8-i-criptomonedes-el-nou-reporting-fiscal-automatic-el">DAC8</a>.
### En resum

Revolut Business és excel·lent; conèixer el perfil CRS és essencial.

A Exentax avaluem cas per cas si Revolut Business hi encaixa. Reserva la teva assessoria gratuïta: mirem el mapa bancari sencer i et diem què mantenir i què moure.
## Compliance fiscal al teu país: CFC, TFI i atribució de rendes

Una LLC americana és una eina legal i reconeguda internacionalment. Però el compliment no acaba en constituir-la: com a propietari resident fiscal en un altre país, l'administració tributària local manté el dret a gravar el que la LLC genera. L'important és saber **sota quin règim**.

### Per jurisdicció

- **Espanya (LIRPF/LIS).** Si la LLC és una *Single-Member Disregarded Entity* operativa (serveis reals, sense passivitat significativa), Hisenda la tracta normalment per **atribució de rendes (art. 87 LIRPF)**: els beneficis nets s'imputen al soci l'exercici en què es generen, integrant-se a la base general de l'IRPF. Si la LLC opta per tributar com a *corporation* (Form 8832) i queda controlada per resident espanyol amb rendes majoritàriament passives, pot activar-se la **transparència fiscal internacional (art. 91 LIRPF per a persones físiques, art. 100 LIS per a societats)**. La diferència no és opcional: depèn de la substància econòmica, no del nom.
- **Models informatius.** Comptes als EUA amb saldo mitjà o final >50.000 € a l'exercici: **Model 720** (Llei 5/2022 després de la STJUE C-788/19, 27/01/2022, sancions ara dins del règim general LGT). Operacions vinculades amb la LLC i dividends repatriats: **Model 232**. Criptoactius custodiats als EUA: **Model 721**.
- **CDI Espanya–EUA.** El conveni (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol en vigor 27/11/2019) ordena la doble imposició sobre dividends, interessos i royalties. Una LLC sense establiment permanent a Espanya no constitueix per si sola EP del soci, però la direcció efectiva sí pot crear-lo si tota la gestió es fa des de territori espanyol.
- **Mèxic, Colòmbia, Argentina i altres LATAM.** Cada jurisdicció té el seu propi règim CFC (Mèxic: Refipres; Argentina: rendes passives de l'exterior; Xile: art. 41 G LIR). El principi comú: el que la LLC reté com a benefici es considera percebut pel soci si l'entitat es considera transparent o controlada.

La regla pràctica: una LLC operativa, amb substància, declarada correctament en residència, és **planificació fiscal legítima**. Una LLC que s'utilitza per ocultar ingressos, simular no-residència o desplaçar rendes passives sense justificació econòmica entra al terreny de l'**art. 15 LGT (conflicte en aplicació de la norma)** o, en el pitjor cas, de l'**art. 16 LGT (simulació)**. La diferència la marquen els fets, no el paper.

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
## Fets bancaris i fiscals que convé precisar

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.
## Referències: fonts i normativa bancària

## El teu pròxim pas amb Exentax

Tractem aquest bloc com una de les decisions que sostenen l'estratègia LLC: errar aquí i la resta de l'estructura perd fiscalitat, accés bancari o compliance. Les notes que segueixen reflecteixen el que fem realment amb clients en aquest cas concret, prioritzant les variables que mouen el resultat.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

Tractem aquest bloc com una de les decisions que sostenen l'estratègia LLC: errar aquí i la resta de l'estructura perd fiscalitat, accés bancari o compliance. Les notes que segueixen reflecteixen el que fem realment amb clients en aquest cas concret, prioritzant les variables que mouen el resultat.

## Quina informació concreta envia Revolut

## El cas de la LLC amb compte Revolut Business

Llegeix aquesta secció com una checklist exigent: cada punt assenyala un mode de fallada real que hem vist en expedients LLC transfronterers. No te'n saltis cap - la majoria de regularitzacions i tancaments de compte que netegem després provenen d'algun d'aquests ítems.<!-- exentax:execution-v2 -->
## Revolut Business i CRS: què reporta a Hisenda i com es veu des de l'altre costat

Revolut Business és pràctic, multidivisa i barat - i reporta sistemàticament sota el Common Reporting Standard.

- **Règim CRS de Revolut Business.** Revolut Bank UAB és entitat financera reportant CRS des de la llicència bancària lituana. Reporta anualment al Banc de Lituània, que comparteix amb la resta de jurisdiccions CRS - inclòs l'Estat de residència fiscal del UBO declarat.
- **Quina dada exacta es transmet.** Identificació del titular, saldo a 31 desembre, total moviments bruts, identificador de compte (IBAN LT). NO transaccions individuals, agregats.
- **Per què Hisenda ho creua amb el 720.** Si saldo per sobre del llindar i no presentes 720, Hisenda rep via CRS i compara. Diferència = expedient automàtic.
- **El que canvia davant d'un banc US tradicional.** Revolut UE reporta CRS ràpid (Q1 any següent). Mercury/Wise USD reporten FATCA a l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> i arriba també però amb més latència.

### El que més ens pregunten

**Si obro Revolut Business com a LLC US, reporta a US o al meu país?** Reporta a la residència fiscal del UBO declarada.

**Puc declarar residència "US" al KYC?** Declaració falsa al banc - delicte.

A Exentax estructurem el stack bancari tenint en compte el que CRS/FATCA reporten.
<!-- /exentax:execution-v2 -->

## Quines entitats de Revolut hi ha i on reporten

Tractem aquest bloc com una de les decisions que sostenen l'estratègia LLC: errar aquí i la resta de l'estructura perd fiscalitat, accés bancari o compliance. Les notes que segueixen reflecteixen el que fem realment amb clients en aquest cas concret, prioritzant les variables que mouen el resultat.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Truca'ns al <a href="tel:+34614916910">+34 614 916 910</a> o escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Revolut%20Business%20s'opera%20des%20de%20Litu%C3%A0nia%20per%20a%20la%20UE%20i%20aplica%20el%20CRS%20per%20defe%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisió editorial pendent</strong> — Les referències següents requereixen verificació manual contra la font oficial vigent. Si detectes una desviació, escriu-nos i ho corregim en menys de 24 hores.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">25%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…ssive NFE: datos de los **controlling persons** (umbral del 25% de control directo o indir…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…ra que la AEAT detecte si superas el umbral del Modelo 720 (50.000 €) o del Modelo 721 si …»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">50%</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…persons. Una **Active NFE** es aquella en la que menos del 50% de sus ingresos son rentas …»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">IRC §1471</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…eneficial Ownership Information Report). - **FATCA y CRS.** IRC §1471-1474 (FATCA y formul…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…ury y Wise, pasarelas Stripe y Adyen, contabilidad mensual, Form 5472 y 1120 pro-forma cad…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1021/2015</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…, aplicará el procedimiento de **change in circumstances** (RD 1021/2015, art. 4 y Anexo I…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC2</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…dos. - **UE**: Directiva 2011/16/UE (DAC) modificada por la DAC2 (Directiva 2014/107/UE), …»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…vs fintech para tu LLC&lt;/a&gt;. ### Consideraciones adicionales DAC7 y DAC8 Si tu LLC vende a …»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…ech para tu LLC&lt;/a&gt;. ### Consideraciones adicionales DAC7 y DAC8 Si tu LLC vende a través …»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
