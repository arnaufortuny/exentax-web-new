export default `

Cuando alguien ve por primera vez la combinación "LLC en Estados Unidos" y "residente fiscal en España", la pregunta inmediata es siempre la misma: **"¿y entonces dónde pago impuestos?"**. La respuesta es clara: **en España**, sobre el beneficio neto, gracias al **convenio de doble imposición entre EE.UU. y España**. La LLC no se usa para "no pagar", se usa para **no pagar dos veces** y para optimizar dentro de lo legal.

Esta guía explica el convenio paso a paso, en lenguaje claro, aplicado al caso concreto de una LLC de no residente con dueño residente en España. Con artículos, tipos, ejemplos numéricos, formularios y referencias a la AEAT.

## Qué es y por qué existe

Un **convenio de doble imposición** (CDI o tratado fiscal) es un acuerdo bilateral entre dos países para repartirse el derecho a gravar las rentas que cruzan fronteras y para evitar que la misma renta se grave dos veces, en origen y en destino. Sin convenio, lo natural sería que pagaras impuestos en EE.UU. (porque tu LLC está allí) **y** otra vez en España (porque tú resides allí). Eso ahogaría cualquier negocio internacional.

Para evitarlo, EE.UU. y España firmaron en **1990** un Convenio para evitar la doble imposición y prevenir la evasión fiscal en materia de impuestos sobre la renta, modernizado por un **Protocolo firmado en 2013** que entró en vigor el **27 de noviembre de 2019** (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de 23 de octubre de 2019). Este protocolo actualizó tipos de retención, intercambio de información y cláusulas anti-abuso.

Los artículos clave para entender una LLC con dueño español son:

- **Art. 4, Residencia fiscal:** define dónde se considera residente cada persona o entidad.
- **Art. 5, Establecimiento permanente:** clave para saber si EE.UU. puede gravarte como negocio operando en su territorio.
- **Art. 7, Beneficios empresariales:** la regla básica para servicios.
- **Art. 10, Dividendos:** retenciones reducidas.
- **Art. 11, Intereses:** generalmente exentos.
- **Art. 12, Cánones (royalties):** tipos reducidos.
- **Art. 17, Limitación de beneficios:** evita que cualquier vehículo se beneficie del convenio sin sustancia real.
- **Art. 24, Métodos para eliminar la doble imposición:** cómo España reconoce lo pagado en EE.UU. (y viceversa).
## Cómo funciona para LLCs disregarded entity

Una **Single-Member LLC** propiedad de un no residente en EE.UU. se trata por defecto como **Disregarded Entity**: para el <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, no existe como contribuyente independiente. Sus ingresos y gastos se imputan directamente a su único miembro. Esto se conoce como **pass-through taxation**.

A efectos del convenio, la lectura es la siguiente:

- La LLC **no es residente fiscal en EE.UU.** porque no tributa allí en ninguna jurisdicción interna como entidad.
- Quien debe analizarse es **el miembro**: si reside fiscalmente en España, el convenio se aplica al miembro residente español.
- Por tanto, los beneficios netos de la LLC tributan en **España** según el IRPF del miembro.
- En EE.UU. la LLC solo cumple obligaciones informativas (Form 5472 + 1120 pro forma, BOI Report) si no tiene **ECI** (renta efectivamente conectada con un negocio o actividad en EE.UU.).

La **<a href="https://petete.tributos.hacienda.gob.es" target="_blank" rel="noopener">DGT</a>** ha confirmado este planteamiento en consultas vinculantes como la **V0290-20** y otras posteriores, calificando la LLC estadounidense como entidad transparente o en régimen de atribución de rentas a efectos españoles, dependiendo del análisis específico de cada caso.
### Dónde se pagan impuestos realmente

La respuesta corta y honesta para el caso típico de una LLC de servicios sin establecimiento permanente en EE.UU. y dueño residente en España:

- **En EE.UU.: 0% federal, 0% estatal** (en NM/WY/DE para LLCs sin actividad local). Solo costes de mantenimiento.
- **En España: IRPF sobre el beneficio neto** de la LLC, integrado en tu declaración de la renta como rendimientos de actividad económica en régimen de atribución, según tu marginal personal (19% al 47%).

Es decir, **pagas en España, pero pagas mejor**: sobre el beneficio neto después de deducciones amplias, sin cuota mensual de autónomos, sin pagos a cuenta trimestrales propios del autónomo y con un stack profesional mucho más eficiente.
### Tipos de ingresos cubiertos por el convenio

| Tipo de ingreso | Sin convenio (USA) | Con convenio USA-España |
|-----------------|--------------------|--------------------------|
| Servicios prestados desde fuera de USA | 30% retención | 0% (Art. 7, sin EP) |
| Royalties (software estándar, copyright cultural) | 30% | 0-10% según tipo (Art. 12) |
| Dividendos de empresas USA | 30% | 15% general / 10% en participaciones cualificadas (Art. 10) |
| Intereses bancarios o de bonos | 30% | 0% en general (Art. 11) |
| Ganancias de capital sobre acciones USA | 30% / variable | Tributación principal en España (Art. 13) |
| Pensiones | 30% | Reglas específicas (Art. 20) |

Para una LLC operativa de servicios digitales, la combinación más relevante es: **0% de retención USA sobre servicios** y **tributación en España como rendimiento de actividad económica**.
### Certificado de residencia fiscal española

Para activar el convenio frente al pagador estadounidense, necesitas demostrar que eres **residente fiscal en España**. La AEAT emite un **certificado de residencia fiscal a efectos del convenio** que se solicita por sede electrónica con el modelo correspondiente. Este certificado tiene validez de **un año** desde su emisión y conviene tenerlo siempre actualizado, sobre todo si trabajas con brokers o pagadores que aplican retenciones complejas.

En la mayoría de cobros vía Stripe, PayPal, AdSense o similares no te lo pedirán activamente porque el W-8BEN-E ya hace el trabajo. Pero ante una inspección o ante un broker como Interactive Brokers o un cliente corporativo grande, el certificado es la prueba dura de tu residencia.
## Formularios necesarios

- **W-8BEN-E:** lo presenta tu LLC ante cada pagador USA para acreditar residencia del beneficiario y tipo de convenio aplicable. Ver nuestra <a href="/es/blog/w8-ben-y-w8-ben-e-guia-completa">guía completa de W-8BEN y W-8BEN-E</a>.
- **W-8BEN:** para personas físicas no residentes que cobren a su nombre, no a nombre de la LLC.
- **Form 1042-S:** lo emite el pagador USA si te ha aplicado alguna retención. Lo necesitas para reclamar la devolución o para acreditarlo en España como impuesto satisfecho en el extranjero.
- **Form 5472 + Form 1120 pro forma:** declaración informativa anual de la LLC ante el IRS.
- **BOI Report:** ante <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>, identificando al beneficiario último.
- **Modelo 100 (IRPF):** tu declaración anual en España donde integras el beneficio neto de la LLC.
- **Modelo 720/721:** si el saldo agregado de cuentas, valores o criptos en el extranjero supera 50.000 €.
- **Certificado de residencia fiscal:** emitido por la AEAT cuando lo necesites para un pagador exterior.
## Casos prácticos con cifras

### Caso A, Consultor de software con clientes USA y EU

- LLC factura **120.000 USD/año** por servicios prestados desde España.
- Gastos LLC: 30.000 USD (software, hardware, viajes, registered agent, asesoría).
- Beneficio neto: 90.000 USD ≈ 82.000 €.
- USA: **0%** retención (W-8BEN-E activo, sin EP). Coste de mantenimiento ≈ 2.000 €.
- España: IRPF marginal aprox. 35-40% efectivo sobre 82.000 €. Cuota IRPF ≈ 25.000-28.000 €.
- **Total tributario:** 27.000-30.000 €. Frente a 38.000-45.000 € que pagaría como autónomo equivalente con cuota incluida.

### Caso B, Trader o inversor que opera dividendos USA vía LLC

- LLC titular de una cuenta en Interactive Brokers.
- Dividendos americanos cobrados: 10.000 USD/año.
- Sin convenio: retención del 30% → 3.000 USD al IRS.
- Con W-8BEN-E + convenio: retención del 15% (Art. 10) → 1.500 USD al IRS.
- En España: incluyes los dividendos en la base del ahorro y aplicas la **deducción por doble imposición internacional** del Art. 80 LIRPF por los 1.500 USD ya pagados en USA, hasta el límite del impuesto español que correspondería a esa renta.

### Caso C, Royalty por software vendido en USA

- LLC vende licencias de software a empresas USA: 50.000 USD/año.
- Si se califica como royalty (Art. 12), la retención puede ser **5%** según subtipo y subbloque del convenio.
- Si se califica como prestación de servicios o venta de copia (no royalty), aplica Art. 7 → **0%**.
- La calificación correcta es clave y depende del contrato. Aquí es donde un asesor fiscal experto vale lo que cuesta.
### Retenciones en origen y cómo recuperarlas

Si te aplican retenciones en USA (porque no tenías W-8 firmado, porque era un pago de dividendos o royalties, o porque el pagador se equivocó), tienes dos vías:

1. **Reclamación directa al pagador:** si fue un error de su parte y aún están dentro del año fiscal, suelen poder ajustarlo y devolverte la diferencia.
2. **Solicitud de devolución al IRS:** mediante el **Form 1040-NR** (persona física) o procedimientos asociados al **1042-S**. Es lento (12-18 meses típicamente) y requiere ITIN o EIN. Lo razonable es no llegar a esto y dejar los W-8 perfectos desde el principio.

En España, las retenciones efectivamente pagadas en EE.UU. dentro del límite del convenio se pueden compensar mediante la **deducción por doble imposición internacional (DDII)** del IRPF. Es el mecanismo que evita que pagues dos veces sobre la misma renta.
## Declaración en España: Modelo 100

En tu **declaración de la renta anual (Modelo 100)** integras los beneficios netos de la LLC como **rendimientos de actividad económica** en régimen de atribución de rentas, salvo que tu asesor califique el caso de otra forma justificada. Los pasos típicos:

1. Convertir los importes USD a EUR usando el tipo de cambio medio del año o del momento del cobro, según el criterio que utilices de forma consistente.
2. Calcular ingresos totales y gastos deducibles del ejercicio.
3. Imputar el beneficio neto en la casilla correspondiente del Modelo 100.
4. Aplicar la **deducción por doble imposición internacional** por las retenciones efectivamente pagadas en EE.UU. dentro del límite del convenio.
5. Presentar el **modelo 720/721** si superas los umbrales de bienes en el extranjero (cuentas bancarias, valores, criptos).
6. Conservar toda la documentación: extractos de Mercury/Relay/Wise, facturas emitidas por la LLC, contratos, W-8BEN-E firmados, Form 1042-S si los hay, declaraciones IRS y justificantes de gastos.

La AEAT puede pedir documentación de respaldo en cualquier momento. Tener un sistema ordenado desde el día uno es la diferencia entre una inspección que se cierra rápido y una que se complica.
## Por qué necesitas un asesor fiscal español

Una LLC bien constituida en USA es solo la mitad del trabajo. La otra mitad es **integrarla correctamente en tu IRPF español**. Esto incluye:

- Calificar correctamente la renta (atribución, cánones, dividendos, ganancias).
- Aplicar el convenio y la deducción por doble imposición.
- Decidir el método de imputación (devengo vs caja).
- Cumplir con los modelos 720/721 si procede.
- Documentar gastos deducibles para que aguanten una inspección.

Un asesor fiscal español que entienda estructuras internacionales con LLCs no es opcional: es **parte del setup completo**. En Exentax cubrimos el lado USA (constitución, EIN, banca, compliance IRS y FinCEN, W-8 ante cada pagador) y coordinamos con tu asesor fiscal español, o te recomendamos uno si no tienes.

> Cada caso es individual. Las posiciones de la DGT pueden evolucionar y los protocolos del convenio se actualizan periódicamente. Esta guía es informativa, no sustituye al análisis personalizado de tu caso por un profesional cualificado.
## En resumen

- USA y España tienen un convenio firmado en 1990 y modernizado en 2019 que reparte el derecho a gravar y evita la doble imposición.
- Para una LLC disregarded entity con dueño residente español, los beneficios empresariales tributan **en España**, sin retención en USA si no hay establecimiento permanente.
- Dividendos, intereses y royalties tienen tipos reducidos específicos.
- El **W-8BEN-E** es la herramienta operativa para activar el convenio con cada pagador USA.
- Las retenciones soportadas en USA se compensan en España vía deducción por doble imposición.
- Necesitas tener tu **certificado de residencia fiscal** disponible y declarar correctamente en el **Modelo 100**, además de **modelos 720/721** si procede.
- El setup completo: **Exentax + asesor fiscal español**.

Si quieres revisar tu caso con cifras concretas, **agenda una consulta gratuita de 30 minutos** con Exentax y te explicamos exactamente cómo encajaría tu LLC dentro del convenio USA-España y cómo coordinarlo con tu asesor en España.

Para profundizar más, lee también <a href="/es/blog/llc-alternativa-autonomo-espana">LLC como alternativa a ser autónomo en España</a> y <a href="/es/blog/w8-ben-y-w8-ben-e-guia-completa">Guía completa de los formularios W8-BEN y W8-BEN-E</a>.
## Compliance fiscal en tu país: CFC, TFI y atribución de rentas

Una LLC americana es una herramienta legal y reconocida internacionalmente. Pero el cumplimiento no termina al constituirla: como propietario residente fiscal en otro país, tu administración tributaria sigue teniendo derecho a gravar lo que la LLC genera. Lo importante es saber **bajo qué régimen** aplica esa tributación.

### Por jurisdicción

- **España (LIRPF/LIS).** Si la LLC es una *Single-Member Disregarded Entity* operativa (servicios reales, sin pasividad significativa), Hacienda suele tratarla por **atribución de rentas (art. 87 LIRPF)**: los beneficios netos se imputan al socio en el ejercicio en que se generan, integrándose en la base general del IRPF. Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada por residente español con rentas mayoritariamente pasivas, puede activarse el régimen de **transparencia fiscal internacional (art. 91 LIRPF para personas físicas, art. 100 LIS para sociedades)**. La diferencia entre uno u otro régimen no es opcional: depende de la sustancia económica, no del nombre.
- **Modelos informativos.** Cuentas bancarias en EE. UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022; sanciones ahora dentro del régimen general LGT). Operaciones vinculadas con la LLC y dividendos repatriados: **Modelo 232**. Criptoactivos custodiados en EE. UU.: **Modelo 721**.
- **CDI España–EE. UU.** El convenio (BOE 22/12/1990, Protocolo en vigor 27/11/2019) ordena la doble imposición sobre dividendos, intereses y royalties. Una LLC sin establecimiento permanente en España no constituye, por sí sola, EP del socio, pero la dirección efectiva sí puede crearlo si toda la gestión se hace desde territorio español.
- **México, Colombia, Argentina y otros LATAM.** Cada jurisdicción tiene su propio régimen CFC (México: Refipres; Argentina: rentas pasivas del exterior; Chile: art. 41 G LIR). El principio común: lo que la LLC retiene como beneficio se considera percibido por el socio si la entidad se considera transparente o controlada.

<!-- exentax:calc-cta-v1 -->
> <a href="/es/agendar">Consulta gratuita sin compromiso</a>
<!-- /exentax:calc-cta-v1 -->

La regla práctica: una LLC operativa, con sustancia, declarada correctamente en residencia, es **planificación fiscal legítima**. Una LLC que se usa para ocultar ingresos, simular no residencia o desplazar rentas pasivas sin justificación económica entra en el terreno del **art. 15 LGT (conflicto en aplicación de la norma)** o, en el peor caso, del **art. 16 LGT (simulación)**. La diferencia la marcan los hechos, no el papel.
En Exentax montamos la estructura para que encaje en el primer escenario y documentamos cada paso para que tu declaración local sea defendible ante una eventual revisión.

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

<!-- exentax:legal-refs-v1 -->
## Referencias: marco legal y normativa

La argumentación de este artículo descansa en la siguiente normativa y doctrina, vigente actualmente:

- **España.** Ley 35/2006 del IRPF (arts. 8, 9 y 91 sobre residencia fiscal y transparencia fiscal internacional), Ley 27/2014 del Impuesto sobre Sociedades (art. 100 sobre TFI), Ley 58/2003 General Tributaria, Ley 5/2022 que reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 720) y Orden HFP/887/2023 (Modelo 721 de criptoactivos en el extranjero).
- **Doctrina administrativa.** Resoluciones del <a href="https://serviciostelematicosext.hacienda.gob.es/TEAC/DYCTEA" target="_blank" rel="noopener">TEAC</a> y consultas vinculantes de la DGT relativas a LLC unipersonales (entre otras V0443-08, V1631-17, V1147-22), interpretadas a la luz del BOE de febrero de 2020 sobre clasificación de entidades extranjeras transparentes.
- **Convenios y normativa internacional.** Convenio de Doble Imposición entre España y EE. UU. firmado en 1990 con Protocolo de 2013 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Convenio <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> con sus Comentarios.
- **EE. UU.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa FBAR (31 CFR 1010.350).

Este contenido es divulgativo y no sustituye al asesoramiento personalizado para tu situación fiscal concreta.

<!-- exentax:execution-v2 -->
## Cómo se aplica el convenio EE. UU.-España a tu LLC, cláusula a cláusula

El convenio entre España y Estados Unidos firmado en 1990 y modificado por el Protocolo en vigor desde 2019 (BOE 23 de octubre de 2019) reparte la potestad tributaria entre ambos países. Para una SMLLC en atribución de rentas, lo que importa son cuatro artículos concretos. Te los explicamos en orden de impacto.

- **Artículo 7 - Beneficios empresariales.** Si la LLC es transparente y no constituye establecimiento permanente en EE. UU., los beneficios tributan exclusivamente en España, en tu IRPF como rendimiento de actividad económica. Esta es la lógica que hace que una SMLLC pague típicamente cero impuesto federal y todo el peso recaiga en residencia.
- **Artículo 14 (Protocolo 2019) - Servicios personales independientes.** Reforzado tras el Protocolo: para profesionales independientes residentes en España sin base fija en EE. UU., los honorarios se gravan exclusivamente en España. Combinado con el art. 7, blinda la operativa habitual de consultor o desarrollador.
- **Artículo 23 - Eliminación de doble imposición.** Permite acreditar en España el impuesto pagado en EE. UU. (federal y estatal), con el límite de la cuota española sobre la misma renta. Para una SMLLC con cero impuesto federal, el crédito es nulo pero también lo es la doble imposición real.
- **Artículo 25 (Protocolo 2019) - Procedimiento amistoso (MAP).** Si AEAT y IRS califican de forma divergente la misma renta, MAP permite resolver vía acuerdo entre administraciones en plazo aproximado de 24 meses. Útil si recibes un requerimiento divergente; la mayoría de casos no llega aquí porque la doctrina DGT es clara.

### Lo que más nos preguntan

**¿Necesito Form W-8BEN-E para mi LLC?** Sí, cuando un cliente americano te pide certificación de no residencia. La SMLLC con socio no residente certifica como entidad pass-through y el socio adjunta W-8BEN personal. Sin esta documentación, los pagadores americanos retienen 30 % por defecto.

**¿El convenio cubre dividendos y plusvalías?** Sí, pero con tipos máximos diferentes (15 % dividendos, 0-21 % intereses según supuesto, plusvalías generalmente solo en residencia). Para una SMLLC que distribuye al socio, el "dividendo" se ignora por transparencia y todo se imputa como beneficio del art. 7.

En Exentax mapeamos cada flujo de tu LLC contra el artículo aplicable del convenio, dejamos la documentación W-8 lista y diseñamos la imputación en IRPF para que la declaración española sea coherente con el tratamiento federal.
<!-- /exentax:execution-v2 -->

## Hablemos de tu estructura

Cada caso tiene matices: tu país de residencia, el tipo de actividad, dónde están tus clientes, si haces inversión o trading, si vendes a particulares o a empresas. En Exentax revisamos tu situación, diseñamos la estructura LLC que encaja contigo y te acompañamos cada año en el mantenimiento. Reserva una consulta con nuestro equipo y empezamos por entender tus números reales.

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
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22convenio%20doble%20imposicion%20usa%20espana%20llc%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si prefieres hablarlo en directo, <a href="/es/agendar">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.

<!-- exentax:conv-fill-v1 -->
O llámanos directamente al <a href="tel:+34614916910">+34 614 916 910</a> si prefieres voz.

Para detalles concretos por estado, repasa nuestra <a href="/es/servicios/llc-wyoming">página de LLC en Wyoming</a> con costes y plazos cerrados.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->
`;
