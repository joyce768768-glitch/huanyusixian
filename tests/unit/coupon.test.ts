import { describe, it, expect } from 'vitest';

// 优惠券抵扣金额计算（与 server/routes/orders.ts applyCoupon 逻辑一致）
function applyCoupon(
  totalAmount: number,
  coupon?: { id: string; discountType: string; amount?: number; minSpend?: number; status: string }
): number {
  if (!coupon) return 0;
  if (coupon.status !== 'unused') return 0;
  if (coupon.minSpend && totalAmount < coupon.minSpend) return 0;
  let discount = 0;
  if (coupon.discountType === 'amount') discount = coupon.amount || 0;
  else if (coupon.discountType === 'shipping') discount = 15;
  return Math.min(discount, totalAmount);
}

describe('优惠券计算', () => {
  it('满减券满足门槛 → 正确抵扣', () => {
    const coupon = { id: 'C1', discountType: 'amount', amount: 20, minSpend: 99, status: 'unused' };
    expect(applyCoupon(128, coupon)).toBe(20);
  });

  it('满减券不满足门槛 → 抵扣0', () => {
    const coupon = { id: 'C1', discountType: 'amount', amount: 20, minSpend: 99, status: 'unused' };
    expect(applyCoupon(50, coupon)).toBe(0);
  });

  it('运费券 → 抵扣15', () => {
    const coupon = { id: 'C2', discountType: 'shipping', status: 'unused' };
    expect(applyCoupon(128, coupon)).toBe(15);
  });

  it('券金额超过原价 → 不超原价', () => {
    const coupon = { id: 'C3', discountType: 'amount', amount: 100, status: 'unused' };
    expect(applyCoupon(50, coupon)).toBe(50);
  });

  it('已使用券 → 抵扣0', () => {
    const coupon = { id: 'C1', discountType: 'amount', amount: 20, minSpend: 99, status: 'used' };
    expect(applyCoupon(128, coupon)).toBe(0);
  });

  it('无券 → 抵扣0', () => {
    expect(applyCoupon(128)).toBe(0);
  });
});
