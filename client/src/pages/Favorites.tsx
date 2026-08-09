import { useEffect, useState } from 'react';
import { ShoppingCart, HeartOff, Store, Loader2 } from 'lucide-react';
import { favoriteAPI, cartAPI } from '@shared/api';
import { Product } from '../types.ts';

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
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-on-surface/90 text-surface px-5 py-2.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm">
          {toast}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="mt-3 text-sm text-on-surface-variant">正在加载收藏夹...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-outline-variant rounded-2xl">
          <p className="text-sm text-on-surface-variant mb-3">{error}</p>
          <button onClick={loadFavorites} className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-bold">
            重新加载
          </button>
        </div>
      ) : favorites.length === 0 ? (
        <div className="py-24 border-2 border-dashed border-outline-variant rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="bg-surface-container p-5 rounded-full mb-5">
            <Store className="text-outline" size={40} />
          </div>
          <h3 className="text-base font-bold text-on-surface mb-2">还没有收藏的绘本哦</h3>
          <p className="text-xs text-on-surface-variant mb-6">快去挑选喜欢的绘本加入收藏吧~</p>
          <button
            onClick={onBack}
            className="bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-bold shadow-md squishy-active"
          >
            去逛逛
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {favorites.map((product) => (
            <div
              key={product.id}
              className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant flex flex-col md:flex-row gap-6 items-center md:items-stretch group"
            >
              <div
                onClick={() => onProductClick(product)}
                className="w-full md:w-32 aspect-square rounded-xl overflow-hidden border border-outline-variant flex-shrink-0 cursor-pointer"
              >
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.title || product.name} />
              </div>

              <div className="flex-grow flex flex-col justify-between w-full">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-lg font-bold text-on-surface leading-tight line-clamp-2">
                      {product.title || product.name}
                    </h3>
                    {product.tag && (
                      <span className="bg-secondary/10 text-secondary text-[10px] px-3 py-1 rounded-full font-bold whitespace-nowrap">
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">{product.description}</p>
                  <div className="mt-3">
                    {product.price > 0 ? (
                      <span className="text-primary font-bold text-lg">¥ {product.price.toFixed(2)}</span>
                    ) : (
                      <span className="text-rose-500 font-black text-lg">免费</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleAddCart(product)}
                    className="flex-1 px-4 py-3 bg-primary text-white text-xs font-bold rounded-full shadow-md squishy-active flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    加入购物车
                  </button>
                  <button
                    onClick={() => handleRemoveFav(product.id)}
                    className="px-5 py-3 border border-outline-variant text-on-surface-variant text-xs font-bold rounded-full hover:bg-surface-container-high squishy-active flex items-center justify-center gap-2"
                  >
                    <HeartOff size={16} />
                    取消收藏
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && favorites.length > 0 && (
        <div className="mt-12 py-16 border-2 border-dashed border-outline-variant rounded-3xl flex flex-col items-center justify-center text-center opacity-60">
          <div className="bg-surface-container p-4 rounded-full mb-4">
            <Store className="text-outline" size={32} />
          </div>
          <p className="text-sm font-medium text-on-surface">发现更多精彩绘本</p>
          <button onClick={onBack} className="mt-4 text-primary font-black hover:underline squishy-active">
            去商店逛逛
          </button>
        </div>
      )}
    </div>
  );
}
