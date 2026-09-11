import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('商品 API', () => {
  it('GET /api/products → 返回商品数组', async () => {
    const res = await request(app).get('/api/products?pageSize=10');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    const p = res.body.data[0];
    expect(p.id).toBeDefined();
    expect(p.name).toBeDefined();
    expect(p.price).toBeDefined();
  });

  it('GET /api/products?pageSize=2 → 分页正确', async () => {
    const res = await request(app).get('/api/products?pageSize=2');
    expect(res.body.pagination.pageSize).toBe(2);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
  });

  it('GET /api/products?category=科普自然 → 只返回科普自然', async () => {
    const res = await request(app).get('/api/products?category=科普自然');
    expect(res.body.data.every((p: any) => p.category === '科普自然')).toBe(true);
  });

  it('GET /api/products?keyword → 按名称/标题/ID/分类搜索', async () => {
    const res = await request(app).get('/api/products?keyword=PRD-001');
    expect(res.status).toBe(200);
    expect(res.body.data.some((p: any) => p.id === 'PRD-001')).toBe(true);
  });

  it('GET /api/products/:id → 商品详情', async () => {
    const res = await request(app).get('/api/products/PRD-001');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('PRD-001');
    expect(res.body.data.name).toBeTruthy();
  });

  it('GET /api/products/:id 不存在 → 404', async () => {
    const res = await request(app).get('/api/products/PRD-NOPE');
    expect(res.status).toBe(404);
  });

  it('PUT /api/products/:id/status → 下架成功', async () => {
    const res = await request(app).put('/api/products/PRD-001/status').send({ status: 'offline' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('offline');
  });

  it('下架后 GET /api/products → 该商品不在列表', async () => {
    const res = await request(app).get('/api/products?pageSize=100');
    const ids = res.body.data.map((p: any) => p.id);
    expect(ids).not.toContain('PRD-001');
  });

  it('PUT /api/products/:id/status → 上架成功', async () => {
    const res = await request(app).put('/api/products/PRD-001/status').send({ status: 'online' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('online');
  });

  it('PUT /api/products/:id/status 非法状态 → 400', async () => {
    const res = await request(app).put('/api/products/PRD-001/status').send({ status: 'invalid' });
    expect(res.status).toBe(400);
  });

  it('PUT /api/products/:id/status 不存在商品 → 404', async () => {
    const res = await request(app).put('/api/products/PRD-NOTEXIST/status').send({ status: 'offline' });
    expect(res.status).toBe(404);
  });

  it('POST /api/products → 新建商品默认 online', async () => {
    const res = await request(app).post('/api/products').send({ name: '测试商品', category: '测试', price: 99 });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('online');
  });

  it('POST /api/products 缺 name 且无 title → 400', async () => {
    const res = await request(app).post('/api/products').send({ price: 10 });
    expect(res.status).toBe(400);
  });

  it('POST /api/products 缺 price → 400', async () => {
    const res = await request(app).post('/api/products').send({ name: '无价格商品' });
    expect(res.status).toBe(400);
  });

  it('PUT /api/products/:id → 更新商品字段', async () => {
    const res = await request(app).put('/api/products/PRD-003').send({
      price: 50, stock: 999, description: '更新后的描述',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.price).toBe(50);
    expect(res.body.data.stock).toBe(999);
  });

  it('PUT /api/products/:id 不存在 → 404', async () => {
    const res = await request(app).put('/api/products/PRD-NOPE').send({ price: 10 });
    expect(res.status).toBe(404);
  });

  it('PUT /api/products/:id → image 空串兜底为默认封面', async () => {
    const res = await request(app).put('/api/products/PRD-003').send({ image: '' });
    expect(res.status).toBe(200);
    expect(res.body.data.image).not.toBe('');
  });

  it('DELETE /api/products/:id → 删除商品', async () => {
    // 先建一个再删
    const created = await request(app).post('/api/products').send({ name: '待删除商品', price: 10 });
    const id = created.body.data.id;
    const res = await request(app).delete(`/api/products/${id}`);
    expect(res.status).toBe(200);
    const check = await request(app).get(`/api/products/${id}`);
    expect(check.status).toBe(404);
  });

  it('DELETE /api/products/:id 不存在 → 404', async () => {
    const res = await request(app).delete('/api/products/PRD-NOPE');
    expect(res.status).toBe(404);
  });
});
