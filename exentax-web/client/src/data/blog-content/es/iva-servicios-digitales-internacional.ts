export default `

El IVA en operaciones internacionales es uno de los temas que más confunde a freelancers y consultores españoles. ¿Cobras IVA a un cliente en Alemania? ¿Y a uno en Estados Unidos? ¿Y si el cliente es un particular y no una empresa? ¿Qué cambia si facturas desde tu autónomo o desde una LLC americana? Las reglas son distintas en cada caso y un error puede costar caro en una inspección de la AEAT.

En este artículo desglosamos las reglas de localización del IVA para servicios digitales según la Ley 37/1992 (LIVA) y la Directiva 2006/112/CE, los modelos formales que tienes que presentar, los escenarios reales más habituales y cómo una LLC bien declarada simplifica gran parte de esta complejidad sin saltarse ninguna norma.

## La regla general: localización del servicio

Para servicios digitales (programación, diseño, consultoría, marketing, formación online, software como servicio, etc.) la localización del IVA depende de quién es tu cliente: empresa o particular.

### Servicios B2B (a empresas)

El IVA se localiza en el país del destinatario, es decir, donde está establecida la empresa que te contrata. Esto se basa en la regla general del art. 69.Uno.1º LIVA y en el art. 44 de la Directiva 2006/112/CE:

- **Cliente empresa en España:** Cobras IVA español al 21%.
- **Cliente empresa en la UE:** No cobras IVA español. El cliente autoliquida el IVA en su país (inversión del sujeto pasivo, art. 84.Uno.2º LIVA). Debes incluir su número de IVA intracomunitario (VAT ID) en la factura y verificarlo en VIES.
- **Cliente empresa fuera de la UE:** No cobras IVA. La operación está no sujeta a IVA español por reglas de localización (art. 69.Uno.1º LIVA), pero sí se declara en el Modelo 303 en la casilla 60.

### Servicios B2C (a particulares)

Para servicios prestados a particulares, la regla general (art. 69.Uno.2º LIVA) localiza el IVA en el país del prestador, salvo excepciones para servicios electrónicos, telecomunicaciones y radiodifusión que tienen su propia regla (art. 70.Uno.4º LIVA y art. 58 de la Directiva):

- **Cliente particular en España:** Cobras IVA español (21%).
- **Cliente particular en la UE (servicios electrónicos):** Si superas 10.000 €/año en ventas a consumidores de otros países UE, debes registrarte en el sistema OSS (One-Stop Shop) y aplicar el tipo del IVA del país del consumidor.
- **Cliente particular fuera de la UE:** No cobras IVA español. Operación no sujeta.
## Obligaciones formales

### Modelo 303 (declaración trimestral de IVA)

Las operaciones sin IVA (intracomunitarias y exportaciones) se declaran en el Modelo 303 pero en casillas específicas:

- **Casilla 59:** Base de servicios intracomunitarios prestados.
- **Casilla 60:** Entregas no sujetas por reglas de localización (clientes fuera de la UE).

Aunque no cobres IVA, omitir estas casillas es un error frecuente que genera incidencias automáticas en la AEAT.

### Modelo 349 (operaciones intracomunitarias)

Si prestas servicios a empresas de otros países de la UE, debes presentar el Modelo 349 declarando estas operaciones. Periodicidad mensual o trimestral según volumen (art. 80 RIVA).

### Modelo 368 (OSS, One-Stop Shop)

Si vendes servicios B2C a consumidores de otros países de la UE y superas los 10.000 € anuales (umbral conjunto para ventas a distancia y servicios electrónicos según art. 73 LIVA tras la transposición de la Directiva 2017/2455), el sistema OSS te permite declarar y pagar el IVA de todos los países desde España, sin tener que registrarte en cada país individualmente.

## Escenarios prácticos

### Desarrollador web con clientes en EE. UU.

Tus clientes son empresas americanas. **No cobras IVA** en ninguna factura. Las operaciones están no sujetas. Declaras la base en el Modelo 303 (casilla 60). No necesitas Modelo 349.

### Diseñador con clientes en Alemania y Francia (B2B)

Facturas sin IVA español. Incluyes el VAT ID del cliente verificado en VIES. Declaras en Modelo 303 (casilla 59) y Modelo 349.

### Consultor con clientes mixtos (España + internacional)

Las facturas a clientes españoles llevan IVA (21%). Las facturas a empresas de la UE van sin IVA con inversión del sujeto pasivo. Las facturas fuera de la UE van sin IVA (no sujetas). Cada operación termina en una casilla distinta del 303.

### Creador de cursos online (B2C internacional)

Si vendes cursos a particulares de toda Europa necesitas:

- Registrarte en OSS si superas 10.000 €/año en ventas B2C intracomunitarias.
- Aplicar el tipo de IVA del país del comprador (19% Alemania, 20% Francia, 22% Italia, etc.).
- Presentar el Modelo 368 trimestralmente.

### SaaS B2B vendiendo a clientes de LATAM

Tus clientes son empresas en México, Colombia o Argentina. No cobras IVA español. Operación no sujeta declarada en casilla 60 del Modelo 303. Cada cliente puede tener obligaciones de retención local (IVA local en algunos países, ISR en México) que no afectan a tu facturación, pero sí conviene incluir cláusulas contractuales claras sobre quién soporta esas retenciones.

## Cómo cambia el panorama con una LLC americana

Si operas a través de una LLC americana correctamente declarada en tu país de residencia, la mayor parte del laberinto del IVA europeo desaparece para tus operaciones internacionales:

- **La LLC no cobra IVA**: es una entidad estadounidense, fuera del sistema de IVA europeo. Emite facturas en dólares sin impuestos indirectos.
- **Tus clientes B2B reciben facturas limpias**: no aparece "inversión del sujeto pasivo" ni hace falta verificar VAT IDs en VIES porque la LLC no opera dentro del marco IVA intracomunitario.
- **No presentas Modelo 303, 349 ni 368** por las operaciones de la LLC. La LLC presenta sus propias obligaciones ante el <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> (Form 5472 + 1120 pro-forma anual para Single-Member LLC de no residente).
- **Sigues declarando en residencia**: si vives en España, los beneficios de la LLC se imputan vía atribución de rentas (art. 87 LIRPF) o, en casos específicos, vía transparencia fiscal internacional (art. 91 LIRPF). Esto se hace en tu IRPF, no en el IVA, y es lo que evita el riesgo de "cero impuestos" indebido.

Importante: la LLC reduce tu carga formal de IVA y simplifica la facturación internacional, pero **no exime** de declarar correctamente los beneficios en el país donde resides. Cualquier mensaje del estilo "con LLC pagas 0%" es engañoso. Lo que se consigue es evitar duplicidad de tributación y operar con una estructura simple, fiscalmente legítima y defendible.

### Ventas B2C internacionales: DoDo Payments y Stripe Tax

Si tu LLC vende productos digitales (cursos, software, SaaS, ebooks) directamente a consumidores finales en múltiples países, el IVA/GST local sigue siendo una obligación del vendedor en muchas jurisdicciones. Dos soluciones habituales:

- **DoDo Payments** actúa como Merchant of Record: se encarga automáticamente del IVA/GST de cada país. Tú vendes, DoDo calcula, recauda y remite el impuesto al consumo correspondiente.
- **Stripe Tax** sobre Stripe Payments calcula el impuesto correcto por país, pero no es Merchant of Record: el vendedor sigue siendo el responsable del registro y la liquidación local, lo que tiene más fricción operativa.

Para B2C global pequeño y mediano, DoDo o Paddle suelen ser la opción menos intrusiva. Para B2B internacional, basta con la LLC y facturación directa en USD.

## Errores frecuentes con el IVA internacional

1. **Cobrar IVA español a una empresa de la UE con VAT ID válido.** Si tiene VAT ID válido en VIES, no debes cobrar IVA. Verifícalo siempre antes de facturar.
2. **No verificar el VAT ID del cliente.** Si cobras sin IVA a una empresa intracomunitaria sin verificar su VAT ID, la AEAT puede reclamarte el IVA no cobrado más recargo. Suena absurdo, pero pasa.
3. **Ignorar el sistema OSS.** Si vendes B2C en la UE y superas 10.000 €, estás obligado a usar OSS o registrarte en cada país. Con la LLC y un Merchant of Record, este problema desaparece.
4. **No declarar operaciones no sujetas en el Modelo 303.** Aunque no cobres IVA, debes declarar la base imponible en las casillas 59 y 60 según corresponda.
5. **Confundir B2B con B2C.** Las reglas son completamente distintas. Venderle a un particular en Francia no es lo mismo que venderle a una SAS francesa.
6. **Asumir que la LLC elimina cualquier obligación.** La LLC simplifica el IVA pero no exime del IRPF en España ni del IRS en EE. UU. (Form 5472 anual obligatorio).
Para ampliar contexto, te recomiendo: <a href="/es/blog/impuestos-clientes-internacionales-espana">Impuestos si tienes clientes internacionales en España: lo que nadie te cuenta</a> y <a href="/es/blog/cuentas-bancarias-usa-reportan-hacienda-verdad">¿Las cuentas bancarias en EE. UU. reportan a tu hacienda? La verdad completa</a>.

<!-- exentax:legal-refs-v1 -->
## Referencias legales y normativas

Este artículo se apoya en normativa vigentes actualmente:

- **España.** Ley 37/1992 (LIVA), arts. 69, 70, 84 (reglas de localización e inversión del sujeto pasivo); RD 1624/1992 (RIVA), arts. 79-80 (Modelo 349); Orden HAC/1418/2014 y posteriores actualizaciones (Modelo 303); Orden HAC/610/2021 (régimen OSS y Modelo 368).
- **Unión Europea.** Directiva 2006/112/CE del Consejo (Sistema común del IVA), arts. 44, 58 y 59; Directiva 2017/2455 (régimen de ventanilla única OSS y umbral común de 10.000 €); Reglamento de Ejecución (UE) 282/2011.
- **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de entidades, *check-the-box*); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para LLC de propiedad extranjera).
- **AEAT.** Manual práctico del IVA (edición vigente) y consultas vinculantes <a href="https://petete.tributos.hacienda.gob.es" target="_blank" rel="noopener">DGT</a> V0297-22, V1543-21 sobre tributación de LLC desde España.

<!-- exentax:calc-cta-v1 -->
> <a href="/es/agendar">Consulta gratuita sin compromiso</a>
<!-- /exentax:calc-cta-v1 -->

La aplicación concreta de cualquier norma a tu caso depende de tu residencia fiscal, la actividad y el tipo de cliente. Este contenido es informativo y no sustituye al asesoramiento profesional personalizado.

<!-- exentax:execution-v2 -->
## IVA en servicios digitales internacionales: el mapa que te ahorra inspecciones

Vender servicios digitales (SaaS, infoproductos, suscripciones, descargas) a clientes de varios países desde España es uno de los puntos donde más expedientes abre Hacienda. La regla cambió hace años pero muchos siguen aplicando criterios de "factura sin IVA y listo". Esto es lo que tienes que tener resuelto.

- **B2C dentro de la UE: OSS o tipo local.** Si vendes infoproductos o suscripciones a consumidores finales (B2C) en otros países UE, debes aplicar el IVA del país del cliente desde el primer euro si superas 10.000 EUR anuales totales B2C UE. Sin OSS, tendrías que registrarte en cada país. Con OSS (Modelo 369), declaras todo trimestralmente desde España.
- **B2B dentro de la UE.** Inversión del sujeto pasivo: factura sin IVA español indicando el VAT-ID del cliente y la mención "art. 69.Uno LIVA / reverse charge". Tu cliente declara el IVA en su país. Necesitas alta en VIES (modelo 036, casillas 582-584) - sin esto tu cliente puede rechazar la factura.
- **B2C fuera de la UE.** Factura sin IVA español. Algunos países (UK, Australia, Canadá, Suiza, Noruega) exigen registro local de IVA si superas su umbral anual. Tu plataforma de venta (Stripe, Paddle, Lemonsqueezy) puede hacer Merchant of Record y absorberlo - esto es lo que vende Paddle como propuesta de valor.
- **B2B fuera de la UE.** Operación no sujeta a IVA español. Factura limpia con mención "Operación no sujeta - prestador no establecido en territorio del cliente". Sin obligaciones IVA en España; tu cliente cumple con sus reglas locales.

### Lo que más nos preguntan

**¿Stripe me hace de Merchant of Record?** No por defecto. Stripe es procesador de pagos: tú eres el vendedor frente al cliente final y a su Hacienda. Para que el responsable IVA sea otro, necesitas Paddle, Lemonsqueezy o FastSpring (MoR explícito).

**¿Y si vendo desde una LLC americana en lugar de desde España?** Cambia mucho. La LLC vende sin IVA español porque no está establecida en España; pero si tu residencia es España, la actividad de la LLC puede atribuirse fiscalmente y volver a IRPF. La estructura LLC no elimina IVA por sí sola.

En Exentax revisamos tu mix exacto (B2B/B2C, dentro/fuera UE, plataforma de venta) y te configuramos OSS, VIES y mencionamos las facturas correctamente - para que el día de la inspección el flujo cuadre solo.
<!-- /exentax:execution-v2 -->

## Tu siguiente paso con Exentax

En Exentax constituimos y mantenemos LLCs de no residentes a diario: estado, EIN, Operating Agreement, BOI cuando aplique, banca con Mercury y Wise, pasarelas Stripe y Adyen, contabilidad mensual, Form 5472 y 1120 pro-forma cada año, y coordinación con tu fiscalidad en residencia. Si quieres validar tu caso con datos reales, agenda una asesoría con nuestro equipo y te explicamos paso a paso cómo encajaría en tu situación concreta.

<!-- exentax:cross-refs-v1 -->
### Más lecturas relacionadas

- [Holding empresarial: cómo funciona y cuándo conviene constituir uno](/es/blog/holding-empresarial-como-funciona)
<!-- /exentax:cross-refs-v1 -->

¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:+34614916910">+34 614 916 910</a> o escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22iva%20servicios%20digitales%20internacional%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si prefieres hablarlo en directo, <a href="/es/agendar">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

`;
