# 08 — Cierre técnico (Tarea #23)

Fecha: 2026-04-30
Alcance: URLs, slugs, navegación, i18n, componentes y limpieza final.
Resultado global: ✅ PASS — todas las verificaciones automáticas en verde,
fix puntual aplicado al cambio de idioma.

---

## 1. Slugs por idioma — `shared/routes.ts`

Auditados los 18 `RouteKey` × 6 idiomas (108 slugs en total).

- ✅ Sin acentos en ningún slug (`rg "[áéíóúàèìòùâêîôûäëïöüñç]" shared/routes.ts` → 0 hits).
- ✅ Sin guiones bajos, todos en minúscula y separados por guion.
- ✅ Sin colisiones: `slugToRouteMap` se construye sin sobrescrituras.
- ✅ Sub-rutas anidadas coherentes por idioma:
  - `servicios/*` (es), `services/*` (en, fr), `leistungen/*` (de),
    `servicos/*` (pt), `serveis/*` (ca).
  - `legal/*` igual en los 6 idiomas con la palabra siempre traducida.
- ✅ El `home` queda como `/{lang}` (slug vacío) — coherente con
  `getLocalizedPath` y el `RootRedirect` del `App.tsx`.
- ✅ `legacy-redirects.json` cubre los renombrados clave (`/blog`, slugs
  alemanes con `ae/oe/ue`, ruta antigua `/{lang}/llc-en-wyoming`,
  alias `/calculadora` → `/{lang}#calculadora`).

No se necesitan cambios en slugs en esta tarea.

---

## 2. Navegación end-to-end

Recorrido manual + lectura de los componentes clave:

- `Navbar.tsx`, `NavbarFunnel.tsx`, `Footer.tsx`, `Layout.tsx`,
  `LegalLayout.tsx`, `FloatingMobileCTA.tsx`, `FloatingWhatsApp.tsx`.
- Todos los enlaces se construyen vía `useLangPath(...)` apuntando a
  `RouteKey`s declarados en `shared/routes.ts`. No hay rutas hard-coded
  por idioma fuera de `routes.ts`.
- `LanguageSwitcher.tsx` (desktop) y el `MobileInlineLangSwitcher`
  embebido en `Navbar.tsx` usan `getEquivalentPath(location, lang)`.

### 🔧 Fix aplicado: el switcher perdía `?query` y `#hash`

`useLocation()` de wouter devuelve sólo el pathname, así que la
navegación que hacía el switcher descartaba el query string y el hash
(p.ej. al cambiar de idioma desde `/es#calculadora` se aterrizaba en
`/en` plano). Se centraliza la lógica en un nuevo helper en
`shared/routes.ts` para que las dos entradas (desktop + mobile) no
puedan divergir nunca:

```ts
export function getEquivalentUrl(currentPath, targetLang, search = "", hash = "")
```

Cambios en:

- `shared/routes.ts` (nuevo `getEquivalentUrl` documentado).
- `client/src/components/LanguageSwitcher.tsx` (usa el helper).
- `client/src/components/layout/Navbar.tsx` (`MobileInlineLangSwitcher`
  usa el helper, y se elimina la `langPrefixRe` muerta).

`legacy-redirects.ts` ya preservaba el query string en sus 301, así que
no había nada que tocar en server-side.

Se añade `tests/get-equivalent-url.test.mjs` con 5 casos cubriendo
query+hash, sólo hash, sólo query, fallback sin extras y rutas blog
con sub-slug. Se engancha al script `npm run test:redirects` (que ya
forma parte de `check:serial`).

---

## 3. i18n — calidad y consistencia

Resultados de las verificaciones automatizadas:

| Script                         | Resultado |
| ------------------------------ | --------- |
| `npm run i18n:check`           | ✅ PASS    |
| `npm run lint:i18n-extended`   | ✅ PASS    |

Detalles relevantes (informe completo en consola):

- 0 keys faltantes, 0 keys huérfanas, 0 valores vacíos, 0 mismatches
  de placeholders, 0 violaciones de glosario, 0 leaks de español en
  otros idiomas, 0 strings idénticos a ES (excluyendo numéricos /
  marcas / URLs), 0 hardcoded user-visible strings.
- Native-quality audit (en, fr, de, pt, ca): 0 violaciones.
- Blog translation extended: 0 hallazgos.
- Glosario uniforme de "asesoría": las CTAs y descripciones de servicio
  usan "asesoría" en ES y los equivalentes nativos en cada idioma.
  "consultoría" se conserva sólo en `CalculatorResults.tsx` para
  describir un sector profesional (uso correcto, no cabe traducirlo
  como "asesoría").

No se requieren cambios manuales en los locales.

---

## 4. Componentes y archivos

Inventario completo de `client/src/components/**` (47 componentes) y
verificación de uso vía `rg`. Cada componente tiene al menos una
referencia (importación estática, `lazy()` o uso interno):

- `Calendar.tsx` → usado en `pages/booking.tsx`.
- `CountryFlagImg.tsx` → usado en `components/blog/CountryDropdown.tsx`.
- `calculator/IrpfBracketsTable.tsx`, `calculator/BrandIcons.tsx`,
  `calculator/EmailGateForm.tsx`, `calculator/AnimatedNumber.tsx`,
  `calculator/CalculatorResults.tsx`, `calculator/index.tsx` → todos
  usados.
- `sections/HeroStats.tsx` → about-llc, how-we-work, services.
- `sections/Origin.tsx` → home.
- `sections/Testimonials.tsx` → home (`lazy()`).
- `sections/faq-data.tsx` → FAQ.tsx, faq-page.tsx.
- Resto: layout, blog, ui (todos enlazados).

Hooks (`client/src/hooks/*`) y libs (`client/src/lib/*`) también
verificados — todos tienen consumidores reales.

Pages (`client/src/pages/*`) verificadas: `services-sections.tsx` se
carga vía `lazy()` desde `services.tsx`; el resto está mapeado a
través de `pageImports` y `PAGE_COMPONENTS` en `App.tsx`.

Archivos co-ubicados con tests (`server/discord-alerts.test.ts`) se
conservan: el header documenta que se ejecutan vía `npx tsx` y se
prevé su integración en CI más adelante.

No hay archivos huérfanos para borrar en esta tarea.

---

## 5. Tests automatizados ejecutados

| Script                         | Resultado |
| ------------------------------ | --------- |
| `tsc` (sin emit)               | ✅ 0 errores |
| `npm run i18n:check`           | ✅ PASS    |
| `npm run lint:i18n-extended`   | ✅ PASS    |
| `npm run test:redirects`       | ✅ 14/14 OK (9 legacy + 5 nuevos para `getEquivalentUrl`) |

`npm run audit:bundle` se omite en este informe (requiere build
completo) — no aplican cambios al runtime que afecten al bundle más
allá de las dos líneas concatenando `search + hash` en el switcher de
idioma.

---

## 6. Diff final (resumen)

```
shared/routes.ts                                    | +18 -0
client/src/components/LanguageSwitcher.tsx          | +3 -2
client/src/components/layout/Navbar.tsx             | +3 -4
package.json                                        | +1 -1  (test:redirects)
tests/get-equivalent-url.test.mjs                   | nuevo
docs/audits/produccion-2026-04/08-cierre-tecnico.md | nuevo
```
