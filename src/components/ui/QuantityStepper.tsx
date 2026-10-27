import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  disabled = false,
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const isSm = size === 'sm';

  return (
    <div
      className={`inline-flex items-center border border-border bg-white select-none ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min || disabled}
        onClick={handleDecrement}
        className={`${
          isSm ? 'w-7 h-7' : 'w-9 h-9'
        } flex items-center justify-center text-neutral-600 hover:text-primary hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors`}
      >
        <Minus className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
      </button>

      <span
        className={`${
          isSm ? 'w-8 text-xs' : 'w-10 text-sm'
        } text-center font-medium text-primary`}
      >
        {value}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max || disabled}
        onClick={handleIncrement}
        className={`${
          isSm ? 'w-7 h-7' : 'w-9 h-9'
        } flex items-center justify-center text-neutral-600 hover:text-primary hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors`}
      >
        <Plus className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
      </button>
    </div>
  );
};
