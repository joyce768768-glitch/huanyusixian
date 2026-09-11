import { describe, it, expect } from 'vitest';

// 商品搜索 + 分类过滤（与 client/src/pages/Home.tsx visible/categories 逻辑一致）
type P = { id: string; title?: string; name?: string; description?: string; category?: string };

function buildCategories(products: P[]): string[] {
  const set = new Set<string>();
  products.forEach(p => p.category && set.add(p.category));
  return ['全部', ...Array.from(set)];
}

function filterProducts(products: P[], activeCat: string, searchQuery: string): P[] {
  let list = activeCat === '全部' ? products : products.filter(p => p.category === activeCat);
  const q = searchQuery.trim().toLowerCase();
  if (q) {
    list = list.filter(p =>
      (p.title || p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  }
  return list;
}

const sample: P[] = [
  { id: 'PRD-001', title: '森林探秘绘本', description: '走进大自然', category: '科普自然' },
  { id: 'PRD-002', title: '晚安小月亮', description: '睡前故事', category: '睡前故事' },
  { id: 'PRD-003', name: '森林音乐会', description: '动物狂欢', category: '科普自然' },
  { id: 'PRD-004', title: '国学启蒙', description: '三字经', category: '国学经典' },
];

describe('首页搜索与分类过滤', () => {
  it('分类列表首项固定为"全部"且去重', () => {
    expect(buildCategories(sample)).toEqual(['全部', '科普自然', '睡前故事', '国学经典']);
  });

  it('默认"全部"分类返回所有商品', () => {
    expect(filterProducts(sample, '全部', '')).toHaveLength(4);
  });

  it('按分类过滤 → 只返回该分类', () => {
    const r = filterProducts(sample, '科普自然', '');
    expect(r).toHaveLength(2);
    expect(r.every(p => p.category === '科普自然')).toBe(true);
  });

  it('关键词命中标题（大小写不敏感）', () => {
    const r = filterProducts(sample, '全部', '森林');
    expect(r.map(p => p.id).sort()).toEqual(['PRD-001', 'PRD-003']);
  });

  it('关键词命中描述', () => {
    expect(filterProducts(sample, '全部', '三字经').map(p => p.id)).toEqual(['PRD-004']);
  });

  it('关键词命中分类名', () => {
    expect(filterProducts(sample, '全部', '睡前')).toHaveLength(1);
  });

  it('分类 + 关键词组合过滤', () => {
    // 科普自然分类下搜"音乐"
    const r = filterProducts(sample, '科普自然', '音乐');
    expect(r.map(p => p.id)).toEqual(['PRD-003']);
  });

  it('无匹配 → 返回空数组', () => {
    expect(filterProducts(sample, '全部', '不存在的书名xyz')).toEqual([]);
  });

  it('纯空白关键词等价于不过滤', () => {
    expect(filterProducts(sample, '全部', '   ')).toHaveLength(4);
  });
});
