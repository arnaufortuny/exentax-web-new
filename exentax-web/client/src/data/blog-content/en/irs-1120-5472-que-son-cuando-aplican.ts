export default `Two <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> forms generate more confusion than any others among LLC owners: **Form 1120** and **Form 5472**. Most people with an LLC hear them named together, don't fully grasp what each one is, and, most importantly, **don't know when they actually apply to their case**.

This article isn't yet another step-by-step guide. If you want the filing procedure, you already have our <a href="/en/blog/form-5472-what-it-is-who-must-file-it-and-how-to-comply">operational Form 5472 guide</a>. Here we explain what the two forms **really** are, how they relate, when they apply by profile, and which mistakes cost real money.

## What Form 1120 actually is

The **Form 1120, U.S. Corporation Income Tax Return** is the federal corporate income tax return for US corporations. In its "normal" use, a **C-Corporation** files it to settle its tax on profits (21% federal today, plus state taxes).

Here comes the first nuance almost nobody explains: Form 1120 is also used **empty, as a wrapper**, so that certain LLCs can meet information obligations. That's the **pro-forma 1120** and we'll get to it below.

Quick map:
- **Operating C-Corporation** → Form 1120 with real numbers (income, expenses, tax due).
- **Single-Member LLC of a non-resident** → **pro-forma Form 1120** (most fields blank) with Form 5472 attached.
- **Single-Member LLC of a US resident** → generally no 1120; income is reported on the personal return (Schedule C of the 1040).
- **Multi-Member LLC** → also doesn't use 1120 by default; files Form 1065 (partnership), unless it elects corporate taxation.
## What Form 5472 actually is

The **Form 5472, Information Return of a 25% Foreign-Owned U.S. Corporation or a Foreign Corporation Engaged in a U.S. Trade or Business** is an **information return, not a tax return**. It pays no tax. Its mission is to inform the IRS of **transactions between the US entity and foreign related parties**.

For most of our clients at Exentax, that "US entity" is a **Single-Member LLC** owned by a non-resident, and the "foreign related party" is **the owner himself**. The "transactions" are any movement of money between you and the LLC: initial contributions, transfers from the LLC to your personal account, one-off payments, loans.

Why does it matter? Because since 2017 **disregarded entities owned by foreigners** are treated as corporations for 5472 purposes. This means that even though your LLC doesn't pay federal income tax, **it is required to report who owns it and how money has moved between you both**. If you don't file it, the base penalty is **USD 25,000 per form per year**.
### The "pro-forma 1120" trap

This is where people get lost. Your non-resident Single-Member LLC:

1. **Doesn't pay US corporate income tax** on income without effective connection to the US.
2. But **does have to file a Form 1120 every year, blank**, so that 1120 acts as the envelope for Form 5472.

This is called **pro-forma Form 1120**. Only the identification fields at the top are filled in ("Foreign-owned U.S. DE"), "Form 1120, Foreign-owned U.S. DE" is hand-written across the top, and the Form 5472 is attached. The rest of the 1120 is blank (no Schedule M, no balance sheet, no tax computation).

If you got your LLC from a provider who told you "you don't need to file anything because you don't pay tax", **that provider is confusing "not paying" with "not reporting"**. They are different things.
### When do they actually apply? Profile table

| Profile | Form 1120? | Form 5472? | Comment |
|---|---|---|---|
| Single-Member LLC, non-resident owner, no movements with the LLC | Yes, pro-forma | No (no reportable transactions) | Very rare: even opening the bank account creates movement |
| Single-Member LLC, non-resident owner, with movements | **Yes, pro-forma** | **Yes** | The typical Exentax case |
| Single-Member LLC, US-resident owner | No | No | Reports on Schedule C of the 1040 |
| Multi-Member LLC, all non-residents | No (files 1065) | Yes, attached to 1065 | Partnership by default |
| LLC with C-Corp election (Form 8832) | **Yes, real** (with figures) | Yes, if there is a foreign related party | Already taxed at 21% federal |
| US C-Corp owned by a non-resident | Yes, real | Yes, if there is a foreign related party | Different structure from the typical LLC |

Almost every client who reaches Exentax with a US LLC falls into row 2: **annual pro-forma 1120 + 5472**.
### "Reportable transactions": what counts and what doesn't

Form 5472 asks you to report the **reportable transactions** between the LLC and the foreign related party. The practical definition for your case:

- Initial or subsequent capital contributions → reported.
- Distributions or "draws" from the LLC to your personal account → reported.
- Payments by the LLC to related companies or persons abroad → reported.
- Loans between you and the LLC → reported.
- Payments for services rendered by you (if you invoice as an individual from another country to the LLC) → reported.

What is **not** reported are payments to **unrelated** providers (an external freelancer, a SaaS, a bank). The criterion is **relationship**, not nationality.

In most starts, a single initial contribution (the transfer you made to fund the LLC) already triggers the obligation. From there, you are inside the regime.
### Deadlines, extensions and where to send it

- **Standard deadline:** April 15 of each year, for the prior fiscal year ending December 31.
- **Extension:** six months with Form 7004, moving the deadline to October 15.
- **Filing method:** an LLC owned by a non-resident without a mandatory e-file requirement usually sends it by **certified mail to the IRS Service Center in Ogden, Utah** or by **fax** to the specific number published by the IRS for foreign-owned DEs. Always confirm the current address/fax for the year in question.
- **EIN required:** without an EIN you cannot file. If you don't have one yet, you must obtain it first (Form SS-4).

Delays are not cheap. The USD 25,000 penalty for an unfiled 5472 **also applies for incomplete or inaccurate information**, not only for not filing anything at all.
## Typical mistakes when preparing 1120 + 5472

1. **Filling out the pro-forma 1120 as if it were a real 1120.** You put in figures, balances, expenses. The IRS processes it as a C-Corp return and chaos follows.
2. **Forgetting that the 5472 goes attached to the 1120**, not on its own. If you send it separately, it is not considered filed.
3. **No clear Operating Agreement** and reporting transactions with no supporting documentation. When the IRS asks for clarifications, there is nothing to show.
4. **Mixing the personal account with the LLC's** and then trying to reconstruct "reportable transactions" at year-end. It comes out expensive and wrong.
5. **Trusting "I haven't received anything from the IRS, all good".** The IRS doesn't warn before sanctioning. Penalties are imposed and discovered when action is taken against the EIN or a future filing is rejected.
6. **Filing the 5472 without the foreign owner's TIN/EIN.** Even as a non-resident, the form requires identification. Without it, it is incomplete.
### Who is NOT obligated (the few cases)

Cases where you do **not** need to file 1120 + 5472:

- Your LLC has multiple members, is classified as a **partnership**, and has no foreign related parties with reportable transactions (uncommon scenario if you are foreign).
- You are a US tax resident and your Single-Member LLC reports directly on Schedule C of your personal 1040. There is no "foreign-owned DE" here.
- Your LLC has elected to be taxed as a **C-Corp** and already files a real 1120, with no transactions with foreign related parties (rare if your international business goes through the LLC).

Outside those cases, assuming you are exempt is a bet that doesn't pay off: the cost of preparing these forms properly is **far lower** than the minimum penalty.
### How this fits into your day-to-day

If you run the LLC's operations correctly during the year (separate account, record of contributions and draws, signed Operating Agreement, minimal bookkeeping), preparing the pro-forma 1120 + 5472 at year-end is a calm task. If you arrive at December 31 with the LLC's account mixed with your personal one, with no documentation and not knowing which movements are reportable, the cost and risk shoot up.

That's why at Exentax we treat these forms as the **natural by-product** of good annual management, not as a March drama. The difference between the two is following the <a href="/en/blog/annual-llc-maintenance-obligations-you-cannot-ignore">annual obligations calendar</a> and keeping effective separation between your personal assets and the LLC's.
### What you should take away

- **Form 1120** = corporate income tax return. In your non-resident LLC it is used **empty, as the envelope** for Form 5472.
- **Form 5472** = information return on transactions between the LLC and you (or any foreign related party).
- **They almost always apply** if you are a non-resident with a Single-Member LLC and have moved money between you and the LLC.
- **No tax is paid** with these forms, but **not filing them costs USD 25,000 per year**.
- The most expensive mistake is filling them out poorly or arriving at year-end without the documentation backing what is reported.

<!-- exentax:calc-cta-v1 -->
> <a href="/en/book">Talk to our team</a>
<!-- /exentax:calc-cta-v1 -->

If you have doubts about whether your case is properly set up, about prior years, or about how to regularise late filings, **we'll review it with you** in a free 30-minute advisory session. Better to understand it well once than to pay avoidable penalties every year.
## Legal and regulatory references

This article relies on rules currently in force. Main sources for verification:

- **United States.** Treas. Reg. §301.7701-3 (entity classification / *check-the-box*); IRC §882 (tax on foreign income effectively connected with a US trade or business); IRC §871 (FDAP and withholding on non-residents); IRC §6038A and Treas. Reg. §1.6038A-2 (Form 5472 for *25% foreign-owned* and *foreign-owned disregarded entities*); IRC §7701(b) (tax residency, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report to <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Spain.** Law 35/2006 (LIRPF), arts. 8, 9 (residency), 87 (income attribution), 91 (CFC for individuals); Law 27/2014 (LIS), art. 100 (CFC for companies); Law 58/2003 (LGT), arts. 15 (anti-abuse) and 16 (simulation); Law 5/2022 (Form 720 penalty regime after CJEU C-788/19 of 27/01/2022); RD 1065/2007 (Forms 232 and 720); Order HFP/887/2023 (Form 721 crypto).
- **Spain–US treaty.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> of 22/12/1990 (original DTT); Protocol in force since 27/11/2019 (passive income, *limitation on benefits*).
- **EU / <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>.** Directive (EU) 2011/16, amended by DAC6 (cross-border arrangements), DAC7 (Directive (EU) 2021/514, digital platforms) and DAC8 (crypto-assets); Directive (EU) 2016/1164 (ATAD: CFC, exit tax, hybrid mismatches); OECD Common Reporting Standard (CRS).
- **International framework.** OECD Model Convention, art. 5 (permanent establishment) and Commentaries; BEPS Action 5 (economic substance); FATF Recommendation 24 (beneficial ownership).
Applying any of these rules to your specific case depends on your tax residency, the LLC's activity and the documentation you keep. This content is informational and does not replace personalized professional advice.
### Next steps

Now that you have the full context, the natural next step is to map it against your own situation: what fits, what doesn't, and where the nuances depend on your residency, your activity and your volume. A quick review of your specific case usually saves a lot of noise before taking any structural decision.

<!-- exentax:legal-facts-v1 -->
## Legal & procedural facts

FinCEN and IRS reporting requirements moved recently; the current state is:

- **BOI / Corporate Transparency Act: your LLC is NOT required to file (a competitive advantage).** After **FinCEN's March 2025 interim final rule**, the BOI Report obligation was **narrowed to "foreign reporting companies"** (entities formed OUTSIDE the US and registered to do business in a state). A **US-formed LLC owned by a non-resident does NOT file the BOI Report**: one fewer filing on your calendar, less paperwork, and a cleaner structure than ever. If your LLC was formed before March 2025 and you already filed BOI, keep the acknowledgement. The regulatory status can change again: **we monitor FinCEN.gov on every filing** and, if the obligation comes back, we handle it at no extra cost. Current status verifiable at [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + pro-forma 1120.** For a **Single-Member LLC owned by a non-resident**, the final regulations of Treas. Reg. §1.6038A-1 (in force since 2017) treat the LLC as a corporation for 5472 purposes. Procedure: **pro-forma Form 1120** (header only: name, address, EIN, tax year) with **Form 5472 attached**. It is filed **by certified mail or fax to the IRS Service Center in Ogden, Utah**, **not e-filed via standard MeF**. Due date: **April 15**; extension via **Form 7004** to **October 15**. **Penalty: $25,000 per form per year, plus $25,000 per additional 30 days** of non-filing after IRS notice.
- **Substantive Form 1120.** Only applies if the LLC has filed a check-the-box election to C-Corp (Form 8832): it then pays 21 % federal corporate tax and files a substantive 1120. A standard disregarded LLC **does not file a substantive 1120 and does not pay federal corporate tax**.
- **EIN and notice.** Without an EIN you cannot file 5472 or BOI. The IRS does not warn before imposing penalties; you find out when an EIN is flagged or a later filing is rejected.
## Banking and tax facts worth clarifying

What follows is the operational view, not the textbook one. We have run this play enough times to know which variables collapse first under scrutiny from a tax authority or a banking compliance team, and that is the order we tackle them in.

## Legal and procedural facts

Read this section as a checklist with teeth: each point flags a real failure mode we have seen in cross-border LLC files. Skip none of them - most reassessments and account closures we clean up later trace back to one of these items.

## Your next step with Exentax

Our position here is deliberate and conservative: we optimise for what survives an inspection, not for the most aggressive headline number. The points below are the ones we are willing to defend in writing.<!-- exentax:execution-v2 -->
## Form 1120 and Form 5472: what they are and when a non-resident LLC files them

The 1120 + 5472 combo is the central informational obligation of any single-member LLC owned by a non-resident with "reportable transactions" with its foreign partner. It does not generate tax, but missing it triggers a $25,000 penalty per year and entity. The essentials.

- **Form 1120 (pro-forma).** Not the typical corporate 1120: a simplified version used by the disregarded LLC as a "vehicle" to accompany the 5472. Only identifying data is completed (EIN, address, fiscal year). No tax calculation. Deadline: April 15th (or October 15th with extension 7004).
- **Form 5472.** The actual informational form. Reports any "reportable transaction" between the LLC and its foreign owner (25%+ ownership): capital contributions, distributions, intercompany loans, payments for services rendered or received, sales of goods. The reported figure does not create tax but lets the IRS track cross-border flows.
- **When it applies.** Single-member LLC owned by a non-resident (individual or foreign entity) with at least one reportable transaction during the fiscal year. If the year saw no movement between owner and entity, technically no 5472 - but it is advisable to file with "0" to keep a clean history.
- **Penalty for omission.** $25,000 per fiscal year and omitted entity. Additional $25,000 if after IRS notice it is not corrected within 90 days. The most expensive informational penalty for non-resident LLCs and the easiest to prevent by timely filing.

### What we are asked the most

**Do I have to pay federal tax with this?** No, unless the LLC has effectively connected income with a US trade or business (ETBUS). Without ETBUS and without US-source income, the federal result is 0 and the 1120/5472 is informational only.

**Can I file them myself?** Technically yes, but one mis-categorisation of reportable transactions or a one-day delay triggers the $25,000 penalty. Most clients prefer to delegate and sleep.

At Exentax we prepare and file your LLC's 1120 + 5472 on time, keep the filing receipt and maintain a clean record for future audits or due diligence.
<!-- /exentax:execution-v2 -->

## What Form 1120 really is

Our position here is deliberate and conservative: we optimise for what survives an inspection, not for the most aggressive headline number. The points below are the ones we are willing to defend in writing.


<!-- exentax:defensa-fiscal-v1 -->
## What if HMRC, the IRS or my local tax authority asks about my LLC?

  It's the question every client raises in the first advisory session, and the short answer is: your LLC isn't opaque, and a properly declared structure closes any inquiry in standard forms. Your tax authority can request the state Certificate of Formation (Wyoming, Delaware or New Mexico), the EIN issued by the <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, the signed Operating Agreement, the Mercury or Wise statements for the year, the Form 5472 plus pro-forma 1120 you filed, and the bookkeeping that reconciles income, expenses and movements. If all of that exists and is delivered in order, the inquiry doesn't escalate.

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
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22Two%20a%20href%3Dhttps%3A%2F%2Fwww%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you want to see the full process in detail, check our <a href="/en/services">services page</a> with everything we cover.

<!-- exentax:conv-fill-v1 -->
Or call us directly at <a href="tel:+34614916910">+34 614 916 910</a> if you'd rather talk.

For state-specific details, see our <a href="/en/services/llc-wyoming">Wyoming LLC service page</a> with closed costs and timelines.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

  ### Forms 1120 + 5472 from a UK perspective

  UK-resident sole members of US LLCs face a parallel reporting stack: HMRC requires disclosure of overseas income on the **SA106 (Foreign Pages)** of the Self Assessment return, and the **Companies House confirmation statement** (CS01) is the UK functional equivalent of the US 1120 informational filing. Where the LLC is treated as opaque under HMRC's check-the-box guidance (INTM180030), CFC charges under **Part 9A TIOPA 2010** may apply alongside the US §6038A reporting.

<!-- exentax:lote7-native-v1:irs-1120-5472-que-son-cuando-aplican -->
## What 1120 + Form 5472 actually report (and what they do not)

For a single-member LLC owned by a non-US person and disregarded for
US tax purposes, the IRS requires a pro-forma 1120 envelope used
solely as the carrier for Form 5472. This pair does not assess US
tax on a foreign-owned disregarded LLC; it documents that certain
reportable transactions between the LLC and its foreign owner (or
related parties) actually took place. The IRS wants visibility, not
necessarily revenue, on these flows.

| Item            | What it reports                                          |
|-----------------|----------------------------------------------------------|
| Pro-forma 1120  | Identifying envelope: LLC name, EIN, address, year       |
| Form 5472       | Each reportable transaction with the foreign related     |
|                 | party (capital contributions, distributions, loans,      |
|                 | services, etc.)                                          |

If the year had zero reportable transactions, the pair is still
generally filed with values at zero so the IRS sees activity status
explicitly. Skipping the filing is what triggers the well-known
penalty exposure under the regulations.

## Three real filing patterns we run

A single-member LLC with one capital contribution at formation, a
small monthly draw to the foreign owner, and no other related-party
flows. The 5472 reports the contribution and the draws; the
pro-forma 1120 carries the envelope. Filing season takes a couple of
hours of structured work, including the bookkeeping reconciliation.

A single-member LLC that lent money to a related foreign company,
later repaid, with normal-rate interest. The 5472 reports the loan
issuance and the repayment; the interest accrual is part of the LLC
books and is mirrored in the home-country declaration of the owner.
Documentation is the friend here: the loan agreement and the
amortisation schedule sit in the LLC's compliance folder.

A multi-year LLC with no activity in the current year. We still file
the pro-forma 1120 + 5472 with zeros, attach a short internal
memo explaining the dormant year, and keep the file ready for the
moment the LLC reactivates.

## Mistakes that lead to penalty letters

- Treating the pair as a tax return that "owes nothing" and skipping
  it. It is a reporting filing; the absence of tax does not remove
  the duty.
- Mixing personal owner expenses into the LLC books, then trying to
  reconcile at filing time. Keep the boundary clean monthly.
- Forgetting that a draw to the foreign owner is a reportable
  transaction. It often is, depending on its character (return of
  capital, distribution, etc.).
- Filing late. The penalty for a missed Form 5472 is substantial and
  applies even when no US tax is due.

## Pre-filing checklist

- LLC EIN matches the IRS letter (CP575).
- Operating year confirmed (calendar year by default for a
  single-member disregarded LLC).
- Bookkeeping closed and reconciled with banks.
- Related-party flows mapped to 5472 line categories.
- Owner identification document on file matches the BOI submission.
- Filing channel ready (paper or e-file with authorised provider).

We treat 1120 + 5472 as the LLC's annual handshake with the IRS:
quiet, predictable and structured. A clean filing this year makes
the next year quieter still.

<!-- /exentax:lote7-native-v1:irs-1120-5472-que-son-cuando-aplican -->

<!-- exentax:cross-refs-v1 -->
## On the same topic

- [What happens if you don't file Form 5472: IRS penalties and how to fix it](/en/blog/what-happens-if-you-dont-file-form-5472-irs-penalties-and)
- [W-8BEN and W-8BEN-E: a complete, calm guide](/en/blog/w8-ben-and-w8-ben-e-the-complete-guide)
- [What is the IRS, and how does it actually affect your US LLC](/en/blog/what-is-the-irs-and-how-does-it-affect-your-us-llc)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:cta-v1 -->
We review BOI, EIN, registered agent and federal obligations so a fine never catches you by surprise. <a href="/en/services">Request a compliance review</a>.
<!-- /exentax:cta-v1 -->

`;
