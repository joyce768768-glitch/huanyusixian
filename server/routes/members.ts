import express from 'express';
import { members, MY_PARTNERS_USER_ID, walletTransactions } from '../data/mockData';

const router = express.Router();

router.get('/', (req, res) => {
  const { level, keyword, page = 1, pageSize = 10 } = req.query;
  let list = [...members];
  if (level && level !== 'all') list = list.filter(m => m.level === level);
  if (keyword) {
    const kw = String(keyword).toLowerCase();
    list = list.filter(m => m.name.toLowerCase().includes(kw) || m.phone.includes(kw) || m.id.toLowerCase().includes(kw));
  }
  const total = list.length;
  const start = (Number(page) - 1) * Number(pageSize);
  const data = list.slice(start, start + Number(pageSize));
  res.json({ success: true, data, pagination: { total, page: Number(page), pageSize: Number(pageSize), totalPages: Math.ceil(total / Number(pageSize)) } });
});

router.get('/me', (req, res) => {
  const m = members.find(x => x.userId === MY_PARTNERS_USER_ID) || members[0];
  res.json({ success: true, data: m });
});

router.get('/:id', (req, res) => {
  const m = members.find(x => x.id === req.params.id);
  if (!m) return res.status(404).json({ success: false, message: '会员不存在' });
  res.json({ success: true, data: m });
});

router.post('/', (req, res) => {
  const { name, phone, level } = req.body;
  if (!name || !phone) return res.status(400).json({ success: false, message: '缺少参数' });
  const nm = { id: `MEM-${Date.now()}`, name, phone, level: level || 'VIP 1', totalAmount: 0, registerDate: new Date().toISOString().slice(0, 10) };
  members.push(nm as any);
  res.json({ success: true, data: nm });
});

router.put('/:id/level', (req, res) => {
  const idx = members.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: '会员不存在' });
  (members[idx] as any).level = req.body.level;
  res.json({ success: true, data: members[idx] });
});

// 开通会员
router.post('/join', (req, res) => {
  const idx = members.findIndex(m => m.userId === MY_PARTNERS_USER_ID);
  if (idx !== -1) {
    const currentLv = Number((members[idx].level || 'VIP 0').replace(/\D/g, '')) || 1;
    const nextLv = Math.min(currentLv + 1, 5);
    (members[idx] as any).level = `VIP ${nextLv}`;
  }
  const member = idx !== -1 ? members[idx] : members[0];
  const now = new Date();
  now.setFullYear(now.getFullYear() + 1);
  res.json({ success: true, data: { member, expireDate: now.toISOString().slice(0, 10) } });
  // 钱包加一条开通记录
  walletTransactions.unshift({
    id: `t-${Date.now()}`,
    title: '会员开通 · 寰宇思贤',
    date: new Date().toISOString().replace('T', ' ').slice(0, 16),
    amount: -99,
    type: 'expense',
    icon: 'Crown',
  });
});

export default router;
