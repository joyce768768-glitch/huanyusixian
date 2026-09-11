import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('钱包 API', () => {
  it('GET /api/wallet → 返回余额概览', async () => {
    const res = await request(app).get('/api/wallet');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('balance');
  });

  it('POST /api/wallet/recharge → 充值成功并返回订单号', async () => {
    const before = await request(app).get('/api/wallet');
    const res = await request(app).post('/api/wallet/recharge').send({ amount: 100 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderId).toMatch(/^RC-/);
    const after = await request(app).get('/api/wallet');
    expect(after.body.data.balance).toBeCloseTo(before.body.data.balance + 100, 2);
  });

  it('POST /api/wallet/recharge 非法金额 → 400', async () => {
    const r1 = await request(app).post('/api/wallet/recharge').send({ amount: 0 });
    expect(r1.status).toBe(400);
    const r2 = await request(app).post('/api/wallet/recharge').send({ amount: -50 });
    expect(r2.status).toBe(400);
  });

  it('POST /api/wallet/withdraw → 提现成功扣减余额', async () => {
    await request(app).post('/api/wallet/recharge').send({ amount: 500 });
    const before = await request(app).get('/api/wallet');
    const res = await request(app).post('/api/wallet/withdraw').send({ amount: 100, account: '招商银行 6222****' });
    expect(res.status).toBe(200);
    const after = await request(app).get('/api/wallet');
    expect(after.body.data.balance).toBeCloseTo(before.body.data.balance - 100, 2);
  });

  it('POST /api/wallet/withdraw 余额不足 → 400', async () => {
    const res = await request(app).post('/api/wallet/withdraw').send({ amount: 99999999 });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('余额');
  });

  it('GET /api/wallet/transactions → 明细分页', async () => {
    const res = await request(app).get('/api/wallet/transactions?page=1&pageSize=5');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toMatchObject({ page: 1, pageSize: 5 });
  });

  it('GET /api/wallet/transactions?type=income → 只返回收入', async () => {
    const res = await request(app).get('/api/wallet/transactions?type=income');
    expect(res.status).toBe(200);
    expect(res.body.data.every((t: any) => t.type === 'income')).toBe(true);
  });
});
