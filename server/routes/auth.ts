import express from 'express';
import { users } from '../data/mockData';

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: '用户名/密码必填' });
  const user = users.find(u => u.name === username || u.wechat === username) || users[0];
  res.json({
    success: true,
    data: {
      token: `mock-token-${Date.now()}`,
      user,
    },
  });
});

router.get('/me', (req, res) => {
  // mock：默认返回第一个管理员；若 token 末尾是 client，返回 C 端用户
  const auth = req.headers.authorization || '';
  const isClient = auth.includes('client');
  const user = isClient ? users[users.length - 1] : users[0];
  res.json({ success: true, data: user });
});

// C 端手机号 + 验证码登录（mock 任何验证码 1234 都通过）
router.post('/client-login', (req, res) => {
  const { phone, code } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: '手机号必填' });
  if (code && code !== '1234') return res.status(400).json({ success: false, message: '验证码错误' });
  const user = users[users.length - 1]; // 张明远
  res.json({ success: true, data: { token: `mock-token-client-${Date.now()}`, user } });
});

// 检查当前用户是否有后台管理权限
router.get('/admin-access', (req, res) => {
  // mock：C端默认用户张明远有管理权限
  const user = users.find(u => u.id === 'USR-CLIENT-001');
  const hasAccess = !!(user && (user as any).adminAccess);
  res.json({
    success: true,
    data: {
      hasAccess,
      role: user?.role || '普通会员',
      adminUrl: hasAccess ? '/admin' : null,
    },
  });
});

export default router;
