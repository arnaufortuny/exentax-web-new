export default `The Common Reporting Standard (CRS) is the most important piece of international tax compliance of the last decade, and very few people understand what it actually means for someone who owns a <a href="/en/blog/llc-in-the-united-states-complete-guide-for-non-residents-in-2026">US LLC</a> or holds accounts outside their country of residence. Let's break it down with technical precision and without alarmism.

  ## What CRS is and why it exists

  The **Common Reporting Standard** was approved by the OECD Council in July 2014 in response to the G20 mandate after the financial crisis and the major tax-evasion scandals (LuxLeaks, Panama Papers). The objective: tax authorities of adhering countries automatically exchange information about financial accounts held by non-residents.

  Technically, CRS generalizes the prior model (FATCA) to more than 100 jurisdictions, but on a multilateral rather than bilateral basis. Spain transposed it via Royal Decree 1021/2015 and Order HAP/1695/2016, which regulate **Form 289** (the annual informative return that Spanish financial institutions submit to the AEAT, and which is received in reverse from other adhering countries).

  In Latin America CRS is implemented in, among others: Mexico (since 2017), Argentina, Colombia, Chile, Brazil, Uruguay, Panama, Peru, Costa Rica, Ecuador and the Dominican Republic. The United States, importantly, is **not adhered to CRS**. It runs its own system (FATCA), which is bilateral and outbound only, not inbound. We dive deeper into this in our article on <a href="/en/blog/do-us-bank-accounts-report-to-your-home-tax-authority-the-honest-answer">whether US bank accounts report to your tax authority</a>.

  ## Regulatory framework

  - **OECD**: Common Reporting Standard, July 2014. Consolidated text and official commentaries.
  - **EU**: Council Directive 2011/16/EU on administrative cooperation (DAC), amended by DAC2 (Directive 2014/107/EU), which incorporates CRS into Union law.
  - **Spain**: Royal Decree 1021/2015, Order HAP/1695/2016, Order HAC/3625/2003 (Form 720), Order HFP/886/2023 (Form 721 for crypto-assets held abroad).
  - **Multilateral Competent Authority Agreement (MCAA)**: the OECD instrument by which each country activates bilateral exchange with each of the others.

  ## What is reported

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
  2. **Your accounts at European fintechs in your LLC's name ARE reported.** Wise (Belgium), Revolut (Lithuania), N26 (Germany), Wallester (Estonia) are financial institutions subject to CRS in their jurisdictions. If the holder is your LLC and you are the **beneficial owner** resident in Spain or LATAM, that data reaches your tax authority. We develop this further in our dedicated articles on <a href="/en/blog/revolut-business-and-crs-what-it-reports-to-your-tax-authority">Revolut and CRS</a> and <a href="/en/blog/wise-business-and-crs-what-it-reports-to-your-tax-authority">Wise and CRS</a>.
  3. **Your LLC is most likely a passive NFE**, unless it can demonstrate real operational activity (more than 50% of income is operational and not passive: dividends, interest, rents, non-active royalties). For the typical single-member LLC providing services, the European fintech tends to classify it as a passive NFE out of caution, which **triggers reporting of the controlling persons**.

  ## How CRS tax residence is determined

  The financial institution applies a **due diligence procedure** (RD 1021/2015 and CRS Annex I) based on the holder's self-certification plus objective indicia: postal address, phone number, recurring IP, declared TIN, repeated transfer instruction to accounts in another country, powers of attorney granted to residents in another country.

  If your self-certification says "tax resident in Andorra" but your IP, card delivery address and recurring transfers point to Madrid, the institution may request **additional documentation** (tax residence certificate, lease, etc.) or, in case of doubt, report to both jurisdictions. False CRS self-certification is a tax offence in most jurisdictions and can have criminal consequences depending on the amounts involved.

  ## Real implications in Spain (Forms 720 and 721)

  If you are a Spanish tax resident and you have:

  - **Foreign accounts** with individual or aggregate balance > €50,000 at 31 December or average balance in the last quarter: **Form 720** informative return.
  - **Foreign crypto-assets** > €50,000 at 31 December: **Form 721**.
  - **Foreign securities, rights, insurance, income** > €50,000: Form 720 corresponding sections.

  The CJEU judgment C-788/19 (27 January 2022) struck down the originally disproportionate sanction regime for Form 720, but the obligation to report **remains fully in force** with ordinary penalties (LGT art. 198) and with the qualifier that undeclared income may be regularised as unjustified capital gains (LIRPF art. 39, in what is not affected by the CJEU ruling).

  ## How to plan correctly

  The technical conclusion is the opposite of what many influencers say: **a properly structured US LLC banking solely with Mercury/Relay (US) has minimal CRS footprint**, because the US does not export CRS data. But as soon as you add a European layer (Wise, Revolut, Wallester, N26), you accept that the information will reach your tax authority. It is neither good nor bad: it just is, and planning requires knowing it.

  The professional approach involves:

  1. **Filing correctly.** The cross-check already exists; trying to hide is a waste of time and exposes you to penalties.
  2. **Designing the structure for the declared activity to be tax-efficient.** This means deciding country of residence, investment instruments, remittance schedule, deductions and applicable DTT. See our <a href="/en/blog/designing-a-solid-international-tax-structure-step-by-step-framework">framework for designing a solid international structure</a>.
  3. **Maintaining documentation**: contracts, invoices, expense receipts, LLC books, consistent CRS self-certifications.
  4. **Knowing the risks of getting it wrong.** We cover them in <a href="/en/blog/tax-risks-of-bad-international-structuring-simulation-cfc-and-residency">tax risks of bad international structuring</a>.

  ## Common mistakes we see every week

  - "Since Mercury is in the US, no one finds out." True for Mercury vs CRS, but false for your Wise/Revolut/Wallester/N26 accounts in the same LLC's name.
  - "I declared tax residence in Andorra/Paraguay/Dubai but I still live in Spain." Tax residence is not chosen; it is determined by facts (183 days, centre of economic interests, core of vital interests).
  - "If my LLC invoices, nothing happens to me." The AEAT can apply **CFC rules** (LIS art. 100, applicable to individuals via LIRPF art. 91) if your LLC generates passive income and the entity is under your control. Planning must avoid this scenario, not ignore it.

  ## In summary

  CRS is not "avoided" from a European jurisdiction. It is planned for, with knowledge. A US LLC remains an extraordinarily useful tool, but the design of your banking stack and your tax residency are decisive for the informational footprint you generate to be consistent with what you declare.

  Want us to review how CRS affects your specific case and design the right stack? Book your free consultation and we'll analyze it with you.

If something in this structure left you wanting more detail, <a href="/en/blog/why-spanish-freelancers-are-leaving-self-employment-for-a-us-llc">Why Spanish freelancers are leaving self-employment for a US LLC</a> dives into a neighbouring piece of the puzzle we usually keep for a separate write-up.
`;
