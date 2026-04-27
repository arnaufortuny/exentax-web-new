export default `Understanding payment timing helps you manage cash flow effectively. Here's a complete guide to how long different payment methods take with your LLC.

## ACH payment timelines

ACH (Automated Clearing House) payments are processed in batches throughout the business day.

**Standard ACH (next-day or 2-3 business days):**
- Most common type
- Funds available next business day or within 2-3 days
- Free on Mercury
- Only works between US bank accounts

**Same-day ACH:**
- Available for transfers submitted before 2:30 PM ET on business days
- Funds available same day
- May have a small fee at some banks (free on Mercury for most transfers)

**Important:** ACH only processes on US business days (Monday-Friday, excluding federal holidays). A payment sent Friday afternoon may not process until Tuesday.
## Wire transfer timelines

**Domestic wire (US to US):**
- Submitted before cutoff time: same business day
- After cutoff time: next business day
- Mercury cutoff: approximately 5:00 PM ET
- Free on Mercury (both sending and receiving)

**International wire:**
- Varies significantly by destination country
- Europe (SEPA-connected): 1-2 business days
- Latin America: 1-5 business days
- Asia: 2-5 business days
- Africa/Middle East: 2-7 business days
- **All free on Mercury**: $0 for sending and receiving, domestic and international
- May involve intermediary banks which can add delays
### Stripe payouts to Mercury

When you receive card payments through Stripe:
- Standard payout: 2 business days after payment received
- Instant payout: Available (small fee of 1%, min $0.50)
- Stripe deposits accumulate over 24 hours and pay out in one daily lump sum
- Weekend/holiday payments process on the next business day
### PayPal to Mercury

PayPal to bank transfers:
- Standard: 1-3 business days
- Instant transfer: Small fee (typically 1.5%, min $0.25)
### Wise transfers

Wise business transfers:
- To another Wise account: Usually instant
- To bank accounts: 1-2 business days (most major currencies)
- Some currency pairs: Same day
- Fees: Small conversion fee (0.4-1.5%)
### Payment details for your clients

**For US clients paying via ACH:**
- Bank: Mercury's partner banks (Choice Financial Group / Evolve Bank & Trust)
- Routing Number (ACH): 117201490
- Account Number: [your Mercury account number]

**For US clients paying via domestic wire:**
- Routing Number (Wire): [see Mercury settings. different from ACH routing]
- Account Number: [your Mercury account number]

**For international clients paying via wire:**
- SWIFT Code: [see Mercury account settings]
- Bank Address: Mercury's partner bank as shown in your Mercury settings (typically Choice Financial Group, Fargo, ND or Evolve Bank & Trust, West Memphis, AR)
- Account Number: [your Mercury account number]

**For European clients preferring SEPA:**
- Use your Wise Business IBAN for EUR receipts
- Convert to USD in Wise
- Transfer to Mercury via free ACH

Mercury has $0 wire fees, both domestic and international. Your funds are held in Column NA with FDIC insurance.
### Managing cash flow with these timelines

**For predictable monthly retainer clients:** Set up recurring ACH or wire transfers. Know exactly when to expect payment.

**For project-based billing:** Invoice 7-10 days before you need the money. Give yourself buffer for payment processing.

**For unexpected urgent needs:** Mercury instant transfers to other Mercury accounts are immediate. Stripe instant payouts give same-day access.

**Currency conversion timing:** Convert currency through Wise when rates are favorable, not when you urgently need the money.
### Payment method summary

| Method | Timeline | Fee (Mercury) | Best for |
|---|---|---|---|
| ACH | 1-3 business days | Free | US recurring payments |
| Domestic wire | Same day | Free | Urgent US payments |
| International wire | 1-7 business days | Free | International clients |
| Stripe payout | 2 business days | Free (standard) | Card payments |
| Wise transfer | 1-2 business days | 0.4-1.5% | Currency conversion |
### IBAN vs. SWIFT vs. Routing Number: when to use each

| Scenario | What to share | Platform | Example |
|---|---|---|---|
| US client pays you | Routing + Account number | Mercury | ABA: 091311229, Acct: 8XXXXXXXXX |
| European client pays in EUR | IBAN | Wise Business | DE89 3704 0044 0532 0130 00 |
| UK client pays in GBP | Sort code + Account | Wise Business | 23-14-70 / 12345678 |
| International client pays in USD | SWIFT + Account | Mercury | SWIFT: CLNOUSPAXXX |
| Client wants to pay by card | Stripe payment link | Stripe | stripe.com/pay/XXXXX |
| B2C customer buys your product | Checkout page | DoDo Payments | Automatic |
### Common payment collection mistakes

1. **Sharing personal bank details**: Always share LLC (Mercury) banking details, never personal
2. **Using your local IBAN for USD collection**: Use Mercury for USD, Wise for local currencies
3. **Not specifying currency**: Always state the currency on invoices (USD recommended)
4. **Forgetting wire reference**: Ask clients to include invoice number in wire memo
5. **Not following up on pending payments**: Mercury shows pending ACH/wire; follow up if delayed

Closing out, here are related pieces that sit naturally next to this article: <a href="/en/blog/your-first-month-with-a-us-llc-what-to-expect-week-by-week">Your first month with a US LLC: what to expect week by week</a> and <a href="/en/blog/changing-currencies-for-your-llc-best-options-and-how-to">Changing currencies for your LLC: best options and how to avoid hidden fees</a> help round off the context.
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
- **Revolut Business**: when paired with a **US LLC**, it operates under **Revolut Technologies Inc.** with **Lead Bank** as its US banking partner. The account delivered is a US account (routing + account number); **no European IBAN is issued** to a US LLC. The European IBANs (Lithuanian, Belgian) belong to **Revolut Bank UAB** and are issued to European clients of the group. If you are offered a European IBAN tied to your LLC, confirm exactly which legal entity holds that account and which regime it reports under.
- **Zero tax**: no LLC structure delivers "zero tax" if you live in a country with CFC/tax transparency or income attribution rules. What you achieve is **no double taxation** and **correct reporting at residence**, not elimination.
## We set it up without you losing a weekend

Thousands of freelancers and entrepreneurs already operate their US LLC fully legally and properly documented. At Exentax we handle the entire process: formation, banking, payment gateways, bookkeeping, <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> filings and compliance in your country of residence. Book a free consultation and we will tell you honestly whether the LLC makes sense for your case, with no absolute promises.
## References: sources on structures and jurisdictions

The comparisons and quantitative data on the jurisdictions cited here rely on official sources updated to today:

- **United States.** Delaware General Corporation Law and Limited Liability Company Act, Wyoming Limited Liability Company Act (Title 17, Chapter 29), IRS Form 5472 instructions and IRC §7701 (entity classification).
- **Andorra.** Llei 95/2010 de l'Impost sobre Societats (10% IS), Llei 5/2014 del IRPF and the active/passive residency framework of the Govern d'Andorra.
- **Estonia.** Estonian Income Tax Act (deferred-distribution corporate tax at 20/22%) and official documentation of the e-Residency programme.
- **Spain.** Ley 27/2014 (IS), Ley 35/2006 (IRPF, arts. 8-9 on residency and art. 100 on CFC) and the inbound-expat regime (art. 93 LIRPF, "Beckham Law").
- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>.** Pillar Two (GloBE) and OECD Model Tax Convention with Commentaries.
Choosing a jurisdiction always depends on the holder's actual tax residency and on the economic substance of the activity; review your specific case before taking any structural decision.

<!-- exentax:execution-v2 -->
## ACH and wire transfer payment timings in US: how long each method takes and when to use which

Coming from SEPA and Bizum, the US payment system looks from another century. Worth understanding because it affects when you collect, how much in fees, and which method to propose to corporate clients. Practical summary of the four flows mattering in an operational LLC.

- **ACH (Automated Clearing House).** The American SEPA. Cost near zero (0$-1$ in Mercury/Wise/Relay), settlement in 1-3 business days. Standard for recurring B2B domestic payments (subscriptions, payroll, vendor pay). With Same-Day ACH (extra cost) drops to hours. NOT international: ACH only US-to-US.
- **Domestic wire transfer.** Like an urgent transfer: 5$-30$ per send, arrives in hours (same day if before cutoff ~14:00 ET). Corporates use for large payments (>10k$) and closing transactions where timing matters (M&A, real estate). Immediate and final: cannot be cancelled.
- **International wire (SWIFT).** Method to collect from outside US to your LLC and vice versa. Cost 15$-50$ + intermediary fees + FX spread (~1%-3%). Arrives in 1-5 business days. Requires SWIFT/BIC and, to EUR, IBAN. To reduce cost: Wise USD/EUR is local ACH on each side, eliminating SWIFT.
- **Stripe payouts and other gateways.** Standard Stripe payout to US account is ACH 2 business days (standard) or instant with 1% extra. For LLC with global clients via Stripe, this flow determines working capital: invoice on 1st, Stripe deposits 5-7, you wire personal on 8th.

### Typical operational strategy for non-resident LLC

Revenue: US clients pay via ACH or Stripe → Mercury/Wise USD. International clients pay via Wise (local transfer in their currency) or Stripe (with auto FX). Outflow: pay US vendors via ACH (free), international vendors via Wise (better FX), draw to personal via Wise USD → IBAN EUR (3-5 days, ~0.4% spread). Minimises FX cost vs traditional SWIFT.

### What we are asked the most

**Why does Stripe take 7 days when client already paid?** Stripe rolling reserve: preventive hold against chargebacks. New accounts longer (7-14 days), then 2 days. Not a banking problem, Stripe policy.

**Is Wise USD really a "US account" or something intermediate?** Wise Inc. account with own ACH routing number. Practically operates as US account to receive ACH and domestic wires. For Stripe payout counts as US bank. What it does NOT give: credit card (only debit) or physical cheques.

At Exentax we set up the banking stack by use case (US payments, EU clients, LATAM, FX optimisation) - so you collect in 24-48h, not 7-10 days due to wrong corridor.
<!-- /exentax:execution-v2 -->

_More on this topic: [LLC in the United States: complete guide for non-residents](/en/blog/llc-in-the-united-states-complete-guide-for-non-residents-in)._

<!-- related-inline-stripped-2026-04 -->

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

<!-- exentax:cta-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22Understanding%20payment%20timing%20helps%20you%20manage%20cash%20flow%20effectively%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.

<!-- exentax:conv-fill-v1 -->
Or call us directly at <a href="tel:+34614916910">+34 614 916 910</a> if you'd rather talk.

For state-specific details, see our <a href="/en/services/llc-wyoming">Wyoming LLC service page</a> with closed costs and timelines.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Editorial review pending</strong> — The following references require manual verification against the official current source. If you spot a discrepancy, write to us and we will correct it within 24 hours.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">5%</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…| Pagos internacionales grandes | | Wise | 1-2 días | 0.4-1.5% | Pagos internacionales fre…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">1%</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…envío + comisión bancos intermediarios + spread de cambio (~1%-3%). Llega en 1-5 días hábi…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">3%</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…ío + comisión bancos intermediarios + spread de cambio (~1%-3%). Llega en 1-5 días hábiles…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">4%</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…FX), draw a personal vía Wise USD → IBAN EUR (3-5 días, ~0.4% spread). Esto minimiza coste…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">IRC §1471</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…eneficial Ownership Information Report). - **FATCA y CRS.** IRC §1471-1474 (FATCA y formul…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
