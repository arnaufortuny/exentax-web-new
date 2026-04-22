export default `If you have an LLC and your banking is "Mercury for everything because that is what they told me", you are leaving money and reliability on the table. Mercury is excellent for many use cases, but the optimal banking architecture for an active LLC is rarely a single account in a single platform. Most often it is a thoughtful combination of two or three.

This article is the diagnostic and reorganization framework we apply at Exentax for LLCs that have grown out of their original setup.

## When it is time to reorganize banking

Three signals you have outgrown your initial setup:

1. **You handle multiple currencies** (USD, EUR, GBP) and you are paying conversion fees that are not negligible.
2. **You receive payouts from multiple processors** (Stripe, PayPal, Wise, Amazon, Shopify) and reconciling at month-end is increasingly painful.
3. **You have suffered a temporary block or restrictive review** on your main account that highlighted you have no operational backup.

If any of the three is on your list, the reorganization pays off in months.
### The three reference players

For US LLCs operated by non-residents, the three platforms that matter today:

### Mercury

Strengths: best US-domestic UX, integrated bookkeeping (Mercury Raise), excellent virtual cards, generous free tier, integration with most modern accounting tools. Limitations: USD only as primary currency, less competitive FX, KYC reviews can be strict for high-volume international flows.

### Wise Business

Strengths: native multi-currency (USD, EUR, GBP, plus 40+), real interbank FX, IBANs in EUR for clean European receipts, USD account with US wire details. Limitations: not a US bank (it is an EMI), more limited integrated card features than Mercury.

### Relay

Strengths: solid US bank, multiple sub-accounts within a single account (up to 20), team-friendly permissions, good integrations. Limitations: less polished UX than Mercury, less consumer-friendly card features.
### Reference architectures by case

### Case 1: digital service LLC, primarily USD, low volume

**Mercury alone** is enough. Add Wise only if you have notable receipts in EUR or GBP.

### Case 2: SaaS or e-commerce with multi-currency receipts

**Mercury (primary USD) + Wise (multi-currency receipts)**. Stripe payouts to Mercury; PayPal in EUR converted at Wise; ad-hoc currency conversions through Wise. Settles 80-90% of cases.

### Case 3: agency or operation with multiple business lines

**Relay (segregated sub-accounts per line) + Wise (multi-currency)**. Relay sub-accounts for "operating", "taxes set-aside", "owner draw", "buffer". Wise as currency hub. Mercury as backup if needed.

### Case 4: high volume with constant currency rotation

**Mercury + Wise + a banking backup** (Relay or a fintech of your choice). The third player matters because if Mercury or Wise goes into review, you have continuity.
## Reorganization principles

### Principle 1. Specialized accounts, not split-on-a-whim accounts

Each account in your stack should have a clear, defensible purpose: "this is where Stripe payouts land", "this is where I set taxes aside", "this is where I receive EUR invoices". A bookkeeper should be able to read your stack at a glance.

### Principle 2. KYC-friendly flows

Each account should see flows that match what was declared at opening. A "primary account" that suddenly receives crypto payouts will trigger a review. Pre-declare to the platform what you intend to do or move that activity to a different platform.

### Principle 3. Operational redundancy

At least two operational accounts at any time, in two different providers. If one goes into review, the other keeps things running.

### Principle 4. Bookkeeping integration

Whatever stack you choose, make sure it integrates with your accounting tool (QuickBooks, Xero, Wave). The cost of a stack with no automated integration is paid every month for years.
### Migration procedure without breaking the operation

When you decide to reorganize:

1. **Open the new accounts** while keeping the existing one fully active. 4-8 weeks for KYC.
2. **Migrate flows progressively**: this client to the new account next month, that processor in the second month, etc. Never all at once.
3. **Update billing details** with each client/processor in writing, with effective date.
4. **Maintain the old account as backup** for at least 90 days after the last flow has migrated, to catch any straggler.
5. **Close the old account orderly** with formal closing letter, retaining 12-month statement history downloaded.

A clean migration takes 3-6 months. Trying to do it in two weeks generates failed receipts that go missing.
### Common errors

- **Closing the old account before the new one is fully operational and tested**.
- **Splitting flows across accounts without writing the rule down**: in three months no one remembers what was supposed to go where.
- **Opening too many accounts**: every account is KYC, fees and bookkeeping work. More than four operational accounts is rarely justified.
- **Forgetting to update the billing details for recurring subscriptions** (Google Workspace, AWS, etc.) that automatically charge the closed card.
### How we approach it at Exentax

At Exentax we design banking stacks based on real flows, not on what is fashionable. We map your incoming and outgoing flows, identify the right architecture and accompany the migration over 3-6 months without you losing a payment.

If your current banking is "I think it works but I am not sure", book a free initial session through our booking page. In 30 minutes we tell you what to keep and what to change.
## A balanced banking stack: Mercury, Relay, Slash and Wise

There is no perfect account for an LLC. There is the right **stack**, where each tool plays a role:

- **Mercury** (operated as a fintech with partner banks (Choice Financial Group and Evolve Bank & Trust primarily; Column N.A. on legacy accounts), FDIC via sweep network up to the current limit). Main operating account for non-residents with strong UX, ACH and wires. Still one of the most proven options to open from outside the US.
- **Relay** (backed by Thread Bank, FDIC). Excellent **backup account** and for envelope-style budgeting: up to 20 sub-accounts and 50 debit cards, deep QuickBooks and Xero integration. If Mercury blocks or asks for KYC review, Relay keeps your operations running.
- **Slash** (backed by Column N.A. (federally chartered, FDIC)). Banking built for online operators: instant virtual cards by vendor, granular spend controls, cashback on digital advertising. The natural complement when you manage Meta Ads, Google Ads or SaaS subscriptions.
- **Wise Business** (multi-currency EMI, not a bank). To collect and pay in EUR, GBP, USD and other currencies with local bank details and mid-market FX. Does not replace a real US account but is unbeatable for international treasury.
- **Wallester / Revolut Business.** Wallester provides corporate cards on a dedicated BIN for high volume. Revolut Business works as a European complement, not as the LLC's main account.

The realistic recommendation: **Mercury + Relay as backup + Slash for ad operations + Wise for FX treasury**. This setup minimizes block risk and reduces real cost. At Exentax we open and configure this stack as part of incorporation.
### Next steps

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
## Balanced banking stack: Mercury, Relay, Slash and Wise

Read this section as a checklist with teeth: each point flags a real failure mode we have seen in cross-border LLC files. Skip none of them - most reassessments and account closures we clean up later trace back to one of these items.
## Legal and procedural facts

Read this section as a checklist with teeth: each point flags a real failure mode we have seen in cross-border LLC files. Skip none of them - most reassessments and account closures we clean up later trace back to one of these items.

<!-- exentax:calc-cta-v1 -->
> **Put numbers on your case.** The <a href="/en#calculadora">Exentax tax calculator</a> compares your current tax burden with what you would pay running a US LLC properly declared in your country of residence.
<!-- /exentax:calc-cta-v1 -->

## References: sources and banking regulation

What follows is the operational view, not the textbook one. We have run this play enough times to know which variables collapse first under scrutiny from a tax authority or a banking compliance team, and that is the order we tackle them in.

### Further related reading

Field note from running this for clients month after month: the rule is straightforward, the execution is where it breaks. Plan the operational side before the legal side.
### Guiding principle: never cut before the operational replacement is ready

The numbers and the calendar matter - get either wrong and the rest unravels.

### Step 1. Open the new account without touching the current one

The numbers and the calendar matter - get either wrong and the rest unravels.

### Step 2. Run a functional test with a small transaction

Field note from running this for clients month after month: the rule is straightforward, the execution is where it breaks. Plan the operational side before the legal side.

<!-- exentax:overhaul-today-v1 -->
## Exentax today update: banking stack, current

The recommended banking stack for an LLC today has consolidated three pieces with complementary roles:

- **Mercury (primary operations).** Account via **Column NA**, **FDIC coverage up to USD 5M** via sweep, **domestic wires at USD 0**, international 0 in / 5 out (depends on corridor), 20+ free sub-accounts. Ideal as the operating account for USD in/out and as the accounting base.
- **Relay (multi-account and rules).** Up to 20 operating accounts + auto-allocation rules (taxes, opex, savings). Useful when the LLC starts splitting cash buckets without moving to an ERP. Plaid-compatible for Wave/Quickbooks.
- **Wise Business (multi-currency).** EMI with 50+ currencies at mid-market, typical FX **0.4-1.5%**, local details in 10+ countries (USD ACH/wire, EUR SEPA, GBP Faster Payments, AUD BSB...). Essential when receiving in EUR/GBP or paying freelancers in LATAM/EU.

### today stack model by volume

| Annual volume | Recommended setup |
|---|---|
| < USD 50k | Mercury only |
| USD 50-300k | Mercury + Wise (multi-currency) |
| USD 300k-1M | Mercury + Relay (buckets) + Wise (FX) |
| > USD 1M | Mercury + Relay + Wise + traditional US account (Bank of America/Chase) for scale wires |

### Reorganization in 4 steps

1. **Inventory.** List every active account and its real use (operations, savings, FX, freelancer payments).
2. **Decision.** Apply the model by volume and close redundant accounts (clean close: transfer balance, cancel linked subscriptions, wait 30 days, request formal closure).
3. **Migration.** Re-point clients (new signed wire instructions), update pending invoices, redirect Stripe payouts.
4. **Preventive KYC.** Before the first large movement in the new account, proactively upload: Articles, EIN Letter, signed OA and proof of address.

### today FAQ

**Is Mercury still the default today?** Yes. FDIC sweep coverage and USD 0 domestic wires still have no clear competitor for non-resident LLCs.

**When does a traditional account make sense?** From ~USD 1M annual or when working with US corporate clients who pay exclusively via ACH from traditional banks.

**Does Wise report via CRS?** Wise Europe SA (Belgium) is subject to CRS for EU residents. Document your tax residency properly.
<!-- exentax:overhaul-today-v1 end -->

<!-- exentax:execution-v2 -->
## How we reorganize an LLC's banking at Exentax when it no longer scales

When an LLC starts receiving serious payments, the initial stack (sometimes just Mercury) falls short: limits, holds, a single gateway and zero backup. The Exentax method reorganizes it without downtime or account closures.

- **Primary and mirror account** in parallel: Mercury or Relay as operating, Wise as multi-currency backup, Stripe + Paddle/DoDo as gateways.
- **Progressive migration** of recurring debits and subscriptions so no client sees a failed charge during the transition.
- **Extended KYC ready** with business description, MCC and documentation coherent across every account to clear second-line reviews.

If your current stack no longer holds, run the <strong>Exentax calculator</strong> or book thirty minutes: we deliver the migration plan in writing before touching anything.
<!-- /exentax:execution-v2 -->

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Call us at <a href="tel:+34614916910">+34 614 916 910</a> or message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22If%20you%20have%20an%20LLC%20and%20your%20banking%20is%20Mercury%20for%20everything%20because%20that%20is%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

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
<li><span class="font-mono">100%</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…ers y emprendedores ya operan con su LLC americana de forma 100% legal y documentada. En E…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">5 %</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…n 50+ divisas a tipo medio interbancario, FX típico **0,4-1,5 %**, datos locales en 10+ pa…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">IRC §1471</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…eneficial Ownership Information Report). - **FATCA y CRS.** IRC §1471-1474 (FATCA y formul…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8822</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…s://www.irs.gov&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;IRS&lt;/a&gt;, ni Form 8822-B ni nada análogo, s…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…nservar el acuse y monitorizar futuras actualizaciones. - **Form 5472 + 1120 pro-forma.** …»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…C como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo ca…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…a si la LLC ha realizado *check-the-box election* a C-Corp (Form 8832): entonces tributa a…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
