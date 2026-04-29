export default `Wise converteix USD a EUR amb un spread mitjà del 0,41 %, Mercury voreja l'1 % i un banc espanyol tradicional pot endur-se entre el 2 % i el 4 % en cada operació.

La teva LLC factura en dòlars, però el lloguer a Barcelona, Girona o Tarragona es paga en euros. Entre les dues monedes hi ha el canvi, i és just aquí on la majoria de nous propietaris de LLC perden diners cada mes sense adonar-se'n.

La forma en què converteixes aquestes divises pot costar-te centenars o milers de dòlars a l'any, o pràcticament res, si uses les eines correctes.

## El problema amb els bancs tradicionals

Quan el teu banc local rep una transferència en dòlars, la converteix a la teva moneda local aplicant:

- Un **tipus de canvi amb marge** (1-3% pitjor que el tipus real)
- **Comissions de recepció** ($15-50 per transferència SWIFT)
- **Comissions del banc intermediari** ($10-25 addicionals)

En total, pots perdre **3-5% en cada transferència**. Si mous $5,000 al mes, això són $150-250 al mes en costos ocults. més de **$2,000 a l'any**.
## Les millors opcions per canviar divises

### 1. Wise Business (la favorita)

Wise ofereix el tipus de canvi real (mid-market rate) més una comissió transparent i baixa.

- **Comissió:** 0.4-1.5% segons el parell de divises
- **Tipus de canvi:** Real, sense marge ocult
- **Velocitat:** 1-2 dies hàbils
- **Avantatge:** Veus exactament quant rebràs abans d'enviar

### 2. Mercury (directe des del teu compte)

Mercury permet enviar wires internacionals amb $0 de comissió. sí, gratis. Però si la transferència implica conversió de divisa, el tipus de canvi no és tan competitiu com Wise.

- **Comissió wire:** $0 (enviament i recepció, nacionals i internacionals)
- **Tipus de canvi:** Amb marge si converteixes divisa (menor que bancs tradicionals)
- **Velocitat:** 1-5 dies hàbils
- **Millor per a:** Transferències en USD sense conversió, o transferències grans i puntuals

### 3. Airwallex

Airwallex és una plataforma global de pagaments que permet obrir comptes multi-divisa i rebre pagaments en monedes locals de més de 60 països.

- **Comissió de conversió:** Competitiva, amb marge baix sobre el tipus interbancari
- **Velocitat:** 1-2 dies hàbils
- **Avantatge:** Comptes locals en múltiples països, els teus clients et paguen com si fossis local

### 4. Sokin

Sokin s'especialitza en pagaments internacionals amb tarifes planes, la qual cosa pot resultar més econòmica per a volums alts.

- **Tarifa plana:** Sense comissions percentuals en moltes rutes
- **Ideal per a:** Negocis amb transferències freqüents i imports consistents

### 5. Targeta Wise o Wallester

Si necessites gastar en moneda local sense convertir manualment, les targetes de dèbit amb conversió automàtica són una opció excel·lent.

- **Wise Card:** Converteix al tipus de canvi real quan pagues. Sense sorpreses.
- **Wallester:** Targetes virtuals i físiques vinculades a comptes multi-divisa. Molt popular entre emprenedors europeus per les seves integracions.

### 6. PayPal (evitar per a conversions)

PayPal aplica un marge del 3-4% sobre el tipus de canvi. És la pitjor opció per convertir divises. Si reps pagaments a PayPal, transfereix els dòlars a Mercury primer i converteix des de Wise.
### Flux recomanat

El flux més eficient per a la majoria dels propietaris de LLCs:

1. **Cobres en USD** → Mercury (compte de la LLC)
2. **Transfereixes USD a Wise** → ACH gratis de Mercury a Wise
3. **Converteixes a Wise** → al tipus de canvi real
4. **Envies al teu compte local** → SEPA (Europa) o transferència local

Aquest flux minimitza les comissions i maximitza el tipus de canvi.
### Comparativa ràpida

| Mètode | Tipus de canvi | Comissió | Cost total estimat |
|---|---|---|---|
| Wise Business | Real | 0.4-1.5% | 0.4-1.5% |
| Mercury wire | Amb marge (si converteix) | $0 wire fee | 0-1.5% |
| Banc tradicional | Amb marge | $15-50 + intermediaris | 3-5% |
| PayPal conversió | Amb marge 3-4% | Variable | 4-6% |

Unes lectures veïnes per tenir obertes al costat d'aquesta: <a href="/ca/blog/iban-swift-i-routing-number-entendre-els-codis-bancaris">IBAN, SWIFT i routing number: entendre els codis bancaris internacionals</a> i <a href="/ca/blog/vendre-a-amazon-amb-la-teva-llc-americana-guia-completa">Vendre a Amazon amb la teva LLC americana: guia completa</a>, que afinen precisament els marges del que explica aquesta guia.
### Consells per estalviar en canvi de divises

- **Consolida les teves retirades**: fes una o dues transferències grans al mes en lloc de moltes petites
- **Usa Wise sempre que puguis**: el tipus de canvi és significativament millor
- **Evita conversions de PayPal**: treu els diners en dòlars i converteix a Wise
- **Compara abans d'enviar**: les comissions varien segons l'import i la divisa

Si vols optimitzar la forma en què mous diners entre la teva LLC i el teu compte personal, agenda una assessoria gratuïta. T'ajudem a configurar el flux més eficient per al teu cas.

A Exentax assessorem cada setmana clients catalans sobre la millor manera de passar USD a EUR. Reserva la teva assessoria gratuïta i et mostrem com transferir 10.000 $ al mes sense deixar centenars d'euros pel camí.
## Arquitectura bancària equilibrada: Mercury, Relay, Slash i Wise

No existeix el compte perfecte per a una LLC. Existeix l'**arquitectura** correcta, on cada eina cobreix un rol:

- **Mercury** (operada com a fintech amb bancs associats (Choice Financial Group i Evolve Bank & Trust principalment; Column N.A. en comptes heretats), FDIC via sweep network fins al límit vigent). Compte principal operatiu per a no residents amb bona UX, ACH i wires. Continua sent una de les opcions més provades per obrir des de fora dels EUA.
- **Relay** (recolzada per Thread Bank, FDIC). Excel·lent com a **compte de respatller** i per a "envelope budgeting": permet crear fins a 20 subcomptes i 50 targetes de dèbit, integració profunda amb QuickBooks i Xero. Si Mercury bloqueja o demana revisió KYC, Relay evita que la teva operativa s'aturi.
- **Slash** (recolzada per Column N.A. (banc amb llicència federal, FDIC)). Banca dissenyada per a operadors online: emissió instantània de targetes virtuals per proveïdor, controls de despesa granulars, *cashback* en publicitat digital. Complement natural quan gestiones Meta Ads, Google Ads o subscripcions SaaS.
- **Wise Business** (EMI multidivisa, no és banc). Per cobrar i pagar en EUR, GBP, USD i altres divises amb dades bancàries locals i conversió a *mid-market rate*. No substitueix un compte US real, però és imbatible per a tresoreria internacional.
- **Wallester / Revolut Business.** Wallester aporta targetes corporatives amb BIN propi per a alt volum. Revolut Business funciona com a complement europeu, no com a compte principal de la LLC.
La recomanació realista: **Mercury + Relay com a respatller + Slash per a operativa publicitària + Wise per a tresoreria FX**. És la configuració que minimitza el risc de bloqueig i redueix el cost real. A Exentax obrim i configurem aquesta arquitectura com a part de la constitució.

<!-- exentax:banking-facts-v1 -->
## Fets bancaris i fiscals a precisar

La informació sobre fintech i CRS evoluciona; aquest és l'estat actual:

<!-- exentax:lote30-native-v1:cambiar-divisas-llc-mejores-opciones-ca -->
## Com llegir la conversió de divises a la LLC com un mapa operatiu estable en lloc d'una decisió puntual de mercat

La conversió de divises a la LLC es llegeix de manera més útil com un mapa operatiu estable entre la divisa dels clients, la divisa del compte operatiu i la divisa del país de residència del beneficiari, en lloc d'una decisió puntual de mercat. El mapa no canvia amb la cotització del dia.
<!-- /exentax:lote30-native-v1:cambiar-divisas-llc-mejores-opciones-ca -->

Abans de continuar, posa números al teu cas: la <a href="/ca#calculadora">calculadora Exentax</a> compara, en menys de 2 minuts, la teva càrrega fiscal actual amb la que tindries operant una LLC nord-americana ben declarada al teu país de residència.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

### Notes per proveïdor

- **Mercury** opera amb diversos bancs associats amb llicència federal i cobertura **FDIC** via sweep network: principalment **Choice Financial Group** i **Evolve Bank & Trust**, i encara **Column N.A.** en alguns comptes heretats. Mercury no és un banc; és una plataforma fintech recolzada per aquests partner banks. Si Mercury tanca un compte, el saldo es retorna normalment **mitjançant xec en paper a l'adreça registrada del titular**, fet que pot ser un problema operatiu seriós per a no residents; convé mantenir un compte secundari (Relay, Wise Business, etc.) com a contingència.
- **Wise** té dos productes clarament diferents: **Wise Personal** i **Wise Business**. Per a una LLC s'ha d'obrir **Wise Business**, no el personal. Matís important de CRS: una **Wise Business titularitat d'una LLC dels EUA queda fora del CRS** perquè la titular és una entitat dels EUA i els EUA no són jurisdicció CRS; el costat USD opera via Wise US Inc. (perímetre FATCA, no CRS). En canvi, una **Wise Personal oberta per un individu resident fiscal a Espanya** o una altra jurisdicció CRS **sí genera reporte CRS** via Wise Europe SA (Bèlgica) sobre aquest individu. Obrir Wise per a la teva LLC no t'inclou al CRS per la LLC; una Wise Personal separada al teu nom com a resident en CRS, sí.
- **Wallester** (Estònia) és una entitat financera europea amb llicència EMI/banc emissor de targetes. Els seus comptes IBAN europeus **estan dins de l'Estàndard Comú de Comunicació (CRS)** i, per tant, generen intercanvi automàtic d'informació cap a l'administració fiscal del país de residència.
- **Payoneer** opera mitjançant entitats europees (Payoneer Europe Ltd, Irlanda) també **dins de l'àmbit CRS** per a clients residents en jurisdiccions participants.
- **Revolut Business**: quan s'associa a una **LLC nord-americana**, opera sota **Revolut Technologies Inc.** amb **Lead Bank** com a banc partner als EUA. El compte lliurat és un compte dels EUA (routing + account number); **no s'emet IBAN europeu** a una LLC. Els IBAN europeus (lituans, BE) són de **Revolut Bank UAB** i s'emeten a clients europeus del grup. Si li ofereixen un IBAN europeu associat a la seva LLC, confirma a quina entitat jurídica està associat i sota quin règim reporta.
- **Tributació zero**: cap estructura LLC aconsegueix "zero impostos" si vius en un país amb regles CFC/transparència fiscal o atribució de rendes. El que s'aconsegueix és **no duplicar tributació** i **declarar correctament a residència**, no eliminar-la.
## T'ho muntem sense que perdis un cap de setmana

Milers de freelancers i emprenedors ja operen amb la seva LLC americana de manera 100% legal i documentada. A Exentax ens encarreguem de tot el procés: constitució, banca, passarel·les de pagament, comptabilitat, declaracions <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> i compliance al teu país de residència. Reserva una assessoria gratuïta i et direm amb sinceritat si la LLC té sentit per al teu cas, sense promeses absolutes.<!-- exentax:execution-v2 -->
## L'estratègia FX que recomanem a Exentax per a una LLC operativa

El canvi de divisa no és un detall: en una LLC que factura 8.000 USD/mes, una mala estratègia FX es menja entre 800 i 1.500 USD l'any. La majoria de propietaris es queden amb la primera opció que els va suggerir Mercury sense comparar. Aquests són els criteris i eines que apliquem a Exentax.

- **Wise com a router per defecte.** Wise converteix al tipus mitjà interbancari amb comissió transparent (0,3-0,7 % en USD-EUR) i allibera fons en compte local del país destí. Per a fluxos USD a EUR/MXN/COP/CLP, és l'estàndard. Convé tenir comptes personal i d'empresa Wise vinculats per moure entre LLC i butxaca personal sense SWIFT.
- **Brokers FX per a volum alt.** A partir de 20.000 USD/mes en conversions, OFX, CurrencyFair, Lightspark o Revolut Business milloren l'spread de Wise fins a 0,2 punts. Compensa a partir de 250.000 USD anuals; per sota, l'estalvi no justifica la fricció operativa.
- **Conversió per fites, no per necessitat.** Convertir el sou mensual sencer el dia que entra és la pitjor estratègia: exposa al pitjor tipus del mes. Acumular en USD i convertir en 4-6 lots mensuals aplana el tipus mitjà efectiu.
- **Cobertura natural quan aplica.** Si tens despeses USD recurrents (Meta ads, AWS, fees de Stripe, SaaS), mantén-les en USD des del compte de la LLC en lloc de pagar amb targeta personal en EUR - elimines dues conversions mensuals innecessàries.

### El que més ens pregunten

**Mercury converteix car?** Sí: l'spread FX directe de Mercury està al voltant de l'1 % més comissió, cosa que duplica el cost real davant de Wise. S'utilitza Mercury com a compte operatiu USD; les conversions es desvien via Wise per minimitzar cost.

**Com justifico davant Hisenda els moviments entre Mercury i Wise personal?** Com a retirades de soci si la LLC és transparent, documentades al llibre de tresoreria. La traçabilitat pesa més que l'operació en si: cada conversió ha de poder explicar-se contra una sortida Mercury i una entrada Wise.

A Exentax deixem dissenyada la cadena completa Mercury → Wise empresa → Wise personal amb normes de timing i llindars per moneda, perquè l'estalvi es materialitzi sense pensar-hi.
<!-- /exentax:execution-v2 -->

## Referències: fonts sobre estructures i jurisdiccions

Les comparatives i dades quantitatives sobre les jurisdiccions citades es basen en fonts oficials actualitzades a avui:

- **Estats Units.** Delaware General Corporation Law i Limited Liability Company Act, Wyoming Limited Liability Company Act (Title 17, Chapter 29), instruccions de l'IRS per al Form 5472 i IRC §7701 (classificació d'entitats).
- **Andorra.** Llei 95/2010 de l'Impost sobre Societats (IS al 10%), Llei 5/2014 del IRPF i règim de residència activa/passiva del Govern d'Andorra.
- **Estònia.** Income Tax Act estonià (impost diferit sobre beneficis distribuïts al 20/22%) i documentació oficial del programa e-Residency.
- **Espanya.** Llei 27/2014 (IS), Llei 35/2006 (IRPF, arts. 8-9 sobre residència i art. 100 sobre TFI) i règim especial d'impatriats (art. 93 LIRPF, "Llei Beckham").
- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Pilar Dos (GloBE) i Model de Conveni OCDE amb Comentaris.

L'elecció de jurisdicció depèn sempre de la residència fiscal real del titular i de la substància econòmica de l'activitat; revisa el teu cas específic abans de qualsevol decisió estructural.

_Per ampliar en la mateixa sèrie: [LLC als Estats Units: guia completa per a no residents](/ca/blog/llc-estats-units-guia-completa-no-residents-2026)._

<!-- related-inline-stripped-2026-04 -->

<!-- exentax:cross-refs-v1 -->
## Per continuar la lectura

- [Wise, bancs i LLC: l'arquitectura bancària completa que ningú no t'explica](/ca/blog/wise-bancs-i-llc-la-stack-bancaria-completa-que-ningu-no)
- [Wise, IBAN i LLC: què es reporta realment a Hisenda i què no](/ca/blog/wise-iban-i-llc-que-es-reporta-realment-a-hisenda)
- [ACH vs transferència bancària: terminis i impacte en el flux de la LLC](/ca/blog/ach-vs-transferencia-bancaria-terminis-de-pagament-i-impacte)
<!-- /exentax:cross-refs-v1 -->

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

<!-- exentax:cta-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22La%20teva%20LLC%20factura%20en%20d%C3%B2lars%2C%20per%C3%B2%20el%20lloguer%20a%20Barcelona%2C%20Girona%20o%20Tarragon%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.

<!-- exentax:conv-fill-v1 -->
O truca'ns directament al <a href="tel:+34614916910">+34 614 916 910</a> si prefereixes parlar.

Per a detalls per estat, consulta la nostra <a href="/ca/serveis/llc-wyoming">pàgina del servei LLC a Wyoming</a> amb costos i terminis tancats.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

`;
