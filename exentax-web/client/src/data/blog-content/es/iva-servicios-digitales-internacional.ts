export default `El IVA en operaciones internacionales es uno de los temas más confusos de la fiscalidad para freelancers. ¿Cobras IVA a un cliente en Alemania? ¿Y a uno en Estados Unidos? ¿Y si el cliente es un particular, no una empresa? Las reglas cambian según cada escenario.

## La regla general: localización del servicio

Para servicios digitales (programación, diseño, consultoría, marketing, formación online, etc.), la localización del IVA depende de quién es tu cliente:

### Servicios B2B (a empresas)

El IVA se localiza en el país del destinatario (la empresa que te contrata):

- **Cliente empresa en España:** Cobras IVA español (21%)
- **Cliente empresa en la UE:** No cobras IVA español. El cliente autoliquida el IVA en su país (inversión del sujeto pasivo). Debes incluir su número de IVA intracomunitario (VAT ID) en la factura.
- **Cliente empresa fuera de la UE:** No cobras IVA. La operación está no sujeta a IVA español.

### Servicios B2C (a particulares)

El IVA se localiza donde está establecido el prestador del servicio (tú):

- **Cliente particular en España:** Cobras IVA español (21%)
- **Cliente particular en la UE:** Si superas 10.000€/año en ventas a consumidores de otros países UE, debes registrarte en el sistema OSS (One-Stop Shop) y aplicar el IVA del país del consumidor.
- **Cliente particular fuera de la UE:** No cobras IVA español. Operación no sujeta.

## Obligaciones formales

### Modelo 303 (declaración trimestral de IVA)

Las operaciones sin IVA (intracomunitarias y exportaciones) se declaran en el Modelo 303 pero en casillas específicas:
- Casilla 59: Base de servicios intracomunitarios prestados
- Casilla 60: Entregas no sujetas por reglas de localización

### Modelo 349 (operaciones intracomunitarias)

Si prestas servicios a empresas de otros países de la UE, debes presentar el Modelo 349 declarando estas operaciones.

### Modelo 368 (OSS. One-Stop Shop)

Si vendes servicios B2C a consumidores de otros países de la UE y superas los 10.000€, el sistema OSS te permite declarar y pagar el IVA de todos los países desde España, sin tener que registrarte en cada país individualmente.

## Escenarios prácticos

### Desarrollador web con clientes en EE.UU.

Tus clientes son empresas americanas. **No cobras IVA** en ninguna factura. Las operaciones están no sujetas. Declaras la base en el Modelo 303 (casilla 60). No necesitas Modelo 349.

### Diseñador con clientes en Alemania y Francia (B2B)

Facturas sin IVA español. Incluyes el VAT ID del cliente. Declaras en Modelo 303 y Modelo 349.

### Consultor con clientes mixtos (España + internacional)

Las facturas a clientes españoles llevan IVA (21%). Las facturas a clientes de la UE van sin IVA (inversión del sujeto pasivo). Las facturas fuera de la UE van sin IVA (no sujetas).

### Creador de cursos online (B2C internacional)

Si vendes cursos a particulares de toda Europa, necesitas:
- Registrarte en OSS si superas 10.000€/año en ventas B2C intracomunitarias
- Aplicar el tipo de IVA del país del comprador (19% Alemania, 20% Francia, etc.)
- Presentar el Modelo 368 trimestralmente

## ¿Cómo afecta la LLC al IVA?

Si operas a través de una LLC americana para facturar a tus clientes internacionales:

- **La LLC no cobra IVA**: es una entidad americana y no está dentro del sistema de IVA europeo
- **Tus clientes reciben facturas sin IVA** de una empresa americana
- **No presentas Modelo 303 ni 349** por las operaciones de la LLC

Esto simplifica enormemente tu operativa si la mayoría de tus clientes son internacionales. En lugar de gestionar IVA en cada factura, la LLC emite facturas limpias en dólares sin impuestos indirectos.

### DoDo Payments: la solución para ventas B2C internacionales

Si vendes productos digitales (cursos, software, SaaS, ebooks) a consumidores finales en múltiples países, **DoDo Payments** actúa como **Merchant of Record**: lo que significa que DoDo se encarga automáticamente del IVA/GST de cada país. Tú vendes, DoDo calcula, recauda y remite el impuesto al consumo correspondiente. Elimina completamente la complejidad del IVA/GST internacional para ventas B2C, algo que ni Stripe ni PayPal hacen por defecto.

## La LLC como solución definitiva al laberinto del IVA

Aquí es donde se pone interesante. Si la mayoría de tus clientes son B2B fuera de España (o fuera de la UE directamente), la LLC americana elimina toda la complejidad del IVA europeo de un plumazo:

- **No cobras IVA**: la LLC es una entidad americana, fuera del sistema de IVA europeo
- **No presentas Modelo 303, ni 349, ni 368** por las operaciones de la LLC
- **Tus clientes reciben facturas limpias**: sin IVA, sin confusión, sin el típico "espera que miro si aplica inversión del sujeto pasivo"
- **Adiós al VIES**: no necesitas verificar VAT IDs porque la LLC no opera dentro del marco IVA

¿El resultado? Facturas internacionales simplificadas, menos burocracia trimestral, y más tiempo para lo que realmente importa: tu negocio.

Cierro con lecturas relacionadas que encajan con el hilo de este artículo: <a href="/es/blog/impuestos-clientes-internacionales-espana">Impuestos si tienes clientes internacionales en España: lo que nadie te cuenta</a> y <a href="/es/blog/cuentas-bancarias-usa-reportan-hacienda-verdad">¿Las cuentas bancarias en EE.UU. reportan a tu hacienda? La verdad completa</a> son piezas útiles para terminar de contextualizar el escenario.

## Errores frecuentes con el IVA internacional

1. **Cobrar IVA español a una empresa de la UE.** Si tiene VAT ID válido, no debes cobrar IVA. Verificalo siempre en el sistema VIES de la Comisión Europea antes de facturar.
2. **No verificar el VAT ID del cliente.** Si cobras sin IVA a una empresa intracomunitaria sin verificar su VAT ID, las autoridades fiscales pueden reclamarte el IVA no cobrado. Suena absurdo, pero pasa.
3. **Ignorar el sistema OSS.** Si vendes B2C en la UE y superas 10.000€, estás obligado a usar OSS o registrarte en cada país. Con la LLC, este problema desaparece.
4. **No declarar operaciones no sujetas en el Modelo 303.** Aunque no cobres IVA, debes declarar la base imponible en las casillas correspondientes.
5. **Confundir B2B con B2C.** Las reglas son completamente distintas. Si le vendes a un particular en Francia, no es lo mismo que venderle a una SAS francesa.

En Exentax nos encargamos de que tu estructura fiscal sea la correcta para tu tipo de clientes. Si estás hasta arriba de modelos trimestrales y quieres simplificar tu vida, agenda una asesoría gratuita. Te explicamos cómo la LLC puede eliminar el 90% de tu burocracia fiscal.

Quieres dejar de preocuparte por el IVA internacional y operar con una estructura limpia? Habla con nuestro equipo y te explicamos cómo.`;
