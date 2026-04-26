export default `

Cuando alguien dice "empresa americana", la mayoría imagina una LLC; otros, una "corporation". La realidad es que en EE. UU. existen cuatro vehículos principales para hacer negocios: **LLC**, **Corporation**, **S-Corporation** y **C-Corporation**. Cada uno tiene su propio régimen fiscal federal y estatal, sus restricciones de propiedad y sus casos de uso. Para un emprendedor extranjero no residente, no todas son accesibles ni convenientes. Esta guía aterriza la diferencia real entre las cuatro figuras, qué encaja con cada perfil y por qué la LLC sigue siendo, hoy, la elección por defecto para freelancers, agencias y proyectos digitales que no buscan inversores institucionales.

## LLC: la opción flexible y por defecto para no residentes

La **LLC (Limited Liability Company)** es una figura híbrida creada por las leyes estatales de EE. UU. (cada estado tiene su propio LLC Act; Wyoming fue el primero, en 1977). Legalmente es una entidad con responsabilidad limitada que protege el patrimonio personal de sus miembros frente a las deudas y responsabilidades del negocio. Fiscalmente, **por defecto es transparente**: la **Treas. Reg. §301.7701-3 ("check-the-box")** trata a la single-member LLC como **"disregarded entity"** y a la multi-member LLC como **partnership** salvo que se elija otra cosa con el **Form 8832** (election to be classified as an association taxable as a corporation).

Para un no residente sin **ETBUS** (Effectively Connected Trade or Business in the United States) y sin **US-source FDAP income**, la LLC disregarded **no genera obligación de Form 1040-NR sustantivo** ni paga impuesto federal sobre la renta: la regla básica de **IRC §871 y §882** somete a no residentes solo por (a) US-source FDAP con retención del 30 % (o tasa de tratado) y (b) renta efectivamente conectada a un trade or business en EE. UU. Sin esos dos elementos, la LLC paga **0 % federal**. A nivel estatal, **Wyoming, Nuevo México, Florida, Texas y Dakota del Sur** no tienen impuesto sobre la renta corporativa estatal, lo que añade un **0 % estatal** cuando no hay nexus.

La obligación práctica que sí queda: **Form 5472 + Form 1120 pro-forma** anual (Treas. Reg. §1.6038A-1 desde 2017) para SMLLC propiedad de un no residente con cualquier *reportable transaction* con su único miembro. Sanción base: **25.000 USD por formulario y año** (IRC §6038A(d)) más **25.000 USD por cada 30 días adicionales** tras notificación del IRS.

## Corporation general: por defecto C-Corporation

Cuando alguien constituye una "Inc." o "Corp." al amparo de la *General Corporation Law* de un estado (por ejemplo, **Delaware General Corporation Law** o **Nevada Revised Statutes Chapter 78**), por defecto se trata fiscalmente como **C-Corporation**: paga impuesto federal sobre sus beneficios al **21 % (IRC §11(b), tipo único introducido por la Tax Cuts and Jobs Act de 2017)**, además del impuesto estatal correspondiente (Delaware grava 8,7 % a la renta efectiva en el estado, California 8,84 %, Texas 0 % de income tax pero franchise tax). Cuando reparte dividendos, los socios tributan **otra vez** en su renta personal: dividendos **calificados** al 0 %/15 %/20 % federal para residentes US (IRC §1(h)(11)); para socios extranjeros, retención FDAP del **30 %** salvo CDI aplicable (la mayoría de tratados España–EE. UU. y similares la reducen a **15 % o 5 %** según porcentaje de participación). Es la doble imposición clásica.

La C-Corp es **obligatoria de facto** para quien quiera levantar capital de venture capital o salir a bolsa: los inversores institucionales (fondos VC, family offices, plataformas como AngelList) casi siempre exigen una **Delaware C-Corp** porque conocen su jurisprudencia (Court of Chancery), puede emitir varias clases de acciones (preferentes con liquidation preference, Series A/B/C), permite stock options para empleados (planes 409A) y permite ofertas públicas. No tiene límite de número de accionistas ni restricciones de nacionalidad.

## S-Corporation: la opción que un no residente no puede usar

La **S-Corporation** no es una forma jurídica nueva: es una **elección fiscal** definida en el **subcapítulo S del Internal Revenue Code (IRC §§1361-1378)** que una corporación o LLC puede solicitar mediante **Form 2553**. Una vez aceptada la S-election, la entidad **no paga impuesto federal corporativo**; los beneficios pasan a los socios y se reportan en sus declaraciones personales (Schedule K-1). A diferencia de la LLC, los socios pueden cobrar un **salario razonable** (W-2) y recibir el resto como **distribuciones no sujetas a self-employment tax** (15,3 %), lo que reduce la carga FICA para residentes US. Esta es la razón principal por la que los americanos eligen S-Corp.

El problema para no residentes: **IRC §1361(b)** establece requisitos estrictos. Máximo **100 accionistas**, todos deben ser **personas físicas residentes o ciudadanos estadounidenses** (no se admiten extranjeros, ni *non-resident aliens*, ni sociedades, ni LLCs como accionistas), una sola clase de acciones (con la única excepción de diferencias en derechos de voto). Por estos requisitos, una S-Corp es **completamente inviable para un emprendedor no residente**. La mencionamos para que entiendas que cuando lees "S-Corp" en foros norteamericanos o en libros de tax planning de Robert Kiyosaki o Mark Kohler, casi nunca aplica a tu caso.

## Cuándo una C-Corp tiene sentido para un no residente

Una C-Corp puede compensar para un no residente en escenarios concretos:

- **Vas a buscar inversión venture capital**: los fondos exigen Delaware C-Corp con cap table limpio.
- **Planeas salir a bolsa** o ser adquirido por una empresa cotizada (M&A típicamente exige C-Corp).
- **Vas a tener empleados con stock options** en EE. UU. (planes ISO/NSO requieren corporación).
- **Tu negocio tiene ETBUS** (oficina, empleados, servidores propios, almacén) y por tanto pagaría impuesto federal igualmente bajo IRC §882: el diferencial fiscal frente a una LLC desaparece y la C-Corp aporta gobernanza más sólida.
- **Quieres aprovechar el QSBS (Qualified Small Business Stock)** definido en **IRC §1202**: si mantienes acciones de una C-Corp cualificada (activos ≤50 M USD al emitir las acciones, actividad operativa, no servicios profesionales) durante **5 años**, puedes excluir hasta el **mayor de 10 M USD o 10x base** en ganancia capital al venderlas. Es uno de los incentivos fiscales más potentes del sistema US para fundadores de startups.

La doble imposición se atenúa con planificación: salarios al fundador (deducibles para la corp, gravados como ordinary income al individuo), retención de beneficios para reinvertir en lugar de repartir dividendos, planes de compensación diferida y buen aprovechamiento del QSBS si encajas.

## Tabla comparativa de tributación efectiva

Para un beneficio de **100.000 USD** generado por un no residente sin ETBUS, sin US-source income, residente fiscal en España:

| Vehículo | Federal US | Estatal US | Retención dividendos | Total US | Tributación España |
|---|---|---|---|---|---|
| **LLC disregarded** (WY/NM) | 0 USD | 0 USD | N/A | **0 USD** | IRPF por atribución de rentas (art. 87 LIRPF) sobre beneficio neto |
| **C-Corp Delaware** sin reparto | 21.000 USD | 0 USD si no opera en DE | 0 USD | **21.000 USD** | Sin tributación inmediata si no reparte (salvo TFI art. 91 LIRPF) |
| **C-Corp Delaware** con reparto | 21.000 USD | 0 USD | 11.850 USD (15 % CDI ESP-USA) | **32.850 USD** | IRPF sobre dividendo bruto + crédito por impuesto soportado |
| **S-Corp** | No aplicable a no residentes (IRC §1361(b)) |

La diferencia es enorme: para perfiles operativos sin pretensión de inversión institucional, **la LLC es claramente más eficiente**. La C-Corp solo gana cuando el plan estratégico requiere venture capital, salida a bolsa o aprovechamiento de QSBS.

## Qué elegir según tu perfil

- **Freelancer, agencia digital, consultor, infoproducto, ecommerce pequeño, SaaS bootstrapped, trader por cuenta propia**: **LLC**, sin duda. Wyoming o Nuevo México por coste; Delaware si prevés crecer mucho y posible conversión futura.
- **Startup con ronda seed o serie A planificada**: **Delaware C-Corp** desde el día uno, asumiendo la doble tributación como coste de acceso a capital. Constituir la C-Corp directamente evita la conversión LLC→C-Corp, que es un evento imponible que dispara *built-in gains*.
- **Negocio físico en EE. UU. con empleados y operativa local**: probablemente C-Corp si esperas crecer mucho; LLC si vas a operar como pequeño negocio sin necesidad de levantar capital institucional.
- **Profesional regulado (abogado, médico, arquitecto)**: muchos estados exigen **Professional LLC (PLLC)** o **Professional Corporation (PC)** con licencia estatal. La S-election puede compensar para residentes US, no para extranjeros.

Si ya tienes una LLC y necesitas convertirla en C-Corp, es posible vía **statutory conversion** (estados como DE, NV, WY) o vía **check-the-box election (Form 8832)** que reclasifica fiscalmente la LLC como corporation. Ambas requieren planificación cuidadosa porque, bajo **IRC §351**, la incorporación puede ser tax-free si se cumplen requisitos (control 80 % post-incorporation, exclusivamente activos por acciones), pero cualquier desviación dispara hechos imponibles inmediatos.

## Marco regulatorio aplicable

- **Internal Revenue Code (Title 26 USC)**: §11(b) tipo C-Corp 21 %; §1361-1378 régimen S-Corp; §1202 QSBS; §§871, 881, 882, 1441 tributación de no residentes; §6038A Form 5472; §351 incorporaciones tax-free.
- **Treasury Regulations**: §301.7701-3 check-the-box; §1.6038A-1/2 Form 5472 disregarded entities; §1.871-10 substantial presence.
- **IRS Publications**: <a href="https://www.irs.gov/businesses/small-businesses-self-employed/business-structures">Business Structures</a>; Pub. 519 (US Tax Guide for Aliens); Pub. 542 (Corporations).
- **Marco estatal**: Delaware General Corporation Law; Wyoming Business Corporation Act; New Mexico Limited Liability Company Act; Nevada Revised Statutes Chapter 78.

Para no residentes, la LLC sigue siendo la opción más común porque combina protección patrimonial, fiscalidad limpia (0 % federal sin ETBUS) y carga administrativa baja. La C-Corp se reserva para quien busca capital institucional o salida a bolsa.

## Compliance fiscal en tu país: CFC, TFI y atribución de rentas

Una LLC americana es una herramienta legal y reconocida internacionalmente. Pero el cumplimiento no termina al constituirla: como propietario residente fiscal en otro país, tu administración tributaria sigue teniendo derecho a gravar lo que la LLC genera. En España (LIRPF/LIS), si la LLC es una *Single-Member Disregarded Entity* operativa, Hacienda suele tratarla por **atribución de rentas (art. 87 LIRPF)**: los beneficios netos se imputan al socio en el ejercicio en que se generan, integrándose en la base general del IRPF. Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada por residente español con rentas mayoritariamente pasivas, puede activarse el régimen de **transparencia fiscal internacional (art. 91 LIRPF para personas físicas, art. 100 LIS para sociedades)**. La diferencia entre uno u otro régimen no es opcional: depende de la sustancia económica.

El convenio España–EE. UU. (BOE 22/12/1990, Protocolo en vigor 27/11/2019) ordena la doble imposición sobre dividendos, intereses y royalties; reduce la retención FDAP del 30 % al 15 % o 5 % en dividendos según participación. Cuentas bancarias en EE. UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022). Operaciones vinculadas y dividendos repatriados: **Modelo 232**.

### Errores frecuentes al elegir vehículo

- **Pensar que la S-Corp es "una LLC mejorada"**: no lo es. Es una elección fiscal exclusiva para US persons. Si eres no residente, ni la consideres.
- **Constituir una C-Corp "porque suena más serio"** sin necesidad real de capital: pagas 21 % federal innecesariamente y complicas el cumplimiento sin contrapartida.
- **Convertir LLC a C-Corp sin asesoría**: si no se cumple IRC §351, la conversión dispara hechos imponibles inmediatos sobre el valor de mercado de la LLC.
- **Elegir Delaware "porque es famoso"** cuando una WY/NM cuesta 5 veces menos en mantenimiento anual y aporta el mismo blindaje fiscal para un freelancer no residente.

La elección correcta depende de tu plan a 3-5 años, no de la moda del foro de turno.

<!-- exentax:calc-cta-v1 -->
> <a href="/es/servicios">Descubre si una LLC es para ti</a>
<!-- /exentax:calc-cta-v1 -->

En Exentax revisamos tu caso con datos reales y te decimos si compensa LLC, C-Corp o ninguna estructura US. <a href="/es/agendar">Agenda una consulta gratuita</a> de 30 minutos y salimos con un plan claro.

_Para ampliar en la misma serie: [constituir una SL en España: costes y ventajas](/es/blog/sociedad-limitada-espana-costes-ventajas), [la cuota de autónomo por tramos de ingresos](/es/blog/cuota-autonomo-2026), [los tramos del IRPF actualizados](/es/blog/tramos-irpf-2026)._

<!-- related-inline-stripped-2026-04 -->

<!-- exentax:execution-v2 -->
## Cómo lo resolvemos con el método Exentax

Lo que vemos cada semana en los casos que nos llegan es el mismo patrón: la duda se queda en ideas sueltas, la decisión se posterga y, cuando llega el cierre del ejercicio, se pagan más impuestos de los necesarios o se asumen riesgos que no compensan. El problema casi nunca es la norma; es la falta de un plan por escrito con números reales, firmado por alguien que entienda tu caso de punta a punta.

**Lo que la gente hace mal**
- Copia estructuras vistas en redes sin modelar su propio caso con ingresos, residencia y clientes en la mano.
- Mezcla dinero personal con el de la actividad y pierde la traza documental que cualquier inspección exige.
- Confía la operativa a gestorías que solo rellenan modelos, sin pensar en la estrategia anual ni en el coste total.

**Lo que funciona de verdad**
- Modelar tu situación en la <strong>calculadora Exentax</strong> antes de mover una sola pieza, para ver el coste total anual y no solo la factura de hoy.
- Separar desde el primer día los flujos de dinero, con cuentas distintas y una checklist viva de justificantes.
- Trabajar con un asesor que mire las piezas juntas: estructura, banca, cumplimiento y residencia, no cada una por su cuenta.

Si quieres pasar de la duda al plan, agenda 30 minutos con Exentax y salimos de la llamada con los números cerrados y el calendario operativo.
<!-- /exentax:execution-v2 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22Diferencia%20entre%20LLC%2C%20Corporation%2C%20S-Corp%20y%20C-Corp%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si tu plan es montar la LLC en Delaware, repasa nuestra página de servicio <a href="/es/servicios/llc-delaware">LLC en Delaware</a> con costes, plazos y siguientes pasos concretos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Comparamos Nuevo México, Wyoming, Delaware y Florida sobre tu caso real, sin venderte el estado de moda. <a href="/es/servicios/llc-delaware">Comparar mi caso con un asesor</a>.
<!-- /exentax:cta-v1 -->
`;
