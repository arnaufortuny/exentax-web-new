export default `

Es la pregunta más repetida cuando un cliente cierra su LLC con nosotros: "¿Mercury, Wise o Slash le cuentan a Hacienda lo que tengo?". La respuesta corta no se la suele dar nadie con claridad. Aquí va: **una cuenta financiera abierta en Estados Unidos por una LLC de no residente no se intercambia automáticamente con tu Hacienda local**. Y ese punto, bien entendido, es uno de los pilares que hacen que una estructura LLC bien diseñada funcione con la discreción profesional y el orden que se esperan de ella.

Eso no significa "esconder". Significa que tu estructura está montada en una jurisdicción que opera con sus propias reglas, y que tu compliance es el que tú decides hacer en tu país, sin sorpresas externas.

## Lo que la gente cree que pasa (y no pasa)

> "Si Mercury es americano y yo soy europeo, mis saldos terminan en la AEAT por algún acuerdo automático."

Falso. Te explicamos por qué con el marco real, no con el marco del miedo.
## Cómo funciona el intercambio internacional de información (los hechos)

Hay dos sistemas globales que se confunden constantemente. Conviene separarlos.

### CRS (Common Reporting Standard)

Es el estándar de la <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>. Más de 100 países lo aplican. Sus bancos identifican cuentas de no residentes y reportan saldos y rentas a las autoridades fiscales del país de residencia del titular.

**Estados Unidos no participa en CRS. No es firmante. No reporta CRS. No recibe CRS.**

Cualquier institución financiera 100 % estadounidense, abriendo una cuenta a una LLC US, queda fuera del circuito CRS. No hay flujo automático hacia tu país.

### FATCA

Es la ley americana. Va en una sola dirección: obliga a bancos extranjeros (europeos, asiáticos, latinoamericanos) a reportar al <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> las cuentas de **US persons** (ciudadanos y residentes fiscales americanos).

FATCA **no exporta automáticamente datos de cuentas US a Hacienda local de un residente europeo o latinoamericano**. Es un sistema de reporte hacia Estados Unidos, no desde Estados Unidos. Algunos países firmaron IGAs recíprocos en teoría, pero en la práctica el flujo desde el IRS hacia haciendas extranjeras a nivel cuenta-por-cuenta de personas físicas no US es inexistente para el perfil típico de un dueño de LLC.
### Mercury, Slash y Relay: instituciones US, fuera del CRS

Las tres son fintechs registradas en EE. UU. con bancos US como custodios:

- **Mercury** opera con Choice Financial Group, Column NA y Evolve Bank & Trust como bancos asociados.
- **Slash** opera como cuenta corporativa US con producto de tesorería en bonos del Tesoro y rendimiento competitivo.
- **Relay** opera con Thread Bank como custodio.

Las tres son instituciones financieras estadounidenses. **Las tres están fuera del CRS** porque EE. UU. no participa. Cumplen con sus obligaciones de reporting al IRS (formularios 1099 cuando aplica, etc.), pero no envían información automática a la AEAT, al SAT, al SII chileno ni a la DGI argentina.

Lo que esto significa, en términos prácticos: **el saldo de tu LLC en Mercury no se cruza automáticamente con tu IRPF**. La trazabilidad existe, pero permanece dentro del sistema US.
## Wise: el matiz importante

Wise opera con varias entidades en distintas jurisdicciones. Esto es lo que cambia el reporting:

- **Wise US Inc.** (cuenta US para LLC americanas, IBAN/ACH/wire en USD): es entidad estadounidense. **Está fuera del CRS.** Igual que Mercury.
- **Wise Europe SA** (cuenta multidivisa europea con IBAN belga): es entidad UE. Una **Wise Business titularidad de una LLC estadounidense queda FUERA del CRS** (la LLC es entidad de EE. UU. y EE. UU. no es jurisdicción CRS); en cambio, una **Wise Personal a nombre de un individuo residente fiscal en una jurisdicción CRS** sí reporta saldos al país de residencia fiscal del titular vía Wise Europe SA (Bélgica).

Para una LLC abierta hoy con Wise Business y residencia operativa en EE. UU. la cuenta principal va por Wise US Inc. Eso te deja fuera del CRS para esa cuenta. Si además operas la cuenta multidivisa europea, entonces ahí sí hay reporting CRS sobre esa parte.

**Conclusión limpia: Wise US Inc. no reporta CRS. Wise Europe SA sí.** Saberlo te permite estructurar la operativa con criterio.
### Wallester: caso distinto, hay que decirlo claro

Wallester es emisor europeo de tarjetas (Estonia/UE). Está dentro del marco CRS europeo. Cuando emites tarjetas Wallester ligadas a una cuenta operativa, el reporting de la cuenta subyacente depende de dónde esté la cuenta. Si conectas Wallester a una cuenta US (Mercury, Wise US, Relay), la cuenta sigue fuera de CRS; si la conectas a una cuenta EMI europea, entra al circuito CRS.

Es una herramienta operativa potente, pero hay que diseñarla sabiendo qué entidad emite cada pieza.
### Pasarelas de pago: Stripe, PayPal, Whop, Hotmart, Adyen

Las pasarelas no son cuentas bancarias. Son procesadores de transacciones que liquidan a la cuenta bancaria que les indiques. **No están dentro del CRS** y no reportan saldos. Reportan flujos al fisco de su jurisdicción cuando la normativa lo exige (1099-K en EE. UU. para Stripe US, por ejemplo), pero los fondos viven en tu cuenta bancaria, no en la pasarela.

Una LLC que cobra por Stripe US y liquida a Mercury opera todo el ciclo dentro del sistema financiero estadounidense. Limpio, eficiente, sin reporting CRS automático hacia tu país.
### Acceder a información de una LLC US: cómo es realmente

Una LLC bien constituida en Wyoming, Nuevo México o Delaware tiene **anonimato registral**:

- El propietario no consta en registros públicos.
- El **registered agent** figura como punto de contacto legal.
- El **BOI Report** (<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>) identifica al beneficial owner ante el regulador federal, **no ante el público** ni ante haciendas extranjeras de forma automática.

Que una autoridad extranjera quiera saber quién está detrás de una LLC requiere una solicitud formal por canales bilaterales (asistencia mutua, requerimiento judicial). No es automático, no es trivial y no se hace por curiosidad. Eso es lo que en la práctica protege la operativa de un cliente Exentax que tiene su LLC bien estructurada.
### DAC7 y DAC8: directivas europeas, no aplican a EE. UU.

DAC7 (plataformas digitales) y DAC8 (cripto) son directivas de la Unión Europea. Imponen obligaciones a plataformas y exchanges con presencia europea, no a una LLC americana ni a sus cuentas US. Tu LLC no entra en DAC7 ni en DAC8 por el hecho de existir o por operar con clientes internacionales.

Como residente fiscal europeo tienes tus propias obligaciones declarativas (Modelo 720/721 en España, equivalentes en Portugal, Francia, Alemania), y eso lo gestionas a tu ritmo y con tu asesor local. La LLC no añade ni quita aquí: añades el activo si supera el umbral, lo declaras, sigues operando.
## Lo que vemos cada semana en Exentax

Tres patrones reales:

**1. El cliente que llega con dudas**: lleva años leyendo en YouTube versiones contradictorias y abre la conversación esperando lo peor. Le mostramos cómo funciona el sistema de verdad: cuenta US fuera de CRS, FATCA bilateral pero sin flujo cuenta-a-cuenta hacia su país, anonimato registral real. Sale entendiendo que, bien estructurada y declarada, la operativa es perfectamente sólida.

**2. El cliente que ya retira a su cuenta personal en España todos los meses**: aquí sí hay un punto operativo a corregir. No porque la LLC reporte (no lo hace), sino porque las transferencias entrantes en su cuenta española sí están dentro del sistema CRS español. Lo que diseñamos es un flujo más limpio: tarjeta corporativa para gastos, distribuciones planificadas y documentadas, no goteo aleatorio hacia cuenta local.

**3. El cliente que tiene Wise multidivisa europea + Mercury**: le explicamos qué entidad reporta qué. Habitualmente reorganizamos para que la operativa principal viva en Wise US o Mercury y el módulo europeo se use sólo para casos puntuales.
### Cómo se hace bien

Una estructura financiera Exentax tipo:

- **Cuenta principal de la LLC** en Mercury o Wise US Inc. → fuera de CRS, ACH y wire en USD, integraciones contables.
- **Tesorería con rendimiento** en Slash → bonos del Tesoro US, capital ocioso productivo, mismo perímetro US.
- **Tarjetas corporativas** Wallester → control granular de gastos operativos.
- **Pasarelas** Stripe US, PayPal Business, Whop, Hotmart según producto → liquidación a Mercury, ciclo cerrado en US.
- **Brokers** según objetivo: Interactive Brokers (acciones/ETFs/opciones, abre a LLC de no residentes con W-8BEN-E), Tradovate (futuros), Kraken (cripto, opera con LLC).
- **Cuenta personal local separada** sólo para gasto personal final, alimentada por distribuciones planificadas, no por chorro permanente.

Con este diseño, la operativa fiscal es coherente: la LLC vive en EE. UU. se mueve dentro de EE. UU. y tú decides cuándo y cómo distribuyes a tu vida personal con la documentación correcta.
### Por qué Exentax

Porque diseñamos esto desde el primer día y no como parche. La cuenta US, la tesorería, la tarjeta, la pasarela, el broker y el flujo a tu cuenta personal van pensados como un sistema, no como piezas sueltas que luego no encajan. Cuando todo está estructurado bien:

- No hay incertidumbre sobre el reporting porque sabes exactamente qué entidad reporta qué.
- La trazabilidad está limpia, lo que te protege ante cualquier requerimiento.
- Tu separación patrimonial real funciona: la LLC es la LLC, tu vida personal es tu vida personal.
- El compliance US (Form 5472, BOI, mantenimiento del agente) lo llevamos nosotros.
## Referencias legales y normativas

Este artículo se apoya en normativa vigentes actualmente. Citamos las fuentes principales para que puedas verificarlo:

- **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report ante FinCEN).
- **España.** Ley 35/2006 (LIRPF), arts. 8, 9 (residencia), 87 (atribución de rentas), 91 (transparencia fiscal internacional para personas físicas); Ley 27/2014 (LIS), art. 100 (transparencia fiscal internacional para sociedades); Ley 58/2003 (LGT), arts. 15 (conflicto en aplicación de la norma) y 16 (simulación); Ley 5/2022 (régimen sancionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 720); Orden HFP/887/2023 (Modelo 721 cripto).
- **Convenio España–EE. UU.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de 22/12/1990 (CDI original); Protocolo en vigor desde 27/11/2019 (renta pasiva, *limitation on benefits*).
- **UE / OCDE.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetrías híbridas); Estándar Común de Reporte (CRS) de la OCDE.
- **Marco internacional.** Modelo de Convenio OCDE, art. 5 (establecimiento permanente) y comentarios; Acción 5 BEPS (sustancia económica); FATF Recommendation 24 (titularidad real).

<!-- exentax:calc-cta-v1 -->
> <a href="/es/agendar">Consulta gratuita sin compromiso</a>
<!-- /exentax:calc-cta-v1 -->

La aplicación concreta de cualquiera de estas normas a tu caso depende de tu residencia fiscal, la actividad de la LLC y la documentación que mantengas. Este contenido es informativo y no sustituye al asesoramiento profesional personalizado.
### Próximos pasos

Ahora que tienes el contexto completo, el siguiente paso natural es contrastarlo con tu propia situación: qué encaja, qué no, y dónde están los matices que dependen de tu residencia, tu actividad y tu volumen. Una revisión rápida de tu caso suele ahorrar mucho ruido antes de tomar cualquier decisión estructural.

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
- **EIN y notificaciones.** Sin EIN no se puede presentar 5472 ni BOI. El IRS no avisa antes de sancionar; las multas se descubren al actuar contra el EIN o al rechazar una próxima presentación.

<!-- exentax:execution-v2 -->
## Lo que reportan y lo que no reportan las cuentas USA de tu LLC

La discreción real de las cuentas americanas no es un mito ni una promesa absoluta: es una asimetría documentada del sistema financiero internacional, con límites concretos y un manual de uso si quieres aprovecharla bien. Estos son los hechos, sin teorías.

- **EE. UU. no participa en CRS.** Es el único G20 que no firmó el Common Reporting Standard. La consecuencia práctica: Mercury, Relay, Choice Financial, Evolve y Column N.A. no tienen obligación de enviar saldos automáticamente al país de residencia del titular. No es un truco, es la arquitectura del sistema desde 2014. Hemos analizado por qué esa posición es estructural y por qué tampoco la cambia la nueva ola en <a href="/es/blog/crs-2-0-carf-por-que-usa-no-firmara-llc">CRS 2.0 y CARF: por qué USA nunca firmará</a>.
- **FATCA en sentido inverso es parcial.** El IGA Modelo 1 con España (vigente desde 2013) exige que EE. UU. envíe a la AEAT información sobre cuentas mantenidas por residentes españoles en bancos americanos, pero el alcance real es: cuentas de personas físicas residentes con titularidad directa, con depósitos generadores de intereses. Las cuentas de entidad (LLC) en bancos como Mercury no caen en este flujo automático con la misma intensidad.
- **Lo que sí puede pedir la AEAT.** Vía MAP (Mutual Agreement Procedure) del convenio EE. UU.-España, la AEAT puede solicitar información específica sobre una cuenta concreta cuando hay indicio razonable. El proceso lleva 12-24 meses, requiere motivación y se utiliza para casos de cuantía relevante. No es automático ni masivo.
- **El error que rompe la asimetría.** Recibir transferencias desde la cuenta de tu LLC americana directamente a tu cuenta personal en España genera un trazo de origen visible para tu banco español, que sí reporta a la AEAT. La discreción de la cuenta USA se preserva si el flujo entra vía Wise multidivisa con motivación coherente (member draw, salario, dividendo según calificación), no como transferencia bruta sin contexto.

### Lo que más nos preguntan

**Entonces, ¿puedo no declarar mi cuenta USA?** No: tienes obligación declarativa propia (Modelo 720 si saldo combinado >50.000 €). La asimetría CRS no exime; lo que hace es eliminar el cruce automático que delata las omisiones en jurisdicciones CRS. Tu obligación de declarar sigue intacta.

**¿Cuánto tiempo durará esta asimetría?** No hay señal de que EE. UU. firme CRS a corto plazo (5 años). Sí hay señales de que FATCA inverso se intensifique progresivamente. La estructura sigue funcionando hoy y previsiblemente toda la década, pero conviene declarar correctamente para no depender de su persistencia.

En Exentax dejamos diseñada la operativa Mercury + Wise con flujos coherentes, declaración Modelo 720 limpia y documentación lista para cualquier requerimiento futuro, aprovechando la asimetría sin convertirla en omisión declarativa.
<!-- /exentax:execution-v2 -->

## Tu siguiente paso con Exentax

En Exentax constituimos y mantenemos LLCs de no residentes a diario: estado, EIN, Operating Agreement, BOI cuando aplique, banca con Mercury y Wise, pasarelas Stripe y Adyen, contabilidad mensual, Form 5472 y 1120 pro-forma cada año, y coordinación con tu fiscalidad en residencia. Si quieres validar tu caso con datos reales, agenda una asesoría con nuestro equipo y te explicamos paso a paso cómo encajaría en tu situación concreta.
<!-- task9-2026-expansion -->
## Flujo regulatorio: del banco USA al IRS y de ahí a Hacienda Española vía FATCA IGA Modelo 1

Esta sección rompe el mito de "los bancos americanos no reportan nada" y describe el flujo real de datos entre EE. UU. y España bajo el Acuerdo Intergubernamental FATCA Modelo 1 firmado el 14 de mayo de 2013, en vigor desde el 9 de diciembre de 2013 y actualizado en convenios de cooperación administrativa posteriores.

### Diagrama textual del flujo

1. **Banco o EMI estadounidense (Mercury, Choice, Column N.A., Wise US Inc., Relay Bank, Slash) → IRS**: cada institución financiera categorizada como FFI (Foreign Financial Institution recíproco) reporta anualmente al IRS los saldos y rentas de cuentas cuyo titular es persona o entidad española sujeta a FATCA. Si la cuenta pertenece a tu LLC, el reporte se hace bajo el GIIN de la entidad y el TIN del beneficiario efectivo declarado en el W-9 o W-8BEN/W-8BEN-E.
2. **IRS → AEAT**: el IRS empaqueta los datos del año natural y los transmite a la AEAT entre **septiembre y octubre del año siguiente**, en formato XML según el esquema FATCA XML 2.0 vigente desde julio de 2024.
3. **AEAT → cruce interno**: la AEAT cruza esos registros con tus declaraciones (Modelo 100 IRPF, Modelo 720 informativa de bienes en el extranjero, Modelo 721 de cripto). Las divergencias entran en el "Plan Anual de Control Tributario" del año en curso.

### Qué se transmite y qué NO se transmite

**Sí se transmite** (campos del esquema FATCA XML): nombre del titular o de la LLC, dirección, TIN español o NIF, número de cuenta, saldo a 31 de diciembre, intereses brutos pagados durante el ejercicio, dividendos y otras rentas brutas, productos brutos por venta de activos financieros, y código GIIN de la entidad.

**No se transmite automáticamente**: movimientos diarios, beneficiarios indirectos por debajo del 25 % de control, contraparte de cada operación, ni clasificación interna de la actividad económica subyacente. Tampoco se transmite información de cuentas con saldo inferior a **50.000 USD** mantenidas por personas físicas estadounidenses sin indicios de ser persona estadounidense según la due diligence FATCA, aunque para residentes en España la práctica de Mercury y Wise US Inc. más recientemente es reportar todas las cuentas vinculadas a un TIN español por encima de cero.

### Plazos críticos a recordar

- 31 de marzo de: las FFIs deben enviar al IRS el reporte FATCA del último ejercicio cerrado.
- 30 de septiembre de: ventana habitual del intercambio IRS-AEAT del último ejercicio cerrado.
- Octubre-diciembre: aparición de los datos en el "Renta Web" de la AEAT y posibles requerimientos.

### Cómo prepararte sin sorpresas

Mantén tu W-8BEN-E coherente con la estructura real, factura y cobra siempre desde la cuenta de la LLC, conserva los extractos mensuales en PDF y, si llega un requerimiento de información del 720, dispondrás de cinco días hábiles para responder. Pasa tu caso por la <strong>calculadora fiscal Exentax</strong> para ver el coste neto de declarar limpio frente a permanecer en una zona gris.

Si quieres ver cómo se cruzan estos datos con la presentación del 720 sigue con <a href="/es/blog/modelo-720-721-residentes-espana-cuentas-cripto-extranjero">la guía paso a paso del Modelo 720 y 721</a>, y si quieres revisar tu setup completo <a href="/es/agendar">reserva una llamada con el equipo Exentax</a> y lo auditamos contigo.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22Es%20la%20pregunta%20m%C3%A1s%20repetida%20cuando%20un%20cliente%20cierra%20su%20LLC%20con%20nosotros%3A%20%C2%BFMe%E2%80%A6%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si prefieres hablarlo en directo, <a href="/es/agendar">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

`;
