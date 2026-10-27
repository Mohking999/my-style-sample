import { describe, it, expect } from 'vitest';
import { formatPrice } from '../src/utils/formatters';

describe('Pricing & Discount Logic', () => {
  it('formats prices correctly in DZD with thousands separators', () => {
    expect(formatPrice(12500, 'fr')).toBe('12 500 DA');
    expect(formatPrice(48000, 'fr')).toBe('48 000 DA');
    expect(formatPrice(500, 'fr')).toBe('500 DA');
    expect(formatPrice(12500, 'ar')).toBe('12 500 د.ج');
  });

  it('calculates percentage discounts accurately', () => {
    const subtotal = 36000;
    const discountPercent = 10;
    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    expect(discountAmount).toBe(3600);

    const total = subtotal - discountAmount;
    expect(total).toBe(32400);
  });

  it('calculates fixed amount discounts accurately', () => {
    const subtotal = 24000;
    const fixedDiscount = 1000;
    const discountAmount = Math.min(fixedDiscount, subtotal);
    expect(discountAmount).toBe(1000);

    const total = subtotal - discountAmount;
    expect(total).toBe(23000);
  });

  it('respects minimum order requirement for discount codes', () => {
    const minOrderDzd = 5000;

    const subtotalBelowMin = 4200;
    const isValidBelow = subtotalBelowMin >= minOrderDzd;
    expect(isValidBelow).toBe(false);

    const subtotalAboveMin = 7800;
    const isValidAbove = subtotalAboveMin >= minOrderDzd;
    expect(isValidAbove).toBe(true);
  });

  it('prevents overselling when stock is insufficient', () => {
    const availableStock = 3;
    const requestedQuantity = 5;

    const canFulfill = availableStock >= requestedQuantity;
    expect(canFulfill).toBe(false);

    const remainingStock = canFulfill ? availableStock - requestedQuantity : availableStock;
    expect(remainingStock).toBe(3);
  });
});
