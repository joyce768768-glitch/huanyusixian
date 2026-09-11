import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { Search, Gift, Sparkles, Plus, Flame } from 'lucide-react';
import { productAPI, cartAPI, favoriteAPI } from '@shared/api';
import { Product } from '../types.ts';
import BookCover from '../components/BookCover.tsx';

interface HomeProps {
  onProductClick: (product: Product) => void;
  onInvite: () => void;
}

export default function Home({ onProductClick, onInvite }: HomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    const res = await productAPI.getProducts({ pageSize: 50 });
    setLoading(false);
    if (res.success && res.data) {
      setProducts(res.data);
    } else {
      setError(res.message || '加载失败，请下拉重试');
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => p.category && set.add(p.category));
    return ['全部', ...Array.from(set)];
  }, [products]);

  const visible = useMemo(() => {
    let list = activeCat === '全部' ? products : products.filter(p => p.category === activeCat);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(p =>
        (p.title || p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, activeCat, searchQuery]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  const handleAddCart = async (e: MouseEvent, p: Product) => {
    e.stopPropagation();
    const res = await cartAPI.add(p.id, 1);
    if (res.success) showToast('已加入购物车');
    else showToast(res.message || '加入失败');
  };

  const handleToggleFav = async (e: MouseEvent, p: Product) => {
    e.stopPropagation();
    const res = await favoriteAPI.toggle(p.id);
    if (res.success && res.data) {
      setProducts(list => list.map(x => (x.id === p.id ? { ...x, isFavorite: res.data!.isFavorite } : x)));
      showToast(res.data.isFavorite ? '已收藏' : '已取消收藏');
    }
  };

  return (
    <div className="px-4 pt-4 pb-6">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] glass-dark text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl animate-pop">
          {toast}
        </div>
      )}

      {/* ===== 品牌 Hero ===== */}
      <section
        onClick={onInvite}
        className="relative overflow-hidden rounded-[28px] bg-brand-gradient text-white p-6 shadow-lg squishy-active cursor-pointer animate-fade-up"
      >
        <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/15 blur-xl" />
        <div className="absolute -bottom-12 -left-6 w-36 h-36 rounded-full bg-black/10 blur-lg" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-white/20 backdrop-blur px-2.5 py-1 rounded-full">
            <Sparkles size={11} /> 限时 · 邀请有礼
          </span>
          <h2 className="mt-3 font-serif text-2xl font-black leading-tight">
            开盒有惊喜<br />让孩子爱上阅读
          </h2>
          <p className="mt-1.5 text-xs text-white/85">精选绘本盲盒，每一本都是未知的惊喜</p>
          <button className="mt-4 bg-white text-primary text-xs font-black px-5 py-2.5 rounded-full shadow-md inline-flex items-center gap-1.5 active:scale-95 transition-transform">
            <Gift size={14} /> 邀请好友赚佣金
          </button>
        </div>
        <div className="absolute right-4 bottom-3 opacity-90 animate-float">
          <div className="w-20 h-24 rounded-xl bg-white/20 backdrop-blur border border-white/30 rotate-6 shadow-xl" />
        </div>
      </section>

      {/* ===== 搜索条 ===== */}
      <div className="mt-4 flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/50 rounded-full px-4 py-3 shadow-sm animate-fade-up">
        <Search size={17} className="text-on-surface-variant" />
        <input
          placeholder="搜索绘本 / 盲盒 / 作者"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-on-surface-variant/70"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ===== 分类横滑 ===== */}
      <div className="mt-5 -mx-4 px-4 flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map(cat => {
          const active = cat === activeCat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                active
                  ? 'bg-on-surface text-surface shadow-md'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ===== 精选系列 ===== */}
      <div className="mt-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-serif text-lg font-black text-on-surface">
          <Flame size={18} className="text-primary" /> 精选系列
        </h3>
        {error && (
          <button onClick={loadProducts} className="text-primary text-xs font-bold">
            重试
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="aspect-[3/4] skeleton" />
              <div className="p-4 space-y-2">
                <div className="h-3.5 w-4/5 rounded skeleton" />
                <div className="h-4 w-1/2 rounded skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-4 flex flex-col items-center justify-center py-20 border-2 border-dashed border-outline-variant rounded-3xl">
          <p className="text-sm text-on-surface-variant mb-3">{error}</p>
          <button onClick={loadProducts} className="btn-primary px-6 py-2.5 text-sm">
            重新加载
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4 stagger">
          {visible.map(product => (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
              className="card overflow-hidden flex flex-col cursor-pointer transition-shadow hover:shadow-md group"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <BookCover
                  subject={product}
                  className="w-full h-full transition-transform duration-700 group-hover:scale-[1.03]"
                />
                {product.tag && product.tag !== '超值优惠' && (
                  <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur text-on-surface px-2.5 py-1 rounded-full text-[9px] font-black shadow-sm z-10">
                    {product.tag}
                  </span>
                )}
                {product.tag === '超值优惠' && (
                  <span className="absolute top-2.5 left-2.5 bg-gold-gradient text-on-gold px-2.5 py-1 rounded-full text-[9px] font-black shadow-sm z-10">
                    免费领
                  </span>
                )}
                <button
                  onClick={(e) => handleToggleFav(e, product)}
                  aria-label="收藏"
                  className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-90 z-10 ${
                    product.isFavorite ? 'bg-primary text-white' : 'bg-black/30 text-white'
                  }`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={product.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              <div className="p-3.5 flex flex-col flex-grow gap-1.5">
                <h5 className="text-[13px] font-bold text-on-surface leading-snug line-clamp-2 min-h-[2.6em]">
                  {product.title || product.name}
                </h5>
                <div className="mt-auto flex items-end justify-between pt-1">
                  <div className="leading-none">
                    {product.price > 0 ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-primary font-black text-lg">¥{product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-on-surface-variant text-[10px] line-through opacity-50">
                            ¥{product.originalPrice}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-rose-500 font-black text-lg">免费</span>
                    )}
                    <p className="text-[9px] text-on-surface-variant mt-1">会员专享价</p>
                  </div>
                  <button
                    onClick={(e) => handleAddCart(e, product)}
                    aria-label="加入购物车"
                    className="w-9 h-9 shrink-0 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-glow active:scale-90 transition-transform"
                  >
                    <Plus size={18} strokeWidth={2.6} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <div className="mt-10 text-center text-sm text-on-surface-variant py-16">该分类暂无商品</div>
      )}

      <p className="mt-8 text-center text-[10px] text-on-surface-variant/60">— 寰宇思贤 · 绘本盲盒 —</p>
    </div>
  );
}
