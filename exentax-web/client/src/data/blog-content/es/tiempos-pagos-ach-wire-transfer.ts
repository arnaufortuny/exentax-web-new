export default `Una de las preguntas más frecuentes cuando empiezas a operar tu LLC es: "Le mandé dinero a un cliente, ¿cuándo llega?" O al revés: "Me van a pagar, ¿cuándo lo veo en mi cuenta?"

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

En Exentax te ayudamos a configurar el flujo de pagos óptimo para tu negocio: Mercury como hub central, <a href="/es/blog/wise-business-llc-guia">Wise como herramienta de conversión</a> (es una EMI con tipo de cambio real), y Relay (Thread Bank) como respaldo. Todo integrado y sin sorpresas.`;
