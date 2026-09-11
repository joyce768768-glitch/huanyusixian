import express from 'express';
import { userCoupons, marketingActivities, MY_PARTNERS_USER_ID } from '../data/mockData';

const router = express.Router();

// 相对今天的日期（YYYY-MM-DD），保证新领取的券不会一发放就过期
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const today = () => daysFromNow(0);

// 我的优惠券
router.get('/', (req, res) => {
  const { status } = req.query;
  let list = [...userCoupons];
  if (status) list = list.filter(c => c.status === status);
  res.json({ success: true, data: list });
});

// 领取（按活动）
router.post('/receive', (req, res) => {
  const { activityId } = req.body;
  const act = marketingActivities.find(a => a.id === activityId);
  if (!act) return res.status(404).json({ success: false, message: '活动不存在' });
  const reward = act.reward || '';
  const m = reward.match(/[¥￥]\s*(\d+)/);
  const amount = m ? Number(m[1]) : 20;
  const nc = {
    id: `CP-${Date.now()}`,
    title: act.name + ' · ' + reward,
    discountType: 'amount' as const,
    amount,
    minSpend: 1,
    validFrom: today(),
    // 活动结束日若已过期则兜底为领取后 90 天，避免领到即过期
    validTo: act.endDate && act.endDate >= today() ? act.endDate : daysFromNow(90),
    status: 'unused' as const,
    userId: MY_PARTNERS_USER_ID,
  };
  userCoupons.unshift(nc as any);
  res.json({ success: true, data: nc });
});

// 新人礼包
router.post('/new-user-gift', (req, res) => {
  const gifts = [
    { id: `CP-G-${Date.now()}-1`, title: '新人礼包 · 满99减20', discountType: 'amount' as const, amount: 20, minSpend: 99, validFrom: today(), validTo: daysFromNow(90), status: 'unused' as const, userId: MY_PARTNERS_USER_ID },
    { id: `CP-G-${Date.now()}-2`, title: '新人礼包 · 运费券',   discountType: 'shipping' as const, amount: 0,  minSpend: 1,  validFrom: today(), validTo: daysFromNow(30), status: 'unused' as const, userId: MY_PARTNERS_USER_ID },
  ];
  gifts.forEach(g => userCoupons.unshift(g as any));
  res.json({ success: true, data: gifts });
});

export default router;
