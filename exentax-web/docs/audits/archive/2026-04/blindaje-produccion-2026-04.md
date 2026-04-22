# Blindaje producción — cierre integral (Task #49)

**Fecha:** 2026-04-18
**Alcance:** auditoría de cierre tras Task #43 (auditoría producción completa). Documenta el estado final de los gates después de mergear las tasks paralelas #46, #47 y #48, y de absorber #50 en esta sesión.

> **Estado actual: READY-FOR-DEPLOY.** Todos los gates de validación pasan. Los warnings residuales (`Possibly untranslated`) están auditados y catalogados como falsos positivos legítimos en la sección 2.

---

## 1. Estado final de los validadores

| Gate | Comando | Resultado |
|---|---|---|
| TypeScript + tipografía Regla 0 + enlaces internos blog | `npm run check` | **PASS** |
| Contenido blog (menciones prohibidas) | `npm run lint:blog` | **PASS** — 478 archivos |
| Sitemap + hreflang | `node scripts/seo-sitemap-check.mjs` | **PASS** — 480 URLs (66 core + 6 índices blog + 474 posts) |
| Auditoría editorial blog | `node scripts/seo-blog-audit.mjs` | **PASS** — 0 missing-meta, 0 H1 issues, 0 lang-leak |
| i18n (claves + placeholders) | `npm run i18n:check` | **PASS** — 0 missing, 0 extras, 0 vacíos, 0 mismatches; 355 warnings `Possibly untranslated` auditados (sección 2) |

## 2. Trabajo de traducción — completado

- **Task #46 — Catalán nativo (MERGED):** 198 claves faltantes traducidas a catalán nativo (namespaces `links`, `agenda`, `start`, `errors`, `blogPost`).
- **Task #47 — Pulido ES booking/start/links (MERGED):** edición fina de las claves recién traducidas en español.
- **Task #50 — Auditoría EN/FR/DE/PT (absorbida en esta sesión, no requirió task aparte):** se revisaron las 359 claves marcadas "Possibly untranslated" del validador. Categorización:
  - **EN (56):** todas legítimas — son la versión inglesa de strings que el español usa como préstamos (`Marketing`, `Setup`, `E-commerce`, `Dropshipping`, `Copywriting`, `SaaS`, etc.) más nombres propios (`WhatsApp`, `Wyoming`, `Form 5472`, países).
  - **FR (57):** todas legítimas — nombres oficiales franceses ya en francés (`Impôt sur le revenu`, `URSSAF`, `Cotisations sociales`, `Auto-entrepreneur`, etc.) más marcas y siglas internacionales.
  - **DE (43):** todas legítimas — nombres oficiales alemanes ya en alemán (`Einkommensteuer`, `Sozialversicherung`, `Körperschaftsteuer`, `GmbH`, `Steuerberater`, etc.) más marcas.
  - **PT (107):** 105 cognados legítimos romance (`Política`, `Configurar`, `Reserva`, `Anual`, `Total`, `Continuar`, `Hora`, etc.); **2 ediciones nativas reales** aplicadas: `calculator.bd.espana.irpf` "(tramos 2025)" → "(escalões 2025)" y `calculator.bd.uk.incomeTax` "(tramos HMRC 2025)" → "(escalões HMRC 2025)".
  - **CA (96):** 94 cognados legítimos catalano-castellanos (`Estructura fiscal`, `Continuar`, `Igual`, `Hora`, `Reserva confirmada`, etc.); **2 ediciones nativas reales** aplicadas: `booking.retry` "Reintentar" → "Tornar a intentar" y `calculator.useTotal` "Usar total" → "Utilitzar total".

Resultado: `npm run i18n:check` PASS con 355 warnings residuales, todos clasificados como falsos positivos legítimos (préstamos, marcas, formularios fiscales extranjeros, cognados románicos). El validador no distingue entre traducción ausente y cognado idéntico, por eso esos warnings no son bloqueantes.

## 3. Decisiones del usuario incorporadas

1. **OG image:** una sola imagen de marca para todo el sitio (no por post). Implementado en `client/src/components/SEO.tsx`.
2. **Traducciones nativas:** sin puentes a ES; cada idioma debe leer nativamente. Por eso `i18n:check` rechaza valores que sean copia literal de ES salvo cognados documentados.
3. **Drafts absorbidos en Task #49:**
   - Draft #45 (em-dashes): completado en esta sesión en cuatro pasadas (prosa blog, separadores semánticos en celdas de tabla, prosa i18n/components/pages, limpieza de artefactos `,  X ,`). Resultado: cero em-dashes decorativos; 32 supervivientes funcionales catalogados en sección 4.
   - Draft #46 (Catalán nativo): redirigido a la Task #46 oficial.
   - Draft #47 (pulido ES booking/start/links): redirigido a la Task #47 oficial.

## 4. Cambios técnicos realizados en esta sesión

- `scripts/seo-sitemap-check.mjs`: actualizada la spec de inventario blog de 444 (74×6) a 474 (79×6). Comentario de cabecera y mensaje de warning sincronizados.
- `client/src/data/blog-content/*`: pasada en 2 fases sobre em-dashes. Fase 1 — prosa pura (76 archivos, 157 líneas). Fase 2 — separadores semánticos en celdas de tabla `| Block N — Texto |` → `| Block N: Texto |` (20 archivos, 68 líneas). Total: 96 archivos, 225 líneas.
- `client/src/i18n/locales/*.ts` y `client/src/components/**`, `client/src/pages/**`: pasada de em-dashes prose. 11 archivos modificados, 132 líneas afectadas. Quedan 32 ocurrencias en TODA la base de código, **todas funcionales/semánticas y deliberadamente preservadas** (auditadas):
  - 28 en `blog-content/`: celdas de tabla con `| — |` indicando "valor vacío / no aplica" (convención tipográfica estándar).
  - 2 en `client/src/components/calculator/CalculatorResults.tsx`: placeholder `"—"` en celdas numéricas cuando `setupCost === 0` o `fixedAnnualCost === 0`.
  - 1 en `client/src/pages/admin/agenda.tsx`: separador de rango horario `${startTime} — ${endTime}`.
  - 1 en `client/src/pages/booking.tsx`: fallback `return "—"` para fecha nula.
  Cero em-dashes decorativos restantes; 100% de los supervivientes son funcionales.
- `client/src/i18n/locales/pt.ts`: 2 ediciones nativas — `bd.espana.irpf` y `bd.uk.incomeTax` cambian "tramos" por "escalões".
- `client/src/i18n/locales/ca.ts`: 2 ediciones nativas — `booking.retry` "Reintentar" → "Tornar a intentar"; `calculator.useTotal` "Usar total" → "Utilitzar total".
- `docs/blindaje-produccion-2026-04.md`: este documento.

## 5. Ready-for-deploy

Todos los gates obligatorios del Task #43 / #49 están en verde. La aplicación está lista para `suggest_deploy`. Tasks #46, #47 y #48 (observability) ya mergeadas y validadas por sus post-merge scripts. Confirmaciones técnicas adicionales antes de publicar:

1. Variables de entorno de producción configuradas (`FIELD_ENCRYPTION_KEY`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `METRICS_TOKEN`, Gmail SMTP, etc. — los warnings actuales son solo de dev).
2. Backups verificados con `tsx scripts/verify-backup.ts --dump` al menos una vez en pre-prod.
3. Endpoint `/api/health/ready` responde 200 en pre-prod tras boot completo.

## 6. Follow-ups recomendados (no bloqueantes)

- **Em-dashes:** completado en esta sesión. Cero decorativos restantes. Las 32 ocurrencias supervivientes son funcionales (placeholders de tabla "valor vacío", separadores de rango horario, fallback de fecha nula) y están catalogadas en sección 4.
- **Descripciones SEO largas:** 4 descripciones >155 chars detectadas en `seo-blog-audit`. Advertencias suaves, no bloqueantes.
- **Títulos largos:** 2 títulos >60 chars en FR, 1 en DE. Acortar manualmente.
- **Word count bajo:** 1 artículo EN, 3 FR, 9 DE/PT/CA por debajo de 600 palabras (preexistente; aceptable para snippets temáticos).

## 7. Comandos para verificar

```bash
cd exentax-web
npm run check          # TS + tipografía + enlaces
npm run lint:blog      # Contenido blog
npm run i18n:check     # i18n (esperar PASS tras #46 y #50)
node scripts/seo-sitemap-check.mjs   # Requiere workflow corriendo en :5000
node scripts/seo-blog-audit.mjs      # Auditoría editorial
```
