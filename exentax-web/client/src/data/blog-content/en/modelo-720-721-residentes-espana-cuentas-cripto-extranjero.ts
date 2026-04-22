export default `If you are a Spanish tax resident and own a <a href="/en/blog/llc-in-the-united-states-complete-guide-for-non-residents-in">US LLC</a>, a Wise or Mercury account, a foreign broker or any meaningful crypto balance outside a Spanish exchange, two filings draw the line between being safe and having a serious problem: **Modelo 720** and **Modelo 721**. Almost every other article on this blog refers to them in passing; this one is the reference piece to understand them properly.

## What Modelo 720 is

**Modelo 720** is the "informational return on assets and rights located abroad". It was created by Law 7/2012 on the prevention of tax fraud and developed in **Order HAP/72/2013**, later amended by Order HFP/887/2023. It is not a tax: no liability is assessed. It is an informational regime that requires Spanish tax residents to declare ownership and balances of certain assets located outside Spain when statutory thresholds are exceeded.

It covers three separate blocks, each with its own aggregated EUR 50,000 threshold:

| Block | What it covers | Threshold |
| --- | --- | --- |
| Block I: Accounts | Current, savings, deposit, credit and any other accounts in foreign financial institutions | EUR 50,000 (year-end balance or Q4 average) |
| Block II: Securities, rights, insurance and annuities | Shares, fund units, bonds, representative rights, life or disability insurance, life or term annuities | EUR 50,000 (year-end value) |
| Block III: Real estate and rights over real estate | Real estate and real rights over real estate located abroad | EUR 50,000 (acquisition value) |

Each block is assessed independently. You may be obliged in accounts only, in securities only, in real estate only, or in several. The duty arises when the threshold is exceeded in **at least one** block.
### What Modelo 721 is

**Modelo 721** is the crypto sibling of the 720. It is regulated by **Order HFP/886/2023, of 26 July**, implementing Royal Decree 249/2023, and requires reporting of **virtual currencies located abroad** when their aggregated balance at 31 December exceeds **EUR 50,000**. The first campaign has already been filed (tax year 2023).

A crypto asset is "located abroad" when it is custodied by a non-Spanish resident entity or person (Coinbase US, Kraken, Binance outside its Spanish entity, Ledger in self-custody combined with a foreign provider, etc.). If your crypto is in an entity **registered with the Bank of Spain** or in **pure self-custody** without any associated foreign provider, the 721 does not apply (although the **Thirteenth Additional Provision of LIRPF** may apply: domestic informational reporting by Spanish providers).
### Who is obliged

Required to file the 720 and/or 721:

- **Individuals** who are tax residents in Spain (article 9 LIRPF: 183 days, centre of economic interests, core of vital interests).
- **Legal entities** resident in Spanish territory.
- **Permanent establishments** in Spain of non-resident entities.
- **Joint estates and unallocated inheritances** under article 35.4 LGT.
- **Beneficial owners** (controlling persons), even when the legal owner is another person or entity. This is where a US LLC becomes meaningful: if you are the beneficial owner of a <a href="/en/blog/llc-in-the-united-states-complete-guide-for-non-residents-in">US LLC</a> and the LLC holds a Wise or Mercury account, you are personally required to declare that account as a foreign-located asset.
### Deadlines and filing

- **Modelo 720**: from 1 January to **31 March** of the year following the reported year. Online only (AEAT e-Office, certificate or Cl@ve).
- **Modelo 721**: from 1 January to **31 March** of the year following the reported year. Online only.

After the first filing, you only need to file again if the relevant block has had an **increase greater than EUR 20,000** vs the last declared balance, or if you have lost ownership or cancelled an item previously declared.
## The CJEU C-788/19 ruling and the current sanctions regime

The original 720 sanctions regime was one of the harshest in the EU: EUR 5,000 per omitted item (minimum EUR 10,000), unlimited statute of limitations on undeclared income treated as unjustified capital gain (article 39.2 LIRPF) and a 150% penalty on the tax due.

The **CJEU judgment of 27 January 2022, case C-788/19**, declared this regime contrary to EU law on grounds of disproportionality and free movement of capital. Law 5/2022 of 9 March removed those specific sanctions.

This **does not mean** there are no longer sanctions. What applies today:

- **Ordinary penalty** under article 198 LGT for not filing an informational return: EUR 20 per item, minimum EUR 300, maximum EUR 20,000. Halved if filed without prior notice from the tax authority.
- **General LGT regime** for tax due on undeclared IRPF income: article 191 (50%-150% penalty), with the standard **4-year statute of limitations**.
- **Criminal route** (article 305 Penal Code) if the tax evaded in a year exceeds EUR 120,000.

The European ruling softened the regime but did not abolish the duty to inform. Whoever fails to file the 720 still commits a tax infringement.
## How Wise, Mercury, Revolut and your LLC fit in

This is where we see the most mistakes. Step by step.

### Wise / Revolut / N26 / Wallester accounts (European entities)

These are accounts held with foreign-located financial institutions (Belgium, Lithuania, Germany, Estonia). If the holder is your US LLC and you are the beneficial owner, include them in **Block I of the 720** when the EUR 50,000 aggregated threshold is met. We cover this in <a href="/en/blog/wise-iban-and-llc-what-actually-gets-reported-to-the-tax">what Wise actually reports to the tax authority</a> and <a href="/en/blog/revolut-business-and-crs-what-it-reports-to-your-tax">Revolut Business and CRS</a>. These accounts also reach the AEAT via CRS, so the cross-check is automatic.

### Mercury, Relay, US banking

The United States has not joined CRS, but this **does not waive the 720 obligation**. The Spanish informational duty is independent of international exchange: if your Mercury account or its Q4 average exceeds EUR 50,000 aggregated with other foreign accounts, you must declare it. The fact that the AEAT does not learn about it via CRS does not mean the obligation does not exist. And if an audit is opened later for any other reason, the omission will surface. We discuss this in <a href="/en/blog/do-us-bank-accounts-report-to-your-home-tax-authority-the">do US bank accounts report to your home tax authority</a>.

### Foreign brokers (Interactive Brokers, Tastytrade, etc.)

Securities positions go in **Block II** (EUR 50,000 threshold at 31/12 at market value). When they generate dividends or interest, those flows reach the tax authority via CRS from the broker's jurisdiction, making correct reporting critical.

### Crypto assets in foreign exchanges

Coinbase, Kraken, Binance international, KuCoin, Bybit, etc.: these are non-Spanish providers. Aggregated balance at 31/12 above EUR 50,000 → **Modelo 721**. With DAC8 from today onwards the cross-check becomes faster (we cover this in <a href="/en/blog/dac8-and-cryptocurrencies-the-automatic-tax-reporting-of">DAC8 and crypto reporting</a>).

### Pure self-custody

A hardware wallet without any associated foreign provider is technically outside the 721 because there is no "foreign-located entity" custodying. However, if those funds generate yield (staking, DeFi) through foreign platforms, those platforms can trigger the obligation.
### Exactly what to report

For each account, security or crypto asset you report:

- Holder ID and, if applicable, beneficial owner ID.
- Entity ID: name, tax ID or equivalent, address.
- Account or asset ID: IBAN, number, ISIN, crypto ticker.
- Opening or acquisition date and, where relevant, cancellation or disposal date.
- Balances: 31/12 balance and Q4 average (accounts) or 31/12 value (securities and crypto).
- Asset type per the official classification.

Filing is split by blocks, with specific keys for each situation (sole holder, joint holder, authorised, beneficiary, etc.).
## Typical mistakes we see every week

1. **"My Wise account is in the US (Wise US Inc.), so I do not declare it."** That would only apply if your account is genuinely under Wise US Inc., which is exceptional from Europe. The vast majority of Wise accounts of European residents are under Wise Europe SA (Belgium) and go on the 720.
2. **"My LLC is the holder, not me."** You are the beneficial owner and, as a Spanish tax resident, the duty falls on you. Interposing the LLC does not change the informational obligation.
3. **"I have EUR 30,000 in Wise and EUR 25,000 in Mercury, I am below the threshold."** The threshold is **aggregated** within each block. 30,000 + 25,000 = 55,000 → both accounts must be declared.
4. **"I already filed once, no need to file again."** You must file again if there is an increase above EUR 20,000 over previously declared figures, or if any item is cancelled.
5. **"I have crypto on Binance but I list Binance Spain as the entity."** If your account is on Binance international (not the entity registered with the Bank of Spain), you must reflect it as a foreign exchange. The distinction matters.
6. **"Since the CJEU killed the sanctions, I no longer file."** The CJEU annulled the disproportionate specific regime, not the obligation. Article 198 LGT penalties still apply, and so does article 191 if undeclared income surfaces.
7. **"If I file three years late, they will destroy me."** The reasonable approach is to file **late returns without prior notice from the tax authority**: penalties are halved and the inspection-discovery scenario is avoided. That is exactly how we handle clients who arrive in this position.
### How we handle it at Exentax

Our process for the 720/721 when a client comes in with LLC + European fintechs + crypto:

1. **Full inventory** of accounts, brokers, exchanges and wallets, with clear identification of each managing entity and its jurisdiction.
2. **Obligation assessment** by block and threshold, distinguishing legal ownership from beneficial ownership.
3. **Reconciliation** with CRS / DAC data already received by the AEAT (when prior administration data is available).
4. **Filing** of the 720 and, where applicable, the 721, with correct coding of each element.
5. **Regularisation plan** if there are unreported prior years, prioritising late returns without prior notice.
6. **Integration** with the rest of the planning: <a href="/en/blog/designing-a-solid-international-tax-structure-step-by-step">international structure design</a>, <a href="/en/blog/llc-taxation-by-economic-activity-services-ecommerce-saas">LLC taxation by activity</a> and <a href="/en/blog/crs-for-residents-in-spain-and-latam-real-implications">CRS for Spanish residents</a>.
### In summary

Modelo 720 and Modelo 721 are informational duties, not taxes. They cost nothing on their own, but omitting them is expensive: article 198 LGT penalty, article 191 surcharges on the tax due and the classic article 39 LIRPF lever for unjustified balances (softened by the CJEU but not eliminated). The cross-check with CRS and, from today, with DAC8, makes the footprint increasingly visible to the AEAT.

If you have Wise, Mercury, Revolut, foreign brokers or crypto outside Spain and you are not 100% sure of your position regarding the 720/721, we will review it with you and make sure your situation is clean before the next campaign.
## Tax compliance in your country: CFC, controlled-foreign rules and income attribution

A US LLC is a fully legal, internationally recognized vehicle. But compliance does not end at incorporation: as an owner who is tax-resident elsewhere, your local tax authority still has the right to tax what the LLC earns. The key is **under which regime**.

### By jurisdiction

- **Spain (LIRPF/LIS).** An operative single-member disregarded LLC (real services, no significant passive income) is generally treated under **income attribution (art. 87 LIRPF)**: the LLC's net profits are attributed to the member in the year they arise and integrated into the general IRPF base. If instead the LLC elects corporation treatment (Form 8832) and is controlled by a Spanish resident with mostly passive income, the **CFC regime (art. 91 LIRPF for individuals, art. 100 LIS for companies)** can apply. The choice is not optional: it depends on economic substance, not on the label.
- **Information returns.** US bank accounts with average or year-end balance >€50,000: **Form 720** (Law 5/2022 after CJEU C-788/19, 27/01/2022, penalties now under the general LGT regime). Related-party transactions and dividend repatriation: **Form 232**. US-custodied crypto: **Form 721**.
- **Spain–US tax treaty.** The treaty (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocol in force 27/11/2019) governs double taxation on dividends, interest and royalties. An LLC without a permanent establishment in Spain does not by itself create a PE for the member, but effective management can if all activity is run from Spanish territory.
- **Mexico, Colombia, Argentina and other LATAM jurisdictions.** Each has its own CFC regime (Mexico: Refipres; Argentina: foreign passive income; Chile: art. 41 G LIR). Common principle: profits retained inside the LLC are deemed received by the member if the entity is treated as transparent or controlled.

Practical rule: an operative LLC with substance, properly declared in your country of residence, is **legitimate tax planning**. An LLC used to hide income, fake non-residence or shift passive income with no economic justification falls within **art. 15 LGT (anti-abuse)** or, worse, **art. 16 LGT (simulation)**. The facts decide, not the paperwork.

At Exentax we structure the entity to fit the first scenario and document every step so your local return can be defended in case of review.

<!-- exentax:bank-balance-v1 -->
## A balanced banking stack: Mercury, Relay, Slash and Wise

There is no perfect account for an LLC. There is the right **stack**, where each tool plays a role:

- **Mercury** (operated as a fintech with partner banks (Choice Financial Group and Evolve Bank & Trust primarily; Column N.A. on legacy accounts), FDIC via sweep network up to the current limit). Main operating account for non-residents with strong UX, ACH and wires. Still one of the most proven options to open from outside the US.
- **Relay** (backed by Thread Bank, FDIC). Excellent **backup account** and for envelope-style budgeting: up to 20 sub-accounts and 50 debit cards, deep QuickBooks and Xero integration. If Mercury blocks or asks for KYC review, Relay keeps your operations running.
- **Slash** (backed by Column N.A. (federally chartered, FDIC)). Banking built for online operators: instant virtual cards by vendor, granular spend controls, cashback on digital advertising. The natural complement when you manage Meta Ads, Google Ads or SaaS subscriptions.
- **Wise Business** (multi-currency EMI, not a bank). To collect and pay in EUR, GBP, USD and other currencies with local bank details and mid-market FX. Does not replace a real US account but is unbeatable for international treasury.
- **Wallester / Revolut Business.** Wallester provides corporate cards on a dedicated BIN for high volume. Revolut Business works as a European complement, not as the LLC's main account.
The realistic recommendation: **Mercury + Relay as backup + Slash for ad operations + Wise for FX treasury**. This setup minimizes block risk and reduces real cost. At Exentax we open and configure this stack as part of incorporation.

<!-- exentax:banking-facts-v1 -->
## Banking and tax facts worth clarifying

Fintech and CRS information evolves; here is the current state:

<!-- exentax:calc-cta-v1 -->
> **Put numbers on your case.** The <a href="/en#calculadora">Exentax tax calculator</a> compares your current tax burden with what you would pay running a US LLC properly declared in your country of residence.
<!-- /exentax:calc-cta-v1 -->

### Notes by provider

- **Mercury** operates with several federally chartered partner banks and **FDIC** coverage via sweep network: mainly **Choice Financial Group** and **Evolve Bank & Trust**, with **Column N.A.** still in some legacy accounts. Mercury is not itself a bank; it is a fintech platform backed by those partner banks. If Mercury closes an account, the balance is typically returned **by paper check mailed to the account holder's registered address**, which can be a serious operational problem for non-residents; keep a secondary account (Relay, Wise Business, etc.) as contingency.
- **Wise** ships two clearly different products: **Wise Personal** and **Wise Business**. For an LLC you must open **Wise Business**, not the personal account. Important CRS nuance: a **Wise Business held by a US LLC sits outside CRS** because the account holder is a US entity and the US is not a CRS participant; the USD side operates via Wise US Inc. (FATCA perimeter, not CRS). In contrast, a **Wise Personal opened by an individual tax-resident in Spain** or another CRS jurisdiction **does trigger CRS reporting** via Wise Europe SA (Belgium) on that individual. Opening Wise for your LLC does not bring you into CRS through the LLC; a separate Wise Personal in your own name as a CRS-resident individual does report.
- **Wallester** (Estonia) is a European financial entity with an EMI/issuing-bank licence. Its European IBAN accounts **are within the Common Reporting Standard (CRS)** and therefore trigger automatic reporting to the tax administration of the holder's country of residence.
- **Payoneer** operates through European entities (Payoneer Europe Ltd, Ireland) that are also **in scope for CRS** for clients resident in participating jurisdictions.
- **Revolut Business**: when paired with a **US LLC**, the usual setup runs through Revolut Payments USA; European IBANs (Lithuanian, BE) **are not issued by default** to a US LLC, they are issued to European clients of the group's European bank. If you are offered a European IBAN, confirm exactly which legal entity it sits with and which regime it reports under.
- **Zero tax**: no LLC structure delivers "zero tax" if you live in a country with CFC/tax transparency or income attribution rules. What you achieve is **no double taxation** and **correct reporting at residence**, not elimination.
## We set it up without you losing a weekend

Thousands of freelancers and entrepreneurs already operate their US LLC fully legally and properly documented. At Exentax we handle the entire process: formation, banking, payment gateways, bookkeeping, <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> filings and compliance in your country of residence. Book a free consultation and we will tell you honestly whether the LLC makes sense for your case, with no absolute promises.<!-- exentax:execution-v2 -->
## Forms 720 and 721: the two filings that generate the most penalties for Spanish residents

Forms 720 (foreign assets) and 721 (foreign crypto) are the two informational filings that open the most penalty cases for Spanish residents with international structure. They generate no tax, but omission or incorrect filing triggers formal penalties. Here is what you need sorted.

- **Form 720: what to declare.** Bank accounts abroad, securities and shareholdings in foreign entities, and foreign real estate, when the aggregate balance in each block exceeds 50,000 EUR at December 31 or is the highest of the year. After declaring a block, you only file again if the balance grows by more than 20,000 EUR vs the last declared.
- **Form 721: crypto.** Specific for crypto balances held at foreign exchanges or platforms (Binance, Coinbase, Kraken, etc.). Threshold: 50,000 EUR at December 31 or year's highest. Filing window: January-March of the following year. Also applies to wallets managed by foreign providers.
- **Current penalty regime.** After the ECJ ruling of January 2022 (case C-788/19) and the subsequent reform, the old specific 720 penalty regime was declared contrary to EU law. Current penalties are those of the general LGT regime: formal for late or incomplete filing, substantive if deliberate concealment with associated tax liability is detected.
- **What is worth knowing.** A US LLC whose partner is a Spanish resident requires declaring the participation (form 720, "securities and shareholdings" block) when the threshold is exceeded. The LLC's bank accounts (Mercury, Wise) are not declared as the resident's own, but the tax authority may request them in an audit as supplementary information.

### What we are asked the most

**If the LLC is disregarded, are its accounts "mine" for the 720?** The tax authority often reads it that way: if the LLC is considered transparent and attributes income, the accounts may be treated as the holder's for reporting. Better to declare them or, at minimum, have them ready to deliver if asked.

**Does crypto in own wallet (Ledger, Trezor) go in the 721?** Not by default: 721 covers crypto held by third parties (exchanges, platforms). Self-custody wallets with own private key do not go in 721, but go in 714 (Wealth) if the balance exceeds the regional threshold.

At Exentax we review what you must declare (720, 721, 714) per your real situation, file on time and keep the history ordered so no audit finds gaps.
<!-- /exentax:execution-v2 -->

## How we work at Exentax

Our team specialises in international tax structures for residents of Spanish-speaking countries operating online businesses. We combine local knowledge of Spain, Andorra and Latin America with operational experience setting up entities in Delaware, Wyoming, Estonia and other jurisdictions. Every case starts with a free consultation in which we evaluate residency, activity and goals, and we honestly tell you whether the proposed structure makes sense or whether a simpler alternative is enough.

<!-- task9-2026-expansion -->
## Filing Modelo 720 step by step: form, boxes and worked examples

Beyond the legal framework, the question we hear every week in the office is the same one: "I have Wise, Mercury, a broker and some crypto, how do I file this without mistakes?". This block turns the regulation into a procedural tutorial for the **1 January to 31 March 2026** filing window.

### Access and reporting threshold

Modelo 720 is filed exclusively online at the AEAT Sede Electrónica using a digital certificate, DNIe or Cl@ve PIN. The duty to file is triggered when, on 31 December, the **block of foreign bank accounts** exceeds **EUR 50,000**, with the same independent rule applied to the **block of securities, insurance and annuities** and the **block of real estate**. In subsequent years, an increase above EUR 20,000 in any already declared block reopens the duty. The current doctrine derives from Ley 7/2012 and from CJEU judgment C-788/19 of 27 January 2022, which struck down the disproportionate penalty regime but kept the reporting obligation alive.

### Boxes that produce most filing errors

- **Type of return (1)**: select "informativa", "complementaria" or "sustitutiva". Mixing them up forces a full re-file.
- **Filer status code (2)**: holder, authorised user, beneficiary or representative. For a Wise Personal EUR account the code is holder; for a Wise Business or Mercury account belonging to your LLC, the holder is the company and you sign as representative.
- **Balance on 31 Dec (V) and last quarter average balance (M)**: both expressed in EUR using the official European Central Bank rate at 31 December 2025.
- **Institution and country ID**: tax ID of the institution if available, BIC code and ISO country code. Wise appears as Wise Payments Limited (UK) or Wise US Inc. depending on the product; Mercury runs through Choice Financial Group and Column N.A. in the United States.

### Worked example, block by block

Madrid based freelancer with: Wise EUR balance EUR 18,400, Mercury Personal Savings USD 22,300, Interactive Brokers portfolio EUR 41,000, Kraken with EUR 6,200 in BTC and ETH. Bank accounts block: 18,400 plus 22,300 USD at the ECB rate is roughly EUR 39,000, below the threshold, **no filing duty**. Securities block: EUR 41,000, below the threshold, **no filing duty**. Crypto block (Modelo 721): EUR 6,200, below EUR 50,000, **no filing duty**. If next year EUR 35,000 lands on Mercury, the bank block jumps to EUR 74,000 and triggers a Modelo 720 filing for that year.

### Mistakes that drive most sanctions

1. Skipping the Wise Business and Mercury accounts of the LLC when the owner is the beneficial owner.
2. Forgetting to refile after an increase above EUR 20,000 versus the previously filed 720.
3. Confusing the last quarter average balance with the full year average.
4. Filing late voluntarily without prior demand: penalties are mild but article 27 LGT surcharges still apply.

> **Is your stack flirting with the EUR 50,000 per block line?** Run your balances through the <strong>Exentax tax calculator</strong> and see whether moving to a properly declared LLC structure offsets the current operational complexity.

For the bank reporting layer that precedes Modelo 720, read <a href="/en/blog/do-us-bank-accounts-report-to-your-home-tax-authority-the">what US banks really report to your home tax authority</a>, and if your goal is minimising total tax, the map is in <a href="/en/blog/legal-paths-to-minimize-your-taxes">the legal paths to minimise your taxes</a>. If you would rather delegate the actual filing, <strong>book a call with the Exentax team</strong> and we close it in one week.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Want to discuss it now? Call us at <a href="tel:+34614916910">+34 614 916 910</a> or message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I'm%20reading%20%22If%20you%20are%20a%20Spanish%20tax%20resident%20and%20own%20a%20US%20LLC%2C%20a%20Wise%20or%20Mercury%20account%E2%80%A6%22%20and%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>

If you'd rather discuss it live, <a href="/en/book">book a free session</a> and we'll review your real case in thirty minutes.
<!-- /exentax:cta-conv-v1 -->

Book a free 30-minute consultation. We review your real situation and tell you what actually fits. <a href="/en/book">Book a free consultation</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Editorial review pending</strong> — The following references require manual verification against the official current source. If you spot a discrepancy, write to us and we will correct it within 24 hours.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">50.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…re tres bloques separados, cada uno con su propio umbral de 50.000 € agregados: | Bloque |…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">20.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…bloque concreto se ha producido un **incremento superior a 20.000 €** respecto al saldo de…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">5.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…el 720 fue uno de los más severos del ordenamiento europeo: 5.000 € por dato omitido (míni…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">10.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…del ordenamiento europeo: 5.000 € por dato omitido (mínimo 10.000 €), imprescriptibilidad …»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">150%</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…patrimonial no justificada (art. 39.2 LIRPF) y sanción del 150% sobre la cuota. La **Sente…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">120.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…(art. 305 CP) si la cuota defraudada en un ejercicio supera 120.000 €. La sentencia europe…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">30.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…de la LLC no cambia la obligación informativa. 3. **&quot;Tengo 30.000 € en Wise y 25.000 € en …»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…a la obligación informativa. 3. **&quot;Tengo 30.000 € en Wise y 25.000 € en Mercury, no llego …»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">55.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…al es **agregado** dentro de cada bloque. 30.000 + 25.000 = 55.000 € → obligado a declarar…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">100%</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…ut, brokers extranjeros o cripto fuera de España y no estás 100% seguro de tu posición fre…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…r&quot;&gt;OCDE&lt;/a&gt; con sus Comentarios. - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación chec…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §77…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">18.400</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…de un freelancer residente en Madrid con: Wise EUR balance 18.400 €, Mercury Personal Savi…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">22.300</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…id con: Wise EUR balance 18.400 €, Mercury Personal Savings 22.300 USD, broker Interactive…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">41.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…Savings 22.300 USD, broker Interactive Brokers con cartera 41.000 €, Kraken con 6.200 € en…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">6.200</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…broker Interactive Brokers con cartera 41.000 €, Kraken con 6.200 € en BTC y ETH. Bloque c…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">39.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…H. Bloque cuentas: 18.400 + 22.300 USD convertidos al BCE = 39.000 € aprox., por debajo de…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">35.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…mbral de 50.000 €, **no obliga**. Si al año siguiente añade 35.000 € a Mercury, el bloque …»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">74.000</span> <span class="opacity-70">(figure)</span> <span class="text-xs italic">— «…iguiente añade 35.000 € a Mercury, el bloque cuentas pasa a 74.000 € y dispara la obligaci…»</span> <strong>[NOT VERIFIED]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…U.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa F…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…cación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…superior a 50.000 € → **Modelo 721**. Si además operas con DAC8 recientemente, el cruce se…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…13 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(legal reference)</span> <span class="text-xs italic">— «…vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Conve…»</span> <strong>[REVISIÓN MANUAL — suggested source: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
