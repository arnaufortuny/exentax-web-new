export default `

Cada cierto tiempo aparece una versión "definitiva" del intercambio automático de información fiscal y, con ella, la pregunta que más recibimos en Exentax: si la OCDE aprieta más el cerco con CRS 2.0 y CARF, ¿qué le pasa exactamente a una <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americana</a> propiedad de un europeo o un latinoamericano? La respuesta corta es que el cerco se cierra fuera de Estados Unidos, no dentro. La respuesta larga, que es la que importa, requiere entender por qué Washington no firmó el CRS original, por qué tampoco firmará la versión 2.0, y cómo eso afecta a tu estructura de hoy y a la planificación de los próximos años.

> **Pon números a tu caso.** La <a href="/es#calculadora">calculadora Exentax</a> compara tu carga actual con la que tendrías operando una LLC bien estructurada y declarada en tu país de residencia.

## Resumen ejecutivo

CRS 2.0 (la versión revisada del Common Reporting Standard de la OCDE) y CARF (Crypto-Asset Reporting Framework) amplían lo que los bancos y los exchanges declaran a las administraciones tributarias de los países adheridos. Más datos, más entidades obligadas y, sobre todo, más cripto dentro del perímetro. Estados Unidos no está en esa foto y nada en su política fiscal de la última década indica que vaya a estarlo: tiene su propio régimen, FATCA, que es bilateral y de salida, y captura billones de dólares de capital extranjero precisamente porque ofrece la única jurisdicción importante fuera del CRS. Para el dueño no residente de una LLC, esto no es un atajo para "esconder" nada; es un dato técnico que cambia el diseño del stack bancario, la elección del estado y la coherencia con la declaración en residencia.

## CRS original: qué se intentó arreglar y por qué se quedó corto

El **Common Reporting Standard** lo aprobó el Consejo de la OCDE como respuesta política al G20 tras la crisis financiera y los escándalos de evasión fiscal de la década pasada (LuxLeaks, SwissLeaks, Panama Papers). Se importó la mecánica de FATCA, que ya funcionaba unilateralmente para Estados Unidos, y se generalizó a más de 110 jurisdicciones bajo un Multilateral Competent Authority Agreement (MCAA) que activa los flujos bilateralmente entre cada par de países adheridos.

El estándar exige que cada **Reporting Financial Institution** (banco, broker, fintech con licencia bancaria, fondo de inversión, compañía de seguros con productos de inversión) identifique al titular cuya residencia fiscal sea distinta a la de la cuenta y reporte:

- Datos del titular: nombre, dirección, país de residencia fiscal, NIF/TIN, fecha y lugar de nacimiento.
- Datos de la entidad: nombre, NIF, país. En cuentas titularidad de **NFE pasivas**, también los datos de los **beneficiarios efectivos** controlantes.
- Datos de la cuenta: número, nombre y código identificativo de la institución financiera.
- Saldos y rendimientos: saldo a cierre del año natural, intereses brutos, dividendos brutos y, en cuentas de custodia, ingresos brutos por venta o reembolso de activos financieros.

Este flujo se envía cada año, normalmente en septiembre del año siguiente al ejercicio reportado, y se cruza con la declaración del contribuyente en el país de residencia. En España, el Real Decreto 1021/2015 y la Orden HAP/1695/2016 ya regulan el **Modelo 289**, que es la pieza que articula CRS dentro de la AEAT. Lo desarrollamos a fondo en nuestra guía sobre <a href="/es/blog/crs-residentes-espana-latam-implicaciones">CRS para residentes en España y LATAM</a>, que es el complemento natural de este artículo.

El problema, visto desde la OCDE, fue que CRS 1.0 dejaba huecos importantes: los **e-money institutions** y las **EMIs** quedaban en zona gris según la jurisdicción; los **monederos cripto** y los **exchanges** estaban completamente fuera; los **vehículos de inversión** sin custodia tradicional escapaban de la categorización; y la diligencia debida sobre los **controlling persons** de NFE pasivas era heterogénea, con interpretaciones laxas en algunas plazas. La presión política para cerrar esos huecos venía especialmente de la Comisión Europea y de Alemania, que querían un perímetro más estricto antes de que el dinero rotara hacia formatos no cubiertos.

## CRS 2.0 y CARF: el nuevo paquete de la OCDE

La OCDE aprobó en bloque dos piezas que conviene leer juntas. La primera es la revisión integral del Common Reporting Standard, conocida informalmente como **CRS 2.0**. La segunda es el **Crypto-Asset Reporting Framework (CARF)**, que extiende la lógica de intercambio automático al universo cripto. Ambas se publicaron como un paquete único y se han ido transponiendo en la UE mediante la **Directiva DAC8** (DAC8 modifica la 2011/16/UE para dar entrada a CARF y a las novedades del CRS revisado). Profundizamos en la pieza europea en nuestro artículo sobre <a href="/es/blog/dac8-criptomonedas-reporting-fiscal-2026">DAC8 y reporting de criptomonedas</a>.

Las novedades operativas más relevantes son:

1. **Ampliación del perímetro a EMIs y específicamente a productos de dinero electrónico**, neobancos sin licencia bancaria plena y monederos digitales que ofrezcan servicios análogos a depósitos.
2. **Incorporación de las criptomonedas y stablecoins** al ámbito reportable cuando el prestador de servicios cripto tiene presencia en una jurisdicción adherida (CARF). Eso barre exchanges, custodios, plataformas de derivados cripto y proveedores de DeFi con elemento centralizado.
3. **Refuerzo de la due diligence sobre controlling persons** de NFE pasivas: más documentación, menos margen interpretativo, autodeclaraciones con mayor granularidad.
4. **Endurecimiento del tratamiento de cuentas indistintas**, fideicomisos y vehículos opacos: si hay duda razonable sobre la residencia fiscal de la persona controlante, el reporte se duplica a varias jurisdicciones por defecto en lugar de elegir una.
5. **Plazos de adopción y revisión periódica**: CARF entra en vigor por oleadas en función del calendario de transposición de cada jurisdicción, con la mayoría de países UE arrancando primero y el resto del G20 siguiendo a continuación.

Para el residente fiscal en España o en cualquier país LATAM adherido, la consecuencia práctica es clara: la mayor parte del dinero que mueves a través de fintech europeas o de exchanges con sede en jurisdicciones adheridas pasa a estar dentro del perímetro de información automática hacia tu hacienda. Lo que antes se consideraba "no reportado por defecto" pasa a ser excepcional.

## Por qué EE. UU. no firmará el CRS (la versión sin marketing)

Esta es la parte que más confusión genera y que en Exentax repetimos cada semana. Estados Unidos no firmó el CRS original y no firmará el CRS 2.0 por una razón estructural, no por un descuido administrativo. Hay que mirar tres factores combinados para entenderlo:

- **Ya tiene FATCA y no necesita el CRS.** El **Foreign Account Tax Compliance Act** se aprobó como parte del HIRE Act y obliga a las instituciones financieras extranjeras a identificar y reportar al IRS cuentas de **US persons** (ciudadanos, residentes fiscales y entidades estadounidenses). Es un régimen **bilateral** articulado mediante **Intergovernmental Agreements (IGAs)** Modelo 1 (intercambio recíproco a través del fisco local) y Modelo 2 (reporte directo de la institución financiera al IRS). La reciprocidad real, sin embargo, es muy limitada: en la práctica, el IRS recibe de los bancos extranjeros muchísimos más datos de los que devuelve a las autoridades extranjeras sobre cuentas de no residentes en EE. UU. — una asimetría que desplegamos paso a paso en nuestra <a href="/es/abrir-llc-estados-unidos">guía oficial para abrir LLC en Estados Unidos</a>. Adoptar CRS supondría aceptar reciprocidad multilateral plena, que es justo lo que el Congreso ha bloqueado durante toda la última década, sin distinción de mayoría política.
- **Le interesa ser la jurisdicción "no CRS" del mundo.** Por convergencia de incentivos, Estados Unidos se ha convertido en el destino preferente para capital extranjero que busca el **mayor mercado financiero del planeta** combinado con un perímetro de intercambio automático mucho más estrecho que el europeo. Estimaciones de organizaciones como el Tax Justice Network sitúan en varios billones de dólares el saldo de capital extranjero alojado en el sistema financiero estadounidense que no se reporta automáticamente por CRS. Buena parte fluye a través de **trusts**, **LLCs** transparentes y cuentas de banca privada en Delaware, Nevada, Wyoming, Dakota del Sur o Florida. Para Washington, ceder esa posición a cambio de una ganancia recaudatoria marginal es un mal negocio.
- **El coste político interno es prohibitivo.** Una adopción del CRS exigiría legislación federal nueva, modificaciones del Internal Revenue Code, ampliación del **Form 1099** y del régimen de identificación de cuentas, y un cambio doctrinal en el tratamiento de Single-Member LLCs como Disregarded Entities con beneficiarios efectivos extranjeros. Hay grupos de interés muy potentes (banca, registros estatales, lobby de servicios fiduciarios) que llevan años bloqueando esa agenda y que seguirán haciéndolo.

La conclusión técnica, sin maximalismos, es que **la asimetría FATCA vs CRS es el mecanismo central, no un accidente histórico**. Cualquier planificación profesional que parta de "EE. UU. acabará entrando en CRS pronto" parte de una premisa que Washington ha rechazado de forma consistente.

## Cómo gana EE. UU. teniendo LLCs de no residentes en cartera

A primera vista, el modelo parece contraintuitivo. Si el IRS no cobra impuesto federal sobre los beneficios de una **LLC pass-through** propiedad de no residente sin ECI (Effectively Connected Income) dentro de territorio estadounidense, ¿qué saca EE. UU. de tener cientos de miles de LLCs extranjeras en sus registros? La respuesta tiene tres capas:

- **Tasas estatales de constitución y mantenimiento**, que son recurrentes y altamente eficientes. Delaware, por ejemplo, percibe cada año una **Annual Franchise Tax** de las LLCs constituidas en su jurisdicción; multiplicado por cientos de miles de entidades activas, supone una de las primeras fuentes de ingresos no tributarios del estado. Wyoming, Nuevo México, Florida y Nevada compiten en distintos formatos de fees recurrentes (annual report, registered agent, business license) que financian buena parte de sus presupuestos. Lo desarrollamos en <a href="/es/blog/nuevo-mexico-vs-wyoming-vs-delaware">Nuevo México vs Wyoming vs Delaware</a>.
- **Captación de capital extranjero al sistema financiero**. Los neobancos americanos (Mercury, Relay), los grandes bancos comerciales y los brokers retail viven en parte de los depósitos y operativa de no residentes que constituyen LLCs para vehiculizar negocios digitales y carteras de inversión. Ese capital se queda dentro del sistema americano, genera margen para las entidades, y multiplica liquidez para el conjunto de la economía estadounidense.
- **Imposición indirecta vía IRS Forms 5472 + 1120 sin recaudación pero con datos**. Aunque la LLC pass-through de un no residente típicamente no pague federal, **sí está obligada** a presentar el Form 5472 con el Form 1120 pro-forma cada año (Treas. Reg. §1.6038A-2). El IRS recibe así un mapa muy completo de **reportable transactions** entre la LLC y su único miembro extranjero, datos que usa con fines de inteligencia tributaria y de coordinación con autoridades extranjeras cuando hay un acuerdo bilateral concreto. Te explicamos esa mecánica en <a href="/es/blog/form-5472-que-es-como-presentarlo">Form 5472, qué es y cómo presentarlo</a>.

Sumadas las tres capas, la matemática para Washington es muy positiva: poco coste recaudatorio directo, ingresos estatales constantes, capital extranjero en el sistema, y un perímetro de inteligencia que el IRS controla en todo momento. No hay incentivo para romper ese equilibrio adhiriéndose al CRS y empujando ese capital hacia jurisdicciones competidoras.

## Qué significa todo esto para tu LLC y tu estructura

Aterrizamos lo anterior en decisiones concretas que tomamos cada semana con clientes de Exentax. La fotografía operativa, en orden de importancia:

- **Tu LLC sigue siendo una herramienta válida y declarable**. Que EE. UU. esté fuera del CRS no la convierte en una "estructura opaca" desde el punto de vista de tu hacienda de residencia. Tienes obligaciones declarativas propias (en España, IRPF + Modelo 720 + Modelo 721 si aplica; en LATAM, los regímenes equivalentes) que no dependen del CRS. Lo que cambia es el flujo automático, no tu obligación.
- **El stack bancario es el factor decisivo**. Si trabajas exclusivamente con cuentas en EE. UU. (Mercury, Relay, banca regional) a nombre de la LLC, la huella CRS hacia tu hacienda es prácticamente nula. En cuanto incorporas una capa europea (Wise Business, Revolut Business europeo, N26, Wallester, Payoneer Europe), aceptas que esa información llegue a tu administración tributaria. No es bueno ni malo: es información que tu planificación debe incorporar para que lo declarado y lo reportado coincidan. Lo desarrollamos en <a href="/es/blog/cuentas-bancarias-usa-reportan-hacienda-verdad">qué reporta cada banco a tu hacienda</a>.
- **Cripto cambia de regla con CARF**. Si manejas saldos relevantes en exchanges con sede europea o en jurisdicciones adheridas, asume que tu autoridad fiscal recibirá esa información de forma automática en breve plazo. La planificación pre-CARF y post-CARF no es la misma. Repasamos el detalle en <a href="/es/blog/dac8-criptomonedas-reporting-fiscal-2026">DAC8 y criptomonedas</a> y en <a href="/es/blog/modelo-720-721-residentes-espana-cuentas-cripto-extranjero">Modelo 720 y 721 sobre cuentas y cripto en el extranjero</a>.
- **El estado de constitución importa por motivos no fiscales**, pero sí operativos. Wyoming y Nuevo México siguen ganando para perfiles de freelancer y servicios; Delaware sigue ganando para SaaS con vocación de levantar capital o para holdings; Florida tiene encaje claro para residentes hispanos en EE. UU. con nexus físico. Ninguna decisión depende del CRS, todas dependen de cómo encaja tu actividad y banca con la jurisdicción. Lo abordamos en <a href="/es/blog/llc-alternativa-autonomo-espana">LLC como alternativa al autónomo en España</a> y en <a href="/es/blog/autonomo-espana-vs-llc-estados-unidos">autónomo vs LLC</a>.
- **Residencia fiscal del titular como variable maestra**. La residencia no se elige, se determina por hechos (días de presencia, centro de intereses económicos, núcleo familiar). Pretender ocultar la residencia real al amparo de la asimetría FATCA-CRS es, además de un error técnico, una infracción tipificada en la mayoría de jurisdicciones europeas y latinoamericanas con sanciones severas. Cualquier diseño profesional parte de la residencia real y diseña la estructura encima.

<!-- exentax:calc-cta-v1 -->
> <a href="/es/agendar">Consulta gratuita sin compromiso</a>
<!-- /exentax:calc-cta-v1 -->

## Errores típicos que vemos cada semana

- "Como mi LLC tiene cuenta solo en Mercury, mi hacienda no se entera de nada." Cierto en cuanto al canal automático CRS, falso en cuanto a obligación. Tu Modelo 720 (si aplica) debe declararla igualmente.
- "Voy a usar Revolut Business porque es más cómoda y como es europea no entra en CRS." Mezcla de errores. Revolut europea sí está en CRS y la apertura para LLC americana no siempre genera IBAN europeo: depende del régimen al que te asigne Revolut. Lo desglosamos en <a href="/es/blog/revolut-business-crs-reporting-fiscal">Revolut Business y CRS</a>.
- "CARF no me afecta porque uso un exchange offshore." Si ese exchange tiene clientes europeos y opera bajo licencia europea o tiene presencia comercial en una jurisdicción adherida, sí te afecta. CARF no mira la sede formal sino la actividad y el cliente.
- "Voy a poner la LLC a nombre de un tercero para que no me identifiquen." Es testaferro encubierto. Tiene consecuencias penales y fiscales muy serias, las recopilamos en <a href="/es/blog/testaferros-prestanombres-llc-ilegal-riesgos">testaferros y prestanombres en LLCs</a>.
- "Estados Unidos firmará el CRS pronto, así que mejor cerrar la LLC antes." Premisa falsa según la trayectoria política observada. La planificación basada en una hipótesis que no se cumple genera regularizaciones forzadas y ventas precipitadas.

<!-- exentax:execution-v2 -->
## El método Exentax: cómo abordamos esta planificación

CRS 2.0 y CARF no son una crisis para una LLC bien estructurada; son un cambio de perímetro que se incorpora al diagnóstico inicial y al mantenimiento anual. El método Exentax aplica tres bloques en orden y deja registro de cada paso para que la decisión sea defensible si llega cualquier inspección.

- **Diagnóstico CRS y CARF de tu situación actual.** Mapeamos cada cuenta a tu nombre y a nombre de la LLC, identificamos qué entidades reportan a qué jurisdicción y cruzamos esa fotografía con tus declaraciones de los últimos ejercicios. El objetivo es detectar discordancias antes de que las detecte la administración.
- **Diseño del stack alineado con tu residencia.** Decidimos el banco principal (Mercury o Relay), las pasarelas, las cuentas multi-divisa y, si aplica, el exchange cripto coherente con tu volumen y país. La regla es que cada pieza tenga sentido fiscal y operativo, no que llene huecos del organigrama.
- **Calendario único de obligaciones.** Annual Report estatal, Form 5472 + 1120, BOI Report, declaración fiscal en residencia (IRPF, IS o equivalente LATAM), Modelo 720 y 721 cuando aplican, todo en una sola hoja con avisos previos para que no se nos escape nada.

Para aplicar este método a tu caso, abre la <a href="/es#calculadora">calculadora Exentax</a> o reserva treinta minutos con el equipo: salimos de la llamada con un diagnóstico claro y, si toca, un calendario de regularización ordenada sin compromiso.
<!-- /exentax:execution-v2 -->

## Preguntas frecuentes

**¿CRS 2.0 obliga a EE. UU. a algo?** No. CRS 2.0 es un estándar de la OCDE adoptado por las jurisdicciones adheridas. EE. UU. no es jurisdicción CRS y mantiene FATCA como su propio régimen.

**¿Si abro una LLC ahora, dentro de unos años seguirá fuera del CRS?** La trayectoria política y económica indica que sí, por las razones estructurales explicadas. No es un compromiso jurídico de Washington, pero es la lectura más sólida de su política fiscal sostenida durante toda la última década.

**¿Mi LLC tiene que reportar algo a mi país por CRS?** Tu LLC, como entidad estadounidense, no es Reporting Financial Institution para CRS. Quien reporta son los bancos y fintech donde tenga cuentas, según la jurisdicción de cada cuenta. El reporte automático es de la institución financiera, no de la LLC.

**¿El IRS comparte información con mi hacienda sobre mi LLC?** Solo si existe un acuerdo bilateral concreto y la solicitud cumple los requisitos formales (intercambio bajo CDI, IGAs FATCA con reciprocidad real, cooperación administrativa específica). No hay un flujo automático equivalente al CRS, pero no es imposible para casos individuales debidamente motivados.

**¿Puedo usar mi LLC para invertir en Europa sin que mi hacienda se entere?** No. Si la cuenta de inversión está en una entidad europea, esa entidad reporta por CRS al país de residencia del beneficiario efectivo. La opacidad de la LLC americana se diluye en el primer banco europeo del recorrido.

**¿Cuándo se notará CARF en la práctica?** Las primeras oleadas de reporte CARF van llegando ya según la transposición de cada país. La regla general es asumir que cualquier exchange con sede o licencia en jurisdicción CARF reportará tus saldos al país de residencia que conste en tu autodeclaración.

## Hablemos de tu caso

Cada estructura tiene matices: el país de residencia, el tipo de actividad, la presencia o no de cripto, el volumen, la edad de la LLC, las obligaciones acumuladas. En Exentax revisamos tu situación, dimensionamos la exposición real a CRS 2.0 y CARF, y diseñamos la estructura LLC y el stack bancario que encajan contigo. Te acompañamos cada año en el mantenimiento para que el calendario y las declaraciones permanezcan coherentes con la realidad de tu negocio.


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

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->
`;
