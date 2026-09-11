import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('物流 API', () => {
  it('GET /api/logistics/templates → 模板分页列表', async () => {
    const res = await request(app).get('/api/logistics/templates?page=1&pageSize=10');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/logistics/templates?status=active → 只返回启用模板', async () => {
    const res = await request(app).get('/api/logistics/templates?status=active');
    expect(res.status).toBe(200);
    expect(res.body.data.every((t: any) => t.status === 'active')).toBe(true);
  });

  it('GET /api/logistics/templates?keyword → 按名称搜索', async () => {
    const res = await request(app).get('/api/logistics/templates?keyword=免邮');
    expect(res.status).toBe(200);
    expect(res.body.data.every((t: any) => t.name.includes('免邮'))).toBe(true);
  });

  it('GET /api/logistics/templates/:id → 模板详情', async () => {
    const res = await request(app).get('/api/logistics/templates/LOG-001');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toContain('全国');
  });

  it('GET /api/logistics/templates/:id 不存在 → 404', async () => {
    const res = await request(app).get('/api/logistics/templates/LOG-NOPE');
    expect(res.status).toBe(404);
  });

  it('POST 缺 name → 400；POST 完整字段 → 创建成功', async () => {
    const bad = await request(app).post('/api/logistics/templates').send({ desc: '无名称' });
    expect(bad.status).toBe(400);

    const ok = await request(app).post('/api/logistics/templates').send({
      name: '测试模板-自动化', desc: '用例创建', mode: '按件数 (Per item)', area: '测试地区',
    });
    expect(ok.status).toBe(200);
    expect(ok.body.data.status).toBe('active');
  });

  it('PUT /api/logistics/templates/:id → 更新模板；DELETE → 删除', async () => {
    const created = await request(app).post('/api/logistics/templates').send({ name: '待更新模板' });
    const id = created.body.data.id;
    const upd = await request(app).put(`/api/logistics/templates/${id}`).send({ name: '已更新模板', status: 'inactive' });
    expect(upd.status).toBe(200);
    expect(upd.body.data.name).toBe('已更新模板');

    const del = await request(app).delete(`/api/logistics/templates/${id}`);
    expect(del.status).toBe(200);
    const check = await request(app).get(`/api/logistics/templates/${id}`);
    expect(check.status).toBe(404);
  });

  it('PUT /api/logistics/templates/:id 不存在 → 404', async () => {
    const res = await request(app).put('/api/logistics/templates/LOG-NOPE').send({ name: 'x' });
    expect(res.status).toBe(404);
  });

  it('GET /api/logistics/addresses → 发货地址列表', async () => {
    const res = await request(app).get('/api/logistics/addresses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/logistics/addresses 缺参 → 400；完整 → 创建成功且手机号脱敏', async () => {
    const bad = await request(app).post('/api/logistics/addresses').send({ name: '缺字段' });
    expect(bad.status).toBe(400);

    const ok = await request(app).post('/api/logistics/addresses').send({
      name: '测试仓库', user: '仓管员', phone: '13812345678', area: '测试区', detail: '测试路 1 号',
    });
    expect(ok.status).toBe(200);
    expect(ok.body.data.phone).toContain('****');
  });
});
