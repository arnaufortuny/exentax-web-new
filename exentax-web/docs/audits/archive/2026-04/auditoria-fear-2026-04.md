# Auditoría fear-of-Hacienda — Abril 2026 (Task #25)

## Contexto editorial

La línea editorial es **alarmar sobre el coste de ser autónomo en España**, NO meter miedo a Hacienda. La Task #23 limpió 5 artículos de mayor severidad (`susto`, `te van a pillar`, `alerta automática`); esta task barre los ~430 restantes y deja un guard automático.

## Cambios en el guard automático (`scripts/blog-content-lint.mjs`)

1. El linter ahora escanea también los 444 artículos por idioma bajo `client/src/data/blog-content/{es,en,fr,de,pt,ca}/*.ts` (antes solo cubría `blog-posts*.ts` raíz).
2. Nueva clase de hallazgo `fear` con dos grupos:
   - **Emocional (siempre prohibido):** `te van a pillar`, `susto`/`sustos`, `pánico`/`pânico`/`panic`/`panique`/`Panik`.
   - **Cárcel/prisión (prohibido salvo contexto legal):** `cárcel`, `prison`, `jail`, `imprisonment`, `Gefängnis`, `prisión`, `prisão`. Se permite cuando la línea contiene un marcador legal (multa/penalty/Strafe/amende, IRC, FinCEN, BOI, Form NNNN, `§N`, o duración numérica `\d+ years|años|anos|ans|Jahre`).
3. 11 fixtures nuevos en `scripts/blog-content-lint.test.mjs` (38 totales). `npm run` test verde.

## Hallazgos editados (23 reescrituras: 20 en artículos por idioma + 3 en metadescripciones de `blog-posts.ts`)

| Archivo | Cambio |
|---|---|
| `es/form-5472-que-es-como-presentarlo.ts` L92 | "no entres en pánico" → "mantén la calma" |
| `es/como-disolver-cerrar-llc-paso-a-paso.ts` L3 | "sin susto a tres años vista" → "sin sorpresas a tres años vista" |
| `es/evitar-bloqueos-mercury-wise-revolut.ts` L47 | "No entres en pánico" → "Mantén la calma" |
| `es/tengo-llc-checklist-gestion-correcta.ts` L125 | "no entres en pánico" → "mantén la calma" |
| `en/tengo-llc-checklist-gestion-correcta.ts` L125 | "don't panic" → "stay calm" |
| `en/form-5472-que-es-como-presentarlo.ts` L95 | "don't panic" → "stay calm" |
| `en/evitar-bloqueos-mercury-wise-revolut.ts` L49 | "Don't panic" → "Stay calm" |
| `pt/como-disolver-cerrar-llc-paso-a-paso.ts` L3 | "sem sustos a três anos" → "sem surpresas a três anos" |
| `pt/tengo-llc-checklist-gestion-correcta.ts` L125 | "não entre em pânico" → "mantenha a calma" |
| `pt/form-5472-que-es-como-presentarlo.ts` L94 | "não entres em pânico" → "mantém a calma" |
| `pt/evitar-bloqueos-mercury-wise-revolut.ts` L47 | "Não entres em pânico" → "Mantém a calma" |
| `pt/que-es-irs-guia-duenos-llc.ts` L114 | "hora de entrar em pânico" → "hora de agir com urgência" |
| `de/tengo-llc-checklist-gestion-correcta.ts` L125 | "nicht in Panik geraten" → "Ruhe bewahren" |
| `de/form-5472-que-es-como-presentarlo.ts` L3 | "kein Grund zur Panik" → "kein Grund zur Sorge" |
| `de/form-5472-que-es-como-presentarlo.ts` L94 | "geraten Sie nicht in Panik" → "bewahren Sie die Ruhe" |
| `de/evitar-bloqueos-mercury-wise-revolut.ts` L47 | "Keine Panik" → "Ruhe bewahren" |
| `de/cuenta-bancaria-mercury-llc-extranjero.ts` L49 | "Keine Panik" → "Kein Grund zur Sorge" |
| `de/extension-irs-form-1120-como-solicitarla.ts` L72 | "Last-Minute-Panik" → "Last-Minute-Hektik" |
| `de/que-es-irs-guia-duenos-llc.ts` L114 | "wann tatsächlich Panik angebracht ist" → "wann tatsächlich Eile geboten ist" |
| `fr/form-5472-que-es-como-presentarlo.ts` L94 | "pas de panique" → "gardez votre calme" |
| `client/src/data/blog-posts.ts` L906 | meta "regularizar sin pánico" → "regularizar con calma" |
| `client/src/data/blog-posts.ts` L918 | meta "cumplir sin sustos" → "cumplir sin sorpresas" |
| `client/src/data/blog-posts.ts` L1066 | meta "cerrar tu LLC americana sin susto" → "sin sorpresas" |

## Hallazgos conservados (legítimos)

Las 6 referencias `prison/imprisonment` que se conservaron son citas de sanciones reales de FinCEN/IRS dentro de tablas de penalizaciones; todas pasan el allowlist legal del guard:

- `en/boi-report-fincen-guia-completa-2026.ts:52` — "$10,000 fine and up to 2 years in prison"
- `en/errores-fiscales-freelancers-espanoles.ts:51` — "$10,000 fine and 2 years in prison"
- `en/problemas-comunes-llc-como-evitarlos.ts:36` — "$10,000 fine and 2 years imprisonment"
- `en/que-es-irs-guia-duenos-llc.ts:89` — "$250,000 + 5 years imprisonment | IRC §7206"
- `en/riesgos-fiscales-mala-estructuracion-internacional.ts:65` — "1-5 years prison and 100%-600% fine"
- `en/testaferros-prestanombres-llc-ilegal-riesgos.ts:26` — "$10,000 fine and 2 years in prison"

Los headings "¿Debo tener miedo del IRS?" / "Should I be afraid of the IRS?" / equivalentes FR/DE/PT/CA en `que-es-irs-guia-duenos-llc.ts` se mantienen porque su contenido **desmonta** el miedo ("No. Rotundamente no. El IRS no es un monstruo, es una burocracia…"). Son secciones pedagógicas anti-fear, no fear-mongering. El guard tampoco las marca: "miedo/peur/Angst/medo" no son palabras del scope (`susto`, `pánico`, `cárcel`, `te van a pillar`).

## Validación

```
npm exec node scripts/blog-content-lint.mjs   → OK, 478 archivos, 0 hallazgos
npm exec node scripts/blog-content-lint.test.mjs → OK, 38/38 fixtures
```
