export default `Wise Business (formerly TransferWise) is the most-used multi-currency fintech among owners of <a href="/en/blog/llc-in-the-united-states-complete-guide-for-non-residents-in-2026">US LLCs</a> and international entrepreneurs in general. Its value proposition is clear: mid-market FX, local IBAN in EUR, GBP, USD and other currencies, and low fees. But Wise is also a European financial institution subject to the **Common Reporting Standard (CRS)**, with real implications worth knowing before integrating Wise into your structure.

  ## Which Wise entity operates your account and where it reports

  Wise operates through several regulated entities:

  - **Wise Europe SA** (Belgium): EMI regulated by the **National Bank of Belgium (NBB)**. The entity that serves European clients since the loss of EU passporting after Brexit. Reports CRS to the **Service Public Fédéral Finances** in Belgium, which activates bilateral exchange with the holder's country of residence.
  - **Wise Payments Limited** (UK): EMI regulated by the FCA. Continues serving UK and some legacy clients.
  - **Wise US Inc.**: regulated in the US as MSB (Money Services Business). CRS does not apply because the US is not adhered.
  - Subsidiaries in Singapore, Australia, India, etc., with their own regulators.

  For European clients and for LLCs with European representation, the typical setup is the account being held with **Wise Europe SA (Belgium)**. Therefore, CRS reporting flows out of Belgium and reaches your country of residence.

  ## Regulatory framework

  - **OECD**: Common Reporting Standard.
  - **EU**: Directive 2011/16/EU as amended by DAC2.
  - **Belgium**: Law of 16 December 2015 on automatic exchange of financial information (LIAFI) and implementing royal decrees.
  - **Spain (receiving)**: Royal Decree 1021/2015, Form 720, Form 721. We expand in our article on <a href="/en/blog/crs-for-residents-in-spain-and-latam-real-implications">CRS for residents in Spain and LATAM</a>.

  ## What information Wise sends via CRS

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

  ## CRS classification of your LLC at Wise

  When you open a Wise Business account for your LLC, Wise applies CRS due diligence to the entity. It will ask you to complete the **CRS Self-Certification** form indicating:

  - LLC tax residence: US.
  - Classification: Active NFE, Passive NFE, Investment Entity, Reporting Financial Institution, etc.
  - Controlling persons (with their data: name, address, residence, TIN, date and place of birth).

  In practice, a single-member services LLC usually meets the **Active NFE** criteria (more than 50% of income is operational, not passive). However, Wise tends to apply conservative criteria: if documentation is not robust or the activity cannot be evidenced, it classifies as **Passive NFE** and reports to the controlling person.

  The consequence: even though the LLC is American and the US does not participate in CRS, **the data on your ownership and balances will reach your national tax authority** from Belgium.

  ## When and how reporting happens

  - Year-end: 31 December.
  - Wise sends the CRS report to the Belgian authority typically between March and June of the following year.
  - Belgium forwards to the tax authorities of the residence country of each holder and controlling person, normally before 30 September.
  - Your tax authority has the data and cross-checks it against your filings.

  So balances at Wise as of 31/12/2025 are cross-checked with your 2025 IRPF (filed May-June 2026) and your Form 720 (filed March 2026).

  ## Common mistakes with Wise and tax

  1. **"Wise is just a payment processor, nobody finds out."** False. Wise is a regulated financial institution fully subject to CRS.
  2. **"If I put the LLC, I'm not personally reported."** False for Passive NFE: controlling persons are reported. And most single-member LLCs end up classified as Passive NFE out of bank caution.
  3. **"My average balance is low, no reporting."** Wise reports the year-end balance regardless of fluctuations. CRS has no minimum threshold for pre-existing accounts since 2017 or for new accounts.
  4. **"I didn't declare Wise on my Form 720 because it was small."** The Form 720 threshold is aggregate across all your foreign accounts, not per account.
  5. **"I'll only use Wise for FX, not custody."** Even using Wise only as an operational deposit account, it remains a reportable financial account. The deposit/custody distinction affects income detail, not the balance report.

  ## Comparison with Revolut and Mercury

  | Aspect | Wise Europe (BE) | Revolut Bank UAB (LT) | Mercury (US) |
  | --- | --- | --- | --- |
  | Subject to CRS | Yes | Yes | No |
  | Reports LLC beneficial owner | Yes (typical Passive NFE) | Yes (typical Passive NFE) | No |
  | Native investment product | Wise Assets, Interest | Stocks, Vault | Treasury, FDIC sweep |
  | Native multi-currency | Excellent | Excellent | Mainly USD |
  | Suitability as LLC primary account | Secondary | Secondary | Primary |

  Expanded comparison in <a href="/en/blog/wise-business-with-your-llc-the-complete-guide-to-multi-currency-management">the complete guide to Wise Business for your LLC</a> and in <a href="/en/blog/revolut-business-and-crs-what-it-reports-to-your-tax-authority">Revolut and CRS</a>.

  ## How to plan correctly

  1. **Declare correctly from the start.** Indicate your LLC's CRS classification and controlling persons accurately. Lying or omitting is an infringement and can be a crime.
  2. **Keep Wise as a secondary operational account**, not as the LLC's primary, if you want to minimize CRS footprint to your country. Mercury remains the natural primary.
  3. **Ensure documentary consistency.** Your Wise CRS self-certification, your Form 720 (Spain) or LATAM equivalent, and your IRPF must align.
  4. **Consider the closing balance.** If you'll have a high balance at 31/12, plan for it to be declared and justified (origin, purpose, taxes paid).
  5. **Know the wider framework**: <a href="/en/blog/designing-a-solid-international-tax-structure-step-by-step-framework">your overall structure design</a> determines whether Wise + LLC + your residency works or not.

  ## In summary

  Wise Business is not a shortcut to avoid tax reporting: it's an excellent regulated fintech that reports via CRS from Belgium to your tax authority. Well-integrated into a coherent structure with your US LLC, it's very useful. Misintegrated or used with inaccurate self-certifications, it's the source of the most typical tax problems we see.

  Want us to review how Wise fits into your structure and what reaches your tax authority in your specific case? Book your free consultation.`;
