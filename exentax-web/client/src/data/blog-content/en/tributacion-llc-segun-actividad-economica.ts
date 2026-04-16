export default `Talking about "LLC taxation" in the abstract leads to serious mistakes: real taxation depends closely on the **type of economic activity** the LLC carries out, because each activity triggers different rules of VAT, income classification, source of income, applicable DTT and, above all, exposure to controlled foreign company (CFC) or anti-avoidance rules. Let's break down the five major families we see at Exentax.

  ## 1. Professional services (consulting, development, design, marketing)

  Most common case and the simplest. Your LLC invoices services to international B2B clients (US, EU, LATAM). Characteristics:

  - **Income nature**: economic activity.
  - **Spanish classification (resident)**: economic-activity income imputed to the partner via income-attribution (see <a href="/en/blog/the-spanish-administrative-doctrine-on-the-us-llc-feb-2020">DGT/TEAC doctrine</a>).
  - **VAT**: B2B billing outside Spain to an EU customer triggers **reverse charge** (the customer self-assesses VAT in their country); to a US or non-EU customer, **VAT not subject** (B2B services place-of-supply rule). More in <a href="/en/blog/vat-on-international-digital-services-when-it-applies-and-when-it-doesnt">VAT on international digital services</a>.
  - **Spanish IRPF**: net result in general base (24-47%).
  - **Main risk**: simulation if operational substance is exclusively provided by the Spanish-resident partner without real US substance.

  **Legitimate optimization**: maximize correct deductible expenses in the LLC (software, tools, subcontracting, training, marketing). The net imputed to the partner reduces and the effective average rate falls substantially compared to a pure Spanish self-employed.

  ## 2. Physical e-commerce (Amazon, Shopify, dropshipping)

  You sell physical goods to international end consumers. Characteristics:

  - **Income nature**: economic activity from sales.
  - **VAT and customs**: complex. If you sell to European consumers, the LLC may have **VAT registration** obligations in EU countries individually or use the **OSS / IOSS regime**. Crossing thresholds per country requires local registration. Marketplaces like Amazon act as **deemed supplier** in many cases and withhold VAT, but not always.
  - **DAC7**: as a seller on European Amazon, Etsy, eBay, your income is reported. See <a href="/en/blog/dac7-the-new-digital-platform-reporting-affecting-your-business-in-2026">DAC7</a>.
  - **Customs**: importing stock to the EU for distribution (FBA) requires **EU EORI**, importer of record, possibly IOR.
  - **US sales tax**: selling to US consumers in nexus states may trigger sales-tax registration. More in <a href="/en/blog/selling-on-amazon-with-your-us-llc-complete-guide-for-international-sellers">Amazon with US LLC</a>.

  **Main risk**: ignoring EU VAT or US sales tax can generate large retroactive bills.

  ## 3. SaaS and digital subscriptions

  You sell software/content access, B2C or B2B, subscription or one-time. Characteristics:

  - **Income nature**: economic activity + software-use license (royalty borderline).
  - **TBE services**: B2C to European consumers triggers VAT in consumer's country. **Non-EU OSS** scheme (LLC registers in an EU Member State of identification) or use Merchant of Record platforms (Paddle, FastSpring, DoDo Payments, Lemon Squeezy) handling VAT for you.
  - **B2B**: general reverse-charge rule.
  - **Spanish income classification**: economic-activity income with active development; for passive licensing of pre-existing code without significant activity, debate on **CFC rules** (LIS art. 100, via LIRPF art. 91).
  - **CFC risk**: if the LLC mostly generates passive income (licensing) and lacks material/human means in the US, the AEAT can apply CFC.

  More in <a href="/en/blog/us-llc-for-software-developers-and-saas-the-complete-guide">LLC for software developers and SaaS</a>.

  ## 4. Royalties and intellectual property

  Your LLC owns rights (trademark, software, content) and licenses them to third parties or related entities. Characteristics:

  - **Income nature**: passive (royalties).
  - **DTT classification**: art. 12 Spain-US DTT (royalties). Source state may tax (with DTT cap), residence state taxes with deduction.
  - **CFC risk**: high. Passive income is the typical CFC trigger. If your LLC mostly has passive income and you control it from Spain, art. 91 LIRPF (referring to art. 100 LIS) can activate.
  - **Effective taxation**: under CFC, you tax in Spain as if income were directly yours, with credit for any LLC-paid tax (typically $0 federal in Disregarded Entity).
  - **DTT 2019 LOB clause**: hampers DTT benefits for hybrid or no-substance structures.

  **Conclusion**: a pure royalty LLC with Spanish-resident partner must be designed with real US substance or accept it falls under CFC.

  ## 5. Trading (stocks, futures, crypto)

  Your LLC trades financial markets via Interactive Brokers, Tradovate or Kraken. Characteristics:

  - **Income nature**: depends on asset and regime. FX/futures: capital gains/losses in many countries; in Spain, frequent professional trading can be reclassified as economic activity.
  - **Stocks**: dividends (savings-base income 19-28% if opaque; if transparent, direct attribution) and gains from sale (savings base).
  - **Crypto**: capital gains/losses (savings base) or economic activity if frequent professional trading.
  - **DAC8**: applies from 2026 with European exchanges. See <a href="/en/blog/dac8-and-cryptocurrencies-the-automatic-tax-reporting-of-crypto-assets-in-2026">DAC8 and crypto</a>.
  - **CFC risk**: very high. Portfolio income is the paradigm of passive CFC income.
  - **DTT**: art. 10 (dividends), 11 (interest), 13 (capital gains). 2019 LOB clauses are particularly restrictive.

  More in <a href="/en/blog/cryptocurrency-and-trading-with-llc-complete-tax-guide-for-traders">crypto and trading with LLC</a>.

  ## Activity summary table

  | Activity | Spanish classification (typical) | VAT | CFC risk | Simulation risk | Pure LLC suitability |
  | --- | --- | --- | --- | --- | --- |
  | B2B professional services | Imputed economic activity | Reverse charge | Low | Medium | High |
  | E-commerce | Imputed economic activity | Complex (OSS/IOSS, sales tax) | Low | Medium | High with care |
  | SaaS B2B | Imputed economic activity | Reverse charge | Medium | Medium | High |
  | SaaS B2C TBE | Imputed economic activity | Non-EU OSS / MoR | Medium-high | Medium | Medium-high |
  | Royalties | Passive income | Generally exempt or RC | High | High | Low without substance |
  | Financial trading | Passive / capital gains | n/a | Very high | High | Low without substance |

  ## How to choose your optimal structure

  Choosing an LLC alone is not always the right answer. For low-CFC activities (services, e-commerce, SaaS B2B), a **single-member LLC** with Spanish-resident partner declaring well and with reasonable substance is efficient and defensible. For high-CFC activities (royalties, trading), either it gets **real US substance** or a different structure should be considered (Spanish operating company + LLC with limited activity, residency planning, etc.). Full framework in <a href="/en/blog/designing-a-solid-international-tax-structure-step-by-step-framework">designing a solid international structure</a>.

  ## Common mistakes by activity

  - **Services**: forgetting EU intra-community VAT and ROI/VIES registration.
  - **E-commerce**: ignoring OSS/IOSS and US sales tax until the bill arrives.
  - **SaaS**: not using a Merchant of Record and ending up with VAT-registration obligations in each EU country.
  - **Royalties**: not documenting creation, ownership and maintenance of intangible assets.
  - **Trading**: confusing personal and LLC trading and mixing accounts.

  More on avoiding typical mistakes in <a href="/en/blog/tax-risks-of-bad-international-structuring-simulation-cfc-and-residency">tax risks</a>.

  ## In summary

  An LLC doesn't tax "in one way": it taxes by what it does, where it does it, and from where it is controlled. Serious tax planning starts by understanding your real activity, not picking a country on a map.

  Want to analyze how your activity is taxed exactly and design the most efficient and defensible structure? Book your free consultation.

To keep going on this thread, <a href="/en/blog/why-spanish-freelancers-are-leaving-self-employment-for-a-us-llc">Why Spanish freelancers are leaving self-employment for a US LLC</a> fills in a nuance this guide only touched on.
`;
