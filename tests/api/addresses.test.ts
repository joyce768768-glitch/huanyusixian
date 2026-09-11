import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('收货地址 API', () => {
  it('GET /api/addresses → 返回当前用户地址数组', async () => {
    const res = await request(app).get('/api/addresses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/addresses/:id → 返回地址详情', async () => {
    const res = await request(app).get('/api/addresses/ADDR-C-001');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('张明远');
  });

  it('GET /api/addresses/:id 不存在 → 404', async () => {
    const res = await request(app).get('/api/addresses/ADDR-NOPE');
    expect(res.status).toBe(404);
  });

  it('POST /api/addresses 缺姓名/电话 → 400', async () => {
    const res = await request(app).post('/api/addresses').send({ area: '上海' });
    expect(res.status).toBe(400);
  });

  it('POST /api/addresses → 新建地址成功', async () => {
    const res = await request(app).post('/api/addresses').send({
      name: '测试用户', phone: '13900001111', area: '测试省 测试市', detail: '测试路 1 号',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.id).toMatch(/^ADDR-C-/);
    expect(res.body.data.name).toBe('测试用户');
  });

  it('PUT /api/addresses/:id → 更新地址', async () => {
    const created = await request(app).post('/api/addresses').send({
      name: '待更新', phone: '13800002222', area: 'A区', detail: 'B路',
    });
    const id = created.body.data.id;
    const res = await request(app).put(`/api/addresses/${id}`).send({ detail: '更新后的地址 99 号' });
    expect(res.status).toBe(200);
    expect(res.body.data.detail).toBe('更新后的地址 99 号');
  });

  it('POST /api/addresses/:id/default → 设为默认且唯一', async () => {
    const res = await request(app).post('/api/addresses/ADDR-C-002/default');
    expect(res.status).toBe(200);
    expect(res.body.data.isDefault).toBe(true);
    const list = await request(app).get('/api/addresses');
    const defaults = list.body.data.filter((a: any) => a.isDefault);
    expect(defaults).toHaveLength(1);
    expect(defaults[0].id).toBe('ADDR-C-002');
    // 还原默认
    await request(app).post('/api/addresses/ADDR-C-001/default');
  });

  it('DELETE /api/addresses/:id → 删除地址', async () => {
    const created = await request(app).post('/api/addresses').send({
      name: '待删除', phone: '13700003333', area: 'C区', detail: 'D路',
    });
    const id = created.body.data.id;
    const res = await request(app).delete(`/api/addresses/${id}`);
    expect(res.status).toBe(200);
    const check = await request(app).get(`/api/addresses/${id}`);
    expect(check.status).toBe(404);
  });
});
