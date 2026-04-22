# Exentax — Auditoría SEO, Analítica e Indexación

Fecha: 2026-04-17

## 1. Resumen ejecutivo

Se realizó una auditoría avanzada de la capa de Analítica (GA4 / GTM / Consent
Mode v2 / Meta Pixel), Search Console, indexación (sitemap, robots, hreflang,
canonical) y mapa de eventos clave para Exentax. Se detectaron y corrigieron
los siguientes problemas:

1. **Doble carga de GA4** (gtag directo + GTM en paralelo) → causaba dos
   `page_view` por cada navegación SPA y duplicación de eventos.
2. **Esquema de eventos inconsistente**: las acciones críticas (booking,
   calculadora, WhatsApp) se reportaban con nombres genéricos
   (`form_submit`, `outbound_link`) sin parámetros estandarizados.
3. **Falta de `noindex`** en la página de administración interna
   `/admin/agenda/:bookingId`.

Estado tras la auditoría: **una sola capa de tracking activa (gtag GA4),
5 eventos clave estandarizados con parámetros comunes, y todas las rutas
internas marcadas como `noindex` y excluidas del sitemap y robots.**

## 2. Capa de tracking — antes / después

| Aspecto                         | Antes                                | Después                                  |
|---------------------------------|--------------------------------------|------------------------------------------|
| GA4                             | Carga vía gtag *y* GTM (duplicado)   | gtag directo (`gtag.js?id=GA4_ID`)       |
| GTM                             | Cargado si `VITE_GTM_ID` definido    | Eliminado del cliente                    |
| Consent Mode v2                 | Default denied + update on accept    | Sin cambios (correcto)                   |
| `page_view`                     | Doble disparo por navegación         | Único disparo, con de-dup vía `useRef`   |
| `send_page_view` en `config`    | `true` (auto)                        | `false` — controlado manualmente por SPA |
| Meta Pixel                      | Solo si consent total                | Sin cambios                              |
| `cookie_flags`                  | No definido                          | `SameSite=Lax;Secure`                    |

Archivo principal: `exentax-web/client/src/components/Tracking.tsx`.

### Consentimiento

- Defaults `denied` para `analytics_storage`, `ad_storage`,
  `ad_user_data`, `ad_personalization`.
- `wait_for_update: 500 ms` antes de procesar la cola.
- Al aceptar el banner se llama `gtag('consent', 'update', { ...granted })` y
  se inicializa GA4 / Meta Pixel (lazy).
- Al revocar, se llama `update` con `denied` para frenar el envío de hits.

## 3. Esquema de eventos clave (5)

Todos los eventos se enriquecen automáticamente con:

- `location`: `window.location.pathname` (ruta actual)
- `language`: idioma activo de i18n (`es | en | fr | de | pt | ca`)

| Evento               | Disparado en                                                                      | Parámetros principales                                                                  |
|----------------------|------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| `booking_completed`  | Confirmación exitosa en `BookingCalendar`                                          | `form_name`, `date`, `start_time`, `monthly_profit`, + `location`, `language`            |
| `cta_click`          | CTAs internos clave (Hero, hero links, etc.) vía `trackCTA(name, dest)`            | `cta_name`, `link_url`, + `location`, `language`                                         |
| `calculator_used`    | Envío válido de la calculadora en `client/src/components/calculator/index.tsx`     | `country`, `regime`, `activity`, `monthly_income`, `annual_income`, `effective_rate`, `savings` |
| `form_submit`        | Newsletter footer (`newsletter_footer`) y otros formularios genéricos              | `form_name`, + `location`, `language`                                                    |
| `whatsapp_click`     | Cualquier link de WhatsApp (Navbar, Floating, Hero, Footer, Booking, etc.)         | `cta_location` (p.ej. `hero`, `floating`, `navbar`, `footer_contact`, `booking_success`), + `location`, `language` |

Helpers exportados:

```ts
trackCTA(ctaName, destination?)
trackFormSubmit(formName, params?)
trackWhatsAppClick(location, params?)
trackBookingCompleted(params?)
trackCalculatorUsed(params?)
trackEvent(name, params?)   // genérico
```

### Cobertura `whatsapp_click`

| Ubicación                                          | `cta_location`        |
|----------------------------------------------------|-----------------------|
| Navbar desktop                                     | `navbar`              |
| Navbar mobile                                      | `navbar_mobile`       |
| Botón flotante                                     | `floating`            |
| Hero (home)                                        | `hero`                |
| Footer (icono social)                              | `footer_social`       |
| Footer (contacto)                                  | `footer_contact`      |
| BookingCalendar — formulario                       | `booking_form`        |
| BookingCalendar — pantalla de éxito                | `booking_success`     |
| WhyUs                                              | `why_us`              |
| HowItWorks                                         | `how_it_works`        |
| ForWho (top / bottom)                              | `for_who_top`, `for_who_bottom` |
| CalculatorResults                                  | `calculator_results`  |
| services.tsx (hero / renewal / cta)                | `services_hero`, `services_renewal`, `services_cta` |
| about-llc.tsx                                      | `about_llc_hero`      |
| blog/post.tsx                                      | `blog_post_cta`       |
| how-we-work.tsx (hero / fase 1)                    | `how_we_work_hero`, `how_we_work_phase1` |
| go.tsx (`/links`)                                  | `links_page`          |
| start.tsx (hero / decisión)                        | `start_hero`, `start_decision` |

> Todas las anclas de WhatsApp del sitio emiten ahora `whatsapp_click` con un
> `cta_location` único; el helper `trackOutboundLink` permanece disponible
> solo para enlaces externos no-WhatsApp.

## 4. Indexación

### 4.1 `noindex, nofollow` (rutas internas)

Vía `<SEO noindex />`:

- `/start` (start.tsx)
- `/go`, `/links` y `/{lang}/links` (go.tsx)
- `/booking/...` (booking.tsx)
- `/not-found` (not-found.tsx)
- `/admin/agenda/:bookingId` (agenda.tsx) — **añadido en esta auditoría**

### 4.2 `robots.txt` (`/robots.txt`)

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /links
Disallow: /start
Disallow: /booking/
Disallow: /*?ref=
Disallow: /*?utm_source=
Disallow: /*?utm_medium=
Disallow: /*?utm_campaign=
Disallow: /*?utm_term=
Disallow: /*?utm_content=
Disallow: /*?gclid=
Disallow: /*?fbclid=
Disallow: /*?mc_cid=
Disallow: /*?mc_eid=
Sitemap: https://exentax.com/sitemap.xml
```

### 4.3 `sitemap.xml` (`/sitemap.xml`)

Solo rutas SEO (sin `start`, `links`, `booking`, `admin`, `api`), generadas en
los 6 idiomas con `<xhtml:link rel="alternate" hreflang="...">` para cada uno
+ `x-default` apuntando al ES:

- `/` (home)
- `/{lang}/services` (precios)
- `/{lang}/how-we-work`
- `/{lang}/llc-us`
- `/{lang}/faq`
- `/{lang}/book`
- `/{lang}/legal/{terms,privacy,cookies,refunds,disclaimer}`
- `/{lang}/blog` y `/{lang}/blog/{slug}` (publicados)

Cache: 1h en memoria.

### 4.4 Canonical y hreflang

`SEO.tsx` genera, para páginas indexables:

- `<link rel="canonical" href="https://exentax.com{ruta-canónica-en-su-idioma}">`
- Una etiqueta `<link rel="alternate" hreflang="{lang}">` por cada idioma soportado.
- `<link rel="alternate" hreflang="x-default">` apuntando al ES.
- `<meta name="robots" content="index, follow">` (o `noindex, nofollow` si la
  página está marcada).

En páginas con `noindex`, el bloque hreflang/canonical se omite, lo que evita
señales contradictorias a Google.

## 5. Recomendaciones para Search Console

1. **Reenviar el sitemap** (`https://exentax.com/sitemap.xml`) tras el
   despliegue.
2. **Inspeccionar URLs internas** (`/start`, `/links`, `/booking/*`,
   `/admin/agenda/*`) y verificar que aparezcan como
   *Excluida por la etiqueta noindex*.
3. **Marcar como obsoletas** en Search Console las URLs ya cacheadas con
   parámetros UTM (la nueva regla `Disallow: /*?utm_*=` lo previene a futuro).
4. **GA4 → DebugView**: validar que ahora aparezca un único `page_view` por
   navegación y que los 5 eventos clave traigan los parámetros `location` y
   `language`.
5. **Marcar como conversión** en GA4: `booking_completed` (principal),
   `calculator_used`, `whatsapp_click`, `form_submit` (si aplica),
   `cta_click` (opcional).
6. **Crear audiencias** segmentadas por `language` para ver desempeño por idioma
   sin necesidad de filtrar por path.

## 6. Archivos modificados

- `exentax-web/client/src/components/Tracking.tsx` (reescrito)
- `exentax-web/client/src/components/sections/Hero.tsx`
- `exentax-web/client/src/components/layout/FloatingWhatsApp.tsx`
- `exentax-web/client/src/components/layout/Navbar.tsx`
- `exentax-web/client/src/components/layout/Footer.tsx`
- `exentax-web/client/src/components/BookingCalendar.tsx`
- `exentax-web/client/src/components/calculator/index.tsx`
- `exentax-web/client/src/pages/admin/agenda.tsx`

## 7. No se han modificado

- `exentax-web/server/routes/public.ts` — `sitemap.xml` y `robots.txt` ya
  cumplen los requisitos (verificado).
- `exentax-web/client/src/components/SEO.tsx` — canonical/hreflang/noindex
  correctos (verificado).
- `exentax-web/client/src/components/CookieBanner.tsx` — Consent Mode v2
  correcto.
