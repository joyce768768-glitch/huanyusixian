import { describe, it, expect } from 'vitest';

// 佣金计算（与 server/routes/orders.ts settleCommission 核心公式一致）
function calcCommission(totalAmount: number, rateStr: string): number {
  const rate = parseFloat(rateStr) / 100;
  if (!rate || rate <= 0) return 0;
  return Math.round(totalAmount * rate * 100) / 100;
}

describe('佣金计算', () => {
  it('15% 佣金率，totalAmount=206 → 30.9', () => {
    expect(calcCommission(206, '15%')).toBe(30.9);
  });

  it('10% 佣金率，totalAmount=100 → 10', () => {
    expect(calcCommission(100, '10%')).toBe(10);
  });

  it('0% 佣金率 → 0', () => {
    expect(calcCommission(100, '0%')).toBe(0);
  });

  it('佣金率为空 → 0', () => {
    expect(calcCommission(100, '')).toBe(0);
  });

  it('金额小数四舍五入：100 * 15% = 15', () => {
    expect(calcCommission(100, '15%')).toBe(15);
  });

  it('小额精度：33.33 * 10% = 3.33', () => {
    expect(calcCommission(33.33, '10%')).toBe(3.33);
  });
});
