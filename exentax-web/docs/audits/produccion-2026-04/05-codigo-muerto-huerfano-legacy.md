# Audit 05 — Código muerto, huérfano y legacy

Fecha: 2026-04-30 · Modo: revisión profunda, evidencias verificadas a `rg`/`ls`/`diff`.

> **Honestidad metodológica.** Lancé tres agentes de exploración en paralelo
> (backend / frontend / scripts-tests-deps). Antes de redactar nada, **verifiqué
> manualmente cada afirmación** contra el repositorio. **Descarté siete falsos
> positivos** de los agentes (ver §6). Lo que queda abajo está respaldado por
> grep concreto.

---

## 1. Resumen ejecutivo

| Categoría | Confirmados | Acción recomendada |
|---|---|---|
| Tests sin runner (no se ejecutan en `npm run check`) | **8 ficheros** | Cablear en `package.json` + `scripts/check.mjs` |
| Scripts huérfanos en `exentax-web/scripts/` | **3 ficheros** | Borrar o documentar |
| Scripts huérfanos en raíz del workspace `../scripts/` | **5 ficheros (~150 KB)** | Borrar (no hay `.github/workflows/` que los invoque) |
| Cadenas “preparadas pero no enchufadas” | **1** (`seo-orphan-audit-ci.mjs`) | Cablear o borrar el wrapper |
| Duplicación blanda real | **1 par** (`madrid-time.ts` cliente vs shared) | Consolidar |
| Deuda técnica viva con plan de extinción | **1** (drip `booking` cohort) | Drenar y borrar |
| Ficheros server/ huérfanos | **0** | (todo ⌘ verificado está enchufado) |
| Páginas/componentes/hooks frontend huérfanos | **0** | (todo verificado está enchufado) |
| Dependencias npm sin uso | **0 detectadas** | — |
| Ficheros `.bak` / `.old` / `.legacy` / `.orig` | **0** | — |

> **Conclusión global.** El código de producción (`server/` + `client/src/`) está
> sorprendentemente limpio: no hay un solo módulo huérfano confirmado. La
> rotación legacy real está concentrada en (a) tests no integrados, (b) scripts
> de auditoría/notificación que sobraron de iteraciones anteriores y (c) un par
> de cohortes de email/drip programadas para extinción.

---

## 2. Tests no conectados a ningún runner — **alta prioridad**

`npm run check` (a través de `scripts/check.mjs`) ejecuta una lista explícita
de pasos. Los siguientes ficheros existen en `tests/`, **no** están en esa lista
**ni** en ningún script npm **ni** son invocados por otro test:

| Fichero | Verificado contra | Notas |
|---|---|---|
| `tests/admin-api-removed.test.ts` | `package.json`, `scripts/check.mjs`, `scripts/discord/run-regression.mjs` | Solo se menciona en `docs/route-map.md` (referencia documental, no runner) |
| `tests/consent-atomicity.test.ts` | idem | Ya señalado por el revisor de Task #36 |
| `tests/drip-exactly-once.test.ts` | idem | Ya señalado por el revisor de Task #36; sin ninguna mención fuera del propio fichero |
| `tests/discord-no-token-leak.test.ts` | idem | Solo en `docs/discord-channels.md`, `docs/discord-bot-agenda.md`, `docs/auditoria-2026-04/RESUMEN.md` |
| `tests/discord-event-notifications.test.ts` | idem | Solo en `docs/auditoria-2026-04/RESUMEN.md` |
| `tests/discord-queue-persistence.test.ts` | idem | `test:discord-regression` ejecuta `scripts/discord/run-regression.mjs` que corre **otros** ficheros (`test-discord-neon.ts`, `test-discord-bot-buttons.ts`, `test-discord-bot-e2e.ts`, `test-discord-manifest-validator.ts`, `test-discord-component-validator.ts`); este `.test.ts` queda fuera |
| `tests/email-template-security.test.ts` | idem | Sin ninguna mención fuera del propio fichero |
| `tests/madrid-time-dst.test.ts` | idem | Solo en `docs/discord-bot-agenda.md` |

**Por qué importa.** Existen ficheros de test diseñados específicamente para
prevenir regresiones críticas (atomicidad de consentimiento, exactamente-una-vez
de drip, fugas de token, persistencia de cola, seguridad de plantillas) que
**no se ejecutan nunca**. La cobertura aparente del proyecto es mayor que la
real.

**Acción recomendada.** Añadir cada uno como `test:<nombre>` en
`package.json` y registrarlo en `scripts/check.mjs` con su peso estimado
(`weight`). El skill `fullstack-js` prohíbe modificar `package.json` sin
autorización, por eso no lo he tocado en este audit.

---

## 3. Scripts huérfanos en `exentax-web/scripts/`

Verificación: `rg -l <basename> --type ts --type js --type mjs --type sh --type md package.json scripts/ docs/`.

| Fichero | Tamaño | Hallazgo | Acción |
|---|---|---|---|
| `scripts/audit/audit-conversion-es-2026-04.mjs` | — | Sin ningún caller. Auditoría puntual de campaña; el flujo activo es `audit:conversion` → `audit-conversion-112x6.mjs` | Borrar tras consolidar hallazgos |
| `scripts/audit/auditoria-rutas-componentes-discord-emails.mjs` | — | Sin callers. Su lógica está cubierta por la suite actual de `npm run check` | Borrar |
| `scripts/blog/dedup-consecutive-paragraphs.mjs` | — | Sin callers. Utilidad de migración blog | Borrar o mover a `docs/playbooks/` con instrucciones |

### 3.1. Cadena “preparada pero no enchufada”

| Fichero | Estado |
|---|---|
| `scripts/seo-orphan-audit.mjs` | **Es invocado** por `scripts/seo-orphan-audit-ci.mjs:46` (`AUDIT_SCRIPT = … "scripts/seo-orphan-audit.mjs"`). No es huérfano por sí solo. |
| `scripts/seo-orphan-audit-ci.mjs` | **Sin callers.** Su docblock dice: *“Task #23 — make orphan detection a fail-fast gate of `npm run blog:validate-all` / `npm run check`”*. Existe la integración pero no se cableó. |

**Acción.** O cablear `seo-orphan-audit-ci.mjs` en `npm run check` (cumpliendo
la promesa documentada de Task #23 — actualmente IN_PROGRESS), o borrar la
pareja completa si el approach se descartó.

---

## 4. Scripts huérfanos en raíz del workspace `../scripts/`

| Fichero | Tamaño | Callers detectados | Acción |
|---|---|---|---|
| `../scripts/inject-crs2-blocks.mjs` | 32 KB | **0** (versión activa: `exentax-web/scripts/blog/inject-crs2-citations.mjs`) | Borrar |
| `../scripts/live-verification.sh` | 20 KB | **0** | Borrar |
| `../scripts/notify-live-verification-discord.mjs` + `.test.mjs` | 32 + 35 KB | **0** | Borrar par completo |
| `../scripts/notify-monitoring-offline-issue.mjs` + `.test.mjs` | 13 + 17 KB | **0** | Borrar par completo |

**Aviso sobre un falso positivo del subagente.** El agente afirmó que
`notify-monitoring-offline-issue.mjs` está “activo en `quality-pipeline.yml`”.
**No existe** ese workflow: `ls .github/` y `ls .github/workflows/` devuelven
vacío en todo el workspace. Estos scripts son, claramente, restos de un setup
de CI anterior que ya no aplica. Total a depurar: **~150 KB**.

**Únicos scripts en raíz que sí se usan**: `../scripts/post-merge.sh` (lo
ejecuta el platform tras cada merge — confirmado por el log post-merge de Task
#20 pegado al inicio de esta sesión).

---

## 5. Hallazgos blandos (no urgentes pero reales)

### 5.1. Duplicación: `madrid-time.ts`

| Fichero | Bytes | Consumidores |
|---|---|---|
| `client/src/lib/madrid-time.ts` | 1781 | `client/src/pages/booking.tsx` (1 caller) |
| `shared/madrid-time.ts` | 2403 | `server/route-helpers.ts`, `server/server-constants.ts`, `server/calendar-invite.ts`, `client/src/components/Calendar.tsx`, `client/src/components/BookingCalendar.tsx` (5 callers) |

`diff -q` confirma que **no son idénticos**. Coexisten dos implementaciones
del mismo concepto (“hora de Madrid con DST”), una usada solo por la página
de gestión de booking, la otra por el resto del sistema. Riesgo: drift entre
la página `/booking/:token` y el calendario real.

**Acción.** Mover lo que falte a `shared/madrid-time.ts` y borrar
`client/src/lib/madrid-time.ts` (un caller cambia el import).

### 5.2. Deuda técnica viva con plan de extinción

`server/scheduled/drip-worker.ts` mantiene cohorte `booking` con comentarios
explícitos:

```
// booking → legacy. New booking submissions no longer enroll
booking: 3 * ONE_DAY_MS, // legacy — kept for in-flight rows
booking: 6, // legacy
```

Esto **no es rot**: es deuda técnica documentada con plan de extinción
implícito (drenar las filas en vuelo y borrar). Ya no se inscriben nuevos
bookings en este drip; conviene **agendar una fecha** para verificar 0 filas
activas y borrar el código.

### 5.3. `client/src/components/Toast.tsx`

El conteo automático lo marcó como sospechoso, pero el comentario `legacy`
en línea 29 dice literalmente: *“legacy browsers / SSR-hydration edge cases”*.
Es un comentario defensivo sobre compatibilidad de navegadores, **no** una
auto-marca de obsolescencia. El componente está montado en `App.tsx:333`
(`<ToastHost />`) y se usa desde `pages/booking.tsx`. **No es legacy ni
huérfano**, aunque sí es un patrón propio basado en `window.dispatchEvent`
(no shadcn). Si en el futuro se adopta una librería de toast estándar, este
fichero es buen candidato a sustituirse — pero no hay ninguna urgencia.

### 5.4. Convivencia `email-i18n.ts` (fichero) ↔ `email-i18n/` (subdir)

Coexisten un fichero `server/email-i18n.ts` (11 KB) y un subdirectorio
`server/email-i18n/` con bundles por idioma. **Ambos son activos**:

- El fichero re-exporta `SIGNATURE_TITLE_I18N` y compañía, importado por 5
  templates en `server/email/`.
- El subdirectorio tiene los bundles de strings por idioma usados por el
  layout.

**No es rot**, pero la convivencia fichero/subdir confunde. Sugerencia
documental: explicar en el header del `.ts` qué pertenece dónde, o renombrar
a algo como `email-i18n-shared.ts` para que el rol quede claro.

---

## 6. Falsos positivos descartados — auditoría de la propia auditoría

Estas afirmaciones de los subagentes **fueron desmentidas** por verificación
manual con `rg`/`diff`. Las dejo aquí registradas para que no vuelvan a
aparecer en futuras revisiones.

| Afirmación del subagente | Realidad verificada |
|---|---|
| `client/src/pages/services-sections.tsx` es huérfano | `services.tsx:12` lo importa: `const ServicesBelowFold = lazy(() => import("./services-sections"))` |
| `client/src/components/icons.tsx` es huérfano | Importado por 7 ficheros: `booking.tsx`, `go.tsx`, `ServiceSubpage.tsx`, `Toast.tsx`, `HomeFAQ.tsx`, `Navbar.tsx`, `CookieBanner.tsx` |
| `client/src/components/BookingCalendar.tsx` es huérfano | Lazy-loaded por `pages/book.tsx` |
| `server/discord.ts` es huérfano | Importado por **10 ficheros** incluyendo `server/index.ts`, todos los `server/scheduled/*`, `server/routes/*` y `server/discord-alerts.ts` |
| `server/google-indexing.ts` es huérfano | Importado por `server/discord.ts` y `server/index.ts` (con extensión `.js` en el specifier) |
| `server/email-layout.ts` es huérfano | Importado por **10 templates** en `server/email/` |
| `server/google-credentials.ts` es huérfano | Importado por 4 ficheros (`google-search-console.ts`, `google-meet.ts`, `google-indexing.ts`, `email/transport.ts`) — los specifiers usan `.js` por compatibilidad ESM |
| `server/storage/marketing.ts:purgeUnsubscribedNewsletter` es dead-export | Llamado por `server/scheduled/retention-purge.ts:84` |
| `.local-audit/` debería añadirse a `.gitignore` | Ya está en `.gitignore` línea 4 |
| `seo-orphan-audit.mjs` y `seo-orphan-audit-ci.mjs` son redundantes entre sí | El `-ci.mjs` **invoca** al primero como `AUDIT_SCRIPT`. El `-ci.mjs` sí es huérfano (nadie lo invoca a él), pero el `.mjs` no |
| “quality-pipeline.yml” ejecuta los notify-* scripts en raíz | No existe `.github/workflows/` ni ningún `.yml` en el workspace. Los notify-* sí son huérfanos, pero por **otra razón** que la afirmada |

> **Lección.** Los exploradores encontraron pistas correctas (existencia de
> los scripts notify-*, existencia de duplicación tests/, naming sospechoso
> de Toast.tsx) pero su clasificación específica era inexacta en >50% de los
> casos. Mantener verificación manual antes de cualquier `rm`.

---

## 7. Plan de acción priorizado

### P0 (correr riesgo si no se hace)
1. **Cablear los 8 tests huérfanos** en `package.json` y `scripts/check.mjs`.
   Cuatro de ellos (consent-atomicity, drip-exactly-once, discord-no-token-leak,
   email-template-security) protegen invariantes de seguridad/correctness que
   actualmente no tienen red. Requiere autorización para tocar `package.json`.

### P1 (limpieza de bajo riesgo)
2. **Borrar 5 scripts huérfanos en raíz** (`../scripts/inject-crs2-blocks.mjs`,
   `live-verification.sh`, `notify-live-verification-discord.mjs` + `.test.mjs`,
   `notify-monitoring-offline-issue.mjs` + `.test.mjs`). Liberan ~150 KB y
   eliminan ruido. Sin callers; no romperán nada.
3. **Borrar 3 scripts huérfanos en `scripts/`** (`audit-conversion-es-2026-04.mjs`,
   `auditoria-rutas-componentes-discord-emails.mjs`,
   `blog/dedup-consecutive-paragraphs.mjs`).
4. **Resolver `seo-orphan-audit-ci.mjs`**: o cablear en `npm run check` (cumple
   promesa de Task #23, actualmente IN_PROGRESS) o borrar el par.

### P2 (consolidación que reduce drift)
5. **Consolidar `madrid-time.ts`**: mover lo que use `client/src/lib/madrid-time.ts`
   a `shared/madrid-time.ts` y borrar el cliente.
6. **Sunset cohorte `booking` en drip-worker** una vez se confirme 0 filas
   activas en producción. El código está flagueado; solo falta la fecha.

### P3 (documental)
7. Aclarar con un comentario el reparto de responsabilidades entre
   `server/email-i18n.ts` (re-exports) y `server/email-i18n/` (bundles).

---

## 8. Lo que NO es problema (para tranquilidad)

- `server/middleware/legacy-redirects.ts` y los 8 marcadores `legacy` en
  `server/index.ts`: redirects 301 intencionales por SEO. **No tocar**.
- Los 6 marcadores `legacy` en `server/db.ts`: comentarios sobre filas legacy
  en producción durante migraciones (FK NOT VALID, tokens nullables, etc.).
  **No tocar**.
- Convivencia `book.tsx` ↔ `booking.tsx`: son páginas distintas (`book` =
  calendario de reserva, `booking` = gestión post-reserva por token). Ambas
  registradas en `App.tsx`.
- Convivencia `services.tsx` ↔ `services-sections.tsx`: la segunda es el
  bloque “below-fold” lazy-loaded por la primera.
- Sin ficheros `.bak`/`.old`/`.legacy`/`.orig` en el repo. Limpieza histórica
  ya hecha.
- Sin dependencias npm no usadas detectadas en el muestreo.

---

## 9. Postscriptum — ejecución (Task #41, 2026-04-30)

**Falsos positivos adicionales detectados al ejecutar el plan.** Antes de
borrar, re-verifiqué cada script en `../scripts/` con `rg .github/workflows/`.
Resultado: el audit afirmó que `.github/workflows/` "devuelve vacío en todo
el workspace" — **eso era falso**. El directorio contiene 14 workflows
(`live-verification.yml`, `live-verification-seo-headers.yml`,
`notifier-scripts-tests.yml`, `diagnostic-audit.yml`,
`notify-perf-gate-bypass-merged.yml`, etc.) y varios de los scripts
marcados como huérfanos están **activamente cableados** en ellos:

| Script | Status real | Workflows que lo invocan |
|---|---|---|
| `../scripts/live-verification.sh` | **NO huérfano — activo** | `live-verification.yml`, `live-verification-seo-headers.yml` |
| `../scripts/notify-live-verification-discord.mjs` | **NO huérfano — activo** | `live-verification.yml`, `live-verification-seo-headers.yml` |
| `../scripts/notify-live-verification-discord.test.mjs` | **NO huérfano — activo** | `notifier-scripts-tests.yml` (corre en cada PR) |
| `../scripts/notify-monitoring-offline-issue.mjs` | **NO huérfano — activo** | `live-verification.yml`, `diagnostic-audit.yml`, `notify-perf-gate-bypass-merged.yml`, `notifier-scripts-tests.yml` |
| `../scripts/notify-monitoring-offline-issue.test.mjs` | **NO huérfano — activo** | `notifier-scripts-tests.yml` |
| `../scripts/inject-crs2-blocks.mjs` | Huérfano confirmado | — (reemplazado por `exentax-web/scripts/blog/inject-crs2-citations.mjs`) |

**Lección reforzada.** El subagente que escribió la sección §4 verificó
mal `ls .github/workflows/` (probablemente desde otro working dir o con
flags que excluían dotfiles). El propio audit advertía en §6 que "los
exploradores tenían razón sobre la existencia de los scripts notify-* pero
clasificación inexacta en >50% de los casos" — y aquí el patrón se repitió.
Si una afirmación implica `ls` de un dotfile crítico (`.github/`,
`.local/`, `.husky/`), **vale la pena re-correrlo manualmente desde la
raíz del workspace antes de cualquier `rm`**.

### Verificación adicional sobre §3.1 — `seo-orphan-audit-ci.mjs`

El audit lo clasificó como "sin callers". Re-verificación con `rg -n
seo-orphan-audit-ci`:

- `exentax-web/scripts/check.mjs:159` — comentario en el header (referencia documental).
- `exentax-web/scripts/blog/blog-validate-all.mjs:84` — **caller real**:
  `{ id: "orphan-audit", file: "scripts/seo-orphan-audit-ci.mjs", node: "node" }`.

`blog-validate-all.mjs` se invoca desde `scripts/check.mjs` como paso
`blog:validate-all`. Por tanto `seo-orphan-audit-ci.mjs` sí está cableado
en la cadena de `npm run check`, vía `blog-validate-all`. **No es huérfano**.
La promesa de Task #23 está cumplida.

### Cambios efectuados en este task

- **Etapa 1 — 8 tests cableados** (P0 del plan):
  cada uno con su `test:<nombre>` en `exentax-web/package.json`,
  encadenado en `check:serial`, y registrado en `scripts/check.mjs#STEPS`
  con su peso. Los 8 verificados pasando individualmente.
  Reparación adicional: `admin-api-removed.test.ts` apuntaba a
  `server/discord-bot-commands.ts` (refactor lo movió a
  `server/discord/handlers/booking-actions.ts`); `email-template-security.test.ts`
  apuntaba a `server/email.ts` (movido a `server/email/drip.ts` con la
  unsub URL ahora montada como `oneClickUrl ?? mailto:`);
  `discord-no-token-leak.test.ts` usaba snowflakes de 10 dígitos
  (validador silenciosamente los descartaba) y `flush()` con timeout
  insuficiente (1500 ms) para fan-out a 2 canales — corregidos a 19
  dígitos y 2200 ms respectivamente.
- **Etapa 2 — borrado de scripts huérfanos** (P1 del plan, ajustado):
  - Borrados (huérfanos confirmados, sin callers de código):
    - `../scripts/inject-crs2-blocks.mjs` (raíz; reemplazado por
      `exentax-web/scripts/blog/inject-crs2-citations.mjs`).
    - `exentax-web/scripts/blog/dedup-consecutive-paragraphs.mjs`
      (one-shot ya completado: "Final state: 0 dups in 0 files").
    - `exentax-web/scripts/audit/audit-conversion-es-2026-04.mjs`
      (auditoría puntual; flujo activo es `audit:conversion` →
      `audit-conversion-112x6.mjs`). Solo referenciado en docs.
    - `exentax-web/scripts/audit/auditoria-rutas-componentes-discord-emails.mjs`
      (lógica cubierta por `npm run check`). Solo referenciado en docs.
    - **Nota de honestidad:** este task primero verificó las rutas
      `exentax-web/scripts/audit-conversion-...` (sin subcarpeta
      `audit/`), no las encontró, y reportó incorrectamente "ya
      borrados antes". El code-reviewer de validación encontró el
      error: las rutas correctas son `exentax-web/scripts/audit/...`.
      Borrados al re-verificar.
  - **NO borrados (false positives del audit original)** — los 4
    notify-* / live-verification scripts en `../scripts/` están
    **activos en CI**. Evidencia reproducible:
    ```
    rg -l <basename> .github/workflows/  →
      live-verification.sh             → 2 workflows
      notify-live-verification-discord → 3 workflows
      notify-monitoring-offline-issue  → 4 workflows
    ```
    Workflows concretos: `live-verification.yml`,
    `live-verification-seo-headers.yml`, `notifier-scripts-tests.yml`,
    `diagnostic-audit.yml`, `notify-perf-gate-bypass-merged.yml`.
    Borrarlos rompería los crons de monitorización de producción y
    los self-tests de los notifiers que corren en cada PR. El audit
    original afirmó que `.github/workflows/` "devuelve vacío"; eso
    era falso (el directorio contiene 14 workflows).
  - `replit.md` actualizado: catálogo `scripts/blog/` ya no lista
    `dedup-consecutive-paragraphs`.
- **Etapa 3 — consolidación `madrid-time.ts`** (P2 del plan):
  - `addDaysMadridISO` y `tomorrowMadridISO` migradas a
    `shared/madrid-time.ts` (con la red de seguridad try/catch del
    cliente preservada para navegadores legacy).
  - `client/src/pages/booking.tsx` ahora importa desde `@shared/madrid-time`.
  - `client/src/lib/madrid-time.ts` borrado.
  - `npx tsc --noEmit` exit 0; `test:madrid-time-dst` pasa contra el
    fichero consolidado.
- **Etapa 4 — sunset cohorte `booking` en drip-worker** (P2 del plan):
  **EJECUTADA.**
  - Razonamiento corregido: el repl aún no se ha desplegado nunca, por
    tanto NO existe BD de producción todavía
    (`PRODUCTION_DATABASE_ERROR` de `executeSql({environment:"production"})`).
    Sin BD de producción, no puede haber filas legacy en vuelo en
    producción por definición — el primer despliegue creará tablas
    nuevas y vacías. La BD de desarrollo además confirma 0 filas
    `booking` históricas. Mi defer inicial estaba basado en un
    escenario imposible (rows en una BD que no existe).
  - Confirmación a nivel de código: `rg "source.*['\"]booking['\"]"
    server/` solo encuentra inserciones en `consent_log` (tabla
    distinta) y en `notifyConsent`/Discord notifications (operacional).
    El comentario en `routes/public.ts:728` lo dice explícitamente:
    *"No drip sequence is started for booking submissions"*. Cero
    código de enrollment activo.
  - Cambios efectuados:
    - `server/scheduled/drip-worker.ts`:
      - Header §: el bloque que documentaba la cohorte `booking` como
        "legacy en vuelo" reemplazado por una nota histórica que
        apunta a este audit y al Task #41.
      - `STEP_DELAY_MS_BY_SOURCE`: clave `booking: 3 * ONE_DAY_MS`
        eliminada.
      - `TOTAL_STEPS_BY_SOURCE`: clave `booking: 6` eliminada.
      - Comentario de `dispatchStep`: `guide/booking steps are 1..6`
        → `guide steps are 1..6`.
    - `shared/schema.ts`:
      - Comentario inline en `dripEnrollments.source`: lista
        `'guide' | 'calculator'` con anotación legacy a Task #41.
      - CHECK constraint `drip_enrollments_source_check`:
        `IN ('guide','booking','calculator')` → `IN ('guide','calculator')`.
    - Migración aplicada a la BD de desarrollo. `drizzle-kit push`
      no detectó el cambio del CHECK (limitación conocida — solo
      compara el nombre del constraint), así que la actualización se
      hizo manualmente con `ALTER TABLE … DROP CONSTRAINT … ; ALTER
      TABLE … ADD CONSTRAINT … CHECK (source IN ('guide','calculator'))`.
      Verificado con `pg_get_constraintdef`. En el primer deploy a
      producción, `db:push` creará el constraint correcto desde cero.
  - Verificación post-cambio: `tsc --noEmit` exit 0; `test:drip-exactly-once`
    pasa (cubre las 5 escenarios de race incluyendo el del worker tick);
    `npm run check` reporta 39/42 igual que antes del cambio (las 2
    fallas restantes son preexistentes en `test-discord-bot-e2e.ts`,
    fichero no tocado por este task).
