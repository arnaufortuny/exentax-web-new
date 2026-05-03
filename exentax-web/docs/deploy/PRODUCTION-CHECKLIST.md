# PRODUCTION-CHECKLIST — Hostinger VPS Deploy

> Checklist completo go-live Exentax Web sobre Hostinger VPS KVM 2 (Ubuntu 22.04 LTS, Node 22, PostgreSQL 16, Nginx, Certbot, PM2). Versión guiada en `exentax-web/docs/deploy/HOSTINGER-VPS.md`.

---

## Pre-deploy

### A. Recursos externos

- [ ] **Hostinger VPS KVM 2 contratado** — Ubuntu 22.04 LTS, ≥ 2 vCPU, ≥ 4 GB RAM, ≥ 50 GB SSD.
- [ ] **DNS apuntado** — `exentax.com` + `www.exentax.com` con registros A (y AAAA si IPv6) → IP del VPS. Propagación esperada 5-30 min.
- [ ] **Discord application + bot** — `Discord Developer Portal`:
  - 1 application + 1 bot con permisos `applications.commands` + `bot scope: Send Messages, Embed Links, Use Slash Commands, Read Message History`.
  - 7 canales creados: `#exentax-registros`, `#exentax-agenda`, `#exentax-consentimientos`, `#exentax-calculadora`, `#exentax-actividad`, `#exentax-errores`, `#exentax-auditoria`.
  - 1 rol admin asignado a los miembros que pueden ejecutar `/agenda` y `/cita`.
  - `DISCORD_PUBLIC_KEY` de la pestaña "General Information" copiado.
  - `DISCORD_BOT_TOKEN` regenerado y guardado.
  - `DISCORD_APP_ID` y `DISCORD_GUILD_ID` apuntados.
- [ ] **Google Cloud project + Service Account** — APIs habilitadas: Calendar API, Gmail API (con dominio Workspace para `from:asesoria@exentax.com`), Search Console API (lectura), Indexing API (opcional).
- [ ] **Certbot** ready en VPS (paquete `certbot` + `python3-certbot-nginx`).
- [ ] **UptimeRobot account** o equivalente con monitor configurado a `https://exentax.com/api/health`.

### B. Variables de entorno (`.env` en el VPS)

#### B.1 Requeridas (todos los entornos)

```bash
DATABASE_URL=postgresql://USER:PASS@HOST:5432/exentax?sslmode=require
```

#### B.2 Requeridas en producción (fail-fast en `server/index.ts`)

```bash
NODE_ENV=production
PORT=5000

# Cifrado PII
FIELD_ENCRYPTION_KEY=$(openssl rand -hex 32)   # 64 hex chars

# Google
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'   # JSON one-line

# Discord
DISCORD_BOT_TOKEN=...
DISCORD_PUBLIC_KEY=...
DISCORD_APP_ID=...
DISCORD_GUILD_ID=...
ADMIN_DISCORD_ROLE_ID=...
DISCORD_CHANNEL_REGISTROS=...
DISCORD_CHANNEL_AGENDA=...
DISCORD_CHANNEL_CONSENTIMIENTOS=...
```

#### B.3 Recomendadas (defaults sensatos)

```bash
SITE_URL=https://exentax.com
DOMAIN=exentax.com
BASE_URL=https://exentax.com
LOG_LEVEL=info
LOG_FORMAT=json
DB_POOL_MAX=10
METRICS_TOKEN=$(openssl rand -hex 32)
DISCORD_CHANNEL_CALCULADORA=...
DISCORD_CHANNEL_ACTIVIDAD=...
DISCORD_CHANNEL_ERRORES=...
DISCORD_CHANNEL_AUDITORIA=...
GOOGLE_CALENDAR_ID=primary
GOOGLE_SC_SITE_URL=https://exentax.com/
INDEXNOW_KEY=$(openssl rand -hex 16)   # registrar en bing.com/indexnow
GOOGLE_INDEXING_API_ENABLE=1
CONTACT_EMAIL=hola@exentax.com
LEGAL_EMAIL=legal@exentax.com
ADMIN_EMAIL=admin@exentax.com
WHATSAPP_NUMBER=34614916910
COMPANY_ADDRESS_SHORT=Barcelona, España
INSTAGRAM_URL=...
LINKEDIN_URL=...
SKIP_BUILD_E2E=0   # 1 si la VPS no tiene DB durante build
```

> **Nunca** commitear `.env` real. Mantener `.env.example` actualizado.

### C. Provisión VPS (one-time)

```bash
# 1. SSH al VPS
ssh root@VPS_IP

# 2. Sistema base
apt update && apt upgrade -y
apt install -y nodejs npm postgresql-16 nginx certbot python3-certbot-nginx git curl
npm i -g pm2

# 3. Verificar Node 22
node -v   # debe imprimir v22.x

# 4. Postgres setup
sudo -u postgres psql <<EOF
CREATE USER exentax WITH PASSWORD 'STRONG_PASSWORD';
CREATE DATABASE exentax OWNER exentax;
GRANT ALL PRIVILEGES ON DATABASE exentax TO exentax;
EOF

# 5. PostgreSQL listening + sslmode
# Editar /etc/postgresql/16/main/postgresql.conf: ssl=on, listen_addresses='localhost'
# Editar /etc/postgresql/16/main/pg_hba.conf: host all all 127.0.0.1/32 md5
systemctl restart postgresql

# 6. Usuario aplicación
adduser --disabled-password --gecos "" exentax
mkdir -p /var/www/exentax
chown exentax:exentax /var/www/exentax

# 7. Firewall
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw enable
```

---

## Deploy

### D. Inicial (primera vez)

```bash
# Como usuario exentax
su - exentax
cd /var/www/exentax

# 1. Clonar
git clone https://github.com/arnaufortuny/exentax-web-new.git .

# 2. Variables
cp .env.example .env
nano .env   # rellenar las 14+ vars del bloque B.1, B.2 y opcionales B.3

# 3. Dependencias
npm ci   # raíz
cd exentax-web && npm ci && cd ..

# 4. Migraciones BD
cd exentax-web && npm run db:push && cd ..

# 5. Build
SKIP_BUILD_E2E=1 npm run build
# Si la VPS tiene DB accesible y quieres ejecutar guards E2E al build:
# npm run build (sin SKIP_BUILD_E2E)

# 6. Verificar dist
ls dist/index.cjs                          # entry point CJS shim
ls exentax-web/dist/index.mjs              # ESM real
ls exentax-web/dist/public                 # static assets

# 7. PM2 start
pm2 start dist/index.cjs --name exentax --time
pm2 save
pm2 startup systemd   # ejecutar el comando que pm2 imprima como root

# 8. Nginx
cat > /etc/nginx/sites-available/exentax <<'NGINX'
server {
  listen 80;
  server_name exentax.com www.exentax.com;
  client_max_body_size 200k;
  location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
    proxy_http_version 1.1;
    proxy_set_header Upgrade           $http_upgrade;
    proxy_set_header Connection        "upgrade";
    proxy_read_timeout 60s;
  }
}
NGINX
ln -s /etc/nginx/sites-available/exentax /etc/nginx/sites-enabled/exentax
nginx -t && systemctl reload nginx

# 9. Certbot SSL
certbot --nginx -d exentax.com -d www.exentax.com --non-interactive --agree-tos -m admin@exentax.com
# → instala renovación automática (twice daily timer)
```

### D-bis. Pre-deploy local checks (correr ANTES de cada release)

Suite de regresión local que cubre los workers críticos cuya falla
silenciosa solo se detectaría en producción. Ejecutar desde
`exentax-web/`:

```bash
npm run test:consent-atomicity        # GDPR audit-trail atómico
npm run test:drip-exactly-once        # outbox fencing + exactly-once
npm run test:drip-outbox-backfill     # migración boot-time T#38 → T#70
npm run test:discord-queue-persistence
npm run test:discord-event-notifications
```

`test:drip-outbox-backfill` valida `backfillOutboxFromEnrollments()` — el
helper one-shot que enqueua filas de `email_outbox` para enrollments
legacy en vuelo al primer boot post-T#38. Cubre los 5 edge cases del
audit row A2 (enrollment fresco, reconciliación `last_sent_step >
current_step`, exhausted → seal `completed_at`, idempotencia con outbox
pre-existente, mapeo `source ↔ payload.kind`) más una segunda pasada
que prueba que re-ejecutar la migración no produce filas adicionales.
Requiere `DATABASE_URL` accesible (skipea con SKIP si no lo está).

### E. Re-deploys (cada release)

```bash
ssh exentax@VPS_IP
cd /var/www/exentax
git fetch origin && git checkout main && git pull
cd exentax-web && npm ci --omit=dev && cd ..
cd exentax-web && npm run db:push && cd ..   # solo si schema cambió
SKIP_BUILD_E2E=1 npm run build
pm2 reload exentax --update-env
```

---

## Post-deploy verification

Ejecutar **en orden** desde el VPS o desde fuera (verificación end-to-end):

### F. Health & connectivity

- [ ] `curl -s https://exentax.com/api/health` → `{"ok":true}` (liveness, no DB).
- [ ] `curl -s https://exentax.com/api/health/ready` → `{"ok":true,"db":"healthy","email":"healthy",...}`.
- [ ] `curl -I https://exentax.com/` → headers presentes:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `Content-Security-Policy: ...` (no `unsafe-eval`)
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`

### G. SEO

- [ ] `curl -s https://exentax.com/sitemap.xml | head -20` → XML válido con URLs en 6 idiomas.
- [ ] `curl -s https://exentax.com/sitemap-blog.xml | grep -c "<loc>"` → 112 × 6 = ~672 entradas blog (más home, services, etc.).
- [ ] `curl -s https://exentax.com/robots.txt` → declara los 4 sitemaps + bloquea `/api/`, `/admin/`, `/booking/`.
- [ ] `curl -s https://exentax.com/<INDEXNOW_KEY>.txt` → contenido = `<INDEXNOW_KEY>`.
- [ ] Probar 3 hreflang random en producción. Cada `<link rel="alternate" hreflang="X" href="..."/>` debe responder 200.

### H. CSRF + Rate limiting

- [ ] `curl -X POST https://exentax.com/api/calculator-leads -H "Content-Type: application/json" -d '{}' -i | head -3` → **403** (sin Origin/Referer válido).
- [ ] Lanzar 250 GETs en 60s a `/api/health` → debe devolver **429** después del 200.

### I. Booking E2E (con DB real)

- [ ] `cd exentax-web && npm run test:booking` → PASS.
  - book → manage → reschedule → cancel funciona end-to-end con Calendar+Meet+email.

### J. Newsletter E2E

- [ ] `cd exentax-web && npm run test:newsletter` → PASS.
  - subscribe + RGPD consent log + multi-language unsubscribe.

### K. Discord

- [ ] Bot online en Discord (debe aparecer indicador verde).
- [ ] Probar `/ayuda` desde un usuario con rol admin → respuesta ephemeral sin error.
- [ ] Probar `/agenda` con paginación → embed con próximas reservas.
- [ ] Crear una reserva de prueba → notificación llega a `#exentax-agenda` con embed formateado.
- [ ] Acción admin desde Discord (`/cita reagendar`) → `#exentax-auditoria` recibe espejo.

### L. Calendar / Meet

- [ ] Reserva de prueba crea evento real en Google Calendar con link Meet.
- [ ] Email de confirmación llega al cliente con el link Meet.

### M. Email

- [ ] `cd exentax-web && tsx scripts/verify-backup.ts` → conexión DB OK + tablas críticas presentes.
- [ ] Logs PM2 sin errores: `pm2 logs exentax --lines 50 --err`.

### N. Métricas + observabilidad

- [ ] `curl https://exentax.com/api/metrics?token=$METRICS_TOKEN | head -50` → Prometheus format con HTTP totals, event-loop lag p99, breaker states, queue sizes.
- [ ] UptimeRobot monitor configurado y muestra UP en los últimos 5 min.

### O. Frontend smoke

- [ ] Visitar https://exentax.com/ y https://exentax.com/en, https://exentax.com/fr, etc. — 6 idiomas servidos sin error.
- [ ] Mobile (375px) + tablet (768px) + desktop (1280px) — menú hamburguesa abre/cierra.
- [ ] Cambiador de idioma funciona y persiste preferencia.
- [ ] Calculadora sin errores en consola; submit funciona.
- [ ] Reservar una asesoría desde `/es/agendar` → redirige a confirmación.

### P. Lighthouse final

- [ ] `npx -p @lhci/cli@0.13.x lhci autorun --collect.url=https://exentax.com/es --collect.url=https://exentax.com/es/blog` → Performance ≥ 0.85, LCP < 2.5s, CLS < 0.1.

---

## Rollback plan

Si **cualquier** verificación post-deploy falla:

```bash
ssh exentax@VPS_IP
cd /var/www/exentax

# 1. Identificar último commit estable
git log --oneline -10

# 2. Revertir a tag conocido o commit anterior
git checkout exentax-3.0   # o `git reset --hard <last_good_sha>`

# 3. Re-build
cd exentax-web && npm ci --omit=dev && cd ..
SKIP_BUILD_E2E=1 npm run build

# 4. Reload PM2
pm2 reload exentax --update-env

# 5. Verificar /api/health/ready de nuevo
curl -s https://exentax.com/api/health/ready

# 6. Si la migración BD fue causa, revertir schema:
cd exentax-web && npx drizzle-kit migrate --to <previous_migration_id>

# 7. Avisar a usuarios si el incidente fue ≥ 5 min (página de status, Discord canal `#exentax-errores`)
```

**Tiempos típicos de rollback**: 2-5 min si solo hay que cambiar el commit + reload PM2; 10-15 min si hay rollback de schema BD.

---

## Backups

- [ ] Hostinger ofrece snapshots automáticos del VPS (verificar habilitados en panel).
- [ ] Postgres dump cron diario a almacenamiento externo:
  ```cron
  0 3 * * * pg_dump -U exentax exentax | gzip > /var/backups/exentax-$(date +\%F).sql.gz
  ```
- [ ] Test de recuperación trimestral con `tsx scripts/verify-backup.ts --dump=/path/to/dump.sql.gz`.

---

## Ownership matrix

| Área | Responsable | Backup |
|---|---|---|
| Infra (Hostinger, DNS, SSL) | Owner | DevOps contractor |
| Código (build, deploys, releases) | Owner / Claude sessions | Owner |
| Base de datos (migrations, backups) | Owner | DBA contractor |
| Discord (canales, rol admin) | Owner | — |
| Google Cloud (SA, APIs) | Owner | — |
| Contenido blog editorial | Owner / native reviewers | Editorial team |

---

## Tras pasar todos los checks

- [ ] Crear tag de release: `git tag -a exentax-X.Y.Z -m "..." && git push origin exentax-X.Y.Z`.
- [ ] Anotar en `CHANGELOG.md` la fecha + tag + verificaciones que pasaron.
- [ ] Marcar este checklist como completado para esta release en `docs/internal/PRODUCTION-DEPLOY-LOG.md` (crear si no existe; una entrada por release).

**Si todos los items de F-P están en verde**: **producción VIVO**.
