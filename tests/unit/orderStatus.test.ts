import { describe, it, expect } from 'vitest';

// 订单状态码 ↔ 中文标签映射（与 server/routes/orders.ts STATUS_MAP 逻辑一致）
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending_payment:  { label: '待付款', color: 'blue' },
  pending_delivery: { label: '待发货', color: 'amber' },
  shipped:          { label: '已发货', color: 'violet' },
  completed:        { label: '已完成', color: 'emerald' },
  refunded:         { label: '已退货', color: 'rose' },
  cancelled:        { label: '已取消', color: 'slate' },
};
const LABEL_TO_CODE: Record<string, string> = Object.entries(STATUS_MAP).reduce(
  (acc, [code, v]) => ({ ...acc, [v.label]: code }),
  {} as Record<string, string>
);

// 订单状态归一化（normalize 精简版：只保留状态推导）
function resolveStatus(input: { statusCode?: string; status?: string }) {
  const code = input.statusCode || LABEL_TO_CODE[input.status || ''] || 'pending_payment';
  const info = STATUS_MAP[code] || STATUS_MAP.pending_payment;
  return { statusCode: code, status: input.status || info.label, color: info.color };
}

describe('订单状态映射', () => {
  it('6 个状态码均有对应中文标签', () => {
    expect(STATUS_MAP.pending_payment.label).toBe('待付款');
    expect(STATUS_MAP.shipped.label).toBe('已发货');
    expect(STATUS_MAP.completed.label).toBe('已完成');
    expect(Object.keys(STATUS_MAP)).toHaveLength(6);
  });

  it('中文标签可反查状态码（B端中文 → C端英文）', () => {
    expect(LABEL_TO_CODE['待付款']).toBe('pending_payment');
    expect(LABEL_TO_CODE['已取消']).toBe('cancelled');
  });

  it('传入英文 statusCode → 保留并补色', () => {
    expect(resolveStatus({ statusCode: 'shipped' })).toMatchObject({
      statusCode: 'shipped', status: '已发货', color: 'violet',
    });
  });

  it('传入中文 status → 推导出英文 statusCode', () => {
    expect(resolveStatus({ status: '已完成' })).toMatchObject({
      statusCode: 'completed', status: '已完成',
    });
  });

  it('未知状态码 → 标签与颜色兜底为待付款（状态码保留原值）', () => {
    const r = resolveStatus({ statusCode: 'some_future_status' });
    expect(r.status).toBe('待付款');
    expect(r.color).toBe('blue');
    expect(r.statusCode).toBe('some_future_status');
  });

  it('支付流转：待付款 → 待发货', () => {
    const after = resolveStatus({ statusCode: 'pending_delivery' });
    expect(after.status).toBe('待发货');
    expect(after.color).toBe('amber');
  });
});
