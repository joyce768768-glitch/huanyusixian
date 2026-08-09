import { ArrowLeft, Menu, Search, HelpCircle } from 'lucide-react';
import { PageId } from '../App.tsx';

interface HeaderProps {
  currentPage: PageId;
  onBack: () => void;
}

export default function Header({ currentPage, onBack }: HeaderProps) {
  const getTitle = () => {
    switch (currentPage) {
      case 'home': return '寰宇思贤';
      case 'favorites': return '我的收藏';
      case 'cart': return '购物车';
      case 'profile': return '寰宇思贤';
      case 'orders': return '全部订单';
      case 'wallet': return '我的钱包';
      case 'addresses': return '收货地址';
      case 'distributors': return '分销伙伴';
      case 'membership': return '我的会员';
      case 'coupons': return '我的优惠券';
      case 'product_detail': return '';
      default: return '寰宇思贤';
    }
  };

  const isHomeOrProfile = ['home', 'profile'].includes(currentPage);
  const isProductDetail = currentPage === 'product_detail';

  if (isProductDetail) return null; // Product detail has its own overlay back button

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {isHomeOrProfile ? (
          <button className="p-2 text-primary hover:bg-surface-container-high rounded-full transition-colors">
            <Menu size={24} />
          </button>
        ) : (
          <button 
            onClick={onBack}
            className="p-2 text-primary hover:bg-surface-container-high rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold text-on-surface truncate">
          {getTitle()}
          {currentPage === 'favorites' && <span className="text-sm font-normal ml-1">(4)</span>}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {currentPage === 'wallet' ? (
          <button className="p-2 text-on-surface hover:bg-surface-container-high rounded-full transition-colors">
            <HelpCircle size={24} />
          </button>
        ) : (
          <button className="p-2 text-primary hover:bg-surface-container-high rounded-full transition-colors">
            <Search size={24} />
          </button>
        )}
      </div>
    </header>
  );
}
