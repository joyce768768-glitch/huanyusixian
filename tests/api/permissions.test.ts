import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('权限与用户 API', () => {
  it('GET /api/permissions/list → 返回权限列表', async () => {
    const res = await request(app).get('/api/permissions/list');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/permissions/users → 用户分页列表', async () => {
    const res = await request(app).get('/api/permissions/users?page=1&pageSize=5');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination.pageSize).toBe(5);
  });

  it('GET /api/permissions/users?role=平台管理员 → 按角色过滤', async () => {
    const res = await request(app).get('/api/permissions/users').query({ role: '平台管理员' });
    expect(res.status).toBe(200);
    expect(res.body.data.every((u: any) => u.role === '平台管理员')).toBe(true);
  });

  it('GET /api/permissions/users?keyword → 按姓名搜索', async () => {
    const res = await request(app).get('/api/permissions/users?keyword=艾伦');
    expect(res.status).toBe(200);
    expect(res.body.data.some((u: any) => u.name.includes('艾伦'))).toBe(true);
  });

  it('GET /api/permissions/users/:id → 用户详情', async () => {
    const res = await request(app).get('/api/permissions/users/USR-ADMIN-001');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('管理员-艾伦');
  });

  it('GET /api/permissions/users/:id 不存在 → 404', async () => {
    const res = await request(app).get('/api/permissions/users/USR-NOPE');
    expect(res.status).toBe(404);
  });

  it('POST 缺 name/wechat → 400', async () => {
    const res = await request(app).post('/api/permissions/users').send({ name: '只有名字' });
    expect(res.status).toBe(400);
  });

  it('POST 创建 → PUT 改角色 → DELETE 删除 完整闭环', async () => {
    const created = await request(app).post('/api/permissions/users').send({
      name: '自动化测试账号', wechat: 'auto_test_bot', role: '普通会员',
    });
    expect(created.status).toBe(200);
    expect(created.body.data.id).toMatch(/^USR-/);
    expect(created.body.data.role).toBe('普通会员');
    const id = created.body.data.id;

    const upd = await request(app).put(`/api/permissions/users/${id}/role`).send({ role: '分销商' });
    expect(upd.status).toBe(200);
    expect(upd.body.data.role).toBe('分销商');

    const del = await request(app).delete(`/api/permissions/users/${id}`);
    expect(del.status).toBe(200);
    const check = await request(app).get(`/api/permissions/users/${id}`);
    expect(check.status).toBe(404);
  });

  it('PUT /api/permissions/users/:id/role 不存在 → 404', async () => {
    const res = await request(app).put('/api/permissions/users/USR-NOPE/role').send({ role: 'x' });
    expect(res.status).toBe(404);
  });
});
