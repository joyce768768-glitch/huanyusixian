import { ShoppingCart } from 'lucide-react';
import { PRODUCTS } from '../data.ts';
import { Product } from '../types.ts';

interface HomeProps {
  onProductClick: (product: Product) => void;
  onInvite: () => void;
}

export default function Home({ onProductClick, onInvite }: HomeProps) {
  return (
    <div className="space-y-6 px-4 pt-4 pb-12">
      {/* Promotion Banner */}
      <section 
        onClick={onInvite}
        className="relative h-32 rounded-2xl overflow-hidden shadow-lg squishy-active cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-container/90 z-10"></div>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkp58lpoN4V9lFFed968Nf3W1cxGcORs_zsia98FBpPrZgIIgxQSAPvmzy7rBSZgTbLtf__7z4PsQ4M4XZAD9As1CPD3y-1d3kSQfhBKNAB2nMeirZOssBfk2SISpDVQHozjkAefyD3sf-4Z4qesh3T6jinjGOm91SqNjTshu3Vlp5HGRtb7D5dPjgTzIe6vVL8xpFQ3IkYp_KKcUFggC6ja1UUYri6L0g_nUbUaaN25a56SHnBd7vlDXQ3iUePq3P6JFhuCPB3fo" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Banner"
        />
        <div className="relative z-20 h-full flex items-center justify-between px-6 text-white">
          <div>
            <h2 className="text-xl font-bold mb-1">邀请好友赚佣金</h2>
            <p className="text-xs opacity-90">分享阅读喜悦，共赚丰厚佣金</p>
          </div>
          <button className="bg-secondary-container text-on-secondary-container px-5 py-2 rounded-full text-xs font-bold shadow-lg">
            立即邀请
          </button>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="bg-secondary-container/20 border-2 border-secondary-container/40 p-6 rounded-2xl flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-secondary">加入会员</h3>
          <p className="text-xs text-on-surface-variant">每月解锁盲盒8折优惠及包邮权益</p>
        </div>
        <button className="bg-secondary text-on-secondary px-6 py-2.5 rounded-full text-sm font-bold shadow-md squishy-active">
          立即加入
        </button>
      </section>

      {/* Selected Collection */}
      <section className="space-y-4">
        <h4 className="text-lg font-bold text-on-surface">精选系列</h4>
        <div className="grid grid-cols-2 gap-4">
          {PRODUCTS.map((product) => (
            <div 
              key={product.id}
              onClick={() => onProductClick(product)}
              className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col squishy-active cursor-pointer"
            >
              <div className="relative aspect-square">
                <img src={product.image} className="w-full h-full object-cover" alt={product.title} />
                {product.tag === '超值优惠' && (
                  <div className="absolute top-2 left-2 bg-primary text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {product.tag}
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow gap-2">
                <h5 className="text-sm font-bold text-on-surface leading-tight line-clamp-1">{product.title}</h5>
                <div className="mt-auto">
                  <div className="flex items-baseline gap-1">
                    <span className="text-primary font-bold text-lg">¥{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-on-surface-variant text-[10px] line-through opacity-50">¥{product.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-on-surface-variant text-[10px] italic">会员价</p>
                  <div className="mt-3 flex gap-2">
                    <button className="p-2 bg-secondary-container text-on-secondary-container rounded-xl hover:brightness-105 transition-all">
                      <ShoppingCart size={14} />
                    </button>
                    <button className="flex-1 py-1.5 rounded-xl text-xs font-bold hover:brightness-105 transition-all bg-primary text-on-primary">
                      立即购买
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
