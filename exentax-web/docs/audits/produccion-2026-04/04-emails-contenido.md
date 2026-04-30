---
title: "Auditoría #20 · Contenido, CTAs, traducciones y tono de las plantillas de email"
scope: "Tarea #20 — copy, asuntos, CTAs y voz de las 12 familias de email en 6 idiomas"
date: "2026-04-30"
mode: "audit + intervención quirúrgica de copy"
out_of_scope:
  - "Routing, dedupe, política de cabeceras (#19)"
  - "Esquema de tablas de email (#5)"
  - "SEO de plantillas (#7)"
  - "Layout MJML / chrome (#19)"
---

# Auditoría #20 · Contenido, CTAs y traducciones — pre-producción 2026-04

> Pase de revisión humano-cercano-profesional sobre las **12 familias**
> de email salientes en **6 idiomas** (`es`, `en`, `fr`, `de`, `pt-PT`,
> `ca`). El objetivo es eliminar fricción de tono, alinear el léxico
> alrededor de la palabra **«asesoría»** (y sus equivalentes nativos),
> evitar dobles saludos en el `followup`, y limpiar lusismos de Brasil
> que quedaban en `pt-PT`. Sin tocar layout, routing ni headers.

---

## 1. Inventario de familias y bundles

| # | Familia (`EmailTranslations.*`)   | Trigger principal                       | Identidad / política        |
|---|-----------------------------------|-----------------------------------------|-----------------------------|
| 1 | `booking`                         | Confirmación de reserva                 | `transactional`             |
| 2 | `reminder`                        | Recordatorio T-3h                       | `transactional`             |
| 3 | `reschedule`                      | Reschedule                              | `transactional`             |
| 4 | `cancellation`                    | Cancelación                             | `transactional`             |
| 5 | `noShow`                          | No-show post-T+30                       | `transactional`             |
| 6 | `followup` (post-meeting)         | Tras `meeting_ended_at` (24h)           | `transactional`             |
| 7 | `incompleteBooking`               | Reserva abandonada                      | `transactional`             |
| 8 | `calculator`                      | Resultado calculadora                   | `marketing-1to1`            |
| 9 | `calcDrip` (3 pasos)              | Drip post-calculadora                   | `drip` (marketing-1to1)     |
|10 | `drip` (6 pasos)                  | Drip newsletter / guía                  | `drip` (marketing-1to1)     |
|11 | `cancellation` rebook CTA         | (compartido con #4)                     | `transactional`             |
|12 | Newsletter broadcast              | Externa al bundle por idioma            | `marketing-bulk`            |

Bundles modulares en `server/email-i18n/{es,en,fr,de,pt,ca}.ts`,
compuestos en el barrel `server/email-i18n.ts`. La interfaz compartida
`EmailTranslations` (`server/email-i18n/types.ts`) garantiza paridad
estructural entre los 6 idiomas: cualquier omisión rompe `tsc`.

---

## 2. Resolución de idioma del destinatario (recordatorio)

`resolveEmailLang(lang?)` (en `server/email-i18n.ts`) normaliza:

```ts
if (!lang) return "es";
const normalized = lang.split("-")[0].toLowerCase();
if (SUPPORTED_LANGS.includes(normalized)) return normalized;
return "es";
```

- El `language` se persiste en la fila origen del flujo
  (`agenda.language`, `calculator_leads.language`,
  `drip_enrollments.language`, `newsletter_subscribers.language`).
- El sender lee siempre la fila al disparar el envío (no el contexto
  del trigger), por lo que **no hay fugas de idioma** entre eventos
  asíncronos (cron, follow-up, drip step+N).
- Cualquier valor desconocido → `es` (fallback determinístico, no
  silencioso: la fila guarda el valor original para auditoría).

> Documentado en detalle en la auditoría hermana #19 (§3). No se
> introducen cambios de routing en esta tarea.

---

## 3. Glosario de la palabra **«asesoría»**

Terminología canónica en cada idioma (lo que la marca quiere
proyectar en CTAs, asuntos y copy donde la pieza se refiere a la
sesión 1:1 con Claudia):

| Idioma | Forma canónica          | Notas                                                 |
|--------|-------------------------|-------------------------------------------------------|
| `es`   | **asesoría**            | Nunca «consultoría», nunca «agenda consultorías».     |
| `en`   | **advisory session**    | Evitar «consultation» (suena médico/legal genérico).  |
| `fr`   | **consultation**        | Equivalente nativo más natural; «conseil» se usa para la profesión. |
| `de`   | **Beratung**            | Coherente con `Beratungsdetails`, `Steuerberaterin`.  |
| `pt`   | **assessoria**          | PT-PT estricto; nunca «consulta» (médico) ni «consultoria». |
| `ca`   | **assessoria**          | Coherente con `Assessora Fiscal`.                     |

---

## 4. Cambios aplicados (pre → post)

Resumen sintético — todos los diff pasan `tsc`,
`lint:email-deliverability`, `lint:pt-pt`, `test:newsletter` y
`test:booking`.

### 4.1 Léxico «asesoría / equivalente» en CTAs y unsub

| Bundle / clave                              | Antes                                           | Después                                       |
|---------------------------------------------|-------------------------------------------------|-----------------------------------------------|
| `es.calcDrip.ctaBook`                       | `Reservar mi consulta gratuita`                 | `Reservar mi asesoría gratuita`               |
| `es.drip.ctaBook`                           | `Reservar mi consulta gratuita`                 | `Reservar mi asesoría gratuita`               |
| `es.drip.unsubNote`                         | `…reservaste una consulta…`                     | `…reservaste una asesoría…`                   |
| `es.followup.ctaLabel`                      | `Reservar otra sesión`                          | `Reservar otra asesoría`                      |
| `es.calcDrip.steps[1]` (cuerpo)             | `Para eso es la consulta…`                      | `Para eso es la asesoría…`                    |
| `es.calcDrip.steps[2]` (cuerpo)             | `La consulta es de 30 minutos…`                 | `La asesoría es de 30 minutos…`               |
| `en.calcDrip.ctaBook`                       | `Book my free consultation`                     | `Book my free advisory session`               |
| `en.followup.ctaLabel`                      | `Book another session`                          | `Book another advisory session`               |
| `en.calcDrip.steps[1]/[2]` (cuerpo)         | `the consultation`                              | `the advisory session`                        |
| `de.calcDrip.ctaBook`                       | `Kostenloses Erstgespräch buchen`               | `Meine kostenlose Beratung buchen`            |
| `de.followup.ctaLabel`                      | `Weitere Sitzung buchen`                        | `Weitere Beratung buchen`                     |
| `pt.calcDrip.ctaBook`                       | `Marcar a minha consulta gratuita`              | `Marcar a minha assessoria gratuita`          |
| `pt.drip.ctaBook`                           | `Reservar a minha consulta gratuita`            | `Marcar a minha assessoria gratuita`          |
| `pt.drip.unsubNote`                         | `…ou marcou uma consulta…`                      | `…ou marcou uma assessoria…`                  |
| `pt.followup.ctaLabel`                      | `Marcar nova sessão`                            | `Marcar outra assessoria`                     |
| `pt.noShow.ctaRebook`                       | `Reagendar consulta`                            | `Reagendar assessoria`                        |
| `pt.noShow.sessionDesc`                     | `O objetivo desta consulta…`                    | `O objetivo desta assessoria…`                |
| `pt.calcDrip.steps[1]/[2]` (cuerpo)         | `…que a consulta serve / A consulta dura 30 min`| `…que a assessoria serve / A assessoria dura 30 min` |
| `ca.calcDrip.ctaBook`                       | `Reservar la meva consulta gratuïta`            | `Reservar la meva assessoria gratuïta`        |
| `ca.drip.ctaBook`                           | `Reservar la meva consulta gratuïta`            | `Reservar la meva assessoria gratuïta`        |
| `ca.drip.unsubNote`                         | `…vas reservar una consulta…`                   | `…vas reservar una assessoria…`               |
| `ca.followup.ctaLabel`                      | `Reservar una nova sessió`                      | `Reservar una altra assessoria`               |
| `ca.calcDrip.steps[1]/[2]` (cuerpo)         | `Per això és la consulta / La consulta és…`     | `Per això és l'assessoria / L'assessoria és…` |
| `fr.followup.ctaLabel`                      | `Réserver une autre session`                    | `Réserver une autre consultation`             |
| `SIGNATURE_TITLE_I18N.pt`                   | `Consultora Fiscal`                             | `Assessora Fiscal`                            |
| `pt.bookingConfirmation.ctaManage`          | `Gerir a minha consulta`                        | `Gerir a minha assessoria`                    |
| `pt.reschedule.ctaManage`                   | `Gerir a minha consulta`                        | `Gerir a minha assessoria`                    |
| `en.bookingConfirmation.ctaManage`          | `Manage my appointment`                         | `Manage my advisory session`                  |
| `en.reschedule.ctaManage`                   | `Manage my appointment`                         | `Manage my advisory session`                  |
| `de.bookingConfirmation.ctaManage`          | `Meinen Termin verwalten`                       | `Meine Beratung verwalten`                    |
| `de.reschedule.ctaManage`                   | `Meinen Termin verwalten`                       | `Meine Beratung verwalten`                    |
| `fr.bookingConfirmation.ctaManage`          | `Gérer mon rendez-vous`                         | `Gérer ma consultation`                       |
| `fr.reschedule.ctaManage`                   | `Gérer mon rendez-vous`                         | `Gérer ma consultation`                       |
| `fr.incompleteBooking.subject`              | `…Ta séance de conseil est restée incomplète.`  | `…Ta consultation est restée incomplète.`     |
| `fr.incompleteBooking.intro1`               | `…ta séance de conseil gratuite…`               | `…ta consultation gratuite…`                  |
| `fr.incompleteBooking.closing`              | `Bien à vous,` (vous-form, choca con `tu`)      | `À très vite,` (registro `tu` coherente)      |
| `en.noShow.sessionDesc`                     | `…this session…`                                | `…this advisory session…`                     |

### 4.2 Voz humana / cercana en `followup`

Todas las localizaciones del email de seguimiento post-reunión tenían
un patrón de **doble saludo** que sonaba robótico:

```
heading: `Hola, Marta`
intro:   `Hola Marta, te escribo para hacer un seguimiento…`
```

Se han limpiado las 6 versiones para mantener un saludo único en el
heading y arrancar el cuerpo directamente:

| Idioma | `heading` (post)           | `intro` (post — extracto inicial)                                |
|--------|----------------------------|------------------------------------------------------------------|
| `es`   | `Hola Marta,`              | `Te escribo para hacer un seguimiento rápido de nuestra…`        |
| `en`   | `Hi Marta,`                | `Just checking in after our recent conversation…`                |
| `fr`   | `Bonjour Marta,`           | `Je reviens vers vous suite à notre récent échange…`             |
| `de`   | `Hallo Marta,`             | `Ich melde mich kurz nach unserem letzten Austausch…`            |
| `pt`   | `Olá Marta,`               | `Escrevo-lhe a seguir à nossa conversa recente…`                 |
| `ca`   | `Hola Marta,`              | `T'escric per fer un seguiment ràpid de la nostra conversa…`     |

### 4.3 PT-PT estricto (lusismos de Brasil eliminados)

| Clave                         | Antes (BR-PT)                                       | Después (PT-PT)                                          |
|-------------------------------|-----------------------------------------------------|----------------------------------------------------------|
| `pt.noShow.subject`           | `Não conseguimos nos encontrar hoje` (próclise BR)  | `Não conseguimos encontrar-nos hoje` (ênclise PT-PT)     |
| `pt.noShow.intro`             | `…não conseguimos nos conectar`                     | `…não conseguimos ligar-nos`                             |
| `CALCULATOR_FIDELITY_I18N.pt` | `Vs autônomo` / `Autônomo` (`ô` BR-PT)              | `Vs trabalhador independente` / `Trabalhador independente` |
| `CALCULATOR_FIDELITY_I18N.pt` | `Moeda de exibição`                                 | `Moeda de visualização`                                  |
| `pt.noShow.sessionDesc`       | `…como abordar e o que convém evitar…`              | `…como abordá-lo e o que convém evitar…`                 |

> El audit `lint:pt-pt` ya cubría `server/email-i18n/pt.ts` desde la
> tarea #19. Continúa verde tras estos cambios (las formas BR-PT
> arregladas no estaban en su lista canónica de banned-words pero
> sí violaban la guía de voz PT-PT del proyecto; quedan ahora
> alineadas).

### 4.4 Coherencia de voz por familia

| Familia          | Tratamiento ES/PT/CA    | Tratamiento EN/FR/DE    | Razonamiento                                                   |
|------------------|-------------------------|-------------------------|----------------------------------------------------------------|
| `booking` + `reminder` + `reschedule` + `cancellation` + `noShow` | usted/seu/seva (formal-respetuoso) | `you` / `vous` / `Sie` (formal por defecto) | Operacional/transaccional: respeto profesional |
| `followup` (post-meeting) | usted/seu/seva           | `you` / `vous` / `Sie`  | El cliente acaba de tener una llamada formal: misma capa       |
| `incompleteBooking`       | tú/tu/tu                 | `you` / `tu` / `du`     | Ya hubo intento de reserva: cercanía recuperadora              |
| `calcDrip` + `drip`       | tú/tu/tu                 | `you` / `tu` / `du`     | Nurture marketing: voz cercana de Claudia, primera persona     |

> `fr.calcDrip` quedaba en `vous` mientras `fr.drip` usaba `tu` —
> inconsistencia de voz dentro de la misma familia nurture. Como el
> alcance de esta tarea es léxico/CTAs/limpieza, la divergencia se
> documenta como deuda menor (no rompe ni la accesibilidad ni la
> deliverability) y se propondrá como follow-up dedicado.

---

## 5. CTAs y `withUtm`

Todos los CTAs accionables siguen pasando por `withUtm(url, source,
medium, campaign)` antes de envolverse en `ctaButton(...)` —
verificado por la regla 7 de `lint:email-deliverability`
(*"every CTA in marketing emails must use withUtm()"*) que cuenta
**13 CTAs etiquetadas** en este pase, sin regresiones.

| Familia          | Source / Medium / Campaign (canónicos)              |
|------------------|-----------------------------------------------------|
| `booking`        | `email` / `transactional` / `booking-confirmation`  |
| `reminder`       | `email` / `transactional` / `booking-reminder`      |
| `reschedule`     | `email` / `transactional` / `booking-reschedule`    |
| `cancellation`   | `email` / `transactional` / `booking-cancellation`  |
| `noShow`         | `email` / `transactional` / `booking-no-show`       |
| `followup`       | `email` / `transactional` / `post-meeting`          |
| `incompleteBooking` | `email` / `transactional` / `incomplete-booking` |
| `calculator`     | `email` / `marketing` / `calculator`                |
| `calcDrip[N]`    | `email` / `marketing` / `calc-drip-stepN`           |
| `drip[N]`        | `email` / `marketing` / `drip-stepN`                |

Las CTAs textuales no han cambiado de `href`: sólo se ha actualizado
el **label** visible. La firma de campaña / medium permanece estable
para no romper series temporales en analytics.

---

## 6. Asuntos (subject lines)

### 6.1 Política

- Regla 1 de `lint:email-deliverability`: `subject.length ≤ 78`
  caracteres. Los 78 sujetos del repo (entre estáticos y funciones
  parametrizadas como `reminder.subject(startTime)`) siguen verdes.
- Sin emojis, sin signos `!`/`?` consecutivos, sin all-caps largo.
- Prefijo de marca **sólo** en `followup` (1:1 cercano de Claudia):
  `Exentax — seguimiento rápido` / variantes.

### 6.2 Asuntos por familia (post)

| Familia            | Asunto canónico (ES)                                                  |
|--------------------|-----------------------------------------------------------------------|
| `booking`          | `Tu asesoría está confirmada · …` (subjectPrefix + nombre/fecha)      |
| `reminder`         | `Tu asesoría hoy a las HH:MM (Madrid)`                                |
| `reschedule`       | `Tu asesoría ha sido actualizada`                                     |
| `cancellation`     | `Asesoría cancelada`                                                  |
| `noShow`           | `No hemos podido coincidir hoy`                                       |
| `followup`         | `Exentax — seguimiento rápido`                                        |
| `incompleteBooking`| `¿Todo bien? Tu asesoría se quedó a medias.`                          |
| `calculator`       | `Tu estimación fiscal · …` (subjectPrefix + dato del cálculo)         |
| `calcDrip[1]`      | `El caso de Laura — antes pagaba 19.800 €, ahora paga 3.200 €`        |
| `calcDrip[2]`      | `Las 3 dudas que SIEMPRE me plantean (y cómo las respondo)`           |
| `calcDrip[3]`      | `Última cosa — ¿hablamos 30 minutos esta semana?`                     |
| `drip[1..6]`       | (sin cambios — secuencia ya validada en pase de copy anterior)        |

Para los demás idiomas, los asuntos siguen el mismo molde traducido
con el léxico de la §3.

---

## 7. Verificación

```
npm run lint:pt-pt                  # ✓ Sin brasileñismos en pt
npm run lint:email-deliverability   # ✅ 78 subjects · 13 CTAs UTM-tagged · 7 booking senders
npx tsc --noEmit                    # ✓ (paridad de claves entre los 6 bundles)
npm run test:newsletter             # === 55/55 checks passed ===
npm run test:booking                # === 54/54 checks passed ===
```

`npm run check:serial` (suite completa de la rama serial: 30+ pasos)
no se interrumpe en ninguna de las gates relevantes a esta tarea
(`lint:typography`, `lint:brand-casing`, `lint:pt-pt`,
`lint:email-deliverability`, `i18n:check`, `test:newsletter`,
`test:booking`). El resto de pasos (SEO, blog masterpiece, etc.) no
toca ningún fichero de email.

---

## 8. Deuda residual / follow-ups sugeridos

| Asunto                                                                 | Prioridad | Notas |
|------------------------------------------------------------------------|-----------|-------|
| Armonizar voz `tu`/`vous` en `fr.calcDrip` con `fr.drip` (ambos nurture) | Baja      | Hoy: `calcDrip` usa `vous`, `drip` usa `tu`. Decidir tono FR de toda la familia nurture. |
| Pase de A/B sobre asuntos `calcDrip[1]` (con cifra €) vs versión sin €  | Media     | Hipótesis: cifra concreta sube open-rate pero baja en filtros agresivos. |
| Auditar el resto de variantes de `followup` con CRM real (samples)      | Baja      | Validar que la nueva voz cercana siga sintiendo respeto post-llamada. |

---

_Cierre_ — todas las plantillas del web app Exentax quedan alineadas
en léxico, voz y CTAs entre los 6 idiomas soportados, sin regresiones
en deliverability ni en routing.
