export default `

Closing an LLC properly is as important as opening it. Most LLC content out there talks about how to form one, how to choose the state, how to open Mercury or Wise Business... but almost no one explains how to **shut it down** correctly. And yet a poorly dissolved LLC keeps generating obligations, penalties, fees and, in the worst case, a US tax shadow that can chase you for years.

This guide tells the real, complete process to **dissolve and close your US LLC**: when it makes sense, how to sequence the closure state by state, which final returns the <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> expects, what happens to your EIN, what to do with your BOI Report, how to cancel your bank accounts and why there is a strict order that should not be altered. If you are no longer operating your LLC and want to forget about it without surprises three years from now, this is the path.

## Why formally close an LLC instead of "letting it die"

The classic fantasy of the LLC owner who has had enough is: *"if I don't use it, I'll just leave it and the obligations will fade by themselves"*. It does not work that way. An LLC, while **active or "delinquent"** in its state register, keeps generating:

- **State annual report fees** (USD 50 to 800 depending on state).
- **Franchise tax** in Delaware (USD 300/year) and California (USD 800/year), among others.
- **Registered Agent fees** annually (USD 50-150).
- **Form 5472 + 1120 pro forma** before the IRS if the LLC has a single foreign owner, with the **USD 25,000 penalty per unfiled form** (Internal Revenue Code §6038A(d)).
- **BOI Report (<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>)** if your LLC remains within scope under the rules in force.
- Possible bank account fees on Mercury, Wise Business, Relay or Slash.

If the LLC drifts into *delinquent* or *administratively dissolved* status due to unpaid annual reports, that **does not exempt you** from IRS obligations or accrued penalties. It only complicates your life when you eventually try to close properly or, worse, when you want to form another LLC years later and discover that you appear as the owner of an entity with accumulated penalties. The best strategy by far is **a clean, formal closure** in the right order.
### Before you start: closure only happens when you are sure

Not every "I want to close" is real. Before starting, check that closure makes sense against the alternatives:

- **Pause operations temporarily**, keeping the LLC alive but with zero activity, filing 5472 + 1120 with zeros and the BOI report when applicable. This is reasonable if you think you might use it again within two years.
- **Change structure** (single-member to multi-member, or form a new entity and transfer contracts) if what changes is the business model, not the will to continue.
- **Move state** through *domestication* or *conversion* if what weighs on you are taxes or reporting in your current state.

If after reviewing these options you still want to close, this is the procedure. Each case is individual, so review yours with an advisor before executing.
### Overview: order matters

Closing an LLC is made up of **seven blocks** to be executed in this order. Skipping one or inverting the order usually leads to unnecessary costs or windows in which the LLC keeps generating obligations while you are no longer managing it:

1. Formal decision to dissolve (internal).
2. Operational wind-down (clients, contracts, debts, assets).
3. Closing of bank accounts and payment gateways.
4. Filing of final returns with the IRS (Form 1120 + 5472 marked *Final return*).
5. State dissolution (Articles of Dissolution or Certificate of Cancellation).
6. EIN closure with the IRS and BOI Report wind-down with FinCEN where applicable.
7. Cancellation of the Registered Agent and personal document archive.

Let us walk through each block with the detail that actually matters.
## Key points

### 1. Internal decision and Operating Agreement

Even if your LLC is *single-member* and you are the sole owner, the formal decision to dissolve must be documented. A well-drafted operating agreement requires it explicitly:

- **Resolution to dissolve**: an internal document where the sole member decides to dissolve the LLC, with an effective date.
- If the LLC is *multi-member*, a vote according to the percentage required by the operating agreement is needed (typically unanimity or qualified majority).

This document is not filed with the IRS or with the state, but it is the internal proof that the decision exists and that the closure is being executed in good faith. If anyone later asks when you stopped operating the LLC, that date is the one that counts.
### 2. Operational wind-down: clients, debts and assets

Before touching anything with the IRS or the state, the LLC must be **emptied**:

- **Closing of contracts with clients and vendors.** Notify the cessation of activity. Issue final invoices. Collect what is pending.
- **Cancellation of subscriptions** (Stripe, PayPal, SaaS tools, domains billed to the LLC, hosting).
- **Payment of pending debts** (state taxes, Registered Agent, invoices, royalties, fees).
- **Distribution of remaining assets to the member** (transfer the cash from the LLC account to your personal account). In a single-member LLC taxed as a disregarded entity, this distribution is not a taxable event for the IRS, but **it must be documented** as a member draw.
- **Bookkeeping retention** (issued and received invoices, bank statements, vouchers) for at least **seven years**. This is the reasonable horizon for audits, interest and possible information requests.

Once the LLC is empty and free of live contracts, we can move on to the bank closure.
### 3. Closing bank accounts and payment gateways

Bank closure is where most mistakes happen. The practical rule:

- **Move all cash to a personal account of the member** before requesting closure.
- **Request closure in writing** from the bank/fintech dashboard. Mercury, Wise Business, Relay and Slash all have online closure flows. Wallester handles closure through their support area.
- **Wait for confirmed closure** before filing the state dissolution. If you file the state dissolution and the bank discovers the entity no longer exists legally, it usually freezes pending movements.
- **Download every statement** (at least seven years back) before closing. Once closed, recovering them can be impossible or expensive.
- **Cancel Stripe, PayPal and gateways** linked to the LLC and download the transaction history.

> If your current stack is Wise Business + Relay + Slash with Mercury as backup, that is exactly the reverse order of closure: first the gateways, then the secondary fintech, and finally the main account through which the last cash flows. Wallester, if you have it with a European IBAN, tends to be among the last and should be reviewed in light of your CRS obligations in Spain.
### 4. Final returns with the IRS

This is where many closures break. The LLC, before dying, has to file its **final IRS season**, marking the forms as **Final return**:

- **Form 1120 + Form 5472 (Final)** if your LLC is single-member with a foreign owner. The *"Final return"* box on Form 1120 must be ticked and the Form 5472 reportable information must include the **final cash distribution** to the member.
- **Form 1065 (Final)** if your LLC was multi-member taxed as a partnership.
- **Form 1120 or 1120-S (Final)** if you elected C-corp or S-corp taxation.
- **Form 966 (Corporate Dissolution or Liquidation)** within the **30 days** following the dissolution resolution, if the LLC was taxed as a corporation.
- **Form 941 / 940 final** if you had employees.
- Any pending information returns (1099, W-2, 8804/8805 if applicable).

The key date is: file the final returns **before requesting the EIN closure**. If you ask for EIN closure without having filed the final returns, the IRS will not close the EIN and may, even worse, generate a non-filer notice the following year.

If you have been carrying the LLC for years and have accumulated 5472 backlogs, **the right move is to clean up before closing**, not close to bury the issue. The detail of the specific risk is in the <a href="/en/blog/what-happens-if-you-dont-file-form-5472-irs-penalties-and">Form 5472 penalty guide</a>. Closing an LLC with pending 5472s does not extinguish accrued penalties; it only freezes them and the IRS keeps them against you as the individual associated with the EIN.
### 5. State dissolution: Articles of Dissolution or Certificate of Cancellation

With cash distributed, accounts closed and final returns filed, we move on to the **state closure**. The exact name of the document depends on the state:

- **Wyoming**: *Articles of Dissolution* with the Wyoming Secretary of State. Before filing them you must be current on the **annual report** and the **license tax**. Typical cost: USD 60.
- **New Mexico**: *Articles of Dissolution* with the New Mexico Secretary of State. The LLC must be up to date with any applicable state tax. Typical cost: USD 25.
- **Delaware**: *Certificate of Cancellation* with the Delaware Division of Corporations. You must pay the **outstanding franchise tax and the franchise tax for the closure year** before cancelling. Cancellation cost: USD 200; the franchise tax (USD 300/year) is added on top.
- **Florida**: *Articles of Dissolution* with the Florida Division of Corporations.
- **California**: if there was nexus in California, you must pay the **USD 800 minimum franchise tax for the closure year** plus file final Form 568.
- **Other states**: each has its own form and fees; the logic is the same.

An important detail: if your LLC is **registered as a foreign LLC in other states** (because you did *foreign qualification* to sell in California, Texas, NY, etc.), before closing in the *home* state you must **cancel each foreign registration**. Otherwise, those states will keep charging annual reports and franchise taxes for years.
### 6. EIN closure and BOI Report wind-down

Once the LLC no longer exists legally (state dissolved + final returns filed), the last step with the IRS is to **close the EIN**. Technically, the IRS does not "delete" an EIN: it marks it as inactive. To do so, a **signed letter to the Internal Revenue Service** is sent identifying the entity by legal name, EIN, address and reason for closure, attaching a copy of the original *Notice CP-575* or, failing that, the EIN assignment data.

In parallel, the **BOI Report with FinCEN** must be reviewed. The current Beneficial Ownership Information regulations require initial and update reports; when the LLC dissolves, it makes sense to update the report to reflect the cessation, within the deadlines set by FinCEN. The BOI regime has had recent changes and suspensions, so check the rule in force at the exact moment of closure.

If you have your own ITIN, or if there are partners with ITINs associated with the LLC, those ITINs are not "closed" with the LLC: they remain valid for your personal US activity as long as you use them periodically (see <a href="/en/blog/how-to-get-an-itin-irs-individual-tax-number">ITIN guide</a>).
### 7. Registered Agent, domains and personal archive

To close the loop:

- **Cancel the Registered Agent**: notify in writing and ask for cancellation confirmation. If your Registered Agent renews by default each year, this is what avoids a surprise invoice next year.
- **Cancel domains and services** billed to the LLC name.
- **Archive the final documentation** in a safe place: original operating agreement, articles of organization, sealed articles of dissolution, EIN confirmation, copy of the final returns (1120, 5472, 1065, 966), bank statements, closed contracts. Minimum seven years.

That is when the LLC is clinically closed.
### Typical mistakes we see when closing an LLC

At Exentax we have seen closures executed backwards dozens of times. The six most expensive mistakes:

1. **Closing the bank before filing the final 5472.** Documenting the last distribution becomes hard afterwards.
2. **Filing state dissolution without paying the pending franchise tax** (Delaware and California are the strictest).
3. **Forgetting to cancel foreign qualifications** in other states.
4. **Not ticking Final return on the 1120 / 1065.** The IRS keeps expecting a return next year.
5. **Not updating the BOI Report** when regulations require it.
6. **Not retaining bank statements** downloaded before closure.

Each of these mistakes translates into invoices, penalties or notices months or years later.
## How we do it at Exentax

Our **turnkey LLC closure** process follows exactly the seven steps in this guide. You give us the context (state, formation year, banking situation, returns filed, possible delays), we design the closure order, execute the final returns, coordinate with your Registered Agent and your banks, file the state dissolution, close the EIN and, where applicable, update the BOI Report. If you have been carrying late 5472s for years and need to clean up before closing, we do it as a **prior phase** of the closure to avoid dragging exposure forward.

If you want to close your LLC safely, book a free consultation: we review your situation, we tell you honestly whether it makes more sense to close or to pause, and if we go ahead we deliver a closure plan with dates and a closed quote. And if what you are thinking is the opposite, that the LLC still makes sense but you want to lower costs and obligations, try our <strong>tax calculator</strong> first and compare your current situation with the scenario of keeping it active with the right stack: <a href="/en/blog/wise-banks-and-your-llc-the-complete-banking-stack-nobody">Wise Business, Relay and Slash as operating accounts, Mercury as backup, and Wallester only when you need a European IBAN</a> with its corresponding CRS analysis.

Closing an LLC well is an act of tax hygiene: it tidies up your past and frees your future. It is worth doing in the right order and with someone who has done it hundreds of times.
## Tax compliance in your country: CFC, controlled-foreign rules and income attribution

A US LLC is a fully legal, internationally recognized vehicle. But compliance does not end at incorporation: as an owner who is tax-resident elsewhere, your local tax authority still has the right to tax what the LLC earns. The key is **under which regime**.

### By jurisdiction

- **Spain (LIRPF/LIS).** An operative single-member disregarded LLC (real services, no significant passive income) is generally treated under **income attribution (art. 87 LIRPF)**: the LLC's net profits are attributed to the member in the year they arise and integrated into the general IRPF base. If instead the LLC elects corporation treatment (Form 8832) and is controlled by a Spanish resident with mostly passive income, the **CFC regime (art. 91 LIRPF for individuals, art. 100 LIS for companies)** can apply. The choice is not optional: it depends on economic substance, not on the label.
- **Information returns.** US bank accounts with average or year-end balance >€50,000: **Form 720** (Law 5/2022 after CJEU C-788/19, 27/01/2022, penalties now under the general LGT regime). Related-party transactions and dividend repatriation: **Form 232**. US-custodied crypto: **Form 721**.
- **Spain–US tax treaty.** The treaty (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol in force 27/11/2019) governs double taxation on dividends, interest and royalties. An LLC without a permanent establishment in Spain does not by itself create a PE for the member, but effective management can if all activity is run from Spanish territory.
- **Mexico, Colombia, Argentina and other LATAM jurisdictions.** Each has its own CFC regime (Mexico: Refipres; Argentina: foreign passive income; Chile: art. 41 G LIR). Common principle: profits retained inside the LLC are deemed received by the member if the entity is treated as transparent or controlled.
Practical rule: an operative LLC with substance, properly declared in your country of residence, is **legitimate tax planning**. An LLC used to hide income, fake non-residence or shift passive income with no economic justification falls within **art. 15 LGT (anti-abuse)** or, worse, **art. 16 LGT (simulation)**. The facts decide, not the paperwork.

<!-- exentax:calc-cta-v1 -->
> **Put numbers on your case.** The <a href="/en#calculadora">Exentax tax calculator</a> compares your current tax burden with what you would pay running a US LLC properly declared in your country of residence.
<!-- /exentax:calc-cta-v1 -->

At Exentax we structure the entity to fit the first scenario and document every step so your local return can be defended in case of review.

<!-- exentax:legal-refs-v1 -->
## Legal and regulatory references

This article relies on rules currently in force. Main sources for verification:

- **United States.** Treas. Reg. §301.7701-3 (entity classification / *check-the-box*); IRC §882 (tax on foreign income effectively connected with a US trade or business); IRC §871 (FDAP and withholding on non-residents); IRC §6038A and Treas. Reg. §1.6038A-2 (Form 5472 for *25% foreign-owned* and *foreign-owned disregarded entities*); IRC §7701(b) (tax residency, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report to FinCEN).
- **Spain.** Law 35/2006 (LIRPF), arts. 8, 9 (residency), 87 (income attribution), 91 (CFC for individuals); Law 27/2014 (LIS), art. 100 (CFC for companies); Law 58/2003 (LGT), arts. 15 (anti-abuse) and 16 (simulation); Law 5/2022 (Form 720 penalty regime after CJEU C-788/19 of 27/01/2022); RD 1065/2007 (Forms 232 and 720); Order HFP/887/2023 (Form 721 crypto).
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
- **Revolut Business**: when paired with a **US LLC**, the usual setup runs through Revolut Payments USA; European IBANs (Lithuanian, BE) **are not issued by default** to a US LLC, they are issued to European clients of the group's European bank. If you are offered a European IBAN, confirm exactly which legal entity it sits with and which regime it reports under.
- **Zero tax**: no LLC structure delivers "zero tax" if you live in a country with CFC/tax transparency or income attribution rules. What you achieve is **no double taxation** and **correct reporting at residence**, not elimination.

<!-- exentax:legal-facts-v1 --><!-- exentax:execution-v2 -->
## The exact sequence to close an LLC without leaving loose ends

Dissolving an LLC poorly costs more than incorporating it. Three planes must close simultaneously - state, federal and banking - and the order matters. This is the sequence we apply at Exentax when a client decides to close.

- **Step 1 - Documented decision.** Dissolution resolution signed by members, with clear date and reason. If the LLC has an Operating Agreement, follow its procedure; if not, state law applies. Without the resolution, nothing else closes properly.
- **Step 2 - Articles of Dissolution to the state.** Each Secretary of State publishes its own dissolution fee and requires any pending franchise tax to be cleared before filing. Dissolution takes effect on the date approved by the Secretary of State, not before. From that point the LLC enters wind-up: may liquidate but not run new business.
- **Step 3 - Operational wind-down.** Collect pending invoices, pay suppliers, return deposits, cancel SaaS subscriptions, kill cards, empty Mercury/Wise within the wind-up period. Close bank accounts after the last payment, not before - no account, no final collection.
- **Step 4 - Final Form 5472 + 1120 pro forma.** Tick "Final Return" on both forms. Without it, the IRS keeps expecting 5472 each year with a USD 25,000 omission penalty. The most expensive and most common error.
- **Step 5 - BOI Final Report.** FinCEN requires a final BOI report on entity cease, within 30 days of state dissolution. Without it, possible civil penalties.
- **Step 6 - EIN cancellation (optional).** Letter to the IRS requesting EIN account closure. Not strictly mandatory (EIN persists but goes dormant), but recommended for administrative tidiness.

### What we are asked the most

**How long does closing an LLC take?** Between 6 and 14 weeks from decision to final filing. State dissolution processes in 2-4 weeks; the final 5472 is filed in the next tax window (April 15 on calendar year).

**What if I have unfiled 5472 for years and want to close?** First regularise the missing years through voluntary disclosure. Dissolution without regularisation does not erase the penalties - they remain attached to the responsible party. We handle it with a joint regularisation + closure protocol.

At Exentax we close LLCs every month and deliver the full dossier (resolution, articles, final 5472, final BOI, EIN closure) signed and archived so the client can prove a clean dissolution against any future request.
<!-- /exentax:execution-v2 -->

## Legal & procedural facts

FinCEN and IRS reporting requirements moved recently; the current state is:

- **BOI / Corporate Transparency Act.** After **FinCEN's March 2025 interim final rule**, the BOI Report requirement was **narrowed to "foreign reporting companies"** (entities formed outside the US and registered to do business in a state). A **US-formed LLC owned by a non-resident is, as of today, outside that obligation**. The regulatory status can change again: **re-verify at FinCEN.gov at filing time**. If your LLC was formed before March 2025 and you already filed BOI, keep the acknowledgement and monitor future updates.
- **Form 5472 + pro-forma 1120.** For a **Single-Member LLC owned by a non-resident**, the final regulations of Treas. Reg. §1.6038A-1 (in force since 2017) treat the LLC as a corporation for 5472 purposes. Procedure: **pro-forma Form 1120** (header only: name, address, EIN, tax year) with **Form 5472 attached**. It is filed **by certified mail or fax to the IRS Service Center in Ogden, Utah**, **not e-filed via standard MeF**. Due date: **April 15**; extension via **Form 7004** to **October 15**. **Penalty: $25,000 per form per year, plus $25,000 per additional 30 days** of non-filing after IRS notice.
- **Substantive Form 1120.** Only applies if the LLC has filed a check-the-box election to C-Corp (Form 8832): it then pays 21 % federal corporate tax and files a substantive 1120. A standard disregarded LLC **does not file a substantive 1120 and does not pay federal corporate tax**.
- **EIN and notice.** Without an EIN you cannot file 5472 or BOI. The IRS does not warn before imposing penalties; you find out when an EIN is flagged or a later filing is rejected.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Call us at <a href="tel:+34614916910">+34 614 916 910</a> or message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22como%20disolver%20cerrar%20llc%20paso%20a%20paso%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Editorial review pending</strong> — The following references require manual verification against the official current source. If you spot a discrepancy, write to us and we will correct it within 24 hours.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">25.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…si la LLC tiene dueño extranjero único, con la **sanción de 25.000 USD por formulario no p…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…os.** Cuentas bancarias en EE. UU. con saldo medio o final &gt;50.000 € en el ejercicio: **Mo…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…es para que puedas verificarlo: - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de en…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…P y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25%…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25%</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…ntes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §882</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…§301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre renta…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §871</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…r business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fisca…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…. - **Registered Agent fees** anuales (50-150 USD/año). - **Form 5472 + 1120 pro forma** a…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…pago. 4. Presentación de declaraciones finales ante el IRS (Form 1120 + 5472 marcados *Fin…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1065</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…incluir la **distribución final** del cash al miembro. - **Form 1065 (Final)** si tu LLC e…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 966</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…-S (Final)** si elegiste tributar como C-corp o S-corp. - **Form 966 (Corporate Dissolutio…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 941</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…ón de disolución, si la LLC tributaba como corporación. - **Form 941 / 940 final** si tení…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 568</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…anchise tax mínimo del año del cierre** además de presentar Form 568 final. - **Otros esta…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…cionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…oopener&quot;&gt;OCDE&lt;/a&gt;.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronteri…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514,…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…s), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiv…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
