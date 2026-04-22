# Exentax — Guía editorial del blog

Documento de referencia para todo el contenido del blog (todos los idiomas).
**Vinculante.** Cualquier artículo que se redacte o reescriba debe respetar estos principios.

## 0. Tipografía y UI — REGLAS DURAS (no negociable)

**Prohibido en TODA la web (no solo en el blog):**

- **Nada de etiquetas en versalitas con tracking ancho** (`uppercase` + `tracking-[0.1em]+`). Ese estilo "eyebrow" tipo bloque editorial USA queda prohibido. Se percibe como monoespaciado y barato. No se usa en labels de formularios, no en eyebrows de sección, no en metadatos de tarjetas, no en etiquetas de filtros, no en pies de cards.
- **Nada de números tabulares decorativos** (`tabular-nums`, `font-mono`, `decimal-leading-zero`, contadores CSS con prefijo `01/`, `02/`). Solo se permiten números proporcionales normales. Excepción única: tablas numéricas reales donde alinear columnas por dígito tenga sentido funcional.
- **Nada de prefijos numéricos decorativos en H2** ni en items de listas. Las listas usan marker nativo o raya hairline, sin numeración estilo magazine.
- **Nada de fuentes monospace** salvo en bloques de código real (`<pre>`/`<code>`).

**Sí se usa:**
- Tipografía proporcional normal (Inter para body, Space Grotesk para headings).
- Para labels y metadatos: sentence case, peso 500–600, tamaño 12–14px, sin uppercase, sin tracking ancho.
- Hairlines, glass, eyebrow con raya horizontal corta cuando hace falta separar bloques.

Si hay duda, **se usa la versión sobria, no la decorativa**. Premium = contención, no flourishes.

### Verificación automática

Para evitar regresiones, ejecuta el linter de Regla 0 desde la raíz del repo o desde `exentax-web/`:

```
node exentax-web/scripts/check-typography-rule0.mjs
```

El script escanea `client/src/**/*.{ts,tsx,css}` y reporta:
- `uppercase` + `tracking-wider/widest/[0.1em+]` en `className` (TS/TSX)
- `tabular-nums` decorativo (excepción permitida: `BookingCalendar.tsx`)
- `font-mono` decorativo (sin excepciones: solo se admite en bloques de código real `<pre>`/`<code>`)
- En CSS: `text-transform: uppercase` + `letter-spacing >= 0.1em`
- En CSS: `counter-reset/increment: blog-h2` o `content: counter(blog-h2…)` en `.blog-content h2`

Devuelve exit code 1 si hay violaciones. Recomendado correr antes de cada PR que toque UI.

## 1. Posicionamiento

Exentax **diseña estructuras LLC sólidas** para optimizar fiscalidad internacional con coherencia y dentro de la legalidad. No vende LLCs sueltas, no vende miedo, no vende "trucos".

## 2. Tono

- Profesional, seguro, directo, humano.
- Nunca alarmista. Nunca robótico.
- "Esto es lo que vemos cada semana / esto es lo que la gente hace mal / esto es lo que funciona de verdad".
- Cliente protagonista: el problema real → el error típico → cómo funciona de verdad → cómo se hace bien → por qué Exentax.

## 3. Lo que SÍ se dice (claims correctos, alineados con realidad operativa)

### Banca y reporting
- **CRS no aplica a EE.UU.** EE.UU. no participa en CRS. Una cuenta US no se intercambia automáticamente con tu Hacienda local vía CRS.
- **Wise US Inc, Mercury, Slash, Relay → no reportan vía CRS** a haciendas europeas/LATAM. Reportan al IRS lo que les corresponde como instituciones US.
- **FATCA es bilateral US ↔ país y no exporta automáticamente datos de cuentas US a Europa**. Lo que reporta FATCA son cuentas de US persons en bancos extranjeros, no al revés a nivel cuenta-por-cuenta de personas físicas no US.
- **Wallester sí reporta en Europa** (es emisor europeo).
- **Revolut Business**: EMI europea con presencia multi-jurisdicción; el reporting depende de la entidad emisora de la cuenta.
- **Acceder a información de una LLC US es complicado**: registered agent + privacidad estatal (Wyoming, Nuevo México, Delaware). Anonimato federal real para el público; las autoridades pueden requerir vía canales formales, pero no es automático.

### Brokers
- **Interactive Brokers SÍ abre cuentas a LLC de no residentes** (entidad LLC US con beneficial owner foreign). Sirve W-8BEN-E.
- **Tradovate SÍ permite operar futuros con LLC**.
- **Kraken acepta no residentes** y opera con LLC.
- Stripe, PayPal, Whop, Hotmart funcionan con LLC US.

### Fiscalidad
- LLC bien estructurada → **0% federal en EE.UU.** para SMLLC foreign-owned sin ECI / sin US trade or business.
- **Pagas en tu país cuando retiras / cuando se imputa renta según tu marco local**, no antes.
- Si la LLC cierra el año a 0 (todo distribuido o reinvertido sin beneficio retenido), no hay base imponible neta corporativa.
- En España: LLC puede operar con **NIF** si hace negocio en ES. **IVA** sólo si opera físicamente en ES y según servicio (consultoría/asesoría B2B internacional → no IVA por regla de destino).
- **DAC7 y DAC8 son normativa europea; no aplican en EE.UU.** No imponen obligaciones a una LLC US sobre sus operaciones US. Sí pueden afectar al residente europeo en su propia declaración.
- IRPF se paga **sobre beneficio retirado / atribuido en tu país**, no sobre saldo bruto de la LLC.
- Modelo 720/721: obligación informativa si superas €50k en cuentas/valores/cripto fuera de España. Es informar, no tributar adicional.

### Estructura y protección
- **Separación patrimonial real**: la LLC blinda tu patrimonio personal frente a deudas/pleitos del negocio.
- **No mezclar gastos personales con gastos de la LLC** → eso sí se desaconseja activamente (rompe el escudo, rompe la trazabilidad, complica el 5472).
- **Trazabilidad limpia** = defensa principal ante cualquier requerimiento.
- **Cripto**: la LLC mejora el acceso financiero (Kraken Pro, exchanges institucionales) y permite trazabilidad operativa.
- **No retirar fondos de la LLC a cuenta bancaria local en España** sin planificación: añade trazabilidad CRS innecesaria. Mejor estructurar el flujo (tarjeta corporativa, distribución planificada, etc.).
- **Mejor acceso financiero** (banca US, brokers US, pasarelas globales) = uno de los mayores beneficios prácticos.

## 4. Lo que NO se dice (vetado)

- ❌ "Mercury reporta a tu Hacienda" / "Wise reporta a la AEAT" / "FATCA exporta tus saldos a Europa".
- ❌ "Te van a pillar", "te llegarán sanciones del 50-150%", lenguaje de inspección/castigo como mecanismo persuasivo.
- ❌ "IB raramente abre a LLC" / "Schwab no acepta LLC" / cualquier negativa sobre brokers que sí abren.
- ❌ "Mejor no usar LLC para inversión" como conclusión categórica.
- ❌ "DAC8 alcanza tu LLC" (no, DAC8 es UE).
- ❌ Listados de precios o tarifas de competidores (no aporta y baja el nivel).
- ❌ Frases que digan o sugieran que una LLC es "arriesgada", "problemática" o "complicada" como esencia. El problema nunca es la LLC; el problema es montarla mal.
- ❌ Tono de "abogado nervioso" o "asesor a la defensiva".

## 5. Estructura narrativa estándar

Cada artículo debe seguir esta arquitectura (adaptada en longitud):

1. **Apertura — el problema real del cliente** (2 frases máximo, sin rodeos).
2. **El error típico que está cometiendo** (lo que vemos cada semana).
3. **Cómo funciona de verdad** (técnico pero entendible, claims correctos).
4. **Cómo se hace bien** (el método, sin marketing barato).
5. **Por qué Exentax** (lo hacemos desde el inicio, infraestructura completa, sin improvisar).
6. **Cierre + CTA** (asesoría, sin presión).

## 6. Bloques de autoridad recurrentes

Insertar al menos uno por artículo:

- **"Lo que vemos cada semana en Exentax"** → caso real anonimizado.
- **"Lo que la gente hace mal"** → error concreto, no abstracto.
- **"Lo que funciona de verdad"** → solución concreta, ejecutable.

## 7. Stack operativo de referencia (mencionar cuando encaje)

- **Banca**: Mercury, Relay, Wise Business (cuenta US Inc para no residentes), Slash (tesorería con rendimiento).
- **Tarjetas**: Wallester (emisor europeo, control granular).
- **Brokers**: Interactive Brokers (acciones/ETFs/opciones, abre a LLC de no residentes), Tradovate (futuros), Kraken (cripto).
- **Pasarelas**: Stripe, PayPal, Whop, Hotmart, Adyen, DoDo Payments.
- **Multi-divisa**: Wise Business, Revolut Business.

## 8. Cierre estándar

> "En Exentax diseñamos estructuras LLC sólidas desde el primer día. Banca, brokers, compliance y operativa internacional, todo coordinado. Si quieres montarla bien o revisar la que ya tienes, hablamos."

(Adaptar al idioma; mantener el tono.)

---

## 9. Anexo "Obra Maestra" — Task #38 (vinculante a partir de 2026-04-20)

A partir de Task #38, la fuente única de verdad sobre voz, longitud, miedo permitido/prohibido, cifras USD, CTAs y workflow de overhaul es:

📄 **`docs/seo/blog-editorial-rules-v2.md`** (canónico, 158 líneas, no duplicar aquí).

Esta guía (EDITORIAL_GUIDE.md) sigue siendo la **regla 0 de tipografía/UI** y el resumen narrativo. Para cualquier reescritura, traducción premium o pieza nueva, leer **primero** `blog-editorial-rules-v2.md` y luego este archivo. Si hay conflicto, manda v2.

### Verificación obligatoria del nivel "obra maestra"

Además del pipeline `npm run check` (lint editorial + tipografía + SEO + i18n), antes de cerrar cualquier batch de overhaul ejecutar:

```bash
node exentax-web/scripts/blog-masterpiece-audit.mjs
```

Genera dos artefactos en `reports/seo/`:
- `baseline-606.json` — score y findings por slug × idioma (606 piezas).
- `baseline-606.md` — resumen humano (cobertura de marcadores v2, calc-CTA, longitudes, autoridad, traducción).

**No hace fail del pipeline (yet).** Step 9 de Task #38 lo conecta a `npm run check` con `--strict` cuando todos los slugs alcancen score ≥ 90/100. Mientras tanto, cada batch debe:
1. Mover el score medio del cluster tocado **hacia arriba**, nunca hacia abajo.
2. Cerrar al menos los findings **críticos** (`severity: "critical"`) de los slugs editados.
3. Adjuntar el delta (antes/después) en el commit que cierra el batch.

### Reglas extra que asume el auditor

- **Marcadores v2**: cada `.ts` de `client/src/data/blog-content/<lang>/<slug>.ts` debe contener `<!-- exentax:execution-v2 -->` cerrado. Excepción documentada: tier-A/B mientras no se reescriben (la auditoría lo marca como `warning`, no `critical`).
- **Calculadora CTA**: cada artículo lleva un puntero a la calculadora. Formatos válidos:
  - `<!-- exentax:calc-cta-v1 -->` (formato HTML, EN/FR/DE/PT/CA).
  - Link inline a `/<lang>#calculadora` o `/<lang>#calculator` (ES y otros).
- **Longitud mínima**: 800 palabras por artículo (warning < 800, critical < 500).
- **Sin años en prosa**: regex `\b(202[3-9]|203\d)\b` en el cuerpo (excluye URLs y bloques `<source>`). Slugs `-2026` están permitidos en URL.
- **Bloque de Sources**: `<!-- exentax:sources-v1 -->` cerrado, con al menos 3 URLs primarias (`irs.gov`, `fincen.gov`, `fdic.gov`, `oecd.org`, `treasury.gov`, `ec.europa.eu`, `boe.es`, `agenciatributaria.gob.es`).

Cualquier futura agente debe ejecutar el auditor antes y después de cada batch y subir el delta al commit final.
