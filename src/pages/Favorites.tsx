import { ShoppingCart, HeartOff, Store } from 'lucide-react';
import { PRODUCTS } from '../data.ts';
import { Product } from '../types.ts';

interface FavoritesProps {
  onProductClick: (product: Product) => void;
  onBack: () => void;
}

export default function Favorites({ onProductClick, onBack }: FavoritesProps) {
  const favoriteProducts = PRODUCTS.filter(p => p.isFavorite);

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {favoriteProducts.map((product) => (
          <div 
            key={product.id}
            className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant flex flex-col md:flex-row gap-6 items-center md:items-stretch group"
          >
            <div 
              onClick={() => onProductClick(product)}
              className="w-full md:w-32 aspect-square rounded-xl overflow-hidden border border-outline-variant flex-shrink-0 cursor-pointer"
            >
              <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.title} />
            </div>
            
            <div className="flex-grow flex flex-col justify-between w-full">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-bold text-on-surface leading-tight line-clamp-2">{product.title}</h3>
                  <span className="bg-secondary/10 text-secondary text-[10px] px-3 py-1 rounded-full font-bold whitespace-nowrap">
                    {product.tag}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">{product.description}</p>
                <div className="mt-3">
                  <span className="text-primary font-bold text-lg">¥ {product.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 px-4 py-3 bg-primary text-white text-xs font-bold rounded-full shadow-md squishy-active flex items-center justify-center gap-2">
                  <ShoppingCart size={16} />
                  加入购物车
                </button>
                <button className="px-5 py-3 border border-outline-variant text-on-surface-variant text-xs font-bold rounded-full hover:bg-surface-container-high squishy-active flex items-center justify-center gap-2">
                  <HeartOff size={16} />
                  取消收藏
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Discover more empty state */}
      <div className="mt-12 py-16 border-2 border-dashed border-outline-variant rounded-3xl flex flex-col items-center justify-center text-center opacity-60">
        <div className="bg-surface-container p-4 rounded-full mb-4">
          <Store className="text-outline" size={32} />
        </div>
        <p className="text-sm font-medium text-on-surface">发现更多精彩绘本</p>
        <button className="mt-4 text-primary font-black hover:underline squishy-active">
          去商店逛逛
        </button>
      </div>
    </div>
  );
}
