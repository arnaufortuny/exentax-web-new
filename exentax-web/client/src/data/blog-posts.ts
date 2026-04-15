export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  publishedAt: string;
  updatedAt?: string;
  metaTitle: string;
  metaDescription: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "llc-estados-unidos-guia-completa-2026",
    title: "LLC en Estados Unidos: guía completa para no residentes en 2026",
    excerpt: "Todo lo que necesitas saber antes de constituir una LLC americana siendo extranjero. Estados, costes, fiscalidad y errores que debes evitar.",
    content: `Una LLC (Limited Liability Company) es la estructura empresarial más utilizada por freelancers y emprendedores digitales no residentes que operan desde fuera de Estados Unidos. Combina protección patrimonial con una fiscalidad favorable, y lo más importante: es completamente legal. Miles de profesionales hispanohablantes ya la usan para facturar a clientes globales, cobrar en dólares y dejar de regalar la mitad de lo que ganan al fisco.

En esta guía te contamos todo lo que necesitas saber antes de dar el paso. Sin rodeos, sin letra pequeña, sin el típico "consulta con tu asesor". En Exentax nos encargamos de todo, así que te lo explicamos como si ya fueras cliente.

## ¿Qué es exactamente una LLC?

Es una figura jurídica estadounidense que separa tus bienes personales de los del negocio. Si tu empresa tiene una deuda o un problema legal, tu patrimonio personal no se ve afectado. Tu casa, tu coche, tus ahorros, intocables.

Para un no residente con una Single-Member LLC (un solo socio), el IRS la clasifica como **"Disregarded Entity"**. Esto significa que la LLC es una entidad transparente fiscalmente: no paga impuesto federal sobre la renta en EE.UU. Es lo que se conoce como **pass-through taxation**: los beneficios "pasan a través" de la LLC directamente al propietario, que los declara en su país de residencia fiscal. Si quieres entender este mecanismo en profundidad, te lo explicamos en nuestra <a href="/es/blog/tributacion-pass-through-llc-como-funciona">guía sobre tributación pass-through</a>.

En la práctica: si vives en España, México, Colombia o cualquier otro país, tu LLC americana paga **$0 de impuesto federal** en Estados Unidos (siempre que no tengas ingresos de fuente estadounidense). Luego tú declaras esos beneficios en tu país, pero con los gastos de la LLC ya deducidos, lo que reduce significativamente tu base imponible.

## ¿Por qué tantos freelancers eligen una LLC?

Hay razones muy concretas (y muy convincentes):

- **Fiscalidad optimizada.** Pasas de pagar un 40-47% en tu país a optimizar tu carga fiscal hasta un 0%, dependiendo de tu estructura y país de residencia. Sí, has leído bien.
- **Protección patrimonial.** Tu casa, tus ahorros y tus bienes quedan separados del negocio. Si algo sale mal en la empresa, tu patrimonio personal está blindado.
- **Privacidad y anonimato.** En estados como Nuevo México, los datos de los miembros no son de acceso público. Tu nombre no aparece en registros estatales. Operas con discreción total.
- **Banca en dólares.** Acceso a cuentas en Mercury (respaldado por Column NA, con seguro FDIC) o Relay (respaldado por Thread Bank), sin restricciones. Wires internacionales a $0 con Mercury. Sin comisiones de mantenimiento.
- **Pasarelas de pago sin restricciones.** Stripe, PayPal, procesadores de pago, todos funcionan sin problema con una LLC americana. Adiós a las limitaciones que tienen las cuentas personales o empresas de otros países.
- **Credibilidad internacional.** Facturar desde una empresa americana genera confianza inmediata en clientes globales. No es lo mismo enviar una factura desde "Juan Pérez, autónomo" que desde "Tu Empresa LLC".
- **Sin necesidad de viajar.** Todo el proceso es 100% remoto. No necesitas visa, no necesitas pisar suelo americano, no necesitas SSN.

## Seguridad jurídica y legal

La LLC no es un invento de YouTube ni un truco fiscal. Es una estructura empresarial reconocida por el gobierno federal de Estados Unidos, regulada por cada estado y utilizada por millones de empresas, desde freelancers hasta multinacionales.

Tu LLC tiene:
- **Articles of Organization** registrados ante el estado
- **<a href="/es/blog/operating-agreement-llc-que-es">Operating Agreement</a>** que define las reglas internas
- **<a href="/es/blog/ein-numero-fiscal-llc-como-obtenerlo">EIN</a>** (número fiscal) emitido por el IRS
- **<a href="/es/blog/registered-agent-que-es-por-que-necesitas">Registered Agent</a>** que recibe documentación legal oficial
- **<a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a>** presentado ante FinCEN (transparencia de titularidad)

Todo en regla, todo documentado, todo legal. En Exentax nos aseguramos de que cada pieza esté en su sitio desde el día uno.

## ¿Qué estado elegir?

Los tres estados más habituales para no residentes son Nuevo México, Wyoming y Delaware. Tenemos una <a href="/es/blog/nuevo-mexico-vs-wyoming-vs-delaware">comparativa detallada entre los tres estados</a>, pero aquí va el resumen:

**Nuevo México**: El más popular entre nuestros clientes, y por buenas razones. No exige Annual Report, lo que reduce el coste anual. Los datos de los miembros no son públicos, así que tienes privacidad real sin pagar extra. Sin impuesto estatal. Es la opción más directa y con menor burocracia.

**Wyoming**: También excelente para privacidad. Protección de activos superior y leyes empresariales modernas. Pero cuesta más que Nuevo México y requiere Annual Report anual ($60).

**Delaware**: El estado con mejor marco legal y el preferido por grandes empresas, C-Corps y startups que buscan inversión de venture capital. Su Court of Chancery es referencia mundial en derecho empresarial. Pero es el más caro y tiene Franchise Tax. Para un freelancer, suele ser innecesario.

## El ecosistema fintech: banca, pagos y herramientas

Una de las grandes ventajas de tener una LLC es acceder al ecosistema financiero americano, el más avanzado del mundo para negocios digitales. No estamos hablando solo de una cuenta bancaria: es un ecosistema completo de banca, tesorería, tarjetas corporativas, pagos y conversión de divisas que funciona sin fricciones.

### Banca y tesorería

- **Mercury**: Cuenta bancaria digital con $0 comisiones en todo: mantenimiento, wires nacionales e internacionales, ACH, tarjeta de débito. Tu dinero está custodiado en Column NA (banco con licencia federal y seguro FDIC hasta $250,000). Es la plataforma más utilizada por nuestros clientes para la operativa diaria.
- **Relay**: Otra fintech excelente con hasta 20 sub-cuentas gratuitas, ideal para organizar tu dinero por categorías (operativa, impuestos, reservas). Los depósitos se custodian en Thread Bank. Ofrece links de pago procesados por Adyen, perfecto para cobrar a clientes de forma rápida y profesional.
- **Slash**: Plataforma de tesorería empresarial que permite gestionar el tesoro de tu LLC de forma inteligente. Ideal para empresas que quieren optimizar la gestión de su capital disponible, con cuentas que generan rendimiento sobre el saldo mientras mantienes liquidez inmediata.
- **Wise Business**: EMI (Institución de Dinero Electrónico) perfecta para transferencias internacionales al tipo de cambio real (mid-market rate). No es un banco, pero complementa perfectamente a Mercury para conversión de divisas y pagos a proveedores internacionales.
- **Revolut Business**: Cuenta multidivisa con cambio de divisas competitivo entre semana, tarjetas para el equipo y herramientas de gestión de gastos. Útil como cuenta secundaria y para operaciones en múltiples monedas.

### Tarjetas corporativas

- **Wallester**: Plataforma de tarjetas corporativas virtuales y físicas vinculadas a tu LLC, con IBAN en euros para clientes Exentax. Permite emitir tarjetas para gastos específicos (publicidad, software, suscripciones) con límites personalizados. Muy popular entre emprendedores europeos por sus integraciones y control granular del gasto.
- Las tarjetas de débito de Mercury y Relay también funcionan perfectamente para gastos operativos del día a día.

### Pasarelas de pago

- **Stripe**: La pasarela líder para cobrar con tarjeta, suscripciones, checkout y facturación automática. Acepta más de 135 divisas. Funciona sin restricciones con tu LLC americana.
- **PayPal Business**: Para clientes que prefieren pagar por PayPal. Ampliamente reconocida y con protección al vendedor incluida. Requiere ITIN del propietario.
- **Adyen**: Procesador de pagos global utilizado por empresas como Uber, Spotify y eBay. Si tu negocio tiene volumen significativo, Adyen ofrece tarifas muy competitivas y soporte para métodos de pago locales en más de 30 países.
- **DoDo Payments**: Alternativa emergente que actúa como Merchant of Record, encargándose del IVA/GST internacional automáticamente. Ideal si vendes productos digitales a consumidores finales en múltiples países.

### Inversión y trading

- **Interactive Brokers**: El bróker más completo para invertir desde tu LLC. Acceso a acciones, ETFs, opciones, futuros, forex y bonos en más de 150 mercados mundiales. Cuenta empresarial con tu LLC para separar inversiones personales de las del negocio. Comisiones muy competitivas y plataforma profesional.
- **Tradovate**: Especializado en futuros (futures trading). Si tu LLC opera en mercados de derivados, Tradovate ofrece una plataforma moderna con comisiones planas y acceso a CME, CBOT, NYMEX y COMEX.
- **Kraken**: Exchange de criptomonedas con cuenta corporativa para tu LLC. Acceso a Bitcoin, Ethereum, stablecoins y más de 200 criptoactivos con liquidez institucional y cumplimiento regulatorio sólido.

En Exentax diseñamos todo este ecosistema financiero como parte de tu estructura completa. No solo constituimos tu LLC, configuramos la banca (Mercury como cuenta principal, Relay como respaldo), las pasarelas de pago (Stripe, PayPal), la conversión de divisas (Wise Business) y te asesoramos sobre tarjetas corporativas (Wallester), tesorería (Slash) e inversión (Interactive Brokers) según tu perfil. Todo integrado, todo operativo desde el día uno.

## ¿Cuánto cuesta constituir y mantener una LLC?

La constitución incluye Articles of Organization, Operating Agreement, EIN, agente registrado y apertura de cuenta bancaria. Todo gestionado por nosotros.

El mantenimiento anual incluye todas las declaraciones ante el IRS (<a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a>, Form 1120), BOI Report, renovación del agente registrado y compliance fiscal completo. Cero sorpresas, cero extras. Te lo detallamos en nuestra <a href="/es/blog/mantenimiento-anual-llc-obligaciones">guía de mantenimiento anual</a>.

## Errores frecuentes al abrir una LLC

1. **No declarar en tu país de residencia.** La LLC no te exime de tus obligaciones fiscales locales. Los beneficios pasan a ti (pass-through) y debes declararlos. Lo bueno: con los gastos de la LLC deducidos, la base imponible es mucho menor.
2. **Elegir el estado solo por precio.** Cada estado tiene ventajas distintas. En Exentax te recomendamos el que realmente encaja contigo.
3. **No tener Operating Agreement.** Sin este documento, la LLC carece de estructura formal. Nosotros lo preparamos siempre.
4. **Olvidar el Form 5472.** Es una declaración anual obligatoria. Nosotros la gestionamos por ti cada año, ni te enteras.
5. **Mezclar cuentas personales y empresariales.** Esto puede comprometer la protección de responsabilidad limitada. Cuenta de la LLC = solo para el negocio.

## ¿Es legal?

Absolutamente. No es evasión fiscal. Es planificación fiscal legal utilizando estructuras reconocidas por el IRS y las autoridades de tu país. Millones de empresas operan así. La clave está en declarar correctamente y mantener el compliance al día, y de eso nos encargamos nosotros.

¿Quieres saber si la LLC tiene sentido para ti? Agenda tu asesoría gratuita de 30 minutos. Te explicamos todo, analizamos tu caso y te decimos exactamente cuánto puedes ahorrar. Sin compromiso, sin letra pequeña.`,
    category: "Guías",
    readTime: 11,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "LLC en Estados Unidos para no residentes 2026: guía definitiva | Exentax",
    metaDescription: "Guía definitiva para constituir una LLC en EE.UU. siendo extranjero en 2026. Estados, fiscalidad, banca, inversión, pasarelas de pago y errores que evitar.",
  },
  {
    slug: "form-5472-que-es-como-presentarlo",
    title: "Form 5472: qué es, quién debe presentarlo y cómo cumplir sin complicaciones",
    excerpt: "El formulario informativo más relevante para dueños de LLC no residentes. Te explicamos qué es, cuándo se presenta y cómo nosotros nos encargamos de gestionarlo por ti.",
    content: `Si tienes una LLC en Estados Unidos como no residente, el Form 5472 es una declaración informativa que el IRS solicita cada año. Suena intimidante, pero tranquilo: es papeleo informativo, no es un pago de impuestos, y en Exentax nos encargamos de todo por ti. Literalmente no tienes que hacer nada.

## ¿Qué es el Form 5472?

Es un formulario informativo del IRS (Internal Revenue Service) que deben presentar las LLC con propietarios extranjeros. Su base legal está en la **Sección 6038A del Internal Revenue Code**, que establece las obligaciones de reporte para corporaciones con propietarios extranjeros. Su función es reportar las transacciones entre la LLC y sus "personas relacionadas", es decir, tú como dueño. Si aún no tienes claro qué es el IRS y cómo funciona, revisa nuestra <a href="/es/blog/que-es-irs-guia-duenos-llc">guía sobre el IRS para dueños de LLC</a>.

Vamos a repetirlo porque es importante: **no es un formulario de pago de impuestos.** Es puramente informativo. El IRS simplemente quiere saber qué movimientos hubo entre tú y tu LLC durante el año. Nada más.

¿Entonces por qué genera tanta ansiedad? Porque internet está lleno de artículos alarmistas con cifras que asustan. La realidad: si tienes a alguien competente gestionándolo (ejem, nosotros), es un trámite rutinario que se resuelve sin drama. En Exentax lo preparamos y presentamos por todos nuestros clientes cada año. Ni te enteras.

## ¿Quién debe presentarlo?

Cualquier LLC estadounidense que tenga al menos un propietario extranjero (no residente y no ciudadano de EE.UU.) y que haya tenido transacciones reportables durante el año fiscal.

En la práctica: si eres un freelancer con una Single-Member LLC y has movido dinero entre tu LLC y tú, ya sea retirando beneficios, haciendo aportaciones de capital o pagando gastos, debes presentar este formulario. Y si tu LLC tuvo actividad (que es lo normal si estás facturando), hay transacciones que reportar.

## ¿Qué transacciones se reportan?

- Retiros de beneficios del dueño (owner's draws)
- Aportaciones de capital
- Préstamos entre el dueño y la LLC
- Pagos de servicios entre partes relacionadas
- Alquileres o licencias de propiedad intelectual
- Cualquier movimiento financiero entre la LLC y su dueño

Básicamente, todo lo que entra y sale entre tú y tu empresa. Si mantienes una buena <a href="/es/blog/separar-dinero-personal-llc-por-que-importa">separación financiera</a> (cuenta de la LLC separada de la personal), documentar esto es pan comido.

## Form 5472 y Form 1120: la pareja inseparable

El Form 5472 no se presenta solo, va acompañado del **Form 1120**, que es la declaración de impuestos corporativa de la LLC. Pero ojo: para una Single-Member LLC con dueño extranjero, el Form 1120 es **pro-forma**. No declara impuestos reales porque la LLC es una Disregarded Entity y paga $0 de impuesto federal.

### ¿Qué es el Form 1120 pro-forma?

Es la declaración de impuesto de sociedades del IRS. En el caso de una LLC de un solo miembro con propietario no residente, se presenta como un "envoltorio" del Form 5472. Básicamente:

- **El Form 1120 es la portada**: incluye los datos generales de la LLC
- **El Form 5472 es el contenido**: detalla las transacciones entre tú y tu LLC

El Form 1120 pro-forma se presenta con todos los campos financieros en cero (ingresos: $0, impuestos: $0) porque la LLC no tributa en EE.UU. Lo que importa es el Form 5472 adjunto.

### ¿Entonces por qué se necesita el Form 1120?

Porque el IRS no acepta el Form 5472 como documento independiente. Necesita ir dentro de una declaración corporativa (Form 1120). Es burocracia pura: el IRS diseñó el sistema para corporaciones regulares, y las LLCs de no residentes tienen que usar el mismo canal.

| Formulario | Propósito | ¿Implica pago? | ¿Quién lo exige? |
|---|---|---|---|
| Form 1120 (pro-forma) | Declaración corporativa "envoltorio" | No, todo en $0 | IRS |
| Form 5472 | Reportar transacciones LLC-owner | No, es informativo | IRS |
| Form 7004 | Solicitar extensión de plazo | No | IRS |

## ¿Cuándo se presenta?

El Form 5472 se presenta junto con el Form 1120, con fecha límite el **15 de abril** de cada año para el año fiscal anterior.

Se puede solicitar una extensión de 6 meses (hasta el 15 de octubre) mediante el **Form 7004**, pero la extensión debe solicitarse antes del 15 de abril. Te lo explicamos en detalle en nuestra <a href="/es/blog/extension-irs-form-1120-como-solicitarla">guía sobre la extensión del Form 1120</a>. En Exentax siempre solicitamos la extensión automáticamente para todos nuestros clientes, así tenemos margen de sobra para preparar todo con calma.

### Calendario fiscal clave:

| Fecha | Acción |
|---|---|
| **1 de enero** | Inicio del periodo para recopilar información fiscal |
| **Antes del 15 de abril** | Presentar Form 7004 (extensión) |
| **15 de abril** | Fecha límite original Form 1120 + 5472 |
| **15 de octubre** | Fecha límite con extensión |

## ¿Es difícil de presentar?

Si lo haces tú solo, sí puede ser engorroso. El formulario requiere información detallada sobre:

1. **Datos de la LLC**: nombre, EIN, dirección, estado de constitución
2. **Datos del propietario extranjero**: nombre completo, país de residencia, identificación fiscal
3. **Transacciones reportables**: desglosadas por tipo y monto

Además, se presenta en papel (no electrónicamente) junto con el Form 1120, enviado por correo al IRS. Sí, en pleno 2026, el IRS sigue pidiendo papel para esto. Bienvenido a la burocracia americana.

Pero si eres cliente de Exentax, todo esto es invisible para ti. Nosotros recopilamos la información, preparamos ambos formularios, los revisamos y los enviamos. Tú te dedicas a tu negocio y nosotros al compliance. Así de simple.

## Sanciones por no presentar el Form 5472

El IRS se toma este formulario muy en serio. Las sanciones por no presentar o presentar incorrectamente el Form 5472 son significativas:

- **$25,000 de sanción base** por cada formulario no presentado o incompleto
- **$25,000 adicionales** por cada periodo de 30 días de incumplimiento después de ser notificado por el IRS (hasta un máximo de $25,000 por mes)
- No hay un techo máximo definido, las sanciones pueden acumularse considerablemente

Estas cifras suenan alarmantes, pero la realidad es más matizada. Si presentas tu Form 5472 en plazo (o dentro de la extensión) y con información correcta, no hay sanción alguna. Las sanciones aplican a quienes ignoran la obligación o la presentan con errores graves.

En Exentax nos aseguramos de que todo se presente correctamente y a tiempo. Nunca hemos tenido un cliente sancionado por el IRS por un Form 5472.

## ¿Y si no lo he presentado en años anteriores?

Si tienes una LLC y no has presentado el Form 5472 de años anteriores, no entres en pánico. Hay formas de ponerse al día:

- **Declaraciones tardías voluntarias**: el IRS tiene procedimientos para presentar formularios atrasados
- **Reasonable cause**: si puedes demostrar que el incumplimiento no fue intencional, el IRS puede reducir o eliminar sanciones
- **Asesoramiento profesional**: es crítico que este proceso lo gestione alguien con experiencia

En Exentax ayudamos a clientes que vienen de otros servicios (o que gestionaban su LLC solos) a regularizar su situación. Lo importante es actuar, cuanto antes te pongas al día, mejor.

## Lo que deberías llevarte de este artículo

El Form 5472 (junto con el Form 1120 pro-forma) es un trámite informativo anual que toda LLC con dueño extranjero debe presentar. No implica pago de impuestos. No es complicado si lo gestiona alguien que sabe lo que hace. Y en Exentax nos encargamos de esto como parte del <a href="/es/blog/mantenimiento-anual-llc-obligaciones">mantenimiento anual de tu LLC</a>. Ten en cuenta que el Form 5472 no es la única obligación: también debes presentar el <a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report ante FinCEN</a>.

¿Tienes dudas sobre tu situación? Agenda tu asesoría gratuita de 30 minutos y lo revisamos juntos. Te explicamos exactamente qué obligaciones tiene tu LLC y cómo las gestionamos por ti.`,
    category: "Compliance",
    readTime: 8,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Form 5472 para LLC de no residentes: guía completa 2026 | Exentax",
    metaDescription: "El Form 5472 es obligatorio para LLCs con dueños extranjeros. Transacciones reportables, plazos, sanciones y cómo Exentax lo gestiona por ti cada año.",
  },
  {
    slug: "nuevo-mexico-vs-wyoming-vs-delaware",
    title: "Nuevo México vs Wyoming vs Delaware: qué estado elegir para tu LLC",
    excerpt: "Los tres estados más populares para constituir una LLC como no residente. Comparamos costes, privacidad, burocracia y para quién encaja cada uno.",
    content: `Elegir el estado de constitución de tu LLC es una de las decisiones más importantes, y una de las que más confusión genera. Internet está lleno de vídeos diciendo "Delaware es el mejor" o "Wyoming es obligatorio". La realidad es más matizada, y aquí te la contamos sin humo.

Vamos a comparar los tres estados más elegidos por no residentes: Nuevo México, Wyoming y Delaware. Spoiler: para la mayoría de freelancers y emprendedores digitales, Nuevo México gana de calle. Si necesitas primero entender el proceso completo de constitución, revisa nuestra <a href="/es/blog/constituir-llc-proceso-paso-a-paso">guía paso a paso para constituir una LLC</a>.

## Nuevo México: el favorito de los no residentes

**Constitución:** Consultar
**Mantenimiento anual:** Consultar

Nuevo México es el estado más popular entre nuestros clientes en Exentax, y con razón. Combina el menor coste del mercado con un nivel de privacidad excelente. Puedes conocer más sobre la <a href="/es/blog/privacidad-llc-americana-secreto-ventaja">privacidad en una LLC americana</a> en nuestro artículo dedicado.

**Ventajas:**
- **Sin Annual Report estatal**: un trámite menos cada año, un coste menos
- **Privacidad real**: los datos de los miembros no aparecen en registros públicos del estado. Tu nombre no está asociado públicamente a la LLC
- **Sin impuesto estatal** sobre ingresos
- **Coste de constitución y mantenimiento más bajo** de los tres estados
- **Proceso sencillo y rápido**: sin burocracia innecesaria

**Ideal para:** la gran mayoría de freelancers, consultores, desarrolladores, diseñadores y emprendedores digitales. Si quieres la opción más práctica, más privada y más económica, Nuevo México es la elección obvia. Es el estado que recomendamos por defecto en Exentax a menos que tu situación específica requiera otra cosa.

## Wyoming: buena privacidad, mayor coste

**Constitución:** Consultar
**Mantenimiento anual:** Consultar

Wyoming tiene una reputación excelente en privacidad y protección de activos. Sin embargo, ofrece un nivel de privacidad similar al de Nuevo México pero a un coste considerablemente mayor.

**Ventajas:**
- Miembros no aparecen en registros públicos (igual que Nuevo México)
- Sin impuesto estatal
- Protección de activos superior, las leyes de Wyoming son especialmente robustas en este aspecto
- Leyes empresariales modernas y bien establecidas

**Requiere:** Annual Report anual ante el estado + $60 de tasa ($300 si los activos reportados superan $300,000). Incluido en nuestro plan de mantenimiento.

**Ideal para:** profesionales que necesitan protección de activos reforzada, traders con patrimonios significativos, o emprendedores que prefieren Wyoming por su reputación histórica. Si tu presupuesto lo permite y valoras la protección de activos extra, es una buena opción.

## Delaware: para C-Corps y grandes empresas

**Constitución:** Consultar
**Mantenimiento anual:** Consultar

Delaware es el estado con mayor reputación en derecho empresarial, y es el favorito de las grandes corporaciones y startups que buscan inversión. Su Court of Chancery, un tribunal especializado exclusivamente en disputas corporativas, es referencia mundial.

Pero seamos honestos: **para un freelancer o emprendedor digital que opera con una Single-Member LLC, Delaware es innecesario.** Estás pagando un premium por un marco legal que no vas a utilizar.

**Ventajas:**
- Court of Chancery especializado
- Marco legal más desarrollado de EE.UU.
- Preferido por inversores y venture capital, casi obligatorio si planeas levantar rondas de financiación
- Historial jurisprudencial extenso

**Requiere:** Annual Report + Franchise Tax de $300/año (incluidos en nuestro plan de mantenimiento).

**Ideal para:** startups que planean constituirse como C-Corp y buscar inversión de venture capital. Si un fondo de inversión va a poner dinero en tu empresa, querrá que estés en Delaware. Para todo lo demás, Nuevo México o Wyoming.

## Tabla comparativa rápida

| | Nuevo México | Wyoming | Delaware |
|---|---|---|---|
| Constitución | Consultar | Consultar | Consultar |
| Mantenimiento/año | Consultar | Consultar | Consultar |
| Annual Report | No | Sí ($60) | Sí + Franchise Tax ($300) |
| Privacidad miembros | Alta (no públicos) | Alta (no públicos) | Media (pueden ser públicos) |
| Marco legal | Estándar | Moderno | Premium |
| Impuesto estatal | No | No | No |
| Protección de activos | Buena | Excelente | Buena |

## ¿Cuál elegir? Nuestra recomendación clara

Para el 80% de los freelancers y emprendedores digitales: **Nuevo México.** Menor coste, excelente privacidad, cero burocracia estatal. Es la opción más inteligente si tu objetivo es facturar a clientes internacionales, optimizar tu fiscalidad y operar con tranquilidad.

Si necesitas protección de activos reforzada: **Wyoming.**

Si vas a levantar inversión de VCs: **Delaware** (pero probablemente como C-Corp, no como LLC).

## Lo que el estado NO cambia

Independientemente del estado que elijas, hay cosas que no varían:

- **La tributación federal es la misma**: $0 de impuesto federal para Disregarded Entity de no residente, en los tres estados
- **El <a href="/es/blog/ein-numero-fiscal-llc-como-obtenerlo">EIN</a> es el mismo tipo de número**: lo emite el IRS, no el estado
- **Las obligaciones fiscales federales son idénticas**: <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a>, Form 1120, <a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a>
- **El acceso a banca es el mismo**: <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a>, Relay, Wise aceptan LLCs de cualquier estado
- **Las pasarelas de pago no discriminan por estado**: Stripe, PayPal, Adyen funcionan igual

La elección de estado afecta principalmente al coste de mantenimiento, al nivel de privacidad en registros públicos y a la protección jurídica en caso de disputas. Para el 80% de freelancers digitales, estas diferencias son menores comparadas con el ahorro fiscal y operativo que la LLC aporta independientemente del estado.

## El error de paralizarse por la elección de estado

Vemos esto con frecuencia: freelancers que pasan semanas comparando estados, leyendo foros, viendo vídeos, y al final no hacen nada. Mientras tanto, siguen pagando cuota de autónomos, tributando al tipo máximo, y operando sin protección patrimonial.

La realidad es que cualquiera de los tres estados funciona bien. La diferencia entre Nuevo México y Wyoming es marginal comparada con la diferencia entre tener una LLC y no tenerla.

En Exentax te recomendamos el estado que encaja con tu perfil concreto. No vendemos un estado por defecto. Analizamos tu situación y te decimos cuál tiene más sentido para ti.

Agenda tu asesoría gratuita de 30 minutos y te ayudamos a elegir el estado perfecto para tu LLC. También puedes consultar nuestra <a href="/es/blog/cuanto-cuesta-constituir-llc">guía de costes de constitución</a> para tener todos los números claros.`,
    category: "Comparativas",
    readTime: 6,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Nuevo México vs Wyoming vs Delaware: mejor estado para tu LLC 2026 | Exentax",
    metaDescription: "Comparativa detallada de Nuevo México, Wyoming y Delaware para tu LLC. Costes, privacidad, protección de activos y cuál elegir según tu perfil de negocio.",
  },
  {
    slug: "separar-dinero-personal-llc-por-que-importa",
    title: "Separar dinero personal y de tu LLC: por qué es imprescindible y cómo hacerlo bien",
    excerpt: "Mantener separadas tus finanzas personales y las de tu LLC es la base para proteger tu patrimonio, simplificar tu contabilidad y operar con profesionalidad. Te explicamos cómo hacerlo desde el primer día.",
    content: `Si tienes una LLC en Estados Unidos, una de las mejores prácticas que puedes adoptar desde el primer día es mantener una separación clara entre tu dinero personal y el dinero de tu empresa. Es una práctica profesional que refuerza la <a href="/es/blog/llc-seguridad-juridica-proteccion-patrimonial">protección patrimonial</a> que tu LLC te ofrece y simplifica toda tu gestión financiera.

En este artículo te explicamos por qué es tan importante, qué consecuencias tiene mezclar fondos, y cómo implementar una separación financiera sólida desde el primer día.

## ¿Por qué es tan importante separar tus finanzas?

La LLC (Limited Liability Company) existe para separar tu patrimonio personal del de tu negocio. Si tu empresa tiene una deuda o un problema, tus bienes personales, tu casa, tus ahorros, tu coche, están protegidos. Esa es la razón principal por la que constituyes una LLC.

Para mantener esa protección sólida, es fundamental demostrar que tu LLC opera como una entidad independiente. La mejor forma de hacerlo es manteniendo tus finanzas separadas de forma clara y consistente.

### Las ventajas de una buena separación financiera

Cuando mantienes tus finanzas bien separadas:

- **Tu protección patrimonial se fortalece.** La LLC funciona como escudo real entre tu negocio y tus bienes personales.
- **Tu contabilidad es más clara.** Identificar ingresos, gastos y beneficios se vuelve sencillo.
- **El cumplimiento fiscal es más fácil.** El <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a> y otras declaraciones se preparan sin complicaciones.

### Buenas prácticas que refuerzan tu estructura

Estos son los hábitos que los emprendedores mejor organizados siguen:

- Usar una cuenta bancaria exclusiva para la LLC (Mercury, Relay, etc.)
- Documentar todas las transferencias entre la LLC y el propietario
- Mantener registros contables separados
- Tener un Operating Agreement actualizado
- Capitalizar la LLC adecuadamente desde el inicio
- No mezclar gastos personales con gastos empresariales

## Requisitos legales para la separación financiera

Mantener la separación financiera no es solo una buena práctica, es un requisito legal implícito en la estructura de la LLC. Estos son los puntos que debes cumplir:

### 1. Cuenta bancaria separada y exclusiva

Tu LLC debe tener su propia cuenta bancaria, a nombre de la empresa, con su EIN como identificación fiscal. Nunca debes usar tu cuenta personal para recibir pagos de clientes o pagar gastos del negocio.

### 2. Registros contables independientes

Debes mantener una contabilidad separada para tu LLC. Esto incluye un registro de ingresos, gastos, transferencias al propietario y cualquier transacción entre la empresa y tú como persona.

### 3. Documentación de transacciones entre partes relacionadas

Cada vez que transfieras dinero entre tu LLC y tú, ya sea como distribución de beneficios, reembolso de gastos o préstamo, debe estar documentado. Estas transacciones se reportan en el Form 5472 ante el IRS.

### 4. Operating Agreement vigente

Tu Operating Agreement debe establecer claramente cómo se distribuyen los beneficios, cómo se aprueban los gastos y cuáles son las reglas financieras de la LLC. Sin este documento, la estructura de tu empresa carece de formalidad.

### 5. Capitalización adecuada

Tu LLC debe tener fondos suficientes para operar. Si la empresa no tiene capital propio y tú pagas todo desde tu cuenta personal, es una señal de que no existe separación real.

## Cómo configurar cuentas bancarias separadas

La base de la separación financiera es tener una cuenta bancaria exclusiva para tu LLC. Las dos opciones más populares para no residentes son Mercury y Relay.

### Mercury

Mercury es la plataforma fintech más utilizada por dueños de LLC no residentes. Tus depósitos se custodian en Column NA (banco con licencia federal y seguro FDIC). Sus ventajas para mantener la separación financiera:

- **Cuenta a nombre de la LLC** con el EIN como identificación
- **Sin comisiones mensuales** ni mínimos de saldo
- **Tarjetas de débito virtuales y físicas** vinculadas a la cuenta empresarial
- **Integraciones contables** con QuickBooks, Xero y otras herramientas
- **Transferencias ACH y wire** para pagos nacionales e internacionales
- **Múltiples sub-cuentas** para organizar fondos (operativa, impuestos, reserva)

La apertura es 100% online y no requiere viajar a Estados Unidos. Necesitas tu LLC constituida, el EIN, el Operating Agreement y tu pasaporte vigente.

### Relay

Relay es otra excelente opción, especialmente si necesitas organizar tu dinero en diferentes categorías:

- **Hasta 20 cuentas corrientes** sin coste adicional, puedes crear una para gastos operativos, otra para impuestos, otra para tu salario
- **Sin comisiones mensuales** ni mínimos
- **Tarjetas de débito** asignables a cuentas específicas
- **Integración con software contable**
- **Apertura remota** para no residentes

Relay destaca por su sistema de sub-cuentas, que facilita enormemente la organización financiera y la separación de fondos por categoría. Además, ofrece la posibilidad de generar links de pago procesados por Adyen, lo que permite cobrar a clientes de manera profesional directamente desde la plataforma.

### Slash: rendimiento sobre capital ocioso

Si tu LLC acumula liquidez (reservas para impuestos, fondo operativo, beneficios pendientes de distribuir), ese capital puede estar generando rendimiento en lugar de quedarse parado. **Slash** funciona como capa de tesorería corporativa: coloca tu excedente en instrumentos de bajo riesgo mientras mantienes acceso al capital. Para una LLC que factura $5,000-10,000/mes y distribuye trimestralmente, el capital que se acumula entre distribuciones puede ser considerable.

La ventaja de Slash para la separación financiera es clara: puedes segregar fondos de reserva o impuestos en Slash, generando rendimiento, sin mezclarlos con tu operativa diaria en Mercury o Relay. Es una capa adicional de disciplina financiera.

### Wallester: tarjetas corporativas con control granular

Para los gastos del día a día de tu LLC, **Wallester** permite emitir tarjetas corporativas virtuales y físicas con límites individuales y control de gasto en tiempo real. Esto refuerza la separación financiera porque cada gasto queda registrado, categorizado y vinculado a la tarjeta empresarial, nunca a tu tarjeta personal.

Wallester es especialmente útil si trabajas con colaboradores o subcontratistas: puedes emitir tarjetas con límites específicos para gastos autorizados y revocarlas en cualquier momento. Todo queda documentado automáticamente.

### Revolut Business: operativa multi-divisa

Si tu LLC opera en múltiples monedas, facturas en dólares pero pagas proveedores en euros, por ejemplo. **Revolut Business** ofrece cuentas multi-divisa con tipo de cambio competitivo entre semana. Recuerda que Revolut Business es una EMI (Institución de Dinero Electrónico), no un banco, pero sus funcionalidades de cambio de divisa y tarjetas para equipo complementan perfectamente tu cuenta principal en Mercury o Relay.

### Configuración recomendada

Una estructura de cuentas eficaz para tu LLC podría ser:

1. **Cuenta principal (ingresos):** Mercury o Relay, donde recibes todos los pagos de clientes
2. **Cuenta de gastos operativos:** para pagar herramientas, servicios y proveedores
3. **Cuenta de impuestos:** donde reservas un porcentaje de cada ingreso para obligaciones fiscales
4. **Cuenta de distribuciones:** desde donde te pagas a ti mismo de forma documentada
5. **Tesorería / reserva:** Slash para generar rendimiento sobre capital ocioso mientras mantienes la liquidez separada
6. **Tarjetas corporativas:** Wallester para gastos operativos controlados, con límites y categorización automática

Esta estructura te ayuda a mantener la disciplina financiera y facilita la contabilidad al final del año fiscal. En Exentax te ayudamos a configurar este ecosistema completo desde el primer día.

## Mejores prácticas para pagarte a ti mismo desde tu LLC

Como propietario de una Single-Member LLC, no recibes un "salario" en el sentido tradicional. Lo que haces es tomar **distribuciones de beneficios** (owner's draws). Pero estas distribuciones deben hacerse correctamente para mantener la separación legal.

### Reglas fundamentales

**1. Establece un calendario regular de distribuciones.** No retires dinero de forma errática. Define si te pagarás mensual, quincenal o semanalmente, y mantén la consistencia.

**2. Documenta cada distribución.** Cada transferencia de la cuenta de la LLC a tu cuenta personal debe tener un registro que indique: fecha, monto, concepto ("distribución de beneficios - mes XX") y aprobación según el Operating Agreement.

**3. Transfiere siempre a tu cuenta personal.** No uses la tarjeta de débito de la LLC para gastos personales. Haz una transferencia bancaria a tu cuenta personal y desde ahí paga lo que necesites.

**4. No retires más de lo que la LLC puede permitirse.** Deja suficiente capital en la empresa para cubrir gastos operativos, obligaciones fiscales y un fondo de reserva. Descapitalizar la LLC es uno de los factores que los tribunales consideran para perforar el velo corporativo.

**5. Registra las distribuciones en tu contabilidad.** Cada distribución debe aparecer en los libros de la LLC como una reducción del capital del propietario, no como un gasto del negocio.

### Ejemplo práctico

Supongamos que tu LLC factura $8,000 al mes. Una distribución bien estructurada podría ser:

- **$2,000** → Cuenta de impuestos (25% de reserva)
- **$1,500** → Cuenta de gastos operativos (herramientas, servicios, agente registrado)
- **$500** → Fondo de reserva de la LLC
- **$4,000** → Distribución al propietario (transferencia a tu cuenta personal)

De esta forma, la LLC mantiene capital operativo, cubres tus obligaciones fiscales y te pagas de manera documentada y sostenible.

## Implicaciones fiscales de mezclar fondos

La commingling of funds, mezcla de fondos personales y empresariales, tiene consecuencias fiscales serias que van más allá de la pérdida de protección legal.

### 1. Dificultad para justificar gastos deducibles

Si mezclas gastos personales y empresariales en una misma cuenta, se vuelve extremadamente difícil demostrar cuáles son gastos legítimos del negocio. En caso de auditoría, el IRS puede rechazar deducciones que no puedas justificar con documentación clara.

### 2. Problemas con el Form 5472

El Form 5472 requiere reportar todas las transacciones entre la LLC y su propietario. Si tus finanzas están bien separadas, preparar este formulario es sencillo y directo. Con cuentas mezcladas, el proceso se complica innecesariamente. Nosotros nos encargamos de preparar este formulario por ti.

### 3. Reclasificación de la entidad por el IRS

En situaciones excepcionales, el IRS podría cuestionar la estructura de una LLC que no mantiene una separación financiera real. Mantener tus finanzas bien organizadas desde el principio evita cualquier complicación futura.

### 4. Complicaciones en tu país de residencia

Como no residente en EE.UU., los ingresos de tu LLC tributan en tu país de residencia fiscal. Si tus finanzas están mezcladas, tu declaración de renta local se complica enormemente. Las autoridades fiscales de tu país pueden cuestionar la legitimidad de la estructura si ven que no hay separación real entre tú y la empresa.

### 5. Pérdida de beneficios de tratados fiscales

Algunos países tienen tratados de doble imposición con Estados Unidos que ofrecen beneficios fiscales. Pero estos beneficios pueden perderse si las autoridades determinan que la LLC no opera como una entidad independiente, algo que la mezcla de fondos facilita enormemente.

## Requisitos de registro y documentación

Mantener registros financieros adecuados no es opcional. Es un requisito del IRS y una pieza fundamental para proteger tu velo corporativo.

### Qué debes registrar

- **Todos los ingresos** recibidos por la LLC, con fecha, monto, cliente y concepto
- **Todos los gastos** pagados por la LLC, con facturas o recibos de soporte
- **Todas las distribuciones** al propietario, con fecha, monto y documentación de aprobación
- **Todas las aportaciones de capital** del propietario a la LLC
- **Movimientos bancarios completos**: extractos mensuales de la cuenta de la LLC
- **Contratos y acuerdos** con clientes, proveedores y terceros

### Cuánto tiempo conservar los registros

El IRS recomienda conservar los registros fiscales durante un mínimo de **3 años** desde la fecha de presentación de la declaración. Sin embargo, en casos de omisión significativa de ingresos, el plazo se extiende a **6 años**. Para mayor seguridad, conserva tus registros durante **7 años**.

### Herramientas recomendadas

- **QuickBooks Online** o **Xero** para la contabilidad general
- **Mercury** o **Relay** con sus exportaciones de extractos bancarios
- **Google Drive** o **Dropbox Business** para almacenar facturas y documentación
- **Notion** o **Airtable** para un registro organizado de transacciones y distribuciones

La clave es tener un sistema que puedas mantener de forma consistente. No importa qué herramienta uses, lo que importa es que la uses siempre.

## Errores comunes que cometen los emprendedores

Después de trabajar con cientos de emprendedores latinos que operan con LLCs en Estados Unidos, estos son los errores más frecuentes que vemos:

### 1. Usar la cuenta de la LLC para gastos personales

Este es el error número uno. Pagar el supermercado, Netflix, la gasolina o una cena con la tarjeta de la LLC destruye la separación financiera. No importa si "luego lo devuelves", la mezcla ya ocurrió.

### 2. Recibir pagos de clientes en la cuenta personal

Si un cliente te paga a tu cuenta personal en lugar de a la cuenta de la LLC, ese ingreso no está registrado como ingreso empresarial. Esto genera problemas contables, fiscales y legales.

### 3. No documentar las distribuciones

Muchos propietarios simplemente transfieren dinero de la LLC a su cuenta personal sin ningún registro. Sin documentación, estas transferencias pueden interpretarse como commingling en lugar de distribuciones legítimas.

### 4. No tener una cuenta bancaria dedicada desde el inicio

Algunos emprendedores constituyen su LLC pero tardan semanas o meses en abrir la cuenta bancaria empresarial. Mientras tanto, operan con su cuenta personal "temporalmente". Ese periodo sin separación puede generar problemas.

### 5. Prestar dinero a la LLC sin documentarlo

Si aportas capital personal a tu LLC, por ejemplo, para cubrir un gasto inicial, debes documentarlo como un préstamo o una aportación de capital. Sin documentación, la línea entre tus fondos y los de la empresa se difumina.

### 6. No reservar fondos para impuestos

Gastar todo el dinero que entra en la LLC sin reservar para obligaciones fiscales es un error costoso. Cuando llega la fecha de presentar el Form 1120 y Form 5472, muchos emprendedores descubren que no tienen fondos para pagar los servicios de compliance.

### 7. Ignorar las reglas durante los primeros meses

Muchos emprendedores piensan que las reglas de separación financiera solo importan cuando la LLC factura mucho. Falso. La separación debe existir desde el día uno. Un tribunal evaluará tu comportamiento desde la constitución de la empresa.

## Checklist de separación financiera

Para asegurarte de que estás haciendo todo correctamente, revisa esta lista:

- ✓ Cuenta bancaria a nombre de la LLC (Mercury o Relay)
- ✓ Operating Agreement firmado y actualizado
- ✓ Contabilidad separada para la LLC
- ✓ Distribuciones documentadas con fecha, monto y concepto
- ✓ Sin gastos personales desde la cuenta de la LLC
- ✓ Sin ingresos empresariales en la cuenta personal
- ✓ Reserva de impuestos en cuenta dedicada (o en Slash generando rendimiento)
- ✓ Tarjetas corporativas (Wallester) para gastos empresariales, nunca tarjetas personales
- ✓ Registros conservados por al menos 7 años
- ✓ Form 5472 presentado correctamente cada año
- ✓ Aportaciones de capital documentadas

## Conclusión

Separar tu dinero personal del dinero de tu LLC no es un detalle administrativo, es la base sobre la que se sostiene toda la protección legal y fiscal que tu LLC te ofrece. Sin separación financiera, tu LLC es solo un nombre en un papel.

La buena noticia es que implementar esta separación es sencillo si lo haces desde el principio. Una cuenta bancaria dedicada, un sistema de contabilidad básico y disciplina en tus distribuciones es todo lo que necesitas.

En Exentax nos encargamos de que tu LLC esté correctamente estructurada desde el día uno, incluyendo la apertura de tu cuenta bancaria, la configuración de tu contabilidad y la presentación de todos los formularios ante el IRS. Si quieres asegurarte de que tu separación financiera es correcta, puedes agendar una asesoría gratuita donde revisamos tu situación sin compromiso.

¿Quieres asegurarte de que tu LLC está bien separada desde el primer día? Agenda tu asesoría gratuita de 30 minutos y te ayudamos a configurar tu estructura correctamente. También te recomendamos leer nuestra <a href="/es/blog/como-operar-llc-dia-a-dia">guía práctica para operar tu LLC en el día a día</a> y nuestra guía sobre <a href="/es/blog/gastos-deducibles-llc-que-puedes-deducir">gastos deducibles en tu LLC</a>.`,
    category: "Operativa",
    readTime: 17,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Separar dinero personal y LLC: guía completa con Mercury, Relay, Slash y Wallester | Exentax",
    metaDescription: "Por qué separar finanzas personales y de tu LLC es imprescindible. Configura Mercury, Relay, Slash y Wallester para proteger tu patrimonio y optimizar tu gestión.",
  },
  {
    slug: "ein-numero-fiscal-llc-como-obtenerlo",
    title: "EIN: qué es el número fiscal de tu LLC y cómo obtenerlo paso a paso",
    excerpt: "El EIN es el equivalente al NIF de tu LLC en Estados Unidos. Sin él no puedes abrir cuenta bancaria, declarar impuestos ni operar legalmente. Te explicamos cómo conseguirlo.",
    content: `El EIN (Employer Identification Number) es el número de identificación fiscal que el IRS asigna a tu LLC. Piensa en él como el NIF o CIF de tu empresa en Estados Unidos. Sin este número, tu LLC existe legalmente pero no puede operar en la práctica.

## ¿Para qué necesitas el EIN?

El EIN es imprescindible para prácticamente todo lo que vayas a hacer con tu LLC:

- **Abrir cuenta bancaria.** Ningún banco, ni Mercury, ni Relay, ni ningún otro, te abrirá una cuenta sin tu EIN.
- **Declarar impuestos ante el IRS.** El Form 1120 y el Form 5472 requieren tu EIN como identificación.
- **Cobrar a clientes.** Stripe y cualquier procesador de pagos te pedirán el EIN para verificar tu empresa. PayPal Business además requiere el ITIN del propietario.
- **Contratar servicios.** Proveedores y plataformas B2B en Estados Unidos solicitan el EIN para generar facturas y formularios 1099.

Sin EIN, tu LLC es como un coche sin matrícula: legal sobre el papel, pero no puedes circular con él. Si aún no has dado el paso de constituir tu LLC, revisa nuestra <a href="/es/blog/constituir-llc-proceso-paso-a-paso">guía paso a paso de constitución</a>.

### El EIN desbloquea toda tu infraestructura financiera

Es importante entender que el EIN no es solo un trámite administrativo, es la llave que abre toda la infraestructura financiera de tu LLC:

- **Banca operativa:** Mercury (Column NA, FDIC, $0 wires) y Relay (Thread Bank, hasta 20 sub-cuentas)
- **Tesorería corporativa:** Slash para generar rendimiento sobre capital ocioso
- **Tarjetas corporativas:** Wallester para control de gastos con tarjetas virtuales y físicas
- **Multi-divisa:** Wise Business (tipo de cambio mid-market) y Revolut Business (cuentas multi-divisa)
- **Pasarelas de pago:** Stripe, Adyen, DoDo Payments, todas requieren EIN para verificación
- **Inversión y trading:** Interactive Brokers (150+ mercados globales), Tradovate (futuros), Kraken (cripto), cuentas corporativas que necesitan EIN
- **Procesadores de pago:** PayPal Business (requiere además ITIN del propietario)

Sin el EIN, ninguna de estas plataformas te abre la puerta. Por eso es el primer paso operativo después de constituir la LLC.

## ¿Cómo se obtiene el EIN?

El IRS ofrece varias vías para solicitar el EIN. Pero antes de que te líes con formularios y llamadas internacionales: **en Exentax nos encargamos de todo el proceso del EIN.** Lo gestionamos como parte de la constitución de tu LLC. Tú no tienes que hablar con el IRS, ni enviar faxes, ni esperar al teléfono. Nosotros nos ocupamos.

Dicho esto, para que entiendas cómo funciona:

### Opción 1: Online (solo para residentes en EE.UU.)

Si tienes un SSN (Social Security Number) o ITIN y una dirección en Estados Unidos, puedes solicitarlo directamente en la web del IRS y recibirlo en minutos. Pero esta opción no está disponible para no residentes sin SSN/ITIN.

### Opción 2: Por correo o fax (Form SS-4)

Como no residente, se debe completar el formulario SS-4 y enviarlo al IRS por fax o correo postal. El proceso funciona así:

1. **Se completa el Form SS-4** con los datos de tu LLC: nombre, dirección del agente registrado, estado de constitución, tipo de entidad y fecha de formación.
2. **Se envía el formulario por fax** al número del IRS designado para solicitudes internacionales.
3. **Se recibe el EIN por fax** en un plazo de 4 a 7 días hábiles. Por correo postal puede tardar 4-6 semanas.

### Opción 3: Por teléfono

El IRS tiene una línea para solicitudes internacionales. Se puede llamar, proporcionar los datos del SS-4 verbalmente y recibir el EIN en la misma llamada. El horario es limitado (lunes a viernes, 6:00 AM - 11:00 PM EST) y la llamada puede implicar tiempos de espera largos. A veces muy largos. A veces te dan ganas de colgar y volver a llamar al día siguiente.

En Exentax conocemos los mejores métodos y horarios para obtener el EIN de forma rápida. Es parte de nuestra rutina diaria.

## ¿Cuánto cuesta obtener el EIN?

**El EIN es completamente gratuito.** El IRS no cobra nada por emitirlo. Si alguien te cobra solo por el EIN, desconfía, probablemente estás pagando un servicio inflado.

En Exentax, la obtención del EIN está incluida en todos nuestros planes de constitución. Nos encargamos de preparar el SS-4, enviarlo, hacer seguimiento y entregarte tu número listo para usar. Sin costes extra, sin sorpresas.

## ¿Cuánto tarda?

Los plazos dependen del método:

- **Por fax:** 4-7 días hábiles (el más habitual para no residentes)
- **Por teléfono:** el mismo día si consigues conectar
- **Por correo postal:** 4-6 semanas (no recomendado por lento)

Con Exentax, normalmente tienes tu EIN en menos de una semana.

## Errores frecuentes al solicitar el EIN

1. **Datos inconsistentes con los Articles of Organization.** El nombre de la LLC, la dirección y el tipo de entidad deben coincidir exactamente con lo registrado en el estado. Un error de una letra y el IRS te lo rechaza.
2. **Seleccionar el tipo de entidad incorrecto.** Para una Single-Member LLC de no residente, la clasificación correcta es "Disregarded Entity". Parece obvio, pero se equivoca más gente de la que crees.
3. **Usar una dirección personal en lugar del agente registrado.** El IRS envía correspondencia a la dirección que proporcionas. Si usas tu dirección personal en otro país, la documentación puede no llegar o llegar con mucho retraso.
4. **Intentar solicitar online sin SSN/ITIN.** El sistema online rechaza solicitudes sin estos números. No pierdas tiempo intentándolo.

## ¿EIN vs ITIN: cuál es la diferencia?

- **EIN** es para empresas. Tu LLC tiene un EIN. Es el "NIF" de tu empresa americana.
- **ITIN** (Individual Taxpayer Identification Number) es para personas físicas no residentes que necesitan un número fiscal personal en EE.UU. Te lo explicamos en detalle en nuestra <a href="/es/blog/itin-ssn-que-son-como-obtenerlos">guía sobre ITIN, SSN y EIN</a>.

Para operar tu LLC, solo necesitas el EIN. El ITIN es necesario en ciertos casos específicos, por ejemplo, si tienes ingresos personales imponibles en EE.UU., si necesitas reclamar beneficios de un tratado fiscal, o si quieres abrir ciertas cuentas que lo requieren.

**En Exentax también te ayudamos con la obtención del ITIN** si lo necesitas. Es un proceso más largo y burocrático que el EIN (requiere enviar documentación certificada al IRS), pero lo gestionamos de principio a fin.

## ¿Qué pasa si pierdes tu EIN?

No te preocupes. El EIN se asigna de forma permanente a tu LLC y no caduca. Si pierdes el documento de asignación (la carta CP 575), puedes solicitar una copia llamando al IRS o enviando el formulario correspondiente. También puedes encontrar tu EIN en declaraciones anteriores presentadas ante el IRS. Y si eres cliente nuestro, obviamente lo tenemos archivado.

¿Quieres constituir tu LLC y que nos encarguemos del EIN, el ITIN (si lo necesitas) y todo lo demás? Agenda tu asesoría gratuita y arrancamos.`,
    category: "Guías",
    readTime: 7,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "EIN para tu LLC: qué es, cómo obtenerlo y qué desbloquea | Exentax",
    metaDescription: "El EIN es la llave de tu LLC: sin él no abres Mercury, Stripe ni cuentas de inversión. Guía paso a paso para no residentes, plazos y errores frecuentes.",
  },
  {
    slug: "cuenta-bancaria-mercury-llc-extranjero",
    title: "Cómo abrir una cuenta Mercury para tu LLC desde cualquier país",
    excerpt: "Mercury es la plataforma fintech preferida por dueños de LLC no residentes. Te explicamos paso a paso cómo abrir tu cuenta, qué documentos necesitas, cuánto tarda y por qué es la mejor opción.",
    content: `Si tienes una LLC en Estados Unidos, necesitas una cuenta bancaria americana. Y Mercury se ha convertido en la opción número uno para no residentes por una razón muy sencilla: puedes abrirla 100% online, sin pisar suelo americano, y con unas condiciones que ya quisieran muchos bancos tradicionales. Si aún estás decidiendo entre bancos y fintechs, consulta nuestra <a href="/es/blog/bancos-vs-fintech-llc-donde-abrir-cuenta">comparativa de bancos vs fintech para tu LLC</a>.

## ¿Qué es Mercury exactamente?

Aquí hay un matiz importante que mucha gente confunde: **Mercury no es un banco.** Mercury es una plataforma fintech, un Money Transmitter registrado en EE.UU., que ofrece servicios bancarios a través de su banco asociado, **Column NA** (anteriormente conocido como Column National Association). Column NA es un banco con licencia federal, asegurado por la FDIC hasta $250,000 por depositante.

¿Qué significa esto en la práctica? Que tu dinero está depositado de forma segura en un banco real con protección federal, pero la experiencia de usuario, la app, el panel de control y el soporte los gestiona Mercury. Lo mejor de los dos mundos: la seguridad de un banco regulado con la usabilidad de una fintech moderna.

Sus ventajas principales para dueños de LLC:

- **Apertura 100% remota.** No necesitas SSN ni presencia física en EE.UU. Pasaporte y EIN, y listo.
- **$0 comisiones.** Ni mantenimiento, ni mínimos de saldo, ni sorpresas a final de mes.
- **Wire transfers gratuitos.** Tanto envío como recepción de wires nacionales e internacionales: $0. Sí, has leído bien. Cero. Nada. Gratis. Esto es casi inaudito en el sector.
- **ACH gratuito.** Transferencias domésticas sin coste.
- **Tarjeta de débito virtual y física.** Para pagos online, suscripciones y gastos operativos.
- **Integraciones contables.** Se conecta con QuickBooks, Xero y otras herramientas de contabilidad.
- **API para desarrolladores.** Ideal si necesitas automatizar pagos, conciliaciones o integrarte con tu stack.
- **Múltiples cuentas.** Puedes crear sub-cuentas para organizar tu dinero (impuestos, operaciones, reservas).

## Requisitos para abrir cuenta en Mercury

Para solicitar una cuenta en Mercury como no residente necesitas:

1. **LLC constituida** en cualquier estado (Articles of Organization).
2. **EIN** (Employer Identification Number) emitido por el IRS.
3. **Operating Agreement** firmado.
4. **Pasaporte vigente** del propietario/miembro de la LLC.
5. **Dirección del Registered Agent** en Estados Unidos.
6. **Descripción clara del negocio**: qué hace tu empresa, a quién vende, cómo genera ingresos. Cuanto más detallada, mejor.

## Proceso paso a paso

### 1. Solicitud online

Accedes a mercury.com y completas el formulario de solicitud. Te pedirán los datos de la LLC, el EIN, información del propietario (nombre, nacionalidad, dirección) y una descripción de la actividad. Consejo: sé específico. "Marketing digital para empresas B2B en Europa" es infinitamente mejor que "servicios de marketing".

### 2. Verificación de identidad

Subes una foto de tu pasaporte y, en algunos casos, un selfie para verificación biométrica. El sistema automatizado suele completarlo en minutos. No es tan dramático como suena.

### 3. Verificación de la empresa

Mercury verifica que tu LLC existe consultando los registros del estado donde la constituiste. También cruza información con el IRS para confirmar el EIN. Todo automático.

### 4. Revisión manual (si aplica)

En algunos casos hay una revisión manual adicional. Esto ocurre especialmente con actividades consideradas de mayor riesgo (criptomonedas, trading, servicios financieros). Pueden pedirte documentación adicional o una breve entrevista. No te asustes, es normal y suele resolverse rápido.

### 5. Aprobación

Una vez aprobada, tu cuenta está lista. Puedes enviar y recibir transferencias, vincular Stripe y PayPal, solicitar la tarjeta de débito y empezar a operar.

## ¿Cuánto tarda la aprobación?

- **Caso típico:** 1-3 días hábiles.
- **Con revisión manual:** 5-10 días hábiles.
- **Si te rechazan:** puedes volver a aplicar ajustando la información. No es el fin del mundo.

## ¿Por qué pueden rechazarte?

- **Actividad no soportada.** Mercury no trabaja con negocios de cannabis, armas, contenido adulto o gambling.
- **Descripción vaga.** Si no explicas claramente qué hace tu empresa, compliance te rechaza. Este es el error más común y más fácil de evitar.
- **Inconsistencias.** Si el nombre en el pasaporte no coincide con el del Operating Agreement, o las direcciones no cuadran.
- **País de alto riesgo.** Aunque Mercury acepta no residentes de la mayoría de países, algunos tienen restricciones adicionales.

## Más allá de la cuenta bancaria: la operativa financiera completa

Mercury es la base, pero una LLC bien estructurada necesita más que una cuenta bancaria. Estas son las plataformas que complementan Mercury para crear una operativa financiera profesional:

### Slash: tesorería corporativa

Si tu LLC mantiene capital entre distribuciones (la mayoría de freelancers acumula 2-3 meses de ingresos), **Slash** permite que esa liquidez genere rendimiento. Funciona como capa de gestión de tesorería, colocando el excedente en instrumentos de bajo riesgo sin bloquear el acceso al capital. Es especialmente útil para freelancers que hacen distribuciones trimestrales o semestrales.

### Wallester: tarjetas corporativas con control total

**Wallester** es un emisor de tarjetas corporativas (virtuales y físicas) que te permite controlar cada gasto de tu LLC con límites individuales, categorización automática y revocación instantánea. Para clientes Exentax, Wallester proporciona un IBAN en euros, facilitando la recepción y envío de pagos en zona euro directamente desde tu estructura LLC. Es la herramienta perfecta para mantener la separación financiera: cada gasto empresarial va a la tarjeta Wallester, nunca a tu tarjeta personal. Si trabajas con colaboradores, puedes emitirles tarjetas con límites específicos. Todo queda documentado.

### Wise Business: transferencias internacionales al tipo de cambio real

**Wise Business** es una EMI (Institución de Dinero Electrónico), no es un banco. Su ventaja principal: transferencias internacionales al tipo de cambio mid-market (el real, sin margen oculto). Si facturas en dólares pero tienes gastos en euros, libras o cualquier otra moneda, Wise Business te ahorra el diferencial cambiario que los bancos tradicionales cobran. También te da cuentas locales en múltiples divisas con IBANs y routing numbers propios.

### Revolut Business: multi-divisa y tarjetas para equipo

**Revolut Business** es otra EMI con funcionalidades multi-divisa potentes. Tipo de cambio competitivo entre semana, tarjetas para miembros del equipo, y una app con analítica de gastos. Complementa bien a Mercury si operas en múltiples mercados y necesitas mover dinero entre divisas frecuentemente.

## Alternativas a Mercury como cuenta principal

Si Mercury no funciona para tu caso (actividad no soportada, rechazo, preferencia personal), estas son las alternativas como cuenta bancaria principal:

- **Relay**: Fintech sin comisiones. Depósitos en **Thread Bank**. Hasta 20 sub-cuentas gratuitas para organizar fondos. Links de pago procesados por Adyen. Excelente para negocios que necesitan sub-asignación y gestión de equipo.
- **Airwallex**: Plataforma global con cuentas multi-divisa. Buena opción si operas en Asia-Pacífico.
- **Lili**: Neobanco para freelancers con herramientas de contabilidad integradas.
- **Sokin**: Especializada en pagos internacionales con tarifas planas.

## Comisiones de Mercury: la tabla definitiva

| Concepto | Coste |
| --- | --- |
| Mantenimiento mensual | $0 |
| Wire transfer envío (nacional) | $0 |
| Wire transfer recepción (nacional) | $0 |
| Wire transfer envío (internacional) | $0 |
| Wire transfer recepción (internacional) | $0 |
| ACH envío | $0 |
| ACH recepción | $0 |
| Tarjeta de débito | $0 |
| Cheques | $0 |

Sí, todo a cero. Mercury monetiza con productos premium (Mercury Treasury, crédito, etc.), no con comisiones sobre operaciones básicas.

## Consejos prácticos

1. **Prepara una descripción clara de tu negocio** antes de solicitar. Explica qué servicio ofreces, a quién vendes, en qué moneda cobras y cuántos ingresos esperas. Esto es lo que marca la diferencia entre aprobación y rechazo.
2. **No mezcles fondos personales y empresariales.** Usa la cuenta de Mercury exclusivamente para operaciones de la LLC. Es fundamental para mantener la protección de responsabilidad limitada. Te lo explicamos en nuestra guía sobre <a href="/es/blog/separar-dinero-personal-llc-por-que-importa">cómo separar dinero personal y de tu LLC</a>.
3. **Activa la autenticación de dos factores** desde el primer día. La seguridad no es opcional.
4. **Crea sub-cuentas** para organizar tu dinero: una para operaciones, otra para impuestos, otra para reservas. Mercury lo hace muy fácil.

En Exentax nos encargamos de la apertura de tu cuenta Mercury como parte del proceso de constitución de tu LLC. Preparamos toda la documentación, revisamos la descripción de tu negocio y nos aseguramos de que todo esté perfecto antes de enviar la solicitud. Si te preocupa el proceso de verificación bancaria, lee nuestra guía sobre <a href="/es/blog/due-diligence-bancario-llc-americana">due diligence bancario</a> y cómo <a href="/es/blog/evitar-bloqueos-mercury-wise-revolut">evitar bloqueos en Mercury, Wise y Revolut</a>.

Agenda tu asesoría gratuita de 30 minutos y te explicamos todo el ecosistema financiero para tu LLC.`,
    category: "Herramientas",
    readTime: 9,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Cuenta Mercury para tu LLC + ecosistema financiero completo (Slash, Wallester, Wise) | Exentax",
    metaDescription: "Guía completa: abrir cuenta Mercury para tu LLC como no residente + Slash (tesorería), Wallester (tarjetas), Wise Business y Revolut Business. Column NA, $0 wires.",
  },
  {
    slug: "autonomo-espana-vs-llc-estados-unidos",
    title: "Autónomo en España vs LLC en EE.UU.: comparativa fiscal completa",
    excerpt: "¿Cuánto pagas como autónomo en España y cuánto pagarías con una LLC en Estados Unidos? Desglosamos números reales, ventajas y desventajas de cada opción.",
    content: `Si eres autónomo en España y facturas a clientes internacionales, o tu negocio es 100% digital, seguro que ya has pensado: "¿tiene sentido seguir pagando el 40% al fisco español?" La respuesta corta: probablemente no. Los números son brutales. Y si ya estás convencido de que quieres dejarlo, te recomendamos también nuestra guía sobre <a href="/es/blog/autonomos-espana-por-que-dejar-de-serlo">por qué los freelancers españoles están dejando el régimen de autónomos</a>.

Vamos a comparar con datos reales cuánto pagas como autónomo en España y cuánto pagarías operando a través de una LLC en Estados Unidos. Sin rodeos.

## Carga fiscal como autónomo en España

Como autónomo en España, tu tributación se compone de:

### IRPF (Impuesto sobre la Renta)

El IRPF es progresivo. Cuanto más ganas, más pagas:

- Hasta 12.450€: **19%**
- 12.450€ – 20.200€: **24%**
- 20.200€ – 35.200€: **30%**
- 35.200€ – 60.000€: **37%**
- 60.000€ – 300.000€: **45%**
- Más de 300.000€: **47%**

Si facturas 60.000€ al año como autónomo, tu tipo efectivo de IRPF puede rondar el **28-32%** dependiendo de tus gastos deducibles. Y aquí está el problema: como autónomo en España, los gastos que puedes deducir son limitados y las autoridades fiscales los revisan con lupa.

Un punto relevante para entender cómo encaja una LLC en el sistema fiscal español: la **Resolución V0290-20 de la DGT (Dirección General de Tributos)** y resoluciones vinculantes posteriores analizan el tratamiento fiscal de entidades extranjeras con pass-through taxation. La clave está en cómo se califica la LLC en España: si se considera entidad transparente, los ingresos tributan directamente en el IRPF del titular. Esto no es un vacío legal, es un mecanismo reconocido que requiere entender bien ambas jurisdicciones.

### Cuota de autónomos (RETA)

Desde 2023, España aplica un sistema de cotización por ingresos reales. Las cuotas varían entre **230€ y 500€/mes** (2.760€-6.000€/año) según tu tramo de rendimiento neto. Esto lo pagas sí o sí, factures o no factures.

### IVA

Si vendes servicios a empresas de la UE, aplicas inversión del sujeto pasivo (0% IVA). Si vendes a particulares o fuera de la UE, puede aplicar IVA o exención. Y encima tienes que gestionar modelos trimestrales (303, 349, 390...).

### Resultado típico

Un autónomo en España que factura **60.000€ anuales** con gastos deducibles habituales puede acabar pagando entre **18.000€ y 24.000€** entre IRPF, cuota de autónomos y otros costes. Eso es un **30-40%** de carga fiscal total. Casi la mitad de lo que ganas se lo lleva el Estado.

## Carga fiscal con una LLC en Estados Unidos

Con una Single-Member LLC como no residente, la cosa cambia radicalmente:

### Impuesto federal en EE.UU.: $0

El IRS clasifica la Single-Member LLC de no residente como "Disregarded Entity". Esto es lo que se conoce como **pass-through taxation**: la LLC no paga impuesto federal sobre la renta en Estados Unidos. Los beneficios "pasan a través" de la LLC directamente al propietario.

Si no tienes ingresos de fuente estadounidense (tus clientes están fuera de EE.UU. o tú prestas servicios desde fuera), la LLC paga **exactamente $0 de impuesto federal**. Cero. Nada. Ni un centavo.

### Impuesto estatal

Depende del estado de constitución:

- **Nuevo México:** 0% impuesto estatal para LLCs de no residentes. Sin Annual Report.
- **Wyoming:** 0% impuesto estatal. Annual Report de $60/año.
- **Delaware:** 0% impuesto estatal sobre ingresos fuera de Delaware. Franchise Tax de $300/año.

### Obligaciones fiscales (compliance)

- **Form 5472 + Form 1120:** declaración informativa anual ante el IRS. No implica pago de impuestos, es papeleo informativo que en Exentax gestionamos por ti.
- **BOI Report:** reporte de titularidad real ante FinCEN.
- **Coste anual de mantenimiento:** según el estado (incluye agente registrado, declaraciones y compliance completo).

### Fiscalidad optimizada en tu país de residencia

Aquí está la clave que muchos no entienden: la LLC no te exime de declarar en tu país de residencia, pero sí **optimiza radicalmente tu base imponible**.

¿Cómo? Gracias al pass-through taxation, declaras los **beneficios netos** de la LLC: ingresos menos todos los gastos deducibles de la empresa. Y la lista de gastos deducibles en una LLC es mucho más amplia que como autónomo o trabajador independiente.

En Exentax diseñamos la estructura completa para que tu situación fiscal en tu país de residencia sea lo más eficiente posible desde el primer día. Analizamos tu caso concreto y te explicamos exactamente cómo funciona para tu perfil específico.

### Gastos deducibles que reducen tu base imponible

Con una LLC puedes deducir todo gasto "ordinario y necesario" para tu negocio:

- **Software y herramientas:** Notion, Slack, Figma, Adobe, hosting, dominios, servidores cloud
- **Hardware:** ordenador, monitor, teclado, ratón, auriculares, cámara web
- **Marketing:** Google Ads, Facebook Ads, diseño gráfico, SEO, email marketing
- **Coworking y oficina:** membresías de coworking, alquiler de oficina, material de oficina
- **Home office:** parte proporcional de alquiler, internet, electricidad, teléfono
- **Formación:** cursos, libros profesionales, conferencias, eventos del sector
- **Viajes de negocio:** billetes de avión, alojamiento, transporte local
- **Servicios profesionales:** contabilidad, legal, consultoría, registered agent
- **Comisiones:** Stripe, PayPal, comisiones bancarias
- **Seguros:** seguro de responsabilidad civil, seguro médico profesional
- **Suscripciones profesionales:** herramientas de productividad, plataformas de diseño, APIs
- **Operating Agreement y documentación:** incluido en tu plan con Exentax

Cuantos más gastos legítimos documentes, menor es tu base imponible. Menos base = menos impuestos. Así de directo. Consulta nuestra <a href="/es/blog/gastos-deducibles-llc-que-puedes-deducir">guía completa de gastos deducibles en tu LLC</a> para no dejarte nada.

### Resultado típico

Con 60.000€ de facturación y una estructura optimizada con gastos deducibles bien documentados, la carga fiscal total (coste LLC + tributación en tu país de residencia) se reduce drásticamente. La LLC en sí paga **0% de impuesto federal** en EE.UU.

## La diferencia en números

Vamos a ponerlo claro con un ejemplo de 60.000€ de facturación:

- **Como autónomo en España:** pagas entre 18.000€ y 24.000€ en impuestos y cuotas
- **Con LLC optimizada:** pagas entre 5.000€ y 8.000€ en total (impuestos + coste LLC)
- **Ahorro anual:** entre **10.000€ y 19.000€** más en tu bolsillo

Eso es un viaje, un fondo de emergencia, una inversión... o simplemente vivir mejor. Cada año.

## Comparativa directa

| Concepto | Autónomo España | LLC en EE.UU. |
|----------|----------------|---------------|
| Impuesto federal EEUU | N/A | 0% (pass-through) |
| Carga fiscal total | 30-40% | 0% federal EE.UU. |
| Protección patrimonial | No | Sí |
| Banca en dólares | Limitada | Total (Mercury, $0 comisiones) |
| Stripe sin restricciones | No | Sí |
| Credibilidad internacional | Moderada | Alta |
| Gastos deducibles | Limitados | Amplios |
| Cuota fija mensual | Sí (RETA) | No |
| Complejidad administrativa | Media | Media (Exentax se encarga) |
| Coste de mantenimiento | Cuota autónomos | Consultar |

## ¿Para quién tiene sentido la LLC?

La LLC tiene sentido si cumples al menos dos de estos criterios:

1. **Facturas más de 30.000€/año** a clientes internacionales.
2. **Tu negocio es 100% digital**: no requiere presencia física en España.
3. **Cobras en dólares** o necesitas acceso a plataformas financieras de EE.UU.
4. **Quieres protección patrimonial** separando bienes personales de los del negocio.
5. **Planeas escalar** y necesitas una estructura que soporte crecimiento.
6. **Estás harto** de pagar cuota de autónomos, gestionar IVA trimestral y ver cómo el sistema fiscal se lleva casi la mitad.

## ¿Para quién NO tiene sentido?

- Autónomos con clientes principalmente nacionales españoles que requieren factura con IVA.
- Negocios con menos de 20.000€/año de facturación (el ahorro no justifica los costes).
- Profesiones reguladas que exigen colegiación local (abogados, médicos, arquitectos con proyectos nacionales).

## La infraestructura financiera que tu autonomía española no te da

Más allá del ahorro fiscal, la LLC te abre el acceso a herramientas financieras que como autónomo en España simplemente no existen:

- **Banca sin comisiones:** Mercury (Column NA, FDIC, $0 en wires nacionales e internacionales) o Relay (Thread Bank, 20 sub-cuentas gratuitas)
- **Tesorería corporativa:** Slash genera rendimiento sobre tu capital ocioso, el dinero que reservas para impuestos o mantienes como fondo operativo trabaja para ti en lugar de depreciarse
- **Tarjetas corporativas:** Wallester te permite emitir tarjetas virtuales y físicas con límites y control granular, algo que las tarjetas de autónomo en España ni se acercan a ofrecer
- **Multi-divisa real:** Wise Business al tipo de cambio mid-market y Revolut Business con cuentas multi-divisa, sin los márgenes ocultos de los bancos españoles
- **Pasarelas de pago globales:** Stripe, Adyen, DoDo Payments (Merchant of Record que gestiona IVA/GST automáticamente), sin las restricciones que tienen los autónomos españoles
- **Inversión corporativa:** Interactive Brokers (150+ mercados), Tradovate (futuros CME/CBOT/NYMEX), Kraken (200+ criptoactivos con liquidez institucional)

Como autónomo en España, tu único "ecosistema" es el banco de siempre con sus comisiones, un TPV con condiciones mediocres y un asesor que te dice que no hay nada que hacer. Con una LLC y Exentax, tienes acceso a infraestructura financiera de primer nivel mundial.

## En Exentax nos encargamos de todo

Si decides dar el paso, en Exentax no solo constituimos tu LLC y obtenemos tu EIN, diseñamos tu estructura completa: apertura de cuenta bancaria, configuración de tesorería con Slash, tarjetas corporativas Wallester, integración con Stripe o la pasarela que necesites, y todo el compliance anual (Form 5472, BOI Report, renovación de agente registrado). No somos vendedores de LLCs: somos diseñadores de estructuras.

¿Quieres saber exactamente cuánto ahorrarías con tu facturación? Usa nuestra calculadora fiscal gratuita o agenda una asesoría de 30 minutos. Te damos números reales, no promesas.`,
    category: "Comparativas",
    readTime: 10,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Autónomo España vs LLC EE.UU.: comparativa fiscal completa 2026 | Exentax",
    metaDescription: "Autónomo en España paga 30-40%. LLC en EE.UU. paga 0% federal. Comparativa con números reales, ecosistema financiero completo y análisis de cuándo conviene el cambio.",
  },
  {
    slug: "impuestos-clientes-internacionales-espana",
    title: "Impuestos si tienes clientes internacionales en España: lo que nadie te cuenta",
    excerpt: "Si facturas a clientes de fuera de España, estás en una posición fiscal privilegiada que la mayoría desaprovecha. Te explicamos cómo funciona la tributación real y qué opciones tienes.",
    content: `Si eres autónomo o freelancer en España y tus clientes están en otros países, ya sea Estados Unidos, Reino Unido, Alemania o cualquier otra parte del mundo, tu situación fiscal es completamente diferente a la de alguien que trabaja solo con clientes nacionales.

Y sin embargo, la mayoría de los asesores fiscales en España te tratan exactamente igual. Te aplican el mismo IRPF progresivo, te cobran la misma cuota de autónomos, y ni siquiera mencionan que existen alternativas legales para optimizar tu carga fiscal de forma radical.

## ¿Por qué los clientes internacionales cambian tu fiscalidad?

Cuando prestas servicios a empresas fuera de España, hay varias ventajas fiscales automáticas:

### 1. El IVA no aplica en la mayoría de los casos

Si vendes servicios digitales (programación, diseño, consultoría, marketing, etc.) a empresas con sede fuera de España:

- **Clientes en la UE (B2B):** Aplica la inversión del sujeto pasivo. Tú facturas sin IVA y el cliente lo autoliquida en su país. Modelo 349 obligatorio.
- **Clientes fuera de la UE:** La operación está no sujeta a IVA español. Facturas sin IVA directamente.
- **Clientes particulares (B2C) en la UE:** Aplica el sistema OSS (One-Stop Shop) si superas 10.000€/año en ventas a consumidores finales de otros países UE.

En la práctica, si vendes B2B fuera de España, **no cobras ni declaras IVA** por esas operaciones. Esto simplifica enormemente tu contabilidad.

### 2. La deducción por doble imposición internacional

Si tributas en otro país por los ingresos que generas allí (retenciones en origen, por ejemplo), España te permite deducir esos impuestos ya pagados para evitar pagar dos veces. Esto se regula en los Convenios de Doble Imposición (CDI) que España tiene firmados con más de 90 países.

## ¿Cuánto pagas realmente como autónomo con clientes internacionales?

Hagamos los números con un ejemplo real:

**Perfil:** Desarrollador web en España, 72.000€/año de facturación, todos los clientes son empresas internacionales.

### Sin optimización (autónomo estándar):
- **IRPF:** ~23.000€ (tipo efectivo ~32%)
- **Cuota de autónomos:** ~4.800€/año
- **IVA:** 0€ (servicios B2B internacionales)
- **Total:** ~27.800€ → **38.6% de carga fiscal**

### Con estructura LLC optimizada:
- **Impuesto federal EE.UU.:** 0€ (Disregarded Entity, Single-Member LLC no residente)
- **Coste LLC + compliance:** ~1.200€/año
- **Base imponible en tu país:** reducida por gastos deducibles de la LLC
- **Total impuesto federal EE.UU.: 0%**

La diferencia: entre **18.600€ y 21.600€ de ahorro anual** con la misma facturación.

## Las 3 opciones que tienes como freelancer con clientes internacionales

### Opción 1: Seguir como autónomo en España

Pagas IRPF progresivo (hasta 47%), cuota de autónomos (230-500€/mes) y te queda un ~60% de lo que facturas. Es la opción más sencilla pero la más cara fiscalmente.

### Opción 2: LLC en Estados Unidos + estructura fiscal optimizada

Constituyes una LLC americana para facturar a tus clientes internacionales. La LLC no paga impuesto federal (0% para Single-Member LLC de no residente). Con la estructura correcta, optimizas tu base imponible en tu país de residencia. Impuesto federal EE.UU.: 0%.

### Opción 3: Cambio de residencia fiscal a un país con régimen favorable

Algunos freelancers se mudan a países con regímenes fiscales especiales:
- **Portugal (NHR):** 20% tipo fijo sobre rendimientos profesionales durante 10 años
- **Andorra:** ~10% IRPF máximo
- **Dubai/EAU:** 0% impuesto sobre la renta personal
- **Paraguay:** 10% sobre rentas de fuente local (rentas extranjeras exentas)

Esta opción requiere mudanza real y cumplir con la regla de los 183 días.

## ¿Es posible llegar a pagar 0%?

Técnicamente, sí, pero no como autónomo en España. Para llegar a una carga fiscal efectiva del 0% necesitas:

1. **Cambiar tu residencia fiscal** a un país con 0% de impuesto sobre la renta (Dubai, Bahamas, etc.)
2. **Operar a través de una LLC** que no tribute en EE.UU. (0% federal)
3. **No generar rentas sujetas** a tributación en ningún otro país

Esto es completamente legal si cumples los requisitos de residencia fiscal del nuevo país y desvinculaste correctamente tu residencia española. En Exentax te ayudamos a planificar todo el proceso.

## Errores frecuentes

1. **Asumir que por facturar en dólares no tributas en tu país.** Si eres residente fiscal, tributas por renta mundial. Da igual la moneda o el país del cliente.
2. **Mezclar gastos personales y profesionales.** Esto reduce tus deducciones y puede provocar problemas en una inspección fiscal.
3. **No aprovechar los gastos deducibles de tu LLC.** Muchos freelancers no documentan correctamente sus gastos y pagan más de lo necesario.
4. **No conocer las ventajas de la LLC para facturación internacional.** La estructura correcta puede reducir tu impuesto federal en EE.UU. al 0% de forma completamente legal.

## La LLC como solución integral

Vamos a ser directos: si facturas a clientes internacionales desde España y estás pagando el 35-47% como autónomo, una LLC en Estados Unidos puede cambiar completamente tu situación fiscal. Así funciona:

1. **<a href="/es/blog/constituir-llc-proceso-paso-a-paso">Constituyes una LLC</a>** en un estado como Nuevo México (privacidad, sin Annual Report, coste mínimo)
2. **La LLC factura a tus clientes internacionales**: en dólares, con Stripe, PayPal, Adyen, DoDo Payments o wire transfer
3. **La LLC no paga impuesto federal** en EE.UU. ($0, <a href="/es/blog/tributacion-pass-through-llc-como-funciona">pass-through taxation</a>, Disregarded Entity)
4. **Optimizas tu base imponible** en tu país de residencia: declaras los beneficios netos (ingresos menos todos los gastos deducibles)
5. **Tu carga fiscal se reduce drásticamente**: porque deduces software, hardware, marketing, formación, comisiones bancarias, servicios profesionales, tu Operating Agreement y más...

El resultado: pasas de un 35-47% efectivo a un 0% de impuesto federal en EE.UU. Con la misma facturación.

### El IVA: una ventaja que ya tienes (y que debes aprovechar)

Si vendes servicios B2B a clientes fuera de España:
- **Clientes en la UE:** Inversión del sujeto pasivo. Facturas sin IVA.
- **Clientes fuera de la UE:** Operación no sujeta a IVA español. Facturas sin IVA directamente.

Esto ya es una ventaja enorme. Pero con una LLC, además de no cobrar IVA a tus clientes internacionales, toda la facturación va a través de una estructura que optimiza radicalmente tu carga fiscal global.

### La diferencia real en gastos deducibles

Sin LLC (autónomo estándar): tributas por tus ingresos brutos menos los gastos deducibles permitidos como autónomo (que son limitados y están bajo escrutinio constante).

Con LLC: los gastos deducibles son mucho más amplios (todo lo que sea "ordinario y necesario" para el negocio según el IRS), y declaras solo los beneficios netos. La base imponible se reduce significativamente.

## ¿Qué debería hacer?

Si facturas más de 30.000€/año a clientes internacionales, la optimización fiscal con una LLC es legal, está al alcance de cualquier freelancer, y el ahorro es real.

En Exentax analizamos tu caso concreto en una asesoría gratuita de 30 minutos. Te decimos exactamente cuánto estás pagando de más, qué estructura te conviene, y cuánto puedes ahorrar desde el primer año. Sin compromiso, sin letra pequeña. Agenda tu asesoría gratuita y empezamos.`,
    category: "Fiscalidad",
    readTime: 8,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Impuestos con clientes internacionales en España: cómo optimizar | Exentax",
    metaDescription: "Freelancer en España con clientes internacionales? Puedes reducir tu carga fiscal del 40% a 0% federal con una LLC. IVA, opciones y estructura completa.",
  },
  {
    slug: "pagar-cero-impuestos-legalmente-llc",
    title: "¿Se puede pagar 0% de impuestos legalmente? La verdad sobre la optimización fiscal",
    excerpt: "La pregunta que todos se hacen: ¿es posible no pagar impuestos de forma legal? Analizamos los escenarios reales donde la carga fiscal puede llegar a cero y lo que implica cada uno.",
    content: `El titular suena agresivo, pero la pregunta es legítima: ¿existe alguna forma legal de pagar cero impuestos sobre tus ingresos como freelancer o emprendedor digital? La respuesta corta es sí, pero con matices importantes que nadie te cuenta en los vídeos de YouTube. Vamos a desmontarlo con honestidad. Antes de seguir, asegúrate de que entiendes cómo funciona la <a href="/es/blog/tributacion-pass-through-llc-como-funciona">tributación pass-through de una LLC</a>, porque es la base de todo.

## Lo primero: entendamos el pass-through taxation

Antes de hablar de "pagar cero", necesitas entender cómo funciona una LLC fiscalmente. Una Single-Member LLC de no residente funciona con **pass-through taxation** (tributación transparente):

1. **La LLC en sí misma no paga impuesto federal en EE.UU.**: $0. Cero. El IRS la clasifica como "Disregarded Entity" si el propietario no es residente y no tiene ingresos de fuente estadounidense.
2. **Los beneficios "pasan a través"** de la LLC directamente al propietario.
3. **El propietario declara esos beneficios en su país de residencia fiscal.** Con la estructura correcta, esta declaración se hace sobre los beneficios netos (ingresos menos gastos), lo que reduce considerablemente la carga fiscal.

Es decir: la LLC no paga impuestos en EE.UU., pero tú sí pagas en tu país. La optimización viene de que declaras los **beneficios netos** (ingresos menos todos los gastos deducibles de la LLC), lo que reduce enormemente tu base imponible.

## Evasión vs. elusión vs. optimización

Dejemos clara la diferencia:

- **Evasión fiscal:** No declarar ingresos, ocultar dinero, facturas falsas. Es ilegal.
- **Elusión fiscal:** Usar vacíos legales de forma agresiva para no pagar. Es legal pero arriesgada, las autoridades fiscales pueden reclasificar la operación.
- **Optimización fiscal:** Usar las estructuras y regímenes que la ley pone a tu disposición para pagar lo justo. Es 100% legal y es lo que hacemos en Exentax.

## Los 3 escenarios donde puedes pagar 0% (o casi 0%)

### Escenario 1: LLC en EE.UU. + residencia fiscal en país con 0% IRPF

Este es el escenario más directo para llegar a 0%:

1. **Constituyes una LLC en Estados Unidos** (Single-Member, no residente)
2. **La LLC paga $0 de impuesto federal** en EE.UU., pass-through taxation, Disregarded Entity
3. **Cambias tu residencia fiscal** a un país sin impuesto sobre la renta:
   - **Emiratos Árabes Unidos (Dubai):** 0% IRPF, 9% impuesto corporativo (solo si facturas más de 375.000 AED ~ 93.000€/año a través de entidad local)
   - **Paraguay:** 0% sobre rentas de fuente extranjera
   - **Bahamas, Islas Caimán, Mónaco:** 0% IRPF total

**Resultado:** $0 en EE.UU. (LLC) + 0% en tu país de residencia = **0% total**.

**Requisito clave:** Debes ser residente fiscal real en ese país. Esto implica:
- Vivir allí más de 183 días al año
- Tener tu centro de intereses económicos y vitales en ese país
- Desvincular correctamente tu residencia fiscal anterior siguiendo los procedimientos del país de origen

### Escenario 2: LLC en EE.UU. + Beckham Law (España)

Si acabas de llegar a España (o llevas menos de 5 años sin ser residente fiscal español), puedes acogerte al régimen de impatriados, la conocida "Ley Beckham":

- **Tipo fijo del 24%** sobre rentas obtenidas en España (no progresivo)
- **Exención de rentas obtenidas fuera de España** (con excepciones)
- **Duración:** 6 años fiscales

Combinado con una LLC que genera ingresos fuera de España, la carga fiscal puede ser mínima si la mayoría de tus ingresos son de fuente extranjera.

### Escenario 3: LLC en EE.UU. + régimen territorial (varios países)

Algunos países solo gravan las rentas de fuente local (régimen territorial):

- **Panamá:** Solo tributan las rentas generadas dentro de Panamá
- **Costa Rica:** Similar al régimen territorial panameño
- **Paraguay:** Las rentas de fuente extranjera están exentas
- **Georgia:** 1% de impuesto sobre ingresos de freelancers bajo el "Small Business Status"

Si tus ingresos provienen de una LLC americana y tus clientes son internacionales, en estos países la carga fiscal puede ser 0% o cercana a cero sobre esos ingresos.

## ¿Y si soy residente fiscal en España?

Si eres residente fiscal en España y NO planeas mudarte, **no puedes pagar 0%.** España grava la renta mundial, no importa dónde generes los ingresos ni qué estructura uses. Cualquiera que te diga lo contrario te está mintiendo.

Pero (y es un "pero" muy grande): puedes reducir tu carga fiscal de forma brutal:

- **Sin estructura:** 35-47% (autónomo pagando impuesto progresivo + cotizaciones sociales)
- **Con LLC optimizada:** 0% federal EE.UU. (pass-through taxation + gastos deducibles amplios)

¿Cómo funciona en la práctica? Tu LLC paga $0 en EE.UU. (pass-through). Tú declaras en tu país los **beneficios netos** de la LLC. Pero antes de calcular tu impuesto, deduces todos los gastos legítimos de la LLC: software, hardware, marketing, coworking, formación, viajes de negocio, servicios profesionales, comisiones bancarias... La base imponible que te queda es mucho menor que si facturaras directamente como autónomo.

La reducción del 40% hasta un 0% ya es un ahorro enorme. Para alguien que factura 60.000€/año, estamos hablando de **10.000-19.000€ más en tu bolsillo** cada año. Todos los años.

## Lo que nadie te dice sobre pagar 0%

1. **Necesitas moverte de verdad.** No vale tener una dirección en Dubai y seguir viviendo en Barcelona. Las autoridades fiscales son especialmente rigurosas con los "falsos no residentes" y cruzan datos de consumo eléctrico, tarjetas de crédito, hijos escolarizados, etc.

2. **El primer año es el más caro.** Constituir la LLC, cambiar de residencia fiscal, abrir cuentas, establecerte en el nuevo país, todo tiene un coste inicial significativo.

3. **El compliance no desaparece.** Aunque pagues 0% de impuestos, sigues teniendo obligaciones declarativas: <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a>, <a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a>, declaraciones locales en tu nuevo país, etc.

4. **Puede no merecer la pena.** Si facturas 30.000€/año, el ahorro de pasar del 35% al 0% es ~10.500€. Pero los costes de mudanza, constitución de LLC, mantenimiento y adaptación pueden comerse una parte importante ese primer año.

5. **La normativa cambia.** Los regímenes fiscales favorables no son eternos. Dubai introdujo impuesto corporativo en 2023. Portugal restringió el NHR en 2024. Debes estar preparado para adaptarte.

## ¿Cuál es el escenario más realista?

Para la mayoría de los freelancers hispanohablantes que facturen entre 30.000€ y 150.000€ al año:

- **Si no te quieres mover:** LLC + residencia en tu país → 0% federal EE.UU. + tributación optimizada local
- **Si estás dispuesto a moverte:** LLC + residencia en país favorable → 0-5% de carga fiscal

Ambas opciones son legales, sostenibles y mucho mejores que el 40% que pagas hoy.

## Las herramientas financieras que acompañan al 0%

Pagar 0% no es solo una cuestión fiscal, es una cuestión de infraestructura. Para que la estructura funcione de forma profesional, necesitas las herramientas correctas:

- **Banca operativa:** Mercury (Column NA, FDIC, $0 wires) para la tesorería principal de tu LLC
- **Tesorería con rendimiento:** Slash genera rendimiento sobre tu capital ocioso, el dinero que reservas para impuestos o que está pendiente de distribución trabaja para ti
- **Tarjetas corporativas:** Wallester para gastos operativos con control granular, cada gasto documentado automáticamente
- **Multi-divisa:** Wise Business (tipo de cambio mid-market, EMI) y Revolut Business para operar en múltiples monedas
- **Pasarelas de pago:** Stripe, Adyen o DoDo Payments (Merchant of Record para gestión automática de IVA/GST internacional)
- **Inversión corporativa:** Interactive Brokers (150+ mercados), Tradovate (futuros) y Kraken (criptoactivos) para diversificar la tesorería

En Exentax no solo optimizamos tu fiscalidad, diseñamos la estructura completa para que el 0% federal funcione con infraestructura profesional detrás.

Si quieres saber cuál de estos escenarios encaja con tu situación real, agenda una asesoría gratuita. Analizamos tu caso sin compromiso.`,
    category: "Fiscalidad",
    readTime: 8,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "¿Se puede pagar 0% de impuestos legalmente con una LLC? | Exentax",
    metaDescription: "3 escenarios reales para pagar 0% de impuestos legalmente: LLC + residencia fiscal favorable, Ley Beckham, régimen territorial. Análisis completo con infraestructura.",
  },
  {
    slug: "nomada-digital-residencia-fiscal",
    title: "Nómada digital: dónde tributar y cómo elegir tu residencia fiscal",
    excerpt: "Si trabajas desde distintos países, tu residencia fiscal determina cuánto pagas. Te explicamos las reglas, los riesgos y las mejores opciones para nómadas digitales.",
    content: `Si eres nómada digital y trabajas desde Bali un mes, Lisboa el siguiente y Medellín después, tienes un problema fiscal que la mayoría ignora: ¿en qué país tributas? Esta decisión afecta directamente a tu <a href="/es/blog/fiscalidad-llc-por-pais-residencia">fiscalidad según tu país de residencia</a>.

La respuesta no es "donde estoy ahora" ni "donde tengo mi pasaporte". Es un tema que requiere planificación, y hacerlo bien desde el principio te ahorra complicaciones y optimiza tu carga fiscal.

## La regla de los 183 días

La mayoría de los países usan la regla de los 183 días como criterio principal de residencia fiscal: si pasas más de 183 días en un año natural dentro de un país, eres residente fiscal allí y tributas por tu renta mundial.

Pero hay matices críticos:

- **España** considera otros factores además de los 183 días: centro de intereses económicos, cónyuge e hijos menores residentes en España. Puedes ser considerado residente fiscal español aunque pases menos de 183 días en territorio.
- **Algunos países no tienen regla de 183 días** como criterio único. Estados Unidos usa la prueba de "substantial presence" que pondera los días de los últimos 3 años.
- **Los Convenios de Doble Imposición (CDI)** entre países tienen reglas de desempate (tie-breaker rules) cuando podrías ser residente fiscal en dos países simultáneamente.

## El peligro real: no ser residente fiscal en ningún sitio

Algunos nómadas digitales creen que al no pasar 183 días en ningún país, no son residentes fiscales en ninguna parte. Esto es un error grave:

- **España** te seguirá considerando residente fiscal si tu último domicilio conocido era español y no puedes demostrar residencia fiscal en otro país
- **Otros países** pueden reclamar tu residencia fiscal si tienes vínculos económicos significativos (cuentas bancarias, clientes, propiedades)
- **La ausencia de residencia fiscal** no existe en la práctica, siempre serás residente fiscal en algún sitio

## Las mejores opciones de residencia fiscal para nómadas digitales

### 1. Portugal. Régimen NHR (actualizado 2025)

El régimen de No Habitual Resident fue modificado en 2024. La nueva versión ofrece:
- Tipo reducido del 20% sobre rendimientos de trabajo de "actividades de alto valor añadido"
- Exención o tipo reducido sobre rentas pasivas de fuente extranjera
- Duración: 10 años
- Requisito: No haber sido residente fiscal en Portugal en los últimos 5 años

### 2. Emiratos Árabes Unidos (Dubai)

- 0% impuesto sobre la renta personal
- Visa de nómada digital disponible (1 año, renovable)
- Requisito: Residir efectivamente en UAE y obtener Emirates ID
- Coste de vida: alto (alquiler, servicios, seguros)

### 3. Georgia

- "Small Business Status": 1% sobre facturación hasta 500.000 GEL (~170.000€)
- Fácil obtener residencia
- Coste de vida: bajo
- Sin requisito de días mínimos para el estatus fiscal

### 4. Paraguay

- 10% IRPF máximo sobre rentas de fuente local
- Rentas de fuente extranjera: exentas
- Residencia fiscal fácil de obtener
- Coste de vida: muy bajo

### 5. Estonia (e-Residency)

- La e-Residency NO te convierte en residente fiscal estonio
- Te permite crear una empresa estonia y operar digitalmente
- Útil como complemento, no como solución fiscal aislada

## Países con tributación territorial: la joya oculta

Hay un grupo de países que solo gravan las rentas generadas dentro de sus fronteras. Si tus ingresos vienen de una LLC americana y tus clientes son internacionales, estos países pueden ser tu mejor aliado:

- **Panamá**: Solo tributan las rentas de fuente panameña. Ingresos de tu LLC americana: exentos.
- **Costa Rica**: Régimen territorial similar. Rentas de fuente extranjera no tributan.
- **Paraguay**: 10% máximo sobre rentas locales. Rentas extranjeras: 0%.
- **Guatemala**: Régimen territorial. Rentas de fuente extranjera no están sujetas a ISR.
- **Nicaragua**: Similar al modelo territorial centroamericano.

La clave aquí es que tus ingresos deben ser genuinamente de fuente extranjera. Si tu LLC factura a clientes de todo el mundo y tú simplemente vives en uno de estos países, la combinación es potentísima.

## Convenios de Doble Imposición (CDI): tu escudo contra pagar dos veces

Los CDI son tratados entre países que evitan que te cobren impuestos dos veces por los mismos ingresos. España tiene firmados más de 90 CDI. Estos tratados incluyen "tie-breaker rules", reglas de desempate que determinan tu residencia fiscal cuando dos países te reclaman.

Los criterios de desempate (en orden de prioridad):
1. **Vivienda permanente**: ¿en qué país tienes una vivienda disponible?
2. **Centro de intereses vitales**: ¿dónde está tu familia, tus relaciones económicas principales?
3. **Estancia habitual**: ¿dónde pasas más tiempo?
4. **Nacionalidad**: último recurso

Conocer estos tratados es fundamental para nómadas digitales. En Exentax los analizamos contigo para diseñar la estructura óptima según tu caso.

## La combinación más potente: LLC + residencia fiscal favorable

El setup más eficiente para la mayoría de los nómadas digitales es:

1. **LLC en EE.UU.** para facturar (0% federal para no residentes, pass-through taxation)
2. **Residencia fiscal en país favorable** (0-10% IRPF o tributación territorial)
3. **Cuenta bancaria Mercury** para operar (Column NA, seguro FDIC, $0 en wires) o Relay (Thread Bank, hasta 20 sub-cuentas)
4. **Tesorería con Slash**: genera rendimiento sobre tu capital ocioso mientras decides cuándo distribuir o invertir
5. **Tarjetas corporativas Wallester**: control granular de gastos con tarjetas virtuales y físicas para tu LLC
6. **Wise Business** para conversión de divisas al tipo de cambio mid-market (es una EMI, no un banco) y **Revolut Business** como complemento multi-divisa
7. **Stripe, Adyen o DoDo Payments** para cobrar a clientes globales (DoDo actúa como Merchant of Record y gestiona IVA/GST automáticamente)
8. **Interactive Brokers** si quieres invertir la tesorería de tu LLC en mercados globales (150+ mercados) o **Kraken** para exposición a criptoactivos desde cuenta corporativa

Con este setup, tu carga fiscal total puede ser del 0% al 10%, dependiendo del país de residencia elegido. Y lo mejor: todo se gestiona 100% en remoto.

En Exentax diseñamos esta estructura completa para ti, no solo la LLC, sino toda la operativa financiera: banca, tesorería, tarjetas, pasarelas de pago e inversión. Analizamos tu situación, tu país de origen, tus planes de viaje, y te proponemos la combinación óptima. No es un template genérico, es un plan hecho a medida.

## Cómo cambiar tu residencia fiscal

Si actualmente eres residente fiscal en un país y quieres cambiar, los pasos clave son:

1. **Comunica el cambio de residencia** a las autoridades fiscales de tu país actual
2. **Obtén el certificado de residencia fiscal** del nuevo país
3. **Conserva pruebas** de residencia efectiva: contratos de alquiler, consumos, movimientos bancarios locales, seguros médicos
4. **Presenta las declaraciones de salida** que correspondan en tu país de origen
5. **Establece vínculos reales** en el nuevo país: cuenta bancaria local, seguro médico, contrato de alquiler

En Exentax te ayudamos a planificar el proceso completo, desde qué documentación necesitas hasta cómo estructurar tu LLC para que todo encaje de forma óptima.

## La regla de los 183 días: lo que realmente implica

Ya la mencionamos arriba, pero merece profundizar porque es donde más errores se cometen:

- **No basta con contar días.** Las autoridades fiscales miran el conjunto: ¿dónde están tus hijos? ¿dónde tienes tu casa? ¿dónde gastas con tu tarjeta? Cruzan datos de consumo eléctrico, matrículas de coches, colegios de los hijos...
- **Los días parciales cuentan.** Si duermes una noche en España, es un día. No importa que hayas llegado a las 23:00.
- **El año natural va del 1 de enero al 31 de diciembre.** No es un periodo de 12 meses rodantes.
- **Algunos países tienen reglas diferentes.** EE.UU. usa la "substantial presence test" que pondera los días de los últimos 3 años. Reino Unido tiene un sistema de "automatic overseas test" más complejo.

La regla de los 183 días es el criterio principal, pero no el único. Por eso planificar bien es fundamental.

## Errores graves de los nómadas digitales

1. **No comunicar el cambio de residencia a las autoridades fiscales de tu país.** Tu país de origen puede seguir considerándote residente fiscal y reclamarte impuestos + recargos + intereses. Las autoridades fiscales son especialmente rigurosas con los "falsos no residentes".
2. **Creer que la e-Residency de Estonia resuelve tu fiscalidad.** No lo hace, es una identidad digital, no una residencia fiscal. Puedes tener e-Residency estonia y seguir siendo residente fiscal español.
3. **No declarar tus activos en el extranjero** ante las autoridades de tu país de residencia cuando superas los umbrales requeridos.
4. **Usar la dirección de un familiar en España** como domicilio fiscal mientras vives fuera. Esto te hace residente fiscal español.
5. **No tener seguro médico.** Muchos países exigen seguro para otorgar visas de nómada digital.
6. **Creer que no ser residente en ningún sitio es una opción.** No lo es. Siempre serás residente fiscal en algún país, y si no eliges tú, lo elige automáticamente el sistema fiscal de tu país de origen.
7. **No considerar los CDI.** Los convenios de doble imposición pueden ahorrarte miles de euros si los conoces y los aplicas.

## ¿Por dónde empezar?

Si eres nómada digital (o estás pensando en serlo), la secuencia ideal es:

1. **Define tu estrategia fiscal** antes de moverte, no después
2. **Elige tu país de residencia fiscal** basándote en datos, no en vídeos de YouTube
3. **<a href="/es/blog/constituir-llc-proceso-paso-a-paso">Constituye tu LLC</a>** como vehículo de facturación
4. **Configura tu <a href="/es/blog/como-operar-llc-dia-a-dia">operativa financiera</a>** (Mercury + Slash + Wallester + Wise + Stripe/Adyen)
5. **Comunica el cambio** a las autoridades fiscales de tu país de origen

En Exentax acompañamos a nómadas digitales en todo este proceso. Desde el análisis inicial hasta la constitución de la LLC, la apertura bancaria y el diseño de la estructura fiscal completa. Agenda tu asesoría gratuita y empezamos a trabajar en tu plan.`,
    category: "Fiscalidad",
    readTime: 11,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Nómada digital: residencia fiscal, dónde tributar y ecosistema completo | Exentax",
    metaDescription: "Guía fiscal para nómadas digitales: 183 días, mejores países (Dubai, Georgia, Paraguay), LLC + Mercury + Slash + Wallester. Estructura completa paso a paso.",
  },
  {
    slug: "criptomonedas-trading-llc-impuestos",
    title: "Criptomonedas y trading con LLC: fiscalidad completa para traders",
    excerpt: "Si haces trading de criptomonedas, la fiscalidad es un campo minado. Te explicamos cómo tributar, las ventajas de operar a través de una LLC y los errores que debes evitar.",
    content: `El trading de criptomonedas genera obligaciones fiscales que muchos traders ignoran, hasta que las autoridades fiscales llaman a la puerta. Si operas con Bitcoin, Ethereum, stablecoins o cualquier otro criptoactivo, necesitas entender cómo funciona la tributación y qué opciones tienes para optimizarla.

## ¿Cómo tributan las criptomonedas en España?

En España, las ganancias por criptomonedas tributan como ganancias patrimoniales en la base del ahorro del IRPF:

- Hasta 6.000€: **19%**
- 6.000€ – 50.000€: **21%**
- 50.000€ – 200.000€: **23%**
- 200.000€ – 300.000€: **27%**
- Más de 300.000€: **28%**

Esto aplica a cada operación que genere ganancia: venta de cripto por fiat, intercambio entre criptomonedas (swap), pago de bienes o servicios con cripto, y staking rewards.

### El Modelo 721: declaración de criptoactivos en el extranjero

Desde 2024, si tienes criptomonedas en exchanges fuera de España por valor superior a **50.000€ a 31 de diciembre**, debes presentar el Modelo 721 antes del 31 de marzo del año siguiente. La no presentación puede acarrear sanciones importantes.

## ¿Cómo ayuda una LLC al trading de criptomonedas?

### Ventajas de operar trading a través de una LLC

1. **Separación patrimonial.** Tu patrimonio personal queda protegido de las obligaciones de la actividad de trading.
2. **Acceso a exchanges profesionales.** Algunos exchanges (FTX Pro en su día, Coinbase Prime, Kraken Pro) ofrecen mejores condiciones a cuentas empresariales.
3. **Cuenta bancaria en dólares.** Mercury permite recibir fondos de exchanges y operar en USD sin comisiones de conversión.
4. **Deducción de gastos.** Los gastos relacionados con el trading (herramientas, formación, suscripciones, hardware) pueden ser deducibles a través de la LLC.
5. **Estructura para DeFi.** Si operas en protocolos DeFi (lending, yield farming, liquidity pools), tener una LLC separa estas operaciones del patrimonio personal.

### La clave: fiscalidad de la LLC para trading

La LLC de un solo miembro no residente (Disregarded Entity) no paga impuesto federal en EE.UU. Los beneficios del trading se declaran en tu país de residencia fiscal.

**Importante:** El IRS considera las criptomonedas como "property" (propiedad), no como divisa. Esto significa que cada operación con cripto (incluidos swaps) es un evento fiscal en EE.UU. Sin embargo, como tu LLC es una Disregarded Entity de no residente, no hay obligación de tributación federal sobre estas ganancias.

## El setup ideal para un trader de criptomonedas

1. **LLC en Wyoming**: Máxima privacidad y protección de activos. Wyoming además tiene legislación específica favorable para activos digitales (Digital Assets Act).
2. **EIN del IRS**: Para abrir cuentas en exchanges y bancos
3. **Cuenta Mercury**: Para recibir fondos de exchanges en USD (Column NA, FDIC hasta $250K)
4. **Slash**: Para gestionar la tesorería de tu LLC de trading. Ideal si mantienes reservas significativas en USD entre operaciones, generando rendimiento sobre el capital disponible.
5. **Kraken**: Exchange con cuenta corporativa para tu LLC. Kraken tiene una de las licencias regulatorias más sólidas del sector, con acceso a más de 200 criptoactivos, staking institucional, y soporte para cuentas empresariales con verificación avanzada. Su API es robusta para trading algorítmico.
6. **Interactive Brokers**: Si tu LLC también opera en mercados tradicionales (acciones, ETFs, opciones, futuros, forex), IB te da acceso a más de 150 mercados globales desde una sola cuenta empresarial. Ideal para diversificar más allá de crypto.
7. **Tradovate**: Si operas futuros (futures trading) como complemento o cobertura de tus posiciones en crypto. Acceso a CME, CBOT, NYMEX y COMEX con comisiones planas y plataforma moderna.
8. **Wallet hardware**: Ledger o Trezor para custodia segura de activos a largo plazo
9. **Software de seguimiento fiscal**: CoinTracker, Koinly o TokenTax para llevar el registro de operaciones y calcular ganancias/pérdidas

## Errores frecuentes de los traders

1. **No declarar los swaps** (intercambio cripto-cripto). Cada swap es un hecho imponible tanto en España como en EE.UU.
2. **Ignorar los airdrops y staking rewards.** Tienen valor en el momento de recepción y tributan como renta.
3. **No llevar registro de precios de adquisición.** Sin un historial de compras, no puedes calcular correctamente las ganancias/pérdidas. Consulta nuestra guía sobre <a href="/es/blog/gastos-deducibles-llc-que-puedes-deducir">gastos deducibles en tu LLC</a> para saber qué puedes deducir como trader.
4. **Creer que DeFi es "invisible" para las autoridades fiscales.** Las operaciones en blockchain son públicas y trazables. Las herramientas de análisis que usan las autoridades fiscales cada vez son más sofisticadas.
5. **No presentar el Modelo 721.** Si tienes más de 50.000€ en crypto en exchanges extranjeros, la no declaración tiene sanciones.

## Ventajas adicionales de la LLC para traders

- **Acceso a cuentas bancarias en USD**: Mercury te permite recibir y enviar fondos sin comisiones de wire ($0 en wires internacionales y domésticos). Tus fondos están custodiados en Column NA con seguro FDIC hasta $250K.
- **Tesorería inteligente con Slash**: Si mantienes capital significativo entre operaciones, Slash te permite generar rendimiento sobre el saldo disponible de tu LLC. No es un exchange, es una plataforma de tesorería empresarial que optimiza tu capital parado.
- **Wise Business como complemento**: siendo una EMI (Institución de Dinero Electrónico), Wise te da el tipo de cambio real para convertir las ganancias a tu moneda local. Revolut Business añade otra capa multidivisa con conversiones competitivas entre semana.
- **Tarjetas corporativas Wallester**: Emite tarjetas virtuales dedicadas para suscripciones de trading (TradingView, datos de mercado, señales) con límites independientes. Control granular del gasto operativo.
- **Separación total de patrimonios**: si una operación sale muy mal, tu patrimonio personal queda intacto. La LLC es tu cortafuegos.
- **Deducción de herramientas de trading**: TradingView, CoinTracker, cursos, hardware, suscripciones a señales, datos de mercado, colocación de servidores... todo gasto ordinario y necesario es deducible.
- **Diversificación multi-bróker**: Con Interactive Brokers para mercados tradicionales, Tradovate para futuros y Kraken para crypto, tu LLC puede operar en todos los mercados principales desde una estructura unificada.

## ¿Merece la pena la LLC para un trader?

Depende de tu volumen:

- **Menos de 10.000€/año en ganancias:** Probablemente no. Los costes de la LLC superan el beneficio.
- **10.000€ – 50.000€/año:** Empieza a tener sentido por la protección patrimonial y las deducciones.
- **Más de 50.000€/año:** Sin duda. La optimización fiscal + protección + acceso a servicios profesionales justifican el coste desde el primer mes.

El trading profesional requiere una estructura profesional. Si estás operando como persona física, estás pagando más impuestos de los necesarios y exponiendo tu patrimonio personal a riesgos innecesarios.

En Exentax hemos montado estructuras para traders de todo tipo: spot, derivados, DeFi, futuros. Cada caso tiene sus particularidades fiscales y operativas. Si quieres analizar tu situación concreta y ver los números reales para tu volumen de trading, habla con nuestro equipo.`,
    category: "Fiscalidad",
    readTime: 7,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Criptomonedas y trading con LLC: fiscalidad y estructura completa 2026 | Exentax",
    metaDescription: "Guía fiscal para traders de criptomonedas con LLC. Kraken, Interactive Brokers, Tradovate, Modelo 721, setup ideal y cómo optimizar tu estructura de trading.",
  },
  {
    slug: "iva-servicios-digitales-internacional",
    title: "IVA en servicios digitales internacionales: cuándo aplica y cuándo no",
    excerpt: "Si vendes servicios digitales a clientes de otros países, el IVA es uno de los temas más confusos. Te explicamos las reglas claras según el tipo de cliente y su ubicación.",
    content: `El IVA en operaciones internacionales es uno de los temas más confusos de la fiscalidad para freelancers. ¿Cobras IVA a un cliente en Alemania? ¿Y a uno en Estados Unidos? ¿Y si el cliente es un particular, no una empresa? Las reglas cambian según cada escenario.

## La regla general: localización del servicio

Para servicios digitales (programación, diseño, consultoría, marketing, formación online, etc.), la localización del IVA depende de quién es tu cliente:

### Servicios B2B (a empresas)

El IVA se localiza en el país del destinatario (la empresa que te contrata):

- **Cliente empresa en España:** Cobras IVA español (21%)
- **Cliente empresa en la UE:** No cobras IVA español. El cliente autoliquida el IVA en su país (inversión del sujeto pasivo). Debes incluir su número de IVA intracomunitario (VAT ID) en la factura.
- **Cliente empresa fuera de la UE:** No cobras IVA. La operación está no sujeta a IVA español.

### Servicios B2C (a particulares)

El IVA se localiza donde está establecido el prestador del servicio (tú):

- **Cliente particular en España:** Cobras IVA español (21%)
- **Cliente particular en la UE:** Si superas 10.000€/año en ventas a consumidores de otros países UE, debes registrarte en el sistema OSS (One-Stop Shop) y aplicar el IVA del país del consumidor.
- **Cliente particular fuera de la UE:** No cobras IVA español. Operación no sujeta.

## Obligaciones formales

### Modelo 303 (declaración trimestral de IVA)

Las operaciones sin IVA (intracomunitarias y exportaciones) se declaran en el Modelo 303 pero en casillas específicas:
- Casilla 59: Base de servicios intracomunitarios prestados
- Casilla 60: Entregas no sujetas por reglas de localización

### Modelo 349 (operaciones intracomunitarias)

Si prestas servicios a empresas de otros países de la UE, debes presentar el Modelo 349 declarando estas operaciones.

### Modelo 368 (OSS. One-Stop Shop)

Si vendes servicios B2C a consumidores de otros países de la UE y superas los 10.000€, el sistema OSS te permite declarar y pagar el IVA de todos los países desde España, sin tener que registrarte en cada país individualmente.

## Escenarios prácticos

### Desarrollador web con clientes en EE.UU.

Tus clientes son empresas americanas. **No cobras IVA** en ninguna factura. Las operaciones están no sujetas. Declaras la base en el Modelo 303 (casilla 60). No necesitas Modelo 349.

### Diseñador con clientes en Alemania y Francia (B2B)

Facturas sin IVA español. Incluyes el VAT ID del cliente. Declaras en Modelo 303 y Modelo 349.

### Consultor con clientes mixtos (España + internacional)

Las facturas a clientes españoles llevan IVA (21%). Las facturas a clientes de la UE van sin IVA (inversión del sujeto pasivo). Las facturas fuera de la UE van sin IVA (no sujetas).

### Creador de cursos online (B2C internacional)

Si vendes cursos a particulares de toda Europa, necesitas:
- Registrarte en OSS si superas 10.000€/año en ventas B2C intracomunitarias
- Aplicar el tipo de IVA del país del comprador (19% Alemania, 20% Francia, etc.)
- Presentar el Modelo 368 trimestralmente

## ¿Cómo afecta la LLC al IVA?

Si operas a través de una LLC americana para facturar a tus clientes internacionales:

- **La LLC no cobra IVA**: es una entidad americana y no está dentro del sistema de IVA europeo
- **Tus clientes reciben facturas sin IVA** de una empresa americana
- **No presentas Modelo 303 ni 349** por las operaciones de la LLC

Esto simplifica enormemente tu operativa si la mayoría de tus clientes son internacionales. En lugar de gestionar IVA en cada factura, la LLC emite facturas limpias en dólares sin impuestos indirectos.

### DoDo Payments: la solución para ventas B2C internacionales

Si vendes productos digitales (cursos, software, SaaS, ebooks) a consumidores finales en múltiples países, **DoDo Payments** actúa como **Merchant of Record**: lo que significa que DoDo se encarga automáticamente del IVA/GST de cada país. Tú vendes, DoDo calcula, recauda y remite el impuesto al consumo correspondiente. Elimina completamente la complejidad del IVA/GST internacional para ventas B2C, algo que ni Stripe ni PayPal hacen por defecto.

## La LLC como solución definitiva al laberinto del IVA

Aquí es donde se pone interesante. Si la mayoría de tus clientes son B2B fuera de España (o fuera de la UE directamente), la LLC americana elimina toda la complejidad del IVA europeo de un plumazo:

- **No cobras IVA**: la LLC es una entidad americana, fuera del sistema de IVA europeo
- **No presentas Modelo 303, ni 349, ni 368** por las operaciones de la LLC
- **Tus clientes reciben facturas limpias**: sin IVA, sin confusión, sin el típico "espera que miro si aplica inversión del sujeto pasivo"
- **Adiós al VIES**: no necesitas verificar VAT IDs porque la LLC no opera dentro del marco IVA

¿El resultado? Facturas internacionales simplificadas, menos burocracia trimestral, y más tiempo para lo que realmente importa: tu negocio.

## Errores frecuentes con el IVA internacional

1. **Cobrar IVA español a una empresa de la UE.** Si tiene VAT ID válido, no debes cobrar IVA. Verificalo siempre en el sistema VIES de la Comisión Europea antes de facturar.
2. **No verificar el VAT ID del cliente.** Si cobras sin IVA a una empresa intracomunitaria sin verificar su VAT ID, las autoridades fiscales pueden reclamarte el IVA no cobrado. Suena absurdo, pero pasa.
3. **Ignorar el sistema OSS.** Si vendes B2C en la UE y superas 10.000€, estás obligado a usar OSS o registrarte en cada país. Con la LLC, este problema desaparece.
4. **No declarar operaciones no sujetas en el Modelo 303.** Aunque no cobres IVA, debes declarar la base imponible en las casillas correspondientes.
5. **Confundir B2B con B2C.** Las reglas son completamente distintas. Si le vendes a un particular en Francia, no es lo mismo que venderle a una SAS francesa.

En Exentax nos encargamos de que tu estructura fiscal sea la correcta para tu tipo de clientes. Si estás hasta arriba de modelos trimestrales y quieres simplificar tu vida, agenda una asesoría gratuita. Te explicamos cómo la LLC puede eliminar el 90% de tu burocracia fiscal.

Quieres dejar de preocuparte por el IVA internacional y operar con una estructura limpia? Habla con nuestro equipo y te explicamos cómo.`,
    category: "Fiscalidad",
    readTime: 7,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "IVA en servicios digitales internacionales: cuándo aplica y soluciones | Exentax",
    metaDescription: "IVA en servicios digitales internacionales: reglas B2B/B2C, Modelo 303/349, OSS, y cómo la LLC + DoDo Payments eliminan la complejidad del IVA europeo.",
  },
  {
    slug: "registered-agent-que-es-por-que-necesitas",
    title: "Registered Agent: qué es y por qué es obligatorio para tu LLC",
    excerpt: "Toda LLC en Estados Unidos necesita un Registered Agent. Te explicamos qué hace, por qué es obligatorio, cuánto cuesta y qué pasa si no lo tienes.",
    content: `Si estás constituyendo una LLC en Estados Unidos, uno de los requisitos obligatorios es designar un Registered Agent (agente registrado). No es opcional, sin él, no puedes constituir ni mantener tu LLC en ningún estado. Pero tranquilo: en Exentax el Registered Agent viene incluido en todos nuestros planes. No tienes que buscarlo, contratarlo ni renovarlo. Nos encargamos de todo.

## ¿Qué es un Registered Agent?

Un Registered Agent es una persona o empresa designada para recibir documentos legales y oficiales en nombre de tu LLC. Piensa en él como el "buzón legal" de tu empresa en Estados Unidos, alguien que está ahí, con dirección física, listo para recibir cualquier notificación oficial que llegue.

Los documentos que recibe incluyen:

- **Service of Process**: notificaciones legales si tu LLC es demandada (algo muy poco probable para un freelancer, pero el sistema lo requiere)
- **Correspondencia del estado**: Annual Reports, recordatorios de renovación, avisos de cumplimiento
- **Correspondencia del IRS**: aunque el IRS suele enviar al domicilio fiscal registrado
- **Documentos de FinCEN**: notificaciones relacionadas con el BOI Report

Básicamente, cualquier comunicación oficial que el estado o el gobierno federal necesite enviar a tu LLC, la recibe tu Registered Agent. Y nosotros te la reenviamos escaneada por email.

## ¿Por qué es obligatorio?

Todos los estados de EE.UU. exigen que las LLC tengan un Registered Agent por estas razones:

1. **Garantiza que la empresa es localizable.** El sistema legal americano necesita una dirección física donde enviar notificaciones. No se puede tener una empresa "fantasma" sin punto de contacto.
2. **Debe tener dirección física en el estado.** No vale un apartado de correos (P.O. Box). Tiene que ser una dirección física real en el estado donde la LLC está registrada.
3. **Debe estar disponible en horario laboral.** De lunes a viernes, en horario comercial americano, alguien debe poder recibir documentos.

Para un no residente que vive en España, México, Colombia o cualquier otro país, ser tu propio Registered Agent es imposible. No vives en EE.UU., no tienes dirección física allí, y no estás disponible en horario comercial americano. Por eso necesitas un servicio profesional, y por eso lo incluimos en Exentax.

## ¿Cuánto cuesta por separado?

Si lo contrataras por tu cuenta:

- **Servicios básicos:** $50-100/año
- **Servicios estándar:** $100-200/año (incluyen escaneo de documentos y notificaciones por email)
- **Servicios premium:** $200-350/año (incluyen cumplimiento, recordatorios de Annual Report, correo postal)

**En Exentax, el Registered Agent está incluido en todos nuestros planes.** Tanto en la constitución como en el mantenimiento anual. No pagas extra, no lo contratas aparte, no tienes que renovarlo tú. Nosotros lo gestionamos y renovamos cada año automáticamente.

## ¿Qué pasa si tu LLC se queda sin Registered Agent?

Esto es lo que ocurre cuando el Registered Agent expira y nadie lo renueva (pasa más de lo que piensas, especialmente con servicios baratos que no avisan):

1. **Pérdida de Good Standing.** El estado pone tu LLC en "Not in Good Standing", lo que afecta tu capacidad de operar.
2. **Mercury y otras entidades financieras pueden congelar tu cuenta.** Verifican periódicamente el estatus de la LLC.
3. **Disolución administrativa.** Si no corriges la situación, el estado puede disolver tu LLC.
4. **No recibes notificaciones legales.** Si te demandan y no recibes la notificación, pueden obtener un fallo en tu contra sin que te enteres (default judgment). Esto es raro para freelancers, pero el riesgo existe.
5. **No puedes presentar Annual Reports** ni otros trámites estatales.

La moraleja: el Registered Agent no es un gasto superfluo. Es una pieza fundamental de tu LLC que debe estar activa siempre.

## ¿Puedo cambiar de Registered Agent?

Sí, en cualquier momento. Se presenta un formulario de cambio ante la Secretaría de Estado ($5-25 de tasa estatal según el estado). Si vienes de otro servicio y quieres que Exentax gestione tu Registered Agent, nos encargamos del cambio.

## ¿El Registered Agent es mi dirección comercial?

No necesariamente, pero en la práctica muchos no residentes la usan así. La dirección del Registered Agent es donde se reciben documentos legales, pero no tiene que ser la dirección que pones en tus facturas.

Dicho esto, como no residente es la única dirección física que tienes en EE.UU., así que se usa para:
- Registros estatales de la LLC
- Dirección ante el IRS
- Dirección en la solicitud de Mercury (como dirección de la LLC)

## Cómo lo gestionamos en Exentax

Trabajamos con agentes registrados profesionales en cada estado:

- **Nuevo México:** Agente con amplia experiencia en LLCs de no residentes
- **Wyoming:** Agente con servicios de privacidad avanzada
- **Delaware:** Agente con experiencia corporativa

Todos nuestros agentes incluyen:
- Escaneo inmediato de cualquier documento recibido
- Notificación por email cuando llega correspondencia
- Renovación anual automática (sin que tú hagas nada)
- Reenvío de correo físico cuando es necesario

## Lo que no te cuentan sobre los Registered Agents baratos

El mercado de Registered Agents está lleno de opciones a $10-25/año. Parece un chollo, pero hay consecuencias que nadie te explica:

**No avisan de renovación.** Servicios ultra-baratos no envían recordatorios. Un día descubres que tu LLC está en "Not in Good Standing" porque tu Registered Agent caducó hace meses. Para entonces, Mercury puede haberte congelado la cuenta.

**Escaneo lento o inexistente.** Algunos servicios solo reenvían correo físico cada 30 días. Si recibes un Service of Process (notificación legal), puedes perder plazos de respuesta críticos.

**Sin soporte para no residentes.** La mayoría de servicios baratos están pensados para residentes americanos. No entienden que tu LLC es de un extranjero, no saben qué es el Form 5472, y no pueden orientarte si el estado te envía algo que no entiendes.

**Upselling agresivo.** Te cobran $25 por el Registered Agent pero luego quieren venderte Annual Report filing a $150, compliance monitoring a $200 y mail forwarding a $100. Al final pagas más que con un servicio integrado.

## Registered Agent y tu cuenta bancaria: la conexión invisible

Cuando solicitas tu cuenta en Mercury, uno de los datos que proporcionas es la dirección de tu LLC. Para no residentes, esa dirección suele ser la del Registered Agent. Mercury (y otras entidades financieras) hacen due diligence sobre esa dirección.

Si tu dirección aparece como la de un Registered Agent compartido con miles de otras LLCs, eso no es un problema en sí, es normal y Mercury lo sabe. Pero si ese Registered Agent tiene un historial de LLCs problemáticas asociadas, puede generar fricción adicional en tu proceso de due diligence.

En Exentax trabajamos con agentes registrados de reputación establecida, con historial limpio y experiencia específica con LLCs de no residentes hispanohablantes.

¿Quieres constituir tu LLC con Registered Agent incluido y todo gestionado? Contacta con nosotros y nos encargamos del proceso completo.`,
    category: "Guías",
    readTime: 7,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Registered Agent: qué es y por qué lo necesitas | Exentax",
    metaDescription: "El Registered Agent es obligatorio para tu LLC. Qué hace, cuánto cuesta, qué pasa sin él y cómo elegir el mejor servicio de agente registrado en EE.UU.",
  },
  {
    slug: "errores-fiscales-freelancers-espanoles",
    title: "10 errores fiscales que cometen los freelancers españoles (y cómo evitarlos)",
    excerpt: "La mayoría de los freelancers en España pierden miles de euros al año por errores fiscales evitables. Te explicamos los 10 más comunes y cómo corregirlos.",
    content: `Después de asesorar a cientos de freelancers españoles, hemos identificado un patrón claro: los mismos errores fiscales se repiten una y otra vez. Y no son errores menores, estamos hablando de miles de euros perdidos cada año por desconocimiento o mala asesoría.

## Error 1: No deducir todos los gastos permitidos

El error más costoso y más fácil de corregir. Muchos freelancers solo deducen los gastos "obvios" (dominio, hosting, software) y se olvidan de:

- **Parte proporcional de la vivienda** si trabajas desde casa (hasta el 30% de los suministros: luz, agua, gas, internet, del porcentaje de la vivienda destinado a la actividad)
- **Teléfono móvil** si lo usas para trabajar
- **Formación y cursos** relacionados con tu actividad
- **Material de trabajo** (ordenador, pantalla, teclado, silla)
- **Seguros profesionales** (responsabilidad civil, seguros de salud si eres autónomo)
- **Viajes de trabajo** (transporte, alojamiento, dietas)
- **Cuota de autónomos**: sí, la propia cuota es deducible
- **Asesoría fiscal y contable**

Un freelancer que factura 60.000€/año y solo deduce 3.000€ en gastos podría estar deduciendo 12.000-15.000€ si lleva un registro correcto. Eso puede suponer **3.000-4.000€ menos de IRPF al año**.

## Error 2: Elegir el epígrafe del IAE incorrecto

El epígrafe del IAE (Impuesto de Actividades Económicas) determina qué tipo de actividad realizas a ojos de las autoridades fiscales. Un epígrafe incorrecto puede:

- **Limitar tus deducciones**: algunos epígrafes permiten más gastos que otros
- **Generar problemas en una inspección**: si la actividad real no coincide con el epígrafe
- **Afectar a la retención del IRPF**: algunos epígrafes están sujetos a retención del 15% en las facturas a empresas españolas

Los epígrafes más habituales para freelancers digitales:
- **763:** Programadores y analistas de informática
- **769:** Otros servicios técnicos
- **844:** Publicidad, relaciones públicas y similares
- **899:** Otros profesionales diversos

Verifica que tu epígrafe refleja tu actividad real. Si estás en el incorrecto, cambiarlo es sencillo (Modelo 036/037).

## Error 3: No aplicar la tarifa plana de autónomos correctamente

La tarifa plana de autónomos para nuevas altas permite pagar **80€/mes durante los primeros 12 meses** (y 160€/mes los siguientes 12 si los ingresos netos no superan el SMI). Muchos freelancers:

- No la solicitan al darse de alta
- No saben que pueden beneficiarse si no han estado de alta en autónomos en los últimos 2 años
- La pierden por no cumplir los requisitos de forma

## Error 4: Presentar el IVA incorrectamente en operaciones internacionales

Ya lo hemos cubierto en detalle en nuestro artículo sobre <a href="/es/blog/iva-servicios-digitales-internacional">IVA en servicios digitales internacionales</a>, pero los errores más frecuentes son:

- Cobrar IVA a empresas de la UE que tienen VAT ID (deberías aplicar inversión del sujeto pasivo)
- No presentar el Modelo 349 cuando facturas a empresas intracomunitarias
- No declarar la base de operaciones no sujetas en el Modelo 303

## Error 5: No hacer pagos fraccionados o hacerlos mal

Los autónomos deben presentar el Modelo 130 (pago fraccionado del IRPF) cada trimestre. El pago fraccionado es el 20% del rendimiento neto acumulado.

Errores comunes:
- **No presentarlo** y acumular una deuda con las autoridades fiscales
- **Calcular mal el rendimiento neto** (olvidar restar gastos deducibles)
- **No compensar pérdidas** de trimestres anteriores

## Error 6: Ignorar la fiscalidad internacional

Si facturas a clientes de fuera de España, tienes opciones de optimización fiscal que la mayoría de asesores sin experiencia internacional desconocen:

- **LLC en Estados Unidos:** Estructura con 0% de impuesto federal en EE.UU. para no residentes, con acceso a la infraestructura financiera americana: Mercury (Column NA, $0 wires), Slash (tesorería corporativa), Wallester (tarjetas corporativas), Stripe, Adyen y DoDo Payments
- **Convenios de Doble Imposición:** Para evitar pagar impuestos dos veces por los mismos ingresos
- **Planificación de residencia fiscal:** En algunos casos, cambiar de residencia puede reducir drásticamente tu carga fiscal
- **Inversión corporativa:** Interactive Brokers, Tradovate y Kraken permiten abrir cuentas empresariales para tu LLC, diversificando la tesorería de forma profesional

Estos mecanismos son legales y están disponibles para cualquier contribuyente. En Exentax los aplicamos para nuestros clientes como parte del servicio, diseñamos la estructura completa, no solo la LLC.

## Error 7: No planificar la tributación al final del año

Muchos freelancers se acuerdan de los impuestos en marzo-junio, cuando ya es tarde para optimizar. La planificación fiscal debe hacerse durante el año:

- **Anticipar gastos deducibles** al cierre del ejercicio (comprar equipos, pagar formación, adelantar suscripciones anuales)
- **Ajustar la base de cotización** de autónomos según los ingresos reales
- **Evaluar si cambiar de estructura** (de autónomo a SL, o a LLC + autónomo)
- **Revisar los pagos fraccionados** para evitar sorpresas en la declaración anual

## Error 8: No entender el pass-through taxation

Si tienes (o estás considerando) una LLC en Estados Unidos, hay un concepto que debes entender bien: **pass-through taxation.** Tu Single-Member LLC de no residente es una "Disregarded Entity" para el IRS, eso significa que la LLC no paga impuesto federal en EE.UU. ($0). Los beneficios "pasan a través" directamente a ti como propietario.

¿Qué implica? Que tú declaras los beneficios netos de tu LLC en tu país de residencia. Pero antes de tributar, restas TODOS los gastos legítimos de la LLC: software, hardware, marketing, formación, servicios profesionales, comisiones bancarias, coworking, viajes de negocio... La base imponible que queda es mucho menor que si facturaras directamente como autónomo.

Un freelancer que factura 60.000€ y tiene 20.000€ en gastos deducibles de la LLC solo tributa por 40.000€. Eso es una diferencia brutal en lo que pagas al fisco.

## Error 9: No maximizar los gastos deducibles de la LLC

Hablando de gastos deducibles, muchos freelancers con LLC no aprovechan la amplitud de deducciones que permite la estructura. Gastos que puedes deducir a través de tu LLC:

- **Software y SaaS**: todas las herramientas que usas para trabajar (Figma, GitHub, Notion, Slack, etc.)
- **Hardware**: ordenador, monitor, teclado, ratón, silla ergonómica, auriculares
- **Hosting y dominios**: servidores, cloud computing, CDN
- **Marketing y publicidad**: Google Ads, Facebook Ads, SEO, branding
- **Formación profesional**: cursos, conferencias, libros técnicos, membresías educativas
- **Servicios profesionales**: contabilidad, legal, diseño, copywriting (incluidas las fees de Exentax)
- **Coworking**: el coste del espacio de trabajo
- **Viajes de negocio**: transporte y alojamiento para reuniones con clientes
- **Comisiones bancarias**: de Mercury, Stripe, PayPal, Wise
- **Seguros profesionales**: responsabilidad civil, errores y omisiones

La clave: cada gasto debe ser "ordinario y necesario" para tu actividad, y debe estar documentado. Guarda todas las facturas y recibos.

## Error 10: Trabajar con alguien que no entiende fiscalidad internacional

Muchos asesores fiscales son excelentes para autónomos y pymes locales. Y lo hacen bien para ese perfil. Pero si facturas a clientes internacionales, tienes (o quieres) una LLC americana, y necesitas optimización fiscal con estructuras en varios países, necesitas a alguien que hable ese idioma.

Señales de que tu asesor no entiende tu situación:
- No saben qué es el <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a> ni el <a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a>
- Te dicen que "la LLC no te sirve para nada"
- No entienden el concepto de pass-through taxation para no residentes
- No saben aplicar la inversión del sujeto pasivo en el IVA internacional
- Te tratan fiscalmente igual que a cualquier otro autónomo con clientes locales

No es culpa suya, simplemente no es su especialidad. En Exentax, la fiscalidad internacional para freelancers y emprendedores digitales es TODO lo que hacemos. Constituimos tu LLC, preparamos tu Operating Agreement, y te acompañamos en todo el compliance anual.

## ¿Cuánto te cuestan estos errores?

Para un freelancer con 60.000€ de facturación anual:

| Error | Coste estimado/año |
|-------|-------------------|
| No deducir gastos | 3.000-4.000€ |
| Epígrafe IAE incorrecto | 500-1.500€ |
| No aprovechar tarifa plana | 1.800€ (primer año) |
| IVA incorrecto | Multas de 150-600€ |
| Pagos fraccionados mal | Recargos del 5-20% |
| Ignorar optimización internacional | 15.000-20.000€ |
| No planificar | variable |
| No maximizar deducciones LLC | 3.000-6.000€ |
| Asesor sin experiencia internacional | 5.000-15.000€ |

**Total potencial: hasta 45.000€/año en errores evitables.** Sí, leíste bien. Cuarenta y cinco mil euros que podrían estar en tu bolsillo si alguien competente gestionara tu fiscalidad.

Si te has identificado con alguno de estos errores (y la mayoría de los freelancers que llegan a Exentax se identifican con al menos 3-4), no esperes a la próxima declaración. Solicita una revisión con nuestro equipo y deja de perder dinero.`,
    category: "Fiscalidad",
    readTime: 9,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "10 errores fiscales de freelancers españoles (hasta 45.000€/año) | Exentax",
    metaDescription: "Los 10 errores fiscales más costosos de freelancers en España: deducciones, IVA, pass-through, LLC. Cómo evitar perder hasta 45.000€/año con estructura optimizada.",
  },
  {
    slug: "como-operar-llc-dia-a-dia",
    title: "Cómo operar tu LLC en el día a día: guía práctica",
    excerpt: "Tu LLC ya está constituida. ¿Y ahora qué? Guía práctica para operar tu LLC americana desde cualquier país: facturación, cobros, gastos y gestión diaria.",
    content: `Has dado el paso y tu LLC ya está constituida. Tienes tu EIN, tu cuenta en Mercury abierta y tus documentos en orden. Ahora empieza la parte divertida: operar tu negocio como un profesional.

La operativa diaria de una LLC no es complicada, de hecho, una vez estableces los hábitos correctos, funciona casi en piloto automático. Pero hay reglas de juego que conviene conocer desde el primer día. Vamos a ello.

## Lo primero: separa lo personal de lo profesional

Este es EL principio. El mandamiento número uno. La regla de oro. Tu LLC es una entidad separada de ti, y esa separación tiene que ser real, no solo en el papel.

En la práctica:

- **Todo ingreso de tu negocio** entra por la cuenta de la LLC en Mercury (o Relay)
- **Todo gasto del negocio** sale de esa misma cuenta
- **Nunca, jamás, under no circumstances** mezcles gastos personales con los de la LLC

¿Por qué tanta insistencia? Porque si mezclas fondos, un juez puede "levantar el velo corporativo" (piercing the corporate veil) y tu protección patrimonial desaparece. Es como tener un airbag desconectado, está ahí pero no te va a servir cuando lo necesites.

## Tus herramientas financieras: la operativa del día a día

### Mercury: tu plataforma financiera principal

Mercury es donde vive el dinero de tu LLC. Es tu cuenta bancaria empresarial, respaldada por Column NA (banco con licencia federal y seguro FDIC hasta $250,000). Lo que lo hace especial:

- **$0 comisiones** en todo: mantenimiento, ACH, wires nacionales e internacionales
- **Tarjeta de débito** (física y virtual) para gastos de la LLC
- **Sub-cuentas** para organizar tu dinero (operativa, impuestos, reserva)
- **Dashboard limpio** con categorización automática de transacciones
- **Invoicing integrado**: puedes enviar facturas directamente desde Mercury

Dato que pocos saben: Mercury no cobra por wires internacionales. Ni de envío ni de recepción. $0. Esto es una ventaja brutal frente a cualquier banco tradicional.

### Wise Business: tu herramienta de conversión de divisas

Wise (ojo: es una EMI. Institución de Dinero Electrónico, no un banco) es perfecta para cuando necesitas convertir dólares a euros, pesos o cualquier otra moneda. Te da el tipo de cambio real (mid-market rate) sin margen oculto.

El flujo típico: Cliente paga → Mercury (USD) → Wise (conversión) → Tu cuenta personal (EUR/MXN/COP).

### Slash: rendimiento sobre tu capital ocioso

El capital que se acumula en Mercury entre cobros y distribuciones puede estar trabajando para ti. **Slash** actúa como gestor de tesorería corporativa, generando rendimiento sobre la liquidez ociosa de tu LLC. Es relevante cuando tu LLC factura con regularidad pero distribuyes beneficios mensual o trimestralmente: ese gap temporal es dinero que puede optimizarse.

### Wallester: tarjetas corporativas para gastos del día a día

Para los gastos operativos de tu LLC (suscripciones, herramientas, servicios), **Wallester** te da tarjetas corporativas virtuales y físicas con límites individuales y control granular. Cada gasto queda registrado y categorizado automáticamente. Es mucho más profesional que usar la tarjeta de débito de Mercury para todo, y refuerza la separación financiera.

### Revolut Business: complemento multi-divisa

Si operas en múltiples monedas, facturas en USD, pagas proveedores en EUR, tienes gastos en GBP. **Revolut Business** (EMI) te da cuentas multi-divisa con tipo de cambio competitivo entre semana y tarjetas para equipo. Complementa a Mercury y Wise.

### Stripe, PayPal y más: para cobrar a clientes

- **Stripe** para pagos con tarjeta, suscripciones y checkout profesional
- **PayPal Business** para clientes que prefieren esa vía
- **Adyen** para procesamiento enterprise (también potencia los links de pago de Relay)
- **DoDo Payments** si vendes productos digitales B2C, actúa como Merchant of Record y gestiona el IVA/GST de cada país automáticamente

Todas se conectan a tu cuenta Mercury sin problema.

## Cómo facturar con tu LLC

Cuando facturas a un cliente, lo haces como tu LLC, no como persona física. La factura debe incluir:

- **Nombre legal de la LLC** (tal como aparece en los Articles of Organization)
- **Dirección del Registered Agent** (o dirección comercial si la tienes)
- **EIN** (lo piden algunos clientes, especialmente los americanos)
- **Datos bancarios** de la cuenta de la LLC (routing + account number para clientes US, SWIFT para internacionales)

No necesitas un formato de factura específico de EE.UU. Puedes usar Mercury Invoicing (integrado en tu cuenta), Stripe Invoicing, o herramientas como FreshBooks, Wave o incluso un PDF bien hecho.

**Tip pro:** Crea una plantilla de factura con todos los datos de tu LLC y reutilízala. Incluye tus términos de pago (Net 15, Net 30) y los métodos de pago aceptados. Un freelancer que envía facturas profesionales cobra más rápido, hecho comprobado.

## Cobros: ¿cómo recibo el dinero?

Tienes varias opciones (y conviene usar la más adecuada según el cliente):

- **ACH**: para clientes americanos. Es gratis en Mercury y el método más habitual en EE.UU.
- **Wire transfer**: para pagos grandes o urgentes. $0 en Mercury (sí, tanto envío como recepción).
- **Stripe**: para cobros con tarjeta, suscripciones o pagos online (2.9% + $0.30 por transacción)
- **PayPal Business**: alternativa ampliamente aceptada
- **Wise Business**: ideal para recibir en múltiples divisas (EUR, GBP, etc.) y convertir a USD

La regla de oro: todo el dinero del negocio entra por la cuenta de la LLC. Si un cliente te pregunta "¿puedo pagarte a tu cuenta personal?", la respuesta es siempre no.

## Gastos: ¿qué puedo pagar con la LLC?

La LLC puede pagar cualquier gasto que sea **ordinario y necesario** para el negocio:

- Software y herramientas (hosting, dominios, SaaS, licencias)
- Servicios profesionales (contabilidad, legal, marketing, diseño)
- Publicidad y marketing digital
- Hardware para trabajo (ordenador, monitor, teclado, silla ergonómica)
- Formación profesional (cursos, conferencias, libros técnicos)
- Coworking o espacio de trabajo
- Viajes de negocio (si están directamente relacionados con tu actividad)
- Comisiones bancarias y de procesadores de pago
- Servicios de Exentax (sí, nuestras fees son deducibles)

Los gastos deducibles reducen tu base imponible, y como tus beneficios "pasan a través" de la LLC (pass-through taxation) a tu declaración personal, cada gasto legítimo que deduzcas es dinero que no tributas. Pero ojo: cada gasto debe estar documentado y ser genuinamente del negocio. No intentes pasar la cena del sábado con amigos como "networking dinner".

## Cómo transferir dinero de la LLC a tu cuenta personal

Como Single-Member LLC, los beneficios son tuyos. Puedes transferirte dinero cuando quieras. Esto se llama **Owner's Draw** (retiro del propietario).

No es un salario, no tienes que hacerte nómina. Simplemente haces una transferencia de la cuenta de la LLC a tu cuenta personal. Lo importante:

- **Documenta cada retiro** con una nota clara ("Owner's Draw - [fecha] - [monto]")
- **No retires más de lo que hay** (suena obvio, pero pasa)
- **Mantén un colchón** en la cuenta para gastos operativos y compliance
- **Consolida tus retiros**: mejor un retiro mensual documentado que 47 transferencias pequeñas

**Tip pro:** Establece un "día de pago" mensual. El primero de cada mes, por ejemplo, te haces un Owner's Draw por el monto que hayas decidido. Esto simplifica la contabilidad y crea un hábito limpio.

## Registros y contabilidad: tu yo del futuro te lo agradecerá

No necesitas llevar una contabilidad compleja (no eres una multinacional), pero sí necesitas orden:

- **Registro de ingresos y gastos**: Mercury lo hace automático con su dashboard, pero ten también tu propia hoja de seguimiento
- **Guardar todas las facturas** emitidas y recibidas, crea una carpeta en Google Drive organizada por mes
- **Guardar recibos de gastos**: digitales o fotos de los físicos. Si no tienes recibo, no puedes deducir
- **Registrar los Owner's Draws**: fecha, monto, método de transferencia
- **Exportar estados de cuenta** de Mercury trimestralmente, guárdalos en tu carpeta de LLC

Estos registros son esenciales para tus declaraciones fiscales (Form 5472 + 1120) y para demostrar que tu LLC opera como un negocio real. Cuando llega el momento de preparar la declaración anual, en Exentax te pedimos esta información y nos encargamos del resto.

## Rutina mensual recomendada

Para que la operativa sea fluida, te recomendamos dedicar 30 minutos al mes a esto:

1. **Revisa tu estado de cuenta** en Mercury. ¿todo cuadra?
2. **Categoriza gastos** que no se hayan categorizado automáticamente
3. **Guarda facturas y recibos** pendientes en tu carpeta
4. **Haz tu Owner's Draw** mensual (si corresponde)
5. **Revisa tu saldo**: ¿tienes suficiente colchón para el próximo mes?

30 minutos. Una vez al mes. Es todo lo que necesitas para mantener tu LLC impecable.

## Errores comunes en la operativa diaria

- **Mezclar cuentas personales y de negocio**: el error más grave y más frecuente. Repito: NUNCA
- **No guardar recibos**: sin documentación, no puedes deducir el gasto y pierdes dinero
- **Usar la tarjeta de Mercury para gastos personales**: compromete la separación de entidades
- **No registrar los Owner's Draws**: genera problemas en la declaración anual
- **Olvidar el <a href="/es/blog/mantenimiento-anual-llc-obligaciones">mantenimiento anual</a>**: Annual Report, <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472+1120</a>, renovación del <a href="/es/blog/registered-agent-que-es-por-que-necesitas">Registered Agent</a>
- **No tener una rutina**: la dejadez se acumula y al final del año tienes un caos contable
- **Pedir a clientes que paguen a tu cuenta personal**: cada pago debe ir a la cuenta de la LLC

La operativa de tu LLC es más sencilla de lo que parece. Establece buenos hábitos desde el día uno, usa las herramientas correctas (Mercury + Slash + Wallester + Wise + Stripe/Adyen) y dedica 30 minutos al mes a mantener el orden. El resto lo hacemos nosotros.

En Exentax configuramos la operativa completa de tu LLC desde el primer día. No desaparecemos después de la constitución. Nos aseguramos de que Mercury esté aprobado, que Stripe esté conectado, que tu flujo de cobros y distribuciones funcione sin fricciones. Si necesitas convertir divisas, gestionar tarjetas corporativas o abrir cuentas en brókers, lo coordinamos todo.

La diferencia entre una LLC que funciona y una que da problemas no está en los papeles. Está en la operativa diaria. Si quieres que la tuya funcione bien desde el primer día, habla con nuestro equipo.`,
    category: "Operativa",
    readTime: 11,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Cómo operar tu LLC en el día a día: ecosistema completo | Exentax",
    metaDescription: "Guía práctica para operar tu LLC: Mercury, Slash, Wallester, Wise, Stripe, Adyen. Facturación, cobros, gastos, retiros y el ecosistema financiero completo.",
  },
  {
    slug: "operating-agreement-llc-que-es",
    title: "Operating Agreement: qué es y por qué tu LLC lo necesita",
    excerpt: "El Operating Agreement es el documento interno más importante de tu LLC. Define las reglas del juego y protege tu estructura. Aquí te explicamos qué incluye.",
    content: `Cuando <a href="/es/blog/constituir-llc-proceso-paso-a-paso">constituyes una LLC</a>, recibes los Articles of Organization, el documento público que registra tu empresa en el estado. Pero hay otro documento igual de importante (y que muchos ignoran): el **Operating Agreement**.

Y aquí viene una de las cosas más interesantes: **el Operating Agreement es un documento privado.** No se registra ante ninguna autoridad estatal, no es de acceso público, y nadie excepto tú (y las entidades que tú decidas) puede verlo. Esta privacidad es una ventaja enorme para tu estructura empresarial.

## ¿Qué es el Operating Agreement?

Es el contrato interno que define cómo funciona tu LLC. Piensa en él como la "constitución" de tu empresa, las reglas del juego que tú defines. En la mayoría de estados no es obligatorio registrarlo ante ninguna autoridad, lo que significa que **su contenido permanece completamente privado.** Solo tú y las partes que tú elijas (banco, procesador de pagos) lo ven.

Compáralo con la escritura de constitución de una SL española, que es un documento notarial y público. Con una LLC, tus reglas internas, tu participación y tu clasificación fiscal quedan entre tú y tu empresa. Privacidad real.

## ¿Por qué es tan importante?

Sin Operating Agreement, tu LLC se rige por las leyes genéricas del estado donde está registrada. Eso significa que pierdes el control sobre decisiones clave de tu negocio.

Pero la importancia va más allá:

- **Refuerza la separación entre tú y la LLC**: crucial para mantener la protección patrimonial. Sin este documento, el "velo corporativo" es más fácil de levantar
- **Es requerido por bancos y procesadores de pago**: Mercury, Stripe y PayPal lo piden para verificar tu LLC. Sin él, no abres cuenta
- **Define la estructura fiscal**: establece que tu LLC es una Disregarded Entity para el IRS, lo que te garantiza el pass-through taxation ($0 impuesto federal)
- **Protege ante disputas**: si en el futuro añades socios, las reglas ya están escritas
- **Privacidad**: al ser un documento privado, tus datos como propietario y las reglas financieras de la LLC no son públicas

## ¿Qué incluye un Operating Agreement?

Un Operating Agreement completo debe cubrir:

- **Datos de la LLC**: nombre legal, estado de constitución, dirección del Registered Agent
- **Datos del miembro**: nombre completo, porcentaje de participación (100% para Single-Member)
- **Propósito de la LLC**: descripción general de la actividad comercial
- **Clasificación fiscal**: declaración explícita de que la LLC se trata como Disregarded Entity ante el IRS
- **Capital inicial**: aportación inicial del miembro (puede ser $0)
- **Distribución de beneficios**: cómo se reparten los beneficios (100% al único miembro en Single-Member LLC)
- **Gestión**: quién toma las decisiones (Member-Managed vs Manager-Managed)
- **Cuentas bancarias**: autorización para abrir y operar cuentas a nombre de la LLC
- **Indemnización**: protección del miembro frente a reclamaciones derivadas de la actividad de la LLC
- **Disolución**: condiciones bajo las cuales la LLC puede disolverse
- **Enmiendas**: cómo se modifica el acuerdo si cambian las circunstancias

## ¿Member-Managed o Manager-Managed?

Para una Single-Member LLC de un freelancer o emprendedor digital, lo más habitual es **Member-Managed**: tú como único miembro tomas todas las decisiones. Es la opción más directa y la que usamos por defecto en Exentax.

**Manager-Managed** se usa cuando quieres designar a alguien que gestione la LLC en tu nombre. Es menos común para autónomos, pero puede ser útil en estructuras más complejas o si planeas escalar con empleados.

## ¿Necesito un abogado para redactarlo?

No. Lo que necesitas es que esté bien hecho y adaptado a tu situación real. Un Operating Agreement mal redactado, o peor, una plantilla genérica descargada de internet, puede ser peor que no tener ninguno.

En Exentax, el Operating Agreement viene incluido en todos nuestros planes de constitución. Está adaptado específicamente para no residentes con Single-Member LLCs: incluye la clasificación fiscal correcta (Disregarded Entity), las cláusulas de privacidad necesarias y la estructura que Mercury y Stripe necesitan ver para aprobar tu cuenta. No es un template, es un documento preparado para tu caso concreto.

## ¿Cuándo necesito actualizarlo?

Debes actualizar tu Operating Agreement cuando:

- Añades un nuevo miembro a la LLC
- Cambias la estructura de gestión (de Member-Managed a Manager-Managed o viceversa)
- Modificas la clasificación fiscal
- Cambias de Registered Agent o dirección
- Hay un cambio significativo en la actividad de la LLC
- Realizas una aportación de capital importante

En Exentax también nos encargamos de las actualizaciones del Operating Agreement cuando son necesarias. Si tu situación cambia, adaptamos el documento.

## Qué piden las entidades financieras del Operating Agreement

Cuando abres tu cuenta en Mercury, o cuando te registras en Stripe, una de las primeras cosas que te piden es el Operating Agreement. Pero no se lo piden por curiosidad: necesitan verificar datos específicos.

**Mercury** revisa:
- Que eres el único propietario (Single-Member) o que tienes autorización como firmante
- Que la LLC está clasificada como Disregarded Entity (importante para la estructura fiscal)
- Que hay autorización para abrir cuentas bancarias

**Stripe** verifica:
- Que la persona que se registra es propietaria o está autorizada
- La estructura de la LLC y su actividad declarada

**PayPal Business** comprueba:
- Datos del propietario y su porcentaje de participación
- La actividad comercial declarada

Si tu Operating Agreement no coincide con la información que proporcionas en las solicitudes, te rechazan o te piden correcciones. Un Operating Agreement mal preparado es una de las causas más frecuentes de retrasos en la apertura de cuentas. Lee nuestra guía sobre <a href="/es/blog/due-diligence-bancario-llc-americana">due diligence bancario</a> para entender qué revisan exactamente.

## Errores habituales con el Operating Agreement

**Usar una plantilla de internet sin revisarla.** Muchas plantillas están pensadas para LLCs de residentes americanos y no incluyen las cláusulas específicas para no residentes. Peor aún, algunas plantillas clasifican la LLC como Partnership (para multi-member) cuando tu LLC es Single-Member, esto cambia completamente tu situación fiscal.

**No incluir la clasificación fiscal.** Si tu Operating Agreement no dice explícitamente que la LLC es una Disregarded Entity para el IRS, estás dejando un vacío que puede complicar tu declaración fiscal y confundir a entidades financieras.

**No firmarlo.** Parece obvio, pero pasa: el Operating Agreement debe estar firmado y fechado. Un documento sin firma no tiene validez y las entidades financieras lo rechazarán.

**Incluir información inconsistente.** Si el Operating Agreement dice una cosa y los Articles of Organization dicen otra (nombre de la LLC, dirección, miembros), se genera una inconsistencia que puede levantar banderas en due diligence bancario.

## Lo que deberías llevarte de este artículo

El Operating Agreement es la columna vertebral legal de tu LLC, y su naturaleza privada es una ventaja que debes aprovechar. En Exentax lo preparamos como parte del proceso de constitución de tu LLC, sale de nuestras manos listo para presentar a Mercury, Stripe y cualquier entidad que lo solicite. Está adaptado para no residentes, con la clasificación fiscal correcta, las cláusulas de privacidad y la estructura que las entidades financieras necesitan. Agenda tu asesoría gratuita y nos aseguramos de que tu LLC tiene toda la documentación en orden desde el día uno.`,
    category: "Guías",
    readTime: 8,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Operating Agreement LLC: qué es y por qué lo necesitas | Exentax",
    metaDescription: "El Operating Agreement define las reglas internas de tu LLC. Qué incluye, por qué es imprescindible y cuándo actualizarlo. Guía completa para no residentes.",
  },
  {
    slug: "documentos-llc-cuales-necesitas",
    title: "Documentos de tu LLC: cuáles necesitas y para qué sirve cada uno",
    excerpt: "Articles of Organization, EIN, Operating Agreement, BOI Report... Cada documento de tu LLC tiene una función. Te explicamos cuáles tienes que tener y por qué.",
    content: `Cuando constituyes una LLC en Estados Unidos, recibes un "kit legal" completo, varios documentos, cada uno con una función concreta. En Exentax los preparamos y entregamos todos como parte del servicio de constitución. Pero es bueno que sepas qué es cada uno y para qué lo vas a necesitar.

Spoiler: no son muchos, y los vas a usar más de lo que piensas (sobre todo cuando abras tu <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">cuenta bancaria en Mercury</a> o te registres en <a href="/es/blog/pasarelas-pago-llc-stripe-paypal-dodo">Stripe</a>).

## 1. Articles of Organization (Certificate of Formation)

Es el documento oficial que registra tu LLC ante el estado. Es el "acta de nacimiento" de tu empresa. Es público y contiene:

- Nombre legal de la LLC
- Dirección del Registered Agent
- Fecha de constitución
- Tipo de gestión (Member-Managed o Manager-Managed)
- Estado de constitución

En estados como Nuevo México, los datos de los miembros NO aparecen en los Articles of Organization, lo que te da privacidad adicional.

**¿Cuándo lo necesitas?** Para abrir la cuenta bancaria en Mercury o Relay, registrarte en Stripe/PayPal, y demostrar que tu LLC existe legalmente. Es el primer documento que te van a pedir siempre.

**En Exentax:** Lo registramos ante la Secretaría de Estado y te entregamos la copia certificada.

## 2. EIN Letter (CP 575 / SS-4 Confirmation)

El EIN (Employer Identification Number) es el número de identificación fiscal de tu LLC ante el IRS. Equivale al NIF/CIF español o al RFC mexicano, pero para entidades americanas. La carta CP 575 del IRS confirma oficialmente la asignación de tu EIN.

**¿Cuándo lo necesitas?** Para abrir cuentas bancarias (Mercury, Relay), registrarte en Stripe/PayPal, presentar declaraciones fiscales (Form 5472 + 1120) y operar con clientes americanos. Algunos bancos y procesadores de pago piden específicamente la carta CP 575 como verificación.

**En Exentax:** Solicitamos el EIN directamente al IRS y te entregamos la carta de confirmación.

## 3. Operating Agreement

El documento interno más importante de tu LLC. Define las reglas del juego: quién la gestiona, cómo se reparten beneficios, clasificación fiscal (Disregarded Entity), autorización para operar cuentas bancarias, etc.

Un detalle clave: **el Operating Agreement es un documento privado.** No se registra ante ninguna autoridad estatal. Solo tú y las entidades que tú elijas (Mercury, Stripe) lo ven. Es una ventaja de privacidad enorme respecto a estructuras como la SL española.

**¿Cuándo lo necesitas?** Para abrir cuentas en Mercury (lo piden siempre), verificar Stripe, y como respaldo legal de toda tu estructura.

**En Exentax:** Lo redactamos adaptado a tu situación específica (no es un template genérico) y te lo entregamos listo.

## 4. Certificate of Formation / Certificate of Good Standing

El Certificate of Formation confirma que tu LLC fue registrada correctamente. El Certificate of Good Standing lo emite el estado y certifica que tu LLC está al día con todas sus obligaciones (Annual Report, tasas, etc.).

**¿Cuándo lo necesitas?** Algunos bancos y proveedores lo solicitan periódicamente. También es necesario si registras tu LLC en otro estado (Foreign Qualification) o si un cliente grande te pide verificación.

**En Exentax:** Lo solicitamos cuando lo necesitas y te lo enviamos.

## 5. BOI Report Confirmation

El BOI Report (Beneficial Ownership Information) es una declaración ante FinCEN que identifica a los propietarios reales de la LLC. Desde 2024, todas las LLCs deben presentarlo (aunque FinCEN ha suspendido temporalmente la enforcement de sanciones).

**¿Cuándo lo necesitas?** Dentro de los 30 días posteriores a la constitución (para LLCs nuevas a partir de 2025). Luego, cada vez que haya cambios en la propiedad.

**En Exentax:** Lo presentamos como parte del proceso de constitución. Ni te enteras.

## 6. Registered Agent Agreement

Documento que confirma quién es tu Registered Agent, la persona o empresa designada para recibir documentación legal oficial en nombre de tu LLC en el estado de constitución.

**¿Cuándo lo necesitas?** Forma parte de los registros de tu LLC. Algunos bancos lo solicitan como verificación adicional.

**En Exentax:** El Registered Agent está incluido en todos nuestros planes (constitución y mantenimiento). Lo gestionamos y renovamos por ti cada año.

## Resumen: tu checklist de documentos

| Documento | ¿Público o privado? | ¿Quién lo proporciona? |
|---|---|---|
| Articles of Organization | Público (registro estatal) | Exentax |
| EIN Letter (CP 575) | Privado (del IRS) | Exentax |
| Operating Agreement | Privado | Exentax |
| Certificate of Formation | Público | Exentax |
| Certificate of Good Standing | Público | Exentax (bajo demanda) |
| BOI Report Confirmation | Privado (FinCEN) | Exentax |
| Registered Agent Agreement | Privado | Exentax |

## Documentos que NO necesitas

- **Número de Seguro Social (SSN)**: No es necesario para no residentes. El EIN sustituye al SSN para efectos fiscales de la LLC
- **Visa o permiso de trabajo**: No necesitas estar autorizado a trabajar en EE.UU. para tener una LLC. Todo es 100% remoto
- **Dirección física en EE.UU.**: El Registered Agent proporciona la dirección legal
- **Pasaporte americano**: Cualquier pasaporte vigente es válido
- **Cuenta bancaria previa en EE.UU.**: Se abre como parte del proceso de constitución

## ¿Dónde guardar estos documentos?

Recomendamos tener una copia digital organizada de todo:

- **Carpeta "LLC Docs"** en tu nube (Google Drive, Dropbox, etc.)
- **Subcarpetas por tipo:** Constitución, Fiscal, Bancario, Compliance
- **Nombres claros:** "Articles_of_Organization_MiLLC.pdf", "EIN_Letter_CP575.pdf", "Operating_Agreement_MiLLC.pdf"

Vas a necesitar estos documentos cada vez que abras una cuenta nueva, te registres en un procesador de pagos o un cliente grande te pida verificación. Tenerlos organizados te ahorra horas.

En Exentax, todos nuestros clientes reciben su documentación completa, organizada y lista desde el día uno. Cada documento sale revisado y preparado para que puedas usarlo inmediatamente con Mercury, Stripe o cualquier entidad que lo pida. ¿Tienes dudas sobre si tienes todo lo que necesitas? Agenda tu asesoría gratuita y lo revisamos contigo.`,
    category: "Guías",
    readTime: 6,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Documentos de tu LLC: cuáles necesitas y para qué sirven | Exentax",
    metaDescription: "Articles of Organization, EIN, Operating Agreement, BOI Report... Todos los documentos de tu LLC explicados: para qué sirven y cuándo los necesitas.",
  },
  {
    slug: "mantenimiento-anual-llc-obligaciones",
    title: "Mantenimiento anual de tu LLC: obligaciones, plazos y costes",
    excerpt: "Tu LLC necesita mantenimiento anual para mantener el Good Standing. Annual Report, Registered Agent, declaraciones fiscales y más. Todo lo que debes cumplir.",
    content: `Constituir una LLC es solo el primer paso. Para que tu empresa siga activa, en regla y con el Good Standing intacto, hay obligaciones anuales que debes cumplir. La buena noticia: en Exentax nos encargamos de absolutamente todo como parte del plan de mantenimiento anual. Tú te dedicas a tu negocio y nosotros al compliance.

Pero es importante que entiendas qué se hace y cuándo. Así que vamos a contarte todo con detalle, plazos, costes, y el calendario completo.

## ¿Qué es el Good Standing?

Es el estatus que confirma que tu LLC cumple con todas sus obligaciones ante el estado. Es como el "carnet de conducir" de tu empresa, si lo pierdes, no puedes circular.

Sin Good Standing:

- No puedes abrir nuevas cuentas bancarias
- Mercury, Stripe y otros procesadores pueden suspender tu cuenta
- El estado puede disolver tu LLC administrativamente
- Pierdes la protección patrimonial que la LLC te ofrece
- Clientes grandes pueden rechazar trabajar contigo

Mantener el Good Standing es fácil si cumples con las obligaciones a tiempo. Y como nosotros llevamos el calendario por ti, nunca se pasa un plazo.

## Obligaciones anuales según el estado

### Nuevo México
- **Annual Report:** No requiere (sí, leíste bien. $0 y cero trámites estatales)
- **Tasa anual estatal:** $0
- **Resultado:** El mantenimiento más barato y sencillo de los tres estados. Por eso es nuestro favorito

### Wyoming
- **Annual Report:** Sí, cada año en la fecha de aniversario de la LLC
- **Tasa anual:** $60 mínimo (aumenta si los activos reportados en Wyoming superan $300,000)
- **Plazo:** 60 días antes del aniversario de constitución
- **En Exentax:** Lo presentamos por ti. Ni te enteras

### Delaware
- **Annual Report:** Sí, cada año
- **Tasa anual:** $300 (franchise tax fija para LLCs)
- **Plazo:** 1 de junio de cada año
- **En Exentax:** Incluido en el plan de mantenimiento

## Obligaciones fiscales federales (aplican a TODOS los estados)

Independientemente de dónde constituyas tu LLC, estas obligaciones son las mismas:

### Form 5472 + Form 1120 (declaración anual al IRS)

Si tu LLC tiene un propietario extranjero (no residente), debes presentar el **<a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a>** (informativo) junto con un **Form 1120 pro-forma** cada año. Es obligatorio incluso si tu LLC no tuvo ingresos.

Recordatorio importante: **tu LLC paga $0 de impuesto federal.** Estos formularios son puramente informativos, el IRS quiere saber qué transacciones hubo entre tú y tu LLC, pero no te cobra nada. <a href="/es/blog/tributacion-pass-through-llc-como-funciona">Pass-through taxation</a> en estado puro.

- **Plazo original:** 15 de abril
- **Con extensión (Form 7004):** 15 de octubre
- **En Exentax:** Solicitamos la extensión automáticamente y presentamos todo antes del 15 de octubre. Tú solo nos envías tu información financiera y nosotros hacemos el resto

### FBAR (FinCEN Form 114)

Si la suma de tus cuentas financieras en EE.UU. supera los $10,000 en algún momento del año, debes presentar el FBAR.

- **Plazo:** 15 de abril (extensión automática hasta 15 de octubre)
- **En Exentax:** Lo incluimos en el servicio de mantenimiento

## Renovación del Registered Agent

Tu <a href="/es/blog/registered-agent-que-es-por-que-necesitas">Registered Agent</a> debe estar activo permanentemente, es requisito legal en todos los estados. Si tu servicio de Registered Agent expira y no lo renuevas:

- El estado envía avisos legales que nadie recibe
- Puedes perder el Good Standing sin enterarte
- Si te demandan, no recibes la notificación y pueden obtener un fallo en tu contra (default judgment)
- Multas y posible disolución administrativa

**En Exentax:** El Registered Agent está incluido en todos nuestros planes. Lo renovamos automáticamente cada año. Cero riesgo de que expire.

## BOI Report (si hay cambios)

Si cambia algún dato de los propietarios reales de la LLC (nombre, dirección, pasaporte, porcentaje de participación), debes actualizar el BOI Report ante FinCEN en un plazo de 30 días. Nota: FinCEN ha suspendido temporalmente la enforcement de sanciones, pero en Exentax seguimos presentando todo en plazo.

## Calendario completo de mantenimiento anual

Aquí tienes el calendario que seguimos en Exentax para cada cliente. Imprímelo, ponlo en tu nevera, o simplemente confía en que nosotros lo llevamos por ti:

| Fecha | Obligación | ¿Quién lo hace? |
|---|---|---|
| **Enero** | Comenzamos a recopilar información fiscal del año anterior | Exentax te pide los datos |
| **Febrero-Marzo** | Preparamos documentación para declaraciones | Exentax |
| **Antes del 15 de abril** | Solicitamos extensión Form 7004 | Exentax |
| **15 de abril** | FBAR (o extensión automática hasta octubre) | Exentax |
| **1 de junio** | Annual Report + Franchise Tax Delaware | Exentax (solo Delaware) |
| **Fecha aniversario** | Annual Report Wyoming | Exentax (solo Wyoming) |
| **Antes del 15 de octubre** | Presentamos Form 5472 + 1120 al IRS | Exentax |
| **Continuo** | Registered Agent activo y renovado | Exentax |
| **Cuando aplique** | Actualización BOI Report (si hay cambios) | Exentax |
| **Diciembre** | Revisión de cierre fiscal + planificación año siguiente | Exentax |

## ¿Cuánto cuesta el mantenimiento anual total?

Todo depende del estado:

| Concepto | Nuevo México | Wyoming | Delaware |
|---|---|---|---|
| Tasa estatal | $0 | $60 | $300 |
| Annual Report | No aplica | Incluido | Incluido |
| Form 5472 + 1120 | Incluido | Incluido | Incluido |
| FBAR | Incluido | Incluido | Incluido |
| Registered Agent | Incluido | Incluido | Incluido |
| BOI Report (actualización) | Incluido | Incluido | Incluido |
| Soporte continuo | Incluido | Incluido | Incluido |

En Exentax, el plan de mantenimiento anual cubre todo lo anterior. Cero sorpresas, cero extras, cero "ah, esto no estaba incluido". Un precio fijo anual y nosotros nos encargamos de cada trámite, cada formulario y cada plazo.

## ¿Qué pasa si no hago el mantenimiento?

Vamos a ser directos: si ignoras el mantenimiento de tu LLC, las consecuencias son reales:

1. **Pérdida de Good Standing**: tu LLC aparece como "Not in Good Standing" en los registros del estado
2. **Mercury puede congelar tu cuenta**: las entidades financieras verifican periódicamente el estatus de la LLC
3. **Sanciones del IRS** por no presentar el Form 5472
4. **Disolución administrativa**: el estado puede disolver tu LLC si no cumples durante un periodo prolongado
5. **Pérdida de protección patrimonial**: si tu LLC no está activa, tu patrimonio personal queda expuesto

No merece la pena arriesgarse. El mantenimiento anual es una inversión pequeña comparada con lo que te protege y te ahorra.

¿Quieres que nos encarguemos de todo el mantenimiento de tu LLC? Pide tu consulta sin compromiso y te explicamos el plan completo para tu caso.`,
    category: "Compliance",
    readTime: 7,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Mantenimiento anual LLC: obligaciones, plazos y costes | Exentax",
    metaDescription: "Todo lo que necesitas hacer cada año para mantener tu LLC en regla: Annual Report, Form 5472, FBAR, Registered Agent. Plazos, costes y calendario completo.",
  },
  {
    slug: "wise-business-llc-guia",
    title: "Wise Business para tu LLC: guía completa",
    excerpt: "Wise Business es la herramienta perfecta para recibir pagos en múltiples divisas, convertir moneda y enviar dinero desde tu LLC. Cómo configurarla y aprovecharla.",
    content: `**Wise Business** (antes TransferWise) es una de las herramientas financieras más útiles para propietarios de LLCs que operan internacionalmente. Te permite recibir, convertir y enviar dinero en más de 40 divisas con tipos de cambio reales y comisiones transparentes.

Un matiz importante: **Wise no es un banco.** Es una EMI (Institución de Dinero Electrónico), en EE.UU. opera como Money Transmitter. Esto significa que tu dinero no tiene cobertura FDIC, pero Wise usa safeguarding (separación de fondos del cliente) para protegerlo. Para la mayoría de operaciones de conversión y pagos internacionales, esto es más que suficiente. Para tu tesorería principal, usa <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a>. Si quieres entender mejor la diferencia entre bancos y fintechs, lee nuestro artículo sobre <a href="/es/blog/bancos-vs-fintech-llc-donde-abrir-cuenta">bancos vs fintech para tu LLC</a>.

## ¿Por qué Wise Business para tu LLC?

Si tu LLC cobra en dólares pero tus gastos personales están en euros, pesos o soles, necesitas una forma eficiente de convertir moneda. Wise ofrece:

- **Tipo de cambio real** (mid-market rate), sin margen oculto
- **Comisiones transparentes**: ves exactamente cuánto pagas antes de enviar
- **Cuentas en múltiples divisas**: recibe en USD, EUR, GBP, AUD, y más
- **Datos bancarios locales**: routing number estadounidense, IBAN europeo, sort code británico

## ¿Wise Business reemplaza a Mercury?

**No.** Son complementarias:

- **Mercury** es tu plataforma financiera principal, donde recibes los ingresos de la LLC y gestionas la tesorería
- **Wise Business** es tu herramienta de conversión y pagos internacionales, donde conviertes divisas y envías dinero a tu cuenta personal

El flujo típico es: Cliente paga → Mercury (USD) → Wise (conversión) → Tu cuenta personal (EUR/MXN/COP).

## Cómo abrir Wise Business para tu LLC

1. Ve a wise.com/business y selecciona "United States" como país de la empresa
2. Ingresa el nombre legal de tu LLC y el EIN
3. Sube los documentos: Articles of Organization y EIN Letter
4. Verifica tu identidad como propietario (pasaporte + selfie)
5. Espera la aprobación (normalmente 1-3 días hábiles)

## Funcionalidades clave para tu LLC

### Recibir pagos en múltiples divisas
Wise te da datos bancarios locales en varios países. Si tienes un cliente en Europa, puede pagarte por SEPA (transferencia europea) directamente a tu cuenta Wise en euros, sin wire transfer internacional y sin comisiones del banco intermediario.

### Convertir divisas
Cuando necesitas euros, pesos u otra moneda, conviertes directamente en Wise al tipo de cambio real. La comisión es transparente (normalmente 0.4-1.5% según el par de divisas).

### Enviar dinero a tu cuenta personal
Una vez convertido, envías el dinero a tu cuenta personal en tu país. Si tu banco acepta SEPA (Europa) o transferencia local, el envío es rápido y económico.

### Tarjeta Wise Business
Wise ofrece una tarjeta de débito (física y virtual) vinculada a tu cuenta. Puedes usarla para gastos de la LLC y pagar en la moneda local. Wise convierte automáticamente al mejor tipo de cambio.

## Costes de Wise Business

- **Abrir cuenta:** Gratis
- **Mantenimiento mensual:** Gratis
- **Recibir pagos:** Gratis por ACH/SEPA
- **Convertir divisas:** 0.4-1.5% (según par)
- **Enviar dinero:** Varía según destino y método

## Wise vs bancos tradicionales para conversión de divisas

| Concepto | Wise | Banco tradicional |
|---|---|---|
| Tipo de cambio | Real (mid-market) | Con margen (1-3%) |
| Comisión | Transparente (0.4-1.5%) | Oculta en el spread |
| Velocidad | 1-2 días | 2-5 días |
| Transparencia | Ves todo antes de enviar | Descubres el coste después |

## Errores comunes con Wise Business

### Usar Wise como cuenta principal de la LLC

Wise es excelente para conversión de divisas y pagos internacionales, pero no debería ser tu cuenta operativa principal. Al ser una EMI y no un banco, carece de protección FDIC. Tu tesorería principal debe estar en Mercury (custodiada en Column NA con FDIC hasta $250,000). Wise es la capa de conversión: mueves lo que necesitas convertir, cuando lo necesitas.

### No verificar los límites de transferencia

Wise tiene límites de transferencia que varían según la divisa y el destino. Antes de planificar un envío grande, verifica los límites en tu cuenta. Si necesitas mover cantidades significativas con regularidad, considera combinar Wise con wires internacionales directos desde Mercury (que son gratuitos).

### Confundir los datos bancarios de Wise con los de Mercury

Wise te da routing number y account number americanos, pero pertenecen a diferentes instituciones. No uses los datos de Wise para recibir pagos de clientes, esos deben ir a Mercury. Usa Wise exclusivamente para el tramo de conversión de divisa.

## Wise en el contexto de tu operativa financiera

Wise ocupa un rol específico en tu stack financiero:

1. **Ingresos y tesorería:** Mercury gestiona tus cobros, pagos a proveedores y capital operativo
2. **Conversión internacional:** Wise convierte USD a EUR, MXN, COP al tipo real cuando necesitas sacar beneficios
3. **Gastos corporativos:** Puedes usar tarjetas Wise para gastos puntuales en divisas locales donde Wise ofrezca mejor tipo de cambio

Cada herramienta tiene su función. El error más común es intentar que una sola plataforma haga todo. El resultado siempre es pagar más en comisiones ocultas o tener peor tipo de cambio.

## Casos de uso reales

**Freelancer en España que cobra en USD:** Tu cliente americano paga a tu Mercury por ACH. A final de mes, transfieres tu distribución a Wise, conviertes a EUR al tipo de cambio real, y envías a tu cuenta española por SEPA. Coste total de la conversión: 0.4-0.6%. Con un banco tradicional pagarías 2-3%.

**Consultor en Colombia que cobra en EUR y USD:** Recibes pagos en USD en Mercury y en EUR en tu cuenta Wise europea. Conviertes ambas divisas a COP cuando necesitas y envías a tu cuenta colombiana. Wise te da el tipo mid-market, que puede suponer un ahorro de miles de pesos por cada $1,000 convertidos frente a la tasa de tu banco local.

**SaaS con clientes globales:** Tus clientes pagan por Stripe (que deposita en Mercury). Tu equipo de freelancers en Latinoamérica cobra por Wise en sus monedas locales. El flujo es limpio, documentado y eficiente.

Quieres usar Wise Business como complemento a tu cuenta principal en Mercury? Reserva una consulta con nuestro equipo y te ayudamos a configurar tu flujo de divisas para que pagues lo mínimo posible en cada conversión.`,
    category: "Herramientas",
    readTime: 7,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Wise Business para tu LLC: guía completa | Exentax",
    metaDescription: "Wise Business para tu LLC: cómo abrirla, recibir pagos en múltiples divisas, convertir moneda y enviar dinero a tu cuenta personal. Guía completa.",
  },
  {
    slug: "pasarelas-pago-llc-stripe-paypal-dodo",
    title: "Pasarelas de pago para tu LLC: Stripe, PayPal y alternativas",
    excerpt: "Tu LLC necesita cobrar a clientes. Stripe, PayPal, Dodo Payments y otras opciones comparadas: comisiones, funcionalidades y cuál elegir según tu negocio.",
    content: `Una de las mayores ventajas de tener una LLC en Estados Unidos es el acceso a las mejores pasarelas de pago del mundo. Mientras que muchos países tienen restricciones o comisiones elevadas, con una LLC americana puedes cobrar en prácticamente cualquier divisa con las herramientas más avanzadas.

## Stripe

Stripe es la pasarela de pago preferida por startups, SaaS y negocios digitales. Con tu LLC puedes acceder a **Stripe US**: la versión más completa.

### Ventajas
- Acepta más de 135 divisas
- Checkout embebido, links de pago, facturación automática
- API potente para integraciones personalizadas
- Suscripciones y pagos recurrentes
- Dashboard completo con analytics

### Comisiones
- **2.9% + $0.30** por transacción doméstica (tarjeta US)
- **3.9% + $0.30** por transacción internacional
- Sin costes mensuales fijos

### Ideal para
Negocios digitales, SaaS, freelancers con volumen, marketplaces

## PayPal Business

PayPal sigue siendo la pasarela más reconocida por los consumidores. Con tu LLC, accedes a **PayPal Business US** sin las restricciones de cuentas personales o de países con limitaciones.

### Ventajas
- Reconocimiento de marca, los clientes confían en PayPal
- Checkout, botones de pago, suscripciones, facturación
- Protección al vendedor incluida
- Integración fácil con la mayoría de plataformas

### Comisiones
- **2.99% + $0.49** por transacción doméstica
- **4.49% + $0.49** por transacción internacional
- Sin costes mensuales para el plan estándar

### Ideal para
Freelancers que trabajan con clientes que prefieren PayPal, servicios B2B

## Adyen

**Adyen** es un procesador de pagos enterprise utilizado por empresas como Spotify, Uber y eBay. Si tu LLC necesita procesamiento de nivel empresarial, Adyen ofrece una plataforma unificada de pagos con acceso a métodos de pago locales en más de 30 países.

### Ventajas
- Procesamiento unificado: adquirencia, gateway y gestión de riesgos en una sola plataforma
- Métodos de pago locales (iDEAL, Bancontact, Boleto, OXXO...)
- Analytics avanzado y gestión de fraude
- Potencia los links de pago de Relay, si usas Relay como cuenta bancaria, tus links de cobro se procesan a través de Adyen

### Ideal para
Negocios con volumen significativo, marketplaces, ecommerce enterprise

## DoDo Payments

**DoDo Payments** es la solución ideal para negocios digitales que venden a consumidores finales (B2C) a nivel global. Su diferencial: actúa como **Merchant of Record (MoR)**.

### Ventajas
- **Merchant of Record**: DoDo se encarga del IVA/GST de cada país automáticamente. Tú vendes, DoDo calcula, recauda y remite el impuesto correspondiente. Esto elimina la necesidad de registrarte para IVA en cada país donde tengas clientes
- Checkout optimizado para conversión
- Soporta múltiples métodos de pago globales
- Gestión completa del cumplimiento fiscal internacional

### Ideal para
Creadores digitales, SaaS con clientes globales, venta de cursos, software, ebooks y productos digitales. Si vendes B2C internacionalmente y no quieres gestionar el IVA/GST de 40 países, DoDo es tu solución

## Comparativa rápida

| Pasarela | Comisión US | Comisión internacional | Mejor para |
|---|---|---|---|
| Stripe | 2.9% + $0.30 | 3.9% + $0.30 | SaaS, productos digitales |
| PayPal | 2.99% + $0.49 | 4.49% + $0.49 | Freelancers, B2B |
| Adyen | Variable (negociable) | Variable | Enterprise, marketplaces |
| DoDo Payments | Variable | Variable | Ventas B2C globales con IVA/GST automático |

## ¿Puedo usar varias a la vez?

Sí, y de hecho es recomendable. Muchos negocios usan:

- **Stripe** como pasarela principal (checkout, suscripciones)
- **PayPal** como alternativa para clientes que lo prefieren
- **DoDo Payments** para ventas B2C internacionales (gestión automática de IVA/GST como Merchant of Record)
- **Wise Business** para facturas con pago por transferencia

Todas pueden conectarse a la misma <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">cuenta bancaria de la LLC en Mercury</a> (que tiene $0 en comisiones de wire, por cierto). Lee más sobre <a href="/es/blog/cambiar-divisas-llc-mejores-opciones">cómo cambiar divisas</a> con tu LLC.

## Lili

**Lili** es un neobanco (fintech con licencia bancaria) diseñado específicamente para freelancers y pequeños negocios. No es una pasarela de pagos, es un banco digital completo que combina cuenta corriente, herramientas de contabilidad y facturación en una sola plataforma.

### Ventajas
- Cuenta bancaria completa con licencia bancaria (no es una EMI)
- Herramientas de contabilidad y categorización automática de gastos integradas
- Preparación de impuestos simplificada
- Diseñada específicamente para freelancers y small businesses

### Ideal para
Freelancers que quieren una solución todo-en-uno de banking y contabilidad sin complicarse con múltiples herramientas.

## Comparativa ampliada

| Pasarela | Comisión US | Comisión internacional | Mejor para |
|---|---|---|---|
| Stripe | 2.9% + $0.30 | 3.9% + $0.30 | SaaS, productos digitales, e-commerce |
| PayPal | 2.99% + $0.49 | 4.49% + $0.49 | Freelancers, B2B, clientes que prefieren PayPal |
| Adyen | Variable (negociable) | Variable | Enterprise, marketplaces, alto volumen |
| DoDo Payments | Variable | Variable | Ventas B2C globales con gestión de IVA/GST automática (Merchant of Record) |
| Lili (neobanco) | Incluido | Incluido | Freelancers que quieren banking + contabilidad todo-en-uno |

## ¿Qué necesito para configurarlas?

Para verificar tu LLC en cualquier pasarela de pago necesitas:

- **EIN** de la LLC, lo obtiene Exentax por ti
- **Articles of Organization**: los preparamos nosotros
- **Operating Agreement**: personalizado, no un template de internet
- **Documento de identidad** del propietario (pasaporte)
- **Cuenta bancaria** de la LLC (Mercury, la abrimos nosotros)

El proceso de verificación suele tardar 1-5 días hábiles. En Exentax coordinamos toda la configuración para que no tengas que lidiar con formularios de verificación en inglés ni subir documentos uno por uno. Tú decides qué pasarelas necesitas, nosotros las dejamos listas.

Habla con nuestro equipo y te recomendamos la combinación de pasarelas que mejor encaja con tu tipo de negocio.`,
    category: "Herramientas",
    readTime: 6,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Pasarelas de pago para tu LLC: Stripe, PayPal, Adyen, DoDo Payments | Exentax",
    metaDescription: "Compara Stripe, PayPal, Adyen y DoDo Payments (Merchant of Record) para tu LLC americana. Comisiones, IVA automático y cuál elegir según tu negocio.",
  },
  {
    slug: "amazon-ecommerce-llc-vender-online",
    title: "Amazon y ecommerce con LLC: cómo vender online desde cualquier país",
    excerpt: "Con una LLC puedes vender en Amazon, Shopify y otras plataformas de ecommerce sin restricciones geográficas. Cómo funciona y qué necesitas para empezar.",
    content: `Si quieres vender productos (físicos o digitales) en Amazon, Shopify, Etsy o cualquier plataforma de ecommerce, tener una <a href="/es/blog/constituir-llc-proceso-paso-a-paso">LLC en Estados Unidos</a> te abre puertas que desde tu país probablemente están cerradas, o limitadas con restricciones y retenciones.

## ¿Por qué una LLC para ecommerce?

### Acceso sin restricciones a Amazon US
Amazon Seller Central US es el marketplace más grande del mundo. Con una LLC americana, puedes registrarte como vendedor profesional sin las limitaciones que tienen las cuentas de vendedores internacionales.

### Cuenta bancaria en dólares
Las plataformas de ecommerce depositan tus ganancias en tu cuenta bancaria. Con una LLC, recibes los fondos directamente en Mercury en dólares, sin intermediarios, sin retenciones y sin conversiones forzadas.

### Credibilidad ante el cliente
Vender desde una empresa americana genera confianza. Los clientes en EE.UU. ven una empresa local, no un vendedor internacional.

## Amazon FBA con tu LLC

**Fulfillment by Amazon (FBA)** te permite enviar tu inventario a los almacenes de Amazon. Ellos se encargan del almacenamiento, envío y devoluciones.

Para registrarte en Amazon FBA necesitas:

- **LLC constituida** con Articles of Organization
- **EIN** de la LLC
- **Cuenta bancaria US** (Mercury)
- **Tarjeta de crédito/débito** para las fees de Amazon
- **Pasaporte** del propietario
- **Dirección** (Registered Agent o dirección comercial)

## Shopify con tu LLC

Shopify es la plataforma de ecommerce más popular para tiendas propias. Con tu LLC puedes:

- Crear tu tienda online sin restricciones
- Conectar **Shopify Payments** (powered by Stripe) para cobros directos
- Recibir los fondos en tu cuenta Mercury
- Vender en múltiples monedas

## Obligaciones fiscales del ecommerce con LLC

Si vendes productos físicos en EE.UU., hay un tema fiscal adicional: el **Sales Tax** (impuesto sobre ventas). Este impuesto:

- Es estatal (cada estado tiene sus propias tasas)
- Aplica si tienes "nexus" (presencia económica significativa) en un estado
- Amazon lo recauda automáticamente en la mayoría de estados para vendedores FBA

Para productos digitales vendidos a clientes fuera de EE.UU., la LLC generalmente no cobra sales tax.

## Modelo de negocio típico

1. **Constituyes tu LLC** en un estado favorable (Nuevo México, Wyoming)
2. **Abres cuenta Mercury** y configuras Stripe/Shopify Payments
3. **Registras tu marca** en Amazon Brand Registry (opcional pero recomendado)
4. **Envías inventario** a Amazon FBA o gestionas envíos desde tu proveedor
5. **Cobras en USD** directamente en Mercury
6. **Transfieres beneficios** a tu cuenta personal vía Wise

## Sales Tax Nexus: lo que necesitas saber

El **nexus** es el concepto que determina si debes cobrar Sales Tax en un estado. Desde la sentencia *South Dakota v. Wayfair (2018)*, el nexus puede ser:

- **Physical nexus:** Tienes inventario, oficina o presencia física en un estado. Si usas Amazon FBA, tu inventario está en almacenes de Amazon en múltiples estados → tienes nexus en esos estados.
- **Economic nexus:** Superas un umbral de ventas en un estado (generalmente $100K en ventas o 200 transacciones/año).

**La buena noticia para vendedores FBA:** Amazon recauda y remite el Sales Tax automáticamente en la mayoría de los estados como "marketplace facilitator". Tú no tienes que hacer nada. Amazon se encarga.

**Para tu propia tienda Shopify:** Aquí sí debes configurar la recaudación de Sales Tax en los estados donde tengas nexus. Shopify tiene integraciones con herramientas como TaxJar o Avalara que lo automatizan.

## Inventario y logística: consideraciones prácticas

### Si haces Private Label (marca propia)
1. Fabricas en China, India o donde sea más competitivo
2. Tu proveedor envía directamente a los almacenes FBA de Amazon
3. Amazon almacena, empaqueta y envía
4. Tú te centras en marketing y optimización de listings

### Si haces Dropshipping
- No necesitas inventario
- El proveedor envía directamente al cliente final
- La LLC da credibilidad ante proveedores internacionales
- Menor riesgo de inventario, menor margen

### Si haces Print-on-Demand
- Printful, Printify o Teespring se integran con Shopify
- Sin inventario, sin riesgo
- Ideal para creadores de contenido que quieren merch

## Cuentas y herramientas esenciales para ecommerce

| Herramienta | Para qué | Coste |
|---|---|---|
| Mercury | Cuenta bancaria principal | Gratis ($0 wire fees) |
| Stripe/Shopify Payments | Procesamiento de pagos | 2.9% + $0.30 |
| Amazon Seller Central | Marketplace | $39.99/mes + referral fees |
| Jungle Scout / Helium 10 | Investigación de producto | $29-99/mes |
| Wise Business | Conversión de divisas | Tipo de cambio real (EMI) |

En Exentax hemos montado LLCs para vendedores de Amazon FBA, tiendas Shopify y negocios de dropshipping. Conocemos la operativa y las particularidades fiscales de cada modelo. Contacta con nuestro equipo y te decimos exactamente qué estructura necesitas para tu ecommerce.`,
    category: "Operativa",
    readTime: 5,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Amazon y ecommerce con LLC: vender online desde cualquier país | Exentax",
    metaDescription: "Vende en Amazon, Shopify y Etsy con tu LLC americana. Acceso sin restricciones, Amazon FBA, Shopify Payments y cómo empezar desde cualquier país.",
  },
  {
    slug: "gastos-deducibles-llc-que-puedes-deducir",
    title: "Gastos deducibles en tu LLC: qué puedes y qué no puedes deducir",
    excerpt: "No todos los gastos son deducibles en una LLC. Te explicamos cuáles sí, cuáles no, y cómo documentarlos correctamente para reducir tu base imponible.",
    content: `Una de las preguntas más frecuentes de los propietarios de LLCs es: "¿qué gastos puedo deducir?" La respuesta del IRS es clara: todo gasto que sea **ordinario y necesario** para tu negocio es deducible. Pero la línea entre lo deducible y lo personal no siempre es obvia.

## La regla de oro: ordinario y necesario

Para que un gasto sea deducible, debe cumplir dos condiciones:

- **Ordinario:** Es común y aceptado en tu industria
- **Necesario:** Es útil y apropiado para tu negocio (no tiene que ser indispensable)

Por ejemplo: un hosting web es un gasto ordinario y necesario para un diseñador web. Una cena en un restaurante puede ser deducible si es una reunión de negocios, pero no si es una cena personal.

## Gastos deducibles comunes en una LLC

Aquí es donde la cosa se pone interesante. La lista es mucho más amplia de lo que la mayoría cree. Vamos categoría por categoría:

### Tecnología y software
- **Hosting y servidores:** AWS, Vercel, DigitalOcean, Google Cloud, Heroku
- **Dominios y DNS:** Cloudflare, Namecheap, GoDaddy
- **Suscripciones SaaS:** Notion, Slack, Figma, Adobe Creative Cloud, Canva Pro, Miro, Trello, Asana, Linear, Monday.com
- **Herramientas de desarrollo:** GitHub Pro, GitLab, JetBrains, VS Code extensiones premium, APIs de terceros
- **Herramientas de IA:** ChatGPT Plus, Claude, Midjourney, Copilot
- **Almacenamiento cloud:** Google Workspace, Dropbox Business, iCloud+
- **VPN y seguridad:** NordVPN, 1Password, LastPass
- **Comunicaciones:** Zoom Pro, Google Meet, Loom, Calendly

### Hardware y equipamiento
- **Ordenador:** portátil o de escritorio (si se usa para el negocio)
- **Monitor(es):** pantallas externas
- **Periféricos:** teclado, ratón, trackpad, hub USB, dock station
- **Audio/vídeo:** auriculares, micrófono, cámara web, ring light
- **Tablet:** iPad o similar si se usa para trabajo
- **Teléfono móvil:** porcentaje de uso profesional
- **Impresora y escáner**
- **Discos duros externos y almacenamiento**

### Servicios profesionales
- **Contabilidad y preparación de impuestos** (como los servicios de Exentax)
- **Servicios legales:** abogados, contratos, propiedad intelectual
- **Consultoría de negocio:** mentores, coaches, asesores estratégicos
- **Registered Agent:** tu agente registrado en EE.UU.
- **Diseño y branding:** logo, identidad visual, diseño web
- **Traducción y copywriting**

### Marketing y ventas
- **Publicidad online:** Google Ads, Facebook Ads, Instagram Ads, LinkedIn Ads, TikTok Ads, Twitter/X Ads
- **SEO y contenido:** herramientas SEO (Ahrefs, SEMrush, Surfer), redacción de contenido
- **Email marketing:** Mailchimp, ConvertKit, Beehiiv, Resend, Brevo
- **Redes sociales:** herramientas de gestión (Buffer, Hootsuite, Later)
- **CRM:** HubSpot, Pipedrive, Close
- **Landing pages:** Framer, Webflow, Carrd
- **Relaciones públicas y prensa**

### Oficina y espacio de trabajo
- **Coworking:** membresías mensuales o pases por día (WeWork, espacios locales)
- **Alquiler de oficina:** si tienes un espacio dedicado
- **Material de oficina:** papelería, tinta, carpetas, organizadores
- **Mobiliario:** escritorio, silla ergonómica, estantería (si es para el espacio de trabajo)
- **Café y bebidas:** si tu coworking las incluye como servicio

### Home office (oficina en casa)
Si trabajas desde casa, puedes deducir la parte proporcional de los gastos de tu vivienda que corresponde al espacio de trabajo. Esto incluye:
- **Alquiler:** proporción del espacio dedicado a trabajo (ej: si tu oficina ocupa el 20% de tu vivienda, deduces el 20% del alquiler)
- **Internet:** porcentaje de uso profesional
- **Electricidad:** porcentaje de uso profesional
- **Teléfono:** porcentaje de uso profesional
- **Seguro del hogar:** parte proporcional
- **Agua, gas, calefacción:** parte proporcional

En Exentax te ayudamos a calcular el porcentaje correcto y a documentarlo para que la deducción sea sólida.

### Formación y desarrollo profesional
- **Cursos online:** Udemy, Coursera, Platzi, Domestika, cursos especializados de tu sector
- **Libros profesionales:** técnicos, de negocio, de marketing (sí, los libros de Amazon también)
- **Conferencias y eventos:** entradas, inscripciones, meetups profesionales
- **Certificaciones profesionales:** AWS, Google, HubSpot, etc.
- **Coaching y mentoría:** sesiones con mentores de tu industria

### Viajes de negocio
- **Billetes de avión:** para reuniones con clientes, conferencias, eventos del sector
- **Alojamiento:** hoteles, Airbnb durante viajes de trabajo
- **Transporte local:** Uber, taxis, alquiler de coches durante viajes de negocio
- **Comidas de negocio:** con clientes, socios o en conferencias (50% deducible generalmente)
- **Visas y trámites de viaje:** si el viaje es por negocio
- **Seguro de viaje:** pólizas para viajes de trabajo

### Comisiones, fees y costes financieros
- **Comisiones de Stripe:** por cada transacción procesada
- **Comisiones de PayPal:** fees de recepción de pagos
- **Comisiones de otros procesadores:** Dodo Payments, etc.
- **Fees bancarias:** aunque Mercury tiene $0 en casi todo, otros servicios pueden tener costes
- **Comisiones de Wise:** por conversión de divisas
- **Fees del estado:** Annual Report, Franchise Tax (Delaware)
- **Fees de constitución:** el coste de crear tu LLC es deducible

### Seguros
- **Seguro de responsabilidad civil profesional** (Errors & Omissions)
- **Seguro médico:** si lo contratas a través de la LLC
- **Seguro de equipos:** para proteger tu hardware

### Suscripciones y membresías profesionales
- **Asociaciones profesionales:** membresías de tu industria
- **Plataformas de networking:** LinkedIn Premium, comunidades de pago
- **Bases de datos y recursos:** acceso a bibliotecas profesionales, APIs, datasets

## Gastos NO deducibles

Aquí la línea es clara:

- **Gastos personales**: ropa (a menos que sea uniforme de trabajo), comida diaria, entretenimiento personal, Netflix, Spotify personal
- **Multas y sanciones**: multas de tráfico, sanciones del IRS
- **Contribuciones políticas**
- **Gastos suntuarios** sin justificación de negocio, ese reloj de lujo no es un "gasto de representación"
- **Retiros personales** (Owner's Draws), no son gastos, son distribuciones de beneficios
- **Ropa personal**: tu ropa del día a día no es deducible aunque la uses para trabajar

## Cómo documentar tus gastos

Para que un gasto sea deducible, necesitas prueba de tres cosas:

1. **Se pagó con fondos de la LLC**: desde la cuenta bancaria o tarjeta de la LLC (<a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a>, Relay). Es fundamental <a href="/es/blog/separar-dinero-personal-llc-por-que-importa">separar el dinero personal del de la LLC</a>
2. **Tiene una factura o recibo**: que muestre el concepto, fecha y monto
3. **Es del negocio**: puedes justificar su relación con la actividad de la LLC

Guarda todos los recibos y facturas. Usa herramientas como QuickBooks, Xero o incluso una carpeta organizada en Google Drive. La clave es la consistencia: si lo haces desde el primer día, nunca es un problema.

## El impacto real en tu bolsillo

Un freelancer típico con una LLC suele tener entre **$5,000 y $20,000** en gastos deducibles al año. Eso puede reducir tu base imponible en tu país de residencia de forma significativa.

Ejemplo práctico: si facturas $60,000/año y tienes $15,000 en gastos deducibles, solo declaras $45,000 de beneficio en tu país. Si tu tipo efectivo es del 20%, eso son **$3,000 menos de impuestos** solo por documentar correctamente tus gastos. Cada factura de software, cada curso, cada membresía de coworking te está ahorrando dinero.

## En Exentax te ayudamos con esto

Parte de nuestro servicio de mantenimiento incluye orientación sobre qué gastos puedes deducir y cómo documentarlos correctamente. No te dejamos solo con una lista, te acompañamos para que maximices tus deducciones sin problemas.

¿Quieres saber cuánto puedes deducir en tu caso? Agenda tu asesoría gratuita y lo calculamos juntos.`,
    category: "Fiscalidad",
    readTime: 8,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Gastos deducibles en tu LLC: qué puedes deducir | Exentax",
    metaDescription: "Guía completa de gastos deducibles en tu LLC americana: tecnología, servicios profesionales, marketing, viajes, formación. Qué sí y qué no puedes deducir.",
  },
  {
    slug: "residentes-no-residentes-llc-diferencias",
    title: "LLC para residentes y no residentes de EE.UU.: diferencias clave",
    excerpt: "La fiscalidad de tu LLC cambia completamente según seas residente o no residente de Estados Unidos. Te explicamos las diferencias clave que debes conocer.",
    content: `No es lo mismo tener una LLC siendo residente de Estados Unidos que siendo no residente. La estructura legal es la misma, pero la **fiscalidad y las obligaciones** cambian radicalmente.

## ¿Quién es residente fiscal de EE.UU.?

Para el IRS, eres residente fiscal si cumples alguna de estas condiciones:

- **Eres ciudadano estadounidense** (incluidos los que viven en el extranjero)
- **Tienes Green Card** (tarjeta de residencia permanente)
- **Pasas la prueba de presencia sustancial** (más de 183 días en EE.UU. en ciertos periodos)

Si no cumples ninguna, eres **no residente** para el IRS, y eso cambia todo.

## Diferencias fiscales clave

### Single-Member LLC de residente
- La LLC es una **Disregarded Entity**: los ingresos se reportan en tu declaración personal
- Pagas **impuesto sobre la renta** en EE.UU. por los beneficios de la LLC
- Pagas **Self-Employment Tax** (15.3%). Seguridad Social y Medicare
- Presentas el **Schedule C** junto con tu Form 1040
- Tasa efectiva total: puede superar el **30-40%** dependiendo del ingreso

### Single-Member LLC de no residente
- La LLC es una **Disregarded Entity**: pero el IRS la trata diferente para no residentes
- **No pagas impuesto federal** en EE.UU. si los ingresos provienen de fuera del país
- **No pagas Self-Employment Tax**
- Presentas el **Form 5472 + Form 1120 pro-forma** (informativo)
- Tasa efectiva en EE.UU.: **0%** (tributas en tu país de residencia fiscal)

## ¿Por qué una LLC es tan ventajosa para no residentes?

La combinación de:
- **0% de impuesto federal** en EE.UU. (para ingresos de fuente extranjera, gracias a la <a href="/es/blog/tributacion-pass-through-llc-como-funciona">tributación pass-through</a>)
- **Acceso a <a href="/es/blog/bancos-vs-fintech-llc-donde-abrir-cuenta">banca y pasarelas de pago</a>** americanas
- **Protección patrimonial** completa
- **Optimización fiscal** en tu país de residencia (según la <a href="/es/blog/fiscalidad-llc-por-pais-residencia">fiscalidad de tu país</a>)

Es lo que convierte a la LLC en una herramienta tan poderosa para freelancers y emprendedores digitales.

## Obligaciones comparadas

| Obligación | Residente | No residente |
|---|---|---|
| Impuesto federal US | Sí (10-37%) | No (0%) |
| Self-Employment Tax | Sí (15.3%) | No |
| Form 1040 + Schedule C | Sí | No |
| Form 5472 + 1120 | No | Sí (informativo) |
| FBAR | Si aplica | Si aplica |
| BOI Report | Sí | Sí |
| Impuestos en país de residencia | N/A | Sí |

## ¿Qué pasa si cambio de residencia?

Si eres no residente y te mudas a EE.UU. (obtienes Green Card o cumples la prueba de presencia sustancial), tu estatus fiscal cambia. Pasas a tributar como residente, con todas las implicaciones:

- Empiezas a pagar impuestos federales y estatales
- Debes pagar Self-Employment Tax
- Cambias de Form 5472 a Schedule C

Lo inverso también aplica: si eres residente y dejas EE.UU. (devuelves la Green Card y dejas de cumplir la prueba de presencia), pasas a ser no residente.

## Ejemplos prácticos: la diferencia en números

### María. Desarrolladora web en España (no residente de EE.UU.)
- Factura 80.000€/año a clientes en EE.UU. y Europa
- **Sin LLC:** IRPF progresivo ~33% + cuota autónomos = ~30.000€ en impuestos
- **Con LLC:** $0 federal en EE.UU. + tributación optimizada en país de residencia = ~8.000-10.000€
- **Ahorro anual: ~20.000€**

### Carlos. Consultor de marketing en México (no residente de EE.UU.)
- Factura $60,000/año a startups americanas
- **Sin LLC:** ISR México ~30% = ~$18,000
- **Con LLC:** $0 federal + estructura optimizada en México = ~$5,000-7,000
- **Ahorro anual: ~$11,000-13,000**

### Andrea. Diseñadora UX en Colombia (no residente de EE.UU.)
- Factura $45,000/año a agencias internacionales
- **Sin LLC:** Renta Colombia ~25% = ~$11,250
- **Con LLC:** $0 federal + optimización Colombia = ~$3,500-5,000
- **Ahorro anual: ~$6,000-8,000**

La clave en todos estos casos: **ninguno tiene ingresos de fuente estadounidense**. Trabajan desde sus países para clientes globales. La LLC paga $0 en EE.UU. y los beneficios se declaran con la base imponible ya optimizada.

## ¿Puedo tener una LLC sin vivir en EE.UU.?

**Absolutamente.** De hecho, es para lo que están diseñadas. No necesitas:
- Visa ni permiso de trabajo
- Número de Seguro Social (SSN)
- Dirección física en EE.UU.
- Viajar a Estados Unidos
- Hablar inglés (para eso estamos nosotros)

Todo el proceso de constitución y operativa se hace 100% online desde cualquier país del mundo. En Exentax lo gestionamos todo por ti, desde la constitución hasta el compliance anual. Tú te dedicas a facturar y nosotros a que todo esté perfecto con el IRS. Agenda tu asesoría gratuita y te decimos exactamente qué estructura encaja con tu situación.`,
    category: "Fiscalidad",
    readTime: 5,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "LLC para residentes y no residentes: diferencias fiscales | Exentax",
    metaDescription: "Las diferencias fiscales entre tener una LLC como residente y no residente de EE.UU. Impuestos, obligaciones y por qué la LLC es tan ventajosa para extranjeros.",
  },
  {
    slug: "cambiar-divisas-llc-mejores-opciones",
    title: "Cómo cambiar divisas en tu LLC: las mejores opciones",
    excerpt: "Si cobras en dólares y tus gastos son en euros o pesos, necesitas cambiar divisas. Comparamos Wise, Mercury, bancos tradicionales y otras opciones.",
    content: `Si operas una LLC en Estados Unidos y vives en España, México, Colombia o cualquier otro país fuera de EE.UU., el cambio de divisas es una parte esencial de tu día a día financiero. Cobras en dólares, pero tus gastos personales son en euros, pesos u otra moneda local.

La forma en que conviertes esas divisas puede costarte cientos o miles de dólares al año, o prácticamente nada, si usas las herramientas correctas. Si aún no tienes claro qué plataformas usar, consulta nuestra comparativa de <a href="/es/blog/bancos-vs-fintech-llc-donde-abrir-cuenta">bancos vs fintech para tu LLC</a>.

## El problema con los bancos tradicionales

Cuando tu banco local recibe una transferencia en dólares, la convierte a tu moneda local aplicando:

- Un **tipo de cambio con margen** (1-3% peor que el tipo real)
- **Comisiones de recepción** ($15-50 por transferencia SWIFT)
- **Comisiones del banco intermediario** ($10-25 adicionales)

En total, puedes perder **3-5% en cada transferencia**. Si mueves $5,000 al mes, eso son $150-250 al mes en costes ocultos, más de **$2,000 al año**.

## Las mejores opciones para cambiar divisas

### 1. Wise Business (la favorita)

Wise ofrece el tipo de cambio real (mid-market rate) más una comisión transparente y baja.

- **Comisión:** 0.4-1.5% según el par de divisas
- **Tipo de cambio:** Real, sin margen oculto
- **Velocidad:** 1-2 días hábiles
- **Ventaja:** Ves exactamente cuánto recibes antes de enviar

### 2. Mercury (directo desde tu cuenta)

Mercury permite enviar wires internacionales con $0 de comisión, sí, gratis. Pero si la transferencia implica conversión de divisa, el tipo de cambio no es tan competitivo como Wise.

- **Comisión wire:** $0 (envío y recepción, nacionales e internacionales)
- **Tipo de cambio:** Con margen si conviertes divisa (menor que bancos tradicionales)
- **Velocidad:** 1-5 días hábiles
- **Mejor para:** Transferencias en USD sin conversión, o transferencias grandes y puntuales

### 3. Airwallex

Airwallex es una plataforma global de pagos que permite abrir cuentas multi-divisa y recibir pagos en monedas locales de más de 60 países.

- **Comisión de conversión:** Competitiva, con margen bajo sobre el tipo interbancario
- **Velocidad:** 1-2 días hábiles
- **Ventaja:** Cuentas locales en múltiples países, tus clientes te pagan como si fueras local

### 4. Sokin

Sokin se especializa en pagos internacionales con tarifas planas, lo que puede resultar más económico para volúmenes altos.

- **Tarifa plana:** Sin comisiones porcentuales en muchas rutas
- **Ideal para:** Negocios con transferencias frecuentes y montos consistentes

### 5. Tarjeta Wise o Wallester

Si necesitas gastar en moneda local sin convertir manualmente, las tarjetas de débito con conversión automática son una opción excelente.

- **Wise Card:** Convierte al tipo de cambio real cuando pagas. Sin sorpresas.
- **Wallester:** Tarjetas virtuales y físicas vinculadas a cuentas multi-divisa. Muy popular entre emprendedores europeos por sus integraciones.

### 6. PayPal (evitar para conversiones)

PayPal aplica un margen del 3-4% sobre el tipo de cambio. Es la peor opción para convertir divisas. Si recibes pagos en PayPal, transfiere los dólares a Mercury primero y convierte desde Wise.

## Flujo recomendado

El flujo más eficiente para la mayoría de los propietarios de LLCs:

1. **Cobras en USD** → Mercury (cuenta de la LLC)
2. **Transfieres USD a Wise** → ACH gratis de Mercury a Wise
3. **Conviertes en Wise** → al tipo de cambio real
4. **Envías a tu cuenta local** → SEPA (Europa) o transferencia local

Este flujo minimiza las comisiones y maximiza el tipo de cambio.

## Comparativa rápida

| Método | Tipo de cambio | Comisión | Coste total estimado |
|---|---|---|---|
| Wise Business | Real | 0.4-1.5% | 0.4-1.5% |
| Mercury wire | Con margen (si convierte) | $0 wire fee | 0-1.5% |
| Banco tradicional | Con margen | $15-50 + intermediarios | 3-5% |
| PayPal conversión | Con margen 3-4% | Variable | 4-6% |

## Tips para ahorrar en cambio de divisas

- **Consolida tus retiros**: haz una o dos transferencias grandes al mes en lugar de muchas pequeñas
- **Usa Wise siempre que puedas**: el tipo de cambio es significativamente mejor
- **Evita conversiones de PayPal**: saca el dinero en dólares y convierte en Wise
- **Compara antes de enviar**: las comisiones varían según el monto y la divisa

Si quieres optimizar la forma en que mueves dinero entre tu LLC y tu cuenta personal, agenda una asesoría gratuita. Te ayudamos a configurar el flujo más eficiente para tu caso.

Quieres optimizar tus conversiones de divisas y pagar menos en comisiones? Solicita una consulta y te recomendamos la mejor combinación para tu caso.`,
    category: "Operativa",
    readTime: 5,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Cambiar divisas en tu LLC: Wise, Mercury y mejores opciones | Exentax",
    metaDescription: "Compara Wise, Mercury, bancos tradicionales y PayPal para cambiar divisas en tu LLC. Cómo ahorrar hasta 3-5% en cada conversión de moneda.",
  },
  {
    slug: "constituir-llc-proceso-paso-a-paso",
    title: "Constituir tu LLC: el proceso paso a paso",
    excerpt: "Desde elegir el estado hasta operar tu negocio. El proceso completo de constitución de una LLC americana para no residentes, explicado paso a paso.",
    content: `Constituir una LLC en Estados Unidos siendo no residente es un proceso 100% online que se puede completar en pocos días. No necesitas viajar, no necesitas visa, y no necesitas un abogado en EE.UU.

Aquí te explicamos el proceso paso a paso, para que entiendas exactamente qué implica.

## Paso 1: Elegir el estado

El primer paso es decidir en qué estado constituir tu LLC. Los tres más populares para no residentes:

- **Nuevo México**: El más económico. Sin Annual Report ni tasas anuales
- **Wyoming**: Máxima privacidad. Datos de miembros no son públicos
- **Delaware**: Mejor marco legal. Recomendado si buscas inversores

La mayoría de freelancers y emprendedores digitales eligen **Nuevo México** por su simplicidad y bajo coste, o **Wyoming** por su privacidad.

## Paso 2: Elegir el nombre de la LLC

Tu LLC necesita un nombre único que no esté registrado en el estado. El nombre debe incluir "LLC" o "Limited Liability Company".

Ejemplo: **"MiEmpresa Digital LLC"**

Puedes verificar la disponibilidad del nombre en la web del Secretary of State del estado elegido.

## Paso 3: Designar un Registered Agent

Todo LLC necesita un <a href="/es/blog/registered-agent-que-es-por-que-necesitas">Registered Agent</a>, una persona o empresa con dirección física en el estado que recibe documentos legales en nombre de tu LLC.

Como no residente, contratas un servicio de Registered Agent profesional. Este servicio está incluido en los planes de constitución de Exentax.

## Paso 4: Presentar los Articles of Organization

Este es el documento oficial que crea tu LLC. Se presenta ante el Secretary of State del estado e incluye:

- Nombre de la LLC
- Dirección del Registered Agent
- Tipo de gestión (Member-Managed o Manager-Managed)
- Nombre del organizador

El tiempo de procesamiento varía:
- **Nuevo México:** 1-2 días hábiles
- **Wyoming:** 1-3 días hábiles
- **Delaware:** 1-3 días hábiles

## Paso 5: Obtener el EIN

Una vez constituida la LLC, necesitas el **EIN** (Employer Identification Number), el número fiscal de tu empresa ante el IRS.

El proceso de solicitud del EIN para no residentes se hace por fax o correo al IRS. El tiempo de respuesta es de **2-8 semanas**.

## Paso 6: Redactar el Operating Agreement

El documento interno que define las reglas de tu LLC. Lee nuestra <a href="/es/blog/operating-agreement-llc-que-es">guía completa sobre el Operating Agreement</a>. Aunque en la mayoría de estados no se presenta ante ninguna autoridad, es imprescindible para abrir cuentas bancarias y verificar tu LLC en plataformas de pago.

## Paso 7: Presentar el BOI Report

Desde 2024, todas las LLCs deben reportar sus propietarios reales ante FinCEN. Tienes **90 días** desde la constitución para presentar este informe.

## Paso 8: Abrir la cuenta bancaria

Con los documentos en mano (Articles of Organization, EIN, Operating Agreement), puedes abrir tu cuenta bancaria en EE.UU. Las opciones más populares:

- **Mercury**: La opción preferida para LLCs de no residentes
- **Relay**: Alternativa con múltiples subcuentas

El proceso es 100% online y suele tardar 1-5 días hábiles.

## Paso 9: Configurar pasarelas de pago

Con tu LLC y cuenta bancaria activas, puedes registrarte en Stripe, PayPal y otras pasarelas para empezar a cobrar.

## Paso 10: Empezar a operar

Tu LLC está lista. Ahora puedes facturar a clientes, recibir pagos y operar tu negocio desde cualquier parte del mundo.

## ¿Cuánto tiempo tarda todo el proceso?

| Paso | Tiempo estimado |
|---|---|
| Constitución (Articles) | 1-3 días |
| EIN | 2-8 semanas |
| BOI Report | 1 día |
| Cuenta bancaria | 1-5 días |
| Pasarelas de pago | 1-5 días |
| **Total** | **3-10 semanas** |

El cuello de botella es el EIN, el IRS puede tardar varias semanas para no residentes.

## ¿Puedo hacerlo solo?

Técnicamente sí. Pero seamos sinceros: ¿quieres dedicar semanas a navegar formularios en inglés, llamar al IRS (con su horario americano y sus 45 minutos de espera), rezar para que Mercury no te rechace la cuenta por un dato mal puesto, y descubrir a posteriori que tu Operating Agreement genérico no sirve?

Los errores más comunes cuando la gente lo hace sola:
- Nombre de la LLC con caracteres que el estado rechaza
- EIN solicitado con el formulario equivocado (SS-4 vs W-7)
- Operating Agreement descargado de internet que no cumple los requisitos de Mercury
- BOI Report presentado fuera de plazo
- Cuenta bancaria rechazada por documentación inconsistente

Cada error te cuesta semanas de retraso y, en algunos casos, dinero.

## Con Exentax, tú no haces nada (literalmente)

En Exentax nos encargamos de todo el proceso de constitución de principio a fin. Tú nos das tu pasaporte, nos dices cómo quieres que se llame tu LLC, y nosotros hacemos el resto:

1. **Elegimos el estado óptimo** contigo en la asesoría inicial
2. **Registramos los Articles of Organization**: normalmente en 1-3 días
3. **Solicitamos el EIN** al IRS, nos encargamos de toda la comunicación
4. **Redactamos tu Operating Agreement**: personalizado, no un template genérico
5. **Presentamos el BOI Report** ante FinCEN, ni te enteras
6. **Abrimos tu cuenta bancaria** en Mercury, con toda la documentación perfecta
7. **Te dejamos operativo**: listo para facturar, cobrar y empezar a trabajar

El proceso completo: entre 3 y 10 semanas (el cuello de botella es el EIN del IRS, no nosotros). Y durante todo ese tiempo, tienes soporte directo con nuestro equipo.

Agenda tu asesoría gratuita y en 30 minutos te explicamos todo el proceso para tu caso concreto.`,
    category: "Guías",
    readTime: 6,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Constituir una LLC paso a paso: guía completa | Exentax",
    metaDescription: "El proceso completo para constituir una LLC americana como no residente: elegir estado, nombre, Registered Agent, EIN, cuenta bancaria. Paso a paso.",
  },
  {
    slug: "autonomos-espana-por-que-dejar-de-serlo",
    title: "Por qué dejar de ser autónomo en España (y qué alternativas tienes)",
    excerpt: "Si eres autónomo en España y facturas a clientes internacionales, estás pagando de más. Hasta un 47% entre IRPF y cuotas. Hay alternativas legales que deberías conocer.",
    content: `Vamos a ser directos: si eres autónomo en España y la mayoría de tus ingresos vienen de fuera, clientes en EE.UU., UK, Alemania o cualquier otro país, probablemente estás pagando mucho más de lo necesario. Y no poco.

El sistema de autónomos en España fue diseñado para un panadero de barrio, no para un diseñador UX que trabaja con startups de San Francisco. Y sin embargo, miles de freelancers digitales siguen pagándolo todo como si vendieran pan.

## Las cuentas del autónomo en España

Hagamos números reales. Supongamos que facturas 5.000€ al mes (60.000€ al año):

- **Cuota de autónomos:** ~300€/mes (~3.600€/año con la base mínima nueva)
- **IRPF:** Entre el 24% y el 37% sobre tu beneficio neto
- **IVA:** 21% que cobras y luego ingresas (pero te genera burocracia trimestral)

El resultado: de esos 60.000€, te pueden quedar entre **32.000€ y 38.000€** después de impuestos. Casi la mitad se va.

Y lo peor no es cuánto pagas, es que no tienes por qué pagar tanto.

## ¿Por qué el modelo de autónomo no funciona para freelancers digitales?

- **La cuota es fija**: pagas aunque no factures. Y con el nuevo sistema de cotización por ingresos, la cuota sube cuando te va bien. Premiando la mediocridad
- **El IRPF es progresivo y despiadado**: a partir de 35.000€ ya estás en el tramo del 37%. A partir de 60.000€, llegas al 45%
- **Pagos fraccionados**: cada trimestre pagas un 20% de tu beneficio estimado. Adelantas dinero a las autoridades fiscales antes de saber si realmente lo has ganado
- **IVA en operaciones internacionales**: un laberinto burocrático. ¿Inversión del sujeto pasivo? ¿Modelo 349? ¿OSS? La mayoría lo hace mal
- **Cero protección patrimonial**: si tu negocio tiene un problema legal, responden tus bienes personales. Tu casa, tus ahorros, todo

## ¿Cuál es la alternativa?

Una **LLC en Estados Unidos** no es la única alternativa, pero para freelancers digitales con clientes internacionales es la más eficiente:

- **0% de impuesto federal en EE.UU.** (como Disregarded Entity con propietario no residente)
- **Tributas en tu país de residencia solo por los beneficios netos que te transfieres** (con la estructura correcta)
- **Acceso a banca y pasarelas de pago americanas** (Mercury, Stripe, PayPal US)
- **Protección patrimonial completa**: tus bienes personales están separados
- **Sin cuota fija mensual**: no hay equivalente a la cuota de autónomos

## "¿Pero eso es legal?"

Sí. Totalmente. Una LLC americana es una estructura empresarial reconocida internacionalmente. No es una offshore opaca en las Islas Caimán, es una empresa registrada en un estado de EE.UU., con EIN (número fiscal), Registered Agent, y declaraciones anuales al IRS.

Lo que importa es que la estructura esté bien montada y que cumplas con tus obligaciones fiscales en España. Ahí es donde entra la diferencia entre hacerlo bien y hacerlo mal.

## ¿Tengo que darme de baja como autónomo?

Depende de tu situación. Hay casos donde conviene mantener el alta de autónomos en España y operar la LLC en paralelo. En otros, puede tener sentido darse de baja. No hay una respuesta universal, depende de:

- Tu volumen de facturación
- El porcentaje de clientes internacionales vs nacionales
- Tu situación personal (cotizaciones acumuladas, prestaciones, etc.)
- Si planeas un cambio de residencia fiscal a medio plazo

## El coste real de no hacer nada

Cada año que sigues como autónomo sin optimizar tu estructura, dejas sobre la mesa entre **8.000€ y 20.000€** que podrías estar ahorrando legalmente. En cinco años, eso son 40.000-100.000€.

## ¿Cómo funciona exactamente el ahorro con una LLC?

Vamos a ponerlo en cristiano con un ejemplo detallado:

### Pass-through taxation: la clave de todo

Tu LLC como Disregarded Entity de no residente funciona con **pass-through taxation**. Esto significa:

1. **La LLC cobra a tus clientes internacionales**: en dólares, por Stripe, wire o ACH
2. **La LLC paga sus gastos operativos**: software, herramientas, servicios, suscripciones
3. **La LLC paga $0 de impuesto federal en EE.UU.**: cero, nada, zilch
4. **Tú recibes los beneficios netos**: mediante Owner's Draws a tu cuenta personal
5. **Declaras en tu país de residencia** solo los beneficios netos, sobre una base imponible significativamente reducida

### Los gastos deducibles que como autónomo ni sueñas

Con una LLC, puedes deducir como gastos operativos todo lo que sea "ordinario y necesario" para tu negocio:

- **Todo tu stack tecnológico**: hosting, dominios, APIs, SaaS, herramientas de IA
- **Hardware**: ordenador, monitor, auriculares, micrófono, cámara
- **Formación**: cursos, bootcamps, conferencias, libros técnicos
- **Viajes de negocio**: vuelos, hoteles, dietas (para reuniones con clientes, eventos del sector)
- **Coworking o home office**: porcentaje de tu alquiler si trabajas desde casa
- **Comunicaciones**: internet, teléfono, VPN
- **Servicios profesionales**: contabilidad, asesoría fiscal, seguros
- **Comisiones bancarias**: aunque con Mercury son $0 en wires, así que poco que deducir ahí

### Ejemplo con números reales

**Ingresos brutos:** 72.000€/año
**Gastos deducibles LLC:** 18.000€/año (software, hardware, formación, viajes, servicios)
**Beneficio neto (pass-through):** 54.000€/año
**Carga fiscal en país de residencia sobre 54.000€:** ~12.000€ (tipo efectivo ~22%)

**Total pagado:** 12.000€ + 1.500€ (LLC) = **13.500€ → 18.8% efectivo**

**Como autónomo:** 72.000€ - gastos limitados = base ~62.000€
**IRPF ~35%:** ~21.700€ + cuota autónomos 3.600€ = **25.300€ → 35.1% efectivo**

**Diferencia:** 11.800€/año más en tu bolsillo. Cada año. Y la diferencia crece cuanto más facturas.

## La cuota de autónomos: el impuesto más absurdo de España

Merece su propio rant: la cuota de autónomos es un impuesto fijo que pagas **tanto si facturas como si no**. Con el nuevo sistema de cotización por ingresos (2023), la cuota sube cuando te va bien. Es el único sistema fiscal del mundo que te castiga por tener éxito.

Con una LLC, no existe equivalente. No hay cuota fija mensual. Tus costes son:
- Mantenimiento anual de la LLC (precio fijo, todo incluido)
- Los impuestos que correspondan en tu país de residencia (sobre beneficios netos, no sobre ingresos brutos)

No te decimos que ser autónomo esté mal. Te decimos que, si tu perfil es digital y tus clientes son internacionales, hay opciones mucho mejores. Y que cada mes que sigues pagando de más por inercia, es dinero que no recuperas.

En Exentax analizamos tu caso concreto en una asesoría gratuita de 30 minutos. Te ponemos los números delante: cuánto pagas hoy, cuánto pagarías con LLC, y cuánto te ahorras al año. Sin compromiso, sin presión, sin "resultados orientativos". Números reales con tu facturación real.

Estás pensando en dar el paso y dejar de ser autónomo? Reserva tu consulta gratuita y te mostramos exactamente cuánto puedes ahorrar con una LLC americana.`,
    category: "Fiscalidad",
    readTime: 7,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Por qué dejar de ser autónomo en España: alternativas legales | Exentax",
    metaDescription: "Si eres autónomo en España y facturas al extranjero, puedes estar pagando hasta un 47%. Hay alternativas legales como la LLC. Te explicamos las opciones.",
  },
  {
    slug: "bancos-vs-fintech-llc-donde-abrir-cuenta",
    title: "Bancos vs Fintech: dónde abrir la cuenta de tu LLC",
    excerpt: "Mercury, Relay, Wise, Revolut Business... ¿Son bancos? ¿Son seguros? Te explicamos la diferencia entre un banco y una fintech, y cuál conviene para tu LLC.",
    content: `Cuando abres tu LLC, una de las primeras decisiones es dónde abrir la cuenta bancaria. Y aquí es donde empieza la confusión: Mercury no es un banco. Wise tampoco. Relay tampoco. Pero todos te ofrecen una cuenta, una tarjeta y un routing number.

¿Entonces qué son? ¿Es seguro? ¿Dónde está tu dinero realmente?

Vamos a aclararlo de forma simple.

## ¿Qué es un banco?

Un banco es una institución financiera regulada que tiene licencia bancaria propia. En Estados Unidos, los bancos están regulados a nivel federal (por la OCC o la FDIC) y/o a nivel estatal. Ejemplos: Chase, Bank of America, Wells Fargo.

Los bancos pueden:
- **Captar depósitos** directamente
- **Conceder préstamos** con esos depósitos
- **Asegurar tu dinero** directamente a través del FDIC

## ¿Qué es una fintech?

Una fintech (financial technology) es una empresa de tecnología que ofrece servicios financieros. No tiene licencia bancaria propia, trabaja **a través de un banco partner** que sí la tiene.

- **Mercury** → Money Transmitter que opera a través de **Column NA**, un banco con licencia federal y cobertura FDIC
- **Relay** → Fintech que opera a través de **Thread Bank**, también con FDIC
- **Wise** → Es una EMI (Institución de Dinero Electrónico), no un banco. En EE.UU. opera como Money Transmitter
- **Revolut Business US** → EMI que trabaja con bancos partner para cobertura FDIC
- **Airwallex** → Plataforma global de pagos con cuentas multi-divisa
- **Lili** → Neobanco para freelancers con contabilidad integrada
- **Sokin** → Especializada en pagos internacionales con tarifas planas
- **Wallester** → Emisor de tarjetas corporativas europeo con buenas integraciones

## ¿Es seguro usar una fintech?

Sí, con matices:

- **Tu dinero en Mercury está asegurado por el FDIC** hasta $250,000 a través de Column NA. Mercury incluso ofrece cobertura extendida de hasta $5 millones a través de su programa de barrido entre múltiples bancos
- **Tu dinero en Relay está asegurado por el FDIC** a través de Thread Bank
- **Wise** no tiene seguro FDIC, es una EMI que usa safeguarding (separación de fondos del cliente). Seguro, pero diferente
- **Revolut Business** tiene seguro FDIC a través de su banco partner

La clave: pregunta siempre **quién es el banco subyacente** y si hay cobertura FDIC.

## ¿Qué es el FDIC?

El **FDIC** (Federal Deposit Insurance Corporation) es la agencia del gobierno de EE.UU. que asegura los depósitos bancarios. Si tu banco quiebra, el FDIC te devuelve tu dinero hasta **$250,000 por depositante, por banco**.

Es el equivalente al Fondo de Garantía de Depósitos de España (100.000€) o al IPAB de México.

## ¿Por qué las fintechs son mejores para LLCs de no residentes?

Los bancos tradicionales americanos (Chase, BofA, Wells Fargo) generalmente **no abren cuentas a no residentes** sin presencia física en EE.UU. Necesitas acudir a una sucursal con visa, pasaporte, y a veces un SSN.

Las fintechs resolvieron este problema. Mercury, Relay y Wise permiten abrir cuentas **100% online** desde cualquier país, solo con:

- Articles of Organization
- EIN
- Operating Agreement
- Pasaporte del propietario

## Comparativa para tu LLC

| Característica | Mercury | Relay | Wise Business | Revolut Business |
|---|---|---|---|---|
| Tipo | Money Transmitter | Fintech | EMI | EMI |
| Banco subyacente | Column NA | Thread Bank | N/A (safeguarding) | Banco partner |
| FDIC | Sí (hasta $5M) | Sí ($250K) | No | Sí ($250K) |
| Apertura remota | Sí | Sí | Sí | Sí |
| Tarjeta | Virtual + física | Virtual + física | Virtual + física | Virtual + física |
| Multi-divisa | No (solo USD) | No (solo USD) | Sí (40+) | Sí (30+) |
| ACH gratis | Sí | Sí | Sí | Sí |
| Wires envío | $0 | $0 doméstico | N/A | Limitado |
| Wires recepción | $0 | $0 doméstico | N/A | Limitado |

## El error de intentar abrir cuenta en un banco tradicional

Vemos esto constantemente: freelancers que pierden semanas intentando abrir cuenta en Chase o Bank of America. El resultado suele ser:

1. Viajan a una sucursal en EE.UU. (o piden a alguien que vaya)
2. El banquero no sabe qué hacer con una LLC de un no residente
3. Les piden un SSN (que no tienen) o documentación que no aplica
4. Después de semanas, les dicen que no pueden abrir la cuenta

Los bancos tradicionales americanos están pensados para residentes. Su infraestructura, sus formularios, sus procesos de compliance, todo está diseñado para alguien con dirección en EE.UU. y SSN. No es que te rechacen por ser extranjero, es que su sistema no está preparado para gestionarte.

Las fintechs nacieron para resolver exactamente este problema.

## Lo que mucha gente no entiende sobre Wise

Wise es una herramienta excelente, pero hay que entender qué es y qué no es:

- **No es un banco.** Es una EMI (Institución de Dinero Electrónico). No tiene licencia bancaria ni seguro FDIC.
- **No debería ser tu cuenta principal.** Los fondos de clientes están segregados (safeguarding), pero no asegurados como en un banco.
- **Su fortaleza es la conversión.** El tipo de cambio mid-market que ofrece Wise es el tipo real interbancario. No aplica margen adicional (solo cobra una comisión transparente). Para convertir USD a EUR, es difícil encontrar algo mejor.
- **Los límites de Wise varían.** Según la divisa y el corredor de pago, hay límites en las transferencias. Para movimientos grandes, conviene verificarlos antes.

## Dónde encajan Slash y Wallester

No todo en la banca de tu LLC es cuentas corrientes. Hay dos capas adicionales que la mayoría ignora:

**Slash** cubre la capa de tesorería. Si tu LLC acumula capital entre cobros y distribuciones, ese dinero puede generar rendimiento en lugar de quedarse parado en Mercury. Slash coloca el excedente en instrumentos de bajo riesgo, manteniendo la liquidez accesible.

**Wallester** cubre la capa de gastos. Emite tarjetas corporativas (virtuales y físicas) con control individual por tarjeta. Una tarjeta para cada suscripción, cada proveedor, cada categoría de gasto. Si trabajas con colaboradores, puedes emitirles tarjetas con límites específicos. Todo queda documentado y categorizado.

## ¿Cuál recomendamos?

Para la mayoría de LLCs de no residentes, la combinación ideal es:

1. **Mercury** como cuenta principal: ingresos, gastos operativos, tesorería
2. **Wise Business** como capa de conversión: recibir en otras divisas, convertir al tipo real, enviar a tu cuenta personal
3. **Slash** como capa de tesorería: rendimiento sobre capital ocioso
4. **Wallester** como capa de gastos: tarjetas corporativas con control granular

Esta combinación te da seguridad FDIC, acceso a pasarelas de pago, conversión de divisas eficiente y control total sobre la tesorería y los gastos.

En Exentax configuramos esta estructura como parte del proceso de constitución. No te dejamos con una LLC y una cuenta, te montamos el ecosistema financiero completo para que empieces a operar desde el día uno.`,
    category: "Herramientas",
    readTime: 8,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Bancos vs Fintech para tu LLC: Mercury, Slash, Wallester, Relay | Exentax",
    metaDescription: "Mercury, Wise, Relay y Revolut: ¿son bancos? ¿Son seguros? Diferencias entre bancos y fintech, FDIC, y cuál conviene para tu LLC americana.",
  },
  {
    slug: "tiempos-pagos-ach-wire-transfer",
    title: "¿Cuánto tardan los pagos ACH y Wire Transfer? Tiempos reales",
    excerpt: "ACH tarda 1-3 días, wire doméstico llega en horas, wire internacional en 1-5 días. Todos los tiempos reales para pagos con tu LLC, sin sorpresas.",
    content: `Una de las preguntas más frecuentes cuando empiezas a operar tu LLC es: "Le mandé dinero a un cliente, ¿cuándo llega?" O al revés: "Me van a pagar, ¿cuándo lo veo en mi cuenta?"

Vamos a poner todos los tiempos sobre la mesa para que no haya sorpresas.

## ACH (Automated Clearing House)

ACH es el sistema de transferencias domésticas de EE.UU. Es el método más común y el más barato (generalmente gratis).

### Tiempos de ACH

| Tipo | Tiempo |
|---|---|
| ACH Standard | **1-3 días hábiles** |
| ACH Same-Day | **Mismo día** (si se inicia antes de las 2:45pm ET) |
| ACH Next-Day | **Siguiente día hábil** |

**Importante:** Los días hábiles son de lunes a viernes (sin festivos federales de EE.UU.). Si envías un ACH el viernes por la tarde, no llegará hasta el lunes o martes.

### Factores que afectan el tiempo

- **Hora de envío**: si lo envías después del horario de corte (cut-off time), se procesa al siguiente día hábil
- **Banco receptor**: algunos bancos retienen los fondos ACH 1-2 días adicionales por verificación
- **Primera transferencia**: la primera vez que envías dinero a una nueva cuenta puede tardar más por verificación de seguridad

## Wire Transfer doméstico

Los wires domésticos (dentro de EE.UU.) son más rápidos que ACH, pero tienen coste.

### Tiempos de Wire doméstico

| Tipo | Tiempo |
|---|---|
| Wire doméstico standard | **Mismo día** (2-6 horas) |
| Wire doméstico urgente | **1-2 horas** |

Los wires domésticos suelen llegar en **horas**, no en días. Por eso se usan para pagos urgentes o montos grandes.

## Wire Transfer internacional (SWIFT)

Los wires internacionales usan la red SWIFT y pasan por bancos intermediarios, lo que los hace más lentos.

### Tiempos de Wire internacional

| Ruta | Tiempo |
|---|---|
| EE.UU. → Europa | **1-3 días hábiles** |
| EE.UU. → Latinoamérica | **2-5 días hábiles** |
| EE.UU. → Asia | **2-4 días hábiles** |

### ¿Por qué tardan más?

- **Bancos intermediarios**: el dinero puede pasar por 1-3 bancos intermediarios antes de llegar al destino
- **Zonas horarias**: si el banco receptor ya cerró, la transferencia se procesa al siguiente día hábil
- **Compliance checks**: las transferencias internacionales pasan por controles antifraude y antilavado

## Wise Business

Wise no usa la red SWIFT para la mayoría de transferencias. Usa cuentas locales en cada país, lo que reduce tiempos y costes.

### Tiempos en Wise

| Ruta | Tiempo |
|---|---|
| USD → EUR (SEPA) | **1-2 días hábiles** |
| USD → GBP | **1 día hábil** |
| USD → MXN | **1-2 días hábiles** |
| USD → COP | **1-3 días hábiles** |

## Comparativa general

| Método | Tiempo | Coste (Mercury) | Mejor para |
|---|---|---|---|
| ACH | 1-3 días | Gratis | Pagos domésticos no urgentes |
| Wire doméstico | Mismo día | **$0 en Mercury** | Pagos urgentes dentro de EE.UU. |
| Wire internacional | 1-5 días | **$0 en Mercury** | Pagos internacionales grandes |
| Wise | 1-2 días | 0.4-1.5% | Pagos internacionales frecuentes |
| Stripe/PayPal payout | 2-3 días | Incluido | Cobros a clientes |

## Tips para acelerar tus pagos

- **Inicia las transferencias temprano**: antes de las 2pm hora del este de EE.UU. Después del cut-off, se procesa al siguiente día hábil
- **Evita viernes y festivos**: las transferencias no se procesan en fines de semana. Un ACH iniciado el viernes llega el martes como pronto
- **Usa ACH Same-Day** cuando necesites velocidad sin coste de wire, está disponible en Mercury sin coste adicional
- **Consolida envíos internacionales**: un wire grande sale más barato que varios pequeños. Y con Mercury, los wires son $0 de todas formas
- **Usa Wise para pagos recurrentes**: más rápido y barato que wires tradicionales para montos medianos, gracias a su red de cuentas locales

## El dato que cambia todo: Mercury $0 wire fees

La mayoría de bancos cobran entre $15-50 por wire transfer. Mercury no cobra nada. Cero. Ni nacionales ni internacionales. Esto cambia completamente cómo planificas tus pagos:

- ¿Necesitas pagar a un proveedor en Europa? Wire internacional desde Mercury: $0
- ¿Un cliente americano quiere pagarte por wire? Lo recibes gratis
- ¿Wise te pide enviar fondos por wire para verificación? $0

Mercury usa Column NA como banco custodio, con seguro FDIC. No es una fintech experimental, es infraestructura financiera seria para tu LLC. Consulta nuestra <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">guía completa de Mercury</a> para más detalles.

En Exentax te ayudamos a configurar el flujo de pagos óptimo para tu negocio: Mercury como hub central, <a href="/es/blog/wise-business-llc-guia">Wise como herramienta de conversión</a> (es una EMI con tipo de cambio real), y Relay (Thread Bank) como respaldo. Todo integrado y sin sorpresas.`,
    category: "Operativa",
    readTime: 5,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "¿Cuánto tardan ACH y Wire Transfer? Tiempos reales | Exentax",
    metaDescription: "Tiempos reales de pago: ACH (1-3 días), Wire doméstico (horas), Wire internacional (1-5 días), Wise (1-2 días). Todo sobre plazos de pago en tu LLC.",
  },
  {
    slug: "iban-swift-routing-number-que-son",
    title: "IBAN, SWIFT y Routing Number: qué son y cuándo usarlos",
    excerpt: "Si operas una LLC, necesitas entender qué son el IBAN, el SWIFT/BIC y el Routing Number. Son las 'direcciones' de tu cuenta bancaria. Te lo explicamos claro.",
    content: `Cuando empiezas a mover dinero con tu LLC, te vas a encontrar con tres siglas que aparecen una y otra vez: **IBAN**, **SWIFT** (o BIC) y **Routing Number**. Son como la dirección postal de tu cuenta bancaria, pero para el dinero.

Vamos a explicar cada uno de forma clara para que nunca más te quedes pensando "¿cuál le doy a este cliente?"

## Routing Number (ABA Number)

Es el código que identifica a un banco dentro de Estados Unidos. Tiene **9 dígitos** y se usa exclusivamente para transferencias domésticas dentro de EE.UU.

**Ejemplo:** 084106768

### ¿Cuándo lo necesitas?

- Para recibir pagos **ACH** de clientes americanos
- Para recibir **wires domésticos** dentro de EE.UU.
- Para configurar pagos automáticos (nóminas, suscripciones)
- Para conectar tu cuenta con Stripe, PayPal, Amazon

### ¿Dónde lo encuentras?

En Mercury: Dashboard → Account Details → "Routing Number"

**Nota importante:** Mercury tiene **dos routing numbers**: uno para ACH y otro para Wire. Asegúrate de dar el correcto según el tipo de transferencia.

## SWIFT / BIC Code

El **SWIFT** (Society for Worldwide Interbank Financial Telecommunication) o **BIC** (Bank Identifier Code) es el código que identifica a un banco a nivel internacional. Tiene entre **8 y 11 caracteres** (letras y números).

**Ejemplo:** CHASUS33 (JPMorgan Chase)

### ¿Cuándo lo necesitas?

- Para recibir **wire transfers internacionales** desde fuera de EE.UU.
- Para que un cliente en Europa, Latinoamérica o Asia te envíe dinero

### ¿Por qué es diferente al Routing Number?

El Routing Number es para el sistema doméstico americano (ACH/Fedwire). El SWIFT es para el sistema internacional. Son dos redes de pagos diferentes.

## IBAN (International Bank Account Number)

El **IBAN** es un formato estandarizado de número de cuenta que se usa en Europa, Oriente Medio y partes de Latinoamérica. Tiene entre **15 y 34 caracteres** (varía por país) y contiene el código del país, el banco y la cuenta.

**Ejemplo:** ES91 2100 0418 4502 0005 1332 (España)

### ¿Las cuentas americanas tienen IBAN?

**No.** Estados Unidos no usa el sistema IBAN. Las cuentas americanas usan Routing Number + Account Number.

Si un cliente europeo te pide tu IBAN para pagarte, la respuesta es: "No tengo IBAN, aquí tienes mi Routing Number, Account Number y SWIFT Code para wire internacional."

### ¿Y si necesitas recibir pagos de Europa?

Aquí es donde **Wise Business** brilla. Wise te da un IBAN europeo (con prefijo BE o DE) vinculado a tu cuenta. Los clientes europeos pueden pagarte por SEPA como si fuera una transferencia local, sin comisiones de wire internacional.

## Resumen rápido

| Código | Qué es | Dígitos | Se usa en | Para qué |
|---|---|---|---|---|
| Routing Number | ID del banco en EE.UU. | 9 | EE.UU. | ACH y Wires domésticos |
| SWIFT/BIC | ID del banco internacional | 8-11 | Mundial | Wires internacionales |
| IBAN | Nº de cuenta internacional | 15-34 | Europa, MENA, LatAm | Transferencias SEPA |
| Account Number | Nº de tu cuenta | 10-17 | EE.UU. | Identificar tu cuenta |

## ¿Qué datos dar a cada tipo de cliente?

### Cliente americano
- **Routing Number** (ACH o Wire según el tipo de pago)
- **Account Number**
- **Nombre de la LLC** (como beneficiario)

### Cliente europeo
- **SWIFT Code** + **Account Number** + **Routing Number** para wire internacional
- O mejor: **IBAN europeo de Wise** para que pague por SEPA (más barato y rápido)

### Cliente latinoamericano
- **SWIFT Code** + **Account Number** + **Routing Number** para wire internacional
- O: **datos locales de Wise** si el país tiene cuenta local disponible

## El truco para cobrar más barato: cuentas locales

Aquí va un consejo que vale oro: si tienes clientes en Europa que te pagan regularmente, **NO les des tus datos de wire internacional**. Dales tu **IBAN europeo de Wise Business**.

¿Por qué? Un wire internacional EE.UU.→Europa puede costar al pagador 20-50€ y tardar 2-5 días. Un SEPA desde la cuenta Wise de tu LLC cuesta 0-1€ y llega en 1 día.

Wise (que es una EMI, no un banco) te genera cuentas locales en múltiples países:
- **IBAN europeo** (prefijo BE o DE) para cobros SEPA
- **Datos USD** para clientes americanos (routing + account number)
- **Sort code** británico para clientes UK
- **BSB** australiano para clientes en Australia

Tus clientes pagan como si fuera una transferencia local, tú recibes en tu balance multi-divisa de Wise y luego transfieres a Mercury cuando te convenga.

## Mercury: datos bancarios que necesitas

Para Mercury, los datos que darás a clientes son:

- **Routing Number ACH:** Para cobros ACH domésticos (pagos de clientes US, depósitos de Stripe/PayPal)
- **Routing Number Wire:** Para wires domésticos (ojo: es diferente al de ACH)
- **Account Number:** Tu número de cuenta
- **SWIFT Code:** Para wires internacionales entrantes
- **Dirección del banco:** Column NA, San Francisco, CA

Mercury tiene $0 en comisiones de wire, tanto nacionales como internacionales. Tus fondos están custodiados en Column NA con seguro FDIC.

En Exentax te configuramos todos los canales de cobro desde el primer día. Te decimos exactamente qué datos dar a cada tipo de cliente para que el dinero llegue rápido y sin sorpresas.`,
    category: "Operativa",
    readTime: 6,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "IBAN, SWIFT y Routing Number: qué son y cuándo usarlos | Exentax",
    metaDescription: "IBAN, SWIFT/BIC y Routing Number explicados: qué son, cuándo usar cada uno, qué datos dar a clientes americanos, europeos e internacionales con tu LLC.",
  },
  {
    slug: "cuanto-cuesta-constituir-llc",
    title: "¿Cuánto cuesta constituir una LLC? (Y no, no se \"crea\", se constituye)",
    excerpt: "Antes de nada: una LLC no se 'crea'. Se constituye. Como quien funda una empresa, no como quien crea un grupo de WhatsApp. Dicho esto, te damos todos los costes reales.",
    content: `Vamos a empezar aclarando algo que nos hace sangrar los oídos a los que trabajamos en esto: una LLC no se "crea". Se **constituye**.

Crear es lo que haces con un perfil de Instagram o una cuenta de Netflix. Constituir es lo que haces cuando formas una entidad legal reconocida por un estado soberano de Estados Unidos, con obligaciones fiscales, un número de identificación federal y responsabilidades ante el IRS.

Sutil diferencia, ¿verdad? Bueno, ahora que hemos sacado eso del pecho, vamos a lo que importa: ¿cuánto cuesta?

## Costes de constitución (una vez)

Los costes iniciales dependen del estado que elijas:

### Nuevo México
| Concepto | Coste |
|---|---|
| Filing fee estatal | $50 |
| Registered Agent (primer año) | $50-150 |
| Obtención del EIN | Incluido o $0-50 |
| Operating Agreement | Incluido o $50-200 |
| BOI Report | Incluido o $0-50 |
| **Total constitución** | **$150-500** |

### Wyoming
| Concepto | Coste |
|---|---|
| Filing fee estatal | $100 |
| Registered Agent (primer año) | $50-150 |
| Obtención del EIN | Incluido o $0-50 |
| Operating Agreement | Incluido o $50-200 |
| BOI Report | Incluido o $0-50 |
| **Total constitución** | **$200-550** |

### Delaware
| Concepto | Coste |
|---|---|
| Filing fee estatal | $90 |
| Registered Agent (primer año) | $50-200 |
| Obtención del EIN | Incluido o $0-50 |
| Operating Agreement | Incluido o $50-200 |
| BOI Report | Incluido o $0-50 |
| **Total constitución** | **$190-590** |

## Costes de mantenimiento (anuales)

Una vez constituida, tu LLC tiene gastos recurrentes:

### Nuevo México, el más económico
| Concepto | Coste anual |
|---|---|
| Annual Report | No requiere ($0) |
| Tasa estatal anual | $0 |
| Registered Agent | $50-150 |
| Form 5472 + 1120 | $150-500 (preparación profesional) |
| **Total mantenimiento** | **$200-650/año** |

### Wyoming
| Concepto | Coste anual |
|---|---|
| Annual Report + tasa | $60 |
| Registered Agent | $50-150 |
| Form 5472 + 1120 | $150-500 |
| **Total mantenimiento** | **$260-710/año** |

### Delaware, el más caro
| Concepto | Coste anual |
|---|---|
| Franchise Tax + Annual Report | $300 |
| Registered Agent | $50-200 |
| Form 5472 + 1120 | $150-500 |
| **Total mantenimiento** | **$500-1.000/año** |

## ¿Cuánto cuesta con Exentax?

En Exentax ofrecemos planes que incluyen todo lo necesario para la constitución y el mantenimiento de tu LLC. Sin costes ocultos, sin sorpresas. Puedes ver nuestros planes actualizados en la página de planes y tarifas.

Lo que siempre incluimos:
- Constitución completa en el estado elegido
- Obtención del EIN
- Operating Agreement personalizado
- BOI Report
- Registered Agent
- Soporte durante todo el proceso

## El coste de NO constituir tu LLC

Aquí está el dato que la mayoría ignora: el coste de **no tener una LLC** cuando deberías tenerla.

Si facturas 60.000€/año como autónomo en España con clientes internacionales y estás pagando un 40% efectivo, eso son **24.000€ en impuestos**.

Con una LLC bien estructurada, pagas **0% de impuesto federal en EE.UU.** sobre esos ingresos.

La diferencia: **16.800-19.200€ al año**. El coste de la LLC se amortiza en el **primer mes**. Lee nuestra <a href="/es/blog/autonomo-espana-vs-llc-estados-unidos">comparativa detallada entre autónomo en España y LLC</a> para ver números reales.

## "¿Pero no hay servicios que lo hacen por $49?"

Sí, los hay. Y hacen exactamente lo que cuesta $49: rellenan un formulario y te lo envían. Sin asesoría fiscal, sin Operating Agreement adaptado a tu situación, sin soporte post-constitución, sin preparación de declaraciones, sin que nadie te explique qué hacer después.

Constituir la LLC es el paso más fácil. Lo difícil, y lo que marca la diferencia, es operarla correctamente para que tu estructura fiscal funcione.

## Lo que incluye Exentax (sin letra pequeña)

Nuestros planes de constitución incluyen TODO lo necesario para que tu LLC esté operativa desde el día uno:

- ✓ Filing ante el Secretary of State del estado elegido
- ✓ Obtención del EIN ante el IRS (nosotros hacemos toda la gestión)
- ✓ Operating Agreement personalizado para tu situación
- ✓ BOI Report ante FinCEN
- ✓ Registered Agent incluido el primer año
- ✓ Apertura de cuenta bancaria en Mercury (coordinamos todo)
- ✓ Soporte completo durante todo el proceso
- ✓ Asesoría fiscal inicial para entender tu estructura

Y en el mantenimiento anual:

- ✓ Preparación y presentación del Form 5472 + Form 1120
- ✓ Solicitud automática de extensión (Form 7004)
- ✓ Renovación del Registered Agent
- ✓ BOI Report (actualizaciones si hay cambios)
- ✓ FBAR (si aplica)
- ✓ Soporte continuo todo el año

Cero extras, cero "ah, esto no estaba incluido", cero sorpresas en la factura. Un precio fijo, todo incluido, y nosotros nos encargamos de cada trámite.

Agenda una asesoría gratuita y te damos los números exactos para tu caso concreto.

Quieres saber exactamente cuánto cuesta tu LLC y qué incluye? Pide tu consulta sin compromiso y te damos un presupuesto detallado sin sorpresas.`,
    category: "Guías",
    readTime: 6,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "¿Cuánto cuesta constituir una LLC? Costes reales | Exentax",
    metaDescription: "Costes reales de constituir una LLC en Nuevo México, Wyoming y Delaware. Filing fees, Registered Agent, EIN, mantenimiento anual. Todo desglosado.",
  },
  {
    slug: "ventajas-desventajas-llc-no-residentes",
    title: "Ventajas y desventajas de una LLC para no residentes: la verdad sin filtros",
    excerpt: "Una LLC no es para todo el mundo. Tiene ventajas enormes, pero también tiene costes y obligaciones. Te contamos todo, lo bueno y lo no tan bueno, sin venderte humo.",
    content: `Te vamos a contar algo que la mayoría de empresas de formación de LLCs no te cuentan: una LLC **no es para todo el mundo**. Tiene ventajas enormes si tu perfil encaja, pero también tiene costes, obligaciones y situaciones donde no tiene sentido.

Aquí van las dos caras de la moneda. Sin filtros.

## Las ventajas reales

### 1. Fiscalidad optimizada (la razón principal)
Una Single-Member LLC con propietario no residente paga **0% de impuesto federal** en EE.UU. sobre ingresos de fuente extranjera. Combinado con la estructura fiscal correcta, se puede llegar a optimizar la carga fiscal **hasta un 0%**, frente al **40-47%** que pagas como autónomo.

Esto no es evasión, es optimización fiscal internacional, completamente legal.

### 2. Protección patrimonial
Tu LLC es una entidad separada. Si tu negocio tiene una deuda o un problema legal, tus bienes personales (casa, ahorros, coche) están protegidos. Como autónomo en España, esa protección no existe.

### 3. Acceso a banca y pagos internacionales
Con una LLC abres cuentas en Mercury, Stripe US, PayPal Business US y accedes a toda la infraestructura financiera americana sin restricciones geográficas.

### 4. Credibilidad internacional
Facturar desde una empresa americana genera confianza con clientes globales. Para muchos clientes B2B, especialmente en EE.UU., trabajar con una LLC es lo esperado.

### 5. Sin cuota fija mensual
A diferencia del régimen de autónomos en España (300€+/mes), la LLC no tiene cuota fija mensual. Pagas mantenimiento anual, pero no hay un gasto mensual obligatorio.

### 6. Flexibilidad operativa
Puedes operar desde cualquier país, cobrar en cualquier divisa, y trabajar con clientes de cualquier parte del mundo sin restricciones.

## Las desventajas reales

### 1. Obligaciones de compliance
Tu LLC tiene obligaciones anuales: <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472 + 1120</a>, FBAR (si aplica), Annual Report (según estado), <a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a>. Es importante mantenerlas al día, y con un <a href="/es/blog/mantenimiento-anual-llc-obligaciones">servicio de mantenimiento profesional</a> como el nuestro, nos encargamos de todo por ti.

### 2. Coste de mantenimiento
Mantener una LLC cuesta entre $200 y $1,000/año dependiendo del estado y los servicios que contrates. No es gratis.

### 3. Complejidad fiscal
Tu situación fiscal se vuelve más compleja. Tienes obligaciones en EE.UU. Y en tu país de residencia. Necesitas asesoría profesional, no es algo que puedas hacer con un tutorial de YouTube.

### 4. No elimina impuestos en tu país
La LLC no paga en EE.UU., pero **sigues teniendo obligaciones fiscales en tu país de residencia**. La ventaja es que puedes optimizar cuánto y cómo tributas, pero no desaparecen los impuestos.

### 5. Riesgo de bloqueos bancarios
Si no operas correctamente (mezclas cuentas, no documentas, haces movimientos sospechosos), Mercury o Wise pueden bloquearte la cuenta. No es común si haces las cosas bien, pero es un riesgo real.

### 6. No tiene sentido para todos los perfiles
Si facturas menos de $1,500-2,000/mes, o si todos tus clientes son nacionales, una LLC probablemente no compensa. El ahorro fiscal no cubre los costes de mantenimiento.

## ¿Para quién SÍ tiene sentido?

- Freelancers digitales con ingresos superiores a **$2,000/mes**
- Emprendedores con **clientes internacionales** (especialmente EE.UU., UK, UE)
- Creadores de contenido, desarrolladores, diseñadores, consultores
- Vendedores de productos digitales (cursos, software, SaaS)
- Vendedores de ecommerce (Amazon, Shopify)

## Más ventajas que merece la pena mencionar

### 7. Privacidad y anonimato
En estados como Nuevo México y Wyoming, los datos de los miembros de la LLC no son de acceso público. Tu nombre no aparece en registros estatales. Operas con discreción total, algo impensable con una SL española, donde tus datos están en el Registro Mercantil para que cualquiera los consulte.

### 8. Sin IVA en facturación internacional
La LLC no está dentro del sistema de IVA europeo. Tus facturas a clientes internacionales van limpias, sin IVA, sin modelos trimestrales, sin inversión del sujeto pasivo. Adiós al Modelo 303.

### 9. Acceso a la infraestructura financiera americana
Mercury ($0 en wires, custodia en Column NA con FDIC), Relay (Thread Bank, 20 subcuentas gratis), Wise Business (EMI con tipo de cambio real), Stripe US, PayPal Business US... Todo el arsenal fintech del país más avanzado del mundo, a tu disposición.

### 10. Escalabilidad sin burocracia
No necesitas levantar actas, no necesitas consejo de administración, no necesitas publicar cuentas anuales. Tu LLC crece contigo sin papeleo innecesario.

## ¿Para quién NO tiene sentido?

- Autónomos con **clientes 100% nacionales**: si todos tus clientes están en tu país, la LLC no aporta ventaja fiscal
- Ingresos inferiores a **$1,500-2,000/mes**: el ahorro no cubre los costes de mantenimiento
- Profesiones reguladas que requieren colegiación local (médicos, abogados, arquitectos ejerciendo localmente)
- Personas que buscan "desaparecer del radar", la LLC es transparencia fiscal, no invisibilidad

## Las desventajas, bien enmarcadas

Vamos a ser honestos con las desventajas, pero también realistas:

- **"Es más complejo fiscalmente"** → Sí, pero en Exentax nos encargamos de toda la complejidad. Tú no tocas ni un formulario.
- **"Tiene costes de mantenimiento"** → Sí, pero si facturas más de $2,000/mes, el ahorro fiscal supera los costes en el primer mes.
- **"Puede haber bloqueos bancarios"** → Solo si operas mal. Con buena documentación y coherencia, los bloqueos son rarísimos. Y nosotros te asesoramos para prevenirlos.
- **"Sigues pagando impuestos en tu país"** → Sí, pero con una base imponible optimizada gracias a los gastos deducibles de la LLC. El impuesto federal en EE.UU. es 0%.

## La clave: analiza ANTES de decidir

No constituyas una LLC porque viste un reel de Instagram que te prometía pagar 0% de impuestos. Analiza tu situación real: ingresos, tipo de clientes, país de residencia, planes a medio plazo.

En Exentax hacemos ese análisis contigo en la asesoría gratuita. Si una LLC tiene sentido para ti, te lo decimos con números. Si no, también te lo decimos. Preferimos ser honestos a venderte algo que no necesitas, así es como se construyen relaciones largas.

Quieres saber si una LLC es la opción correcta para tu situación? Habla con nosotros y te damos una respuesta clara basada en tu caso.`,
    category: "Comparativas",
    readTime: 7,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Ventajas y desventajas reales de una LLC para no residentes | Exentax",
    metaDescription: "Las ventajas reales (0% federal, Mercury, Slash, protección) y desventajas reales (costes, compliance) de una LLC. Análisis sin filtros.",
  },
  {
    slug: "evitar-bloqueos-mercury-wise-revolut",
    title: "Cómo evitar bloqueos en Mercury, Wise y Revolut Business",
    excerpt: "Los bloqueos de cuenta son el mayor miedo de cualquier dueño de LLC. Te explicamos por qué pasan, cómo prevenirlos y qué hacer si te bloquean.",
    content: `El bloqueo de cuenta es la pesadilla de todo propietario de LLC. Un día entras a Mercury o Wise y ves: "Tu cuenta ha sido restringida." Sin previo aviso, sin explicación clara, y con tu dinero atrapado.

La buena noticia: la inmensa mayoría de bloqueos se pueden prevenir. La mala: si no conoces las reglas del juego, puedes caer en uno sin querer.

## ¿Por qué bloquean cuentas?

Los bancos y fintechs tienen obligaciones de **KYC** (Know Your Customer) y **AML** (Anti-Money Laundering). Están obligados por ley a monitorear las transacciones y reportar actividad sospechosa. Si algo levanta una bandera roja, bloquean la cuenta primero y preguntan después. Todo esto es parte del <a href="/es/blog/due-diligence-bancario-llc-americana">proceso de due diligence bancario</a> que debes conocer.

### Las razones más comunes de bloqueo:

1. **Movimientos inconsistentes con tu perfil**: si declaraste que tu LLC factura $5K/mes y de repente recibes $50K, el sistema alerta
2. **Transferencias a países de alto riesgo**: ciertos países están en listas de sanciones (OFAC)
3. **Mezclar fondos personales y de negocio**: es una señal de alerta importante
4. **No tener documentación en orden**: si te piden verificación adicional y no respondes a tiempo
5. **Múltiples cuentas sospechosas**: abrir varias cuentas sin justificación
6. **Transacciones redondas y repetitivas**: patrones que parecen estructuración (dividir montos para evitar reportes)
7. **Actividad en industrias de alto riesgo**: criptomonedas, gambling, cannabis, armas

## Cómo prevenir bloqueos

### En Mercury

- **Completa tu perfil al 100%**: sube todos los documentos que te pidan (Articles, EIN, Operating Agreement, pasaporte)
- **Describe tu actividad correctamente**: sé específico sobre qué hace tu LLC y de dónde vienen los ingresos
- **Escala gradualmente**: no pases de $0 a $50K de un mes a otro sin contexto
- **Responde rápido** a solicitudes de verificación adicional
- **No uses la cuenta para gastos personales**: solo gastos del negocio
- **Mantén documentación de tus transacciones**: facturas, contratos, emails con clientes

### En Wise Business

- **Verifica tu identidad completamente** desde el primer día
- **Explica el origen de los fondos** cuando Wise te pregunte (y te va a preguntar)
- **No uses Wise como cuenta principal**: úsala para conversiones y transferencias, no para almacenar grandes sumas
- **Evita envíos a cuentas personales de terceros**: Wise puede interpretarlo como pago a beneficiarios no declarados
- **Documenta cada transferencia**: especialmente las internacionales

### En Revolut Business

- **Activa la verificación mejorada** lo antes posible
- **Declara la fuente de fondos** correctamente durante el onboarding
- **Mantén los movimientos coherentes** con la actividad declarada
- **No hagas transferencias entre múltiples cuentas Revolut** sin justificación

## ¿Qué hacer si te bloquean?

1. **No entres en pánico**: un bloqueo no significa que hayas hecho algo malo
2. **Revisa el email**: normalmente te dicen qué documentación necesitan
3. **Responde rápido y con todo**: facturas, contratos, explicación de la actividad
4. **Sé profesional y claro**: explica tu negocio de forma simple
5. **Ten un plan B**: por eso recomendamos tener al menos dos cuentas (Mercury + Wise como mínimo)

## La regla de oro: transparencia

Los bloqueos casi siempre ocurren por falta de información, no por hacer algo malo. Si tu LLC opera de forma legítima, mantienes documentación ordenada y tu actividad es coherente con lo que declaraste al abrir la cuenta, las probabilidades de bloqueo son mínimas.

El problema surge cuando la gente intenta operar "bajo el radar", y ahí es donde las cosas se complican.

## Diversifica tus cuentas

Nuestra recomendación:
- **Mercury** como cuenta principal (tesorería, cobros, gastos)
- **Slash** para tesorería corporativa, tu capital ocioso genera rendimiento mientras decides cuándo usarlo (no es un banco: es una plataforma de treasury management)
- **Wallester** para tarjetas corporativas con control granular, cada suscripción y gasto operativo con su propia tarjeta virtual
- **Wise Business** para conversiones de divisa y pagos internacionales
- **Revolut Business** como complemento multi-divisa para operaciones en EUR/GBP
- **Relay** como cuenta de respaldo (por si Mercury tiene algún problema temporal)

Nunca dependas de una sola cuenta. Si una se bloquea temporalmente, necesitas poder seguir operando. Y con herramientas como Slash y Wallester complementando tu banca principal, tu operativa es más profesional y resiliente.

## Dato clave sobre cada plataforma

- **Mercury** usa Column NA como banco custodio. Tus fondos tienen seguro FDIC hasta $250K por depositante. Los wires nacionales e internacionales son $0. Es una plataforma fintech seria, no un chiringuito.
- **Wise Business** es una EMI (Institución de Dinero Electrónico), no un banco. No tiene seguro de depósitos como un banco tradicional, pero los fondos de clientes están segregados. Úsala para conversiones y transferencias, no como tesorería principal.
- **Relay** usa Thread Bank como banco subyacente. Buena opción como cuenta de respaldo con hasta 20 subcuentas gratuitas.

En Exentax configuramos tus cuentas desde el principio para minimizar el riesgo de bloqueos. Preparamos toda la documentación que Mercury necesita, te asesoramos sobre cómo operar correctamente, y si alguna vez tienes un problema, te ayudamos a resolverlo.`,
    category: "Operativa",
    readTime: 5,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Evitar bloqueos en Mercury, Wise y Revolut Business | Exentax",
    metaDescription: "Por qué bloquean cuentas de LLC en Mercury, Wise y Revolut. Cómo prevenirlo con Slash, Wallester y diversificación. Guía preventiva completa.",
  },
  {
    slug: "que-es-irs-guia-duenos-llc",
    title: "¿Qué es el IRS? Guía completa para dueños de LLC",
    excerpt: "El IRS es la agencia tributaria de Estados Unidos. Si tienes una LLC, necesitas entender qué es, qué te exige y cómo cumplir sin errores.",
    content: `Si tienes una LLC en Estados Unidos, o estás pensando en tener una, vas a escuchar mucho sobre el **IRS**. Mucho. Es la entidad con la que tendrás más relación desde el punto de vista fiscal. Y es mejor entenderla bien desde el principio.

## ¿Qué es el IRS?

El **IRS** (Internal Revenue Service) es la agencia tributaria federal de Estados Unidos. Es el equivalente a:

- **AEAT** (Agencia Tributaria) en España
- **SAT** en México
- **DIAN** en Colombia
- **AFIP** en Argentina
- **SII** en Chile

Su función principal es recaudar impuestos federales y hacer cumplir la legislación fiscal de EE.UU.

## ¿Qué relación tiene el IRS con tu LLC?

Aunque tu LLC no pague impuestos federales en EE.UU. (como Disregarded Entity con propietario no residente), el IRS sigue siendo relevante para ti porque:

### 1. Te asigna el EIN
El **EIN** (Employer Identification Number) es el número fiscal de tu LLC. Lo emite el IRS y lo necesitas para prácticamente todo: abrir cuentas bancarias, registrarte en Stripe, presentar declaraciones.

### 2. Recibes declaraciones anuales
Cada año debes presentar el **<a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a> + Form 1120** ante el IRS. Es un formulario informativo que reporta las transacciones entre tú y tu LLC. No pagas impuestos, pero el IRS quiere saber qué movimientos hay.

### 3. Requiere cumplimiento puntual
El IRS espera que presentes el Form 5472 a tiempo cada año. Es un trámite administrativo importante que nosotros gestionamos por ti dentro de nuestro servicio de mantenimiento.

### 4. Define la clasificación fiscal de tu LLC
El IRS es quien determina cómo se trata fiscalmente tu LLC. Para una Single-Member LLC con propietario extranjero, la clasificación es "Disregarded Entity", lo que significa que la LLC en sí misma no es contribuyente.

## ¿Cómo funciona el sistema fiscal del IRS?

El sistema fiscal de EE.UU. es complejo, pero para un propietario de LLC no residente, lo que necesitas saber es:

### Impuestos para no residentes con LLC
- **Ingresos de fuente estadounidense:** Podrían estar sujetos a impuesto (FDAP income, ECI income), pero esto no aplica a la mayoría de freelancers digitales que trabajan con clientes desde fuera de EE.UU.
- **Ingresos de fuente extranjera:** No están sujetos a impuesto federal de EE.UU. Esta es la clave de la ventaja fiscal de la LLC para no residentes.

### El concepto de "fuente" del ingreso
Lo que determina si pagas impuestos en EE.UU. no es dónde está registrada tu LLC, sino **de dónde proviene el ingreso**:

- Diseñas una web para un cliente en Alemania desde tu casa en España → ingreso de fuente **extranjera** → no tributa en EE.UU.
- Diseñas una web para un cliente en Nueva York estando físicamente en Nueva York → ingreso de fuente **americana** → podría tributar

Para la mayoría de freelancers y emprendedores digitales, los ingresos son de fuente extranjera, lo que resulta en **0% de impuesto federal**.

## Plazos del IRS que debes conocer

| Fecha | Obligación |
|---|---|
| 15 de enero | Inicio del periodo de presentación |
| 15 de abril | Fecha límite Form 5472 + 1120 (o solicitar extensión) |
| 15 de abril | Fecha límite FBAR (extensión automática hasta 15 oct) |
| 15 de octubre | Fecha límite con extensión para Form 5472 + 1120 |

## ¿Puedo comunicarme con el IRS?

Sí, pero no es lo más ágil del mundo. El IRS tiene:
- **Línea telefónica:** Suelen tener tiempos de espera largos
- **Correspondencia por correo:** Todo lo formal se hace por correo postal
- **Portal online (IRS.gov):** Para consultas, formularios y herramientas

Para no residentes, la comunicación con el IRS puede ser especialmente complicada por las zonas horarias y los requisitos de idioma (todo es en inglés).

## Los formularios que debes conocer (y que nosotros preparamos por ti)

### Form 5472, el más importante
Es el formulario informativo que reporta las transacciones entre la LLC y su propietario extranjero. Incluye:
- Aportaciones de capital del miembro
- Distribuciones (Owner's Draws) al miembro
- Préstamos entre la LLC y el miembro
- Pagos por servicios entre partes relacionadas

**No presentarlo a tiempo conlleva sanciones significativas.** El IRS no se toma este formulario a la ligera. Por eso en Exentax nos tomamos los plazos muy en serio.

### Form 1120, la "portada" del 5472
El Form 5472 no se puede presentar solo. Va adjunto a un Form 1120 (declaración de impuesto corporativo) que, en el caso de una Disregarded Entity, se presenta con los campos en cero (porque no hay impuesto que pagar). Es básicamente un sobre para el 5472.

### Form 7004, la extensión automática
Si por cualquier razón no estamos listos para el 15 de abril, presentamos un Form 7004 que da una extensión automática de 6 meses (hasta el 15 de octubre). En Exentax solicitamos la extensión de forma proactiva para todos nuestros clientes, es gratis y elimina el estrés.

### FBAR (FinCEN Form 114)
Si la LLC tiene cuentas financieras fuera de EE.UU. con un saldo agregado superior a $10,000 en cualquier momento del año, hay que presentar el FBAR. Se hace electrónicamente a través de FinCEN, no del IRS.

## ¿Debo tener miedo del IRS?

No. Rotundamente no. El IRS no es un monstruo, es una burocracia. Una burocracia grande, lenta, y a veces exasperante, pero predecible. Si cumples con las reglas, no tienes nada que temer.

El IRS persigue a quienes:
- No presentan formularios obligatorios
- Evaden impuestos activamente
- Mienten en sus declaraciones
- Ocultan cuentas o ingresos

Si tu LLC está bien constituida, presentas tus formularios a tiempo y tu actividad es legítima, el IRS ni sabe que existes. Eres un número más en un sistema que procesa millones de declaraciones al año.

## En Exentax, tú no tocas nada del IRS

Toda la relación con el IRS la gestionamos nosotros:

- ✓ Preparamos y presentamos el Form 5472 + Form 1120 cada año
- ✓ Solicitamos la extensión (Form 7004) de forma proactiva
- ✓ Presentamos el FBAR si aplica
- ✓ Respondemos a cualquier correspondencia del IRS
- ✓ Te mantenemos informado de plazos y cambios regulatorios
- ✓ Guardamos copia de toda la documentación presentada

Tú no llamas al IRS, no rellenas formularios, no te preocupas por plazos. Eso es literalmente nuestro trabajo. Y lo hacemos bien.

Agenda una asesoría gratuita y te explicamos exactamente cómo funciona tu relación con el IRS como dueño de LLC. Spoiler: es mucho más simple de lo que parece.

Quieres entender tu relación con el IRS y mantener tu LLC en orden? Contacta con nuestro equipo y te explicamos todo lo que necesitas saber.`,
    category: "Guías",
    readTime: 7,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "¿Qué es el IRS? Guía completa para dueños de LLC en 2026 | Exentax",
    metaDescription: "El IRS y tu LLC: EIN, Form 5472, Form 1120, plazos y sanciones. Todo lo que necesitas saber sobre la agencia tributaria de EE.UU. como no residente.",
  },
  {
    slug: "llc-seguridad-juridica-proteccion-patrimonial",
    title: "LLC y seguridad jurídica: cómo protege tu patrimonio personal",
    excerpt: "Una LLC separa tus bienes personales de los del negocio. Si tu empresa tiene un problema, tu casa y tus ahorros están protegidos. Así funciona la protección patrimonial.",
    content: `Hay una razón por la que el nombre completo de una LLC es **Limited Liability Company**: "compañía de responsabilidad limitada". La palabra clave es **limitada**. Tu responsabilidad personal tiene un techo.

Si eres autónomo, ese techo no existe. Respondes con todo lo que tienes.

## El problema del autónomo: responsabilidad ilimitada

Como autónomo (o trabajador independiente) en la mayoría de países hispanohablantes, tú y tu negocio son **la misma persona** a efectos legales. Esto significa que si tu negocio tiene una deuda, un problema legal, o una demanda:

- **Tu casa** puede ser embargada
- **Tus ahorros** pueden ser reclamados
- **Tu coche** puede ser embargado
- **Cualquier bien a tu nombre** está en riesgo

No importa si el problema es una factura impagada, un cliente que te demanda, o una deuda con un proveedor. Todo tu patrimonio personal responde.

## Cómo funciona la protección de la LLC

La LLC crea una **barrera legal** entre tu patrimonio personal y el de tu negocio. Son dos entidades separadas:

- **La LLC** tiene su propia cuenta bancaria, sus propios ingresos, sus propias deudas
- **Tú como persona** tienes tus cuentas personales, tus bienes, tu patrimonio

Si la LLC tiene un problema legal, solo los activos de la LLC están en riesgo. Tu patrimonio personal queda protegido.

### Ejemplo práctico

Imagina que tu LLC tiene un contrato con un cliente por $50,000. El cliente dice que no entregaste el trabajo y te demanda por incumplimiento. Sin LLC, esa demanda puede ir directamente contra tus bienes personales. Con LLC, la demanda es contra la LLC, no contra ti.

Si la LLC solo tiene $10,000 en su cuenta, eso es lo máximo que el cliente puede reclamar de la LLC. Tu casa de $200,000 y tus ahorros de $30,000 están protegidos.

## ¿Cuándo NO funciona la protección?

La protección patrimonial de la LLC **no es absoluta**. Un juez puede "levantar el velo corporativo" (piercing the corporate veil) y hacerte responsable personalmente si:

- **<a href="/es/blog/separar-dinero-personal-llc-por-que-importa">Mezclas fondos</a>**: usas la cuenta de la LLC para gastos personales o viceversa
- **No mantienes la LLC operativa**: no presentas declaraciones, no renuevas el <a href="/es/blog/registered-agent-que-es-por-que-necesitas">Registered Agent</a>, pierdes el Good Standing
- **Cometes fraude**: usas la LLC para actividades fraudulentas o ilegales
- **No tienes <a href="/es/blog/operating-agreement-llc-que-es">Operating Agreement</a>**: sin documentos internos, la separación es más débil
- **Firmas contratos personalmente**: si garantizas una deuda de la LLC con tu firma personal, esa garantía es personal
- **La LLC está infracapitalizada**: si la LLC no tiene fondos suficientes para operar de forma razonable

## Cómo mantener la protección fuerte

Para que la protección patrimonial de tu LLC sea sólida, debes:

1. **Separar cuentas**: una cuenta para la LLC, otra para ti. Nunca mezclar
2. **Documentar todo**: facturas, contratos, retiros (Owner's Draws)
3. **Mantener el Operating Agreement actualizado**
4. **Cumplir con todas las obligaciones**: Annual Report, Form 5472, BOI Report
5. **No usar la LLC para gastos personales**
6. **Mantener capitalización adecuada**: no dejar la cuenta de la LLC en $0 permanentemente
7. **Firmar siempre en nombre de la LLC**: "Juan García, Member of MiEmpresa LLC", nunca solo "Juan García"

## LLC vs otras estructuras

| Estructura | Protección patrimonial | Complejidad | Coste |
|---|---|---|---|
| Autónomo (España) | Ninguna | Baja | Bajo |
| Sociedad Limitada (España) | Sí | Alta | Alto (capital mínimo 3.000€) |
| LLC (EE.UU.) | Sí | Media | Medio |
| Corporation (EE.UU.) | Sí | Alta | Alto |

La LLC ofrece el mejor equilibrio entre protección, simplicidad y coste. Es más fácil de constituir y mantener que una SL española, y ofrece una protección patrimonial equiparable.

## Marco legal: jurisdicción de EE.UU.

La LLC se rige por la legislación del estado donde está registrada. Estados como **Wyoming** y **Nuevo México** tienen legislaciones especialmente favorables para LLCs:

- **Wyoming:** Protección de activos superior, ley de LLCs moderna (2010 Revised LLC Act), no disclosure de miembros
- **Nuevo México:** Sin Annual Report, mínima regulación estatal, máxima simplicidad
- **Delaware:** Court of Chancery especializada, legislación corporativa más desarrollada del país

Estas legislaciones están respaldadas por décadas de jurisprudencia y son reconocidas internacionalmente.

## Privacidad y anonimato: la capa extra

Además de la protección patrimonial, la LLC ofrece algo que pocas estructuras en otros países pueden igualar: **privacidad real**.

### Nuevo México
Los datos de los miembros de la LLC **no aparecen en registros públicos**. El estado no exige revelar quiénes son los propietarios en los Articles of Organization. Tu nombre no está asociado públicamente a la empresa. Es privacidad de serie, sin pagar extra.

### Wyoming
Igual que Nuevo México en cuanto a privacidad de miembros. Pero Wyoming añade algo más: la **Charging Order Protection** más fuerte de Estados Unidos. Si alguien te demanda personalmente (fuera de la LLC), un acreedor no puede tomar el control de tu LLC ni forzar distribuciones. Solo puede obtener una "charging order", que le da derecho a recibir distribuciones SI las haces. Si no distribuyes, no cobra. Es la protección de activos más robusta que existe en legislación estatal americana.

### Delaware
La privacidad de miembros es menor (pueden aparecer en ciertos registros), pero el marco legal es el más desarrollado. Ideal para C-Corps y startups con inversores, no tanto para protección patrimonial individual.

### Comparado con una SL española
En España, los datos de administradores y socios están en el Registro Mercantil. Cualquiera puede consultarlos por menos de 10€. Tu nombre, tu DNI, tu participación... todo público. Con una LLC en NM o WY, esa información simplemente no existe en registros públicos.

## Charging Order Protection: el escudo definitivo

Este concepto merece su propia sección porque es una de las ventajas menos conocidas y más potentes de la LLC americana.

Si un acreedor personal tuyo obtiene una sentencia en tu contra (por ejemplo, una deuda personal, un accidente de coche, lo que sea), en la mayoría de países ese acreedor puede ir a por tus bienes, incluidas tus participaciones en empresas.

Con una LLC en Wyoming, el acreedor solo puede obtener una **charging order**: un derecho a recibir las distribuciones que la LLC haga al miembro. Pero NO puede:
- Tomar el control de la LLC
- Forzar la venta de activos de la LLC
- Obligarte a hacer distribuciones
- Votar o participar en decisiones de la LLC

En la práctica, esto significa que si no haces distribuciones, el acreedor no cobra. Tu LLC y sus activos quedan intactos. Es como un cofre que nadie más puede abrir.

## La seguridad jurídica como inversión

Piensa en la protección patrimonial como un seguro: esperas no necesitarlo nunca, pero si lo necesitas, vale cada centavo. El panadero de barrio probablemente no necesita una LLC. Pero tú, que operas internacionalmente, manejas contratos con clientes de varios países y mueves dinero entre jurisdicciones, tú sí.

El coste de mantener una LLC es una fracción de lo que perderías si un problema legal afectara tus bienes personales. Un juicio puede costar decenas de miles de euros. Tu LLC cuesta una fracción de eso al año. Las cuentas son fáciles.

En Exentax nos aseguramos de que tu LLC esté constituida en el estado correcto para tu nivel de protección, con la documentación perfecta y el compliance al día. Porque la protección patrimonial solo funciona si todo está en orden. Agenda tu asesoría gratuita y diseñamos la estructura que blinda tu patrimonio.`,
    category: "Guías",
    readTime: 8,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "LLC y protección patrimonial: seguridad jurídica real | Exentax",
    metaDescription: "Cómo una LLC protege tu patrimonio personal. Charging Order Protection, piercing the veil, privacidad en NM/WY y comparativa con SL española.",
  },
  {
    slug: "llc-creadores-contenido-youtube-twitch",
    title: "LLC para creadores de contenido: YouTube, Twitch, podcasts y redes sociales",
    excerpt: "Si generas ingresos con contenido digital, una LLC americana puede cambiar completamente tu operativa. Cobras en dólares, facturas limpio y operas como un profesional global.",
    content: `Si eres creador de contenido, ya sea en YouTube, Twitch, TikTok, podcasts o cualquier plataforma digital, probablemente estés generando ingresos desde múltiples países sin una estructura pensada para eso.

YouTube te paga desde Irlanda. Twitch desde San Francisco. Los sponsors pueden estar en cualquier parte del mundo. Y tú estás intentando encajar todo eso en un régimen fiscal local que no fue diseñado para tu realidad.

## Por qué una LLC encaja con los creadores

La mayoría de plataformas de contenido están en Estados Unidos. Cuando tienes una LLC americana:

- **Cobras directamente en dólares** sin intermediarios ni comisiones de conversión innecesarias.
- **Facturas como empresa americana** a sponsors y marcas internacionales, lo que genera más confianza y abre puertas.
- **Accedes a mejores condiciones** en programas de partners y acuerdos con marcas.
- **Separas tu patrimonio personal** del negocio. Si alguien demanda a tu marca, tus bienes personales están protegidos.
- **Operas con herramientas profesionales** como Mercury, Stripe o PayPal Business desde el primer día.

## Qué plataformas funcionan mejor con una LLC

Prácticamente todas las plataformas de monetización de contenido funcionan perfectamente con una LLC americana:

- **YouTube / AdSense**: Google paga sin retención adicional si tu LLC tiene el EIN correctamente configurado.
- **Twitch**: Los pagos se procesan directamente a tu cuenta bancaria americana.
- **Patreon / Ko-fi / Buy Me a Coffee**: Integración directa con tu cuenta Mercury o Relay.
- **Sponsors y marcas**: Facturas como empresa americana, lo que simplifica enormemente la relación comercial.
- **Cursos y productos digitales**: Puedes vender a través de Gumroad, Teachable o tu propia plataforma usando Stripe.

## ¿A partir de cuánto tiene sentido?

No hay una regla universal, pero si facturas más de 2.500-3.000€ al mes con tu contenido, es probable que la estructura empiece a compensar. El punto exacto depende de tu país de residencia, tu tipo de contenido y cómo gestionas tus ingresos actualmente.

En la llamada gratuita analizamos tu caso concreto y te decimos si tiene sentido o no. Si no compensa, te lo diremos directamente.

## Tipos de ingresos que puedes canalizar por tu LLC

La mayoría de creadores no se dan cuenta de la cantidad de fuentes de ingreso que pueden pasar por su LLC:

### Ingresos publicitarios
- **YouTube AdSense**: Google te paga desde Irlanda o EE.UU. Con tu LLC y EIN correctamente configurado, cobras sin retención adicional en la mayoría de casos.
- **Twitch Ads**: Los ingresos por anuncios de Twitch van directos a tu cuenta Mercury.
- **TikTok Creator Fund / Creativity Program**: Cada vez más relevante, y funciona perfectamente con una LLC.

### Sponsorships y deals con marcas
Aquí es donde la LLC brilla especialmente. Cuando una marca te contacta para un sponsorship:
- Facturas desde tu LLC. "CreatorName LLC" suena infinitamente más profesional que "Juan García, autónomo"
- Negociar es más fácil cuando representas a una empresa americana
- Las marcas americanas prefieren trabajar con proveedores locales (tu LLC es "local" para ellas)
- Los pagos llegan sin retenciones a tu cuenta Mercury

### Merchandising
Si vendes merch (camisetas, tazas, lo que sea), tu LLC es la entidad perfecta:
- Abres cuenta en Shopify con Stripe US
- Cobras en dólares sin comisiones extra
- Si usas print-on-demand (Printful, Teespring), la LLC es tu proveedor oficial

### Cursos y productos digitales
- Vende tus cursos a través de Gumroad, Teachable o tu propia plataforma
- Cobra suscripciones con Stripe
- Si vendes B2C internacionalmente, **DoDo Payments** actúa como Merchant of Record y gestiona el IVA/GST de cada país automáticamente, tú vendes, DoDo se encarga del cumplimiento fiscal
- Todo facturado limpio desde tu LLC

### Membresías y suscripciones
- Patreon, Ko-fi, Buy Me a Coffee, todos se integran directamente con tu cuenta bancaria americana
- Los supporters de todo el mundo te pagan sin fricciones

### Tesorería y tarjetas corporativas
- **Slash** para que el capital que acumula tu LLC genere rendimiento mientras decides cuándo distribuirlo, ideal para creadores con ingresos variables
- **Wallester** para tarjetas corporativas virtuales: una para cada suscripción (Adobe, equipo, hosting), con límites individuales y control total

## Ejemplo real: un YouTuber con 100K suscriptores

Supongamos que generas esto al mes:
- AdSense: $2,000
- 2 sponsorships: $3,000
- Merch: $500
- Patreon: $800
- **Total: $6,300/mes ($75,600/año)**

**Sin LLC (autónomo en España):**
- IRPF ~35% + cuota autónomos = ~$28,000 en impuestos

**Con LLC:**
- $0 federal en EE.UU. (Disregarded Entity)
- Impuesto federal EE.UU.: 0% (Single-Member LLC no residente)
- Costes LLC: ~$1,500
- **Total: ~$9,500-11,500 → ahorro de ~$16,500-18,500/año**

Ese ahorro son dos equipos de cámara nuevos, o un año entero de editor de vídeo. O simplemente más dinero en tu bolsillo.

## Lo que incluye el servicio de Exentax

En Exentax nos encargamos de todo: constitución de la LLC, obtención del EIN, apertura de cuenta bancaria americana (Mercury/Relay), configuración de tesorería (Slash), tarjetas corporativas (Wallester), pasarelas de pago (Stripe/DoDo Payments) y compliance anual. Tú te dedicas a crear contenido, nosotros nos ocupamos del aburrido pero necesario papeleo.

Hemos montado LLCs para YouTubers, streamers de Twitch, podcasters y creadores de cursos online. Conocemos las particularidades de cada plataforma y cómo estructurarlo para que pagues lo justo.

¿Quieres saber si una LLC tiene sentido para tu canal? Agenda una asesoría gratuita de 30 minutos. Te decimos exactamente cuánto puedes ahorrar con tus números reales.

Eres creador de contenido y quieres optimizar tus ingresos de YouTube, Twitch o plataformas digitales? Reserva una consulta con nuestro equipo y te montamos la estructura perfecta.`,
    category: "Guías",
    readTime: 6,
    publishedAt: "2026-03-04",
    updatedAt: "2026-04-15",
    metaTitle: "LLC para creadores de contenido: YouTube, Twitch, podcasts | Exentax",
    metaDescription: "LLC para YouTubers, streamers y podcasters: cobra en USD, factura con Mercury/Stripe, gestiona IVA con DoDo Payments. Ahorro fiscal real con ejemplos.",
  },
  {
    slug: "llc-agencias-marketing-digital",
    title: "LLC para agencias de marketing digital: operar sin fronteras",
    excerpt: "Si tu agencia tiene clientes en varios países, una LLC americana te permite facturar en dólares, cobrar sin fricciones y escalar sin límites geográficos.",
    content: `Las agencias de marketing digital son uno de los negocios que mejor encajan con una LLC americana. Trabajas con clientes de múltiples países, tu equipo puede estar distribuido globalmente y tu facturación no depende de ninguna ubicación física.

## Por qué las agencias eligen una LLC

Cuando gestionas campañas de Google Ads, Meta Ads, SEO o social media para clientes internacionales, tener una estructura local puede ser un cuello de botella. Una LLC americana te da:

- **Facturación internacional limpia.** Emites facturas desde una empresa americana, lo que simplifica enormemente la relación con clientes de cualquier país.
- **Cobro en dólares sin fricciones.** Cuentas en Mercury o Relay con acceso directo a ACH y wire transfers.
- **Acceso a herramientas publicitarias.** Muchas plataformas dan mejores condiciones a empresas americanas. Puedes abrir cuentas de ads directamente a nombre de tu LLC.
- **Credibilidad inmediata.** Cuando un cliente potencial ve que trabajas desde una estructura americana, la percepción de profesionalismo sube automáticamente.
- **Escalabilidad.** Puedes contratar freelancers internacionales, subcontratar servicios y gestionar todo desde tu LLC sin las limitaciones de una estructura local.

## Cómo funciona en la práctica

El día a día con una LLC es más sencillo de lo que parece:

1. **Tus clientes te pagan** a tu cuenta bancaria americana (Mercury, Relay).
2. **Pagas a tu equipo y proveedores** desde esa misma cuenta o mediante transferencias internacionales.
3. **Gestionas tus gastos de ads** directamente desde la tarjeta de débito de tu LLC.
4. **Al final del año**, nosotros nos encargamos de las declaraciones ante el IRS.

No necesitas viajar a Estados Unidos, no necesitas oficina física, y todo el proceso de constitución es 100% remoto.

## ¿Cuándo tiene sentido para una agencia?

Si tu agencia factura más de 3.000-5.000€ al mes y tienes al menos un par de clientes internacionales, es muy probable que la estructura LLC te beneficie. Cuanto mayor sea tu facturación, mayor puede ser la diferencia.

Si facturas menos o solo tienes clientes locales, puede que una LLC no sea la mejor opción todavía. En la asesoría gratuita analizamos tu caso específico y te damos una respuesta honesta.

## Integraciones clave para agencias

### Stripe para cobrar a clientes internacionales
Con Stripe US vinculado a tu LLC, puedes:
- Cobrar retainers mensuales con tarjeta de crédito
- Crear links de pago para proyectos puntuales
- Facturar automáticamente servicios recurrentes
- Aceptar pagos en más de 135 divisas
- Comisiones claras: 2.9% + $0.30 por transacción doméstica

### Mercury como hub financiero
Mercury con $0 en comisiones de wire (nacionales e internacionales) es ideal para agencias que mueven dinero constantemente:
- Pagos a equipo y freelancers internacionales (vía wire o ACH)
- Gastos de ads directamente desde la tarjeta de débito Mercury
- Sub-cuentas para separar fondos por cliente o proyecto
- Tus fondos custodiados en Column NA con seguro FDIC

### Slash: tesorería corporativa para agencias
Las agencias manejan retainers, pagos diferidos y flujos de caja con picos y valles. **Slash** permite que el capital que se acumula entre esos ciclos genere rendimiento, colocándolo en instrumentos de corto plazo y bajo riesgo. Para una agencia que cobra retainers mensuales pero paga a equipo quincenalmente, la diferencia temporal es capital que puede optimizarse.

### Wallester: tarjetas para equipo y gastos de ads
**Wallester** te da tarjetas corporativas virtuales con límites individuales. Una tarjeta para Meta Ads, otra para Google Ads, otra para herramientas del equipo. Control granular, sin riesgo de exceder presupuestos, y cada gasto categorizado automáticamente.

### Wise Business para pagos a equipo internacional
Si tienes colaboradores en España, México, Argentina o cualquier otro país, Wise (como EMI con tipo de cambio real) te permite pagarles en su moneda local con las mejores tasas. Mucho más barato que wires internacionales desde bancos tradicionales.

### DoDo Payments para servicios B2C
Si tu agencia vende cursos, templates o productos digitales directamente a consumidores finales, **DoDo Payments** actúa como Merchant of Record y gestiona el IVA/GST automáticamente en cada país.

## Ejemplo práctico: agencia de performance marketing

**Sin LLC (autónomos en España):**
- Facturación: 120.000€/año
- IRPF ~37% + cuota autónomos = ~48.000€ entre impuestos y cuotas
- Facturar a clientes US con retenciones y limitaciones

**Con LLC:**
- Misma facturación canalizada por la LLC
- $0 federal EE.UU.
- Tributación optimizada en país de residencia: ~14.000-17.000€
- Costes LLC: ~1.500€
- **Ahorro anual: ~29.000-32.000€**

Con ese ahorro contratas otro diseñador, inviertes en ads propios o simplemente te lo llevas a casa.

## Lo que hacemos por ti

Constitución completa de la LLC, EIN, cuenta bancaria (Mercury/Relay), tesorería (Slash), tarjetas corporativas (Wallester), configuración de Stripe/Adyen y facturación, compliance anual. No desaparecemos después de montar la empresa, nos quedamos contigo para que todo funcione correctamente. Soporte continuo, todo el año.

Agenda una asesoría gratuita y te explicamos cómo podría funcionar para tu agencia. En 30 minutos hacemos los números con tus cifras reales.

Tienes una agencia de marketing digital y facturas a clientes internacionales? Solicita tu consulta y te explicamos cómo optimizar tu estructura fiscal.`,
    category: "Guías",
    readTime: 6,
    publishedAt: "2026-03-04",
    updatedAt: "2026-04-15",
    metaTitle: "LLC para agencias de marketing digital: estructura completa | Exentax",
    metaDescription: "LLC para agencias de marketing: Mercury, Slash, Wallester para ads, Stripe, Wise. Factura internacionalmente, cobra en USD y escala sin límites.",
  },
  {
    slug: "primer-mes-llc-que-esperar",
    title: "Tu primer mes con una LLC: qué esperar paso a paso",
    excerpt: "Acabas de constituir tu LLC y ahora qué? Te contamos exactamente qué pasa durante el primer mes: cuenta bancaria, primeras facturas y cómo empezar a operar.",
    content: `Has dado el paso: tu LLC está constituida, tienes tu EIN y estás listo para empezar. Pero ahora viene la pregunta que todos se hacen: ¿y ahora qué?

Este artículo te explica exactamente qué pasa durante tu primer mes con una LLC, paso a paso, sin tecnicismos innecesarios.

## Semana 1: Tu cuenta bancaria

Lo primero que hacemos después de constituir tu LLC es abrir tu cuenta bancaria americana. En Exentax utilizamos principalmente Mercury, una de las plataformas fintech más populares para LLCs de no residentes (los depósitos se custodian en Column NA con seguro FDIC).

El proceso es sencillo:

- Enviamos la solicitud con toda la documentación de tu LLC.
- Mercury revisa y aprueba la cuenta (normalmente en 1-3 días hábiles).
- Recibes acceso a tu dashboard con tu número de cuenta, routing number y tarjeta de débito virtual.

Con tu cuenta activa, ya puedes recibir pagos en dólares de cualquier parte del mundo.

## Semana 2: Configuración de cobros

Una vez que tienes la cuenta bancaria, configuramos tus canales de cobro:

- **Stripe**: Para cobrar con tarjeta a clientes de cualquier país.
- **PayPal Business**: Si tus clientes prefieren esta opción.
- **DoDo Payments**: Si vendes productos digitales B2C, actúa como Merchant of Record y gestiona el IVA/GST automáticamente.
- **Facturas directas**: Para clientes que pagan por transferencia (ACH o wire transfer).
- **Otras plataformas**: Dependiendo de tu negocio (Gumroad, Teachable, etc.).

También configuramos **Slash** (tesorería corporativa para que tu capital ocioso genere rendimiento) y **Wallester** (tarjetas corporativas virtuales para gastos operativos con control granular). Todas estas plataformas se conectan directamente a tu cuenta Mercury.

## Semana 3: Primeras facturas

Tu LLC está operativa. Empiezas a emitir facturas profesionales desde tu empresa americana. Los datos de facturación son:

- Nombre de tu LLC
- Dirección del agente registrado
- EIN (tu número fiscal americano)
- Datos bancarios para recibir el pago

La factura va sin IVA porque las LLCs de no residentes no cobran sales tax por servicios digitales prestados internacionalmente.

## Semana 4: Rutina operativa

Al final del primer mes, ya tienes una rutina establecida:

- Recibes pagos en tu cuenta Mercury.
- Pagas tus gastos de negocio desde la misma cuenta.
- Mantienes una separación clara entre dinero personal y empresarial.
- Tienes visibilidad completa de tus finanzas a través del dashboard de Mercury.

## Lo que pasa entre bastidores (y tú ni te enteras)

Mientras tú te dedicas a trabajar en tu negocio durante ese primer mes, en Exentax estamos haciendo esto por ti:

- **Verificando** que Mercury haya aprobado correctamente tu cuenta y que todos los datos estén bien
- **Configurando** tu ecosistema de cobros (Stripe, PayPal, lo que necesites)
- **Respondiendo** a cualquier solicitud de documentación adicional que el banco pueda pedir
- **Asegurándonos** de que tu BOI Report está presentado correctamente ante FinCEN
- **Preparando** tu carpeta de documentación (Articles, EIN, Operating Agreement, todo organizado)
- **Estando disponibles** para cualquier duda que te surja, porque siempre surgen dudas las primeras semanas

## Cronograma realista semana a semana

| Semana | Qué pasa | Quién lo hace |
|---|---|---|
| **Semana 1** | Cuenta Mercury aprobada. Recibes acceso al dashboard, routing number y tarjeta virtual. | Exentax coordina, Mercury aprueba |
| **Semana 2** | Configuración de Stripe/PayPal/DoDo + Slash (tesorería) + Wallester (tarjetas corporativas). | Exentax te guía, tú verificas |
| **Semana 3** | Primeras facturas a clientes. Primer cobro real en tu cuenta Mercury. ¡Champán! | Tú facturas, Mercury recibe |
| **Semana 4** | Rutina establecida. Separación de cuentas clara. Dashboard financiero organizado. | Tú operas, nosotros supervisamos |

## ¿Y el compliance?

Durante el primer mes no tienes ninguna obligación fiscal. Cero. Nada. Las declaraciones ante el IRS (Form 5472 y Form 1120) se presentan una vez al año, y nosotros nos encargamos de todo eso como parte del servicio de mantenimiento anual.

Tu única responsabilidad es operar tu negocio con normalidad y mantener las cuentas separadas (cuenta de la LLC para el negocio, cuenta personal para lo personal). Nosotros nos ocupamos de todo el papeleo, los plazos y los formularios.

## Las dudas más comunes del primer mes

**"¿Puedo sacar dinero de la cuenta de la LLC?"**
Sí. Se llaman Owner's Draws. Transfieres de Mercury a tu cuenta personal. Documéntalo como distribución de beneficios. Nosotros lo registramos para el Form 5472.

**"¿Necesito facturar en inglés?"**
No es obligatorio, pero es recomendable si tus clientes son internacionales. La factura va con el nombre de tu LLC, la dirección del agente registrado, tu EIN y los datos bancarios.

**"¿Cuándo empiezo a ahorrar en impuestos?"**
Desde la primera factura que emitas a través de la LLC. El ahorro fiscal se materializa cuando declares en tu país de residencia con la base imponible optimizada.

**"¿Y si me arrepiento?"**
Puedes disolver la LLC en cualquier momento. Pero nadie se ha arrepentido todavía. Una vez que ves la diferencia en números, no hay vuelta atrás.

## ¿Listo para empezar?

Si quieres saber cómo sería tu primer mes con una LLC, agenda una asesoría gratuita. Te explicamos el proceso completo, hacemos los números con tu facturación real y resolvemos todas tus dudas. En 30 minutos tendrás claro si la LLC es para ti.

Acabas de constituir tu LLC o estás a punto de hacerlo? Habla con nuestro equipo y te guiamos paso a paso durante tu primer mes.`,
    category: "Operativa",
    readTime: 6,
    publishedAt: "2026-03-03",
    updatedAt: "2026-04-15",
    metaTitle: "Tu primer mes con una LLC: paso a paso completo | Exentax",
    metaDescription: "Primer mes con tu LLC: Mercury, Slash, Wallester, Stripe, primeras facturas y rutina operativa. Todo lo que pasa semana a semana, explicado paso a paso.",
  },
  {
    slug: "llc-desarrolladores-software-saas",
    title: "LLC para desarrolladores de software y SaaS: la estructura ideal",
    excerpt: "Si vendes software, suscripciones o servicios técnicos a clientes globales, una LLC americana es probablemente la mejor estructura para tu negocio.",
    content: `Los desarrolladores de software y fundadores de SaaS son, junto con los creadores de contenido, el perfil que mejor encaja con una LLC americana. El motivo es simple: tu producto es 100% digital, tus clientes están en todo el mundo y tu negocio no depende de ninguna ubicación física.

## Por qué el software y las LLC encajan perfectamente

### Clientes globales, cobro en dólares

Si vendes un SaaS o servicios de desarrollo, es muy probable que buena parte de tus clientes estén en Estados Unidos, Europa o el resto del mundo. Con una LLC:

- Cobras directamente en dólares sin conversiones innecesarias.
- Configuras Stripe para aceptar pagos con tarjeta de cualquier país.
- Emites facturas profesionales desde una empresa americana.
- Accedes a ACH para cobros recurrentes con comisiones mínimas.

### Integración con todas las herramientas

Las herramientas que usan los desarrolladores están pensadas para empresas americanas:

- **Stripe Atlas**: Muchos fundadores de SaaS empiezan aquí, pero Exentax ofrece un servicio más completo y personalizado.
- **GitHub Sponsors**: Pagos directos a tu cuenta americana.
- **AWS / Google Cloud / Azure**: Facturación directa a tu LLC.
- **App Store / Google Play**: Si tienes apps, los pagos van directo a tu cuenta.

### Propiedad intelectual

Tu código, tu marca y tu producto son activos de tu LLC. Esto significa que están protegidos por la estructura de responsabilidad limitada y por el marco legal americano, uno de los más robustos del mundo en protección de propiedad intelectual.

## Casos típicos

**Freelancer de desarrollo**: Trabajas para startups americanas o europeas. Con una LLC, facturas como empresa americana, cobras en dólares y operas al mismo nivel que tus clientes.

**Fundador de SaaS**: Tienes una app con suscripciones mensuales. Stripe US procesa los pagos, App Store y Google Play depositan en tu cuenta Mercury, y tu propiedad intelectual está protegida bajo el marco legal americano.

**Desarrollador de apps**: Publicas en App Store y Google Play. Apple y Google pagan directamente a tu cuenta bancaria americana. Sin retenciones innecesarias, sin intermediarios que se llevan un mordisco extra.

## App Store y Google Play: cobrar sin dolores de cabeza

Si desarrollas apps o juegos móviles, la LLC te da acceso directo a las plataformas más importantes:

### Apple App Store
- Apple paga a cuentas bancarias americanas sin retención adicional si tienes el W-8BEN-E correctamente configurado con tu EIN
- Los pagos se depositan mensualmente en tu cuenta Mercury
- Puedes gestionar múltiples apps desde la misma cuenta de desarrollador

### Google Play
- Similar a Apple: pagos directos a tu cuenta bancaria US
- Sin conversiones de divisa forzadas
- Dashboard completo de ventas y métricas

### Stripe Billing para SaaS
Si tu modelo de negocio son suscripciones, Stripe Billing es tu mejor amigo:
- Cobros recurrentes automáticos
- Gestión de planes, upgrades y downgrades
- Dunning management (recuperación de pagos fallidos)
- Tax calculation automático para ciertos países
- Comisiones claras: 2.9% + $0.30 por transacción US

### DoDo Payments para ventas B2C globales
Si tu SaaS vende directamente a consumidores finales en múltiples países, **DoDo Payments** actúa como Merchant of Record: calcula, recauda y remite el IVA/GST de cada país automáticamente. No necesitas registrarte para IVA en 40 jurisdicciones diferentes.

### Slash y Wallester: tesorería y control de gastos
- **Slash** para que el MRR acumulado genere rendimiento mientras decides cuándo distribuir, ideal para SaaS con ingresos recurrentes predecibles
- **Wallester** para tarjetas corporativas virtuales: una para AWS, otra para GitHub, otra para herramientas del equipo, control granular sin compartir tarjeta de débito

## Propiedad intelectual: tu código protegido

Tu código, tu marca, tus algoritmos, tu diseño, todo es propiedad intelectual que pertenece a tu LLC. Esto tiene ventajas enormes:

- **Protección bajo ley estadounidense**: uno de los marcos legales más robustos del mundo en propiedad intelectual
- **Separación patrimonial**: si alguien copia tu código o viola tu marca, la demanda la pone tu LLC, no tú como persona
- **Licencias y royalties**: puedes licenciar tu software a través de la LLC con estructuras fiscales optimizadas
- **Valuación**: si algún día quieres vender tu empresa o levantar inversión, tener la IP en una LLC americana facilita enormemente el proceso

## ¿A partir de cuánto tiene sentido?

Para desarrolladores freelance, a partir de 3.000€/mes de facturación la estructura suele compensar. Para SaaS con MRR (Monthly Recurring Revenue), incluso con importes menores puede tener sentido por las ventajas operativas (acceso a Stripe, cobro en dólares, credibilidad).

En la asesoría gratuita analizamos tu caso y te decimos exactamente si compensa o no. Si no tiene sentido para ti ahora, te lo diremos directamente y te indicaremos a partir de qué punto podría empezar a valer la pena.

Agenda tu llamada gratuita de 30 minutos y lo vemos juntos.

Desarrollas software o tienes un SaaS y quieres optimizar tu estructura fiscal? Contacta con nosotros y te explicamos cómo montar tu LLC de forma óptima.`,
    category: "Guías",
    readTime: 5,
    publishedAt: "2026-03-02",
    updatedAt: "2026-04-15",
    metaTitle: "LLC para desarrolladores de software y SaaS: estructura completa | Exentax",
    metaDescription: "LLC para devs y SaaS: Stripe Billing, DoDo Payments (MoR), Slash tesorería, Mercury. Propiedad intelectual protegida y cobro global sin fricciones.",
  },
  {
    slug: "escalar-negocio-digital-llc-americana",
    title: "Cómo escalar tu negocio digital con una LLC americana",
    excerpt: "Una LLC no es solo una estructura fiscal. Es una herramienta de crecimiento que te da acceso a mercados, herramientas y oportunidades que antes no tenías.",
    content: `Muchos emprendedores piensan en una LLC americana solo en términos fiscales. Pero la realidad es que una LLC es mucho más que eso: es una plataforma de crecimiento que transforma la forma en que operas, vendes y escalas tu negocio.

## De local a global en una estructura

Cuando operas como autónomo o con una empresa local, estás limitado por las reglas de tu país: las plataformas de pago disponibles, las comisiones bancarias, la percepción que tienen los clientes internacionales de tu negocio.

Con una LLC americana, esas limitaciones desaparecen:

- **Vendes a cualquier país** sin fricciones de cobro.
- **Accedes a todas las plataformas** de pago y servicios sin restricciones geográficas.
- **Operas en dólares**: la moneda más aceptada del mundo.
- **Contratas talento internacional** pagando desde tu cuenta americana.

## Acceso a mercados que antes estaban cerrados

### El mercado americano

Estados Unidos es el mayor mercado del mundo para servicios digitales. Muchas empresas americanas prefieren, o incluso exigen, trabajar con proveedores que tengan una estructura empresarial americana.

Con tu LLC, puedes participar en licitaciones, responder a ofertas de trabajo para empresas y cerrar contratos que antes no estaban a tu alcance.

### Plataformas sin restricciones

Stripe, PayPal, Amazon, Shopify, Gumroad, Teachable, Webflow... Todas estas plataformas dan acceso completo y sin limitaciones a empresas americanas. Sin bloqueos por país, sin funcionalidades recortadas, sin sorpresas.

## Herramientas de crecimiento

Con una LLC tienes acceso a un ecosistema completo de herramientas empresariales:

- **Mercury o Relay** como tu hub financiero (Column NA / Thread Bank, $0 wires).
- **Slash** para tesorería corporativa, tu capital ocioso genera rendimiento mientras decides cuándo usarlo.
- **Wallester** para tarjetas corporativas virtuales y físicas con control granular de gastos.
- **Stripe** para cobros con tarjeta de cualquier país.
- **Adyen** para procesamiento enterprise y links de pago a través de Relay.
- **DoDo Payments** como Merchant of Record para ventas B2C globales (gestión automática de IVA/GST).
- **Wise Business / Revolut Business** para conversión de divisas y operaciones multi-divisa.
- **Interactive Brokers** para inversión corporativa, acceso a 150+ mercados globales desde tu LLC.
- **Kraken** para gestión de activos digitales a nivel corporativo.
- **QuickBooks o Wave** para contabilidad básica.
- **Gusto o Deel** si necesitas gestionar pagos a colaboradores.
- **Carta** si decides dar equity a cofundadores o inversores.

## Crecimiento sin burocracia

Una de las grandes ventajas de la LLC americana es su simplicidad. No necesitas:

- Levantar actas de juntas.
- Tener un consejo de administración.
- Publicar cuentas anuales.
- Cumplir con burocracia corporativa compleja.

El mantenimiento anual es sencillo: unas declaraciones ante el IRS (que nosotros presentamos por ti) y la renovación del agente registrado. El resto del tiempo, te dedicas a hacer crecer tu negocio.

## Contratar freelancers y subcontratistas

Cuando tu negocio crece, necesitas delegar. Con tu LLC puedes contratar talento internacional de forma sencilla:

- **Deel o Remote**: Plataformas que te permiten contratar freelancers internacionales con contratos estandarizados y pagos automatizados desde tu cuenta Mercury
- **Pagos directos**: Wire transfers o ACH desde Mercury a tus colaboradores ($0 en comisiones de wire, recuerda)
- **Wise Business**: Para pagar a freelancers en su moneda local al tipo de cambio real (Wise es una EMI, no un banco, pero complementa perfectamente a Mercury)
- **Form 1099**: Si contratas a freelancers americanos, deberás emitir un 1099-NEC. Si contratas a extranjeros, usas el W-8BEN

## Financiación y venture capital

Si tu negocio digital llega al punto de necesitar inversión externa, la LLC americana te posiciona mucho mejor:

- **Inversores americanos prefieren entidades americanas**: si tu LLC está en Delaware, mejor aún para VCs
- **Puedes convertir de LLC a C-Corp** si decides levantar una ronda de financiación formal
- **SAFEs y Convertible Notes**: instrumentos de inversión estándar en el ecosistema americano, fáciles de implementar con una entidad US
- **Credibilidad ante inversores**: tener una LLC americana con historial bancario en Mercury demuestra que operas como un profesional serio

## Expandir a nuevos mercados

Tu LLC americana es tu pasaporte a mercados que antes estaban cerrados:

- **Amazon FBA**: Vende productos físicos en el marketplace más grande del mundo
- **Shopify con Stripe US**: Tienda online sin restricciones geográficas
- **SaaS global**: Vende suscripciones a clientes de cualquier país
- **Programas de partners**: Muchos programas de afiliados y partners solo aceptan empresas americanas

## El momento de dar el paso

Si estás facturando regularmente, tienes clientes internacionales y sientes que tu estructura actual te limita, ya sabes lo que hay que hacer.

En Exentax no solo constituimos tu LLC, diseñamos todo el ecosistema y te acompañamos en el crecimiento. Desde la primera factura hasta que necesites convertir a C-Corp para tu ronda Series A (sí, hemos acompañado a clientes en ese camino). Banca (Mercury/Relay), tesorería (Slash), tarjetas (Wallester), pagos (Stripe/Adyen/DoDo), conversión de divisas (Wise/Revolut), inversión corporativa (Interactive Brokers/Kraken), todo integrado.

Agenda tu asesoría gratuita de 30 minutos. Analizamos tu situación, te decimos si tiene sentido escalar con una LLC, y diseñamos la estructura que te permita crecer sin techo.`,
    category: "Operativa",
    readTime: 6,
    publishedAt: "2026-03-02",
    updatedAt: "2026-04-15",
    metaTitle: "Escalar tu negocio digital con LLC: ecosistema completo | Exentax",
    metaDescription: "LLC como plataforma de crecimiento: Mercury, Slash, Wallester, Stripe, Adyen, DoDo, IB, Kraken. Acceso a mercados globales y herramientas sin restricciones.",
  },
  {
    slug: "due-diligence-bancario-llc-americana",
    title: "Due diligence bancario: qué verifican los bancos cuando abres una cuenta para tu LLC",
    excerpt: "Antes de aprobar tu cuenta, Mercury, Relay y otros bancos realizan una verificación exhaustiva. Te explicamos qué revisan, qué documentos piden y cómo prepararte.",
    content: `Cuando solicitas una cuenta bancaria empresarial para tu LLC en Estados Unidos, el banco no simplemente te abre una cuenta. Realiza un proceso de due diligence (debida diligencia) para verificar que tu empresa es legítima y que tú eres quien dices ser.

Entender este proceso te ayuda a prepararte mejor y acelerar la apertura de tu cuenta.

## ¿Qué es la due diligence bancaria?

Es el proceso mediante el cual un banco investiga y verifica la información de un nuevo cliente antes de aceptarlo. Para una LLC con propietario extranjero, este proceso es más exhaustivo que para un ciudadano estadounidense, porque el banco debe cumplir con regulaciones adicionales de compliance internacional.

## Qué documentos te pedirán

### Documentos de la LLC:
- **Articles of Organization**: el documento de constitución de tu LLC
- **EIN Confirmation Letter**: la carta del IRS confirmando tu número fiscal
- **Operating Agreement**: el acuerdo que gobierna tu LLC
- **Certificate of Good Standing**: (si la LLC tiene más de un año) confirma que está activa y al día

### Documentos personales:
- **Pasaporte vigente**: es el documento de identidad más aceptado internacionalmente
- **Prueba de dirección**: factura de servicios, extracto bancario o carta oficial reciente
- **Número de identificación fiscal**: de tu país de residencia

### Información sobre tu negocio:
- **Descripción de la actividad**: qué hace tu LLC, cómo genera ingresos
- **Volumen esperado de transacciones**: cuánto esperas mover mensualmente
- **Principales clientes y proveedores**: de qué países y en qué sectores
- **Sitio web o presencia online**: LinkedIn, portfolio, página web de tu negocio

## El proceso de verificación paso a paso

### 1. Solicitud inicial
Rellenas el formulario de apertura de cuenta con todos los datos de tu LLC y tus datos personales. En Mercury, este proceso es 100% online.

### 2. Verificación de identidad
El banco verifica tu pasaporte y tu dirección. Pueden usar servicios de verificación automatizada o pedirte documentación adicional.

### 3. Revisión del negocio
Un equipo de compliance revisa la naturaleza de tu negocio, tu sitio web y la coherencia entre lo que declaras y lo que ven online.

### 4. Decisión
Si todo está en orden, tu cuenta se aprueba en 1-5 días hábiles. Si necesitan más información, te contactarán.

## Sectores que requieren mayor due diligence

Algunos sectores reciben un escrutinio adicional por parte de los bancos:

- **Criptomonedas y trading**: regulación en evolución constante
- **Servicios financieros**: requieren licencias adicionales en muchos estados
- **Industrias reguladas**: farmacéutica, gaming, productos para adultos
- **Consultoría a gobiernos**: implica riesgos de compliance adicionales

Si tu negocio está en uno de estos sectores, no significa que no puedas abrir una cuenta. Simplemente, el proceso puede llevar más tiempo y requerir más documentación.

## Cómo facilitar el proceso

1. **Ten todos los documentos listos antes de aplicar**: Articles of Organization, EIN, Operating Agreement, pasaporte
2. **Asegúrate de que tu sitio web está activo y actualizado**: los bancos lo revisan
3. **Sé claro y consistente**: la descripción de tu negocio debe coincidir en todos los documentos
4. **Responde rápidamente** a cualquier solicitud adicional del banco
5. **No exageres ni minimices** tus volúmenes esperados, sé realista

## Mercury vs. bancos tradicionales

Mercury ha simplificado enormemente el proceso de due diligence para LLCs con propietarios extranjeros. Mientras que un banco tradicional puede tardar semanas o meses, Mercury suele completar el proceso en días.

Otras ventajas de Mercury para el due diligence:
- **Proceso 100% digital**: no necesitas visitar una sucursal
- **Documentación estándar**: no piden documentos exóticos ni apostillas
- **Equipo familiarizado con LLCs de no residentes**: entienden tu situación

## Dato importante sobre Mercury

Mercury usa **Column NA** (Column National Association) como banco custodio. Es un banco con licencia federal, regulado por la FDIC. Tus depósitos están asegurados hasta $250,000, con cobertura extendida disponible hasta $5M a través del programa de barrido.

Mercury ha simplificado enormemente la due diligence para LLCs de no residentes. Su equipo está familiarizado con esta estructura y el proceso es 100% digital. Los wires nacionales e internacionales son $0.

## Qué pasa cuando el due diligence falla

Si Mercury (o cualquier fintech) rechaza tu solicitud, las razones más comunes son:

1. **Documentación inconsistente**: el nombre en el pasaporte no coincide exactamente con el del Operating Agreement, o la dirección del EIN no cuadra con la del Registered Agent.
2. **Actividad no compatible**: Mercury no acepta todas las industrias. Negocios de cannabis, armas, gambling, o ciertos tipos de actividad financiera son excluidos.
3. **Falta de presencia online**: si tu LLC no tiene sitio web, perfil de LinkedIn ni rastro digital, el equipo de compliance no puede verificar que tu negocio existe.
4. **Información incompleta**: dejaste campos en blanco o diste respuestas vagas sobre la actividad de tu LLC.

La diferencia entre ser rechazado y ser aprobado suele estar en la preparación. Un paquete de documentación completo, coherente y profesional se aprueba rápido. Un paquete desordenado levanta dudas.

## La due diligence no termina en la apertura

Muchos freelancers creen que una vez abierta la cuenta, el compliance se acabó. No es así. Los bancos y fintechs realizan monitorización continua (ongoing due diligence):

- **Revisiones periódicas**: pueden pedirte actualizar información sobre tu negocio cada 6-12 meses
- **Monitorización de transacciones**: el sistema detecta automáticamente patrones inusuales
- **Solicitudes puntuales**: si una transacción específica levanta una alerta, te pedirán documentación de soporte (factura, contrato, explicación)

La clave para no tener problemas: mantén un flujo de operaciones coherente con lo que declaraste al abrir la cuenta. Si tu negocio crece significativamente, actualiza tu perfil proactivamente.

## Cómo lo coordinamos en Exentax

Preparamos toda la documentación antes de enviar la solicitud a Mercury. Articles, EIN, Operating Agreement, pasaporte: todo alineado y coherente. El resultado es una aprobación rápida y sin rechazos.

Además, coordinamos la verificación de cada herramienta adicional: Slash, Wallester, Wise Business, Revolut Business, Stripe. Cada una tiene su propio proceso de due diligence, y nosotros preparamos la documentación específica para cada una.`,
    category: "Compliance",
    readTime: 7,
    publishedAt: "2026-03-04",
    updatedAt: "2026-04-15",
    metaTitle: "Due diligence bancario para LLC: qué verifican Mercury y fintechs | Exentax",
    metaDescription: "Due diligence para LLCs: qué documentos piden Mercury, Slash, Wallester y fintechs. Cómo prepararte para abrir cuentas empresariales sin rechazos.",
  },
  {
    slug: "estructura-fiscal-optima-freelancer-internacional",
    title: "La estructura fiscal óptima para freelancers internacionales en 2026",
    excerpt: "Autónomo, LLC, sociedad local o estructura mixta: comparamos tributación real, cuotas, protección patrimonial y acceso a banca internacional para freelancers que facturan a clientes de varios países.",
    content: `Si eres freelancer y trabajas con clientes internacionales, probablemente estés pagando más impuestos de los necesarios. No porque estés haciendo algo mal, sino porque tu estructura fiscal no está optimizada para tu realidad: ingresos internacionales, clientes en múltiples países y una actividad 100% digital.

En este artículo te explicamos las opciones disponibles y te ayudamos a identificar cuál se adapta mejor a tu situación.

## El problema del freelancer internacional

La mayoría de freelancers internacionales operan como autónomos en su país de residencia. Esto significa:

- **Tributación máxima**: en España, por ejemplo, puedes pagar entre el 30% y el 47% sobre tus ingresos
- **Cuotas fijas**: la cuota de autónomo (300€+/mes en España) se paga independientemente de si facturas o no
- **Limitaciones operativas**: cobrar en dólares, usar Stripe sin restricciones, tener una cuenta empresarial internacional
- **Cero protección patrimonial**: como autónomo, respondes con todo tu patrimonio personal

## Las opciones de estructura fiscal

### Opción 1: Autónomo en tu país (situación actual)

Es la opción por defecto y la más cara fiscalmente. Funciona si facturas poco, todos tus clientes son locales y no necesitas infraestructura internacional.

**Ventajas:**
- Simplicidad administrativa
- Sin costes de constitución
- Acceso a seguridad social local

**Desventajas:**
- Tributación alta (30-47% en muchos países)
- Cuota fija mensual
- Sin protección patrimonial
- Limitaciones para cobrar internacionalmente

### Opción 2: LLC en Estados Unidos

La opción más popular entre freelancers internacionales con clientes fuera de su país. La LLC americana ofrece:

**Ventajas:**
- Optimización fiscal legal: la LLC funciona con <a href="/es/blog/tributacion-pass-through-llc-como-funciona">tributación pass-through</a>, sin impuestos corporativos en EE.UU. si no tienes presencia física
- Acceso a <a href="/es/blog/bancos-vs-fintech-llc-donde-abrir-cuenta">banca en dólares</a> (Mercury, Relay)
- Stripe y PayPal sin restricciones
- Protección patrimonial, separación legal entre persona y empresa
- Credibilidad internacional
- Sin cuota fija mensual

**Desventajas:**
- Coste de constitución (consultar)
- Mantenimiento anual (que nosotros gestionamos por ti)
- Mayor complejidad fiscal (que simplificamos con nuestro servicio)

### Opción 3: Sociedad limitada en tu país

Constituir una SL (España), SAS (Colombia), SA de CV (México) u otra sociedad local. Puede tener sentido en algunos casos, pero no ofrece las ventajas internacionales de una LLC.

### Opción 4: Estructura mixta (LLC + sociedad local)

Para emprendedores con alto volumen, puede tener sentido combinar una LLC americana con una sociedad en tu país de residencia. La LLC factura internacionalmente y la sociedad local gestiona la operativa del país.

## ¿Cuándo tiene sentido una LLC?

La LLC americana empieza a tener sentido cuando:

- Facturas más de 15.000€/año a clientes internacionales
- La mayoría de tus clientes están fuera de tu país
- Necesitas cobrar en dólares o usar Stripe
- Quieres proteger tu patrimonio personal
- Buscas reducir legalmente tu carga fiscal

## La ventaja fiscal de la LLC para no residentes

La clave de la optimización fiscal con una LLC es su clasificación como "Disregarded Entity" por el IRS:

1. **La LLC no paga impuestos corporativos en EE.UU.**: si no tienes presencia física ni ingresos de fuente americana
2. **Los beneficios se declaran en tu país de residencia**: pero con la posibilidad de planificar distribuciones, deducir gastos profesionales y diferir tributación
3. **El resultado neto**: muchos de nuestros clientes pasan de pagar el 35-45% a pagar el 10-20% de forma completamente legal

## Pasos para implementar la estructura óptima

1. **Analiza tu situación actual**: cuánto facturas, de dónde vienen tus ingresos, cuánto pagas en impuestos
2. **Habla con Exentax**: analizamos tu caso concreto en la asesoría gratuita y te decimos exactamente qué estructura es la óptima
3. **<a href="/es/blog/constituir-llc-proceso-paso-a-paso">Constituye tu LLC</a>**: elige el estado adecuado según tu perfil
4. **Configura tu infraestructura**: <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">cuenta bancaria</a>, <a href="/es/blog/pasarelas-pago-llc-stripe-paypal-dodo">pasarela de pagos</a>, contabilidad
5. **Migra gradualmente**: no tienes que transferir todo de golpe

## El stack financiero óptimo para freelancers internacionales

La combinación ganadora que usamos para la mayoría de nuestros clientes:

| Herramienta | Función | Detalle clave |
|---|---|---|
| **Mercury** | Cuenta bancaria principal | Column NA, FDIC, $0 wires |
| **Slash** | Tesorería corporativa | Rendimiento sobre capital ocioso, no es un banco |
| **Wallester** | Tarjetas corporativas | Virtuales y físicas, control granular por gasto |
| **Wise Business** | Conversión de divisas | EMI, tipo de cambio mid-market real |
| **Revolut Business** | Multi-divisa complementario | EUR/GBP/USD, tarjetas para equipo |
| **Stripe US** | Cobrar a clientes | 2.9% + $0.30 por transacción |
| **DoDo Payments** | Ventas B2C globales | Merchant of Record, IVA/GST automático |
| **Relay** | Cuenta de respaldo | Thread Bank, 20 subcuentas gratis |
| **Interactive Brokers** | Inversión corporativa | 150+ mercados globales |
| **Kraken** | Activos digitales | Cuenta corporativa, staking institucional |

En Exentax hacemos todo este proceso contigo. Desde el análisis inicial hasta la constitución, pasando por la configuración de toda tu infraestructura financiera. Mercury, Slash, Wallester, Stripe, Wise, todo listo para facturar. Consulta también nuestra guía sobre <a href="/es/blog/gastos-deducibles-llc-que-puedes-deducir">gastos deducibles</a> para maximizar la eficiencia de tu estructura. Agenda una asesoría gratuita y analizamos si tiene sentido para tu caso concreto.

Quieres diseñar la estructura fiscal perfecta para tu negocio freelance internacional? Agenda tu asesoría gratuita y creamos un plan a medida.`,
    category: "Fiscalidad",
    readTime: 6,
    publishedAt: "2026-03-04",
    updatedAt: "2026-04-15",
    metaTitle: "Estructura fiscal óptima para freelancers internacionales 2026 | Exentax",
    metaDescription: "Autónomo vs LLC vs sociedad local vs estructura mixta: comparativa fiscal real para freelancers internacionales. Stack completo Mercury, Slash, Wallester, Stripe, DoDo.",
  },
  {
    slug: "prevencion-blanqueo-capitales-llc",
    title: "Prevención de blanqueo de capitales: lo que tu LLC necesita saber",
    excerpt: "BSA, KYC, CTR, SAR, FATCA y CRS: las regulaciones antiblanqueo que afectan a tu LLC en EE.UU. Qué hace el banco, qué debes hacer tú y cómo Exentax mantiene tu compliance impecable.",
    content: `Las regulaciones de prevención de blanqueo de capitales (AML. Anti-Money Laundering) son un pilar fundamental del sistema financiero internacional. Si tienes una LLC en Estados Unidos, estas regulaciones te afectan de forma directa, aunque tu negocio sea completamente legítimo.

La buena noticia: cumplir con estas regulaciones es sencillo si entiendes qué se espera de ti y mantienes buenas prácticas desde el primer día.

## ¿Por qué existen las regulaciones AML?

El sistema financiero global necesita mecanismos para prevenir que se use para actividades ilícitas. Las regulaciones AML obligan a las instituciones financieras a:

- **Verificar la identidad de sus clientes** (KYC. Know Your Customer)
- **Monitorear transacciones** en busca de patrones sospechosos
- **Reportar actividades sospechosas** a las autoridades correspondientes
- **Mantener registros** de todas las transacciones durante un período determinado

## Cómo te afectan como propietario de LLC

### 1. Apertura de cuentas bancarias

Cuando abres una cuenta bancaria para tu LLC, el banco realiza un proceso de <a href="/es/blog/due-diligence-bancario-llc-americana">due diligence</a> que incluye verificar tu identidad, la legalidad de tu empresa y la naturaleza de tu negocio. Este proceso es más exhaustivo para propietarios extranjeros.

### 2. Monitoreo de transacciones

Tu banco monitorea las transacciones de tu cuenta de forma continua. Si detecta patrones inusuales, puede pedirte documentación adicional o, en casos extremos, restringir temporalmente tu cuenta hasta aclarar la situación.

### 3. Reportes regulatorios

Dependiendo del volumen y tipo de transacciones, tu banco puede estar obligado a presentar reportes ante FinCEN (Financial Crimes Enforcement Network). Esto no significa que estés bajo investigación, es un procedimiento rutinario.

## El BSA: Bank Secrecy Act

El Bank Secrecy Act (BSA) es la ley federal que establece las obligaciones de compliance financiero en Estados Unidos. Sus principales requisitos para LLCs son:

### CTR (Currency Transaction Report)
Se genera automáticamente cuando se realizan transacciones en efectivo superiores a $10,000 en un mismo día. Para la mayoría de negocios digitales, esto no es relevante.

### SAR (Suspicious Activity Report)
El banco presenta un SAR cuando detecta una transacción que considera sospechosa. Tú no recibes notificación cuando esto ocurre. Es un proceso interno del banco.

### Registro de transacciones
Los bancos están obligados a mantener registros de ciertas transacciones durante al menos 5 años.

## Buenas prácticas para tu LLC

### 1. Mantén coherencia en tu actividad

Tu actividad bancaria debe ser coherente con lo que declaraste al abrir la cuenta. Si tu negocio evoluciona, actualiza tu perfil con el banco.

### 2. Documenta todo

Cada transacción significativa debe poder justificarse con documentación: contratos, facturas, recibos, correos electrónicos. Esto no solo es bueno para el compliance, también simplifica tu contabilidad.

### 3. Evita transacciones en efectivo

Los negocios digitales prácticamente no manejan efectivo. Mantén todas tus transacciones digitales y documentadas.

### 4. No hagas "structuring"

El structuring (dividir deliberadamente una transacción grande en múltiples pequeñas para evitar umbrales de reporte) es ilegal. Si necesitas hacer un pago grande, hazlo directamente.

### 5. Responde a solicitudes del banco

Si tu banco te pide información adicional, responde con prontitud y transparencia. Es un proceso rutinario que demuestra tu profesionalidad.

## El BOI Report y la prevención del blanqueo

El <a href="/es/blog/boi-report-fincen-guia-completa-2026">Beneficial Ownership Information (BOI) Report</a> que presentas ante FinCEN es parte del esfuerzo global contra el blanqueo de capitales. Al reportar quiénes son los propietarios reales de tu LLC, contribuyes a la transparencia del sistema corporativo.

## FATCA y CRS: intercambio de información fiscal

Si eres residente fiscal fuera de EE.UU., es importante conocer dos marcos de intercambio de información:

### FATCA (Foreign Account Tax Compliance Act)
Obliga a instituciones financieras extranjeras a reportar cuentas de ciudadanos estadounidenses. Como no residente, esto no te afecta directamente, pero sí afecta a las instituciones donde tienes cuentas.

### <a href="/es/blog/crs-cuentas-bancarias-llc-intercambio-informacion">CRS (Common Reporting Standard)</a>
Es el estándar global de intercambio automático de información fiscal entre países. Tu país de residencia y EE.UU. pueden intercambiar información sobre tus cuentas financieras.

## Tu LLC como señal de profesionalidad

Paradójicamente, tener una LLC bien constituida y mantener un compliance impecable te posiciona como un profesional serio ante bancos e instituciones financieras. Los que tienen problemas de compliance suelen ser quienes operan de forma informal, sin estructura legal ni documentación.

Tu LLC, con su EIN, sus declaraciones al día y su cuenta bancaria dedicada en <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a> (Column NA, FDIC, todo en orden), es exactamente lo que el sistema espera ver de un profesional que opera internacionalmente. Consulta nuestra guía sobre el <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a> para entender las declaraciones informativas que necesitas presentar.

No te compliques con las regulaciones AML, déjalo en manos de quien sabe. En Exentax nos encargamos de que toda tu estructura esté siempre en cumplimiento. Constitución, declaraciones anuales, coordinación con bancos, BOI Report ante FinCEN. Tú te dedicas a tu negocio, nosotros nos aseguramos de que cada papel esté perfecto.`,
    category: "Compliance",
    readTime: 5,
    publishedAt: "2026-03-03",
    updatedAt: "2026-04-15",
    metaTitle: "Prevención de blanqueo (AML/KYC) para tu LLC en EE.UU. 2026 | Exentax",
    metaDescription: "BSA, CTR, SAR, FATCA y CRS: regulaciones AML que afectan a tu LLC americana. Due diligence bancario, BOI Report y buenas prácticas de compliance.",
  },
  {
    slug: "fiscalidad-internacional-emprendedores-digitales",
    title: "Fiscalidad internacional para emprendedores digitales: todo lo que necesitas saber",
    excerpt: "Residencia fiscal, doble imposición, establecimiento permanente y sustancia económica: los conceptos clave que todo emprendedor digital necesita dominar para optimizar su estructura con una LLC.",
    content: `La fiscalidad internacional es uno de los temas más importantes, y más malentendidos, para emprendedores digitales. Si vendes servicios o productos digitales a clientes de varios países, necesitas entender cómo funciona el sistema fiscal global para tomar las mejores decisiones para tu negocio.

## Los fundamentos de la fiscalidad internacional

### 1. Residencia fiscal

Tu residencia fiscal determina en qué país tributas por tu renta mundial. No es lo mismo que tu nacionalidad ni que tu dirección postal. Los criterios varían por país, pero generalmente incluyen:

- **Días de permanencia**: la regla de los 183 días es la más común
- **Centro de intereses vitales**: dónde está tu familia, tus bienes, tu actividad económica principal
- **Domicilio habitual**: dónde tienes tu vivienda principal

### 2. Fuente del ingreso

La fuente del ingreso determina si un país puede gravar una renta específica. Para servicios digitales prestados remotamente, la fuente suele ser el lugar donde se realiza el trabajo, no donde está el cliente.

### 3. Doble imposición

Cuando dos países reclaman el derecho a gravar el mismo ingreso, se produce la doble imposición. Los tratados de doble imposición (CDI) entre países establecen mecanismos para evitarla.

## Cómo tributa un emprendedor digital

### Escenario típico:
Vives en España, tienes una LLC en EE.UU. y tus clientes están en Alemania, Reino Unido, EE.UU. y México.

**¿Dónde tributas?**

1. **En EE.UU.:** Tu LLC como Disregarded Entity con propietario no residente no paga impuestos federales si tus ingresos son de fuente extranjera (trabajas desde fuera de EE.UU.)

2. **En tu país de residencia:** Como residente fiscal, tributas por renta mundial. Los beneficios netos de tu LLC tributan en tu país, pero sobre la base reducida por los gastos deducibles de la LLC.

3. **En los países de tus clientes:** Generalmente no tienes obligación fiscal en los países de tus clientes si prestas servicios remotamente desde tu país de residencia.

## Conceptos fiscales clave

### Establecimiento permanente

Un establecimiento permanente (EP) es una presencia fija de negocio en un país que puede generar obligación fiscal. Para emprendedores digitales que trabajan remotamente, generalmente NO tienen EP en los países de sus clientes.

### Transfer pricing (precios de transferencia)

Si tienes varias entidades (por ejemplo, una LLC y un autónomo en tu país), las transacciones entre ellas deben hacerse a precios de mercado. Esto se conoce como el principio de arm's length.

### Sustancia económica

Para que una estructura fiscal sea válida, debe tener sustancia económica real. Tu LLC debe operar como un negocio real con actividad económica genuina, no puede ser una estructura vacía creada solo para reducir impuestos.

## Estrategias de optimización fiscal legal

### 1. Estructura LLC + residencia fiscal optimizada

Combinar una LLC americana con una residencia fiscal en un país con tributación favorable es la estrategia más efectiva. Países como Portugal, Andorra, o ciertos países de Latinoamérica ofrecen regímenes especiales para profesionales internacionales.

### 2. Deducción de gastos profesionales

Con una LLC, puedes deducir <a href="/es/blog/gastos-deducibles-llc-que-puedes-deducir">gastos profesionales legítimos</a>: software, herramientas, formación, espacio de trabajo, viajes de negocio. Esto reduce tu base imponible antes de tributar en tu país de residencia.

### 3. Planificación de distribuciones

Puedes planificar cuándo y cuánto distribuir de tu LLC a tu patrimonio personal. Esto te da control sobre tu tributación anual y te permite diferir beneficios cuando tiene sentido fiscal.

### 4. Aprovechar tratados fiscales

Los tratados de doble imposición entre tu país de residencia y EE.UU. pueden ofrecerte beneficios adicionales. En Exentax los analizamos contigo para identificar y aprovechar estas oportunidades.

## Lo que NO debes hacer

- **No ignores tus obligaciones fiscales**: en ningún país
- **No creates estructuras sin sustancia económica**: los reguladores las detectan
- **No mezcles finanzas personales y empresariales**: compromete tu estructura
- **No tomes decisiones fiscales sin asesoría profesional**: cada situación es diferente

## El futuro de la fiscalidad digital

La OCDE está trabajando en el marco BEPS 2.0 (Pillar One y Pillar Two) para adaptar el sistema fiscal internacional a la economía digital. Estos cambios afectarán principalmente a grandes multinacionales, pero es importante que los emprendedores digitales estén al tanto de las evoluciones normativas.

## El stack que lo simplifica todo

No necesitas ser experto en fiscalidad internacional para optimizar tu situación. Necesitas las herramientas correctas y un equipo que sepa usarlas:

- **<a href="/es/blog/constituir-llc-proceso-paso-a-paso">LLC en NM o WY</a>**: la base de tu estructura, $0 federal, <a href="/es/blog/tributacion-pass-through-llc-como-funciona">pass-through taxation</a>
- **<a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a>**: tu hub financiero (Column NA, FDIC, $0 wires)
- **Slash**: tesorería corporativa (rendimiento sobre capital ocioso, no es un banco)
- **Wallester**: tarjetas corporativas (control granular, virtuales y físicas)
- **Wise Business**: tu herramienta de conversión (EMI, tipo de cambio real)
- **Revolut Business**: complemento multi-divisa (EUR/GBP, tarjetas para equipo)
- **Stripe US**: tu procesador de pagos (135+ divisas, sin restricciones geográficas)
- **DoDo Payments**: Merchant of Record para ventas B2C (IVA/GST automático)
- **Interactive Brokers / Kraken**: inversión corporativa y activos digitales
- **Exentax**: tu equipo fiscal (constitución, compliance, declaraciones, soporte continuo)

En Exentax seguimos de cerca todos los desarrollos regulatorios internacionales para adaptar las estrategias de nuestros clientes. No te vas a despertar un día con una nueva norma que te pille desprevenido, nosotros la habremos leído, analizado y te habremos avisado antes. Si quieres ver cómo varía la tributación según tu país, consulta nuestra guía sobre <a href="/es/blog/fiscalidad-llc-por-pais-residencia">fiscalidad de la LLC por país de residencia</a>.

Agenda tu asesoría gratuita y diseñamos la estructura fiscal óptima para tu situación.`,
    category: "Fiscalidad",
    readTime: 6,
    publishedAt: "2026-03-03",
    updatedAt: "2026-04-15",
    metaTitle: "Fiscalidad internacional para emprendedores digitales 2026 | Exentax",
    metaDescription: "Residencia fiscal, fuente del ingreso, doble imposición, establecimiento permanente, sustancia económica y BEPS 2.0. Estrategias de optimización legal con LLC.",
  },
  {
    slug: "extension-irs-form-1120-como-solicitarla",
    title: "Extensión del IRS para el Form 1120: qué es el Form 7004 y cómo solicitarlo",
    excerpt: "El Form 7004 te da 6 meses extra para presentar tu Form 1120 + Form 5472. Es automático, gratis y sin justificación. Más del 50% de empresas en EE.UU. lo usan. En Exentax lo presentamos por ti cada año.",
    content: `Si tienes una LLC en Estados Unidos, cada año debes presentar el Form 1120 (junto con el <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a>) antes del 15 de abril. Pero aquí va una noticia que te va a encantar: puedes extender ese plazo 6 meses completos, hasta el 15 de octubre, sin dar explicaciones. Así de fácil.

¿Cómo? Con el Form 7004. Y en Exentax lo presentamos automáticamente por todos nuestros clientes, porque es lo más inteligente que puedes hacer.

## ¿Qué es el Form 7004?

El Form 7004 es la solicitud oficial de extensión automática del IRS para declaraciones de impuestos de empresas. Cuando lo presentas correctamente, el IRS te concede 6 meses adicionales para enviar tu Form 1120, sin preguntas, sin justificaciones, sin dramas.

Sí, has leído bien: **automática**. El IRS no evalúa tu solicitud, no la puede denegar si está bien hecha, y no necesitas dar ningún motivo. Simplemente presentas el formulario antes del 15 de abril y tu nuevo plazo pasa a ser el 15 de octubre.

## ¿Por qué es tan común pedir extensión?

Porque es una práctica estándar en el mundo empresarial estadounidense. **Más del 50% de las declaraciones de impuestos corporativas se presentan con extensión.** No es algo raro ni sospechoso, es lo normal.

Las razones son prácticas:

- **Más tiempo para recopilar documentación.** Extractos bancarios, facturas, registros de transacciones... tener 6 meses extra permite preparar todo con calma.
- **Menos errores.** Una declaración presentada con prisa es una declaración con errores. Con extensión, hay tiempo para revisar cada detalle.
- **Mejor planificación fiscal.** Te da margen para optimizar deducciones y estructurar tu situación de la mejor manera posible.
- **Flexibilidad operativa.** No tienes que paralizar tu negocio en marzo para correr detrás de papeles.

## ¿Cómo funciona exactamente?

El proceso es sencillo:

### Paso 1: Presentar el Form 7004 antes del 15 de abril

El formulario debe llegar al IRS antes de la fecha límite original de tu declaración. Si tu año fiscal coincide con el año calendario (enero-diciembre), esa fecha es el **15 de abril**.

### Paso 2: Incluir la información básica de tu LLC

El Form 7004 pide datos simples:

- Nombre de la LLC
- EIN (Employer Identification Number)
- Dirección de la empresa
- Tipo de formulario que estás extendiendo (Form 1120)
- Año fiscal

### Paso 3: Estimación de impuestos (si aplica)

Aquí viene la parte importante: **la extensión es para presentar la declaración, no para pagar impuestos.** Si tu LLC debe impuestos federales, debes pagar la cantidad estimada antes del 15 de abril, aunque presentes la declaración en octubre.

Pero, y esto es clave. **para la mayoría de Single-Member LLCs con propietarios extranjeros sin ingresos de fuente estadounidense, el impuesto federal es $0** gracias a la <a href="/es/blog/tributacion-pass-through-llc-como-funciona">tributación pass-through</a>. Así que la extensión es puramente un trámite administrativo sin coste fiscal adicional.

### Paso 4: Recibir la extensión automática

No recibes una carta de aprobación. La extensión es automática. Si presentaste el Form 7004 correctamente y a tiempo, tu nuevo plazo es el 15 de octubre. Punto.

## ¿Cómo se presenta el Form 7004?

Hay dos formas:

**Electrónicamente (e-file):** Es la forma más rápida y recomendada. Se presenta a través de sistemas autorizados por el IRS. Confirmación inmediata.

**Por correo postal:** Se envía el formulario en papel al centro de procesamiento del IRS correspondiente. Más lento, pero igualmente válido. Se recomienda enviar por correo certificado para tener comprobante de envío.

## ¿Qué pasa si no pido extensión y no presento a tiempo?

Aquí la cosa se pone seria. Si no presentas el Form 1120 antes del 15 de abril y tampoco has pedido extensión, el IRS puede aplicar sanciones. Y tratándose de LLCs con propietarios extranjeros, las sanciones por no presentar el Form 5472 a tiempo son especialmente relevantes.

¿La solución más fácil? Pedir la extensión. Es gratis, es automática y te da 6 meses de tranquilidad.

## ¿Puedo pedir extensión todos los años?

**Sí.** No hay límite. Puedes presentar el Form 7004 cada año fiscal sin ningún problema. De hecho, muchos contadores en Estados Unidos presentan extensión para todos sus clientes como práctica estándar. Es lo más profesional.

## En Exentax lo hacemos automáticamente

Esto es algo que nos diferencia: **en Exentax presentamos el Form 7004 automáticamente para todos nuestros clientes de mantenimiento anual.** No tienes que pedirlo, no tienes que acordarte, no tienes que hacer nada.

Antes del 15 de abril, nos aseguramos de que tu extensión esté presentada. Después, con calma y sin prisas, preparamos tu Form 1120 y Form 5472 con toda la documentación en orden. Así trabajamos, sin sorpresas, sin sustos de última hora.

### Lo que incluye nuestro servicio:

- Presentación automática del Form 7004 cada año
- Preparación y envío del Form 1120 + Form 5472
- Revisión completa de transacciones reportables
- Seguimiento de plazos y confirmación de recepción
- Soporte continuo durante todo el proceso

## Resumen rápido

| Concepto | Detalle |
|---|---|
| Formulario | Form 7004 |
| Extensión | 6 meses (del 15 de abril al 15 de octubre) |
| Aprobación | Automática, el IRS no la deniega |
| Motivo requerido | Ninguno |
| Coste | Gratis |
| Pago de impuestos | Debe hacerse antes del 15 de abril (generalmente $0 para LLCs de no residentes) |
| Presentación | Electrónica o por correo |
| Frecuencia | Cada año, sin límite |

## ¿Tienes dudas?

Si acabas de <a href="/es/blog/constituir-llc-proceso-paso-a-paso">constituir tu LLC</a> o es tu primer año fiscal, es normal tener preguntas sobre plazos y formularios. En Exentax nos encargamos de todo el <a href="/es/blog/mantenimiento-anual-llc-obligaciones">mantenimiento anual</a>, desde la extensión hasta la declaración final. Agenda tu asesoría gratuita y te explicamos exactamente qué necesitas y cuándo.`,
    category: "Fiscalidad",
    readTime: 6,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Form 7004: cómo pedir extensión del IRS para Form 1120 + 5472 | Exentax",
    metaDescription: "El Form 7004 extiende 6 meses tu plazo (abril → octubre). Automático, gratis, sin justificación. Más del 50% de empresas lo usan. Exentax lo presenta por ti.",
  },
  {
    slug: "itin-ssn-que-son-como-obtenerlos",
    title: "ITIN y SSN: qué son, cuál necesitas y cómo obtenerlos para tu LLC",
    excerpt: "ITIN vs SSN: diferencias clave, quién necesita cada uno, cómo solicitar el ITIN paso a paso (Form W-7, CAA, documentación) y los errores que retrasan tu solicitud. Exentax gestiona todo el proceso.",
    content: `Cuando empiezas a moverte en el mundo de las LLC americanas, enseguida aparecen dos siglas que generan confusión: ITIN y SSN. Suenan parecido, tienen 9 dígitos los dos, y ambos sirven para identificarte ante el IRS. Pero son cosas muy distintas, y saber cuál necesitas (y cómo obtenerlo) es fundamental.

Vamos a desglosarlo sin rodeos.

## ¿Qué es el SSN (Social Security Number)?

El SSN es el número de Seguridad Social de Estados Unidos. Es un identificador de 9 dígitos que se asigna a:

- Ciudadanos estadounidenses
- Residentes permanentes (green card holders)
- Personas autorizadas a trabajar en EE.UU.

El SSN no es solo un número fiscal, es tu identidad en el sistema estadounidense. Lo usas para trabajar, pagar impuestos, acceder a beneficios de la Seguridad Social, solicitar crédito y prácticamente todo lo que implique interactuar con el gobierno federal.

**Si no eres ciudadano ni residente de EE.UU., no puedes obtener un SSN.** Así de simple. No hay excepciones, no hay atajos, no hay trucos. Si alguien te dice lo contrario, desconfía.

## ¿Qué es el ITIN (Individual Taxpayer Identification Number)?

El ITIN es un número de identificación fiscal emitido por el IRS específicamente para personas que necesitan cumplir con obligaciones fiscales en EE.UU. pero no pueden obtener un SSN.

También tiene 9 dígitos y sigue el formato 9XX-XX-XXXX (siempre empieza con 9 y el cuarto dígito es 7 o 8).

### ¿Quién necesita un ITIN?

- Propietarios extranjeros de LLCs en Estados Unidos
- No residentes que reciben ingresos de fuente estadounidense
- Personas que deben presentar declaraciones de impuestos ante el IRS sin tener SSN
- Cónyuges o dependientes reclamados en declaraciones fiscales de EE.UU.

**Si tienes una LLC y eres no residente, el ITIN es tu número.** No necesitas SSN, no puedes obtenerlo, y no lo necesitas. El ITIN cumple perfectamente su función para todo lo relacionado con tu LLC.

## ITIN vs SSN: diferencias clave

| Característica | SSN | ITIN |
|---|---|---|
| ¿Para quién? | Ciudadanos y residentes de EE.UU. | No residentes y extranjeros sin SSN |
| Formato | XXX-XX-XXXX | 9XX-7X-XXXX o 9XX-8X-XXXX |
| Emitido por | Social Security Administration | IRS (Internal Revenue Service) |
| ¿Autoriza a trabajar? | Sí | No |
| ¿Sirve para impuestos? | Sí | Sí |
| ¿Necesario para LLC de no residente? | No aplicable | Sí |

## ¿Para qué necesitas el ITIN si tienes una LLC?

El ITIN te permite:

- **Presentar declaraciones de impuestos** ante el IRS (Form 1120, <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a>)
- **Cumplir con tus obligaciones fiscales** como propietario extranjero de una LLC
- **Abrir ciertas cuentas bancarias** que requieren identificación fiscal personal
- **Firmar formularios W-8BEN** para retenciones fiscales
- **Solicitar beneficios de tratados fiscales** entre EE.UU. y tu país de residencia

En pocas palabras: sin ITIN, tu vida fiscal con una LLC americana es mucho más complicada.

## ¿Cómo obtener tu ITIN?

El proceso tiene varios pasos, pero es completamente manejable, sobre todo si tienes a alguien que lo gestione por ti (spoiler: en Exentax nos encargamos de todo).

### Paso 1: Preparar el Form W-7

El Form W-7 es la solicitud oficial del ITIN ante el IRS. Incluye tus datos personales, tu dirección, tu país de ciudadanía y la razón por la que necesitas el ITIN.

### Paso 2: Reunir la documentación de soporte

Necesitas documentos que prueben tu identidad y tu estatus de extranjero. Los más comunes:

- **Pasaporte vigente**: Es el documento más aceptado porque prueba tanto identidad como estatus de extranjero en un solo documento
- **Documento de identidad nacional** de tu país (como complemento)
- **Certificado de nacimiento** (si aplica)

El pasaporte vigente es, con diferencia, la opción más sencilla. Si tienes pasaporte, básicamente es lo único que necesitas como documento de soporte.

### Paso 3: Incluir una declaración de impuestos

El IRS requiere que el Form W-7 se presente junto con una declaración de impuestos federal (como el Form 1040-NR o adjunto al Form 1120 de tu LLC). Esto demuestra que necesitas el ITIN para un propósito fiscal real.

### Paso 4: Enviar la solicitud

Hay tres formas de enviar tu solicitud de ITIN:

**Opción A: Por correo al IRS**
Envías el Form W-7 + declaración de impuestos + documentos originales (o copias certificadas) al IRS ITIN Operation Center en Austin, Texas. El IRS devuelve los documentos originales en 60-90 días.

**Opción B: A través de un CAA (Certified Acceptance Agent)**
Un CAA es una persona o entidad autorizada por el IRS para verificar tus documentos de identidad. La ventaja es que el CAA certifica tus documentos, así que **no necesitas enviar los originales** al IRS. Mucho más seguro y cómodo.

**Opción C: En persona en una oficina del IRS**
Solo viable si estás en Estados Unidos. Te presentas con los documentos, te verifican la identidad en el acto y procesan la solicitud.

### Paso 5: Esperar la asignación

El tiempo de procesamiento del ITIN es de **7 a 11 semanas** desde que el IRS recibe tu solicitud completa. En temporada alta (enero-abril), puede tardar un poco más.

Una vez aprobado, recibes una carta del IRS con tu ITIN asignado. Este número no caduca mientras lo uses al menos una vez cada 3 años en una declaración fiscal.

## Errores comunes al solicitar el ITIN

Después de gestionar decenas de solicitudes de ITIN, estos son los errores que más vemos:

- **Enviar documentos incompletos.** Si falta algo, el IRS rechaza la solicitud y tienes que empezar de nuevo.
- **No incluir la declaración de impuestos.** El Form W-7 sin declaración adjunta se devuelve automáticamente.
- **Enviar fotocopias simples.** El IRS solo acepta originales o copias certificadas por la entidad emisora (o certificadas por un CAA).
- **Datos inconsistentes.** Si tu nombre en el pasaporte no coincide exactamente con el Form W-7, hay problemas.
- **No renovar un ITIN expirado.** Si no has usado tu ITIN en 3 años, debes renovarlo antes de presentar declaraciones.

## ¿Cuánto cuesta obtener el ITIN?

El IRS no cobra nada por emitir el ITIN. El Form W-7 es gratuito. Los costes reales vienen de:

- Preparación profesional del Form W-7 y documentación
- Certificación de documentos por un CAA (si usas esa vía)
- Envío de documentos por correo certificado internacional
- Preparación de la declaración de impuestos que debe acompañar la solicitud

## En Exentax te ayudamos a obtener tu ITIN

Sabemos que el proceso del ITIN puede parecer intimidante, formularios, documentos, copias certificadas, tiempos de espera... Pero no tiene por qué ser complicado.

**En Exentax nos encargamos de todo el proceso por ti:**

- Preparamos el Form W-7 con toda la información correcta
- Te guiamos sobre qué documentos necesitas y cómo prepararlos
- Coordinamos con CAAs autorizados para certificar tus documentos sin enviar originales
- Presentamos la solicitud junto con tu declaración fiscal
- Hacemos seguimiento hasta que recibas tu ITIN

Hemos gestionado solicitudes de ITIN para clientes de España, México, Colombia, Argentina, Chile y muchos más países. Conocemos el proceso al detalle y sabemos exactamente qué necesita el IRS para aprobar tu solicitud a la primera.

## ¿Necesitas tu ITIN ya?

Si acabas de <a href="/es/blog/constituir-llc-proceso-paso-a-paso">constituir tu LLC</a> o estás a punto de hacerlo, el momento de solicitar tu ITIN es ahora. Cuanto antes lo tengas, antes podrás abrir tu <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">cuenta en Mercury</a> y cumplir con todas tus <a href="/es/blog/mantenimiento-anual-llc-obligaciones">obligaciones fiscales</a> sin complicaciones.

Agenda tu asesoría gratuita con Exentax y te explicamos exactamente cómo funciona el proceso para tu caso concreto. Nos encargamos de todo, tú solo pon el pasaporte.`,
    category: "Guías",
    readTime: 8,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "ITIN vs SSN: cuál necesitas para tu LLC y cómo obtenerlo | Exentax",
    metaDescription: "ITIN vs SSN: diferencias, quién necesita cada uno, cómo solicitar el ITIN paso a paso (Form W-7, CAA), errores frecuentes y proceso 7-11 semanas.",
  },
  {
    slug: "tributacion-pass-through-llc-como-funciona",
    title: "Tributación Pass-Through de las LLC: qué es, cómo funciona y por qué es una ventaja enorme",
    excerpt: "$0 impuesto federal en EE.UU.: la LLC como Disregarded Entity no tributa, los beneficios pasan directamente al propietario. Gastos deducibles, doble imposición evitada y ejemplo real con números.",
    content: `Si alguien te ha dicho que con una LLC puedes pagar $0 de impuestos federales en Estados Unidos, no te estaba tomando el pelo. Es real, es legal, y tiene un nombre técnico: **tributación pass-through**. Es probablemente la ventaja fiscal más potente de tener una LLC como no residente, y en este artículo te vamos a explicar exactamente cómo funciona.

## ¿Qué es la tributación pass-through?

En términos simples: tu LLC no paga impuesto federal sobre la renta en Estados Unidos. Los ingresos de la empresa "pasan a través" (pass through) directamente al propietario, que es quien tributa por ellos en su país de residencia fiscal.

Es decir, la LLC es "transparente" fiscalmente. El IRS no la trata como una entidad separada a efectos de impuesto sobre la renta, la trata como si los ingresos fueran directamente tuyos.

Para una Single-Member LLC con propietario extranjero, el IRS la clasifica como **Disregarded Entity** (entidad ignorada). Esto significa que:

- La LLC no presenta declaración de impuesto sobre la renta propia
- Los ingresos se atribuyen directamente al propietario
- El propietario tributa en su país de residencia fiscal
- En EE.UU., si no hay ingresos de fuente estadounidense, el impuesto federal es **$0**

Sí, cero dólares. No es un error tipográfico.

## ¿Cómo es posible que sea $0?

Porque el sistema fiscal estadounidense grava los ingresos según su **fuente**. Si eres no residente de EE.UU. y tus ingresos provienen de servicios prestados fuera de Estados Unidos (freelancing, consultoría, desarrollo de software, diseño, marketing digital, etc.), esos ingresos no se consideran de fuente estadounidense.

Y si no son de fuente estadounidense, EE.UU. no tiene potestad para gravarlos. Así funciona el sistema, no es una laguna legal, es el diseño del propio código fiscal.

### La fórmula simplificada:

- LLC con propietario no residente ✓
- Ingresos por servicios prestados fuera de EE.UU. ✓
- Sin empleados ni oficina física en EE.UU. ✓
- **Resultado: $0 impuesto federal en EE.UU.**

## ¿Y entonces dónde pago impuestos?

En tu país de residencia fiscal. Aquí es donde el pass-through cobra sentido completo: los ingresos de tu LLC tributan donde tú vives, no donde está registrada la empresa.

### Ejemplo real: freelancer en España con LLC

Imagina que eres diseñador web, vives en Madrid y facturas $6,000 al mes a clientes internacionales a través de tu LLC.

**En Estados Unidos:**
- Tu LLC presenta el Form 1120 + <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a> (informativo)
- Impuesto federal: $0
- La LLC es una Disregarded Entity, transparente fiscalmente

**En tu país de residencia:**
- Los beneficios netos de tu LLC tributan en <a href="/es/blog/fiscalidad-llc-por-pais-residencia">tu país de residencia</a>
- **Pero**: y aquí viene lo bueno, primero deduces todos los <a href="/es/blog/gastos-deducibles-llc-que-puedes-deducir">gastos legítimos de tu LLC</a>

### ¿Cuál es la diferencia con ser autónomo directamente?

Siendo autónomo en España, pagas:

- Cuota de autónomos (entre 230€ y 500€/mes según ingresos)
- IRPF sobre tus ingresos netos (hasta el 47% en tramos altos)
- IVA en facturas nacionales (21%)
- Gastos deducibles limitados y constantemente bajo escrutinio fiscal

Con una LLC + estructura pass-through:

- Sin cuota de autónomos en España (si facturas solo a través de la LLC a clientes internacionales)
- $0 impuestos federales en EE.UU.
- Tributación en tu país de residencia sobre los **beneficios netos** de la LLC (ingresos menos gastos)
- **Amplio abanico de gastos deducibles** reconocidos por el sistema fiscal estadounidense
- Sin IVA en transacciones internacionales B2B

La diferencia puede ser brutal. Estamos hablando de pasar de un 40-47% de carga fiscal total a poder optimizar **hasta un 0%**, dependiendo de tu estructura y nivel de ingresos.

## Gastos deducibles: donde la magia se multiplica

Una de las grandes ventajas del pass-through es que antes de tributar en tu país, puedes deducir los gastos legítimos de tu negocio. Y el sistema estadounidense es bastante generoso con lo que considera gasto deducible:

### Gastos 100% deducibles para tu LLC:

- **Software y herramientas digitales:** Figma, Adobe, Notion, Slack, GitHub, hosting, dominios, APIs
- **Hardware:** portátil, monitor, teclado, ratón, auriculares, webcam, micrófono
- **Coworking y espacio de trabajo:** membresías de coworking, porcentaje del alquiler si trabajas desde casa (home office deduction)
- **Formación y cursos:** cursos online, libros técnicos, conferencias, workshops
- **Viajes de negocio:** vuelos, alojamiento y dietas cuando viajas por motivos profesionales
- **Marketing y publicidad:** anuncios en redes sociales, SEO, branding, diseño de marca
- **Servicios profesionales:** contabilidad, asesoría fiscal, agente registrado, servicios legales
- **Telecomunicaciones:** internet, teléfono móvil (porcentaje de uso profesional)
- **Suscripciones profesionales:** asociaciones, membresías, plataformas de networking
- **Seguros de negocio:** responsabilidad civil profesional, seguros de equipo

Cada euro (o dólar) que gastas legítimamente en tu negocio es un euro menos sobre el que tributas. Y con el pass-through, esa deducción impacta directamente en tu base imponible personal.

## ¿Es legal todo esto?

Completamente. No estamos hablando de evasión fiscal, esquemas opacos ni estructuras agresivas. La tributación pass-through es:

- La clasificación fiscal por defecto del IRS para Single-Member LLCs
- Reconocida por las autoridades fiscales de la mayoría de países
- Compatible con los tratados de doble imposición existentes
- Utilizada por millones de empresas en Estados Unidos

La clave está en **declarar correctamente en ambos países** y mantener toda la documentación en orden. Ahí es donde muchos emprendedores se complican, y donde nosotros entramos.

## ¿Cómo evitar la doble imposición?

El miedo número uno de cualquier emprendedor con LLC es: "¿voy a pagar impuestos dos veces?" La respuesta corta es **no**, siempre que tu estructura esté bien montada.

Para no residentes con LLCs sin ingresos de fuente estadounidense:

1. **En EE.UU.:** $0 impuesto federal (no hay nada que duplicar)
2. **En tu país:** tributas por los ingresos de la LLC como ingresos personales
3. **Resultado:** tributas una sola vez, en tu país, con los gastos de la LLC ya deducidos

Si tienes ingresos de fuente estadounidense (clientes en EE.UU. que te contratan para trabajos realizados en EE.UU.), ahí sí podrían aplicarse retenciones. Pero para la inmensa mayoría de freelancers y emprendedores digitales que trabajan desde fuera de EE.UU., la situación es limpia: $0 en EE.UU. y tributación normal en tu país.

## Cómo Exentax estructura esto para ti

En Exentax no solo constituimos tu LLC, diseñamos toda la estructura fiscal para que el pass-through funcione de manera óptima para tu caso:

- **Analizamos tu situación fiscal** en tu país de residencia
- **Elegimos el estado de constitución** que mejor encaje con tu perfil
- **Configuramos la contabilidad** para maximizar gastos deducibles legítimos
- **Preparamos todas las declaraciones** ante el IRS (Form 1120, <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a>, <a href="/es/blog/extension-irs-form-1120-como-solicitarla">Form 7004</a>)
- **Te orientamos sobre la declaración** en tu país de residencia
- **Mantenemos todo el <a href="/es/blog/mantenimiento-anual-llc-obligaciones">compliance al día</a>** para que no tengas sorpresas

El resultado: una estructura que minimiza tu carga fiscal total de forma completamente legal, con todos los papeles en orden y sin dolores de cabeza.

## ¿Quieres saber cuánto podrías ahorrarte?

Cada caso es distinto, pero la mayoría de nuestros clientes reducen su carga fiscal total entre un 50% y un 70% respecto a operar como autónomo en su país. Si facturas más de $3,000 al mes, los números empiezan a ser muy interesantes.

Agenda tu asesoría gratuita con Exentax y analizamos tu caso concreto. Te mostramos exactamente cuánto pagarías con una LLC vs tu estructura actual, con números reales, no con promesas vagas.`,
    category: "Fiscalidad",
    readTime: 8,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Tributación pass-through LLC: $0 federal, gastos deducibles y ejemplo real | Exentax",
    metaDescription: "Single-Member LLC = Disregarded Entity = $0 federal. Cómo funciona el pass-through, lista completa de gastos deducibles y ejemplo con números reales.",
  },
  {
    slug: "por-que-abrir-llc-estados-unidos-ventajas",
    title: "Por qué abrir una LLC en Estados Unidos: privacidad, seguridad y ventajas fiscales",
    excerpt: "Privacidad en NM/WY, responsabilidad limitada real, Mercury + Relay + Wise, $0 federal con pass-through, y la lista completa de gastos deducibles. Las ventajas concretas, sin humo.",
    content: `Hay muchos artículos en internet que te dicen "abre una LLC" como si fuera la solución mágica a todos tus problemas. Nosotros preferimos ser directos: una LLC no es magia, pero sí es la mejor estructura legal y fiscal disponible para emprendedores digitales que operan internacionalmente. Y las razones son muy concretas.

En este artículo vamos a repasar todas las ventajas reales, sin humo, sin exageraciones, con datos y ejemplos prácticos. Si al terminar de leer decides que tiene sentido para ti, en Exentax nos encargamos de todo el proceso.

## 1. Anonimato y privacidad: tu nombre no aparece en ningún lado

Una de las ventajas más valoradas de las LLC americanas es la **privacidad**. Dependiendo del estado de constitución, tu nombre como propietario puede no aparecer en ningún registro público.

### ¿Cómo funciona?

- **Nuevo México y Wyoming** permiten constituir LLCs donde los datos de los miembros (propietarios) no son de acceso público. Los Articles of Organization solo muestran el nombre del agente registrado y la dirección de la empresa, no el tuyo.
- **El <a href="/es/blog/operating-agreement-llc-que-es">Operating Agreement</a> es un documento privado.** No se registra ante ninguna autoridad. Es el documento interno que establece las reglas de tu LLC, y solo lo conoces tú (y tu asesor).
- **No existe un registro público de miembros** de LLCs como ocurre en muchos países europeos o latinoamericanos.

### ¿Por qué importa la privacidad?

- Protección frente a demandas frívolas (no pueden encontrar fácilmente quién está detrás de la empresa)
- Separación entre tu identidad personal y tu actividad empresarial
- Discreción en negocios donde la privacidad es un factor clave
- Protección contra competidores que quieran investigar tu estructura

No se trata de esconderse, se trata de que tu información personal no esté expuesta innecesariamente. En Europa y Latinoamérica, cualquier persona puede buscar tu nombre y ver tus empresas. Con una LLC en Nuevo México o Wyoming, eso no ocurre.

## 2. Seguridad jurídica: protección patrimonial de verdad

La "LL" de LLC significa **Limited Liability**: responsabilidad limitada. Y no es un nombre decorativo.

### ¿Qué significa en la práctica?

Si tu LLC tiene una deuda, un problema legal, una demanda o cualquier conflicto financiero, **tus bienes personales están protegidos.** Tu casa, tus ahorros, tu coche, tus inversiones, todo queda fuera del alcance de los acreedores de la empresa.

Esta protección se basa en el **velo corporativo**, que separa legalmente a la empresa de su propietario. Mientras mantengas la <a href="/es/blog/separar-dinero-personal-llc-por-que-importa">separación financiera</a> (cuentas separadas, documentación en orden), esa protección es sólida.

### El sistema legal estadounidense

Estados Unidos tiene uno de los marcos legales más robustos y predecibles del mundo para empresas:

- **Tribunales especializados** en derecho corporativo (como el Court of Chancery de Delaware)
- **Jurisprudencia consolidada** con décadas de precedentes
- **Leyes empresariales claras** y bien definidas en cada estado
- **Protección de propiedad intelectual** a nivel federal e internacional
- **Cumplimiento de contratos** eficiente y predecible

Cuando tu empresa está constituida en EE.UU., operas bajo un sistema legal que el mundo entero respeta y reconoce.

## 3. Estructura sólida: imagen profesional global

Una LLC americana no solo te protege, te posiciona. Tener una empresa en Estados Unidos transmite seriedad, profesionalismo y confianza a nivel internacional.

### Ventajas de imagen y operativas:

- **Facturar desde una empresa americana** genera confianza en clientes de cualquier país
- **Separación clara** entre tu patrimonio personal y el empresarial
- **Estructura reconocida mundialmente**: cualquier banco, cliente o socio entiende qué es una LLC
- **Acceso a plataformas** que solo trabajan con empresas (Stripe Atlas, plataformas SaaS enterprise, marketplaces)
- **Credibilidad ante inversores** si decides escalar tu negocio en el futuro

No es lo mismo enviar una factura desde "Juan Pérez - Autónomo" que desde "JuanTech LLC". La diferencia en percepción es enorme, y en muchos casos, la diferencia en oportunidades de negocio también.

## 4. Acceso a banca y fintech estadounidense

El ecosistema bancario y fintech de Estados Unidos es, probablemente, el mejor del mundo para negocios digitales. Y con una LLC, tienes acceso completo.

### Bancos y plataformas disponibles:

**<a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a> (respaldado por Column NA)**
- Sin comisiones mensuales ni mínimos de saldo
- Transferencias wire nacionales e internacionales sin coste
- Tarjetas de débito virtuales y físicas
- Integraciones con QuickBooks, Xero, Stripe
- Protección FDIC hasta $250,000
- Apertura 100% remota

**Relay (respaldado por Thread Bank)**
- Hasta 20 cuentas corrientes sin coste
- Tarjetas asignables a cuentas específicas
- Excelente para organizar fondos por categorías
- Apertura remota para no residentes
- Protección FDIC

**Wise Business**
- Cuenta multidivisa (USD, EUR, GBP y más)
- Conversión de divisas con el tipo de cambio real
- Tarjeta de débito internacional
- Ideal para recibir pagos en múltiples monedas

**Airwallex**
- Cuentas en múltiples divisas
- Pagos internacionales con tarifas competitivas
- Integraciones con plataformas de e-commerce
- Gestión de gastos del equipo

**Revolut Business**
- Cuenta multidivisa
- Cambio de divisas entre semana sin comisión
- Tarjetas para el equipo
- Herramientas de gestión de gastos

Con una LLC tienes acceso a todo este ecosistema. Cobrar en dólares, pagar proveedores internacionales, gestionar múltiples divisas, todo desde un solo lugar, con herramientas modernas y sin las limitaciones de la banca tradicional.

## 5. Fiscalidad: cómo y cuándo pagas impuestos

Aquí es donde la LLC brilla con luz propia. Vamos al detalle:

### En Estados Unidos:

Para una Single-Member LLC con propietario no residente y sin ingresos de fuente estadounidense:

- **Impuesto federal sobre la renta: $0**
- La LLC es una Disregarded Entity (entidad transparente fiscalmente)
- Los ingresos "pasan" al propietario (tributación pass-through)
- **Obligaciones informativas:** Form 1120 + <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a>, fecha límite 15 de abril (con <a href="/es/blog/extension-irs-form-1120-como-solicitarla">extensión hasta 15 de octubre mediante Form 7004</a>)
- **<a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a>:** reporte de beneficiarios finales ante FinCEN
- **Annual Report estatal:** dependiendo del estado (Nuevo México no lo requiere)

### En tu país de residencia:

- Los beneficios netos de tu LLC tributan en tu país de residencia
- Puedes deducir todos los gastos legítimos de la LLC antes de tributar
- No hay doble imposición: en EE.UU. pagas $0, en tu país de residencia tributan los beneficios netos

### Calendario fiscal:

| Obligación | Fecha límite | Extensión |
|---|---|---|
| Form 1120 + Form 5472 | 15 de abril | Hasta 15 de octubre (Form 7004) |
| BOI Report | Según fecha de constitución | No aplica |
| Annual Report (Wyoming) | Primer día del mes de aniversario | Varía |
| Annual Report (Delaware) | 1 de junio | No aplica |
| Declaración en tu país de residencia | Según normativa local | Según normativa local |

## 6. Gastos deducibles: todo lo que puedes restar antes de tributar

Esta es la parte que a todos les encanta (con razón). Los gastos deducibles de tu LLC reducen directamente la base sobre la que tributas. Y la lista es generosa:

### Software y herramientas digitales
Figma, Adobe Creative Cloud, Notion, Slack, Asana, GitHub, AWS, Google Workspace, Zoom, ChatGPT Pro, Canva, hosting, dominios, APIs, SaaS que uses para tu negocio.

### Hardware y equipamiento
Portátil, monitor, teclado, ratón, webcam, micrófono, auriculares, iPad, disco duro externo, adaptadores y accesorios. Todo lo que necesites para trabajar.

### Espacio de trabajo
Membresía de coworking, porcentaje del alquiler si trabajas desde casa (home office deduction), mobiliario de oficina (silla ergonómica, escritorio), suministros de oficina.

### Formación y desarrollo profesional
Cursos online (Udemy, Coursera, Platzi, etc.), libros técnicos, conferencias y eventos del sector, workshops, certificaciones profesionales.

### Viajes de negocio
Vuelos, alojamiento, transporte local, dietas, siempre que el viaje tenga un propósito empresarial documentado. Reuniones con clientes, conferencias, networking events.

### Marketing y publicidad
Anuncios en Meta, Google Ads, LinkedIn Ads, diseño de marca, branding, SEO, producción de contenido, relaciones públicas, patrocinios relevantes.

### Servicios profesionales
Contabilidad (hola, Exentax), asesoría fiscal, agente registrado, servicios legales, consultoría especializada, diseño gráfico, copywriting.

### Telecomunicaciones
Factura de internet (porcentaje profesional), plan de teléfono móvil (porcentaje profesional), VPN, servicios de comunicación.

### Seguros
Responsabilidad civil profesional, seguros de equipo, seguros de salud vinculados al negocio (según jurisdicción).

### Suscripciones profesionales
Membresías de asociaciones, plataformas de networking, herramientas de investigación, bases de datos profesionales.

Cada gasto legítimo reduce tu base imponible. Si facturas $80,000 al año y tienes $20,000 en gastos deducibles, solo tributas sobre $60,000. Así de directo.

## En Exentax nos encargamos de todo

Constituir y mantener una LLC no tiene por qué ser complicado. En Exentax gestionamos todo el proceso de principio a fin:

- **Constitución de la LLC** en el estado que mejor encaje contigo
- **Obtención del EIN** ante el IRS
- **Apertura de cuenta bancaria** en <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a> o Relay
- **Preparación del <a href="/es/blog/operating-agreement-llc-que-es">Operating Agreement</a>**
- **Declaraciones anuales** (Form 1120, <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a>, Form 7004)
- **<a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a>** ante FinCEN
- **Annual Report estatal** (donde aplique)
- **Agente registrado** incluido
- **Soporte continuo** durante todo el año

No subcontratamos, no delegamos en terceros, no usamos plantillas genéricas. Cada LLC que constituimos tiene nuestra atención directa.

## ¿Tiene sentido para ti?

Si eres freelancer, consultor, desarrollador, diseñador, marketer o cualquier profesional digital que factura más de $2,000 al mes a clientes internacionales, la respuesta probablemente es sí.

Agenda tu asesoría gratuita de 30 minutos con Exentax. Analizamos tu caso, te mostramos los números y te decimos honestamente si una LLC es lo que necesitas, o si hay una opción mejor para tu situación. Sin compromiso, sin presión, con datos reales.`,
    category: "Guías",
    readTime: 10,
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-15",
    metaTitle: "Por qué abrir una LLC en EE.UU.: 6 ventajas reales explicadas | Exentax",
    metaDescription: "Privacidad en NM/WY, responsabilidad limitada, Mercury + Relay + Wise, $0 federal pass-through, gastos deducibles completos. Ventajas reales de una LLC en 2026.",
  },
  {
    slug: "problemas-comunes-llc-como-evitarlos",
    title: "7 problemas reales de tener una LLC en EE.UU. y cómo evitar cada uno",
    excerpt: "Form 5472 sin presentar ($25K multa), cuenta Mercury congelada, velo corporativo levantado, BOI Report pendiente: los 7 problemas reales que vemos en Exentax y cómo los prevenimos desde el día 1.",
    content: `Abrir una LLC en Estados Unidos como no residente es una de las mejores decisiones que puedes tomar como freelancer o emprendedor digital. Pero no es magia. Como cualquier estructura empresarial, tiene obligaciones, riesgos y trampas que, si no se gestionan bien, pueden costarte dinero, tiempo y tranquilidad.

En Exentax hemos visto de todo. Clientes que nos llegan con multas del IRS por no presentar el Form 5472. Cuentas de Mercury congeladas por patrones de transacciones sospechosos. LLCs que llevan dos años sin renovar el Registered Agent. Operating Agreements copiados de internet que no protegen nada.

Estos son los 7 problemas más comunes, y exactamente cómo evitarlos.

## 1. No presentar el Form 5472 a tiempo

**El problema:** El <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a> es obligatorio para toda LLC con propietarios extranjeros. El plazo es el 15 de abril (con <a href="/es/blog/extension-irs-form-1120-como-solicitarla">extensión posible hasta el 15 de octubre</a>). Es un trámite que conviene tomarse en serio, y sin embargo, muchos dueños de LLC ni saben que existe. Abren la LLC con un servicio online barato, obtienen el EIN, abren Mercury, empiezan a facturar… y un año después se dan cuenta de que tienen obligaciones pendientes con el IRS.

**Cómo lo evitamos:** En Exentax, la preparación y presentación del Form 5472 está incluida en el mantenimiento anual. Lo preparamos antes del plazo, revisamos todas las transacciones reportables entre tú y la LLC, y lo presentamos junto con el Form 1120 (return informativa). No tienes que recordar fechas ni entender formularios en inglés.

## 2. Bloqueo o cierre de cuenta bancaria

**El problema:** Mercury, Relay, Wise, cualquier fintech con programa de compliance puede congelar tu cuenta si detecta actividad que no puede verificar. Consulta nuestra guía sobre <a href="/es/blog/evitar-bloqueos-mercury-wise-revolut">cómo evitar bloqueos bancarios</a> para más detalles. Las causas más frecuentes:

- Ingresos grandes sin facturas que los respalden
- Transferencias frecuentes a cuentas personales sin etiquetar como distributions
- Pagos a países de alto riesgo sin documentación
- Uso de la tarjeta de débito para gastos personales
- No responder a tiempo a las solicitudes de verificación del equipo de compliance

**Cómo lo evitamos:** En la asesoría inicial explicamos las reglas del juego. Configuramos tu operación para que el flujo de dinero sea limpio desde el primer día: facturas para cada ingreso, distributions documentadas, separación estricta de fondos personales y del negocio. Y si compliance te contacta, te ayudamos a responder.

## 3. Mezclar dinero personal y del negocio

**El problema:** Usar la cuenta de la LLC para pagar Netflix, la compra del supermercado o el alquiler. Es fundamental <a href="/es/blog/separar-dinero-personal-llc-por-que-importa">separar el dinero personal del de la LLC</a>. Esto no solo viola la separación legal entre tú y la empresa (el "corporate veil"), sino que también levanta alertas en compliance y complica la preparación fiscal.

Si un tribunal determina que has mezclado fondos consistentemente, pueden "levantar el velo corporativo" y considerar que la LLC no es una entidad separada de ti. En ese momento, pierdes la protección de responsabilidad limitada, que es una de las razones principales por las que abriste la LLC.

**Cómo lo evitamos:** Desde el primer día, definimos las reglas de uso de la cuenta. Los gastos del negocio van por la cuenta de la LLC. Los pagos personales, por tu cuenta personal. Las transferencias entre ambas se hacen como owner's draws o distributions, documentadas y con una frecuencia razonable (mensual o quincenal, no diaria).

## 4. No renovar el Registered Agent

**El problema:** Toda LLC necesita un Registered Agent activo en su estado de registro. Si no renuevas el servicio, tu LLC pierde su representante legal oficial. Esto puede resultar en:

- Pérdida de notificaciones legales importantes
- El estado puede marcar tu LLC como "not in good standing"
- En algunos estados, la LLC puede ser disuelta administrativamente

**Cómo lo evitamos:** El Registered Agent está incluido en todos nuestros planes, tanto de constitución como de mantenimiento anual. Lo renovamos automáticamente. No tienes que recordar nada.

## 5. Operating Agreement genérico o inexistente

**El problema:** El <a href="/es/blog/operating-agreement-llc-que-es">Operating Agreement</a> es el documento interno que define cómo funciona tu LLC: quién toma decisiones, cómo se distribuyen los beneficios, qué pasa si quieres cerrar la empresa. Muchos freelancers usan una plantilla de internet o directamente no tienen ninguno.

Un Operating Agreement genérico puede no reflejar tu situación real (single-member vs multi-member, cómo manejas distribuciones, reglas de disolución). Y si algún día tienes una disputa legal o una auditoría, es el primer documento que van a pedir.

**Cómo lo evitamos:** Preparamos un Operating Agreement personalizado para cada LLC que constituimos. Refleja tu estructura real, incluye las cláusulas que protegen al propietario extranjero, y cumple con los requisitos del estado de registro.

## 6. No cumplir con el BOI Report

**El problema:** Desde 2024, FinCEN exige que todas las LLCs presenten el <a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a> con sus propietarios beneficiarios (Beneficial Ownership Information). Los plazos y requisitos cambian con frecuencia, y no cumplir puede traer consecuencias que conviene evitar.

Muchos dueños de LLC ni siquiera saben que existe esta obligación porque es relativamente nueva.

**Cómo lo evitamos:** El BOI Report está incluido en nuestros servicios de constitución y mantenimiento. Lo presentamos durante la constitución y lo actualizamos cada año. Monitorizamos los cambios regulatorios para que siempre estés en cumplimiento.

## 7. No declarar ingresos en tu país de residencia fiscal

**El problema:** Que tu LLC pague $0 de impuestos federales en EE.UU. no significa que no tengas obligaciones en tu país de residencia fiscal. Si vives en España, los ingresos de la LLC tributan por IRPF. Si vives en México, por ISR. Cada país tiene sus reglas.

Algunos freelancers creen que con una LLC "desaparecen" del radar fiscal de su país. Esto es falso y peligroso. Los acuerdos de <a href="/es/blog/crs-cuentas-bancarias-llc-intercambio-informacion">intercambio de información fiscal entre países (CRS)</a> hacen que tu actividad sea visible para tu hacienda local.

**Cómo lo evitamos:** En la asesoría inicial analizamos tu situación fiscal completa, incluyendo tus obligaciones en tu país de residencia. Te explicamos exactamente qué debes declarar, cómo hacerlo y cuánto puedes deducir legalmente. No dejamos cabos sueltos.

## La diferencia entre hacer las cosas bien y hacer las cosas "a medias"

El 90% de los problemas que vemos podrían haberse evitado con un asesoramiento adecuado desde el principio. Una LLC bien constituida, con compliance al día y una operación trazable, es una máquina de eficiencia fiscal. Una LLC mal gestionada es una bomba de relojería.

## Cuánto cuestan estos problemas en la práctica

Para que quede claro lo que está en juego:

- **Form 5472 no presentado:** La multa por no presentación según IRS §6038A es de $25,000 por formulario, por año. Si llevas dos años sin presentar, son $50,000. Y el IRS no necesita demostrarte nada: la carga de la prueba es tuya.
- **Cuenta bancaria bloqueada:** Si Mercury congela tu cuenta mientras tienes facturas pendientes de cobro, tu operación se paraliza. Pueden pasar semanas hasta resolver el bloqueo, durante las cuales no puedes cobrar, pagar a proveedores ni hacer distributions.
- **Corporate veil levantado:** Si un tribunal determina que mezclaste fondos personales y del negocio, la protección de responsabilidad limitada desaparece. Esto significa que tus bienes personales quedan expuestos a las deudas y obligaciones de la LLC.
- **LLC disuelta por no renovar Registered Agent:** Si el estado disuelve tu LLC por falta de Registered Agent, necesitas un proceso de reinstalación (reinstatement) que cuesta más y tarda más que la renovación original. Mientras tanto, la LLC no puede operar legalmente.

## El patrón que vemos repetidamente

La secuencia típica del freelancer que llega a Exentax con problemas es:

1. Constituyó la LLC con un servicio barato que solo hace el trámite de registro
2. Obtuvo el EIN y abrió Mercury
3. Empezó a facturar y cobrar
4. Nadie le dijo que tenía que presentar Form 5472, BOI Report, o renovar el Registered Agent
5. Pasaron uno o dos años
6. Recibió una notificación del IRS, un bloqueo de cuenta, o descubrió que su LLC estaba en "not in good standing"

La constitución es el 10% del trabajo. El 90% restante es el mantenimiento, el compliance y la operativa diaria. Si tu proveedor solo cubre el 10%, el resto queda en tus manos. Y si no sabes lo que no sabes, los problemas llegan sin aviso.

En Exentax cubrimos el ciclo completo. Constitución, mantenimiento, compliance, operativa bancaria y soporte continuo. Si quieres una LLC que funcione sin sorpresas, habla con nuestro equipo.`,
    category: "Guías",
    readTime: 9,
    publishedAt: "2026-03-06",
    updatedAt: "2026-04-15",
    metaTitle: "7 problemas reales de una LLC y cómo evitarlos (multas, bloqueos) | Exentax",
    metaDescription: "Form 5472 no presentado ($25K multa), Mercury congelado, velo corporativo, BOI Report, Registered Agent vencido. Los 7 problemas y cómo prevenirlos.",
  },
  {
    slug: "fiscalidad-llc-por-pais-residencia",
    title: "Cómo tributa tu LLC según tu país de residencia fiscal: España, México, Colombia, Argentina",
    excerpt: "$0 federal en EE.UU. pero declaras en tu país: IRPF en España (19-47%), ISR en México (1.92-35%), renta en Colombia (0-39%), ganancias en Argentina (5-35%). Cómo optimizar con gastos deducibles reales.",
    content: `Una de las grandes ventajas de una Single-Member LLC americana es que no paga impuesto federal sobre la renta en Estados Unidos. El IRS la clasifica como "Disregarded Entity", una entidad transparente fiscalmente. Los beneficios pasan directamente al propietario.

Pero aquí viene la parte que muchos olvidan: **esos beneficios los declaras en tu país de residencia fiscal.** No desaparecen. No se vuelven invisibles. Tu LLC optimiza tu estructura, pero no te exime de las obligaciones fiscales donde vives.

En este artículo te explicamos cómo funciona la tributación real de una LLC americana según los países donde más trabajan nuestros clientes.

## El principio fundamental: tributación por residencia fiscal

La mayoría de países gravan a sus residentes fiscales por su **renta mundial**. Esto significa que, vivas donde vivas, debes declarar todos tus ingresos, incluidos los que generas a través de tu LLC americana.

La clave está en que una LLC bien estructurada te permite:
- **Deducir gastos reales del negocio** antes de calcular tu base imponible
- **Aplicar convenios de doble imposición** (CDI) entre EE.UU. y tu país
- **Optimizar el timing de distribuciones** para gestionar tu carga fiscal
- **Documentar todo profesionalmente** para que tu declaración sea limpia

## España: IRPF y obligaciones del residente fiscal

Si vives en España, los beneficios de tu LLC tributan por IRPF como rendimientos de actividades económicas o como rendimientos del capital, dependiendo de tu situación.

**Lo que pasa en la práctica:**
- Tu LLC genera ingresos y tiene gastos deducibles (software, herramientas, servicios profesionales, Registered Agent, etc.)
- El beneficio neto (ingresos menos gastos) lo declaras en España
- El tipo marginal del IRPF va del 19% al 47%, pero la base imponible es menor gracias a las deducciones

**Ventaja real:** Un freelancer que factura 5.000€/mes como autónomo en España puede pagar más de 15.000€/año en impuestos y cotizaciones. Con una LLC bien estructurada y gastos deducibles reales, la base imponible se reduce significativamente.

**Obligaciones adicionales:**
- Modelo 720 si tienes activos en el extranjero superiores a 50.000€
- Declaración informativa de bienes y derechos en el extranjero

## México: ISR y régimen aplicable

Para residentes fiscales en México, los ingresos de tu LLC tributan por ISR (Impuesto Sobre la Renta).

**Lo que pasa en la práctica:**
- Los ingresos de fuente extranjera se declaran en tu declaración anual
- México tiene CDI con Estados Unidos, lo que evita la doble tributación
- Las tasas del ISR para personas físicas van del 1.92% al 35%
- Los gastos deducibles de la LLC reducen la base imponible

**Ventaja real:** Comparado con el régimen de actividad empresarial en México (donde puedes pagar hasta un 35% más contribuciones), una LLC con gastos optimizados puede reducir significativamente tu carga fiscal efectiva.

**Punto importante:** México es particularmente estricto con los REFIPRES (Regímenes Fiscales Preferentes). Es fundamental estructurar la LLC correctamente para cumplir con esta normativa.

## Colombia: impuesto de renta y CRS

Colombia grava la renta mundial de sus residentes fiscales. Los ingresos de tu LLC se declaran como ingresos de fuente extranjera.

**Lo que pasa en la práctica:**
- El impuesto de renta para personas naturales va del 0% al 39%
- Colombia tiene CDI con Estados Unidos en vigor
- Los gastos deducibles de la LLC reducen tu base gravable
- Las distribuciones se declaran en tu declaración de renta anual

**Ventaja real:** Un freelancer colombiano que cobra en pesos a clientes locales tiene menos herramientas de optimización que uno que factura en dólares a clientes internacionales a través de una LLC. La estructura permite acceder a banca americana, cobrar en USD sin restricciones y deducir gastos reales del negocio.

## Argentina: ganancias e impuesto al patrimonio

Argentina es uno de los países con mayor presión fiscal de la región. Los residentes fiscales argentinos tributan por su renta mundial.

**Lo que pasa en la práctica:**
- Los ingresos de la LLC se declaran en el Impuesto a las Ganancias
- Las alícuotas para personas humanas van del 5% al 35%
- El Impuesto sobre los Bienes Personales puede aplicar sobre activos en el exterior
- Argentina no tiene CDI con Estados Unidos

**Ventaja real:** Para freelancers argentinos que cobran en dólares, la LLC ofrece acceso a banca americana sin las restricciones cambiarias del BCRA, cobro directo en USD y una estructura profesional que genera confianza en clientes internacionales. La optimización fiscal viene de las deducciones reales y la estructura de gastos.

**Consideración especial:** La situación regulatoria argentina cambia frecuentemente. Es esencial mantenerse actualizado con las normativas del BCRA y la AFIP.

## Lo que tienen en común todos los países

Independientemente de dónde vivas, hay principios que aplican siempre:

**1. La LLC no elimina tu obligación fiscal, la optimiza.** Reduces tu base imponible con gastos deducibles legítimos y operas con una estructura profesional que te da herramientas que no tienes como autónomo o persona física.

**2. La documentación lo es todo.** Facturas, contratos, registros de gastos, distributions documentadas. Sin documentación, no hay deducción posible.

**3. El compliance americano te protege.** Presentar el <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a>, mantener el <a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a> al día y operar con trazabilidad no solo cumple con el IRS, también demuestra ante tu hacienda local que tu estructura es legítima y transparente.

**4. Cada situación es diferente.** No existe una respuesta genérica. Tu carga fiscal final depende de tus ingresos, tus gastos, tu país, tu régimen y docenas de variables que solo se pueden analizar caso por caso.

## Por qué el asesoramiento especializado marca la diferencia

En YouTube y Twitter encontrarás miles de personas diciendo "con una LLC pagas 0% de impuestos". Es una simplificación peligrosa. Pagas 0% de impuesto **federal en EE.UU.**: pero sigues teniendo obligaciones en tu país de residencia.

La diferencia entre un freelancer que paga el 40% y uno que paga el 15% no es la LLC en sí, es cómo está estructurada, qué gastos se deducen, cómo se documentan las operaciones y cómo se declara en el país de residencia.

En Exentax analizamos tu situación completa: país de residencia, ingresos, <a href="/es/blog/gastos-deducibles-llc-que-puedes-deducir">gastos</a>, clientes, modelo de negocio. Y diseñamos una estructura que optimice tu fiscalidad de forma legal, documentada y sostenible. Entender la <a href="/es/blog/tributacion-pass-through-llc-como-funciona">tributación pass-through</a> es clave para aprovechar al máximo tu LLC.

Agenda tu asesoría gratuita de 30 minutos. Te mostramos los números reales de tu caso, sin suposiciones, sin promesas vacías, con datos concretos.`,
    category: "Fiscalidad",
    readTime: 7,
    publishedAt: "2026-03-06",
    updatedAt: "2026-04-15",
    metaTitle: "Cómo tributa tu LLC en España, México, Colombia y Argentina | Exentax",
    metaDescription: "$0 federal en EE.UU. pero declaras en tu país: IRPF España (19-47%), ISR México (1.92-35%), renta Colombia (0-39%), ganancias Argentina (5-35%). Gastos deducibles.",
  },
  {
    slug: "crs-cuentas-bancarias-llc-intercambio-informacion",
    title: "CRS, cuentas bancarias y tu LLC: cómo funciona el intercambio de información fiscal",
    excerpt: "EE.UU. no participa en el CRS pero sí hay vías de intercambio: FATCA bilateral, acuerdos mutuos y tu propia declaración (Modelo 720). Qué reportan Mercury, Wise y Relay, y por qué la transparencia te protege.",
    content: `Si tienes una LLC en Estados Unidos y una cuenta en Mercury, Wise o Relay, es natural preguntarse: ¿puede Hacienda en mi país ver esa cuenta? ¿Saben cuánto dinero tengo allí?

La respuesta corta: sí, potencialmente pueden. Pero eso no es un problema, es una ventaja si tu estructura está bien montada. Te explicamos cómo funciona.

## Qué es el CRS y por qué existe

El CRS (Common Reporting Standard) es un sistema de intercambio automático de información fiscal entre más de 100 países. Fue creado por la OCDE para combatir la evasión fiscal. La idea es simple: las instituciones financieras de cada país participante reportan información sobre las cuentas de no residentes a las autoridades fiscales, que luego la comparten con el país de residencia del titular.

**Ejemplo práctico:** Si vives en España y tienes una cuenta en un banco británico, ese banco reporta al HMRC (hacienda británica), que a su vez comparte esa información con la AEAT (hacienda española). Automáticamente, cada año.

## Estados Unidos y el CRS: la particularidad

Aquí viene la parte interesante: **Estados Unidos no participa en el CRS.** Es el gran ausente. EE.UU. tiene su propio sistema de intercambio, el FATCA (Foreign Account Tax Compliance Act), pero funciona de forma distinta y principalmente busca información sobre ciudadanos y residentes americanos con cuentas en el extranjero, no al revés.

**¿Qué significa esto para tu LLC?**

- Las instituciones financieras en EE.UU. no reportan automáticamente bajo CRS a tu país de residencia
- Tu cuenta de Mercury, por ejemplo, no genera un reporte automático CRS que llegue a Hacienda en España
- Esto NO significa que debas ocultar nada, significa que el mecanismo de intercambio es diferente

## Entonces, ¿puede mi hacienda local ver mi cuenta americana?

Hay varias vías por las que tu hacienda local puede obtener información:

**1. FATCA bilateral:** Muchos países tienen acuerdos bilaterales con EE.UU. que permiten el intercambio de cierta información fiscal. No es tan automático ni tan detallado como el CRS, pero existe.

**2. Solicitudes específicas:** Tu hacienda puede solicitar información a las autoridades americanas caso por caso, especialmente si hay una investigación.

**3. Tu propia declaración:** En la mayoría de los países, estás obligado a declarar tus activos en el extranjero. En España, por ejemplo, el Modelo 720 requiere reportar cuentas con saldos superiores a 50.000€.

**4. Información de terceros:** Plataformas como Wise o Payoneer, que operan en múltiples jurisdicciones, pueden estar sujetas a obligaciones de reporte en tu país.

## Mercury, Wise y Relay: qué reportan y a quién

Cada plataforma tiene obligaciones distintas:

**<a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a>** es un Money Transmitter que usa Column NA como banco custodio. Opera exclusivamente en EE.UU. y reporta al IRS según las obligaciones americanas. No tiene obligaciones CRS porque EE.UU. no participa.

**<a href="/es/blog/wise-business-llc-guia">Wise</a>** es una EMI (Institución de Dinero Electrónico) con licencias en múltiples jurisdicciones. Al tener presencia en la UE, Reino Unido y otros países CRS, puede tener obligaciones de reporte en esas jurisdicciones sobre las cuentas de sus usuarios.

**Relay** es una fintech que usa Thread Bank. Similar a Mercury, opera dentro del sistema bancario americano y reporta al IRS.

## Por qué la transparencia te beneficia

Aquí está el punto clave: **una LLC bien gestionada no tiene nada que esconder.** El objetivo de una LLC americana no es ocultar ingresos de tu hacienda local, es optimizar legalmente tu carga fiscal a través de:

- Deducción legítima de <a href="/es/blog/gastos-deducibles-llc-que-puedes-deducir">gastos del negocio</a>
- <a href="/es/blog/tributacion-pass-through-llc-como-funciona">Pass-through taxation</a> con $0 de impuesto federal en EE.UU.
- <a href="/es/blog/separar-dinero-personal-llc-por-que-importa">Separación patrimonial</a> entre tú y tu negocio
- Acceso a cobros en dólares y plataformas globales

Si tu estructura está bien montada, puedes enseñar tu operación a cualquier inspector fiscal y todo cuadra. Ingresos documentados, gastos justificados, distributions trazables.

## El Modelo 720 y las cuentas americanas

Si eres residente fiscal en España, el Modelo 720 te obliga a declarar bienes y derechos situados en el extranjero cuando superen los 50.000€ en alguna de estas categorías:

- Cuentas en entidades financieras
- Valores, derechos, seguros y rentas
- Bienes inmuebles y derechos sobre inmuebles

Tu cuenta de Mercury entra en la primera categoría. Si el saldo a 31 de diciembre o el saldo medio del último trimestre supera 50.000€, debes declararlo. No hacerlo puede acarrear sanciones significativas (aunque la jurisprudencia europea ha moderado las sanciones desproporcionadas que España aplicaba inicialmente).

En México, la obligación equivalente existe a través de las declaraciones informativas del SAT. En Colombia, a través de la declaración de activos en el exterior. Cada país tiene sus propias reglas, pero el principio es el mismo: declara lo que tienes fuera.

## La diferencia entre evadir y optimizar

Evadir es no declarar ingresos. Optimizar es estructurar tu negocio para pagar lo justo dentro de la ley.

Un freelancer que trabaja como autónomo en España puede estar pagando un 45% efectivo entre IRPF y cuota de autónomos. Ese mismo freelancer, con una LLC americana bien estructurada, puede reducir su carga fiscal efectiva de forma significativa. Declarando todo. Con compliance al día. Con documentación impecable.

La diferencia no está en esconder dinero. Está en elegir la estructura correcta.

## El FBAR: otra obligación que no debes ignorar

Si eres ciudadano o residente fiscal de EE.UU. (lo cual no aplica a la mayoría de nuestros clientes), el FBAR (FinCEN Form 114) te obliga a reportar cuentas financieras en el extranjero que superen $10,000 en cualquier momento del año.

Para no residentes con LLCs, el FBAR no suele ser directamente aplicable. Pero si tu situación cambia (por ejemplo, si obtienes residencia americana), esta obligación entra en juego inmediatamente. Es importante tenerlo en el radar.

## Qué pasa cuando Hacienda pregunta

El escenario más común: eres autónomo en España, constituyes tu LLC, empiezas a facturar por ella. Tu asesor fiscal local declara los ingresos en tu IRPF. Todo correcto.

Un día, Hacienda te envía un requerimiento pidiendo información sobre tu actividad internacional. No es una inspección, es una solicitud de información.

Lo que necesitas tener listo:

1. Articles of Organization de la LLC
2. EIN y documentación fiscal americana
3. Extractos bancarios de <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a> mostrando ingresos y gastos
4. Facturas emitidas a clientes
5. Justificación de los <a href="/es/blog/gastos-deducibles-llc-que-puedes-deducir">gastos deducidos</a>
6. Documentación de las distributions (owner's draws)

Si todo esto está organizado y coincide con lo declarado, el requerimiento se resuelve sin problemas. Si no lo tienes, empiezan las complicaciones.

## Cómo lo gestionamos en Exentax

Operamos con total transparencia. Cuando constituimos tu LLC:

- Te explicamos exactamente qué obligaciones tienes en tu país de residencia
- Preparamos toda la documentación que tu asesor fiscal local necesita para tu declaración
- Mantenemos un registro trazable de todas las operaciones de la LLC
- Te acompañamos en la interacción con tu hacienda local si surge alguna consulta
- Coordinamos con tu asesor fiscal local para que las cifras cuadren en ambos lados

No buscamos clientes que quieran esconder dinero. Buscamos profesionales que quieran pagar lo justo, operar con estructura profesional y tener la tranquilidad de saber que todo está en orden.

Si quieres entender cómo funciona el intercambio de información en tu caso particular, consulta con nuestro equipo. Analizamos tu situación fiscal completa y te decimos exactamente qué debes declarar, dónde y cuándo.`,
    category: "Fiscalidad",
    readTime: 8,
    publishedAt: "2026-03-06",
    updatedAt: "2026-04-15",
    metaTitle: "CRS, FATCA y tu LLC: intercambio de información fiscal explicado | Exentax",
    metaDescription: "EE.UU. no participa en CRS pero hay FATCA bilateral. Qué reportan Mercury, Wise y Relay. Modelo 720 España, FBAR y cómo prepararte para un requerimiento.",
  },
  {
    slug: "cuentas-bancarias-usa-reportan-hacienda-verdad",
    title: "¿Las cuentas bancarias en EE.UU. reportan a tu hacienda? La verdad completa",
    excerpt: "Mercury (Column NA) reporta al IRS, no al CRS. Wise (EMI, multi-jurisdicción) puede reportar bajo CRS en la UE. Relay (Thread Bank) igual que Mercury. Modelo 720, FBAR y tus obligaciones reales.",
    content: `Es la pregunta que más recibimos en Exentax: "¿Mercury le dice a Hacienda cuánto dinero tengo?" o "¿Wise reporta mis ingresos a la AEAT?". La respuesta requiere algo de contexto, pero te la vamos a dar completa.

## El sistema de reporte financiero internacional

Hay tres grandes mecanismos por los que la información financiera viaja entre países:

**1. <a href="/es/blog/crs-cuentas-bancarias-llc-intercambio-informacion">CRS (Common Reporting Standard)</a>**: El estándar de la OCDE que usan más de 100 países para intercambiar información automáticamente sobre cuentas financieras de no residentes.

**2. FATCA (Foreign Account Tax Compliance Act)**: La ley americana que obliga a instituciones financieras extranjeras a reportar cuentas de ciudadanos y residentes americanos al IRS.

**3. Acuerdos bilaterales**: Tratados específicos entre dos países para compartir información fiscal bajo solicitud.

## ¿Qué pasa con tu cuenta de Mercury?

Mercury es un Money Transmitter registrado en EE.UU. que usa Column NA como banco custodio. Opera exclusivamente dentro del sistema financiero americano.

**¿Reporta Mercury al IRS?** Sí, como toda institución financiera americana, <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a> cumple con las obligaciones de reporte al IRS. Esto incluye formularios como el 1099 cuando aplica.

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

**4. La trazabilidad es tu mejor defensa.** Si alguna vez tu hacienda te pregunta sobre tu LLC, tener todo documentado (facturas, distributions, <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a>, <a href="/es/blog/operating-agreement-llc-que-es">Operating Agreement</a>) es lo que te protege.

**5. El reporte evoluciona.** Que hoy EE.UU. no participe en CRS no significa que mañana no lo haga. Construye tu estructura asumiendo transparencia total, y nunca tendrás problemas.

## Cómo lo gestionamos en Exentax

Cuando montamos tu estructura, coordinamos el compliance en ambos lados:

- Preparamos el <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a> y el <a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a> en EE.UU.
- Te proporcionamos toda la documentación que tu asesor fiscal local necesita para la declaración en tu país
- Cada movimiento de tu LLC queda documentado y trazable
- Si tu hacienda local envía un requerimiento, tienes todo organizado para responder en días, no en semanas

La tranquilidad fiscal no viene de esconderse. Viene de tener todo en orden.`,
    category: "Fiscalidad",
    readTime: 7,
    publishedAt: "2026-03-06",
    updatedAt: "2026-04-15",
    metaTitle: "¿Mercury, Wise y Relay reportan a tu hacienda? La verdad completa | Exentax",
    metaDescription: "Mercury reporta al IRS (no CRS). Wise puede reportar bajo CRS en la UE. Modelo 720, FBAR, Slash, Wallester. Qué información viaja y tus obligaciones reales.",
  },
  {
    slug: "privacidad-llc-americana-secreto-ventaja",
    title: "La privacidad de una LLC americana: qué protege, qué no y por qué importa",
    excerpt: "Nuevo México, Wyoming y Delaware: qué estado ofrece más privacidad, qué saben el IRS y FinCEN, qué ve tu banco y qué NO es público. Privacidad real vs anonimato ficticio.",
    content: `Una de las razones por las que muchos emprendedores eligen estados como Nuevo México o Wyoming para su LLC es la privacidad. En estos estados, el propietario de la LLC no aparece en registros públicos. Suena bien, pero es importante entender qué significa esto realmente y qué no.

## Qué protege la privacidad de una LLC

**Registros públicos del estado:** En estados como Nuevo México, los Articles of Organization no requieren el nombre del propietario (member). Solo aparece el nombre de la LLC y del Registered Agent. Esto significa que cualquiera que busque tu LLC en el registro estatal no verá tu nombre.

**Protección ante búsquedas online:** Si alguien busca tu nombre en internet, no encontrará tu LLC asociada a ti (al menos no por los registros estatales). Esto es útil para freelancers y emprendedores que prefieren separar su identidad personal de su actividad empresarial.

**Protección ante competidores y curiosos:** Tus competidores no pueden buscar qué LLCs tienes ni en qué estado están registradas simplemente buscando tu nombre en registros públicos.

## Qué NO protege

**Ante el IRS:** El IRS sabe quién es el propietario de tu LLC. Cuando solicitas el EIN, declaras quién es el responsible party. Cuando presentas el <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a>, reportas las transacciones entre tú y la LLC. La privacidad estatal no tiene efecto ante el servicio de impuestos federal.

**Ante FinCEN:** El <a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a> (Beneficial Ownership Information Report) requiere que declares quién son los propietarios beneficiarios de la LLC, incluyendo nombre, fecha de nacimiento, dirección y número de identificación. Esta información no es pública, pero está en manos del gobierno federal.

**Ante tu banco:** <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a>, Relay, <a href="/es/blog/wise-business-llc-guia">Wise</a>, todas las plataformas financieras saben quién es el propietario de la LLC. El proceso de KYC (Know Your Customer) requiere documentación personal: pasaporte, prueba de domicilio, a veces selfie con documento. No hay cuenta bancaria anónima.

**Ante tu hacienda local:** Como cubrimos en otros artículos, tu hacienda local puede obtener información sobre tu LLC y tus cuentas americanas a través de acuerdos de intercambio de información fiscal.

**Ante un juez:** Si hay un litigio legal o una investigación, un tribunal puede ordenar la divulgación de la identidad del propietario de cualquier LLC, independientemente del estado de registro.

**Ante las plataformas de pago:** Stripe, PayPal, Adyen y cualquier procesador de pagos verifican la identidad del propietario como parte de su onboarding. La privacidad estatal no aplica en el proceso de verificación KYB (Know Your Business).

## Privacidad vs anonimato: una distinción crítica

Es fundamental entender la diferencia:

- **Privacidad** = tu información no está disponible públicamente, pero las autoridades pertinentes la conocen
- **Anonimato** = nadie sabe quién eres

Una LLC americana te da **privacidad**, no anonimato. Y eso es exactamente lo que necesitas.

Privacidad te protege de:
- Que un cliente curioso busque tu nombre y vea todas tus empresas
- Que un competidor rastree tu estructura empresarial
- Spam y contactos no deseados por registros públicos
- Que proveedores o potenciales socios investigue tu facturación antes de negociar contigo

Pero no intenta (ni debe intentar) esconderte de las autoridades fiscales o financieras. Eso sería evasión, y no tiene nada que ver con lo que hacemos.

## Privacidad operativa: más allá de los registros

La privacidad de una LLC no se limita a los registros estatales. También afecta a tu operativa diaria:

**<a href="/es/blog/operating-agreement-llc-que-es">Operating Agreement</a> privado.** A diferencia de las escrituras de constitución de una SL española (que son públicas y están en el Registro Mercantil), el Operating Agreement de tu LLC es un documento privado. No se registra en ninguna oficina gubernamental. Solo lo ven tú y las entidades a las que tú decidas mostrárselo (Mercury, Stripe, etc.).

**Extractos bancarios privados.** Mercury no publica tu información bancaria. Los extractos, balances y transacciones son privados entre tú y el banco. Solo un requerimiento judicial o fiscal puede forzar la divulgación.

**Facturación discreta.** Tus facturas llevan el nombre de tu LLC, no tu nombre personal (a menos que los incluyas voluntariamente). Un cliente en Alemania ve "Digital Consulting Services LLC" en su factura, no tu nombre y apellido.

**Domicilio del Registered Agent.** La dirección pública de tu LLC es la del Registered Agent, no tu domicilio personal. Tu dirección real no aparece en ningún registro público asociado a la LLC.

## Nuevo México, Wyoming y Delaware: ¿cuál es más privado?

Los tres estados ofrecen un buen nivel de privacidad, pero con matices:

**Nuevo México:**
- No requiere nombre del propietario en Articles of Organization
- No tiene Annual Report (menos papeleo público)
- No tiene impuesto estatal sobre LLCs
- Es el más "discreto" de los tres

**Wyoming:**
- No requiere nombre del propietario en Articles of Organization
- Tiene Annual Report, pero sin requisito de revelar propietarios
- $60/año de Annual Report
- Legislación pro-empresa muy desarrollada

**Delaware:**
- No requiere nombre del propietario en el Certificate of Formation
- Tiene Franchise Tax ($300/año) más Annual Report ($50/año)
- El Court of Chancery es especializado en derecho corporativo
- Más caro pero con más jurisprudencia disponible

Para la mayoría de freelancers y emprendedores digitales que buscan privacidad + coste bajo, Nuevo México es la opción más eficiente.

## La privacidad como ventaja profesional

Más allá de la protección personal, la privacidad de tu LLC tiene ventajas profesionales:

**Imagen neutral:** Cuando facturas desde tu LLC, el cliente ve una empresa americana, no a una persona física de un país específico. Esto iguala el campo de juego cuando trabajas con clientes internacionales.

**Negociación desde la fuerza:** Un cliente que negocia con "TuNombre LLC" percibe más solidez que negociar con "tunombre@gmail.com". La LLC da estructura y profesionalismo sin exponer tu información personal.

**Protección patrimonial:** Al separar tu identidad personal de tu actividad empresarial, reduces el riesgo de que problemas del negocio afecten tus bienes personales.

## Cómo gestionamos la privacidad en Exentax

Cuando constituimos tu LLC:

- Elegimos el estado que mejor equilibra privacidad, costes y operatividad para tu caso
- Usamos nuestro Registered Agent como dirección pública de la LLC
- Preparamos un Operating Agreement que no necesita registrarse públicamente
- Te explicamos exactamente qué información es pública, cuál es privada y cuál conocen las autoridades

La privacidad es una herramienta legítima y útil. La usamos correctamente, dentro del marco legal, para proteger tu información personal mientras operas de forma profesional y transparente.

Agenda tu asesoría gratuita de 30 minutos. Te explicamos qué nivel de privacidad puedes obtener en tu caso y cómo estructurar tu LLC para maximizarla de forma legal.`,
    category: "Legal",
    readTime: 7,
    publishedAt: "2026-03-06",
    updatedAt: "2026-04-15",
    metaTitle: "Privacidad de tu LLC: NM vs WY vs DE, qué es público y qué no | Exentax",
    metaDescription: "Tu nombre no aparece en registros públicos en NM/WY. Pero IRS, FinCEN y tu banco sí lo saben. Privacidad real vs anonimato: la distinción que importa.",
  },
  {
    slug: "boi-report-fincen-guia-completa-2026",
    title: "BOI Report (FinCEN): guía completa para dueños de LLC en 2026",
    excerpt: "El BOI Report ante FinCEN es obligatorio desde 2024: 90 días para LLCs nuevas, datos del beneficial owner (nombre, pasaporte, dirección), presentación electrónica. Diferencia con el Form 5472 explicada.",
    content: `El BOI Report (Beneficial Ownership Information Report) es una declaración obligatoria ante FinCEN (Financial Crimes Enforcement Network) que identifica a los propietarios beneficiarios de empresas registradas en Estados Unidos. Si tienes una LLC, necesitas presentarlo. Aquí te explicamos todo.

## Qué es FinCEN y por qué pide esta información

FinCEN es una agencia del Departamento del Tesoro de Estados Unidos especializada en combatir delitos financieros: blanqueo de capitales, financiación del terrorismo, fraude. El BOI Report es su herramienta para saber quién está detrás de cada empresa registrada en EE.UU.

Antes de que existiera esta obligación, era posible <a href="/es/blog/constituir-llc-proceso-paso-a-paso">crear LLCs</a> sin que ninguna agencia federal tuviera un registro centralizado de quién era el propietario real. Eso cambiaba con el Corporate Transparency Act de 2021, implementado a partir de 2024.

## Quién debe presentar el BOI Report

**Todas las LLCs y Corporations registradas en cualquier estado de EE.UU.** están obligadas a presentar el BOI Report, salvo excepciones muy específicas (empresas con más de 20 empleados y más de $5M en ingresos que ya reportan a otros reguladores).

Si eres un freelancer o emprendedor con una Single-Member LLC, debes presentarlo. Sin excepciones.

## Qué información se reporta

El BOI Report incluye datos de la empresa y de cada propietario beneficiario:

**Datos de la empresa:**
- Nombre legal completo
- Nombre comercial (DBA), si lo tiene
- Dirección actual
- Estado y fecha de constitución
- EIN o Tax ID

**Datos de cada propietario beneficiario:**
- Nombre completo
- Fecha de nacimiento
- Dirección residencial actual
- Número de pasaporte o documento de identidad
- Imagen del documento de identidad

Un "propietario beneficiario" es cualquier persona que directa o indirectamente posea el 25% o más de la empresa, o que ejerza control sustancial sobre ella.

Para una Single-Member LLC, eso eres tú.

## Plazos de presentación

Los plazos dependen de cuándo se constituyó la LLC:

**LLCs creadas a partir de 2024:**
- 90 días desde la fecha de constitución para presentar el BOI Report inicial

**LLCs creadas antes de 2024:**
- Plazo extendido; consultar las fechas vigentes en FinCEN

**Actualizaciones:**
- Si cambia algún dato del propietario (dirección, documento, etc.): 30 días para actualizar
- Si cambia la estructura de propiedad: 30 días para actualizar

## Cómo se presenta

El BOI Report se presenta electrónicamente a través del sistema BOI E-Filing de FinCEN. No se presenta al IRS, es un reporte separado a una agencia distinta.

El formulario requiere:
- Datos de la empresa
- Datos personales de cada beneficial owner
- Subir imagen del documento de identidad de cada owner
- Confirmar y enviar

Una vez presentado, FinCEN te da un código de confirmación. Es importante guardar este código como prueba de cumplimiento.

## Diferencia entre BOI Report y Form 5472

Es una confusión habitual. Son dos cosas diferentes, y necesitas cumplir con ambas. Consulta nuestra <a href="/es/blog/form-5472-que-es-como-presentarlo">guía completa del Form 5472</a> para más detalles:

| | BOI Report | Form 5472 |
|---|---|---|
| **Agencia** | FinCEN | IRS |
| **Propósito** | Identificar propietarios | Reportar transacciones |
| **Frecuencia** | Inicial + actualizaciones | Anual |
| **Plazo** | 90 días desde constitución | 15 de abril (con extensión) |
| **Información** | Datos personales del owner | Transacciones LLC-owner |

Necesitas presentar ambos. Son complementarios, no excluyentes.

## Qué pasa con la privacidad

La información del BOI Report no es pública. FinCEN la mantiene en una base de datos segura y solo la comparte con:

- Autoridades policiales con una orden judicial o investigación activa
- Instituciones financieras con autorización del titular

Tu nombre, dirección y documento de identidad no aparecen en ningún registro público por culpa del BOI Report. Es información confidencial del gobierno federal.

## Cómo lo gestionamos en Exentax

El BOI Report está incluido en nuestros servicios de constitución y mantenimiento:

**En la constitución:**
- Preparamos y presentamos el BOI Report dentro del plazo de 90 días
- Recopilamos toda la documentación necesaria de forma segura
- Verificamos que toda la información sea correcta antes de enviar

**En el mantenimiento anual:**
- Verificamos que el BOI Report esté actualizado
- Si cambias de dirección, pasaporte o cualquier dato, lo actualizamos
- Monitorizamos cambios regulatorios que puedan afectar los requisitos

No tienes que entrar a ningún portal gubernamental, llenar formularios en inglés ni preocuparte por plazos. Nos encargamos de todo.

Si quieres entender todas las obligaciones de tu LLC, revisa nuestra guía de <a href="/es/blog/mantenimiento-anual-llc-obligaciones">mantenimiento anual</a>. Agenda tu asesoría gratuita de 30 minutos. Te explicamos el BOI Report en detalle y cómo lo gestionamos junto con el resto de obligaciones de tu LLC.`,
    category: "Compliance",
    readTime: 5,
    publishedAt: "2026-03-06",
    updatedAt: "2026-04-15",
    metaTitle: "BOI Report FinCEN 2026: qué es, plazos, datos y diferencia con Form 5472 | Exentax",
    metaDescription: "BOI Report obligatorio: 90 días para LLCs nuevas, datos del beneficial owner, presentación electrónica. Diferencia con Form 5472. Exentax lo gestiona por ti.",
  },
  {
    slug: "testaferros-prestanombres-llc-ilegal-riesgos",
    title: "Testaferros y prestanombres en LLCs: por qué es ilegal y cómo hacerlo bien",
    excerpt: "Poner tu LLC a nombre de otro es fraude ante el IRS (Form 5472 falso), FinCEN (BOI Report falso), tu banco (KYC fraudulento) y tu hacienda (evasión). Las alternativas legales para conseguir privacidad real.",
    content: `De vez en cuando recibimos consultas del tipo "¿puedo poner la LLC a nombre de mi primo que vive en Miami?" o "¿y si mi hermano es el owner oficial?". La respuesta es siempre la misma: no.

Usar un testaferro (prestanombre, front man, nominee) como propietario ficticio de tu LLC mientras tú eres quien realmente controla el negocio es fraude. No es una zona gris. No es una "estrategia". Es ilegal. Te explicamos por qué y cuáles son las alternativas legales.

## Qué es un testaferro

Un testaferro es una persona que figura como propietario oficial de una empresa, pero que en realidad no tiene control ni beneficio económico real. El verdadero dueño opera desde las sombras, tomando todas las decisiones y recibiendo los beneficios.

En el contexto de las LLCs americanas, esto suele ocurrir cuando alguien:
- Quiere una LLC pero no quiere que su nombre aparezca en ningún registro
- Cree que puede evitar obligaciones fiscales en su país si la LLC está "a nombre de otro"
- Piensa que así su hacienda local no sabrá que tiene una empresa en EE.UU.

## Por qué es ilegal

**1. Fraude ante el IRS**

Cuando solicitas un EIN, declaras quién es el "responsible party" de la LLC. Cuando presentas el <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a>, reportas transacciones entre la LLC y su propietario. Si el propietario declarado no es el propietario real, estás presentando información falsa al IRS. Eso es fraude fiscal federal.

**2. Violación del <a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a>**

El BOI Report ante FinCEN exige que declares a los "beneficial owners", los propietarios reales, no los nominales. Si pones a tu primo como owner pero tú eres quien controla el negocio, estás proporcionando información falsa a una agencia federal encargada de combatir delitos financieros.

**3. Fraude bancario**

Cuando abres una cuenta en <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a>, Relay o cualquier plataforma financiera, el proceso de KYC verifica la identidad del propietario. Si el KYC lo pasa tu primo pero tú operas la cuenta, estás cometiendo fraude bancario. La cuenta puede ser cerrada, los fondos congelados y se puede reportar a las autoridades.

**4. Evasión fiscal en tu país**

Si la razón de usar un testaferro es que tu hacienda local no sepa que tienes una LLC, estás evadiendo impuestos. No importa a nombre de quién esté la LLC, si los ingresos son tuyos, la obligación fiscal es tuya.

## Las consecuencias reales

No vamos a hablar de cifras específicas de sanciones porque no es nuestro estilo. Pero sí vamos a ser directos: las consecuencias de usar testaferros pueden incluir:

- Cierre de la cuenta bancaria y congelación de fondos
- Pérdida de la LLC y de toda su estructura
- Problemas legales en EE.UU. y en tu país de residencia
- Inhabilitación para abrir nuevas empresas en EE.UU.
- Antecedentes que dificultan futuras relaciones bancarias y comerciales

Y lo más importante: todo el ahorro fiscal que buscabas se pierde, porque la estructura ya no es defendible.

## Las alternativas legales

Si tu preocupación es la privacidad (que tu nombre no aparezca públicamente), hay formas legales de conseguirlo:

**1. Elegir un estado con privacidad en registros**

Nuevo México, Wyoming y Delaware no requieren que el nombre del propietario aparezca en los registros públicos. Tu LLC aparece con el nombre de la empresa y del Registered Agent, nada más. Legal y efectivo.

**2. Usar un <a href="/es/blog/registered-agent-que-es-por-que-necesitas">Registered Agent</a> profesional**

El Registered Agent es la dirección pública de tu LLC. Si usas un servicio profesional (como el que incluimos en Exentax), la dirección que aparece públicamente es la del agente, no la tuya personal.

**3. Tener un <a href="/es/blog/operating-agreement-llc-que-es">Operating Agreement</a> bien redactado**

El Operating Agreement no se registra públicamente en la mayoría de los estados. Tu nombre aparece en él, pero es un documento interno.

**4. Cumplir con el BOI Report**

Sí, FinCEN sabe quién eres. Pero esa información no es pública. Es confidencial y solo se comparte con autoridades bajo circunstancias específicas.

## La privacidad real vs la privacidad ficticia

Privacidad real: tu nombre no aparece en búsquedas públicas, pero las autoridades pertinentes saben quién eres y tú cumples con todas tus obligaciones.

Privacidad ficticia (testaferro): tu nombre no aparece en ningún sitio, pero estás cometiendo fraude en múltiples jurisdicciones y viviendo con el riesgo constante de que todo se derrumbe.

La primera opción te da paz mental. La segunda te da problemas.

## Cómo lo hacemos en Exentax

En Exentax no aceptamos constituciones con testaferros ni estructuras opacas. Cada LLC que constituimos:

- Tiene al propietario real como miembro registrado
- Cumple con el BOI Report declarando al beneficial owner real
- Opera con la cuenta bancaria a nombre del propietario real
- Presenta el Form 5472 con información veraz

Y aun así, nuestros clientes obtienen un nivel de <a href="/es/blog/privacidad-llc-americana-secreto-ventaja">privacidad</a> excelente: nombre fuera de registros públicos, dirección del Registered Agent como dirección oficial, Operating Agreement como documento interno.

Privacidad sí. Anonimato ante las autoridades, no. Fraude, nunca.

Agenda tu asesoría gratuita de 30 minutos. Te mostramos cómo puedes tener una LLC con privacidad real, cumplimiento total y optimización fiscal legal.`,
    category: "Legal",
    readTime: 6,
    publishedAt: "2026-03-06",
    updatedAt: "2026-04-15",
    metaTitle: "Testaferros y prestanombres en LLCs: fraude y alternativas legales | Exentax",
    metaDescription: "Poner tu LLC a nombre de otro es fraude ante IRS, FinCEN y tu banco. Consecuencias reales y 4 alternativas legales para conseguir privacidad sin riesgo.",
  },
  {
    slug: "por-que-no-abrir-empresa-estonia",
    title: "Por qué no abrir una empresa en Estonia: la verdad sobre la e-Residency",
    excerpt: "OÜ Estonia: 20% sobre distribuciones + IRPF en tu país + contabilidad Estonian GAAP + IVA obligatorio + registros públicos. LLC EE.UU.: $0 federal, Mercury sin comisiones, sin IVA, privacidad real. Datos reales.",
    content: `Si estás pensando en optimizar tu fiscalidad como freelancer o emprendedor digital, seguramente hayas oído hablar de la e-Residency de Estonia. El programa se ha viralizado en YouTube, Twitter y LinkedIn como "la solución definitiva para nómadas digitales". Y entendemos el atractivo: un país europeo, digitalización total, una tarjeta bonita con tu foto.

Pero cuando rascas la superficie, la realidad es muy diferente. Hablemos con datos, sin rodeos. Porque en Exentax creemos que las decisiones fiscales no se toman por tendencia sino por números.

## Qué es la e-Residency de Estonia

La e-Residency es un programa del gobierno estonio que permite a cualquier persona del mundo crear una empresa (OÜ. Osaühing, equivalente a una SL) en Estonia de forma remota. Obtienes una identidad digital, acceso a servicios gubernamentales online y la posibilidad de operar una empresa europea.

Suena bien. Pero una empresa europea implica fiscalidad europea. Y ahí empiezan los problemas.

## El mito: "En Estonia no pagas impuestos sobre beneficios no distribuidos"

Es cierto que Estonia no aplica impuesto de sociedades sobre beneficios reinvertidos. Si no sacas dinero de la empresa, no pagas. Pero, y este es un pero enorme. ¿de qué te sirve una empresa si no puedes usar los beneficios?

En el momento en que distribuyes dividendos (es decir, en el momento en que quieres disfrutar del dinero que has ganado), Estonia aplica un **20% de impuesto sobre distribuciones**. Técnicamente se calcula como 20/80 sobre el importe neto distribuido, es decir, si quieres recibir 10.000€ netos, la empresa debe "gastar" 12.500€ (10.000€ para ti + 2.500€ de impuesto). Eso equivale a un **20% sobre el importe bruto total**.

Y eso es solo el impuesto en Estonia. Si eres residente fiscal en España, además debes declarar esos dividendos y pagar IRPF del ahorro:

- Hasta 6.000€: **19%**
- 6.000€ – 50.000€: **21%**
- 50.000€ – 200.000€: **23%**
- 200.000€ – 300.000€: **27%**
- Más de 300.000€: **28%**

Sí, existe convenio de doble imposición entre España y Estonia que puede mitigar parcialmente la doble tributación. Pero la carga combinada sigue siendo significativa. Con 60.000€ de beneficios distribuidos, dependiendo de tu situación fiscal concreta, puedes acabar pagando entre un **20% y un 30%** en total entre ambos países.

## LLC en Estados Unidos: 0% de impuesto federal

Con una Single-Member LLC en EE.UU., la situación es radicalmente distinta:

- **Impuesto federal en EE.UU.: 0%.** La LLC es una "Disregarded Entity" para el IRS. Los beneficios pasan directamente al propietario sin tributar en Estados Unidos (<a href="/es/blog/tributacion-pass-through-llc-como-funciona">pass-through taxation</a>).
- **No hay impuesto sobre distribuciones.** No existe el concepto de "distribuir dividendos" porque la LLC es transparente fiscalmente. El dinero es tuyo desde el primer momento.
- **Sin impuesto estatal** en Nuevo México, Wyoming ni Delaware para no residentes.

En tu país de residencia declaras los beneficios netos, pero con todos los gastos deducibles de la LLC ya restados. La base imponible se reduce significativamente.

## Banca y pagos: Estonia vs Estados Unidos

Aquí es donde la diferencia se vuelve abismal.

### Con una OÜ en Estonia

- **Bancos estonios:** LHV, Swedbank o SEB pueden abrirte cuenta, pero la burocracia es considerable. Los neobancos como Wise Business funcionan, pero Wise no es un banco, es una EMI (Institución de Dinero Electrónico). No hay seguro de depósitos en la mayoría de opciones.
- **Stripe:** Funciona con empresa estona, pero con las limitaciones de operar en la zona SEPA. Las comisiones para pagos internacionales fuera de la UE son más altas.
- **PayPal Business:** Limitaciones según el país del propietario.
- **Divisa principal:** Euros. Si cobras en dólares, cada transacción implica conversión de divisa.

### Con una LLC en Estados Unidos

- **<a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a>:** Cuenta bancaria digital con $0 de comisiones. Wires internacionales gratuitos. Custodia en Column NA con seguro FDIC hasta $250,000. Tarjeta de débito sin coste.
- **Slash:** Tesorería corporativa, tu capital ocioso genera rendimiento. No es un banco: es treasury management profesional.
- **Wallester:** Tarjetas corporativas virtuales y físicas con control granular. Una tarjeta para cada gasto, límites individuales.
- **Relay:** Hasta 20 sub-cuentas gratuitas. Depósitos en Thread Bank. Links de pago via Adyen.
- **Wise Business / Revolut Business:** Conversión de divisas al tipo de cambio real, cuentas multi-divisa.
- **Stripe USA:** Sin restricciones. Acceso completo al ecosistema de pagos americano con comisiones competitivas.
- **Adyen:** Procesamiento enterprise con métodos de pago locales en 30+ países.
- **DoDo Payments:** Merchant of Record para ventas B2C, gestión automática de IVA/GST en cada país.
- **Interactive Brokers / Kraken:** Inversión corporativa y activos digitales desde tu LLC.
- **Divisa principal:** Dólares. Si tus clientes internacionales pagan en USD, no hay conversión.

La infraestructura financiera de EE.UU. es incomparablemente superior. Mercury, Slash, Wallester, Stripe, Adyen, ACH, wires, todo funciona sin fricción.

## Costes reales: la comparativa que nadie hace

### Montar y mantener una OÜ en Estonia

- **e-Residency card:** 100-120€ (una vez)
- **Constitución de la empresa:** 190€ (registro estatal) + capital social mínimo de 2.500€ (puede aplazarse)
- **Dirección legal en Estonia:** 50-100€/mes (obligatorio tener dirección estona)
- **Proveedor de servicios (contabilidad estonia):** 100-300€/mes (obligatorio si facturas regularmente)
- **Declaraciones fiscales anuales:** incluidas en el servicio contable o 200-500€ aparte
- **Impuesto sobre distribuciones:** 20% cada vez que sacas dinero
- **IVA intracomunitario:** si superas el umbral, debes registrarte y gestionar IVA
- **Coste anual estimado (sin impuestos):** variable

### Constituir y mantener una LLC en EE.UU. con Exentax

- **Constitución completa:** consultar (incluye Articles of Organization, Operating Agreement, EIN, Registered Agent, apertura de cuenta Mercury)
- **Mantenimiento anual:** consultar (incluye Form 5472, Form 1120, BOI Report, Registered Agent, compliance completo)
- **Impuesto federal EE.UU.:** $0
- **No hay IVA, no hay impuesto sobre distribuciones, no hay contabilidad obligatoria estona**
- **Coste anual estimado:** Consultar

La LLC es más barata de constituir, más barata de mantener y no tiene impuesto sobre distribuciones.

## Contabilidad y compliance: burocracia real

### Estonia

Una OÜ estona requiere:
- Contabilidad mensual según normativa estona (Estonian GAAP)
- Declaración anual de impuestos (incluso si no distribuyes)
- Registro de IVA si vendes servicios B2C en la UE o superas umbrales
- Declaraciones OSS (One-Stop Shop) para ventas digitales en la UE
- Informes estadísticos al gobierno estonio
- Actualización de datos en el registro mercantil
- Auditoría obligatoria si superas ciertos umbrales de facturación

Necesitas un contable estonio. Necesitas entender la normativa estonia. Necesitas gestionar IVA europeo. Y todo esto con un idioma que probablemente no hablas.

### LLC en Estados Unidos

Una Single-Member LLC de no residente necesita:
- <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a> + Form 1120 (declaración informativa anual, no implica pago)
- <a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a> ante FinCEN
- Renovación de <a href="/es/blog/registered-agent-que-es-por-que-necesitas">Registered Agent</a>

En Exentax nos encargamos de todo. Tú no tocas ni un formulario.

## La trampa del "0% mientras no distribuyas"

Este es el argumento estrella de la e-Residency. "No pagas impuestos si reinviertes". Pero pensemos un segundo:

1. **¿Para qué montas un negocio si no vas a usar el dinero?** El objetivo de cualquier emprendedor es generar ingresos para vivir. Si no puedes sacar el dinero sin pagar un 20-25%, ¿qué sentido tiene?

2. **La reinversión tiene límites.** Puedes reinvertir en herramientas, software, marketing, lo mismo que con una LLC. Pero cuando necesitas pagar tu alquiler, tu comida o tus vacaciones, necesitas distribuir. Y ahí pagas.

3. **Tu país de residencia no se olvida.** Si eres residente fiscal en España y tienes una empresa en Estonia, Hacienda puede saberlo gracias al CRS (intercambio automático de información). Según tu caso, podrías tener la obligación de declarar la empresa en el Modelo 720 y tributar por los rendimientos. Aprende más sobre el <a href="/es/blog/crs-cuentas-bancarias-llc-intercambio-informacion">CRS y el intercambio de información fiscal</a>.

4. **Con una LLC, no hay "distribución".** La LLC es transparente. No existe el concepto de dividendo. El dinero fluye directamente. No hay doble tributación.

## El IVA: el problema que nadie menciona

Con una empresa estona, si vendes servicios digitales a clientes en la UE:
- Debes registrarte en IVA si superas umbrales (o voluntariamente para deducir IVA soportado)
- Debes aplicar IVA del país del cliente (sistema OSS)
- Debes presentar declaraciones de IVA periódicas
- Debes mantener registros según normativa europea

Con una LLC americana:
- No existe IVA en Estados Unidos
- No tienes obligaciones de IVA europeo (a menos que vendas directamente a consumidores en la UE, en cuyo caso también aplica con empresa estona)
- Facturas sin impuestos indirectos a clientes internacionales

## Privacidad: Estonia pierde por goleada

Los registros mercantiles de Estonia son **completamente públicos**. Cualquiera puede buscar tu empresa en el Äriregister y ver:
- Tu nombre completo como propietario
- Tu dirección (o la del proveedor de servicios)
- El capital social
- Los estados financieros anuales (sí, son públicos)

Con una LLC en Nuevo México o Wyoming:
- Tu nombre no aparece en registros públicos estatales
- La dirección pública es la del Registered Agent
- No hay estados financieros públicos
- Solo FinCEN conoce tu identidad (a través del BOI Report, que es confidencial)

## ¿Para quién puede tener sentido Estonia?

Seamos justos. La OÜ estona puede tener sentido en casos muy específicos:
- Necesitas una empresa de la UE por requisitos regulatorios
- Tus clientes solo trabajan con empresas europeas
- Operas exclusivamente en el mercado SEPA
- No necesitas acceso a la infraestructura financiera americana

Pero si eres freelancer digital, SaaS, e-commerce internacional, creador de contenido o consultora, la LLC es superior en prácticamente todos los aspectos.

## Comparativa directa: Estonia vs LLC

| Concepto | OÜ Estonia | LLC en EE.UU. |
|----------|-----------|---------------|
| Impuesto sobre beneficios | 0% reinvertidos, 20% distribuidos | 0% federal (pass-through) |
| Impuesto sobre distribuciones | 20-25% efectivo | No existe |
| Banca en dólares | Limitada | Total (Mercury, Relay, Slash, Wallester) |
| Stripe sin restricciones | Parcial (SEPA) | Total |
| IVA | Sí (si vendes en UE) | No |
| Contabilidad obligatoria | Sí (Estonian GAAP) | No |
| Privacidad del propietario | Ninguna (registro público) | Alta (NM, WY) |
| Coste anual mantenimiento | variable | Consultar |
| Protección patrimonial | Sí | Sí |
| Credibilidad internacional | Moderada | Alta |
| Seguro de depósitos | Variable | FDIC hasta $250,000 |

## La verdad incómoda

La e-Residency de Estonia se ha convertido en un producto de marketing brillante. Un gobierno que vende ciudadanía digital con una narrativa de innovación y modernidad. Y funciona: miles de personas se han apuntado.

Pero los números no mienten. Cuando sumas los costes de contabilidad obligatoria, el impuesto sobre distribuciones, la gestión de IVA, y las limitaciones bancarias, la OÜ estona es más cara, más burocrática y fiscalmente menos eficiente que una LLC americana para la inmensa mayoría de freelancers y emprendedores digitales hispanos.

## En Exentax te damos la estructura que realmente funciona

No vendemos humo ni modas. Diseñamos estructuras fiscales basadas en la legislación vigente, con números reales y compliance total.

- **Constitución completa de LLC** consultar
- **Mantenimiento anual** consultar
- **0% impuesto federal** en EE.UU.
- **Banca en Mercury** con $0 comisiones y seguro FDIC
- **Compliance total:** <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472</a>, Form 1120, <a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a>, <a href="/es/blog/registered-agent-que-es-por-que-necesitas">Registered Agent</a>

¿Estabas pensando en Estonia? Agenda una asesoría gratuita de 30 minutos y te mostramos los números reales para tu caso. Sin compromiso, sin presión, solo datos. En 30 minutos sabrás exactamente cuánto pagarías con una LLC vs con una empresa estona.`,
    category: "Comparativas",
    readTime: 13,
    publishedAt: "2026-03-13",
    updatedAt: "2026-04-15",
    metaTitle: "Estonia vs LLC en EE.UU.: por qué la e-Residency no conviene | Exentax",
    metaDescription: "OÜ Estonia: 20% distribuciones + contabilidad Estonian GAAP + IVA + registros públicos. LLC EE.UU.: $0 federal, Mercury FDIC, sin IVA, privacidad. Comparativa completa.",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}

export { getLocalizedBlogMeta as getLocalizedMeta } from "./blog-posts-i18n";
export { getTranslatedSlug, resolveToSpanishSlug } from "./blog-posts-slugs";
