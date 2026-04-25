export default `

Pasar de single-member LLC a multi-member LLC suena a trámite menor. No lo es. Es uno de los cambios estructurales con más implicaciones fiscales reales para una LLC en marcha, y casi nunca se explica con la profundidad que merece antes de ejecutarlo.

Este artículo cubre lo que de verdad cambia, lo que no cambia, y qué tienes que tener resuelto antes de incorporar a un segundo miembro.

## El cambio fiscal central

Una single-member LLC con miembro no residente se trata, por defecto, como **disregarded entity** ante el IRS: la LLC en sí no presenta declaración federal, presenta **Form 5472 + 1120 pro-forma** informativo.

En el momento en que añades un segundo miembro, salvo elección expresa contraria, la LLC pasa a ser **partnership** automáticamente. Eso significa:

- Deja de presentar 5472 + 1120 pro-forma como antes.
- Empieza a presentar **Form 1065** (US Return of Partnership Income), declaración informativa de la partnership.
- Cada miembro recibe un **Schedule K-1** con su parte proporcional de ingresos, gastos y atribuciones.
- Si hay miembro extranjero, entra en juego **Form 8804/8805** y la retención del **Section 1446** sobre ECI atribuido al socio extranjero.

Es un salto de complejidad que conviene ver venir.
### Lo que NO cambia

Antes del miedo al salto, lo que se queda igual:

- **El EIN**, en general. Sí continúa siendo el mismo cuando una SMLLC pasa a partnership por incorporación de miembro nuevo, salvo casos específicos.
- **La LLC en sí**: misma entidad legal, mismo estado, mismo nombre, misma fecha de constitución.
- **El historial bancario** y de proveedores.
- **La protección de responsabilidad limitada**.
### Cuándo tiene sentido pasar a multi-member

Razones válidas:

- Incorporar a un **socio operativo real** que aporta trabajo y comparte beneficios.
- Incorporar a un **inversor** con participación porcentual y derechos económicos.
- **Planificación patrimonial**: incorporar a familiares con porcentajes minoritarios.
- **Estructura de holding**: cuando la holding pasa a tener participación en una operativa antes single-member.

Razones débiles que casi siempre acaban mal:

- "Para que parezca más profesional". El coste de la complejidad supera el beneficio cosmético.
- "Para diluir responsabilidad fiscal". No funciona así: cada miembro tributa por su parte.
- "Para meter al cónyuge en la nómina sin saber bien por qué". Sin papel real, complica más que aporta.
## Implicaciones fiscales detalladas

### En EE. UU.

- **Form 1065 anual** con plazo 15 de marzo (o extensión a 15 de septiembre vía Form 7004).
- **Schedule K-1 a cada miembro** en la misma fecha. La presentación tardía del K-1 al miembro tiene sanciones específicas.
- **Form 8804/8805** si hay miembro extranjero: la partnership debe retener sobre el ECI atribuido al socio no residente al tipo más alto aplicable.
- **Sanciones específicas por 1065 no presentada**: actualmente unos 245 USD por mes y por miembro.

### En el país de residencia del miembro no residente

Aquí es donde se complica de verdad:

- Algunos países tratan la partnership como **transparente** (mismo enfoque que la disregarded entity): el miembro tributa en su IRPF por su parte de los beneficios atribuidos.
- Otros la tratan como **opaca**: la partnership es contribuyente y los ingresos al miembro se ven como dividendos. Esto puede activar reglas CFC y atribución especial.
- La diferencia entre uno y otro tratamiento puede ser de **decenas de puntos porcentuales** sobre el resultado final.

Sin un análisis específico de cómo trata cada jurisdicción a la US partnership, no se puede estimar la fiscalidad real con seriedad.

### Para el socio entrante

- Si aporta capital, su aportación debe estar documentada: cantidad, fecha, registro en Member's Capital.
- Si aporta trabajo, las prestaciones se documentan como **guaranteed payments** (sujetos a tributación específica).
- Su residencia fiscal y nacionalidad se reportan en el K-1 y afectan a la retención.
## Procedimiento ordenado para hacer el cambio

### 1. Decisión informada con asesoramiento previo

Antes de cualquier paso operativo, valida con asesor fiscal en tu país (y, si el socio es de otro país, también con uno en el suyo) cuál será el tratamiento real de la partnership. Sin esto, estás navegando a ciegas.

### 2. Operating Agreement nuevo o sustancialmente revisado

Cuando entra un miembro, el Operating Agreement debe reflejar:

- Porcentajes de propiedad
- Reparto de beneficios y pérdidas (no tienen por qué ser iguales que los porcentajes de propiedad)
- Aportaciones iniciales de cada miembro
- Reglas de toma de decisiones
- Procedimientos de salida

### 3. Aceptación formal del miembro entrante

Documento firmado por el miembro entrante aceptando los términos del Operating Agreement, fecha de incorporación efectiva y porcentaje recibido.

### 4. Comunicación al IRS

Aunque el EIN se mantiene, conviene presentar **Form 8832** sólo si se quiere mantener la LLC como disregarded de forma especial (raro) o si se quiere que la LLC tribute como corporación. Sin elección, pasa a partnership automáticamente desde la fecha de incorporación del segundo miembro.

### 5. Actualización del BOI Report

Tras la **interim final rule de FinCEN de marzo de 2025**, el **BOI Report NO aplica a las LLC formadas en EE. UU. propiedad de no residentes** ante FinCEN: solo presentan las **foreign reporting companies** (entidades constituidas fuera de EE. UU. y registradas para operar en un estado). Si tu entidad encaja en ese supuesto, la incorporación de un nuevo miembro con ≥ 25 % de participación o control sustancial es un cambio reportable: hay que actualizar el BOIR en **boiefiling.fincen.gov** dentro de los **30 días** siguientes a la entrada del nuevo beneficiario, aportando su nombre legal, fecha de nacimiento, dirección residencial y documento de identidad. La sanción civil por no actualizar llega a **591 USD/día** y la penal hasta **10.000 USD y 2 años de prisión** (31 U.S.C. §5336). Si tu LLC está fuera de ámbito, monitorizamos FinCEN.gov por ti.

### 6. Actualización en banca y plataformas

Mercury, Wise, Stripe y similares quieren saber quiénes son los beneficiarios reales. Actualiza el perfil de la cuenta o, según el caso, reabre el proceso de KYC.

### 7. Bookkeeping con dos miembros desde día uno

Distribuciones, aportaciones y guaranteed payments documentados por miembro desde el primer día. Sin esto, el K-1 de fin de año es ficción.
### Cuándo conviene NO pasar a multi-member y buscar alternativas

A veces la mejor opción no es añadir a un segundo miembro, sino:

- **Constituir una segunda LLC** con el otro socio y operar en paralelo o con un acuerdo de joint venture.
- **Mantener la single-member y compensar al colaborador como contractor** en lugar de socio.
- **Crear una holding** con dos miembros y bajar a la operativa como entidad propia, dejando la single-member original tal cual.

Cualquiera de estas tres puede ser la respuesta correcta según el caso.
### Cómo lo abordamos en Exentax

En Exentax acompañamos transformaciones single → multi cada cierto tiempo. La regla es invariable: análisis fiscal cruzado primero (US + país de cada miembro), Operating Agreement nuevo después, ejecución y cumplimiento corriente al final. Sin saltarse ningún paso, sin "ya lo arreglaremos en el cierre".

Si estás valorando incorporar a un socio, agenda una sesión inicial gratuita en nuestra página de agendamiento. En 30 minutos te decimos si el camino multi-member es el adecuado o si existe una alternativa con menos fricción.
## Referencias legales y normativas

Este artículo se apoya en normativa vigentes actualmente. Citamos las fuentes principales para que puedas verificarlo:

- **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report ante FinCEN).
- **España.** Ley 35/2006 (LIRPF), arts. 8, 9 (residencia), 87 (atribución de rentas), 91 (transparencia fiscal internacional para personas físicas); Ley 27/2014 (LIS), art. 100 (transparencia fiscal internacional para sociedades); Ley 58/2003 (LGT), arts. 15 (conflicto en aplicación de la norma) y 16 (simulación); Ley 5/2022 (régimen sancionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 720); Orden HFP/887/2023 (Modelo 721 cripto).
- **Convenio España–EE. UU.** BOE de 22/12/1990 (CDI original); Protocolo en vigor desde 27/11/2019 (renta pasiva, *limitation on benefits*).
- **UE / OCDE.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetrías híbridas); Estándar Común de Reporte (CRS) de la OCDE.
- **Marco internacional.** Modelo de Convenio OCDE, art. 5 (establecimiento permanente) y comentarios; Acción 5 BEPS (sustancia económica); FATF Recommendation 24 (titularidad real).

<!-- exentax:calc-cta-v1 -->
> <a href="/es/servicios">Empieza hoy 100% remoto</a>
<!-- /exentax:calc-cta-v1 -->

La aplicación concreta de cualquiera de estas normas a tu caso depende de tu residencia fiscal, la actividad de la LLC y la documentación que mantengas. Este contenido es informativo y no sustituye al asesoramiento profesional personalizado.

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
## Single-member vs multi-member LLC: implicaciones fiscales que cambian todo el setup

La diferencia entre tener uno o varios socios en tu LLC US no es cosmética: cambia la clasificación fiscal por defecto del IRS, los formularios obligatorios, los plazos, el tratamiento de los flujos hacia los miembros y la estrategia de planificación en residencia. Antes de añadir un socio "para optimizar" hay que saber qué optimiza y qué empeora.

- **Clasificación fiscal por defecto en US.** Single-member LLC: disregarded entity por defecto (la LLC no existe a efectos fiscales US, todo se imputa al owner). Multi-member LLC: partnership por defecto (Form 1065 anual + K-1 a cada socio). Ambas pueden elegir tributar como C-Corp o S-Corp con Form 8832/2553, pero el default es el que hay que entender primero.
- **Filings anuales y plazos.** Single-member disregarded de no residente: Form 5472 + 1120 pro forma (15 abril, ext. 15 octubre). Multi-member partnership: Form 1065 + Schedule K-1 para cada partner (15 marzo, ext. 15 septiembre - un mes antes que la single-member). Si hay socios extranjeros, además Form 8804/8805 (withholding sobre effectively connected income, si lo hay) y posiblemente Form 5472 para cada socio extranjero >25%.
- **Implicaciones de retención.** Multi-member con socios no residentes y actividad ECI: la partnership está obligada a retener 37% sobre la cuota efectivamente conectada del socio extranjero (IRC §1446). Aunque NO haya ECI, los reporting requirements son sustancialmente más pesados que en single-member. Una multi-member añade complejidad operacional real.
- **Tratamiento en residencia del socio.** España: la multi-member partnership se atribuye al socio residente español por su participación (similar a CB o SCP). Pero la prueba documental (operating agreement, K-1, allocations) es más exigente que la single-member. Francia, Italia, Alemania aplican lógica similar. Para LATAM con LLC opaca, multi-member dispara CFC con más facilidad que single-member.

### Cuándo conviene single-member y cuándo multi-member

Single-member: emprendedor solo, freelance, consultoría, e-commerce de un dueño, agencia con team interno (no socios). Multi-member: socios reales con aportación efectiva diferenciada, joint venture entre dos profesionales, fondo de inversión con varios LP, holding familiar con cónyuges como co-owners reales.

### Lo que más nos preguntan

**Si añado a mi pareja como member, ¿optimizo impuestos?** En US, no por sí solo: la partnership tributa por atribución igual. En residencia, depende del país: en España puede optimizar si tu pareja tiene marginal IRPF inferior, pero hay que justificar aportación real. Sin sustancia, es simulación.

**¿Puedo cambiar de single a multi (o al revés)?** Sí, pero la conversión tiene consecuencias fiscales. Pasar de single a multi requiere new EIN posiblemente y new operating agreement, y se interpreta como aportación a partnership. Pasar de multi a single (compra de membership al otro socio) es venta de participación con potencial plusvalía.

En Exentax modelamos la elección single vs multi con tu caso (residencia, perfil de socios, tipo de actividad) y, cuando ya hay LLC, evaluamos si conviene cambiar - la elección por defecto rara vez es la óptima sin análisis.
<!-- /exentax:execution-v2 -->

## Hablemos de tu estructura

Cada caso tiene matices: tu país de residencia, el tipo de actividad, dónde están tus clientes, si haces inversión o trading, si vendes a particulares o a empresas. En Exentax revisamos tu situación, diseñamos la estructura LLC que encaja contigo y te acompañamos cada año en el mantenimiento. Reserva una consulta con nuestro equipo y empezamos por entender tus números reales.

¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:+34614916910">+34 614 916 910</a> o escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22single%20member%20multi%20member%20llc%20implicaciones%20fiscales%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si quieres ver el detalle del proceso completo, repasa nuestra <a href="/es/servicios">página de servicios</a> con todo lo que incluimos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Constitución, EIN, BOI, banca y mantenimiento: un único equipo que entiende tu caso de principio a fin. <a href="/es/servicios">Ver todos los servicios</a>.
<!-- /exentax:cta-v1 -->
`;
