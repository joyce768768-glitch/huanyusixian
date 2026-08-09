import { useState } from 'react';
import { ArrowLeft, Minus, Plus, Heart, Truck, Sparkles, ShoppingCart, Loader2 } from 'lucide-react';
import { cartAPI, favoriteAPI } from '@shared/api';
import { Product } from '../types.ts';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const [toast, setToast] = useState<string | null>(null);
  const [addingCart, setAddingCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);

  const price = product.price || 0;
  const originalPrice = product.originalPrice || 0;
  const shipping = price > 0 ? 15 : 0;
  const total = (price * quantity) + shipping;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  const handleToggleFav = async () => {
    if (togglingFav) return;
    setTogglingFav(true);
    const res = await favoriteAPI.toggle(product.id);
    setTogglingFav(false);
    if (res.success && res.data) {
      setIsFavorite(res.data.isFavorite);
      showToast(res.data.isFavorite ? '已加入收藏' : '已取消收藏');
    } else {
      showToast(res.message || '操作失败');
    }
  };

  const handleAddCart = async () => {
    if (addingCart) return;
    setAddingCart(true);
    const res = await cartAPI.add(product.id, quantity);
    setAddingCart(false);
    if (res.success) {
      showToast(`已加入购物车 ×${quantity}`);
    } else {
      showToast(res.message || '加入失败');
    }
  };

  const handleBuyNow = async () => {
    if (buyingNow) return;
    setBuyingNow(true);
    // 先加购物车再跳转到 cart 页面（简化流程：加购物车后提示）
    const res = await cartAPI.add(product.id, quantity);
    setBuyingNow(false);
    if (res.success) {
      showToast('已为您准备好，请到购物车结算');
    } else {
      showToast(res.message || '下单失败');
    }
  };

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-on-surface/90 text-surface px-5 py-2.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm">
          {toast}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative aspect-square overflow-hidden bg-surface-container-low group">
        <img
          src={product.image}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          alt={product.title || product.name}
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

        {/* 销量标签 */}
        {product.sold !== undefined && product.sold > 0 && (
          <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
            已售 {product.sold.toLocaleString()}
          </div>
        )}
      </section>

      {/* Details Section */}
      <section className="px-6 pt-8 space-y-8">
        <div>
          <h2 className="text-2xl font-black text-on-surface leading-snug">
            {product.title || product.name}
          </h2>
          {product.tag && (
            <div className="mt-3 flex gap-2">
              <span className="bg-primary/10 text-primary text-[11px] px-3 py-1 rounded-full font-bold">
                {product.tag}
              </span>
              {product.category && (
                <span className="bg-secondary/10 text-secondary text-[11px] px-3 py-1 rounded-full font-bold">
                  {product.category}
                </span>
              )}
            </div>
          )}
          <p className="text-sm text-on-surface-variant mt-4 leading-relaxed opacity-80">
            {product.description}
          </p>
        </div>

        {/* Price Card */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-sm">
          <div className="flex items-baseline gap-3">
            {price > 0 ? (
              <>
                <span className="text-primary font-black text-3xl">¥{price}</span>
                {originalPrice > price && (
                  <span className="text-on-surface-variant line-through text-sm opacity-50">¥{originalPrice.toFixed(2)}</span>
                )}
              </>
            ) : (
              <span className="text-rose-500 font-black text-3xl">免费领取</span>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 text-on-surface-variant text-xs font-bold opacity-70">
            <Truck size={16} />
            <span>运费: {shipping > 0 ? `¥${shipping.toFixed(2)}` : '包邮'}</span>
            {product.stock !== undefined && (
              <span className="ml-4">库存: {product.stock.toLocaleString()}</span>
            )}
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
              <span className="text-on-surface">{shipping > 0 ? `¥${shipping.toFixed(2)}` : '免费'}</span>
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
            onClick={handleToggleFav}
            disabled={togglingFav}
            className={`p-3 rounded-full transition-all squishy-active border flex items-center justify-center ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-500'
                : 'text-on-surface-variant border-outline-variant'
            } ${togglingFav ? 'opacity-60' : ''}`}
          >
            {togglingFav ? <Loader2 size={22} className="animate-spin" /> : <Heart size={22} fill={isFavorite ? 'currentColor' : 'none'} />}
          </button>

          <button
            onClick={handleAddCart}
            disabled={addingCart}
            className="flex-1 font-black py-4 rounded-full text-sm squishy-active transition-all bg-[#FFD700] text-[#1a1c1a] shadow-md hover:bg-[#E6C200] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {addingCart ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
            加入购物车
          </button>

          <button
            onClick={handleBuyNow}
            disabled={buyingNow}
            className="flex-1 font-black py-4 rounded-full text-sm shadow-xl squishy-active transition-opacity hover:opacity-95 bg-primary text-on-primary disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {buyingNow ? <Loader2 size={18} className="animate-spin text-white" /> : null}
            立即购买
          </button>
        </div>
      </div>
    </div>
  );
}
