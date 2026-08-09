import { useState } from 'react';
import { ORDERS } from '../data.ts';
import { OrderStatus } from '../types.ts';

export default function Orders({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'pending_payment', label: '待付款' },
    { id: 'pending_delivery', label: '待收货' },
    { id: 'completed', label: '已完成' },
  ];

  const filteredOrders = activeTab === 'all' 
    ? ORDERS 
    : ORDERS.filter(o => o.status === activeTab);

  return (
    <div className="px-4 py-6">
      {/* Search icon and back logic are in global header */}
      
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

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm squishy-active cursor-pointer">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-on-surface-variant">订单号：{order.orderNumber}</span>
              <span className={`text-xs font-bold ${
                order.status === 'pending_payment' ? 'text-primary' : 
                order.status === 'pending_delivery' ? 'text-tertiary' : 
                'text-on-surface-variant opacity-60'
              }`}>
                {order.status === 'pending_payment' ? '待付款' : 
                 order.status === 'pending_delivery' ? '待收货' : '已完成'}
              </span>
            </div>

            <div className="flex gap-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 w-full">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-outline-variant/30">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-sm font-bold text-on-surface truncate">{item.title}</h3>
                    <p className="text-[10px] text-on-surface-variant mt-1">规格：{item.specs}</p>
                    <div className="flex justify-between items-end mt-4">
                      <span className="text-[10px] text-on-surface-variant">共{item.quantity}件商品</span>
                      <div className="text-right">
                        <span className="text-[10px] text-on-surface-variant">合计：</span>
                        <span className="text-base font-bold text-primary">¥{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {order.status === 'pending_payment' ? (
                <>
                  <button className="px-6 py-2 rounded-full border border-outline text-on-surface-variant text-xs font-bold active:bg-surface-container transition-colors">取消订单</button>
                  <button className="px-6 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-md squishy-active">立即付款</button>
                </>
              ) : order.status === 'pending_delivery' ? (
                <>
                  <button className="px-6 py-2 rounded-full border border-outline text-on-surface-variant text-xs font-bold active:bg-surface-container transition-colors">查看物流</button>
                  <button className="px-6 py-2 rounded-full bg-secondary text-white text-xs font-bold shadow-md squishy-active">确认收货</button>
                </>
              ) : (
                <>
                  <button className="px-6 py-2 rounded-full border border-outline text-on-surface-variant text-xs font-bold active:bg-surface-container transition-colors">再次购买</button>
                  <button className="px-6 py-2 rounded-full border border-outline text-on-surface-variant text-xs font-bold active:bg-surface-container transition-colors">评价分享</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
