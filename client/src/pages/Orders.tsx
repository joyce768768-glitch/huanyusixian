import { useEffect, useState } from 'react';
import { orderAPI } from '@shared/api';
import { Order, OrderStatus, OrderStatusLabel } from '../types.ts';
import { Loader2, Package } from 'lucide-react';

const MY_USER_ID = 'USR-CLIENT-001';

export default function Orders({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // orderId
  const [toast, setToast] = useState<string | null>(null);

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'pending_payment', label: '待付款' },
    { id: 'pending_delivery', label: '待发货' },
    { id: 'shipped', label: '待收货' },
    { id: 'completed', label: '已完成' },
  ];

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    const params: any = { userId: MY_USER_ID, pageSize: 50 };
    if (activeTab !== 'all') params.status = activeTab;
    const res = await orderAPI.getOrders(params);
    setLoading(false);
    if (res.success && res.data) {
      setOrders(res.data.map(normalizeOrder));
    } else {
      setError(res.message || '加载失败');
    }
  };

  function normalizeOrder(o: any): Order {
    // 兼容后端返回的 statusCode/中文字段
    const code: OrderStatus = o.statusCode || mapLabelToCode(o.status) || 'pending_payment';
    return {
      ...o,
      status: code,
      items: o.items || [],
      totalAmount: o.totalAmount ?? 0,
    };
  }

  function mapLabelToCode(label: string): OrderStatus | null {
    for (const [code, l] of Object.entries(OrderStatusLabel)) {
      if (l === label) return code as OrderStatus;
    }
    return null;
  }

  const statusStyle = (s: OrderStatus) => {
    switch (s) {
      case 'pending_payment': return 'text-primary';
      case 'pending_delivery': return 'text-amber-600';
      case 'shipped': return 'text-violet-600';
      case 'completed': return 'text-emerald-600';
      case 'refunded': return 'text-rose-600';
      case 'cancelled': return 'text-slate-500';
      default: return 'text-on-surface-variant';
    }
  };

  const handlePay = async (order: Order) => {
    setActionLoading(order.id + ':pay');
    const res = await orderAPI.payOrder(order.id);
    setActionLoading(null);
    if (res.success) {
      showToast('支付成功');
      setOrders(list => list.map(o => o.id === order.id ? { ...o, status: 'pending_delivery' as OrderStatus } : o));
    } else {
      showToast(res.message || '支付失败');
    }
  };

  const handleCancel = async (order: Order) => {
    setActionLoading(order.id + ':cancel');
    const res = await orderAPI.cancelOrder(order.id);
    setActionLoading(null);
    if (res.success) {
      showToast('订单已取消');
      setOrders(list => list.map(o => o.id === order.id ? { ...o, status: 'cancelled' as OrderStatus } : o));
    } else {
      showToast(res.message || '操作失败');
    }
  };

  const handleReceive = async (order: Order) => {
    setActionLoading(order.id + ':receive');
    const res = await orderAPI.confirmReceive(order.id);
    setActionLoading(null);
    if (res.success) {
      showToast('已确认收货');
      setOrders(list => list.map(o => o.id === order.id ? { ...o, status: 'completed' as OrderStatus } : o));
    } else {
      showToast(res.message || '操作失败');
    }
  };

  const statusBadgeColor = (s: OrderStatus) => {
    switch (s) {
      case 'pending_payment': return 'bg-primary/10 text-primary';
      case 'pending_delivery': return 'bg-amber-500/10 text-amber-600';
      case 'shipped': return 'bg-violet-500/10 text-violet-600';
      case 'completed': return 'bg-emerald-500/10 text-emerald-600';
      case 'refunded': return 'bg-rose-500/10 text-rose-600';
      case 'cancelled': return 'bg-slate-500/10 text-slate-500';
      default: return 'bg-secondary/10 text-secondary';
    }
  };

  return (
    <div className="px-4 py-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-on-surface/90 text-surface px-5 py-2.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm">
          {toast}
        </div>
      )}

      <div className="flex gap-6 mb-8 overflow-x-auto scrollbar-hide border-b border-outline-variant/30 sticky top-16 bg-background z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2 py-3 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'text-primary border-primary'
                : 'text-on-surface-variant border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="mt-3 text-sm text-on-surface-variant">正在加载订单...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-outline-variant rounded-2xl">
          <p className="text-sm text-on-surface-variant mb-3">{error}</p>
          <button onClick={loadOrders} className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-bold">
            重新加载
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-24 border-2 border-dashed border-outline-variant rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="bg-surface-container p-5 rounded-full mb-5">
            <Package className="text-outline" size={40} />
          </div>
          <h3 className="text-base font-bold text-on-surface mb-2">还没有相关订单</h3>
          <p className="text-xs text-on-surface-variant mb-6">快去挑选心仪的绘本下单吧~</p>
          <button
            onClick={onBack}
            className="bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-bold shadow-md squishy-active"
          >
            去逛逛
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const firstItem = order.items?.[0];
            const orderTime = (order as any).time || (order as any).createTime || '';
            return (
              <div key={order.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-on-surface-variant font-mono">订单号：{order.orderNumber || order.id}</span>
                    {orderTime && <span className="text-[10px] text-on-surface-variant opacity-70">{orderTime}</span>}
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${statusBadgeColor(order.status)}`}>
                    {OrderStatusLabel[order.status] || order.status}
                  </span>
                </div>

                {order.items && order.items.length > 0 ? (
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 w-full">
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-outline-variant/30 bg-surface-container">
                          {item.image ? (
                            <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-outline">
                              <Package size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0 py-1">
                          <h3 className="text-sm font-bold text-on-surface truncate">{item.title}</h3>
                          {item.specs && <p className="text-[10px] text-on-surface-variant mt-1">规格：{item.specs}</p>}
                          <div className="flex justify-between items-end mt-3">
                            <span className="text-[10px] text-on-surface-variant">×{item.quantity}</span>
                            <span className="text-xs font-bold text-on-surface">¥{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  firstItem && (
                    <div className="flex gap-4 w-full">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-outline-variant/30 bg-surface-container">
                        {firstItem.image ? (
                          <img src={firstItem.image} className="w-full h-full object-cover" alt={firstItem.title} />
                        ) : null}
                      </div>
                      <div className="flex-grow min-w-0 py-1">
                        <h3 className="text-sm font-bold text-on-surface truncate">{firstItem.title}</h3>
                        {firstItem.specs && <p className="text-[10px] text-on-surface-variant mt-1">规格：{firstItem.specs}</p>}
                      </div>
                    </div>
                  )
                )}

                {/* 合计行 */}
                <div className="mt-5 pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">
                    共{order.items?.reduce((s, i) => s + i.quantity, 0) || order.itemCount || 1}件商品
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-on-surface-variant mr-1">实付：</span>
                    <span className="text-base font-bold text-primary">¥{(order.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-3 flex-wrap">
                  {order.status === 'pending_payment' ? (
                    <>
                      <button
                        onClick={() => handleCancel(order)}
                        disabled={actionLoading === order.id + ':cancel'}
                        className="px-5 py-2 rounded-full border border-outline-variant text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {actionLoading === order.id + ':cancel' ? <Loader2 size={12} className="animate-spin" /> : null}
                        取消订单
                      </button>
                      <button
                        onClick={() => handlePay(order)}
                        disabled={actionLoading === order.id + ':pay'}
                        className="px-5 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-md squishy-active disabled:opacity-50 flex items-center gap-1"
                      >
                        {actionLoading === order.id + ':pay' ? <Loader2 size={12} className="animate-spin text-white" /> : null}
                        立即付款
                      </button>
                    </>
                  ) : order.status === 'pending_delivery' ? (
                    <button className="px-5 py-2 rounded-full border border-outline-variant text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-colors">
                      待发货
                    </button>
                  ) : order.status === 'shipped' ? (
                    <>
                      <button className="px-5 py-2 rounded-full border border-outline-variant text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-colors">
                        查看物流
                      </button>
                      <button
                        onClick={() => handleReceive(order)}
                        disabled={actionLoading === order.id + ':receive'}
                        className="px-5 py-2 rounded-full bg-secondary text-on-secondary text-xs font-bold shadow-md squishy-active disabled:opacity-50 flex items-center gap-1"
                      >
                        {actionLoading === order.id + ':receive' ? <Loader2 size={12} className="animate-spin" /> : null}
                        确认收货
                      </button>
                    </>
                  ) : order.status === 'completed' ? (
                    <>
                      <button className="px-5 py-2 rounded-full border border-outline-variant text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-colors">
                        再次购买
                      </button>
                      <button className="px-5 py-2 rounded-full border border-outline-variant text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-colors">
                        评价分享
                      </button>
                    </>
                  ) : order.status === 'cancelled' ? (
                    <button className="px-5 py-2 rounded-full border border-outline-variant text-on-surface-variant text-xs font-bold">
                      已取消
                    </button>
                  ) : order.status === 'refunded' ? (
                    <button className="px-5 py-2 rounded-full border border-outline-variant text-on-surface-variant text-xs font-bold">
                      已退款
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
