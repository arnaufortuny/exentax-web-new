export default `Canviar de país de residència fiscal a mitja temporada mentre ets membre d'una LLC americana és un dels escenaris més complicats de gestionar bé. No tant pel costat americà (la LLC continua sent el que era), sinó per la imputació de rendes a dues jurisdiccions el mateix any.

### Punt de partida: la LLC no es mou

La LLC és entitat dels EUA amb domicili propi, EIN, compliance amb <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> i <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>.

- **Form 5472 + 1120 pro-forma** presentat per l'exercici com sempre.
- **BOI Report** només s'actualitza si canvia la informació personal reportada.
- **Banca** (Mercury, Wise) s'actualitza amb la nova adreça després de consumar la mudança.

El que canvia: **on declares** les rendes atribuïdes per la LLC.
### Determinació de la residència fiscal a mig any

Criteris més habituals:
- **Més de 183 dies al país l'any natural**.
- **Centre d'interessos econòmics o vitals**.
- **Domicili fiscal** segons registre administratiu.
### Dues aproximacions: split-year vs any sencer

### Països split-year
Regne Unit, Països Baixos en part: l'exercici es parteix. Més senzill i just.

### Països d'any sencer
Espanya, Alemanya, França (amb matisos): resident o no per l'any complet. Pot generar **doble residència simultània**; els convenis desempaten.
### Tie-breaker rules

Per ordre:
1. **Habitatge permanent disponible**.
2. **Centre d'interessos vitals**.
3. **Lloc habitual de permanència**.
4. **Nacionalitat**.
5. **Acord amistós**.
### Com tributa la LLC a cada tram

SMLLC disregarded:
- **Durant residència A**: beneficis atribuïts tributen a A.
- **Durant residència B**: tributen a B.
- **Solapament**: conveni A-B amb tie-breakers.

Regla: per meritació, no per caixa. Tall comptable a la data de canvi.
## Casos típics

### Espanya → Andorra a mig any
Espanya considera residència per any natural complet si 183 dies. Andorra tracta com a parcial des de l'arribada.

### Argentina → Mèxic a mig any
Regles diferents; centre d'interessos vitals essencial.

### Alemanya → Portugal amb IFICI
Declaració alemanya del període. Portugal des de l'empadronament, possiblement IFICI.

### Cap a jurisdicció sense tributació personal
EAU, Mònaco. Prova sòlida del canvi efectiu.
### Errors típics

- **No documentar la data exacta**.
- **Assumir el canvi sense complir els criteris**.
- **No informar les plataformes**: activa incoherència CRS.
- **Deixar de presentar el 5472** "perquè ja no visc a Espanya" (la LLC continua).
- **Manca de coordinació entre assessors**: mateixa renda duplicada o omesa.
### A fer abans del canvi

- **Anàlisi fiscal prèvia**.
- **Documentació del canvi**: vol, contracte en destí, baixa en origen.
- **Planificació de calendari**.
- **Coordinació amb assessor en destí**.
- **Actualització ordenada de banca/plataformes**.
### Com ho abordem a Exentax

A Exentax acompanyem canvis de residència amb LLC amb freqüència. Reserva una sessió inicial gratuïta a la nostra pàgina d'agendament.
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

<!-- exentax:legal-facts-v1 -->
## Fets legals i de procediment

Les obligacions davant la FinCEN i l'IRS s'han mogut en recent years; aquest és l'estat vigent:

<!-- exentax:calc-cta-v1 -->
> **Posa xifres al teu cas.** La <a href="/ca#calculadora">calculadora fiscal Exentax</a> compara la teva càrrega fiscal actual amb el que pagaries operant una LLC nord-americana correctament declarada al teu país de residència.
<!-- /exentax:calc-cta-v1 -->

### Punts clau

- **BOI / Corporate Transparency Act.** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a "foreign reporting companies"** (entitats constituïdes fora dels EUA i registrades per operar en un estat). Una **LLC formada als EUA per un no resident està, avui, fora d'aquesta obligació**. L'estat normatiu pot tornar a canviar: **cal re-verificar a FinCEN.gov en el moment de la presentació**. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament i monitoritza actualitzacions.
- **Form 5472 + 1120 pro-forma.** Per a una **Single-Member LLC propietat d'un no resident**, les regulacions finals Treas. Reg. §1.6038A-1 (vigents des de 2017) tracten la LLC com a corporation a efectes del 5472. Procediment: **Form 1120 pro-forma** (només capçalera: nom, adreça, EIN, exercici) amb **Form 5472 annexat**. Enviament **per correu certificat o fax a l'IRS Service Center d'Ogden, Utah**, **no via MeF/e-file** estàndard. Venciment: **15 d'abril**; pròrroga via **Form 7004** fins al **15 d'octubre**. **Sanció: 25.000 USD per formulari i any, més 25.000 USD per cada 30 dies addicionals** de no presentació després de notificació de l'IRS.
- **Form 1120 substantiu.** Només aplica si la LLC ha fet check-the-box election a C-Corp (Form 8832): tributa al 21 % federal i presenta un 1120 amb xifres reals. La LLC disregarded estàndard **no presenta un 1120 substantiu i no paga corporate tax federal**.
- **EIN i notificacions.** Sense EIN no es pot presentar el 5472 ni el BOI. L'IRS no avisa abans de sancionar; es descobreix quan l'EIN queda bloquejat o una presentació posterior és rebutjada.
## T'ho muntem sense que perdis un cap de setmana

Milers de freelancers i emprenedors ja operen amb la seva LLC americana de manera 100% legal i documentada. A Exentax ens encarreguem de tot el procés: constitució, banca, passarel·les de pagament, comptabilitat, declaracions IRS i compliance al teu país de residència. Reserva una assessoria gratuïta i et direm amb sinceritat si la LLC té sentit per al teu cas, sense promeses absolutes.
## Referències: fonts sobre estructures i jurisdiccions

Les comparatives i dades quantitatives sobre les jurisdiccions citades es basen en fonts oficials actualitzades a avui:

- **Estats Units.** Delaware General Corporation Law i Limited Liability Company Act, Wyoming Limited Liability Company Act (Title 17, Chapter 29), instruccions de l'IRS per al Form 5472 i IRC §7701 (classificació d'entitats).
- **Andorra.** Llei 95/2010 de l'Impost sobre Societats (IS al 10%), Llei 5/2014 del IRPF i règim de residència activa/passiva del Govern d'Andorra.
- **Estònia.** Income Tax Act estonià (impost diferit sobre beneficis distribuïts al 20/22%) i documentació oficial del programa e-Residency.
- **Espanya.** Llei 27/2014 (IS), Llei 35/2006 (IRPF, arts. 8-9 sobre residència i art. 100 sobre TFI) i règim especial d'impatriats (art. 93 LIRPF, "Llei Beckham").
- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Pilar Dos (GloBE) i Model de Conveni OCDE amb Comentaris.
L'elecció de jurisdicció depèn sempre de la residència fiscal real del titular i de la substància econòmica de l'activitat; revisa el teu cas específic abans de qualsevol decisió estructural.

<!-- exentax:execution-v2 -->
## Canviar de residència fiscal a mitja temporada amb una LLC: el que gairebé ningú planifica bé

Moure residència l'1 de gener és net. Fer-ho el 17 de juny amb una LLC operativa obre cinc fronts alhora: prorrateig de rendes, dues declaracions, exit tax si el teu país l'aplica, redocumentació bancària i reset CRS. Això és el que convé tenir resolt abans.

- **Prorrateig i dues declaracions.** La majoria de jurisdiccions et tributen com a resident del país A fins a la data de canvi i del país B des d'aleshores. Les rendes atribuïdes per la LLC es reparteixen per dies reals o per criteri de meritació, segons jurisdicció. Documenta la data exacta amb bitllets, contracte de lloguer i empadronament.
- **Exit tax i plusvàlues latents.** Espanya (art. 95 bis LIRPF), França (art. 167 bis CGI), Alemanya (§6 AStG) activen tributació sobre plusvàlues latents en perdre residència per sobre de certs llindars. Una participació en LLC amb valor de mercat alt pot disparar-lo. Valora-la abans.
- **Reset CRS i banca.** La teva LLC ha d'actualitzar la seva autodeclaració CRS a Mercury, Wise i qualsevol altre proveïdor amb el nou país. Si ho endarrereixes, poden congelar el compte o reportar al país equivocat durant un any sencer.
- **CFC del nou país.** Arribes a una jurisdicció amb CFC diferent (Itàlia, Portugal, Alemanya): la teva LLC potser ja no és neutra i necessita reestructurar-se o documentar substància addicional.

### Què ens pregunten més

**Quan compta el dia del canvi?** Depèn del país: Espanya i Portugal compten des del dia 184 de presència o centre d'interessos vitals; Regne Unit aplica split-year treatment amb regles pròpies. Documenta entrada i sortida.

**Puc cobrar dividends abans de moure i estalviar?** De vegades sí, de vegades és exit tax encoberta. Cal modelar el cost fiscal en tots dos països abans de moure ni un euro - l'ordre importa.

A Exentax planifiquem canvis de residència amb LLC operativa dissenyant el calendari fiscal òptim, els fluxos previs al canvi i la documentació que sostindrà el split en totes dues inspeccions.
<!-- /exentax:execution-v2 -->

<!-- exentax:cross-refs-v1 -->
### Lectures relacionades

- [LLC als Estats Units: guia completa per a no residents](/ca/blog/llc-als-estats-units-guia-completa-per-a-no-residents-el)
<!-- /exentax:cross-refs-v1 -->
### Recordatori pràctic

Cada situació fiscal depèn de la teva residència, de l'activitat exercida i dels contractes en vigor. La informació aquí presentada és general i no substitueix l'assessorament personalitzat; analitza el teu cas concret abans de prendre decisions estructurals.
## Com treballem a Exentax

El nostre equip està especialitzat en estructures fiscals internacionals per a residents de països de parla hispana que operen negocis en línia. Combinem coneixement local d'Espanya, Andorra i l'Amèrica Llatina amb experiència operativa en la constitució d'entitats a Delaware, Wyoming, Estònia i altres jurisdiccions. Cada cas comença amb una consulta gratuïta en la qual avaluem la residència, l'activitat i els objectius, i et diem amb sinceritat si l'estructura proposada té sentit o si una alternativa més senzilla és suficient.
### Nota editorial

Aquest article s'actualitza anualment amb els canvis normatius que afecten les estructures tractades. Si detectes una referència desactualitzada, escriu-nos i la revisarem al pròxim cicle editorial; mantenim la data de publicació visible a la part superior de cada article per a total transparència.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Truca'ns al <a href="tel:+34614916910">+34 614 916 910</a> o escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22Canviar%20de%20pa%C3%ADs%20de%20resid%C3%A8ncia%20fiscal%20a%20mitja%20temporada%20mentre%20ets%20membre%20d'un%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisió editorial pendent</strong> — Les referències següents requereixen verificació manual contra la font oficial vigent. Si detectes una desviació, escriu-nos i ho corregim en menys de 24 hores.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">50.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…os.** Cuentas bancarias en EE. UU. con saldo medio o final &gt;50.000 € en el ejercicio: **Mo…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…un no residente**, las regulaciones finales de Treas. Reg. §1.6038A-1 (vigentes desde 2017…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…ga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y añ…»</span> <strong>[NO VERIFICAT]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(xifra)</span> <span class="text-xs italic">— «…r&quot;&gt;OCDE&lt;/a&gt; con sus Comentarios. - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación chec…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…U.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa F…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…sidencia personal cambia; la LLC no. Eso significa: - El **Form 5472 + 1120 pro-forma** de…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…C como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo ca…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…13 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Conve…»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(referència legal)</span> <span class="text-xs italic">— «…esde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Convenio &lt;a …»</span> <strong>[REVISIÓN MANUAL — font suggerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
