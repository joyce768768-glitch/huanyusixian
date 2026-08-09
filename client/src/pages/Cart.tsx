import { useEffect, useState } from 'react';
import { Trash2, Minus, Plus, Loader2, ShoppingBag } from 'lucide-react';
import { cartAPI, cartAPI as cartApiType, orderAPI } from '@shared/api';
import CheckoutDrawer from '../components/CheckoutDrawer.tsx';
import type { CartItem } from '@shared/api';
import { Order } from '../types.ts';

const MY_USER_ID = 'USR-CLIENT-001';

export default function Cart({ onBack, onOrderCreated }: { onBack: () => void; onOrderCreated?: (order: Order) => void }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [checkouting, setCheckouting] = useState(false);
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
    setItems(list => list.map(i => i.id === id ? { ...i, selected: newSelected } : i));
    await cartAPI.updateQuantity(id, target.quantity); // 同步选中到后端（后端按 stored selected）
  };

  const toggleSelectAll = (checked: boolean) => {
    setItems(list => list.map(i => ({ ...i, selected: checked })));
  };

  const updateQuantity = async (id: string, delta: number) => {
    const target = items.find(i => i.id === id);
    if (!target) return;
    const newQty = Math.max(1, target.quantity + delta);
    setItems(list => list.map(i => i.id === id ? { ...i, quantity: newQty } : i));
    const res = await cartAPI.updateQuantity(id, newQty);
    if (res.success && res.data) {
      // 后端返回最新购物车（含价格/商品详情）同步
      setItems(res.data.map(i => {
        const local = items.find(x => x.id === i.id);
        return { ...i, selected: local ? local.selected : i.selected !== false };
      }));
    }
  };

  const handleRemove = async (id: string) => {
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
    const price = (i.product?.price !== undefined) ? i.product.price : (i as any).price || 0;
    return acc + price * i.quantity;
  }, 0);
  const shipping = subtotal > 0 ? (subtotal >= 99 ? 0 : 15) : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (checkedItems.length === 0) {
      showToast('请先选择要结算的商品');
      return;
    }
    setCheckouting(true);
    // 先调用 /cart/checkout 生成待付款订单
    const itemIds = checkedItems.map(i => i.id);
    const res = await cartAPI.checkout({ itemIds });
    setCheckouting(false);
    if (res.success && res.data) {
      const order = res.data as unknown as Order;
      setPendingOrder(order);
      // 刷新购物车（已结算项被清空）
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
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-on-surface/90 text-surface px-5 py-2.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm">
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary mb-1">我的购物车</h2>
        <p className="text-xs text-on-surface-variant">{items.length} 件商品正在等待它们的新家</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="mt-3 text-sm text-on-surface-variant">正在加载购物车...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-outline-variant rounded-2xl">
          <p className="text-sm text-on-surface-variant mb-3">{error}</p>
          <button onClick={loadCart} className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-bold">
            重新加载
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 border-2 border-dashed border-outline-variant rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="bg-surface-container p-5 rounded-full mb-5">
            <ShoppingBag className="text-outline" size={40} />
          </div>
          <h3 className="text-base font-bold text-on-surface mb-2">购物车空空如也</h3>
          <p className="text-xs text-on-surface-variant mb-6">快去挑选喜欢的绘本吧~</p>
          <button
            onClick={onBack}
            className="bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-bold shadow-md squishy-active"
          >
            去逛逛
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-32">
            {items.map((item) => {
              const product = item.product;
              const price = (product?.price !== undefined) ? product.price : (item as any).price || 0;
              const title = product?.title || product?.name || (item as any).title || '商品';
              const image = product?.image || (item as any).image || '';
              const tag = product?.tag || (product?.category ? product.category.slice(0, 6) : '精选');
              return (
                <div key={item.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex gap-4 shadow-sm group">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!!item.selected}
                      onChange={() => toggleCheck(item.id)}
                      className="w-5 h-5 rounded-md border-outline text-primary focus:ring-primary cursor-pointer"
                    />
                  </div>

                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container shrink-0">
                    <img src={image} className="w-full h-full object-cover" alt={title} />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-on-surface leading-tight line-clamp-1">{title}</h3>
                        <button onClick={() => handleRemove(item.id)} className="text-on-surface-variant hover:text-error transition-colors p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary-fixed/10 text-primary text-[9px] font-bold uppercase tracking-wider">
                        {tag}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-primary text-sm">
                        {price > 0 ? `¥${price.toFixed(2)}` : '免费'}
                      </span>
                      <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1 gap-4 border border-outline-variant/10">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-primary squishy-active"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-on-surface text-xs w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-primary squishy-active"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Summary Block */}
            <div className="mt-8 p-5 bg-surface-container-low rounded-2xl space-y-3">
              <div className="flex justify-between text-on-surface-variant text-xs">
                <span>小计</span>
                <span>¥{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant text-xs">
                <span>邮费与包装{subtotal >= 99 && subtotal > 0 ? '（满99包邮）' : ''}</span>
                <span>{shipping > 0 ? `¥${shipping.toFixed(2)}` : '免费'}</span>
              </div>
              <div className="pt-3 border-t border-outline-variant/30 flex justify-between items-center">
                <span className="text-base font-bold text-on-surface">总计</span>
                <span className="text-lg font-bold text-primary">¥{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Bar */}
          <div className="fixed bottom-20 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant px-4 py-4 z-40">
            <div className="max-w-lg mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="selectAll"
                  type="checkbox"
                  checked={items.length > 0 && items.every(i => i.selected)}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="w-5 h-5 rounded-md border-outline text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="selectAll" className="text-xs font-bold text-on-surface cursor-pointer">全选</label>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[9px] text-on-surface-variant uppercase font-bold leading-none mb-1">合计</p>
                  <p className="text-lg font-bold text-primary leading-none">¥{total.toFixed(2)}</p>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkouting || checkedItems.length === 0}
                  className="bg-secondary-container text-on-secondary-container font-black px-8 py-3 rounded-full shadow-md squishy-active transition-all hover:brightness-105 active:scale-90 disabled:opacity-50 flex items-center gap-2"
                >
                  {checkouting ? <Loader2 size={16} className="animate-spin" /> : null}
                  结算{checkedItems.length > 0 ? `(${checkedItems.length})` : ''}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <CheckoutDrawer
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        amount={pendingOrder ? (pendingOrder.totalAmount || 0) : total}
        orderId={pendingOrder?.id}
        onPaid={handlePaid}
      />
    </div>
  );
}
