import { useEffect, useState } from 'react';
import { walletAPI } from '@shared/api';
import type { Wallet, Transaction } from '../types.ts';
import { ShieldCheck, PlusCircle, CreditCard, Receipt, ChevronRight, BookOpen, Wallet as WalletIcon, Users, Loader2 } from 'lucide-react';

const iconMap: Record<string, any> = {
  BookOpen,
  Wallet: WalletIcon,
  Users,
  CreditCard
};

export default function Wallet({ onBack }: { onBack: () => void }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  const loadData = async () => {
    setLoading(true);
    const [wRes, tRes] = await Promise.all([
      walletAPI.getWallet(),
      walletAPI.getTransactions({ pageSize: 20 }),
    ]);
    setLoading(false);
    if (wRes.success && wRes.data) setWallet(wRes.data);
    if (tRes.success && tRes.data) setTransactions(tRes.data);
  };

  const handleRecharge = async () => {
    const amt = parseFloat(rechargeAmount);
    if (!amt || amt <= 0) {
      showToast('请输入有效金额');
      return;
    }
    setActionLoading('recharge');
    const res = await walletAPI.recharge(amt);
    setActionLoading(null);
    if (res.success) {
      showToast(`充值成功 +¥${amt}`);
      setShowRecharge(false);
      setRechargeAmount('');
      loadData();
    } else {
      showToast(res.message || '充值失败');
    }
  };

  const handleWithdraw = async () => {
    if (!wallet) return;
    const amt = Math.min(100, wallet.balance);
    if (amt <= 0) {
      showToast('余额不足');
      return;
    }
    setActionLoading('withdraw');
    const res = await walletAPI.withdraw(amt, '模拟账户');
    setActionLoading(null);
    if (res.success) {
      showToast(`提现成功 -¥${amt}`);
      loadData();
    } else {
      showToast(res.message || '提现失败');
    }
  };

  const balance = wallet?.balance || 0;
  const totalIncome = wallet?.totalIncome || 0;
  const totalExpense = wallet?.totalExpense || 0;

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-on-surface/90 text-surface px-5 py-2.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm">
          {toast}
        </div>
      )}

      {/* Recharge Modal */}
      {showRecharge && (
        <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowRecharge(false)}>
          <div className="bg-surface-container-lowest w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black text-on-surface mb-6 text-center">钱包充值</h3>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {[50, 100, 200, 500].map(v => (
                <button
                  key={v}
                  onClick={() => setRechargeAmount(String(v))}
                  className={`py-3 rounded-xl font-black text-sm transition-all ${
                    rechargeAmount === String(v)
                      ? 'bg-primary text-on-primary shadow-md scale-105'
                      : 'bg-surface-container text-on-surface border border-outline-variant/30'
                  }`}
                >
                  ¥{v}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={rechargeAmount}
              onChange={e => setRechargeAmount(e.target.value)}
              placeholder="或输入其他金额"
              className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-sm mb-6 outline-none focus:border-primary"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowRecharge(false)} className="flex-1 py-3 rounded-full bg-surface-container text-on-surface font-bold text-sm">
                取消
              </button>
              <button
                onClick={handleRecharge}
                disabled={actionLoading === 'recharge'}
                className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold text-sm shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {actionLoading === 'recharge' ? <Loader2 size={16} className="animate-spin" /> : null}
                确认充值
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Balance Card */}
      <section className="relative overflow-hidden rounded-3xl p-8 shadow-xl bg-primary text-white">
        {/* Pattern Overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-20 -mr-16 -mt-16">
          <BookOpen className="w-full h-full" size={256} />
        </div>

        <div className="relative z-10">
          <p className="text-xs opacity-90 mb-2 font-medium">钱包余额 (元)</p>
          {loading ? (
            <div className="h-12 w-40 bg-white/20 rounded animate-pulse mb-4" />
          ) : (
            <h2 className="text-4xl font-black mb-4 tracking-tight">¥ {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-secondary-fixed">
              <ShieldCheck size={16} fill="currentColor" fillOpacity={0.2} />
              <span className="text-[10px] font-bold">账户资金受安全保障</span>
            </div>
            <div className="flex gap-4 text-[10px] text-white/70">
              <span>收入 ¥{totalIncome.toLocaleString()}</span>
              <span>支出 ¥{totalExpense.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="grid grid-cols-2 gap-4 mt-8">
        <button
          onClick={() => setShowRecharge(true)}
          disabled={actionLoading === 'recharge'}
          className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container py-5 rounded-2xl shadow-sm squishy-active group border border-primary/10 disabled:opacity-60"
        >
          <PlusCircle className="mb-2 group-hover:scale-110 transition-transform" size={28} />
          <span className="text-sm font-bold">充值</span>
        </button>
        <button
          onClick={handleWithdraw}
          disabled={actionLoading === 'withdraw'}
          className="flex flex-col items-center justify-center bg-surface-container-high text-on-surface py-5 rounded-2xl shadow-sm squishy-active group border border-outline-variant/30 disabled:opacity-60 relative"
        >
          {actionLoading === 'withdraw' ? (
            <Loader2 className="mb-2 animate-spin" size={28} />
          ) : (
            <CreditCard className="mb-2 group-hover:scale-110 transition-transform" size={28} />
          )}
          <span className="text-sm font-bold">提现（≤¥100）</span>
        </button>
      </section>

      {/* Transaction History Entrance */}
      <section className="mt-8">
        <div className="w-full flex items-center justify-between bg-surface-container-low p-5 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-on-background text-on-primary rounded-full flex items-center justify-center shadow-inner">
              <Receipt size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold">交易明细</h3>
              <p className="text-[10px] text-on-surface-variant font-medium opacity-70">查看所有收支记录（共 {transactions.length} 条）</p>
            </div>
          </div>
          <ChevronRight className="text-on-surface-variant group-hover:translate-x-1 transition-transform" size={20} />
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="mt-8 mb-12">
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="text-sm font-bold text-on-surface">最近交易</h3>
          <span className="text-primary text-[10px] font-bold opacity-70">共 {transactions.length} 条</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-10 text-center text-on-surface-variant text-sm border-2 border-dashed border-outline-variant rounded-2xl">
            暂无交易记录
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const Icon = iconMap[tx.icon || ''] || Receipt;
              const isExpense = tx.type === 'expense';
              return (
                <div key={tx.id} className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between shadow-sm border border-outline-variant/30 hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isExpense ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{tx.title}</h4>
                      <p className="text-[9px] text-on-surface-variant opacity-60 font-medium">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-black ${isExpense ? 'text-error' : 'text-secondary'}`}>
                    {isExpense ? '-' : '+'} ¥ {Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Safety Footer */}
      <footer className="flex flex-col items-center justify-center py-8 opacity-40">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <ShieldCheck size={14} />
          <p className="text-[10px] font-bold">资金托管于支付结算平台</p>
        </div>
      </footer>
    </div>
  );
}
