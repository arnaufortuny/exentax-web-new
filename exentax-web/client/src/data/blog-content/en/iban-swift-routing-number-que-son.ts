export default `IBAN, SWIFT, and Routing numbers. international payment systems use different identifiers in different countries. Understanding them prevents payment errors and ensures your money arrives quickly. Here's what each one is and when you need which.

## Routing Number (ABA Number)

**What it is:** A 9-digit code identifying a US bank in the ACH and wire transfer systems.

**When you use it:** For receiving US domestic payments (ACH transfers and domestic wires).

**Mercury's routing number:** 117201490 (Column NA, Mercury's banking partner)

**Important:** Mercury has two routing numbers. one for ACH and one for wire transfers. They may be different. Check your Mercury dashboard for the specific wire routing number.

**Format:** Always 9 digits, example: 117201490

## Account Number

**What it is:** The specific number identifying your account at the bank.

**When you use it:** Combined with the routing number for ACH and domestic wire transfers.

**For Mercury:** You receive a unique account number when your account is approved. Never share this publicly, only with specific clients who need to pay you.

## SWIFT/BIC Code

**What it is:** An 8-11 character code identifying a bank for international transfers. "SWIFT" (Society for Worldwide Interbank Financial Telecommunication) and "BIC" (Bank Identifier Code) are the same thing.

**When you use it:** For receiving international wire transfers from outside the US.

**Mercury's SWIFT details:** Mercury uses Column NA's SWIFT code for incoming international transfers. The specific code is provided in your Mercury account settings.

**Format:** Usually looks like "ABCDUS33". first 4 letters are bank code, next 2 are country code (US), last 2 are location code.

## IBAN (International Bank Account Number)

**What it is:** A standardized international account number format used primarily in Europe, Middle East, and other regions.

**The important thing to know:** The US does not use IBAN. US banks have routing numbers + account numbers instead of IBANs.

**For your Mercury account:** There is no IBAN. If someone asks for your IBAN and you're providing Mercury details, explain that US banks use routing number + account number instead.

**If you need an IBAN:** Wise Business provides IBAN account numbers in EUR, GBP, and other currencies. If European clients prefer to send to an IBAN, give them your Wise IBAN, then convert and send to Mercury.

## Providing payment details: the cheat sheet

**To receive USD via ACH from US clients:**
- Bank name: Column NA (Mercury's bank)
- Routing number: 117201490
- Account number: [your Mercury account number]
- Account type: Checking

**To receive USD via domestic wire:**
- Bank name: Column NA
- Routing number (wire): [see Mercury settings]
- Account number: [your Mercury account number]

**To receive USD via international wire:**
- Bank name: Column NA
- SWIFT/BIC: [see Mercury account settings]
- Routing number: [see Mercury settings]
- Account number: [your Mercury account number]
- Bank address: Column NA, San Francisco, CA

**To receive EUR, GBP, etc, from European clients:**
- Use your Wise Business IBAN for that currency
- Convert to USD and send to Mercury via ACH (free)

## Common mistakes to avoid

- **Giving ACH routing number for wire transfers:** They can be different. Check Mercury settings.
- **Providing IBAN when asked for routing number:** The US doesn't use IBAN. Provide routing + account number.
- **Sharing account details publicly:** Only share with specific clients who need to pay you.
- **Not specifying bank address for international wires:** Always include "Column NA, San Francisco, CA" for international wires.

## Quick reference table

| Identifier | Format | Used for | Where to find |
|---|---|---|---|
| Routing (ACH) | 9 digits | US domestic ACH | Mercury dashboard |
| Routing (Wire) | 9 digits | US domestic wire | Mercury settings |
| Account Number | Variable | All US transfers | Mercury dashboard |
| SWIFT/BIC | 8-11 chars | International wires | Mercury settings |
| IBAN | 15-34 chars | European transfers | Wise Business |

## How each payment method works in practice

### Receiving a wire from a US client
1. Client asks for your payment details
2. You share: Bank name (Mercury/Column NA), Routing number, Account number, LLC name
3. Client initiates domestic wire ($0 fee on your end)
4. Funds arrive same day or next business day
5. Mercury sends you push notification

### Receiving an international wire from a European client
1. Client asks for payment details
2. Option A: Share Mercury SWIFT details (USD wire, 1-3 days, client pays ~$25-50 in bank fees)
3. Option B: Share Wise EUR account details (client pays locally in EUR, you convert to USD at 0.4% fee)
4. Option C: Send Stripe invoice (client pays by card, 2.9% + $0.30 fee, funds arrive in 2 days)
5. Best option depends on amount: wires for $5K+, Stripe for smaller amounts

### Collecting via Stripe payment link
1. Create payment link in Stripe Dashboard (amount, description, currency)
2. Share link with client via email
3. Client pays with card in their local currency
4. Stripe converts to USD and deposits to Mercury in 2 business days
5. Net received: invoice amount minus 2.9% + $0.30 (+ 1.5% for international cards)

If something in this structure left you wanting more detail, <a href="/en/blog/ach-vs-wire-transfer-timelines-for-your-llc">ACH vs wire transfer: payment timelines and what they mean for your LLC cash flow</a> and <a href="/en/blog/how-to-scale-your-digital-business-with-a-us-llc">How to scale your digital business with a US LLC</a> dive into neighbouring pieces of the puzzle we usually keep for separate write-ups.

## Payment method decision matrix

| Factor | Wire (Mercury) | ACH | Stripe | Wise |
|---|---|---|---|---|
| Best for amount | $5,000+ | $1,000-10,000 | Any | $500-5,000 |
| Speed | Same/next day | 1-3 days | 2 days | 1-2 days |
| Fee to you | $0 | $0 | 2.9% + $0.30 | 0.4-1.5% (if converting) |
| Fee to client | $0-25 (domestic) / $25-50 (intl) | $0 | 0% (card fee may apply) | Minimal |
| Client effort | Needs your bank details | Needs routing + account | Click link, enter card | Needs your Wise details |
| Professional appearance | Standard | Standard | Branded checkout page | Standard |

At Exentax we configure all your collection channels from day one and prepare a payment details sheet you can share with clients. Book your strategic consultation.`;
