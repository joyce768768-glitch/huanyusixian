/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Home from './pages/Home.tsx';
import Favorites from './pages/Favorites.tsx';
import Cart from './pages/Cart.tsx';
import Profile from './pages/Profile.tsx';
import Orders from './pages/Orders.tsx';
import Wallet from './pages/Wallet.tsx';
import Addresses from './pages/Addresses.tsx';
import Distributors from './pages/Distributors.tsx';
import Membership from './pages/Membership.tsx';
import Coupons from './pages/Coupons.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import BottomNav from './components/BottomNav.tsx';
import Header from './components/Header.tsx';
import ShareDrawer from './components/ShareDrawer.tsx';
import { Product } from './types.ts';

export type PageId = 'home' | 'favorites' | 'cart' | 'profile' | 'orders' | 'wallet' | 'addresses' | 'distributors' | 'product_detail' | 'membership' | 'coupons';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const navigateTo = (page: PageId, product?: Product) => {
    setCurrentPage(page);
    if (product) setSelectedProduct(product);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onProductClick={(p) => navigateTo('product_detail', p)} onInvite={() => setIsShareOpen(true)} />;
      case 'favorites':
        return <Favorites onProductClick={(p) => navigateTo('product_detail', p)} onBack={() => navigateTo('profile')} />;
      case 'cart':
        return <Cart onBack={() => navigateTo('home')} />;
      case 'profile':
        return <Profile 
                  onNavigate={navigateTo} 
                  onInvite={() => setIsShareOpen(true)}
                />;
      case 'orders':
        return <Orders onBack={() => navigateTo('profile')} />;
      case 'wallet':
        return <Wallet onBack={() => navigateTo('profile')} />;
      case 'addresses':
        return <Addresses onBack={() => navigateTo('profile')} />;
      case 'distributors':
        return <Distributors onBack={() => navigateTo('profile')} onInvite={() => setIsShareOpen(true)} />;
      case 'membership':
        return <Membership onBack={() => navigateTo('profile')} />;
      case 'coupons':
        return <Coupons onBack={() => navigateTo('profile')} />;
      case 'product_detail':
        return selectedProduct ? (
          <ProductDetail product={selectedProduct} onBack={() => navigateTo('home')} />
        ) : (
          <Home onProductClick={(p) => navigateTo('product_detail', p)} onInvite={() => setIsShareOpen(true)} />
        );
      default:
        return <Home onProductClick={(p) => navigateTo('product_detail', p)} onInvite={() => setIsShareOpen(true)} />;
    }
  };

  const showBottomNav = ['home', 'cart', 'profile'].includes(currentPage);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header currentPage={currentPage} onBack={() => {
        if (currentPage === 'product_detail') navigateTo('home');
        else navigateTo('profile');
      }} />
      
      <main className="flex-1 pb-24">
        {renderPage()}
      </main>

      {showBottomNav && (
        <BottomNav currentTab={currentPage as any} onTabChange={(tab) => navigateTo(tab as any)} />
      )}

      <ShareDrawer isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
}

