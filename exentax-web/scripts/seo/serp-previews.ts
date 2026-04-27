#!/usr/bin/env tsx
/**
 * SERP preview generator for the 18 indexable pages × 6 locales.
 *
 * Renders a self-contained HTML mock and a Markdown gallery showing how each
 * page would look in Google's desktop and mobile search results, given the
 * meta titles and descriptions currently shipped in i18n + page modules.
 *
 * Outputs:
 *   reports/seo/serp-previews/serp-previews.html
 *   reports/seo/serp-previews/serp-previews.md
 *   reports/seo/serp-previews/serp-previews.json (raw data + flagged issues)
 *
 * Sources:
 *   - 12 static pages from client/src/i18n/locales/{lang}.ts (all seoTitle
 *     entries minus the 2 noindex namespaces linksPage + startPage).
 *   - 1 pillar page from client/src/pages/abrir-llc.tsx (PILLAR_CONTENT map).
 *   - 5 service subpages from client/src/i18n/data/subpages.ts.
 *
 * 12 + 1 + 5 = 18 indexable pages × 6 locales = 108 SERP cards.
 *
 * Run with: npx tsx scripts/seo/serp-previews.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO = resolve(__dirname, "..", "..");
const I18N_LOC = join(REPO, "client/src/i18n/locales");
const SUBPAGES_FILE = join(REPO, "client/src/i18n/data/subpages.ts");
const PILLAR_FILE = join(REPO, "client/src/pages/abrir-llc.tsx");
const OUT_DIR = join(REPO, "reports", "seo", "serp-previews");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"] as const;
type Lang = (typeof LANGS)[number];

const LANG_LABEL: Record<Lang, string> = {
  es: "Español (es-ES)",
  en: "English (en-US)",
  fr: "Français (fr-FR)",
  de: "Deutsch (de-DE)",
  pt: "Português (pt-PT)",
  ca: "Català (ca-ES)",
};

// Pixel budgets used by Google's desktop and mobile SERP cards (Moz/Ahrefs
// canonical values). The HTML mock applies these as CSS max-widths so the
// visual gallery truncates exactly the way Google would, even though the
// numerical analysis below uses character budgets to avoid false positives
// from per-character width estimation.
const DESKTOP_TITLE_PX = 580;
const DESKTOP_DESC_PX = 990;
const MOBILE_TITLE_PX = 506;
const MOBILE_DESC_PX = 700;

// Character budgets — kept aligned with scripts/seo/verify-meta.ts so any
// page that already passes the meta-length gate also passes this report.
//   Desktop title cap: 60 chars (verify-meta TITLE_MAX).
//   Mobile title wrap: ~78 chars wraps to a second line; not an error,
//   only worth surfacing as an informational note.
//   Desktop description cap: 165 chars (verify-meta DESC_MAX / subpage 165).
//   Mobile description: ~130 chars typically fits in 3 lines; anything past
//   that may have its tail (often the CTA) truncated on phones.
const TITLE_DESKTOP_MAX = 60;
const TITLE_MOBILE_WRAP = 78;
const DESC_DESKTOP_MAX = 165;
const DESC_MOBILE_TAIL = 130;

// Per-character pixel widths used only for the *display* labels in the HTML
// gallery (e.g. "461 px"). They are advisory and not used for any pass/fail
// gate. Values are calibrated against Google's Arial 20 / 14 px rendering.
const CHAR_WIDTH_TITLE: Record<string, number> = {
  default: 9.6,
  i: 4.0, l: 4.0, "!": 4.0, ".": 4.0, ",": 4.0, ":": 4.0, ";": 4.0, "'": 4.0,
  I: 5.0, "·": 5.0,
  f: 5.2, t: 5.2, r: 5.6, j: 4.4,
  " ": 4.5,
  m: 14.8, w: 12.6, M: 12.6, W: 13.6,
};
const CHAR_WIDTH_DESC: Record<string, number> = {
  default: 6.3,
  i: 2.8, l: 2.8, "!": 2.8, ".": 2.8, ",": 2.8, ":": 2.8, ";": 2.8, "'": 2.8,
  I: 3.4, "·": 3.6,
  f: 3.6, t: 3.6, r: 3.8, j: 3.0,
  " ": 3.2,
  m: 9.8, w: 8.6, M: 8.4, W: 9.0,
};

function pixelWidth(text: string, table: Record<string, number>): number {
  let w = 0;
  for (const ch of text) w += table[ch] ?? table.default;
  return Math.round(w);
}

// Soft-CTA endings per language (mirrors scripts/seo/verify-meta.ts so the
// CTA-wrap check below stays in sync with the meta verifier).
const SUBPAGE_CTA_ENDINGS: Record<Lang, string[]> = {
  es: ["reserva tu llamada", "reserva una llamada", "habla con un experto", "habla con nosotros", "empieza hoy", "agenda una llamada", "agenda tu llamada", "solicita info", "pide tu presupuesto", "consulta gratis"],
  en: ["book a free call", "book a call", "book a free consultation", "book a consultation", "talk to an expert", "talk to an expert today", "start today", "get started", "schedule a call"],
  ca: ["reserva la teva trucada", "reserva una trucada", "parla amb un expert", "comença avui", "agenda una trucada", "demana pressupost"],
  fr: ["réservez un appel", "réservez votre appel", "parlez à un expert", "commencez maintenant", "commencez aujourd'hui", "à discuter", "prenez rendez-vous", "démarrez ici", "commencez ici"],
  de: ["jetzt anfragen", "jetzt starten", "termin sichern", "jetzt buchen", "jetzt los", "termin vereinbaren", "gespräch vereinbaren", "kostenlos beraten lassen", "sprechen sie mit einem experten", "sprechen sie uns an"],
  pt: ["agende sua chamada", "agende uma chamada", "agende sua chamada hoje", "fale com um especialista", "fale com especialista", "comece hoje", "comece hoje mesmo", "solicite orçamento"],
};

function findCtaTail(lang: Lang, desc: string): { cta: string; startIdx: number } | null {
  const haystack = desc.toLowerCase().replace(/\s+/g, " ").trim();
  // Prefer the longest matching CTA so multi-word phrases beat their suffixes.
  const sorted = [...SUBPAGE_CTA_ENDINGS[lang]].sort((a, b) => b.length - a.length);
  for (const cta of sorted) {
    const stripped = haystack.replace(/[.!]+$/, "");
    if (stripped.endsWith(cta)) {
      const startIdx = stripped.length - cta.length;
      return { cta, startIdx };
    }
  }
  return null;
}

const URL_BASE = "https://exentax.com";

type Page = {
  scope: "static" | "pillar" | "subpage";
  key: string;
  routePath: string; // e.g. "/es/servicios/llc-wyoming"
  lang: Lang;
  title: string;
  description: string;
};

// ---------------- extraction helpers ----------------

const NS_TO_ROUTE: Record<string, { key: string; slug: Record<Lang, string> }> = {
  homePage: { key: "home", slug: { es: "", en: "", fr: "", de: "", pt: "", ca: "" } },
  serviciosPage: { key: "our_services", slug: { es: "servicios", en: "services", fr: "services", de: "leistungen", pt: "servicos", ca: "serveis" } },
  reservarPage: { key: "book", slug: { es: "agendar", en: "book", fr: "reserver", de: "buchen", pt: "agendar", ca: "agendar" } },
  comoFuncionaPage: { key: "how_we_work", slug: { es: "como-trabajamos", en: "how-we-work", fr: "comment-nous-travaillons", de: "wie-wir-arbeiten", pt: "como-trabalhamos", ca: "com-treballem" } },
  llcUsPage: { key: "about_llc", slug: { es: "sobre-las-llc", en: "about-llc", fr: "a-propos-des-llc", de: "uber-llc", pt: "sobre-llc", ca: "sobre-les-llc" } },
  faqPage: { key: "faq", slug: { es: "preguntas-frecuentes", en: "faq", fr: "questions-frequentes", de: "haufige-fragen", pt: "perguntas-frequentes", ca: "preguntes-frequents" } },
  blogPost: { key: "blog_index", slug: { es: "blog", en: "blog", fr: "blog", de: "blog", pt: "blog", ca: "blog" } },
  terminos: { key: "legal_terms", slug: { es: "legal/terminos", en: "legal/terms", fr: "legal/conditions", de: "legal/agb", pt: "legal/termos", ca: "legal/termes" } },
  privacidad: { key: "legal_privacy", slug: { es: "legal/privacidad", en: "legal/privacy", fr: "legal/confidentialite", de: "legal/datenschutz", pt: "legal/privacidade", ca: "legal/privacitat" } },
  cookies: { key: "legal_cookies", slug: { es: "legal/cookies", en: "legal/cookies", fr: "legal/cookies", de: "legal/cookies", pt: "legal/cookies", ca: "legal/cookies" } },
  reembolsos: { key: "legal_refunds", slug: { es: "legal/reembolsos", en: "legal/refunds", fr: "legal/remboursements", de: "legal/erstattungen", pt: "legal/reembolsos", ca: "legal/reemborsaments" } },
  disclaimer: { key: "legal_disclaimer", slug: { es: "legal/disclaimer", en: "legal/disclaimer", fr: "legal/avertissement", de: "legal/haftungsausschluss", pt: "legal/aviso-legal", ca: "legal/avis-legal" } },
};

// Service-subpage slugs keyed by subpage key (matches ROUTE_SLUGS in shared/routes.ts).
const SUBPAGE_SLUGS: Record<string, Record<Lang, string>> = {
  llcNm: { es: "servicios/llc-nuevo-mexico", en: "services/llc-new-mexico", fr: "services/llc-nouveau-mexique", de: "leistungen/llc-new-mexico", pt: "servicos/llc-novo-mexico", ca: "serveis/llc-nou-mexic" },
  llcWy: { es: "servicios/llc-wyoming", en: "services/llc-wyoming", fr: "services/llc-wyoming", de: "leistungen/llc-wyoming", pt: "servicos/llc-wyoming", ca: "serveis/llc-wyoming" },
  llcDe: { es: "servicios/llc-delaware", en: "services/llc-delaware", fr: "services/llc-delaware", de: "leistungen/llc-delaware", pt: "servicos/llc-delaware", ca: "serveis/llc-delaware" },
  llcFl: { es: "servicios/llc-florida", en: "services/llc-florida", fr: "services/llc-floride", de: "leistungen/llc-florida", pt: "servicos/llc-florida", ca: "serveis/llc-florida" },
  itin: { es: "servicios/obten-tu-itin", en: "services/get-your-itin", fr: "services/obtiens-ton-itin", de: "leistungen/hol-deine-itin", pt: "servicos/obtenha-seu-itin", ca: "serveis/obte-el-teu-itin" },
};

// Pillar page slug per language (matches ROUTE_SLUGS pillar_open_llc).
const PILLAR_SLUG: Record<Lang, string> = {
  es: "abrir-llc-estados-unidos",
  en: "open-llc-usa",
  fr: "ouvrir-llc-etats-unis",
  de: "llc-usa-eroeffnen",
  pt: "abrir-llc-eua",
  ca: "obrir-llc-eua",
};

function buildRoutePath(lang: Lang, slug: string): string {
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}

function extractStatic(lang: Lang): Page[] {
  const src = readFileSync(join(I18N_LOC, `${lang}.ts`), "utf8");
  const lines = src.split("\n");
  const out: Page[] = [];
  for (let i = 0; i < lines.length; i++) {
    const mt = lines[i].match(/seoTitle\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (!mt) continue;
    let desc = "";
    for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
      const md = lines[j].match(/(?:seoDesc|seoDescription)\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (md) { desc = md[1]; break; }
    }
    // walk back tracking brace balance to find immediate parent namespace
    let ns = "?";
    let depth = 0;
    for (let k = i - 1; k >= 0; k--) {
      const closes = (lines[k].match(/\}/g) || []).length;
      const opens = (lines[k].match(/\{/g) || []).length;
      depth += closes - opens;
      if (depth < 0) {
        const m = lines[k].match(/^\s*([a-zA-Z][a-zA-Z0-9_]*)\s*:\s*\{/);
        if (m) { ns = m[1]; break; }
        depth = 0;
      }
    }
    const map = NS_TO_ROUTE[ns];
    if (!map) continue; // skips linksPage, startPage and any non-route ns
    out.push({
      scope: "static",
      key: map.key,
      routePath: buildRoutePath(lang, map.slug[lang]),
      lang,
      title: mt[1],
      description: desc,
    });
  }
  return out;
}

function extractSubpages(): Page[] {
  const src = readFileSync(SUBPAGES_FILE, "utf8");
  const lines = src.split("\n");
  const langStarts: { lang: Lang; start: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^const\s+(es|en|fr|de|pt|ca)\s*:\s*SubpagesBase\s*=\s*\{/);
    if (m) langStarts.push({ lang: m[1] as Lang, start: i });
  }
  const out: Page[] = [];
  const subKeys = ["llcNm", "llcWy", "llcDe", "llcFl", "itin"];
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*seo:\s*\{\s*$/.test(lines[i])) continue;
    const tMatch = lines[i + 1]?.match(/title:\s*"((?:[^"\\]|\\.)*)"/);
    const dMatch = lines[i + 2]?.match(/description:\s*"((?:[^"\\]|\\.)*)"/);
    if (!tMatch || !dMatch) continue;
    let lang: Lang | null = null;
    for (const ls of langStarts) if (i >= ls.start) lang = ls.lang;
    if (!lang) continue;
    let page: string | null = null;
    for (let k = i - 1; k > 0; k--) {
      const pm = lines[k].match(/^\s{2}([a-zA-Z]+):\s*\{/);
      if (pm && subKeys.includes(pm[1])) { page = pm[1]; break; }
    }
    if (!page) continue;
    out.push({
      scope: "subpage",
      key: `service_${page}`,
      routePath: buildRoutePath(lang, SUBPAGE_SLUGS[page][lang]),
      lang,
      title: tMatch[1],
      description: dMatch[1],
    });
  }
  return out;
}

function extractPillar(): Page[] {
  const src = readFileSync(PILLAR_FILE, "utf8");
  const langRe = /(es|en|fr|de|pt|ca):\s*\{\s*\n\s*metaTitle:\s*"((?:[^"\\]|\\.)*)",\s*\n\s*metaDescription:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;
  const out: Page[] = [];
  let m: RegExpExecArray | null;
  while ((m = langRe.exec(src))) {
    const lang = m[1] as Lang;
    out.push({
      scope: "pillar",
      key: "pillar_open_llc",
      routePath: buildRoutePath(lang, PILLAR_SLUG[lang]),
      lang,
      title: m[2],
      description: m[3],
    });
  }
  return out;
}

// ---------------- analysis ----------------

type Issue = {
  scope: "title" | "description" | "cta";
  surface: "desktop" | "mobile";
  severity: "info" | "warn" | "error";
  note: string;
};

function analysePage(p: Page): Issue[] {
  const issues: Issue[] = [];
  const titleLen = p.title.length;
  const descLen = p.description.length;

  // Title checks
  if (titleLen > TITLE_DESKTOP_MAX) {
    issues.push({
      scope: "title",
      surface: "desktop",
      severity: "error",
      note: `Title is ${titleLen} chars, exceeds desktop cap of ${TITLE_DESKTOP_MAX}; tail will be cropped with an ellipsis.`,
    });
  }
  if (titleLen > TITLE_MOBILE_WRAP) {
    issues.push({
      scope: "title",
      surface: "mobile",
      severity: "warn",
      note: `Title is ${titleLen} chars, may wrap awkwardly past 2 lines on mobile (~${TITLE_MOBILE_WRAP}-char comfort limit).`,
    });
  }

  // Description checks
  if (descLen > DESC_DESKTOP_MAX) {
    issues.push({
      scope: "description",
      surface: "desktop",
      severity: "error",
      note: `Description is ${descLen} chars, exceeds desktop cap of ${DESC_DESKTOP_MAX}; tail will be cropped.`,
    });
  } else if (descLen > 160) {
    issues.push({
      scope: "description",
      surface: "desktop",
      severity: "info",
      note: `Description is ${descLen} chars (>160) — safe but on the wide end of Google's desktop budget.`,
    });
  }

  // Mobile CTA-tail check: only flag if (a) the description has a soft CTA
  // ending and (b) that CTA starts past the mobile 3-line truncation point
  // (~130 chars), meaning the CTA likely doesn't show on phones.
  const cta = findCtaTail(p.lang, p.description);
  if (cta && cta.startIdx > DESC_MOBILE_TAIL) {
    issues.push({
      scope: "cta",
      surface: "mobile",
      severity: "warn",
      note: `Soft CTA "${cta.cta}" sits at char ${cta.startIdx + 1}; mobile SERP usually truncates around char ${DESC_MOBILE_TAIL}, so the CTA may not render on phones.`,
    });
  }
  return issues;
}

// ---------------- rendering ----------------

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function renderHtml(allPages: Page[]): string {
  const byLang: Record<Lang, Page[]> = { es: [], en: [], fr: [], de: [], pt: [], ca: [] };
  for (const p of allPages) byLang[p.lang].push(p);

  const sectionForLang = (lang: Lang) => {
    const cards = byLang[lang]
      .map((p) => {
        const issues = analysePage(p);
        const issueBadge = issues.length
          ? `<div class="badges">${issues
              .map((i) => `<span class="badge ${i.severity}" title="${escapeHtml(i.note)}">${i.surface}-${i.scope}</span>`)
              .join("")}</div>`
          : '<div class="badges"><span class="badge ok">within budget</span></div>';
        const breadcrumb = `${URL_BASE}${p.routePath}`.replace(/\//g, " › ").replace(" › ", "/").replace(/^https: › /, "https://");
        return `
<article class="serp-block">
  <header class="block-header">
    <span class="scope ${p.scope}">${p.scope}</span>
    <span class="route">${escapeHtml(p.routePath)}</span>
    <span class="key">${escapeHtml(p.key)}</span>
  </header>
  ${issueBadge}
  <div class="serp-row">
    <div class="serp desktop">
      <div class="surface-label">Desktop</div>
      <div class="serp-card">
        <div class="serp-url">${escapeHtml(breadcrumb)}</div>
        <h3 class="serp-title desktop-title">${escapeHtml(p.title)}</h3>
        <p class="serp-desc desktop-desc">${escapeHtml(p.description)}</p>
      </div>
    </div>
    <div class="serp mobile">
      <div class="surface-label">Mobile</div>
      <div class="serp-card mobile-card">
        <div class="serp-url mobile-url">${escapeHtml(breadcrumb)}</div>
        <h3 class="serp-title mobile-title">${escapeHtml(p.title)}</h3>
        <p class="serp-desc mobile-desc">${escapeHtml(p.description)}</p>
      </div>
    </div>
  </div>
  <details class="raw">
    <summary>Raw copy (chars / px)</summary>
    <div class="raw-row"><strong>Title</strong> · ${p.title.length} chars · ${pixelWidth(p.title, CHAR_WIDTH_TITLE)}px<br><code>${escapeHtml(p.title)}</code></div>
    <div class="raw-row"><strong>Description</strong> · ${p.description.length} chars · ${pixelWidth(p.description, CHAR_WIDTH_DESC)}px<br><code>${escapeHtml(p.description)}</code></div>
  </details>
</article>`;
      })
      .join("\n");
    return `
<section class="lang-section" id="lang-${lang}">
  <h2>${LANG_LABEL[lang]} <span class="count">${byLang[lang].length} pages</span></h2>
  <div class="grid">
    ${cards}
  </div>
</section>`;
  };

  const totalIssues = allPages.reduce((n, p) => n + analysePage(p).length, 0);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SERP Previews · 18 indexable pages × 6 locales</title>
  <meta name="robots" content="noindex">
  <style>
    :root {
      --google-blue: #1a0dab;
      --google-url: #006621;
      --google-snippet: #4d5156;
      --google-title-mobile: #1558d6;
      --bg: #f5f6f8;
      --card: #fff;
      --border: #dadce0;
      --warn: #b45309;
      --warn-bg: #fef3c7;
      --error: #b91c1c;
      --error-bg: #fee2e2;
      --ok: #166534;
      --ok-bg: #dcfce7;
    }
    body { margin: 0; font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; background: var(--bg); color: #202124; }
    header.top { padding: 24px 32px; background: #1f2937; color: #fff; }
    header.top h1 { margin: 0 0 6px; font-size: 22px; }
    header.top p { margin: 0; opacity: .8; font-size: 13px; }
    nav.locales { padding: 12px 32px; background: #fff; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 5; }
    nav.locales a { margin-right: 16px; color: #1a73e8; text-decoration: none; font-weight: 600; }
    nav.locales a:hover { text-decoration: underline; }
    section.lang-section { padding: 24px 32px; }
    section.lang-section h2 { margin: 0 0 16px; font-size: 18px; border-bottom: 2px solid var(--border); padding-bottom: 8px; }
    .count { font-size: 12px; color: #5f6368; font-weight: 400; margin-left: 8px; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    article.serp-block { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
    .block-header { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; font-size: 12px; }
    .scope { padding: 2px 8px; border-radius: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; font-size: 10px; }
    .scope.static { background: #dbeafe; color: #1e40af; }
    .scope.pillar { background: #ede9fe; color: #5b21b6; }
    .scope.subpage { background: #fef3c7; color: #92400e; }
    .route { font-family: SFMono-Regular, Consolas, monospace; color: #5f6368; font-size: 12px; }
    .key { color: #94a3b8; font-size: 11px; margin-left: auto; }
    .badges { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
    .badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .badge.ok { background: var(--ok-bg); color: var(--ok); }
    .badge.info { background: #e0f2fe; color: #075985; }
    .badge.warn { background: var(--warn-bg); color: var(--warn); }
    .badge.error { background: var(--error-bg); color: var(--error); }
    .serp-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; }
    @media (max-width: 900px) { .serp-row { grid-template-columns: 1fr; } }
    .surface-label { font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: .5px; margin-bottom: 4px; font-weight: 600; }
    .serp-card {
      background: #fff;
      border: 1px solid #e8eaed;
      border-radius: 8px;
      padding: 14px 16px;
      max-width: 600px;
    }
    .serp-card.mobile-card { max-width: 380px; padding: 12px; border-radius: 12px; box-shadow: 0 1px 3px rgba(60,64,67,.16); }
    .serp-url { color: var(--google-url); font-size: 12px; line-height: 1.4; word-break: break-word; }
    .serp-url.mobile-url { font-size: 11px; }
    .serp-title { color: var(--google-blue); font-weight: 400; font-size: 20px; line-height: 26px; margin: 4px 0; cursor: pointer; }
    .serp-title.desktop-title {
      max-width: ${DESKTOP_TITLE_PX}px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .serp-title.mobile-title {
      color: var(--google-title-mobile);
      font-size: 16px;
      line-height: 22px;
      max-width: ${MOBILE_TITLE_PX}px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .serp-desc { color: var(--google-snippet); font-size: 14px; line-height: 1.45; margin: 0; }
    .serp-desc.desktop-desc {
      max-width: ${DESKTOP_DESC_PX}px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .serp-desc.mobile-desc {
      max-width: ${MOBILE_DESC_PX}px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: 13px;
    }
    details.raw { margin-top: 12px; font-size: 12px; }
    details.raw summary { cursor: pointer; color: #5f6368; font-weight: 600; }
    .raw-row { margin-top: 8px; }
    .raw-row code { background: #f1f3f4; padding: 2px 6px; border-radius: 3px; word-break: break-word; display: block; margin-top: 4px; font-family: SFMono-Regular, Consolas, monospace; }
  </style>
</head>
<body>
  <header class="top">
    <h1>Google SERP previews — 18 indexable pages × 6 locales</h1>
    <p>Generated ${new Date().toISOString()} · ${allPages.length} cards · ${totalIssues} pixel-budget flags. Pixel widths are estimates from Arial 20/14&nbsp;px tables; real Google rendering may differ ±5%.</p>
  </header>
  <nav class="locales">
    ${LANGS.map((l) => `<a href="#lang-${l}">${LANG_LABEL[l]} (${byLang[l].length})</a>`).join("")}
  </nav>
  ${LANGS.map(sectionForLang).join("\n")}
</body>
</html>
`;
}

// ---------------- markdown gallery ----------------

function severityIcon(s: Issue["severity"]): string {
  return s === "error" ? "🔴" : s === "warn" ? "🟡" : "🔵";
}

function renderMarkdown(allPages: Page[]): string {
  const lines: string[] = [];
  lines.push("# Google SERP previews — 18 indexable pages × 6 locales");
  lines.push("");
  lines.push(`_Generated ${new Date().toISOString()}_`);
  lines.push("");
  lines.push("This report follows up on Task #3 by re-checking how the refreshed copy renders in Google's desktop and mobile SERP cards. The character budgets used here are aligned with `scripts/seo/verify-meta.ts`, so a passing meta-check translates directly into clean SERP previews.");
  lines.push("");
  lines.push("## Gates");
  lines.push("");
  lines.push(`- **Desktop title cap**: ${TITLE_DESKTOP_MAX} chars (Google truncates with an ellipsis past this).`);
  lines.push(`- **Mobile title comfort**: ${TITLE_MOBILE_WRAP} chars before titles wrap to a 3rd line on small phones.`);
  lines.push(`- **Desktop description cap**: ${DESC_DESKTOP_MAX} chars (matches verify-meta DESC_MAX).`);
  lines.push(`- **Mobile CTA window**: first ${DESC_MOBILE_TAIL} chars (≈ 3 lines on phones); a soft CTA placed past this point may not show on mobile.`);
  lines.push("");
  lines.push(`Open [\`serp-previews.html\`](./serp-previews.html) in a browser for the **visual gallery** (108 cards, desktop + mobile per page, with the real CSS truncation Google would apply at ${DESKTOP_TITLE_PX}/${DESKTOP_DESC_PX} px desktop and ${MOBILE_TITLE_PX}/${MOBILE_DESC_PX} px mobile).`);
  lines.push("");

  const counts = { error: 0, warn: 0, info: 0 } as Record<Issue["severity"], number>;
  for (const p of allPages) for (const i of analysePage(p)) counts[i.severity]++;

  lines.push("## Summary");
  lines.push("");
  lines.push(`- Total cards: **${allPages.length}** (${LANGS.length} locales × 18 indexable pages).`);
  lines.push(`- 🔴 Hard truncation errors: **${counts.error}**.`);
  lines.push(`- 🟡 Mobile / CTA warnings: **${counts.warn}**.`);
  lines.push(`- 🔵 Informational notes: **${counts.info}**.`);
  lines.push("");
  if (counts.error === 0) {
    lines.push("> ✅ **No hard SERP truncations expected** on any of the 18 indexable pages across any of the 6 locales. The refreshed copy from Task #3 renders cleanly in Google's desktop card; remaining notes are mobile-only and documented per page below.");
    lines.push("");
  }

  lines.push("### Per-locale breakdown");
  lines.push("");
  lines.push("| Locale | Pages | 🔴 errors | 🟡 warnings | 🔵 info |");
  lines.push("| --- | ---: | ---: | ---: | ---: |");
  for (const lang of LANGS) {
    const langPages = allPages.filter((p) => p.lang === lang);
    const langCounts = { error: 0, warn: 0, info: 0 } as Record<Issue["severity"], number>;
    for (const p of langPages) for (const i of analysePage(p)) langCounts[i.severity]++;
    lines.push(`| ${LANG_LABEL[lang]} | ${langPages.length} | ${langCounts.error} | ${langCounts.warn} | ${langCounts.info} |`);
  }
  lines.push("");

  lines.push("## Flagged cards");
  lines.push("");
  const flagged = allPages.filter((p) => analysePage(p).length > 0);
  if (flagged.length === 0) {
    lines.push("> All 108 cards are within budget. No truncations or CTA wraps expected on either desktop or mobile.");
    lines.push("");
  } else {
    lines.push("Cards with at least one note. _Mobile-title wraps are normal Google rendering_ — only worth fixing if the wrap looks awkward in the visual gallery. _CTA-mobile flags_ mean the soft call-to-action sits past the mobile 3-line window and may not render on phones; this is acceptable when the desktop card still shows the full CTA.");
    lines.push("");
    for (const p of flagged) {
      const issues = analysePage(p);
      lines.push(`### \`${p.routePath}\` · ${p.scope} · ${p.key} (${p.lang})`);
      lines.push("");
      lines.push(`- **Title** (${p.title.length} chars · ${pixelWidth(p.title, CHAR_WIDTH_TITLE)} px est. desktop)`);
      lines.push(`  > ${p.title}`);
      lines.push(`- **Description** (${p.description.length} chars · ${pixelWidth(p.description, CHAR_WIDTH_DESC)} px est. desktop)`);
      lines.push(`  > ${p.description}`);
      lines.push("- Notes:");
      for (const i of issues) lines.push(`  - ${severityIcon(i.severity)} ${i.note}`);
      lines.push("");
    }
  }

  lines.push("## Recommendation");
  lines.push("");
  if (counts.error === 0 && counts.warn === 0) {
    lines.push("All 18 × 6 = 108 SERP cards render cleanly on both desktop and mobile. No copy tweaks required; the verify-meta budgets installed in Task #2/#3 are sufficient.");
  } else if (counts.error === 0) {
    lines.push("No hard desktop truncations. Remaining flags are mobile-only and **acceptable as-is**: the existing copy was deliberately tuned to fit the desktop 165-char budget and Google's mobile card already truncates at ~130 chars on most phones, so the soft CTA may not appear on mobile for some descriptions. This trade-off was accepted in Task #2 in exchange for richer copy on the desktop card (where the CTA does render).");
  } else {
    lines.push("Hard desktop truncations were detected — review the flagged cards above and shorten copy to fit the 60-char title / 165-char description budget. Re-run `npm run seo:meta` after editing.");
  }
  lines.push("");

  lines.push("## Full inventory");
  lines.push("");
  for (const lang of LANGS) {
    lines.push(`### ${LANG_LABEL[lang]}`);
    lines.push("");
    lines.push("| Scope | Route | Title chars | Desc chars | Flags |");
    lines.push("| --- | --- | ---: | ---: | --- |");
    const langPages = allPages.filter((p) => p.lang === lang);
    for (const p of langPages) {
      const issues = analysePage(p);
      const flagSummary = issues.length
        ? issues.map((i) => `${severityIcon(i.severity)}${i.surface}-${i.scope}`).join(" ")
        : "✅";
      lines.push(`| ${p.scope} | \`${p.routePath}\` | ${p.title.length} | ${p.description.length} | ${flagSummary} |`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ---------------- main ----------------

const allPages: Page[] = [];
for (const lang of LANGS) for (const p of extractStatic(lang)) allPages.push(p);
for (const p of extractSubpages()) allPages.push(p);
for (const p of extractPillar()) allPages.push(p);

allPages.sort((a, b) => {
  if (a.lang !== b.lang) return LANGS.indexOf(a.lang) - LANGS.indexOf(b.lang);
  if (a.scope !== b.scope) return a.scope.localeCompare(b.scope);
  return a.key.localeCompare(b.key);
});

const expectedPerLang = 18;
for (const lang of LANGS) {
  const count = allPages.filter((p) => p.lang === lang).length;
  if (count !== expectedPerLang) {
    console.warn(`[serp-previews] WARN: lang ${lang} produced ${count} pages, expected ${expectedPerLang}`);
  }
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "serp-previews.html"), renderHtml(allPages), "utf8");
writeFileSync(join(OUT_DIR, "serp-previews.md"), renderMarkdown(allPages), "utf8");
writeFileSync(
  join(OUT_DIR, "serp-previews.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      budgets: { DESKTOP_TITLE_PX, DESKTOP_DESC_PX, MOBILE_TITLE_PX, MOBILE_DESC_PX },
      pages: allPages.map((p) => ({
        ...p,
        titleChars: p.title.length,
        descChars: p.description.length,
        titlePx: pixelWidth(p.title, CHAR_WIDTH_TITLE),
        descPx: pixelWidth(p.description, CHAR_WIDTH_DESC),
        issues: analysePage(p),
      })),
    },
    null,
    2,
  ),
  "utf8",
);

const summary = { error: 0, warn: 0, info: 0 };
for (const p of allPages) for (const i of analysePage(p)) summary[i.severity]++;
console.log(
  `[serp-previews] Wrote ${allPages.length} cards (${LANGS.length} locales × 18 pages). ${summary.error} errors, ${summary.warn} warnings, ${summary.info} info.`,
);
console.log(`[serp-previews] Report: ${join(OUT_DIR, "serp-previews.md")}`);
console.log(`[serp-previews] Visual gallery: ${join(OUT_DIR, "serp-previews.html")}`);
