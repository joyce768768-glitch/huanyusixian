import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, Share2 } from 'lucide-react';
import { useState } from 'react';

interface ShareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareDrawer({ isOpen, onClose }: ShareDrawerProps) {
  const [showPrompt, setShowPrompt] = useState(false);

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
              className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-surface-container-lowest rounded-t-3xl z-[101] px-6 pt-4 pb-12 shadow-[0_-8px_32px_rgba(0,0,0,0.1)]"
            >
              {/* Handle */}
              <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full mx-auto mb-6" />
              
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black text-on-surface">分享邀请</h3>
                <button onClick={onClose} className="p-2 text-on-surface-variant">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <button 
                  onClick={handleWeChatClick}
                  className="flex flex-col items-center gap-3 squishy-active"
                >
                  <div className="w-16 h-16 bg-[#07C160] rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <MessageCircle size={32} fill="currentColor" />
                  </div>
                  <span className="text-sm font-bold text-on-surface">微信好友</span>
                </button>

                <button 
                  onClick={handleWeChatClick}
                  className="flex flex-col items-center gap-3 squishy-active"
                >
                  <div className="w-16 h-16 bg-[#07C160] rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <div className="grid grid-cols-2 gap-0.5 p-3">
                      <div className="w-full h-full border-2 border-white rounded-sm" />
                      <div className="w-full h-full border-2 border-white rounded-sm" />
                      <div className="w-full h-full border-2 border-white rounded-sm" />
                      <div className="w-full h-full border-2 border-white rounded-sm" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-on-surface">朋友圈</span>
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
