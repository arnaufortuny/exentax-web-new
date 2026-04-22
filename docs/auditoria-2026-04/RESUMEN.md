# Auditoría 5-reportes — RESUMEN consolidado (2026-04-22)

## Contexto

Esta carpeta es la salida combinada de la **auditoría diagnóstica** y de las
**correcciones derivadas** (Task #20). El plan original separaba ambos pasos
en dos tareas, pero la auditoría hermana no llegó a generar los JSONs en este
entorno aislado, así que la diagnóstica se reconstruyó con inspección estática
(grep + tsc + crawl HTTP local + revisión manual) y se aplicaron de inmediato
las correcciones reales.

## Veredicto global

**Production-ready.** 0 issues bloqueantes en los 5 ejes auditados.

| Eje | Status | Score |
| --- | --- | --- |
| Rutas / SEO técnico | OK | 5/5 |
| Componentes React | OK | 5/5 |
| Discord bot | OK | 5/5 |
| Emails (Gmail API) | OK | 5/5 |
| Calidad global | OK | 5/5 |

## Hallazgos por eje

### 1. Rutas, sitemap, canonical, hreflang (`slugs-rutas-audit.json`)
- Las 16 route keys × 6 idiomas están registradas en `shared/routes.ts` y
  en `client/src/App.tsx`.
- Crawl HTTP local: `/es`, `/en`, `/fr`, `/de`, `/pt`, `/ca` → todos `200`.
  `/sitemap.xml` → `200`.
- `<link rel="canonical">` y `<link rel="alternate" hreflang>` emitidos por
  `client/src/components/SEO.tsx` y por header `Link:` en `server/routes.ts`.
- `x-default = es` en todas las páginas. Blog: hreflang sólo a locales con
  traducción real (no enlaza a 404).
- Sitemap dividido en `pages/faq/blog`, con `noindex` correcto en `/links`,
  `/start`, `/booking/:token`, `/admin/agenda/:bookingId`.
- 0 duplicados, 0 404s, 0 hreflang faltantes.

### 2. Componentes React (`componentes-audit.json`)
- `npx tsc --noEmit` → limpio.
- 0 props tipadas como `any`.
- Lazy loading 100% (todas las rutas en `App.tsx` van por `lazy()`).
- Discord/PhoneInput/EmailGateForm/Navbar/LanguageSwitcher ya tenían
  `data-testid` y ARIA correctos (los falsos positivos del audit subagent
  fueron descartados tras grep directo).
- **Cambio aplicado:** `CookieBanner.tsx` ahora declara
  `role="dialog"`, `aria-modal="false"`, `aria-labelledby` y
  `aria-describedby` apuntando al título y descripción internos, más un
  `data-testid="dialog-cookie-banner"` para tests. No es modal bloqueante
  (no atrapa foco) pero ahora se anuncia correctamente como diálogo.

### 3. Discord bot (`discord-bot-audit.json`)
- 13 EVENT_TYPES mapeados a 7 canales lógicos vía
  `TYPE_TO_CHANNEL` + `CHANNEL_ENV` (`server/discord.ts:95-210`).
- Cobertura: leads, newsletter, calculadora, bookings (4 estados),
  consentimientos, actividad, validaciones, errores críticos, SEO/indexing,
  acciones admin.
- **Retry:** exponential backoff hasta 3 intentos, cap 30s
  (`discord.ts:475-540`).
- **Rate limit:** queue producer-consumer, drain 1.5s, capacidad 80, drop-oldest
  (`discord.ts:473-493`).
- **Sin token:** graceful degrade — log warn + drop, `503` en endpoint de
  interactions, skip slash command registration.
- **Embeds:** color forzado neon green, sin emojis (política de marca),
  particionado automático de campos largos.
- Env vars documentadas en `replit.md`.

### 4. Emails Gmail API (`emails-audit.json`)
- 6 templates × 6 idiomas, todos completos en `email-i18n.ts:113-917`.
- HTML responsive (`max-width:600px`, media query, MSO fallback para Outlook).
- Branding consistente (logo neon-green, fuente Inter única).
- **GDPR:** dirección física, motivo de envío (`unsubNote`) y header
  `List-Unsubscribe` + `List-Unsubscribe-Post: One-Click` presentes
  (`email.ts:104-126`). Newsletter tiene ruta dedicada
  `GET /api/newsletter/unsubscribe/:token` localizada en 6 idiomas.
- 0 spam triggers en subjects.
- URLs absolutas vía `SITE_URL` (`server-constants.ts:27`); 0 hardcodes a
  `localhost`.
- Fallback `gmail_not_configured` no rompe el flujo.

### 5. Calidad global (`calidad-global-report.json`)
- Scoring transversal: 5/5 en 7 de 8 ejes; testing 4/5 (margen para más
  tests unitarios sobre Discord events, no bloqueante).
- 0 issues en el top 10 de bloqueantes — auditorías previas (Tasks #6 v2,
  #18, #19, #23, #27, #36) ya cerradas con guardianes activos.
- Guardianes que se ejecutan en cada merge/build:
  - `scripts/post-merge.sh` (blog-content-lint + e2e booking + e2e newsletter)
  - `exentax-web/scripts/build.ts` (idem en deploy)
  - `npm run check` (tsc + seo:check + lint:blog + lint:blog-links + i18n:check + blog-validate-all)
  - `exentax-web/server/index.ts` (fail-fast en producción si faltan envs)

## Cambios aplicados (changelog antes/después)

| # | Archivo | Antes | Después |
| --- | --- | --- | --- |
| 1 | `client/src/components/CookieBanner.tsx` | Banner sin role/aria-modal/labelledby/describedby | Diálogo con ARIA semántica completa + testid de contenedor |

Nota: el resto del top-10 inicial reportado por el audit subagent eran falsos
positivos (data-testids ya presentes, claves i18n ya declaradas en
`keys.generated.ts:722-726`). Se documenta para evitar re-trabajo.

## Pendientes (no bloqueantes)
- Ampliar cobertura unit-test del bot Discord (eventos `consent_logged`,
  `seo_indexing`, `admin_action`) — propuesto como follow-up.
