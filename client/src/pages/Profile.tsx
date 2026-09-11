import { useEffect, useState } from 'react';
import { ChevronRight, Heart, Wallet, Users, MapPin, Headphones, Settings, Star, CreditCard, Box, Truck, Crown, Ticket, ShieldCheck, ChevronRight as Arrow } from 'lucide-react';
import { PageId } from '../App.tsx';
import { memberAPI, orderAPI, walletAPI, distributorAPI, authAPI } from '@shared/api';
import { Member } from '../types.ts';

const MY_USER_ID = 'USR-CLIENT-001';

interface ProfileProps {
  onNavigate: (page: PageId) => void;
  onInvite: () => void;
}

export default function Profile({ onNavigate, onInvite }: ProfileProps) {
  const [member, setMember] = useState<Member | null>(null);
  const [wallet, setWallet] = useState<{ balance?: number; totalIncome?: number } | null>(null);
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>({});
  const [partnerCount, setPartnerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  const menuItems = [
    { id: 'favorites', label: '我的收藏', sub: '心仪好物', icon: Heart },
    { id: 'wallet', label: '我的钱包', sub: '余额与收益', icon: Wallet },
    { id: 'coupons', label: '我的优惠券', sub: '可用优惠', icon: Ticket },
    { id: 'distributors', label: '分销伙伴', sub: '我的团队', icon: Users },
    { id: 'membership', label: '会员中心', sub: '专属权益', icon: Crown },
    { id: 'addresses', label: '收货地址', sub: '地址管理', icon: MapPin },
  ];
  const toolItems = [
    { id: 'support', label: '联系客服', icon: Headphones },
    { id: 'settings', label: '系统设置', icon: Settings },
  ];

  const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR40gxSGi48Bih1xx4vlZUz7WOi86WfRKLpt0CFsxE524kpdy6NxFaz5y43soLgP2zs29EGofUBY-4X3sziD27rkA6bU6qR6TjSTQG2JVXV0qHWNp1w1wcvJQDAb19ylPDbsOyC7ythT8wQsHHLlW2MJQ_pFmg6fKiLLoWZR9TzZWUqrh6Bw3vz9_6CbrqM-5th4uoGdQP1TxBUsid1dzw2veKlYjzve1ozYzIoP8XxLKxOFH2u5GEbPL023pXuHBGS-lGecHbZUo';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [memberRes, walletRes, ordersRes, partnersRes, adminRes] = await Promise.all([
        memberAPI.getMembers({ keyword: '张明远', pageSize: 5 }),
        walletAPI.getWallet(),
        orderAPI.getOrders({ userId: MY_USER_ID, pageSize: 100 }),
        distributorAPI.getMyPartners({ pageSize: 100 }),
        authAPI.checkAdminAccess(),
      ]);
      if (memberRes.success && memberRes.data && memberRes.data.length > 0) {
        setMember(memberRes.data.find(m => m.userId === MY_USER_ID) || memberRes.data[0]);
      }
      if (walletRes.success && walletRes.data) setWallet(walletRes.data);
      if (ordersRes.success && ordersRes.data) {
        const counts: Record<string, number> = {};
        ordersRes.data.forEach(o => {
          const s = (o as any).statusCode || o.status;
          counts[s] = (counts[s] || 0) + 1;
        });
        setOrderCounts(counts);
      }
      if (partnersRes.success && partnersRes.data) setPartnerCount(partnersRes.data.length);
      if (adminRes.success && adminRes.data) setHasAdminAccess(adminRes.data.hasAccess);
    } finally {
      setLoading(false);
    }
  };

  const orderStats = [
    { label: '待付款', icon: CreditCard, statusKey: 'pending_payment' },
    { label: '待发货', icon: Box, statusKey: 'pending_delivery' },
    { label: '待收货', icon: Truck, statusKey: 'shipped' },
  ];

  const memberName = member?.name || '悦读者';
  const memberLevel = member?.level || 'VIP 3';
  const totalIncome = wallet?.totalIncome || 0;
  const commission = Math.round(totalIncome * 0.3);

  return (
    <div className="px-4 pt-4 pb-12 space-y-4">
      {/* ===== 会员封面卡 ===== */}
      <section
        onClick={() => onNavigate('membership')}
        className="relative overflow-hidden rounded-[28px] bg-brand-gradient text-white p-5 shadow-lg squishy-active cursor-pointer animate-fade-up"
      >
        <div className="absolute -top-12 -right-10 w-44 h-44 rounded-full bg-white/12 blur-xl" />
        <div className="absolute -bottom-14 -left-8 w-36 h-36 rounded-full bg-black/10 blur-lg" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative shrink-0">
            <img src={defaultAvatar} className="w-16 h-16 rounded-full border-2 border-white/60 object-cover" alt="头像" />
            <span className="absolute -bottom-1 -right-1 bg-gold-gradient text-white rounded-full p-1 border-2 border-white flex items-center justify-center">
              <Crown size={11} />
            </span>
          </div>
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-2">
                <div className="h-5 w-28 rounded-full bg-white/25 skeleton" />
                <div className="h-4 w-20 rounded-full bg-white/20 skeleton" />
              </div>
            ) : (
              <>
                <h2 className="font-serif text-xl font-black truncate">{memberName}</h2>
                <span className="mt-1.5 inline-flex items-center gap-1 bg-gold-gradient text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow">
                  <Star size={10} fill="currentColor" /> {memberLevel} · 点击升级
                </span>
              </>
            )}
          </div>
          <ChevronRight className="text-white/70 shrink-0" size={20} />
        </div>

        {/* 资产栏 */}
        <div className="relative z-10 mt-5 grid grid-cols-3 gap-2">
          {[
            { label: '累计消费', value: member?.totalAmount || 0 },
            { label: '钱包余额', value: wallet?.balance || 0 },
            { label: '累计收益', value: commission },
          ].map((it, i) => (
            <div key={it.label} className={`text-center ${i < 2 ? 'border-r border-white/20' : ''}`}>
              <p className="text-base font-black leading-none">
                {loading ? '—' : `¥${it.value.toLocaleString()}`}
              </p>
              <p className="text-[10px] text-white/80 mt-1.5">{it.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 邀请 CTA ===== */}
      <section
        onClick={onInvite}
        className="card-elevated p-4 flex items-center justify-between squishy-active cursor-pointer animate-fade-up"
        style={{ background: 'linear-gradient(120deg, #f0e3b0, #e7d89a)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/70 flex items-center justify-center text-gold shadow-sm">
            <Users size={22} />
          </div>
          <div>
            <h3 className="text-sm font-black text-on-gold">邀请好友赚佣金</h3>
            <p className="text-[11px] text-on-gold/70">已发展 {partnerCount} 位伙伴</p>
          </div>
        </div>
        <span className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center">
          <Arrow size={16} />
        </span>
      </section>

      {/* ===== 我的订单 ===== */}
      <section className="card-elevated p-5 animate-fade-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-base font-black text-on-surface">我的订单</h3>
          <button onClick={() => onNavigate('orders')} className="flex items-center text-[11px] text-on-surface-variant font-bold">
            全部订单 <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {orderStats.map(stat => {
            const Icon = stat.icon;
            const count = orderCounts[stat.statusKey] || 0;
            return (
              <button
                key={stat.label}
                onClick={() => onNavigate('orders')}
                className="flex flex-col items-center gap-2 py-2 rounded-2xl active:bg-surface-container transition-colors"
              >
                <div className="relative w-12 h-12 rounded-2xl bg-primary-fixed/50 text-primary flex items-center justify-center">
                  <Icon size={22} />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] rounded-full font-black flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-on-surface">{stat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== 后台管理入口 ===== */}
      {hasAdminAccess && (
        <section
          onClick={() => onNavigate('admin_panel')}
          className="rounded-3xl p-4 flex items-center justify-between shadow-lg squishy-active cursor-pointer animate-fade-up"
          style={{ background: 'linear-gradient(120deg, #2b2b33, #44444f)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center text-white">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">后台管理系统</h3>
              <p className="text-[11px] text-white/60">查看运营数据与管理</p>
            </div>
          </div>
          <ChevronRight className="text-white/60" size={20} />
        </section>
      )}

      {/* ===== 功能菜单 ===== */}
      <section className="card-elevated overflow-hidden animate-fade-up">
        <div className="divide-y divide-outline-variant/40">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as PageId)}
                className="w-full flex items-center gap-3.5 p-4 active:bg-surface-container-low transition-colors"
              >
                <span className="w-9 h-9 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </span>
                <span className="flex-1 text-left text-sm font-bold text-on-surface">{item.label}</span>
                <span className="text-[11px] text-on-surface-variant/60">{item.sub}</span>
                <ChevronRight className="text-outline" size={17} />
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== 工具菜单 ===== */}
      <section className="card-elevated overflow-hidden animate-fade-up">
        <div className="divide-y divide-outline-variant/40">
          {toolItems.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3.5 p-4 opacity-70"
              >
                <span className="w-9 h-9 rounded-xl bg-surface-container-high/60 text-on-surface-variant flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </span>
                <span className="flex-1 text-left text-sm font-bold text-on-surface">{item.label}</span>
                <ChevronRight className="text-outline" size={17} />
              </div>
            );
          })}
        </div>
      </section>

      <p className="text-center text-[10px] text-on-surface-variant/50 pt-2">寰宇思贤 · 绘本盲盒 v1.0</p>
    </div>
  );
}
