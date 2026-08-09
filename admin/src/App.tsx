/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Store, 
  Package, 
  Megaphone, 
  Wallet, 
  Truck, 
  ShieldCheck, 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronRight, 
  MoreVertical,
  TrendingUp,
  Plus,
  Download,
  Filter,
  Eye,
  LogOut,
  User,
  Settings,
  MoreHorizontal,
  Pencil,
  Edit2,
  UserPlus,
  Ticket,
  History,
  ToggleRight,
  ToggleLeft,
  ClipboardList,
  CheckCircle2,
  Clock,
  X,
  Printer,
  RotateCcw,
  MapPin,
  PackageCheck,
  PlusCircle,
  Trash2,
  AlertCircle,
  Bold,
  Italic,
  List,
  Image,
  Link
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type PageView = 'stats' | 'orders' | 'distributors' | 'members' | 'products' | 'marketing' | 'finance' | 'logistics' | 'permissions';

interface NavItem {
  id: PageView;
  label: string;
  icon: React.ElementType;
}

// --- Menu Configuration ---

const NAV_ITEMS: NavItem[] = [
  { id: 'stats', label: '数据统计', icon: LayoutDashboard },
  { id: 'orders', label: '订单管理', icon: ShoppingCart },
  { id: 'distributors', label: '分销商管理', icon: Users },
  { id: 'members', label: '门店会员管理', icon: Store },
  { id: 'products', label: '商品管理', icon: Package },
  { id: 'marketing', label: '营销活动设置', icon: Megaphone },
  { id: 'finance', label: '收支管理', icon: Wallet },
  { id: 'logistics', label: '物流设置', icon: Truck },
  { id: 'permissions', label: '权限设置', icon: ShieldCheck },
];

// --- Sub-components ---

const StatsCard = ({ title, value, trend, isPositive = true }: { title: string; value: string; trend?: string; isPositive?: boolean }) => (
  <div className="bg-white p-lg rounded-xl shadow-sm border border-slate-200/60 hover:border-black transition-colors group pl-5">
    <div className="flex justify-between items-start mb-4">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-5">{title}</span>
      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-colors">
        <TrendingUp size={16} />
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-bold font-heading">{value}</h3>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          <TrendingUp size={12} className={isPositive ? '' : 'rotate-180'} />
          {trend} <span className="text-slate-400 font-normal">较上月</span>
        </div>
      )}
    </div>
  </div>
);

// --- Pages ---

const DashboardPage = () => (
  <div className="space-y-5">
    {/* Breadcrumb */}
    <nav className="flex items-center text-slate-400 text-xs font-bold gap-1 uppercase tracking-widest">
      <span className="text-slate-900">数据统计</span>
      <ChevronRight size={14} />
      <span className="text-slate-900">首页仪表盘</span>
    </nav>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
      <StatsCard title="总销售额" value="¥1,280,430" trend="+12.5%" />
      <StatsCard title="佣金收益" value="¥152,240" trend="+8.2%" />
      <StatsCard title="今日订单" value="1,842" trend="+42" />
      <StatsCard title="活跃分销商" value="528" trend="+14%" />
      <StatsCard title="高级入驻费" value="¥12,800" trend="+5.2%" />
      <StatsCard title="中级入驻费" value="¥5,400" trend="+3.1%" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-lg border-b border-slate-200/60 flex justify-between items-center h-10 pl-5">
          <h3 className="font-heading font-bold">近期热销排行</h3>
          <button className="text-[12px] font-bold text-[#999999] flex items-center gap-1 hover:underline underline-offset-4 cursor-pointer">
            查看详情 <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">产品详情</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">销量</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">总销售额</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 tabular-nums text-sm">
              {[
                { name: '儿童绘本 - 小王子', cat: '儿童绘本', sales: 1204, amount: '¥451,150' },
                { name: '儿童绘本 - 安徒生童话', cat: '儿童绘本', sales: 856, amount: '¥325,528' },
                { name: '儿童绘本 - 格林童话', cat: '儿童绘本', sales: 412, amount: '¥288,840' },
              ].map((p, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.cat}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium">{p.sales}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">{p.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/60 shadow-sm flex flex-col">
          <div className="p-lg border-b border-slate-200/60 h-10 flex items-center pl-5">
            <h3 className="font-heading font-bold">分销商排行榜</h3>
          </div>
          <div className="flex-1 px-lg pb-lg space-y-4 pl-5 pt-5">
            {[
              { rank: 1, bg: 'bg-red-500', text: 'text-white' },
              { rank: 2, bg: 'bg-orange-500', text: 'text-white' },
              { rank: 3, bg: 'bg-yellow-500', text: 'text-white' },
              { rank: 4, bg: 'bg-[#666666]', text: 'text-white' },
            ].map((item) => (
              <div key={item.rank} className="flex items-center gap-4 transition-all hover:translate-x-1 duration-200">
                <div className={`w-[20px] h-[20px] rounded-full ${item.bg} ${item.text} flex items-center justify-center font-bold text-[10px]`}>
                  {item.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">分销商 {item.rank}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">LEVEL {5-item.rank}</p>
                </div>
                <p className="text-sm font-bold text-emerald-600 pr-5">¥{(15000 / item.rank).toLocaleString()}</p>
              </div>
            ))}
          </div>
      </div>
    </div>
  </div>
);

const OrdersPage = ({ onSelectOrder }: { onSelectOrder: (id: string) => void }) => {
  const [selectedOrders, setSelectedOrders] = React.useState<string[]>([]);
  const orders = [
    { id: 'ORD-20231027-8892', goods: '智能手环 Pro Max 2024', qty: 12, amount: '¥4,788.00', time: '2024-05-24 14:32', dist: '张晓明', status: '已完成', color: 'emerald', log: 'ship' },
    { id: 'ORD-20231224-1102', goods: '无线降噪耳机 X1', qty: 5, amount: '¥6,495.00', time: '2024-05-24 11:15', dist: '李思思', status: '待发货', color: 'amber', log: 'box' },
    { id: 'ORD-20230523-9982', goods: '4K 超清显示器 27"', qty: 2, amount: '¥3,998.00', time: '2024-05-23 16:45', dist: '王伟', status: '已退货', color: 'rose', log: 'return' },
    { id: 'ORD-20230912-3345', goods: '便携式户外电源 500W', qty: 15, amount: '¥22,350.00', time: '2024-05-23 09:20', dist: '赵丽华', status: '已完成', color: 'emerald', log: 'ship' },
  ];
  
  const allOrderIds = orders.map(o => o.id);
  const isAllSelected = selectedOrders.length === allOrderIds.length;
  
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(allOrderIds);
    }
  };
  
  const handleSelectOrder = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };
  
  const handlePrintSelected = () => {
    if (selectedOrders.length > 0) {
      alert(`正在打印 ${selectedOrders.length} 个订单：\n${selectedOrders.join('\n')}`);
    }
  };

  return (
  <div className="space-y-5">
    {/* Breadcrumb */}
    <nav className="flex items-center text-slate-400 text-xs font-bold gap-1 uppercase tracking-widest">
      <span className="text-slate-900">订单管理</span>
      <ChevronRight size={14} />
      <span className="text-slate-900">订单列表</span>
    </nav>

    {/* Page Header */}
    <div className="flex justify-end gap-3">
      {selectedOrders.length > 0 && (
        <button 
          onClick={handlePrintSelected}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
        >
          <Printer size={16} /> 批量打印 ({selectedOrders.length})
        </button>
      )}
      <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all cursor-pointer shadow-sm">
        <Download size={16} /> 导出数据
      </button>
    </div>

    {/* Statistics Bar */}
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
      {[
        { label: '今日支付金额', val: '¥124,580', trend: '+12.5%', color: 'emerald' },
        { label: '支付订单', val: '24', detail: '当日累计', color: 'slate' },
        { label: '待付款', val: '12', detail: '需要跟进', color: 'blue' },
        { label: '待发货', val: '56', detail: '待处理', color: 'amber' },
        { label: '待收货', val: '128', detail: '运输中', color: 'slate' },
        { label: '退款退货', val: '3', detail: '异常处理', color: 'rose' },
      ].map((s, i) => (
        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col justify-between h-28 pl-5 pt-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</span>
          <div>
            <p className={`text-2xl font-bold font-heading ${s.color === 'rose' ? 'text-rose-600' : 'text-slate-900'}`}>{s.val}</p>
            {s.trend ? (
              <p className="text-[10px] font-bold text-emerald-500 mt-1 flex items-center gap-0.5">
                <TrendingUp size={10} /> {s.trend}
              </p>
            ) : (
              <p className="text-[10px] text-slate-400 font-medium mt-1">{s.detail}</p>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Filters & Table */}
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
      {/* Filters Bar */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">日期</span>
          <input type="date" className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold outline-none focus:ring-1 focus:ring-black" defaultValue="2024-05-24" />
        </div>
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-black outline-none" placeholder="搜索订单商品、单号或分销商..." />
        </div>
        <button className="px-4 py-1.5 bg-black text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5">
          <Search size={14} /> 搜索
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 w-12">
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">序号</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">订单商品名称</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">数量</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">订单金额</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">交易时间</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">物流</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">状态</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">分销商</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                <div className="flex items-center justify-end gap-2">
                  <Printer size={14} className="text-slate-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 tabular-nums text-sm">
            {orders.map((ord, i) => (
              <tr 
                key={i} 
                className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                onClick={() => onSelectOrder(ord.id)}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    checked={selectedOrders.includes(ord.id)}
                    onChange={(e) => handleSelectOrder(ord.id, e as unknown as React.MouseEvent)}
                    className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4 text-xs text-slate-400 font-mono">{ord.id}</td>
                <td className="px-6 py-4">
                  <div className="max-w-[200px] truncate text-xs font-bold text-slate-900" title={ord.goods}>
                    {ord.goods}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-900 text-center">{ord.qty}</td>
                <td className="px-6 py-4 text-right text-xs font-bold text-slate-900">{ord.amount}</td>
                <td className="px-6 py-4 text-right text-[10px] font-bold text-slate-400">{ord.time}</td>
                <td className="px-6 py-4 text-center">
                  <div className="relative group/tooltip flex justify-center">
                    {ord.log === 'ship' && <Truck size={14} className="text-emerald-500 cursor-help" />}
                    {ord.log === 'box' && <Package size={14} className="text-slate-300 cursor-help" />}
                    {ord.log === 'return' && <RotateCcw size={14} className="text-rose-500 cursor-help" />}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block z-50">
                      <div className="bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-xl border border-white/10">
                        {ord.log === 'ship' ? '顺丰速运 - 已签收' : ord.log === 'box' ? '仓库配货中...' : '退货运输中'}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest
                    ${ord.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : ord.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                    {ord.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                      {ord.dist[0]}
                    </div>
                    <span className="text-xs text-slate-600 font-bold">{ord.dist}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-300 hover:text-black transition-colors" title="查看详情" onClick={(e) => { e.stopPropagation(); onSelectOrder(ord.id); }}><Eye size={14} /></button>
                    {ord.status === '待发货' && (
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-300 hover:text-black transition-colors" title="打印快递单" onClick={(e) => e.stopPropagation()}><Printer size={14} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer */}
      <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            显示 1-4 共 42 条订单
          </p>
          <div className="flex gap-1.5">
            <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:bg-white text-slate-300 disabled:opacity-30" disabled><ChevronRight className="rotate-180" size={14} /></button>
            <button className="w-7 h-7 flex items-center justify-center bg-black text-white text-[10px] font-bold rounded">1</button>
            <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:bg-white text-[10px] font-bold text-slate-600">2</button>
            <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:bg-white text-slate-300"><ChevronRight size={14} /></button>
          </div>
      </div>
    </div>
  </div>
  );
};

const MembersPage = () => {
    const [selectedVip, setSelectedVip] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [vipLevels, setVipLevels] = useState([
        { lvl: 'VIP 1', threshold: '注册即可', thresholdAmount: 0, discount: '9.8折', discountValue: 9.8 },
        { lvl: 'VIP 2', threshold: '累计消费500', thresholdAmount: 500, discount: '9.5折', discountValue: 9.5 },
        { lvl: 'VIP 3', threshold: '累计消费1200', thresholdAmount: 1200, discount: '9.2折', discountValue: 9.2 },
        { lvl: 'VIP 4', threshold: '累计消费2000', thresholdAmount: 2000, discount: '8.8折', discountValue: 8.8 },
        { lvl: 'VIP 5', threshold: '累计消费3000', thresholdAmount: 3000, discount: '8.5折', discountValue: 8.5 },
    ]);

    const allMembers = [
        { name: '张晓明', lvl: 'VIP 5', spent: '¥24,450', date: '2023-10-15' },
        { name: '李思思', lvl: 'VIP 3', spent: '¥4,480', date: '2023-11-02' },
        { name: '王大林', lvl: 'VIP 1', spent: '¥0.00', date: '2024-01-20' },
        { name: '赵小红', lvl: 'VIP 4', spent: '¥8,520', date: '2023-09-18' },
        { name: '陈大山', lvl: 'VIP 2', spent: '¥1,280', date: '2024-02-10' },
        { name: '刘小花', lvl: 'VIP 5', spent: '¥35,680', date: '2023-06-25' },
        { name: '周大海', lvl: 'VIP 3', spent: '¥5,120', date: '2023-12-08' },
        { name: '吴小青', lvl: 'VIP 1', spent: '¥380', date: '2024-03-05' },
    ];

    const filteredMembers = selectedVip ? allMembers.filter(m => m.lvl === selectedVip) : allMembers;

    const handleVipClick = (lvl: string) => {
        setSelectedVip(selectedVip === lvl ? null : lvl);
    };

    const handleEditClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingIndex(index);
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        if (editingIndex !== null) {
            const editingVip = vipLevels[editingIndex];
            setVipLevels(prev => prev.map((v, i) => 
                i === editingIndex ? {
                    ...v,
                    threshold: editingVip.thresholdAmount === 0 ? '注册即可' : `累计消费${editingVip.thresholdAmount}`,
                    discount: `${editingVip.discountValue}折`
                } : v
            ));
        }
        setShowEditModal(false);
        setEditingIndex(null);
    };

    return (
        <div className="space-y-5">
            {/* Breadcrumb */}
            <nav className="flex items-center text-slate-400 text-xs font-bold gap-1 uppercase tracking-widest">
                <span className="text-slate-900">门店会员管理</span>
                <ChevronRight size={14} />
                <span className="text-slate-900">会员等级</span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-[20px]">
                {vipLevels.map((v, i) => (
                    <div 
                        key={i} 
                        className={`p-4 rounded-xl border flex flex-col gap-2 transition-all cursor-pointer select-none relative
                            ${selectedVip === v.lvl ? 'bg-slate-900 border-slate-900 shadow-lg scale-105' : 'bg-white border-slate-200 hover:border-slate-400'}`}
                        onClick={() => handleVipClick(v.lvl)}
                    >
                        <button 
                            className="absolute top-2 right-2 p-1 rounded hover:bg-slate-200 transition-colors z-10"
                            onClick={(e) => handleEditClick(i, e)}
                        >
                            <Edit2 size={14} className={selectedVip === v.lvl ? 'text-slate-400' : 'text-slate-400'} />
                        </button>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedVip === v.lvl ? 'text-slate-400' : 'text-slate-400'}`}>Level 0{i+1}</span>
                        <h4 className={`text-lg font-bold ${selectedVip === v.lvl ? 'text-white' : 'text-slate-900'}`}>{v.lvl}</h4>
                        <div className={`mt-2 pt-2 border-t flex flex-col gap-1 ${selectedVip === v.lvl ? 'border-white/10' : 'border-slate-100'}`}>
                           <div className="flex justify-between items-center text-[11px]">
                              <span className={`${selectedVip === v.lvl ? 'text-slate-500' : 'text-slate-400'}`}>门槛</span>
                              <span className={`font-bold ${selectedVip === v.lvl ? 'text-white' : 'text-slate-700'}`}>{v.threshold}</span>
                           </div>
                           <div className="flex justify-between items-center text-[11px]">
                              <span className={`${selectedVip === v.lvl ? 'text-slate-500' : 'text-slate-400'}`}>权益</span>
                              <span className={`font-bold ${selectedVip === v.lvl ? 'text-emerald-400' : 'text-emerald-600'}`}>{v.discount}</span>
                           </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="h-[50px] pl-5 border-b border-slate-200/60 flex items-center">
                    <h3 className="font-heading font-bold">会员列表</h3>
                    {selectedVip && (
                        <span className="ml-3 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded">
                            {selectedVip}
                        </span>
                    )}
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">微信名称</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">当前等级</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">累计消费</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">注册时间</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 tabular-nums text-sm">
                        {filteredMembers.map((m, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-900">{m.name}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">{m.lvl}</span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">{m.spent}</td>
                                <td className="px-6 py-4 text-right text-slate-400">{m.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* 翻页组件 */}
                <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        显示 1-{filteredMembers.length} 共 {filteredMembers.length} 条记录
                    </p>
                    <div className="flex gap-1.5">
                        <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:bg-white text-slate-300 disabled:opacity-30" disabled><ChevronRight className="rotate-180" size={14} /></button>
                        <button className="w-7 h-7 flex items-center justify-center bg-black text-white text-[10px] font-bold rounded">1</button>
                        <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:bg-white text-slate-300"><ChevronRight size={14} /></button>
                    </div>
                </div>
            </div>

            {/* 编辑弹窗 */}
            {showEditModal && editingIndex !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-heading font-bold">编辑 VIP 等级</h3>
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => { setShowEditModal(false); setEditingIndex(null); }}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700">
                                    <span className="text-rose-500 mr-1">*</span>等级名称:
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                                    value={vipLevels[editingIndex].lvl}
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700">
                                    <span className="text-rose-500 mr-1">*</span>消费门槛（元）:
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                                    value={vipLevels[editingIndex].thresholdAmount}
                                    onChange={(e) => setVipLevels(prev => prev.map((v, i) => 
                                        i === editingIndex ? { ...v, thresholdAmount: parseInt(e.target.value) || 0 } : v
                                    ))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700">
                                    <span className="text-rose-500 mr-1">*</span>折扣（折）:
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    step="0.1"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                                    value={vipLevels[editingIndex].discountValue}
                                    onChange={(e) => setVipLevels(prev => prev.map((v, i) => 
                                        i === editingIndex ? { ...v, discountValue: parseFloat(e.target.value) || 10 } : v
                                    ))}
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
                            <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors" onClick={() => { setShowEditModal(false); setEditingIndex(null); }}>取消</button>
                            <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:opacity-90 transition-colors" onClick={handleSaveEdit}>保存</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const LogisticsPage = ({ shippingTemplates, setShippingTemplates }: { shippingTemplates: ShippingTemplate[]; setShippingTemplates: React.Dispatch<React.SetStateAction<ShippingTemplate[]>> }) => {
    const [showModal, setShowModal] = useState(false);
    const [showRegionModal, setShowRegionModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<number | null>(null);
    const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);

    const templates = shippingTemplates;

    const [addresses, setAddresses] = useState([
        { id: '1', name: '上海总仓 (HQ)', user: '张伟', phone: '138-0000-1111', area: '上海市 浦东新区', detail: '金桥路1234号 B座 501室' },
        { id: '2', name: '深圳分拨中心', user: '李娜', phone: '139-1111-2222', area: '广东省 深圳市', detail: '南山区 粤海街道 科技园北区 8号仓' },
        { id: '3', name: '北京办事处', user: '王五', phone: '136-2222-3333', area: '北京市 朝阳区', detail: '望京 SOHO T3 12层' },
    ]);

    const defaultAddressForm = {
        name: '',
        user: '',
        phone: '',
        area: '',
        detail: ''
    };

    const [addressForm, setAddressForm] = useState(defaultAddressForm);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

    const allRegions = [
        { name: '北京市', group: '直辖市' },
        { name: '天津市', group: '直辖市' },
        { name: '上海市', group: '直辖市' },
        { name: '重庆市', group: '直辖市' },
        { name: '河北省', group: '华北' },
        { name: '山西省', group: '华北' },
        { name: '内蒙古自治区', group: '华北' },
        { name: '辽宁省', group: '东北' },
        { name: '吉林省', group: '东北' },
        { name: '黑龙江省', group: '东北' },
        { name: '江苏省', group: '华东' },
        { name: '浙江省', group: '华东' },
        { name: '安徽省', group: '华东' },
        { name: '福建省', group: '华东' },
        { name: '江西省', group: '华东' },
        { name: '山东省', group: '华东' },
        { name: '河南省', group: '中南' },
        { name: '湖北省', group: '中南' },
        { name: '湖南省', group: '中南' },
        { name: '广东省', group: '中南' },
        { name: '广西壮族自治区', group: '中南' },
        { name: '海南省', group: '中南' },
        { name: '四川省', group: '西南' },
        { name: '贵州省', group: '西南' },
        { name: '云南省', group: '西南' },
        { name: '西藏自治区', group: '西南' },
        { name: '陕西省', group: '西北' },
        { name: '甘肃省', group: '西北' },
        { name: '青海省', group: '西北' },
        { name: '宁夏回族自治区', group: '西北' },
        { name: '新疆维吾尔自治区', group: '西北' },
        { name: '香港特别行政区', group: '港澳台' },
        { name: '澳门特别行政区', group: '港澳台' },
        { name: '台湾省', group: '港澳台' },
    ];

    const groupedRegions = allRegions.reduce((acc, region) => {
        if (!acc[region.group]) {
            acc[region.group] = [];
        }
        acc[region.group].push(region);
        return acc;
    }, {} as Record<string, typeof allRegions>);

    const defaultFormData = {
        templateName: '',
        origin: '重庆 重庆市 大足区',
        deliveryMethod: true,
        pricingType: 'weight',
        defaultWeight: '1',
        defaultPrice: '4',
        addWeight: '1',
        addPrice: '2',
        regions: [],
        remark: ''
    };

    const [formData, setFormData] = useState(defaultFormData);

    const toggleRegion = (regionName: string) => {
        setSelectedRegions(prev => 
            prev.includes(regionName) 
                ? prev.filter(r => r !== regionName)
                : [...prev, regionName]
        );
    };

    const selectAll = () => {
        setSelectedRegions(allRegions.map(r => r.name));
    };

    const clearAll = () => {
        setSelectedRegions([]);
    };

    const confirmRegions = () => {
        if (selectedRegions.length > 0) {
            setFormData(prev => ({
                ...prev,
                regions: [...prev.regions, { 
                    area: selectedRegions.join('、'), 
                    firstWeight: '1', 
                    firstPrice: '5', 
                    addWeight: '1', 
                    addPrice: '2' 
                }]
            }));
        }
        setSelectedRegions([]);
        setShowRegionModal(false);
    };

    const handleRegionDelete = (index: number) => {
        setFormData(prev => ({
            ...prev,
            regions: prev.regions.filter((_, i) => i !== index)
        }));
    };

    const handleRegionAdd = () => {
        setShowRegionModal(true);
    };

    const openCreateModal = () => {
        setEditingTemplate(null);
        setFormData(defaultFormData);
        setShowModal(true);
    };

    const openEditModal = (index: number) => {
        const template = templates[index];
        setEditingTemplate(index);
        setFormData({
            templateName: template.name,
            origin: '重庆 重庆市 大足区',
            deliveryMethod: true,
            pricingType: template.mode.includes('重量') ? 'weight' : 'piece',
            defaultWeight: '1',
            defaultPrice: '4',
            addWeight: '1',
            addPrice: '2',
            regions: [{ area: template.area, firstWeight: '1', firstPrice: '5', addWeight: '1', addPrice: '2' }],
            remark: template.desc
        });
        setShowModal(true);
    };

    const handleSave = () => {
        const newTemplate = {
            id: Date.now().toString(),
            name: formData.templateName || '未命名模板',
            desc: formData.remark || '暂无描述',
            mode: formData.pricingType === 'weight' ? '按重量 (Per kg)' : '按件数 (Per item)',
            area: formData.regions.length > 0 ? formData.regions.map(r => r.area).join('; ') : '全国',
            date: new Date().toISOString().split('T')[0],
            status: '使用中',
            active: true
        };

        if (editingTemplate !== null) {
            setShippingTemplates(prev => prev.map((t, i) => i === editingTemplate ? newTemplate : t));
        } else {
            setShippingTemplates(prev => [...prev, newTemplate]);
        }

        setShowModal(false);
        setFormData(defaultFormData);
        setEditingTemplate(null);
    };

    const handleDelete = (index: number) => {
        if (confirm('确定要删除这个运费模板吗？')) {
            setShippingTemplates(prev => prev.filter((_, i) => i !== index));
        }
    };

    const openCreateAddressModal = () => {
        setEditingAddressIndex(null);
        setAddressForm(defaultAddressForm);
        setShowAddressModal(true);
    };

    const openEditAddressModal = (index: number) => {
        const address = addresses[index];
        setEditingAddressIndex(index);
        setAddressForm({
            name: address.name,
            user: address.user,
            phone: address.phone.replace(/[-]/g, ''),
            area: address.area,
            detail: address.detail
        });
        setShowAddressModal(true);
    };

    const handleSaveAddress = () => {
        const formattedPhone = addressForm.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        const newAddress = {
            id: Date.now().toString(),
            name: addressForm.name || '未命名地址',
            user: addressForm.user || '未设置',
            phone: formattedPhone || '未设置',
            area: addressForm.area || '未选择',
            detail: addressForm.detail || '未填写'
        };

        if (editingAddressIndex !== null) {
            setAddresses(prev => prev.map((addr, i) => i === editingAddressIndex ? { ...newAddress, id: addr.id } : addr));
        } else {
            setAddresses(prev => [...prev, newAddress]);
        }

        setShowAddressModal(false);
        setAddressForm(defaultAddressForm);
        setEditingAddressIndex(null);
    };

    const handleDeleteAddress = (index: number) => {
        if (confirm('确定要删除这个地址吗？')) {
            setAddresses(prev => prev.filter((_, i) => i !== index));
        }
    };

    return (
    <div className="space-y-5">

        {/* 发货地址管理 */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-lg border-b border-slate-200/60 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center">
                        <Truck size={20} />
                    </div>
                    <h3 className="font-heading font-bold text-lg">发货地址库</h3>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all cursor-pointer" onClick={openCreateAddressModal}>
                    <Plus size={16} /> 新增地址
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-nowrap">地址名称</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">联系人</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-nowrap">联系电话</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">详细地址</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 tabular-nums text-sm">
                        {addresses.map((addr, i) => (
                            <tr key={addr.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4 font-bold text-slate-900">{addr.name}</td>
                                <td className="px-6 py-4 text-slate-600">{addr.user}</td>
                                <td className="px-6 py-4 font-medium text-slate-700">{addr.phone}</td>
                                <td className="px-6 py-4">
                                    <p className="text-slate-900">{addr.area}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{addr.detail}</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-3">
                                        <button className="text-xs font-bold text-slate-400 hover:text-black transition-colors" onClick={() => openEditAddressModal(i)}>编辑</button>
                                        <button className="text-xs font-bold text-rose-400 hover:text-rose-600 transition-colors" onClick={() => handleDeleteAddress(i)}>删除</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 bg-slate-50/30 text-center border-t border-slate-100">
                <button className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">查看全部 {addresses.length} 个地址</button>
            </div>
        </div>

        {/* 运费模板设置 */}
        <section className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-lg border-b border-slate-200/60 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                        <Package size={20} />
                    </div>
                    <h3 className="font-heading font-bold text-lg">运费模板</h3>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer" onClick={openCreateModal}>
                    <Plus size={14} /> 创建新模板
                </button>
            </div>
            
            <div className="p-lg space-y-4">
                {templates.map((tpl, i) => (
                    <div key={tpl.id} className="p-4 border border-slate-200/60 rounded-xl hover:border-black transition-all group bg-slate-50/30">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h4 className="font-bold text-slate-900">{tpl.name}</h4>
                                    {tpl.status && (
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                            ${tpl.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                                            {tpl.status}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{tpl.desc}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200" onClick={() => openEditModal(i)}><Pencil size={14} /></button>
                                <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 text-rose-500" onClick={() => handleDelete(i)}><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-8 pt-4 border-t border-slate-200/40">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">计费方式</p>
                                <p className="text-xs font-bold text-slate-700 mt-1">{tpl.mode}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">配送覆盖</p>
                                <p className="text-xs font-bold text-slate-700 mt-1">{tpl.area}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">最后修改</p>
                                <p className="text-xs font-bold text-slate-700 mt-1">{tpl.date}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* 创建新模板弹窗 */}
        {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold font-heading">创建新模板</h3>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setShowModal(false)}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* 模板名称 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">
                                <span className="text-rose-500 mr-1">*</span>模板名称:
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                                value={formData.templateName}
                                onChange={(e) => setFormData(prev => ({ ...prev, templateName: e.target.value }))}
                            />
                        </div>

                        {/* 发货地 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">
                                <span className="text-rose-500 mr-1">*</span>发货地:
                            </label>
                            <select
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                                value={formData.origin}
                                onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                            >
                                <option>重庆 重庆市 大足区</option>
                                <option>上海 上海市 浦东新区</option>
                                <option>北京 北京市 朝阳区</option>
                            </select>
                        </div>

                        {/* 运送方式 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">
                                <span className="text-rose-500 mr-1">*</span>运送方式:
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.deliveryMethod}
                                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryMethod: e.target.checked }))}
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700">快递</span>
                                <span className="ml-auto text-xs text-slate-400">运费参考</span>
                            </label>
                        </div>

                        {/* 计价方式 */}
                        <div className="space-y-3 p-4 bg-slate-50/50 rounded-lg">
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="pricingType"
                                        value="weight"
                                        checked={formData.pricingType === 'weight'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, pricingType: e.target.value }))}
                                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-bold text-slate-700">按重量计价</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="pricingType"
                                        value="piece"
                                        checked={formData.pricingType === 'piece'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, pricingType: e.target.value }))}
                                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-bold text-slate-700">按件计价</span>
                                </label>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="text-slate-500">默认运费</span>
                                <input
                                    type="number"
                                    className="w-16 px-3 py-1 border border-slate-200 rounded text-xs text-center"
                                    value={formData.defaultWeight}
                                    onChange={(e) => setFormData(prev => ({ ...prev, defaultWeight: e.target.value }))}
                                />
                                <span className="text-slate-500">公斤内,</span>
                                <input
                                    type="number"
                                    className="w-16 px-3 py-1 border border-slate-200 rounded text-xs text-center"
                                    value={formData.defaultPrice}
                                    onChange={(e) => setFormData(prev => ({ ...prev, defaultPrice: e.target.value }))}
                                />
                                <span className="text-slate-500">元, 每增加</span>
                                <input
                                    type="number"
                                    className="w-16 px-3 py-1 border border-slate-200 rounded text-xs text-center"
                                    value={formData.addWeight}
                                    onChange={(e) => setFormData(prev => ({ ...prev, addWeight: e.target.value }))}
                                />
                                <span className="text-slate-500">公斤, 增加运费</span>
                                <input
                                    type="number"
                                    className="w-16 px-3 py-1 border border-slate-200 rounded text-xs text-center"
                                    value={formData.addPrice}
                                    onChange={(e) => setFormData(prev => ({ ...prev, addPrice: e.target.value }))}
                                />
                                <span className="text-slate-500">元</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                                除指定地区外, 其余地区的运费采用"默认运费"
                            </p>
                        </div>

                        {/* 运送到区域设置 */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700">运送到</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-100">
                                        <tr>
                                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">运送到</th>
                                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">首重(公斤)</th>
                                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">首费(元)</th>
                                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">续重(公斤)</th>
                                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">续费(元)</th>
                                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {formData.regions.map((region, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-3 text-slate-700 font-medium">{region.area}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <input
                                                        type="number"
                                                        className="w-16 px-2 py-1 border border-slate-200 rounded text-xs text-center"
                                                        value={region.firstWeight}
                                                        onChange={(e) => {
                                                            const newRegions = [...formData.regions];
                                                            newRegions[index] = { ...newRegions[index], firstWeight: e.target.value };
                                                            setFormData(prev => ({ ...prev, regions: newRegions }));
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <input
                                                        type="number"
                                                        className="w-16 px-2 py-1 border border-slate-200 rounded text-xs text-center"
                                                        value={region.firstPrice}
                                                        onChange={(e) => {
                                                            const newRegions = [...formData.regions];
                                                            newRegions[index] = { ...newRegions[index], firstPrice: e.target.value };
                                                            setFormData(prev => ({ ...prev, regions: newRegions }));
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <input
                                                        type="number"
                                                        className="w-16 px-2 py-1 border border-slate-200 rounded text-xs text-center"
                                                        value={region.addWeight}
                                                        onChange={(e) => {
                                                            const newRegions = [...formData.regions];
                                                            newRegions[index] = { ...newRegions[index], addWeight: e.target.value };
                                                            setFormData(prev => ({ ...prev, regions: newRegions }));
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <input
                                                        type="number"
                                                        className="w-16 px-2 py-1 border border-slate-200 rounded text-xs text-center"
                                                        value={region.addPrice}
                                                        onChange={(e) => {
                                                            const newRegions = [...formData.regions];
                                                            newRegions[index] = { ...newRegions[index], addPrice: e.target.value };
                                                            setFormData(prev => ({ ...prev, regions: newRegions }));
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-xs font-bold text-rose-500 hover:text-rose-700" onClick={() => handleRegionDelete(index)}>删除</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button className="w-full py-2 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1" onClick={handleRegionAdd}>
                                <Plus size={14} /> +为指定地区设置运费
                            </button>
                        </div>

                        {/* 备注 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">备注:</label>
                            <textarea
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none resize-none"
                                rows={3}
                                placeholder="请输入"
                                value={formData.remark}
                                onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* 弹窗底部按钮 */}
                    <div className="p-6 border-t border-slate-200 flex justify-between items-center">
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors" onClick={handleSave}>保存</button>
                            <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors" onClick={() => setShowModal(false)}>取消</button>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-400">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-3 h-3 rounded" />
                                <span>货运模板正在升级中...</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* 地区选择弹窗 */}
        {showRegionModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold font-heading">选择地区</h3>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => { setShowRegionModal(false); setSelectedRegions([]); }}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <span className="text-xs text-slate-500">已选择 {selectedRegions.length} 个地区</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={selectAll}>全选</button>
                            <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" onClick={clearAll}>清空</button>
                        </div>
                    </div>

                    <div className="p-4 overflow-y-auto max-h-[50vh]">
                        <div className="space-y-4">
                            {Object.entries(groupedRegions).map(([group, regions]) => (
                                <div key={group}>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{group}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {regions.map((region) => (
                                            <label
                                                key={region.name}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all
                                                    ${selectedRegions.includes(region.name) 
                                                        ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' 
                                                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRegions.includes(region.name)}
                                                    onChange={() => toggleRegion(region.name)}
                                                    className="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span>{region.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
                        <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors" onClick={() => { setShowRegionModal(false); setSelectedRegions([]); }}>取消</button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors" onClick={confirmRegions}>确定</button>
                    </div>
                </div>
            </div>
        )}

        {/* 新增地址弹窗 */}
        {showAddressModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold font-heading">新增地址</h3>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => { setShowAddressModal(false); setAddressForm({ name: '', user: '', phone: '', area: '', detail: '' }); }}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* 地址名称 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">
                                <span className="text-rose-500 mr-1">*</span>地址名称:
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                                placeholder="如：上海总仓"
                                value={addressForm.name}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        {/* 联系人 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">
                                <span className="text-rose-500 mr-1">*</span>联系人:
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                                placeholder="请输入联系人姓名"
                                value={addressForm.user}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, user: e.target.value }))}
                            />
                        </div>

                        {/* 联系电话 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">
                                <span className="text-rose-500 mr-1">*</span>联系电话:
                            </label>
                            <input
                                type="tel"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                                placeholder="请输入联系电话"
                                value={addressForm.phone}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>

                        {/* 所在地区 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">
                                <span className="text-rose-500 mr-1">*</span>所在地区:
                            </label>
                            <select
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                                value={addressForm.area}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, area: e.target.value }))}
                            >
                                <option value="">请选择地区</option>
                                <option>上海市 浦东新区</option>
                                <option>广东省 深圳市</option>
                                <option>北京市 朝阳区</option>
                                <option>重庆市 大足区</option>
                                <option>浙江省 杭州市</option>
                                <option>江苏省 南京市</option>
                            </select>
                        </div>

                        {/* 详细地址 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">
                                <span className="text-rose-500 mr-1">*</span>详细地址:
                            </label>
                            <textarea
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none resize-none"
                                rows={3}
                                placeholder="请输入详细地址"
                                value={addressForm.detail}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, detail: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-200 flex justify-end gap-2">
                        <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors" onClick={() => { setShowAddressModal(false); setAddressForm(defaultAddressForm); setEditingAddressIndex(null); }}>取消</button>
                        <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:opacity-90 transition-colors" onClick={handleSaveAddress}>保存</button>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
};

const PlaceholderPage = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <Package size={48} className="mb-4 opacity-20" />
        <h2 className="text-xl font-bold font-heading">{title}功能开发中</h2>
        <p className="text-sm mt-2">敬请期待后续版本发布</p>
    </div>
)

const FinancePage = () => (
    <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center text-slate-400 text-xs font-bold gap-1 uppercase tracking-widest">
            <span className="text-slate-900">收支管理</span>
            <ChevronRight size={14} />
            <span className="text-slate-900">账单明细</span>
        </nav>

        <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all cursor-pointer">
                <Download size={16} /> 导出财务报表
            </button>
        </div>

        {/* Bento Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
                { title: '总收入 (Total Income)', val: '¥2,845,920.00', trend: '+12.5%', color: 'emerald', icon: <TrendingUp size={20}/> },
                { title: '总支出 (Total Expenditure)', val: '¥1,120,450.50', trend: '+4.2%', color: 'rose', icon: <TrendingUp size={20} className="rotate-180"/> },
                { title: '账户结余 (Balance)', val: '¥1,725,469.50', trend: null, color: 'black', highlight: true },
            ].map((s, i) => (
                <div key={i} className={`p-lg rounded-xl flex flex-col justify-between shadow-sm border border-slate-200/60 h-40 pl-5 pt-5
                    ${s.highlight ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white'}`}>
                    <div className="flex justify-between items-start">
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${s.highlight ? 'text-slate-400' : 'text-slate-400'}`}>{s.title}</p>
                        {s.icon && (
                            <div className={`p-2 rounded-lg ${s.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {s.icon}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold font-heading italic">{s.val}</h3>
                        {s.trend && (
                            <p className={`text-xs font-bold ${s.color === 'emerald' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {s.trend} <span className={`${s.highlight ? 'text-slate-500' : 'text-slate-400'} font-normal`}>较上月同期</span>
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </section>

        {/* Filters and List */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
            {/* Filter Tabs */}
            <div className="flex border-b border-slate-100">
                {['所有交易', '仅收入', '仅支出', '退款记录'].map((tab, i) => (
                    <button key={i} className={`px-6 py-4 text-xs font-bold tracking-widest uppercase transition-all
                        ${i === 0 ? 'text-black border-b-2 border-black bg-slate-50/50' : 'text-slate-400 hover:text-black hover:bg-slate-50'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Sub Filters */}
            <div className="p-4 bg-slate-50/30 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 flex gap-4 w-full">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-black outline-none" placeholder="搜索订单、交易或分销商..." />
                    </div>
                    <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-1 focus:ring-black">
                        <option>2023-10-01 至 2023-10-31</option>
                        <option>过去7天</option>
                        <option>过去30天</option>
                    </select>
                    <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-1 focus:ring-black">
                        <option>交易分类</option>
                        <option>全部</option>
                        <option>商品收入</option>
                        <option>分销商入驻</option>
                        <option>商品成本支出</option>
                        <option>快递费支出</option>
                        <option>商品退货收入</option>
                        <option>提现支出</option>
                        <option>提现收入</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">重置筛选</button>
                    <button className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:opacity-90 transition-colors">高级搜索</button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">日期与时间</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">交易类型</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">分类</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">金额</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">单号/详情</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">状态</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 tabular-nums text-sm">
                        {[
                            { date: '2023-10-25 14:20', type: '收入', cat: '订单收入', amount: '+ ¥1,280.00', info: 'ORD-99281304', status: '已入账', color: 'emerald' },
                            { date: '2023-10-25 12:05', type: '支出', cat: '货品成本', amount: '- ¥450.00', info: 'PUR-330491', status: '待对账', color: 'slate' },
                            { date: '2023-10-24 18:30', type: '收入', cat: '分销商升级费用', amount: '+ ¥5,000.00', info: 'DIST-8821 (Level A)', status: '已入账', color: 'emerald' },
                            { date: '2023-10-24 11:15', type: '支出', cat: '服务费', amount: '- ¥29.90', info: 'SVC-PLATFORM-OCT', status: '已扣款', color: 'rose' },
                        ].map((t, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4 text-xs text-slate-500 font-medium">{t.date}</td>
                                <td className="px-6 py-4">
                                    <div className={`flex items-center gap-2 text-xs font-bold ${t.color === 'emerald' ? 'text-emerald-600' : 'text-slate-600'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${t.color === 'emerald' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                        {t.type}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs font-bold text-slate-900">{t.cat}</td>
                                <td className={`px-6 py-4 text-right text-sm font-bold ${t.color === 'emerald' ? 'text-emerald-600' : t.color === 'rose' ? 'text-rose-600' : 'text-slate-900'}`}>{t.amount}</td>
                                <td className="px-6 py-4 text-xs text-slate-400 font-mono">{t.info}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-tighter">
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[10px] font-bold text-slate-300 hover:text-black transition-colors uppercase tracking-widest underline underline-offset-4 decoration-slate-200">详情</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Table Footer */}
            <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    显示 1-10 条，共 245 条数据
                </p>
                <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-white text-slate-400"><ChevronRight className="rotate-180" size={14} /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-black text-white text-xs font-bold rounded">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-white text-xs font-bold text-slate-600">2</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-white text-slate-400"><ChevronRight size={14} /></button>
                </div>
            </div>
        </div>
    </div>
);

interface ShippingTemplate {
    id: string;
    name: string;
    desc: string;
    mode: string;
    area: string;
    date: string;
    status: string;
    active: boolean;
}

interface ProductData {
    name: string;
    desc: string;
    cat: string;
    sku: string;
    price: string;
    stock: number;
    status: string;
    color: string;
}

const AddProductPage = ({ onBack, shippingTemplates, onSaveProduct, editingProduct }: { onBack: () => void; shippingTemplates: ShippingTemplate[]; onSaveProduct: (product: ProductData) => void; editingProduct?: ProductData | null }) => {
    const [images, setImages] = useState<string[]>([]);
    const [showSpecModal, setShowSpecModal] = useState(false);
    const [productName, setProductName] = useState(editingProduct?.name || '');
    const [productDesc, setProductDesc] = useState(editingProduct?.desc || '');
    const [specs, setSpecs] = useState({
        spec1: [{ name: '', price: '', stock: '' }],
        spec2: [{ name: '', price: '', stock: '' }]
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file: File) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        setImages(prev => [...prev, event.target?.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const addSpecRow = (specKey: 'spec1' | 'spec2') => {
        setSpecs(prev => ({
            ...prev,
            [specKey]: [...prev[specKey], { name: '', price: '', stock: '' }]
        }));
    };

    const updateSpecRow = (specKey: 'spec1' | 'spec2', index: number, field: string, value: string) => {
        setSpecs(prev => ({
            ...prev,
            [specKey]: prev[specKey].map((row, i) => 
                i === index ? { ...row, [field]: value } : row
            )
        }));
    };

    const handleSaveSpecs = () => {
        setShowSpecModal(false);
    };

    return (
    <div className="space-y-5 pb-32 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center text-slate-400 text-xs font-bold gap-1 uppercase tracking-widest mb-6">
            <a className="hover:text-slate-900 transition-colors cursor-pointer" onClick={onBack}>商品管理</a>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium">添加商品</span>
        </nav>

        {/* Page Title */}
        <div className="mb-lg">
            <h2 className="text-2xl font-bold font-heading text-slate-900">添加商品</h2>
            <p className="text-sm text-slate-500 mt-1 uppercase tracking-tighter">创建新的书籍分销商品条目</p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl inline-flex mb-8 shadow-sm">
            <button className="px-8 py-2 rounded-lg text-sm font-bold transition-all text-slate-500 hover:text-slate-900">单品</button>
            <button className="px-8 py-2 rounded-lg text-sm font-bold transition-all bg-white text-slate-900 shadow-sm border border-slate-200/50">盲盒</button>
        </div>

        {/* Form Content */}
        <div className="space-y-5">
            {/* Section: Basic Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60">
                <h3 className="text-sm font-bold font-heading border-l-4 border-slate-900 pl-4 mb-8 italic pt-5 pl-5">基本信息</h3>
                <div className="grid grid-cols-12 gap-8 px-5 pb-5">
                    {/* Product Images */}
                    <div className="col-span-12">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">商品图片 (多图)</label>
                        <div className="flex flex-wrap gap-4">
                            <label className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 cursor-pointer transition-all bg-slate-50 group">
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden" 
                                />
                                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all">
                                    <Plus size={24} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest mt-2">上传图片</span>
                            </label>
                            {images.map((img, index) => (
                                <div key={index} className="w-32 h-32 rounded-xl bg-slate-100 overflow-hidden group relative border border-slate-200">
                                    <img className="w-full h-full object-cover" src={img} alt="Product" />
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <button onClick={() => removeImage(index)} className="text-white hover:text-rose-400 transition-colors">
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">建议尺寸: 800x800px, 支持 JPG, PNG, GIF</p>
                    </div>
                    {/* Product Title */}
                    <div className="col-span-12">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">商品分类</label>
                        <div className="relative">
                            <select className="w-full h-12 pl-4 pr-10 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm font-bold bg-slate-50 appearance-none">
                                <option selected value="blind_box">盲盒</option>
                                <option value="single_product">单品</option>
                                <option value="set">套装</option>
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 rotate-90" size={16} />
                        </div>
                    </div>
                    <div className="col-span-12">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">盲盒名称</label>
                        <input 
                            className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm font-bold bg-slate-50"
                            placeholder="请输入盲盒商品全称" 
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Section: Specs & Pricing */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60">
                <div className="flex justify-between items-center mb-8 pt-5 px-5">
                    <h3 className="text-sm font-bold font-heading border-l-4 border-slate-900 pl-4 italic">规格与价格</h3>
                    <button 
                        onClick={() => setShowSpecModal(true)}
                        className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-widest hover:underline underline-offset-4 decoration-2"
                    >
                        <PlusCircle size={14} /> 添加规格
                    </button>
                </div>
                <div className="overflow-hidden border border-slate-100 rounded-xl mx-5 mb-5">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">规格名称</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">销售价格 (¥)</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">当前库存</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 tabular-nums text-sm">
                            {[
                                { name: '1套5本', price: '15.00', stock: '1000' },
                                { name: '2套10本', price: '29.00', stock: '500' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <input className="bg-transparent border-none p-0 focus:ring-0 w-full text-sm font-bold text-slate-900" type="text" defaultValue={row.name} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <input className="bg-transparent border-none p-0 focus:ring-0 w-full text-sm font-bold text-emerald-600" type="text" defaultValue={row.price} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <input className="bg-transparent border-none p-0 focus:ring-0 w-full text-sm font-bold text-slate-600" type="number" defaultValue={row.stock} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-300 hover:text-rose-500 transition-colors">
                                            <X size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-8 grid grid-cols-12 gap-8 px-5 pb-5">
                    <div className="col-span-12 md:col-span-6">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">总库存管理</label>
                        <div className="relative">
                            <input 
                                className="w-full h-12 px-4 border border-slate-200 rounded-xl bg-slate-50 cursor-not-allowed outline-none text-sm font-bold text-slate-400" 
                                disabled 
                                placeholder="1500" 
                                type="number"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">自动汇总规格库存</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section: Shipping & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Shipping */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 col-span-1 md:col-span-2">
                    <h3 className="text-sm font-bold font-heading border-l-4 border-slate-900 pl-4 mb-8 italic pt-5 pl-5">物流配置</h3>
                    <div className="px-5 pb-5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">选择运费模板</label>
                        <div className="flex-1 min-w-[240px] relative">
                            <select className="w-full h-12 pl-4 pr-10 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm font-bold bg-slate-50 appearance-none">
                                {shippingTemplates.map(tpl => (
                                    <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
                                ))}
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 rotate-90" size={16} />
                        </div>
                    </div>
                </div>
                {/* Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 col-span-1 md:col-span-2">
                    <h3 className="text-sm font-bold font-heading border-l-4 border-slate-900 pl-4 mb-8 italic pt-5 pl-5">商品详情</h3>
                    <div className="px-5 pb-5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">详细描述</label>
                            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-slate-50/30">
                                <div className="bg-slate-50 border-b border-slate-100 p-2 flex gap-1">
                                    {[Bold, Italic, List, Image, Link].map((Icon, i) => (
                                        <button key={i} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-slate-900">
                                            <Icon size={16} />
                                        </button>
                                    ))}
                                </div>
                                <textarea 
                                    className="w-full min-h-[200px] p-6 border-none focus:ring-0 outline-none text-sm font-medium text-slate-600 bg-transparent resize-none leading-relaxed" 
                                    placeholder="在这里输入商品详情介绍、盲盒规则等..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        {/* Fixed Footer Actions */}
        <div className="fixed bottom-0 right-0 left-64 bg-white/80 backdrop-blur-xl h-20 px-xl flex items-center justify-end gap-4 border-t border-slate-200/60 z-30">
            <button 
                className="px-8 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-sm" 
                onClick={() => {
                    const newProduct: ProductData = {
                        name: productName || '未命名商品',
                        desc: productDesc || '暂无描述',
                        cat: '未分类',
                        sku: `SKU-${Date.now()}`,
                        price: '¥ 0.00',
                        stock: 0,
                        status: '草稿',
                        color: 'slate'
                    };
                    onSaveProduct(newProduct);
                    onBack();
                }}
            >保存草稿</button>
            <button className="px-8 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-slate-900/10">
                确认发布
            </button>
        </div>

        {/* 规格弹窗 */}
        {showSpecModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto shadow-2xl">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">添加规格</h3>
                    
                    {/* 规格1 */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-bold text-slate-700">规格1</h4>
                            <button 
                                onClick={() => addSpecRow('spec1')}
                                className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                            >
                                <Plus size={14} /> 添加
                            </button>
                        </div>
                        <div className="space-y-3">
                            {specs.spec1.map((row, index) => (
                                <div key={index} className="flex gap-3 items-center">
                                    <input
                                        type="text"
                                        placeholder="规格名称"
                                        value={row.name}
                                        onChange={(e) => updateSpecRow('spec1', index, 'name', e.target.value)}
                                        className="flex-1 h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    />
                                    <input
                                        type="number"
                                        placeholder="价格"
                                        value={row.price}
                                        onChange={(e) => updateSpecRow('spec1', index, 'price', e.target.value)}
                                        className="w-24 h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    />
                                    <input
                                        type="number"
                                        placeholder="库存"
                                        value={row.stock}
                                        onChange={(e) => updateSpecRow('spec1', index, 'stock', e.target.value)}
                                        className="w-24 h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 规格2 */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-bold text-slate-700">规格2</h4>
                            <button 
                                onClick={() => addSpecRow('spec2')}
                                className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                            >
                                <Plus size={14} /> 添加
                            </button>
                        </div>
                        <div className="space-y-3">
                            {specs.spec2.map((row, index) => (
                                <div key={index} className="flex gap-3 items-center">
                                    <input
                                        type="text"
                                        placeholder="规格名称"
                                        value={row.name}
                                        onChange={(e) => updateSpecRow('spec2', index, 'name', e.target.value)}
                                        className="flex-1 h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    />
                                    <input
                                        type="number"
                                        placeholder="价格"
                                        value={row.price}
                                        onChange={(e) => updateSpecRow('spec2', index, 'price', e.target.value)}
                                        className="w-24 h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    />
                                    <input
                                        type="number"
                                        placeholder="库存"
                                        value={row.stock}
                                        onChange={(e) => updateSpecRow('spec2', index, 'stock', e.target.value)}
                                        className="w-24 h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            onClick={() => setShowSpecModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            取消
                        </button>
                        <button 
                            onClick={handleSaveSpecs}
                            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:opacity-90 transition-colors"
                        >
                            保存
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

const RoleUsersPage = ({ roleTitle, onBack }: { roleTitle: string; onBack: () => void }) => {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', wechat: '', role: roleTitle });
  const [selectedRoleFilter, setSelectedRoleFilter] = useState(roleTitle || '全部');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleAddUser = () => {
    // 这里可以添加保存用户的逻辑
    setIsAddUserModalOpen(false);
    setNewUser({ name: '', wechat: '', role: roleTitle });
  };

  const allUsers = [
    { id: 'USR-20240101-001', name: '管理员-艾伦', role: '平台管理员', date: '2024-01-01 10:00' },
    { id: 'USR-20240215-024', name: '运营-贝尔', role: '分销商', date: '2024-02-15 14:30' },
    { id: 'USR-20240310-098', name: '财务-查理', role: '平台管理员', date: '2024-03-10 09:15' },
    { id: 'USR-20240405-156', name: '客服-戴安娜', role: '普通会员', date: '2024-04-05 16:45' },
    { id: 'USR-20240501-201', name: '技术-艾德', role: '分销商', date: '2024-05-01 11:20' },
    { id: 'USR-20240615-258', name: '销售-弗兰克', role: '分销商', date: '2024-06-15 08:30' },
    { id: 'USR-20240720-312', name: '市场-格雷', role: '平台管理员', date: '2024-07-20 13:00' },
    { id: 'USR-20240808-367', name: '用户-海伦', role: '普通会员', date: '2024-08-08 17:20' },
  ];

  const filteredUsers = allUsers.filter(usr => {
    const roleMatch = selectedRoleFilter === '全部' || usr.role === selectedRoleFilter;
    const userDate = usr.date.split(' ')[0];
    const startMatch = !startDate || userDate >= startDate;
    const endMatch = !endDate || userDate <= endDate;
    return roleMatch && startMatch && endMatch;
  });

  return (
    <div className="space-y-5">
      <nav className="flex items-center text-slate-400 text-xs font-bold gap-1 uppercase tracking-widest mb-4 hover:cursor-pointer" onClick={onBack}>
        <span>权限管理</span>
        <ChevronRight size={14} />
        <span className="text-slate-900">用户列表</span>
      </nav>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">角色筛选:</span>
            <select 
              className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-1 focus:ring-black"
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
            >
              <option value="全部">全部</option>
              <option value="平台管理员">平台管理员</option>
              <option value="分销商">分销商</option>
              <option value="普通会员">普通会员</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">日期范围:</span>
            <input
              type="date"
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-1 focus:ring-black"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-slate-400">至</span>
            <input
              type="date"
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-1 focus:ring-black"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <button 
          className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
          onClick={() => setIsAddUserModalOpen(true)}
        >
          <UserPlus size={18} /> 手动添加用户
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-nowrap">用户ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">用户名</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">角色</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">注册时间</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 tabular-nums text-sm">
              {filteredUsers.map((usr, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-xs text-slate-400 font-mono">{usr.id}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-900">{usr.name}</td>
                  <td className="px-6 py-4 text-xs">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      usr.role === '平台管理员' ? 'bg-emerald-100 text-emerald-700' :
                      usr.role === '分销商' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {usr.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-[10px] font-bold text-slate-400">{usr.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="text-[10px] font-bold text-slate-300 hover:text-black transition-colors uppercase tracking-widest">编辑</button>
                      <button className="text-[10px] font-bold text-rose-300 hover:text-rose-600 transition-colors uppercase tracking-widest">移除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              显示 1-5 共 28 名用户
            </p>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-white text-slate-400"><ChevronRight className="rotate-180" size={14} /></button>
              <button className="w-8 h-8 flex items-center justify-center bg-black text-white text-xs font-bold rounded">1</button>
              <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-white text-xs font-bold text-slate-600">2</button>
              <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-white text-slate-400"><ChevronRight size={14} /></button>
            </div>
        </div>
      </div>

      {/* 添加用户弹窗 */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold font-heading">添加用户</h3>
              <button 
                className="p-1 text-slate-400 hover:text-black transition-colors"
                onClick={() => setIsAddUserModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">用户名</label>
                <input 
                  type="text" 
                  className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm font-bold"
                  placeholder="请输入用户名"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">微信号</label>
                <input 
                  type="text" 
                  className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm font-bold"
                  placeholder="请输入微信号"
                  value={newUser.wechat}
                  onChange={(e) => setNewUser({ ...newUser, wechat: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">角色</label>
                <select 
                  className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm font-bold bg-white appearance-none"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="平台管理员">平台管理员</option>
                  <option value="分销商">分销商</option>
                  <option value="普通会员">普通会员</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button 
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                onClick={() => setIsAddUserModalOpen(false)}
              >
                取消
              </button>
              <button 
                className="flex-1 px-4 py-3 bg-black text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
                onClick={handleAddUser}
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DistributorDetailPage = ({ distributorId, onBack }: { distributorId: string; onBack: () => void }) => (
    <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center text-slate-400 text-xs font-bold gap-1 uppercase tracking-widest mb-6">
            <a className="hover:text-slate-900 transition-colors cursor-pointer" onClick={onBack}>分销商管理</a>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium">分销商详情</span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 border border-slate-300/30 shadow-sm">
                    <User size={32} />
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold font-heading text-slate-900">张伟 (Zhang Wei)</h2>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-widest ring-1 ring-emerald-500/20">已启用</span>
                    </div>
                    <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-tighter">ID: {distributorId}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">结算周期:</p>
                        <p className="text-xs text-slate-900 font-bold">周结</p>
                    </div>
                </div>
                <div className="flex flex-col gap-1 ml-8 pl-8 border-l border-slate-200 hidden sm:flex">
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">当前等级:</p>
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck size={16} className="text-amber-500" />
                            <p className="text-sm text-slate-900 font-bold">高级分销商</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5 mt-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">升级路径:</p>
                        <div className="flex items-center gap-3">
                            <p className="text-[10px] text-slate-500">• 累计销售额满 <span className="text-slate-900 font-bold">¥5,000</span></p>
                            <p className="text-[10px] text-slate-500">• 或支付 <span className="text-slate-900 font-bold">¥199</span> 直接升级</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 items-center">
                <div className="relative flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors group">
                    <Clock size={18} className="text-slate-400 group-hover:text-slate-600" />
                    <span className="text-xs font-bold text-slate-700">最近30天</span>
                    <ChevronRight size={14} className="rotate-90 text-slate-300" />
                </div>
                <button className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2 text-xs uppercase tracking-widest shadow-sm">
                    <Megaphone size={16} /> 微信联系
                </button>
                <button className="px-4 py-2 bg-black text-white font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-2 text-xs uppercase tracking-widest shadow-sm">
                    <Settings size={16} /> 编辑资料
                </button>
            </div>
        </div>

        {/* Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* KPI 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
                <div className="relative z-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">总销售额</p>
                    <h4 className="text-3xl font-bold font-heading text-slate-900 italic">¥124,850.00</h4>
                    <div className="mt-4 flex items-center text-emerald-600 gap-1">
                        <TrendingUp size={14} />
                        <span className="text-xs font-bold">+12.5%</span>
                        <span className="text-xs text-slate-400 font-medium ml-1">较上月</span>
                    </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                    <Wallet size={120} />
                </div>
            </div>
            {/* KPI 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
                <div className="relative z-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">总收益</p>
                    <h4 className="text-3xl font-bold font-heading text-slate-900 italic">¥18,727.50</h4>
                    <div className="mt-4 flex items-center text-emerald-600 gap-1">
                        <TrendingUp size={14} />
                        <span className="text-xs font-bold">+8.2%</span>
                        <span className="text-xs text-slate-400 font-medium ml-1">较上月</span>
                    </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                    <Wallet size={120} />
                </div>
            </div>
            {/* KPI 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
                <div className="relative z-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">待结算佣金</p>
                    <h4 className="text-3xl font-bold font-heading text-slate-900 italic">¥3,120.45</h4>
                    <button className="mt-4 text-black text-xs font-black flex items-center gap-1 hover:underline underline-offset-4 decoration-black uppercase tracking-widest">
                        立即结算
                        <ChevronRight size={14} />
                    </button>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                    <History size={120} />
                </div>
            </div>
        </div>

        {/* Order List Table */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h3 className="font-heading font-bold text-slate-900 flex items-center gap-2">
                    <ClipboardList size={18} />
                    最近订单
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">订单编号</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">产品名称</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">佣金金额</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">结算状态</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">日期</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 tabular-nums text-sm">
                        {[
                            { id: '#ORD-2023-1024', name: '智能空气净化器 Pro Max', earned: '¥149.85', status: '已结算', color: 'emerald', date: '2023-11-24 14:20' },
                            { id: '#ORD-2023-1023', name: '无线降噪耳机 (极夜黑)', earned: '¥89.90', status: '待结算', color: 'amber', date: '2023-11-24 11:05' },
                            { id: '#ORD-2023-1019', name: '人体工学办公椅 S3', earned: '¥255.00', status: '已结算', color: 'emerald', date: '2023-11-23 09:45' },
                            { id: '#ORD-2023-1012', name: '智能手环 Series 8', earned: '¥34.50', status: '已关闭', color: 'slate', date: '2023-11-22 16:30' },
                            { id: '#ORD-2023-1008', name: '4K超清投影仪 X1', earned: '¥320.00', status: '已结算', color: 'emerald', date: '2023-11-21 15:45' },
                            { id: '#ORD-2023-1005', name: '机械键盘 (青轴)', earned: '¥58.20', status: '待结算', color: 'amber', date: '2023-11-20 10:30' },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4 text-xs text-slate-400 font-mono italic">{row.id}</td>
                                <td className="px-6 py-4 text-xs font-bold text-slate-900">{row.name}</td>
                                <td className="px-6 py-4 text-right text-xs font-bold text-emerald-600">{row.earned}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest
                                        ${row.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : row.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <div className={`w-1 h-1 rounded-full mr-1.5 ${row.color === 'emerald' ? 'bg-emerald-400' : row.color === 'amber' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-[10px] font-bold text-slate-400">{row.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    显示第 1 到 6 条，共 1,248 条记录
                </p>
                <div className="flex gap-1.5">
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors">
                        <ChevronRight className="rotate-180" size={14} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded bg-black text-white font-bold text-xs">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors">
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const PermissionsPage = ({ onSelectRole }: { onSelectRole: (title: string) => void }) => {
    const [permissions, setPermissions] = useState([
        { name: '数据统计', type: 'parent' as const, admin: true, distro: true, member: false },
        { name: '  - 首页仪表盘', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '  - 销售趋势分析', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '  - 热销排行榜', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '订单管理', type: 'parent' as const, admin: true, distro: true, member: false },
        { name: '  - 订单列表', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '  - 订单详情', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '  - 订单统计', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '门店会员', type: 'parent' as const, admin: true, distro: false, member: false },
        { name: '  - 会员列表', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '  - 会员等级', type: 'child' as const, admin: true, distro: false, member: false },
        { name: '  - 会员积分', type: 'child' as const, admin: true, distro: false, member: false },
        { name: '物流设置', type: 'parent' as const, admin: true, distro: false, member: false },
        { name: '  - 运费模板', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '  - 配送区域', type: 'child' as const, admin: true, distro: false, member: false },
        { name: '  - 物流查询', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '收支管理', type: 'parent' as const, admin: true, distro: false, member: false },
        { name: '  - 账单明细', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '  - 结算管理', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '  - 财务报表', type: 'child' as const, admin: true, distro: false, member: false },
        { name: '商品管理', type: 'parent' as const, admin: true, distro: true, member: false },
        { name: '  - 商品列表', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '  - 添加商品', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '  - 商品分类', type: 'child' as const, admin: true, distro: false, member: false },
        { name: '分销商管理', type: 'parent' as const, admin: true, distro: true, member: false },
        { name: '  - 分销商列表', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '  - 分销商详情', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '  - 分销等级', type: 'child' as const, admin: true, distro: false, member: false },
        { name: '营销设置', type: 'parent' as const, admin: true, distro: false, member: false },
        { name: '  - 注册有奖', type: 'child' as const, admin: true, distro: false, member: false },
        { name: '  - 邀请有奖', type: 'child' as const, admin: true, distro: true, member: false },
        { name: '  - 优惠券管理', type: 'child' as const, admin: true, distro: false, member: false },
        { name: '权限管理', type: 'parent' as const, admin: true, distro: false, member: false },
        { name: '  - 角色管理', type: 'child' as const, admin: true, distro: false, member: false },
        { name: '  - 用户管理', type: 'child' as const, admin: true, distro: false, member: false },
        { name: '  - 权限分配', type: 'child' as const, admin: true, distro: false, member: false },
    ]);

    const handlePermissionChange = (index: number, column: 'admin' | 'distro' | 'member', checked: boolean) => {
        setPermissions(prev => {
            const newPermissions = [...prev];
            newPermissions[index] = {
                ...newPermissions[index],
                [column]: checked
            };
            return newPermissions;
        });
    };

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-end">
                <nav className="flex items-center text-slate-400 text-xs font-bold gap-1 uppercase tracking-widest">
                    <span>设置</span>
                    <ChevronRight size={14} />
                    <span className="text-slate-900">权限管理</span>
                </nav>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">
                    <Plus size={18} /> 创建新角色
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                    { title: '平台管理员', badge: '超级管理员', desc: '拥有系统全量模块的操作与配置权限，负责全局运营与分销规则制定。', count: '12个账号', perm: '全量权限', color: 'emerald' },
                    { title: '分销商', badge: '核心合作', desc: '主要负责所辖区域的订单处理、会员管理及下属渠道的结算统计。', count: '450个账号', perm: '自定义权限', color: 'blue' },
                    { title: '普通会员', badge: '基础权限', desc: '仅限浏览商品、个人订单查询及基础账户设置，无管理职能。', count: '12.5k个账号', perm: '受限权限', color: 'slate' },
                ].map((role, i) => (
                    <div 
                        key={i} 
                        className="bg-white p-lg rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md hover:border-black transition-all group cursor-pointer pl-5 pr-5"
                        onClick={() => onSelectRole(role.title)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-widest">{role.badge}</span>
                            <button className="p-1 text-slate-300 hover:text-black transition-colors" onClick={(e) => e.stopPropagation()}><Pencil size={16} /></button>
                        </div>
                        <h3 className="text-lg font-bold font-heading text-slate-900 mb-2">{role.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed min-h-[48px]">{role.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="pl-5 pr-5 border-b border-slate-100 h-10 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold font-heading">权限分配</h3>
                    </div>
                    <button className="text-sm font-bold text-slate-600 hover:text-black transition-colors">设置</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">功能模块</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">平台管理员</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">分销商</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">普通会员</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 tabular-nums text-sm">
                            {permissions.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className={`px-6 py-4 font-bold ${row.type === 'child' ? 'text-xs text-[#666666]' : 'text-lg text-slate-900'}`}>{row.name}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <input 
                                                type="checkbox" 
                                                checked={row.admin}
                                                onChange={(e) => handlePermissionChange(i, 'admin', e.target.checked)}
                                                className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <input 
                                                type="checkbox" 
                                                checked={row.distro}
                                                onChange={(e) => handlePermissionChange(i, 'distro', e.target.checked)}
                                                className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <input 
                                                type="checkbox" 
                                                checked={row.member}
                                                onChange={(e) => handlePermissionChange(i, 'member', e.target.checked)}
                                                className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ProductsPage = ({ onAddProduct, products, setProducts, onEditProduct }: { onAddProduct: () => void; products: { name: string; desc: string; cat: string; sku: string; price: string; stock: number; status: string; color: string }[]; setProducts: React.Dispatch<React.SetStateAction<{ name: string; desc: string; cat: string; sku: string; price: string; stock: number; status: string; color: string }[]>>; onEditProduct: (product: { name: string; desc: string; cat: string; sku: string; price: string; stock: number; status: string; color: string }) => void }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'shelve' | 'publish' | 'delete'>('delete');
    const [confirmProduct, setConfirmProduct] = useState<string>('');

    const handleAction = (action: 'shelve' | 'publish' | 'delete', productName: string) => {
        setConfirmAction(action);
        setConfirmProduct(productName);
        setShowConfirmModal(true);
    };

    const confirmActionText = {
        shelve: '下架',
        publish: '发布',
        delete: '删除'
    };

    const handleConfirm = () => {
        if (confirmAction === 'shelve') {
            setProducts(prev => prev.map(p => 
                p.name === confirmProduct 
                    ? { ...p, status: '草稿', color: 'slate' }
                    : p
            ));
        } else if (confirmAction === 'publish') {
            setProducts(prev => prev.map(p => 
                p.name === confirmProduct 
                    ? { ...p, status: '已上架', color: 'emerald' }
                    : p
            ));
        } else if (confirmAction === 'delete') {
            setProducts(prev => prev.filter(p => p.name !== confirmProduct));
        }
        setShowConfirmModal(false);
        setConfirmProduct('');
    };

    return (
        <div className="space-y-5">
        {/* Breadcrumb & Header Actions */}
        <div className="flex justify-between items-end">
            <nav className="flex items-center text-slate-400 text-xs font-bold gap-1 uppercase tracking-widest">
                <span>商品管理</span>
                <ChevronRight size={14} />
                <span className="text-slate-900">商品列表</span>
            </nav>
            <button 
                onClick={onAddProduct}
                className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
                <Plus size={18} /> 添加商品
            </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">搜索商品</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black" placeholder="商品名称 / SKU" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">商品分类</label>
                    <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black font-medium">
                        <option>全部分类</option>
                        <option>儿童绘本</option>
                        <option>亲子阅读</option>
                        <option>幼儿启蒙</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">库存状态</label>
                    <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black font-medium">
                        <option>全部状态</option>
                        <option>有货</option>
                        <option>缺货</option>
                        <option>已下架</option>
                        <option>草稿</option>
                    </select>
                </div>
                <div className="flex items-end gap-3">
                    <button className="flex-1 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-all">查询</button>
                    <button className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all">重置</button>
                </div>
            </div>
        </div>

        {/* Data Table Card */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 w-12 text-center">
                                <input type="checkbox" className="rounded border-slate-300 text-black focus:ring-black w-4 h-4 cursor-pointer" />
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">商品详情</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">分类</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">规格编码 (SKU)</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">售价</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">库存</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">状态</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 tabular-nums text-sm">
                        {products.map((p, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="p-4 text-center">
                                    <input type="checkbox" className="rounded border-slate-300 text-black focus:ring-black w-4 h-4 cursor-pointer" />
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center p-2 text-center text-[8px] font-bold text-slate-400 leading-tight">
                                            {p.name.substring(0, 4)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{p.name}</p>
                                            <p className="text-xs text-slate-400 truncate max-w-[200px]">{p.desc}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-500 font-medium">{p.cat}</td>
                                <td className="p-4 text-sm text-slate-400 font-mono">{p.sku}</td>
                                <td className="p-4 text-sm font-bold text-slate-900">{p.price}</td>
                                <td className={`p-4 text-sm font-bold ${p.stock === 0 ? 'text-rose-500' : 'text-slate-700'}`}>{p.stock}</td>
                                <td className="p-4">
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ring-1 ring-inset
                                        ${p.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 
                                          p.color === 'rose' ? 'bg-rose-50 text-rose-700 ring-rose-600/20' :
                                          'bg-slate-100 text-slate-600 ring-slate-400/20'}`}
                                    >
                                        {p.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end items-center gap-3">
                                        <button 
                                            onClick={() => handleAction(p.status === '已上架' || p.status === '缺货' ? 'shelve' : 'publish', p.name)}
                                            className={`text-xs font-bold px-2 py-1 rounded transition-colors
                                                ${p.status === '已上架' || p.status === '缺货' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                        >
                                            {p.status === '已上架' || p.status === '缺货' ? '下架' : '发布'}
                                        </button>
                                        <button onClick={() => onEditProduct(p)} className="text-xs font-bold text-slate-400 hover:text-black transition-colors">编辑</button>
                                        <button onClick={() => handleAction('delete', p.name)} className="text-xs font-bold text-rose-400 hover:text-rose-600 transition-colors">删除</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="p-6 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 border-t border-slate-100 gap-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    共 156 个商品，显示第 1-10 个
                </p>
                <div className="flex items-center gap-2 font-mono">
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-white transition-colors disabled:opacity-50" disabled>
                        <ChevronRight className="rotate-180" size={14} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded bg-black text-white text-xs font-bold">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 text-xs font-bold hover:bg-white transition-colors">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 text-xs font-bold hover:bg-white transition-colors">3</button>
                    <span className="px-2 text-slate-300">...</span>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 text-xs font-bold hover:bg-white transition-colors">16</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-white transition-colors">
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[320px] shadow-2xl">
                        <div className="text-center">
                            <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center
                                ${confirmAction === 'delete' ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-500'}`}
                            >
                                {confirmAction === 'delete' ? <Trash2 size={24} /> : <AlertCircle size={24} />}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">确认{confirmActionText[confirmAction]}</h3>
                            <p className="text-sm text-slate-500 mb-6">确定要{confirmActionText[confirmAction]}商品「{confirmProduct}」吗？</p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    取消
                                </button>
                                <button 
                                    onClick={handleConfirm}
                                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors
                                        ${confirmAction === 'delete' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-amber-500 hover:bg-amber-600'}`}
                                >
                                    确定{confirmActionText[confirmAction]}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
    );
};

const DistributorsPage = ({ onSelectDistributor }: { onSelectDistributor: (id: string) => void }) => (
    <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center text-slate-400 text-xs font-bold gap-1 uppercase tracking-widest">
            <span className="text-slate-900">分销商管理</span>
            <ChevronRight size={14} />
            <span className="text-slate-900">分销商列表</span>
        </nav>

        <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all">
                <Plus size={18} /> 添加分销商
            </button>
        </div>

        {/* 核心指标统计 - 7列布局 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
                { label: '活跃分销商', val: '1,102', icon: <Users size={14}/> },
                { label: '总销售额', val: '¥842k', icon: <TrendingUp size={14}/> },
                { label: '总收益', val: '¥126k', icon: <ShoppingCart size={14}/> },
                { label: '待结算', val: '¥42k', icon: <Wallet size={14}/> },
                { label: '高级入驻', val: '¥12,800', badge: 'VIP' },
                { label: '中级入驻', val: '¥5,400', badge: 'MID' },
                { label: '新增数', val: '85', icon: <Plus size={14}/> },
            ].map((s, i) => (
                <div key={i} className="bg-white border border-slate-200/60 p-3 rounded-xl shadow-sm flex flex-col justify-between group hover:border-black transition-colors pl-5 pt-5">
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{s.label}</p>
                        {s.badge && <span className="text-[8px] bg-slate-100 px-1 rounded text-slate-400 font-bold">{s.badge}</span>}
                    </div>
                    <div className="mt-2">
                        <span className="text-lg font-bold tabular-nums italic font-heading">{s.val}</span>
                    </div>
                </div>
            ))}
        </div>

        {/* 筛选与列表 */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                   <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">状态</span>
                      <select className="bg-slate-50 border-none rounded-lg px-2 py-1 text-xs font-bold text-slate-600 focus:ring-1 focus:ring-black">
                         <option>全部</option>
                         <option>正常启用</option>
                         <option>待审核</option>
                         <option>已禁用</option>
                      </select>
                   </div>
                   <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">等级</span>
                      <select className="bg-slate-50 border-none rounded-lg px-2 py-1 text-xs font-bold text-slate-600 focus:ring-1 focus:ring-black">
                         <option>全部</option>
                         <option>高级代理</option>
                         <option>中级代理</option>
                         <option>初级代理</option>
                      </select>
                   </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                   <div className="relative flex-1">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black" placeholder="搜索 ID/姓名..." />
                   </div>
                   <button className="p-2 text-slate-400 hover:text-black hover:bg-slate-50 rounded-lg transition-colors"><Filter size={16}/></button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">分销商</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">等级</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">销售额 (¥)</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">佣金率</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">已获佣金</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">结算周期</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">状态</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 tabular-nums text-sm">
                        {[
                            { name: 'Julianne Smith', id: 'DIST-9021', lvl: '高级', sales: '12,450.00', rate: '15%', earned: '1,867.50', cycle: '周结', color: 'orange' },
                            { name: 'Marcus King', id: 'DIST-8842', lvl: '中级', sales: '8,920.00', rate: '10%', earned: '892.00', cycle: '月结', color: 'blue' },
                            { name: 'Lee Yan', id: 'DIST-9045', lvl: '高级', sales: '15,600.00', rate: '15%', earned: '2,340.00', cycle: '周结', color: 'orange' },
                            { name: 'Sarah Wu', id: 'DIST-7713', lvl: '初级', sales: '2,100.00', rate: '5%', earned: '105.00', cycle: '实时', color: 'slate' },
                        ].map((d, i) => (
                            <tr 
                                key={i} 
                                className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                onClick={() => onSelectDistributor(d.id)}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                                            <User size={14} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 leading-none">{d.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">{d.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.color === 'orange' ? 'bg-orange-50 text-orange-600' : d.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                                        {d.lvl}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">{d.sales}</td>
                                <td className="px-6 py-4 text-right font-medium text-slate-500">{d.rate}</td>
                                <td className="px-6 py-4 text-right font-bold text-emerald-600">{d.earned}</td>
                                <td className="px-6 py-4 text-slate-600 text-xs">{d.cycle}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-1 hover:bg-slate-100 rounded text-slate-400 group-hover:text-black transition-colors" onClick={(e) => { e.stopPropagation(); onSelectDistributor(d.id); }}>
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const MarketingPage = () => (
    <div className="space-y-5 text-slate-900 pb-5">
        <div className="flex justify-between items-end">
            <nav className="flex items-center text-slate-400 text-xs font-bold gap-1 uppercase tracking-widest">
                <span>营销活动管理</span>
                <ChevronRight size={14} />
                <span className="text-slate-900">活动设置</span>
            </nav>
            <div className="flex gap-2">
                <button className="px-6 py-2 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all">取消</button>
                <button className="px-6 py-2 bg-black text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg">保存设置</button>
            </div>
        </div>

        {/* 1. 注册有奖设置 */}
        <section className="bg-white rounded-2xl p-lg border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 pl-5">
                <h3 className="text-lg font-bold font-heading">注册有奖设置</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 items-end pl-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">奖励类型</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium focus:ring-1 focus:ring-black outline-none transition-all">
                        <option>积分奖励</option>
                        <option>优惠券奖励</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">奖励金额/分值</label>
                    <div className="relative">
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 pr-12 text-sm font-medium focus:ring-1 focus:ring-black outline-none" placeholder="输入数值" type="number" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold uppercase">单位</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">有效期 (天)</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium focus:ring-1 focus:ring-black outline-none transition-all">
                        <option selected>30天</option>
                        <option>90天</option>
                        <option>365天</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">使用门槛 (满可用)</label>
                    <div className="relative">
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 pr-8 text-sm font-medium focus:ring-1 focus:ring-black outline-none" placeholder="0" type="number" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">元</span>
                    </div>
                </div>
                <div className="flex items-center justify-end">
                    <button className="w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition-all text-slate-900">
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            <div className="pt-4 pl-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">优惠券奖励列表</h4>
                <div className="overflow-hidden border border-slate-100 rounded-xl mb-5">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">序号</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">奖励</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">要求</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 tabular-nums text-sm">
                            {[
                                { id: 'zcyj001', reward: '2元代金券', requirement: '满15元可用', active: true },
                                { id: 'zcyj002', reward: '5元代金券', requirement: '满30元可用', active: false },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3 text-xs text-slate-400">{i + 1}</td>
                                    <td className="px-4 py-3 text-xs font-mono text-slate-400">{row.id}</td>
                                    <td className="px-4 py-3 text-xs font-bold text-slate-900">{row.reward}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{row.requirement}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            <button className={`${row.active ? 'text-emerald-500' : 'text-slate-300'} transition-colors`}>
                                                {row.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                            </button>
                                            <button className="text-xs font-bold text-rose-400 hover:text-rose-600 transition-colors uppercase">删除</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        {/* 2. 邀请有奖设置 */}
        <section className="bg-white rounded-2xl p-lg border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 pl-5">
                <h3 className="text-lg font-bold font-heading">邀请有奖设置</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 items-end pl-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">奖励类型</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium focus:ring-1 focus:ring-black outline-none transition-all">
                        <option>积分奖励</option>
                        <option>优惠券奖励</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">奖励金额/分值</label>
                    <div className="relative">
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 pr-12 text-sm font-medium focus:ring-1 focus:ring-black outline-none" placeholder="输入数值" type="number" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">单位</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">有效期 (天)</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium focus:ring-1 focus:ring-black outline-none transition-all">
                        <option selected>30天</option>
                        <option>365天</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">使用门槛 (满可用)</label>
                    <div className="relative">
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 pr-8 text-sm font-medium focus:ring-1 focus:ring-black outline-none" placeholder="0" type="number" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">元</span>
                    </div>
                </div>
                <div className="flex items-center justify-end">
                    <button className="w-10 h-10 flex items-center justify-center bg-indigo-50 border border-indigo-100 rounded-full hover:bg-indigo-100 transition-all text-indigo-600">
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* 分销商晋升规则 */}
            <div className="mt-8 pt-8 border-t border-slate-100 pl-5 mb-5">
                <h4 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 italic">
                    <TrendingUp size={16} className="text-emerald-500" />
                    分销商晋升活动规则
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 group hover:border-black transition-all">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">中级分销商晋升</label>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <input className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-1 focus:ring-black outline-none" placeholder="邀请人数" type="number" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">人</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300" />
                            <div className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 shadow-sm">
                                获得中级分销权限
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 group hover:border-black transition-all">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">高级分销商晋升</label>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <input className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-1 focus:ring-black outline-none" placeholder="邀请人数" type="number" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">人</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300" />
                            <div className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 shadow-sm">
                                获得高级分销权限
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 3. 优惠券设置 */}
        <section className="bg-white rounded-2xl p-lg border border-slate-200/60 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 pl-5 pr-5">
                <h3 className="text-lg font-bold font-heading">优惠券活动设置</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all">
                    <Plus size={16} /> 新增优惠券
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-5">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">优惠券名称</label>
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-1 focus:ring-black outline-none" placeholder="例如：年中大促专享券" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">面值 (¥)</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-1 focus:ring-black outline-none" placeholder="50" type="number" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">最低消费 (¥)</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-1 focus:ring-black outline-none" placeholder="500" type="number" />
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">总发行量</label>
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-1 focus:ring-black outline-none" placeholder="1000" type="number" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">失效日期</label>
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-1 focus:ring-black outline-none" type="date" />
                    </div>
                </div>
            </div>

            <div className="pt-4 pl-5">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">优惠券列表</h4>
                    <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">共 4 条记录</span>
                </div>
                <div className="overflow-x-auto border border-slate-100 rounded-xl mb-5">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">优惠券名称</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">面值</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">门槛</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">发行</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">失效日期</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 tabular-nums text-sm">
                            {[
                                { id: 'CPN-202401', name: '开年采购津贴', value: '¥100.00', min: '¥1,000.00', total: 500, date: '2024-03-31', active: true },
                                { id: 'CPN-202312', name: '年终回馈大礼包', value: '¥200.00', min: '¥2,000.00', total: 200, date: '2023-12-31', active: false },
                            ].map((cpn, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3 text-xs font-mono text-slate-400">{cpn.id}</td>
                                    <td className="px-4 py-3 text-xs font-bold text-slate-900">{cpn.name}</td>
                                    <td className="px-4 py-3 text-xs font-bold text-emerald-600">{cpn.value}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{cpn.min}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500 text-center">{cpn.total}</td>
                                    <td className="px-4 py-3 text-xs text-slate-400">{cpn.date}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            <button className={`${cpn.active ? 'text-emerald-500' : 'text-slate-300'} transition-colors`}>
                                                {cpn.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                            </button>
                                            <button className="text-xs font-bold text-rose-400 hover:text-rose-600 transition-colors uppercase">删除</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        {/* 4. 历史活动记录 */}
        <section className="bg-white rounded-2xl p-lg border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 pl-5">
                <h3 className="text-lg font-bold font-heading text-slate-400">历史活动记录</h3>
            </div>
            
            <div className="overflow-x-auto border border-slate-100 rounded-xl mb-5">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">活动编号</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">活动名称</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">类型</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">时间</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">状态</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 tabular-nums text-sm">
                        {[
                            { id: 'ACT-0082', name: '双11采购节', type: '全场满减', time: '2023-11-01 14:22', status: '已结束' },
                            { id: 'ACT-0075', name: '秋季上新促销', type: '多倍积分', time: '2023-09-15 11:05', status: '已结束' },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 text-xs font-mono text-slate-400">{row.id}</td>
                                <td className="px-4 py-3 text-xs font-bold text-slate-600">{row.name}</td>
                                <td className="px-4 py-3 text-xs text-slate-500">{row.type}</td>
                                <td className="px-4 py-3 text-[10px] text-slate-400">{row.time}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400 uppercase tracking-tighter">{row.status}</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-xs font-bold text-slate-300 hover:text-black transition-colors uppercase underline underline-offset-4 decoration-slate-200">详情</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </div>
);

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState<PageView>(() => {
    const saved = localStorage.getItem('activeTab');
    return (saved as PageView) || 'stats';
  });
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedDistributorId, setSelectedDistributorId] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<{ name: string; desc: string; cat: string; sku: string; price: string; stock: number; status: string; color: string } | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const [products, setProducts] = useState([
    { name: '儿童绘本5本盲盒套餐', desc: '经典绘本，传递最纯真的爱', cat: '儿童绘本', sku: 'SKU-KID-001', price: '¥ 35.80', stock: 852, status: '已上架', color: 'emerald' },
    { name: '月亮的味道', desc: '关于分享与合作的趣味童话', cat: '儿童绘本', sku: 'SKU-KID-005', price: '¥ 32.00', stock: 0, status: '缺货', color: 'rose' },
    { name: '逃家小兔', desc: '温情满满的母爱绘本经典', cat: '儿童绘本', sku: 'SKU-KID-006', price: '¥ 28.00', stock: 45, status: '草稿', color: 'slate' },
    { name: '亲子阅读系列：好大好大', desc: '畅销百万册的亲子绘本', cat: '亲子阅读', sku: 'SKU-KID-004', price: '¥ 58.00', stock: 128, status: '已上架', color: 'emerald' },
  ]);
  
  const [shippingTemplates, setShippingTemplates] = useState([
    { id: '1', name: '全国统一运费 (Standard)', desc: '适用于除偏远地区外的所有商品。', mode: '按重量 (Per kg)', area: '全国 (不含藏新港澳台)', date: '2023-11-24', status: '使用中', active: true },
    { id: '2', name: '小件商品免邮 (Eco-Pack)', desc: '满 ¥99 元免运费策略。', mode: '按件数 (Per item)', area: '华东、华南地区', date: '2023-10-15', status: '', active: false },
  ]);

  const handleTabChange = (tab: PageView) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
    setSelectedOrderId(null);
    setSelectedRole(null);
    setSelectedDistributorId(null);
    setIsAddingProduct(false);
  };

  const OrderDetailPageWithNavigation = ({ orderId, onBack }: { orderId: string; onBack: () => void }) => (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center text-slate-400 text-xs font-bold gap-1 uppercase tracking-widest mb-4 hover:cursor-pointer" onClick={onBack}>
        <span className="hover:text-black">订单管理</span>
        <ChevronRight size={14} />
        <span className="text-slate-900">订单详情</span>
      </nav>
      
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-md mb-8">
        <div>
          <h2 className="text-2xl font-bold font-heading">订单详情</h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded tabular-nums tracking-widest">单号: {orderId}</span>
            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ring-1 ring-emerald-500/20">
              <CheckCircle2 size={12} />
              已完成
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">创建时间: 2023-10-27 14:30:15</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-widest shadow-sm flex items-center gap-2">
            <Printer size={14} /> 打印订单
          </button>
          <button className="px-6 py-2 border border-slate-200 text-rose-500 font-bold rounded-xl hover:bg-rose-50 transition-all text-xs uppercase tracking-widest shadow-sm flex items-center gap-2">
            <RotateCcw size={14} /> 小额退款
          </button>
        </div>
      </div>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-8 flex flex-col gap-5">
          {/* Merged Order Info & Item List Card */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/30">
              <h3 className="text-sm font-bold font-heading flex items-center gap-2 mb-6 italic">
                <TrendingUp size={16} className="text-slate-900" />
                订单概览
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">交易流水号</p>
                  <p className="text-sm font-bold text-slate-900 tabular-nums">TXN-992104556</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">成交时间</p>
                  <p className="text-sm font-bold text-slate-900 tabular-nums">2023-10-27 14:35:00</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">支付方式</p>
                  <p className="text-sm font-bold text-slate-900">企业微信支付</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">订单总额</p>
                  <p className="text-lg font-bold text-emerald-600 tabular-nums">¥ 1,280.00</p>
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="p-5">
               <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-6 italic">
                  <Store size={16} className="text-slate-900" />
                  商品清单
               </h4>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="border-b border-slate-100">
                      <tr>
                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">商品详情</th>
                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">单价</th>
                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">数量</th>
                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">小计</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <tr className="group">
                        <td className="py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center p-3 text-center text-[10px] font-black text-slate-300 leading-tight border border-slate-200">
                               BOOK
                             </div>
                             <div>
                               <p 
                                 className="text-sm font-bold text-slate-900 group-hover:underline underline-offset-4 decoration-slate-900 cursor-pointer"
                                 onClick={() => handleTabChange('products')}
                               >
                                 儿童绘本5本盲盒套餐1
                               </p>
                               <p className="text-xs text-slate-400 mt-1">规格: 典藏版 / 全彩印刷</p>
                             </div>
                          </div>
                        </td>
                        <td className="py-6 text-right text-sm font-medium tabular-nums text-slate-600">¥ 256.00</td>
                        <td className="py-6 text-center text-sm font-bold text-slate-900 tabular-nums">5</td>
                        <td className="py-6 text-right text-sm font-bold text-slate-900 tabular-nums">¥ 1,280.00</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} className="pt-8">
                          <div className="flex flex-col items-end gap-3 pr-4">
                            <div className="flex justify-between w-48 text-xs font-bold">
                              <span className="text-slate-400 uppercase tracking-widest">商品总计:</span>
                              <span className="text-slate-900 tabular-nums">¥ 1,280.00</span>
                            </div>
                            <div className="flex justify-between w-48 text-xs font-bold">
                              <span className="text-slate-400 uppercase tracking-widest">运费:</span>
                              <span className="text-slate-900 tabular-nums">¥ 0.00</span>
                            </div>
                            <div className="h-px w-48 bg-slate-100 my-2" />
                            <div className="flex justify-between w-48 text-lg font-bold">
                              <span className="text-slate-900 uppercase tracking-tight italic">实付金额:</span>
                              <span className="text-emerald-600 tabular-nums">¥ 1,280.00</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                 </table>
               </div>
            </div>
          </div>

          {/* Logistics Module */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-sm font-bold font-heading flex items-center gap-2 italic">
                  <Truck size={16} className="text-slate-900" />
                  物流轨迹
                </h3>
                <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-black transition-colors">
                  同步最新信息
                  <RotateCcw size={12} />
                </button>
             </div>
             
             <div className="mb-10 pb-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">顺丰速运 (SF-144299831)</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">发货时间: 2023-10-27 16:20:00</p>
                </div>
                <div className="px-3 py-1 bg-slate-900 text-white rounded text-[10px] font-black uppercase tracking-widest">运输中</div>
             </div>

             <div className="relative space-y-12 pl-8">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-100"></div>
                
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-4 h-4 bg-white border-2 border-emerald-500 rounded-full z-10">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full m-0.5 animate-pulse" />
                  </div>
                  <p className="text-sm font-bold text-emerald-600">已签收</p>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">包裹已签收，签收人：本人。感谢使用顺丰速运，期待再次为您服务。</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 tabular-nums">2023-10-29 10:15:22</p>
                </div>

                <div className="relative opacity-60">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 bg-slate-200 rounded-full z-10 border border-white" />
                  <p className="text-sm font-bold text-slate-900">派送中</p>
                  <p className="text-xs text-slate-600 mt-1.5">派送员王师傅（138****0099）正在派送中，请保持电话通畅。</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 tabular-nums">2023-10-29 08:30:45</p>
                </div>

                <div className="relative opacity-40">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 bg-slate-200 rounded-full z-10 border border-white" />
                  <p className="text-sm font-bold text-slate-900">运输中</p>
                  <p className="text-xs text-slate-600 mt-1.5">包裹到达上海转运中心，准备发往目的地。转运站：上海金桥仓。</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 tabular-nums">2023-10-28 22:10:00</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Distribution Information */}
        <div className="md:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 sticky top-24">
             <h3 className="text-sm font-bold font-heading flex items-center gap-2 mb-8 italic">
                <Users size={16} className="text-slate-900" />
                分销体系
             </h3>
             
             <div className="space-y-8">
                <div 
                  className="p-4 bg-slate-900 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-slate-800 transition-colors"
                  onClick={() => handleTabChange('distributors')}
                >
                   <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                      <User size={24} className="text-white" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate underline-offset-4 group-hover:underline">张伟杰</p>
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">一级分销商</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">佣金比例</span>
                      <span className="text-lg font-bold text-slate-900 tabular-nums">12.00%</span>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col gap-1 ring-1 ring-emerald-500/10">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">预计佣金</span>
                      <span className="text-xl font-bold text-emerald-600 tabular-nums italic">¥ 153.60</span>
                   </div>
                </div>

                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 flex items-start gap-3">
                   <ShieldCheck size={18} className="text-orange-500 flex-shrink-0" />
                   <p className="text-xs text-orange-800 leading-relaxed font-bold italic">
                      该订单佣金已通过初审，待结算至分销商个人账户。预计到账时间：2023-11-05。
                   </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">分销商备注</p>
                   <p className="text-xs text-slate-600 italic">"该客户为老客户推荐，需关注售后回访，维护长期分销关系。"</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'orders' && selectedOrderId) {
      return <OrderDetailPageWithNavigation orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />;
    }

    if (activeTab === 'permissions' && selectedRole) {
      return <RoleUsersPage roleTitle={selectedRole} onBack={() => setSelectedRole(null)} />;
    }

    if (activeTab === 'distributors' && selectedDistributorId) {
      return <DistributorDetailPage distributorId={selectedDistributorId} onBack={() => setSelectedDistributorId(null)} />;
    }

    if (activeTab === 'products' && isAddingProduct) {
      return <AddProductPage onBack={() => { setIsAddingProduct(false); setEditingProduct(null); }} shippingTemplates={shippingTemplates} onSaveProduct={(product) => {
          if (editingProduct) {
              setProducts(prev => prev.map(p => p.name === editingProduct.name ? product : p));
          } else {
              setProducts(prev => [...prev, product]);
          }
      }} editingProduct={editingProduct} />;
    }

    switch (activeTab) {
      case 'stats': return <DashboardPage />;
      case 'orders': return <OrdersPage onSelectOrder={setSelectedOrderId} />;
      case 'distributors': return <DistributorsPage onSelectDistributor={setSelectedDistributorId} />;
      case 'members': return <MembersPage />;
      case 'products': return <ProductsPage onAddProduct={() => setIsAddingProduct(true)} products={products} setProducts={setProducts} onEditProduct={(product) => { setEditingProduct(product); setIsAddingProduct(true); }} />;
      case 'marketing': return <MarketingPage />;
      case 'finance': return <FinancePage />;
      case 'logistics': return <LogisticsPage shippingTemplates={shippingTemplates} setShippingTemplates={setShippingTemplates} />;
      case 'permissions': return <PermissionsPage onSelectRole={setSelectedRole} />;
      default: return <PlaceholderPage title={NAV_ITEMS.find(i => i.id === activeTab)?.label || ''} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface font-sans antialiased text-slate-900">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-slate-200/60 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
             <div className="bg-black text-white w-8 h-8 rounded-lg flex items-center justify-center font-black">P</div>
             {isSidebarOpen && <span className="font-heading font-black tracking-tight text-lg">寰宇思贤管理平台</span>}
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all group relative
                  ${activeTab === item.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <item.icon size={18} className={activeTab === item.id ? 'text-emerald-400' : 'group-hover:text-slate-900'} />
                {isSidebarOpen && <span>{item.label}</span>}
                {activeTab === item.id && !isSidebarOpen && (
                    <div className="absolute left-full ml-1 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-50">
                        {item.label}
                    </div>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
             <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                    <User size={20} className="text-slate-400" />
                </div>
                {isSidebarOpen && (
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">高级管理员</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">ID: 8829103</p>
                    </div>
                )}
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200/60 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                 <LayoutDashboard size={20} className="rotate-90" />
              </button>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="relative hidden md:block group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={16} />
                 <input className="pl-10 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-black focus:bg-white" placeholder="搜索功能或数据..." />
              </div>
              <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
              <div className="flex items-center gap-2">
              </div>
           </div>
        </header>

        {/* Content Scrollable Container */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#f7f9fb]/50">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
               className="max-w-7xl mx-auto"
             >
                {renderContent()}
             </motion.div>
           </AnimatePresence>
        </main>

        <footer className="h-10 flex items-center justify-center px-6 bg-white border-t border-slate-100 text-[10px] font-bold text-slate-300 tracking-widest uppercase">
           寰宇思贤管理平台 © 2024
        </footer>
      </div>

    </div>
  );
}
