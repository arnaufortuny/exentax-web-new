export default `When somebody opens an LLC from outside the US, the banking conversation almost always boils down to one question: "Mercury or Wise?". That question is **the symptom of the problem, not the solution**. An operational LLC doesn't survive on a single account, not even on two. It needs a **banking stack** designed as a system. In this article we explain how to design a stack that holds up day to day, what happens when a piece fails, and why 80% of the freezes we see at Exentax come precisely from not having any of this in place.

This isn't an article about Wise vs Mercury (for that you have our <a href="/en/blog/wise-business-with-your-llc-the-complete-guide-to-multi">complete Wise Business guide</a>, the <a href="/en/blog/how-to-open-a-mercury-account-for-your-llc-from-any-country">Mercury guide</a> and the <a href="/en/blog/traditional-banks-vs-fintech-for-your-llc-where-to-open-your">banks vs fintech comparison</a>). It's the article that arranges the previous pieces into a coherent architecture.

## The mental error: thinking of the account as "the account"

People coming from Europe or LATAM bring a very specific mental model: **one account per person, one account per company**. Done. If it gets blocked, you go to the branch, talk to your account manager, fix it. The system assumes the bank has incentives to not lose you as a customer.

In the **US fintech ecosystem**, that model doesn't exist. Mercury, Wise, Brex, Relay, Revolut Business and friends are **technology platforms**, not banks. The account is opened by API, closed by API, and decisions are taken by a scoring system + a compliance team you don't know and can't call. If the system decides your account goes under review, your access is **frozen for 30, 60 or 90 days**, and nobody guarantees you'll recover funds in a short timeframe.

The first mental shift is this: **an account is not the account. It's just another vendor, replaceable like a hosting provider or a domain**. And like any critical vendor, it needs redundancy.
## The minimum viable stack for an operational LLC

From the second year of real activity (i.e. invoicing and collecting regularly), the minimum stack of a well-managed LLC looks roughly like this:

1. **Primary operational USD account** (Mercury, Brex or a traditional bank like Bank of America/Chase if you managed to open one in person).
2. **Secondary USD account** of the same kind (typically Relay if the primary is Mercury, or vice versa). Not for daily use, but as **real failover** if the primary gets blocked.
3. **Multi-currency account with European IBAN** (typically Wise Business). To collect from European clients in EUR without SWIFT and to have an entry point into the European banking system.
4. **Payment gateway** connected to one of the two USD accounts (Stripe, PayPal Business, Dodo Payments). See the <a href="/en/blog/payment-gateways-for-your-llc-stripe-paypal-and-dodo">payment gateway comparison</a>.
5. **Physical corporate card + virtual cards** for SaaS subscriptions and one-off purchases.
6. **Separate reserves** for taxes, FX and operations (developed below).

If this looks excessive: it is for month one. It's **strictly the minimum** to keep operating when something fails. And something always fails.
## Why Mercury alone isn't enough

Mercury is arguably the best product on the market for a non-resident's LLC: online onboarding, no monthly fee, decent integration with accounting software and a reasonable support team. But Mercury **isn't a bank**: it's a software layer on top of partner banks (Choice Financial, Column N.A., Evolve). If one of those partners decides to cut you off, Mercury **can't reopen your account** or move funds to another partner without your intervention.

What we see at Exentax almost weekly:

- Mercury account frozen because of an "atypical" incoming wire (a client from the Philippines, a payment from a crypto exchange, a Stripe return without a clear description).
- Automated Mercury email asking for additional documentation (invoice, contract, flow justification).
- 7 to 14 days without operations while compliance reviews.
- In 70% of cases, account restored. In 30%, **closure with funds returned in 30-60 days**.

If your whole operation depends on that account, during those weeks you can't pay your team, can't invoice clients that require ACH, and can't keep your critical SaaS subscriptions live. Having a pre-authorized and operational secondary account turns a **business crisis** into a **48-hour annoyance**.
## Why Wise alone isn't enough

Wise Business is excellent for multi-currency, European IBAN and FX conversion. But Wise **isn't a US operational account**. Its USD routing and account number are technically "details", not a US-bank-issued nominative account. That has three practical implications:

1. **Stripe US, Amazon US, certain marketplaces and large enterprises** accept Wise's USD details without problems, but some (especially public entities, regulated brokers or partners requiring direct ACH) reject them once they detect the receiver is an EMI rather than a bank.
2. **The Stripe → Wise → your local IBAN flow** works, but adds another actor to the compliance chain. When there's a freeze, you have to prove full traceability to more than one entity.
3. **Wise reports to your home tax authority via CRS** from Belgium and to other jurisdictions depending on where the balance is. If you think Wise gives you privacy, read first <a href="/en/blog/wise-iban-and-llc-what-actually-gets-reported-to-the-tax">what Wise actually reports to tax authorities</a> and <a href="/en/blog/wise-business-and-crs-what-it-reports-to-your-tax-authority">how Wise fits into CRS</a>.

Conclusion: Wise is **an essential piece** of the European puzzle, but doesn't replace an operational USD account nominative to your LLC.
## The trap of the Belgian IBAN (and the non-local IBAN)

When you open Wise Business as an American LLC, you get a **Belgian IBAN** (BE...). This surprises a lot of people who thought they would receive an IBAN from their country of residence. The consequence is twofold:

- Operationally, the IBAN works perfectly for SEPA inside the Eurozone. You collect and pay as if it were a Belgian account.
- Tax-wise and for **foreign asset reporting** (Modelo 720 in Spain, IES in Portugal, 3916 in France, equivalents elsewhere), that Belgian IBAN is **a foreign account in the name of a foreign entity**. If you exceed the thresholds and you're tax resident in one of those countries, **you must declare it**.

The typical mistake: "since the IBAN starts with BE, it's not 'my account', it's the LLC's, I don't declare it". False. Foreign asset reporting rules look at the beneficial owner (you, the individual), not the formal holder. Same applies to the Mercury account in the US. More on this in <a href="/en/blog/crs-and-your-us-llc-bank-accounts-what-gets-shared-with-your">US bank accounts and tax authorities</a> and in the <a href="/en/blog/crs-for-residents-in-spain-and-latam-real-implications">CRS guide for residents in Spain and LATAM</a>.
## Internal operating rules that save you 5 figures

The stack is just hardware. What avoids real problems are the operating rules you put on top. The ones we recommend to Exentax clients:

### 1. Never, ever, mix personal and LLC

Sounds obvious, the most expensive and most common mistake. If you pay your personal Netflix with the LLC card, or collect a personal job into the LLC account, you're **piercing the corporate veil** (the legal separation between you and the LLC) and handing the <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> + your local tax authority a silver platter to treat the LLC as an extension of your personal estate. Zero exceptions. If you need money, you take a distribution and then spend it as an individual.

### 2. Segment by risk

If your LLC has large B2B clients alongside crypto marketplace payouts or "tier 2" gateway payments, **split the flows across different accounts**. The primary takes clean, well-documented flows. The secondary absorbs more volatile flows. If the second one gets blocked over an atypical movement, the first keeps running.

### 3. Tax buffer of 25-35%

Every time money lands in the operational account, **automatically separate 25-35%** into a "tax reserve" account or sub-account. This covers the tax you'll pay in your country of residence (yes, you will, see <a href="/en/blog/your-llc-pays-no-us-tax-then-what-happens-in-your-country">why your LLC pays no US tax but you do at home</a>). Mercury and Relay let you create sub-accounts or "vaults"; Wise has "Jars". Use them.

### 4. Separate FX buffer

If your business invoices in USD but you spend/declare in EUR/GBP/MXN, FX swings can eat 5-10% of margin in a bad quarter. Keep an **FX buffer** in a multi-currency account so you don't convert at the worst moment.

### 5. Document contracts before the first payment lands

Every time a >5,000 USD wire from a new client lands, sooner or later you'll get a compliance email asking for "purpose of payment, contract, invoice". Having the contract signed and the invoice issued **before** collecting (not after) reduces review time from 14 days to 24 hours.

### 6. Absolute backup: the "what if this falls tomorrow" rule

Ask yourself every quarter: "if Mercury falls tomorrow for good, what do I do in the next 72 hours?". If the answer is "I don't know", the stack is wrong. The right answer is: "I have an operational secondary account, my payment gateway can be repointed in 1 hour, and my critical SaaS provider is on a virtual card from the secondary account".
## What happens when they block you (not "if", "when")

Talking about freezes as a rare exception hurts because people don't prepare. Operational truth: **every LLC with 18+ months of activity has had at least one freeze or review event**. What changes is the magnitude of the damage, and that depends on the stack.

Typical freeze:

- **Day 0**: automated email "your account is under review, please provide additional information".
- **Days 1-3**: you upload requested docs (invoice, contract, beneficiary justification, project screenshot).
- **Days 4-14**: silence. Your access is limited to incoming; no withdrawals or wires.
- **Day 14-30**: either full reopening or closure with funds returned in 30-60 calendar days.

To minimize damage:

- Activate the secondary account from day 1, **not on the day of the freeze** (some onboardings take 2-3 weeks).
- Keep both accounts in light continuous use. An account with no activity for 6 months "falls asleep" and sometimes requires re-verification when you need it most.
- Save monthly statements as PDF in your own drive. If they close you, you may lose access to the UI but still need those statements for tax and accounting.
- Document each client with a mini-dossier (website, contract, legal address). Compliance teams appreciate it and your response time drops.
### The gateway conversation: Stripe and friends

Stripe is the default option for almost any LLC, but it has its own freeze regime: **rolling reserves of 5-10%** for 90-120 days for new or high-risk accounts, and the possibility to freeze funds on fraud or high-dispute detection. Basic rules:

- **Don't connect Stripe to a single account**. If Stripe sends a payout and the receiving account is blocked, money goes into limbo.
- Set your **Stripe descriptor** to your real commercial name (not the LLC legal name) to reduce "I don't recognize this charge" chargebacks.
- If you take recurring subscribers, configure **churn alerts** + a buffer equivalent to 30 days of payout to absorb a freeze.

PayPal Business is useful but has a deserved reputation for arbitrary freezes. As a **complementary channel** it works; as the only channel, no.
### Cards: physical, virtual and the "one per category" rule

Cards are the most overlooked piece. Operational recommendation:

- **One physical card**: for physical spend (coworking, travel, client meals).
- **"SaaS" virtual card**: all recurring subscriptions. If compromised, you stop one set of charges only.
- **"Ads" virtual card**: paid campaigns (Google Ads, Meta, LinkedIn). High and unpredictable spikes that wake up anti-fraud.
- **"Single-use" virtual card**: one-off purchases from less-trusted vendors. Generate, use, close.

Mercury and Brex issue all these categories at no cost. Wise too. If you pay everything with the same card, a single fraud takes down your whole operation.
## What you should take away

- The right question isn't "Mercury or Wise", it's "**what stack do I build**".
- A professionally operational LLC has at minimum **2 USD accounts + 1 multi-currency account + gateway + segmented cards + reserves**.
- Mercury alone isn't enough. Wise alone isn't enough. Both combined still aren't enough without reserves and rules.
- The Wise IBAN is Belgian, not local. Still a foreign account for reporting purposes.
- Freezes are not exceptions, they're a routine event with a predictable timeline. The difference between "annoyance" and "crisis" is the stack.
- **Never mix personal and LLC**, segment by risk, 25-35% tax buffer, FX buffer and pre-payment documentation are the five rules that save you five figures.

If you have an LLC and want us to design the right banking stack for your volume and risk profile with you, **we'll go through it together** in a free 30-minute consultation. Building it well is cheap. Building it half-way and finding out the day Mercury sends the first "your account is under review" email is expensive.
## Legal and regulatory references

This article relies on rules currently in force. Main sources for verification:

- **United States.** Treas. Reg. §301.7701-3 (entity classification / *check-the-box*); IRC §882 (tax on foreign income effectively connected with a US trade or business); IRC §871 (FDAP and withholding on non-residents); IRC §6038A and Treas. Reg. §1.6038A-2 (Form 5472 for *25% foreign-owned* and *foreign-owned disregarded entities*); IRC §7701(b) (tax residency, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report to <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Spain.** Law 35/2006 (LIRPF), arts. 8, 9 (residency), 87 (income attribution), 91 (CFC for individuals); Law 27/2014 (LIS), art. 100 (CFC for companies); Law 58/2003 (LGT), arts. 15 (anti-abuse) and 16 (simulation); Law 5/2022 (Form 720 penalty regime after CJEU C-788/19 of 27/01/2022); RD 1065/2007 (Forms 232 and 720); Order HFP/887/2023 (Form 721 crypto).
- **Spain–US treaty.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> of 22/12/1990 (original DTT); Protocol in force since 27/11/2019 (passive income, *limitation on benefits*).
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

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Free consultation, no strings attached</a>
<!-- /exentax:calc-cta-v1 -->

The realistic recommendation: **Mercury + Relay as backup + Slash for ad operations + Wise for FX treasury**. This setup minimizes block risk and reduces real cost. At Exentax we open and configure this stack as part of incorporation.

## Next steps

Now that you have the full context, the natural next step is to map it against your own situation: what fits, what doesn't, and where the nuances depend on your residency, your activity and your volume. A quick review of your specific case usually saves a lot of noise before taking any structural decision.

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
- **EIN and notice.** Without an EIN you cannot file 5472 or BOI. The IRS does not warn before imposing penalties; you find out when an EIN is flagged or a later filing is rejected.<!-- exentax:execution-v2 -->
## Wise + banks for LLC: the complete banking stack any non-resident should have

The question "Mercury or Wise?" is poorly framed. The right answer is "both, plus Stripe, plus an alternative". An operational LLC does not work with one account - it works with a stack distributing risks (freezes, AML), optimising costs (FX, fees) and separating functions (operating, savings, FX). This is the stack we recommend by default.

- **Layer 1: main operating account (Mercury).** Mercury is the LLC's "primary checking". Receives Stripe payouts, pays vendors via free ACH, issues USD debit card, integrates with QuickBooks. Low cost, decent API, excellent UX. Risk: freeze for vague description or atypical activity - should not be the only bank.
- **Layer 2: backup and multi-currency (Wise Business).** Wise USD/EUR/GBP as parallel account. Receives EU client payments directly in EUR (local SEPA transfer, not SWIFT), UK in GBP, US in USD via own ACH. If Mercury closes tomorrow, Wise keeps operating 24h. Typical FX 0.4% (vs 1%-3% traditional banks). Multi-currency debit card.
- **Layer 3: payment gateway (Stripe + alternative).** Stripe US connected to Mercury for card collection. Lemon Squeezy or Dodo Payments as Merchant of Record for EU digital sales (cover digital VAT, free you from OSS/MOSS). PayPal Business as third method for B2C clients demanding it. NEVER one gateway: freezes happen.
- **Layer 4: treasury and optimised FX.** Wise EUR account to accumulate strong-currency reserves. Wise FX to convert USD → EUR when spread is favourable, not automatically. If LLC invoices in USD and you live in EUR, timing conversion is worth 0.5%-1% annual on total flow.

### Complete stack of a typical case

Wyoming LLC + EIN + Mercury (USD operational) + Wise Business (USD/EUR/GBP) + Stripe (card collection) + Lemon Squeezy (EU digital) + PayPal (alternative). Monthly recurring cost ~$50-$100 if volume <$100k/year. Covers 95% of scenarios without opening new accounts.

### What we are asked the most

**Mercury or Wise USD for Stripe payout?** Mercury is somewhat faster (1 day less) and better integrated by default. Wise USD also works but Stripe sometimes asks additional verification when switching. Recommendation: Stripe → Mercury primary, Wise as backup if Mercury freezes.

**Do Brex or Ramp make sense for small LLC?** Typically not for volume <$500k/year. Brex and Ramp offer corporate cards with cashback and spend tools, useful for teams with many employees. For sole-LLC or 2-3 people, Mercury + Wise is simpler and cheaper.

At Exentax we set up the complete stack (formation + EIN + Mercury + Wise + Stripe + alternative) in packaged setup, with assisted onboarding when bank rejection - so you start with redundancy, not single point of failure.
<!-- /exentax:execution-v2 -->

## References: sources on structures and jurisdictions

The comparisons and quantitative data on the jurisdictions cited here rely on official sources updated to today:

- **United States.** Delaware General Corporation Law and Limited Liability Company Act, Wyoming Limited Liability Company Act (Title 17, Chapter 29), IRS Form 5472 instructions and IRC §7701 (entity classification).
- **Andorra.** Llei 95/2010 de l'Impost sobre Societats (10% IS), Llei 5/2014 del IRPF and the active/passive residency framework of the Govern d'Andorra.
- **Estonia.** Estonian Income Tax Act (deferred-distribution corporate tax at 20/22%) and official documentation of the e-Residency programme.
- **Spain.** Ley 27/2014 (IS), Ley 35/2006 (IRPF, arts. 8-9 on residency and art. 100 on CFC) and the inbound-expat regime (art. 93 LIRPF, "Beckham Law").
- **OECD.** Pillar Two (GloBE) and OECD Model Tax Convention with Commentaries.

Choosing a jurisdiction always depends on the holder's actual tax residency and on the economic substance of the activity; review your specific case before taking any structural decision.

_More on this topic: [LLC in the United States: complete guide for non-residents](/en/blog/llc-in-the-united-states-complete-guide-for-non-residents-in)._

<!-- related-inline-stripped-2026-04 -->

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
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22When%20somebody%20opens%20an%20LLC%20from%20outside%20the%20US%2C%20the%20banking%20conversation%20almo%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->

`;
