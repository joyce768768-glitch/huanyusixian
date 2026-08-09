import { Ticket, Clock, Tag, ChevronRight, Gift, Percent } from 'lucide-react';

export default function Coupons({ onBack }: { onBack: () => void }) {
  const coupons = [
    {
      id: 1,
      type: 'discount',
      value: 2,
      minSpend: 15,
      title: '满15元减2元',
      description: '全场通用券',
      expireDate: '2025-12-31',
      status: 'available',
    },
    {
      id: 2,
      type: 'discount',
      value: 5,
      minSpend: 30,
      title: '满30元减5元',
      description: '新书专区',
      expireDate: '2025-11-30',
      status: 'available',
    },
    {
      id: 3,
      type: 'discount',
      value: 10,
      minSpend: 70,
      title: '满70元减10元',
      description: '限时特惠',
      expireDate: '2025-10-31',
      status: 'available',
    },
    {
      id: 4,
      type: 'discount',
      value: 5,
      minSpend: 30,
      title: '满30元减5元',
      description: '已使用',
      expireDate: '2025-09-30',
      status: 'used',
    },
    {
      id: 5,
      type: 'discount',
      value: 10,
      minSpend: 70,
      title: '满70元减10元',
      description: '已过期',
      expireDate: '2025-06-15',
      status: 'expired',
    },
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return '可使用';
      case 'used':
        return '已使用';
      case 'expired':
        return '已过期';
      default:
        return '';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-secondary text-on-secondary';
      case 'used':
        return 'bg-on-surface-variant/20 text-on-surface-variant';
      case 'expired':
        return 'bg-error/10 text-error';
      default:
        return '';
    }
  };

  const activeCoupons = coupons.filter(c => c.status === 'available');
  const usedCoupons = coupons.filter(c => c.status === 'used');
  const expiredCoupons = coupons.filter(c => c.status === 'expired');

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      {/* Stats Header */}
      <section className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-primary-container text-on-primary-container p-4 rounded-2xl text-center">
          <p className="text-2xl font-black">{activeCoupons.length}</p>
          <p className="text-[10px] font-bold opacity-80">可使用</p>
        </div>
        <div className="bg-surface-container-high p-4 rounded-2xl text-center">
          <p className="text-2xl font-black text-on-surface">{usedCoupons.length}</p>
          <p className="text-[10px] font-bold text-on-surface-variant">已使用</p>
        </div>
        <div className="bg-surface-container-high p-4 rounded-2xl text-center">
          <p className="text-2xl font-black text-on-surface">{expiredCoupons.length}</p>
          <p className="text-[10px] font-bold text-on-surface-variant">已过期</p>
        </div>
      </section>

      {/* Available Coupons */}
      {activeCoupons.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
            <Ticket className="text-primary" size={16} />
            可使用
          </h3>
          <div className="space-y-4">
            {activeCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-gradient-to-r from-primary to-primary-container rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-primary/20"
              >
                <div className="text-center">
                  <div className="flex items-baseline justify-center text-white">
                    <span className="text-[10px] text-white/80">¥</span>
                    <span className="text-3xl font-black text-white">{coupon.value}</span>
                  </div>
                  {coupon.minSpend > 0 && (
                    <p className="text-[9px] text-white/60 mt-1">满{coupon.minSpend}可用</p>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">{coupon.title}</h4>
                  <p className="text-[10px] text-white/80">{coupon.description}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock size={10} className="text-white/60" />
                    <span className="text-[9px] text-white/60">有效期至 {coupon.expireDate}</span>
                  </div>
                </div>
                <ChevronRight className="text-white/60" size={20} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Used Coupons */}
      {usedCoupons.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
            <Tag className="text-on-surface-variant" size={16} />
            已使用
          </h3>
          <div className="space-y-4">
            {usedCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-surface-container-low rounded-2xl p-4 flex items-center gap-4 opacity-60"
              >
                <div className="text-center">
                  <div className="flex items-baseline justify-center">
                    <span className="text-[10px] text-on-surface-variant">¥</span>
                    <span className="text-3xl font-black text-on-surface">{coupon.value}</span>
                  </div>
                  {coupon.minSpend > 0 && (
                    <p className="text-[9px] text-on-surface-variant mt-1">满{coupon.minSpend}可用</p>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-on-surface">{coupon.title}</h4>
                  <p className="text-[10px] text-on-surface-variant">{coupon.description}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 text-[9px] font-bold rounded-full ${getStatusStyle(coupon.status)}`}>
                    {getStatusText(coupon.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Expired Coupons */}
      {expiredCoupons.length > 0 && (
        <section className="mb-12">
          <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
            <Percent className="text-error" size={16} />
            已过期
          </h3>
          <div className="space-y-4">
            {expiredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-surface-container-low rounded-2xl p-4 flex items-center gap-4 opacity-40"
              >
                <div className="text-center">
                  <div className="flex items-baseline justify-center">
                    <span className="text-[10px] text-on-surface-variant">¥</span>
                    <span className="text-3xl font-black text-on-surface">{coupon.value}</span>
                  </div>
                  {coupon.minSpend > 0 && (
                    <p className="text-[9px] text-on-surface-variant mt-1">满{coupon.minSpend}可用</p>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-on-surface">{coupon.title}</h4>
                  <p className="text-[10px] text-on-surface-variant">{coupon.description}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 text-[9px] font-bold rounded-full ${getStatusStyle(coupon.status)}`}>
                    {getStatusText(coupon.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {coupons.length === 0 && (
        <section className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
            <Gift className="text-on-surface-variant" size={32} />
          </div>
          <h3 className="text-base font-bold text-on-surface mb-2">暂无优惠券</h3>
          <p className="text-sm text-on-surface-variant text-center px-8">快去领取优惠券，享受更多优惠吧！</p>
        </section>
      )}
    </div>
  );
}
