# AGENT-RULES — Reglas para agentes automatizados

**Última revisión: 2026-04-22 · Sesión 11**

Este documento es la **fuente de verdad** para cualquier agente
automatizado (Claude Code, Cursor, Copilot, etc.) que trabaje en el
repositorio `exentax-web-new`. Leerlo antes de escribir código.

---

## Regla nº 1 (irrompible): lo que funciona no se toca

Antes de modificar cualquier archivo, el agente debe **demostrar con un
comando concreto que ese archivo tiene un problema real**. Sin evidencia
medida no hay cambio. Un cambio innecesario en un archivo verde es un
bug introducido.

La sesión anterior a una edición debe incluir:

1. Un `grep` o `Read` que muestre el problema.
2. Una clasificación de severidad (P0 crítico / P1 grave / P2 mejora /
   P3 cosmético).
3. Una verificación independiente de que el hallazgo no es falso
   positivo.

**Tasa de falsos positivos observada en agents Explore: ~40 %**. Cada
hallazgo de un agent **debe** verificarse manualmente con grep antes de
aplicar.

---

## Invariables del proyecto (no cambiar nunca sin aprobación explícita)

### Marca y terminología

- **Exentax** se escribe siempre así. Nunca `ExenTax`, `EXENTAX`,
  `exentax`. El lint `brand-casing-check.mjs` lo bloquea.
- **LLC, EIN, ITIN, BOI, IRS, FinCEN, Form 5472, Form 1120, W-7,
  W-8BEN** se mantienen en inglés en los 6 idiomas.
- Nombres geográficos: usar variante local estándar:
  - ES/CA: "Nuevo México"
  - EN: "New Mexico"
  - FR: "Nouveau-Mexique"
  - DE: "New Mexico"
  - PT: "Novo México"
  - CA: "Nou Mèxic"

### Precios (comunicación comercial)

- Constitución: **desde 2.000 €**
- Mantenimiento: **desde 1.400 €/año**
- Nunca otro formato, nunca otro número en contenido comercial.
- Calculator `LLC_FORMATION_COST = 2000`, `LLC_ANNUAL_COST = 1400` —
  sincronizados.

### Banca (orden canónico)

Siempre que se liste la banca/infraestructura financiera:

**Relay → Slash → Wise → Mercury → Wallester → Revolut Business →
Airwallex**

Aplicado en:
- `client/src/components/sections/BanksCarousel.tsx`
- 6 × `client/src/i18n/locales/*.ts` → `keyMsg.banking`
- 6 × `client/src/data/blog-content/*/cuanto-cuesta-constituir-llc.ts`

---

## Reglas de código

### 1. Iconos · SOLO SVG custom

- **Prohibido** añadir: `react-icons`, `lucide-react`, `@heroicons/*`,
  `@radix-ui/react-icons`, `@mui/icons-*`.
- **Prohibido** emojis en código (UI, emails, templates, logs).
- SVG centralizados en `client/src/components/icons.tsx`. Si hace falta
  un icono nuevo, **añadirlo allí** y exportarlo como componente.
- SVG inline ad-hoc (ej. dropdown chevron 8×8) son aceptables si no se
  reutilizan en >1 sitio.

### 2. Tipografía

- Fonts: **Space Grotesk** (headings) + **Inter** (body/UI).
- No añadir nuevas fuentes sin aprobación.
- `font-display: swap` obligatorio en preload.

### 3. Colores

- Paleta oficial: verde neón `#00E510`, negro `#000000`, grises CSS
  vars.
- **Usar CSS variables** (`var(--green)`, `var(--text-1)`, etc.)
  definidas en `client/src/index.css:102-128`. No hardcodear hexes en
  componentes `.tsx`.
- Excepciones legítimas:
  - `client/src/main.tsx` ErrorBoundary fallback (debe funcionar si
    CSS bundle falla).
  - Email templates (`server/email-layout.ts`) — inline colors para
    clientes de email compatibilidad.
  - Colores de marca externa (`#25D366` WhatsApp).
- `prefers-color-scheme: dark`: el proyecto es **dark permanente**. No
  implementar light-mode sin aprobación explícita.

### 4. Border radius

- Botones: `border-radius: 9999` (pastilla).
- Cards/panels: `border-radius: 12-16px`.
- Inputs: `border-radius: 9999` (consistente con botones).

### 5. i18n

- **Nunca** hardcodear strings de UI en `client/src/`. Usar siempre
  `t("key")` de `react-i18next`.
- 6 idiomas: ES/EN/FR/DE/PT/CA. Cada key debe existir en los 6 locales.
- El lint `i18n:check` bloquea `t()` references que no resuelven en ES.
- PT es **PT-PT estricto**. Prohibidos brasileñismos: `você` →
  `tu/o senhor`, `arquivo` → `ficheiro`, `contato` → `contacto`, `equipe`
  → `equipa`, `registrar` → `registar`. El lint `audit-pt-pt.mjs`
  bloquea.
- FR: formal `vous`.
- DE: formal `Sie` en contexto comercial.
- CA: formal `tu`.

### 6. hreflang y SEO multi-idioma

- **hreflang siempre BCP-47** (`es-ES`, `en-US`, `fr-FR`, `de-DE`,
  `pt-PT`, `ca-ES`). Nunca 2-letras (`es`, `en`, ...).
- Cliente: `client/src/components/SEO.tsx:HREFLANG_BCP47`.
- Server: `server/routes/public.ts:HREFLANG_BCP47`.
- `x-default` siempre apunta a `es-ES`.
- og:locale usa **underscore** (`es_ES`) per OpenGraph spec.

### 7. Blog content

- **Solo** en `client/src/data/blog-content/{es,en,fr,de,pt,ca}/*.ts`.
- 111 artículos × 6 idiomas = 666 ficheros. Schema validado.
- `blog-content-lint.mjs` bloquea precios/direcciones prohibidos.
- `blog-cta-position-check.mjs` asegura CTAs en posiciones válidas.
- `blog-translation-quality-audit.mjs`: 0 duplicados, 0 PT-BR.
- ES es source of truth; no traducir EN/FR/DE/PT/CA como calco; usar
  registro nativo.

### 8. Build script — archived scripts off-limits

- `scripts/archive/<date-task>/` contiene scripts de tareas cerradas.
- **Prohibido** referenciarlos desde `package.json`, `scripts/build.ts`,
  o cualquier otro runtime script.
- Si necesitas uno, cópialo a `scripts/` (no archivado) y adapta.

### 9. Emails y PII

- Todos los `logger.*` con `data.clientEmail` o `data.email` deben
  usar `maskEmail()` (`server/email.ts`).
- Phone NO se enmascara en Discord admin channel (design intent — admin
  necesita llamar al cliente; canal está gateado por rol).
- Phone SÍ se cifra en DB via `field-encryption.ts` (AES-256-GCM).

### 10. Rate limiting

- **Todos** los endpoints `/api/*` que tocan DB deben llamar a un
  `check*RateLimit(ip)` como primer check tras asyncHandler.
- Rate limiters definidos en `server/route-helpers.ts:258-264`.
- Para endpoints públicos de solo-lectura: `checkPublicDataRateLimit`
  (60/min/IP).

### 11. Discord

- 7 canales requeridos (`DISCORD_CHANNEL_*`). Ver
  `exentax-web/docs/deploy/DISCORD-SETUP.md`.
- Event routing centralizado en `server/discord.ts:TYPE_TO_CHANNEL`.
- Slash commands `/agenda` y `/cita` gateados por
  `ADMIN_DISCORD_ROLE_ID`.
- Cada admin action se audita en `#exentax-auditoria` via
  `notifyAdminAction()`.
- Embeds: solo verde neón `#00E510`, sin emojis, sin iconos de otras
  librerías.

### 12. Schemas JSON-LD (SEO)

- `server/seo-content.ts:PAGE_SCHEMAS`:
  - `home`: Organization + WebSite + BreadcrumbList
  - `service_*` × 5: Service + BreadcrumbList (ofertas `desde 2000 €`)
  - `faq`: FAQPage auto-emitido por `injectMeta()`
  - `about_llc`, `how_we_work`, legal_*, blog: BreadcrumbList + tipo
    propio (Article, HowTo, etc.)

### 13. CSP (Content-Security-Policy)

- `scriptSrcAttr: isProd ? ['none'] : ['unsafe-inline']` —
  **prohibido inline onclick/onerror/onload** en producción.
- `style-src: 'unsafe-inline'` aceptable (Tailwind + Google Fonts).
- Si necesitas inline event handler, usa React `onClick={}` (se
  compila a JS, no viola CSP).

### 14. Testing

- `calculator.test.ts`: 123/123 asserts. Debe seguir PASS.
- Tests E2E requieren Postgres real (`test:newsletter`,
  `test:booking`, `test:indexnow`, `test:discord-neon`). Ejecutar en
  Replit con `DATABASE_URL` válido.
- `tsc --noEmit`: exit 0 siempre.

### 15. Git

- `lint:stray-reports`: prohibido `*-report.{json,md}` en raíz.
- `lint:typography`: Regla 0 bloquea decorativos.
- Generated artifacts viven en `reports/<topic>/`, no en raíz.
- Audit JSONs en `docs/auditoria-sistema-seo-faqs/` se regeneran
  dinámicamente — **no commitear** la regeneración (revertir con
  `git checkout HEAD -- <path>`).

---

## Documentos clave (leer en orden)

1. **`AGENT-RULES.md`** (este doc) — reglas irrompibles.
2. **`WHAT-NOT-TO-TOUCH.md`** — whitelist de archivos verdes medidos.
3. **`DEFINITIVE-STATUS.md`** — estado actual del proyecto
   (verde/rojo/gris).
4. **`PENDING.md`** — trabajo pendiente priorizado con comandos para
   reproducir.
5. **`INVENTORY.md`** — mapa consolidado (rutas, componentes,
   endpoints, scripts).
6. **`CHANGELOG-SESSION.md`** — cambios session-by-session.
7. **`exentax-web/docs/deploy/HOSTINGER-VPS.md`** — guía deploy VPS.
8. **`exentax-web/docs/deploy/DISCORD-SETUP.md`** — setup Discord.
9. **`exentax-web/docs/blog/CONTENT-IMPROVEMENT-PLAN.md`** — plan
   expansión artículos.
10. **`replit.md`** — preferencias, arquitectura y convenciones
    legacy.

---

## Comandos de verificación (batería completa)

Al terminar cualquier cambio, el agente debe ejecutar:

```bash
cd exentax-web

# TypeScript strict
npx tsc --noEmit

# Linters
npm run i18n:check
npm run seo:meta
npm run seo:check
npm run seo:slash
node scripts/audit-pt-pt.mjs
node scripts/blog-content-lint.mjs
node scripts/blog-cta-position-check.mjs
node scripts/blog-translation-quality-audit.mjs --check

# Tests (calculator sin DB; E2E requieren Postgres)
DATABASE_URL=postgresql://test:test@localhost/test \
  npx tsx client/src/lib/calculator.test.ts

# Audit SEO
node scripts/audit-system-seo-faqs.mjs

# Build reproducible
cd /home/user/exentax-web-new
SKIP_BUILD_E2E=1 DATABASE_URL=postgresql://dummy:dummy@localhost/dummy \
  npm run build
```

**Todo debe estar verde** antes de commit. Regresión detectada →
revertir ese cambio específico, no continuar.

---

## Formato de commit

```
<Titulo corto descriptivo con métrica antes/después>

Evidencia del problema: <grep + output o referencia al linter>.

Fix: <descripción concreta línea a línea>.

Verificación sin regresiones:
- tsc: exit 0
- <linters que apliquen>: PASS
- build: exit 0 (tamaño si relevante)

Falsos positivos descartados (si aplica):
- <claim del agent> → <evidencia de que no es real>
```

Nunca commits sin verificación end-to-end. Nunca force push a `main`.

---

## Prohibiciones absolutas

- Prohibido **reescribir código que pasa los checks** ("mejoras
  estéticas sin bug").
- Prohibido **cambiar traducciones correctas** porque podrían ser
  mejores.
- Prohibido **añadir features nuevas** sin tarea explícita del
  usuario.
- Prohibido **refactorizar** sin evidencia de bug.
- Prohibido **commitear audit JSONs regenerados**
  (`docs/auditoria-sistema-seo-faqs/*.json`, `docs/auditoria-multiidioma/*.json`).
- Prohibido **decir "está bien"** sin comando que lo confirme.

Esta es una sesión de cierre, calidad y estabilidad. No de creatividad.

---

## Reglas específicas para trabajos futuros (declarados por el usuario)

### A. Traducir blogs faltantes (44 artículos <70 % ratio vs ES)

Listado completo en `exentax-web/docs/blog/CONTENT-IMPROVEMENT-PLAN.md`
y en `PENDING.md §0`. Distribución: DE 16, PT 12, CA 10, FR 6, EN 0.

Reglas obligatorias para cada sesión:

1. **Source of truth**: siempre el ES original en
   `client/src/data/blog-content/es/<slug>.ts`. Nunca re-escribir el
   ES ni adaptarlo al target.
2. **No calcos**: traducir con registro comercial nativo:
   - DE: `Sie` formal.
   - FR: `vous`.
   - PT: PT-PT estricto (`tu`/`o senhor`, `ficheiro`, `contacto`).
   - CA: `tu` formal, sin arcaísmos.
3. **Preservar marcadores byte-idénticos**:
   - `<!-- exentax:review-anchor-v1 -->` y otros `<!-- exentax:* -->`.
   - Bloques `review-anchor-v1` no se traducen — son citas verbatim.
4. **Preservar URLs existentes**. No inventar enlaces nuevos. Si el
   ES enlaza a una fuente oficial (IRS, FinCEN, BOE), la traducción
   mantiene la misma URL.
5. **Aplicar invariables del proyecto**:
   - Precios comerciales: `desde 2.000 €` / `desde 1.400 €/año`.
   - Banca canon: **Relay → Slash → Wise → Mercury → Wallester →
     Revolut Business → Airwallex**.
   - Términos no traducibles: LLC, Exentax, EIN, ITIN, BOI, IRS,
     FinCEN, Form 5472, W-7, W-8BEN, Mercury, Stripe.
6. **Target ratio palabras ≥ 0.85** vs ES. Verificar con:
   ```
   node scripts/blog-translation-quality-audit.mjs
   ```
7. **Nunca inventar datos factuales** que no estén en ES. Ante duda,
   traducir más literal que añadir.
8. **Cadencia: 1 artículo × 5 idiomas por sesión**, no más. Evita
   timeouts de agents y mantiene calidad.
9. **Linters obligatorios tras cada artículo**:
   ```
   node scripts/blog-content-lint.mjs
   node scripts/audit-pt-pt.mjs   # si tocaste PT
   node scripts/blog-cta-position-check.mjs
   node scripts/blog-translation-quality-audit.mjs --check
   npx tsc --noEmit
   ```
10. **Commit por artículo completado** con slug + ratios antes/después
    en el mensaje.

### B. Rediseño páginas y cambio de contenidos

Cuando el usuario pida rediseñar una página o cambiar contenidos:

1. **No cambiar slugs** sin actualizar TODOS los puntos:
   - `shared/routes.ts` → `ROUTE_SLUGS`
   - `server/seo-content.ts` → `PAGE_META_I18N` claves + `PAGE_SCHEMAS`
   - `server/routes/public.ts` sitemap handlers (si es route nueva)
   - `client/src/i18n/locales/*.ts` subpages i18n si aplica
   - Meta `canonical` en SEO.tsx (automático vía `resolveRoute`)
2. **No cambiar i18n keys existentes** (rompería `i18n:check`). Si
   hace falta key nueva:
   - Añadirla en los **6 locales** (ES/EN/FR/DE/PT/CA) al mismo
     namespace.
   - ES como source of truth, resto traducción nativa.
3. **Respetar patrones de diseño existentes**:
   - **Liquid Glass**: aplicar SOLO en páginas legales
     (`client/src/components/layout/LegalLayout.tsx`) — translucent
     background + backdrop-blur + tint verde neón muy sutil.
   - **Hero, home, services, landing**: mantener diseño actual (neón
     puro sobre negro/claro según tema), no mezclar estilos.
   - **Tipografía**: Space Grotesk (headings) + Inter (body). No
     añadir nuevas.
   - **Colores**: solo `var(--*)` de `index.css:102-128`. Excepciones
     documentadas (ver § 3 Colores arriba).
   - **Botones**: border-radius 9999 (pastilla). Paneles: 16-20 px.
4. **Mantener schemas JSON-LD intactos** en
   `server/seo-content.ts:PAGE_SCHEMAS`. Son SEO ganado; no tocar sin
   aprobación explícita.
5. **No tocar `PAGE_KEYWORDS`** en `seo-content.ts:795-924`. Son
   keywords declaradas + verificadas por audit.
6. **Tras cambios — verificación obligatoria**:
   ```
   npx tsc --noEmit
   npm run i18n:check
   npm run seo:meta
   npm run seo:check
   ```
7. **Hostinger-ready**: sin dependencias no listadas en `package.json`
   (ver § 1 Iconos — prohibido `react-icons`, etc.).
8. **No añadir nuevos componentes sin justificación**. Si el diseño
   puede resolverse con Tailwind + componentes existentes, usa eso.

### C. Páginas públicas / artículos / veracidad / fuentes

Aplicable a cualquier edición de contenido destinado a usuarios finales:

1. **Cero alucinaciones**. Cada cifra, fecha o cita legal debe
   verificarse contra fuente oficial citada en el texto.
2. **Fuentes oficiales usadas en el proyecto** (33 URLs
   verificadas en `docs/seo/blog-sources-canonical.md`):
   - IRS (forms 5472, 1120, W-7, LLC, FATCA).
   - FinCEN (BOI).
   - Congress.gov (CTA ley pública).
   - eCFR (26 CFR).
   - Cornell Law (26 USC).
   - OECD (CRS, BEPS).
   - FATF (40 Recommendations).
   - EU (DAC, DAC7, DAC8, ATAD, VAT Directive).
   - AEAT (modelos 349/100/200).
   - BOE (Ley 35/2006 IRPF, 27/2014 IS, 58/2003 LGT, modelo 720).
   - Seguridad Social RETA.
   - Secretarios de estado: Delaware, Wyoming, Nuevo México.
   - SAT México, DIAN Colombia, AFIP Argentina.
3. **No añadir cifras específicas** sin fuente. Si el ES dice "desde
   2.000 €", no inventar "2.300 €" en otro idioma.
4. **Precios del proyecto**: `LLC_FORMATION_COST = 2000 €`,
   `LLC_ANNUAL_COST = 1400 €`. Calculator, emails, landing, legal —
   todos deben alinearse.
5. **Datos fiscales**: IRPF brackets 2026 (19/24/30/37/45/47 %),
   SS autónomo 2026 (15 tramos), dividendos (19/21/23/27/28 %).
   Cambios fiscales → actualizar
   `client/src/lib/calculator-config.ts` + posts blog relevantes +
   tests.
6. **Invariables de comunicación**:
   - "Exentax no vende LLC; ayuda a decidir si es la estructura
     adecuada" (hero ctaTitle).
   - LLC pass-through por defecto en federal; estado varía.
   - No prometer "0 impuestos" sin el contexto residencia fiscal /
     CFC / imputación en España.
7. **Cada edición de contenido blog/page**:
   ```
   node scripts/blog-content-lint.mjs       # precios/address prohibidos
   node scripts/blog-cta-position-check.mjs # CTAs en posición válida
   ```

### D. No nuevas funciones sin solicitud explícita

- No añadir endpoints `/api/*` nuevos.
- No añadir tablas a DB (`shared/schema.ts`).
- No añadir rutas a `ROUTE_SLUGS`.
- No añadir slash commands Discord (`server/discord-bot.ts:253`).
- No añadir tracking events GA4 nuevos (ya son 12+; cobertura
  suficiente).
- Si el usuario pide "mejora" sin especificar, **preguntar antes de
  implementar**. "Mejora" ≠ "añade feature nueva".

---

## Checklist de sesión estándar

Al iniciar una sesión:

1. `git status` — verificar working tree limpio.
2. Leer `AGENT-RULES.md` (este doc), `WHAT-NOT-TO-TOUCH.md`,
   `DEFINITIVE-STATUS.md`.
3. Revisar `PENDING.md` para contexto de trabajo pendiente.

Durante la sesión:

1. Medir antes de actuar (grep/read/linter).
2. Clasificar severidad (P0-P3).
3. Verificar falso-positivo con `grep` directo (los agents fallan
   ~40 %).
4. Aplicar solo fixes con evidencia.
5. Verificar tras cada cambio con el linter específico.

Al cerrar la sesión:

1. Batería completa de linters (12 puertas).
2. Build reproducible (`SKIP_BUILD_E2E=1 npm run build`).
3. Revertir audit JSONs regenerados.
4. Commit descriptivo con métricas antes/después.
5. Push a `main` con token si hay cambios.
6. Actualizar `CHANGELOG-SESSION.md` si aplica.
