import express from 'express';
import { orders, products, MY_PARTNERS_USER_ID, userCoupons, distributors, financeRecords, walletTransactions } from '../data/mockData';

// 计算优惠券抵扣金额
function applyCoupon(totalAmount: number, couponId?: string): { discount: number; coupon: any } {
  if (!couponId) return { discount: 0, coupon: null };
  const coupon = userCoupons.find((c: any) => c.id === couponId && c.status === 'unused' && (!c.userId || c.userId === MY_PARTNERS_USER_ID));
  if (!coupon) return { discount: 0, coupon: null };
  if (coupon.minSpend && totalAmount < coupon.minSpend) return { discount: 0, coupon: null };
  let discount = 0;
  if (coupon.discountType === 'amount') {
    discount = coupon.amount || 0;
  } else if (coupon.discountType === 'shipping') {
    discount = 15; // 免运费，固定抵扣 15 元
  }
  return { discount: Math.min(discount, totalAmount), coupon };
}

// 支付成功后结算佣金给上级分销商
function settleCommission(orderId: string, totalAmount: number) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  const distId = (order as any).distId;
  if (!distId) return;
  const dist = distributors.find(d => d.id === distId);
  if (!dist) return;
  const rateStr = dist.rate || '10%';
  const rate = parseFloat(rateStr) / 100;
  if (!rate || rate <= 0) return;
  const commission = Math.round(totalAmount * rate * 100) / 100;
  (dist as any).revenue = (dist.revenue || 0) + commission;
  (dist as any).orders = (dist.orders || 0) + 1;
  financeRecords.unshift({
    id: `FIN-${Date.now()}`,
    type: '分销佣金',
    category: 'income',
    amount: commission,
    time: new Date().toISOString().slice(0, 10),
    description: `订单 ${orderId} 佣金结算（${dist.name} ${rateStr}）`,
  });
  walletTransactions.unshift({
    id: `WT-${Date.now()}`,
    type: 'income',
    amount: commission,
    time: new Date().toISOString().replace('T', ' ').slice(0, 16),
    description: `分销佣金 - 订单 ${orderId}`,
    status: 'completed',
    userId: MY_PARTNERS_USER_ID,
  } as any);
}

const STATUS_MAP: Record<string, { label: string; color: string; log: string }> = {
  pending_payment:   { label: '待付款', color: 'blue',   log: 'pay' },
  pending_delivery:  { label: '待发货', color: 'amber',  log: 'box' },
  shipped:           { label: '已发货', color: 'violet', log: 'truck' },
  completed:         { label: '已完成', color: 'emerald',log: 'ship' },
  refunded:          { label: '已退货', color: 'rose',   log: 'return' },
  cancelled:         { label: '已取消', color: 'slate',  log: 'x' },
};
const LABEL_TO_CODE: Record<string, string> = Object.entries(STATUS_MAP).reduce(
  (acc, [code, v]) => ({ ...acc, [v.label]: code }),
  {} as Record<string, string>
);

function normalize<T extends Record<string, any>>(o: T): T {
  // 确保 B 端 (中文 status) 和 C 端 (英文 statusCode) 都能认
  const any = o as any;
  const code = any.statusCode || LABEL_TO_CODE[any.status] || 'pending_payment';
  const info = STATUS_MAP[code] || STATUS_MAP.pending_payment;
  return {
    ...o,
    status: any.status || info.label,
    statusCode: code,
    color: any.color || info.color,
    log: any.log || info.log,
    goods: any.goods || (any.items && any.items.length ? any.items.map((i: any) => i.title).join('、') : ''),
    qty: any.qty || (any.itemCount ?? (any.items?.reduce((s: number, i: any) => s + (i.quantity || 0), 0) as number)),
    amount: any.amount || (any.totalAmount !== undefined ? `¥${Number(any.totalAmount).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}` : ''),
    time: any.time || any.createTime,
    orderNumber: any.orderNumber || any.id,
  };
}

const router = express.Router();

// 订单列表（支持 status(中文/英文)、keyword、userId 过滤）
router.get('/', (req, res) => {
  const { status, keyword, userId, page = 1, pageSize = 10 } = req.query;

  let list = orders.map(normalize);

  // 兼容中英文 status
  if (status && status !== 'all') {
    const s = String(status);
    const code = LABEL_TO_CODE[s] || s;
    list = list.filter(o => o.statusCode === code || o.status === s);
  }
  if (keyword) {
    const kw = String(keyword).toLowerCase();
    list = list.filter(o =>
      (o.goods || '').toLowerCase().includes(kw) ||
      (o.dist || '').toLowerCase().includes(kw) ||
      (o.id || '').toLowerCase().includes(kw) ||
      (o.orderNumber || '').toLowerCase().includes(kw)
    );
  }
  if (userId) {
    list = list.filter(o => o.userId === userId);
  } else {
    // 没有传 userId 默认不限制（B 端视角）；C 端实际会自己传
  }

  const total = list.length;
  const start = (Number(page) - 1) * Number(pageSize);
  const end = start + Number(pageSize);
  const paginated = list.slice(start, end);

  res.json({
    success: true,
    data: paginated,
    pagination: {
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize)),
    },
  });
});

router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: '订单不存在' });
  res.json({ success: true, data: normalize(order) });
});

router.put('/:id/status', (req, res) => {
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: '订单不存在' });
  const s: string = String(req.body.status || req.body.statusCode);
  const code = LABEL_TO_CODE[s] || s;
  const info = STATUS_MAP[code] || { label: s, color: 'slate', log: 'box' };
  (orders[idx] as any).status = info.label;
  (orders[idx] as any).statusCode = code;
  (orders[idx] as any).color = info.color;
  (orders[idx] as any).log = info.log;
  res.json({ success: true, data: normalize(orders[idx]) });
});

// -------- C 端新增接口 --------

// 下单（直接从 items 建订单，或从购物车 checkout 建单走 cart/checkout）
router.post('/', (req, res) => {
  const { items, remark, couponId } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: '商品不能为空' });
  }
  const orderItems = items.map((it: any, i: number) => {
    const p = products.find(x => x.id === it.productId);
    return {
      id: `it-n${Date.now()}-${i}`,
      productId: it.productId,
      title: p?.title || p?.name || it.title || '未知商品',
      specs: it.specs || '',
      price: it.price !== undefined ? Number(it.price) : p?.price || 0,
      quantity: Number(it.quantity) || 1,
      image: p?.image || '',
    };
  });
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalQty = orderItems.reduce((s, i) => s + i.quantity, 0);
  // 优惠券抵扣
  const { discount, coupon } = applyCoupon(subtotal, couponId);
  const totalAmount = Math.max(0, subtotal - discount);
  const id = `ORD-${Date.now()}`;
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const newOrder = {
    id,
    orderNumber: `LR${Date.now()}`,
    userId: MY_PARTNERS_USER_ID,
    goods: orderItems.map(i => i.title).join('、'),
    qty: totalQty,
    amount: `¥${totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`,
    totalAmount,
    itemCount: totalQty,
    time: now,
    createTime: now,
    dist: '张晓明',
    distId: 'DIS-001',
    status: '待付款',
    statusCode: 'pending_payment',
    color: 'blue',
    log: 'pay',
    remark: remark || '',
    items: orderItems,
    couponId: couponId || '',
    discount,
    originalAmount: subtotal,
  };
  // 标记优惠券已使用
  if (coupon) (coupon as any).status = 'used';
  orders.unshift(newOrder as any);
  res.json({ success: true, data: normalize(newOrder as any) });
});

// 支付
router.post('/:id/pay', (req, res) => {
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: '订单不存在' });
  (orders[idx] as any).status = '待发货';
  (orders[idx] as any).statusCode = 'pending_delivery';
  (orders[idx] as any).color = 'amber';
  (orders[idx] as any).log = 'box';
  // 支付成功后结算佣金
  const paidAmount = (orders[idx] as any).totalAmount || 0;
  settleCommission(orders[idx].id, paidAmount);
  res.json({ success: true, data: normalize(orders[idx]) });
});

// 取消订单
router.post('/:id/cancel', (req, res) => {
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: '订单不存在' });
  (orders[idx] as any).status = '已取消';
  (orders[idx] as any).statusCode = 'cancelled';
  (orders[idx] as any).color = 'slate';
  (orders[idx] as any).log = 'x';
  res.json({ success: true });
});

// 确认收货
router.post('/:id/receive', (req, res) => {
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: '订单不存在' });
  (orders[idx] as any).status = '已完成';
  (orders[idx] as any).statusCode = 'completed';
  (orders[idx] as any).color = 'emerald';
  (orders[idx] as any).log = 'ship';
  res.json({ success: true, data: normalize(orders[idx]) });
});

export default router;
