import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '@/utils/formatters';

export interface PriceTagProps {
  priceDzd: number;
  originalPriceDzd?: number | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDiscountBadge?: boolean;
  className?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  priceDzd,
  originalPriceDzd,
  size = 'md',
  showDiscountBadge = true,
  className = '',
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'fr';

  const hasDiscount = originalPriceDzd && originalPriceDzd > priceDzd;
  const discountPercent = hasDiscount
    ? Math.round(((originalPriceDzd! - priceDzd) / originalPriceDzd!) * 100)
    : 0;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-lg font-semibold',
    xl: 'text-2xl font-bold',
  };

  const origSizeClasses = {
    sm: 'text-[11px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  };

  return (
    <div className={`inline-flex items-baseline flex-wrap gap-x-2 gap-y-0.5 ${className}`}>
      <span className={`${sizeClasses[size]} ${hasDiscount ? 'text-algerian-600' : 'text-primary'}`}>
        {formatPrice(priceDzd, lang)}
      </span>
      {hasDiscount && (
        <span className={`${origSizeClasses[size]} line-through text-neutral-400 font-normal`}>
          {formatPrice(originalPriceDzd!, lang)}
        </span>
      )}
      {hasDiscount && showDiscountBadge && (
        <span className="ms-1 text-[10px] uppercase font-bold text-algerian-600 bg-algerian-50 px-1.5 py-0.5 rounded-sm">
          -{discountPercent}%
        </span>
      )}
    </div>
  );
};
