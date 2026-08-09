import { useState } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { PRODUCTS } from '../data.ts';
import CheckoutDrawer from '../components/CheckoutDrawer.tsx';

export default function Cart({ onBack }: { onBack: () => void }) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [items, setItems] = useState([
    { 
      id: '1', 
      title: '森林童话盲盒', 
      tag: '4-6岁', 
      price: 0, 
      quantity: 1, 
      checked: true,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuActPHOjranVyTfqV9s4HABFQvBEctsoAOAqtmmC7SmZEGogTyUG47C_4TRyRkJURKNi8dTYxFgROtrpvzZj4N9hJI0FJPUdP-8RqDzJCvBYhSrl54HOTuNAVzsHce4dbBWFUDrt4i18PBC4y6l1MDSf5QPvox2H6tqwOOgNUaPZ-rfaqPhF2Qg3IGeBdZlzmqGS3A6Y4PqFZK8mHedEdEm79Y2PWRx7ySUy57Zjw0L34A2emBdrJkYyjNFRL-o3duf-aXIKXtoyMA'
    },
    { 
      id: '2', 
      title: '太空探险套装', 
      tag: '热销爆款', 
      price: 0, 
      quantity: 1, 
      checked: true,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDrUDZXGfPFKwru2v6fRYXuXrqcLTkfu9HNWbJTbG9rySUIOQPL570aIg1i1UvcmdWJBPS2RVgjtbp9QzJ3mFS9jzZw7UK9JJbtYC1Gz5eqmnfTIWY8qzTOJSImuNnzqBLEz60bTvpp3GGJBS-58PlFmPiLH-MCvruOOh-OQUsyZcjr8wUCgfO5IZqMO09AgBnQI8l93LOjxGiHTPZgRLEONmaIB_pYoYaa3JitmRHcSBLHBDnRzPdDHUvMVmC1GxZCzoJj-UzOtE'
    },
    { 
      id: '3', 
      title: '贴纸大冒险', 
      tag: '2-4岁', 
      price: 15, 
      quantity: 2, 
      checked: false,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCqMtzySk8ap8mYRxfKXl_cz_G8E3xOwChb4ip99M2KxUBInYs4bkwHLPD_491AvqaIyGfyReDdHrPhD_LHOr1K4okWBIQqIaGEewqBEOjlQkJY2mlOjAYYjVFDUi7grFuZ0aZCXvd7_TwjODqzCibM-e_cok7IrDEPBnxtRf1-k-I-X4RfPPexkXAZ14ayiNZvp9iMeDVrtIM_ZK1oZEhI1b07A8q_VIGFgsnfLSg74bQ5U3J60VFH7zVTX_LenJEacYOIhknXgU'
    },
  ]);

  const toggleCheck = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const subtotal = items.filter(i => i.checked).reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? 30 : 0;
  const total = subtotal + shipping;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary mb-1">我的购物车</h2>
        <p className="text-xs text-on-surface-variant">{items.length} 件商品正在等待它们的新家</p>
      </div>

      <div className="space-y-4 mb-32">
        {items.map((item) => (
          <div key={item.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex gap-4 shadow-sm group">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={item.checked} 
                onChange={() => toggleCheck(item.id)}
                className="w-5 h-5 rounded-md border-outline text-primary focus:ring-primary cursor-pointer"
              />
            </div>
            
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container shrink-0">
              <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
            </div>

            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-on-surface leading-tight line-clamp-1">{item.title}</h3>
                  <button className="text-on-surface-variant hover:text-error transition-colors p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[9px] font-bold uppercase tracking-wider">
                  {item.tag}
                </span>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-primary text-sm">¥{item.price.toFixed(2)}</span>
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
        ))}

        {/* Summary Block */}
        <div className="mt-8 p-5 bg-surface-container-low rounded-2xl space-y-3">
          <div className="flex justify-between text-on-surface-variant text-xs">
            <span>小计</span>
            <span>¥{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant text-xs">
            <span>邮费与包装</span>
            <span>¥{shipping.toFixed(2)}</span>
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
              checked={items.every(i => i.checked)}
              onChange={(e) => setItems(items.map(i => ({ ...i, checked: e.target.checked })))}
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
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-secondary-container text-on-secondary-container font-black px-8 py-3 rounded-full shadow-md squishy-active transition-all hover:brightness-105 active:scale-90"
            >
              结算
            </button>
          </div>
        </div>
      </div>

      <CheckoutDrawer 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        amount={total} 
      />
    </div>
  );
}
