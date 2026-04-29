# live-verification report

- **Base URL**: `https://exentax.com`
- **Generated (UTC)**: 2026-04-29T11:03:32Z
- **Result**: PASS=1 · FAIL=9 · SKIP=16 · TOTAL=26


### F-1 · Health & connectivity

| Status | Check | Detail |
|---|---|---|
| FAIL | GET /api/health | HTTP 404 — body: <!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> <title>Error</title> </head> <body> <pre>Cannot GET /api/health</pre> </body> </html> |
| FAIL | GET /api/health/ready | HTTP 404 — body: <!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> <title>Error</title> </head> <body> <pre>Cannot GET /api/health/ready</pre> </body> </html> |
| FAIL | Security headers on / | HSTS=1 CSP=0 XFO=0 REF=0 UNSAFE_EVAL=0 (need HSTS+CSP+XFO+ReferrerPolicy, no unsafe-eval) |

### F-2 · SEO (sitemap · robots · IndexNow · hreflang)

| Status | Check | Detail |
|---|---|---|
| FAIL | GET /sitemap.xml | Got urlset instead of sitemapindex referencing pages/blog/faq |
| FAIL | GET /sitemap-blog.xml | 0 <loc> entries — expected ≈672 (112 slugs × 6 idiomas) |
| FAIL | GET /robots.txt | missing one of: sitemap-pages, sitemap-blog, Disallow /api, Disallow /admin, GPTBot |
| SKIP | IndexNow key file | Set --indexnow-key <key> or env INDEXNOW_KEY to test |
| FAIL | hreflang discovery on / | Found 2 alternates (expected ≥3) — check SSR head |

### F-3 · Security (CSRF · rate-limit · field encryption)

| Status | Check | Detail |
|---|---|---|
| FAIL | POST /api/calculator-leads sin Origin | Esperado 403, obtenido 404 |
| FAIL | Rate-limit on /api/health | Sent 220 reqs, never saw 429 — global rate-limit may be off |
| SKIP | Field encryption AES-256-GCM (phone con prefijo ef:) | Requires DB read access. From VPS: psql "$DATABASE_URL" -c "SELECT phone FROM leads ORDER BY id DESC LIMIT 1;" → debe empezar con ef: |

### F-4 · E2E con DB real

| Status | Check | Detail |
|---|---|---|
| SKIP | test:booking | From VPS: cd exentax-web && npm run test:booking |
| SKIP | test:newsletter | From VPS: cd exentax-web && npm run test:newsletter |
| SKIP | test:calculator | From VPS: cd exentax-web && npm run test:calculator (116/116) |
| SKIP | test:indexnow | From VPS: cd exentax-web && npm run test:indexnow |

### F-5 · Discord (bot online + 5 canales)

| Status | Check | Detail |
|---|---|---|
| SKIP | Bot online green dot | Manual: ver Discord server → indicador del bot exentax verde |
| SKIP | /ayuda · /agenda · /cita | Manual: ejecutar slash-commands en Discord con un usuario admin |
| SKIP | Embeds en 5 canales | Disparar reserva de prueba; verificar #exentax-agenda, #exentax-auditoria, #exentax-registros, #exentax-consentimientos, #exentax-errores |

### F-6 · Calendar / Meet / Email

| Status | Check | Detail |
|---|---|---|
| SKIP | Booking → Google Calendar event con Meet | Manual: reservar en /es/agendar con email real → ver evento en Google Calendar (calendar id de SA) con link Meet auto-generado |
| SKIP | Email transaccional con SPF/DKIM/DMARC pass | Manual: revisar email recibido → headers Authentication-Results: spf=pass dkim=pass dmarc=pass |

### F-7 · Observabilidad (Prometheus + UptimeRobot)

| Status | Check | Detail |
|---|---|---|
| SKIP | /api/metrics?token=… | Set --metrics-token $METRICS_TOKEN to verify Prometheus export |
| SKIP | UptimeRobot monitor UP en últimos 5 min | Manual: verificar dashboard https://uptimerobot.com — monitor exentax.com/api/health en verde |

### F-8 · Frontend smoke (6 idiomas)

| Status | Check | Detail |
|---|---|---|
| PASS | GET /es /en /fr /de /pt /ca → todos 200 |  |
| SKIP | Mobile (375px) + tablet (768px) + desktop (1280px) responsive | Manual: DevTools / Lighthouse mobile · verificar menú hamburguesa · sin shift de scroll en cambiador de idioma |
| SKIP | Calculadora submit → embed Discord en #exentax-calculadora | Manual: completar /es/calculadora con email real desde origen exentax.com |

### F-9 · Lighthouse final (Performance ≥0.85 · LCP <2.5s · CLS <0.1)

| Status | Check | Detail |
|---|---|---|
| SKIP | Lighthouse / · /llc · /itin × 6 idiomas | Manual: npx -p @lhci/cli@0.13.x lhci autorun --collect.url=https://exentax.com/es --collect.url=https://exentax.com/es/llc --collect.url=https://exentax.com/es/itin (repetir 6 idiomas) |

## Notes

* SKIP entries are checks that cannot be performed via plain HTTP — they require
  shell access to the VPS, DB credentials, Google/Discord runtime, or interactive
  Lighthouse runs. The exact follow-up command/manual step is in the Detail column.
* If FAIL=0 and the SKIP follow-ups are executed and pass, treat F-1..F-9 as green.
