import { useState } from 'react';
import { ArrowLeft, Minus, Plus, Heart, Truck, Sparkles, ShoppingCart, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';
import { cartAPI, favoriteAPI, orderAPI } from '@shared/api';
import { Product, Order } from '../types.ts';
import BookCover from '../components/BookCover.tsx';
import CheckoutDrawer from '../components/CheckoutDrawer.tsx';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onOrderCreated?: () => void;
}

export default function ProductDetail({ product, onBack, onOrderCreated }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const [toast, setToast] = useState<string | null>(null);
  const [addingCart, setAddingCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  const price = product.price || 0;
  const originalPrice = product.originalPrice || 0;
  const shipping = price > 0 ? 15 : 0;
  const total = price * quantity + shipping;

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
    if (res.success) showToast(`已加入购物车 ×${quantity}`);
    else showToast(res.message || '加入失败');
  };

  const handleBuyNow = () => {
    if (buyingNow) return;
    setIsCheckoutOpen(true);
  };

  const handlePaid = async () => {
    setIsCheckoutOpen(false);
    showToast('支付成功！');
    setPendingOrder(null);
    setSelectedCouponId('');
    setCouponDiscount(0);
    onOrderCreated?.();
  };

  return (
    <div className="bg-background min-h-full pb-36">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] glass-dark text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl animate-pop">
          {toast}
        </div>
      )}

      {/* ===== 顶部悬浮返回 ===== */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 p-4 pt-safe">
        <button
          onClick={onBack}
          aria-label="返回"
          className="glass-dark text-white w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-lg"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* ===== 主图：立式书封 ===== */}
      <section className="relative overflow-hidden pt-24 pb-12 px-6 bg-gradient-to-b from-primary-fixed/70 via-surface-container-low to-background">
        <div className="absolute -top-16 -left-10 w-48 h-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute top-10 -right-12 w-52 h-52 rounded-full bg-gold/20 blur-3xl pointer-events-none" />

        {/* 书封投影底座 */}
        <div className="relative flex justify-center animate-fade-up">
          <div className="absolute bottom-1 w-[62%] h-6 bg-black/20 blur-xl rounded-full" />
          <BookCover
            subject={product}
            className="relative w-[62%] max-w-[240px] aspect-[3/4] rounded-[14px] shadow-2xl ring-1 ring-black/10"
          />
        </div>

        <span className="absolute top-24 left-4 glass-dark text-white px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg">
          <Sparkles size={13} /> 惊喜盲盒
        </span>
        {product.sold !== undefined && product.sold > 0 && (
          <span className="absolute top-24 right-4 glass-dark text-white px-3 py-1.5 rounded-full text-[11px] font-bold">
            已售 {product.sold.toLocaleString()}
          </span>
        )}
      </section>

      {/* ===== 信息上拉卡片 ===== */}
      <section className="relative -mt-6 rounded-t-[28px] bg-background px-5 pt-6 pb-6 space-y-5 animate-fade-up">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif text-xl font-black text-on-surface leading-snug flex-1">
              {product.title || product.name}
            </h2>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {product.tag && (
              <span className="bg-primary/10 text-primary text-[10px] px-2.5 py-1 rounded-full font-bold">{product.tag}</span>
            )}
            {product.category && product.category !== product.tag && (
              <span className="bg-secondary/10 text-secondary text-[10px] px-2.5 py-1 rounded-full font-bold">{product.category}</span>
            )}
          </div>
          <p className="text-[13px] text-on-surface-variant mt-3 leading-relaxed">{product.description}</p>
        </div>

        {/* 价格卡片 */}
        <div className="card-elevated p-5 bg-brand-gradient text-white border-0">
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              {price > 0 ? (
                <>
                  <span className="text-3xl font-black leading-none">¥{price}</span>
                  {originalPrice > price && (
                    <span className="text-white/70 line-through text-sm">¥{originalPrice.toFixed(0)}</span>
                  )}
                </>
              ) : (
                <span className="text-3xl font-black">免费领取</span>
              )}
            </div>
            <span className="bg-white/20 backdrop-blur text-[10px] font-bold px-2.5 py-1 rounded-full">会员专享</span>
          </div>
          <div className="mt-3 flex items-center gap-4 text-[11px] text-white/90 font-medium">
            <span className="flex items-center gap-1"><Truck size={13} /> {shipping > 0 ? `运费 ¥${shipping.toFixed(0)}` : '包邮'}</span>
            {product.stock !== undefined && <span>库存 {product.stock.toLocaleString()}</span>}
          </div>
        </div>

        {/* 数量 */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-on-surface">购买数量</h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">盲盒随机发货，多件不重复</p>
            </div>
            <div className="flex items-center bg-surface-container rounded-full p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="减少"
                className="w-9 h-9 flex items-center justify-center rounded-full text-primary bg-surface-container-lowest shadow-sm active:scale-90 transition-transform"
              >
                <Minus size={16} strokeWidth={2.6} />
              </button>
              <span className="w-9 text-center font-black text-on-surface text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="增加"
                className="w-9 h-9 flex items-center justify-center rounded-full text-primary bg-surface-container-lowest shadow-sm active:scale-90 transition-transform"
              >
                <Plus size={16} strokeWidth={2.6} />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-outline-variant/50 space-y-2">
            <div className="flex justify-between text-[13px] text-on-surface-variant">
              <span>商品金额</span>
              <span>¥{(price * quantity).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[13px] text-on-surface-variant">
              <span>邮费与包装</span>
              <span>{shipping > 0 ? `¥${shipping.toFixed(2)}` : '免费'}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-black text-on-surface">合计</span>
              <span className="text-primary font-black text-2xl">¥{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 服务保障 */}
        <div className="flex items-center justify-around card p-4 text-[11px] text-on-surface-variant font-medium">
          <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-secondary" /> 正品保障</span>
          <span className="flex items-center gap-1.5"><RefreshCw size={15} className="text-secondary" /> 7天无理由</span>
          <span className="flex items-center gap-1.5"><Truck size={15} className="text-secondary" /> 极速发货</span>
        </div>
      </section>

      {/* ===== 底部悬浮操作栏 ===== */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 px-4 pb-4 pb-safe pointer-events-none">
        <div className="pointer-events-auto glass border border-white/50 rounded-[26px] shadow-lg px-3 py-3 flex items-center gap-3">
          <button
            onClick={handleToggleFav}
            disabled={togglingFav}
            aria-label="收藏"
            className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
              isFavorite ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-surface-container-lowest border-outline-variant/60 text-on-surface-variant'
            }`}
          >
            {togglingFav ? <Loader2 size={20} className="animate-spin" /> : <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />}
          </button>

          <button
            onClick={handleAddCart}
            disabled={addingCart}
            className="flex-1 h-12 font-black text-sm rounded-full bg-surface-container-highest text-on-surface active:scale-[0.97] transition-transform disabled:opacity-60 flex items-center justify-center gap-1.5"
          >
            {addingCart ? <Loader2 size={17} className="animate-spin" /> : <ShoppingCart size={17} />}
            加入购物车
          </button>

          <button
            onClick={handleBuyNow}
            disabled={buyingNow}
            className="flex-1 h-12 font-black text-sm rounded-full btn-primary disabled:opacity-60 flex items-center justify-center"
          >
            {buyingNow ? <Loader2 size={17} className="animate-spin" /> : '立即购买'}
          </button>
        </div>
      </div>

      <CheckoutDrawer
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        amount={pendingOrder ? pendingOrder.totalAmount || total : total}
        orderId={pendingOrder?.id}
        couponId={selectedCouponId}
        onCouponChange={(id, d) => { setSelectedCouponId(id); setCouponDiscount(d); }}
        onConfirm={async () => {
          const res = await orderAPI.createOrder({
            items: [{ productId: product.id, quantity }],
            couponId: selectedCouponId || undefined,
          });
          if (res.success && res.data) {
            setPendingOrder(res.data);
            return { orderId: res.data.id };
          }
          return { error: res.message || '下单失败' };
        }}
        onPaid={handlePaid}
      />
    </div>
  );
}
