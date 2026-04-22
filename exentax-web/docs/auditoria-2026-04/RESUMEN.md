# Auditoría diagnóstica 2026-04 — Resumen ejecutivo

Generado: 2026-04-22T09:02:57.202Z

Esta auditoría es **solo lectura**: ningún archivo del código de aplicación
fue modificado. Se añadió únicamente el script
`scripts/auditoria-rutas-componentes-discord-emails.mjs` y los 5 reportes
JSON en `docs/auditoria-2026-04/`.

## Scoring global (1–5)

| Eje | Score |
| --- | ----- |
| architecture | 4 |
| performance | 3 |
| translations | 4 |
| verifiedData | 4 |
| seo | 3 |
| ux | 4 |
| testing | 3 |
| productionReady | 3 |

## 1. Rutas y URLs en 6 idiomas
Reporte: [`slugs-rutas-audit.json`](./slugs-rutas-audit.json)

- Rutas esperadas: **105** (de `shared/routes.ts`: 96; de `App.tsx`: 9).
- Status 2xx: 104 · 3xx: 1 · 404: 0 · errores: 0.
- hreflang incompletos: 0.
- Contenido duplicado dentro del mismo idioma: 0 clusters.
- Sitemap (`200`): **768** URLs (índice con 3 hijos).
  - En App pero no en sitemap: 3.
  - En sitemap pero no en App (excl. /blog): 0.
- Navegación interna (Navbar+Footer): 6 hrefs SSR + 17 refs estáticas, 22 verificadas, 0 rotas.

## 2. Componentes React
Reporte: [`componentes-audit.json`](./componentes-audit.json)

- Componentes: 42 · páginas: 24.
- Sin `data-testid` con elementos interactivos: 2.
- Issues i18n (literales JSX sospechosos): 0.
- Issues ARIA (img sin alt, etc.): 0.
- Tipos `any` explícitos: 0.
- Componentes con nombre duplicado: 1.
- Candidatos a lazy loading (>250 líneas): 18.

## 3. Discord bot
Reporte: [`discord-bot-audit.json`](./discord-bot-audit.json)

- Líneas: discord.ts=1613, bot=387, commands=863.
- EVENT_TYPES: 13. Funciones notify*: 14.
- Eventos huérfanos (sin notify* asociado): 0.
- Eventos sin cobertura de tests: 13 (BOOKING_CREATED, BOOKING_RESCHEDULED, BOOKING_CANCELLED, BOOKING_NO_SHOW, LEAD_NEW, LEAD_CALCULATOR, LEAD_NEWSLETTER, CONSENT_LOGGED, USER_ACTIVITY, VALIDATION_FAILED, SYSTEM_ERROR, SEO_INDEXING, ADMIN_ACTION).
- Retry: max 3 intentos, exponential (DRAIN_INTERVAL_MS * 2^attempt, capped 30s).
- Env vars Discord: DISCORD_BOT_TOKEN, DISCORD_PUBLIC_KEY, DISCORD_APP_ID, ADMIN_DISCORD_ROLE_ID.
- Env vars faltantes en runtime: DISCORD_BOT_TOKEN, DISCORD_PUBLIC_KEY, DISCORD_APP_ID, ADMIN_DISCORD_ROLE_ID.
- Tests Discord: 1 (tests/discord-no-token-leak.test.ts).

## 4. Emails Google Service
Reporte: [`emails-audit.json`](./emails-audit.json)

- Funciones de envío detectadas: 7 (sendBookingConfirmation, sendCalculatorEmail, sendReminderEmail, sendRescheduleConfirmation, sendCancellationEmail, sendFollowupEmail, sendNoShowRescheduleEmail).
- Cobertura i18n (subjects por idioma):
  - ES: 6
  - EN: 6
  - FR: 6
  - DE: 6
  - PT: 6
  - CA: 6
- GDPR: unsubscribeLink=✓, physicalAddress=✓, legalFooter=✗, brandingLogo=✓.
- Spam triggers: ninguno.
- Broken links: 0 (localhost: 0, http://: 0).
- Issues responsive: ninguno.
- Env vars Google requeridas: GOOGLE_SERVICE_ACCOUNT_KEY, GMAIL_FROM_EMAIL.
- Env vars Google faltantes en runtime: GOOGLE_SERVICE_ACCOUNT_KEY, GMAIL_FROM_EMAIL.
- Fallback gmail_not_configured: sí.
- Retry queue: presente (260 líneas).

## 5. Calidad global y siguientes pasos
Reporte: [`calidad-global-report.json`](./calidad-global-report.json)

### Top bloqueantes para producción
- 3 rutas faltan en sitemap.xml
- Env vars Discord faltantes: DISCORD_BOT_TOKEN, DISCORD_PUBLIC_KEY, DISCORD_APP_ID, ADMIN_DISCORD_ROLE_ID
- Cumplimiento GDPR de emails incompleto: {"unsubscribeLink":true,"physicalAddress":true,"legalFooter":false,"brandingLogo":true}
- Env vars Google Service Account faltantes: GOOGLE_SERVICE_ACCOUNT_KEY, GMAIL_FROM_EMAIL
- 2 componentes con elementos interactivos sin data-testid

### Quick wins
- Renombrar componentes duplicados (1)
- Lazy-load 18 componentes >250 líneas
- Ampliar cobertura de tests Discord (actualmente 1)
- (sin acción adicional sugerida en este ciclo)
- (sin acción adicional sugerida en este ciclo)

## Reproducibilidad

```bash
# Con el workflow Start application en marcha:
node scripts/auditoria-rutas-componentes-discord-emails.mjs all

# Subcomandos individuales:
node scripts/auditoria-rutas-componentes-discord-emails.mjs routes
node scripts/auditoria-rutas-componentes-discord-emails.mjs components
node scripts/auditoria-rutas-componentes-discord-emails.mjs discord
node scripts/auditoria-rutas-componentes-discord-emails.mjs emails
node scripts/auditoria-rutas-componentes-discord-emails.mjs summary
```

Variable opcional: `AUDIT_BASE_URL` (por defecto `http://localhost:5000`).

## Bundle por página (Task #30)

Reporte: [`bundle-audit.json`](./bundle-audit.json)

Para evitar que vuelvan a colarse imports síncronos pesados en `pages/*` (la
Task #25 cargó diferido `BookingCalendar`, `Calculator`, `FAQ` y
`Testimonials`) o que el chunk inicial crezca de forma silenciosa, el script
`scripts/audit-bundle.mjs` ejecuta `vite build` y compara el peso de cada
chunk emitido contra un presupuesto por categoría.

```bash
npm run audit:bundle              # build completo + auditoría (CI)
node scripts/audit-bundle.mjs --no-build   # reusa dist/public/assets actual
node scripts/audit-bundle.mjs --json       # salida sólo JSON
```

Categorías y presupuesto inicial (KB, peso bruto en disco tras minificar):

| Categoría        | Presupuesto | Qué incluye                                                |
| ---------------- | -----------:| ---------------------------------------------------------- |
| `entry-index`    | 560         | Chunk de entrada principal (`index-*.js` más grande).      |
| `vendor-react`   | 220         | React + ReactDOM.                                          |
| `vendor-query`   |  60         | `@tanstack/react-query`.                                   |
| `vendor-router`  |  25         | `wouter`.                                                  |
| `vendor-i18n`    |  60         | `i18next` + `react-i18next`.                               |
| `page`           | 150         | Cada chunk async de una ruta (`home`, `post`, `booking`…). |
| `blog-post`      |  90         | Cada artículo del blog (`blog-<lang>-<slug>-*.js`).        |
| `blog-shared`    | 160         | Bundles compartidos del blog (índice, slugs, i18n).        |
| `locale`         | 320         | Diccionarios i18n por idioma (`es-`, `en-`, `fr-`…).       |
| `css`            | 200         | Cualquier `*.css`.                                         |

Lectura del reporte:

- **Sale 0 con "OK · todos los chunks dentro del presupuesto."** → CI pasa.
- **Sale 1 con "FALLO · N chunk(s) sobre el presupuesto"** → CI falla y se
  listan los archivos infractores con su categoría y el presupuesto que han
  superado. Los dos motivos típicos son:
  1. **Página engordada por un import síncrono pesado.** Comprueba si en
     `client/src/pages/<página>.tsx` se ha añadido un `import` directo a un
     componente >250 LOC que debería ser `lazy()`. Es exactamente la
     regresión que introduce esta task.
  2. **Diccionario de locale o blog que ha crecido de golpe.** Suele ser
     contenido nuevo legítimo; sube el presupuesto de la categoría afectada
     en `BUDGETS_KB` (cabecera de `scripts/audit-bundle.mjs`) con el nuevo
     valor medido y deja constancia en esta sección.

El reporte JSON (`bundle-audit.json`) incluye `summary` por categoría
(conteo, total, mayor archivo) y `top` con los 15 chunks más grandes para
poder hacer seguimiento histórico.

### Evolución entre commits (Task #43)

El presupuesto absoluto evita que un único chunk se dispare, pero no detecta
que varios chunks crezcan un 8% cada uno y degraden silenciosamente el TTFB.
Para eso, cuando la auditoría se ejecuta con `--history` (o en CI con
`CI=true`) se añade una entrada al histórico `bundle-audit-history.json`
con:

- `generatedAt`, `commit` (hash corto del HEAD si está disponible).
- `totalKb` y `totalGzipKb` del build completo.
- `entryIndexKb` (peso del chunk de entrada).
- `summaryKb` por categoría (mismas claves que `BUDGETS_KB`).
- `top5`: los 5 chunks más pesados, con el nombre **sin hash** (`base`)
  para poder emparejarlos entre commits.

El histórico conserva como máximo las últimas 200 entradas (rotación FIFO).

#### Dónde vive el histórico (Task #51)

Hasta abril de 2026 el fichero vivía en `docs/auditoria-2026-04/` y se
actualizaba en **cada** ejecución de `npm run audit:bundle`. Eso tenía dos
efectos no deseados:

1. Cualquier `npm run audit:bundle` local dejaba el repo "sucio" con una
   entrada nueva, animando a commitear histórico ruidoso (builds de debug,
   reauditorías repetidas, builds desde una working copy con cambios).
2. Cada commit cargaba un diff irrelevante en `docs/`, mezclando ruido de
   build con la documentación de auditoría real.

Decisión: el histórico es **un artefacto de build, no documentación**, así
que vive fuera de `docs/`:

- Ruta nueva: `exentax-web/.local-audit/bundle-audit-history.json`
  (`.local-audit/` ya está en `.gitignore`).
- Escritura **opt-in**: solo se persiste cuando se pasa `--history` o
  cuando `CI=true`. El `npm run audit:bundle` por defecto **no** escribe
  histórico, así que builds locales no ensucian nada.
- `--no-history` se mantiene como bandera de **skip explícito** para
  retrocompatibilidad: suprime la escritura aunque `CI=true`, conservando
  su semántica original ("no toques el histórico"), y permite reauditar
  en CI sin contaminar el log si hace falta.
- Responsabilidad de CI: persistir el fichero entre runs (cache de
  GitHub Actions o `actions/upload-artifact` + `download-artifact`) para
  que `audit:bundle:diff` tenga un registro previo con el que comparar.

Esto mantiene el comportamiento del diff (sigue leyendo del mismo path
relativo) sin engordar el repo, y deja claro que la fuente de verdad del
histórico es CI, no la copia local de cada desarrollador.

Para ver la evolución respecto al último registro:

```bash
npm run audit:bundle:diff                  # comparativa legible (umbral +5%)
node scripts/audit-bundle-diff.mjs --threshold=10
node scripts/audit-bundle-diff.mjs --json  # salida machine-readable
```

Cómo leer la salida:

- **Cabecera "Anterior / Actual"** indica las dos entradas que se están
  comparando (la última y la penúltima del histórico).
- **Tabla "Métrica"** muestra `total`, `total (gzip)` y `entry-index` con
  su delta porcentual. Una línea con `+x%` y la marca `⚠️` significa que
  ese valor creció por encima del umbral (5% por defecto).
- **Tabla "Top 5 chunks (actual)"** lista los 5 mayores chunks del build
  actual y los compara con el mismo chunk del registro anterior (matching
  por nombre sin hash + categoría). Marcas:
  - `NEW`: el chunk no existía con ese nombre en el registro anterior
    (típico tras crear una página o refactorizar el split).
  - `⚠️`: ese chunk creció más del umbral.
- **Salida final** es `OK` (exit 0) si nada supera el umbral, o `FALLO`
  (exit 1) listando cada regresión. Eso permite enchufar el comando a
  CI/PR comments y avisar antes de que la suma de microcrecimientos
  consuma todo el headroom del presupuesto absoluto.

Si la regresión está justificada (un idioma nuevo, una librería que crece
en una actualización), documenta el motivo aquí y, si procede, ajusta el
presupuesto correspondiente en `scripts/audit-bundle.mjs` (`BUDGETS_KB`)
para que las siguientes auditorías no fallen por el mismo motivo.

Como las ejecuciones locales **no** escriben histórico por defecto (ver
sección anterior), no hace falta una bandera para "no contaminar". Si
necesitas regenerar una entrada en local — por ejemplo para reproducir un
diff que falló en CI — añade `--history` puntualmente:

```bash
node scripts/audit-bundle.mjs --no-build --history
```

Para ejecuciones que no deban contaminar el histórico (debug local,
reauditorías repetidas) usa `node scripts/audit-bundle.mjs --no-history`.

#### Integración con CI / Discord / PR (Task #50)

`audit:bundle:diff` está enchufado al workflow `quality-pipeline.yml`
inmediatamente después del paso que ejecuta `npm run check` (que ya
incluye `audit:bundle` y, por tanto, deja la entrada nueva en el
histórico). El step `Bundle diff (commit anterior)`:

1. Ejecuta `npm run audit:bundle:diff -- --json` y vuelca el resultado
   en `docs/auditoria-2026-04/bundle-diff.json` (subido como artefacto
   `bundle-diff-report` con retención de 30 días).
2. Captura el exit code en `steps.bundle_diff.outputs.exit_code` sin
   abortar el job todavía: necesitamos primero notificar.
3. Encadena tres steps condicionales al exit code `1` (regresión >5%):
   - `Notify Discord on bundle regression`: solo en `push` a `main`,
     ejecuta `node scripts/audit-bundle-diff-notify-discord.mjs`. Lee el
     mismo `DISCORD_BOT_TOKEN` / `DISCORD_CHANNEL_ERRORES` que las demás
     auditorías y publica un embed `EXENTAX_RED` con la lista de chunks
     por encima del umbral, los KB anterior/actual y el delta porcentual
     de `total`, `total (gzip)` y `entry-index`. Sin emojis (política de
     brand Discord, ver header de `auditoria-ci-notify-discord.mjs`).
   - `Comment bundle regression on PR`: solo en `pull_request`, usa
     `actions/github-script@v7` para publicar el mismo delta como
     comentario en el PR (tabla con `Anterior / Actual / Δ` y bullets
     por chunk). Requiere `permissions: pull-requests: write` (declarado
     a nivel de workflow).
   - `Fail job on bundle regression`: re-emite `exit 1` para que el job
     entero falle, igual que el guard de presupuesto absoluto.

Si faltan `DISCORD_BOT_TOKEN` o `DISCORD_CHANNEL_ERRORES`, el notifier
sale 0 con un log informativo; el job sigue fallando por el step final.
Si la comparativa todavía no es posible (histórico con una sola entrada)
el script publica `status: "single-entry"` y el notifier no envía nada.

**Baseline = último commit fusionado en `main`.** El histórico
`bundle-audit-history.json` está versionado: cada CI clona la versión
ya fusionada, ejecuta `audit:bundle` localmente y compara la entrada
nueva contra la última que aparece en el archivo committeado. CI **no**
hace push del histórico actualizado, así que la baseline no se mueve
hasta que un PR vuelve a commitearlo. Consecuencias prácticas:

- En PRs sucesivos el delta se mide siempre contra el mismo commit
  fusionado: lo que el revisor ve en el comentario del PR es el cambio
  acumulado del PR completo, no del último push.
- Si un PR engorda el bundle pero queda justificado (idioma nuevo,
  librería actualizada), recuerda regenerar y commitear
  `bundle-audit-history.json` (`npm run audit:bundle`) antes de
  fusionar; en caso contrario el siguiente PR seguirá comparando contra
  la baseline pre-cambio y volverá a disparar el aviso.

**Anti-spam en PRs.** El step `Comment bundle regression on PR` usa un
marcador HTML invisible (`<!-- bundle-diff-comment:task-50 -->`) para
encontrar el comentario previo del bot y actualizarlo en cada push, en
lugar de añadir uno nuevo. En PRs originados desde un fork
`secrets.GITHUB_TOKEN` no tiene permisos de escritura: el step captura
el 403 y emite un warning, sin enmascarar el fallo del gate.

**Cobertura de tests.** `npm run test:bundle-diff-notify` (incluido en
`npm run check`) ejercita el notifier con `fetch` mockeado y verifica
las cuatro ramas críticas: sin credenciales, `status: single-entry`,
JSON malformado, sin regresión + `BUNDLE_DIFF_FORCE`, regresión real.
Las aserciones fijan la política de brand (sin emojis, color en
{`EXENTAX_NEON`, `EXENTAX_RED`}, footer canónico) y los límites de
Discord (`description ≤ 4096`, `content ≤ 2000`, `fields ≤ 25`), de
modo que cualquier futura modificación del payload que rompa el
contrato falla en CI antes de salir a producción.
