export default `Revolut Business es uno de los neobancos europeos más utilizados por emprendedores con estructuras internacionales, y en particular por dueños de <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americanas</a> que necesitan operar en EUR, GBP y otras divisas con tarjetas físicas y virtuales europeas. Pero Revolut también es una entidad financiera europea sujeta al **Common Reporting Standard (CRS)**, y eso tiene consecuencias muy concretas que casi nadie te cuenta antes de abrir la cuenta.

  ## Qué entidades de Revolut son y dónde reportan

  Revolut no es una sola empresa. El grupo opera mediante varias entidades reguladas según geografía y producto:

  - **Revolut Bank UAB** (Lituania): banco con licencia plena del Banco Central de Lituania (Lietuvos Bankas) y pasaporte europeo. Es la entidad principal para clientes en el Espacio Económico Europeo desde 2021. Reporta CRS a la **Valstybinė mokesčių inspekcija (VMI)** lituana, que a su vez activa el intercambio bilateral con AEAT, SAT, DIAN, AFIP y demás autoridades adheridas.
  - **Revolut Ltd** (Reino Unido): EMI (Electronic Money Institution) regulada por la FCA. Tras el Brexit, Reino Unido mantiene su régimen propio de CRS y sigue intercambiando con la UE. Reporta a HMRC.
  - **Revolut Payments UAB**: EMI lituana para operativa de payments en EEE.
  - Filiales en Singapur, Australia, EE.UU. y otros mercados con sus propios reguladores.

  La consecuencia práctica: si abres Revolut Business como cliente español, mexicano, colombiano o argentino, tu cuenta normalmente está bajo Revolut Bank UAB (Lituania) y por tanto la información se envía vía VMI lituana al país de residencia fiscal que conste en tu autodeclaración CRS. El cruce posterior con tu hacienda es automático.

  ## Marco normativo aplicable

  - **OCDE**: Common Reporting Standard 2014, con comentarios oficiales actualizados.
  - **UE**: Directiva 2011/16/UE (DAC) modificada por la DAC2 (Directiva 2014/107/UE), que internaliza CRS en derecho de la Unión.
  - **Lituania**: Ley sobre intercambio automático de información financiera con fines fiscales (Įstatymas dėl automatinio finansinės sąskaitos informacijos mainų), implementación nacional del CRS y de la DAC2.
  - **España receptora**: Real Decreto 1021/2015, Modelo 720, Modelo 721 desde 2024 para criptoactivos. Ver detalles en nuestro artículo sobre <a href="/es/blog/crs-residentes-espana-latam-implicaciones">CRS para residentes en España y LATAM</a>.

  ## Qué información concreta envía Revolut

  Como cualquier Reporting Financial Institution sujeta a CRS, Revolut Bank UAB reporta anualmente:

  | Bloque | Datos transmitidos |
  | --- | --- |
  | Identificación titular | Nombre completo, dirección, país de residencia fiscal declarado, NIF/TIN, fecha y lugar de nacimiento (personas físicas) |
  | Identificación entidad | Si la cuenta es titularidad de empresa (típico de Revolut Business): razón social, dirección registrada, EIN/NIF, clasificación CRS (Active NFE, Passive NFE, Investment Entity, etc.) |
  | Beneficiarios efectivos | En cuentas titularidad de Passive NFE: datos de los **controlling persons** (umbral del 25% de control directo o indirecto, o control efectivo por otros medios) |
  | Datos de cuenta | IBAN, número de cuenta, identificador interno de la entidad |
  | Saldos | Saldo a 31 de diciembre del ejercicio reportado o a fecha de cancelación |
  | Movimientos | Para cuentas de depósito: intereses brutos abonados durante el año. Para cuentas de custodia: dividendos brutos, intereses brutos, otros ingresos brutos, e ingresos brutos por venta o reembolso de activos financieros |

  Revolut **no envía detalle transacción a transacción**: envía agregados anuales. Pero el saldo a cierre es suficiente para que la AEAT detecte si superas el umbral del Modelo 720 (50.000 €) o del Modelo 721 si tienes saldos en cripto vinculados.

  ## El caso de la LLC con cuenta Revolut Business

  Aquí está el punto crítico. Si tu LLC americana abre una cuenta Revolut Business como cliente europeo (típicamente con dirección operativa europea, tarjeta enviada a Europa o representante en Europa), Revolut realizará la due diligence CRS sobre la **entidad** (la LLC) y, salvo que pueda clasificar la LLC como Active NFE con documentación robusta, la tratará como **Passive NFE**.

  ¿Qué implica eso? Que Revolut está **obligada por la normativa CRS** a identificar a los controlling persons (tú, como propietario de la LLC) y reportar:

  - Los datos de la LLC al país de residencia fiscal de la LLC (EE.UU., que **no participa** en CRS, por lo que el dato se queda en VMI Lituania sin destinatario activo en EE.UU.).
  - Los datos de los controlling persons al país de residencia fiscal de cada controlling person. Es decir: a tu hacienda si eres residente en España, México, Colombia, Argentina, etc.

  Esto significa que, aunque la LLC sea estadounidense, el dato sobre tu titularidad y el saldo de la cuenta llegará a tu hacienda nacional. La barrera FATCA-no-CRS de EE.UU. no protege la información si la cuenta operativa está en Europa.

  ## Cómo se determina la clasificación de tu LLC

  Revolut te pedirá completar un formulario de autodeclaración (CRS Self-Certification) en el alta. Ahí declaras:

  - Si la LLC es Active NFE o Passive NFE.
  - Quién es controlling person.
  - País(es) de residencia fiscal de la entidad y de los controlling persons.

  Una **Active NFE** es aquella en la que menos del 50% de sus ingresos son rentas pasivas (dividendos, intereses, alquileres, royalties no operativos, ganancias de inversión) y menos del 50% de sus activos producen o se mantienen para producir rentas pasivas. Una LLC de servicios profesionales típica que factura consultoría o desarrollo cumple los criterios de Active NFE.

  Sin embargo, en la práctica Revolut tiende a aplicar criterios conservadores y, ante duda o documentación insuficiente, clasifica como Passive NFE. La consecuencia es la misma: reporta al beneficiario efectivo.

  ## Qué pasa si declaras mal la residencia fiscal

  Si declaras "residencia fiscal en Andorra" en el alta CRS pero Revolut detecta indicios de que vives en España (IP recurrente, dirección de envío de tarjeta, número de teléfono español, transferencias periódicas a cuentas en España), aplicará el procedimiento de **change in circumstances** (RD 1021/2015, art. 4 y Anexo I CRS): te pedirá un certificado de residencia fiscal o, en su defecto, te reportará a ambas jurisdicciones. La autodeclaración falsa puede constituir infracción tributaria y, según el caso, delito.

  ## Cómo planificar correctamente con Revolut Business

  1. **No uses Revolut como cuenta principal de la LLC si quieres minimizar la huella CRS hacia tu país.** Mercury (EE.UU.) sigue siendo la opción óptima como cuenta principal. Revolut tiene sentido como cuenta secundaria para necesidades específicas (tarjetas físicas en Europa, conversión EUR/GBP rápida, débito SEPA).
  2. **Si usas Revolut, declara correctamente y prepárate para que el dato llegue.** Es la única forma profesional. Lo desarrollamos en <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">cómo diseñar una estructura internacional sólida</a>.
  3. **Mantén coherencia documental.** Tu autodeclaración CRS, tu Modelo 720 y tu IRPF deben contar la misma historia.
  4. **Conoce los riesgos.** Si declaras mal, las consecuencias se materializan tarde pero llegan, como explicamos en <a href="/es/blog/riesgos-fiscales-mala-estructuracion-internacional">riesgos fiscales de una mala estructuración internacional</a>.
  5. **Revisa el calendario de saldos.** Revolut reporta el saldo a 31 de diciembre. Si no quieres triggers innecesarios del Modelo 720, gestiona el saldo de cierre con criterio operativo, no de "ocultación" (que es ilegal).

  ## Comparativa rápida: Revolut vs Mercury vs Wise frente a CRS

  | Plataforma | Jurisdicción reguladora | Sujeta a CRS | A quién reporta el dato del beneficiario español |
  | --- | --- | --- | --- |
  | Mercury | EE.UU. (Column NA) | No (FATCA solo) | Nadie por CRS; FATCA solo para US persons |
  | Revolut Business | Lituania (Revolut Bank UAB) | Sí | AEAT vía VMI Lituania |
  | Wise Business | Bélgica (Wise Europe SA, autoridad NBB) | Sí | AEAT vía autoridad belga |
  | Wallester | Estonia | Sí | AEAT vía autoridad estonia |
  | N26 Business | Alemania (BaFin) | Sí | AEAT vía Bundeszentralamt für Steuern |

  Ampliamos la comparativa Wise en nuestro <a href="/es/blog/wise-business-crs-reporting-fiscal">artículo dedicado a Wise y CRS</a>, y la comparativa general de plataformas en <a href="/es/blog/bancos-vs-fintech-llc-donde-abrir-cuenta">bancos vs fintech para tu LLC</a>.

  ## Consideraciones adicionales DAC7 y DAC8

  Si tu LLC vende a través de plataformas digitales (Amazon, Etsy, Airbnb, marketplaces SaaS), la <a href="/es/blog/dac7-plataformas-digitales-reporting-2026">DAC7</a> añade un canal informativo paralelo y complementario al CRS: las plataformas reportan tus ingresos directamente a las autoridades fiscales europeas. Y si operas con criptoactivos a través de exchanges europeos, la <a href="/es/blog/dac8-criptomonedas-reporting-fiscal-2026">DAC8</a> activa el equivalente del CRS para cripto desde 2026.

  ## En resumen

  Revolut Business es una herramienta excelente, pero entender su perfil de reporting CRS es imprescindible si tienes una LLC y eres residente fiscal en un país adherido al CRS. La clave no es evitar Revolut, es declarar bien y diseñar el stack para que la información que se reporta sea coherente con lo que tributas.

  ¿Quieres revisar tu stack bancario y entender qué se reporta a tu hacienda y cómo declararlo correctamente? Agenda tu asesoría gratuita y lo analizamos contigo.`;
