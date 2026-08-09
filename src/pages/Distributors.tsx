import { PARTNERS } from '../data.ts';
import { Users, TrendingUp, Receipt, Wallet, ArrowRight, Search, Award } from 'lucide-react';

export default function Distributors({ onBack, onInvite }: { onBack: () => void, onInvite: () => void }) {
  const stats = [
    { label: '活跃分销商', value: '86', color: 'text-primary' },
    { label: '销售总额', value: '¥125,680', color: 'text-secondary' },
    { label: '待付佣金', value: '¥3,420', color: 'text-primary' },
    { label: '累计订单', value: '1,842', color: 'text-tertiary' },
  ];

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      {/* Top Banner Card */}
      <section className="mb-8">
        <div 
          onClick={onInvite}
          className="bg-[#FFB300] rounded-2xl p-6 shadow-md border border-secondary/10 flex items-center justify-between gap-4 cursor-pointer squishy-active"
        >
          <div className="flex-1">
            <h2 className="text-sm font-black text-on-surface mb-1">邀请好友赚更多佣金</h2>
            <p className="text-[10px] text-on-surface opacity-70 leading-relaxed font-medium">成功邀请新伙伴，最高获 20% 佣金。</p>
          </div>
          <button className="bg-black text-white px-5 py-2.5 rounded-full text-[10px] font-black shadow-lg">
            立即邀请
          </button>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-2 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-bold text-on-surface-variant block mb-1 opacity-70">{stat.label}</span>
            <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </section>

      {/* Partner List */}
      <section className="space-y-4 pb-12">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-black text-on-surface">合作伙伴</h3>
          <Search size={16} className="text-outline cursor-pointer" />
        </div>
        
        {PARTNERS.map((partner) => (
          <div key={partner.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:scale-[1.01] transition-transform flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-outline-variant/50">
                <img src={partner.avatar} className="w-full h-full object-cover" alt={partner.name} />
              </div>
              {partner.level === '高级伙伴' && (
                <div className="absolute -bottom-1 -right-1 bg-black text-white rounded-full p-1 border-2 border-surface-container-lowest">
                  <Award size={10} fill="currentColor" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-sm font-black text-on-surface">{partner.name}</h3>
                  <span className="text-[9px] font-bold text-on-surface-variant opacity-60">加入：{partner.joinDate}</span>
                </div>
                <div className={`px-2.5 py-1 rounded-full ${partner.level === '高级伙伴' ? 'bg-black text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                  <span className="text-[8px] font-black">{partner.level}</span>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-on-surface-variant opacity-50 uppercase tracking-tighter">销售额</span>
                  <span className="text-xs font-black text-primary">¥{partner.sales.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-on-surface-variant opacity-50 uppercase tracking-tighter">订单数</span>
                  <span className="text-xs font-black text-tertiary">{partner.orderCount} 单</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
