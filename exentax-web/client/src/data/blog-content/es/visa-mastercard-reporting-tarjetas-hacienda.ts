export default `

Cuando alguien pregunta "¿Hacienda ve lo que pago con la tarjeta?" la respuesta corta es: depende de quién emite la tarjeta, dónde está domiciliado el comercio y en qué país eres residente fiscal. La respuesta larga obliga a entender cómo funciona por debajo el ecosistema de tarjetas y qué declaraciones informativas existen realmente. Hay mucho mito alrededor de Visa y Mastercard, y conviene separarlo de lo que sí ocurre con tu <a href="/es/blog/wise-iban-llc-que-reporta-hacienda">tarjeta Wise asociada a una LLC</a>, con tu tarjeta de un banco español o con la <a href="/es/blog/revolut-business-crs-reporting-fiscal">tarjeta Revolut</a>.

Este artículo recorre quién es quién en una transacción con tarjeta, qué reporta cada actor a las autoridades fiscales y cuáles son las declaraciones informativas país por país que afectan al consumo y al saldo de tarjetas (Modelo 196 y 171 en España, DAS2 en Francia, Modelo 38 en Portugal, entre otras).

## El modelo de cuatro partes: emisor, red, adquirente, comercio

Cada vez que pasas una tarjeta, intervienen cuatro actores muy distintos:

- **Emisor (issuer)**: la entidad que te ha emitido la tarjeta y mantiene la cuenta de la que sale el dinero. Puede ser un banco tradicional (BBVA, Santander), una EMI (Wise Europe SA, Revolut Bank UAB) o un emisor de prepago.
- **Red de procesamiento (network o scheme)**: Visa, Mastercard, American Express, JCB, UnionPay. No mantienen tu cuenta ni la del comercio: encaminan el mensaje de autorización entre el emisor y el adquirente, y orquestan la liquidación.
- **Adquirente (acquirer)**: la entidad financiera que ha contratado al comercio y le abona el cobro. En Europa son nombres como Adyen, Stripe, Worldline, Redsys (a través de los bancos miembros), CaixaBank Payments & Consumer, Banco Sabadell, etc.
- **Comercio (merchant)**: el negocio que cobra. Está identificado por un Merchant Category Code (MCC) y un identificador único en la red.

Entender esta cadena es clave: ningún actor "ve" toda la película. Cada uno ve solo su tramo.
### Qué ve y qué no ve cada actor

| Actor | Lo que conoce con detalle |
| --- | --- |
| Emisor | Tu identidad, tu cuenta, cada cargo con importe, divisa, fecha, MCC y nombre del comercio |
| Red (Visa/Mastercard) | Mensajes de autorización entre emisor y adquirente, datos agregados para liquidación, fraude y disputa |
| Adquirente | Identidad del comercio, cada cobro recibido, importe, divisa, marca de tarjeta y BIN del emisor |
| Comercio | Su propio cobro, los últimos 4 dígitos, marca, país emisor y, si pides factura, tus datos |

Lo que **ninguno** de ellos hace por sistema es enviar un volcado en directo a la Agencia Tributaria de cada país de cada cliente. Eso simplemente no es su rol.
## La idea más extendida (y errónea) sobre Visa y Mastercard

Circula la creencia de que "como Visa y Mastercard son americanas y todo pasa por ellas, ya están reportando todo a las haciendas del mundo". No es así:

- **Visa Inc.** y **Mastercard Inc.** son **redes de procesamiento de pagos**, no entidades depositarias. No mantienen cuentas de clientes finales y, por tanto, no son "instituciones financieras declarantes" en el sentido del CRS o de FATCA.
- **No reportan** los consumos individuales de cada portador a la Agencia Tributaria, a la AEAT, al Service Public Fédéral Finances belga, a la DGFiP francesa, ni a ninguna otra hacienda nacional como flujo automático.
- Sí cooperan con autoridades fiscales y judiciales en investigaciones puntuales, vía requerimientos formales, igual que cualquier otra empresa que custodia datos.

Quien sí está sujeto a obligaciones de información es el **emisor de la tarjeta** (en sus declaraciones nacionales) y, en el caso del comercio, el **adquirente** dentro de su propia contabilidad y de las declaraciones que le aplique en su país.
## Lo que realmente reporta el emisor en España

En España, las entidades emisoras nacionales presentan a la AEAT varias declaraciones informativas relevantes para tarjetas y cuentas:

- **Modelo 196**: declaración informativa anual de cuentas en entidades de crédito. Identifica a los titulares y autorizados, los saldos a 31 de diciembre y, en muchos casos, los saldos medios del cuarto trimestre. Cubre la cuenta de la que cuelga la tarjeta, no cada movimiento.
- **Modelo 171**: declaración anual de imposiciones, disposiciones de fondos y de los cobros con tarjetas de crédito o débito por encima de determinados umbrales (clásicamente, operaciones superiores a 3.000 € en efectivo y, para comerciantes, cobros con tarjeta agregados). Es el modelo que más asocian los autónomos a "Hacienda ve mis cobros con tarjeta".
- **Modelo 170**: declaración de operaciones realizadas por empresarios o profesionales adheridos al sistema de gestión de cobros a través de tarjetas de crédito o débito. Aquí los **adquirentes** declaran los cobros que han abonado a los comercios, no los pagos que tú haces como consumidor.
- **Modelo 199**: identificación de cuentas con transcendencia tributaria.

Quien usa tarjeta como consumidor en España y tiene su cuenta en un banco español está, en la práctica, dentro del perímetro de información que la AEAT puede consultar de forma periódica. Y, sobre todo, su saldo y titularidad están en el Modelo 196 año tras año.
## El equivalente en otros países europeos

El esquema cambia en cada jurisdicción. Algunos ejemplos representativos:

- **Francia – DAS2**: declaración anual que recoge honorarios, comisiones y otras rentas pagadas a terceros. Para tarjetas, el papel principal lo juega la **DGFiP** combinando esta declaración con la información que aporta cada banco. Adicionalmente, Francia obliga a declarar las **cuentas en el extranjero** (formulario 3916) y los activos digitales asociados, lo cual incluye típicamente los IBAN de Wise o Revolut.
- **Portugal – Modelo 38**: declaración anual de transferencias y envíos de fondos al exterior. El **Modelo 40** complementa con operaciones con valores mobiliarios. Junto con la obligación de declarar cuentas extranjeras en el IRS, dibuja un perímetro de control similar al español.
- **Alemania**: no existe un Modelo 196 análogo, pero los bancos alemanes mantienen el sistema de Kontenabrufverfahren, que permite al Bundeszentralamt für Steuern consultar la titularidad de cuentas y depósitos de cualquier residente cuando lo solicita una autoridad competente. El consumo con tarjeta no se declara automáticamente, pero la cuenta sí queda accesible.
- **Italia**: el Anagrafe dei Rapporti Finanziari (Archivio dei Rapporti) recoge anualmente saldos, movimientos agregados y datos de cuentas y tarjetas que los intermediarios financieros italianos envían a la Agenzia delle Entrate. Es uno de los esquemas más densos de Europa.
- **Reino Unido**: HMRC recibe información agregada de los bancos vía esquemas como el Bulk Data Gathering, además de los reportes CRS para no residentes.

La regla general es que **la cuenta y la titularidad están bien cubiertas**, mientras que el **detalle transacción a transacción** no se envía de oficio: se reconstruye solo en una inspección concreta.
## El caso del emisor extranjero: Wise, Revolut y similares

Cuando tu tarjeta la emite una EMI europea distinta de un banco español (típicamente Wise Europe SA en Bélgica o Revolut Bank UAB en Lituania), la situación cambia:

- Esos emisores **no presentan los modelos informativos españoles** (196, 171, 170, 199). Esas declaraciones son obligaciones de las entidades financieras españolas o con sucursal en España.
- Sí están obligados al **CRS** desde su jurisdicción de origen. Wise Europe SA reporta a la hacienda belga y Revolut Bank UAB a la lituana, que reenvían a la hacienda del país de residencia del titular el saldo a 31 de diciembre y los rendimientos, según describimos en <a href="/es/blog/crs-cuentas-bancarias-llc-intercambio-informacion">CRS para cuentas bancarias de LLC</a>.
- El **detalle de cada compra con la tarjeta no viaja por CRS**. Lo que viaja es el saldo de cierre, la identidad del titular y, si la cuenta está a nombre de una entidad clasificada como Passive NFE, los controlling persons.

Esto explica una observación que muchos hacen: una compra con tarjeta de un banco español aparece, agregada con todo lo demás, en los datos que la AEAT puede consultar; la misma compra con tarjeta Wise o Revolut no se declara directamente a la AEAT, pero el saldo de la cuenta sí se reportará por CRS desde Bélgica o Lituania.

La consecuencia razonable no es "la tarjeta extranjera me hace invisible", sino que **el rastro existe en otra capa**: la cuenta queda identificada, los saldos se reportan y, si hay procedimiento, los movimientos se pueden pedir.
### Y el comercio adquirente: el otro extremo del cable

Olvidamos a menudo al adquirente. Cuando un comercio español cobra con tarjeta, su adquirente en España presenta el **Modelo 170** con el agregado anual de cobros con tarjeta de ese comercio. Si ese comercio es una persona física que no declara correctamente sus ingresos en IRPF, la AEAT cruza ese Modelo 170 con su declaración y aparece la incoherencia. Esto no afecta al consumidor, pero sí explica por qué Hacienda detecta tan rápido a comercios que infradeclaran ingresos cobrados con tarjeta.

Para un emprendedor con LLC que cobra de clientes finales vía Stripe US o un MoR como DoDo Payments, el flujo es distinto: el adquirente está fuera de España, no presenta Modelo 170, y los ingresos llegan a Mercury o Wise. La trazabilidad para Hacienda pasa entonces por el saldo y los rendimientos vía CRS, no por el adquirente.
## Qué puede ver realmente Hacienda de tu gasto con tarjeta

Trasladado al residente fiscal español que combina banca local con fintech extranjera y, eventualmente, una <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americana</a>:

Lo que la AEAT puede consultar de forma recurrente:

- Cuentas bancarias en España con tu titularidad o autorización (Modelo 196, 199).
- Cobros con tarjeta agregados de un comercio español (Modelo 170, si eres autónomo o empresa).
- Saldos a 31 de diciembre y rendimientos de cuentas en el extranjero recibidos por CRS desde el país del emisor.
- Cuentas en el extranjero declaradas por ti en el Modelo 720 cuando superes el umbral agregado.

Lo que la AEAT no recibe automáticamente:

- El detalle de cada compra que hagas con cualquier tarjeta, ni en España ni fuera.
- El listado de comercios donde compras como consumidor.
- Los importes individuales por debajo de los umbrales del 171 o equivalentes.

Lo que sí puede pedir si te abre un procedimiento:

- El extracto completo de la cuenta a la entidad emisora, en España directamente y, fuera, por intercambio puntual.
- Información concreta a la red de tarjetas o al comercio en investigaciones avanzadas.
## Errores comunes que vemos cada semana

1. **"Visa y Mastercard reportan todo en directo a Hacienda."** Falso. Son redes de procesamiento; no son entidades declarantes ni emisoras finales.
2. **"Si pago con tarjeta extranjera, mis compras son invisibles."** El detalle no se declara automáticamente, pero la cuenta sí está visible vía CRS y el rastro es perfectamente reconstruible.
3. **"El Modelo 171 hace que Hacienda vea cada compra mía con tarjeta."** No: el 171 cubre operaciones por encima de umbrales y agregados de cobros, no cada consumo personal por debajo de esos umbrales.
4. **"Si mi LLC cobra por Stripe, eso ya se declara en España."** No directamente: Stripe US no presenta Modelo 170, y la información sobre tu LLC llega a Hacienda por otras vías (Mercury vía FATCA es asimétrica, Wise vía CRS, tu propio Modelo 720 si aplica).
5. **"Mejor pagar siempre con la tarjeta del banco extranjero para no dejar rastro."** El rastro existe y, además, una operativa diseñada para no dejar rastro es exactamente el patrón que más rápido detona alarmas en una inspección.
6. **"El adquirente del comercio europeo donde compro reporta mi consumo a la AEAT."** No: el adquirente reporta los cobros de su propio cliente comercio, no los datos del consumidor.
### Por qué esto importa para tu estructura

Si combinas una LLC americana, una cuenta Mercury, un Wise Business con tarjeta, una Revolut Business y una tarjeta de tu banco español para el día a día, no tienes un problema de "ocultación": tienes un mapa de rastros distintos, cada uno con su propia visibilidad fiscal. La pregunta correcta no es "¿qué tarjeta usar para que no se entere Hacienda?", sino "¿cómo encajan estas piezas con mi residencia fiscal, mis declaraciones (IRPF, 720, 721) y la doctrina administrativa que aplica a mi LLC?". Lo desarrollamos en <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">Diseño de una estructura fiscal internacional sólida</a> y, para el cruce concreto con la <a href="/es/blog/wise-iban-llc-que-reporta-hacienda">tarjeta Wise sobre LLC</a>, en su artículo dedicado.

Si ya operas con tarjetas en varias jurisdicciones y no tienes claro qué se reporta dónde, lo revisamos contigo y te decimos qué arreglar antes de que sea Hacienda quien marque el ritmo.
### En resumen

Las redes Visa y Mastercard no son las que avisan a Hacienda de tus consumos: su rol es procesar pagos. Lo que sí llega a las autoridades fiscales es información del **emisor** (vía declaraciones nacionales tipo Modelo 196 o 171, DAS2, Modelo 38) y del **adquirente** (cobros agregados del comercio). Cuando el emisor está fuera de tu país, las declaraciones nacionales no aplican, pero el saldo y la titularidad sí viajan por CRS desde la jurisdicción del emisor.

El gasto con tarjeta no se está retransmitiendo en directo a tu hacienda, pero deja un rastro perfectamente visible cuando alguien decide mirar. La diferencia entre tener problemas o no tenerlos no está en qué tarjeta usar, sino en que tu estructura sea coherente con tu residencia fiscal y con tus declaraciones.
## Compliance fiscal en tu país: CFC, TFI y atribución de rentas

Una LLC americana es una herramienta legal y reconocida internacionalmente. Pero el cumplimiento no termina al constituirla: como propietario residente fiscal en otro país, tu administración tributaria sigue teniendo derecho a gravar lo que la LLC genera. Lo importante es saber **bajo qué régimen** aplica esa tributación.

### Por jurisdicción

- **España (LIRPF/LIS).** Si la LLC es una *Single-Member Disregarded Entity* operativa (servicios reales, sin pasividad significativa), Hacienda suele tratarla por **atribución de rentas (art. 87 LIRPF)**: los beneficios netos se imputan al socio en el ejercicio en que se generan, integrándose en la base general del IRPF. Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada por residente español con rentas mayoritariamente pasivas, puede activarse el régimen de **transparencia fiscal internacional (art. 91 LIRPF para personas físicas, art. 100 LIS para sociedades)**. La diferencia entre uno u otro régimen no es opcional: depende de la sustancia económica, no del nombre.
- **Modelos informativos.** Cuentas bancarias en EE. UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022; sanciones ahora dentro del régimen general LGT). Operaciones vinculadas con la LLC y dividendos repatriados: **Modelo 232**. Criptoactivos custodiados en EE. UU.: **Modelo 721**.
- **CDI España–EE. UU.** El convenio (BOE 22/12/1990, Protocolo en vigor 27/11/2019) ordena la doble imposición sobre dividendos, intereses y royalties. Una LLC sin establecimiento permanente en España no constituye, por sí sola, EP del socio, pero la dirección efectiva sí puede crearlo si toda la gestión se hace desde territorio español.
- **México, Colombia, Argentina y otros LATAM.** Cada jurisdicción tiene su propio régimen CFC (México: Refipres; Argentina: rentas pasivas del exterior; Chile: art. 41 G LIR). El principio común: lo que la LLC retiene como beneficio se considera percibido por el socio si la entidad se considera transparente o controlada.

La regla práctica: una LLC operativa, con sustancia, declarada correctamente en residencia, es **planificación fiscal legítima**. Una LLC que se usa para ocultar ingresos, simular no residencia o desplazar rentas pasivas sin justificación económica entra en el terreno del **art. 15 LGT (conflicto en aplicación de la norma)** o, en el peor caso, del **art. 16 LGT (simulación)**. La diferencia la marcan los hechos, no el papel.

<!-- exentax:calc-cta-v1 -->
> <a href="/es/agendar">Consulta gratuita sin compromiso</a>
<!-- /exentax:calc-cta-v1 -->

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

<!-- exentax:bank-balance-v1 -->
## Stack bancario equilibrado: Mercury, Relay, Slash y Wise

No existe la cuenta perfecta para una LLC. Existe el **stack** correcto, donde cada herramienta cubre un rol:

- **Mercury** (operada como fintech con bancos asociados (Choice Financial Group y Evolve Bank & Trust principalmente; Column N.A. en cuentas heredadas), FDIC vía sweep network hasta el límite vigente). Cuenta principal operativa para no residentes con buena UX, ACH y wires. Sigue siendo una de las opciones más probadas para abrir desde fuera de EE. UU.
- **Relay** (respaldada por Thread Bank, FDIC). Excelente como **cuenta de respaldo** y para gestión "envelope budgeting": permite crear hasta 20 sub-cuentas y 50 tarjetas de débito, integración profunda con QuickBooks y Xero. Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare.
- **Slash** (respaldada por Column N.A. (banco federalmente registrado, con cobertura FDIC)). Banca diseñada para operadores online: emisión instantánea de tarjetas virtuales por proveedor, controles de gasto granulares, *cashback* en publicidad digital. Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS.
- **Wise Business** (EMI multi-divisa, no es banco). Para cobrar y pagar en EUR, GBP, USD y otras divisas con datos bancarios locales y conversión a *mid-market rate*. No sustituye una cuenta US real, pero es imbatible para tesorería internacional.
- **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen. Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC.

La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**. Es la configuración que minimiza riesgo de bloqueo y reduce coste real. En Exentax abrimos y configuramos este stack como parte de la constitución.

<!-- exentax:banking-facts-v1 -->
## Hechos bancarios y fiscales que conviene precisar

La información sobre fintech y CRS evoluciona y queremos que la tengas tal cual está hoy:

### Notas por proveedor

- **Mercury** opera con varios bancos asociados con licencia federal y cobertura **FDIC** vía sweep network: principalmente **Choice Financial Group** y **Evolve Bank & Trust**, además de **Column N.A.** en algunos casos heredados. Mercury no es un banco; es una plataforma fintech respaldada por esos partner banks. Si Mercury cierra una cuenta, el saldo se devuelve normalmente **mediante cheque a la dirección registrada del titular** y eso puede ser un problema operativo serio para no residentes; conviene tener una cuenta secundaria activa (Relay, Wise Business, etc.) como contingencia.
- **Wise** distribuye dos productos distintos: **Wise Personal** (cuenta personal) y **Wise Business** (cuenta para empresas, incluida tu LLC). Para una LLC se debe abrir **Wise Business**, no la personal. Matiz importante de CRS: una **Wise Business titularidad de una LLC estadounidense queda fuera del CRS** porque la titular es una entidad de EE. UU. y EE. UU. no es jurisdicción CRS; el lado USD opera vía Wise US Inc. (perímetro FATCA, no CRS). En cambio, una **Wise Personal abierta por un individuo residente fiscal en España** u otra jurisdicción CRS **sí genera reporte CRS** vía Wise Europe SA (Bélgica) sobre ese individuo. Si abres Wise para tu LLC, esa cuenta no te incluye en CRS por la LLC; si además mantienes una Wise Personal a tu nombre como residente en CRS, esa segunda sí reporta.
- **Wallester** (Estonia) es una entidad financiera europea con licencia EMI/banco emisor de tarjetas. Sus cuentas IBAN europeas **están dentro del Estándar Común de Comunicación de Información (CRS)** y, por tanto, generan reporte automático a la administración tributaria del país de residencia del titular.
- **Payoneer** opera con entidades europeas (Payoneer Europe Ltd, Irlanda) que también **están dentro de CRS** para clientes residentes en jurisdicciones que aplican el estándar.
- **Revolut Business**: cuando se asocia a una **LLC estadounidense**, lo habitual es operar bajo Revolut Payments USA; los IBAN europeos (lituanos, BE) **no se emiten por defecto** a una LLC: se emiten a clientes europeos del banco europeo del grupo. Si te ofrecen un IBAN europeo, asegúrate de a qué entidad jurídica está asociada esa cuenta y bajo qué régimen reporta.
- **Tributación cero**: ninguna estructura LLC consigue "cero impuestos" si vives en un país con CFC/transparencia fiscal o atribución de rentas. Lo que se consigue es **no duplicar tributación** y **declarar correctamente en residencia**, no eliminarla.

<!-- exentax:legal-facts-v1 -->
## Hechos legales y de procedimiento

La normativa de información a FinCEN y al IRS se ha movido en recent years; la versión vigente es esta:

### Puntos clave

- **BOI / Corporate Transparency Act: tu LLC NO está obligada (ventaja competitiva).** Tras la **interim final rule de FinCEN de marzo de 2025**, la obligación del BOI Report quedó **restringida a las "foreign reporting companies"** (entidades constituidas FUERA de EE. UU. y registradas para hacer negocios en un estado). Una **LLC formada en EE. UU. propiedad de un no residente NO presenta BOI Report**: un trámite menos en tu calendario, menos burocracia y una estructura más limpia que nunca. Si tu LLC se constituyó antes de marzo de 2025 y ya presentaste BOI, conserva el acuse. El estado normativo puede cambiar: **monitorizamos FinCEN.gov en cada presentación** y, si la obligación vuelve a aplicar, la gestionamos sin coste adicional. Estado vigente verificable en [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para una **Single-Member LLC propiedad de un no residente**, las regulaciones finales de Treas. Reg. §1.6038A-1 (vigentes desde 2017) tratan a la LLC como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo cabecera: nombre, dirección, EIN, ejercicio fiscal) con el **Form 5472 anexado**. Se envía **por correo certificado o fax al IRS Service Center de Ogden, Utah**, **no se presenta vía MeF/e-file** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y año, más 25.000 USD por cada 30 días adicionales** sin presentación tras notificación del IRS.
- **Form 1120 sustantivo.** Solo aplica si la LLC ha realizado *check-the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 1120 con cifras reales. La LLC disregarded estándar **no presenta un 1120 sustantivo y no paga corporate tax federal**.
- **EIN y notificaciones.** Sin EIN no se puede presentar 5472 ni BOI. El IRS no avisa antes de sancionar; las multas se descubren al actuar contra el EIN o al rechazar una próxima presentación.

<!-- exentax:execution-v2 -->
## Visa, Mastercard y reporting a Hacienda: qué se sabe del uso de tu tarjeta de empresa

Mucho cliente abre Mercury creyendo que su tarjeta US es invisible para España. Hacienda no recibe extracto detallado del uso de tu tarjeta empresarial US - pero sí recibe agregados que cruzan con declaraciones, y los gastos pagados con tarjeta dejan rastro en sitios que sí reportan. Conviene entender qué se ve y qué no antes de pensar que la tarjeta US es opacidad.

- **Lo que NO recibe Hacienda directamente.** Listado de transacciones individuales (no van movimiento por movimiento al fisco extranjero), categorías Visa/Mastercard de los gastos, ubicaciones de uso por terminal POS, ni horarios. La red de tarjetas (Visa, Mastercard, Amex) no es interface de reporting fiscal - es interface de pago entre comercios y bancos.
- **Lo que SÍ recibe Hacienda vía CRS y FATCA.** Saldo de la cuenta empresarial US a 31 de diciembre + total de movimientos del año (suma de entradas) + identificación del UBO. Si el saldo medio o el flujo total es alto y no aparece coherentemente en tu declaración (Modelo 720 si >50k€, IRPF por atribución de la LLC), salta el cruce.
- **Lo que SÍ deja rastro a través de comercios.** Si pagas en España con tarjeta US emitida por Mercury, el comercio recibe el cobro y declara su venta normalmente; tu IBAN/PAN no llega a Hacienda como tal, pero las entradas en cuenta del comercio sí. Si compras un coche pagando con tarjeta US, el concesionario reporta la venta y, si Hacienda revisa al concesionario, aparece pagador no español como dato.
- **Lo que SÍ ve tu banco residente si recargas la tarjeta.** Si transfieres EUR de tu cuenta española a tu Wise/Mercury para cargar la tarjeta y luego pagas, esa transferencia es visible en tu cuenta española y declara movimiento. Si te pagas un sueldo de la LLC vía wire a tu IBAN, el ingreso es visible y debe coincidir con tu IRPF.

### El cruce típico que detecta inconsistencias

Hacienda recibe vía CRS: tu Mercury tiene saldo medio 80k€ y movimientos brutos anuales 300k€. En tu IRPF declaras 25k€ de actividad económica por LLC. Inconsistencia evidente: o no declaras lo correcto por atribución, o tienes capacidad de gasto no justificada por renta declarada (disparidad signos externos vs renta). Inicio de procedimiento automático.

### Lo que más nos preguntan

**¿Si pago todos mis gastos personales con tarjeta de la LLC, evito que se vea?** No. (1) Mezclar gastos personales en cuenta empresarial es romper separación patrimonial - pierdes responsabilidad limitada y cierre del banco AML. (2) Hacienda no necesita ver el desglose: ve el saldo y el flujo y cruza con tu nivel de renta declarada. La aparente opacidad genera el problema, no lo evita.

**¿Hay alguna tarjeta US "no reportable" para Hacienda?** No. Toda tarjeta emitida por entidad financiera reportante CRS está bajo régimen de reporting agregado. La diferencia entre Mercury, Wise, Brex, Relay es operativa, no de opacidad.

En Exentax estructuramos uso de tarjeta US para LLC con bookkeeping y declaración correcta en residencia - para que el saldo y los flujos casen con tu IRPF y no haya inconsistencia que dispare cruce.
<!-- /exentax:execution-v2 -->

## Tu siguiente paso con Exentax

En Exentax constituimos y mantenemos LLCs de no residentes a diario: estado, EIN, Operating Agreement, BOI cuando aplique, banca con Mercury y Wise, pasarelas Stripe y Adyen, contabilidad mensual, Form 5472 y 1120 pro-forma cada año, y coordinación con tu fiscalidad en residencia. Si quieres validar tu caso con datos reales, agenda una asesoría con nuestro equipo y te explicamos paso a paso cómo encajaría en tu situación concreta.

¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22visa%20mastercard%20reporting%20tarjetas%20hacienda%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si prefieres hablarlo en directo, <a href="/es/agendar">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

`;
