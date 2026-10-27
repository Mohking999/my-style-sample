import React from 'react';

export interface SizeOption {
  size: string;
  inStock: boolean;
  stockCount?: number;
}

export interface SizeSelectorProps {
  sizes: SizeOption[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  className?: string;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {sizes.map((s) => {
        const isSelected = selectedSize === s.size;
        return (
          <button
            key={s.size}
            type="button"
            disabled={!s.inStock}
            onClick={() => onSelectSize(s.size)}
            className={`min-w-[42px] h-10 px-3 flex items-center justify-center text-xs font-medium uppercase tracking-wider transition-all duration-150 border ${
              isSelected
                ? 'bg-primary text-white border-primary shadow-sm'
                : s.inStock
                ? 'bg-white text-primary border-border hover:border-neutral-900'
                : 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed line-through'
            }`}
          >
            {s.size}
          </button>
        );
      })}
    </div>
  );
};
