export default `

Hay un trámite en la vida fiscal de una LLC con socio extranjero único que separa con claridad a quien gestiona bien de quien está caminando hacia un problema de cinco cifras: el **Form 5472**. No es un impuesto. Es una declaración informativa. Y precisamente por ser "solo informativa" mucha gente la ignora, la presenta tarde, la presenta con datos rotos o ni se entera de que existe. El IRS rara vez perdona ese olvido: la sanción base son **25.000 USD** por formulario no presentado, **por año**, y se acumula.

Este artículo no es la guía paso a paso del trámite (para eso ya tienes la <a href="/es/blog/form-5472-que-es-como-presentarlo">guía completa del Form 5472</a> y la pieza sobre <a href="/es/blog/irs-1120-5472-que-son-cuando-aplican">cuándo aplican el 1120 y el 5472</a>). Es lo que pasa **cuando ya no lo has presentado**, y cómo se sale de ahí sin destruir la LLC ni tu situación personal.

## Qué sanciona exactamente el IRS

La regla concreta vive en la **sección 6038A(d) del Internal Revenue Code**, reforzada en 2017 por el Tax Cuts and Jobs Act, y la base aplicable hoy son **25.000 USD por formulario no presentado, presentado tarde o presentado de forma sustancialmente incompleta**. Hasta 2018 la sanción era de 10.000 USD; desde entonces la cifra está fijada en 25.000 USD y, salvo cambio legislativo, esa es la cifra con la que vas a chocar.

A esa sanción base se le añaden tres elementos que la mayoría de gente no ve venir:

1. **Sanción por persistencia.** Si el IRS te notifica formalmente la falta de presentación y no regularizas en **90 días**, se aplican **25.000 USD adicionales por cada periodo de 30 días** (o fracción) que sigas sin presentar. No hay tope público: en casos reales se han visto liquidaciones de seis cifras.
2. **Una sanción por año, no una sola.** Si llevas tres años sin presentar el 5472, son tres formularios. Tres por 25.000 = **75.000 USD** antes incluso de entrar en intereses.
3. **Cascada con el Form 1120.** Recuerda que tu LLC unipersonal extranjera está obligada a presentar **Form 1120 pro forma + Form 5472 conjuntamente**. Si no presentaste el 5472, casi siempre tampoco presentaste el 1120, y eso añade exposición adicional por late filing del 1120 bajo §6651, aunque la sanción monetaria del §6651 se calcula sobre el impuesto adeudado, por lo que en una LLC pro forma sin tax due la cuantía suele ser cero o residual; el riesgo principal sigue siendo el 5472.

A todo esto súmale **intereses sobre las sanciones** desde la fecha en que se devengaron, que el IRS calcula con el federal short-term rate + 3 puntos y se actualiza cada trimestre.
## Cómo se entera el IRS

La pregunta que me hacen casi todos los clientes en la primera reunión es la misma: *"¿pero cómo va a saber el IRS que existo si nunca presenté nada?"*. La respuesta corta es: **lo sabe, y cada año le es más fácil saberlo**. Las vías concretas actualmente son cinco:

- **EIN bajo control.** Si pediste EIN, ya estás en sus sistemas. El IRS cruza periódicamente entidades con EIN activo contra declaraciones recibidas. Una LLC unipersonal con EIN y sin 1120/5472 año tras año aparece como **non-filer** en sus listados.
- **Bancos americanos y reporting de terceros.** Mercury, Brex, Wise USD, Relay y similares aplican KYC sobre la LLC, mantienen información de cliente accesible al IRS y, según el flujo y el tipo de cliente, pueden generar reporting de terceros (Form 1099, retenciones, FATCA cuando aplica). Una LLC con cuenta operativa que mueve fondos y no presenta es el patrón que activa revisiones.
- **BOI Report (FinCEN).** Bajo la normativa <a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI Report</a> vigente, FinCEN tiene mapeada la titularidad real de las LLC obligadas, y el marco prevé compartición de datos con el IRS sujeta a las reglas de acceso aplicables (régimen sujeto a cambios normativos).
- **CRS y DAC reverso.** Cuando tu país de residencia recibe información de cuentas vinculadas a la LLC y el IRS pide auditar, el cruce sale solo. Hay países que ya están haciendo este cruce de oficio.
- **Vuestros propios partners y proveedores.** Cuando un proveedor americano emite Form 1099 a tu LLC, o cuando una contraparte declara una transaction reportable, tu LLC aparece reflejada en el sistema sin que tú hayas hecho nada.

La idea de que "como nunca presenté no me ven" quedó desfasada con los reforzamientos de 2017 y, con la normativa BOI vigente, es prácticamente insostenible. Lo correcto es asumir que el IRS te puede abrir un examen en cualquier momento y diseñar tu plan en consecuencia.
## Los tres perfiles típicos del que llega tarde

En la práctica, las situaciones que vemos en Exentax son tres y cada una se gestiona distinto:

### Perfil A: nunca has presentado el 5472

Tienes una LLC desde hace dos, tres, cinco años. Tienes EIN, tienes cuenta bancaria, has facturado. Pero nunca has tocado el 1120 ni el 5472 porque "alguien te dijo que la LLC no paga impuestos". Aquí la sanción potencial es **25.000 USD × número de años no presentados**, más posibles late filing del 1120, más intereses.

### Perfil B: has presentado tarde

Te diste cuenta del problema, presentaste tarde, pero antes de que el IRS te notificara formalmente. Aquí entra el debate sobre **late filing penalty del 5472**: oficialmente sigue siendo 25.000 USD, pero la doctrina pacífica es que **la presentación tardía espontánea con reasonable cause** abre la puerta a **abatement**. Es donde más casos hemos cerrado a sanción cero.

### Perfil C: has presentado pero mal

Presentaste 1120 y 5472 pero con datos sustancialmente incompletos: faltó una **reportable transaction**, pusiste mal el TIN del foreign related party, omitiste un préstamo del socio a la LLC, no declaraste un capital contribution. La regla del 6038A(d) es estricta: una declaración **sustancialmente incompleta equivale a no presentación**, y se sanciona igual. La buena noticia es que la corrección amistosa con explicación suele resolverse mejor que las dos anteriores.
### Qué es una "reportable transaction" (y por qué casi nadie las identifica bien)

Esta es la causa número uno de Form 5472 técnicamente mal presentados. Una **reportable transaction** es cualquier movimiento monetario o no monetario entre la LLC y su foreign related party (tú, en la mayoría de casos), incluyendo cosas que la gente no asocia con "transacción":

- Aportaciones de capital del socio a la LLC.
- Préstamos del socio a la LLC y de la LLC al socio (sí, ambos).
- Distribuciones de la LLC al socio.
- Pagos por servicios, royalties, intereses.
- Cesiones de uso de activos (incluido software, marcas, dominios).
- Reembolsos de gastos cuando los paga el socio personalmente y los reclama.
- Cualquier asiento contable que represente un derecho u obligación entre LLC y socio.

Cuando alguien me dice "yo no tuve transacciones con mi LLC", normalmente lo que hay son **cinco o seis transacciones reportables sin documentar**. Eso es exactamente la situación del Perfil C.
## El ciclo real de una notificación IRS

Conviene tener mapeado qué ocurre cuando la maquinaria se activa, porque cada paso tiene tiempos y opciones distintas:

1. **CP15 / CP215 (notice of penalty).** Te llega notificación de la sanción inicial de 25.000 USD por formulario.
2. **Plazo de respuesta (~30 días).** Aquí decides si pagas, si pides abatement por reasonable cause, si discutes el cálculo o si pides una revisión por la Office of Appeals.
3. **Examen ampliado.** Si la respuesta no convence, el IRS suele abrir examen sobre años adicionales. Donde había una sanción aparecen tres.
4. **90 días tras notificación formal.** Si no se ha presentado el formulario y resuelto la situación, se activan los **25.000 USD por cada 30 días adicionales**.
5. **Liquidación final + intereses.** Una vez fijada la cifra, se devengan intereses hasta el pago.

Quien haya pasado por aquí sabe que el momento clave es **el plazo del paso 2**. Una respuesta bien construida en ese momento es la diferencia entre cerrar a 0 USD y arrastrar seis cifras durante años.
## Reasonable cause: lo que de verdad funciona

El IRS contempla la **reasonable cause exception** del 6038A. No es magia: es una doctrina con criterios. Lo que normalmente **funciona**:

- Demostrar que actuaste con **diligencia ordinaria** y que el error vino por una causa razonable y no por dejadez.
- Adjuntar correspondencia con asesores anteriores que te aseguraron que no había obligación.
- Mostrar que en cuanto tuviste conocimiento de la obligación, **te pusiste al día de inmediato**.
- Acreditar que la información estaba disponible y que la presentaste correcta y completa al regularizar.

Lo que **no funciona** (y muchos lo intentan):

- "No sabía que existía el 5472." No basta.
- "Mi banco / Stripe / mi gestor no me lo dijo." No basta.
- "La LLC no tuvo actividad relevante." Si hubo cualquier reportable transaction, da igual.
- Presentar la solicitud de abatement **después** de regularizar de forma incompleta o con errores.

Aquí es donde un escrito profesional bien fundamentado, con estructura formal y referencias a IRM 20.1.9 y al regulation §1.6038A-4, marca la diferencia.
### Streamlined no, pero hay caminos

Mucha gente confunde los **Streamlined Filing Compliance Procedures** (que son un programa de regularización de **personas físicas estadounidenses con cuentas extranjeras no declaradas**) con la situación de un Form 5472 no presentado. **No es lo mismo y no aplica.** Lo que sí aplica al 5472 son tres rutas reales:

- **Delinquent international information return submission.** Procedimiento estándar para presentar declaraciones informativas internacionales tarde con reasonable cause. Es la vía habitual del Perfil A y del Perfil B.
- **Voluntary Disclosure Practice.** Solo cuando hay **conducta dolosa** o riesgo penal. No es lo normal en una LLC unipersonal.
- **Quiet disclosure.** Presentar tarde sin explicación. Técnicamente posible, prácticamente desaconsejado: el IRS lo trata como late filing puro y aplica sanción.

La diferencia entre ir por la ruta correcta o ir a ciegas son, literalmente, decenas de miles de dólares.
## El plan de regularización paso a paso

Cuando llega un cliente con un 5472 no presentado, el orden de trabajo es siempre el mismo:

1. **Inventario real**: cuántos años, qué reportable transactions hubo cada año, qué documentación bancaria y contable existe, hay BOI presentado, hay 1120 presentado, hay declaraciones en el país de residencia.
2. **Reconstrucción de las transacciones reportables** año a año, incluyendo aportaciones, préstamos y distribuciones.
3. **Preparación del paquete**: 1120 pro forma de cada año pendiente + 5472 de cada año pendiente + reasonable cause statement detallado.
4. **Envío por correo certificado** (estos paquetes no van por e-file; la dirección operativa es la del Service Center de Ogden).
5. **Plan de respuesta** anticipado por si llega la sanción inicial: borrador de respuesta y plazos preparados antes incluso de que llegue el aviso.
6. **Limpieza de adyacentes**: <a href="/es/blog/boi-report-fincen-guia-completa-2026">BOI</a>, situación bancaria, declaraciones en tu país y, sobre todo, <a href="/es/blog/tengo-llc-checklist-gestion-correcta">el checklist anual</a> para que no vuelva a pasar.

Hecho en este orden, en muchos casos el resultado realista es **sanción cero o residual**, aunque depende de hechos, documentación y respuesta del agente del IRS. Hecho mal, son cinco cifras y un examen ampliado.
### Errores que multiplican la factura

Por terminar con lo concreto, estos son los errores que en Exentax vemos repetir mes tras mes y que **multiplican el coste**:

- Presentar el 5472 sin el 1120 pro forma asociado. Inválido.
- Presentar el 5472 por e-file: salvo casos puntuales, va por correo y firmado.
- Reasonable cause genérico copiado de internet. El IRS los archiva como rechazo.
- Empezar a presentar solo los últimos años "para no llamar la atención". Si tenías obligación los anteriores, la sanción sigue viva.
- Cerrar la LLC creyendo que así desaparece la obligación. **No desaparece**: la sanción sobrevive a la disolución hasta que prescribe.
- Cambiar de Registered Agent o de dirección sin actualizar al IRS. Las notificaciones se pierden y los plazos siguen corriendo.
- Asumir que tu país de residencia te protege. La sanción es del IRS sobre la LLC; ningún convenio bilateral elimina esa sanción.

---
### Conclusión y siguiente paso

El Form 5472 es uno de los pocos casos donde el coste de **no hacer nada** es geométricamente superior al coste de hacerlo bien. La sanción base de 25.000 USD por año no se discute; lo que sí se discute es **cómo regularizas, en qué orden, con qué argumentación y qué riesgos colaterales cierras al mismo tiempo**.

Si tienes una LLC y crees que puedes estar en cualquiera de los tres perfiles, no he presentado, presenté tarde, presenté pero mal, lo razonable es **mapear la situación con números reales antes de que lo haga el IRS**. En una asesoría gratuita de 30 minutos lo revisamos contigo, te decimos en qué perfil estás, qué exposición tienes y qué ruta de regularización es la realista. Es lo más barato que puedes hacer hoy con respecto a este tema.
## Referencias legales y normativas

Este artículo se apoya en normativa vigentes actualmente. Citamos las fuentes principales para que puedas verificarlo:

- **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report ante FinCEN).
- **España.** Ley 35/2006 (LIRPF), arts. 8, 9 (residencia), 87 (atribución de rentas), 91 (transparencia fiscal internacional para personas físicas); Ley 27/2014 (LIS), art. 100 (transparencia fiscal internacional para sociedades); Ley 58/2003 (LGT), arts. 15 (conflicto en aplicación de la norma) y 16 (simulación); Ley 5/2022 (régimen sancionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 720); Orden HFP/887/2023 (Modelo 721 cripto).
- **Convenio España–EE. UU.** BOE de 22/12/1990 (CDI original); Protocolo en vigor desde 27/11/2019 (renta pasiva, *limitation on benefits*).
- **UE / OCDE.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetrías híbridas); Estándar Común de Reporte (CRS) de la OCDE.
- **Marco internacional.** Modelo de Convenio OCDE, art. 5 (establecimiento permanente) y comentarios; Acción 5 BEPS (sustancia económica); FATF Recommendation 24 (titularidad real).
La aplicación concreta de cualquiera de estas normas a tu caso depende de tu residencia fiscal, la actividad de la LLC y la documentación que mantengas. Este contenido es informativo y no sustituye al asesoramiento profesional personalizado.

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
- **EIN y notificaciones.** Sin EIN no se puede presentar 5472 ni BOI. El IRS no avisa antes de sancionar; las multas se descubren al actuar contra el EIN o al rechazar una próxima presentación.

<!-- exentax:execution-v2 -->
## Qué pasa si NO presentas el 5472: cómo es la multa del IRS y cómo regularizar

El 5472 es la obligación más cara que puede incumplir un dueño de LLC no residente. La sanción es civil, automática (no discrecional del IRS), y arranca en $25.000 por formulario por año. Esto es lo que de verdad pasa cuando no se presenta y, más importante, cómo regularizar minimizando daño antes de que el IRS abra el expediente él mismo.

- **La sanción exacta y cómo se aplica.** $25.000 por cada 5472 no presentado, no completo o presentado fuera de plazo (IRC §6038A(d)). Si pasados 90 días desde el aviso del IRS sigues sin presentar, $25.000 adicionales por cada periodo de 30 días, sin tope explícito. La multa NO depende de cuánto facturó la LLC: una LLC con $0 de revenue paga lo mismo que una con $500.000.
- **Cómo se entera el IRS si no presentas.** Tres vías: (1) intercambio CRS/FATCA con tu país de residencia que pregunta por la LLC, (2) cruce con el banco US que reporta cuentas de no residentes a IRS, (3) auditoría aleatoria de LLCs sin filings históricos. La probabilidad de detección NO es cero; es creciente cada año por mejora del intercambio internacional.
- **Cómo regularizar antes de que te abran expediente.** Filing tardío voluntario del 5472 + 1120 + carta de "reasonable cause" justificando el incumplimiento (desconocimiento de buena fe, asesor incorrecto, primera vez). El IRS tiene un programa First-Time Penalty Abatement que puede eliminar la multa completa si es tu primer incumplimiento y tienes histórico limpio anterior. Solicitar ANTES de que ellos te avisen es la diferencia entre $0 y $25k.
- **Cómo regularizar después de aviso del IRS.** Si ya te llegó la CP15 o equivalente, tienes 30 días para responder con: presentación inmediata del formulario, pago bajo protesta (importante: pagar primero, recurrir después), y solicitud formal de penalty abatement con expediente completo. Plazo típico de resolución: 4-6 meses. Probabilidad de éxito en first-time + reasonable cause: 60-80%.

### Lo que más nos preguntan

**¿Si llevo 3 años sin presentar son $75.000?** Sí, $25k × 3 años, en el peor caso. La regularización voluntaria con reasonable cause puede reducir significativamente o eliminar las multas, especialmente si el resto del compliance (BOI, residencia) está al día. Cuanto antes se regulariza, mejor.

**¿Puedo cerrar la LLC y "que se olviden"?** No. La obligación de los años que estuvo activa persiste tras la disolución. Cerrar sin regularizar empeora: el IRS interpreta el cierre como evasión de la sanción y endurece. Lo correcto es regularizar primero, cerrar después.

En Exentax llevamos regularizaciones de 5472 atrasados (filing tardío + reasonable cause + abatement) y, en casos más graves, programas de delinquent international information return submission - para minimizar la multa, no negar el problema.
<!-- /exentax:execution-v2 -->

## Tu siguiente paso con Exentax

En Exentax constituimos y mantenemos LLCs de no residentes a diario: estado, EIN, Operating Agreement, BOI cuando aplique, banca con Mercury y Wise, pasarelas Stripe y Adyen, contabilidad mensual, Form 5472 y 1120 pro-forma cada año, y coordinación con tu fiscalidad en residencia. Si quieres validar tu caso con datos reales, agenda una asesoría con nuestro equipo y te explicamos paso a paso cómo encajaría en tu situación concreta.

<!-- exentax:cross-refs-v1 -->
### Más lecturas relacionadas

- [Recuperar una LLC con BOI y 5472 atrasados: procedimiento real y prioridades](/es/blog/recuperar-llc-boi-5472-atrasados-procedimiento)
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
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22que%20pasa%20si%20no%20presentas%205472%20multas%20irs%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

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
