export default `

Si eres residente fiscal en España y tienes una <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americana</a>, la pregunta clave no es qué dice el IRS sino qué dice la **doctrina administrativa española** sobre tu LLC. Y aquí hay un cuerpo de consultas vinculantes de la Dirección General de Tributos (DGT) y resoluciones del Tribunal Económico-Administrativo Central (TEAC) que es absolutamente determinante. Vamos a analizarlo con precisión.

## El problema fiscal de fondo

Una LLC estadounidense de un solo socio (Single-Member LLC) es por defecto una **Disregarded Entity** a efectos del IRS: no tributa como entidad propia y todos sus ingresos se atribuyen al socio. Pero España no es Estados Unidos, y la AEAT debe **calificar** la LLC con arreglo al ordenamiento español para decidir cómo tributa el socio residente.

Las preguntas técnicas clave son:

1. ¿Es la LLC una entidad con personalidad jurídica propia desde la perspectiva del derecho español o se asimila a un ente sin personalidad?
2. ¿Tributa la LLC en sí (Impuesto sobre Sociedades de no residente sin establecimiento permanente) o sus rentas se imputan directamente al socio (atribución de rentas, art. 87 LIRPF)?
3. Si la LLC se considera entidad opaca, ¿los rendimientos del socio son rendimientos del capital mobiliario (dividendos) o rendimientos del trabajo / actividades económicas?
4. ¿Aplica el Convenio de Doble Imposición España-EE.UU. (BOE de 22 de diciembre de 1990, modificado por Protocolo en vigor desde 27 de noviembre de 2019)?
5. ¿Cómo se evita la doble imposición?

La respuesta a estas preguntas tiene un impacto directo de hasta **20 puntos porcentuales** en tu carga fiscal personal.
### La doctrina anterior: opacidad y dividendos

Durante años, la DGT venía considerando que las LLC de no residentes con personalidad jurídica propia bajo derecho americano debían tratarse como **entidades opacas** (similares a una S.L. española). Por tanto:

- La LLC no tributaba en España por sus rentas (no tenía establecimiento permanente).
- Cuando la LLC distribuía beneficios al socio residente español, esos beneficios se calificaban como **rendimientos del capital mobiliario** (dividendos), tributando en la base del ahorro al 19-28%.
- Aplicaba el Convenio España-EE.UU. y la deducción por doble imposición internacional.

Esta línea era favorable al contribuyente: 19-28% en IRPF base ahorro vs. 24-47% en base general por rendimientos de actividades económicas.
## El giro: consulta V0443-19 y BOE febrero 2020

En 2019 y especialmente con la **Consulta Vinculante V0443-19, de 28 de febrero de 2019**, la DGT introduce un análisis más sofisticado que sienta las bases de la línea reforzada que se consolida en publicaciones doctrinales y resoluciones a partir de **febrero de 2020**:

> El elemento determinante para calificar fiscalmente una entidad extranjera no es su personalidad jurídica formal en el país de constitución, sino la **comparación funcional** con las figuras equivalentes del ordenamiento español, atendiendo al régimen sustantivo (responsabilidad de los socios, autonomía patrimonial, capacidad de obrar) y al régimen tributario aplicable en el país de origen (transparente vs opaco).

La conclusión técnica de esta línea: una **Single-Member LLC tratada como Disregarded Entity por el IRS** se asimila funcionalmente a una entidad en **régimen de atribución de rentas** del ordenamiento español. Es decir, una figura próxima a una comunidad de bienes o sociedad civil sin personalidad: las rentas se imputan directamente al socio en función de su naturaleza (rendimientos de actividades económicas, ganancias patrimoniales, etc.).

Esta línea se ha consolidado en consultas posteriores (entre otras V1631-21, V2034-22, V0863-23) y en resoluciones del TEAC sobre supuestos análogos.
### Qué cambia para tu IRPF

Si tu LLC se califica como entidad en atribución de rentas:

- **No hay momento de "distribución de dividendos".** Los rendimientos se imputan al socio residente español en el ejercicio en que la LLC los obtiene, con independencia de que se hayan distribuido o no.
- **Se imputan según su naturaleza original.** Si la LLC presta servicios profesionales, son **rendimientos de actividades económicas** y tributan en la base general (24-47% en escala estatal y autonómica).
- **No aplican las exenciones por doble imposición de dividendos.** Aplica la **deducción por doble imposición internacional** (art. 80 LIRPF) solo por el impuesto efectivamente pagado en EE.UU. que para Disregarded Entity es típicamente **0 $** federal (ver <a href="/es/blog/tributacion-pass-through-llc-como-funciona">tributación pass-through</a>).
- **Los gastos deducibles de la LLC son deducibles** para el cálculo del rendimiento neto que se imputa al socio (igual que en cualquier actividad económica).
### Cuándo la LLC sigue siendo opaca

No toda LLC se asimila automáticamente a entidad transparente. Si tu LLC:

- Tiene **varios socios** (Multi-Member LLC) y por defecto se trata como **Partnership** en EE.UU.: la línea es similar (atribución de rentas).
- Hace **check-the-box election** (Form 8832) para tributar como **C-Corporation** en EE.UU.: la situación es distinta. La LLC sí tributaría como entidad opaca en EE.UU. (impuesto federal del 21%) y la doctrina española sí podría calificarla como opaca también; las distribuciones serían dividendos al socio residente.

La Consulta DGT V2034-22 reitera esta lógica: **el régimen tributario en EE.UU. (transparente o opaco) es el indicio más relevante** para decidir la calificación a efectos españoles.
### Convenio de Doble Imposición España-EE.UU.

El CDI España-EE.UU. (BOE 22-12-1990, modificado por Protocolo BOE 23-10-2019, en vigor desde 27-11-2019) regula el reparto de potestad tributaria entre ambos Estados. Puntos clave:

- **Art. 7 CDI**: beneficios empresariales tributan en el Estado de residencia salvo que haya **establecimiento permanente** (EP) en el otro Estado. Una LLC sin EP en EE.UU. y con socio residente español no tributa en EE.UU. por beneficios empresariales: tributa en España.
- **Art. 22 CDI**: cláusula de eliminación de la doble imposición.
- **Limitation on Benefits (LOB)**: el Protocolo de 2019 ha endurecido las cláusulas anti-treaty-shopping, lo que impacta especialmente a estructuras LLC opacas.

En la **Disregarded Entity**, el CDI se aplica directamente al socio (la LLC es transparente), y no hay impuesto americano que deducir; la deducción por doble imposición es testimonial.
### Deducción de gastos: lo que sí puedes restar

Aunque el rendimiento se impute al socio español como actividad económica, los **gastos correlacionados con la obtención del ingreso** son deducibles igual que en cualquier actividad económica (art. 28 LIRPF y normas LIS de remisión):

- Software, hosting, herramientas SaaS.
- Subcontratación a terceros documentada.
- Comisiones de plataformas y procesadores de pago.
- Cuotas de Mercury, Wise, Wallester, agente registrado, contabilidad.
- Marketing, publicidad, formación.
- Local de trabajo (proporcional si es vivienda habitual, con criterios estrictos).

Más detalle en <a href="/es/blog/gastos-deducibles-llc-que-puedes-deducir">gastos deducibles en tu LLC</a>.
### Implicaciones operativas

1. **Necesitas contabilidad real de la LLC.** No puedes "estimar" el rendimiento neto: necesitas libros, justificantes, conciliaciones bancarias.
2. **Tu IRPF debe declarar el rendimiento neto imputado**, no la "remesa" recibida en tu cuenta personal.
3. **Modelo 720 igualmente.** El régimen de atribución de rentas no exime de la obligación informativa sobre cuentas y participaciones en el extranjero.
4. **Modelo 100/130/131.** Si calificas como actividad económica, necesitas régimen de pagos fraccionados como cualquier autónomo (módulos no aplica).
### Riesgo de regularización si llevabas años "como dividendos"

Si llevas años declarando los flujos de tu LLC como dividendos en base ahorro (19-28%) y la AEAT los recalifica como actividad económica imputada (base general 24-47%), la diferencia puede ser muy relevante. Periodo de prescripción: **4 años**. Sanciones: art. 191-195 LGT.

Lo que vemos: regularizaciones por el periodo no prescrito + intereses + sanción mínima del 50% (puede subir).
### Cómo planificar correctamente

1. **Definir la calificación con criterio.** Caso típico de servicios profesionales con Single-Member LLC: actividad económica imputada por atribución de rentas.
2. **Diseñar la estructura para que tribute eficientemente.** Decisiones: aportaciones de capital, gastos asignados, retribución del socio, otras estructuras posibles (S.L. española + LLC operativa, etc.). Ver <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">diseño de estructura internacional sólida</a>.
3. **Considerar tu actividad concreta.** Distinto régimen práctico para servicios, e-commerce, royalties, trading. Lo desarrollamos en <a href="/es/blog/tributacion-llc-segun-actividad-economica">tributación de la LLC según tu actividad económica</a>.
4. **Mantener documentación robusta.** Es lo que diferencia una estructura defendible de una vulnerable.
5. **Evitar la simulación.** Si la LLC carece de sustancia y los servicios los presta materialmente la persona física residente, la AEAT puede aplicar simulación (LGT art. 16), que conlleva mayor sanción y posible derivación penal según importes.
### En resumen

La doctrina administrativa española sobre la LLC americana es muy específica: en el caso típico de Single-Member LLC, el rendimiento se imputa al socio residente español como actividad económica en base general. Esto requiere planificación seria, no improvisación. La buena noticia: bien diseñada, una LLC sigue siendo una herramienta excelente para internacionalizar tu negocio y optimizar legalmente tu carga fiscal global.

¿Quieres revisar tu caso a la luz de la doctrina vigente y diseñar la estructura más eficiente para tu situación? Agenda tu asesoría gratuita.

Cierro con una lectura relacionada que encaja con el hilo de este artículo: <a href="/es/blog/fiscalidad-internacional-emprendedores-digitales">Fiscalidad internacional para emprendedores digitales: todo lo que necesitas saber</a> es una pieza útil para terminar de contextualizar el escenario.
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
## Referencias: marco legal y normativa

La argumentación de este artículo descansa en la siguiente normativa y doctrina, vigente actualmente:

- **España.** Ley 35/2006 del IRPF (arts. 8, 9 y 91 sobre residencia fiscal y transparencia fiscal internacional), Ley 27/2014 del Impuesto sobre Sociedades (art. 100 sobre TFI), Ley 58/2003 General Tributaria, Ley 5/2022 que reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 720) y Orden HFP/887/2023 (Modelo 721 de criptoactivos en el extranjero).
- **Doctrina administrativa.** Resoluciones del TEAC y consultas vinculantes de la DGT relativas a LLC unipersonales (entre otras V0443-08, V1631-17, V1147-22), interpretadas a la luz del BOE de febrero de 2020 sobre clasificación de entidades extranjeras transparentes.
- **Convenios y normativa internacional.** Convenio de Doble Imposición entre España y EE. UU. firmado en 1990 con Protocolo de 2013 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Convenio OCDE con sus Comentarios.
- **EE. UU.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa FBAR (31 CFR 1010.350).

Este contenido es divulgativo y no sustituye al asesoramiento personalizado para tu situación fiscal concreta.

<!-- exentax:execution-v2 -->
## Cómo se aplica realmente la doctrina DGT-TEAC a tu caso

La doctrina española sobre LLCs no se entiende leyendo una sola consulta vinculante: hay que cruzar varias y entender la lógica de fondo. La AEAT, en la práctica, atribuye al socio residente el resultado neto de la LLC cuando ésta se considera transparente y carece de sustancia propia, y lo califica habitualmente como rendimiento de actividad económica si la actividad es operativa o como rendimiento del capital mobiliario si es meramente patrimonial.

- **CV0024-19, CV1631-21 y posteriores.** Confirman que una SMLLC se trata como entidad en atribución de rentas para el socio residente en España, salvo elección a C-Corp formalizada y tributación efectiva en EE. UU. Esto evita la doble imposición pero exige imputar el beneficio íntegro en el ejercicio en que se devenga, no cuando se distribuye.
- **Calificación de la renta.** Si la LLC presta servicios profesionales, los rendimientos se imputan en el IRPF como actividad económica del socio (epígrafe IAE coherente). Si la LLC se limita a tener inversiones pasivas, la calificación correcta es rendimiento del capital mobiliario y los pagos a no residentes quedan sujetos a sus reglas propias.
- **Convenio EE. UU.-España.** El convenio (BOE de 23 de octubre de 2019, Protocolo en vigor desde 2019) permite acreditar el impuesto soportado en EE. UU. - federal y estatal - contra la cuota española. Para una SMLLC sin C-Corp election, la cuota federal es típicamente cero, lo que reduce el crédito a casi nulo pero también elimina la doble imposición real.
- **Modelo 720 y Modelo 721.** Si la LLC tiene cuentas con saldo combinado superior a 50.000 €, hay obligación de declararlas, con multa proporcional limitada por la STJUE C-788/19. Las participaciones en la LLC también pueden entrar en el ámbito del 720 si se configuran como derechos sobre entidad extranjera.

### Lo que más nos preguntan

**¿La AEAT considera mi LLC como entidad opaca o transparente?** Por defecto, transparente para una SMLLC sin C-Corp election. Si quieres opacidad real (con tributación al 21 % federal), debes presentar Form 8832 a tiempo y documentarlo. Cualquiera de las dos opciones es legítima, pero hay que elegirla activamente.

**¿Qué riesgo tengo si llevo años imputando mal?** Regularización voluntaria con complementarias y, según el caso, sin sanción si no ha llegado requerimiento. Lo evaluamos con números reales antes de proponer cualquier movimiento.

En Exentax encajamos tu LLC en la doctrina española de forma que la declaración sea defendible documentalmente y consistente con tu actividad real.
<!-- /exentax:execution-v2 -->

## Tu siguiente paso con Exentax

En Exentax constituimos y mantenemos LLCs de no residentes a diario: estado, EIN, Operating Agreement, BOI cuando aplique, banca con Mercury y Wise, pasarelas Stripe y Adyen, contabilidad mensual, Form 5472 y 1120 pro-forma cada año, y coordinación con tu fiscalidad en residencia. Si quieres validar tu caso con datos reales, agenda una asesoría con nuestro equipo y te explicamos paso a paso cómo encajaría en tu situación concreta.


¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:+34614916910">+34 614 916 910</a> o escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22boe%20febrero%202020%20llc%20doctrina%20administrativa%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si prefieres hablarlo en directo, <a href="/es/agendar">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisión editorial pendiente</strong> — Las siguientes referencias requieren verificación manual contra la fuente oficial vigente. Si encuentras una desviación, escríbenos y la corregimos en menos de 24 horas.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">28%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…ario** (dividendos), tributando en la base del ahorro al 19-28%. - Aplicaba el Convenio Es…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">47%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…vorable al contribuyente: 19-28% en IRPF base ahorro vs. 24-47% en base general por rendim…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">21%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…ibutaría como entidad opaca en EE.UU. (impuesto federal del 21%) y la doctrina española sí…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">50%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…or el periodo no prescrito + intereses + sanción mínima del 50% (puede subir). ### Cómo pl…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…os.** Cuentas bancarias en EE. UU. con saldo medio o final &gt;50.000 € en el ejercicio: **Mo…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…r&quot;&gt;OCDE&lt;/a&gt; con sus Comentarios. - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación chec…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §77…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…Corp election. Si quieres opacidad real (con tributación al 21 % federal), debes presentar…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…U.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa F…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…(atribución de rentas). - Hace **check-the-box election** (Form 8832) para tributar como *…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…cación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…13 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Conve…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…esde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Convenio &lt;a …»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
