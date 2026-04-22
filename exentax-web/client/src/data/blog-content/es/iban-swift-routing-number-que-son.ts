export default `

Cuando empiezas a mover dinero con tu LLC, te vas a encontrar con tres siglas que aparecen una y otra vez: **IBAN**, **SWIFT** (o BIC) y **Routing Number**. Son como la dirección postal de tu cuenta bancaria, pero para el dinero.

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
### SWIFT / BIC Code

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
### Resumen rápido

| Código | Qué es | Dígitos | Se usa en | Para qué |
|---|---|---|---|---|
| Routing Number | ID del banco en EE.UU. | 9 | EE.UU. | ACH y Wires domésticos |
| SWIFT/BIC | ID del banco internacional | 8-11 | Mundial | Wires internacionales |
| IBAN | Nº de cuenta internacional | 15-34 | Europa, MENA, LatAm | Transferencias SEPA |
| Account Number | Nº de tu cuenta | 10-17 | EE.UU. | Identificar tu cuenta |
### ¿Qué datos dar a cada tipo de cliente?

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

Si te han quedado dudas sobre los matices de esta estructura, <a href="/es/blog/tiempos-pagos-ach-wire-transfer">¿Cuánto tardan los pagos ACH y Wire Transfer? Tiempos reales</a> y <a href="/es/blog/escalar-negocio-digital-llc-americana">Cómo escalar tu negocio digital con una LLC americana</a> explican en detalle varios aspectos colindantes que solemos dejar apuntados para otro día.
### Mercury: datos bancarios que necesitas

Para Mercury, los datos que darás a clientes son:

- **Routing Number ACH:** Para cobros ACH domésticos (pagos de clientes US, depósitos de Stripe/PayPal)
- **Routing Number Wire:** Para wires domésticos (ojo: es diferente al de ACH)
- **Account Number:** Tu número de cuenta
- **SWIFT Code:** Para wires internacionales entrantes
- **Dirección del banco:** Column NA, San Francisco, CA

Mercury tiene $0 en comisiones de wire, tanto nacionales como internacionales. Tus fondos están custodia en partner banks (Choice Financial Group / Evolve Bank & Trust; Column N.A. en cuentas heredadas) con seguro FDIC.

En Exentax te configuramos todos los canales de cobro desde el primer día. Te decimos exactamente qué datos dar a cada tipo de cliente para que el dinero llegue rápido y sin sorpresas.
## Stack bancario equilibrado: Mercury, Relay, Slash y Wise

No existe la cuenta perfecta para una LLC. Existe el **stack** correcto, donde cada herramienta cubre un rol:

- **Mercury** (operada como fintech con bancos asociados (Choice Financial Group y Evolve Bank & Trust principalmente; Column N.A. en cuentas heredadas), FDIC vía sweep network hasta el límite vigente). Cuenta principal operativa para no residentes con buena UX, ACH y wires. Sigue siendo una de las opciones más probadas para abrir desde fuera de EE. UU.
- **Relay** (respaldada por Thread Bank, FDIC). Excelente como **cuenta de respaldo** y para gestión "envelope budgeting": permite crear hasta 20 sub-cuentas y 50 tarjetas de débito, integración profunda con QuickBooks y Xero. Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare.
- **Slash** (respaldada por Column N.A. (banco federalmente registrado, con cobertura FDIC)). Banca diseñada para operadores online: emisión instantánea de tarjetas virtuales por proveedor, controles de gasto granulares, *cashback* en publicidad digital. Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS.
- **Wise Business** (EMI multi-divisa, no es banco). Para cobrar y pagar en EUR, GBP, USD y otras divisas con datos bancarios locales y conversión a *mid-market rate*. No sustituye una cuenta US real, pero es imbatible para tesorería internacional.
- **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen. Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC.

<!-- exentax:calc-cta-v1 -->
> **Pon números a tu caso.** La <a href="/es#calculadora">calculadora fiscal Exentax</a> compara tu carga fiscal actual con la que pagarías operando una LLC americana correctamente declarada en tu país de residencia.
<!-- /exentax:calc-cta-v1 -->

La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**. Es la configuración que minimiza riesgo de bloqueo y reduce coste real. En Exentax abrimos y configuramos este stack como parte de la constitución.
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
## IBAN, SWIFT y Routing Number: para qué sirve cada uno y por qué tu LLC los necesita bien

Confundir IBAN, SWIFT/BIC y ABA Routing Number cuesta pagos rechazados, transferencias devueltas y tres días de soporte hablando con el banco. Cada formato responde a un sistema distinto, y tu LLC americana usa los tres según el tipo de cobro. Vamos al grano.

- **Routing Number (ABA, 9 dígitos).** Es el identificador del banco en el sistema doméstico estadounidense. Lo usan ACH (transferencias internas US, baratas y rápidas) y wires domésticos. Mercury, Bluevine y cualquier cuenta US-only te dan un Routing Number. Si tu cliente paga desde EE.UU., siempre con Routing + número de cuenta.
- **SWIFT/BIC (8-11 caracteres).** Identificador internacional del banco para transferencias transfronterizas (cross-border wires). Lo necesitarás cuando un cliente europeo, latinoamericano o asiático te envía dinero desde su banco local. Mercury, Wise Business y prácticamente toda cuenta moderna te dan un SWIFT - pero el wire internacional cobra 15-30 USD y tarda 1-3 días.
- **IBAN (hasta 34 caracteres).** Es estándar europeo + 80 jurisdicciones. Las cuentas US tradicionales no tienen IBAN - sólo SWIFT. Wise Business sí emite IBAN europeos (Bélgica, Reino Unido, Hungría) para tu LLC, lo que reduce friction cuando facturas a UE: tu cliente francés paga al IBAN de Wise como si fuera SEPA local, sin coste de wire.
- **Mejores prácticas operativas.** Para cliente US: comparte Routing + número de cuenta (ACH). Para cliente UE B2B: comparte IBAN Wise Business. Para cliente fuera de EU/US: comparte SWIFT + número de cuenta. Mezclar formatos confunde al ordenante y rebota la transferencia.

### Lo que más nos preguntan

**¿Mi LLC puede tener IBAN español o francés?** No directamente: la LLC es entidad US, sin establecimiento permanente en UE. Pero Wise Business le da un IBAN europeo asignado (Bélgica), y eso es funcionalmente suficiente para SEPA y conversiones EUR.

**¿Por qué mi cliente europeo no consigue pagarme con tarjeta cuando le doy SWIFT?** Porque SWIFT es transferencia bancaria, no pago con tarjeta. Para tarjeta usa Stripe o pasarela equivalente. Para wire bancario, el cliente necesita SWIFT + número de cuenta + dirección del beneficiario y del banco.

En Exentax configuramos el stack bancario completo de tu LLC (Mercury principal, Wise Business secundaria con IBAN europeo, y pasarela de pago si aplica) para que cobres limpio en cada moneda y país.
<!-- /exentax:execution-v2 -->

## Hablemos de tu estructura

Cada caso tiene matices: tu país de residencia, el tipo de actividad, dónde están tus clientes, si haces inversión o trading, si vendes a particulares o a empresas. En Exentax revisamos tu situación, diseñamos la estructura LLC que encaja contigo y te acompañamos cada año en el mantenimiento. Reserva una consulta con nuestro equipo y empezamos por entender tus números reales.


¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:+34614916910">+34 614 916 910</a> o escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22iban%20swift%20routing%20number%20que%20son%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si prefieres hablarlo en directo, <a href="/es/agendar">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisión editorial pendiente</strong> — Las siguientes referencias requieren verificación manual contra la fuente oficial vigente. Si encuentras una desviación, escríbenos y la corregimos en menos de 24 horas.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">IRC §1471</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…eneficial Ownership Information Report). - **FATCA y CRS.** IRC §1471-1474 (FATCA y formul…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
