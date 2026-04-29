export default `Els Estats Units no van signar el CRS del 2014, i FATCA només intercanvia amb Espanya — sota el Model 1 IGA — informació parcial de comptes de persones físiques, no del compte operatiu de la teva LLC.

És la pregunta que més es repeteix quan un client tanca la seva LLC amb nosaltres: "Mercury, Wise o Slash li expliquen a Hisenda el que tinc?". La resposta curta no la sol donar ningú amb claredat. Aquí va: **un compte financer obert als Estats Units per una LLC de no resident no s'intercanvia automàticament amb la teva Hisenda local**. I aquest punt, ben entès, és un dels pilars que fan que una estructura LLC ben dissenyada funcioni amb la discreció professional i l'ordre que se n'espera.

Això no vol dir "amagar". Vol dir que la teva estructura està muntada en una jurisdicció que opera amb les seves pròpies regles, i que el teu compliance és el que tu decideixes fer al teu país, sense sorpreses externes.

## El que la gent es pensa que passa (i no passa)

> "Si Mercury és americà i jo sóc europeu, els meus saldos acaben a l'AEAT per algun acord automàtic."

Fals. T'ho expliquem amb el marc real, no amb el marc de la por.
## Com funciona l'intercanvi internacional d'informació (els fets)

Hi ha dos sistemes globals que es confonen constantment. Convé separar-los.

### CRS (Common Reporting Standard)

És l'estàndard de l'<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>. Més de 100 països l'apliquen. Els seus bancs identifiquen comptes de no residents i reporten saldos i rendes a les autoritats fiscals del país de residència del titular.

**Els Estats Units no participen al CRS. No són signataris. No reporten CRS. No reben CRS.**

Qualsevol institució financera 100 % nord-americana, en obrir un compte a una LLC US, queda fora del circuit CRS. No hi ha flux automàtic cap al teu país.

### FATCA

És la llei nord-americana. Va en una sola direcció: obliga els bancs estrangers (europeus, asiàtics, llatinoamericans) a reportar a l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> els comptes de **US persons** (ciutadans i residents fiscals nord-americans).

FATCA **no exporta automàticament dades de comptes US a la Hisenda local d'un resident europeu o llatinoamericà**. És un sistema de reporting cap als Estats Units, no des dels Estats Units. Alguns països van signar IGAs recíprocs en teoria, però a la pràctica el flux des de l'IRS cap a hisendes estrangeres a nivell compte per compte de persones físiques no US és inexistent per al perfil típic d'un titular d'una LLC.
## Mercury, Slash i Relay: institucions US, fora del CRS

Les tres són fintechs registrades als EUA amb bancs US com a custodis:

- **Mercury** opera amb Choice Financial Group, Column NA i Evolve Bank & Trust com a bancs associats.
- **Slash** opera com a compte corporatiu US amb producte de tresoreria en bons del Tresor i rendiment competitiu.
- **Relay** opera amb Thread Bank com a custodi.

Totes tres són institucions financeres nord-americanes. **Totes tres estan fora del CRS** perquè els EUA no hi participen. Compleixen amb les seves obligacions de reporting a l'IRS (formularis 1099 quan aplica, etc.), però no envien informació automàtica a l'AEAT, al SAT, al SII xilè ni a la DGI argentina.

El que això significa, en termes pràctics: **el saldo de la teva LLC a Mercury no es creua automàticament amb el teu IRPF**. La traçabilitat existeix, però es manté dins del sistema US.
### Wise: el matís important

Wise opera amb diverses entitats en jurisdiccions diferents. Això és el que canvia el reporting:

- **Wise US Inc.** (compte US per a LLCs americanes, IBAN/ACH/wire en USD): és entitat nord-americana. **Està fora del CRS.** Igual que Mercury.
- **Wise Europe SA** (compte multidivisa europeu amb IBAN belga): és entitat UE. Sí que entra dins del CRS i reporta saldos al país de residència fiscal del titular.

Per a una LLC oberta avui amb Wise Business i residència operativa als EUA, el compte principal va per Wise US Inc. Això et deixa fora del CRS per a aquest compte. Si a més operes el compte multidivisa europeu, llavors aquí sí que hi ha reporting CRS sobre aquesta part.

**Conclusió neta: Wise US Inc. no reporta CRS. Wise Europe SA sí.** Saber-ho et permet estructurar l'operativa amb criteri.
### Wallester: cas diferent, cal dir-ho clar

Wallester és emissor europeu de targetes (Estònia/UE). Està dins del marc CRS europeu. Quan emets targetes Wallester lligades a un compte operatiu, el reporting del compte subjacent depèn d'on estigui aquest compte. Si connectes Wallester a un compte US (Mercury, Wise US, Relay), el compte continua fora del CRS; si el connectes a un compte EMI europeu, entra al circuit CRS.

És una eina operativa potent, però cal dissenyar-la sabent quina entitat emet cada peça.
### Passarel·les de pagament: Stripe, PayPal, Whop, Hotmart, Adyen

Les passarel·les no són comptes bancaris. Són processadors de transaccions que liquiden al compte bancari que els indiquis. **No estan dins del CRS** i no reporten saldos. Reporten fluxos al fisc de la seva jurisdicció quan la normativa ho exigeix (1099-K als EUA per a Stripe US, per exemple), però els fons viuen al teu compte bancari, no a la passarel·la.

Una LLC que cobra per Stripe US i liquida a Mercury opera tot el cicle dins del sistema financer nord-americà. Net, eficient, sense reporting CRS automàtic cap al teu país.
### Accedir a informació d'una LLC US: com és realment

Una LLC ben constituïda a Wyoming, Nou Mèxic o Delaware té **anonimat registral**:

- El propietari no consta en registres públics.
- El **registered agent** figura com a punt de contacte legal.
- El **BOI Report** (<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>) identifica el beneficial owner davant del regulador federal, **no davant del públic** ni davant d'hisendes estrangeres de manera automàtica.

Que una autoritat estrangera vulgui saber qui hi ha darrere d'una LLC requereix una sol·licitud formal per canals bilaterals (assistència mútua, requeriment judicial). No és automàtic, no és trivial i no es fa per curiositat. Això és el que a la pràctica protegeix l'operativa d'un client Exentax que té la LLC ben estructurada.
### DAC7 i DAC8: directives europees, no apliquen als EUA

DAC7 (plataformes digitals) i DAC8 (cripto) són directives de la Unió Europea. Imposen obligacions a plataformes i exchanges amb presència europea, no a una LLC americana ni als seus comptes US. La teva LLC no entra a DAC7 ni a DAC8 pel fet d'existir o per operar amb clients internacionals.

Com a resident fiscal europeu tens les teves pròpies obligacions declaratives (Model 720/721 a Espanya, equivalents a Portugal, França, Alemanya), i això ho gestiones al teu ritme i amb el teu assessor local. La LLC no afegeix ni treu aquí: hi afegeixes l'actiu si supera el llindar, el declares, segueixes operant.
## El que veiem cada setmana a Exentax

Tres patrons reals:

**1. El client que arriba amb por**: porta anys llegint a YouTube que "et trobaran" i obre la conversa demanant perdó per avançat. Li mostrem com és el sistema de veritat: compte US fora del CRS, FATCA bilateral però sense flux compte a compte cap al seu país, anonimat registral real. Surt entenent que l'estructura és perfectament sòlida.

**2. El client que ja retira al seu compte personal a Espanya cada mes**: aquí sí que hi ha un punt operatiu a corregir. No perquè la LLC reporti (no ho fa), sinó perquè les transferències entrants al seu compte espanyol sí que estan dins del sistema CRS espanyol. El que dissenyem és un flux més net: targeta corporativa per a despeses, distribucions planificades i documentades, no degoteig aleatori cap al compte local.

**3. El client que té Wise multidivisa europeu + Mercury**: li expliquem quina entitat reporta què. Habitualment reorganitzem perquè l'operativa principal visqui a Wise US o Mercury i el mòdul europeu només s'utilitzi per a casos puntuals.
### Com es fa bé

Una estructura financera Exentax tipus:

- **Compte principal de la LLC** a Mercury o Wise US Inc. → fora del CRS, ACH i wire en USD, integracions comptables.
- **Tresoreria amb rendiment** a Slash → bons del Tresor US, capital ociós productiu, mateix perímetre US.
- **Targetes corporatives** Wallester → control granular de despeses operatives.
- **Passarel·les** Stripe US, PayPal Business, Whop, Hotmart segons producte → liquidació a Mercury, cicle tancat als EUA.
- **Brokers** segons objectiu: Interactive Brokers (accions/ETFs/opcions, obre a LLCs de no residents amb W-8BEN-E), Tradovate (futurs), Kraken (cripto, opera amb LLC).
- **Compte personal local separat** només per a despesa personal final, alimentat per distribucions planificades, no per raig permanent.

Amb aquest disseny, l'operativa fiscal és coherent: la LLC viu als EUA, es mou dins dels EUA, i tu decideixes quan i com distribueixes a la teva vida personal amb la documentació correcta.
### Per què Exentax

Perquè dissenyem això des del primer dia i no com un pegat. El compte US, la tresoreria, la targeta, la passarel·la, el broker i el flux cap al teu compte personal van pensats com un sistema, no com peces soltes que després no encaixen. Quan tot està ben estructurat:

- No hi ha sorpreses de reporting perquè saps exactament quina entitat reporta què.
- La traçabilitat és neta, cosa que et protegeix davant de qualsevol requeriment.
- La teva separació patrimonial real funciona: la LLC és la LLC, la teva vida personal és la teva vida personal.
- El compliance US (Form 5472, BOI, manteniment de l'agent) el portem nosaltres.

---
## Referències legals i normatives

Aquest article es basa en normativa vigents actualment. Citem les fonts principals per a verificació:

- **EUA.** Treas. Reg. §301.7701-3 (classificació d'entitats / *check-the-box*); IRC §882 (impost sobre rendes d'estrangers connectades amb US trade or business); IRC §871 (FDAP i retencions a no residents); IRC §6038A i Treas. Reg. §1.6038A-2 (Form 5472 per a *25% foreign-owned* i *foreign-owned disregarded entities*); IRC §7701(b) (residència fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report a FinCEN).
- **Espanya.** Llei 35/2006 (LIRPF), arts. 8, 9 (residència), 87 (atribució de rendes), 91 (transparència fiscal internacional per a persones físiques); Llei 27/2014 (LIS), art. 100 (transparència fiscal internacional per a societats); Llei 58/2003 (LGT), arts. 15 i 16; Llei 5/2022 (règim sancionador del Model 720 després de la STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Models 232 i 720); Ordre HFP/887/2023 (Model 721 cripto).
- **Conveni Espanya–EUA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de 22/12/1990 (CDI original); Protocol en vigor des del 27/11/2019 (renda passiva, *limitation on benefits*).
- **UE / OCDE.** Directiva (UE) 2011/16, modificada per DAC6 (mecanismes transfronterers), DAC7 (Directiva (UE) 2021/514, plataformes digitals) i DAC8 (criptoactius); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetries híbrides); Estàndard Comú de Reporte (CRS) de l'OCDE.
- **Marc internacional.** Model de Conveni OCDE, art. 5 (establiment permanent) i comentaris; Acció 5 BEPS (substància econòmica); FATF Recommendation 24 (titularitat real).

<!-- exentax:lote34-native-v1:cuentas-bancarias-usa-reportan-hacienda-verdad-ca -->
## Com llegir la qüestió de comptes bancaris als EUA i reporting a la hisenda espanyola com un mapatge jurisdiccional estable en lloc d'una preocupació recurrent

La qüestió de comptes bancaris als EUA i reporting a la hisenda espanyola es llegeix com un mapatge jurisdiccional estable entre el país del compte, el país de residència del beneficiari i el marc aplicable entre tots dos.
<!-- /exentax:lote34-native-v1:cuentas-bancarias-usa-reportan-hacienda-verdad-ca -->

Abans de continuar, posa números al teu cas: la <a href="/ca#calculadora">calculadora Exentax</a> compara, en menys de 2 minuts, la teva càrrega fiscal actual amb la que tindries operant una LLC nord-americana ben declarada al teu país de residència.

<!-- exentax:calc-cta-v1 -->
> <a href="/ca/agendar">Consulta gratuïta sense compromís</a>
<!-- /exentax:calc-cta-v1 -->

L'aplicació concreta de qualsevol d'aquestes normes al teu cas depèn de la teva residència fiscal, l'activitat de la LLC i la documentació que mantinguis. Aquest contingut és informatiu i no substitueix l'assessorament professional personalitzat.
### Següents passos

Ara que tens el context complet, el pas següent natural és contrastar-lo amb la teva pròpia situació: què encaixa, què no, i on són els matisos que depenen de la teva residència, la teva activitat i el teu volum. Una revisió ràpida del teu cas sol estalviar molt soroll abans de qualsevol decisió estructural.

<!-- exentax:banking-facts-v1 -->
## Fets bancaris i fiscals a precisar

La informació sobre fintech i CRS evoluciona; aquest és l'estat actual:

### Notes per proveïdor

- **Mercury** opera amb diversos bancs associats amb llicència federal i cobertura **FDIC** via sweep network: principalment **Choice Financial Group** i **Evolve Bank & Trust**, i encara **Column N.A.** en alguns comptes heretats. Mercury no és un banc; és una plataforma fintech recolzada per aquests partner banks. Si Mercury tanca un compte, el saldo es retorna normalment **mitjançant xec en paper a l'adreça registrada del titular**, fet que pot ser un problema operatiu seriós per a no residents; convé mantenir un compte secundari (Relay, Wise Business, etc.) com a contingència.
- **Wise** té dos productes clarament diferents: **Wise Personal** i **Wise Business**. Per a una LLC s'ha d'obrir **Wise Business**, no el personal. Matís important de CRS: una **Wise Business titularitat d'una LLC dels EUA queda fora del CRS** perquè la titular és una entitat dels EUA i els EUA no són jurisdicció CRS; el costat USD opera via Wise US Inc. (perímetre FATCA, no CRS). En canvi, una **Wise Personal oberta per un individu resident fiscal a Espanya** o una altra jurisdicció CRS **sí genera reporte CRS** via Wise Europe SA (Bèlgica) sobre aquest individu. Obrir Wise per a la teva LLC no t'inclou al CRS per la LLC; una Wise Personal separada al teu nom com a resident en CRS, sí.
- **Wallester** (Estònia) és una entitat financera europea amb llicència EMI/banc emissor de targetes. Els seus comptes IBAN europeus **estan dins de l'Estàndard Comú de Comunicació (CRS)** i, per tant, generen intercanvi automàtic d'informació cap a l'administració fiscal del país de residència.
- **Payoneer** opera mitjançant entitats europees (Payoneer Europe Ltd, Irlanda) també **dins de l'àmbit CRS** per a clients residents en jurisdiccions participants.
- **Revolut Business**: quan s'associa a una **LLC nord-americana**, opera sota **Revolut Technologies Inc.** amb **Lead Bank** com a banc partner als EUA. El compte lliurat és un compte dels EUA (routing + account number); **no s'emet IBAN europeu** a una LLC. Els IBAN europeus (lituans, BE) són de **Revolut Bank UAB** i s'emeten a clients europeus del grup. Si li ofereixen un IBAN europeu associat a la seva LLC, confirma a quina entitat jurídica està associat i sota quin règim reporta.
- **Tributació zero**: cap estructura LLC aconsegueix "zero impostos" si vius en un país amb regles CFC/transparència fiscal o atribució de rendes. El que s'aconsegueix és **no duplicar tributació** i **declarar correctament a residència**, no eliminar-la.

<!-- exentax:legal-facts-v1 -->
## Fets legals i de procediment

Les obligacions davant la FinCEN i l'IRS s'han mogut en recent years; aquest és l'estat vigent:
### Punts clau

- **BOI / Corporate Transparency Act: la teva LLC NO està obligada (un avantatge competitiu).** Després de la **interim final rule de la FinCEN de març de 2025**, l'obligació del BOI Report va quedar **restringida a les "foreign reporting companies"** (entitats constituïdes FORA dels EUA i registrades per operar en un estat). Una **LLC formada als EUA propietat d'un no resident NO presenta el BOI Report**: un tràmit menys al calendari, menys burocràcia i una estructura més neta que mai. Si la teva LLC es va constituir abans de març de 2025 i ja vas presentar el BOI, conserva l'acusament. L'estat normatiu pot canviar: **monitoritzem FinCEN.gov en cada presentació** i, si l'obligació torna a aplicar, la gestionem sense cost addicional. Estat vigent verificable a [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Per a una **Single-Member LLC propietat d'un no resident**, les regulacions finals Treas. Reg. §1.6038A-1 (vigents des de 2017) tracten la LLC com a corporation a efectes del 5472. Procediment: **Form 1120 pro-forma** (només capçalera: nom, adreça, EIN, exercici) amb **Form 5472 annexat**. Enviament **per correu certificat o fax a l'IRS Service Center d'Ogden, Utah**, **no via MeF/e-file** estàndard. Venciment: **15 d'abril**; pròrroga via **Form 7004** fins al **15 d'octubre**. **Sanció: 25.000 USD per formulari i any, més 25.000 USD per cada 30 dies addicionals** de no presentació després de notificació de l'IRS. Respira: a Exentax això és rutina, et posem al dia i la propera revisió es tanca en una volta, sense sotracs.
- **Form 1120 substantiu.** Només aplica si la LLC ha fet check-the-box election a C-Corp (Form 8832): tributa al 21 % federal i presenta un 1120 amb xifres reals. La LLC disregarded estàndard **no presenta un 1120 substantiu i no paga corporate tax federal**.
- **EIN i notificacions.** Sense EIN no es pot presentar el 5472 ni el BOI. L'IRS no avisa abans de sancionar; es descobreix quan l'EIN queda bloquejat o una presentació posterior és rebutjada.<!-- exentax:execution-v2 -->
## El que reporten i el que no reporten els comptes USA de la teva LLC

La discreció real dels comptes americans no és un mite ni una promesa absoluta: és una asimetria documentada del sistema financer internacional, amb límits concrets i un manual d'ús si vols aprofitar-la bé. Aquests són els fets, sense teories.

- **Els EUA no participen al CRS.** Únic G20 que no va signar el Common Reporting Standard. Conseqüència pràctica: Mercury, Relay, Choice Financial, Evolve i Column N.A. no tenen obligació d'enviar saldos automàticament al país de residència del titular. No és cap truc, és l'arquitectura del sistema des de 2014.
- **FATCA en sentit invers és parcial.** L'IGA Model 1 amb Espanya (vigent des de 2013) exigeix que els EUA enviïn a l'AEAT informació sobre comptes mantinguts per residents espanyols en bancs americans, però l'abast real és: comptes de persones físiques residents amb titularitat directa, amb dipòsits generadors d'interessos. Els comptes d'entitat (LLC) en bancs com Mercury no cauen en aquest flux automàtic amb la mateixa intensitat.
- **El que sí pot demanar l'AEAT.** Via MAP del conveni EUA-Espanya, l'AEAT pot sol·licitar informació específica sobre un compte concret quan hi ha indici raonable. El procés triga 12-24 mesos, requereix motivació i s'utilitza per a casos de quantia rellevant. No és automàtic ni massiu.
- **L'error que trenca l'asimetria.** Rebre transferències des del compte de la teva LLC americana directament al teu compte personal a Espanya genera un traç d'origen visible per al teu banc espanyol, que sí reporta a l'AEAT. La discreció del compte USA es preserva si el flux entra via Wise multidivisa amb motivació coherent (member draw, salari, dividend segons qualificació), no com a transferència bruta sense context.

### El que més ens pregunten

**Llavors, puc no declarar el meu compte USA?** No: tens obligació declarativa pròpia (Modelo 720 si saldo combinat >50.000 €). L'asimetria CRS no eximeix; el que fa és eliminar el creuament automàtic que delata les omissions en jurisdiccions CRS. La teva obligació de declarar continua intacta.

**Quant durarà aquesta asimetria?** No hi ha senyal que els EUA signin CRS a curt termini (5 anys). Sí hi ha senyals que el FATCA invers s'intensifiqui progressivament. L'estructura continua funcionant avui i previsiblement tota la dècada, però convé declarar correctament per no dependre de la seva persistència.

A Exentax deixem dissenyada l'operativa Mercury + Wise amb fluxos coherents, declaració Modelo 720 neta i documentació preparada per a qualsevol requeriment futur, aprofitant l'asimetria sense convertir-la en omissió declarativa.
<!-- /exentax:execution-v2 -->

## T'ho muntem sense que perdis un cap de setmana

Milers de freelancers i emprenedors ja operen amb la seva LLC americana de manera 100% legal i documentada. A Exentax ens encarreguem de tot el procés: constitució, banca, passarel·les de pagament, comptabilitat, declaracions IRS i compliance al teu país de residència. Reserva una assessoria gratuïta i et direm amb sinceritat si la LLC té sentit per al teu cas, sense promeses absolutes.

<!-- task9-2026-expansion -->
## Flux regulatori: del banc americà a l'IRS i d'allí a l'AEAT via FATCA IGA Model 1

Aquesta secció desmunta el mite "els bancs americans no reporten res" i descriu el flux real de dades entre els EUA i Espanya sota l'Acord Intergovernamental FATCA Model 1 signat el 14 de maig de 2013, en vigor des del 9 de desembre de 2013 i afinat pels memoràndums de cooperació administrativa posteriors.

### Diagrama textual del flux

1. **Banc o EMI dels EUA (Mercury, Choice, Column N.A., Wise US Inc., Relay Bank, Slash) → IRS**: cada institució financera classificada com a FFI recíproca reporta anualment a l'IRS els saldos i rendes de final d'any dels comptes el titular dels quals és persona o entitat espanyola subjecta a FATCA. Si el compte pertany a la teva LLC, el reporte fa servir el GIIN de l'entitat i el TIN del beneficiari efectiu declarat al W-9 o W-8BEN/W-8BEN-E.
2. **IRS → AEAT**: l'IRS empaqueta les dades de l'any natural i les transmet a l'AEAT entre **setembre i octubre de l'any següent** en el format FATCA XML 2.0 vigent des del juliol de 2024.
3. **AEAT → encreuament intern**: l'AEAT contrasta aquests registres amb les teves declaracions (Model 100, Model 720, Model 721). Les divergències entren al "Plan Anual de Control Tributario" de l'any.

### Què es transmet i què NO es transmet

**Es transmet** (camps FATCA XML): nom del titular o de la LLC, adreça, TIN espanyol o NIF, número de compte, saldo a 31 de desembre, interessos bruts pagats l'any, dividends i altres rendes brutes, productes bruts de venda d'actius financers i GIIN de la institució.

**No es transmet automàticament**: moviments diaris, beneficiaris indirectes per sota del 25 % de control, contrapart de cada operació o classificació interna de l'activitat econòmica subjacent. També queden fora els comptes inferiors a **50.000 USD** de persones físiques nord-americanes sense indicis US segons la due diligence FATCA, encara que més recentment Mercury i Wise US Inc. reporten per defecte qualsevol compte vinculat a un TIN espanyol amb saldo superior a zero.

### Dates crítiques el

- 31 de març de: les FFIs han d'enviar a l'IRS el reporte FATCA anual.
- 30 de setembre de: finestra habitual d'intercanvi IRS-AEAT del último ejercicio cerrado.
- Octubre a desembre de: les dades apareixen al Renta Web de l'AEAT i disparen eventuals requeriments.

### Com preparar-se sense sorpreses

Mantén el W-8BEN-E coherent amb l'estructura real, factura i cobra sempre des del compte de la LLC, conserva els extractes mensuals en PDF i, si arriba un requeriment del 720, tindràs cinc dies hàbils per respondre. Passa el teu cas per la <strong>calculadora fiscal d'Exentax</strong> per veure el cost net de declarar net davant de quedar-te en una zona grisa.

Per veure com aquestes dades es creuen amb la presentació del 720 segueix amb <a href="/ca/blog/model-720-i-model-721-guia-per-a-residents-a-espanya-amb">la guia pas a pas del Model 720 i 721</a>, i per a una auditoria completa del setup <strong>reserva una trucada amb l'equip Exentax</strong>.

<!-- exentax:cross-refs-v1 -->
## Per continuar la lectura

- [DAC8 i criptomonedes: el nou reporting fiscal automàtic el 2026](/ca/blog/dac8-i-criptomonedes-el-nou-reporting-fiscal-automatic-el)
- [Wise, IBAN i LLC: què es reporta realment a Hisenda i què no](/ca/blog/wise-iban-i-llc-que-es-reporta-realment-a-hisenda)
- [Visa i Mastercard: què veuen les hisendes del teu consum](/ca/blog/visa-mastercard-reporting-que-veu-hisenda-dels-pagaments-amb)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Vols parlar-ne ara? Escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20estic%20llegint%20%22%C3%89s%20la%20pregunta%20que%20m%C3%A9s%20es%20repeteix%20quan%20un%20client%20tanca%20la%20seva%20LLC%20amb%20nosal%E2%80%A6%22%20i%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>

Si prefereixes parlar-ne directament, <a href="/ca/agendar">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.

<!-- exentax:conv-fill-v1 -->
O truca'ns directament al <a href="tel:+34614916910">+34 614 916 910</a> si prefereixes parlar.

Per a detalls per estat, consulta la nostra <a href="/ca/serveis/llc-wyoming">pàgina del servei LLC a Wyoming</a> amb costos i terminis tancats.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Reserva una consulta gratuïta de 30 minuts: revisem el teu cas real i et diem què té sentit. <a href="/ca/agendar">Reservar consulta gratuïta</a>.
<!-- /exentax:cta-v1 -->

`;
