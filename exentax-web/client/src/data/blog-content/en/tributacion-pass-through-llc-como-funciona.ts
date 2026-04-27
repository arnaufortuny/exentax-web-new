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
### Pass-through for non-resident single-member LLCs

For a US LLC owned by a non-resident:

**<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> classification:** The LLC is treated as a "Disregarded Entity". it's transparent for tax purposes. The IRS treats it as if the LLC doesn't exist for income tax purposes.

**Tax effect:** The LLC's income is treated as if you earned it directly (not through a corporate structure).

**The key for non-residents:** If the income is foreign-source (you work from outside the US), it's not subject to US income tax. Legal basis: IRC §871 (non-resident alien taxation) and IRC §882 (foreign corporation taxation).

Result: **$0 US federal income tax** on foreign-source income for non-residents.
### What "foreign source income" means

Income is generally "foreign source" if:
- You perform the services from outside the US (e.g, from your home in Spain)
- The property generating income is outside the US
- The income doesn't fit US-source income categories defined by the IRS

For most of our clients (online workers in Spain, Mexico, Colombia, Argentina serving global clients): your income is foreign-source **even if your clients are US companies**. The key is where YOU perform the work, not where the client is.
### Where you DO pay tax

Pass-through doesn't mean tax-free forever. The income that passes through the LLC is:
- Not taxed in the US (for non-residents with foreign-source income)
- **Taxable in your country of residence**

You declare the LLC's net income on your personal tax return in your home country. The optimization comes from:
1. Reducing the taxable amount through legitimate LLC expense deductions
2. Using treaty benefits between your country and the US
3. Proper timing of distributions from the LLC
4. Using tools like Slash for corporate treasury (yield on idle cash)
### How this compares to other entity types

| Entity | Taxation | Available to non-residents? | Best for |
|---|---|---|---|
| **LLC (single-member)** | Pass-through. no corporate tax | Yes. best option | Freelancers, agencies, SaaS |
| **C-Corporation** | Double taxation (21% + dividends) | Yes, but less efficient | VC-backed startups |
| **S-Corporation** | Pass-through (similar to LLC) | **No**: can't have non-US shareholders | US residents only |
| **Sole proprietorship** | Pass-through | N/A. local entity | Local-only businesses |
### Form 5472 and pass-through

Despite paying no corporate tax, your LLC must still file Form 5472. This reports all transactions between you and the LLC. it's an information return, not a tax payment.

The $25,000 penalty for not filing Form 5472 (IRC §6038A) exists precisely because pass-through entities with foreign owners need this transparency mechanism. The IRS wants to know what transactions occurred, even though no tax is owed.
### Practical implications for your planning

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
### The pass-through advantage in numbers

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
### When pass-through taxation doesn't apply

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

If something in this structure left you wanting more detail, <a href="/en/blog/us-resident-vs-non-resident-llc-the-key-tax-differences">US resident vs non-resident LLC: the key tax differences</a> dives into a neighbouring piece of the puzzle we usually keep for a separate write-up.
## Legal and regulatory references

This article relies on rules currently in force. Main sources for verification:

- **United States.** Treas. Reg. §301.7701-3 (entity classification / *check-the-box*); IRC §882 (tax on foreign income effectively connected with a US trade or business); IRC §871 (FDAP and withholding on non-residents); IRC §6038A and Treas. Reg. §1.6038A-2 (Form 5472 for *25% foreign-owned* and *foreign-owned disregarded entities*); IRC §7701(b) (tax residency, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report to <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Spain.** Law 35/2006 (LIRPF), arts. 8, 9 (residency), 87 (income attribution), 91 (CFC for individuals); Law 27/2014 (LIS), art. 100 (CFC for companies); Law 58/2003 (LGT), arts. 15 (anti-abuse) and 16 (simulation); Law 5/2022 (Form 720 penalty regime after CJEU C-788/19 of 27/01/2022); RD 1065/2007 (Forms 232 and 720); Order HFP/887/2023 (Form 721 crypto).
- **Spain–US treaty.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> of 22/12/1990 (original DTT); Protocol in force since 27/11/2019 (passive income, *limitation on benefits*).
- **EU / <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>.** Directive (EU) 2011/16, amended by DAC6 (cross-border arrangements), DAC7 (Directive (EU) 2021/514, digital platforms) and DAC8 (crypto-assets); Directive (EU) 2016/1164 (ATAD: CFC, exit tax, hybrid mismatches); OECD Common Reporting Standard (CRS).
- **International framework.** OECD Model Convention, art. 5 (permanent establishment) and Commentaries; BEPS Action 5 (economic substance); FATF Recommendation 24 (beneficial ownership).
Applying any of these rules to your specific case depends on your tax residency, the LLC's activity and the documentation you keep. This content is informational and does not replace personalized professional advice.
### Next steps

Now that you have the full context, the natural next step is to map it against your own situation: what fits, what doesn't, and where the nuances depend on your residency, your activity and your volume. A quick review of your specific case usually saves a lot of noise before taking any structural decision.

<!-- exentax:banking-facts-v1 -->
## Banking and tax facts worth clarifying

Fintech and CRS information evolves; here is the current state:

<!-- exentax:calc-cta-v1 -->
> <a href="/en/services">Start today, 100% online</a>
<!-- /exentax:calc-cta-v1 -->

### Notes by provider

- **Mercury** operates with several federally chartered partner banks and **FDIC** coverage via sweep network: mainly **Choice Financial Group** and **Evolve Bank & Trust**, with **Column N.A.** still in some legacy accounts. Mercury is not itself a bank; it is a fintech platform backed by those partner banks. If Mercury closes an account, the balance is typically returned **by paper check mailed to the account holder's registered address**, which can be a serious operational problem for non-residents; keep a secondary account (Relay, Wise Business, etc.) as contingency.
- **Wise** ships two clearly different products: **Wise Personal** and **Wise Business**. For an LLC you must open **Wise Business**, not the personal account. Important CRS nuance: a **Wise Business held by a US LLC sits outside CRS** because the account holder is a US entity and the US is not a CRS participant; the USD side operates via Wise US Inc. (FATCA perimeter, not CRS). In contrast, a **Wise Personal opened by an individual tax-resident in Spain** or another CRS jurisdiction **does trigger CRS reporting** via Wise Europe SA (Belgium) on that individual. Opening Wise for your LLC does not bring you into CRS through the LLC; a separate Wise Personal in your own name as a CRS-resident individual does report.
- **Wallester** (Estonia) is a European financial entity with an EMI/issuing-bank licence. Its European IBAN accounts **are within the Common Reporting Standard (CRS)** and therefore trigger automatic reporting to the tax administration of the holder's country of residence.
- **Payoneer** operates through European entities (Payoneer Europe Ltd, Ireland) that are also **in scope for CRS** for clients resident in participating jurisdictions.
- **Revolut Business**: when paired with a **US LLC**, it operates under **Revolut Technologies Inc.** with **Lead Bank** as its US banking partner. The account delivered is a US account (routing + account number); **no European IBAN is issued** to a US LLC. The European IBANs (Lithuanian, Belgian) belong to **Revolut Bank UAB** and are issued to European clients of the group. If you are offered a European IBAN tied to your LLC, confirm exactly which legal entity holds that account and which regime it reports under.
- **Zero tax**: no LLC structure delivers "zero tax" if you live in a country with CFC/tax transparency or income attribution rules. What you achieve is **no double taxation** and **correct reporting at residence**, not elimination.

<!-- exentax:legal-facts-v1 -->
## Legal & procedural facts

FinCEN and IRS reporting requirements moved recently; the current state is:

- **BOI / Corporate Transparency Act: your LLC is NOT required to file (a competitive advantage).** After **FinCEN's March 2025 interim final rule**, the BOI Report obligation was **narrowed to "foreign reporting companies"** (entities formed OUTSIDE the US and registered to do business in a state). A **US-formed LLC owned by a non-resident does NOT file the BOI Report**: one fewer filing on your calendar, less paperwork, and a cleaner structure than ever. If your LLC was formed before March 2025 and you already filed BOI, keep the acknowledgement. The regulatory status can change again: **we monitor FinCEN.gov on every filing** and, if the obligation comes back, we handle it at no extra cost. Current status verifiable at [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + pro-forma 1120.** For a **Single-Member LLC owned by a non-resident**, the final regulations of Treas. Reg. §1.6038A-1 (in force since 2017) treat the LLC as a corporation for 5472 purposes. Procedure: **pro-forma Form 1120** (header only: name, address, EIN, tax year) with **Form 5472 attached**. It is filed **by certified mail or fax to the IRS Service Center in Ogden, Utah**, **not e-filed via standard MeF**. Due date: **April 15**; extension via **Form 7004** to **October 15**. **Penalty: $25,000 per form per year, plus $25,000 per additional 30 days** of non-filing after IRS notice.
- **Substantive Form 1120.** Only applies if the LLC has filed a check-the-box election to C-Corp (Form 8832): it then pays 21 % federal corporate tax and files a substantive 1120. A standard disregarded LLC **does not file a substantive 1120 and does not pay federal corporate tax**.
- **EIN and notice.** Without an EIN you cannot file 5472 or BOI. The IRS does not warn before imposing penalties; you find out when an EIN is flagged or a later filing is rejected.
### Practical reminder

Each tax situation depends on your specific residency, the activity carried out and the contracts in force. The information here is general and does not replace personalised advice; check your particular case before taking structural decisions.

## Exentax today update: today pass-through in detail

Pass-through taxation is the tax core of an SMLLC; nail it down with today data:

- **Mechanics.** Treas. Reg. §301.7701-3 treats the SMLLC as a *disregarded entity*: income and expenses flow to the member and are taxed where the member is a tax resident. The LLC is not a federal taxpayer by default.
- **Exceptions.** Filing **Form 8832** electing *check-the-box* to C-Corp shifts the LLC to **21% federal** taxation and substantive 1120. Irrevocable for 60 months.
- **Mandatory reporting even when disregarded.** A non-resident SMLLC must file **Form 5472 + pro forma 1120** annually for any *reportable transaction* (base penalty USD 25,000/yr, IRC §6038A). Reporting is informational; it does not mean paying federal tax.

### Frequently asked questions

**Does pass-through mean I declare nothing?** No. The LLC is not a taxpayer; you are. Report the allocated profit in your country IRPF/EStG/IRPEF as appropriate.

**When does the C-Corp election make sense?** When members need tax deferral or want to accumulate profit at 21% federal before distributing. Case-by-case.

**Does multi-member change anything?** Yes: it stops being disregarded and becomes partnership by default, with Form 1065 + annual K-1, still pass-through.

<!-- exentax:execution-v2 -->
## How a pass-through LLC really gets taxed, the Exentax way

A single-member LLC is a disregarded entity by default: it pays no federal tax in the US, but its income is attributed to the beneficial owner at residency. That piece is the one nobody explains well, and the one the Exentax method closes from day one.

- **Residency attribution**: the LLC's net income is taxed in the owner's local IRPF/IRS in the year it accrues, not when it is distributed.
- **Double tax treaty** properly applied so you do not pay twice on the same income when substance and attribution allow.
- **5472 + pro-forma 1120**: even with no federal tax, the LLC must still file; missing it costs USD 25,000 per year.

For your exact combined-tax figure, run the <strong>Exentax calculator</strong> or book thirty minutes.
<!-- /exentax:execution-v2 -->


<!-- exentax:defensa-fiscal-v1 -->
## What if HMRC, the IRS or my local tax authority asks about my LLC?

  It's the question every client raises in the first consultation, and the short answer is: your LLC isn't opaque, and a properly declared structure closes any inquiry in standard forms. Your tax authority can request the state Certificate of Formation (Wyoming, Delaware or New Mexico), the EIN issued by the <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, the signed Operating Agreement, the Mercury or Wise statements for the year, the Form 5472 plus pro-forma 1120 you filed, and the bookkeeping that reconciles income, expenses and movements. If all of that exists and is delivered in order, the inquiry doesn't escalate.

  What tax authorities do pursue, and rightly, is sham ownership (nominees, paper residency) and undeclared foreign accounts. A well-structured LLC is the opposite: you appear as **beneficial owner** in the BOI Report when applicable (verifiable at <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), you sign the bank accounts and you declare the income where you actually live. The structure is registered with the state Secretary of State, with the IRS and, when European banks are involved, inside the CRS perimeter of the <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a> standard.

  The mistake that really sinks an inquiry isn't having an LLC; it's not attributing the income correctly in your domestic return, not declaring foreign accounts when the year-end balance exceeds the local threshold (€50,000 in Spain via <a href="https://www.boe.es" target="_blank" rel="noopener">Modelo 720</a>; the equivalent FBAR / Form 8938 in the US for residents; T1135 in Canada), and not documenting related-party transactions between the member and the LLC. Those three fronts are worth closing before any request arrives, not after.

  ## What an LLC does NOT do

  - **It does not exempt you from tax in your country of residence.** If you live in Spain, France, Germany or Portugal, you are taxed there on worldwide income. The LLC organises your US side (zero federal tax for non-resident SMLLC pass-through, absent Effectively Connected Income); it does not switch off your domestic taxation. The income tax is computed on the attributed profit, not on the dividends actually paid.
  - **It is not an offshore vehicle or a BEPS scheme.** It is a US entity recognised by the IRS, registered in a specific state with physical address, registered agent and annual informational filings. Classic offshore jurisdictions (BVI, Belize, Seychelles) leave no public trace; an LLC leaves a trace in five different places.
  - **It does not protect you if you commingle funds.** The *pierce the corporate veil* doctrine kicks in as soon as a judge sees the LLC and the member behaving as the same wallet: mixed accounts, personal expenses paid from the LLC, no signed Operating Agreement, no bookkeeping. Three suspicious transactions are enough.
  - **It does not save you social security contributions at home.** If you are self-employed in Spain, France or Germany, your monthly social contribution remains identical. The LLC handles the trading side with international clients; your personal contribution is independent.
  - **It does not exempt you from declaring foreign accounts.** Spain residents file Modelo 720 / 721; UK residents, the SA106; Portugal residents, the Anexo J of Modelo 3 IRS; Germany residents, the Anlage AUS. Those obligations belong to the individual, not to the LLC.

  At Exentax we cover those five fronts every year alongside the US federal calendar (Form 5472, pro-forma 1120, FBAR, state Annual Report and BOI Report when applicable). The goal is that no inquiry finds a loose end and that the structure withstands a 5-to-7-year retroactive review.
<!-- /exentax:defensa-fiscal-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22Pass-through%20taxation%20is%20the%20core%20of%20why%20US%20LLCs%20are%20so%20efficient%20for%20non-res%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you want to see the full process in detail, check our <a href="/en/services">services page</a> with everything we cover.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Formation, EIN, BOI, banking and ongoing maintenance — one team that understands your case end to end. <a href="/en/services">Explore all services</a>.
<!-- /exentax:cta-v1 -->

`;
