export default `

Revolut Business es uno de los neobancos europeos más utilizados por emprendedores con estructuras internacionales, y en particular por dueños de <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americanas</a> que necesitan operar en EUR, GBP y otras divisas con tarjetas físicas y virtuales europeas. Pero Revolut también es una entidad financiera europea sujeta al **Common Reporting Standard (CRS)**, y eso tiene consecuencias muy concretas que casi nadie te cuenta antes de abrir la cuenta.

## Qué entidades de Revolut son y dónde reportan

Revolut no es una sola empresa. El grupo opera mediante varias entidades reguladas según geografía y producto:

- **Revolut Bank UAB** (Lituania): banco con licencia plena del Banco Central de Lituania (Lietuvos Bankas) y pasaporte europeo. Es la entidad principal para clientes en el Espacio Económico Europeo desde 2021. Reporta CRS a la **Valstybinė mokesčių inspekcija (VMI)** lituana, que a su vez activa el intercambio bilateral con AEAT, SAT, DIAN, AFIP y demás autoridades adheridas.
- **Revolut Ltd** (Reino Unido): EMI (Electronic Money Institution) regulada por la FCA. Tras el Brexit, Reino Unido mantiene su régimen propio de CRS y sigue intercambiando con la UE. Reporta a HMRC.
- **Revolut Payments UAB**: EMI lituana para operativa de payments en EEE.
- Filiales en Singapur, Australia, EE.UU. y otros mercados con sus propios reguladores.

La consecuencia práctica: si abres Revolut Business como cliente español, mexicano, colombiano o argentino, tu cuenta normalmente está bajo Revolut Bank UAB (Lituania) y por tanto la información se envía vía VMI lituana al país de residencia fiscal que conste en tu autodeclaración CRS. El cruce posterior con tu hacienda es automático.
### Marco normativo aplicable

- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>**: Common Reporting Standard 2014, con comentarios oficiales actualizados.
- **UE**: Directiva 2011/16/UE (DAC) modificada por la DAC2 (Directiva 2014/107/UE), que internaliza CRS en derecho de la Unión.
- **Lituania**: Ley sobre intercambio automático de información financiera con fines fiscales (Įstatymas dėl automatinio finansinės sąskaitos informacijos mainų), implementación nacional del CRS y de la DAC2.
- **España receptora**: Real Decreto 1021/2015, <a href="/es/blog/modelo-720-721-residentes-espana-cuentas-cripto-extranjero">Modelo 720 y Modelo 721</a> en vigor para criptoactivos. Ver detalles en nuestro artículo sobre <a href="/es/blog/crs-residentes-espana-latam-implicaciones">CRS para residentes en España y LATAM</a>.
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

- Los datos de la LLC al país de residencia fiscal de la LLC (EE.UU. que **no participa** en CRS, por lo que el dato se queda en VMI Lituania sin destinatario activo en EE.UU.).
- Los datos de los controlling persons al país de residencia fiscal de cada controlling person. Es decir: a tu hacienda si eres residente en España, México, Colombia, Argentina, etc.

Esto significa que, aunque la LLC sea estadounidense, el dato sobre tu titularidad y el saldo de la cuenta llegará a tu hacienda nacional. La barrera FATCA-no-CRS de EE.UU. no protege la información si la cuenta operativa está en Europa.
### Cómo se determina la clasificación de tu LLC

Revolut te pedirá completar un formulario de autodeclaración (CRS Self-Certification) en el alta. Ahí declaras:

- Si la LLC es Active NFE o Passive NFE.
- Quién es controlling person.
- País(es) de residencia fiscal de la entidad y de los controlling persons.

Una **Active NFE** es aquella en la que menos del 50% de sus ingresos son rentas pasivas (dividendos, intereses, alquileres, royalties no operativos, ganancias de inversión) y menos del 50% de sus activos producen o se mantienen para producir rentas pasivas. Una LLC de servicios profesionales típica que factura consultoría o desarrollo cumple los criterios de Active NFE.

Sin embargo, en la práctica Revolut tiende a aplicar criterios conservadores y, ante duda o documentación insuficiente, clasifica como Passive NFE. La consecuencia es la misma: reporta al beneficiario efectivo.
### Qué pasa si declaras mal la residencia fiscal

Si declaras "residencia fiscal en Andorra" en el alta CRS pero Revolut detecta indicios de que vives en España (IP recurrente, dirección de envío de tarjeta; número de teléfono español; transferencias periódicas a cuentas en España), aplicará el procedimiento de **change in circumstances** (RD 1021/2015, art. 4 y Anexo I CRS): te pedirá un certificado de residencia fiscal o, en su defecto, te reportará a ambas jurisdicciones. La autodeclaración falsa puede constituir infracción tributaria y, según el caso, delito.
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
### Consideraciones adicionales DAC7 y DAC8

Si tu LLC vende a través de plataformas digitales (Amazon, Etsy, Airbnb, marketplaces SaaS), la <a href="/es/blog/dac7-plataformas-digitales-reporting-2026">DAC7</a> añade un canal informativo paralelo y complementario al CRS: las plataformas reportan tus ingresos directamente a las autoridades fiscales europeas. Y si operas con criptoactivos a través de exchanges europeos, la <a href="/es/blog/dac8-criptomonedas-reporting-fiscal-2026">DAC8</a> activa el equivalente del CRS para cripto recientemente.
### En resumen

Revolut Business es una herramienta excelente, pero entender su perfil de reporting CRS es imprescindible si tienes una LLC y eres residente fiscal en un país adherido al CRS. La clave no es evitar Revolut, es declarar bien y diseñar el stack para que la información que se reporta sea coherente con lo que tributas.

¿Quieres revisar tu stack bancario y entender qué se reporta a tu hacienda y cómo declararlo correctamente? Agenda tu asesoría gratuita y lo analizamos contigo.
## Compliance fiscal en tu país: CFC, TFI y atribución de rentas

Una LLC americana es una herramienta legal y reconocida internacionalmente. Pero el cumplimiento no termina al constituirla: como propietario residente fiscal en otro país, tu administración tributaria sigue teniendo derecho a gravar lo que la LLC genera. Lo importante es saber **bajo qué régimen** aplica esa tributación.

### Por jurisdicción

- **España (LIRPF/LIS).** Si la LLC es una *Single-Member Disregarded Entity* operativa (servicios reales, sin pasividad significativa), Hacienda suele tratarla por **atribución de rentas (art. 87 LIRPF)**: los beneficios netos se imputan al socio en el ejercicio en que se generan, integrándose en la base general del IRPF. Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada por residente español con rentas mayoritariamente pasivas, puede activarse el régimen de **transparencia fiscal internacional (art. 91 LIRPF para personas físicas, art. 100 LIS para sociedades)**. La diferencia entre uno u otro régimen no es opcional: depende de la sustancia económica, no del nombre.
- **Modelos informativos.** Cuentas bancarias en EE. UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022; sanciones ahora dentro del régimen general LGT). Operaciones vinculadas con la LLC y dividendos repatriados: **Modelo 232**. Criptoactivos custodiados en EE. UU.: **Modelo 721**.
- **CDI España–EE. UU.** El convenio (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocolo en vigor 27/11/2019) ordena la doble imposición sobre dividendos, intereses y royalties. Una LLC sin establecimiento permanente en España no constituye, por sí sola, EP del socio, pero la dirección efectiva sí puede crearlo si toda la gestión se hace desde territorio español.
- **México, Colombia, Argentina y otros LATAM.** Cada jurisdicción tiene su propio régimen CFC (México: Refipres; Argentina: rentas pasivas del exterior; Chile: art. 41 G LIR). El principio común: lo que la LLC retiene como beneficio se considera percibido por el socio si la entidad se considera transparente o controlada.

<!-- exentax:calc-cta-v1 -->
> <a href="/es/agendar">Consulta gratuita sin compromiso</a>
<!-- /exentax:calc-cta-v1 -->

La regla práctica: una LLC operativa, con sustancia, declarada correctamente en residencia, es **planificación fiscal legítima**. Una LLC que se usa para ocultar ingresos, simular no residencia o desplazar rentas pasivas sin justificación económica entra en el terreno del **art. 15 LGT (conflicto en aplicación de la norma)** o, en el peor caso, del **art. 16 LGT (simulación)**. La diferencia la marcan los hechos, no el papel.
En Exentax montamos la estructura para que encaje en el primer escenario y documentamos cada paso para que tu declaración local sea defendible ante una eventual revisión.

<!-- exentax:banking-facts-v1 -->
## Hechos bancarios y fiscales que conviene precisar

La información sobre fintech y CRS evoluciona y queremos que la tengas tal cual está hoy:

### Notas por proveedor

- **Mercury** opera con varios bancos asociados con licencia federal y cobertura **FDIC** vía sweep network: principalmente **Choice Financial Group** y **Evolve Bank & Trust**, además de **Column N.A.** en algunos casos heredados. Mercury no es un banco; es una plataforma fintech respaldada por esos partner banks. Si Mercury cierra una cuenta, el saldo se devuelve normalmente **mediante cheque a la dirección registrada del titular** y eso puede ser un problema operativo serio para no residentes; conviene tener una cuenta secundaria activa (Relay, Wise Business, etc.) como contingencia.
- **Wise** distribuye dos productos distintos: **Wise Personal** (cuenta personal) y **Wise Business** (cuenta para empresas, incluida tu LLC). Para una LLC se debe abrir **Wise Business**, no la personal. Matiz importante de CRS: una **Wise Business titularidad de una LLC estadounidense queda fuera del CRS** porque la titular es una entidad de EE. UU. y EE. UU. no es jurisdicción CRS; el lado USD opera vía Wise US Inc. (perímetro FATCA, no CRS). En cambio, una **Wise Personal abierta por un individuo residente fiscal en España** u otra jurisdicción CRS **sí genera reporte CRS** vía Wise Europe SA (Bélgica) sobre ese individuo. Si abres Wise para tu LLC, esa cuenta no te incluye en CRS por la LLC; si además mantienes una Wise Personal a tu nombre como residente en CRS, esa segunda sí reporta.
- **Wallester** (Estonia) es una entidad financiera europea con licencia EMI/banco emisor de tarjetas. Sus cuentas IBAN europeas **están dentro del Estándar Común de Comunicación de Información (CRS)** y, por tanto, generan reporte automático a la administración tributaria del país de residencia del titular.
- **Payoneer** opera con entidades europeas (Payoneer Europe Ltd, Irlanda) que también **están dentro de CRS** para clientes residentes en jurisdicciones que aplican el estándar.
- **Revolut Business**: cuando se asocia a una **LLC estadounidense**, lo habitual es operar bajo Revolut Payments USA; los IBAN europeos (lituanos, BE) **no se emiten por defecto** a una LLC: se emiten a clientes europeos del banco europeo del grupo. Si te ofrecen un IBAN europeo, asegúrate de a qué entidad jurídica está asociada esa cuenta y bajo qué régimen reporta.
- **Tributación cero**: ninguna estructura LLC consigue "cero impuestos" si vives en un país con CFC/transparencia fiscal o atribución de rentas. Lo que se consigue es **no duplicar tributación** y **declarar correctamente en residencia**, no eliminarla.

<!-- exentax:legal-refs-v1 -->
## Referencias: fuentes y normativa de banca

Toda la operativa bancaria descrita se apoya en documentación pública y políticas vigentes de cada plataforma actualmente:

- **Bank Secrecy Act y <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>.** 31 U.S.C. §5318 (programas KYC/AML obligatorios para instituciones financieras), 31 CFR Part 1010 (CIP, identificación del cliente) y 31 U.S.C. §5336 con su Reporting Rule de FinCEN del 1 de enero de 2024 (Beneficial Ownership Information Report).
- **FATCA y CRS.** IRC §1471-1474 (FATCA y formularios W-8/W-9), Acuerdos Intergubernamentales Modelo 1 firmados por EE. UU. con España y otros países LATAM, y el Estándar Común de Reporte (CRS) de la OCDE en el que EE. UU. no participa pero que sí aplica a fintech con licencia europea (Wise Europe SA en Bélgica, Revolut Bank UAB en Lituania).
- **Plataformas concretas.** Términos de servicio publicados, política de privacidad y FAQ regulatoria de Mercury (Choice Financial Group / Evolve Bank, FDIC), Relay (Thread Bank, FDIC), Wise Business (FinCEN MSB en EE. UU.; Wise Europe SA en EU; Wise Payments Ltd. en UK), Revolut Business y Payoneer.

Información a efectos divulgativos; cada caso bancario requiere análisis específico de KYC, jurisdicción de residencia y volumen operado.

<!-- exentax:execution-v2 -->
## Revolut Business y CRS: qué reporta a tu Hacienda y cómo se ve desde el otro lado

Revolut Business es práctico, multidivisa y barato - y reporta sistemáticamente bajo el Common Reporting Standard como cualquier banco europeo. Si abres Revolut Business para tu LLC creyendo que "es fintech, no banco" y por tanto no reporta, te equivocas. Esto es lo que se manda, cuándo y cómo aparece el dato en tu Hacienda.

- **Régimen CRS de Revolut Business.** Revolut Bank UAB (la entidad que aloja Revolut Business UE) es entidad financiera reportante bajo CRS desde su licencia bancaria lituana. Reporta anualmente al Banco de Lituania, que comparte con el resto de jurisdicciones CRS - incluido el Estado de residencia fiscal del beneficial owner declarado. España, Francia, Italia, Alemania, Portugal reciben el dato puntualmente cada año.
- **Qué dato exacto se transmite.** Identificación del titular (Revolut conoce al UBO por KYC: nombre, DNI/pasaporte, dirección, residencia fiscal declarada en el onboarding), saldo a 31 de diciembre, total de movimientos brutos del año (suma de entradas), e identificador de cuenta (IBAN LT del Revolut Business). NO se transmiten transacciones individuales, sí los agregados.
- **Por qué tu Hacienda lo cruza con el 720.** España exige Modelo 720 si la suma de cuentas extranjeras supera 50.000€ a 31/12 o saldo medio del último trimestre. Si tu Revolut Business tiene 60k€ y no presentas 720, Hacienda recibe el dato vía CRS y compara con tu declaración. Diferencia = expediente automático con sanción de imputación (50% del importe) e intereses.
- **Lo que sí cambia frente a un banco tradicional US.** Revolut Business UE reporta CRS automáticamente y rápido (Q1 del año siguiente). Mercury y Wise USD reportan FATCA al <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> y, vía intercambio bilateral con tu país, llega también pero con más latencia. Operativamente: Revolut acelera la visibilidad de Hacienda sobre tu LLC; Mercury la ralentiza, pero no la elimina.

### Lo que más nos preguntan

**¿Si abro Revolut Business como LLC US, lo reporta a US o a mi país?** Reporta al país de residencia fiscal del UBO declarado. Si dijiste España en el KYC, va a España vía CRS, no a US (la LLC es disregarded a efectos UBO; mira la persona física detrás).

**¿Puedo poner residencia fiscal "US" en el KYC para evitar reporte a mi país?** Es declaración falsa al banco - delito de declaración falsa documental. Adicionalmente, Revolut pide documentación que respalde la residencia declarada (utility bill, certificado fiscal del país). No es vía.

En Exentax estructuramos el stack bancario de la LLC contemplando lo que CRS y FATCA reportan a tu residencia y planificamos las declaraciones (720, 3916, RW) para que el cruce automático no genere expediente.
<!-- /exentax:execution-v2 -->

## Tu siguiente paso con Exentax

En Exentax constituimos y mantenemos LLCs de no residentes a diario: estado, EIN, Operating Agreement, BOI cuando aplique, banca con Mercury y Wise, pasarelas Stripe y Adyen, contabilidad mensual, Form 5472 y 1120 pro-forma cada año, y coordinación con tu fiscalidad en residencia. Si quieres validar tu caso con datos reales, agenda una asesoría con nuestro equipo y te explicamos paso a paso cómo encajaría en tu situación concreta.

<!-- exentax:cross-refs-v1 -->
### Más lecturas relacionadas

- [Visa y Mastercard: qué ven realmente las haciendas de tu gasto con tarjeta](/es/blog/visa-mastercard-reporting-tarjetas-hacienda)
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
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22revolut%20business%20crs%20reporting%20fiscal%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si prefieres hablarlo en directo, <a href="/es/agendar">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->
`;
