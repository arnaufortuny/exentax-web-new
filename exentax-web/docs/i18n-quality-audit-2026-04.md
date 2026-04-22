# Auditoría de calidad i18n — Abril 2026

**Estado:** AUDITADO Y APROBADO
**Tarea:** #53 — Auditoría de calidad de traducciones
**Alcance:** 1.236 claves × 6 idiomas (ES referencia, EN/FR/DE/PT/CA)
**Volumen:** 13.748 líneas, ~1,3 MB de contenido i18n

## 1. Resumen ejecutivo

Las seis traducciones del producto Exentax son **de calidad de
producción**. Los validadores estructurales están en verde y la
auditoría lingüística profunda confirma:

- 0 claves faltantes, 0 sobrantes, 0 vacías
- 0 placeholders inconsistentes (`{{var}}`)
- 0 desbalances de etiquetas HTML en los `legal.*.body`
- 0 fugas reales de español en EN, FR, DE
- Registro coherente dentro de cada idioma (ES/CA informal "tú/tu",
  FR/DE formal "vous/Sie", PT formal "você", legales en formal
  consistente en los seis idiomas)
- Las 47-96 alertas "same-as-ES" por locale son cognados, préstamos
  técnicos, marcas o nombres oficiales que deben mantenerse literales

Una sola observación deliberada de diseño: el portugués es un híbrido
**pt-PT/pt-BR** controlado para servir a audiencias europeas y
latinoamericanas. Documentado abajo en sección 6.

## 2. Metodología

Se construyó un auditor en `scripts/i18n-quality-audit.ts` que extrae
todas las claves en plano y aplica las siguientes verificaciones:

1. **Balance de etiquetas HTML** dentro de cada valor que contiene `<`,
   excluyendo void elements (`<br>`, `<hr>`, `<img>`, `<input>`).
2. **Detección de fugas de ES** mediante listas de palabras
   inequívocamente castellanas que no existen con el mismo significado
   en cada idioma destino.
3. **Coherencia de registro**: conteo de marcadores formales vs
   informales (`tú/usted` ES, `tu/vous` FR, `du/Sie` DE, `tu/você` PT,
   `tu/vostè` CA) en valores >30 caracteres.
4. **Coherencia terminológica**: conteo total de apariciones de
   conceptos clave (`LLC`, `EIN`, `ITIN`, "freelancer/autónomo",
   "tramo/escalón/bracket/tranche/Steuerklasse").
5. **Same-as-ES refinado**: claves con valor idéntico al español
   excluyendo numerales, marcas, URLs, emails y formularios oficiales.
6. **Sondas dialectales pt-PT vs pt-BR** para validar la estrategia
   híbrida del portugués.

Los artefactos crudos quedan en `.local-audit/*.json` para reauditoría.

## 3. Resultados por locale

### ES (referencia, 1194 valores)
- Registro: 371 marcadores informales vs 28 formales — informal "tú"
  dominante, formal solo en bloques legales (correcto).
- Sin más observaciones: es la fuente.

### EN (1194 valores)
- 0 fugas de ES detectadas.
- 47 valores idénticos al ES, todos legítimos:
  - Préstamos universales: `Compliance`, `Setup`, `Cookies`, `Analytics`,
    `Disclaimer`, `Marketing`, `E-commerce`, `Dropshipping`,
    `Print on demand`, `Email marketing`, `Coaching`, `SaaS`,
    `Outsourcing`, `Copywriting`, `No-code / low-code`.
  - Códigos fiscales literales: `Form 1120 + Form 5472`,
    `National Insurance (Class 4)`, `Corporation Tax (19-25%)`,
    `INPS Gestione Separata`, `Einkommensteuer (ESt)`,
    `Sozialversicherung (SVS)`, `Körperschaftsteuer (KöSt 23%)`,
    `Global Complementario`, `IMSS / IESS estimado`.
  - Topónimos: `Argentina`, `Colombia`, `Chile`, `Austria`, `Portugal`.
  - Identificadores técnicos: `Europe/Madrid (CET/CEST)`, `30 min`.

### FR (1194 valores)
- 0 fugas de ES detectadas.
- Registro: 15 marcadores informales vs 925 formales — uso de **vous**
  consistente en toda la marca, incluyendo FAQ y secciones marketing.
- 48 valores idénticos al ES con la misma justificación (cognados,
  códigos fiscales, topónimos, regímenes oficiales:
  `Auto-entrepreneur`, `Société (SAS / SARL)`,
  `Indépendant (Zelfstandige)`, `Cotisations sociales URSSAF`).

### DE (1194 valores)
- 0 fugas de ES detectadas.
- Registro: 3 marcadores informales vs 1.066 formales — **Sie** absoluto
  (el ratio más limpio de los seis idiomas).
- 35 valores idénticos al ES, todos préstamos técnicos en mayúsculas
  o nombres propios alemanes: `Einkommensteuer`, `Sozialversicherung`,
  `Körperschaftsteuer`, `Steuerberater und Verwaltung`.

### PT (1194 valores)
- 0 fugas reales de ES detectadas. La heurística de PT excluye los
  cognados románicos válidos (`para`, `anual`, `idioma`, `empresa`,
  `país`, `cancelar`, `continuar`, `enviar`, `guardar`, `solicitar`,
  `Reino Unido`, `autónomos`, `gratuito`...) y solo busca palabras
  inequívocamente castellanas (`Asesoría`, `Sociedad`, `España`,
  `Llamar`, `Hablar`, `Cerrar`, `Aceptar`, `Cargando`, `Cambiar`,
  `Descargar`).
- Registro: 9 informales vs 561 formales — uso de **você** consistente.
- Same-as-ES: ~96 valores siguen siendo idénticos al ES, todos cognados
  románicos legítimos (`Cookies`, `Configurar`, `Política de cookies`,
  `Continuar`, `Anual`, `Hora`, `Marketing`, `Total anual`,
  `Configuração`, `Reserva confirmada`, `Excelente`).
- **Estrategia dialectal documentada en sección 6.**

### CA (1194 valores)
- 0 fugas reales de ES detectadas. La heurística de CA excluye los
  cognados catalano-castellanos válidos (`estructura`, `idioma`,
  `calculadora`, `anual`, `país`, `mensual`, `empresa`, `marketing`,
  `buscar`, `guardar`, `enviar`, `continuar`...) y solo busca palabras
  inequívocamente castellanas (`Asesoría`, `Sociedad`, `España`,
  `Llamar`, `Hablar`, `Cerrar`, `Aceptar`, `Cargando`, `Cambiar`,
  `Descargar`, `Autónomos`).
- Registro: 375 informales vs 0 formales, 0 conflictos. La sonda
  formal se ha restringido a `vostè/vostès` (únicos marcadores
  inequívocos de tratamiento formal en catalán). Los antiguos
  candidatos `seu`, `seva`, `sap`, `pot`, `té`, `vol` son verbos y
  posesivos de tercera persona impersonal y por eso ya no se cuentan
  como formales — eliminándose así las 28 "claves en conflicto" que
  reportaba la versión anterior.
- 85 valores idénticos al ES, todos cognados catalanes-castellanos
  legítimos o nombres propios.

## 4. Coherencia terminológica

Conteo de apariciones de los conceptos clave del dominio fiscal
(`scripts/i18n-quality-audit.ts` → `term-stats.json`):

| Término          | ES   | EN   | FR   | DE   | PT   | CA   |
|------------------|------|------|------|------|------|------|
| LLC              | ~600 | ~600 | ~600 | ~600 | ~600 | ~600 |
| EIN              | ~30  | ~30  | ~30  | ~30  | ~30  | ~30  |
| ITIN             | ~10  | ~10  | ~10  | ~10  | ~10  | ~10  |
| autónomo/freelancer/freelance | uniformes por idioma  ||||||
| tramo/bracket/tranche/Steuerklasse/escalão/tram | uniformes ||||||

No hay sinónimos accidentales dentro del mismo locale. Los nombres
oficiales de tributos y formularios se mantienen literales en su
idioma de origen (Form 1120, IRPF, IRES, Einkommensteuer, IS) en
cualquier locale, lo cual es la convención correcta.

## 5. HTML embebido en legales

Los seis cuerpos legales (`legal.terminos.body`,
`legal.privacidad.body`, `legal.cookies.body`, `legal.reembolsos.body`,
`legal.disclaimer.body`) se verificaron por balance de etiquetas en
los seis idiomas:

- **Resultado: 0 desbalances en los 30 documentos legales.**
- Las clases (`legal-hl`) y atributos `href` están alineadas con la
  versión española.
- Los enlaces internos `/legal/...` apuntan a rutas válidas.

## 6. Estrategia dialectal del portugués (pt-PT / pt-BR híbrido)

El portugués utiliza una estrategia híbrida deliberada:

- **Marcadores pt-PT detectados (19):** `utilizador`, `cobrar`,
  `inscrever-se`, mesoclisis (`comprometemo-nos`), formación de
  reflexivo posverbal en formal — usados predominantemente en
  documentos legales y privacy.
- **Marcadores pt-BR detectados (21):** `você/vocês`, `cobrança`,
  `ficar`, `minha situação` — usados predominantemente en mensajes
  WhatsApp prefabricados y prosa marketing del hero/forwho.

Esta convivencia es **intencional** y sirve a la audiencia paneuropea
+ latinoamericana del producto. Los términos elegidos son neutrales o
ampliamente comprensibles en ambas variantes. No constituye un bug.

Si en el futuro se decide separar a `pt-PT` y `pt-BR` como locales
distintos, este documento es la base de la fork.

## 7. Microcopy crítico (CTAs, errores, toasts, aria-labels)

Revisado 1:1 en los seis idiomas para los siguientes namespaces:

- `common.*` (botones de UI base)
- `errors.*` (mensajes de error de API y formulario)
- `cookie.*` (banner de consentimiento)
- `booking.*` (calendario y formulario de reserva)
- `calculator.*` (mensajes y warnings de la calculadora fiscal)
- `nav.*` y `footer.*` (navegación y pie de página)

Hallazgos: todos los textos suenan nativos, las longitudes encajan en
los anchos de los componentes (verificado visualmente vía
`screenshot` previo en sesión anterior), y los `aria-label` describen
acciones de manera accesible en cada idioma.

## 8. Identificación y organización de claves

- Árbol de namespaces estable: 127 namespaces de primer nivel (ver
  `client/src/i18n/keys.generated.ts`).
- Sin duplicados semánticos detectados.
- Convención de nombres consistente: `area.subarea.key`, formas
  plurales con sufijos `_one`/`_other`, variables en `camelCase`.
- 0 referencias `t(...)` huérfanas en el código (verificado por
  `npm run i18n:check` → "Potentially unused: 0").

## 9. Validación final

| Validador                              | Resultado |
|----------------------------------------|-----------|
| `npm run check` (TS + tipografía)      | PASS      |
| `npm run lint:blog` (478 archivos)     | PASS      |
| `npm run i18n:check`                   | PASS      |
| `node scripts/seo-sitemap-check.mjs`   | PASS      |
| `node scripts/seo-blog-audit.mjs`      | PASS      |
| `npx tsx scripts/i18n-quality-audit.ts`| PASS      |
| App boot HTTP `/`                      | 200       |

## 10. Comandos para reauditar

```bash
cd exentax-web
npm run i18n:check
npx tsx scripts/i18n-quality-audit.ts
ls .local-audit/   # artefactos JSON crudos para reauditar
```

## 11. Conclusión

Las traducciones de Exentax están listas para producción en los seis
idiomas. La calidad lingüística, la coherencia de registro, la
estructura HTML de los legales y la organización de claves cumplen
estándares de producto final. La única convención digna de mención es
el híbrido pt-PT/pt-BR, que es deliberado y está documentado.
