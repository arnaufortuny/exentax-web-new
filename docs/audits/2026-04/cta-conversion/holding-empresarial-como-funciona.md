# CTA — holding-empresarial-como-funciona

Generado por `exentax-web/scripts/audit-2026-04-cta-conversion.mjs`. Idempotente: una segunda corrida no añade nada si el contenido ya cumple la política de conversión.

| Idioma | Palabras | Tenía agenda | Tenía calc | Tenía tel | Tenía WA | Tenía LLC sub | Tenía ITIN sub | Añadido | Reescrito | Idiomas verificados | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| es | 3028 | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | tel + WhatsApp action row; enlace LLC subpágina (llc_wy) | — | ✓ | ✅ |
| en | 3259 | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | ✓ | ✅ |
| fr | 3346 | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | ✓ | ✅ |
| de | 3027 | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | ✓ | ✅ |
| pt | 2595 | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | tel + WhatsApp action row; enlace LLC subpágina (llc_wy) | — | ✓ | ✅ |
| ca | 2681 | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | tel + WhatsApp action row; enlace LLC subpágina (llc_wy) | — | ✓ | ✅ |

## Bloque de conversión inyectado (idioma es)

```html
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:+34614916910">+34 614 916 910</a> o escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22holding%20empresarial%20como%20funciona%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>

Si tu plan es montar la LLC en Wyoming, repasa nuestra página de servicio <a href="/es/nuestros-servicios/llc-wyoming">LLC en Wyoming</a> con costes, plazos y siguientes pasos concretos.
<!-- /exentax:cta-conv-v1 -->
```