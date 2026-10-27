import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Truck, ShieldCheck, RefreshCw, Scissors, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-neutral-300 pt-16 pb-12 border-t border-neutral-800 text-start">
      {/* Algerian Trust Signals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-sm text-heritage-gold shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white mb-1">
                Livraison 58 Wilayas
              </h4>
              <p className="text-xs text-neutral-400">
                À domicile ou point relais partout en Algérie en 24h à 72h.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-sm text-heritage-gold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white mb-1">
                Paiement à la Livraison
              </h4>
              <p className="text-xs text-neutral-400">
                Réglez en toute sérénité en espèces après vérification du colis.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-sm text-heritage-gold shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white mb-1">
                Sur-Mesure & Tradition
              </h4>
              <p className="text-xs text-neutral-400">
                Pièces uniques confectionnées par des artisans de nos régions.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-sm text-heritage-gold shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white mb-1">
                Échange Facile
              </h4>
              <p className="text-xs text-neutral-400">
                Possibilité d'échange de taille rapide auprès du livreur.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block select-none">
              <span className="font-serif text-2xl font-bold tracking-widest text-white">
                MYSTYLE
              </span>
              <span className="block text-[9px] tracking-[0.35em] text-heritage-gold uppercase">
                ALGER · ÉDITION
              </span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {t('footer.tagline')}
            </p>
            <div className="pt-2 flex items-center space-x-2 rtl:space-x-reverse text-xs text-neutral-400">
              <MapPin className="w-4 h-4 text-heritage-gold shrink-0" />
              <span>Alger Centre / Bab Ezzouar, Algérie</span>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
              {t('nav.shop')}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/shop?filter=new" className="hover:text-white transition-colors">
                  {t('nav.newArrivals')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=women" className="hover:text-white transition-colors">
                  {t('nav.women')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=men" className="hover:text-white transition-colors">
                  {t('nav.men')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=traditional" className="hover:text-white transition-colors text-heritage-sand">
                  {t('nav.traditional')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=wedding" className="hover:text-white transition-colors">
                  {t('nav.wedding')}
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=sale" className="text-algerian-500 hover:text-algerian-400 transition-colors">
                  {t('nav.sale')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
              {t('footer.customerService')}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/orders/track" className="hover:text-white transition-colors">
                  Suivi de Colis
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-white transition-colors">
                  {t('footer.deliveryReturns')}
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-white transition-colors">
                  {t('footer.sizeGuide')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Maison & Craftsmanship */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
              {t('footer.aboutUs')}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  {t('footer.heritage')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-neutral-500 transition-colors text-[11px] text-neutral-600">
                  Accès Équipe & Tailleurs
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-800 text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} MyStyle Algérie. {t('footer.allRights')}</p>
        <div className="flex items-center space-x-4 rtl:space-x-reverse text-neutral-400">
          <span>Paiement sécurisé :</span>
          <span className="font-mono text-white text-[11px] px-2 py-0.5 bg-neutral-900 border border-neutral-800">
            Cash On Delivery
          </span>
          <span className="font-mono text-white text-[11px] px-2 py-0.5 bg-neutral-900 border border-neutral-800">
            CIB / Edahabia
          </span>
        </div>
      </div>
    </footer>
  );
};
