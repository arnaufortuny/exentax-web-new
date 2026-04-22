# CTA — modulos-vs-estimacion-directa-2026

Generado por `exentax-web/scripts/audit-2026-04-cta-conversion.mjs`. Idempotente: una segunda corrida no añade nada si el contenido ya cumple la política de conversión.

| Idioma | Palabras | Tenía agenda | Tenía calc | Tenía tel | Tenía WA | Tenía LLC sub | Tenía ITIN sub | Añadido | Reescrito | Idiomas verificados | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| es | 1151 | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | — | — | ✓ | ✅ |
| en | 1076 | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | — | — | ✓ | ✅ |
| fr | 1155 | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | — | — | ✓ | ✅ |
| de | 1006 | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | — | — | ✓ | ✅ |
| pt | 1100 | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | — | — | ✓ | ✅ |
| ca | 1119 | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | — | — | ✓ | ✅ |

## Bloque de conversión inyectado (idioma es)

```html
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:+34614916910">+34 614 916 910</a> o escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22El%20r%C3%A9gimen%20de%20tributaci%C3%B3n%20que%20escoges%20como%20aut%C3%B3nomo%20determina%20c%C3%B3mo%20calculas%20t%E2%80%A6%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>
<!-- /exentax:cta-conv-v1 -->
```