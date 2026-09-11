import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('财务 API', () => {
  it('GET /api/finance → 返回账单+汇总字段完整', async () => {
    const res = await request(app).get('/api/finance?pageSize=10');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.summary).toMatchObject({
      totalIncome: expect.any(Number),
      totalExpense: expect.any(Number),
      netProfit: expect.any(Number),
    });
  });

  it('GET /api/finance?category=income → 只返回收入类记录', async () => {
    const res = await request(app).get('/api/finance').query({ category: 'income', pageSize: 100 });
    expect(res.status).toBe(200);
    expect(res.body.data.every((r: any) => r.amount > 0)).toBe(true);
  });

  it('GET /api/finance?category=expense → 只返回支出类记录', async () => {
    const res = await request(app).get('/api/finance').query({ category: 'expense', pageSize: 100 });
    expect(res.status).toBe(200);
    expect(res.body.data.every((r: any) => r.amount < 0)).toBe(true);
  });

  it('GET /api/finance?keyword → 按类型/描述搜索', async () => {
    const res = await request(app).get('/api/finance').query({ keyword: '佣金', pageSize: 100 });
    expect(res.status).toBe(200);
    expect(res.body.data.every((r: any) =>
      r.type.includes('佣金') || r.description.includes('佣金')
    )).toBe(true);
  });

  it('GET /api/finance → 汇总计算正确：净收入=收入-支出', async () => {
    const res = await request(app).get('/api/finance').query({ pageSize: 100 });
    const { totalIncome, totalExpense, netProfit } = res.body.summary;
    expect(netProfit).toBeCloseTo(totalIncome - totalExpense, 2);
  });

  it('POST /api/finance → 创建收入记录', async () => {
    const before = await request(app).get('/api/finance').query({ pageSize: 1, category: 'income' });
    const incomeBefore = before.body.summary.totalIncome;

    const res = await request(app).post('/api/finance').send({
      type: '测试收入', amount: 888, description: '自动化测试收入',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.category).toBe('income');
    expect(res.body.data.amount).toBe(888);

    const after = await request(app).get('/api/finance').query({ pageSize: 1, category: 'income' });
    expect(after.body.summary.totalIncome).toBeCloseTo(incomeBefore + 888, 2);
  });

  it('POST /api/finance → 创建支出记录 category 为 expense', async () => {
    const res = await request(app).post('/api/finance').send({
      type: '测试支出', amount: -100,
    });
    expect(res.status).toBe(200);
    expect(res.body.data.category).toBe('expense');
  });

  it('POST /api/finance 缺 type 或 amount → 400', async () => {
    const r1 = await request(app).post('/api/finance').send({ amount: 100 });
    expect(r1.status).toBe(400);
    const r2 = await request(app).post('/api/finance').send({ type: 'x' });
    expect(r2.status).toBe(400);
  });
});
