import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ShieldCheck, Delete } from 'lucide-react';
import { useState, useRef, useEffect, ChangeEvent } from 'react';

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export default function CheckoutDrawer({ isOpen, onClose, amount }: CheckoutDrawerProps) {
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setIsVerifying(false);
      // Small timeout to ensure input is ready to be focused
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPassword(val);
    
    if (val.length === 6) {
      setIsVerifying(true);
      setTimeout(() => {
        alert('支付成功！');
        onClose();
        setIsVerifying(false);
      }, 1500);
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
            onClick={onClose}
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
              <button onClick={onClose} className="p-2 text-on-surface-variant">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center py-4 space-y-2">
              <p className="text-sm text-on-surface-variant mb-1 font-medium">支付金额</p>
              <h2 className="text-4xl font-black text-primary tracking-tight">¥ {amount.toFixed(2)}</h2>
            </div>

            <div className="mt-8 space-y-6">
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
                />
                
                {/* Visual Password Slots */}
                <div 
                  onClick={() => inputRef.current?.focus()}
                  className="flex justify-center gap-3"
                >
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-12 h-14 bg-surface-container-low rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                        password.length === i ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-outline-variant/30'
                      }`}
                    >
                      {password[i] ? (
                        <div className="w-3 h-3 bg-primary rounded-full" />
                      ) : (
                        password.length === i && <motion.div 
                          animate={{ opacity: [1, 0, 1] }} 
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-0.5 h-6 bg-primary" 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {isVerifying ? (
                <div className="flex flex-col items-center justify-center gap-3 py-4">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-xs font-bold text-primary">正在安全验证...</p>
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
                  onClick={() => setPassword('')}
                  className="text-xs text-primary font-bold hover:underline opacity-60"
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
