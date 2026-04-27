# Banking Facts 2026 — Source of Truth for Exentax Content

This document is the **single source of truth** for every banking-product
mention across blog articles, FAQ, and service pages. Every article that
references one of the products below must align with the facts here.
Any article that contradicts this document is incorrect and must be fixed
before publishing.

Last reviewed: 2026-04. Owner: Exentax editorial.

---

## Mercury — DO NOT recommend as primary for non-US operations

- **What it is.** US-licensed fintech (Money Transmitter), not a bank.
- **Banking partners.** Choice Financial Group and Evolve Bank & Trust
  (FDIC-insured up to $250,000 per depositor via sweep network). Some
  legacy accounts still reference Column N.A.
- **Account details.** US routing + account number. **No IBAN.**
- **CRS.** US is not a CRS participant. No CRS reporting from US accounts.
- **Compliance closure failure mode — CRITICAL.** When Mercury closes an
  account during a compliance review, **funds are returned via a physical
  USD check made out to the LLC, mailed to the registered business
  address.** For non-resident LLC owners this is a severe operational
  problem: many European banks will not deposit a third-party USD check,
  and processing takes weeks even when accepted.
- **Crypto.** **Not crypto-friendly.** Mercury rejects crypto-adjacent
  businesses (exchanges, OTC desks, on/off-ramps, Web3 founders cashing
  out token grants) and will close accounts that show crypto-like
  inflows. Recommend Slash for any client with crypto exposure.
- **Editorial rule.** Exentax **does not recommend Mercury as the primary
  account when operations are entirely outside the US.** It may be opened
  as a *secondary* account with a low operating balance, but the primary
  must be Relay or Slash. Every article mentioning Mercury must reflect
  this.
- **Stripe / PayPal.** Integrates well; do not use this as a reason to
  recommend Mercury as primary.
- **Verification cadence.** Re-verify non-resident eligibility quarterly.

## Slash

- **What it is.** Banking platform for online operators.
- **Banking partner.** **Column N.A.** (federally chartered, FDIC).
- **Account details.** US routing + account number. **No IBAN.**
- **CRS.** US is not a CRS participant. No CRS reporting.
- **Treasury — 2026 figures.** Slash Treasury yields **~3.82%** on the
  invested portion (US T-bills) with an effective **~3.5% APY** at the
  account level after fees and cash drag. Both figures float with Fed
  rates; always describe them as approximate. Quote both when discussing
  Slash Treasury — the 3.82% gross headline number alone is misleading.
- **Crypto.** **Crypto-friendly.** Slash supports crypto on/off-ramps
  and works with crypto-adjacent businesses that Mercury and Wise reject.
  This is a real differentiator for traders, Web3 founders, and operators
  with mixed fiat + crypto flows.
- **Other strengths.** Per-vendor virtual cards, granular spend
  controls, cashback on digital ad spend.
- **Editorial rule.** Recommend as a primary or co-primary US operating
  account for non-resident LLC owners — and as **the** primary for any
  client with crypto exposure. Pair with Relay for redundancy.

## Relay

- **What it is.** Business banking fintech.
- **Banking partner.** **Thread Bank** (FDIC).
- **Account details.** US routing + account number. **No IBAN.**
- **CRS.** US is not a CRS participant. No CRS reporting.
- **Strengths.** Up to 20 sub-accounts, 50 debit cards, deep QuickBooks/
  Xero integration. Excellent for envelope budgeting and team operations.
- **Editorial rule.** Recommend as a primary US account for non-residents,
  or as the redundancy account next to Slash.

## Wallester

- **What it is.** EU-regulated card issuer (Estonia).
- **Network.** **Visa.** Issues virtual and physical corporate cards.
- **Account details.** **EU IBAN** available for Exentax clients.
- **CRS — MUST DISCLOSE.** Wallester is an EU regulated entity and is
  **subject to CRS** (Common Reporting Standard / Estándar Común de
  Comunicación de Información). Account holder information is reported
  automatically to the tax authority of the holder's country of residence.
  **Never** describe Wallester as private or non-reporting.
- **Editorial rule.** Recommend specifically for corporate cards with
  granular spend control and EUR receivables. CRS disclosure is
  mandatory in every mention.

## Wise Business

- **What it is.** Electronic Money Institution (EMI), **not a bank**.
- **Entity for EUR.** Wise Europe SA (Belgium).
- **Account details.** Multi-currency local details: USD (routing +
  account number), GBP (sort code + account), EUR (**Belgian IBAN** via
  Wise Europe SA), and others.
- **CRS — Wise Business held by a US LLC is OUT OF SCOPE for CRS.**
  Editorial position (clarified 2026): a Wise Business account opened
  by a US-formed LLC is held by a US entity. The US is not a CRS
  participating jurisdiction; the US uses FATCA. The USD side of the
  product runs through Wise US Inc. (US-registered MSB). The
  multi-currency receiving details routed through Wise Europe SA
  (Belgium) do not pull a US-formed LLC into CRS reporting on the LLC
  itself. Any CRS exposure attached to a Wise product comes from a
  separate **Wise Personal account opened in the individual's own name**
  as a tax resident in a CRS jurisdiction (e.g. Spain), which Wise
  Europe SA does report under CRS. **Never** state "Wise Business is
  in CRS" without this distinction.
- **Differentiation Wise (LLC) vs Wise Personal.** A Wise Personal
  account opened by an EU-resident individual is reported under CRS as
  an individual account through Wise Europe SA (Belgium). A Wise
  Business account opened by a US LLC is **not** in CRS scope on the
  LLC; the LLC is a US entity and the US is not a CRS participant.
  Articles must keep this distinction explicit, especially for users
  who hold both products.
- **Wise US Inc.** is a US-registered MSB for the USD side of the
  product. The EUR / multi-currency receiving details that an LLC
  uses for international invoicing route through Wise Europe SA but
  do not change the CRS classification: the LLC is a US entity, hence
  out of CRS scope.
- **Crypto.** **Not crypto-friendly.** Wise rejects crypto-adjacent
  flows and will close accounts that show exchange counterparties or
  recurring crypto on/off-ramps. Recommend Slash for crypto exposure.
- **Strengths.** Mid-market FX, multi-currency, Mercury/Stripe payouts.
- **Editorial rule.** Recommend for FX and multi-currency treasury, never
  as the sole US operating account, never for crypto operators. Do
  **not** attach a "Wise Business is in CRS" claim to a Wise Business
  held by a US LLC (the LLC is a US entity, US is not a CRS participant).
  CRS disclosure attaches only to a separate Wise Personal in the
  individual's own name as a tax resident in a CRS jurisdiction.
- **Verify 2026.** Confirm current US-LLC opening policy quarterly.

## Revolut Business

- **What it is.** EMI (Revolut Bank UAB in Lithuania for EU customers;
  **Revolut Technologies Inc.** as the US group entity, with **Lead Bank**
  as US banking partner for US-LLC accounts).
- **Group entities to name correctly.** Revolut Bank UAB (LT, EU bank
  licence), Revolut Ltd (UK, EMI), Revolut Payments UAB (LT, EMI) and
  **Revolut Technologies Inc. (US)** — the entity under which Revolut
  Business is offered to clients with a US LLC, with Lead Bank as banking
  partner. **"Revolut Payments USA" does not exist** — any prior mention
  is a factual error and must be corrected to Revolut Technologies Inc.
  with Lead Bank.
- **Account details for US LLCs.** **US account via Lead Bank** (routing
  + account number) under Revolut Technologies Inc. No EU IBAN is provided
  to a US LLC. Articles claiming Revolut Business gives an IBAN to an LLC
  are wrong and must be corrected.
- **CRS.** US account via Lead Bank under Revolut Technologies Inc.: not
  CRS-reporting. EU-resident individual accounts under Revolut Bank UAB
  are CRS-reporting (separate product).
- **Editorial rule.** Position Revolut Business as a US-account complement
  for multi-currency operations under Revolut Technologies Inc. + Lead
  Bank. Never claim it gives an LLC a European IBAN, and never name a
  non-existent "Revolut Payments USA" entity.

## Stripe

- **What it is.** Payment processor, **not a bank**.
- **Requirements for non-residents.** US LLC + EIN + US business bank
  account in the LLC's name.
- **Payouts.** To Mercury, Relay, Slash, or Wise USD account.
- **CRS.** Not applicable (processor, not a deposit account).
- **Editorial rule.** Always describe Stripe as a processor that requires
  the LLC + EIN + US bank stack. Never as a substitute for a bank.
- **Verify 2026.** Confirm non-resident onboarding requirements.

## Payoneer

- **What it is.** Cross-border payments / EMI.
- **Account details.** Receiving accounts in multiple currencies (USD,
  EUR, GBP, others).
- **CRS — MUST DISCLOSE.** Subject to CRS. Account information reported
  to the holder's tax authority.
- **Editorial rule.** Acceptable for marketplace receivables (Amazon,
  Upwork, etc.). CRS disclosure mandatory.

## Interactive Brokers (IBKR)

- **What it is.** Brokerage, accepts LLC accounts.
- **Editorial rule.** Suitable for trading and investment by an LLC.
  Treat as brokerage, not banking. Re-verify 2026 non-resident LLC
  onboarding requirements before any concrete recommendation.

## Kraken

- **What it is.** Cryptocurrency exchange. Accepts business accounts for
  LLCs.
- **Editorial rule.** Re-verify 2026 KYC requirements for non-resident
  LLC owners before recommending. Treat as exchange, not banking.

---

## Recommended primary stacks (2026)

| Use case | Primary | Redundancy | FX / multi-currency | Cards |
|---|---|---|---|---|
| Solo non-resident operator (no US ops) | Slash or Relay | The other of Slash/Relay | Wise Business (CRS via Wise Europe SA) | Wallester (CRS) |
| Operator with some US clients | Relay | Slash | Wise Business (CRS via Wise Europe SA) | Wallester (CRS) |
| Marketplace seller (Amazon/Upwork) | Relay | Slash | Wise Business (CRS via Wise Europe SA) + Payoneer (CRS) | Wallester (CRS) |
| Active trader / investor | Relay | Slash | Wise Business (CRS via Wise Europe SA) | — |

Mercury appears in none of the recommended primaries for 2026 when
operations are entirely non-US. It may be added as a secondary at the
client's request, with the compliance-closure check warning explicitly
documented in the article and the consultation.

---

## CRS terminology by language

Use these exact translations when introducing CRS:

| Language | Term |
|---|---|
| EN | Common Reporting Standard (CRS) |
| ES | Estándar Común de Comunicación de Información (CRS) |
| CA | Estàndard Comú de Comunicació d'Informació (CRS) |
| FR | Standard Commun de Déclaration (CRS) |
| DE | Gemeinsamer Meldestandard (CRS) |
| PT | Norma Comum de Comunicação (CRS) |

---

## Regulatory & Tax — canonical 2026 facts

These sections extend the SOT to cover the regulations and IRS forms
referenced across the blog. They are authoritative for editorial use.

### Primary sources (2026, verified)

Every factual claim in the sections below is anchored on these
primary sources. The fact-check report cites the corresponding
SOT subsection; the URL chain below is the next hop to the official
document.

- **FinCEN — BOI / CTA interim final rule (March 2025).**
  https://www.fincen.gov/boi (landing page with the current rule status)
  https://www.federalregister.gov/documents/2025/03/26/2025-05199 (interim final rule, 90 FR 13688)
- **FinCEN — BOI E-Filing System.** https://boiefiling.fincen.gov
- **IRS — Form 5472 instructions (current revision).**
  https://www.irs.gov/forms-pubs/about-form-5472
- **IRS — Form 1120 instructions.**
  https://www.irs.gov/forms-pubs/about-form-1120
- **IRS — Form 7004 (automatic extension).**
  https://www.irs.gov/forms-pubs/about-form-7004
- **IRS — Form 8832 (entity classification election).**
  https://www.irs.gov/forms-pubs/about-form-8832
- **IRS — W-8BEN / W-8BEN-E.**
  https://www.irs.gov/forms-pubs/about-form-w-8-ben ·
  https://www.irs.gov/forms-pubs/about-form-w-8-ben-e
- **Treas. Reg. §1.6038A-1 (5472 final regulations applying to
  foreign-owned disregarded LLCs, T.D. 9796, 2016).**
  https://www.ecfr.gov/current/title-26/chapter-I/subchapter-A/part-1/section-1.6038A-1
- **OECD — CRS framework.**
  https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
- **EU — DAC2 (Directive 2014/107/EU amending 2011/16/EU).**
  https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014L0107
- **España — Real Decreto 1021/2015 (transposición CRS).**
  https://www.boe.es/eli/es/rd/2015/11/13/1021
- **AEAT — Modelo 720 (Declaración informativa de bienes en el extranjero).**
  https://sede.agenciatributaria.gob.es/Sede/declaraciones-informativas/modelo-720.html
- **Wise — legal entities.**
  https://wise.com/legal/entities (Wise Europe SA BE, Wise US Inc., licences)
- **Mercury — banking partners (Choice Financial Group, Evolve
  Bank & Trust).** https://mercury.com/legal/banking-services
- **Slash — Column N.A. partner.** https://slash.com (legal footer →
  Column N.A. as the federally chartered partner bank)
- **Relay — Thread Bank partner.** https://relayfi.com/legal
- **Wallester — Estonia Visa issuer (CRS-reporting EE FI).**
  https://wallester.com/legal
- **Revolut Business — Lead Bank for US LLC accounts.**
  https://www.revolut.com/legal/business-terms-us
- **Payoneer — global FI disclosures (CRS).**
  https://www.payoneer.com/legal

These URLs are checked at audit time (April 2026) and are the
primary references for every (SOT §X) citation in
`fact-check-2026.md`. When applying corrections, the editor must
re-verify the URL is live and current at filing time.

Sources used: IRS.gov, FinCEN.gov, Treasury.gov, ecfr.gov, BOE.es,
AEAT, OCDE, EUR-Lex, and provider legal pages above.

### BOI / CTA (Beneficial Ownership Information — Corporate Transparency Act)

- **What it is.** US federal report filed with FinCEN under the Corporate
  Transparency Act (CTA) listing the beneficial owners and company
  applicants of a US reporting company (LLC, corp, etc.).
- **2026 status — CRITICAL.** Following the March 2025 FinCEN interim
  final rule, the BOI reporting requirement was **narrowed to apply
  only to entities formed under the law of a foreign country and
  registered to do business in a US state (foreign reporting
  companies)**. Domestic reporting companies (US-formed LLCs and corps)
  and their US-person beneficial owners are **exempt** under the
  current rule. Litigation and possible Congressional action mean this
  status can change again. **Every article must describe BOI as
  currently not required for a standard US-formed LLC owned by a
  non-resident, while warning that the rule has been changed multiple
  times and must be re-checked at filing time on FinCEN.gov.**
- **Past mandatory window.** Articles that still say "BOI is mandatory
  for every LLC and the deadline is January 1, 2025" are out of date
  and must be corrected.
- **Filing channel.** FinCEN BOI E-Filing System (boiefiling.fincen.gov)
  when applicable.
- **Penalties (when applicable).** Civil penalty up to $591/day (2024
  inflation-adjusted figure, originally $500/day in CTA), criminal
  penalty up to $10,000 and 2 years imprisonment for willful violation.
  These figures must be quoted only in the context of an entity that
  is currently required to file.
- **Editorial rule.** Use "BOI / Corporate Transparency Act" on first
  mention. Always flag the 2025 narrowing. Do not promise that the
  exemption is permanent.

### Form 5472 + pro-forma Form 1120

- **What it is.** Information return filed by a 25%-foreign-owned US
  corporation **or by a foreign-owned single-member LLC treated as a
  disregarded entity** (per Treas. Reg. §1.6038A-1, in force since
  the 2017 final regulations). The 5472 reports "reportable
  transactions" between the LLC and its foreign owner or related
  parties.
- **How a non-resident single-member LLC files.** The disregarded LLC
  files a **pro-forma Form 1120** (only header information completed:
  name, address, EIN, tax year) with **Form 5472 attached**. The 1120
  is not a substantive corporate income tax return — it is the
  carrier required by regulation. Do **not** describe this as "the LLC
  pays corporate tax via 1120": that is wrong and must be corrected
  wherever it appears.
- **Where and how to file.** The pro-forma 1120 + 5472 package must be
  filed **by mail or by fax to the IRS Ogden, UT service center** (per
  the 5472 instructions). It is not e-filed via the standard MeF
  system. Articles claiming "Form 5472 is filed online via the IRS
  portal" are wrong.
- **Deadline.** Due on the 15th day of the 4th month after the LLC's
  tax year end. For a calendar-year LLC: **April 15** of the following
  year, with an automatic 6-month extension available via **Form 7004**
  (extending to October 15). Form 7004 must itself be filed by the
  original April 15 deadline.
- **Reportable transactions.** Capital contributions from the foreign
  owner, distributions to the foreign owner, loans, sales, services,
  rent, royalties, commissions, interest, premiums, and any other
  monetary or non-monetary movement between the LLC and a related
  party (Part IV / Part V / Part VI of the form).
- **Penalty.** **$25,000 per form per year** for failure to file, file
  late, or file substantially incomplete. Additional $25,000 per 30-day
  period after IRS notice if the failure continues. This figure is
  current and must not be quoted as "$10,000" (that was the pre-2018
  amount) or "$50,000" (that is wrong and appears in some old drafts).
- **Editorial rule.** Always present the package as "pro-forma Form
  1120 + Form 5472 by mail/fax to Ogden". Always quote the $25,000
  per form per year penalty. Always pair with the 7004 extension when
  describing the calendar.

### Form 1120 (substantive)

- **What it is.** US Corporate Income Tax Return.
- **When it actually applies to an LLC.** Only if the LLC has
  **elected** to be taxed as a C-corp via Form 8832 (entity
  classification election). A single-member LLC owned by a
  non-resident is by default a disregarded entity; it does **not** file
  a substantive 1120 and does **not** pay US federal corporate tax.
- **Editorial rule.** Distinguish clearly between "pro-forma 1120"
  (carrier for 5472) and "substantive 1120" (only after C-corp
  election). Conflating the two is a common error in current articles.

### CRS — Common Reporting Standard

- **What it is.** OECD framework (2014) for automatic exchange of
  financial-account information between participating jurisdictions,
  implemented in the EU via Directive 2011/16/EU as amended by DAC2,
  and in Spain via Real Decreto 1021/2015.
- **Who reports.** Reporting Financial Institutions (banks, custodial
  institutions, investment entities, specified insurance companies)
  located in a participating jurisdiction.
- **Who is reported on.** Account holders that are tax residents of
  another participating jurisdiction; for entity accounts classified
  as Passive NFE, the controlling persons are also reported.
- **United States is NOT a CRS participant.** The US uses FATCA
  bilaterally instead. US-based financial institutions (Mercury, Slash,
  Relay, Wise US Inc., Choice, Evolve, Column N.A., Thread Bank, Lead
  Bank) do **not** report under CRS. This is the single most
  important fact for the entire LLC + non-resident audience.
- **EU EMIs and crypto exchanges DO report.** Wise Europe SA (Belgium),
  Revolut Bank UAB (Lithuania), N26 (Germany), Wallester (Estonia),
  Payoneer (Ireland), Kraken (Ireland after restructuring), Coinbase
  Europe — all in scope. **Wise Business accounts opened by US LLCs are
  the exception**: even though receiving details route through Wise
  Europe SA, the account holder is a US entity (US LLC) and the US is
  not a CRS participant, so CRS does not pull in the LLC. Only a Wise
  Personal in the individual's own name as a tax resident in a CRS
  jurisdiction is in scope (see Wise Business section).
- **Editorial rule.** Use "Common Reporting Standard (CRS)" on first
  mention with the language-specific term from the table at the top of
  this document. Never say "the US reports CRS" — it does not. Never
  attach CRS to Mercury, Slash or Relay (US-banking partners). Never
  attach CRS to **Wise Business held by a US LLC** (the LLC is a US
  entity; US is not a CRS participant; routing through Wise Europe SA
  does not change holder classification). Attach CRS to Wallester,
  Payoneer, Revolut Business EU and to a **Wise Personal** opened by
  the individual in their own name as a tax resident in a CRS
  jurisdiction.

### FATCA — Foreign Account Tax Compliance Act

- **What it is.** US framework (Chapter 4 of the IRC, 2010) requiring
  Foreign Financial Institutions (FFIs) to report US-person account
  holders to the IRS, and US Withholding Agents to withhold 30% on
  certain US-source payments to non-compliant FFIs and on payments to
  non-US persons that fail to provide a valid W-8BEN / W-8BEN-E.
- **Direction of flow.** FATCA flows information **toward** the US
  (FFIs report US persons to the IRS). It does **not** push
  information from US-based institutions to the LLC owner's country
  of residence — that is what CRS would do, and the US is not in CRS.
- **Documentation for non-resident LLC owner.** The non-resident
  individual signs **Form W-8BEN**; an entity (e.g. a foreign
  corporation owning US-source income) signs **Form W-8BEN-E**. Both
  are valid for 3 calendar years after the year signed.
- **Editorial rule.** Never conflate FATCA with CRS. Never use FATCA to
  argue that "your US bank account is private" — it is private from
  your country of residence in the CRS sense, but it is fully visible
  to the IRS, and the IRS shares with treaty partners under
  treaty-based information exchange (different mechanism).

