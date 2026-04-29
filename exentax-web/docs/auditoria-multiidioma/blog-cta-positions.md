# Blog CTA position audit (Task #52)

Generated: 2026-04-29T15:56:20.495Z

Total files audited: 672

Files with at least one violation: 2

Total violations: 2


## Per language

| Lang | Files | Violations | calc-cta avg %pos | cta avg %pos |
|------|------:|-----------:|------------------:|-------------:|
| es | 112 | 0 | 51.9 | 99.1 |
| en | 112 | 0 | 52.2 | 97.5 |
| fr | 112 | 0 | 51.9 | 97.3 |
| de | 112 | 2 | 50.2 | 97.8 |
| pt | 112 | 0 | 51.7 | 97.5 |
| ca | 112 | 0 | 51.3 | 97.6 |

## Violations by category

| Category | Count |
|----------|------:|
| too_early | 2 |

## Worst 20 files

- `de/cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` — 1 violations: calc_cta:too_early
- `de/recuperar-llc-boi-5472-atrasados-procedimiento` — 1 violations: calc_cta:too_early

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
