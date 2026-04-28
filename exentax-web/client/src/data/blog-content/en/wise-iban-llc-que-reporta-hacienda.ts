export default `When the conversation turns to Wise, foreign IBANs and US LLCs, two equally wrong narratives keep coming back: on one side, "Wise reports nothing and the tax authority will never find out", on the other, the fear that every single tap of the card is being live-streamed to the tax office. The reality sits in a much more nuanced place, and it is worth understanding before you wire your structure together, especially if you combine a <a href="/en/blog/llc-united-states-complete-guide-non-residents-2026">US LLC</a> with a Wise account and the cards that come with it.

This article focuses on what actually happens: what type of information leaves Wise toward your home tax authority, what does not, and where the line sits between legitimate use and tax exposure. If you want the deep technical analysis of the CRS flow from Wise Business through Belgium, we cover it in <a href="/en/blog/wise-business-and-crs-what-it-reports-to-your-tax-authority">Wise Business and CRS: what it reports to your tax authority</a>.

## How Wise actually works under the hood

Wise is not a traditional bank, not an opaque payment processor, and not an offshore account. It is a group of regulated entities operating in different jurisdictions:

- **Wise Europe SA**, based in Belgium, authorised as an Electronic Money Institution by the National Bank of Belgium. This entity serves the bulk of European clients and most LLCs with European representation.
- **Wise Payments Limited**, in the UK, regulated by the FCA. Still services UK and some legacy clients.
- **Wise US Inc.**, regulated in the US as a Money Services Business. The entity that serves clients with US residence and US entities.
- Subsidiaries in Singapore, Australia, India and other jurisdictions, each with their own local regulator.

When you open a Wise account (personal or Business) you receive "local bank details" in several currencies: a **Belgian (BE) IBAN issued by Wise Europe SA** for EUR (some long-standing European personal customers may still hold legacy Lithuanian IBANs; for a **US LLC opened today through Wise Business**, the EUR IBAN always comes from the Belgian entity, never from Lithuania), a **sort code and account number in GBP**, a **routing number and account number in USD**, and equivalents in AUD, NZD, SGD, etc. Those IBANs do not turn Wise into a regular Belgian or Lithuanian bank: they are segregated client accounts inside the European EMI scheme.

What matters for tax purposes: even though you see a Belgian or Lithuanian IBAN, **the entity holding your funds and reporting on your account is Wise Europe SA (Belgium)** in the vast majority of European cases. That is the entity that triggers CRS flows.
## What CRS is and when it applies

The **Common Reporting Standard (CRS)** is the <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a> framework that requires financial institutions in 100+ jurisdictions to identify their non-resident clients and report annually their balances and income to the local tax authority, which in turn exchanges the data with the tax authority of the holder's country of residence. In the EU it was transposed via **Directive 2011/16/EU (DAC2)**, and in Belgium via the law of 16 December 2015 on automatic exchange of financial information.

The relevant points for Wise:

- **Wise Europe SA (Belgium)** is fully subject to CRS. It reports to the Service Public Fédéral Finances in Belgium, which forwards the data to the holder's country of residence.
- **Wise Payments Limited (UK)** is also subject to CRS, although the formal channel runs through HMRC.
- **Wise US Inc.** is not subject to CRS, because the US has not adhered to it (it uses its own asymmetric framework, FATCA, which mostly affects US persons).

In other words: if your Wise account sits under Wise Europe SA, assume the year-end balance and the holder data reach your home tax authority. If you sit under Wise US Inc., CRS does not apply, but that account is only available to actual US-resident clients and US entities, not to a non-resident running an LLC from Europe or LATAM.
## What Wise actually reports

The data block travelling through CRS is very specific and does not include, contrary to common fears, "every single transaction in real time":

| Block | What it includes |
| --- | --- |
| Individual holder | Name, address, declared tax residence, taxpayer identification number (TIN), date and place of birth |
| Entity holder | Legal name, address, EIN/Tax ID of the LLC, CRS classification (Active NFE, Passive NFE, Investment Entity) |
| Beneficial owners | If the entity is classified as Passive NFE, data on the controlling persons (25% direct or indirect threshold, or effective control) |
| Account | IBAN(s) per currency, internal Wise account number |
| Balance | Aggregate balance as of 31 December, normally reported in EUR converted at year-end |
| Income | Interest if any (Wise Interest), gross dividends and gross redemption proceeds in products like Wise Assets |

What is **not** reported through CRS:

- The detail of every single operational movement during the year.
- The names and details of your clients.
- Your invoices, contracts or margins.
- Specific purchases made with the Wise card.

That does not mean such information is invisible: if your tax authority opens a procedure, it can request that data directly from you, and in advanced investigations it can also request specific information from Wise through cooperation channels. What it does mean is that the annual automatic flow is not a full data dump: it is balance + income + identity.
## Visa and Mastercard cards: the important nuance

There is a widespread idea that "since the cards run on Visa or Mastercard, the networks already report everything to the tax authorities". A few clarifications:

- Visa and Mastercard are **payment processing networks**, not financial institutions holding your account. Their role is to settle transactions between the issuing bank and the acquiring bank.
- **Visa and Mastercard do not report your card spending directly to any tax authority** as a periodic automatic feed. That is not their role.
- The party with reporting obligations is **the card issuer** (Wise Europe SA, in this case) and the **acquiring merchant** within its own accounting.
- Within national systems, certain card-related reporting obligations exist for domestic financial institutions (for example, in Spain, the AEAT receives information through forms 196, 171 and similar), but that framework does not apply with the same intensity to a foreign EMI issuing the card.

If you want the full map of who reports what from your card spend, country by country (Modelo 196, 171, DAS2, Modelo 38), we cover it in <a href="/en/blog/visa-mastercard-reporting-what-tax-authorities-see-from-card">Visa and Mastercard: what tax authorities actually see from your card spend</a>.

The reasonable conclusion: paying for personal expenses with the Wise card as a Spanish or LATAM tax resident does not trigger an automatic real-time report of every transaction to your home tax authority. What it does trigger, alongside the rest of the account, is the annual CRS report of the closing balance and income. And, more importantly, it leaves a perfectly traceable footprint if the tax authority later asks where the money came from.
## The typical case: non-resident LLC with Wise Business

This is where most myths circulate. An entrepreneur with tax residence in Spain (or in LATAM) sets up a <a href="/en/blog/llc-united-states-complete-guide-non-residents-2026">US LLC</a>, opens Mercury as the primary account and Wise Business as a secondary multi-currency account. When completing the Wise CRS self-certification for the LLC, they have to indicate:

- Tax residence of the LLC: US.
- CRS classification: most single-member service LLCs meet the requirements for **Active NFE** (more than 50% of income is operational), but Wise tends to apply conservative criteria and, faced with weak documentation, classifies the entity as **Passive NFE**.
- Controlling persons: the data of the beneficial owner, including their tax residence (yours, in Spain, Mexico, Colombia or wherever it is).

The practical consequence: even though the LLC is American and the US is not in CRS, the **fact that you are the controlling person, with your real tax residence, reaches your tax authority from Belgium**. That is the piece many people overlook.

This does not turn the LLC into something "illegal": a properly structured and properly declared LLC is a perfectly legitimate tool. What it invalidates is the idea that placing Wise Business under the LLC somehow blocks the flow of information toward your country of residence.
## What your tax authority can actually see (and what it cannot)

Translated into the practice of a non-US tax resident with LLC + Wise:

What your tax authority can see automatically and recurrently:

- That a Wise account exists, linked to the LLC and to you as controlling person.
- The closing balance as of 31 December each year.
- Gross income generated (Wise Interest, Wise Assets, etc.).
- Your name, tax ID and address as beneficial owner.

What your tax authority does not receive automatically:

- Each one of the year's movements.
- The detail of your clients and invoices.
- Specific card transactions.
- The internal P&L of the LLC.

What happens when that data is cross-checked with your domestic tax filings:

- If your domestic foreign-asset declaration (in Spain, Modelo 720; the equivalent in other countries) does not include the Wise account when it should, the inconsistency is obvious.
- If your personal income tax return ignores the income attributable to the LLC (in scenarios where your country treats the LLC as transparent, as we analyse in <a href="/en/blog/crs-for-residents-in-spain-and-latam-real-implications">CRS for residents in Spain and LATAM</a>), another gap appears.
- If the closing balances do not match the income you declare, the tax authority has a natural lever to open an inspection.

The problem is rarely the reporting itself, but the **documentary inconsistency** between what you declare at home, what flows out of Belgium through CRS, and what your real operations look like.
## Common mistakes we see every week

1. **"Wise reports nothing."** False. Wise Europe SA reports through CRS from Belgium.
2. **"If the account is in the LLC's name, they will not report me."** False for Passive NFE: controlling persons are reported. And most single-member LLCs end up classified that way.
3. **"Since my average balance is low, I am out of CRS."** The reported balance is the closing one, regardless of fluctuations during the year, and there is no minimum threshold for new accounts.
4. **"I have a Wise USD account under Wise US Inc., it does not get reported."** True for CRS purposes, but that setup is only consistent for genuine US residents and entities; using it from Europe with a non-resident-owned LLC creates exposure on a different front (residence, place of management, Wise's own due diligence).
5. **"I pay for everything with the Wise card, so there is no trail."** There is a trail: in Wise, in the merchant and in the closing balance that does get reported. And it leaves a perfectly reconstructable footprint if a tax procedure is opened.
6. **"The LLC automatically protects me from foreign-asset reporting."** It does not: if you are tax resident in Spain (or in many other countries) and you are the beneficial owner of foreign accounts, the obligation kicks in once aggregate thresholds are crossed.
## Why this matters for your structure

The reasonable conclusion is not "Wise is bad" or "the LLC is dangerous". The conclusion is that **your structure only works if the pieces are coherent with each other**: your tax residence, the entity holding your account, the CRS classification of your LLC, your domestic informational filings, your personal income tax return and your client contracts. When one of those pieces does not fit, problems do not appear the day you move money. They appear three or four years later in the form of a tax notice.

At Exentax we work exactly on that frontier: structuring the <a href="/en/blog/llc-united-states-complete-guide-non-residents-2026">US LLC</a>, choosing <a href="/en/blog/traditional-banks-vs-fintech-for-your-llc-where-to-open-your">which bank or fintech</a> makes sense as primary and which as secondary, anticipating what gets reported via <a href="/en/blog/crs-for-residents-in-spain-and-latam-real-implications">CRS</a> back to your home tax authority, and engineering the whole so that the Wise piece (or <a href="/en/blog/revolut-business-and-crs-what-it-reports-to-your-tax">Revolut Business</a>, or any other) fits without surprises. We expand on this in <a href="/en/blog/designing-a-solid-international-tax-structure-step-by-step">Designing a solid international tax structure</a>.

<!-- exentax:lote26-native-v1:wise-iban-llc-que-reporta-hacienda-en -->
## How to read the Wise IBAN reporting question as a stable mapping rather than as a recurring uncertainty

The question of what a Wise IBAN held by an LLC reports to the Spanish tax administration reads more calmly when it's treated as a stable mapping between the type of account, the holder of the account and the country whose authority feeds the exchange channel, rather than as a recurring uncertainty. What's reported and to whom doesn't change month to month.

A short note in the LLC folder that records the type of account opened with Wise, the legal holder, the country of the IBAN and the exchange channel that applies to it makes the same mapping reviewable in a few minutes, instead of being rebuilt from memory each time the question comes up.

The same note also makes it much easier to align what's declared by the Spanish-resident member with what arrives through the exchange of information channel.
<!-- /exentax:lote26-native-v1:wise-iban-llc-que-reporta-hacienda-en -->

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Free consultation, no strings attached</a>
<!-- /exentax:calc-cta-v1 -->

If you are not sure how Wise fits into your structure, or whether you are exposed to a data cross-check you do not control, we are happy to review it with you and tell you what to fix before the tax authority sets the pace.
### In summary

Wise is an excellent multi-currency fintech, fully regulated and fully wired into the automatic exchange of information when it operates under Wise Europe SA. It is not a shortcut for hiding money, but it is also not a camera streaming every movement live to the tax authority. What travels through CRS is balance, income and the identity of the holder and the beneficial owner. What does not travel by default is the operational detail, which remains perfectly available if the tax authority requests it.
The difference between having problems or not having them is not in using Wise, but in how Wise fits inside a structure that is coherent with your LLC, your residence and your filings. That is the conversation worth having upfront, not afterwards.
## Tax compliance in your country: CFC, controlled-foreign rules and income attribution

A US LLC is a fully legal, internationally recognized vehicle. But compliance does not end at incorporation: as an owner who is tax-resident elsewhere, your local tax authority still has the right to tax what the LLC earns. The key is **under which regime**.

### By jurisdiction

- **Spain (LIRPF/LIS).** An operative single-member disregarded LLC (real services, no significant passive income) is generally treated under **income attribution (art. 87 LIRPF)**: the LLC's net profits are attributed to the member in the year they arise and integrated into the general IRPF base. If instead the LLC elects corporation treatment (Form 8832) and is controlled by a Spanish resident with mostly passive income, the **CFC regime (art. 91 LIRPF for individuals, art. 100 LIS for companies)** can apply. The choice is not optional: it depends on economic substance, not on the label.
- **Information returns.** US bank accounts with average or year-end balance >€50,000: **Form 720** (Law 5/2022 after CJEU C-788/19, 27/01/2022, penalties now under the general LGT regime). Related-party transactions and dividend repatriation: **Form 232**. US-custodied crypto: **Form 721**.
- **Spain–US tax treaty.** The treaty (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol in force 27/11/2019) governs double taxation on dividends, interest and royalties. An LLC without a permanent establishment in Spain does not by itself create a PE for the member, but effective management can if all activity is run from Spanish territory.
- **Mexico, Colombia, Argentina and other LATAM jurisdictions.** Each has its own CFC regime (Mexico: Refipres; Argentina: foreign passive income; Chile: art. 41 G LIR). Common principle: profits retained inside the LLC are deemed received by the member if the entity is treated as transparent or controlled.

Practical rule: an operative LLC with substance, properly declared in your country of residence, is **legitimate tax planning**. An LLC used to hide income, fake non-residence or shift passive income with no economic justification falls within **art. 15 LGT (anti-abuse)** or, worse, **art. 16 LGT (simulation)**. The facts decide, not the paperwork.

At Exentax we structure the entity to fit the first scenario and document every step so your local return can be defended in case of review.

<!-- exentax:legal-refs-v1 -->
## Legal and regulatory references

This article relies on rules currently in force. Main sources for verification:

- **United States.** Treas. Reg. §301.7701-3 (entity classification / *check-the-box*); IRC §882 (tax on foreign income effectively connected with a US trade or business); IRC §871 (FDAP and withholding on non-residents); IRC §6038A and Treas. Reg. §1.6038A-2 (Form 5472 for *25% foreign-owned* and *foreign-owned disregarded entities*); IRC §7701(b) (tax residency, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report to <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Spain.** Law 35/2006 (LIRPF), arts. 8, 9 (residency), 87 (income attribution), 91 (CFC for individuals); Law 27/2014 (LIS), art. 100 (CFC for companies); Law 58/2003 (LGT), arts. 15 (anti-abuse) and 16 (simulation); Law 5/2022 (Form 720 penalty regime after CJEU C-788/19 of 27/01/2022); RD 1065/2007 (Forms 232 and 720); Order HFP/887/2023 (Form 721 crypto).
- **Spain–US treaty.** BOE of 22/12/1990 (original DTT); Protocol in force since 27/11/2019 (passive income, *limitation on benefits*).
- **EU / OECD.** Directive (EU) 2011/16, amended by DAC6 (cross-border arrangements), DAC7 (Directive (EU) 2021/514, digital platforms) and DAC8 (crypto-assets); Directive (EU) 2016/1164 (ATAD: CFC, exit tax, hybrid mismatches); OECD Common Reporting Standard (CRS).
- **International framework.** OECD Model Convention, art. 5 (permanent establishment) and Commentaries; BEPS Action 5 (economic substance); FATF Recommendation 24 (beneficial ownership).

Applying any of these rules to your specific case depends on your tax residency, the LLC's activity and the documentation you keep. This content is informational and does not replace personalized professional advice.<!-- exentax:execution-v2 -->
## The Belgian Wise IBAN for your LLC: what it is, what it reports and why the tax authority sees it

When you activate the EUR sub-account of Wise Business for your LLC, you get a Belgian BE IBAN (Wise Europe SA is based in Brussels). Operationally excellent: you receive SEPA payments from EU clients like any European bank. Fiscally, that IBAN is under Belgian CRS regime and via automatic exchange reaches your tax authority. Worth understanding exactly how it looks from the other side to declare correctly.

- **Nature of Wise's Belgian BE IBAN.** Wise Europe SA is credit institution authorised by the National Bank of Belgium. The BE IBAN assigned to your LLC is legally a Belgian account, not a US account, even though the holder is your US LLC. For CRS, Belgium reports this account to the declared UBO's tax residence per KYC.
- **Data transmitted annually.** Holder LLC identification (name, EIN, registered address), UBO identification (name, address, declared tax residence, country tax ID), 31 December balance of BE IBAN, total annual gross movements, and account ID (full BE IBAN). NO individual transactions.
- **Cross-check with residence declaration.** Spain: Form 720 requires declaring foreign accounts if sum >€50k on 31/12 or last-quarter average. Your Wise BE IBAN counts as LLC's foreign account and, by attribution (disregarded), is indirectly yours. If tax office receives via CRS €80k there and you did not file 720, imputation procedure starts. Typical sanction: 50% of undeclared balance.
- **Difference vs Wise USD sub-account.** Wise USD sub-account (own ACH routing) is operated by Wise USD Inc. (US, FinCEN-registered) and reports via FATCA-IGA to UBO residence, not via CRS. Latency and channel different but fiscal result equivalent: your tax office sees it. Operational difference: EUR account collects local SEPA, USD collects ACH/wire US.

### How to declare correctly in Spain

Form 720 (annual, by 31 March): BE IBAN identification, issuing bank (Wise Europe SA Brussels), 31/12 and last-quarter average balance. Form 100 (IRPF): if LLC is disregarded, LLC result is attributed in the year (economic activity income if active, capital income if passive). IBAN itself generates no income; LLC activity does.

### What we are asked the most

**If BE IBAN is in LLC name but declared UBO at KYC is another, does it reach declared UBO's tax authority?** Yes. CRS reports to real UBO tax residence per KYC. If you declared non-real residence, false declaration and Wise can close on detecting inconsistency.

**Can I have Wise Business without activating EUR sub-account to avoid BE IBAN?** Technically yes, leaving only USD active. Operationally you lose Wise's main advantage. USD account reports anyway via FATCA, not an opacity path.

At Exentax we structure Wise Business per operational need, correctly declare at residence (720, 3916, RW), and resolve CRS-derived cross-checks - so the BE IBAN is operational advantage, not procedure source.
<!-- /exentax:execution-v2 -->

## We set it up without you losing a weekend

Thousands of freelancers and entrepreneurs already operate their US LLC fully legally and properly documented. At Exentax we handle the entire process: formation, banking, payment gateways, bookkeeping, <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> filings and compliance in your country of residence. Book a free consultation and we will tell you honestly whether the LLC makes sense for your case, with no absolute promises.

<!-- exentax:cross-refs-v1 -->
## On the same topic

- [Wise, banks and your LLC: the complete banking stack nobody explains](/en/blog/wise-banks-and-your-llc-the-complete-banking-stack-nobody)
- [US bank accounts: what gets reported and how to organise your LLC](/en/blog/do-us-bank-accounts-report-to-your-home-tax-authority-the)
- [DAC8 and crypto: automatic tax reporting of crypto-assets in 2026](/en/blog/dac8-and-cryptocurrencies-the-automatic-tax-reporting-of)
<!-- /exentax:cross-refs-v1 -->

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
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22When%20the%20conversation%20turns%20to%20Wise%2C%20foreign%20IBANs%20and%20US%20LLCs%2C%20two%20equally%20w%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.

<!-- exentax:conv-fill-v1 -->
Or call us directly at <a href="tel:+34614916910">+34 614 916 910</a> if you'd rather talk.

For state-specific details, see our <a href="/en/services/llc-wyoming">Wyoming LLC service page</a> with closed costs and timelines.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->`;
