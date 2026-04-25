export default `Talking about "LLC taxation" in the abstract leads to serious mistakes: real taxation depends closely on the **type of economic activity** the LLC carries out, because each activity triggers different rules of VAT, income classification, source of income, applicable DTT and, above all, exposure to controlled foreign company (CFC) or anti-avoidance rules. Let's break down the five major families we see at Exentax.

## Key points

### 1. Professional services (consulting, development, design, marketing)

Most common case and the simplest. Your LLC invoices services to international B2B clients (US, EU, LATAM). Characteristics:

- **Income nature**: economic activity.
- **Spanish classification (resident)**: economic-activity income imputed to the partner via income-attribution (see <a href="/en/blog/the-spanish-administrative-doctrine-on-the-us-llc-feb-2020">DGT/TEAC doctrine</a>).
- **VAT**: B2B billing outside Spain to an EU customer triggers **reverse charge** (the customer self-assesses VAT in their country); to a US or non-EU customer, **VAT not subject** (B2B services place-of-supply rule). More in <a href="/en/blog/vat-on-international-digital-services-when-it-applies-and">VAT on international digital services</a>.
- **Spanish IRPF**: net result in general base (24-47%).
- **Main risk**: simulation if operational substance is exclusively provided by the Spanish-resident partner without real US substance.

**Legitimate optimization**: maximize correct deductible expenses in the LLC (software, tools, subcontracting, training, marketing). The net imputed to the partner reduces and the effective average rate falls substantially compared to a pure Spanish self-employed.
### 2. Physical e-commerce (Amazon, Shopify, dropshipping)

You sell physical goods to international end consumers. Characteristics:

- **Income nature**: economic activity from sales.
- **VAT and customs**: complex. If you sell to European consumers, the LLC may have **VAT registration** obligations in EU countries individually or use the **OSS / IOSS regime**. Crossing thresholds per country requires local registration. Marketplaces like Amazon act as **deemed supplier** in many cases and withhold VAT, but not always.
- **DAC7**: as a seller on European Amazon, Etsy, eBay, your income is reported. See <a href="/en/blog/dac7-the-new-digital-platform-reporting-affecting-your">DAC7</a>.
- **Customs**: importing stock to the EU for distribution (FBA) requires **EU EORI**, importer of record, possibly IOR.
- **US sales tax**: selling to US consumers in nexus states may trigger sales-tax registration. More in <a href="/en/blog/selling-on-amazon-with-your-us-llc-complete-guide-for">Amazon with US LLC</a>.

**Main risk**: ignoring EU VAT or US sales tax can generate large retroactive bills.
### 3. SaaS and digital subscriptions

You sell software/content access, B2C or B2B, subscription or one-time. Characteristics:

- **Income nature**: economic activity + software-use license (royalty borderline).
- **TBE services**: B2C to European consumers triggers VAT in consumer's country. **Non-EU OSS** scheme (LLC registers in an EU Member State of identification) or use Merchant of Record platforms (Paddle, FastSpring, DoDo Payments, Lemon Squeezy) handling VAT for you.
- **B2B**: general reverse-charge rule.
- **Spanish income classification**: economic-activity income with active development; for passive licensing of pre-existing code without significant activity, debate on **CFC rules** (LIS art. 100, via LIRPF art. 91).
- **CFC risk**: if the LLC mostly generates passive income (licensing) and lacks material/human means in the US, the AEAT can apply CFC.

More in <a href="/en/blog/us-llc-for-software-developers-and-saas-founders-the">LLC for software developers and SaaS</a>.
### 4. Royalties and intellectual property

Your LLC owns rights (trademark, software, content) and licenses them to third parties or related entities. Characteristics:

- **Income nature**: passive (royalties).
- **DTT classification**: art. 12 Spain-US DTT (royalties). Source state may tax (with DTT cap), residence state taxes with deduction.
- **CFC risk**: high. Passive income is the typical CFC trigger. If your LLC mostly has passive income and you control it from Spain, art. 91 LIRPF (referring to art. 100 LIS) can activate.
- **Effective taxation**: under CFC, you tax in Spain as if income were directly yours, with credit for any LLC-paid tax (typically $0 federal in Disregarded Entity).
- **DTT 2019 LOB clause**: hampers DTT benefits for hybrid or no-substance structures.

**Conclusion**: a pure royalty LLC with Spanish-resident partner must be designed with real US substance or accept it falls under CFC.
### 5. Trading (stocks, futures, crypto)

Your LLC trades financial markets via Interactive Brokers, Tradovate or Kraken. Characteristics:

- **Income nature**: depends on asset and regime. FX/futures: capital gains/losses in many countries; in Spain, frequent professional trading can be reclassified as economic activity.
- **Stocks**: dividends (savings-base income 19-28% if opaque; if transparent, direct attribution) and gains from sale (savings base).
- **Crypto**: capital gains/losses (savings base) or economic activity if frequent professional trading.
- **DAC8**: applies from today with European exchanges. See <a href="/en/blog/dac8-and-cryptocurrencies-the-automatic-tax-reporting-of">DAC8 and crypto</a>.
- **CFC risk**: very high. Portfolio income is the paradigm of passive CFC income.
- **DTT**: art. 10 (dividends), 11 (interest), 13 (capital gains). 2019 LOB clauses are particularly restrictive.

More in <a href="/en/blog/cryptocurrency-and-trading-with-llc-complete-tax-guide-for">crypto and trading with LLC</a>.
### Activity summary table

| Activity | Spanish classification (typical) | VAT | CFC risk | Simulation risk | Pure LLC suitability |
| --- | --- | --- | --- | --- | --- |
| B2B professional services | Imputed economic activity | Reverse charge | Low | Medium | High |
| E-commerce | Imputed economic activity | Complex (OSS/IOSS, sales tax) | Low | Medium | High with care |
| SaaS B2B | Imputed economic activity | Reverse charge | Medium | Medium | High |
| SaaS B2C TBE | Imputed economic activity | Non-EU OSS / MoR | Medium-high | Medium | Medium-high |
| Royalties | Passive income | Generally exempt or RC | High | High | Low without substance |
| Financial trading | Passive / capital gains | n/a | Very high | High | Low without substance |
### How to choose your optimal structure

Choosing an LLC alone is not always the right answer. For low-CFC activities (services, e-commerce, SaaS B2B), a **single-member LLC** with Spanish-resident partner declaring well and with reasonable substance is efficient and defensible. For high-CFC activities (royalties, trading), either it gets **real US substance** or a different structure should be considered (Spanish operating company + LLC with limited activity, residency planning, etc.). Full framework in <a href="/en/blog/designing-a-solid-international-tax-structure-step-by-step">designing a solid international structure</a>.
### Common mistakes by activity

- **Services**: forgetting EU intra-community VAT and ROI/VIES registration.
- **E-commerce**: ignoring OSS/IOSS and US sales tax until the bill arrives.
- **SaaS**: not using a Merchant of Record and ending up with VAT-registration obligations in each EU country.
- **Royalties**: not documenting creation, ownership and maintenance of intangible assets.
- **Trading**: confusing personal and LLC trading and mixing accounts.

More on avoiding typical mistakes in <a href="/en/blog/tax-risks-of-bad-international-structuring-simulation-cfc">tax risks</a>.
### In summary

An LLC doesn't tax "in one way": it taxes by what it does, where it does it, and from where it is controlled. Serious tax planning starts by understanding your real activity, not picking a country on a map.

Want to analyze how your activity is taxed exactly and design the most efficient and defensible structure? Book your free consultation.

To keep going on this thread, <a href="/en/blog/why-spanish-freelancers-are-leaving-self-employment-for-a-us">Why Spanish freelancers are leaving self-employment for a US LLC</a> fills in a nuance this guide only touched on.

<!-- exentax:calc-cta-v1 -->
> <a href="/en/services">Start today, 100% remote</a>
<!-- /exentax:calc-cta-v1 -->

## We set it up without you losing a weekend

Thousands of freelancers and entrepreneurs already operate their US LLC fully legally and properly documented. At Exentax we handle the entire process: formation, banking, payment gateways, bookkeeping, <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> filings and compliance in your country of residence. Book a free consultation and we will tell you honestly whether the LLC makes sense for your case, with no absolute promises.<!-- exentax:execution-v2 -->
## LLC taxation by economic activity: why SaaS, agency and e-commerce are not the same

US federal taxation for a non-resident LLC depends not only on your residence, but on what the LLC does. The "non-effectively connected = 0%" rule is not uniform: the IRS applies different sourcing rules per income type, classifying your LLC as ETBUS (engaged in trade or business in US) or as passive foreign vehicle. Here is how each typical activity looks.

- **SaaS and software (digital subscriptions).** Income classified as business income, sourced where software is developed and operated. If founder not US-resident and servers are not necessarily US (regional cloud), default = foreign-source income → 0% federal. Risk: hiring US dependent agent (US-salaried VP of Sales, not independent contractor) becomes ETBUS.
- **Digital agency (professional services).** Income classified as personal services income, sourced where services are physically performed. If you are in Spain working for US clients, source is Spain (where service is performed), NOT US, even if client is US. Default: 0% federal. Exception: if team is in US or you have US office, US sourcing and becomes ETBUS.
- **E-commerce (physical products).** Triple analysis: (1) US inventory (Amazon FBA, US 3PL): may create ETBUS depending on substance. (2) Inventory outside US dropshipped to US: usually foreign-source and 0%. (3) Marketplaces: Amazon withholds sales tax, but federal income follows your sourcing. FBA + dependent agent = very high ETBUS risk.
- **Investment and trading (capital gains, dividends).** US stock capital gains for non-resident LLC: 0% federal by specific exception (portfolio investment capital gains exempt for non-residents without trade or business). US dividends: 30% withholding default, reduced to 15%/0% under treaty with W-8BEN-E. Crypto: treated as property, same as capital gains; foreign-source and 0% if no ETBUS.

### What we are asked the most

**If I sell digital courses to US clients, is it US-source income?** Not by default. Digital courses are personal services + IP licence, sourced where developed (your residence). Selling to a US client does not convert income to US-source. Still 0% federal if no ETBUS.

**Does Amazon FBA automatically make me ETBUS?** Technical debate. Conservative: yes, because inventory in Amazon US warehouse can be read as dependent agent + fixed place of business. More permissive: depends on effective control. Serious practice is assume ETBUS and plan accordingly or switch fulfilment outside US.

At Exentax we model each activity by sourcing rules and ETBUS test before forming, to not discover two years in that you pay 21% federal when you thought 0%.
<!-- /exentax:execution-v2 -->

## How we work at Exentax

Our team specialises in international tax structures for residents of Spanish-speaking countries operating online businesses. We combine local knowledge of Spain, Andorra and Latin America with operational experience setting up entities in Delaware, Wyoming, Estonia and other jurisdictions. Every case starts with a free consultation in which we evaluate residency, activity and goals, and we honestly tell you whether the proposed structure makes sense or whether a simpler alternative is enough.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Call us at <a href="tel:+34614916910">+34 614 916 910</a> or message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22Talking%20about%20LLC%20taxation%20in%20the%20abstract%20leads%20to%20serious%20mistakes%3A%20real%20ta%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you want to see the full process in detail, check our <a href="/en/services">services page</a> with everything we cover.
<!-- /exentax:cta-conv-v1 -->

  ### LLC taxation by activity: UK and Irish residents perspective

  For UK resident members of a US LLC, HMRC's longstanding position (**Statement of Practice SP 1/09** and confirmed in the **Anson v HMRC** [2015] UKSC 44 ruling) treats the LLC as **fiscally opaque** by default unless specific facts demonstrate transparency. This means LLC profits are typically taxed in the UK only when **distributed as dividend-equivalent**, reportable on **SA106 (Foreign pages)** of the Self Assessment with credit for US tax under the **UK/US Double Taxation Convention 2001 (SI 2002/2848), Article 24**. Activity-driven nexus rules apply for US **sales tax** under **South Dakota v. Wayfair, 138 S.Ct. 2080 (2018)** with a typical economic threshold of USD 100.000 or 200 transactions per state. For **trade or business** classification under **IRC §864(b)** and **ECI** under **IRC §864(c)**, the activity matters for whether US-source income triggers Form **1040-NR** filing.

<!-- exentax:cta-v1 -->
Formation, EIN, BOI, banking and ongoing maintenance — one team that understands your case end to end. <a href="/en/services">Explore all services</a>.
<!-- /exentax:cta-v1 -->

`;
