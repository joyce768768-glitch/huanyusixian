import express from 'express';
import { favoriteIds, products, MY_PARTNERS_USER_ID } from '../data/mockData';

const router = express.Router();

function getCurrentFavs() {
  // 实际生产：按用户维度存。这里 mock：favoriteIds 全局数组当作用户的收藏（用户维度在更上层区分）
  return favoriteIds;
}

// 我的收藏夹（带商品详情）
router.get('/', (req, res) => {
  const list = getCurrentFavs()
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .map(p => ({ ...p, isFavorite: true }));
  res.json({ success: true, data: list });
});

// 添加
router.post('/', (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ success: false, message: '缺少 productId' });
  const p = products.find(x => x.id === productId);
  if (!p) return res.status(404).json({ success: false, message: '商品不存在' });
  if (!favoriteIds.includes(productId)) favoriteIds.push(productId);
  if (p) p.isFavorite = true;
  res.json({ success: true, data: { ...p, isFavorite: true } });
});

// 取消收藏
router.delete('/:productId', (req, res) => {
  const idx = favoriteIds.indexOf(req.params.productId);
  if (idx > -1) favoriteIds.splice(idx, 1);
  const p = products.find(x => x.id === req.params.productId);
  if (p) p.isFavorite = false;
  res.json({ success: true });
});

// 切换
router.post('/toggle', (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ success: false, message: '缺少 productId' });
  const idx = favoriteIds.indexOf(productId);
  let isFavorite: boolean;
  if (idx > -1) { favoriteIds.splice(idx, 1); isFavorite = false; }
  else { favoriteIds.push(productId); isFavorite = true; }
  const p = products.find(x => x.id === productId);
  if (p) p.isFavorite = isFavorite;
  res.json({ success: true, data: { isFavorite } });
});

export default router;
