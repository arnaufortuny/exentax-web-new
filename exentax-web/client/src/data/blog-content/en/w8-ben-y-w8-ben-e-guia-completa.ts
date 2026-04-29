export default `If you or your LLC receive money from the United States (Stripe, PayPal, affiliate platforms, AdSense, dividends, royalties, brokers...), you may be asked for a **W-8BEN** or a **W-8BEN-E**. Not every platform requires it: business banking like Mercury, Relay or Wise will only ask for it if a specific compliance check requires it, while brokers like Interactive Brokers require it from day one. Where it is required and you don't fill it in (or fill it in wrong), the result is always the same: the US payer applies a **30% withholding** to whatever they owe you, "just in case". A 30% that is then very hard to recover.

This is the complete English guide, no unnecessary jargon but rigorous. You'll understand what these forms are, how they differ, who must file each one, where, how to fill them step by step and which mistakes can hit your wallet.

## What W-8 forms are and why they exist

The **W-8 series** are <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> documents through which a non-US person or entity declares to the payer that they are **not a US tax resident** and, when applicable, that they **claim a tax-treaty benefit** to reduce or eliminate the default withholding.

The general US rule is that any US-source payment to a foreign person or entity is subject to a **30% withholding** unless the recipient proves otherwise. That proof is delivered, precisely, with a W-8.

The most used ones are two:

- **W-8BEN:** for **non-US individuals** (a Spanish, Argentine, German person… receiving US-source income).
- **W-8BEN-E:** for **non-US entities** (your LLC, your Spanish SL, your German GmbH…).

Other forms exist (W-8ECI, W-8IMY, W-8EXP) for more specific cases that we leave outside this guide.
### Key difference between W-8BEN and W-8BEN-E

| | W-8BEN | W-8BEN-E |
|--|--------|----------|
| Who signs | Non-US individual | Non-US entity (your LLC, SL, etc.) |
| Key data | Name, country, address, DOB, foreign TIN | Legal name, country of formation, EIN/GIIN, entity type, FATCA status |
| Pages | 1 | 8 (you only fill 2-3) |
| Treaty | Yes, Part II | Yes, Part III |
| Validity | 3 years | 3 years |

A **non-resident-owned Single-Member LLC** is an interesting case: even if the IRS treats it as a Disregarded Entity, **the form usually filed is the W-8BEN-E** in the LLC's name, not the W-8BEN of the owner. Some platforms (especially Stripe) handle the logic internally and ask for data from one or the other depending on how the account is set up.
### What they're for in practice

To **avoid the 30% withholding** on US-source payments. The treaty between **the US and Spain** (and equivalents with many other countries) reduces that withholding to:

- **0%** on most **business profits** (services rendered from outside the US without a permanent establishment).
- **15%** on **dividends** of US companies (10% in qualifying participations).
- **0%** on **interest** in general.
- **0-10%** on **royalties** depending on type.

Without a signed W-8 the payer withholds 30% on everything and sends it to the IRS. With a properly completed W-8 you can receive your payments in full (most common case for services) or with the reduced treaty rate.
### Who must file them

The form is filed by **the recipient of the money**, not the payer. That means:

- You as an **individual** if you receive US-source income directly (e.g. you're an independent advisor and a US client pays you via Wise, or a broker credits dividends to your personal name): **W-8BEN**.
- Your **LLC** (or your Spanish, German, Mexican company...) if payments go to the entity's account: **W-8BEN-E**.
### When to file them

- When **opening any account** at a US bank, fintech or broker.
- When **registering your business** on a payment processor (Stripe, PayPal Business, Square...).
- When a **US client** asks for it before paying you for the first time.
- At **renewal** every 3 years (or sooner if your data changes: address, country of residence, etc.).
## Where they go

Unlike other IRS forms, **W-8 is not sent to the IRS**. It is given to the **payer** (bank, broker, platform, client) who keeps it on file. If the IRS audits the payer, they justify with your W-8 why they didn't apply the 30% withholding or why they applied the treaty rate.

The most common platforms have W-8 flows built into onboarding:

- **Stripe** (US and Stripe Atlas): embedded W-8BEN-E during account creation.
- **PayPal Business**: requested when verifying the business account.
- **Mercury, Relay, Slash, Wise Business**: by default they do **not** require a W-8 to operate. They only request it if a specific compliance check asks for it; if the platform does not request it, you don't need to sign one.
- **Interactive Brokers, Tradovate, Charles Schwab**: requested when opening as a non-resident client.
- **AdSense, YouTube, Twitch, Amazon KDP, App Store Connect**: each has its own W-8 wizard.
## How to fill a W-8BEN step by step (individual)

Structure: a single page, three parts.

**Part I, Identification of the beneficial owner:**

1. **Name of individual:** your full name as it appears on your passport or national ID.
2. **Country of citizenship:** your nationality (Spain, Mexico, Argentina, Germany…).
3. **Permanent residence address:** the address of your real tax residence, not a PO Box and not a US address.
4. **Mailing address:** only if different from above.
5. **US TIN (SSN/ITIN):** only if you have one. Most non-residents leave it blank.
6. **Foreign tax identifying number:** your home country's tax ID (NIF/NIE/CURP/CUIT…).
7. **Reference number:** rarely used; leave blank unless the payer asks for it.
8. **Date of birth:** MM-DD-YYYY format.

**Part II, Treaty:**

9. State the country with which you have a treaty: "Spain" if you're a Spanish tax resident.
10. Special detail: only filled if claiming a specific reduced rate (royalties, scholarships, etc.). For professional services rendered from outside the US, normally not filled.

**Part III, Certification:**

Sign, date and print name. You're declaring under penalty of perjury that the data is true. Lying here gets you in serious trouble with two tax authorities at once. This is where Exentax steps in: we file the form, archive the receipt and, if the authority asks, your answer is already on the desk.
## How to fill a W-8BEN-E step by step (your LLC)

It is longer (8 pages) but you only fill the parts that apply. For a **non-resident-owned Single-Member LLC**, typically:

**Part I, Identification of the entity:**

1. **Name of organization:** the exact legal name of your LLC.
2. **Country of incorporation:** "United States".
3. **Disregarded entity name:** leave blank (the LLC itself is the disregarded entity; there isn't another inside).
4. **Chapter 3 status:** mark **"Corporation"** if the LLC has elected as such; in most non-resident Single-Member cases the practical option is to identify the entity and complete **Part III** for the treaty. In practice, many platforms tell you which box to mark; if in doubt, mark **"Corporation"** because that's the option payers understand best when the LLC has its own EIN.
5. **Chapter 4 status (FATCA):** mark **"Active NFFE"** (Active Non-Financial Foreign Entity) if your LLC bills services or sells products. If it's a passive investment vehicle, it would be "Passive NFFE".
6. **Permanent residence address:** the LLC's registered US address.
7. **Mailing address:** optional.
8. **US TIN (EIN):** your LLC's EIN.
9. **GIIN:** leave blank unless your LLC is a registered FATCA financial institution (not the typical case).
10. **Foreign TIN:** the home-country tax ID of the ultimate beneficial owner (your Spanish NIF, for example).

**Part III, Treaty:**

- Mark that the beneficial owner is a tax resident of **Spain** (or whichever country applies).
- Indicate that you meet the **limitation on benefits** (Art. 17 of the US-Spain treaty): for a small LLC with a single Spanish-resident member, this is normally satisfied under ownership and base-erosion tests, or as an individual if the member qualifies directly. When in real doubt, consult your advisor.
- In the income type and treaty article field, indicate the article that applies (Business Profits, Royalties, Dividends, etc.) and the reduced rate you're entitled to.

**Part XXV, Active NFFE:** a box certifying that more than 50% of your income is active (non-passive). Standard for an operating LLC.

**Part XXX, Certification:** sign, name, capacity and date.
### Common mistakes that will cost you money

1. **Putting a US address as permanent residence.** The system reads it as you being a US person and applies different withholdings or asks for a W-9.
2. **Using W-8BEN when you should use W-8BEN-E** (or vice versa). Be careful with mixed accounts.
3. **Not signing.** Without a valid handwritten or digital signature, the payer treats the form as nonexistent.
4. **Forgetting the Foreign TIN** when the payer requires it (Stripe, IBKR and similar).
5. **Not marking Chapter 4 status.** Without it, banks must apply the 30% FATCA withholding.
6. **Claiming a treaty rate you're not entitled to.** Declaring 0% where your real case is 15% can backfire under audit. This is where Exentax steps in: we file the form, archive the receipt and, if the authority asks, your answer is already on the desk.
7. **Not renewing after 3 years.** After 3 years the form expires; the payer starts withholding 30% until you update it.
### Validity and renewal

A signed W-8 is valid for **3 full calendar years** from the date of signing. If during that period substantial data changes (change of country of tax residence, name change, change of entity type, end of treaty), you must file a new one as soon as the change occurs. And mark a calendar reminder to renew on time: most platforms warn you, but not all.
### Connection with the US-Spain treaty

The **Convention between the Kingdom of Spain and the United States of America to avoid double taxation and prevent fiscal evasion**, signed in 1990 and modernized by the 2013 Protocol in force since 2019, is the legal basis for most reduced rates on the W-8 when you're a Spanish resident. In particular:

- **Business profits (Art. 7):** without a permanent establishment in the US, profits are taxed only in Spain. Result for services rendered from outside the US: **0% withholding**.
- **Dividends (Art. 10):** reduced to 15% (10% in qualifying participations).
- **Interest (Art. 11):** generally 0%.
- **Royalties (Art. 12):** between 0% and 10% depending on type.

To see how this fits with your LLC, also read our <a href="/en/blog/us-spain-tax-treaty-applied-to-llcs">US-Spain double-taxation treaty applied to LLCs</a>.
## Practical cases by platform

- **Stripe (US or Atlas):** asks for an embedded W-8BEN-E when creating your LLC's account. Fill with EIN, registered US address, Chapter 4 = Active NFFE, treaty Spain = yes. Result: 0% withholding on service revenue.
- **PayPal Business:** requested when verifying the business account. Upload the signed PDF via the resolution center.
- **Mercury / Relay / Slash:** they do **not** ask for it during standard LLC onboarding. They only request it if a one-off compliance review specifically requires it; if the platform does not ask, you don't need to sign one to operate.
- **Wise Business:** same criterion as Mercury / Relay: only if expressly requested. It is not a default step when registering your LLC.
- **Interactive Brokers:** requested at account opening. Indicate Spain as country and select "Corporation" for your LLC. They will apply 15% withholding on US dividends instead of 30%.
- **AdSense / YouTube / Amazon KDP / App Store / Twitch:** each has its own wizard that internally generates the correct W-8. Fill carefully: changing it later is cumbersome.
## How Exentax helps

At Exentax we prepare your LLC's W-8BEN-E and help you submit it correctly wherever it is actually required: Stripe, IBKR and other brokers, affiliate platforms, AdSense / YouTube / Amazon KDP and any US payer that requests one. For Mercury, Relay, Slash or Wise we only sign one if the platform explicitly asks. If you've already been hit with 30% withholdings due to a wrong W-8, we also assess whether it's viable to request a refund via 1042-S and associated forms, although it's always much cheaper to do it right from the start.

> Every case is individual and tax law can change; these forms and FATCA criteria are updated periodically. So review your paperwork with each major change in your business or whenever the IRS publishes a new version.

If you want us to review your situation, book your free consultation with Exentax and we'll get your LLC's W-8s and your international paperwork in order.

To go deeper, also read <a href="/en/blog/do-us-bank-accounts-report-to-your-home-tax-authority-the">Do US bank accounts report to your home tax authority?</a> and <a href="/en/blog/us-llc-as-an-alternative-to-being-self-employed-in-spain">US LLC as an alternative to being self-employed in Spain</a>.
## Tax compliance in your country: CFC, controlled-foreign rules and income attribution

A US LLC is a fully legal, internationally recognized vehicle. But compliance does not end at incorporation: as an owner who is tax-resident elsewhere, your local tax authority still has the right to tax what the LLC earns. The key is **under which regime**.

### By jurisdiction

- **Spain (LIRPF/LIS).** An operative single-member disregarded LLC (real services, no significant passive income) is generally treated under **income attribution (art. 87 LIRPF)**: the LLC's net profits are attributed to the member in the year they arise and integrated into the general IRPF base. If instead the LLC elects corporation treatment (Form 8832) and is controlled by a Spanish resident with mostly passive income, the **CFC regime (art. 91 LIRPF for individuals, art. 100 LIS for companies)** can apply. The choice is not optional: it depends on economic substance, not on the label.
- **Information returns.** US bank accounts with average or year-end balance >€50,000: **Form 720** (Law 5/2022 after CJEU C-788/19, 27/01/2022, penalties now under the general LGT regime). Related-party transactions and dividend repatriation: **Form 232**. US-custodied crypto: **Form 721**.
- **Spain–US tax treaty.** The treaty (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol in force 27/11/2019) governs double taxation on dividends, interest and royalties. An LLC without a permanent establishment in Spain does not by itself create a PE for the member, but effective management can if all activity is run from Spanish territory.
- **Mexico, Colombia, Argentina and other LATAM jurisdictions.** Each has its own CFC regime (Mexico: Refipres; Argentina: foreign passive income; Chile: art. 41 G LIR). Common principle: profits retained inside the LLC are deemed received by the member if the entity is treated as transparent or controlled.

Before going further, put numbers on your case: the <a href="/en#calculadora">Exentax calculator</a> compares, in under 2 minutes, your current tax bill with what you would carry running a US LLC properly declared in your country of residence.

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Free consultation, no strings attached</a>
<!-- /exentax:calc-cta-v1 -->

Practical rule: an operative LLC with substance, properly declared in your country of residence, is **legitimate tax planning**. An LLC used to hide income, fake non-residence or shift passive income with no economic justification falls within **art. 15 LGT (anti-abuse)** or, worse, **art. 16 LGT (simulation)**. The facts decide, not the paperwork.
At Exentax we structure the entity to fit the first scenario and document every step so your local return can be defended in case of review.

<!-- exentax:legal-refs-v1 -->
## Legal and regulatory references

This article relies on rules currently in force. Main sources for verification:

- **United States.** Treas. Reg. §301.7701-3 (entity classification / *check-the-box*); IRC §882 (tax on foreign income effectively connected with a US trade or business); IRC §871 (FDAP and withholding on non-residents); IRC §6038A and Treas. Reg. §1.6038A-2 (Form 5472 for *25% foreign-owned* and *foreign-owned disregarded entities*); IRC §7701(b) (tax residency, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report to <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Spain.** Law 35/2006 (LIRPF), arts. 8, 9 (residency), 87 (income attribution), 91 (CFC for individuals); Law 27/2014 (LIS), art. 100 (CFC for companies); Law 58/2003 (LGT), arts. 15 (anti-abuse) and 16 (simulation); Law 5/2022 (Form 720 penalty regime after CJEU C-788/19 of 27/01/2022); RD 1065/2007 (Forms 232 and 720); Order HFP/887/2023 (Form 721 crypto). Breathe: at Exentax this is routine, we bring you up to date and the next review closes in one round, no drama.
- **Spain–US treaty.** BOE of 22/12/1990 (original DTT); Protocol in force since 27/11/2019 (passive income, *limitation on benefits*).
- **EU / <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>.** Directive (EU) 2011/16, amended by DAC6 (cross-border arrangements), DAC7 (Directive (EU) 2021/514, digital platforms) and DAC8 (crypto-assets); Directive (EU) 2016/1164 (ATAD: CFC, exit tax, hybrid mismatches); OECD Common Reporting Standard (CRS).
- **International framework.** OECD Model Convention, art. 5 (permanent establishment) and Commentaries; BEPS Action 5 (economic substance); FATF Recommendation 24 (beneficial ownership).

Applying any of these rules to your specific case depends on your tax residency, the LLC's activity and the documentation you keep. This content is informational and does not replace personalized professional advice.

<!-- exentax:banking-facts-v1 -->
## Banking and tax facts worth clarifying

Fintech and CRS information evolves; here is the current state:

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
- **EIN and notice.** Without an EIN you cannot file 5472 or BOI. The IRS does not warn before imposing penalties; you find out when an EIN is flagged or a later filing is rejected.<!-- exentax:execution-v2 --> That is exactly why at Exentax we keep your calendar tight — you stop thinking about deadlines and we close them before they ever bite.
## W-8BEN and W-8BEN-E: the complete guide to not mix them up and not pay 30% by mistake

The W-8 is the most important document in a non-resident's relation with any US payer (Stripe, Amazon, broker, corporate client). Without it, 30% default withholding applies. Properly completed, 0% or what the treaty of your residence indicates. Two versions are continuously confused, and the difference determines whether you operate well or throw money away.

- **W-8BEN: for individuals.** YOU sign it as person, not your LLC. Useful when receiving royalties, interest, US-source dividends or direct individual payments. Identifies your tax residence country, treaty claim if applicable (specific article of US-Spain, US-France treaty), declares you are NOT a US person. Lifespan: 3 years from signature or until circumstance change.
- **W-8BEN-E: for entities, including your LLC.** Signed by authorised signatory of LLC (typically manager). Identifies LLC, its FATCA classification (single-member disregarded entity = critical point, almost everyone marks it wrong), beneficial owner (person behind LLC), and treaty benefits claim if applicable. Lifespan: 3 years or until change. Form requested by Stripe at onboarding and by brokers (IBKR, etc.).
- **Most common error: marking LLC as Corporation when it is disregarded.** W-8BEN-E has Chapter 3 status section. Single-member LLC without C/S-Corp election is "disregarded entity" - beneficial owner is the individual, not the LLC. If you mark Corporation by mistake, broker or payer treats LLC as opaque entity and applies withholding without treaty. Result: 30% withheld on dividends when you should pay 15% (Spain, France) or 0% (some cases).
- **Treaty benefits: how to claim correctly.** In Part III: specify tax residence country with certificate, cite applicable treaty article (typically "Article 10 - Dividends", "Article 11 - Interest"), declare applicable % per treaty (15% typical for dividends, 0% interest in many cases). Without this section well filled, payer ignores treaty and applies 30% default.

### What we are asked the most

**Do I send W-8BEN-E directly to IRS?** No. The W-8 goes to payer (Stripe, broker, client), not IRS. Payer keeps it 4 years in records as non-withholding support. IRS only sees it if auditing the payer.

**If I am disregarded LLC, does beneficial owner claim residence treaty?** Exactly. For disregarded LLC, treaty benefits are claimed per beneficial owner's country, not LLC's. If you live in Spain and LLC is disregarded, apply Spain-US treaty on US dividends collected by LLC. LLC itself has no own treaty.

At Exentax we prepare correct W-8BEN-E (FATCA classification, treaty benefits, beneficial owner) and manage with each payer (Stripe, IBKR, brokers, corporate clients) - so withholding is what corresponds, not 30% default.
<!-- /exentax:execution-v2 -->

## We set it up without you losing a weekend

Thousands of freelancers and entrepreneurs already operate their US LLC fully legally and properly documented. At Exentax we handle the entire process: formation, banking, payment gateways, bookkeeping, IRS filings and compliance in your country of residence. Book a free consultation and we will tell you honestly whether the LLC makes sense for your case, with no absolute promises.

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

<!-- exentax:lote7-native-v1:w8-ben-y-w8-ben-e-guia-completa -->
## W-8 in plain words: who certifies what

The W-8 family answers a single, repeated question from US payers: is
the person on the other side of this payment a US person for tax
purposes, and if not, what status do you certify so the right
withholding rule applies. There are several variants because the
answer depends on whether the payee is a person, an entity, an
intermediary or a foreign government. Most LLC owners only ever
interact with two of them.

| Form         | Who signs                                | Typical use                          |
|--------------|------------------------------------------|--------------------------------------|
| W-8BEN       | A non-US individual                      | Foreign individual receiving US-source|
|              |                                          | income on personal account           |
| W-8BEN-E     | A non-US entity                          | Foreign entity (often the LLC) acting |
|              |                                          | as payee from US clients/platforms   |

For a single-member LLC owned by a non-US person and treated as
disregarded for US tax purposes, US payers typically request the
W-8BEN-E from the LLC and, in some platforms, also a W-8BEN from the
member as the beneficial owner. The names look similar but the
documents serve different roles in the same relationship.

## Three real cases we see often

A SaaS LLC sells to US enterprise customers under a master services
agreement. The procurement team requests the W-8BEN-E with the LLC's
EIN, the country of organisation (Wyoming or New Mexico for instance)
and a treaty claim if the member is in a country with a US tax treaty.
A clean form on file means the customer pays without backup
withholding and the audit trail is complete on both sides. That is exactly why at Exentax we keep your calendar tight — you stop thinking about deadlines and we close them before they ever bite.

A US-based marketplace pays an LLC owned by a Spanish tax resident.
The platform asks for a W-8BEN-E from the LLC and, on the dashboard,
records the beneficial owner. We populate the treaty claim where it
applies, attach the LLC's formation document and the EIN letter, and
the payouts proceed at the standard treaty rate.

A advisory LLC works for a US-listed corporate. Their AP system
runs annual W-8 refreshes; we update the form with the same data,
keep both the previous and the new copy in the LLC's compliance
folder, and flag the renewal date in our internal calendar so the
client never sees a missed cycle.

## Mistakes that delay payments

- Mixing W-8BEN and W-8BEN-E. Individuals sign W-8BEN; entities
  including LLCs sign W-8BEN-E. Do not cross the wires.
- Leaving the treaty box blank when a treaty applies. The treaty
  claim is what brings the withholding from 30% to the treaty rate;
  unclaimed, the payer withholds at the default.
- Using the foreign address from years ago. The form must reflect
  the current residence; mismatches with the BOI submission or with
  KYC files trigger requests for re-issue.
- Signing on behalf of the LLC without authority. Single-member
  LLCs are easy; multi-member LLCs need the operating agreement to
  show signing authority.

## Renewal and storage checklist

- W-8 forms expire on the third complete year after signature.
- Keep both the signed PDF and the source data in the LLC's
  compliance folder.
- Update before residence changes hit the bank or the payer.
- Confirm the EIN on the form matches the EIN on file with the IRS.
- Match the LLC name and DBA to formation documents exactly.

We treat the W-8 cycle as part of the LLC's annual hygiene, the same
way we treat BOI refreshes and bank profile updates: small recurring
work that prevents large recurring problems.

<!-- /exentax:lote7-native-v1:w8-ben-y-w8-ben-e-guia-completa -->

<!-- exentax:cross-refs-v1 -->
## On the same topic

- [IRS Form 1120 and 5472: what they actually are and when they apply](/en/blog/irs-form-1120-and-5472-what-they-actually-are-and-when-they)
- [What is the IRS, and how does it actually affect your US LLC](/en/blog/what-is-the-irs-and-how-does-it-affect-your-us-llc)
- [US-Spain tax treaty applied to LLCs: practical reading](/en/blog/us-spain-tax-treaty-applied-to-llcs)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:cta-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22If%20you%20or%20your%20LLC%20receive%20money%20from%20the%20United%20States%20(Stripe%2C%20PayPal%2C%20affi%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.

<!-- exentax:conv-fill-v1 -->
Or call us directly at <a href="tel:+34614916910">+34 614 916 910</a> if you'd rather talk.

For state-specific details, see our <a href="/en/services/llc-wyoming">Wyoming LLC service page</a> with closed costs and timelines.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->
`;
