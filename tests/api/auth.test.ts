import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index';

describe('认证 API', () => {
  it('POST /api/auth/login → 登录成功返回 token+用户', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: '管理员-艾伦', password: 'any',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toMatch(/^mock-token-/);
    expect(res.body.data.user).toBeTruthy();
  });

  it('POST /api/auth/login 缺用户名或密码 → 400', async () => {
    const r1 = await request(app).post('/api/auth/login').send({ password: 'x' });
    expect(r1.status).toBe(400);
    const r2 = await request(app).post('/api/auth/login').send({ username: 'x' });
    expect(r2.status).toBe(400);
  });

  it('POST /api/auth/client-login → C端手机号登录成功', async () => {
    const res = await request(app).post('/api/auth/client-login').send({
      phone: '13800000000', code: '1234',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toMatch(/^mock-token-client-/);
    expect(res.body.data.user.name).toBe('张明远');
  });

  it('POST /api/auth/client-login 缺手机号 → 400', async () => {
    const res = await request(app).post('/api/auth/client-login').send({ code: '1234' });
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/client-login 验证码错误 → 400', async () => {
    const res = await request(app).post('/api/auth/client-login').send({
      phone: '13800000000', code: '9999',
    });
    expect(res.status).toBe(400);
  });

  it('GET /api/auth/me 无 token → 返回管理员', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('USR-ADMIN-001');
  });

  it('GET /api/auth/me 带 client token → 返回 C端用户', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer mock-token-client-123');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('USR-CLIENT-001');
  });

  it('GET /api/auth/admin-access → 张明远有后台权限', async () => {
    const res = await request(app).get('/api/auth/admin-access');
    expect(res.status).toBe(200);
    expect(res.body.data.hasAccess).toBe(true);
    expect(res.body.data.adminUrl).toBe('/admin');
  });
});
