import { test, expect, type Locator, type Page } from "@playwright/test";
import { suppressCookieBanner } from "./_setup";
import { ROUTE_SLUGS, SUPPORTED_LANGS } from "../../shared/routes";
import { CONTACT } from "../../client/src/lib/constants";

/**
 * CTA navigation E2E (Task #19).
 *
 * For each of the 6 supported locales (es / en / fr / de / pt / ca)
 * this spec exercises the primary call-to-action surfaces a real
 * visitor encounters and asserts:
 *
 *   - They are visible.
 *   - Internal links resolve to the locale-prefixed booking slug
 *     defined by `ROUTE_SLUGS.book` (mirrored in `BOOK_SLUG`).
 *   - WhatsApp anchors point at the canonical `wa.me` number with
 *     a non-empty, URL-encoded `text` query and contain no
 *     "Hola <verb>" Spanish punctuation regression on the `es`
 *     locale.
 *
 * Surfaces covered (test IDs):
 *
 *   - Hero primary booking          → `button-hero-agendar`
 *   - Hero WhatsApp                 → `button-hero-whatsapp`
 *   - Floating WhatsApp bubble      → `button-floating-whatsapp`
 *   - Navbar booking (responsive)   → `button-agendar-nav`
 *                                     / `mobile-nav-agendar`
 *   - Home final CTA book + wa.me   → `cta-final-agendar`
 *                                     / `cta-final-whatsapp`
 *   - Footer booking link           → footer `<a href$=BOOK_SLUG>`
 *   - Blog post `ArticleCTA`        → `button-post-agendar`
 *                                     / `button-post-whatsapp`
 *
 * Tracking-event coverage is intentionally NOT duplicated here:
 * `tests/e2e/analytics-events.spec.ts` already exercises that
 * pipeline behind the `E2E_TEST_HOOKS=1` server flag. This spec
 * focuses on what users actually see — destination URLs and the
 * outbound WhatsApp message text — across every locale.
 */

const SHOULD_SKIP = process.env.SKIP_E2E === "1";

// Source the booking slug per locale directly from `shared/routes.ts`
// (the routing table the app itself reads). A rename there now
// flows automatically into these E2E assertions instead of
// requiring a parallel update here.
const BOOK_SLUG: Record<string, string> = Object.fromEntries(
  SUPPORTED_LANGS.map((l) => [l, ROUTE_SLUGS.book[l]]),
);
const LOCALES = [...SUPPORTED_LANGS];

// One blog post that exists in all 6 languages (verified against
// `client/src/data/blog-content/{lang}/`).
const SHARED_BLOG_SLUG = "cuanto-cuesta-constituir-llc";

// Spanish-only regression guard for the "Hola <verb>" bug fixed in
// `whatsappDefault`, `whatsappNav`, `whatsappConfirmMsg` and
// `whatsappMessage`. A conjugated verb directly after "Hola"
// without a comma reads as a proper noun.
const ES_BAD_GREETING =
  /^Hola (Acabo|Facturo|He|Quiero|Necesito|Estoy|Soy|Vengo|Tengo|Busco|Llevo|Vivo|Trabajo|Pago|Cobro|Gano|Vendo|Quería|Quisiera|Me interesa|Me gustaría|Deseo)\b/;

async function expectWhatsappAnchor(loc: Locator, lang: string) {
  await expect(loc).toBeVisible();
  const href = (await loc.getAttribute("href")) || "";
  // The canonical wa.me number is sourced directly from
  // `client/src/lib/constants.ts` (the same file the runtime
  // reads), so a number rotation there flows automatically into
  // the test instead of leaving a stale literal here.
  expect(href, `wa.me canonical number on ${lang}`).toMatch(
    new RegExp(`^https:\\/\\/wa\\.me\\/${CONTACT.WHATSAPP_NUMBER}\\?text=.+`),
  );
  const decoded = decodeURIComponent(href.split("?text=")[1] || "");
  expect(decoded.length, `non-empty whatsapp message on ${lang}`).toBeGreaterThan(10);
  if (lang === "es") {
    expect(decoded, "no 'Hola <verb>' Spanish greeting bug").not.toMatch(ES_BAD_GREETING);
  }
  return decoded;
}

async function expectInternalBookLink(loc: Locator, lang: string) {
  await expect(loc).toBeVisible();
  const href = await loc.getAttribute("href");
  expect(href, `book link href on ${lang}`).toBe(`/${lang}/${BOOK_SLUG[lang]}`);
}

async function openMobileMenuIfNeeded(page: Page, isMobile: boolean) {
  if (!isMobile) return;
  const burger = page
    .getByRole("button", { name: /menu|menú|menü/i })
    .first();
  if (await burger.isVisible().catch(() => false)) await burger.click();
}

test.describe("CTA navigation across 6 languages", () => {
  test.skip(SHOULD_SKIP, "SKIP_E2E set; skipping browser-dependent test.");

  test.beforeEach(async ({ page }) => {
    await suppressCookieBanner(page);
  });

  for (const lang of LOCALES) {
    test(`[${lang}] hero CTAs — primary booking + WhatsApp are well-formed`, async ({ page }) => {
      await page.goto(`/${lang}`);
      const heroBook = page.getByTestId("button-hero-agendar");
      const heroWa = page.getByTestId("button-hero-whatsapp");
      await heroBook.scrollIntoViewIfNeeded();
      await expectInternalBookLink(heroBook, lang);
      await expectWhatsappAnchor(heroWa, lang);
    });
  }

  for (const lang of LOCALES) {
    test(`[${lang}] navbar booking CTA navigates to /${lang}/${BOOK_SLUG[lang]}`, async ({ page, isMobile }) => {
      await page.goto(`/${lang}`);
      const desktopBtn = page.getByTestId("button-agendar-nav");
      const mobileBtn = page.getByTestId("mobile-nav-agendar");
      let target = desktopBtn;
      if (isMobile || !(await desktopBtn.isVisible().catch(() => false))) {
        await openMobileMenuIfNeeded(page, true);
        target = mobileBtn;
      }
      await expect(target).toBeVisible();
      await target.click();
      await expect(page).toHaveURL(new RegExp(`/${lang}/${BOOK_SLUG[lang]}/?$`));
    });
  }

  for (const lang of LOCALES) {
    test(`[${lang}] floating WhatsApp bubble points at canonical wa.me`, async ({ page }) => {
      await page.goto(`/${lang}`);
      // The bubble hides itself once the footer scrolls into view via
      // an IntersectionObserver, so we check it from the top of the
      // page where it must always be rendered.
      const bubble = page.getByTestId("button-floating-whatsapp");
      await expectWhatsappAnchor(bubble, lang);
    });
  }

  for (const lang of LOCALES) {
    test(`[${lang}] home final CTA — book + WhatsApp links are well-formed`, async ({ page }) => {
      await page.goto(`/${lang}`);
      const bookCta = page.getByTestId("cta-final-agendar");
      const waCta = page.getByTestId("cta-final-whatsapp");
      // The HomeFinalCTA section is at the bottom of the page; scroll
      // it into view so the wouter <Link> has rendered before we
      // probe its `href`.
      await bookCta.scrollIntoViewIfNeeded();
      await expectInternalBookLink(bookCta, lang);
      await expectWhatsappAnchor(waCta, lang);
    });
  }

  for (const lang of LOCALES) {
    test(`[${lang}] footer booking link points at /${lang}/${BOOK_SLUG[lang]}`, async ({ page }) => {
      await page.goto(`/${lang}`);
      const footerBook = page
        .locator(`footer a[href="/${lang}/${BOOK_SLUG[lang]}"]`)
        .first();
      await footerBook.scrollIntoViewIfNeeded();
      await expect(footerBook).toBeVisible();
      // Also exercise the footer WhatsApp contact anchor — same
      // canonical number, different surface.
      const footerWa = page.getByTestId("link-footer-whatsapp-contact");
      await expectWhatsappAnchor(footerWa, lang);
    });
  }

  for (const lang of LOCALES) {
    test(`[${lang}] blog ArticleCTA — localized primary + WhatsApp on a real post`, async ({ page }) => {
      await page.goto(`/${lang}/blog/${SHARED_BLOG_SLUG}`);
      const cta = page.getByTestId("article-cta-final");
      await cta.scrollIntoViewIfNeeded();
      await expect(cta).toBeVisible();
      const postPrimary = page.getByTestId("button-post-agendar");
      const postWa = page.getByTestId("button-post-whatsapp");
      // Primary destination depends on the article's CTA pattern in
      // `client/src/data/blog-cta-library.ts` (book / services / itin /
      // florida / banking / hold). We don't pin the slug here — we
      // assert the link is a real, locale-prefixed internal route, so
      // the test stays valid as editorial picks change. Drift in the
      // route key itself is caught by the cta-link-crawler's
      // discovered-link consistency check.
      await expect(postPrimary).toBeVisible();
      const primaryHref = (await postPrimary.getAttribute("href")) || "";
      // Allow nested locale paths like `/en/services/get-your-itin`
      // — ArticleCTA picks `lp("…")` for whatever the editorial
      // mapping says, and several mappings (ITIN, state pillars,
      // legal pages) resolve to multi-segment slugs.
      expect(primaryHref, `blog primary href on ${lang}`).toMatch(
        new RegExp(`^/${lang}/[a-z0-9-]+(?:/[a-z0-9-]+)*$`),
      );
      await expectWhatsappAnchor(postWa, lang);
    });
  }
});
