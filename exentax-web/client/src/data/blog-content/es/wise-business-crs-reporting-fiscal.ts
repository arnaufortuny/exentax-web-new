export default `

Wise Business (antes TransferWise) es la fintech multidivisa más utilizada por dueños de <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americanas</a> y por emprendedores internacionales en general. Su propuesta de valor es clara: tipo de cambio mid-market, IBAN local en EUR, GBP, USD y otras divisas, y comisiones bajas. Pero Wise también es una entidad financiera europea sujeta al **Common Reporting Standard (CRS)**, y eso tiene implicaciones reales que conviene conocer antes de integrar Wise en tu estructura.

## Qué entidad de Wise opera tu cuenta y dónde reporta

Wise opera mediante varias entidades reguladas:

- **Wise Europe SA** (Bélgica): EMI (Electronic Money Institution) regulada por el **National Bank of Belgium (NBB)**. Es la entidad que da servicio a los clientes europeos desde la salida del Reino Unido del régimen del pasaporte europeo tras el Brexit. Reporta CRS al **Service Public Fédéral Finances** belga, que activa el intercambio bilateral con las autoridades fiscales del país de residencia del titular.
- **Wise Payments Limited** (Reino Unido): EMI regulada por la FCA. Mantiene servicio a clientes UK y a algunos clientes legacy.
- **Wise US Inc.**: regulada en EE.UU. como MSB (Money Services Business). Aquí no aplica CRS porque EE.UU. no está adherido.
- Filiales en Singapur, Australia, India, etc. con sus propios reguladores.

Para clientes europeos y para LLC con representación europea, lo habitual es que la cuenta esté bajo **Wise Europe SA (Bélgica)**. Por tanto, el reporting CRS sale de Bélgica y llega a tu hacienda nacional de residencia.
### Marco normativo

- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>**: Common Reporting Standard.
- **UE**: Directiva 2011/16/UE modificada por DAC2<!-- [REVISIÓN MANUAL: ref legal "DAC2" — verificar contra https://eur-lex.europa.eu — fecha: 2026-04-21] -->.
- **Bélgica**: ley de 16 de diciembre de 2015 que regula el intercambio automático de información financiera (LIAFI) y RD belga de aplicación.
- **España receptora**: Real Decreto 1021/2015, Modelo 720, Modelo 721. Ampliamos en nuestro artículo de <a href="/es/blog/crs-residentes-espana-latam-implicaciones">CRS para residentes en España y LATAM</a>.
### Qué información envía Wise por CRS

Lo mismo que cualquier Reporting Financial Institution sujeta a CRS:

| Bloque | Detalle |
| --- | --- |
| Titular persona física | Nombre, dirección, residencia fiscal declarada, TIN, fecha y lugar de nacimiento |
| Titular entidad | Razón social, dirección, EIN/NIF, clasificación CRS (Active/Passive NFE, Investment Entity) |
| Controlling persons | Si la entidad es Passive NFE: datos de los beneficiarios efectivos (umbral 25%<!-- [REVISIÓN MANUAL: cifra "25%" — verificar contra fuente oficial vigente (revisión editorial) — fecha: 2026-04-21] --> directo/indirecto o control efectivo) |
| Cuenta | IBAN(s) en cada divisa, número interno Wise |
| Saldo | Saldo agregado a 31 de diciembre del ejercicio (Wise gestiona pools por divisa; el reporte agrega) |
| Rendimientos | Intereses si aplica (Wise Interest, Assets), dividendos brutos, ingresos brutos por reembolso (cuentas de custodia, programa Assets) |

El producto **Wise Interest** y los productos de inversión de Wise sobre money market funds caen claramente bajo el reporting de cuentas de custodia, lo que añade el detalle de rendimientos brutos al saldo.
### La clasificación CRS de tu LLC en Wise

Cuando abres una cuenta Wise Business para tu LLC, Wise aplica due diligence CRS sobre la entidad. Te pedirá completar el formulario de **CRS Self-Certification** indicando:

- Residencia fiscal de la LLC: EE.UU.
- Clasificación: Active NFE, Passive NFE, Investment Entity, Reporting Financial Institution, etc.
- Controlling persons (con sus datos: nombre, dirección, residencia fiscal, TIN, fecha y lugar de nacimiento).

En la práctica, una Single-Member LLC de servicios suele cumplir los requisitos de **Active NFE** (más del 50%<!-- [REVISIÓN MANUAL: cifra "50%" — verificar contra fuente oficial vigente (revisión editorial) — fecha: 2026-04-21] --> de sus ingresos son operativos, no pasivos). Pero Wise tiende a aplicar criterios conservadores: si la documentación no es robusta o la actividad no se puede acreditar, clasifica como **Passive NFE** y reporta al controlling person.

La consecuencia: aunque la LLC sea estadounidense y EE.UU. no participe en CRS, **el dato de tu titularidad y de los saldos llegará a tu hacienda nacional** desde Bélgica.
### Cuándo y cómo se reporta

- Cierre del ejercicio: 31 de diciembre.
- Wise envía el reporte CRS a la autoridad belga típicamente entre marzo y junio del año siguiente.
- Bélgica reenvía a las autoridades fiscales del país de residencia de cada titular y controlling person, normalmente antes del 30 de septiembre.
- Tu hacienda dispone del dato y lo cruza con tus declaraciones (en España, IRPF + Modelo 720 + Modelo 721 si aplica).

Por tanto, los saldos de Wise que tienes a 31/12/2025 se cruzan con tu IRPF del ejercicio en curso (declarado en mayo-junio hoy) y con tu Modelo 720 (presentado en marzo hoy).
## Errores frecuentes con Wise y la fiscalidad

1. **"Wise es solo una pasarela, no se entera nadie."** Falso. Wise es entidad financiera regulada y sujeta a CRS plena.
2. **"Si pongo la LLC, no me reportan a mí."** Falso para Passive NFE: se reporta a los controlling persons. Y la mayoría de Single-Member LLC se acaban clasificando como Passive NFE por prudencia del banco.
3. **"Mi saldo medio es bajo, no me reporta."** El saldo que reporta Wise es el de cierre, sin importar cómo haya fluctuado durante el año. Para CRS no hay umbral mínimo en cuentas preexistentes desde 2017 (umbrales de simplificación se eliminaron) ni en cuentas nuevas.
4. **"No declaré Wise en mi 720 porque era pequeño."** El umbral del 720 es agregado entre todas tus cuentas en el extranjero, no por cuenta. Si entre Wise + Mercury + Revolut + N26 superas 50.000<!-- [REVISIÓN MANUAL: cifra "50.000" — verificar contra fuente oficial vigente (revisión editorial) — fecha: 2026-04-21] --> €, todas se declaran.
5. **"Voy a usar Wise solo para divisas, no para custodia."** Aunque uses Wise solo como cuenta operativa (depósito), sigue siendo cuenta financiera reportable. La distinción depósito/custodia afecta al detalle de rendimientos, no al reporte del saldo.
### Comparativa con Revolut y Mercury

| Aspecto | Wise Europe (BE) | Revolut Bank UAB (LT) | Mercury (US) |
| --- | --- | --- | --- |
| Sujeta a CRS | Sí | Sí | No |
| Reporta beneficiario LLC | Sí (Passive NFE típico) | Sí (Passive NFE típico) | No |
| Producto inversión propio | Wise Assets, Interest | Stocks, Vault | Treasury, sweep FDIC |
| Multidivisa nativa | Excelente | Excelente | Solo USD principal |
| Idoneidad cuenta principal LLC | Secundaria | Secundaria | Principal |

Ampliamos esta comparativa en <a href="/es/blog/wise-business-llc-guia">la guía completa de Wise Business para tu LLC</a>, en <a href="/es/blog/revolut-business-crs-reporting-fiscal">el análisis dedicado a Revolut y CRS</a> y, específicamente para el IBAN belga, en <a href="/es/blog/wise-iban-llc-que-reporta-hacienda">qué reporta a tu hacienda el IBAN de Wise asociado a tu LLC</a>.
### Cómo planificar correctamente

1. **Declara correctamente desde el alta.** Indica con precisión la clasificación CRS de tu LLC y los controlling persons. Mentir o omitir es infracción y puede ser delito.
2. **Mantén Wise como cuenta secundaria operativa**, no como cuenta principal del negocio si quieres minimizar la huella CRS hacia tu país. Mercury sigue siendo la cuenta principal natural para una LLC americana.
3. **Asegura coherencia documental.** Tu autodeclaración CRS en Wise, tu Modelo 720 (España) o equivalente LATAM, y tu IRPF deben ser coherentes.
4. **Considera el saldo de cierre.** Si vas a tener un saldo elevado a 31/12, planifica que esté declarado y justificado (origen, finalidad, impuesto pagado).
5. **Conoce el resto del marco**: el <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">diseño global de tu estructura</a> es lo que determina si Wise + LLC + tu residencia funciona o no.
### En resumen

Wise Business no es un atajo para evitar reporting fiscal: es una excelente fintech regulada que reporta por CRS desde Bélgica a tu hacienda. Bien integrada en una estructura coherente con tu LLC americana, es muy útil. Mal integrada o usada con autodeclaraciones inexactas, es la fuente de los problemas fiscales más típicos que vemos.
## Compliance fiscal en tu país: CFC, TFI y atribución de rentas

Una LLC americana es una herramienta legal y reconocida internacionalmente. Pero el cumplimiento no termina al constituirla: como propietario residente fiscal en otro país, tu administración tributaria sigue teniendo derecho a gravar lo que la LLC genera. Lo importante es saber **bajo qué régimen** aplica esa tributación.

### Por jurisdicción

- **España (LIRPF/LIS).** Si la LLC es una *Single-Member Disregarded Entity* operativa (servicios reales, sin pasividad significativa), Hacienda suele tratarla por **atribución de rentas (art. 87 LIRPF)**: los beneficios netos se imputan al socio en el ejercicio en que se generan, integrándose en la base general del IRPF. Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada por residente español con rentas mayoritariamente pasivas, puede activarse el régimen de **transparencia fiscal internacional (art. 91 LIRPF para personas físicas, art. 100 LIS para sociedades)**. La diferencia entre uno u otro régimen no es opcional: depende de la sustancia económica, no del nombre.
- **Modelos informativos.** Cuentas bancarias en EE. UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022; sanciones ahora dentro del régimen general LGT). Operaciones vinculadas con la LLC y dividendos repatriados: **Modelo 232**. Criptoactivos custodiados en EE. UU.: **Modelo 721**.
- **CDI España–EE. UU.** El convenio (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocolo en vigor 27/11/2019) ordena la doble imposición sobre dividendos, intereses y royalties. Una LLC sin establecimiento permanente en España no constituye, por sí sola, EP del socio, pero la dirección efectiva sí puede crearlo si toda la gestión se hace desde territorio español.
- **México, Colombia, Argentina y otros LATAM.** Cada jurisdicción tiene su propio régimen CFC (México: Refipres; Argentina: rentas pasivas del exterior; Chile: art. 41 G LIR). El principio común: lo que la LLC retiene como beneficio se considera percibido por el socio si la entidad se considera transparente o controlada.
La regla práctica: una LLC operativa, con sustancia, declarada correctamente en residencia, es **planificación fiscal legítima**. Una LLC que se usa para ocultar ingresos, simular no residencia o desplazar rentas pasivas sin justificación económica entra en el terreno del **art. 15 LGT (conflicto en aplicación de la norma)** o, en el peor caso, del **art. 16 LGT (simulación)**. La diferencia la marcan los hechos, no el papel.

<!-- exentax:calc-cta-v1 -->
> **Pon números a tu caso.** La <a href="/es#calculadora">calculadora fiscal Exentax</a> compara tu carga fiscal actual con la que pagarías operando una LLC americana correctamente declarada en tu país de residencia.
<!-- /exentax:calc-cta-v1 -->

En Exentax montamos la estructura para que encaje en el primer escenario y documentamos cada paso para que tu declaración local sea defendible ante una eventual revisión.

<!-- exentax:cta-mid -->
**¿Te suena complicado?** En <a href="/es/servicios">nuestros servicios</a> ya incluimos todo lo de "Wise Business y CRS: qué reporta a tu hacienda y cómo encajarlo en tu estructura", presentado en plazo y sin que tengas que tocar nada.

<!-- exentax:cta-final -->
**Cuéntanos tu situación y te decimos por dónde empezar.** Reserva una llamada de 30 minutos sobre "Wise Business y CRS: qué reporta a tu hacienda y cómo encajarlo en tu estructura" y la revisamos a fondo.

<!-- exentax:legal-refs-v1 --><!-- exentax:execution-v2 -->
## Wise Business y CRS: cómo reporta a tu Hacienda y por qué declarar siempre

Wise Business para tu LLC es operativamente excelente - multidivisa, FX barato, IBANs locales en varios países - y, a efectos de reporting fiscal, es entidad financiera plenamente sujeta a CRS. Si eres residente fiscal en España, Francia, Italia, Alemania, Portugal o cualquier país CRS, tu Hacienda recibe los datos cada año. Conviene saber exactamente qué llega y cómo se cruza.

- **Estatus regulatorio de Wise Business.** Wise opera con licencias múltiples: Wise Payments Limited (UK, FCA), Wise Europe SA (Bélgica, NBB), Wise USD Inc (US, <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>), entre otras. Cada entidad regional reporta según el régimen de su jurisdicción. Para usuarios europeos de Wise Business, el reporting CRS lo hace Wise Europe SA al Banco Nacional de Bélgica, que comparte con el resto de jurisdicciones CRS - incluido el Estado de residencia del UBO.
- **Datos exactos transmitidos.** Identificación del titular del beneficial owner según KYC (nombre, DNI/pasaporte, dirección, residencia fiscal declarada al onboarding), saldo a 31 de diciembre por divisa (Wise multimoneda reporta por cada balance USD/EUR/GBP), total de movimientos brutos del año, e identificadores de cuenta (IBAN belga BE para EUR, USD routing number para USD, etc.). NO se transmiten transacciones individuales, sí los agregados.
- **El cruce automático con tu IRPF/IS.** España vincula el dato CRS con tu DNI para cruzarlo con: (1) Modelo 720 si saldo medio del último trimestre o 31/12 supera 50.000€, (2) Modelo 721 si tienes cripto > umbrales, (3) IRPF en la atribución de renta de la LLC. Si los números no casan, sale alerta automática. Resultado típico: requerimiento informativo seguido de procedimiento de comprobación si no respondes con documentación.
- **Lo que cambia si tu LLC tiene Wise Business.** Wise Business EUR (cuenta belga) reporta más rápido y más completo que Wise USD (cuenta US sub-licencia). Si tienes ambas (Wise multimoneda) ambas se reportan, pero por canales distintos (Bélgica → CRS, US → FATCA-IGA). Consecuencia práctica: la visibilidad fiscal es la misma, solo cambia la latencia.

### Lo que más nos preguntan

**Si abro Wise Business como LLC, ¿reporta a US o a mi país?** Reporta a la residencia fiscal del UBO (la persona física). Si dijiste España en el KYC, va a España vía CRS. La LLC es transparente para identificar al UBO; mira la persona detrás.

**¿Puedo declarar la LLC en residencia sin declarar Wise específicamente?** No. La LLC es una cosa (atribución de renta o dividendo según país), Wise es la cuenta bancaria de la LLC y debes declararla en el modelo correspondiente (Modelo 720 España, 3916 Francia, RW Italia). Son dos obligaciones diferentes y los dos cruces son automáticos.

En Exentax estructuramos cuentas Wise + Mercury + Stripe contemplando lo que CRS y FATCA reportan, y planificamos las declaraciones (720, 721, 3916, RW) - para que el cruce automático no genere requerimiento ni sanción de imputación.
<!-- /exentax:execution-v2 -->

## Referencias: fuentes y normativa de banca

Toda la operativa bancaria descrita se apoya en documentación pública y políticas vigentes de cada plataforma actualmente:

- **Bank Secrecy Act y FinCEN.** 31 U.S.C. §5318 (programas KYC/AML obligatorios para instituciones financieras), 31 CFR Part 1010 (CIP, identificación del cliente) y 31 U.S.C. §5336 con su Reporting Rule de FinCEN del 1 de enero de 2024 (Beneficial Ownership Information Report).
- **FATCA y CRS.** IRC §1471<!-- [REVISIÓN MANUAL: ref legal "IRC §1471" — verificar contra https://www.irs.gov — fecha: 2026-04-21] -->-1474 (FATCA y formularios W-8/W-9), Acuerdos Intergubernamentales Modelo 1 firmados por EE. UU. con España y otros países LATAM, y el Estándar Común de Reporte (CRS) de la OCDE en el que EE. UU. no participa pero que sí aplica a fintech con licencia europea (Wise Europe SA en Bélgica, Revolut Bank UAB en Lituania).
- **Plataformas concretas.** Términos de servicio publicados, política de privacidad y FAQ regulatoria de Mercury (Choice Financial Group / Evolve Bank, FDIC), Relay (Thread Bank, FDIC), Wise Business (FinCEN MSB en EE. UU.; Wise Europe SA en EU; Wise Payments Ltd. en UK), Revolut Business y Payoneer.

Información a efectos divulgativos; cada caso bancario requiere análisis específico de KYC, jurisdicción de residencia y volumen operado.

<!-- exentax:cross-refs-v1 -->
### Más lecturas relacionadas

- [Visa y Mastercard: qué ven realmente las haciendas de tu gasto con tarjeta](/es/blog/visa-mastercard-reporting-tarjetas-hacienda)
<!-- /exentax:cross-refs-v1 -->


¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:+34614916910">+34 614 916 910</a> o escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22wise%20business%20crs%20reporting%20fiscal%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si prefieres hablarlo en directo, <a href="/es/agendar">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Reserva una consulta gratuita de 30 minutos: revisamos tu caso real y te decimos qué tiene sentido. <a href="/es/agendar">Agendar consulta gratuita</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Revisión editorial pendiente</strong> — Las siguientes referencias requieren verificación manual contra la fuente oficial vigente. Si encuentras una desviación, escríbenos y la corregimos en menos de 24 horas.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">25%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…s Passive NFE: datos de los beneficiarios efectivos (umbral 25% directo/indirecto o contro…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">50%</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…ios suele cumplir los requisitos de **Active NFE** (más del 50% de sus ingresos son operat…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(cifra)</span> <span class="text-xs italic">— «…por cuenta. Si entre Wise + Mercury + Revolut + N26 superas 50.000 €, todas se declaran. 5…»</span> <strong>[NO VERIFICADO]</strong></li>
<li><span class="font-mono">IRC §1471</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…eneficial Ownership Information Report). - **FATCA y CRS.** IRC §1471-1474 (FATCA y formul…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">DAC2</span> <span class="opacity-70">(referencia legal)</span> <span class="text-xs italic">— «…ing Standard. - **UE**: Directiva 2011/16/UE modificada por DAC2. - **Bélgica**: ley de 16…»</span> <strong>[REVISIÓN MANUAL — fuente sugerida: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
