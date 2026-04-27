export default `

El Common Reporting Standard (CRS) es la pieza más importante de la fiscalidad internacional de la última década, y muy poca gente entiende qué significa para alguien que tiene una <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americana</a> o cuentas fuera de su país de residencia. Vamos a desmontar el tema con precisión técnica y sin alarmismos.

## Qué es el CRS y por qué existe

El **Common Reporting Standard** lo aprobó el Consejo de la OCDE en julio de 2014 como respuesta al G20 tras la crisis financiera y los escándalos de evasión fiscal (LuxLeaks, Panama Papers). El objetivo: que las administraciones tributarias de los países adheridos intercambien automáticamente información sobre cuentas financieras de no residentes.

A nivel técnico, CRS es la generalización a más de 100 jurisdicciones del modelo previo (FATCA), pero con alcance multilateral en lugar de bilateral. España lo transpuso mediante el Real Decreto 1021/2015 y la Orden HAP/1695/2016, que regulan el **Modelo 289** (declaración informativa anual de cuentas financieras de no residentes que las entidades financieras españolas remiten a la AEAT, recibida en sentido inverso desde otros países adheridos).

En América Latina lo han implementado, entre otros: México (desde 2017), Argentina, Colombia, Chile, Brasil, Uruguay, Panamá, Perú, Costa Rica, Ecuador y República Dominicana. Estados Unidos, importante: **no está adherido al CRS**. Tiene su propio sistema (FATCA) que es bilateral y solo de salida, no de entrada. Profundizamos en esto en nuestro artículo sobre <a href="/es/blog/cuentas-bancarias-usa-reportan-hacienda-verdad">si las cuentas bancarias en EE.UU. reportan a tu hacienda</a> y, para entender por qué tampoco firmará la nueva versión, en <a href="/es/blog/crs-2-0-carf-por-que-usa-no-firmara-llc">CRS 2.0 y CARF: por qué USA nunca firmará</a>.
### Marco normativo

- **OCDE**: Common Reporting Standard, julio 2014. Estándar Común de Comunicación de Información (ECCI/CRS), texto consolidado y comentarios oficiales.
- **UE**: Directiva 2011/16/UE de cooperación administrativa (DAC), modificada por la DAC2 (Directiva 2014/107/UE) que incorpora el CRS al derecho de la Unión.
- **España**: Real Decreto 1021/2015, Orden HAP/1695/2016, Orden HAC/3625/2003 (Modelo 720), Orden HFP/886/2023 (Modelo 721 sobre criptoactivos en el extranjero).
- **OCDE Multilateral Competent Authority Agreement (MCAA)**: el instrumento por el que cada país activa el intercambio bilateral con cada uno de los demás. España tiene activado el intercambio con prácticamente toda la UE y con la mayor parte de jurisdicciones adheridas.
## Qué información se reporta exactamente

Cada **Reporting Financial Institution** (banco, broker, fintech con licencia bancaria; fondo de inversión; compañía de seguros con productos de inversión) que detecte un titular cuya residencia fiscal sea distinta del país donde está la cuenta debe reportar:

| Categoría | Detalle |
| --- | --- |
| Datos del titular | Nombre, dirección, país de residencia fiscal, NIF/TIN, fecha y lugar de nacimiento (personas físicas) |
| Datos de la entidad | Nombre, NIF, país. En cuentas titularidad de **NFE pasivas**, también los datos de los **beneficiarios efectivos** controlantes |
| Datos de la cuenta | Número de cuenta, nombre y número identificativo de la institución financiera |
| Saldos | Saldo o valor a cierre del año natural (o al cierre de la cuenta si se canceló durante el año) |
| Rendimientos | Intereses brutos, dividendos brutos, otros ingresos generados, ingresos brutos por venta o reembolso de activos financieros (cuentas de custodia) |

Este flujo se envía cada año, normalmente entre mayo y septiembre del año siguiente al ejercicio reportado, y se cruza con las declaraciones del contribuyente (en España: IRPF, Modelo 720 y, tras la última reforma, Modelo 721 para criptoactivos).
## Qué pasa con tu LLC americana: el matiz que casi nadie explica

Aquí es donde aparecen los malentendidos. Vamos a fijar conceptos:

1. **EE.UU. no envía datos por CRS.** Por tanto, ni Mercury, ni Relay, ni un banco regional americano enviarán datos directamente a la AEAT, SAT, DIAN o AFIP por CRS. Lo que sí hace EE.UU. es FATCA, que es **unilateral de salida**: pide datos a entidades extranjeras sobre cuentas de US persons, pero no envía datos equivalentes en sentido inverso de forma automática (sí lo hace en algunos casos a través de IGAs Modelo 1, pero el alcance es muy inferior a CRS).
2. **Tus cuentas en fintech europeas a nombre de la LLC SÍ se reportan.** Wise (Bélgica), Revolut (Lituania, Reino Unido tras Brexit con régimen propio), N26 (Alemania), Wallester (Estonia) son entidades financieras sujetas a CRS en sus jurisdicciones. Si la titular es tu LLC y tú eres el **beneficiario efectivo** residente fiscal en España o LATAM, esos datos llegan a tu administración tributaria. Lo desarrollamos a fondo en los artículos dedicados a <a href="/es/blog/revolut-business-crs-reporting-fiscal">Revolut y CRS</a> y <a href="/es/blog/wise-business-crs-reporting-fiscal">Wise y CRS</a>.
3. **Tu LLC es probablemente una NFE pasiva (Passive NFE)**, salvo que demuestre actividad operativa real (más del 50% de sus ingresos son operativos y no rentas pasivas como dividendos, intereses; alquileres o royalties no asociados a explotación). En el caso típico de un freelancer con una Single-Member LLC que factura servicios, hay debate doctrinal: una interpretación literal del CRS la trataría como Active NFE (negocio operativo), pero la fintech europea típicamente la clasifica como Passive NFE por prudencia, lo que **obliga al reporte de los controlling persons**. Este matiz se le escapa a casi todo el mundo.
### Cómo se determina la residencia fiscal a efectos CRS

La entidad financiera aplica una **due diligence** (RD 1021/2015 y Anexo I del CRS) basada en autodeclaración del titular más indicios objetivos: dirección postal, número de teléfono, IP recurrente, NIF declarado, instrucción de transferencia repetida a cuentas en otro país, poderes otorgados a residentes en otro país.

Si tu autodeclaración dice "residencia fiscal en Andorra" pero tu IP, dirección de envío de tarjeta y giros recurrentes apuntan a Madrid, la entidad puede solicitar **documentación adicional** (certificado de residencia fiscal emitido por la autoridad tributaria competente, contrato de alquiler, etc.) o, en caso de duda, reportar a ambas jurisdicciones. Mentir en la autodeclaración CRS es una infracción tributaria en la mayoría de jurisdicciones y puede tener consecuencias penales si concurre con cuotas defraudadas relevantes (en España, art. 305 LGT y, según importe, art. 305 CP).
## Implicaciones reales en España (Modelos 720 y 721)

Si eres residente fiscal en España y tienes:

- **Cuentas en el extranjero** con saldo individual o conjunto > 50.000 € a 31 de diciembre o saldo medio del último trimestre: **Modelo 720** informativo (ver <a href="/es/blog/modelo-720-721-residentes-espana-cuentas-cripto-extranjero">guía completa del Modelo 720 y 721</a>), primera presentación en marzo del año siguiente; sucesivas, solo si hay variación de + 20.000 € en cualquier rúbrica.
- **Criptoactivos en el extranjero** por > 50.000 € a 31 de diciembre: **Modelo 721**.
- **Valores, derechos, seguros, rentas en el extranjero** > 50.000 €: Modelo 720, secciones correspondientes.

El cruce CRS permite a la AEAT detectar omisiones casi en tiempo real respecto al ejercicio reportado. La sentencia del Tribunal de Justicia de la UE C-788/19 (27 de enero de 2022) anuló el régimen sancionador desproporcionado original del 720 por contrario al Derecho de la Unión, pero la obligación de informar **sigue plenamente vigente** con sanciones ordinarias (LGT art. 198) y con el matiz de que las rentas no declaradas pueden ser regularizadas como ganancia patrimonial no justificada (LIRPF art. 39, en lo no afectado por la STJUE).
### Implicaciones reales en LATAM

- **México**: art. 32-A del CFF, RMF anual, cruce con declaración anual de personas físicas y morales. SAT mantiene programa específico de fiscalización de cuentas en el exterior detectadas por CRS.
- **Colombia**: la DIAN integra CRS en su sistema de información exógena. Cuentas omitidas pueden generar liquidación oficial por renta líquida gravable presuntiva.
- **Argentina**: AFIP recibe datos CRS y cruza con regímenes informativos propios. Régimen de exteriorización actualmente cerrado, por lo que la regularización es por declaración rectificativa con intereses y multa.
- **Chile**: SII recibe CRS y cruza con DJ 1929 (rentas en el exterior).
- **Uruguay y Panamá**: tradicionalmente jurisdicciones de planificación; ambos se han adherido al CRS y reportan saldos de no residentes.
## Cómo planificar correctamente

La conclusión técnica es la opuesta a la que mucho influencer dice: **una LLC americana bien estructurada con banca exclusivamente en Mercury/Relay (EE.UU.) tiene una huella CRS mínima**, porque EE.UU. no exporta datos por CRS. Pero en cuanto añades una capa europea (Wise, Revolut, Wallester, N26), aceptas que esa información llegue a tu hacienda. No es bueno ni malo: simplemente es así, y planificar requiere conocerlo.

La estrategia profesional pasa por:

1. **Declarar correctamente.** El cruce ya existe; intentar ocultar es perder tiempo y exponerse a sanciones.
2. **Diseñar la estructura para que lo declarado sea fiscalmente eficiente.** Esto implica decidir país de residencia, instrumentos de inversión, calendario de remesas, deducciones aplicables y CDI aplicable. Ver nuestro <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">framework de diseño de estructura internacional</a>.
3. **Mantener documentación**: contratos, facturas, justificantes de gastos, libros contables de la LLC, autodeclaraciones CRS coherentes. Sin documentación, una inspección revierte de facto la carga de la prueba al contribuyente.
4. **Conocer los riesgos de no hacerlo bien.** Lo cubrimos en <a href="/es/blog/riesgos-fiscales-mala-estructuracion-internacional">riesgos fiscales de una mala estructuración internacional</a>.
5. **Entender tu actividad económica.** No tributa igual una LLC de servicios que una de e-commerce o royalties. Lo desarrollamos en <a href="/es/blog/tributacion-llc-segun-actividad-economica">tributación de la LLC según tu actividad económica</a>.
## Errores típicos que vemos cada semana

- "Como Mercury está en EE.UU. no se entera nadie." Cierto para Mercury frente a CRS, pero falso para tus cuentas Wise/Revolut/Wallester/N26 a nombre de la misma LLC.
- "He puesto residencia fiscal en Andorra/Paraguay/Dubái pero sigo viviendo en España." La residencia fiscal no se elige; se determina por hechos (183 días, centro de intereses económicos, núcleo de intereses vitales, art. 9 LIRPF). Lo desarrollamos en nuestro artículo de <a href="/es/blog/nomada-digital-residencia-fiscal">residencia fiscal del nómada digital</a>.
- "Si mi LLC factura, no me pasa nada." La AEAT puede aplicar **transparencia fiscal internacional** (art. 100 LIS, aplicable a personas físicas vía art. 91 LIRPF) si tu LLC genera rentas pasivas y la sociedad está bajo tu control y en jurisdicción de baja tributación; aunque EE.UU. no es paraíso fiscal a estos efectos, una LLC pass-through puede activar la cláusula por la propia mecánica de Disregarded Entity. La planificación tiene que evitar ese supuesto, no ignorarlo.
- "Voy a poner la cuenta a nombre de un familiar." Es el clásico testaferro encubierto, cuyas implicaciones penales y fiscales analizamos en <a href="/es/blog/testaferros-prestanombres-llc-ilegal-riesgos">testaferros y prestanombres en LLCs</a>.
## En resumen

CRS no se "evita" desde una jurisdicción europea. Se planifica con conocimiento. Una LLC americana sigue siendo una herramienta extraordinariamente útil, pero el diseño de tu stack bancario y de tu residencia fiscal son determinantes para que la huella informativa que generas sea coherente con lo que declaras.

<!-- exentax:calc-cta-v1 -->
> <a href="/es/agendar">Consulta gratuita sin compromiso</a>
<!-- /exentax:calc-cta-v1 -->

¿Quieres que revisemos cómo te afecta CRS en tu caso concreto y diseñemos el stack adecuado? Agenda tu asesoría gratuita y lo analizamos contigo.
Si te ha quedado alguna duda sobre los matices de esta estructura, <a href="/es/blog/autonomos-espana-por-que-dejar-de-serlo">Por qué dejar de ser autónomo en España (y qué alternativas tienes)</a> explica en detalle un aspecto colindante que solemos dejar apuntado para otro día.

_Para ampliar en la misma serie: [empresa en Panamá: fiscalidad y residencia](/es/blog/empresa-panama-fiscalidad-residencia)._

<!-- related-inline-stripped-2026-04 -->

### Próximos pasos

Si quieres validar si esta estrategia encaja con tu situación concreta, en Exentax revisamos tu caso de forma personalizada y te proponemos la estructura legal y eficiente que realmente te conviene. Reserva una sesión inicial sin compromiso desde nuestra página de contacto.

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

<!-- exentax:legal-refs-v1 -->
## Referencias: marco legal y normativa

La argumentación de este artículo descansa en la siguiente normativa y doctrina, vigente actualmente:

- **España.** Ley 35/2006 del IRPF (arts. 8, 9 y 91 sobre residencia fiscal y transparencia fiscal internacional), Ley 27/2014 del Impuesto sobre Sociedades (art. 100 sobre TFI), Ley 58/2003 General Tributaria, Ley 5/2022 que reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 720) y Orden HFP/887/2023 (Modelo 721 de criptoactivos en el extranjero).
- **Doctrina administrativa.** Resoluciones del TEAC y consultas vinculantes de la DGT relativas a LLC unipersonales (entre otras V0443-08, V1631-17, V1147-22), interpretadas a la luz del BOE de febrero de 2020 sobre clasificación de entidades extranjeras transparentes.
- **Convenios y normativa internacional.** Convenio de Doble Imposición entre España y EE. UU. firmado en 1990 con Protocolo de 2013 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Convenio OCDE con sus Comentarios.
- **EE. UU.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa FBAR (31 CFR 1010.350).

Este contenido es divulgativo y no sustituye al asesoramiento personalizado para tu situación fiscal concreta.

<!-- exentax:execution-v2 -->
## Lo que CRS significa hoy para residentes en España y Latam

CRS funciona en piloto automático: 110+ jurisdicciones intercambian datos cada septiembre sobre saldos al 31 de diciembre del año anterior. Si eres residente fiscal en España, México, Colombia, Chile, Perú, Argentina o Uruguay, los bancos donde tienes cuentas en el extranjero ya están reportando o lo harán pronto. Esto es lo que importa entender, sin paranoia.

- **Lo que sí se reporta.** Saldos de cuenta a 31 de diciembre, ingresos brutos del año (intereses, dividendos), nombre del titular, residencia fiscal declarada al banco y, para entidades transparentes, datos del controlling person. La información llega al país de residencia y se cruza con la declaración fiscal del contribuyente.
- **Lo que no se reporta.** Movimientos detallados de la cuenta, contrapartes específicas, información transaccional. CRS es saldos + ingresos brutos + identificación; no es trazabilidad de cada operación. Esa percepción de "lo saben todo" es exagerada en su literalidad pero acertada en consecuencia: con saldos y rentas brutas se construye la presunción suficiente para abrir requerimiento.
- **España, Modelo 720 y Modelo 721.** El residente fiscal español tiene obligación propia de declarar cuentas en el extranjero (>50.000 € combinado, Modelo 720) y criptoactivos en el extranjero (>50.000 €, Modelo 721). No depende de CRS, depende de tu obligación. CRS solo ayuda a la AEAT a cruzar y detectar omisiones.
- **Latam - ritmos diferentes.** México (SAT) intercambia desde 2018 con cobertura extensa; Colombia (DIAN) desde 2017 con depuración progresiva; Chile (SII) desde 2018; Argentina (AFIP) desde 2018 pero con uso operativo aún en construcción; Uruguay activa pero con régimen tax-haven que matiza el flujo en doble sentido. La intensidad del uso del dato varía pero la disponibilidad ya es generalizada.

### Lo que más nos preguntan

**¿Si tengo Mercury en mi LLC, mi país lo sabe vía CRS?** No directamente: EE. UU. no participa en CRS. Lo que sí entra son las cuentas Wise (vía Bélgica) y, si la LLC operara desde un banco europeo o asiático, esos sí. Mercury queda fuera del flujo automático, no fuera de toda obligación declarativa.

**¿Cómo regularizo si llevo años sin declarar?** Con declaración complementaria del 720/721 antes de que llegue requerimiento. La STJUE C-788/19 limitó las multas españolas; se puede regularizar con coste mucho menor que hace 5 años. Lo evaluamos caso a caso.

En Exentax mapeamos qué cuentas tuyas entran en CRS, qué obligaciones declarativas dispara cada una y diseñamos el alta limpia o la regularización ordenada cuando aplica.
<!-- /exentax:execution-v2 -->

## Hablemos de tu estructura

Cada caso tiene matices: tu país de residencia, el tipo de actividad, dónde están tus clientes, si haces inversión o trading, si vendes a particulares o a empresas. En Exentax revisamos tu situación, diseñamos la estructura LLC que encaja contigo y te acompañamos cada año en el mantenimiento. Reserva una consulta con nuestro equipo y empezamos por entender tus números reales.

<!-- exentax:cross-refs-v1 -->
### Más lecturas relacionadas

- [Estructura offshore: beneficios reales y riesgos honestos](/es/blog/estructura-offshore-beneficios-riesgos)
- [De single-member a multi-member LLC: implicaciones fiscales reales antes de dar el paso](/es/blog/single-member-multi-member-llc-implicaciones-fiscales)
- [Exit Tax en España: impuesto de salida para inversores en cripto, LLC e Interactive Brokers](/es/blog/exit-tax-espana-llc-cripto-interactive-brokers)
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
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22crs%20residentes%20espana%20latam%20implicaciones%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

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
