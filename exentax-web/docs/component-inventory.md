# Inventario de componentes · exentax-web

Última actualización: 21 abr 2026 (Task #3 — Rutas, Navegación y Componentes).
Análisis estático sobre `client/src/components/**/*.tsx` y `client/src/pages/**/*.tsx` cruzando con `grep` por basename de import en todo `client/src` y `server/`.

Clasificación:

- **USED** — importado al menos una vez por código de aplicación.
- **DUPLICADO APARENTE — JUSTIFICADO** — comparte responsabilidad con otro pero existe deliberadamente (variantes de contexto, split de bundle, etc.). Documentado a continuación.
- **TOMBSTONE** — placeholder estático que sustituye a una página/feature retirada y mantiene una URL viva.
- **UNUSED** — sin importadores. **Cero detectados en este pase.**
- **INCOMPLETE** — stub o esqueleto sin lógica significativa. **Cero detectados.**

---

## 1. Componentes (`client/src/components/`)

### 1.1 Layout

| Archivo                              | Estado | Importadores principales                              |
|--------------------------------------|--------|-------------------------------------------------------|
| `layout/Layout.tsx`                   | USED   | `App.tsx` (todas las rutas localizadas + blog + 404) |
| `layout/Navbar.tsx`                   | USED   | `Layout.tsx`                                          |
| `layout/NavbarFunnel.tsx`             | USED   | `pages/start.tsx`                                     |
| `layout/Footer.tsx`                   | USED   | `Layout.tsx`                                          |
| `layout/FloatingMobileCTA.tsx`        | USED   | `Layout.tsx`                                          |
| `layout/FloatingWhatsApp.tsx`         | USED   | `Layout.tsx`                                          |
| `layout/LegalLayout.tsx`              | USED   | `pages/legal/*` (5 páginas)                           |

**Pares aparentes**:

- `Navbar` vs `NavbarFunnel` — DUPLICADO APARENTE — JUSTIFICADO. Header CTA con identidad propia (font-black, sombra verde, focus ring 4px) usado en funnels (`/start`); el resto del sitio usa `Navbar` con `LanguageSwitcher`, menú móvil y nav completa. Documentado en `docs/audit-design-system.md` §206.
- `FloatingMobileCTA` vs `FloatingWhatsApp` — JUSTIFICADO. Canales de contacto distintos (booking vs chat); ambos montados en `Layout` y co-existen.

### 1.2 Sections (`client/src/components/sections/`)

| Archivo                         | Estado | Importadores                                                                 |
|---------------------------------|--------|------------------------------------------------------------------------------|
| `Hero.tsx`                      | USED   | `pages/home.tsx`                                                             |
| `HeroStats.tsx`                 | USED   | `pages/home.tsx`, `pages/about-llc.tsx`, `pages/services.tsx`, `pages/how-we-work.tsx` (export `useStatsHome`, `useStatsPrecios`) |
| `Problem.tsx`                   | USED   | `pages/home.tsx`                                                             |
| `ForWho.tsx`                    | USED   | `pages/home.tsx`                                                             |
| `Origin.tsx`                    | USED   | `pages/home.tsx`                                                             |
| `Services.tsx`                  | USED   | `pages/home.tsx` (sección home; **distinta** de `pages/services.tsx`)         |
| `HowItWorks.tsx`                | USED   | `pages/home.tsx`                                                             |
| `WhyUs.tsx`                     | USED   | `pages/home.tsx`                                                             |
| `Testimonials.tsx`              | USED   | `pages/home.tsx`                                                             |
| `BanksCarousel.tsx`             | USED   | `pages/home.tsx`                                                             |
| `ExistingLlcCallout.tsx`        | USED   | `pages/services.tsx`, `sections/Services.tsx`                                |
| `FAQ.tsx`                       | USED   | `pages/faq-page.tsx`                                                         |
| `HomeFAQ.tsx`                   | USED   | `pages/home.tsx`                                                             |
| `FaqAccordionList.tsx`          | USED   | `FAQ.tsx`, `HomeFAQ.tsx`, `pages/services-sections.tsx`                      |
| `AccordionItem.tsx`             | USED   | `FaqAccordionList.tsx`                                                       |
| `faq-data.tsx`                  | USED   | `FAQ.tsx`, `pages/faq-page.tsx` (hook + data)                                |

**Cluster FAQ** — DUPLICADO APARENTE — JUSTIFICADO:

- `AccordionItem` = primitiva visual.
- `FaqAccordionList` = wrapper de lista (3 reusos).
- `FAQ.tsx` = experiencia completa con buscador y categorías (página FAQ).
- `HomeFAQ.tsx` = versión compacta sin buscador (sección home).
- `faq-data.tsx` = hook `useFaqSections` + helper `extractText` (única fuente de datos i18n).

Misma data, distintas presentaciones. No fusionar: la API de cada uno es deliberadamente distinta (la home no necesita filtros, la página sí).

### 1.3 Calculadora (`client/src/components/calculator/`)

| Archivo                       | Estado | Importadores                                       |
|-------------------------------|--------|----------------------------------------------------|
| `index.tsx` (Calculator root) | USED   | `pages/start.tsx`                                  |
| `CalculatorResults.tsx`       | USED   | `calculator/index.tsx` (lazy import)               |
| `EmailGateForm.tsx`           | USED   | `calculator/index.tsx`                             |
| `IrpfBracketsTable.tsx`       | USED   | `CalculatorResults.tsx`                            |
| `AnimatedNumber.tsx`          | USED   | `CalculatorResults.tsx`                            |
| `BrandIcons.tsx`              | USED   | `CalculatorResults.tsx`, `sections/Services.tsx`, `pages/start.tsx` |

### 1.4 Blog (`client/src/components/blog/`)

| Archivo                | Estado | Importadores                          |
|------------------------|--------|---------------------------------------|
| `ArticleCTA.tsx`       | USED   | `pages/blog/post.tsx`                 |
| `AiSummaryButtons.tsx` | USED   | `pages/blog/post.tsx`                 |
| `CategoryBadge.tsx`    | USED   | `pages/blog/index.tsx` (export `CATEGORY_ICON_MAP`) |

### 1.5 Componentes raíz (`client/src/components/`)

| Archivo                | Estado | Importadores                                                                 |
|------------------------|--------|------------------------------------------------------------------------------|
| `SEO.tsx`              | USED   | Todas las páginas (home, services, blog, legal, etc.)                        |
| `Tracking.tsx`         | USED   | Casi todos los componentes con CTA (export `trackWhatsAppClick`, `trackCTA`, `trackBookingInitiated`, …) |
| `CookieBanner.tsx`     | USED   | `Layout.tsx`, `Footer.tsx` (export `clearCookieConsent`, `getCookieConsent`) |
| `LanguageSwitcher.tsx` | USED   | `Navbar.tsx`                                                                 |
| `FlagImg.tsx`          | USED   | `LanguageSwitcher.tsx`, `Navbar.tsx`                                         |
| `BookingCalendar.tsx`  | USED   | `pages/book.tsx`                                                             |
| `PhoneInput.tsx`       | USED   | `BookingCalendar.tsx`, `calculator/EmailGateForm.tsx`                        |
| `InlineMessage.tsx`    | USED   | `BookingCalendar.tsx`                                                        |
| `ThemeProvider.tsx`    | USED   | `App.tsx`                                                                    |
| `icons.tsx`            | USED   | `CookieBanner.tsx`, `pages/booking.tsx`, `pages/go.tsx`                      |

---

## 2. Páginas (`client/src/pages/`)

| Archivo                       | Estado     | Notas |
|-------------------------------|------------|-------|
| `home.tsx`                    | USED       | RouteKey `home` |
| `services.tsx`                | USED       | RouteKey `our_services`; importa lazy `services-sections.tsx` |
| `services-sections.tsx`       | USED       | Lazy chunk de `services.tsx` (split deliberado para LCP) |
| `how-we-work.tsx`             | USED       | RouteKey `how_we_work` |
| `about-llc.tsx`               | USED       | RouteKey `about_llc` |
| `faq-page.tsx`                | USED       | RouteKey `faq` |
| `book.tsx`                    | USED       | RouteKey `book`; embebe `BookingCalendar` |
| `booking.tsx`                 | USED       | Ruta `/booking/:token`; gestión propia del cliente |
| `start.tsx`                   | USED       | Ruta `/start`; funnel UTM |
| `go.tsx`                      | USED       | Ruta `/links`; linktree |
| `not-found.tsx`               | USED       | Fallback `*` |
| `blog/index.tsx`              | USED       | `/blog`, `/{lang}/blog` |
| `blog/post.tsx`               | USED       | `/blog/:slug`, `/{lang}/blog/:slug` |
| `legal/terms.tsx`             | USED       | RouteKey `legal_terms` |
| `legal/privacy.tsx`           | USED       | RouteKey `legal_privacy` |
| `legal/cookies.tsx`           | USED       | RouteKey `legal_cookies` |
| `legal/refunds.tsx`           | USED       | RouteKey `legal_refunds` |
| `legal/disclaimer.tsx`        | USED       | RouteKey `legal_disclaimer` |

---

## 3. Pares aparentes que son **distintos por diseño**

| Par                                                | Decisión                                                                 |
|----------------------------------------------------|--------------------------------------------------------------------------|
| `Navbar.tsx` ↔ `NavbarFunnel.tsx`                  | Mantener ambos. Distinto patrón visual y nav simplificada para funnels. |
| `FloatingMobileCTA.tsx` ↔ `FloatingWhatsApp.tsx`   | Mantener ambos. Co-existen en `Layout`; canales distintos.              |
| `pages/services.tsx` ↔ `sections/Services.tsx`     | Mantener ambos. Página vs sección de home (capitalización marca el contraste). |
| `pages/services.tsx` ↔ `pages/services-sections.tsx` | Mantener ambos. Split eager/lazy deliberado para LCP. Documentado en `docs/cleanup-hardening-2026.md` §35. |
| `sections/FAQ.tsx` ↔ `sections/HomeFAQ.tsx` ↔ `pages/faq-page.tsx` | Mantener los tres. Distinta UX (página con buscador vs sección compacta) sobre la misma `faq-data.tsx`. |
| `sections/AccordionItem.tsx` ↔ `sections/FaqAccordionList.tsx` | Mantener ambos. Primitiva + wrapper de lista. |

---

## 4. Componentes a eliminar / consolidar en este pase

**Ninguno.** Todos los componentes y páginas tienen importador real. La auditoría previa (`docs/audits/archive/2026-04/auditoria-2026-04.md` §119) ya retiró huérfanos detectados (`partner-lili.webp`, `AUDIT-BLOG.md`, `manual-test.ts`, etc., enumerados en `architecture-map.md` §11). El presente pase no encuentra nuevos candidatos.

Por consistencia con el plan de la tarea siguiente (**Limpieza Quirúrgica del Proyecto**), si en el futuro algún componente de los listados aquí cambia de estado a UNUSED, marcarlo en esta tabla con la etiqueta `→ candidato a limpieza` y dejar la eliminación efectiva para esa tarea.

---

## 5. Recomendaciones operativas

1. Antes de añadir un componente con un nombre similar a uno existente (`Foo` ↔ `FooFunnel`, `Bar` ↔ `HomeBar`), revisar este inventario y documentar la justificación en la tabla §3.
2. Cualquier export reusado en >2 sitios debería vivir en `components/` (no en `pages/`). Hoy se cumple.
3. `services-sections.tsx` es la única página fuera de `components/` que actúa como módulo lazy. Antes de extender el patrón, considerar moverlo a `components/sections/services-extended.tsx` para clarificar intención (no se ejecuta en este pase porque introduce regresión SEO si la ruta canónica cambia).
