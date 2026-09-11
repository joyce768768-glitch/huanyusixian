import { useEffect, useState } from 'react';
import { Trash2, Minus, Plus, Loader2, ShoppingBag, Check } from 'lucide-react';
import { cartAPI } from '@shared/api';
import CheckoutDrawer from '../components/CheckoutDrawer.tsx';
import BookCover from '../components/BookCover.tsx';
import type { CartItem } from '@shared/api';
import { Order } from '../types.ts';

export default function Cart({ onBack, onOrderCreated }: { onBack: () => void; onOrderCreated?: (order: Order) => void }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [checkouting, setCheckouting] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    const res = await cartAPI.getCart();
    setLoading(false);
    if (res.success && res.data) {
      setItems(res.data.map(i => ({ ...i, selected: i.selected !== false })));
    } else {
      setError(res.message || '加载失败');
    }
  };

  const toggleCheck = async (id: string) => {
    const target = items.find(i => i.id === id);
    if (!target) return;
    const newSelected = !target.selected;
    setItems(list => list.map(i => (i.id === id ? { ...i, selected: newSelected } : i)));
    await cartAPI.updateQuantity(id, target.quantity);
  };

  const toggleSelectAll = (checked: boolean) => {
    setItems(list => list.map(i => ({ ...i, selected: checked })));
  };

  const updateQuantity = async (id: string, delta: number) => {
    const target = items.find(i => i.id === id);
    if (!target) return;
    const newQty = Math.max(1, target.quantity + delta);
    setItems(list => list.map(i => (i.id === id ? { ...i, quantity: newQty } : i)));
    const res = await cartAPI.updateQuantity(id, newQty);
    if (res.success && res.data) {
      setItems(res.data.map(i => {
        const local = items.find(x => x.id === i.id);
        return { ...i, selected: local ? local.selected : i.selected !== false };
      }));
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm('确定要删除这件商品吗？')) return;
    const res = await cartAPI.remove(id);
    if (res.success && res.data) {
      setItems(res.data.map(i => {
        const local = items.find(x => x.id === i.id);
        return { ...i, selected: local ? local.selected : i.selected !== false };
      }));
      showToast('已从购物车移除');
    }
  };

  const checkedItems = items.filter(i => i.selected);
  const subtotal = checkedItems.reduce((acc, i) => {
    const price = i.product?.price !== undefined ? i.product.price : (i as any).price || 0;
    return acc + price * i.quantity;
  }, 0);
  const shipping = subtotal > 0 ? (subtotal >= 99 ? 0 : 15) : 0;
  const total = subtotal + shipping;
  const allChecked = items.length > 0 && items.every(i => i.selected);

  const handleCheckout = async () => {
    if (checkedItems.length === 0) {
      showToast('请先选择要结算的商品');
      return;
    }
    setCheckouting(true);
    const itemIds = checkedItems.map(i => i.id);
    const res = await cartAPI.checkout({ itemIds, couponId: selectedCouponId || undefined });
    setCheckouting(false);
    if (res.success && res.data) {
      const order = res.data as unknown as Order;
      setPendingOrder(order);
      loadCart();
      setIsCheckoutOpen(true);
    } else {
      showToast(res.message || '结算失败');
    }
  };

  const handlePaid = () => {
    setIsCheckoutOpen(false);
    showToast('支付成功！');
    if (pendingOrder && onOrderCreated) onOrderCreated(pendingOrder);
    setPendingOrder(null);
    setSelectedCouponId('');
    setCouponDiscount(0);
  };

  const CheckCircle = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => (
    <div
      role="button"
      onClick={onToggle}
      aria-label={checked ? '取消选择' : '选择'}
      className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center border-2 transition-all active:scale-90 cursor-pointer ${
        checked ? 'bg-brand-gradient border-transparent text-white shadow-glow' : 'border-outline-variant text-transparent'
      }`}
    >
      <Check size={14} strokeWidth={3} />
    </div>
  );

  return (
    <div className="px-4 py-6 pb-44">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] glass-dark text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl animate-pop">
          {toast}
        </div>
      )}

      <div className="mb-5 animate-fade-up">
        <h2 className="font-serif text-2xl font-black text-on-surface">我的购物车</h2>
        <p className="text-xs text-on-surface-variant mt-1">{items.length} 件好物，正等待与你相遇</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-4 flex gap-4">
              <div className="w-24 h-24 rounded-2xl skeleton shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3.5 w-3/4 rounded skeleton" />
                <div className="h-3 w-1/3 rounded skeleton" />
                <div className="h-6 w-1/2 rounded skeleton mt-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-outline-variant rounded-3xl">
          <p className="text-sm text-on-surface-variant mb-3">{error}</p>
          <button onClick={loadCart} className="btn-primary px-6 py-2.5 text-sm">重新加载</button>
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center animate-fade-up">
          <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-5">
            <ShoppingBag className="text-outline" size={40} />
          </div>
          <h3 className="font-serif text-lg font-black text-on-surface mb-2">购物车空空如也</h3>
          <p className="text-xs text-on-surface-variant mb-6">快去挑选喜欢的绘本盲盒吧~</p>
          <button onClick={onBack} className="btn-primary px-8 py-3 text-sm">去逛逛</button>
        </div>
      ) : (
        <>
          <div className="space-y-3 stagger">
            {items.map(item => {
              const product = item.product;
              const price = product?.price !== undefined ? product.price : (item as any).price || 0;
              const title = product?.title || product?.name || (item as any).title || '商品';
              const tag = product?.tag || (product?.category ? product.category.slice(0, 6) : '精选');
              return (
                <div key={item.id} className={`card p-3 flex gap-3 transition-opacity ${item.selected ? '' : 'opacity-70'}`}>
                  <div className="flex items-center">
                    <CheckCircle checked={!!item.selected} onToggle={() => toggleCheck(item.id)} />
                  </div>

                  <BookCover
                    subject={{ id: product?.id || (item as any).productId, title, category: product?.category }}
                    className="w-[76px] h-[100px] rounded-xl shrink-0 shadow-sm"
                    showTitle={false}
                  />

                  <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-[13px] font-bold text-on-surface leading-snug line-clamp-2">{title}</h3>
                        <button onClick={() => handleRemove(item.id)} aria-label="删除" className="text-on-surface-variant/60 hover:text-error transition-colors p-0.5 shrink-0">
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary-fixed/40 text-primary text-[9px] font-bold">
                        {tag}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-1.5">
                      <span className="font-black text-primary text-sm">
                        {price > 0 ? `¥${price.toFixed(2)}` : '免费'}
                      </span>
                      <div className="flex items-center bg-surface-container rounded-full px-1.5 py-1 gap-1">
                        <button onClick={() => updateQuantity(item.id, -1)} aria-label="减少" className="w-6 h-6 flex items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-sm active:scale-90 transition-transform">
                          <Minus size={13} strokeWidth={2.6} />
                        </button>
                        <span className="font-bold text-on-surface text-xs w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} aria-label="增加" className="w-6 h-6 flex items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-sm active:scale-90 transition-transform">
                          <Plus size={13} strokeWidth={2.6} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 价格汇总 */}
          <div className="mt-4 card p-5 space-y-2.5 animate-fade-up">
            <div className="flex justify-between text-[13px] text-on-surface-variant">
              <span>商品小计</span>
              <span>¥{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[13px] text-on-surface-variant">
              <span>邮费与包装{subtotal >= 99 && subtotal > 0 ? '（满99包邮）' : ''}</span>
              <span>{shipping > 0 ? `¥${shipping.toFixed(2)}` : <span className="text-secondary font-bold">免费</span>}</span>
            </div>
            <div className="pt-3 border-t border-outline-variant/50 flex justify-between items-center">
              <span className="font-black text-on-surface">合计</span>
              <span className="text-primary font-black text-xl">¥{total.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}

      {/* ===== 悬浮结算栏（位于底部 Tab 之上）===== */}
      {!loading && !error && items.length > 0 && (
        <div className="fixed bottom-[104px] left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-4 pointer-events-none">
          <div className="pointer-events-auto glass border border-white/50 rounded-[24px] shadow-lg px-4 py-3 flex items-center justify-between">
            <button onClick={() => toggleSelectAll(!allChecked)} className="flex items-center gap-2 active:scale-95 transition-transform">
              <CheckCircle checked={allChecked} onToggle={() => toggleSelectAll(!allChecked)} />
              <span className="text-xs font-bold text-on-surface">全选</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right leading-none">
                <p className="text-[9px] text-on-surface-variant font-bold mb-1">合计</p>
                <p className="text-lg font-black text-primary leading-none">¥{total.toFixed(0)}</p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkouting || checkedItems.length === 0}
                className="btn-primary h-12 px-7 text-sm disabled:opacity-50"
              >
                {checkouting ? <Loader2 size={16} className="animate-spin" /> : `结算${checkedItems.length > 0 ? ` (${checkedItems.length})` : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <CheckoutDrawer
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        amount={pendingOrder ? pendingOrder.totalAmount || 0 : total}
        orderId={pendingOrder?.id}
        couponId={selectedCouponId}
        onCouponChange={(id, d) => { setSelectedCouponId(id); setCouponDiscount(d); }}
        onPaid={handlePaid}
      />
    </div>
  );
}
