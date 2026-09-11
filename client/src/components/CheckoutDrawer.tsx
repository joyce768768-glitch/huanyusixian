import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Loader2, Ticket } from 'lucide-react';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { orderAPI, couponAPI } from '@shared/api';
import type { Coupon } from '@shared/types';

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderId?: string;
  couponId?: string;
  onCouponChange?: (couponId: string, discount: number) => void;
  onPaid?: () => void;
  onConfirm?: () => Promise<{ orderId?: string; error?: string }>;
}

export default function CheckoutDrawer({ isOpen, onClose, amount, orderId, couponId, onCouponChange, onPaid, onConfirm }: CheckoutDrawerProps) {
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');
  const [showCouponPicker, setShowCouponPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 加载可用优惠券
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setIsVerifying(false);
      setError(null);
      setSelectedCouponId(couponId || '');
      setShowCouponPicker(false);
      couponAPI.getMyCoupons({ status: 'unused' }).then(res => {
        if (res.success && res.data) {
          setCoupons(res.data.filter((c: Coupon) => !c.minSpend || amount >= c.minSpend));
        }
      });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, amount, couponId]);

  const selectedCoupon = coupons.find(c => c.id === selectedCouponId);
  const discount = selectedCoupon
    ? selectedCoupon.discountType === 'amount'
      ? selectedCoupon.amount || 0
      : selectedCoupon.discountType === 'shipping'
      ? 15
      : Math.round(amount * (selectedCoupon.percent || 0)) / 100
    : 0;
  const finalAmount = Math.max(0, amount - discount);

  const handleSelectCoupon = (id: string) => {
    const c = coupons.find(x => x.id === id);
    if (!c) return;
    const d = c.discountType === 'amount' ? c.amount || 0 : c.discountType === 'shipping' ? 15 : Math.round(amount * (c.percent || 0)) / 100;
    setSelectedCouponId(id);
    setShowCouponPicker(false);
    onCouponChange?.(id, d);
  };

  const handlePasswordChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (isVerifying) return;
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPassword(val);
    setError(null);

    if (val.length === 6) {
      setIsVerifying(true);
      try {
        if (orderId) {
          // 已有订单，直接支付
          const res = await orderAPI.payOrder(orderId);
          if (res.success) {
            setTimeout(() => { setIsVerifying(false); onPaid?.(); }, 800);
          } else {
            setIsVerifying(false);
            setError(res.message || '支付失败，请重试');
            setPassword('');
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        } else if (onConfirm) {
          // 无订单，先创建订单+支付
          const result = await onConfirm();
          if (result.orderId) {
            const res = await orderAPI.payOrder(result.orderId);
            if (res.success) {
              setTimeout(() => { setIsVerifying(false); onPaid?.(); }, 800);
            } else {
              setIsVerifying(false);
              setError(res.message || '支付失败');
              setPassword('');
            }
          } else {
            setIsVerifying(false);
            setError(result.error || '下单失败');
            setPassword('');
          }
        } else {
          setTimeout(() => { setIsVerifying(false); onPaid?.(); }, 1000);
        }
      } catch (e: any) {
        setIsVerifying(false);
        setError(e?.message || '支付异常');
        setPassword('');
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isVerifying && onClose()}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[430px] bg-surface-container-lowest rounded-t-[28px] z-[101] px-6 pt-3 pb-10 pb-safe shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full mx-auto mb-6" />

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-on-surface">确认付款</h3>
              <button
                onClick={onClose}
                disabled={isVerifying}
                className="p-2 text-on-surface-variant disabled:opacity-40"
              >
                <X size={20} />
              </button>
            </div>

            {/* 优惠券选择 */}
            {coupons.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => !isVerifying && setShowCouponPicker(!showCouponPicker)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/30"
                >
                  <div className="flex items-center gap-2">
                    <Ticket size={16} className={selectedCoupon ? 'text-primary' : 'text-on-surface-variant'} />
                    <span className="text-xs font-bold text-on-surface">
                      {selectedCoupon ? selectedCoupon.title : '选择优惠券'}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant">
                    {selectedCoupon ? `-¥${discount.toFixed(2)}` : `${coupons.length} 张可用`}
                  </span>
                </button>

                {showCouponPicker && (
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    <button
                      onClick={() => { setSelectedCouponId(''); setShowCouponPicker(false); onCouponChange?.('', 0); }}
                      className={`w-full text-left p-3 rounded-xl border ${!selectedCouponId ? 'border-primary bg-primary/5' : 'border-outline-variant/30 bg-surface-container-low'}`}
                    >
                      <span className="text-xs font-bold text-on-surface">不使用优惠券</span>
                    </button>
                    {coupons.map(c => {
                      const d = c.discountType === 'amount' ? c.amount || 0 : c.discountType === 'shipping' ? 15 : Math.round(amount * (c.percent || 0)) / 100;
                      return (
                        <button
                          key={c.id}
                          onClick={() => handleSelectCoupon(c.id)}
                          className={`w-full text-left p-3 rounded-xl border ${selectedCouponId === c.id ? 'border-primary bg-primary/5' : 'border-outline-variant/30 bg-surface-container-low'}`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-on-surface">{c.title}</span>
                            <span className="text-xs font-black text-primary">-¥{d.toFixed(2)}</span>
                          </div>
                          {c.minSpend ? <p className="text-[10px] text-on-surface-variant mt-0.5">满¥{c.minSpend}可用</p> : null}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col items-center py-4 space-y-2">
              <p className="text-sm text-on-surface-variant mb-1 font-medium">支付金额</p>
              {discount > 0 && (
                <p className="text-xs text-on-surface-variant line-through opacity-60">¥ {amount.toFixed(2)}</p>
              )}
              <h2 className="text-4xl font-black text-primary tracking-tight">¥ {finalAmount.toFixed(2)}</h2>
              {orderId && (
                <p className="text-[10px] text-on-surface-variant font-mono mt-1 opacity-70">
                  订单号：{orderId}
                </p>
              )}
            </div>

            <div className="mt-6 space-y-5">
              <div className="text-center">
                <p className="text-xs font-bold text-on-surface mb-4">请输入6位支付密码</p>

                <input
                  ref={inputRef}
                  type="tel"
                  pattern="[0-9]*"
                  value={password}
                  onChange={handlePasswordChange}
                  className="absolute opacity-0 pointer-events-none"
                  autoFocus
                  disabled={isVerifying}
                />

                <div
                  onClick={() => !isVerifying && inputRef.current?.focus()}
                  className="flex justify-center gap-3"
                >
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-14 bg-surface-container-low rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                        error
                          ? 'border-rose-400'
                          : password.length === i
                          ? 'border-primary ring-2 ring-primary/20 scale-05'
                          : 'border-outline-variant/30'
                      }`}
                    >
                      {password[i] ? (
                        <div className="w-3 h-3 bg-primary rounded-full" />
                      ) : password.length === i && !isVerifying ? (
                        <motion.div
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-0.5 h-6 bg-primary"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-center text-xs font-bold text-rose-500">{error}</p>
              )}

              {isVerifying ? (
                <div className="flex flex-col items-center justify-center gap-3 py-4">
                  <Loader2 size={28} className="animate-spin text-primary" />
                  <p className="text-xs font-bold text-primary">正在安全验证并支付...</p>
                </div>
              ) : (
                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-container-lowest rounded-full flex items-center justify-center text-secondary shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface">安全支付已启用</p>
                    <p className="text-[10px] text-on-surface-variant opacity-70">资金托管于支付结算平台</p>
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={() => { setPassword(''); setError(null); }}
                  disabled={isVerifying}
                  className="text-xs text-primary font-bold hover:underline opacity-60 disabled:opacity-30"
                >
                  忘记密码？
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
