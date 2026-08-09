import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Star, Zap, Shield, Gift, ChevronRight } from 'lucide-react';

export default function Membership({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState(4); // Default to VIP5 (index 4)

  const vips = [
    { level: 'VIP1', color: 'bg-slate-400', textColor: 'text-slate-900', shadow: 'shadow-slate-200' },
    { level: 'VIP2', color: 'bg-emerald-400', textColor: 'text-emerald-950', shadow: 'shadow-emerald-200' },
    { level: 'VIP3', color: 'bg-blue-400', textColor: 'text-blue-950', shadow: 'shadow-blue-200' },
    { level: 'VIP4', color: 'bg-purple-500', textColor: 'text-white', shadow: 'shadow-purple-200' },
    { level: 'VIP5', color: 'bg-amber-500', textColor: 'text-amber-950', shadow: 'shadow-amber-200' },
  ];

  const benefits = [
    { icon: Gift, title: '专享折扣', desc: '全场盲盒 8.5 折起', level: 1 },
    { icon: Zap, title: '极速发货', desc: '订单优先打包处理', level: 2 },
    { icon: Star, title: '新品优先', desc: '热门盲盒抢先选购', level: 3 },
    { icon: Shield, title: '售后保障', desc: '专属客服 1对1 服务', level: 4 },
    { icon: Crown, title: '生日大礼', desc: '每年生日获精选绘本', level: 5 },
  ];

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Vip Selection Tabs */}
      <div className="flex justify-between items-center bg-surface-container-low p-2 rounded-2xl mb-8 border border-outline-variant/30">
        {vips.map((vip, index) => (
          <button
            key={vip.level}
            onClick={() => setActiveTab(index)}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
              activeTab === index 
                ? `${vip.color} ${vip.textColor} shadow-lg scale-105` 
                : 'text-on-surface-variant opacity-50 hover:opacity-100'
            }`}
          >
            {vip.level}
          </button>
        ))}
      </div>

      {/* VIP Card Display */}
      <AnimatePresence mode="wait">
        <motion.section
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`relative overflow-hidden rounded-[2.5rem] p-8 min-h-[220px] ${vips[activeTab].color} ${vips[activeTab].textColor} ${vips[activeTab].shadow} shadow-2xl mb-10`}
        >
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-48 h-48 opacity-10 -mr-12 -mt-12 pointer-events-none">
            <Crown size={192} strokeWidth={1} />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Membership Card</span>
                <h2 className="text-3xl font-black italic tracking-tighter mt-1">{vips[activeTab].level} Member</h2>
              </div>
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                <Crown size={24} />
              </div>
            </div>
            
            <div className="mt-12 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold opacity-60">ID: Reader_2024_0042</p>
                <p className="text-sm font-black mt-1">悦读者 莎莎</p>
              </div>
              <div className="flex items-center gap-1 bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span className="text-[10px] font-black">尊享特权中</span>
              </div>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Benefits List */}
      <section className="space-y-4">
        <h3 className="text-base font-black text-on-surface mb-6">等级专属权益</h3>
        <div className="grid grid-cols-1 gap-4">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            const isUnlocked = activeTab + 1 >= benefit.level;
            return (
              <div 
                key={benefit.title} 
                className={`bg-surface-container-lowest border rounded-2xl p-5 flex items-center justify-between shadow-sm transition-all ${
                  isUnlocked ? 'border-outline-variant opacity-100' : 'border-dashed border-outline opacity-40'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-primary/10 text-primary' : 'bg-surface-container text-outline'}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-on-surface">{benefit.title}</h4>
                    <p className="text-[10px] font-medium text-on-surface-variant opacity-70">{benefit.desc}</p>
                  </div>
                </div>
                {!isUnlocked && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-outline">
                    <span>VIP{benefit.level}解锁</span>
                    <ChevronRight size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Upgrade CTA */}
      <section className="mt-12 bg-secondary-container p-6 rounded-[2rem] border border-secondary/20 shadow-lg text-center">
        <h4 className="text-sm font-black text-on-secondary-fixed">升级至下一等级</h4>
        <p className="text-[10px] text-on-secondary-fixed-variant mt-2 mb-6">只需再完成 3 笔订单，即可解锁更高级特权</p>
        <button className="w-full bg-secondary text-on-secondary py-4 rounded-full font-black text-sm shadow-md squishy-active">
          立即浏览更多等绘本
        </button>
      </section>
    </div>
  );
}
