import { useEffect, useState } from 'react';
import { ShoppingCart, HeartOff, Store, Loader2 } from 'lucide-react';
import { favoriteAPI, cartAPI } from '@shared/api';
import { Product } from '../types.ts';
import BookCover from '../components/BookCover.tsx';

interface FavoritesProps {
  onProductClick: (product: Product) => void;
  onBack: () => void;
}

export default function Favorites({ onProductClick, onBack }: FavoritesProps) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    const res = await favoriteAPI.getFavorites();
    setLoading(false);
    if (res.success && res.data) {
      setFavorites(res.data);
    } else {
      setError(res.message || '加载失败');
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  const handleRemoveFav = async (productId: string) => {
    const res = await favoriteAPI.remove(productId);
    if (res.success) {
      setFavorites(list => list.filter(p => p.id !== productId));
      showToast('已取消收藏');
    }
  };

  const handleAddCart = async (product: Product) => {
    const res = await cartAPI.add(product.id, 1);
    if (res.success) showToast('已加入购物车');
    else showToast(res.message || '加入失败');
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] glass-dark text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl animate-pop">
          {toast}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="mt-3 text-sm text-on-surface-variant">正在加载收藏夹...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-outline-variant/50 rounded-3xl">
          <p className="text-sm text-on-surface-variant mb-3">{error}</p>
          <button onClick={loadFavorites} className="btn-primary px-6 py-2 rounded-full text-sm">
            重新加载
          </button>
        </div>
      ) : favorites.length === 0 ? (
        <div className="py-20 border-2 border-dashed border-outline-variant/50 rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="bg-surface-container p-5 rounded-full mb-5">
            <Store className="text-outline" size={40} />
          </div>
          <h3 className="font-serif text-base font-black text-on-surface mb-2">还没有收藏的绘本哦</h3>
          <p className="text-xs text-on-surface-variant mb-6">快去挑选喜欢的绘本加入收藏吧~</p>
          <button
            onClick={onBack}
            className="bg-brand-gradient text-white px-8 py-3 rounded-full text-sm font-black shadow-glow active:scale-95 transition-transform"
          >
            去逛逛
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {favorites.map((product) => (
            <div
              key={product.id}
              className="card p-3 flex gap-3.5 items-stretch group"
            >
              <div
                onClick={() => onProductClick(product)}
                className="w-[104px] h-[138px] rounded-xl overflow-hidden shrink-0 cursor-pointer shadow-sm"
              >
                <BookCover subject={product} className="w-full h-full" showTitle={false} />
              </div>

              <div className="flex-grow flex flex-col justify-between w-full">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif text-base font-black text-on-surface leading-tight line-clamp-2">
                      {product.title || product.name}
                    </h3>
                    {product.tag && (
                      <span className="bg-secondary/10 text-secondary text-[10px] px-2.5 py-1 rounded-full font-bold whitespace-nowrap">
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-2">{product.description}</p>
                  <div className="mt-2">
                    {product.price > 0 ? (
                      <span className="text-primary font-black text-lg">¥{product.price.toFixed(2)}</span>
                    ) : (
                      <span className="text-secondary font-black text-lg">免费</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2.5 mt-4">
                  <button
                    onClick={() => handleAddCart(product)}
                    className="flex-1 px-4 py-2.5 bg-brand-gradient text-white text-xs font-black rounded-full shadow-glow active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={15} />
                    加入购物车
                  </button>
                  <button
                    onClick={() => handleRemoveFav(product.id)}
                    className="px-5 py-2.5 border border-outline-variant/60 text-on-surface-variant text-xs font-bold rounded-full active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    <HeartOff size={15} />
                    取消
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && favorites.length > 0 && (
        <div className="mt-8 py-14 border-2 border-dashed border-outline-variant/50 rounded-3xl flex flex-col items-center justify-center text-center opacity-70">
          <div className="bg-surface-container p-4 rounded-full mb-4">
            <Store className="text-outline" size={32} />
          </div>
          <p className="text-sm font-bold text-on-surface">发现更多精彩绘本</p>
          <button onClick={onBack} className="mt-3 text-primary font-black active:scale-95 transition-transform">
            去商店逛逛 →
          </button>
        </div>
      )}
    </div>
  );
}
