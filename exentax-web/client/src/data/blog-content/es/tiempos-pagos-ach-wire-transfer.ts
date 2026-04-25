export default `

Una de las preguntas más frecuentes cuando empiezas a operar tu LLC es: "Le mandé dinero a un cliente, ¿cuándo llega?" O al revés: "Me van a pagar, ¿cuándo lo veo en mi cuenta?"

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
### Wire Transfer doméstico

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
### Wise Business

Wise no usa la red SWIFT para la mayoría de transferencias. Usa cuentas locales en cada país, lo que reduce tiempos y costes.

### Tiempos en Wise

| Ruta | Tiempo |
|---|---|
| USD → EUR (SEPA) | **1-2 días hábiles** |
| USD → GBP | **1 día hábil** |
| USD → MXN | **1-2 días hábiles** |
| USD → COP | **1-3 días hábiles** |
### Comparativa general

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

Cierro con lecturas relacionadas que encajan con el hilo de este artículo: <a href="/es/blog/primer-mes-llc-que-esperar">Tu primer mes con una LLC: qué esperar paso a paso</a> y <a href="/es/blog/cambiar-divisas-llc-mejores-opciones">Cómo cambiar divisas en tu LLC: las mejores opciones</a> son piezas útiles para terminar de contextualizar el escenario.
### El dato que cambia todo: Mercury $0 wire fees

La mayoría de bancos cobran entre $15-50 por wire transfer. Mercury no cobra nada. Cero. Ni nacionales ni internacionales. Esto cambia completamente cómo planificas tus pagos:

- ¿Necesitas pagar a un proveedor en Europa? Wire internacional desde Mercury: $0
- ¿Un cliente americano quiere pagarte por wire? Lo recibes gratis
- ¿Wise te pide enviar fondos por wire para verificación? $0

Mercury usa Column NA como banco custodio, con seguro FDIC. No es una fintech experimental, es infraestructura financiera seria para tu LLC. Consulta nuestra <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">guía completa de Mercury</a> para más detalles.

En Exentax te ayudamos a configurar el flujo de pagos óptimo para tu negocio: Mercury como hub central, <a href="/es/blog/wise-business-llc-guia">Wise como herramienta de conversión</a> (es una EMI con tipo de cambio real), y Relay (Thread Bank) como respaldo. Todo integrado y sin sorpresas.
## Stack bancario equilibrado: Mercury, Relay, Slash y Wise

No existe la cuenta perfecta para una LLC. Existe el **stack** correcto, donde cada herramienta cubre un rol:

- **Mercury** (operada como fintech con bancos asociados (Choice Financial Group y Evolve Bank & Trust principalmente; Column N.A. en cuentas heredadas), FDIC vía sweep network hasta el límite vigente). Cuenta principal operativa para no residentes con buena UX, ACH y wires. Sigue siendo una de las opciones más probadas para abrir desde fuera de EE. UU.
- **Relay** (respaldada por Thread Bank, FDIC). Excelente como **cuenta de respaldo** y para gestión "envelope budgeting": permite crear hasta 20 sub-cuentas y 50 tarjetas de débito, integración profunda con QuickBooks y Xero. Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare.
- **Slash** (respaldada por Column N.A. (banco federalmente registrado, con cobertura FDIC)). Banca diseñada para operadores online: emisión instantánea de tarjetas virtuales por proveedor, controles de gasto granulares, *cashback* en publicidad digital. Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS.
- **Wise Business** (EMI multi-divisa, no es banco). Para cobrar y pagar en EUR, GBP, USD y otras divisas con datos bancarios locales y conversión a *mid-market rate*. No sustituye una cuenta US real, pero es imbatible para tesorería internacional.
- **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen. Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC.

<!-- exentax:calc-cta-v1 -->
> <a href="/es/agendar">Consulta gratuita sin compromiso</a>
<!-- /exentax:calc-cta-v1 -->

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

<!-- exentax:legal-refs-v1 -->
## Referencias: fuentes y normativa de banca

Toda la operativa bancaria descrita se apoya en documentación pública y políticas vigentes de cada plataforma actualmente:

- **Bank Secrecy Act y <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>.** 31 U.S.C. §5318 (programas KYC/AML obligatorios para instituciones financieras), 31 CFR Part 1010 (CIP, identificación del cliente) y 31 U.S.C. §5336 con su Reporting Rule de FinCEN del 1 de enero de 2024 (Beneficial Ownership Information Report).
- **FATCA y CRS.** IRC §1471-1474 (FATCA y formularios W-8/W-9), Acuerdos Intergubernamentales Modelo 1 firmados por EE. UU. con España y otros países LATAM, y el Estándar Común de Reporte (CRS) de la <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> en el que EE. UU. no participa pero que sí aplica a fintech con licencia europea (Wise Europe SA en Bélgica, Revolut Bank UAB en Lituania).
- **Plataformas concretas.** Términos de servicio publicados, política de privacidad y FAQ regulatoria de Mercury (Choice Financial Group / Evolve Bank, FDIC), Relay (Thread Bank, FDIC), Wise Business (FinCEN MSB en EE. UU.; Wise Europe SA en EU; Wise Payments Ltd. en UK), Revolut Business y Payoneer.
Información a efectos divulgativos; cada caso bancario requiere análisis específico de KYC, jurisdicción de residencia y volumen operado.

<!-- exentax:execution-v2 -->
## Tiempos de pago ACH y wire transfer en US: lo que tarda cada método y cuándo usar cuál

Si vienes de SEPA y Bizum, el sistema de pagos US parece de otro siglo. Conviene entenderlo porque afecta cuándo cobras, cuánto pagas en comisiones, y qué método propones a clientes corporativos para que firmen contrato. Resumen práctico de los cuatro flujos que importan en una LLC operativa.

- **ACH (Automated Clearing House).** El SEPA americano. Coste casi cero (0$-1$ por transferencia en Mercury/Wise/Relay), liquidación en 1-3 días hábiles. Estándar para pagos B2B recurrentes domésticos US (suscripciones, payroll, pagos a proveedores). Con Same-Day ACH (sobrecoste) baja a horas. NO es internacional: ACH solo cuentas US a cuentas US.
- **Wire transfer doméstico.** Como una transferencia urgente: 5$-30$ por envío, llega en horas (mismo día si antes de cutoff, ~14:00 ET). Lo usan corporativos para pagos grandes (>10k$) y cierres de operaciones donde el timing importa (M&A, real estate). Inmediato y final: una vez enviado no se puede cancelar.
- **Wire transfer internacional (SWIFT).** El método para cobrar de fuera de US a tu LLC, y viceversa. Coste 15$-50$ por envío + comisión bancos intermediarios + spread de cambio (~1%-3%). Llega en 1-5 días hábiles según corredor. Requiere SWIFT/BIC del banco y, si es a EUR, IBAN. Para reducir coste y tiempo: Wise USD/EUR es ACH local en cada lado y elimina SWIFT.
- **Stripe payouts y otros gateways.** El payout estándar de Stripe a tu cuenta US es ACH 2 días hábiles (estándar) o instantáneo con sobrecoste 1%. Para LLC con clientes globales que cobran via Stripe, este flujo determina tu working capital: facturas el 1, Stripe deposita el 5-7, tu wire a personal sale el 8.

### Estrategia operativa típica para una LLC de no residente

Revenue: clientes US pagan vía ACH o Stripe → cuenta Mercury/Wise USD. Clientes internacionales pagan vía Wise (transferencia local en su moneda) o Stripe (con FX automática). Outflow: pago a proveedores US vía ACH (gratis), pago a proveedores internacionales vía Wise (mejor FX), draw a personal vía Wise USD → IBAN EUR (3-5 días, ~0.4% spread). Esto minimiza coste FX vs SWIFT tradicional.

### Lo que más nos preguntan

**¿Por qué Stripe tarda 7 días en pagarme y mi cliente ya pagó?** Es el "rolling reserve" de Stripe: hold preventivo contra chargebacks. En cuentas nuevas el periodo es mayor (7-14 días), después se reduce a 2 días. No es problema bancario, es política Stripe.

**¿Wise USD es realmente "cuenta US" o es algo intermedio?** Es cuenta de Wise Inc. con routing number ACH propio. A efectos prácticos opera como cuenta US para recibir ACH y wires domésticos. Para Stripe payout cuenta como US bank account. Lo que NO da: tarjeta de crédito (solo debit) ni acceso a cheques físicos.

En Exentax montamos el stack bancario por casos de uso (US payments, EU clients, LATAM clients, FX optimization) - para que cobres en 24h-48h, no en 7-10 días por usar el corredor incorrecto.
<!-- /exentax:execution-v2 -->

## Hablemos de tu estructura

Cada caso tiene matices: tu país de residencia, el tipo de actividad, dónde están tus clientes, si haces inversión o trading, si vendes a particulares o a empresas. En Exentax revisamos tu situación, diseñamos la estructura LLC que encaja contigo y te acompañamos cada año en el mantenimiento. Reserva una consulta con nuestro equipo y empezamos por entender tus números reales.

¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:+34614916910">+34 614 916 910</a> o escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22tiempos%20pagos%20ach%20wire%20transfer%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si prefieres hablarlo en directo, <a href="/es/agendar">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisión editorial pendiente</strong> — Las siguientes referencias requieren verificación manual contra la fuente oficial vigente. Si encuentras una desviación, escríbenos y la corregimos en menos de 24 horas.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">5%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…| Pagos internacionales grandes | | Wise | 1-2 días | 0.4-1.5% | Pagos internacionales fre…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">1%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…envío + comisión bancos intermediarios + spread de cambio (~1%-3%). Llega en 1-5 días hábi…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">3%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…ío + comisión bancos intermediarios + spread de cambio (~1%-3%). Llega en 1-5 días hábiles…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">4%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…FX), draw a personal vía Wise USD → IBAN EUR (3-5 días, ~0.4% spread). Esto minimiza coste…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">IRC §1471</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…eneficial Ownership Information Report). - **FATCA y CRS.** IRC §1471-1474 (FATCA y formul…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
