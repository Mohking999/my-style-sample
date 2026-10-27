import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      placeholder,
      id,
      className = '',
      required,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-start">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5"
          >
            {label}
            {required && <span className="text-algerian-500 ms-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            required={required}
            className={`w-full appearance-none bg-white border text-sm text-primary transition-colors duration-150 ps-3.5 pe-10 py-2.5 focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary cursor-pointer ${
              error
                ? 'border-algerian-500 focus:border-algerian-500 focus:ring-algerian-500'
                : 'border-border hover:border-neutral-400'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-neutral-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error ? (
          <p className="mt-1 text-xs text-algerian-600">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-neutral-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
