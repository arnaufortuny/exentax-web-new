// Single source of truth for display-currency FX rates.
// Consumed by client `calculator-config.ts` and server `email.ts` so
// the magnitudes the user sees in the UI match the magnitudes printed
// in the persistence layer and the calculator email.
export const FX_RATES_PER_EUR = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.86,
} as const;

export type DisplayCurrencyCode = keyof typeof FX_RATES_PER_EUR;

export function convertFromEUR(amountEur: number, code: string): number {
  const rate = (FX_RATES_PER_EUR as Record<string, number>)[code];
  return rate ? amountEur * rate : amountEur;
}
