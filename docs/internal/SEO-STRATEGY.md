# SEO Strategy — Exentax Web

Estrategia SEO, keywords por mercado y estado actual del posicionamiento.
Este documento se actualiza en cada ciclo de auditoría.

Última revisión: 2026-04-22.

---

## 1. Buyer persona

- Freelancer / agente solo / micro-empresa digital con clientes **fuera** de su
  país de residencia, facturación 30 k-250 k €/año.
- Dolor principal: cuota fija de autónomo + IRPF elevado + complejidad
  regulatoria local (Modelo 720, IVA intracomunitario, etc.).
- Palabras clave que escribe en Google: `cuánto paga un autónomo`,
  `alternativa autónomo`, `facturar sin ser autónomo`, `LLC España`,
  `cómo no pagar cuota autónomo`.

---

## 2. Keywords objetivo por mercado

### 🇪🇸 España (es-ES)

| Intent | Primary keyword | Secondary / long-tail |
|---|---|---|
| Informacional alto | `alternativa autónomo` | `cómo dejar de ser autónomo`, `facturar sin autónomo legal` |
| Comercial alto | `LLC España` | `constituir LLC Estados Unidos`, `LLC Nuevo México España` |
| Transaccional | `cuota autónomo 2026` | `cuotas autónomos 2026 tramos`, `cuánto paga un autónomo 2026` |
| Regulatorio | `Modelo 720` | `declaración bienes extranjero`, `cuenta bancaria extranjero` |
| Fiscal | `tramos IRPF 2026` | `IRPF LLC extranjera` |

### 🇫🇷 Francia (fr-FR)

| Intent | Primary keyword | Secondary / long-tail |
|---|---|---|
| Informacional | `alternative auto-entrepreneur` | `freelance sans cotisations` |
| Comercial | `créer LLC États-Unis` | `LLC Nouveau-Mexique`, `LLC Wyoming France` |
| Regulatorio | `cotisations URSSAF 2026` | `auto-entrepreneur vs SASU` |

### 🇩🇪 Alemania / Austria (de-DE)

| Intent | Primary keyword | Secondary / long-tail |
|---|---|---|
| Informacional | `LLC gründen USA` | `Alternative Selbstständiger` |
| Comercial | `US LLC Deutschland` | `Freiberufler Steuern optimieren` |
| Regulatorio | `Sozialversicherung Selbstständige 2026` | `Gewerbe vs Freiberufler` |

### 🇵🇹 Portugal (pt-PT)

| Intent | Primary keyword | Secondary / long-tail |
|---|---|---|
| Informacional | `alternativa trabalhador independente` | `recibos verdes 2026` |
| Comercial | `LLC Estados Unidos Portugal` | `LLC Novo México Portugal` |
| Regulatorio | `Segurança Social trabalhador independente 2026` | `NHR regime Portugal` |

### 🇬🇧🇺🇸 Internacional (en-US)

| Intent | Primary keyword | Secondary / long-tail |
|---|---|---|
| Informacional | `LLC for non-resident` | `best state LLC non-resident` |
| Comercial | `how to start LLC from Spain` | `New Mexico LLC for foreigners` |
| Regulatorio | `Form 5472 non-resident LLC` | `BOI Report LLC foreign owner` |

### 🇪🇸 Catalunya (ca-ES)

Reutiliza keywords españolas en catalán: `alternativa autònom`, `LLC Estats Units`,
`tramos IRPF 2026 catalán`.

---

## 3. Meta tag templates (por tipo de página)

### Homepage

```
<title>Deja de pagar cuota de autónomo · LLC USA | Exentax</title>
<meta name="description" content="Constituye tu LLC en EE.UU. desde 2.000 € con Exentax. Adiós cuota autónomo, hola banca Mercury/Wise/Stripe. Consulta gratuita online.">
```

Longitud objetivo: `title` 50-60 chars · `description` 150-160 chars.

### Service page (ej. LLC Nuevo México)

```
<title>LLC Nuevo México para no residentes | Exentax</title>
<meta name="description" content="Constituye tu LLC en Nuevo México desde 2.000 €: privacidad, 0 % impuesto estatal y 200 $ anuales. ITIN incluido. Empieza hoy.">
```

### Blog article

```
<title>{Keyword natural orientada a beneficio} | Exentax</title>
<meta name="description" content="{Promesa + dato concreto + CTA implícito}. Guía 2026 con tabla oficial, casos prácticos y fuentes verificables.">
```

---

## 4. Schema markup en producción

| Tipo | Dónde | Verificado |
|---|---|---|
| `WebPage` + `Organization` | Home | ✓ |
| `Service` | Cada subpágina de servicios (ITIN, LLC-*) | ✓ |
| `FAQPage` | FAQ page + cada service subpage + cada artículo con bloque FAQ | ✓ |
| `BlogPosting` | Cada artículo de blog | ✓ |
| `BreadcrumbList` | Todas las páginas con breadcrumbs | ✓ |
| `AggregateRating` + `Review[]` | Home (Trustpilot) | ✓ |

Canonical + hreflang bidireccional 6 idiomas + x-default → español emitidos por
`client/src/components/SEO.tsx` en el client y replicados en los sitemaps
server-side (`sitemap-pages.xml`, `sitemap-blog.xml`, `sitemap-faq.xml`) con la
matriz completa 6×6.

---

## 5. Sitemap

Índice + 3 child sitemaps:

- `/sitemap.xml` → índice.
- `/sitemap-pages.xml`: home (priority 1.0, weekly) + 7 servicios (0.9, monthly)
  + legales (0.4, yearly) × 6 idiomas.
- `/sitemap-blog.xml`: 111 posts × hasta 6 idiomas (fallback a ES si no hay
  traducción). Priority 0.7-0.8.
- `/sitemap-faq.xml`: FAQ page × 6 idiomas (0.7, monthly).

Cache TTL 1 h. Detección de cambio por SHA-256 del XML antes de pinguear a
Google Search Console / IndexNow (`server/sitemap-ping.ts`).

---

## 6. Robots.txt

- `Allow`: todos los prefijos de idioma (`/es/`, `/en/`, ...) y los sitemaps.
- `Disallow`: `/api/`, `/internal/`, `/booking/`, `/start`, `/go/`, `/links`,
  `/thank-you`, `/preview/`, `/staging/`, `/dev/`, `/__mockup/`.
- Query-string cleanup: `?ref=`, `?utm_*`, `?gclid`, `?fbclid`, `?mc_*` (evitar
  duplicate content indexado).
- Declara los 4 sitemaps.

---

## 7. Internal linking

Mínimo recomendado por artículo: **3 enlaces internos** a páginas relevantes.
Actualmente:

- `scripts/seo-check-links.mjs` comprueba que los 111 artículos tienen ≥ 3
  enlaces entrantes y 0 enlaces rotos. Estado: ✓ al 2026-04-22.
- Anchor text descriptivo con keyword (no "haz clic aquí", no "saber más" —
  ver `TRANSLATION-GUIDE.md §5`).

---

## 8. Core Web Vitals — objetivo

- **LCP** < 2.5 s
- **FID** (INP) < 100 ms (ó 200 ms INP)
- **CLS** < 0.1

Estado actual: **sin medición live en esta sesión**. Ver `PENDING.md §12`
(Lighthouse CI pendiente).

Optimizaciones ya aplicadas:
- Code splitting por ruta (wouter + React.lazy en páginas pesadas).
- `blog-posts-slugs` y `blog-posts-content` cargados dinámicamente sólo desde
  `SEO.tsx` cuando se monta en una blog post.
- Imágenes servidas en WebP desde `client/public/`.
- `rollup-plugin-visualizer` en `vite.config.ts` para auditar el bundle.
- `audit-bundle.mjs` notifica a Discord si un commit infla > baseline.

---

## 9. IndexNow + Google Indexing API

- IndexNow: clave configurada vía `INDEXNOW_KEY`. Ping automático al publicar
  un artículo nuevo (hash SHA-256 del sitemap indica cambio real).
- Google Indexing API: opt-in, cuota respetada. Sólo pinga **nuevos** artículos
  para no agotar el quota diario (200 URLs/día por cuenta).
- Google Search Console: sitemap enviado manualmente la primera vez; re-envíos
  automáticos en cada deploy.

---

## 10. X-Robots-Tag por ruta

- Páginas principales, servicios, blog, FAQ, legales → `index, follow`.
- `/go/*`, `/start`, `/links`, `/booking/*`, `/api/*` → `noindex, nofollow`.
- Configurado en `server/routes/public.ts` vía middleware.

---

## 11. Monitorización y próximos pasos

Ver `PENDING.md §§ 3, 6, 12, 13` para:
- Verificación live CI (sandbox timed out en `seo:slash`).
- Redirects 301 legacy (si aplica).
- Lighthouse CI bloqueante.
- Performance budgets duros.
