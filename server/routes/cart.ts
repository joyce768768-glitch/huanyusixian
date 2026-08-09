import express from 'express';
import { cartItems, products, orders, MY_PARTNERS_USER_ID } from '../data/mockData';

const router = express.Router();

function enrich(ci: any) {
  const product = products.find(p => p.id === ci.productId);
  return {
    ...ci,
    product,
    title: product?.title || product?.name || '已下架商品',
    price: ci.price || product?.price || 0,
    image: product?.image || '',
  };
}

// 购物车列表（默认带产品详情）
router.get('/', (req, res) => {
  const list = cartItems.filter(c => c.userId === MY_PARTNERS_USER_ID).map(enrich);
  res.json({ success: true, data: list });
});

// 数量
router.get('/count', (req, res) => {
  const c = cartItems.filter(c => c.userId === MY_PARTNERS_USER_ID).reduce((s, i) => s + (i.quantity || 0), 0);
  res.json({ success: true, data: { count: c } });
});

// 添加
router.post('/', (req, res) => {
  const { productId, quantity = 1, specs } = req.body;
  if (!productId) return res.status(400).json({ success: false, message: '缺少 productId' });
  const p = products.find(x => x.id === productId);
  if (!p) return res.status(404).json({ success: false, message: '商品不存在' });
  const exist = cartItems.find(c => c.userId === MY_PARTNERS_USER_ID && c.productId === productId && (c.specs || '') === (specs || ''));
  if (exist) {
    exist.quantity += Number(quantity) || 1;
  } else {
    cartItems.push({
      id: `CI-${Date.now()}`,
      productId,
      quantity: Number(quantity) || 1,
      specs: specs || '',
      selected: true,
      addedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      userId: MY_PARTNERS_USER_ID,
    } as any);
  }
  const list = cartItems.filter(c => c.userId === MY_PARTNERS_USER_ID).map(enrich);
  res.json({ success: true, data: list });
});

// 修改数量
router.put('/:id', (req, res) => {
  const idx = cartItems.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: '购物车项不存在' });
  const { quantity, selected } = req.body;
  if (quantity !== undefined) (cartItems[idx] as any).quantity = Math.max(1, Number(quantity) || 1);
  if (selected !== undefined) (cartItems[idx] as any).selected = !!selected;
  const list = cartItems.filter(c => c.userId === MY_PARTNERS_USER_ID).map(enrich);
  res.json({ success: true, data: list });
});

// 删除单项
router.delete('/:id', (req, res) => {
  const idx = cartItems.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: '购物车项不存在' });
  cartItems.splice(idx, 1);
  const list = cartItems.filter(c => c.userId === MY_PARTNERS_USER_ID).map(enrich);
  res.json({ success: true, data: list });
});

// 清空
router.delete('/', (req, res) => {
  for (let i = cartItems.length - 1; i >= 0; i--) {
    if (cartItems[i].userId === MY_PARTNERS_USER_ID) cartItems.splice(i, 1);
  }
  res.json({ success: true });
});

// 结算 -> 生成订单 + 清空对应购物车项
router.post('/checkout', (req, res) => {
  const { itemIds, remark } = req.body;
  let selected = cartItems.filter(c => c.userId === MY_PARTNERS_USER_ID);
  if (itemIds && Array.isArray(itemIds) && itemIds.length > 0) {
    selected = selected.filter(c => itemIds.includes(c.id) || c.selected);
  } else {
    selected = selected.filter(c => c.selected);
  }
  if (selected.length === 0) return res.status(400).json({ success: false, message: '请先选择商品' });

  // 生成订单（用 orders 路由同样的逻辑）
  const orderItems = selected.map((c, i) => {
    const p = products.find(x => x.id === c.productId);
    return {
      id: `it-c-${Date.now()}-${i}`,
      productId: c.productId,
      title: p?.title || p?.name || '',
      specs: c.specs || '',
      price: p?.price || 0,
      quantity: c.quantity,
      image: p?.image || '',
    };
  });
  const totalAmount = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalQty = orderItems.reduce((s, i) => s + i.quantity, 0);
  const id = `ORD-${Date.now()}`;
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const newOrder = {
    id, orderNumber: `LR${Date.now()}`,
    userId: MY_PARTNERS_USER_ID,
    goods: orderItems.map(i => i.title).join('、'),
    qty: totalQty,
    amount: `¥${totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`,
    totalAmount, itemCount: totalQty,
    time: now, createTime: now,
    dist: '张晓明', distId: 'DIS-001',
    status: '待付款', statusCode: 'pending_payment',
    color: 'blue', log: 'pay',
    remark: remark || '',
    items: orderItems,
  };
  orders.unshift(newOrder as any);

  // 清空已结算购物车
  const removedIds = new Set(selected.map(s => s.id));
  for (let i = cartItems.length - 1; i >= 0; i--) {
    if (removedIds.has(cartItems[i].id)) cartItems.splice(i, 1);
  }

  res.json({ success: true, data: newOrder });
});

export default router;
