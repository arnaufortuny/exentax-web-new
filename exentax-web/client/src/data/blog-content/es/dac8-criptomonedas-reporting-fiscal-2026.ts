export default `
> Lectura recomendada para entender el marco europeo en su conjunto: <a href="/es/blog/crs-2-0-carf-por-que-usa-no-firmara-llc">CRS 2.0 y CARF: por qué USA nunca firmará y qué significa para tu LLC</a>. DAC8 es la transposición europea del paquete OCDE que tratamos allí.


La **DAC8** es la pieza que completa el sistema de información tributaria europeo en el mundo cripto. A partir del 1 de enero de 2026, todos los proveedores de servicios sobre criptoactivos en la UE están obligados a reportar a las autoridades fiscales europeas la información de sus clientes y de sus operaciones, en línea con el modelo CRS aplicado a la banca tradicional. Si tienes cripto y resides en la UE, o tienes una <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americana</a> que opera con cripto en exchanges europeos, esto te afecta directamente.

## Qué es la DAC8<!-- [REVISIÓN MANUAL: ref legal "DAC8" — verificar contra https://eur-lex.europa.eu — fecha: 2026-04-21] -->

La **DAC8** es la octava modificación de la Directiva 2011/16/UE de cooperación administrativa fiscal. Formalmente: **Directiva (UE) 2023/2226 del Consejo, de 17 de octubre de 2023**, que extiende el ámbito de la cooperación administrativa al nuevo **CARF** (Crypto-Asset Reporting Framework) desarrollado por la OCDE en marzo de 2023, y que se aplicará en los Estados miembros a partir del **1 de enero de 2026** con primer reporte en enero de 2027 sobre datos del ejercicio fiscal 2026.

DAC8 es para criptoactivos lo que CRS / DAC2 es para depósitos bancarios y lo que <a href="/es/blog/dac7-plataformas-digitales-reporting-2026">DAC7</a> es para plataformas digitales: identificación obligatoria del cliente, recopilación estandarizada de información, reporte anual a la autoridad fiscal nacional e intercambio automático con las demás autoridades.

España va a transponer DAC8 mediante modificación de la Ley General Tributaria y normas complementarias, integrándose con el régimen ya existente del **Modelo 721** (declaración informativa de criptoactivos en el extranjero, vigente desde el ejercicio fiscal 2023 con primera presentación en marzo de 2024).
### Marco normativo

- **OCDE**: Crypto-Asset Reporting Framework (CARF), publicado en marzo de 2023.
- **UE**: Directiva (UE) 2023/2226 (DAC8), 17 de octubre de 2023; aplicación 1 de enero de 2026.
- **Reglamento UE 2023/1114** (MiCA - Markets in Crypto-Assets): regulación de proveedores de servicios sobre criptoactivos en la UE; define quién está obligado a reportar bajo DAC8.
- **España**: Orden HFP/886/2023 (Modelo 721); ley de transposición de DAC8 (en tramitación).
### A quién afecta

DAC8 afecta a:

- **Reporting Crypto-Asset Service Providers (RCASP)**: cualquier proveedor de servicios sobre criptoactivos regulado bajo MiCA en la UE. Incluye exchanges centralizados (Binance Spain, Coinbase Europe, Bitpanda, Kraken EU vía sus filiales), brokers cripto, custodios, plataformas DeFi con presencia legal en UE, emisores de stablecoins regulados.
- **Usuarios de los servicios** (clients): personas físicas y entidades, residentes en cualquier parte del mundo, cuyos datos se reportan a su jurisdicción de residencia fiscal.

A diferencia de CRS, DAC8 no aplica un umbral de minimis: cualquier cliente activo se reporta independientemente del saldo o volumen.
## Qué se reporta

| Categoría | Detalle |
| --- | --- |
| Identificación cliente persona física | Nombre, dirección, residencia fiscal, TIN, fecha y lugar de nacimiento |
| Identificación cliente entidad | Razón social, dirección, EIN/NIF, clasificación, controlling persons (en línea CRS) |
| Saldo de criptoactivos | Saldo a 31 de diciembre por cada criptoactivo (BTC, ETH, USDC, etc.), en unidades del activo y en valor de mercado FIAT |
| Operaciones | Para cada criptoactivo: importes brutos pagados/recibidos por compras, ventas, intercambios cripto-cripto, transferencias a wallets externas (con ciertos requisitos), y por participación en eventos como staking, lending, airdrops |
| Métodos de pago | Si las operaciones se liquidaron en FIAT (EUR, USD, etc.) o en otros criptoactivos |

El detalle es muy granular: por activo, por categoría de operación, por trimestre.
### Calendario

- **1 de enero actualmente**: aplicación efectiva en los Estados miembros.
- **hoy**: ejercicio cubierto en su totalidad.
- **30 de junio de 2027** (aprox.): primer reporte anual de RCASP a la autoridad fiscal nacional.
- **30 de septiembre de 2027** (aprox.): primer intercambio automático entre Estados miembros y con terceros países adheridos.
### Cómo afecta a un dueño de LLC con cripto

1. **LLC con cuenta en exchange europeo (Bitpanda, Coinbase Europe, Kraken EU)**: el RCASP identifica a la LLC y a sus beneficiarios efectivos. Reporta saldos y operaciones a la autoridad fiscal de su Estado miembro, que reenvía al país de residencia del beneficiario efectivo.
2. **LLC con cuenta en exchange estadounidense (Coinbase US, Kraken US, Gemini)**: estos exchanges no están sujetos a DAC8. EE.UU. está desarrollando su propio marco bajo el infrastructure act y el Form 1099-DA, pero el intercambio automático con UE no está vigente al mismo nivel. Los datos pueden llegar por requerimiento bilateral o por la futura red de intercambio CARF si EE.UU. se adhiere.
3. **Wallets autocustodia**: están fuera del reporte directo, pero las **transferencias entre exchange y wallet** sí se reportan, lo que permite a la hacienda detectar el movimiento.
### Interacción con el Modelo 721 español

Si eres residente fiscal en España y tienes criptoactivos en plataformas extranjeras:

- Saldo a 31 de diciembre > 50.000<!-- [REVISIÓN MANUAL: cifra "50.000" — verificar contra fuente oficial vigente (revisión editorial) — fecha: 2026-04-21] --> €: **Modelo 721** informativo, presentación entre el 1 de enero y el 31 de marzo del año siguiente.
- Saldo en exchanges españoles regulados (Bit2Me, etc.): no Modelo 721, pero sí se reporta vía régimen interno y, recientemente, vía DAC8.
- DAC8 + Modelo 721 generan doble cruce: el dato llega a la AEAT por el RCASP del país del exchange y por la declaración del propio contribuyente.
### Operaciones DeFi y wallets autogestionadas

DAC8 contempla la difícil cuestión de la **DeFi y la autocustodia**. La directiva impone obligaciones a los RCASP regulados, pero los protocolos DeFi sin sede ni operador identificable quedan fuera del reporte directo. Sin embargo:

1. La entrada y salida de fondos entre exchange regulado y wallet propia se reporta.
2. Los protocolos DeFi con frontend operado desde la UE pueden caer bajo MiCA y, por extensión, bajo DAC8.
3. La OCDE y la UE están desarrollando guías adicionales para DeFi.

En la práctica: la trazabilidad on-chain combinada con DAC8 hace que la opacidad práctica del DeFi sea mucho menor de lo que se pensaba.
### Cómo planificar correctamente

1. **Lleva contabilidad cripto rigurosa.** Necesitas tracking por operación, valor en EUR/USD a la fecha de cada operación, FIFO o método de identificación específica según jurisdicción.
2. **Declara correctamente en tu IRPF (España: ganancias y pérdidas patrimoniales por transmisión, escala del ahorro 19-28%<!-- [REVISIÓN MANUAL: cifra "28%" — verificar contra https://sede.agenciatributaria.gob.es — fecha: 2026-04-21] -->).** Lo introducimos en <a href="/es/blog/criptomonedas-trading-llc-impuestos">criptomonedas y trading con LLC</a>.
3. **Modelo 721 si superas el umbral.** No declarar es infracción específica.
4. **Coherencia con DAC8.** Lo que reporten los exchanges debe coincidir con lo que declares tú.
5. **Diseño de estructura.** Si la actividad cripto es relevante (trading frecuente, market making, protocolos DeFi), una LLC puede tener sentido para la separación patrimonial y operativa, pero no para "ocultar". Marco completo en <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">diseño de estructura internacional sólida</a>.
### Riesgos típicos

- "Compré BTC en 2017 y nunca declaré." Si lo vendes ahora con ganancia, la AEAT detecta el flujo a tu cuenta bancaria y, mediante DAC8 + CRS, tiene base para regularización.
- "Uso wallet propia, no me ven." Cuando entras a fiat por un exchange regulado, ven el flujo. La trazabilidad on-chain es pública.
- "Pongo la LLC y ya está." Si la LLC carece de sustancia, la AEAT puede aplicar simulación o transparencia fiscal internacional. Lo desarrollamos en <a href="/es/blog/riesgos-fiscales-mala-estructuracion-internacional">riesgos fiscales</a>.
### En resumen

DAC8 cierra el círculo. CRS para banca, DAC7 para plataformas, DAC8 para cripto. La opacidad fiscal del entorno digital se reduce drásticamente recientemente. La planificación correcta no consiste en buscar agujeros, sino en diseñar una estructura coherente y declarar bien.

¿Operas con cripto desde una LLC o quieres entender cómo te afecta DAC8 a ti como residente en España o LATAM? Agenda tu asesoría gratuita.
## Referencias legales y normativas

Este artículo se apoya en normativa vigentes actualmente. Citamos las fuentes principales para que puedas verificarlo:

- **EE. UU.** Treas. Reg. §301.770<!-- [REVISIÓN MANUAL: cifra "301.770" — verificar contra fuente oficial vigente (revisión editorial) — fecha: 2026-04-21] -->1-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.603<!-- [REVISIÓN MANUAL: cifra "1.603" — verificar contra fuente oficial vigente (revisión editorial) — fecha: 2026-04-21] -->8A-2 (Form 5472 para *25%<!-- [REVISIÓN MANUAL: cifra "25%" — verificar contra fuente oficial vigente (revisión editorial) — fecha: 2026-04-21] --> foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fiscal, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report ante <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **España.** Ley 35/2006 (LIRPF), arts. 8, 9 (residencia), 87 (atribución de rentas), 91 (transparencia fiscal internacional para personas físicas); Ley 27/2014 (LIS), art. 100 (transparencia fiscal internacional para sociedades); Ley 58/2003 (LGT), arts. 15 (conflicto en aplicación de la norma) y 16 (simulación); Ley 5/2022 (régimen sancionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007<!-- [REVISIÓN MANUAL: ref legal "RD 1065/2007" — verificar contra https://www.boe.es — fecha: 2026-04-21] --> (Modelos 232 y 720); Orden HFP/887/2023 (Modelo 721 cripto).
- **Convenio España–EE. UU.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> de 22/12/1990 (CDI original); Protocolo en vigor desde 27/11/2019 (renta pasiva, *limitation on benefits*).
- **UE / OCDE.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiva (UE) 2016/1164 (ATAD: CFC, *exit tax*, asimetrías híbridas); Estándar Común de Reporte (CRS) de la OCDE.
- **Marco internacional.** Modelo de Convenio OCDE, art. 5 (establecimiento permanente) y comentarios; Acción 5 BEPS (sustancia económica); FATF Recommendation 24 (titularidad real).
La aplicación concreta de cualquiera de estas normas a tu caso depende de tu residencia fiscal, la actividad de la LLC y la documentación que mantengas. Este contenido es informativo y no sustituye al asesoramiento profesional personalizado.

<!-- exentax:legal-facts-v1 -->
## Hechos legales y de procedimiento

La normativa de información a FinCEN y al <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> se ha movido en recent years; la versión vigente es esta:

<!-- exentax:calc-cta-v1 -->
> <a href="/es/agendar">Consulta gratuita sin compromiso</a>
<!-- /exentax:calc-cta-v1 -->

### Puntos clave

- **BOI / Corporate Transparency Act.** Tras la **interim final rule de FinCEN de marzo de 2025**, la obligación de presentar el BOI Report quedó **restringida a "foreign reporting companies"** (entidades constituidas fuera de EE. UU. y registradas para hacer negocios en un estado). Una **LLC formada en EE. UU. por un no residente queda, a día de hoy, fuera de esa obligación**. El estado normativo puede volver a cambiar: hay que **re-verificar en FinCEN.gov en el momento de la presentación**. Si tu LLC se constituyó antes de marzo de 2025 y ya presentaste BOI, se recomienda conservar el acuse y monitorizar futuras actualizaciones.
- **Form 5472<!-- [REVISIÓN MANUAL: ref legal "Form 5472" — verificar contra https://www.irs.gov — fecha: 2026-04-21] --> + 1120 pro-forma.** Para una **Single-Member LLC propiedad de un no residente**, las regulaciones finales de Treas. Reg. §1.6038A-1 (vigentes desde 2017) tratan a la LLC como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo cabecera: nombre, dirección, EIN, ejercicio fiscal) con el **Form 5472 anexado**. Se envía **por correo certificado o fax al IRS Service Center de Ogden, Utah**, **no se presenta vía MeF/e-file** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000<!-- [REVISIÓN MANUAL: cifra "25.000" — verificar contra https://www.irs.gov — fecha: 2026-04-21] --> USD por formulario y año, más 25.000 USD por cada 30 días adicionales** sin presentación tras notificación del IRS.
- **Form 1120 sustantivo.** Solo aplica si la LLC ha realizado *check-the-box election* a C-Corp (Form 8832): entonces tributa al 21 %<!-- [REVISIÓN MANUAL: cifra "21 %" — verificar contra https://www.irs.gov — fecha: 2026-04-21] --> federal y presenta un 1120 con cifras reales. La LLC disregarded estándar **no presenta un 1120 sustantivo y no paga corporate tax federal**.
- **EIN y notificaciones.** Sin EIN no se puede presentar 5472 ni BOI. El IRS no avisa antes de sancionar; las multas se descubren al actuar contra el EIN o al rechazar una próxima presentación.

<!-- exentax:execution-v2 -->
## Cómo navegar DAC8 con tranquilidad: la lectura para holders y traders

DAC8 introduce el reporting automático sobre criptoactivos en la UE recientemente: todos los CASP (Crypto-Asset Service Providers) europeos enviarán a las autoridades fiscales de cada Estado miembro la identidad de sus clientes y las posiciones, transacciones y movimientos del año. Es el equivalente cripto a CRS para banca. Esto es lo que cambia y lo que no.

- **Plataformas afectadas.** Bitpanda, Bitstamp, Bit2Me, N26 Crypto, Revolut Crypto, Coinbase Europe, Kraken Europe, Binance EU y todo CASP autorizado bajo MiCA. La información se transmite en enero de cada año, referida al ejercicio anterior, e incluye saldos, depósitos, retiradas, intercambios fiat-cripto y cripto-cripto.
- **Plataformas no afectadas (todavía).** Coinbase US, Kraken US, Binance US y exchanges no-UE quedan fuera de DAC8 directo. Sin embargo, <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a> aprobó CARF (Crypto-Asset Reporting Framework) en octubre de 2023, con primera transmisión prevista en enero de 2027 entre 50+ jurisdicciones. EE. UU. ha indicado intención de adherirse en parte vía IRS Form 1099-DA (interim final rule de 2025).
- **Wallets self-custody y DeFi.** No entran en DAC8. La privacidad on-chain es real para wallets propias mientras no toques exchange CASP. El día que mueves de MetaMask a Bitpanda para vender, el saldo y el movimiento entran en el reporting de Bitpanda. La trazabilidad blockchain por sí sola tampoco va a Hacienda automáticamente; solo si se solicita explícitamente o si hay flujo a CASP.
- **Modelo 721 español.** Independiente de DAC8: si eres residente fiscal en España y tienes cripto en el extranjero (CASP no español, wallet self-custody) por valor combinado >50.000 €, hay obligación de Modelo 721. DAC8 facilita el cruce, no crea la obligación.

### Lo que más nos preguntan

**¿Si tengo crypto en Coinbase US, estoy fuera de DAC8?** De DAC8 sí, mientras no traigas saldos a un CASP europeo. Pero entras en el flujo CARF a partir de enero de 2027 (USA participa parcialmente vía 1099-DA), y sigues obligado a Modelo 721 si superas 50.000 €. La discreción es relativa y temporal.

**¿Mover crypto a wallet propia me saca del radar?** Te saca del reporting CASP, no de tus obligaciones declarativas. La AEAT no recibe el saldo de tu MetaMask, pero sigue siendo cripto en el extranjero a efectos del 721. La asimetría es operativa, no normativa.

En Exentax mapeamos cada wallet y exchange de tu cartera, modelamos el reporting DAC8/CARF aplicable y dejamos la imputación cripto en residencia coherente con lo que las plataformas reportarán.
<!-- /exentax:execution-v2 -->

## Hablemos de tu estructura

Cada caso tiene matices: tu país de residencia, el tipo de actividad, dónde están tus clientes, si haces inversión o trading, si vendes a particulares o a empresas. En Exentax revisamos tu situación, diseñamos la estructura LLC que encaja contigo y te acompañamos cada año en el mantenimiento. Reserva una consulta con nuestro equipo y empezamos por entender tus números reales.


¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:+34614916910">+34 614 916 910</a> o escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22dac8%20criptomonedas%20reporting%20fiscal%202026%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si prefieres hablarlo en directo, <a href="/es/agendar">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisión editorial pendiente</strong> — Las siguientes referencias requieren verificación manual contra la fuente oficial vigente. Si encuentras una desviación, escríbenos y la corregimos en menos de 24 horas.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">50.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…os en plataformas extranjeras: - Saldo a 31 de diciembre &gt; 50.000 €: **Modelo 721** inform…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">28%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…érdidas patrimoniales por transmisión, escala del ahorro 19-28%).** Lo introducimos en &lt;a …»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://sede.agenciatributaria.gob.es" rel="nofollow noopener" target="_blank">sede.agenciatributaria.gob.es</a>]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…es para que puedas verificarlo: - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de en…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…P y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25%…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…ntes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…ga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y añ…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §882</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…§301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre renta…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §871</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…r business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fisca…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1099</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…sarrollando su propio marco bajo el infrastructure act y el Form 1099-DA, pero el intercam…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…ones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-ow…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…C como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo ca…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…a si la LLC ha realizado *check-the-box election* a C-Corp (Form 8832): entonces tributa a…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…cionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…export default &#96;La **DAC8** es la pieza que completa el sistema de información tribut…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC2</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…cicio fiscal 2026. DAC8 es para criptoactivos lo que CRS / DAC2 es para depósitos bancario…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…a href=&quot;/es/blog/dac7-plataformas-digitales-reporting-2026&quot;&gt;DAC7&lt;/a&gt; es para plataformas d…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…*). - **UE / OCDE.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronteri…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
