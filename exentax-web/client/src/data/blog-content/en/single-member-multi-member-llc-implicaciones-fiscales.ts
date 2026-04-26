export default `Going from single-member LLC to multi-member LLC sounds like a minor procedure. It is not. It is one of the structural changes with the most actual tax implications for an operating LLC, and it is rarely explained in the depth it deserves before being executed.

This article covers what really changes, what does not change, and what you must have resolved before adding a second member.

## The central tax change

A single-member LLC with non-resident member is treated by default as a **disregarded entity** by the <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>: the LLC itself does not file a federal return, it files an informational **Form 5472 + 1120 pro-forma**.

The moment you add a second member, absent an express election otherwise, the LLC automatically becomes a **partnership**. That means:

- It stops filing 5472 + 1120 pro-forma the way it used to.
- It starts filing **Form 1065** (US Return of Partnership Income), informational return.
- Each member receives a **Schedule K-1** with their pro-rata share of income, expenses and items.
- If there is a foreign member, **Form 8804/8805** comes into play and **Section 1446** withholding on ECI allocated to the foreign partner.

It is a complexity jump worth seeing coming.
### What does NOT change

- **The EIN**, generally. It does continue to be the same when a SMLLC becomes partnership by adding a new member, with specific exceptions.
- **The LLC itself**: same legal entity, same state, same name, same formation date.
- **Banking and provider history**.
- **Limited liability protection**.
### When it makes sense to go multi-member

Valid reasons:

- Bringing in a **real operating partner** who contributes work and shares profits.
- Bringing in an **investor** with percentage participation and economic rights.
- **Estate planning**: bringing in family members with minority percentages.
- **Holding structure**: when the holding takes a stake in an operating that was previously single-member.

Weak reasons that almost always end badly:

- "To look more professional." The cost of complexity outweighs the cosmetic benefit.
- "To dilute tax exposure." It does not work that way: each member is taxed on their share.
- "To put the spouse on payroll without really knowing why." Without real role, complicates more than it adds.
## Detailed tax implications

### In the US

- **Annual Form 1065** with March 15 deadline (or extension to September 15 via Form 7004).
- **Schedule K-1 to each member** by the same date. Late delivery to the member carries specific penalties.
- **Form 8804/8805** if there is a foreign member: the partnership must withhold on ECI allocated to the non-resident partner at the highest applicable rate.
- **Specific penalties for unfiled 1065**: currently around 245 USD per month per member.

### In the non-resident member's country of residence

This is where it really gets complex:

- Some countries treat the partnership as **transparent** (same approach as the disregarded entity): the member taxes their share of allocated profits in personal income tax.
- Others treat it as **opaque**: the partnership is the taxpayer and distributions to the member look like dividends. This can trigger CFC rules and special attribution.
- The difference between the two treatments can be **dozens of percentage points** on the bottom line.

Without specific analysis of how each jurisdiction treats the US partnership, the real tax bill cannot be estimated seriously.

### For the incoming partner

- If they contribute capital, the contribution must be documented: amount, date, recorded in Member's Capital.
- If they contribute work, payments are documented as **guaranteed payments** (subject to specific tax treatment).
- Their tax residency and nationality are reported on the K-1 and affect withholding.
## Orderly procedure for the change

### 1. Informed decision with prior advice

Before any operational step, validate with a tax advisor in your country (and, if the partner is in another country, also in theirs) what the actual treatment of the partnership will be. Without this, you are flying blind.

### 2. New or substantially revised Operating Agreement

When a member enters, the Operating Agreement must reflect:

- Ownership percentages
- Profit and loss allocation (need not equal ownership percentages)
- Initial contributions of each member
- Decision-making rules
- Exit procedures

### 3. Formal acceptance by incoming member

Document signed by the incoming member accepting the OA terms, effective entry date and percentage received.

### 4. Communication to the IRS

Although the EIN is maintained, **Form 8832** is filed only to elect a different classification (rare) or to elect corporate taxation. Without an election, the entity becomes a partnership automatically from the date of the second member's entry.

### 5. BOI Report update

Any new beneficial owner must be added to BOI within 30 days.

### 6. Banking and platform updates

Mercury, Wise, Stripe and similar want to know who the actual beneficial owners are. Update the account profile or, depending on the case, restart the KYC process.

### 7. Bookkeeping with two members from day one

Distributions, contributions and guaranteed payments documented per member from day one. Without this, the year-end K-1 is fiction.
### When it is better NOT to go multi-member and seek alternatives

Sometimes the best option is not adding a second member, but:

- **Forming a second LLC** with the other partner and operating in parallel or with a joint venture agreement.
- **Keeping the single-member and compensating the collaborator as a contractor** instead of as a partner.
- **Creating a holding** with two members and dropping down to the operating as a separate entity, leaving the original single-member as is.

Any of the three may be the right answer per case.
### How we approach it at Exentax

At Exentax we accompany single → multi transformations periodically. The rule is invariable: cross-jurisdictional tax analysis first (US + each member's country), new Operating Agreement next, execution and ongoing compliance last. No skipping steps, no "we will sort it at year-end".

If you are evaluating bringing in a partner, book a free initial session through our booking page. In 30 minutes we will tell you whether the multi-member path is right or whether an alternative with less friction exists.
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

<!-- exentax:banking-facts-v1 -->
## Banking and tax facts worth clarifying

Fintech and CRS information evolves; here is the current state:

<!-- exentax:calc-cta-v1 -->
> <a href="/en/services">Start today, 100% online</a>
<!-- /exentax:calc-cta-v1 -->

### Notes by provider

- **Mercury** operates with several federally chartered partner banks and **FDIC** coverage via sweep network: mainly **Choice Financial Group** and **Evolve Bank & Trust**, with **Column N.A.** still in some legacy accounts. Mercury is not itself a bank; it is a fintech platform backed by those partner banks. If Mercury closes an account, the balance is typically returned **by paper check mailed to the account holder's registered address**, which can be a serious operational problem for non-residents; keep a secondary account (Relay, Wise Business, etc.) as contingency.
- **Wise** ships two clearly different products: **Wise Personal** and **Wise Business**. For an LLC you must open **Wise Business**, not the personal account. Important CRS nuance: a **Wise Business held by a US LLC sits outside CRS** because the account holder is a US entity and the US is not a CRS participant; the USD side operates via Wise US Inc. (FATCA perimeter, not CRS). In contrast, a **Wise Personal opened by an individual tax-resident in Spain** or another CRS jurisdiction **does trigger CRS reporting** via Wise Europe SA (Belgium) on that individual. Opening Wise for your LLC does not bring you into CRS through the LLC; a separate Wise Personal in your own name as a CRS-resident individual does report.
- **Wallester** (Estonia) is a European financial entity with an EMI/issuing-bank licence. Its European IBAN accounts **are within the Common Reporting Standard (CRS)** and therefore trigger automatic reporting to the tax administration of the holder's country of residence.
- **Payoneer** operates through European entities (Payoneer Europe Ltd, Ireland) that are also **in scope for CRS** for clients resident in participating jurisdictions.
- **Revolut Business**: when paired with a **US LLC**, the usual setup runs through Revolut Payments USA; European IBANs (Lithuanian, BE) **are not issued by default** to a US LLC, they are issued to European clients of the group's European bank. If you are offered a European IBAN, confirm exactly which legal entity it sits with and which regime it reports under.
- **Zero tax**: no LLC structure delivers "zero tax" if you live in a country with CFC/tax transparency or income attribution rules. What you achieve is **no double taxation** and **correct reporting at residence**, not elimination.

<!-- exentax:legal-facts-v1 -->
## Legal & procedural facts

FinCEN and IRS reporting requirements moved recently; the current state is:

- **BOI / Corporate Transparency Act: your LLC is NOT required to file (a competitive advantage).** After **FinCEN's March 2025 interim final rule**, the BOI Report obligation was **narrowed to "foreign reporting companies"** (entities formed OUTSIDE the US and registered to do business in a state). A **US-formed LLC owned by a non-resident does NOT file the BOI Report**: one fewer filing on your calendar, less paperwork, and a cleaner structure than ever. If your LLC was formed before March 2025 and you already filed BOI, keep the acknowledgement. The regulatory status can change again: **we monitor FinCEN.gov on every filing** and, if the obligation comes back, we handle it at no extra cost. Current status verifiable at [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + pro-forma 1120.** For a **Single-Member LLC owned by a non-resident**, the final regulations of Treas. Reg. §1.6038A-1 (in force since 2017) treat the LLC as a corporation for 5472 purposes. Procedure: **pro-forma Form 1120** (header only: name, address, EIN, tax year) with **Form 5472 attached**. It is filed **by certified mail or fax to the IRS Service Center in Ogden, Utah**, **not e-filed via standard MeF**. Due date: **April 15**; extension via **Form 7004** to **October 15**. **Penalty: $25,000 per form per year, plus $25,000 per additional 30 days** of non-filing after IRS notice.
- **Substantive Form 1120.** Only applies if the LLC has filed a check-the-box election to C-Corp (Form 8832): it then pays 21 % federal corporate tax and files a substantive 1120. A standard disregarded LLC **does not file a substantive 1120 and does not pay federal corporate tax**.
- **EIN and notice.** Without an EIN you cannot file 5472 or BOI. The IRS does not warn before imposing penalties; you find out when an EIN is flagged or a later filing is rejected.<!-- exentax:execution-v2 -->
## Single-member vs multi-member LLC: tax implications that change the whole setup

The difference between one or several members in your US LLC is not cosmetic: it changes the IRS default fiscal classification, mandatory forms, deadlines, treatment of flows to members and residence planning strategy. Before adding a member "to optimise" you must know what it optimises and what it worsens.

- **Default fiscal classification in US.** Single-member LLC: disregarded entity by default. Multi-member LLC: partnership by default (annual Form 1065 + K-1 to each member). Both can elect C-Corp or S-Corp with Forms 8832/2553, but default is what to understand first.
- **Annual filings and deadlines.** Single-member non-resident: Form 5472 + 1120 pro forma (15 April, ext. 15 October). Multi-member partnership: Form 1065 + Schedule K-1 per partner (15 March, ext. 15 September - one month earlier). If foreign partners, also Form 8804/8805 (ECI withholding, if any) and possibly Form 5472 per foreign >25% partner.
- **Withholding implications.** Multi-member with non-resident partners and ECI: partnership must withhold 37% on effectively connected share of foreign partner (IRC §1446). Even without ECI, reporting requirements are substantially heavier than single-member.
- **Residence treatment of the partner.** Spain: multi-member partnership is attributed to Spanish resident partner per participation. But documentary proof (operating agreement, K-1, allocations) is more demanding than single-member. France, Italy, Germany apply similar logic. For LATAM with opaque LLC, multi-member triggers CFC more easily.

### When single-member fits and when multi-member

Single-member: solo entrepreneur, freelance, consultancy, single-owner e-commerce, agency with internal team (no partners). Multi-member: real partners with differentiated effective contribution, joint venture between two professionals, investment fund with several LPs, family holding with spouses as real co-owners.

### What we are asked the most

**If I add my partner as member, do I optimise tax?** In US, not by itself. At residence, depends: in Spain may optimise if partner has lower IRPF marginal, but real contribution must be justified. No substance = simulation.

**Can I change from single to multi (or vice versa)?** Yes, with fiscal consequences. Single to multi may require new EIN and new operating agreement, interpreted as contribution to partnership. Multi to single (buying out the other) is sale of participation with potential capital gain.

At Exentax we model the single vs multi choice with your case (residence, partner profile, activity) and, when LLC exists, evaluate if change pays off - default election is rarely optimal without analysis.
<!-- /exentax:execution-v2 -->

## Legal and procedural facts

Read this section as a checklist with teeth: each point flags a real failure mode we have seen in cross-border LLC files. Skip none of them - most reassessments and account closures we clean up later trace back to one of these items.
### When it makes sense to move to multi-member

Most of the avoidable damage we see in this exact point comes from skipping the documentation step, not from the underlying tax logic.

### In the non-resident member's country of residence

### For the incoming partner

The numbers and the calendar matter - get either wrong and the rest unravels.

### 1. Informed decision with prior advisory

If it is not clean here, every downstream assumption becomes negotiable in front of the authority.

### 2. New or substantially revised Operating Agreement

Most of the avoidable damage we see in this exact point comes from skipping the documentation step, not from the underlying tax logic.

### 3. Formal acceptance of the incoming member

Field note from running this for clients month after month: the rule is straightforward, the execution is where it breaks. Plan the operational side before the legal side.

### 4. Notification to the IRS


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
<p data-testid="cta-action-row">Want to discuss it now? Message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22Going%20from%20single-member%20LLC%20to%20multi-member%20LLC%20sounds%20like%20a%20minor%20procedure%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you want to see the full process in detail, check our <a href="/en/services">services page</a> with everything we cover.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Formation, EIN, BOI, banking and ongoing maintenance — one team that understands your case end to end. <a href="/en/services">Explore all services</a>.
<!-- /exentax:cta-v1 -->
`;
