import { useEffect, useState } from 'react';
import { distributorAPI } from '@shared/api';
import type { Distributor } from '../types.ts';
import { Users, ArrowRight, Search, Award, Loader2 } from 'lucide-react';

export default function Distributors({ onBack, onInvite }: { onBack: () => void, onInvite: () => void }) {
  const [partners, setPartners] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await distributorAPI.getMyPartners({ pageSize: 50 });
    setLoading(false);
    if (res.success && res.data) setPartners(res.data);
  };

  const totalSales = partners.reduce((s, p) => s + (p.sales || p.revenue || 0), 0);
  const totalOrders = partners.reduce((s, p) => s + (p.orderCount || p.orders || 0), 0);
  const activeCount = partners.filter(p => (p.level || '').includes('高级') || (p.status || 'active') === 'active').length;

  const stats = [
    { label: '活跃伙伴', value: String(activeCount), color: 'text-primary' },
    { label: '销售总额', value: `¥${totalSales.toLocaleString()}`, color: 'text-secondary' },
    { label: '待付佣金', value: `¥${Math.round(totalSales * 0.12).toLocaleString()}`, color: 'text-primary' },
    { label: '累计订单', value: String(totalOrders), color: 'text-tertiary' },
  ];

  const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgWmpDiLPENXfaovmAjWRH9D9Jq-nyTyRYqV3ayQvbuBWAl5Mn2ufKUGeLMwhIh8OWiHh8JGc1mPOF4mAqqwP46xHSP4M4D95cmwPNCwoZpXlKNyjj4QKRe74AQuGvPgbHWOhNWVTuFUvIYokdf1XxyfsHEKdsb1XcDbgmrDaEJ-5UifMtx0F86UAk7u2esLAYOGzUTclAGv7BoEOhUGZaixG7-8ugLfeL9wPisAMJIp5BL5YnLXn432spf8MhmJjk0AUhAsn-2PI';

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
            <p className="text-[10px] text-on-surface opacity-70 leading-relaxed font-medium">
              成功邀请新伙伴，最高获 20% 佣金。当前已邀请 <span className="font-black">{partners.length}</span> 位
            </p>
          </div>
          <button className="bg-black text-white px-5 py-2.5 rounded-full text-[10px] font-black shadow-lg flex items-center gap-1">
            立即邀请 <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-2 gap-4 mb-10">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="h-3 w-20 bg-surface-container rounded animate-pulse" />
              <div className="h-6 w-24 bg-surface-container rounded animate-pulse" />
            </div>
          ))
        ) : (
          stats.map((stat) => (
            <div key={stat.label} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-bold text-on-surface-variant block mb-1 opacity-70">{stat.label}</span>
              <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
            </div>
          ))
        )}
      </section>

      {/* Partner List */}
      <section className="space-y-4 pb-12">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-black text-on-surface">合作伙伴（{partners.length}）</h3>
          <Search size={16} className="text-outline cursor-pointer" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : partners.length === 0 ? (
          <div className="py-16 border-2 border-dashed border-outline-variant rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="bg-surface-container p-4 rounded-full mb-4">
              <Users className="text-outline" size={32} />
            </div>
            <p className="text-sm text-on-surface-variant">还没有分销伙伴</p>
            <button
              onClick={onInvite}
              className="mt-5 bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-bold shadow-md"
            >
              去邀请
            </button>
          </div>
        ) : (
          partners.map((partner) => {
            const isSenior = (partner.level || '').includes('高级');
            return (
              <div key={partner.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:scale-[1.01] transition-transform flex items-center gap-5">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-outline-variant/50 bg-surface-container">
                    {partner.avatar ? (
                      <img src={partner.avatar} className="w-full h-full object-cover" alt={partner.name} />
                    ) : (
                      <img src={defaultAvatar} className="w-full h-full object-cover opacity-60" alt={partner.name} />
                    )}
                  </div>
                  {isSenior && (
                    <div className="absolute -bottom-1 -right-1 bg-black text-white rounded-full p-1 border-2 border-surface-container-lowest">
                      <Award size={10} fill="currentColor" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-black text-on-surface">{partner.name}</h3>
                      <span className="text-[9px] font-bold text-on-surface-variant opacity-60">
                        加入：{partner.joinDate || partner.regTime || '未知'}
                      </span>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full ${isSenior ? 'bg-black text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      <span className="text-[8px] font-black">{partner.level || '普通伙伴'}</span>
                    </div>
                  </div>

                  <div className="flex gap-8">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-on-surface-variant opacity-50 uppercase tracking-tighter">销售额</span>
                      <span className="text-xs font-black text-primary">¥{(partner.sales || partner.revenue || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-on-surface-variant opacity-50 uppercase tracking-tighter">订单数</span>
                      <span className="text-xs font-black text-tertiary">{(partner.orderCount || partner.orders || 0)} 单</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
