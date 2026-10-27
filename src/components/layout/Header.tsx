import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Search, ShoppingBag, Heart, User, ShieldCheck } from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { MobileMenu } from './MobileMenu';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { totalWishlist } = useWishlist();
  const { user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainCategories = [
    { label: t('nav.newArrivals'), href: '/shop?filter=new' },
    { label: t('nav.women'), href: '/shop?category=women' },
    { label: t('nav.men'), href: '/shop?category=men' },
    {
      label: t('nav.traditional'),
      href: '/shop?category=traditional',
      featured: true,
    },
    { label: t('nav.formal'), href: '/shop?category=formal' },
    { label: t('nav.casual'), href: '/shop?category=casual' },
    { label: t('nav.wedding'), href: '/shop?category=wedding' },
    { label: t('nav.accessories'), href: '/shop?category=accessories' },
    { label: t('nav.sale'), href: '/shop?filter=sale', sale: true },
  ];

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border transition-shadow duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Left / Start: Mobile Menu Toggle & Desktop Logo */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-primary hover:text-neutral-600 transition-colors focus:outline-none"
                aria-label={t('nav.menu')}
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Logo */}
              <Link to="/" className="flex flex-col items-start select-none group">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-widest text-primary group-hover:text-neutral-800 transition-colors">
                  MYSTYLE
                </span>
                <span className="text-[9px] tracking-[0.35em] text-heritage-gold font-sans font-semibold uppercase -mt-1 ps-0.5">
                  ALGER · ÉDITION
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation Bar */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 rtl:space-x-reverse text-xs uppercase tracking-widest font-medium">
              {mainCategories.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`py-2 transition-colors relative group ${
                    item.sale
                      ? 'text-algerian-600 font-bold hover:text-algerian-700'
                      : item.featured
                      ? 'text-forest-700 font-semibold hover:text-forest-900'
                      : 'text-neutral-700 hover:text-primary'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 inset-x-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${
                      item.sale
                        ? 'bg-algerian-600'
                        : item.featured
                        ? 'bg-forest-700'
                        : 'bg-primary'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Right / End: Actions */}
            <div className="flex items-center space-x-3 sm:space-x-5 rtl:space-x-reverse">
              {/* Search */}
              <button
                type="button"
                onClick={() => navigate('/search')}
                className="p-2 text-primary hover:text-neutral-600 transition-colors"
                aria-label={t('nav.search')}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account */}
              <Link
                to={user ? (isAdmin ? '/admin' : '/account') : '/account/login'}
                className="p-2 text-primary hover:text-neutral-600 transition-colors relative"
                aria-label={t('nav.account')}
              >
                {isAdmin ? (
                  <ShieldCheck className="w-5 h-5 text-forest-700" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 text-primary hover:text-neutral-600 transition-colors relative hidden sm:inline-block"
                aria-label={t('nav.wishlist')}
              >
                <Heart className="w-5 h-5" />
                {totalWishlist > 0 && (
                  <span className="absolute 1 top-1 end-1 bg-neutral-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalWishlist}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="p-2 text-primary hover:text-neutral-600 transition-colors relative"
                aria-label={t('nav.cart')}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 end-1 bg-algerian-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};
