export default `El Common Reporting Standard (CRS) es la pieza más importante de la fiscalidad internacional de la última década, y muy poca gente entiende qué significa para alguien que tiene una <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americana</a> o cuentas fuera de su país de residencia. Vamos a desmontar el tema con precisión técnica y sin alarmismos.

  ## Qué es el CRS y por qué existe

  El **Common Reporting Standard** lo aprobó el Consejo de la OCDE en julio de 2014 como respuesta al G20 tras la crisis financiera y los escándalos de evasión fiscal (LuxLeaks, Panama Papers). El objetivo: que las administraciones tributarias de los países adheridos intercambien automáticamente información sobre cuentas financieras de no residentes.

  A nivel técnico, CRS es la generalización a más de 100 jurisdicciones del modelo previo (FATCA), pero con alcance multilateral en lugar de bilateral. España lo transpuso mediante el Real Decreto 1021/2015 y la Orden HAP/1695/2016, que regulan el **Modelo 289** (declaración informativa anual de cuentas financieras de no residentes que las entidades financieras españolas remiten a la AEAT, recibida en sentido inverso desde otros países adheridos).

  En América Latina lo han implementado, entre otros: México (desde 2017), Argentina, Colombia, Chile, Brasil, Uruguay, Panamá, Perú, Costa Rica, Ecuador y República Dominicana. Estados Unidos, importante: **no está adherido al CRS**. Tiene su propio sistema (FATCA) que es bilateral y solo de salida, no de entrada. Profundizamos en esto en nuestro artículo sobre <a href="/es/blog/cuentas-bancarias-usa-reportan-hacienda-verdad">si las cuentas bancarias en EE.UU. reportan a tu hacienda</a>.

  ## Marco normativo

  - **OCDE**: Common Reporting Standard, julio 2014. Estándar Común de Comunicación de Información (ECCI/CRS), texto consolidado y comentarios oficiales.
  - **UE**: Directiva 2011/16/UE de cooperación administrativa (DAC), modificada por la DAC2 (Directiva 2014/107/UE) que incorpora el CRS al derecho de la Unión.
  - **España**: Real Decreto 1021/2015, Orden HAP/1695/2016, Orden HAC/3625/2003 (Modelo 720), Orden HFP/886/2023 (Modelo 721 sobre criptoactivos en el extranjero).
  - **OCDE Multilateral Competent Authority Agreement (MCAA)**: el instrumento por el que cada país activa el intercambio bilateral con cada uno de los demás. España tiene activado el intercambio con prácticamente toda la UE y con la mayor parte de jurisdicciones adheridas.

  ## Qué información se reporta exactamente

  Cada **Reporting Financial Institution** (banco, broker, fintech con licencia bancaria, fondo de inversión, compañía de seguros con productos de inversión) que detecte un titular cuya residencia fiscal sea distinta del país donde está la cuenta debe reportar:

  | Categoría | Detalle |
  | --- | --- |
  | Datos del titular | Nombre, dirección, país de residencia fiscal, NIF/TIN, fecha y lugar de nacimiento (personas físicas) |
  | Datos de la entidad | Nombre, NIF, país. En cuentas titularidad de **NFE pasivas**, también los datos de los **beneficiarios efectivos** controlantes |
  | Datos de la cuenta | Número de cuenta, nombre y número identificativo de la institución financiera |
  | Saldos | Saldo o valor a cierre del año natural (o al cierre de la cuenta si se canceló durante el año) |
  | Rendimientos | Intereses brutos, dividendos brutos, otros ingresos generados, ingresos brutos por venta o reembolso de activos financieros (cuentas de custodia) |

  Este flujo se envía cada año, normalmente entre mayo y septiembre del año siguiente al ejercicio reportado, y se cruza con las declaraciones del contribuyente (en España: IRPF, Modelo 720 y, desde 2024, Modelo 721 para criptoactivos).

  ## Qué pasa con tu LLC americana: el matiz que casi nadie explica

  Aquí es donde aparecen los malentendidos. Vamos a fijar conceptos:

  1. **EE.UU. no envía datos por CRS.** Por tanto, ni Mercury, ni Relay, ni un banco regional americano enviarán datos directamente a la AEAT, SAT, DIAN o AFIP por CRS. Lo que sí hace EE.UU. es FATCA, que es **unilateral de salida**: pide datos a entidades extranjeras sobre cuentas de US persons, pero no envía datos equivalentes en sentido inverso de forma automática (sí lo hace en algunos casos a través de IGAs Modelo 1, pero el alcance es muy inferior a CRS).
  2. **Tus cuentas en fintech europeas a nombre de la LLC SÍ se reportan.** Wise (Bélgica), Revolut (Lituania, Reino Unido tras Brexit con régimen propio), N26 (Alemania), Wallester (Estonia) son entidades financieras sujetas a CRS en sus jurisdicciones. Si la titular es tu LLC y tú eres el **beneficiario efectivo** residente fiscal en España o LATAM, esos datos llegan a tu administración tributaria. Lo desarrollamos a fondo en los artículos dedicados a <a href="/es/blog/revolut-business-crs-reporting-fiscal">Revolut y CRS</a> y <a href="/es/blog/wise-business-crs-reporting-fiscal">Wise y CRS</a>.
  3. **Tu LLC es probablemente una NFE pasiva (Passive NFE)**, salvo que demuestre actividad operativa real (más del 50% de sus ingresos son operativos y no rentas pasivas como dividendos, intereses, alquileres o royalties no asociados a explotación). En el caso típico de un freelancer con una Single-Member LLC que factura servicios, hay debate doctrinal: una interpretación literal del CRS la trataría como Active NFE (negocio operativo), pero la fintech europea típicamente la clasifica como Passive NFE por prudencia, lo que **obliga al reporte de los controlling persons**. Este matiz se le escapa a casi todo el mundo.

  ## Cómo se determina la residencia fiscal a efectos CRS

  La entidad financiera aplica una **due diligence** (RD 1021/2015 y Anexo I del CRS) basada en autodeclaración del titular más indicios objetivos: dirección postal, número de teléfono, IP recurrente, NIF declarado, instrucción de transferencia repetida a cuentas en otro país, poderes otorgados a residentes en otro país.

  Si tu autodeclaración dice "residencia fiscal en Andorra" pero tu IP, dirección de envío de tarjeta y giros recurrentes apuntan a Madrid, la entidad puede solicitar **documentación adicional** (certificado de residencia fiscal emitido por la autoridad tributaria competente, contrato de alquiler, etc.) o, en caso de duda, reportar a ambas jurisdicciones. Mentir en la autodeclaración CRS es una infracción tributaria en la mayoría de jurisdicciones y puede tener consecuencias penales si concurre con cuotas defraudadas relevantes (en España, art. 305 LGT y, según importe, art. 305 CP).

  ## Implicaciones reales en España (Modelos 720 y 721)

  Si eres residente fiscal en España y tienes:

  - **Cuentas en el extranjero** con saldo individual o conjunto > 50.000 € a 31 de diciembre o saldo medio del último trimestre: **Modelo 720** informativo, primera presentación en marzo del año siguiente; sucesivas, solo si hay variación de + 20.000 € en cualquier rúbrica.
  - **Criptoactivos en el extranjero** por > 50.000 € a 31 de diciembre: **Modelo 721**.
  - **Valores, derechos, seguros, rentas en el extranjero** > 50.000 €: Modelo 720, secciones correspondientes.

  El cruce CRS permite a la AEAT detectar omisiones casi en tiempo real respecto al ejercicio reportado. La sentencia del Tribunal de Justicia de la UE C-788/19 (27 de enero de 2022) anuló el régimen sancionador desproporcionado original del 720 por contrario al Derecho de la Unión, pero la obligación de informar **sigue plenamente vigente** con sanciones ordinarias (LGT art. 198) y con el matiz de que las rentas no declaradas pueden ser regularizadas como ganancia patrimonial no justificada (LIRPF art. 39, en lo no afectado por la STJUE).

  ## Implicaciones reales en LATAM

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

  - "Como Mercury está en EE.UU., no se entera nadie." Cierto para Mercury frente a CRS, pero falso para tus cuentas Wise/Revolut/Wallester/N26 a nombre de la misma LLC.
  - "He puesto residencia fiscal en Andorra/Paraguay/Dubái pero sigo viviendo en España." La residencia fiscal no se elige; se determina por hechos (183 días, centro de intereses económicos, núcleo de intereses vitales, art. 9 LIRPF). Lo desarrollamos en nuestro artículo de <a href="/es/blog/nomada-digital-residencia-fiscal">residencia fiscal del nómada digital</a>.
  - "Si mi LLC factura, no me pasa nada." La AEAT puede aplicar **transparencia fiscal internacional** (art. 100 LIS, aplicable a personas físicas vía art. 91 LIRPF) si tu LLC genera rentas pasivas y la sociedad está bajo tu control y en jurisdicción de baja tributación; aunque EE.UU. no es paraíso fiscal a estos efectos, una LLC pass-through puede activar la cláusula por la propia mecánica de Disregarded Entity. La planificación tiene que evitar ese supuesto, no ignorarlo.
  - "Voy a poner la cuenta a nombre de un familiar." Es el clásico testaferro encubierto, cuyas implicaciones penales y fiscales analizamos en <a href="/es/blog/testaferros-prestanombres-llc-ilegal-riesgos">testaferros y prestanombres en LLCs</a>.

  ## En resumen

  CRS no se "evita" desde una jurisdicción europea. Se planifica con conocimiento. Una LLC americana sigue siendo una herramienta extraordinariamente útil, pero el diseño de tu stack bancario y de tu residencia fiscal son determinantes para que la huella informativa que generas sea coherente con lo que declaras.

  ¿Quieres que revisemos cómo te afecta CRS en tu caso concreto y diseñemos el stack adecuado? Agenda tu asesoría gratuita y lo analizamos contigo.

Si te ha quedado alguna duda sobre los matices de esta estructura, <a href="/es/blog/autonomos-espana-por-que-dejar-de-serlo">Por qué dejar de ser autónomo en España (y qué alternativas tienes)</a> explica en detalle un aspecto colindante que solemos dejar apuntado para otro día.
`;
