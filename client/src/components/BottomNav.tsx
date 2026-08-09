import { Home, ShoppingCart, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'cart' | 'profile';
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'cart', label: '购物车', icon: ShoppingCart },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-surface-container-lowest border-t border-outline-variant/30 flex justify-around items-center px-4 pb-safe z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-t-xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              isActive ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <div className={`p-1 rounded-full transition-all ${isActive ? 'scale-110' : ''}`}>
              <Icon size={24} fill={isActive ? 'currentColor' : 'none'} fillOpacity={isActive ? 0.2 : 0} />
            </div>
            <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
              {tab.label}
            </span>
            {isActive && (
              <div className="w-1 h-1 rounded-full bg-secondary mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
