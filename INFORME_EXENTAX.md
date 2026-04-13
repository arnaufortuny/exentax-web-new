# INFORME DE ESTADO — EXENTAX
**Fecha:** 13 de abril de 2026
**Alcance:** Auditoría completa de módulos, i18n, integridad frontend/backend/BD, y análisis de capacidad con 50GB

---

## 1. ARQUITECTURA GENERAL

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js + Express (TypeScript) |
| Frontend | React 19 + Vite (SPA con wouter) |
| Base de datos | PostgreSQL (Drizzle ORM) |
| Emails | Gmail API (Service Account) |
| Encriptación campos | AES-256-GCM (EIN, SSN, Tax ID) |
| Encriptación archivos | AES-256-GCM para documentos |
| Autenticación admin | Sesiones con RBAC (superadmin, admin, marketing, soporte) |
| Autenticación cliente | OTP por email |
| i18n | 7 idiomas (ES/EN/FR/DE/IT/PT/CA) |
| PDF | Generación server-side (facturas profesionales) |

**Estructura del proyecto:**
- `exentax-web/server/` — 18 archivos de rutas, 6 módulos de storage
- `exentax-web/client/src/` — ~30 páginas/componentes, 7 locales
- `exentax-web/shared/schema.ts` — 28 tablas PostgreSQL
- `exentax-web/server/email-i18n.ts` — 1.774 líneas de traducciones email

---

## 2. ESTADO DE MÓDULOS

### 2.1 Módulos COMPLETADOS (funcionales end-to-end)

| Módulo | Backend | Frontend | BD | Emails | i18n | Estado |
|--------|---------|----------|----|--------|------|--------|
| Panel Admin (dashboard) | ✅ | ✅ | ✅ | — | ✅ | **COMPLETO** |
| Gestión de clientes (CRUD) | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| Portal del cliente | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| LLCs (formación + miembros) | ✅ | ✅ | ✅ | — | ✅ | **COMPLETO** |
| Facturación (crear/enviar/PDF) | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| Pagos (registro + tracking) | ✅ | ✅ | ✅ | — | ✅ | **COMPLETO** |
| Calendario fiscal | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| Alertas fiscales automáticas | ✅ | — | ✅ | ✅ | ✅ | **COMPLETO** |
| Reservas / Booking | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| Calculadora fiscal | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| Sistema de emails (16 tipos) | ✅ | — | ✅ | ✅ | ✅ | **COMPLETO** |
| Newsletter (suscripción + envío) | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| CRM / Leads | ✅ | ✅ | ✅ | — | ✅ | **COMPLETO** |
| Comisiones (closers/marketing) | ✅ | ✅ | ✅ | — | ✅ | **COMPLETO** |
| Documentos (subida + cifrado) | ✅ | ✅ | ✅ | — | ✅ | **COMPLETO** |
| Analíticas / Visitas | ✅ | ✅ | ✅ | — | ✅ | **COMPLETO** |
| Gastos de negocio | ✅ | ✅ | ✅ | — | ✅ | **COMPLETO** |
| Logs de auditoría | ✅ | ✅ | ✅ | — | ✅ | **COMPLETO** |
| Consentimientos RGPD | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| Páginas legales (5 docs) | — | ✅ | ✅ | — | ✅ | **COMPLETO** |
| SEO (meta tags + OG) | — | ✅ | — | — | ✅ | **COMPLETO** |
| Sitio público (home + servicios) | — | ✅ | — | — | ✅ | **COMPLETO** |
| Google Meet (booking) | ✅ | — | — | — | — | **COMPLETO** |

### 2.2 Elementos con pendientes menores

| Elemento | Detalle | Prioridad |
|----------|---------|-----------|
| Stripe directo | No hay SDK server-side; se usan Payment Links manuales (funcional pero sin automatización de cobros) | Media |
| Rate limiting | En memoria (se pierde al reiniciar); necesita Redis para producción multi-instancia | Media |
| Tipo de cambio | No hay servicio de conversión EUR/USD/GBP; cada factura es moneda fija | Baja |
| Migraciones SQL | Se usa `db:push` sin archivos de migración persistidos; no hay rollback formal | Media |

---

## 3. AUDITORÍA i18n

### 3.1 Estado general

| Métrica | Valor |
|---------|-------|
| Keys totales por locale | 3.611 |
| Idiomas | 7 (ES, EN, FR, DE, IT, PT, CA) |
| Keys faltantes | **0** |
| Keys extra (sobrantes) | **0** |
| Keys vacías | **0** |
| Placeholders inconsistentes | **0** |
| Keys potencialmente no usadas | **0** |
| Resultado validación | **PASS ✓** |

### 3.2 Traducciones pendientes por idioma

| Idioma | Keys idénticas al ES | % traducido | Estado |
|--------|---------------------|-------------|--------|
| Español (ES) | — | 100% | Referencia |
| Inglés (EN) | 222 | 93.9% | Bueno (muchas son marcas/URLs) |
| Francés (FR) | 179 | 95.0% | Bueno |
| Alemán (DE) | 148 | 95.9% | Bueno |
| Italiano (IT) | 232 | 93.6% | Bueno |
| Portugués (PT) | 524 | 85.5% | **Necesita trabajo** |
| Catalán (CA) | 424 | 88.3% | **Necesita trabajo** |

**Nota:** De las keys "idénticas al ES", muchas son intencionalmente iguales (nombres propios, URLs, marcas, términos técnicos como "IBAN", "SWIFT/BIC", "WhatsApp"). Las keys verdaderamente pendientes de traducción profesional están marcadas con TODO en `pt.ts` (~524) y `ca.ts` (~424).

### 3.3 Emails (server-side i18n)

| Tipo de email | Idiomas cubiertos | Estado |
|---------------|------------------|--------|
| booking_confirmation | 7/7 | ✅ Completo |
| reminder | 7/7 | ✅ Completo |
| calculator_result | 7/7 | ✅ Completo |
| fiscal_alert | 7/7 | ✅ Completo |
| invoice_send | 7/7 | ✅ Completo |
| invoice_receipt | 7/7 | ✅ Completo |
| invoice_reminder | 7/7 | ✅ Completo |
| welcome | 7/7 | ✅ Completo |
| otp | 7/7 | ✅ Completo |
| newsletter | 7/7 | ✅ Completo |
| trustpilot_invite | 7/7 | ✅ Completo |
| noshow_reschedule | 7/7 | ✅ Completo |
| reschedule_confirmation | 7/7 | ✅ Completo |
| cancellation_confirmation | 7/7 | ✅ Completo |
| data_erasure | 7/7 | ✅ Completo |
| password_change | 7/7 | ✅ Completo |

### 3.4 Hardcodes detectados

| Ubicación | Tipo | Detalle | Impacto |
|-----------|------|---------|---------|
| `server/routes/shared.ts` L1408-1413 | Traducciones PDF inline | Etiquetas de factura PDF en mapa inline (7 idiomas) — funcional pero fuera del sistema i18n central | Bajo (funciona correctamente) |
| `server/email.ts` | `COUNTRY_LABELS_I18N` | Mapa de países inline (7 idiomas) — funcional pero podría consolidarse | Bajo |
| `server/email-layout.ts` L33 | Alias legacy | `F_MONO = F_STACK` — backward compat alias | Nulo |
| Admin UI | Labels de estado | Algunos status como "Pendiente", "Activa" en componentes admin — no afecta al cliente | Bajo (admin-only) |

### 3.5 Keys potencialmente no usadas

**Resultado: 0 keys no usadas.** Todas las 3.611 keys están verificadas como usadas mediante:
- Referencia directa en código (`t("key")`)
- Uso dinámico documentado con 35+ prefijos de namespace (ej: `t(admin.roles.${role})`, `STATUS_I18N_MAP[status]`)
- Cada prefijo dinámico tiene un sitio de uso verificado en el código fuente

---

## 4. COHERENCIA FRONTEND ↔ BACKEND ↔ BD

### 4.1 Esquema de datos (28 tablas)

```
clientes              llcs                  llc_miembros
facturas              pagos                 leads
agenda                calculadora           comisiones
calendario_fiscal     alertas_fiscales      visitas
consentimientos       login_attempts        emails
tokens                timeline              documentos
newsletter_suscriptores  newsletter_campanas  notificaciones
dias_bloqueados       revoked_admin_sessions  audit_logs
gastos_negocio        admin_users           legal_document_versions
legal_acceptances
```

### 4.2 Verificación de coherencia

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Tipos compartidos (shared/schema.ts) | ✅ | Insert schemas + Select types para cada tabla |
| Zod validation en rutas | ✅ | Todas las rutas POST/PATCH validan con Zod |
| Storage interface | ✅ | Capa de abstracción entre rutas y BD |
| Monedas | ✅ | `normalizeCurrency()` centralizado; solo EUR/USD/GBP |
| Estados de factura | ✅ | Enum validado: pendiente, pagada, cancelada, vencida, anulada, reembolsada |
| Estados de cliente | ✅ | Enum validado: activo, inactivo, bloqueado, en proceso, pendiente |
| Cascade policies | ✅ | `set null` para datos de auditoría, `cascade` para datos transitorios |
| Convención de nombres | ✅ | Columnas BD en español, propiedades JS en inglés camelCase (documentado) |
| IDs | ✅ | Prefijados (EX-, LLC-, INV-) para entidades principales |
| Índices | ✅ | Índices compuestos en tablas de alta consulta (documentos, calendario) |

### 4.3 Flujos end-to-end verificados

| Flujo | Front → API → Storage → BD → Email | Estado |
|-------|--------------------------------------|--------|
| Crear cliente | ✅ Portal / Admin → POST → insert → clientes → welcome email | Completo |
| Crear factura + PDF | ✅ Admin → POST → insert → facturas → invoice_send email | Completo |
| Booking | ✅ Reservar → POST → insert → agenda → booking_confirmation email | Completo |
| Alerta fiscal | ✅ Engine → scan → calendario_fiscal → fiscal_alert email | Completo |
| Newsletter | ✅ Admin → POST → subscribers query → newsletter email batch | Completo |
| Login portal | ✅ Email → OTP → POST verify → token → sesión | Completo |
| Subir documento | ✅ Admin → multer → encrypt → disk → documentos insert | Completo |

---

## 5. ANÁLISIS DE CAPACIDAD (50GB)

### 5.1 Estimación de consumo por cliente

| Componente | Escenario ligero | Escenario medio | Escenario alto |
|------------|-----------------|-----------------|----------------|
| **Perfil cliente** (clientes + llcs + miembros) | ~2 KB | ~5 KB | ~10 KB |
| **Facturas** (facturas + pagos) | ~5 KB/año (3-4 facturas) | ~15 KB/año (10 facturas) | ~40 KB/año (25+ facturas) |
| **Documentos** (archivos en disco) | 2 MB (2-3 PDFs) | 15 MB (10-15 docs) | 80 MB (50+ docs escaneados) |
| **Calendario fiscal** (eventos + alertas) | ~3 KB/año | ~8 KB/año | ~15 KB/año |
| **Emails** (logs en BD) | ~10 KB/año | ~30 KB/año | ~80 KB/año |
| **Timeline** (eventos) | ~5 KB/año | ~15 KB/año | ~40 KB/año |
| **Leads + Calculadora** | ~2 KB | ~5 KB | ~10 KB |
| **Total BD por cliente/año** | ~27 KB | ~78 KB | ~195 KB |
| **Total con archivos/año** | **~2 MB** | **~15 MB** | **~80 MB** |

### 5.2 Capacidad estimada con 50GB

| Escenario | Archivos (90% del espacio = 45GB) | BD (10% = 5GB) | Clientes soportados |
|-----------|-----------------------------------|-----------------|---------------------|
| **Ligero** (freelancers, pocos docs) | 45GB ÷ 2MB = 22.500 | 5GB ÷ 27KB = 185.000+ | **~22.500 clientes** |
| **Medio** (PYME, documentación regular) | 45GB ÷ 15MB = 3.000 | 5GB ÷ 78KB = 64.000+ | **~3.000 clientes** |
| **Alto** (LLC completa, mucha documentación) | 45GB ÷ 80MB = 562 | 5GB ÷ 195KB = 25.600+ | **~560 clientes** |

### 5.3 Distribución realista (mix de clientes)

Asumiendo un mix típico: 60% ligeros, 30% medios, 10% altos:

| Tipo | Proporción | Clientes | Almacenamiento archivos | Almacenamiento BD |
|------|-----------|----------|------------------------|-------------------|
| Ligero | 60% | 1.800 | 3.6 GB | 49 MB |
| Medio | 30% | 900 | 13.5 GB | 70 MB |
| Alto | 10% | 300 | 24.0 GB | 59 MB |
| **Total** | — | **3.000** | **41.1 GB** | **178 MB** |
| **Margen restante** | — | — | **3.9 GB** | **4.8 GB** |

**Con un mix realista, el sistema soporta ~3.000 clientes con 50GB antes de necesitar ampliar almacenamiento.**

### 5.4 Cuellos de botella identificados

| Cuello de botella | Tipo | Detalle | Recomendación |
|-------------------|------|---------|---------------|
| **Documentos en disco local** | Almacenamiento | Archivos se guardan en `uploads/` local cifrados; sin CDN ni S3 | Migrar a S3/R2 para escalar más allá de 50GB |
| **Tabla `visitas`** | BD | Cada visita web genera un registro; tabla crece sin límite | Implementar retención (borrar visitas > 6 meses) o agregar datos |
| **Tabla `emails`** | BD | Log de cada email enviado; crece linealmente | Política de retención de 12 meses |
| **Tabla `audit_logs`** | BD | Cada acción admin genera un log | Ya existe limpieza automática ("Old audit logs cleaned") |
| **Rate limiting en memoria** | Rendimiento | Se pierde al reiniciar; no escala a multi-instancia | Migrar a Redis |
| **Sin paginación de archivos** | Rendimiento | Listar todos los documentos de un cliente sin cursor | Agregar paginación cursor-based |
| **Límite por archivo: 20MB** | Almacenamiento | Configurable en multer; adecuado para PDFs pero podría ser insuficiente para contratos escaneados en alta resolución | Considerar compresión automática |
| **Sin compresión de imágenes** | Almacenamiento | Documentos escaneados se almacenan sin optimizar | Agregar pipeline de compresión para imágenes |

---

## 6. RESUMEN EJECUTIVO

### Lo que está BIEN
- **22 módulos funcionales end-to-end** — todo el flujo core está operativo
- **16 tipos de email** todos i18n'd en 7 idiomas
- **3.611 keys i18n** sincronizadas sin gaps
- **Validación i18n** pasa con 0 errores
- **Seguridad robusta**: cifrado AES-256-GCM, CSRF, RBAC, rate limiting
- **Código limpio**: sin dead code significativo, sin imports huérfanos
- **Coherencia BD ↔ Backend ↔ Frontend** verificada en todos los flujos

### Lo que necesita ATENCIÓN

| Prioridad | Pendiente | Esfuerzo estimado |
|-----------|-----------|-------------------|
| 🔴 Alta | Traducciones PT (~524 keys) y CA (~424 keys) — necesitan traductor profesional | 2-3 días (externo) |
| 🟡 Media | Migrar archivos a S3/R2 para escalar más allá de 50GB | 1-2 días |
| 🟡 Media | Implementar retención en tablas `visitas` y `emails` | 4 horas |
| 🟡 Media | Migrar rate limiting a Redis para multi-instancia | 4 horas |
| 🟡 Media | Persistir migraciones SQL (actualmente solo db:push) | 2 horas |
| 🟢 Baja | Consolidar traducciones PDF inline de `shared.ts` en sistema i18n central | 2 horas |
| 🟢 Baja | Integración Stripe directa (SDK server-side) para automatizar cobros | 1-2 días |
| 🟢 Baja | Servicio de tipo de cambio para facturación multi-divisa | 4 horas |

### Estimación de escalabilidad

| Métrica | Valor |
|---------|-------|
| Capacidad con 50GB (mix realista) | **~3.000 clientes** |
| Factor limitante principal | Documentos en disco (no BD) |
| Solución para escalar | Migrar a almacenamiento externo (S3/R2) |
| BD sola con 50GB | 25.000-185.000 clientes (sin archivos) |
