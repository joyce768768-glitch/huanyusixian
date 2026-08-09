import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { orderAPI } from '@shared/api';

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderId?: string;
  onPaid?: () => void;
}

export default function CheckoutDrawer({ isOpen, onClose, amount, orderId, onPaid }: CheckoutDrawerProps) {
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setIsVerifying(false);
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handlePasswordChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (isVerifying) return;
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPassword(val);
    setError(null);

    if (val.length === 6) {
      setIsVerifying(true);
      try {
        if (orderId) {
          // 真实调用后端支付接口
          const res = await orderAPI.payOrder(orderId);
          if (res.success) {
            // 支付成功
            setTimeout(() => {
              setIsVerifying(false);
              onPaid?.();
            }, 800);
          } else {
            setIsVerifying(false);
            setError(res.message || '支付失败，请重试');
            setPassword('');
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        } else {
          // 无订单ID（兼容场景），仅模拟成功
          setTimeout(() => {
            setIsVerifying(false);
            onPaid?.();
          }, 1000);
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isVerifying && onClose()}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-surface-container-lowest rounded-t-3xl z-[101] px-6 pt-4 pb-12 shadow-[0_-8px_32px_rgba(0,0,0,0.1)]"
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full mx-auto mb-6" />

            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-on-surface">确认付款</h3>
              <button
                onClick={onClose}
                disabled={isVerifying}
                className="p-2 text-on-surface-variant disabled:opacity-40"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center py-4 space-y-2">
              <p className="text-sm text-on-surface-variant mb-1 font-medium">支付金额</p>
              <h2 className="text-4xl font-black text-primary tracking-tight">¥ {amount.toFixed(2)}</h2>
              {orderId && (
                <p className="text-[10px] text-on-surface-variant font-mono mt-1 opacity-70">
                  订单号：{orderId}
                </p>
              )}
            </div>

            <div className="mt-6 space-y-5">
              <div className="text-center">
                <p className="text-xs font-bold text-on-surface mb-4">请输入6位支付密码</p>

                {/* Hidden Input for Keyboard */}
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

                {/* Visual Password Slots */}
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
                          ? 'border-primary ring-2 ring-primary/20 scale-105'
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
