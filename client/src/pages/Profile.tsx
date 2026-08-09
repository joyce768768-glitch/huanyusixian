import { useEffect, useState } from 'react';
import { ChevronRight, Heart, Wallet, Users, MapPin, Headphones, Settings, ArrowRight, Star, CreditCard, Box, Truck, Crown, Ticket, ShieldCheck, Loader2 } from 'lucide-react';
import { PageId } from '../App.tsx';
import { memberAPI, orderAPI, walletAPI, distributorAPI, authAPI } from '@shared/api';
import { Member, OrderStatus } from '../types.ts';

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
    { id: 'favorites', label: '我的收藏 (Wishlist)', icon: Heart },
    { id: 'wallet', label: '我的钱包 (My Wallet)', icon: Wallet },
    { id: 'coupons', label: '我的优惠券 (Coupons)', icon: Ticket },
    { id: 'distributors', label: '我的分销商 (My Distributors)', icon: Users },
    { id: 'membership', label: '我的会员 (My Membership)', icon: Crown },
    { id: 'addresses', label: '收货地址 (Addresses)', icon: MapPin },
    { id: 'support', label: '联系客服 (Support)', icon: Headphones },
    { id: 'settings', label: '系统设置 (Settings)', icon: Settings },
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

      // 会员信息：查找张明远
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
  const memberLevelIndex = parseInt((memberLevel.match(/\d/) || ['3'])[0]) || 3;

  const totalIncome = wallet?.totalIncome || 0;
  const commission = Math.round(totalIncome * 0.3);

  return (
    <div className="space-y-6 px-4 pt-4 pb-12">
      {/* User Header */}
      <section
        onClick={() => onNavigate('membership')}
        className="flex items-center gap-4 bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 squishy-active cursor-pointer"
      >
        <div className="relative shrink-0">
          <img
            src={defaultAvatar}
            className="w-16 h-16 rounded-full border-4 border-primary-fixed object-cover bg-surface-container"
            alt="Avatar"
          />
          <div className="absolute -bottom-1 -right-1 bg-secondary-container text-on-secondary-container rounded-full p-1 border-2 border-surface-container-lowest flex items-center justify-center">
            <Star size={12} fill="currentColor" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex flex-col gap-2 py-2">
              <div className="h-5 w-32 bg-surface-container rounded animate-pulse" />
              <div className="h-5 w-24 bg-surface-container rounded animate-pulse" />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-on-surface truncate">{memberName}</h2>
              <div className="mt-1 inline-flex items-center gap-1 px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-[10px] font-bold border border-tertiary/10">
                <Crown size={12} className="mr-0.5" /> 会员等级: {memberLevel}
              </div>
            </>
          )}
        </div>
        <ChevronRight className="text-outline shrink-0 transition-transform group-hover:translate-x-1" size={20} />
      </section>

      {/* Invitation CTA */}
      <section
        onClick={onInvite}
        className="bg-secondary-container p-5 rounded-2xl flex items-center justify-between border border-secondary/20 squishy-active cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm">
            <Users className="text-secondary" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-secondary-fixed">邀请好友赚钱</h3>
            <p className="text-[10px] text-on-secondary-fixed-variant">已发展 {partnerCount} 位伙伴</p>
          </div>
        </div>
        <ArrowRight className="text-on-secondary-fixed" size={20} />
      </section>

      {/* Stats Summary */}
      <section className="grid grid-cols-3 gap-3 bg-primary p-6 rounded-2xl shadow-lg relative overflow-hidden text-white">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary-container rounded-full opacity-30"></div>
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center space-y-1">
              <div className="h-3 w-12 bg-white/20 rounded animate-pulse" />
              <div className="h-6 w-14 bg-white/20 rounded animate-pulse mt-2" />
            </div>
          ))
        ) : (
          <>
            <div className="flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-[10px] opacity-90">累计消费</span>
              <span className="text-lg font-bold">¥{(member?.totalAmount || 0).toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-1 border-x border-on-primary-container/20 px-2">
              <span className="text-[10px] opacity-90">钱包余额</span>
              <span className="text-lg font-bold">¥{(wallet?.balance || 0).toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-[10px] opacity-90">累计收益</span>
              <span className="text-lg font-bold">¥{commission.toLocaleString()}</span>
            </div>
          </>
        )}
      </section>

      {/* Orders Section */}
      <section
        onClick={() => onNavigate('orders')}
        className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm cursor-pointer"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-on-surface">我的订单</h3>
          <div className="flex items-center text-[10px] text-on-surface-variant gap-1">
            <span>全部订单</span>
            <ChevronRight size={14} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {orderStats.map((stat) => {
            const Icon = stat.icon;
            const count = orderCounts[stat.statusKey] || 0;
            return (
              <div key={stat.label} className="flex flex-col items-center gap-2 relative">
                <div className="bg-primary-fixed-dim/20 p-3 rounded-full text-primary">
                  <Icon size={20} />
                </div>
                <span className="text-xs text-on-surface">{stat.label}</span>
                {count > 0 && (
                  <span className="absolute top-0 right-1/4 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Admin Panel Entry - 仅在有权限时显示 */}
      {hasAdminAccess && (
        <section
          onClick={() => onNavigate('admin_panel')}
          className="bg-gradient-to-r from-primary to-primary-container p-5 rounded-2xl flex items-center justify-between border border-primary/20 shadow-lg squishy-active cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">后台管理系统</h3>
              <p className="text-[10px] text-white/80">点击进入管理后台，查看运营数据</p>
            </div>
          </div>
          <ChevronRight className="text-white/80" size={20} />
        </section>
      )}

      {/* Menu List */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
        <div className="divide-y divide-outline-variant/30">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => (item.id === 'support' || item.id === 'settings' ? null : onNavigate(item.id as PageId))}
                className={`flex items-center justify-between p-4 transition-colors group ${
                  item.id === 'support' || item.id === 'settings'
                    ? 'opacity-60'
                    : 'hover:bg-surface-container-low cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className="text-primary group-hover:scale-110 transition-transform" size={20} />
                  <span className="text-sm text-on-surface">{item.label}</span>
                </div>
                <ChevronRight className="text-outline" size={18} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
