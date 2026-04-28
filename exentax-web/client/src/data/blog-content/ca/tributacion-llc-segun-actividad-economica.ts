export default `

Parlar de «fiscalitat de la LLC» en abstracte porta a errors greus: la fiscalitat real depèn molt estretament del **tipus d'activitat econòmica** que la LLC desenvolupa, perquè cada activitat activa regles diferents d'IVA, qualificació de rendes, font de la renda, conveni de doble imposició aplicable i, sobretot, exposició a la transparència fiscal internacional i a les regles antielusió. Vegem les cinc grans famílies que veiem a Exentax.

## Punts clau

### 1. Serveis professionals (assessoria, desenvolupament, disseny, màrqueting)

És el cas més comú i el més senzill. La seva LLC factura serveis a clients B2B internacionals (EUA, UE, Amèrica Llatina). Característiques:

- **Naturalesa de la renda**: activitat econòmica.
- **Qualificació a Espanya (resident)**: rendiment d'activitat econòmica imputable al soci (via atribució de rendes, vegi la <a href="/ca/blog/doctrina-administrativa-espanyola-sobre-la-llc-americana">doctrina DGT/TEAC</a>).
- **IVA**: facturació B2B amb client comunitari, **inversió del subjecte passiu** (el client autoliquida l'IVA al seu país); amb client dels EUA o altre tercer, **operació no subjecta** a l'IVA espanyol (regla de localització dels serveis B2B). Aprofundim a <a href="/ca/blog/iva-en-serveis-digitals-internacionals-quan-saplica-i-quan">IVA en serveis digitals internacionals</a>.
- **IRPF a Espanya**: rendiment net en base general (24-47 %).
- **Risc principal**: simulació si la substància operativa l'aporta exclusivament el soci resident a Espanya sense substància real als EUA.

**Optimització legítima**: maximitzar despeses deduïbles correctes a la LLC (programari, eines, subcontractació, formació, màrqueting). El net imputat al soci es redueix i el tipus mitjà efectiu cau substancialment respecte de l'autònom pur espanyol.

### 2. E-commerce físic (Amazon, Shopify, dropshipping)

Vostè ven béns físics a consumidors finals internacionals. Característiques:

- **Naturalesa de la renda**: activitat econòmica de venda.
- **IVA i duanes**: complex. Si ven a consumidors europeus, la LLC pot tenir obligació de **registre IVA** a països de la UE individualment o usar el **règim OSS / IOSS**. Si supera determinats llindars per país, ha de registrar-se localment. Marketplaces com Amazon actuen com a **deemed supplier** en molts casos i retenen l'IVA, però no en tots.
- **DAC7**: com a venedor a Amazon, Etsy o eBay europeus, Amazon Europa reportarà els seus ingressos a l'autoritat fiscal de Luxemburg, que els reenvia a la del país dels beneficiaris efectius. Vegi <a href="/ca/blog/dac7-el-nou-reporting-de-plataformes-digitals-el-2026">DAC7</a>.
- **Duanes**: si la LLC importa estoc a la UE per a distribució (FBA), necessita **EORI europeu**, importador oficial i possible IOR (Importer of Record).
- **Sales tax als EUA**: si ven a consumidors a estats amb economic nexus, possible obligació de registre i recaptació de sales tax. Més a <a href="/ca/blog/vendre-a-amazon-amb-la-teva-llc-americana-guia-completa">Amazon i e-commerce amb LLC</a>.

**Risc principal**: ignorar l'IVA UE o el sales tax dels EUA pot generar una factura retroactiva molt important.

### 3. SaaS i subscripcions digitals

Vostè ven accés a programari o contingut digital, B2C o B2B, en subscripció o pagament únic. Característiques:

- **Naturalesa de la renda**: activitat econòmica + cessió d'ús de programari (frontera amb royalties).
- **Serveis prestats per via electrònica (TBE)**: si ven a consumidors europeus, subjectes a IVA al país del consumidor. Règim **OSS no UE** (la LLC es registra en un Estat membre d'identificació) o ús de plataformes que actuen com a Merchant of Record (Paddle, FastSpring, DoDo Payments, Lemon Squeezy) que es fan càrrec de l'IVA per vostè.
- **B2B**: regla general d'inversió del subjecte passiu.
- **Qualificació de la renda a Espanya**: rendiments d'activitat econòmica si hi ha desenvolupament actiu; si el que cedeix és llicència passiva sobre codi preexistent sense activitat operativa rellevant, pot haver-hi discussió sobre **transparència fiscal internacional** (art. 100 LIS, via art. 91 LIRPF).
- **Risc CFC/TFI**: si la LLC genera principalment rendes passives (llicències) i no disposa de mitjans materials i humans als EUA, l'AEAT pot aplicar la transparència fiscal internacional.

Més detall a <a href="/ca/blog/llc-americana-per-a-desenvolupadors-de-programari-i">LLC per a desenvolupadors de programari i SaaS</a>.

### 4. Royalties i propietat intel·lectual

La seva LLC titularitza drets (marca, programari, contingut) i els llicencia a tercers o a una altra entitat relacionada. Característiques:

- **Naturalesa de la renda**: rendes passives (royalties).
- **Qualificació CDI**: art. 12 CDI Espanya-EUA (royalties). Generalment, l'Estat de la font pot gravar (amb el límit del % CDI), i l'Estat de residència grava amb deducció.
- **Risc CFC**: alt. Les rendes passives són el supòsit típic de transparència fiscal internacional. Si la seva LLC té majoritàriament rendes passives, vostè autònom la controla i resideix a Espanya, l'art. 91 LIRPF (remissió a l'art. 100 LIS) es pot activar.
- **Tributació efectiva**: si s'aplica TFI, tributa a Espanya com si les rendes fossin seves directes, amb deducció de qualsevol impost pagat per la LLC (típicament 0$ federal en Disregarded Entity).
- **Clàusula LOB CDI 2019**: dificulta l'accés als beneficis del CDI a estructures híbrides o sense substància.

**Conclusió**: una LLC pura de royalties amb soci resident espanyol s'ha de dissenyar amb substància real (mitjans materials, personal, decisions preses als EUA) o reconèixer que estarà sota TFI.

### 5. Trading (accions, futurs, criptomonedes)

La seva LLC opera els mercats financers amb compte a Interactive Brokers, Tradovate o Kraken. Característiques:

- **Naturalesa de la renda**: depèn de l'actiu i del règim. Trading FX i futurs: guanys i pèrdues patrimonials a molts països; a Espanya, si és habitual i professional, es pot requalificar com a activitat econòmica.
- **Accions**: dividends (rendiment del capital mobiliari en base d'estalvi 19-28 % si entitat opaca; si transparent, imputació directa) i guanys per venda (base d'estalvi).
- **Cripto**: guanys i pèrdues patrimonials (base d'estalvi) o activitat econòmica si trading freqüent i professional.
- **DAC8**: aplica recentment si opera amb exchanges europeus. Vegi <a href="/ca/blog/dac8-i-criptomonedes-el-nou-reporting-fiscal-automatic-el">DAC8 i criptomonedes</a>.
- **Risc CFC**: molt alt. Els rendiments de cartera són l'exemple paradigmàtic de renda passiva sotmesa a TFI.
- **Conveni**: art. 10 (dividends), art. 11 (interessos), art. 13 (guanys de capital). Les clàusules LOB del Protocol 2019 són especialment restrictives per a estructures d'inversió sense substància.

Més detall a <a href="/ca/blog/criptomonedes-i-trading-amb-llc-guia-fiscal-completa-per-a">criptomonedes i trading amb LLC</a>.

### Quadre resum per activitat

| Activitat | Qualificació Espanya (típica) | IVA | Risc CFC/TFI | Risc simulació | Idoneïtat LLC pura |
| --- | --- | --- | --- | --- | --- |
| Serveis professionals B2B | Activitat econòmica imputada | Inversió subjecte passiu | Baix | Mitjà | Alta |
| E-commerce | Activitat econòmica imputada | Complex (OSS/IOSS, sales tax) | Baix | Mitjà | Alta amb cura |
| SaaS B2B | Activitat econòmica imputada | Inversió subjecte passiu | Mitjà | Mitjà | Alta |
| SaaS B2C TBE | Activitat econòmica imputada | OSS no UE / MoR | Mitjà-alt | Mitjà | Mitjana-alta |
| Royalties | Renda passiva | Generalment exempt o ISP | Alt | Alt | Baixa sense substància |
| Trading financer | Rendes passives / guanys de capital | n/a | Molt alt | Alt | Baixa sense substància |

### Com decidir la seva estructura òptima

L'elecció de LLC sense més no és sempre la resposta correcta. Per a activitats de baix risc CFC (serveis, e-commerce, SaaS B2B), una **Single-Member LLC** amb soci resident espanyol, declarant bé i amb substància raonable, és eficient i defensable. Per a activitats d'alt risc CFC (royalties, trading), o es dota la LLC de **substància real als EUA** o es considera estructurar d'una altra manera (S.L. espanyola operativa + LLC amb activitat limitada, planificació de residència, etc.). Marc complet a <a href="/ca/blog/disseny-duna-estructura-fiscal-internacional-solida-marc-pas">disseny d'estructura internacional sòlida</a>.

### Errors típics per activitat

- **Serveis**: oblidar-se de l'IVA intracomunitari i el registre ROI/VIES.
- **E-commerce**: ignorar OSS/IOSS i el sales tax dels EUA fins que arriba la liquidació.
- **SaaS**: no usar Merchant of Record i acabar amb obligació de registre IVA a cada país de la UE.
- **Royalties**: no documentar la creació, titularitat i manteniment dels actius intangibles.
- **Trading**: confondre trading personal amb trading des de la LLC i barrejar comptes.

Més sobre com evitar errors típics a <a href="/ca/blog/riscos-fiscals-duna-mala-estructuracio-internacional">riscos fiscals</a>.

### En resum

Una LLC no tributa «d'una sola manera»: tributa segons el que fa, on ho fa i des d'on es controla. La conversa seriosa de planificació fiscal comença per entendre la seva activitat real, no per triar un país en un mapa.

<!-- exentax:cross-refs-v1 -->
## Sobre el mateix tema

- [Tributació pass-through per a LLC: com funciona i per què és important](/ca/blog/tributacio-pass-through-per-a-llc-com-funciona-i-per-que)
- [Fiscalitat LLC per país de residència: el que es paga i on es paga](/ca/blog/fiscalitat-llc-per-pais-de-residencia-el-que-es-paga-on-es)
- [Deduccions fiscals per a la teva LLC: què pots deduir i com](/ca/blog/deduccions-fiscals-per-a-la-teva-llc-que-pots-deduir-i-com)
<!-- /exentax:cross-refs-v1 -->

Abans de continuar, posa números al teu cas: la <a href="/ca#calculadora">calculadora Exentax</a> compara, en menys de 2 minuts, la teva càrrega fiscal actual amb la que tindries operant una LLC nord-americana ben declarada al teu país de residència.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/serveis">Comença avui, 100% online</a>
<!-- /exentax:calc-cta-v1 -->

Vol que analitzem com tributa exactament la seva activitat i que li dissenyem l'estructura més eficient i defensable? Reservi la seva consulta gratuïta.

Per continuar aprofundint, <a href="/ca/blog/per-que-els-freelancers-espanyols-estan-deixant-lautonom-per">Per què deixar de ser autònom a Espanya (i quines alternatives té)</a> complementa el que acabem de veure amb detalls que mereixien el seu propi article.

<!-- exentax:cta-mid -->
**Abans de constituir una LLC per a la seva activitat, vegi com treballem.** <a href="/ca/com-treballem">La nostra metodologia</a> detalla què revisem i en quin ordre, des del diagnòstic d'activitat fins al routing d'IVA i CFC més adequat.

<!-- exentax:cta-final -->
**Parlem del seu cas, no del manual.** Reservi 30 minuts i adaptem «Tributació de la LLC segons l'activitat econòmica» a la seva activitat concreta.

<!-- exentax:legal-refs-v1 -->
## Referències: fonts tècniques i normativa aplicable

Les xifres, models i llindars esmentats s'extreuen de les referències següents, actualment vigents:

- **Tributació de l'activitat.** IRC §864 i §882 (efectivament connectat amb activitat als EUA, ECI), Treas. Reg. §301.7701-3 (classificació de la LLC) i Form 5472 + 1120 pro-forma per a LLC unipersonals no residents.
- **IVA i vendes internacionals.** Directiva 2006/112/CE de l'IVA, Reglament d'Execució 282/2011, règim OSS/IOSS i Finestreta Única per a serveis digitals B2C a la UE; instruccions del Modelo 369 de l'AEAT.
- **Plataformes marketplace.** Termes publicats per Amazon Seller Central (inclòs el VAT Calculation Service i la responsabilitat sobre l'IVA a la UE conforme l'art. 14 bis Directiva 2006/112), Stripe Tax, Paddle (Merchant of Record), DoDo Payments i PayPal Business.
- **DAC7.** Directiva (UE) 2021/514 de cooperació administrativa en plataformes digitals, transposada a l'ordenament espanyol pel RD 117/2024.
- **Espanya residents.** Llei 35/2006 LIRPF (art. 100 TFI), Llei 27/2014 LIS i Llei 37/1992 de l'IVA.

Informació divulgativa; el tractament concret depèn del país de residència del titular i del país dels seus clients.

<!-- exentax:execution-v2 -->
## Tributació de la LLC segons l'activitat econòmica: per què un SaaS, una agència i un e-commerce no són el mateix

La fiscalitat federal dels EUA per a una LLC de no resident no depèn només de la seva residència, depèn també de què fa la LLC. La regla «non-effectively connected = 0 %» no és uniforme: l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> aplica regles de sourcing diferents segons el tipus de renda, i això classifica la seva LLC com a ETBUS (engaged in trade or business in US) o com a passive foreign vehicle. Aquí té com es veu cada activitat típica.

- **SaaS i programari (subscripcions digitals).** Renda classificada com a business income, sourced segons on es desenvolupa i s'opera el programari. Si el founder no resideix als EUA i els servidors no són obligatòriament dels EUA (cloud regional indistint), default = foreign-source income → 0 % federal. Risc: si contracta dependent agent als EUA (VP of Sales assalariat als EUA, no contractor independent), passa a ETBUS.
- **Agència digital (serveis professionals).** Renda classificada com a personal services income, sourced on es presten els serveis físicament. Si vostè autònom és a Espanya treballant per a clients dels EUA, la font és Espanya (on es realitza el servei), NO els EUA, encara que el client sigui dels EUA. Default: 0 % federal. Excepció: si el seu equip és als EUA o té office als EUA, sourcing US i passa a ETBUS.
- **E-commerce (productes físics).** Triple anàlisi: (1) Inventari als EUA (Amazon FBA, 3PL US): pot crear ETBUS segons substància. (2) Inventari fora dels EUA dropshipped als EUA: usualment foreign-source i 0 %. (3) Marketplaces (Amazon Seller US): cobra ja net d'impostos sales tax retinguts per Amazon, però l'income federal segueix el seu sourcing. FBA + dependent agent = risc ETBUS molt alt.
- **Inversió i trading (capital gains, dividends).** Plusvàlues de borsa dels EUA per a LLC de no resident: 0 % federal per excepció específica (capital gains de portfolio investment exempts per a no residents sense trade or business). Dividends US: 30 % retenció per defecte, reduïda a 15 %/0 % sota treaty amb W-8BEN-E. Cripto: tractada com a property, mateixes regles que capital gains; foreign-source i 0 % si no és ETBUS.

### El que més ens pregunten

**Si venc cursos digitals a clients dels EUA, és US-source income?** No per defecte. Els cursos digitals són personal services + intellectual property licence, sourced on es desenvolupen (la seva residència). Vendre a un client dels EUA no converteix la renda en US-source. Continua sent 0 % federal si no hi ha ETBUS.

**Amazon FBA em converteix automàticament en ETBUS?** Hi ha debat tècnic. Posició conservadora: sí, perquè l'inventari al warehouse Amazon US es pot interpretar com a dependent agent + fixed place of business. Posició més permissiva: depèn del control efectiu. La pràctica seriosa és assumir ETBUS i planificar en conseqüència o canviar a fulfillment fora dels EUA.

A Exentax modelem cada activitat per regles de sourcing i test ETBUS abans de constituir, per no descobrir al cap de dos anys que paga 21 % federal quan creia 0 %.
<!-- /exentax:execution-v2 -->

## L'hi muntem sense que perdi un cap de setmana

Milers de freelancers i emprenedors ja operen amb la seva LLC americana de manera 100 % legal i documentada. A Exentax ens encarreguem de tot el procés: constitució, banca, passarel·les de pagament, comptabilitat, declaracions IRS i compliance al seu país de residència. Reservi una assessoria gratuïta i li direm amb sinceritat si la LLC té sentit per al seu cas, sense promeses absolutes.

_Per ampliar en la mateixa sèrie: [Riscos fiscals d'una mala estructuració internacional](/ca/blog/riscos-fiscals-duna-mala-estructuracio-internacional)._

<!-- related-inline-stripped-2026-04 -->

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
<p data-testid="cta-action-row">Necessita parlar-ne ja? Escrigui'ns per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vinc%20de%20l'article%20%22tributacion%20llc%20segun%20actividad%20economica%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i li responem avui mateix.</p>

Si vols veure tot el procés amb detall, repassa la nostra <a href="/ca/serveis">pàgina de serveis</a> amb tot el que incloem.

<!-- exentax:conv-fill-v1 -->
O truca'ns directament al <a href="tel:+34614916910">+34 614 916 910</a> si prefereixes parlar.

Per a detalls per estat, consulta la nostra <a href="/ca/serveis/llc-wyoming">pàgina del servei LLC a Wyoming</a> amb costos i terminis tancats.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Constitució, EIN, BOI, banca i manteniment: un sol equip que entén el teu cas de cap a peus. <a href="/ca/serveis">Veure tots els serveis</a>.
<!-- /exentax:cta-v1 -->

`;
