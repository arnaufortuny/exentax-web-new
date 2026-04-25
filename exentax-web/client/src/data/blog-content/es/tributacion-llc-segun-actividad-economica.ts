export default `

Hablar de "fiscalidad de la LLC" en abstracto lleva a errores graves: la fiscalidad real depende muy estrechamente del **tipo de actividad económica** que desarrolla la LLC, porque cada actividad activa reglas distintas de IVA, calificación de rentas, fuente de la renta, CDI aplicable y, sobre todo, exposición a transparencia fiscal internacional o reglas anti-elusión. Vamos a desglosar las cinco grandes familias que vemos en Exentax.

## Puntos clave

### 1. Servicios profesionales (consultoría, desarrollo, diseño, marketing)

Es el caso más común y el más sencillo. Tu LLC factura servicios a clientes B2B internacionales (USA, UE, LATAM). Características:

- **Naturaleza renta**: actividad económica.
- **Calificación España (residente)**: rendimiento de actividad económica imputable al socio (vía atribución de rentas, ver <a href="/es/blog/boe-febrero-2020-llc-doctrina-administrativa">doctrina DGT/TEAC</a>).
- **IVA**: facturación B2B fuera de España con cliente comunitario, **inversión del sujeto pasivo** (el cliente se autoliquida el IVA en su país); con cliente USA u otro tercero, **operación no sujeta a IVA español** (regla de localización de servicios B2B). Profundizamos en <a href="/es/blog/iva-servicios-digitales-internacional">IVA en servicios digitales internacionales</a>.
- **IRPF España**: rendimiento neto en base general (24-47%).
- **Riesgo principal**: simulación si la sustancia operativa la aporta exclusivamente el socio residente español sin sustancia real en EE.UU.

**Optimización legítima**: maximizar gastos deducibles correctos en la LLC (software, herramientas, subcontratación, formación, marketing). El neto imputado al socio se reduce y el efectivo tipo medio cae sustancialmente respecto al autónomo puro español.
### 2. E-commerce físico (Amazon, Shopify, dropshipping)

Vendes bienes físicos a consumidores finales internacionales. Características:

- **Naturaleza renta**: actividad económica de venta.
- **IVA y aduanas**: complejo. Si vendes a consumidores europeos, la LLC puede tener obligación de **registro IVA** en países UE individualmente o usar el **régimen OSS / IOSS**. Si superas determinados umbrales por país, debes registrarte localmente. Marketplaces como Amazon actúan como **deemed supplier** en muchos casos y retienen IVA, pero no en todos.
- **DAC7**: como vendedor en Amazon, Etsy, eBay europeos, Amazon Europa reportará tus ingresos a la autoridad fiscal de Luxemburgo, que reenvía a la del país de los beneficiarios efectivos. Ver <a href="/es/blog/dac7-plataformas-digitales-reporting-2026">DAC7</a>.
- **Aduanas**: si la LLC importa stock a la UE para distribución (FBA), necesita **EORI europeo**, importador de registro, posible IOR (Importer of Record).
- **Sales tax USA**: si vendes a consumidores en estados con economic nexus, posible obligación de registro y recaudación de sales tax. Más en <a href="/es/blog/amazon-ecommerce-llc-vender-online">Amazon y ecommerce con LLC</a>.

**Riesgo principal**: ignorar el IVA UE o el sales tax USA puede generar una factura retroactiva muy importante.
### 3. SaaS y suscripciones digitales

Vendes acceso a software o contenido digital, B2C o B2B, en suscripción o pago único. Características:

- **Naturaleza renta**: actividad económica + cesión de uso de software (frontera con royalties).
- **Servicios prestados por vía electrónica (TBE)**: si vendes a consumidores europeos, sujetos a IVA en el país del consumidor. Régimen **OSS no UE** (la LLC se registra en un Estado miembro de identificación) o uso de plataformas que actúan como Merchant of Record (Paddle, FastSpring, DoDo Payments, Lemon Squeezy) que se encargan del IVA por ti.
- **B2B**: regla general de inversión del sujeto pasivo.
- **Calificación renta España**: rendimientos de actividad económica si hay desarrollo activo; si lo que cedes es licencia pasiva sobre código preexistente sin actividad operativa relevante, puede haber discusión sobre **transparencia fiscal internacional** (art. 100 LIS, vía art. 91 LIRPF).
- **Riesgo CFC/TFI**: si la LLC genera principalmente rentas pasivas (licencias) y carece de medios materiales y humanos en EE.UU. la AEAT puede aplicar transparencia fiscal internacional.

Más detalle en <a href="/es/blog/llc-desarrolladores-software-saas">LLC para desarrolladores de software y SaaS</a>.
### 4. Royalties y propiedad intelectual

Tu LLC titulariza derechos (marca, software, contenido) y los licencia a terceros o a otra entidad relacionada. Características:

- **Naturaleza renta**: rentas pasivas (royalties).
- **Calificación CDI**: art. 12 CDI España-EE.UU. (royalties). Generalmente, el Estado de la fuente puede gravar (con límite del % CDI), y el Estado de residencia grava con deducción.
- **Riesgo CFC**: alto. Las rentas pasivas son el supuesto típico de transparencia fiscal internacional. Si tu LLC tiene mayoritariamente rentas pasivas y tú la controlas y resides en España, art. 91 LIRPF (remisión a art. 100 LIS) puede activarse.
- **Tributación efectiva**: si se aplica TFI, tributas en España como si las rentas fueran tuyas directas, con deducción de cualquier impuesto pagado por la LLC (típicamente 0$ federal en Disregarded Entity).
- **Cláusula LOB CDI 2019**: dificulta acceso a beneficios del CDI a estructuras híbridas o sin sustancia.

**Conclusión**: una LLC pura de royalties con socio residente español debe diseñarse con sustancia real (medios materiales, personal, decisiones tomadas en EE.UU.) o reconocer que estará bajo TFI.
### 5. Trading (acciones, futuros, cripto)

Tu LLC opera mercados financieros con cuenta en Interactive Brokers, Tradovate o Kraken. Características:

- **Naturaleza renta**: depende del activo y del régimen. Trading FX y futuros: ganancias y pérdidas patrimoniales en muchos países; en España, si es habitual y profesional, puede recalificarse como actividad económica.
- **Acciones**: dividendos (rendimiento del capital mobiliario en base ahorro 19-28% si entidad opaca; si transparente, imputación directa) y ganancias por venta (base ahorro).
- **Cripto**: ganancias y pérdidas patrimoniales (base ahorro) o actividad económica si trading frecuente y profesional.
- **DAC8**: aplica recientemente si operas con exchanges europeos. Ver <a href="/es/blog/dac8-criptomonedas-reporting-fiscal-2026">DAC8 y criptomonedas</a>.
- **Riesgo CFC**: muy alto. Los rendimientos de cartera son el ejemplo paradigmático de renta pasiva sometida a TFI.
- **Convenio**: art. 10 (dividendos), art. 11 (intereses), art. 13 (ganancias capital). Las cláusulas LOB del Protocolo 2019 son especialmente restrictivas para estructuras de inversión sin sustancia.

Más detalle en <a href="/es/blog/criptomonedas-trading-llc-impuestos">criptomonedas y trading con LLC</a>.
### Cuadro resumen por actividad

| Actividad | Calificación España (típica) | IVA | Riesgo CFC/TFI | Riesgo simulación | Idoneidad LLC pura |
| --- | --- | --- | --- | --- | --- |
| Servicios profesionales B2B | Actividad económica imputada | Inversión sujeto pasivo | Bajo | Medio | Alta |
| E-commerce | Actividad económica imputada | Complejo (OSS/IOSS, sales tax) | Bajo | Medio | Alta con cuidado |
| SaaS B2B | Actividad económica imputada | Inversión sujeto pasivo | Medio | Medio | Alta |
| SaaS B2C TBE | Actividad económica imputada | OSS no UE / MoR | Medio-alto | Medio | Media-alta |
| Royalties | Renta pasiva | Generalmente exento o ISP | Alto | Alto | Baja sin sustancia |
| Trading financiero | Rentas pasivas / ganancias capital | n/a | Muy alto | Alto | Baja sin sustancia |
### Cómo decidir tu estructura óptima

La elección de LLC sin más no es siempre la respuesta correcta. Para actividades de bajo riesgo CFC (servicios, e-commerce, SaaS B2B), una **Single-Member LLC** con socio residente español, declarando bien y con sustancia razonable, es eficiente y defendible. Para actividades de alto riesgo CFC (royalties, trading), o se dota de **sustancia real en EE.UU.** o se considera estructurar de otra forma (S.L. española operativa + LLC con actividad limitada, planificación de residencia, etc.). Marco completo en <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">diseño de estructura internacional sólida</a>.
### Errores típicos por actividad

- **Servicios**: olvidarse de IVA intracomunitario y registro ROI/VIES.
- **E-commerce**: ignorar OSS/IOSS y sales tax USA hasta que llega la liquidación.
- **SaaS**: no usar Merchant of Record y acabar con obligación de registro IVA en cada país UE.
- **Royalties**: no documentar la creación, titularidad y mantenimiento de los activos intangibles.
- **Trading**: confundir trading personal con trading desde LLC y mezclar cuentas.

Más sobre cómo evitar errores típicos en <a href="/es/blog/riesgos-fiscales-mala-estructuracion-internacional">riesgos fiscales</a>.
### En resumen

Una LLC no tributa "de una manera": tributa según lo que hace, dónde lo hace y desde dónde se controla. La conversación seria de planificación fiscal empieza por entender tu actividad real, no por elegir un país en un mapa.

<!-- exentax:calc-cta-v1 -->
> <a href="/es/servicios">Empieza hoy 100% online</a>
<!-- /exentax:calc-cta-v1 -->

¿Quieres que analicemos cómo tributa exactamente tu actividad y te diseñemos la estructura más eficiente y defendible? Agenda tu asesoría gratuita.
Para seguir profundizando, <a href="/es/blog/autonomos-espana-por-que-dejar-de-serlo">Por qué dejar de ser autónomo en España (y qué alternativas tienes)</a> complementa lo que hemos visto aquí con detalles que merecían su propio artículo.

<!-- exentax:legal-refs-v1 -->
## Referencias: fuentes técnicas y normativa aplicable

Las cifras, modelos y umbrales mencionados se extraen de las siguientes referencias actualizadas actualmente:

- **Tributación de la actividad.** IRC §864 y §882 (efectivamente conectado con actividad en EE. UU., ECI), Treas. Reg. §301.7701-3 (clasificación de la LLC) y Form 5472 + 1120 pro-forma para LLC unipersonales no residentes.
- **IVA y ventas internacionales.** Directiva 2006/112/CE del IVA, Reglamento de Ejecución 282/2011, régimen OSS/IOSS y Ventanilla Única para servicios digitales B2C en la UE; instrucciones del Modelo 369 de la AEAT.
- **Plataformas marketplace.** Términos publicados por Amazon Seller Central (incluido el VAT Calculation Service y la responsabilidad sobre IVA en la UE conforme al art. 14 bis Directiva 2006/112), Stripe Tax, Paddle (Merchant of Record), DoDo Payments y PayPal Business.
- **DAC7.** Directiva (UE) 2021/514 de cooperación administrativa en plataformas digitales, traspuesta al ordenamiento español por RD 117/2024.
- **España residentes.** Ley 35/2006 LIRPF (art. 100 TFI), Ley 27/2014 LIS y Ley 37/1992 del IVA.

Información divulgativa; el tratamiento concreto depende del país de residencia del titular y del país de tus clientes.

<!-- exentax:execution-v2 -->
## Tributación de la LLC según actividad económica: por qué un SaaS, una agencia y un e-commerce no son lo mismo

La fiscalidad federal US para una LLC de no residente no depende solo de tu residencia, depende también de qué hace la LLC. La regla "non-effectively connected = 0%" no es uniforme: el <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> aplica reglas de sourcing diferentes según el tipo de renta, y eso clasifica tu LLC como ETBUS (engaged in trade or business in US) o como passive foreign vehicle. Aquí está cómo se ve cada actividad típica.

- **SaaS y software (suscripciones digitales).** Renta clasificada como business income, sourced según donde se desarrolla y se opera el software. Si el founder no reside en US y los servidores no son obligatoriamente US (cloud regional indistinto), default = foreign-source income → 0% federal. Riesgo: si contratas dependent agent US (VP of Sales asalariado en US, no contractor independiente), pasa a ETBUS.
- **Agencia digital (servicios profesionales).** Renta clasificada como personal services income, sourced donde se prestan los servicios físicamente. Si tú estás en España trabajando para clientes US, la fuente es España (donde se realiza el servicio), NO US, aunque el cliente sea US. Default: 0% federal. Excepción: si tu equipo está en US o tienes office en US, sourcing US y pasa a ETBUS.
- **E-commerce (productos físicos).** Triple análisis: (1) Inventario US (Amazon FBA, 3PL US): puede crear ETBUS según sustancia. (2) Inventario fuera de US dropshipped a US: usualmente foreign-source y 0%. (3) Marketplaces (Amazon Seller US): cobras ya neto de impuestos sales tax retenidos por Amazon, pero el income federal sigue tu sourcing. FBA + dependent agent = riesgo ETBUS muy alto.
- **Inversión y trading (capital gains, dividendos).** Plusvalías de bolsa US para LLC de no residente: 0% federal por excepción específica (capital gains de portfolio investment están exentas para no residentes sin trade or business). Dividendos US: 30% retención por defecto, reducida a 15%/0% bajo treaty con W-8BEN-E. Cripto: tratado como property, mismas reglas que capital gains; foreign-source y 0% si no es ETBUS.

### Lo que más nos preguntan

**Si vendo cursos digitales a clientes US, ¿es US-source income?** No por defecto. Cursos digitales son personal services + intellectual property licence, sourced donde se desarrollan (tu residencia). Vender a un cliente US no convierte la renta en US-source. Sigue siendo 0% federal si no hay ETBUS.

**¿Amazon FBA me convierte automáticamente en ETBUS?** Hay debate técnico. Posición conservadora: sí, porque el inventario en warehouse Amazon US puede interpretarse como dependent agent + fixed place of business. Posición más permisiva: depende del control efectivo. La práctica seria es asumir ETBUS y planificar accordingly o cambiar a fulfillment fuera de US.

En Exentax modelamos cada actividad por reglas de sourcing y ETBUS test antes de constituir, para no descubrir a los dos años que pagas 21% federal cuando creías 0%.
<!-- /exentax:execution-v2 -->

## Te lo montamos sin que pierdas un fin de semana

Miles de freelancers y emprendedores ya operan con su LLC americana de forma 100% legal y documentada. En Exentax nos encargamos de todo el proceso: constitución, banca, pasarelas de pago, contabilidad, declaraciones IRS y compliance en tu país de residencia. Agenda una asesoría gratuita y te diremos con sinceridad si la LLC tiene sentido para tu caso, sin promesas absolutas.

¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22tributacion%20llc%20segun%20actividad%20economica%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si quieres ver el detalle del proceso completo, repasa nuestra <a href="/es/servicios">página de servicios</a> con todo lo que incluimos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Constitución, EIN, BOI, banca y mantenimiento: un único equipo que entiende tu caso de principio a fin. <a href="/es/servicios">Ver todos los servicios</a>.
<!-- /exentax:cta-v1 -->

`;
