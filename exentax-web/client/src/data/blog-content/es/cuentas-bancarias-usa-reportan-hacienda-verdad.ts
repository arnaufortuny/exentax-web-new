export default `Es la pregunta que más recibimos en Exentax: "¿Mercury le dice a Hacienda cuánto dinero tengo?" o "¿Wise reporta mis ingresos a la AEAT?". La respuesta requiere algo de contexto, pero te la vamos a dar completa.

## El sistema de reporte financiero internacional

Hay tres grandes mecanismos por los que la información financiera viaja entre países:

**1. <a href="/es/blog/crs-cuentas-bancarias-llc-intercambio-informacion">CRS (Common Reporting Standard)</a>**: El estándar de la OCDE que usan más de 100 países para intercambiar información automáticamente sobre cuentas financieras de no residentes.

**2. FATCA (Foreign Account Tax Compliance Act)**: La ley americana que obliga a instituciones financieras extranjeras a reportar cuentas de ciudadanos y residentes americanos al IRS.

**3. Acuerdos bilaterales**: Tratados específicos entre dos países para compartir información fiscal bajo solicitud.

## ¿Qué pasa con tu cuenta de Mercury?

Mercury es un Money Transmitter registrado en EE.UU. que usa Column NA como banco custodio. Opera exclusivamente dentro del sistema financiero americano.

**¿Reporta Mercury al IRS?** Sí, como toda institución financiera americana, Mercury cumple con las obligaciones de reporte al IRS. Esto incluye formularios como el 1099 cuando aplica.

**¿Reporta Mercury a tu hacienda local?** No directamente. Como EE.UU. no participa en el CRS, no hay un flujo automático de información CRS desde Mercury hacia, por ejemplo, la AEAT en España o el SAT en México.

**¿Significa que tu hacienda no puede enterarse?** No exactamente. Tu hacienda local puede:
- Obtener información a través de acuerdos bilaterales FATCA/IGA con EE.UU.
- Solicitarla específicamente bajo tratados de asistencia mutua
- Conocerla porque tú la declares (como debes hacer)

## ¿Y Wise?

Wise es un caso diferente y más complejo. Es una EMI (Institución de Dinero Electrónico) con presencia en múltiples jurisdicciones: tiene licencia en el Reino Unido, en la UE (a través de Bélgica/Países Bajos), en EE.UU. como Money Transmitter, en Australia, Singapur, etc.

**Implicación práctica:** Wise puede tener obligaciones CRS en las jurisdicciones donde opera. Si tu cuenta de Wise está domiciliada en una jurisdicción CRS (por ejemplo, la UE), la información sobre esa cuenta puede intercambiarse automáticamente con tu país de residencia.

**Lo que reportan:** Saldos de cuenta a final de año, intereses generados (si los hay), y datos del titular. No reportan cada transacción individual, el CRS es un resumen anual.

## ¿Y Relay?

Relay usa Thread Bank como banco custodio. Opera dentro del sistema financiero americano, similar a Mercury. Las mismas reglas aplican: reporte al IRS sí, reporte CRS automático a tu hacienda local no.

## Lo que debes saber: el Modelo 720 y similares

Independientemente de lo que reporten o dejen de reportar las fintechs, la mayoría de los países tienen obligaciones de declaración de activos en el extranjero:

**España:** Modelo 720 para activos en el extranjero superiores a 50.000€ (cuentas, valores, inmuebles).

**México:** Declaración informativa de inversiones en el extranjero. Los residentes fiscales deben declarar cuentas bancarias foráneas.

**Colombia:** Declaración de activos en el exterior. Obligatorio para residentes fiscales con activos fuera de Colombia.

**Argentina:** Declaración de bienes personales que incluye activos en el exterior.

## El FBAR: la obligación que muchos olvidan

Si en algún momento del año tus cuentas financieras fuera de tu país de residencia superan ciertos umbrales, puedes tener obligaciones adicionales de declaración:

**Para residentes de EE.UU. (o ciudadanos americanos con LLC):** El FBAR (FinCEN Form 114) exige declarar cuentas financieras en el extranjero si el agregado supera $10,000 en cualquier momento del año. El plazo es el 15 de abril (con extensión automática hasta el 15 de octubre).

**Para españoles con LLC en EE.UU.:** El Modelo 720 exige declarar cuentas en el extranjero si el agregado supera 50.000€ a 31 de diciembre. Es una declaración informativa, no genera tributación adicional, pero la no presentación puede acarrear sanciones.

**Para mexicanos con LLC en EE.UU.:** La declaración informativa de inversiones en el extranjero aplica si eres residente fiscal mexicano y tienes cuentas fuera de México.

El denominador común: la obligación de declarar no depende de lo que reporte el banco. Depende de ti.

## Qué pasa con Slash, Wallester y las pasarelas de pago

Las herramientas complementarias de tu LLC también tienen implicaciones:

- **Slash** (tesorería corporativa): como los fondos están gestionados dentro del sistema financiero estadounidense, las mismas reglas que aplican a Mercury aplican aquí. Reporte al IRS sí, CRS no.
- **Wallester** (tarjetas corporativas): es un emisor europeo. Dependiendo de dónde esté domiciliada la cuenta, puede tener obligaciones CRS.
- **Stripe/PayPal/Adyen/DoDo Payments**: las pasarelas de pago no son cuentas bancarias. Son procesadores de transacciones. No tienen las mismas obligaciones de reporte CRS que un banco o EMI. Pero los fondos que recibes a través de ellos sí forman parte de tus ingresos declarables.

## La conclusión práctica

**1. No asumas que tu cuenta americana es "invisible".** Aunque EE.UU. no participa en CRS, hay múltiples vías de intercambio de información. Y las tendencias regulatorias apuntan a más transparencia, no menos.

**2. Declara todo lo que debes declarar.** Es más fácil, más barato y mucho menos estresante que asumir que nadie se va a enterar.

**3. Una LLC bien gestionada no necesita esconderse.** Tu ahorro fiscal viene de la optimización legal (<a href="/es/blog/gastos-deducibles-llc-que-puedes-deducir">gastos deducibles</a>, <a href="/es/blog/tributacion-pass-through-llc-como-funciona">pass-through taxation</a>, estructura eficiente), no de ocultar cuentas.

**4. La trazabilidad es tu mejor defensa.** Si alguna vez tu hacienda te pregunta sobre tu LLC, tener todo documentado (facturas, distributions, Form 5472, <a href="/es/blog/operating-agreement-llc-que-es">Operating Agreement</a>) es lo que te protege.

**5. El reporte evoluciona.** Que hoy EE.UU. no participe en CRS no significa que mañana no lo haga. Construye tu estructura asumiendo transparencia total, y nunca tendrás problemas.

Un matiz que quedó corto y que conviene leer aparte: <a href="/es/blog/estructura-fiscal-optima-freelancer-internacional">La estructura fiscal óptima para freelancers internacionales en 2026</a>, porque afina exactamente los bordes de lo explicado en esta guía.

## Cómo lo gestionamos en Exentax

Cuando montamos tu estructura, coordinamos el compliance en ambos lados:

- Preparamos el Form 5472 y el BOI Report en EE.UU.
- Te proporcionamos toda la documentación que tu asesor fiscal local necesita para la declaración en tu país
- Cada movimiento de tu LLC queda documentado y trazable
- Si tu hacienda local envía un requerimiento, tienes todo organizado para responder en días, no en semanas

La tranquilidad fiscal no viene de esconderse. Viene de tener todo en orden.`;
