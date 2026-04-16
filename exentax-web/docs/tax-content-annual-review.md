# Annual review — broker / W-8BEN-E FAQ answers

The advanced FAQ entries `advanced_9`, `advanced_10` and `advanced_11` (under
`faqData.answers` in each locale) quote specific US tax rules that the IRS or
treaty protocols can change between filing seasons. Run this checklist **once
per tax year, in January**, before the new filing season opens, and again if
the IRS publishes an interim update.

## Where the content lives

- `exentax-web/client/src/i18n/locales/es.ts` (source of truth)
- `exentax-web/client/src/i18n/locales/en.ts`
- `exentax-web/client/src/i18n/locales/fr.ts`
- `exentax-web/client/src/i18n/locales/de.ts`
- `exentax-web/client/src/i18n/locales/pt.ts`
- `exentax-web/client/src/i18n/locales/ca.ts`

Each locale must carry the same `advanced_9 / 10 / 11` entries under
`faqData.answers` (and the matching question under `faqData.questions`).

## Figures to re-verify

Confirm each number and form reference against the current IRS page listed.
Record the date of the check and the IRS publication revision in
`docs/seo/changelog.md` so the next reviewer sees when it was last validated.

| Claim in FAQ | Where to verify | Publication to cite |
|---|---|---|
| 30% default US withholding on FDAP income paid to non-resident aliens | IRS — "Tax Withholding for Foreign Persons" | Publication 515 (latest revision) |
| Reduced treaty rates (e.g. 15% / 10% on dividends and interest) for residents of countries with a US income-tax treaty | IRS — "United States Income Tax Treaties — A to Z" | Treaty text + Publication 901 |
| W-8BEN-E remains valid for **3 calendar years** after the year it is signed, unless a change in circumstances occurs sooner | IRS — "Instructions for Form W-8BEN-E" | Current Form W-8BEN-E instructions |
| Form **1042-S** is the information return the withholding agent / broker issues to the foreign beneficial owner | IRS — "About Form 1042-S" | Form 1042-S + instructions |
| Portfolio interest exemption (0% US withholding on qualifying US-source portfolio interest paid to non-resident aliens) | IRS — "Tax Withholding for Foreign Persons", section on portfolio interest | Publication 515 + IRC §871(h) / §881(c) |
| Form version numbers quoted in prose (W-8BEN-E, 1042-S, Publication 515, Publication 901) | IRS forms & publications pages | Latest revision date on the IRS page |

## Steps

1. Open each IRS page above and compare the figure, form version and wording
   against the Spanish source (`es.ts`). The Spanish entry is the canonical
   text; all other locales are translations of it.
2. If **any** figure, form revision or treaty reference has changed:
   1. Update the Spanish answer in `es.ts` first.
   2. Mirror the change into `en.ts`, `fr.ts`, `de.ts`, `pt.ts` and `ca.ts`.
      Keep the same Markdown structure (`**bold**`, bullet lists, `{{link:…}}`
      tokens) so the i18n validator stays green.
   3. If a claim becomes materially misleading and cannot be fixed in one line
      (e.g. a treaty is suspended), remove the paragraph in all 6 locales
      rather than leave outdated guidance live.
3. Run the i18n validator — it must still pass:
   ```bash
   npx tsx exentax-web/scripts/validate-i18n.ts
   ```
   The validator checks that every locale defines the same leaf keys and the
   same `{{link:…}}` tokens, so adding or removing a paragraph in only one
   locale will fail the check.
4. If the FAQ answers are also surfaced through `FAQ_SCHEMA_ENTRIES` in
   `server/seo-content.ts`, verify the JSON-LD copy there matches the new
   wording.
5. Log the review in `docs/seo/changelog.md` under a `## Tax content review —
   <YYYY>` heading with:
   - Date of the review and reviewer.
   - Which IRS publication revisions were cited.
   - Whether any figure changed, and the commit that applied the change.
6. Open a PR titled `chore(faq): annual tax review <YYYY>` even when nothing
   changed — a "no-op" review is still recorded so the next reviewer knows the
   content was checked.

## When to run an off-cycle review

Trigger a mid-year review (not only the January one) if any of these happen:

- The IRS publishes a new revision of Publication 515, Publication 901,
  Form W-8BEN-E or Form 1042-S.
- A new US income-tax treaty or protocol enters into force for a country
  Exentax markets to (currently: ES, FR, DE, PT, plus Catalan-speaking ES).
- Congress amends IRC §871(h) or §881(c) (portfolio interest exemption).
- A customer-facing correction is filed against one of the three answers.
