import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('营销活动 API', () => {
  it('GET /api/marketing/activities → 活动分页列表', async () => {
    const res = await request(app).get('/api/marketing/activities');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/marketing/activities?type=register → 按类型过滤', async () => {
    const res = await request(app).get('/api/marketing/activities?type=register');
    expect(res.status).toBe(200);
    expect(res.body.data.every((a: any) => a.type === 'register')).toBe(true);
  });

  it('GET /api/marketing/activities?status=active → 只返回进行中', async () => {
    const res = await request(app).get('/api/marketing/activities?status=active');
    expect(res.status).toBe(200);
    expect(res.body.data.every((a: any) => a.status === 'active')).toBe(true);
  });

  it('GET /api/marketing/activities/:id → 活动详情', async () => {
    const res = await request(app).get('/api/marketing/activities/MKT-001');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('新用户注册有礼');
  });

  it('GET /api/marketing/activities/:id 不存在 → 404', async () => {
    const res = await request(app).get('/api/marketing/activities/MKT-NOPE');
    expect(res.status).toBe(404);
  });

  it('POST 缺 name/type → 400', async () => {
    const res = await request(app).post('/api/marketing/activities').send({ name: '只有名称' });
    expect(res.status).toBe(400);
  });

  it('POST 创建 → PUT 更新 → DELETE 删除 完整闭环', async () => {
    const created = await request(app).post('/api/marketing/activities').send({
      name: '自动化测试活动', type: 'discount', reward: '¥10 优惠券',
    });
    expect(created.status).toBe(200);
    expect(created.body.data.status).toBe('active');
    const id = created.body.data.id;

    const upd = await request(app).put(`/api/marketing/activities/${id}`).send({ status: 'inactive', reward: '¥30 优惠券' });
    expect(upd.status).toBe(200);
    expect(upd.body.data.status).toBe('inactive');
    expect(upd.body.data.reward).toBe('¥30 优惠券');

    const del = await request(app).delete(`/api/marketing/activities/${id}`);
    expect(del.status).toBe(200);
    const check = await request(app).get(`/api/marketing/activities/${id}`);
    expect(check.status).toBe(404);
  });

  it('PUT /api/marketing/activities/:id 不存在 → 404', async () => {
    const res = await request(app).put('/api/marketing/activities/MKT-NOPE').send({ name: 'x' });
    expect(res.status).toBe(404);
  });
});
