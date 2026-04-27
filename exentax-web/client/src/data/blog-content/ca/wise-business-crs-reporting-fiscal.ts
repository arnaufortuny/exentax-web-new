export default `

Wise Business (abans TransferWise) és la fintech multidivisa que la majoria de titulars d'una <a href="/ca/blog/llc-als-estats-units-guia-completa-per-a-no-residents-el">LLC nord-americana</a> obren primer, juntament amb qualsevol emprenedor internacional que necessiti moure diners entre països. La proposta és clara: tipus de canvi mid-market, IBANs locals en EUR, GBP, USD i una dotzena més de divises, i comissions tan baixes que gairebé no es noten. El que molta gent no veu és que Wise és també una entitat financera europea plenament regulada i, com a tal, està subjecta al **Common Reporting Standard (CRS)**. Aquesta peça del puzle té implicacions molt concretes que vostè vol tenir clares abans d'integrar Wise dins l'estructura de la seva LLC.

## Quina entitat de Wise opera realment el seu compte i on reporta

Wise no funciona com una sola empresa global. Opera a través de diverses entitats regulades, i la que té el seu compte decideix quina autoritat fiscal veurà les seves dades:

- **Wise Europe SA** (Bèlgica): Entitat de Diner Electrònic (EMI) regulada pel **Banc Nacional de Bèlgica (NBB)**. És l'entitat que serveix els clients europeus des que el Regne Unit va perdre el passaport únic europeu després del Brexit. Reporta CRS al **Service Public Fédéral Finances** belga, que activa tot seguit l'intercanvi bilateral d'informació amb l'autoritat fiscal del país de residència del titular.
- **Wise Payments Limited** (Regne Unit): EMI regulada per la FCA. Continua servint clients britànics i alguns comptes preexistents.
- **Wise US Inc.**: regulada als Estats Units com a Money Services Business (MSB). El CRS no s'aplica perquè els EUA mai no s'hi van adherir.
- Filials a Singapur, Austràlia, l'Índia i altres mercats, cadascuna amb el seu regulador local i amb les seves pròpies regles de reporting.

Per a clients europeus i per a qualsevol LLC oberta amb representació europea al KYC, la configuració per defecte és que el compte queda a **Wise Europe SA (Bèlgica)**. Resultat directe: el report CRS surt cada any de Bèlgica i arriba a l'autoritat fiscal del seu país de residència, amb independència de l'estat on s'hagi constituït la LLC.

### Marc normatiu

- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>**: Common Reporting Standard.
- **UE**: Directiva 2011/16/UE en la redacció donada per la DAC2.
- **Bèlgica**: llei de 16 de desembre de 2015 sobre l'intercanvi automàtic d'informació financera (LIAFI) i els reials decrets d'aplicació.
- **Espanya com a destinatari**: Real Decreto 1021/2015, **Modelo 720** (la declaració espanyola de béns a l'estranger: comptes, valors, immobles) i **Modelo 721** (l'equivalent per a criptoactius mantinguts fora d'Espanya). Aprofundim el costat receptor al nostre article sobre <a href="/ca/blog/crs-per-a-residents-a-espanya-i-llatinoamerica-implicacions">CRS per a residents a Espanya i Llatinoamèrica</a>.

### Quina informació envia Wise sota CRS

La mateixa informació que qualsevol Reporting Financial Institution sota CRS, ni més ni menys:

| Bloc | Detall |
| --- | --- |
| Titular persona física | Nom, adreça, residència fiscal declarada, NIF/TIN, data i lloc de naixement |
| Titular entitat | Raó social, adreça, EIN/TIN, classificació CRS (Active NFE, Passive NFE, Investment Entity) |
| Controlling persons | Si l'entitat és Passive NFE: dades dels beneficiaris efectius (llindar del 25% en propietat directa o indirecta, o qualsevol altra forma de control efectiu) |
| Compte | Cada IBAN per divisa, més la referència interna de Wise |
| Saldo | Saldo agregat a 31 de desembre (Wise gestiona pools per divisa; el report agrega tots els pools) |
| Rendiments | Interessos eventuals (Wise Interest, Wise Assets), dividends bruts, productes bruts d'amortització (tractats com a rendiments de compte de custòdia, amb el programa Assets en compte) |

Tant el producte **Wise Interest** com els productes d'inversió de Wise sobre fons monetaris cauen clarament dins del reporting de comptes de custòdia. El detall de rendes brutes se suma al saldo de tancament, no el substitueix.

### Com classifica Wise la seva LLC sota CRS

Quan obre un compte Wise Business per a la seva LLC, Wise aplica due diligence CRS sobre l'entitat. Li demanen omplir el formulari **CRS Self-Certification** i confirmar:

- La residència fiscal de la LLC: Estats Units.
- La classificació: Active NFE, Passive NFE, Investment Entity, Reporting Financial Institution, etc.
- Les controlling persons (joc de dades complet: nom, adreça, residència fiscal, NIF/TIN, data i lloc de naixement).

A la pràctica, una LLC unipersonal de serveis acostuma a complir el criteri **Active NFE** (més del 50% dels ingressos són operatius, no passius). Però Wise juga conservadora: si la documentació és feble o l'activitat no es pot acreditar de forma sòlida, classifica la LLC com a **Passive NFE** i reporta directament la controlling person.

La conclusió que no es pot esquivar: encara que la LLC sigui nord-americana i els EUA mai no s'hagin adherit al CRS, **les dades sobre qui n'és propietari i quant hi ha al compte arribaran a la seva autoritat fiscal** des de Bèlgica.

### Quan i com es produeix el reporting de debò

- Fotografia de tancament d'exercici: 31 de desembre.
- Wise envia el report CRS a l'autoritat belga típicament entre març i juny de l'any següent.
- Bèlgica el reenvia a les autoritats fiscals del país de residència de cada titular i de cada controlling person, normalment abans del 30 de setembre.
- La seva autoritat fiscal disposa de la dada i la creua amb les seves declaracions (a Espanya, IRPF més Modelo 720, més Modelo 721 si també té criptoactius a l'estranger).

El saldo de Wise que tenia a 31/12/2025 es contrasta així amb la declaració d'IRPF que presenta entre maig i juny i amb el Modelo 720 que presenta el març de l'any següent. Dos formularis diferents, una sola conciliació.

## Els errors més freqüents amb Wise i la fiscalitat

1. **«Wise és només una passarel·la, ningú no veu res.»** Fals. Wise és una entitat financera regulada i està plenament subjecta al CRS, exactament com qualsevol banc tradicional.
2. **«Si hi poso la LLC, el meu nom no apareix.»** Fals per a qualsevol Passive NFE: les controlling persons es reporten nominalment. I la majoria de LLC unipersonals acaben classificades com a Passive NFE simplement per prudència bancària.
3. **«El meu saldo mitjà era petit, així que no em reportaran.»** Wise reporta el saldo de tancament a 31 de desembre, amb independència de com hagi anat oscil·lant durant l'any. El CRS no té cap llindar mínim per a comptes preexistents des del 2017, ni per a comptes nous.
4. **«No vaig posar Wise al Modelo 720 perquè era petit.»** El llindar del Modelo 720 és l'agregat de tots els seus comptes a l'estranger, no un límit per compte. Si Wise + Mercury + Revolut + N26 superen junts 50.000 €, totes s'han de declarar.
5. **«Només faré servir Wise per al canvi, no per a custòdia.»** Encara que faci servir Wise només com a compte operatiu de dipòsit, continua sent un compte financer reportable. La distinció dipòsit/custòdia altera el bloc de detall de rendes, no el report del saldo.

### Com es compara Wise amb Revolut i Mercury

| Aspecte | Wise Europe (BE) | Revolut Bank UAB (LT) | Mercury (US) |
| --- | --- | --- | --- |
| Subjecta a CRS | Sí | Sí | No |
| Reporta beneficiari efectiu de la LLC | Sí (Passive NFE típica) | Sí (Passive NFE típica) | No |
| Producte d'inversió natiu | Wise Assets, Wise Interest | Stocks, Vault | Treasury, FDIC sweep |
| Multidivisa nativa | Excel·lent | Excel·lent | Sobretot USD |
| Idoneïtat com a compte principal de la LLC | Secundària | Secundària | Principal |

Comparativa ampliada a <a href="/ca/blog/wise-business-amb-la-teva-llc-la-guia-completa-de-gestio">la guia completa de Wise Business per a la seva LLC</a>, a <a href="/ca/blog/revolut-business-i-crs-que-es-reporta-a-hisenda">l'article dedicat a Revolut i CRS</a> i, específicament per a l'IBAN belga, a <a href="/ca/blog/wise-iban-i-llc-que-es-reporta-realment-a-hisenda">què reporta l'IBAN de Wise associat a la seva LLC</a>.

### Com planificar-ho correctament

1. **Deixi l'autocertificació ben feta des del primer dia.** Sigui precís en la classificació CRS de la LLC i en la identitat de les controlling persons. Mentir o ometre és una infracció i, en alguns ordenaments, un delicte.
2. **Faci servir Wise com a compte operatiu secundari**, no com a principal de la LLC, si vol minimitzar la petjada CRS cap al seu país. Mercury continua sent el compte principal natural d'una LLC nord-americana.
3. **Mantingui coherència documental.** L'autocertificació CRS a Wise, el Modelo 720 (Espanya) o el seu equivalent llatinoamericà i l'IRPF han d'explicar la mateixa història.
4. **Planifiqui el saldo de tancament.** Si sap que arribarà a 31/12 amb saldo elevat, prepari que estigui ben declarat i ben justificat (origen dels fons, finalitat operativa, impostos ja pagats).
5. **Miri tot el marc**: <a href="/ca/blog/disseny-duna-estructura-fiscal-internacional-solida-marc-pas">el disseny global de la seva estructura</a> és el que determina si Wise + LLC + la seva residència aguanten o s'enfonsen.

### En resum

Wise Business no és una drecera per evitar el reporting fiscal. És una excel·lent fintech regulada que reporta via CRS des de Bèlgica cap a la seva autoritat fiscal. Ben integrada dins una estructura coherent amb la seva LLC nord-americana, és molt útil. Mal integrada, o feta servir amb autocertificacions que no quadren amb la realitat, esdevé la font més habitual dels problemes fiscals que ens arriben a la consultoria.

## Compliance fiscal a Catalunya: AEAT, ATC i normativa estatal aplicable

Una LLC nord-americana és una eina legal i reconeguda internacionalment. Però el compliment no acaba en constituir-la: com a propietari resident fiscal a Catalunya (art. 9 LIRPF, criteri de permanència >183 dies o nucli d'interessos econòmics), l'administració tributària espanyola manté el dret a gravar el que la LLC genera. L'important és saber **sota quin règim** i **a quin tram autonòmic**.

### A Catalunya, l'Estat espanyol i l'entorn UE-Andorra

- **Catalunya i Estat espanyol (LIRPF/LIS).** Si la LLC és una *Single-Member Disregarded Entity* operativa (serveis reals, sense passivitat significativa), l'AEAT la tracta normalment per **atribució de rendes (art. 87 LIRPF)**: els beneficis nets s'imputen al soci l'exercici en què es generen i s'integren a la base general de l'IRPF amb la **tarifa estatal + tarifa autonòmica catalana** (Llei 19/2010 reguladora dels tributs cedits, fins al 25,5 % per a rendes >175.000 €, sumant un marginal màxim conjunt entorn del 50 %). Si la LLC opta per tributar com a *corporation* via Form 5472 combinat amb **Form 8832** (el formulari d'elecció de l'IRS) i queda controlada per un resident català amb rendes majoritàriament passives, s'activa la **transparència fiscal internacional (art. 91 LIRPF per a persones físiques, art. 100 LIS per a societats)**.
- **Models informatius davant l'AEAT.** Comptes als EUA i comptes IBAN europeus a nom personal (Wise, Revolut, N26, Wallester) amb saldo mitjà o final >50.000 € a l'exercici: **Model 720** (Llei 5/2022 després de la STJUE C-788/19 de 27/01/2022; sancions ara dins del règim general LGT). Operacions vinculades amb la LLC i dividends repatriats: **Model 232**. Criptoactius custodiats als EUA: **Model 721**. La presentació es fa per la seu electrònica de l'<a href="https://sede.agenciatributaria.gob.es" target="_blank" rel="noopener">AEAT</a> amb certificat digital o Cl@ve.
- **Tributs cedits gestionats per l'ATC.** Tot i que l'IRPF és estatal, si rep dividends de la LLC com a herència o donació futura, intervé la <a href="https://atc.gencat.cat" target="_blank" rel="noopener">ATC</a> (Successions i Donacions a Catalunya, amb bonificacions per a parents directes, i Patrimoni amb mínim exempt 500.000 € i tarifa fins al 3,48 % per als trams alts).
- **CDI Espanya–EUA.** El conveni (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol en vigor 27/11/2019) ordena la doble imposició sobre dividends, interessos i royalties. Una LLC sense establiment permanent a Espanya no constitueix per si sola EP del soci, però la direcció efectiva sí pot crear-lo si tota la gestió es fa des de Catalunya.
- **Andorra, Estat francès (Catalunya Nord) i UE.** Si valora un trasllat a Andorra (CDI amb Espanya en vigor des de 2016, IRPF andorrà al 10 % màxim), tingui en compte el **règim de quinquenni de l'art. 8.2 LIRPF** que manté la residència fiscal espanyola durant 5 anys per trasllats a paradisos fiscals (Andorra ja no figura a la llista negra). Per a Catalunya Nord (Roselló) regeix el règim francès. A la UE, la **Directiva ATAD II** (transposada a Espanya com art. 15 bis LIS) tanca esquemes híbrids amb LLC.

Regla pràctica: una LLC operativa, amb substància, declarada correctament en residència, és **planificació fiscal legítima**. Una LLC que es fa servir per ocultar ingressos, simular no-residència o desplaçar rendes passives sense justificació econòmica entra al terreny de l'**art. 15 LGT (conflicte en aplicació de la norma)** o, en el pitjor dels casos, de l'**art. 16 LGT (simulació)**. Els fets decideixen, no el paper.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

A Exentax muntem l'estructura perquè encaixi al primer escenari i documentem cada pas perquè la seva declaració local sigui defensable davant qualsevol revisió.

<!-- exentax:cta-mid -->
**Li sona complicat?** <a href="/ca/serveis">Els nostres serveis</a> ja inclouen «Wise Business i CRS: què es reporta a Hisenda i com integrar-ho a la seva estructura», presentat dins el termini, sense que vostè hagi de tocar res.

<!-- exentax:cta-final -->
**Expliqui'ns la seva situació i li direm per on començar.** Reservi una trucada de 30 minuts sobre «Wise Business i CRS: què es reporta a Hisenda i com integrar-ho a la seva estructura» i la revisem a fons.

<!-- exentax:legal-refs-v1 --><!-- exentax:execution-v2 -->
## Wise Business i CRS: com reporta a Hisenda i per què declarar sempre

Wise Business és operativament excel·lent per a la seva LLC — multidivisa, FX barat, IBANs locals en diverses jurisdiccions — i, des del punt de vista del reporting fiscal, és una entitat financera plenament subjecta a CRS. Si vostè és resident fiscal a Espanya, França, Itàlia, Alemanya, Portugal o a qualsevol altre país CRS, la seva autoritat fiscal rep la dada cada any. Val la pena saber exactament què arriba i com es creua.

- **Estatus regulatori de Wise Business.** Wise opera amb diverses llicències: Wise Payments Limited (UK FCA), Wise Europe SA (Bèlgica NBB), Wise USD Inc. (US <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>), entre d'altres. Cada entitat regional reporta segons el règim de la seva jurisdicció. Per a usuaris europeus de Wise Business, el reporting CRS el fa Wise Europe SA al Banc Nacional de Bèlgica, que comparteix amb la resta de jurisdiccions CRS — incloent-hi el país de residència del beneficiari efectiu.
- **Dades exactes transmeses.** Identificació del beneficiari efectiu segons el KYC (nom complet, DNI o passaport, adreça, residència fiscal declarada a l'onboarding), saldo a 31 de desembre per divisa (Wise multidivisa reporta cada saldo USD, EUR i GBP per separat), total de moviments bruts anuals i identificadors de compte (IBAN belga BE per a EUR, routing number USD per a USD, etc.). NO es transmeten transaccions individuals; agregats, sí.
- **Encreuament automàtic amb el seu IRPF o IS.** Espanya vincula les dades CRS al seu DNI per encreuar-les amb: (1) Modelo 720 si la mitjana de l'últim trimestre o el saldo a 31/12 supera els 50.000 €; (2) Modelo 721 si els seus criptoactius superen el llindar; (3) IRPF a la casella d'atribució de rendes per la LLC. Si els números no quadren, salta una alerta automàtica. Cadena típica: requeriment d'informació, després procediment de verificació si no respon amb documentació.
- **Què canvia quan la seva LLC suma Wise Business.** Wise Business EUR (compte belga) reporta més ràpid i de forma més completa que Wise USD (compte sota subllicència nord-americana). Si té tots dos (Wise multidivisa), tots dos reporten, però per canals diferents (Bèlgica → CRS, EUA → FATCA-IGA). Conseqüència pràctica: la visibilitat fiscal és la mateixa, només canvia la latència.

### El que més ens pregunten

**Si obro Wise Business com a LLC, reporta als EUA o al meu país?** Reporta a la residència fiscal del beneficiari efectiu — la persona física darrere de l'entitat. Si va dir «Espanya» al KYC, la dada va a Espanya via CRS. La LLC es tracta com a transparent per identificar el beneficiari efectiu; el CRS mira la persona darrere.

**Puc declarar la LLC a la residència sense declarar Wise específicament?** No. La LLC és una obligació (atribució de rendes o tractament de dividend, segons país). Wise és el compte bancari de la LLC i l'ha de declarar al formulari corresponent (Modelo 720 a Espanya, formulari 3916 a França, RW a Itàlia). Dues obligacions diferents, dos encreuaments automàtics.

A Exentax estructurem els comptes Wise + Mercury + Stripe tenint en compte des del primer dia el que CRS i FATCA reporten, i planifiquem les declaracions locals (720, 721, 3916, RW) — perquè l'encreuament automàtic no generi cap requeriment ni sanció per imputació.
<!-- /exentax:execution-v2 -->

## Referències: fonts i marc bancari

L'operativa bancària descrita s'avala amb documentació pública i amb les polítiques en vigor de cada plataforma:

- **Bank Secrecy Act i FinCEN.** 31 U.S.C. §5318 (programes KYC/AML obligatoris per a entitats financeres), 31 CFR Part 1010 (CIP, identificació del client) i 31 U.S.C. §5336 amb la Reporting Rule de FinCEN en vigor des de l'1 de gener de 2024 (Beneficial Ownership Information Report).
- **FATCA i CRS.** IRC §1471–1474 (FATCA i formularis W-8/W-9), Acords Intergovernamentals Model 1 signats pels EUA amb Espanya i diversos països llatinoamericans, i el Common Reporting Standard (CRS) de l'OCDE — al qual els EUA no participen però que sí que s'aplica plenament a fintechs amb llicència europea (Wise Europe SA a Bèlgica, Revolut Bank UAB a Lituània).
- **Plataformes específiques.** Termes de servei, política de privacitat i FAQ regulatòria publicats de Mercury (Choice Financial Group / Evolve Bank, FDIC), Relay (Thread Bank, FDIC), Wise Business (FinCEN MSB als EUA; Wise Europe SA a la UE; Wise Payments Ltd. al Regne Unit), Revolut Business i Payoneer.

A efectes informatius; cada cas bancari requereix una anàlisi específica de KYC, jurisdicció de residència i volum operat.

<!-- exentax:cross-refs-v1 -->
### Lectures complementàries

- [Visa i Mastercard: què veu realment Hisenda de les seves despeses amb targeta](/ca/blog/visa-mastercard-reporting-que-veu-hisenda-dels-pagaments-amb)
<!-- /exentax:cross-refs-v1 -->

Vol aplicar aquest protocol al seu cas? <a href="/ca/agendar">Reservi una sessió amb l'equip d'Exentax</a> i revisem la seva LLC amb números reals en trenta minuts, sense compromís.


<!-- exentax:defensa-fiscal-v1 -->
## I si l'AEAT li pregunta per la seva LLC?

  És la pregunta més freqüent en la primera consulta i té una resposta curta: la seva LLC no és opaca i, correctament declarada, una inspecció es tanca amb formularis estàndard. L'<a href="https://www.agenciatributaria.gob.es" target="_blank" rel="noopener">AEAT</a> i l'Agència Tributària de Catalunya poden demanar el Certificate of Formation de l'estat (Wyoming, Delaware o Nou Mèxic), l'EIN emès per l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, l'Operating Agreement signat, els extractes de Mercury o Wise de l'exercici, el Form 5472 amb 1120 pro-forma presentat i la comptabilitat que reconcilia ingressos, despeses i moviments. Si tot això existeix i s'entrega ordenat, la inspecció no escala.

  El que l'AEAT sí persegueix, amb raó, són els testaferros, la residència fiscal de paper i la no declaració dels Models 720 / 721. Una LLC ben muntada és exactament el contrari: vostè apareix com a **beneficial owner** al BOI Report quan aplica (verificable a <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), vostè signa els comptes bancaris i declara la renda on realment viu. L'estructura està registrada al Secretary of State de l'estat, als arxius de l'IRS i, sempre que un banc europeu hi intervé, dins del perímetre CRS de l'estàndard de l'<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.

  L'error que sí enfonsa una inspecció no és tenir una LLC; és no haver atribuït la renda correctament a l'IRPF, no haver presentat el Model 720 sobre els comptes als EUA quan el saldo a 31/12 supera els 50.000 € o no haver documentat les operacions vinculades soci-LLC al Model 232. Aquests tres fronts es tanquen abans del requeriment, no després.

  ## El que una LLC NO fa

  - **No l'eximeix de tributar a Catalunya / Espanya.** Si hi viu, tributa per la renda mundial. La LLC ordena la seva fiscalitat estatunidenca (zero impost federal a la SMLLC pass-through sense ECI), no l'espanyola. La quota d'IRPF es calcula sobre el benefici atribuït, no sobre els dividends efectivament cobrats.
  - **No és cap muntatge offshore ni un esquema BEPS.** És una entitat estatunidenca reconeguda per l'IRS, registrada en un estat concret amb adreça física, agent registrat i obligacions informatives anuals. Les jurisdiccions offshore clàssiques (BVI, Belize, Seychelles) no deixen rastre públic; una LLC en deixa en cinc llocs.
  - **No el protegeix si hi ha confusió patrimonial.** El *pierce the corporate veil* s'activa així que un jutge veu la LLC i el soci funcionar com la mateixa cartera: comptes barrejats, despeses personals pagades per la LLC, sense Operating Agreement, sense comptabilitat. Tres moviments sospitosos basten.
  - **No li estalvia cotitzacions a la Seguretat Social.** Si és autònom al RETA, la quota mensual continua sent la mateixa. La LLC opera la seva activitat davant clients internacionals; la cotització personal és independent i depèn de la base triada al <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de Seguretat Social.
  - **No el lliura de declarar els comptes estrangers.** Si la suma de comptes als EUA (Mercury, Relay, Wise USD) supera els 50.000 € a 31/12, **Model 720** abans del 31 de març. Si té criptoactius custodiats en exchanges fora d'Espanya per més de 50.000 €, **Model 721** en el mateix termini. Aquestes obligacions són del resident fiscal, no de la LLC.

  A Exentax revisem aquests cinc fronts cada any en paral·lel al calendari federal estatunidenc (Form 5472, 1120 pro-forma, FBAR, Annual Report estatal i BOI Report quan apliqui). L'objectiu és que cap inspecció trobi un cap solt i que l'estructura aguanti revisions a 5-7 anys vista.
<!-- /exentax:defensa-fiscal-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vol parlar-ne ara? Escrigui'ns per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22wise%20business%20crs%20reporting%20fiscal%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i li responem avui mateix.</p>

Si prefereix parlar-ne directament, <a href="/ca/agendar">reservi una sessió gratuïta</a> i revisem el seu cas real en trenta minuts.

<!-- exentax:conv-fill-v1 -->
O truca'ns directament al <a href="tel:+34614916910">+34 614 916 910</a> si prefereixes parlar.

Per a detalls per estat, consulta la nostra <a href="/ca/serveis/llc-wyoming">pàgina del servei LLC a Wyoming</a> amb costos i terminis tancats.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

`;
