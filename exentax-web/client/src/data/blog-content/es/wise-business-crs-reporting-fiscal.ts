export default `Wise Business (antes TransferWise) es la fintech multidivisa más utilizada por dueños de <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americanas</a> y por emprendedores internacionales en general. Su propuesta de valor es clara: tipo de cambio mid-market, IBAN local en EUR, GBP, USD y otras divisas, y comisiones bajas. Pero Wise también es una entidad financiera europea sujeta al **Common Reporting Standard (CRS)**, y eso tiene implicaciones reales que conviene conocer antes de integrar Wise en tu estructura.

  ## Qué entidad de Wise opera tu cuenta y dónde reporta

  Wise opera mediante varias entidades reguladas:

  - **Wise Europe SA** (Bélgica): EMI (Electronic Money Institution) regulada por el **National Bank of Belgium (NBB)**. Es la entidad que da servicio a los clientes europeos desde la salida del Reino Unido del régimen del pasaporte europeo tras el Brexit. Reporta CRS al **Service Public Fédéral Finances** belga, que activa el intercambio bilateral con las autoridades fiscales del país de residencia del titular.
  - **Wise Payments Limited** (Reino Unido): EMI regulada por la FCA. Mantiene servicio a clientes UK y a algunos clientes legacy.
  - **Wise US Inc.**: regulada en EE.UU. como MSB (Money Services Business). Aquí no aplica CRS porque EE.UU. no está adherido.
  - Filiales en Singapur, Australia, India, etc., con sus propios reguladores.

  Para clientes europeos y para LLC con representación europea, lo habitual es que la cuenta esté bajo **Wise Europe SA (Bélgica)**. Por tanto, el reporting CRS sale de Bélgica y llega a tu hacienda nacional de residencia.

  ## Marco normativo

  - **OCDE**: Common Reporting Standard.
  - **UE**: Directiva 2011/16/UE modificada por DAC2.
  - **Bélgica**: ley de 16 de diciembre de 2015 que regula el intercambio automático de información financiera (LIAFI) y RD belga de aplicación.
  - **España receptora**: Real Decreto 1021/2015, Modelo 720, Modelo 721. Ampliamos en nuestro artículo de <a href="/es/blog/crs-residentes-espana-latam-implicaciones">CRS para residentes en España y LATAM</a>.

  ## Qué información envía Wise por CRS

  Lo mismo que cualquier Reporting Financial Institution sujeta a CRS:

  | Bloque | Detalle |
  | --- | --- |
  | Titular persona física | Nombre, dirección, residencia fiscal declarada, TIN, fecha y lugar de nacimiento |
  | Titular entidad | Razón social, dirección, EIN/NIF, clasificación CRS (Active/Passive NFE, Investment Entity) |
  | Controlling persons | Si la entidad es Passive NFE: datos de los beneficiarios efectivos (umbral 25% directo/indirecto o control efectivo) |
  | Cuenta | IBAN(s) en cada divisa, número interno Wise |
  | Saldo | Saldo agregado a 31 de diciembre del ejercicio (Wise gestiona pools por divisa; el reporte agrega) |
  | Rendimientos | Intereses si aplica (Wise Interest, Assets), dividendos brutos, ingresos brutos por reembolso (cuentas de custodia, programa Assets) |

  El producto **Wise Interest** y los productos de inversión de Wise sobre money market funds caen claramente bajo el reporting de cuentas de custodia, lo que añade el detalle de rendimientos brutos al saldo.

  ## La clasificación CRS de tu LLC en Wise

  Cuando abres una cuenta Wise Business para tu LLC, Wise aplica due diligence CRS sobre la entidad. Te pedirá completar el formulario de **CRS Self-Certification** indicando:

  - Residencia fiscal de la LLC: EE.UU.
  - Clasificación: Active NFE, Passive NFE, Investment Entity, Reporting Financial Institution, etc.
  - Controlling persons (con sus datos: nombre, dirección, residencia fiscal, TIN, fecha y lugar de nacimiento).

  En la práctica, una Single-Member LLC de servicios suele cumplir los requisitos de **Active NFE** (más del 50% de sus ingresos son operativos, no pasivos). Pero Wise tiende a aplicar criterios conservadores: si la documentación no es robusta o la actividad no se puede acreditar, clasifica como **Passive NFE** y reporta al controlling person.

  La consecuencia: aunque la LLC sea estadounidense y EE.UU. no participe en CRS, **el dato de tu titularidad y de los saldos llegará a tu hacienda nacional** desde Bélgica.

  ## Cuándo y cómo se reporta

  - Cierre del ejercicio: 31 de diciembre.
  - Wise envía el reporte CRS a la autoridad belga típicamente entre marzo y junio del año siguiente.
  - Bélgica reenvía a las autoridades fiscales del país de residencia de cada titular y controlling person, normalmente antes del 30 de septiembre.
  - Tu hacienda dispone del dato y lo cruza con tus declaraciones (en España, IRPF + Modelo 720 + Modelo 721 si aplica).

  Por tanto, los saldos de Wise que tienes a 31/12/2025 se cruzan con tu IRPF 2025 (declarado en mayo-junio 2026) y con tu Modelo 720 (presentado en marzo 2026).

  ## Errores frecuentes con Wise y la fiscalidad

  1. **"Wise es solo una pasarela, no se entera nadie."** Falso. Wise es entidad financiera regulada y sujeta a CRS plena.
  2. **"Si pongo la LLC, no me reportan a mí."** Falso para Passive NFE: se reporta a los controlling persons. Y la mayoría de Single-Member LLC se acaban clasificando como Passive NFE por prudencia del banco.
  3. **"Mi saldo medio es bajo, no me reporta."** El saldo que reporta Wise es el de cierre, sin importar cómo haya fluctuado durante el año. Para CRS no hay umbral mínimo en cuentas preexistentes desde 2017 (umbrales de simplificación se eliminaron) ni en cuentas nuevas.
  4. **"No declaré Wise en mi 720 porque era pequeño."** El umbral del 720 es agregado entre todas tus cuentas en el extranjero, no por cuenta. Si entre Wise + Mercury + Revolut + N26 superas 50.000 €, todas se declaran.
  5. **"Voy a usar Wise solo para divisas, no para custodia."** Aunque uses Wise solo como cuenta operativa (depósito), sigue siendo cuenta financiera reportable. La distinción depósito/custodia afecta al detalle de rendimientos, no al reporte del saldo.

  ## Comparativa con Revolut y Mercury

  | Aspecto | Wise Europe (BE) | Revolut Bank UAB (LT) | Mercury (US) |
  | --- | --- | --- | --- |
  | Sujeta a CRS | Sí | Sí | No |
  | Reporta beneficiario LLC | Sí (Passive NFE típico) | Sí (Passive NFE típico) | No |
  | Producto inversión propio | Wise Assets, Interest | Stocks, Vault | Treasury, sweep FDIC |
  | Multidivisa nativa | Excelente | Excelente | Solo USD principal |
  | Idoneidad cuenta principal LLC | Secundaria | Secundaria | Principal |

  Ampliamos esta comparativa en <a href="/es/blog/wise-business-llc-guia">la guía completa de Wise Business para tu LLC</a> y en <a href="/es/blog/revolut-business-crs-reporting-fiscal">el análisis dedicado a Revolut y CRS</a>.

  ## Cómo planificar correctamente

  1. **Declara correctamente desde el alta.** Indica con precisión la clasificación CRS de tu LLC y los controlling persons. Mentir o omitir es infracción y puede ser delito.
  2. **Mantén Wise como cuenta secundaria operativa**, no como cuenta principal del negocio si quieres minimizar la huella CRS hacia tu país. Mercury sigue siendo la cuenta principal natural para una LLC americana.
  3. **Asegura coherencia documental.** Tu autodeclaración CRS en Wise, tu Modelo 720 (España) o equivalente LATAM, y tu IRPF deben ser coherentes.
  4. **Considera el saldo de cierre.** Si vas a tener un saldo elevado a 31/12, planifica que esté declarado y justificado (origen, finalidad, impuesto pagado).
  5. **Conoce el resto del marco**: el <a href="/es/blog/diseno-estructura-fiscal-internacional-solida">diseño global de tu estructura</a> es lo que determina si Wise + LLC + tu residencia funciona o no.

  ## En resumen

  Wise Business no es un atajo para evitar reporting fiscal: es una excelente fintech regulada que reporta por CRS desde Bélgica a tu hacienda. Bien integrada en una estructura coherente con tu LLC americana, es muy útil. Mal integrada o usada con autodeclaraciones inexactas, es la fuente de los problemas fiscales más típicos que vemos.

  ¿Quieres que revisemos cómo encaja Wise en tu estructura y qué se reporta a tu hacienda en tu caso concreto? Agenda tu asesoría gratuita.`;
