# LIQUID GLASS SYSTEM — Sistema de superficies refinado Exentax

**Fecha**: 2026-04-26
**Filosofía**: refinamiento sistémico SIN cambiar fondos, colores, contenido.
Solo elevar la calidad visual con specular highlight, depth layering y
microinteracciones profesionales.

---

## Tokens nuevos en `client/src/index.css`

```css
/* Liquid Glass refined — visionOS/macOS-inspired depth tokens */
--glass-specular: linear-gradient(
  180deg,
  rgba(255,255,255,0.55) 0%,
  rgba(255,255,255,0.20) 18%,
  rgba(255,255,255,0.00) 50%
);
--glass-inner-glow: inset 0 1px 0 rgba(255,255,255,0.65),
                   inset 0 -1px 0 rgba(0,0,0,0.04);
--glass-edge-light: 0 0 0 0.5px rgba(255,255,255,0.6),
                   0 0 0 1px rgba(0,0,0,0.04);
--glass-shadow-elevated: 0 24px 60px -12px rgba(0,0,0,0.18),
                        0 8px 24px -4px rgba(0,0,0,0.10),
                        0 1px 0 rgba(255,255,255,0.7) inset;
--glass-shadow-hero: 0 32px 80px -16px rgba(0,0,0,0.20),
                    0 12px 32px -6px rgba(0,0,0,0.12),
                    0 0 0 1px rgba(0,229,16,0.08),
                    inset 0 1px 0 rgba(255,255,255,0.8);
--glass-accent-tint: linear-gradient(
  180deg,
  rgba(0,229,16,0.06) 0%,
  rgba(0,229,16,0.02) 60%,
  rgba(255,255,255,0.0) 100%
);
```

---

## Clases existentes mejoradas (auto-aplicadas a 33+ surfaces)

### `.glass` — base
**Antes**: `bg + blur + border + shadow`
**Ahora**: + `inset 0 1px 0 rgba(255,255,255,0.6)` (edge light superior)

### `.glass-strong` — forms / calculator / key UI
**Mejora**: `inset 0 1px 0 rgba(255,255,255,0.7)` specular highlight

### `.glass-card` — interactive tiles (testimonials, abrir-llc cards, FAQ)
**Mejoras**:
- Inner specular (`inset 0 1px 0 rgba(255,255,255,0.65)`)
- Hover transition con cubic-bezier (0.4, 0, 0.2, 1) — smoother
- Hover lift sutil (`translateY(-1px)`)
- Hover edge light reforzado
- Respeta `prefers-reduced-motion`

**0 cambios visibles en bg/colors/content.** Solo refinamiento microinteractivo
y specular highlight que aporta sensación de profundidad iOS-like.

---

## Variantes nuevas opt-in (utilities disponibles para futuro uso)

### `.glass-elevated` — cards principales con hover lift
- Background: `rgba(255,255,255,0.78)` (78% opacidad)
- Blur: 24px + saturate 1.6
- Specular: ::before pseudo con gradient top→transparent
- Shadow: multi-layer 24px+8px ambient
- Hover: translateY(-2px) + shadow expand
- Uso: services cards, why-us cards estándar

### `.glass-hero` — surface protagonista (1 por página)
- Background: `rgba(255,255,255,0.82)`
- Blur: 32px + saturate 1.7
- Border-radius: var(--radius-xl) = 32px
- Shadow hero: 32px+12px+brand glow
- Specular: ::before gradient top
- Uso: panel central abrir-llc / hero section principal

### `.glass-accent` — featured/CTA con tinte verde sutil
- Background: 78% white
- **Tinte verde linear-gradient en ::before** (6%→2%→0%)
- Inset border verde brand `rgba(0,229,16,0.20)`
- Shadow verde brand: `rgba(0,229,16,0.18)` ambient
- Hover: translateY(-1px) + shadow + border verde reforzado
- Uso: WhyUs panel destacado, CTAs de conversión hero

### `.glass-frost` — surfaces secundarias muy ligeras
- Background: 55% white (más translúcido)
- Blur: 16px (lighter)
- Border 1px subtle white
- Inset 1px specular
- Uso: panels de fondo, tooltips, breadcrumbs

---

## Reglas de aplicación profesional

| Caso | Clase recomendada | Justificación |
|---|---|---|
| Card en grid (servicios, testimonials, FAQ) | `.glass-card` | Hover sutil + specular |
| Panel destacado WhyUs / CTA | `.glass-accent` | Brand tint sin saturar |
| Hero central abrir-llc | `.glass-hero` | Maximum depth + brand edge |
| Calculator / BookingCalendar | `.glass-strong` | Forms críticos, max contraste |
| Background panels secundarios | `.glass-frost` | Ligero, no compite |
| Navbar | `.navbar-glass` | Existente, no tocar |

---

## Por qué este sistema es Exentax-native (no genérico)

1. **Brand color enforcement**: variantes `glass-accent` y `glass-hero` integran
   tinte verde `#00E510` solo en bordes y shadows, nunca en bg principal.
   Mantiene la regla brand: verde solo como accent, nunca dominante.

2. **Cream theme respect**: las superficies translúcidas dejan ver
   `--bg-0: #F8F7F4` por debajo. El blur preserva el fondo crema mientras
   añade depth. NO se reemplaza el bg base.

3. **Tipografía intacta**: Space Grotesk (heading) + Inter (body) sin cambio.
   Las variantes solo afectan al `surface treatment`, no al text rendering.

4. **Botones intactos**: el botón pill `.btn-primary` con bg `#00E510` y
   shadow `--shadow-green` queda preservado. Las superficies glass son
   contenedores, no botones.

5. **Bordes redondos consistentes**: cada variante usa `--radius-lg` (24px)
   o `--radius-xl` (32px) coherente con el resto del sistema. Nada de
   border-radius arbitrario.

6. **Microinteracciones cubic-bezier**: `(0.4, 0, 0.2, 1)` es la curva
   estándar Material/Apple — más natural que el `ease` por defecto.
   Hover lift de 1-2px sutil, no marea.

7. **Accesibilidad**: `prefers-reduced-motion` desactiva los hover translates
   automáticamente.

---

## Verificación sin regresiones

- ✅ `tsc --noEmit` exit 0
- ✅ `npm run build` exit 0
- ✅ `check-typography-rule0`: 0 violaciones
- ✅ 33+ usos existentes de `.glass`/`.glass-card`/`.glass-strong` reciben
  el upgrade automáticamente sin tocar JSX

---

## Aplicación recomendada por página (no aplicado, opt-in cuando se rediseñe)

| Página | Surface | Variante sugerida |
|---|---|---|
| Home Hero | container del Hero principal | `glass-hero` |
| Services grid | cards de servicios | `glass-elevated` |
| Services destacado | Service card popular | `glass-accent` |
| WhyUs panel | panel central diferenciador | `glass-accent` |
| Testimonials cards | cards en carousel | `glass-elevated` |
| FAQ search input | input de búsqueda | `glass-frost` |
| Calculator panel | container completo | `glass-strong` (existente) |
| Booking wizard | container del form | `glass-strong` (existente) |
| Abrir-llc Hero | panel "GUÍA DEFINITIVA" | `glass-hero` |
| Abrir-llc state cards | 4 cards NM/WY/DE/FL | `glass-elevated` |
| Legal pages | LegalLayout | `glass-frost` (refinar existente) |

---

## Filosofía profesional vs cutre

**Profesional Exentax**:
- Refinamiento microinteractivo (specular highlight, hover lift sutil)
- Brand color como accent, no dominante
- Multi-layer shadows realistas (no flat single shadow)
- Cubic-bezier curves naturales
- Tokens reutilizables, nunca inline magic numbers
- Respeta `prefers-reduced-motion`

**Cutre genérico Claude (lo que NO hacemos)**:
- Bg gradients chillones que cambian color brand
- Border 2px sólido sin layering
- Hover translateY enormes (5-8px)
- `transition: all 0.3s` indiscriminado
- Material/Bootstrap copy-paste
- Box-shadows planos sin depth

---

**Sistema listo para aplicación selectiva** cuando el equipo de diseño decida
qué surfaces quieren refinar al nivel `glass-hero` / `glass-elevated` /
`glass-accent`. Por ahora, todas las `.glass-card` existentes ya tienen el
upgrade base automático.
