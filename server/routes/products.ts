import express from 'express';
import { products, DEFAULT_COVER } from '../data/mockData';

const router = express.Router();

// 商品列表（支持 category/keyword/tag 多条件筛选 + 分页）
router.get('/', (req, res) => {
  const { category, keyword, tag, page = 1, pageSize = 20 } = req.query;

  let filtered = products.filter(p => (p as any).status !== 'offline');

  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (tag) {
    filtered = filtered.filter(p => p.tag === tag);
  }
  if (keyword) {
    const kw = String(keyword).toLowerCase();
    filtered = filtered.filter(p =>
      (p.name || '').toLowerCase().includes(kw) ||
      (p.title || '').toLowerCase().includes(kw) ||
      (p.id || '').toLowerCase().includes(kw) ||
      (p.category || '').toLowerCase().includes(kw) ||
      (p.tag || '').toLowerCase().includes(kw)
    );
  }

  const total = filtered.length;
  const start = (Number(page) - 1) * Number(pageSize);
  const end = start + Number(pageSize);
  const paginated = filtered.slice(start, end).map(p => ({
    ...p,
    name: p.name || p.title,
  }));

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

// 商品详情
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ success: false, message: '商品不存在' });
  res.json({
    success: true,
    data: { ...product, name: product.name || product.title },
  });
});

// 创建商品
router.post('/', (req, res) => {
  const { name, title, description, category, price, originalPrice, stock, image, tag } = req.body;
  if (!name && !title) return res.status(400).json({ success: false, message: '商品名称必填' });
  if (price === undefined || price === null) return res.status(400).json({ success: false, message: '价格必填' });

  const newProduct = {
    id: `PRD-${Date.now()}`,
    name: name || title,
    title: title || name,
    description: description || '',
    category: category || '未分类',
    price: Number(price),
    originalPrice: originalPrice !== undefined ? Number(originalPrice) : Number(price),
    stock: stock !== undefined ? Number(stock) : 0,
    sold: 0,
    status: 'online' as const,
    image: image || DEFAULT_COVER,
    tag: tag || '',
  };
  products.push(newProduct as any);
  res.json({ success: true, data: newProduct });
});

// 商品上下架（快捷接口）
router.put('/:id/status', (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: '商品不存在' });
  const { status } = req.body;
  if (!['online', 'offline'].includes(status)) {
    return res.status(400).json({ success: false, message: 'status 必须为 online 或 offline' });
  }
  (products[idx] as any).status = status;
  res.json({ success: true, data: products[idx] });
});

// 更新商品
router.put('/:id', (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: '商品不存在' });
  const fields = ['name', 'title', 'description', 'category', 'price', 'originalPrice', 'stock', 'status', 'image', 'tag'] as const;
  fields.forEach(f => {
    let v = req.body[f];
    if (v !== undefined) {
      // 图片不允许被置为空串，兜底为默认封面，避免前端 <img src="">
      if (f === 'image' && (v === '' || v === null)) v = DEFAULT_COVER;
      (products[idx] as any)[f] = f === 'price' || f === 'originalPrice' || f === 'stock' ? Number(v) : v;
    }
  });
  if (req.body.name && !products[idx].title) (products[idx] as any).title = req.body.name;
  if (req.body.title && !products[idx].name)  (products[idx] as any).name  = req.body.title;
  res.json({ success: true, data: products[idx] });
});

// 删除商品
router.delete('/:id', (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: '商品不存在' });
  const removed = products.splice(idx, 1)[0];
  res.json({ success: true, data: removed });
});

export default router;
