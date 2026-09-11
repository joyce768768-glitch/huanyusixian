import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('购物车 API', () => {
  beforeAll(async () => {
    // 每个测试文件独立内存，先清空保证起点干净
    await request(app).delete('/api/cart');
  });

  afterAll(async () => {
    await request(app).delete('/api/cart');
  });

  it('GET /api/cart → 返回数组', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/cart/count → 初始计数为 0', async () => {
    const res = await request(app).get('/api/cart/count');
    expect(res.status).toBe(200);
    expect(res.body.data.count).toBe(0);
  });

  it('POST /api/cart 缺 productId → 400', async () => {
    const res = await request(app).post('/api/cart').send({ quantity: 1 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/cart 商品不存在 → 404', async () => {
    const res = await request(app).post('/api/cart').send({ productId: 'NOT-EXIST' });
    expect(res.status).toBe(404);
  });

  it('POST /api/cart → 加购成功并返回带商品详情的列表', async () => {
    const res = await request(app).post('/api/cart').send({ productId: 'PRD-001', quantity: 2 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const item = res.body.data.find((c: any) => c.productId === 'PRD-001');
    expect(item).toBeTruthy();
    expect(item.quantity).toBe(2);
    expect(item.product).toBeTruthy();
  });

  it('重复加购同商品 → 数量累加而非新增', async () => {
    await request(app).post('/api/cart').send({ productId: 'PRD-001', quantity: 1 });
    const res = await request(app).get('/api/cart');
    const items = res.body.data.filter((c: any) => c.productId === 'PRD-001');
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it('GET /api/cart/count → 计数随加购更新', async () => {
    const res = await request(app).get('/api/cart/count');
    expect(res.body.data.count).toBe(3);
  });

  it('PUT /api/cart/:id → 修改数量/选中状态', async () => {
    const list = await request(app).get('/api/cart');
    const item = list.body.data.find((c: any) => c.productId === 'PRD-001');
    const res = await request(app).put(`/api/cart/${item.id}`).send({ quantity: 5, selected: false });
    expect(res.status).toBe(200);
    const updated = res.body.data.find((c: any) => c.id === item.id);
    expect(updated.quantity).toBe(5);
    expect(updated.selected).toBe(false);
    // 改回选中以便后续结算
    await request(app).put(`/api/cart/${item.id}`).send({ selected: true });
  });

  it('PUT /api/cart/:id 不存在 → 404', async () => {
    const res = await request(app).put('/api/cart/CI-NOPE').send({ quantity: 1 });
    expect(res.status).toBe(404);
  });

  it('POST /api/cart/checkout → 结算生成订单并清空购物车', async () => {
    const res = await request(app).post('/api/cart/checkout').send({});
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.statusCode).toBe('pending_payment');
    expect(res.body.data.totalAmount).toBeGreaterThan(0);
    // 购物车被清空
    const after = await request(app).get('/api/cart/count');
    expect(after.body.data.count).toBe(0);
  });

  it('POST /api/cart/checkout 空购物车 → 400', async () => {
    const res = await request(app).post('/api/cart/checkout').send({});
    expect(res.status).toBe(400);
  });

  it('DELETE /api/cart/:id → 删除单项', async () => {
    await request(app).post('/api/cart').send({ productId: 'PRD-002', quantity: 1 });
    const list = await request(app).get('/api/cart');
    const item = list.body.data.find((c: any) => c.productId === 'PRD-002');
    const res = await request(app).delete(`/api/cart/${item.id}`);
    expect(res.status).toBe(200);
    const stillThere = res.body.data.some((c: any) => c.id === item.id);
    expect(stillThere).toBe(false);
  });

  it('DELETE /api/cart/:id 不存在 → 404', async () => {
    const res = await request(app).delete('/api/cart/CI-NOPE');
    expect(res.status).toBe(404);
  });
});
