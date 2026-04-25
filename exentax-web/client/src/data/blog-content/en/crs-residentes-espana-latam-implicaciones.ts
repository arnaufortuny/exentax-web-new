export default `The Common Reporting Standard (CRS) is the most important piece of international tax compliance of the last decade, and very few people understand what it actually means for someone who owns a <a href="/en/blog/llc-in-the-united-states-complete-guide-for-non-residents-in">US LLC</a> or holds accounts outside their country of residence. Let's break it down with technical precision and without alarmism.

## What CRS is and why it exists

The **Common Reporting Standard** was approved by the <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a> Council in July 2014 in response to the G20 mandate after the financial crisis and the major tax-evasion scandals (LuxLeaks, Panama Papers). The objective: tax authorities of adhering countries automatically exchange information about financial accounts held by non-residents.

Technically, CRS generalizes the prior model (FATCA) to more than 100 jurisdictions, but on a multilateral rather than bilateral basis. Spain transposed it via Royal Decree 1021/2015 and Order HAP/1695/2016, which regulate **Form 289** (the annual informative return that Spanish financial institutions submit to the AEAT, and which is received in reverse from other adhering countries).

In Latin America CRS is implemented in, among others: Mexico (since 2017), Argentina, Colombia, Chile, Brazil, Uruguay, Panama, Peru, Costa Rica, Ecuador and the Dominican Republic. The United States, importantly, is **not adhered to CRS**. It runs its own system (FATCA), which is bilateral and outbound only, not inbound. We dive deeper into this in our article on <a href="/en/blog/do-us-bank-accounts-report-to-your-home-tax-authority-the">whether US bank accounts report to your tax authority</a>.
### Regulatory framework

- **OECD**: Common Reporting Standard, July 2014. Consolidated text and official commentaries.
- **EU**: Council Directive 2011/16/EU on administrative cooperation (DAC), amended by DAC2 (Directive 2014/107/EU), which incorporates CRS into Union law.
- **Spain**: Royal Decree 1021/2015, Order HAP/1695/2016, Order HAC/3625/2003 (Form 720), Order HFP/886/2023 (Form 721 for crypto-assets held abroad).
- **Multilateral Competent Authority Agreement (MCAA)**: the OECD instrument by which each country activates bilateral exchange with each of the others.
### What is reported

Each **Reporting Financial Institution** (bank, broker, fintech with banking license, investment fund, insurance company with investment products) that detects an account holder whose tax residence differs from the country where the account is held must report:

| Category | Detail |
| --- | --- |
| Account holder data | Name, address, country of tax residence, TIN, date and place of birth (individuals) |
| Entity data | Name, TIN, country. For accounts held by **passive NFEs**, also data of the **controlling persons** |
| Account data | Account number, name and identifier of the financial institution |
| Balances | Year-end balance (or balance at closure if the account was closed during the year) |
| Income | Gross interest, gross dividends, other gross income, gross proceeds from sale or redemption of financial assets (custodial accounts) |

The flow is annual, typically between May and September of the year following the reported period, and is then cross-checked against the taxpayer's filings.
## What happens with your US LLC

Here is where the misunderstandings begin. Let's nail down the concepts:

1. **The US does not send data via CRS.** Mercury, Relay or any US regional bank will not directly send data to AEAT, SAT, DIAN or AFIP through CRS. What the US does is FATCA, which is **unilateral outbound**: it requests data from foreign institutions about US-person accounts, but does not automatically send equivalent data the other way (it does in some cases through Model 1 IGAs, but at far smaller scope than CRS).
2. **Your accounts at European fintechs in your LLC's name ARE reported.** Wise (Belgium), Revolut (Lithuania), N26 (Germany), Wallester (Estonia) are financial institutions subject to CRS in their jurisdictions. If the holder is your LLC and you are the **beneficial owner** resident in Spain or LATAM, that data reaches your tax authority. We develop this further in our dedicated articles on <a href="/en/blog/revolut-business-and-crs-what-it-reports-to-your-tax">Revolut and CRS</a> and <a href="/en/blog/wise-business-and-crs-what-it-reports-to-your-tax-authority">Wise and CRS</a>.
3. **Your LLC is most likely a passive NFE**, unless it can demonstrate real operational activity (more than 50% of income is operational and not passive: dividends, interest, rents, non-active royalties). For the typical single-member LLC providing services, the European fintech tends to classify it as a passive NFE out of caution, which **triggers reporting of the controlling persons**.
### How CRS tax residence is determined

The financial institution applies a **due diligence procedure** (RD 1021/2015 and CRS Annex I) based on the holder's self-certification plus objective indicia: postal address, phone number, recurring IP, declared TIN, repeated transfer instruction to accounts in another country, powers of attorney granted to residents in another country.

If your self-certification says "tax resident in Andorra" but your IP, card delivery address and recurring transfers point to Madrid, the institution may request **additional documentation** (tax residence certificate, lease, etc.) or, in case of doubt, report to both jurisdictions. False CRS self-certification is a tax offence in most jurisdictions and can have criminal consequences depending on the amounts involved.
### Real implications in Spain (Forms 720 and 721)

If you are a Spanish tax resident and you have:

- **Foreign accounts** with individual or aggregate balance > €50,000 at 31 December or average balance in the last quarter: **Form 720** informative return.
- **Foreign crypto-assets** > €50,000 at 31 December: **Form 721**.
- **Foreign securities, rights, insurance, income** > €50,000: Form 720 corresponding sections.

The CJEU judgment C-788/19 (27 January 2022) struck down the originally disproportionate sanction regime for Form 720, but the obligation to report **remains fully in force** with ordinary penalties (LGT art. 198) and with the qualifier that undeclared income may be regularised as unjustified capital gains (LIRPF art. 39, in what is not affected by the CJEU ruling).
## How to plan correctly

The technical conclusion is the opposite of what many influencers say: **a properly structured US LLC banking solely with Mercury/Relay (US) has minimal CRS footprint**, because the US does not export CRS data. But as soon as you add a European layer (Wise, Revolut, Wallester, N26), you accept that the information will reach your tax authority. It is neither good nor bad: it just is, and planning requires knowing it.

The professional approach involves:

1. **Filing correctly.** The cross-check already exists; trying to hide is a waste of time and exposes you to penalties.
2. **Designing the structure for the declared activity to be tax-efficient.** This means deciding country of residence, investment instruments, remittance schedule, deductions and applicable DTT. See our <a href="/en/blog/designing-a-solid-international-tax-structure-step-by-step">framework for designing a solid international structure</a>.
3. **Maintaining documentation**: contracts, invoices, expense receipts, LLC books, consistent CRS self-certifications.
4. **Knowing the risks of getting it wrong.** We cover them in <a href="/en/blog/tax-risks-of-bad-international-structuring-simulation-cfc">tax risks of bad international structuring</a>.
### Common mistakes we see every week

- "Since Mercury is in the US, no one finds out." True for Mercury vs CRS, but false for your Wise/Revolut/Wallester/N26 accounts in the same LLC's name.
- "I declared tax residence in Andorra/Paraguay/Dubai but I still live in Spain." Tax residence is not chosen; it is determined by facts (183 days, centre of economic interests, core of vital interests).
- "If my LLC invoices, nothing happens to me." The AEAT can apply **CFC rules** (LIS art. 100, applicable to individuals via LIRPF art. 91) if your LLC generates passive income and the entity is under your control. Planning must avoid this scenario, not ignore it.
## In summary

CRS is not "avoided" from a European jurisdiction. It is planned for, with knowledge. A US LLC remains an extraordinarily useful tool, but the design of your banking stack and your tax residency are decisive for the informational footprint you generate to be consistent with what you declare.

Want us to review how CRS affects your specific case and design the right stack? Book your free consultation and we'll analyze it with you.

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Free consultation, no strings attached</a>
<!-- /exentax:calc-cta-v1 -->

If something in this structure left you wanting more detail, <a href="/en/blog/why-spanish-freelancers-are-leaving-self-employment-for-a-us">Why Spanish freelancers are leaving self-employment for a US LLC</a> dives into a neighbouring piece of the puzzle we usually keep for a separate write-up.
### Next steps

If you want to validate whether this strategy fits your specific situation, at Exentax we review your case personally and propose the legal and efficient structure that truly suits you. Book an initial no-commitment session from our contact page.

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
## References: legal framework and regulation

Read this section as a checklist with teeth: each point flags a real failure mode we have seen in cross-border LLC files. Skip none of them - most reassessments and account closures we clean up later trace back to one of these items.

## Let's talk about your structure

We treat this block as one of the load-bearing decisions of the LLC strategy: get it wrong and the rest of the structure leaks tax, banking access or compliance. The notes below distil what we actually do with clients facing this exact case, prioritising the variables that move the needle.

## What happens with your US LLC: the nuance almost no one explains

Our position here is deliberate and conservative: we optimise for what survives an inspection, not for the most aggressive headline number. The points below are the ones we are willing to defend in writing.

## Real implications in Spain (Modelos 720 and 721)

Read this section as a checklist with teeth: each point flags a real failure mode we have seen in cross-border LLC files. Skip none of them - most reassessments and account closures we clean up later trace back to one of these items.<!-- exentax:execution-v2 -->
## What CRS means today for residents of Spain and Latin America

CRS runs on autopilot: 110+ jurisdictions exchange data every September on year-end balances of the prior year. If you are tax resident in Spain, Mexico, Colombia, Chile, Peru, Argentina or Uruguay, the banks where you hold foreign accounts are already reporting or will be soon. This is what matters, no paranoia.

- **What is reported.** Account balances at December 31, gross annual income (interest, dividends), holder's name, tax residency declared to the bank and, for transparent entities, controlling person data. The information lands at the residence country and is crossed with the taxpayer's filing.
- **What is not reported.** Detailed account movements, specific counterparties, transactional information. CRS is balances + gross income + identification; it is not transaction traceability. The "they know everything" perception is exaggerated literally but right in consequence: with balances and gross income they build enough presumption to open an inquiry.
- **Spain, Modelo 720 and Modelo 721.** The Spain tax resident has an own duty to declare foreign accounts (>50,000 € combined, Modelo 720) and foreign crypto assets (>50,000 €, Modelo 721). Independent of CRS, dependent on your duty. CRS only helps AEAT cross and detect omissions.
- **Latin America - different rhythms.** Mexico (SAT) exchanges since 2018 with extensive coverage; Colombia (DIAN) since 2017 with progressive cleanup; Chile (SII) since 2018; Argentina (AFIP) since 2018 but with operational use still under construction; Uruguay active but with tax-haven regime nuancing the flow both ways. Use intensity varies but data availability is now generalised.

### What we are asked the most

**If I have Mercury in my LLC, does my country know via CRS?** Not directly: the US does not participate in CRS. What does enter is Wise accounts (via Belgium) and, if the LLC operated from a European or Asian bank, those do. Mercury sits outside the automatic flow, not outside every declarative duty.

**How do I regularise if I have been unfiled for years?** With a complementary 720/721 filing before an inquiry hits. CJEU ruling C-788/19 capped Spanish fines; you can regularise far cheaper than 5 years ago. We assess each case.

At Exentax we map which of your accounts enter CRS, what declarative duties each triggers and design the clean entry or the orderly regularisation when applicable.
<!-- /exentax:execution-v2 -->

## What information is reported exactly

Our position here is deliberate and conservative: we optimise for what survives an inspection, not for the most aggressive headline number. The points below are the ones we are willing to defend in writing.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Call us at <a href="tel:+34614916910">+34 614 916 910</a> or message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22The%20Common%20Reporting%20Standard%20(CRS)%20is%20the%20most%20important%20piece%20of%20internatio%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Editorial review pending</strong> — The following references require manual verification against the official current source. If you spot a discrepancy, write to us and we will correct it within 24 hours.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">50%</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…E)**, salvo que demuestre actividad operativa real (más del 50% de sus ingresos son operat…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…uentas en el extranjero** con saldo individual o conjunto &gt; 50.000 € a 31 de diciembre o s…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">20.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…zo del año siguiente; sucesivas, solo si hay variación de + 20.000 € en cualquier rúbrica.…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…nvenio OCDE con sus Comentarios. - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación chec…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §77…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…U.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa F…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…cación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1021/2015</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…os CRS La entidad financiera aplica una **due diligence** (RD 1021/2015 y Anexo I del CRS)…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC2</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…6/UE de cooperación administrativa (DAC), modificada por la DAC2 (Directiva 2014/107/UE) q…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…13 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Conve…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…esde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Convenio OCD…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
