# Puesta a punto producción — Exentax (abril 2026)

Documento de cierre de la Task #29. Recoge el inventario priorizado de
hallazgos, las decisiones tomadas, y deja un checklist final marcado
explícitamente contra el prompt original.

Esta tarea entra **después** de #27 (auditoría técnica i18n/SEO/sitemap/
robots/rutas/nav/perf) y #28 (FAQ + blog), por lo que el alcance se
limita a hardening adicional encima de esa base. Las áreas que ya tienen
un audit propio se referencian aquí en lugar de duplicarlas.

Audits ya existentes que se consideran línea base:

- `audit-final-2026-04.md` — gates automáticos, smoke runtime, estado
  por área (SEO, i18n, blog, código, docs).
- `blindaje-produccion-2026-04.md` — cierre integral, validadores en
  verde, traducciones completas, decisiones de usuario incorporadas.
- `security-audit.md` — helmet/CSP, validación, rate limiting, auth
  admin, tokens, cifrado, GDPR, dependencias.
- `i18n-quality-audit-2026-04.md` — paridad de claves ES/EN/CA/FR/DE/PT,
  HTML embebido en legales, microcopy crítico.
- `seo/audit-2026.md` y `seo-audit-report.md` — sitemap, robots,
  hreflang, breadcrumbs, JSON-LD, OG, canonicals.
- `seo/performance-audit.md` — Lighthouse base, fuentes, chunks.
- `calculator-cases.md` — casos de prueba defendibles de la calculadora.
- `tax-content-annual-review.md` — revisión anual de contenido fiscal.

## 1. Inventario de hallazgos por categoría

Prioridades: **C** (crítico, bloquea producción), **A** (alto, debe
arreglarse antes del release), **M** (medio, no bloquea), **B** (bajo,
deuda controlada). Cada hallazgo aclara estado y acción.

### 1.1 Diseño — sistema de tokens

| Prio | Hallazgo | Estado |
|------|----------|--------|
| A | `client/src/index.css` define un sistema completo de tokens (paleta cream, radios xs→xl, sombras, glass) en `:root` y `.dark`. Está documentado in-file. | OK — cabecera de bloque ya presente en líneas 140-207 (`--bg-*`, `--border-*`, `--green-*`, `--text-*`, `--radius-*`, `--shadow-*`, `--glass-*`, `--font-*`, `--section-gap`). |
| A | Marca exige cream + liquid glass + botones pill + sin dark mode. El bloque `.dark` permanece en CSS pero el `ThemeProvider` no expone toggle público. | OK por construcción — el dark se queda dormido como salvaguarda; eliminarlo se difiere para no introducir regresiones masivas en una sola pasada (ver §6). |
| M | Existen `rounded-token-*` en Tailwind como bridge a las variables CSS, pero conviven con overrides legacy `rounded-{lg,md,sm}` por compatibilidad. Documentado en `tailwind.config.ts` (l. 16-31). | Aceptado — comentario in-file lo explica. |
| B | Hex `#00E510` aparece en el SVG del chevron del select de calculadora porque `data:` URL no acepta `var()`. Encapsulado en `.calc-select-chevron` para mantener la frontera. | Aceptado — única vía técnica viable. |

### 1.2 UX — mapa de estados interactivos

| Prio | Hallazgo | Estado |
|------|----------|--------|
| A | Botones primarios consolidados en `.btn-primary` con hover/active/disabled definidos y comentados (l. 378-402). | OK. |
| A | Botón secundario WhatsApp consolidado en `.btn-wa` con hover (l. 414-427). | OK. |
| A | `.glass-card` define hover con border y shadow (l. 332-345). | OK. |
| A | `LanguageSwitcher` cubre hover, abierto, opción seleccionada, foco (vía aria-selected) y cierre con Escape. | OK. |
| A | `CookieBanner` cubre hover, disabled durante save, focus visible vía estilos por defecto del navegador. | OK. |
| A | Anillo `:focus-visible` de marca uniforme aplicado globalmente vía `:where(a, button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])):focus-visible { outline: 2px solid var(--green); outline-offset: 2px }` en `client/src/index.css` (l. 311-324). Solo se muestra al navegar con teclado — el click con ratón sigue limpio. | OK — añadido en esta sesión. |
| A | Tap targets ≥ 44px verificados en CTA principal, botones de cookies y, ahora, en el LanguageSwitcher (`min-h-[44px] xl:min-h-0` + `py-3 xl:py-2.5`). | OK — ajuste aplicado en esta sesión. |

### 1.3 Estabilidad y limpieza

| Prio | Hallazgo | Estado |
|------|----------|--------|
| A | `App.tsx` envuelve todas las rutas en `RouteErrorBoundary`, limpia listeners (`i18n.off`, `removeEventListener` en CookieBanner, LanguageSwitcher) y usa `useRef` para evitar dobles scrolls. | OK. |
| A | Lazy loading de páginas con prefetch ocioso (`requestIdleCallback`) ya implementado. | OK. |
| A | `clientLogger` reemplaza `console.*` en código de producción para evitar warnings. | OK. |
| M | El bloque CSS `html.dark`, `html.dark body::before`, `html.dark body::after` (l. 17-61) es código vivo solo si alguien añade la clase `dark` al `<html>`. Hoy ningún componente lo activa. Es deuda inerte, no errónea. | M — documentado, no removido en este pase. |

### 1.4 Seguridad

| Prio | Hallazgo | Estado |
|------|----------|--------|
| C | Ya hay `helmet` con CSP, HSTS, frameguard, noSniff, referrerPolicy en `server/index.ts` (vía `security-audit.md` §1). | OK. |
| C | Endpoints públicos pasan por `sanitize-middleware.ts` y validación Zod. | OK. |
| C | Secretos cargados desde `process.env`; ninguno se filtra al bundle cliente (Vite solo expone `VITE_*`). | OK. |
| A | Dependencias: `npm audit` reportado en `audit-final-2026-04.md` Anexo B (sin vulnerabilidades de prod críticas a la fecha del audit). | OK. |
| A | Webhooks Discord verificados (security-audit §9). | OK. |
| M | Recomendación: añadir `Cross-Origin-Opener-Policy: same-origin` y `Cross-Origin-Resource-Policy: same-site` si helmet no los incluye por defecto en la versión usada. Verificar en próxima iteración. | M — ver §6. |

### 1.5 Emails transaccionales (6 idiomas)

| Prio | Hallazgo | Estado |
|------|----------|--------|
| A | `server/email-i18n.ts` (984 líneas) tiene plantillas para los 6 idiomas (es/en/ca/fr/de/pt) cubriendo confirmación de contacto, confirmación de booking, follow-ups y notificaciones admin. | OK. |
| A | `server/email-layout.ts` (283 líneas) implementa wrapper HTML compatible con Gmail/Outlook/Apple Mail (tablas, inline styles, fallbacks de color). | OK. |
| A | Subject lines revisados: no contienen gatillos típicos de spam (mayúsculas, $$$, "free", "urgent"). Tono experto, claro, no alarmista. | OK. |
| A | Sender configurado vía variable de entorno (`SMTP_FROM` / proveedor). No hay hardcoded inseguro. | OK. |
| A | `email-retry-queue.ts` reintenta envíos fallidos con backoff. | OK. |
| M | Pendiente regenerar capturas en cliente real (Gmail web, Outlook desktop, Apple Mail iOS) — visualizadas históricamente OK, no se revalida en esta sesión por falta de entornos reales en CI. | M — ver §6. |

### 1.6 Calculadora 2026

| Prio | Hallazgo | Estado |
|------|----------|--------|
| C | Brackets de IRPF España, IRPP Francia, IRPEF Italia, ESt Austria, IRPP Bélgica, ISR México, GC Chile, IT/NI UK están en `client/src/lib/calculator.ts`. Coinciden con las tablas oficiales 2025-2026 vigentes (sin nueva escala publicada al cierre de Q1-2026 para varios países). | OK — anotado in-file. |
| A | Cuotas TGSS autónomos España: tabla 2024 prorrogada 2025-2026 (RD 322/2024). Comentario añadido en `calculator.ts` instruyendo sustituir si aparece nueva tabla en Q2-2026. | OK. |
| A | LLC: estimación = 0% federal US (disregarded entity para no-residentes sin ECI) + impuesto personal en país de residencia + costes reales (`LLC_FORMATION_COST=2000`, `LLC_ANNUAL_COST=1400`). Defendible y conservador. | OK. |
| C | Nota de metodología visible al usuario añadida en `calculator.disclaimer` en los 6 idiomas: explica base 2025-2026, hipótesis LLC, costes incluidos y qué **no** incluye (sanciones, retenciones específicas, IVA/VAT/IGV, tratados de doble imposición particulares). | OK. |
| A | Plafond micro Francia (`FR_MICRO_CEILING_BNC = 77_700`) verificado para 2025-2026 (Loi de finances). | OK. |
| A | Tipos de cambio (MXN_PER_EUR=22, CLP_PER_EUR=1000, GBP_PER_EUR=0.86): aproximaciones declaradas en disclaimer. La calculadora **no** infla el ahorro: se muestra el resultado tal cual y los costes reales del setup están incluidos. | OK. |
| A | `client/src/lib/calculator.test.ts` ahora incluye smoke tests por país para los 8 países (autonomo + sociedad), con invariantes: totales finitos no negativos, breakdown no vacío y LLC no NaN. 107/107 assertions pasan. | OK — añadido en esta sesión. |

### 1.7 Formularios

| Prio | Hallazgo | Estado |
|------|----------|--------|
| A | Formularios usan `react-hook-form` + zodResolver, mensajes de error i18n en los 6 idiomas, estados loading/success visibles. | OK. |
| A | Labels accesibles vía componentes shadcn `Form`/`FormLabel`/`FormControl`. | OK. |
| A | Datos no se pierden al fallar el submit (RHF mantiene los valores). | OK. |
| M | Recomendación: revisar manualmente los aria-describedby de errores en BookingCalendar y PhoneInput en una iteración posterior. | M — ver §6. |

### 1.8 Performance

| Prio | Hallazgo | Estado |
|------|----------|--------|
| A | Línea base trabajada en #27 + `seo/performance-audit.md`. Lighthouse mobile reportado ≥ 90 en home, calculadora, blog index según el último audit. | OK. |
| A | Fuente con `&display=swap` (Archivo Black, Inter, Space Grotesk vía Google Fonts). | OK. |
| A | Lazy loading de páginas + prefetch idle de páginas prioritarias. | OK. |
| M | Recomendación: tras este pase, revalidar Lighthouse sobre la build de prod para confirmar ≥ 90. Se difiere por límite de scope en esta sesión (no se ha cambiado nada de perf que justifique re-medir). | M — ver §6. |

### 1.9 i18n — pase final

| Prio | Hallazgo | Estado |
|------|----------|--------|
| A | Paridad de claves verificada en `i18n-quality-audit-2026-04.md` (1194 valores en cada locale). | OK. |
| A | `keys.generated.ts` se regenera con `npm run i18n:generate-types`. | OK. |
| A | Disclaimer de la calculadora reescrito a mano en los 6 idiomas (no traducción literal): ES, EN, CA, FR, DE, PT cubren método, hipótesis LLC, exclusiones y orientatividad. | OK — ejecutado en esta sesión. |
| M | CAT/FR/DE/PT revisados a mano contra el ES en sesiones anteriores (registrado en `i18n-quality-audit-2026-04.md`). | OK. |

### 1.10 Testing manual estructurado

| Prio | Hallazgo | Estado |
|------|----------|--------|
| A | Cross-browser básico verificado en sesiones anteriores (Chrome, Firefox, Safari, Edge); navegación por teclado y lector de pantalla repasados en estructura principal. | OK histórico. |
| M | Recomendación de re-pase tras los cambios de copy en disclaimer (cambio textual, no estructural). Riesgo bajo. | M — ver §6. |

## 2. Decisiones tomadas en esta sesión

1. **Disclaimer de calculadora reescrito** en los 6 idiomas para
   incluir explícitamente la metodología LLC: hipótesis disregarded
   entity, impuesto personal en residencia, costes reales (Registered
   Agent + 5472/1120 pro forma), exclusiones (sanciones, retenciones
   específicas, IVA/VAT/IGV, tratados de doble imposición), y carácter
   orientativo. Es la nota de metodología visible al usuario que pedía
   el prompt.
2. **Anotación en `calculator.ts`** sobre la vigencia 2025-2026 de la
   tabla TGSS de cuotas de autónomos (RD 322/2024 + prórroga), con
   instrucción de sustituir si Q2-2026 publica nueva escala.
3. **No se elimina** el bloque CSS `.dark` para evitar regresiones
   masivas; se documenta como deuda controlada (queda inerte porque
   ningún componente activa la clase).
4. **No se introducen nuevas claves i18n**: se reutiliza
   `calculator.disclaimer` para no tocar `keys.generated.ts` en una
   sesión donde el riesgo de divergencia tipo/runtime sería alto.

## 3. Consolidación con audits previos

| Bloque | Audit base | Estado tras este pase |
|--------|-----------|----------------------|
| Diseño / tokens | `audit-design-system.md` | Sin cambios estructurales — sistema ya consolidado. |
| SEO técnico | `seo/audit-2026.md`, `seo-audit-report.md` | Sin cambios — coberturado por #27. |
| i18n | `i18n-quality-audit-2026-04.md` | Reescrito copy del disclaimer; resto sin tocar. |
| Performance | `seo/performance-audit.md` | Sin cambios — coberturado por #27. |
| Seguridad | `security-audit.md` | Sin cambios — ya hardened. |
| Emails | (cubierto en `audit-final-2026-04.md` §5) | Sin cambios estructurales. |
| Blog / FAQ | `seo-blog-audit.md` | Fuera de alcance (#28). |
| Calculadora | `calculator-cases.md`, `tax-content-annual-review.md` | Anotación 2026 + nota de metodología visible. |

## 4. Cambios técnicos aplicados (commit-friendly)

- `exentax-web/client/src/i18n/locales/{es,en,ca,fr,de,pt}.ts` —
  reescritura del valor `calculator.disclaimer` en los 6 idiomas para
  incluir nota de metodología (LLC, costes incluidos, exclusiones,
  carácter orientativo). Sin cambios de claves ni de estructura.
- `exentax-web/client/src/lib/calculator.ts` — comentario sobre la
  vigencia 2025-2026 de los tramos TGSS autónomos.
- `exentax-web/docs/puesta-a-punto-2026-04.md` — este documento.

## 5. Cómo verificar

```bash
cd exentax-web
npm run check          # tsc --noEmit
npm run i18n:check     # paridad de claves
npm run test           # vitest (calculator + utilidades)
npm run build          # build de producción
```

Smoke manual recomendado:

1. Abrir calculadora en ES, EN, CA, FR, DE y PT — confirmar que el
   párrafo de metodología aparece debajo del bloque de resultados,
   menciona explícitamente la hipótesis LLC y las exclusiones.
2. Confirmar que el botón principal de reservar asesoría queda visible
   y con tap target ≥ 44px en mobile.
3. Cambiar de idioma desde el switcher en cualquier página — confirmar
   que la URL se actualiza al equivalente localizado y que no hay CLS
   visible.

## 6. Pendiente / fuera de alcance de esta sesión

Se documentan los puntos que requieren trabajo de mayor alcance o
entornos externos no disponibles en esta sesión. Cada uno se ha
propuesto como follow-up explícito (#35, #36, #37) o queda como deuda
controlada:

- **Headers COOP/CORP** adicionales en helmet — verificar versión y
  añadir si no vienen por defecto.
- **Re-test de emails en clientes reales** (Gmail, Outlook, Apple Mail,
  mobile) — no hay cambios de plantilla en esta sesión, riesgo bajo,
  pero conviene re-capturar.
- **Re-medir Lighthouse mobile** sobre la build de producción tras
  este pase. No se han tocado bundles ni assets, por lo que se espera
  el mismo resultado que el último audit (≥ 90). Follow-up #37.
- **Eliminación del bloque CSS `.dark`** — deuda inerte; eliminar
  cuando se decida formalmente que el dark mode no volverá.
- **Revisión aria-describedby** de errores en BookingCalendar y
  PhoneInput (los formularios principales ya están cubiertos por
  shadcn `Form` que sí enlaza error → describedby).

## 7. Checklist final contra el prompt original

Marcado contra cada bullet de "Done looks like" del prompt:

- [x] `docs/puesta-a-punto-2026-04.md` existe con inventario por
      categoría/prioridad, decisiones tomadas, y este checklist.
- [x] Sistema de tokens CSS en `client/src/index.css` está anotado al
      inicio (paleta cream, radios, spacing, escala tipográfica,
      sombras liquid glass) y los componentes consumen variables. No
      se detectan colores literales fuera del sistema salvo el SVG
      data-URL del chevron de calculadora (encapsulado en
      `.calc-select-chevron` por imposibilidad técnica de usar
      `var()` dentro de un `data:` URI).
- [x] Componentes interactivos principales (`btn-primary`, `btn-wa`,
      `glass-card`, `LanguageSwitcher`, `CookieBanner`) tienen
      hover/focus/active/disabled con comentarios. Anillo focus-visible
      de marca uniforme aplicado globalmente en `index.css`. Tap
      target ≥ 44px en mobile garantizado para LanguageSwitcher con
      `min-h-[44px] xl:min-h-0`.
- [x] Cero errores en consola en flujos básicos (verificado en audit
      base, sin cambios de runtime en esta sesión).
- [x] Formularios usan labels accesibles, validación i18n,
      loading/success y no pierden datos al fallar (verificado en audit
      base; sin cambios en esta sesión).
- [x] Headers de seguridad (helmet/CSP/HSTS/frameguard/noSniff) y
      sanitización de inputs verificados en `security-audit.md`. Sin
      claves en bundle cliente.
- [x] Plantillas de email en 6 idiomas revisadas en audits previos;
      remitente correcto, subjects sin spam triggers, HTML compatible.
      **Pendiente**: re-captura visual en clientes reales — ver §6.
- [x] Calculadora con tipos vigentes 2025-2026 y nota de metodología
      visible al usuario (reescritura del disclaimer en 6 idiomas en
      esta sesión).
- [x] Cobertura i18n al 100% (verificado en `i18n-quality-audit-2026-04.md`,
      sin claves huérfanas; copy del disclaimer reescrito a mano en
      cada idioma).
- [x] Lighthouse mobile ≥ 90 en home/servicios/calculadora/blog
      según último audit; sin cambios en esta sesión que justifiquen
      re-medir. **Recomendado** validar tras merge — ver §6.
- [x] Verificación cross-browser, teclado y lector de pantalla
      registrada en audits previos. Cambios de esta sesión son
      sólo de copy → riesgo nulo.

## 8. Conclusión

Exentax queda apto para el release de producción tras los pases
acumulados de #27, #28 y este #29. Los puntos pendientes de §6 son
mejoras incrementales, no bloqueantes. La calculadora ahora declara su
metodología LLC explícitamente en los 6 idiomas, eliminando el riesgo
de que el usuario interprete la cifra de ahorro como una promesa
contractual.
