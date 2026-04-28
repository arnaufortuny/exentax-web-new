# Rendered link crawler

_Base: `http://localhost:5000` · seeds: 36 (6 surfaces × 6 locales) · rendered anchors: 2654 · unique internal hrefs: 177_

Canonical wa.me number: `34614916910`

Rendered wa.me numbers: `34614916910`×303

## Per-surface coverage

| Surface | Anchors | Internal | WhatsApp | External | Mailto |
|---|---:|---:|---:|---:|---:|
| home | 466 | 309 | 70 | 75 | 6 |
| services | 423 | 317 | 59 | 35 | 6 |
| faq | 505 | 389 | 74 | 30 | 6 |
| book | 300 | 228 | 30 | 30 | 6 |
| blog_index | 336 | 264 | 30 | 30 | 6 |
| blog_post | 624 | 334 | 50 | 92 | 6 |

**Findings:** broken=0

Every rendered internal link resolves to a 200, points at the correct locale, and every rendered wa.me anchor uses the canonical number. ✅
