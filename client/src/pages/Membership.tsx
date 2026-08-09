import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Star, Zap, Shield, Gift, ChevronRight, Loader2 } from 'lucide-react';
import { memberAPI } from '@shared/api';
import type { Member } from '../types.ts';

const MY_USER_ID = 'USR-CLIENT-001';

export default function Membership({ onBack }: { onBack: () => void }) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const vips = [
    { level: 'VIP 1', color: 'bg-slate-400', textColor: 'text-slate-900', shadow: 'shadow-slate-200' },
    { level: 'VIP 2', color: 'bg-emerald-400', textColor: 'text-emerald-950', shadow: 'shadow-emerald-200' },
    { level: 'VIP 3', color: 'bg-blue-400', textColor: 'text-blue-950', shadow: 'shadow-blue-200' },
    { level: 'VIP 4', color: 'bg-purple-500', textColor: 'text-white', shadow: 'shadow-purple-200' },
    { level: 'VIP 5', color: 'bg-amber-500', textColor: 'text-amber-950', shadow: 'shadow-amber-200' },
  ];

  const benefits = [
    { icon: Gift, title: '专享折扣', desc: '全场盲盒 8.5 折起', level: 1 },
    { icon: Zap, title: '极速发货', desc: '订单优先打包处理', level: 2 },
    { icon: Star, title: '新品优先', desc: '热门盲盒抢先选购', level: 3 },
    { icon: Shield, title: '售后保障', desc: '专属客服 1对1 服务', level: 4 },
    { icon: Crown, title: '生日大礼', desc: '每年生日获精选绘本', level: 5 },
  ];

  useEffect(() => {
    loadMember();
  }, []);

  const loadMember = async () => {
    setLoading(true);
    const res = await memberAPI.getMembers({ keyword: '张明远', pageSize: 5 });
    setLoading(false);
    if (res.success && res.data && res.data.length > 0) {
      setMember(res.data.find(m => m.userId === MY_USER_ID) || res.data[0]);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  const levelStr = member?.level || 'VIP 3';
  const activeTab = Math.max(0, (parseInt((levelStr.match(/\d/) || ['3'])[0]) || 3) - 1);

  const handleJoinRenew = async () => {
    setJoining(true);
    const res = await memberAPI.joinMembership();
    setJoining(false);
    if (res.success) {
      showToast('会员申请已提交');
      loadMember();
    } else {
      showToast(res.message || '操作失败');
    }
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-on-surface/90 text-surface px-5 py-2.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm">
          {toast}
        </div>
      )}

      {/* Vip Selection Tabs */}
      <div className="flex justify-between items-center bg-surface-container-low p-2 rounded-2xl mb-8 border border-outline-variant/30">
        {vips.map((vip, index) => (
          <button
            key={vip.level}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
              activeTab === index
                ? `${vip.color} ${vip.textColor} shadow-lg scale-105`
                : 'text-on-surface-variant opacity-50 hover:opacity-100'
            }`}
          >
            {vip.level.replace(' ', '')}
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
                <h2 className="text-3xl font-black italic tracking-tighter mt-1">{vips[activeTab].level.replace(' ', '')} Member</h2>
              </div>
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                <Crown size={24} />
              </div>
            </div>

            <div className="mt-12 flex justify-between items-end">
              <div>
                {loading ? (
                  <div className="space-y-1.5">
                    <div className="h-3 w-32 bg-white/20 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-white/20 rounded animate-pulse" />
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] font-bold opacity-60">ID: Reader_{member?.id || '2024_001'}</p>
                    <p className="text-sm font-black mt-1">{member?.name || '悦读者'}</p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span className="text-[10px] font-black">尊享特权中</span>
              </div>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Membership Summary */}
      <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 mb-8 flex justify-between items-center shadow-sm">
        <div>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">累计消费</p>
          <p className="text-2xl font-black text-primary mt-1">
            ¥{loading ? '--' : (member?.totalAmount || 0).toLocaleString()}
          </p>
        </div>
        <div className="h-12 w-px bg-outline-variant/30" />
        <div>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">注册时间</p>
          <p className="text-sm font-bold text-on-surface mt-1">
            {loading ? '--' : (member?.registerDate || '2023-06-25')}
          </p>
        </div>
      </section>

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
        <h4 className="text-sm font-black text-on-secondary-fixed">
          {activeTab >= vips.length - 1 ? '已是最高等级会员' : '升级至下一等级'}
        </h4>
        <p className="text-[10px] text-on-secondary-fixed-variant mt-2 mb-6">
          {activeTab >= vips.length - 1
            ? '感谢您的支持，享受更多专属权益吧'
            : `再完成 ${Math.max(1, (activeTab + 2) * 2 - 1)} 笔订单或续费会员，即可升级至 ${vips[activeTab + 1]?.level}`}
        </p>
        <button
          onClick={handleJoinRenew}
          disabled={joining}
          className="w-full bg-secondary text-on-secondary py-4 rounded-full font-black text-sm shadow-md squishy-active disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {joining && <Loader2 size={16} className="animate-spin" />}
          {joining ? '提交中...' : (activeTab >= vips.length - 1 ? '续费会员' : '立即升级会员')}
        </button>
      </section>
    </div>
  );
}
