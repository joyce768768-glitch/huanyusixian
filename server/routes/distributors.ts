import express from 'express';
import { distributors, myPartners, MY_PARTNERS_USER_ID } from '../data/mockData';

const router = express.Router();

// ---- C 端专属路由：必须放在 /:id 动态路由之前，否则会被当成 id ----
// 我发展的分销伙伴
router.get('/my-partners', (req, res) => {
  const { level, page = 1, pageSize = 10 } = req.query;
  let list = [...myPartners];
  if (level && level !== 'all') list = list.filter(p => p.level === level);
  const total = list.length;
  const start = (Number(page) - 1) * Number(pageSize);
  const data = list.slice(start, start + Number(pageSize));
  res.json({ success: true, data, pagination: { total, page: Number(page), pageSize: Number(pageSize), totalPages: Math.ceil(total / Number(pageSize)) } });
});

// 申请成为分销商
router.post('/apply', (req, res) => {
  const { name, phone, wechat, inviterCode } = req.body;
  if (!name || !phone) return res.status(400).json({ success: false, message: '姓名和电话必填' });
  const nd = {
    id: `DIS-ME-${Date.now()}`,
    name, phone, wechat: wechat || '', inviterCode: inviterCode || '',
    level: '初级分销商' as const,
    status: 'pending' as const,
    regTime: new Date().toISOString().slice(0, 10),
    orders: 0, revenue: 0, rate: '10%',
    userId: MY_PARTNERS_USER_ID,
  };
  distributors.push(nd as any);
  res.json({ success: true, data: nd });
});

// ---- B 端通用路由 ----
router.get('/', (req, res) => {
  const { level, status, keyword, page = 1, pageSize = 10 } = req.query;
  let list = [...distributors];
  if (level && level !== 'all') list = list.filter(d => d.level === level);
  if (status && status !== 'all') list = list.filter(d => d.status === status);
  if (keyword) {
    const kw = String(keyword).toLowerCase();
    list = list.filter(d => d.name.toLowerCase().includes(kw) || (d.phone || '').includes(kw) || d.id.toLowerCase().includes(kw));
  }
  const total = list.length;
  const start = (Number(page) - 1) * Number(pageSize);
  const data = list.slice(start, start + Number(pageSize));
  res.json({ success: true, data, pagination: { total, page: Number(page), pageSize: Number(pageSize), totalPages: Math.ceil(total / Number(pageSize)) } });
});

router.post('/', (req, res) => {
  const { name, phone, level } = req.body;
  if (!name) return res.status(400).json({ success: false, message: '名称必填' });
  const nd = {
    id: `DIS-${Date.now()}`,
    name, phone: phone || '',
    level: level || '初级分销商',
    status: 'active' as const,
    regTime: new Date().toISOString().slice(0, 10),
    orders: 0, revenue: 0, rate: '10%',
  };
  distributors.push(nd as any);
  res.json({ success: true, data: nd });
});

router.get('/:id', (req, res) => {
  const d = distributors.find(x => x.id === req.params.id);
  if (!d) return res.status(404).json({ success: false, message: '分销商不存在' });
  res.json({ success: true, data: d });
});

router.put('/:id', (req, res) => {
  const idx = distributors.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: '分销商不存在' });
  const f = ['name', 'phone', 'level', 'status'] as const;
  f.forEach(k => { if (req.body[k] !== undefined) (distributors[idx] as any)[k] = req.body[k]; });
  res.json({ success: true, data: distributors[idx] });
});

export default router;
