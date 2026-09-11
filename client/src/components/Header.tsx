import { ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { PageId } from '../App.tsx';

interface HeaderProps {
  currentPage: PageId;
  onBack: () => void;
  onSearch?: () => void;
}

const TITLES: Partial<Record<PageId, string>> = {
  home: '寰宇思贤',
  favorites: '我的收藏',
  cart: '购物车',
  profile: '寰宇思贤',
  orders: '全部订单',
  wallet: '我的钱包',
  addresses: '收货地址',
  distributors: '分销伙伴',
  membership: '我的会员',
  coupons: '我的优惠券',
};

export default function Header({ currentPage, onBack, onSearch }: HeaderProps) {
  const isHomeOrProfile = currentPage === 'home' || currentPage === 'profile';
  const title = TITLES[currentPage] || '寰宇思贤';
  const isBrand = currentPage === 'home' || currentPage === 'profile';

  return (
    <header className="sticky top-0 z-50 glass border-b border-outline-variant/40 pt-safe">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {!isHomeOrProfile && (
            <button
              onClick={onBack}
              aria-label="返回"
              className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high/70 active:scale-90 transition-all"
            >
              <ArrowLeft size={22} strokeWidth={2.2} />
            </button>
          )}
          {isBrand ? (
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-brand-gradient text-white font-serif font-black text-lg flex items-center justify-center shadow-glow">
                寰
              </span>
              <div className="leading-none">
                <h1 className="font-serif font-black text-lg text-on-surface">{title}</h1>
                <p className="text-[10px] text-on-surface-variant mt-0.5 tracking-wide">绘本盲盒 · 悦读之旅</p>
              </div>
            </div>
          ) : (
            <h1 className="text-lg font-black text-on-surface truncate">{title}</h1>
          )}
        </div>

        <button
          aria-label={currentPage === 'wallet' ? '帮助' : '搜索'}
          onClick={currentPage === 'wallet' ? undefined : onSearch}
          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high/70 active:scale-90 transition-all"
        >
          {currentPage === 'wallet' ? <HelpCircle size={21} strokeWidth={2.1} /> : <Search size={21} strokeWidth={2.1} />}
        </button>
      </div>
    </header>
  );
}
