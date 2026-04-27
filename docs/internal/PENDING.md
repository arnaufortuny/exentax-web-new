# PENDING — Exentax Web (histórico)

> **El archivo operativo vive en la raíz del repo: [`PENDING-FINAL.md`](../../PENDING-FINAL.md).**
> Este fichero queda como puntero histórico. Los items operativos cerrados / abiertos están consolidados en `PENDING-FINAL.md`.

---

## Cómo se gestiona el roadmap

1. **Pendientes operativos** → [`PENDING-FINAL.md`](../../PENDING-FINAL.md) en raíz.
2. **Estado actual de cada área** → [`PRODUCTION-STATUS.md`](../../PRODUCTION-STATUS.md) en raíz.
3. **Áreas verificadas verde con comando** → [`WHAT-NOT-TO-TOUCH.md`](../../WHAT-NOT-TO-TOUCH.md) en raíz.
4. **Checklist deploy producción** → [`PRODUCTION-CHECKLIST.md`](../../PRODUCTION-CHECKLIST.md) en raíz.
5. **Outputs reales puertas técnicas** → [`BASELINE-CIERRE.md`](BASELINE-CIERRE.md).
6. **Resumen sesiones** → [`CIERRE-PROYECTO-FINAL.md`](../../CIERRE-PROYECTO-FINAL.md), [`AUDIT-FINAL-REPORT.md`](../../AUDIT-FINAL-REPORT.md) en raíz.

---

## Histórico (trazabilidad)

El detalle de batches editoriales y closes históricos se eliminó del repo en
la limpieza 2026-04-27 para reducir ruido. Si alguien necesita el histórico
exacto, está en `git log` y en estos commits clave:

- `a973956` — Auditoría exhaustiva 2026-04-27 (15/15 gates verde, 2 bugs arreglados).
- `1dd692b` — Verificación solidez 5 commits clave (Tasks #1, #5, #34, #53, #60, #62).
- `3a859bd` — Cierre definitivo post-merge: review-anchor strip + 5 docs consolidados raíz.
- `27cd7e2` (origin/main pre-cleanup) — Tracking events, Task #1 cuanto-cuesta rewrite.
- 70+ commits de Tasks #1 a #62 en main entre `27cd7e2` y commits anteriores.

Para el histórico de los batches editoriales (que originalmente vivían en
`LOG-BATCH-1..12.md`), consultar mensajes de commit con `git log --grep=LOG-BATCH`.
