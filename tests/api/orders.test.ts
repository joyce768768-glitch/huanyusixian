import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('订单+支付+佣金 API', () => {
  let orderId: string;

  it('GET /api/orders → 返回订单数组', async () => {
    const res = await request(app).get('/api/orders?pageSize=10');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/orders → 创建订单成功', async () => {
    const res = await request(app).post('/api/orders').send({
      userId: 'USR-CLIENT-001',
      items: [{ productId: 'PRD-002', quantity: 1 }],
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    orderId = res.body.data.id;
  });

  it('POST /api/orders/:id/pay → 支付成功，佣金结算', async () => {
    const res = await request(app).post(`/api/orders/${orderId}/pay`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // 支付后状态变化
    expect(['pending_delivery', 'shipped', 'completed']).toContain(res.body.data.statusCode);
  });

  it('POST /api/orders/not-exist/pay → 404', async () => {
    const res = await request(app).post('/api/orders/ORD-NOTEXIST/pay');
    expect(res.status).toBe(404);
  });
});
