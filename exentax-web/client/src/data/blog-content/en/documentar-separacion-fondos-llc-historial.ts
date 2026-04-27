export default `If your LLC has been operating for a while and the separation between your personal money and the LLC's money is not perfectly documented, you have a problem in waiting. It does not show today; it shows the day a bank does an in-depth review, the <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> asks for documentation, or your country's tax authority requests a trace of capital flows.

This article is the procedure to reconstruct and document fund separation when the history is messy.

## Why fund separation matters

Three reasons, in order of seriousness:

### 1. Corporate veil

Mixing personal and LLC money is the textbook example of behavior that allows piercing the corporate veil. If at some point you face a claim against the LLC, the other side will look at the bank statements first. Mixed flows weaken the limited liability that motivated forming the LLC in the first place.

### 2. Form 5472

For non-resident SMLLCs, the 5472 must report any transaction between the foreign shareholder (you) and the LLC. If those flows are not separated and documented, the 5472 is either incomplete or fictional.

### 3. KYC and banking

When Mercury, Wise, Relay or any other platform conducts an in-depth review, the first thing they look at is whether the flows match the declared activity. Personal flows on the LLC card complicate the conversation immediately.
### What separation actually means

Three concrete rules:

- **Income from clients to LLC accounts only**, never to your personal account.
- **LLC business expenses paid only with LLC cards or accounts**, never with your personal card.
- **Movements between you and the LLC**, in either direction, formally documented as Capital Contribution, Owner Distribution or Loan, with a clear concept on the bank statement.

It looks obvious. Almost no LLC executes it without lapses in the first 18 months.
## How to reconstruct documentation when the history is messy

When you reach this article and find irregularities going back, the procedure is the following:

### Step 1. Map the last 12-24 months

Download statements from all LLC accounts and your personal account in CSV. Identify any movement between you and the LLC, in either direction, with date and amount.

### Step 2. Classify each movement

Each one falls in one of four categories:

- **Capital Contribution**: you put money into the LLC for operating purposes.
- **Owner Distribution**: the LLC pays you a distribution.
- **Loan to/from member**: temporary loan that requires repayment.
- **Reimbursement of business expense paid personally**: you paid a business expense with your personal card and the LLC reimburses you.

If a movement does not fit any of the four, it is a movement that should not have happened. Keep classifying for now and address that separately.

### Step 3. Generate retroactive documentation

For each movement classified, generate written backup:

- **Capital Contribution**: brief written entry signed by you on the date of the contribution stating the amount and purpose. Recorded in the Member's Capital Account in your bookkeeping.
- **Distribution**: brief written entry signed by you on the date of the distribution stating amount, source profit and recipient.
- **Loan**: a simple Promissory Note with date, amount, repayment schedule and interest rate (even at AFR minimum).
- **Reimbursement**: copy of original invoice or receipt + written entry in your accounting tool.

This is not retroactive lying; it is documenting the substance of what was done. The substance was real (you really did put money in or pay an expense); what was missing was the paper.

### Step 4. Adjust your bookkeeping

Each documented movement gets recorded in your accounting tool with the corresponding category. If you do not have a tool, this is the moment to start with QuickBooks, Xero, Wave or similar.

### Step 5. Forward-looking rules of the road

From today, three operational rules to never repeat the issue:

- **No LLC business expense on your personal card.** If it happens accidentally (an Uber to a meeting), document the reimbursement that same week.
- **No personal expense on the LLC card.** Period. Removing the temptation is to physically separate cards in your wallet.
- **All movements between you and the LLC** with a clear concept: "Owner Distribution Q4 today", "Capital Contribution Project X", "Reimbursement Conference Travel".
### What about the past that has no backup?

Unrecoverable cases happen: a transfer with no concept three years ago that no one remembers what it was for. The professional approach:

- **Document with what is reasonable**: based on context (date, amount, surrounding flows) classify it in the most plausible of the four categories.
- **Do not invent receipts or invoices**: if backup does not exist, do not generate fake backup. Document with what exists.
- **Pick the most conservative classification** in case of doubt: a movement of unclear origin is treated as Distribution (because it taxes), not as Reimbursement (because it does not tax).
## How we approach it at Exentax

At Exentax we do this exercise every month with clients arriving from accumulated technical debt. The mechanics are exactly the one described. The result is a clean accounting and an LLC that survives any review without drama.

If you suspect your separation history has gaps and want to put it in order before someone asks for it, book a free initial session through our contact page.

_More on this topic: [piercing the corporate veil: how to avoid it](/en/blog/separating-personal-and-llc-finances-why-it-matters), [bookkeeping for your LLC: best practices](/en/blog/bookkeeping-for-your-us-llc-step-by-step), [Form 5472: when to file it and what penalty applies](/en/blog/what-happens-if-you-dont-file-form-5472-irs-penalties-and)._

<!-- related-inline-stripped-2026-04 -->

### Next steps

If you want to validate whether this strategy fits your specific situation, at Exentax we review your case personally and propose the legal and efficient structure that actually fits you. Book a free initial session through our contact page.

<!-- exentax:banking-facts-v1 -->
## Banking and tax facts worth clarifying

Fintech and CRS information evolves; here is the current state:

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Free consultation, no strings attached</a>
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

<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a> and IRS reporting requirements moved recently; the current state is:

- **BOI / Corporate Transparency Act: your LLC is NOT required to file (a competitive advantage).** After **FinCEN's March 2025 interim final rule**, the BOI Report obligation was **narrowed to "foreign reporting companies"** (entities formed OUTSIDE the US and registered to do business in a state). A **US-formed LLC owned by a non-resident does NOT file the BOI Report**: one fewer filing on your calendar, less paperwork, and a cleaner structure than ever. If your LLC was formed before March 2025 and you already filed BOI, keep the acknowledgement. The regulatory status can change again: **we monitor FinCEN.gov on every filing** and, if the obligation comes back, we handle it at no extra cost. Current status verifiable at [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + pro-forma 1120.** For a **Single-Member LLC owned by a non-resident**, the final regulations of Treas. Reg. §1.6038A-1 (in force since 2017) treat the LLC as a corporation for 5472 purposes. Procedure: **pro-forma Form 1120** (header only: name, address, EIN, tax year) with **Form 5472 attached**. It is filed **by certified mail or fax to the IRS Service Center in Ogden, Utah**, **not e-filed via standard MeF**. Due date: **April 15**; extension via **Form 7004** to **October 15**. **Penalty: $25,000 per form per year, plus $25,000 per additional 30 days** of non-filing after IRS notice.
- **Substantive Form 1120.** Only applies if the LLC has filed a check-the-box election to C-Corp (Form 8832): it then pays 21 % federal corporate tax and files a substantive 1120. A standard disregarded LLC **does not file a substantive 1120 and does not pay federal corporate tax**.
- **EIN and notice.** Without an EIN you cannot file 5472 or BOI. The IRS does not warn before imposing penalties; you find out when an EIN is flagged or a later filing is rejected.
## Legal and procedural facts

Read this section as a checklist with teeth: each point flags a real failure mode we have seen in cross-border LLC files. Skip none of them - most reassessments and account closures we clean up later trace back to one of these items.
## References: regulation for operational management

We treat this block as one of the load-bearing decisions of the LLC strategy: get it wrong and the rest of the structure leaks tax, banking access or compliance. The notes below distil what we actually do with clients facing this exact case, prioritising the variables that move the needle.

<!-- exentax:execution-v2 -->
## How to build a separation history that survives a review

Fund separation is not a bookkeeping nice-to-have: it is the line dividing "operating LLC" from "LLC re-read as your personal account" by an inspector or by the bank. Without a documented track record, the piercing-the-corporate-veil doctrine becomes viable and the shield disappears.

- **Single source of inflows.** Every credit to Mercury, Relay or Wise Business must carry an invoice, contract or memo. Intercompany LLC-to-LLC transfers get an explicit concept ("loan repayment", "intercompany services"). A transfer without traceability equals an undocumented distribution and opens the door to recharacterisation.
- **Outflows with fiscal rationale.** Supplier payments with invoice attached in the ERP; salaries or member draws with bookkeeping entry and, where due, withholding planned; member-expense reimbursements with prior expense report. Without that trace, the IRS or your home tax authority can recategorise the flow as a hidden distribution.
- **Dedicated cards.** A personal card run through the LLC account contaminates the whole year. Mercury issues virtuals by category: one for SaaS, one for ads, one for travel. If the member needs personal spending, they use their private account and reimburse via expense report - never the other way around.
- **Living documentation, not dead archive.** Shared folder with signed Operating Agreement, annual minutes, expense reports, intra-group service contracts. It is the first thing a bank asks for in enhanced KYC and the first thing an inspection requests.

### What we are asked the most

**Is it valid to pay myself from the LLC?** Yes, via a member draw recorded in the minutes and reflected in bookkeeping. What is not valid is withdrawing without a record or periodicity, or paying personal expenses (groceries, private restaurants) straight from the LLC account.

**What if I have been mixing everything for two years?** It can be rebuilt backwards: statements, recategorisation, corrective minutes and retroactive expense reports. Not elegant, but defensible. Better to start now than keep aggravating.

At Exentax we set up that documentary structure from day one and review each close so the history stays defensible.
<!-- /exentax:execution-v2 -->

## Your next step with Exentax

Our position here is deliberate and conservative: we optimise for what survives an inspection, not for the most aggressive headline number. The points below are the ones we are willing to defend in writing.
### Before you start: the founding principle

Most of the avoidable damage we see in this exact point comes from skipping the documentation step, not from the underlying tax logic.

### Step 1. Bound the commingling period

Field note from running this for clients month after month: the rule is straightforward, the execution is where it breaks. Plan the operational side before the legal side.

### Step 2. Gather complete statements

If it is not clean here, every downstream assumption becomes negotiable in front of the authority.

### Step 3. Classify each transaction

### Step 4. Generate the correct accounting entries

Field note from running this for clients month after month: the rule is straightforward, the execution is where it breaks. Plan the operational side before the legal side.

### Step 5. Update the Operating Agreement if applicable

If it is not clean here, every downstream assumption becomes negotiable in front of the authority.

### Step 6. Prepare a clean-up memo

Field note from running this for clients month after month: the rule is straightforward, the execution is where it breaks. Plan the operational side before the legal side.

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
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22If%20your%20LLC%20has%20been%20operating%20for%20a%20while%20and%20the%20separation%20between%20your%20pe%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->

`;
