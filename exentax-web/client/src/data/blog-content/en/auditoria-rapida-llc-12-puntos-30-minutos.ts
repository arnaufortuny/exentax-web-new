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

<!-- exentax:calc-cta-v1 -->
> **Put numbers on your case.** The <a href="/en#calculadora">Exentax tax calculator</a> compares your current tax burden with what you would pay running a US LLC properly declared in your country of residence.
<!-- /exentax:calc-cta-v1 -->

At Exentax we review cases like this every week. If you want us to validate the result of your quick audit and prioritize the red flags without drama, book a free 30-minute initial session through our contact page.
### Related reading

- [critical mistakes if you already have a US LLC](/en/blog/critical-mistakes-if-you-already-have-an-llc-and-no-one-told)
- [I have a US LLC, am I managing it right?](/en/blog/i-have-an-llc-am-i-managing-it-right-real-checklist)
- [annual LLC maintenance](/en/blog/annual-llc-maintenance-obligations-you-cannot-ignore)
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
- **Revolut Business**: when paired with a **US LLC**, the usual setup runs through Revolut Payments USA; European IBANs (Lithuanian, BE) **are not issued by default** to a US LLC, they are issued to European clients of the group's European bank. If you are offered a European IBAN, confirm exactly which legal entity it sits with and which regime it reports under.
- **Zero tax**: no LLC structure delivers "zero tax" if you live in a country with CFC/tax transparency or income attribution rules. What you achieve is **no double taxation** and **correct reporting at residence**, not elimination.

<!-- exentax:legal-facts-v1 -->
## Legal & procedural facts

FinCEN and IRS reporting requirements moved recently; the current state is:

- **BOI / Corporate Transparency Act.** After **FinCEN's March 2025 interim final rule**, the BOI Report requirement was **narrowed to "foreign reporting companies"** (entities formed outside the US and registered to do business in a state). A **US-formed LLC owned by a non-resident is, as of today, outside that obligation**. The regulatory status can change again: **re-verify at FinCEN.gov at filing time**. If your LLC was formed before March 2025 and you already filed BOI, keep the acknowledgement and monitor future updates.
- **Form 5472 + pro-forma 1120.** For a **Single-Member LLC owned by a non-resident**, the final regulations of Treas. Reg. §1.6038A-1 (in force since 2017) treat the LLC as a corporation for 5472 purposes. Procedure: **pro-forma Form 1120** (header only: name, address, EIN, tax year) with **Form 5472 attached**. It is filed **by certified mail or fax to the IRS Service Center in Ogden, Utah**, **not e-filed via standard MeF**. Due date: **April 15**; extension via **Form 7004** to **October 15**. **Penalty: $25,000 per form per year, plus $25,000 per additional 30 days** of non-filing after IRS notice.
- **Substantive Form 1120.** Only applies if the LLC has filed a check-the-box election to C-Corp (Form 8832): it then pays 21 % federal corporate tax and files a substantive 1120. A standard disregarded LLC **does not file a substantive 1120 and does not pay federal corporate tax**.
- **EIN and notice.** Without an EIN you cannot file 5472 or BOI. The IRS does not warn before imposing penalties; you find out when an EIN is flagged or a later filing is rejected.
## We set it up without you losing a weekend

Thousands of freelancers and entrepreneurs already operate their US LLC fully legally and properly documented. At Exentax we handle the entire process: formation, banking, payment gateways, bookkeeping, IRS filings and compliance in your country of residence. Book a free consultation and we will tell you honestly whether the LLC makes sense for your case, with no absolute promises.
## How we work at Exentax

Our team specialises in international tax structures for residents of Spanish-speaking countries operating online businesses. We combine local knowledge of Spain, Andorra and Latin America with operational experience setting up entities in Delaware, Wyoming, Estonia and other jurisdictions. Every case starts with a free consultation in which we evaluate residency, activity and goals, and we honestly tell you whether the proposed structure makes sense or whether a simpler alternative is enough.

<!-- exentax:overhaul-today-v1 -->
## Exentax today update: verified essentials

Three concrete changes from the past year change how to score this audit today:

- **BOI Report (FinCEN).** After the *interim final rule* of 21 March 2025, US-formed LLCs with US beneficial owners are out of scope. **Foreign reporting companies** (entities formed outside the US and registered in a state) remain in scope. Check the current status on [fincen.gov/boi](https://www.fincen.gov/boi) before marking item 6 green.
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
<!-- exentax:overhaul-today-v1 end -->

<!-- exentax:execution-v2 -->
## How we run the quick audit at Exentax

A useful audit is not a witch hunt: it tidies the LLC in under thirty minutes and makes clear what must be fixed before the next filing. We run hundreds of these checklists every week and the twelve points that matter never change.

- **EIN, BOI and 5472 current** with copies reachable from any device, not buried in the founder's inbox.
- **Coherent banking**: ownership, address and business description aligned across Mercury, Wise or Relay to survive the first extended KYC.
- **Closed tax calendar** with federal, state and home-country deadlines on a single page.

To apply the same playbook now, run the <strong>Exentax calculator</strong> or book thirty minutes: you get the report with priorities and real closing cost, with no commitment.
<!-- /exentax:execution-v2 -->

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Call us at <a href="tel:+34614916910">+34 614 916 910</a> or message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22If%20you%20have%20had%20your%20LLC%20for%20a%20while%20and%20never%20run%20a%20complete%20review%2C%20this%20ar%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Editorial review pending</strong> — The following references require manual verification against the official current source. If you spot a discrepancy, write to us and we will correct it within 24 hours.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">90 %</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…uedes verificar tú mismo en treinta minutos y que cubren el 90 % de los problemas que vemo…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…la suma de cuentas, valores o cripto fuera del país supera 50.000 €, tienes obligación de …»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…un no residente**, las regulaciones finales de Treas. Reg. §1.6038A-1 (vigentes desde 2017…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…ga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y añ…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…, vigentes actualmente: - **Estados Unidos.** Treas. Reg. §301.7701-3 (clasificación check…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…. Reg. §301.7701-3 (clasificación check-the-box de la LLC), IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…sarelas y demostrar la existencia fiscal de la LLC. ### 5. Form 5472 + 1120 pro-forma del …»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…C como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo ca…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…a si la LLC ha realizado *check-the-box election* a C-Corp (Form 8832): entonces tributa a…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…ia fiscal internacional), Ley 27/2014 LIS, Ley 58/2003 LGT, RD 1065/2007 (Modelo 232 sobre…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
