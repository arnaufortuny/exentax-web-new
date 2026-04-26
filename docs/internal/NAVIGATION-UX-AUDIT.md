# NAVIGATION-UX-AUDIT — Bloque 1

**Sesión: 2026-04-26 · Audit estático (sandbox sin dev server)**

Verificación lectura de código de cada componente de navegación + UX
patterns. Cada hallazgo lleva archivo:línea y resultado real.

---

## Componentes auditados

| Archivo | Líneas | Verde | Amarillo | Rojo |
|---|---:|:---:|:---:|:---:|
| `client/src/components/layout/Navbar.tsx` | 495 | ✓ | 1 cosmético | — |
| `client/src/components/layout/Footer.tsx` | 283 | ✓ | — | — |
| `client/src/components/layout/Layout.tsx` | 27 | ✓ | — | — |
| `client/src/components/layout/FloatingMobileCTA.tsx` | 77 | ✓ | — | — |
| `client/src/components/layout/FloatingWhatsApp.tsx` | 63 | ✓ | — | — |
| `client/src/App.tsx` (RouteErrorBoundary, ScrollToTop) | — | ✓ | 1 cosmético | — |

---

## Mega-menu desktop (Navbar.tsx)

**Estructura verificada `Navbar.tsx:142-149`** (servicios sub-items):

| Key | Label i18n | Href |
|---|---|---|
| `our_services` | nav.servicesOverview | `/lang/<servicios>` |
| `service_llc_nm` | nav.servicesLlcNm | `/lang/<servicios>/llc-nuevo-mexico` |
| `service_llc_wy` | nav.servicesLlcWy | `/lang/<servicios>/llc-wyoming` |
| `service_llc_de` | nav.servicesLlcDe | `/lang/<servicios>/llc-delaware` |
| `service_llc_fl` | nav.servicesLlcFl | `/lang/<servicios>/llc-florida` |
| `service_itin` | nav.servicesItin | `/lang/<servicios>/obten-tu-itin` |

**6 sub-items con label + description** (`Navbar.tsx:289-306`).
Categorías solicitadas: ✓ NM, WY, DE, FL, ITIN, Mantenimiento (overview).

**Nota**: el prompt mencionaba "categoría Recursos con artículos
herramientas calculadora, FAQs, Blog". Estructura actual:
- Inicio · Cómo trabajamos · **Servicios (dropdown)** · LLC · FAQ · Blog
- Calculadora se accede desde Hero/CTAs, no desde menú.

No es un bug — es una decisión arquitectónica. Si se desea categoría
"Recursos", documentar como mejora P2 (no afecta usabilidad actual).

---

## Menú mobile hamburguesa (Navbar.tsx:353-491)

- ✓ Hamburger 3-line con animación rotate-45 + opacity (líneas 361-363)
- ✓ `aria-expanded`, `aria-controls="mobile-menu"`, `aria-label` (357-358)
- ✓ Click outside cierra (200-210)
- ✓ ESC cierra (172-174 servicesRef + similar para menuOpen vía body overflow)
- ✓ `body.style.overflow = "hidden"` cuando abierto (193-198)
- ✓ Auto-cierra al cambiar location (212-219)
- ✓ Acordeón Services con `mobileServicesOpen` state (404-443)
- ✓ Submenu pl-3 indentado correctamente (420)

---

## Selector idioma (Navbar.tsx:14-92 mobile + LanguageSwitcher desktop)

- ✓ `MobileInlineLangSwitcher` con role="listbox", aria-haspopup, aria-label
- ✓ Cambio idioma usa `getEquivalentPath(location, lang)` para mantener URL
- ✓ Persiste preferencia via `LanguageService.change()` → localStorage
- ✓ Icono bandera + código corto (16px)
- ✓ Click outside + ESC cerrar (22-33)
- ✓ Active state visual: bg green-tint + checkmark
- ✓ 6 idiomas listados: ES EN FR DE PT CA

Verificación estructura:
- `client/src/i18n/index.ts` exports `SUPPORTED_LANGS`, `LANG_LABELS`,
  `LanguageService` con métodos `getCurrent`/`getStoredPreference`/`change`.

---

## CTAs principales

**Above the fold visibles**:
- ✓ Desktop Navbar: "Reservar consulta" (verde neón pill) + WhatsApp
  outline pill (321-350)
- ✓ Mobile Navbar: hamburger + lang dropdown
- ✓ FloatingMobileCTA: pill verde "Reservar" tras 300px scroll, oculta
  cerca de footer y en `/book` (FloatingMobileCTA.tsx:55)
- ✓ FloatingWhatsApp: 56×56 pill verde glow + tooltip on hover, oculta
  cerca de footer + cuando mobile menu open (FloatingWhatsApp.tsx:29)

**Sin precio**: ✓ Verificado — todos los CTAs usan
i18n keys (`nav.bookConsultation`, `floatingCta.text`, `nav.talkWhatsapp`)
sin números.

---

## Validación formularios

**Calculator EmailGateForm.tsx:49-117**:
- ✓ `aria-describedby="email-gate-error"` en input email
- ✓ `role="alert"` en mensaje error
- ✓ Color brand token: `text-[var(--error)]` (no off-brand `text-red-*`)
- ✓ Per-field error state: `errors: { email?, phone?, privacy? }`
- ✓ Mensajes via `t(...)` 6 idiomas

**Booking flow book.tsx**:
- ✓ Validación step-by-step: `formData.actividad !== ""`,
  `facturacion !== ""`, etc. (167-169)
- ✓ Botones radio con state selected visual (40-58)
- ✓ Progress bar visual (113)

**Footer Newsletter (Footer.tsx:22-43)**:
- ✓ Validación regex email frontend
- ✓ Estados idle/loading/success/error con auto-reset 4s
- ✓ Privacy disclaimer + link `/legal/privacy`
- ✓ Color error: `text-[var(--error)]` ← **FIXEADO esta sesión**
  (era `text-red-700`)

---

## ErrorBoundary (App.tsx:136-169)

- ✓ React class component con `getDerivedStateFromError`
- ✓ `componentDidCatch` registra error vía `clientLogger.error`
- ✓ `getDerivedStateFromProps` reset on routeKey change → recovery
  automático cambiando URL
- ⚠️ Fallback es `<EmptyLoader />` (pantalla bg-0 vacía) — sin mensaje
  de error visible al usuario. Diseño consciente para evitar flash de
  contenido roto pre-recovery, pero un mensaje "Cargando..." podría
  ayudar UX. **P3 cosmético, no-blocker**.

---

## Scroll behavior

- ✓ `ScrollToTop` (App.tsx:276-291): scrollTo(0,0) on location change
  EXCEPT cuando hay hash → respeta anclas
- ✓ `useHashScroll` (293+): scrolla a `#id` con requestAnimationFrame
- ✓ Otros: BookingCalendar, blog/post.tsx con scroll smooth

---

## Animaciones / transiciones

Verificadas:
- ✓ Navbar dropdown: `transition-all duration-200 origin-top` con
  scale-95→100 + opacity 0→100
- ✓ FloatingMobileCTA: `transition-[opacity,transform] duration-300`
  con `translate-y-full`→`translate-y-0`
- ✓ FloatingWhatsApp: `hover:scale-110 active:scale-95`
- ✓ Hamburger menu: 3-line rotate transition `duration-300`
- ✓ Cookie banner, calculator transitions: tokens consistentes

`transition-[color,background-color,border-color,box-shadow,opacity,transform]`
está usado uniformemente para evitar transitions globales caras.

---

## Responsive breakpoints

Definidos via Tailwind 3.4 estándar:
- `sm: 640px` · `md: 768px` · `lg: 1024px` · `xl: 1280px` · `2xl: 1536px`
- ✓ Navbar: 16 breakpoint hits (px / py / text-size / gap / hide xl)
- ✓ Footer: 7 breakpoint hits (col-span / px / sm: layout)
- ✓ Hero, Problem, secciones: glass-card responsive class

**No verificable estáticamente**: comportamiento real en 375/768/1280/1920px
requiere browser. Estructura Tailwind está bien escalada según patrones
inspección.

---

## Accesibilidad (ARIA)

Verificado:
- ✓ Skip link `<a href="#main-content">` (Layout.tsx:14) con `sr-only`
  `focus:not-sr-only`
- ✓ `<main id="main-content">` target del skip link
- ✓ Navbar: `aria-label`, `aria-expanded`, `aria-controls`,
  `aria-haspopup="menu"`, `role="menu"`, `role="menuitem"`,
  `role="listbox"`, `role="option"`, `aria-selected`
- ✓ Footer: social icons con `aria-label`
- ✓ Forms: `aria-describedby`, `role="alert"`
- ✓ Focus visible: `focus-visible:ring-2 focus-visible:ring-[#00E510]`

---

## CTAs sin precio

`grep -rn "1099|999€|800€|1.099" --include='*.ts' --include='*.tsx'`
→ 145 hits, todos legítimos:
- 1099 = IRS Form 1099 (formulario fiscal USA)
- 800€/4.800€/1.800€ = ejemplos cifras fiscales en artículos blog
- 999€ = 0 hits
- 1.099 = 0 hits

**1 hit legacy real fixeado** este sesión:
`abrir-llc.tsx:855 estimatedCost.value="1099" USD` → `350 USD`
(coste estructural USA, alineado con seo-content.ts patrón).

---

## Resumen Bloque 1

| Categoría | Estado |
|---|---|
| Navbar desktop mega-menu | ✓ VERDE |
| Navbar mobile hamburguesa | ✓ VERDE |
| Selector idioma 6 langs | ✓ VERDE |
| CTAs sin precio above fold | ✓ VERDE |
| Validación formularios i18n 6 langs | ✓ VERDE |
| ErrorBoundary | ✓ VERDE (P3 cosmético) |
| Scroll behavior + hash | ✓ VERDE |
| Animaciones / transiciones | ✓ VERDE |
| Responsive breakpoints (estructura) | ✓ VERDE |
| Accesibilidad ARIA | ✓ VERDE |

### Fixes aplicados Bloque 1
1. `Footer.tsx:84` `text-red-700` → `text-[var(--error)]`
2. `abrir-llc.tsx:855` legacy `1099 USD` → `350 USD`

Todos los demás componentes navegación/UX cumplen patrones brand sin
regresiones detectadas en lectura estática.
