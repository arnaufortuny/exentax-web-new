export default `

Quan algú diu "empresa americana", la majoria imagina una LLC; d'altres, una "corporation". La realitat és que als EUA existeixen quatre vehicles principals per fer negocis: **LLC**, **Corporation**, **S-Corporation** i **C-Corporation**. Cadascun té el seu propi règim fiscal federal i estatal, restriccions de propietat i casos d'ús. Per a un emprenedor català resident fiscal a Catalunya o a la resta d'Espanya, no totes són accessibles ni convenients. Aquesta guia aterra la diferència real entre les quatre figures, què encaixa amb cada perfil i per què la LLC continua sent, avui, l'elecció per defecte per a freelancers, agències i projectes digitals que no busquen inversors institucionals.

## LLC: l'opció flexible i per defecte per a no residents

La **LLC (Limited Liability Company)** és una figura híbrida creada per les lleis estatals dels EUA (cada estat té la seva pròpia LLC Act; **Wyoming va ser el primer, el 1977**, amb el Wyoming LLC Act). Jurídicament és una entitat amb responsabilitat limitada que protegeix el patrimoni personal dels seus membres davant els deutes i responsabilitats del negoci. Fiscalment, **per defecte és transparent**: la **Treas. Reg. §301.7701-3 ("check-the-box")** tracta la single-member LLC com a **"disregarded entity"** i la multi-member LLC com a **partnership** llevat que s'opti pel contrari amb el **Form 8832** (election to be classified as an association taxable as a corporation).

Per a un no resident sense **ETBUS** (Effectively Connected Trade or Business in the United States) i sense **US-source FDAP income**, la LLC disregarded **no genera obligació de Form 1040-NR substantiu** ni paga impost federal sobre la renda: la regla bàsica del **IRC §§871 i 882** sotmet els no residents només a (a) US-source FDAP amb retenció del 30 % (o tipus de tractat) i (b) rendes efectivament connectades a un trade or business als EUA. Sense aquests dos elements, la LLC paga **0 % federal**. A nivell estatal, **Wyoming, Nou Mèxic, Florida, Texas i Dakota del Sud** no tenen impost sobre la renda corporativa estatal, cosa que afegeix **0 % estatal** quan no hi ha nexus.

L'obligació pràctica que sí queda: anual **Form 5472 + Form 1120 pro-forma** (Treas. Reg. §1.6038A-1, en vigor des del 2017) per a SMLLC propietat d'un no resident amb qualsevol *reportable transaction* amb el seu únic membre. Sanció base: **25.000 USD per formulari i any** (IRC §6038A(d)) més **25.000 USD per cada 30 dies addicionals** després de la notificació de l'IRS.

## Corporation: per defecte C-Corporation

Quan algú constitueix una "Inc." o "Corp." sota la *General Corporation Law* d'un estat (per exemple, **Delaware General Corporation Law** o **Nevada Revised Statutes Chapter 78**), per defecte es tracta fiscalment com a **C-Corporation**: paga impost federal sobre els seus beneficis al **21 % (IRC §11(b), tipus únic introduït per la Tax Cuts and Jobs Act de 2017)**, més l'impost estatal corresponent (Delaware grava 8,7 % sobre la renda generada a l'estat, Califòrnia 8,84 %, Texas 0 % d'income tax però franchise tax). Quan reparteix dividends, els socis són gravats **una segona vegada** en la seva renda personal: per a US persons, dividends qualificats al 0 % / 15 % / 20 % federal (IRC §1(h)(11)); per a socis estrangers, retenció FDAP del **30 %** llevat de CDI aplicable (la **Convenció Espanya-EUA, BOE 22/12/1990, amb Protocol en vigor 27/11/2019** redueix la retenció sobre dividends al **15 % o 5 %** segons participació). És la doble imposició clàssica.

La C-Corp és **obligatòria de facto** per a qui vulgui aixecar capital de venture capital o sortir a borsa: els inversors institucionals (fons VC, family offices, plataformes com AngelList, Y Combinator) gairebé sempre exigeixen una **Delaware C-Corp** perquè coneixen la seva jurisprudència (Court of Chancery), pot emetre diverses classes d'accions (preferents amb liquidation preferences, Series A/B/C), permet stock options per a empleats (plans 409A) i permet ofertes públiques. No té límit de nombre d'accionistes ni restriccions de nacionalitat.

## S-Corporation: l'opció que un no resident no pot fer servir

La **S-Corporation** no és una forma jurídica nova: és una **elecció fiscal federal** definida al **subcapítol S de l'Internal Revenue Code (IRC §§1361-1378)** que una corporation o LLC pot sol·licitar mitjançant **Form 2553**. Un cop acceptada la S-election, l'entitat **no paga impost federal corporatiu**; els beneficis passen als socis i es reporten a les declaracions personals (Schedule K-1). A diferència de la LLC, els socis poden cobrar un **salari raonable** (W-2) i rebre la resta com a **distribucions no subjectes a self-employment tax** (15,3 %), cosa que redueix la càrrega FICA per a residents US. Aquesta és la raó principal per la qual els americans trien S-Corp.

El problema per a no residents: **IRC §1361(b)** estableix requisits estrictes. Màxim **100 accionistes**, tots han de ser **persones físiques residents o ciutadans americans** (no s'admeten estrangers, ni *non-resident aliens*, ni societats, ni LLCs com a accionistes), una sola classe d'accions (amb l'única excepció de diferències en drets de vot). Per aquests requisits, una **S-Corp és completament inviable per a un emprenedor no resident**. La mencionem perquè entenguis que quan llegeixes "S-Corp" en fòrums nord-americans o en llibres de tax planning de Robert Kiyosaki o Mark Kohler, gairebé mai aplica al teu cas.

## Quan una C-Corp té sentit per a un no resident

Una C-Corp pot compensar per a un no resident en escenaris concrets:

- **Vas a buscar inversió venture capital**: els fons exigeixen Delaware C-Corp amb cap table neta.
- **Planeges sortir a borsa** o ser adquirit per una empresa cotitzada (M&A típicament exigeix C-Corp).
- **Vas a tenir empleats amb stock options** als EUA (plans ISO/NSO requereixen corporation).
- **El teu negoci té ETBUS** (oficina, empleats, servidors propis, magatzem) i per tant pagaria impost federal igualment sota IRC §882: el diferencial fiscal vs LLC desapareix i la C-Corp aporta governança més sòlida.
- **Vols aprofitar el QSBS (Qualified Small Business Stock)** definit a **IRC §1202**: si mantens accions d'una C-Corp qualificada (actius ≤ 50 M USD a l'emissió, activitat operativa, no serveis professionals) durant **5 anys**, pots excloure fins al **major de 10 M USD o 10x base** en plusvàlua a la venda.

La doble imposició s'atenua amb planificació: salaris al fundador (deduïbles per a la corp, gravats com a ordinary income a l'individu), retenció de beneficis per reinvertir en lloc de repartir dividends, plans de compensació diferida i bon aprofitament del QSBS si encaixa.

## Taula comparativa de tributació efectiva

Per a un benefici de **100.000 USD** generat per un no resident sense ETBUS, sense US-source income, resident fiscal a Catalunya:

| Vehicle | Federal US | Estatal US | Retenció dividends | Total US | Tributació Catalunya |
|---|---|---|---|---|---|
| **LLC disregarded** (WY/NM) | 0 USD | 0 USD | N/A | **0 USD** | IRPF per atribució de rendes (art. 87 LIRPF) sobre benefici net + tram autonòmic català (escala fins al **25,5 %** a partir de 175.000 €) |
| **C-Corp Delaware** sense repartiment | 21.000 USD | 0 USD si no opera a DE | 0 USD | **21.000 USD** | Sense tributació immediata si no reparteix (llevat TFI art. 91 LIRPF) |
| **C-Corp Delaware** amb repartiment complet | 21.000 USD | 0 USD | 11.850 USD (15 % CDI ESP-USA) | **32.850 USD** | IRPF estalvi (19/21/23/27/28/30 % segons base) sobre dividend brut + crèdit per impost suportat |
| **S-Corp** | No disponible per a no residents (IRC §1361(b)) |

La diferència és enorme: per a perfils operatius sense pretensió d'inversió institucional, **la LLC és clarament més eficient**. La C-Corp només guanya quan el pla estratègic requereix venture capital, sortida a borsa o aprofitament de QSBS.

## LLC US vs alternatives a Catalunya: quan encaixa cadascuna?

Si estàs basat a Catalunya o a la resta d'Espanya, les teves opcions locals principals són:

- **Empresari individual (autònom RETA)**: alta a Hisenda i Seguretat Social, sense entitat jurídica separada, responsabilitat personal il·limitada. IRPF progressiu del 19 % al 47 % (estatal + autonòmic; a Catalunya, **escala autonòmica fins al 25,5 % a partir de 175.000 €**, segons Llei 5/2020 del Parlament de Catalunya). Cotització RETA per ingressos reals (Reial decret-llei 13/2022): de **230 €/mes** (ingressos fins a 670 €) fins a **590 €/mes** (ingressos > 6.000 €) el 2024, i **200 €/mes a 590 €/mes** segons trams el 2025-2026. IVA: declaració trimestral (model 303).
- **Societat Limitada Unipersonal (SLU)**: forma jurídica per a un sol soci amb responsabilitat limitada. Capital mínim **3.000 €** (Reial decret legislatiu 1/2010, Llei de societats de capital, art. 4.1). **Llei 18/2022 (Llei Crea i Creix)** introdueix la possibilitat de constituir-la amb **1 € de capital** (modalitat de "constitució successiva"), però amb obligació de dotar reserva legal del 20 % dels beneficis fins arribar als 3.000 €. Impost de Societats **25 %** (tipus general) o **15 %** per a empreses de nova creació els dos primers exercicis amb beneficis (art. 29.1 LIS). Distribucions tributen a IRPF estalvi del soci (19-30 %).
- **Societat Limitada (SL) plurisocial**: capital mínim 3.000 €, mínim dos socis.
- **Societat Anònima (SA)**: per a projectes grans, capital mínim 60.000 €.
- **Cooperativa**: figura específica a Catalunya (Llei 12/2015 de cooperatives), amb règim fiscal particular i tipus d'IS reduït (20 % per a cooperatives protegides).

Una LLC US detinguda des de Catalunya és tractada per **Hisenda Espanyola** com a entitat en règim d'atribució de rendes (art. 87 LIRPF), seguint la consulta vinculant **DGT V0290-20** (febrer 2020): els beneficis de la LLC es declaren a l'IRPF del soci com a rendiments de l'activitat econòmica. **Una LLC US és vantatjosa per a un resident fiscal català amb forta facturació internacional** (>40.000 €/any), però exigeix complir totes les obligacions declaratives locals: **Modelo 720** per a comptes bancaris als EUA amb saldo mig o final >50.000 €, **Modelo 232** per a operacions vinculades, **Modelo 100** (declaració de la renda) amb els ingressos atribuïts.

## Què triar segons el teu perfil

- **Freelancer, agència digital, consultor, infoproducte, ecommerce petit, SaaS bootstrapped**: **LLC** sense dubte si factures majoritàriament a internacional. Wyoming o Nou Mèxic pel cost; Delaware si preveus créixer molt.
- **Startup amb ronda seed o sèrie A planificada**: **Delaware C-Corp** des del primer dia, assumint la doble imposició com a cost d'accés a capital.
- **Negoci físic als EUA amb empleats i operativa local**: probablement C-Corp si esperes créixer molt; LLC si vas a operar com a petit negoci.
- **Professional regulat (advocat, metge, arquitecte col·legiat)**: molts estats exigeixen **Professional LLC (PLLC)** o **Professional Corporation (PC)** amb llicència estatal.

Si ja tens una LLC i necessites convertir-la en C-Corp, és possible via **statutory conversion** (DE, NV, WY) o via **check-the-box election (Form 8832)**. Sota **IRC §351**, la incorporació pot ser tax-free si es compleixen requisits (control 80 % post-incorporation, exclusivament actius per accions), però qualsevol desviació dispara fets imposables immediats.

## Marc regulatori aplicable

- **Internal Revenue Code (Title 26 USC)**: §11(b) C-Corp 21 %; §§1361-1378 règim S-Corp; §1202 QSBS; §§871, 881, 882, 1441 fiscalitat de no residents; §6038A Form 5472; §351 incorporacions tax-free.
- **Treasury Regulations**: §301.7701-3 check-the-box; §1.6038A-1/2 Form 5472 disregarded entities.
- **IRS Publications**: <a href="https://www.irs.gov/businesses/small-businesses-self-employed/business-structures">Business Structures</a>; Pub. 519 (US Tax Guide for Aliens); Pub. 542 (Corporations).
- **Marc estatal US**: Delaware General Corporation Law; Wyoming Business Corporation Act; New Mexico Limited Liability Company Act.
- **Marc espanyol**: Llei 35/2006 (LIRPF), arts. 8, 9, 87, 91; Llei 27/2014 (LIS), arts. 29.1, 100; Reial decret legislatiu 1/2010 (Llei de societats de capital); Llei 18/2022 (Llei Crea i Creix); Reial decret-llei 13/2022 (cotitzacions RETA per ingressos reals); Llei 5/2022 (sancionador Modelo 720 post STJUE C-788/19, 27/01/2022); RD 1065/2007 (Modelos 232 i 720); Convenció Espanya-EUA (BOE 22/12/1990 + Protocol 27/11/2019); <a href="https://petete.tributos.hacienda.gob.es">DGT V0290-20</a>.
- **Marc català**: Llei 12/2015 de cooperatives de Catalunya; Llei 5/2020 de mesures fiscals de la Generalitat (escala autonòmica IRPF).

Per a no residents, la LLC continua sent l'opció més comuna perquè combina protecció patrimonial, fiscalitat neta (0 % federal sense ETBUS) i càrrega administrativa baixa. La C-Corp es reserva per a qui busca capital institucional o sortida a borsa.

## Errors freqüents al triar vehicle

- **Pensar que la S-Corp és "una LLC millorada"**: no ho és. És una elecció fiscal exclusiva per a US persons. Si ets no resident, ni la consideris.
- **Constituir una C-Corp "perquè sona més seriós"** sense necessitat real de capital: pagues 21 % federal innecessàriament.
- **Convertir LLC a C-Corp sense assessorament**: si no es compleix IRC §351, dispara fets imposables immediats.
- **Triar Delaware "perquè és famós"** quan WY/NM costen cinc vegades menys en manteniment anual i aporten el mateix blindatge fiscal per a un freelancer no resident.

L'elecció correcta depèn del teu pla a 3-5 anys, no de la moda del fòrum del torn.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/serveis">Descobreix si una LLC és per a tu</a>
<!-- /exentax:calc-cta-v1 -->

A Exentax revisem el teu cas amb dades reals i et diem si compensa LLC, C-Corp o cap estructura US. <a href="/ca/agendar">Agenda una consulta gratuïta</a> de 30 minuts i sortim amb un pla clar.

<!-- exentax:execution-v2 -->
## Com ho resolem amb el mètode Exentax

El que veiem cada setmana en els casos que ens arriben és el mateix patró: el dubte es queda en idees soltes, la decisió s'ajorna i, quan arriba el tancament de l'exercici, es paguen més impostos dels necessaris o s'assumeixen riscos que no compensen. El problema gairebé mai és la norma; és la falta d'un pla per escrit amb números reals, signat per algú que entengui el teu cas de cap a cap.

**El que la gent fa malament**
- Copia estructures vistes a xarxes sense modelar el seu propi cas amb ingressos, residència i clients a la mà.
- Barreja diners personals amb els de l'activitat i perd la traça documental que qualsevol inspecció exigeix.
- Confia l'operativa a gestories que només omplen models, sense pensar en l'estratègia anual ni en el cost total.

**El que funciona de veritat**
- Modelar la teva situació a la <strong>calculadora Exentax</strong> abans de moure una sola peça, per veure el cost total anual i no només la factura d'avui.
- Separar des del primer dia els fluxos de diners, amb comptes diferents i una checklist viva de justificants.
- Treballar amb un assessor que miri les peces juntes: estructura, banca, compliment i residència — no cadascuna pel seu compte.

Si vols passar del dubte al pla, agenda 30 minuts amb Exentax i sortim de la trucada amb els números tancats i el calendari operatiu.
<!-- /exentax:execution-v2 -->


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
<p data-testid="cta-action-row">Necessites parlar-ho ja? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vinc%20de%20l%27article%20%22Difer%C3%A8ncia%20entre%20LLC%2C%20Corporation%2C%20S-Corp%20i%20C-Corp%22%20i%20vull%20parlar%20amb%20un%20assessor.">WhatsApp</a> i et responem avui mateix.</p>

Si el teu pla és muntar la LLC a Delaware, repassa la nostra pàgina de servei <a href="/ca/serveis/llc-delaware">LLC a Delaware</a> amb costos, terminis i pròxims passos concrets.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Comparem Nou Mèxic, Wyoming, Delaware i Florida sobre el teu cas real, sense vendre't l'estat de moda. <a href="/ca/serveis/llc-delaware">Comparar el meu cas amb un assessor</a>.
<!-- /exentax:cta-v1 -->
`;
