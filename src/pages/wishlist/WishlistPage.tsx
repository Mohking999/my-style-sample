import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/product/ProductCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Heart } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { t } = useTranslation();
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-start">
      <Breadcrumbs
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('nav.wishlist') },
        ]}
        className="mb-6"
      />

      <div className="mb-8 pb-4 border-b border-border">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
          {t('nav.wishlist')} ({wishlist.length})
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Retrouvez vos pièces préférées enregistrées lors de vos visites.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-lg font-bold text-primary mb-2">
            Votre liste d'envies est vide
          </h2>
          <p className="text-xs text-neutral-500 mb-6">
            Parcourez nos collections et cliquez sur le cœur pour sauvegarder vos pièces favorites.
          </p>
          <Link to="/shop">
            <Button variant="primary" size="sm">
              Découvrir les collections
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
