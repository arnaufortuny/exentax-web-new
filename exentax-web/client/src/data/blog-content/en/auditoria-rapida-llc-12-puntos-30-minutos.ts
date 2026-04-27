export default `If you have had your LLC for a while and never run a complete review, this article is the audit you should do today. It does not require bank access, it does not require a meeting with an advisor: twelve checks you can verify yourself in thirty minutes that cover 90% of the issues we see at Exentax every week.

The point is not to scare you, it is to give you a map. If you pass the twelve checks, your LLC is reasonably healthy. If you fail three or more, you have homework to prioritize.

## Why run this audit now

A well-managed LLC in year one tends to stay well-managed. An LLC that drags errors compounds them with interest: penalties that grow month by month, forms that get more expensive to remediate, banking that becomes harder to maintain when KYC reviews start coming in.

The quick audit has one concrete goal: turn a vague feeling ("I think it is all fine") into something verifiable. If you find two or three red flags, the action plan is much cheaper than discovering them in an inspection.
## The 12 checks

### 1. Legal status of the LLC

Go to the Secretary of State website for the formation state and look up your LLC by name. It should appear as **Active**, **In Good Standing** or equivalent. If it shows as **Delinquent**, **Forfeited** or **Dissolved**, you have a critical issue that must be fixed via reinstatement before anything else.

### 2. Registered Agent in good standing

Did you renew the Registered Agent this year? Is the address on file with the state current? A lapsed RA results in lost mail from the <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> or FinCEN, which results in penalties that arrive without warning.

### 3. Annual Report or Franchise Tax filed

Wyoming requires an Annual Report on your anniversary month. Delaware requires Franchise Tax by June 1. New Mexico has no annual filing. Whatever your state, know what applies and verify the last cycle was filed.

### 4. EIN intact and in your name

Confirm you still have the **EIN Confirmation Letter (CP 575)** or, in its absence, the **147C** that replaces it. If you lost it, call the IRS and request it: it is what banks, payment processors and compliance need to confirm the LLC's tax existence.

### 5. Last year's Form 5472 + 1120 pro-forma

If you are a non-resident with a SMLLC and had any movement between you and the LLC, the 5472 with 1120 pro-forma is mandatory. Ask yourself: was the prior year filed? Do you have a copy? If the answer is "no" or "I'm not sure", that is a red flag.

### 6. BOI Report filed and updated

Did you file the BOI Report with FinCEN at formation or in the first compliance window? Have you updated address, ID document or beneficiaries when they changed? BOI is not a one-and-done item: any relevant change requires update within 30 days.

### 7. Operating Agreement signed and stored

Open the file and verify it has signature, date and clear percentages. If you never signed it, sign it now with the real date (not retroactive). Banks, processors and compliance teams ask for it with growing frequency.

### 8. LLC bank account without commingling

Review the last six months of statements. Are there personal payments of yours on the LLC card? Are there LLC receipts in your personal account? Any commingling is a red flag, not because anything pops today, but because it pierces the corporate veil and complicates the 5472.

### 9. Correct tax residency on every platform

Mercury, Wise, Relay, Stripe, PayPal, Interactive Brokers, crypto exchanges: in all of them you must have the correct tax residency of the beneficial owner declared. A single platform with the wrong residency triggers automatic mismatch when the CRS exchange happens.

### 10. Last year's filing in your country

Did you report the LLC's income on your domestic personal tax return? This is not optional in most European and Latin American jurisdictions. If you have two or more years undeclared, voluntary remediation before the CRS or DAC exchange catches you is cheaper.

### 11. Modelo 720/721 if you reside in Spain

If you reside in Spain and the sum of foreign accounts, securities or crypto exceeds €50,000, you have an information reporting obligation. The CJEU ruling capped the disproportionate penalty, but the obligation is still in force and is cross-checked automatically.

### 12. Calendar and provider for next year

Finally: is it clear who files your 5472 next April? Who renews the RA? Who watches BOI if anything changes? If the answer is "I'll get to it", the probability of something dropping in the next 18 months is high.
### How to read the result

- **0-2 red flags:** your LLC is well-managed. Keep it that way and formalize the annual calendar.
- **3-5 red flags:** there is technical debt. A remediation plan over the next 60-90 days is appropriate.
- **6 or more red flags:** you are in risk territory. Voluntary remediation is cheap; waiting for an IRS, FinCEN or domestic letter is expensive.
## What to do with the result

If the audit comes out clean, file the exercise in your LLC folder with date. Repeat every six months; it takes twenty minutes.

If you find red flags, the sensible order is: legal first (state, RA, BOI), then federal tax (back-filed 5472 with the right strategy), then country (voluntary remediation if needed), and operations last (banking and platforms). Doing it all at once is rarely a good idea; sequencing it over 60-90 days almost always is.

At Exentax we review cases like this every week. If you want us to validate the result of your quick audit and prioritize the red flags without drama, book a free 30-minute initial session through our contact page.

_More on this topic: [critical mistakes if you already have a US LLC](/en/blog/critical-mistakes-if-you-already-have-an-llc-and-no-one-told), [I have a US LLC, am I managing it right?](/en/blog/i-have-an-llc-am-i-managing-it-right-real-checklist), [annual LLC maintenance](/en/blog/annual-llc-maintenance-obligations-you-cannot-ignore)._

<!-- related-inline-stripped-2026-04 -->

### Next steps

If you want to validate whether this strategy fits your specific situation, at Exentax we review your case personally and propose the legal and efficient structure that actually fits you. Book a free initial session through our contact page.

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
- **EIN and notice.** Without an EIN you cannot file 5472 or BOI. The IRS does not warn before imposing penalties; you find out when an EIN is flagged or a later filing is rejected.
## We set it up without you losing a weekend

Thousands of freelancers and entrepreneurs already operate their US LLC fully legally and properly documented. At Exentax we handle the entire process: formation, banking, payment gateways, bookkeeping, IRS filings and compliance in your country of residence. Book a free consultation and we will tell you honestly whether the LLC makes sense for your case, with no absolute promises.
## How we work at Exentax

Our team specialises in international tax structures for residents of Spanish-speaking countries operating online businesses. We combine local knowledge of Spain, Andorra and Latin America with operational experience setting up entities in Delaware, Wyoming, Estonia and other jurisdictions. Every case starts with a free consultation in which we evaluate residency, activity and goals, and we honestly tell you whether the proposed structure makes sense or whether a simpler alternative is enough.

## Exentax today update: verified essentials

Three concrete changes from the past year change how to score this audit today:

- **BOI Report (FinCEN).** **NOT required for US-formed LLCs owned by non-residents** after FinCEN's March 2025 interim final rule, which narrowed the scope to **foreign reporting companies** (entities formed outside the US and registered in a state). If your entity falls there, it identifies the beneficial owner (anyone holding **≥ 25 %** ownership or **substantial control**), is filed free of charge at [FinCEN's official BOI E-Filing portal](https://boiefiling.fincen.gov) in **10-15 minutes** and must be on time: **30 days** from registration and **30 days** for any change of address, document or beneficial owner. Civil penalty up to **USD 591/day** and criminal up to **USD 10,000 and 2 years' imprisonment** (31 U.S.C. §5336). Mark item 6 green when the **BOIR Confirmation Number** is on file (or when out-of-scope status is documented).
- **Form 5472 + pro-forma 1120.** The penalty for non-filing remains **USD 25,000 per form per year** (IRC §6038A). For tax year 2025 the deadline is **15 April today**, extendable via **Form 7004** to **15 October today**.
- **State annual reports.** Wyoming keeps the minimum 60 USD fee; Delaware Franchise Tax stays at 300 USD due 1 June; New Mexico still has no annual report. For other states, confirm dates on the Secretary of State portal.

### How to prioritize if you fail three or more checks

1. **Critical (7 days):** *Delinquent/Forfeited* status, EIN lost with no 147C, current-year 5472 unfiled.
2. **High (30 days):** unsigned Operating Agreement, lapsed Registered Agent, broken fund separation.
3. **Medium (90 days):** missing bookkeeping trail, no document backups, BOI not verified in affected jurisdiction.

### Frequently asked questions

**Does this audit replace professional review?** No. It covers 90% of visible operational issues but does not catch subtle tax exposures (PE, ECI, economic residency) that need case-by-case analysis.

**How often should I run it?** Once a year, ideally in January and before 15 March (1042-S deadline if you issue it). Repeat the same month you change bank, address or members.

**Does it apply to a dormant LLC?** Yes. An inactive LLC still owes Annual Report, Registered Agent and, if any movement occurred between you and the entity, the 5472 too.

<!-- exentax:execution-v2 -->
## How we run the quick audit at Exentax

A useful audit is not a witch hunt: it tidies the LLC in under thirty minutes and makes clear what must be fixed before the next filing. We run hundreds of these checklists every week and the twelve points that matter never change.

- **EIN, BOI and 5472 current** with copies reachable from any device, not buried in the founder's inbox.
- **Coherent banking**: ownership, address and business description aligned across Mercury, Wise or Relay to survive the first extended KYC.
- **Closed tax calendar** with federal, state and home-country deadlines on a single page.

To apply the same playbook now, run the <strong>Exentax calculator</strong> or book thirty minutes: you get the report with priorities and real closing cost, with no commitment.
<!-- /exentax:execution-v2 -->

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Free consultation, no strings attached</a>
<!-- /exentax:calc-cta-v1 -->

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
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22If%20you%20have%20had%20your%20LLC%20for%20a%20while%20and%20never%20run%20a%20complete%20review%2C%20this%20ar%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->
`;
