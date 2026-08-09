import express from 'express';
import { userAddresses, MY_PARTNERS_USER_ID } from '../data/mockData';

const router = express.Router();

// 我的收货地址列表
router.get('/', (req, res) => {
  const list = userAddresses.filter(a => a.userId === MY_PARTNERS_USER_ID);
  res.json({ success: true, data: list });
});

router.get('/:id', (req, res) => {
  const a = userAddresses.find(x => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: '地址不存在' });
  res.json({ success: true, data: a });
});

router.post('/', (req, res) => {
  const { name, phone, area, detail, address, isDefault } = req.body;
  if (!name || !phone) return res.status(400).json({ success: false, message: '姓名和电话必填' });
  if (isDefault) userAddresses.forEach(a => { if (a.userId === MY_PARTNERS_USER_ID) a.isDefault = false; });
  const na = {
    id: `ADDR-C-${Date.now()}`,
    name, phone,
    area: area || '',
    detail: detail || address || '',
    address: address || (area ? `${area} ${detail || ''}` : ''),
    isDefault: !!isDefault || userAddresses.filter(a => a.userId === MY_PARTNERS_USER_ID).length === 0,
    userId: MY_PARTNERS_USER_ID,
  };
  userAddresses.push(na as any);
  res.json({ success: true, data: na });
});

router.put('/:id', (req, res) => {
  const idx = userAddresses.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: '地址不存在' });
  const { isDefault } = req.body;
  if (isDefault) userAddresses.forEach((a, i) => { if (i !== idx && a.userId === MY_PARTNERS_USER_ID) a.isDefault = false; });
  const f = ['name', 'phone', 'area', 'detail', 'address', 'isDefault'] as const;
  f.forEach(k => { if (req.body[k] !== undefined) (userAddresses[idx] as any)[k] = req.body[k]; });
  res.json({ success: true, data: userAddresses[idx] });
});

router.delete('/:id', (req, res) => {
  const idx = userAddresses.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: '地址不存在' });
  const removed = userAddresses.splice(idx, 1)[0];
  res.json({ success: true, data: removed });
});

router.post('/:id/default', (req, res) => {
  const idx = userAddresses.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: '地址不存在' });
  userAddresses.forEach((a, i) => { if (a.userId === MY_PARTNERS_USER_ID) a.isDefault = i === idx; });
  res.json({ success: true, data: userAddresses[idx] });
});

export default router;
