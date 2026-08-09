import { useState } from 'react';
import { ArrowLeft, Minus, Plus, Heart, Truck, Sparkles, ShoppingCart } from 'lucide-react';
import { Product } from '../types.ts';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);

  const price = product.price;
  const originalPrice = product.originalPrice;
  const shipping = 15;
  const total = (price * quantity) + shipping;

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Hero Section */}
      <section className="relative aspect-square overflow-hidden bg-surface-container-low group">
        <img 
          src={product.image} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
          alt={product.title} 
        />
        
        {/* Transparent Overlay Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center z-50">
          <button 
            onClick={onBack}
            className="bg-black/20 backdrop-blur-md text-white p-2.5 rounded-full squishy-active flex items-center justify-center hover:bg-black/40 transition-all border border-white/10"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Badge */}
        <div className="absolute bottom-6 left-6 bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-black shadow-sm flex items-center gap-2">
          <Sparkles size={14} fill="currentColor" fillOpacity={0.4} />
          惊喜盲盒
        </div>
      </section>

      {/* Details Section */}
      <section className="px-6 pt-8 space-y-8">
        <div>
          <h2 className="text-2xl font-black text-on-surface leading-snug">{product.title}</h2>
          <p className="text-sm text-on-surface-variant mt-3 leading-relaxed opacity-80">{product.description}</p>
        </div>

        {/* Price Card */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-sm">
          <div className="flex items-baseline gap-3">
            <span className="text-primary font-black text-3xl">¥{price}</span>
            {originalPrice > price && (
              <span className="text-on-surface-variant line-through text-sm opacity-50">¥{originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 text-on-surface-variant text-xs font-bold opacity-70">
            <Truck size={16} />
            <span>运费: ¥{shipping.toFixed(2)}</span>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/20 shadow-inner">
          <h3 className="text-base font-black text-primary mb-6 flex items-center gap-2">
            <Sparkles size={18} fill="currentColor" fillOpacity={0.3} />
            选择规格数量
          </h3>
          
          <div className="flex items-center justify-between py-6 border-y border-outline-variant/30 mb-6">
            <span className="text-on-surface font-bold text-sm">购买数量</span>
            <div className="flex items-center bg-surface-container-low rounded-full p-1 border border-outline-variant/20 shadow-sm">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container-high transition-colors squishy-active"
              >
                <Minus size={18} />
              </button>
              <span className="w-10 text-center font-black text-on-surface text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container-high transition-colors squishy-active"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-on-surface-variant">商品金额</span>
              <span className="text-on-surface">¥{(price * quantity).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-on-surface-variant">邮费与包装</span>
              <span className="text-on-surface">¥{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20 mt-4">
              <span className="text-on-surface font-black text-base">总计</span>
              <span className="text-primary font-black text-2xl">¥{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant px-6 py-5 z-50 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md bg-white/90">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-3 rounded-full transition-all squishy-active border ${
              isFavorite ? 'bg-primary/5 border-primary/20 text-primary' : 'text-on-surface-variant border-outline-variant'
            }`}
          >
            <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          
          <button className="flex-1 font-black py-4 rounded-full text-sm squishy-active transition-all bg-[#FFD700] text-[#1a1c1a] shadow-md hover:bg-[#E6C200] flex items-center justify-center gap-2">
            <ShoppingCart size={18} />
            加入购物车
          </button>
          
          <button className="flex-1 font-black py-4 rounded-full text-sm shadow-xl squishy-active transition-opacity hover:opacity-95 bg-primary text-on-primary">
            立即购买
          </button>
        </div>
      </div>
    </div>
  );
}
