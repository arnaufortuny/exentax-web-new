export default `IBAN, SWIFT, and Routing numbers. international payment systems use different identifiers in different countries. Understanding them prevents payment errors and ensures your money arrives quickly. Here's what each one is and when you need which.

## Routing Number (ABA Number)

**What it is:** A 9-digit code identifying a US bank in the ACH and wire transfer systems.

**When you use it:** For receiving US domestic payments (ACH transfers and domestic wires).

**Mercury's routing number:** 117201490 (Mercury's partner banks (Choice Financial Group / Evolve Bank & Trust)ing partner)

**Important:** Mercury has two routing numbers. one for ACH and one for wire transfers. They may be different. Check your Mercury dashboard for the specific wire routing number.

**Format:** Always 9 digits, example: 117201490
### Account Number

**What it is:** The specific number identifying your account at the bank.

**When you use it:** Combined with the routing number for ACH and domestic wire transfers.

**For Mercury:** You receive a unique account number when your account is approved. Never share this publicly, only with specific clients who need to pay you.
### SWIFT/BIC Code

**What it is:** An 8-11 character code identifying a bank for international transfers. "SWIFT" (Society for Worldwide Interbank Financial Telecommunication) and "BIC" (Bank Identifier Code) are the same thing.

**When you use it:** For receiving international wire transfers from outside the US.

**Mercury's SWIFT details:** Mercury uses Column NA's SWIFT code for incoming international transfers. The specific code is provided in your Mercury account settings.

**Format:** Usually looks like "ABCDUS33". first 4 letters are bank code, next 2 are country code (US), last 2 are location code.
### IBAN (International Bank Account Number)

**What it is:** A standardized international account number format used primarily in Europe, Middle East, and other regions.

**The important thing to know:** The US does not use IBAN. US banks have routing numbers + account numbers instead of IBANs.

**For your Mercury account:** There is no IBAN. If someone asks for your IBAN and you're providing Mercury details, explain that US banks use routing number + account number instead.

**If you need an IBAN:** Wise Business provides IBAN account numbers in EUR, GBP, and other currencies. If European clients prefer to send to an IBAN, give them your Wise IBAN, then convert and send to Mercury.
### Providing payment details: the cheat sheet

**To receive USD via ACH from US clients:**
- Bank name: Mercury's partner banks (Choice Financial Group / Evolve Bank & Trust)
- Routing number: 117201490
- Account number: [your Mercury account number]
- Account type: Checking

**To receive USD via domestic wire:**
- Bank name: Column NA
- Routing number (wire): [see Mercury settings]
- Account number: [your Mercury account number]

**To receive USD via international wire:**
- Bank name: Column NA
- SWIFT/BIC: [see Mercury account settings]
- Routing number: [see Mercury settings]
- Account number: [your Mercury account number]
- Bank address: Mercury's partner bank as shown in your Mercury settings (typically Choice Financial Group, Fargo, ND or Evolve Bank & Trust, West Memphis, AR)

**To receive EUR, GBP, etc, from European clients:**
- Use your Wise Business IBAN for that currency
- Convert to USD and send to Mercury via ACH (free)
### Common mistakes to avoid

- **Giving ACH routing number for wire transfers:** They can be different. Check Mercury settings.
- **Providing IBAN when asked for routing number:** The US doesn't use IBAN. Provide routing + account number.
- **Sharing account details publicly:** Only share with specific clients who need to pay you.
- **Not specifying bank address for international wires:** Always include "Mercury's partner bank as shown in your Mercury settings (typically Choice Financial Group, Fargo, ND or Evolve Bank & Trust, West Memphis, AR)" for international wires.
### Quick reference table

| Identifier | Format | Used for | Where to find |
|---|---|---|---|
| Routing (ACH) | 9 digits | US domestic ACH | Mercury dashboard |
| Routing (Wire) | 9 digits | US domestic wire | Mercury settings |
| Account Number | Variable | All US transfers | Mercury dashboard |
| SWIFT/BIC | 8-11 chars | International wires | Mercury settings |
| IBAN | 15-34 chars | European transfers | Wise Business |
## How each payment method works in practice

### Receiving a wire from a US client
1. Client asks for your payment details
2. You share: Bank name (Mercury/Column NA), Routing number, Account number, LLC name
3. Client initiates domestic wire ($0 fee on your end)
4. Funds arrive same day or next business day
5. Mercury sends you push notification

### Receiving an international wire from a European client
1. Client asks for payment details
2. Option A: Share Mercury SWIFT details (USD wire, 1-3 days, client pays ~$25-50 in bank fees)
3. Option B: Share Wise EUR account details (client pays locally in EUR, you convert to USD at 0.4% fee)
4. Option C: Send Stripe invoice (client pays by card, 2.9% + $0.30 fee, funds arrive in 2 days)
5. Best option depends on amount: wires for $5K+, Stripe for smaller amounts

### Collecting via Stripe payment link
1. Create payment link in Stripe Dashboard (amount, description, currency)
2. Share link with client via email
3. Client pays with card in their local currency
4. Stripe converts to USD and deposits to Mercury in 2 business days
5. Net received: invoice amount minus 2.9% + $0.30 (+ 1.5% for international cards)

If something in this structure left you wanting more detail, <a href="/en/blog/ach-vs-wire-transfer-timelines-for-your-llc">ACH vs wire transfer: payment timelines and what they mean for your LLC cash flow</a> and <a href="/en/blog/how-to-scale-your-digital-business-with-a-us-llc">How to scale your digital business with a US LLC</a> dive into neighbouring pieces of the puzzle we usually keep for separate write-ups.
### Payment method decision matrix

| Factor | Wire (Mercury) | ACH | Stripe | Wise |
|---|---|---|---|---|
| Best for amount | $5,000+ | $1,000-10,000 | Any | $500-5,000 |
| Speed | Same/next day | 1-3 days | 2 days | 1-2 days |
| Fee to you | $0 | $0 | 2.9% + $0.30 | 0.4-1.5% (if converting) |
| Fee to client | $0-25 (domestic) / $25-50 (intl) | $0 | 0% (card fee may apply) | Minimal |
| Client effort | Needs your bank details | Needs routing + account | Click link, enter card | Needs your Wise details |
| Professional appearance | Standard | Standard | Branded checkout page | Standard |

At Exentax we configure all your collection channels from day one and prepare a payment details sheet you can share with clients. Book your strategic advisory session.
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
## We set it up without you losing a weekend

Thousands of freelancers and entrepreneurs already operate their US LLC fully legally and properly documented. At Exentax we handle the entire process: formation, banking, payment gateways, bookkeeping, <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> filings and compliance in your country of residence. Book a free advisory session and we will tell you honestly whether the LLC makes sense for your case, with no absolute promises.
## References: sources on structures and jurisdictions

The comparisons and quantitative data on the jurisdictions cited here rely on official sources updated to today:

- **United States.** Delaware General Corporation Law and Limited Liability Company Act, Wyoming Limited Liability Company Act (Title 17, Chapter 29), IRS Form 5472 instructions and IRC §7701 (entity classification).
- **Andorra.** Llei 95/2010 de l'Impost sobre Societats (10% IS), Llei 5/2014 del IRPF and the active/passive residency framework of the Govern d'Andorra.
- **Estonia.** Estonian Income Tax Act (deferred-distribution corporate tax at 20/22%) and official documentation of the e-Residency programme.
- **Spain.** Ley 27/2014 (IS), Ley 35/2006 (IRPF, arts. 8-9 on residency and art. 100 on CFC) and the inbound-expat regime (art. 93 LIRPF, "Beckham Law").
- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>.** Pillar Two (GloBE) and OECD Model Tax Convention with Commentaries.

Choosing a jurisdiction always depends on the holder's actual tax residency and on the economic substance of the activity; review your specific case before taking any structural decision.

<!-- exentax:execution-v2 -->
## IBAN, SWIFT and Routing Number: what each one does and why your LLC needs them right

Confusing IBAN, SWIFT/BIC and ABA Routing Number costs you rejected payments, bounced wires and three days on the phone with support. Each format belongs to a different system, and your US LLC uses all three depending on the inbound channel. Straight to the point.

- **Routing Number (ABA, 9 digits).** The US bank identifier in the domestic system. Used by ACH (cheap, fast US-internal transfers) and domestic wires. Mercury, Bluevine and any US-only account give you a Routing Number. If a US client pays you, always Routing + account number.
- **SWIFT/BIC (8-11 characters).** International bank identifier for cross-border wires. You will need it when a European, Latin American or Asian client sends money from their local bank. Mercury, Wise Business and basically any modern account give you a SWIFT - but international wires cost 15-30 USD and take 1-3 days.
- **IBAN (up to 34 characters).** European standard + 80 jurisdictions. Traditional US accounts have no IBAN - only SWIFT. Wise Business does issue European IBANs (Belgium, UK, Hungary) for your LLC, reducing friction when invoicing the EU: your French client pays the Wise IBAN as if SEPA-local, no wire fee.
- **Operational best practice.** For a US client: share Routing + account (ACH). For an EU B2B client: share Wise Business IBAN. For a client outside EU/US: share SWIFT + account number. Mixing formats confuses the payer and bounces the wire.

### What we are asked the most

**Can my LLC have a Spanish or French IBAN?** Not directly: the LLC is a US entity without EU permanent establishment. But Wise Business assigns it a European IBAN (Belgium), functionally sufficient for SEPA and EUR conversions.

**Why can't my European client pay with card when I give them SWIFT?** Because SWIFT is a bank wire, not a card payment. For card use Stripe or an equivalent gateway. For a wire the client needs SWIFT + account + beneficiary and bank address.

At Exentax we configure the full banking stack of your LLC (Mercury primary, Wise Business secondary with European IBAN, and a payment gateway if applicable) so you collect cleanly in every currency and country.
<!-- /exentax:execution-v2 -->

_More on this topic: [LLC in the United States: complete guide for non-residents](/en/blog/llc-united-states-complete-guide-non-residents-2026)._

<!-- related-inline-stripped-2026-04 -->

### Practical reminder

Each tax situation depends on your specific residency, the activity carried out and the contracts in force. The information here is general and does not replace personalised advice; check your particular case before taking structural decisions.
## How we work at Exentax

Our team specialises in international tax structures for residents of Spanish-speaking countries operating online businesses. We combine local knowledge of Spain, Andorra and Latin America with operational experience setting up entities in Delaware, Wyoming, Estonia and other jurisdictions. Every case starts with a free advisory session in which we evaluate residency, activity and goals, and we honestly tell you whether the proposed structure makes sense or whether a simpler alternative is enough.
### Editorial note

This article is updated yearly with regulatory changes that affect the structures discussed. If you spot an outdated reference, write to us and we will revise it in the next editorial cycle; we keep the publication date visible at the top of every post for full transparency.

<!-- exentax:cross-refs-v1 -->
## On the same topic

- [Wise, IBAN and LLC: what actually gets reported and what does not](/en/blog/wise-iban-and-llc-what-actually-gets-reported-to-the-tax)
- [Wise, banks and your LLC: the complete banking stack nobody explains](/en/blog/wise-banks-and-your-llc-the-complete-banking-stack-nobody)
- [ACH vs wire transfer: payment timelines and impact on LLC cash flow](/en/blog/ach-vs-wire-transfer-timelines-for-your-llc)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:defensa-fiscal-v1 -->
## What if HMRC, the IRS or my local tax authority asks about my LLC?

  It's the question every client raises in the first advisory session, and the short answer is: your LLC isn't opaque, and a properly declared structure closes any inquiry in standard forms. Your tax authority can request the state Certificate of Formation (Wyoming, Delaware or New Mexico), the EIN issued by the <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, the signed Operating Agreement, the Mercury or Wise statements for the year, the Form 5472 plus pro-forma 1120 you filed, and the bookkeeping that reconciles income, expenses and movements. If all of that exists and is delivered in order, the inquiry doesn't escalate.

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
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22IBAN%2C%20SWIFT%2C%20and%20Routing%20numbers%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.

<!-- exentax:conv-fill-v1 -->
Or call us directly at <a href="tel:+34614916910">+34 614 916 910</a> if you'd rather talk.

For state-specific details, see our <a href="/en/services/llc-wyoming">Wyoming LLC service page</a> with closed costs and timelines.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->

`;
