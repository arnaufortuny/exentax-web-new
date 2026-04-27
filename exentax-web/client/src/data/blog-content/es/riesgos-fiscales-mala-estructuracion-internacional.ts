export default `

Una estructura internacional bien diseñada es una herramienta extraordinaria. Una mal diseñada es una bomba de relojería que estalla cuando menos te lo esperas, normalmente con un requerimiento de la AEAT, SAT, DIAN o AFIP que te pide explicar todo lo que has hecho los últimos cuatro años. En Exentax vemos casos cada semana, y los problemas se repiten. Te contamos los seis riesgos principales y cómo evitarlos.

## Riesgo 1: Simulación

La **simulación** está regulada en el art. 16 de la Ley General Tributaria española y tiene equivalentes en todos los ordenamientos LATAM (México: art. 5-A CFF, Colombia: art. 869 ET, Argentina: art. 2 Ley 11.683).

Hay simulación cuando los actos o negocios celebrados son aparentes y no responden a la realidad de la operación. Aplicado a estructuras internacionales: si interpones una <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americana</a> entre tú y tus clientes pero la actividad la sigues prestando tú materialmente desde España (mismo equipo, mismo domicilio, mismas decisiones), la AEAT puede declarar la simulación y atribuirte directamente las rentas como persona física.

**Consecuencia**: regularización por todos los ejercicios no prescritos (4 años en España, 5 en México, 5 en Colombia) + intereses de demora + sanción del 50-150% (art. 191-195 LGT) + posible delito fiscal si la cuota defraudada por ejercicio supera 120.000 € (art. 305 CP).

**Cómo evitarlo**: dotar a la LLC de **sustancia** real (decisión, operativa, infraestructura) o asumir desde el inicio que la LLC es una herramienta complementaria, no una fachada. Lo desarrollamos en <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">diseño de estructura internacional sólida</a>.
## Riesgo 2: Transparencia Fiscal Internacional (TFI / CFC)

La **transparencia fiscal internacional** está regulada en España en el art. 100 de la Ley del Impuesto sobre Sociedades, aplicable a personas físicas vía art. 91 LIRPF. En LATAM, regímenes equivalentes en México (art. 176 LISR), Colombia (régimen ECE), Argentina (régimen ECNR) y Chile (rentas pasivas del art. 41 G LIR).

La TFI se activa cuando se cumplen tres condiciones acumuladas:

1. **Control**: el contribuyente tiene una participación, directa o indirecta, igual o superior al 50% en la entidad no residente (umbrales pueden variar; para personas físicas y entidades vinculadas, también).
2. **Baja tributación**: la tributación efectiva de la entidad no residente es inferior al 75% de la que correspondería en España (en el caso típico de Disregarded Entity con 0$ federal pagado, se cumple).
3. **Naturaleza de la renta**: la entidad obtiene principalmente rentas pasivas (intereses, dividendos, royalties, ganancias mobiliarias, alquileres no afectos) o rentas de servicios prestados a entidades vinculadas residentes.

Si se activa, las rentas se imputan al socio en España como si las hubiera obtenido directamente, perdiendo la ventaja fiscal de la estructura. La deducción por doble imposición es testimonial porque la LLC normalmente no paga impuesto americano.

**Cómo evitarlo**: si la actividad es operativa (servicios, e-commerce activo, SaaS con desarrollo continuado), normalmente no se activa por el filtro de naturaleza. Si es renta pasiva, hay que rediseñar (ver <a href="/es/blog/tributacion-llc-segun-actividad-economica">tributación LLC según actividad</a>).
## Riesgo 3: Residencia fiscal ficticia

Es el más común. El contribuyente "se cambia" la residencia fiscal a Andorra, Paraguay, Dubái o Cabo Verde, pero **sigue viviendo materialmente en España**. La residencia fiscal en España (art. 9 LIRPF) se determina por hechos:

- Permanencia: > 183 días al año en territorio español (no es necesario que sean consecutivos; las ausencias esporádicas computan a favor de la permanencia salvo prueba en contrario).
- Centro de intereses económicos: que la base principal o núcleo de tus actividades empresariales o intereses económicos esté en España.
- Cónyuge no separado y/o hijos menores que residan en España: presunción iuris tantum de residencia.

La AEAT cruza datos: padrón municipal, IRPF anteriores, comunicaciones de cambio de domicilio, datos bancarios CRS, datos DAC7, vehículos a tu nombre, escuelas de los hijos, gimnasio, médico, propiedades inmobiliarias.

**Consecuencia**: si la AEAT declara que sigues siendo residente fiscal español, **toda tu renta mundial** vuelve a tributar en España, con regularización completa, intereses, sanciones y posible delito.

**Cómo evitarlo**: si te cambias de residencia, hazlo de verdad (más de 183 días fuera, sin centro de intereses en España; con certificado de residencia fiscal del nuevo país). Lo desarrollamos en <a href="/es/blog/nomada-digital-residencia-fiscal">residencia fiscal del nómada digital</a>.
### Riesgo 4: Establecimiento permanente (EP) oculto

Si tu LLC americana opera materialmente desde España (oficina, representante con poderes, lugar fijo de negocio), puede constituir un **establecimiento permanente** en España (art. 13 LIRNR y art. 5 CDI España-EE.UU.). En tal caso:

- La LLC tributa por el Impuesto sobre la Renta de No Residentes (IRNR) por las rentas atribuibles al EP, con tipo del 25% (Impuesto sobre Sociedades aplicable al EP).
- Las cuentas se llevan separadamente y se documentan precios de transferencia con la matriz.
- Sanciones por no haber declarado el EP en su momento.

**Cómo evitarlo**: si la actividad se desarrolla esencialmente en España, plantearse si la LLC es la estructura adecuada o si conviene una S.L. española como entidad operativa. Análisis en <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">diseño de estructura internacional sólida</a>.
## Riesgo 5: Treaty shopping y abuso del CDI

El **Protocolo modificativo del CDI España-EE.UU.** firmado en 2013 y en vigor desde el 27 de noviembre de 2019 (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 23-10-2019) introdujo la cláusula de **Limitation on Benefits (LOB)**, que restringe el acceso a los beneficios del Convenio a las personas y entidades que cumplen determinados requisitos de sustancia y conexión real con uno de los Estados contratantes.

Una LLC americana cuyo único socio es residente español y cuya actividad real se localiza en España difícilmente cumple los tests LOB del Protocolo. Adicionalmente, la cláusula de **Principal Purpose Test (PPT)** (art. 7 BEPS, MLI) permite denegar beneficios cuando uno de los principales propósitos de la operación es obtener el beneficio convencional.

**Consecuencia**: la AEAT puede denegar la aplicación del CDI, lo que en el caso de la LLC Disregarded suele ser irrelevante porque ya tributas en España, pero sí afecta a estructuras más complejas (LLC + Holding + entidad operativa).
### Riesgo 6: Delito fiscal

En España, el delito fiscal del art. 305 CP se activa cuando la cuota defraudada por ejercicio fiscal supera **120.000 €** (240.000 € si la administración perjudicada es la UE). Equivalentes en LATAM con umbrales propios.

Una estructura mal diseñada con varios años de impagos puede acumular cuotas que crucen ese umbral con relativa facilidad: si tu actividad genera 200.000 € anuales y deberías haber tributado al 47% pero declaraste al 0%, en dos años cruzas el umbral y entras en el ámbito penal.

Penas: de 1 a 5 años de prisión y multa del 100% al 600% de la cuota defraudada. Tipo agravado (de 2 a 6 años) cuando la cuota supera 600.000 €, hay estructura organizada o se utilizan paraísos fiscales.

**Cómo evitarlo**: estructura legal correcta + declaración correcta + pago correcto. Hay margen amplio de optimización **dentro** de la ley; salirse no tiene sentido.
### Cómo se materializan estos riesgos en la práctica

El recorrido típico es:

1. Año 1-2: la persona estructura su LLC sin asesoramiento, declara mal o no declara.
2. Año 3: cruce CRS / DAC7 / DAC8 detecta inconsistencias.
3. Año 4: comunicación de "discrepancia" o requerimiento informativo de la AEAT.
4. Año 5: liquidación provisional, propuesta de regularización + intereses + sanción.
5. Año 6: si los importes superan los umbrales penales y no hay regularización voluntaria previa, traslado al Ministerio Fiscal.

La **regularización voluntaria** antes del requerimiento (art. 305.4 CP) excluye la responsabilidad penal y reduce significativamente la sanción tributaria. Es siempre la mejor opción si detectas que tu situación necesita ajuste.
### Cómo construir una estructura sin estos riesgos

1. **Empezar por la calificación correcta** de la LLC en tu jurisdicción (ver <a href="/es/blog/boe-febrero-2020-llc-doctrina-administrativa">doctrina DGT/TEAC sobre LLC</a>).
2. **Diseñar conforme a la actividad real** (ver <a href="/es/blog/tributacion-llc-segun-actividad-economica">tributación LLC según actividad</a>).
3. **Documentar y mantener registros** que sostengan la sustancia.
4. **Declarar en plazo** todas las obligaciones formales (Modelo 720, Modelo 721, IRPF, IVA, retenciones, modelo 238 si aplica DAC7).
5. **Coherencia entre datos reportados (CRS, DAC7, DAC8) y datos declarados.**
6. **Asesoramiento profesional**.
### En resumen

Los riesgos fiscales no son hipotéticos: son la realidad de las inspecciones que vemos cada mes. La buena noticia es que todos estos riesgos son **evitables** con planificación seria y honesta. La optimización fiscal legal existe y es muy potente; la opacidad como estrategia es un atajo que termina siempre en el mismo sitio.

<!-- exentax:calc-cta-v1 -->
> <a href="/es/agendar">Consulta gratuita sin compromiso</a>
<!-- /exentax:calc-cta-v1 -->

¿Quieres una revisión profesional de tu estructura para detectar y corregir riesgos antes de que sea la AEAT quien los detecte? Agenda tu asesoría gratuita.
Si te ha quedado alguna duda sobre los matices de esta estructura, <a href="/es/blog/fiscalidad-internacional-emprendedores-digitales">Fiscalidad internacional para emprendedores digitales: todo lo que necesitas saber</a> explica en detalle un aspecto colindante que solemos dejar apuntado para otro día.

<!-- exentax:legal-refs-v1 -->
## Referencias: marco legal y normativa

La argumentación de este artículo descansa en la siguiente normativa y doctrina, vigente actualmente:

- **España.** Ley 35/2006 del IRPF (arts. 8, 9 y 91 sobre residencia fiscal y transparencia fiscal internacional), Ley 27/2014 del Impuesto sobre Sociedades (art. 100 sobre TFI), Ley 58/2003 General Tributaria, Ley 5/2022 que reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 720) y Orden HFP/887/2023 (Modelo 721 de criptoactivos en el extranjero).
- **Doctrina administrativa.** Resoluciones del <a href="https://serviciostelematicosext.hacienda.gob.es/TEAC/DYCTEA" target="_blank" rel="noopener">TEAC</a> y consultas vinculantes de la DGT relativas a LLC unipersonales (entre otras V0443-08, V1631-17, V1147-22), interpretadas a la luz del BOE de febrero de 2020 sobre clasificación de entidades extranjeras transparentes.
- **Convenios y normativa internacional.** Convenio de Doble Imposición entre España y EE. UU. firmado en 1990 con Protocolo de 2013 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Convenio <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> con sus Comentarios.
- **EE. UU.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa FBAR (31 CFR 1010.350).

Este contenido es divulgativo y no sustituye al asesoramiento personalizado para tu situación fiscal concreta.

<!-- exentax:execution-v2 -->
## Riesgos fiscales de una mala estructuración internacional: los seis errores que disparan expediente

Una estructura internacional mal montada no falla por la estructura: falla por errores de diseño que confunden optimización legítima con simulación. Cuando una autoridad fiscal mira tu setup y encuentra cualquiera de estos seis patrones, abre expediente y la carga de la prueba es tuya - no suya. Lo barato sale carísimo.

- **Falta de sustancia económica.** LLC US sin oficina, sin empleados y con todas las decisiones tomadas desde España. Para Hacienda española, la sede de dirección efectiva está en España (LIS art. 8) y la entidad es residente fiscal española aunque esté constituida en Wyoming. Resultado: tributación íntegra como sociedad española + sanciones por no haber presentado IS desde el origen.
- **Estructuras circulares sin propósito comercial.** España → LLC US → Sociedad Estonia → Cuenta UAE → Vuelve a España como dividendo. La regla anti-abuso GAAR (España: art. 15 LGT, UE: ATAD) deshace la cadena cuando el único propósito es fiscal y no hay sustancia operativa real en cada eslabón. Hacienda recalifica como renta directa al primer día y aplica sanciones máximas.
- **Precios de transferencia inexistentes o ficticios.** Si tu LLC US cobra a tu sociedad española cantidades que no se sostienen en mercado (overcharging para vaciar base española) o si tu sociedad UAE factura a tu LLC servicios que no se prestan, el ajuste de precios de transferencia (España: TRLIS art. 16) recalifica con sanción de hasta el 100% de la diferencia.
- **Beneficial ownership ocultado.** Nominee director sin operating control real, fideicomisos opacos sin substance trustee, prestanombres familiares para esquivar BOI. Tres jurisdicciones cooperan ya: BOI (US), Registro UBO (UE), CRS (global). Esconder al UBO real es delito de blanqueo agravado, no infracción tributaria. La cárcel es opción.
- **No declaración en residencia.** España (Modelo 720 + 721 + IRPF), Francia (3916 + IR), Italia (RW), Alemania (AStG). La sanción por no declarar puede ser superior al impuesto debido (50%-150% + intereses). Y, si Hacienda lo descubre vía CRS antes de tu regularización voluntaria, no hay rebaja por confesión.
- **Mezclar dinero personal y societario sin trazabilidad.** Tarjeta de la LLC para gastos personales, transferencias a familia sin concepto, draws sin documento. Rompe responsabilidad limitada, complica el bookkeeping y, en inspección, se interpreta como simulación de actividad empresarial.

### Lo que más nos preguntan

**¿Cómo sé si mi estructura actual tiene riesgo?** Cuatro indicadores: (1) ¿hay sustancia operativa real en cada entidad? (2) ¿los precios entre entidades son de mercado? (3) ¿está todo declarado en residencia? (4) ¿el flujo tiene propósito comercial más allá del fiscal? Si alguna respuesta es no, hay riesgo.

**¿Cómo se regulariza una estructura mal montada?** Auditoría interna primero (qué se incumplió y cuándo), regularización voluntaria con asesor en cada jurisdicción (filings tardíos + reasonable cause + abatement programs), y restructuración hacia un setup técnicamente correcto. El orden importa.

En Exentax hacemos due diligence de estructuras heredadas, regularizamos y rediseñamos hacia setups que pasan inspección - porque optimización legítima existe, pero no se parece nunca a lo que vende un canal de Telegram.
<!-- /exentax:execution-v2 -->

## Tu siguiente paso con Exentax

En Exentax constituimos y mantenemos LLCs de no residentes a diario: estado, EIN, Operating Agreement, BOI cuando aplique, banca con Mercury y Wise, pasarelas Stripe y Adyen, contabilidad mensual, Form 5472 y 1120 pro-forma cada año, y coordinación con tu fiscalidad en residencia. Si quieres validar tu caso con datos reales, agenda una asesoría con nuestro equipo y te explicamos paso a paso cómo encajaría en tu situación concreta.

<!-- exentax:cross-refs-v1 -->
### Más lecturas relacionadas

- [Estructura offshore: beneficios reales y riesgos honestos](/es/blog/estructura-offshore-beneficios-riesgos)
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
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22riesgos%20fiscales%20mala%20estructuracion%20internacional%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

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
