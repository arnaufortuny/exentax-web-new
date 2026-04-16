export default `Una estructura internacional bien diseñada es una herramienta extraordinaria. Una mal diseñada es una bomba de relojería que estalla cuando menos te lo esperas, normalmente con un requerimiento de la AEAT, SAT, DIAN o AFIP que te pide explicar todo lo que has hecho los últimos cuatro años. En Exentax vemos casos cada semana, y los problemas se repiten. Te contamos los seis riesgos principales y cómo evitarlos.

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

  **Cómo evitarlo**: si te cambias de residencia, hazlo de verdad (más de 183 días fuera, sin centro de intereses en España, con certificado de residencia fiscal del nuevo país). Lo desarrollamos en <a href="/es/blog/nomada-digital-residencia-fiscal">residencia fiscal del nómada digital</a>.

  ## Riesgo 4: Establecimiento permanente (EP) oculto

  Si tu LLC americana opera materialmente desde España (oficina, representante con poderes, lugar fijo de negocio), puede constituir un **establecimiento permanente** en España (art. 13 LIRNR y art. 5 CDI España-EE.UU.). En tal caso:

  - La LLC tributa por el Impuesto sobre la Renta de No Residentes (IRNR) por las rentas atribuibles al EP, con tipo del 25% (Impuesto sobre Sociedades aplicable al EP).
  - Las cuentas se llevan separadamente y se documentan precios de transferencia con la matriz.
  - Sanciones por no haber declarado el EP en su momento.

  **Cómo evitarlo**: si la actividad se desarrolla esencialmente en España, plantearse si la LLC es la estructura adecuada o si conviene una S.L. española como entidad operativa. Análisis en <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">diseño de estructura internacional sólida</a>.

  ## Riesgo 5: Treaty shopping y abuso del CDI

  El **Protocolo modificativo del CDI España-EE.UU.** firmado en 2013 y en vigor desde el 27 de noviembre de 2019 (BOE 23-10-2019) introdujo la cláusula de **Limitation on Benefits (LOB)**, que restringe el acceso a los beneficios del Convenio a las personas y entidades que cumplen determinados requisitos de sustancia y conexión real con uno de los Estados contratantes.

  Una LLC americana cuyo único socio es residente español y cuya actividad real se localiza en España difícilmente cumple los tests LOB del Protocolo. Adicionalmente, la cláusula de **Principal Purpose Test (PPT)** (art. 7 BEPS, MLI) permite denegar beneficios cuando uno de los principales propósitos de la operación es obtener el beneficio convencional.

  **Consecuencia**: la AEAT puede denegar la aplicación del CDI, lo que en el caso de la LLC Disregarded suele ser irrelevante porque ya tributas en España, pero sí afecta a estructuras más complejas (LLC + Holding + entidad operativa).

  ## Riesgo 6: Delito fiscal

  En España, el delito fiscal del art. 305 CP se activa cuando la cuota defraudada por ejercicio fiscal supera **120.000 €** (240.000 € si la administración perjudicada es la UE). Equivalentes en LATAM con umbrales propios.

  Una estructura mal diseñada con varios años de impagos puede acumular cuotas que crucen ese umbral con relativa facilidad: si tu actividad genera 200.000 € anuales y deberías haber tributado al 47% pero declaraste al 0%, en dos años cruzas el umbral y entras en el ámbito penal.

  Penas: de 1 a 5 años de prisión y multa del 100% al 600% de la cuota defraudada. Tipo agravado (de 2 a 6 años) cuando la cuota supera 600.000 €, hay estructura organizada o se utilizan paraísos fiscales.

  **Cómo evitarlo**: estructura legal correcta + declaración correcta + pago correcto. Hay margen amplio de optimización **dentro** de la ley; salirse no tiene sentido.

  ## Cómo se materializan estos riesgos en la práctica

  El recorrido típico es:

  1. Año 1-2: la persona estructura su LLC sin asesoramiento, declara mal o no declara.
  2. Año 3: cruce CRS / DAC7 / DAC8 detecta inconsistencias.
  3. Año 4: comunicación de "discrepancia" o requerimiento informativo de la AEAT.
  4. Año 5: liquidación provisional, propuesta de regularización + intereses + sanción.
  5. Año 6: si los importes superan los umbrales penales y no hay regularización voluntaria previa, traslado al Ministerio Fiscal.

  La **regularización voluntaria** antes del requerimiento (art. 305.4 CP) excluye la responsabilidad penal y reduce significativamente la sanción tributaria. Es siempre la mejor opción si detectas que tu situación necesita ajuste.

  ## Cómo construir una estructura sin estos riesgos

  1. **Empezar por la calificación correcta** de la LLC en tu jurisdicción (ver <a href="/es/blog/boe-febrero-2020-llc-doctrina-administrativa">doctrina DGT/TEAC sobre LLC</a>).
  2. **Diseñar conforme a la actividad real** (ver <a href="/es/blog/tributacion-llc-segun-actividad-economica">tributación LLC según actividad</a>).
  3. **Documentar y mantener registros** que sostengan la sustancia.
  4. **Declarar en plazo** todas las obligaciones formales (Modelo 720, Modelo 721, IRPF, IVA, retenciones, modelo 238 si aplica DAC7).
  5. **Coherencia entre datos reportados (CRS, DAC7, DAC8) y datos declarados.**
  6. **Asesoramiento profesional**.

  ## En resumen

  Los riesgos fiscales no son hipotéticos: son la realidad de las inspecciones que vemos cada mes. La buena noticia es que todos estos riesgos son **evitables** con planificación seria y honesta. La optimización fiscal legal existe y es muy potente; la opacidad como estrategia es un atajo que termina siempre en el mismo sitio.

  ¿Quieres una revisión profesional de tu estructura para detectar y corregir riesgos antes de que sea la AEAT quien los detecte? Agenda tu asesoría gratuita.`;
