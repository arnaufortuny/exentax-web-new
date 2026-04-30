# Decisiones de auditoría — registro estable

Este archivo NO se regenera automáticamente. Recoge decisiones tomadas a partir
de los reportes de `docs/auditoria-sistema-seo-faqs/` para que queden trazables
aunque el script vuelva a ejecutarse y sobrescriba `RESUMEN.md`.

## 2026-04-22 · Task #12 — Localizar terminología fiscal en FAQs (PT/CA) y limpiar archivos huérfanos

### FAQ language-leak (PT y CA) — 28 falsos positivos
- **Hallazgo previo**: 28 issues `area: language-leak` en `faqs-audit.json` (14 FAQs × 2 idiomas).
- **Causa raíz**: el regex `SPANISH_TELLS` de `scripts/audit/audit-system-seo-faqs.mjs`
  incluía la palabra `empresa`, que es estándar tanto en portugués como en catalán
  (cognado), no exclusiva del castellano.
- **Verificación manual**: revisión nativa de las 14 FAQs (`fit_2`, `llc_0`, `llc_5`,
  `llc_7`, `llc_9`, `process_2`, `process_7`, `compliance_0`, `compliance_5`,
  `compliance_6`, `compliance_8`, `advanced_6`, `advanced_9`, `tax_0`) en
  `client/src/i18n/locales/pt.ts` y `client/src/i18n/locales/ca.ts`. No se
  encontró ningún término genuinamente castellano residual; el único disparador
  era "empresa".
- **Acción**: se retira `empresa` del set en `audit-system-seo-faqs.mjs` con
  comentario explicativo. Resultado al re-ejecutar: 0 issues `language-leak`.
- **Mejora futura sugerida**: pasar a un set por idioma si se quiere endurecer
  (p.ej. flag `según` sólo en pt/ca, no en es).

### Componentes "huérfanos" — 2 falsos positivos
- **Hallazgo previo**: `CalculatorResults.tsx` y `EmailGateForm.tsx` reportados
  como `dead-code` en `sistema-audit.json`.
- **Causa raíz**: la heurística sólo detectaba imports estáticos
  (`from "./Foo"`). Ambos componentes se cargan dinámicamente con
  `React.lazy(() => import("./Foo"))` desde
  `client/src/components/calculator/index.tsx` (líneas 11–12).
- **Acción**: se amplía el regex de orphan-detection para reconocer también
  `import("./Foo")`. **No se elimina ningún archivo**: ambos componentes están
  en uso. Resultado al re-ejecutar: 0 issues `dead-code`.

### `drizzle.config.ts`
- Existe en la raíz del workspace (`/drizzle.config.ts`), un nivel por encima
  de `exentax-web/`. La función `fileExistsAnywhere` del audit ya lo localiza,
  por lo que **no aparece** como issue. No se requiere acción ni restauración.

## 2026-04-22 · Task #44 — Test de regresión para SPANISH_TELLS_BY_LANG

### Riesgo identificado
- La Task #38 sustituyó el regex global por un mapa por idioma
  (`SPANISH_TELLS_BY_LANG` en `scripts/audit/audit-system-seo-faqs.mjs`). Como cada
  set se endurece manualmente, una FAQ traducida con descuido puede pasar la
  auditoría sin alarma si el término residual no está en el mapa, o puede
  empezar a generar falsos positivos si alguien añade un cognado nativo
  (`empresa`, `quota`, `também`, `també`, `autónomo` en pt-PT, etc.).

### Decisión
- El mapa `SPANISH_TELLS_BY_LANG` y el helper `matchesSpanishTells` se extraen
  a `scripts/audit/audit-system-seo-faqs.lib.mjs` para que sean importables sin
  disparar la auditoría completa. El audit script las consume vía import.
- Se añade `scripts/audit/audit-system-seo-faqs.test.mjs` con 57 fixtures (positivos
  + negativos) que verifican, por cada idioma destino (pt, ca, fr, de, en):
  - que el regex marca los términos castellanos esperados,
  - que NO marca los cognados/grafías nativas conocidas
    (`também`, `autónomo` en pt; `també`, `autònom`, `empresa` en ca;
    `entreprise`/`cotisation`/`impôts` en fr; `Unternehmen`/`Steuern` en de;
    `quota`/`company`/`taxes` en en),
  - que `es` nunca se marca a sí mismo.
- Se sanity-checkea además que existe un `RegExp` para cada idioma destino.

### Integración en CI
- Nuevo script `npm run test:audit-faqs` (alias de
  `node scripts/audit/audit-system-seo-faqs.test.mjs`).
- Encadenado en `npm run check` justo después de `test:lint-blog`, para que
  cualquier modificación del mapa rompa el pipeline si no se actualizan las
  fixtures.

### Cómo extender el test
- Si se añade un nuevo idioma destino: incluirlo en `REQUIRED_LANGS` y añadir
  fixtures positivas + negativas siguiendo el patrón existente.
- Si se cambia un término del mapa a propósito: actualizar la fixture
  correspondiente y dejar constancia en esta sección.

## 2026-04-22 · Task #49 — Residuos castellanos en FAQs embebidas del blog

### Riesgo identificado
- El test de la Task #44 sólo cubre las FAQs de sistema (`faqData.*`). Las FAQs
  embebidas dentro de los posts del blog
  (`client/src/data/blog-content/<lang>/<slug>.ts`, bajo `### Preguntas
  frecuentes` / `### Frequently asked questions` / etc.) se procesaban en otra
  ruta y NO usaban `SPANISH_TELLS_BY_LANG`. Un castellanismo evidente en una
  FAQ traducida podía pasar desapercibido.

### Decisión
- `BLOG_FAQ_HEADINGS`, `extractBlogFaqQAs(src, lang)` y
  `findBlogFaqSpanishTells(src, lang)` se mueven/añaden a
  `scripts/audit/audit-system-seo-faqs.lib.mjs` (mismo módulo sin side-effects que ya
  expone `SPANISH_TELLS_BY_LANG` y `matchesSpanishTells`).
- `scripts/audit/audit-system-seo-faqs.mjs` consume el extractor compartido en su
  inventario blog-FAQ. Para evitar leer cada archivo dos veces, los hallazgos
  por celda se precomputan en `BLOG_FAQ_INVENTORY[slug][lang].spanishTells`
  durante el escaneo. En `auditFaqs()` se recorre cada (slug × lang ≠ es) y se
  emite un issue `area: "blog-faq-spanish-tells"` (P1) por cada hallazgo.
- El campo `spanishTells` es interno: se elimina al clonar el inventario en
  `BLOG_FAQ_SERIALIZABLE` antes de volcar `faqs.blogFaqs.slugs` a
  `faqs-audit.json`, para no engordar el JSON público.
- `blog-content-lint.mjs` y `blog-final-qa.mjs` NO duplican la regla: el audit
  de FAQs ya cubre todos los posts × idiomas y emite los issues con `location`
  a nivel de archivo. Mantenerla en un solo sitio evita divergir el mapa.

### Test de regresión
- `scripts/audit/audit-system-seo-faqs.test.mjs` se extiende con 11 fixtures blog
  (`BLOG_FIXTURES`) que construyen un post sintético por idioma con un bloque
  `### Preguntas frecuentes` localizado y verifican:
  - el extractor encuentra exactamente los pares Q/A esperados,
  - `findBlogFaqSpanishTells` marca pregunta o respuesta cuando inyectamos
    castellanismos (`gestión`, `hacienda`, `también`, `cuota`, `autónomo`),
  - NO marca cognados nativos (`autónomo` en pt-PT, `també`/`autònom` en ca,
    `quota` en en), y `es` nunca se marca a sí mismo.
- Sigue corriendo en `npm run check` vía `npm run test:audit-faqs`; no se
  añaden scripts nuevos al `package.json`.

### Cómo extender el test
- Para un nuevo idioma con FAQs blog: añadir su variante a `BLOG_FAQ_HEADINGS`
  y al `buildBlogPost()` del test, e incluir un par flag/pass en
  `BLOG_FIXTURES`.
- Si se cambia el extractor (separadores `### `, formato `**Q?**`), actualizar
  las fixtures y dejar constancia en esta sección.

---

## Task #56 — Paridad simétrica de cobertura de Q/A en FAQs del blog (2026-04-30)

### Contexto / problema
- Cerrando Task #54 detectamos que el chequeo de paridad de FAQs embebidas en
  posts del blog era asimétrico: `auditFaqs()` sólo emitía un finding cuando
  una traducción tenía MENOS Q/A que la versión ES (`blog-faq-coverage-gap`,
  P2). El caso inverso — una traducción crece y supera al ES — pasaba
  desapercibido y el post fuente se quedaba atrás silenciosamente.

### Decisión
- Se añade `classifyBlogFaqCoverage(esQaCount, otherQaCount)` en
  `scripts/audit/audit-system-seo-faqs.lib.mjs`. Helper puro, sin side-effects,
  que devuelve `"blog-faq-coverage-gap"` | `"blog-faq-coverage-gap-es"` |
  `null` según el sentido del desbalance.
- `auditFaqs()` consume el helper en el bucle por (slug × lang ≠ es). El nuevo
  finding `blog-faq-coverage-gap-es` (P2) apunta a `client/src/data/blog-content/es/<slug>.ts`,
  marca `languages: ["es"]` y sugiere enriquecer la versión ES hasta igualar a
  la traducción más rica (se emite un finding por cada lengua que supera a
  ES).
- Se mantienen ambas direcciones como P2 (guardrail, no bloqueante).

### Hallazgo real al activar el guardrail
- El audit pasó de 0 a 3 issues, todas reales y todas en
  `boi-report-fincen-guia-completa-2026`: la versión ES tiene 3 Q/A vs 5 en
  EN/FR/DE (faltan las preguntas sobre "beneficial owner" y el "30-day update
  window"). Es exactamente el tipo de gap que el chequeo viene a vigilar; se
  deja como follow-up de contenido (no en el alcance de esta task).

### Test de regresión
- `scripts/audit/audit-system-seo-faqs.test.mjs` se extiende con 6 fixtures
  (`COVERAGE_FIXTURES` + un caso end-to-end con `extractBlogFaqQAs`) que fijan:
  conteos iguales → `null`; traducción con menos → `blog-faq-coverage-gap`;
  traducción con más → `blog-faq-coverage-gap-es`; y la cadena
  `extractBlogFaqQAs` + `classifyBlogFaqCoverage` sobre un post EN sintético
  con una Q/A más que el ES.
- Sigue corriendo en `npm run check` vía `npm run test:audit-faqs`.
