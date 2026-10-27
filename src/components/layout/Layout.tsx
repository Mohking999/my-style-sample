import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-primary selection:bg-forest-700 selection:text-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
};
