import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('优惠券 API', () => {
  it('GET /api/coupons → 返回我的优惠券列表', async () => {
    const res = await request(app).get('/api/coupons');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/coupons?status=unused → 只返回未使用券', async () => {
    const res = await request(app).get('/api/coupons?status=unused');
    expect(res.status).toBe(200);
    expect(res.body.data.every((c: any) => c.status === 'unused')).toBe(true);
  });

  it('GET /api/coupons?status=used → 只返回已使用券', async () => {
    const res = await request(app).get('/api/coupons?status=used');
    expect(res.status).toBe(200);
    expect(res.body.data.every((c: any) => c.status === 'used')).toBe(true);
  });

  it('POST /api/coupons/receive → 按活动领券成功', async () => {
    const res = await request(app).post('/api/coupons/receive').send({ activityId: 'MKT-001' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('unused');
    expect(res.body.data.amount).toBe(20); // MKT-001 reward ¥20
    expect(res.body.data.validTo >= new Date().toISOString().slice(0, 10)).toBe(true);
  });

  it('POST /api/coupons/receive 活动不存在 → 404', async () => {
    const res = await request(app).post('/api/coupons/receive').send({ activityId: 'MKT-NOPE' });
    expect(res.status).toBe(404);
  });

  it('POST /api/coupons/new-user-gift → 新人礼包发两张券', async () => {
    const res = await request(app).post('/api/coupons/new-user-gift');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].minSpend).toBe(99);
    expect(res.body.data[1].discountType).toBe('shipping');
  });
});
