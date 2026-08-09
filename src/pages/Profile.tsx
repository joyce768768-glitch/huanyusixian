import { ChevronRight, Heart, Wallet, Users, MapPin, Headphones, Settings, ArrowRight, Star, CreditCard, Box, Truck, Crown, Ticket } from 'lucide-react';
import { PageId } from '../App.tsx';

interface ProfileProps {
  onNavigate: (page: PageId) => void;
  onInvite: () => void;
}

export default function Profile({ onNavigate, onInvite }: ProfileProps) {
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

  const orderStats = [
    { label: '待付款', icon: CreditCard, count: 2 },
    { label: '待发货', icon: Box, count: 5 },
    { label: '待收货', icon: Truck, count: 1 },
  ];

  return (
    <div className="space-y-6 px-4 pt-4 pb-12">
      {/* User Header */}
      <section 
        onClick={() => onNavigate('membership')}
        className="flex items-center gap-4 bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 squishy-active cursor-pointer"
      >
        <div className="relative shrink-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR40gxSGi48Bih1xx4vlZUz7WOi86WfRKLpt0CFsxE524kpdy6NxFaz5y43soLgP2zs29EGofUBY-4X3sziD27rkA6bU6qR6TjSTQG2JVXV0qHWNp1w1wcvJQDAb19ylPDbsOyC7ythT8wQsHHLlW2MJQ_pFmg6fKiLLoWZR9TzZWUqrh6Bw3vz9_6CbrqM-5th4uoGdQP1TxBUsid1dzw2veKlYjzve1ozYzIoP8XxLKxOFH2u5GEbPL023pXuHBGS-lGecHbZUo" 
            className="w-16 h-16 rounded-full border-4 border-primary-fixed object-cover"
            alt="Avatar"
          />
          <div className="absolute -bottom-1 -right-1 bg-secondary-container text-on-secondary-container rounded-full p-1 border-2 border-surface-container-lowest flex items-center justify-center">
            <Star size={12} fill="currentColor" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-on-surface truncate">悦读者 莎莎</h2>
          <div className="mt-1 inline-flex items-center gap-1 px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-[10px] font-bold border border-tertiary/10">
            <Crown size={12} className="mr-0.5" /> 会员等级: VIP5
          </div>
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
            <p className="text-[10px] text-on-secondary-fixed-variant">Invite friends to earn rewards</p>
          </div>
        </div>
        <ArrowRight className="text-on-secondary-fixed" size={20} />
      </section>

      {/* Stats Summary */}
      <section className="grid grid-cols-3 gap-3 bg-primary p-6 rounded-2xl shadow-lg relative overflow-hidden text-white">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary-container rounded-full opacity-30"></div>
        <div className="flex flex-col items-center justify-center text-center space-y-1">
          <span className="text-[10px] opacity-90">今日销售额</span>
          <span className="text-lg font-bold">¥1,280</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center space-y-1 border-x border-on-primary-container/20 px-2">
          <span className="text-[10px] opacity-90">销售订单</span>
          <span className="text-lg font-bold">42</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center space-y-1">
          <span className="text-[10px] opacity-90">佣金额</span>
          <span className="text-lg font-bold">¥384</span>
        </div>
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
            return (
              <div key={stat.label} className="flex flex-col items-center gap-2 relative">
                <div className="bg-primary-fixed-dim/20 p-3 rounded-full text-primary">
                  <Icon size={20} />
                </div>
                <span className="text-xs text-on-surface">{stat.label}</span>
                {stat.count > 0 && (
                  <span className="absolute top-0 right-1/4 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {stat.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Menu List */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
        <div className="divide-y divide-outline-variant/30">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                onClick={() => onNavigate(item.id as PageId)}
                className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer group"
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
