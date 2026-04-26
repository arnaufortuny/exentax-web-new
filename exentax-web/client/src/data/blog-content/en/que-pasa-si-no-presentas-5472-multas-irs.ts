export default `There is one filing in the tax life of a single-member foreign-owned LLC that cleanly separates the people who manage it well from the ones walking into a five-figure problem: **Form 5472**. It is not a tax. It is an informational return. Precisely because it is "only informational", a lot of people ignore it, file it late, file it with broken data, or never even realise it exists. The <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> rarely forgives that gap: the base penalty is **USD 25,000 per missed form, per year**, and it stacks.

This article is not the step-by-step filing guide (for that you already have our <a href="/en/blog/form-5472-what-it-is-who-must-file-it-and-how-to-comply">complete Form 5472 guide</a> and the piece on <a href="/en/blog/irs-form-1120-and-5472-what-they-actually-are-and-when-they">when 1120 and 5472 actually apply</a>). This is what happens **once you haven't filed it**, and how to climb out of that hole without destroying the LLC or your personal tax position.

## What exactly the IRS sanctions

The rule lives in **section 6038A(d) of the Internal Revenue Code**, reinforced in 2017 by the Tax Cuts and Jobs Act. The base in force today is **USD 25,000 per form not filed, filed late, or filed substantially incomplete**. Until 2018 the penalty was USD 10,000; since then it has been fixed at USD 25,000 and, absent legislative change, that is the number you will hit.

On top of that base sit three things most people don't see coming:

1. **Persistence penalty.** If the IRS formally notifies you of the failure and you do not regularise within **90 days**, **another USD 25,000** is added for **each 30-day period (or fraction)** you remain non-compliant. No published cap: real cases reach six figures.
2. **One penalty per year, not one period.** Three years missed = three forms. Three × USD 25,000 = **USD 75,000** before interest.
3. **Cascade with Form 1120.** Your single-member foreign-owned LLC must file **pro forma Form 1120 + Form 5472 together**. If you missed the 5472, you almost certainly missed the 1120, which adds extra exposure for late-filing of the 1120 under §6651, although the §6651 monetary penalty is calculated on tax owed, so on a pro-forma LLC with no tax due the amount is usually zero or residual; the main risk remains the 5472.

Add **interest on the penalties** from the date they accrue, calculated by the IRS at the federal short-term rate + 3 points, updated each quarter.
## How the IRS finds out

The question I get in almost every first call is the same: *"how would the IRS even know I exist if I never filed anything?"*. Short answer: **they know, and every year it gets easier**. The five concrete channels today are:

- **EIN under control.** If you got an EIN, you are already in their systems. The IRS periodically crosschecks active EINs against returns received. A single-member LLC with an active EIN and no 1120/5472 year after year shows up in their **non-filer** listings.
- **US banks and third-party reporting.** Mercury, Brex, Wise USD, Relay and similar run KYC on the LLC, hold customer information accessible to the IRS and, depending on the flow and client type, may generate third-party reporting (Form 1099, withholding, FATCA where it applies). An operative LLC moving funds with nothing filed is the pattern that flags reviews.
- **BOI Report (<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).** Under the current <a href="/en/blog/boi-report-2026-complete-guide-to-fincen-beneficial">BOI Report</a> rules, FinCEN has beneficial ownership mapped for required LLCs, and the framework provides for IRS data sharing subject to applicable access rules (regime subject to regulatory change).
- **CRS and DAC in reverse.** When your country of residence receives information on accounts linked to the LLC and the IRS asks for an audit, the crossmatch happens automatically. Some jurisdictions are now performing this match by default.
- **Your own counterparties.** When a US vendor issues a Form 1099 to your LLC, or a counterparty discloses a reportable transaction, your LLC shows up in the IRS system without you having done anything.

The "they will never see me" idea was already weakened by the 2017 reinforcements and, under current BOI rules, is practically untenable. The right baseline is to assume the IRS can open an examination at any time and design your plan accordingly.
## The three typical late-filer profiles

In practice the situations we see at Exentax are three, and each one is handled differently:

### Profile A: never filed the 5472

You've had the LLC for two, three, five years. You have an EIN, a bank account, you have invoiced. But you never touched the 1120 or the 5472 because "someone told you the LLC doesn't pay tax". The potential exposure is **USD 25,000 × number of unfiled years**, plus possible 1120 late filing, plus interest.

### Profile B: filed late

You realised, you filed late, but **before the IRS formally notified you**. Here the debate on the 5472 late-filing penalty opens: officially it is still USD 25,000, but the settled practice is that **a spontaneous late filing with reasonable cause** opens the door to **abatement**. This is where we close most cases at zero penalty.

### Profile C: filed but wrong

You filed the 1120 and 5472 but with substantially incomplete data: a missing **reportable transaction**, a wrong TIN on the foreign related party, an undisclosed loan from owner to LLC, an undeclared capital contribution. The 6038A(d) rule is strict: a **substantially incomplete return is treated as no return**, with the same penalty. Good news: the friendly correction with a written explanation typically resolves better than the previous two.
### What a "reportable transaction" really is

This is the number-one cause of technically wrong 5472 filings. A **reportable transaction** is any monetary or non-monetary movement between the LLC and its foreign related party (you, in most cases), including things people don't associate with "a transaction":

- Capital contributions from owner to LLC.
- Loans from owner to LLC and from LLC to owner (yes, both directions).
- Distributions from LLC to owner.
- Payments for services, royalties, interest.
- Use of assets (including software, trademarks, domains).
- Expense reimbursements when the owner pays personally and is reimbursed.
- Any accounting entry representing a right or obligation between LLC and owner.

When someone tells me "I had no transactions with my LLC", what's usually there is **five or six undocumented reportable transactions**. That's exactly Profile C.
## The real cycle of an IRS notice

It helps to map what happens once the machine is moving, because each step has its own timing and options:

1. **CP15 / CP215 (notice of penalty).** You receive notice of the initial USD 25,000 penalty per form.
2. **Response window (~30 days).** Here you decide whether to pay, request abatement on reasonable cause, dispute the math, or escalate to the Office of Appeals.
3. **Expanded examination.** If the response is unconvincing, the IRS typically opens an exam over additional years. One penalty becomes three.
4. **90 days after formal notice.** If the form has not been filed and the situation resolved, the **USD 25,000 per additional 30 days** clock starts.
5. **Final assessment + interest.** Once fixed, interest accrues until paid.

Anyone who has been through this knows the decisive moment is the **step-2 window**. A well-built response there is the difference between zero and dragging six figures around for years.
### Reasonable cause: what actually works

The IRS recognises a **reasonable cause exception** under 6038A. It is not magic: it is a doctrine with criteria. What typically **works**:

- Showing you acted with **ordinary care and prudence** and the error came from a reasonable cause, not negligence.
- Producing correspondence with prior advisors who told you no obligation existed.
- Demonstrating that, once you became aware of the obligation, **you immediately got current**.
- Showing the information was available and you filed correct, complete returns when regularising.

What **does not work** (yet many try):

- "I didn't know about the 5472." Insufficient.
- "My bank / Stripe / my accountant didn't tell me." Insufficient.
- "The LLC had no relevant activity." If there was any reportable transaction, irrelevant.
- Filing the abatement request **after** an incomplete or erroneous regularisation.

This is where a properly drafted statement, with formal structure and references to IRM 20.1.9 and regulation §1.6038A-4, makes the difference.
### Streamlined no, but there are routes

Many people confuse the **Streamlined Filing Compliance Procedures** (a programme for **US persons with undeclared foreign accounts**) with a missed Form 5472. **They are not the same and it does not apply.** What does apply to the 5472 are three real routes:

- **Delinquent international information return submission.** Standard procedure to file late international information returns with reasonable cause. Usual route for Profile A and Profile B.
- **Voluntary Disclosure Practice.** Only when there is **wilful conduct** or criminal exposure. Not normal for a single-member LLC.
- **Quiet disclosure.** Filing late with no explanation. Technically possible, practically discouraged: the IRS treats it as plain late filing and applies the penalty.

The difference between the right route and going blind is, literally, tens of thousands of dollars.
## The regularisation plan, step by step

When a client comes in with a missed 5472, the work order is always the same:

1. **Real inventory**: how many years, what reportable transactions per year, what bank and accounting documentation exists, BOI filed, 1120 filed, returns in the country of residence.
2. **Reconstruction of reportable transactions** year by year, including contributions, loans and distributions.
3. **Package preparation**: pro forma 1120 for each pending year + 5472 for each pending year + detailed reasonable cause statement.
4. **Submission by certified mail** (these packages are not e-filed; the operational address is the Ogden Service Center).
5. **Anticipated response plan** for the initial penalty notice: response draft and deadlines prepared before the notice even arrives.
6. **Cleanup of adjacent areas**: <a href="/en/blog/boi-report-2026-complete-guide-to-fincen-beneficial">BOI</a>, banking, returns in your country, and above all <a href="/en/blog/i-have-an-llc-am-i-managing-it-right-real-checklist">the annual checklist</a> so it doesn't happen again.

Done in that order, the realistic outcome in many cases is **zero or residual penalty**, although it depends on facts, documentation and IRS agent response. Done badly, it is five figures and an expanded examination.
### Mistakes that multiply the bill

To close on the concrete side, these are the mistakes we see month after month at Exentax that **multiply the cost**:

- Filing the 5472 without the associated pro forma 1120. Invalid.
- E-filing the 5472: outside narrow exceptions, it goes by mail and signed.
- Generic reasonable cause copied from the internet. The IRS files them as rejection.
- Filing only the last few years "to stay quiet". If the obligation existed earlier, the penalty is alive.
- Closing the LLC believing that erases the obligation. **It does not**: the penalty survives dissolution until the statute of limitations runs.
- Changing Registered Agent or address without updating the IRS. Notices get lost and the clocks keep running.
- Assuming your country of residence shields you. The penalty is the IRS against the LLC; no bilateral treaty eliminates that penalty.

---
### Conclusion and next step

Form 5472 is one of the few cases where the cost of **doing nothing** is geometrically higher than doing it right. The USD 25,000 base per year is not negotiable; what is negotiable is **how you regularise, in what order, with what argument and which collateral risks you close at the same time**.

If you have an LLC and think you might be in any of the three profiles, never filed, filed late, filed but wrong, the rational move is to **map your situation with real numbers before the IRS does**. In a free 30-minute consultation we go through it with you, tell you which profile you fall into, what your exposure is and which regularisation route is realistic. It is the cheapest move you can make on this topic today.
## Legal and regulatory references

This article relies on rules currently in force. Main sources for verification:

- **United States.** Treas. Reg. §301.7701-3 (entity classification / *check-the-box*); IRC §882 (tax on foreign income effectively connected with a US trade or business); IRC §871 (FDAP and withholding on non-residents); IRC §6038A and Treas. Reg. §1.6038A-2 (Form 5472 for *25% foreign-owned* and *foreign-owned disregarded entities*); IRC §7701(b) (tax residency, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report to FinCEN).
- **Spain.** Law 35/2006 (LIRPF), arts. 8, 9 (residency), 87 (income attribution), 91 (CFC for individuals); Law 27/2014 (LIS), art. 100 (CFC for companies); Law 58/2003 (LGT), arts. 15 (anti-abuse) and 16 (simulation); Law 5/2022 (Form 720 penalty regime after CJEU C-788/19 of 27/01/2022); RD 1065/2007 (Forms 232 and 720); Order HFP/887/2023 (Form 721 crypto).
- **Spain–US treaty.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> of 22/12/1990 (original DTT); Protocol in force since 27/11/2019 (passive income, *limitation on benefits*).
- **EU / <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>.** Directive (EU) 2011/16, amended by DAC6 (cross-border arrangements), DAC7 (Directive (EU) 2021/514, digital platforms) and DAC8 (crypto-assets); Directive (EU) 2016/1164 (ATAD: CFC, exit tax, hybrid mismatches); OECD Common Reporting Standard (CRS).
- **International framework.** OECD Model Convention, art. 5 (permanent establishment) and Commentaries; BEPS Action 5 (economic substance); FATF Recommendation 24 (beneficial ownership).
Applying any of these rules to your specific case depends on your tax residency, the LLC's activity and the documentation you keep. This content is informational and does not replace personalized professional advice.

<!-- exentax:banking-facts-v1 -->
## Banking and tax facts worth clarifying

Fintech and CRS information evolves; here is the current state:

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Talk to our team</a>
<!-- /exentax:calc-cta-v1 -->

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
## What happens if you do NOT file 5472: how the IRS penalty works and how to regularise

The 5472 is the most expensive obligation a non-resident LLC owner can fail. Sanction is civil, automatic (not IRS discretion), and starts at $25,000 per form per year. Here is what really happens and, more importantly, how to regularise minimising damage before the IRS opens the file itself.

- **Exact sanction and how it applies.** $25,000 per unfiled, incomplete or late 5472 (IRC §6038A(d)). If 90 days after IRS notice you still do not file, additional $25,000 per 30-day period, no explicit cap. The fine does NOT depend on LLC revenue: a $0 revenue LLC pays the same as a $500,000 one.
- **How the IRS finds out.** Three paths: (1) CRS/FATCA exchange with your residence country, (2) cross-check with US bank reporting non-resident accounts, (3) random audit of LLCs without historic filings. Detection probability is NOT zero; growing each year due to improved international exchange.
- **How to regularise before they open a file.** Voluntary late filing of 5472 + 1120 + "reasonable cause" letter justifying default (good-faith ignorance, wrong advisor, first time). IRS has a First-Time Penalty Abatement programme that can fully eliminate the fine if first failure and clean prior history. Filing BEFORE they notify is the difference between $0 and $25k.
- **How to regularise after IRS notice.** If CP15 or equivalent arrived, you have 30 days to respond with: immediate filing, payment under protest (pay first, appeal after), and formal abatement request with full file. Typical resolution: 4-6 months. Success probability on first-time + reasonable cause: 60-80%.

### What we are asked the most

**If I'm 3 years behind, is it $75,000?** Yes, $25k × 3 years, worst case. Voluntary regularisation with reasonable cause can significantly reduce or eliminate fines, especially if the rest of compliance (BOI, residence) is current. The earlier, the better.

**Can I close the LLC and "let them forget"?** No. Obligation for active years persists after dissolution. Closing without regularising worsens it: IRS interprets closure as sanction evasion. Regularise first, close after.

At Exentax we handle late-5472 regularisations (late filing + reasonable cause + abatement) and, in graver cases, delinquent international information return submission programmes - to minimise the fine, not to deny the problem.
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

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22There%20is%20one%20filing%20in%20the%20tax%20life%20of%20a%20single-member%20foreign-owned%20LLC%20that%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you want to see the full process in detail, check our <a href="/en/services">services page</a> with everything we cover.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
We review BOI, EIN, registered agent and federal obligations so a fine never catches you by surprise. <a href="/en/services">Request a compliance review</a>.
<!-- /exentax:cta-v1 -->

`;
