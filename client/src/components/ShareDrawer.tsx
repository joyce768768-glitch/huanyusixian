import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { distributorAPI } from '@shared/api';

interface ShareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareDrawer({ isOpen, onClose }: ShareDrawerProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [inviteCode, setInviteCode] = useState('HY2026');

  useEffect(() => {
    if (isOpen) {
      distributorAPI.getMyInviteCode().then(res => {
        if (res.success && res.data?.inviteCode) {
          setInviteCode(res.data.inviteCode);
        }
      });
    }
  }, [isOpen]);

  const handleWeChatClick = () => {
    setShowPrompt(true);
  };

  const handlePromptAction = (action: 'go' | 'stay') => {
    setShowPrompt(false);
    if (action === 'go') {
      // In a real app, this might use a deep link
      alert('正在跳往微信...');
    }
    onClose();
  };

  return (
    <>
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
              className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[430px] bg-surface-container-lowest rounded-t-[28px] z-[101] px-6 pt-3 pb-10 pb-safe shadow-2xl"
            >
              {/* Handle */}
              <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-center mb-5">
                <h3 className="font-serif text-lg font-black text-on-surface">分享邀请</h3>
                <button onClick={onClose} aria-label="关闭" className="w-9 h-9 rounded-full bg-surface-container-high/60 flex items-center justify-center text-on-surface-variant active:scale-90 transition-transform">
                  <X size={18} />
                </button>
              </div>

              {/* 邀请码卡片 */}
              <div className="rounded-2xl bg-brand-gradient text-white p-5 mb-7 relative overflow-hidden">
                <div className="absolute -top-8 -right-6 w-28 h-28 rounded-full bg-white/15 blur-lg" />
                <p className="text-[11px] text-white/85 font-bold">我的专属邀请码</p>
                <p className="font-serif text-2xl font-black tracking-[0.3em] mt-1">{inviteCode}</p>
                <p className="text-[10px] text-white/80 mt-1.5">好友下单，你最高可获 30% 佣金</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={handleWeChatClick}
                  className="flex flex-col items-center gap-2.5 squishy-active"
                >
                  <div className="w-16 h-16 bg-[#07C160] rounded-[20px] flex items-center justify-center text-white shadow-lg">
                    <MessageCircle size={30} fill="currentColor" />
                  </div>
                  <span className="text-xs font-bold text-on-surface">微信好友</span>
                </button>

                <button
                  onClick={handleWeChatClick}
                  className="flex flex-col items-center gap-2.5 squishy-active"
                >
                  <div className="w-16 h-16 bg-[#07C160] rounded-[20px] flex items-center justify-center text-white shadow-lg">
                    <div className="grid grid-cols-2 gap-0.5 p-3.5">
                      <div className="w-full h-full border-2 border-white rounded-sm" />
                      <div className="w-full h-full border-2 border-white rounded-sm" />
                      <div className="w-full h-full border-2 border-white rounded-sm" />
                      <div className="w-full h-full border-2 border-white rounded-sm" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-on-surface">朋友圈</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Prompt Modal */}
      <AnimatePresence>
        {showPrompt && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-surface-container-lowest rounded-3xl p-8 w-full max-w-[320px] shadow-2xl text-center border border-outline-variant/30"
            >
              <h4 className="text-lg font-black text-on-surface mb-4">跳转提示</h4>
              <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
                即将离开当前页面前往微信，确定要继续吗？
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handlePromptAction('go')}
                  className="w-full py-4 bg-primary text-white rounded-full font-black text-sm shadow-md squishy-active"
                >
                  去微信
                </button>
                <button
                  onClick={() => handlePromptAction('stay')}
                  className="w-full py-4 bg-surface-container-low text-on-surface-variant rounded-full font-bold text-sm squishy-active"
                >
                  留在本页
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
