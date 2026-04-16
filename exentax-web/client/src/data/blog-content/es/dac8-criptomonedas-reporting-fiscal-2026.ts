export default `La **DAC8** es la pieza que completa el sistema de información tributaria europeo en el mundo cripto. A partir de 2026, todos los proveedores de servicios sobre criptoactivos en la UE están obligados a reportar a las autoridades fiscales europeas la información de sus clientes y de sus operaciones, en línea con el modelo CRS aplicado a la banca tradicional. Si tienes cripto y resides en la UE, o tienes una <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americana</a> que opera con cripto en exchanges europeos, esto te afecta directamente.

  ## Qué es la DAC8

  La **DAC8** es la octava modificación de la Directiva 2011/16/UE de cooperación administrativa fiscal. Formalmente: **Directiva (UE) 2023/2226 del Consejo, de 17 de octubre de 2023**, que extiende el ámbito de la cooperación administrativa al nuevo **CARF** (Crypto-Asset Reporting Framework) desarrollado por la OCDE en 2023, y que se aplicará en los Estados miembros a partir del **1 de enero de 2026** con primer reporte en 2027 sobre datos 2026.

  DAC8 es para criptoactivos lo que CRS / DAC2 es para depósitos bancarios y lo que <a href="/es/blog/dac7-plataformas-digitales-reporting-2026">DAC7</a> es para plataformas digitales: identificación obligatoria del cliente, recopilación estandarizada de información, reporte anual a la autoridad fiscal nacional e intercambio automático con las demás autoridades.

  España va a transponer DAC8 mediante modificación de la Ley General Tributaria y normas complementarias, integrándose con el régimen ya existente del **Modelo 721** (declaración informativa de criptoactivos en el extranjero, vigente desde el ejercicio 2023 con primera presentación en 2024).

  ## Marco normativo

  - **OCDE**: Crypto-Asset Reporting Framework (CARF), publicado en marzo de 2023.
  - **UE**: Directiva (UE) 2023/2226 (DAC8), 17 de octubre de 2023; aplicación 1 de enero de 2026.
  - **Reglamento UE 2023/1114** (MiCA - Markets in Crypto-Assets): regulación de proveedores de servicios sobre criptoactivos en la UE; define quién está obligado a reportar bajo DAC8.
  - **España**: Orden HFP/886/2023 (Modelo 721); ley de transposición de DAC8 (en tramitación).

  ## A quién afecta

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

  ## Calendario

  - **1 de enero de 2026**: aplicación efectiva en los Estados miembros.
  - **2026**: ejercicio cubierto en su totalidad.
  - **30 de junio de 2027** (aprox.): primer reporte anual de RCASP a la autoridad fiscal nacional.
  - **30 de septiembre de 2027** (aprox.): primer intercambio automático entre Estados miembros y con terceros países adheridos.

  ## Cómo afecta a un dueño de LLC con cripto

  1. **LLC con cuenta en exchange europeo (Bitpanda, Coinbase Europe, Kraken EU)**: el RCASP identifica a la LLC y a sus beneficiarios efectivos. Reporta saldos y operaciones a la autoridad fiscal de su Estado miembro, que reenvía al país de residencia del beneficiario efectivo.
  2. **LLC con cuenta en exchange estadounidense (Coinbase US, Kraken US, Gemini)**: estos exchanges no están sujetos a DAC8. EE.UU. está desarrollando su propio marco bajo el infrastructure act y el Form 1099-DA, pero el intercambio automático con UE no está vigente al mismo nivel. Los datos pueden llegar por requerimiento bilateral o por la futura red de intercambio CARF si EE.UU. se adhiere.
  3. **Wallets autocustodia**: están fuera del reporte directo, pero las **transferencias entre exchange y wallet** sí se reportan, lo que permite a la hacienda detectar el movimiento.

  ## Interacción con el Modelo 721 español

  Si eres residente fiscal en España y tienes criptoactivos en plataformas extranjeras:

  - Saldo a 31 de diciembre > 50.000 €: **Modelo 721** informativo, presentación entre el 1 de enero y el 31 de marzo del año siguiente.
  - Saldo en exchanges españoles regulados (Bit2Me, etc.): no Modelo 721, pero sí se reporta vía régimen interno y, desde 2026, vía DAC8.
  - DAC8 + Modelo 721 generan doble cruce: el dato llega a la AEAT por el RCASP del país del exchange y por la declaración del propio contribuyente.

  ## Operaciones DeFi y wallets autogestionadas

  DAC8 contempla la difícil cuestión de la **DeFi y la autocustodia**. La directiva impone obligaciones a los RCASP regulados, pero los protocolos DeFi sin sede ni operador identificable quedan fuera del reporte directo. Sin embargo:

  1. La entrada y salida de fondos entre exchange regulado y wallet propia se reporta.
  2. Los protocolos DeFi con frontend operado desde la UE pueden caer bajo MiCA y, por extensión, bajo DAC8.
  3. La OCDE y la UE están desarrollando guías adicionales para DeFi.

  En la práctica: la trazabilidad on-chain combinada con DAC8 hace que la opacidad práctica del DeFi sea mucho menor de lo que se pensaba.

  ## Cómo planificar correctamente

  1. **Lleva contabilidad cripto rigurosa.** Necesitas tracking por operación, valor en EUR/USD a la fecha de cada operación, FIFO o método de identificación específica según jurisdicción.
  2. **Declara correctamente en tu IRPF (España: ganancias y pérdidas patrimoniales por transmisión, escala del ahorro 19-28%).** Lo introducimos en <a href="/es/blog/criptomonedas-trading-llc-impuestos">criptomonedas y trading con LLC</a>.
  3. **Modelo 721 si superas el umbral.** No declarar es infracción específica.
  4. **Coherencia con DAC8.** Lo que reporten los exchanges debe coincidir con lo que declares tú.
  5. **Diseño de estructura.** Si la actividad cripto es relevante (trading frecuente, market making, protocolos DeFi), una LLC puede tener sentido para la separación patrimonial y operativa, pero no para "ocultar". Marco completo en <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">diseño de estructura internacional sólida</a>.

  ## Riesgos típicos

  - "Compré BTC en 2017 y nunca declaré." Si lo vendes ahora con ganancia, la AEAT detecta el flujo a tu cuenta bancaria y, mediante DAC8 + CRS, tiene base para regularización.
  - "Uso wallet propia, no me ven." Cuando entras a fiat por un exchange regulado, ven el flujo. La trazabilidad on-chain es pública.
  - "Pongo la LLC y ya está." Si la LLC carece de sustancia, la AEAT puede aplicar simulación o transparencia fiscal internacional. Lo desarrollamos en <a href="/es/blog/riesgos-fiscales-mala-estructuracion-internacional">riesgos fiscales</a>.

  ## En resumen

  DAC8 cierra el círculo. CRS para banca, DAC7 para plataformas, DAC8 para cripto. La opacidad fiscal del entorno digital se reduce drásticamente desde 2026. La planificación correcta no consiste en buscar agujeros, sino en diseñar una estructura coherente y declarar bien.

  ¿Operas con cripto desde una LLC o quieres entender cómo te afecta DAC8 a ti como residente en España o LATAM? Agenda tu asesoría gratuita.`;
