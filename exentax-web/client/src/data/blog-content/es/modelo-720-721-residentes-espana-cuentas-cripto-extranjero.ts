export default `

Si eres residente fiscal en España y tienes una <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americana</a>, una cuenta Wise o Mercury, un broker en el extranjero o cualquier saldo significativo en criptomonedas fuera de un exchange español, dos formularios marcan la frontera entre estar bien y tener un problema serio: el **Modelo 720** y el **Modelo 721**. Casi todos los demás artículos de este blog los citan de pasada; este es el artículo de referencia para entenderlos a fondo.

## Qué es el Modelo 720

El **Modelo 720** es la "Declaración informativa sobre bienes y derechos situados en el extranjero". Lo creó la Ley 7/2012 de prevención y lucha contra el fraude fiscal y se desarrolló por la **Orden HAP/72/2013**, modificada después por la Orden HFP/887/2023. No es un impuesto: no liquida cuota. Es un régimen informativo que obliga a residentes fiscales en España a declarar la titularidad y el saldo de determinados bienes situados fuera de España cuando superan los umbrales legales.

Cubre tres bloques separados, cada uno con su propio umbral de 50.000 € agregados:

| Bloque | Qué incluye | Umbral |
| --- | --- | --- |
| Bloque I: Cuentas | Cuentas corrientes, de ahorro, depósitos, cuentas de crédito y cualesquiera otras cuentas en entidades financieras situadas en el extranjero | 50.000 € (saldo a 31/12 o saldo medio del 4.º trimestre) |
| Bloque II: Valores, derechos, seguros y rentas | Acciones, participaciones en fondos, bonos, derechos representativos, seguros de vida o invalidez, rentas vitalicias o temporales | 50.000 € (valor a 31/12) |
| Bloque III: Inmuebles y derechos sobre inmuebles | Inmuebles y derechos reales sobre inmuebles situados en el extranjero | 50.000 € (valor de adquisición) |

Cada bloque se evalúa por separado. Puedes estar obligado solo en cuentas, solo en valores, solo en inmuebles o en varios. La obligación nace cuando se supera el umbral en **al menos un** bloque.
### Qué es el Modelo 721

El **Modelo 721** es el hermano cripto del 720. Lo regula la **Orden HFP/886/2023, de 26 de julio**, en desarrollo del Real Decreto 249/2023, y exige declarar las **monedas virtuales situadas en el extranjero** cuyo saldo conjunto a 31 de diciembre supere los **50.000 €**. La primera campaña ya se ha presentado (ejercicio 2023).

Una cripto se considera "situada en el extranjero" cuando está custodiada por una entidad o persona no residente en España (Coinbase US, Kraken, Binance fuera de su entidad española, Ledger en self-custody con servicio asociado de un proveedor extranjero, etc.). Si tu cripto está en una entidad **registrada en el Banco de España** o en un wallet **autocustodiado puro** sin proveedor extranjero asociado, el 721 no aplica (aunque puede aplicar la **Disposición Adicional decimotercera de la LIRPF**: declaración informativa interna por proveedores españoles).
### Quién está obligado

Están obligados a presentar el 720 y/o el 721:

- **Personas físicas** residentes fiscales en España (criterio del art. 9 LIRPF: 183 días, centro de intereses económicos, núcleo de intereses vitales).
- **Personas jurídicas** residentes en territorio español.
- **Establecimientos permanentes** en España de entidades no residentes.
- **Comunidades de bienes y herencias yacentes** del art. 35.4 LGT.
- **Titulares reales** (controlling persons) de las cuentas, valores o criptos, aunque la titularidad jurídica formal sea de otra persona o entidad. Aquí es donde la LLC americana cobra todo el sentido: si tú eres beneficiario efectivo de una <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC en EE.UU.</a> y la LLC tiene una cuenta Wise o Mercury, tú estás obligado a declarar esa cuenta como bien situado en el extranjero.
### Plazos y forma de presentación

- **Modelo 720**: del 1 de enero al **31 de marzo** del año siguiente al ejercicio reportado. Solo telemática (Sede Electrónica AEAT, certificado o Cl@ve).
- **Modelo 721**: del 1 de enero al **31 de marzo** del año siguiente al ejercicio. Solo telemática.

Tras la primera presentación, **únicamente hay que volver a presentar** si en el bloque concreto se ha producido un **incremento superior a 20.000 €** respecto al saldo declarado en la última presentación, o si has perdido la titularidad o cancelado alguno de los elementos previamente declarados.
## La sentencia STJUE C-788/19 y el régimen sancionador actual

El régimen sancionador original del 720 fue uno de los más severos del ordenamiento europeo: 5.000 € por dato omitido (mínimo 10.000 €), imprescriptibilidad de las rentas no declaradas como ganancia patrimonial no justificada (art. 39.2 LIRPF) y sanción del 150% sobre la cuota.

La **Sentencia del Tribunal de Justicia de la UE de 27 de enero de 2022, asunto C-788/19**, declaró ese régimen contrario al Derecho de la Unión por desproporcionado y por vulnerar la libre circulación de capitales. La Ley 5/2022, de 9 de marzo, eliminó esas sanciones específicas.

Esto **no significa** que ya no haya sanciones. Lo que aplica hoy:

- **Sanción ordinaria** del art. 198 LGT por no presentar declaración informativa: 20 € por dato, mínimo 300 €, máximo 20.000 €. Reducida a la mitad si se presenta sin requerimiento previo.
- **Régimen general de la LGT** para las cuotas defraudadas en IRPF si se descubren rentas no declaradas: art. 191 (sanción del 50 al 150% de la cuota), con plazo general de **prescripción de 4 años**.
- **Vía penal** (art. 305 CP) si la cuota defraudada en un ejercicio supera 120.000 €.

La sentencia europea suavizó el régimen, pero no derogó la obligación informativa. Quien no presenta el 720 sigue cometiendo una infracción tributaria.
## Cómo encajan Wise, Mercury, Revolut y tu LLC

Este es el punto donde más errores vemos. Vamos por partes.

### Cuentas Wise / Revolut / N26 / Wallester (entidades europeas)

Son cuentas en entidades financieras situadas en el extranjero (Bélgica, Lituania, Alemania, Estonia). Si la titular es tu LLC americana y tú eres el beneficiario efectivo, debes incluirlas en el **Bloque I del 720** cuando se supere el umbral de 50.000 € agregados. Lo desarrollamos a fondo en <a href="/es/blog/wise-iban-llc-que-reporta-hacienda">qué reporta Wise a Hacienda</a> y en <a href="/es/blog/revolut-business-crs-reporting-fiscal">Revolut Business y CRS</a>. Estas cuentas además llegan a la AEAT vía CRS, por lo que el cruce es automático.

### Mercury, Relay, banca americana

Estados Unidos no está adherido a CRS, pero esto **no exime de declarar el 720**. La obligación informativa española es independiente del intercambio internacional: si tienes una cuenta Mercury con saldo o saldo medio Q4 superior a 50.000 € agregados con el resto de cuentas extranjeras, debes declararla. Que la AEAT no se entere por CRS no equivale a que no exista la obligación. Y, si en el futuro se abre una inspección por otro motivo, esa omisión sí aparecerá. Lo analizamos en <a href="/es/blog/cuentas-bancarias-usa-reportan-hacienda-verdad">si las cuentas bancarias en EE.UU. reportan a Hacienda</a> y, para entender por qué CRS 2.0 tampoco cambia esa foto, en <a href="/es/blog/crs-2-0-carf-por-que-usa-no-firmara-llc">CRS 2.0 y CARF: por qué USA nunca firmará</a>.

### Brokers extranjeros (Interactive Brokers, Tastytrade, etc.)

Las posiciones en valores van al **Bloque II** (umbral 50.000 € a 31/12 a valor de mercado). Si además generan dividendos o intereses, esos rendimientos llegan a Hacienda por CRS desde la jurisdicción del broker, lo que vuelve crítico declarar correctamente.

### Criptomonedas en exchanges extranjeros

Coinbase, Kraken, Binance internacional, KuCoin, Bybit, etc.: son proveedores no residentes en España. Saldo agregado a 31/12 superior a 50.000 € → **Modelo 721**. Si además operas con DAC8 recientemente, el cruce será aún más rápido (lo cubrimos en <a href="/es/blog/dac8-criptomonedas-reporting-fiscal-2026">DAC8 y reporting fiscal de cripto</a>).

### Self-custody puro

Una hardware wallet sin proveedor asociado en el extranjero técnicamente no entra en el 721 porque no hay "entidad situada en el extranjero" custodiando. Aun así, si esos fondos generan rendimientos (staking, DeFi) a través de plataformas extranjeras, esas plataformas sí pueden activar la obligación.
### Qué información hay que reportar exactamente

Para cada cuenta, valor o cripto se reporta:

- Identificación del titular y, en su caso, del titular real.
- Identificación de la entidad: nombre, NIF o equivalente, domicilio.
- Identificación de la cuenta o activo: IBAN, número, ISIN, ticker de la cripto.
- Fecha de apertura o adquisición y, si procede, de cancelación o transmisión.
- Saldos: saldo a 31/12 y saldo medio del 4.º trimestre (cuentas) o valor a 31/12 (valores y cripto).
- Tipo de bien según la clasificación oficial.

La presentación se hace por bloques diferenciados, con claves específicas para cada situación (titular único, cotitularidad, autorizado, beneficiario, etc.).
## Errores típicos que vemos cada semana

1. **"Como mi cuenta Wise está en EE.UU. (Wise US Inc.), no la declaro."** Solo aplicaría si efectivamente tu cuenta está bajo Wise US Inc. lo cual es excepcional desde Europa. La inmensa mayoría de cuentas Wise de residentes europeos están bajo Wise Europe SA (Bélgica) y van al 720.
2. **"Mi LLC es la titular de la cuenta, no yo."** Eres el titular real (beneficiario efectivo) y, como residente fiscal en España, la obligación recae sobre ti. La interposición de la LLC no cambia la obligación informativa.
3. **"Tengo 30.000 € en Wise y 25.000 € en Mercury, no llego al umbral."** El umbral es **agregado** dentro de cada bloque. 30.000 + 25.000 = 55.000 € → obligado a declarar **ambas** cuentas.
4. **"Ya lo declaré una vez, no hace falta nada más."** Hay que volver a presentar si hay incremento superior a 20.000 € respecto a lo declarado, o si se cancela algún elemento.
5. **"Tengo cripto en Binance pero pongo Binance Spain como entidad."** Si tu cuenta está en Binance internacional (no en la entidad registrada en el Banco de España), debes reflejarlo como exchange extranjero. La diferencia es relevante.
6. **"Como la STJUE anuló las sanciones, ya no presento."** La STJUE anuló el régimen sancionador específico desproporcionado, no la obligación. Sigue habiendo sanción del art. 198 LGT y, sobre todo, riesgo de regularización por cuotas no declaradas con las sanciones del art. 191.
7. **"Si lo presento ahora con 3 años de retraso, me crujen."** Lo razonable es presentar **complementarias sin requerimiento previo**: la sanción se reduce a la mitad y se evita el escenario de inspección con descubrimiento. Es exactamente lo que hacemos con clientes que llegan en esa situación.
### Cómo lo trabajamos en Exentax

Nuestro proceso para el 720/721 cuando entra un cliente con LLC + fintech europeas + cripto:

1. **Inventario completo** de cuentas, brokers, exchanges y wallets, con identificación clara de la entidad gestora y su jurisdicción.
2. **Determinación de obligación** por bloques y por umbrales, distinguiendo titularidad jurídica y titularidad real.
3. **Reconciliación** con CRS / DAC ya cruzados por la AEAT (cuando hay datos previos de la administración).
4. **Presentación** del 720 y, en su caso, 721, con codificación correcta de cada elemento.
5. **Plan de regularización** si hay ejercicios anteriores no declarados, priorizando complementarias sin requerimiento.
6. **Integración** con el resto de la planificación: <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">diseño de estructura internacional</a>, <a href="/es/blog/tributacion-llc-segun-actividad-economica">tributación LLC por actividad</a> y <a href="/es/blog/crs-residentes-espana-latam-implicaciones">CRS para residentes en España</a>.
### En resumen

El Modelo 720 y el Modelo 721 son obligaciones informativas, no impuestos. No te cuestan dinero por sí mismos, pero su omisión sí: sanción del 198 LGT, regularización de cuotas con recargos del 191 y, en saldo no justificado, la palanca clásica del art. 39 LIRPF (atemperada por la STJUE pero no eliminada). El cruce con CRS y, recientemente, con DAC8, hace que la huella sea cada vez más visible para la AEAT.

Si tienes cuentas Wise, Mercury, Revolut, brokers extranjeros o cripto fuera de España y no estás 100% seguro de tu posición frente al 720/721, lo revisamos contigo y dejamos tu situación limpia antes de la siguiente campaña.
## Compliance fiscal en tu país: CFC, TFI y atribución de rentas

Una LLC americana es una herramienta legal y reconocida internacionalmente. Pero el cumplimiento no termina al constituirla: como propietario residente fiscal en otro país, tu administración tributaria sigue teniendo derecho a gravar lo que la LLC genera. Lo importante es saber **bajo qué régimen** aplica esa tributación.

### Por jurisdicción

- **España (LIRPF/LIS).** Si la LLC es una *Single-Member Disregarded Entity* operativa (servicios reales, sin pasividad significativa), Hacienda suele tratarla por **atribución de rentas (art. 87 LIRPF)**: los beneficios netos se imputan al socio en el ejercicio en que se generan, integrándose en la base general del IRPF. Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada por residente español con rentas mayoritariamente pasivas, puede activarse el régimen de **transparencia fiscal internacional (art. 91 LIRPF para personas físicas, art. 100 LIS para sociedades)**. La diferencia entre uno u otro régimen no es opcional: depende de la sustancia económica, no del nombre.
- **Modelos informativos.** Cuentas bancarias en EE. UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022; sanciones ahora dentro del régimen general LGT). Operaciones vinculadas con la LLC y dividendos repatriados: **Modelo 232**. Criptoactivos custodiados en EE. UU.: **Modelo 721**.
- **CDI España–EE. UU.** El convenio (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocolo en vigor 27/11/2019) ordena la doble imposición sobre dividendos, intereses y royalties. Una LLC sin establecimiento permanente en España no constituye, por sí sola, EP del socio, pero la dirección efectiva sí puede crearlo si toda la gestión se hace desde territorio español.
- **México, Colombia, Argentina y otros LATAM.** Cada jurisdicción tiene su propio régimen CFC (México: Refipres; Argentina: rentas pasivas del exterior; Chile: art. 41 G LIR). El principio común: lo que la LLC retiene como beneficio se considera percibido por el socio si la entidad se considera transparente o controlada.

La regla práctica: una LLC operativa, con sustancia, declarada correctamente en residencia, es **planificación fiscal legítima**. Una LLC que se usa para ocultar ingresos, simular no residencia o desplazar rentas pasivas sin justificación económica entra en el terreno del **art. 15 LGT (conflicto en aplicación de la norma)** o, en el peor caso, del **art. 16 LGT (simulación)**. La diferencia la marcan los hechos, no el papel.

En Exentax montamos la estructura para que encaje en el primer escenario y documentamos cada paso para que tu declaración local sea defendible ante una eventual revisión.

<!-- exentax:bank-balance-v1 -->
## Stack bancario equilibrado: Mercury, Relay, Slash y Wise

No existe la cuenta perfecta para una LLC. Existe el **stack** correcto, donde cada herramienta cubre un rol:

- **Mercury** (operada como fintech con bancos asociados (Choice Financial Group y Evolve Bank & Trust principalmente; Column N.A. en cuentas heredadas), FDIC vía sweep network hasta el límite vigente). Cuenta principal operativa para no residentes con buena UX, ACH y wires. Sigue siendo una de las opciones más probadas para abrir desde fuera de EE. UU.
- **Relay** (respaldada por Thread Bank, FDIC). Excelente como **cuenta de respaldo** y para gestión "envelope budgeting": permite crear hasta 20 sub-cuentas y 50 tarjetas de débito, integración profunda con QuickBooks y Xero. Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare.
- **Slash** (respaldada por Column N.A. (banco federalmente registrado, con cobertura FDIC)). Banca diseñada para operadores online: emisión instantánea de tarjetas virtuales por proveedor, controles de gasto granulares, *cashback* en publicidad digital. Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS.
- **Wise Business** (EMI multi-divisa, no es banco). Para cobrar y pagar en EUR, GBP, USD y otras divisas con datos bancarios locales y conversión a *mid-market rate*. No sustituye una cuenta US real, pero es imbatible para tesorería internacional.
- **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen. Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC.
La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**. Es la configuración que minimiza riesgo de bloqueo y reduce coste real. En Exentax abrimos y configuramos este stack como parte de la constitución.

<!-- exentax:banking-facts-v1 -->
## Hechos bancarios y fiscales que conviene precisar

La información sobre fintech y CRS evoluciona y queremos que la tengas tal cual está hoy:

<!-- exentax:calc-cta-v1 -->
> **Pon números a tu caso.** La <a href="/es#calculadora">calculadora fiscal Exentax</a> compara tu carga fiscal actual con la que pagarías operando una LLC americana correctamente declarada en tu país de residencia.
<!-- /exentax:calc-cta-v1 -->

### Notas por proveedor

- **Mercury** opera con varios bancos asociados con licencia federal y cobertura **FDIC** vía sweep network: principalmente **Choice Financial Group** y **Evolve Bank & Trust**, además de **Column N.A.** en algunos casos heredados. Mercury no es un banco; es una plataforma fintech respaldada por esos partner banks. Si Mercury cierra una cuenta, el saldo se devuelve normalmente **mediante cheque a la dirección registrada del titular** y eso puede ser un problema operativo serio para no residentes; conviene tener una cuenta secundaria activa (Relay, Wise Business, etc.) como contingencia.
- **Wise** distribuye dos productos distintos: **Wise Personal** (cuenta personal) y **Wise Business** (cuenta para empresas, incluida tu LLC). Para una LLC se debe abrir **Wise Business**, no la personal. Matiz importante de CRS: una **Wise Business titularidad de una LLC estadounidense queda fuera del CRS** porque la titular es una entidad de EE. UU. y EE. UU. no es jurisdicción CRS; el lado USD opera vía Wise US Inc. (perímetro FATCA, no CRS). En cambio, una **Wise Personal abierta por un individuo residente fiscal en España** u otra jurisdicción CRS **sí genera reporte CRS** vía Wise Europe SA (Bélgica) sobre ese individuo. Si abres Wise para tu LLC, esa cuenta no te incluye en CRS por la LLC; si además mantienes una Wise Personal a tu nombre como residente en CRS, esa segunda sí reporta.
- **Wallester** (Estonia) es una entidad financiera europea con licencia EMI/banco emisor de tarjetas. Sus cuentas IBAN europeas **están dentro del Estándar Común de Comunicación de Información (CRS)** y, por tanto, generan reporte automático a la administración tributaria del país de residencia del titular.
- **Payoneer** opera con entidades europeas (Payoneer Europe Ltd, Irlanda) que también **están dentro de CRS** para clientes residentes en jurisdicciones que aplican el estándar.
- **Revolut Business**: cuando se asocia a una **LLC estadounidense**, lo habitual es operar bajo Revolut Payments USA; los IBAN europeos (lituanos, BE) **no se emiten por defecto** a una LLC: se emiten a clientes europeos del banco europeo del grupo. Si te ofrecen un IBAN europeo, asegúrate de a qué entidad jurídica está asociada esa cuenta y bajo qué régimen reporta.
- **Tributación cero**: ninguna estructura LLC consigue "cero impuestos" si vives en un país con CFC/transparencia fiscal o atribución de rentas. Lo que se consigue es **no duplicar tributación** y **declarar correctamente en residencia**, no eliminarla.

<!-- exentax:legal-refs-v1 -->
## Referencias: marco legal y normativa

La argumentación de este artículo descansa en la siguiente normativa y doctrina, vigente actualmente:

- **España.** Ley 35/2006 del IRPF (arts. 8, 9 y 91 sobre residencia fiscal y transparencia fiscal internacional), Ley 27/2014 del Impuesto sobre Sociedades (art. 100 sobre TFI), Ley 58/2003 General Tributaria, Ley 5/2022 que reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 720) y Orden HFP/887/2023 (Modelo 721 de criptoactivos en el extranjero).
- **Doctrina administrativa.** Resoluciones del <a href="https://serviciostelematicosext.hacienda.gob.es/TEAC/DYCTEA" target="_blank" rel="noopener">TEAC</a> y consultas vinculantes de la <a href="https://petete.tributos.hacienda.gob.es" target="_blank" rel="noopener">DGT</a> relativas a LLC unipersonales (entre otras V0443-08, V1631-17, V1147-22), interpretadas a la luz del BOE de febrero de 2020 sobre clasificación de entidades extranjeras transparentes.
- **Convenios y normativa internacional.** Convenio de Doble Imposición entre España y EE. UU. firmado en 1990 con Protocolo de 2013 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Convenio <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> con sus Comentarios.
- **EE. UU.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa FBAR (31 CFR 1010.350).

Este contenido es divulgativo y no sustituye al asesoramiento personalizado para tu situación fiscal concreta.

<!-- exentax:execution-v2 -->
## Modelos 720 y 721: las dos declaraciones que más sanciones generan a residentes en España

Los modelos 720 (bienes en el extranjero) y 721 (criptomonedas en el extranjero) son las dos declaraciones informativas que más expedientes sancionadores abren a residentes españoles con estructura internacional. No generan impuesto, pero su omisión o presentación incorrecta puede activar sanciones formales relevantes. Esto es lo que tienes que tener resuelto.

- **Modelo 720: qué se declara.** Cuentas bancarias en el extranjero, valores y participaciones en entidades extranjeras, e inmuebles en el extranjero, cuando el saldo agregado en cada bloque supere 50.000 EUR a 31 de diciembre o sea el más alto del año. Una vez declarado un bloque, en años siguientes solo se vuelve a presentar si el saldo aumenta más de 20.000 EUR respecto al último declarado.
- **Modelo 721: criptomonedas.** Específico para saldos de criptomonedas custodiadas por exchanges o plataformas extranjeras (Binance, Coinbase, Kraken, etc.). Umbral: 50.000 EUR a 31 de diciembre o saldo más alto del año. Plazo de presentación: enero-marzo del año siguiente. Aplica también a wallets gestionadas por proveedores extranjeros.
- **Régimen sancionador actual.** Tras la sentencia del TJUE de enero 2022 (caso C-788/19) y la reforma posterior, el régimen sancionador específico antiguo del 720 fue declarado contrario al derecho UE. Las sanciones actuales son las del régimen general de Hacienda (LGT): formales por presentación tardía o incompleta, y sustanciales si se detecta ocultación deliberada con cuota tributaria asociada.
- **Lo que conviene saber.** Una LLC americana cuyo socio sea residente español obliga a declarar la participación (modelo 720, bloque "valores y participaciones") cuando supera el umbral. Las cuentas bancarias de la LLC (Mercury, Wise) no se declaran como propias del residente, pero pueden ser pedidas por Hacienda en una inspección como información complementaria.

### Lo que más nos preguntan

**¿Si la LLC es disregarded, sus cuentas son "mías" para el 720?** Hacienda lo lee así en muchos casos: si la LLC se considera transparente y atribuye rentas, las cuentas pueden tratarse como del titular para reporte. Mejor declararlas o, como mínimo, tenerlas listas para entregar si las piden.

**¿Cripto en wallet propia (Ledger, Trezor) entra en el 721?** No por defecto: el 721 cubre cripto custodiada por terceros (exchanges, plataformas). Wallets self-custody con clave privada propia no entran en 721, pero sí en 714 (Patrimonio) si el saldo supera el umbral autonómico.

En Exentax revisamos qué tienes que declarar (720, 721, 714) según tu situación real, presentamos las declaraciones a tiempo y dejamos el histórico ordenado para que ninguna inspección encuentre huecos.
<!-- /exentax:execution-v2 -->

## Te lo montamos sin que pierdas un fin de semana

Miles de freelancers y emprendedores ya operan con su LLC americana de forma 100% legal y documentada. En Exentax nos encargamos de todo el proceso: constitución, banca, pasarelas de pago, contabilidad, declaraciones <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> y compliance en tu país de residencia. Agenda una asesoría gratuita y te diremos con sinceridad si la LLC tiene sentido para tu caso, sin promesas absolutas.
<!-- task9-2026-expansion -->
## Cómo declarar el Modelo 720 paso a paso: formulario, casillas y ejemplos prácticos

Más allá del marco legal, en la consulta diaria nos preguntan exactamente lo mismo: "tengo Wise, Mercury, un broker y algo de cripto, ¿cómo lo presento sin errores?". Este bloque traduce el reglamento en un tutorial procedimental aplicable a la campaña de **enero a 31 de marzo de 2026**.

### Acceso y obligación de declarar

El Modelo 720 se presenta de forma exclusivamente telemática en la Sede Electrónica de la AEAT con certificado digital, DNIe o Cl@ve PIN. La obligación nace cuando, a 31 de diciembre, la suma del **bloque de cuentas bancarias en el extranjero** supera los **50.000 euros**, con la misma regla aplicada de forma independiente al **bloque de valores, seguros y rentas** y al **bloque de inmuebles**. Si en años posteriores el saldo de un bloque ya declarado se incrementa en más de 20.000 euros, vuelve a haber obligación. La doctrina vigente proviene de la Ley 7/2012 y de la STJUE C-788/19 de 27 de enero de 2022, que tumbó el régimen sancionador desproporcionado pero mantiene la obligación informativa.

### Casillas que más errores generan

- **Tipo de declaración (1)**: marcar "informativa", "complementaria" o "sustitutiva". Mezclarlas obliga a anular y volver a presentar.
- **Clave de condición del declarante (2)**: titular, autorizado, beneficiario o representante. Para Wise Personal en EUR la clave habitual es titular; si la cuenta es Wise Business de tu LLC, la clave es la sociedad y tú firmas como representante.
- **Saldo a 31/12 (valor V)** y **saldo medio último trimestre (valor M)**: ambos en euros con tipo de cambio oficial del Banco Central Europeo del 31/12/2025.
- **Identificación de la entidad y país**: NIF de la entidad si lo tiene, código BIC y código ISO del país. Wise figura como Wise Payments Limited (UK) o Wise US Inc. según producto; Mercury opera con Choice Financial Group y Column N.A. en Estados Unidos.

### Ejemplo numérico bloque por bloque

Caso de un freelancer residente en Madrid con: Wise EUR balance 18.400 €, Mercury Personal Savings 22.300 USD, broker Interactive Brokers con cartera 41.000 €, Kraken con 6.200 € en BTC y ETH. Bloque cuentas: 18.400 + 22.300 USD convertidos al BCE = 39.000 € aprox., por debajo del umbral, **no obliga**. Bloque valores: 41.000 €, por debajo del umbral, **no obliga**. Bloque cripto (Modelo 721): 6.200 €, por debajo del umbral de 50.000 €, **no obliga**. Si al año siguiente añade 35.000 € a Mercury, el bloque cuentas pasa a 74.000 € y dispara la obligación del 720 ese ejercicio.

### Errores que más sanciones generan

1. Olvidar las cuentas Wise Business y Mercury de la LLC cuando el dueño es titular real.
2. No volver a declarar tras un incremento superior a 20.000 € respecto al último 720 presentado.
3. Confundir el saldo medio del último trimestre con el promedio anual.
4. Declarar tarde con presentación voluntaria sin requerimiento: las sanciones son leves pero existen recargos del artículo 27 LGT.

> **¿Tu stack roza los 50.000 € por bloque?** Pasa tus saldos por la <strong>calculadora fiscal Exentax</strong> y mira si el cambio a estructura LLC declarada y limpia compensa la complejidad operativa actual.


Para profundizar en el reporting bancario que precede al 720 conviene leer <a href="/es/blog/cuentas-bancarias-usa-reportan-hacienda-verdad">qué reporta de verdad cada banco USA a Hacienda</a>, y si tu objetivo es minimizar la carga global, el camino lo tienes en <a href="/es/blog/caminos-legales-minimos-impuestos">los caminos legales para pagar el mínimo de impuestos</a>. Si prefieres delegar la presentación, <a href="/es/agendar">agenda una sesión con el equipo Exentax</a> y la dejamos hecha en una semana.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:+34614916910">+34 614 916 910</a> o escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22Si%20eres%20residente%20fiscal%20en%20Espa%C3%B1a%20y%20tienes%20una%20LLC%20americana%2C%20una%20cuenta%20Wis%E2%80%A6%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si prefieres hablarlo en directo, <a href="/es/agendar">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisión editorial pendiente</strong> — Las siguientes referencias requieren verificación manual contra la fuente oficial vigente. Si encuentras una desviación, escríbenos y la corregimos en menos de 24 horas.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">50.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…re tres bloques separados, cada uno con su propio umbral de 50.000 € agregados: | Bloque |…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">20.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…bloque concreto se ha producido un **incremento superior a 20.000 €** respecto al saldo de…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">5.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…el 720 fue uno de los más severos del ordenamiento europeo: 5.000 € por dato omitido (míni…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">10.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…del ordenamiento europeo: 5.000 € por dato omitido (mínimo 10.000 €), imprescriptibilidad …»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">150%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…patrimonial no justificada (art. 39.2 LIRPF) y sanción del 150% sobre la cuota. La **Sente…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">120.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…(art. 305 CP) si la cuota defraudada en un ejercicio supera 120.000 €. La sentencia europe…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">30.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…de la LLC no cambia la obligación informativa. 3. **&quot;Tengo 30.000 € en Wise y 25.000 € en …»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…a la obligación informativa. 3. **&quot;Tengo 30.000 € en Wise y 25.000 € en Mercury, no llego …»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">55.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…al es **agregado** dentro de cada bloque. 30.000 + 25.000 = 55.000 € → obligado a declarar…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">100%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…ut, brokers extranjeros o cripto fuera de España y no estás 100% seguro de tu posición fre…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…r&quot;&gt;OCDE&lt;/a&gt; con sus Comentarios. - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación chec…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §77…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">18.400</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…de un freelancer residente en Madrid con: Wise EUR balance 18.400 €, Mercury Personal Savi…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">22.300</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…id con: Wise EUR balance 18.400 €, Mercury Personal Savings 22.300 USD, broker Interactive…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">41.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…Savings 22.300 USD, broker Interactive Brokers con cartera 41.000 €, Kraken con 6.200 € en…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">6.200</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…broker Interactive Brokers con cartera 41.000 €, Kraken con 6.200 € en BTC y ETH. Bloque c…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">39.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…H. Bloque cuentas: 18.400 + 22.300 USD convertidos al BCE = 39.000 € aprox., por debajo de…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">35.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…mbral de 50.000 €, **no obliga**. Si al año siguiente añade 35.000 € a Mercury, el bloque …»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">74.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…iguiente añade 35.000 € a Mercury, el bloque cuentas pasa a 74.000 € y dispara la obligaci…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…U.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa F…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…cación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…superior a 50.000 € → **Modelo 721**. Si además operas con DAC8 recientemente, el cruce se…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…13 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Conve…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
