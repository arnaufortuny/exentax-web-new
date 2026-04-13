# Exentax Web — Arquitectura de Producción

Web pública de Exentax: landing, blog, calculadora fiscal, sistema de reservas y páginas legales.
Stack: React 19 + Vite / Express 5 / PostgreSQL (Drizzle ORM) / i18n (6 idiomas).

---

## Estructura del proyecto

```
exentax-web-new/
├── exentax-web/
│   ├── client/src/
│   │   ├── pages/          # Páginas públicas
│   │   ├── components/     # Componentes UI
│   │   ├── i18n/           # Internacionalización
│   │   ├── data/           # Blog y contenido
│   │   ├── lib/            # Utilidades del cliente
│   │   └── hooks/          # Hooks React
│   ├── server/
│   │   ├── routes/         # Endpoints públicos
│   │   ├── storage/        # Capa de acceso a datos
│   │   └── *.ts            # Servicios (email, Google, seguridad)
│   └── shared/
│       └── schema.ts       # Schema Drizzle (fuente de verdad)
├── migrations/
│   └── 0000_superb_genesis.sql  # Migración inicial limpia
├── drizzle.config.ts
└── package.json
```

---

## Páginas públicas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing principal |
| `/servicios` | Servicios y precios |
| `/como-trabajamos` | Cómo funciona el proceso |
| `/preguntas-frecuentes` | FAQ |
| `/agendar-asesoria` | Funnel de reserva (multi-paso) |
| `/sobre-las-llc` | Información sobre LLC |
| `/blog` | Listado de artículos |
| `/blog/:slug` | Artículo individual |
| `/legal/terminos` | Términos de servicio |
| `/legal/privacidad` | Política de privacidad |
| `/legal/cookies` | Política de cookies |
| `/legal/reembolsos` | Política de reembolsos |
| `/legal/disclaimer` | Aviso legal |
| `/booking/:id` | Gestión de reserva (reagendar/cancelar) |
| `/start` | Captura rápida de lead (noindex) |
| `/links` | Redirector de enlaces (noindex) |

Todas las rutas soportan prefijo de idioma: `/:lang/ruta` donde `lang ∈ {es, en, fr, de, pt, ca}`.

---

## API pública (`/api/*`)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/bookings/blocked-days` | GET | Fechas bloqueadas |
| `/api/bookings/config` | GET | Configuración de precio |
| `/api/bookings/available-slots` | GET | Horas disponibles por fecha |
| `/api/bookings/book` | POST | Crear reserva |
| `/api/bookings/reschedule/:id` | PATCH | Reagendar (token en query) |
| `/api/bookings/cancel/:id` | PATCH | Cancelar (token en query) |
| `/api/bookings/acknowledge/:id` | PATCH | Confirmar recepción |
| `/api/calculadora` | POST | Guardar resultado de calculadora |
| `/api/newsletter/subscribe` | POST | Suscribir al newsletter |
| `/api/newsletter/unsubscribe/:token` | POST | Desuscribir por token |
| `/api/visitor` | POST | Registro de visita/analítica |
| `/api/legal/documents/:type` | GET | Versión de documento legal |
| `/sitemap.xml` | GET | Sitemap multiidioma |
| `/robots.txt` | GET | Robots generado dinámicamente |
| `/api/health` | GET | Health check |

Rate limiting por IP en todos los endpoints.

---

## Internacionalización

- **Idiomas soportados:** `es` · `en` · `fr` · `de` · `pt` · `ca`
- **Framework:** i18next + react-i18next (carga diferida por idioma)
- **Carga:** Español carga síncrona al inicio; el resto se carga dinámicamente al cambiar idioma
- **Tipos generados:** `i18n/keys.generated.ts` (TypeScript type-safe keys)
- **Validación:** `npm run i18n:check` detecta claves faltantes y genera tipos
- **Blog:** Contenido por idioma en `data/blog-posts-content-{lang}.ts`
- **Emails:** Traducciones en `server/email-i18n.ts` (mismo conjunto de idiomas)

---

## Base de datos (7 tablas)

| Tabla | Propósito |
|-------|-----------|
| `leads` | Leads capturados (calculadora, formulario start) |
| `agenda` | Reservas de asesoría |
| `calculadora` | Resultados de la calculadora fiscal |
| `visitas` | Analytics de visitas y UTM |
| `newsletter_suscriptores` | Suscriptores al newsletter |
| `dias_bloqueados` | Fechas bloqueadas para reservas |
| `legal_document_versions` | Versiones de documentos legales |

---

## Seguridad

- **Cifrado de campos:** AES-256-GCM para teléfonos y datos sensibles (`field-encryption.ts`)
- **Rate limiting:** Por IP, configurable por endpoint (memoria o Redis vía `REDIS_URL`)
- **CSRF:** Validación de `Origin`/`Referer` en todas las mutaciones
- **Headers:** Helmet con CSP estricta
- **Sanitización:** DOMPurify en middleware automático + sanitización de input
- **Logging:** Structured logger con niveles (`logger.ts`)

---

## Variables de entorno requeridas

```env
DATABASE_URL=                      # PostgreSQL connection string
SITE_URL=                          # URL pública (ej. https://exentax.com)
GOOGLE_SERVICE_ACCOUNT_EMAIL=      # Para Calendar/Meet
GOOGLE_PRIVATE_KEY=                # Para Calendar/Meet
GMAIL_USER=                        # Email de envío
ADMIN_EMAIL=                       # Email de notificaciones internas
```

Opcionales:
```env
REDIS_URL=             # Si se omite, rate limiting en memoria
WHATSAPP_NUMBER=
CONTACT_EMAIL=
LEGAL_EMAIL=
```

---

## Scripts

```bash
npm run dev          # Servidor de desarrollo (Express + Vite HMR)
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run check        # TypeScript type check
npm run i18n:check   # Generar tipos + validar completitud i18n
npm run db:push      # Push del schema a la DB (development)
npm run db:generate  # Generar nueva migración
npm run db:migrate   # Aplicar migraciones
```

---

## Qué se eliminó y por qué

### Dependencias eliminadas

| Paquete | Motivo |
|---------|--------|
| `@aws-sdk/client-s3` + `lib-storage` | Sin integración de almacenamiento de ficheros |
| `bcryptjs` + `@types/bcryptjs` | Sin autenticación de admin ni portal de cliente |
| `multer` + `@types/multer` | Sin upload de ficheros en rutas públicas |
| `pdfkit` + `@types/pdfkit` | Sin generación de facturas ni PDFs |
| `sharp` | Sin procesado de imágenes |
| `ws` + `@types/ws` | Sin WebSockets directos |
| `bufferutil` | Lib de rendimiento para WebSockets no usados |

### Tablas eliminadas del schema y migración

| Tabla | Motivo |
|-------|--------|
| `admin_users` | Sin portal de administración |
| `clientes` | Sin portal de cliente |
| `llcs` / `llc_miembros` | Sin gestión de LLCs |
| `facturas` | Sin sistema de facturación |
| `pagos` | Sin procesado de pagos |
| `comisiones` | Sin tracking de comisiones |
| `documentos` | Sin almacenamiento de documentos |
| `emails` | Sin log de emails (no hay admin que los consulte) |
| `consentimientos` | Consentimientos ya integrados en `leads` y `agenda` |
| `legal_acceptances` | Sin portal de cliente que los gestione |
| `timeline` | Sin portal donde mostrarla |
| `tokens` | Sin autenticación de cliente |
| `login_attempts` | Sin autenticación de admin |
| `calendario_fiscal` | Sin motor de alertas fiscales |
| `alertas_fiscales` | Sin motor de alertas fiscales |
| `notificaciones` | Sin portal de cliente |
| `gastos_negocio` | Sin panel de gestión interno |
| `newsletter_campanas` | Sin panel de envío de campañas |
| `audit_logs` | Sin panel de admin que las consulte |
| `revoked_admin_sessions` | Sin autenticación de admin |

### Eliminado de i18n

- **Italiano:** Eliminado de `availableLanguage` en JSON-LD (`static.ts`) y del texto de contenido en `es.ts`, `en.ts`, `pt.ts` — el idioma italiano nunca estuvo implementado como locale soportado.

---

## Arquitectura

```
Usuario
  │
  ▼
Express 5 (Node.js)
  ├── Middleware: Helmet · Compression · CSRF · Sanitización · Rate Limit
  ├── Static: Vite build (React SPA) + assets
  ├── API: /api/* → routes/public.ts → storage/* → PostgreSQL
  └── HTML: SSR meta/SEO + SPA hydration
```

La aplicación es un proceso Node.js único que sirve tanto el frontend (SPA React compilado por Vite) como el backend (Express). El SEO crítico (meta tags, JSON-LD, canonical, sitemap) se inyecta server-side en cada request.
