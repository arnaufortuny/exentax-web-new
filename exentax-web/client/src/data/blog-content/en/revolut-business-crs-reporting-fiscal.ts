export default `Revolut Business is one of the most widely used European neobanks among entrepreneurs running international structures, and particularly among owners of <a href="/en/blog/llc-in-the-united-states-complete-guide-for-non-residents-in">US LLCs</a> who need to operate in EUR, GBP and other currencies with European cards. But Revolut is also a European financial institution subject to the **Common Reporting Standard (CRS)**, with very specific consequences that almost nobody explains before opening the account.

## Which Revolut entities operate and where they report

Revolut is not a single company. The group operates through several regulated entities:

- **Revolut Bank UAB** (Lithuania): bank with full license from the Bank of Lithuania (Lietuvos Bankas) and EU passport. The principal entity for European Economic Area customers since 2021. Reports CRS to the **Valstybinė mokesčių inspekcija (VMI)** Lithuanian tax authority, which then activates bilateral exchange with AEAT, SAT, DIAN, AFIP and other authorities.
- **Revolut Ltd** (UK): EMI regulated by the FCA. After Brexit, the UK retained its own CRS regime and continues exchanging with the EU. Reports to HMRC.
- **Revolut Payments UAB**: Lithuanian EMI for payments operations within the EEA.
- **Revolut Technologies Inc.** (United States): the US group entity under which **Revolut Business is offered to clients with a US LLC**, with **Lead Bank** as US banking partner. Lead Bank is a US federally chartered bank and therefore sits **outside CRS** (the US is not a CRS participant); the applicable reporting regime is FATCA, not CRS.
- Subsidiaries in Singapore, Australia, the US and other markets with their own regulators.

Practical consequence: if you open Revolut Business as a Spanish, Mexican, Colombian or Argentine customer, your account is normally under Revolut Bank UAB (Lithuania) and information flows via the Lithuanian VMI to the country of tax residence stated in your CRS self-certification.
## Applicable regulatory framework

- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>**: Common Reporting Standard 2014, with updated official commentaries.
- **EU**: Directive 2011/16/EU (DAC) amended by DAC2 (Directive 2014/107/EU), which internalises CRS in Union law.
- **Lithuania**: Law on automatic exchange of financial account information for tax purposes, national CRS and DAC2 implementation.
- **Spain (receiving)**: Royal Decree 1021/2015, Form 720, Form 721 (already in force) for crypto-assets. See details in our article on <a href="/en/blog/crs-for-residents-in-spain-and-latam-real-implications">CRS for residents in Spain and LATAM</a>.
## What information Revolut sends

Like any Reporting Financial Institution under CRS, Revolut Bank UAB reports annually:

| Block | Data transmitted |
| --- | --- |
| Holder identification | Full name, address, declared tax residence, TIN, date and place of birth (individuals) |
| Entity identification | If the account is held by a company (typical of Revolut Business): legal name, registered address, EIN/TIN, CRS classification (Active NFE, Passive NFE, Investment Entity, etc.) |
| Beneficial owners | For accounts held by passive NFEs: data of the **controlling persons** (25% direct or indirect ownership threshold or effective control by other means) |
| Account data | IBAN, account number, internal entity identifier |
| Balances | Balance at 31 December of the reported year, or at closure date |
| Movements | For deposit accounts: gross interest credited during the year. For custodial accounts: gross dividends, gross interest, other gross income, and gross proceeds from sale or redemption of financial assets |

Revolut **does not send detail transaction by transaction**: it sends annual aggregates. But the year-end balance is enough for the AEAT to detect whether you cross the Form 720 threshold (€50,000) or the Form 721 threshold if you have linked crypto holdings.
## The case of an LLC with a Revolut Business account

Critical point. If your US LLC opens a Revolut Business account as a European customer (typically with an operational European address, card delivery in Europe or representative in Europe), Revolut runs CRS due diligence on the **entity** (the LLC) and, unless it can classify the LLC as Active NFE with robust documentation, treats it as a **Passive NFE**.

What does that imply? That Revolut is **required by CRS rules** to identify the controlling persons (you, as owner of the LLC) and to report:

- The LLC's data to its country of tax residence (US, which **does not participate** in CRS, so the data sits in VMI Lithuania with no active recipient in the US).
- The controlling persons' data to the country of tax residence of each controlling person. That is: to your tax authority if you are resident in Spain, Mexico, Colombia, Argentina, etc.

This means that, even though the LLC is American, the data on your ownership and the account balance reaches your national tax authority. The US-not-CRS barrier does not protect the information if the operational account sits in Europe.
### Active vs Passive NFE classification

Revolut will ask you to complete a CRS Self-Certification form when you open the account. There you declare whether the LLC is Active NFE or Passive NFE, who the controlling persons are, and the entity's tax residence(s).

An **Active NFE** is one in which less than 50% of its income is passive (dividends, interest, rents, non-operational royalties, investment gains) and less than 50% of its assets produce or are held to produce passive income. A typical professional services LLC invoicing consulting or development meets the Active NFE criteria.

In practice, Revolut tends to apply conservative criteria and, when in doubt or with insufficient documentation, classifies as Passive NFE. The consequence is the same: it reports to the beneficial owner.
### What if you misdeclare residence

If you declare "tax residence in Andorra" upon opening but Revolut detects indicia that you live in Spain (recurring IP, card delivery address, Spanish phone number, periodic transfers to Spain), it will apply the **change in circumstances** procedure: it will request a tax residence certificate or, failing that, report you to both jurisdictions. False self-certification can be a tax infringement and, depending on the case, a criminal offense.
## How to plan properly with Revolut Business

1. **Don't use Revolut as the LLC's primary account if you want to minimize CRS footprint to your home country.** Mercury (US) remains the optimal primary account. Revolut makes sense as a secondary account for specific needs (physical European cards, fast EUR/GBP conversion, SEPA debit).
2. **If you use Revolut, declare correctly and prepare for the data to arrive.** It's the only professional approach. We develop this in <a href="/en/blog/designing-a-solid-international-tax-structure-step-by-step">how to design a solid international structure</a>.
3. **Maintain documentary consistency.** Your CRS self-certification, your Form 720 (or LATAM equivalent) and your IRPF (or local equivalent) must tell the same story.
4. **Know the risks.** If you misdeclare, consequences materialize late but they arrive, as we explain in <a href="/en/blog/tax-risks-of-bad-international-structuring-simulation-cfc">tax risks of bad international structuring</a>.
5. **Mind your closing balance schedule.** Revolut reports the 31 December balance. If you don't want unnecessary Form 720 triggers, manage your closing balance with operational criteria, not "concealment" (which is illegal).
### Quick comparison: Revolut vs Mercury vs Wise vs CRS

| Platform | Regulatory jurisdiction | Subject to CRS | Reports your beneficial-owner data to |
| --- | --- | --- | --- |
| Mercury | US (Column NA) | No (FATCA only) | Nobody via CRS |
| Revolut Business | Lithuania (Revolut Bank UAB) | Yes | AEAT via VMI Lithuania |
| Wise Business | Belgium (Wise Europe SA, NBB) | Yes | AEAT via Belgian authority |
| Wallester | Estonia | Yes | AEAT via Estonian authority |
| N26 Business | Germany (BaFin) | Yes | AEAT via Bundeszentralamt für Steuern |

We expand the Wise comparison in our <a href="/en/blog/wise-business-and-crs-what-it-reports-to-your-tax-authority">dedicated Wise and CRS article</a>.
### Additional considerations: DAC7 and DAC8

If your LLC sells through digital platforms (Amazon, Etsy, Airbnb, SaaS marketplaces), <a href="/en/blog/dac7-the-new-digital-platform-reporting-affecting-your">DAC7</a> adds an information channel parallel to and complementary with CRS: platforms report your income directly to European tax authorities. And if you operate with crypto-assets through European exchanges, <a href="/en/blog/dac8-and-cryptocurrencies-the-automatic-tax-reporting-of">DAC8</a> activates the CRS-equivalent for crypto from today.
### In summary

Revolut Business is an excellent tool, but understanding its CRS reporting profile is essential if you have an LLC and you reside in a CRS-adhering country. The key is not to avoid Revolut, but to declare correctly and design the stack so that the information reported is consistent with what you pay.

Want to review your banking stack and understand exactly what reaches your tax authority, and how to declare it correctly? Book your free consultation.
## Tax compliance in your country: CFC, controlled-foreign rules and income attribution

A US LLC is a fully legal, internationally recognized vehicle. But compliance does not end at incorporation: as an owner who is tax-resident elsewhere, your local tax authority still has the right to tax what the LLC earns. The key is **under which regime**.

### By jurisdiction

- **Spain (LIRPF/LIS).** An operative single-member disregarded LLC (real services, no significant passive income) is generally treated under **income attribution (art. 87 LIRPF)**: the LLC's net profits are attributed to the member in the year they arise and integrated into the general IRPF base. If instead the LLC elects corporation treatment (Form 8832) and is controlled by a Spanish resident with mostly passive income, the **CFC regime (art. 91 LIRPF for individuals, art. 100 LIS for companies)** can apply. The choice is not optional: it depends on economic substance, not on the label.
- **Information returns.** US bank accounts with average or year-end balance >€50,000: **Form 720** (Law 5/2022 after CJEU C-788/19, 27/01/2022, penalties now under the general LGT regime). Related-party transactions and dividend repatriation: **Form 232**. US-custodied crypto: **Form 721**.
- **Spain–US tax treaty.** The treaty (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol in force 27/11/2019) governs double taxation on dividends, interest and royalties. An LLC without a permanent establishment in Spain does not by itself create a PE for the member, but effective management can if all activity is run from Spanish territory.
- **Mexico, Colombia, Argentina and other LATAM jurisdictions.** Each has its own CFC regime (Mexico: Refipres; Argentina: foreign passive income; Chile: art. 41 G LIR). Common principle: profits retained inside the LLC are deemed received by the member if the entity is treated as transparent or controlled.

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Free consultation, no strings attached</a>
<!-- /exentax:calc-cta-v1 -->

Practical rule: an operative LLC with substance, properly declared in your country of residence, is **legitimate tax planning**. An LLC used to hide income, fake non-residence or shift passive income with no economic justification falls within **art. 15 LGT (anti-abuse)** or, worse, **art. 16 LGT (simulation)**. The facts decide, not the paperwork.
At Exentax we structure the entity to fit the first scenario and document every step so your local return can be defended in case of review.

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

Thousands of freelancers and entrepreneurs already operate their US LLC fully legally and properly documented. At Exentax we handle the entire process: formation, banking, payment gateways, bookkeeping, <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> filings and compliance in your country of residence. Book a free consultation and we will tell you honestly whether the LLC makes sense for your case, with no absolute promises.<!-- exentax:execution-v2 -->
## Revolut Business and CRS: what it reports to your tax authority and how it looks from the other side

Revolut Business is practical, multi-currency and cheap - and reports systematically under the Common Reporting Standard like any European bank. If you open Revolut Business for your LLC thinking "it is fintech, not a bank" and therefore does not report, you are wrong. Here is what is sent, when and how the data appears at your tax office.

- **CRS regime of Revolut Business.** Revolut Bank UAB (the entity hosting Revolut Business EU) is a CRS reporting financial institution since its Lithuanian banking licence. It reports annually to the Bank of Lithuania, which shares with the rest of CRS jurisdictions - including the beneficial owner's declared tax residence. Spain, France, Italy, Germany, Portugal receive the data each year.
- **Exact data transmitted.** Holder identification (Revolut knows the UBO via KYC: name, ID/passport, address, declared tax residence at onboarding), balance at 31 December, total gross movements of the year, and account identifier (LT IBAN of Revolut Business). Individual transactions are NOT transmitted, aggregates are.
- **Why your tax office cross-checks with 720.** Spain requires Form 720 if the sum of foreign accounts exceeds €50,000 on 31/12 or last-quarter average balance. If your Revolut Business has €60k and you do not file 720, the tax office receives the data via CRS and compares. Difference = automatic case with imputation sanction (50% of amount) and interest.
- **What changes vs traditional US bank.** Revolut Business EU reports CRS automatically and fast (Q1 of next year). Mercury and Wise USD report FATCA to IRS and, via bilateral exchange with your country, it also arrives but with more latency. Operationally: Revolut accelerates the tax office's visibility on your LLC; Mercury slows it but does not eliminate it.

### What we are asked the most

**If I open Revolut Business as US LLC, does it report to US or my country?** Reports to declared UBO tax residence. If you said Spain at KYC, it goes to Spain via CRS, not US (the LLC is disregarded for UBO; the individual behind matters).

**Can I declare residence "US" at KYC to avoid reporting to my country?** False declaration to the bank - documentary false declaration offence. Additionally Revolut requests documentation supporting declared residence (utility bill, tax certificate). Not a path.

At Exentax we structure the LLC's banking stack considering what CRS and FATCA report to your residence and plan the declarations (720, 3916, RW) so automatic cross-checks do not open a case.
<!-- /exentax:execution-v2 -->

## References: sources on structures and jurisdictions

The comparisons and quantitative data on the jurisdictions cited here rely on official sources updated to today:

- **United States.** Delaware General Corporation Law and Limited Liability Company Act, Wyoming Limited Liability Company Act (Title 17, Chapter 29), IRS Form 5472 instructions and IRC §7701 (entity classification).
- **Andorra.** Llei 95/2010 de l'Impost sobre Societats (10% IS), Llei 5/2014 del IRPF and the active/passive residency framework of the Govern d'Andorra.
- **Estonia.** Estonian Income Tax Act (deferred-distribution corporate tax at 20/22%) and official documentation of the e-Residency programme.
- **Spain.** Ley 27/2014 (IS), Ley 35/2006 (IRPF, arts. 8-9 on residency and art. 100 on CFC) and the inbound-expat regime (art. 93 LIRPF, "Beckham Law").
- **OECD.** Pillar Two (GloBE) and OECD Model Tax Convention with Commentaries.

Choosing a jurisdiction always depends on the holder's actual tax residency and on the economic substance of the activity; review your specific case before taking any structural decision.

_More on this topic: [LLC in the United States: complete guide for non-residents](/en/blog/llc-in-the-united-states-complete-guide-for-non-residents-in)._

<!-- related-inline-stripped-2026-04 -->

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
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22Revolut%20Business%20is%20one%20of%20the%20most%20widely%20used%20European%20neobanks%20among%20entre%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->
`;
