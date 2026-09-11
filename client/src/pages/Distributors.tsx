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
      <section className="mb-7">
        <div
          onClick={onInvite}
          className="bg-gold-gradient text-on-gold rounded-[24px] p-6 shadow-glow flex items-center justify-between gap-4 cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="flex-1">
            <h2 className="font-serif text-base font-black mb-1">邀请好友赚佣金</h2>
            <p className="text-[11px] opacity-80 leading-relaxed font-medium">
              成功邀请新伙伴，最高获 20% 佣金。当前已邀请 <span className="font-black">{partners.length}</span> 位
            </p>
          </div>
          <button className="bg-brand-gradient text-white px-5 py-2.5 rounded-full text-[11px] font-black shadow-md flex items-center gap-1 shrink-0">
            立即邀请 <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-2 gap-3 mb-8">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="card rounded-2xl p-5 space-y-2">
              <div className="h-3 w-20 bg-surface-container rounded animate-pulse" />
              <div className="h-6 w-24 bg-surface-container rounded animate-pulse" />
            </div>
          ))
        ) : (
          stats.map((stat) => (
            <div key={stat.label} className="card rounded-2xl p-5">
              <span className="text-[11px] font-bold text-on-surface-variant block mb-1">{stat.label}</span>
              <span className={`font-serif text-lg font-black ${stat.color}`}>{stat.value}</span>
            </div>
          ))
        )}
      </section>

      {/* Partner List */}
      <section className="space-y-3 pb-12">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-serif text-base font-black text-on-surface">合作伙伴（{partners.length}）</h3>
          <Search size={17} className="text-outline cursor-pointer" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : partners.length === 0 ? (
          <div className="py-16 border-2 border-dashed border-outline-variant/50 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="bg-surface-container p-4 rounded-full mb-4">
              <Users className="text-outline" size={32} />
            </div>
            <p className="text-sm text-on-surface-variant">还没有分销伙伴</p>
            <button
              onClick={onInvite}
              className="mt-5 btn-primary px-8 py-3 rounded-full text-sm"
            >
              去邀请
            </button>
          </div>
        ) : (
          partners.map((partner) => {
            const isSenior = (partner.level || '').includes('高级');
            return (
              <div key={partner.id} className="card rounded-2xl p-4 flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-outline-variant/50 bg-surface-container">
                    {partner.avatar ? (
                      <img src={partner.avatar} className="w-full h-full object-cover" alt={partner.name} />
                    ) : (
                      <img src={defaultAvatar} className="w-full h-full object-cover opacity-60" alt={partner.name} />
                    )}
                  </div>
                  {isSenior && (
                    <div className="absolute -bottom-1 -right-1 bg-gold-gradient text-on-gold rounded-full p-1 border-2 border-surface-container-lowest">
                      <Award size={10} fill="currentColor" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-black text-on-surface">{partner.name}</h3>
                      <span className="text-[10px] font-bold text-on-surface-variant">
                        加入：{partner.joinDate || partner.regTime || '未知'}
                      </span>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full ${isSenior ? 'bg-gold-gradient text-on-gold' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      <span className="text-[9px] font-black">{partner.level || '普通伙伴'}</span>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-on-surface-variant">销售额</span>
                      <span className="text-xs font-black text-primary">¥{(partner.sales || partner.revenue || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-on-surface-variant">订单数</span>
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
