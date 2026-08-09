import { useEffect, useState, type MouseEvent } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { productAPI, cartAPI, favoriteAPI } from '@shared/api';
import { Product } from '../types.ts';

interface HomeProps {
  onProductClick: (product: Product) => void;
  onInvite: () => void;
}

export default function Home({ onProductClick, onInvite }: HomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

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
      setProducts(list => list.map(x => x.id === p.id ? { ...x, isFavorite: res.data!.isFavorite } : x));
      showToast(res.data.isFavorite ? '已收藏' : '已取消收藏');
    }
  };

  return (
    <div className="space-y-6 px-4 pt-4 pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-on-surface/90 text-surface px-5 py-2.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm animate-fade-in">
          {toast}
        </div>
      )}

      {/* Promotion Banner */}
      <section
        onClick={onInvite}
        className="relative h-32 rounded-2xl overflow-hidden shadow-lg squishy-active cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-container/90 z-10"></div>
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkp58lpoN4V9lFFed968Nf3W1cxGcORs_zsia98FBpPrZgIIgxQSAPvmzy7rBSZgTbLtf__7z4PsQ4M4XZAD9As1CPD3y-1d3kSQfhBKNAB2nMeirZOssBfk2SISpDVQHozjkAefyD3sf-4Z4qesh3T6jinjGOm91SqNjTshu3Vlp5HGRtb7D5dPjgTzIe6vVL8xpFQ3IkYp_KKcUFggC6ja1UUYri6L0g_nUbUaaN25a56SHnBd7vlDXQ3iUePq3P6JFhuCPB3fo"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Banner"
        />
        <div className="relative z-20 h-full flex items-center justify-between px-6 text-white">
          <div>
            <h2 className="text-xl font-bold mb-1">邀请好友赚佣金</h2>
            <p className="text-xs opacity-90">分享阅读喜悦，共赚丰厚佣金</p>
          </div>
          <button className="bg-secondary-container text-on-secondary-container px-5 py-2 rounded-full text-xs font-bold shadow-lg">
            立即邀请
          </button>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="bg-secondary-container/20 border-2 border-secondary-container/40 p-6 rounded-2xl flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-secondary">加入会员</h3>
          <p className="text-xs text-on-surface-variant">每月解锁盲盒8折优惠及包邮权益</p>
        </div>
        <button className="bg-secondary text-on-secondary px-6 py-2.5 rounded-full text-sm font-bold shadow-md squishy-active">
          立即加入
        </button>
      </section>

      {/* Selected Collection */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-on-surface">精选系列</h4>
          {error && (
            <button onClick={loadProducts} className="text-primary text-xs font-bold hover:underline">
              重试
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="mt-3 text-sm text-on-surface-variant">正在加载绘本...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-outline-variant rounded-2xl">
            <p className="text-sm text-on-surface-variant mb-3">{error}</p>
            <button onClick={loadProducts} className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-bold">
              重新加载
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col squishy-active cursor-pointer"
              >
                <div className="relative aspect-square">
                  <img src={product.image} className="w-full h-full object-cover" alt={product.title || product.name} />
                  {product.tag && product.tag !== '超值优惠' && (
                    <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
                      {product.tag}
                    </div>
                  )}
                  {product.tag === '超值优惠' && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
                      免费领
                    </div>
                  )}
                  {/* 收藏小按钮 */}
                  <button
                    onClick={(e) => handleToggleFav(e, product)}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm ${
                      product.isFavorite
                        ? 'bg-rose-500/90 text-white'
                        : 'bg-black/20 text-white hover:bg-black/40'
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={product.isFavorite ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-grow gap-2">
                  <h5 className="text-sm font-bold text-on-surface leading-tight line-clamp-1">
                    {product.title || product.name}
                  </h5>
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1">
                      {product.price > 0 ? (
                        <>
                          <span className="text-primary font-bold text-lg">¥{product.price}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-on-surface-variant text-[10px] line-through opacity-50">
                              ¥{product.originalPrice}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-rose-500 font-black text-lg">免费</span>
                      )}
                    </div>
                    <p className="text-on-surface-variant text-[10px] italic">会员价</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={(e) => handleAddCart(e, product)}
                        className="p-2 bg-secondary-container text-on-secondary-container rounded-xl hover:brightness-105 transition-all squishy-active"
                      >
                        <ShoppingCart size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddCart(e, product); }}
                        className="flex-1 py-1.5 rounded-xl text-xs font-bold hover:brightness-105 transition-all bg-primary text-on-primary"
                      >
                        立即购买
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
