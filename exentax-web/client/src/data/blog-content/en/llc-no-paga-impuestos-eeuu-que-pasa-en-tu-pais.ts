export default `There's a phrase that gets repeated in every YouTube video and every "open your LLC in 5 minutes" ad: **"your LLC pays no US tax"**. The phrase is technically correct for many profiles. The problem is what people understand when they hear it: "so I pay no tax anywhere". That is no longer true.

This article doesn't repeat the pass-through mechanism nor list jurisdictions one by one. For that you have our <a href="/en/blog/pass-through-taxation-for-llcs-how-it-works-and-why-it">pass-through guide</a> and <a href="/en/blog/us-llc-taxation-by-country-of-residence-what-you-pay-where">LLC tax by residency country</a>. Here we explain **what really happens in your country**, in what order, and why 80% of the problems we see at Exentax come precisely from missing this point.

## Starting error: "doesn't pay US tax" does NOT mean "doesn't pay tax"

Your US LLC, in the vast majority of cases, is a **disregarded entity** or a **partnership** for <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> purposes. That means the IRS doesn't see it as a separate taxpayer: income is attributed directly to the member. If you, as member, are non-resident in the US and don't run effective activity there (no physical office, no employees, no commercial presence), that income **doesn't generate federal tax in the US**.

So far, correct. But the tax system of the country where you actually live doesn't care what the IRS thinks; it cares what **its own tax code** says. And nearly every modern tax code shares the same logic: **a tax resident is taxed on worldwide income, regardless of source**. Whether earned by an individual directly, an LLC, a branch or a trust, if it's earned by a resident, that resident reports it.

So the right question isn't "does my LLC pay tax?" but "**when, how and through whom is that income taxed in my country?**".
## How income is allocated: the three models depending on your country

Here comes a distinction nobody explains. The way your country of residence treats a US LLC for tax falls into **one of these three models**:

### 1. Tax transparency / pass-through replicated (most countries)

Your country accepts the IRS treatment and considers the LLC **transparent**: income is attributed to you personally in the year it's earned, regardless of whether you've drawn it from the LLC's account. It is taxed at your personal rates (income tax, IRPF, IR, etc.).

This applies broadly in **Portugal, Germany and, with nuances, France**. Also in many LATAM countries. Practical consequence: even if you haven't moved a euro from the LLC's account, **you must include the annual profit in your personal return**.

### 2. Treatment as opaque company (hybrid or by election)

In some countries or for some taxpayers, the LLC is treated as a foreign opaque company (similar to an S.L. or GmbH). In that case you're personally taxed only **when the LLC distributes money to you** (dividends), not when it generates profit.

This is where **Controlled Foreign Company (CFC) rules** kick in: if the LLC sits in a low/no-tax jurisdiction and earns passive income, many countries impute the income as if transparent anyway, killing the deferral advantage.

### 3. Case-by-case doctrine (the Spanish model)

Spain is the most sophisticated case. The <a href="/en/blog/the-spanish-administrative-doctrine-on-the-us-llc-feb-2020">binding ruling V0537-20</a> establishes that the tax treatment of a US LLC for a Spanish resident depends on a **case-by-case analysis** of six criteria. In practice, almost all single-member LLCs of Spaniards fall into **tax transparency**: income attributed to the member as it arises.

What matters: your US adviser doesn't know which box your country falls into. And your local adviser probably doesn't know the six criteria either. That's how the black hole forms.
## What happens in year 1 (when nobody has warned you)

Year 1 with LLC. You invoice clients from the LLC, receive money on Mercury or Wise Business, pay expenses, and at year-end you have a profit. Your US adviser (if any) prepares pro-forma 1120 + 5472 and tells you "all in order, you owe nothing to the IRS".

One of three things then happens:

- **Scenario A, the responsible one**: you declare that income in your local return as business or capital income, depending on the case. You pay your local tax. You sleep well.
- **Scenario B, the misinformed**: you don't declare anything because "I haven't taken anything from the LLC's account". You think you'll only pay tax when "I move it to my personal account". Wrong: in the transparent model (most cases), you pay anyway, even without drawing.
- **Scenario C, the aggressive**: you bought into "no tax anywhere" and deliberately don't declare. You bet they'll never catch you.

Scenarios B and C feel identical during year 1: total silence. No notices, all good. But the clock is ticking.
## What happens in year 2 (when CRS cross-reports arrive)

From year 2-3, **CRS (Common Reporting Standard)** and **DAC** (in the EU) reports start landing at your country's tax administration. Wise reports from Belgium, Mercury reports from the US (via FATCA and bilateral agreements), Interactive Brokers reports from Ireland, crypto exchanges report from their home jurisdictions and from today also under DAC8.

When your tax authority receives those reports and cross-checks balances against your return:

- If you reported correctly (scenario A): match. Nothing happens.
- If you didn't report or reported badly (B and C): an **automatic mismatch** triggers. The higher the balance or flow, the sooner and the higher priority for opening proceedings.

The catch is that when the audit lands, it doesn't review only the last year, but the **four non-prescribed tax years** (in Spain; varies by country). What looked like "saving a few thousand" becomes four years of underpaid tax + interest + 50–150% penalties. Plus specific penalties for not reporting foreign assets or accounts (Form 720/721 in Spain, equivalents elsewhere). We close it with you from Exentax: one call, the filing goes out, the archive is set, and the risk stays on paper.
### What about the double-tax treaty?

Reasonable question: "but the US and my country have a treaty, doesn't that cover me?"

The treaty (if any) prevents the **same income being taxed twice**. If your LLC were a corporation actually paying federal tax in the US and you also paid on dividends in your country, the treaty would let you **credit the US tax** against what you owe at home.

But in most non-resident LLCs **no federal tax is paid in the US**. So the treaty has nothing to relieve: it taxes fully at home. The treaty doesn't turn US-untaxed income into home-exempt income.

There are exceptions and nuances (especially if there is "effectively connected income" in the US, or if the LLC has elected C-Corp status), but in the typical Exentax pattern the conclusion is the same: **your country takes the whole tax**.
### Typical cases by profile

| Profile | LLC pays in US | You pay at home | How it's typically reported |
|---|---|---|---|
| Online professional services freelancer | No | Yes | Self-employment / business income |
| E-commerce (dropshipping/Amazon FBA outside US) | No | Yes | Business income |
| International SaaS with global clients | No | Yes | Business income + possible EU VAT |
| Brokerage investing (stocks/ETFs) via LLC | Possible withholding | Yes | Capital income |
| Active crypto/forex trading via LLC | No (generally) | Yes | Capital or business, depending on frequency |
| Royalties received by the LLC | 30% withholding unless W-8BEN | Yes | Capital income |

In every profile the painful column is the middle one: **you pay at home**. The LLC doesn't cancel that obligation. The structure only decides **how, when and at what rate** you pay.
## How all this translates into your real return

If you are a Spanish tax resident with a transparent single-member LLC, your annual return typically includes:

- **IRPF** with the LLC's net profit attributed as business or capital income. Marginal rates 19–47%.
- **Form 720**: declaration of foreign assets (accounts, securities, real estate) if you exceed €50,000 per category.
- **Form 721** (already in force): specific declaration of foreign-held crypto.
- **Possible VAT**: if you sell digital services to EU consumers, even invoicing from the LLC, you still have OSS or equivalent VAT obligations.
- **Possible Form 232**: related-party transactions if your LLC operates with companies of yours in other countries.

In Portugal, the resident with an LLC usually reports IR as Category B (business) or E (capital) income, plus Form 38/39 and similar. In France, return 2042 with annex 2047/3916 for foreign accounts. In Germany, Anlage S/G and EÜR, plus KAP if applicable. In every case, the pattern is the same: **the LLC doesn't appear alone in the return; it appears through you**.
## Mistakes that cost money

1. **"I don't draw money, so I don't pay tax."** Under transparency you're taxed on accrued profit, not on what you draw. The most expensive and widespread mistake.
2. **"I'll declare it when I move it to my personal account."** Same mistake, different wording. Leads you to skip 1, 2, 3 years of returns and then regularise with penalties.
3. **"The LLC guy told me there was nothing to declare at home."** The provider who set up the LLC isn't your local tax adviser. They have no visibility on your local obligation and usually no liability if you get it wrong.
4. **"It's in Wyoming and nobody knows, it doesn't reach."** Yes it reaches. CRS, DAC and FATCA are live and fully automated. The exception today is for it not to reach.
5. **"I'll move my tax residency to Andorra/Dubai/Paraguay and the problem is solved."** Only if the move is **real, complete and well-executed** (centre of vital interests, days, home, tax certificate). On paper only, your previous country still considers you resident and you'll keep being taxed there.
6. **Trusting time asymmetry.** "Until they come, all good." When they come, they come for four years back with stacked penalties.
## How we approach this at Exentax

When a client comes to us before forming the LLC, the first thing we map isn't Wyoming vs Delaware nor Mercury vs Wise. The first thing is **how that income will be taxed in their current country of residence**. Then, based on that, we decide whether the LLC is the right tool, whether a mixed scheme makes sense, or whether the real conversation is **tax residency planning**, not entity choice.

When a client arrives already with the LLC running and discovers years of undeclared income, we evaluate:

1. How many tax years are open.
2. Amounts at stake (tax, interest, potential penalty).
3. **Voluntary regularisation** (amended returns before any notice), which sharply reduces penalties. We close it with you from Exentax: one call, the filing goes out, the archive is set, and the risk stays on paper.
4. Whether to also rectify late Form 720/721.
5. Whether the structure itself still makes sense going forward or needs redesign.

Conclusion almost always: **voluntary regularisation is cheaper** than waiting for the administration to open proceedings.
## What you should take away

- "Pays no US tax" is a **partial truth** sold as a complete one.
- Most jurisdictions apply **tax transparency** to the LLC, meaning you pay personally at home even if you don't draw.
- The double-tax treaty **does not turn US-untaxed income into home-exempt income**.
- CRS, DAC, FATCA and from today DAC8 make "they won't find out" increasingly false.
- Cheap path: **report properly from year one**. Expensive path: regularise after proceedings open.
- Changing tax residency can be an option, but only if real and complete, not on paper.

If you have an LLC and aren't 100% sure how you should be taxed at home, or if you've gone years without declaring and want to know your exposure and how to regularise at minimum cost, **we'll go through it with you** in a free 30-minute consultation. Better to see the whole map once than to discover it one penalty at a time. And if a notice does land, at Exentax we keep the dossier ready so you reply in hours, not weeks.
### Next steps

Now that you have the full context, the natural next step is to map it against your own situation: what fits, what doesn't, and where the nuances depend on your residency, your activity and your volume. A quick review of your specific case usually saves a lot of noise before taking any structural decision.
## Tax compliance in your country: CFC, controlled-foreign rules and income attribution

A US LLC is a fully legal, internationally recognized vehicle. But compliance does not end at incorporation: as an owner who is tax-resident elsewhere, your local tax authority still has the right to tax what the LLC earns. The key is **under which regime**.

### By jurisdiction

- **Spain (LIRPF/LIS).** An operative single-member disregarded LLC (real services, no significant passive income) is generally treated under **income attribution (art. 87 LIRPF)**: the LLC's net profits are attributed to the member in the year they arise and integrated into the general IRPF base. If instead the LLC elects corporation treatment (Form 8832) and is controlled by a Spanish resident with mostly passive income, the **CFC regime (art. 91 LIRPF for individuals, art. 100 LIS for companies)** can apply. The choice is not optional: it depends on economic substance, not on the label.
- **Information returns.** US bank accounts with average or year-end balance >€50,000: **Form 720** (Law 5/2022 after CJEU C-788/19, 27/01/2022, penalties now under the general LGT regime). Related-party transactions and dividend repatriation: **Form 232**. US-custodied crypto: **Form 721**. Relax: at Exentax this is what we do every week, we close it before the letter ever lands in your inbox.
- **Spain–US tax treaty.** The treaty (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol in force 27/11/2019) governs double taxation on dividends, interest and royalties. An LLC without a permanent establishment in Spain does not by itself create a PE for the member, but effective management can if all activity is run from Spanish territory.
- **Mexico, Colombia, Argentina and other LATAM jurisdictions.** Each has its own CFC regime (Mexico: Refipres; Argentina: foreign passive income; Chile: art. 41 G LIR). Common principle: profits retained inside the LLC are deemed received by the member if the entity is treated as transparent or controlled.

<!-- exentax:cross-refs-v1 -->
## On the same topic

- [IRS Form 1120 and 5472: what they actually are and when they apply](/en/blog/irs-form-1120-and-5472-what-they-actually-are-and-when-they)
- [Form 5472: what it is, who must file it and how to comply](/en/blog/form-5472-what-it-is-who-must-file-it-and-how-to-comply)
- [US LLC taxation by country of residence: what you pay where](/en/blog/us-llc-taxation-by-country-of-residence-what-you-pay-where)
<!-- /exentax:cross-refs-v1 -->

Before going further, put numbers on your case: the <a href="/en#calculadora">Exentax calculator</a> compares, in under 2 minutes, your current tax bill with what you would carry running a US LLC properly declared in your country of residence.

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Talk to our team</a>
<!-- /exentax:calc-cta-v1 -->

Practical rule: an operative LLC with substance, properly declared in your country of residence, is **legitimate tax planning**. An LLC used to hide income, fake non-residence or shift passive income with no economic justification falls within **art. 15 LGT (anti-abuse)** or, worse, **art. 16 LGT (simulation)**. The facts decide, not the paperwork.
At Exentax we structure the entity to fit the first scenario and document every step so your local return can be defended in case of review.

<!-- exentax:legal-refs-v1 -->
## Legal and regulatory references

This article relies on rules currently in force. Main sources for verification:

- **United States.** Treas. Reg. §301.7701-3 (entity classification / *check-the-box*); IRC §882 (tax on foreign income effectively connected with a US trade or business); IRC §871 (FDAP and withholding on non-residents); IRC §6038A and Treas. Reg. §1.6038A-2 (Form 5472 for *25% foreign-owned* and *foreign-owned disregarded entities*); IRC §7701(b) (tax residency, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report to <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Spain.** Law 35/2006 (LIRPF), arts. 8, 9 (residency), 87 (income attribution), 91 (CFC for individuals); Law 27/2014 (LIS), art. 100 (CFC for companies); Law 58/2003 (LGT), arts. 15 (anti-abuse) and 16 (simulation); Law 5/2022 (Form 720 penalty regime after CJEU C-788/19 of 27/01/2022); RD 1065/2007 (Forms 232 and 720); Order HFP/887/2023 (Form 721 crypto). This is where Exentax steps in: we file the form, archive the receipt and, if the authority asks, your answer is already on the desk.
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

<!-- exentax:legal-facts-v1 --><!-- exentax:execution-v2 -->
## "My LLC pays no US tax": true, but what happens in your country?

The line circulates on social and sells well, but is half-true: a non-resident single-member LLC without ETBUS pays no US federal tax, correct. But the full tax result is determined in YOUR country of residence, not in the US. Here is what almost no one explains.

- **The "0% in US" is real, with conditions.** No ETBUS, no US-source income (US clients buy services rendered from abroad, with no physical US presence of yours), single-member LLC disregarded: US result is 0% federal. Informational obligation (1120 + 5472) remains, but no tax.
- **But your country of residence decides the real outcome.** Spain, France, Germany, Italy, UK apply attribution/transparency: profits attributed to the LLC are your personal income and taxed at marginal IRPF/IR (24-47% Spain; up to 45% France/Germany/UK). Effective taxation: your country's, not the US's.
- **LATAM and opaque cases.** Mexico (REFIPRES with conditions), Colombia, Argentina, Chile: in many cases the LLC is treated as opaque and only distributions are taxed. Here there is real deferral: profit kept inside the LLC is not taxed at residence until distributed. But watch CFC on passive income.
- **What social does not say.** "Global 0%" requires moving tax residence to a jurisdiction without attribution: Andorra, UAE, Panama, Paraguay, certain islands. While your residence is Spain/France/Germany, the LLC adds operations and does not remove personal income tax - the fiscal play is moving residence, not setting up an LLC.

### What we are asked the most

**If I leave profit inside the LLC, do I avoid IRPF in Spain?** No: the income attribution rule (art. 7.5 LIRPF and art. 100 LIS) imputes profits to the Spanish partner even without distribution. The disregarded LLC is transparent for the tax authority.

**What if I become "digital nomad" or change residence?** Everything changes: residence jurisdiction determines taxation. Andorra (10% corporate, no CFC for limited-substance transparent entities in many cases): the LLC can be fiscally efficient. Model before moving.

At Exentax we model your full situation (LLC + current residence + possible future change) with your real numbers and tell you exactly how much you pay today and how much in each scenario, without selling moves that do not pay off.
<!-- /exentax:execution-v2 -->

## Legal & procedural facts

FinCEN and IRS reporting requirements moved recently; the current state is:

- **BOI / Corporate Transparency Act: your LLC is NOT required to file (a competitive advantage).** After **FinCEN's March 2025 interim final rule**, the BOI Report obligation was **narrowed to "foreign reporting companies"** (entities formed OUTSIDE the US and registered to do business in a state). A **US-formed LLC owned by a non-resident does NOT file the BOI Report**: one fewer filing on your calendar, less paperwork, and a cleaner structure than ever. If your LLC was formed before March 2025 and you already filed BOI, keep the acknowledgement. The regulatory status can change again: **we monitor FinCEN.gov on every filing** and, if the obligation comes back, we handle it at no extra cost. Current status verifiable at [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + pro-forma 1120.** For a **Single-Member LLC owned by a non-resident**, the final regulations of Treas. Reg. §1.6038A-1 (in force since 2017) treat the LLC as a corporation for 5472 purposes. Procedure: **pro-forma Form 1120** (header only: name, address, EIN, tax year) with **Form 5472 attached**. It is filed **by certified mail or fax to the IRS Service Center in Ogden, Utah**, **not e-filed via standard MeF**. Due date: **April 15**; extension via **Form 7004** to **October 15**. **Penalty: $25,000 per form per year, plus $25,000 per additional 30 days** of non-filing after IRS notice.
- **Substantive Form 1120.** Only applies if the LLC has filed a check-the-box election to C-Corp (Form 8832): it then pays 21 % federal corporate tax and files a substantive 1120. A standard disregarded LLC **does not file a substantive 1120 and does not pay federal corporate tax**.
- **EIN and notice.** Without an EIN you cannot file 5472 or BOI. The IRS does not warn before imposing penalties; you find out when an EIN is flagged or a later filing is rejected. Breathe: at Exentax this is routine, we bring you up to date and the next review closes in one round, no drama.
<!-- related-inline-stripped-2026-04 -->

### What people get wrong

If it is not clean here, every downstream assumption becomes negotiable in front of the authority.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22There's%20a%20phrase%20that%20gets%20repeated%20in%20every%20YouTube%20video%20and%20every%20open%20you%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If your plan is to set up the LLC in New Mexico, check our service page <a href="/en/services/llc-new-mexico">LLC in New Mexico</a> with real costs, timelines, and the concrete next steps.

<!-- exentax:conv-fill-v1 -->
Or call us directly at <a href="tel:+34614916910">+34 614 916 910</a> if you'd rather talk.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
We review BOI, EIN, registered agent and federal obligations so a fine never catches you by surprise. <a href="/en/services/llc-new-mexico">Request a compliance review</a>.
<!-- /exentax:cta-v1 -->
`;
