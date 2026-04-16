export default `Understanding payment timing helps you manage cash flow effectively. Here's a complete guide to how long different payment methods take with your LLC.

## ACH payment timelines

ACH (Automated Clearing House) payments are processed in batches throughout the business day.

**Standard ACH (next-day or 2-3 business days):**
- Most common type
- Funds available next business day or within 2-3 days
- Free on Mercury
- Only works between US bank accounts

**Same-day ACH:**
- Available for transfers submitted before 2:30 PM ET on business days
- Funds available same day
- May have a small fee at some banks (free on Mercury for most transfers)

**Important:** ACH only processes on US business days (Monday-Friday, excluding federal holidays). A payment sent Friday afternoon may not process until Tuesday.

## Wire transfer timelines

**Domestic wire (US to US):**
- Submitted before cutoff time: same business day
- After cutoff time: next business day
- Mercury cutoff: approximately 5:00 PM ET
- Free on Mercury (both sending and receiving)

**International wire:**
- Varies significantly by destination country
- Europe (SEPA-connected): 1-2 business days
- Latin America: 1-5 business days
- Asia: 2-5 business days
- Africa/Middle East: 2-7 business days
- **All free on Mercury**: $0 for sending and receiving, domestic and international
- May involve intermediary banks which can add delays

## Stripe payouts to Mercury

When you receive card payments through Stripe:
- Standard payout: 2 business days after payment received
- Instant payout: Available (small fee of 1%, min $0.50)
- Stripe deposits accumulate over 24 hours and pay out in one daily lump sum
- Weekend/holiday payments process on the next business day

## PayPal to Mercury

PayPal to bank transfers:
- Standard: 1-3 business days
- Instant transfer: Small fee (typically 1.5%, min $0.25)

## Wise transfers

Wise business transfers:
- To another Wise account: Usually instant
- To bank accounts: 1-2 business days (most major currencies)
- Some currency pairs: Same day
- Fees: Small conversion fee (0.4-1.5%)

## Payment details for your clients

**For US clients paying via ACH:**
- Bank: Column NA (Mercury's banking partner)
- Routing Number (ACH): 117201490
- Account Number: [your Mercury account number]

**For US clients paying via domestic wire:**
- Routing Number (Wire): [see Mercury settings. different from ACH routing]
- Account Number: [your Mercury account number]

**For international clients paying via wire:**
- SWIFT Code: [see Mercury account settings]
- Bank Address: Column NA, San Francisco, CA
- Account Number: [your Mercury account number]

**For European clients preferring SEPA:**
- Use your Wise Business IBAN for EUR receipts
- Convert to USD in Wise
- Transfer to Mercury via free ACH

Mercury has $0 wire fees, both domestic and international. Your funds are held in Column NA with FDIC insurance.

## Managing cash flow with these timelines

**For predictable monthly retainer clients:** Set up recurring ACH or wire transfers. Know exactly when to expect payment.

**For project-based billing:** Invoice 7-10 days before you need the money. Give yourself buffer for payment processing.

**For unexpected urgent needs:** Mercury instant transfers to other Mercury accounts are immediate. Stripe instant payouts give same-day access.

**Currency conversion timing:** Convert currency through Wise when rates are favorable, not when you urgently need the money.

## Payment method summary

| Method | Timeline | Fee (Mercury) | Best for |
|---|---|---|---|
| ACH | 1-3 business days | Free | US recurring payments |
| Domestic wire | Same day | Free | Urgent US payments |
| International wire | 1-7 business days | Free | International clients |
| Stripe payout | 2 business days | Free (standard) | Card payments |
| Wise transfer | 1-2 business days | 0.4-1.5% | Currency conversion |

## IBAN vs. SWIFT vs. Routing Number: when to use each

| Scenario | What to share | Platform | Example |
|---|---|---|---|
| US client pays you | Routing + Account number | Mercury | ABA: 091311229, Acct: 8XXXXXXXXX |
| European client pays in EUR | IBAN | Wise Business | DE89 3704 0044 0532 0130 00 |
| UK client pays in GBP | Sort code + Account | Wise Business | 23-14-70 / 12345678 |
| International client pays in USD | SWIFT + Account | Mercury | SWIFT: CLNOUSPAXXX |
| Client wants to pay by card | Stripe payment link | Stripe | stripe.com/pay/XXXXX |
| B2C customer buys your product | Checkout page | DoDo Payments | Automatic |

## Common payment collection mistakes

1. **Sharing personal bank details**: Always share LLC (Mercury) banking details, never personal
2. **Using your local IBAN for USD collection**: Use Mercury for USD, Wise for local currencies
3. **Not specifying currency**: Always state the currency on invoices (USD recommended)
4. **Forgetting wire reference**: Ask clients to include invoice number in wire memo
5. **Not following up on pending payments**: Mercury shows pending ACH/wire; follow up if delayed


Closing out, here are related pieces that sit naturally next to this article: <a href="/en/blog/your-first-month-with-a-us-llc-what-to-expect-week-by-week">Your first month with a US LLC: what to expect week by week</a> and <a href="/en/blog/changing-currencies-for-your-llc-best-options-and-how-to-avoid-hidden-fees">Changing currencies for your LLC: best options and how to avoid hidden fees</a> help round off the context.

## Related articles

- <a href="/en/blog/how-to-open-a-mercury-account-for-your-llc-from-any-country">Mercury account guide</a>
- <a href="/en/blog/wise-business-with-your-llc-the-complete-guide-to-multi-currency-management">Wise Business guide</a>
At Exentax we configure all your collection channels from day one. We tell you exactly which details to give to each type of client so the money arrives fast and without surprises. Book your strategic consultation.`;
