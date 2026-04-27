export default `

Cuando alguien abre una LLC desde fuera de EE.UU. la conversación bancaria se reduce casi siempre a una sola pregunta: "¿Mercury o Wise?". Esa pregunta es **el síntoma del problema, no la solución**. Una LLC operativa no se sostiene sobre una sola cuenta, ni siquiera sobre dos. Necesita una **stack bancaria** pensada como un sistema. En este artículo te explicamos cómo se diseña una stack que aguante el día a día, qué pasa cuando una pieza falla, y por qué el 80 % de los bloqueos que vemos en Exentax llegan precisamente por no tener nada de esto montado.

No es un artículo sobre Wise vs Mercury (para eso ya tienes la <a href="/es/blog/wise-business-llc-guia">guía completa de Wise Business para LLC</a>, la <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">guía de Mercury</a> y la <a href="/es/blog/bancos-vs-fintech-llc-donde-abrir-cuenta">comparativa banco vs fintech</a>). Es el artículo que ordena las piezas anteriores en una arquitectura coherente.

## El error mental: pensar la cuenta como "la cuenta"

La gente que viene de Europa o LATAM trae un modelo bancario muy concreto: **una cuenta por persona física, una cuenta por sociedad**. Punto. Si esa cuenta se bloquea, vas a la sucursal, hablas con tu gestor, lo arreglas. El sistema asume que el banco tiene incentivos para no perderte como cliente.

En el ecosistema **fintech estadounidense**, ese modelo no existe. Mercury, Wise, Brex, Relay, Revolut Business y compañía son **plataformas tecnológicas**, no bancos. La cuenta se abre por API, se cierra por API, y las decisiones las toma un sistema de scoring + un equipo de compliance que tú no conoces y al que no puedes llamar. Si el sistema decide que tu cuenta entra en revisión, tu acceso queda **congelado durante 30, 60 o 90 días**, y nadie te garantiza la recuperación de los fondos en un plazo corto.

El primer cambio mental es éste: **una cuenta no es la cuenta. Es un proveedor más, sustituible y reemplazable, igual que un proveedor de hosting o un dominio**. Y como cualquier proveedor crítico, necesita redundancia.
## La stack mínima viable para una LLC operativa

A partir del segundo año de actividad real (es decir: facturando y cobrando con regularidad), la stack mínima de una LLC bien gestionada se parece bastante a esto:

1. **Cuenta operativa principal en USD** (Mercury, Brex o un banco tradicional como Bank of America/Chase si has podido abrirla en persona).
2. **Cuenta secundaria en USD** del mismo perfil (típicamente Relay si la principal es Mercury, o viceversa). No para uso diario, sino como **failover real** si la primera se bloquea.
3. **Cuenta multi-divisa con IBAN europeo** (Wise Business típicamente). Para cobrar a clientes europeos en EUR sin SWIFT y para tener un punto de entrada al sistema bancario europeo.
4. **Pasarela de pagos** conectada a una de las dos cuentas USD (Stripe, PayPal Business, Dodo Payments). Ver la <a href="/es/blog/pasarelas-pago-llc-stripe-paypal-dodo">comparativa de pasarelas</a>.
5. **Tarjeta corporativa física + tarjetas virtuales** para suscripciones SaaS y compras puntuales.
6. **Reservas separadas** para impuestos, FX y operativa (más abajo lo desarrollamos).

Si te parece excesivo: lo es para el primer mes. Es **estrictamente lo mínimo** para no quedarte sin operativa cuando algo falla. Y algo siempre falla.
## Por qué Mercury solo no basta

Mercury es probablemente el mejor producto del mercado para una LLC de no residente: onboarding online, sin coste mensual, integración decente con software contable y un equipo de soporte razonable. Pero Mercury **no es un banco**: es una capa software encima de varios bancos partner (Choice Financial, Column N.A. Evolve). Si uno de esos partners decide cortar el cable contigo, Mercury **no puede reabrirte la cuenta** ni mover los fondos a otro partner sin tu intervención.

Lo que vemos en Exentax casi todas las semanas:

- Cuenta Mercury bloqueada por una transferencia entrante "atípica" (un cliente desde Filipinas, un pago de un exchange de cripto; un retorno de Stripe sin descripción clara).
- Email automático de Mercury pidiendo documentación adicional (factura, contrato, justificación del flujo).
- 7 a 14 días sin operativa mientras compliance revisa.
- En el 70 % de los casos, cuenta restablecida. En el 30 %, **cierre con devolución de fondos en 30-60 días**.

Si toda tu operación depende de esa cuenta, durante esas semanas no puedes pagar al equipo, no puedes facturar a clientes que requieren ACH, y no puedes mantener tus suscripciones SaaS críticas. Tener una cuenta secundaria preautorizada y operativa convierte un evento de **crisis empresarial** en una **molestia de 48 horas**.
## Por qué Wise solo no basta

Wise Business es excelente para multi-divisa, IBAN europeo y conversión FX. Pero Wise **no es una cuenta operativa estadounidense**. Su routing y account number en USD son técnicamente "details", no una cuenta bancaria nominal a tu LLC en un banco USA. Eso tiene tres implicaciones prácticas:

1. **Stripe USA, Amazon US, ciertos marketplaces y empresas grandes** te aceptan los datos USD de Wise sin problemas, pero algunas (sobre todo entidades públicas, brokers regulados o partners que requieren ACH directo) los rechazan al detectar que el receptor es un EMI y no un banco.
2. **La operativa Stripe → Wise → tu IBAN local** funciona, pero suma un actor más a la cadena de compliance. Cuando hay un bloqueo, tienes que demostrar la trazabilidad completa a más de una entidad.
3. **Wise reporta a tu hacienda local vía CRS** desde Bélgica y a otras jurisdicciones según donde esté el saldo. Si crees que tener Wise te da privacidad, lee primero <a href="/es/blog/wise-iban-llc-que-reporta-hacienda">qué reporta realmente Wise a Hacienda</a> y <a href="/es/blog/wise-business-crs-reporting-fiscal">cómo encaja Wise en CRS</a>.

Conclusión: Wise es **una pieza imprescindible** del puzle europeo, pero no sustituye una cuenta operativa USD nominal a tu LLC.
## La trampa del IBAN belga (y del IBAN no español)

Cuando abres Wise Business como LLC americana, te asignan un **IBAN belga** (BE...). Esto sorprende a mucha gente que creía que iba a recibir un IBAN del país donde reside. La consecuencia es doble:

- A efectos operativos, el IBAN funciona perfectamente para SEPA dentro de la zona euro. Cobras y pagas como si fuera una cuenta belga.
- A efectos fiscales y de **declaración de bienes en el extranjero** (Modelo 720 en España, IES en Portugal, 3916 en Francia, equivalentes en otros países), ese IBAN belga es **una cuenta en el extranjero a nombre de una entidad extranjera**. Si superas los umbrales y eres residente fiscal en uno de esos países, **tienes que declararla**.

El error típico: "como el IBAN empieza por BE, no es 'mi cuenta', es de la LLC, no la declaro". Falso. La normativa de declaración de bienes en el extranjero mira al beneficiario efectivo (tú, persona física), no al titular formal. Esto es exactamente lo mismo que pasa con la cuenta Mercury en USA. Más sobre esto en <a href="/es/blog/cuentas-bancarias-usa-reportan-hacienda-verdad">cuentas bancarias USA y Hacienda</a> y en la <a href="/es/blog/crs-cuentas-bancarias-llc-intercambio-informacion">guía CRS para cuentas bancarias de LLC</a>.
## Reglas internas de operación que te ahorran 5 cifras

La stack es solo el hardware. Lo que evita los problemas reales son las reglas de operación que pongas encima. Las que recomendamos a clientes Exentax:

### 1. Nunca, jamás, mezclar personal y LLC

Suena obvio, pero es el error más caro y más frecuente. Si pagas tu Netflix personal con la tarjeta de la LLC, o cobras un trabajo personal en la cuenta de la LLC, estás **rompiendo el corporate veil** (la separación legal entre tú y la LLC) y dándole a Hacienda + <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> una bandeja de plata para tratar la LLC como una extensión de tu patrimonio personal. Cero excepciones. Si necesitas dinero, te haces una distribución y entonces lo gastas como persona física.

### 2. Segmentar por riesgo

Si tu LLC tiene clientes B2B grandes y a la vez recibes pagos de marketplaces de cripto o de gateways "tier 2", **separa los flujos en cuentas distintas**. La cuenta principal recibe los flujos limpios y bien documentados. La secundaria absorbe los flujos más volátiles. Si la segunda se bloquea por un movimiento atípico, la primera sigue operando.

### 3. Tax buffer del 25-35 %

Cada vez que entra dinero en la cuenta operativa, **separa automáticamente entre un 25 % y un 35 %** a una cuenta o sub-cuenta de "tax reserve". Esto cubre el impuesto que pagarás en tu país de residencia (que sí, lo pagarás; ver <a href="/es/blog/llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais">por qué tu LLC no paga en EE.UU. pero tú sí en tu país</a>). Mercury y Relay permiten crear sub-cuentas o "vaults"; Wise tiene "Jars". Úsalo.

### 4. FX buffer separado

Si tu negocio cobra en USD pero tú gastas/declaras en EUR/GBP/MXN, las fluctuaciones FX te pueden comer 5-10 % de margen en un mal trimestre. Mantén un **buffer FX** en una cuenta multi-divisa para no convertir en el peor momento.

### 5. Documentar contratos antes de que llegue el primer pago

Cada vez que entra una transferencia >5.000 USD de un cliente nuevo, vas a recibir antes o después un email de compliance pidiendo "purpose of payment, contract, invoice". Tener el contrato firmado y la factura emitida **antes** de cobrar (no después) reduce de 14 días a 24 horas el tiempo de revisión.

### 6. Backup absoluto: la regla del "si esto se cae mañana"

Pregúntate cada trimestre: "si Mercury se cae mañana de forma definitiva, ¿qué hago en las próximas 72 horas?". Si la respuesta es "no lo sé", la stack está mal montada. La respuesta correcta es: "tengo cuenta secundaria operativa, mi pasarela de pagos puede repuntarla en 1 hora, y mi proveedor crítico de SaaS lo tengo cargado a una tarjeta virtual de la cuenta secundaria".
## Qué pasa cuando bloquean (no es "si", es "cuando")

Hablar de bloqueos como una excepción rara hace daño porque la gente no se prepara. La verdad operativa: **toda LLC con más de 18 meses de actividad ha tenido al menos un evento de bloqueo o revisión**. Lo que cambia entre clientes es la magnitud del daño, y eso depende de la stack.

Bloqueo típico:

- **Día 0**: email automático "your account is under review, please provide additional information".
- **Días 1-3**: subes los documentos pedidos (factura, contrato, justificación del beneficiario, captura del proyecto).
- **Días 4-14**: silencio. Tu acceso está limitado a entrante; no puedes sacar dinero ni emitir transferencias.
- **Día 14-30**: o reapertura completa, o cierre con devolución de fondos en 30-60 días naturales.

Para minimizar daño:

- Activa la cuenta secundaria desde el día 1, **no desde el día del bloqueo** (algunos onboardings tardan 2-3 semanas).
- Mantén ambas cuentas en uso ligero permanente. Una cuenta sin movimientos durante 6 meses se "duerme" y a veces requiere reverificación al reactivarla, justo cuando más prisa tienes.
- Guarda copia mensual de extractos en PDF y en un drive propio. Si te cierran, puedes perder acceso a la interfaz pero necesitarás esos extractos para Hacienda y para tu contabilidad.
- Documenta cada cliente con un mini-dossier (web, contrato, dirección legal). Los compliance teams lo agradecen y tu tiempo de respuesta baja.
### La conversación de las pasarelas: Stripe y compañía

Stripe es la opción por defecto para casi cualquier LLC, pero tiene su propio régimen de bloqueos: **rolling reserves del 5-10 %** durante 90-120 días para cuentas nuevas o de alto riesgo, y la posibilidad de congelar fondos si detecta fraude o disputa elevada. Reglas básicas:

- **No conectes Stripe a una cuenta única**. Si Stripe envía un payout y la cuenta receptora está bloqueada, el dinero queda en limbo.
- Marca tu **descriptor en Stripe** con tu nombre comercial real (no el legal de la LLC), reduce los chargebacks por "no reconozco el cargo".
- Si aceptas pagos de subscriptores recurrentes, configura **alertas de churn** + un colchón equivalente a 30 días de payout para absorber un freeze.

PayPal Business es útil pero tiene fama merecida de bloqueos arbitrarios. Como **canal complementario** funciona; como canal único, no.
### Tarjetas: físicas, virtuales y la regla de "una por categoría"

Las tarjetas son la parte que más se descuida. Recomendación operativa:

- **Una tarjeta física**: para gasto físico (oficina coworking, viajes, comidas con clientes).
- **Tarjeta virtual "SaaS"**: todas las suscripciones recurrentes. Si la comprometen, paras un solo conjunto de cargos.
- **Tarjeta virtual "Ads"**: campañas pagadas (Google Ads, Meta, LinkedIn). Suelen tener cargos altos y picos imprevisibles que despiertan al anti-fraude.
- **Tarjeta virtual "single-use"**: para compras puntuales en proveedores poco fiables. La generas, la usas, la cierras.

Mercury y Brex emiten todas estas categorías sin coste. Wise también. Si pagas todo con la misma tarjeta, un solo fraude te tira la operativa entera.
## Lo que deberías llevarte

- La pregunta correcta no es "Mercury o Wise", es "**qué stack monto**".
- Una LLC operativa profesional tiene mínimo **2 cuentas USD + 1 cuenta multi-divisa + pasarela + tarjetas segmentadas + reservas**.
- Mercury sola no basta. Wise sola no basta. Ambas combinadas tampoco bastan sin reservas y reglas internas.
- El IBAN de Wise es belga, no español ni de tu país. Sigue siendo cuenta en el extranjero a efectos de declaración.
- Los bloqueos no son excepción, son rutina con un calendario predecible. La diferencia entre "molestia" y "crisis" es la stack.
- **Nunca mezclar personal y LLC**, segmentar por riesgo, tax buffer del 25-35 %, FX buffer y documentación pre-pago son las cinco reglas que te ahorran cinco cifras.

Si tienes una LLC y quieres que diseñemos contigo la stack bancaria correcta para tu volumen y tu perfil de riesgo, **lo vemos juntos** en una asesoría gratuita de 30 minutos. Lo barato es montarla bien al principio. Lo caro es montarla a medias y descubrirlo el día que Mercury te manda el primer email de "your account is under review".
## Referencias legales y normativas

Este artículo se apoya en normativa vigentes actualmente. Citamos las fuentes principales para que puedas verificarlo:

- **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report ante <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **España.** Ley 35/2006 (LIRPF), arts. 8, 9 (residencia), 87 (atribución de rentas), 91 (transparencia fiscal internacional para personas físicas); Ley 27/2014 (LIS), art. 100 (transparencia fiscal internacional para sociedades); Ley 58/2003 (LGT), arts. 15 (conflicto en aplicación de la norma) y 16 (simulación); Ley 5/2022 (régimen sancionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 720); Orden HFP/887/2023 (Modelo 721 cripto).
- **Convenio España–EE. UU.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de 22/12/1990 (CDI original); Protocolo en vigor desde 27/11/2019 (renta pasiva, *limitation on benefits*).
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetrías híbridas); Estándar Común de Reporte (CRS) de la OCDE.
- **Marco internacional.** Modelo de Convenio OCDE, art. 5 (establecimiento permanente) y comentarios; Acción 5 BEPS (sustancia económica); FATF Recommendation 24 (titularidad real).

<!-- exentax:calc-cta-v1 -->
> <a href="/es/agendar">Consulta gratuita sin compromiso</a>
<!-- /exentax:calc-cta-v1 -->

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

## Próximos pasos

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
## Wise + bancos para LLC: el stack bancario completo que debería tener cualquier no residente

La pregunta "¿Mercury o Wise?" es mal planteada. La respuesta correcta es "los dos, más Stripe, más una alternativa". Una LLC operativa no funciona con una sola cuenta - funciona con un stack que distribuye riesgos (freezes, AML), optimiza costes (FX, fees) y permite separar funciones (operating, savings, FX). Este es el stack que recomendamos por defecto.

- **Capa 1: cuenta operativa principal (Mercury).** Mercury es el "primary checking" de la LLC. Recibe Stripe payouts, paga vendors via ACH gratuito, emite tarjeta debit USD, integra con QuickBooks. Bajo coste (free tier amplio), API decente, UX excelente. Riesgo: freeze por descripción vaga o actividad atípica - no debería ser el único banco.
- **Capa 2: respaldo y multi-divisa (Wise Business).** Wise USD/EUR/GBP como cuenta paralela. Recibe pagos de clientes europeos directamente en EUR (transferencia local SEPA, no SWIFT), de UK en GBP, de US en USD via ACH propio. Si Mercury cierra mañana, Wise sigue operando 24h. FX típico 0.4% (vs 1%-3% de bancos tradicionales). Tarjeta debit multi-divisa.
- **Capa 3: gateway de cobro (Stripe + alternativo).** Stripe US conectado a Mercury para cobros tarjeta de cliente. Lemon Squeezy o Dodo Payments como Merchant of Record para venta de digitales en UE (cubren IVA digital, te liberan de OSS/MOSS). PayPal Business como tercer método para clientes B2C que lo demanden. NUNCA un solo gateway: freezes pasan.
- **Capa 4: tesorería y FX optimizado.** Cuenta Wise EUR para acumular reservas en moneda fuerte. Wise FX para convertir USD → EUR cuando spread sea favorable, no automáticamente. Si la LLC factura en USD y tú vives en EUR, optimizar el momento de conversión vale 0.5%-1% anual sobre el flujo total.

### El stack completo de un caso típico

LLC Wyoming + EIN + Mercury (operativa USD) + Wise Business (USD/EUR/GBP) + Stripe (cobro tarjeta) + Lemon Squeezy (cobro UE digital) + PayPal (alternativo). Coste mensual recurrente ~$50-$100 si volumen &lt;100k$/año. Con esto cubres 95% de escenarios sin tener que abrir cuenta nueva nunca.

### Lo que más nos preguntan

**¿Mercury o Wise USD para Stripe payout?** Mercury es algo más rápido en payout (1 día menos) y mejor integrado por defecto. Wise USD funciona también pero a veces Stripe pide verificación adicional al cambiar a Wise. Recomendación: Stripe → Mercury principal, Wise como respaldo si Mercury freeze.

**¿Brex o Ramp tienen sentido para LLC pequeña?** No para volumen &lt;500k$/año típicamente. Brex y Ramp ofrecen tarjetas corporativas con cashback y herramientas de gasto, útiles para equipos con muchos empleados que cargan gasto. Para LLC unipersonal o de 2-3 personas, Mercury + Wise es más sencillo y barato.

En Exentax montamos el stack completo (formación + EIN + Mercury + Wise + Stripe + alternativo) en setup paquetizado, con onboarding asistido cuando hay rechazo bancario - para que arranques con redundancia, no con punto único de fallo.
<!-- /exentax:execution-v2 -->

## Tu siguiente paso con Exentax

En Exentax constituimos y mantenemos LLCs de no residentes a diario: estado, EIN, Operating Agreement, BOI cuando aplique, banca con Mercury y Wise, pasarelas Stripe y Adyen, contabilidad mensual, Form 5472 y 1120 pro-forma cada año, y coordinación con tu fiscalidad en residencia. Si quieres validar tu caso con datos reales, agenda una asesoría con nuestro equipo y te explicamos paso a paso cómo encajaría en tu situación concreta.

<!-- exentax:cross-refs-v1 -->
### Más lecturas relacionadas

- [Reorganizar la banca de tu LLC: cuándo combinar Mercury, Relay y Wise](/es/blog/reorganizar-banca-llc-mercury-relay-wise)
- [Justificar el origen de los fondos en una segunda ronda de KYC bancario](/es/blog/justificar-origen-fondos-kyc-bancario-segunda-ronda)
<!-- /exentax:cross-refs-v1 -->

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
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22wise%20bancos%20llc%20stack%20bancaria%20completa%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

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