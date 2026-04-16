export default `Cuando empiezas a mover dinero con tu LLC, te vas a encontrar con tres siglas que aparecen una y otra vez: **IBAN**, **SWIFT** (o BIC) y **Routing Number**. Son como la dirección postal de tu cuenta bancaria, pero para el dinero.

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

En Exentax te configuramos todos los canales de cobro desde el primer día. Te decimos exactamente qué datos dar a cada tipo de cliente para que el dinero llegue rápido y sin sorpresas.`;
