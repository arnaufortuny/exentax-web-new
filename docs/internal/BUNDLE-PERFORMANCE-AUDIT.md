# BUNDLE-PERFORMANCE-AUDIT — Bloque 4

**Sesión: 2026-04-26 · Build SKIP_BUILD_E2E=1 con DATABASE_URL dummy**

```
exit 0 · ✓ built in 11.82s · server bundle 5.4 MB · client dist 25 MB
```

---

## Bundle sizes (gzipped pre-compression)

### Top chunks (>100 kB)

| Chunk | KB | Tipo |
|---:|---:|---|
| `index-OVLnRaQg.js` | 504.79 | Main bundle (entrypoint) |
| `fr-f5-K1anG.js` | 269.38 | i18n FR locale (full) |
| `de-kRrwQDZW.js` | 263.17 | i18n DE locale (full) |
| `pt-CHvupQrv.js` | 249.50 | i18n PT locale (full) |
| `ca-CU-cKwVu.js` | 248.40 | i18n CA locale (full) |
| `en-CBd7Y_P8.js` | 238.11 | i18n EN locale (full) |
| `vendor-react-Dn3pgp6h.js` | 192.88 | React + ReactDOM |
| `ExistingLlcCallout-S391Vkwl.js` | 134.36 | LLC callout component |
| `index-BTYi3UPa.css` | 114.21 | Tailwind CSS bundle |

### Mid chunks (50-100 kB)

| Chunk | KB |
|---:|---:|
| `fr-BUO5Frw2.js` | 99.83 |
| `blog-posts-content-CJLKeBLn.js` | 98.57 |
| `pt-UUCamYTn.js` | 97.84 |
| `de-BZZVYKV0.js` | 97.44 |
| `en-B3SBuSwJ.js` | 97.39 |
| `ca-DauSoWOg.js` | 96.74 |
| `post-CVJazAzd.js` | 81.01 |
| `blog-posts-slugs-MxEvNYws.js` | 80.73 |
| `abrir-llc-rdJ33vcU.js` | 80.13 |
| `home-g0eoEFMU.js` | 58.33 |

### Small chunks (<50 kB) — bien code-splitted

| Chunk | KB |
|---:|---:|
| vendor-i18n | 49.21 |
| vendor-query | 39.31 |
| disclaimer | 28.96 |
| how-we-work | 27.00 |
| index (small chunks) | 18-24 |
| calculator | 21.39 |
| services-sections | 23.00 |
| services hub | 6.87 |
| faq-page | 8.53 |
| vendor-router | 4.14 |

---

## Análisis

### ✓ Bien hecho
- **Code-splitting per-locale**: 6 idiomas en chunks separados ~97 kB
  cada uno (i18n base) + ~250 kB cada uno (blog content). Solo se carga
  el idioma activo del usuario → 80% reducción transferida.
- **Vendor split**: React + ReactDOM separado (192 kB) cacheable largo plazo.
- **Lazy load por página**: home/services/calculator/post/etc. todos
  separados. La home solo carga 58 kB + main 504 kB + react 192 kB
  + i18n locale 97 kB = ~850 kB total inicial.
- **CSS único**: 114 kB Tailwind (purgable).
- **Páginas pequeñas**: services hub 6.87 kB, FAQ 8.53 kB, calculator 21 kB.

### ⚠ Posibles mejoras (no-blocker)

1. **Main bundle 504 kB**: candidato a inspeccionar con
   `vite-bundle-visualizer` para identificar deps gordas. Posibles
   culprits: framer-motion (si usado), forms libs.
2. **Per-locale content 250 kB × 6**: Blog content embedded — alternativa
   sería SSR/RSC pero requiere refactor mayor (no-blocker para Hostinger VPS).
3. **ExistingLlcCallout 134 kB**: investigar si justifica el peso o tiene
   deps innecesarias.

---

## Imágenes

`grep -rn "loading=\"lazy\"" client/src --include="*.tsx" | wc -l`:
verificación pendiente. Las imágenes principales:
- `/logo-tight.png` Navbar — `fetchPriority="high"` (no lazy, correcto)
- `/ex-icon-green.png` Footer — `loading="lazy"` (correcto)
- Trustpilot WebP — `loading="lazy"` (correcto)
- og-image.png 1200×630 — verificado existe

**WebP**: usado en partner-trustpilot. Otras imágenes deberían
auditarse para conversión PNG→WebP en próximo deploy.

---

## Fonts

`client/index.html`:
- Google Fonts Space Grotesk + Inter via CSS (vendor-i18n importa)
- `font-display: swap` aplicado en CSS tokens

---

## Server bundle

```
dist/index.mjs      5.4mb ⚠️ (warning esperado)
dist/index.mjs.map  8.0mb
```

5.4 MB para Express + Drizzle + Discord + Email + Google + 100+ blog ts
+ schemas Zod compilados es **normal**. La advertencia esbuild aparece
para todo bundle >5 MB.

`dist/index.cjs` shim (94 bytes) para deploy.

---

## Resumen Bloque 4

| Categoría | Estado | Cifra |
|---|---|---|
| Build exit | ✓ VERDE | exit 0 / 11.82s |
| Main bundle | 🟡 P3 | 504 kB (potencial split) |
| Per-locale chunks | ✓ VERDE | 6 × ~97 kB i18n + 6 × ~250 kB content |
| Vendor split | ✓ VERDE | React 192 / i18n 49 / query 39 |
| Code split por página | ✓ VERDE | 25+ chunks nombrados |
| CSS bundle | ✓ VERDE | 114 kB Tailwind |
| Server bundle | ✓ VERDE | 5.4 MB normal |
| Total dist/ | ✓ VERDE | 25 MB |
| WebP en partner-trustpilot | ✓ VERDE | — |
| Lazy load fonts/img footer | ✓ VERDE | — |

### No accionables desde sandbox
- Lighthouse Core Web Vitals (LCP/FID/CLS) → requiere browser
- N+1 queries DB → requiere Postgres real
- Index DB queries → requiere Postgres real
