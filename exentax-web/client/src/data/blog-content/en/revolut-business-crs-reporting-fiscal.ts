export default `Revolut Business is one of the most widely used European neobanks among entrepreneurs running international structures, and particularly among owners of <a href="/en/blog/llc-in-the-united-states-complete-guide-for-non-residents-in-2026">US LLCs</a> who need to operate in EUR, GBP and other currencies with European cards. But Revolut is also a European financial institution subject to the **Common Reporting Standard (CRS)**, with very specific consequences that almost nobody explains before opening the account.

  ## Which Revolut entities operate and where they report

  Revolut is not a single company. The group operates through several regulated entities:

  - **Revolut Bank UAB** (Lithuania): bank with full license from the Bank of Lithuania (Lietuvos Bankas) and EU passport. The principal entity for European Economic Area customers since 2021. Reports CRS to the **Valstybinė mokesčių inspekcija (VMI)** Lithuanian tax authority, which then activates bilateral exchange with AEAT, SAT, DIAN, AFIP and other authorities.
  - **Revolut Ltd** (UK): EMI regulated by the FCA. After Brexit, the UK retained its own CRS regime and continues exchanging with the EU. Reports to HMRC.
  - **Revolut Payments UAB**: Lithuanian EMI for payments operations within the EEA.
  - Subsidiaries in Singapore, Australia, the US and other markets with their own regulators.

  Practical consequence: if you open Revolut Business as a Spanish, Mexican, Colombian or Argentine customer, your account is normally under Revolut Bank UAB (Lithuania) and information flows via the Lithuanian VMI to the country of tax residence stated in your CRS self-certification.

  ## Applicable regulatory framework

  - **OECD**: Common Reporting Standard 2014, with updated official commentaries.
  - **EU**: Directive 2011/16/EU (DAC) amended by DAC2 (Directive 2014/107/EU), which internalises CRS in Union law.
  - **Lithuania**: Law on automatic exchange of financial account information for tax purposes, national CRS and DAC2 implementation.
  - **Spain (receiving)**: Royal Decree 1021/2015, Form 720, Form 721 from 2024 for crypto-assets. See details in our article on <a href="/en/blog/crs-for-residents-in-spain-and-latam-real-implications">CRS for residents in Spain and LATAM</a>.

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

  ## Active vs Passive NFE classification

  Revolut will ask you to complete a CRS Self-Certification form when you open the account. There you declare whether the LLC is Active NFE or Passive NFE, who the controlling persons are, and the entity's tax residence(s).

  An **Active NFE** is one in which less than 50% of its income is passive (dividends, interest, rents, non-operational royalties, investment gains) and less than 50% of its assets produce or are held to produce passive income. A typical professional services LLC invoicing consulting or development meets the Active NFE criteria.

  In practice, Revolut tends to apply conservative criteria and, when in doubt or with insufficient documentation, classifies as Passive NFE. The consequence is the same: it reports to the beneficial owner.

  ## What if you misdeclare residence

  If you declare "tax residence in Andorra" upon opening but Revolut detects indicia that you live in Spain (recurring IP, card delivery address, Spanish phone number, periodic transfers to Spain), it will apply the **change in circumstances** procedure: it will request a tax residence certificate or, failing that, report you to both jurisdictions. False self-certification can be a tax infringement and, depending on the case, a criminal offense.

  ## How to plan properly with Revolut Business

  1. **Don't use Revolut as the LLC's primary account if you want to minimize CRS footprint to your home country.** Mercury (US) remains the optimal primary account. Revolut makes sense as a secondary account for specific needs (physical European cards, fast EUR/GBP conversion, SEPA debit).
  2. **If you use Revolut, declare correctly and prepare for the data to arrive.** It's the only professional approach. We develop this in <a href="/en/blog/designing-a-solid-international-tax-structure-step-by-step-framework">how to design a solid international structure</a>.
  3. **Maintain documentary consistency.** Your CRS self-certification, your Form 720 (or LATAM equivalent) and your IRPF (or local equivalent) must tell the same story.
  4. **Know the risks.** If you misdeclare, consequences materialize late but they arrive, as we explain in <a href="/en/blog/tax-risks-of-bad-international-structuring-simulation-cfc-and-residency">tax risks of bad international structuring</a>.
  5. **Mind your closing balance schedule.** Revolut reports the 31 December balance. If you don't want unnecessary Form 720 triggers, manage your closing balance with operational criteria, not "concealment" (which is illegal).

  ## Quick comparison: Revolut vs Mercury vs Wise vs CRS

  | Platform | Regulatory jurisdiction | Subject to CRS | Reports your beneficial-owner data to |
  | --- | --- | --- | --- |
  | Mercury | US (Column NA) | No (FATCA only) | Nobody via CRS |
  | Revolut Business | Lithuania (Revolut Bank UAB) | Yes | AEAT via VMI Lithuania |
  | Wise Business | Belgium (Wise Europe SA, NBB) | Yes | AEAT via Belgian authority |
  | Wallester | Estonia | Yes | AEAT via Estonian authority |
  | N26 Business | Germany (BaFin) | Yes | AEAT via Bundeszentralamt für Steuern |

  We expand the Wise comparison in our <a href="/en/blog/wise-business-and-crs-what-it-reports-to-your-tax-authority">dedicated Wise and CRS article</a>.

  ## Additional considerations: DAC7 and DAC8

  If your LLC sells through digital platforms (Amazon, Etsy, Airbnb, SaaS marketplaces), <a href="/en/blog/dac7-the-new-digital-platform-reporting-affecting-your-business-in-2026">DAC7</a> adds an information channel parallel to and complementary with CRS: platforms report your income directly to European tax authorities. And if you operate with crypto-assets through European exchanges, <a href="/en/blog/dac8-and-cryptocurrencies-the-automatic-tax-reporting-of-crypto-assets-in-2026">DAC8</a> activates the CRS-equivalent for crypto from 2026.

  ## In summary

  Revolut Business is an excellent tool, but understanding its CRS reporting profile is essential if you have an LLC and you reside in a CRS-adhering country. The key is not to avoid Revolut, but to declare correctly and design the stack so that the information reported is consistent with what you pay.

  Want to review your banking stack and understand exactly what reaches your tax authority, and how to declare it correctly? Book your free consultation.`;
