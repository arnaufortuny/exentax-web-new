# Translation Guide — Exentax Web

Glosario terminológico + reglas de estilo + checklist para cada una de las 6
lenguas soportadas: **ES · EN · FR · DE · PT · CA**. Este documento es de
referencia para revisores humanos nativos (ver `PENDING.md §1`).

ES es la lengua fuente. Ante duda, ES manda.

---

## 1. Términos invariables (NO traducir nunca)

| Término | Forma canónica | Por qué |
|---|---|---|
| **Exentax** | `Exentax` | Marca. Nunca "ExenTax", "ExenTax", "EXENTAX". El lint `brand-casing-check.mjs` lo bloquea. |
| **LLC** | `LLC` | Forma jurídica US. Jamás "SRL", "Sociedad de Responsabilidad Limitada", "Gesellschaft mit beschränkter Haftung". |
| Form 5472 / Form 1120 / Form 8832 | Literal | Formularios IRS. |
| **ITIN** / **EIN** / **SSN** | Literal | Identificadores fiscales US. |
| **W-8BEN / W-8BEN-E** | Literal | Formularios fiscales. |
| **BOI Report** / **FinCEN** / **IRS** | Literal | Organismos y reportes US. |
| **Mercury / Wise / Stripe** | Literal | Nombres de producto. |
| **Registered Agent** | Literal | Figura jurídica estadounidense, mantener en inglés. |
| **Nuevo México / Wyoming / Delaware / Florida** | Variante local del topónimo | ES/CA: "Nuevo México"; EN: "New Mexico"; FR: "Nouveau-Mexique"; DE: "New Mexico"; PT: "Novo México". |

---

## 2. Autónomo — adaptación contextual

`autónomo` (ES) es un régimen fiscal **específico español**. No existe
traducción literal 1-a-1.

| Idioma | Equivalente principal | Notas |
|---|---|---|
| **ES** | `autónomo` | Forma canónica, minúscula. |
| **CA** | `autònom` / `treballador independent` | Según registro. |
| **EN** | `self-employed` (genérico) / `sole trader` (UK) / `independent contractor` (US) | En contenido explicativo sobre España mantener "Spanish *autónomo* (self-employed)" con glosa. |
| **FR** | `auto-entrepreneur` / `indépendant` | `auto-entrepreneur` cuando hable del régimen simplificado; `indépendant` en sentido genérico. |
| **DE** | `Selbstständiger` / `Freiberufler` | `Freiberufler` si es profesión liberal; `Selbstständiger` si es actividad comercial o genérico. |
| **PT** | `trabalhador independente` / `trabalhador por conta própria` | Evitar "recibos verdes" en artículos técnicos (es coloquial). |

---

## 3. Términos fiscales España

| Término ES | EN | FR | DE | PT | CA |
|---|---|---|---|---|---|
| IRPF | `Spanish income tax (IRPF)` | `impôt sur le revenu espagnol (IRPF)` | `spanische Einkommensteuer (IRPF)` | `imposto sobre o rendimento espanhol (IRPF)` | `IRPF` |
| Cuota autónomo / cotización | `mandatory monthly social security contribution` | `cotisation mensuelle obligatoire (Sécurité sociale)` | `monatlicher Pflichtbeitrag zur Sozialversicherung` | `contribuição mensal obrigatória à Segurança Social` | `quota d'autònom / cotització` |
| Seguridad Social / TGSS | `Spanish Social Security (TGSS)` | `Sécurité sociale espagnole (TGSS)` | `spanische Sozialversicherung (TGSS)` | `Segurança Social espanhola (TGSS)` | `Seguretat Social / TGSS` |
| AEAT / Hacienda | `Spanish tax authority (AEAT)` | `administration fiscale espagnole (AEAT)` | `spanische Steuerbehörde (AEAT)` | `autoridade fiscal espanhola (AEAT)` | `Hisenda (AEAT)` |
| Modelo 720 | `Form 720 (report of foreign assets)` | `Modelo 720 (déclaration d'avoirs à l'étranger)` | `Modelo 720 (Meldung von Auslandsvermögen)` | `Modelo 720 (declaração de ativos no estrangeiro)` | `Model 720` |
| Base liquidable | `taxable base` | `base imposable` | `steuerpflichtige Bemessungsgrundlage` | `base tributável` | `base liquidable` |
| Tramo (IRPF) | `tax bracket` | `tranche d'imposition` | `Steuertarifstufe` | `escalão de IRS` | `tram` |
| Régimen pass-through | `pass-through taxation` (literal, US) | `régime pass-through` (US) | `Pass-Through-Besteuerung` | `tributação pass-through` | `règim pass-through` |

---

## 4. Precios y moneda

Los precios Exentax son **fijos y exactos**, no aproximados:

- Constitución LLC: **2.000 €** (ES/CA/PT/DE), **€2,000** (EN), **2 000 €** (FR).
- Mantenimiento anual: **1.400 €/año** · **€1,400/year** · **1 400 €/an**.

❌ Prohibido: `~2.000`, `desde 2.000 aprox`, `unos 1.500 €`. El lint no lo bloquea
de forma automática todavía, así que **revisor nativo debe vigilarlo**.

Formato de miles por idioma:

| Idioma | Miles | Decimales | Moneda |
|---|---|---|---|
| ES / PT | `.` | `,` | `2.000 €` / `€2.000` |
| EN | `,` | `.` | `€2,000` / `$2,000` |
| FR | espacio duro (` `) | `,` | `2 000 €` |
| DE | `.` | `,` | `2.000 €` |
| CA | `.` | `,` | `2.000 €` |

---

## 5. CTAs — patrones idiomáticos

No traducir CTAs literalmente. Adaptar a la construcción idiomática y al tono
cercano-técnico-persuasivo de Exentax.

| Acción | ES | EN | FR | DE | PT | CA |
|---|---|---|---|---|---|---|
| Agendar consulta | `Agenda una consulta gratuita` | `Book a free strategy call` | `Réservez un appel stratégique offert` | `Kostenloses Strategiegespräch buchen` | `Agende uma consulta gratuita` | `Agenda una consulta gratuïta` |
| Constituir LLC | `Constituye tu LLC desde 2.000 €` | `Start your LLC from €2,000` | `Créez votre LLC à partir de 2 000 €` | `Gründen Sie Ihre LLC ab 2.000 €` | `Constitua a sua LLC a partir de 2.000 €` | `Constitueix la teva LLC des de 2.000 €` |
| Calcular ahorro | `Calcula cuánto ahorras con tu LLC` | `Calculate your LLC savings` | `Calculez vos économies avec une LLC` | `Berechne deine LLC-Ersparnis` | `Calcule a sua poupança com a LLC` | `Calcula quant estalvies amb la teva LLC` |

❌ **Prohibido**: `Click here`, `Read more`, `Contact us`, `Saber más`,
`En savoir plus`, `Mehr erfahren`, `Saiba mais`. Sustituir por verbos de acción
+ beneficio.

---

## 6. Tono editorial Exentax (válido para los 6 idiomas)

- **Cercano pero experto**: tutear cuando el idioma lo admite (ES tú, FR tu,
  DE du [proyecto ha elegido Sie por registro profesional — consultar antes de
  cambiar], PT tu, CA tu). EN por defecto es informal (`you`).
- **Técnico accesible**: la precisión técnica justifica la autoridad. Cuando
  introduzcas un término técnico, explícalo la primera vez.
- **Persuasivo, no agresivo**: "te ayudamos a" > "compra ahora o pierdes X".
- **Honesto**: las comparativas LLC vs autónomo/SL deben ser verificables.
  Si el perfil del usuario no se beneficia con LLC, decírselo ("LLC not best").
- **Acción favorecida**: cada artículo termina con CTA específico, no genérico.
- **Cero inglesismos gratuitos** en ES/CA/FR: `roadmap` → `hoja de ruta`,
  `framework` → `marco`, salvo que el anglicismo sea el término técnico de
  facto (ej. `pass-through`, `LLC`, `Registered Agent`).

---

## 6b. Patrones PT-BR vs PT-PT (descubiertos en sesión 2026-04)

El lint `scripts/audit-pt-pt.mjs` bloquea una lista concreta de brasileñismos
pero **no captura todo**. Patrones adicionales que debe vigilar el revisor:

| BR-style (prohibido) | PT-PT (correcto) | Dónde apareció |
|---|---|---|
| `conosco` | `connosco` (doble N) | `footer.companyLinks.talk`, `booking.whatsappConfirmCta`, varios CTAs |
| `Nossos serviço` (sin artículo) | `Os nossos serviços` | Páginas de servicios |
| `minha fiscalidade` (sin artículo) | `a minha fiscalidade` | CTAs y WhatsApp msgs |
| `meu património` | `o meu património` | FAQs, heroes |
| `precisa fazer X` | `precisa de fazer X` | Transactional content |
| `até a X` | `até à X` (preposição contraída) | Geographical references |
| `tiramos o ITIN` | `tratamos do ITIN` | Service descriptions |
| `Fale conosco` (BR) | `Fale connosco` / `Falar connosco` | CTAs |
| `... situação. receberá...` | `... situação. Receberá...` (capital tras punto) | Emails/booking confirmations |
| `Quero otimizar minha X` | `Otimizar a minha X` (infinitivo + artigo) | CTAs |
| `para si começar` (odd) | `para começar a operar` | FAQs |
| `pode se registar` (ênclise BR) | `pode registar-se` (ênclise PT-PT) | Transactional content |

Todos estos patrones se aplicaron en la sesión de limpieza lingüística
de 2026-04 (commits `08b5d9f` y `8a63855`). Cuando se añada contenido
nuevo PT, revisar contra esta tabla **antes** de ejecutar `npm run check`.

## 6c. Patrones de calcos en CTAs (los 5 idiomas no-ES)

El copywriting publicitario moderno usa **infinitivo o imperativo**, nunca
declarativo en primera persona. El calco del ES "Quiero X" es la trampa
más frecuente en CTAs traducidos por IA:

| Idioma | Calco (prohibido) | Natural (correcto) |
|---|---|---|
| EN | `I want to optimize my taxes` | `Optimize my tax setup` |
| EN | `I want to structure my business` | `Structure my business` |
| FR | `Je veux optimiser ma fiscalité` | `Optimiser ma fiscalité` |
| DE | `Ich möchte meine Steuern optimieren` | `Steuern jetzt optimieren` |
| DE | `Ich möchte mein Unternehmen strukturieren` | `Unternehmen strukturieren` |
| PT | `Quero otimizar minha fiscalidade` | `Otimizar a minha fiscalidade` |
| CA | `Vull optimitzar la meva fiscalitat` | `Optimitzar la meva fiscalitat` |

Regla nemotécnica: si la cadena empieza con el equivalente de "Yo quiero…" / "I want to…",
está mal. Cambiar a infinitivo o imperativo.

## 7. Checklist del revisor nativo

Antes de aprobar una locale:

- [ ] Ninguna traducción idéntica a ES que no deba serlo (ver
      `scripts/validate-i18n.ts` → sección "Possibly untranslated").
- [ ] Placeholders `{{var}}` coinciden 1:1 con ES (ya validado por el linter).
- [ ] Tono cercano-técnico-persuasivo coherente en todo el fichero.
- [ ] CTAs idiomáticos, no literales.
- [ ] Precios con formato numérico correcto para el idioma.
- [ ] Términos de §1 (LLC, Exentax, etc.) respetados literalmente.
- [ ] Adaptaciones culturales donde `autónomo`/`IRPF` aparecen (usar §2-§3).
- [ ] Ningún espacio doble, ninguna puntuación española en frase extranjera.
- [ ] En PT: sin brasileñismos (`scripts/audit-pt-pt.mjs` lo bloquea).

---

## 8. Proceso recomendado

1. Fork local + actualizar `client/src/i18n/locales/<idioma>.ts` + ficheros
   `client/src/data/blog-content/<idioma>/` y `blog-i18n/<idioma>.ts`.
2. Ejecutar `npm run i18n:check` y `npm run lint:blog`.
3. Ejecutar `npm run lint:pt-pt` si es pt.
4. PR con descripción del cambio + nombre del revisor nativo + referencias
   (fuentes si cambiaste datos).
5. Reviewer: abrir el fichero en entorno productivo (`yarn dev`) y navegar 6
   idiomas visualmente antes de aprobar.
