import { Edit3, Plus, Mail } from 'lucide-react';
import { ADDRESSES } from '../data.ts';

export default function Addresses({ onBack }: { onBack: () => void }) {
  return (
    <div className="px-4 py-8 pb-32 max-w-lg mx-auto">
      <div className="grid grid-cols-1 gap-6">
        {ADDRESSES.map((address) => (
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
              <button className="text-on-surface-variant hover:text-primary transition-colors p-1">
                <Edit3 size={18} />
              </button>
            </div>
            
            <p className="text-sm font-medium text-on-surface-variant mb-2">{address.phone}</p>
            <p className="text-sm text-on-surface leading-relaxed pr-8">{address.address}</p>
          </div>
        ))}
      </div>

      {/* Empty visual spacer */}
      <div className="hidden md:flex items-center justify-center mt-12 p-12 border-2 border-dashed border-outline-variant rounded-3xl opacity-20">
        <Mail size={64} className="text-outline" />
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-24 left-0 right-0 px-4 z-40 flex justify-center">
        <button 
          className="bg-secondary-container text-on-secondary-container rounded-full px-12 py-4 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-secondary/20"
          style={{ backgroundColor: '#D4E96D' }} // Matching the specific lime in the screenshot
        >
          <Plus size={24} />
          <span className="text-sm font-black">添加新地址</span>
        </button>
      </div>
    </div>
  );
}
