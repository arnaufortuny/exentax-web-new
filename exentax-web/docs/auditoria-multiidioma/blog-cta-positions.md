# Blog CTA position audit (Task #52)

Generated: 2026-04-28T21:56:18.383Z

Total files audited: 672

Files with at least one violation: 3

Total violations: 3


## Per language

| Lang | Files | Violations | calc-cta avg %pos | cta avg %pos |
|------|------:|-----------:|------------------:|-------------:|
| es | 112 | 0 | 51.5 | 99 |
| en | 112 | 0 | 51.4 | 97.4 |
| fr | 112 | 0 | 51.2 | 97.3 |
| de | 112 | 2 | 49.8 | 97.7 |
| pt | 112 | 0 | 51.4 | 97.5 |
| ca | 112 | 1 | 50.9 | 97.5 |

## Violations by category

| Category | Count |
|----------|------:|
| too_early | 3 |

## Worst 20 files

- `de/cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` — 1 violations: calc_cta:too_early
- `de/recuperar-llc-boi-5472-atrasados-procedimiento` — 1 violations: calc_cta:too_early
- `ca/cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` — 1 violations: calc_cta:too_early

## Whitelist rationale (POSITIONAL_ALLOWLIST)

The slugs below are accepted by the CI guard with the
`calc_cta:too_early` / `calc_cta:too_late` codes. The mid-CTA
lands earlier than the editorial 30–85 % target window because
of the article's high-value protected blocks (`exentax:execution-v2`,
`exentax:cross-refs-v1`, `exentax:cta-conv-v1`, etc.) — there is
no safe insertion candidate inside the 30–85 % window without
breaking a semantic block. Restructuring is editorial work
tracked separately (see `docs/audits/2026-04/blog-editorial-pass.md`).

- `boi-report-fincen-guia-completa-2026` — protected mid-section blocks force calc-cta < 30 %.
- `evitar-bloqueos-mercury-wise-revolut` — protected mid-section blocks force calc-cta < 30 %.
- `pasarelas-pago-llc-stripe-paypal-dodo` — protected mid-section blocks force calc-cta < 30 %.
- `recuperar-llc-boi-5472-atrasados-procedimiento` — protected mid-section blocks force calc-cta < 30 %.
- `cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` — protected mid-section blocks force calc-cta < 30 %.
- `justificar-origen-fondos-kyc-bancario-segunda-ronda` — protected mid-section blocks force calc-cta < 30 %.
