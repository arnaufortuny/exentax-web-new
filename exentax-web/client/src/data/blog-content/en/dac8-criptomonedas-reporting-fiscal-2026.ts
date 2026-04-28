export default `**DAC8** is the piece that completes Europe's tax-information system in the crypto world. From today, all crypto-asset service providers in the EU are required to report to European tax authorities the information of their clients and operations, in line with the CRS model applied to traditional banking. If you hold crypto and reside in the EU, or you have a <a href="/en/blog/llc-united-states-complete-guide-non-residents-2026">US LLC</a> operating with crypto on European exchanges, this affects you directly.

## What DAC8 is

**DAC8** is the eighth amendment to Council Directive 2011/16/EU on administrative cooperation in tax matters. Formally: **Council Directive (EU) 2023/2226 of 17 October 2023**, extending administrative cooperation to the new **CARF** (Crypto-Asset Reporting Framework) developed by the <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a> in March 2023, applicable in Member States from **1 January 2026** with first reporting in January 2027 on FY 2026 data.

DAC8 is for crypto-assets what CRS / DAC2 is for bank deposits and what <a href="/en/blog/dac7-the-new-digital-platform-reporting-affecting-your">DAC7</a> is for digital platforms: mandatory client identification, standardized data collection, annual reporting to the national tax authority and automatic exchange with other authorities.

Spain will transpose DAC8 via amendment of the General Tax Law and complementary regulations, integrating with the existing **Form 721** regime (informative declaration on crypto-assets held abroad, in force since FY2023).
## Regulatory framework

- **OECD**: Crypto-Asset Reporting Framework (CARF), published in March 2023.
- **EU**: Directive (EU) 2023/2226 (DAC8), 17 October 2023; application 1 January 2026.
- **EU Regulation 2023/1114** (MiCA - Markets in Crypto-Assets): regulation of crypto-asset service providers in the EU; defines who is required to report under DAC8.
- **Spain**: Order HFP/886/2023 (Form 721); DAC8 transposition law (in process).
### Who is affected

DAC8 affects:

- **Reporting Crypto-Asset Service Providers (RCASP)**: any crypto-asset service provider regulated under MiCA in the EU. Includes centralized exchanges (Binance Spain, Coinbase Europe, Bitpanda, Kraken EU through subsidiaries), crypto brokers, custodians, DeFi platforms with EU legal presence, regulated stablecoin issuers.
- **Service users** (clients): individuals and entities, resident anywhere in the world, whose data is reported to their jurisdiction of tax residence.

Unlike CRS, DAC8 has no de minimis threshold: any active client is reported regardless of balance or volume.
### What is reported

| Category | Detail |
| --- | --- |
| Individual client | Name, address, tax residence, TIN, date and place of birth |
| Entity client | Legal name, address, EIN/TIN, classification, controlling persons (CRS-aligned) |
| Crypto balance | Balance at 31 December for each crypto-asset (BTC, ETH, USDC, etc.), in units and FIAT market value |
| Operations | For each crypto-asset: gross amounts paid/received for purchases, sales, crypto-to-crypto exchanges, transfers to external wallets (with conditions), and participation in events such as staking, lending, airdrops |
| Payment methods | Whether operations were settled in FIAT (EUR, USD) or other crypto |

The detail is granular: by asset, category, quarter.
### Schedule

- **1 January today**: effective application in Member States.
- **today**: first full reportable year.
- **30 June 2027** (approx.): first annual RCASP report to the national tax authority.
- **30 September 2027** (approx.): first automatic exchange between Member States and adhering third countries.
### How it affects an LLC owner with crypto

1. **LLC with account at European exchange** (Bitpanda, Coinbase Europe, Kraken EU): the RCASP identifies the LLC and beneficial owners. Reports balances and operations to its Member State authority, which forwards to the country of the beneficial owner.
2. **LLC with account at US exchange** (Coinbase US, Kraken US, Gemini): not subject to DAC8. The US is developing its own framework under the infrastructure act and Form 1099-DA, but automatic exchange with the EU is not at the same level. Data may arrive via bilateral request or via the future CARF network if the US adheres.
3. **Self-custody wallets**: outside the direct report, but **transfers between exchange and wallet** are reported, allowing the tax authority to detect movements.
### Interaction with Spanish Form 721

If you are a Spanish tax resident and you hold crypto-assets on foreign platforms:

- Balance at 31 December > €50,000: **Form 721** informative return, filed between 1 January and 31 March of the following year.
- Balance at Spanish regulated exchanges (Bit2Me, etc.): no Form 721, but reported under domestic regime and, from today, via DAC8.
- DAC8 + Form 721 generate a double cross-check: data reaches the AEAT both from the RCASP of the exchange's country and from the taxpayer's own filing.
### DeFi operations and self-managed wallets

DAC8 addresses the difficult question of DeFi and self-custody. The directive imposes obligations on regulated RCASPs, but DeFi protocols without identifiable headquarters or operator fall outside direct reporting. However:

1. The entry and exit of funds between regulated exchange and own wallet are reported.
2. DeFi protocols with frontend operated from the EU may fall under MiCA and, by extension, under DAC8.
3. The OECD and the EU are developing additional DeFi guidance.

In practice: on-chain traceability combined with DAC8 makes DeFi opacity much smaller than originally thought.
### How to plan correctly

1. **Maintain rigorous crypto bookkeeping.** Per-operation tracking with EUR/USD value at the date of each operation, FIFO or specific identification per jurisdiction.
2. **Declare correctly in your IRPF (Spain: capital gains and losses on transfers, savings tax 19-28%).** Introduced in <a href="/en/blog/cryptocurrency-and-trading-with-llc-complete-tax-guide-for">crypto and trading with LLC</a>.
3. **Form 721 if you cross the threshold.** Non-filing is a specific infringement.
4. **DAC8 consistency.** What exchanges report must match what you declare.
5. **Structure design.** If crypto activity is significant, an LLC may make sense for separation; not for "concealment". Full framework in <a href="/en/blog/designing-a-solid-international-tax-structure-step-by-step">designing a solid international structure</a>.
### Common risks

- "I bought BTC in 2017 and never declared it." If you sell now with gain, the AEAT detects the flow to your bank account and, via DAC8 + CRS, has basis for regularization.
- "I use my own wallet, they don't see me." When you enter fiat through a regulated exchange, they see the flow. On-chain tracing is public.
- "I'll just put the LLC and that's it." If the LLC lacks substance, the AEAT can apply simulation or CFC. We develop this in <a href="/en/blog/tax-risks-of-bad-international-structuring-simulation-cfc">tax risks</a>.
### In summary

DAC8 closes the loop. CRS for banking, DAC7 for platforms, DAC8 for crypto. Tax opacity in the digital environment drops drastically from today. Proper planning is not about looking for loopholes; it's about designing a coherent structure and declaring well.

Before going further, put numbers on your case: the <a href="/en#calculadora">Exentax calculator</a> compares, in under 2 minutes, your current tax bill with what you would carry running a US LLC properly declared in your country of residence.

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Free consultation, no strings attached</a>
<!-- /exentax:calc-cta-v1 -->

Operating with crypto from an LLC or want to understand how DAC8 affects you as a resident in Spain or LATAM? Book your free consultation.
## Legal and regulatory references

This article relies on rules currently in force. Main sources for verification:

- **United States.** Treas. Reg. §301.7701-3 (entity classification / *check-the-box*); IRC §882 (tax on foreign income effectively connected with a US trade or business); IRC §871 (FDAP and withholding on non-residents); IRC §6038A and Treas. Reg. §1.6038A-2 (Form 5472 for *25% foreign-owned* and *foreign-owned disregarded entities*); IRC §7701(b) (tax residency, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report to <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Spain.** Law 35/2006 (LIRPF), arts. 8, 9 (residency), 87 (income attribution), 91 (CFC for individuals); Law 27/2014 (LIS), art. 100 (CFC for companies); Law 58/2003 (LGT), arts. 15 (anti-abuse) and 16 (simulation); Law 5/2022 (Form 720 penalty regime after CJEU C-788/19 of 27/01/2022); RD 1065/2007 (Forms 232 and 720); Order HFP/887/2023 (Form 721 crypto).
- **Spain–US treaty.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> of 22/12/1990 (original DTT); Protocol in force since 27/11/2019 (passive income, *limitation on benefits*).
- **EU / OECD.** Directive (EU) 2011/16, amended by DAC6 (cross-border arrangements), DAC7 (Directive (EU) 2021/514, digital platforms) and DAC8 (crypto-assets); Directive (EU) 2016/1164 (ATAD: CFC, exit tax, hybrid mismatches); OECD Common Reporting Standard (CRS).
- **International framework.** OECD Model Convention, art. 5 (permanent establishment) and Commentaries; BEPS Action 5 (economic substance); FATF Recommendation 24 (beneficial ownership).
Applying any of these rules to your specific case depends on your tax residency, the LLC's activity and the documentation you keep. This content is informational and does not replace personalized professional advice.

<!-- exentax:legal-facts-v1 -->
## Legal & procedural facts

FinCEN and <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> reporting requirements moved recently; the current state is:

- **BOI / Corporate Transparency Act: your LLC is NOT required to file (a competitive advantage).** After **FinCEN's March 2025 interim final rule**, the BOI Report obligation was **narrowed to "foreign reporting companies"** (entities formed OUTSIDE the US and registered to do business in a state). A **US-formed LLC owned by a non-resident does NOT file the BOI Report**: one fewer filing on your calendar, less paperwork, and a cleaner structure than ever. If your LLC was formed before March 2025 and you already filed BOI, keep the acknowledgement. The regulatory status can change again: **we monitor FinCEN.gov on every filing** and, if the obligation comes back, we handle it at no extra cost. Current status verifiable at [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + pro-forma 1120.** For a **Single-Member LLC owned by a non-resident**, the final regulations of Treas. Reg. §1.6038A-1 (in force since 2017) treat the LLC as a corporation for 5472 purposes. Procedure: **pro-forma Form 1120** (header only: name, address, EIN, tax year) with **Form 5472 attached**. It is filed **by certified mail or fax to the IRS Service Center in Ogden, Utah**, **not e-filed via standard MeF**. Due date: **April 15**; extension via **Form 7004** to **October 15**. **Penalty: $25,000 per form per year, plus $25,000 per additional 30 days** of non-filing after IRS notice.
- **Substantive Form 1120.** Only applies if the LLC has filed a check-the-box election to C-Corp (Form 8832): it then pays 21 % federal corporate tax and files a substantive 1120. A standard disregarded LLC **does not file a substantive 1120 and does not pay federal corporate tax**.
- **EIN and notice.** Without an EIN you cannot file 5472 or BOI. The IRS does not warn before imposing penalties; you find out when an EIN is flagged or a later filing is rejected.<!-- exentax:execution-v2 -->
## How to navigate DAC8 without surprises: the read for holders and traders

DAC8 introduces automatic reporting on crypto assets in the EU from today: all European CASPs (Crypto-Asset Service Providers) will send to each Member State's tax authority the identity of their clients and yearly positions, transactions and movements. It is the crypto equivalent of CRS for banking. Here is what changes and what does not.

- **Affected platforms.** Bitpanda, Bitstamp, Bit2Me, N26 Crypto, Revolut Crypto, Coinbase Europe, Kraken Europe, Binance EU and every CASP authorised under MiCA. Information is transmitted in January each year, referring to the prior year, and includes balances, deposits, withdrawals, fiat-crypto and crypto-crypto exchanges.
- **Platforms not (yet) affected.** Coinbase US, Kraken US, Binance US and non-EU exchanges sit outside direct DAC8. However, OECD approved CARF (Crypto-Asset Reporting Framework) in October 2023, with first transmission planned for January 2027 among 50+ jurisdictions. The US has signalled partial adherence via the IRS Form 1099-DA (interim final rule of 2025).
- **Self-custody wallets and DeFi.** Not within DAC8. On-chain privacy is real for own wallets as long as you do not touch a CASP exchange. The day you move from MetaMask to Bitpanda to sell, the balance and movement enter Bitpanda's reporting. Blockchain traceability alone does not flow to AEAT automatically; only on explicit request or with a CASP touch.
- **Spanish Modelo 721.** Independent from DAC8: if you are a Spanish tax resident and hold crypto abroad (non-Spanish CASP, self-custody wallet) with combined value >50,000 €, Modelo 721 applies. DAC8 makes the cross easier; it does not create the duty.

### What we are asked the most

**If I have crypto on Coinbase US, am I out of DAC8?** Out of DAC8 yes, as long as you do not bring balances to a European CASP. But you enter CARF flow from January 2027 (the US joins partially via 1099-DA), and you remain bound to Modelo 721 above 50,000 €. Discretion is relative and temporary.

**Does moving crypto to a self-custody wallet take me off the radar?** Takes you off the CASP reporting, not your declarative duties. AEAT does not receive your MetaMask balance but it is still foreign crypto for Modelo 721 purposes. The asymmetry is operational, not normative.

At Exentax we map each wallet and exchange in your portfolio, model the applicable DAC8/CARF reporting and leave the crypto reporting at residency consistent with what platforms will report.
<!-- /exentax:execution-v2 -->

## We set it up without you losing a weekend

Thousands of freelancers and entrepreneurs already operate their US LLC fully legally and properly documented. At Exentax we handle the entire process: formation, banking, payment gateways, bookkeeping, IRS filings and compliance in your country of residence. Book a free consultation and we will tell you honestly whether the LLC makes sense for your case, with no absolute promises.

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

<!-- exentax:lote7-native-v1:dac8-criptomonedas-reporting-fiscal-2026 -->
## What DAC8 actually changes for crypto holders inside the EU

DAC8 extends the EU's automatic exchange of information regime to
crypto-asset service providers. From the holder's perspective, the
practical change is that the same kinds of summaries already exchanged
for bank accounts (CRS) are now produced by reporting crypto
platforms about their EU-resident users. The platforms identify
their users, classify the assets, and once a year send a defined
record to the user's tax administration.

| Field reported under DAC8 (typical)      | What the tax administration sees       |
|------------------------------------------|----------------------------------------|
| User identity                            | Name, residence, tax ID                |
| Aggregate gross proceeds                 | Annual sum, by asset where applicable  |
| Aggregate gross acquisitions             | Annual sum, by asset where applicable  |
| End-of-year holdings                     | Snapshot, where the platform retains   |
|                                          | custody                                |

This means the matching of platform-reported aggregates with the
holder's annual declaration becomes the baseline of any DAC8-era
crypto compliance plan. If the two reconcile, the report is again a
non-event.

## Three real reconciliation patterns

A holder who used a single regulated EU platform for spot trading
ran a clean year because the platform's annual report mirrored the
trade history exported each January, which fed straight into the
home-country declaration. The DAC8 record arrived as expected and
matched.

A user with a mix of EU-licensed and non-EU platforms produced one
master ledger that consolidated all venues, then mapped each line
to its source. The DAC8-reported part was a slice of the master;
the rest was self-declared with the same rigour. The home tax
administration saw a single coherent number.

A long-term holder with custody on a regulated EU platform and a
small DeFi tail kept the DeFi tail as a separately documented
section. DAC8 captured the regulated portion; the DeFi section had
its own paperwork (wallet addresses, transaction proofs, fair
valuation methodology) ready to present if asked.

## Mistakes to avoid in the new regime

- Ignoring the platform's user data update request. If your tax
  residence on the platform is stale, the report will go to the
  wrong country.
- Treating "platform reports it" as "I do not need to declare it".
  The reverse is true: declare it, and let the platform report
  match.
- Mixing personal and LLC-held crypto. Crypto held by the LLC sits
  in a different reporting silo than personal crypto; mixing them
  causes painful reconciliations.
- Disregarding cost basis. DAC8 reports gross flows; the home-
  country declaration needs the basis to compute the taxable result.

## Annual reconciliation checklist

- Refresh user data on every platform in January.
- Pull annual reports as soon as they become available.
- Reconcile platform totals to your master ledger by asset.
- Confirm cost-basis methodology is consistent year-on-year.
- Keep proofs for any non-DAC8 holdings (wallets, validators, etc.).

We treat DAC8 as a structural simplifier, not a complication. Once
the routine is in place, the year-end work shrinks rather than
grows.

<!-- /exentax:lote7-native-v1:dac8-criptomonedas-reporting-fiscal-2026 -->

<!-- exentax:cross-refs-v1 -->
## On the same topic

- [CRS and your US LLC bank accounts: what is shared with your home country](/en/blog/crs-and-your-us-llc-bank-accounts-what-gets-shared-with-your)
- [CRS 2.0 and CARF: why the US won't sign, and what that means for LLCs](/en/blog/crs-2-0-carf-why-the-us-will-never-sign-llc-impact)
- [Revolut Business and CRS: what actually gets reported to your tax office](/en/blog/revolut-business-and-crs-what-it-reports-to-your-tax)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:cta-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22**DAC8**%20is%20the%20piece%20that%20completes%20Europe's%20tax-information%20system%20in%20the%20c%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.

<!-- exentax:conv-fill-v1 -->
Or call us directly at <a href="tel:+34614916910">+34 614 916 910</a> if you'd rather talk.

For state-specific details, see our <a href="/en/services/llc-wyoming">Wyoming LLC service page</a> with closed costs and timelines.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->
`;
