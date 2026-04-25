export default `

Wise Business (formerly TransferWise) is the most-used multi-currency fintech among owners of <a href="/en/blog/llc-in-the-united-states-complete-guide-for-non-residents-in">US LLCs</a> and international entrepreneurs in general. Its value proposition is clear: mid-market FX, local IBAN in EUR, GBP, USD and other currencies, and low fees. But Wise is also a European financial institution subject to the **Common Reporting Standard (CRS)**, with real implications worth knowing before integrating Wise into your structure.

## Which Wise entity operates your account and where it reports

Wise operates through several regulated entities:

- **Wise Europe SA** (Belgium): EMI regulated by the **National Bank of Belgium (NBB)**. The entity that serves European clients since the loss of EU passporting after Brexit. Reports CRS to the **Service Public Fédéral Finances** in Belgium, which activates bilateral exchange with the holder's country of residence.
- **Wise Payments Limited** (UK): EMI regulated by the FCA. Continues serving UK and some legacy clients.
- **Wise US Inc.**: regulated in the US as MSB (Money Services Business). CRS does not apply because the US is not adhered.
- Subsidiaries in Singapore, Australia, India, etc., with their own regulators.

For European clients and for LLCs with European representation, the typical setup is the account being held with **Wise Europe SA (Belgium)**. Therefore, CRS reporting flows out of Belgium and reaches your country of residence.
### Regulatory framework

- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>**: Common Reporting Standard.
- **EU**: Directive 2011/16/EU as amended by DAC2.
- **Belgium**: Law of 16 December 2015 on automatic exchange of financial information (LIAFI) and implementing royal decrees.
- **Spain (receiving)**: Royal Decree 1021/2015, Form 720, Form 721. We expand in our article on <a href="/en/blog/crs-for-residents-in-spain-and-latam-real-implications">CRS for residents in Spain and LATAM</a>.
### What information Wise sends via CRS

Same as any Reporting Financial Institution under CRS:

| Block | Detail |
| --- | --- |
| Individual holder | Name, address, declared tax residence, TIN, date and place of birth |
| Entity holder | Legal name, address, EIN/TIN, CRS classification (Active/Passive NFE, Investment Entity) |
| Controlling persons | If the entity is Passive NFE: beneficial-owner data (25% direct/indirect threshold or effective control) |
| Account | IBAN(s) in each currency, internal Wise number |
| Balance | Aggregated balance at 31 December (Wise manages pools per currency; the report aggregates) |
| Income | Interest if applicable (Wise Interest, Assets), gross dividends, gross redemption proceeds (custodial accounts, Assets program) |

The **Wise Interest** product and Wise's investment products on money-market funds clearly fall under custodial-account reporting, which adds gross-income detail to the balance.
### CRS classification of your LLC at Wise

When you open a Wise Business account for your LLC, Wise applies CRS due diligence to the entity. It will ask you to complete the **CRS Self-Certification** form indicating:

- LLC tax residence: US.
- Classification: Active NFE, Passive NFE, Investment Entity, Reporting Financial Institution, etc.
- Controlling persons (with their data: name, address, residence, TIN, date and place of birth).

In practice, a single-member services LLC usually meets the **Active NFE** criteria (more than 50% of income is operational, not passive). However, Wise tends to apply conservative criteria: if documentation is not robust or the activity cannot be evidenced, it classifies as **Passive NFE** and reports to the controlling person.

The consequence: even though the LLC is American and the US does not participate in CRS, **the data on your ownership and balances will reach your national tax authority** from Belgium.
### When and how reporting happens

- Year-end: 31 December.
- Wise sends the CRS report to the Belgian authority typically between March and June of the following year.
- Belgium forwards to the tax authorities of the residence country of each holder and controlling person, normally before 30 September.
- Your tax authority has the data and cross-checks it against your filings.

So balances at Wise as of 31/12/2025 are cross-checked with your current-year IRPF (filed May-June today) and your Form 720 (filed March today).
### Common mistakes with Wise and tax

1. **"Wise is just a payment processor, nobody finds out."** False. Wise is a regulated financial institution fully subject to CRS.
2. **"If I put the LLC, I'm not personally reported."** False for Passive NFE: controlling persons are reported. And most single-member LLCs end up classified as Passive NFE out of bank caution.
3. **"My average balance is low, no reporting."** Wise reports the year-end balance regardless of fluctuations. CRS has no minimum threshold for pre-existing accounts since 2017 or for new accounts.
4. **"I didn't declare Wise on my Form 720 because it was small."** The Form 720 threshold is aggregate across all your foreign accounts, not per account.
5. **"I'll only use Wise for FX, not custody."** Even using Wise only as an operational deposit account, it remains a reportable financial account. The deposit/custody distinction affects income detail, not the balance report.
### Comparison with Revolut and Mercury

| Aspect | Wise Europe (BE) | Revolut Bank UAB (LT) | Mercury (US) |
| --- | --- | --- | --- |
| Subject to CRS | Yes | Yes | No |
| Reports LLC beneficial owner | Yes (typical Passive NFE) | Yes (typical Passive NFE) | No |
| Native investment product | Wise Assets, Interest | Stocks, Vault | Treasury, FDIC sweep |
| Native multi-currency | Excellent | Excellent | Mainly USD |
| Suitability as LLC primary account | Secondary | Secondary | Primary |

Expanded comparison in <a href="/en/blog/wise-business-with-your-llc-the-complete-guide-to-multi">the complete guide to Wise Business for your LLC</a> and in <a href="/en/blog/revolut-business-and-crs-what-it-reports-to-your-tax">Revolut and CRS</a>.
### How to plan correctly

1. **Declare correctly from the start.** Indicate your LLC's CRS classification and controlling persons accurately. Lying or omitting is an infringement and can be a crime.
2. **Keep Wise as a secondary operational account**, not as the LLC's primary, if you want to minimize CRS footprint to your country. Mercury remains the natural primary.
3. **Ensure documentary consistency.** Your Wise CRS self-certification, your Form 720 (Spain) or LATAM equivalent, and your IRPF must align.
4. **Consider the closing balance.** If you'll have a high balance at 31/12, plan for it to be declared and justified (origin, purpose, taxes paid).
5. **Know the wider framework**: <a href="/en/blog/designing-a-solid-international-tax-structure-step-by-step">your overall structure design</a> determines whether Wise + LLC + your residency works or not.
### In summary

Wise Business is not a shortcut to avoid tax reporting: it's an excellent regulated fintech that reports via CRS from Belgium to your tax authority. Well-integrated into a coherent structure with your US LLC, it's very useful. Misintegrated or used with inaccurate self-certifications, it's the source of the most typical tax problems we see.
## Tax compliance in your country: CFC, controlled-foreign rules and income attribution

A US LLC is a fully legal, internationally recognized vehicle. But compliance does not end at incorporation: as an owner who is tax-resident elsewhere, your local tax authority still has the right to tax what the LLC earns. The key is **under which regime**.

### By jurisdiction

- **Spain (LIRPF/LIS).** An operative single-member disregarded LLC (real services, no significant passive income) is generally treated under **income attribution (art. 87 LIRPF)**: the LLC's net profits are attributed to the member in the year they arise and integrated into the general IRPF base. If instead the LLC elects corporation treatment (Form 8832) and is controlled by a Spanish resident with mostly passive income, the **CFC regime (art. 91 LIRPF for individuals, art. 100 LIS for companies)** can apply. The choice is not optional: it depends on economic substance, not on the label.
- **Information returns.** US bank accounts with average or year-end balance >€50,000: **Form 720** (Law 5/2022 after CJEU C-788/19, 27/01/2022, penalties now under the general LGT regime). Related-party transactions and dividend repatriation: **Form 232**. US-custodied crypto: **Form 721**.
- **Spain–US tax treaty.** The treaty (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol in force 27/11/2019) governs double taxation on dividends, interest and royalties. An LLC without a permanent establishment in Spain does not by itself create a PE for the member, but effective management can if all activity is run from Spanish territory.
- **Mexico, Colombia, Argentina and other LATAM jurisdictions.** Each has its own CFC regime (Mexico: Refipres; Argentina: foreign passive income; Chile: art. 41 G LIR). Common principle: profits retained inside the LLC are deemed received by the member if the entity is treated as transparent or controlled.
Practical rule: an operative LLC with substance, properly declared in your country of residence, is **legitimate tax planning**. An LLC used to hide income, fake non-residence or shift passive income with no economic justification falls within **art. 15 LGT (anti-abuse)** or, worse, **art. 16 LGT (simulation)**. The facts decide, not the paperwork.

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Free consultation, no strings attached</a>
<!-- /exentax:calc-cta-v1 -->

At Exentax we structure the entity to fit the first scenario and document every step so your local return can be defended in case of review.

<!-- exentax:cta-mid -->
**Sounds heavy?** <a href="/en/services">Our services</a> already cover "Wise Business and CRS: what it reports to your tax authority and how to fit it in your structure", filed on time, with nothing for you to touch.

<!-- exentax:cta-final -->
**Tell us your situation and we'll tell you where to start.** Book a 30-minute call about "Wise Business and CRS: what it reports to your tax authority and how to fit it in your structure" and we'll go through it.
## We set it up without you losing a weekend

Thousands of freelancers and entrepreneurs already operate their US LLC fully legally and properly documented. At Exentax we handle the entire process: formation, banking, payment gateways, bookkeeping, <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> filings and compliance in your country of residence. Book a free consultation and we will tell you honestly whether the LLC makes sense for your case, with no absolute promises.<!-- exentax:execution-v2 -->
## Wise Business and CRS: how it reports to your tax authority and why to always declare

Wise Business for your LLC is operationally excellent - multi-currency, cheap FX, local IBANs in several countries - and for fiscal reporting it is a fully CRS-subject financial institution. If tax-resident in Spain, France, Italy, Germany, Portugal or any CRS country, your tax office receives data every year. Worth knowing exactly what arrives and how it cross-checks.

- **Regulatory status of Wise Business.** Wise operates with multiple licences: Wise Payments Limited (UK FCA), Wise Europe SA (Belgium NBB), Wise USD Inc (US <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>), among others. Each regional entity reports per its jurisdiction regime. For European Wise Business users, CRS reporting is by Wise Europe SA to the National Bank of Belgium, sharing with rest of CRS jurisdictions - including UBO residence.
- **Exact data transmitted.** UBO identification per KYC (name, ID/passport, address, declared tax residence at onboarding), 31 December balance per currency (Wise multi-currency reports per USD/EUR/GBP balance), total annual gross movements, account identifiers (Belgian BE IBAN for EUR, USD routing for USD, etc.). NO individual transactions, aggregates yes.
- **Automatic cross-check with your IRPF/IS.** Spain links CRS data with your tax ID to cross with: (1) Form 720 if last-quarter average or 31/12 balance exceeds €50k, (2) Form 721 if crypto > thresholds, (3) IRPF in LLC income attribution. If numbers do not match, automatic alert. Typical: information request followed by verification procedure if you do not reply with documentation.
- **What changes if LLC has Wise Business.** Wise Business EUR (Belgian account) reports faster and more completely than Wise USD (US sub-licence account). If you have both (Wise multi-currency) both report, through different channels (Belgium → CRS, US → FATCA-IGA). Practical consequence: fiscal visibility is the same, only latency changes.

### What we are asked the most

**If I open Wise Business as LLC, does it report to US or my country?** Reports to UBO's tax residence (the individual). If you said Spain at KYC, goes to Spain via CRS. LLC is transparent for UBO identification.

**Can I declare LLC at residence without declaring Wise specifically?** No. LLC is one thing (income attribution or dividend per country), Wise is LLC's bank account and you must declare it in corresponding form (720 Spain, 3916 France, RW Italy). Two different obligations with two automatic cross-checks.

At Exentax we structure Wise + Mercury + Stripe accounts considering what CRS and FATCA report, and plan declarations (720, 721, 3916, RW) - so automatic cross-check generates no request or imputation sanction.
<!-- /exentax:execution-v2 -->

## How we work at Exentax

Our team specialises in international tax structures for residents of Spanish-speaking countries operating online businesses. We combine local knowledge of Spain, Andorra and Latin America with operational experience setting up entities in Delaware, Wyoming, Estonia and other jurisdictions. Every case starts with a free consultation in which we evaluate residency, activity and goals, and we honestly tell you whether the proposed structure makes sense or whether a simpler alternative is enough.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Call us at <a href="tel:+34614916910">+34 614 916 910</a> or message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22wise%20business%20crs%20reporting%20fiscal%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Editorial review pending</strong> — The following references require manual verification against the official current source. If you spot a discrepancy, write to us and we will correct it within 24 hours.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">25%</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…s Passive NFE: datos de los beneficiarios efectivos (umbral 25% directo/indirecto o contro…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">50%</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…ios suele cumplir los requisitos de **Active NFE** (más del 50% de sus ingresos son operat…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…por cuenta. Si entre Wise + Mercury + Revolut + N26 superas 50.000 €, todas se declaran. 5…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">IRC §1471</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…eneficial Ownership Information Report). - **FATCA y CRS.** IRC §1471-1474 (FATCA y formul…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">DAC2</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…ing Standard. - **UE**: Directiva 2011/16/UE modificada por DAC2. - **Bélgica**: ley de 16…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
