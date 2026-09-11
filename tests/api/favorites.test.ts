import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('收藏 API', () => {
  afterAll(async () => {
    // 还原：确保测试商品未被收藏
    await request(app).delete('/api/favorites/PRD-007');
  });

  it('GET /api/favorites返回收藏列表（数组）', async () => {
    const res = await request(app).get('/api/favorites');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/favorites 缺 productId → 400', async () => {
    const res = await request(app).post('/api/favorites').send({});
    expect(res.status).toBe(400);
  });

  it('POST /api/favorites 商品不存在 → 404', async () => {
    const res = await request(app).post('/api/favorites').send({ productId: 'PRD-NOPE' });
    expect(res.status).toBe(404);
  });

  it('POST /api/favorites/toggle → 未收藏→收藏→取消 两次切换', async () => {
    // 先确保未收藏
    await request(app).delete('/api/favorites/PRD-007');
    const on = await request(app).post('/api/favorites/toggle').send({ productId: 'PRD-007' });
    expect(on.status).toBe(200);
    expect(on.body.data.isFavorite).toBe(true);
    // 列表应包含
    const list1 = await request(app).get('/api/favorites');
    expect(list1.body.data.some((p: any) => p.id === 'PRD-007')).toBe(true);

    const off = await request(app).post('/api/favorites/toggle').send({ productId: 'PRD-007' });
    expect(off.body.data.isFavorite).toBe(false);
    const list2 = await request(app).get('/api/favorites');
    expect(list2.body.data.some((p: any) => p.id === 'PRD-007')).toBe(false);
  });

  it('POST 收藏后再 DELETE 取消收藏', async () => {
    await request(app).post('/api/favorites').send({ productId: 'PRD-006' });
    const res = await request(app).delete('/api/favorites/PRD-006');
    expect(res.status).toBe(200);
    const list = await request(app).get('/api/favorites');
    expect(list.body.data.some((p: any) => p.id === 'PRD-006')).toBe(false);
  });

  it('POST /api/favorites/toggle 缺 productId → 400', async () => {
    const res = await request(app).post('/api/favorites/toggle').send({});
    expect(res.status).toBe(400);
  });
});
