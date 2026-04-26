import { test, expect } from "@playwright/test";

/**
 * Language switcher E2E.
 *
 * The article `cuanto-cuesta-constituir-llc` exists in all six supported
 * languages (es / en / fr / de / pt / ca) under the SAME slug, so after
 * a language switch the URL becomes `/{lang}/blog/cuanto-cuesta-constituir-llc`.
 *
 * The switcher (`<LanguageSwitcher>`) exposes:
 *   - `data-testid="button-lang-switcher"` (toggle button)
 *   - `data-testid="button-lang-{es|en|fr|de|pt|ca}"` (one per language)
 */

const SHOULD_SKIP = process.env.SKIP_E2E === "1";

const SLUG = "cuanto-cuesta-constituir-llc";

const TARGET_LANGS = ["en", "fr", "de", "pt", "ca"] as const;

test.describe("language switcher", () => {
  test.skip(SHOULD_SKIP, "SKIP_E2E set; skipping browser-dependent test.");

  for (const target of TARGET_LANGS) {
    test(`switches /es/blog/${SLUG} → /${target}/blog/${SLUG} and updates <html lang>`, async ({ page }) => {
      await page.goto(`/es/blog/${SLUG}`);

      // Sanity: starting in Spanish.
      await expect(page.locator("html")).toHaveAttribute("lang", "es");

      // Open the switcher.
      const toggle = page.getByTestId("button-lang-switcher");
      await toggle.click();

      // Click the target language entry.
      await page.getByTestId(`button-lang-${target}`).click();

      // URL must navigate to the localized blog slug. The slug is shared
      // across languages for this article, so we assert exact path.
      await expect(page).toHaveURL(new RegExp(`/${target}/blog/${SLUG}/?$`));

      // <html lang> must reflect the new locale.
      await expect(page.locator("html")).toHaveAttribute("lang", target);
    });
  }
});
