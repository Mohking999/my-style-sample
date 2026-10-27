import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface FilterState {
  category?: string;
  type?: 'all' | 'ready_to_wear' | 'made_to_order';
  sizes: string[];
  colors: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
}

export interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  availableSizes?: string[];
  availableColors?: { name: string; hex: string }[];
  categories?: { slug: string; name: string }[];
  className?: string;
}

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44'];
const DEFAULT_COLORS = [
  { name: 'Noir', hex: '#111111' },
  { name: 'Blanc', hex: '#FFFFFF' },
  { name: 'Bordeaux', hex: '#6A1A24' },
  { name: 'Vert Forêt', hex: '#163323' },
  { name: 'Doré', hex: '#C5A059' },
  { name: 'Bleu Nuit', hex: '#1E293B' },
  { name: 'Beige', hex: '#E6D7C3' },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableSizes = DEFAULT_SIZES,
  availableColors = DEFAULT_COLORS,
  categories = [],
  className = '',
}) => {
  const { t } = useTranslation();

  const handleSizeToggle = (size: string) => {
    const exists = filters.sizes.includes(size);
    const newSizes = exists
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const handleColorToggle = (colorName: string) => {
    const exists = filters.colors.includes(colorName);
    const newColors = exists
      ? filters.colors.filter((c) => c !== colorName)
      : [...filters.colors, colorName];
    onFilterChange({ ...filters, colors: newColors });
  };

  return (
    <div className={`space-y-6 text-start ${className}`}>
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
          {t('listing.filterTitle')}
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] text-neutral-500 hover:text-primary inline-flex items-center space-x-1 rtl:space-x-reverse transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t('listing.clearAll')}</span>
        </button>
      </div>

      {/* Product Type (Ready to Wear vs Made to Order) */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
          Type de Confection
        </h4>
        <div className="space-y-1.5 text-xs">
          {[
            { id: 'all', label: t('listing.allTypes') },
            { id: 'ready_to_wear', label: t('product.readyToWear') },
            { id: 'made_to_order', label: t('product.madeToOrder') },
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer py-1 text-neutral-600 hover:text-primary"
            >
              <input
                type="radio"
                name="productType"
                checked={(filters.type || 'all') === item.id}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    type: item.id as 'all' | 'ready_to_wear' | 'made_to_order',
                  })
                }
                className="accent-primary h-3.5 w-3.5"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories if available */}
      {categories.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border">
          <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
            Catégories
          </h4>
          <div className="space-y-1 text-xs max-h-48 overflow-y-auto">
            {categories.map((cat) => (
              <label
                key={cat.slug}
                className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer py-1 text-neutral-600 hover:text-primary"
              >
                <input
                  type="radio"
                  name="categoryFilter"
                  checked={filters.category === cat.slug}
                  onChange={() =>
                    onFilterChange({
                      ...filters,
                      category: filters.category === cat.slug ? undefined : cat.slug,
                    })
                  }
                  className="accent-primary h-3.5 w-3.5"
                />
                <span className={filters.category === cat.slug ? 'font-semibold text-primary' : ''}>
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      <div className="space-y-2 pt-2 border-t border-border">
        <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
          {t('listing.sizes')}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {availableSizes.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`min-w-[36px] h-8 px-2 text-xs font-medium uppercase transition-colors border ${
                  isSelected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-neutral-700 border-border hover:border-neutral-900'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-2 pt-2 border-t border-border">
        <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
          {t('listing.colors')}
        </h4>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color) => {
            const isSelected = filters.colors.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => handleColorToggle(color.name)}
                title={color.name}
                className={`relative w-6 h-6 rounded-full border border-black/10 transition-transform ${
                  isSelected ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2 pt-2 border-t border-border">
        <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
          {t('listing.priceRange')} (DA)
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full border border-border px-2 py-1.5 focus:outline-none focus:border-primary text-xs"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full border border-border px-2 py-1.5 focus:outline-none focus:border-primary text-xs"
          />
        </div>
      </div>

      {/* Stock Availability */}
      <div className="pt-2 border-t border-border">
        <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer text-xs text-neutral-700">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="accent-primary h-3.5 w-3.5"
          />
          <span>{t('product.inStock')}</span>
        </label>
      </div>
    </div>
  );
};
