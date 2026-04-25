export default `

Cuando hablamos de Wise, IBAN extranjeros y LLC en EE.UU. circulan dos extremos igual de equivocados: por un lado, el discurso de "Wise no reporta nada y Hacienda no se entera", y por otro, el miedo a que cualquier movimiento se esté enviando en directo a la Agencia Tributaria. La realidad está bastante más matizada y vale la pena entenderla antes de montar tu estructura, sobre todo si combinas una <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americana</a> con una cuenta Wise y tarjetas asociadas.

Este artículo se centra en lo que ocurre realmente: qué tipo de información sale de Wise hacia tu hacienda, qué no sale, y dónde está la frontera entre uso legítimo y problema fiscal. Si quieres el análisis técnico exhaustivo del flujo CRS de Wise Business desde Bélgica, lo desarrollamos en <a href="/es/blog/wise-business-crs-reporting-fiscal">Wise Business y CRS: lo que se reporta a tu hacienda</a>.

## Cómo funciona Wise por debajo

Wise no es un banco tradicional, ni una pasarela opaca, ni una cuenta offshore. Es un grupo de entidades reguladas que opera en jurisdicciones distintas:

- **Wise Europe SA**, con sede en Bélgica, autorizada como Electronic Money Institution por el National Bank of Belgium. Es la entidad que da servicio a la mayoría de clientes europeos y a muchas LLC con representación europea.
- **Wise Payments Limited**, en Reino Unido, regulada por la FCA. Sigue operando para clientes UK y algunos legacy.
- **Wise US Inc.**, regulada en EE.UU. como Money Services Business. Es la que opera para clientes con residencia y entidad americana.
- Filiales en Singapur, Australia, India y otras jurisdicciones con sus propios reguladores locales.

Cuando abres una cuenta Wise (personal o Business) recibes "detalles bancarios locales" en varias divisas: un **IBAN belga (BE) emitido por Wise Europe SA** para EUR (en clientes europeos antiguos pueden quedar IBAN lituanos heredados; para una **LLC estadounidense abierta hoy a través de Wise Business**, el IBAN EUR proviene siempre de la entidad belga, no de Lituania), un **sort code y account number en GBP**, un **routing number y account number en USD**, y direcciones equivalentes en AUD, NZD, SGD, etc. Esos IBAN no convierten a Wise en un banco belga o lituano cualquiera: son cuentas de cliente segregadas dentro del esquema EMI europeo.

Lo importante para fiscalidad: aunque tú veas un IBAN belga o lituano, **la entidad que custodia tu dinero y reporta sobre tu cuenta es Wise Europe SA (Bélgica)** en la inmensa mayoría de casos europeos. Esa es la entidad que activa los flujos de CRS.
## Qué es CRS y cuándo aplica

El **Common Reporting Standard (CRS)** es el estándar de la OCDE que obliga a las entidades financieras de más de 100 jurisdicciones a identificar a sus clientes no residentes y a reportar anualmente sus saldos y rendimientos a las autoridades fiscales locales, que a su vez los intercambian con la hacienda del país de residencia del titular. En la UE se transpuso a través de la **Directiva 2011/16/UE (DAC2)** y, en Bélgica, mediante la ley de 16 de diciembre de 2015 sobre intercambio automático de información financiera.

Lo relevante para Wise:

- **Wise Europe SA (Bélgica)** está plenamente sujeta a CRS. Reporta al Service Public Fédéral Finances belga, que reenvía a la hacienda del país de residencia del titular.
- **Wise Payments Limited (UK)** también está sujeta a CRS, aunque el flujo formal pasa por HMRC.
- **Wise US Inc.** no está sujeta a CRS, porque EE.UU. no se ha adherido al estándar (usa su propio sistema, FATCA; que es asimétrico y solo aplica a US persons).

Es decir: si tu cuenta Wise está bajo Wise Europe SA, asume que el saldo a 31 de diciembre y la información del titular llegan a tu hacienda nacional. Si estás bajo Wise US Inc. no se reporta vía CRS, pero esa cuenta solo es accesible para residentes y entidades estadounidenses, no para una LLC operada desde Europa.
## Qué reporta realmente Wise

El bloque de información que viaja por CRS es muy concreto y no incluye, contra lo que se suele temer, "todos tus movimientos en directo":

| Bloque | Qué incluye |
| --- | --- |
| Titular persona física | Nombre, dirección, residencia fiscal declarada, número de identificación fiscal (TIN), fecha y lugar de nacimiento |
| Titular entidad | Razón social, dirección, EIN/NIF de la LLC, clasificación CRS (Active NFE, Passive NFE, Investment Entity) |
| Beneficiarios efectivos | Si la entidad se clasifica como Passive NFE, los datos de los controlling persons (umbral del 25% directo o indirecto, o control efectivo) |
| Cuenta | IBAN(s) en cada divisa, número interno de la cuenta Wise |
| Saldo | Saldo agregado a 31 de diciembre, expresado normalmente en EUR convertido al cierre |
| Rendimientos | Intereses si los hay (Wise Interest), dividendos brutos e ingresos brutos por reembolso en productos como Wise Assets |

Lo que **no** se reporta por CRS:

- El detalle de cada movimiento operativo del año.
- El nombre y datos de tus clientes.
- Tus facturas, tus contratos o tus márgenes.
- Las compras concretas hechas con la tarjeta Wise.

Eso no significa que esa información sea invisible: si tu hacienda inicia un procedimiento, puede pedírtela directamente a ti, e incluso, en investigaciones avanzadas, solicitar información puntual a Wise por canales de cooperación fiscal. Lo que sí significa es que el flujo automático anual no es un volcado total: es saldo + rendimientos + identidad.
## Tarjetas Visa y Mastercard: la matización importante

Existe una idea muy extendida de que "como las tarjetas son de Visa o Mastercard, las redes ya envían todo a Hacienda". Conviene matizarlo:

- Visa y Mastercard son **redes de procesamiento de pagos**, no entidades financieras que mantengan tu cuenta. Su función es liquidar transacciones entre el banco emisor y el banco adquirente del comercio.
- **Visa y Mastercard no reportan tus consumos directamente a la Agencia Tributaria** ni a ninguna otra hacienda nacional como flujo automático periódico. No es su rol.
- Quien sí está sujeto a obligaciones de información es **el emisor de la tarjeta** (Wise Europe SA, en este caso) y el **comercio adquirente** dentro de su propia contabilidad.
- En España, las **entidades financieras españolas** sí reportan a la AEAT determinados consumos y saldos de tarjetas vinculadas a residentes (declaraciones informativas tipo 196, 171, etc.), pero ese marco no aplica con la misma intensidad a un emisor extranjero.

Si quieres el mapa completo de quién reporta qué de tu gasto con tarjeta país por país (Modelo 196, 171, DAS2, Modelo 38), lo desarrollamos en <a href="/es/blog/visa-mastercard-reporting-tarjetas-hacienda">Visa y Mastercard: qué ven realmente las haciendas de tu gasto con tarjeta</a>.

La conclusión razonable: usar la tarjeta Wise para gastos personales de un residente fiscal en España no genera un reporte automático en tiempo real de cada transacción a Hacienda. Lo que sí genera, junto al resto de la cuenta, es el reporte CRS anual del saldo y los rendimientos. Y, sobre todo, deja un rastro perfectamente trazable si en algún momento Hacienda pide explicaciones sobre el origen de los fondos.
## El caso típico: LLC no residente con Wise Business

Este es el escenario donde más mitos circulan. Un emprendedor con residencia fiscal en España (o en LATAM) constituye una <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC en Estados Unidos</a>, abre Mercury como cuenta principal y Wise Business como cuenta secundaria multidivisa. Cuando completa la autodeclaración CRS de Wise para la LLC tiene que indicar:

- Residencia fiscal de la LLC: EE.UU.
- Clasificación CRS: la mayoría de Single-Member LLC de servicios cumplen los requisitos de **Active NFE** (más del 50% de los ingresos son operativos), pero Wise tiende a aplicar criterios conservadores y, ante documentación dudosa, clasifica como **Passive NFE**.
- Controlling persons: los datos del beneficiario efectivo, incluyendo su residencia fiscal (la tuya, en España o en el país que sea).

La consecuencia práctica: aunque la LLC sea estadounidense y EE.UU. no esté en CRS, el **dato de tu titularidad como controlling person, con tu residencia fiscal real, llega a tu hacienda desde Bélgica**. Esa es la pieza que muchos pasan por alto.

Esto no convierte a la LLC en algo "ilegal": una LLC bien estructurada y declarada es una herramienta perfectamente legítima. Lo que invalida es la idea de que poniendo Wise Business a nombre de la LLC se evita el flujo de información hacia tu país de residencia.
## Qué puede ver Hacienda en España (y qué no)

Trasladado a la práctica de un residente fiscal en España con LLC + Wise:

Lo que la AEAT puede ver de forma automática y recurrente:

- Que existe una cuenta Wise asociada a la LLC y a ti como controlling person.
- El saldo a 31 de diciembre de cada año.
- Los rendimientos brutos generados (Wise Interest, Wise Assets, etc.).
- Tu nombre, NIF y dirección como beneficiario efectivo.

Lo que la AEAT no recibe automáticamente:

- Cada uno de los movimientos del año.
- El detalle de tus clientes y facturas.
- Las transacciones concretas con la tarjeta.
- El P&L interno de la LLC.

Lo que pasa al cruzar esa información con tu IRPF y con tus declaraciones informativas:

- Si tu <a href="/es/blog/modelo-720-721-residentes-espana-cuentas-cripto-extranjero">Modelo 720</a> (declaración de bienes en el extranjero, umbral agregado de 50.000 €) y, en su caso, Modelo 721 (criptos), no recogen la cuenta Wise cuando deberían, hay un desfase evidente.
- Si tu IRPF no incluye los rendimientos atribuibles a la LLC (en el escenario en el que España la trata como entidad transparente, según la doctrina administrativa que analizamos en <a href="/es/blog/crs-residentes-espana-latam-implicaciones">CRS para residentes en España y LATAM</a>), salta otra incoherencia.
- Si los saldos no encajan con los ingresos declarados, Hacienda tiene una palanca natural para abrir comprobaciones.

El problema no suele ser el reporting en sí, sino la **incoherencia documental** entre lo que se declara en España, lo que sale por CRS desde Bélgica y lo que aparece en la operativa real.
## Errores comunes que vemos cada semana

1. **"Wise no reporta nada."** Falso. Wise Europe SA reporta por CRS desde Bélgica.
2. **"Si la cuenta está a nombre de la LLC, no me reportan a mí."** Falso para Passive NFE: se reportan los controlling persons. Y la mayoría de Single-Member LLC se clasifican así.
3. **"Como mi saldo medio es bajo, no entro en CRS."** El saldo reportado es el de cierre, sin importar la fluctuación durante el año, y no hay umbral mínimo en cuentas nuevas.
4. **"Tengo Wise USD bajo Wise US Inc. no se reporta."** Cierto a efectos CRS, pero esa configuración solo es coherente para residentes y entidades realmente americanas; usarla desde Europa para una LLC operada por un residente español es jugársela en otro frente (residencia, gestión efectiva, due diligence del propio Wise).
5. **"Pago todo con la tarjeta Wise, así no queda rastro."** Queda rastro: en Wise, en el comercio y en el saldo de cierre que sí se reporta. Y deja una huella perfectamente reconstruible si te abren un procedimiento.
6. **"La LLC me protege automáticamente del 720."** No: si eres residente fiscal en España y eres beneficiario efectivo de cuentas en el extranjero, te aplica la obligación cuando se superan los umbrales agregados.
## Por qué esto importa para tu estructura

La conclusión razonable no es "Wise es malo" ni "la LLC es peligrosa". La conclusión es que **tu estructura solo funciona si las piezas son coherentes entre sí**: tu residencia fiscal, la entidad que opera tu cuenta, la clasificación CRS de tu LLC, tus declaraciones informativas, tu IRPF y tus contratos con clientes. Cuando alguna de esas piezas no encaja, los problemas no aparecen el día que mueves el dinero, aparecen tres o cuatro años después en forma de requerimiento.

En Exentax trabajamos exactamente en esa frontera: estructurar la <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americana</a>, elegir <a href="/es/blog/bancos-vs-fintech-llc-donde-abrir-cuenta">qué cuenta bancaria o fintech</a> tiene sentido como principal y cuál como secundaria, anticipar qué se reporta vía <a href="/es/blog/crs-residentes-espana-latam-implicaciones">CRS</a> hacia tu hacienda, y diseñar el conjunto para que la pieza Wise (o <a href="/es/blog/revolut-business-crs-reporting-fiscal">Revolut Business</a>, o cualquier otra) encaje sin sorpresas. Lo desarrollamos en detalle en <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">Diseño de una estructura fiscal internacional sólida</a>.

Si no tienes claro cómo encaja Wise en tu estructura o si estás expuesto a un cruce que no controlas, lo revisamos contigo y te decimos qué arreglar antes de que sea Hacienda quien marque el ritmo.
### En resumen

Wise es una excelente fintech multidivisa, plenamente regulada y plenamente conectada al intercambio automático de información cuando opera bajo Wise Europe SA. No es un atajo para esconder dinero, pero tampoco es una cámara que graba cada movimiento y lo manda en directo a Hacienda. Lo que viaja por CRS es saldo, rendimientos e identidad del titular y del beneficiario efectivo. Lo que no viaja por defecto es el detalle operativo, aunque queda perfectamente disponible si Hacienda lo pide.
La diferencia entre tener problemas o no tenerlos no está en usar Wise, sino en cómo encaja Wise dentro de una estructura coherente con tu LLC, tu residencia y tus declaraciones. Esa es la conversación que merece la pena tener antes, no después.
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

<!-- exentax:legal-refs-v1 -->
## Referencias legales y normativas

Este artículo se apoya en normativa vigentes actualmente. Citamos las fuentes principales para que puedas verificarlo:

- **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report ante FinCEN).
- **España.** Ley 35/2006 (LIRPF), arts. 8, 9 (residencia), 87 (atribución de rentas), 91 (transparencia fiscal internacional para personas físicas); Ley 27/2014 (LIS), art. 100 (transparencia fiscal internacional para sociedades); Ley 58/2003 (LGT), arts. 15 (conflicto en aplicación de la norma) y 16 (simulación); Ley 5/2022 (régimen sancionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 720); Orden HFP/887/2023 (Modelo 721 cripto).
- **Convenio España–EE. UU.** BOE de 22/12/1990 (CDI original); Protocolo en vigor desde 27/11/2019 (renta pasiva, *limitation on benefits*).
- **UE / OCDE.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetrías híbridas); Estándar Común de Reporte (CRS) de la OCDE.
- **Marco internacional.** Modelo de Convenio OCDE, art. 5 (establecimiento permanente) y comentarios; Acción 5 BEPS (sustancia económica); FATF Recommendation 24 (titularidad real).

La aplicación concreta de cualquiera de estas normas a tu caso depende de tu residencia fiscal, la actividad de la LLC y la documentación que mantengas. Este contenido es informativo y no sustituye al asesoramiento profesional personalizado.

<!-- exentax:execution-v2 -->
## El IBAN belga de Wise para tu LLC: qué es, qué reporta y por qué Hacienda lo ve

Cuando activas la sub-cuenta EUR de Wise Business para tu LLC, recibes un IBAN belga BE (Wise Europe SA tiene sede en Bruselas). Operativamente es excelente: recibes pagos SEPA de clientes UE como cualquier banco europeo. Fiscalmente, ese IBAN está bajo régimen CRS belga y, vía intercambio automático, llega a tu Hacienda. Conviene entender exactamente cómo se ve desde el otro lado para declararlo correctamente.

- **Naturaleza del IBAN belga BE de Wise.** Wise Europe SA es entidad de crédito autorizada por el Banco Nacional de Bélgica (NBB). El IBAN BE que te asigna a tu LLC es jurídicamente cuenta belga, no cuenta US, aunque la titular sea tu LLC US. A efectos de CRS, Bélgica reporta esta cuenta al país de residencia fiscal del UBO declarado en el KYC.
- **Datos que se transmiten anualmente.** Identificación de la LLC titular (nombre, EIN, dirección registrada), identificación del UBO (nombre, dirección, residencia fiscal declarada, identificador fiscal del país), saldo a 31 de diciembre del IBAN BE, total de movimientos brutos del año (suma de todas las entradas), y código de identificación de cuenta (IBAN BE completo). NO se transmiten transacciones individuales.
- **Cruce con tu declaración en residencia.** España: Modelo 720 obliga a declarar cuentas en el extranjero si suma >50.000€ a 31/12 o saldo medio del último trimestre. Tu IBAN BE de Wise cuenta como cuenta extranjera de la LLC y, por atribución (LLC disregarded), es de tu titularidad indirecta. Si Hacienda recibe via CRS que tienes 80k€ ahí y no presentaste 720, salta el procedimiento de imputación. Sanción típica: 50% del saldo no declarado.
- **Diferencia con la sub-cuenta USD de Wise.** La sub-cuenta USD de Wise (routing number ACH propio) es operada por Wise USD Inc. (US, FinCEN-registered) y reporta vía FATCA-IGA al país de residencia del UBO, no vía CRS. La latencia y el canal son diferentes pero el resultado fiscal es equivalente: tu Hacienda lo ve. La diferencia operativa: la cuenta EUR cobra SEPA local, la USD cobra ACH/wire US.

### Cómo declararlo correctamente en España

Modelo 720 (anual, hasta 31 marzo del año siguiente): identificación del IBAN BE, banco emisor (Wise Europe SA, Bruselas), saldo a 31/12 y saldo medio último trimestre. Modelo 100 (IRPF): si la LLC es disregarded, el resultado de la LLC se atribuye en el ejercicio (rendimiento de actividad económica si activa, rendimiento de capital mobiliario si pasiva). El IBAN en sí no genera renta, lo que genera renta es la actividad de la LLC.

### Lo que más nos preguntan

**¿Si pongo el IBAN BE a nombre de la LLC pero el UBO declarado al KYC es otro, llega a la Hacienda del UBO declarado?** Sí. CRS reporta a la residencia fiscal del UBO real, identificada en el KYC. Si declaraste una residencia que no es la real, es declaración falsa y Wise puede cerrar al detectar inconsistencia.

**¿Se puede tener Wise Business sin activar la sub-cuenta EUR para evitar el IBAN BE?** Técnicamente sí, dejando solo USD activa. Operativamente pierdes la ventaja principal de Wise (cobro SEPA de clientes UE en EUR sin coste FX). Y la cuenta USD reporta igual via FATCA, no es vía de opacidad.

En Exentax estructuramos Wise Business para LLC con cuentas activadas según necesidad operativa, declaramos correctamente en residencia (720, 3916, RW), y resolvemos cruces de Hacienda derivados de CRS - para que el IBAN BE sea ventaja operativa, no fuente de procedimiento.
<!-- /exentax:execution-v2 -->

## Te lo montamos sin que pierdas un fin de semana

Miles de freelancers y emprendedores ya operan con su LLC americana de forma 100% legal y documentada. En Exentax nos encargamos de todo el proceso: constitución, banca, pasarelas de pago, contabilidad, declaraciones IRS y compliance en tu país de residencia. Agenda una asesoría gratuita y te diremos con sinceridad si la LLC tiene sentido para tu caso, sin promesas absolutas.


¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:+34614916910">+34 614 916 910</a> o escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22wise%20iban%20llc%20que%20reporta%20hacienda%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si prefieres hablarlo en directo, <a href="/es/agendar">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisión editorial pendiente</strong> — Las siguientes referencias requieren verificación manual contra la fuente oficial vigente. Si encuentras una desviación, escríbenos y la corregimos en menos de 24 horas.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">25%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…ssive NFE, los datos de los controlling persons (umbral del 25% directo o indirecto, o con…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">50%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…servicios cumplen los requisitos de **Active NFE** (más del 50% de los ingresos son operat…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…(declaración de bienes en el extranjero, umbral agregado de 50.000 €) y, en su caso, Model…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…es para que puedas verificarlo: - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de en…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…P y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25%…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">100%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…ers y emprendedores ya operan con su LLC americana de forma 100% legal y documentada. En E…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">IRC §882</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…§301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre renta…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §871</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…r business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fisca…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…ones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-ow…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…cionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC2</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…n la UE se transpuso a través de la **Directiva 2011/16/UE (DAC2)** y, en Bélgica, mediant…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…*). - **UE / OCDE.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronteri…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514,…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…s), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiv…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
