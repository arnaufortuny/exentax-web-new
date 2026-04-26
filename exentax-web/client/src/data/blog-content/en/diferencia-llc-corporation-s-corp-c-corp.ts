export default `

When someone says "American company", most people picture an LLC; others, a "corporation". The reality is that the United States has four main vehicles for doing business: **LLC**, **Corporation**, **S-Corporation** and **C-Corporation**. Each one has its own federal and state tax regime, ownership restrictions and use cases. For a non-US founder living in the UK, Ireland, Australia or Canada, not all of them are accessible or convenient. This guide nails down the real difference between the four entities, what fits each profile and why an LLC is still, today, the default choice for freelancers, agencies and digital projects that are not chasing institutional investors.

## LLC: the flexible default option for non-residents

The **LLC (Limited Liability Company)** is a hybrid entity created by US state statutes (every state has its own LLC Act; **Wyoming was the first, in 1977**, with the **Wyoming LLC Act**). Legally it is a limited liability entity that protects members' personal assets from the debts and liabilities of the business. From a tax standpoint, it is **transparent by default**: **Treas. Reg. §301.7701-3 ("check-the-box")** treats a single-member LLC as a **"disregarded entity"** and a multi-member LLC as a **partnership** unless an election to the contrary is made on **Form 8832** (election to be classified as an association taxable as a corporation).

For a non-resident alien (NRA) **without ETBUS** (Effectively Connected Trade or Business in the United States) and **without US-source FDAP income**, a disregarded LLC **does not generate a substantive Form 1040-NR liability** and **pays no US federal income tax**: the basic rule under **IRC §§871 and 882** taxes non-residents only on (a) US-source FDAP income at 30 % withholding (or treaty rate) and (b) income effectively connected with a US trade or business. Without those two elements, the LLC pays **0 % federal**. At state level, **Wyoming, New Mexico, Florida, Texas, South Dakota, Nevada and Washington** have no state corporate income tax, which adds **0 % state** when there is no nexus.

The practical compliance burden that does remain: annual **Form 5472 + Form 1120 pro-forma** (Treas. Reg. §1.6038A-1, in force since 2017) for a single-member LLC owned by a non-resident with any *reportable transaction* with its sole member. Base penalty: **USD 25,000 per form per year** (IRC §6038A(d)) plus **USD 25,000 every 30 additional days** after IRS notification.

## Corporation: by default a C-Corporation

When somebody incorporates an "Inc." or "Corp." under a state's general corporation law (for example, the **Delaware General Corporation Law (DGCL)** or **Nevada Revised Statutes Chapter 78**), it is treated by default as a **C-Corporation**: it pays federal corporate income tax on its profits at **21 % (IRC §11(b), the flat rate introduced by the Tax Cuts and Jobs Act of 2017)**, plus the corresponding state tax (Delaware taxes 8.7 % on income earned in the state, California 8.84 %, Texas 0 % income tax but a franchise/margin tax). When it distributes dividends, shareholders are taxed **a second time** on their personal returns: qualified dividends at 0 % / 15 % / 20 % federal for US persons (IRC §1(h)(11)); for foreign shareholders, FDAP withholding of **30 %** unless reduced by an applicable treaty (the **UK–US treaty (2001/2003)** typically reduces withholding on dividends to **15 % or 5 %**; **Ireland–US (1997)** to **15 %/5 %**; **Australia–US (1982/2003)** to **15 %/5 %/0 %**; **Canada–US (1980/2007)** to **15 %/5 %**, and on interest to **0 %** in many cases). This is the classic double taxation.

A C-Corp is **the de facto requirement** for raising venture capital or going public: institutional investors (VC funds, family offices, AngelList syndicates, YC) almost always demand a **Delaware C-Corp** because they know its case law (Court of Chancery), it can issue multiple share classes (preferred with liquidation preferences, Series A/B/C), it supports stock options for employees (409A plans) and it can run public offerings. There is no cap on the number of shareholders and no nationality restrictions.

## S-Corporation: the option a non-resident cannot use

An **S-Corporation** is not a separate legal form: it is a **federal tax election** defined in **Subchapter S of the Internal Revenue Code (IRC §§1361-1378)** that a corporation or LLC can request via **Form 2553**. Once the S-election is granted, the entity **does not pay federal corporate income tax**; profits flow through to shareholders and are reported on their personal returns (Schedule K-1). Unlike an LLC, shareholders can take a **reasonable salary** (W-2) and receive the rest as **distributions not subject to self-employment tax** (15.3 %), which reduces FICA exposure for US residents. This is the main reason American owner-operators choose S-Corp.

The problem for non-residents: **IRC §1361(b)** imposes strict requirements. Maximum **100 shareholders**, all of whom must be **US citizens or US tax residents** (no non-resident aliens, no corporations, no LLCs as shareholders), a single class of stock (with the only exception being differences in voting rights). Because of these requirements, an **S-Corp is completely off the table for a non-resident founder**. We mention it so that, when you read "S-Corp" in US forums or in tax planning books by Robert Kiyosaki or Mark Kohler, you understand it almost never applies to your case.

## When a C-Corp does make sense for a non-resident

A C-Corp can pay off for a non-resident in specific scenarios:

- **You will raise venture capital**: VC funds require a Delaware C-Corp with a clean cap table.
- **You plan to IPO** or be acquired by a listed company (M&A typically requires a corporation).
- **You will grant stock options to employees** in the US (ISO/NSO plans require a corporation).
- **Your business has ETBUS** (US office, employees, owned servers, warehouse) and would therefore pay federal tax under IRC §882 anyway: the tax differential vs. an LLC disappears and the C-Corp brings stronger governance.
- **You want to use QSBS (Qualified Small Business Stock)** under **IRC §1202**: if you hold stock in a qualifying C-Corp (≤ USD 50 M in assets at issuance, operating business, not professional services) for **5 years**, you can exclude **the greater of USD 10 M or 10x basis** in capital gains on sale. It is one of the strongest tax incentives in the US system for startup founders.

Double taxation is mitigated through planning: founder salaries (deductible to the corp, taxed as ordinary income to the individual), retaining profits to reinvest instead of distributing dividends, deferred compensation plans and effective use of QSBS where it fits.

## Effective tax comparison table

For a profit of **USD 100,000** earned by a non-resident without ETBUS, no US-source income, tax resident in the United Kingdom:

| Vehicle | US Federal | US State | Dividend withholding | Total US | UK taxation |
|---|---|---|---|---|---|
| **Disregarded LLC** (WY/NM) | 0 USD | 0 USD | N/A | **0 USD** | Profit treated as self-employment / partnership income, taxed under HMRC rules (Income Tax + Class 4 NIC) |
| **Delaware C-Corp** without distribution | 21,000 USD | 0 USD if no DE nexus | 0 USD | **21,000 USD** | No immediate UK tax if not distributed (subject to UK CFC rules under TIOPA 2010 Part 9A) |
| **Delaware C-Corp** with full distribution | 21,000 USD | 0 USD | 11,850 USD (15 % UK-US treaty) | **32,850 USD** | UK Income Tax on gross dividend with credit for tax suffered |
| **S-Corp** | Not available to non-residents (IRC §1361(b)) |

The gap is significant: for operational profiles without institutional capital ambitions, **the LLC is clearly more efficient**. The C-Corp only wins when the strategic plan requires venture capital, an IPO or QSBS optimisation.

## US LLC vs UK alternatives: when does each fit?

If you are based in the UK, your local options are:

- **Sole trader**: registration with HMRC, no separate legal entity, unlimited personal liability. Tax: Income Tax (20 % basic / 40 % higher / 45 % additional, with the **Personal Allowance of £12,570** tapered between £100,000 and £125,140 in 2025/26) plus **Class 2 NIC at £3.45/week** (effectively abolished from April 2024 for most profits, retained voluntarily) and **Class 4 NIC at 6 % between £12,570 and £50,270 and 2 % above** (rates from April 2024). VAT registration mandatory above **£90,000 turnover** (threshold from 1 April 2024).
- **Limited company (Ltd)**: separate legal entity, limited liability. **Corporation Tax 25 %** on profits above £250,000, **19 % small profits rate** below £50,000, marginal relief in between (Finance Act 2021, in force from April 2023). Dividends to shareholders taxed at 8.75 % / 33.75 % / 39.35 % with **£500 dividend allowance** (2024/25).
- **Limited Liability Partnership (LLP)**: pass-through for tax, members taxed personally; popular among professional services.

A US LLC owned from the UK is treated by HMRC as **opaque (a body corporate)** in most cases, following the *Anson v HMRC* (2015 UKSC 44) precedent and HMRC's response confirming the default treatment is opaque. This means HMRC taxes distributions from the LLC as dividends, with no automatic look-through. The interaction with the UK-US double tax treaty (in force since 2003) requires careful planning to avoid double taxation. **A US LLC is rarely the cheapest option for a UK resident** unless combined with a non-dom regime, statutory residence test planning or genuine relocation.

## What to choose by profile

- **Freelancer, digital agency, consultant, info-product creator, small ecommerce, bootstrapped SaaS, prop trader**: **LLC**, no doubt. Wyoming or New Mexico for cost; Delaware if you expect to grow significantly and might convert later.
- **Startup with seed or Series A planned**: **Delaware C-Corp** from day one, accepting double taxation as the cost of accessing capital. Incorporating directly avoids LLC→C-Corp conversion, which is a taxable event triggering built-in gains.
- **Physical US business with employees and local operations**: probably C-Corp if you expect to scale; LLC if you operate as a small business with no institutional capital plans.
- **Regulated professional (lawyer, doctor, architect)**: many states require a **Professional LLC (PLLC)** or **Professional Corporation (PC)** with state licensing.

If you already have an LLC and need to convert it into a C-Corp, this is possible via **statutory conversion** (DE, NV, WY) or via **check-the-box election (Form 8832)** which reclassifies the LLC as a corporation for tax purposes. Both require careful planning because, under **IRC §351**, incorporation can be tax-free if the requirements are met (80 % control post-incorporation, exclusively assets in exchange for stock), but any deviation triggers immediate taxable events.

## Applicable regulatory framework

- **Internal Revenue Code (Title 26 USC)**: §11(b) C-Corp 21 %; §§1361-1378 S-Corp regime; §1202 QSBS; §§871, 881, 882, 1441 taxation of non-residents; §6038A Form 5472; §351 tax-free incorporations.
- **Treasury Regulations**: §301.7701-3 check-the-box; §1.6038A-1/2 Form 5472 disregarded entities.
- **IRS Publications**: <a href="https://www.irs.gov/businesses/small-businesses-self-employed/business-structures">Business Structures</a>; Pub. 519 (US Tax Guide for Aliens); Pub. 542 (Corporations).
- **State framework**: Delaware General Corporation Law; Wyoming Business Corporation Act; New Mexico Limited Liability Company Act; Nevada Revised Statutes Chapter 78.
- **UK framework**: Companies Act 2006; Corporation Tax Act 2009/2010; Income Tax Act 2007; HMRC International Manual INTM180000 (US LLC classification); Anson v HMRC (2015 UKSC 44).

For non-residents, the LLC remains the most common choice because it combines limited liability, clean federal taxation (0 % federal without ETBUS) and low administrative burden. The C-Corp is reserved for those seeking institutional capital or a public listing.

## Common mistakes when choosing the vehicle

- **Thinking S-Corp is "an upgraded LLC"**: it is not. It is a federal tax election exclusive to US persons. If you are a non-resident, do not consider it.
- **Setting up a C-Corp "because it sounds more serious"** without a real capital need: you pay 21 % federal unnecessarily and complicate compliance with no upside.
- **Converting LLC to C-Corp without advice**: if IRC §351 requirements are not met, conversion triggers immediate taxable events on the fair market value of the LLC.
- **Choosing Delaware "because it is famous"** when WY/NM cost five times less in annual maintenance and provide the same tax shield for a non-resident freelancer.

The right choice depends on your 3-5 year plan, not on whichever forum is trending today.

<!-- exentax:calc-cta-v1 -->
> <a href="/en/services">Find out whether an LLC fits your case</a>
<!-- /exentax:calc-cta-v1 -->

At Exentax we review your case with real numbers and tell you whether an LLC, a C-Corp or no US structure makes sense. <a href="/book">Book a free 30-minute consultation</a> and walk away with a clear plan.

<!-- exentax:execution-v2 -->
## How we solve this with the Exentax method

What we see every week is the same pattern: doubt stays as scattered ideas, the decision gets postponed and, when the tax year closes, you pay more than necessary or take risks that do not pay off. The problem is rarely the law; it is the absence of a written plan with real numbers, signed by someone who understands your case end to end.

**What people get wrong**
- Copying structures seen on social media without modelling their own case with revenue, residence and clients in hand.
- Mixing personal and business money, losing the documentary trail any audit demands.
- Trusting operations to providers who only file forms, with no annual strategy or total-cost view.

**What actually works**
- Modelling your situation in the <strong>Exentax calculator</strong> before moving a single piece, to see total annual cost rather than today's bill.
- Separating cash flows from day one, with distinct accounts and a living receipt checklist.
- Working with an advisor who looks at the pieces together: structure, banking, compliance and residence — not each one in isolation.

If you want to go from doubt to plan, book 30 minutes with Exentax and leave the call with the numbers closed and the operational calendar set.
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
<p data-testid="cta-action-row">Need to talk now? Send us a <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I%20come%20from%20the%20article%20%22Difference%20between%20LLC%2C%20Corporation%2C%20S-Corp%20and%20C-Corp%22%20and%20I%20want%20to%20speak%20with%20an%20advisor.">WhatsApp message</a> and we will reply today.</p>

If your plan is to set up an LLC in Delaware, see our service page <a href="/en/services/llc-delaware">LLC in Delaware</a> with costs, timelines and concrete next steps.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
We compare New Mexico, Wyoming, Delaware and Florida against your real case — no trendy-state pitch. <a href="/en/services/llc-delaware">Compare my case with an advisor</a>.
<!-- /exentax:cta-v1 -->
`;
