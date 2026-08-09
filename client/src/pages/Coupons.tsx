import { useEffect, useState } from 'react';
import { Ticket, Clock, Tag, ChevronRight, Gift, Percent, Loader2 } from 'lucide-react';
import { couponAPI } from '@shared/api';
import type { Coupon } from '../types.ts';

export default function Coupons({ onBack }: { onBack: () => void }) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  const loadCoupons = async () => {
    setLoading(true);
    const res = await couponAPI.getMyCoupons();
    setLoading(false);
    if (res.success && res.data) setCoupons(res.data);
  };

  const claimGift = async () => {
    setClaiming(true);
    const res = await couponAPI.receiveNewUserGift();
    setClaiming(false);
    if (res.success && res.data) {
      showToast(`成功领取 ${res.data.length} 张优惠券`);
      loadCoupons();
    } else {
      showToast(res.message || '领取失败');
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'unused': return '可使用';
      case 'used': return '已使用';
      case 'expired': return '已过期';
      default: return '';
    }
  };

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case 'unused': return 'bg-secondary text-on-secondary';
      case 'used': return 'bg-on-surface-variant/20 text-on-surface-variant';
      case 'expired': return 'bg-error/10 text-error';
      default: return '';
    }
  };

  function getCouponValue(c: Coupon): number {
    if (c.discountType === 'percent') {
      return Math.round(((c.percent || 0) / 100) * (c.minSpend || 100)); // 估算展示
    }
    return c.amount || 0;
  }

  function getCouponLabel(c: Coupon): string {
    if (c.discountType === 'shipping') return '包邮券';
    if (c.discountType === 'percent') return `${c.percent}% 折扣`;
    return `¥${c.amount}`;
  }

  function getCouponTitle(c: Coupon): string {
    if (c.title) return c.title;
    if (c.discountType === 'shipping') return '运费抵扣券';
    if (c.discountType === 'percent') return `${100 - (c.percent || 0)}% 折扣券`;
    return `满${c.minSpend || 0}减${c.amount}`;
  }

  const activeCoupons = coupons.filter(c => c.status === 'unused');
  const usedCoupons = coupons.filter(c => c.status === 'used');
  const expiredCoupons = coupons.filter(c => c.status === 'expired');

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-on-surface/90 text-surface px-5 py-2.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm">
          {toast}
        </div>
      )}

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

      {/* Claim Gift */}
      {activeCoupons.length === 0 && (
        <button
          onClick={claimGift}
          disabled={claiming}
          className="w-full mb-8 bg-gradient-to-r from-amber-400 to-rose-400 text-white p-5 rounded-2xl shadow-lg flex items-center justify-between disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <Gift size={24} />
            <div className="text-left">
              <h4 className="font-black">新人礼包待领取</h4>
              <p className="text-[10px] opacity-90">点击领取多张新人专享优惠券</p>
            </div>
          </div>
          {claiming ? <Loader2 className="animate-spin" size={20} /> : <ChevronRight size={20} />}
        </button>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="mt-3 text-sm text-on-surface-variant">加载优惠券中...</p>
        </div>
      ) : (
        <>
          {/* Available Coupons */}
          {activeCoupons.length > 0 && (
            <section className="mb-8">
              <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                <Ticket className="text-primary" size={16} />
                可使用（{activeCoupons.length}）
              </h3>
              <div className="space-y-4">
                {activeCoupons.map((coupon) => {
                  const isShipping = coupon.discountType === 'shipping';
                  return (
                    <div
                      key={coupon.id}
                      className={`rounded-2xl p-4 flex items-center gap-4 shadow-sm border ${
                        isShipping
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-500/20'
                          : 'bg-gradient-to-r from-primary to-primary-container text-white border-primary/20'
                      }`}
                    >
                      <div className="text-center w-24 flex-shrink-0">
                        <div className="flex items-baseline justify-center">
                          {isShipping ? (
                            <span className="text-2xl font-black">包邮</span>
                          ) : coupon.discountType === 'percent' ? (
                            <span className="text-3xl font-black">{coupon.percent}%</span>
                          ) : (
                            <>
                              <span className="text-[10px] text-white/80 mr-0.5">¥</span>
                              <span className="text-3xl font-black">{coupon.amount}</span>
                            </>
                          )}
                        </div>
                        {coupon.minSpend && coupon.minSpend > 0 && !isShipping && (
                          <p className="text-[9px] text-white/60 mt-1">满{coupon.minSpend}可用</p>
                        )}
                        {isShipping && (
                          <p className="text-[9px] text-white/60 mt-1">满{coupon.minSpend || 68}可用</p>
                        )}
                      </div>
                      <div className="flex-1 pl-4 border-l border-white/20">
                        <h4 className="text-sm font-bold">{getCouponTitle(coupon)}</h4>
                        <p className="text-[10px] text-white/80 mt-1">{coupon.validFrom && coupon.validTo ? `有效期：${coupon.validFrom} 至 ${coupon.validTo}` : '全场通用券'}</p>
                        <span className={`inline-block mt-2 px-2 py-0.5 text-[9px] font-bold rounded-full bg-white/20 text-white`}>
                          {getStatusText(coupon.status)}
                        </span>
                      </div>
                      <ChevronRight className="text-white/60" size={20} />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Used Coupons */}
          {usedCoupons.length > 0 && (
            <section className="mb-8">
              <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                <Tag className="text-on-surface-variant" size={16} />
                已使用（{usedCoupons.length}）
              </h3>
              <div className="space-y-4">
                {usedCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="bg-surface-container-low rounded-2xl p-4 flex items-center gap-4 opacity-60"
                  >
                    <div className="text-center w-24 flex-shrink-0">
                      <div className="flex items-baseline justify-center text-on-surface">
                        <span className="text-[10px] text-on-surface-variant">¥</span>
                        <span className="text-3xl font-black">{getCouponValue(coupon) || coupon.amount || 0}</span>
                      </div>
                    </div>
                    <div className="flex-1 pl-4 border-l border-outline-variant/30">
                      <h4 className="text-sm font-bold text-on-surface">{getCouponTitle(coupon)}</h4>
                      <p className="text-[10px] text-on-surface-variant">{coupon.validTo || ''}</p>
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
                已过期（{expiredCoupons.length}）
              </h3>
              <div className="space-y-4">
                {expiredCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="bg-surface-container-low rounded-2xl p-4 flex items-center gap-4 opacity-40"
                  >
                    <div className="text-center w-24 flex-shrink-0">
                      <div className="flex items-baseline justify-center text-on-surface">
                        <span className="text-[10px] text-on-surface-variant">¥</span>
                        <span className="text-3xl font-black">{getCouponValue(coupon) || coupon.amount || 0}</span>
                      </div>
                    </div>
                    <div className="flex-1 pl-4 border-l border-outline-variant/30">
                      <h4 className="text-sm font-bold text-on-surface">{getCouponTitle(coupon)}</h4>
                      <p className="text-[10px] text-on-surface-variant">{coupon.validTo || ''}</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 text-[9px] font-bold rounded-full ${getStatusStyle(coupon.status)}`}>
                        {getStatusText(coupon.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && coupons.length === 0 && (
        <section className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
            <Gift className="text-on-surface-variant" size={32} />
          </div>
          <h3 className="text-base font-bold text-on-surface mb-2">暂无优惠券</h3>
          <p className="text-sm text-on-surface-variant text-center px-8 mb-6">快去参与活动领取优惠券，享受更多优惠吧！</p>
          <button
            onClick={claimGift}
            disabled={claiming}
            className="bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-bold shadow-md disabled:opacity-60 flex items-center gap-2"
          >
            {claiming && <Loader2 size={16} className="animate-spin" />}
            领取新人礼包
          </button>
        </section>
      )}
    </div>
  );
}
