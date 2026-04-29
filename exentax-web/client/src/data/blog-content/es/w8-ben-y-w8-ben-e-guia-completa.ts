export default `

Si tú o tu LLC cobráis dinero desde Estados Unidos (Stripe, PayPal, plataformas de afiliación, AdSense, dividendos, royalties, brokers...), antes o después os pueden pedir un **W-8BEN** o un **W-8BEN-E**. No todas las plataformas lo exigen: en banca de empresa como Mercury, Relay o Wise solo lo firmarás si te lo solicitan expresamente, mientras que en brokers como Interactive Brokers es obligatorio desde el alta. Cuando se exige y no se rellena (o se rellena mal), el resultado es siempre el mismo: el pagador estadounidense te aplica una **retención del 30%** sobre lo que te debe, "por si acaso". 30% que después es muy difícil recuperar.

Esta guía es la versión completa, en español, sin tecnicismos innecesarios pero rigurosa. Vas a entender qué son estos formularios, en qué se diferencian, quién debe presentar cada uno, dónde, cómo se rellenan paso a paso y qué errores pueden salirte caros.

## Qué son los W8 y por qué existen

Los formularios de la serie **W-8** son documentos del **IRS** (la agencia tributaria de EE.UU.) mediante los cuales una persona o entidad **no estadounidense** declara al pagador que **no es contribuyente fiscal en EE.UU.** y, en su caso, que **se acoge a un convenio de doble imposición** para reducir o eliminar la retención por defecto.

La regla general en EE.UU. es que cualquier pago de fuente estadounidense a una persona o entidad extranjera está sujeto a una retención del **30%** salvo que el receptor demuestre lo contrario. Esa demostración se hace, precisamente, con un W-8.

Los más usados son dos:

- **W-8BEN:** para **personas físicas no estadounidenses** (un español, un argentino, un alemán… que cobra de fuente USA).
- **W-8BEN-E:** para **entidades no estadounidenses** (tu LLC, tu sociedad europea, tu sociedad limitada española…).

Existen otros (W-8ECI, W-8IMY, W-8EXP) para casos más específicos que dejamos fuera de esta guía.
### Diferencia clave entre W-8BEN y W-8BEN-E

| | W-8BEN | W-8BEN-E |
|--|--------|----------|
| Quién lo firma | Persona física no residente fiscal en EE.UU. | Entidad no estadounidense (tu LLC, tu SL, etc.) |
| Datos clave | Nombre, país, dirección, fecha de nacimiento, ID fiscal | Razón social, país de constitución, EIN/GIIN, tipo de entidad, status FATCA |
| Páginas | 1 | 8 (pero solo rellenas 2-3) |
| Convenio | Sí, en Parte II | Sí, en Parte III |
| Validez | 3 años | 3 años |

Una **Single-Member LLC de no residente** es un caso interesante: aunque el IRS la trate como Disregarded Entity, **el formulario que se presenta normalmente es el W-8BEN-E** a nombre de la LLC, no el W-8BEN del titular. Algunas plataformas (sobre todo Stripe) gestionan la lógica internamente y te piden datos de uno u otro según cómo esté registrada la cuenta.
### Para qué sirven en la práctica

Para **evitar la retención del 30%** sobre pagos de fuente USA. El convenio entre **EE.UU. y España** (y los equivalentes con muchos otros países) reduce esa retención a:

- **0%** sobre la mayoría de **rentas empresariales** (servicios prestados desde fuera de EE.UU. sin establecimiento permanente).
- **15%** sobre **dividendos** de empresas estadounidenses (10% en algunos casos).
- **0%** sobre **intereses** en general.
- **0-10%** sobre **royalties** según el tipo.

Sin un W-8 firmado, el pagador retiene el 30% sobre todo y manda el dinero al IRS. Con un W-8 bien hecho, puedes recibir tus pagos íntegros (caso más común para servicios) o con la retención reducida del convenio.
### Quién debe presentarlos

Lo presenta **quien recibe el dinero**, no quien lo paga. Es decir:

- Tú como **persona física** si cobras directamente de USA (ej. eres asesor independiente y un cliente americano te paga vía Wise o un broker te ingresa dividendos a tu nombre): **W-8BEN**.
- Tu **LLC** (o tu sociedad española, alemana, mexicana...) si los pagos van a la cuenta de la entidad: **W-8BEN-E**.
### Cuándo presentarlos

- Al **abrir cualquier cuenta** en un banco, fintech o broker estadounidense.
- Al **dar de alta tu negocio** en una pasarela de pago (Stripe, PayPal Business, Square...).
- Cuando un **cliente USA** te lo solicite antes de pagarte por primera vez.
- Al **renovar** cada 3 años (o antes si cambian tus datos: cambio de dirección, de país de residencia, etc.).
## Dónde se entregan

A diferencia de otros formularios IRS, **el W-8 no se envía al IRS**. Se entrega al **pagador** (banco, broker, plataforma, cliente) y este lo conserva en sus archivos. Si la autoridad fiscal estadounidense le pide cuentas, el pagador justifica con tu W-8 por qué no aplicó la retención del 30% o por qué aplicó la del convenio.

Las plataformas más habituales tienen formularios W-8 integrados en su flujo de alta:

- **Interactive Brokers, Tradovate, Charles Schwab y otros brokers**: lo piden de forma obligatoria en el alta como cliente no residente. Sin W-8BEN-E firmado no puedes operar.
- **Stripe** (US y Stripe Atlas): W-8BEN-E embebido al crear la cuenta.
- **PayPal Business**: lo solicita al verificar la cuenta de empresa.
- **AdSense, YouTube, Twitch, Amazon KDP, App Store Connect**: tienen su propio asistente W-8 dentro del flujo fiscal de la plataforma.
- **Mercury, Relay, Slash, Wise Business**: por defecto **no** te exigen un W-8 para operar. Solo te lo solicitarán si una verificación específica de compliance lo pide; si la plataforma no te lo reclama expresamente, no necesitas firmarlo para usarla.
## Cómo rellenar un W-8BEN paso a paso (persona física)

Estructura: una sola página dividida en 3 partes.

**Parte I, Identificación del beneficiario:**

1. **Name of individual:** tu nombre completo como aparece en tu pasaporte o DNI.
2. **Country of citizenship:** tu nacionalidad (Spain, Mexico, Argentina, Germany…).
3. **Permanent residence address:** dirección de tu residencia fiscal real, no un PO Box ni una dirección de USA.
4. **Mailing address:** solo si es distinta de la anterior.
5. **US TIN (SSN/ITIN):** solo si tienes uno. La mayoría de no residentes lo dejan en blanco.
6. **Foreign tax identifying number:** tu NIF/NIE/CURP/CUIT… el ID fiscal de tu país.
7. **Reference number:** se usa pocas veces, déjalo en blanco salvo que el pagador te lo pida.
8. **Date of birth:** formato MM-DD-YYYY.

**Parte II, Convenio fiscal:**

9. Indica el país con el que tienes convenio: "Spain" si eres residente fiscal en España.
10. Detalle especial: solo se rellena si reclamas un tipo reducido específico (royalties, becas, etc.). Para servicios profesionales prestados desde fuera de USA, normalmente no se rellena.

**Parte III, Certificación:**

Firma, fecha y nombre. Estás declarando bajo perjurio que los datos son ciertos. Mintiendo aquí te metes en problemas serios con dos administraciones a la vez.
## Cómo rellenar un W-8BEN-E paso a paso (tu LLC)

Es más largo (8 páginas) pero solo rellenas las partes que aplican a tu caso. Para una **Single-Member LLC de no residente**, lo habitual es:

**Parte I, Identificación de la entidad:**

1. **Name of organization:** razón social exacta de tu LLC.
2. **Country of incorporation:** "United States".
3. **Disregarded entity name:** déjalo en blanco (la LLC misma es la disregarded entity, no hay otra dentro).
4. **Chapter 3 status:** marca **"Corporation"** si la LLC ha hecho election como tal; en la mayoría de casos de no residentes con Single-Member, la opción real es marcar la entidad como tal y rellenar la **Parte III** del convenio. En la práctica, muchas plataformas indican qué casilla marcar; si tienes dudas, marca **"Corporation"** porque es la opción que el pagador entiende mejor cuando la LLC tiene EIN propio.
5. **Chapter 4 status (FATCA):** marca **"Active NFFE"** (Active Non-Financial Foreign Entity) si tu LLC factura por servicios o vende productos. Si es una sociedad de inversión pasiva, sería "Passive NFFE".
6. **Permanent residence address:** dirección registrada de la LLC en EE.UU.
7. **Mailing address:** opcional.
8. **US TIN (EIN):** el EIN de tu LLC.
9. **GIIN:** déjalo en blanco salvo que tu LLC sea una entidad financiera registrada en FATCA (no es el caso normal).
10. **Foreign TIN:** el ID fiscal del país de residencia del beneficiario último (por ejemplo, tu NIF español).

**Parte III, Convenio fiscal:**

- Marca que el beneficiario es residente fiscal de **Spain** (o el país que corresponda).
- Indica que cumples la **limitación de beneficios** (Art. 17 del convenio USA-España): para una LLC pequeña con un único miembro residente español, normalmente se cumple bajo el test de propiedad y erosión de la base imponible, o como individuo si el miembro lo es directamente. Cuando tengas dudas reales, consulta con tu asesor.
- En el campo de tipo de renta y artículo del convenio, indica el artículo que aplica (Business Profits, Royalties, Dividends, etc.) y el tipo reducido al que tienes derecho.

**Parte XXV, Active NFFE:** una casilla declarando que más del 50% de tus ingresos son activos (no pasivos). Es lo habitual para una LLC operativa.

**Parte XXX, Certificación:** firma, nombre, cargo y fecha.
### Errores comunes que te van a costar dinero

1. **Poner una dirección USA como residencia permanente.** El sistema lo interpreta como que eres US person y te aplica retenciones distintas o te pide W-9.
2. **Usar el W-8BEN cuando deberías usar el W-8BEN-E** (o al revés). Cuidado con cuentas mixtas.
3. **No firmar.** Sin firma manuscrita o digital válida, el pagador lo trata como inexistente.
4. **Olvidar el Foreign TIN** cuando el pagador lo exige (Stripe, IBKR y similares).
5. **No marcar el Chapter 4 status.** Sin él, los bancos están obligados a aplicar la retención FATCA del 30%.
6. **Reclamar un tipo de convenio que no te corresponde.** Si declaras 0% donde tu caso es 15%, te puede pasar factura si te auditan.
7. **No renovar al cabo de 3 años.** A los 3 años el formulario caduca; el pagador empieza a retener el 30% hasta que actualices.
### Validez y renovación

El W-8 firmado es válido **3 años naturales completos** desde la fecha de firma. Si en ese plazo cambian datos sustanciales (cambio de país de residencia fiscal, cambio de nombre, cambio de tipo de entidad, fin del convenio), debes presentar uno nuevo en cuanto se produzca el cambio. Y dejar uno marcado en el calendario para renovarlo a tiempo: la mayoría de plataformas avisan, pero no todas.
### Relación con el convenio USA-España

El **Convenio entre el Reino de España y los Estados Unidos de América para evitar la doble imposición y prevenir la evasión fiscal**, firmado en 1990 y modernizado por el Protocolo de 2013 en vigor desde 2019, es la base legal sobre la que descansa la mayoría de tipos reducidos del W-8 cuando eres residente español. En particular:

- **Beneficios empresariales (Art. 7):** sin establecimiento permanente en USA, los beneficios se gravan solo en España. Resultado para servicios prestados desde fuera de USA: **0% de retención**.
- **Dividendos (Art. 10):** retención reducida al 15% (10% en participaciones cualificadas).
- **Intereses (Art. 11):** generalmente 0%.
- **Royalties (Art. 12):** entre 0% y 10% según tipo.

Si quieres entender cómo encaja todo esto con tu LLC, lee también nuestra <a href="/es/blog/convenio-doble-imposicion-usa-espana-llc">guía sobre el convenio de doble imposición USA-España aplicado a LLCs</a>.
## Casos prácticos por plataforma

- **Stripe (US o Atlas):** te pide un W-8BEN-E embebido al crear la cuenta de tu LLC. Rellénalo con EIN, dirección USA registrada, Chapter 4 = Active NFFE, convenio España = sí. Resultado: 0% retención sobre tus ingresos por servicios.
- **PayPal Business:** lo solicita al verificar la cuenta business. Sube el PDF firmado a través del centro de resolución.
- **Interactive Brokers:** te lo solicita de forma obligatoria en el alta. Indica España como país y marca "Corporation" para tu LLC. Aplicará 15% de retención en dividendos americanos en lugar del 30%.
- **Mercury / Relay / Slash:** **no** lo piden en el onboarding estándar de tu LLC. Solo te lo solicitarán si una verificación puntual de compliance lo requiere; si la plataforma no te lo pide, no necesitas firmar ninguno para operar.
- **Wise Business:** mismo criterio que Mercury/Relay: solo si te lo piden expresamente. No es un trámite por defecto al dar de alta tu LLC.
- **AdSense / YouTube / Amazon KDP / App Store / Twitch:** todos tienen su propio asistente que internamente genera el W-8 correcto. Rellena los datos con cuidado: una vez firmado, modificarlo después es engorroso.
## Cómo te ayuda Exentax

En Exentax preparamos los W-8BEN-E de tu LLC y te ayudamos a presentarlos correctamente allí donde sí se exigen: Stripe, IBKR y otros brokers, plataformas de afiliación, AdSense/YouTube/Amazon KDP y cualquier pagador USA que te lo reclame. En Mercury, Relay, Slash o Wise solo lo firmamos si la plataforma lo pide expresamente. Si ya te han aplicado retenciones del 30% por un W-8 mal hecho, también revisamos si es viable recuperarlo vía 1042-S y formularios asociados, aunque siempre es mucho más barato hacerlo bien desde el principio.

Cada caso es individual y la legislación fiscal puede cambiar; estos formularios y los criterios FATCA se actualizan periódicamente. Por eso conviene revisar tu papeleo con cada cambio importante en tu negocio o cada vez que el IRS publique una nueva versión.

Si quieres que revisemos tu situación, agenda tu asesoría gratuita con Exentax y dejaremos los W-8 de tu LLC y tu papeleo internacional en orden.

Para profundizar más, lee también <a href="/es/blog/cuentas-bancarias-usa-reportan-hacienda-verdad">¿Las cuentas bancarias en EE.UU. reportan a Hacienda?</a>, <a href="/es/blog/llc-alternativa-autonomo-espana">LLC como alternativa a ser autónomo en España</a> y, si todavía no tienes tu número fiscal estadounidense, <a href="/es/blog/como-obtener-itin-numero-fiscal-irs">cómo obtener tu ITIN ante el IRS</a>.
## Compliance fiscal en tu país: CFC, TFI y atribución de rentas

Una LLC americana es una herramienta legal y reconocida internacionalmente. Pero el cumplimiento no termina al constituirla: como propietario residente fiscal en otro país, tu administración tributaria sigue teniendo derecho a gravar lo que la LLC genera. Lo importante es saber **bajo qué régimen** aplica esa tributación.

### Por jurisdicción

- **España (LIRPF/LIS).** Si la LLC es una *Single-Member Disregarded Entity* operativa (servicios reales, sin pasividad significativa), Hacienda suele tratarla por **atribución de rentas (art. 87 LIRPF)**: los beneficios netos se imputan al socio en el ejercicio en que se generan, integrándose en la base general del IRPF. Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada por residente español con rentas mayoritariamente pasivas, puede activarse el régimen de **transparencia fiscal internacional (art. 91 LIRPF para personas físicas, art. 100 LIS para sociedades)**. La diferencia entre uno u otro régimen no es opcional: depende de la sustancia económica, no del nombre.
- **Modelos informativos.** Cuentas bancarias en EE. UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022; sanciones ahora dentro del régimen general LGT). Operaciones vinculadas con la LLC y dividendos repatriados: **Modelo 232**. Criptoactivos custodiados en EE. UU.: **Modelo 721**.
- **CDI España–EE. UU.** El convenio (BOE 22/12/1990, Protocolo en vigor 27/11/2019) ordena la doble imposición sobre dividendos, intereses y royalties. Una LLC sin establecimiento permanente en España no constituye, por sí sola, EP del socio, pero la dirección efectiva sí puede crearlo si toda la gestión se hace desde territorio español.
- **México, Colombia, Argentina y otros LATAM.** Cada jurisdicción tiene su propio régimen CFC (México: Refipres; Argentina: rentas pasivas del exterior; Chile: art. 41 G LIR). El principio común: lo que la LLC retiene como beneficio se considera percibido por el socio si la entidad se considera transparente o controlada.

Antes de seguir, pon números a tu caso: la <a href="/es#calculadora">calculadora Exentax</a> compara, en menos de 2 minutos, tu carga fiscal actual con la que tendrías operando una LLC declarada en tu país de residencia.

<!-- exentax:calc-cta-v1 -->
> <a href="/es/agendar">Consulta gratuita sin compromiso</a>
<!-- /exentax:calc-cta-v1 -->

La regla práctica: una LLC operativa, con sustancia, declarada correctamente en residencia, es **planificación fiscal legítima**. Una LLC que se usa para ocultar ingresos, simular no residencia o desplazar rentas pasivas sin justificación económica entra en el terreno del **art. 15 LGT (conflicto en aplicación de la norma)** o, en el peor caso, del **art. 16 LGT (simulación)**. La diferencia la marcan los hechos, no el papel.
En Exentax montamos la estructura para que encaje en el primer escenario y documentamos cada paso para que tu declaración local sea defendible ante una eventual revisión.

<!-- exentax:legal-refs-v1 -->
## Referencias legales y normativas

Este artículo se apoya en normativa vigentes actualmente. Citamos las fuentes principales para que puedas verificarlo:

- **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report ante FinCEN).
- **España.** Ley 35/2006 (LIRPF), arts. 8, 9 (residencia), 87 (atribución de rentas), 91 (transparencia fiscal internacional para personas físicas); Ley 27/2014 (LIS), art. 100 (transparencia fiscal internacional para sociedades); Ley 58/2003 (LGT), arts. 15 (conflicto en aplicación de la norma) y 16 (simulación); Ley 5/2022 (régimen sancionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 720); Orden HFP/887/2023 (Modelo 721 cripto).
- **Convenio España–EE. UU.** BOE de 22/12/1990 (CDI original); Protocolo en vigor desde 27/11/2019 (renta pasiva, *limitation on benefits*).
- **UE / OCDE.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetrías híbridas); Estándar Común de Reporte (CRS) de la OCDE.
- **Marco internacional.** Modelo de Convenio OCDE, art. 5 (establecimiento permanente) y comentarios; Acción 5 BEPS (sustancia económica); FATF Recommendation 24 (titularidad real).

La aplicación concreta de cualquiera de estas normas a tu caso depende de tu residencia fiscal, la actividad de la LLC y la documentación que mantengas. Este contenido es informativo y no sustituye al asesoramiento profesional personalizado.

<!-- exentax:banking-facts-v1 -->
## Hechos bancarios y fiscales que conviene precisar

La información sobre fintech y CRS evoluciona y queremos que la tengas tal cual está hoy:

### Notas por proveedor

- **Mercury** opera con varios bancos asociados con licencia federal y cobertura **FDIC** vía sweep network: principalmente **Choice Financial Group** y **Evolve Bank & Trust**, además de **Column N.A.** en algunos casos heredados. Mercury no es un banco; es una plataforma fintech respaldada por esos partner banks. Si Mercury cierra una cuenta, el saldo se devuelve normalmente **mediante cheque a la dirección registrada del titular** y eso puede ser un problema operativo serio para no residentes; conviene tener una cuenta secundaria activa (Relay, Wise Business, etc.) como contingencia.
- **Wise** distribuye dos productos distintos: **Wise Personal** (cuenta personal) y **Wise Business** (cuenta para empresas, incluida tu LLC). Para una LLC se debe abrir **Wise Business**, no la personal. Matiz importante de CRS: una **Wise Business titularidad de una LLC estadounidense queda fuera del CRS** porque la titular es una entidad de EE. UU. y EE. UU. no es jurisdicción CRS; el lado USD opera vía Wise US Inc. (perímetro FATCA, no CRS). En cambio, una **Wise Personal abierta por un individuo residente fiscal en España** u otra jurisdicción CRS **sí genera reporte CRS** vía Wise Europe SA (Bélgica) sobre ese individuo. Si abres Wise para tu LLC, esa cuenta no te incluye en CRS por la LLC; si además mantienes una Wise Personal a tu nombre como residente en CRS, esa segunda sí reporta.
- **Wallester** (Estonia) es una entidad financiera europea con licencia EMI/banco emisor de tarjetas. Sus cuentas IBAN europeas **están dentro del Estándar Común de Comunicación de Información (CRS)** y, por tanto, generan reporte automático a la administración tributaria del país de residencia del titular.
- **Payoneer** opera con entidades europeas (Payoneer Europe Ltd, Irlanda) que también **están dentro de CRS** para clientes residentes en jurisdicciones que aplican el estándar.
- **Revolut Business**: cuando se asocia a una **LLC estadounidense**, opera bajo **Revolut Technologies Inc.** con **Lead Bank** como banco partner. La cuenta entregada es estadounidense (routing + account number); **no se emite IBAN europeo** a una LLC. Los IBAN europeos (lituanos, BE) son de **Revolut Bank UAB** y se emiten a clientes europeos del grupo. Si te ofrecen un IBAN europeo asociado a tu LLC, confirma a qué entidad jurídica se asocia y bajo qué régimen reporta.
- **Tributación cero**: ninguna estructura LLC consigue "cero impuestos" si vives en un país con CFC/transparencia fiscal o atribución de rentas. Lo que se consigue es **no duplicar tributación** y **declarar correctamente en residencia**, no eliminarla.

<!-- exentax:legal-facts-v1 -->
## Hechos legales y de procedimiento

La normativa de información a FinCEN y al IRS se ha movido en recent years; la versión vigente es esta:

### Puntos clave

- **BOI / Corporate Transparency Act: tu LLC NO está obligada (ventaja competitiva).** Tras la **interim final rule de FinCEN de marzo de 2025**, la obligación del BOI Report quedó **restringida a las "foreign reporting companies"** (entidades constituidas FUERA de EE. UU. y registradas para hacer negocios en un estado). Una **LLC formada en EE. UU. propiedad de un no residente NO presenta BOI Report**: un trámite menos en tu calendario, menos burocracia y una estructura más limpia que nunca. Si tu LLC se constituyó antes de marzo de 2025 y ya presentaste BOI, conserva el acuse. El estado normativo puede cambiar: **monitorizamos FinCEN.gov en cada presentación** y, si la obligación vuelve a aplicar, la gestionamos sin coste adicional. Estado vigente verificable en [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para una **Single-Member LLC propiedad de un no residente**, las regulaciones finales de Treas. Reg. §1.6038A-1 (vigentes desde 2017) tratan a la LLC como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo cabecera: nombre, dirección, EIN, ejercicio fiscal) con el **Form 5472 anexado**. Se envía **por correo certificado o fax al IRS Service Center de Ogden, Utah**, **no se presenta vía MeF/e-file** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y año, más 25.000 USD por cada 30 días adicionales** sin presentación tras notificación del IRS.
- **Form 1120 sustantivo.** Solo aplica si la LLC ha realizado *check-the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 1120 con cifras reales. La LLC disregarded estándar **no presenta un 1120 sustantivo y no paga corporate tax federal**.
- **EIN y notificaciones.** Sin EIN no se puede presentar 5472 ni BOI. El IRS no avisa antes de sancionar; las multas se descubren al actuar contra el EIN o al rechazar una próxima presentación. Por eso, en Exentax te llevamos el calendario al día: tú dejas de pensar en plazos y nosotros los cerramos antes de que aprieten.

<!-- exentax:execution-v2 -->
## W-8BEN y W-8BEN-E: la guía completa para no confundirlas y no pagar 30% por error

El W-8 es el documento más importante en la relación de un no residente con cualquier payer US (Stripe, Amazon, broker, cliente corporate). Sin él, retienen 30% por defecto sobre cualquier pago. Con él bien cumplimentado, retienen 0% o lo que indique el tratado de tu residencia. Hay dos versiones que confunden continuamente, y la diferencia determina si estás operando bien o tirando dinero.

- **W-8BEN: para personas físicas (individuals).** Lo firmas TÚ como persona, no tu LLC. Útil cuando recibes royalties, intereses, dividendos US-source o pagos directos a tu nombre individual. Identificas tu país de residencia fiscal, claim treaty si aplica (artículo concreto del tratado España-US, Francia-US, etc.), declaras que NO eres US person. Vida útil: 3 años desde la firma o hasta cambio de circunstancias.
- **W-8BEN-E: para entidades (entities), incluida tu LLC.** Lo firma quien tenga authorised signatory de la LLC (típicamente el manager). Identifica la LLC, su clasificación FATCA (single-member disregarded entity = punto crítico, casi todos lo marcan mal), beneficial owner (la persona física detrás de la LLC), y el claim de treaty benefits si aplica. Vida útil: 3 años o hasta cambio. Es el formulario que pide Stripe al onboarding y el que pides al broker (IBKR, etc.).
- **El error más común: marcar la LLC como Corporation cuando es disregarded.** El W-8BEN-E tiene una sección de Chapter 3 status. Single-member LLC sin elección de C-Corp/S-Corp es "disregarded entity" - el beneficial owner es la persona física, no la LLC. Si marcas Corporation por error, el broker o payer trata a la LLC como entidad opaca y aplica retención sin pasar por treaty. Resultado: 30% retenido sobre dividendos cuando deberías pagar 15% (España, Francia) o 0% (algunos casos).
- **Treaty benefits: cómo se reclaman correctamente.** En Part III del W-8BEN-E o equivalente del W-8BEN: especificar el país de residencia fiscal con certificado, citar el artículo del tratado aplicable (típicamente "Article 10 - Dividends" para dividendos US, "Article 11 - Interest" para intereses), y declarar el % aplicable según el tratado (15% típico para dividendos, 0% para intereses en muchos casos). Sin esta sección bien rellenada, el payer ignora el tratado y aplica 30% default.

### Lo que más nos preguntan

**¿Tengo que mandar W-8BEN-E al IRS directamente?** No. El W-8 se entrega al payer (Stripe, broker, cliente), no al IRS. El payer lo conserva 4 años en sus archivos para soporte de la no-retención. El IRS solo lo ve si audita al payer.

**¿Si soy LLC disregarded, mi beneficial owner reclama el treaty de su residencia?** Exacto. Para una LLC disregarded, los treaty benefits se reclaman conforme al país del beneficial owner persona física, no de la LLC. Si tú vives en España y la LLC es disregarded, aplicas tratado España-US sobre los dividendos US que cobre la LLC. La LLC en sí no tiene tratado propio.

En Exentax preparamos W-8BEN-E correcto (clasificación FATCA, treaty benefits, beneficial owner) y los gestionamos con cada payer (Stripe, IBKR, brokers, clientes corporate) - para que la retención sea la que corresponde, no 30% default.
<!-- /exentax:execution-v2 -->

## Hablemos de tu estructura

Cada caso tiene matices: tu país de residencia, el tipo de actividad, dónde están tus clientes, si haces inversión o trading, si vendes a particulares o a empresas. En Exentax revisamos tu situación, diseñamos la estructura LLC que encaja contigo y te acompañamos cada año en el mantenimiento. Reserva una consulta con nuestro equipo y empezamos por entender tus números reales.

¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.

<!-- exentax:defensa-fiscal-v1 -->
## ¿Y si la AEAT me pregunta por mi LLC?

  Es la pregunta que más nos hace todo el mundo en la primera consulta y tiene una respuesta corta: tu LLC no es opaca y, si está bien declarada, una inspección se cierra en formularios estándar. La <a href="https://www.agenciatributaria.gob.es" target="_blank" rel="noopener">AEAT</a> puede pedirte el certificado de constitución del estado (Wyoming, Delaware o Nuevo México), el EIN emitido por el <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, el Operating Agreement firmado, los extractos de Mercury o Wise del ejercicio, el Form 5472 con el 1120 pro-forma presentado y la conciliación contable que cuadra ingresos, gastos y movimientos. Si todo eso existe y se entrega ordenado, la inspección no escala. Respira: en Exentax esto es rutina, te ponemos al día y la próxima revisión se cierra en una sola vuelta.

  Lo que la AEAT sí persigue, y con razón, es la titularidad simulada (testaferros, *prestanombres*, residencia fiscal de papel) y la falta de declaración del Modelo 720 / 721. Una LLC bien montada es exactamente lo contrario de eso: tú apareces como **beneficial owner** en el BOI Report cuando aplica (verificable en <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), tú firmas las cuentas bancarias y tú declaras la renta donde corresponde. La estructura está registrada en el Secretary of State del estado correspondiente, en los archivos del IRS y, si se opera con bancos europeos, también queda dentro del perímetro CRS del estándar de la <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.

  El error que sí hunde una inspección no es tener una LLC, es no haber atribuido la renta correctamente en el IRPF español, no haber presentado el Modelo 720 sobre las cuentas en EE. UU. cuando el saldo a 31/12 supera 50.000 € o no haber documentado las operaciones vinculadas socio-LLC en el Modelo 232 cuando proceda. Esos tres frentes son los que conviene cerrar antes de que llegue cualquier requerimiento, no después. Lo cerramos contigo desde Exentax: una llamada, presentación y archivo, y el riesgo se queda en el papel.

  ## Lo que NO hace una LLC

  - **No te exime de tributar en España.** Si vives en España, tributas en España por la renta mundial. La LLC ordena tu fiscalidad estadounidense (cero impuesto federal en Single-Member LLC pass-through, salvo Effectively Connected Income), no la española. La cuota del IRPF se calcula sobre el beneficio atribuido, no sobre los dividendos cobrados.
  - **No es una "offshore" ni un esquema BEPS.** Es una entidad estadounidense reconocida por el IRS, registrada en un estado concreto con dirección física, con agente registrado y con obligaciones informativas anuales. Las jurisdicciones offshore clásicas (BVI, Belice, Seychelles) no aparecen en ningún papel; una LLC sí, en cinco sitios distintos.
  - **No te protege si hay confusión patrimonial.** El velo corporativo (*pierce the corporate veil*) se levanta en cuanto un juez detecta que la LLC y el socio son la misma persona en la práctica: cuentas mezcladas, gastos personales pagados desde la cuenta de la LLC, sin Operating Agreement firmado o sin contabilidad mínima. Tres movimientos sospechosos bastan.
  - **No te ahorra cotizaciones a la Seguridad Social en España.** Si eres residente fiscal en España y autónomo, tu cuota mensual sigue siendo la misma. La LLC opera tu actividad económica frente a clientes internacionales; tu cotización personal en RETA es independiente y depende de tu base elegida en el <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de Seguridad Social.
  - **No te libra de declarar las cuentas extranjeras.** Si la suma de cuentas en EE. UU. (Mercury, Relay, Wise USD) supera 50.000 € a 31/12, **Modelo 720** antes del 31 de marzo. Si tienes criptoactivos custodiados en exchanges fuera de España por más de 50.000 €, **Modelo 721** en el mismo plazo. Las dos obligaciones son del residente fiscal, no de la LLC.

  En Exentax revisamos estos cinco frentes cada año junto con el calendario federal estadounidense (Form 5472, 1120 pro-forma, FBAR, Annual Report estatal y BOI Report cuando aplique). El objetivo es que ninguna inspección encuentre un cabo suelto y que la estructura sostenga revisiones a 5-7 años vista.
<!-- /exentax:defensa-fiscal-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22w8%20ben%20y%20w8%20ben%20e%20guia%20completa%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si prefieres hablarlo en directo, <a href="/es/agendar">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.

<!-- exentax:conv-fill-v1 -->
O llámanos directamente al <a href="tel:+34614916910">+34 614 916 910</a> si prefieres voz.

Para detalles concretos por estado, repasa nuestra <a href="/es/servicios/llc-wyoming">página de LLC en Wyoming</a> con costes y plazos cerrados.

Si tu prioridad es el ITIN, consulta <a href="/es/servicios/obten-tu-itin">Obtén tu ITIN con Exentax</a> y lo gestionamos en paralelo.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->
`;
