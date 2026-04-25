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
### Related reading

- [piercing the corporate veil: how to avoid it](/en/blog/separating-personal-and-llc-finances-why-it-matters)
- [bookkeeping for your LLC: best practices](/en/blog/bookkeeping-for-your-us-llc-step-by-step)
- [Form 5472: when to file it and what penalty applies](/en/blog/what-happens-if-you-dont-file-form-5472-irs-penalties-and)
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
- **Revolut Business**: when paired with a **US LLC**, the usual setup runs through Revolut Payments USA; European IBANs (Lithuanian, BE) **are not issued by default** to a US LLC, they are issued to European clients of the group's European bank. If you are offered a European IBAN, confirm exactly which legal entity it sits with and which regime it reports under.
- **Zero tax**: no LLC structure delivers "zero tax" if you live in a country with CFC/tax transparency or income attribution rules. What you achieve is **no double taxation** and **correct reporting at residence**, not elimination.

<!-- exentax:legal-facts-v1 -->
## Legal & procedural facts

<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a> and IRS reporting requirements moved recently; the current state is:

- **BOI / Corporate Transparency Act.** After **FinCEN's March 2025 interim final rule**, the BOI Report requirement was **narrowed to "foreign reporting companies"** (entities formed outside the US and registered to do business in a state). A **US-formed LLC owned by a non-resident is, as of today, outside that obligation**. The regulatory status can change again: **re-verify at FinCEN.gov at filing time**. If your LLC was formed before March 2025 and you already filed BOI, keep the acknowledgement and monitor future updates.
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

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Call us at <a href="tel:+34614916910">+34 614 916 910</a> or message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22If%20your%20LLC%20has%20been%20operating%20for%20a%20while%20and%20the%20separation%20between%20your%20pe%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Editorial review pending</strong> — The following references require manual verification against the official current source. If you spot a discrepancy, write to us and we will correct it within 24 hours.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">1.603</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…un no residente**, las regulaciones finales de Treas. Reg. §1.6038A-1 (vigentes desde 2017…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…ga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y añ…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…, vigentes actualmente: - **Estados Unidos.** Treas. Reg. §301.7701-3 (clasificación check…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…. Reg. §301.7701-3 (clasificación check-the-box de la LLC), IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…nte, una mezcla histórica complica: - La preparación del **Form 5472**, que requiere docum…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…C como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo ca…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…a si la LLC ha realizado *check-the-box election* a C-Corp (Form 8832): entonces tributa a…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…ia fiscal internacional), Ley 27/2014 LIS, Ley 58/2003 LGT, RD 1065/2007 (Modelo 232 sobre…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
