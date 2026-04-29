export default `

Every couple of years a "definitive" version of automatic exchange of tax information shows up, and with it the question we hear most often at Exentax: if the OECD tightens the screws again with CRS 2.0 and CARF, what exactly happens to a <a href="/en/blog/llc-united-states-complete-guide-non-residents-2026">US LLC</a> owned by a European or Latin American non-resident? The short answer is that the perimeter tightens outside the United States, not inside. The long answer, which is the one that matters, requires understanding why Washington never signed CRS 1.0, why it will not sign CRS 2.0 either, and how that affects your structure today and your planning for the years ahead.

> **Put numbers on your case.** The <a href="/en#calculadora">Exentax calculator</a> compares your current tax bill with what you would carry running a properly structured and properly declared US LLC.

## Executive summary

CRS 2.0 (the revised Common Reporting Standard) and CARF (Crypto-Asset Reporting Framework) widen what banks and exchanges report to the tax administrations of participating jurisdictions. More data, more reporting entities and, above all, more crypto inside the perimeter. The United States is not in the picture and nothing in its tax policy of the last decade suggests it ever will be: it has its own regime, FATCA, which is bilateral and one-way, and captures trillions of dollars of foreign capital precisely because it offers the only major jurisdiction outside CRS. For the non-resident owner of a US LLC, this is not a shortcut to "hide" anything; it is a technical fact that shapes your banking stack, your state choice and how cleanly your home declaration matches what your bank actually reports.

## Original CRS: what it tried to fix and where it fell short

The **Common Reporting Standard** was approved by the OECD Council as the political response to the G20 mandate after the financial crisis and the tax-evasion scandals of the previous decade (LuxLeaks, SwissLeaks, Panama Papers). The mechanics of FATCA, already running unilaterally for the US, were generalised to over 110 jurisdictions through a Multilateral Competent Authority Agreement (MCAA) that activates the flows bilaterally between any two participating countries.

The standard requires every **Reporting Financial Institution** (banks, brokers, fintechs holding banking licences, investment funds, insurance companies with investment products) to identify each account holder whose tax residence differs from the account jurisdiction and report:

- Holder data: name, address, country of tax residence, TIN, date and place of birth.
- Entity data: name, TIN, country. For accounts held by **passive NFEs**, the **controlling persons** behind the entity must also be identified.
- Account data: number, name and identifier of the financial institution.
- Balances and yields: year-end balance, gross interest, gross dividends, and gross proceeds from sales or redemptions on custody accounts.

That data is sent every year, typically in September of the year following the reported tax year, and is cross-checked against the taxpayer's own filings in the country of residence. In Spain, Royal Decree 1021/2015 and Order HAP/1695/2016 govern **Modelo 289**, which is the AEAT's CRS reporting form. We unpack the residents'-side mechanics in our companion article on <a href="/en/blog/crs-for-residents-in-spain-and-latam-real-implications">CRS for residents in Spain and LATAM</a>.

The OECD itself recognised that CRS 1.0 left meaningful gaps: **e-money institutions** and **EMIs** sat in a grey area depending on jurisdiction; **crypto wallets** and **exchanges** were entirely outside; some non-custodial **investment vehicles** escaped the categorisation; and the due diligence on **controlling persons** of passive NFEs was uneven, with loose interpretations in some marketplaces. The political pressure to close those gaps came mostly from the European Commission and Germany, which wanted a stricter perimeter before the money rotated into uncovered formats.

## CRS 2.0 and CARF: the OECD's new package

The OECD approved two pieces in one package and they need to be read together. The first is the comprehensive overhaul of the Common Reporting Standard, informally known as **CRS 2.0**. The second is the **Crypto-Asset Reporting Framework (CARF)**, which extends the same automatic-exchange logic to the crypto universe. Both were published as a single package and have been transposed in the EU through **Directive DAC8** (DAC8 amends Directive 2011/16/EU to bring CARF and the revised CRS in). We deep-dive the European piece in <a href="/en/blog/dac8-and-cryptocurrencies-the-automatic-tax-reporting-of">DAC8 and crypto-asset reporting</a>.

The most relevant operational changes:

1. **Perimeter widened to EMIs and electronic-money products**, neobanks without a full banking licence and digital wallets offering deposit-like services.
2. **Crypto-assets and stablecoins are inside the reportable scope** when the crypto service provider has presence in a participating jurisdiction (CARF). That sweeps in exchanges, custodians, crypto-derivatives platforms and DeFi providers with a centralised element.
3. **Stricter due diligence on controlling persons** of passive NFEs: more documentation, less interpretive room, granular self-certifications.
4. **Tighter treatment of joint accounts**, trusts and opaque vehicles: where there is reasonable doubt on the residence of the controlling person, the reporting now duplicates to several jurisdictions by default rather than picking one.
5. **Phased adoption and periodic review**: CARF goes live in waves depending on each jurisdiction's transposition, with most EU countries starting first and the rest of the G20 following.

For a tax resident in any participating country, the practical takeaway is clear: most money you move through European fintechs or through exchanges based in participating jurisdictions falls inside the automatic information perimeter towards your tax authority. What used to be "not automatically reported" is now the exception.

## Why the US will not sign CRS (the unvarnished version)

This is the part that creates the most confusion and that we repeat at Exentax every week. The United States did not sign CRS 1.0 and will not sign CRS 2.0 for structural reasons, not by oversight. Three combined factors explain it:

- **It already has FATCA and does not need CRS.** The **Foreign Account Tax Compliance Act**, passed inside the HIRE Act, requires foreign financial institutions to identify and report to the IRS accounts held by **US persons** (citizens, US tax residents and US entities). It is a **bilateral** regime articulated through **Intergovernmental Agreements (IGAs)** Model 1 (reciprocal exchange via the local tax authority) and Model 2 (financial institution reports directly to the IRS). Real reciprocity, however, is very limited: in practice the IRS receives far more from foreign banks than it returns to foreign authorities about non-residents' US accounts. Adopting CRS would mean accepting full multilateral reciprocity, which is exactly what Congress has blocked for the entire last decade, regardless of which party holds the majority.
- **It is in its interest to be the world's "non-CRS" jurisdiction.** Through a convergence of incentives, the United States has become the preferred destination for foreign capital looking for **the world's largest financial market** combined with a much narrower automatic-exchange perimeter than Europe's. Estimates from organisations such as the Tax Justice Network put several trillion dollars of foreign capital inside the US financial system that is not automatically reported under CRS. A meaningful chunk flows through **trusts**, transparent **LLCs** and private banking accounts in Delaware, Nevada, Wyoming, South Dakota or Florida. Trading that position for a marginal recovery gain is, for Washington, a bad deal.
- **The domestic political cost is prohibitive.** Adopting CRS would require new federal legislation, amendments to the Internal Revenue Code, an extension of **Form 1099** and the account identification regime, and a doctrinal shift in how Single-Member LLCs (Disregarded Entities with foreign owners) are treated. Powerful interest groups (banking lobby, state registries, fiduciary services lobby) have blocked that agenda for years and will keep doing so.

The technical conclusion, without maximalism, is that **the FATCA vs CRS asymmetry is the central design, not a historical accident**. Any professional planning that starts from "the US will join CRS soon" rests on a premise Washington has consistently refused.

## How the US wins by hosting non-residents' LLCs

At first glance, the model looks counter-intuitive. If the IRS does not collect federal tax on the profits of a **pass-through LLC** owned by a non-resident with no US-territory ECI (Effectively Connected Income), what does the US gain by hosting hundreds of thousands of foreign-owned LLCs in its registries? The answer has three layers:

- **State formation and maintenance fees**, recurring and highly efficient. Delaware, for instance, collects an **Annual Franchise Tax** from every LLC formed there; multiplied by hundreds of thousands of active entities, this is one of the state's first non-tax revenue lines. Wyoming, New Mexico, Florida and Nevada compete on different formats of recurring fees (annual report, registered agent, business licence) that fund significant portions of their budgets. We unpack the comparison in <a href="/en/blog/new-mexico-vs-wyoming-vs-delaware-which-state-for-your-llc">New Mexico vs Wyoming vs Delaware</a>.
- **Capturing foreign capital into the financial system**. American neobanks (Mercury, Relay), large commercial banks and retail brokers live partly off non-resident deposits and operations channelled through LLCs that vehicle digital businesses and investment portfolios. That capital stays inside the US system, generates margin for the institutions, and multiplies liquidity for the broader economy.
- **Indirect taxation through IRS Forms 5472 + 1120 — no revenue but full data**. Even when the foreign-owned pass-through LLC owes no federal tax, it **must still file** Form 5472 with a pro-forma Form 1120 every year (Treas. Reg. §1.6038A-2). The IRS therefore receives a very complete map of **reportable transactions** between the LLC and its foreign owner, data it uses for tax-intelligence purposes and for coordination with foreign authorities when there is a specific bilateral instrument. We explain the mechanics in <a href="/en/blog/form-5472-what-it-is-who-must-file-it-and-how-to-comply">Form 5472, what it is and how to file it</a>.

Adding the three layers, the maths for Washington is very positive: low direct revenue cost, steady state revenue, foreign capital inside the system and an intelligence perimeter the IRS controls end to end. There is no incentive to break that equilibrium by joining CRS and pushing that capital toward competing jurisdictions.

## What this all means for your LLC and your structure

Bringing the above down to actual decisions we take with Exentax clients every week, the operational picture in priority order:

- **Your LLC remains a valid and declarable tool.** The fact that the US is outside CRS does not turn your LLC into an "opaque structure" from your home tax authority's perspective. You have your own filing duties (Spain: IRPF + Modelo 720 + Modelo 721 if applicable; LATAM: equivalent regimes; UK: Self Assessment + Worldwide Disclosure; etc.) that do not depend on CRS. What changes is the automatic flow, not your obligation.
- **The banking stack is the decisive factor.** If you bank exclusively with US institutions (Mercury, Relay, regional banks) under the LLC's name, your CRS footprint to your home tax authority is essentially zero. The moment you add a European layer (Wise Business, European Revolut Business, N26, Wallester, Payoneer Europe), you accept that this information will reach your administration. Not good or bad: it is information your planning must absorb so that what you declare and what is reported match. We unpack it in <a href="/en/blog/do-us-bank-accounts-report-to-your-home-tax-authority-the">what each US institution reports to your tax authority</a>.
- **Crypto changes regime under CARF.** If you hold meaningful balances on exchanges based in Europe or in any participating jurisdiction, assume your tax authority will receive that information automatically in the near term. Pre-CARF and post-CARF planning is not the same. We go through the detail in <a href="/en/blog/dac8-and-cryptocurrencies-the-automatic-tax-reporting-of">DAC8 and crypto</a>.
- **The state of formation matters for non-tax reasons but operational ones**. Wyoming and New Mexico keep winning for freelancer and services profiles; Delaware keeps winning for SaaS aimed at raising capital or for holdings; Florida fits cases with US physical nexus. None of these decisions hinges on CRS — all of them hinge on how your activity and your banking match the jurisdiction. We cover this in <a href="/en/blog/self-employed-in-spain-vs-llc-in-the-us-complete-tax">self-employed vs LLC</a>.
- **Tax residence of the owner is the master variable.** Residence is not chosen, it is determined by facts (days of physical presence, centre of economic interests, family nucleus). Trying to hide your real residence under cover of the FATCA-CRS asymmetry is, beyond a technical mistake, a defined infraction in most European and Latin American jurisdictions with severe penalties. Any professional design starts from real residence and structures around it. That is exactly why at Exentax we keep your calendar tight — you stop thinking about deadlines and we close them before they ever bite.

<!-- exentax:lote16-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-en -->
## Why the US position on CRS is structural rather than political

The reason the United States has not joined CRS is structural, not a matter of political mood that can change in any given administration. The US already has its own information regime under FATCA and a domestic reporting infrastructure built around the same identifiers used by the IRS. Joining a parallel multilateral exchange would duplicate the work without adding visibility for the US side.
<!-- /exentax:lote16-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-en -->

<!-- exentax:lote34-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-en -->
## How to read CRS 2.0 and CARF coverage as a stable jurisdictional mapping rather than as a moving target

CRS 2.0 and CARF coverage read more usefully when they're treated as a stable jurisdictional mapping between the country of the financial institution, the country of residence of the beneficial owner and the framework that applies between them, than as a moving target. The mapping doesn't shift with marketing trends.
<!-- /exentax:lote34-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-en -->

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Free consultation, no strings attached</a>
<!-- /exentax:calc-cta-v1 -->

## Common mistakes we see every week

- "Since my LLC banks only with Mercury, my home tax authority knows nothing." True for the CRS automatic channel, false for the obligation. Your local foreign-asset declaration (Modelo 720 if Spain, equivalent regimes elsewhere) still applies.
- "I'll use Revolut Business, it's more convenient, and being European it's outside CRS." Mixed-up errors. European Revolut is in CRS, and an LLC opening does not always trigger a European IBAN: it depends on the regime Revolut assigns. We break it down in <a href="/en/blog/revolut-business-and-crs-what-it-reports-to-your-tax">Revolut Business and CRS</a>.
- "CARF doesn't reach me because I use an offshore exchange." If that exchange has European clients and operates under a European licence or has commercial presence in a participating jurisdiction, it does reach you. CARF looks at activity and clients, not formal seat.
- "I'll register the LLC under a third party so I'm not identified." That is a nominee setup. Serious criminal and tax exposure. We collect them in <a href="/en/blog/nominee-owners-for-llcs-why-it-is-illegal-and-the-risks-you">nominee owners for LLCs</a>.
- "The US is going to sign CRS soon, I should close the LLC." A false premise based on the political track record. Planning built on a hypothesis that does not materialise leads to forced regularisations and rushed exits.

<!-- exentax:execution-v2 -->
## The Exentax method: how we approach this planning

CRS 2.0 and CARF are not a crisis for a properly structured LLC; they are a perimeter shift that gets folded into the initial diagnosis and into yearly maintenance. The Exentax method runs three blocks in order and leaves a paper trail at each step so the decision is defensible if any inspection lands on you.

- **CRS and CARF diagnosis of your current situation.** We map every account in your name and in the LLC's name, identify which entities report to which jurisdiction and cross-check that picture with your filings of the latest tax years. The objective is to detect mismatches before the administration does.
- **Banking stack aligned with your residence.** We set the primary bank (Mercury or Relay), gateways, multi-currency accounts and, when applicable, the crypto exchange that fits your volume and country. The rule is that every piece must make tax and operational sense — not fill a slot in the chart.
- **Single calendar of obligations.** State Annual Report, Form 5472 + 1120, BOI Report, residence-country tax filing, foreign-asset declarations when applicable, all in one sheet with advance notices so nothing slips.

To apply this method to your own case, open the <a href="/en#calculadora">Exentax calculator</a> or book thirty minutes with the team: you will leave the call with a clear diagnosis and, if needed, an orderly regularisation calendar at no commitment.
<!-- /exentax:execution-v2 -->

## Frequently asked questions

**Does CRS 2.0 force the US to do anything?** No. CRS 2.0 is an OECD standard adopted by participating jurisdictions. The US is not a CRS jurisdiction and keeps FATCA as its own regime.

**If I open an LLC now, will it still be outside CRS several years from now?** The political and economic trajectory says yes, for the structural reasons explained above. It is not a binding legal commitment from Washington, but it is the most solid reading of its sustained tax policy across the entire last decade.

**Does my LLC have to report anything to my home country under CRS?** Your LLC, as a US entity, is not a Reporting Financial Institution under CRS. The reporting parties are the banks and fintechs where it holds accounts, depending on each account's jurisdiction. Automatic reporting is on the financial institution, not on the LLC itself.

**Does the IRS share information about my LLC with my home tax authority?** Only when a specific bilateral instrument exists and the request meets the formal requirements (treaty exchange, FATCA IGAs with real reciprocity, specific administrative cooperation). There is no automatic flow equivalent to CRS, but it is not impossible for individual cases that are properly motivated.

**Can I use my LLC to invest in Europe without my home tax authority finding out?** No. If the investment account sits at a European entity, that entity reports under CRS to the country of residence of the beneficial owner. The opacity of the US LLC dissolves at the first European bank in the chain.

**When will CARF show up in practice?** The first CARF reporting waves are already arriving as countries transpose. The general rule is to assume that any exchange with seat or licence in a CARF jurisdiction will report your balances to the residence country shown on your self-certification.

## Let's talk about your case

Every structure has nuances: the country of residence, the type of activity, whether crypto is in the picture, the volume, the age of the LLC, the obligations accumulated. At Exentax we review your situation, size up real exposure to CRS 2.0 and CARF, and design the LLC structure and banking stack that fit you. We stay with you year after year on maintenance so the calendar and filings stay coherent with the reality of your business.

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
<!-- exentax:conv-fill-v1 -->
Or call us directly at <a href="tel:+34614916910">+34 614 916 910</a> if you'd rather talk.

For state-specific details, see our <a href="/en/services/llc-wyoming">Wyoming LLC service page</a> with closed costs and timelines.

<!-- /exentax:conv-fill-v1 -->

<!-- exentax:conv-fill-v1 -->
Or message us on <a href="https://wa.me/34614916910">WhatsApp at +34 614 916 910</a> and we'll get back to you today.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cross-refs-v1 -->
## On the same topic

- [CRS and your US LLC bank accounts: what is shared with your home country](/en/blog/crs-and-your-us-llc-bank-accounts-what-gets-shared-with-your)
- [DAC8 and crypto: the new automatic tax reporting that arrives in 2026](/en/blog/dac8-and-cryptocurrencies-the-automatic-tax-reporting-of)
- [Wise IBAN with your LLC: what actually gets reported to the tax office](/en/blog/wise-iban-and-llc-what-actually-gets-reported-to-the-tax)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:cta-v1 -->
Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->
`;
