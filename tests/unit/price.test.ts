import { describe, it, expect } from 'vitest';

// 金额格式化（与 server/routes/orders.ts amount 字段生成逻辑一致）
function formatYuan(n: number): string {
  return `¥${Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`;
}

// 佣金金额：保留两位小数并四舍五入（与 settleCommission 一致）
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// 通用分页切片（与各列表路由 page/pageSize 逻辑一致）
function paginate<T>(list: T[], page: number, pageSize: number) {
  const total = list.length;
  const start = (page - 1) * pageSize;
  return {
    data: list.slice(start, start + pageSize),
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

describe('金额与分页工具', () => {
  it('金额格式化为人民币 + 千分位 + 两位小数', () => {
    expect(formatYuan(128)).toBe('¥128.00');
    expect(formatYuan(146450)).toBe('¥146,450.00');
  });

  it('佣金四舍五入保留两位', () => {
    expect(round2(128 * 0.1)).toBe(12.8);
    expect(round2(33.333 * 0.1)).toBe(3.33);
    expect(round2(0.005)).toBe(0.01);
  });

  it('10% / 15% / 20% 佣金比例计算', () => {
    expect(round2(200 * 0.1)).toBe(20);
    expect(round2(200 * 0.15)).toBe(30);
    expect(round2(199.99 * 0.2)).toBe(40);
  });

  it('分页：第1页取前 N 条', () => {
    const r = paginate([1, 2, 3, 4, 5], 1, 2);
    expect(r.data).toEqual([1, 2]);
    expect(r.pagination.totalPages).toBe(3);
  });

  it('分页：末页不足一页', () => {
    const r = paginate([1, 2, 3, 4, 5], 3, 2);
    expect(r.data).toEqual([5]);
  });

  it('分页：超出范围返回空数组但 totalPages 正确', () => {
    const r = paginate([1, 2], 9, 2);
    expect(r.data).toEqual([]);
    expect(r.pagination.totalPages).toBe(1);
  });
});
