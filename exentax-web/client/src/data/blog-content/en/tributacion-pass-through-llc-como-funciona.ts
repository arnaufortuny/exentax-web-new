export default `Pass-through taxation is the core of why US LLCs are so efficient for non-residents. Here's a clear explanation of how it works and why it matters.

## What is pass-through taxation?

Pass-through taxation means the LLC itself doesn't pay income tax. Instead, the income "passes through" the LLC to the owner(s), who pay taxes on it at the personal level.

This is different from a C-Corporation, where:
1. The corporation pays corporate income tax on profits (21% federal)
2. When the corporation distributes dividends to shareholders, shareholders pay income tax again (qualified dividends at 0-20%)

This "double taxation" at the corporate level and then at the personal level makes C-Corps less efficient for small business owners.

With an LLC:
- **No corporate-level tax**
- Income passes through to the owner
- Owner pays taxes only once, at the personal level
- No dividend taxation

## Pass-through for non-resident single-member LLCs

For a US LLC owned by a non-resident:

**IRS classification:** The LLC is treated as a "Disregarded Entity". it's transparent for tax purposes. The IRS treats it as if the LLC doesn't exist for income tax purposes.

**Tax effect:** The LLC's income is treated as if you earned it directly (not through a corporate structure).

**The key for non-residents:** If the income is foreign-source (you work from outside the US), it's not subject to US income tax. Legal basis: IRC §871 (non-resident alien taxation) and IRC §882 (foreign corporation taxation).

Result: **$0 US federal income tax** on foreign-source income for non-residents.

## What "foreign source income" means

Income is generally "foreign source" if:
- You perform the services from outside the US (e.g, from your home in Spain)
- The property generating income is outside the US
- The income doesn't fit US-source income categories defined by the IRS

For most of our clients (remote workers in Spain, Mexico, Colombia, Argentina serving global clients): your income is foreign-source **even if your clients are US companies**. The key is where YOU perform the work, not where the client is.

## Where you DO pay tax

Pass-through doesn't mean tax-free forever. The income that passes through the LLC is:
- Not taxed in the US (for non-residents with foreign-source income)
- **Taxable in your country of residence**

You declare the LLC's net income on your personal tax return in your home country. The optimization comes from:
1. Reducing the taxable amount through legitimate LLC expense deductions
2. Using treaty benefits between your country and the US
3. Proper timing of distributions from the LLC
4. Using tools like Slash for corporate treasury (yield on idle cash)

## How this compares to other entity types

| Entity | Taxation | Available to non-residents? | Best for |
|---|---|---|---|
| **LLC (single-member)** | Pass-through. no corporate tax | Yes. best option | Freelancers, agencies, SaaS |
| **C-Corporation** | Double taxation (21% + dividends) | Yes, but less efficient | VC-backed startups |
| **S-Corporation** | Pass-through (similar to LLC) | **No**: can't have non-US shareholders | US residents only |
| **Sole proprietorship** | Pass-through | N/A. local entity | Local-only businesses |

## Form 5472 and pass-through

Despite paying no corporate tax, your LLC must still file Form 5472. This reports all transactions between you and the LLC. it's an information return, not a tax payment.

The $25,000 penalty for not filing Form 5472 (IRC §6038A) exists precisely because pass-through entities with foreign owners need this transparency mechanism. The IRS wants to know what transactions occurred, even though no tax is owed.

## Practical implications for your planning

**Revenue:** All LLC revenue flows through to you personally.
**Expenses:** Legitimate business expenses reduce the pass-through amount.
**Distributions:** When you take money out of the LLC (Owner's Draw), that's a draw from your business, not additional taxable income at the LLC level. It's already been "passed through."

**The financial infrastructure:** Mercury (primary banking), Slash (treasury), Wallester (cards), Wise (FX), Stripe (payments), all designed to work with this pass-through structure.

The goal: maximize legitimate expenses, distribute efficiently, and declare in your home country with the smallest legally justifiable tax base.

## Common misconceptions about pass-through taxation

**"Pass-through means I never pay taxes."**
Wrong. Pass-through means the LLC doesn't pay taxes. You still pay in your country of residence on the passed-through income.

**"I can retain earnings in the LLC indefinitely and defer taxes."**
It depends on your country. Some countries (like Spain) may attribute LLC income to you regardless of whether you distribute it. Others may only tax upon distribution. This requires country-specific analysis.

**"Pass-through is only for LLCs."**
No. S-Corporations, partnerships, and sole proprietorships also use pass-through. But the LLC structure is the only one available to non-US residents that combines pass-through with $0 federal tax on foreign-source income.

**"I need an accountant in the US to file my taxes."**
Not exactly. Your LLC files informational returns (Form 5472 + 1120), not income tax returns. This is what Exentax handles. Your personal taxes are filed in your country of residence with your local tax advisor.

## The pass-through advantage in numbers

| Scenario | C-Corporation | LLC (Pass-through) |
|---|---|---|
| LLC revenue | $100,000 | $100,000 |
| Deductible expenses | $20,000 | $20,000 |
| Taxable profit | $80,000 | $80,000 |
| US corporate tax | $16,800 (21%) | $0 |
| Available for distribution | $63,200 | $80,000 |
| Dividend tax (if applicable) | $9,480 (15%) | $0 |
| Available for personal declaration | $53,720 | $80,000 |
| Tax in home country (~25%) | $13,430 | $20,000 |
| **Total tax paid** | **$39,710 (39.7%)** | **$20,000 (20%)** |

The pass-through LLC saves nearly **$20,000/year** in this scenario compared to a C-Corporation. This is why the LLC structure is preferred for non-resident entrepreneurs.

## When pass-through taxation doesn't apply

Pass-through treatment is the default for single-member LLCs, but it can change in certain situations:

- **If you elect corporate taxation:** You can file Form 8832 to elect C-Corporation treatment. This is almost never advantageous for non-residents.
- **If you add partners:** A multi-member LLC is classified as a partnership by default, not a disregarded entity. Different forms (Form 1065) and different rules apply.
- **If you have US-source income:** Certain types of US-source income (real estate, performing services in the US) can create US tax obligations even with pass-through treatment.
- **If your country has CFC rules:** Some countries (like Spain under certain interpretations) may attribute LLC income to you regardless of distribution, meaning pass-through happens automatically for local tax purposes.

## Frequently asked questions

**Can I change from pass-through to corporate taxation?**
Yes, by filing Form 8832 (Entity Classification Election). However, once you change, there are waiting periods before you can change back. This is almost never recommended for non-resident freelancers.

**Does pass-through taxation work for multi-member LLCs?**
Yes, but differently. Multi-member LLCs are taxed as partnerships (Form 1065 + Schedule K-1) rather than disregarded entities. Each member reports their share of income on their personal return.

**Is pass-through taxation permanent?**
Yes, as long as you maintain the same structure (single-member LLC, no election to change). The IRS doesn't revoke pass-through status unless you change the entity's characteristics.

**Do all US states follow federal pass-through treatment?**
Most states follow the federal classification. States like New Mexico and Wyoming have no state income tax on pass-through LLC income from non-residents, which is why they're ideal for formation.


## Related articles

- <a href="/en/blog/form-5472-what-it-is-who-must-file-it-and-how-to-comply">Form 5472 guide</a>
- <a href="/en/blog/us-llc-taxation-by-country-of-residence-what-you-pay-where-you-live">taxation by country guide</a>
- <a href="/en/blog/tax-deductions-for-your-llc-complete-guide">deductible expenses guide</a>
- <a href="/en/blog/irs-extension-for-form-1120-how-to-file-form-7004-and-get-6-more-months">Form 7004 extension guide</a>
- <a href="/en/blog/annual-llc-maintenance-obligations-you-cannot-ignore">annual maintenance guide</a>
Book your strategic consultation and we'll show you exactly how pass-through taxation works for your specific situation.`;
