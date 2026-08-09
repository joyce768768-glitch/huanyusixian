import { TRANSACTIONS } from '../data.ts';
import { ShieldCheck, PlusCircle, CreditCard, Receipt, ChevronRight, BookOpen, Wallet as WalletIcon, Users } from 'lucide-react';

const iconMap: Record<string, any> = {
  BookOpen,
  Wallet: WalletIcon,
  Users,
  CreditCard
};

export default function Wallet({ onBack }: { onBack: () => void }) {
  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      {/* Wallet Balance Card */}
      <section className="relative overflow-hidden rounded-3xl p-8 shadow-xl bg-primary text-white">
        {/* Pattern Overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-20 -mr-16 -mt-16">
          <BookOpen className="w-full h-full" size={256} />
        </div>
        
        <div className="relative z-10">
          <p className="text-xs opacity-90 mb-2 font-medium">钱包余额 (元)</p>
          <h2 className="text-4xl font-black mb-4 tracking-tight">¥ 1,250.00</h2>
          
          <div className="flex items-center gap-2 text-secondary-fixed">
            <ShieldCheck size={16} fill="currentColor" fillOpacity={0.2} />
            <span className="text-[10px] font-bold">账户资金受安全保障</span>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="grid grid-cols-2 gap-4 mt-8">
        <button className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container py-5 rounded-2xl shadow-sm squishy-active group border border-primary/10">
          <PlusCircle className="mb-2 group-hover:scale-110 transition-transform" size={28} />
          <span className="text-sm font-bold">充值</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-surface-container-high text-on-surface py-5 rounded-2xl shadow-sm squishy-active group border border-outline-variant/30">
          <CreditCard className="mb-2 group-hover:scale-110 transition-transform" size={28} />
          <span className="text-sm font-bold">提现</span>
        </button>
      </section>

      {/* Transaction History Entrance */}
      <section className="mt-8">
        <button className="w-full flex items-center justify-between bg-surface-container-low p-5 rounded-2xl hover:bg-surface-container transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-on-background text-on-primary rounded-full flex items-center justify-center shadow-inner">
              <Receipt size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold">交易明细</h3>
              <p className="text-[10px] text-on-surface-variant font-medium opacity-70">查看所有收支记录</p>
            </div>
          </div>
          <ChevronRight className="text-on-surface-variant group-hover:translate-x-1 transition-transform" size={20} />
        </button>
      </section>

      {/* Recent Transactions */}
      <section className="mt-8 mb-12">
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="text-sm font-bold text-on-surface">最近交易</h3>
          <button className="text-primary text-[10px] font-bold hover:underline underline-offset-4">查看全部</button>
        </div>

        <div className="space-y-3">
          {TRANSACTIONS.map((tx) => {
            const Icon = iconMap[tx.icon] || Receipt;
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
