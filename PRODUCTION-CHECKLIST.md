# PRODUCTION-CHECKLIST — Exentax Web · Hostinger VPS

> **Versión raíz, accionable.** Versión técnica extensa con setup OS-by-OS, arquitectura Nginx + PM2, Postgres tuning, Certbot detallado y troubleshooting en [`exentax-web/docs/deploy/PRODUCTION-CHECKLIST.md`](exentax-web/docs/deploy/PRODUCTION-CHECKLIST.md). Guía narrativa end-to-end VPS en [`exentax-web/docs/deploy/HOSTINGER-VPS.md`](exentax-web/docs/deploy/HOSTINGER-VPS.md). Setup Discord en [`exentax-web/docs/deploy/DISCORD-SETUP.md`](exentax-web/docs/deploy/DISCORD-SETUP.md).
>
> Estado del sistema: [`PRODUCTION-STATUS.md`](PRODUCTION-STATUS.md). Áreas inmovilizadas: [`WHAT-NOT-TO-TOUCH.md`](WHAT-NOT-TO-TOUCH.md).

---

## A. Recursos externos a tener listos antes de tocar el VPS

- [ ] **Hostinger VPS KVM 2** contratado — Ubuntu 22.04 LTS, ≥ 2 vCPU, ≥ 4 GB RAM, ≥ 50 GB SSD (8 GB / 100 GB recomendado). Otros planes Hostinger NO sirven (Shared/Cloud sin Node + Postgres nativos).
- [ ] **DNS** apuntado: `exentax.com` + `www.exentax.com` con A/AAAA → IP del VPS.
- [ ] **Discord application + bot** creado con 7 canales, 1 rol admin y los 5 IDs Discord copiados (`PUBLIC_KEY`, `BOT_TOKEN`, `APP_ID`, `GUILD_ID`, `ADMIN_DISCORD_ROLE_ID`). Detalle en `DISCORD-SETUP.md`.
- [ ] **Google Cloud project** con Service Account + APIs habilitadas: Calendar, Gmail (con dominio Workspace para `from:asesoria@exentax.com`), Search Console (lectura), Indexing API (opcional).
- [ ] **Certbot** instalable (`certbot` + `python3-certbot-nginx`).
- [ ] **UptimeRobot** account (o equivalente) con monitor contra `https://exentax.com/api/health`.

---

## B. Variables de entorno (resumen)

> Lista canónica con descripción y valor por defecto en `README.md §Variables de entorno`. Validador fail-fast en `exentax-web/server/index.ts:23-41`. Detalle full en `exentax-web/docs/deploy/PRODUCTION-CHECKLIST.md §B`.

### B.1 — Requeridas en todos los entornos

| Variable | Valor |
|---|---|
| `DATABASE_URL` | `postgresql://USER:PASS@HOST:5432/exentax?sslmode=require` |

### B.2 — Requeridas en producción (fail-fast)

| Variable | Cómo se obtiene |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` (o el que escuche Nginx upstream) |
| `FIELD_ENCRYPTION_KEY` | `openssl rand -hex 32` (64 hex chars) |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON one-line de la Service Account de Google Cloud |
| `DISCORD_BOT_TOKEN` | Discord Developer Portal → Bot |
| `DISCORD_PUBLIC_KEY` | Discord Developer Portal → General Information |
| `DISCORD_APP_ID` | Discord Developer Portal → General Information |
| `DISCORD_GUILD_ID` | ID del servidor Discord |
| `ADMIN_DISCORD_ROLE_ID` | ID del rol admin (gate de `/agenda` `/cita`) |
| `DISCORD_CHANNEL_REGISTROS` | Channel ID `#exentax-registros` |
| `DISCORD_CHANNEL_AGENDA` | Channel ID `#exentax-agenda` |
| `DISCORD_CHANNEL_CONSENTIMIENTOS` | Channel ID `#exentax-consentimientos` |
| `DISCORD_CHANNEL_AUDITORIA` | Channel ID `#exentax-auditoria` |
| `DISCORD_CHANNEL_ERRORES` | Channel ID `#exentax-errores` |

### B.3 — Recomendadas (defaults sensatos)

`SITE_URL` · `DOMAIN` · `BASE_URL` · `EXTRA_ALLOWED_ORIGINS` · `LOG_LEVEL=info` · `LOG_FORMAT=json` · `DB_POOL_MAX=10` · `METRICS_TOKEN` (`openssl rand -hex 32`) · `REDIS_URL` (recomendado prod para rate-limit + locks compartidos) · `DISCORD_CHANNEL_CALCULADORA` · `DISCORD_CHANNEL_ACTIVIDAD` · `GOOGLE_CALENDAR_ID=primary` · `GOOGLE_SC_SITE_URL=https://exentax.com/` · `INDEXNOW_KEY` (`openssl rand -hex 16`, registrar en bing.com/indexnow) · `GOOGLE_INDEXING_API_ENABLE=1` · `CONTACT_EMAIL` · `LEGAL_EMAIL` · `ADMIN_EMAIL` · `WHATSAPP_NUMBER` · `COMPANY_ADDRESS_SHORT` · `INSTAGRAM_URL` · `LINKEDIN_URL` · `SKIP_BUILD_E2E` (`1` si la VPS no tiene DB durante build).

> ⚠ **Nunca commitear `.env` real.** Mantener `.env.example` actualizado en el repo.

---

## C. Provisión del VPS (one-time)

> Pasos canónicos en `exentax-web/docs/deploy/PRODUCTION-CHECKLIST.md §C`. Resumen:

```bash
# 1. SSH + sistema base
apt update && apt upgrade -y
apt install -y nodejs npm postgresql-16 nginx certbot python3-certbot-nginx git curl
npm i -g pm2
node -v   # debe imprimir v22.x (Node 22 LTS)

# 2. Postgres setup (usuario + DB exentax)
sudo -u postgres psql <<EOF
CREATE USER exentax WITH PASSWORD 'STRONG_PASSWORD';
CREATE DATABASE exentax OWNER exentax;
GRANT ALL PRIVILEGES ON DATABASE exentax TO exentax;
EOF

# 3. Postgres SSL on + listen localhost (postgresql.conf + pg_hba.conf) → systemctl restart postgresql

# 4. Usuario aplicación + dir
adduser --disabled-password --gecos "" exentax
mkdir -p /var/www/exentax && chown exentax:exentax /var/www/exentax

# 5. Firewall
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw enable
```

---

## D. Deploy inicial (primera vez)

```bash
su - exentax
cd /var/www/exentax

git clone https://github.com/arnaufortuny/exentax-web-new.git .
cp .env.example .env && nano .env   # rellenar §B.1 + §B.2 (+ B.3 si aplica)

npm ci                                    # raíz (instala workspaces)
cd exentax-web && npm run db:push && cd ..   # primera vez: aplica schema Drizzle
SKIP_BUILD_E2E=1 npm run build            # quitar la flag si la VPS tiene DB accesible

# Verificar artefactos
ls dist/index.cjs                         # CJS shim — entry de Replit/PM2
ls exentax-web/dist/index.mjs             # ESM real
ls exentax-web/dist/public                # static assets

# PM2
pm2 start dist/index.cjs --name exentax --time
pm2 save && pm2 startup systemd           # ejecutar el comando que pm2 imprima

# Nginx reverse proxy + Certbot SSL → ver §D detallado en exentax-web/docs/deploy/PRODUCTION-CHECKLIST.md
```

---

## E. Re-deploys (cada release)

```bash
ssh exentax@VPS_IP
cd /var/www/exentax
git fetch origin && git checkout main && git pull
npm ci                                    # raíz
cd exentax-web && npm run db:push && cd ..   # solo si schema cambió
SKIP_BUILD_E2E=1 npm run build
pm2 reload exentax --update-env
```

---

## F. Smoke tests post-deploy (en orden)

> Bloque canónico en `exentax-web/docs/deploy/PRODUCTION-CHECKLIST.md §F-P`.

### F-1. Health
- [ ] `curl -s https://exentax.com/api/health` → `{"status":"ok","uptime":N}` (liveness, no DB).
- [ ] `curl -s https://exentax.com/api/health/ready` → `{"status":"ready","ready":true,"checks":{"db":{"ok":true},"breakers":{"ok":true},"emailWorker":{"ok":true,"message":"last drain Ns ago"}}}`.
- [ ] `curl -I https://exentax.com/` → headers presentes:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `Content-Security-Policy: …` (sin `unsafe-eval`)
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`

### F-2. SEO
- [ ] `curl -s https://exentax.com/sitemap.xml | head -20` → XML válido con sitemap-index referenciando `sitemap-pages.xml`, `sitemap-blog.xml`, `sitemap-faq.xml`.
- [ ] `curl -s https://exentax.com/sitemap-blog.xml | grep -c "<loc>"` → ≈672 entradas (112 slugs × 6 idiomas).
- [ ] `curl -s https://exentax.com/robots.txt` → declara los 4 sitemaps + bloquea `/api/*`, `/admin/*`, `/booking/*` + permite GPTBot/PerplexityBot/ClaudeBot.
- [ ] `curl -s https://exentax.com/<INDEXNOW_KEY>.txt` → contenido = `<INDEXNOW_KEY>`.
- [ ] Probar 3 hreflang random — cada `<link rel="alternate" hreflang="X" href="…"/>` debe responder 200.

### F-3. Seguridad
- [ ] `curl -X POST https://exentax.com/api/calculator-leads -H "Content-Type: application/json" -d '{}' -i | head -3` → **403** (sin Origin/Referer válido — CSRF).
- [ ] 250 GETs en 60s a `/api/health` → debe devolver **429** después del límite (rate limit global 200/min).
- [ ] Query directa SQL (read-only) sobre una fila reciente de `leads` → `phone` con prefijo `ef:` (field encryption activa).

### F-4. E2E con DB real
- [ ] `cd exentax-web && npm run test:booking` → PASS (book → manage → reschedule → cancel + Calendar/Meet/email).
- [ ] `cd exentax-web && npm run test:newsletter` → PASS (subscribe + RGPD consent + multi-language unsubscribe).
- [ ] `npm run test:calculator` → 116/116 PASS.
- [ ] `npm run test:indexnow` → PASS.

### F-5. Discord
- [ ] Bot online en Discord (indicador verde).
- [ ] `/ayuda` desde un usuario con rol admin → respuesta ephemeral OK.
- [ ] `/agenda` con paginación → embed con próximas reservas.
- [ ] Reserva de prueba → notificación llega a `#exentax-agenda` con embed formateado.
- [ ] Acción `/cita reagendar` → `#exentax-auditoria` recibe espejo.

### F-6. Calendar / Meet / Email
- [ ] Reserva de prueba crea evento real en Google Calendar con link Meet.
- [ ] Email de confirmación llega al cliente con el link Meet en su idioma.

### F-7. Métricas + observabilidad
- [ ] `curl https://exentax.com/api/metrics?token=$METRICS_TOKEN | head -50` → Prometheus format con HTTP totals, event-loop lag p99, breaker states, queue sizes.
- [ ] UptimeRobot monitor muestra UP en los últimos 5 min.

### F-8. Frontend smoke
- [ ] Visitar `/es`, `/en`, `/fr`, `/de`, `/pt`, `/ca` — 6 idiomas servidos sin error de consola.
- [ ] Mobile (375px) + tablet (768px) + desktop (1280px) — menú hamburguesa OK.
- [ ] Cambiador de idioma persiste preferencia.
- [ ] Calculadora sin errores en consola; submit funciona y embed Discord llega a `#exentax-calculadora`.
- [ ] Reservar una asesoría desde `/es/agendar` redirige a confirmación.

### F-9. Lighthouse final
- [ ] `npx -p @lhci/cli@0.13.x lhci autorun --collect.url=https://exentax.com/es --collect.url=https://exentax.com/es/blog` → Performance ≥ 0.85 · LCP < 2.5s · CLS < 0.1.

### F-monitor. Monitorización continua (Discord) — Task #56

El runner manual (`bash scripts/live-verification.sh https://exentax.com`) sigue siendo la forma canónica de validar a mano tras un deploy. Para que **producción se vigile sola** sin intervención humana, el repo incluye un cron de GitHub Actions que ejecuta el subset HTTP-only del runner y avisa al canal Discord `#exentax-errores` sólo cuando hay cambio de estado:

- Workflow: [`.github/workflows/live-verification.yml`](.github/workflows/live-verification.yml) — cron `*/20 * * * *` (cada 20 min) + `workflow_dispatch` manual.
- Notifier: [`scripts/notify-live-verification-discord.mjs`](scripts/notify-live-verification-discord.mjs) — parsea el reporte markdown del runner, clasifica el incidente y publica el embed.
- Tests: [`scripts/notify-live-verification-discord.test.mjs`](scripts/notify-live-verification-discord.test.mjs) — `node scripts/notify-live-verification-discord.test.mjs`.

Política de notificación (estado persistido entre runs vía `actions/cache`):

| Transición | Acción Discord |
|---|---|
| `ok → ok` | silent |
| `ok → down` | embed RED "Web pública degradada" con top-5 FAILs |
| `ok → vps-not-deployed` | embed RED "VPS no desplegado" (única alerta agrupada) |
| `down → ok` o `vps-not-deployed → ok` | embed NEON "Web pública RECUPERADA" con duración del incidente |
| `down → down` o `vps-not-deployed → vps-not-deployed` | silent (anti-spam: no spammea cada 20 min con los 9 FAILs idénticos) |
| `down ↔ vps-not-deployed` | embed RED del nuevo tipo |

Secrets necesarios en el repo (Settings → Secrets and variables → Actions):
- `DISCORD_BOT_TOKEN` — token del bot Exentax (ya usado por `auditoria-ci-notify-discord.mjs`).
- `DISCORD_CHANNEL_ERRORES` — ID del canal `#exentax-errores`.

Si faltan, el cron sigue corriendo y publicando el reporte como artefacto (`live-verification-report`), pero no envía al canal — útil para PRs de fork o repos sin permisos.

---

## G. Cron jobs y workers

El proceso Node arranca y supervisa internamente los workers (`email_retry_queue`, `pingSitemapIfChanged`, `pingIndexNowForNewArticles`, `pingGoogleIndexingForNewArticles`, drip-worker, incomplete-bookings, newsletter-broadcast, recordatorios). **No se necesita cron externo** para estos.

Cron sí recomendado:
```cron
# Postgres dump diario a 03:00 → almacenamiento externo
0 3 * * * pg_dump -U exentax exentax | gzip > /var/backups/exentax-$(date +\%F).sql.gz

# Test recuperación trimestral
0 4 1 */3 * cd /var/www/exentax/exentax-web && tsx scripts/verify-backup.ts >> /var/log/exentax-backup-test.log 2>&1
```

---

## H. Robots / sitemap ping inicial / IndexNow primer envío

- [ ] Tras el primer deploy, el server hace ping automático: `pingSitemapIfChanged` (5s) → `pingIndexNowForNewArticles` (7s) → `pingGoogleIndexingForNewArticles` (9s, opt-in).
- [ ] Verificar que la key IndexNow está accesible: `curl https://exentax.com/<INDEXNOW_KEY>.txt`.
- [ ] Registrar la key en bing.com/indexnow (one-time) si aún no estaba.
- [ ] Submit manual en Google Search Console del sitemap (`/sitemap.xml`) la primera vez (one-time).

---

## I. Rollback procedure

Si **cualquier** verificación post-deploy falla:

```bash
ssh exentax@VPS_IP && cd /var/www/exentax

# 1. Identificar último commit estable
git log --oneline -10

# 2. Revertir a tag conocido o commit anterior
git checkout exentax-3.0   # o `git reset --hard <last_good_sha>`

# 3. Re-build
npm ci
SKIP_BUILD_E2E=1 npm run build

# 4. Reload PM2
pm2 reload exentax --update-env

# 5. Verificar /api/health/ready
curl -s https://exentax.com/api/health/ready

# 6. Si la migración BD fue causa, revertir schema con drizzle-kit
cd exentax-web && npx drizzle-kit migrate --to <previous_migration_id>

# 7. Avisar a usuarios si el incidente fue ≥5 min (canal Discord #exentax-errores)
```

**Tiempos típicos**: 2-5 min si solo cambia el commit + reload PM2 · 10-15 min si hay rollback de schema BD.

---

## J. Backups

- [ ] Hostinger snapshots automáticos del VPS habilitados en panel.
- [ ] Postgres dump cron diario (ver §G).
- [ ] Test de recuperación trimestral con `tsx scripts/verify-backup.ts --dump=/path/to/dump.sql.gz`.

---

## K. Tras pasar todos los checks

- [ ] Crear tag de release: `git tag -a exentax-X.Y.Z -m "…" && git push origin exentax-X.Y.Z`.
- [ ] Anotar en `CHANGELOG.md` la fecha + tag + verificaciones que pasaron.
- [ ] Marcar este checklist como completado para esta release en `docs/internal/PRODUCTION-DEPLOY-LOG.md` (crear si no existe; una entrada por release).

**Si todos los items F-1 a F-9 están en verde**: **producción VIVO**.
