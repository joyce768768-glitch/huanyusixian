import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('分销 API', () => {
  it('GET /api/distributors → 返回分销商列表', async () => {
    const res = await request(app).get('/api/distributors?pageSize=10');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/distributors?level=高级分销商 → 按等级过滤', async () => {
    const res = await request(app).get('/api/distributors').query({ level: '高级分销商', pageSize: 50 });
    expect(res.status).toBe(200);
    expect(res.body.data.every((d: any) => d.level === '高级分销商')).toBe(true);
  });

  it('GET /api/distributors?status=active → 按状态过滤', async () => {
    const res = await request(app).get('/api/distributors').query({ status: 'active', pageSize: 50 });
    expect(res.status).toBe(200);
    expect(res.body.data.every((d: any) => d.status === 'active')).toBe(true);
  });

  it('GET /api/distributors?keyword → 按姓名/手机/ID搜索', async () => {
    const res = await request(app).get('/api/distributors').query({ keyword: '张晓明', pageSize: 50 });
    expect(res.status).toBe(200);
    expect(res.body.data.some((d: any) => d.name === '张晓明')).toBe(true);
  });

  it('GET /api/distributors/my-invite-code → 返回邀请码', async () => {
    const res = await request(app).get('/api/distributors/my-invite-code');
    expect(res.status).toBe(200);
    expect(res.body.data.inviteCode).toBe('HY2026');
  });

  it('GET /api/distributors/my-partners → 返回我发展的伙伴', async () => {
    const res = await request(app).get('/api/distributors/my-partners');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it('GET /api/distributors/:id → 分销商详情', async () => {
    const res = await request(app).get('/api/distributors/DIS-001');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('张晓明');
  });

  it('GET /api/distributors/:id 不存在 → 404', async () => {
    const res = await request(app).get('/api/distributors/DIS-NOPE');
    expect(res.status).toBe(404);
  });

  it('POST /api/distributors → B端新建分销商', async () => {
    const res = await request(app).post('/api/distributors').send({
      name: '测试分销商-B端', phone: '13900000001', level: '中级分销商',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('active');
    expect(res.body.data.level).toBe('中级分销商');
  });

  it('POST /api/distributors 缺 name → 400', async () => {
    const res = await request(app).post('/api/distributors').send({ phone: '123' });
    expect(res.status).toBe(400);
  });

  it('PUT /api/distributors/:id → 更新分销商', async () => {
    const res = await request(app).put('/api/distributors/DIS-002').send({
      level: '高级分销商', status: 'active',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.level).toBe('高级分销商');
  });

  it('PUT /api/distributors/:id 不存在 → 404', async () => {
    const res = await request(app).put('/api/distributors/DIS-NOPE').send({ level: 'x' });
    expect(res.status).toBe(404);
  });

  it('POST /api/distributors/apply → 带邀请码申请成功', async () => {
    const res = await request(app).post('/api/distributors/apply').send({
      name: '测试申请者',
      phone: '13800138000',
      inviterCode: 'HY2026',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.inviterId).toBe('DIS-001');
    expect(res.body.data.status).toBe('pending');
  });

  it('POST /api/distributors/apply 缺字段 → 400', async () => {
    const res = await request(app).post('/api/distributors/apply').send({});
    expect(res.status).toBe(400);
  });
});
