# COMPONENTS

## Librería base

- **shadcn/ui** sobre primitives Radix UI + tokens Tailwind 3 (mode `class` para dark mode).
- Iconografía: `lucide-react` para acciones; `react-icons/si` para logos de marca.
- Tipografía y radii configurados en `tailwind.config.ts` y `client/src/index.css` (CSS variables HSL sin wrapper).

## Layout y rutas

- Routing: `wouter` con lazy-load por página vía `React.lazy` + `Suspense`.
- Páginas en `client/src/pages/`; sidebar admin en `client/src/components/admin/`; layout público en `client/src/components/layout/`.

## Estado y datos

- `@tanstack/react-query` v5 (object-form únicamente). Query keys jerárquicos como arrays para invalidaciones quirúrgicas.
- Mutaciones a través de `apiRequest` (`@/lib/queryClient`) con invalidación explícita por queryKey.
- Formularios: `useForm` (shadcn) + `zodResolver` + esquemas insert de `@shared/schema`.

## Convenciones

- **TypeScript estricto.** `npm run check` falla a la primera al menor `any` no marcado o prop sin tipo.
- **`data-testid` obligatorio** en cada elemento interactivo y en los que muestran datos significativos. Patrones: `{action}-{target}`, `{type}-{content}`, `{type}-{description}-{id}` para listas.
- **i18n.** Toda cadena visible pasa por `t()`. Placeholders dentro de la cadena, sin concatenaciones (`scripts/i18n-check` lo prohíbe).
- **No hardcoded text** en `aria-label`, `title`, `alt` — el lint atributos lo valida.
- Imports de assets usuario vía `@assets/...`.

## Componentes destacados

- `client/src/components/blog/ArticleCTA.tsx` — CTA primario/secundario del post; usa `blogPost.ctaBook` y `blogPost.ctaSecondary` (añadida en las 6 locales el 2026-04-22).
- `client/src/components/seo/` — JSON-LD, OpenGraph, Twitter Cards, hreflang client-side fallback (la fuente de verdad es server-side en `server/routes/public.ts`).
- `client/src/components/calculator/` — calculadora fiscal con e2e dedicado (`npm run test:calculator`).
- `client/src/components/discord/` y `client/src/pages/admin/` — operación admin via bot Discord (slash commands + interactions Ed25519).

## Inventario detallado

Ver `docs/component-inventory.md` para el árbol completo y `docs/architecture-map.md` para el mapa de carpetas.
