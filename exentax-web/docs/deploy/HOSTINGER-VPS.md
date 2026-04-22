# Guía de despliegue: Exentax Web → Hostinger VPS

**Última actualización:** 2026-04-22
**Stack de la aplicación:** Node.js 22 + Express 5 + React 19 + PostgreSQL + Drizzle ORM + Discord bot + Google Calendar/Meet/Gmail.

## 1. Qué plan de Hostinger contratar (y cuál NO)

| Plan de Hostinger | ¿Sirve? | Razón |
|---|---|---|
| **Shared Hosting (Premium/Business)** | ❌ No | Solo PHP/MySQL. No arranca Node.js ni PostgreSQL. |
| **Cloud Hosting** | ❌ No | Entorno gestionado sin PostgreSQL nativo ni procesos en background (Discord bot, retry worker). |
| **VPS KVM** | ✅ **Sí (único plan válido)** | Linux completo con acceso root. Puedes instalar Node 22, PostgreSQL 16, Nginx, PM2 y Certbot. |

**Plan mínimo recomendado:** **VPS KVM 2**
- 2 vCPU, 8 GB RAM, 100 GB NVMe.
- Ubuntu 22.04 LTS (o 24.04 LTS).
- IP pública IPv4 + IPv6.
- Motivo: el bundle del servidor pesa 5.9 MB y el cliente servido estático 24 MB; el consumo de RAM real en runtime está dominado por PostgreSQL + Node + Discord bot (≈ 800 MB en reposo, hasta 2 GB bajo carga). 4 GB (KVM 1) funciona pero sin margen; 8 GB (KVM 2) permite cache y picos.

## 2. Checklist de readiness — qué debe estar listo ANTES de comprar el VPS

Ya verificado y OK en esta revisión:

- ✅ `npx tsc --noEmit` → exit 0, 0 errors.
- ✅ `npm run build` → produce `dist/index.mjs` (5.9 MB) + `dist/public/` (24 MB, 763 ficheros, 725 JS chunks).
- ✅ `npm run i18n:check` → PASS (1.552 claves × 6 idiomas, 0 missing, 0 phantom, 0 placeholder mismatch).
- ✅ `npm run seo:meta` → 0 errors, 0 warnings en 6 idiomas.
- ✅ `npm run seo:check` → 0 enlaces rotos (111 artículos, ≥3 enlaces entrantes c/u).
- ✅ `node scripts/audit-pt-pt.mjs` → 113 ficheros PT-PT limpios.
- ✅ `node scripts/blog-content-lint.mjs` → 670 ficheros OK, 0 menciones prohibidas.
- ✅ `node scripts/audit-system-seo-faqs.mjs` → `faqs-audit.json` 0 issues (79 FAQs × 6 idiomas) y `### Preguntas frecuentes` presente en 20/20 artículos × 6 idiomas.

Pendientes documentados (no bloquean deploy, ver `PENDING.md`):

- 44 artículos blog con ratio de palabras < 70 % respecto al ES (SEO long-tail). DE 16, PT 12, CA 10, FR 6, EN 0.
- Dominios DNS aún sin apuntar (paso 5 de esta guía).
- Credenciales de producción por generar: `FIELD_ENCRYPTION_KEY`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `DISCORD_*`.

## 3. Arquitectura en el VPS

```
                 Internet
                    │
                    ▼
        Hostinger firewall (80/443)
                    │
                    ▼
          Nginx (reverse proxy)
          · TLS terminado por Certbot/Let's Encrypt
          · Sirve /uploads estático
          · Proxypass → localhost:5000
                    │
                    ▼
            Node.js 22 + PM2
           (exentax-web/dist/index.mjs)
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
      Postgres   Redis   Discord/Google
      (local)   (local,  (HTTPS salientes)
                opcional)
```

Flujo de deploy: build local → `rsync` a `/opt/exentax-web/` → `pm2 restart`.

## 4. Provisión inicial del VPS (una sola vez)

Tras comprar el KVM y recibir la IP + acceso SSH root:

### 4.1 Endurecimiento básico

```bash
# Conectar con SSH
ssh root@<IP_VPS>

# Actualizar el sistema
apt update && apt upgrade -y

# Crear usuario no-root con sudo
adduser --disabled-password --gecos "" deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Desactivar login root por SSH (ya tienes "deploy")
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh

# Firewall (UFW)
apt install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Swap (si RAM ≤ 8 GB)
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### 4.2 Instalar Node.js 22 LTS

```bash
# Usando NodeSource (prod-grade, recibe security patches)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Verificar
node --version   # debe decir v22.x
npm --version
```

### 4.3 Instalar PostgreSQL 16

```bash
apt install -y postgresql postgresql-contrib
systemctl enable --now postgresql

# Crear base de datos y usuario dedicado
sudo -u postgres psql <<SQL
CREATE DATABASE exentax;
CREATE USER exentax_app WITH ENCRYPTED PASSWORD 'CAMBIAR-POR-PASSWORD-LARGA-ALEATORIA';
GRANT ALL PRIVILEGES ON DATABASE exentax TO exentax_app;
ALTER DATABASE exentax OWNER TO exentax_app;
SQL

# (Opcional) Endurecer pg_hba.conf: solo localhost
# En /etc/postgresql/16/main/pg_hba.conf mantén sólo:
#   local   all   all                    peer
#   host    all   all   127.0.0.1/32     scram-sha-256
#   host    all   all   ::1/128          scram-sha-256
systemctl reload postgresql
```

Guarda la cadena de conexión, la usarás como `DATABASE_URL`:

```
postgresql://exentax_app:<PASSWORD>@127.0.0.1:5432/exentax
```

### 4.4 (Opcional) Redis para locks distribuidos

Solo necesario si escalas a >1 instancia de Node. Con una sola instancia el lock en memoria de Express basta y puedes omitir Redis.

```bash
apt install -y redis-server
systemctl enable --now redis-server
# REDIS_URL=redis://127.0.0.1:6379
```

### 4.5 Instalar PM2 (gestor de procesos)

```bash
npm install -g pm2
pm2 startup systemd -u deploy --hp /home/deploy
# Ejecuta la línea que PM2 te imprima (sudo env PATH=...) para habilitar arranque en boot
```

### 4.6 Instalar Nginx + Certbot

```bash
apt install -y nginx certbot python3-certbot-nginx
systemctl enable --now nginx
```

## 5. DNS del dominio

Antes de pedir el certificado SSL debes apuntar el dominio `exentax.com` a la IP del VPS:

| Registro | Nombre | Valor | TTL |
|---|---|---|---|
| A | `@` | `<IP_IPv4_VPS>` | 3600 |
| A | `www` | `<IP_IPv4_VPS>` | 3600 |
| AAAA | `@` | `<IP_IPv6_VPS>` (si el VPS tiene IPv6) | 3600 |
| AAAA | `www` | `<IP_IPv6_VPS>` | 3600 |

Dos opciones:
1. **Mantener el DNS actual** (Cloudflare, Namecheap, etc.) y solo cambiar los registros A/AAAA.
2. **Usar los nameservers de Hostinger** (`ns1.dns-parking.com` + `ns2.dns-parking.com`) si compras el dominio con ellos.

Verifica propagación antes de continuar:

```bash
dig +short exentax.com
dig +short www.exentax.com
# Debe devolver la IP del VPS
```

## 6. Subir el código al VPS

Desde tu máquina local (donde está el repo):

```bash
# 1. Build local
cd /home/user/exentax-web-new
SKIP_BUILD_E2E=1 npm run build

# 2. Copiar build + node_modules al VPS
rsync -avz --delete \
  --exclude '.git' \
  --exclude 'docs/auditoria-sistema-seo-faqs' \
  --exclude '.local' \
  --exclude 'screenshots' \
  exentax-web/ deploy@<IP_VPS>:/opt/exentax-web/

# 3. Copiar package.json raíz + lockfile + .env
rsync -avz package.json package-lock.json deploy@<IP_VPS>:/opt/exentax-web-root/
```

Alternativa (Git deploy):

```bash
# En el VPS
sudo mkdir -p /opt/exentax-web
sudo chown deploy:deploy /opt/exentax-web
cd /opt/exentax-web
git clone https://github.com/arnaufortuny/exentax-web-new.git .
# En cada deploy después:
#   git pull origin main && npm ci --omit=dev && SKIP_BUILD_E2E=1 npm run build && pm2 restart exentax
```

## 7. Crear `.env` en el VPS

```bash
sudo -u deploy nano /opt/exentax-web/.env
```

Pega las variables **obligatorias** (la app hace fail-fast en producción si falta alguna):

```dotenv
# — Requeridas —
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://exentax_app:<PASSWORD>@127.0.0.1:5432/exentax

# 64 hex chars (32 bytes) — genera con:  openssl rand -hex 32
FIELD_ENCRYPTION_KEY=<64_HEX_CHARS>

# Credenciales de Google (Calendar/Meet/Gmail) — pégalo como JSON en 1 línea, escapando comillas
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"..."}

# — Discord bot (requerido) —
DISCORD_BOT_TOKEN=
DISCORD_PUBLIC_KEY=
DISCORD_APP_ID=
DISCORD_GUILD_ID=
ADMIN_DISCORD_ROLE_ID=
DISCORD_CHANNEL_REGISTROS=
DISCORD_CHANNEL_AGENDA=
DISCORD_CHANNEL_CONSENTIMIENTOS=

# — Branding —
SITE_URL=https://exentax.com
DOMAIN=exentax.com
CONTACT_EMAIL=hola@exentax.com
LEGAL_EMAIL=legal@exentax.com
ADMIN_EMAIL=admin@exentax.com
WHATSAPP_NUMBER=+34XXXXXXXXX

# — Operación —
LOG_LEVEL=info
DB_POOL_MAX=10
# REDIS_URL=redis://127.0.0.1:6379   # descomenta si activaste Redis
```

Permisos restrictivos:

```bash
chmod 600 /opt/exentax-web/.env
chown deploy:deploy /opt/exentax-web/.env
```

## 8. Migración de base de datos y arranque

```bash
ssh deploy@<IP_VPS>
cd /opt/exentax-web-root    # donde copiaste package.json raíz

# Instalar dependencias de producción (workspace completo)
npm ci --omit=dev

# Aplicar esquema Drizzle (crea/actualiza tablas)
npm run db:push

# Primer arranque bajo PM2
cd /opt/exentax-web
pm2 start dist/index.mjs --name exentax --node-args="--enable-source-maps"
pm2 save

# Verifica
pm2 status
pm2 logs exentax --lines 50
curl http://127.0.0.1:5000/api/health
# Debe devolver {"ok":true,...}
```

## 9. Nginx — reverse proxy + TLS

Crea `/etc/nginx/sites-available/exentax.conf`:

```nginx
# Redirect HTTP → HTTPS (lo activa Certbot automáticamente)
server {
    listen 80;
    listen [::]:80;
    server_name exentax.com www.exentax.com;

    # Certbot webroot
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name exentax.com www.exentax.com;

    # Certificados (Certbot los rellena tras el paso siguiente)
    ssl_certificate     /etc/letsencrypt/live/exentax.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/exentax.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;

    # Redirección canónica www → apex (SEO)
    if ($host = www.exentax.com) {
        return 301 https://exentax.com$request_uri;
    }

    # Tamaños realistas para el upload de formularios
    client_max_body_size 10m;

    # La app sirve sitemap/robots/assets internamente; proxy todo a Node.
    # (trust proxy=1 ya está configurado en server/index.ts, así X-Forwarded-*
    #  llega correctamente a helmet/HSTS y a rate-limit.)
    location / {
        proxy_pass         http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Forwarded-Host  $host;
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        "upgrade";
        proxy_read_timeout 120s;
    }

    # Cache agresivo para assets con hash — Vite emite con content-hash en
    # el nombre, así que immutable es seguro.
    location /assets/ {
        proxy_pass http://127.0.0.1:5000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

Activar y pedir certificado:

```bash
sudo mkdir -p /var/www/letsencrypt
sudo ln -sf /etc/nginx/sites-available/exentax.conf /etc/nginx/sites-enabled/exentax.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Pedir cert y que Certbot edite la config para HTTPS automáticamente
sudo certbot --nginx -d exentax.com -d www.exentax.com \
  --agree-tos -m admin@exentax.com --non-interactive --redirect

# Renovación automática (cron ya se añade al instalar certbot en Ubuntu)
sudo systemctl status certbot.timer
```

## 10. Verificación end-to-end tras deploy

Desde tu máquina local:

```bash
# 1. Health endpoint (JSON ok:true)
curl https://exentax.com/api/health

# 2. Home servida (200)
curl -sI https://exentax.com | head -1

# 3. Sitemap accesible
curl -s https://exentax.com/sitemap.xml | head -20

# 4. robots.txt accesible (si no, revisar rutas en server/routes.ts)
curl https://exentax.com/robots.txt

# 5. Certificado válido
echo | openssl s_client -servername exentax.com -connect exentax.com:443 2>/dev/null \
  | openssl x509 -noout -dates
```

Desde PM2:

```bash
pm2 logs exentax --lines 200 | grep -iE "error|discord|google|startup"
# Buscar: "startup: server ready", sin FATAL, sin stack traces.
```

## 11. Hooks post-deploy (ya programados por la app)

`server/index.ts` dispara automáticamente tras arrancar:

1. `pingSitemapIfChanged` (5 s) — solo si `/sitemap.xml` cambió.
2. `pingIndexNowForNewArticles` (7 s) — IndexNow (Bing/Yandex).
3. `pingGoogleIndexingForNewArticles` (9 s) — solo si `GOOGLE_INDEXING_API_ENABLE=1`.
4. `seo-indexing-publish.mjs` — publica informe en `uploads/reports/indexing/`.

No hace falta cron manual. Para desactivar el audit de indexación: `INDEXING_AUDIT_DISABLE=1`.

## 12. Tareas operativas recurrentes

### 12.1 Backup de Postgres (cron diario)

```bash
sudo -u deploy crontab -e
```

Añade:

```cron
0 3 * * * pg_dump -U exentax_app -h 127.0.0.1 exentax | gzip > /home/deploy/backups/exentax-$(date +\%F).sql.gz
0 4 * * * find /home/deploy/backups -name "exentax-*.sql.gz" -mtime +30 -delete
```

### 12.2 Monitorización

- **UptimeRobot** (gratis): crea monitor HTTPS → `https://exentax.com/api/health` cada 5 min.
- **Discord**: ya está integrado; errores y salud se publican en `DISCORD_CHANNEL_ERRORES` / `REGISTROS`.
- **PM2 logs**: `pm2 install pm2-logrotate` para rotar logs automáticamente.

### 12.3 Actualización del código

```bash
ssh deploy@<IP_VPS>
cd /opt/exentax-web
git pull origin main
cd /opt/exentax-web-root
npm ci --omit=dev
cd /opt/exentax-web
SKIP_BUILD_E2E=1 npm run build
pm2 reload exentax   # zero-downtime
```

## 13. Troubleshooting común

| Síntoma | Causa probable | Fix |
|---|---|---|
| `FATAL: Missing required environment variables` al arrancar | Falta env var en `.env` | Revisar paso 7; todas las de bloque REQUIRED son obligatorias en prod. |
| `502 Bad Gateway` en Nginx | Node no escucha en 5000 | `pm2 status`, `pm2 logs exentax --lines 100`, verificar `PORT=5000` en `.env`. |
| Mixed content / HSTS loop | `trust proxy` o `X-Forwarded-Proto` mal configurado | El server ya hace `app.set("trust proxy", 1)`. Verifica que Nginx envía `X-Forwarded-Proto $scheme`. |
| Certbot falla al pedir cert | DNS no propagado | `dig +short exentax.com` debe coincidir con la IP del VPS antes de correr certbot. |
| `seo:slash` audit falla en build | Script temporal no arrancó servidor en 60 s | En prod no se ejecuta (está en `npm run check`, no en `npm run build`). No bloquea deploy. |
| Discord bot no reacciona | `DISCORD_PUBLIC_KEY` incorrecta | Debe coincidir byte-a-byte con la del Developer Portal. Sin ella, el bot arranca pero las slash-commands fallan en verificación de firma. |
| Booking sin Google Meet link | `GOOGLE_SERVICE_ACCOUNT_KEY` JSON mal formado o falta delegación | Re-generar en GCP Console, habilitar Calendar + Meet APIs. |

## 14. Mapa de dependencias externas (qué necesita internet saliente)

Abre estos dominios en el firewall/VPS (casi todos ya permitidos por defecto):

- `api.discord.com`, `gateway.discord.gg` — bot + notificaciones.
- `www.googleapis.com`, `oauth2.googleapis.com` — Calendar/Meet/Gmail API.
- `api.indexnow.org`, `www.bing.com` — IndexNow.
- `indexing.googleapis.com` — Google Indexing API (opt-in).
- `fonts.googleapis.com`, `fonts.gstatic.com` — Google Fonts CDN (solo dev; prod sirve desde `/assets/`).
- `www.googletagmanager.com`, `connect.facebook.net` — analytics (cliente).

## 15. Costes esperados en Hostinger

- **VPS KVM 2**: ~ 8-10 €/mes.
- **Dominio** (exentax.com): ~ 10-15 €/año.
- **Backups** (add-on Hostinger o manual con cron): incluido en el plan o gratuito con cron.

Total ~ 100-130 €/año por infra (no incluye Google Workspace ni Discord Nitro ni OpenAI ni otras integraciones).
