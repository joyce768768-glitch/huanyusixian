import { useEffect, useState } from 'react';
import { Home, ShoppingCart, User } from 'lucide-react';
import { cartAPI } from '@shared/api';

interface BottomNavProps {
  currentTab: 'home' | 'cart' | 'profile';
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    cartAPI.getCount().then(res => {
      if (res.success && res.data) setCount(res.data.count || 0);
    });
  }, [currentTab]);

  const tabs = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'cart', label: '购物车', icon: ShoppingCart, badge: count },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 pointer-events-none px-5 pb-4 pb-safe">
      <nav className="pointer-events-auto glass border border-white/40 rounded-[26px] shadow-lg px-3 py-2 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 outline-none"
              aria-label={tab.label}
            >
              {/* 活动态岛屿 */}
              <span
                className={`absolute top-1/2 -translate-y-1/2 h-11 w-16 rounded-full transition-all duration-300 ease-out ${
                  isActive ? 'bg-brand-gradient shadow-glow opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
              />
              <span className={`relative z-10 flex items-center justify-center transition-colors duration-300 ${isActive ? 'text-white' : 'text-on-surface-variant'}`}>
                <Icon size={21} strokeWidth={isActive ? 2.4 : 2} />
                {!!tab.badge && tab.badge > 0 && (
                  <span className={`absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center ${
                    isActive ? 'bg-white text-primary' : 'bg-primary text-white'
                  }`}>
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </span>
              <span className={`relative z-10 text-[10px] font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-on-surface-variant/80'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
