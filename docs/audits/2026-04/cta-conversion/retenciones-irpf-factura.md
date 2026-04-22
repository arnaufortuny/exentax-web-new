# CTA — retenciones-irpf-factura

Generado por `exentax-web/scripts/audit-2026-04-cta-conversion.mjs`. Idempotente: una segunda corrida no añade nada si el contenido ya cumple la política de conversión.

| Idioma | Palabras | Tenía agenda | Tenía calc | Tenía tel | Tenía WA | Tenía LLC sub | Tenía ITIN sub | Añadido | Reescrito | Idiomas verificados | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| es | 1177 | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | — | — | ✓ | ✅ |
| en | 1120 | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | — | — | ✓ | ✅ |
| fr | 1188 | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | — | — | ✓ | ✅ |
| de | 1031 | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | — | — | ✓ | ✅ |
| pt | 1134 | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | — | — | ✓ | ✅ |
| ca | 1142 | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | — | — | ✓ | ✅ |

## Bloque de conversión inyectado (idioma es)

```html
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:+34614916910">+34 614 916 910</a> o escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vengo%20del%20art%C3%ADculo%20%22Las%20retenciones%20de%20IRPF%20en%20factura%20son%20la%20manera%20que%20tiene%20Hacienda%20de%20cobrar%E2%80%A6%22%20y%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>
<!-- /exentax:cta-conv-v1 -->
```