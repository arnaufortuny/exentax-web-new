export default `

Llega un momento en la vida de muchas LLCs en el que la banca con la que arrancaron deja de encajar. Mercury fue suficiente para empezar; ahora hace falta más sub-cuentas, otra divisa, otra tarjeta corporativa, otro nivel de control de roles. La pregunta es cómo reorganizar la stack bancaria sin cortar la operativa ni quemar relaciones.

Esta guía explica cómo se hace bien la transición desde Mercury hacia una combinación con Relay y/o Wise (o entre cualquier par equivalente), sin perder un día de cobros y sin disparar revisiones de KYC en ninguna de las plataformas.

## Por qué se reorganiza la banca de una LLC

Las razones típicas que vemos cada mes en Exentax:

- **Necesidad de sub-cuentas reales**: Relay ofrece hasta 20 sub-cuentas con su propio número de cuenta y routing, contra las 20 de Mercury que también las tiene pero con menor flexibilidad de roles.
- **Operativa multi-divisa**: Wise cubre 50+ divisas con tipo de cambio interbancario y comisiones explícitas. Mercury opera principalmente en USD.
- **Roles y aprobaciones**: cuando contratas a un bookkeeper o a un team member que necesita ver pero no mover dinero, Relay o un setup combinado lo resuelve mejor.
- **Resiliencia ante bloqueos**: la regla operativa más importante para una LLC adulta es **no depender de una sola institución bancaria**.
- **Cambios de modelo de negocio**: añadir suscripciones recurrentes, cobros en otras divisas, comisiones de plataformas internacionales.

Ninguna de estas razones obliga a cerrar la cuenta original. La pregunta no es "Mercury o Relay/Wise", es "qué stack montas".
### El principio rector: nunca cortar antes de tener el sustituto operativo

La mayoría de los problemas en una transición bancaria vienen de hacer las cosas en el orden equivocado: cerrar Mercury antes de tener Relay verificada, anunciar el cambio a clientes antes de tener el nuevo IBAN funcionando, mover toda la liquidez en un solo movimiento.

El principio es siempre el mismo: **paralelos primero, transición después, cierre al final**.
## Procedimiento paso a paso

### Paso 1. Abrir la nueva cuenta sin tocar la actual

Solicita la nueva cuenta (Relay, Wise Business o la combinación) usando los mismos datos exactos de la LLC que tienes en Mercury: nombre legal idéntico, dirección, EIN, beneficiarios reportados en BOI. Cualquier discrepancia entre plataformas dispara revisiones manuales.

Plazos típicos de aprobación: Relay 1-3 semanas, Wise Business 3-7 días.

### Paso 2. Hacer un test funcional con un movimiento pequeño

Antes de cualquier comunicación a clientes o proveedores, transfiere una cantidad simbólica desde Mercury a la nueva cuenta. Verifica que llega, que el routing/IBAN funciona correctamente y que la conciliación contable es limpia. No saltes este paso: descubrir aquí cualquier fallo es barato.

### Paso 3. Periodo de paralelos

Durante 2-3 meses, mantén ambas cuentas activas. Los nuevos clientes facturas con datos de la nueva cuenta; los existentes siguen pagando en Mercury hasta que tú decidas migrarlos uno a uno. Esto evita cualquier interrupción y te da tiempo para detectar fricciones.

### Paso 4. Migración progresiva de cobros recurrentes

Si tienes suscripciones, retainers mensuales o pagos recurrentes, comunícalo con anticipación razonable (30-45 días) y el formato adecuado:

> "A partir del [fecha], te enviaremos las facturas con datos bancarios actualizados. La empresa, el EIN y todo lo demás siguen igual; sólo cambian los datos para el ingreso. Adjuntamos los nuevos datos para que actualices."

Nada de drama, nada de explicaciones largas. Es un cambio operativo estándar que los clientes aceptan sin friccion cuando se comunica con normalidad.

### Paso 5. Migración de pasarelas de pago

Stripe, PayPal, DoDo y similares se actualizan en la configuración de payouts. La pasarela hace el siguiente payout al nuevo banco. Importante: cambiar los datos de payout puede activar una verificación adicional (pequeño test de microdepósitos), planifícalo en una ventana sin payouts pendientes urgentes.

### Paso 6. Reducir saldo en Mercury sin vaciarla

Lleva el saldo en Mercury a un mínimo operativo (el suficiente para cubrir últimos gastos pendientes, suscripciones todavía no migradas y un colchón de 30 días). No la vacíes a cero antes de tener todo migrado, porque cualquier cargo sorpresa sin saldo activa cierre de cuenta o problemas con proveedores.

### Paso 7. Cierre limpio o cuenta de respaldo

Llegado el momento, decides:

- **Cerrar Mercury formalmente** mediante la opción de la propia plataforma. Solicita confirmación por escrito y guárdala.
- **Mantenerla como cuenta de respaldo** con saldo mínimo activo. Es la opción que más recomendamos cuando la relación es buena: el coste de tener Mercury inactiva es bajo y aporta resiliencia.
### Errores típicos en una transición bancaria

- **Cambiar la dirección registrada de la LLC en mitad del proceso**. Hace que cada plataforma vea datos incoherentes y dispara revisiones simultáneas en todas. Si la dirección debe cambiar, hazlo antes o después, nunca durante.
- **Mover grandes cantidades en un solo movimiento entre Mercury y Relay/Wise**. Activa alertas de origen de fondos. Mejor varios movimientos espaciados con concepto claro.
- **Comunicar el cambio en bloque a todos los clientes el mismo día**. Genera ola de correos y dudas. Mejor por cohortes.
- **Cerrar Mercury antes de cobrar el último payout pendiente** de Stripe o similar. El payout rebota y se complica.
### Dimensión fiscal y de compliance

La reorganización bancaria **no requiere** ningún trámite ante el <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, ni Form 8822-B ni nada análogo, salvo que en el proceso cambies también la dirección de la LLC. El BOI Report no se actualiza por cambios de cuenta bancaria; sí se actualiza por cambio de dirección o de beneficiarios.

En la conciliación contable del ejercicio, asegúrate de mantener trazabilidad clara entre la fecha de transición y los saldos: tu contable o tu propio bookkeeping debe distinguir el período pre-transición y el post-transición sin lagunas. Es la única documentación que quedará en caso de revisión años después.
### Cómo lo abordamos en Exentax

En Exentax acompañamos transiciones bancarias completas: definimos contigo la stack objetivo (qué cuentas, qué función cumple cada una, qué redundancias), gestionamos el alta de las nuevas, supervisamos el periodo de paralelos y cerramos el ciclo con la conciliación limpia. El cliente no pierde un día de cobertura.

Si quieres validar si tu stack actual sigue siendo la adecuada o conviene reorganizarla, agenda una sesión inicial gratuita en nuestra página de agendamiento.
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

La normativa de información a <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a> y al IRS se ha movido en recent years; la versión vigente es esta:
### Puntos clave

- **BOI / Corporate Transparency Act: tu LLC NO está obligada (ventaja competitiva).** Tras la **interim final rule de FinCEN de marzo de 2025**, la obligación del BOI Report quedó **restringida a las "foreign reporting companies"** (entidades constituidas FUERA de EE. UU. y registradas para hacer negocios en un estado). Una **LLC formada en EE. UU. propiedad de un no residente NO presenta BOI Report**: un trámite menos en tu calendario, menos burocracia y una estructura más limpia que nunca. Si tu LLC se constituyó antes de marzo de 2025 y ya presentaste BOI, conserva el acuse. El estado normativo puede cambiar: **monitorizamos FinCEN.gov en cada presentación** y, si la obligación vuelve a aplicar, la gestionamos sin coste adicional. Estado vigente verificable en [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Para una **Single-Member LLC propiedad de un no residente**, las regulaciones finales de Treas. Reg. §1.6038A-1 (vigentes desde 2017) tratan a la LLC como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo cabecera: nombre, dirección, EIN, ejercicio fiscal) con el **Form 5472 anexado**. Se envía **por correo certificado o fax al IRS Service Center de Ogden, Utah**, **no se presenta vía MeF/e-file** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y año, más 25.000 USD por cada 30 días adicionales** sin presentación tras notificación del IRS.
- **Form 1120 sustantivo.** Solo aplica si la LLC ha realizado *check-the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 1120 con cifras reales. La LLC disregarded estándar **no presenta un 1120 sustantivo y no paga corporate tax federal**.
- **EIN y notificaciones.** Sin EIN no se puede presentar 5472 ni BOI. El IRS no avisa antes de sancionar; las multas se descubren al actuar contra el EIN o al rechazar una próxima presentación.

<!-- exentax:legal-refs-v1 -->
## Referencias: fuentes y normativa de banca

Toda la operativa bancaria descrita se apoya en documentación pública y políticas vigentes de cada plataforma actualmente:

- **Bank Secrecy Act y FinCEN.** 31 U.S.C. §5318 (programas KYC/AML obligatorios para instituciones financieras), 31 CFR Part 1010 (CIP, identificación del cliente) y 31 U.S.C. §5336 con su Reporting Rule de FinCEN del 1 de enero de 2024 (Beneficial Ownership Information Report).
- **FATCA y CRS.** IRC §1471-1474 (FATCA y formularios W-8/W-9), Acuerdos Intergubernamentales Modelo 1 firmados por EE. UU. con España y otros países LATAM, y el Estándar Común de Reporte (CRS) de la <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> en el que EE. UU. no participa pero que sí aplica a fintech con licencia europea (Wise Europe SA en Bélgica, Revolut Bank UAB en Lituania).
- **Plataformas concretas.** Términos de servicio publicados, política de privacidad y FAQ regulatoria de Mercury (Choice Financial Group / Evolve Bank, FDIC), Relay (Thread Bank, FDIC), Wise Business (FinCEN MSB en EE. UU.; Wise Europe SA en EU; Wise Payments Ltd. en UK), Revolut Business y Payoneer.

<!-- exentax:calc-cta-v1 -->
> <a href="/es/agendar">Consulta gratuita sin compromiso</a>
<!-- /exentax:calc-cta-v1 -->

Información a efectos divulgativos; cada caso bancario requiere análisis específico de KYC, jurisdicción de residencia y volumen operado.

## Te lo montamos sin que pierdas un fin de semana

Miles de freelancers y emprendedores ya operan con su LLC americana de forma 100% legal y documentada. En Exentax nos encargamos de todo el proceso: constitución, banca, pasarelas de pago, contabilidad, declaraciones IRS y compliance en tu país de residencia. Agenda una asesoría gratuita y te diremos con sinceridad si la LLC tiene sentido para tu caso, sin promesas absolutas.

<!-- exentax:cross-refs-v1 -->
### Más lecturas relacionadas

- [Justificar el origen de los fondos en una segunda ronda de KYC bancario](/es/blog/justificar-origen-fondos-kyc-bancario-segunda-ronda)
<!-- /exentax:cross-refs-v1 -->

## Actualización Exentax hoy: stack bancario al día

El stack bancario recomendado para una LLC actualmente ha consolidado tres piezas con funciones complementarias:

- **Mercury (operativa principal).** Cuenta a través de **Column NA**, cobertura **FDIC hasta 5 M USD** vía sweep, **wires domésticos a 0 USD**, internacionales a 0 USD entrantes y 5 USD salientes (depende del corredor), 20+ sub-cuentas gratuitas. Ideal como cuenta operativa para entradas/salidas USD y como base de la contabilidad.
- **Relay (multicuenta y reglas).** Hasta 20 cuentas operativas + reglas de auto-reparto (impuestos, opex, ahorro). Útil cuando la LLC empieza a separar buckets de caja sin pasarse al ERP. Compatible con Plaid para integración con Wave/Quickbooks.
- **Wise Business (multidivisa).** EMI con 50+ divisas a tipo medio interbancario, FX típico **0,4-1,5 %**, datos locales en 10+ países (USD ACH/wire, EUR SEPA, GBP Faster Payments, AUD BSB...). Indispensable si recibes en EUR/GBP o pagas a freelancers en LATAM/UE.

### Modelo de stack hoy según volumen

| Volumen anual | Configuración recomendada |
|---|---|
| < 50 k USD | Mercury solo |
| 50-300 k USD | Mercury + Wise (multidivisa) |
| 300 k-1 M USD | Mercury + Relay (buckets) + Wise (FX) |
| > 1 M USD | Mercury + Relay + Wise + cuenta tradicional EE. UU. (Bank of America/Chase) para wires escala |

### Reorganización en 4 pasos

1. **Inventario.** Lista todas las cuentas activas y su uso real (operativa, ahorro, FX, pagos a freelancers).
2. **Decisión.** Aplica el modelo según volumen y cierra las cuentas redundantes (cierre limpio: traspasar saldo, cancelar suscripciones vinculadas, esperar 30 días, solicitar cierre formal).
3. **Migración.** Reapunta clientes (nuevo wire instructions firmadas), actualiza facturas pendientes, redirige Stripe payouts.
4. **KYC preventivo.** Antes del primer movimiento grande en la nueva cuenta, sube proactivamente: Articles, EIN Letter, OA firmado y prueba de domicilio.

### Preguntas frecuentes hoy

**¿Mercury sigue siendo la opción por defecto actualmente?** Sí. La cobertura FDIC vía sweep y los 0 USD en wires domésticos siguen sin tener competencia clara para LLC no residentes.

**¿Cuándo conviene una cuenta tradicional?** A partir de ~1 M USD anuales o cuando trabajas con clientes corporate USA que pagan exclusivamente vía ACH desde bancos tradicionales.

**¿Wise reporta vía CRS?** Wise Europe SA (Bélgica) sí está sujeta a CRS para residentes europeos. Documenta correctamente tu residencia fiscal.

<!-- exentax:execution-v2 -->
## Cómo reorganizamos la banca de una LLC en Exentax cuando ya no escala

Cuando una LLC empieza a recibir pagos serios, el stack inicial (a veces solo Mercury) se queda corto: límites, retenciones, una sola pasarela y cero respaldo. El método Exentax lo reorganiza sin downtime ni cierre de cuentas.

- **Cuenta principal y cuenta espejo** simultáneas: Mercury o Relay como operativa, Wise como respaldo multi-divisa, Stripe + Paddle/DoDo en pasarela.
- **Migración progresiva** de domiciliaciones y suscripciones para que ningún cliente vea fallar un cobro durante la transición.
- **KYC ampliado preparado** con descripción de actividad, MCC y documentación coherente entre todas las cuentas para superar los segundos controles.

Si tu stack actual ya no aguanta, lanza la <strong>calculadora Exentax</strong> o reserva treinta minutos: te entregamos el plan de migración por escrito antes de tocar nada.
<!-- /exentax:execution-v2 -->

¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:+34614916910">+34 614 916 910</a> o escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22reorganizar%20banca%20llc%20mercury%20relay%20wise%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si prefieres hablarlo en directo, <a href="/es/agendar">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->
`;
