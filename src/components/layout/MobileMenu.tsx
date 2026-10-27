import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Drawer } from '@/components/ui/Drawer';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  ShoppingBag,
  User,
  Heart,
  Search,
  Scissors,
  ShieldCheck,
  PhoneCall,
  ChevronRight,
} from 'lucide-react';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user, isAdmin, isTailor } = useAuth();

  const navigation = [
    { label: t('nav.newArrivals'), href: '/shop?filter=new', highlight: true },
    { label: t('nav.women'), href: '/shop?category=women' },
    { label: t('nav.men'), href: '/shop?category=men' },
    {
      label: t('nav.traditional'),
      href: '/shop?category=traditional',
      badge: 'Heritage',
    },
    { label: t('nav.formal'), href: '/shop?category=formal' },
    { label: t('nav.casual'), href: '/shop?category=casual' },
    { label: t('nav.wedding'), href: '/shop?category=wedding' },
    { label: t('nav.accessories'), href: '/shop?category=accessories' },
    { label: t('nav.sale'), href: '/shop?filter=sale', sale: true },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="start" width="md" title="MYSTYLE">
      <div className="flex flex-col h-full justify-between pb-6">
        <div>
          {/* Search bar quick action */}
          <Link
            to="/search"
            onClick={onClose}
            className="flex items-center space-x-3 rtl:space-x-reverse bg-surface-subtle p-3 text-xs text-neutral-500 mb-6 border border-border"
          >
            <Search className="w-4 h-4 text-neutral-400" />
            <span>{t('nav.search')}...</span>
          </Link>

          {/* Categories Nav */}
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className="flex items-center justify-between py-3 px-2 text-sm font-medium uppercase tracking-wider text-primary hover:bg-neutral-50 transition-colors border-b border-neutral-100"
              >
                <span className={item.sale ? 'text-algerian-600 font-bold' : ''}>
                  {item.label}
                </span>
                {item.badge ? (
                  <span className="text-[10px] bg-heritage-gold/20 text-neutral-900 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-neutral-400 rtl:rotate-180" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Account & Links */}
        <div className="pt-6 border-t border-border mt-8 space-y-3">
          {user ? (
            <div className="space-y-2">
              <Link
                to="/account"
                onClick={onClose}
                className="flex items-center space-x-3 rtl:space-x-reverse text-xs font-semibold uppercase tracking-wider text-primary py-2 px-2 hover:bg-neutral-50"
              >
                <User className="w-4 h-4 text-neutral-500" />
                <span>{t('nav.account')} ({user.name})</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={onClose}
                  className="flex items-center space-x-3 rtl:space-x-reverse text-xs font-semibold uppercase tracking-wider text-forest-700 py-2 px-2 hover:bg-neutral-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Tableau de Bord Admin</span>
                </Link>
              )}
            </div>
          ) : (
            <Link
              to="/account/login"
              onClick={onClose}
              className="w-full flex items-center justify-center bg-primary text-white py-3 text-xs font-semibold uppercase tracking-widest"
            >
              <User className="w-4 h-4 me-2" />
              <span>{t('auth.login')} / {t('auth.register')}</span>
            </Link>
          )}

          <div className="flex justify-between items-center text-xs text-neutral-500 pt-3">
            <Link to="/about" onClick={onClose} className="hover:underline">
              {t('footer.aboutUs')}
            </Link>
            <span>·</span>
            <Link to="/delivery" onClick={onClose} className="hover:underline">
              {t('footer.deliveryReturns')}
            </Link>
            <span>·</span>
            <Link to="/contact" onClick={onClose} className="hover:underline">
              {t('footer.contactUs')}
            </Link>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
