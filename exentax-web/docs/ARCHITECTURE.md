# ARCHITECTURE

> La fuente autoritativa y viva del mapa de carpetas, rutas, esquemas e integraciones es **`docs/architecture-map.md`**. Este documento es un punto de entrada resumido.

## Visión rápida

- **Aplicación full-stack en un único proceso Node 20+.** Express 5 (ESM) sirve la API y delega el frontend al middleware Vite en dev / a los assets compilados en prod.
- **Frontend:** React 19 + Wouter (lazy por ruta) + TanStack Query v5 + i18next (es/en/fr/de/pt/ca) + Tailwind 3 con tokens shadcn.
- **Backend:** Express + Drizzle ORM (Postgres) + Zod (validación) + Helmet/Compression. Sitemaps, robots y endpoints de SEO en `server/routes/public.ts`.
- **Integraciones:** Gmail API (envío con cola persistente de reintentos), Google Calendar/Meet (booking), Search Console + Indexing API, IndexNow, Discord Bot REST + Interactions Ed25519, Redis opcional.

## Carpetas

```
exentax-web/
├── client/
│   ├── public/                       Assets servidos tal cual (incl. <indexnow-key>.txt).
│   └── src/
│       ├── components/               UI (shadcn + dominio: blog, calculator, seo, admin, layout).
│       ├── data/
│       │   ├── blog-content/{lang}/  111 artículos × 6 idiomas (filename = slug ES base).
│       │   ├── blog-i18n/{lang}.ts   Meta por idioma (title, excerpt, og*, keywords).
│       │   ├── blog-posts.ts         Índice canónico de posts ES.
│       │   └── blog-posts-slugs.ts   BLOG_SLUG_I18N (vivo) + BLOG_SLUG_LEGACY_I18N (redirects).
│       ├── i18n/locales/{lang}.ts    UI strings.
│       ├── lib/                      utilidades client (queryClient, fetchers, ...).
│       └── pages/                    rutas SPA wouter.
├── server/
│   ├── index.ts                      Bootstrap (logger, helmet, sessions, sitemaps).
│   ├── routes/                       handlers públicos y admin.
│   ├── google-*.ts, indexnow.ts      integraciones SEO.
│   └── ...
├── shared/
│   ├── schema.ts                     Drizzle schema + insertSchema/insert types/select types.
│   └── ...                           constantes, helpers cross-cutting.
├── scripts/                          Puertas CI: typography, brand-casing, blog gates,
│                                     sitemap-check, masterpiece-audit, source-url-verify, etc.
└── docs/                             Documentación (ver lista abajo).
```

## Rutas críticas server-side

| Ruta | Origen | Notas |
| --- | --- | --- |
| `/sitemap.xml` | `server/routes/public.ts` | Index → `sitemap-pages`, `sitemap-blog`, `sitemap-faq` |
| `/sitemap-blog.xml` | idem | 666 URLs (111 × 6 idiomas) + 6 índices · BCP-47 hreflang + x-default |
| `/sitemap-pages.xml` | idem | Páginas + sub-páginas × 6 |
| `/sitemap-faq.xml` | idem | Deep-links FAQ por idioma |
| `/robots.txt` | idem | Allow `/`, expone los 4 sitemaps |
| `/<indexnow-key>.txt` | `server/indexnow.ts` | Servido desde `client/public/` |

## Documentos relacionados

- `docs/architecture-map.md` — mapa exhaustivo, **siempre la fuente de verdad**.
- `docs/data-flow.md` — diagrama de flujos clave.
- `docs/route-map.md` — todas las rutas SPA + API.
- `docs/component-inventory.md` — inventario de componentes.
- `docs/SETUP.md`, `docs/SEO.md`, `docs/TRADUCCIONES.md`, `docs/COMPONENTS.md`, `docs/CHANGELOG.md` — entradas temáticas.
