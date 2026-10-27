import React from 'react';

export interface ColorSwatchOption {
  id: string;
  name: string;
  hex: string;
  disabled?: boolean;
}

export interface ColorSwatchProps {
  options: ColorSwatchOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  options,
  selectedId,
  onSelect,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {options.map((opt) => {
        const isSelected = selectedId === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            title={opt.name}
            aria-label={opt.name}
            disabled={opt.disabled}
            onClick={() => onSelect(opt.id)}
            className={`group relative rounded-full p-0.5 transition-all duration-150 focus:outline-none ${
              isSelected ? 'ring-2 ring-primary ring-offset-2' : 'hover:scale-105'
            } ${opt.disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`block rounded-full border border-black/10 shadow-inner ${sizeClasses[size]}`}
              style={{ backgroundColor: opt.hex }}
            />
            {opt.disabled && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="h-0.5 w-full bg-neutral-500 rotate-45 transform" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
