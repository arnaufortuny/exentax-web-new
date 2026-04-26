export default `When someone first sees the combo "US LLC" and "Spanish tax resident", the immediate question is always the same: **"so where do I pay taxes?"**. The answer is clear: **in Spain**, on the net profit, thanks to the **US-Spain double-taxation treaty**. The LLC is not used to "not pay", it is used to **not pay twice** and to optimize within what's legal.

This guide walks through the treaty step by step, in plain language, applied to the specific case of a non-resident-owned LLC with a Spanish-resident owner. With articles, rates, numerical examples, forms and AEAT references.

## What it is and why it exists

A **double-taxation treaty (DTA)** is a bilateral agreement between two countries to share the right to tax cross-border income and avoid taxing the same income twice, in source and in destination. Without a treaty, the natural result would be that you pay taxes in the US (because your LLC is there) **and** again in Spain (because you live there). That would suffocate any international business.

To avoid this, the US and Spain signed in **1990** a Convention to avoid double taxation and prevent fiscal evasion in matters of income taxes, modernized by a **Protocol signed in 2013** that entered into force on **November 27, 2019** (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> of October 23, 2019). This protocol updated withholding rates, information exchange and anti-abuse clauses.

Key articles to understand an LLC with a Spanish owner:

- **Art. 4, Tax residency:** defines where each person or entity is considered resident.
- **Art. 5, Permanent establishment:** crucial to know whether the US can tax you as a business operating in its territory.
- **Art. 7, Business profits:** the basic rule for services.
- **Art. 10, Dividends:** reduced withholding.
- **Art. 11, Interest:** generally exempt.
- **Art. 12, Royalties:** reduced rates.
- **Art. 17, Limitation on benefits:** prevents any vehicle without real substance from getting treaty access.
- **Art. 24, Methods to eliminate double taxation:** how Spain credits what was paid in the US (and vice versa).
## How it works for disregarded-entity LLCs

A **Single-Member LLC** owned by a non-resident is by default a **Disregarded Entity**: for the <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> it does not exist as a separate taxpayer. Its income and expenses flow directly to its single member. This is **pass-through taxation**.

For treaty purposes the reading is:

- The LLC **is not a US tax resident** because it is not taxed there as an entity.
- Who must be analyzed is **the member**: if they reside in Spain, the treaty applies to the Spanish-resident member.
- Therefore, the LLC's net profits are taxed **in Spain** under the member's IRPF.
- In the US the LLC only meets information requirements (Form 5472 + 1120 pro forma, BOI Report) provided it has no **ECI** (Effectively Connected Income).

The Spanish **<a href="https://petete.tributos.hacienda.gob.es" target="_blank" rel="noopener">DGT</a>** has confirmed this approach in binding rulings such as **V0290-20** and later ones, classifying the US LLC as a transparent or pass-through entity for Spanish purposes, depending on the case-specific analysis.
## Where you actually pay taxes

The short and honest answer for the typical case of an LLC providing services without a US permanent establishment and a Spanish-resident owner:

- **In the US: 0% federal, 0% state** (in NM/WY/DE for LLCs without local activity). Only maintenance costs.
- **In Spain: IRPF on the net profit** of the LLC, integrated in your annual tax return as economic activity income under the attribution-of-income regime, at your personal marginal rate (19% to 47%).

In other words, **you pay in Spain, but you pay better**: on the net profit after broad deductions, with no monthly autónomo quota, no autónomo quarterly advance payments and a much more efficient professional stack.
### Income types covered by the treaty

| Income type | Without treaty (US) | With US-Spain treaty |
|-------------|---------------------|----------------------|
| Services rendered from outside the US | 30% withholding | 0% (Art. 7, no PE) |
| Royalties (standard software, cultural copyright) | 30% | 0-10% by type (Art. 12) |
| Dividends from US companies | 30% | 15% general / 10% qualifying (Art. 10) |
| Bank or bond interest | 30% | 0% generally (Art. 11) |
| Capital gains on US shares | 30% / variable | Mainly taxed in Spain (Art. 13) |
| Pensions | 30% | Specific rules (Art. 20) |

For an operating digital-services LLC, the most relevant combo is: **0% US withholding on services** and **taxation in Spain as business income**.
### Spanish tax-residency certificate

To activate the treaty before the US payer, you need to prove that you are a **Spanish tax resident**. The AEAT issues a **tax-residency certificate for treaty purposes** through its electronic office. This certificate is valid for **one year** from issuance and it's wise to keep it always updated, especially if you work with brokers or payers applying complex withholdings.

In most collections via Stripe, PayPal, AdSense or similar they won't actively ask for it because the W-8BEN-E already does the work. But faced with an audit or with a broker like Interactive Brokers or a large corporate client, the certificate is the hard proof of your residency.
### Forms you will need

- **W-8BEN-E:** filed by your LLC before each US payer to certify residency of the beneficial owner and the applicable treaty rate. See our <a href="/en/blog/w8-ben-and-w8-ben-e-the-complete-guide">complete W-8BEN and W-8BEN-E guide</a>.
- **W-8BEN:** for non-resident individuals receiving income in their own name, not the LLC's.
- **Form 1042-S:** issued by the US payer if any withholding was applied. Needed to claim a refund or to credit it in Spain as foreign tax paid.
- **Form 5472 + Form 1120 pro forma:** the LLC's annual information return with the IRS.
- **BOI Report:** with <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>, identifying the ultimate beneficial owner.
- **Modelo 100 (IRPF):** your annual Spanish return where you integrate the LLC's net profit.
- **Modelo 720/721:** if the aggregate balance of foreign accounts, securities or crypto exceeds €50,000.
- **Tax-residency certificate:** issued by the AEAT when needed for an external payer.
## Practical cases with numbers

### Case A, Software consultant with US and EU clients

- LLC bills **USD 120,000/year** for services provided from Spain.
- LLC expenses: USD 30,000 (software, hardware, travel, registered agent, accounting).
- Net profit: USD 90,000 ≈ €82,000.
- US: **0%** withholding (active W-8BEN-E, no PE). Maintenance ≈ €2,000.
- Spain: effective IRPF of around 35-40% on €82,000. IRPF liability ≈ €25,000-€28,000.
- **Total tax burden:** €27,000-€30,000. Versus €38,000-€45,000 a comparable autónomo would pay including the quota.

### Case B, Trader / investor with US dividends via LLC

- LLC holds an Interactive Brokers account.
- US dividends received: USD 10,000/year.
- Without treaty: 30% withholding → USD 3,000 to the IRS.
- With W-8BEN-E + treaty: 15% withholding (Art. 10) → USD 1,500 to the IRS.
- In Spain: include the dividends in the savings base and apply the **deduction for international double taxation** of Art. 80 LIRPF for the USD 1,500 already paid in the US, up to the limit of the Spanish tax that would correspond to that income.

### Case C, Royalty for software sold in the US

- LLC sells software licenses to US companies: USD 50,000/year.
- If qualified as royalty (Art. 12), the withholding can be **5%** depending on the subtype.
- If qualified as service or sale of a copy (not royalty), Art. 7 → **0%**.
- The correct qualification is critical and depends on the contract. This is where an experienced tax advisor pays for itself.
### Source withholdings and how to recover them

If you suffer US withholdings (because no W-8 was on file, because it was a dividend or royalty payment, or because the payer made a mistake), you have two paths:

1. **Direct claim to the payer:** if it was their mistake and you're still within the fiscal year, they can usually adjust and refund you the difference.
2. **Refund request to the IRS:** via **Form 1040-NR** (individual) or procedures associated with the **1042-S**. It's slow (typically 12-18 months) and requires ITIN or EIN. The sensible move is not to get there: keep your W-8s clean from day one.

In Spain, withholdings effectively paid in the US within the treaty limit can be credited via the **deduction for international double taxation (DDII)** on the IRPF. That's the mechanism that prevents you from paying twice on the same income.
## Filing in Spain: Modelo 100

In your **annual personal tax return (Modelo 100)** you integrate the LLC's net profits as **economic activity income** under the attribution-of-income regime, unless your advisor justifies a different qualification. Typical steps:

1. Convert USD figures to EUR using the average yearly rate or the rate at the time of receipt, on a consistent criterion.
2. Compute total revenue and deductible expenses for the year.
3. Allocate net profit in the corresponding box of Modelo 100.
4. Apply the **deduction for international double taxation** for withholdings actually paid in the US within the treaty limit.
5. File **Modelo 720/721** if you exceed foreign-asset thresholds (bank accounts, securities, crypto).
6. Keep all documentation: Mercury/Relay/Wise statements, invoices issued by the LLC, contracts, signed W-8BEN-E forms, Form 1042-S if any, IRS filings and expense receipts.

The AEAT can request supporting documentation at any time. Having an organized system from day one is the difference between an audit that closes quickly and one that drags.
## Why you need a Spanish tax advisor

A US-side LLC well constituted is only half the work. The other half is **integrating it correctly into your Spanish IRPF**. This includes:

- Properly qualifying the income (attribution, royalties, dividends, gains).
- Applying the treaty and the international double-taxation deduction.
- Choosing the imputation method (accrual vs cash).
- Complying with Modelos 720/721 if applicable.
- Documenting deductible expenses so they survive an audit.

A Spanish tax advisor who understands international structures with LLCs is not optional: it's **part of the complete setup**. At Exentax we cover the US side (formation, EIN, banking, IRS and FinCEN compliance, W-8s before each payer) and we coordinate with your Spanish advisor, or we recommend one if you don't have one.

> Every case is individual. DGT positions can evolve and treaty protocols are updated periodically. This guide is informational; it does not substitute for personalized analysis of your case by a qualified professional.
## In short

- The US and Spain have a treaty signed in 1990 and modernized in 2019 that allocates taxing rights and prevents double taxation.
- For a disregarded-entity LLC with a Spanish-resident owner, business profits are taxed **in Spain**, with no US withholding when there's no permanent establishment.
- Dividends, interest and royalties have specific reduced rates.
- The **W-8BEN-E** is the operational tool to activate the treaty with each US payer.
- US withholdings suffered are credited in Spain via the international double-taxation deduction.
- You must keep your **tax-residency certificate** available and file correctly via **Modelo 100**, plus **Modelos 720/721** if applicable.
- The complete setup: **Exentax + Spanish tax advisor**.

If you want to review your case with concrete numbers, **book a free 30-minute consultation** with Exentax and we'll explain exactly how your LLC fits within the US-Spain treaty and how to coordinate it with your advisor in Spain.

To go deeper, also read <a href="/en/blog/us-llc-as-an-alternative-to-being-self-employed-in-spain">US LLC as an alternative to being self-employed in Spain</a> and <a href="/en/blog/w8-ben-and-w8-ben-e-the-complete-guide">Complete guide to W-8BEN and W-8BEN-E</a>.
## Tax compliance in your country: CFC, controlled-foreign rules and income attribution

A US LLC is a fully legal, internationally recognized vehicle. But compliance does not end at incorporation: as an owner who is tax-resident elsewhere, your local tax authority still has the right to tax what the LLC earns. The key is **under which regime**.

### By jurisdiction

- **Spain (LIRPF/LIS).** An operative single-member disregarded LLC (real services, no significant passive income) is generally treated under **income attribution (art. 87 LIRPF)**: the LLC's net profits are attributed to the member in the year they arise and integrated into the general IRPF base. If instead the LLC elects corporation treatment (Form 8832) and is controlled by a Spanish resident with mostly passive income, the **CFC regime (art. 91 LIRPF for individuals, art. 100 LIS for companies)** can apply. The choice is not optional: it depends on economic substance, not on the label.
- **Information returns.** US bank accounts with average or year-end balance >€50,000: **Form 720** (Law 5/2022 after CJEU C-788/19, 27/01/2022, penalties now under the general LGT regime). Related-party transactions and dividend repatriation: **Form 232**. US-custodied crypto: **Form 721**.
- **Spain–US tax treaty.** The treaty (BOE 22/12/1990, Protocol in force 27/11/2019) governs double taxation on dividends, interest and royalties. An LLC without a permanent establishment in Spain does not by itself create a PE for the member, but effective management can if all activity is run from Spanish territory.
- **Mexico, Colombia, Argentina and other LATAM jurisdictions.** Each has its own CFC regime (Mexico: Refipres; Argentina: foreign passive income; Chile: art. 41 G LIR). Common principle: profits retained inside the LLC are deemed received by the member if the entity is treated as transparent or controlled.
Practical rule: an operative LLC with substance, properly declared in your country of residence, is **legitimate tax planning**. An LLC used to hide income, fake non-residence or shift passive income with no economic justification falls within **art. 15 LGT (anti-abuse)** or, worse, **art. 16 LGT (simulation)**. The facts decide, not the paperwork.

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Free consultation, no strings attached</a>
<!-- /exentax:calc-cta-v1 -->

At Exentax we structure the entity to fit the first scenario and document every step so your local return can be defended in case of review.

<!-- exentax:banking-facts-v1 -->
## Banking and tax facts worth clarifying

Fintech and CRS information evolves; here is the current state:

### Notes by provider

- **Mercury** operates with several federally chartered partner banks and **FDIC** coverage via sweep network: mainly **Choice Financial Group** and **Evolve Bank & Trust**, with **Column N.A.** still in some legacy accounts. Mercury is not itself a bank; it is a fintech platform backed by those partner banks. If Mercury closes an account, the balance is typically returned **by paper check mailed to the account holder's registered address**, which can be a serious operational problem for non-residents; keep a secondary account (Relay, Wise Business, etc.) as contingency.
- **Wise** ships two clearly different products: **Wise Personal** and **Wise Business**. For an LLC you must open **Wise Business**, not the personal account. Important CRS nuance: a **Wise Business held by a US LLC sits outside CRS** because the account holder is a US entity and the US is not a CRS participant; the USD side operates via Wise US Inc. (FATCA perimeter, not CRS). In contrast, a **Wise Personal opened by an individual tax-resident in Spain** or another CRS jurisdiction **does trigger CRS reporting** via Wise Europe SA (Belgium) on that individual. Opening Wise for your LLC does not bring you into CRS through the LLC; a separate Wise Personal in your own name as a CRS-resident individual does report.
- **Wallester** (Estonia) is a European financial entity with an EMI/issuing-bank licence. Its European IBAN accounts **are within the Common Reporting Standard (CRS)** and therefore trigger automatic reporting to the tax administration of the holder's country of residence.
- **Payoneer** operates through European entities (Payoneer Europe Ltd, Ireland) that are also **in scope for CRS** for clients resident in participating jurisdictions.
- **Revolut Business**: when paired with a **US LLC**, the usual setup runs through Revolut Payments USA; European IBANs (Lithuanian, BE) **are not issued by default** to a US LLC, they are issued to European clients of the group's European bank. If you are offered a European IBAN, confirm exactly which legal entity it sits with and which regime it reports under.
- **Zero tax**: no LLC structure delivers "zero tax" if you live in a country with CFC/tax transparency or income attribution rules. What you achieve is **no double taxation** and **correct reporting at residence**, not elimination.

<!-- exentax:legal-facts-v1 -->
## Legal & procedural facts

FinCEN and IRS reporting requirements moved recently; the current state is:

- **BOI / Corporate Transparency Act: your LLC is NOT required to file (a competitive advantage).** After **FinCEN's March 2025 interim final rule**, the BOI Report obligation was **narrowed to "foreign reporting companies"** (entities formed OUTSIDE the US and registered to do business in a state). A **US-formed LLC owned by a non-resident does NOT file the BOI Report**: one fewer filing on your calendar, less paperwork, and a cleaner structure than ever. If your LLC was formed before March 2025 and you already filed BOI, keep the acknowledgement. The regulatory status can change again: **we monitor FinCEN.gov on every filing** and, if the obligation comes back, we handle it at no extra cost. Current status verifiable at [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + pro-forma 1120.** For a **Single-Member LLC owned by a non-resident**, the final regulations of Treas. Reg. §1.6038A-1 (in force since 2017) treat the LLC as a corporation for 5472 purposes. Procedure: **pro-forma Form 1120** (header only: name, address, EIN, tax year) with **Form 5472 attached**. It is filed **by certified mail or fax to the IRS Service Center in Ogden, Utah**, **not e-filed via standard MeF**. Due date: **April 15**; extension via **Form 7004** to **October 15**. **Penalty: $25,000 per form per year, plus $25,000 per additional 30 days** of non-filing after IRS notice.
- **Substantive Form 1120.** Only applies if the LLC has filed a check-the-box election to C-Corp (Form 8832): it then pays 21 % federal corporate tax and files a substantive 1120. A standard disregarded LLC **does not file a substantive 1120 and does not pay federal corporate tax**.
- **EIN and notice.** Without an EIN you cannot file 5472 or BOI. The IRS does not warn before imposing penalties; you find out when an EIN is flagged or a later filing is rejected.
## We set it up without you losing a weekend

Thousands of freelancers and entrepreneurs already operate their US LLC fully legally and properly documented. At Exentax we handle the entire process: formation, banking, payment gateways, bookkeeping, IRS filings and compliance in your country of residence. Book a free consultation and we will tell you honestly whether the LLC makes sense for your case, with no absolute promises.<!-- exentax:execution-v2 -->
## How the US-Spain treaty applies to your LLC, clause by clause

The treaty between Spain and the United States signed in 1990 and amended by the Protocol in force since 2019 (BOE 23 October 2019) splits taxing rights between both countries. For an SMLLC in income attribution, four articles really matter. We explain them in order of impact.

- **Article 7 - Business profits.** If the LLC is transparent and does not constitute a US permanent establishment, profits are taxed exclusively in Spain, in your IRPF as business income. This is the logic that makes an SMLLC typically pay zero federal tax with the full weight falling on residency.
- **Article 14 (2019 Protocol) - Independent personal services.** Reinforced after the Protocol: for independent professionals resident in Spain without a US fixed base, fees are taxed exclusively in Spain. Combined with art. 7 it shields the typical consultant or developer setup.
- **Article 23 - Elimination of double taxation.** Lets you credit US tax (federal and state) against Spanish tax, capped at the Spanish liability on the same income. For an SMLLC with zero federal tax, the credit is nil but so is real double taxation.
- **Article 25 (2019 Protocol) - Mutual Agreement Procedure (MAP).** If AEAT and IRS classify the same income divergently, MAP allows resolution through agreement between authorities in roughly 24 months. Useful on divergent assessment; most cases never reach it since DGT doctrine is clear.

### What we are asked the most

**Do I need a Form W-8BEN-E for my LLC?** Yes, whenever a US client asks for non-residency certification. The SMLLC with a non-resident partner certifies as pass-through and the partner attaches a personal W-8BEN. Without this, US payers withhold 30 % by default.

**Does the treaty cover dividends and capital gains?** Yes, with different caps (15 % dividends, 0-21 % interest depending on case, capital gains generally taxed only in residency). For an SMLLC distributing to the partner, the "dividend" is ignored due to transparency and everything is reported as business income under art. 7.

At Exentax we map every flow of your LLC against the applicable treaty article, prepare the W-8 documentation and design the IRPF reporting so the Spanish filing is consistent with US treatment.
<!-- /exentax:execution-v2 -->

## How we work at Exentax

Our team specialises in international tax structures for residents of Spanish-speaking countries operating online businesses. We combine local knowledge of Spain, Andorra and Latin America with operational experience setting up entities in Delaware, Wyoming, Estonia and other jurisdictions. Every case starts with a free consultation in which we evaluate residency, activity and goals, and we honestly tell you whether the proposed structure makes sense or whether a simpler alternative is enough.

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

<!-- exentax:cta-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22When%20someone%20first%20sees%20the%20combo%20US%20LLC%20and%20Spanish%20tax%20resident%2C%20the%20immedi%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->
`;
