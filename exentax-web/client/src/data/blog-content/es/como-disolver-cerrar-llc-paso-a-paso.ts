export default `

Cerrar una LLC bien hecha es tan importante como abrirla. La mayoría de información que circula sobre LLCs habla de cómo constituirla, cómo elegir estado, cómo abrir cuenta en Mercury o Wise Business... pero casi nadie explica cómo se **cierra** correctamente. Y, sin embargo, una LLC mal disuelta sigue generando obligaciones, sanciones, comisiones y, en el peor de los casos, una sombra fiscal en EE.UU. que puede perseguirte durante años.

Esta guía cuenta el proceso real y completo para **disolver y cerrar tu LLC americana**: cuándo conviene hacerlo, cómo se ordena el cierre estado por estado, qué declaraciones finales presenta el <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, qué pasa con tu EIN, qué se hace con tu BOI Report, cómo se cancelan tus cuentas bancarias y por qué hay un orden estricto que no se debe alterar. Si ya no operas con tu LLC y quieres olvidarte de ella sin sorpresas a tres años vista, este es el camino.

## Por qué cerrar formalmente una LLC en vez de "dejarla morir"

La fantasía clásica del que se cansa de su LLC es: *"si no la uso, la dejo y ya está, dejarán de existir las obligaciones solas"*. No funciona así. Una LLC, mientras esté **activa o en estado "delinquent"** en su registro estatal, sigue generando:

- **Annual report fees** estatales (de 50 a 800 USD según estado).
- **Franchise tax** en Delaware (300 USD/año) y California (800 USD/año), entre otros.
- **Registered Agent fees** anuales (50-150 USD/año).
- **Form 5472 + 1120 pro forma** ante el IRS si la LLC tiene dueño extranjero único, con la **sanción de 25.000 USD por formulario no presentado** (Internal Revenue Code §6038A(d)).
- **BOI Report (<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>)** si tu LLC sigue obligada bajo la normativa vigente.
- Posibles cuotas de cuentas bancarias en Mercury, Wise Business, Relay o Slash.

Si la LLC pasa a estado *delinquent* o *administratively dissolved* por impago de annual report, eso **no te exime** de las obligaciones IRS ni de las sanciones devengadas. Lo único que hace es complicarte la vida cuando intentes finalmente cerrarla bien o, peor aún, cuando quieras montar otra LLC años después y descubras que figuras como dueño de una entidad con sanciones acumuladas. La mejor estrategia, con diferencia, es **hacer un cierre formal y limpio** en el orden correcto.
### Antes de empezar: el cierre solo se hace cuando se tiene claro

No todas las "ganas de cerrar" son ganas reales de cerrar. Antes de iniciar el proceso, conviene comprobar que el cierre tiene sentido frente a las alternativas:

- **Pausar operaciones temporalmente**, manteniendo la LLC viva pero con cero actividad, presentando 5472 + 1120 con ceros y BOI report si aplica. Es la opción razonable si crees que en menos de dos años podrías volver a usarla.
- **Cambiar estructura** (de single-member a multi-member, o constituir una nueva entidad y traspasar contratos) si lo que cambia es el modelo de negocio, no la voluntad de seguir.
- **Migrar de estado** mediante *domestication* o *conversion* si lo que pesa son las tasas o el reporting de tu estado actual.

Si después de revisar estas opciones sigues queriendo cerrar, este es el procedimiento. Cada caso es individual, así que conviene revisar el tuyo con un asesor antes de ejecutar.
### Visión general: el orden del cierre importa

El cierre de una LLC se compone de **siete bloques** que deben ejecutarse en este orden. Saltarse uno o invertir el orden suele provocar costes innecesarios o ventanas en las que la LLC sigue generando obligaciones sin que tú la estés gestionando ya:

1. Decisión formal de disolver (interna).
2. Liquidación de operaciones (clientes, contratos, deudas, activos).
3. Cierre de cuentas bancarias y pasarelas de pago.
4. Presentación de declaraciones finales ante el IRS (Form 1120 + 5472 marcados *Final return*).
5. Disolución estatal (Articles of Dissolution o Certificate of Cancellation).
6. Cierre del EIN ante el IRS y baja del BOI Report ante FinCEN cuando proceda.
7. Cancelación del Registered Agent y archivo documental personal.

Veamos cada bloque con el detalle real que importa.
## Puntos clave

### 1. Decisión interna y Operating Agreement

Aunque tu LLC sea *single-member* y tú seas el dueño único, la decisión formal de disolver debe quedar documentada. Es lo que tu operating agreement, si está bien redactado, pide explícitamente:

- **Resolution to dissolve**: documento interno donde el miembro único decide disolver la LLC, con fecha efectiva.
- Si la LLC es *multi-member*, hace falta el voto según el porcentaje exigido por el operating agreement (habitualmente unanimidad o mayoría cualificada).

Este documento no se presenta ante el IRS ni ante el estado, pero es la prueba interna de que la decisión existe y de que el cierre se ejecuta de buena fe. Si en el futuro alguien te pregunta cuándo dejaste de operar la LLC, esa fecha es la que vale.
### 2. Liquidación operativa: clientes, deudas y activos

Antes de tocar nada con el IRS o con el estado, hay que **dejar la LLC vacía**:

- **Cierre de contratos con clientes y proveedores.** Notificar el cese de actividad. Emitir las últimas facturas. Cobrar lo pendiente.
- **Cancelación de suscripciones** (Stripe, PayPal, herramientas SaaS, dominios facturados a la LLC, hosting).
- **Pago de deudas pendientes** (impuestos estatales, Registered Agent, facturas, royalties, comisiones).
- **Distribución de activos restantes al miembro** (transferencia del cash remanente desde la cuenta de la LLC a tu cuenta personal). En una single-member LLC tributada como disregarded entity, esta distribución no es un evento fiscal estadounidense para el IRS, pero **sí debe documentarse** como retirada del miembro.
- **Conservación de la contabilidad** (facturas emitidas y recibidas, extractos bancarios, comprobantes) durante al menos **siete años**. Es el plazo razonable para cubrir auditorías, intereses y posibles requerimientos.

Una vez la LLC está vacía y sin contratos vivos, podemos pasar al cierre bancario.
### 3. Cierre de cuentas bancarias y pasarelas de pago

El cierre de la cuenta bancaria es el punto donde más errores se cometen. La regla práctica:

- **Mover todo el cash a una cuenta personal del miembro** antes de pedir el cierre.
- **Solicitar el cierre por escrito** desde el dashboard del banco/fintech. Mercury, Wise Business, Relay y Slash tienen flujos de cierre en línea. Wallester gestiona el cierre por su área de soporte.
- **Esperar al cierre confirmado** antes de presentar la disolución estatal. Si presentas la disolución estatal y el banco descubre que la entidad ya no existe legalmente, suele bloquear movimientos pendientes.
- **Descargar todos los extractos** (al menos siete años hacia atrás) antes de cerrar la cuenta. Una vez cerrada, recuperarlos puede ser imposible o costoso.
- **Cancelar Stripe, PayPal y pasarelas** vinculadas a la LLC y descargar el histórico de movimientos.

> Si tu stack actual es Wise Business + Relay + Slash con Mercury de respaldo, ese es exactamente el orden inverso de cierre: primero las pasarelas, luego las fintech secundarias, y al final la cuenta principal por la que pasa el último cash. Wallester, si lo tienes con IBAN europeo, suele ser de los últimos en cerrarse y debe revisarse a la luz de tus obligaciones CRS en España.
### 4. Declaraciones finales ante el IRS

Aquí es donde muchos cierres se rompen. La LLC, antes de morir, tiene que presentar su **última temporada IRS**, marcando los formularios como **Final return**:

- **Form 1120 + Form 5472 (Final)** si tu LLC es single-member con dueño extranjero. La casilla *"Final return"* del Form 1120 debe estar marcada y la información reportable del Form 5472 debe incluir la **distribución final** del cash al miembro.
- **Form 1065 (Final)** si tu LLC era multi-member tributando como partnership.
- **Form 1120 o 1120-S (Final)** si elegiste tributar como C-corp o S-corp.
- **Form 966 (Corporate Dissolution or Liquidation)** dentro de los **30 días** siguientes a la adopción de la resolución de disolución, si la LLC tributaba como corporación.
- **Form 941 / 940 final** si tenías empleados.
- Cualquier formulario informativo pendiente (1099, W-2, 8804/8805 si aplica).

La fecha clave es: presentar las declaraciones finales **antes de pedir el cierre del EIN**. Si pides el cierre del EIN sin haber presentado los modelos finales, el IRS no cierra el EIN y, peor aún, te puede generar una notice de non-filer al año siguiente.

Si llevas años con la LLC y has acumulado retrasos en el 5472, **lo correcto es regularizar antes de cerrar**, no cerrar para tapar. Tienes detalle del riesgo concreto en la <a href="/es/blog/que-pasa-si-no-presentas-5472-multas-irs">guía de sanciones del Form 5472</a>. Cerrar una LLC con 5472 pendientes no extingue las sanciones devengadas; solo las congela y se las queda el IRS contra ti como persona física asociada al EIN.
### 5. Disolución estatal: Articles of Dissolution o Certificate of Cancellation

Con el cash distribuido, las cuentas cerradas y las declaraciones finales presentadas, pasamos al **cierre estatal**. El nombre exacto del documento depende del estado:

- **Wyoming**: *Articles of Dissolution* ante el Wyoming Secretary of State. Antes de presentarlas hay que estar al corriente del **annual report** y del **license tax**. Coste habitual: 60 USD.
- **Nuevo México**: *Articles of Dissolution* ante la New Mexico Secretary of State. La LLC debe estar al día con cualquier impuesto estatal aplicable. Coste habitual: 25 USD.
- **Delaware**: *Certificate of Cancellation* ante la Delaware Division of Corporations. Hay que pagar **el franchise tax pendiente y el del año del cierre** antes de cancelar. Coste de cancelación: 200 USD; el franchise tax añadido (300 USD/año) se suma.
- **Florida**: *Articles of Dissolution* ante la Florida Division of Corporations.
- **California**: si hubo nexus en California, hay que pagar el **800 USD de franchise tax mínimo del año del cierre** además de presentar Form 568 final.
- **Otros estados**: cada uno tiene su propio formulario y tasas; la lógica es la misma.

Un detalle importante: si tu LLC está **registrada como foreign LLC en otros estados** (porque hiciste *foreign qualification* para vender en California, Texas, NY, etc.), antes de cerrar en el estado *home* debes **cancelar cada foreign registration**. De lo contrario, esos estados te seguirán cobrando annual reports y franchise taxes durante años.
### 6. Cierre del EIN y baja del BOI Report

Una vez la LLC ya no existe legalmente (estado disuelto + declaraciones finales presentadas), el último paso con el IRS es **cerrar el EIN**. Técnicamente, el IRS no "elimina" un EIN: lo marca como inactivo. Para hacerlo, se envía una **carta firmada al Internal Revenue Service** identificando la entidad por nombre legal, EIN, dirección y motivo del cierre, adjuntando copia de la *Notice CP-575* original o, en su defecto, los datos de asignación del EIN.

En paralelo, conviene revisar el **BOI Report ante FinCEN**. Tras la **interim final rule de FinCEN de marzo de 2025**, el BOIR **NO aplica a las LLC formadas en EE. UU. propiedad de no residentes** y solo lo presentan las **foreign reporting companies** (entidades constituidas fuera de EE. UU. y registradas para operar en un estado). Si tu entidad encaja en ese supuesto y disuelves la LLC, debes presentar la **actualización final** en **boiefiling.fincen.gov** dentro de los **30 días** siguientes a la fecha efectiva de disolución estatal, reflejando el cese de la entidad y de sus beneficiarios efectivos (titulares con ≥ 25 % o control sustancial). El portal es gratuito y la presentación dura **10-15 minutos**. La sanción civil por no actualizar dentro de plazo llega a **591 USD/día** y la penal hasta **10.000 USD y 2 años de prisión** (31 U.S.C. §5336). Conserva el **BOIR Confirmation Number** del cierre (o la traza de no aplicación) en tu archivo de disolución.

Si tienes ITIN propio o hay socios con ITIN asociados a la LLC, esos ITINs no se "cierran" con la LLC: siguen siendo válidos para tu actividad personal en EE.UU. mientras los uses cada cierto tiempo (ver <a href="/es/blog/como-obtener-itin-numero-fiscal-irs">guía del ITIN</a>).
### 7. Registered Agent, dominios y archivo personal

Para cerrar el círculo:

- **Cancelar al Registered Agent**: notifícalo por escrito y pide la confirmación de cancelación. Si tu Registered Agent renueva por defecto cada año, esto es lo que evita una factura sorpresa al año siguiente.
- **Cancelar dominios y servicios** facturados a nombre de la LLC.
- **Archivar la documentación final** en un lugar seguro: operating agreement original, articles of organization, articles of dissolution sellados, EIN confirmation, copia de las declaraciones finales (1120, 5472, 1065, 966), extractos bancarios, contratos cerrados. Mínimo siete años.

Con eso, la LLC está clínicamente cerrada.
### Errores típicos que vemos al cerrar una LLC

En Exentax hemos visto cierres ejecutados al revés decenas de veces. Los seis errores más caros:

1. **Cerrar el banco antes de presentar el 5472 final.** Después es difícil documentar la última distribución.
2. **Pedir la disolución estatal sin pagar el franchise tax pendiente** (Delaware y California son los más estrictos).
3. **Olvidar cancelar las foreign qualifications** en otros estados.
4. **No marcar Final return en el 1120 / 1065.** El IRS sigue esperando declaración el año siguiente.
5. **No actualizar el BOI Report** cuando la normativa lo exige.
6. **No conservar los extractos bancarios** descargados antes del cierre.

Cada uno de estos errores se traduce en facturas, sanciones o requerimientos meses o años después.
## Cómo lo hacemos en Exentax

Nuestro proceso de **cierre de LLC llave en mano** sigue exactamente los siete pasos de esta guía. Tú nos das el contexto (estado, año de constitución, situación bancaria, declaraciones presentadas, posibles retrasos), nosotros diseñamos el orden de cierre, ejecutamos las declaraciones finales, coordinamos con tu Registered Agent y con tus bancos, presentamos la disolución estatal, cerramos el EIN y, si procede, actualizamos el BOI Report. Si llevas años con 5472 atrasados y necesitas regularizar antes de cerrar, lo hacemos como **fase previa** del cierre para no arrastrar exposición.

Si quieres cerrar tu LLC con seguridad, pide una consulta gratuita: revisamos tu situación, te decimos honestamente si tiene más sentido cerrar o pausar, y si seguimos adelante te entregamos un plan de cierre con fechas y presupuesto cerrado. Y si lo que estás pensando es justo lo contrario, que la LLC sigue teniendo sentido pero quieres rebajar costes y obligaciones, prueba antes nuestra calculadora fiscal y compara tu situación actual con el escenario de mantenerla activa con el stack adecuado: <a href="/es/blog/wise-bancos-llc-stack-bancaria-completa">Wise Business, Relay y Slash como cuentas operativas, Mercury como respaldo, y Wallester solo cuando aplique IBAN europeo</a> con su correspondiente análisis CRS.

Cerrar bien una LLC es un acto de higiene fiscal: ordena tu pasado y libera tu futuro. Vale la pena hacerlo en el orden correcto y con quien lo ha hecho cientos de veces.
## Compliance fiscal en tu país: CFC, TFI y atribución de rentas

Una LLC americana es una herramienta legal y reconocida internacionalmente. Pero el cumplimiento no termina al constituirla: como propietario residente fiscal en otro país, tu administración tributaria sigue teniendo derecho a gravar lo que la LLC genera. Lo importante es saber **bajo qué régimen** aplica esa tributación.

### Por jurisdicción

- **España (LIRPF/LIS).** Si la LLC es una *Single-Member Disregarded Entity* operativa (servicios reales, sin pasividad significativa), Hacienda suele tratarla por **atribución de rentas (art. 87 LIRPF)**: los beneficios netos se imputan al socio en el ejercicio en que se generan, integrándose en la base general del IRPF. Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada por residente español con rentas mayoritariamente pasivas, puede activarse el régimen de **transparencia fiscal internacional (art. 91 LIRPF para personas físicas, art. 100 LIS para sociedades)**. La diferencia entre uno u otro régimen no es opcional: depende de la sustancia económica, no del nombre.
- **Modelos informativos.** Cuentas bancarias en EE. UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022; sanciones ahora dentro del régimen general LGT). Operaciones vinculadas con la LLC y dividendos repatriados: **Modelo 232**. Criptoactivos custodiados en EE. UU.: **Modelo 721**.
- **CDI España–EE. UU.** El convenio (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocolo en vigor 27/11/2019) ordena la doble imposición sobre dividendos, intereses y royalties. Una LLC sin establecimiento permanente en España no constituye, por sí sola, EP del socio, pero la dirección efectiva sí puede crearlo si toda la gestión se hace desde territorio español.
- **México, Colombia, Argentina y otros LATAM.** Cada jurisdicción tiene su propio régimen CFC (México: Refipres; Argentina: rentas pasivas del exterior; Chile: art. 41 G LIR). El principio común: lo que la LLC retiene como beneficio se considera percibido por el socio si la entidad se considera transparente o controlada.

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
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetrías híbridas); Estándar Común de Reporte (CRS) de la OCDE.
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

<!-- exentax:legal-facts-v1 --><!-- exentax:execution-v2 -->
## La secuencia exacta para cerrar una LLC sin dejar cabos sueltos

Disolver una LLC mal hecha cuesta más que constituirla. Hay tres planos que cerrar simultáneamente - estatal, federal y bancario - y un orden que importa. Esta es la secuencia que aplicamos en Exentax cuando un cliente decide cerrar.

- **Paso 1 - Decisión documentada.** Acta de disolución firmada por los miembros, con fecha clara y motivo. Si la LLC tiene Operating Agreement, hay que seguir su procedimiento; si no, la ley del estado se aplica supletoriamente. Sin acta no se puede cerrar nada después.
- **Paso 2 - Articles of Dissolution al estado.** Cada Secretary of State publica su tasa de disolución y exige que la franchise tax pendiente esté pagada antes del archivo. La disolución surte efecto a la fecha aprobada por el Secretary of State, no antes. A partir de ese momento la LLC entra en periodo de wind-up: puede liquidar pero no operar nuevo negocio.
- **Paso 3 - Liquidación operativa.** Cobrar facturas pendientes, pagar proveedores, devolver depósitos, cerrar suscripciones SaaS, cancelar tarjetas, vaciar Mercury/Wise dentro del periodo de wind-up. Conviene cerrar cuentas bancarias después del último pago, no antes - sin cuenta no puedes cobrar última factura.
- **Paso 4 - Final Form 5472 + 1120 pro-forma.** Marca casilla "Final Return" en ambos formularios. Si no se presenta, el IRS sigue esperando 5472 cada año con multa de 25.000 USD por omisión. Es el error más caro y más común.
- **Paso 5 - BOI Final Report.** FinCEN exige reporte final de BOI al cesar la entidad, dentro de los 30 días tras la disolución estatal. Sin esto, sanciones civiles posibles.
- **Paso 6 - Cancelación EIN (opcional).** Carta al IRS solicitando cierre de cuenta EIN. No es estrictamente obligatorio (el EIN persiste pero queda inerte), pero recomendable para limpieza administrativa.

### Lo que más nos preguntan

**¿Cuánto tarda cerrar una LLC?** Entre 6 y 14 semanas desde la decisión hasta el último trámite. La disolución estatal se procesa en 2-4 semanas; el final 5472 se presenta con la próxima ventana fiscal (15 de abril si calendario natural).

**¿Y si llevo años sin presentar el 5472 y quiero cerrar?** Hay que regularizar primero los años atrasados con voluntary disclosure. La disolución sin regularización no extingue las multas - quedan a nombre del responsible party. Lo gestionamos con un protocolo de regularización + cierre conjunto.

En Exentax cerramos LLCs cada mes y entregamos el dossier completo (acta, articles, 5472 final, BOI final, cierre EIN) firmado y archivado para que el cliente pueda demostrar la disolución limpia ante cualquier requerimiento futuro.
<!-- /exentax:execution-v2 -->

## Hechos legales y de procedimiento

La normativa de información a FinCEN y al IRS se ha movido en recent years; la versión vigente es esta:

### Puntos clave

- **BOI / Corporate Transparency Act: tu LLC NO está obligada (ventaja competitiva).** Tras la **interim final rule de FinCEN de marzo de 2025**, la obligación del BOI Report quedó **restringida a las "foreign reporting companies"** (entidades constituidas FUERA de EE. UU. y registradas para hacer negocios en un estado). Una **LLC formada en EE. UU. propiedad de un no residente NO presenta BOI Report**: un trámite menos en tu calendario, menos burocracia y una estructura más limpia que nunca. Si tu LLC se constituyó antes de marzo de 2025 y ya presentaste BOI, conserva el acuse. El estado normativo puede cambiar: **monitorizamos FinCEN.gov en cada presentación** y, si la obligación vuelve a aplicar, la gestionamos sin coste adicional. Estado vigente verificable en [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para una **Single-Member LLC propiedad de un no residente**, las regulaciones finales de Treas. Reg. §1.6038A-1 (vigentes desde 2017) tratan a la LLC como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo cabecera: nombre, dirección, EIN, ejercicio fiscal) con el **Form 5472 anexado**. Se envía **por correo certificado o fax al IRS Service Center de Ogden, Utah**, **no se presenta vía MeF/e-file** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y año, más 25.000 USD por cada 30 días adicionales** sin presentación tras notificación del IRS.
- **Form 1120 sustantivo.** Solo aplica si la LLC ha realizado *check-the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 1120 con cifras reales. La LLC disregarded estándar **no presenta un 1120 sustantivo y no paga corporate tax federal**.
- **EIN y notificaciones.** Sin EIN no se puede presentar 5472 ni BOI. El IRS no avisa antes de sancionar; las multas se descubren al actuar contra el EIN o al rechazar una próxima presentación.

¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.


<!-- exentax:defensa-fiscal-v1 -->
## ¿Y si la AEAT me pregunta por mi LLC?

  Es la pregunta que más nos hace todo el mundo en la primera consulta y tiene una respuesta corta: tu LLC no es opaca y, si está bien declarada, una inspección se cierra en formularios estándar. La <a href="https://www.agenciatributaria.gob.es" target="_blank" rel="noopener">AEAT</a> puede pedirte el certificado de constitución del estado (Wyoming, Delaware o Nuevo México), el EIN emitido por el <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, el Operating Agreement firmado, los extractos de Mercury o Wise del ejercicio, el Form 5472 con el 1120 pro-forma presentado y la conciliación contable que cuadra ingresos, gastos y movimientos. Si todo eso existe y se entrega ordenado, la inspección no escala.

  Lo que la AEAT sí persigue, y con razón, es la titularidad simulada (testaferros, *prestanombres*, residencia fiscal de papel) y la falta de declaración del Modelo 720 / 721. Una LLC bien montada es exactamente lo contrario de eso: tú apareces como **beneficial owner** en el BOI Report cuando aplica (verificable en <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), tú firmas las cuentas bancarias y tú declaras la renta donde corresponde. La estructura está registrada en el Secretary of State del estado correspondiente, en los archivos del IRS y, si se opera con bancos europeos, también queda dentro del perímetro CRS del estándar de la <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.

  El error que sí hunde una inspección no es tener una LLC, es no haber atribuido la renta correctamente en el IRPF español, no haber presentado el Modelo 720 sobre las cuentas en EE. UU. cuando el saldo a 31/12 supera 50.000 € o no haber documentado las operaciones vinculadas socio-LLC en el Modelo 232 cuando proceda. Esos tres frentes son los que conviene cerrar antes de que llegue cualquier requerimiento, no después.

  ## Lo que NO hace una LLC

  - **No te exime de tributar en España.** Si vives en España, tributas en España por la renta mundial. La LLC ordena tu fiscalidad estadounidense (cero impuesto federal en Single-Member LLC pass-through, salvo Effectively Connected Income), no la española. La cuota del IRPF se calcula sobre el beneficio atribuido, no sobre los dividendos cobrados.
  - **No es una "offshore" ni un esquema BEPS.** Es una entidad estadounidense reconocida por el IRS, registrada en un estado concreto con dirección física, con agente registrado y con obligaciones informativas anuales. Las jurisdicciones offshore clásicas (BVI, Belice, Seychelles) no aparecen en ningún papel; una LLC sí, en cinco sitios distintos.
  - **No te protege si hay confusión patrimonial.** El velo corporativo (*pierce the corporate veil*) se levanta en cuanto un juez detecta que la LLC y el socio son la misma persona en la práctica: cuentas mezcladas, gastos personales pagados desde la cuenta de la LLC, sin Operating Agreement firmado o sin contabilidad mínima. Tres movimientos sospechosos bastan.
  - **No te ahorra cotizaciones a la Seguridad Social en España.** Si eres residente fiscal en España y autónomo, tu cuota mensual sigue siendo la misma. La LLC opera tu actividad económica frente a clientes internacionales; tu cotización personal en RETA es independiente y depende de tu base elegida en el <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de Seguridad Social.
  - **No te libra de declarar las cuentas extranjeras.** Si la suma de cuentas en EE. UU. (Mercury, Relay, Wise USD) supera 50.000 € a 31/12, **Modelo 720** antes del 31 de marzo. Si tienes criptoactivos custodiados en exchanges fuera de España por más de 50.000 €, **Modelo 721** en el mismo plazo. Las dos obligaciones son del residente fiscal, no de la LLC.

  En Exentax revisamos estos cinco frentes cada año junto con el calendario federal estadounidense (Form 5472, 1120 pro-forma, FBAR, Annual Report estatal y BOI Report cuando aplique). El objetivo es que ninguna inspección encuentre un cabo suelto y que la estructura sostenga revisiones a 5-7 años vista.
<!-- /exentax:defensa-fiscal-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22como%20disolver%20cerrar%20llc%20paso%20a%20paso%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

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
