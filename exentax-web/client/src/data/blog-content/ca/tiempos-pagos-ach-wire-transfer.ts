export default `Una de les preguntes més freqüents quan comences a operar la teva LLC és: "Li he enviat diners a un client, quan arriba?" O a l'inrevés: "Em van a pagar, quan ho veig al meu compte?"

Posem tots els temps sobre la taula perquè no hi hagi sorpreses.

## ACH (Automated Clearing House)

ACH és el sistema de transferències domèstiques dels EUA. És el mètode més comú i el més barat (generalment gratis).

### Temps d'ACH

| Tipus | Temps |
|---|---|
| ACH Standard | **1-3 dies hàbils** |
| ACH Same-Day | **Mateix dia** (si s'inicia abans de les 2:45pm ET) |
| ACH Next-Day | **Següent dia hàbil** |

**Important:** Els dies hàbils són de dilluns a divendres (sense festius federals dels EUA). Si envies un ACH el divendres a la tarda, no arribarà fins al dilluns o dimarts.

### Factors que afecten el temps

- **Hora d'enviament**: si l'envies després de l'horari de tall (cut-off time), es processa al següent dia hàbil
- **Banc receptor**: alguns bancs retenen els fons ACH 1-2 dies addicionals per verificació
- **Primera transferència**: la primera vegada que envies diners a un nou compte pot trigar més per verificació de seguretat

## Wire Transfer domèstic

Els wires domèstics (dins dels EUA) són més ràpids que ACH, però tenen cost.

### Temps de Wire domèstic

| Tipus | Temps |
|---|---|
| Wire domèstic standard | **Mateix dia** (2-6 hores) |
| Wire domèstic urgent | **1-2 hores** |

Els wires domèstics solen arribar en **hores**, no en dies. Per això es fan servir per a pagaments urgents o imports grans.

## Wire Transfer internacional (SWIFT)

Els wires internacionals utilitzen la xarxa SWIFT i passen per bancs intermediaris, la qual cosa els fa més lents.

### Temps de Wire internacional

| Ruta | Temps |
|---|---|
| EUA → Europa | **1-3 dies hàbils** |
| EUA → Llatinoamèrica | **2-5 dies hàbils** |
| EUA → Àsia | **2-4 dies hàbils** |

### Per què triguen més?

- **Bancs intermediaris**: els diners poden passar per 1-3 bancs intermediaris abans d'arribar a la destinació
- **Zones horàries**: si el banc receptor ja ha tancat, la transferència es processa al següent dia hàbil
- **Compliance checks**: les transferències internacionals passen per controls antifrau i antiblanqueig

## Wise Business

Wise no utilitza la xarxa SWIFT per a la majoria de transferències. Utilitza comptes locals a cada país, la qual cosa redueix temps i costos.

### Temps a Wise

| Ruta | Temps |
|---|---|
| USD → EUR (SEPA) | **1-2 dies hàbils** |
| USD → GBP | **1 dia hàbil** |
| USD → MXN | **1-2 dies hàbils** |
| USD → COP | **1-3 dies hàbils** |

## Comparativa general

| Mètode | Temps | Cost (Mercury) | Millor per a |
|---|---|---|---|
| ACH | 1-3 dies | Gratis | Pagaments domèstics no urgents |
| Wire domèstic | Mateix dia | **$0 a Mercury** | Pagaments urgents dins dels EUA |
| Wire internacional | 1-5 dies | **$0 a Mercury** | Pagaments internacionals grans |
| Wise | 1-2 dies | 0.4-1.5% | Pagaments internacionals freqüents |
| Stripe/PayPal payout | 2-3 dies | Inclòs | Cobraments a clients |

## Consells per accelerar els teus pagaments

- **Inicia les transferències aviat**: abans de les 2pm hora de l'est dels EUA. Després del cut-off, es processa al següent dia hàbil
- **Evita divendres i festius**: les transferències no es processen en caps de setmana. Un ACH iniciat el divendres arriba el dimarts com a molt aviat
- **Fes servir ACH Same-Day** quan necessitis velocitat sense cost de wire. està disponible a Mercury sense cost addicional
- **Consolida enviaments internacionals**: un wire gran surt més barat que diversos petits. I amb Mercury, els wires són $0 de totes maneres
- **Fes servir Wise per a pagaments recurrents**: més ràpid i barat que wires tradicionals per a imports mitjans, gràcies a la seva xarxa de comptes locals

## La dada que ho canvia tot: Mercury $0 wire fees

La majoria de bancs cobren entre $15-50 per wire transfer. Mercury no cobra res. Zero. Ni nacionals ni internacionals. Això canvia completament com planifiques els teus pagaments:

- Necessites pagar un proveïdor a Europa? Wire internacional des de Mercury: $0
- Un client americà vol pagar-te per wire? El reps gratis
- Wise et demana enviar fons per wire per a verificació? $0

Mercury fa servir Column NA com a banc custodi, amb assegurança FDIC. No és una fintech experimental. és infraestructura financera seriosa per a la teva LLC.

A Exentax t'ajudem a configurar el flux de pagaments òptim per al teu negoci: Mercury com a hub central, Wise com a eina de conversió (és una EMI amb tipus de canvi real), i Relay (Thread Bank) com a reserva. Tot integrat i sense sorpreses. Agenda la teva assessoria gratuïta.`;
