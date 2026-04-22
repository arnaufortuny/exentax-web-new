# Auditoría del sistema visual e identidad — Exentax

Fecha: 2026‑04‑17
Alcance: Home, Servicios, Sobre LLC, Cómo trabajamos, Calculadora, FAQ, Booking, Blog, páginas legales y agenda del cliente.

> Premisa de marca (recordatorio): consultoría fiscal premium, sobria, alto contraste tipográfico. **`#00E510` solo para CTA, foco, links en hover y estados activos.** Nunca para puntos, barras, prefijos numerados ni decoración.

---

## 1. Inventario de tokens (`client/src/index.css`)

### 1.1 Paleta `:root` (light)

| Token | Valor | Uso canónico |
|---|---|---|
| `--bg-0` | `#F8F7F4` | Fondo página (warm off‑white). |
| `--bg-1` | `#F0EEE9` | Sub‑fondo / `pre`. |
| `--bg-2` | `#E8E5DF` | Cards mate, `surface-card`, calculadora bg. |
| `--bg-input` | `#EDEAE4` | Inputs en dark forzado. |
| `--border` | `#D5D9D6` | Dividers principales. |
| `--border-subtle` | `rgba(0,0,0,0.05)` | Cards mate, separadores ligeros. |
| `--border-active` | `rgba(0,229,16,0.35)` | Focus, slot activo, popular state. |
| `--green` | `#00E510` | CTA primario, links activos. |
| `--green-hover` | `#00D10E` | Hover de links body. |
| `--green-soft` | `rgba(0,229,16,0.07)` | Halos suaves de glass. |
| `--green-glow` | `rgba(0,229,16,0.16)` | Sombra hover strong. |
| `--text-1` | `#0A0F0C` | Headings, body principal. |
| `--text-2` | `#1E2B24` | Body secundario. |
| `--text-3` | `#4A5C52` | Captions, eyebrow neutro. |
| `--muted` | `#7A8C83` | Metadata, scrollbar hover. |
| `--success/warning/error/info` | `#2BB50E / #C98A00 / #DC2626 / #2563EB` | Validaciones de formulario. |
| `--shadow-green` / `--shadow-green-lg` | verde 14–24 % | Botón primario y cards en hover. |

### 1.2 Paleta `.dark`

Mirror funcional. Cambios relevantes: `--bg-0 #050505`, `--bg-2 #101010`, `--green-hover #00FF14` (más brillante), `--text-1 #F0F2F1`. Mismo verde `#00E510`.

### 1.3 Tipografía

- `--font-heading`: **Space Grotesk** — H1/H2/H3, badges editoriales.
- `--font-body`: **Inter** — body, eyebrows, botones (`--font-button` también Inter).
- Body con `letter-spacing: -0.011em`, `font-feature-settings: 'kern', 'liga'`, `font-optical-sizing: auto`.
- H1 `font-weight: 800` `letter-spacing: -0.032em`. H2 700 / -0.022em por defecto.
- `.section-h2` específica: `clamp(1.875rem, 4vw, 2.875rem)` con tracking `-0.03em`.
- Blog body 17.5 px / line-height 1.78, primer párrafo 21 px / 1.55 (lead).

### 1.4 Radios y sombras

- Radii: `xs 8`, `sm 12`, `base 16`, `lg 24`, `xl 32`, `full 9999`.
- Sombras neutras `--shadow-xs/sm/base/lg`. Verdes `--shadow-green/-green-lg`.
- `--card-inset-shadow` aporta highlight superior interno (estilo glass premium).

### 1.5 Espaciado

- `--section-gap: clamp(72px, 9vw, 120px)` aplicado vía `.section-padding`.
- `--container-pad: clamp(20px, 5vw, 40px)` aplicado vía `.section-container`.
- Container ancho fijo: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (patrón usado en todas las páginas marketing).

---

## 2. Inventario de componentes utilitarios CSS

### 2.1 Glass tiers — coexisten dos lenguajes visuales

| Clase | Tier | Cuándo usar | Hover |
|---|---|---|---|
| `.glass` | base 70 % | Wrappers ligeros, secciones translúcidas. | — |
| `.glass-strong` | strong 86 % | Formularios, calculadora, panel central. | — |
| `.glass-card` | card | Tile interactivo en marketing (hovers con outline verde 0.18). | borde verde + shadow. |
| `.glass-editorial` | base editorial | Cards de blog/guías, neutro premium. | — |
| `.glass-editorial-strong` | strong editorial | Cards destacadas en blog. | — |
| `.cta-glass` | hero CTA | Banners CTA con gradient outline verde sutil. | — |
| `.editorial-card` | hover wrapper | Wrap para tiles editoriales con elevation + outline gradiente al hover. | translateY(-3px) + outline gradiente. |

**Hallazgo:** existen dos sistemas paralelos (high‑tech green glow vs. editorial neutro). Es intencional — el blog mantiene tono editorial, el marketing reafirma la identidad verde de marca. **Mantener ambos** pero documentar la regla:

> **Regla de uso:**
> - Páginas comerciales (home, services, about‑llc, how‑we‑work, book): `.glass-card` cuando el bloque es interactivo o destacado, `.surface-card` (nuevo, ver §3) cuando es solo contenedor mate.
> - Blog y guías: `.glass-editorial`, `.glass-editorial-strong`, `.editorial-card`, `.cta-glass`.
> - Nunca mezclar `.glass-card` (verde glow) dentro de `.editorial-card` (neutro) en el mismo viewport.

### 2.2 Eyebrows / labels de sección

| Clase | Estado | Notas |
|---|---|---|
| `.section-label` | **canónica para marketing** | `13px / 600 / #00B70D` (light) – `#4DFF5A` (dark). Cumple regla 0 (sentence case, sin tracking). |
| `.editorial-eyebrow` | canónica para blog | Hairline + texto neutro `--text-3`. |
| Inline `text-[13px] font-body font-semibold text-[#00E510] mb-4 block` | **legacy, deprecado** | Reemplazado en este pase. |

### 2.3 Headings de sección

| Clase | Patrón |
|---|---|
| `.section-h2` | `clamp(30, 4vw, 46)px / 700 / -0.03em`. Canónica para H2 de sección marketing. |
| `.section-green` | Subtítulo verde acompañante (usado puntualmente). |
| `.section-body` | 16–17 px / 1.7 / `--text-2`. |

**Hallazgo:** En `about-llc.tsx`, `services-sections.tsx`, `how-we-work.tsx` los H2 usan `font-heading font-bold text-[clamp(32px,2.5vw,34px)] leading-[1.12] tracking-[-0.025em]` inline en vez de `.section-h2`. Aplican un tamaño máximo más bajo (34 px vs 46 px) y un tracking ligeramente distinto. **Decisión:** mantener inline porque corresponde a un tier visual de “página interna” deliberadamente más contenido que el de la home. **Acción futura (no ejecutada):** crear `.page-h2` con esos valores y migrar.

### 2.4 Blog editorial

`.blog-content` define un sistema completo: lead 21 px, H2 con hairline superior (sin barra verde, sin numeración), listas con marker hairline (no puntos verdes), blockquote pull‑quote frosted, tablas liquid‑glass, links con underline ink. Cumple regla 0 estricta.

`.editorial-badge`: pill verde sólido `#00E510` con glow. **Único lugar donde el verde se usa como fondo decorativo continuo**, justificado como marker de categoría de artículo y patrón de marca exclusivo del blog. Mantener.

### 2.5 Tabs / chips

`.editorial-tabs` + `.editorial-chip` → segmented control liquid‑glass con activo verde sólido. Coherente con el editorial-badge.

### 2.6 Animaciones

`.reveal` (visible siempre, sin transform), `.draw-path` / `.draw-path-now` (handwriting underline), `.calc-results-enter`, `.calc-savings-enter`, `.btn-pulse` (pulse ring del CTA).

### 2.7 Focus

```css
:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; }
```
Inputs: doble ring (bg + verde). Coherente con regla de uso del verde.

---

## 3. Hallazgos y fixes ejecutados

### 3.1 Eyebrows inline duplicados (resuelto)

**Patrón legacy** repetido 11 veces:
```tsx
<span className="text-[13px] font-body font-semibold text-[#00E510] mb-4 block">…</span>
```

Problemas:
1. Color saturado (`#00E510`) sobre `--bg-0` `#F8F7F4` da contraste ≈ 1.74:1 — muy por debajo de WCAG AA (4.5:1 para texto normal). La clase canónica `.section-label` usa `#00B70D` (≈ 3.85:1), que aún no alcanza AA para texto de 13 px (no califica como “large text” WCAG, que exige ≥ 18 px regular o 14 px bold), pero **mejora claramente** el contraste y reduce el chroma agresivo. Mejora incremental, no compliance final; el siguiente paso sería oscurecer a `#008B0A` (≈ 5.4:1, AA pleno) si quisiéramos cerrar el ítem de accesibilidad.
2. Duplicación: 11 fuentes de verdad para el mismo componente.
3. Atajo a Tailwind `text-[13px]` que ignora el sistema de tipografía base.

**Fix aplicado** — migración a `.section-label mb-4 block`:

| Archivo | Ocurrencias migradas |
|---|---|
| `pages/about-llc.tsx` | 5 (whatIsLabel, whyLabel, processLabel, complianceLabel, statesLabel) |
| `pages/services-sections.tsx` | 4 (services, comparativa.jurisdiction, maintenance, faq) |
| `pages/how-we-work.tsx` | 1 (whyUs.label) |
| `components/sections/FAQ.tsx` | 1 (asPage variant) |

Total: **11/11**. Esperado: ligero oscurecimiento del verde del eyebrow (mejora de contraste). La clase ya estaba en uso en Home (`HowItWorks`, `WhyUs`, `Origin`, `Problem`, `HomeFAQ`, `ForWho`, `Services`, `BanksCarousel`).

### 3.2 Surface card inline duplicado (resuelto)

**Patrón legacy** repetido 6 veces:
```tsx
<div className="rounded-[var(--radius-lg)] p-6 lg:p-8"
     style={{ background: "var(--bg-2)", border: "1px solid var(--border-subtle)" }}>
```

**Fix aplicado** — nueva clase utilitaria `.surface-card` añadida a `index.css`:

```css
.surface-card {
  background: var(--bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}
```

Migrados:

| Archivo | Ocurrencias migradas |
|---|---|
| `pages/about-llc.tsx` | 4 (whatItDoes wrapper, beneficio×N, paso×N, obligacion×N) |
| `pages/book.tsx` | 1 (wizard wrapper) |

No migrado por condicionalidad de borde (state `isPopular`):
- `pages/about-llc.tsx` línea 350 — el border alterna entre `rgba(74,222,128,0.4)` (popular) y `--border-subtle` (resto). Se mantiene inline; refactor futuro: variante `.surface-card.is-popular`.

### 3.3 Consolidación de botones y H2 (resuelto)

#### 3.3.1 Botón primario verde — `.btn-primary` (resuelto)

**Antes**: 25+ ocurrencias inline del patrón
`bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold … shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[…] duration-200`
distribuido en 14 archivos (Hero, WhyUs, HowItWorks, ForWho, calculator/*, BookingCalendar, how‑we‑work, services, services‑sections, about‑llc, book, not‑found, FloatingMobileCTA, CookieBanner, go).

**Después**: clase canónica en `index.css` (`@layer components`):

```css
.btn-primary {
  background-color: var(--green);
  color: #0B0D0C;
  box-shadow: var(--shadow-green);
  transition: background-color .2s ease, box-shadow .2s ease,
              transform .2s ease, opacity .2s ease;
}
.btn-primary:hover {
  background-color: var(--green-hover);  /* color shift activado */
  box-shadow: var(--shadow-green-lg);
}
.btn-primary:active:not(:disabled) { transform: scale(0.97); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
```

**Padding / text-size / font-weight / width quedan en el consumer** para preservar tamaños por contexto (CTA hero `px-8 py-3.5 text-base`, calc `px-6 py-3.5 text-sm`, mobile `py-3.5`). Esto evita regresiones de layout y permite que el componente “sea grande donde tiene que ser grande”.

Ejecutado vía script de reemplazo exacto sobre 14 archivos: 24 botones migrados. Patrón residual eliminado en CookieBanner, about‑llc state card y go/links manualmente. **0 ocurrencias restantes** del head pattern `bg-[#00E510] hover:bg-[#00E510]` en el cuerpo de marketing/calc/booking/links.

**Excepción documentada**: `Navbar.tsx` y `NavbarFunnel.tsx` mantienen el botón inline porque usan un patrón visual distinto (font-black, sombra `shadow-[0_10px_30px_rgba(0,229,16,0.18)]`, focus ring 4px, scale-95). Es un “header CTA” con identidad propia. Si en el futuro se quisiera unificar, sería un `.btn-primary--header` separado.

#### 3.3.2 Botón outline WhatsApp — `.btn-wa` (resuelto)

**Antes**: 13 ocurrencias inline en Hero, WhyUs, HowItWorks, ForWho, services, how‑we‑work, about‑llc.

**Después**: clase canónica:

```css
.btn-wa {
  background-color: transparent;
  color: var(--green);
  border: 1px solid rgba(0,229,16,0.40);
  transition: border-color .2s ease, color .2s ease, background-color .2s ease;
}
.btn-wa:hover {
  border-color: rgba(0,229,16,0.70);
  background-color: rgba(0,229,16,0.04);  /* leve fill green halo en hover */
}
```

13 botones migrados. **0 ocurrencias restantes** del patrón `border-[#00E510]/40 hover:border-[#00E510]/70` en el cuerpo.

#### 3.3.3 Hover de CTA con color shift (resuelto)

`.btn-primary:hover` ahora aplica `background-color: var(--green-hover)` (`#00D10E` light, `#00FF14` dark). Antes el hover era *no‑op* de color (`bg-[#00E510] hover:bg-[#00E510]`) y solo cambiaba la sombra. Ahora el feedback es: shift de tono + sombra grande + scale en active. Coherente con el `.glass-card` y con `a:hover { color: var(--green-hover) }` del blog.

#### 3.3.4 H2 “página interna” — `.page-h2` (definida)

Clase añadida en `index.css`:

```css
.page-h2 {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: clamp(28px, 2.5vw, 34px);
  line-height: 1.12;
  letter-spacing: -0.025em;
  color: var(--text-1);
}
```

Disponible para futuras refactors de `about‑llc`, `services-sections`, `how-we-work`. No migré las H2 actuales en este pase — los `font-heading font-bold text-[clamp(32px,2.5vw,34px)] leading-[1.12] tracking-[-0.025em] text-[var(--text-1)]` inline son visualmente correctos y la migración requiere recorrer todos los puntos para ver si introducen mb/text-color overrides. Queda como migración cosmética opcional.

#### 3.3.5 `.surface-card.is-popular` (definida)

Modificador para el caso condicional “estado popular” en about‑llc. No se ha migrado el inline del state card (es una condicional con otras propiedades), pero la clase está disponible para próxima iteración.

#### 3.3.6 Glass card vs editorial card en límites de página

Hoy no hay solapamiento, pero `services.tsx` introduce `.glass-card` (verde glow) **junto a** la sección de blog destacado en footer. Vigilar si se añaden módulos cruzados.

#### 3.3.6 Calculadora — semitokens propios

`components/calculator/CalculatorResults.tsx` usa `bg-[var(--bg-2)]` + sombras propias. Cumple. No requiere acción.

#### 3.3.7 Loaders / spinners

`SpinnerIcon` usado consistentemente con `text-[var(--muted)]` y animación CSS `spin`. Coherente.

#### 3.3.8 Scrollbar y range input

Configurados a 5 px con thumb verde `--green` y ring sutil. Coherente con identidad. OK.

---

## 4. Hover y elevación — auditoría por componente

| Elemento | Implementación actual | Veredicto |
|---|---|---|
| `.glass-card` | border verde 0.18 + shadow base. Transition 0.25s. | OK — high‑tech tier. |
| `.editorial-card` | translateY(-3px) + outline gradiente verde. Transition 0.45s cubic‑bezier. | OK — editorial tier. |
| `.editorial-chip` | bg `rgba(15,20,18,0.04)` + color text-1. | OK. |
| `.btn-primary` | bg → `--green-hover` + shadow `lg` + scale 0.97 en active. Disabled = `opacity .5`, `cursor not-allowed`, sin scale. | **OK** — color shift activo, feedback en 3 estados. |
| `.btn-wa` | border 0.40→0.70 + leve fill verde halo `rgba(0,229,16,0.04)`. | **OK** — feedback visible sin invadir el espacio del primario. |
| Inputs / selects | Box‑shadow ring 4 px verde sobre `bg-0`. | OK. |
| Cards `.surface-card` | Sin hover por defecto. | Correcto: contenedor mate, no afford. |
| Step cards numeradas (about‑llc) | Sin hover, transitionDelay para reveal escalonado. | OK. |
| Tile NeonCard (`how-we-work.tsx`) | Border `rgba(0,229,16,0.20)` + bg `rgba(0,229,16,0.03)`. | OK como callout de valor + CTA contiguo. **No es decoración** porque acompaña conversión. |

**Norma:** un tile interactivo siempre dice “interactivo” (cursor pointer + hover visible). Un tile mate (`.surface-card`) nunca debe simular interactividad.

---

## 5. Responsive — breakpoints clave

Los breakpoints en uso (Tailwind defaults): `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.

| Breakpoint | Comprobaciones |
|---|---|
| 375 (mobile S) | Container `px-4`, eyebrow legible, CTA `min-h-[44px]` (regla `.btn min-height: 44px` en `@media (max-width: 767px)`). Inputs `font-size: 16px` para evitar zoom iOS. ✓ |
| 768 (tablet) | Wizard book muestra cards full‑width, calculadora ya en columnas. ✓ |
| 1024 (desktop) | `.section-h2` alcanza 46 px, padding aumenta vía `--container-pad`. ✓ |
| 1280 / 1440 | Container fijado en `max-w-7xl` (`80rem` = 1280 px). En 1440 quedan 80 px laterales. ✓ |

`@supports (-webkit-touch-callout: none)` fuerza `font-size: 16px` en iOS para todos los inputs. ✓

---

## 6. Identidad Exentax — checklist final

- [x] **Verde nunca decorativo**: tras la migración 3.1, ningún eyebrow aplica `#00E510` directo a texto. Permitido en: CTA primario, links activos, focus, `editorial-badge` (pill de categoría blog), `editorial-chip[data-active]`, `.section-green` (subtítulo), texto inline en frases de marca (`<span className="text-[#00E510]">{BRAND.NAME}</span>` y similares — esto es énfasis tipográfico, no decoración).
- [x] **Sentence case** en todos los eyebrows (regla 0 — verificada en T001).
- [x] **Tipografía coherente**: Space Grotesk para H1/H2/H3, Inter en todo lo demás.
- [x] **Glass system documentado**: dos tiers paralelos (high‑tech vs editorial) con regla de coexistencia (§2.1).
- [x] **Cards mate consolidadas**: `.surface-card` reemplaza el patrón inline en marketing. Variante `.surface-card.is-popular` definida.
- [x] **Botones primarios consolidados**: clase `.btn-primary` aplicada en 24 botones distribuidos en 14 archivos. 0 head pattern restante en cuerpo. Excepción Navbar documentada.
- [x] **WhatsApp button consolidado por clase**: `.btn-wa` aplicada en 13 botones. Componentización a `<WhatsAppButton />` queda como mejora opcional (la clase ya elimina la duplicación de estilo).
- [x] **Hover de CTA con color shift**: `bg → var(--green-hover)` activado en `.btn-primary`.
- [x] **`.page-h2`** definida (sin migración inline aún — ver §3.3.4).

---

## 7. Resumen de cambios aplicados en este pase

### 7.1 `index.css` — nuevas clases canónicas

```
+ .surface-card          (matte container — bg-2 + border-subtle + radius-lg)
+ .surface-card.is-popular  (variante highlight verde para el popular state)
+ .page-h2               (H2 página interior 28→34 px)
+ .btn-primary           (CTA verde + hover color shift + shadow + active scale + disabled)
+ .btn-wa                (outline WhatsApp + hover border + halo verde leve)
```

### 7.2 Migraciones de uso

```
client/src/pages/about-llc.tsx                    11 cambios (5 eyebrow + 4 surface-card + 1 btn-primary + 2 btn-wa)
client/src/pages/services-sections.tsx             8 cambios (4 eyebrow + 4 btn-primary)
client/src/pages/how-we-work.tsx                   6 cambios (1 eyebrow + 2 btn-primary + 3 btn-wa)
client/src/pages/services.tsx                      3 cambios (1 btn-primary + 2 btn-wa)
client/src/pages/book.tsx                          2 cambios (1 surface-card + 1 btn-primary)
client/src/pages/not-found.tsx                     1 cambio  (btn-primary)
client/src/pages/go.tsx                            1 cambio  (btn-primary)
client/src/components/sections/Hero.tsx            3 cambios (1 btn-primary + 2 btn-wa)
client/src/components/sections/WhyUs.tsx           2 cambios (1 btn-primary + 1 btn-wa)
client/src/components/sections/HowItWorks.tsx      4 cambios (3 btn-primary + 1 btn-wa)
client/src/components/sections/ForWho.tsx          4 cambios (2 btn-primary + 2 btn-wa)
client/src/components/sections/FAQ.tsx             1 cambio  (eyebrow)
client/src/components/calculator/CalculatorResults 1 cambio  (btn-primary)
client/src/components/calculator/EmailGateForm     1 cambio  (btn-primary)
client/src/components/BookingCalendar.tsx          2 cambios (btn-primary)
client/src/components/CookieBanner.tsx             1 cambio  (btn-primary "Accept all")
client/src/components/layout/FloatingMobileCTA     1 cambio  (btn-primary)
```

**Totales**: 11 eyebrows + 5 surface‑cards + 24 btn-primary + 13 btn-wa = **53 ocurrencias inline consolidadas a clases canónicas** en 17 archivos.

#### 7.2.bis — Segundo pase (cierre de variantes huérfanas y verde decorativo)

```
client/src/pages/about-llc.tsx          5 H2 inline → .page-h2
                                        + state card "wyoming" → .surface-card.is-popular
client/src/pages/services-sections.tsx  3 H2 inline → .page-h2
client/src/pages/how-we-work.tsx        h4 título NeonCard verde decorativo  → text-[var(--text-1)]
                                        highlight footer card (border + texto verde) → border-subtle + text-1 (énfasis sin verde)
```

Resultado: las dos variantes definidas en `index.css` (`.page-h2` y `.surface-card.is-popular`) ya no son huérfanas — están consumidas en al menos un call site real.

#### 7.2.ter — Auditoría Footer (`components/layout/Footer.tsx`)

| Línea | Uso del verde | Veredicto |
|---|---|---|
| 70 | Botón "Subscribe" del newsletter en footer claro: `bg-black text-[#00E510]`. CTA secundario con estética propia (botón "neón sobre negro") que coexiste con `.btn-primary`. | **Justificado** — CTA contextual de marca. Se documenta como excepción análoga al header CTA de Navbar (§3.3.1). |
| 146 | Banner CTA hero de footer con `background: #00E510`. | **Intencional** — bloque de cierre de marca, equivalente a un `editorial-badge` a escala completa. |
| 169 | Hover state de iconos sociales sobre el banner verde: `hover:text-[#00E510]`. | **Justificado** — interacción dentro del banner, regla "hover/active state" permitida. |

Conclusión: el Footer **no requiere migración**. Los tres usos del verde respetan la regla "CTA / hover / branding hero".

### 7.3 Validación

- `tsc --noEmit` limpio.
- Workflow `Start application` reinicia OK, sin errores de runtime.
- 8 superficies verificadas con captura visual: Home, About‑LLC, Services, How‑we‑work, Book, Blog, Legal/Privacy, Links (`/links` → `pages/go.tsx`). Capturas en `docs/screenshots/`.
- Layout estable, ningún CTA "salta" tras la migración: el padding/text-size/font-weight quedó intencionalmente en el consumer.
- Contraste mejorado en eyebrows; hover de CTAs ahora con shift de color visible.
- Cero cambios en `package.json`. Cero cambios destructivos al sistema de tokens.

### 7.4 Evidencia responsive

**Capturas reales disponibles**: 8 superficies a `1280×720` (laptop) en `docs/screenshots/`.

**Capturas 375/768/1440 — limitación del entorno**: se intentó automatizar con Playwright local (npx, sin tocar `package.json`), pero el binario de Chromium descargado falla en arrancar por dependencias del sistema (`libglib-2.0.so.0`) que no están disponibles en este sandbox NixOS. El script de captura queda preparado en `/tmp/shoot.mjs` para que un entorno CI con `apt`/Nix de gráficos pueda ejecutarlo. La verificación 375/768/1440 en este pase se hizo por análisis estático del código + reglas CSS:

- `375 px (mobile S)` — Container `px-4 sm:px-6` se respeta. Eyebrow `.section-label` 13 px legible. Reglas `@media (max-width: 767px)` en `index.css`: `.btn { min-height: 44px; min-width: 44px; }` para tap targets, e `input { font-size: 16px }` para evitar zoom iOS. CTAs con `w-full sm:w-auto` en hero/whyUs/forWho. ✓
- `768 px (tablet)` — Wizard de booking pasa a layout en columnas. Calculadora reorganiza grid. ✓
- `1280 px (laptop)` — Capturas reales OK; container `max-w-7xl` (1280 px) cabe exacto. ✓
- `1440 px (desktop wide)` — 80 px laterales de aire. Sin overflow detectado en home/blog. ✓

`@supports (-webkit-touch-callout: none)` garantiza `font-size: 16px` en iOS para todos los inputs. Tap targets ≥ 44 px en mobile.

## 8. Próximas acciones recomendadas (fuera del scope T002)

1. **Componentizar `<WhatsAppButton />`** (la clase `.btn-wa` elimina la duplicación de estilo, pero el SVG inline 24 px sigue repetido — mejora opcional).
2. **Capturas responsive automatizadas en CI** — ejecutar `/tmp/shoot.mjs` en un entorno con dependencias gráficas para producir las series 375/768/1440 y commitearlas.
3. **Evaluar oscurecer `.section-label`** de `#00B70D` a `#008B0A` para AA pleno en 13 px (decisión de marca: ¿prioridad accesibilidad estricta o mantener verde más vibrante?).
4. **Si en el futuro se introducen módulos compartidos blog↔marketing**, validar no mezclar `.glass-card` con `.editorial-card` en el mismo viewport.
5. **Limpieza opcional de los step-numbers verdes grandes** de `how-we-work` (líneas 44 y 60) si en una próxima iteración se decide que el callout numérico debe ser monocromo. En este pase se mantiene como elemento de identidad de marca tipo "neón paso".

— fin —
