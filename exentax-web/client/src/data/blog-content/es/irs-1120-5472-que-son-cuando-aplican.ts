export default `

Hay dos formularios del IRS que generan más confusión que ningún otro entre dueños de LLC: el **Form 1120** y el **Form 5472**. La mayoría de personas con LLC los oye nombrar juntos, no entiende del todo qué es cada uno y, sobre todo, **no sabe cuándo aplican exactamente a su caso**.

Este artículo no es la enésima guía paso a paso. Si quieres el procedimiento de presentación, ya tienes la <a href="/es/blog/form-5472-que-es-como-presentarlo">guía operativa del Form 5472</a>. Aquí explicamos qué son los dos formularios **en realidad**, cómo se relacionan, cuándo aplican según tu perfil y qué errores cuestan dinero.

## Qué es realmente el Form 1120

El **Form 1120, U.S. Corporation Income Tax Return** es la declaración del impuesto federal sobre sociedades para corporaciones americanas. En su uso "normal", lo presenta una **C-Corporation** (Inc. clásica) para liquidar su impuesto sobre beneficios (21 % federal actualmente, más impuestos estatales).

Aquí viene el primer matiz que casi nadie te explica: el Form 1120 también se usa **vacío, como envoltorio**, para que ciertas LLCs cumplan obligaciones de información. Es lo que se llama **pro-forma 1120** y lo veremos más abajo.

Resumen útil:
- **C-Corporation operativa** → Form 1120 con cifras reales (ingresos, gastos, impuesto debido).
- **Single-Member LLC de no residente** → Form 1120 **pro-forma** (mayoría de campos en blanco) más Form 5472 anexado.
- **Single-Member LLC de residente americano** → en general, no presenta 1120; los ingresos se reportan en su declaración personal (Schedule C en el 1040).
- **Multi-Member LLC** → tampoco usa el 1120 por defecto; presenta Form 1065 (partnership), salvo elección de tributación como corporación.
## Qué es realmente el Form 5472

El **Form 5472, Information Return of a 25% Foreign-Owned U.S. Corporation or a Foreign Corporation Engaged in a U.S. Trade or Business** es un **formulario informativo, no recaudatorio**. No paga ningún impuesto. Su misión es informar al IRS de las **transacciones entre la entidad americana y partes relacionadas extranjeras**.

Para la fotografía de la mayoría de nuestros clientes en Exentax, esa "entidad americana" es una **Single-Member LLC** propiedad de un no residente, y la "parte relacionada extranjera" es **el propio dueño**. Las "transacciones" son cualquier movimiento de dinero entre tú y la LLC: aportaciones iniciales, transferencias de la LLC a tu cuenta personal, pagos puntuales, préstamos.

¿Por qué importa? Porque desde 2017 las **disregarded entities propiedad de extranjeros** están tratadas como corporaciones a efectos del 5472. Esto significa que aunque tu LLC no pague impuesto federal, **sí está obligada a reportar quién la posee y cómo ha movido dinero contigo**. Si no lo presentas, la sanción base es de **25 000 USD por formulario y año**. Lo cerramos contigo desde Exentax: una llamada, presentación y archivo, y el riesgo se queda en el papel.
### La trampa del "1120 pro-forma"

Aquí es donde la gente se pierde. Tu Single-Member LLC de no residente:

1. **No paga impuesto sobre sociedades en EE.UU.** sobre rentas sin conexión efectiva con el país.
2. Pero **sí tiene que presentar un Form 1120 al año, en blanco**, para que ese 1120 funcione como sobre del Form 5472.

Esto se llama **Form 1120 pro-forma**. Solo se rellenan los datos identificativos arriba ("Foreign-owned U.S. DE"), se escribe a mano "Form 1120, Foreign-owned U.S. DE" en la parte superior y se anexa el Form 5472. El resto del 1120 va vacío (sin Schedule M, sin balance, sin liquidación de impuesto).

Si recibiste tu LLC de un proveedor que te dijo "no tienes que presentar nada porque no pagas impuestos", **ese proveedor está confundiendo "no pagar" con "no informar"**. Son cosas distintas.
## ¿Cuándo aplican exactamente? Tabla por perfil

| Perfil | ¿Form 1120? | ¿Form 5472? | Comentario |
|---|---|---|---|
| Single-Member LLC, dueño no residente, sin movimientos con la LLC | Sí, pro-forma | No (sin reportable transactions) | Caso muy raro: ya solo abrir el banco genera movimiento |
| Single-Member LLC, dueño no residente, con movimientos | **Sí, pro-forma** | **Sí** | El caso típico de Exentax |
| Single-Member LLC, dueño residente fiscal en EE.UU. | No | No | Tributa en Schedule C del 1040 |
| Multi-Member LLC, todos no residentes | No (presenta 1065) | Sí, anexado al 1065 | Partnership por defecto |
| LLC con elección a C-Corp (Form 8832) | **Sí, real** (con cifras) | Sí, si hay foreign related party | Ya tributa al 21 % federal |
| C-Corp americana propiedad de no residente | Sí, real | Sí, si hay foreign related party | Estructura distinta a la LLC típica |

Casi todos los clientes que llegan a Exentax con LLC americana caen en la fila 2: **pro-forma 1120 + 5472 anuales**.
## "Reportable transactions": qué cuenta y qué no

El Form 5472 pide reportar las **reportable transactions** entre la LLC y la parte relacionada extranjera. La definición práctica para tu caso:

- Aportaciones de capital iniciales o posteriores → se reportan.
- Distribuciones o "draws" desde la LLC hacia tu cuenta personal → se reportan.
- Pagos de la LLC a empresas o personas relacionadas en el extranjero → se reportan. Si esos pagos pasan por Wise, vale la pena revisar <a href="/es/blog/wise-iban-llc-que-reporta-hacienda">qué IBAN concreto se reporta a Hacienda y desde qué jurisdicción</a>.
- Préstamos entre tú y la LLC → se reportan.
- Pagos por servicios prestados por ti (si los facturas como persona física desde otro país a la LLC) → se reportan.

No se reportan, en cambio, los pagos a proveedores **no relacionados** (un freelance externo, un SaaS, un banco). El criterio es **relación**, no nacionalidad.

En la mayoría de inicios, una sola aportación inicial (la transferencia que hiciste para fondear la LLC) ya activa la obligación. A partir de ahí, ya estás dentro del régimen.
### Plazos, prórrogas y dónde se envía

- **Fecha límite estándar:** 15 de abril de cada año, para el ejercicio anterior cerrado a 31 de diciembre.
- **Prórroga:** seis meses con Form 7004, lo que mueve el plazo al 15 de octubre.
- **Forma de presentación:** la LLC con dueño no residente y sin obligación de presentación electrónica suele enviarlo por **correo certificado al IRS Service Center de Ogden, Utah** o por **fax** al número específico publicado por el IRS para foreign-owned DEs. Confirmar siempre la dirección/fax vigente del año en cuestión.
- **EIN obligatorio:** sin EIN no se puede presentar. Si todavía no lo tienes, hay que sacarlo antes (Form SS-4).

Los retrasos no son baratos. La sanción de 25 000 USD por 5472 no presentado **se aplica también por información incompleta o inexacta**, no solo por no presentar nada en absoluto. Aquí entra Exentax: te presentamos el formulario, archivamos el acuse y, si la administración pregunta, ya tienes la respuesta lista.
## Errores típicos al preparar 1120 + 5472

1. **Rellenar el 1120 pro-forma como si fuera un 1120 real.** Pones cifras, balances, gastos. El IRS lo procesa como una declaración de C-Corp y se monta un lío.
2. **Olvidar que el 5472 va anexado al 1120**, no se manda solo. Si lo envías suelto, no se considera presentado.
3. **No tener un Operating Agreement claro** y reportar transacciones sin documentación de respaldo. Cuando el IRS pide aclaraciones, no hay nada que enseñar.
4. **Mezclar la cuenta personal con la de la LLC** y luego intentar reconstruir las "reportable transactions" a final de año. Sale caro y mal.
5. **Confiar en "no me ha llegado nada del IRS, todo bien".** El IRS no avisa antes de sancionar. Las multas se imponen y se descubren cuando se actúa contra el EIN o se rechaza una próxima presentación. Es el momento de pedir ayuda. En Exentax abrimos el caso, presentamos lo pendiente y respondemos por ti al organismo correspondiente.
6. **Presentar el 5472 sin el TIN/EIN del dueño extranjero.** Aunque seas no residente, el formulario pide identificación. Sin ella, está incompleto.
### Quién NO está obligado (los pocos casos)

Casos en los que **no necesitas** presentar 1120 + 5472:

- Tu LLC tiene varios miembros, está clasificada como **partnership** y no hay foreign related parties con transacciones reportables (escenario poco común si tú eres extranjero).
- Eres residente fiscal en EE.UU. y tu Single-Member LLC reporta directamente en Schedule C de tu 1040 personal. Aquí no hay "foreign-owned DE".
- Tu LLC ha elegido tributar como **C-Corp** y ya presenta 1120 real, sin transacciones con partes relacionadas extranjeras (raro si tu negocio internacional pasa por la LLC).

Fuera de esos casos, asumir que estás exento es una apuesta que no compensa: el coste de preparar bien estos formularios es **mucho menor** que la sanción mínima. Respira: en Exentax esto es rutina, te ponemos al día y la próxima revisión se cierra en una sola vuelta.
### Cómo encaja todo esto en tu día a día

Si llevas correctamente la operativa de la LLC durante el año (cuenta separada, registro de aportaciones y retiros, Operating Agreement firmado, contabilidad mínima), preparar el 1120 pro-forma + 5472 a cierre de año es un trámite tranquilo. Si llegas a 31 de diciembre con la cuenta de la LLC mezclada con la personal, sin documentación y sin saber qué movimientos son reportables, el coste y el riesgo se disparan.

Por eso en Exentax tratamos estos formularios como el **subproducto natural** de una buena gestión anual, no como un drama de marzo. La diferencia entre las dos cosas es seguir el <a href="/es/blog/mantenimiento-anual-llc-obligaciones">calendario anual de obligaciones</a> y mantener separación efectiva entre tu patrimonio y el de la LLC.
### Lo que deberías llevarte

- **Form 1120** = declaración de impuesto sobre sociedades. En tu LLC de no residente se usa **vacío, como sobre** del Form 5472.
- **Form 5472** = declaración informativa de transacciones entre la LLC y tú (o cualquier parte relacionada extranjera).
- **Aplican casi siempre** si eres no residente con Single-Member LLC y has movido dinero entre tú y la LLC.
- **No se paga impuesto** con estos formularios, pero **no presentarlos cuesta 25 000 USD por año**.
- El error más caro es rellenarlos mal o llegar al cierre sin la documentación que respalda lo que se reporta.

Si tienes dudas sobre si tu caso está bien planteado, sobre los ejercicios pasados o sobre cómo regularizar formularios atrasados, **lo revisamos contigo** en una asesoría gratuita de 30 minutos. Es mejor entenderlo bien una vez que pagar sanciones evitables cada año. Aquí entra Exentax: te presentamos el formulario, archivamos el acuse y, si la administración pregunta, ya tienes la respuesta lista.
## Referencias legales y normativas

Este artículo se apoya en normativa vigentes actualmente. Citamos las fuentes principales para que puedas verificarlo:

- **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report ante FinCEN).
- **España.** Ley 35/2006 (LIRPF), arts. 8, 9 (residencia), 87 (atribución de rentas), 91 (transparencia fiscal internacional para personas físicas); Ley 27/2014 (LIS), art. 100 (transparencia fiscal internacional para sociedades); Ley 58/2003 (LGT), arts. 15 (conflicto en aplicación de la norma) y 16 (simulación); Ley 5/2022 (régimen sancionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 720); Orden HFP/887/2023 (Modelo 721 cripto).
- **Convenio España–EE. UU.** BOE de 22/12/1990 (CDI original); Protocolo en vigor desde 27/11/2019 (renta pasiva, *limitation on benefits*).
- **UE / OCDE.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetrías híbridas); Estándar Común de Reporte (CRS) de la OCDE.
- **Marco internacional.** Modelo de Convenio OCDE, art. 5 (establecimiento permanente) y comentarios; Acción 5 BEPS (sustancia económica); FATF Recommendation 24 (titularidad real).
La aplicación concreta de cualquiera de estas normas a tu caso depende de tu residencia fiscal, la actividad de la LLC y la documentación que mantengas. Este contenido es informativo y no sustituye al asesoramiento profesional personalizado.
### Próximos pasos

Ahora que tienes el contexto completo, el siguiente paso natural es contrastarlo con tu propia situación: qué encaja, qué no, y dónde están los matices que dependen de tu residencia, tu actividad y tu volumen. Una revisión rápida de tu caso suele ahorrar mucho ruido antes de tomar cualquier decisión estructural.

<!-- exentax:banking-facts-v1 -->
## Hechos bancarios y fiscales que conviene precisar

La información sobre fintech y CRS evoluciona y queremos que la tengas tal cual está hoy:

Antes de seguir, pon números a tu caso: la <a href="/es#calculadora">calculadora Exentax</a> compara, en menos de 2 minutos, tu carga fiscal actual con la que tendrías operando una LLC declarada en tu país de residencia.

<!-- exentax:calc-cta-v1 -->
> <a href="/es/agendar">Habla con nuestro equipo</a>
<!-- /exentax:calc-cta-v1 -->

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
- **EIN y notificaciones.** Sin EIN no se puede presentar 5472 ni BOI. El IRS no avisa antes de sancionar; las multas se descubren al actuar contra el EIN o al rechazar una próxima presentación. Respira: en Exentax esto es rutina, te ponemos al día y la próxima revisión se cierra en una sola vuelta.

<!-- exentax:execution-v2 -->
## Form 1120 y Form 5472: qué son y cuándo los presenta una LLC de no residente

La combinación 1120 + 5472 es la obligación informativa central de cualquier single-member LLC propiedad de no residente que tenga "reportable transactions" con su socio extranjero. No genera impuesto, pero su omisión activa una multa de 25.000 USD por año y entidad. Aquí lo esencial.

- **Form 1120 (pro-forma).** No es la 1120 corporativa típica: es una versión simplificada usada por la LLC disregarded como "vehículo" para acompañar el 5472. Sólo se rellenan datos identificativos (EIN, dirección, año fiscal). Sin cálculo de impuesto. Plazo: 15 de abril (o 15 de octubre con extensión 7004).
- **Form 5472.** El formulario informativo real. Reporta cualquier "reportable transaction" entre la LLC y su socio extranjero (25%+ ownership): aportaciones de capital, distribuciones, préstamos intercompañía, pagos por servicios prestados o recibidos, ventas de bienes. La cifra reportada no genera impuesto pero permite al IRS rastrear flujos transfronterizos.
- **Cuándo aplica.** Single-member LLC propiedad de un no residente (persona física o entidad extranjera) con al menos una transacción reportable durante el año fiscal. Si el año la LLC no movió un dólar entre el socio y la entidad, técnicamente no hay 5472 - pero conviene presentarlo igual con "0" para mantener historial limpio.
- **Multa por omisión.** 25.000 USD por año fiscal y por entidad omitida. Multa adicional de 25.000 USD si tras el aviso del IRS no se corrige en 90 días. Es la multa informativa más cara para LLCs de no residente y la más fácil de prevenir presentando a tiempo. Tranquilo: en Exentax esto es trabajo de cada semana, lo gestionamos antes de que la carta llegue a tu buzón.

### Lo que más nos preguntan

**¿Tengo que pagar impuesto federal con esto?** No, salvo que la LLC tenga ingresos efectivamente conectados con un trade or business en EE.UU. (ETBUS). Sin ETBUS y sin US-source income, el resultado fiscal en EE.UU. es 0 y el 1120/5472 es solo informativo.

**¿Puedo presentarlos yo mismo?** Técnicamente sí, pero un error en la categorización de transacciones reportables o un retraso de un día activa la multa de 25.000 USD. La mayoría de clientes prefiere delegarlo y dormir.

En Exentax preparamos y presentamos el 1120 + 5472 de tu LLC dentro del plazo, te guardamos el justificante de presentación y mantenemos el histórico limpio para futuras inspecciones o due diligence.
<!-- /exentax:execution-v2 -->

## Tu siguiente paso con Exentax

En Exentax constituimos y mantenemos LLCs de no residentes a diario: estado, EIN, Operating Agreement, BOI cuando aplique, banca con Mercury y Wise, pasarelas Stripe y Adyen, contabilidad mensual, Form 5472 y 1120 pro-forma cada año, y coordinación con tu fiscalidad en residencia. Si quieres validar tu caso con datos reales, agenda una asesoría con nuestro equipo y te explicamos paso a paso cómo encajaría en tu situación concreta.

¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.

<!-- exentax:defensa-fiscal-v1 -->
## ¿Y si la AEAT me pregunta por mi LLC?

  Es la pregunta que más nos hace todo el mundo en la primera consulta y tiene una respuesta corta: tu LLC no es opaca y, si está bien declarada, una inspección se cierra en formularios estándar. La <a href="https://www.agenciatributaria.gob.es" target="_blank" rel="noopener">AEAT</a> puede pedirte el certificado de constitución del estado (Wyoming, Delaware o Nuevo México), el EIN emitido por el <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, el Operating Agreement firmado, los extractos de Mercury o Wise del ejercicio, el Form 5472 con el 1120 pro-forma presentado y la conciliación contable que cuadra ingresos, gastos y movimientos. Si todo eso existe y se entrega ordenado, la inspección no escala. Por eso, en Exentax te llevamos el calendario al día: tú dejas de pensar en plazos y nosotros los cerramos antes de que aprieten.

  Lo que la AEAT sí persigue, y con razón, es la titularidad simulada (testaferros, *prestanombres*, residencia fiscal de papel) y la falta de declaración del Modelo 720 / 721. Una LLC bien montada es exactamente lo contrario de eso: tú apareces como **beneficial owner** en el BOI Report cuando aplica (verificable en <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), tú firmas las cuentas bancarias y tú declaras la renta donde corresponde. La estructura está registrada en el Secretary of State del estado correspondiente, en los archivos del IRS y, si se opera con bancos europeos, también queda dentro del perímetro CRS del estándar de la <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.

  El error que sí hunde una inspección no es tener una LLC, es no haber atribuido la renta correctamente en el IRPF español, no haber presentado el Modelo 720 sobre las cuentas en EE. UU. cuando el saldo a 31/12 supera 50.000 € o no haber documentado las operaciones vinculadas socio-LLC en el Modelo 232 cuando proceda. Esos tres frentes son los que conviene cerrar antes de que llegue cualquier requerimiento, no después. Aquí entra Exentax: te presentamos el formulario, archivamos el acuse y, si la administración pregunta, ya tienes la respuesta lista.

  ## Lo que NO hace una LLC

  - **No te exime de tributar en España.** Si vives en España, tributas en España por la renta mundial. La LLC ordena tu fiscalidad estadounidense (cero impuesto federal en Single-Member LLC pass-through, salvo Effectively Connected Income), no la española. La cuota del IRPF se calcula sobre el beneficio atribuido, no sobre los dividendos cobrados.
  - **No es una "offshore" ni un esquema BEPS.** Es una entidad estadounidense reconocida por el IRS, registrada en un estado concreto con dirección física, con agente registrado y con obligaciones informativas anuales. Las jurisdicciones offshore clásicas (BVI, Belice, Seychelles) no aparecen en ningún papel; una LLC sí, en cinco sitios distintos.
  - **No te protege si hay confusión patrimonial.** El velo corporativo (*pierce the corporate veil*) se levanta en cuanto un juez detecta que la LLC y el socio son la misma persona en la práctica: cuentas mezcladas, gastos personales pagados desde la cuenta de la LLC, sin Operating Agreement firmado o sin contabilidad mínima. Tres movimientos sospechosos bastan.
  - **No te ahorra cotizaciones a la Seguridad Social en España.** Si eres residente fiscal en España y autónomo, tu cuota mensual sigue siendo la misma. La LLC opera tu actividad económica frente a clientes internacionales; tu cotización personal en RETA es independiente y depende de tu base elegida en el <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de Seguridad Social.
  - **No te libra de declarar las cuentas extranjeras.** Si la suma de cuentas en EE. UU. (Mercury, Relay, Wise USD) supera 50.000 € a 31/12, **Modelo 720** antes del 31 de marzo. Si tienes criptoactivos custodiados en exchanges fuera de España por más de 50.000 €, **Modelo 721** en el mismo plazo. Las dos obligaciones son del residente fiscal, no de la LLC.

  En Exentax revisamos estos cinco frentes cada año junto con el calendario federal estadounidense (Form 5472, 1120 pro-forma, FBAR, Annual Report estatal y BOI Report cuando aplique). El objetivo es que ninguna inspección encuentre un cabo suelto y que la estructura sostenga revisiones a 5-7 años vista.
<!-- /exentax:defensa-fiscal-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22irs%201120%205472%20que%20son%20cuando%20aplican%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si quieres ver el detalle del proceso completo, repasa nuestra <a href="/es/servicios">página de servicios</a> con todo lo que incluimos.

<!-- exentax:conv-fill-v1 -->
O llámanos directamente al <a href="tel:+34614916910">+34 614 916 910</a> si prefieres voz.

Para detalles concretos por estado, repasa nuestra <a href="/es/servicios/llc-wyoming">página de LLC en Wyoming</a> con costes y plazos cerrados.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Revisamos BOI, EIN, agente registrado y obligaciones federales para que no te sorprenda una multa. <a href="/es/servicios">Pedir revisión de compliance</a>.
<!-- /exentax:cta-v1 -->

`;
