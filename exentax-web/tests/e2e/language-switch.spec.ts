import { test, expect } from "@playwright/test";
import { suppressCookieBanner } from "./_setup";

/**
 * Language switcher E2E (PENDING.md §14).
 *
 * The article `cuanto-cuesta-constituir-llc` exists in all six
 * supported languages (es / en / fr / de / pt / ca) under the SAME
 * slug, so after a language switch the URL becomes
 * `/{lang}/blog/cuanto-cuesta-constituir-llc`.
 *
 * The switcher (`<LanguageSwitcher>`) exposes:
 *   - `data-testid="button-lang-switcher"` (toggle button)
 *   - `data-testid="button-lang-{es|en|fr|de|pt|ca}"` (one per language)
 *
 * In addition to URL + `<html lang>`, this spec asserts:
 *   - `localStorage["exentax_lang"]` was updated to the new locale
 *     (see `client/src/i18n/language-service.ts`).
 *   - At least one `<link rel="alternate" hreflang>` matches the
 *     target locale (BCP-47 form), and clicking that hreflang URL
 *     navigates to the right page (i.e. the alternate link is real,
 *     not a dead pointer).
 */

const SHOULD_SKIP = process.env.SKIP_E2E === "1";

const SLUG = "cuanto-cuesta-constituir-llc";

const TARGET_LANGS = ["en", "fr", "de", "pt", "ca"] as const;

// BCP-47 form expected on the alternate links (mirrors HREFLANG_BCP47
// in client/src/components/SEO.tsx).
const HREFLANG_BCP47: Record<typeof TARGET_LANGS[number], string> = {
  en: "en-US",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-PT",
  ca: "ca-ES",
};

test.describe("language switcher", () => {
  test.skip(SHOULD_SKIP, "SKIP_E2E set; skipping browser-dependent test.");

  test.beforeEach(async ({ page }) => {
    await suppressCookieBanner(page);
  });

  for (const target of TARGET_LANGS) {
    test(`switches /es/blog/${SLUG} → /${target}/blog/${SLUG}, persists, and exposes hreflang`, async ({ page }) => {
      await page.goto(`/es/blog/${SLUG}`);

      // Sanity: starting in Spanish.
      await expect(page.locator("html")).toHaveAttribute("lang", "es");

      // Open the switcher.
      await page.getByTestId("button-lang-switcher").click();

      // Click the target language entry.
      await page.getByTestId(`button-lang-${target}`).click();

      // URL must navigate to the localized blog slug. The slug is
      // shared across languages for this article.
      await expect(page).toHaveURL(new RegExp(`/${target}/blog/${SLUG}/?$`));

      // <html lang> must reflect the new locale.
      await expect(page.locator("html")).toHaveAttribute("lang", target);

      // Persistence: the LanguageService writes "exentax_lang" to
      // localStorage so the user's choice survives a reload.
      const persisted = await page.evaluate(() => localStorage.getItem("exentax_lang"));
      expect(persisted).toBe(target);

      // Hreflang: at least one alternate link must match the target
      // locale (BCP-47) and point at the localized blog path. Note
      // that some articles use a translated slug (e.g. /en/blog/...
      // is `how-much-does-it-cost-to-form-a-us-llc-complete-cost`),
      // so we only assert the locale-prefixed `/blog/` path, not the
      // source slug.
      const expectedTag = HREFLANG_BCP47[target];
      const hreflangHref = await page.evaluate((tag: string) => {
        const link = document.querySelector(
          `link[rel="alternate"][hreflang="${tag}"]`,
        ) as HTMLLinkElement | null;
        return link?.href ?? null;
      }, expectedTag);
      expect(hreflangHref, `hreflang=${expectedTag} link present`).not.toBeNull();
      expect(hreflangHref!).toMatch(new RegExp(`/${target}/blog/[a-z0-9-]+/?$`));

      // Reload (relative to the dev origin) to confirm persistence
      // survives a full navigation. We strip the production origin
      // from the hreflang href because tests run against localhost.
      const relPath = new URL(hreflangHref!).pathname;
      await page.goto(relPath);
      await expect(page.locator("html")).toHaveAttribute("lang", target);
      const persistedAfterReload = await page.evaluate(() => localStorage.getItem("exentax_lang"));
      expect(persistedAfterReload).toBe(target);
    });
  }
});
