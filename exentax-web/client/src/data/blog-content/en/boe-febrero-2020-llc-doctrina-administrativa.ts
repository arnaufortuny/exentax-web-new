export default `If you are a Spanish tax resident and you have a <a href="/en/blog/llc-united-states-complete-guide-non-residents-2026">US LLC</a>, the key question isn't what the <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> says but what **Spanish administrative doctrine** says about your LLC. Here lies a body of binding rulings from the Directorate-General of Taxes (<a href="https://petete.tributos.hacienda.gob.es" target="_blank" rel="noopener">DGT</a>) and resolutions of the Central Economic-Administrative Court (<a href="https://serviciostelematicosext.hacienda.gob.es/TEAC/DYCTEA" target="_blank" rel="noopener">TEAC</a>) that is absolutely decisive. Let's analyze it precisely.

## The underlying tax problem

A US single-member LLC is by default a **Disregarded Entity** for IRS purposes: it does not tax as its own entity and all its income is attributed to the partner. But Spain is not the United States, and the AEAT must **classify** the LLC under Spanish law to determine how the resident partner is taxed.

Key technical questions:

1. Does the LLC have legal personality from the Spanish-law perspective or is it treated as an entity without personality?
2. Does the LLC itself tax (Non-Resident Income Tax without permanent establishment) or is its income attributed directly to the partner (income-attribution regime, art. 87 LIRPF)?
3. If the LLC is opaque, are the partner's distributions movable-capital income (dividends) or income from work / economic activity?
4. Does the Spain-US Double-Taxation Treaty (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22-12-1990, modified by Protocol in force since 27-11-2019) apply?
5. How is double taxation avoided?

The answer to these questions has a direct impact of up to **20 percentage points** on your personal tax burden.
### The earlier doctrine: opacity and dividends

For years, the DGT considered LLCs of non-residents with their own legal personality under US law as **opaque entities** (similar to a Spanish S.L.). Therefore:

- The LLC did not tax in Spain on its income (no permanent establishment).
- When it distributed profits to the Spanish-resident partner, those were classified as **movable-capital income** (dividends), taxed in the savings base at 19-28%.
- The Spain-US DTT applied along with double-taxation deduction.

This was favorable to the taxpayer: 19-28% savings base vs. 24-47% general base for economic-activity income.
## The shift: query V0443-19 and BOE Feb-2020

In 2019, particularly with **Binding Query V0443-19, of 28 February 2019**, the DGT introduced more sophisticated analysis that lays the foundation for the line consolidated from **February 2020** onward:

> The decisive element to fiscally classify a foreign entity is not its formal legal personality in the country of formation, but a **functional comparison** with equivalent figures in Spanish law, considering substantive regime (partner liability, asset autonomy, capacity) and tax regime in the country of origin (transparent vs opaque).

Technical conclusion: a **single-member LLC treated as Disregarded Entity by the IRS** is functionally assimilated to an entity under the **income-attribution regime** of Spanish law. That is, akin to an unincorporated common-property arrangement: income is imputed directly to the partner according to its nature (economic-activity income, capital gains, etc.).

This line has been consolidated in subsequent queries (V1631-21, V2034-22, V0863-23) and in TEAC resolutions on analogous cases.
### What changes for your IRPF

If your LLC is classified as an income-attribution entity:

- **There is no "dividend distribution moment".** Income is imputed to the Spanish-resident partner in the year the LLC obtains it, regardless of distribution.
- **Income is imputed by its original nature.** If the LLC provides professional services, it is **economic-activity income** taxed in the general base (24-47%).
- **No dividend-double-taxation exemptions apply.** What applies is the **deduction for international double taxation** (art. 80 LIRPF) only for tax actually paid in the US, which for a Disregarded Entity is typically **$0** federal (see <a href="/en/blog/pass-through-taxation-for-llcs-how-it-works-and-why-it">pass-through taxation</a>).
- **LLC deductible expenses are deductible** for computing the net imputed result (as in any economic activity).
### When the LLC remains opaque

Not every LLC is automatically assimilated to a transparent entity. If your LLC:

- Has **multiple members** (Multi-Member LLC) and is treated by default as a **Partnership** in the US: the line is similar (income attribution).
- Makes a **check-the-box election** (Form 8832) to be taxed as a **C-Corporation** in the US: the situation is different. The LLC would tax as opaque in the US (federal 21%) and Spanish doctrine could classify it as opaque too; distributions would be dividends.

Query V2034-22 reinforces this logic: **the US tax regime (transparent or opaque) is the most relevant indicator** for the Spanish classification.

For UK readers, the parallel debate has been settled differently: in **Anson v HMRC [2015] UKSC 44** the Supreme Court held that a member of a Delaware LLC was entitled to UK double-taxation relief on US tax paid because the member had a direct interest in the LLC's profits as they arose. HMRC subsequently confirmed in its Manual (INTM180020) that LLCs continue to be treated as **opaque companies** for general UK tax purposes, with Anson applied case-by-case to grant credit relief. The practical takeaway is that a UK-resident member of an SMLLC may credit US tax paid against UK income tax even though the LLC is otherwise treated as a corporation for HMRC purposes — a result that is broadly the **opposite** of the Spanish income-attribution outcome.
### Spain-US Double-Taxation Treaty

The Spain-US DTT (BOE 22-12-1990, modified by Protocol BOE 23-10-2019, in force since 27-11-2019) regulates allocation of taxing rights. Key points:

- **Art. 7 DTT**: business profits taxed in the residence State unless there is a **permanent establishment (PE)** in the other State. An LLC without PE in the US and with a Spanish-resident partner does not tax in the US on business profits: it taxes in Spain.
- **Art. 22 DTT**: double-taxation elimination clause.
- **Limitation on Benefits (LOB)**: the 2019 Protocol hardened anti-treaty-shopping clauses, especially impacting opaque LLC structures.

In a **Disregarded Entity**, the DTT applies directly to the partner (the LLC is transparent), and there is no US tax to deduct.
### Operational implications

1. **You need real LLC bookkeeping.** You cannot "estimate" net result: you need books, receipts, bank reconciliations.
2. **Your IRPF must declare the imputed net result**, not the "remittance" received in your personal account.
3. **Form 720 still applies.** Income-attribution regime does not exempt the informational obligation.
4. **Forms 100/130/131.** If classified as economic activity, you need quarterly installments like any self-employed person.
### Risk of regularization if you've been treating it as dividends

If you've been declaring your LLC flows as savings-base dividends (19-28%) and the AEAT recharacterizes them as imputed economic activity (general base 24-47%), the difference can be very significant. Statute of limitations: **4 years**. Penalties: art. 191-195 LGT.

What we see: regularization of non-prescribed periods + interest + minimum 50% penalty (can rise).
### How to plan correctly

1. **Define classification with judgment.** Typical case of professional services with single-member LLC: economic activity imputed by income attribution.
2. **Design the structure for tax-efficient operation.** Decisions: capital contributions, allocated expenses, partner remuneration, alternative structures (Spanish S.L. + operational LLC, etc.). See <a href="/en/blog/designing-a-solid-international-tax-structure-step-by-step">designing a solid international structure</a>.
3. **Consider your specific activity.** Different practical regime for services, e-commerce, royalties, trading. Developed in <a href="/en/blog/llc-taxation-by-economic-activity-services-ecommerce-saas">LLC taxation by economic activity</a>.
4. **Maintain robust documentation.** It distinguishes a defensible structure from a vulnerable one.
5. **Avoid simulation.** If the LLC lacks substance and services are materially provided by the resident individual, the AEAT can apply simulation, with higher penalty and possible criminal referral.
### In summary

Spanish administrative doctrine on the US LLC is very specific: in the typical single-member LLC case, the result is imputed to the Spanish-resident partner as economic activity in the general base. This requires serious planning, not improvisation. Good news: well-designed, an LLC remains an excellent tool to internationalize your business and legally optimize your global tax burden.

Want to review your case in light of current doctrine and design the most efficient structure for your situation? Book your free consultation.

Closing out, here's a related piece that sits naturally next to this article: <a href="/en/blog/international-taxation-for-digital-entrepreneurs-the">International taxation for digital entrepreneurs: the complete guide</a> helps round off the context.
## Tax compliance in your country: CFC, controlled-foreign rules and income attribution

A US LLC is a fully legal, internationally recognized vehicle. But compliance does not end at incorporation: as an owner who is tax-resident elsewhere, your local tax authority still has the right to tax what the LLC earns. The key is **under which regime**.

### By jurisdiction

- **Spain (LIRPF/LIS).** An operative single-member disregarded LLC (real services, no significant passive income) is generally treated under **income attribution (art. 87 LIRPF)**: the LLC's net profits are attributed to the member in the year they arise and integrated into the general IRPF base. If instead the LLC elects corporation treatment (Form 8832) and is controlled by a Spanish resident with mostly passive income, the **CFC regime (art. 91 LIRPF for individuals, art. 100 LIS for companies)** can apply. The choice is not optional: it depends on economic substance, not on the label.
- **Information returns.** US bank accounts with average or year-end balance >€50,000: **Form 720** (Law 5/2022 after CJEU C-788/19, 27/01/2022, penalties now under the general LGT regime). Related-party transactions and dividend repatriation: **Form 232**. US-custodied crypto: **Form 721**.
- **Spain–US tax treaty.** The treaty (BOE 22/12/1990, Protocol in force 27/11/2019) governs double taxation on dividends, interest and royalties. An LLC without a permanent establishment in Spain does not by itself create a PE for the member, but effective management can if all activity is run from Spanish territory.
- **Mexico, Colombia, Argentina and other LATAM jurisdictions.** Each has its own CFC regime (Mexico: Refipres; Argentina: foreign passive income; Chile: art. 41 G LIR). Common principle: profits retained inside the LLC are deemed received by the member if the entity is treated as transparent or controlled.
- **United Kingdom (HMRC).** A UK-resident member of an SMLLC reports the LLC as an opaque company under HMRC practice (INTM180020). Distributions are dividends taxable in the UK at the dividend rates (8.75%, 33.75% or 39.35% in 2025/26 above the £500 allowance). When US tax has actually been paid by the member personally, **Anson v HMRC** allows a foreign-tax credit against UK income tax for the same profits. Reporting obligations include the **Foreign pages (SA106)** of the self-assessment return and, where applicable, the offshore-asset disclosure regime (TMA 1970 Sch 23 and the Requirement to Correct under FA 2017).
- **Republic of Ireland (Revenue).** Revenue Tax and Duty Manual Part 35-01-11 treats US LLCs as opaque by default for Irish tax purposes; double-tax relief mirrors the Anson logic on a case-by-case basis. CFC rules (TCA 1997 Part 35B, transposing ATAD I) may apply where a passive LLC is controlled by an Irish-resident company.
- **Canada (CRA).** Canada has consistently treated US LLCs as **corporations** for Canadian tax (Income Tax Folio S5-F2-C1 and the long-standing CRA position confirmed in TD Securities (USA) LLC v The Queen, 2010 TCC 186). Canadian residents typically face economic double taxation because pass-through US tax does not generate creditable foreign tax at the Canadian level — a structural mismatch that the CRA has not fixed.
- **Australia (ATO).** Under TR 2003/9 a US LLC is normally a **company** for Australian purposes; CFC rules in Part X of ITAA 1936 then apply when control thresholds are met, with attribution to the Australian member of tainted (passive) income at marginal rates.

Practical rule: an operative LLC with substance, properly declared in your country of residence, is **legitimate tax planning**. An LLC used to hide income, fake non-residence or shift passive income with no economic justification falls within **art. 15 LGT (anti-abuse)** or, worse, **art. 16 LGT (simulation)** in Spain — and within the **GAAR** of FA 2013 Part 5 in the United Kingdom, **section 245 ITA 1985** in Canada or **Part IVA of ITAA 1936** in Australia. The facts decide, not the paperwork.

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Free consultation, no strings attached</a>
<!-- /exentax:calc-cta-v1 -->

At Exentax we structure the entity to fit the first scenario and document every step so your local return can be defended in case of review.
## We set it up without you losing a weekend

Thousands of freelancers and entrepreneurs already operate their US LLC fully legally and properly documented. At Exentax we handle the entire process: formation, banking, payment gateways, bookkeeping, IRS filings and compliance in your country of residence. Book a free consultation and we will tell you honestly whether the LLC makes sense for your case, with no absolute promises.
## References: sources on structures and jurisdictions

The comparisons and quantitative data on the jurisdictions cited here rely on official sources updated to today:

- **United States.** Delaware General Corporation Law and Limited Liability Company Act, Wyoming Limited Liability Company Act (Title 17, Chapter 29), IRS Form 5472 instructions and IRC §7701 (entity classification).
- **Andorra.** Llei 95/2010 de l'Impost sobre Societats (10% IS), Llei 5/2014 del IRPF and the active/passive residency framework of the Govern d'Andorra.
- **Estonia.** Estonian Income Tax Act (deferred-distribution corporate tax at 20/22%) and official documentation of the e-Residency programme.
- **Spain.** Ley 27/2014 (IS), Ley 35/2006 (IRPF, arts. 8-9 on residency and art. 100 on CFC) and the inbound-expat regime (art. 93 LIRPF, "Beckham Law").
- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>.** Pillar Two (GloBE) and OECD Model Tax Convention with Commentaries.
- **United Kingdom.** HMRC International Manual INTM180020 on US LLCs, Anson v HMRC [2015] UKSC 44, and the Foreign Notes for self-assessment SA106. For US-connected UK persons, **FATCA Form 8938** sits alongside the standard SA100/SA106 disclosures.
- **Republic of Ireland.** Revenue Tax and Duty Manual Part 35-01-11 (treatment of US LLCs) and TCA 1997 Part 35B (CFC rules transposing ATAD I).
- **Canada.** CRA Income Tax Folio S5-F2-C1 (foreign tax credit) and the long-standing administrative position on US LLCs as corporations.
- **Australia.** ATO TR 2003/9 (treatment of US LLCs) and ITAA 1936 Part X (CFC and transferor-trust rules).

Choosing a jurisdiction always depends on the holder's actual tax residency and on the economic substance of the activity; review your specific case before taking any structural decision. The same Spanish ruling that drives the rest of this article is a poor proxy for what your local revenue authority will do with the same set of facts: the entity is the same, but the tax outcome can flip from full pass-through (Spain) to full corporate opacity (Canada) depending on where you actually live.

<!-- exentax:execution-v2 -->
## How the Spanish DGT-TEAC doctrine actually applies to your LLC

Spanish LLC doctrine cannot be understood by reading a single binding consultation: you have to cross-read several and grasp the underlying logic. In practice, the Spanish tax authority (AEAT) attributes the LLC's net result to the resident partner when the LLC is treated as transparent and lacks substance, and typically classifies it as business income if the activity is operational, or as capital income if it is merely passive.

- **CV0024-19, CV1631-21 and later.** Confirm that an SMLLC is treated as an income-attribution entity for the Spain-resident partner, unless a C-Corp election is formalised and effective US taxation occurs. This prevents double taxation but requires reporting the full profit in the year accrued, not when distributed.
- **Income classification.** If the LLC renders professional services, the income flows to the partner's IRPF as business income (consistent IAE heading). If the LLC merely holds passive investments, capital-income classification applies and non-resident withholding rules kick in.
- **US-Spain treaty.** The treaty (BOE of 23 October 2019, Protocol in force since 2019) allows you to credit US tax - federal and state - against the Spanish liability. For an SMLLC with no C-Corp election, federal liability is typically zero, which reduces the credit to near zero but also removes any real double taxation.
- **Modelo 720 and Modelo 721.** If the LLC's accounts hold a combined balance above 50,000 €, reporting is required, with the proportional fine limited by the CJEU ruling C-788/19. The LLC interest itself may fall within the scope of Modelo 720 when configured as a right over a foreign entity.

### What we are asked the most

**Does the AEAT treat my LLC as opaque or transparent?** Transparent by default for an SMLLC with no C-Corp election. If you want real opacity (with 21 % federal tax), you must file Form 8832 in time and document it. Both options are legitimate, but they must be chosen actively.

**What is the risk if I have been reporting wrong for years?** Voluntary regularisation through complementary returns and, depending on the case, no fine if no audit notice has arrived. We assess it with real numbers before proposing anything.

At Exentax we fit your LLC into the Spanish doctrine so the filing is documentarily defensible and consistent with your real activity.
<!-- /exentax:execution-v2 -->

_More on this topic: [LLC in the United States: complete guide for non-residents](/en/blog/llc-united-states-complete-guide-non-residents-2026)._

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
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22If%20you%20are%20a%20Spanish%20tax%20resident%20and%20you%20have%20a%20US%20LLC%2C%20the%20key%20question%20isn%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.

<!-- exentax:conv-fill-v1 -->
Or call us directly at <a href="tel:+34614916910">+34 614 916 910</a> if you'd rather talk.

For state-specific details, see our <a href="/en/services/llc-wyoming">Wyoming LLC service page</a> with closed costs and timelines.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->
`;
