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
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] glass-dark text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl animate-pop">
          {toast}
        </div>
      )}

      {/* Vip Selection Tabs */}
      <div className="flex justify-between items-center glass p-1.5 rounded-2xl mb-7 border border-white/50 shadow-sm">
        {vips.map((vip, index) => (
          <button
            key={vip.level}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
              activeTab === index
                ? 'bg-brand-gradient text-white shadow-glow scale-105'
                : 'text-on-surface-variant opacity-60'
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
          className="relative overflow-hidden rounded-[28px] p-7 min-h-[210px] mb-8 shadow-xl"
          style={{ background: 'linear-gradient(135deg, #6b4d12 0%, #a67c22 45%, #e3c779 100%)', color: '#2a1c05' }}
        >
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-48 h-48 opacity-20 -mr-12 -mt-12 pointer-events-none text-white">
            <Crown size={192} strokeWidth={1} />
          </div>
          <div className="absolute -bottom-10 -left-8 w-32 h-32 rounded-full bg-white/20 blur-xl" />

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-70">Membership</span>
                <h2 className="font-serif text-3xl font-black tracking-tight mt-1 text-white">{vips[activeTab].level.replace(' ', '')} <span className="text-lg">会员</span></h2>
              </div>
              <div className="bg-white/25 p-2.5 rounded-2xl backdrop-blur-md text-white">
                <Crown size={24} />
              </div>
            </div>

            <div className="mt-10 flex justify-between items-end">
              <div>
                {loading ? (
                  <div className="space-y-1.5">
                    <div className="h-3 w-32 bg-white/30 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-white/30 rounded animate-pulse" />
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] font-bold opacity-70 text-white">NO. Reader_{member?.id || '2024_001'}</p>
                    <p className="text-base font-black mt-1 text-white">{member?.name || '悦读者'}</p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 bg-black/15 text-white px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span className="text-[10px] font-black">尊享特权中</span>
              </div>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Membership Summary */}
      <section className="card-elevated p-5 mb-7 flex justify-between items-center">
        <div>
          <p className="text-[10px] text-on-surface-variant font-bold">累计消费</p>
          <p className="text-2xl font-black text-primary mt-1">
            ¥{loading ? '--' : (member?.totalAmount || 0).toLocaleString()}
          </p>
        </div>
        <div className="h-12 w-px bg-outline-variant/50" />
        <div>
          <p className="text-[10px] text-on-surface-variant font-bold">注册时间</p>
          <p className="text-sm font-bold text-on-surface mt-1">
            {loading ? '--' : (member?.registerDate || '2023-06-25')}
          </p>
        </div>
      </section>

      {/* Benefits List */}
      <section className="space-y-3">
        <h3 className="font-serif text-base font-black text-on-surface mb-1">等级专属权益</h3>
        <div className="grid grid-cols-1 gap-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            const isUnlocked = activeTab + 1 >= benefit.level;
            return (
              <div
                key={benefit.title}
                className={`card p-4 flex items-center justify-between transition-all ${
                  isUnlocked ? '' : 'opacity-50 border-dashed'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl ${isUnlocked ? 'bg-primary-fixed/50 text-primary' : 'bg-surface-container text-outline'}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-on-surface">{benefit.title}</h4>
                    <p className="text-[11px] font-medium text-on-surface-variant">{benefit.desc}</p>
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
      <section className="mt-8 card-elevated p-6 text-center">
        <h4 className="font-serif text-base font-black text-on-surface">
          {activeTab >= vips.length - 1 ? '已是最高等级会员' : '升级至下一等级'}
        </h4>
        <p className="text-[11px] text-on-surface-variant mt-2 mb-5">
          {activeTab >= vips.length - 1
            ? '感谢您的支持，享受更多专属权益吧'
            : `再完成 ${Math.max(1, (activeTab + 2) * 2 - 1)} 笔订单或续费会员，即可升级至 ${vips[activeTab + 1]?.level}`}
        </p>
        <button
          onClick={handleJoinRenew}
          disabled={joining}
          className="w-full btn-primary py-4 text-sm disabled:opacity-60"
        >
          {joining && <Loader2 size={16} className="animate-spin" />}
          {joining ? '提交中...' : (activeTab >= vips.length - 1 ? '续费会员' : '立即升级会员')}
        </button>
      </section>
    </div>
  );
}
