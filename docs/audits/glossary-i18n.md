# Glosario terminológico i18n — Exentax

> **Estado:** Activo · **Fecha:** 2026-04-21 · **Tarea:** #26 (BLOQUE 2)
> **Idiomas cubiertos:** es (canónico), en, fr, de, pt, ca

Este documento es el **único punto de entrada** del glosario terminológico
multilenguaje del proyecto. La fuente de verdad operacional vive ya en
[`exentax-web/docs/i18n-glossary.md`](../../exentax-web/docs/i18n-glossary.md)
y cubre todos los términos requeridos por la tarea #26 (LLC, ITIN, EIN,
estados, asesoría/asesoramiento, formación/constitución, agente registrado,
residencia fiscal, números de identificación, etc.).

Este `glossary-i18n.md` añade encima del glosario base las **decisiones
canónicas específicas para las 5 subpáginas LLC + ITIN** y los matices
detectados durante la auditoría #26.

---

## 1. Términos canónicos para subpáginas y nav

| Concepto                          | es (canon)                | en                          | fr                                  | de                                | pt                            | ca                              |
|-----------------------------------|---------------------------|-----------------------------|-------------------------------------|-----------------------------------|-------------------------------|---------------------------------|
| LLC en `<estado>`                 | LLC en …                  | `<state>` LLC               | LLC à / au …                        | LLC in …                          | LLC em …                      | LLC a …                         |
| Nuevo México (estado)             | Nuevo México              | New Mexico                  | Nouveau-Mexique                     | New Mexico                        | Novo México                   | Nou Mèxic                       |
| Wyoming / Delaware / Florida      | Wyoming / Delaware / Florida | (idéntico)               | Wyoming / Delaware / Floride        | (idéntico)                        | Wyoming / Delaware / Flórida  | Wyoming / Delaware / Florida    |
| Constituir una LLC                | constituir una LLC        | form an LLC                 | créer une LLC                       | LLC gründen                       | constituir uma LLC            | constituir una LLC              |
| Formación de LLC (servicio)       | constitución de LLC       | LLC formation               | création de LLC                     | LLC-Gründung                      | constituição de LLC           | constitució de LLC              |
| Agente registrado                 | agente registrado         | registered agent            | registered agent (literal)          | Registered Agent (literal)        | agente registrado             | agent registrat                 |
| Mantenimiento anual               | mantenimiento anual       | annual maintenance          | maintenance annuelle                | jährliche Compliance              | manutenção anual              | manteniment anual               |
| Informe anual (estado)            | informe anual             | annual report               | rapport annuel                      | Annual Report (literal)           | relatório anual               | informe anual                   |
| Privacidad real (de los miembros) | privacidad real           | real privacy                | confidentialité réelle              | echte Anonymität                  | privacidade real              | privacitat real                 |
| Protección patrimonial            | protección patrimonial    | asset protection            | protection patrimoniale             | Vermögensschutz                   | proteção patrimonial          | protecció patrimonial           |
| Asset protection (charging order) | charging order (literal)  | charging order              | charging order (literal)            | charging order (literal)          | charging order (literal)      | charging order (literal)        |
| No residente (fiscal EE. UU.)     | no residente              | non-resident                | non-résident                        | nicht in den USA ansässig         | não residente                 | no resident                     |
| Nómada digital                    | nómada digital            | digital nomad               | nomade numérique                    | digitaler Nomade                  | nómada digital                | nòmada digital                  |
| EIN (número fiscal LLC)           | EIN                       | EIN                         | EIN                                 | EIN                               | EIN                           | EIN                             |
| ITIN                              | ITIN                      | ITIN                        | ITIN                                | ITIN                              | ITIN                          | ITIN                            |
| Certifying Acceptance Agent (CAA) | Certifying Acceptance Agent (CAA) | (idéntico)          | (idéntico)                          | (idéntico)                        | (idéntico)                    | (idéntico)                      |
| BOI / BOIR (FinCEN)               | BOI / BOIR                | BOI / BOIR                  | BOI / BOIR                          | BOI / BOIR                        | BOI / BOIR                    | BOI / BOIR                      |
| Form 5472 / Form 1120             | Form 5472 / Form 1120     | (idéntico)                  | (idéntico)                          | (idéntico)                        | (idéntico)                    | (idéntico)                      |
| Cuenta bancaria estadounidense    | cuenta bancaria estadounidense | U.S. bank account     | compte bancaire américain           | US-Bankkonto                      | conta bancária americana      | compte bancari nord-americà     |
| Reservar / agendar                | agendar                   | book                        | réserver                            | buchen                            | agendar                       | reservar                        |

## 2. Decisiones de estilo (subpáginas LLC + ITIN)

- **Nombre de marca:** siempre `Exentax` (sin sufijo legal en SEO ni en H1).
- **Marca en `<title>`:** patrón `{Beneficio + keyword} | Exentax` en los 6 idiomas.
- **Tratamiento al lector:** seguir tabla §3 del [glosario base](../../exentax-web/docs/i18n-glossary.md):
  - es / ca / en: tuteo (`tu`, `your`).
  - fr / de / pt: forma cortés (`vous`, `Sie`, `você`).
- **Acrónimos US (LLC, EIN, ITIN, BOI, IRS, CAA, FinCEN):** se conservan
  literalmente en los 6 idiomas; en la primera aparición de cada subpágina se
  recomienda glosar entre paréntesis (`Limited Liability Company`,
  `Individual Taxpayer Identification Number`, etc.).
- **Nombres de estados:** localizar a `Nuevo México`, `Nouveau-Mexique`,
  `Novo México`, `Nou Mèxic`. **Dejar en inglés** Wyoming, Delaware (todas
  las lenguas) y Florida (excepto pt = `Flórida`, fr = `Floride`).
- **Tratamiento de `EE. UU.` / `EE.UU.` / `U.S.` / `USA`:**
  - es / ca: `EE. UU.` con espacio fino.
  - en: `U.S.` (descriptivo) o `the United States` (formal).
  - fr: `É.-U.` o `États-Unis`.
  - de: `USA`.
  - pt: `EUA`.

## 3. Términos a evitar (falsos amigos / calcos)

| ❌ Evitar                         | ✅ Forma correcta                  | Motivo                                       |
|-----------------------------------|------------------------------------|----------------------------------------------|
| `eventually` (en) por "eventualmente" | `possibly`, `at some point`     | Falso amigo clásico                          |
| `actually` (en) por "actualmente"     | `currently`, `now`              | Falso amigo clásico                          |
| `comprehensive` por "comprensivo"     | `exhaustivo`, `completo`        | Falso amigo                                  |
| `advices` (en, plural)               | `advice` (incontable)            | Error gramatical                             |
| Traducir `Operating Agreement`        | Mantener literal en los 6 idiomas | Documento legal específico US               |
| Traducir `Registered Agent` (en es/pt usar `agente registrado` solo como gloss) | `Registered Agent` literal en de/fr; `agente registrado` aceptado en es/pt/ca | Es un rol legal con nombre propio en EE. UU. |
| `LLC's` (en) como plural             | `LLCs`                           | Apóstrofe sólo para posesivo                 |
| `Floride` en pt                       | `Flórida`                        | Localización pt-BR/pt-PT                     |

## 4. Mantenimiento

- Cualquier término nuevo introducido en `subpages.ts`,
  `i18n/locales/*.ts`, `blog-content/<lang>/*.ts` o `blog-i18n/<lang>.ts` debe
  añadirse aquí (o al glosario base) **antes** de mergearse.
- En caso de divergencia entre este documento y el glosario base, **prevalece
  esta tabla** para subpáginas LLC + ITIN; el glosario base sigue siendo la
  fuente de verdad para resto del producto y blog.
- Validación: el script `scripts/i18n-quality-audit.ts` revisa coherencia
  cuantitativa entre locales; este glosario aporta la coherencia cualitativa.
