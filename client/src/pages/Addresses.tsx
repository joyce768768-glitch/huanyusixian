import { useEffect, useState } from 'react';
import { Edit3, Plus, Mail, Trash2, Loader2, X, Check } from 'lucide-react';
import { addressAPI } from '@shared/api';
import type { Address } from '../types.ts';

export default function Addresses({ onBack }: { onBack: () => void }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState({ name: '', phone: '', area: '', detail: '', isDefault: false });

  useEffect(() => {
    loadAddresses();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  const loadAddresses = async () => {
    setLoading(true);
    const res = await addressAPI.getAddresses();
    setLoading(false);
    if (res.success && res.data) setAddresses(res.data);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', phone: '', area: '', detail: '', isDefault: false });
    setShowEditor(true);
  };

  const openEdit = (addr: Address) => {
    setEditing(addr);
    setForm({
      name: addr.name || '',
      phone: addr.phone || '',
      area: addr.area || '',
      detail: addr.detail || addr.address || '',
      isDefault: !!addr.isDefault,
    });
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      showToast('请填写姓名和电话');
      return;
    }
    setActionLoading('save');
    let res;
    if (editing) {
      res = await addressAPI.updateAddress(editing.id, form);
    } else {
      res = await addressAPI.createAddress(form as any);
    }
    setActionLoading(null);
    if (res.success) {
      showToast(editing ? '已更新地址' : '已添加地址');
      setShowEditor(false);
      loadAddresses();
    } else {
      showToast(res.message || '保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    const res = await addressAPI.deleteAddress(id);
    setActionLoading(null);
    if (res.success) {
      showToast('已删除地址');
      loadAddresses();
    } else {
      showToast(res.message || '删除失败');
    }
  };

  const handleSetDefault = async (id: string) => {
    setActionLoading(id + ':def');
    const res = await addressAPI.setDefault(id);
    setActionLoading(null);
    if (res.success) {
      showToast('已设为默认');
      loadAddresses();
    } else {
      showToast(res.message || '操作失败');
    }
  };

  return (
    <div className="px-4 py-8 pb-32 max-w-lg mx-auto">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-on-surface/90 text-surface px-5 py-2.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm">
          {toast}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowEditor(false)}>
          <div className="bg-surface-container-lowest w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-on-surface">{editing ? '编辑地址' : '添加新地址'}</h3>
              <button onClick={() => setShowEditor(false)} className="p-1 text-on-surface-variant">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-on-surface-variant mb-1.5 block">收货人姓名</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="请输入姓名"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant mb-1.5 block">联系电话</label>
                <input
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="请输入手机号"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant mb-1.5 block">所在地区</label>
                <input
                  value={form.area}
                  onChange={e => setForm({ ...form, area: e.target.value })}
                  placeholder="例如：上海市 徐汇区"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant mb-1.5 block">详细地址</label>
                <textarea
                  value={form.detail}
                  onChange={e => setForm({ ...form, detail: e.target.value })}
                  placeholder="街道、门牌号等"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-sm outline-none focus:border-primary resize-none"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                    form.isDefault ? 'bg-primary border-primary' : 'border-outline-variant'
                  }`}
                  onClick={() => setForm({ ...form, isDefault: !form.isDefault })}
                >
                  {form.isDefault && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm font-bold text-on-surface">设为默认地址</span>
              </label>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowEditor(false)} className="flex-1 py-3 rounded-full bg-surface-container text-on-surface font-bold text-sm">
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={actionLoading === 'save'}
                className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold text-sm shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {actionLoading === 'save' && <Loader2 size={16} className="animate-spin" />}
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="mt-3 text-sm text-on-surface-variant">加载地址中...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="py-24 border-2 border-dashed border-outline-variant rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="bg-surface-container p-5 rounded-full mb-5">
            <Mail className="text-outline" size={40} />
          </div>
          <h3 className="text-base font-bold text-on-surface mb-2">还没有收货地址</h3>
          <p className="text-xs text-on-surface-variant mb-6">添加一个收货地址，方便购买绘本~</p>
          <button onClick={openAdd} className="bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-bold shadow-md">
            添加地址
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm hover:scale-[1.01] transition-all group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-on-surface">{address.name}</span>
                  {address.isDefault && (
                    <span className="bg-secondary-container text-on-secondary-container text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-secondary/10">
                      默认
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(address)} className="text-on-surface-variant hover:text-primary transition-colors p-1.5">
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={actionLoading === address.id}
                    className="text-on-surface-variant hover:text-error transition-colors p-1.5 disabled:opacity-40"
                  >
                    {actionLoading === address.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>

              <p className="text-sm font-medium text-on-surface-variant mb-2">{address.phone}</p>
              <p className="text-sm text-on-surface leading-relaxed pr-8">
                {address.area && <span className="text-on-surface-variant mr-1">{address.area}</span>}
                {address.detail || address.address}
              </p>

              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  disabled={actionLoading === address.id + ':def'}
                  className="mt-5 text-xs font-bold text-primary hover:underline disabled:opacity-50"
                >
                  设为默认地址
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <div className="fixed bottom-24 left-0 right-0 px-4 z-40 flex justify-center">
        <button
          onClick={openAdd}
          className="bg-secondary-container text-on-secondary-container rounded-full px-12 py-4 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-secondary/20"
          style={{ backgroundColor: '#D4E96D' }}
        >
          <Plus size={24} />
          <span className="text-sm font-black">添加新地址</span>
        </button>
      </div>
    </div>
  );
}
