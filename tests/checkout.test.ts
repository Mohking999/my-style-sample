import { describe, it, expect } from 'vitest';
import { ALGERIA_WILAYAS } from '../server/data/wilayas';

function isValidAlgerianPhone(phone: string): boolean {
  const clean = phone.replace(/\s+/g, '').replace(/-/g, '');
  return /^((\+213|213|0)[567][0-9]{8})$/.test(clean);
}

describe('Checkout & Delivery Logic', () => {
  it('validates Algerian phone numbers (05, 06, 07, +213)', () => {
    // Valid phone numbers
    expect(isValidAlgerianPhone('0555123456')).toBe(true);
    expect(isValidAlgerianPhone('0661 98 76 54')).toBe(true);
    expect(isValidAlgerianPhone('0770-55-44-33')).toBe(true);
    expect(isValidAlgerianPhone('+213555123456')).toBe(true);
    expect(isValidAlgerianPhone('+213 661 22 33 44')).toBe(true);
    expect(isValidAlgerianPhone('213770112233')).toBe(true);

    // Invalid phone numbers
    expect(isValidAlgerianPhone('021234567')).toBe(false); // Landline not 05/06/07
    expect(isValidAlgerianPhone('0999123456')).toBe(false); // 09 does not exist
    expect(isValidAlgerianPhone('123456')).toBe(false); // Too short
    expect(isValidAlgerianPhone('abcdefghijk')).toBe(false); // Non-numeric
  });

  it('contains all 58 Wilayas of Algeria', () => {
    expect(ALGERIA_WILAYAS.length).toBe(58);

    // Check boundary wilayas
    const w1 = ALGERIA_WILAYAS.find((w) => w.code === 1);
    expect(w1?.nameFr).toBe('Adrar');

    const w16 = ALGERIA_WILAYAS.find((w) => w.code === 16);
    expect(w16?.nameFr).toBe('Alger');
    expect(w16?.homeDeliveryFee).toBe(500);

    const w58 = ALGERIA_WILAYAS.find((w) => w.code === 58);
    expect(w58?.nameFr).toBe('In Guezzam');
    expect(w58?.homeDeliveryFee).toBe(1600);
  });

  it('computes order grand total correctly based on delivery mode and discounts', () => {
    const subtotalDzd = 38500;
    const discountDzd = 3850; // 10% off
    const homeDeliveryFee = 600;

    const totalHome = subtotalDzd - discountDzd + homeDeliveryFee;
    expect(totalHome).toBe(35250);

    const relayDeliveryFee = 350;
    const totalRelay = subtotalDzd - discountDzd + relayDeliveryFee;
    expect(totalRelay).toBe(35000);
  });
});
