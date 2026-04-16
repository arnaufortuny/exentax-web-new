export default `Hablar de "fiscalidad de la LLC" en abstracto lleva a errores graves: la fiscalidad real depende muy estrechamente del **tipo de actividad económica** que desarrolla la LLC, porque cada actividad activa reglas distintas de IVA, calificación de rentas, fuente de la renta, CDI aplicable y, sobre todo, exposición a transparencia fiscal internacional o reglas anti-elusión. Vamos a desglosar las cinco grandes familias que vemos en Exentax.

  ## 1. Servicios profesionales (consultoría, desarrollo, diseño, marketing)

  Es el caso más común y el más sencillo. Tu LLC factura servicios a clientes B2B internacionales (USA, UE, LATAM). Características:

  - **Naturaleza renta**: actividad económica.
  - **Calificación España (residente)**: rendimiento de actividad económica imputable al socio (vía atribución de rentas, ver <a href="/es/blog/boe-febrero-2020-llc-doctrina-administrativa">doctrina DGT/TEAC</a>).
  - **IVA**: facturación B2B fuera de España con cliente comunitario, **inversión del sujeto pasivo** (el cliente se autoliquida el IVA en su país); con cliente USA u otro tercero, **operación no sujeta a IVA español** (regla de localización de servicios B2B). Profundizamos en <a href="/es/blog/iva-servicios-digitales-internacional">IVA en servicios digitales internacionales</a>.
  - **IRPF España**: rendimiento neto en base general (24-47%).
  - **Riesgo principal**: simulación si la sustancia operativa la aporta exclusivamente el socio residente español sin sustancia real en EE.UU.

  **Optimización legítima**: maximizar gastos deducibles correctos en la LLC (software, herramientas, subcontratación, formación, marketing). El neto imputado al socio se reduce y el efectivo tipo medio cae sustancialmente respecto al autónomo puro español.

  ## 2. E-commerce físico (Amazon, Shopify, dropshipping)

  Vendes bienes físicos a consumidores finales internacionales. Características:

  - **Naturaleza renta**: actividad económica de venta.
  - **IVA y aduanas**: complejo. Si vendes a consumidores europeos, la LLC puede tener obligación de **registro IVA** en países UE individualmente o usar el **régimen OSS / IOSS**. Si superas determinados umbrales por país, debes registrarte localmente. Marketplaces como Amazon actúan como **deemed supplier** en muchos casos y retienen IVA, pero no en todos.
  - **DAC7**: como vendedor en Amazon, Etsy, eBay europeos, Amazon Europa reportará tus ingresos a la autoridad fiscal de Luxemburgo, que reenvía a la del país de los beneficiarios efectivos. Ver <a href="/es/blog/dac7-plataformas-digitales-reporting-2026">DAC7</a>.
  - **Aduanas**: si la LLC importa stock a la UE para distribución (FBA), necesita **EORI europeo**, importador de registro, posible IOR (Importer of Record).
  - **Sales tax USA**: si vendes a consumidores en estados con economic nexus, posible obligación de registro y recaudación de sales tax. Más en <a href="/es/blog/amazon-ecommerce-llc-vender-online">Amazon y ecommerce con LLC</a>.

  **Riesgo principal**: ignorar el IVA UE o el sales tax USA puede generar una factura retroactiva muy importante.

  ## 3. SaaS y suscripciones digitales

  Vendes acceso a software o contenido digital, B2C o B2B, en suscripción o pago único. Características:

  - **Naturaleza renta**: actividad económica + cesión de uso de software (frontera con royalties).
  - **Servicios prestados por vía electrónica (TBE)**: si vendes a consumidores europeos, sujetos a IVA en el país del consumidor. Régimen **OSS no UE** (la LLC se registra en un Estado miembro de identificación) o uso de plataformas que actúan como Merchant of Record (Paddle, FastSpring, DoDo Payments, Lemon Squeezy) que se encargan del IVA por ti.
  - **B2B**: regla general de inversión del sujeto pasivo.
  - **Calificación renta España**: rendimientos de actividad económica si hay desarrollo activo; si lo que cedes es licencia pasiva sobre código preexistente sin actividad operativa relevante, puede haber discusión sobre **transparencia fiscal internacional** (art. 100 LIS, vía art. 91 LIRPF).
  - **Riesgo CFC/TFI**: si la LLC genera principalmente rentas pasivas (licencias) y carece de medios materiales y humanos en EE.UU., la AEAT puede aplicar transparencia fiscal internacional.

  Más detalle en <a href="/es/blog/llc-desarrolladores-software-saas">LLC para desarrolladores de software y SaaS</a>.

  ## 4. Royalties y propiedad intelectual

  Tu LLC titulariza derechos (marca, software, contenido) y los licencia a terceros o a otra entidad relacionada. Características:

  - **Naturaleza renta**: rentas pasivas (royalties).
  - **Calificación CDI**: art. 12 CDI España-EE.UU. (royalties). Generalmente, el Estado de la fuente puede gravar (con límite del % CDI), y el Estado de residencia grava con deducción.
  - **Riesgo CFC**: alto. Las rentas pasivas son el supuesto típico de transparencia fiscal internacional. Si tu LLC tiene mayoritariamente rentas pasivas y tú la controlas y resides en España, art. 91 LIRPF (remisión a art. 100 LIS) puede activarse.
  - **Tributación efectiva**: si se aplica TFI, tributas en España como si las rentas fueran tuyas directas, con deducción de cualquier impuesto pagado por la LLC (típicamente 0$ federal en Disregarded Entity).
  - **Cláusula LOB CDI 2019**: dificulta acceso a beneficios del CDI a estructuras híbridas o sin sustancia.

  **Conclusión**: una LLC pura de royalties con socio residente español debe diseñarse con sustancia real (medios materiales, personal, decisiones tomadas en EE.UU.) o reconocer que estará bajo TFI.

  ## 5. Trading (acciones, futuros, cripto)

  Tu LLC opera mercados financieros con cuenta en Interactive Brokers, Tradovate o Kraken. Características:

  - **Naturaleza renta**: depende del activo y del régimen. Trading FX y futuros: ganancias y pérdidas patrimoniales en muchos países; en España, si es habitual y profesional, puede recalificarse como actividad económica.
  - **Acciones**: dividendos (rendimiento del capital mobiliario en base ahorro 19-28% si entidad opaca; si transparente, imputación directa) y ganancias por venta (base ahorro).
  - **Cripto**: ganancias y pérdidas patrimoniales (base ahorro) o actividad económica si trading frecuente y profesional.
  - **DAC8**: aplica desde 2026 si operas con exchanges europeos. Ver <a href="/es/blog/dac8-criptomonedas-reporting-fiscal-2026">DAC8 y criptomonedas</a>.
  - **Riesgo CFC**: muy alto. Los rendimientos de cartera son el ejemplo paradigmático de renta pasiva sometida a TFI.
  - **Convenio**: art. 10 (dividendos), art. 11 (intereses), art. 13 (ganancias capital). Las cláusulas LOB del Protocolo 2019 son especialmente restrictivas para estructuras de inversión sin sustancia.

  Más detalle en <a href="/es/blog/criptomonedas-trading-llc-impuestos">criptomonedas y trading con LLC</a>.

  ## Cuadro resumen por actividad

  | Actividad | Calificación España (típica) | IVA | Riesgo CFC/TFI | Riesgo simulación | Idoneidad LLC pura |
  | --- | --- | --- | --- | --- | --- |
  | Servicios profesionales B2B | Actividad económica imputada | Inversión sujeto pasivo | Bajo | Medio | Alta |
  | E-commerce | Actividad económica imputada | Complejo (OSS/IOSS, sales tax) | Bajo | Medio | Alta con cuidado |
  | SaaS B2B | Actividad económica imputada | Inversión sujeto pasivo | Medio | Medio | Alta |
  | SaaS B2C TBE | Actividad económica imputada | OSS no UE / MoR | Medio-alto | Medio | Media-alta |
  | Royalties | Renta pasiva | Generalmente exento o ISP | Alto | Alto | Baja sin sustancia |
  | Trading financiero | Rentas pasivas / ganancias capital | n/a | Muy alto | Alto | Baja sin sustancia |

  ## Cómo decidir tu estructura óptima

  La elección de LLC sin más no es siempre la respuesta correcta. Para actividades de bajo riesgo CFC (servicios, e-commerce, SaaS B2B), una **Single-Member LLC** con socio residente español, declarando bien y con sustancia razonable, es eficiente y defendible. Para actividades de alto riesgo CFC (royalties, trading), o se dota de **sustancia real en EE.UU.** o se considera estructurar de otra forma (S.L. española operativa + LLC con actividad limitada, planificación de residencia, etc.). Marco completo en <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">diseño de estructura internacional sólida</a>.

  ## Errores típicos por actividad

  - **Servicios**: olvidarse de IVA intracomunitario y registro ROI/VIES.
  - **E-commerce**: ignorar OSS/IOSS y sales tax USA hasta que llega la liquidación.
  - **SaaS**: no usar Merchant of Record y acabar con obligación de registro IVA en cada país UE.
  - **Royalties**: no documentar la creación, titularidad y mantenimiento de los activos intangibles.
  - **Trading**: confundir trading personal con trading desde LLC y mezclar cuentas.

  Más sobre cómo evitar errores típicos en <a href="/es/blog/riesgos-fiscales-mala-estructuracion-internacional">riesgos fiscales</a>.

  ## En resumen

  Una LLC no tributa "de una manera": tributa según lo que hace, dónde lo hace y desde dónde se controla. La conversación seria de planificación fiscal empieza por entender tu actividad real, no por elegir un país en un mapa.

  ¿Quieres que analicemos cómo tributa exactamente tu actividad y te diseñemos la estructura más eficiente y defendible? Agenda tu asesoría gratuita.

Para seguir profundizando, <a href="/es/blog/autonomos-espana-por-que-dejar-de-serlo">Por qué dejar de ser autónomo en España (y qué alternativas tienes)</a> complementa lo que hemos visto aquí con detalles que merecían su propio artículo.
`;
