import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { PriceTag } from '@/components/ui/PriceTag';
import { Badge } from '@/components/ui/Badge';
import { useWishlist } from '@/context/WishlistContext';
import { getLocalized } from '@/utils/formatters';

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'fr';
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFav = isInWishlist(product.id);
  const name = getLocalized(product, 'name', lang);
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600';
  const hoverImage = product.images?.[1] || mainImage;

  // Extract unique colors from variants
  const uniqueColors = Array.from(
    new Map(
      product.variants.map((v) => [
        v.colorHex,
        { hex: v.colorHex, name: getLocalized(v, 'colorName', lang) },
      ])
    ).values()
  );

  return (
    <div className={`group flex flex-col text-start relative select-none ${className}`}>
      {/* Image Container */}
      <div className="relative aspect-product w-full overflow-hidden bg-neutral-100 border border-border/40">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={name}
            loading="lazy"
            className={`w-full h-full object-cover object-top transition-opacity duration-500 ${
              hoverImage !== mainImage ? 'group-hover:opacity-0' : 'group-hover:scale-105 transition-transform'
            }`}
          />
          {hoverImage !== mainImage && (
            <img
              src={hoverImage}
              alt={`${name} alternative`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105 transition-transform"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 start-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.originalPriceDzd && product.originalPriceDzd > product.priceDzd && (
            <Badge variant="sale">
              {t('nav.sale')}
            </Badge>
          )}
          {product.type === 'made_to_order' && (
            <Badge variant="traditional">
              {t('product.madeToOrder')}
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="new">
              {t('nav.newArrivals')}
            </Badge>
          )}
          {product.originRegion && (
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-black/75 backdrop-blur-xs text-white font-mono font-medium">
              {product.originRegion}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`absolute top-2.5 end-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isFav
              ? 'bg-white text-algerian-600 shadow-sm'
              : 'bg-white/80 text-neutral-700 hover:text-black hover:bg-white'
          }`}
          aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View banner on hover */}
        <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
          <Link
            to={`/product/${product.slug}`}
            className="w-full block py-2.5 text-center text-xs uppercase tracking-widest font-semibold bg-white/95 backdrop-blur-xs text-primary hover:bg-primary hover:text-white transition-colors border border-border shadow-sm"
          >
            {product.type === 'made_to_order' ? t('product.requestGarment') : t('product.addToCart')}
          </Link>
        </div>
      </div>

      {/* Info Section */}
      <div className="pt-3 pb-1 flex flex-col space-y-1">
        {/* Colors Preview */}
        {uniqueColors.length > 1 && (
          <div className="flex items-center space-x-1 rtl:space-x-reverse mb-0.5">
            {uniqueColors.slice(0, 4).map((c, i) => (
              <span
                key={i}
                title={c.name}
                className="w-2.5 h-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {uniqueColors.length > 4 && (
              <span className="text-[10px] text-neutral-400 font-mono">
                +{uniqueColors.length - 4}
              </span>
            )}
          </div>
        )}

        <Link
          to={`/product/${product.slug}`}
          className="text-xs uppercase font-medium tracking-wider text-neutral-800 hover:text-black line-clamp-1 transition-colors"
        >
          {name}
        </Link>

        <PriceTag
          priceDzd={product.priceDzd}
          originalPriceDzd={product.originalPriceDzd}
          size="sm"
        />
      </div>
    </div>
  );
};
