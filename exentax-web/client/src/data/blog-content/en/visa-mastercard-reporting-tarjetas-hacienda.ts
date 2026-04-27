export default `When someone asks "does the tax authority see what I pay with my card?", the short answer is: it depends on who issued the card, where the merchant sits and where you are tax-resident. The long answer requires understanding how the card ecosystem actually works underneath and which information returns really exist. There is a lot of myth around Visa and Mastercard, and it is worth separating it from what really happens with your <a href="/en/blog/wise-iban-and-llc-what-actually-gets-reported-to-the-tax">Wise card linked to a US LLC</a>, with your local bank card or with your <a href="/en/blog/revolut-business-and-crs-what-it-reports-to-your-tax">Revolut card</a>.

This article walks through who is who in a card transaction, what each actor reports to tax authorities, and which country-by-country card-related declarations exist (Modelo 196 and 171 in Spain, DAS2 in France, Modelo 38 in Portugal, among others).

## The four-party model: issuer, network, acquirer, merchant

Every time you tap a card, four very different actors take part:

- **Issuer**: the entity that issued your card and holds the account the money comes from. It can be a traditional bank (Chase, BBVA), an EMI (Wise Europe SA, Revolut Bank UAB) or a prepaid issuer.
- **Network or scheme**: Visa, Mastercard, American Express, JCB, UnionPay. They do not hold your account or the merchant's: they route the authorisation message between issuer and acquirer and orchestrate the settlement.
- **Acquirer**: the financial entity that has signed up the merchant and credits the payment to them. In Europe these are names like Adyen, Stripe, Worldline, Redsys (through its member banks), CaixaBank Payments & Consumer, Banco Sabadell, etc.
- **Merchant**: the business that takes the payment. It is identified by a Merchant Category Code (MCC) and a unique ID inside the network.

Understanding this chain is critical: no actor "sees" the entire movie. Each one only sees their own segment.
### What each actor sees and what they don't

| Actor | What they know in detail |
| --- | --- |
| Issuer | Your identity, your account, every charge with amount, currency, date, MCC and merchant name |
| Network (Visa/Mastercard) | Authorisation messages between issuer and acquirer, aggregated data for settlement, fraud and disputes |
| Acquirer | Merchant identity, every payment received, amount, currency, card brand and issuer BIN |
| Merchant | Their own payment, last 4 digits, brand, issuing country and, if you ask for an invoice, your details |

What none of them does as a system is dump every single transaction live to the tax authority of every cardholder's country. That is simply not their role.
## The most common (and wrong) idea about Visa and Mastercard

There is a widespread belief that "since Visa and Mastercard are American and everything goes through them, they must already be reporting everything to tax authorities worldwide". That is not the case:

- **Visa Inc.** and **Mastercard Inc.** are **payment processing networks**, not depositary entities. They do not hold end-customer accounts and therefore are not "reporting financial institutions" under CRS or FATCA.
- They **do not report** individual card spend by each cardholder to the <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, the Spanish AEAT, France's DGFiP, the Belgian Service Public Fédéral Finances or any other national tax authority as an automatic feed.
- They do cooperate with tax and judicial authorities in specific investigations, via formal requests, like any other company that custodies data.

Who is subject to information obligations is the **card issuer** (in its national filings) and, on the merchant side, the **acquirer** within its own books and the filings that apply in its country.
## What the issuer actually reports in Spain

In Spain, domestic issuers file several information returns that are relevant for cards and accounts:

- **Modelo 196**: annual return on accounts at credit institutions. It identifies holders and authorised users, balances on 31 December and, in many cases, average Q4 balances. It covers the account behind the card, not every movement.
- **Modelo 171**: annual return on deposits, withdrawals and card payments above certain thresholds (classically, cash transactions above €3,000 and, for merchants, aggregated card receipts). This is the one most freelancers associate with "the tax office sees my card receipts".
- **Modelo 170**: return on transactions made by businesses or professionals affiliated to a card collection scheme. Here **acquirers** report the receipts they have credited to merchants, not the payments you make as a consumer.
- **Modelo 199**: identification of accounts with tax relevance.

Anyone using a card as a consumer in Spain whose account sits at a Spanish bank is, in practice, inside the perimeter the AEAT can consult periodically. And, above all, their balance and ownership are in Modelo 196 year after year.
## The equivalent in other European countries

The scheme changes in each jurisdiction. Some representative examples:

- **France – DAS2**: annual return covering fees, commissions and other income paid to third parties. For cards, the heavy lifting is done by **DGFiP** combining this return with the data fed by each bank. France additionally requires you to report **foreign accounts** (form 3916) and the digital assets attached, which typically includes Wise or Revolut IBANs.
- **Portugal – Modelo 38**: annual return on transfers and remittances abroad. **Modelo 40** complements it with securities transactions. Together with the obligation to disclose foreign accounts in the IRS, it draws a control perimeter similar to the Spanish one.
- **Germany**: there is no Modelo-196 equivalent, but German banks operate the Kontenabrufverfahren, which lets the Bundeszentralamt für Steuern check ownership of accounts and deposits of any resident upon request from a competent authority. Card spend is not reported automatically, but the account is fully accessible.
- **Italy**: the Anagrafe dei Rapporti Finanziari (Archivio dei Rapporti) collects yearly balances, aggregated movements and card data that Italian financial intermediaries send to the Agenzia delle Entrate. One of the densest schemes in Europe.
- **United Kingdom**: HMRC receives aggregated data from banks via schemes such as Bulk Data Gathering, on top of CRS reporting for non-residents.

The general rule is that **the account and the holder are well covered**, while the **transaction-level detail** is not pushed by default: it is only reconstructed during a specific audit.
## The case of a foreign issuer: Wise, Revolut and friends

When your card is issued by a European EMI other than a Spanish bank (typically Wise Europe SA in Belgium or Revolut Bank UAB in Lithuania), the situation changes:

- These issuers **do not file the Spanish information returns** (196, 171, 170, 199). Those are obligations for Spanish financial entities or branches established in Spain.
- They are subject to **CRS** from their home jurisdiction. Wise Europe SA reports to the Belgian tax authority and Revolut Bank UAB to the Lithuanian one, which forward to the holder's country of residence the year-end balance and income, as we explain in <a href="/en/blog/crs-and-your-us-llc-bank-accounts-what-gets-shared-with-your">CRS for LLC bank accounts</a>.
- The **detail of each card purchase does not travel via CRS**. What travels is the closing balance, the holder identity and, if the account belongs to an entity classified as Passive NFE, the controlling persons.

This explains an observation many people make: a card payment from a Spanish bank shows up, aggregated with everything else, in the data the AEAT can consult; the same payment with a Wise or Revolut card is not reported directly to the AEAT, but the account balance will be reported via CRS from Belgium or Lithuania.

The reasonable conclusion is not "the foreign card makes me invisible" but that **the trace exists in another layer**: the account is identified, balances are reported and, in case of an audit, movements can be requested.
### And the merchant acquirer: the other end of the wire

We often forget the acquirer. When a Spanish merchant takes a card payment, its Spanish acquirer files **Modelo 170** with the annual aggregate of card receipts for that merchant. If that merchant is an individual under-declaring income on their personal tax return, the AEAT cross-checks the Modelo 170 with the return and the discrepancy pops up. This does not affect the consumer, but it explains why the tax office detects under-declared card receipts so quickly.

For an entrepreneur with a US LLC charging end customers via Stripe US or a Merchant of Record like DoDo Payments, the flow is different: the acquirer sits outside Spain, no Modelo 170 is filed, and the income lands in Mercury or Wise. Traceability for the AEAT then runs through the balance and income via CRS, not through the acquirer.
## What the tax authority can really see from your card spend

Mapped onto a Spanish tax resident combining a local bank with foreign fintech and, possibly, a <a href="/en/blog/llc-in-the-united-states-complete-guide-for-non-residents-in">US LLC</a>:

What the AEAT can consult on a recurring basis:

- Spanish bank accounts where you are holder or authorised user (Modelo 196, 199).
- Aggregated card receipts of a Spanish merchant (Modelo 170, if you are self-employed or a company).
- Year-end balances and income of foreign accounts received via CRS from the issuer's country.
- Foreign accounts you self-report in Modelo 720 once you cross the aggregate threshold.

What the AEAT does not receive automatically:

- The detail of every purchase you make with any card, in Spain or abroad.
- The list of merchants where you shop as a consumer.
- Individual amounts below the 171 thresholds or equivalents.

What it can request if it opens an audit:

- The full account statement directly from the issuer in Spain and, abroad, via specific exchange.
- Targeted information from the card network or the merchant in advanced investigations.
## Common mistakes we see every week

1. **"Visa and Mastercard report everything live to the tax office."** False. They are processing networks; they are not reporting entities or final issuers.
2. **"If I pay with a foreign card, my purchases are invisible."** The detail is not reported automatically, but the account is visible via CRS and the trace is perfectly reconstructible.
3. **"Modelo 171 means the tax office sees every card purchase I make."** No: 171 covers transactions above thresholds and aggregates of receipts, not every personal purchase below those thresholds.
4. **"If my LLC takes payments via Stripe, that is already reported in Spain."** Not directly: Stripe US does not file Modelo 170, and information about your LLC reaches the AEAT through other channels (Mercury via FATCA is asymmetric, Wise via CRS, your own Modelo 720 if it applies).
5. **"Better always pay with the foreign bank card so I don't leave any trace."** The trace exists, and operating in a way clearly designed to leave no trace is exactly the pattern that triggers alarms in an audit fastest.
6. **"The acquirer of the European merchant where I shop reports my spending to the AEAT."** No: the acquirer reports the receipts of its own merchant client, not the consumer's data.
## Why this matters for your structure

If you combine a US LLC, a Mercury account, a Wise Business with card, a Revolut Business and a card from your Spanish bank for day-to-day spending, you do not have a "concealment" problem: you have a map of distinct traces, each with its own tax visibility. The right question is not "which card do I use so the tax office doesn't notice?" but "how do these pieces fit with my tax residence, my filings (IRPF, 720, 721) and the administrative doctrine that applies to my LLC?". We cover this in <a href="/en/blog/designing-a-solid-international-tax-structure-step-by-step">Designing a solid international tax structure</a> and, for the specific intersection with the <a href="/en/blog/wise-iban-and-llc-what-actually-gets-reported-to-the-tax">Wise card on top of an LLC</a>, in its dedicated article.

If you already operate with cards across several jurisdictions and you are not sure what is reported where, we review it with you and tell you what to fix before it is the tax office that sets the pace.
### In summary

Visa and Mastercard networks are not the ones that flag your spending to the tax office: their job is to process payments. What does reach the tax authorities is information from the **issuer** (via national filings such as Modelo 196 or 171, DAS2, Modelo 38) and from the **acquirer** (aggregated merchant receipts). When the issuer sits outside your country, national filings do not apply, but balance and ownership do travel via CRS from the issuer's jurisdiction.

Card spend is not being live-streamed to your tax office, but it leaves a perfectly visible trace when someone decides to look. The difference between having problems or not is not which card you use, but whether your structure is coherent with your tax residence and your filings.
## Tax compliance in your country: CFC, controlled-foreign rules and income attribution

A US LLC is a fully legal, internationally recognized vehicle. But compliance does not end at incorporation: as an owner who is tax-resident elsewhere, your local tax authority still has the right to tax what the LLC earns. The key is **under which regime**.

### By jurisdiction

- **Spain (LIRPF/LIS).** An operative single-member disregarded LLC (real services, no significant passive income) is generally treated under **income attribution (art. 87 LIRPF)**: the LLC's net profits are attributed to the member in the year they arise and integrated into the general IRPF base. If instead the LLC elects corporation treatment (Form 8832) and is controlled by a Spanish resident with mostly passive income, the **CFC regime (art. 91 LIRPF for individuals, art. 100 LIS for companies)** can apply. The choice is not optional: it depends on economic substance, not on the label.
- **Information returns.** US bank accounts with average or year-end balance >€50,000: **Form 720** (Law 5/2022 after CJEU C-788/19, 27/01/2022, penalties now under the general LGT regime). Related-party transactions and dividend repatriation: **Form 232**. US-custodied crypto: **Form 721**.
- **Spain–US tax treaty.** The treaty (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol in force 27/11/2019) governs double taxation on dividends, interest and royalties. An LLC without a permanent establishment in Spain does not by itself create a PE for the member, but effective management can if all activity is run from Spanish territory.
- **Mexico, Colombia, Argentina and other LATAM jurisdictions.** Each has its own CFC regime (Mexico: Refipres; Argentina: foreign passive income; Chile: art. 41 G LIR). Common principle: profits retained inside the LLC are deemed received by the member if the entity is treated as transparent or controlled.

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Free consultation, no strings attached</a>
<!-- /exentax:calc-cta-v1 -->

Practical rule: an operative LLC with substance, properly declared in your country of residence, is **legitimate tax planning**. An LLC used to hide income, fake non-residence or shift passive income with no economic justification falls within **art. 15 LGT (anti-abuse)** or, worse, **art. 16 LGT (simulation)**. The facts decide, not the paperwork.
At Exentax we structure the entity to fit the first scenario and document every step so your local return can be defended in case of review.

<!-- exentax:legal-refs-v1 -->
## Legal and regulatory references

This article relies on rules currently in force. Main sources for verification:

- **United States.** Treas. Reg. §301.7701-3 (entity classification / *check-the-box*); IRC §882 (tax on foreign income effectively connected with a US trade or business); IRC §871 (FDAP and withholding on non-residents); IRC §6038A and Treas. Reg. §1.6038A-2 (Form 5472 for *25% foreign-owned* and *foreign-owned disregarded entities*); IRC §7701(b) (tax residency, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report to <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Spain.** Law 35/2006 (LIRPF), arts. 8, 9 (residency), 87 (income attribution), 91 (CFC for individuals); Law 27/2014 (LIS), art. 100 (CFC for companies); Law 58/2003 (LGT), arts. 15 (anti-abuse) and 16 (simulation); Law 5/2022 (Form 720 penalty regime after CJEU C-788/19 of 27/01/2022); RD 1065/2007 (Forms 232 and 720); Order HFP/887/2023 (Form 721 crypto).
- **Spain–US treaty.** BOE of 22/12/1990 (original DTT); Protocol in force since 27/11/2019 (passive income, *limitation on benefits*).
- **EU / <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>.** Directive (EU) 2011/16, amended by DAC6 (cross-border arrangements), DAC7 (Directive (EU) 2021/514, digital platforms) and DAC8 (crypto-assets); Directive (EU) 2016/1164 (ATAD: CFC, exit tax, hybrid mismatches); OECD Common Reporting Standard (CRS).
- **International framework.** OECD Model Convention, art. 5 (permanent establishment) and Commentaries; BEPS Action 5 (economic substance); FATF Recommendation 24 (beneficial ownership).

Applying any of these rules to your specific case depends on your tax residency, the LLC's activity and the documentation you keep. This content is informational and does not replace personalized professional advice.

<!-- exentax:bank-balance-v1 -->
## A balanced banking stack: Mercury, Relay, Slash and Wise

There is no perfect account for an LLC. There is the right **stack**, where each tool plays a role:

- **Mercury** (operated as a fintech with partner banks (Choice Financial Group and Evolve Bank & Trust primarily; Column N.A. on legacy accounts), FDIC via sweep network up to the current limit). Main operating account for non-residents with strong UX, ACH and wires. Still one of the most proven options to open from outside the US.
- **Relay** (backed by Thread Bank, FDIC). Excellent **backup account** and for envelope-style budgeting: up to 20 sub-accounts and 50 debit cards, deep QuickBooks and Xero integration. If Mercury blocks or asks for KYC review, Relay keeps your operations running.
- **Slash** (backed by Column N.A. (federally chartered, FDIC)). Banking built for online operators: instant virtual cards by vendor, granular spend controls, cashback on digital advertising. The natural complement when you manage Meta Ads, Google Ads or SaaS subscriptions.
- **Wise Business** (multi-currency EMI, not a bank). To collect and pay in EUR, GBP, USD and other currencies with local bank details and mid-market FX. Does not replace a real US account but is unbeatable for international treasury.
- **Wallester / Revolut Business.** Wallester provides corporate cards on a dedicated BIN for high volume. Revolut Business works as a European complement, not as the LLC's main account.

The realistic recommendation: **Mercury + Relay as backup + Slash for ad operations + Wise for FX treasury**. This setup minimizes block risk and reduces real cost. At Exentax we open and configure this stack as part of incorporation.

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

<!-- exentax:legal-facts-v1 --><!-- exentax:execution-v2 -->
## Visa, Mastercard and tax reporting: what is known about your business card use

Many clients open Mercury thinking their US card is invisible to Spain. The tax office does not receive detailed transaction lists from your US business card - but receives aggregates cross-checked with declarations, and card-paid expenses leave traces in places that do report.

- **What the tax office does NOT receive directly.** Individual transaction lists (not movement by movement to foreign tax office), Visa/Mastercard categories, POS-terminal locations or times. Card networks are not fiscal reporting interfaces - they are payment interfaces between merchants and banks.
- **What it DOES receive via CRS and FATCA.** Year-end balance of US business account + total annual gross movements + UBO identification. If average balance or total flow is high and not coherent with your declaration, cross-check triggers.
- **What leaves a trail through merchants.** Paying in Spain with US Mercury card: merchant receives payment and declares sale normally; your IBAN/PAN does not reach the tax office, but merchant's account inflows do. Buying a car with US card: dealer reports sale and, if audited, foreign payer appears as datum.
- **What your resident bank sees if you load the card.** Transferring EUR from your Spanish account to Wise/Mercury for loading is visible in your Spanish account. Paying yourself salary from LLC via wire to IBAN is visible and must match IRPF.

### The typical cross-check detecting inconsistencies

Via CRS: your Mercury has €80k average balance and €300k annual gross flow. In IRPF you declare €25k of LLC economic activity. Obvious inconsistency: either not declaring correctly by attribution, or unjustified spending capacity vs declared income. Automatic procedure start.

### What we are asked the most

**If I pay all personal expenses with LLC card, do I avoid visibility?** No. Mixing personal in business account breaks patrimonial separation - losing limited liability and AML closure. Tax office does not need breakdown: it sees balance and flow and cross-checks with your declared income.

**Is there a "non-reportable" US card?** No. Every card issued by CRS-reporting financial institution is under aggregate reporting regime.

At Exentax we structure US card use for LLC with bookkeeping and correct residence declaration.
<!-- /exentax:execution-v2 -->

## Legal & procedural facts

FinCEN and IRS reporting requirements moved recently; the current state is:

- **BOI / Corporate Transparency Act: your LLC is NOT required to file (a competitive advantage).** After **FinCEN's March 2025 interim final rule**, the BOI Report obligation was **narrowed to "foreign reporting companies"** (entities formed OUTSIDE the US and registered to do business in a state). A **US-formed LLC owned by a non-resident does NOT file the BOI Report**: one fewer filing on your calendar, less paperwork, and a cleaner structure than ever. If your LLC was formed before March 2025 and you already filed BOI, keep the acknowledgement. The regulatory status can change again: **we monitor FinCEN.gov on every filing** and, if the obligation comes back, we handle it at no extra cost. Current status verifiable at [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + pro-forma 1120.** For a **Single-Member LLC owned by a non-resident**, the final regulations of Treas. Reg. §1.6038A-1 (in force since 2017) treat the LLC as a corporation for 5472 purposes. Procedure: **pro-forma Form 1120** (header only: name, address, EIN, tax year) with **Form 5472 attached**. It is filed **by certified mail or fax to the IRS Service Center in Ogden, Utah**, **not e-filed via standard MeF**. Due date: **April 15**; extension via **Form 7004** to **October 15**. **Penalty: $25,000 per form per year, plus $25,000 per additional 30 days** of non-filing after IRS notice.
- **Substantive Form 1120.** Only applies if the LLC has filed a check-the-box election to C-Corp (Form 8832): it then pays 21 % federal corporate tax and files a substantive 1120. A standard disregarded LLC **does not file a substantive 1120 and does not pay federal corporate tax**.
- **EIN and notice.** Without an EIN you cannot file 5472 or BOI. The IRS does not warn before imposing penalties; you find out when an EIN is flagged or a later filing is rejected.
### Practical reminder

Each tax situation depends on your specific residency, the activity carried out and the contracts in force. The information here is general and does not replace personalised advice; check your particular case before taking structural decisions.

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
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22When%20someone%20asks%20does%20the%20tax%20authority%20see%20what%20I%20pay%20with%20my%20card%3F%2C%20the%20sh%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.

<!-- exentax:conv-fill-v1 -->
Or call us directly at <a href="tel:+34614916910">+34 614 916 910</a> if you'd rather talk.

For state-specific details, see our <a href="/en/services/llc-wyoming">Wyoming LLC service page</a> with closed costs and timelines.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->

`;
