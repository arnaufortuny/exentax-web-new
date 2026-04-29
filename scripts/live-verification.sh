#!/usr/bin/env bash
# live-verification.sh — Runs PRODUCTION-CHECKLIST.md §F-1 a §F-9 against any base URL.
#
# Usage:
#   bash scripts/live-verification.sh [BASE_URL] \
#        [--metrics-token TOKEN] [--indexnow-key KEY] \
#        [--report PATH] [--only KEY[,KEY...]]
#
# Defaults:
#   BASE_URL = https://exentax.com
#
# Exit codes:
#   0  — all automatable checks PASS
#   1  — at least one check FAIL
#   2  — usage error (incluye `--only` con clave desconocida — Task #65)
#
# --only KEY[,KEY...]
#   Run only the listed check keys. Útil para tener un segundo cron
#   "HTTP-only / sin backend" (Task #60) que vigile cabeceras de
#   seguridad y SEO incluso mientras el VPS aún sirve el mirror
#   estático y `/api/health` devuelve 404.
#
#   La lista canónica de claves vive en el array bash LEGAL_KEYS más
#   abajo, junto con LEGAL_KEY_DESCRIPTIONS. Tanto `--help` como el
#   validador de `--only` consumen ese array, así que no pueden
#   divergir (Task #65). Hasta Task #65 una clave mal escrita como
#   `--only F1-header` (sin la `s` final) o `--only F22` producía un
#   reporte vacío `PASS=0 FAIL=0 SKIP=0 TOTAL=0` con exit 0, y los
#   crons de monitorización lo reportaban como todo en verde sin haber
#   chequeado nada. Ahora una clave desconocida aborta con exit 2 y un
#   mensaje que enumera las claves válidas.
#
#   Prefix-match: `--only F2` activa todas las F2-*, `--only F1-headers,F2`
#   activa el subset SEO+headers que pide Task #60 sin tocar /api/health.
#   Una clave es válida si encaja exactamente con una entrada de
#   LEGAL_KEYS o si alguna entrada de LEGAL_KEYS empieza por `${KEY}-`.
#
# Notes:
#   * F-4 (DB-backed E2E specs), F-5 (Discord runtime), F-6 (Calendar/Meet/Email),
#     F-7 UptimeRobot side, F-8 visual responsive, and F-9 Lighthouse are NOT
#     fully scriptable via curl alone. The runner emits SKIP markers with the
#     exact follow-up command the operator has to execute on the VPS or laptop.
#   * Designed to be safe to run from any environment (laptop, CI, the VPS itself).
#     Read-only: no POST that mutates state beyond CSRF probing with empty bodies.

set -uo pipefail

# ─── Single source of truth for `--only` validation y `--help` ──────────
# Si añades un nuevo `should_run` abajo, añade aquí su KEY (y, en el
# mismo índice, su descripción en LEGAL_KEY_DESCRIPTIONS) — si no, el
# filtro y la ayuda divergirán. Bash 3 no tiene assoc arrays portables,
# así que mantenemos dos arrays paralelos indexados por el mismo orden.
LEGAL_KEYS=(
  F1-health
  F1-headers
  F2-sitemap
  F2-sitemap-blog
  F2-robots
  F2-indexnow
  F2-hreflang
  F3-csrf
  F3-rate-limit
  F3-encryption
  F4
  F5
  F6
  F7-metrics
  F7-uptimerobot
  F8-lang
  F8-responsive
  F8-calculator
  F9
)
LEGAL_KEY_DESCRIPTIONS=(
  "GET /api/health + /api/health/ready"
  "HSTS / CSP / XFO / Referrer-Policy / no unsafe-eval"
  "/sitemap.xml debe ser <sitemapindex>"
  "/sitemap-blog.xml >=600 <loc> entries"
  "/robots.txt declara sitemaps + bloquea /api,/admin"
  "/<INDEXNOW_KEY>.txt devuelve la key (si --indexnow-key set)"
  "3 alternates de la home -> 200"
  "POST sin Origin -> 403"
  "220 GETs /api/health -> algun 429"
  "SKIP (manual psql, requiere DB read access)"
  "SKIP bloque (DB E2E, requiere VPS shell)"
  "SKIP bloque (Discord runtime, manual)"
  "SKIP bloque (Calendar / Meet / Email transaccional, manual)"
  "/api/metrics?token=... en formato Prometheus"
  "SKIP (dashboard externo UptimeRobot)"
  "/es /en /fr /de /pt /ca -> 200"
  "SKIP (responsive manual DevTools)"
  "SKIP (calculadora submit con email real)"
  "SKIP (Lighthouse autorun manual)"
)

print_legal_keys() {
  local i
  echo ""
  echo "Claves --only soportadas (orden de aparición):"
  for i in "${!LEGAL_KEYS[@]}"; do
    printf "  %-18s %s\n" "${LEGAL_KEYS[$i]}" "${LEGAL_KEY_DESCRIPTIONS[$i]:-}"
  done
}

# is_legal_only_key TOKEN → 0 si TOKEN matchea exactamente o por prefijo
# alguna entrada de LEGAL_KEYS, 1 si no. Mantiene la misma semántica
# prefix-match que `should_run` (Task #60).
is_legal_only_key() {
  local token="$1"
  local k
  for k in "${LEGAL_KEYS[@]}"; do
    [[ "$k" == "$token" ]] && return 0
    [[ "$k" == "$token"-* ]] && return 0
  done
  return 1
}

BASE_URL="${1:-}"
if [[ -z "${BASE_URL}" || "${BASE_URL}" == --* ]]; then
  BASE_URL="https://exentax.com"
else
  shift
fi
BASE_URL="${BASE_URL%/}"

METRICS_TOKEN=""
INDEXNOW_KEY="${INDEXNOW_KEY:-}"
REPORT_PATH=""
ONLY=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --metrics-token) METRICS_TOKEN="$2"; shift 2 ;;
    --indexnow-key)  INDEXNOW_KEY="$2";  shift 2 ;;
    --report)        REPORT_PATH="$2";   shift 2 ;;
    --only)          ONLY="$2";          shift 2 ;;
    -h|--help)
      # Imprime el bloque de cabecera (sin el shebang) hasta `set -uo
      # pipefail`, despoja el prefijo `# ` y luego añade la lista
      # auto-generada de LEGAL_KEYS. Así --help y el validador de
      # --only nunca pueden divergir (Task #65).
      awk '/^set -uo pipefail$/ {exit} NR>1' "$0" | sed 's/^# \{0,1\}//'
      print_legal_keys
      exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 2 ;;
  esac
done

# Validar `--only`: cada token debe encajar (exact o prefix) con
# LEGAL_KEYS. Sin esto, un typo (`--only F1-header` sin la `s` final, o
# `--only F22`) pasaba silenciosamente: el runner ejecutaba cero
# chequeos, escribía un reporte `PASS=0 FAIL=0 SKIP=0 TOTAL=0`, salía
# 0, y el carril de monitorización SEO+headers (Task #60) reportaba
# "todo verde" sin haber chequeado nada. Task #65: exit 2 con mensaje
# que enumera las claves válidas.
if [[ -n "${ONLY}" ]]; then
  IFS=',' read -r -a __ONLY_TOKENS <<< "${ONLY}"
  __unknown_only_keys=()
  for __raw in "${__ONLY_TOKENS[@]}"; do
    __token="${__raw// /}"
    [[ -z "$__token" ]] && continue
    if ! is_legal_only_key "$__token"; then
      __unknown_only_keys+=("$__token")
    fi
  done
  if (( ${#__unknown_only_keys[@]} > 0 )); then
    {
      printf 'Unknown --only key: %s (legal keys: %s)\n' \
        "${__unknown_only_keys[*]}" \
        "$(IFS=', '; echo "${LEGAL_KEYS[*]}")"
      echo "Run 'bash $0 --help' for the full list with descriptions."
    } >&2
    exit 2
  fi
  unset __ONLY_TOKENS __unknown_only_keys __raw __token
fi

# should_run KEY → 0 si KEY pasa el filtro `--only` (o si no hay filtro).
# Acepta match exacto o por prefijo: `--only F2` activa F2-sitemap,
# F2-robots, etc.
should_run() {
  local key="$1"
  [[ -z "$ONLY" ]] && return 0
  local IFS=','
  local t
  for t in $ONLY; do
    t="${t// /}"
    [[ -z "$t" ]] && continue
    [[ "$key" == "$t" ]] && return 0
    [[ "$key" == "$t"-* ]] && return 0
  done
  return 1
}

# maybe_section TITLE KEY [KEY ...] → emite la cabecera de sección sólo
# si al menos una de las keys está activa. Devuelve 0 en ese caso, 1 si
# se debe saltar la sección entera.
maybe_section() {
  local title="$1"; shift
  local k
  for k in "$@"; do
    if should_run "$k"; then
      section "$title"
      return 0
    fi
  done
  return 1
}

PASS=0; FAIL=0; SKIP=0
LINES=()

color() { local c="$1"; shift; printf "\033[%sm%s\033[0m" "$c" "$*"; }
green() { color "0;32" "$@"; }
red()   { color "0;31" "$@"; }
yellow(){ color "0;33" "$@"; }
bold()  { color "1"    "$@"; }

emit() {
  local status="$1"; local label="$2"; local detail="${3:-}"
  case "$status" in
    PASS) PASS=$((PASS+1)); printf "  %s %s\n" "$(green '[PASS]')" "$label" ;;
    FAIL) FAIL=$((FAIL+1)); printf "  %s %s\n" "$(red   '[FAIL]')" "$label" ;;
    SKIP) SKIP=$((SKIP+1)); printf "  %s %s\n" "$(yellow '[SKIP]')" "$label" ;;
  esac
  [[ -n "$detail" ]] && printf "         %s\n" "$detail"
  # Sanitize for markdown table: strip CR/LF, collapse whitespace, escape pipes, cap length
  local safe_detail
  safe_detail="$(printf '%s' "$detail" | tr '\r\n' '  ' | tr -s ' ' | sed 's/|/\\|/g')"
  if (( ${#safe_detail} > 220 )); then safe_detail="${safe_detail:0:217}..."; fi
  LINES+=("| ${status} | ${label} | ${safe_detail} |")
}

section() {
  printf "\n%s %s\n" "$(bold '==')" "$(bold "$1")"
  LINES+=("" "### $1" "" "| Status | Check | Detail |" "|---|---|---|")
}

http_status() { curl -sk -o /dev/null -w "%{http_code}" --max-time 12 "$@"; }
http_body()   { curl -sk --max-time 12 "$@"; }
http_head()   { curl -sIk --max-time 12 "$@"; }

printf "%s\n" "$(bold "Live verification against: ${BASE_URL}")"
printf "%s\n" "$(bold "Started: $(date -u '+%Y-%m-%dT%H:%M:%SZ')")"
if [[ -n "${ONLY}" ]]; then
  printf "%s\n" "$(bold "Only: ${ONLY}")"
fi

############################################################################
if maybe_section "F-1 · Health & connectivity" F1-health F1-headers; then
############################################################################

if should_run F1-health; then
  body="$(http_body "${BASE_URL}/api/health")"
  code="$(http_status "${BASE_URL}/api/health")"
  if [[ "$code" == "200" && "$body" == *'"status":"ok"'* ]]; then
    emit PASS "GET /api/health → 200 with status:ok" "$(printf '%s' "$body" | head -c 120)"
  else
    emit FAIL "GET /api/health" "HTTP ${code} — body: $(printf '%s' "$body" | head -c 160)"
  fi

  body="$(http_body "${BASE_URL}/api/health/ready")"
  code="$(http_status "${BASE_URL}/api/health/ready")"
  if [[ "$code" == "200" && "$body" == *'"ready":true'* ]]; then
    emit PASS "GET /api/health/ready → 200 ready:true" "$(printf '%s' "$body" | head -c 200)"
  else
    emit FAIL "GET /api/health/ready" "HTTP ${code} — body: $(printf '%s' "$body" | head -c 200)"
  fi
fi

if should_run F1-headers; then
  headers="$(http_head "${BASE_URL}/")"
  have_hsts="$(printf '%s' "$headers"   | grep -ci 'strict-transport-security')"
  have_csp="$(printf '%s' "$headers"    | grep -ci 'content-security-policy')"
  have_xfo="$(printf '%s' "$headers"    | grep -ci 'x-frame-options')"
  have_ref="$(printf '%s' "$headers"    | grep -ci 'referrer-policy')"
  unsafe_eval="$(printf '%s' "$headers" | grep -ci "unsafe-eval")"
  hdr_detail="HSTS=${have_hsts} CSP=${have_csp} XFO=${have_xfo} REF=${have_ref} UNSAFE_EVAL=${unsafe_eval}"
  if (( have_hsts >= 1 && have_csp >= 1 && have_xfo >= 1 && have_ref >= 1 && unsafe_eval == 0 )); then
    emit PASS "Security headers on /" "$hdr_detail"
  else
    emit FAIL "Security headers on /" "$hdr_detail (need HSTS+CSP+XFO+ReferrerPolicy, no unsafe-eval)"
  fi
fi

fi  # end F-1

############################################################################
if maybe_section "F-2 · SEO (sitemap · robots · IndexNow · hreflang)" \
     F2-sitemap F2-sitemap-blog F2-robots F2-indexnow F2-hreflang; then
############################################################################

if should_run F2-sitemap; then
  sitemap="$(http_body "${BASE_URL}/sitemap.xml")"
  sitemap_code="$(http_status "${BASE_URL}/sitemap.xml")"
  if [[ "$sitemap_code" == "200" && "$sitemap" == *'<sitemapindex'*'</sitemapindex>'* ]]; then
    emit PASS "GET /sitemap.xml → sitemap-index XML"
  elif [[ "$sitemap_code" == "200" && "$sitemap" == *'<urlset'* ]]; then
    emit FAIL "GET /sitemap.xml" "Got urlset instead of sitemapindex referencing pages/blog/faq"
  else
    emit FAIL "GET /sitemap.xml" "HTTP ${sitemap_code} — body bytes: ${#sitemap}"
  fi
fi

if should_run F2-sitemap-blog; then
  blog_sitemap="$(http_body "${BASE_URL}/sitemap-blog.xml")"
  blog_count="$(printf '%s' "$blog_sitemap" | grep -c '<loc>')"
  if (( blog_count >= 600 )); then
    emit PASS "GET /sitemap-blog.xml" "${blog_count} <loc> entries (≥600 expected, target ≈672)"
  else
    emit FAIL "GET /sitemap-blog.xml" "${blog_count} <loc> entries — expected ≈672 (112 slugs × 6 idiomas)"
  fi
fi

if should_run F2-robots; then
  robots="$(http_body "${BASE_URL}/robots.txt")"
  robots_ok=1
  for needle in 'sitemap-pages.xml' 'sitemap-blog.xml' 'Disallow: /api/' 'Disallow: /admin/' 'GPTBot'; do
    printf '%s' "$robots" | grep -qi "${needle}" || { robots_ok=0; break; }
  done
  if (( robots_ok == 1 )); then
    emit PASS "GET /robots.txt declares sitemaps + blocks /api/admin + allows GPTBot"
  else
    emit FAIL "GET /robots.txt" "missing one of: sitemap-pages, sitemap-blog, Disallow /api, Disallow /admin, GPTBot"
  fi
fi

if should_run F2-indexnow; then
  if [[ -n "${INDEXNOW_KEY}" ]]; then
    body="$(http_body "${BASE_URL}/${INDEXNOW_KEY}.txt")"
    if [[ "$body" == "${INDEXNOW_KEY}" ]]; then
      emit PASS "GET /${INDEXNOW_KEY}.txt returns the IndexNow key"
    else
      emit FAIL "GET /${INDEXNOW_KEY}.txt" "Body did not equal the key (got ${#body} bytes)"
    fi
  else
    emit SKIP "IndexNow key file" "Set --indexnow-key <key> or env INDEXNOW_KEY to test"
  fi
fi

if should_run F2-hreflang; then
  # Probe 3 hreflang URLs from homepage HTML
  home="$(http_body "${BASE_URL}/")"
  mapfile -t hreflang_urls < <(printf '%s' "$home" | grep -oE 'rel="alternate"[^>]*hreflang="[^"]+"[^>]*href="[^"]+"' | grep -oE 'href="[^"]+"' | sed 's/href="//;s/"$//' | head -3)
  if (( ${#hreflang_urls[@]} >= 3 )); then
    hreflang_ok=1
    for url in "${hreflang_urls[@]}"; do
      c="$(http_status "$url")"
      [[ "$c" == "200" ]] || { hreflang_ok=0; emit FAIL "hreflang ${url}" "HTTP ${c}"; break; }
    done
    (( hreflang_ok == 1 )) && emit PASS "3 random hreflang alternates → 200" "${hreflang_urls[*]}"
  else
    emit FAIL "hreflang discovery on /" "Found ${#hreflang_urls[@]} alternates (expected ≥3) — check SSR head"
  fi
fi

fi  # end F-2

############################################################################
if maybe_section "F-3 · Security (CSRF · rate-limit · field encryption)" \
     F3-csrf F3-rate-limit F3-encryption; then
############################################################################

if should_run F3-csrf; then
  # CSRF: POST without Origin/Referer must 403
  code="$(curl -sk -o /dev/null -w "%{http_code}" --max-time 12 -X POST \
    "${BASE_URL}/api/calculator-leads" -H "Content-Type: application/json" -d '{}')"
  if [[ "$code" == "403" ]]; then
    emit PASS "POST /api/calculator-leads sin Origin → 403 (CSRF activo)"
  else
    emit FAIL "POST /api/calculator-leads sin Origin" "Esperado 403, obtenido ${code}"
  fi
fi

if should_run F3-rate-limit; then
  # Rate-limit: 250 GETs in fast loop. Run 220 to /api/health then count 429s.
  codes_seen=""
  last429=""
  for i in $(seq 1 220); do
    c="$(curl -sk -o /dev/null -w "%{http_code}" --max-time 4 "${BASE_URL}/api/health" 2>/dev/null || echo 000)"
    if [[ "$c" == "429" ]]; then last429=1; fi
  done
  if [[ "${last429}" == "1" ]]; then
    emit PASS "220 GETs to /api/health hit 429 (rate-limit ≤200/min activo)"
  else
    emit FAIL "Rate-limit on /api/health" "Sent 220 reqs, never saw 429 — global rate-limit may be off"
  fi
fi

if should_run F3-encryption; then
  emit SKIP "Field encryption AES-256-GCM (phone con prefijo ef:)" \
    "Requires DB read access. From VPS: psql \"\$DATABASE_URL\" -c \"SELECT phone FROM leads ORDER BY id DESC LIMIT 1;\" → debe empezar con ef:"
fi

fi  # end F-3

############################################################################
if maybe_section "F-4 · E2E con DB real" F4; then
############################################################################

emit SKIP "test:booking" "From VPS: cd exentax-web && npm run test:booking"
emit SKIP "test:newsletter" "From VPS: cd exentax-web && npm run test:newsletter"
emit SKIP "test:calculator" "From VPS: cd exentax-web && npm run test:calculator (116/116)"
emit SKIP "test:indexnow"  "From VPS: cd exentax-web && npm run test:indexnow"

fi  # end F-4

############################################################################
if maybe_section "F-5 · Discord (bot online + 5 canales)" F5; then
############################################################################

emit SKIP "Bot online green dot"           "Manual: ver Discord server → indicador del bot exentax verde"
emit SKIP "/ayuda · /agenda · /cita"        "Manual: ejecutar slash-commands en Discord con un usuario admin"
emit SKIP "Embeds en 5 canales"             "Disparar reserva de prueba; verificar #exentax-agenda, #exentax-auditoria, #exentax-registros, #exentax-consentimientos, #exentax-errores"

fi  # end F-5

############################################################################
if maybe_section "F-6 · Calendar / Meet / Email" F6; then
############################################################################

emit SKIP "Booking → Google Calendar event con Meet" "Manual: reservar en /es/agendar con email real → ver evento en Google Calendar (calendar id de SA) con link Meet auto-generado"
emit SKIP "Email transaccional con SPF/DKIM/DMARC pass" "Manual: revisar email recibido → headers Authentication-Results: spf=pass dkim=pass dmarc=pass"

fi  # end F-6

############################################################################
if maybe_section "F-7 · Observabilidad (Prometheus + UptimeRobot)" F7-metrics F7-uptimerobot; then
############################################################################

if should_run F7-metrics; then
  if [[ -n "${METRICS_TOKEN}" ]]; then
    body="$(http_body "${BASE_URL}/api/metrics?token=${METRICS_TOKEN}")"
    code="$(http_status "${BASE_URL}/api/metrics?token=${METRICS_TOKEN}")"
    if [[ "$code" == "200" && "$body" == *"# HELP"*"http_request"* ]]; then
      emit PASS "GET /api/metrics → Prometheus format con http_request_*"
    else
      emit FAIL "GET /api/metrics" "HTTP ${code} — body bytes: ${#body}"
    fi
  else
    emit SKIP "/api/metrics?token=…" "Set --metrics-token \$METRICS_TOKEN to verify Prometheus export"
  fi
fi

if should_run F7-uptimerobot; then
  emit SKIP "UptimeRobot monitor UP en últimos 5 min" "Manual: verificar dashboard https://uptimerobot.com — monitor exentax.com/api/health en verde"
fi

fi  # end F-7

############################################################################
if maybe_section "F-8 · Frontend smoke (6 idiomas)" F8-lang F8-responsive F8-calculator; then
############################################################################

if should_run F8-lang; then
  langs=(es en fr de pt ca)
  front_ok=1
  front_detail=""
  for lang in "${langs[@]}"; do
    c="$(http_status "${BASE_URL}/${lang}")"
    if [[ "$c" != "200" ]]; then
      front_ok=0
      front_detail+="/${lang}=${c} "
    fi
  done
  if (( front_ok == 1 )); then
    emit PASS "GET /es /en /fr /de /pt /ca → todos 200"
  else
    emit FAIL "Frontend lang routes" "Failed: ${front_detail}"
  fi
fi

if should_run F8-responsive; then
  emit SKIP "Mobile (375px) + tablet (768px) + desktop (1280px) responsive" \
    "Manual: DevTools / Lighthouse mobile · verificar menú hamburguesa · sin shift de scroll en cambiador de idioma"
fi

if should_run F8-calculator; then
  emit SKIP "Calculadora submit → embed Discord en #exentax-calculadora" \
    "Manual: completar /es/calculadora con email real desde origen exentax.com"
fi

fi  # end F-8

############################################################################
if maybe_section "F-9 · Lighthouse final (Performance ≥0.85 · LCP <2.5s · CLS <0.1)" F9; then
############################################################################

emit SKIP "Lighthouse / · /llc · /itin × 6 idiomas" \
  "Manual: npx -p @lhci/cli@0.13.x lhci autorun --collect.url=${BASE_URL}/es --collect.url=${BASE_URL}/es/llc --collect.url=${BASE_URL}/es/itin (repetir 6 idiomas)"

fi  # end F-9

############################################################################
# Summary
############################################################################
TOTAL=$((PASS + FAIL + SKIP))
printf "\n%s\n" "$(bold "Summary against ${BASE_URL}")"
printf "  %s · %s · %s · TOTAL %d\n" \
  "$(green "PASS=${PASS}")" "$(red "FAIL=${FAIL}")" "$(yellow "SKIP=${SKIP}")" "$TOTAL"

if [[ -n "${REPORT_PATH}" ]]; then
  {
    echo "# live-verification report"
    echo ""
    echo "- **Base URL**: \`${BASE_URL}\`"
    echo "- **Generated (UTC)**: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    echo "- **Result**: PASS=${PASS} · FAIL=${FAIL} · SKIP=${SKIP} · TOTAL=${TOTAL}"
    echo ""
    for line in "${LINES[@]}"; do echo "$line"; done
    echo ""
    echo "## Notes"
    echo ""
    echo "* SKIP entries are checks that cannot be performed via plain HTTP — they require"
    echo "  shell access to the VPS, DB credentials, Google/Discord runtime, or interactive"
    echo "  Lighthouse runs. The exact follow-up command/manual step is in the Detail column."
    echo "* If FAIL=0 and the SKIP follow-ups are executed and pass, treat F-1..F-9 as green."
  } > "$REPORT_PATH"
  printf "Report written to %s\n" "$REPORT_PATH"
fi

if (( FAIL > 0 )); then exit 1; fi
exit 0
