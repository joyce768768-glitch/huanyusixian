import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('订单全流程 API（下单→选券抵扣→支付→收货/取消）', () => {
  it('POST /api/orders 空 items → 400', async () => {
    const res = await request(app).post('/api/orders').send({ items: [] });
    expect(res.status).toBe(400);
  });

  it('POST /api/orders → 不带券下单金额=原价', async () => {
    const res = await request(app).post('/api/orders').send({
      items: [{ productId: 'PRD-006', quantity: 1 }], // 88 元
    });
    expect(res.status).toBe(200);
    expect(res.body.data.totalAmount).toBe(88);
    expect(res.body.data.discount).toBe(0);
    expect(res.body.data.statusCode).toBe('pending_payment');
  });

  it('POST /api/orders 带 CP-001（满99减20）→ 128 元抵扣 20 元', async () => {
    const res = await request(app).post('/api/orders').send({
      items: [{ productId: 'PRD-001', quantity: 1 }], // 128 元
      couponId: 'CP-001',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.originalAmount).toBe(128);
    expect(res.body.data.discount).toBe(20);
    expect(res.body.data.totalAmount).toBe(108);
  });

  it('POST /api/orders 券不满足门槛 → 不抵扣', async () => {
    const res = await request(app).post('/api/orders').send({
      items: [{ productId: 'PRD-006', quantity: 1 }], // 88 元
      couponId: 'CP-002', // 满199减50，不满足
    });
    expect(res.status).toBe(200);
    expect(res.body.data.discount).toBe(0);
    expect(res.body.data.totalAmount).toBe(88);
  });

  it('GET /api/orders?status=待付款 → 兼容中文状态过滤', async () => {
    const res = await request(app).get('/api/orders').query({ status: '待付款', pageSize: 50 });
    expect(res.status).toBe(200);
    expect(res.body.data.every((o: any) => o.statusCode === 'pending_payment')).toBe(true);
  });

  it('GET /api/orders?status=completed → 英文状态码过滤', async () => {
    const res = await request(app).get('/api/orders').query({ status: 'completed', pageSize: 50 });
    expect(res.status).toBe(200);
    expect(res.body.data.every((o: any) => o.statusCode === 'completed')).toBe(true);
  });

  it('GET /api/orders?keyword → 按商品/订单号搜索', async () => {
    const res = await request(app).get('/api/orders').query({ keyword: 'LR', pageSize: 50 });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/orders/:id → 订单详情', async () => {
    const created = await request(app).post('/api/orders').send({
      items: [{ productId: 'PRD-007', quantity: 1 }],
    });
    const id = created.body.data.id;
    const res = await request(app).get(`/api/orders/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });

  it('GET /api/orders/:id 不存在 → 404', async () => {
    const res = await request(app).get('/api/orders/ORD-NOPE');
    expect(res.status).toBe(404);
  });

  it('PUT /api/orders/:id/status → 中文状态更新', async () => {
    const created = await request(app).post('/api/orders').send({
      items: [{ productId: 'PRD-007', quantity: 1 }],
    });
    const id = created.body.data.id;
    const res = await request(app).put(`/api/orders/${id}/status`).send({ status: '已发货' });
    expect(res.status).toBe(200);
    expect(res.body.data.statusCode).toBe('shipped');
    expect(res.body.data.status).toBe('已发货');
  });

  it('支付后上级分销商佣金增加（DIS-001）', async () => {
    const distBefore = await request(app).get('/api/distributors/DIS-001');
    const revenueBefore = Number(distBefore.body.data.revenue) || 0;
    const rate = parseFloat(String(distBefore.body.data.rate || '10%')) / 100;

    const created = await request(app).post('/api/orders').send({
      items: [{ productId: 'PRD-005', quantity: 1 }], // 168 元，distId 默认 DIS-001
    });
    const id = created.body.data.id;
    const total = created.body.data.totalAmount;
    await request(app).post(`/api/orders/${id}/pay`);

    const distAfter = await request(app).get('/api/distributors/DIS-001');
    const revenueAfter = Number(distAfter.body.data.revenue) || 0;
    expect(revenueAfter - revenueBefore).toBeCloseTo(Math.round(total * rate * 100) / 100, 2);
  });

  it('下单→支付→确认收货 完整状态流转', async () => {
    const created = await request(app).post('/api/orders').send({
      items: [{ productId: 'PRD-002', quantity: 1 }],
    });
    const id = created.body.data.id;

    const pay = await request(app).post(`/api/orders/${id}/pay`);
    expect(pay.body.data.statusCode).toBe('pending_delivery');

    const receive = await request(app).post(`/api/orders/${id}/receive`);
    expect(receive.status).toBe(200);
    expect(receive.body.data.statusCode).toBe('completed');
  });

  it('下单→取消订单 状态变为 cancelled', async () => {
    const created = await request(app).post('/api/orders').send({
      items: [{ productId: 'PRD-002', quantity: 1 }],
    });
    const id = created.body.data.id;
    const res = await request(app).post(`/api/orders/${id}/cancel`);
    expect(res.status).toBe(200);
    const detail = await request(app).get(`/api/orders/${id}`);
    expect(detail.body.data.statusCode).toBe('cancelled');
  });

  it('POST /api/orders/:id/cancel 不存在 → 404', async () => {
    const res = await request(app).post('/api/orders/ORD-NOPE/cancel');
    expect(res.status).toBe(404);
  });

  it('POST /api/orders/:id/receive 不存在 → 404', async () => {
    const res = await request(app).post('/api/orders/ORD-NOPE/receive');
    expect(res.status).toBe(404);
  });
});
