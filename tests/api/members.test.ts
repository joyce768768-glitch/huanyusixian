import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('会员 API', () => {
  it('GET /api/members → 返回分页会员列表', async () => {
    const res = await request(app).get('/api/members?page=1&pageSize=5');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination.page).toBe(1);
  });

  it('GET /api/members?level=VIP 5 → 按等级过滤', async () => {
    const res = await request(app).get('/api/members?level=VIP%205');
    expect(res.status).toBe(200);
    expect(res.body.data.every((m: any) => m.level === 'VIP 5')).toBe(true);
  });

  it('GET /api/members?keyword → 按姓名/手机/ID搜索', async () => {
    const res = await request(app).get('/api/members?keyword=张三');
    expect(res.status).toBe(200);
    expect(res.body.data.some((m: any) => m.name === '张三')).toBe(true);
  });

  it('GET /api/members/me → 返回当前登录会员', async () => {
    const res = await request(app).get('/api/members/me');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('level');
  });

  it('GET /api/members/:id → 会员详情', async () => {
    const res = await request(app).get('/api/members/MEM-001');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('张三');
  });

  it('GET /api/members/:id 不存在 → 404', async () => {
    const res = await request(app).get('/api/members/MEM-NOPE');
    expect(res.status).toBe(404);
  });

  it('POST /api/members 缺参数 → 400', async () => {
    const res = await request(app).post('/api/members').send({ name: '只有名字' });
    expect(res.status).toBe(400);
  });

  it('POST → 新建会员默认 VIP 1；PUT /:id/level → 调整等级', async () => {
    const created = await request(app).post('/api/members').send({ name: '测试会员', phone: '13111112222' });
    expect(created.status).toBe(200);
    expect(created.body.data.level).toBe('VIP 1');
    const id = created.body.data.id;

    const upd = await request(app).put(`/api/members/${id}/level`).send({ level: 'VIP 4' });
    expect(upd.status).toBe(200);
    expect(upd.body.data.level).toBe('VIP 4');
  });

  it('PUT /api/members/:id/level 不存在 → 404', async () => {
    const res = await request(app).put('/api/members/MEM-NOPE/level').send({ level: 'VIP 2' });
    expect(res.status).toBe(404);
  });

  it('POST /api/members/join → 开通会员返回到期日（一年后）', async () => {
    const res = await request(app).post('/api/members/join');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('expireDate');
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    expect(res.body.data.expireDate).toBe(nextYear.toISOString().slice(0, 10));
  });
});
