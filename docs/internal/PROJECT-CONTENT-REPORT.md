# PROJECT-CONTENT-REPORT — Estructura completa contenido + diseño Exentax

**Fecha**: 2026-04-26
**Branch**: `main`
**Scope**: documentación operativa del contenido, secciones, newsletter,
sistema de diseño Exentax — para uso de redactores, diseñadores y agentes
que vayan a trabajar contenido o estructura.

---

## 1. NEWSLETTER — flujo completo

### 1.1 Captura (frontend)

**Componente**: `client/src/components/layout/Footer.tsx` (subscriptor en footer
fijo de todas las páginas).

**Trigger**: usuario rellena email en `<input>` del footer y pulsa "Suscribirme".

**Datos enviados**:
```ts
POST /api/newsletter/subscribe
{
  email: string,
  source: "footer",
  privacyAccepted: true,
  marketingAccepted: false,
  language: "es" | "en" | "fr" | "de" | "pt" | "ca"
}
```

### 1.2 Backend (`server/routes/public.ts:948-965`)

1. **Rate limit** por IP (`checkNewsletterRateLimit`) — silent rejection si excede.
2. **Validación zod** (`newsletterSubscribeSchema`).
3. **Privacy required**: si `privacyAccepted=false` → 400 `PRIVACY_REQUIRED`.
4. **Email normalizado** (lowercase + trim).
5. **`upsertNewsletterSubscriber`** en DB:
   - Genera `id = NS_<random>` y `unsubscribeToken = 24 bytes hex`
   - INSERT en tabla `newsletter_subscribers` con ON CONFLICT DO UPDATE
   - Detecta INSERT vs UPDATE vía PostgreSQL `xmax` system column (race-free)
6. **Discord notification** (`notifyNewsletterSubscribe` → canal `registros`)
   con email enmascarado (PII safe).
7. **Welcome email** solo si `subscriber.isNew === true` (idempotency
   guard — evita reenvío en submit duplicado).
8. **Consent log** en tabla `consent_log` (form_type=`newsletter_footer`)
   con `con_<id>` para cross-reference GDPR.

### 1.3 Welcome email (`server/email.ts:751-820`)

Subject + heading + 5 secciones (intro / aboutTitle+items / cadenceTitle /
practicalTitle / signoff) en 6 idiomas (`server/email-i18n.ts:257-334`).

Plantilla HTML con `heading()` + `paragraph()` + `bulletList()` reusables —
estilo brand minimal: tipografía Inter, color #0A0F0C texto + #00E510 brand.

### 1.4 Unsubscribe (`server/routes/public.ts:/api/newsletter/unsubscribe/:token`)

GET endpoint con token en URL → marca `unsubscribed_at = NOW()` en DB. Logs
con email enmascarado. Idempotente.

### 1.5 Storage (`shared/schema.ts:155-172`)

Tabla `newsletter_subscribers`:
```ts
{
  id: text PRIMARY KEY,
  email: text UNIQUE,
  name: text NULL,
  source: text NOT NULL,
  interests: text[] NULL,
  language: text NULL,
  privacy_version: text,
  unsubscribe_token: text UNIQUE,
  subscribed_at: timestamp,
  unsubscribed_at: timestamp NULL,
  ...
}
```

Indexes: `newsletter_email_idx`, `newsletter_unsub_token_idx`.

---

## 2. PÁGINAS DEL SITIO — inventario completo

Todas las páginas son lazy-loaded en `client/src/App.tsx`. 25 páginas total:

### 2.1 Públicas principales (16 rutas × 6 idiomas = 96 URLs)

| Página | File | Slug ES | Componentes / Secciones |
|---|---|---|---|
| **Home** | `pages/home.tsx` | `/` | Hero · BanksCarousel · Problem · ForWho · HowItWorks · Services · WhyUs · Origin · HomeFAQ |
| **Servicios** | `pages/services.tsx` | `/servicios` | Hero servicios + ServicesBelowFold (lazy) |
| **¿Qué es una LLC?** | `pages/about-llc.tsx` | `/que-es-una-llc` | Hero + secciones explicativas |
| **Cómo trabajamos** | `pages/how-we-work.tsx` | `/como-trabajamos` | Process steps + WhyUsSection |
| **FAQ** | `pages/faq-page.tsx` | `/preguntas-frecuentes` | 79 Q&A en 8 secciones via `faq-data.tsx` + JSON-LD FAQPage |
| **Reservar** | `pages/book.tsx` | `/agendar` | Form wizard 10 pasos + lazy BookingCalendar |
| **Booking detail** | `pages/booking.tsx` | `/booking/:id` | Cancel/reschedule/no-show ops |
| **Blog index** | `pages/blog/index.tsx` | `/blog` | Listado 112 artículos + filtros |
| **Blog post** | `pages/blog/post.tsx` | `/blog/:slug` | Render artículo + HOWTO Schema + atomic answer |
| **Pillar abrir LLC** | `pages/abrir-llc.tsx` | `/abrir-llc-estados-unidos` | GEO/AEO pillar (largo, autoritativo) |
| **Start** | `pages/start.tsx` | `/start` | Onboarding entry funnel |
| **Go (links hub)** | `pages/go.tsx` | `/go` | Hub de redes sociales |
| **404** | `pages/not-found.tsx` | — | Soft 404 with brand |

### 2.2 Servicios subpages (5 detalles × 6 idiomas = 30 URLs)

Todas usan template compartido `pages/services/ServiceSubpage.tsx` con
`i18nKey` namespace por estado:

| Estado | File | Slug ES | i18nKey |
|---|---|---|---|
| LLC New Mexico | `services/llc-new-mexico.tsx` | `/servicios/llc-nuevo-mexico` | `subpages.llcNm` |
| LLC Wyoming | `services/llc-wyoming.tsx` | `/servicios/llc-wyoming` | `subpages.llcWy` |
| LLC Delaware | `services/llc-delaware.tsx` | `/servicios/llc-delaware` | `subpages.llcDe` |
| **LLC Florida** | `services/llc-florida.tsx` | `/servicios/llc-florida` | `subpages.llcFl` |
| ITIN | `services/itin.tsx` | `/servicios/itin` | `subpages.itin` |

Cada subpage tiene 7 secciones de contenido en `client/src/i18n/data/subpages.ts`:
`cardKicker · cardTitle · cardDesc · breadcrumb · hero · intro · benefits ·
process · faq · cta` × 6 idiomas.

### 2.3 Legales (5 × 6 idiomas = 30 URLs)

| Página | File | Slug ES |
|---|---|---|
| Términos | `pages/legal/terms.tsx` | `/legal/terminos` |
| Privacidad | `pages/legal/privacy.tsx` | `/legal/privacidad` |
| Cookies | `pages/legal/cookies.tsx` | `/legal/cookies` |
| Reembolsos | `pages/legal/refunds.tsx` | `/legal/reembolsos` |
| Disclaimer | `pages/legal/disclaimer.tsx` | `/legal/disclaimer` |

Todas usan `LegalLayout.tsx` shared con estilo Liquid Glass (panel
`bg-[var(--bg-1)]/70` + `backdrop-blur-xl` + `border-subtle`).

---

## 3. SECCIONES HOME — detalle componente por componente

`client/src/components/sections/`:

| Sección | File | Tamaño | Propósito |
|---|---|---|---|
| **Hero** | `Hero.tsx` | — | Title + subtitle + CTAs (calc + agendar) + HeroStats inline |
| **HeroStats** | `HeroStats.tsx` | — | 4 contadores animados (clientes, países, ahorro, años) |
| **BanksCarousel** | `BanksCarousel.tsx` | — | Logos Mercury/Relay/Wise/Stripe scroll horizontal |
| **Problem** | `Problem.tsx` | — | "El problema del autónomo en España" — pain framing |
| **ForWho** | `ForWho.tsx` | — | 4 perfiles target (freelancer / agencia / SaaS / e-commerce) + WhatsApp CTA |
| **HowItWorks** | `HowItWorks.tsx` | — | 4 pasos del proceso (consulta → estructura → constitución → operación) |
| **Services** | `Services.tsx` | — | Grid de 5 servicios (4 estados LLC + ITIN) con cards |
| **WhyUs** | `WhyUs.tsx` | — | 3-4 razones diferenciadoras (banca, fiscal, soporte, no precio fijo) |
| **Origin** | `Origin.tsx` | — | Story de Exentax como equipo experto |
| **HomeFAQ** | `HomeFAQ.tsx` | — | Top 8 preguntas frecuentes con `FaqAccordionList.tsx` |
| **FAQ** (page) | `FAQ.tsx` + `faq-data.tsx` | — | 79 Q&A en 8 secciones para `/preguntas-frecuentes` |
| **Testimonials** | `Testimonials.tsx` | — | 3 testimonios con rating 5★ (Trustpilot) |
| **AccordionItem** | `AccordionItem.tsx` | — | Primitivo reusable para FAQ |
| **ExistingLlcCallout** | `ExistingLlcCallout.tsx` | 134KB | Lazy callout para usuarios con LLC ya constituida (en abrir-llc) |

---

## 4. LAYOUT — chrome común

`client/src/components/layout/`:

| Componente | File | Función |
|---|---|---|
| **Layout** | `Layout.tsx` | Shell global (Navbar + main + Footer + FloatingWhatsApp) |
| **Navbar** | `Navbar.tsx` | Top nav con logo (600×110) + idiomas + agendar CTA |
| **NavbarFunnel** | `NavbarFunnel.tsx` | Variant del navbar para `/start`, `/agendar` (sin links de página) |
| **Footer** | `Footer.tsx` | 4 columnas: Empresa · Servicios · Recursos · Newsletter |
| **FloatingMobileCTA** | `FloatingMobileCTA.tsx` | Botón flotante mobile (bottom-fixed) |
| **FloatingWhatsApp** | `FloatingWhatsApp.tsx` | Burbuja WhatsApp fixed bottom-right |
| **LegalLayout** | `LegalLayout.tsx` | Wrapper Liquid Glass para legales |

---

## 5. SISTEMA DE DISEÑO EXENTAX

### 5.1 Tokens de color (`client/src/index.css:103-127`)

```css
/* Backgrounds (tema crema/light único) */
--bg-0: #F8F7F4;        /* Background principal */
--bg-1: #F0EEE9;        /* Cards / panels */
--bg-2: #E8E5DF;        /* Hover state */
--bg-input: #EDEAE4;    /* Input fields */

/* Borders */
--border: #D5D9D6;
--border-subtle: rgba(0,0,0,0.05);
--border-active: rgba(0,229,16,0.35);

/* BRAND green (228 ocurrencias en codebase) */
--green: #00E510;
--green-rgb: 0, 229, 16;
--green-hover: #00D10E;
--green-soft: rgba(0,229,16,0.07);
--green-glow: rgba(0,229,16,0.16);
--ring-green: rgba(0,229,16,0.20);

/* Text */
--text-1: #0A0F0C;      /* Primario (headings, body fuerte) */
--text-2: #1E2B24;      /* Body normal */
--text-3: #4A5C52;      /* Secundario / metadata */
--muted: #7A8C83;       /* Labels / hints */

/* Estados */
--success: #2BB50E;
--warning: #C98A00;
--error: #DC2626;
--info: #2563EB;
```

**Brand color**: `#00E510` — verde neón Exentax. Único accent color.
Usado en: CTAs primarios, links, brand highlights, focus rings, success
states. Discord embeds enforcement: 23 embeds × 1 color via
`test:discord-neon`.

### 5.2 Tipografía (NO MONOSPACE)

**Familias** (`tailwind.config.ts:106-112`):
```ts
fontFamily: {
  heading: ['"Space Grotesk"', 'sans-serif'],   // H1-H6
  body:    ['"Inter"', 'sans-serif'],            // Body text, párrafos
  button:  ['"Inter"', 'sans-serif'],            // CTAs
  mono:    ['"Inter"', 'sans-serif'],            // ⚠️ NO real monospace - mapeado a Inter
  sans:    ['"Inter"', 'sans-serif'],            // Default
}
```

**Carga** (`client/index.html:87-91`):
- `<link preload>` ambas Space Grotesk + Inter desde Google Fonts
- `<link stylesheet>` con `display=swap` (FOUT prevention)
- Pesos cargados: Space Grotesk 500/600/700; Inter italic + 400/500/600/700

**Política mono**: la className `font-mono` en Tailwind mapea a Inter.
**Solo el archivo `index.css:818-826`** define estilo para `<code>` con
font-family `"Inter", sans-serif` (post-fix 2026-04-26 — antes tenía
fallback a `ui-monospace, "SF Mono"...` que no se renderizaba porque no hay
`<code>` en blog content). Resultado: **NO hay monoespacio renderizado en
ninguna parte del sitio**.

**className `font-mono`** aparece en review-anchor blocks de algunos
artículos blog (`<span class="font-mono">150 %</span>`) — render como Inter.

### 5.3 Tokens de radio + sombra

```css
--radius-xs: 8px;        /* Inputs, badges */
--radius-sm: 12px;       /* Botones secundarios */
--radius: 16px;          /* Cards, panels */
--radius-lg: 24px;       /* Hero cards, modales */
--radius-xl: 32px;       /* Containers grandes */
--radius-full: 9999px;   /* Pills, botones primarios circulares */

--shadow-xs: 0 1px 2px rgba(0,0,0,0.04);
--shadow-sm: 0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03);
--shadow:    0 4px 20px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04);
```

### 5.4 Patrones visuales

- **Sección spacing**: `py-[var(--section-gap)]` (~60-80px) entre secciones.
- **Container max**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Grid responsive**: 1 col mobile (default) / 2 cols `md:` / 3 cols `lg:`.
- **Liquid Glass** (legales): `bg-[var(--bg-1)]/70 backdrop-blur-xl border
  border-[var(--border-subtle)] rounded-[20px]`.
- **CTA primario**: pill rounded-full + bg `#00E510` + text `#0A0F0C` + hover
  `#00D10E`.
- **CTA secundario**: pill rounded-full + bg transparente + border
  `--border` + hover `--bg-2`.

### 5.5 Iconos

`client/src/components/icons.tsx` — set custom SVG inline (no react-icons,
no emojis). Stroke dorado `#0B0D0C` con `strokeWidth=3.2 strokeLinecap=round
strokeLinejoin=round`. Iconos: CalendarIcon, ClockCircleIcon, VideoIcon,
ArrowLeftIcon, CalendarXIcon, CheckCircleIcon, XCircleIcon, SpinnerIcon,
PhoneIcon, etc.

---

## 6. RESUMEN NUMÉRICO

- **25 páginas** lazy-loaded en App.tsx
- **15 secciones** reusables en `components/sections/`
- **7 componentes layout** (Navbar, Footer, etc.)
- **6 idiomas** (es/en/fr/de/pt/ca) — 1554 keys i18n
- **112 artículos blog** × 6 idiomas = 672 ficheros
- **228 ocurrencias** del brand color `#00E510`
- **2 fuentes brand**: Space Grotesk (headings) + Inter (todo lo demás)
- **0 monoespaciado** real renderizado en cualquier superficie del sitio

---

## 7. PARA TRABAJAR CONTENIDO

**Contenido textual** vive en:
- `client/src/i18n/locales/<lang>.ts` — UI strings (1554 keys × 6)
- `client/src/i18n/data/subpages.ts` — contenido subpages servicios (5 × 6)
- `client/src/data/blog-content/<lang>/<slug>.ts` — blog markdown (672 files)
- `client/src/data/blog-i18n/<lang>.ts` — meta blog por idioma
- `client/src/data/blog-posts.ts` — manifest ES (origen)
- `client/src/data/blog-posts-slugs.ts` — slug mappings 6 langs
- `server/email-i18n.ts` — copy emails 7 plantillas × 6 idiomas

**Estructura/diseño** vive en:
- `client/src/index.css` — tokens + componentes globales
- `tailwind.config.ts` — fontFamily + colors extendidos
- `client/src/components/sections/*.tsx` — secciones home/servicios
- `client/src/pages/*.tsx` — composición de secciones por página
- `client/src/components/layout/*.tsx` — chrome (Navbar, Footer)

**Reglas de diseño** documentadas en:
- `docs/internal/AGENT-RULES.md` (501 líneas) — regla nº 1, brand, idiomas
- `docs/internal/STACK.md` — stack actualizado + §4.5 contact channels
- `docs/internal/REVISION-TOTAL-REPORT.md` — baseline 2026-04-26
- `docs/internal/INVENTORY.md` — mapa rutas / componentes / endpoints
- Este documento (`PROJECT-CONTENT-REPORT.md`)
