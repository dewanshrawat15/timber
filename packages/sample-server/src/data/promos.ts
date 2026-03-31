export interface PromoCode {
  code: string;
  discountPct: number;
  description: string;
}

export const PROMO_CODES: Record<string, PromoCode> = {
  TIMBER10: { code: 'TIMBER10', discountPct: 10, description: '10% off your order' },
  SAVE20:   { code: 'SAVE20',   discountPct: 20, description: '20% off your order' },
  NEWUSER:  { code: 'NEWUSER',  discountPct: 15, description: '15% off for new users' },
};

export function validatePromo(code: string): PromoCode | null {
  return PROMO_CODES[code.trim().toUpperCase()] ?? null;
}
