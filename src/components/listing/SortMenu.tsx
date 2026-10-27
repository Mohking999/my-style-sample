import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popularity';

export interface SortMenuProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export const SortMenu: React.FC<SortMenuProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`relative inline-flex items-center text-xs ${className}`}>
      <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 me-2 shrink-0" />
      <span className="text-neutral-500 me-1.5 hidden sm:inline">
        {t('listing.sortBy')}:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="bg-transparent font-semibold text-primary uppercase tracking-wider py-1 pe-6 focus:outline-none cursor-pointer border-b border-transparent hover:border-neutral-400"
      >
        <option value="newest">{t('listing.newest')}</option>
        <option value="popularity">{t('listing.popularity')}</option>
        <option value="price_asc">{t('listing.priceAsc')}</option>
        <option value="price_desc">{t('listing.priceDesc')}</option>
      </select>
    </div>
  );
};
