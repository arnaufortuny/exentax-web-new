# SETUP

Guía mínima para arrancar `exentax-web/` en local o en un nuevo entorno Replit.

## Requisitos

- Node 20+ (lo proveen los pinned modules de Replit).
- PostgreSQL accesible vía `DATABASE_URL` (Replit DB, Neon o Postgres autogestionado).
- Acceso de salida HTTPS para verificar fuentes oficiales en `npm run check`.

## Variables de entorno

Las claves se gestionan desde el sistema de secretos de Replit (no se hardcodean ni se commitean).

| Variable | Uso | Obligatoria |
| --- | --- | --- |
| `DATABASE_URL` | Conexión Postgres (Drizzle) | sí |
| `SESSION_SECRET` | Sesiones Express | sí |
| `RESEND_API_KEY` o credenciales Gmail JWT | Envío de email transaccional | sí |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Calendar/Meet + Search Console + Indexing API | recomendada |
| `DISCORD_BOT_TOKEN`, `DISCORD_PUBLIC_KEY`, `DISCORD_GUILD_ID` | Bot operativo y notificaciones | recomendada |
| `INDEXNOW_KEY` | Debe coincidir con el fichero estático `client/public/<key>.txt` | recomendada |
| `REDIS_URL` | Rate limiting / locks distribuidos en producción | opcional |
| `SITE_URL` | Origen canónico para sitemap/canonical | opcional (default `https://exentax.com`) |

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor unificado (Vite + Express en el mismo puerto) |
| `npm run build` | Build de producción (frontend + backend) |
| `npm run start` | Arranca el bundle compilado |
| `npm run check` | **Suite completa** — TS, lints, blog gates, i18n, e2e (calendar, calculator, Discord, newsletter, IndexNow) |
| `npm run db:push` | Aplica el schema Drizzle |
| `npm run db:studio` | Abre Drizzle Studio |

## Flujo de validación

`npm run check` ejecuta en orden:

1. `tsc`
2. Lints — `lint:typography`, `lint:stray-reports`, `lint:brand-casing`, `lint:blog`
3. SEO — `seo:check`, `seo:slash`, `seo:meta`, `seo:masterpiece-strict`
4. Blog — `blog:validate-all` (10 sub-pasos)
5. i18n — `i18n:check`
6. Tests — `test:seo-check`, `test:seo-slash`, `test:lint-blog`, `test:calculator`, `test:discord-neon`, `test:newsletter`, `test:booking`, `test:indexnow`

Cualquier paso en rojo aborta el chain.

## Despliegue

Replit Deploy maneja el ciclo (build + run + custom domain + TLS automático). Antes de publicar:

1. `npm run check` en verde.
2. Variables de entorno cargadas en el dashboard de Replit.
3. `client/public/<INDEXNOW_KEY>.txt` y `INDEXNOW_KEY` alineados.
4. Verificar Search Console + Google Analytics con la propiedad `https://exentax.com/`.
5. Tras el deploy: medir Lighthouse contra el dominio público y dejar el reporte en `.local/reports/lighthouse.json`.
