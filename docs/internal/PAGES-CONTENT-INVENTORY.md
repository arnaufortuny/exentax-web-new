# PAGES-CONTENT-INVENTORY — Inventario contenido página por página (excluyendo blog)

**Fecha**: 2026-04-26 · 13 páginas públicas + 5 service subpages + 5 legales
**Para reconstrucción**: contenido + diseño + i18n keys + componentes consumidos

---

## 1. HOME — `pages/home.tsx`

**i18n namespace**: `hero.*`, `problem.*`, `forWho.*`, `howItWorks.*`,
`services.*`, `whyUs.*`, `origin.*`, `homeFaq.*`

**Secciones renderizadas (en orden)**:

| # | Componente | Contenido | i18n keys |
|---|---|---|---|
| 1 | `<Hero />` | H1 + H1Green (split visual) + subtitle + CTAs (calc + WhatsApp + agendar) | `hero.h1`, `hero.h1Green`, `hero.subtitle`, `hero.cta`, `hero.talkToUs`, `hero.whatsappMsg` |
| 2 | `<HeroStats />` (inline en Hero) | 4 contadores animados | `heroStats.clientsLabel`, `heroStats.countriesLabel`, `heroStats.savingsLabel`, `heroStats.yearsLabel` |
| 3 | `<BanksCarousel />` | Logos Mercury / Relay / Wise / Stripe scroll horizontal | `banks.title` |
| 4 | `<Problem />` | Pain framing autónomo: 3 problems list + 3 solutions + 3 cards + 4 stats | `problem.problems[]`, `problem.solutions[]`, `problem.cards[]`, `problem.stat1-4` |
| 5 | `<ForWho />` | 4 perfiles target (freelancer / agencia / SaaS / e-commerce) + WhatsApp CTA | `forWho.label`, `forWho.profiles[]` |
| 6 | `<HowItWorks />` | 4 pasos del proceso: consulta → estructura → constitución → operación | `howItWorks.steps[]` |
| 7 | `<Services />` | Grid 5 servicios cards (NM / WY / DE / FL / ITIN) | `services.cards[]` |
| 8 | `<WhyUs />` | 3-4 razones diferenciadoras Exentax | `whyUs.cards[]` |
| 9 | `<Origin />` | Story de Exentax como equipo experto | `origin.title`, `origin.paragraphs[]` |
| 10 | `<Testimonials />` (lazy) | 3 testimonios 5★ + Trustpilot link | `testimonials.cards[]` |
| 11 | `<HomeFAQ />` | Top 8 preguntas frecuentes acordeón | `homeFaq.questions[]` |

---

## 2. SERVICIOS — `pages/services.tsx`

**i18n namespace**: `serviciosPage.*`, `precios.*`

**Secciones**:

| # | Sección | Contenido |
|---|---|---|
| 1 | `<PreciosHero />` | H1 + H2green split + subtitle + 2 CTAs (agendar + WhatsApp) |
| 2 | `<ServicesBelowFold />` (lazy) | Tabla comparativa de precios + features por plan + FAQs específicas servicios + secciones below-fold |

**Notas**: lazy-loaded para optimizar above-fold paint.

---

## 3. ABRIR LLC (Pillar) — `pages/abrir-llc.tsx`

**i18n namespace**: `abrirLlcPage.*` (pero contenido HARDCODED en TS por ahora — pendiente i18n)

**Estructura content** (definida en TS local en 6 idiomas, ~750 líneas):

| Sección | Contenido |
|---|---|
| **Hero** | Kicker "GUÍA DEFINITIVA" + H1 + H2 verde + subtitle + 2 CTAs |
| **What is LLC** | Kicker "QUÉ ES" + H2 + paragraphs explicativos |
| **Steps** (proceso 7 pasos) | 1. Elegir estado (NM/WY/DE/FL) · 2. Reservar nombre + Registered Agent · 3. Articles of Organization · 4. Operating Agreement · 5. EIN ante IRS · 6. Cuenta bancaria operativa · 7. BOI Report FinCEN |
| **States** | 4 cards: NM ($50/año más barato y privado) · WY (privacidad reforzada) · DE (prestigio venture capital) · FL (útil si pasas tiempo en EE.UU.) |
| **Costs** | Tabla con rows label/value: Constitución (year 1), Mantenimiento (yearly), Registered Agent, BOI Report, etc. |
| **Compliance** | Calendario anual (Form 5472, BOI, Annual Report state, etc.) |
| **Banking** | Mercury / Wise / Relay / Slash explicación |
| **Tax residence** | Atribución de rentas + DGT V0290-20 + países de residencia |
| **Existing LLC callout** (lazy 134KB) | Para usuarios con LLC ya constituida |
| **CTA final** | Agendar consulta gratuita |

---

## 4. ABOUT LLC — `pages/about-llc.tsx`

**i18n namespace**: `llcUsPage.*`

**Secciones**:

| # | Contenido | i18n keys |
|---|---|---|
| Hero | H1 + heroTitleAccent verde + subtitle + heroDesc + 2 CTAs (agendar + WhatsApp) | `llcUsPage.heroTitle`, `heroTitleAccent`, `heroSubtitle`, `heroDesc`, `heroCta`, `heroWhatsapp`, `heroWhatsappMsg` |
| Sections explicativas | (estructura más simple, principalmente texto) | `llcUsPage.section[]` |

SEO: `llcUsPage.seoTitle`, `seoDesc`, `ogTitle`, `ogDesc`, `seoKeywords`, `breadcrumb`.

---

## 5. CÓMO TRABAJAMOS — `pages/how-we-work.tsx`

**i18n namespace**: `comoFunciona.*`, `comoFuncionaPage.*`

**Sub-componentes y secciones**:

| Sección | Componente | Contenido |
|---|---|---|
| Hero | `ProcessHero` | H1 + H2green + subtitle + CTA |
| Phases intro | `PhasesIntro` | Texto introductorio del proceso |
| Phases timeline | `PhasesTimeline` | Timeline visual con TimelineNode por fase. Vertical desktop / horizontal mobile (`MobileTimelineNode`) |
| WhyUs | `WhyUsSection` | 3 cards: DirectContact / ResidenciaFiscal / Transparencia (con interface `WhyUsCard`) |
| What we don't do | `WhatWeDoNotSection` | Lista de servicios que Exentax NO ofrece (transparencia + filtro de leads no-fit) |

Helper components:
- `<CheckItem />` — bullet con checkmark
- `<XIcon />` — bullet con X
- `<NeonCard />` — card con borde neón verde
- `DirectContactIcon`, `ResidenciaFiscalIcon`, `TransparenciaIcon` — SVG inline custom

---

## 6. FAQ — `pages/faq-page.tsx`

**i18n namespace**: `faqData.*`, `faqPage.*`

**Estructura** (`components/sections/faq-data.tsx`):

8 secciones × ~10 preguntas = **79 Q&As totales**:

1. **about_** — "¿Qué es Exentax?" (8 preguntas: about_0..7)
2. **fit_** — "¿Es Exentax para mí?" (5 preguntas: fit_0..4)
3. **llc_** — "Sobre la LLC" (12 preguntas: llc_0..11)
4. **process_** — "Sobre el proceso" (~10 preguntas)
5. **banking_** — "Banca con LLC" (~10 preguntas)
6. **fiscal_** — "Fiscalidad" (~10 preguntas)
7. **legal_** — "Compliance legal" (~10 preguntas)
8. **soporte_** — "Soporte ongoing" (~10 preguntas)

Cada pregunta es `t("faqData.questions.<id>")` y respuesta vía `r("<id>")` que renderiza markdown.

JSON-LD `FAQPage` schema emitido automáticamente desde Q/A tree (verificado por `seo-faq-jsonld-check.mjs`).

---

## 7. AGENDAR (Reservar) — `pages/book.tsx`

**i18n namespace**: `reservar.*`

**Form wizard 5 pasos** (con state: `step` 0-4):

| Paso | Campos | Validación |
|---|---|---|
| **0** Actividad | actividad (10 opciones), actividadOtra (si "otra"), facturacion (rangos) | actividad + facturacion required |
| **1** Situación | situacion (autónomo/SL/cripto/empleado/otro), beneficioNeto, clientesInternacionales (yes/no), operaDigital (yes/no), compromiso (yes obligatorio) | todos required |
| **2** Inversión | inversion (rangos), inicio (cuándo) | ambos required |
| **3** Calendario | Lazy load `BookingCalendar` (slot picker) | Slot seleccionado |
| **4** Contacto + envío | nombre, email, teléfono, notas + privacy/terms accept | privacy required |

**Helpers**: `<SelectionCard />` (cards seleccionables), `<StepDots />` (progress dots visuales).

**Submit**: builds `prefilledContext` con todas las respuestas del wizard como mensaje al backend → POST `/api/booking`.

---

## 8. BOOKING DETAIL — `pages/booking.tsx`

**i18n namespace**: `agenda.*`, `booking.*`

**3 estados visuales según query param o status**:

| Estado | Contenido |
|---|---|
| `agenda.rescheduledTitle` | Confirmación de reagenda con nuevos detalles |
| `agenda.cancelledTitle` | Confirmación de cancelación |
| Booking detail (default) | Card con: nombre cliente, fecha/hora, link Google Meet, status, botones acción (cancelar / reagendar) |

**Estados booking**: pending / contacted / in_progress / completed / closed / cancelled / rescheduled / no_show.

**Tokens**: `manageToken` único por booking permite acción sin login (URL pública).

---

## 9. BLOG INDEX — `pages/blog/index.tsx`

(Excluyendo posts individuales per request del usuario)

Index page lista 112 artículos × idioma actual con filtros + categorías.

---

## 10. START — `pages/start.tsx`

**i18n namespace**: `start.*`

**Funnel entry page** (`/start`):

| Sección | Contenido |
|---|---|
| Logo prominente (ex-icon-green 144×144) | Brand reinforce |
| H1 + H2 + subtitle | Entry into product |
| Calculator inline (lazy) | Pre-cálculo express del ahorro |
| WhatsApp CTA con `start.waDefaultMsg` prefilled | Canal directo |

`NavbarFunnel` simplificado (sin links de página, solo logo + WhatsApp).

---

## 11. GO — `pages/go.tsx`

**i18n namespace**: `go.*` (mínimo)

**Hub de redes sociales** simple, una página:
- Logo Exentax centrado (ex-icon-green 144×144)
- Lista de social links: Instagram / TikTok / Facebook / YouTube / Trustpilot
- WhatsApp directo

Util cuando se comparte un solo link en bio (Linktree-style).

---

## 12. SERVICES SUBPAGES (5 detalles)

**Template compartido**: `pages/services/ServiceSubpage.tsx` con prop `i18nKey`.

**5 instancias con namespaces diferentes**:

| Slug | Tracking | i18nKey namespace |
|---|---|---|
| `/servicios/llc-nuevo-mexico` | `llc-nm` | `subpages.llcNm` |
| `/servicios/llc-wyoming` | `llc-wy` | `subpages.llcWy` |
| `/servicios/llc-delaware` | `llc-de` | `subpages.llcDe` |
| `/servicios/llc-florida` | `llc-fl` | `subpages.llcFl` |
| `/servicios/itin` | `itin` | `subpages.itin` |

**Contenido común** (cada subpage tiene 7 secciones × 6 idiomas en `client/src/i18n/data/subpages.ts`):

| Sección | Contenido |
|---|---|
| Card kicker + title + desc | Card preview (usado también en Services grid) |
| Hero | kicker + h1 + h1green + subtitle + ctaPrimary + ctaWhatsapp + waText |
| Intro | kicker + h2 + paragraphs |
| Benefits | h2 + items[] (cards con checkmark verde) |
| Process | h2 + steps[] (timeline numerado) |
| Comparison (solo `LlcStateComparator`) | Tabla comparativa con otros estados USA |
| FAQ | 5-8 preguntas específicas del servicio |
| CTA final | Agendar consulta + WhatsApp |

---

## 13. LEGALES (5 páginas)

**Layout compartido**: `components/layout/LegalLayout.tsx` (Liquid Glass: `bg-[var(--bg-1)]/70 backdrop-blur-xl rounded-[20px]`).

| Página | Slug ES | i18n key body |
|---|---|---|
| Términos | `/legal/terminos` | `legal.terms.body` |
| Privacidad | `/legal/privacidad` | `legal.privacy.body` |
| Cookies | `/legal/cookies` | `legal.cookies.body` |
| Reembolsos | `/legal/reembolsos` | `legal.refunds.body` |
| Disclaimer | `/legal/disclaimer` | `legal.disclaimer.body` |

Body es HTML completo embebido en clave i18n. PDF descargable en `/exentax-{terminos,privacidad,cookies,reembolsos,disclaimer}.pdf`.

---

## 14. NOT FOUND — `pages/not-found.tsx`

Soft 404 con brand:
- Logo
- Mensaje 404 i18n
- CTA "Volver a inicio" / "Ir al blog"

---

## CHROME COMÚN (todas las páginas)

`Layout.tsx`: shell global Navbar + main + Footer + FloatingWhatsApp + ScrollToTop + ErrorBoundary.

| Componente | Función |
|---|---|
| `<Navbar />` | Logo (logo-tight 600×110) + nav links + selector idioma + agendar CTA |
| `<NavbarFunnel />` | Variant simplificada para `/start`, `/agendar` |
| `<Footer />` | 4 columnas: Empresa · Servicios · Recursos · Newsletter (form suscripción) |
| `<FloatingWhatsApp />` | Burbuja WhatsApp fixed bottom-right (todas las pages) |
| `<FloatingMobileCTA />` | Botón flotante mobile bottom-fixed |

---

## DESIGN SYSTEM (resumen para reconstrucción)

**Colores**:
- `--bg-0: #F8F7F4` (background principal crema)
- `--bg-1: #F0EEE9` (cards/panels)
- `--bg-2: #E8E5DF` (hover)
- **`--green: #00E510`** (brand neón, único accent — 228 ocurrencias)
- `--text-1: #0A0F0C` / `--text-2: #1E2B24` / `--text-3: #4A5C52`

**Fuentes**:
- **Space Grotesk** (headings) 500/600/700
- **Inter** (body/CTAs/UI) 400/500/600/700
- 0 monoespacio renderizado

**Patrones**:
- Hero: H1 split en 2 colors (negro + accent verde)
- Containers: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Section spacing: `py-[var(--section-gap)]` (~60-80px)
- CTA primario: pill `rounded-full` + bg `#00E510` + text `#0A0F0C`
- Cards: rounded-2xl + bg `--bg-1` + border `--border-subtle`
- Liquid Glass (legales): `bg-[var(--bg-1)]/70 backdrop-blur-xl rounded-[20px]`

**Iconos**: 100% SVG inline custom (NO react-icons, NO emojis, NO mono).

---

## RESUMEN NUMÉRICO

- **24 páginas no-blog** + 1 blog index
- **15 secciones reusables** en `components/sections/`
- **7 componentes layout chrome**
- **8 secciones FAQ** × ~10 preguntas = 79 Q&As
- **5 servicios subpages** × 7 secciones × 6 idiomas
- **5 páginas legales** con body HTML embebido en i18n
- **6 idiomas** soportados con i18n keys completas en cada página
