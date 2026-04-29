export default `

Wise Business reports account balances to more than 120 jurisdictions under CRS and, for a Spanish tax resident, sends the data to the AEAT before September 30 every year.

Wise Business (formerly TransferWise) is the multi-currency fintech most owners of <a href="/en/blog/llc-united-states-complete-guide-non-residents-2026">US LLCs</a> set up first, alongside any international entrepreneur who needs to move money across borders. The pitch is straightforward: mid-market FX, local IBANs in EUR, GBP, USD and a dozen other currencies, and fees so low they barely register. What most people miss is that Wise is also a fully regulated European financial institution under the **Common Reporting Standard (CRS)**, and that piece of the puzzle has very real implications you want to understand before you wire your LLC's money through it.

## Which Wise entity actually holds your account and where it reports

Wise does not operate as a single global company. It operates through several regulated entities, and the one that holds your account decides which tax authority sees your data:

- **Wise Europe SA** (Belgium): an Electronic Money Institution (EMI) regulated by the **National Bank of Belgium (NBB)**. It has been the entity serving European clients ever since the UK lost EU passporting rights after Brexit. It reports CRS to the **Service Public Fédéral Finances** in Belgium, which then triggers the bilateral information exchange with the tax authority of the holder's country of residence.
- **Wise Payments Limited** (United Kingdom): EMI regulated by the FCA. Still serves UK customers and a handful of legacy accounts.
- **Wise US Inc.**: regulated in the United States as a Money Services Business (MSB). CRS does not apply here because the United States never signed up to it.
- Subsidiaries in Singapore, Australia, India and other markets, each with its own local regulator and its own reporting rules.

For European clients and for any LLC opened with European representation in the KYC, the default setup is that the account sits with **Wise Europe SA (Belgium)**. Net result: the CRS report leaves Belgium and lands at your home country's tax office every year, no matter where the LLC was formed.

### Regulatory framework

- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>**: the Common Reporting Standard.
- **EU**: Directive 2011/16/EU as amended by DAC2.
- **Belgium**: Law of 16 December 2015 governing the automatic exchange of financial information (LIAFI) and the implementing royal decrees.
- **Spain on the receiving end**: Royal Decree 1021/2015, **Modelo 720** (the Spanish foreign-asset return for accounts, securities and real estate held outside Spain) and **Modelo 721** (the equivalent for crypto assets held abroad). We dig into the receiving side in our piece on <a href="/en/blog/crs-for-residents-in-spain-and-latam-real-implications">CRS for residents in Spain and LATAM</a>.

### What information Wise sends under CRS

The same information any Reporting Financial Institution sends under CRS, no more, no less:

| Block | Detail |
| --- | --- |
| Individual holder | Name, address, declared tax residence, TIN, date and place of birth |
| Entity holder | Legal name, address, EIN/TIN, CRS classification (Active NFE, Passive NFE, Investment Entity) |
| Controlling persons | If the entity is Passive NFE: beneficial-owner data (25% direct or indirect ownership threshold, or any other form of effective control) |
| Account | Every IBAN you hold by currency, plus the internal Wise reference |
| Balance | Aggregated balance as of 31 December (Wise pools money by currency; the report aggregates across pools) |
| Income | Interest if any (Wise Interest, Wise Assets), gross dividends, gross redemption proceeds (treated as custodial-account income, with the Assets program in mind) |

Both the **Wise Interest** product and the Wise investment products built on money-market funds clearly fall under custodial-account reporting. That means gross income detail is added on top of the closing balance, not as a substitute.

### How Wise classifies your LLC under CRS

When you set up a Wise Business account for your LLC, Wise runs CRS due diligence on the entity itself. You will be asked to fill out the **CRS Self-Certification** form and to confirm:

- The LLC's tax residence: United States.
- Its classification: Active NFE, Passive NFE, Investment Entity, Reporting Financial Institution, etc.
- The controlling persons (full data set: name, address, tax residence, TIN, date and place of birth).

In practice, a single-member services LLC normally meets the **Active NFE** test (more than 50% of its income is operating income, not passive). But Wise plays it conservative: if your documentation is thin or the activity cannot be evidenced cleanly, it will classify the LLC as **Passive NFE** and report the controlling person directly.

The bottom line you cannot dodge: even though the LLC is American and the United States never joined CRS, **the data on who owns it and how much sits in the account will reach your home tax authority** through Belgium.

### When and how reporting actually happens

- Year-end snapshot: 31 December.
- Wise sends the CRS report to the Belgian authority typically between March and June of the following year.
- Belgium forwards the data to the tax authorities of each holder's and controlling person's country of residence, normally before 30 September.
- Your tax office sits on the data and cross-checks it against your filings (in Spain, that means IRPF plus Modelo 720, plus Modelo 721 if you also hold crypto abroad).

So the Wise balance you carried on 31/12/2025 is matched against the IRPF return you file in May–June and against the Modelo 720 you file in March of the following year. Two different forms, one single reconciliation.

## The most common mistakes we see with Wise and tax

1. **"Wise is just a payment rail, nobody really sees this."** Wrong. Wise is a regulated financial institution and is fully subject to CRS, just like a high-street bank.
2. **"If I put the LLC on the form, my name doesn't appear."** Wrong for any Passive NFE: the controlling persons get reported by name. And most single-member LLCs end up classified as Passive NFE, simply because the bank prefers caution.
3. **"My average balance was tiny, so I won't be reported."** Wise reports the closing balance on 31 December, regardless of how it moved during the year. CRS has no minimum threshold for pre-existing accounts since 2017, and none for new accounts either.
4. **"I left Wise off my Modelo 720 because it was small."** The Modelo 720 threshold is the aggregate across every foreign account you hold, not a per-account limit. If Wise plus Mercury plus Revolut plus N26 together cross 50,000 €, every one of them needs to be declared.
5. **"I'll only use Wise for FX, not as custody."** Even when you only use Wise as an operating deposit account, it is still a reportable financial account. The deposit-versus-custody distinction changes the income-detail block, not the balance report itself.

### How Wise compares with Revolut and Mercury

| Aspect | Wise Europe (BE) | Revolut Bank UAB (LT) | Mercury (US) |
| --- | --- | --- | --- |
| Subject to CRS | Yes | Yes | No |
| Reports the LLC's beneficial owner | Yes (typical Passive NFE) | Yes (typical Passive NFE) | No |
| Native investment product | Wise Assets, Wise Interest | Stocks, Vault | Treasury, FDIC sweep |
| Native multi-currency | Excellent | Excellent | Mainly USD |
| Suitability as the LLC's primary account | Secondary | Secondary | Primary |

We expand the comparison in <a href="/en/blog/wise-business-with-your-llc-the-complete-guide-to-multi">the complete guide to Wise Business for your LLC</a>, in <a href="/en/blog/revolut-business-and-crs-what-it-reports-to-your-tax">our dedicated Revolut and CRS piece</a> and, specifically for the Belgian IBAN, in <a href="/en/blog/wise-iban-and-llc-what-actually-gets-reported-to-the-tax">what the Wise IBAN tied to your LLC actually reports to your tax office</a>.

### How to set this up properly

1. **Get your self-certification right from day one.** Be precise about the LLC's CRS classification and about who the controlling persons are. Lying or omitting is an infraction and, in some jurisdictions, a crime.
2. **Use Wise as a secondary operating account**, not as your LLC's main account, if you want to keep the CRS footprint to your country to a minimum. Mercury remains the natural primary for a US LLC.
3. **Keep your paperwork consistent.** Your CRS self-certification at Wise, your Modelo 720 (Spain) or its LATAM equivalent, and your IRPF must all tell the same story.
4. **Plan your closing balance.** If you know you will hit 31/12 with a high balance, plan for it to be properly declared and properly justified (origin of funds, business purpose, taxes already paid).
5. **Zoom out to the rest of the framework**: <a href="/en/blog/designing-a-solid-international-tax-structure-step-by-step">your overall structure design</a> is what decides whether Wise plus LLC plus your residency holds together or falls apart.

### The summary

Wise Business is not a shortcut around tax reporting. It is an excellent regulated fintech that reports through CRS from Belgium to your home tax office. Used inside a coherent structure with your US LLC, it is genuinely useful. Used badly, or with self-certifications that do not match reality, it becomes the single most common source of the tax problems we end up cleaning up.

## Tax compliance in your country: CFC, controlled-foreign rules and income attribution

A US LLC is a fully legal, internationally recognized vehicle. But compliance does not stop at formation: as an owner who is tax-resident somewhere else, your local tax authority still has the right to tax whatever the LLC earns. The real question is **under which regime** that taxation happens.

### By jurisdiction

- **Spain (LIRPF/LIS).** When the LLC is an operating *Single-Member Disregarded Entity* (real services, no significant passive income), the Spanish tax office normally treats it under **income attribution (art. 87 LIRPF)**: the LLC's net profits are attributed to the member in the year they arise and folded into the general IRPF base. If instead the LLC elects corporation tax treatment via Form 5472 paired with **Form 8832** (the IRS election form) and ends up controlled by a Spanish resident with mostly passive income, the **CFC regime (art. 91 LIRPF for individuals, art. 100 LIS for companies)** kicks in. The choice is not optional: it follows the economic substance, not the label on the paperwork.
- **Information returns.** US bank accounts whose average or year-end balance crosses 50,000 €: **Modelo 720** (the Spanish foreign-asset return, updated by Law 5/2022 after the CJEU ruling C-788/19 of 27/01/2022; penalties now sit inside the general LGT regime). Related-party transactions with the LLC and any dividends sent home: **Modelo 232**. Crypto assets custodied in the US: **Modelo 721**.
- **Spain–US tax treaty.** The treaty (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol in force from 27/11/2019) governs the double-taxation rules on dividends, interest and royalties. An LLC with no permanent establishment in Spain does not by itself create a PE for the member, but effective management absolutely can if the entire business is run from Spanish territory.
- **Mexico, Colombia, Argentina and other LATAM jurisdictions.** Each has its own CFC regime (Mexico: Refipres; Argentina: foreign passive income; Chile: art. 41 G LIR). The shared logic: profits parked inside the LLC are treated as received by the member whenever the entity is considered transparent or controlled.

The practical rule: an operating LLC with real substance, properly declared in your country of residence, is **legitimate tax planning**. An LLC used to hide income, fake non-residence or shift passive income with no economic basis lands inside **art. 15 LGT (anti-abuse)** or, in the worst case, **art. 16 LGT (simulation)**. The facts decide, not the paperwork.

Before going further, put numbers on your case: the <a href="/en#calculadora">Exentax calculator</a> compares, in under 2 minutes, your current tax bill with what you would carry running a US LLC properly declared in your country of residence.

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Free consultation, no strings attached</a>
<!-- /exentax:calc-cta-v1 -->

At Exentax we set up the structure so it lands in the first scenario, and we document every step so your local return holds up cleanly under any future review.

<!-- exentax:cta-mid -->
**Sounds heavy?** <a href="/en/services">Our services</a> already cover "Wise Business and CRS: what it reports to your tax authority and how to fit it into your structure", filed on time, with nothing left for you to touch.

<!-- exentax:cta-final -->
**Tell us your situation and we will tell you where to start.** Book a 30-minute call about "Wise Business and CRS: what it reports to your tax authority and how to fit it into your structure" and we will walk through it together.

<!-- exentax:legal-refs-v1 --><!-- exentax:execution-v2 -->
## Wise Business and CRS: how it reports to your tax authority and why you should always declare

Wise Business is operationally excellent for your LLC — multi-currency, cheap FX, local IBANs in several jurisdictions — and from a reporting standpoint it is a financial institution fully subject to CRS. If you are tax-resident in Spain, France, Italy, Germany, Portugal or any other CRS country, your tax office gets the data every single year. It pays to know exactly what arrives and how it gets cross-checked.

- **Wise Business regulatory status.** Wise operates under multiple licences: Wise Payments Limited (UK, FCA), Wise Europe SA (Belgium, NBB), Wise USD Inc. (US, <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>), and others. Each regional entity reports under its own jurisdiction's rules. For European Wise Business users, CRS reporting flows from Wise Europe SA to the National Bank of Belgium, which forwards to every other CRS jurisdiction — including the country where the ultimate beneficial owner lives.
- **The exact data transmitted.** Identification of the beneficial owner from the KYC file (full name, ID or passport, address, declared tax residence at onboarding), balance on 31 December broken down by currency (Wise multi-currency reports each USD, EUR and GBP balance separately), total gross movement for the year, and the account identifiers (Belgian BE IBAN for EUR, US routing number for USD, etc.). Individual transactions are NOT transmitted; aggregates are.
- **The automatic cross-check with your IRPF or corporate return.** Spain links the CRS data to your tax ID and crosses it against: (1) Modelo 720 if the last-quarter average balance or the 31/12 balance exceeds 50,000 €; (2) Modelo 721 if your crypto holdings cross the threshold; (3) IRPF in the income-attribution box for the LLC. If the numbers do not line up, an automatic flag fires. Typical chain: information request, then a verification procedure if you do not respond with documentation.
- **What changes when your LLC adds Wise Business.** Wise Business EUR (the Belgian account) reports faster and more completely than Wise USD (the US sub-licence account). If you have both (Wise multi-currency), both get reported, but through different channels (Belgium → CRS, US → FATCA-IGA). Practical consequence: the fiscal visibility is identical, only the latency changes.

### What we get asked the most

**If I open Wise Business as the LLC, does it report to the US or to my country?** It reports to the tax residence of the ultimate beneficial owner — the individual behind the entity. If you said "Spain" at KYC, the data goes to Spain via CRS. The LLC is treated as transparent for the purpose of identifying the UBO; CRS looks at the human behind it.

**Can I declare the LLC at residence without specifically declaring Wise?** No. The LLC is one obligation (income attribution or dividend treatment, depending on country). Wise is the LLC's bank account and you must declare it on the corresponding form (Modelo 720 in Spain, Form 3916 in France, RW in Italy). They are two different obligations and both cross-checks fire automatically.

At Exentax we set up Wise + Mercury + Stripe accounts with CRS and FATCA reporting in mind from day one, and we plan the local filings (720, 721, 3916, RW) so the automatic cross-check never triggers an information request or an attribution penalty.
<!-- /exentax:execution-v2 -->

## References: sources and banking framework

The banking operations described above rest on public documentation and on the policies currently in force at each platform:

- **Bank Secrecy Act and FinCEN.** 31 U.S.C. §5318 (mandatory KYC/AML programs for financial institutions), 31 CFR Part 1010 (CIP, customer identification) and 31 U.S.C. §5336 with the FinCEN Reporting Rule effective 1 January 2024 (Beneficial Ownership Information Report).
- **FATCA and CRS.** IRC §1471–1474 (FATCA and the W-8/W-9 forms), the Model 1 Intergovernmental Agreements signed by the United States with Spain and several LATAM countries, and the OECD Common Reporting Standard (CRS), which the US does not participate in but which still applies to fintechs holding European licences (Wise Europe SA in Belgium, Revolut Bank UAB in Lithuania).
- **Specific platforms.** Published terms of service, privacy policies and regulatory FAQs of Mercury (Choice Financial Group / Evolve Bank, FDIC), Relay (Thread Bank, FDIC), Wise Business (FinCEN MSB in the US; Wise Europe SA in the EU; Wise Payments Ltd. in the UK), Revolut Business and Payoneer.

For information purposes; every banking case needs its own analysis of KYC, residency jurisdiction and operational volume.

_More on this topic: [Visa and Mastercard: what tax authorities really see of your card spending](/en/blog/visa-mastercard-reporting-what-tax-authorities-see-from-card)._

<!-- related-inline-stripped-2026-04 -->

Want to apply this protocol to your own case? <a href="/en/book">Book a session with the Exentax team</a> and we will go through your LLC with real numbers in thirty minutes, no commitment.


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
<p data-testid="cta-action-row">Want to talk now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22wise%20business%20crs%20reporting%20fiscal%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we will get back to you the same day.</p>

If you would rather discuss it live, <a href="/en/book">book a free session</a> and we will review your real case in thirty minutes.

<!-- exentax:conv-fill-v1 -->
Or call us directly at <a href="tel:+34614916910">+34 614 916 910</a> if you'd rather talk.

For state-specific details, see our <a href="/en/services/llc-wyoming">Wyoming LLC service page</a> with closed costs and timelines.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->

`;
