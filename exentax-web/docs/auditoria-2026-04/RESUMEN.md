# Auditoría diagnóstica 2026-04 — Resumen ejecutivo

Generado: 2026-04-28T14:35:38.726Z

Esta auditoría es **solo lectura**: ningún archivo del código de aplicación
fue modificado. Se añadió únicamente el script
`scripts/audit/auditoria-rutas-componentes-discord-emails.mjs` y los 5 reportes
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

- Rutas esperadas: **111** (de `shared/routes.ts`: 102; de `App.tsx`: 9).
- Status 2xx: 0 · 3xx: 0 · 404: 0 · errores: 111.
- hreflang incompletos: 0.
- Contenido duplicado dentro del mismo idioma: 0 clusters.
- Sitemap (`-1`): **0** URLs (índice con 0 hijos).
  - En App pero no en sitemap: 111.
  - En sitemap pero no en App (excl. /blog): 0.
- Navegación interna (Navbar+Footer): 0 hrefs SSR + 17 refs estáticas, 17 verificadas, 17 rotas.

## 2. Componentes React
Reporte: [`componentes-audit.json`](./componentes-audit.json)

- Componentes: 48 · páginas: 25.
- Sin `data-testid` con elementos interactivos: 0.
- Issues i18n (literales JSX sospechosos): 0.
- Issues ARIA (img sin alt, etc.): 0.
- Tipos `any` explícitos: 0.
- Componentes con nombre duplicado: 1.
- Candidatos a lazy loading (>250 líneas): 21.

## 3. Discord bot
Reporte: [`discord-bot-audit.json`](./discord-bot-audit.json)

- Líneas: discord.ts=1671, bot=466, commands=958.
- EVENT_TYPES: 13. Funciones notify*: 14.
- Eventos huérfanos (sin notify* asociado): 0.
- Eventos sin cobertura de tests: 10 (BOOKING_CREATED, BOOKING_RESCHEDULED, BOOKING_CANCELLED, BOOKING_NO_SHOW, LEAD_NEW, LEAD_CALCULATOR, LEAD_NEWSLETTER, USER_ACTIVITY, VALIDATION_FAILED, SYSTEM_ERROR).
- Retry: max 3 intentos, exponential (DRAIN_INTERVAL_MS * 2^attempt, capped 30s).
- Env vars Discord: DISCORD_BOT_TOKEN, DISCORD_PUBLIC_KEY, DISCORD_APP_ID, ADMIN_DISCORD_ROLE_ID.
- Env vars faltantes en runtime: DISCORD_BOT_TOKEN, DISCORD_PUBLIC_KEY, DISCORD_APP_ID, ADMIN_DISCORD_ROLE_ID.
- Tests Discord: 2 (tests/discord-event-notifications.test.ts, tests/discord-no-token-leak.test.ts).

## 4. Emails Google Service
Reporte: [`emails-audit.json`](./emails-audit.json)

- Funciones de envío detectadas: 9 (sendBookingConfirmation, sendCalculatorEmail, sendReminderEmail, sendRescheduleConfirmation, sendCancellationEmail, sendFollowupEmail, sendNewsletterWelcomeEmail, sendIncompleteBookingEmail, sendNoShowRescheduleEmail).
- Cobertura i18n (subjects por idioma):
  - ES: 8
  - EN: 8
  - FR: 8
  - DE: 8
  - PT: 8
  - CA: 8
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
- 111 rutas devuelven 5xx u otro error
- 111 rutas faltan en sitemap.xml
- 17 enlaces internos rotos detectados desde Navbar/Footer
- Env vars Discord faltantes: DISCORD_BOT_TOKEN, DISCORD_PUBLIC_KEY, DISCORD_APP_ID, ADMIN_DISCORD_ROLE_ID
- Cumplimiento GDPR de emails incompleto: {"unsubscribeLink":true,"physicalAddress":true,"legalFooter":false,"brandingLogo":true}
- Env vars Google Service Account faltantes: GOOGLE_SERVICE_ACCOUNT_KEY, GMAIL_FROM_EMAIL

### Quick wins
- Renombrar componentes duplicados (1)
- Lazy-load 21 componentes >250 líneas
- Ampliar cobertura de tests Discord (actualmente 2)
- (sin acción adicional sugerida en este ciclo)
- (sin acción adicional sugerida en este ciclo)

## Reproducibilidad

```bash
# Con el workflow Start application en marcha:
node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs all

# Subcomandos individuales:
node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs routes
node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs components
node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs discord
node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs emails
node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs summary
```

Variable opcional: `AUDIT_BASE_URL` (por defecto `http://localhost:5000`).

## Tarea #83 — Playwright e2e en el gate (diagnóstico Fase 0)

**Síntoma observado.** El test-id `select-ccaa-profile` se renombró a
`select-ccaa` en `client/src/components/calculator/index.tsx` y la
referencia en `tests/e2e/calculator-flow.spec.ts` (5 sitios) y
`tests/e2e/analytics-events.spec.ts` (2 sitios) quedó obsoleta sin
que el gate `npm run check` ni `quality-pipeline.yml` se pusieran
rojos en ese commit. El test e2e nuevo del Hebesatz que añadió #51
(`calculator-flow.spec.ts:308-340`) tampoco se ha visto verde nunca
porque el setup intermedio revienta antes de llegar a su assertion.

**Por qué se escapó.** Hay dos agujeros independientes:

1. **Local / `quality-pipeline.yml`.** El script
   `scripts/check.mjs` (y por tanto `npm run check`) NO incluía
   `npm run test:e2e` en su lista `STEPS`, ni en `check:serial`. El
   gate de feedback rápido jamás abría un navegador; era imposible
   detectar drift de `data-testid` en el commit que lo introducía.
   `quality-pipeline.yml` reproduce `check:serial` script-a-script,
   así que heredaba el mismo agujero.
2. **`e2e.yml`.** El workflow corre la matriz de 7 navegadores en
   cada push/PR a `main` y sí debería haber cazado el drift. El
   código del workflow está bien (`fail-fast: false`,
   `quarantined: false` en los 7 legs, artifacts con 14 días de
   retención). Lo que la nota fuente del task #83 marca como
   conjetura — y que no podemos confirmar desde el código del repo
   (las settings de branch protection no son código) — es alguna
   combinación de:
     - Los legs `Playwright E2E (chromium|firefox|webkit|…)` no
       están como **required checks** en branch protection del
       `main`, por lo que un PR podía mergear con esos jobs en
       rojo.
     - O el workflow se introdujo con `e2e.yml` después del commit
       que renombró el test-id, y nadie revisó la primera tanda de
       runs rojos.
   El propio README de la suite (`tests/e2e/README.md` §"Running
   in CI") ya pide explícitamente: "Mark every non-quarantined
   matrix leg … as required checks in branch protection". Si esa
   recomendación no se aplicó, esta tarea no puede arreglarlo (no
   tiene permisos sobre las settings de GitHub) — queda como
   follow-up para el owner del repo.

**Lo que cambia con esta tarea (Task #83).**

- Se añade `npm run test:e2e:gate` (wrapper sobre
  `scripts/test-e2e-gate.mjs`) tanto a `check:serial` como al array
  `STEPS` de `scripts/check.mjs` (`weight: 90`, conservador).
  Resultado: un drift de `data-testid` o de selector pone rojo
  `npm run check` y `quality-pipeline.yml` en el mismo commit.
- El wrapper pre-vuela el binario de chromium y emite un mensaje
  accionable (con el `npx playwright install chromium` exacto) en
  lugar de dejar que Playwright explote con un stack críptico.
  Respeta `SKIP_E2E=1` para opt-out puntual.
- El wrapper despoja `CI` del entorno antes de lanzar Playwright
  para que `playwright.config.ts::useWebServer` quede `false` y
  Playwright NO intente levantar un segundo dev server sobre el
  que ya tiene levantado `prewarmDevServer()` en :5000 (evita
  port collision).
- `analytics-events.spec.ts` quedaba excluido del gate local
  (`--grep-invert "analytics events"`) porque exige
  `E2E_TEST_HOOKS=1` en el dev server y modificar el pre-warm para
  inyectar ese flag tendría blast radius sobre todo el dev server
  compartido. **Task #89** cierra ese hueco: el wrapper ahora
  corre en dos fases — Fase 1 contra el dev server prewarmed en
  `:5000` (sin flag), y Fase 2 booteando un dev server dedicado
  en `:5050` (`E2E_GATE_ANALYTICS_PORT`) con `E2E_TEST_HOOKS=1`
  para los specs de `analytics events`. Fase 2 se salta sólo si
  `DATABASE_URL` no está seteado (CI siempre lo provee, así que
  el gate sigue aplicándose en `quality-pipeline.yml`).

**Lo que NO cambia.**

- `e2e.yml` sigue corriendo la matriz completa de 7 navegadores
  intacta. No se quarantine ni desactiva ningún leg.
- Ningún spec se modifica: la intención es enchufar lo que hay,
  no rediseñar la suite.
- Branch protection sigue siendo responsabilidad del owner del
  repo (fuera del scope de esta tarea, follow-up creado).
